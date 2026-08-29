-- ==============================================================================
-- PRAGATI-AI Database Initialization Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 01_create_database.sql
-- ==============================================================================

DROP DATABASE IF EXISTS pragati_ai;

CREATE DATABASE pragati_ai
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE pragati_ai;

SELECT 'Database pragati_ai created and selected successfully.' AS status_message;
