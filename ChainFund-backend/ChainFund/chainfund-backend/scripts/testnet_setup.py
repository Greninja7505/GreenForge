#!/usr/bin/env python3
"""
Setup Stellar testnet accounts and fund them
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
    """Setup testnet accounts"""

    print("🌟 Setting up Stellar testnet accounts...")

    # Initialize services
    stellar_service = StellarService()

    # Generate test accounts
    print("🔑 Generating test accounts...")

    accounts = {}
    account_names = ["admin", "creator", "backer1", "backer2", "backer3"]

    for name in account_names:
        keypair = stellar_utils.generate_keypair()
        accounts[name] = keypair
        print(f"✅ Generated {name} account: {keypair['public_key'][:10]}...")

    # Fund accounts
    print("💰 Funding test accounts...")

    for name, keypair in accounts.items():
        print(f"Funding {name}...")
        success = stellar_utils.fund_account(keypair["public_key"])
        if success:
            print(f"✅ Funded {name}")
        else:
            print(f"❌ Failed to fund {name}")

    # Save account secrets to .env
    print("💾 Saving account secrets to .env...")

    env_file = Path(__file__).parent.parent / ".env"
    with open(env_file, "a") as f:
        f.write("\n# Testnet Accounts\n")
        for name, keypair in accounts.items():
            env_var = f"STELLAR_{name.upper()}_SECRET"
            f.write(f"{env_var}={keypair['secret_key']}\n")
            print(f"💾 Saved {env_var}")

    # Set admin secret for contract deployment
    if "admin" in accounts:
        f.write(f"\nSTELLAR_ADMIN_SECRET={accounts['admin']['secret_key']}\n")
        print("💾 Set admin secret for contract deployment")

    print("✅ Testnet setup complete!")
    print("\n📋 Account Summary:")
    for name, keypair in accounts.items():
        print(f"  {name}: {keypair['public_key']}")

if __name__ == "__main__":
    asyncio.run(main())