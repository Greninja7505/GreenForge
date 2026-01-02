"""
Blockchain service for ChainFund
Handles all Stellar blockchain operations
"""

import os
import asyncio
from typing import Optional, Dict, Any, List
from app.services.soroban_service import stellar_service, validate_wallet_address, normalize_wallet_address

# Global service instance
blockchain_service = stellar_service

# Re-export functions for backward compatibility
async def deploy_campaign_contract(creator_address: str, goal_amount: int, milestone_count: int) -> Optional[str]:
    """Deploy campaign contract on Stellar"""
    return await stellar_service.deploy_campaign_contract(creator_address, goal_amount, milestone_count)

async def get_account_balance(address: str) -> int:
    """Get account balance from Stellar"""
    account_info = await stellar_service.get_account_info(address)
    if account_info:
        for balance in account_info.get("balances", []):
            if balance.get("asset_type") == "native":
                return int(float(balance["balance"]))
    return 0

async def get_transaction_count(address: str) -> int:
    """Get transaction count (sequence number)"""
    account_info = await stellar_service.get_account_info(address)
    return int(account_info.get("sequence", 0)) if account_info else 0

async def send_transaction(from_address: str, to_address: str, amount: int) -> Optional[str]:
    """Send XLM transaction"""
    # This is a simplified version - in practice would need proper key management
    try:
        # For demo purposes, return a mock transaction hash
        import uuid
        return f"tx_{uuid.uuid4().hex}"
    except Exception:
        return None

async def get_contract_balance(contract_address: str) -> int:
    """Get contract balance"""
    return await stellar_service.get_campaign_balance(contract_address)

async def mint_nft(recipient: str, token_uri: str) -> Optional[str]:
    """Mint skill NFT"""
    # Extract skill data from token_uri (simplified)
    skill_score = 100  # Default
    skill_level = "Beginner"
    return await stellar_service.mint_skill_nft(recipient, skill_score, skill_level)

async def get_nft_owner(token_id: str) -> Optional[str]:
    """Get NFT owner"""
    # This would query the contract for NFT ownership
    return None  # Placeholder

async def get_network_status() -> Dict[str, Any]:
    """Get network status"""
    return await stellar_service.get_network_status()

# Export the service
__all__ = [
    'blockchain_service',
    'deploy_campaign_contract',
    'get_account_balance',
    'get_transaction_count',
    'send_transaction',
    'get_contract_balance',
    'mint_nft',
    'get_nft_owner',
    'get_network_status',
    'validate_wallet_address',
    'normalize_wallet_address'
]