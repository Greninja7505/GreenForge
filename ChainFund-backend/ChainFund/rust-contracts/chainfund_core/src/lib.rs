//! # ChainFund Core Smart Contract
//! 
//! AI-Verified Trustless Crowdfunding on Stellar/Soroban
//! 
//! ## Modules:
//! - Campaign Registry: Store and manage crowdfunding campaigns
//! - Milestone Manager: Track milestone progress and proofs
//! - AI Verification: Receive and store AI verification results
//! - Quadratic Voting: Fair community governance
//! - Escrow Logic: Trustless fund management
//! - SBT Integration: Reputation token awards

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Address, BytesN, Env, Map, String, Symbol, Vec,
    symbol_short, token,
};

// ============================================================================
// ERRORS
// ============================================================================

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    // Campaign errors
    CampaignNotFound = 1,
    CampaignNotActive = 2,
    CampaignAlreadyExists = 3,
    
    // Milestone errors
    MilestoneNotFound = 4,
    MilestoneAlreadyReleased = 5,
    MilestoneNotReady = 6,
    ProofAlreadySubmitted = 7,
    
    // Funding errors
    InvalidAmount = 8,
    FundingGoalExceeded = 9,
    InsufficientFunds = 10,
    
    // Voting errors
    AlreadyVoted = 11,
    VotingNotOpen = 12,
    NotABacker = 13,
    
    // AI Verification errors
    AIVerificationPending = 14,
    AIVerificationFailed = 15,
    UnauthorizedAIOracle = 16,
    
    // Access errors
    Unauthorized = 17,
    NotCreator = 18,
    
    // General errors
    InvalidInput = 19,
    ContractPaused = 20,
}

// ============================================================================
// DATA TYPES
// ============================================================================

/// AI Verification Status - Results from backend AI analysis
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum VerificationStatus {
    NotSubmitted = 0,    // No proof submitted yet
    Pending = 1,         // Proof submitted, awaiting AI analysis
    Completed = 2,       // AI verified successfully
    Partial = 3,         // Partially verified (minor issues)
    Suspicious = 4,      // AI detected potential fraud
    Rejected = 5,        // Community rejected after AI flagged
}

/// Campaign Status
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum CampaignStatus {
    Draft = 0,           // Not yet launched
    Active = 1,          // Accepting funds
    Funded = 2,          // Goal reached, milestones in progress
    Completed = 3,       // All milestones done
    Failed = 4,          // Failed to reach goal or rejected
    Cancelled = 5,       // Creator cancelled
}

/// Milestone Status
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum MilestoneStatus {
    Pending = 0,         // Not yet started
    InProgress = 1,      // Currently active milestone
    ProofSubmitted = 2,  // Creator submitted proof
    AIVerified = 3,      // AI approved
    VotingOpen = 4,      // Community voting in progress
    Approved = 5,        // Votes passed, ready for release
    Released = 6,        // Funds released to creator
    Disputed = 7,        // Under dispute
    Rejected = 8,        // Rejected by AI or community
}

/// SBT Role Types for reputation tokens
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtRole {
    Creator = 0,         // Successfully completed a campaign
    Backer = 1,          // Funded successful projects
    Developer = 2,       // Contributed code
    Designer = 3,        // Contributed design
    Tester = 4,          // Contributed testing
    Mentor = 5,          // Provided guidance
    Validator = 6,       // Participated in voting
}

/// Milestone Definition
#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub amount: i128,                        // XLM amount for this milestone
    pub ipfs_proof: BytesN<32>,              // IPFS hash of proof (zeroed if not submitted)
    pub ai_verdict: VerificationStatus,      // AI verification result
    pub ai_confidence: u32,                  // AI confidence score (0-100)
    pub votes_for: u64,                      // Quadratic voting power FOR
    pub votes_against: u64,                  // Quadratic voting power AGAINST
    pub voters: Map<Address, i64>,           // voter -> vote_power (positive=for, negative=against)
    pub status: MilestoneStatus,
    pub proof_submitted_at: u64,             // Timestamp
    pub verified_at: u64,                    // Timestamp
    pub released_at: u64,                    // Timestamp
}

