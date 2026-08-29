const { pool } = require('../config/db');

class DashboardService {
  /**
   * Get high-level KPI executive dashboard summary
   */
  static async getSummaryMetrics() {
    // 1. Projects status counts & baseline costs
    const [projectMetrics] = await pool.query(`
      SELECT 
        COUNT(*) AS totalProjects,
        SUM(CASE WHEN current_status = 'ONGOING' THEN 1 ELSE 0 END) AS ongoingProjects,
        SUM(CASE WHEN current_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completedProjects,
        SUM(CASE WHEN current_status = 'DELAYED' THEN 1 ELSE 0 END) AS delayedProjects,
        SUM(original_cost) AS totalOriginalCost,
        SUM(approved_cost) AS totalApprovedCost,
        SUM(COALESCE(revised_cost, approved_cost)) AS totalRevisedCost
      FROM projects
    `);

    // 2. Risk counts from latest risk view
    const [riskMetrics] = await pool.query(`
      SELECT 
        SUM(CASE WHEN risk_level = 'HIGH' THEN 1 ELSE 0 END) AS highRiskProjects,
        SUM(CASE WHEN risk_level = 'CRITICAL' THEN 1 ELSE 0 END) AS criticalRiskProjects,
        SUM(CASE WHEN risk_level = 'MEDIUM' THEN 1 ELSE 0 END) AS mediumRiskProjects,
        SUM(CASE WHEN risk_level = 'LOW' THEN 1 ELSE 0 END) AS lowRiskProjects,
        ROUND(AVG(overall_risk), 2) AS averageOverallRisk
      FROM v_project_risk_latest
    `);

    // 3. Progress and expenditure from latest status view
    const [progressMetrics] = await pool.query(`
      SELECT 
        ROUND(AVG(latest_physical_progress), 2) AS averagePhysicalProgress,
        ROUND(AVG(latest_financial_progress), 2) AS averageFinancialProgress,
        ROUND(AVG(latest_planned_progress), 2) AS averagePlannedProgress,
        SUM(cumulative_expenditure) AS totalExpenditure
      FROM v_project_latest_status
    `);

    // 4. Alerts and recommendations count
    const [alertCounts] = await pool.query(`
      SELECT 
        COUNT(*) AS totalActiveAlerts,
        SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) AS criticalAlerts
      FROM alerts 
      WHERE status IN ('NEW', 'ACKNOWLEDGED')
    `);

    const pm = projectMetrics[0] || {};
    const rm = riskMetrics[0] || {};
    const pr = progressMetrics[0] || {};
    const ac = alertCounts[0] || {};

    return {
      totalProjects: Number(pm.totalProjects || 0),
      ongoingProjects: Number(pm.ongoingProjects || 0),
      completedProjects: Number(pm.completedProjects || 0),
      delayedProjects: Number(pm.delayedProjects || 0),
      highRiskProjects: Number(rm.highRiskProjects || 0),
      criticalRiskProjects: Number(rm.criticalRiskProjects || 0),
      mediumRiskProjects: Number(rm.mediumRiskProjects || 0),
      lowRiskProjects: Number(rm.lowRiskProjects || 0),
      averageOverallRisk: Number(rm.averageOverallRisk || 0),
      totalOriginalCost: Number(pm.totalOriginalCost || 0),
      totalApprovedCost: Number(pm.totalApprovedCost || 0),
      totalRevisedCost: Number(pm.totalRevisedCost || 0),
      totalExpenditure: Number(pr.totalExpenditure || 0),
      averagePhysicalProgress: Number(pr.averagePhysicalProgress || 0),
      averageFinancialProgress: Number(pr.averageFinancialProgress || 0),
      averagePlannedProgress: Number(pr.averagePlannedProgress || 0),
      totalActiveAlerts: Number(ac.totalActiveAlerts || 0),
      criticalAlerts: Number(ac.criticalAlerts || 0)
    };
  }

