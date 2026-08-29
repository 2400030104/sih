# PRAGATI-AI REST API Specification (Phase 2)

**System**: PRAGATI-AI — Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Base URL**: `http://localhost:5000/api`  
**Authentication**: Prepared for JWT (Phase 2 development supports direct REST consumption)  
**Standard Content-Type**: `application/json`

---

## 1. Response Standard

### Success Response Format
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalRecords": 25,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Validation failed for one or more fields",
  "error": "VALIDATION_ERROR",
  "details": [
    {
      "field": "physical_progress",
      "message": "physical_progress must be between 0.00 and 100.00",
      "value": 125.0
    }
  ]
}
```

---

## 2. API Endpoints Reference

### Health Check

#### `GET /api/health`
- **Purpose**: Verify backend server status and MySQL database pool connectivity.
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "PRAGATI-AI backend is running",
    "database": "connected",
    "environment": "development",
    "timestamp": "2026-08-28T21:00:00.000Z"
  }
  ```
- **Failure Response (503)**:
  ```json
  {
    "success": false,
    "message": "PRAGATI-AI backend is running but database is disconnected",
    "database": "disconnected",
    "error": "connect ECONNREFUSED 127.0.0.1:3306"
  }
  ```

---

### Projects API

#### `GET /api/projects`
- **Purpose**: Retrieve paginated, filtered, searched, and sorted list of infrastructure projects.
- **Query Parameters**:
  - `page` (int, default: 1): Page number
  - `limit` (int, default: 20, max: 100): Records per page
  - `ministry_id` (int): Filter by parent ministry
  - `sector_id` (int): Filter by infrastructure sector
  - `state_id` (int): Filter by state
  - `agency_id` (int): Filter by executing agency
  - `status` (string): `PROPOSED`, `APPROVED`, `ONGOING`, `COMPLETED`, `DELAYED`, `ON_HOLD`, `CANCELLED`, `CLOSED`
  - `risk_level` (string): `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
  - `search` (string): Searches `project_code` and `project_name`
  - `sortBy` (string): `project_id`, `project_code`, `project_name`, `approved_cost`, `revised_cost`, `planned_completion_date`, `current_status`, `overall_risk`, `physical_progress`
  - `sortOrder` (string): `ASC` or `DESC` (default: `ASC`)
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Projects retrieved successfully",
    "data": [
      {
        "project_id": 14,
        "project_code": "CIL-MAGADH-OCP",
        "project_name": "Magadh Open Cast Coal Mining Project (70 MTY expansion)",
        "ministry_code": "MoC",
        "ministry_name": "Ministry of Coal",
        "sector_name": "Coal & Mineral Mining",
        "state_name": "Jharkhand",
        "approved_cost": 4820.00,
        "revised_cost": 5600.00,
        "current_status": "DELAYED",
        "physical_progress": 40.50,
        "financial_progress": 62.00,
        "overall_risk": 84.00,
        "risk_level": "CRITICAL",
        "predicted_delay_months": 14.50
      }
    ],
    "pagination": { "page": 1, "limit": 20, "totalRecords": 25, "totalPages": 2 }
  }
  ```

#### `GET /api/projects/:id`
- **Purpose**: Get comprehensive project master details including joined department, sector, state, district, and executing agency names.
- **Path Parameter**: `id` (int, required)

#### `POST /api/projects`
- **Purpose**: Create a new project master record with parameterized SQL.
- **Request Body**:
  ```json
  {
    "project_code": "NHAI-DEL-MUM-P15",
    "project_name": "Delhi-Mumbai Expressway Package 15",
    "ministry_id": 1,
    "sector_id": 1,
    "agency_id": 1,
    "state_id": 8,
    "original_cost": 5200.00,
    "approved_cost": 5200.00,
    "approved_date": "2024-01-15",
    "planned_start_date": "2024-03-01",
    "planned_completion_date": "2027-06-30",
    "latitude": 26.8500,
    "longitude": 75.8000,
    "current_status": "ONGOING",
    "priority_category": "TOP_PRIORITY"
  }
  ```

#### `PUT /api/projects/:id`
- **Purpose**: Update project master metadata without modifying historical time-series.

#### `DELETE /api/projects/:id`
- **Purpose**: Safely closes a project (`current_status = 'CLOSED'`) to prevent accidental deletion of historical monitoring records.

#### `GET /api/projects/:id/overview` (Project 360°)
- **Purpose**: Single composite endpoint for React Project 360° screen containing:
  - Project master details
  - Latest monthly monitoring record
  - Latest AI risk prediction & model version
  - Top SHAP explainable risk factors
  - Milestone delivery status list
  - Active early warning alerts
  - Active prescriptive recommendations

#### `GET /api/projects/:id/timeline`
- **Purpose**: Chronological timeline combining project approval, start dates, milestone progress, monthly monitoring submissions, risk score changes, and early warning alerts.

#### `GET /api/projects/:id/analytics`
- **Purpose**: Compute live analytical features (cost revision ratio, expenditure ratio, progress velocity, progress slowdown, physical-financial divergence gap, milestone delay velocity).

---

### Monthly Monitoring APIs

#### `GET /api/projects/:id/monthly`
- **Purpose**: Retrieve historical monthly monitoring time-series records for charting trajectories.

#### `GET /api/projects/:id/monthly/latest`
- **Purpose**: Retrieve the single most recent monthly monitoring snapshot.

