import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_service.src.api.routes import router as api_router
from ai_service.src.rag.ingest import get_vector_store

app = FastAPI(
    title="PRAGATI-AI Decision Support & Copilot Microservice",
    description="RAG-powered AI assistant, Intervention Priority Engine, What-If Simulator for IPMD Infrastructure Monitoring",
    version="1.2.0"
)

# Enable CORS for internal Node.js backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Warm up RAG vector index
    try:
        get_vector_store()
    except Exception as e:
        print(f"[Warning] Failed to warm up vector store on startup: {e}")

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run("ai_service.src.main:app", host="0.0.0.0", port=8001, reload=True)
