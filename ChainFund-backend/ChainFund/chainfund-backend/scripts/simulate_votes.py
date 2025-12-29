#!/usr/bin/env python3
"""
Simulate voting on campaign milestones
"""

import os
import sys
import asyncio
import random
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.soroban_service import StellarService
from app.utils.stellar_utils import stellar_utils
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def main():
    """Simulate milestone voting"""

    print("🗳️  Simulating milestone voting...")

    # Initialize services
    stellar_service = StellarService()

    # Get test accounts
    backer_secrets = []
    for i in range(1, 4):
        secret = os.getenv(f"STELLAR_BACKER{i}_SECRET")
        if secret:
            backer_secrets.append(secret)

    if not backer_secrets:
        print("❌ No backer accounts found. Run testnet_setup.py first")
        return

    # Mock campaign and milestone IDs (in real implementation, get from database)
    campaign_id = "campaign_001"
    milestone_ids = ["milestone_001", "milestone_002", "milestone_003"]

    print(f"📊 Simulating votes for campaign {campaign_id}")

    # Simulate voting for each milestone
    for milestone_id in milestone_ids:
        print(f"\n🎯 Voting on milestone {milestone_id}")

        for i, secret in enumerate(backer_secrets):
            backer_keypair = stellar_utils.create_keypair_from_secret(secret)
            if not backer_keypair:
                continue

            # Random vote (approve/reject)
            approve = random.choice([True, False])

            print(f"  Backer {i+1} voting {'✅ approve' if approve else '❌ reject'}...")

            # In real implementation, this would call the Soroban contract
            # For now, just simulate
            await asyncio.sleep(0.1)  # Simulate network delay

            print(f"  ✅ Vote submitted by {backer_keypair.public_key[:10]}...")

        print(f"📈 Voting complete for milestone {milestone_id}")

    print("\n✅ Voting simulation complete!")
    print("📋 In a real implementation, votes would be recorded on-chain")

if __name__ == "__main__":
    asyncio.run(main())