#### `POST /api/projects/:id/monthly`
- **Purpose**: Submit a new monthly monitoring record. Enforces `UNIQUE(project_id, reporting_month)`.
- **Request Body**:
  ```json
  {
    "reporting_month": "2025-01-01",
    "expenditure": 85.50,
    "cumulative_expenditure": 2530.00,
    "physical_progress": 51.20,
    "financial_progress": 52.10,
    "planned_progress": 56.50,
    "milestones_planned": 8,
    "milestones_completed": 7,
    "milestones_delayed": 0,
    "schedule_variance_days": 15,
    "cost_variance": 0.00,
    "manpower_count": 1600,
    "remarks": "Standard construction velocity maintained."
  }
  ```

#### `PUT /api/projects/:id/monthly/:monthlyDataId`
- **Purpose**: Correct an existing monthly record without violating relational constraints.

---

### Milestone APIs

#### `GET /api/projects/:id/milestones`
- **Purpose**: Retrieve delivery milestones for a project.

#### `POST /api/projects/:id/milestones`
- **Purpose**: Create a new milestone for a project.

#### `PUT /api/projects/:id/milestones/:milestoneId`
- **Purpose**: Update milestone dates, status (`PLANNED`, `IN_PROGRESS`, `COMPLETED`, `DELAYED`), or delay days.

#### `DELETE /api/projects/:id/milestones/:milestoneId`
- **Purpose**: Remove a milestone.

---

### Risk Intelligence APIs

#### `GET /api/projects/:id/risk`
- **Purpose**: Get latest risk prediction score (0–100), predicted final cost, and predicted delay months.

#### `GET /api/projects/:id/risk/history`
- **Purpose**: Get historical risk score trajectory over time.

#### `GET /api/projects/:id/risk/factors`
- **Purpose**: Get SHAP explainable risk factors (`factor_name`, `impact_percentage`, `direction`, `rank`, `explanation`).

#### `GET /api/risks`
- **Purpose**: Get current risk evaluation for all monitored projects.

#### `GET /api/risks/high`
- **Purpose**: Filter projects with `HIGH` risk level.

#### `GET /api/risks/critical`
- **Purpose**: Filter projects with `CRITICAL` risk level.

#### `GET /api/risks/trending`
- **Purpose**: Identify projects exhibiting positive risk acceleration (`risk_acceleration > 0`).

---

### Early Warning Alerts APIs

#### `GET /api/alerts`
- **Purpose**: List alerts with optional filters (`severity`, `status`, `alert_type`, `project_id`).

#### `GET /api/alerts/high` & `GET /api/alerts/critical`
- **Purpose**: Filter high / critical severity alerts.

#### `PUT /api/alerts/:id/acknowledge`
- **Purpose**: Acknowledge an active alert (`status = 'ACKNOWLEDGED'`).

#### `PUT /api/alerts/:id/resolve`
- **Purpose**: Resolve an alert (`status = 'RESOLVED'`).

---

### Prescriptive Recommendations APIs

#### `GET /api/recommendations`
- **Purpose**: List recommendations with priority and status filters.

#### `PUT /api/recommendations/:id/status`
- **Purpose**: Update recommendation status (`PENDING`, `ACCEPTED`, `REJECTED`, `IMPLEMENTED`).

---

### Dashboard Analytics APIs

#### `GET /api/dashboard/summary`
- **Purpose**: High-level KPI metrics for executive overview:
  - `totalProjects`, `ongoingProjects`, `completedProjects`, `delayedProjects`
  - `highRiskProjects`, `criticalRiskProjects`, `mediumRiskProjects`, `lowRiskProjects`
  - `totalOriginalCost`, `totalApprovedCost`, `totalRevisedCost`, `totalExpenditure`
  - `averagePhysicalProgress`, `averageFinancialProgress`
  - `totalActiveAlerts`, `criticalAlerts`

#### `GET /api/dashboard/projects-by-sector`
- **Purpose**: Aggregates project counts, total investments, and risk distributions grouped by sector.

#### `GET /api/dashboard/projects-by-ministry`
- **Purpose**: Aggregates project metrics grouped by ministry.

#### `GET /api/dashboard/projects-by-state`
- **Purpose**: Aggregates project metrics grouped by Indian states & geographic regions.

#### `GET /api/dashboard/risk-distribution`
- **Purpose**: Categorical breakdown of risk tiers with average scores and predicted delay months.

#### `GET /api/dashboard/cost-summary`
- **Purpose**: Macro cost revisions, sanctioned budgets, and budget utilization percentages.

#### `GET /api/dashboard/progress-summary`
- **Purpose**: Sector physical vs financial progress gap analysis.

---

### CSV Upload & Bulk Ingest APIs

#### `POST /api/upload/projects`
- **Content-Type**: `multipart/form-data` (Field name: `file`)
- **Purpose**: Parse, validate, and transactionally insert bulk project records.
- **Response**:
  ```json
  {
    "success": true,
    "message": "Project CSV processing complete",
    "data": {
      "totalRows": 10,
      "successfulRows": 9,
      "failedRows": 1,
      "errors": [
        { "row": 4, "field": "project_code", "message": "Project code already exists in database" }
      ]
    }
  }
  ```

#### `POST /api/upload/monthly-data`
- **Content-Type**: `multipart/form-data` (Field name: `file`)
- **Purpose**: Resolves `project_code` to `project_id`, validates progress bounds (0–100), and transactionally inserts monthly observations.
