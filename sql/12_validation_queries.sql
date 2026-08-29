-- ==============================================================================
-- PRAGATI-AI Database Verification & Validation Test Suite
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 12_validation_queries.sql
-- ==============================================================================

USE pragati_ai;

-- ------------------------------------------------------------------------------
-- 1. Verify Database Exists and Collation is UTF8MB4
-- ------------------------------------------------------------------------------
SELECT 
    SCHEMA_NAME AS database_name,
    DEFAULT_CHARACTER_SET_NAME AS charset,
    DEFAULT_COLLATION_NAME AS collation
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'pragati_ai';

-- ------------------------------------------------------------------------------
-- 2. Verify All 16 Core Tables Exist with InnoDB Engine
-- ------------------------------------------------------------------------------
SELECT 
    TABLE_NAME AS table_name,
    ENGINE AS storage_engine,
    TABLE_ROWS AS approximate_rows,
    CREATE_TIME AS created_at
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'pragati_ai' AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ------------------------------------------------------------------------------
-- 3. Verify Foreign Key Referential Integrity Constraints
-- ------------------------------------------------------------------------------
SELECT 
    CONSTRAINT_NAME AS fk_name,
    TABLE_NAME AS child_table,
    COLUMN_NAME AS child_column,
    REFERENCED_TABLE_NAME AS parent_table,
    REFERENCED_COLUMN_NAME AS parent_column
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'pragati_ai' 
  AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- ------------------------------------------------------------------------------
