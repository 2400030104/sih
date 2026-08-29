const DashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const summary = await DashboardService.getSummaryMetrics();
      return ApiResponse.success(res, 'Dashboard summary metrics retrieved successfully', summary);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectsBySector(req, res, next) {
    try {
      const data = await DashboardService.getProjectsBySector();
      return ApiResponse.success(res, 'Projects by sector retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectsByMinistry(req, res, next) {
    try {
      const data = await DashboardService.getProjectsByMinistry();
      return ApiResponse.success(res, 'Projects by ministry retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectsByState(req, res, next) {
    try {
      const data = await DashboardService.getProjectsByState();
      return ApiResponse.success(res, 'Projects by state retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getRiskDistribution(req, res, next) {
    try {
      const data = await DashboardService.getRiskDistribution();
      return ApiResponse.success(res, 'Risk distribution metrics retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getCostSummary(req, res, next) {
    try {
      const data = await DashboardService.getCostSummary();
      return ApiResponse.success(res, 'Cost summary metrics retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getProgressSummary(req, res, next) {
    try {
      const data = await DashboardService.getProgressSummary();
      return ApiResponse.success(res, 'Sector progress summary retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
