//! # ChainFund SoulBound Token (SBT) Contract
//! 
//! Non-transferable reputation tokens for the ChainFund crowdfunding platform.
//! 
//! ## Features:
//! - Non-transferable tokens (SoulBound)
//! - Role-based reputation (Creator, Backer, Developer, etc.)
//! - Revocable by admin in case of fraud
//! - On-chain proof of participation
//! - Reputation scoring based on roles held

#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Address, Env, String, Symbol, Vec,
    symbol_short,
};

// ============================================================================
// ERRORS
// ============================================================================

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum SbtError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    InvalidInput = 4,
    SbtNotFound = 5,
    SbtAlreadyExists = 6,
    SbtRevoked = 7,
    TransferNotAllowed = 8,
    InvalidRole = 9,
    CampaignNotFound = 10,
}

// ============================================================================
// DATA TYPES
// ============================================================================

/// SBT Role Types - Different types of reputation
#[contracttype]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtRole {
    Creator = 0,         // Successfully launched and completed a campaign
    Backer = 1,          // Funded at least one successful project
    SuperBacker = 2,     // Funded 5+ successful projects
    Developer = 3,       // Contributed code to projects
    Designer = 4,        // Contributed design work
    Tester = 5,          // Contributed testing
    Mentor = 6,          // Provided mentorship
    Validator = 7,       // Active community voter
    Ambassador = 8,      // Community leader
    Pioneer = 9,         // Early adopter
}

impl SbtRole {
    /// Get reputation score for each role
    pub fn reputation_value(&self) -> u32 {
        match self {
            SbtRole::Creator => 100,
            SbtRole::Backer => 10,
            SbtRole::SuperBacker => 50,
            SbtRole::Developer => 30,
            SbtRole::Designer => 25,
            SbtRole::Tester => 20,
            SbtRole::Mentor => 40,
            SbtRole::Validator => 15,
            SbtRole::Ambassador => 75,
            SbtRole::Pioneer => 60,
        }
    }
}

/// SBT Token Data
#[contracttype]
#[derive(Clone)]
pub struct SoulBoundToken {
    pub id: u64,
    pub owner: Address,
    pub role: SbtRole,
    pub campaign_id: u32,                    // Associated campaign (0 for general awards)
    pub metadata_uri: String,                // IPFS URI for additional metadata
    pub issued_at: u64,                      // Timestamp
    pub issued_by: Address,                  // Who issued this SBT
    pub is_active: bool,                     // Can be revoked
    pub revoked_at: u64,                     // Timestamp if revoked
    pub revocation_reason: String,           // Why it was revoked
}

/// User's SBT Collection
#[contracttype]
#[derive(Clone)]
pub struct UserProfile {
    pub address: Address,
    pub tokens: Vec<u64>,                    // List of SBT token IDs
    pub total_reputation: u32,               // Sum of all active SBT reputation values
    pub roles_held: Vec<SbtRole>,            // Unique roles this user has
    pub first_token_at: u64,                 // When they got their first SBT
    pub last_token_at: u64,                  // When they got their most recent SBT
}

/// Contract Configuration
#[contracttype]
#[derive(Clone)]
pub struct SbtConfig {
    pub admin: Address,
    pub core_contract: Address,              // ChainFund core contract address
    pub name: String,                        // Token name
    pub symbol: String,                      // Token symbol
    pub total_supply: u64,                   // Total SBTs ever minted
    pub active_supply: u64,                  // Currently active (non-revoked) SBTs
    pub is_paused: bool,
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const CONFIG_KEY: Symbol = symbol_short!("CONFIG");
const NEXT_ID_KEY: Symbol = symbol_short!("NEXT_ID");

// ============================================================================
// CONTRACT IMPLEMENTATION
// ============================================================================

#[contract]
pub struct ChainFundSbtContract;

#[contractimpl]
impl ChainFundSbtContract {
    
    // ========================================================================
    // INITIALIZATION
    // ========================================================================
    
    /// Initialize the SBT contract
    pub fn initialize(
        env: Env,
        admin: Address,
        core_contract: Address,
        name: String,
        symbol: String,
    ) -> Result<(), SbtError> {
        admin.require_auth();
        
        if env.storage().instance().has(&CONFIG_KEY) {
            return Err(SbtError::AlreadyInitialized);
        }
        
        let config = SbtConfig {
            admin,
            core_contract,
            name,
            symbol,
            total_supply: 0,
            active_supply: 0,
            is_paused: false,
        };
        
        env.storage().instance().set(&CONFIG_KEY, &config);
        env.storage().instance().set(&NEXT_ID_KEY, &1u64);
        
        env.events().publish(
            (symbol_short!("init"),),
            env.ledger().timestamp(),
        );
        
        Ok(())
    }
    
    // ========================================================================
    // MINTING
    // ========================================================================
    
