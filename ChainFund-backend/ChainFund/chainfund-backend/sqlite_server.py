"""
ChainFund Lite API Server with SQLite
Zero-configuration backend - no MongoDB needed!
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import json
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_db_connection, to_json, from_json, init_database, DB_PATH

# Import security middleware
try:
    from app.middleware.security import RateLimitMiddleware, SecurityHeadersMiddleware
    SECURITY_AVAILABLE = True
except ImportError:
    SECURITY_AVAILABLE = False
    print("⚠️  Security middleware not available")
    
from contextlib import asynccontextmanager

# Import routers
try:
    from app.routers import auth
    AUTH_AVAILABLE = True
except ImportError:
    AUTH_AVAILABLE = False
    print("⚠️  Auth router not available - install dependencies: pip install python-jose passlib[bcrypt]")

try:
    from app.routers import projects
    PROJECTS_AVAILABLE = True
except ImportError:
    PROJECTS_AVAILABLE = False
    print("⚠️  Projects router not available - missing dependencies")

try:
    from app.routers import ai
    AI_AVAILABLE = True
except ImportError:
    AI_AVAILABLE = False
    print("⚠️  AI router not available - missing dependencies")

try:
    from app.routers import bounties
    BOUNTIES_AVAILABLE = True
except ImportError as e:
    BOUNTIES_AVAILABLE = False
    print(f"⚠️  Bounties router not available: {e}")

try:
    from app.routers import marketplace
    MARKETPLACE_AVAILABLE = True
except ImportError as e:
    MARKETPLACE_AVAILABLE = False
    print(f"⚠️  Marketplace router not available: {e}")

# ==================== PYDANTIC MODELS ====================

class UserCreate(BaseModel):
    wallet_address: str
    username: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = []

class UserResponse(BaseModel):
    id: int
    wallet_address: str
    username: Optional[str]
    email: Optional[str]
    avatar: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    skills: List[str]
    rating: float
    reviews_count: int
    member_since: Optional[str]
    is_verified: bool

class MilestoneCreate(BaseModel):
    title: str
    amount: float
    target_date: Optional[str] = None

class ProjectCreate(BaseModel):
    title: str
    slug: str
    category: str
    description: str
    full_description: Optional[str] = None
    goal: float
    image: Optional[str] = None
    location: Optional[str] = None
    creator_wallet: str
    creator_name: str
    milestones: List[MilestoneCreate] = []

class DonationCreate(BaseModel):
    project_id: int
    donor_wallet: Optional[str] = None
    donor_name: Optional[str] = None
    amount: float
    anonymous: bool = False
    transaction_hash: Optional[str] = None

class GigCreate(BaseModel):
    title: str
    category: str
    description: str
    price: float
    delivery_time: int
    freelancer_id: Optional[int] = None
    skills: List[str] = []
    packages: List[Dict] = []
    tags: List[str] = []

class OrderCreate(BaseModel):
    gig_id: int
    buyer_wallet: str
    seller_wallet: str
    amount: float

class VoteCreate(BaseModel):
    milestone_id: int
    voter_wallet: str
    vote: int  # 1 for approve, 0 for reject


# ==================== FASTAPI APP ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    print("🚀 Starting ChainFund Lite API...")
    init_database()
    print(f"📁 Database: {DB_PATH}")
    print("✅ Server ready!")
    yield
    print("🛑 Server shutting down...")

app = FastAPI(
    title="ChainFund Lite API",
    description="Decentralized crowdfunding API with SQLite backend",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add security middleware
if SECURITY_AVAILABLE:
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware, requests_per_minute=100)
    print("✅ Security middleware enabled (Rate Limiting: 100 req/min)")
else:
    print("⚠️  Running without security middleware")

# Include auth router if available
if AUTH_AVAILABLE:
    app.include_router(auth.router)
    print("✅ Auth router included")

# Include projects router if available
if PROJECTS_AVAILABLE:
    app.include_router(projects.router)
    print("✅ Projects router included")

# Include AI router if available
if AI_AVAILABLE:
    app.include_router(ai.router)
    print("✅ AI router included")

if BOUNTIES_AVAILABLE:
    app.include_router(bounties.router)
    print("✅ Bounties router included")

if MARKETPLACE_AVAILABLE:
    app.include_router(marketplace.router)
    print("✅ Marketplace router included")


# ==================== STARTUP EVENT ====================

# ==================== STARTUP EVENT (Moved to lifespan) ====================


# ==================== ROOT ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "message": "ChainFund Lite API",
        "version": "2.0.0",
        "database": "SQLite",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "sqlite"}


# ==================== USER ENDPOINTS ====================

@app.get("/api/v1/users")
async def get_users(limit: int = 50, offset: int = 0):
    """Get all users"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users LIMIT ? OFFSET ?", (limit, offset))
        rows = cursor.fetchall()
        
        users = []
        for row in rows:
            user = dict(row)
            user['skills'] = from_json(user.get('skills', '[]'))
            user['is_verified'] = bool(user.get('is_verified', 0))
            users.append(user)
        
        return {"users": users, "total": len(users)}


