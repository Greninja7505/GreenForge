# ChainFund Smart Contracts

This directory contains the Rust smart contracts for ChainFund, built using Soroban on the Stellar network.

## Overview

ChainFund is a decentralized crowdfunding platform that combines:
- Milestone-based funding with community voting
- Skill-based reputation system with NFTs
- Decentralized governance for project milestones

## Smart Contracts

### ChainFundContract

The main contract that handles:
- Campaign creation and management
- Milestone-based funding with escrow
- Community voting on milestone completion
- Skill NFT minting for reputation tracking

## Key Features

### Campaign Management
- Create campaigns with multiple milestones
- Back campaigns with XLM tokens
- Automatic funding status tracking
- Time-based campaign deadlines

### Milestone System
- Break projects into verifiable milestones
- Community voting on milestone completion
- Escrow-based fund release
- Transparent progress tracking

### Skill NFTs
- Reputation-based skill scoring
- Soulbound NFTs for immutable reputation
- Multi-tier skill levels (Novice → Expert)
- On-chain achievement tracking

### Voting System
- Quadratic voting for milestone approval
- Backer-weighted voting power
- Transparent vote counting
- Minimum participation thresholds

## Development

### Prerequisites
- Rust 1.70+
- Soroban CLI
- Stellar account with XLM for deployment

### Building
```bash
cargo build --target wasm32-unknown-unknown --release
```

### Testing
```bash
cargo test
```

### Deployment
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/chainfund_contracts.wasm \
  --source <your-secret-key> \
  --network testnet
```

## Contract Functions

### Campaign Operations
- `create_campaign()` - Create a new crowdfunding campaign
- `back_campaign()` - Contribute to a campaign
- `get_campaign()` - Retrieve campaign details

### Milestone Operations
- `vote_milestone()` - Vote on milestone completion
- `complete_milestone()` - Release funds for completed milestone

### NFT Operations
- `mint_skill_nft()` - Mint a skill-based NFT
- `get_skill_nft()` - Retrieve NFT details

## Events

The contract emits events for:
- Campaign creation and funding
- Milestone voting and completion
- NFT minting
- Fund transfers

## Security

- All token transfers use Stellar's built-in asset system
- Admin-only functions for sensitive operations
- Time-locked operations for campaign deadlines
- Community voting prevents single points of failure

## Integration

This contract integrates with:
- Stellar DEX for token operations
- ChainFund backend API for off-chain data
- Frontend dashboard for user interaction