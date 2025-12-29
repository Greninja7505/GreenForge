from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Reward(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    donor_wallet: str
    project_id: str
    amount: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}