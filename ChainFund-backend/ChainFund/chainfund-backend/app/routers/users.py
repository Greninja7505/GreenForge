from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schemas import UserRegisterRequest, UserResponse, AuthRequest, AuthResponse
from app.models.user import User
from app.services.auth_service import auth_service
from app.db import get_collection
from app.utils.responses import ok, bad_request, not_found
from app.utils.signature import validate_wallet_address, normalize_wallet_address
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register_user(request: UserRegisterRequest):
    """Register a new user or return existing user"""
    try:
        # Validate wallet address
        if not validate_wallet_address(request.wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        # Normalize wallet address
        normalized_address = normalize_wallet_address(request.wallet_address)

        collection = await get_collection("users")

        # Check if user already exists
        existing_user = await collection.find_one({"wallet_address": normalized_address})

        if existing_user:
            # Update email if provided and different
            if request.email and existing_user.get("email") != request.email:
                await collection.update_one(
                    {"wallet_address": normalized_address},
                    {"$set": {"email": request.email, "updated_at": datetime.utcnow()}}
                )
                existing_user["email"] = request.email

            return UserResponse(**existing_user)

        # Create new user
        user_data = {
            "wallet_address": normalized_address,
            "email": request.email,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await collection.insert_one(user_data)
        user_data["id"] = str(result.inserted_id)

        return UserResponse(**user_data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/auth", response_model=AuthResponse)
async def authenticate_user(request: AuthRequest):
    """Authenticate user with MetaMask signature"""
    try:
        # Validate wallet address
        if not validate_wallet_address(request.wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        # Verify signature
        is_valid = auth_service.verify_signature(
            request.wallet_address,
            request.signature,
            request.message
        )

        if not is_valid:
            raise HTTPException(status_code=401, detail="Invalid signature")

        # Get or create user
        collection = await get_collection("users")
        normalized_address = normalize_wallet_address(request.wallet_address)

        user = await collection.find_one({"wallet_address": normalized_address})

        if not user:
            # Create user if doesn't exist
            user_data = {
                "wallet_address": normalized_address,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await collection.insert_one(user_data)
            user = user_data
            user["id"] = str(result.inserted_id)

        # Create access token
        access_token = auth_service.create_access_token({"sub": normalized_address})

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(**user)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")


@router.get("/me", response_model=UserResponse)
async def get_current_user(wallet_address: str):
    """Get current user information"""
    try:
        # Validate wallet address
        if not validate_wallet_address(wallet_address):
            raise HTTPException(status_code=400, detail="Invalid wallet address")

        collection = await get_collection("users")
        normalized_address = normalize_wallet_address(wallet_address)

        user = await collection.find_one({"wallet_address": normalized_address})

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserResponse(**user)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user: {str(e)}")