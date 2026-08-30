const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');
const AIService = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');

// GET /api/recommendations - All active recommendations
router.get('/', RecommendationController.listRecommendations);

// PATCH & PUT /api/recommendations/:id/status - Update recommendation status
router.patch('/:id/status', RecommendationController.updateStatus);
router.put('/:id/status', RecommendationController.updateStatus);

// POST /api/recommendations/generate/:projectId - Trigger rule-based recommendation generation
router.post('/generate/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const recs = await AIService.generateRecommendations(parseInt(projectId));
    return ApiResponse.success(res, `Structured recommendations generated for Project #${projectId}`, recs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
