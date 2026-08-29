const AIService = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');

class InterventionController {
  static async getQueue(req, res, next) {
    try {
      const data = await AIService.getInterventionQueue();
      return ApiResponse.success(res, 'Intervention priority queue retrieved successfully', data);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectIntervention(req, res, next) {
    try {
      const { projectId } = req.params;
      if (!projectId || isNaN(parseInt(projectId))) {
        return ApiResponse.error(res, 'Valid project ID is required', 'BAD_REQUEST', 400);
      }

      const item = await AIService.getSingleProjectIntervention(parseInt(projectId));
      if (!item) {
        return ApiResponse.error(res, `Intervention metrics for Project #${projectId} not found`, 'NOT_FOUND', 404);
      }
      return ApiResponse.success(res, `Intervention metrics for Project #${projectId} retrieved successfully`, item);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = InterventionController;
