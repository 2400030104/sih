# PRAGATI-AI Intelligence Model Card

## 1. Model Details
- **Organization**: Ministry of Statistics and Programme Implementation (MoSPI) / Infrastructure & Project Monitoring Division (IPMD)
- **Model Name**: PRAGATI-AI Decision Support & Intelligence Engine
- **Version**: `v1.2.0-Production`
- **Model Architecture**:
  - **Predictive ML**: `GradientBoostingRegressor` (Cost & Time Overruns), `GradientBoostingClassifier` (Composite 4-Gauge Risk Synthesis), `TreeSHAP` (Feature Attribution).
  - **RAG & Embeddings**: Normalized TF-IDF / Subword Hashing / `all-MiniLM-L6-v2` with Cosine Similarity Vector Index.
  - **LLM Synthesis**: Local Ollama (`llama3:latest` / `mistral`) with deterministic grounded synthesis fallback.

---

## 2. Intended Use
- **Primary Use Case**: Analytical decision support, early warning signal detection, intervention priority ranking, and what-if policy simulation for Central Sector Infrastructure Projects costing ₹150 crore and above.
- **Target Users**: IPMD project directors, ministry monitoring officers, departmental standing committees, and infrastructure policymakers.
- **Out of Scope**: Binding legal arbitrations, commercial contractor blacklisting, and automatic budget reallocation without human officer verification.

---

## 3. Data & Feature Sources
1. **PAIMANA / OCMS Monitoring Records**:
   - Monthly physical & financial progress (%), cumulative expenditures, schedule variance (days).
   - Milestone tracking registries (planned, revised, actual dates, delay days, criticality).
2. **Knowledge Base Documents**:
   - `mospi_ipmd_monitoring_guidelines.md`
   - `risk_assessment_framework.md`
   - `infrastructure_recovery_guidelines.md`
   - `government_procurement_and_milestones.md`

---

## 4. Hallucination & Security Controls
1. **No Fact Invention**: All numbers, dates, budgets, and project codes originate strictly from retrieved SQL records.
2. **Explicit Uncertainty**: When information is absent (e.g., individual contractor personnel), the system admits missing data.
3. **Anti-Prompt Injection**: Retrieved text is bounded as read-only data blocks. System prompt retains execution priority.
4. **Non-Destructive Sandbox**: What-If scenario simulations operate strictly on in-memory feature vector copies.
