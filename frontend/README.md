# PRAGATI-AI Frontend — National Infrastructure Command Center (Phase 3)

**System**: PRAGATI-AI — Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Problem Domain**: Ministry of Statistics and Programme Implementation (MoSPI) / Infrastructure & Project Monitoring Division (IPMD)  
**Frontend Framework**: React 18 + Vite (TypeScript)  
**Design System**: Tailwind CSS enterprise command center theme  
**Visual Style**: National Infrastructure Project Monitoring Command Center  
**Backend API**: Node.js + Express (`http://localhost:5000/api`)

---

## 1. Overview

The PRAGATI-AI Frontend is a high-density, mission-critical infrastructure project monitoring command center designed for IPMD/MoSPI monitoring officers and government decision-makers. It delivers:

- **Executive Oversight**: Real-time KPI summaries for all ₹150+ Crore Central Sector projects.
- **Geographic Risk Heatmap**: Geospatial India map color-coded by predictive risk severity.
- **Portfolio Analytics**: Risk distribution donuts, sector/ministry project distributions, and accelerating risk trends.
- **Project 360° Comprehensive Deep-Dive**: Consolidated single-pane view of sanctioned costs, expenditure burn rates, physical/financial progress divergence, delivery milestones, and multi-month AI risk trajectories.
- **Explainable AI (SHAP Drivers)**: Ranked feature attribution factors explaining why projects are categorized as high or critical risk.
- **Early Warning Signals & Prescriptive Recommendations**: Autonomous notification center with acknowledgment and resolution workflows.

---

## 2. Technology Stack

- **Framework**: React 18 (`react`, `react-dom`)
- **Build Tool**: Vite (`vite`) with `@vitejs/plugin-react`
- **Language**: TypeScript (`typescript`)
- **Routing**: React Router v6 (`react-router-dom`)
- **HTTP Client**: Axios (`axios`) with centralized error interception
- **Styling**: Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
- **Icons**: Lucide React (`lucide-react`)
- **Data Visualization**: Recharts (`recharts`)
- **Geospatial Mapping**: Leaflet & React Leaflet (`leaflet`, `react-leaflet`)

---

