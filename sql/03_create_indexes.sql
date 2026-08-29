-- ==============================================================================
-- PRAGATI-AI Performance Indexes Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 03_create_indexes.sql
-- ==============================================================================

USE pragati_ai;

CREATE INDEX idx_ministries_name ON ministries(ministry_name);
CREATE INDEX idx_sectors_name ON sectors(sector_name);
CREATE INDEX idx_states_name ON states(state_name);
CREATE INDEX idx_districts_state ON districts(state_id);
CREATE INDEX idx_agencies_ministry ON implementing_agencies(ministry_id);
CREATE INDEX idx_agencies_type ON implementing_agencies(agency_type);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_ministry ON users(ministry_id);

CREATE INDEX idx_projects_name ON projects(project_name);
CREATE INDEX idx_projects_ministry ON projects(ministry_id);
CREATE INDEX idx_projects_sector ON projects(sector_id);
CREATE INDEX idx_projects_agency ON projects(agency_id);
CREATE INDEX idx_projects_state ON projects(state_id);
CREATE INDEX idx_projects_status ON projects(current_status);
CREATE INDEX idx_projects_stage ON projects(project_stage);
CREATE INDEX idx_projects_priority ON projects(priority_category);
CREATE INDEX idx_projects_plan_comp ON projects(planned_completion_date);
CREATE INDEX idx_projects_ministry_status ON projects(ministry_id, current_status);
CREATE INDEX idx_projects_sector_status ON projects(sector_id, current_status);

CREATE INDEX idx_pmd_project_id ON project_monthly_data(project_id);
CREATE INDEX idx_pmd_reporting_month ON project_monthly_data(reporting_month);
CREATE INDEX idx_pmd_proj_month ON project_monthly_data(project_id, reporting_month DESC);
CREATE INDEX idx_pmd_phys_fin_prog ON project_monthly_data(physical_progress, financial_progress);

CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_milestones_plan_date ON milestones(planned_date);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_criticality ON milestones(criticality);
CREATE INDEX idx_milestones_proj_status ON milestones(project_id, status);

CREATE INDEX idx_model_versions_active ON model_versions(model_name, is_active);

CREATE INDEX idx_pred_project_id ON risk_predictions(project_id);
CREATE INDEX idx_pred_model_version ON risk_predictions(model_version_id);
CREATE INDEX idx_pred_date ON risk_predictions(prediction_date);
CREATE INDEX idx_pred_risk_level ON risk_predictions(risk_level);
CREATE INDEX idx_pred_overall_risk ON risk_predictions(overall_risk);
CREATE INDEX idx_pred_proj_date ON risk_predictions(project_id, prediction_date DESC);
CREATE INDEX idx_pred_level_proj ON risk_predictions(risk_level, project_id);

CREATE INDEX idx_rf_prediction ON risk_factors(prediction_id);
CREATE INDEX idx_rf_factor_code ON risk_factors(factor_code);
CREATE INDEX idx_rf_pred_rank ON risk_factors(prediction_id, rank_order);

CREATE INDEX idx_alerts_project ON alerts(project_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_gen_at ON alerts(generated_at DESC);
CREATE INDEX idx_alerts_proj_stat_sev ON alerts(project_id, status, severity);

CREATE INDEX idx_recs_project ON recommendations(project_id);
CREATE INDEX idx_recs_priority ON recommendations(priority);
CREATE INDEX idx_recs_status ON recommendations(status);
CREATE INDEX idx_recs_proj_status ON recommendations(project_id, status);

CREATE INDEX idx_scenarios_project ON what_if_scenarios(project_id);
CREATE INDEX idx_scenarios_user ON what_if_scenarios(created_by);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

SELECT 'All performance indexes created successfully.' AS status_message;