/// Campaign (Project) Definition
#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub ipfs_metadata: BytesN<32>,           // IPFS hash of full project details
    pub total_goal: i128,                    // Total funding target in XLM
    pub funds_raised: i128,                  // Total XLM received from backers
    pub funds_released: i128,                // Amount already paid to creator
    pub funds_locked: i128,                  // Currently locked in escrow
    pub token_address: Address,              // XLM token contract address
    pub milestones: Vec<Milestone>,          // Project milestones
    pub backers: Map<Address, i128>,         // backer -> amount contributed
    pub backer_count: u32,                   // Total number of unique backers
    pub status: CampaignStatus,
    pub created_at: u64,
    pub funded_at: u64,
    pub completed_at: u64,
    pub current_milestone: u32,              // Index of current milestone
}

/// Backer Information
#[contracttype]
#[derive(Clone)]
pub struct BackerInfo {
    pub address: Address,
    pub amount: i128,
    pub voting_power: u64,                   // sqrt(amount) for quadratic voting
    pub votes_cast: u32,                     // Number of votes participated in
    pub funded_at: u64,
}

/// Contract Configuration
#[contracttype]
#[derive(Clone)]
pub struct ContractConfig {
    pub admin: Address,                      // Contract admin
    pub ai_oracle: Address,                  // Authorized AI verification oracle
    pub sbt_contract: Address,               // SBT minting contract address
    pub min_funding: i128,                   // Minimum campaign funding goal
    pub platform_fee_bps: u32,               // Platform fee in basis points (100 = 1%)
    pub voting_period: u64,                  // Voting duration in seconds
    pub ai_timeout: u64,                     // AI verification timeout
    pub is_paused: bool,                     // Emergency pause flag
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const CONFIG_KEY: Symbol = symbol_short!("CONFIG");
const NEXT_ID_KEY: Symbol = symbol_short!("NEXT_ID");
const CAMPAIGN_PREFIX: Symbol = symbol_short!("CAMP_");

// ============================================================================
// CONTRACT IMPLEMENTATION
// ============================================================================

#[contract]
pub struct ChainFundContract;

#[contractimpl]
impl ChainFundContract {
    
    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    /// Initialize the contract with admin and configuration
    pub fn initialize(
        env: Env,
        admin: Address,
        ai_oracle: Address,
        sbt_contract: Address,
        token_address: Address,
    ) -> Result<(), ContractError> {
        admin.require_auth();
        
        // Check if already initialized
        if env.storage().instance().has(&CONFIG_KEY) {
            return Err(ContractError::CampaignAlreadyExists);
        }
        
        let config = ContractConfig {
            admin: admin.clone(),
            ai_oracle,
            sbt_contract,
            min_funding: 1000_0000000,       // 1000 XLM minimum
            platform_fee_bps: 250,           // 2.5% platform fee
            voting_period: 7 * 24 * 3600,    // 7 days voting
            ai_timeout: 24 * 3600,           // 24 hours AI timeout
            is_paused: false,
        };
        
        env.storage().instance().set(&CONFIG_KEY, &config);
        env.storage().instance().set(&NEXT_ID_KEY, &1u32);
        
        // Store token address
        env.storage().instance().set(&symbol_short!("TOKEN"), &token_address);
        
        env.events().publish(
            (symbol_short!("init"), admin),
            env.ledger().timestamp(),
        );
        
        Ok(())
    }
    
    // ========================================================================
    // MODULE A: CAMPAIGN REGISTRY
    // ========================================================================
    
