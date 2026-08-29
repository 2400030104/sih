const MilestoneService = require('../services/milestoneService');
const RealtimeService = require('../services/realtimeService');
const ApiResponse = require('../utils/apiResponse');

class MilestoneController {
  static async createMilestone(req, res, next) {
    try {
      const milestone = await MilestoneService.createMilestone(req.params.id, req.body);
      
      // Emit Real-time Event
      RealtimeService.emitMilestoneCreated({
        projectId: parseInt(req.params.id, 10),
        milestoneId: milestone.milestone_id,
        milestoneCode: milestone.milestone_code,
        milestoneName: milestone.milestone_name,
        status: milestone.status
      });

      return ApiResponse.success(res, 'Milestone created successfully', milestone, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateMilestone(req, res, next) {
    try {
      const milestone = await MilestoneService.updateMilestone(
        req.params.id,
        req.params.milestoneId,
        req.body
      );
      if (!milestone) {
        return ApiResponse.error(res, 'Milestone not found', 'MILESTONE_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitMilestoneUpdated({
        projectId: parseInt(req.params.id, 10),
        milestoneId: parseInt(req.params.milestoneId, 10),
        milestoneName: milestone.milestone_name,
        status: milestone.status,
        delayDays: milestone.delay_days
      });

      return ApiResponse.success(res, 'Milestone updated successfully', milestone);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMilestone(req, res, next) {
    try {
      const deleted = await MilestoneService.deleteMilestone(
        req.params.id,
        req.params.milestoneId
      );
      if (!deleted) {
        return ApiResponse.error(res, 'Milestone not found', 'MILESTONE_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitMilestoneDeleted({
        projectId: parseInt(req.params.id, 10),
        milestoneId: parseInt(req.params.milestoneId, 10)
      });

      return ApiResponse.success(res, 'Milestone deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MilestoneController;
