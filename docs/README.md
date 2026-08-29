# PRAGATI-AI Database Architecture & Deployment Guide

**PRAGATI-AI**: Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Target RDBMS**: MySQL 8.0+ / MySQL Workbench  
**Schema Name**: `pragati_ai`  
**Phase**: Phase 1 (Database Foundation, Master Data, Historical Trajectories, Views, Validation)

---

## 1. Directory Structure

```
SIH/
├── docs/
│   ├── DATA_DICTIONARY.md         # Comprehensive data dictionary for all 16 tables
│   ├── ER_DIAGRAM.md              # Full Mermaid entity-relationship diagram
│   ├── SECURITY_AND_PASSWORDS.md  # Passwords, Bcrypt hashes, demo users, security architecture
│   └── README.md                  # This file
└── sql/
    ├── 01_create_database.sql           # Database creation with utf8mb4
    ├── 02_create_tables.sql             # 16 normalized relational tables with constraints
    ├── 03_create_indexes.sql            # Performance & analytical composite indexes
    ├── 04_insert_master_data.sql        # Ministries, Sectors, States, Districts, Agencies, Users, Models
    ├── 05_insert_demo_projects.sql      # 25 mega-infrastructure projects across India (Rs 150+ Cr)
    ├── 06_insert_demo_monthly_data.sql  # 300+ monthly time-series records (12 months x 25 projects)
    ├── 07_insert_demo_milestones.sql    # 175 project delivery milestones with status & delay days
    ├── 08_insert_demo_predictions.sql   # AI risk predictions & SHAP explainability factors
    ├── 09_insert_demo_alerts.sql        # Early warning alerts (Cost, Time, Risk Escalation, Stagnation)
    ├── 10_insert_demo_recommendations.sql # Prescriptive actions, What-If scenarios & Audit logs
    ├── 11_create_views.sql              # 6 production analytical SQL views
    ├── 12_validation_queries.sql        # 20 verification & test queries
    └── setup_all.sql                    # Master pipeline script to execute all scripts in sequence
```

---

## 2. Step-by-Step Setup in MySQL Workbench

1. **Open MySQL Workbench** and connect to your local MySQL 8.x instance (e.g. `localhost:3306` as `root`).
2. Click **File -> Open SQL Script...** (or press `Ctrl + O`).
3. Navigate to `sql/` and open **`01_create_database.sql`**.
4. Click the **Execute (Lightning Bolt)** icon. Verify `Database pragati_ai created successfully` in the Output console.
5. Open and execute **`02_create_tables.sql`** to create all 16 tables.
6. Open and execute **`03_create_indexes.sql`** to build performance indexes.
7. Open and execute **`04_insert_master_data.sql`** through **`10_insert_demo_recommendations.sql`** to load master and synthetic monitoring datasets.
8. Open and execute **`11_create_views.sql`** to compile analytical views.
9. Open and execute **`12_validation_queries.sql`** to run all 20 validation checks.
10. In the left-hand **Navigator** panel, right-click **Schemas -> Refresh All** and expand `pragati_ai` to inspect Tables and Views.

*(Alternatively, run `SOURCE setup_all.sql;` in the MySQL CLI).*

---

## 3. Demo User Credentials
Refer to [`docs/SECURITY_AND_PASSWORDS.md`](SECURITY_AND_PASSWORDS.md) for full details.
- **Default Password for All Demo Accounts**: `Pragati@2026!Secured`
- **Admin Login**: `admin.rajiv@pragati.gov.in`
- **Monitoring Officer**: `monitoring.ananya@mospi.gov.in`
- **Analyst Login**: `analyst.siddharth@pragati.gov.in`
