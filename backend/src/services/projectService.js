const { pool } = require('../config/db');
const { getPaginationParams, buildPaginationMetadata } = require('../utils/pagination');

class ProjectService {
  /**
   * Get paginated, filtered, searched and sorted projects
   */
  static async listProjects(queryParams) {
    const { page, limit, offset } = getPaginationParams(queryParams);

    const conditions = [];
    const params = [];

    // Filter by ministry_id
    if (queryParams.ministry_id) {
      conditions.push('p.ministry_id = ?');
      params.push(queryParams.ministry_id);
    }

    // Filter by sector_id
    if (queryParams.sector_id) {
      conditions.push('p.sector_id = ?');
      params.push(queryParams.sector_id);
    }

    // Filter by state_id
    if (queryParams.state_id) {
      conditions.push('p.state_id = ?');
      params.push(queryParams.state_id);
    }

    // Filter by district_id
    if (queryParams.district_id) {
      conditions.push('p.district_id = ?');
      params.push(queryParams.district_id);
    }

    // Filter by agency_id
    if (queryParams.agency_id) {
      conditions.push('p.agency_id = ?');
      params.push(queryParams.agency_id);
    }

    // Filter by current_status
    if (queryParams.status) {
      conditions.push('p.current_status = ?');
      params.push(queryParams.status);
    }

    // Filter by project_stage
    if (queryParams.project_stage) {
      conditions.push('p.project_stage = ?');
      params.push(queryParams.project_stage);
    }

    // Filter by risk_level
    if (queryParams.risk_level) {
      conditions.push('vr.risk_level = ?');
      params.push(queryParams.risk_level);
    }

    // Search by project_code or project_name
    if (queryParams.search && queryParams.search.trim()) {
      conditions.push('(p.project_code LIKE ? OR p.project_name LIKE ?)');
      const searchWildcard = `%${queryParams.search.trim()}%`;
      params.push(searchWildcard, searchWildcard);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Safe sorting whitelist
    const sortFieldMap = {
      project_id: 'p.project_id',
      project_code: 'p.project_code',
      project_name: 'p.project_name',
      approved_cost: 'p.approved_cost',
      revised_cost: 'p.revised_cost',
      planned_completion_date: 'p.planned_completion_date',
      current_status: 'p.current_status',
      created_at: 'p.created_at',
      overall_risk: 'vr.overall_risk',
      physical_progress: 'vls.latest_physical_progress'
    };

    const sortBy = sortFieldMap[queryParams.sortBy] || 'p.project_id';
    const sortOrder = queryParams.sortOrder && queryParams.sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Count query
    const countSql = `
      SELECT COUNT(DISTINCT p.project_id) AS total
      FROM projects p
      LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
      LEFT JOIN v_project_risk_latest vr ON p.project_id = vr.project_id
      ${whereClause}
    `;

    const [countRows] = await pool.query(countSql, params);
    const totalRecords = countRows[0] ? countRows[0].total : 0;

    // Data query
    const dataSql = `
      SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        p.project_description,
        m.ministry_code,
        m.ministry_name,
        s.sector_code,
        s.sector_name,
        ia.agency_code,
        ia.agency_name,
        st.state_code,
        st.state_name,
        d.district_name,
        p.location_description,
        p.latitude,
        p.longitude,
        p.original_cost,
        p.approved_cost,
        p.revised_cost,
        p.approved_date,
        p.planned_start_date,
        p.planned_completion_date,
        p.actual_start_date,
        p.actual_completion_date,
        p.current_status,
        p.project_stage,
        p.priority_category,
        p.source_system,
        vls.latest_physical_progress AS physical_progress,
        vls.latest_financial_progress AS financial_progress,
        vls.cumulative_expenditure,
        vls.schedule_variance_days,
        vr.overall_risk,
        vr.risk_level,
        vr.predicted_delay_months,
        vr.predicted_final_cost
      FROM projects p
      JOIN ministries m ON p.ministry_id = m.ministry_id
      JOIN sectors s ON p.sector_id = s.sector_id
      JOIN implementing_agencies ia ON p.agency_id = ia.agency_id
      JOIN states st ON p.state_id = st.state_id
      LEFT JOIN districts d ON p.district_id = d.district_id
      LEFT JOIN v_project_latest_status vls ON p.project_id = vls.project_id
      LEFT JOIN v_project_risk_latest vr ON p.project_id = vr.project_id
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    const dataParams = [...params, limit, offset];
    const [rows] = await pool.query(dataSql, dataParams);

    const pagination = buildPaginationMetadata(totalRecords, page, limit);

    return { projects: rows, pagination };
  }

  /**
   * Get single project details by ID with master details
   */
  static async getProjectById(projectId) {
    const sql = `
      SELECT 
        p.project_id,
        p.project_code,
        p.project_name,
        p.project_description,
        p.ministry_id,
        m.ministry_code,
        m.ministry_name,
        m.department_name,
        p.sector_id,
        s.sector_code,
        s.sector_name,
        p.agency_id,
        ia.agency_code,
        ia.agency_name,
        ia.agency_type,
        p.state_id,
        st.state_code,
        st.state_name,
        st.region,
        p.district_id,
        d.district_name,
        p.location_description,
        p.latitude,
        p.longitude,
        p.original_cost,
        p.approved_cost,
        p.revised_cost,
        p.approved_date,
        p.planned_start_date,
        p.planned_completion_date,
        p.actual_start_date,
        p.actual_completion_date,
        p.current_status,
        p.project_stage,
        p.priority_category,
        p.source_system,
        p.source_reference,
        p.created_at,
        p.updated_at
      FROM projects p
      JOIN ministries m ON p.ministry_id = m.ministry_id
      JOIN sectors s ON p.sector_id = s.sector_id
      JOIN implementing_agencies ia ON p.agency_id = ia.agency_id
      JOIN states st ON p.state_id = st.state_id
      LEFT JOIN districts d ON p.district_id = d.district_id
      WHERE p.project_id = ?
    `;

    const [rows] = await pool.query(sql, [projectId]);
    return rows[0] || null;
  }

  /**
   * Create new project record
   */
  static async createProject(projectData) {
    const sql = `
      INSERT INTO projects (
        project_code, project_name, project_description, ministry_id, sector_id,
        agency_id, state_id, district_id, location_description, latitude, longitude,
        original_cost, revised_cost, approved_cost, approved_date, planned_start_date,
        planned_completion_date, actual_start_date, actual_completion_date,
        current_status, project_stage, priority_category, source_system, source_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      projectData.project_code,
      projectData.project_name,
      projectData.project_description || null,
      projectData.ministry_id,
      projectData.sector_id,
      projectData.agency_id,
      projectData.state_id,
      projectData.district_id || null,
      projectData.location_description || null,
      projectData.latitude || null,
      projectData.longitude || null,
      projectData.original_cost !== undefined && projectData.original_cost !== null ? projectData.original_cost : projectData.approved_cost,
      projectData.revised_cost || null,
      projectData.approved_cost,
      projectData.approved_date,
      projectData.planned_start_date,
      projectData.planned_completion_date,
      projectData.actual_start_date || null,
      projectData.actual_completion_date || null,
      projectData.current_status || 'ONGOING',
      projectData.project_stage || 'EXECUTION',
      projectData.priority_category || 'REGULAR',
      projectData.source_system || 'PAIMANA',
      projectData.source_reference || null
    ];

    const [result] = await pool.query(sql, params);
    return await this.getProjectById(result.insertId);
  }

  /**
   * Update existing project metadata
   */
  static async updateProject(projectId, updateData) {
    const existing = await this.getProjectById(projectId);
    if (!existing) return null;

    const allowedFields = [
      'project_name', 'project_description', 'ministry_id', 'sector_id', 'agency_id',
      'state_id', 'district_id', 'location_description', 'latitude', 'longitude',
      'original_cost', 'revised_cost', 'approved_cost', 'approved_date',
      'planned_start_date', 'planned_completion_date', 'actual_start_date',
      'actual_completion_date', 'current_status', 'project_stage', 'priority_category',
      'source_system', 'source_reference'
    ];

    const setClauses = [];
    const params = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(updateData[field]);
      }
    }

