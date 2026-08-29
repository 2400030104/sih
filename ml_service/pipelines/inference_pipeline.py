import os
import joblib
from datetime import datetime
from sqlalchemy import text
import pandas as pd

from ml_service.config.db_config import get_db_engine
from ml_service.data.feature_extractor import extract_project_dataset, extract_single_project_features
from ml_service.models.cost_overrun_model import CostOverrunModel
from ml_service.models.time_overrun_model import TimeOverrunModel
from ml_service.models.risk_scoring_model import RiskScoringModel
from ml_service.models.explainability import ExplainabilityEngine
from ml_service.pipelines.train_pipeline import run_training_pipeline

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'trained_artifacts')

_models_cache = None

def get_trained_models():
    """
    Load serialized model artifacts or auto-train if missing
    """
    global _models_cache
    if _models_cache is not None:
        return _models_cache

    cost_path = os.path.join(ARTIFACTS_DIR, 'cost_overrun_model.joblib')
    time_path = os.path.join(ARTIFACTS_DIR, 'time_overrun_model.joblib')
    risk_path = os.path.join(ARTIFACTS_DIR, 'risk_scoring_model.joblib')

    if not (os.path.exists(cost_path) and os.path.exists(time_path) and os.path.exists(risk_path)):
        print("[Inference] Model artifacts not found on disk. Initiating training pipeline...")
        run_training_pipeline()

    cost_model = joblib.load(cost_path)
    time_model = joblib.load(time_path)
    risk_model = joblib.load(risk_path)
    explain_engine = ExplainabilityEngine(cost_model, time_model, risk_model)

    _models_cache = {
        'cost_model': cost_model,
        'time_model': time_model,
        'risk_model': risk_model,
        'explain_engine': explain_engine
    }
    return _models_cache

def predict_and_persist_project(project_id: int, model_version_id: int = 3):
    """
    Run full predictive inference for a single project and persist to MySQL
    """
    models = get_trained_models()
    row = extract_single_project_features(project_id)
    if row is None:
        raise ValueError(f"Project with ID {project_id} not found in database.")

    # 1. Cost Overrun Prediction
    cost_pred = models['cost_model'].predict_single(row)
    
    # 2. Time Overrun Prediction
    time_pred = models['time_model'].predict_single(row)

    # 3. Multi-Gauge Risk Synthesis
    risk_pred = models['risk_model'].predict_risk_scores(
        row,
        cost_pred['cost_risk_score'],
        time_pred['schedule_risk_score']
    )

    # 4. Explainable SHAP Drivers
    factors = models['explain_engine'].explain_project_risk(row, risk_pred)

    # 5. Persist to MySQL
    engine = get_db_engine()
    now_dt = datetime.now().strftime('%Y-%m-%d')
    explanation_summary = f"PRAGATI-AI predictive engine estimates {cost_pred['predicted_cost_overrun_pct']}% cost overrun and {time_pred['predicted_delay_months']} months schedule slippage. Risk classified as {risk_pred['risk_level']}."

    insert_prediction_sql = text("""
    INSERT INTO risk_predictions (
        project_id, model_version_id, prediction_date, prediction_period,
        cost_risk, time_risk, implementation_risk, overall_risk,
        risk_level, predicted_final_cost, predicted_delay_months,
        predicted_completion_date, confidence_score, prediction_explanation
    ) VALUES (
        :project_id, :model_version_id, :prediction_date, :prediction_period,
        :cost_risk, :time_risk, :implementation_risk, :overall_risk,
        :risk_level, :predicted_final_cost, :predicted_delay_months,
        :predicted_completion_date, :confidence_score, :prediction_explanation
    );
    """)

    insert_factor_sql = text("""
    INSERT INTO risk_factors (
        prediction_id, factor_name, factor_code, impact_value,
        impact_percentage, direction, rank_order, explanation
    ) VALUES (
        :prediction_id, :factor_name, :factor_code, :impact_value,
        :impact_percentage, :direction, :rank_order, :explanation
    );
    """)

    with engine.begin() as conn:
        result = conn.execute(insert_prediction_sql, {
            'project_id': project_id,
            'model_version_id': model_version_id,
            'prediction_date': now_dt,
            'prediction_period': 'MONTHLY',
            'cost_risk': risk_pred['cost_risk_score'],
            'time_risk': risk_pred['schedule_risk_score'],
            'implementation_risk': risk_pred['contractor_risk_score'],
            'overall_risk': risk_pred['overall_risk_score'],
            'risk_level': risk_pred['risk_level'],
            'predicted_final_cost': cost_pred['predicted_final_cost'],
            'predicted_delay_months': time_pred['predicted_delay_months'],
            'predicted_completion_date': time_pred['predicted_completion_date'],
            'confidence_score': 88.50,
            'prediction_explanation': explanation_summary
        })
        prediction_id = result.lastrowid

        for factor in factors:
            conn.execute(insert_factor_sql, {
                'prediction_id': prediction_id,
                'factor_name': factor['factor_name'],
                'factor_code': factor['factor_code'],
                'impact_value': factor['impact_value'],
                'impact_percentage': factor['impact_percentage'],
                'direction': factor['direction'],
                'rank_order': factor['rank_order'],
                'explanation': factor['explanation']
            })

    return {
        'prediction_id': prediction_id,
        'project_id': project_id,
        'project_code': row.get('project_code'),
        'project_name': row.get('project_name'),
        'cost_prediction': cost_pred,
        'time_prediction': time_pred,
        'risk_scores': risk_pred,
        'risk_factors': factors,
        'model_version_id': model_version_id,
        'predicted_at': now_dt
    }

def predict_and_persist_batch():
    """
    Run predictive scoring for all active projects and persist results
    """
    df = extract_project_dataset()
    results = []
    for _, row in df.iterrows():
        try:
            pid = int(row['project_id'])
            res = predict_and_persist_project(pid)
            results.append(res)
        except Exception as e:
            print(f"[Batch Prediction Error] Project {row.get('project_id')}: {e}")
    return results
