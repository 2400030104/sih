# PRAGATI-AI Data Dictionary

**System**: PRAGATI-AI — Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Database**: `pragati_ai`  
**RDBMS**: MySQL 8.0+ (InnoDB, `utf8mb4_unicode_ci`)  
**Domain**: Ministry of Statistics and Programme Implementation (MoSPI) / Infrastructure & Project Monitoring Division (IPMD)

---

## Table of Contents
1. [ministries](#1-ministries)
2. [sectors](#2-sectors)
3. [states](#3-states)
4. [districts](#4-districts)
5. [implementing_agencies](#5-implementing_agencies)
6. [users](#6-users)
7. [projects](#7-projects)
8. [project_monthly_data](#8-project_monthly_data)
9. [milestones](#9-milestones)
10. [model_versions](#10-model_versions)
11. [risk_predictions](#11-risk_predictions)
12. [risk_factors](#12-risk_factors)
13. [alerts](#13-alerts)
14. [recommendations](#14-recommendations)
15. [what_if_scenarios](#15-what_if_scenarios)
16. [audit_logs](#16-audit_logs)

---

## 1. ministries
Stores central ministries and departments monitoring infrastructure projects costing ₹150+ Crore.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `ministry_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique surrogate identifier | `1` |
| `ministry_code` | VARCHAR(50) | NO | None | NO | NO | Standardized ministry code (Unique) | `'MoRTH'` |
| `ministry_name` | VARCHAR(255) | NO | None | NO | NO | Full administrative name of the ministry | `'Ministry of Road Transport and Highways'` |
| `department_name` | VARCHAR(255) | YES | NULL | NO | NO | Specific administrative department | `'Highways Division'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active status flag | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

---

## 2. sectors
Classifies infrastructure sectors across transportation, energy, urban transit, resources, and communications.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `sector_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique sector identifier | `1` |
| `sector_code` | VARCHAR(50) | NO | None | NO | NO | Sector short code (Unique) | `'ROAD_HW'` |
| `sector_name` | VARCHAR(150) | NO | None | NO | NO | Full name of the infrastructure sector | `'Transport - Roads & Highways'` |
| `description` | TEXT | YES | NULL | NO | NO | Scope and definition of projects in sector | `'National highways, expressways...'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active status flag | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

---

## 3. states
Master list of Indian States and Union Territories with geographic regional grouping.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `state_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique state identifier | `1` |
| `state_code` | VARCHAR(10) | NO | None | NO | NO | Standard 2-letter ISO state code (Unique) | `'MH'` |
| `state_name` | VARCHAR(100) | NO | None | NO | NO | Official name of the State/UT | `'Maharashtra'` |
| `region` | VARCHAR(50) | NO | None | NO | NO | Geographic zone (Northern, Western, etc.) | `'Western'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active status flag | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

---

## 4. districts
Administrative districts within states to locate infrastructure physical footprints.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `district_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique district identifier | `1` |
| `state_id` | BIGINT | NO | None | NO | YES | Parent state foreign key (`states.state_id`) | `1` |
| `district_name` | VARCHAR(100) | NO | None | NO | NO | Name of administrative district | `'Mumbai Suburban'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active status flag | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

*Unique Key*: `(state_id, district_name)` prevents duplicate district names per state.

---

## 5. implementing_agencies
Central PSUs, state authorities, and special purpose vehicles (SPVs) executing the projects.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `agency_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique agency identifier | `1` |
| `agency_code` | VARCHAR(50) | NO | None | NO | NO | Agency short code (Unique) | `'NHAI'` |
| `agency_name` | VARCHAR(255) | NO | None | NO | NO | Full name of the executing agency | `'National Highways Authority of India'` |
| `agency_type` | ENUM | NO | `'PSU'` | NO | NO | `CENTRAL_GOVERNMENT`, `PSU`, `STATE_GOVERNMENT`, `AUTONOMOUS_BODY`, `OTHER` | `'AUTONOMOUS_BODY'` |
| `ministry_id` | BIGINT | YES | NULL | NO | YES | Parent ministry foreign key (`ministries.ministry_id`) | `1` |
| `contact_information` | TEXT | YES | NULL | NO | NO | HQ address, phone, official contact | `'G 5&6, Sector-10, Dwarka...'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active status flag | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

---

## 6. users
System users supporting Role-Based Access Control (RBAC).

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `user_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique user identifier | `1` |
| `full_name` | VARCHAR(150) | NO | None | NO | NO | Full legal/display name of user | `'Dr. Rajiv Kumar'` |
| `email` | VARCHAR(150) | NO | None | NO | NO | Unique login email address | `'admin.rajiv@pragati.gov.in'` |
| `password_hash` | VARCHAR(255) | NO | None | NO | NO | Bcrypt/Argon2 password hash (Never plaintext) | `'$2b$12$e8Yk1.T...'` |
| `role` | ENUM | NO | `'VIEWER'` | NO | NO | `ADMIN`, `MONITORING_OFFICER`, `MINISTRY_OFFICER`, `ANALYST`, `VIEWER` | `'ADMIN'` |
| `ministry_id` | BIGINT | YES | NULL | NO | YES | Optional ministry mapping for scoped officers | `NULL` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Account active status | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | User account creation time | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | User record update time | `'2026-08-28 10:00:00'` |

---

## 7. projects
Core table containing project charter metadata for central infrastructure projects (₹150+ Cr).

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `project_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Primary project identifier | `1` |
| `project_code` | VARCHAR(100) | NO | None | NO | NO | Official project code (Unique) | `'NHAI-DME-PKG14'` |
| `project_name` | VARCHAR(255) | NO | None | NO | NO | Full name of the infrastructure project | `'Delhi-Mumbai Expressway (Pkg 14)'` |
| `project_description` | TEXT | YES | NULL | NO | NO | Scope and civil description | `'8-lane greenfield expressway...'` |
| `ministry_id` | BIGINT | NO | None | NO | YES | FK to `ministries.ministry_id` | `1` |
| `sector_id` | BIGINT | NO | None | NO | YES | FK to `sectors.sector_id` | `1` |
| `agency_id` | BIGINT | NO | None | NO | YES | FK to `implementing_agencies.agency_id` | `1` |
| `state_id` | BIGINT | NO | None | NO | YES | FK to `states.state_id` | `8` |
| `district_id` | BIGINT | YES | NULL | NO | YES | FK to `districts.district_id` | `15` |
| `location_description` | VARCHAR(255) | YES | NULL | NO | NO | Corridor stretch or site landmark | `'Jaipur-Dausa Greenfield Corridor'` |
| `latitude` | DECIMAL(10,8) | YES | NULL | NO | NO | Geographic latitude for map visualization | `26.91240000` |
| `longitude` | DECIMAL(11,8) | YES | NULL | NO | NO | Geographic longitude for map visualization | `75.78730000` |
| `original_cost` | DECIMAL(18,2) | NO | None | NO | NO | Original CCEA approved cost (Rs Crore) | `4850.00` |
| `revised_cost` | DECIMAL(18,2) | YES | NULL | NO | NO | Revised approved cost (Rs Crore), NULL if none | `NULL` |
| `approved_cost` | DECIMAL(18,2) | NO | None | NO | NO | Baseline sanctioned cost (Rs Crore) | `4850.00` |
| `approved_date` | DATE | NO | None | NO | NO | Cabinet / PIB sanction date | `'2020-03-15'` |
| `planned_start_date` | DATE | NO | None | NO | NO | Baseline planned construction start date | `'2020-09-01'` |
| `planned_completion_date`| DATE | NO | None | NO | NO | Baseline planned commissioning date | `'2024-12-31'` |
| `actual_start_date` | DATE | YES | NULL | NO | NO | Groundbreaking / actual start date | `'2020-09-15'` |
| `actual_completion_date` | DATE | YES | NULL | NO | NO | Actual commercial commissioning date | `NULL` |
| `current_status` | ENUM | NO | `'ONGOING'` | NO | NO | `PROPOSED`, `APPROVED`, `ONGOING`, `COMPLETED`, `DELAYED`, `ON_HOLD`, `CANCELLED`, `CLOSED` | `'ONGOING'` |
| `project_stage` | ENUM | NO | `'EXECUTION'` | NO | NO | `PLANNING`, `PROCUREMENT`, `EXECUTION`, `COMMISSIONING`, `COMPLETED` | `'EXECUTION'` |
| `priority_category` | ENUM | NO | `'REGULAR'` | NO | NO | `TOP_PRIORITY`, `HIGH_IMPACT`, `REGULAR`, `STRATEGIC` | `'TOP_PRIORITY'` |
| `source_system` | ENUM | NO | `'PAIMANA'` | NO | NO | Originating legacy database (`OCMS`, `PAIMANA`, `DEMO`, `OTHER`) | `'PAIMANA'` |
| `source_reference` | VARCHAR(150) | YES | NULL | NO | NO | External system primary key / ID | `'PAIMANA-NHAI-2020-014'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

---

## 8. project_monthly_data
Time-series monitoring records preserving month-by-month historical observations. **Never overwritten.**

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `monthly_data_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique monthly log identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `1` |
| `reporting_month` | DATE | NO | None | NO | NO | 1st day of monitoring cycle (`YYYY-MM-01`) | `'2024-01-01'` |
| `expenditure` | DECIMAL(18,2) | NO | `0.00` | NO | NO | Monthly expenditure during cycle (Rs Cr) | `82.45` |
| `cumulative_expenditure` | DECIMAL(18,2) | NO | `0.00` | NO | NO | Total expenditure up to this month (Rs Cr) | `1450.20` |
| `physical_progress` | DECIMAL(5,2) | NO | `0.00` | NO | NO | Cumulative physical work completion (0-100%) | `58.40` |
| `financial_progress` | DECIMAL(5,2) | NO | `0.00` | NO | NO | Cumulative financial fund utilization (0-100%)| `60.10` |
| `planned_progress` | DECIMAL(5,2) | NO | `0.00` | NO | NO | Cumulative planned baseline target (0-100%) | `64.00` |
| `milestones_planned` | INT | NO | `0` | NO | NO | Total cumulative planned milestones | `8` |
| `milestones_completed` | INT | NO | `0` | NO | NO | Total milestones achieved to date | `4` |
| `milestones_delayed` | INT | NO | `0` | NO | NO | Total active milestones currently delayed | `1` |
| `schedule_variance_days`| INT | NO | `0` | NO | NO | Schedule slip in days against baseline | `25` |
| `cost_variance` | DECIMAL(18,2) | NO | `0.00` | NO | NO | Earned value cost variance (Rs Cr) | `12.50` |
| `manpower_count` | INT | YES | `0` | NO | NO | Total active labor and engineering workforce | `1850` |
| `remarks` | TEXT | YES | NULL | NO | NO | Monitoring officer observations | `'Package-14 earthworks completed...'` |
| `data_source` | VARCHAR(100) | NO | `'MONTHLY_MONITORING'` | NO | NO | Data origin | `'PAIMANA_SYNC'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Log insertion timestamp | `'2024-02-01 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2024-02-01 10:00:00'` |

*Constraint*: `UNIQUE (project_id, reporting_month)` ensures strictly one record per project per month.

---

## 9. milestones
Detailed tracking of major contractual, engineering, and commissioning project milestones.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `milestone_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique milestone identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `1` |
| `milestone_code` | VARCHAR(50) | NO | None | NO | NO | Milestone identifier within project | `'NHAI-DME-PKG14-MS-01'` |
| `milestone_name` | VARCHAR(255) | NO | None | NO | NO | Official milestone title | `'Land Acquisition & RoW'` |
| `milestone_description`| TEXT | YES | NULL | NO | NO | Detailed scope of milestone | `'Handover of 90%+ land'` |
| `planned_date` | DATE | NO | None | NO | NO | Baseline planned target date | `'2021-03-31'` |
| `revised_date` | DATE | YES | NULL | NO | NO | Revised approved target date | `'2021-06-30'` |
| `actual_date` | DATE | YES | NULL | NO | NO | Actual achievement date | `'2021-06-15'` |
| `status` | ENUM | NO | `'PLANNED'` | NO | NO | `PLANNED`, `IN_PROGRESS`, `COMPLETED`, `DELAYED`, `CANCELLED` | `'COMPLETED'` |
| `delay_days` | INT | YES | `0` | NO | NO | Slippage in calendar days | `0` |
| `criticality` | ENUM | NO | `'MEDIUM'` | NO | NO | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` | `'CRITICAL'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2026-08-28 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2026-08-28 10:00:00'` |

*Constraint*: `UNIQUE (project_id, milestone_code)` ensures unique milestone codes within each project.

---

## 10. model_versions
ML Model Registry tracking versions, algorithms, validation scores, and S3/GCS model artifacts.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `model_version_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique model version identifier | `1` |
| `model_name` | VARCHAR(100) | NO | None | NO | NO | Model category name | `'COST_OVERRUN_PREDICTOR'` |
| `model_type` | ENUM | NO | None | NO | NO | `CLASSIFICATION`, `REGRESSION`, `FORECASTING` | `'REGRESSION'` |
| `version_number` | VARCHAR(50) | NO | None | NO | NO | Semantic version tag | `'v2.4.1'` |
| `target_variable` | VARCHAR(100) | NO | None | NO | NO | Target prediction variable | `'predicted_cost_escalation_pct'` |
| `algorithm` | VARCHAR(100) | NO | None | NO | NO | ML algorithm used | `'XGBOOST_REGRESSOR'` |
| `training_start_date` | DATE | YES | NULL | NO | NO | Training dataset start date | `'2005-01-01'` |
| `training_end_date` | DATE | YES | NULL | NO | NO | Training dataset end date | `'2024-12-31'` |
| `validation_metrics` | JSON | YES | NULL | NO | NO | JSON object with RMSE, MAE, R2, AUC | `{"r2_score": 0.887, "rmse": 4.12}` |
| `feature_set_description`| TEXT | YES | NULL | NO | NO | Description of input feature vector | `'Historical burn rate, delay velocity...'`|
| `model_file_reference` | VARCHAR(255) | YES | NULL | NO | NO | Artifact URI in cloud storage | `'s3://pragati-models/cost/v2.4.1.bin'` |
| `is_active` | BOOLEAN | NO | `TRUE` | NO | NO | Active production model indicator | `1` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Model registration timestamp | `'2026-08-28 10:00:00'` |

---

## 11. risk_predictions
Historical AI predictions over time. **Never overwritten**, enabling continuous risk trajectory tracking.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `prediction_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique prediction identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `14` |
| `model_version_id` | BIGINT | NO | None | NO | YES | FK to `model_versions.model_version_id` | `3` |
| `prediction_date` | DATE | NO | None | NO | NO | Date prediction inference was generated | `'2024-07-15'` |
| `prediction_period` | VARCHAR(50) | NO | `'MONTHLY'` | NO | NO | Forecast cadence | `'MONTHLY'` |
| `cost_risk` | DECIMAL(5,2) | NO | None | NO | NO | Probability/score of cost overrun (0-100) | `81.00` |
| `time_risk` | DECIMAL(5,2) | NO | None | NO | NO | Probability/score of schedule delay (0-100)| `85.00` |
| `implementation_risk` | DECIMAL(5,2) | NO | None | NO | NO | Implementation execution risk (0-100) | `86.00` |
| `overall_risk` | DECIMAL(5,2) | NO | None | NO | NO | Composite weighted risk score (0-100) | `84.00` |
| `risk_level` | ENUM | NO | None | NO | NO | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` | `'CRITICAL'` |
| `predicted_final_cost` | DECIMAL(18,2) | YES | NULL | NO | NO | AI estimated final project cost (Rs Cr) | `5600.00` |
| `predicted_delay_months`| DECIMAL(6,2) | YES | NULL | NO | NO | AI estimated commissioning delay in months | `14.50` |
| `predicted_completion_date`| DATE | YES | NULL | NO | NO | AI projected actual completion date | `'2022-05-31'` |
| `confidence_score` | DECIMAL(5,2) | NO | `85.00` | NO | NO | Statistical confidence score (0-100%) | `92.00` |
| `prediction_explanation`| TEXT | YES | NULL | NO | NO | High-level summary rationale | `'Cost revision formal submission...'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Prediction generation timestamp | `'2024-07-15 08:30:00'` |

---

## 12. risk_factors
Explainable AI (XAI) feature importance drivers (SHAP values) explaining *why* a project was classified at risk.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `risk_factor_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique risk factor identifier | `1` |
| `prediction_id` | BIGINT | NO | None | NO | YES | FK to `risk_predictions.prediction_id` | `1` |
| `factor_name` | VARCHAR(150) | NO | None | NO | NO | Human-readable factor name | `'Milestone Delays'` |
| `factor_code` | VARCHAR(50) | NO | None | NO | NO | Machine-readable feature code | `'MS_DELAY_SHAP'` |
| `impact_value` | DECIMAL(10,4) | NO | None | NO | NO | Raw SHAP value / feature weight | `0.2840` |
| `impact_percentage` | DECIMAL(5,2) | NO | None | NO | NO | Normalized percentage contribution to risk | `32.50` |
| `direction` | ENUM | NO | `'POSITIVE'` | NO | NO | `POSITIVE` (increases risk), `NEGATIVE`, `NEUTRAL` | `'POSITIVE'` |
| `rank_order` | INT | NO | `1` | NO | NO | Relative importance rank (1 = Top driver) | `1` |
| `explanation` | TEXT | YES | NULL | NO | NO | Plain-English root cause description | `'Critical milestone MS-04 delayed...'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Record creation timestamp | `'2024-07-15 08:30:00'` |

---

## 13. alerts
Automated early-warning triggers based on statistical anomalies and threshold breaches.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `alert_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique alert identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `14` |
| `prediction_id` | BIGINT | YES | NULL | NO | YES | Optional FK to `risk_predictions.prediction_id` | `7` |
| `alert_type` | ENUM | NO | None | NO | NO | `COST_OVERRUN`, `TIME_OVERRUN`, `RISK_ESCALATION`, `PROGRESS_STAGNATION`, `MILESTONE_DELAY`, `EXPENDITURE_ANOMALY`, `DATA_QUALITY`, `OTHER` | `'RISK_ESCALATION'` |
| `severity` | ENUM | NO | None | NO | NO | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` | `'CRITICAL'` |
| `title` | VARCHAR(255) | NO | None | NO | NO | Short alert summary | `'Critical Risk Level Escalation'` |
| `message` | TEXT | NO | None | NO | NO | Full alert diagnostic message | `'Project risk escalated for 7 cycles...'` |
| `trigger_value` | VARCHAR(100) | YES | NULL | NO | NO | Actual observed value | `'84.0'` |
| `threshold_value` | VARCHAR(100) | YES | NULL | NO | NO | Boundary threshold value | `'75.0'` |
| `status` | ENUM | NO | `'NEW'` | NO | NO | `NEW`, `ACKNOWLEDGED`, `RESOLVED`, `DISMISSED` | `'NEW'` |
| `generated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Timestamp alert was raised | `'2024-07-16 09:30:00'` |
| `acknowledged_at` | DATETIME | YES | NULL | NO | NO | Timestamp officer acknowledged alert | `NULL` |
| `resolved_at` | DATETIME | YES | NULL | NO | NO | Timestamp alert was resolved | `NULL` |
| `acknowledged_by` | BIGINT | YES | NULL | NO | YES | FK to `users.user_id` | `NULL` |
| `resolved_by` | BIGINT | YES | NULL | NO | YES | FK to `users.user_id` | `NULL` |

---

## 14. recommendations
Prescriptive decision-support recommendations generated by AI, rule engines, or senior monitoring officers.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `recommendation_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique recommendation identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `14` |
| `prediction_id` | BIGINT | YES | NULL | NO | YES | FK to `risk_predictions.prediction_id` | `7` |
| `recommendation_type`| ENUM | NO | None | NO | NO | `MILESTONE_REVIEW`, `RECOVERY_PLAN`, `CONTRACTOR_REVIEW`, `RESOURCE_REVIEW`, `COST_REVIEW`, `SCHEDULE_REVIEW`, `ESCALATION`, `MONITORING_INTENSIFICATION`, `OTHER` | `'RECOVERY_PLAN'` |
| `priority` | ENUM | NO | `'MEDIUM'` | NO | NO | `LOW`, `MEDIUM`, `HIGH`, `URGENT` | `'URGENT'` |
| `recommendation_text`| TEXT | NO | None | NO | NO | Specific actionable directive | `'Convene Joint High-Level Taskforce...'` |
| `rationale` | TEXT | YES | NULL | NO | NO | Justification and data evidence | `'Physical progress has stagnated at 40.5%...'` |
| `generated_by` | ENUM | NO | `'RULE_ENGINE'` | NO | NO | `RULE_ENGINE`, `ML`, `LLM`, `HUMAN` | `'RULE_ENGINE'` |
| `status` | ENUM | NO | `'PENDING'` | NO | NO | `PENDING`, `ACCEPTED`, `REJECTED`, `IMPLEMENTED` | `'PENDING'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Recommendation timestamp | `'2024-07-16 10:00:00'` |
| `updated_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Auto-updated timestamp | `'2024-07-16 10:00:00'` |

---

## 15. what_if_scenarios
Simulation sandbox storing what-if policy scenarios and projected counterfactual outcomes.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `scenario_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique scenario identifier | `1` |
| `project_id` | BIGINT | NO | None | NO | YES | FK to `projects.project_id` | `14` |
| `created_by` | BIGINT | NO | None | NO | YES | FK to `users.user_id` | `1` |
| `scenario_name` | VARCHAR(255) | NO | None | NO | NO | Title of simulation scenario | `'Manpower Ramp-up (+25%)'` |
| `scenario_description`| TEXT | YES | NULL | NO | NO | Simulation assumptions and scope | `'Simulates the effect of 350 workers...'` |
| `baseline_prediction_id`| BIGINT | YES | NULL | NO | YES | Baseline FK to `risk_predictions.prediction_id` | `7` |
| `input_parameters` | JSON | NO | None | NO | NO | JSON input variable modifications | `'{"manpower_increase_pct": 25}'` |
| `predicted_cost` | DECIMAL(18,2) | YES | NULL | NO | NO | Counterfactual simulated final cost (Rs Cr) | `5420.00` |
| `predicted_delay_months`| DECIMAL(6,2) | YES | NULL | NO | NO | Counterfactual simulated delay | `7.50` |
| `predicted_completion_date`| DATE | YES | NULL | NO | NO | Counterfactual simulated completion date | `'2022-01-15'` |
| `predicted_risk` | DECIMAL(5,2) | YES | NULL | NO | NO | Counterfactual simulated risk score (0-100)| `52.00` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Simulation creation timestamp | `'2024-07-16 12:00:00'` |

---

## 16. audit_logs
Enterprise change-data-capture and audit trail for governance, compliance, and user accountability.

| Column Name | Data Type | Nullable | Default | PK | FK | Description | Example Value |
|---|---|---|---|---|---|---|---|
| `audit_id` | BIGINT | NO | AUTO_INCREMENT | YES | NO | Unique audit entry identifier | `1` |
| `user_id` | BIGINT | YES | NULL | NO | YES | FK to `users.user_id` (NULL for system events) | `1` |
| `action_type` | VARCHAR(50) | NO | None | NO | NO | Action (`INSERT`, `UPDATE`, `ACKNOWLEDGE_ALERT`, etc.) | `'UPDATE'` |
| `entity_type` | VARCHAR(100) | NO | None | NO | NO | Target table name | `'projects'` |
| `entity_id` | BIGINT | YES | NULL | NO | NO | Target entity primary key | `14` |
| `old_value` | JSON | YES | NULL | NO | NO | Pre-change JSON snapshot | `'{"current_status": "ONGOING"}'` |
| `new_value` | JSON | YES | NULL | NO | NO | Post-change JSON snapshot | `'{"current_status": "DELAYED"}'` |
| `ip_address` | VARCHAR(45) | YES | NULL | NO | NO | IPv4/IPv6 client address | `'10.0.4.12'` |
| `created_at` | DATETIME | NO | `CURRENT_TIMESTAMP` | NO | NO | Event timestamp | `'2024-07-16 14:00:00'` |

---
