const { pool } = require('../config/db');
const {
  safeDivide,
  calculateCostRevisionRatio,
  calculateExpenditureRatio,
  calculatePhysicalFinancialGap,
  calculateProgressVelocity,
  calculateProgressSlowdown
} = require('../utils/calculations');

/**
 * Feature Engineering Service
 * Computes derived analytical and predictive features from raw MySQL records
 */
class FeatureService {
  /**
   * Calculate complete analytical feature set for a single project
   */
  static async calculateProjectFeatures(projectId) {
    // 1. Fetch project master record
    const [projectRows] = await pool.query(
      `SELECT original_cost, approved_cost, revised_cost, planned_start_date, planned_completion_date 
       FROM projects WHERE project_id = ?`,
      [projectId]
    );

    if (projectRows.length === 0) {
      return null;
    }

    const project = projectRows[0];

    // 2. Fetch last 3 monthly monitoring records ordered by reporting_month DESC
    const [monthlyRows] = await pool.query(
      `SELECT reporting_month, expenditure, cumulative_expenditure, physical_progress, 
              financial_progress, planned_progress, schedule_variance_days, cost_variance,
              milestones_delayed, milestones_completed
       FROM project_monthly_data 
       WHERE project_id = ? 
       ORDER BY reporting_month DESC 
       LIMIT 3`,
      [projectId]
    );

    // 3. Fetch milestone delay metrics
    const [milestoneStats] = await pool.query(
      `SELECT 
         COUNT(milestone_id) AS total_milestones,
         SUM(CASE WHEN status = 'DELAYED' THEN 1 ELSE 0 END) AS delayed_count,
         SUM(CASE WHEN status = 'DELAYED' AND criticality = 'CRITICAL' THEN 1 ELSE 0 END) AS critical_delayed_count,
         AVG(CASE WHEN delay_days > 0 THEN delay_days ELSE NULL END) AS avg_delay_days,
         MAX(delay_days) AS max_delay_days
       FROM milestones 
       WHERE project_id = ?`,
      [projectId]
    );

    const mStats = milestoneStats[0] || {};

    const latest = monthlyRows[0] || {};
    const previous = monthlyRows[1] || null;
    const prePrevious = monthlyRows[2] || null;

    // Calculations
    const costRevisionRatio = calculateCostRevisionRatio(project.revised_cost, project.approved_cost);
    const totalCurrentCost = project.revised_cost || project.approved_cost;
    const expenditureRatio = calculateExpenditureRatio(latest.cumulative_expenditure, totalCurrentCost);
    const physicalFinancialGap = calculatePhysicalFinancialGap(latest.financial_progress, latest.physical_progress);

    // Velocities
    let progressVelocity = 0;
    let progressSlowdown = 0;

    if (previous) {
      progressVelocity = calculateProgressVelocity(latest.physical_progress, previous.physical_progress);
      if (prePrevious) {
        const prevVelocity = calculateProgressVelocity(previous.physical_progress, prePrevious.physical_progress);
        progressSlowdown = calculateProgressSlowdown(progressVelocity, prevVelocity);
      }
    }

    return {
      projectId: Number(projectId),
      latestReportingMonth: latest.reporting_month || null,
      latestPhysicalProgress: latest.physical_progress !== undefined ? Number(latest.physical_progress) : 0,
      latestFinancialProgress: latest.financial_progress !== undefined ? Number(latest.financial_progress) : 0,
      latestPlannedProgress: latest.planned_progress !== undefined ? Number(latest.planned_progress) : 0,
      progressVelocity,
      progressSlowdown,
      physicalFinancialGap,
      milestoneDelayCount: Number(mStats.delayed_count || 0),
      criticalMilestoneDelayCount: Number(mStats.critical_delayed_count || 0),
      averageMilestoneDelayDays: Number(Number(mStats.avg_delay_days || 0).toFixed(1)),
      maxMilestoneDelayDays: Number(mStats.max_delay_days || 0),
      scheduleVarianceDays: latest.schedule_variance_days !== undefined ? Number(latest.schedule_variance_days) : 0,
      costRevisionRatio,
      expenditureRatio
    };
  }
}

module.exports = FeatureService;
