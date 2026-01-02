#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Env, Symbol, Vec, Map, String, symbol_short,
    panic_with_error
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub goal_amount: i128,
    pub total_backed: i128,
    pub status: CampaignStatus,
    pub milestones: Vec<Milestone>,
    pub backers: Map<Address, BackerInfo>,
    pub created_at: u64,
    pub end_date: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub amount: i128,
    pub status: MilestoneStatus,
    pub votes_for: u32,
    pub votes_against: u32,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BackerInfo {
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active = 0,
    Funded = 1,
    Completed = 2,
    Cancelled = 3,
}

#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum MilestoneStatus {
    Pending = 0,
    Active = 1,
    Completed = 2,
    Rejected = 3,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ChainFundError {
    CampaignNotFound = 1,
    MilestoneNotFound = 2,
    InsufficientFunds = 3,
    Unauthorized = 4,
    CampaignNotActive = 5,
    MilestoneNotPending = 6,
    AlreadyVoted = 7,
    InvalidAmount = 8,
    CampaignEnded = 9,
}

pub trait CampaignContract {
    // Initialize the contract
    fn initialize(env: Env, admin: Address) -> Result<(), ChainFundError>;

    // Create a new crowdfunding campaign
    fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        goal_amount: i128,
        milestones: Vec<Milestone>,
        duration_days: u32,
    ) -> Result<u64, ChainFundError>;

    // Back a campaign
    fn back_campaign(
        env: Env,
        backer: Address,
        campaign_id: u64,
        amount: i128,
    ) -> Result<(), ChainFundError>;

    // Complete a milestone and release funds
    fn complete_milestone(
        env: Env,
        campaign_id: u64,
        milestone_id: u32,
    ) -> Result<(), ChainFundError>;

    // Get campaign details
    fn get_campaign(env: Env, campaign_id: u64) -> Result<Campaign, ChainFundError>;

    // Get total campaigns count
    fn get_campaign_count(env: Env) -> u64;
}

pub struct CampaignContractImpl;

#[contractimpl]
impl CampaignContract for CampaignContractImpl {
    // Initialize the contract
    fn initialize(env: Env, admin: Address) -> Result<(), ChainFundError> {
        if env.storage().instance().has(&symbol_short!("admin")) {
            return Err(ChainFundError::Unauthorized);
        }

        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("campaign_count"), &0u64);

        Ok(())
    }

    // Create a new crowdfunding campaign
    fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        goal_amount: i128,
        milestones: Vec<Milestone>,
        duration_days: u32,
    ) -> Result<u64, ChainFundError> {
        creator.require_auth();

        if goal_amount <= 0 {
            return Err(ChainFundError::InvalidAmount);
        }

        let campaign_count: u64 = env.storage().instance().get(&symbol_short!("campaign_count")).unwrap_or(0);
        let new_campaign_id = campaign_count + 1;

        let current_time = env.ledger().timestamp();
        let end_date = current_time + (duration_days as u64 * 24 * 60 * 60); // Convert days to seconds

        let campaign = Campaign {
            id: new_campaign_id,
            creator: creator.clone(),
            title,
            description,
            goal_amount,
            total_backed: 0,
            status: CampaignStatus::Active,
            milestones,
            backers: Map::new(&env),
            created_at: current_time,
            end_date,
        };

        env.storage().persistent().set(&new_campaign_id, &campaign);
        env.storage().instance().set(&symbol_short!("campaign_count"), &new_campaign_id);

        // Emit event
        env.events().publish(
            (symbol_short!("campaign"), symbol_short!("created")),
            (new_campaign_id, creator)
        );

        Ok(new_campaign_id)
    }

    // Back a campaign
    fn back_campaign(
        env: Env,
        backer: Address,
        campaign_id: u64,
        amount: i128,
    ) -> Result<(), ChainFundError> {
        backer.require_auth();

        if amount <= 0 {
            return Err(ChainFundError::InvalidAmount);
        }

        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ChainFundError::CampaignNotFound)?;

        if campaign.status != CampaignStatus::Active {
            return Err(ChainFundError::CampaignNotActive);
        }

        let current_time = env.ledger().timestamp();
        if current_time > campaign.end_date {
            return Err(ChainFundError::CampaignEnded);
        }

        // Transfer tokens from backer to contract
        env.invoke_contract::<()>(
            &env.current_contract_address(),
            &symbol_short!("transfer"),
            (backer.clone(), env.current_contract_address(), amount).into_val(&env)
        );

        // Update backer info
        let backer_info = BackerInfo {
            amount,
            timestamp: current_time,
        };

        if let Some(existing_amount) = campaign.backers.get(backer.clone()) {
            let new_amount = existing_amount.amount + amount;
            campaign.backers.set(backer.clone(), BackerInfo {
                amount: new_amount,
                timestamp: current_time,
            });
        } else {
            campaign.backers.set(backer.clone(), backer_info);
        }

        campaign.total_backed += amount;

        // Check if campaign is now funded
        if campaign.total_backed >= campaign.goal_amount {
            campaign.status = CampaignStatus::Funded;
        }

        env.storage().persistent().set(&campaign_id, &campaign);

        // Emit event
        env.events().publish(
            (symbol_short!("campaign"), symbol_short!("backed")),
            (campaign_id, backer, amount)
        );

        Ok(())
    }

    // Complete a milestone and release funds
    fn complete_milestone(
        env: Env,
        campaign_id: u64,
        milestone_id: u32,
    ) -> Result<(), ChainFundError> {
        let admin: Address = env.storage().instance().get(&symbol_short!("admin"))
            .ok_or(ChainFundError::Unauthorized)?;

        admin.require_auth();

        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ChainFundError::CampaignNotFound)?;

        let milestone_index = campaign.milestones.iter().position(|m| m.id == milestone_id)
            .ok_or(ChainFundError::MilestoneNotFound)?;

        let milestone = &mut campaign.milestones[milestone_index];

        if milestone.status != MilestoneStatus::Active {
            return Err(ChainFundError::MilestoneNotPending);
        }

        // Release funds to creator
        env.invoke_contract::<()>(
            &env.current_contract_address(),
            &symbol_short!("transfer"),
            (env.current_contract_address(), campaign.creator.clone(), milestone.amount).into_val(&env)
        );

        milestone.status = MilestoneStatus::Completed;

        env.storage().persistent().set(&campaign_id, &campaign);

        // Emit event
        env.events().publish(
            (symbol_short!("milestone"), symbol_short!("completed")),
            (campaign_id, milestone_id)
        );

        Ok(())
    }

    // Get campaign details
    fn get_campaign(env: Env, campaign_id: u64) -> Result<Campaign, ChainFundError> {
        env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ChainFundError::CampaignNotFound)
    }

    // Get total campaigns count
    fn get_campaign_count(env: Env) -> u64 {
        env.storage().instance().get(&symbol_short!("campaign_count")).unwrap_or(0)
    }
}