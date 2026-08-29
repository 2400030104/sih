const express = require('express');
const router = express.Router();
const InterventionController = require('../controllers/interventionController');

// GET /api/interventions - Ranked priority queue
router.get('/', InterventionController.getQueue);

// GET /api/interventions/:projectId - Single project priority breakdown
router.get('/:projectId', InterventionController.getProjectIntervention);

module.exports = router;
