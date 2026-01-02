#!/usr/bin/env python3
"""
Deploy ChainFund Soroban contract to Stellar testnet
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.soroban_service import StellarService
from app.utils.stellar_utils import stellar_utils
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def main():
    """Deploy the ChainFund contract"""

    print("🚀 Deploying ChainFund Soroban Contract...")

    # Initialize Stellar service
    stellar_service = StellarService()

    # Check if admin secret is configured
    admin_secret = os.getenv("STELLAR_ADMIN_SECRET")
    if not admin_secret:
        print("❌ STELLAR_ADMIN_SECRET not found in environment variables")
        return

    # Generate or get contract WASM (placeholder for now)
    # In a real implementation, you would compile the Rust contract to WASM
    print("📦 Compiling contract WASM...")
    wasm_path = Path(__file__).parent.parent / "contracts" / "chainfund.wasm"

    if not wasm_path.exists():
        print(f"❌ Contract WASM not found at {wasm_path}")
        print("Please compile the Rust contract first")
        return

    # Deploy contract
    print("📤 Deploying contract to Stellar testnet...")
    contract_id = await stellar_service.deploy_campaign_contract(
        creator_address=stellar_utils.create_keypair_from_secret(admin_secret).public_key,
        goal_amount=1000000000,  # 1000 XLM in stroops
        milestone_count=3
    )

    if contract_id:
        print(f"✅ Contract deployed successfully!")
        print(f"📋 Contract ID: {contract_id}")

        # Save contract ID to environment
        env_file = Path(__file__).parent.parent / ".env"
        with open(env_file, "a") as f:
            f.write(f"\nCHAINFUND_CONTRACT_ID={contract_id}\n")

        print("💾 Contract ID saved to .env file")
    else:
        print("❌ Contract deployment failed")

if __name__ == "__main__":
    asyncio.run(main())