const AIService = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');

class ScenarioController {
  static async simulate(req, res, next) {
    try {
      const { projectId, changes } = req.body;
      if (!projectId || isNaN(parseInt(projectId))) {
        return ApiResponse.error(res, 'Valid numeric projectId is required for What-If simulation', 'BAD_REQUEST', 400);
      }

      const result = await AIService.simulateScenario(parseInt(projectId), changes || {});
      return ApiResponse.success(res, `What-If scenario simulated successfully for Project #${projectId}`, result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScenarioController;
