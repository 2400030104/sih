import pandas as pd
import numpy as np
from sqlalchemy import text
from ml_service.config.db_config import get_db_engine

def extract_project_dataset():
    """
    Extract comprehensive features for all projects in MySQL pragati_ai
    """
    engine = get_db_engine()

    query = """
    SELECT
        p.project_id,
        p.project_code,
        p.project_name,
        p.sector_id,
        p.ministry_id,
        p.agency_id,
        p.state_id,
        p.current_status,
        COALESCE(p.original_cost, p.approved_cost, 0.00) AS original_sanctioned_cost,
        COALESCE(p.revised_cost, p.approved_cost, p.original_cost, 0.00) AS revised_approved_cost,
        COALESCE(p.planned_start_date, p.actual_start_date, '2020-01-01') AS original_start_date,
        COALESCE(p.planned_completion_date, '2025-12-31') AS planned_completion_date,
        COALESCE(p.actual_completion_date, p.planned_completion_date, '2026-12-31') AS revised_completion_date,
        COALESCE(m.latest_reporting_month, CURDATE()) AS latest_reporting_month,
        COALESCE(m.latest_physical_progress, 0.00) AS latest_physical_progress,
        COALESCE(m.latest_financial_progress, 0.00) AS latest_financial_progress,
        COALESCE(m.latest_planned_progress, 0.00) AS latest_planned_progress,
        COALESCE(m.cumulative_expenditure, 0.00) AS cumulative_expenditure,
        COALESCE(ms.total_milestones, 0) AS total_milestones,
        COALESCE(ms.completed_milestones, 0) AS completed_milestones,
        COALESCE(ms.delayed_milestones, 0) AS delayed_milestones,
        COALESCE(ms.critical_delayed_milestones, 0) AS critical_delayed_milestones,
        COALESCE(ms.avg_milestone_delay_days, 0) AS avg_milestone_delay_days,
        sec.sector_name AS sector,
        min.ministry_name AS ministry,
        st.state_name AS location_state
    FROM projects p
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    LEFT JOIN ministries min ON p.ministry_id = min.ministry_id
    LEFT JOIN states st ON p.state_id = st.state_id
    LEFT JOIN (
        SELECT 
            pmd.project_id,
            MAX(pmd.reporting_month) as latest_reporting_month,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd.physical_progress ORDER BY pmd.reporting_month DESC), ',', 1) + 0 as latest_physical_progress,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd.financial_progress ORDER BY pmd.reporting_month DESC), ',', 1) + 0 as latest_financial_progress,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd.planned_progress ORDER BY pmd.reporting_month DESC), ',', 1) + 0 as latest_planned_progress,
            SUBSTRING_INDEX(GROUP_CONCAT(COALESCE(pmd.cumulative_expenditure, pmd.expenditure, 0) ORDER BY pmd.reporting_month DESC), ',', 1) + 0 as cumulative_expenditure
        FROM project_monthly_data pmd
        GROUP BY pmd.project_id
    ) m ON p.project_id = m.project_id
    LEFT JOIN (
        SELECT 
            mil.project_id,
            COUNT(*) as total_milestones,
            SUM(CASE WHEN mil.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_milestones,
            SUM(CASE WHEN mil.status = 'DELAYED' THEN 1 ELSE 0 END) as delayed_milestones,
            SUM(CASE WHEN mil.status = 'DELAYED' AND mil.criticality = 'CRITICAL' THEN 1 ELSE 0 END) as critical_delayed_milestones,
            AVG(CASE WHEN mil.delay_days > 0 THEN mil.delay_days ELSE 0 END) as avg_milestone_delay_days
        FROM milestones mil
        GROUP BY mil.project_id
    ) ms ON p.project_id = ms.project_id
    ORDER BY p.project_id;
    """

    with engine.connect() as conn:
        df = pd.read_sql(text(query), conn)

    # Impute categorical names if NULL
    df['sector'] = df['sector'].fillna('General Infrastructure')
    df['ministry'] = df['ministry'].fillna('Central Ministry')
    df['location_state'] = df['location_state'].fillna('National')

    # Compute Feature Engineering Variables
    df['sanctioned_cost'] = df['original_sanctioned_cost'].astype(float)
    df['revised_cost'] = df['revised_approved_cost'].astype(float)
    
    # 1. Cost Revision Ratio
    df['cost_revision_ratio'] = df['revised_cost'] / np.maximum(df['sanctioned_cost'], 1.0)
    
    # 2. Planned Duration (months)
    start_dt = pd.to_datetime(df['original_start_date'])
    planned_end_dt = pd.to_datetime(df['planned_completion_date'])
    revised_end_dt = pd.to_datetime(df['revised_completion_date'])
    latest_rep_dt = pd.to_datetime(df['latest_reporting_month'])

    df['planned_duration_months'] = np.maximum(
        ((planned_end_dt - start_dt).dt.days / 30.4375), 1.0
    ).round(2)

    df['elapsed_duration_months'] = np.maximum(
        ((latest_rep_dt - start_dt).dt.days / 30.4375), 0.0
    ).round(2)

    df['schedule_elapsed_ratio'] = np.clip(
        df['elapsed_duration_months'] / df['planned_duration_months'], 0.0, 3.0
    ).round(4)

    # 3. Physical / Planned / Financial Gaps
    df['latest_physical_progress'] = df['latest_physical_progress'].astype(float)
    df['latest_financial_progress'] = df['latest_financial_progress'].astype(float)
    df['latest_planned_progress'] = df['latest_planned_progress'].astype(float)

    df['progress_gap'] = (df['latest_planned_progress'] - df['latest_physical_progress']).round(2)
    df['physical_financial_gap'] = (df['latest_financial_progress'] - df['latest_physical_progress']).round(2)
    df['expenditure_rate'] = np.clip(
        (df['latest_financial_progress'] / 100.0), 0.0, 2.0
    ).round(4)

    # 4. Milestone Delay Metrics
    df['total_milestones'] = df['total_milestones'].astype(int)
    df['delayed_milestones'] = df['delayed_milestones'].astype(int)
    df['critical_delayed_milestones'] = df['critical_delayed_milestones'].astype(int)
    df['delayed_milestones_ratio'] = (
        df['delayed_milestones'] / np.maximum(df['total_milestones'], 1)
    ).round(4)
    df['avg_milestone_delay_days'] = df['avg_milestone_delay_days'].astype(float).round(1)

    # 5. Progress Velocity (Approx from elapsed months & physical progress)
    df['progress_velocity'] = np.where(
        df['elapsed_duration_months'] > 0,
        (df['latest_physical_progress'] / df['elapsed_duration_months']).round(2),
        1.0
    )

    # 6. Targets:
    # Ground-truth cost overrun percentage
    df['target_cost_overrun_pct'] = (
        ((df['revised_cost'] - df['sanctioned_cost']) / np.maximum(df['sanctioned_cost'], 1.0)) * 100.0
    ).round(2)
    
    # Ground-truth delay months
    df['target_delay_months'] = np.maximum(
        ((revised_end_dt - planned_end_dt).dt.days / 30.4375), 0.0
    ).round(2)

    # Composite Ground-Truth Risk Score (0-100)
    cost_risk_component = np.clip(df['target_cost_overrun_pct'] * 1.5, 0, 100)
    delay_risk_component = np.clip(df['target_delay_months'] * 3.0, 0, 100)
    gap_risk_component = np.clip(df['progress_gap'] * 2.0 + df['delayed_milestones_ratio'] * 40, 0, 100)
    
    df['target_overall_risk'] = (
        0.35 * cost_risk_component + 0.35 * delay_risk_component + 0.30 * gap_risk_component
    ).clip(5, 95).round(2)

    # Risk Tier classification
    conditions = [
        (df['target_overall_risk'] >= 75.0),
        (df['target_overall_risk'] >= 50.0),
        (df['target_overall_risk'] >= 25.0)
    ]
    choices = ['CRITICAL', 'HIGH', 'MEDIUM']
    df['target_risk_level'] = np.select(conditions, choices, default='LOW')

    return df

def extract_single_project_features(project_id: int):
    """
    Extract features for a specific project_id for real-time inference
    """
    df = extract_project_dataset()
    project_df = df[df['project_id'] == project_id]
    if project_df.empty:
        return None
    return project_df.iloc[0]
