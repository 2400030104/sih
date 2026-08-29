const { Server } = require('socket.io');
const env = require('../config/env');

let io = null;

/**
 * Initialize Socket.IO with HTTP server
 */
function initSocket(httpServer) {
  // Parse allowed origins
  const allowedOrigins = env.SOCKET_CORS_ORIGIN.includes(',')
    ? env.SOCKET_CORS_ORIGIN.split(',').map((o) => o.trim())
    : [env.SOCKET_CORS_ORIGIN, 'http://localhost:3000', 'http://localhost:5173'];

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    if (env.NODE_ENV !== 'test') {
      console.log(`[Realtime] Socket connected: ${socket.id}`);
    }

    // 1. Dashboard Room
    socket.on('join_dashboard', (ack) => {
      socket.join('dashboard');
      if (typeof ack === 'function') ack({ joined: 'dashboard' });
    });

    socket.on('leave_dashboard', (ack) => {
      socket.leave('dashboard');
      if (typeof ack === 'function') ack({ left: 'dashboard' });
    });

    // 2. Project-Specific Room
    socket.on('join_project', (projectId, ack) => {
      if (projectId) {
        const room = `project:${projectId}`;
        socket.join(room);
        if (typeof ack === 'function') ack({ joined: room });
      }
    });

    socket.on('leave_project', (projectId, ack) => {
      if (projectId) {
        const room = `project:${projectId}`;
        socket.leave(room);
        if (typeof ack === 'function') ack({ left: room });
      }
    });

    // 3. Alerts Room
    socket.on('join_alerts', (ack) => {
      socket.join('alerts');
      if (typeof ack === 'function') ack({ joined: 'alerts' });
    });

    socket.on('leave_alerts', (ack) => {
      socket.leave('alerts');
      if (typeof ack === 'function') ack({ left: 'alerts' });
    });

    // 4. Risk Analytics Room
    socket.on('join_risk_analytics', (ack) => {
      socket.join('risk-analytics');
      if (typeof ack === 'function') ack({ joined: 'risk-analytics' });
    });

    socket.on('leave_risk_analytics', (ack) => {
      socket.leave('risk-analytics');
      if (typeof ack === 'function') ack({ left: 'risk-analytics' });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      if (env.NODE_ENV !== 'test') {
        console.log(`[Realtime] Socket disconnected: ${socket.id} (${reason})`);
      }
    });
  });

  return io;
}

/**
 * Get active Socket.IO server instance
 */
function getIO() {
  return io;
}

module.exports = {
  initSocket,
  getIO
};
