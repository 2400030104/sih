# Phase 5: AI Copilot & Decision Support Architecture

**System**: PRAGATI-AI (Predictive Risk Analytics & Government Actionable Intelligence for Infrastructure)  
**Domain**: Infrastructure & Project Monitoring Division (IPMD), Ministry of Statistics and Programme Implementation (MoSPI)  
**Release**: Phase 5 (Production Intelligence & Decision Support Suite)  

---

## 1. System Topology & Communication Flow

```
                     React 18 Executive UI & Copilot
                                   │
                                   ▼ (HTTP / WebSocket)
                       Node.js API Gateway (Port 5000)
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
      MySQL Database        Python ML Service      Python AI/RAG Service
       (Port 3306)            (Port 8000)               (Port 8001)
     16 Tables / Views       GBR / GBC / SHAP       LLM + RAG + FAISS
            │                      │                      │
            └──────────────────────┴──────────────────────┘
                                   │
                           Decision Support
                                   │
                 ┌─────────────────┼─────────────────┐
                 ▼                 ▼                 ▼
          Priority Queue        What-If        Recommendations
          (P1-P4 Ranking)      Simulation         (9 Types)
                 │                 │                 │
                 └─────────────────┼─────────────────┘
                                   │
                               Socket.IO
                                   │
                                   ▼
                             React Clients
```

---

## 2. Core Architectural Principles

1. **Strict Client-Side Isolation**:
   - The React frontend **never** connects directly to MySQL, Python ML, or LLM daemons.
   - All client queries flow through the Node.js API gateway with input validation and rate-limiting.
2. **Zero-Paid-API & 100% Offline Capability**:
   - Uses open-source embeddings and local vector indexing (FAISS / Cosine similarity).
   - Multi-tier Copilot intelligence: connects to local Ollama (`llama3` / `mistral`) if running; seamlessly switches to deterministic grounded synthesis if Ollama is offline.
3. **No Arbitrary SQL Generation**:
   - The LLM is strictly prohibited from generating raw SQL.
   - All database reads go through typed, pre-defined query functions in `ai_service/src/tools/`.
4. **Prompt Injection & Hallucination Defense**:
   - Retrieved documents and database rows are tagged strictly as untrusted **DATA**.
   - System prompts explicitly forbid following instructions embedded within retrieved content.
   - If a requested data point (e.g. personal contractor names) is missing from the high-level schema, the AI explicitly states that information is unavailable.

---

## 3. Decision Support Modules

| Module | Core Logic | Output |
|---|---|---|
| **Intervention Priority Engine** | Formula combining Risk Severity (35%), Execution Gap (25%), Financial Exposure (15%), Schedule Exposure (15%), Milestone Slippage (10%) | Ranked queue with P1-P4 priority tiers |
| **Recommendation Engine** | Rule-based policy engine covering 9 categories (Schedule Recovery, Cost Control, Milestone Intervention, Contractor Review, etc.) | Factual action plans with expected objectives & confidence |
| **What-If Scenario Simulator** | Evaluates modified in-memory feature vectors through Phase 4 Gradient Boosting ML models without touching MySQL | Base Case vs Scenario Case deltas (Risk Δ, Delay Δ, Cost Δ) |
| **Grounded AI Copilot** | Intent detection + Safe Tool querying + Vector RAG guideline retrieval | Structured 5-part responses (Answer, Evidence, Prediction, Action, Limitation) |
