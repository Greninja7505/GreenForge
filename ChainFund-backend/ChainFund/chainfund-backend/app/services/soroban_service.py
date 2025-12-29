"""
Stellar SDK integration for ChainFund
Replaces Web3.py with Stellar SDK for blockchain operations
"""

import os
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime
import logging

try:
    from stellar_sdk import Server, Keypair, TransactionBuilder, Network, SorobanServer
    from stellar_sdk import Asset, Account, Claimant
    from stellar_sdk.exceptions import NotFoundError, BadRequestError
except ImportError:
    print("Warning: stellar-sdk not installed. Install with: pip install stellar-sdk")
    stellar_sdk_available = False
else:
    stellar_sdk_available = True

logger = logging.getLogger(__name__)

class StellarService:
    """Stellar blockchain service for ChainFund operations"""

    def __init__(self):
        if not stellar_sdk_available:
            raise ImportError("stellar-sdk is required for Stellar operations")

        # Network configuration
        self.network_passphrase = os.getenv("STELLAR_NETWORK_PASSPHRASE", "Test SDF Network ; September 2015")
        self.horizon_url = os.getenv("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")

        # Contract configuration
        self.contract_id = os.getenv("CHAINFUND_CONTRACT_ID")
        self.admin_secret = os.getenv("STELLAR_ADMIN_SECRET")

        # Initialize server
        self.server = Server(horizon_url=self.horizon_url)

        # Initialize Soroban server for contract interactions
        self.soroban_server = SorobanServer(
            server_url=f"{self.horizon_url}/soroban/rpc",
            client=None  # Will use default client
        )

        # Initialize contract IDs
        self.project_funding_id = os.getenv("PROJECT_FUNDING_CONTRACT_ID", self.contract_id)
        self.reward_token_id = os.getenv("REWARD_TOKEN_CONTRACT_ID")
        
    async def deploy_project_contract(self, project_id: str, initial_balance: str) -> str:
        """Deploy or update project funding contract with donation balance"""
        try:
            # Get admin keypair for deployment
            admin_keypair = Keypair.from_secret(self.admin_secret)
            
            # Get the project funding WASM
            with open("app/contracts/project_funding.wasm", "rb") as f:
                contract_wasm = f.read()

            # Install contract code if not already installed
            install_result = await self.soroban_server.upload_contract_wasm(contract_wasm)
            wasm_id = install_result.contract_id
            
            # Build contract deployment transaction
            account = await self.server.load_account(admin_keypair.public_key)
            transaction = (
                TransactionBuilder(
                    source_account=account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100000,  # Adjust as needed
                )
                .append_deploy_contract_op(
                    contract_id=self.project_funding_id or wasm_id,
                    executable=wasm_id,
                    salt=project_id.encode(),  # Use project ID as salt
                )
                .append_invoke_contract_op(
                    contract_id=wasm_id,
                    function="initialize",
                    parameters=[
                        project_id,
                        admin_keypair.public_key,
                        initial_balance
                    ]
                )
                .build()
            )

            transaction.sign(admin_keypair)
            response = await self.soroban_server.send_transaction(transaction)
            
            if response.status == "SUCCESS":
                return response.contract_id
            else:
                raise Exception(f"Contract deployment failed: {response.status}")
                
        except Exception as e:
            logger.error(f"Error deploying contract: {str(e)}")
            raise

    async def get_contract_details(self, contract_id: str) -> Dict[str, Any]:
        """Get contract details including current balance"""
        try:
            # Query contract state
            result = await self.soroban_server.invoke_contract(
                contract_id=contract_id,
                function="get_details",
                parameters=[]  # No parameters needed
            )
            
            # Parse result into dictionary
            return {
                "balance": result.get("balance", "0"),
                "project_id": result.get("id"),
                "status": result.get("status"),
                "target": result.get("target"),
                "owner": result.get("owner")
            }
        except Exception as e:
            logger.error(f"Error getting contract details: {str(e)}")
            raise
        
    async def invoke_reward_token(self, method: str, args: List[Any], source_account: str) -> Dict[str, Any]:
        """Invoke reward token contract method"""
        try:
            if not self.reward_token_id:
                raise ValueError("Reward token contract ID not configured")
                
            # Build and submit the contract invocation
            response = await self.soroban_server.invoke_contract_function(
                contract_id=self.reward_token_id,
                function_name=method,
                parameters=args,
                source_account=source_account
            )
            
            return {"success": True, "result": response}
        except Exception as e:
            logger.error(f"Error invoking reward token contract: {str(e)}")
            return {"success": False, "error": str(e)}
            
    async def mint_reward_tokens(self, to_address: str, amount: int, source_account: str) -> Dict[str, Any]:
        """Mint reward tokens to an address"""
        try:
            return await self.invoke_reward_token(
                "mint_reward",
                [source_account, to_address, amount],
                source_account
            )
        except Exception as e:
            logger.error(f"Error minting reward tokens: {str(e)}")
            return {"success": False, "error": str(e)}
            
    async def get_reward_balance(self, account: str) -> Dict[str, Any]:
        """Get reward token balance for an account"""
        try:
            return await self.invoke_reward_token(
                "get_balance",
                [account],
                account
            )
        except Exception as e:
            logger.error(f"Error getting reward balance: {str(e)}")
            return {"success": False, "error": str(e)}

    async def get_account_info(self, public_key: str) -> Optional[Dict[str, Any]]:
        """Get account information from Stellar"""
        try:
            account = await asyncio.get_event_loop().run_in_executor(
                None, self.server.accounts().account_id(public_key).call
            )
            return {
                "id": account.id,
                "sequence": account.sequence,
                "balances": account.balances,
                "signers": account.signers,
                "data": account.data
            }
        except NotFoundError:
            return None
        except Exception as e:
            logger.error(f"Error getting account info: {e}")
            return None

    async def create_account(self, destination: str, starting_balance: str = "1") -> bool:
        """Create a new Stellar account"""
        try:
            if not self.admin_secret:
                raise ValueError("Admin secret key not configured")

            admin_keypair = Keypair.from_secret(self.admin_secret)
            admin_account = await asyncio.get_event_loop().run_in_executor(
                None, self.server.load_account, admin_keypair.public_key
            )

            transaction = (
                TransactionBuilder(
                    source_account=admin_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100
                )
                .append_create_account_op(
                    destination=destination,
                    starting_balance=starting_balance
                )
                .set_timeout(30)
                .build()
            )

            transaction.sign(admin_keypair)

            response = await asyncio.get_event_loop().run_in_executor(
                None, self.server.submit_transaction, transaction
            )

            return response["successful"]

        except Exception as e:
            logger.error(f"Error creating account: {e}")
            return False

    async def get_transaction_history(self, account_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get transaction history for an account"""
        try:
            transactions = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.server.transactions().for_account(account_id).limit(limit).call()
            )

            return [{
                "id": tx.id,
                "successful": tx.successful,
                "source_account": tx.source_account,
                "created_at": tx.created_at,
                "fee_charged": tx.fee_charged,
                "operation_count": tx.operation_count
            } for tx in transactions["_embedded"]["records"]]

        except Exception as e:
            logger.error(f"Error getting transaction history: {e}")
            return []

    async def deploy_campaign_contract(self, creator_address: str, goal_amount: int, milestone_count: int) -> Optional[str]:
        """Deploy a new campaign contract (placeholder for Soroban deployment)"""
        # This would deploy the ChainFund contract with campaign parameters
        # For now, return a mock contract address
        try:
            # In a real implementation, this would:
            # 1. Load the compiled WASM contract
            # 2. Create deployment transaction
            # 3. Submit to network
            # 4. Return contract ID

            # Mock implementation for demo
            import uuid
            contract_id = f"contract_{uuid.uuid4().hex[:16]}"

            logger.info(f"Mock deployed campaign contract: {contract_id} for creator {creator_address}")
            return contract_id

        except Exception as e:
            logger.error(f"Error deploying campaign contract: {e}")
            return None

    async def fund_campaign(self, backer_address: str, campaign_contract: str, amount: int) -> bool:
        """Fund a campaign by sending XLM to the contract"""
        try:
            if not self.admin_secret:
                raise ValueError("Admin secret key not configured")

            # Load backer account
            backer_keypair = Keypair.from_secret(backer_address)  # In practice, this would be handled differently
            backer_account = await asyncio.get_event_loop().run_in_executor(
                None, self.server.load_account, backer_keypair.public_key
            )

            # Create payment transaction
            transaction = (
                TransactionBuilder(
                    source_account=backer_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100
                )
                .append_payment_op(
                    destination=campaign_contract,
                    asset=Asset.native(),
                    amount=str(amount)
                )
                .set_timeout(30)
                .build()
            )

            transaction.sign(backer_keypair)

            response = await asyncio.get_event_loop().run_in_executor(
                None, self.server.submit_transaction, transaction
            )

            return response["successful"]

        except Exception as e:
            logger.error(f"Error funding campaign: {e}")
            return False

    async def mint_skill_nft(self, recipient: str, skill_score: int, skill_level: str) -> Optional[str]:
        """Mint a skill NFT for a user"""
        try:
            if not self.contract_id:
                raise ValueError("Contract ID not configured")

            # This would call the mint_skill_nft function on the Soroban contract
            # For now, return a mock NFT ID
            import uuid
            nft_id = f"nft_{uuid.uuid4().hex[:16]}"

            logger.info(f"Mock minted skill NFT: {nft_id} for {recipient} with score {skill_score}")
            return nft_id

        except Exception as e:
            logger.error(f"Error minting skill NFT: {e}")
            return None

    async def get_campaign_balance(self, contract_address: str) -> int:
        """Get the XLM balance of a campaign contract"""
        try:
            account = await asyncio.get_event_loop().run_in_executor(
                None, self.server.accounts().account_id(contract_address).call
            )

            # Find XLM balance
            for balance in account.balances:
                if balance.asset_type == "native":
                    return int(float(balance.balance))

            return 0

        except NotFoundError:
            return 0
        except Exception as e:
            logger.error(f"Error getting campaign balance: {e}")
            return 0

    async def release_milestone_funds(self, campaign_contract: str, creator_address: str, amount: int) -> bool:
        """Release funds from campaign contract to creator"""
        try:
            if not self.admin_secret:
                raise ValueError("Admin secret key not configured")

            admin_keypair = Keypair.from_secret(self.admin_secret)
            admin_account = await asyncio.get_event_loop().run_in_executor(
                None, self.server.load_account, admin_keypair.public_key
            )

            # Create payment transaction from contract to creator
            # Note: In Soroban, this would be a contract call
            transaction = (
                TransactionBuilder(
                    source_account=admin_account,  # In practice, this would be the contract
                    network_passphrase=self.network_passphrase,
                    base_fee=100
                )
                .append_payment_op(
                    destination=creator_address,
                    asset=Asset.native(),
                    amount=str(amount)
                )
                .set_timeout(30)
                .build()
            )

            transaction.sign(admin_keypair)

            response = await asyncio.get_event_loop().run_in_executor(
                None, self.server.submit_transaction, transaction
            )

            return response["successful"]

        except Exception as e:
            logger.error(f"Error releasing milestone funds: {e}")
            return False

    async def get_network_status(self) -> Dict[str, Any]:
        """Get current network status"""
        try:
            ledger = await asyncio.get_event_loop().run_in_executor(
                None, self.server.ledgers().order(desc=True).limit(1).call
            )

            latest_ledger = ledger["_embedded"]["records"][0]

            return {
                "latest_ledger": latest_ledger["sequence"],
                "network_passphrase": self.network_passphrase,
                "horizon_url": self.horizon_url,
                "contract_deployed": self.contract_id is not None
            }

        except Exception as e:
            logger.error(f"Error getting network status: {e}")
            return {
                "error": str(e),
                "network_passphrase": self.network_passphrase,
                "horizon_url": self.horizon_url
            }

# Global service instance
stellar_service = StellarService()

# Helper functions for backward compatibility
async def validate_wallet_address(address: str) -> bool:
    """Validate a Stellar public key"""
    try:
        Keypair.from_public_key(address)
        return True
    except Exception:
        return False

def normalize_wallet_address(address: str) -> str:
    """Normalize Stellar address (no-op for Stellar)"""
    return address

def is_valid_wallet_address(address: str) -> bool:
    """Check if address is a valid Stellar public key"""
    return validate_wallet_address(address)