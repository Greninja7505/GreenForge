"""
ChainFund Contract Integration Service

This module provides comprehensive API endpoints for interacting with the 
ChainFund smart contracts on Stellar/Soroban testnet.

Modules integrated:
- Campaign Registry
- Milestone Manager  
- AI Verification Handler
- Quadratic Voting Engine
- Escrow & Release Logic
- SBT Reputation System
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
import subprocess
import json
import os
from datetime import datetime

router = APIRouter(prefix="/v2", tags=["contracts-v2"])

# ============================================================================
# CONFIGURATION
# ============================================================================

class ContractConfig:
    """Contract deployment configuration"""
    NETWORK = "testnet"
    RPC_URL = "https://soroban-testnet.stellar.org"
    
    # Contract addresses - loaded from deployment file
    CORE_CONTRACT_ID: Optional[str] = None
    SBT_CONTRACT_ID: Optional[str] = None
    ADMIN_KEY: str = "admin"
    
    # XLM token address on testnet
    XLM_TOKEN = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2EZ4KUXH"
    
    @classmethod
    def load_addresses(cls):
        """Load deployed contract addresses from file"""
        # Look for addresses file in rust-contracts directory
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        addresses_file = os.path.join(base_dir, "rust-contracts", "deployed_addresses.json")
        
        if os.path.exists(addresses_file):
            try:
                with open(addresses_file) as f:
                    data = json.load(f)
                    cls.CORE_CONTRACT_ID = data.get("contracts", {}).get("chainfund_core")
                    cls.SBT_CONTRACT_ID = data.get("contracts", {}).get("chainfund_sbt")
                    print(f"Loaded contract addresses: Core={cls.CORE_CONTRACT_ID}, SBT={cls.SBT_CONTRACT_ID}")
            except Exception as e:
                print(f"Error loading contract addresses: {e}")

# Load addresses on module import
ContractConfig.load_addresses()

# ============================================================================
# ENUMS (matching contract types)
# ============================================================================

class VerificationStatus(str, Enum):
    NOT_SUBMITTED = "NotSubmitted"
    PENDING = "Pending"
    COMPLETED = "Completed"
    PARTIAL = "Partial"
    SUSPICIOUS = "Suspicious"
    REJECTED = "Rejected"

class CampaignStatus(str, Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    FUNDED = "Funded"
    COMPLETED = "Completed"
    FAILED = "Failed"
    CANCELLED = "Cancelled"

class MilestoneStatus(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "InProgress"
    PROOF_SUBMITTED = "ProofSubmitted"
    AI_VERIFIED = "AIVerified"
    VOTING_OPEN = "VotingOpen"
    APPROVED = "Approved"
    RELEASED = "Released"
    DISPUTED = "Disputed"
    REJECTED = "Rejected"

class SbtRole(str, Enum):
    CREATOR = "Creator"
    BACKER = "Backer"
    SUPER_BACKER = "SuperBacker"
    DEVELOPER = "Developer"
    DESIGNER = "Designer"
    TESTER = "Tester"
    MENTOR = "Mentor"
    VALIDATOR = "Validator"
    AMBASSADOR = "Ambassador"
    PIONEER = "Pioneer"

# ============================================================================
# REQUEST/RESPONSE MODELS
# ============================================================================

class MilestoneConfig(BaseModel):
    title: str
    description: str
    amount: int = Field(..., description="Amount in stroops")

class CreateCampaignRequest(BaseModel):
    creator_address: str = Field(..., description="Stellar public key of creator")
    title: str
    description: str
    ipfs_metadata: str = Field(default="", description="IPFS hash of project metadata")
    total_goal: int = Field(..., description="Total funding goal in stroops")
    milestones: List[MilestoneConfig]

class FundCampaignRequest(BaseModel):
    backer_address: str = Field(..., description="Stellar public key of backer")
    amount: int = Field(..., gt=0, description="Amount in stroops")

class SubmitProofRequest(BaseModel):
    creator_address: str
    ipfs_hash: str = Field(..., description="IPFS hash of proof documents")

class AIVerdictRequest(BaseModel):
    status: VerificationStatus
    confidence: int = Field(..., ge=0, le=100, description="AI confidence score 0-100")
    analysis_notes: Optional[str] = None

class VoteRequest(BaseModel):
    voter_address: str
    approve: bool

class MintSbtRequest(BaseModel):
    recipient_address: str
    role: SbtRole
    campaign_id: int = 0
    metadata_uri: str = ""

class ContractResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    tx_hash: Optional[str] = None

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def invoke_contract(contract_id: str, method: str, args: List[str]) -> Dict[str, Any]:
    """
    Invoke a contract method using stellar CLI.
    For actual blockchain transactions.
    """
    if not contract_id:
        return {"success": False, "error": "Contract not deployed. Run deploy-chainfund.ps1 first."}
    
    cmd = [
        "stellar", "contract", "invoke",
        "--id", contract_id,
        "--source", ContractConfig.ADMIN_KEY,
        "--network", ContractConfig.NETWORK,
        "--", method
    ] + args
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            try:
                data = json.loads(output) if output else {"result": "success"}
            except json.JSONDecodeError:
                data = {"raw_output": output}
            
            return {"success": True, "data": data}
        else:
            return {"success": False, "error": result.stderr.strip() or "Contract call failed"}
            
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Contract call timed out after 60 seconds"}
    except FileNotFoundError:
        return {"success": False, "error": "Stellar CLI not found. Install with: cargo install stellar-cli"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def query_contract(contract_id: str, method: str, args: List[str] = None) -> Dict[str, Any]:
    """
    Query a contract (read-only, no transaction fees).
    """
    if not contract_id:
        return {"success": False, "error": "Contract not deployed"}
    
    args = args or []
    cmd = [
        "stellar", "contract", "invoke",
        "--id", contract_id,
        "--source", ContractConfig.ADMIN_KEY,
        "--network", ContractConfig.NETWORK,
        "--is-view",
        "--", method
    ] + args
    
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            try:
                data = json.loads(output) if output else None
            except json.JSONDecodeError:
                data = {"raw_output": output}
            
            return {"success": True, "data": data}
        else:
            return {"success": False, "error": result.stderr.strip()}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

# ============================================================================
# STATUS & CONFIGURATION
# ============================================================================

@router.get("/status")
async def get_contract_status():
    """
    Get deployment status and contract configuration.
    Use this to verify contracts are deployed before making calls.
    """
    return {
        "network": ContractConfig.NETWORK,
        "rpc_url": ContractConfig.RPC_URL,
        "xlm_token": ContractConfig.XLM_TOKEN,
        "contracts": {
            "core": {
                "id": ContractConfig.CORE_CONTRACT_ID,
                "deployed": ContractConfig.CORE_CONTRACT_ID is not None,
                "description": "Main ChainFund contract with campaigns, milestones, voting"
            },
            "sbt": {
                "id": ContractConfig.SBT_CONTRACT_ID,
                "deployed": ContractConfig.SBT_CONTRACT_ID is not None,
                "description": "SoulBound Token contract for reputation"
            }
        },
        "ready": ContractConfig.CORE_CONTRACT_ID is not None,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.post("/reload-config")
async def reload_contract_config():
    """Reload contract addresses from deployment file"""
    ContractConfig.load_addresses()
    return await get_contract_status()

# ============================================================================
# CAMPAIGN ENDPOINTS
# ============================================================================

@router.post("/campaigns", response_model=ContractResponse)
async def create_campaign(request: CreateCampaignRequest):
    """
    Create a new crowdfunding campaign on-chain.
    
    The campaign will be in ACTIVE status and ready to receive funding.
    First milestone will be set to IN_PROGRESS.
    """
    # Validate milestones sum to goal
    milestone_sum = sum(m.amount for m in request.milestones)
    if milestone_sum != request.total_goal:
        return ContractResponse(
            success=False,
            error=f"Milestone amounts ({milestone_sum}) must equal total goal ({request.total_goal})"
        )
    
    # Format for contract call
    args = [
        "--creator", request.creator_address,
        "--title", request.title,
        "--description", request.description,
        "--ipfs_metadata", request.ipfs_metadata or "0" * 64,
        "--total_goal", str(request.total_goal),
    ]
    
    # Add milestones
    for ms in request.milestones:
        args.extend(["--milestone", f"{ms.title}:{ms.description}:{ms.amount}"])
    
    result = invoke_contract(ContractConfig.CORE_CONTRACT_ID, "create_campaign", args)
    return ContractResponse(**result)

@router.get("/campaigns/{campaign_id}", response_model=ContractResponse)
async def get_campaign(campaign_id: int):
    """Get full campaign details including milestones and backer count"""
    result = query_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "get_campaign",
        ["--campaign_id", str(campaign_id)]
    )
    return ContractResponse(**result)

@router.post("/campaigns/{campaign_id}/fund", response_model=ContractResponse)
async def fund_campaign(campaign_id: int, request: FundCampaignRequest):
    """
    Fund a campaign with XLM.
    
    Funds are locked in escrow and released only when milestones are approved.
    Backer receives quadratic voting power = sqrt(amount).
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "fund_campaign",
        [
            "--campaign_id", str(campaign_id),
            "--backer", request.backer_address,
            "--amount", str(request.amount)
        ]
    )
    return ContractResponse(**result)

