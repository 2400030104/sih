require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: parseInt(process.env.DB_PORT, 10) || 3306,
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'pragati_ai',
    CONNECTION_LIMIT: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 15
  },
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || process.env.CORS_ORIGIN || 'http://localhost:3000'
};

module.exports = env;
