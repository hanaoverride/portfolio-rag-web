"""Admin API endpoints for system management."""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.data.ingest import ingest_data
from app.config import settings

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/ingest")
async def trigger_ingestion(background_tasks: BackgroundTasks):
    """
    Manually trigger RAG data ingestion.
    In a real application, this should be protected by admin authentication.
    """
    # For now, just a simple check or allow in demo/local mode
    if settings.environment == "production" and not settings.demo_mode:
         # In production, we'd want real auth. 
         # For this portfolio, we'll allow it or skip auth for now.
         pass

    try:
        # Run ingestion in the background to avoid timeout
        background_tasks.add_task(ingest_data)
        return {"message": "Ingestion started in the background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start ingestion: {str(e)}")
