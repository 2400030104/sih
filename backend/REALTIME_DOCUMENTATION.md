# PRAGATI-AI Real-Time WebSocket & Socket.IO Specification

**System**: PRAGATI-AI — Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Transport**: Socket.IO / WebSockets  
**Port**: `5000` (Shares HTTP server with Express REST API)  
**Security**: CORS-restricted with room-level tenant/project isolation  
**Payload Standard**: Unified `{ event, timestamp, data }` format

---

## 1. Real-Time Architecture Overview

PRAGATI-AI implements an event-driven synchronization architecture:

```
[ React 18 Frontend ]
  │
  ├─ 1. REST Write Request ────────────────────────┐
  │                                                ▼
  │                                    [ Node.js / Express ]
  │                                                │
  │                                    2. Database Transaction
  │                                                ▼
  │                                      [ MySQL: pragati_ai ]
  │                                                │
  │                                            3. COMMIT
  │                                                ▼
  │                                    [ Realtime Service ]
  │                                                │
  │                                        4. Emit Event
  │                                                ▼
  ├─ 5. Socket.IO Event Notification ── [ Socket.IO Server ]
  │
  ├─ 6. Targeted REST Query (Authoritative) ───────┐
  │                                                ▼
  │                                    [ Node.js / Express ]
  │                                                │
  ▼                                                ▼
[ Live UI State Updated Without Browser Reload ] ◄─┘
```

> **Design Principle**:
> - **MySQL is the single source of truth**.
> - **Socket.IO provides event notifications**.
> - **React fetches authoritative updated records via REST APIs**, preventing client-side data drift or untrusted state injection.
> - **Zero Database Polling**: Events are only triggered on successful database commits.

---

## 2. Socket.IO Room Subscriptions

To maximize scalability and eliminate noisy broadcasts, clients subscribe to scoped rooms based on their active view:

| Room Name | Join Trigger | Leave Trigger | Purpose |
|---|---|---|---|
| `dashboard` | `join_dashboard` | `leave_dashboard` | Executive Command Center overview updates (`DASHBOARD_UPDATED`) |
| `project:${projectId}` | `join_project(projectId)` | `leave_project(projectId)` | Project 360° deep-dive updates (monthly progress, milestones, risk, alerts, recommendations) |
| `alerts` | `join_alerts` | `leave_alerts` | Early Warning Center notifications (`ALERT_CREATED`, `ALERT_ACKNOWLEDGED`, `ALERT_RESOLVED`) |
| `risk-analytics` | `join_risk_analytics` | `leave_risk_analytics` | Portfolio risk intelligence and trending risk accelerations (`RISK_UPDATED`) |

---

## 3. Real-Time Event Catalog

### Project Events

#### `PROJECT_CREATED`
- **When Emitted**: After successful `POST /api/projects` insertion.
- **Room**: Broadcast to all clients + `dashboard` room.
- **Payload**:
  ```json
  {
    "event": "PROJECT_CREATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "projectId": 26,
      "projectCode": "NHAI-DEL-MUM-P15",
      "projectName": "Delhi-Mumbai Expressway Package 15",
      "currentStatus": "ONGOING"
    }
  }
  ```
- **Frontend Action**: Refresh project directory list and executive summary metrics.

#### `PROJECT_UPDATED`
- **When Emitted**: After successful `PUT /api/projects/:id`.
- **Room**: `project:${projectId}` + Broadcast.
- **Payload**:
  ```json
  {
    "event": "PROJECT_UPDATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "projectId": 14,
      "projectCode": "CIL-MAGADH-OCP",
      "projectName": "Magadh Open Cast Coal Mining",
      "currentStatus": "DELAYED"
    }
  }
  ```
- **Frontend Action**: Refresh current project header and overview if viewed.

#### `PROJECT_DELETED`
- **When Emitted**: After successful `DELETE /api/projects/:id` (soft-closure).
- **Room**: `project:${projectId}` + Broadcast.

---

### Monthly Monitoring & Trajectory Events

