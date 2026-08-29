import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
from ml_service.data.feature_extractor import extract_single_project_features

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'ml_service', 'trained_artifacts'))

def load_ml_models():
    """Load serialized Phase 4 ML models from disk."""
    cost_model_path = os.path.join(ARTIFACTS_DIR, 'cost_overrun_model.joblib')
    time_model_path = os.path.join(ARTIFACTS_DIR, 'time_overrun_model.joblib')
    risk_model_path = os.path.join(ARTIFACTS_DIR, 'risk_scoring_model.joblib')

    if not (os.path.exists(cost_model_path) and os.path.exists(time_model_path) and os.path.exists(risk_model_path)):
        # If artifacts are missing, trigger on-the-fly training
        from ml_service.pipelines.train_pipeline import run_training_pipeline
        run_training_pipeline()

    cost_model = joblib.load(cost_model_path)
    time_model = joblib.load(time_model_path)
    risk_model = joblib.load(risk_model_path)

    return cost_model, time_model, risk_model

def simulate_project_scenario(project_id: int, changes: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes What-If scenario simulation using actual Phase 4 ML predictive models.
    Operates strictly on an in-memory copy of the feature vector without touching MySQL records.
    """
    base_features = extract_single_project_features(project_id)
    if base_features is None:
        raise ValueError(f"Project #{project_id} not found in monitoring database.")

    cost_model, time_model, risk_model = load_ml_models()

    # 1. Compute Base Case Prediction
    base_cost_pred = cost_model.predict_single(base_features)
    base_time_pred = time_model.predict_single(base_features)
    base_risk_scores = risk_model.predict_risk_scores(
        base_features,
        cost_risk=base_cost_pred["cost_risk_score"],
        schedule_risk=base_time_pred["schedule_risk_score"]
    )

    base_output = {
        "overallRisk": round(base_risk_scores["overall_risk_score"], 1),
        "riskLevel": base_risk_scores["risk_level"],
        "predictedDelayMonths": round(base_time_pred["predicted_delay_months"], 1),
        "predictedCompletionDate": base_time_pred["predicted_completion_date"],
        "predictedFinalCost": round(base_cost_pred["predicted_final_cost"], 2),
        "costOverrunPct": round(base_cost_pred["predicted_cost_overrun_pct"], 1)
    }

    # 2. Construct Modified Feature Vector
    scenario_features = base_features.copy()

    # Controlled inputs
    monthly_progress_increase = float(changes.get("monthlyProgressIncrease") or 0.0)
    milestone_delay_reduction = float(changes.get("milestoneDelayReduction") or 0.0)
    expenditure_efficiency_pct = float(changes.get("expenditureEfficiencyPct") or 0.0)

    # Apply adjustments to in-memory feature vector
    current_phys = float(scenario_features.get("latest_physical_progress", 0.0))
    new_phys = min(current_phys + monthly_progress_increase * 2.0, 100.0)
    scenario_features["latest_physical_progress"] = new_phys

    plan_prog = float(scenario_features.get("latest_planned_progress", 0.0))
    scenario_features["progress_gap"] = max(plan_prog - new_phys, 0.0)

    current_avg_delay = float(scenario_features.get("avg_milestone_delay_days", 0.0))
    new_avg_delay = max(current_avg_delay - milestone_delay_reduction, 0.0)
    scenario_features["avg_milestone_delay_days"] = new_avg_delay

    if milestone_delay_reduction > 15:
        crit_delayed = int(scenario_features.get("critical_delayed_milestones", 0))
        scenario_features["critical_delayed_milestones"] = max(crit_delayed - 1, 0)
        tot_delayed = int(scenario_features.get("delayed_milestones", 0))
        scenario_features["delayed_milestones"] = max(tot_delayed - 1, 0)

    elapsed_m = max(float(scenario_features.get("elapsed_duration_months", 1.0)), 1.0)
    scenario_features["progress_velocity"] = round(new_phys / elapsed_m, 2)

    # 3. Pass Modified Feature Vector through ML Models
    scenario_cost_pred = cost_model.predict_single(scenario_features)
    scenario_time_pred = time_model.predict_single(scenario_features)
    scenario_risk_scores = risk_model.predict_risk_scores(
        scenario_features,
        cost_risk=scenario_cost_pred["cost_risk_score"],
        schedule_risk=scenario_time_pred["schedule_risk_score"]
    )

    scenario_output = {
        "overallRisk": round(scenario_risk_scores["overall_risk_score"], 1),
        "riskLevel": scenario_risk_scores["risk_level"],
        "predictedDelayMonths": round(scenario_time_pred["predicted_delay_months"], 1),
        "predictedCompletionDate": scenario_time_pred["predicted_completion_date"],
        "predictedFinalCost": round(scenario_cost_pred["predicted_final_cost"], 2),
        "costOverrunPct": round(scenario_cost_pred["predicted_cost_overrun_pct"], 1)
    }

    # 4. Compute Deltas & Insights
    risk_delta = round(scenario_output["overallRisk"] - base_output["overallRisk"], 1)
    delay_delta = round(scenario_output["predictedDelayMonths"] - base_output["predictedDelayMonths"], 1)
    cost_delta = round(scenario_output["predictedFinalCost"] - base_output["predictedFinalCost"], 2)

    return {
        "projectId": project_id,
        "projectCode": base_features.get("project_code"),
        "projectName": base_features.get("project_name"),
        "inputChanges": {
            "monthlyProgressIncrease": monthly_progress_increase,
            "milestoneDelayReductionDays": milestone_delay_reduction,
            "expenditureEfficiencyPct": expenditure_efficiency_pct
        },
        "baseCase": base_output,
        "scenario": scenario_output,
        "delta": {
            "riskChange": risk_delta,
            "delayChangeMonths": delay_delta,
            "costChangeCr": cost_delta,
            "improved": (risk_delta < 0 or delay_delta < 0)
        },
        "modelVersion": "PRAGATI-ML-v1.2-GBR",
        "limitation": "Model-estimated scenario. Illustrative projection for decision support, not an official government forecast."
    }
