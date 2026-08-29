from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ai_service.src.api.schemas import CopilotChatRequest, CopilotChatResponse, ScenarioSimulateRequest
from ai_service.src.llm.client import CopilotEngine
from ai_service.src.decision.priority import calculate_intervention_priority_queue, get_project_intervention_details
from ai_service.src.decision.recommendations import generate_structured_recommendations
from ai_service.src.decision.scenarios import simulate_project_scenario
from ai_service.src.tools.project_tools import get_project, get_project_monthly_data
from ai_service.src.tools.risk_tools import get_project_risk, get_risk_factors
from ai_service.src.tools.milestone_tools import get_delayed_milestones, get_project_alerts

router = APIRouter()
_copilot_engine = None

def get_engine():
    global _copilot_engine
    if _copilot_engine is None:
        _copilot_engine = CopilotEngine()
    return _copilot_engine

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "PRAGATI-AI Decision Support & Copilot Microservice",
        "version": "v1.2.0",
        "ragVectorStore": "loaded"
    }

@router.post("/copilot/chat", response_model=CopilotChatResponse)
def copilot_chat(req: CopilotChatRequest):
    try:
        engine = get_engine()
        res = engine.generate_grounded_response(req.message, req.projectId)
        res["projectId"] = req.projectId
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Copilot inference error: {str(e)}")

@router.post("/copilot/project-summary/{project_id}")
def generate_project_summary(project_id: int):
    proj = get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail=f"Project #{project_id} not found")

    risk = get_project_risk(project_id) or {}
    monthly = get_project_monthly_data(project_id, limit=1)
    delayed_ms = get_delayed_milestones(project_id)
    factors = get_risk_factors(risk.get("prediction_id", 0)) if risk else []
    recs = generate_structured_recommendations(project_id)
    intervention = get_project_intervention_details(project_id)

    latest_m = monthly[0] if monthly else {}
    phys_prog = float(latest_m.get("physical_progress") or 0.0)
    plan_prog = float(latest_m.get("planned_progress") or 0.0)
    fin_prog = float(latest_m.get("financial_progress") or 0.0)
    spend = float(latest_m.get("cumulative_expenditure") or 0.0)

    overall_risk = float(risk.get("overall_risk") or 45.0)
    risk_level = risk.get("risk_level") or "MEDIUM"
    pred_delay = float(risk.get("predicted_delay_months") or 0.0)
    pred_cost = float(risk.get("predicted_final_cost") or proj["approved_cost"])
    sanctioned_cost = float(proj["approved_cost"] or 100.0)

    exec_summary = (
        f"Project {proj['project_code']} ({proj['project_name']}) is currently in execution with "
        f"{phys_prog:.1f}% physical progress against a planned target of {plan_prog:.1f}%. "
        f"Model-estimated risk is {risk_level} ({overall_risk:.1f}/100) with an estimated completion "
        f"delay of {pred_delay:.1f} months and projected final cost of ₹{pred_cost:.1f} Cr."
    )

    return {
        "projectId": project_id,
        "projectCode": proj["project_code"],
        "projectName": proj["project_name"],
        "sector": proj["sector_name"],
        "ministry": proj["ministry_name"],
        "agency": proj["agency_name"],
        "executiveSummary": exec_summary,
        "currentStatus": proj["current_status"],
        "priority": intervention.get("priority", "P3") if intervention else "P3",
        "priorityLabel": intervention.get("priorityLabel", "Monitor Closely") if intervention else "Monitor Closely",
        "financialStatus": {
            "sanctionedCostCr": sanctioned_cost,
            "cumulativeExpenditureCr": spend,
            "financialProgressPct": fin_prog,
            "predictedFinalCostCr": pred_cost,
            "predictedCostOverrunCr": max(pred_cost - sanctioned_cost, 0.0)
        },
        "scheduleStatus": {
            "plannedCompletionDate": str(proj["planned_completion_date"]),
            "predictedDelayMonths": pred_delay,
            "predictedCompletionDate": str(risk.get("predicted_completion_date", proj["planned_completion_date"])),
            "physicalProgressPct": phys_prog,
            "plannedProgressPct": plan_prog,
            "progressGapPct": round(plan_prog - phys_prog, 1)
        },
        "riskAssessment": {
            "overallRiskScore": overall_risk,
            "riskLevel": risk_level,
            "costRisk": risk.get("cost_risk", 50.0),
            "timeRisk": risk.get("time_risk", 50.0),
            "implementationRisk": risk.get("implementation_risk", 50.0)
        },
        "majorRiskFactors": factors[:4],
        "criticalMilestones": delayed_ms[:4],
        "recommendedActions": recs[:3]
    }

@router.get("/interventions")
def get_intervention_queue():
    queue = calculate_intervention_priority_queue()
    return {
        "count": len(queue),
        "queue": queue
    }

@router.get("/interventions/{project_id}")
def get_single_project_intervention(project_id: int):
    item = get_project_intervention_details(project_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Intervention metrics for Project #{project_id} not found")
    return item

@router.post("/recommendations/generate/{project_id}")
def generate_recommendations(project_id: int):
    recs = generate_structured_recommendations(project_id)
    return {
        "projectId": project_id,
        "count": len(recs),
        "recommendations": recs
    }

@router.post("/scenarios/simulate")
def simulate_scenario(req: ScenarioSimulateRequest):
    try:
        res = simulate_project_scenario(req.projectId, req.changes)
        return res
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
