const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Phase 5 AI & Decision Support APIs', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('Copilot APIs', () => {
    it('POST /api/copilot/chat - should return structured grounded response for general query', async () => {
      const res = await request(app)
        .post('/api/copilot/chat')
        .send({ message: 'Which projects are critical?' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('answer');
      expect(res.body.data).toHaveProperty('intent');
      expect(res.body.data).toHaveProperty('evidenceSources');
    }, 20000);

    it('POST /api/copilot/chat - should reject empty message with 400', async () => {
      const res = await request(app)
        .post('/api/copilot/chat')
        .send({ message: '' });
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/copilot/project-summary/:id - should generate project brief', async () => {
      const res = await request(app)
        .post('/api/copilot/project-summary/14');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('executiveSummary');
      expect(res.body.data).toHaveProperty('financialStatus');
      expect(res.body.data).toHaveProperty('scheduleStatus');
      expect(res.body.data).toHaveProperty('riskAssessment');
    }, 20000);
  });

  describe('Intervention Priority Queue APIs', () => {
    it('GET /api/interventions - should return ranked P1-P4 priority list', async () => {
      const res = await request(app).get('/api/interventions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('queue');
      expect(Array.isArray(res.body.data.queue)).toBe(true);
      if (res.body.data.queue.length > 0) {
        const first = res.body.data.queue[0];
        expect(first).toHaveProperty('priority');
        expect(first).toHaveProperty('priorityScore');
        expect(first).toHaveProperty('financialExposure');
      }
    }, 20000);

    it('GET /api/interventions/:id - should return single project priority metrics', async () => {
      const res = await request(app).get('/api/interventions/14');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('projectId', 14);
      expect(res.body.data).toHaveProperty('priority');
    }, 20000);
  });

  describe('What-If Scenario Simulator APIs', () => {
    it('POST /api/scenarios/simulate - should run simulation on Project 14', async () => {
      const res = await request(app)
        .post('/api/scenarios/simulate')
        .send({
          projectId: 14,
          changes: {
            monthlyProgressIncrease: 2.5,
            milestoneDelayReduction: 15.0
          }
        });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('baseCase');
      expect(res.body.data).toHaveProperty('scenario');
      expect(res.body.data).toHaveProperty('delta');
      expect(res.body.data).toHaveProperty('limitation');
    }, 20000);
  });

  describe('Rule-Based Recommendations Generator', () => {
    it('POST /api/recommendations/generate/:projectId - should generate policy recommendations', async () => {
      const res = await request(app).post('/api/recommendations/generate/14');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('recommendations');
      expect(Array.isArray(res.body.data.recommendations)).toBe(true);
    }, 20000);
  });
});
