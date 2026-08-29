const { pool } = require('../config/db');

class MonthlyDataService {
  /**
   * Get all historical monthly records for a project
   */
  static async listMonthlyData(projectId) {
    const sql = `
      SELECT *
      FROM project_monthly_data
      WHERE project_id = ?
      ORDER BY reporting_month ASC
    `;
    const [rows] = await pool.query(sql, [projectId]);
    return rows;
  }

  /**
   * Get latest monthly monitoring record for a project
   */
  static async getLatestMonthlyData(projectId) {
    const sql = `
      SELECT *
      FROM project_monthly_data
      WHERE project_id = ?
      ORDER BY reporting_month DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [projectId]);
    return rows[0] || null;
  }

  /**
   * Get specific monthly record by ID
   */
  static async getMonthlyDataById(monthlyDataId) {
    const sql = `SELECT * FROM project_monthly_data WHERE monthly_data_id = ?`;
    const [rows] = await pool.query(sql, [monthlyDataId]);
    return rows[0] || null;
  }

  /**
   * Insert new monthly monitoring observation with duplicate constraint check
   */
  static async createMonthlyData(projectId, data) {
    // 1. Verify project exists
    const [projectRows] = await pool.query('SELECT project_id FROM projects WHERE project_id = ?', [projectId]);
    if (projectRows.length === 0) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.errorCode = 'PROJECT_NOT_FOUND';
      throw error;
    }

    // 2. Check for duplicate reporting month
    const [existingRows] = await pool.query(
      'SELECT monthly_data_id FROM project_monthly_data WHERE project_id = ? AND reporting_month = ?',
      [projectId, data.reporting_month]
    );

    if (existingRows.length > 0) {
      const error = new Error('Monthly monitoring data already exists for this project and reporting month');
      error.statusCode = 409;
      error.errorCode = 'DUPLICATE_MONTHLY_RECORD';
      throw error;
    }

    const sql = `
      INSERT INTO project_monthly_data (
        project_id, reporting_month, expenditure, cumulative_expenditure,
        physical_progress, financial_progress, planned_progress, milestones_planned,
        milestones_completed, milestones_delayed, schedule_variance_days, cost_variance,
        manpower_count, remarks, data_source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      projectId,
      data.reporting_month,
      data.expenditure || 0.00,
      data.cumulative_expenditure || 0.00,
      data.physical_progress || 0.00,
      data.financial_progress || 0.00,
      data.planned_progress || 0.00,
      data.milestones_planned || 0,
      data.milestones_completed || 0,
      data.milestones_delayed || 0,
      data.schedule_variance_days || 0,
      data.cost_variance || 0.00,
      data.manpower_count || 0,
      data.remarks || null,
      data.data_source || 'MONTHLY_MONITORING'
    ];

    const [result] = await pool.query(sql, params);
    return await this.getMonthlyDataById(result.insertId);
  }

  /**
   * Update existing monthly record
   */
  static async updateMonthlyData(projectId, monthlyDataId, data) {
    const existing = await this.getMonthlyDataById(monthlyDataId);
    if (!existing || Number(existing.project_id) !== Number(projectId)) {
      return null;
    }

    const allowedFields = [
      'expenditure', 'cumulative_expenditure', 'physical_progress', 'financial_progress',
      'planned_progress', 'milestones_planned', 'milestones_completed', 'milestones_delayed',
      'schedule_variance_days', 'cost_variance', 'manpower_count', 'remarks', 'data_source'
    ];

    const setClauses = [];
    const params = [];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (setClauses.length === 0) {
      return existing;
    }

    params.push(monthlyDataId);
    const sql = `UPDATE project_monthly_data SET ${setClauses.join(', ')} WHERE monthly_data_id = ?`;
    await pool.query(sql, params);

    return await this.getMonthlyDataById(monthlyDataId);
  }
}

module.exports = MonthlyDataService;