@router.post("/campaigns/{campaign_id}/close", response_model=ContractResponse)
async def close_campaign(campaign_id: int, caller_address: str = Body(...)):
    """
    Close a completed campaign.
    
    Requirements:
    - All milestones must be released
    - Only creator or admin can close
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "close_campaign",
        [
            "--campaign_id", str(campaign_id),
            "--caller", caller_address
        ]
    )
    return ContractResponse(**result)

# ============================================================================
# MILESTONE ENDPOINTS
# ============================================================================

@router.get("/campaigns/{campaign_id}/milestones/{milestone_id}", response_model=ContractResponse)
async def get_milestone(campaign_id: int, milestone_id: int):
    """Get milestone details including AI verdict and vote counts"""
    result = query_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "get_milestone",
        ["--campaign_id", str(campaign_id), "--milestone_id", str(milestone_id)]
    )
    return ContractResponse(**result)

@router.post("/campaigns/{campaign_id}/milestones/{milestone_id}/proof", response_model=ContractResponse)
async def submit_milestone_proof(
    campaign_id: int,
    milestone_id: int,
    request: SubmitProofRequest
):
    """
    Submit proof of milestone completion.
    
    This triggers the AI verification process.
    Status changes to PROOF_SUBMITTED, then PENDING AI verification.
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "submit_proof",
        [
            "--campaign_id", str(campaign_id),
            "--milestone_id", str(milestone_id),
            "--creator", request.creator_address,
            "--ipfs_hash", request.ipfs_hash
        ]
    )
    return ContractResponse(**result)

