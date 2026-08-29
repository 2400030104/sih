# PRAGATI-AI Backend API & Real-Time Data Service

**PRAGATI-AI**: Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Problem Domain**: Ministry of Statistics and Programme Implementation (MoSPI) / Infrastructure & Project Monitoring Division (IPMD)  
**Backend Framework**: Node.js / Express.js (v4.x)  
**Database**: MySQL 8.0+ / `pragati_ai` (InnoDB, utf8mb4)  
**Real-Time Synchronization**: Socket.IO (WebSockets / HTTP long-polling fallback)

---

## 1. Architecture Overview

The backend acts as the secure, high-performance bridge between the **MySQL Relational Database**, the **Socket.IO Real-Time Engine**, and the **React 18 SPA Frontend**, while creating clean service boundaries for future **Python ML Pipelines**.

```
[ React 18 Executive Dashboard ]
      │                   ▲
 (JSON / REST)      (Socket.IO Events)
      ▼                   │
[ Node.js / Express Backend + Socket.IO Server ]
   ├── Middleware: Helmet, CORS, Morgan, ErrorHandler, Validator
   ├── Realtime Service: Room Management & Event Dispatcher
   ├── Controllers: Projects, MonthlyData, Milestones, Risks, Alerts, Recommendations, Dashboard, Upload
   ├── Services: Business logic, DB operations, Feature engineering calculations
   └── Config: Connection Pool (mysql2/promise, 15 connections)
      │
(SQL / utf8mb4)
      ▼
[ MySQL 8.0+ Database: pragati_ai ]
```

> **Key Architectural Invariant**:
> - **React NEVER connects directly to MySQL**. React communicates only with Node.js via REST and Socket.IO.
> - **Zero Database Polling**: Socket.IO events are emitted **only after successful database commits**.
> - **Targeted Rooms**: Clients subscribe to scoped rooms (`dashboard`, `project:${projectId}`, `alerts`, `risk-analytics`).

---

## 2. Technology Stack

- **Runtime**: Node.js (v18.x / v20.x / v22.x+)
- **Web Framework**: Express.js (`express`)
- **Real-Time Engine**: Socket.IO (`socket.io`)
- **Database Driver**: `mysql2/promise` (connection pooling with parameterized SQL)
- **Security & Headers**: `helmet`, `cors`
- **Validation**: `express-validator`
- **Logging**: `morgan`
- **File Upload & Ingestion**: `multer`, `csv-parser`
- **Configuration**: `dotenv`
- **Testing**: `jest`, `supertest`, `socket.io-client`
- **Development**: `nodemon`

---

## 3. Directory Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # mysql2/promise connection pool & health check
│   │   └── env.js                # Centralized environment variable loader
│   ├── socket/
│   │   └── socket.js             # Socket.IO initialization & room subscriptions
│   ├── controllers/
│   │   ├── projectController.js       # Projects, 360 overview, analytics, timeline
│   │   ├── monthlyDataController.js   # Monthly monitoring time-series CRUD
│   │   ├── milestoneController.js     # Milestone delivery status tracking
│   │   ├── riskController.js          # AI risk predictions & SHAP explainability
│   │   ├── alertController.js         # Early warning alerts workflow
│   │   ├── recommendationController.js# Prescriptive recommendations
│   │   ├── dashboardController.js     # Executive KPI metrics & chart aggregations
│   │   └── uploadController.js        # CSV parsing, validation, batch ingest
│   ├── routes/
│   │   ├── projectRoutes.js
│   │   ├── monthlyDataRoutes.js
│   │   ├── milestoneRoutes.js
│   │   ├── riskRoutes.js
│   │   ├── alertRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/
│   │   ├── realtimeService.js         # Centralized Socket.IO event emitter
│   │   ├── projectService.js          # Project SQL queries & filters
│   │   ├── monthlyDataService.js      # Monthly monitoring DB operations
│   │   ├── milestoneService.js        # Milestone DB operations
│   │   ├── riskService.js             # Risk predictions & SHAP factors queries
│   │   ├── alertService.js            # Alerts DB operations & status transitions
│   │   ├── recommendationService.js   # Recommendation DB operations
│   │   ├── dashboardService.js        # Live KPI metrics & chart datasets
│   │   └── featureService.js          # Analytical calculations (velocities, gaps)
│   ├── middleware/
│   │   ├── errorMiddleware.js         # Centralized error handler & status mapper
│   │   ├── validationMiddleware.js    # express-validator result handler
│   │   └── notFoundMiddleware.js      # 404 handler for unmatched routes
│   ├── validators/
│   │   ├── projectValidator.js        # Project create/update/query validators
│   │   ├── monthlyDataValidator.js    # Monthly progress & cost validators
│   │   └── milestoneValidator.js      # Milestone dates & criticality validators
│   ├── utils/
│   │   ├── apiResponse.js             # Unified API response formatter
│   │   ├── pagination.js              # Reusable pagination helper
│   │   └── calculations.js            # Math & feature engineering formulas
│   ├── app.js                         # Express app setup & route mounting
│   └── server.js                      # HTTP server bootstrap & Socket.IO attachment
├── tests/
│   ├── health.test.js                 # Health check & 404 tests
│   ├── project.test.js                # Project validation & dashboard tests
│   ├── monthlyData.test.js            # Progress & milestone validation tests
│   └── realtime.test.js               # Socket.IO connections & room isolation tests
├── .env.example
├── .gitignore
├── package.json
├── API_DOCUMENTATION.md
├── REALTIME_DOCUMENTATION.md
└── README.md
```

---

## 4. Installation & Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MySQL 8.0+ running with `pragati_ai` database initialized (from Phase 1 `sql/setup_all.sql`)

### Setup Steps
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure database credentials and CORS in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=pragati_ai
   DB_CONNECTION_LIMIT=15
   CORS_ORIGIN=http://localhost:3000
   SOCKET_CORS_ORIGIN=http://localhost:3000,http://localhost:5173
   ```