    if (setClauses.length === 0) {
      return existing;
    }

    params.push(projectId);
    const sql = `UPDATE projects SET ${setClauses.join(', ')} WHERE project_id = ?`;
    await pool.query(sql, params);

    return await this.getProjectById(projectId);
  }

  /**
   * Safe soft closure/deletion for projects
   */
  static async deleteProject(projectId) {
    const existing = await this.getProjectById(projectId);
    if (!existing) return null;

    // Check if project has historical monthly data
    const [monthlyRows] = await pool.query(
      'SELECT COUNT(*) AS count FROM project_monthly_data WHERE project_id = ?',
      [projectId]
    );

    if (monthlyRows[0].count > 0) {
      // Soft close the project
      await pool.query(
        "UPDATE projects SET current_status = 'CLOSED' WHERE project_id = ?",
        [projectId]
      );
      return {
        action: 'SOFT_CLOSED',
        message: 'Project status marked as CLOSED to preserve historical monthly monitoring data.'
      };
    }

    // If no monitoring records exist, hard delete is safe
    await pool.query('DELETE FROM projects WHERE project_id = ?', [projectId]);
    return {
      action: 'DELETED',
      message: 'Project record deleted successfully.'
    };
  }

  /**
   * Get Project 360° Comprehensive Overview
   */
  static async getProjectOverview(projectId) {
    const project = await this.getProjectById(projectId);
    if (!project) return null;

    // 1. Latest monthly data
    const [latestMonthly] = await pool.query(
      `SELECT * FROM project_monthly_data WHERE project_id = ? ORDER BY reporting_month DESC LIMIT 1`,
      [projectId]
    );

    // 2. Latest risk prediction & model
    const [latestRisk] = await pool.query(
      `SELECT rp.*, mv.model_name, mv.version_number AS model_version
       FROM risk_predictions rp
       LEFT JOIN model_versions mv ON rp.model_version_id = mv.model_version_id
       WHERE rp.project_id = ?
       ORDER BY rp.prediction_date DESC LIMIT 1`,
      [projectId]
    );

    // 3. Top SHAP risk factors if prediction exists
    let riskFactors = [];
    if (latestRisk.length > 0) {
      const [factors] = await pool.query(
        `SELECT factor_name, factor_code, impact_value, impact_percentage, direction, rank_order, explanation
         FROM risk_factors
         WHERE prediction_id = ?
         ORDER BY rank_order ASC`,
        [latestRisk[0].prediction_id]
      );
      riskFactors = factors;
    }

    // 4. Milestones summary
    const [milestones] = await pool.query(
      `SELECT milestone_id, milestone_code, milestone_name, planned_date, revised_date, actual_date, status, delay_days, criticality
       FROM milestones
       WHERE project_id = ?
       ORDER BY planned_date ASC`,
      [projectId]
    );

    // 5. Active alerts
    const [alerts] = await pool.query(
      `SELECT alert_id, alert_type, severity, title, message, status, generated_at
       FROM alerts
       WHERE project_id = ? AND status IN ('NEW', 'ACKNOWLEDGED')
       ORDER BY generated_at DESC`,
      [projectId]
    );

    // 6. Active recommendations
    const [recommendations] = await pool.query(
      `SELECT recommendation_id, recommendation_type, priority, recommendation_text, rationale, generated_by, status
       FROM recommendations
       WHERE project_id = ? AND status IN ('PENDING', 'ACCEPTED')
       ORDER BY created_at DESC`,
      [projectId]
    );

    return {
      project,
      latestMonthlyData: latestMonthly[0] || null,
      latestRisk: latestRisk[0] || null,
      riskFactors,
      milestones,
      activeAlerts: alerts,
      activeRecommendations: recommendations
    };
  }

  /**
   * Get Project Chronological Timeline Events
   */
  static async getProjectTimeline(projectId) {
    const project = await this.getProjectById(projectId);
    if (!project) return null;

    const events = [];

    // Project Approval Event
    if (project.approved_date) {
      events.push({
        eventDate: project.approved_date,
        eventType: 'PROJECT_APPROVED',
        title: 'Project Sanction & Approval',
        description: `Approved cost ₹${project.approved_cost} Cr sanctioned by ${project.ministry_name}.`,
        metadata: { approvedCost: project.approved_cost }
      });
    }

    // Planned Start Date
    if (project.planned_start_date) {
      events.push({
        eventDate: project.planned_start_date,
        eventType: 'PROJECT_PLANNED_START',
        title: 'Planned Construction Commencement',
        description: 'Scheduled execution commencement date according to original sanction.',
        metadata: {}
      });
    }

    // Actual Start Date
    if (project.actual_start_date) {
      events.push({
        eventDate: project.actual_start_date,
        eventType: 'PROJECT_ACTUAL_START',
        title: 'Ground Work Commenced',
        description: 'Actual physical ground work commenced on site.',
        metadata: {}
      });
    }

    // Milestones
    const [milestones] = await pool.query(
      `SELECT milestone_name, planned_date, revised_date, actual_date, status, delay_days, criticality 
       FROM milestones WHERE project_id = ?`,
      [projectId]
    );

    for (const m of milestones) {
      const eventDate = m.actual_date || m.revised_date || m.planned_date;
      events.push({
        eventDate,
        eventType: 'MILESTONE',
        title: `Milestone: ${m.milestone_name}`,
        description: `Status: ${m.status} | Criticality: ${m.criticality}${m.delay_days ? ` | Delay: ${m.delay_days} days` : ''}`,
        metadata: m
      });
    }

    // Monthly Monitoring Records
    const [monthly] = await pool.query(
      `SELECT reporting_month, physical_progress, financial_progress, cumulative_expenditure, schedule_variance_days, remarks 
       FROM project_monthly_data WHERE project_id = ? ORDER BY reporting_month ASC`,
      [projectId]
    );

    for (const mon of monthly) {
      events.push({
        eventDate: mon.reporting_month,
        eventType: 'MONTHLY_MONITORING',
        title: `Monthly Progress: ${Number(mon.physical_progress).toFixed(1)}%`,
        description: `Financial Progress: ${Number(mon.financial_progress).toFixed(1)}% | Spend: ₹${mon.cumulative_expenditure} Cr`,
        metadata: mon
      });
    }

    // Risk Predictions
    const [predictions] = await pool.query(
      `SELECT prediction_date, overall_risk, risk_level, predicted_delay_months, predicted_final_cost, prediction_explanation 
       FROM risk_predictions WHERE project_id = ? ORDER BY prediction_date ASC`,
      [projectId]
    );

    for (const p of predictions) {
      events.push({
        eventDate: p.prediction_date,
        eventType: 'RISK_PREDICTION',
        title: `AI Risk Assessment: ${p.risk_level} (${Number(p.overall_risk).toFixed(1)}%)`,
        description: p.prediction_explanation || `Predicted delay: ${p.predicted_delay_months}m`,
        metadata: p
      });
    }

    // Early Warning Alerts
    const [alerts] = await pool.query(
      `SELECT generated_at, alert_type, severity, title, message 
       FROM alerts WHERE project_id = ? ORDER BY generated_at ASC`,
      [projectId]
    );

    for (const a of alerts) {
      events.push({
        eventDate: a.generated_at,
        eventType: 'EARLY_WARNING_ALERT',
        title: `Alert [${a.severity}]: ${a.title}`,
        description: a.message,
        metadata: a
      });
    }

    // Sort chronologically ascending
    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return {
      projectId: Number(projectId),
      projectCode: project.project_code,
      projectName: project.project_name,
      totalEvents: events.length,
      timeline: events
    };
  }
}

module.exports = ProjectService;
