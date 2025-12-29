from fastapi import APIRouter, HTTPException
from app.services.skill_score_service import skill_score_service
from app.services.nft_service import nft_service
from app.db import get_collection
from app.utils.responses import ok
from app.utils.signature import validate_wallet_address, normalize_wallet_address
from typing import Dict, Any, List, Optional
from pydantic import BaseModel


router = APIRouter()


class SkillActivityRequest(BaseModel):
    campaign_id: str
    milestone_id: str
    milestone_title: str
    score_earned: float
    difficulty: str = "medium"
    on_time: bool = True
    peer_reviews: List[float] = []


class SkillScoreResponse(BaseModel):
    wallet_address: str
    skill_score: float
    skill_level: str
    skill_nft_token_id: Optional[int] = None
    total_milestones_completed: int
    total_campaigns_participated: int
    average_completion_time: Optional[float] = None
    skill_breakdown: Dict[str, float]
    recent_achievements: List[Dict[str, Any]]
    next_level_threshold: float


@router.get("/skill-score/{wallet_address}", response_model=SkillScoreResponse)
async def get_user_skill_score(wallet_address: str):
    """Get comprehensive skill score data for a user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        normalized_address = normalize_wallet_address(wallet_address)

        skill_data = await skill_score_service.get_skill_score_data(normalized_address)

        if not skill_data:
            raise HTTPException(status_code=404, detail="User not found")

        return SkillScoreResponse(**skill_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get skill score: {str(e)}")


@router.post("/skill-activity/{wallet_address}")
async def add_skill_activity(wallet_address: str, activity: SkillActivityRequest):
    """Add a skill-earning activity for a user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        normalized_address = normalize_wallet_address(wallet_address)

        activity_data = {
            "campaign_id": activity.campaign_id,
            "milestone_id": activity.milestone_id,
            "milestone_title": activity.milestone_title,
            "score_earned": activity.score_earned,
            "difficulty": activity.difficulty,
            "on_time": activity.on_time,
            "peer_reviews": activity.peer_reviews
        }

        updated_user = await skill_score_service.add_skill_activity(normalized_address, activity_data)

        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        return ok({
            "message": "Skill activity added successfully",
            "new_skill_score": updated_user.skill_score,
            "new_skill_level": updated_user.skill_level
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add skill activity: {str(e)}")


@router.post("/mint-skill-nft/{wallet_address}")
async def mint_skill_nft(wallet_address: str):
    """Mint or update skill NFT for a user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        normalized_address = normalize_wallet_address(wallet_address)

        # Get current skill score
        skill_data = await skill_score_service.get_skill_score_data(normalized_address)

        if not skill_data:
            raise HTTPException(status_code=404, detail="User not found")

        # Mint or update skill NFT
        nft_result = await nft_service.update_skill_nft(normalized_address, skill_data["skill_score"])

        if not nft_result:
            raise HTTPException(status_code=500, detail="Failed to mint/update skill NFT")

        # Update user's skill NFT token ID
        collection = await get_collection("users")
        await collection.update_one(
            {"wallet_address": normalized_address},
            {"$set": {"skill_nft_token_id": nft_result["token_id"]}}
        )

        return ok({
            "message": "Skill NFT minted/updated successfully",
            "nft_data": nft_result
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mint skill NFT: {str(e)}")


@router.get("/skill-nft/{wallet_address}")
async def get_skill_nft(wallet_address: str):
    """Get skill NFT information for a user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        normalized_address = normalize_wallet_address(wallet_address)

        skill_nft = await nft_service.get_skill_nft(normalized_address)

        if not skill_nft:
            return ok({"message": "No skill NFT found for user"})

        return ok({"skill_nft": skill_nft})

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get skill NFT: {str(e)}")


@router.put("/skill-score/update/{wallet_address}")
async def update_user_skill_score(wallet_address: str):
    """Manually trigger skill score recalculation for a user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        normalized_address = normalize_wallet_address(wallet_address)

        updated_user = await skill_score_service.update_user_skill_score(normalized_address)

        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")

        return ok({
            "message": "Skill score updated successfully",
            "skill_score": updated_user.skill_score,
            "skill_level": updated_user.skill_level
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update skill score: {str(e)}")