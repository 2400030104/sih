import numpy as np
from typing import List, Dict, Any, Optional
from ai_service.src.database.db import query_db

def calculate_intervention_priority_queue() -> List[Dict[str, Any]]:
    """
    Computes documented, multi-factor intervention priority scores (0-100) 
    and classifies projects into P1-P4 intervention tiers.
    Includes all active, ongoing, delayed, or under-review infrastructure projects.
    """
    sql = """
    SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        p.approved_cost,
        p.original_cost,
        p.planned_start_date,
        p.planned_completion_date,
        p.current_status,
        sec.sector_name,
        min.ministry_name,
        st.state_name,
        ia.agency_name,
        COALESCE(rp.overall_risk, 45.0) as overall_risk,
        COALESCE(rp.risk_level, 'MEDIUM') as risk_level,
        COALESCE(rp.predicted_delay_months, 0.0) as predicted_delay_months,
        COALESCE(rp.predicted_final_cost, p.approved_cost) as predicted_final_cost,
        COALESCE(pmd.cumulative_expenditure, 0.0) as cumulative_expenditure,
        COALESCE(pmd.physical_progress, 0.0) as physical_progress,
        COALESCE(pmd.planned_progress, 0.0) as planned_progress,
        COALESCE(ms.total_milestones, 0) as total_milestones,
        COALESCE(ms.delayed_milestones, 0) as delayed_milestones,
        COALESCE(ms.critical_delayed, 0) as critical_delayed_milestones
    FROM projects p
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    LEFT JOIN ministries min ON p.ministry_id = min.ministry_id
    LEFT JOIN states st ON p.state_id = st.state_id
    LEFT JOIN implementing_agencies ia ON p.agency_id = ia.agency_id
    LEFT JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    LEFT JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id
    LEFT JOIN (
        SELECT 
            pmd_inner.project_id,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd_inner.cumulative_expenditure ORDER BY pmd_inner.reporting_month DESC), ',', 1) + 0 as cumulative_expenditure,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd_inner.physical_progress ORDER BY pmd_inner.reporting_month DESC), ',', 1) + 0 as physical_progress,
            SUBSTRING_INDEX(GROUP_CONCAT(pmd_inner.planned_progress ORDER BY pmd_inner.reporting_month DESC), ',', 1) + 0 as planned_progress
        FROM project_monthly_data pmd_inner
        GROUP BY pmd_inner.project_id
    ) pmd ON p.project_id = pmd.project_id
    LEFT JOIN (
        SELECT 
            project_id,
            COUNT(*) as total_milestones,
            SUM(CASE WHEN status = 'DELAYED' THEN 1 ELSE 0 END) as delayed_milestones,
            SUM(CASE WHEN status = 'DELAYED' AND criticality = 'CRITICAL' THEN 1 ELSE 0 END) as critical_delayed
        FROM milestones
        GROUP BY project_id
    ) ms ON p.project_id = ms.project_id
    WHERE p.current_status != 'COMPLETED'
    ORDER BY p.project_id;
    """

    rows = query_db(sql)
    results = []

    for r in rows:
        approved_cost = float(r["approved_cost"] or 100.0)
        predicted_final_cost = float(r["predicted_final_cost"] or approved_cost)
        overall_risk = float(r["overall_risk"] or 50.0)
        delay_months = float(r["predicted_delay_months"] or 0.0)
        phys_prog = float(r["physical_progress"] or 0.0)
        plan_prog = float(r["planned_progress"] or 0.0)
        total_ms = int(r["total_milestones"] or 1)
        crit_ms = int(r["critical_delayed_milestones"] or 0)
        delayed_ms = int(r["delayed_milestones"] or 0)

        # Factor 1: Risk Severity (0-100)
        risk_severity = float(np.clip(overall_risk, 0, 100))

        # Factor 2: Risk Acceleration / Execution Gap (0-100)
        prog_gap = max(plan_prog - phys_prog, 0.0)
        risk_acceleration = float(np.clip(prog_gap * 2.5 + (delayed_ms / max(total_ms, 1)) * 40, 0, 100))

        # Factor 3: Financial Exposure (0-100)
        cost_overrun_exposure = max(predicted_final_cost - approved_cost, 0.0)
        financial_exposure_pct = (cost_overrun_exposure / max(approved_cost, 1.0)) * 100.0
        financial_exposure = float(np.clip(financial_exposure_pct * 2.0 + (approved_cost / 5000.0) * 20, 0, 100))

        # Factor 4: Schedule Exposure (0-100)
        schedule_exposure = float(np.clip(delay_months * 4.0, 0, 100))

        # Factor 5: Critical Milestone Exposure (0-100)
        milestone_exposure = float(np.clip((crit_ms / max(total_ms, 1)) * 100.0 * 1.5, 0, 100))

        # Composite Priority Score Formula
        priority_score = round(
            0.35 * risk_severity +
            0.25 * risk_acceleration +
            0.15 * financial_exposure +
            0.15 * schedule_exposure +
            0.10 * milestone_exposure,
            2
        )

        # Determine Priority Level
        if priority_score >= 68.0 or overall_risk >= 75.0:
            priority_level = "P1"
            priority_label = "Immediate Intervention"
        elif priority_score >= 45.0 or overall_risk >= 50.0:
            priority_level = "P2"
            priority_label = "High Priority"
        elif priority_score >= 25.0:
            priority_level = "P3"
            priority_label = "Monitor Closely"
        else:
            priority_level = "P4"
            priority_label = "Routine Monitoring"

        # Identify Primary Concern & Recommended Action
        if crit_ms > 0:
            primary_concern = f"{crit_ms} critical milestone(s) delayed on critical path."
            recommended_action = "Convene immediate contractor review for Milestone Recovery Schedule (MRS)."
        elif prog_gap > 12:
            primary_concern = f"Execution lag of {prog_gap:.1f}% against planned physical schedule."
            recommended_action = "Deploy parallel package acceleration and additional equipment."
        elif cost_overrun_exposure > 200:
            primary_concern = f"Projected cost escalation of ₹{cost_overrun_exposure:.1f} Cr over sanction."
            recommended_action = "Initiate departmental value engineering and contract variance audit."
        elif delay_months > 6:
            primary_concern = f"Anticipated commissioning delay of {delay_months:.1f} months."
            recommended_action = "Institute double-shift civil works on critical structures."
        else:
            primary_concern = "Steady progress within acceptable monitoring tolerance."
            recommended_action = "Continue standard monthly milestone verification."

        risk_trend = "ACCELERATING" if risk_acceleration > 40 else ("STABLE" if risk_acceleration > 15 else "DECELERATING")

        results.append({
            "projectId": r["project_id"],
            "projectCode": r["project_code"],
            "projectName": r["project_name"],
            "sector": r["sector_name"] or "General Infra",
            "ministry": r["ministry_name"] or "Central Ministry",
            "state": r["state_name"] or "National",
            "agency": r["agency_name"] or "Executing Agency",
            "priority": priority_level,
            "priorityLabel": priority_label,
            "priorityScore": priority_score,
            "overallRisk": round(overall_risk, 1),
            "riskLevel": r["risk_level"],
            "riskTrend": risk_trend,
            "financialExposure": round(cost_overrun_exposure, 2),
            "scheduleExposureMonths": round(delay_months, 1),
            "physicalProgress": round(phys_prog, 1),
            "plannedProgress": round(plan_prog, 1),
            "criticalMilestonesDelayed": crit_ms,
            "primaryConcern": primary_concern,
            "recommendedAction": recommended_action,
            "breakdown": {
                "riskSeverity": round(risk_severity, 1),
                "riskAcceleration": round(risk_acceleration, 1),
                "financialExposureScore": round(financial_exposure, 1),
                "scheduleExposureScore": round(schedule_exposure, 1),
                "milestoneExposureScore": round(milestone_exposure, 1)
            }
        })

    # Sort descending by priority score
    results.sort(key=lambda x: x["priorityScore"], reverse=True)
    for idx, item in enumerate(results, start=1):
        item["rank"] = idx

    return results

def get_project_intervention_details(project_id: int) -> Optional[Dict[str, Any]]:
    """Returns intervention priority metrics for a single project."""
    queue = calculate_intervention_priority_queue()
    for item in queue:
        if item["projectId"] == project_id:
            return item
    return None
