const express = require('express');
const router = express.Router();
const RiskController = require('../controllers/riskController');

// GET /api/risks - All project risks
router.get('/', RiskController.getAllRisks);

// GET /api/risks/high - High risk projects
router.get('/high', RiskController.getHighRisks);

// GET /api/risks/critical - Critical risk projects
router.get('/critical', RiskController.getCriticalRisks);

// GET /api/risks/trending - Trending / accelerating risk projects
router.get('/trending', RiskController.getTrendingRisks);

// POST /api/risks/predict/:id - Trigger on-demand ML prediction for a project
router.post('/predict/:id', RiskController.predictProjectRisk);

// POST /api/risks/batch-predict - Trigger batch ML prediction across all projects
router.post('/batch-predict', RiskController.batchPredictProjectRisk);

module.exports = router;
