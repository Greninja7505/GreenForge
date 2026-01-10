from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.config import settings
from app.db import init_db, close_db
from app.database import init_database as init_sqlite_db
from app.routers import users, campaigns, funding, milestones, votes, skill_score, contracts
from app.routers import projects, bounties, marketplace, auth, contracts_v2, ai


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    init_sqlite_db()  # Initialize SQLite database
    yield
    # Shutdown
    await close_db()


app = FastAPI(
    title="ChainFund Lite API",
    description="Decentralized crowdfunding dApp backend with milestone-based payments and NFT badges",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
print("Adding routers...")

# Add API v1 routers (MongoDB-based)
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(campaigns.router, prefix="/api/v1", tags=["campaigns"])
app.include_router(funding.router, prefix="/api/v1", tags=["funding"])
app.include_router(milestones.router, prefix="/api/v1", tags=["milestones"])
app.include_router(votes.router, prefix="/api/v1", tags=["votes"])
app.include_router(skill_score.router, prefix="/api/v1", tags=["skill-score"])

# Add SQLite-based routers
print("Adding SQLite routers (projects, bounties, marketplace)...")
app.include_router(projects.router, tags=["projects"])  # Already has /api/v1/projects prefix
app.include_router(bounties.router, tags=["bounties"])  # Already has prefix
app.include_router(marketplace.router, tags=["marketplace"])  # Already has prefix
app.include_router(auth.router, tags=["auth"])  # Already has prefix

# Add contracts routers
print("Adding contracts routers...")
app.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
app.include_router(contracts_v2.router, tags=["contracts-v2"])  # Already has prefix

# Add AI router
app.include_router(ai.router, tags=["ai"])


@app.get("/")
async def root():
    return {"message": "ChainFund Lite API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )