-- ==============================================================================
-- PRAGATI-AI Analytical Database Views Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 11_create_views.sql
-- ==============================================================================

USE pragati_ai;

-- ------------------------------------------------------------------------------
-- 1. View: v_project_latest_status
-- Returns the single most recent monthly monitoring snapshot for each project
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_latest_status;
CREATE VIEW v_project_latest_status AS
SELECT 
    p.project_id,
    p.project_code,
    p.project_name,
    m.ministry_code,
    m.ministry_name,
    s.sector_name,
    ia.agency_code,
    st.state_name,
    p.current_status,
    p.project_stage,
    p.priority_category,
    p.original_cost,
    p.approved_cost,
    p.revised_cost,
    p.planned_completion_date,
    pmd.monthly_data_id,
    pmd.reporting_month AS latest_reporting_month,
    pmd.physical_progress AS latest_physical_progress,
    pmd.financial_progress AS latest_financial_progress,
    pmd.planned_progress AS latest_planned_progress,
    (pmd.planned_progress - pmd.physical_progress) AS progress_slippage_pct,
    (pmd.financial_progress - pmd.physical_progress) AS physical_financial_gap,
    pmd.cumulative_expenditure,
    pmd.schedule_variance_days,
    pmd.cost_variance,
    pmd.milestones_planned,
    pmd.milestones_completed,
    pmd.milestones_delayed,
    pmd.manpower_count,
    pmd.remarks AS latest_remarks
FROM projects p
JOIN ministries m ON p.ministry_id = m.ministry_id
JOIN sectors s ON p.sector_id = s.sector_id
JOIN implementing_agencies ia ON p.agency_id = ia.agency_id
JOIN states st ON p.state_id = st.state_id
LEFT JOIN project_monthly_data pmd ON p.project_id = pmd.project_id
    AND pmd.reporting_month = (
        SELECT MAX(sub.reporting_month) 
        FROM project_monthly_data sub 
        WHERE sub.project_id = p.project_id
    );

-- ------------------------------------------------------------------------------
-- 2. View: v_project_risk_latest
-- Returns the latest AI model risk prediction and assessment for each project
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_risk_latest;
CREATE VIEW v_project_risk_latest AS
SELECT 
    p.project_id,
    p.project_code,
    p.project_name,
    m.ministry_code,
    s.sector_name,
    p.current_status,
    p.approved_cost,
    rp.prediction_id,
    rp.prediction_date AS latest_prediction_date,
    rp.cost_risk,
    rp.time_risk,
    rp.implementation_risk,
    rp.overall_risk,
    rp.risk_level,
    rp.predicted_final_cost,
    (rp.predicted_final_cost - p.approved_cost) AS predicted_cost_overrun_amount,
    CASE 
        WHEN p.approved_cost > 0 THEN 
            ROUND(((rp.predicted_final_cost - p.approved_cost) / p.approved_cost) * 100, 2)
        ELSE 0.00 
    END AS predicted_cost_overrun_pct,
    rp.predicted_delay_months,
    rp.predicted_completion_date,
    rp.confidence_score,
    rp.prediction_explanation,
    mv.model_name,
    mv.version_number AS model_version
FROM projects p
JOIN ministries m ON p.ministry_id = m.ministry_id
JOIN sectors s ON p.sector_id = s.sector_id
LEFT JOIN risk_predictions rp ON p.project_id = rp.project_id
    AND rp.prediction_date = (
        SELECT MAX(sub.prediction_date) 
        FROM risk_predictions sub 
        WHERE sub.project_id = p.project_id
    )
LEFT JOIN model_versions mv ON rp.model_version_id = mv.model_version_id;

-- ------------------------------------------------------------------------------
-- 3. View: v_project_risk_trend
-- Tracks multi-month risk trajectories across historical prediction cycles
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_risk_trend;
CREATE VIEW v_project_risk_trend AS
SELECT 
    rp.prediction_id,
    rp.project_id,
    p.project_code,
    p.project_name,
    m.ministry_code,
    s.sector_name,
    rp.prediction_date,
    rp.overall_risk,
    rp.cost_risk,
    rp.time_risk,
    rp.implementation_risk,
    rp.risk_level,
    rp.predicted_delay_months,
    rp.predicted_final_cost,
    LAG(rp.overall_risk, 1) OVER (PARTITION BY rp.project_id ORDER BY rp.prediction_date ASC) AS prev_month_risk,
    ROUND(rp.overall_risk - LAG(rp.overall_risk, 1) OVER (PARTITION BY rp.project_id ORDER BY rp.prediction_date ASC), 2) AS risk_acceleration
FROM risk_predictions rp
JOIN projects p ON rp.project_id = p.project_id
JOIN ministries m ON p.ministry_id = m.ministry_id
JOIN sectors s ON p.sector_id = s.sector_id;