#### `MONTHLY_DATA_ADDED`
- **When Emitted**: After successful `POST /api/projects/:id/monthly`.
- **Room**: `project:${projectId}` + `dashboard`.
- **Payload**:
  ```json
  {
    "event": "MONTHLY_DATA_ADDED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "projectId": 14,
      "monthlyDataId": 312,
      "reportingMonth": "2025-02-01",
      "physicalProgress": 42.50,
      "financialProgress": 64.00,
      "expenditure": 95.00
    }
  }
  ```
- **Frontend Action**: Refresh physical/financial progress curve, monthly cost chart, and summary progress metrics.

#### `MONTHLY_DATA_UPDATED`
- **When Emitted**: After successful `PUT /api/projects/:id/monthly/:monthlyDataId`.
- **Room**: `project:${projectId}` + `dashboard`.

---

### Delivery Milestone Events

#### `MILESTONE_CREATED`
- **When Emitted**: After successful `POST /api/projects/:id/milestones`.
- **Room**: `project:${projectId}`.

#### `MILESTONE_UPDATED`
- **When Emitted**: After successful `PUT /api/projects/:id/milestones/:milestoneId`.
- **Room**: `project:${projectId}`.
- **Payload**:
  ```json
  {
    "event": "MILESTONE_UPDATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "projectId": 14,
      "milestoneId": 89,
      "milestoneName": "Heavy Earth Moving Equipment Commissioning",
      "status": "DELAYED",
      "delayDays": 45
    }
  }
  ```
- **Frontend Action**: Refresh milestone delivery matrix on Project 360° screen.

#### `MILESTONE_DELETED`
- **When Emitted**: After successful `DELETE /api/projects/:id/milestones/:milestoneId`.
- **Room**: `project:${projectId}`.

---

### Risk Intelligence Events

#### `RISK_UPDATED`
- **When Emitted**: When a new risk prediction is inserted or updated for a project.
- **Room**: `risk-analytics` + `project:${projectId}` + `dashboard`.
- **Payload**:
  ```json
  {
    "event": "RISK_UPDATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "projectId": 14,
      "predictionId": 32,
      "riskLevel": "CRITICAL",
      "overallRisk": 84.00
    }
  }
  ```
- **Frontend Action**: Refresh 4-gauge risk cards, multi-month risk trend chart, and portfolio risk distributions.

---

### Early Warning Alert Events

#### `ALERT_CREATED`
- **When Emitted**: When an autonomous threshold breach or critical risk trigger is generated.
- **Room**: `alerts` + `project:${projectId}` + Broadcast.
- **Payload**:
  ```json
  {
    "event": "ALERT_CREATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "alertId": 9,
      "projectId": 14,
      "severity": "CRITICAL",
      "title": "Critical Milestone Slippage Detected"
    }
  }
  ```
- **Frontend Action**: Increment active alert count in top navbar, show notification toast, and refresh alerts list.

#### `ALERT_ACKNOWLEDGED` & `ALERT_RESOLVED`
- **When Emitted**: When an alert is acknowledged (`PUT /api/alerts/:id/acknowledge`) or resolved (`PUT /api/alerts/:id/resolve`).
- **Room**: `alerts` + `project:${projectId}` + `dashboard`.

---

### Prescriptive Recommendation Events

#### `RECOMMENDATION_CREATED` & `RECOMMENDATION_UPDATED`
- **When Emitted**: When a recommendation is generated or its status is updated (`ACCEPTED`, `IMPLEMENTED`).
- **Room**: `project:${projectId}`.

---

### Central Dashboard Event

#### `DASHBOARD_UPDATED`
- **When Emitted**: Whenever an operation modifies macro project counts, budgets, expenditures, or risk tiers.
- **Room**: `dashboard`.
- **Payload**:
  ```json
  {
    "event": "DASHBOARD_UPDATED",
    "timestamp": "2026-08-28T17:30:00.000Z",
    "data": {
      "reason": "MONTHLY_DATA_ADDED"
    }
  }
  ```
- **Frontend Action**: Trigger debounced refetch of `GET /api/dashboard/summary`, `GET /api/dashboard/projects-by-sector`, and `GET /api/dashboard/risk-distribution`.
