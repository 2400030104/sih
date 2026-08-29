-- ==============================================================================
-- PRAGATI-AI Master Data Insertion Script
-- Project: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence)
-- Target RDBMS: MySQL 8.0+
-- File: 04_insert_master_data.sql
-- ==============================================================================

USE pragati_ai;

-- 1. Ministries
INSERT INTO ministries (ministry_id, ministry_code, ministry_name, department_name, is_active) VALUES
(1, 'MoRTH', 'Ministry of Road Transport and Highways', 'Highways Division', TRUE),
(2, 'MoR', 'Ministry of Railways', 'Railway Board', TRUE),
(3, 'MoP', 'Ministry of Power', 'Thermal & Hydro Transmission', TRUE),
(4, 'MoPNG', 'Ministry of Petroleum and Natural Gas', 'Exploration & Pipeline Division', TRUE),
(5, 'MoHUA', 'Ministry of Housing and Urban Affairs', 'Urban Transit & Metro Division', TRUE),
(6, 'MoC', 'Ministry of Coal', 'Coal Projects & Exploration', TRUE),
(7, 'MoS', 'Ministry of Steel', 'Steel Infrastructure', TRUE),
(8, 'MoPSW', 'Ministry of Ports, Shipping and Waterways', 'Sagarmala & Port Infra', TRUE);

-- 2. Sectors
INSERT INTO sectors (sector_id, sector_code, sector_name, description, is_active) VALUES
(1, 'ROAD_HW', 'Transport - Roads & Highways', 'National highways, expressways, ring roads, and economic corridors', TRUE),
(2, 'RAIL_TR', 'Transport - Railways & High Speed Rail', 'Dedicated freight corridors, high-speed rail, doubling, and electrification', TRUE),
(3, 'URBAN_METRO', 'Urban Infrastructure & Mass Transit', 'Metro rail networks, BRTS, and urban mobility corridors', TRUE),
(4, 'POWER_TH_HY', 'Energy - Power Generation & Transmission', 'Thermal, hydro, and inter-state transmission lines', TRUE),
(5, 'POWER_RENEW', 'Energy - Renewable & Clean Tech', 'Solar parks, green hydrogen, and wind infrastructure', TRUE),
(6, 'PETRO_GAS', 'Petroleum & Natural Gas', 'Refineries, strategic reserves, gas pipelines, and LNG terminals', TRUE),
(7, 'COAL_MINING', 'Coal & Mineral Mining', 'Commercial coal blocks, washeries, and evacuation corridors', TRUE),
(8, 'PORTS_SHIPPING', 'Ports & Inland Waterways', 'Deepwater ports, container terminals, and national waterways', TRUE),
(9, 'WATER_SANITATION', 'Water Resources & Sanitation', 'Inter-linking of rivers, dams, and bulk irrigation schemes', TRUE),
(10, 'TELECOM_DIGITAL', 'Digital & Communication Infrastructure', 'National broadband networks and optical fiber connectivity', TRUE);

-- 3. States
INSERT INTO states (state_id, state_code, state_name, region, is_active) VALUES
(1, 'MH', 'Maharashtra', 'Western', TRUE),
(2, 'UP', 'Uttar Pradesh', 'Northern', TRUE),
(3, 'TN', 'Tamil Nadu', 'Southern', TRUE),
(4, 'GJ', 'Gujarat', 'Western', TRUE),
(5, 'KA', 'Karnataka', 'Southern', TRUE),
(6, 'OD', 'Odisha', 'Eastern', TRUE),
(7, 'AS', 'Assam', 'North Eastern', TRUE),
(8, 'RJ', 'Rajasthan', 'Northern', TRUE),
(9, 'KL', 'Kerala', 'Southern', TRUE),
(10, 'WB', 'West Bengal', 'Eastern', TRUE),
(11, 'AP', 'Andhra Pradesh', 'Southern', TRUE),
(12, 'MP', 'Madhya Pradesh', 'Central', TRUE),
(13, 'JH', 'Jharkhand', 'Eastern', TRUE),
(14, 'DL', 'Delhi (NCT)', 'Northern', TRUE);

-- 4. Districts
INSERT INTO districts (district_id, state_id, district_name, is_active) VALUES
(1, 1, 'Mumbai Suburban', TRUE),
(2, 1, 'Pune', TRUE),
(3, 1, 'Nagpur', TRUE),
(4, 2, 'Lucknow', TRUE),
(5, 2, 'Varanasi', TRUE),
(6, 2, 'Gautam Buddha Nagar', TRUE),
(7, 3, 'Chennai', TRUE),
(8, 3, 'Coimbatore', TRUE),
(9, 4, 'Ahmedabad', TRUE),
(10, 4, 'Surat', TRUE),
(11, 5, 'Bengaluru Urban', TRUE),
(12, 6, 'Khordha', TRUE),
(13, 6, 'Sambalpur', TRUE),
(14, 7, 'Kamrup Metropolitan', TRUE),
(15, 8, 'Jaipur', TRUE),
(16, 9, 'Ernakulam', TRUE),
(17, 10, 'Kolkata', TRUE),
(18, 12, 'Bhopal', TRUE),
(19, 13, 'Ranchi', TRUE),
(20, 14, 'New Delhi', TRUE);