@router.post("/campaigns/{campaign_id}/milestones/{milestone_id}/release", response_model=ContractResponse)
async def release_milestone_funds(campaign_id: int, milestone_id: int):
    """
    Release funds for an approved milestone.
    
    TRUSTLESS RELEASE CONDITIONS:
    1. AI verdict == Completed or Partial
    2. votes_for > votes_against (community approval)
    3. Milestone not already released
    4. Sufficient funds locked in escrow
    
    Platform fee (2.5%) is deducted automatically.
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "release_funds",
        ["--campaign_id", str(campaign_id), "--milestone_id", str(milestone_id)]
    )
    return ContractResponse(**result)

# ============================================================================
# AI VERIFICATION ENDPOINTS
# ============================================================================

@router.post("/campaigns/{campaign_id}/milestones/{milestone_id}/ai-verdict", response_model=ContractResponse)
async def submit_ai_verdict(
    campaign_id: int,
    milestone_id: int,
    request: AIVerdictRequest
):
    """
    Submit AI verification verdict for a milestone.
    
    AUTHORIZED ORACLE ONLY - This endpoint should only be called by the
    AI verification backend after analyzing the submitted proof.
    
    Status values:
    - Completed: AI approved, milestone verified
    - Partial: Minor issues but acceptable
    - Suspicious: Potential fraud, flagged for review
    - Rejected: Failed verification
    
    If Completed/Partial, voting opens for community.
    If Suspicious, milestone enters DISPUTED state.
    """
    status_map = {
        VerificationStatus.NOT_SUBMITTED: "0",
        VerificationStatus.PENDING: "1",
        VerificationStatus.COMPLETED: "2",
        VerificationStatus.PARTIAL: "3",
        VerificationStatus.SUSPICIOUS: "4",
        VerificationStatus.REJECTED: "5"
    }
    
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "submit_ai_verdict",
        [
            "--campaign_id", str(campaign_id),
            "--milestone_id", str(milestone_id),
            "--oracle", ContractConfig.ADMIN_KEY,
            "--status", status_map[request.status],
            "--confidence", str(request.confidence)
        ]
    )
    return ContractResponse(**result)

# ============================================================================
# QUADRATIC VOTING ENDPOINTS
# ============================================================================

@router.post("/campaigns/{campaign_id}/milestones/{milestone_id}/vote", response_model=ContractResponse)
async def cast_vote(
    campaign_id: int,
    milestone_id: int,
    request: VoteRequest
):
    """
    Cast a quadratic vote on a milestone.
    
    QUADRATIC VOTING: voting_power = sqrt(contribution_amount)
    
    Example:
    - $100 contribution = 10 voting power
    - $10000 contribution = 100 voting power
    
    This prevents whale dominance while giving larger backers more say.
    
    Requirements:
    - Must be a backer of this campaign
    - Milestone must be in VOTING_OPEN status
    - Can only vote once per milestone
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "vote",
        [
            "--campaign_id", str(campaign_id),
            "--milestone_id", str(milestone_id),
            "--voter", request.voter_address,
            "--approve", str(request.approve).lower()
        ]
    )
    return ContractResponse(**result)

