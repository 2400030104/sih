-- ==============================================================================
-- PRAGATI-AI Recommendations, What-If Scenarios & Audit Logs Insertion Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 10_insert_demo_recommendations.sql
-- ==============================================================================

USE pragati_ai;

INSERT INTO recommendations (
    recommendation_id, project_id, prediction_id, recommendation_type, priority,
    recommendation_text, rationale, generated_by, status
) VALUES
(1, 14, 7, 'RECOVERY_PLAN', 'URGENT', 'Convene Joint High-Level Taskforce between Ministry of Coal and State Revenue Authorities', 'Physical progress has stagnated at 40.5% with 7 consecutive months of risk escalation. High-level dispute resolution required for overburden disposal site.', 'RULE_ENGINE', 'PENDING'),
(2, 14, 7, 'CONTRACTOR_REVIEW', 'HIGH', 'Perform Comprehensive Financial & Operational Audit of Primary EPC Contractor', 'Physical-financial gap has expanded to 21.5%, suggesting potential cash-flow diversion or contractor distress.', 'ML', 'PENDING'),
(3, 2, 8, 'SCHEDULE_REVIEW', 'HIGH', 'Restructure Sectional Commissioning Timeline for Gujarat vs Maharashtra Segments', 'Segmental opening of Vapi-Sabarmati section will allow early passenger revenue while underground civil works continue.', 'LLM', 'ACCEPTED'),
(4, 7, 13, 'COST_REVIEW', 'URGENT', 'Submit Revised Cost Estimate (RCE-I) to Public Investment Board (PIB)', 'Projected overrun of 32.0% requires formal cabinet committee approval to release escalated budgetary tranches.', 'RULE_ENGINE', 'PENDING'),
(5, 8, 14, 'MONITORING_INTENSIFICATION', 'MEDIUM', 'Deploy Bi-Weekly Drone Lidar & Digital Twin Monitoring on Underground Station Fitments', 'Will provide ground-truth verification of electrical and HVAC fitment velocity.', 'RULE_ENGINE', 'IMPLEMENTED'),
(6, 21, 25, 'ESCALATION', 'URGENT', 'Escalate Dam Safety & Hydraulic Design Verification to Central Water Commission (CWC)', 'Severe monsoon damages require specialized design modifications prior to full reservoir filling.', 'HUMAN', 'ACCEPTED');


INSERT INTO what_if_scenarios (
    scenario_id, project_id, created_by, scenario_name, scenario_description,
    baseline_prediction_id, input_parameters, predicted_cost, predicted_delay_months,
    predicted_completion_date, predicted_risk
) VALUES
(1, 14, 1, 'Manpower Ramp-up (+25%) & Dual-Shift Overburden Removal', 'Simulates the effect of deploying 350 additional workers and activating 24x7 excavation shifts to recover lost trajectory.', 7, '{"manpower_increase_pct": 25, "shift_count": 2, "overburden_rate_multiplier": 1.45}', 5420.00, 7.50, '2022-01-15', 52.00),
(2, 2, 5, 'Modular Pre-Cast Viaduct Launching Optimization', 'Evaluates schedule impact if 4 additional heavy girder launchers are deployed concurrently across Vadodara package.', 8, '{"additional_launchers": 4, "segmental_cycle_days_reduction": 3.5}', 118000.00, 11.00, '2025-06-30', 58.50),
(3, 7, 5, 'Rapid TBM Invert Replacement & Specialized Grouting', 'Tests risk reduction if specialized Austrian tunneling method experts are mobilized with micro-fine cement grouting.', 13, '{"advance_rate_m_per_day": 4.2, "downtime_reduction_pct": 30}', 19800.00, 9.00, '2024-12-31', 64.00);


INSERT INTO audit_logs (
    audit_id, user_id, action_type, entity_type, entity_id, old_value, new_value, ip_address
) VALUES
(1, 1, 'UPDATE', 'projects', 14, '{"revised_cost": null, "current_status": "ONGOING"}', '{"revised_cost": 5600.00, "current_status": "DELAYED"}', '10.0.4.12'),
(2, 2, 'ACKNOWLEDGE_ALERT', 'alerts', 3, '{"status": "NEW"}', '{"status": "ACKNOWLEDGED", "acknowledged_by": 2}', '10.0.4.18'),
(3, 5, 'CREATE_SCENARIO', 'what_if_scenarios', 1, NULL, '{"scenario_name": "Manpower Ramp-up (+25%)", "project_id": 14}', '10.0.4.25'),
(4, 1, 'UPDATE', 'model_versions', 1, '{"is_active": false}', '{"is_active": true}', '10.0.4.12');

SELECT 'Recommendations, What-If Scenarios, and Audit Logs inserted successfully.' AS status_message;