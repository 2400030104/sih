import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml_service.pipelines.inference_pipeline import (
    predict_and_persist_project,
    predict_and_persist_batch,
    get_trained_models
)
from ml_service.pipelines.train_pipeline import run_training_pipeline
from ml_service.config.db_config import test_db_connection

app = FastAPI(
    title="PRAGATI-AI Machine Learning Predictive Intelligence API",
    version="1.2.0",
    description="MoSPI IPMD Infrastructure Risk & Overrun Prediction Microservice"
)

# Allow CORS for Node.js backend and React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    db_ok = test_db_connection()
    return {
        "status": "ok" if db_ok else "database_error",
        "service": "PRAGATI-AI ML Predictive Engine",
        "version": "1.2.0",
        "database_connected": db_ok
    }

@app.post("/predict/{project_id}")
def predict_single(project_id: int):
    try:
        result = predict_and_persist_project(project_id)
        return {
            "success": True,
            "message": f"Predictive intelligence generated and persisted for Project #{project_id}",
            "data": result
        }
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/batch")
def predict_batch():
    try:
        results = predict_and_persist_batch()
        return {
            "success": True,
            "message": f"Batch predictions generated for {len(results)} projects",
            "count": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
def trigger_training(background_tasks: BackgroundTasks):
    try:
        # Run training in background or immediate
        metrics = run_training_pipeline()
        return {
            "success": True,
            "message": "Model training completed successfully",
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("ml_service.api.app:app", host="0.0.0.0", port=8000, reload=True)
