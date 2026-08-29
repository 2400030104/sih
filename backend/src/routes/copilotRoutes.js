const express = require('express');
const router = express.Router();
const CopilotController = require('../controllers/copilotController');

// POST /api/copilot/chat - Natural language query
router.post('/chat', CopilotController.chat);

// POST /api/copilot/project-summary/:projectId - Executive summary brief
router.post('/project-summary/:projectId', CopilotController.getProjectSummary);

module.exports = router;