@app.get("/api/v1/users/{wallet_address}")
async def get_user(wallet_address: str):
    """Get user by wallet address"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE wallet_address = ?", (wallet_address,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = dict(row)
        user['skills'] = from_json(user.get('skills', '[]'))
        user['is_verified'] = bool(user.get('is_verified', 0))
        return user


@app.post("/api/v1/users")
async def create_user(user: UserCreate):
    """Create or update user"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO users 
            (wallet_address, username, email, avatar, bio, location, skills, member_since)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user.wallet_address,
            user.username,
            user.email,
            user.avatar,
            user.bio,
            user.location,
            to_json(user.skills),
            datetime.now().isoformat()
        ))
        conn.commit()
        
        return {"message": "User created/updated", "wallet_address": user.wallet_address}


# ==================== PROJECT ENDPOINTS ====================

# ==================== PROJECT ENDPOINTS (MOVED TO ROTUER) ====================

# @app.get("/api/v1/projects")
# async def get_projects(
#     category: Optional[str] = None,
#     status: Optional[str] = None,
#     limit: int = 50,
#     offset: int = 0
# ):
#     ... (moved to routers/projects.py)

# @app.get("/api/v1/projects/{slug}")
# async def get_project(slug: str):
#     ... (moved to routers/projects.py)

# @app.post("/api/v1/projects")
# async def create_project(project: ProjectCreate):
#     ... (moved to routers/projects.py)

# @app.post("/api/v1/projects/{project_id}/upvote")
# async def upvote_project(project_id: int):
#     ... (moved to routers/projects.py)

# @app.post("/api/v1/projects/{project_id}/downvote")
# async def downvote_project(project_id: int):
#     ... (moved to routers/projects.py)


# ==================== DONATION ENDPOINTS (MOVED TO ROUTER) ====================

# @app.get("/api/v1/donations")
# async def get_donations(project_id: Optional[int] = None, limit: int = 50):
#     ... (moved to routers/projects.py)

# @app.post("/api/v1/donations")
# async def create_donation(donation: DonationCreate):
#     ... (moved to routers/projects.py)


# ==================== MILESTONE ENDPOINTS (MOVED TO ROUTER) ====================

# @app.get("/api/v1/milestones/{project_id}")
# async def get_milestones(project_id: int):
#     ... (moved to routers/projects.py)

# @app.post("/api/v1/milestones/{milestone_id}/vote")
# async def vote_on_milestone(milestone_id: int, vote: VoteCreate):
#     ... (moved to routers/projects.py)


# ==================== GIG ENDPOINTS ====================

@app.get("/api/v1/gigs")
async def get_gigs(
    category: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
):
    """Get all gigs"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = "SELECT * FROM gigs WHERE status = 'active'"
        params = []
        
        if category:
            query += " AND category = ?"
            params.append(category)
        
        query += " ORDER BY rating DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        gigs = []
        for row in rows:
            gig = dict(row)
            gig['skills'] = from_json(gig.get('skills', '[]'))
            gig['images'] = from_json(gig.get('images', '[]'))
            gig['packages'] = from_json(gig.get('packages', '[]'))
            gig['tags'] = from_json(gig.get('tags', '[]'))
            gigs.append(gig)
        
        return {"gigs": gigs, "total": len(gigs)}


@app.get("/api/v1/gigs/{gig_id}")
async def get_gig(gig_id: int):
    """Get gig by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM gigs WHERE id = ?", (gig_id,))
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Gig not found")
        
        gig = dict(row)
        gig['skills'] = from_json(gig.get('skills', '[]'))
        gig['images'] = from_json(gig.get('images', '[]'))
        gig['packages'] = from_json(gig.get('packages', '[]'))
        gig['tags'] = from_json(gig.get('tags', '[]'))
        
        return gig


@app.post("/api/v1/gigs")
async def create_gig(gig: GigCreate):
    """Create a new gig"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO gigs 
            (title, category, description, price, delivery_time, freelancer_id, skills, packages, tags)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            gig.title,
            gig.category,
            gig.description,
            gig.price,
            gig.delivery_time,
            gig.freelancer_id,
            to_json(gig.skills),
            to_json(gig.packages),
            to_json(gig.tags)
        ))
        conn.commit()
        
        return {"message": "Gig created", "id": cursor.lastrowid}


# ==================== ORDER ENDPOINTS ====================

@app.get("/api/v1/orders")
async def get_orders(wallet: Optional[str] = None):
    """Get orders, optionally filtered by wallet"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        if wallet:
            cursor.execute('''
                SELECT o.*, g.title as gig_title 
                FROM orders o
                JOIN gigs g ON o.gig_id = g.id
                WHERE o.buyer_wallet = ? OR o.seller_wallet = ?
                ORDER BY o.created_at DESC
            ''', (wallet, wallet))
        else:
            cursor.execute('''
                SELECT o.*, g.title as gig_title 
                FROM orders o
                JOIN gigs g ON o.gig_id = g.id
                ORDER BY o.created_at DESC
            ''')
        
        orders = []
        for row in cursor.fetchall():
            order = dict(row)
            order['milestones'] = from_json(order.get('milestones', '[]'))
            orders.append(order)
        
        return {"orders": orders}