    /// Mint a new SBT to a user
    /// Can only be called by admin or core contract
    pub fn mint(
        env: Env,
        caller: Address,
        recipient: Address,
        role: SbtRole,
        campaign_id: u32,
        metadata_uri: String,
    ) -> Result<u64, SbtError> {
        caller.require_auth();
        
        let mut config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        // Verify caller is admin or core contract
        if caller != config.admin && caller != config.core_contract {
            return Err(SbtError::Unauthorized);
        }
        
        if config.is_paused {
            return Err(SbtError::InvalidInput);
        }
        
        // Get next token ID
        let token_id: u64 = env.storage().instance()
            .get(&NEXT_ID_KEY)
            .unwrap_or(1);
        
        // Check if user already has this role for this campaign
        let user_key = Self::user_key(&recipient);
        let mut profile: UserProfile = env.storage().persistent()
            .get(&user_key)
            .unwrap_or(UserProfile {
                address: recipient.clone(),
                tokens: Vec::new(&env),
                total_reputation: 0,
                roles_held: Vec::new(&env),
                first_token_at: 0,
                last_token_at: 0,
            });
        
        // Don't mint duplicate role+campaign SBTs
        for existing_id in profile.tokens.iter() {
            let existing: SoulBoundToken = env.storage().persistent()
                .get(&existing_id)
                .unwrap();
            if existing.role == role && existing.campaign_id == campaign_id && existing.is_active {
                return Err(SbtError::SbtAlreadyExists);
            }
        }
        
        // Create the SBT
        let sbt = SoulBoundToken {
            id: token_id,
            owner: recipient.clone(),
            role: role.clone(),
            campaign_id,
            metadata_uri,
            issued_at: env.ledger().timestamp(),
            issued_by: caller.clone(),
            is_active: true,
            revoked_at: 0,
            revocation_reason: String::from_str(&env, ""),
        };
        
        // Store SBT
        env.storage().persistent().set(&token_id, &sbt);
        
        // Update user profile
        profile.tokens.push_back(token_id);
        profile.total_reputation += role.reputation_value();
        
        // Add role if not already held
        let mut has_role = false;
        for r in profile.roles_held.iter() {
            if r == role {
                has_role = true;
                break;
            }
        }
        if !has_role {
            profile.roles_held.push_back(role.clone());
        }
        
        if profile.first_token_at == 0 {
            profile.first_token_at = env.ledger().timestamp();
        }
        profile.last_token_at = env.ledger().timestamp();
        
        env.storage().persistent().set(&user_key, &profile);
        
        // Update config
        config.total_supply += 1;
        config.active_supply += 1;
        env.storage().instance().set(&CONFIG_KEY, &config);
        env.storage().instance().set(&NEXT_ID_KEY, &(token_id + 1));
        
        // Emit event
        env.events().publish(
            (symbol_short!("mint"), recipient),
            (token_id, role as u32, campaign_id),
        );
        
        Ok(token_id)
    }
    
    /// Batch mint multiple SBTs (for campaign completion)
    pub fn batch_mint(
        env: Env,
        caller: Address,
        recipients: Vec<(Address, SbtRole)>,
        campaign_id: u32,
        metadata_uri: String,
    ) -> Result<Vec<u64>, SbtError> {
        caller.require_auth();
        
        let config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        if caller != config.admin && caller != config.core_contract {
            return Err(SbtError::Unauthorized);
        }
        
        let mut minted_ids = Vec::new(&env);
        
        for (recipient, role) in recipients.iter() {
            match Self::mint(
                env.clone(),
                caller.clone(),
                recipient.clone(),
                role,
                campaign_id,
                metadata_uri.clone(),
            ) {
                Ok(id) => minted_ids.push_back(id),
                Err(_) => continue, // Skip duplicates
            }
        }
        
        Ok(minted_ids)
    }
    
    // ========================================================================
    // REVOCATION (Admin only)
    // ========================================================================
    
    /// Revoke an SBT (in case of fraud or rule violation)
    pub fn revoke(
        env: Env,
        admin: Address,
        token_id: u64,
        reason: String,
    ) -> Result<(), SbtError> {
        admin.require_auth();
        
        let mut config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        if admin != config.admin {
            return Err(SbtError::Unauthorized);
        }
        
        let mut sbt: SoulBoundToken = env.storage().persistent()
            .get(&token_id)
            .ok_or(SbtError::SbtNotFound)?;
        
        if !sbt.is_active {
            return Err(SbtError::SbtRevoked);
        }
        
        // Revoke the SBT
        sbt.is_active = false;
        sbt.revoked_at = env.ledger().timestamp();
        sbt.revocation_reason = reason;
        
        env.storage().persistent().set(&token_id, &sbt);
        
        // Update user profile
        let user_key = Self::user_key(&sbt.owner);
        let mut profile: UserProfile = env.storage().persistent()
            .get(&user_key)
            .ok_or(SbtError::SbtNotFound)?;
        
        profile.total_reputation = profile.total_reputation
            .saturating_sub(sbt.role.reputation_value());
        
        env.storage().persistent().set(&user_key, &profile);
        
        // Update supply
        config.active_supply = config.active_supply.saturating_sub(1);
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        env.events().publish(
            (symbol_short!("revoke"), token_id),
            sbt.owner,
        );
        
        Ok(())
    }
    
    // ========================================================================
    // QUERY FUNCTIONS
    // ========================================================================
    
