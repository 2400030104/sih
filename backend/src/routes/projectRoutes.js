const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const MonthlyDataController = require('../controllers/monthlyDataController');
const MilestoneController = require('../controllers/milestoneController');
const validate = require('../middleware/validationMiddleware');
const {
  validateProjectId,
  validateCreateProject,
  validateUpdateProject,
  validateProjectListQuery
} = require('../validators/projectValidator');
const {
  validateCreateMonthlyData,
  validateUpdateMonthlyData
} = require('../validators/monthlyDataValidator');
const {
  validateCreateMilestone,
  validateUpdateMilestone,
  validateMilestoneId
} = require('../validators/milestoneValidator');

// GET /api/projects - List paginated & filtered projects
router.get('/', validateProjectListQuery, validate, ProjectController.listProjects);

// POST /api/projects - Create project
router.post('/', validateCreateProject, validate, ProjectController.createProject);

// GET /api/projects/:id - Project details
router.get('/:id', validateProjectId, validate, ProjectController.getProjectById);

// PUT /api/projects/:id - Update project
router.put('/:id', validateUpdateProject, validate, ProjectController.updateProject);

// DELETE /api/projects/:id - Soft close / delete project
router.delete('/:id', validateProjectId, validate, ProjectController.deleteProject);

// GET /api/projects/:id/overview - Project 360 overview
router.get('/:id/overview', validateProjectId, validate, ProjectController.getProjectOverview);

// GET /api/projects/:id/timeline - Chronological events
router.get('/:id/timeline', validateProjectId, validate, ProjectController.getProjectTimeline);

// GET /api/projects/:id/analytics - Analytical features
router.get('/:id/analytics', validateProjectId, validate, ProjectController.getProjectAnalytics);

// GET /api/projects/:id/monthly - Monthly monitoring history
router.get('/:id/monthly', validateProjectId, validate, ProjectController.getProjectMonthly);

// POST /api/projects/:id/monthly - Create monthly monitoring observation
router.post('/:id/monthly', validateCreateMonthlyData, validate, MonthlyDataController.createMonthlyData);

// GET /api/projects/:id/monthly/latest - Latest monthly monitoring record
router.get('/:id/monthly/latest', validateProjectId, validate, ProjectController.getProjectMonthlyLatest);

// PUT /api/projects/:id/monthly/:monthlyDataId - Update monthly monitoring observation
router.put('/:id/monthly/:monthlyDataId', validateUpdateMonthlyData, validate, MonthlyDataController.updateMonthlyData);

// GET /api/projects/:id/milestones - Project milestones
router.get('/:id/milestones', validateProjectId, validate, ProjectController.getProjectMilestones);

// POST /api/projects/:id/milestones - Create milestone
router.post('/:id/milestones', validateCreateMilestone, validate, MilestoneController.createMilestone);

// PUT /api/projects/:id/milestones/:milestoneId - Update milestone
router.put('/:id/milestones/:milestoneId', validateUpdateMilestone, validate, MilestoneController.updateMilestone);

// DELETE /api/projects/:id/milestones/:milestoneId - Delete milestone
router.delete('/:id/milestones/:milestoneId', validateMilestoneId, validate, MilestoneController.deleteMilestone);

// GET /api/projects/:id/risk - Latest risk prediction
router.get('/:id/risk', validateProjectId, validate, ProjectController.getProjectRisk);

// GET /api/projects/:id/risk/history - Risk prediction history
router.get('/:id/risk/history', validateProjectId, validate, ProjectController.getProjectRiskHistory);

// GET /api/projects/:id/risk/factors - Latest SHAP risk factors
router.get('/:id/risk/factors', validateProjectId, validate, ProjectController.getProjectRiskFactors);

// GET /api/projects/:id/alerts - Project alerts
router.get('/:id/alerts', validateProjectId, validate, ProjectController.getProjectAlerts);

// GET /api/projects/:id/recommendations - Project recommendations
router.get('/:id/recommendations', validateProjectId, validate, ProjectController.getProjectRecommendations);

module.exports = router;
