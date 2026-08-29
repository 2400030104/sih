const RecommendationService = require('../services/recommendationService');
const RealtimeService = require('../services/realtimeService');
const ApiResponse = require('../utils/apiResponse');

class RecommendationController {
  static async listRecommendations(req, res, next) {
    try {
      const recommendations = await RecommendationService.listRecommendations(req.query);
      return ApiResponse.success(res, 'Recommendations retrieved successfully', recommendations);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!status || !['PENDING', 'ACCEPTED', 'REJECTED', 'IMPLEMENTED'].includes(status)) {
        return ApiResponse.error(
          res,
          'Invalid status. Allowed values: PENDING, ACCEPTED, REJECTED, IMPLEMENTED',
          'INVALID_STATUS',
          422
        );
      }

      const updated = await RecommendationService.updateRecommendationStatus(req.params.id, status);
      if (!updated) {
        return ApiResponse.error(res, 'Recommendation not found', 'RECOMMENDATION_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitRecommendationUpdated({
        recommendationId: updated.recommendation_id,
        projectId: updated.project_id,
        status: updated.status
      });

      return ApiResponse.success(res, 'Recommendation status updated successfully', updated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecommendationController;
