-- ==============================================================================
-- PRAGATI-AI Early Warning Alerts Insertion Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 09_insert_demo_alerts.sql
-- ==============================================================================

USE pragati_ai;

INSERT INTO alerts (
    alert_id, project_id, prediction_id, alert_type, severity, title, message,
    trigger_value, threshold_value, status, generated_at, acknowledged_at, resolved_at,
    acknowledged_by, resolved_by
) VALUES
(1, 14, 7, 'RISK_ESCALATION', 'CRITICAL', 'Critical Risk Level Escalation (Score: 84.0%)', 'Project risk has escalated for 7 consecutive monitoring cycles from 35.0% to 84.0%. Immediate inter-ministerial review triggered.', '84.0', '75.0', 'NEW', '2024-07-16 09:30:00', NULL, NULL, NULL, NULL),
(2, 14, 7, 'PROGRESS_STAGNATION', 'CRITICAL', 'Physical Progress Stagnation Alert', 'Physical progress increased by only 0.1% in the latest monitoring cycle against planned 2.5%. Severe stagnation threshold breached.', '0.1%', '1.5%', 'NEW', '2024-07-16 09:35:00', NULL, NULL, NULL, NULL),
(3, 14, 7, 'EXPENDITURE_ANOMALY', 'HIGH', 'Physical-Financial Divergence Detected', 'Cumulative expenditure has reached 62.0% while physical completion is lagging at 40.5% (Divergence Gap: 21.5%).', '21.5% Gap', '15.0% Gap', 'ACKNOWLEDGED', '2024-07-16 09:40:00', '2024-07-16 11:15:00', NULL, 2, NULL),
(4, 2, 8, 'TIME_OVERRUN', 'HIGH', 'Projected Schedule Slippage (18+ Months)', 'AI time-prediction model indicates high probability of 18.5 months commissioning delay due to underground tunnel civil package.', '18.5 Months', '6.0 Months', 'NEW', '2024-07-16 10:00:00', NULL, NULL, NULL, NULL),
(5, 7, 13, 'COST_OVERRUN', 'CRITICAL', 'Anticipated Cost Escalation (+32.0%)', 'Projected cost revision of Rs 5,184 Crore required based on geological stabilization requirements in Himalayan tunnels.', 'Rs 21,400 Cr', 'Rs 16,216 Cr', 'ACKNOWLEDGED', '2024-07-16 10:15:00', '2024-07-16 14:20:00', NULL, 4, NULL),
(6, 8, 14, 'MILESTONE_DELAY', 'HIGH', 'Critical Path Station Commissioning Delayed', 'Milestone MS-05 (Superstructure & Station Architecture) is delayed by 140 days beyond baseline schedule.', '140 Days', '45 Days', 'RESOLVED', '2024-06-10 08:30:00', '2024-06-10 10:00:00', '2024-07-01 16:45:00', 2, 1),
(7, 21, 25, 'RISK_ESCALATION', 'CRITICAL', 'Polavaram Project Risk Surge (Score: 91.0%)', 'High-water discharge damages and spillway redesign have triggered maximum risk tier escalation.', '91.0', '80.0', 'NEW', '2024-07-16 11:00:00', NULL, NULL, NULL, NULL),
(8, 1, 1, 'DATA_QUALITY', 'LOW', 'Routine GPS Coordinates Telemetry Synchronized', 'Drone-based GIS survey coordinates successfully matched against PAIMANA geo-tagging database.', '0.00m Error', '5.00m Threshold', 'RESOLVED', '2024-07-01 09:00:00', '2024-07-01 09:10:00', '2024-07-01 09:15:00', 3, 3);

SELECT '8 early warning alerts inserted successfully.' AS status_message;