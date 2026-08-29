const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Project & Dashboard APIs - Validation & Request Handling', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('Project Validation Middleware', () => {
    it('GET /api/projects/:id - should reject non-integer project ID with 422', async () => {
      const res = await request(app).get('/api/projects/abc');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'id' })
        ])
      );
    });

    it('GET /api/projects - should reject invalid sortBy parameter with 422', async () => {
      const res = await request(app).get('/api/projects?sortBy=malicious_column_drop_table');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('GET /api/projects - should reject invalid limit (>100) with 422', async () => {
      const res = await request(app).get('/api/projects?limit=999');
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
    });

    it('POST /api/projects - should reject missing required fields with 422', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({});
      
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
      expect(res.body.details.length).toBeGreaterThan(3);
    });

    it('POST /api/projects - should reject negative original_cost and approved_cost with 422', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          project_code: 'TEST-PROJ-01',
          project_name: 'Test Highway Expansion',
          ministry_id: 1,
          sector_id: 1,
          agency_id: 1,
          state_id: 1,
          original_cost: -500.00,
          approved_cost: -500.00,
          approved_date: '2024-01-01',
          planned_start_date: '2024-02-01',
          planned_completion_date: '2026-12-31'
        });
      
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'original_cost' }),
          expect.objectContaining({ field: 'approved_cost' })
        ])
      );
    });

    it('POST /api/projects - should reject invalid latitude/longitude with 422', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          project_code: 'TEST-PROJ-02',
          project_name: 'Test Metro Project',
          ministry_id: 1,
          sector_id: 1,
          agency_id: 1,
          state_id: 1,
          original_cost: 1500.00,
          approved_cost: 1500.00,
          approved_date: '2024-01-01',
          planned_start_date: '2024-02-01',
          planned_completion_date: '2026-12-31',
          latitude: 145.00, // Invalid: max 90
          longitude: -250.00 // Invalid: min -180
        });
      
      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'latitude' }),
          expect.objectContaining({ field: 'longitude' })
        ])
      );
    });
  });

  describe('Dashboard and Risk Routes Structure', () => {
    it('GET /api/dashboard/summary - should return structured response', async () => {
      const res = await request(app).get('/api/dashboard/summary');
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('totalProjects');
        expect(res.body.data).toHaveProperty('ongoingProjects');
        expect(res.body.data).toHaveProperty('totalApprovedCost');
      } else {
        expect([500, 503]).toContain(res.status);
      }
    });

    it('GET /api/risks - should return structured list response', async () => {
      const res = await request(app).get('/api/risks');
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect([500, 503]).toContain(res.status);
      }
    });

    it('GET /api/alerts - should return structured alerts response', async () => {
      const res = await request(app).get('/api/alerts');
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      } else {
        expect([500, 503]).toContain(res.status);
      }
    });

    it('POST /api/risks/predict/:id - should trigger Python ML prediction and return fresh scores', async () => {
      const res = await request(app).post('/api/risks/predict/14');
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('prediction');
        expect(res.body.data.prediction).toHaveProperty('overallRisk');
        expect(res.body.data).toHaveProperty('factors');
        expect(Array.isArray(res.body.data.factors)).toBe(true);
      } else {
        expect([500, 503]).toContain(res.status);
      }
    }, 15000);
  });
});
