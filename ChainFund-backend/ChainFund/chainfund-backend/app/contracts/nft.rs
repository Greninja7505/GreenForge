#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype,
    Address, Env, Symbol, String, symbol_short,
    panic_with_error
};

use crate::campaign::ChainFundError;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SkillNFT {
    pub token_id: u64,
    pub owner: Address,
    pub skill_score: u32,
    pub skill_level: String,
    pub minted_at: u64,
}

pub trait NFTContract {
    // Mint a skill NFT
    fn mint_skill_nft(
        env: Env,
        recipient: Address,
        skill_score: u32,
        skill_level: String,
    ) -> Result<u64, ChainFundError>;

    // Get skill NFT details
    fn get_skill_nft(env: Env, token_id: u64) -> Result<SkillNFT, ChainFundError>;

    // Get total NFTs minted
    fn get_nft_count(env: Env) -> u64;
}

pub struct NFTContractImpl;

#[contractimpl]
impl NFTContract for NFTContractImpl {
    // Mint a skill NFT
    fn mint_skill_nft(
        env: Env,
        recipient: Address,
        skill_score: u32,
        skill_level: String,
    ) -> Result<u64, ChainFundError> {
        let admin: Address = env.storage().instance().get(&symbol_short!("admin"))
            .ok_or(ChainFundError::Unauthorized)?;

        admin.require_auth();

        let nft_count: u64 = env.storage().instance().get(&symbol_short!("nft_count")).unwrap_or(0);
        let new_token_id = nft_count + 1;

        let skill_nft = SkillNFT {
            token_id: new_token_id,
            owner: recipient.clone(),
            skill_score,
            skill_level,
            minted_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&new_token_id, &skill_nft);
        env.storage().instance().set(&symbol_short!("nft_count"), &new_token_id);

        // Emit event
        env.events().publish(
            (symbol_short!("nft"), symbol_short!("minted")),
            (new_token_id, recipient, skill_score)
        );

        Ok(new_token_id)
    }

    // Get skill NFT details
    fn get_skill_nft(env: Env, token_id: u64) -> Result<SkillNFT, ChainFundError> {
        env.storage().persistent()
            .get(&token_id)
            .ok_or(ChainFundError::CampaignNotFound) // Reuse error for simplicity
    }

    // Get total NFTs minted
    fn get_nft_count(env: Env) -> u64 {
        env.storage().instance().get(&symbol_short!("nft_count")).unwrap_or(0)
    }
}