-- 5. Implementing Agencies
INSERT INTO implementing_agencies (agency_id, agency_code, agency_name, agency_type, ministry_id, contact_information, is_active) VALUES
(1, 'NHAI', 'National Highways Authority of India', 'AUTONOMOUS_BODY', 1, 'G 5&6, Sector-10, Dwarka, New Delhi. Tel: 011-25074100', TRUE),
(2, 'NHIDCL', 'National Highways and Infrastructure Development Corporation Ltd', 'PSU', 1, 'PTI Building, 4 Parliament Street, New Delhi.', TRUE),
(3, 'RVNL', 'Rail Vikas Nigam Limited', 'PSU', 2, 'August Kranti Bhawan, Bhikaji Cama Place, New Delhi.', TRUE),
(4, 'DFCCIL', 'Dedicated Freight Corridor Corporation of India Ltd', 'PSU', 2, 'Supreme Court Metro Station Building Complex, New Delhi.', TRUE),
(5, 'NTPC', 'NTPC Limited', 'PSU', 3, 'NTPC Bhawan, SCOPE Complex, Lodhi Road, New Delhi.', TRUE),
(6, 'POWERGRID', 'Power Grid Corporation of India Limited', 'PSU', 3, 'Saudamini, Plot No.2, Sector 29, Gurugram, Haryana.', TRUE),
(7, 'ONGC', 'Oil and Natural Gas Corporation Limited', 'PSU', 4, 'Deendayal Urja Bhawan, 5 Nelson Mandela Marg, Vasant Kunj, New Delhi.', TRUE),
(8, 'GAIL', 'GAIL (India) Limited', 'PSU', 4, '16 Bhikaiji Cama Place, R K Puram, New Delhi.', TRUE),
(9, 'DMRC', 'Delhi Metro Rail Corporation Ltd', 'PSU', 5, 'Metro Bhawan, Fire Brigade Lane, Barakhamba Road, New Delhi.', TRUE),
(10, 'BMRCL', 'Bangalore Metro Rail Corporation Limited', 'PSU', 5, '3rd Floor, BMTC Complex, K.H. Road, Shanthinagar, Bengaluru.', TRUE),
(11, 'CIL', 'Coal India Limited', 'PSU', 6, 'Coal Bhawan, Premise No-04 MAR, Plot No-AF-III, Action Area-1A, Newtown, Kolkata.', TRUE),
(12, 'SAIL', 'Steel Authority of India Limited', 'PSU', 7, 'Ispat Bhawan, Lodhi Road, New Delhi.', TRUE),
(13, 'IPA', 'Indian Ports Association', 'AUTONOMOUS_BODY', 8, '1st Floor, South Tower, NBCC Place, Bhisham Pitamah Marg, Lodhi Road, New Delhi.', TRUE);

-- 6. Users (Default Demo Password: Pragati@2026!Secured)
INSERT INTO users (user_id, full_name, email, password_hash, role, ministry_id, is_active) VALUES
(1, 'Dr. Rajiv Kumar', 'admin.rajiv@pragati.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'ADMIN', NULL, TRUE),
(2, 'Ananya Sharma', 'monitoring.ananya@mospi.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'MONITORING_OFFICER', NULL, TRUE),
(3, 'Vikram Malhotra', 'officer.vikram@morth.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'MINISTRY_OFFICER', 1, TRUE),
(4, 'Pooja Iyer', 'officer.pooja@railways.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'MINISTRY_OFFICER', 2, TRUE),
(5, 'Siddharth Roy', 'analyst.siddharth@pragati.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'ANALYST', NULL, TRUE),
(6, 'Sunita Deshmukh', 'viewer.sunita@pmo.gov.in', '$2b$12$e8Yk1.T.5kX8aB2qXJ2L9eFw0tH1rM3uP5oN7qS9wV1yZ3bC5dE7g', 'VIEWER', NULL, TRUE);

-- 7. Model Versions
INSERT INTO model_versions (model_version_id, model_name, model_type, version_number, target_variable, algorithm, training_start_date, training_end_date, validation_metrics, feature_set_description, model_file_reference, is_active) VALUES
(1, 'COST_OVERRUN_PREDICTOR', 'REGRESSION', 'v2.4.1', 'predicted_cost_escalation_pct', 'XGBOOST_REGRESSOR', '2005-01-01', '2024-12-31', 
 JSON_OBJECT('rmse', 4.12, 'mae', 2.85, 'r2_score', 0.887, 'mape', 5.34), 
 'Historical burn rate, milestone delay velocity, contractor load, physical-financial gap, commodity inflation index', 
 's3://pragati-models/cost_overrun/v2.4.1_xgb.bin', TRUE),

(2, 'TIME_OVERRUN_PREDICTOR', 'REGRESSION', 'v3.1.0', 'predicted_delay_months', 'CATBOOST_REGRESSOR', '2005-01-01', '2024-12-31', 
 JSON_OBJECT('rmse', 2.45, 'mae', 1.62, 'r2_score', 0.912, 'accuracy_within_3m', 92.4), 
 'Critical path milestone delays, land acquisition status, environmental clearances, monsoon seasonality factor', 
 's3://pragati-models/time_overrun/v3.1.0_cat.bin', TRUE),

(3, 'COMPOSITE_RISK_CLASSIFIER', 'CLASSIFICATION', 'v1.8.0', 'risk_level_category', 'RANDOM_FOREST_CLASSIFIER', '2005-01-01', '2024-12-31', 
 JSON_OBJECT('accuracy', 0.942, 'precision', 0.931, 'recall', 0.950, 'f1_score', 0.940, 'auc_roc', 0.978), 
 'Multi-dimensional risk feature space: cost variance ratio, schedule drift, critical milestone bottlenecks, physical progress stagnation score', 
 's3://pragati-models/risk_classifier/v1.8.0_rf.bin', TRUE);

SELECT 'Master data inserted successfully.' AS status_message;