    /// Get SBT details by ID
    pub fn get_sbt(env: Env, token_id: u64) -> Result<SoulBoundToken, SbtError> {
        env.storage().persistent()
            .get(&token_id)
            .ok_or(SbtError::SbtNotFound)
    }
    
    /// Get user profile
    pub fn get_profile(env: Env, user: Address) -> Result<UserProfile, SbtError> {
        let user_key = Self::user_key(&user);
        env.storage().persistent()
            .get(&user_key)
            .ok_or(SbtError::SbtNotFound)
    }
    
    /// Get user's total reputation score
    pub fn get_reputation(env: Env, user: Address) -> u32 {
        let user_key = Self::user_key(&user);
        let profile: Option<UserProfile> = env.storage().persistent().get(&user_key);
        
        match profile {
            Some(p) => p.total_reputation,
            None => 0,
        }
    }
    
    /// Check if user has a specific role
    pub fn has_role(env: Env, user: Address, role: SbtRole) -> bool {
        let user_key = Self::user_key(&user);
        let profile: Option<UserProfile> = env.storage().persistent().get(&user_key);
        
        match profile {
            Some(p) => p.roles_held.iter().any(|r| r == role),
            None => false,
        }
    }
    
    /// Get all SBTs for a user
    pub fn get_user_sbts(env: Env, user: Address) -> Vec<SoulBoundToken> {
        let user_key = Self::user_key(&user);
        let profile: Option<UserProfile> = env.storage().persistent().get(&user_key);
        
        let mut sbts = Vec::new(&env);
        
        if let Some(p) = profile {
            for token_id in p.tokens.iter() {
                if let Some(sbt) = env.storage().persistent().get(&token_id) {
                    sbts.push_back(sbt);
                }
            }
        }
        
        sbts
    }
    
    /// Get SBTs by campaign
    pub fn get_campaign_sbts(
        env: Env,
        campaign_id: u32,
    ) -> Vec<SoulBoundToken> {
        // Note: This is a simplified implementation
        // In production, you'd want an index for this
        let mut sbts = Vec::new(&env);
        
        let config: Option<SbtConfig> = env.storage().instance().get(&CONFIG_KEY);
        if let Some(cfg) = config {
            for id in 1..=cfg.total_supply {
                if let Some(sbt) = env.storage().persistent().get::<u64, SoulBoundToken>(&id) {
                    if sbt.campaign_id == campaign_id {
                        sbts.push_back(sbt);
                    }
                }
            }
        }
        
        sbts
    }
    
    /// Get contract config
    pub fn get_config(env: Env) -> Result<SbtConfig, SbtError> {
        env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)
    }
    
    // ========================================================================
    // SBT TRANSFER PREVENTION (Core SBT Feature)
    // ========================================================================
    
    /// Transfer is not allowed for SBTs
    /// This function exists to explicitly reject transfers
    pub fn transfer(
        _env: Env,
        _from: Address,
        _to: Address,
        _token_id: u64,
    ) -> Result<(), SbtError> {
        // SoulBound tokens cannot be transferred!
        Err(SbtError::TransferNotAllowed)
    }
    
    /// Approve is not allowed for SBTs
    pub fn approve(
        _env: Env,
        _owner: Address,
        _spender: Address,
        _token_id: u64,
    ) -> Result<(), SbtError> {
        // SoulBound tokens cannot be approved for transfer!
        Err(SbtError::TransferNotAllowed)
    }
    
    // ========================================================================
    // ADMIN FUNCTIONS
    // ========================================================================
    
    /// Update core contract address
    pub fn set_core_contract(
        env: Env,
        admin: Address,
        new_core: Address,
    ) -> Result<(), SbtError> {
        admin.require_auth();
        
        let mut config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        if admin != config.admin {
            return Err(SbtError::Unauthorized);
        }
        
        config.core_contract = new_core;
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        Ok(())
    }
    
    /// Pause/unpause minting
    pub fn set_paused(
        env: Env,
        admin: Address,
        paused: bool,
    ) -> Result<(), SbtError> {
        admin.require_auth();
        
        let mut config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        if admin != config.admin {
            return Err(SbtError::Unauthorized);
        }
        
        config.is_paused = paused;
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        Ok(())
    }
    
    /// Transfer admin (2-step process would be better in production)
    pub fn set_admin(
        env: Env,
        current_admin: Address,
        new_admin: Address,
    ) -> Result<(), SbtError> {
        current_admin.require_auth();
        
        let mut config: SbtConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(SbtError::NotInitialized)?;
            
        if current_admin != config.admin {
            return Err(SbtError::Unauthorized);
        }
        
        config.admin = new_admin.clone();
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        env.events().publish(
            (symbol_short!("admin"),),
            new_admin,
        );
        
        Ok(())
    }
    
    // ========================================================================
    // HELPERS
    // ========================================================================
    
    fn user_key(user: &Address) -> Symbol {
        symbol_short!("USER_")
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_role_reputation() {
        assert_eq!(SbtRole::Creator.reputation_value(), 100);
        assert_eq!(SbtRole::Backer.reputation_value(), 10);
        assert_eq!(SbtRole::SuperBacker.reputation_value(), 50);
    }
}
