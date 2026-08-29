-- ==============================================================================
-- PRAGATI-AI Table Creation Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- Engine: InnoDB | Character Set: utf8mb4
-- File: 02_create_tables.sql
-- ==============================================================================

USE pragati_ai;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table: ministries
DROP TABLE IF EXISTS ministries;
CREATE TABLE ministries (
    ministry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ministry_code VARCHAR(50) NOT NULL UNIQUE,
    ministry_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: sectors
DROP TABLE IF EXISTS sectors;
CREATE TABLE sectors (
    sector_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sector_code VARCHAR(50) NOT NULL UNIQUE,
    sector_name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: states
DROP TABLE IF EXISTS states;
CREATE TABLE states (
    state_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: districts
DROP TABLE IF EXISTS districts;
CREATE TABLE districts (
    district_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_districts_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT uk_state_district UNIQUE (state_id, district_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: implementing_agencies
DROP TABLE IF EXISTS implementing_agencies;
CREATE TABLE implementing_agencies (
    agency_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    agency_code VARCHAR(50) NOT NULL UNIQUE,
    agency_name VARCHAR(255) NOT NULL,
    agency_type ENUM('CENTRAL_GOVERNMENT', 'PSU', 'STATE_GOVERNMENT', 'AUTONOMOUS_BODY', 'OTHER') NOT NULL DEFAULT 'PSU',
    ministry_id BIGINT NULL,
    contact_information TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_agencies_ministry FOREIGN KEY (ministry_id) 
        REFERENCES ministries(ministry_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Table: users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'MONITORING_OFFICER', 'MINISTRY_OFFICER', 'ANALYST', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    ministry_id BIGINT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_ministry FOREIGN KEY (ministry_id) 
        REFERENCES ministries(ministry_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Table: projects
DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
    project_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_code VARCHAR(100) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT NULL,
    ministry_id BIGINT NOT NULL,
    sector_id BIGINT NOT NULL,
    agency_id BIGINT NOT NULL,
    state_id BIGINT NOT NULL,
    district_id BIGINT NULL,
    location_description VARCHAR(255) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    original_cost DECIMAL(18,2) NOT NULL,
    revised_cost DECIMAL(18,2) NULL,
    approved_cost DECIMAL(18,2) NOT NULL,
    approved_date DATE NOT NULL,
    planned_start_date DATE NOT NULL,
    planned_completion_date DATE NOT NULL,
    actual_start_date DATE NULL,
    actual_completion_date DATE NULL,
    current_status ENUM('PROPOSED', 'APPROVED', 'ONGOING', 'COMPLETED', 'DELAYED', 'ON_HOLD', 'CANCELLED', 'CLOSED') NOT NULL DEFAULT 'ONGOING',
    project_stage ENUM('PLANNING', 'PROCUREMENT', 'EXECUTION', 'COMMISSIONING', 'COMPLETED') NOT NULL DEFAULT 'EXECUTION',
    priority_category ENUM('TOP_PRIORITY', 'HIGH_IMPACT', 'REGULAR', 'STRATEGIC') NOT NULL DEFAULT 'REGULAR',
    source_system ENUM('OCMS', 'PAIMANA', 'DEMO', 'OTHER') NOT NULL DEFAULT 'PAIMANA',
    source_reference VARCHAR(150) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_proj_orig_cost CHECK (original_cost >= 0),
    CONSTRAINT chk_proj_appr_cost CHECK (approved_cost >= 0),
    CONSTRAINT chk_proj_rev_cost CHECK (revised_cost IS NULL OR revised_cost >= 0),
    CONSTRAINT fk_projects_ministry FOREIGN KEY (ministry_id) 
        REFERENCES ministries(ministry_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_projects_sector FOREIGN KEY (sector_id) 
        REFERENCES sectors(sector_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_projects_agency FOREIGN KEY (agency_id) 
        REFERENCES implementing_agencies(agency_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_projects_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_projects_district FOREIGN KEY (district_id) 
        REFERENCES districts(district_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Table: project_monthly_data
DROP TABLE IF EXISTS project_monthly_data;
CREATE TABLE project_monthly_data (
    monthly_data_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    reporting_month DATE NOT NULL,
    expenditure DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    cumulative_expenditure DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    physical_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    financial_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    planned_progress DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    milestones_planned INT NOT NULL DEFAULT 0,
    milestones_completed INT NOT NULL DEFAULT 0,
    milestones_delayed INT NOT NULL DEFAULT 0,
    schedule_variance_days INT NOT NULL DEFAULT 0,
    cost_variance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    manpower_count INT NULL DEFAULT 0,
    remarks TEXT NULL,
    data_source VARCHAR(100) NOT NULL DEFAULT 'MONTHLY_MONITORING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_project_reporting_month UNIQUE (project_id, reporting_month),
    CONSTRAINT chk_pmd_phys_prog CHECK (physical_progress >= 0.00 AND physical_progress <= 100.00),
    CONSTRAINT chk_pmd_fin_prog CHECK (financial_progress >= 0.00 AND financial_progress <= 100.00),
    CONSTRAINT chk_pmd_plan_prog CHECK (planned_progress >= 0.00 AND planned_progress <= 100.00),
    CONSTRAINT chk_pmd_ms_planned CHECK (milestones_planned >= 0),
    CONSTRAINT chk_pmd_ms_completed CHECK (milestones_completed >= 0),
    CONSTRAINT chk_pmd_ms_delayed CHECK (milestones_delayed >= 0),
    CONSTRAINT fk_pmd_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Table: milestones
DROP TABLE IF EXISTS milestones;
CREATE TABLE milestones (
    milestone_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    milestone_code VARCHAR(50) NOT NULL,
    milestone_name VARCHAR(255) NOT NULL,
    milestone_description TEXT NULL,
    planned_date DATE NOT NULL,
    revised_date DATE NULL,
    actual_date DATE NULL,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    delay_days INT NULL DEFAULT 0,
    criticality ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uk_project_milestone UNIQUE (project_id, milestone_code),
    CONSTRAINT fk_milestones_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Table: model_versions
DROP TABLE IF EXISTS model_versions;
CREATE TABLE model_versions (
    model_version_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_type ENUM('CLASSIFICATION', 'REGRESSION', 'FORECASTING') NOT NULL,
    version_number VARCHAR(50) NOT NULL,
    target_variable VARCHAR(100) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    training_start_date DATE NULL,
    training_end_date DATE NULL,
    validation_metrics JSON NULL,
    feature_set_description TEXT NULL,
    model_file_reference VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_model_version UNIQUE (model_name, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Table: risk_predictions
DROP TABLE IF EXISTS risk_predictions;
CREATE TABLE risk_predictions (
    prediction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    model_version_id BIGINT NOT NULL,
    prediction_date DATE NOT NULL,
    prediction_period VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    cost_risk DECIMAL(5,2) NOT NULL,
    time_risk DECIMAL(5,2) NOT NULL,
    implementation_risk DECIMAL(5,2) NOT NULL,
    overall_risk DECIMAL(5,2) NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    predicted_final_cost DECIMAL(18,2) NULL,
    predicted_delay_months DECIMAL(6,2) NULL,
    predicted_completion_date DATE NULL,
    confidence_score DECIMAL(5,2) NOT NULL DEFAULT 85.00,
    prediction_explanation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pred_cost_risk CHECK (cost_risk >= 0.00 AND cost_risk <= 100.00),
    CONSTRAINT chk_pred_time_risk CHECK (time_risk >= 0.00 AND time_risk <= 100.00),
    CONSTRAINT chk_pred_impl_risk CHECK (implementation_risk >= 0.00 AND implementation_risk <= 100.00),
    CONSTRAINT chk_pred_ovr_risk CHECK (overall_risk >= 0.00 AND overall_risk <= 100.00),
    CONSTRAINT chk_pred_conf CHECK (confidence_score >= 0.00 AND confidence_score <= 100.00),
    CONSTRAINT fk_predictions_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_predictions_model FOREIGN KEY (model_version_id) 
        REFERENCES model_versions(model_version_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Table: risk_factors
DROP TABLE IF EXISTS risk_factors;
CREATE TABLE risk_factors (
    risk_factor_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prediction_id BIGINT NOT NULL,
    factor_name VARCHAR(150) NOT NULL,
    factor_code VARCHAR(50) NOT NULL,
    impact_value DECIMAL(10,4) NOT NULL,
    impact_percentage DECIMAL(5,2) NOT NULL,
    direction ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL') NOT NULL DEFAULT 'POSITIVE',
    rank_order INT NOT NULL DEFAULT 1,
    explanation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_factors_prediction FOREIGN KEY (prediction_id) 
        REFERENCES risk_predictions(prediction_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Table: alerts
DROP TABLE IF EXISTS alerts;
CREATE TABLE alerts (
    alert_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    prediction_id BIGINT NULL,
    alert_type ENUM('COST_OVERRUN', 'TIME_OVERRUN', 'RISK_ESCALATION', 'PROGRESS_STAGNATION', 'MILESTONE_DELAY', 'EXPENDITURE_ANOMALY', 'DATA_QUALITY', 'OTHER') NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    trigger_value VARCHAR(100) NULL,
    threshold_value VARCHAR(100) NULL,
    status ENUM('NEW', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'NEW',
    generated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    acknowledged_at DATETIME NULL,
    resolved_at DATETIME NULL,
    acknowledged_by BIGINT NULL,
    resolved_by BIGINT NULL,
    CONSTRAINT fk_alerts_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_alerts_prediction FOREIGN KEY (prediction_id) 
        REFERENCES risk_predictions(prediction_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_alerts_ack_user FOREIGN KEY (acknowledged_by) 
        REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_alerts_res_user FOREIGN KEY (resolved_by) 
        REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Table: recommendations
DROP TABLE IF EXISTS recommendations;
CREATE TABLE recommendations (
    recommendation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    prediction_id BIGINT NULL,
    recommendation_type ENUM('MILESTONE_REVIEW', 'RECOVERY_PLAN', 'CONTRACTOR_REVIEW', 'RESOURCE_REVIEW', 'COST_REVIEW', 'SCHEDULE_REVIEW', 'ESCALATION', 'MONITORING_INTENSIFICATION', 'OTHER') NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    recommendation_text TEXT NOT NULL,
    rationale TEXT NULL,
    generated_by ENUM('RULE_ENGINE', 'ML', 'LLM', 'HUMAN') NOT NULL DEFAULT 'RULE_ENGINE',
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'IMPLEMENTED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_recs_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_recs_prediction FOREIGN KEY (prediction_id) 
        REFERENCES risk_predictions(prediction_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Table: what_if_scenarios
DROP TABLE IF EXISTS what_if_scenarios;
CREATE TABLE what_if_scenarios (
    scenario_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    scenario_name VARCHAR(255) NOT NULL,
    scenario_description TEXT NULL,
    baseline_prediction_id BIGINT NULL,
    input_parameters JSON NOT NULL,
    predicted_cost DECIMAL(18,2) NULL,
    predicted_delay_months DECIMAL(6,2) NULL,
    predicted_completion_date DATE NULL,
    predicted_risk DECIMAL(5,2) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scenarios_project FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_scenarios_user FOREIGN KEY (created_by) 
        REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_scenarios_baseline FOREIGN KEY (baseline_prediction_id) 
        REFERENCES risk_predictions(prediction_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Table: audit_logs
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NULL,
    old_value JSON NULL,
    new_value JSON NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'All 16 tables created successfully in pragati_ai database.' AS status_message;
