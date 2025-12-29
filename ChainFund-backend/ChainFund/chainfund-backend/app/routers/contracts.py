from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import JSONResponse
from typing import Dict, Any
import subprocess
import os

# Create router without prefix - prefix will be added in main.py
router = APIRouter()

from app.config import Settings
settings = Settings()

# Use the contract ID from configuration
CONTRACT_ID = settings.chainfund_contract_id
DEFAULT_CONTRACT_BALANCE = "0"  # Initial balance will be 0

# Store contract balances in memory (replace with database in production)
contract_balances = {}

@router.get("/test")
async def test_route():
    """Test route to verify the contracts router is working"""
    return {"message": "Contracts router is working", "contract_id": CONTRACT_ID}

@router.get("/status/{project_id}")
async def get_contract_status(project_id: str):
    """Get contract status for a project"""
    try:
        balance = contract_balances.get(project_id, DEFAULT_CONTRACT_BALANCE)
        return {
            "contract_id": CONTRACT_ID,
            "status": "active",
            "balance": balance,
            "project_id": project_id,
            "explorer_url": f"https://testnet.steexp.com/contract/{CONTRACT_ID}",
            "timestamp": "2023-10-12T12:00:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deploy")
async def deploy_contract(
    project_id: str = Body(...),
    amount: str = Body(...),
    secret_key: str = Body(..., description="Stellar secret key for contract deployment")
) -> Dict[str, Any]:
    """Deploy project funding contract with initial balance"""
    try:
        # Initialize contract balance for the project
        contract_balances[project_id] = amount
        
        return {
            "status": "success",
            "contract_id": CONTRACT_ID,
            "explorer_url": f"https://testnet.steexp.com/contract/{CONTRACT_ID}",
            "message": "Contract deployed and funded successfully",
            "balance": amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/donate/{project_id}")
async def make_donation(
    project_id: str,
    amount: str = Body(...),
    sender_key: str = Body(..., description="Stellar secret key of the donor")
) -> Dict[str, Any]:
    """Make a donation to a projects funding contract"""
    try:
        # Get current balance and update it
        current_balance = contract_balances.get(project_id, "0")
        new_balance = str(int(current_balance) + int(amount))
        contract_balances[project_id] = new_balance

        # Return transaction details with explorer URLs
        tx_hash = "mock_tx_hash"  # In production, this would be the actual transaction hash
        return {
            "status": "success",
            "contract_id": CONTRACT_ID,
            "project_id": project_id,
            "amount": amount,
            "new_balance": new_balance,
            "contract_explorer_url": f"https://testnet.steexp.com/contract/{CONTRACT_ID}",
            "transaction_url": f"https://testnet.steexp.com/tx/{tx_hash}",
            "message": "Donation successful"
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid amount format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
