from typing import Optional
from datetime import datetime
from app.services.stellar_service import StellarService
from app.services.email_service import EmailService
from app.models.reward import Reward
from app.db import get_db

class RewardService:
    def __init__(self):
        self.stellar_service = StellarService()
        self.email_service = EmailService()
        self.db = get_db()
    
    async def process_reward(self, donor_wallet: str, project_id: str, donation_amount: int) -> Optional[str]:
        """
        Process reward token minting after a successful donation
        """
        # Calculate reward amount (example: 1 token per 1 XLM donated)
        reward_amount = donation_amount
        
        # Get admin wallet for minting
        admin_wallet = await self.db.get_admin_wallet()
        
        # Mint reward tokens using Soroban contract
        result = await self.stellar_service.mint_reward_tokens(
            to_address=donor_wallet,
            amount=reward_amount,
            source_account=admin_wallet
        )
        
        success = result.get('success', False)
        
        if not success:
            return None
        
        # Store reward record in database
        reward = Reward(
            donor_wallet=donor_wallet,
            project_id=project_id,
            amount=reward_amount,
            timestamp=datetime.utcnow()
        )
        await self.db.rewards.insert_one(reward.dict())
        
        # Send confirmation email
        donation_details = {
            'amount': donation_amount,
            'reward_amount': reward_amount,
            'project_id': project_id,
            'timestamp': datetime.utcnow()
        }
        await self.email_service.send_reward_confirmation(donor_wallet, donation_details)
        
        return str(reward.id)
    
    async def get_donor_rewards(self, donor_wallet: str) -> list:
        """
        Get all rewards for a specific donor
        """
        rewards = await self.db.rewards.find({'donor_wallet': donor_wallet}).to_list(None)
        return rewards
    
    async def get_project_rewards(self, project_id: str) -> list:
        """
        Get all rewards distributed for a specific project
        """
        rewards = await self.db.rewards.find({'project_id': project_id}).to_list(None)
        return rewards