#![no_std]

mod campaign;
mod voting;
mod nft;

use soroban_sdk::{contract, contractimpl};

use campaign::{CampaignContract, CampaignContractImpl, Campaign, Milestone, ChainFundError};
use voting::{VotingContract, VotingContractImpl};
use nft::{NFTContract, NFTContractImpl};

#[cfg(test)]
mod test;

#[contract]
pub struct ChainFundContract;

#[contractimpl]
impl ChainFundContract {
    // Campaign functions
    pub fn initialize(env: soroban_sdk::Env, admin: soroban_sdk::Address) -> Result<(), ChainFundError> {
        CampaignContractImpl::initialize(env, admin)
    }

    pub fn create_campaign(
        env: soroban_sdk::Env,
        creator: soroban_sdk::Address,
        title: soroban_sdk::String,
        description: soroban_sdk::String,
        goal_amount: i128,
        milestones: soroban_sdk::Vec<Milestone>,
        duration_days: u32,
    ) -> Result<u64, ChainFundError> {
        CampaignContractImpl::create_campaign(env, creator, title, description, goal_amount, milestones, duration_days)
    }

    pub fn back_campaign(
        env: soroban_sdk::Env,
        backer: soroban_sdk::Address,
        campaign_id: u64,
        amount: i128,
    ) -> Result<(), ChainFundError> {
        CampaignContractImpl::back_campaign(env, backer, campaign_id, amount)
    }

    pub fn complete_milestone(
        env: soroban_sdk::Env,
        campaign_id: u64,
        milestone_id: u32,
    ) -> Result<(), ChainFundError> {
        CampaignContractImpl::complete_milestone(env, campaign_id, milestone_id)
    }

    pub fn get_campaign(env: soroban_sdk::Env, campaign_id: u64) -> Result<Campaign, ChainFundError> {
        CampaignContractImpl::get_campaign(env, campaign_id)
    }

    pub fn get_campaign_count(env: soroban_sdk::Env) -> u64 {
        CampaignContractImpl::get_campaign_count(env)
    }

    // Voting functions
    pub fn vote_milestone(
        env: soroban_sdk::Env,
        voter: soroban_sdk::Address,
        campaign_id: u64,
        milestone_id: u32,
        approve: bool,
    ) -> Result<(), ChainFundError> {
        VotingContractImpl::vote_milestone(env, voter, campaign_id, milestone_id, approve)
    }

    // NFT functions
    pub fn mint_skill_nft(
        env: soroban_sdk::Env,
        recipient: soroban_sdk::Address,
        skill_score: u32,
        skill_level: soroban_sdk::String,
    ) -> Result<u64, ChainFundError> {
        NFTContractImpl::mint_skill_nft(env, recipient, skill_score, skill_level)
    }

    pub fn get_skill_nft(env: soroban_sdk::Env, token_id: u64) -> Result<nft::SkillNFT, ChainFundError> {
        NFTContractImpl::get_skill_nft(env, token_id)
    }

    pub fn get_nft_count(env: soroban_sdk::Env) -> u64 {
        NFTContractImpl::get_nft_count(env)
    }
}