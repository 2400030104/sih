const fs = require('fs');
const { pool } = require('../config/db');
const { execFile } = require('child_process');
const path = require('path');
const RealtimeService = require('./realtimeService');

class RiskService {
  /**
   * Get latest risk prediction for a project
   */
  static async getLatestRiskByProject(projectId) {
    const sql = `
      SELECT 
        rp.prediction_id AS predictionId,
        rp.project_id AS projectId,
        p.project_code AS projectCode,
        p.project_name AS projectName,
        rp.cost_risk AS costRisk,
        rp.time_risk AS timeRisk,
        rp.implementation_risk AS implementationRisk,
        rp.overall_risk AS overallRisk,
        rp.risk_level AS riskLevel,
        rp.predicted_final_cost AS predictedFinalCost,
        rp.predicted_delay_months AS predictedDelayMonths,
        rp.predicted_completion_date AS predictedCompletionDate,
        rp.confidence_score AS confidenceScore,
        rp.prediction_explanation AS predictionExplanation,
        rp.prediction_date AS predictionDate,
        mv.model_name AS modelName,
        mv.version_number AS modelVersion
      FROM risk_predictions rp
      JOIN projects p ON rp.project_id = p.project_id
      LEFT JOIN model_versions mv ON rp.model_version_id = mv.model_version_id
      WHERE rp.project_id = ?
      ORDER BY rp.prediction_date DESC, rp.prediction_id DESC
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [projectId]);
    return rows[0] || null;
  }

  /**
   * Get risk trajectory history for a project
   */
  static async getRiskHistoryByProject(projectId) {
    const sql = `
      SELECT 
        rp.prediction_id AS predictionId,
        rp.project_id AS projectId,
        rp.prediction_date AS predictionDate,
        rp.cost_risk AS costRisk,
        rp.time_risk AS timeRisk,
        rp.implementation_risk AS implementationRisk,
        rp.overall_risk AS overallRisk,
        rp.risk_level AS riskLevel,
        rp.predicted_delay_months AS predictedDelayMonths,
        rp.predicted_final_cost AS predictedFinalCost,
        rp.confidence_score AS confidenceScore
      FROM risk_predictions rp
      WHERE rp.project_id = ?
      ORDER BY rp.prediction_date ASC, rp.prediction_id ASC
    `;

    const [rows] = await pool.query(sql, [projectId]);
    return rows;
  }

  /**
   * Get SHAP/explainable risk factors for latest prediction
   */
  static async getRiskFactorsByProject(projectId) {
    const latestRisk = await this.getLatestRiskByProject(projectId);
    if (!latestRisk) return [];

    const sql = `
      SELECT 
        factor_name AS factor,
        factor_code AS factorCode,
        impact_value AS impactValue,
        impact_percentage AS impact,
        direction,
        rank_order AS \`rank\`,
        explanation
      FROM risk_factors
      WHERE prediction_id = ?
      ORDER BY rank_order ASC
    `;

    const [rows] = await pool.query(sql, [latestRisk.predictionId]);
    return rows;
  }

  /**
   * Get latest risks for all projects
   */
  static async getAllRisks() {
    const sql = `SELECT * FROM v_project_risk_latest ORDER BY overall_risk DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Get high risk projects (risk_level = 'HIGH')
   */
  static async getHighRisks() {
    const sql = `SELECT * FROM v_project_risk_latest WHERE risk_level = 'HIGH' ORDER BY overall_risk DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Get critical risk projects (risk_level = 'CRITICAL')
   */
  static async getCriticalRisks() {
    const sql = `SELECT * FROM v_project_risk_latest WHERE risk_level = 'CRITICAL' ORDER BY overall_risk DESC`;
    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Get projects with trending/accelerating risk
   */
  static async getTrendingRisks() {
    const sql = `
      SELECT *
      FROM v_project_risk_trend
      WHERE risk_acceleration > 0
      ORDER BY risk_acceleration DESC, overall_risk DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  }

  /**
   * Trigger Python ML prediction model for a specific project
   */
  static async triggerMLPrediction(projectId) {
    return new Promise((resolve, reject) => {
      const venvPython = path.resolve(__dirname, '../../../ml_service/.venv/Scripts/python.exe');
      const pythonExecutable = fs.existsSync(venvPython) ? venvPython : (process.env.PYTHON_PATH || 'python');
      const pythonCode = `
import sys
from ml_service.pipelines.inference_pipeline import predict_and_persist_project
import json
res = predict_and_persist_project(${parseInt(projectId, 10)})
print("###JSON_START###")
print(json.dumps(res, default=str))
print("###JSON_END###")
      `;

      execFile(
        pythonExecutable,
        ['-c', pythonCode],
        { cwd: path.resolve(__dirname, '../../../') },
        async (error, stdout, stderr) => {
          if (error) {
            console.error('[ML Execution Error]', stderr || error.message);
            return reject(new Error(`ML Prediction failed: ${stderr || error.message}`));
          }

          try {
            const match = stdout.match(/###JSON_START###([\s\S]*?)###JSON_END###/);
            const jsonStr = match ? match[1].trim() : '{}';
            const predictionResult = JSON.parse(jsonStr);

            // Fetch fresh latest risk from DB
            const latestRisk = await RiskService.getLatestRiskByProject(projectId);
            const factors = await RiskService.getRiskFactorsByProject(projectId);

            // Emit Real-time Socket.IO events
            RealtimeService.emitRiskUpdated({
              projectId: parseInt(projectId, 10),
              predictionId: latestRisk ? latestRisk.predictionId : predictionResult.prediction_id,
              riskLevel: latestRisk ? latestRisk.riskLevel : predictionResult.risk_scores?.risk_level,
              overallRisk: latestRisk ? latestRisk.overallRisk : predictionResult.risk_scores?.overall_risk_score
            });

            return resolve({
              prediction: latestRisk,
              factors,
              rawResult: predictionResult
            });
          } catch (parseErr) {
            return reject(new Error(`Failed to parse ML output: ${parseErr.message}`));
          }
        }
      );
    });
  }

  /**
   * Trigger Batch Python ML prediction across all projects
   */
  static async triggerBatchMLPrediction() {
    return new Promise((resolve, reject) => {
      const venvPython = path.resolve(__dirname, '../../../ml_service/.venv/Scripts/python.exe');
      const pythonExecutable = fs.existsSync(venvPython) ? venvPython : (process.env.PYTHON_PATH || 'python');
      const pythonCode = `
import sys
from ml_service.pipelines.inference_pipeline import predict_and_persist_batch
import json
res = predict_and_persist_batch()
print("###JSON_START###")
print(json.dumps(res, default=str))
print("###JSON_END###")
      `;

      execFile(
        pythonExecutable,
        ['-c', pythonCode],
        { cwd: path.resolve(__dirname, '../../../') },
        async (error, stdout, stderr) => {
          if (error) {
            console.error('[ML Batch Execution Error]', stderr || error.message);
            return reject(new Error(`ML Batch Prediction failed: ${stderr || error.message}`));
          }

          try {
            const match = stdout.match(/###JSON_START###([\s\S]*?)###JSON_END###/);
            const jsonStr = match ? match[1].trim() : '[]';
            const results = JSON.parse(jsonStr);

            RealtimeService.emitDashboardUpdated({ reason: 'BATCH_ML_PREDICTION' });

            return resolve({
              count: results.length,
              results
            });
          } catch (parseErr) {
            return reject(new Error(`Failed to parse batch ML output: ${parseErr.message}`));
          }
        }
      );
    });
  }
}

module.exports = RiskService;
