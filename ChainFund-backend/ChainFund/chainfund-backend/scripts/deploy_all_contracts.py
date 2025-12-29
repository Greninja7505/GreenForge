#!/usr/bin/env python3
"""
Comprehensive contract deployment script for ChainFund
"""

import os
import sys
import asyncio
import json
from pathlib import Path
from typing import Dict

# Add the app directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.soroban_service import StellarService
from app.utils.stellar_utils import stellar_utils
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
CONTRACTS_DIR = Path(__file__).parent.parent.parent / "rust-contracts" / "target" / "wasm32-unknown-unknown" / "release"
CONFIG_FILE = Path(__file__).parent.parent / "app" / "config" / "contract_config.json"

async def build_contracts():
    """Build the Rust contracts"""
    print("🔨 Building contracts...")
    
    # Change to rust-contracts directory
    rust_contracts_dir = Path(__file__).parent.parent.parent / "rust-contracts"
    os.chdir(rust_contracts_dir)
    
    # Run the build script
    if os.name == 'nt':  # Windows
        result = os.system("powershell -File build.ps1")
    else:  # Unix
        result = os.system("./build.sh")
        
    if result != 0:
        print("❌ Failed to build contracts")
        sys.exit(1)
    
    print("✅ Contracts built successfully")

async def deploy_contracts():
    """Deploy all contracts to testnet"""
    print("🚀 Deploying contracts to testnet...")
    
    stellar_service = StellarService()
    
    # Check environment variables
    admin_secret = os.getenv("STELLAR_ADMIN_SECRET")
    if not admin_secret:
        print("❌ STELLAR_ADMIN_SECRET not found in environment")
        sys.exit(1)
        
    admin_keypair = stellar_utils.create_keypair_from_secret(admin_secret)
    
    contracts = {}
    
    try:
        # Deploy Project Funding Contract
        print("📤 Deploying Project Funding contract...")
        project_funding_wasm = CONTRACTS_DIR / "project_funding.wasm"
        project_funding_id = await stellar_service.deploy_project_contract(
            project_id="system",  # System-level deployment
            initial_balance="0"
        )
        contracts["PROJECT_FUNDING"] = project_funding_id
        print(f"✅ Project Funding deployed: {project_funding_id}")
        
        # Deploy Reward Token Contract
        print("📤 Deploying Reward Token contract...")
        reward_token_wasm = CONTRACTS_DIR / "reward_token.wasm"
        reward_token_id = await stellar_service.deploy_reward_token(
            admin_address=admin_keypair.public_key
        )
        contracts["REWARD_TOKEN"] = reward_token_id
        print(f"✅ Reward Token deployed: {reward_token_id}")
        
        # Save contract IDs to config
        save_contract_config(contracts)
        
        print("🎉 All contracts deployed successfully!")
        print("\nContract IDs:")
        for name, id in contracts.items():
            print(f"{name}: {id}")
            
        print("\n📋 Contract IDs saved to config file")
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        sys.exit(1)

def save_contract_config(contracts: Dict[str, str]):
    """Save contract IDs to config file"""
    config = {
        "network": os.getenv("STELLAR_NETWORK", "testnet"),
        "contracts": contracts
    }
    
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

async def main():
    """Main deployment function"""
    print("🌟 Starting ChainFund contract deployment\n")
    
    # Build contracts first
    await build_contracts()
    
    # Deploy contracts
    await deploy_contracts()

if __name__ == "__main__":
    asyncio.run(main())