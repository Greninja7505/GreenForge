#!/bin/bash

# ChainFund Smart Contract Deployment Script
# This script builds and deploys ChainFund contracts to Stellar testnet

set -e

echo "🚀 ChainFund Smart Contract Deployment"
echo "====================================="

# Check if Soroban CLI is installed
if ! command -v soroban &> /dev/null; then
    echo "❌ Soroban CLI not found. Install with: cargo install soroban-cli"
    exit 1
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Install Rust from https://rustup.rs/"
    exit 1
fi

# Configuration
NETWORK="testnet"
CONTRACT_NAME="chainfund_contracts"
SOURCE_ACCOUNT="$STELLAR_ADMIN_SECRET"

if [ -z "$SOURCE_ACCOUNT" ]; then
    echo "❌ STELLAR_ADMIN_SECRET not set. Please configure your .env file"
    exit 1
fi

echo "📦 Building smart contracts..."
cd rust-contracts

# Build the contract
cargo build --target wasm32-unknown-unknown --release

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Deploy the contract
echo "🚀 Deploying to $NETWORK..."

CONTRACT_WASM="target/wasm32-unknown-unknown/release/${CONTRACT_NAME//-/_}.wasm"

if [ ! -f "$CONTRACT_WASM" ]; then
    echo "❌ WASM file not found: $CONTRACT_WASM"
    exit 1
fi

# Deploy contract
DEPLOY_OUTPUT=$(soroban contract deploy \
    --wasm "$CONTRACT_WASM" \
    --source "$SOURCE_ACCOUNT" \
    --network "$NETWORK" \
    2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed: $DEPLOY_OUTPUT"
    exit 1
fi

# Extract contract ID from output
CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | grep -o 'C[0-9A-Z]\{55\}' | head -1)

if [ -z "$CONTRACT_ID" ]; then
    echo "❌ Could not extract contract ID from deployment output"
    echo "Deployment output: $DEPLOY_OUTPUT"
    exit 1
fi

echo "✅ Contract deployed successfully!"
echo "📋 Contract ID: $CONTRACT_ID"

# Initialize the contract
echo "🔧 Initializing contract..."

INIT_OUTPUT=$(soroban contract invoke \
    --id "$CONTRACT_ID" \
    --source "$SOURCE_ACCOUNT" \
    --network "$NETWORK" \
    -- \
    initialize \
    --admin "$SOURCE_ACCOUNT" \
    2>&1)

if [ $? -ne 0 ]; then
    echo "❌ Initialization failed: $INIT_OUTPUT"
    exit 1
fi

echo "✅ Contract initialized successfully!"

# Update .env file
cd ..
ENV_FILE="chainfund-backend/.env"

if [ -f "$ENV_FILE" ]; then
    # Update or add CHAINFUND_CONTRACT_ID
    if grep -q "CHAINFUND_CONTRACT_ID" "$ENV_FILE"; then
        sed -i.bak "s/CHAINFUND_CONTRACT_ID=.*/CHAINFUND_CONTRACT_ID=$CONTRACT_ID/" "$ENV_FILE"
    else
        echo "CHAINFUND_CONTRACT_ID=$CONTRACT_ID" >> "$ENV_FILE"
    fi
    echo "📝 Updated $ENV_FILE with contract ID"
else
    echo "⚠️  .env file not found. Please manually set CHAINFUND_CONTRACT_ID=$CONTRACT_ID"
fi

echo ""
echo "🎉 Deployment complete!"
echo "====================================="
echo "Contract ID: $CONTRACT_ID"
echo "Network: $NETWORK"
echo ""
echo "Next steps:"
echo "1. Fund some test accounts with XLM from https://laboratory.stellar.org/"
echo "2. Start the backend: cd chainfund-backend && python start_server.py"
echo "3. Start the frontend: cd chainfund-spark && npm run dev"
echo "4. Test the application at http://localhost:3000"
echo ""
echo "Happy coding! 🚀"