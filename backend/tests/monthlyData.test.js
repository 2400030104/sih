const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Monthly Data & Milestone Validation Tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('Monthly Progress Validation', () => {
    it('POST /api/projects/1/monthly - should reject physical_progress > 100 with 422', async () => {
      const res = await request(app)
        .post('/api/projects/1/monthly')
        .send({
          reporting_month: '2025-01-01',
          expenditure: 50.00,
          cumulative_expenditure: 500.00,
          physical_progress: 125.00, // Invalid: > 100
          financial_progress: 50.00,
          planned_progress: 60.00
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'physical_progress' })
        ])
      );
    });

    it('POST /api/projects/1/monthly - should reject negative expenditure with 422', async () => {
      const res = await request(app)
        .post('/api/projects/1/monthly')
        .send({
          reporting_month: '2025-01-01',
          expenditure: -50.00, // Invalid: < 0
          cumulative_expenditure: 500.00,
          physical_progress: 45.00,
          financial_progress: 50.00,
          planned_progress: 60.00
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('VALIDATION_ERROR');
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'expenditure' })
        ])
      );
    });

    it('POST /api/projects/1/monthly - should reject invalid reporting_month format with 422', async () => {
      const res = await request(app)
        .post('/api/projects/1/monthly')
        .send({
          reporting_month: 'invalid-date-string',
          expenditure: 50.00,
          cumulative_expenditure: 500.00,
          physical_progress: 45.00,
          financial_progress: 50.00,
          planned_progress: 60.00
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'reporting_month' })
        ])
      );
    });
  });

  describe('Milestone Validation', () => {
    it('POST /api/projects/1/milestones - should reject missing milestone_code and planned_date with 422', async () => {
      const res = await request(app)
        .post('/api/projects/1/milestones')
        .send({
          milestone_name: 'Test Pier Foundation'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'milestone_code' }),
          expect.objectContaining({ field: 'planned_date' })
        ])
      );
    });

    it('POST /api/projects/1/milestones - should reject invalid criticality with 422', async () => {
      const res = await request(app)
        .post('/api/projects/1/milestones')
        .send({
          milestone_code: 'MS-TEST-01',
          milestone_name: 'Test Pier Foundation',
          planned_date: '2025-06-30',
          criticality: 'SUPER_URGENT_INVALID'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'criticality' })
        ])
      );
    });
  });
});
