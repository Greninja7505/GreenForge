"""
Authentication Router - Wallet-First Auth with Freighter Integration
Supports: Freighter Wallet, Email/Password, and Hybrid Auth

With Email Notifications:
- Welcome emails on registration
- Login notifications for security
- Wallet connection alerts
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
import sqlite3
import json
import secrets
import asyncio
from ..database import get_db_connection, dict_from_row
from ..services.email_service import email_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Security configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = secrets.token_urlsafe(32)  # Generate secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login", auto_error=False)

# ============================================================================
# Pydantic Models
# ============================================================================

class WalletAuthRequest(BaseModel):
    """Freighter wallet authentication"""
    wallet_address: str
    public_key: str
    signature: str  # Signed message for verification
    message: str  # Original message that was signed
    wallet_type: str = "freighter"  # freighter, albedo, lobstr
    
    @validator('wallet_address')
    def validate_stellar_address(cls, v):
        if not v.startswith('G') or len(v) != 56:
            raise ValueError('Invalid Stellar address format')
        return v

class EmailAuthRequest(BaseModel):
    """Email/password authentication"""
    email: EmailStr
    password: str

class HybridAuthRequest(BaseModel):
    """Combined wallet + email auth"""
    wallet_address: str
    public_key: str
    email: EmailStr
    password: str
    username: Optional[str] = None

class UserRegister(BaseModel):
    """User registration"""
    username: str
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    wallet_address: str
    public_key: str
    role: str = "donor"
    auth_method: str = "wallet"  # wallet, email, both
    
    @validator('role')
    def validate_role(cls, v):
        valid_roles = ['donor', 'creator', 'freelancer', 'governor', 'admin']
        if v not in valid_roles:
            raise ValueError(f'Role must be one of: {valid_roles}')
        return v

class TokenResponse(BaseModel):
    """Authentication response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

class UserResponse(BaseModel):
    """User profile response"""
    id: int
    username: Optional[str]
    email: Optional[str]
    wallet_address: str
    role: str
    roles: List[str]
    is_verified: bool
    created_at: str

# ============================================================================
# Helper Functions
# ============================================================================

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_stellar_signature(wallet_address: str, message: str, signature: str) -> bool:
    """
    Verify Stellar wallet signature
    In production, use stellar_sdk to verify the signature
    """
    # TODO: Implement actual signature verification with stellar_sdk
    # For now, we'll trust the signature (NOT SECURE - FIX IN PRODUCTION)
    return True  # Placeholder

def get_user_by_wallet(wallet_address: str) -> Optional[dict]:
    """Get user by wallet address"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE wallet_address = ? OR primary_wallet = ?",
            (wallet_address, wallet_address)
        )
        row = cursor.fetchone()
        return dict_from_row(row)

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        return dict_from_row(row)

def get_user_by_id(user_id: int) -> Optional[dict]:
    """Get user by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict_from_row(row)

def create_user(user_data: dict) -> dict:
    """Create new user"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Prepare user data
        now = datetime.utcnow().isoformat()
        roles_json = json.dumps([user_data.get('role', 'donor')])
        
        cursor.execute('''
            INSERT INTO users (
                wallet_address, username, email, password_hash,
                role, roles, auth_method, primary_wallet, stellar_public_key,
                is_active, member_since, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_data['wallet_address'],
            user_data.get('username'),
            user_data.get('email'),
            user_data.get('password_hash'),
            user_data.get('role', 'donor'),
            roles_json,
            user_data.get('auth_method', 'wallet'),
            user_data['wallet_address'],
            user_data.get('public_key'),
            1,  # is_active
            now,
            now
        ))
        
        user_id = cursor.lastrowid
        
        # Create wallet connection record
        cursor.execute('''
            INSERT INTO wallet_connections (
                user_id, wallet_address, wallet_type, is_primary, verified
            ) VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            user_data['wallet_address'],
            user_data.get('wallet_type', 'freighter'),
            1,  # is_primary
            1   # verified
        ))
        
        conn.commit()
        return get_user_by_id(user_id)

def store_auth_tokens(user_id: int, access_token: str, refresh_token: str):
    """Store authentication tokens"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        expires_at = (datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)).isoformat()
        
        cursor.execute('''
            INSERT INTO auth_tokens (user_id, token, refresh_token, expires_at)
            VALUES (?, ?, ?, ?)
        ''', (user_id, access_token, refresh_token, expires_at))
        
        conn.commit()

