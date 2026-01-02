#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String, symbol_short};

#[contract]
pub struct RewardToken;

#[contractimpl]
impl RewardToken {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String) {
        // Require admin authorization
        admin.require_auth();

        // Store admin status
        env.storage().instance().set(&admin, &true);

        // Store token metadata
        env.storage().instance().set(&symbol_short!("name"), &name);
        env.storage().instance().set(&symbol_short!("symbol"), &symbol);

        // Initialize total supply
        env.storage().instance().set(&symbol_short!("supply"), &0i128);
    }

    pub fn mint_reward(env: Env, admin: Address, to: Address, amount: i128) -> bool {
        // Verify admin authorization
        admin.require_auth();
        if !env.storage().instance().get::<Address, bool>(&admin).unwrap_or(false) {
            return false;
        }

        // Update balance
        let balances = env.storage().persistent();
        let current = balances.get::<Address, i128>(&to).unwrap_or(0);
        balances.set(&to, &(current + amount));

        // Update total supply
        let total = env.storage().instance().get::<_, i128>(&symbol_short!("supply")).unwrap_or(0);
        env.storage().instance().set(&symbol_short!("supply"), &(total + amount));

        // Emit minting event with proper topics
        env.events().publish(
            (symbol_short!("MINT"), to),
            amount
        );
        true
    }

    pub fn get_balance(env: Env, account: Address) -> i128 {
        env.storage().persistent().get(&account).unwrap_or(0)
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> bool {
        // Verify authorization
        from.require_auth();

        // Get current balances
        let balances = env.storage().persistent();
        let from_balance = balances.get::<Address, i128>(&from).unwrap_or(0);
        let to_balance = balances.get::<Address, i128>(&to).unwrap_or(0);

        // Verify sufficient balance
        if from_balance < amount {
            return false;
        }

        // Update balances
        balances.set(&from, &(from_balance - amount));
        balances.set(&to, &(to_balance + amount));

        // Emit transfer event with proper topics
        env.events().publish(
            (symbol_short!("TRANSFER"), from, to),
            amount
        );
        true
    }

    pub fn get_metadata(env: Env) -> (String, String, i128) {
        (
            env.storage().instance().get(&symbol_short!("name")).unwrap_or(String::from_str(&env, "")),
            env.storage().instance().get(&symbol_short!("symbol")).unwrap_or(String::from_str(&env, "")),
            env.storage().instance().get(&symbol_short!("supply")).unwrap_or(0)
        )
    }

    pub fn get_total_supply(env: Env) -> i128 {
        env.storage().instance().get(&symbol_short!("supply")).unwrap_or(0)
    }
}