@router.get("/campaigns/{campaign_id}/milestones/{milestone_id}/votes", response_model=ContractResponse)
async def get_vote_status(campaign_id: int, milestone_id: int):
    """
    Get current voting status for a milestone.
    
    Returns:
    - votes_for: Total quadratic voting power in favor
    - votes_against: Total quadratic voting power against
    - voter_count: Number of unique voters
    """
    result = query_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "get_vote_status",
        ["--campaign_id", str(campaign_id), "--milestone_id", str(milestone_id)]
    )
    return ContractResponse(**result)

@router.get("/campaigns/{campaign_id}/backers/{backer_address}", response_model=ContractResponse)
async def get_backer_info(campaign_id: int, backer_address: str):
    """
    Get backer contribution and voting power.
    
    Returns:
    - amount: Total contribution in stroops
    - voting_power: Quadratic voting power (sqrt of amount)
    """
    result = query_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "get_backer",
        ["--campaign_id", str(campaign_id), "--backer", backer_address]
    )
    return ContractResponse(**result)

# ============================================================================
# SBT (SOULBOUND TOKEN) ENDPOINTS
# ============================================================================

@router.post("/sbt/mint", response_model=ContractResponse)
async def mint_sbt(request: MintSbtRequest):
    """
    Mint a SoulBound Token to a user.
    
    SBTs are NON-TRANSFERABLE reputation tokens.
    
    Roles and reputation values:
    - Creator: 100 (completed a campaign)
    - SuperBacker: 50 (funded 5+ projects)
    - Mentor: 40 (provided guidance)
    - Developer: 30 (contributed code)
    - Designer: 25 (contributed design)
    - Tester: 20 (contributed testing)
    - Validator: 15 (active voter)
    - Backer: 10 (funded a project)
    """
    role_map = {
        SbtRole.CREATOR: "0",
        SbtRole.BACKER: "1",
        SbtRole.SUPER_BACKER: "2",
        SbtRole.DEVELOPER: "3",
        SbtRole.DESIGNER: "4",
        SbtRole.TESTER: "5",
        SbtRole.MENTOR: "6",
        SbtRole.VALIDATOR: "7",
        SbtRole.AMBASSADOR: "8",
        SbtRole.PIONEER: "9"
    }
    
    result = invoke_contract(
        ContractConfig.SBT_CONTRACT_ID,
        "mint",
        [
            "--caller", ContractConfig.ADMIN_KEY,
            "--recipient", request.recipient_address,
            "--role", role_map[request.role],
            "--campaign_id", str(request.campaign_id),
            "--metadata_uri", request.metadata_uri or ""
        ]
    )
    return ContractResponse(**result)