@app.post("/api/v1/orders")
async def create_order(order: OrderCreate):
    """Create a new order"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get gig details
        cursor.execute("SELECT * FROM gigs WHERE id = ?", (order.gig_id,))
        gig = cursor.fetchone()
        if not gig:
            raise HTTPException(status_code=404, detail="Gig not found")
        
        cursor.execute('''
            INSERT INTO orders 
            (gig_id, buyer_wallet, seller_wallet, amount, status, progress, milestones)
            VALUES (?, ?, ?, ?, 'pending', 0, ?)
        ''', (
            order.gig_id,
            order.buyer_wallet,
            order.seller_wallet,
            order.amount,
            to_json([])
        ))
        conn.commit()
        
        return {"message": "Order created", "id": cursor.lastrowid}


# ==================== TRANSACTION ENDPOINTS ====================

@app.get("/api/v1/transactions")
async def get_transactions(wallet: Optional[str] = None, limit: int = 50):
    """Get transactions"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        if wallet:
            cursor.execute('''
                SELECT * FROM transactions 
                WHERE user_wallet = ?
                ORDER BY created_at DESC LIMIT ?
            ''', (wallet, limit))
        else:
            cursor.execute('''
                SELECT * FROM transactions 
                ORDER BY created_at DESC LIMIT ?
            ''', (limit,))
        
        transactions = [dict(row) for row in cursor.fetchall()]
        
        # Calculate totals if wallet specified
        totals = {}
        if wallet:
            cursor.execute('''
                SELECT 
                    SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earnings,
                    SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as total_withdrawals,
                    SUM(CASE WHEN status = 'pending' AND amount > 0 THEN amount ELSE 0 END) as pending
                FROM transactions WHERE user_wallet = ?
            ''', (wallet,))
            stats = cursor.fetchone()
            totals = {
                'total_earnings': stats['total_earnings'] or 0,
                'total_withdrawals': abs(stats['total_withdrawals'] or 0),
                'pending': stats['pending'] or 0,
                'available': (stats['total_earnings'] or 0) + (stats['total_withdrawals'] or 0)
            }
        
        return {"transactions": transactions, "totals": totals}


# ==================== CONTRACT STATUS ENDPOINT ====================

@app.get("/contracts/status/{project_id}")
async def get_contract_status(project_id: str):
    """Get contract status for a project"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Try to get project by slug or id
        cursor.execute("SELECT * FROM projects WHERE slug = ? OR id = ?", (project_id, project_id))
        project = cursor.fetchone()
        
        if not project:
            return {
                "contract_id": "CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL",
                "status": "active",
                "balance": "0",
                "project_id": project_id,
                "explorer_url": "https://testnet.steexp.com/contract/CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL"
            }
        
        project = dict(project)
        return {
            "contract_id": project.get('contract_address') or "CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL",
            "status": "active",
            "balance": str(project.get('raised', 0)),
            "project_id": project_id,
            "explorer_url": f"https://testnet.steexp.com/contract/{project.get('contract_address', 'CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL')}"
        }


# ==================== STATS ENDPOINT ====================

@app.get("/api/v1/stats")
async def get_stats():
    """Get platform statistics"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as count, SUM(raised) as raised FROM projects")
        projects = cursor.fetchone()
        
        cursor.execute("SELECT COUNT(*) as count, SUM(amount) as total FROM donations")
        donations = cursor.fetchone()
        
        cursor.execute("SELECT COUNT(*) as count FROM users")
        users = cursor.fetchone()
        
        cursor.execute("SELECT COUNT(*) as count FROM gigs WHERE status = 'active'")
        gigs = cursor.fetchone()
        
        return {
            "total_projects": projects['count'] or 0,
            "total_raised": projects['raised'] or 0,
            "total_donations": donations['count'] or 0,
            "donation_volume": donations['total'] or 0,
            "total_users": users['count'] or 0,
            "active_gigs": gigs['count'] or 0
        }


# ==================== RUN SERVER ====================

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 CHAINFUND LITE API SERVER")
    print("="*50)
    print(f"📁 Database: {DB_PATH}")
    print("📚 API Docs: http://localhost:8000/docs")
    print("="*50 + "\n")
    
    uvicorn.run(
        "sqlite_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