-- ------------------------------------------------------------------------------
-- 4. View: v_project_cost_summary
-- Summarizes financial commitments, revisions, burn rate, and overruns
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_cost_summary;
CREATE VIEW v_project_cost_summary AS
SELECT 
    p.project_id,
    p.project_code,
    p.project_name,
    m.ministry_code,
    s.sector_name,
    p.original_cost,
    p.approved_cost,
    p.revised_cost,
    COALESCE(p.revised_cost, p.approved_cost) AS current_sanctioned_cost,
    CASE 
        WHEN p.revised_cost IS NOT NULL AND p.approved_cost > 0 THEN 
            ROUND(((p.revised_cost - p.approved_cost) / p.approved_cost) * 100, 2)
        ELSE 0.00 
    END AS cost_revision_escalation_pct,
    COALESCE(latest_pmd.cumulative_expenditure, 0.00) AS total_expenditure_to_date,
    (COALESCE(p.revised_cost, p.approved_cost) - COALESCE(latest_pmd.cumulative_expenditure, 0.00)) AS remaining_funds_required,
    CASE 
        WHEN COALESCE(p.revised_cost, p.approved_cost) > 0 THEN 
            ROUND((COALESCE(latest_pmd.cumulative_expenditure, 0.00) / COALESCE(p.revised_cost, p.approved_cost)) * 100, 2)
        ELSE 0.00 
    END AS budget_utilization_pct
FROM projects p
JOIN ministries m ON p.ministry_id = m.ministry_id
JOIN sectors s ON p.sector_id = s.sector_id
LEFT JOIN (
    SELECT pmd1.project_id, pmd1.cumulative_expenditure
    FROM project_monthly_data pmd1
    WHERE pmd1.reporting_month = (
        SELECT MAX(pmd2.reporting_month) 
        FROM project_monthly_data pmd2 
        WHERE pmd2.project_id = pmd1.project_id
    )
) latest_pmd ON p.project_id = latest_pmd.project_id;

-- ------------------------------------------------------------------------------
-- 5. View: v_project_delay_summary
-- Analyzes milestone bottlenecks, delay counts, and schedule variance
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_delay_summary;
CREATE VIEW v_project_delay_summary AS
SELECT 
    p.project_id,
    p.project_code,
    p.project_name,
    m.ministry_code,
    s.sector_name,
    p.current_status,
    p.planned_start_date,
    p.planned_completion_date,
    p.actual_completion_date,
    DATEDIFF(COALESCE(p.actual_completion_date, CURRENT_DATE), p.planned_completion_date) AS days_elapsed_beyond_baseline,
    COUNT(m_all.milestone_id) AS total_milestones,
    SUM(CASE WHEN m_all.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_milestones,
    SUM(CASE WHEN m_all.status = 'DELAYED' THEN 1 ELSE 0 END) AS delayed_milestones,
    SUM(CASE WHEN m_all.status = 'DELAYED' AND m_all.criticality = 'CRITICAL' THEN 1 ELSE 0 END) AS critical_delayed_milestones,
    COALESCE(MAX(m_all.delay_days), 0) AS max_milestone_delay_days,
    ROUND(COALESCE(AVG(CASE WHEN m_all.delay_days > 0 THEN m_all.delay_days ELSE NULL END), 0), 1) AS avg_delayed_days
FROM projects p
JOIN ministries m ON p.ministry_id = m.ministry_id
JOIN sectors s ON p.sector_id = s.sector_id
LEFT JOIN milestones m_all ON p.project_id = m_all.project_id
GROUP BY 
    p.project_id, p.project_code, p.project_name, m.ministry_code, s.sector_name,
    p.current_status, p.planned_start_date, p.planned_completion_date, p.actual_completion_date;

-- ------------------------------------------------------------------------------
-- 6. View: v_project_progress_summary
-- Evaluates macro physical & financial progress across sectors and ministries
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_project_progress_summary;
CREATE VIEW v_project_progress_summary AS
SELECT 
    s.sector_name,
    COUNT(p.project_id) AS total_projects,
    SUM(p.approved_cost) AS total_approved_cost_cr,
    ROUND(AVG(vls.latest_physical_progress), 2) AS avg_physical_progress,
    ROUND(AVG(vls.latest_financial_progress), 2) AS avg_financial_progress,
    ROUND(AVG(vls.physical_financial_gap), 2) AS avg_physical_financial_gap,
    SUM(CASE WHEN vrk.risk_level IN ('HIGH', 'CRITICAL') THEN 1 ELSE 0 END) AS high_risk_project_count
FROM sectors s
JOIN projects p ON s.sector_id = p.sector_id
LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
LEFT JOIN v_project_risk_latest vrk ON p.project_id = vrk.project_id
GROUP BY s.sector_name;

SELECT 'All 6 analytical database views created successfully.' AS status_message;
