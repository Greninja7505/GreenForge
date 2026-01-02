# ChainFund Smart Contracts

AI-Verified Trustless Crowdfunding on Stellar/Soroban

## Overview

ChainFund implements a complete trustless crowdfunding system with the following features:

- **Milestone-based funding** - Funds released only when milestones are verified
- **AI Verification** - Backend AI analyzes proof of completion
- **Quadratic Voting** - Fair community governance (voting power = √contribution)
- **Escrow Protection** - Funds locked until conditions are met
- **SoulBound Tokens** - Non-transferable reputation tokens

## Contract Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      ChainFund Core Contract                     │
├─────────────────────────────────────────────────────────────────┤
│  Campaign Registry    │  Milestone Manager  │  AI Verification   │
│  - create_campaign()  │  - submit_proof()   │  - submit_verdict()│
│  - fund_campaign()    │  - get_milestone()  │  - verify status   │
│  - close_campaign()   │                     │                    │
├─────────────────────────────────────────────────────────────────┤
│  Quadratic Voting     │  Escrow Logic       │  SBT Integration   │
│  - vote()             │  - release_funds()  │  - award_sbt()     │
│  - get_vote_status()  │  - refund_backers() │                    │
│  - √(amount) power    │  - platform fee     │                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ChainFund SBT Contract                        │
├─────────────────────────────────────────────────────────────────┤
│  - mint()             - Non-transferable tokens                  │
│  - get_profile()      - Role-based reputation                    │
│  - get_reputation()   - Campaign participation tracking          │
│  - revoke()           - Admin revocation for fraud               │
└─────────────────────────────────────────────────────────────────┘
```

## Module Details

### Module A: Campaign Registry

Creates and stores crowdfunding campaigns with milestones.

```rust
// Create a new campaign
pub fn create_campaign(
    creator: Address,
    title: String,
    description: String,
    total_goal: i128,
    milestone_configs: Vec<(String, String, i128)>
) -> Result<u32, ContractError>
```

### Module B: Escrow & Funding

Locks backer funds in contract until milestones are verified.

```rust
// Fund a campaign (XLM transferred to contract)
pub fn fund_campaign(
    campaign_id: u32,
    backer: Address,
    amount: i128
) -> Result<(), ContractError>
```

### Module C: Milestone Management

Tracks milestone progress and proof submissions.

```rust
// Submit proof of milestone completion (triggers AI verification)
pub fn submit_proof(
    campaign_id: u32,
    milestone_id: u32,
    creator: Address,
    ipfs_hash: BytesN<32>
) -> Result<(), ContractError>
```

### Module D: AI Verification Handler

Receives verification results from authorized AI oracle.

```rust
// AI oracle submits verdict
pub fn submit_ai_verdict(
    campaign_id: u32,
    milestone_id: u32,
    oracle: Address,           // Must be authorized oracle
    status: VerificationStatus,
    confidence: u32            // 0-100
) -> Result<(), ContractError>
```

**Verification Status:**
- `Completed` - AI verified, opens community voting
- `Partial` - Minor issues, opens voting
- `Suspicious` - Potential fraud, enters dispute
- `Rejected` - Failed verification

### Module E: Quadratic Voting Engine

Fair community governance using quadratic voting.

```rust
// Cast a vote (power = √contribution)
pub fn vote(
    campaign_id: u32,
    milestone_id: u32,
    voter: Address,
    approve: bool
) -> Result<u64, ContractError>
```

**Quadratic Voting Example:**
| Contribution | Voting Power |
|-------------|--------------|
| $100        | 10           |
| $1,000      | 31           |
| $10,000     | 100          |
| $100,000    | 316          |

### Module F: Trustless Fund Release

Funds released only when ALL conditions are met:

```rust
pub fn release_funds(
    campaign_id: u32,
    milestone_id: u32
) -> Result<i128, ContractError>
```

**Release Conditions:**
1. ✅ AI verdict == `Completed` OR `Partial`
2. ✅ `votes_for > votes_against`
3. ✅ Milestone not already released
4. ✅ Sufficient funds locked in escrow

**Fee Structure:**
- 2.5% platform fee deducted automatically
- Remaining 97.5% sent to creator

## SBT (SoulBound Token) System

Non-transferable reputation tokens awarded for participation.

### Roles & Reputation Values

| Role | Points | Awarded For |
|------|--------|-------------|
| Creator | 100 | Completing a campaign |
| Ambassador | 75 | Community leadership |
| Pioneer | 60 | Early adopter |
| Super Backer | 50 | Funding 5+ projects |
| Mentor | 40 | Providing guidance |
| Developer | 30 | Contributing code |
| Designer | 25 | Contributing design |
| Tester | 20 | Testing work |
| Validator | 15 | Active voting |
| Backer | 10 | Funding a project |

### Key Features

- **Non-transferable** - `transfer()` always returns error
- **Revocable** - Admin can revoke for fraud
- **Cumulative** - Reputation adds up across projects

## Building

### Prerequisites

- Rust 1.70+
- Soroban CLI (`cargo install soroban-cli`)
- Stellar CLI (`cargo install stellar-cli`)

### Build Commands

```powershell
# Navigate to contracts directory
cd ChainFund-backend/ChainFund/rust-contracts