## 3. Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Navigation drawer with MoSPI insignia & Phase 5 placeholders
│   │   │   ├── Navbar.tsx             # Breadcrumbs, alert counter, refresh trigger, officer profile
│   │   │   └── PageContainer.tsx      # Standardized header and content wrapper
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx           # Executive KPI metric cards
│   │   │   ├── RiskDistribution.tsx   # Risk level donut chart
│   │   │   ├── SectorChart.tsx        # Projects by sector bar chart
│   │   │   ├── MinistryChart.tsx      # Projects by ministry horizontal bar chart
│   │   │   ├── ProjectRiskTable.tsx   # Top high & critical risk projects table
│   │   │   └── IndiaRiskMap.tsx       # Leaflet geographic India risk map
│   │   ├── projects/
│   │   │   ├── ProjectTable.tsx       # Paginated, sortable projects data table
│   │   │   ├── ProjectFilters.tsx     # Debounced search, status, and risk filters
│   │   │   ├── RiskBadge.tsx          # Semantic risk level badges (Low, Medium, High, Critical)
│   │   │   └── StatusBadge.tsx        # Project status pills
│   │   ├── project/
│   │   │   ├── ProjectHeader.tsx      # Project title, code, sector, ministry, state ribbon
│   │   │   ├── ProjectSummary.tsx     # Sanctioned cost, revised cost, expenditure, progress
│   │   │   ├── RiskOverview.tsx       # 4-gauge predictive risk scores & model explainability
│   │   │   ├── RiskTrendChart.tsx     # Multi-month historical risk trajectory line chart
│   │   │   ├── RiskFactors.tsx        # Ranked SHAP explainable feature attribution drivers
│   │   │   ├── ProgressCard.tsx       # Physical vs Financial vs Planned progress trajectory
│   │   │   ├── CostCard.tsx           # Monthly expenditure burn rate bar chart
│   │   │   ├── MilestoneTable.tsx     # Delivery milestones and delay days
│   │   │   ├── Timeline.tsx           # Chronological vertical lifetime timeline
│   │   │   ├── AlertList.tsx          # Project-specific early warning alerts
│   │   │   └── RecommendationList.tsx # Prescriptive intervention actions
│   │   └── common/
│   │       ├── Loading.tsx            # Skeleton loaders and spinner
│   │       ├── ErrorMessage.tsx       # Error state with retry trigger
│   │       ├── EmptyState.tsx         # Contextual empty state illustrations
│   │       ├── Modal.tsx              # Generic modal overlay
│   │       ├── Badge.tsx              # Reusable badge tag
│   │       └── Pagination.tsx         # Backend pagination controls
│   ├── pages/
│   │   ├── Dashboard.tsx              # National Command Center Overview
│   │   ├── Projects.tsx               # Projects Directory & Filter Workbench
│   │   ├── ProjectDetails.tsx         # Project 360° Comprehensive Deep-Dive
│   │   ├── RiskAnalytics.tsx          # Portfolio Risk Heatmap & Accelerations
│   │   ├── Alerts.tsx                 # Early Warning Notifications Feed
│   │   ├── Recommendations.tsx        # Prescriptive Decision Support Board
│   │   └── NotFound.tsx               # 404 Error Screen
│   ├── services/
│   │   ├── api.ts                     # Axios client & typed API methods
│   │   └── types.ts                   # TypeScript interfaces matching backend models
│   ├── hooks/
│   │   ├── useProjects.ts             # Project list and pagination hook
│   │   ├── useDashboard.ts            # Dashboard KPI and chart data hook
│   │   ├── useRisk.ts                 # Risk portfolio and trend hook
│   │   └── useAlerts.ts               # Alerts management hook
│   ├── utils/
│   │   ├── formatCurrency.ts          # ₹ Cr / Lakh Cr formatter
│   │   ├── formatDate.ts              # Indian standard date formatter
│   │   └── riskUtils.ts               # Risk badge styles and threshold helpers
│   ├── App.tsx                        # Router configuration and layout shell
│   ├── main.tsx                       # React 18 DOM mount
│   └── index.css                      # Tailwind imports and custom styles
├── .env.example
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 4. Setup & Running

### Prerequisites
- Node.js (v18.0.0+)
- Phase 2 Backend running at `http://localhost:5000`

### Installation
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure the environment:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `VITE_API_BASE_URL=http://localhost:5000/api`)*

### Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:3000`** (or Vite allocated port).

### Production Build & Typecheck
```bash
npm run build
```

---

## 5. Application Navigation & Routes

| Route | Page | Purpose |
|---|---|---|
| `/` or `/dashboard` | **National Command Center** | Macro KPIs, geographic India risk map, sector/ministry distributions, top intervention table, recent alerts |
| `/projects` | **Projects Directory** | Searchable, filterable (ministry, sector, status, risk tier) data table with backend pagination |
| `/projects/:id` | **Project 360° Overview** | Comprehensive deep-dive: Sanctioned/revised budgets, progress curves, 4-gauge risk assessment, multi-month risk trajectory, SHAP drivers, milestones, chronological lifetime timeline |
| `/risk-analytics` | **Portfolio Risk Intelligence** | Risk tier breakdown, critical projects, and accelerating risk trends (`risk_acceleration > 0`) |
| `/alerts` | **Early Warning Notifications** | Severity-filtered feed with interactive acknowledge and resolve actions |
| `/recommendations` | **Prescriptive Recommendations** | Policy and operational decision-support interventions with acceptance workflows |

---

## 6. Future Phase Integration (Phase 4 & 5)

- **Phase 4 (AI/ML Predictions)**: Components like `<RiskOverview />`, `<RiskTrendChart />`, and `<RiskFactors />` are designed to directly ingest Python XGBoost/CatBoost model outputs and SHAP feature attributions without frontend redesign.
- **Phase 5 (AI Copilot & What-If)**: Navigation drawers and command center cards include visual placeholders clearly marked *"Coming in Phase 5"*.
#   s i h  
 