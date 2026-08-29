const express = require('express');
const router = express.Router();
const ScenarioController = require('../controllers/scenarioController');

// POST /api/scenarios/simulate - What-If simulation
router.post('/simulate', ScenarioController.simulate);

module.exports = router;
