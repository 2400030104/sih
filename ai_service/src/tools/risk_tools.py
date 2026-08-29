from typing import Optional, Dict, Any, List
from ai_service.src.database.db import query_db

def get_project_risk(project_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve latest risk prediction and gauge scores."""
    sql = """
    SELECT 
        rp.prediction_id,
        rp.project_id,
        rp.prediction_date,
        rp.prediction_period,
        rp.cost_risk,
        rp.time_risk,
        rp.implementation_risk,
        rp.overall_risk,
        rp.risk_level,
        rp.predicted_final_cost,
        rp.predicted_delay_months,
        rp.predicted_completion_date,
        rp.confidence_score,
        rp.prediction_explanation,
        COALESCE(mv.version_number, 'v1.2.0') as model_version
    FROM risk_predictions rp
    LEFT JOIN model_versions mv ON rp.model_version_id = mv.model_version_id
    WHERE rp.project_id = :id
    ORDER BY rp.prediction_date DESC, rp.prediction_id DESC
    LIMIT 1;
    """
    rows = query_db(sql, {"id": project_id})
    return rows[0] if rows else None

def get_risk_factors(prediction_id: int) -> List[Dict[str, Any]]:
    """Retrieve explainable SHAP / attribution risk drivers for a prediction."""
    sql = """
    SELECT 
        risk_factor_id,
        factor_name,
        factor_code,
        impact_value,
        impact_percentage,
        direction,
        rank_order,
        explanation
    FROM risk_factors
    WHERE prediction_id = :pid
    ORDER BY rank_order ASC;
    """
    return query_db(sql, {"pid": prediction_id})

def get_critical_projects() -> List[Dict[str, Any]]:
    """Retrieve all projects currently in CRITICAL risk tier."""
    sql = """
    SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        sec.sector_name,
        min.ministry_name,
        rp.overall_risk,
        rp.risk_level,
        rp.predicted_delay_months,
        rp.predicted_final_cost
    FROM projects p
    JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    LEFT JOIN ministries min ON p.ministry_id = min.ministry_id
    WHERE rp.risk_level = 'CRITICAL' OR rp.overall_risk >= 75.0
    ORDER BY rp.overall_risk DESC;
    """
    return query_db(sql)

def get_high_risk_projects() -> List[Dict[str, Any]]:
    """Retrieve all projects in HIGH or CRITICAL risk tier."""
    sql = """
    SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        sec.sector_name,
        rp.overall_risk,
        rp.risk_level,
        rp.predicted_delay_months,
        rp.predicted_final_cost
    FROM projects p
    JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    WHERE rp.risk_level IN ('CRITICAL', 'HIGH') OR rp.overall_risk >= 50.0
    ORDER BY rp.overall_risk DESC;
    """
    return query_db(sql)
