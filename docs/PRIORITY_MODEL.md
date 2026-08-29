# PRAGATI-AI Intervention Priority Scoring Model

**Document Code**: `PRIORITY_MODEL.md`  
**Purpose**: Mathematical Formulation and Governance of Project Intervention Priority  
**Target Variable**: `intervention_priority_score` (Continuous Range: 0.0 to 100.0)  

---

## 1. Executive Rationale
Sorting infrastructure projects solely by overall risk percentage is insufficient for policy prioritization. A ₹10,000 crore mega-project with an accelerating 15% execution lag poses significantly higher national economic exposure than a ₹200 crore project with a static delay.

The **Intervention Priority Model** synthesizes 5 orthogonal factors into an actionable ranking score:

$$\text{Priority Score} = 0.35 \cdot \text{RiskSeverity} + 0.25 \cdot \text{RiskAcceleration} + 0.15 \cdot \text{FinancialExposure} + 0.15 \cdot \text{ScheduleExposure} + 0.10 \cdot \text{MilestoneExposure}$$

---

## 2. Factor Mathematical Definitions

### 1. Risk Severity ($w_1 = 0.35$)
$$\text{RiskSeverity} = \text{clip}(\text{overall\_risk}, 0, 100)$$
Captures the composite baseline model prediction.

### 2. Risk Acceleration & Execution Gap ($w_2 = 0.25$)
$$\text{ExecutionGap} = \max(\text{planned\_progress} - \text{physical\_progress}, 0)$$
$$\text{RiskAcceleration} = \text{clip}\left(2.5 \cdot \text{ExecutionGap} + 40 \cdot \frac{\text{delayed\_milestones}}{\max(\text{total\_milestones}, 1)}, 0, 100\right)$$
Penalizes projects with widening monthly deficits and cascading milestone slippage.

### 3. Financial Exposure ($w_3 = 0.15$)
$$\text{CostOverrunExposure} = \max(\text{predicted\_final\_cost} - \text{approved\_cost}, 0)$$
$$\text{FinancialExposure} = \text{clip}\left(2.0 \cdot \frac{\text{CostOverrunExposure}}{\text{approved\_cost}} \cdot 100 + 20 \cdot \frac{\text{approved\_cost}}{5000}, 0, 100\right)$$
Weights both relative cost expansion and total capital volume at risk.

### 4. Schedule Exposure ($w_4 = 0.15$)
$$\text{ScheduleExposure} = \text{clip}(4.0 \cdot \text{predicted\_delay\_months}, 0, 100)$$
Quantifies timeline extension beyond approved commissioning dates.

### 5. Critical Milestone Exposure ($w_5 = 0.10$)
$$\text{MilestoneExposure} = \text{clip}\left(150 \cdot \frac{\text{critical\_delayed\_milestones}}{\max(\text{total\_milestones}, 1)}, 0, 100\right)$$
Directly captures critical-path bottlenecks.

---

## 3. Intervention Tier Classification

| Priority Tier | Score Threshold | Designation | Prescribed Administrative Protocol |
|---|---|---|---|
| **P1** | $\ge 68.0$ (or Risk $\ge 75.0$) | **Immediate Intervention** | Escalation to Cabinet Secretariat / PRAGATI Apex Review; mandatory site audit within 7 days. |
| **P2** | $45.0 \le \text{Score} < 68.0$ | **High Priority** | Departmental Standing Committee review; contractor recovery schedule submission within 14 days. |
| **P3** | $25.0 \le \text{Score} < 45.0$ | **Monitor Closely** | Enhanced monthly milestone tracking; district administrative coordination. |
| **P4** | $< 25.0$ | **Routine Monitoring** | Standard monthly monitoring verification. |
