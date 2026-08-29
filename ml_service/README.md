# PRAGATI-AI Machine Learning Predictive Intelligence Service (Phase 4)

**PRAGATI-AI**: Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure  
**Problem Domain**: Ministry of Statistics and Programme Implementation (MoSPI) / Infrastructure & Project Monitoring Division (IPMD)  
**Machine Learning Framework**: Python 3.11 / scikit-learn / pandas / numpy / SHAP / SQLAlchemy / FastAPI  
**Database**: MySQL 8.0+ / `pragati_ai` (InnoDB, utf8mb4)  
**Microservice Port**: `8000`

---

## 1. Machine Learning Architecture Overview

The Python ML Service powers predictive analytics across Central Sector Infrastructure Projects (₹150 Cr and above):

```
React 18 Executive Dashboard
       │
       ▼ (REST / Socket.IO)
Node.js + Express Backend (Port 5000)
       │
       ▼ (SQL Read / Write)
MySQL Database: pragati_ai (Port 3306)
       ▲
       │ (Feature Extraction & Prediction Persistence)
Python ML Service / FastAPI (Port 8000)
       ▼
Prediction Models
  ├── 1. Cost Overrun Model (Gradient Boosting / Random Forest Regressor)
  ├── 2. Time Overrun Model (Schedule Slippage in Months & Completion Projection)
  ├── 3. Implementation Risk Scoring Model (0-100 Multi-Gauge & Risk Tier Classifier)
  └── 4. Explainable AI Engine (SHAP / Feature Attribution Risk Drivers)
```

---

## 2. Prediction Models & Algorithms

### 1. Cost Overrun Prediction Model
- **Target**: `target_cost_overrun_pct` (%) and `predicted_final_cost` (₹ Cr).
- **Algorithm**: `GradientBoostingRegressor` (learning_rate=0.08, n_estimators=100, max_depth=4).
- **Baseline Comparison**: `Ridge(alpha=1.0)`.
- **Validation**: 80/20 train-test split, strict featurization ordering (preprocessors fit on training split only).

### 2. Time Overrun Prediction Model
- **Target**: `target_delay_months` (months) and `predicted_completion_date` (ISO Date).
- **Algorithm**: `GradientBoostingRegressor` (learning_rate=0.08, n_estimators=100, max_depth=4).
- **Baseline Comparison**: `Ridge(alpha=1.0)`.

### 3. Implementation Risk Scoring Model
- **Target**: Multi-dimensional 4-gauge scores and Risk Tier classification (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Formulation**:
  $$\text{Overall Risk} = 0.30 \cdot \text{CostRisk} + 0.30 \cdot \text{ScheduleRisk} + 0.20 \cdot \text{ScopeRisk} + 0.20 \cdot \text{ContractorRisk}$$
- **Algorithm**: `GradientBoostingClassifier` with probability calibration.

### 4. Explainable AI Engine (XAI)
- Extracts top 4-5 explainable SHAP / feature attribution risk drivers per project:
  - `PROG_GAP_SHAP`: Physical execution lagging planned milestones.
  - `COST_INFLATION_SHAP`: Budget expansion over original baseline sanction.
  - `MS_DELAY_SHAP`: Critical path milestone slippage.
  - `GAP_SHAP`: Spend vs physical progress asymmetry.
  - `PROG_SLOW_SHAP`: Constrained monthly velocity / stagnation.

---

## 3. Directory Structure

```
ml_service/
├── .venv/                         # Dedicated Python virtual environment
├── config/
│   ├── __init__.py
│   └── db_config.py               # Safe SQLAlchemy URL creator & connection pool
├── data/
│   ├── __init__.py
│   ├── feature_extractor.py       # SQL queries extracting 40+ raw & engineered features
│   └── preprocessor.py            # ColumnTransformer, StandardScaler, OneHotEncoder
├── models/
│   ├── __init__.py
│   ├── cost_overrun_model.py      # Cost overrun regression & risk scoring
│   ├── time_overrun_model.py      # Schedule delay & completion date forecasting
│   ├── risk_scoring_model.py      # 4-gauge risk synthesis & tier classifier
│   └── explainability.py          # SHAP/Attribution factor generator
├── trained_artifacts/             # Serialized .joblib model files
├── pipelines/
│   ├── __init__.py
│   ├── train_pipeline.py          # End-to-end training & baseline evaluation
│   └── inference_pipeline.py      # Live single-project and batch MySQL persistence
├── api/
│   ├── __init__.py
│   └── app.py                     # FastAPI REST API (Port 8000)
├── tests/
│   ├── __init__.py
│   └── test_ml_pipeline.py        # Automated pytest suite (7/7 passing)
├── requirements.txt               # Dependencies
└── README.md                      # Documentation
```

---

## 4. Setup & Running Instructions

### 1. Setup Virtual Environment
```bash
cd ml_service
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

### 2. Train Models & Generate Artifacts
```bash
.venv\Scripts\python -m ml_service.pipelines.train_pipeline
```

### 3. Run Automated Tests
```bash
.venv\Scripts\pytest ml_service/tests/test_ml_pipeline.py -v
```

### 4. Start FastAPI Microservice (Port 8000)
```bash
.venv\Scripts\uvicorn ml_service.api.app:app --host 0.0.0.0 --port 8000 --reload
```

---

## 5. API Endpoints Reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Check microservice and database connectivity |
| `/predict/{project_id}` | POST | Run predictive scoring for single project & write to MySQL |
| `/predict/batch` | POST | Run batch predictive scoring across all active projects |
| `/train` | POST | Trigger background model re-training pipeline |
