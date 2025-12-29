from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

# Get port from environment or use default
PORT = int(os.getenv("PORT", "8000"))

# Create FastAPI app
app = FastAPI(
    title="ChainFund Lite API",
    description="Decentralized crowdfunding dApp backend",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.routers import contracts
app.include_router(contracts.router, prefix="/api/contracts")

if __name__ == "__main__":
    uvicorn.run("simple_server:app", host="0.0.0.0", port=PORT, reload=True)
