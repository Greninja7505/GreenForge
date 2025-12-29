#!/bin/bash

# Build the contracts
echo "Building project funding contract..."
cd project_funding
cargo build --target wasm32-unknown-unknown --release
cd ..

echo "Building reward token contract..."
cd reward_token
cargo build --target wasm32-unknown-unknown --release
cd ..

# Deploy to testnet
echo "Deploying project funding contract..."
PROJECT_FUNDING_ID=$(soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/project_funding.wasm \
    --network testnet)

echo "Deploying reward token contract..."
REWARD_TOKEN_ID=$(soroban contract deploy \
    --wasm target/wasm32-unknown-unknown/release/reward_token.wasm \
    --network testnet)

# Save contract IDs to .env file
echo "STELLAR_PROJECT_FUNDING_ID=$PROJECT_FUNDING_ID" > ../.env
echo "STELLAR_REWARD_TOKEN_ID=$REWARD_TOKEN_ID" >> ../.env

echo "Deployment complete!"
echo "Project Funding Contract ID: $PROJECT_FUNDING_ID"
echo "Reward Token Contract ID: $REWARD_TOKEN_ID"