from typing import Dict, Any, List
from ai_service.src.database.db import query_db

def get_sector_risk_summary() -> List[Dict[str, Any]]:
    """Retrieve sector-wide aggregated risk levels and project counts."""
    sql = """
    SELECT 
        sec.sector_name,
        COUNT(p.project_id) as total_projects,
        ROUND(AVG(COALESCE(rp.overall_risk, 50.0)), 2) as avg_risk,
        SUM(CASE WHEN rp.risk_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_projects,
        SUM(CASE WHEN rp.risk_level = 'HIGH' THEN 1 ELSE 0 END) as high_risk_projects,
        COALESCE(ROUND(SUM(p.approved_cost), 2), 0.0) as total_sanctioned_cost
    FROM sectors sec
    LEFT JOIN projects p ON sec.sector_id = p.sector_id
    LEFT JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    LEFT JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id
    GROUP BY sec.sector_id, sec.sector_name
    HAVING total_projects > 0
    ORDER BY avg_risk DESC;
    """
    return query_db(sql)

def get_ministry_risk_summary() -> List[Dict[str, Any]]:
    """Retrieve ministry-wise risk ranking."""
    sql = """
    SELECT 
        min.ministry_name,
        COUNT(p.project_id) as total_projects,
        ROUND(AVG(COALESCE(rp.overall_risk, 50.0)), 2) as avg_risk,
        SUM(CASE WHEN rp.risk_level = 'CRITICAL' THEN 1 ELSE 0 END) as critical_count
    FROM ministries min
    LEFT JOIN projects p ON min.ministry_id = p.ministry_id
    LEFT JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    LEFT JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id
    GROUP BY min.ministry_id, min.ministry_name
    HAVING total_projects > 0
    ORDER BY avg_risk DESC;
    """
    return query_db(sql)

def get_dashboard_kpis() -> Dict[str, Any]:
    """Retrieve executive level summary metrics across all projects."""
    sql = """
    SELECT
        COUNT(p.project_id) as total_projects,
        COALESCE(SUM(CASE WHEN p.current_status = 'ONGOING' THEN 1 ELSE 0 END), 0) as ongoing_projects,
        COALESCE(ROUND(SUM(p.approved_cost), 2), 0.0) as total_approved_cost,
        COALESCE(SUM(CASE WHEN rp.risk_level = 'CRITICAL' THEN 1 ELSE 0 END), 0) as critical_count,
        COALESCE(SUM(CASE WHEN rp.risk_level = 'HIGH' THEN 1 ELSE 0 END), 0) as high_risk_count
    FROM projects p
    LEFT JOIN (
        SELECT project_id, MAX(prediction_id) as max_pid
        FROM risk_predictions
        GROUP BY project_id
    ) latest ON p.project_id = latest.project_id
    LEFT JOIN risk_predictions rp ON latest.max_pid = rp.prediction_id;
    """
    rows = query_db(sql)
    return rows[0] if rows else {
        'total_projects': 0,
        'ongoing_projects': 0,
        'total_approved_cost': 0.0,
        'critical_count': 0,
        'high_risk_count': 0
    }
