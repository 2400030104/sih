"""
PRAGATI-AI: Comprehensive Seeder for 15 Multi-Sector Infrastructure Projects Across India.
Includes full telemetry, milestones, ML risk predictions, TreeSHAP feature drivers, alerts, and recommendations.
"""

import pymysql
from datetime import date, datetime, timedelta

def run_seed():
    print("Connecting to MySQL pragati_ai...")
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="Rohith@12345",
        database="pragati_ai",
        autocommit=False
    )
    cur = conn.cursor()

    try:
        # Disable foreign key checks for clean seeding
        cur.execute("SET FOREIGN_KEY_CHECKS = 0;")
        
        # Clear existing project records
        tables = [
            "what_if_scenarios",
            "audit_logs",
            "recommendations",
            "alerts",
            "risk_factors",
            "risk_predictions",
            "milestones",
            "project_monthly_data",
            "projects"
        ]
        for t in tables:
            cur.execute(f"DELETE FROM {t};")
            cur.execute(f"ALTER TABLE {t} AUTO_INCREMENT = 1;")
            print(f"Cleared & reset {t}")

        cur.execute("SET FOREIGN_KEY_CHECKS = 1;")

        # Master Project Data Definitions (15 Projects)
        projects_data = [
            # 1. Delhi-Mumbai Expressway Pkg-14
            {
                "code": "NHAI-DME-PKG14",
                "name": "Delhi-Mumbai Expressway Package-14 (Vadodara-Mumbai Section)",
                "desc": "8-lane access-controlled greenfield expressway connecting Delhi and Mumbai through Rajasthan.",
                "ministry_id": 1, "sector_id": 1, "agency_id": 1, "state_id": 8, "district_id": 15,
                "loc": "Dausa-Sawai Madhopur Corridor, Rajasthan",
                "lat": 26.9124, "lng": 75.7873,
                "orig_cost": 2850.0, "rev_cost": 3420.0, "app_cost": 2850.0,
                "app_date": "2021-03-15", "plan_start": "2021-06-01", "plan_comp": "2024-03-31",
                "act_start": "2021-07-15",
                "status": "DELAYED", "stage": "EXECUTION", "priority": "TOP_PRIORITY",
                "phy_prog": 68.5, "fin_prog": 77.5,
                "risk_level": "HIGH", "overall_risk": 68.5, "cost_risk": 72.0, "time_risk": 65.0, "impl_risk": 68.5,
                "pred_cost": 3580.0, "pred_delay": 14.5, "pred_comp": "2025-05-31", "conf": 0.88,
                "explanation": "Cost overrun driven by rock quarry inflation and 14-month right-of-way disputes in Sawai Madhopur.",
                "shap": [
                    ("Right-of-Way Dispute Delay", "ROW_DISPUTE_MONTHS", 0.342, 34.2, "POSITIVE", 1, "Forest land clearance pending over 4.2 km"),
                    ("Aggregate & Bitumen Price Escalation", "MATERIAL_PRICE_ESCALATION", 0.285, 28.5, "POSITIVE", 2, "22% hike in crushed stone and asphalt"),
                    ("Contractor Equipment Mobilization Lag", "CONTRACTOR_MOBILIZATION", 0.218, 21.8, "POSITIVE", 3, "Paving machines operating at 65% capacity"),
                    ("Milestone MS-04 Bridge Pier Slippage", "CRITICAL_MILESTONE_SLIPPAGE", 0.155, 15.5, "POSITIVE", 4, "Banas River bridge foundation 42 days overdue")
                ],
                "alerts": [
                    ("COST_OVERRUN", "HIGH", "Sanctioned Budget Expansion > 15%", "Cumulative expenditure has reached ₹2,650 Cr against ₹2,850 Cr initial sanction.", "20.0%", "15.0%"),
                    ("MILESTONE_DELAY", "CRITICAL", "Major Banas River Bridge Foundation Delay", "Piers P3 and P4 delayed by 42 days due to monsoon waterlogging.", "42 Days", "30 Days")
                ],
                "recommendations": [
                    ("CONTRACTOR_REVIEW", "HIGH", "Enforce Liquidated Damages & Direct Subcontracting for Paving", "Direct NHAI Project Director to invoke Clause 14.2 for delayed Banas bridge works.", "ML"),
                    ("COST_REVIEW", "URGENT", "Convene Standing Finance Committee for ₹570 Cr Revised Sanction", "Formalize revised expenditure ceiling to avoid contractor payment freezes.", "RULE_ENGINE")
                ]
            },

            # 2. Western Dedicated Freight Corridor
            {
                "code": "DFCC-WDFC-JNPT",
                "name": "Western Dedicated Freight Corridor (Vaitarna-JNPT Section)",
                "desc": "High-capacity dedicated double-stack container freight rail line connecting Dadri to Jawaharlal Nehru Port.",
                "ministry_id": 2, "sector_id": 2, "agency_id": 4, "state_id": 1, "district_id": 1,
                "loc": "Palghar-Thane-Navi Mumbai Coastal Line",
                "lat": 18.9438, "lng": 72.9515,
                "orig_cost": 4800.0, "rev_cost": 6240.0, "app_cost": 4800.0,
                "app_date": "2019-01-10", "plan_start": "2019-05-01", "plan_comp": "2023-12-31",
                "act_start": "2019-06-15",
                "status": "DELAYED", "stage": "EXECUTION", "priority": "STRATEGIC",
                "phy_prog": 58.0, "fin_prog": 69.2,
                "risk_level": "CRITICAL", "overall_risk": 84.2, "cost_risk": 88.0, "time_risk": 82.5, "impl_risk": 82.0,
                "pred_cost": 6750.0, "pred_delay": 26.0, "pred_comp": "2026-02-28", "conf": 0.91,
                "explanation": "Critical mangrove clearance delays in CRZ-I zone and dense urban utility relocation in Diva-Panvel stretch.",
                "shap": [
                    ("Coastal CRZ Mangrove Permissions", "CRZ_CLEARANCE_BLOCK", 0.420, 42.0, "POSITIVE", 1, "High Court clearance required for 12.8 hectares"),
                    ("Urban Utility Shifting (High Tension Lines)", "UTILITY_SHIFTING_LAG", 0.260, 26.0, "POSITIVE", 2, "38 high-voltage transmission lines pending shifting"),
                    ("Track Superstructure Steel Price Drift", "STEEL_COST_DRIFT", 0.180, 18.0, "POSITIVE", 3, "Rail steel prices increased by 28%"),
                    ("Bridge Over Diva Creek Piering", "CREEK_FOUNDATION_DELAY", 0.140, 14.0, "POSITIVE", 4, "Tidal restriction slows piling to 4 hrs/day")
                ],
                "alerts": [
                    ("TIME_OVERRUN", "CRITICAL", "Schedule Drift Exceeds 24 Months", "Project completion has slipped by 26 months past original 2023 deadline.", "26 Mos", "12 Mos"),
                    ("PROGRESS_STAGNATION", "HIGH", "Physical Progress Plateau in Urban Palghar Sector", "Less than 0.8% physical progress recorded over past 90 days.", "0.8%", "2.5%")
                ],
                "recommendations": [
                    ("ESCALATION", "URGENT", "Direct Inter-Ministerial Cabinet Escalation for CRZ Environmental Relief", "Submit high-priority affidavit to State Coastal Zone Authority for fast-track clearance.", "LLM"),
                    ("SCHEDULE_REVIEW", "HIGH", "Deploy Accelerated Modular Track Laying Machines", "Mobilize secondary mechanized track laying train to compress super-structure phase by 6 months.", "ML")
                ]
            },

            # 3. Bengaluru Metro Phase-2A Outer Ring Road
            {
                "code": "BMRCL-PH2A-ORR",
                "name": "Bengaluru Metro Phase-2A ORR Corridor (Silk Board to KR Puram)",
                "desc": "19.7 km fully elevated rapid transit line serving the major IT and tech innovation corridor on Outer Ring Road.",
                "ministry_id": 5, "sector_id": 3, "agency_id": 10, "state_id": 5, "district_id": 11,
                "loc": "Central Silk Board - Bellandur - Marathahalli - KR Puram",
                "lat": 12.9352, "lng": 77.6245,
                "orig_cost": 5994.0, "rev_cost": 6450.0, "app_cost": 5994.0,
                "app_date": "2020-08-18", "plan_start": "2021-02-01", "plan_comp": "2025-06-30",
                "act_start": "2021-03-10",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "HIGH_IMPACT",
                "phy_prog": 72.0, "fin_prog": 75.8,
                "risk_level": "HIGH", "overall_risk": 61.8, "cost_risk": 58.0, "time_risk": 65.5, "impl_risk": 62.0,
                "pred_cost": 6580.0, "pred_delay": 9.5, "pred_comp": "2026-04-15", "conf": 0.85,
                "explanation": "Traffic diversion constraints and Silk Board multi-level interchange integration complexities.",
                "shap": [
                    ("Silk Board Flyover Loop Integration", "INTERCHANGE_INTEGRATION", 0.310, 31.0, "POSITIVE", 1, "Complex 5-level road-cum-rail interchange design"),
                    ("Water Pipeline Relocation (BWSSB)", "WATER_UTILITY_DELAY", 0.280, 28.0, "POSITIVE", 2, "Cauvery water pipeline shifting across 6 metro stations"),
                    ("U-Girder Night Launching Window Restrictions", "NIGHT_LAUNCH_WINDOW", 0.240, 24.0, "POSITIVE", 3, "Traffic police only permits 4.5 hr night launching slot"),
                    ("Signaling CBTC Supply Chain", "CBTC_SUPPLY_CHAIN", 0.170, 17.0, "POSITIVE", 4, "Microchip delivery lead times for wayside signaling")
                ],
                "alerts": [
                    ("MILESTONE_DELAY", "HIGH", "Silk Board Viaduct Pier Cap Erection 35 Days Behind", "Substructure completion delayed due to live traffic junction restrictions.", "35 Days", "20 Days")
                ],
                "recommendations": [
                    ("RESOURCE_REVIEW", "HIGH", "Commission Pre-Cast Segmental Launching Gantry on Bellandur Span", "Double the gantry crane shifts to achieve 12 U-girders per week.", "RULE_ENGINE")
                ]
            },

            # 4. NTPC Barh Super Thermal Power Station
            {
                "code": "NTPC-BARH-STPP2",
                "name": "Barh Super Thermal Power Station Stage-II (2x660 MW)",
                "desc": "Ultra-supercritical power plant supplying high-efficiency base-load electricity to the National Power Grid.",
                "ministry_id": 3, "sector_id": 4, "agency_id": 5, "state_id": 2, "district_id": 5,
                "loc": "Barh, Patna / Varanasi Energy Transmission Grid",
                "lat": 25.4800, "lng": 85.7100,
                "orig_cost": 8320.0, "rev_cost": 8750.0, "app_cost": 8320.0,
                "app_date": "2018-06-12", "plan_start": "2018-10-01", "plan_comp": "2024-09-30",
                "act_start": "2018-11-15",
                "status": "ONGOING", "stage": "COMMISSIONING", "priority": "TOP_PRIORITY",
                "phy_prog": 88.5, "fin_prog": 91.2,
                "risk_level": "MEDIUM", "overall_risk": 42.5, "cost_risk": 45.0, "time_risk": 40.0, "impl_risk": 42.5,
                "pred_cost": 8820.0, "pred_delay": 5.0, "pred_comp": "2025-02-28", "conf": 0.89,
                "explanation": "Boiler synchronization in final trials; minor delay in coal handling conveyor automation.",
                "shap": [
                    ("Flue Gas Desulfurization (FGD) Retrofit", "FGD_COMPLIANCE", 0.360, 36.0, "POSITIVE", 1, "Environmental emission norm compliance retrofit"),
                    ("Ash Dyke Pipeline Commissioning", "ASH_DYKE_COMPLETION", 0.280, 28.0, "POSITIVE", 2, "Slurry pipeline 85% completed"),
                    ("Strong Nodal Project Management", "NODAL_EXECUTION_STRENGTH", -0.220, -22.0, "NEGATIVE", 3, "Turbine generator installed 15 days ahead of schedule")
                ],
                "alerts": [
                    ("PROGRESS_STAGNATION", "LOW", "Coal Handling Unit Automation Calibration", "Final software integration testing underway.", "92%", "95%")
                ],
                "recommendations": [
                    ("MONITORING_INTENSIFICATION", "MEDIUM", "Intensify 72-Hour Full Load Trial Run Monitoring", "Deploy dedicated technical audit team for boiler pressure certification.", "RULE_ENGINE")
                ]
            },

            # 5. GAIL Jagdishpur-Haldia Gas Pipeline
            {
                "code": "GAIL-JHBDPL-PKG3",
                "name": "Jagdishpur-Haldia & Bokaro-Dhamra Gas Pipeline (JHBDPL Phase-3)",
                "desc": "High-pressure natural gas grid supplying clean fuel to fertilizer plants, city gas networks, and industrial units.",
                "ministry_id": 4, "sector_id": 6, "agency_id": 8, "state_id": 6, "district_id": 12,
                "loc": "Khordha-Bhubaneswar-Cuttack Energy Corridor, Odisha",
                "lat": 20.1809, "lng": 85.6200,
                "orig_cost": 3150.0, "rev_cost": 3180.0, "app_cost": 3150.0,
                "app_date": "2020-04-10", "plan_start": "2020-09-01", "plan_comp": "2024-12-31",
                "act_start": "2020-09-15",
                "status": "ONGOING", "stage": "COMMISSIONING", "priority": "STRATEGIC",
                "phy_prog": 94.5, "fin_prog": 93.8,
                "risk_level": "LOW", "overall_risk": 18.2, "cost_risk": 15.0, "time_risk": 20.0, "impl_risk": 19.5,
                "pred_cost": 3185.0, "pred_delay": 1.2, "pred_comp": "2025-01-31", "conf": 0.94,
                "explanation": "High execution velocity; horizontal directional drilling (HDD) across major rivers completed flawlessly.",
                "shap": [
                    ("Streamlined Forest Clearances", "FAST_TRACK_CLEARANCE", -0.410, -41.0, "NEGATIVE", 1, "Single-window state clearance saved 4 months"),
                    ("Mechanized Automatic Pipe Welding", "AUTOMATIC_WELDING", -0.320, -32.0, "NEGATIVE", 2, "Reached 1.8 km/day pipelaying speed"),
                    ("Minor River Crossing Monsoon Window", "MONSOON_RIVER_CROSS", 0.180, 18.0, "POSITIVE", 3, "Mahanadi crossing wrapped before peak monsoons")
                ],
                "alerts": [],
                "recommendations": [
                    ("RECOVERY_PLAN", "LOW", "Prepare Gas Charging Safety Certification", "Initiate PNGRB third-party hydrostatic pressure testing.", "RULE_ENGINE")
                ]
            },

            # 6. NHIDCL Zojila Tunnel
            {
                "code": "NHIDCL-ZOJILA-TUN",
                "name": "Zojila Tunnel Project (14.15 km All-Weather Himalayan Pass)",
                "desc": "Strategic all-weather bi-directional tunnel connecting Srinagar Valley with Ladakh across Zojila Pass.",
                "ministry_id": 1, "sector_id": 1, "agency_id": 2, "state_id": 14, "district_id": 20,
                "loc": "Baltal to Minamarg, Zojila Pass, J&K / Ladakh",
                "lat": 34.2800, "lng": 75.4800,
                "orig_cost": 6808.0, "rev_cost": 8200.0, "app_cost": 6808.0,
                "app_date": "2019-11-15", "plan_start": "2020-10-15", "plan_comp": "2026-11-30",
                "act_start": "2020-10-15",
                "status": "DELAYED", "stage": "EXECUTION", "priority": "TOP_PRIORITY",
                "phy_prog": 51.5, "fin_prog": 62.0,
                "risk_level": "CRITICAL", "overall_risk": 81.0, "cost_risk": 85.0, "time_risk": 78.0, "impl_risk": 80.0,
                "pred_cost": 8750.0, "pred_delay": 22.0, "pred_comp": "2028-09-30", "conf": 0.87,
                "explanation": "Severe Himalayan thrust fault geology, freezing winter working window, and tunneling water ingress.",
                "shap": [
                    ("Fragile Himalayan Shear Zone Geology", "SHEAR_ZONE_COLLAPSE_RISK", 0.450, 45.0, "POSITIVE", 1, "Heavy rock support and forepoling required"),
                    ("Severe Sub-Zero Avalanche Winter Stoppage", "WINTER_WORK_STOPPAGE", 0.310, 31.0, "POSITIVE", 2, "Access road blocked 4 months every year"),
                    ("Specialized Tunnel Ventilation System Imports", "VENTILATION_IMPORT_DELAY", 0.180, 18.0, "POSITIVE", 3, "Saccardo nozzle supply chain delays")
                ],
                "alerts": [
                    ("TIME_OVERRUN", "CRITICAL", "Heading Excavation Velocity Below Monthly Target", "Current advance rate 45 m/month vs planned 90 m/month.", "45m", "90m"),
                    ("COST_OVERRUN", "HIGH", "Excavation Support Steel & Shotcrete Cost Escalation", "Expenditure expanded by ₹1,392 Cr due to rock bolts & steel ribs.", "₹1,392 Cr", "₹800 Cr")
                ],
                "recommendations": [
                    ("RESOURCE_REVIEW", "URGENT", "Deploy Second Continuous Roadheader at Minamarg Portal", "Double face excavation to overcome geological cavity delays.", "LLM"),
                    ("COST_REVIEW", "HIGH", "Sanction Phase-2 Geological Contingency Budget", "Fast-track approval from Ministry Expenditure Finance Committee.", "RULE_ENGINE")
                ]
            },

            # 7. RVNL Rishikesh-Karnprayag Rail Link
            {
                "code": "RVNL-RISHIKESH-KARN",
                "name": "Rishikesh-Karanprayag New Broad Gauge Rail Link (125 km)",
                "desc": "Mountain rail connectivity with 17 major tunnels and 16 bridges linking Garhwal region with the national rail network.",
                "ministry_id": 2, "sector_id": 2, "agency_id": 3, "state_id": 2, "district_id": 4,
                "loc": "Rishikesh - Devprayag - Srinagar - Karanprayag",
                "lat": 30.1033, "lng": 78.2948,
                "orig_cost": 16216.0, "rev_cost": 18400.0, "app_cost": 16216.0,
                "app_date": "2017-09-20", "plan_start": "2018-04-01", "plan_comp": "2025-12-31",
                "act_start": "2018-05-15",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "TOP_PRIORITY",
                "phy_prog": 64.0, "fin_prog": 71.5,
                "risk_level": "HIGH", "overall_risk": 64.0, "cost_risk": 62.0, "time_risk": 66.0, "impl_risk": 64.0,
                "pred_cost": 18950.0, "pred_delay": 12.0, "pred_comp": "2026-12-31", "conf": 0.88,
                "explanation": "Complex deep shaft ventilation, NATM tunneling in Main Central Thrust, and seismic safety requirements.",
                "shap": [
                    ("Main Central Thrust (MCT) Fault Line", "MCT_FAULT_TUNNELING", 0.380, 38.0, "POSITIVE", 1, "Extensive probe drilling required before blasting"),
                    ("Alaknanda River Bridge Pier Scour Protection", "BRIDGE_SCOUR_WORKS", 0.290, 29.0, "POSITIVE", 2, "High monsoon river velocity limits pier work"),
                    ("Mechanized Tunnel Boring (TBM) Mobilization", "TBM_EFFICIENCY", -0.190, -19.0, "NEGATIVE", 3, "TBM Package 3 achieved record 2.2 km boring")
                ],
                "alerts": [
                    ("MILESTONE_DELAY", "HIGH", "Tunnel T-14 Adit-2 Evacuation Shaft 28 Days Delayed", "Water gushing incident slowed mucking operations.", "28 Days", "15 Days")
                ],
                "recommendations": [
                    ("RECOVERY_PLAN", "HIGH", "Implement Pre-Grouting Protocols Ahead of Tunnel Face", "Mitigate water ingress risks in Devprayag fault stretch.", "ML")
                ]
            },

            # 8. PGCIL Green Energy Corridor
            {
                "code": "PGCIL-GREEN-ENERGY-CORR",
                "name": "Inter-State Transmission System for Green Energy Corridor (Phase-II)",
                "desc": "High-voltage 765 kV / 400 kV transmission lines evacuating 20 GW of solar and wind energy from Western Gujarat.",
                "ministry_id": 3, "sector_id": 4, "agency_id": 6, "state_id": 4, "district_id": 9,
                "loc": "Khavda-Bhuj-Ahmedabad Power Grid, Gujarat",
                "lat": 23.0225, "lng": 72.5714,
                "orig_cost": 4100.0, "rev_cost": 4100.0, "app_cost": 4100.0,
                "app_date": "2021-12-05", "plan_start": "2022-04-01", "plan_comp": "2025-03-31",
                "act_start": "2022-04-15",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "STRATEGIC",
                "phy_prog": 91.0, "fin_prog": 88.5,
                "risk_level": "LOW", "overall_risk": 14.5, "cost_risk": 12.0, "time_risk": 16.0, "impl_risk": 15.5,
                "pred_cost": 4120.0, "pred_delay": 0.8, "pred_comp": "2025-04-20", "conf": 0.95,
                "explanation": "Ahead of schedule; 94% of tower foundations completed with bird diverter installations across Rann of Kutch.",
                "shap": [
                    ("State Right-of-Way Coordination", "EXCELLENT_ROW_COORDINATION", -0.440, -44.0, "NEGATIVE", 1, "Gujarat Revenue dept cleared tower spots in 45 days"),
                    ("Standardized Modular Substation Design", "MODULAR_SUBSTATION", -0.310, -31.0, "NEGATIVE", 2, "GIS substation erected in record 8 months")
                ],
                "alerts": [],
                "recommendations": [
                    ("MONITORING_INTENSIFICATION", "LOW", "Coordinate Substation Energization with CTU", "Align test charge schedule with renewable park generation timelines.", "RULE_ENGINE")
                ]
            },

            # 9. JNPA Container Terminal 4
            {
                "code": "IPA-JNPA-CONTAINER-T4",
                "name": "Jawaharlal Nehru Port Mega Container Terminal 4 (Phase-II)",
                "desc": "Deepwater container berth extension with 1.8 km quay length and automated electric gantry crane handling.",
                "ministry_id": 8, "sector_id": 8, "agency_id": 13, "state_id": 1, "district_id": 1,
                "loc": "Nhava Sheva, Navi Mumbai, Maharashtra",
                "lat": 18.9500, "lng": 72.9400,
                "orig_cost": 3196.0, "rev_cost": 3350.0, "app_cost": 3196.0,
                "app_date": "2020-02-14", "plan_start": "2020-08-01", "plan_comp": "2025-05-31",
                "act_start": "2020-09-01",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "HIGH_IMPACT",
                "phy_prog": 79.5, "fin_prog": 82.0,
                "risk_level": "MEDIUM", "overall_risk": 36.0, "cost_risk": 34.0, "time_risk": 38.0, "impl_risk": 36.0,
                "pred_cost": 3380.0, "pred_delay": 3.5, "pred_comp": "2025-09-15", "conf": 0.89,
                "explanation": "Reclamation works 98% done; minor wait for international delivery of 8 Super Post-Panamax quay cranes.",
                "shap": [
                    ("Global Crane Equipment Shipment Lead Time", "QUAY_CRANE_LOGISTICS", 0.320, 32.0, "POSITIVE", 1, "Maritime shipping backlog delayed crane shipment"),
                    ("Rapid Marine Reclamation Execution", "MARINE_RECLAMATION_SPEED", -0.280, -28.0, "NEGATIVE", 2, "Geotextile tube bund completed 20 days early")
                ],
                "alerts": [],
                "recommendations": [
                    ("CONTRACTOR_REVIEW", "MEDIUM", "Verify Crane Port Delivery Vessel Routing", "Ensure direct berthing priority for heavylift cargo ship.", "RULE_ENGINE")
                ]
            },

            # 10. Delhi Metro Phase-4
            {
                "code": "DMRC-PH4-JANAKPURI",
                "name": "Delhi Metro Phase-4 (Janakpuri West to RK Ashram Marg Corridor)",
                "desc": "28.9 km mass rapid transit corridor featuring 22 stations with deep underground tunneling and elevated spans.",
                "ministry_id": 5, "sector_id": 3, "agency_id": 9, "state_id": 14, "district_id": 20,
                "loc": "Janakpuri - Mukarba Chowk - RK Ashram, New Delhi",
                "lat": 28.6219, "lng": 77.0878,
                "orig_cost": 7850.0, "rev_cost": 8120.0, "app_cost": 7850.0,
                "app_date": "2019-03-08", "plan_start": "2019-12-01", "plan_comp": "2025-10-31",
                "act_start": "2020-01-15",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "TOP_PRIORITY",
                "phy_prog": 74.0, "fin_prog": 76.5,
                "risk_level": "HIGH", "overall_risk": 58.4, "cost_risk": 55.0, "time_risk": 61.5, "impl_risk": 58.0,
                "pred_cost": 8290.0, "pred_delay": 8.0, "pred_comp": "2026-06-30", "conf": 0.86,
                "explanation": "Urban density tunneling near heritage structures and tree preservation court permissions.",
                "shap": [
                    ("Tree Transplantation & Forest Permissions", "TREE_CUTTING_NOC", 0.350, 35.0, "POSITIVE", 1, "High Court tree preservation committee review"),
                    ("Heritage Structure TBM Vibration Monitoring", "HERITAGE_VIBRATION", 0.270, 27.0, "POSITIVE", 2, "Tunneling speed reduced by 30% near protected arches"),
                    ("DMRC Standard Quality Control", "DMRC_EXECUTION_QUALITY", -0.190, -19.0, "NEGATIVE", 3, "Zero structural safety defects recorded to date")
                ],
                "alerts": [
                    ("MILESTONE_DELAY", "MEDIUM", "Underground Station Box Excavation at Majlis Park", "Utility diversion delayed box sinking by 22 days.", "22 Days", "15 Days")
                ],
                "recommendations": [
                    ("SCHEDULE_REVIEW", "HIGH", "Implement Parallel Track Laying in Completed North Tunnels", "Commence track laying in bored sections without waiting for whole corridor.", "ML")
                ]
            },

            # 11. ONGC KG-D6 Deepwater Development
            {
                "code": "ONGC-KG-DWN-98-2",
                "name": "KG-DWN-98/2 Deepwater Oil & Gas Field Development",
                "desc": "Ultra-deepwater offshore hydrocarbons project with Subsea wells, FPSO vessel, and onshore terminal processing.",
                "ministry_id": 4, "sector_id": 6, "agency_id": 7, "state_id": 11, "district_id": 7,
                "loc": "Krishna Godavari Offshore Basin, Andhra Pradesh Coast",
                "lat": 16.5062, "lng": 82.2700,
                "orig_cost": 34012.0, "rev_cost": 38200.0, "app_cost": 34012.0,
                "app_date": "2016-04-20", "plan_start": "2017-01-01", "plan_comp": "2024-06-30",
                "act_start": "2017-03-01",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "STRATEGIC",
                "phy_prog": 82.0, "fin_prog": 86.4,
                "risk_level": "HIGH", "overall_risk": 55.0, "cost_risk": 58.0, "time_risk": 52.0, "impl_risk": 55.0,
                "pred_cost": 39400.0, "pred_delay": 7.5, "pred_comp": "2025-02-15", "conf": 0.88,
                "explanation": "Offshore FPSO vessel integration completed; subsea umbilical hook-up proceeding in calm sea window.",
                "shap": [
                    ("Deepwater Umbilical & Riser Hook-Up", "OFFSHORE_HOOKUP_RISK", 0.360, 36.0, "POSITIVE", 1, "Specialized subsea construction vessels required"),
                    ("International Currency Exchange Fluctuation", "FOREX_EXCHANGE_DRIFT", 0.290, 29.0, "POSITIVE", 2, "USD payment appreciation for subsea valves"),
                    ("First Oil Production Milestone Achieved", "FIRST_OIL_MILESTONE", -0.240, -24.0, "NEGATIVE", 3, "First oil flow achieved from Cluster-2 wells")
                ],
                "alerts": [
                    ("COST_OVERRUN", "HIGH", "Subsea Equipment Dollar Denominated Cost Rise", "Forex drift added ₹1,420 Cr to offshore completion budget.", "₹1,420 Cr", "₹900 Cr")
                ],
                "recommendations": [
                    ("RESOURCE_REVIEW", "HIGH", "Lock Offshore Vessel Slot for Pre-Monsoon Subsea Tie-Ins", "Secure dive support vessels before Arabian Sea monsoon season.", "RULE_ENGINE")
                ]
            },

            # 12. NHAI Chennai Port-Maduravoyal Expressway
            {
                "code": "NHAI-CHENNAI-PORT-ELEV",
                "name": "Chennai Port to Maduravoyal 4-Lane Double-Decker Corridor",
                "desc": "20.6 km elevated double-decker corridor dedicated to port container cargo evacuation and city commuter traffic.",
                "ministry_id": 1, "sector_id": 1, "agency_id": 1, "state_id": 3, "district_id": 7,
                "loc": "Cooum River Alignment, Chennai, Tamil Nadu",
                "lat": 13.0827, "lng": 80.2707,
                "orig_cost": 5855.0, "rev_cost": 6100.0, "app_cost": 5855.0,
                "app_date": "2022-03-25", "plan_start": "2022-09-01", "plan_comp": "2025-12-31",
                "act_start": "2022-10-15",
                "status": "ONGOING", "stage": "EXECUTION", "priority": "HIGH_IMPACT",
                "phy_prog": 62.5, "fin_prog": 66.0,
                "risk_level": "MEDIUM", "overall_risk": 46.8, "cost_risk": 44.0, "time_risk": 49.0, "impl_risk": 47.0,
                "pred_cost": 6220.0, "pred_delay": 5.8, "pred_comp": "2026-06-30", "conf": 0.87,
                "explanation": "Piling inside Cooum riverbed requires specialized environmental silt curtains and Navy land permissions.",
                "shap": [
                    ("Riverbed Piling Environmental Safeguards", "COIN_RIVER_PILING", 0.330, 33.0, "POSITIVE", 1, "Silt containment monitors enforced by pollution board"),
                    ("Indian Navy Land Exchange Transfer", "NAVY_LAND_NOC", 0.280, 28.0, "POSITIVE", 2, "3.4 acres defense land transfer in final gazette notification"),
                    ("Modular Double-Decker Pier Casting", "PRECAST_PIERS", -0.210, -21.0, "NEGATIVE", 3, "Precast yard producing 8 double piers per week")
                ],
                "alerts": [],
                "recommendations": [
                    ("RECOVERY_PLAN", "MEDIUM", "Expedite Defense Ministry NOC for Napier Bridge Exit Ramp", "Schedule joint inspection with Southern Naval Command.", "LLM")
                ]
            },

            # 13. Coal India NCL Mechanized Coal Evacuation
            {
                "code": "CIL-NCL-COAL-EVAC",
                "name": "Northern Coalfields First Mile Connectivity Mechanized FMC",
                "desc": "Eco-friendly enclosed conveyor belt and rapid loading silo system eliminating truck road transport of coal.",
                "ministry_id": 6, "sector_id": 7, "agency_id": 11, "state_id": 12, "district_id": 18,
                "loc": "Singrauli-Bhopal Coal Logistics Grid, Madhya Pradesh",
                "lat": 24.1200, "lng": 82.6800,
                "orig_cost": 2450.0, "rev_cost": 2450.0, "app_cost": 2450.0,
                "app_date": "2021-08-10", "plan_start": "2022-01-15", "plan_comp": "2025-02-28",
                "act_start": "2022-01-20",
                "status": "ONGOING", "stage": "COMMISSIONING", "priority": "REGULAR",
                "phy_prog": 92.0, "fin_prog": 90.5,
                "risk_level": "LOW", "overall_risk": 16.0, "cost_risk": 14.0, "time_risk": 18.0, "impl_risk": 16.0,
                "pred_cost": 2465.0, "pred_delay": 0.5, "pred_comp": "2025-03-15", "conf": 0.93,
                "explanation": "Silo structure civil works 100% finished; trial conveyor testing running at 3,500 tonnes/hour capacity.",
                "shap": [
                    ("Turnkey EPC Contracting Efficiency", "EPC_CONTRACTOR_PERFORMANCE", -0.420, -42.0, "NEGATIVE", 1, "Single turnkey contract eliminated inter-vendor delays"),
                    ("Zero Land Acquisition Friction", "EXISTING_MINE_LEASE", -0.340, -34.0, "NEGATIVE", 2, "Built fully within existing operational mine lease boundaries")
                ],
                "alerts": [],
                "recommendations": [
                    ("MONITORING_INTENSIFICATION", "LOW", "Coordinate Rail Wagon Placement with East Central Railway", "Ensure 18 rakes/day allocation for automated silo testing.", "RULE_ENGINE")
                ]
            },

            # 14. RVNL Guwahati-Bongaigaon Doubling
            {
                "code": "RVNL-BOGIBEEL-GUWAHATI",
                "name": "Guwahati-New Bongaigaon Doubling & Northeast Logistics Line",
                "desc": "Capacity doubling of key trunk rail corridor connecting the 7 Northeast states with the rest of India.",
                "ministry_id": 2, "sector_id": 2, "agency_id": 3, "state_id": 7, "district_id": 14,
                "loc": "Kamrup-Goalpara-Bongaigaon Corridor, Assam",
                "lat": 26.1445, "lng": 91.7362,
                "orig_cost": 3980.0, "rev_cost": 4420.0, "app_cost": 3980.0,
                "app_date": "2019-07-22", "plan_start": "2020-02-01", "plan_comp": "2024-08-31",
                "act_start": "2020-03-10",
                "status": "DELAYED", "stage": "EXECUTION", "priority": "STRATEGIC",
                "phy_prog": 66.0, "fin_prog": 74.0,
                "risk_level": "HIGH", "overall_risk": 62.3, "cost_risk": 65.0, "time_risk": 60.0, "impl_risk": 62.0,
                "pred_cost": 4580.0, "pred_delay": 11.5, "pred_comp": "2025-08-15", "conf": 0.86,
                "explanation": "Brahmaputra basin seasonal monsoon floods submerge earthworks; earth borrowing permits delayed in Kamrup.",
                "shap": [
                    ("Annual Brahmaputra Monsoon Flood Shutdown", "MONSOON_FLOOD_SHUTDOWN", 0.390, 39.0, "POSITIVE", 1, "5 months annual stoppage of earth filling works"),
                    ("State Earth & Stone Quarry NOCs", "QUARRY_NOC_DELAY", 0.280, 28.0, "POSITIVE", 2, "Forest clearance for stone ballast delayed by 7 months"),
                    ("Pre-Stressed Concrete Sleeper Sourcing", "SLEEPER_FACTORY_STRENGTH", -0.170, -17.0, "NEGATIVE", 3, "Local Rangia sleeper plant meeting 100% quota")
                ],
                "alerts": [
                    ("TIME_OVERRUN", "HIGH", "Track Doubling Slipped by 11.5 Months", "Major earthwork remediation required following flash floods.", "11.5 Mos", "6.0 Mos")
                ],
                "recommendations": [
                    ("RECOVERY_PLAN", "HIGH", "Mobilize Geo-Synthetic Soil Reinforcement on Flood Embankments", "Install geotextile slope protectors to prevent future track breaches.", "ML")
                ]
            },

            # 15. SAIL Bokaro Steel Modernization
            {
                "code": "SAIL-BOKARO-MODERN",
                "name": "Bokaro Steel Plant Blast Furnace-1 Modernization & Green Expansion",
                "desc": "High-efficiency relining, pulverized coal injection upgrade, and waste-heat recovery power generation at Bokaro.",
                "ministry_id": 7, "sector_id": 7, "agency_id": 12, "state_id": 13, "district_id": 19,
                "loc": "Bokaro Steel City, Jharkhand",
                "lat": 23.6693, "lng": 86.1511,
                "orig_cost": 4200.0, "rev_cost": 4200.0, "app_cost": 4200.0,
                "app_date": "2021-05-18", "plan_start": "2021-11-01", "plan_comp": "2025-01-31",
                "act_start": "2021-11-15",
                "status": "ONGOING", "stage": "COMMISSIONING", "priority": "HIGH_IMPACT",
                "phy_prog": 95.0, "fin_prog": 94.2,
                "risk_level": "LOW", "overall_risk": 19.5, "cost_risk": 18.0, "time_risk": 21.0, "impl_risk": 19.5,
                "pred_cost": 4210.0, "pred_delay": 0.8, "pred_comp": "2025-02-28", "conf": 0.94,
                "explanation": "Blast furnace cold blast main relined in record time; hot metal trial testing started with +18% fuel efficiency.",
                "shap": [
                    ("In-House SAIL Engineering Expertise", "INHOUSE_ENGINEERING_EXCELLENCE", -0.450, -45.0, "NEGATIVE", 1, "Centre for Engineering and Technology managed shutdown without external consultants"),
                    ("Zero Lost Time Safety Compliance", "SAFETY_EXCELLENCE", -0.320, -32.0, "NEGATIVE", 2, "Over 4.5 million safe man-hours achieved")
                ],
                "alerts": [],
                "recommendations": [
                    ("MONITORING_INTENSIFICATION", "LOW", "Complete Hot Metal Performance Test Run", "Conduct 14-day continuous tapping audit for environmental certification.", "RULE_ENGINE")
                ]
            }
        ]

        print(f"Inserting {len(projects_data)} projects into MySQL...")

        for idx, p in enumerate(projects_data, start=1):
            # 1. Insert into `projects`
            sql_proj = """
            INSERT INTO projects (
                project_id, project_code, project_name, project_description,
                ministry_id, sector_id, agency_id, state_id, district_id,
                location_description, latitude, longitude,
                original_cost, revised_cost, approved_cost,
                approved_date, planned_start_date, planned_completion_date,
                actual_start_date, current_status, project_stage, priority_category,
                source_system, source_reference, created_at, updated_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s, %s, %s, 'OCMS', %s, NOW(), NOW()
            );
            """
            cur.execute(sql_proj, (
                idx, p["code"], p["name"], p["desc"],
                p["ministry_id"], p["sector_id"], p["agency_id"], p["state_id"], p["district_id"],
                p["loc"], p["lat"], p["lng"],
                p["orig_cost"], p["rev_cost"], p["app_cost"],
                p["app_date"], p["plan_start"], p["plan_comp"],
                p["act_start"], p["status"], p["stage"], p["priority"],
                f"OCMS-REF-{idx:04d}"
            ))

            # 2. Insert 12 months of progressive monthly telemetry
            start_date = datetime.strptime(p["act_start"], "%Y-%m-%d")
            total_phy = p["phy_prog"]
            total_fin = p["fin_prog"]
            app_cost = p["app_cost"]

            for m in range(1, 13):
                rep_date = date(2023 + (m // 13), (m % 12) + 1, 1)
                frac = m / 12.0
                curr_phy = round(total_phy * frac * (0.85 + 0.15 * (m / 12.0)), 2)
                curr_fin = round(total_fin * frac * (0.88 + 0.12 * (m / 12.0)), 2)
                planned_prog = min(100.0, round(frac * 92.0, 2))
                cum_exp = round((total_fin * frac / 100.0) * app_cost, 2)
                monthly_exp = round(cum_exp / max(1, m), 2)
                var_days = int((planned_prog - curr_phy) * 3.5) if planned_prog > curr_phy else 0
                cost_var = round(cum_exp - ((curr_phy / 100.0) * app_cost), 2)

                sql_month = """
                INSERT INTO project_monthly_data (
                    project_id, reporting_month, expenditure, cumulative_expenditure,
                    physical_progress, financial_progress, planned_progress,
                    milestones_planned, milestones_completed, milestones_delayed,
                    schedule_variance_days, cost_variance, manpower_count,
                    remarks, data_source, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'OCMS_PORTAL', NOW(), NOW()
                );
                """
                cur.execute(sql_month, (
                    idx, rep_date, monthly_exp, cum_exp,
                    curr_phy, curr_fin, planned_prog,
                    6, max(0, int(6 * frac)), max(0, int(var_days / 15)),
                    var_days, cost_var, 450 + (m * 25),
                    f"Monthly progress report {m}/12 for {p['code']}"
                ))

            # 3. Insert 5-6 realistic Milestones
            milestone_templates = [
                ("MS-01", "Land Acquisition & Right of Way Handover", "COMPLETED", 0, "CRITICAL"),
                ("MS-02", "Detailed Design & Engineering Sanction", "COMPLETED", 0, "HIGH"),
                ("MS-03", "Substructure & Foundation Piering", "COMPLETED" if p["phy_prog"] > 60 else "IN_PROGRESS", 0 if p["phy_prog"] > 60 else 18, "CRITICAL"),
                ("MS-04", "Superstructure & Core Civil Works", "IN_PROGRESS" if p["phy_prog"] < 90 else "COMPLETED", 25 if p["risk_level"] in ["HIGH", "CRITICAL"] else 0, "CRITICAL"),
                ("MS-05", "Electromechanical & Signaling Integration", "PLANNED" if p["phy_prog"] < 80 else "IN_PROGRESS", 0, "HIGH"),
                ("MS-06", "Safety Audit, Final Commissioning & Handover", "PLANNED", 0, "CRITICAL")
            ]

            for m_idx, (m_code, m_name, m_stat, m_delay, m_crit) in enumerate(milestone_templates, start=1):
                p_date = date(2022 + (m_idx // 3), ((m_idx * 2) % 12) + 1, 15)
                a_date = p_date if m_stat == "COMPLETED" else None
                sql_ms = """
                INSERT INTO milestones (
                    project_id, milestone_code, milestone_name, milestone_description,
                    planned_date, revised_date, actual_date, status, delay_days, criticality,
                    created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW()
                );
                """
                cur.execute(sql_ms, (
                    idx, f"{p['code']}-{m_code}", m_name, f"Stage milestone for {p['name']}",
                    p_date, p_date + timedelta(days=m_delay), a_date, m_stat, m_delay, m_crit
                ))

            # 4. Insert ML Risk Prediction
            sql_pred = """
            INSERT INTO risk_predictions (
                prediction_id, project_id, model_version_id, prediction_date, prediction_period,
                cost_risk, time_risk, implementation_risk, overall_risk, risk_level,
                predicted_final_cost, predicted_delay_months, predicted_completion_date,
                confidence_score, prediction_explanation, created_at
            ) VALUES (
                %s, %s, 3, CURDATE(), '2025-Q1',
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW()
            );
            """
            cur.execute(sql_pred, (
                idx, idx,
                p["cost_risk"], p["time_risk"], p["impl_risk"], p["overall_risk"], p["risk_level"],
                p["pred_cost"], p["pred_delay"], p["pred_comp"],
                p["conf"], p["explanation"]
            ))

            # 5. Insert TreeSHAP Risk Factors
            for f_name, f_code, impact_val, impact_pct, direction, r_order, explanation in p["shap"]:
                sql_shap = """
                INSERT INTO risk_factors (
                    prediction_id, factor_name, factor_code, impact_value,
                    impact_percentage, direction, rank_order, explanation, created_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, NOW()
                );
                """
                cur.execute(sql_shap, (
                    idx, f_name, f_code, impact_val, impact_pct, direction, r_order, explanation
                ))

            # 6. Insert Early Warning Alerts
            for a_type, sev, title, msg, trig, thresh in p["alerts"]:
                sql_alert = """
                INSERT INTO alerts (
                    project_id, prediction_id, alert_type, severity, title, message,
                    trigger_value, threshold_value, status, generated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, 'NEW', NOW()
                );
                """
                cur.execute(sql_alert, (
                    idx, idx, a_type, sev, title, msg, trig, thresh
                ))

            # 7. Insert Policy Recommendations
            for r_type, prio, text, rationale, gen_by in p["recommendations"]:
                sql_rec = """
                INSERT INTO recommendations (
                    project_id, prediction_id, recommendation_type, priority,
                    recommendation_text, rationale, generated_by, status, created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, 'PENDING', NOW(), NOW()
                );
                """
                cur.execute(sql_rec, (
                    idx, idx, r_type, prio, text, rationale, gen_by
                ))

            print(f"  [OK] Seeded #{idx:02d}: {p['code']} ({p['risk_level']} - {p['overall_risk']}/100)")

        # Re-train or refresh FAISS RAG store if needed
        conn.commit()
        print("\nAll 15 projects committed successfully to MySQL database!")

    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Seeding failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    run_seed()
