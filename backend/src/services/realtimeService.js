const { getIO } = require('../socket/socket');

class RealtimeService {
  /**
   * Helper to format consistent payload
   */
  static formatPayload(event, data = {}) {
    return {
      event,
      timestamp: new Date().toISOString(),
      data
    };
  }

  /**
   * Emit PROJECT_CREATED
   */
  static emitProjectCreated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('PROJECT_CREATED', data);
    // Broadcast to dashboard and general clients
    io.emit('PROJECT_CREATED', payload);
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'PROJECT_CREATED' }));
  }

  /**
   * Emit PROJECT_UPDATED
   */
  static emitProjectUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('PROJECT_UPDATED', data);
    io.emit('PROJECT_UPDATED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('PROJECT_UPDATED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'PROJECT_UPDATED' }));
  }

  /**
   * Emit PROJECT_DELETED
   */
  static emitProjectDeleted(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('PROJECT_DELETED', data);
    io.emit('PROJECT_DELETED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('PROJECT_DELETED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'PROJECT_DELETED' }));
  }

  /**
   * Emit MONTHLY_DATA_ADDED
   */
  static emitMonthlyDataAdded(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('MONTHLY_DATA_ADDED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('MONTHLY_DATA_ADDED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'MONTHLY_DATA_ADDED' }));
  }

  /**
   * Emit MONTHLY_DATA_UPDATED
   */
  static emitMonthlyDataUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('MONTHLY_DATA_UPDATED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('MONTHLY_DATA_UPDATED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'MONTHLY_DATA_UPDATED' }));
  }

  /**
   * Emit MILESTONE_CREATED
   */
  static emitMilestoneCreated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('MILESTONE_CREATED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('MILESTONE_CREATED', payload);
    }
  }

  /**
   * Emit MILESTONE_UPDATED
   */
  static emitMilestoneUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('MILESTONE_UPDATED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('MILESTONE_UPDATED', payload);
    }
  }

  /**
   * Emit MILESTONE_DELETED
   */
  static emitMilestoneDeleted(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('MILESTONE_DELETED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('MILESTONE_DELETED', payload);
    }
  }

  /**
   * Emit RISK_UPDATED
   */
  static emitRiskUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('RISK_UPDATED', data);
    io.to('risk-analytics').emit('RISK_UPDATED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('RISK_UPDATED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'RISK_UPDATED' }));
  }

  /**
   * Emit ALERT_CREATED
   */
  static async emitAlertCreated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('ALERT_CREATED', data);
    io.to('alerts').emit('ALERT_CREATED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('ALERT_CREATED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'ALERT_CREATED' }));
  }

  /**
   * Emit ALERT_UPDATED
   */
  static emitAlertUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('ALERT_UPDATED', data);
    io.to('alerts').emit('ALERT_UPDATED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('ALERT_UPDATED', payload);
    }
  }

  /**
   * Emit ALERT_ACKNOWLEDGED
   */
  static emitAlertAcknowledged(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('ALERT_ACKNOWLEDGED', data);
    io.to('alerts').emit('ALERT_ACKNOWLEDGED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('ALERT_ACKNOWLEDGED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'ALERT_ACKNOWLEDGED' }));
  }

  /**
   * Emit ALERT_RESOLVED
   */
  static emitAlertResolved(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('ALERT_RESOLVED', data);
    io.to('alerts').emit('ALERT_RESOLVED', payload);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('ALERT_RESOLVED', payload);
    }
    io.to('dashboard').emit('DASHBOARD_UPDATED', this.formatPayload('DASHBOARD_UPDATED', { reason: 'ALERT_RESOLVED' }));
  }

  /**
   * Emit RECOMMENDATION_CREATED
   */
  static emitRecommendationCreated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('RECOMMENDATION_CREATED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('RECOMMENDATION_CREATED', payload);
    }
  }

  /**
   * Emit RECOMMENDATION_UPDATED
   */
  static emitRecommendationUpdated(data) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('RECOMMENDATION_UPDATED', data);
    if (data.projectId) {
      io.to(`project:${data.projectId}`).emit('RECOMMENDATION_UPDATED', payload);
    }
  }

  /**
   * Central DASHBOARD_UPDATED event
   */
  static emitDashboardUpdated(data = {}) {
    const io = getIO();
    if (!io) return;

    const payload = this.formatPayload('DASHBOARD_UPDATED', data);
    io.to('dashboard').emit('DASHBOARD_UPDATED', payload);
  }
}

module.exports = RealtimeService;
