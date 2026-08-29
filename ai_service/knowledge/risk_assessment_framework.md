# PRAGATI-AI Infrastructure Risk Assessment Framework

**Document Category**: Analytical Model & Technical Standards  
**System**: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure)  
**Standard**: 4-Gauge Risk Matrix & Multi-Tier Classification  

---

## 1. Multi-Gauge Risk Architecture
PRAGATI-AI evaluates project vulnerability across 4 fundamental operational dimensions (each scored on a continuous scale of 0 to 100):

1. **Cost Risk (0–100)**: Evaluates budget inflation probability, cost revision ratios, expenditure velocity, and historical tender variance.
2. **Schedule Risk (0–100)**: Measures timeline slippage, milestone completion velocity, remaining execution window vs unexecuted physical scope.
3. **Scope Risk (0–100)**: Detects design modifications, unapproved package expansions, and statutory clearance bottlenecks.
4. **Contractor / Execution Risk (0–100)**: Analyzes manpower shortfall, plant and machinery deployment deficit, critical milestone delays, and vendor performance history.

---

## 2. Composite Risk Synthesis Formula
$$\text{Overall Risk Score} = 0.35 \cdot \text{Cost Risk} + 0.35 \cdot \text{Schedule Risk} + 0.15 \cdot \text{Scope Risk} + 0.15 \cdot \text{Contractor Risk}$$

The resulting continuous score (0–100) is classified into four administrative intervention tiers:

| Score Range | Risk Tier | Administrative Action Required |
|---|---|---|
| **75.0 – 100.0** | **CRITICAL** | Immediate inter-ministerial task force escalation; weekly monitoring review; mandatory site audit. |
| **50.0 – 74.9** | **HIGH** | Departmental Empowered Committee review; contractor recovery plan submission within 15 days. |
| **25.0 – 49.9** | **MEDIUM** | Standard monthly monitoring; milestone adherence tracking; regular agency coordination. |
| **0.0 – 24.9** | **LOW** | Routine monitoring; project progressing within acceptable tolerance bands. |

---

## 3. Early Warning Indicators (EWIs)
Early Warning Indicators act as leading signals before major cost or time overruns manifest:
1. **EWI-01 (Milestone Cascade)**: 2 or more consecutive milestones delayed by >30 days.
2. **EWI-02 (Physical Lag)**: Physical progress lagging planned schedule by >10% for 3 consecutive monthly reporting cycles.
3. **EWI-03 (Financial Disproportion)**: Cumulative financial expenditure exceeding physical progress by >20%.
4. **EWI-04 (Manpower Deficit)**: Site labor deployment below 60% of required mobilization chart for >60 days.
5. **EWI-05 (Velocity Deceleration)**: Monthly physical progress velocity dropping below 50% of the required catch-up run rate.

---

## 4. SHAP Feature Attribution in Infrastructure Risk
Machine learning models (Gradient Boosting & Random Forest) compute TreeSHAP values for each project prediction:
- **Positive SHAP Values**: Factors driving risk upward (e.g., Land acquisition delay +0.28, Critical milestone slippage +0.19).
- **Negative SHAP Values**: Stabilizing factors mitigating risk (e.g., High monthly physical velocity -0.15, On-time civil package completion -0.12).
- The top 5 drivers are surfaced to decision makers with precise impact percentages and plain-language administrative narratives.
