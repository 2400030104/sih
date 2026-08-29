const express = require('express');
const router = express.Router();
const AlertController = require('../controllers/alertController');
const { param } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

const validateAlertId = [
  param('id').isInt({ min: 1 }).withMessage('Alert ID must be a positive integer')
];

// GET /api/alerts - List all alerts
router.get('/', AlertController.listAlerts);

// GET /api/alerts/high - High severity alerts
router.get('/high', AlertController.getHighAlerts);

// GET /api/alerts/critical - Critical severity alerts
router.get('/critical', AlertController.getCriticalAlerts);

// GET /api/alerts/:id - Single alert
router.get('/:id', validateAlertId, validate, AlertController.getAlertById);

// PUT /api/alerts/:id/acknowledge - Acknowledge alert
router.put('/:id/acknowledge', validateAlertId, validate, AlertController.acknowledgeAlert);

// PUT /api/alerts/:id/resolve - Resolve alert
router.put('/:id/resolve', validateAlertId, validate, AlertController.resolveAlert);

module.exports = router;