---

## 5. Running the Backend & Real-Time Tests

### Development Mode (with hot-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

### Running Automated Test Suite:
```bash
npm test
```

Expected Output:
```
PASS tests/realtime.test.js
  Socket.IO Real-Time Synchronization Tests
    √ should successfully establish WebSocket connection with server
    √ should deliver DASHBOARD_UPDATED to clients in dashboard room
    √ should isolate project-specific events to the subscribed project room
    √ should deliver ALERT_CREATED to clients in alerts room
    √ should deliver RISK_UPDATED to risk-analytics room and target project room

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

---

## 6. Real-Time Rooms & Events

Detailed specification is available in [`REALTIME_DOCUMENTATION.md`](REALTIME_DOCUMENTATION.md).

| Event Name | Trigger | Target Room |
|---|---|---|
| `PROJECT_CREATED` | New project inserted | Broadcast + `dashboard` |
| `PROJECT_UPDATED` | Project details modified | `project:${id}` + Broadcast |
| `PROJECT_DELETED` | Project closed/deleted | `project:${id}` + Broadcast |
| `MONTHLY_DATA_ADDED` | Monthly progress/expenditure logged | `project:${id}` + `dashboard` |
| `MONTHLY_DATA_UPDATED` | Monthly progress/expenditure updated | `project:${id}` + `dashboard` |
| `MILESTONE_CREATED` / `UPDATED` | Milestone status changed | `project:${id}` |
| `RISK_UPDATED` | Risk score recalibrated | `risk-analytics` + `project:${id}` + `dashboard` |
| `ALERT_CREATED` | New early warning generated | `alerts` + `project:${id}` + Broadcast |
| `ALERT_ACKNOWLEDGED` / `RESOLVED` | Warning status updated | `alerts` + `project:${id}` + `dashboard` |
| `RECOMMENDATION_UPDATED` | Policy recommendation updated | `project:${id}` |
| `DASHBOARD_UPDATED` | Macro metric invalidated | `dashboard` |

---

## 7. Security & Database Protections

1. **SQL Injection Prevention**: All queries use parameterized statements (`?` placeholders) executed via `mysql2/promise`.
2. **Safe Sorting**: The `sortBy` parameter is strictly validated against a server-side whitelist; arbitrary string interpolation into SQL is blocked.
3. **No In-Place Overwrites of History**: Monthly monitoring records and risk predictions are stored as immutable time-series observations.
4. **Soft Deletion**: `DELETE /api/projects/:id` updates project status to `CLOSED` when historical monthly observations exist, preventing catastrophic data loss.
5. **Progress Bounds Guarantee**: Enforces 0.00% to 100.00% ranges on `physical_progress`, `financial_progress`, and `planned_progress`.
6. **Duplicate Prevention**: Rejects duplicate monthly submissions for the same project and month (`UNIQUE(project_id, reporting_month)`).
