const MonthlyDataService = require('../services/monthlyDataService');
const RealtimeService = require('../services/realtimeService');
const ApiResponse = require('../utils/apiResponse');

class MonthlyDataController {
  static async createMonthlyData(req, res, next) {
    try {
      const result = await MonthlyDataService.createMonthlyData(req.params.id, req.body);
      
      // Emit Real-time Event
      RealtimeService.emitMonthlyDataAdded({
        projectId: parseInt(req.params.id, 10),
        monthlyDataId: result.monthly_data_id,
        reportingMonth: result.reporting_month,
        physicalProgress: result.physical_progress,
        financialProgress: result.financial_progress,
        expenditure: result.expenditure
      });

      return ApiResponse.success(res, 'Monthly monitoring data recorded successfully', result, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateMonthlyData(req, res, next) {
    try {
      const result = await MonthlyDataService.updateMonthlyData(
        req.params.id,
        req.params.monthlyDataId,
        req.body
      );
      if (!result) {
        return ApiResponse.error(res, 'Monthly monitoring record not found', 'MONTHLY_RECORD_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitMonthlyDataUpdated({
        projectId: parseInt(req.params.id, 10),
        monthlyDataId: parseInt(req.params.monthlyDataId, 10),
        reportingMonth: result.reporting_month,
        physicalProgress: result.physical_progress,
        financialProgress: result.financial_progress
      });

      return ApiResponse.success(res, 'Monthly monitoring record updated successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MonthlyDataController;
