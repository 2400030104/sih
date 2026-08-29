const http = require('http');
const { io: Client } = require('socket.io-client');
const app = require('../src/app');
const { initSocket } = require('../src/socket/socket');
const RealtimeService = require('../src/services/realtimeService');
const { pool } = require('../src/config/db');

describe('Socket.IO Real-Time Synchronization Tests', () => {
  let httpServer;
  let serverAddress;
  let clientSocket1;
  let clientSocket2;

  beforeAll((done) => {
    httpServer = http.createServer(app);
    initSocket(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      serverAddress = `http://localhost:${port}`;
      done();
    });
  });

  afterAll(async () => {
    if (clientSocket1 && clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
    if (httpServer) httpServer.close();
    await pool.end();
  });

  beforeEach((done) => {
    clientSocket1 = new Client(serverAddress, { reconnectionDelay: 0, forceNew: true });
    clientSocket2 = new Client(serverAddress, { reconnectionDelay: 0, forceNew: true });

    let connectedCount = 0;
    const checkDone = () => {
      connectedCount++;
      if (connectedCount === 2) done();
    };

    clientSocket1.on('connect', checkDone);
    clientSocket2.on('connect', checkDone);
  });

  afterEach(() => {
    if (clientSocket1 && clientSocket1.connected) clientSocket1.disconnect();
    if (clientSocket2 && clientSocket2.connected) clientSocket2.disconnect();
  });

  it('should successfully establish WebSocket connection with server', () => {
    expect(clientSocket1.connected).toBe(true);
    expect(clientSocket2.connected).toBe(true);
  });

  it('should deliver DASHBOARD_UPDATED to clients in dashboard room', (done) => {
    clientSocket1.emit('join_dashboard', () => {
      clientSocket1.on('DASHBOARD_UPDATED', (payload) => {
        expect(payload.event).toBe('DASHBOARD_UPDATED');
        expect(payload.data.reason).toBe('PROJECT_CREATED');
        expect(payload.timestamp).toBeDefined();
        done();
      });

      RealtimeService.emitProjectCreated({ projectId: 101, projectCode: 'PRJ-TEST' });
    });
  });

  it('should isolate project-specific events to the subscribed project room', (done) => {
    clientSocket1.emit('join_project', 14, () => {
      clientSocket2.emit('join_project', 99, () => {
        let client2Received = false;
        clientSocket2.on('MONTHLY_DATA_ADDED', () => {
          client2Received = true;
        });

        clientSocket1.on('MONTHLY_DATA_ADDED', (payload) => {
          expect(payload.event).toBe('MONTHLY_DATA_ADDED');
          expect(payload.data.projectId).toBe(14);
          expect(payload.data.reportingMonth).toBe('2025-01-01');

          setTimeout(() => {
            expect(client2Received).toBe(false);
            done();
          }, 50);
        });

        RealtimeService.emitMonthlyDataAdded({
          projectId: 14,
          monthlyDataId: 501,
          reportingMonth: '2025-01-01'
        });
      });
    });
  });

  it('should deliver ALERT_CREATED to clients in alerts room', (done) => {
    clientSocket1.emit('join_alerts', () => {
      clientSocket1.on('ALERT_CREATED', (payload) => {
        expect(payload.event).toBe('ALERT_CREATED');
        expect(payload.data.alertId).toBe(77);
        expect(payload.data.severity).toBe('CRITICAL');
        done();
      });

      RealtimeService.emitAlertCreated({
        alertId: 77,
        projectId: 14,
        severity: 'CRITICAL',
        title: 'Critical Milestone Slip'
      });
    });
  });

  it('should deliver RISK_UPDATED to risk-analytics room and target project room', (done) => {
    clientSocket1.emit('join_risk_analytics', () => {
      clientSocket2.emit('join_project', 14, () => {
        let count = 0;
        const checkDone = () => {
          count++;
          if (count === 2) done();
        };

        clientSocket1.on('RISK_UPDATED', (payload) => {
          expect(payload.data.projectId).toBe(14);
          expect(payload.data.overallRisk).toBe(84);
          checkDone();
        });

        clientSocket2.on('RISK_UPDATED', (payload) => {
          expect(payload.data.projectId).toBe(14);
          expect(payload.data.overallRisk).toBe(84);
          checkDone();
        });

        RealtimeService.emitRiskUpdated({
          projectId: 14,
          predictionId: 301,
          riskLevel: 'CRITICAL',
          overallRisk: 84
        });
      });
    });
  });
});
