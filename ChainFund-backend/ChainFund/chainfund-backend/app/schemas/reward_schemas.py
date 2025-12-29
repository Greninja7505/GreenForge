from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class RewardCreate(BaseModel):
    donor_wallet: str = Field(..., description="Donor's Stellar wallet address")
    project_id: str = Field(..., description="ID of the project being funded")
    donation_amount: int = Field(..., description="Amount donated in XLM")

class RewardResponse(BaseModel):
    id: Optional[str]
    donor_wallet: str
    project_id: str
    amount: int
    timestamp: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "id": "5f7c3b...",
                "donor_wallet": "GBFGHTY...",
                "project_id": "project123",
                "amount": 100,
                "timestamp": "2025-10-09T12:00:00Z"
            }
        }