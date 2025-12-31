from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.ai_service import ai_service
from app.routers.auth import get_current_user

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Features"],
    responses={404: {"description": "Not found"}},
)

class AnalysisRequest(BaseModel):
    title: str
    description: str
    category: str = "General"

class AnalysisResponse(BaseModel):
    score: int
    credibility_level: str
    flags: List[str]
    suggestions: List[str]
    impact_metrics: List[str]
    summary: str

class ProofRequest(BaseModel):
    milestone_title: str
    image_base64: Optional[str] = None # Or handle file upload separately, keeping it simple for JSON body

@router.post("/verify-proof")
async def verify_proof(request: ProofRequest, current_user: dict = Depends(get_current_user)):
    """
    Simulates Computer Vision analysis of a proof-of-work image.
    Returns verification status and detected objects.
    """
    try:
        result = await ai_service.verify_proof_of_work(
            milestone_title=request.milestone_title
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-sustainability", response_model=AnalysisResponse)
async def analyze_sustainability(request: AnalysisRequest, current_user: dict = Depends(get_current_user)):
    """
    Analyzes a project proposal for sustainability credibility using AI.
    Returns a score and detailed feedback to detect Greenwashing.
    """
    try:
        result = await ai_service.analyze_sustainability(
            title=request.title,
            description=request.description,
            category=request.category
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def ai_health_check():
    """
    Checks if the AI service is configured and ready.
    """
    return {
        "status": "online",
        "provider": "Groq" if ai_service.client else "Mock",
        "model": "llama3-70b-8192"
    }
