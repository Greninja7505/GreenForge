#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, Symbol, Map, symbol_short,
    panic_with_error
};

use crate::campaign::{Campaign, Milestone, MilestoneStatus, ChainFundError};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Vote {
    pub voter: Address,
    pub milestone_id: u32,
    pub approve: bool,
    pub timestamp: u64,
}

pub trait VotingContract {
    // Vote on a milestone
    fn vote_milestone(
        env: Env,
        voter: Address,
        campaign_id: u64,
        milestone_id: u32,
        approve: bool,
    ) -> Result<(), ChainFundError>;
}

pub struct VotingContractImpl;

#[contractimpl]
impl VotingContract for VotingContractImpl {
    // Vote on a milestone
    fn vote_milestone(
        env: Env,
        voter: Address,
        campaign_id: u64,
        milestone_id: u32,
        approve: bool,
    ) -> Result<(), ChainFundError> {
        voter.require_auth();

        let mut campaign: Campaign = env.storage().persistent()
            .get(&campaign_id)
            .ok_or(ChainFundError::CampaignNotFound)?;

        // Check if voter backed the campaign
        if !campaign.backers.contains_key(voter.clone()) {
            return Err(ChainFundError::Unauthorized);
        }

        // Find the milestone
        let milestone_index = campaign.milestones.iter().position(|m| m.id == milestone_id)
            .ok_or(ChainFundError::MilestoneNotFound)?;

        let mut milestone = &mut campaign.milestones[milestone_index];

        if milestone.status != MilestoneStatus::Pending {
            return Err(ChainFundError::MilestoneNotPending);
        }

        // Check if already voted (simplified - in production you'd track votes per user)
        let vote_key = (campaign_id, milestone_id, voter.clone());
        if env.storage().persistent().has(&vote_key) {
            return Err(ChainFundError::AlreadyVoted);
        }

        // Record vote
        let vote = Vote {
            voter: voter.clone(),
            milestone_id,
            approve,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&vote_key, &vote);

        // Update milestone votes
        if approve {
            milestone.votes_for += 1;
        } else {
            milestone.votes_against += 1;
        }

        // Check if milestone should be approved (simple majority)
        let total_votes = milestone.votes_for + milestone.votes_against;
        if total_votes >= 3 { // Minimum votes required
            if milestone.votes_for > milestone.votes_against {
                milestone.status = MilestoneStatus::Active;
            } else {
                milestone.status = MilestoneStatus::Rejected;
            }
        }

        env.storage().persistent().set(&campaign_id, &campaign);

        // Emit event
        env.events().publish(
            (symbol_short!("milestone"), symbol_short!("voted")),
            (campaign_id, milestone_id, voter, approve)
        );

        Ok(())
    }
}