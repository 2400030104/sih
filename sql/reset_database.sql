-- ==============================================================================
-- PRAGATI-AI — SAFE CONTROLLED DATABASE RESET SCRIPT
-- ==============================================================================
-- Purpose:
--   Completely clears all project-specific & operational data while preserving
--   the entire database schema, table structures, foreign keys, views, indexes,
--   users, and master reference datasets (ministries, sectors, agencies, states, districts, model_versions).
--
-- Target Database: pragati_ai
-- Generated: 2026-08-29
-- ==============================================================================

USE `pragati_ai`;

-- 1. Temporarily disable foreign-key checks for safe dependency clearing
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Clear project-generated telemetry and child tables
DELETE FROM `risk_factors`;
DELETE FROM `risk_predictions`;
DELETE FROM `project_monthly_data`;
DELETE FROM `milestones`;
DELETE FROM `alerts`;
DELETE FROM `recommendations`;
DELETE FROM `what_if_scenarios`;
DELETE FROM `audit_logs`;

-- 3. Clear primary projects table
DELETE FROM `projects`;

-- 4. Reset AUTO_INCREMENT counters to 1 for all cleared tables
ALTER TABLE `risk_factors` AUTO_INCREMENT = 1;
ALTER TABLE `risk_predictions` AUTO_INCREMENT = 1;
ALTER TABLE `project_monthly_data` AUTO_INCREMENT = 1;
ALTER TABLE `milestones` AUTO_INCREMENT = 1;
ALTER TABLE `alerts` AUTO_INCREMENT = 1;
ALTER TABLE `recommendations` AUTO_INCREMENT = 1;
ALTER TABLE `what_if_scenarios` AUTO_INCREMENT = 1;
ALTER TABLE `audit_logs` AUTO_INCREMENT = 1;
ALTER TABLE `projects` AUTO_INCREMENT = 1;

-- 5. Re-enable foreign key constraints
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- VERIFICATION QUERIES (All cleared tables MUST return 0)
-- ==============================================================================
SELECT 'projects' AS table_name, COUNT(*) AS remaining_rows FROM `projects`
UNION ALL
SELECT 'project_monthly_data', COUNT(*) FROM `project_monthly_data`
UNION ALL
SELECT 'milestones', COUNT(*) FROM `milestones`
UNION ALL
SELECT 'risk_predictions', COUNT(*) FROM `risk_predictions`
UNION ALL
SELECT 'risk_factors', COUNT(*) FROM `risk_factors`
UNION ALL
SELECT 'alerts', COUNT(*) FROM `alerts`
UNION ALL
SELECT 'recommendations', COUNT(*) FROM `recommendations`
UNION ALL
SELECT 'what_if_scenarios', COUNT(*) FROM `what_if_scenarios`
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM `audit_logs`;
