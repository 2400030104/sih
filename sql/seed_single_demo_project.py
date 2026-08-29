import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ai_service.src.database.db import query_db

def seed_single_project():
    print("=== SEEDING 1 COMPLETE DEMO PROJECT FOR FULL PLATFORM VERIFICATION ===")
    
    # 1. Clear any prior demo data safely
    query_db("SET FOREIGN_KEY_CHECKS = 0")
    tables = [
        'risk_factors', 'risk_predictions', 'project_monthly_data',
        'milestones', 'alerts', 'recommendations', 'what_if_scenarios',
        'audit_logs', 'projects'
    ]
    for t in tables:
        query_db(f"DELETE FROM `{t}`")
        query_db(f"ALTER TABLE `{t}` AUTO_INCREMENT = 1")
    query_db("SET FOREIGN_KEY_CHECKS = 1")

    # 2. Insert Single Project
    proj_sql = """
    INSERT INTO projects (
        project_id, project_code, project_name, project_description,
        ministry_id, sector_id, agency_id, state_id, district_id,
        location_description, latitude, longitude,
        original_cost, approved_cost, revised_cost,
        approved_date, planned_start_date, planned_completion_date,
        actual_start_date, actual_completion_date,
        current_status, project_stage, priority_category,
        source_system, created_at, updated_at
    ) VALUES (
        1, 'NHAI-DME-PKG14', 'Delhi-Mumbai Expressway (Package-14: Dausa to Lalsot)',
        'Construction of 8-lane access-controlled greenfield expressway section (Ch. 182+000 to Ch. 240+000) under Bharatmala Pariyojana Phase-I.',
        1, 1, 1, 8, 15,
        'Dausa - Lalsot section, Rajasthan', 26.91240000, 75.78730000,
        2450.00, 2850.00, 3420.00,
        '2021-01-15', '2021-03-15', '2024-09-30',
        '2021-03-20', NULL,
        'DELAYED', 'EXECUTION', 'TOP_PRIORITY',
        'PAIMANA', NOW(), NOW()
    )
    """
    query_db(proj_sql)
    print("[OK] Inserted Project #1: NHAI-DME-PKG14")

    # 3. Insert 12 Months of Telemetry Progress Data
    monthly_data = [
        ('2024-01-01', 110.00, 1150.00, 42.0, 40.0, 52.0, 1, 1, 0, -35, 50.00, 450, 'Site mobilization and initial embankment earthwork.'),
        ('2024-02-01', 110.00, 1260.00, 45.2, 44.0, 56.0, 1, 1, 0, -42, 60.00, 480, 'Culvert constructions underway.'),
        ('2024-03-01', 110.00, 1370.00, 48.0, 48.0, 60.0, 1, 1, 0, -50, 70.00, 520, 'Subgrade preparation across 25km stretch.'),
        ('2024-04-01', 120.00, 1490.00, 51.5, 52.0, 64.0, 1, 1, 0, -58, 80.00, 540, 'Granular Sub-Base (GSB) laying active.'),
        ('2024-05-01', 110.00, 1600.00, 54.0, 56.0, 68.0, 1, 0, 1, -68, 90.00, 510, 'Forest clearance delay at Ch. 210-218.'),
        ('2024-06-01', 110.00, 1710.00, 56.8, 60.0, 72.0, 1, 0, 1, -78, 100.00, 490, 'Monsoon rain deceleration in earthwork packages.'),
        ('2024-07-01', 90.00, 1800.00, 58.5, 63.0, 75.0, 1, 0, 1, -88, 110.00, 420, 'Heavy rains; focus diverted to precast girder casting.'),
        ('2024-08-01', 90.00, 1890.00, 60.0, 66.0, 78.0, 1, 0, 1, -96, 120.00, 430, 'Banas river bridge pier foundation redesign.'),
        ('2024-09-01', 90.00, 1980.00, 62.5, 69.0, 80.0, 1, 0, 1, -102, 130.00, 460, 'Bridge well-sinking operations resumed.'),
        ('2024-10-01', 90.00, 2070.00, 64.8, 72.0, 82.0, 1, 0, 1, -106, 140.00, 490, 'Dense Bituminous Macadam (DBM) layer begun.'),
        ('2024-11-01', 70.00, 2140.00, 66.5, 75.0, 83.5, 1, 0, 1, -110, 150.00, 510, 'Bitumen supply bottlenecks reported by contractor.'),
        ('2024-12-01', 70.00, 2210.00, 68.5, 77.5, 84.0, 1, 0, 1, -115, 160.00, 530, 'High schedule slippage (-115 days); recovery plan required.'),
    ]
    for m in monthly_data:
        m_sql = """
        INSERT INTO project_monthly_data (
            project_id, reporting_month, expenditure, cumulative_expenditure,
            physical_progress, financial_progress, planned_progress,
            milestones_planned, milestones_completed, milestones_delayed,
            schedule_variance_days, cost_variance, manpower_count, remarks
        ) VALUES (
            1, :month, :exp, :cum_exp,
            :phys, :fin, :plan,
            :ms_plan, :ms_comp, :ms_del,
            :sched_var, :cost_var, :manpower, :remarks
        )
        """
        query_db(m_sql, {
            'month': m[0], 'exp': m[1], 'cum_exp': m[2],
            'phys': m[3], 'fin': m[4], 'plan': m[5],
            'ms_plan': m[6], 'ms_comp': m[7], 'ms_del': m[8],
            'sched_var': m[9], 'cost_var': m[10], 'manpower': m[11], 'remarks': m[12]
        })
    print(f"[OK] Inserted {len(monthly_data)} Monthly Monitoring Records")

    # 4. Insert Milestones
    milestones = [
        ('MS-01', 'Land Acquisition & Right-of-Way Handover', 'Complete acquisition of 480 hectares of ROW.', '2021-03-15', '2021-12-31', '2022-03-31', 'COMPLETED', 90, 'CRITICAL'),
        ('MS-02', 'Environmental & Forest Clearance Compliance', 'Stage-II forest diversion for 42 hectares forest land.', '2021-06-01', '2022-04-30', '2022-08-15', 'COMPLETED', 107, 'HIGH'),
        ('MS-03', 'Earthwork, Embankment & Subgrade Completion', 'Subgrade preparation for total 58 km alignment.', '2022-01-10', '2023-03-31', '2023-06-30', 'COMPLETED', 91, 'HIGH'),
        ('MS-04', 'Major Bridge & Flyover Structural Package', 'Banas River Bridge and 4 interchange flyovers.', '2022-08-01', '2023-12-31', '2024-08-31', 'DELAYED', 244, 'CRITICAL'),
        ('MS-05', 'Dense Bituminous Macadam (DBM) Pavement', '8-lane bituminous base and wearing course laying.', '2023-03-01', '2024-05-31', '2025-01-31', 'DELAYED', 245, 'HIGH'),
        ('MS-06', 'Toll Plaza & Advanced Traffic Mgmt System (ATMS)', 'Electronic toll collection booths and fiber network.', '2023-09-01', '2024-07-31', '2025-04-30', 'IN_PROGRESS', 273, 'MEDIUM'),
        ('MS-07', 'Safety Inspection & Commercial Operations Date (COD)', 'Independent engineer inspection and safety audit.', '2024-01-01', '2024-09-30', '2025-06-30', 'PLANNED', 273, 'CRITICAL'),
    ]
    for ms in milestones:
        actual_val = ms[5] if ms[6] == 'COMPLETED' else None
        ms_sql = """
        INSERT INTO milestones (
            project_id, milestone_code, milestone_name, milestone_description,
            planned_date, revised_date, actual_date, status, delay_days, criticality
        ) VALUES (
            1, :code, :name, :desc,
            :p_date, :r_date, :a_date,
            :status, :delay, :crit
        )
        """
        query_db(ms_sql, {
            'code': ms[0], 'name': ms[1], 'desc': ms[2],
            'p_date': ms[3], 'r_date': ms[4], 'a_date': actual_val,
            'status': ms[6], 'delay': ms[7], 'crit': ms[8]
        })
    print(f"[OK] Inserted {len(milestones)} Critical Milestone Packages")

    # 5. Insert Risk Predictions (Model v1.8.0)
    pred_sql = """
    INSERT INTO risk_predictions (
        prediction_id, project_id, model_version_id, prediction_date, prediction_period,
        cost_risk, time_risk, implementation_risk, overall_risk, risk_level,
        predicted_final_cost, predicted_delay_months, predicted_completion_date,
        confidence_score, prediction_explanation
    ) VALUES (
        1, 1, 3, '2024-12-01', 'MONTHLY',
        65.00, 72.00, 62.00, 68.50, 'HIGH',
        3420.00, 8.50, '2025-06-30',
        88.50,
        'High schedule slippage of -115 days and delayed structural packages in Package-14 indicate a projected cost expansion of +Rs. 570 Cr and 8.5 months completion delay.'
    )
    """
    query_db(pred_sql)
    print("[OK] Inserted ML Predictive Risk Profile (HIGH Risk - 68.5/100)")

    # 6. Insert SHAP Risk Factors
    factors = [
        ('Major Bridge Package Delay', 'FACTOR_MAJOR_BRIDGE_DELAY', 0.3200, 32.00, 'POSITIVE', 1, 'Major bridge construction on Banas river is 8 months behind schedule due to pier foundation modifications.'),
        ('Execution Progress Slowdown', 'FACTOR_PROGRESS_SLOWDOWN', 0.2600, 26.00, 'POSITIVE', 2, 'Monthly physical progress (1.8%/mo) is currently below the required recovery pace of 3.2%/mo.'),
        ('Pavement Bituminous Package Lag', 'FACTOR_PAVEMENT_LAG', 0.2200, 22.00, 'POSITIVE', 3, 'Dense Bituminous Macadam (DBM) laying is constrained by sub-contractor bitumen supply chain bottlenecks.'),
        ('Contractor Financial Exposure', 'FACTOR_CONTRACTOR_EXPOSURE', 0.2000, 20.00, 'POSITIVE', 4, 'Cumulative expenditure has surpassed sanctioned phasing curve relative to physical completion.')
    ]
    for f in factors:
        f_sql = """
        INSERT INTO risk_factors (
            prediction_id, factor_name, factor_code, impact_value,
            impact_percentage, direction, rank_order, explanation
        ) VALUES (
            1, :name, :code, :val, :pct, :dir, :rank, :exp
        )
        """
        query_db(f_sql, {
            'name': f[0], 'code': f[1], 'val': f[2],
            'pct': f[3], 'dir': f[4], 'rank': f[5], 'exp': f[6]
        })
    print(f"[OK] Inserted {len(factors)} TreeSHAP Feature Attribution Risk Drivers")

    # 7. Insert Alerts
    alerts = [
        ('TIME_OVERRUN', 'CRITICAL', 'Schedule Slippage Exceeds 90-Day Threshold',
         'Project schedule variance of -115 days has breached the MoSPI 90-day critical intervention threshold.',
         '-115 days', '-90 days', 'NEW'),
        ('MILESTONE_DELAY', 'HIGH', 'Major Bridge Structural Milestone Overdue',
         'Milestone MS-04 (Major Bridge & Flyover Structural Package) is delayed by 244 days beyond baseline.',
         '244 days delay', '60 days threshold', 'ACKNOWLEDGED')
    ]
    for a in alerts:
        a_sql = """
        INSERT INTO alerts (
            project_id, prediction_id, alert_type, severity, title,
            message, trigger_value, threshold_value, status
        ) VALUES (
            1, 1, :type, :sev, :title, :msg, :trig, :thresh, :status
        )
        """
        query_db(a_sql, {
            'type': a[0], 'sev': a[1], 'title': a[2],
            'msg': a[3], 'trig': a[4], 'thresh': a[5], 'status': a[6]
        })
    print(f"[OK] Inserted {len(alerts)} Early Warning Alerts")

    # 8. Insert Policy Recommendations
    recs = [
        ('RECOVERY_PLAN', 'URGENT',
         'Impose contractual Milestone Recovery Schedule (MRS) on EPC Contractor with additional slipform pavers.',
         'Article 14.3 of EPC Agreement empowers Authority to mandate contractor resource augmentation without financial cost escalation.',
         'RULE_ENGINE', 'ACCEPTED'),
        ('RESOURCE_REVIEW', 'HIGH',
         'Establish Dedicated Bitumen Supply Corridor via IOCL Koyali Refinery to unblock Package-14 DBM pavement operations.',
         'Bitumen shortage identified by SHAP attribution as 22% contributor to pavement layer delays.',
         'ML', 'PENDING')
    ]
    for r in recs:
        r_sql = """
        INSERT INTO recommendations (
            project_id, prediction_id, recommendation_type, priority,
            recommendation_text, rationale, generated_by, status
        ) VALUES (
            1, 1, :type, :priority, :text, :rationale, :gen, :status
        )
        """
        query_db(r_sql, {
            'type': r[0], 'priority': r[1], 'text': r[2],
            'rationale': r[3], 'gen': r[4], 'status': r[5]
        })
    print(f"[OK] Inserted {len(recs)} Policy Decision Recommendations")

    print("\n====================================================")
    print("  1-PROJECT DEMO SEED COMPLETED SUCCESSFULLY!")
    print("  Project: NHAI-DME-PKG14 is live across all 10 pages.")
    print("====================================================")

if __name__ == '__main__':
    seed_single_project()
