const RiskService = require('../services/riskService');
const ApiResponse = require('../utils/apiResponse');

class RiskController {
  static async getAllRisks(req, res, next) {
    try {
      const risks = await RiskService.getAllRisks();
      return ApiResponse.success(res, 'Risk overview retrieved successfully', risks);
    } catch (error) {
      next(error);
    }
  }

  static async getHighRisks(req, res, next) {
    try {
      const highRisks = await RiskService.getHighRisks();
      return ApiResponse.success(res, 'High risk projects retrieved successfully', highRisks);
    } catch (error) {
      next(error);
    }
  }

  static async getCriticalRisks(req, res, next) {
    try {
      const criticalRisks = await RiskService.getCriticalRisks();
      return ApiResponse.success(res, 'Critical risk projects retrieved successfully', criticalRisks);
    } catch (error) {
      next(error);
    }
  }

  static async getTrendingRisks(req, res, next) {
    try {
      const trending = await RiskService.getTrendingRisks();
      return ApiResponse.success(res, 'Trending risk projects retrieved successfully', trending);
    } catch (error) {
      next(error);
    }
  }

  static async predictProjectRisk(req, res, next) {
    try {
      const result = await RiskService.triggerMLPrediction(req.params.id);
      return ApiResponse.success(res, `Machine learning risk prediction generated for Project #${req.params.id}`, result);
    } catch (error) {
      next(error);
    }
  }

  static async batchPredictProjectRisk(req, res, next) {
    try {
      const result = await RiskService.triggerBatchMLPrediction();
      return ApiResponse.success(res, `Batch ML prediction completed for ${result.count} projects`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RiskController;
