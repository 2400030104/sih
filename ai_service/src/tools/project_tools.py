from typing import Optional, Dict, Any, List
from ai_service.src.database.db import query_db

def get_project(project_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve full project metadata with sector, ministry, state, and agency names."""
    sql = """
    SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        p.project_description,
        p.original_cost,
        p.revised_cost,
        p.approved_cost,
        p.planned_start_date,
        p.planned_completion_date,
        p.actual_start_date,
        p.actual_completion_date,
        p.current_status,
        p.priority_category,
        sec.sector_name,
        min.ministry_name,
        st.state_name,
        ia.agency_name
    FROM projects p
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    LEFT JOIN ministries min ON p.ministry_id = min.ministry_id
    LEFT JOIN states st ON p.state_id = st.state_id
    LEFT JOIN implementing_agencies ia ON p.agency_id = ia.agency_id
    WHERE p.project_id = :id;
    """
    rows = query_db(sql, {"id": project_id})
    return rows[0] if rows else None

def get_project_by_code(project_code: str) -> Optional[Dict[str, Any]]:
    """Retrieve project by project code (e.g. PRJ-0012, NHAI-EXP-001)."""
    sql = """
    SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        p.current_status,
        sec.sector_name,
        min.ministry_name
    FROM projects p
    LEFT JOIN sectors sec ON p.sector_id = sec.sector_id
    LEFT JOIN ministries min ON p.ministry_id = min.ministry_id
    WHERE LOWER(p.project_code) = LOWER(:code)
       OR LOWER(p.project_name) LIKE LOWER(:like_code)
    LIMIT 1;
    """
    rows = query_db(sql, {"code": project_code, "like_code": f"%{project_code}%"})
    return rows[0] if rows else None

def get_project_monthly_data(project_id: int, limit: int = 6) -> List[Dict[str, Any]]:
    """Retrieve recent monthly progress tracking records."""
    sql = """
    SELECT 
        monthly_data_id,
        reporting_month,
        expenditure,
        cumulative_expenditure,
        physical_progress,
        financial_progress,
        planned_progress,
        milestones_delayed,
        schedule_variance_days,
        cost_variance,
        remarks
    FROM project_monthly_data
    WHERE project_id = :id
    ORDER BY reporting_month DESC
    LIMIT :limit;
    """
    return query_db(sql, {"id": project_id, "limit": limit})