  /**
   * Projects distributed by infrastructure sector
   */
  static async getProjectsBySector() {
    const sql = `
      SELECT 
        s.sector_id,
        s.sector_code,
        s.sector_name,
        COUNT(p.project_id) AS projectCount,
        COALESCE(SUM(p.approved_cost), 0) AS totalApprovedCost,
        COALESCE(SUM(COALESCE(p.revised_cost, p.approved_cost)), 0) AS totalCurrentCost,
        ROUND(COALESCE(AVG(vls.latest_physical_progress), 0), 2) AS avgPhysicalProgress,
        ROUND(COALESCE(AVG(vls.latest_financial_progress), 0), 2) AS avgFinancialProgress,
        SUM(CASE WHEN vr.risk_level IN ('HIGH', 'CRITICAL') THEN 1 ELSE 0 END) AS highRiskCount
      FROM sectors s
      LEFT JOIN projects p ON s.sector_id = p.sector_id
      LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
      LEFT JOIN v_project_risk_latest vr ON p.project_id = vr.project_id
      GROUP BY s.sector_id, s.sector_code, s.sector_name
      ORDER BY projectCount DESC, totalApprovedCost DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Projects distributed by Ministry / Department
   */
  static async getProjectsByMinistry() {
    const sql = `
      SELECT 
        m.ministry_id,
        m.ministry_code,
        m.ministry_name,
        COUNT(p.project_id) AS projectCount,
        COALESCE(SUM(p.approved_cost), 0) AS totalApprovedCost,
        COALESCE(SUM(COALESCE(p.revised_cost, p.approved_cost)), 0) AS totalCurrentCost,
        ROUND(COALESCE(AVG(vls.latest_physical_progress), 0), 2) AS avgPhysicalProgress,
        SUM(CASE WHEN p.current_status = 'DELAYED' THEN 1 ELSE 0 END) AS delayedCount,
        SUM(CASE WHEN vr.risk_level IN ('HIGH', 'CRITICAL') THEN 1 ELSE 0 END) AS highRiskCount
      FROM ministries m
      LEFT JOIN projects p ON m.ministry_id = p.ministry_id
      LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
      LEFT JOIN v_project_risk_latest vr ON p.project_id = vr.project_id
      GROUP BY m.ministry_id, m.ministry_code, m.ministry_name
      ORDER BY projectCount DESC, totalApprovedCost DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Projects distributed by State & Geographic Region
   */
  static async getProjectsByState() {
    const sql = `
      SELECT 
        st.state_id,
        st.state_code,
        st.state_name,
        st.region,
        COUNT(p.project_id) AS projectCount,
        COALESCE(SUM(p.approved_cost), 0) AS totalApprovedCost,
        ROUND(COALESCE(AVG(vls.latest_physical_progress), 0), 2) AS avgPhysicalProgress,
        SUM(CASE WHEN vr.risk_level IN ('HIGH', 'CRITICAL') THEN 1 ELSE 0 END) AS highRiskCount
      FROM states st
      LEFT JOIN projects p ON st.state_id = p.state_id
      LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
      LEFT JOIN v_project_risk_latest vr ON p.project_id = vr.project_id
      GROUP BY st.state_id, st.state_code, st.state_name, st.region
      ORDER BY projectCount DESC, totalApprovedCost DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Risk distribution breakdown (counts & average overrun per tier)
   */
  static async getRiskDistribution() {
    const sql = `
      SELECT 
        risk_level AS riskLevel,
        COUNT(*) AS count,
        ROUND(AVG(overall_risk), 2) AS avgRiskScore,
        ROUND(AVG(cost_risk), 2) AS avgCostRisk,
        ROUND(AVG(time_risk), 2) AS avgTimeRisk,
        ROUND(AVG(implementation_risk), 2) AS avgImplementationRisk,
        ROUND(AVG(predicted_delay_months), 1) AS avgPredictedDelayMonths,
        ROUND(SUM(predicted_final_cost - approved_cost), 2) AS totalPredictedCostOverrun
      FROM v_project_risk_latest
      WHERE risk_level IS NOT NULL
      GROUP BY risk_level
      ORDER BY 
        CASE risk_level 
          WHEN 'CRITICAL' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'MEDIUM' THEN 3 
          WHEN 'LOW' THEN 4 
          ELSE 5 
        END
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Cost summary across all infrastructure projects
   */
  static async getCostSummary() {
    const sql = `
      SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        m.ministry_code,
        s.sector_name,
        p.approved_cost,
        p.revised_cost,
        vcs.current_sanctioned_cost,
        vcs.cost_revision_escalation_pct,
        vcs.total_expenditure_to_date,
        vcs.remaining_funds_required,
        vcs.budget_utilization_pct
      FROM v_project_cost_summary vcs
      JOIN projects p ON vcs.project_id = p.project_id
      JOIN ministries m ON p.ministry_id = m.ministry_id
      JOIN sectors s ON p.sector_id = s.sector_id
      ORDER BY vcs.cost_revision_escalation_pct DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Macro sector-level progress summary (from v_project_progress_summary)
   */
  static async getProgressSummary() {
    const sql = `SELECT * FROM v_project_progress_summary ORDER BY total_approved_cost_cr DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }
}

module.exports = DashboardService;
