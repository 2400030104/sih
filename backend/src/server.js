const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { testConnection, pool } = require('./config/db');
const { initSocket } = require('./socket/socket');

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    // Verify database connection on startup
    const dbStatus = await testConnection();
    if (dbStatus.connected) {
      console.log(`[Database] Connected successfully to MySQL database '${env.DB.NAME}' on ${env.DB.HOST}:${env.DB.PORT}`);
    } else {
      console.warn(`[Database Warning] Unable to reach database on startup: ${dbStatus.error}`);
      console.warn('[Database Warning] Backend will start, but database queries will fail until MySQL is accessible.');
    }

    // Create standard Node.js HTTP Server sharing Express & Socket.IO
    const httpServer = http.createServer(app);

    // Attach Socket.IO
    const io = initSocket(httpServer);
    console.log('[Realtime] Socket.IO server attached to HTTP server.');

    httpServer.listen(PORT, () => {
      console.log('====================================================');
      console.log(`  PRAGATI-AI Backend & Real-Time Server Running`);
      console.log(`  Port:        http://localhost:${PORT}`);
      console.log(`  Realtime:    Socket.IO enabled`);
      console.log(`  Environment: ${env.NODE_ENV}`);
      console.log(`  Health API:  http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n[Shutdown] Received ${signal}. Closing Socket.IO, HTTP server and database pool...`);
      if (io) {
        io.close();
      }
      httpServer.close(async () => {
        try {
          await pool.end();
          console.log('[Shutdown] Database connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Shutdown Error]', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('[Server Fatal Error]', error);
    process.exit(1);
  }
}

startServer();