# Build all contracts
./build.ps1

# Or build manually
cargo build --release --target wasm32-unknown-unknown
```

### Output

WASM files are created in:
```
target/wasm32-unknown-unknown/release/
├── chainfund_core.wasm
├── chainfund_sbt.wasm
├── project_funding.wasm
└── reward_token.wasm
```

## Deployment

### Deploy to Testnet

```powershell
# Run deployment script
./deploy-chainfund.ps1
```

This will:
1. Generate admin keypair (or load existing)
2. Fund account via Stellar Friendbot
3. Deploy both contracts
4. Initialize contracts
5. Save addresses to `deployed_addresses.json`

### Manual Deployment

```bash
# Deploy core contract
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/chainfund_core.wasm \
  --source admin \
  --network testnet

# Initialize
stellar contract invoke \
  --id <CONTRACT_ID> \
  --source admin \
  --network testnet \
  -- initialize \
  --admin <ADMIN_PUBLIC_KEY> \
  --ai_oracle <ORACLE_KEY> \
  --sbt_contract <SBT_CONTRACT_ID> \
  --token_address CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2EZ4KUXH
```

## Contract Flow

```
1. CAMPAIGN CREATION
   Creator → create_campaign() → Campaign Active

2. FUNDING PHASE  
   Backer → fund_campaign() → XLM Locked in Escrow
   (Backer receives voting power = √amount)

3. MILESTONE WORK
   Creator completes work → submit_proof(ipfs_hash)
   
4. AI VERIFICATION
   AI Oracle → submit_ai_verdict(Completed, 95%)
   → Opens Community Voting

5. COMMUNITY VOTING
   Backers → vote(approve: true/false)
   (Using quadratic voting power)

6. FUND RELEASE (if conditions met)
   Anyone → release_funds()
   → 97.5% to Creator
   → 2.5% Platform Fee

7. CAMPAIGN COMPLETION
   All milestones released → close_campaign()
   → SBT tokens minted for participants
```

## API Integration

The backend provides REST endpoints for contract interaction:

### Endpoints

```
GET  /contracts/v2/status
POST /contracts/v2/campaigns
GET  /contracts/v2/campaigns/{id}
POST /contracts/v2/campaigns/{id}/fund
POST /contracts/v2/campaigns/{id}/milestones/{id}/proof
POST /contracts/v2/campaigns/{id}/milestones/{id}/ai-verdict
POST /contracts/v2/campaigns/{id}/milestones/{id}/vote
POST /contracts/v2/campaigns/{id}/milestones/{id}/release
POST /contracts/v2/sbt/mint
GET  /contracts/v2/sbt/profile/{address}
GET  /contracts/v2/sbt/reputation/{address}
```

## Testing

```bash
# Run unit tests
cargo test

# Test integer sqrt (quadratic voting)
cargo test test_integer_sqrt

# Test SBT reputation values
cargo test test_role_reputation
```

## Security Considerations

1. **AI Oracle Authorization** - Only authorized oracle can submit verdicts
2. **Creator Verification** - Only campaign creator can submit proofs
3. **Admin Controls** - Emergency pause and refund capabilities
4. **SBT Non-transferability** - Prevents reputation gaming
5. **Quadratic Voting** - Prevents whale dominance

## License

MIT License
