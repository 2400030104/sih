const { pool } = require('../config/db');

class MilestoneService {
  /**
   * List all milestones for a project
   */
  static async listMilestones(projectId) {
    const sql = `
      SELECT *
      FROM milestones
      WHERE project_id = ?
      ORDER BY planned_date ASC
    `;
    const [rows] = await pool.query(sql, [projectId]);
    return rows;
  }

  /**
   * Get specific milestone by ID
   */
  static async getMilestoneById(milestoneId) {
    const sql = `SELECT * FROM milestones WHERE milestone_id = ?`;
    const [rows] = await pool.query(sql, [milestoneId]);
    return rows[0] || null;
  }

  /**
   * Create new milestone for a project
   */
  static async createMilestone(projectId, data) {
    // Verify project exists
    const [projectRows] = await pool.query('SELECT project_id FROM projects WHERE project_id = ?', [projectId]);
    if (projectRows.length === 0) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      error.errorCode = 'PROJECT_NOT_FOUND';
      throw error;
    }

    const sql = `
      INSERT INTO milestones (
        project_id, milestone_code, milestone_name, milestone_description,
        planned_date, revised_date, actual_date, status, delay_days, criticality
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      projectId,
      data.milestone_code,
      data.milestone_name,
      data.milestone_description || null,
      data.planned_date,
      data.revised_date || null,
      data.actual_date || null,
      data.status || 'PLANNED',
      data.delay_days || 0,
      data.criticality || 'MEDIUM'
    ];

    const [result] = await pool.query(sql, params);
    return await this.getMilestoneById(result.insertId);
  }

  /**
   * Update existing milestone
   */
  static async updateMilestone(projectId, milestoneId, data) {
    const existing = await this.getMilestoneById(milestoneId);
    if (!existing || Number(existing.project_id) !== Number(projectId)) {
      return null;
    }

    const allowedFields = [
      'milestone_name', 'milestone_description', 'planned_date', 'revised_date',
      'actual_date', 'status', 'delay_days', 'criticality'
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

    params.push(milestoneId);
    const sql = `UPDATE milestones SET ${setClauses.join(', ')} WHERE milestone_id = ?`;
    await pool.query(sql, params);

    return await this.getMilestoneById(milestoneId);
  }

  /**
   * Delete a milestone
   */
  static async deleteMilestone(projectId, milestoneId) {
    const existing = await this.getMilestoneById(milestoneId);
    if (!existing || Number(existing.project_id) !== Number(projectId)) {
      return false;
    }

    await pool.query('DELETE FROM milestones WHERE milestone_id = ?', [milestoneId]);
    return true;
  }
}

module.exports = MilestoneService;
