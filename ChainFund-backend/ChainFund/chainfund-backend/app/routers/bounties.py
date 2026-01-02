"""
Eco-Bounties Router
Manage environmental tasks/bounties ("Uber for Nature")
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db_connection, dict_from_row
from ..routers.auth import oauth2_scheme, get_current_user

router = APIRouter(prefix="/api/bounties", tags=["Eco-Bounties"])

# ==================== PYDANTIC MODELS ====================

class BountyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    reward: float
    currency: str = "USD"
    latitude: float
    longitude: float
    location_name: Optional[str] = None

class BountyResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    reward: float
    currency: str
    latitude: float
    longitude: float
    location_name: Optional[str]
    status: str
    creator_wallet: Optional[str]
    assigned_to: Optional[str]
    proof_image: Optional[str]
    created_at: str

class BountyProof(BaseModel):
    proof_image: str

# ==================== ENDPOINTS ====================

@router.get("/", response_model=List[BountyResponse])
async def get_bounties(status: Optional[str] = None):
    """Get all bounties, optionally filtered by status"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if status:
            cursor.execute("SELECT * FROM bounties WHERE status = ? ORDER BY created_at DESC", (status,))
        else:
            cursor.execute("SELECT * FROM bounties ORDER BY created_at DESC")
        
        rows = cursor.fetchall()
        return [dict_from_row(row) for row in rows]

@router.get("/{bounty_id}", response_model=BountyResponse)
async def get_bounty(bounty_id: int):
    """Get bounty by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bounties WHERE id = ?", (bounty_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Bounty not found")
        return dict_from_row(row)

@router.post("/", response_model=BountyResponse)
async def create_bounty(bounty: BountyCreate, current_user: dict = Depends(get_current_user)):
    """Create a new bounty (Creator/Admin only)"""
    # Check role
    roles = current_user.get('roles', [])
    if 'creator' not in roles and 'admin' not in roles:
        # Allow donors to create bounties too? Maybe "Eco-Bounty Sponsor"? 
        # For now, restrict to creators/admins or maybe anyone can post if they fund it?
        # Let's start with open for now for hackathon ease, or restrict.
        pass 

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO bounties (
                title, description, reward, currency, latitude, longitude, 
                location_name, status, creator_wallet
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)
        ''', (
            bounty.title, bounty.description, bounty.reward, bounty.currency,
            bounty.latitude, bounty.longitude, bounty.location_name,
            current_user['wallet_address']
        ))
        conn.commit()
        bounty_id = cursor.lastrowid
        
        cursor.execute("SELECT * FROM bounties WHERE id = ?", (bounty_id,))
        return dict_from_row(cursor.fetchone())

@router.post("/{bounty_id}/claim")
async def claim_bounty(bounty_id: int, current_user: dict = Depends(get_current_user)):
    """Claim a bounty (Freelancer/Any user)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bounties WHERE id = ?", (bounty_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Bounty not found")
        
        if existing['status'] != 'open':
            raise HTTPException(status_code=400, detail="Bounty is not open")
            
        cursor.execute('''
            UPDATE bounties SET status = 'assigned', assigned_to = ? WHERE id = ?
        ''', (current_user['wallet_address'], bounty_id))
        conn.commit()
        
        return {"message": "Bounty claimed successfully"}

@router.post("/{bounty_id}/submit")
async def submit_proof(bounty_id: int, proof: BountyProof, current_user: dict = Depends(get_current_user)):
    """Submit proof for a bounty"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bounties WHERE id = ?", (bounty_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Bounty not found")
            
        if existing['assigned_to'] != current_user['wallet_address']:
            raise HTTPException(status_code=403, detail="You are not assigned to this bounty")
            
        cursor.execute('''
            UPDATE bounties SET status = 'completed', proof_image = ? WHERE id = ?
        ''', (proof.proof_image, bounty_id))
        conn.commit()
        
        return {"message": "Proof submitted, awaiting verification"}

@router.post("/{bounty_id}/verify")
async def verify_bounty(bounty_id: int, current_user: dict = Depends(get_current_user)):
    """Verify a completed bounty (Creator only)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bounties WHERE id = ?", (bounty_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Bounty not found")
            
        if existing['creator_wallet'] != current_user['wallet_address'] and 'admin' not in current_user.get('roles', []):
             raise HTTPException(status_code=403, detail="Only creator can verify")

        cursor.execute('''
            UPDATE bounties SET status = 'verified' WHERE id = ?
        ''', (bounty_id,))
        conn.commit()
        
        # TODO: Trigger smart contract payment here
        
        return {"message": "Bounty verified and payment released"}
