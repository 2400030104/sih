const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { testConnection } = require('./config/db');
const ApiResponse = require('./utils/apiResponse');

// Routers
const projectRoutes = require('./routes/projectRoutes');
const riskRoutes = require('./routes/riskRoutes');
const alertRoutes = require('./routes/alertRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const copilotRoutes = require('./routes/copilotRoutes');
const interventionRoutes = require('./routes/interventionRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');

// Middleware
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Security Headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or matching origins
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Body Parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// HTTP Request Logger (skip in test mode to keep test runner output clean)
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Root Welcome & Navigation Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    system: 'PRAGATI-AI National Infrastructure Intelligence Gateway',
    status: 'ONLINE',
    frontend: 'http://localhost:3000',
    message: 'To view the Command Center user interface, open http://localhost:3000 in your browser.',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      dashboard: '/api/dashboard/summary',
      interventions: '/api/interventions',
      copilot: '/api/copilot/chat',
      scenarios: '/api/scenarios/simulate',
      recommendations: '/api/recommendations',
      alerts: '/api/alerts'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  if (dbStatus.connected) {
    return res.status(200).json({
      success: true,
      message: 'PRAGATI-AI backend is running',
      database: 'connected',
      realtime: 'enabled',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(503).json({
      success: false,
      message: 'PRAGATI-AI backend is running but database is disconnected',
      database: 'disconnected',
      realtime: 'enabled',
      error: dbStatus.error,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes Mounting
app.use('/api/projects', projectRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/scenarios', scenarioRoutes);

// Catch-All 404
app.use(notFoundMiddleware);

// Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