def log_auth_event(user_id: Optional[int], action: str, wallet_address: Optional[str] = None, details: dict = None):
    """Log authentication event to audit log"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO audit_log (user_id, wallet_address, action, resource_type, details)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, wallet_address, action, 'auth', json.dumps(details or {})))
        conn.commit()

# ============================================================================
# Authentication Routes
# ============================================================================

@router.post("/wallet/connect", response_model=TokenResponse)
async def connect_wallet(auth_request: WalletAuthRequest):
    """
    Authenticate with Freighter/Stellar wallet
    - If user exists: login
    - If new wallet: create account
    """
    try:
        # Verify signature
        if not verify_stellar_signature(
            auth_request.wallet_address,
            auth_request.message,
            auth_request.signature
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid wallet signature"
            )
        
        # Check if user exists
        user = get_user_by_wallet(auth_request.wallet_address)
        
        if not user:
            # Create new user with wallet
            user_data = {
                'wallet_address': auth_request.wallet_address,
                'public_key': auth_request.public_key,
                'wallet_type': auth_request.wallet_type,
                'auth_method': 'wallet',
                'role': 'donor',  # Default role
            }
            user = create_user(user_data)
            log_auth_event(user['id'], 'wallet_register', auth_request.wallet_address)
            
            # Send welcome email if email exists
            if user.get('email'):
                asyncio.create_task(
                    asyncio.to_thread(
                        email_service.send_welcome_email,
                        user['email'],
                        user.get('username', 'Stellar User')
                    )
                )
            
            # Send wallet connected notification
            if user.get('email'):
                asyncio.create_task(
                    asyncio.to_thread(
                        email_service.send_wallet_connected,
                        user['email'],
                        user.get('username', 'User'),
                        auth_request.wallet_address,
                        'Stellar'
                    )
                )
        else:
            # Update last login
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE users SET last_login = ? WHERE id = ?",
                    (datetime.utcnow().isoformat(), user['id'])
                )
                conn.commit()
            log_auth_event(user['id'], 'wallet_login', auth_request.wallet_address)
        
        # Create tokens
        token_data = {"sub": str(user['id']), "wallet": auth_request.wallet_address}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        # Store tokens
        store_auth_tokens(user['id'], access_token, refresh_token)
        
        # Prepare user response (remove sensitive data)
        user_response = {
            "id": user['id'],
            "username": user.get('username'),
            "email": user.get('email'),
            "wallet_address": user['wallet_address'],
            "role": user.get('role', 'donor'),
            "roles": json.loads(user.get('roles', '["donor"]')),
            "is_verified": bool(user.get('is_verified', 0)),
            "created_at": user.get('created_at'),
        }
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        log_auth_event(None, 'wallet_auth_failed', auth_request.wallet_address, {"error": str(e)})
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """
    Register new user with email/password (optional) and wallet
    """
    try:
        # Check if wallet already exists
        existing_user = get_user_by_wallet(user_data.wallet_address)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Wallet address already registered"
            )
        
        # Check if email already exists (if provided)
        if user_data.email:
            existing_email = get_user_by_email(user_data.email)
            if existing_email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
        
        # Hash password if provided
        password_hash = None
        if user_data.password:
            if len(user_data.password) < 6:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must be at least 6 characters"
                )
            password_hash = hash_password(user_data.password)
        
        # Create user
        new_user_data = {
            'wallet_address': user_data.wallet_address,
            'public_key': user_data.public_key,
            'username': user_data.username,
            'email': user_data.email,
            'password_hash': password_hash,
            'role': user_data.role,
            'auth_method': user_data.auth_method,
        }
        
        user = create_user(new_user_data)
        
        # Send welcome email
        if user_data.email:
            try:
                email_service.send_welcome_email(
                    user_data.email,
                    user_data.username or 'Stellar User'
                )
            except Exception as email_error:
                # Don't fail registration if email fails
                print(f"Welcome email failed: {email_error}")
        log_auth_event(user['id'], 'user_register', user_data.wallet_address)
        
        # Create tokens
        token_data = {"sub": str(user['id']), "wallet": user_data.wallet_address}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        store_auth_tokens(user['id'], access_token, refresh_token)
        
        user_response = {
            "id": user['id'],
            "username": user.get('username'),
            "email": user.get('email'),
            "wallet_address": user['wallet_address'],
            "role": user.get('role', 'donor'),
            "roles": json.loads(user.get('roles', '["donor"]')),
            "is_verified": bool(user.get('is_verified', 0)),
            "created_at": user.get('created_at'),
        }
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: EmailAuthRequest):
    """
    Login with email and password
    """
    try:
        user = get_user_by_email(credentials.email)
        
        if not user or not user.get('password_hash'):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not verify_password(credentials.password, user['password_hash']):
            log_auth_event(user['id'], 'login_failed', user.get('wallet_address'))
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Update last login
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE users SET last_login = ? WHERE id = ?",
                (datetime.utcnow().isoformat(), user['id'])
            )
            conn.commit()
        
        log_auth_event(user['id'], 'email_login', user.get('wallet_address'))
        
        # Send login notification email (async so it doesn't slow down login)
        try:
            asyncio.create_task(
                asyncio.to_thread(
                    email_service.send_login_notification,
                    user['email'],
                    user.get('username', 'User'),
                    'Unknown',  # IP address - could be extracted from request
                    'Web Browser'
                )
            )
        except Exception as email_error:
            print(f"Login notification email failed: {email_error}")
        
        # Create tokens
        token_data = {"sub": str(user['id']), "email": credentials.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        store_auth_tokens(user['id'], access_token, refresh_token)
        
        user_response = {
            "id": user['id'],
            "username": user.get('username'),
            "email": user.get('email'),
            "wallet_address": user.get('wallet_address'),
            "role": user.get('role', 'donor'),
            "roles": json.loads(user.get('roles', '["donor"]')),
            "is_verified": bool(user.get('is_verified', 0)),
            "created_at": user.get('created_at'),
        }
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current authenticated user
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return UserResponse(
            id=user['id'],
            username=user.get('username'),
            email=user.get('email'),
            wallet_address=user['wallet_address'],
            role=user.get('role', 'donor'),
            roles=json.loads(user.get('roles', '["donor"]')),
            is_verified=bool(user.get('is_verified', 0)),
            created_at=user.get('created_at'),
        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Logout and revoke token
    """
    if not token:
        return {"message": "Already logged out"}
    
    try:
        # Revoke token in database
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE auth_tokens SET revoked = 1 WHERE token = ?",
                (token,)
            )
            conn.commit()
        
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Logout failed: {str(e)}"
        )

@router.post("/refresh")
async def refresh_access_token(refresh_token: str):
    """
    Refresh access token using refresh token
    """
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = int(payload.get("sub"))
        user = get_user_by_id(user_id)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new access token
        token_data = {"sub": str(user_id), "wallet": user.get('wallet_address')}
        new_access_token = create_access_token(token_data)
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
