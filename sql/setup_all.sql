-- ==============================================================================
-- PRAGATI-AI Master Execution Pipeline Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: setup_all.sql
-- ==============================================================================

-- Instructions:
-- Execute this master script or execute files 01 through 12 sequentially.

SOURCE 01_create_database.sql;
SOURCE 02_create_tables.sql;
SOURCE 03_create_indexes.sql;
SOURCE 04_insert_master_data.sql;
SOURCE 05_insert_demo_projects.sql;
SOURCE 06_insert_demo_monthly_data.sql;
SOURCE 07_insert_demo_milestones.sql;
SOURCE 08_insert_demo_predictions.sql;
SOURCE 09_insert_demo_alerts.sql;
SOURCE 10_insert_demo_recommendations.sql;
SOURCE 11_create_views.sql;
SOURCE 12_validation_queries.sql;

SELECT 'PRAGATI-AI Database fully deployed, seeded, and verified.' AS final_status;