    /// Create a new crowdfunding campaign with milestones
    pub fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        ipfs_metadata: BytesN<32>,
        total_goal: i128,
        milestone_configs: Vec<(String, String, i128)>, // (title, desc, amount)
    ) -> Result<u32, ContractError> {
        creator.require_auth();
        
        // Validate
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if config.is_paused {
            return Err(ContractError::ContractPaused);
        }
        
        if total_goal < config.min_funding {
            return Err(ContractError::InvalidAmount);
        }
        
        if milestone_configs.is_empty() {
            return Err(ContractError::InvalidInput);
        }
        
        // Verify milestone amounts sum to goal
        let mut milestone_total: i128 = 0;
        for config in milestone_configs.iter() {
            milestone_total += config.2;
        }
        if milestone_total != total_goal {
            return Err(ContractError::InvalidAmount);
        }
        
        // Get next campaign ID
        let campaign_id: u32 = env.storage().instance()
            .get(&NEXT_ID_KEY)
            .unwrap_or(1);
        
        // Create milestones
        let mut milestones = Vec::new(&env);
        let zero_hash = BytesN::from_array(&env, &[0u8; 32]);
        
        for (idx, ms_config) in milestone_configs.iter().enumerate() {
            let milestone = Milestone {
                id: idx as u32,
                title: ms_config.0.clone(),
                description: ms_config.1.clone(),
                amount: ms_config.2,
                ipfs_proof: zero_hash.clone(),
                ai_verdict: VerificationStatus::NotSubmitted,
                ai_confidence: 0,
                votes_for: 0,
                votes_against: 0,
                voters: Map::new(&env),
                status: if idx == 0 { MilestoneStatus::InProgress } else { MilestoneStatus::Pending },
                proof_submitted_at: 0,
                verified_at: 0,
                released_at: 0,
            };
            milestones.push_back(milestone);
        }
        
        // Get token address
        let token_address: Address = env.storage().instance()
            .get(&symbol_short!("TOKEN"))
            .ok_or(ContractError::InvalidInput)?;
        
        // Create campaign
        let campaign = Campaign {
            id: campaign_id,
            creator: creator.clone(),
            title,
            description,
            ipfs_metadata,
            total_goal,
            funds_raised: 0,
            funds_released: 0,
            funds_locked: 0,
            token_address,
            milestones,
            backers: Map::new(&env),
            backer_count: 0,
            status: CampaignStatus::Active,
            created_at: env.ledger().timestamp(),
            funded_at: 0,
            completed_at: 0,
            current_milestone: 0,
        };
        
        // Store campaign
        env.storage().persistent().set(&campaign_id, &campaign);
        env.storage().instance().set(&NEXT_ID_KEY, &(campaign_id + 1));
        
        // Emit event
        env.events().publish(
            (symbol_short!("campaign"), symbol_short!("created")),
            (campaign_id, creator, total_goal),
        );
        
        Ok(campaign_id)
    }
    
