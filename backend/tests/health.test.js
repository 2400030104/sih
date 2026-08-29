const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Health Check API', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('GET /api/health - should return 200 or 503 with standard health response format', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('timestamp');
    
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.database).toBe('connected');
    } else {
      expect(res.status).toBe(503);
      expect(res.body.database).toBe('disconnected');
    }
  });

  it('GET /api/unknown-route - should return 404 with standard error structure', async () => {
    const res = await request(app).get('/api/non-existent-endpoint');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('ROUTE_NOT_FOUND');
  });
});
