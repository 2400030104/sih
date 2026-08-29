const { pool } = require('../config/db');

class AlertService {
  /**
   * List all alerts with optional filters
   */
  static async listAlerts(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.severity) {
      conditions.push('a.severity = ?');
      params.push(filters.severity);
    }

    if (filters.status) {
      conditions.push('a.status = ?');
      params.push(filters.status);
    }

    if (filters.alert_type) {
      conditions.push('a.alert_type = ?');
      params.push(filters.alert_type);
    }

    if (filters.project_id) {
      conditions.push('a.project_id = ?');
      params.push(filters.project_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        a.alert_id,
        a.project_id,
        p.project_code,
        p.project_name,
        a.prediction_id,
        a.alert_type,
        a.severity,
        a.title,
        a.message,
        a.trigger_value,
        a.threshold_value,
        a.status,
        a.generated_at,
        a.acknowledged_at,
        a.resolved_at,
        u1.full_name AS acknowledged_by_name,
        u2.full_name AS resolved_by_name
      FROM alerts a
      JOIN projects p ON a.project_id = p.project_id
      LEFT JOIN users u1 ON a.acknowledged_by = u1.user_id
      LEFT JOIN users u2 ON a.resolved_by = u2.user_id
      ${whereClause}
      ORDER BY a.generated_at DESC
    `;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  /**
   * Get single alert by ID
   */
  static async getAlertById(alertId) {
    const sql = `
      SELECT 
        a.*,
        p.project_code,
        p.project_name,
        u1.full_name AS acknowledged_by_name,
        u2.full_name AS resolved_by_name
      FROM alerts a
      JOIN projects p ON a.project_id = p.project_id
      LEFT JOIN users u1 ON a.acknowledged_by = u1.user_id
      LEFT JOIN users u2 ON a.resolved_by = u2.user_id
      WHERE a.alert_id = ?
    `;

    const [rows] = await pool.query(sql, [alertId]);
    return rows[0] || null;
  }

  /**
   * Get alerts for a project
   */
  static async getAlertsByProject(projectId) {
    return await this.listAlerts({ project_id: projectId });
  }

  /**
   * Get all HIGH severity alerts
   */
  static async getHighAlerts() {
    return await this.listAlerts({ severity: 'HIGH' });
  }

  /**
   * Get all CRITICAL severity alerts
   */
  static async getCriticalAlerts() {
    return await this.listAlerts({ severity: 'CRITICAL' });
  }

  /**
   * Acknowledge an alert
   */
  static async acknowledgeAlert(alertId, userId = null) {
    const existing = await this.getAlertById(alertId);
    if (!existing) return null;

    const sql = `
      UPDATE alerts 
      SET status = 'ACKNOWLEDGED', acknowledged_at = CURRENT_TIMESTAMP, acknowledged_by = ?
      WHERE alert_id = ?
    `;

    await pool.query(sql, [userId, alertId]);
    return await this.getAlertById(alertId);
  }

  /**
   * Resolve an alert
   */
  static async resolveAlert(alertId, userId = null) {
    const existing = await this.getAlertById(alertId);
    if (!existing) return null;

    const sql = `
      UPDATE alerts 
      SET status = 'RESOLVED', resolved_at = CURRENT_TIMESTAMP, resolved_by = ?
      WHERE alert_id = ?
    `;

    await pool.query(sql, [userId, alertId]);
    return await this.getAlertById(alertId);
  }
}

module.exports = AlertService;
