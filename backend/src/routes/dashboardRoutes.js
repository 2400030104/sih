const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/summary - High-level executive overview
router.get('/summary', DashboardController.getSummary);

// GET /api/dashboard/projects-by-sector - Sector distribution
router.get('/projects-by-sector', DashboardController.getProjectsBySector);

// GET /api/dashboard/projects-by-ministry - Ministry distribution
router.get('/projects-by-ministry', DashboardController.getProjectsByMinistry);

// GET /api/dashboard/projects-by-state - Geographic distribution
router.get('/projects-by-state', DashboardController.getProjectsByState);

// GET /api/dashboard/risk-distribution - Risk breakdown
router.get('/risk-distribution', DashboardController.getRiskDistribution);

// GET /api/dashboard/cost-summary - Financial status
router.get('/cost-summary', DashboardController.getCostSummary);

// GET /api/dashboard/progress-summary - Sector physical & financial progress
router.get('/progress-summary', DashboardController.getProgressSummary);

module.exports = router;
