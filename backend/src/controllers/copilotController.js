const AIService = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');

class CopilotController {
  static async chat(req, res, next) {
    try {
      const { message, projectId } = req.body;
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return ApiResponse.error(res, 'User message string is required for Copilot query', 'BAD_REQUEST', 400);
      }

      const response = await AIService.askCopilot(message.trim(), projectId ? parseInt(projectId) : null);
      return ApiResponse.success(res, 'Copilot response generated successfully', response);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectSummary(req, res, next) {
    try {
      const { projectId } = req.params;
      if (!projectId || isNaN(parseInt(projectId))) {
        return ApiResponse.error(res, 'Valid project ID is required', 'BAD_REQUEST', 400);
      }

      const summary = await AIService.generateProjectSummary(parseInt(projectId));
      return ApiResponse.success(res, `Project #${projectId} executive summary generated successfully`, summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CopilotController;