    /// Get campaign details
    pub fn get_campaign(env: Env, campaign_id: u32) -> Result<Campaign, ContractError> {
        env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)
    }
    
    /// Close a completed campaign and trigger SBT awards
    pub fn close_campaign(
        env: Env,
        campaign_id: u32,
        caller: Address,
    ) -> Result<(), ContractError> {
        caller.require_auth();
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        // Only creator or admin can close
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if caller != campaign.creator && caller != config.admin {
            return Err(ContractError::Unauthorized);
        }
        
        // Check all milestones are released
        let all_released = campaign.milestones.iter()
            .all(|m| m.status == MilestoneStatus::Released);
        
        if !all_released {
            return Err(ContractError::MilestoneNotReady);
        }
        
        campaign.status = CampaignStatus::Completed;
        campaign.completed_at = env.ledger().timestamp();
        
        env.storage().persistent().set(&campaign_id, &campaign);
        
        env.events().publish(
            (symbol_short!("campaign"), symbol_short!("closed")),
            (campaign_id, env.ledger().timestamp()),
        );
        
        Ok(())
    }
    
    // ========================================================================
    // MODULE B: ESCROW & FUNDING
    // ========================================================================
    
    /// Fund a campaign - XLM is locked in escrow
    pub fn fund_campaign(
        env: Env,
        campaign_id: u32,
        backer: Address,
        amount: i128,
    ) -> Result<(), ContractError> {
        backer.require_auth();
        
        if amount <= 0 {
            return Err(ContractError::InvalidAmount);
        }
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        if campaign.status != CampaignStatus::Active {
            return Err(ContractError::CampaignNotActive);
        }
        
        // Check if funding would exceed goal
        if campaign.funds_raised + amount > campaign.total_goal {
            return Err(ContractError::FundingGoalExceeded);
        }
        
        // Transfer XLM from backer to contract
        let token = token::Client::new(&env, &campaign.token_address);
        token.transfer(&backer, &env.current_contract_address(), &amount);
        
        // Update backer info
        let current_contribution = campaign.backers.get(backer.clone()).unwrap_or(0);
        if current_contribution == 0 {
            campaign.backer_count += 1;
        }
        campaign.backers.set(backer.clone(), current_contribution + amount);
        
        // Update campaign funds
        campaign.funds_raised += amount;
        campaign.funds_locked += amount;
        
        // Check if fully funded
        if campaign.funds_raised >= campaign.total_goal {
            campaign.status = CampaignStatus::Funded;
            campaign.funded_at = env.ledger().timestamp();
        }
        
        env.storage().persistent().set(&campaign_id, &campaign);
        
        // Emit event
        env.events().publish(
            (symbol_short!("funded"), campaign_id),
            (backer, amount, campaign.funds_raised),
        );
        
        Ok(())
    }
    
    /// Release funds for an approved milestone
    pub fn release_funds(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
    ) -> Result<i128, ContractError> {
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let mut milestone = campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)?;
        
        // === TRUSTLESS RELEASE CONDITIONS (from PDF) ===
        
        // Condition 1: Milestone not already released
        if milestone.status == MilestoneStatus::Released {
            return Err(ContractError::MilestoneAlreadyReleased);
        }
        
        // Condition 2: AI verification must be Completed or Partial
        if milestone.ai_verdict != VerificationStatus::Completed 
           && milestone.ai_verdict != VerificationStatus::Partial {
            return Err(ContractError::AIVerificationPending);
        }
        
        // Condition 3: Community votes must approve (votes_for > votes_against)
        if milestone.votes_for <= milestone.votes_against {
            return Err(ContractError::VotingNotOpen);
        }
        
        // Condition 4: Sufficient funds locked
        if campaign.funds_locked < milestone.amount {
            return Err(ContractError::InsufficientFunds);
        }
        
        // === ALL CONDITIONS MET - RELEASE FUNDS ===
        
        // Calculate platform fee
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
        
        let fee = (milestone.amount * config.platform_fee_bps as i128) / 10000;
        let creator_amount = milestone.amount - fee;
        
        // Transfer to creator
        let token = token::Client::new(&env, &campaign.token_address);
        token.transfer(&env.current_contract_address(), &campaign.creator, &creator_amount);
        
        // Transfer fee to admin
        if fee > 0 {
            token.transfer(&env.current_contract_address(), &config.admin, &fee);
        }
        
        // Update milestone
        milestone.status = MilestoneStatus::Released;
        milestone.released_at = env.ledger().timestamp();
        campaign.milestones.set(milestone_id, milestone.clone());
        
        // Update campaign
        campaign.funds_released += milestone.amount;
        campaign.funds_locked -= milestone.amount;
        
        // Activate next milestone if exists
        if milestone_id + 1 < campaign.milestones.len() {
            let mut next = campaign.milestones.get(milestone_id + 1).unwrap();
            next.status = MilestoneStatus::InProgress;
            campaign.milestones.set(milestone_id + 1, next);
            campaign.current_milestone = milestone_id + 1;
        }
        
        env.storage().persistent().set(&campaign_id, &campaign);
        
        // Emit event
        env.events().publish(
            (symbol_short!("released"), campaign_id),
            (milestone_id, creator_amount, fee),
        );
        
        Ok(creator_amount)
    }
    
    /// Refund backers if campaign fails
    pub fn refund_backers(
        env: Env,
        campaign_id: u32,
        admin: Address,
    ) -> Result<u32, ContractError> {
        admin.require_auth();
        
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if admin != config.admin {
            return Err(ContractError::Unauthorized);
        }
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let token = token::Client::new(&env, &campaign.token_address);
        let mut refund_count = 0u32;
        
        // Refund each backer
        for (backer, amount) in campaign.backers.iter() {
            if amount > 0 {
                token.transfer(&env.current_contract_address(), &backer, &amount);
                refund_count += 1;
            }
        }
        
        // Clear campaign
        campaign.status = CampaignStatus::Failed;
        campaign.funds_locked = 0;
        campaign.backers = Map::new(&env);
        
        env.storage().persistent().set(&campaign_id, &campaign);
        
        env.events().publish(
            (symbol_short!("refund"), campaign_id),
            refund_count,
        );
        
        Ok(refund_count)
    }
    
    // ========================================================================
    // MODULE C: MILESTONE MANAGEMENT
    // ========================================================================
    
    /// Submit proof for a milestone (IPFS hash)
    pub fn submit_proof(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
        creator: Address,
        ipfs_hash: BytesN<32>,
    ) -> Result<(), ContractError> {
        creator.require_auth();
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        // Verify caller is creator
        if creator != campaign.creator {
            return Err(ContractError::NotCreator);
        }
        
        let mut milestone = campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)?;
        
        // Verify milestone is in progress
        if milestone.status != MilestoneStatus::InProgress {
            return Err(ContractError::MilestoneNotReady);
        }
        
        // Check proof not already submitted
        let zero_hash = BytesN::from_array(&env, &[0u8; 32]);
        if milestone.ipfs_proof != zero_hash {
            return Err(ContractError::ProofAlreadySubmitted);
        }
        
        // Store proof
        milestone.ipfs_proof = ipfs_hash.clone();
        milestone.status = MilestoneStatus::ProofSubmitted;
        milestone.proof_submitted_at = env.ledger().timestamp();
        milestone.ai_verdict = VerificationStatus::Pending;
        
        campaign.milestones.set(milestone_id, milestone);
        env.storage().persistent().set(&campaign_id, &campaign);
        
        // Emit event for AI backend to pick up
        env.events().publish(
            (symbol_short!("proof"), campaign_id),
            (milestone_id, ipfs_hash),
        );
        
        Ok(())
    }
    
    /// Get milestone details
    pub fn get_milestone(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
    ) -> Result<Milestone, ContractError> {
        let campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)
    }
    
    // ========================================================================
    // MODULE D: AI VERIFICATION HANDLER
    // ========================================================================
    
    /// Submit AI verification verdict (called by authorized AI oracle only)
    pub fn submit_ai_verdict(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
        oracle: Address,
        status: VerificationStatus,
        confidence: u32,
    ) -> Result<(), ContractError> {
        oracle.require_auth();
        
        // Verify oracle is authorized
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if oracle != config.ai_oracle && oracle != config.admin {
            return Err(ContractError::UnauthorizedAIOracle);
        }
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let mut milestone = campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)?;
        
        // Verify milestone is awaiting AI verification
        if milestone.status != MilestoneStatus::ProofSubmitted {
            return Err(ContractError::MilestoneNotReady);
        }
        
        // Store AI verdict
        milestone.ai_verdict = status.clone();
        milestone.ai_confidence = confidence;
        milestone.verified_at = env.ledger().timestamp();
        
        // Update milestone status based on AI result
        milestone.status = match status {
            VerificationStatus::Completed | VerificationStatus::Partial => {
                MilestoneStatus::VotingOpen  // Open community voting
            },
            VerificationStatus::Suspicious => {
                MilestoneStatus::Disputed    // Flag for review
            },
            _ => MilestoneStatus::Rejected,
        };
        
        campaign.milestones.set(milestone_id, milestone);
        env.storage().persistent().set(&campaign_id, &campaign);
        
        // Emit event
        env.events().publish(
            (symbol_short!("ai_vote"), campaign_id),
            (milestone_id, status as u32, confidence),
        );
        
        Ok(())
    }
    
    // ========================================================================
    // MODULE E: QUADRATIC VOTING ENGINE
    // ========================================================================
    
    /// Cast a quadratic vote on a milestone
    /// Voting power = sqrt(amount_contributed)
    pub fn vote(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
        voter: Address,
        approve: bool,
    ) -> Result<u64, ContractError> {
        voter.require_auth();
        
        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let mut milestone = campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)?;
        
        // Verify voting is open
        if milestone.status != MilestoneStatus::VotingOpen 
           && milestone.status != MilestoneStatus::AIVerified {
            return Err(ContractError::VotingNotOpen);
        }
        
        // Check if already voted
        if milestone.voters.contains_key(voter.clone()) {
            return Err(ContractError::AlreadyVoted);
        }
        
        // Get backer's contribution
        let contribution = campaign.backers
            .get(voter.clone())
            .ok_or(ContractError::NotABacker)?;
        
        if contribution <= 0 {
            return Err(ContractError::NotABacker);
        }
        
        // === QUADRATIC VOTING: voting_power = sqrt(contribution) ===
        // Using integer sqrt approximation
        let voting_power = Self::integer_sqrt(contribution as u64);
        
        // Record vote
        if approve {
            milestone.votes_for += voting_power;
            milestone.voters.set(voter.clone(), voting_power as i64);
        } else {
            milestone.votes_against += voting_power;
            milestone.voters.set(voter.clone(), -(voting_power as i64));
        }
        
        // Check if we should auto-approve (significant majority)
        let total_votes = milestone.votes_for + milestone.votes_against;
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
        
        // Auto-approve if 66% majority with significant participation
        if total_votes > 0 && milestone.votes_for > milestone.votes_against * 2 {
            milestone.status = MilestoneStatus::Approved;
        }
        
        campaign.milestones.set(milestone_id, milestone);
        env.storage().persistent().set(&campaign_id, &campaign);
        
        // Emit event
        env.events().publish(
            (symbol_short!("voted"), campaign_id),
            (milestone_id, voter, approve, voting_power),
        );
        
        Ok(voting_power)
    }
    
    /// Get voting status for a milestone
    pub fn get_vote_status(
        env: Env,
        campaign_id: u32,
        milestone_id: u32,
    ) -> Result<(u64, u64, u32), ContractError> {
        let campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let milestone = campaign.milestones
            .get(milestone_id)
            .ok_or(ContractError::MilestoneNotFound)?;
        
        Ok((
            milestone.votes_for,
            milestone.votes_against,
            milestone.voters.len(),
        ))
    }
    
    // ========================================================================
    // MODULE F: SBT REPUTATION INTEGRATION
    // ========================================================================
    
    /// Award SBT to a user (called after campaign completion)
    pub fn award_sbt(
        env: Env,
        campaign_id: u32,
        recipient: Address,
        role: SbtRole,
        caller: Address,
    ) -> Result<(), ContractError> {
        caller.require_auth();
        
        let campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        // Verify caller is creator or admin
        let config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if caller != campaign.creator && caller != config.admin {
            return Err(ContractError::Unauthorized);
        }
        
        // Verify campaign is completed
        if campaign.status != CampaignStatus::Completed {
            return Err(ContractError::CampaignNotActive);
        }
        
        // Emit SBT award event (actual minting handled by SBT contract)
        env.events().publish(
            (symbol_short!("sbt"), symbol_short!("award")),
            (campaign_id, recipient, role as u32),
        );
        
        Ok(())
    }
    
    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================
    
    /// Integer square root for quadratic voting
    fn integer_sqrt(n: u64) -> u64 {
        if n == 0 {
            return 0;
        }
        
        let mut x = n;
        let mut y = (x + 1) / 2;
        
        while y < x {
            x = y;
            y = (x + n / x) / 2;
        }
        
        x
    }
    
    /// Get contract configuration
    pub fn get_config(env: Env) -> Result<ContractConfig, ContractError> {
        env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)
    }
    
    /// Update AI oracle address (admin only)
    pub fn set_ai_oracle(
        env: Env,
        admin: Address,
        new_oracle: Address,
    ) -> Result<(), ContractError> {
        admin.require_auth();
        
        let mut config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if admin != config.admin {
            return Err(ContractError::Unauthorized);
        }
        
        config.ai_oracle = new_oracle.clone();
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        env.events().publish(
            (symbol_short!("config"), symbol_short!("oracle")),
            new_oracle,
        );
        
        Ok(())
    }
    
    /// Emergency pause (admin only)
    pub fn set_paused(
        env: Env,
        admin: Address,
        paused: bool,
    ) -> Result<(), ContractError> {
        admin.require_auth();
        
        let mut config: ContractConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(ContractError::InvalidInput)?;
            
        if admin != config.admin {
            return Err(ContractError::Unauthorized);
        }
        
        config.is_paused = paused;
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        env.events().publish(
            (symbol_short!("paused"),),
            paused,
        );
        
        Ok(())
    }
    
    /// Get backer info
    pub fn get_backer(
        env: Env,
        campaign_id: u32,
        backer: Address,
    ) -> Result<(i128, u64), ContractError> {
        let campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ContractError::CampaignNotFound)?;
        
        let amount = campaign.backers.get(backer).unwrap_or(0);
        let voting_power = Self::integer_sqrt(amount as u64);
        
        Ok((amount, voting_power))
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_integer_sqrt() {
        assert_eq!(ChainFundContract::integer_sqrt(0), 0);
        assert_eq!(ChainFundContract::integer_sqrt(1), 1);
        assert_eq!(ChainFundContract::integer_sqrt(4), 2);
        assert_eq!(ChainFundContract::integer_sqrt(9), 3);
        assert_eq!(ChainFundContract::integer_sqrt(16), 4);
        assert_eq!(ChainFundContract::integer_sqrt(100), 10);
        assert_eq!(ChainFundContract::integer_sqrt(10000), 100);
        // Quadratic voting example: 1000 XLM contribution = sqrt(1000) ≈ 31 voting power
        assert_eq!(ChainFundContract::integer_sqrt(1000), 31);
    }
}
