from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from app.services.reward_service import RewardService
from app.services.stellar_service import StellarService
from app.models.reward import RewardCreate, RewardResponse
from app.utils.auth import get_current_user

router = APIRouter()
reward_service = RewardService()
stellar_service = StellarService()

@router.post("/distribute-reward", response_model=RewardResponse)
async def distribute_reward(
    reward_data: RewardCreate,
    current_user = Depends(get_current_user)
):
    """
    Distribute reward tokens after a successful donation
    """
    reward_id = await reward_service.process_reward(
        donor_wallet=reward_data.donor_wallet,
        project_id=reward_data.project_id,
        donation_amount=reward_data.donation_amount
    )
    
    if not reward_id:
        raise HTTPException(status_code=500, detail="Failed to process reward")
    
    return {"reward_id": reward_id, "status": "success"}

@router.get("/rewards/donor/{donor_wallet}", response_model=List[RewardResponse])
async def get_donor_rewards(
    donor_wallet: str,
    current_user = Depends(get_current_user)
):
    """
    Get all rewards for a specific donor
    """
    rewards = await reward_service.get_donor_rewards(donor_wallet)
    return rewards

@router.get("/rewards/project/{project_id}", response_model=List[RewardResponse])
async def get_project_rewards(
    project_id: str,
    current_user = Depends(get_current_user)
):
    """
    Get all rewards distributed for a specific project
    """
    rewards = await reward_service.get_project_rewards(project_id)
    return rewards

@router.get("/rewards/balance/{wallet_address}")
async def get_reward_balance(
    wallet_address: str,
    current_user = Depends(get_current_user)
):
    """
    Get reward token balance for a wallet address
    """
    result = await stellar_service.get_reward_balance(wallet_address)
    if not result.get('success'):
        raise HTTPException(status_code=500, detail=result.get('error', 'Failed to get balance'))
    return {"balance": result['result']}
    return rewards

@router.get("/rewards/balance/{wallet}", response_model=dict)
async def get_reward_balance(
    wallet: str,
    current_user = Depends(get_current_user)
):
    """
    Get the current reward token balance for a wallet
    """
    balance = stellar_service.get_reward_balance(wallet)
    return {"wallet": wallet, "balance": balance}