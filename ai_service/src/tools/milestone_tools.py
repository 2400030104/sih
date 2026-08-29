from typing import Dict, Any, List
from ai_service.src.database.db import query_db

def get_project_milestones(project_id: int) -> List[Dict[str, Any]]:
    """Retrieve all milestones for a given project."""
    sql = """
    SELECT 
        milestone_id,
        milestone_code,
        milestone_name,
        planned_date,
        revised_date,
        actual_date,
        status,
        delay_days,
        criticality
    FROM milestones
    WHERE project_id = :id
    ORDER BY planned_date ASC;
    """
    return query_db(sql, {"id": project_id})

def get_delayed_milestones(project_id: int) -> List[Dict[str, Any]]:
    """Retrieve delayed or critical path milestones for a project."""
    sql = """
    SELECT 
        milestone_id,
        milestone_code,
        milestone_name,
        planned_date,
        revised_date,
        status,
        delay_days,
        criticality
    FROM milestones
    WHERE project_id = :id AND (status = 'DELAYED' OR delay_days > 0)
    ORDER BY delay_days DESC, criticality DESC;
    """
    return query_db(sql, {"id": project_id})

def get_project_alerts(project_id: int) -> List[Dict[str, Any]]:
    """Retrieve active alerts for a project."""
    sql = """
    SELECT 
        alert_id,
        alert_type,
        severity,
        title,
        message,
        trigger_value,
        threshold_value,
        status,
        generated_at
    FROM alerts
    WHERE project_id = :id
    ORDER BY generated_at DESC
    LIMIT 10;
    """
    return query_db(sql, {"id": project_id})

def get_project_recommendations(project_id: int) -> List[Dict[str, Any]]:
    """Retrieve current recommendations for a project."""
    sql = """
    SELECT 
        recommendation_id,
        recommendation_type as category,
        priority,
        recommendation_text,
        rationale as action_plan,
        status,
        created_at
    FROM recommendations
    WHERE project_id = :id
    ORDER BY created_at DESC
    LIMIT 5;
    """
    return query_db(sql, {"id": project_id})
