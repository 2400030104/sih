const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const RealtimeService = require('./realtimeService');

const AI_SERVICE_HOST = process.env.AI_SERVICE_HOST || 'localhost';
const AI_SERVICE_PORT = process.env.AI_SERVICE_PORT || 8001;
const AI_SERVICE_URL = `http://${AI_SERVICE_HOST}:${AI_SERVICE_PORT}`;

class AIService {
  /**
   * Helper to perform HTTP JSON request to Python AI microservice
   */
  static async _request(method, endpoint, body = null) {
    return new Promise((resolve, reject) => {
      const dataString = body ? JSON.stringify(body) : null;
      const options = {
        hostname: AI_SERVICE_HOST,
        port: AI_SERVICE_PORT,
        path: endpoint,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
        },
        timeout: 10000
      };

      const req = http.request(options, (res) => {
        let responseBody = '';
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.detail || `HTTP ${res.statusCode}: ${responseBody}`));
            }
          } catch (err) {
            reject(new Error(`Failed to parse AI response: ${responseBody}`));
          }
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('AI microservice request timed out'));
      });

      if (dataString) {
        req.write(dataString);
      }
      req.end();
    });
  }

  /**
   * Fallback Python executor using virtualenv when HTTP microservice is starting/offline
   */
  static async _executePythonDirect(commandCode) {
    return new Promise((resolve, reject) => {
      const projectRoot = path.resolve(__dirname, '../../../');
      const venvPython = path.join(projectRoot, 'ml_service', '.venv', 'Scripts', 'python.exe');
      const pythonPath = fs.existsSync(venvPython) ? venvPython : (process.env.PYTHON_PATH || 'python');
      
      const pyProcess = spawn(pythonPath, ['-c', commandCode], {
        cwd: projectRoot,
        env: { ...process.env, PYTHONPATH: projectRoot }
      });

      let stdout = '';
      let stderr = '';

      pyProcess.stdout.on('data', (data) => { stdout += data.toString(); });
      pyProcess.stderr.on('data', (data) => { stderr += data.toString(); });

      pyProcess.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(stdout.trim()));
          } catch (e) {
            resolve({ raw: stdout });
          }
        } else {
          reject(new Error(`Python execution failed (code ${code}): ${stderr}`));
        }
      });
    });
  }

  /**
   * Natural language chat with PRAGATI-AI Copilot
   */
  static async askCopilot(message, projectId = null) {
    try {
      return await this._request('POST', '/copilot/chat', { message, projectId });
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.llm.client import CopilotEngine
engine = CopilotEngine()
res = engine.generate_grounded_response(${JSON.stringify(message)}, ${projectId ? parseInt(projectId) : 'None'})
print(json.dumps(res, default=str))
`;
      return await this._executePythonDirect(pyCode);
    }
  }

  /**
   * Generate AI Project Executive Summary Brief
   */
  static async generateProjectSummary(projectId) {
    try {
      return await this._request('POST', `/copilot/project-summary/${projectId}`);
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.api.routes import generate_project_summary
res = generate_project_summary(${parseInt(projectId)})
print(json.dumps(res, default=str))
`;
      return await this._executePythonDirect(pyCode);
    }
  }

  /**
   * Retrieve Intervention Priority Queue (P1-P4 Ranking)
   */
  static async getInterventionQueue() {
    try {
      return await this._request('GET', '/interventions');
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.decision.priority import calculate_intervention_priority_queue
queue = calculate_intervention_priority_queue()
print(json.dumps({"count": len(queue), "queue": queue}, default=str))
`;
      return await this._executePythonDirect(pyCode);
    }
  }

  /**
   * Retrieve Intervention Details for Single Project
   */
  static async getSingleProjectIntervention(projectId) {
    try {
      return await this._request('GET', `/interventions/${projectId}`);
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.decision.priority import get_project_intervention_details
res = get_project_intervention_details(${parseInt(projectId)})
print(json.dumps(res, default=str))
`;
      return await this._executePythonDirect(pyCode);
    }
  }

  /**
   * Generate Structured Rule-Based Recommendations
   */
  static async generateRecommendations(projectId) {
    try {
      return await this._request('POST', `/recommendations/generate/${projectId}`);
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.decision.recommendations import generate_structured_recommendations
recs = generate_structured_recommendations(${parseInt(projectId)})
print(json.dumps({"projectId": ${parseInt(projectId)}, "count": len(recs), "recommendations": recs}, default=str))
`;
      return await this._executePythonDirect(pyCode);
    }
  }

  /**
   * Run What-If Scenario Simulation without altering DB records
   */
  static async simulateScenario(projectId, changes = {}) {
    let result;
    try {
      result = await this._request('POST', '/scenarios/simulate', { projectId: parseInt(projectId), changes });
    } catch (httpErr) {
      const pyCode = `
import json
from ai_service.src.decision.scenarios import simulate_project_scenario
res = simulate_project_scenario(${parseInt(projectId)}, ${JSON.stringify(changes)})
print(json.dumps(res, default=str))
`;
      result = await this._executePythonDirect(pyCode);
    }

    // Broadcast scenario simulated notification over real-time WebSockets
    RealtimeService.emitProjectUpdated({
      projectId: parseInt(projectId),
      type: 'SCENARIO_SIMULATION_COMPLETED',
      delta: result.delta
    });

    return result;
  }
}

module.exports = AIService;
