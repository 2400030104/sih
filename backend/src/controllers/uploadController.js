const stream = require('stream');
const csv = require('csv-parser');
const { pool } = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

class UploadController {
  /**
   * Parse CSV Buffer into Array of Objects
   */
  static parseCsvBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const results = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      bufferStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }

  /**
   * Bulk Upload Projects from CSV
   */
  static async uploadProjects(req, res, next) {
    if (!req.file) {
      return ApiResponse.error(res, 'No CSV file uploaded', 'FILE_REQUIRED', 400);
    }

    let rows;
    try {
      rows = await UploadController.parseCsvBuffer(req.file.buffer);
    } catch (parseError) {
      return ApiResponse.error(res, 'Failed to parse CSV file', 'CSV_PARSE_ERROR', 400, parseError.message);
    }

    const errors = [];
    const validRecords = [];
    const seenCodesInBatch = new Set();

    // 1. Row-level validation
    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 1;
      const row = rows[i];

      const projectCode = (row.project_code || '').trim();
      const projectName = (row.project_name || '').trim();
      const ministryId = parseInt(row.ministry_id, 10);
      const sectorId = parseInt(row.sector_id, 10);
      const agencyId = parseInt(row.agency_id, 10);
      const stateId = parseInt(row.state_id, 10);
      const districtId = row.district_id ? parseInt(row.district_id, 10) : null;
      const originalCost = parseFloat(row.original_cost);
      const approvedCost = parseFloat(row.approved_cost);
      const revisedCost = row.revised_cost ? parseFloat(row.revised_cost) : null;
      const approvedDate = (row.approved_date || '').trim();
      const plannedStartDate = (row.planned_start_date || '').trim();
      const plannedCompletionDate = (row.planned_completion_date || '').trim();

      if (!projectCode) {
        errors.push({ row: rowNum, field: 'project_code', message: 'project_code is required' });
        continue;
      }
      if (seenCodesInBatch.has(projectCode)) {
        errors.push({ row: rowNum, field: 'project_code', message: `Duplicate project_code '${projectCode}' in CSV file` });
        continue;
      }
      if (!projectName) {
        errors.push({ row: rowNum, field: 'project_name', message: 'project_name is required' });
        continue;
      }
      if (!ministryId || ministryId <= 0) {
        errors.push({ row: rowNum, field: 'ministry_id', message: 'Valid positive ministry_id is required' });
        continue;
      }
      if (!sectorId || sectorId <= 0) {
        errors.push({ row: rowNum, field: 'sector_id', message: 'Valid positive sector_id is required' });
        continue;
      }
      if (!agencyId || agencyId <= 0) {
        errors.push({ row: rowNum, field: 'agency_id', message: 'Valid positive agency_id is required' });
        continue;
      }
      if (!stateId || stateId <= 0) {
        errors.push({ row: rowNum, field: 'state_id', message: 'Valid positive state_id is required' });
        continue;
      }
      if (isNaN(originalCost) || originalCost < 0) {
        errors.push({ row: rowNum, field: 'original_cost', message: 'original_cost must be non-negative' });
        continue;
      }
      if (isNaN(approvedCost) || approvedCost < 0) {
        errors.push({ row: rowNum, field: 'approved_cost', message: 'approved_cost must be non-negative' });
        continue;
      }
      if (revisedCost !== null && (isNaN(revisedCost) || revisedCost < 0)) {
        errors.push({ row: rowNum, field: 'revised_cost', message: 'revised_cost must be non-negative' });
        continue;
      }
      if (!approvedDate || isNaN(Date.parse(approvedDate))) {
        errors.push({ row: rowNum, field: 'approved_date', message: 'Valid approved_date (YYYY-MM-DD) is required' });
        continue;
      }
      if (!plannedStartDate || isNaN(Date.parse(plannedStartDate))) {
        errors.push({ row: rowNum, field: 'planned_start_date', message: 'Valid planned_start_date (YYYY-MM-DD) is required' });
        continue;
      }
      if (!plannedCompletionDate || isNaN(Date.parse(plannedCompletionDate))) {
        errors.push({ row: rowNum, field: 'planned_completion_date', message: 'Valid planned_completion_date (YYYY-MM-DD) is required' });
        continue;
      }

      seenCodesInBatch.add(projectCode);
      validRecords.push({
        rowNum,
        project_code: projectCode,
        project_name: projectName,
        project_description: (row.project_description || '').trim() || null,
        ministry_id: ministryId,
        sector_id: sectorId,
        agency_id: agencyId,
        state_id: stateId,
        district_id: districtId,
        location_description: (row.location_description || '').trim() || null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        original_cost: originalCost,
        approved_cost: approvedCost,
        revised_cost: revisedCost,
        approved_date: approvedDate,
        planned_start_date: plannedStartDate,
        planned_completion_date: plannedCompletionDate,
        actual_start_date: (row.actual_start_date || '').trim() || null,
        actual_completion_date: (row.actual_completion_date || '').trim() || null,
        current_status: row.current_status || 'ONGOING',
        project_stage: row.project_stage || 'EXECUTION',
        priority_category: row.priority_category || 'REGULAR',
        source_system: row.source_system || 'DEMO',
        source_reference: (row.source_reference || '').trim() || null
      });
    }

    // 2. Transactional Database Insertion
    const connection = await pool.getConnection();
    let successfulRows = 0;

    try {
      await connection.beginTransaction();

      for (const rec of validRecords) {
        // Check if project_code already exists in database
        const [existing] = await connection.query(
          'SELECT project_id FROM projects WHERE project_code = ?',
          [rec.project_code]
        );

        if (existing.length > 0) {
          errors.push({
            row: rec.rowNum,
            field: 'project_code',
            message: `Project code '${rec.project_code}' already exists in database`
          });
          continue;
        }

        const insertSql = `
          INSERT INTO projects (
            project_code, project_name, project_description, ministry_id, sector_id,
            agency_id, state_id, district_id, location_description, latitude, longitude,
            original_cost, revised_cost, approved_cost, approved_date, planned_start_date,
            planned_completion_date, actual_start_date, actual_completion_date,
            current_status, project_stage, priority_category, source_system, source_reference
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertSql, [
          rec.project_code,
          rec.project_name,
          rec.project_description,
          rec.ministry_id,
          rec.sector_id,
          rec.agency_id,
          rec.state_id,
          rec.district_id,
          rec.location_description,
          rec.latitude,
          rec.longitude,
          rec.original_cost,
          rec.revised_cost,
          rec.approved_cost,
          rec.approved_date,
          rec.planned_start_date,
          rec.planned_completion_date,
          rec.actual_start_date,
          rec.actual_completion_date,
          rec.current_status,
          rec.project_stage,
          rec.priority_category,
          rec.source_system,
          rec.source_reference
        ]);

        successfulRows++;
      }

      await connection.commit();
    } catch (txError) {
      await connection.rollback();
      connection.release();
      return next(txError);
    } finally {
      connection.release();
    }

    return ApiResponse.success(res, 'Project CSV processing complete', {
      totalRows: rows.length,
      successfulRows,
      failedRows: rows.length - successfulRows,
      errors
    });
  }

  /**
   * Bulk Upload Monthly Monitoring Data from CSV
   */
  static async uploadMonthlyData(req, res, next) {
    if (!req.file) {
      return ApiResponse.error(res, 'No CSV file uploaded', 'FILE_REQUIRED', 400);
    }

    let rows;
    try {
      rows = await UploadController.parseCsvBuffer(req.file.buffer);
    } catch (parseError) {
      return ApiResponse.error(res, 'Failed to parse CSV file', 'CSV_PARSE_ERROR', 400, parseError.message);
    }

    const errors = [];
    const validRecords = [];
    const seenCombosInBatch = new Set();

    // 1. Row-level validation
    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 1;
      const row = rows[i];

      const projectCode = (row.project_code || '').trim();
      const reportingMonth = (row.reporting_month || '').trim();
      const expenditure = parseFloat(row.expenditure);
      const cumulativeExpenditure = parseFloat(row.cumulative_expenditure);
      const physicalProgress = parseFloat(row.physical_progress);
      const financialProgress = parseFloat(row.financial_progress);
      const plannedProgress = parseFloat(row.planned_progress);

      if (!projectCode) {
        errors.push({ row: rowNum, field: 'project_code', message: 'project_code is required' });
        continue;
      }
      if (!reportingMonth || isNaN(Date.parse(reportingMonth))) {
        errors.push({ row: rowNum, field: 'reporting_month', message: 'Valid reporting_month (YYYY-MM-DD) is required' });
        continue;
      }

      const comboKey = `${projectCode}_${reportingMonth}`;
      if (seenCombosInBatch.has(comboKey)) {
        errors.push({
          row: rowNum,
          field: 'reporting_month',
          message: `Duplicate record for project '${projectCode}' and month '${reportingMonth}' in CSV`
        });
        continue;
      }

      if (isNaN(expenditure) || expenditure < 0) {
        errors.push({ row: rowNum, field: 'expenditure', message: 'expenditure must be a non-negative number' });
        continue;
      }
      if (isNaN(cumulativeExpenditure) || cumulativeExpenditure < 0) {
        errors.push({ row: rowNum, field: 'cumulative_expenditure', message: 'cumulative_expenditure must be a non-negative number' });
        continue;
      }
      if (isNaN(physicalProgress) || physicalProgress < 0 || physicalProgress > 100) {
        errors.push({ row: rowNum, field: 'physical_progress', message: 'physical_progress must be between 0.00 and 100.00' });
        continue;
      }
      if (isNaN(financialProgress) || financialProgress < 0 || financialProgress > 100) {
        errors.push({ row: rowNum, field: 'financial_progress', message: 'financial_progress must be between 0.00 and 100.00' });
        continue;
      }
      if (isNaN(plannedProgress) || plannedProgress < 0 || plannedProgress > 100) {
        errors.push({ row: rowNum, field: 'planned_progress', message: 'planned_progress must be between 0.00 and 100.00' });
        continue;
      }

      seenCombosInBatch.add(comboKey);
      validRecords.push({
        rowNum,
        project_code: projectCode,
        reporting_month: reportingMonth,
        expenditure,
        cumulative_expenditure: cumulativeExpenditure,
        physical_progress: physicalProgress,
        financial_progress: financialProgress,
        planned_progress: plannedProgress,
        milestones_planned: parseInt(row.milestones_planned, 10) || 0,
        milestones_completed: parseInt(row.milestones_completed, 10) || 0,
        milestones_delayed: parseInt(row.milestones_delayed, 10) || 0,
        schedule_variance_days: parseInt(row.schedule_variance_days, 10) || 0,
        cost_variance: parseFloat(row.cost_variance) || 0.00,
        manpower_count: parseInt(row.manpower_count, 10) || 0,
        remarks: (row.remarks || '').trim() || null,
        data_source: row.data_source || 'CSV_UPLOAD'
      });
    }

    // 2. Transactional Database Insertion
    const connection = await pool.getConnection();
    let successfulRows = 0;

    try {
      await connection.beginTransaction();

      for (const rec of validRecords) {
        // Resolve project_code to project_id
        const [projectRows] = await connection.query(
          'SELECT project_id FROM projects WHERE project_code = ?',
          [rec.project_code]
        );

        if (projectRows.length === 0) {
          errors.push({
            row: rec.rowNum,
            field: 'project_code',
            message: `Project with code '${rec.project_code}' not found in database`
          });
          continue;
        }

        const projectId = projectRows[0].project_id;

        // Check if monthly record already exists for this project and month
        const [existing] = await connection.query(
          'SELECT monthly_data_id FROM project_monthly_data WHERE project_id = ? AND reporting_month = ?',
          [projectId, rec.reporting_month]
        );

        if (existing.length > 0) {
          errors.push({
            row: rec.rowNum,
            field: 'reporting_month',
            message: `Monthly record for project '${rec.project_code}' and month '${rec.reporting_month}' already exists`
          });
          continue;
        }

        const insertSql = `
          INSERT INTO project_monthly_data (
            project_id, reporting_month, expenditure, cumulative_expenditure,
            physical_progress, financial_progress, planned_progress,
            milestones_planned, milestones_completed, milestones_delayed,
            schedule_variance_days, cost_variance, manpower_count, remarks, data_source
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertSql, [
          projectId,
          rec.reporting_month,
          rec.expenditure,
          rec.cumulative_expenditure,
          rec.physical_progress,
          rec.financial_progress,
          rec.planned_progress,
          rec.milestones_planned,
          rec.milestones_completed,
          rec.milestones_delayed,
          rec.schedule_variance_days,
          rec.cost_variance,
          rec.manpower_count,
          rec.remarks,
          rec.data_source
        ]);

        successfulRows++;
      }

      await connection.commit();
    } catch (txError) {
      await connection.rollback();
      connection.release();
      return next(txError);
    } finally {
      connection.release();
    }

    return ApiResponse.success(res, 'Monthly data CSV processing complete', {
      totalRows: rows.length,
      successfulRows,
      failedRows: rows.length - successfulRows,
      errors
    });
  }
}

module.exports = UploadController;