@router.get("/sbt/profile/{user_address}", response_model=ContractResponse)
async def get_sbt_profile(user_address: str):
    """
    Get user's complete SBT profile.
    
    Returns:
    - tokens: List of SBT token IDs
    - total_reputation: Sum of all active token values
    - roles_held: Unique roles this user has earned
    """
    result = query_contract(
        ContractConfig.SBT_CONTRACT_ID,
        "get_profile",
        ["--user", user_address]
    )
    return ContractResponse(**result)

@router.get("/sbt/reputation/{user_address}")
async def get_user_reputation(user_address: str):
    """Get user's total reputation score"""
    result = query_contract(
        ContractConfig.SBT_CONTRACT_ID,
        "get_reputation",
        ["--user", user_address]
    )
    
    if result["success"]:
        return {"address": user_address, "reputation": result["data"]}
    return ContractResponse(**result)

@router.get("/sbt/{token_id}", response_model=ContractResponse)
async def get_sbt_details(token_id: int):
    """Get full details of a specific SBT"""
    result = query_contract(
        ContractConfig.SBT_CONTRACT_ID,
        "get_sbt",
        ["--token_id", str(token_id)]
    )
    return ContractResponse(**result)

@router.get("/sbt/user/{user_address}/tokens", response_model=ContractResponse)
async def get_user_sbts(user_address: str):
    """Get all SBTs owned by a user"""
    result = query_contract(
        ContractConfig.SBT_CONTRACT_ID,
        "get_user_sbts",
        ["--user", user_address]
    )
    return ContractResponse(**result)

# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

@router.post("/admin/refund/{campaign_id}", response_model=ContractResponse)
async def refund_campaign_backers(campaign_id: int, admin_address: str = Body(...)):
    """
    Refund all backers of a failed campaign.
    
    ADMIN ONLY - Use when:
    - Campaign fails to reach funding goal
    - Fraud is detected
    - Creator abandons project
    
    All locked funds are returned to backers.
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "refund_backers",
        ["--campaign_id", str(campaign_id), "--admin", admin_address]
    )
    return ContractResponse(**result)

@router.post("/admin/pause", response_model=ContractResponse)
async def toggle_contract_pause(admin_address: str = Body(...), paused: bool = Body(...)):
    """
    Emergency pause/unpause contract.
    
    ADMIN ONLY - When paused:
    - No new campaigns can be created
    - No new funding accepted
    - Existing milestones can still be processed
    """
    result = invoke_contract(
        ContractConfig.CORE_CONTRACT_ID,
        "set_paused",
        ["--admin", admin_address, "--paused", str(paused).lower()]
    )
    return ContractResponse(**result)

@router.get("/admin/config", response_model=ContractResponse)
async def get_admin_config():
    """Get current contract configuration (admin, fees, etc.)"""
    result = query_contract(ContractConfig.CORE_CONTRACT_ID, "get_config", [])
    return ContractResponse(**result)