-- 4. Verify Total Number of Projects Loaded
-- ------------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_projects,
    SUM(CASE WHEN current_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoing_count,
    SUM(CASE WHEN current_status = 'DELAYED' THEN 1 ELSE 0 END) AS delayed_count,
    SUM(CASE WHEN current_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count
FROM projects;

-- ------------------------------------------------------------------------------
-- 5. Projects Distributed by Ministry
-- ------------------------------------------------------------------------------
SELECT 
    m.ministry_code,
    m.ministry_name,
    COUNT(p.project_id) AS project_count,
    SUM(p.approved_cost) AS total_approved_cost_cr
FROM ministries m
LEFT JOIN projects p ON m.ministry_id = p.ministry_id
GROUP BY m.ministry_id, m.ministry_code, m.ministry_name
ORDER BY project_count DESC;

-- ------------------------------------------------------------------------------
-- 6. Projects Distributed by Infrastructure Sector
-- ------------------------------------------------------------------------------
SELECT 
    s.sector_code,
    s.sector_name,
    COUNT(p.project_id) AS project_count,
    SUM(p.approved_cost) AS total_approved_cost_cr
FROM sectors s
LEFT JOIN projects p ON s.sector_id = p.sector_id
GROUP BY s.sector_id, s.sector_code, s.sector_name
ORDER BY project_count DESC;

-- ------------------------------------------------------------------------------
-- 7. Projects Distributed by State & Geographic Region
-- ------------------------------------------------------------------------------
SELECT 
    st.state_name,
    st.region,
    COUNT(p.project_id) AS project_count,
    SUM(p.approved_cost) AS total_approved_cost_cr
FROM states st
LEFT JOIN projects p ON st.state_id = p.state_id
GROUP BY st.state_id, st.state_name, st.region
ORDER BY project_count DESC;

-- ------------------------------------------------------------------------------
-- 8. Macro Project Cost Totals (Original vs Approved vs Revised in Rs Crore)
-- ------------------------------------------------------------------------------
SELECT 
    COUNT(*) AS total_projects,
    SUM(original_cost) AS total_original_cost_cr,
    SUM(approved_cost) AS total_approved_cost_cr,
    SUM(COALESCE(revised_cost, approved_cost)) AS total_current_cost_cr,
    SUM(CASE WHEN revised_cost IS NOT NULL THEN (revised_cost - approved_cost) ELSE 0 END) AS net_cost_escalation_cr
FROM projects;

-- ------------------------------------------------------------------------------
-- 9. Average Physical Progress across Active Projects
-- ------------------------------------------------------------------------------
SELECT 
    ROUND(AVG(latest_physical_progress), 2) AS overall_avg_physical_progress,
    ROUND(MIN(latest_physical_progress), 2) AS min_physical_progress,
    ROUND(MAX(latest_physical_progress), 2) AS max_physical_progress
FROM v_project_latest_status
WHERE current_status != 'COMPLETED';

-- ------------------------------------------------------------------------------
-- 10. Average Financial Progress across Active Projects
-- ------------------------------------------------------------------------------
SELECT 
    ROUND(AVG(latest_financial_progress), 2) AS overall_avg_financial_progress,
    ROUND(AVG(cumulative_expenditure), 2) AS avg_cumulative_expenditure_cr
FROM v_project_latest_status
WHERE current_status != 'COMPLETED';

-- ------------------------------------------------------------------------------
-- 11. Projects with Delayed Milestones & Criticality Breakdown
-- ------------------------------------------------------------------------------
SELECT 
    p.project_code,
    p.project_name,
    vds.delayed_milestones,
    vds.critical_delayed_milestones,
    vds.max_milestone_delay_days
FROM v_project_delay_summary vds
JOIN projects p ON vds.project_id = p.project_id
WHERE vds.delayed_milestones > 0
ORDER BY vds.critical_delayed_milestones DESC, vds.max_milestone_delay_days DESC;

-- ------------------------------------------------------------------------------
-- 12. Latest Monthly Status Snapshot for Each Project
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    latest_reporting_month,
    latest_physical_progress,
    latest_financial_progress,
    progress_slippage_pct,
    schedule_variance_days
FROM v_project_latest_status
ORDER BY project_id;

-- ------------------------------------------------------------------------------
-- 13. Latest AI Risk Prediction for Each Project
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    risk_level,
    overall_risk,
    cost_risk,
    time_risk,
    confidence_score,
    latest_prediction_date
FROM v_project_risk_latest
ORDER BY overall_risk DESC;

-- ------------------------------------------------------------------------------
-- 14. Identification of High-Risk Infrastructure Projects
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    ministry_code,
    sector_name,
    overall_risk,
    risk_level,
    predicted_delay_months,
    predicted_cost_overrun_pct
FROM v_project_risk_latest
WHERE risk_level = 'HIGH'
ORDER BY overall_risk DESC;

-- ------------------------------------------------------------------------------
-- 15. Identification of Critical-Risk Infrastructure Projects
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    ministry_code,
    approved_cost,
    overall_risk,
    risk_level,
    predicted_delay_months,
    prediction_explanation
FROM v_project_risk_latest
WHERE risk_level = 'CRITICAL'
ORDER BY overall_risk DESC;

-- ------------------------------------------------------------------------------
-- 16. Projects with Escalating Risk Trajectory (Multi-Month Gradient)
-- Demonstrates the 35 -> 41 -> 49 -> 58 -> 69 -> 77 -> 84 trajectory on Project 14
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    prediction_date,
    overall_risk,
    prev_month_risk,
    risk_acceleration,
    risk_level
FROM v_project_risk_trend
WHERE project_id = 14
ORDER BY prediction_date ASC;

-- ------------------------------------------------------------------------------
-- 17. Projects with Formal Cost Escalation / Revisions
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    approved_cost,
    revised_cost,
    cost_revision_escalation_pct,
    budget_utilization_pct
FROM v_project_cost_summary
WHERE revised_cost IS NOT NULL AND revised_cost > approved_cost
ORDER BY cost_revision_escalation_pct DESC;

-- ------------------------------------------------------------------------------
-- 18. Projects with Significant Schedule Variance
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    latest_reporting_month,
    schedule_variance_days,
    progress_slippage_pct
FROM v_project_latest_status
WHERE schedule_variance_days >= 60
ORDER BY schedule_variance_days DESC;

-- ------------------------------------------------------------------------------
-- 19. Projects with Physical vs Financial Progress Divergence
-- Highlights projects where fund burning significantly exceeds ground progress
-- ------------------------------------------------------------------------------
SELECT 
    project_code,
    project_name,
    latest_physical_progress,
    latest_financial_progress,
    physical_financial_gap,
    cumulative_expenditure
FROM v_project_latest_status
WHERE physical_financial_gap >= 10.00
ORDER BY physical_financial_gap DESC;

-- ------------------------------------------------------------------------------
-- 20. Data Quality & Anomaly Detection Audit Check
-- ------------------------------------------------------------------------------
SELECT 
    p.project_code,
    p.project_name,
    CASE 
        WHEN p.planned_completion_date < p.planned_start_date THEN 'INVALID_DATES: Planned completion before start'
        WHEN p.actual_completion_date IS NOT NULL AND p.current_status != 'COMPLETED' THEN 'STATUS_MISMATCH: Actual completion present but not marked COMPLETED'
        WHEN p.current_status = 'COMPLETED' AND p.actual_completion_date IS NULL THEN 'COMPLETION_DATE_MISSING: Project marked completed without date'
        WHEN p.approved_cost <= 0 THEN 'INVALID_COST: Approved cost non-positive'
        ELSE 'VALID'
    END AS data_quality_assessment
FROM projects p;

SELECT 'All 20 validation queries completed successfully.' AS status_message;
