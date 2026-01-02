#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, symbol_short, Symbol, Vec, Map, Bytes};

#[derive(Clone)]
#[contract]
pub struct CrossChainBridge;

#[derive(Clone)]
pub enum ChainId {
    Stellar,
    Ethereum,
    // Add more chains as needed
}

#[derive(Clone)]
pub struct BridgeConfig {
    admin: Address,
    validators: Vec<Address>,
    required_confirmations: u32,
    supported_tokens: Map<Symbol, TokenConfig>,
    chain_nonces: Map<ChainId, u64>,
}

#[derive(Clone)]
pub struct TokenConfig {
    name: Symbol,
    symbol: Symbol,
    decimals: u32,
    native_chain: ChainId,
    native_address: Bytes,  // Token address on native chain
    wrapped_address: Address, // Wrapped token address on Stellar
    min_transfer: i128,
    max_transfer: i128,
}

#[derive(Clone)]
pub enum RequestStatus {
    Pending,
    Confirmed,
    Executed,
    Failed
}

#[derive(Clone)]
pub struct BridgeRequest {
    request_id: u64,
    from_chain: ChainId,
    to_chain: ChainId,
    token_symbol: Symbol,
    amount: i128,
    sender: Address,
    recipient: Bytes,
    status: RequestStatus,
    confirmations: Vec<Address>,
    nonce: u64,
}

#[contractimpl]
impl CrossChainBridge {
    pub fn initialize(
        env: Env,
        admin: Address,
        initial_validators: Vec<Address>,
        required_confirmations: u32
    ) {
        admin.require_auth();
        
        let config = BridgeConfig {
            admin: admin.clone(),
            validators: initial_validators,
            required_confirmations,
            supported_tokens: Map::new(&env),
            chain_nonces: Map::new(&env),
        };
        
        env.storage().instance().set(&Symbol::short("config"), &config);
    }

    // Register a new token for bridging
    pub fn register_token(
        env: Env,
        admin: Address,
        name: Symbol,
        symbol: Symbol,
        decimals: u32,
        native_chain: ChainId,
        native_address: Bytes,
        wrapped_address: Address,
        min_transfer: i128,
        max_transfer: i128,
    ) -> bool {
        admin.require_auth();
        let mut config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        require!(config.admin == admin, "Not authorized");

        let token_config = TokenConfig {
            name,
            symbol: symbol.clone(),
            decimals,
            native_chain,
            native_address,
            wrapped_address,
            min_transfer,
            max_transfer,
        };

        config.supported_tokens.set(&symbol, &token_config);
        env.storage().instance().set(&Symbol::short("config"), &config);

        // Emit token registration event
        env.events().publish(
            (Symbol::short("TOKEN_REGISTERED"), symbol),
            token_config
        );

        true
    }

    // Initiate a cross-chain transfer
    pub fn initiate_transfer(
        env: Env,
        sender: Address,
        token_symbol: Symbol,
        amount: i128,
        to_chain: ChainId,
        recipient: Bytes,
    ) -> u64 {
        sender.require_auth();
        
        let config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        let token_config = config.supported_tokens.get(&token_symbol).expect("Token not supported");
        
        // Validate transfer amount
        require!(amount >= token_config.min_transfer, "Amount below minimum");
        require!(amount <= token_config.max_transfer, "Amount above maximum");

        // Get and increment chain nonce
        let nonce = config.chain_nonces.get(&to_chain).unwrap_or(0);
        let mut updated_config = config.clone();
        updated_config.chain_nonces.set(&to_chain, &(nonce + 1));
        
        // Create bridge request
        let request_id = env.storage().instance().get::<_, u64>(&Symbol::short("next_request_id")).unwrap_or(1);
        let request = BridgeRequest {
            request_id,
            from_chain: ChainId::Stellar,
            to_chain,
            token_symbol: token_symbol.clone(),
            amount,
            sender: sender.clone(),
            recipient,
            status: RequestStatus::Pending,
            confirmations: Vec::new(&env),
            nonce,
        };

        // Store request and update config
        env.storage().persistent().set(&request_id, &request);
        env.storage().instance().set(&Symbol::short("next_request_id"), &(request_id + 1));
        env.storage().instance().set(&Symbol::short("config"), &updated_config);

        // Lock tokens in bridge
        env.events().publish(
            (Symbol::short("TRANSFER_INITIATED"), sender, token_symbol),
            (amount, request_id)
        );

        request_id
    }

    // Validator confirms a bridge request
    pub fn confirm_transfer(
        env: Env,
        validator: Address,
        request_id: u64
    ) -> bool {
        validator.require_auth();
        
        let config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        require!(config.validators.contains(&validator), "Not a validator");
        
        let mut request: BridgeRequest = env.storage().persistent().get(&request_id).expect("Request not found");
        require!(matches!(request.status, RequestStatus::Pending), "Invalid request status");
        require!(!request.confirmations.contains(&validator), "Already confirmed");
        
        request.confirmations.push_back(validator.clone());
        
        // Check if enough confirmations
        if request.confirmations.len() >= config.required_confirmations {
            request.status = RequestStatus::Confirmed;
            
            // Emit confirmation event
            env.events().publish(
                (Symbol::short("TRANSFER_CONFIRMED"), request_id),
                validator
            );
        }
        
        env.storage().persistent().set(&request_id, &request);
        true
    }

    // Execute confirmed transfer
    pub fn execute_transfer(
        env: Env,
        executor: Address,
        request_id: u64
    ) -> bool {
        executor.require_auth();
        
        let mut request: BridgeRequest = env.storage().persistent().get(&request_id).expect("Request not found");
        require!(matches!(request.status, RequestStatus::Confirmed), "Transfer not confirmed");
        
        let config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        let token_config = config.supported_tokens.get(&request.token_symbol).expect("Token not supported");

        // Execute the transfer based on the target chain
        match request.to_chain {
            ChainId::Stellar => {
                // Mint wrapped tokens on Stellar
                env.events().publish(
                    (Symbol::short("MINT_WRAPPED_TOKEN"), token_config.wrapped_address),
                    (request.amount, request.recipient)
                );
            },
            ChainId::Ethereum => {
                // Release tokens on Ethereum
                env.events().publish(
                    (Symbol::short("RELEASE_NATIVE_TOKEN"), request.token_symbol),
                    (request.amount, request.recipient)
                );
            }
        }

        request.status = RequestStatus::Executed;
        env.storage().persistent().set(&request_id, &request);

        // Emit execution event
        env.events().publish(
            (Symbol::short("TRANSFER_EXECUTED"), request_id),
            executor
        );

        true
    }

    // Query functions
    pub fn get_request(env: Env, request_id: u64) -> BridgeRequest {
        env.storage().persistent().get(&request_id).expect("Request not found")
    }

    pub fn get_token_config(env: Env, symbol: Symbol) -> TokenConfig {
        let config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        config.supported_tokens.get(&symbol).expect("Token not found")
    }

    pub fn is_validator(env: Env, address: Address) -> bool {
        let config: BridgeConfig = env.storage().instance().get(&Symbol::short("config")).unwrap();
        config.validators.contains(&address)
    }
}