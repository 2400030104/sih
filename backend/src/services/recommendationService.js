const { pool } = require('../config/db');

class RecommendationService {
  /**
   * List recommendations with optional filters
   */
  static async listRecommendations(filters = {}) {
    const conditions = [];
    const params = [];

    if (filters.priority) {
      conditions.push('r.priority = ?');
      params.push(filters.priority);
    }

    if (filters.status) {
      conditions.push('r.status = ?');
      params.push(filters.status);
    }

    if (filters.recommendation_type) {
      conditions.push('r.recommendation_type = ?');
      params.push(filters.recommendation_type);
    }

    if (filters.project_id) {
      conditions.push('r.project_id = ?');
      params.push(filters.project_id);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        r.recommendation_id,
        r.project_id,
        p.project_code,
        p.project_name,
        r.prediction_id,
        r.recommendation_type,
        r.priority,
        r.recommendation_text,
        r.rationale,
        r.generated_by,
        r.status,
        r.created_at,
        r.updated_at
      FROM recommendations r
      JOIN projects p ON r.project_id = p.project_id
      ${whereClause}
      ORDER BY 
        CASE r.priority 
          WHEN 'URGENT' THEN 1 
          WHEN 'HIGH' THEN 2 
          WHEN 'MEDIUM' THEN 3 
          WHEN 'LOW' THEN 4 
          ELSE 5 
        END,
        r.created_at DESC
    `;

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  /**
   * Get recommendations for a specific project
   */
  static async getRecommendationsByProject(projectId) {
    return await this.listRecommendations({ project_id: projectId });
  }

  /**
   * Get recommendation by ID
   */
  static async getRecommendationById(recommendationId) {
    const sql = `SELECT * FROM recommendations WHERE recommendation_id = ?`;
    const [rows] = await pool.query(sql, [recommendationId]);
    return rows[0] || null;
  }

  /**
   * Update recommendation status (PENDING -> ACCEPTED | REJECTED | IMPLEMENTED)
   */
  static async updateRecommendationStatus(recommendationId, status) {
    const existing = await this.getRecommendationById(recommendationId);
    if (!existing) return null;

    const sql = `UPDATE recommendations SET status = ? WHERE recommendation_id = ?`;
    await pool.query(sql, [status, recommendationId]);

    return await this.getRecommendationById(recommendationId);
  }
}

module.exports = RecommendationService;
