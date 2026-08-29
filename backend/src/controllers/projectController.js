const ProjectService = require('../services/projectService');
const FeatureService = require('../services/featureService');
const MonthlyDataService = require('../services/monthlyDataService');
const MilestoneService = require('../services/milestoneService');
const RiskService = require('../services/riskService');
const AlertService = require('../services/alertService');
const RecommendationService = require('../services/recommendationService');
const RealtimeService = require('../services/realtimeService');
const ApiResponse = require('../utils/apiResponse');

class ProjectController {
  static async listProjects(req, res, next) {
    try {
      const result = await ProjectService.listProjects(req.query);
      return ApiResponse.success(res, 'Projects retrieved successfully', result.projects, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectById(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      return ApiResponse.success(res, 'Project details retrieved successfully', project);
    } catch (error) {
      next(error);
    }
  }

  static async createProject(req, res, next) {
    try {
      const project = await ProjectService.createProject(req.body);
      
      // Emit Real-time Event
      RealtimeService.emitProjectCreated({
        projectId: project.project_id,
        projectCode: project.project_code,
        projectName: project.project_name,
        currentStatus: project.current_status
      });

      return ApiResponse.success(res, 'Project created successfully', project, null, 201);
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(req, res, next) {
    try {
      const project = await ProjectService.updateProject(req.params.id, req.body);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitProjectUpdated({
        projectId: project.project_id,
        projectCode: project.project_code,
        projectName: project.project_name,
        currentStatus: project.current_status
      });

      return ApiResponse.success(res, 'Project updated successfully', project);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      const result = await ProjectService.deleteProject(req.params.id);
      if (!result) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitProjectDeleted({
        projectId: parseInt(req.params.id, 10),
        action: result.action
      });

      return ApiResponse.success(res, result.message, { action: result.action });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectOverview(req, res, next) {
    try {
      const overview = await ProjectService.getProjectOverview(req.params.id);
      if (!overview) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      return ApiResponse.success(res, 'Project 360° overview retrieved successfully', overview);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectTimeline(req, res, next) {
    try {
      const timeline = await ProjectService.getProjectTimeline(req.params.id);
      if (!timeline) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      return ApiResponse.success(res, 'Project chronological timeline retrieved successfully', timeline);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectAnalytics(req, res, next) {
    try {
      const features = await FeatureService.calculateProjectFeatures(req.params.id);
      if (!features) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      return ApiResponse.success(res, 'Project analytical features retrieved successfully', features);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectMonthly(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const monthly = await MonthlyDataService.listMonthlyData(req.params.id);
      return ApiResponse.success(res, 'Monthly monitoring data retrieved successfully', monthly);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectMonthlyLatest(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const latest = await MonthlyDataService.getLatestMonthlyData(req.params.id);
      return ApiResponse.success(res, 'Latest monthly monitoring record retrieved successfully', latest);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectMilestones(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const milestones = await MilestoneService.listMilestones(req.params.id);
      return ApiResponse.success(res, 'Milestones retrieved successfully', milestones);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectRisk(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const risk = await RiskService.getLatestRiskByProject(req.params.id);
      return ApiResponse.success(res, 'Latest risk prediction retrieved successfully', risk);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectRiskHistory(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const history = await RiskService.getRiskHistoryByProject(req.params.id);
      return ApiResponse.success(res, 'Risk prediction history trajectory retrieved successfully', history);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectRiskFactors(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const factors = await RiskService.getRiskFactorsByProject(req.params.id);
      return ApiResponse.success(res, 'Explainable risk factors retrieved successfully', factors);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectAlerts(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const alerts = await AlertService.getAlertsByProject(req.params.id);
      return ApiResponse.success(res, 'Project early warning alerts retrieved successfully', alerts);
    } catch (error) {
      next(error);
    }
  }

  static async getProjectRecommendations(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      if (!project) {
        return ApiResponse.error(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
      }
      const recommendations = await RecommendationService.getRecommendationsByProject(req.params.id);
      return ApiResponse.success(res, 'Project recommendations retrieved successfully', recommendations);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
