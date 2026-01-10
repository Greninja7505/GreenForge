"""
Stellar SDK v2 Service - Direct SDK calls (no subprocess)
Phase 1: Replaces brittle CLI calls with proper Python SDK

This service provides:
- Direct contract invocation via stellar-sdk
- Fallback to CLI if SDK fails
- Connection pooling and async support
"""
import os
import asyncio
import logging
from typing import Optional, Dict, Any, List

# Try to import stellar-sdk
try:
    from stellar_sdk import (
        Keypair, Network, Server, 
        TransactionBuilder, Asset
    )
    from stellar_sdk.sep.stellar_toml import fetch_stellar_toml
    STELLAR_SDK_AVAILABLE = True
except ImportError:
    STELLAR_SDK_AVAILABLE = False
    print("⚠️ stellar-sdk not installed. Install with: pip install stellar-sdk>=10.0.0")

# Try to import SorobanServer (newer versions)
try:
    from stellar_sdk import SorobanServer
    from stellar_sdk.soroban_rpc import GetTransactionStatus
    SOROBAN_AVAILABLE = True
except ImportError:
    SOROBAN_AVAILABLE = False
    print("⚠️ SorobanServer not available in this stellar-sdk version")

logger = logging.getLogger(__name__)


class SorobanSDKService:
    """
    Modern Stellar SDK service that replaces subprocess CLI calls.
    Provides async contract interactions with proper error handling.
    """
    
    def __init__(self):
        self.rpc_url = os.getenv("SOROBAN_RPC_URL", "https://soroban-testnet.stellar.org")
        self.horizon_url = os.getenv("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
        self.network_passphrase = os.getenv(
            "STELLAR_NETWORK_PASSPHRASE", 
            "Test SDF Network ; September 2015"
        )
        
        # Admin keypair for signing transactions
        admin_secret = os.getenv("STELLAR_ADMIN_SECRET", "")
        if admin_secret and STELLAR_SDK_AVAILABLE:
            try:
                self.admin_keypair = Keypair.from_secret(admin_secret)
                logger.info(f"✅ Admin keypair loaded: {self.admin_keypair.public_key[:8]}...")
            except Exception as e:
                self.admin_keypair = None
                logger.warning(f"⚠️ Failed to load admin keypair: {e}")
        else:
            self.admin_keypair = None
            logger.warning("⚠️ No admin secret configured - contract writes disabled")
        
        # Contract addresses
        self.core_contract_id = os.getenv("CHAINFUND_CONTRACT_ID", "")
        self.sbt_contract_id = os.getenv("SBT_CONTRACT_ID", "")
        
        # Initialize servers if SDK available
        if STELLAR_SDK_AVAILABLE:
            self.horizon = Server(horizon_url=self.horizon_url)
        else:
            self.horizon = None
            
        if SOROBAN_AVAILABLE:
            try:
                self.soroban = SorobanServer(self.rpc_url)
                logger.info(f"✅ Soroban RPC connected: {self.rpc_url}")
            except Exception as e:
                self.soroban = None
                logger.warning(f"⚠️ Failed to connect Soroban RPC: {e}")
        else:
            self.soroban = None
    
    @property
    def is_available(self) -> bool:
        """Check if SDK is properly configured"""
        return STELLAR_SDK_AVAILABLE and self.horizon is not None
    
    @property
    def can_write(self) -> bool:
        """Check if we can write to blockchain"""
        return self.is_available and self.admin_keypair is not None and self.soroban is not None
    
    async def get_account(self, public_key: str) -> Dict[str, Any]:
        """Get account info from Horizon (read-only)"""
        if not self.is_available:
            return {"success": False, "error": "Stellar SDK not available"}
        
        try:
            account = self.horizon.accounts().account_id(public_key).call()
            
            # Extract XLM balance
            xlm_balance = "0"
            for balance in account.get("balances", []):
                if balance.get("asset_type") == "native":
                    xlm_balance = balance.get("balance", "0")
                    break
            
            return {
                "success": True,
                "public_key": public_key,
                "xlm_balance": xlm_balance,
                "sequence": account.get("sequence", "0"),
                "subentry_count": account.get("subentry_count", 0)
            }
        except Exception as e:
            logger.error(f"Failed to get account {public_key[:8]}...: {e}")
            return {"success": False, "error": str(e)}
    
    async def check_health(self) -> Dict[str, Any]:
        """Check health of Stellar connections"""
        result = {
            "sdk_available": STELLAR_SDK_AVAILABLE,
            "soroban_available": SOROBAN_AVAILABLE,
            "horizon_connected": False,
            "soroban_connected": False,
            "admin_configured": self.admin_keypair is not None,
            "core_contract": self.core_contract_id,
            "sbt_contract": self.sbt_contract_id
        }
        
        # Test Horizon
        if self.horizon:
            try:
                self.horizon.root().call()
                result["horizon_connected"] = True
            except:
                pass
        
        # Test Soroban RPC
        if self.soroban:
            try:
                health = self.soroban.get_health()
                result["soroban_connected"] = True
                result["soroban_status"] = health.status
            except:
                pass
        
        return result
    
    async def invoke_contract(
        self,
        contract_id: str,
        function_name: str,
        args: List = None,
        source_keypair: Any = None
    ) -> Dict[str, Any]:
        """
        Invoke a smart contract function.
        
        Args:
            contract_id: The contract address
            function_name: Function to call
            args: List of arguments (as ScVal or raw values)
            source_keypair: Optional keypair for signing (uses admin if not provided)
        
        Returns:
            Dict with success status, tx_hash, and result or error
        """
        if not self.can_write:
            return {
                "success": False, 
                "error": "Cannot write: SDK not configured or no admin keypair"
            }
        
        keypair = source_keypair or self.admin_keypair
        args = args or []
        
        try:
            # Load source account
            source_account = self.soroban.load_account(keypair.public_key)
            
            # Build the transaction
            tx_builder = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100,
                )
                .set_timeout(300)
                .append_invoke_contract_function_op(
                    contract_id=contract_id,
                    function_name=function_name,
                    parameters=args,
                )
            )
            
            tx = tx_builder.build()
            
            # Simulate the transaction first
            logger.info(f"Simulating {function_name} on {contract_id[:8]}...")
            sim_response = self.soroban.simulate_transaction(tx)
            
            if sim_response.error:
                return {"success": False, "error": f"Simulation failed: {sim_response.error}"}
            
            # Prepare and sign
            prepared_tx = self.soroban.prepare_transaction(tx, sim_response)
            prepared_tx.sign(keypair)
            
            # Submit
            logger.info(f"Submitting {function_name}...")
            send_response = self.soroban.send_transaction(prepared_tx)
            tx_hash = send_response.hash
            
            # Poll for result (max 30 seconds)
            for attempt in range(30):
                await asyncio.sleep(1)
                get_response = self.soroban.get_transaction(tx_hash)
                
                if get_response.status == GetTransactionStatus.SUCCESS:
                    logger.info(f"✅ Transaction {tx_hash[:8]}... succeeded")
                    return {
                        "success": True,
                        "tx_hash": tx_hash,
                        "result": get_response.result_xdr if hasattr(get_response, 'result_xdr') else None
                    }
                elif get_response.status == GetTransactionStatus.FAILED:
                    logger.error(f"❌ Transaction {tx_hash[:8]}... failed")
                    return {"success": False, "error": "Transaction failed on-chain"}
                
                # Still pending, continue polling
            
            return {"success": False, "error": "Transaction timeout after 30 seconds"}
            
        except Exception as e:
            logger.error(f"Contract invocation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def query_contract(
        self,
        contract_id: str,
        function_name: str,
        args: List = None
    ) -> Dict[str, Any]:
        """
        Query a contract (read-only, uses simulation only).
        
        No transaction is submitted, so no gas is consumed.
        """
        if not self.soroban or not self.admin_keypair:
            return {"success": False, "error": "Soroban RPC not configured"}
        
        args = args or []
        
        try:
            source_account = self.soroban.load_account(self.admin_keypair.public_key)
            
            tx = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100,
                )
                .set_timeout(30)
                .append_invoke_contract_function_op(
                    contract_id=contract_id,
                    function_name=function_name,
                    parameters=args,
                )
                .build()
            )
            
            # Only simulate, don't submit
            sim_response = self.soroban.simulate_transaction(tx)
            
            if sim_response.error:
                return {"success": False, "error": sim_response.error}
            
            # Extract result from simulation
            result = sim_response.result if hasattr(sim_response, 'result') else None
            
            return {"success": True, "data": result}
            
        except Exception as e:
            logger.error(f"Contract query error: {e}")
            return {"success": False, "error": str(e)}
    
    async def prepare_transaction(
        self,
        contract_id: str,
        function_name: str,
        args: List = None,
        source_public_key: str = None
    ) -> Dict[str, Any]:
        """
        Prepare a transaction XDR for client-side signing (Freighter).
        
        Returns unsigned XDR that the frontend can sign with the user's wallet.
        """
        if not self.soroban:
            return {"success": False, "error": "Soroban RPC not configured"}
        
        args = args or []
        source_key = source_public_key or (self.admin_keypair.public_key if self.admin_keypair else None)
        
        if not source_key:
            return {"success": False, "error": "No source account specified"}
        
        try:
            source_account = self.soroban.load_account(source_key)
            
            tx = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100,
                )
                .set_timeout(300)
                .append_invoke_contract_function_op(
                    contract_id=contract_id,
                    function_name=function_name,
                    parameters=args,
                )
                .build()
            )
            
            # Simulate to get proper footprint
            sim_response = self.soroban.simulate_transaction(tx)
            
            if sim_response.error:
                return {"success": False, "error": sim_response.error}
            
            # Prepare (adds auth and footprint)
            prepared_tx = self.soroban.prepare_transaction(tx, sim_response)
            
            # Return unsigned XDR
            return {
                "success": True,
                "tx_xdr": prepared_tx.to_xdr(),
                "network_passphrase": self.network_passphrase
            }
            
        except Exception as e:
            logger.error(f"Transaction preparation error: {e}")
            return {"success": False, "error": str(e)}
    
    async def submit_signed_transaction(self, signed_xdr: str) -> Dict[str, Any]:
        """
        Submit a pre-signed transaction XDR.
        
        Used after frontend signs with Freighter.
        """
        if not self.soroban:
            return {"success": False, "error": "Soroban RPC not configured"}
        
        try:
            from stellar_sdk import TransactionEnvelope
            
            tx = TransactionEnvelope.from_xdr(signed_xdr, self.network_passphrase)
            
            send_response = self.soroban.send_transaction(tx)
            tx_hash = send_response.hash
            
            # Poll for result
            for attempt in range(30):
                await asyncio.sleep(1)
                get_response = self.soroban.get_transaction(tx_hash)
                
                if get_response.status == GetTransactionStatus.SUCCESS:
                    return {"success": True, "tx_hash": tx_hash}
                elif get_response.status == GetTransactionStatus.FAILED:
                    return {"success": False, "error": "Transaction failed"}
            
            return {"success": False, "error": "Transaction timeout"}
            
        except Exception as e:
            logger.error(f"Submit signed transaction error: {e}")
            return {"success": False, "error": str(e)}


# Singleton instance
soroban_sdk = SorobanSDKService()


# Convenience function for health check
async def check_stellar_health():
    """Quick health check for API endpoints"""
    return await soroban_sdk.check_health()
