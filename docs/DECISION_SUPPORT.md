# PRAGATI-AI Decision Support & What-If Methodology

**Document Code**: `DECISION_SUPPORT.md`  
**System**: PRAGATI-AI Decision Support System  
**Framework**: IPMD / MoSPI Infrastructure Project Monitoring  

---

## 1. Decision Support Architecture Overview

PRAGATI-AI transitions infrastructure project monitoring from **reactive tracking** to **proactive, prescriptive intervention**:

```
Monitoring Data (PAIMANA)
          │
          ▼
Predictive Models (Gradient Boosting) ────► 4-Gauge Risk Scores
          │
          ▼
Decision Support Engine
   ├── 1. Multi-Factor Intervention Priority Queue (P1–P4)
   ├── 2. Structured Policy & Technical Recommendations (9 Types)
   └── 3. Interactive What-If Scenario Sandbox
          │
          ▼
Grounded AI Copilot & Real-Time Executive Dashboards
```

---

## 2. Recommendation Engine Taxonomy

The Recommendation Engine executes deterministic evaluation rules across 9 operational categories:

1. **SCHEDULE_RECOVERY**: Fast-tracking non-interfering packages, multi-shift civil execution.
2. **COST_CONTROL**: Value engineering audits, unallocated contingency freeze, price escalation reconciliation.
3. **MILESTONE_INTERVENTION**: Mandatory Milestone Recovery Schedule (MRS) within 14 calendar days.
4. **CONTRACTOR_REVIEW**: Notices to correct under FIDIC/EPC clauses, joint venture parent escalation.
5. **RESOURCE_REVIEW**: District coordination cells for Right-of-Way (RoW) and statutory clearance bottlenecks.
6. **RISK_ESCALATION**: Ministry Empowered Committee / PRAGATI platform escalation.
7. **PROGRESS_REVIEW**: Monthly progress velocity reconciliation.
8. **FINANCIAL_REVIEW**: Verification of financial disbursements against certified site measurements.
9. **DATA_QUALITY_REVIEW**: Audit of reporting discrepancies.

---

## 3. What-If Scenario Methodology

The What-If simulator allows project managers to simulate the effect of corrective actions without modifying live production data:

1. **Feature Vector Duplication**: An in-memory copy of the project's engineered feature vector is generated.
2. **Controlled Parameter Modification**:
   - `latest_physical_progress` adjusted by $\Delta \text{Progress Acceleration}$.
   - `progress_gap` recalculated against planned baseline.
   - `avg_milestone_delay_days` reduced by $\Delta \text{Delay Recovery}$.
   - `progress_velocity` updated.
3. **ML Inference**: The modified feature vector is passed through the actual trained Phase 4 `CostOverrunModel`, `TimeOverrunModel`, and `RiskScoringModel`.
4. **Delta Generation**: Compares Base Case vs Scenario Case ($\Delta \text{Risk}$, $\Delta \text{Delay Months}$, $\Delta \text{Final Cost}$).
5. **Transparency**: Explicitly labeled as an illustrative model projection.
