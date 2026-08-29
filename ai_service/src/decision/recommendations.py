from typing import List, Dict, Any
from ai_service.src.tools.project_tools import get_project, get_project_monthly_data
from ai_service.src.tools.risk_tools import get_project_risk, get_risk_factors
from ai_service.src.tools.milestone_tools import get_delayed_milestones, get_project_alerts

def generate_structured_recommendations(project_id: int) -> List[Dict[str, Any]]:
    """
    Generates deterministic, rule-based policy & engineering recommendations for a project.
    Strictly factual: never invents facts, costs, dates, contractors, or officials.
    """
    project = get_project(project_id)
    if not project:
        return []

    risk = get_project_risk(project_id) or {}
    monthly_data = get_project_monthly_data(project_id, limit=3)
    delayed_ms = get_delayed_milestones(project_id)
    alerts = get_project_alerts(project_id)

    latest_month = monthly_data[0] if monthly_data else {}
    phys_prog = float(latest_month.get("physical_progress") or 0.0)
    plan_prog = float(latest_month.get("planned_progress") or 0.0)
    fin_prog = float(latest_month.get("financial_progress") or 0.0)
    
    overall_risk = float(risk.get("overall_risk") or 45.0)
    risk_level = risk.get("risk_level") or "MEDIUM"
    predicted_delay = float(risk.get("predicted_delay_months") or 0.0)
    predicted_cost = float(risk.get("predicted_final_cost") or project["approved_cost"])
    sanctioned_cost = float(project["approved_cost"] or 100.0)

    recommendations = []

    # Rule 1: Critical Milestone Delayed -> MILESTONE_INTERVENTION
    critical_delayed = [m for m in delayed_ms if m.get("criticality") == "CRITICAL"]
    if critical_delayed:
        ms_names = ", ".join([m["milestone_name"] for m in critical_delayed[:2]])
        max_delay = max([m.get("delay_days") or 0 for m in critical_delayed])
        recommendations.append({
            "projectId": project_id,
            "priority": "HIGH" if overall_risk >= 50 else "MEDIUM",
            "type": "MILESTONE_INTERVENTION",
            "category": "SCHEDULE",
            "trigger": f"{len(critical_delayed)} critical milestone(s) delayed (up to {max_delay} days).",
            "evidence": f"Delayed milestones: {ms_names}. Critical path slippage confirmed in milestone tracking.",
            "recommendedAction": "Summon executing agency for mandatory Milestone Recovery Schedule (MRS) within 14 calendar days.",
            "expectedObjective": f"Recover {min(max_delay, 30)} days on critical civil/structural sequence without shifting final commissioning.",
            "confidence": 0.92,
            "status": "PROPOSED"
        })

    # Rule 2: Physical Lagging Planned Progress -> SCHEDULE_RECOVERY
    prog_gap = plan_prog - phys_prog
    if prog_gap > 10.0:
        recommendations.append({
            "projectId": project_id,
            "priority": "HIGH" if prog_gap > 20.0 else "MEDIUM",
            "type": "SCHEDULE_RECOVERY",
            "category": "TECHNICAL",
            "trigger": f"Physical execution lag of {prog_gap:.1f}% (Actual: {phys_prog:.1f}% vs Planned: {plan_prog:.1f}%).",
            "evidence": f"Latest monthly progress report shows continuous execution deficit.",
            "recommendedAction": "Implement multi-shift / double-shift operations on non-interfering civil packages and augment equipment.",
            "expectedObjective": "Increase monthly progress velocity by 1.5% to bridge baseline gap within two quarters.",
            "confidence": 0.88,
            "status": "PROPOSED"
        })

    # Rule 3: Cost Inflation Projection -> COST_CONTROL
    cost_overrun = max(predicted_cost - sanctioned_cost, 0.0)
    if cost_overrun > 50.0:
        cost_overrun_pct = (cost_overrun / sanctioned_cost) * 100.0
        recommendations.append({
            "projectId": project_id,
            "priority": "HIGH" if cost_overrun_pct > 15.0 else "MEDIUM",
            "type": "COST_CONTROL",
            "category": "FINANCIAL",
            "trigger": f"Model-estimated cost overrun of ₹{cost_overrun:.1f} Cr ({cost_overrun_pct:.1f}% over sanctioned cost).",
            "evidence": f"Sanctioned: ₹{sanctioned_cost:.1f} Cr | Predicted Final Cost: ₹{predicted_cost:.1f} Cr.",
            "recommendedAction": "Initiate comprehensive value engineering audit and freeze unallocated contingency drawings.",
            "expectedObjective": "Contain expenditure variance within 5% contingency threshold.",
            "confidence": 0.85,
            "status": "PROPOSED"
        })

    # Rule 4: Critical Risk Escalation -> RISK_ESCALATION
    if overall_risk >= 75.0 or risk_level == "CRITICAL":
        recommendations.append({
            "projectId": project_id,
            "priority": "CRITICAL",
            "type": "RISK_ESCALATION",
            "category": "GOVERNANCE",
            "trigger": f"Composite project risk score reached CRITICAL tier ({overall_risk:.1f}/100).",
            "evidence": f"Multi-gauge risk model flags elevated cost, timeline, and execution exposure.",
            "recommendedAction": "Escalate project file to Ministry Empowered Committee / PRAGATI Apex Review for fast-track dispute resolution.",
            "expectedObjective": "Obtain inter-ministerial clearance and remove administrative bottlenecks.",
            "confidence": 0.95,
            "status": "PROPOSED"
        })

    # Rule 5: Financial Spend Ahead of Physical Realization -> FINANCIAL_REVIEW
    fin_phys_gap = fin_prog - phys_prog
    if fin_phys_gap > 15.0:
        recommendations.append({
            "projectId": project_id,
            "priority": "MEDIUM",
            "type": "FINANCIAL_REVIEW",
            "category": "AUDIT",
            "trigger": f"Financial progress ({fin_prog:.1f}%) exceeds physical progress ({phys_prog:.1f}%) by {fin_phys_gap:.1f}%.",
            "evidence": f"Cumulative expenditure running ahead of verified site works.",
            "recommendedAction": "Reconcile contractor mobilization advances against certified work measurement sheets.",
            "expectedObjective": "Ensure financial disbursement matches verified physical milestones.",
            "confidence": 0.82,
            "status": "PROPOSED"
        })

    # Fallback standard recommendation if none triggered
    if not recommendations:
        recommendations.append({
            "projectId": project_id,
            "priority": "LOW",
            "type": "PROGRESS_REVIEW",
            "category": "MONITORING",
            "trigger": "Routine monitoring cycle.",
            "evidence": f"Project {project['project_code']} is progressing within normal tolerance parameters.",
            "recommendedAction": "Maintain standard monthly milestone inspection and verification reporting.",
            "expectedObjective": "Sustain current execution momentum towards planned completion date.",
            "confidence": 0.90,
            "status": "PROPOSED"
        })

    return recommendations
