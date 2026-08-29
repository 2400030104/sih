const AlertService = require('../services/alertService');
const RealtimeService = require('../services/realtimeService');
const ApiResponse = require('../utils/apiResponse');

class AlertController {
  static async listAlerts(req, res, next) {
    try {
      const alerts = await AlertService.listAlerts(req.query);
      return ApiResponse.success(res, 'Alerts retrieved successfully', alerts);
    } catch (error) {
      next(error);
    }
  }

  static async getAlertById(req, res, next) {
    try {
      const alert = await AlertService.getAlertById(req.params.id);
      if (!alert) {
        return ApiResponse.error(res, 'Alert not found', 'ALERT_NOT_FOUND', 404);
      }
      return ApiResponse.success(res, 'Alert retrieved successfully', alert);
    } catch (error) {
      next(error);
    }
  }

  static async getHighAlerts(req, res, next) {
    try {
      const alerts = await AlertService.getHighAlerts();
      return ApiResponse.success(res, 'High severity alerts retrieved successfully', alerts);
    } catch (error) {
      next(error);
    }
  }

  static async getCriticalAlerts(req, res, next) {
    try {
      const alerts = await AlertService.getCriticalAlerts();
      return ApiResponse.success(res, 'Critical severity alerts retrieved successfully', alerts);
    } catch (error) {
      next(error);
    }
  }

  static async acknowledgeAlert(req, res, next) {
    try {
      const userId = req.body.userId || req.body.acknowledged_by || null;
      const updated = await AlertService.acknowledgeAlert(req.params.id, userId);
      if (!updated) {
        return ApiResponse.error(res, 'Alert not found', 'ALERT_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitAlertAcknowledged({
        alertId: updated.alert_id,
        projectId: updated.project_id,
        status: updated.status,
        acknowledgedAt: updated.acknowledged_at
      });

      return ApiResponse.success(res, 'Alert acknowledged successfully', updated);
    } catch (error) {
      next(error);
    }
  }

  static async resolveAlert(req, res, next) {
    try {
      const userId = req.body.userId || req.body.resolved_by || null;
      const updated = await AlertService.resolveAlert(req.params.id, userId);
      if (!updated) {
        return ApiResponse.error(res, 'Alert not found', 'ALERT_NOT_FOUND', 404);
      }

      // Emit Real-time Event
      RealtimeService.emitAlertResolved({
        alertId: updated.alert_id,
        projectId: updated.project_id,
        status: updated.status,
        resolvedAt: updated.resolved_at
      });

      return ApiResponse.success(res, 'Alert resolved successfully', updated);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AlertController;
