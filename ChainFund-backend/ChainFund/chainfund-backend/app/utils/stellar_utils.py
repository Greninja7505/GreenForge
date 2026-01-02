"""
Stellar utility functions for ChainFund
Helper functions for faucet, keypair generation, transaction building
"""

import os
import requests
from typing import Optional, Dict, Any
import logging

try:
    from stellar_sdk import Keypair, Server, TransactionBuilder, Network
    from stellar_sdk.exceptions import BadRequestError, NotFoundError
except ImportError:
    print("Warning: stellar-sdk not installed. Install with: pip install stellar-sdk")
    stellar_sdk_available = False
else:
    stellar_sdk_available = True

logger = logging.getLogger(__name__)


class StellarUtils:
    """Utility class for Stellar blockchain operations"""

    def __init__(self):
        if not stellar_sdk_available:
            raise ImportError("stellar-sdk is required for Stellar operations")

        self.network_passphrase = os.getenv("STELLAR_NETWORK_PASSPHRASE", "Test SDF Network ; September 2015")
        self.horizon_url = os.getenv("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
        self.friendbot_url = os.getenv("STELLAR_FRIENDBOT_URL", "https://friendbot.stellar.org")

        self.server = Server(horizon_url=self.horizon_url)

    def generate_keypair(self) -> Dict[str, str]:
        """Generate a new Stellar keypair"""
        keypair = Keypair.random()
        return {
            "public_key": keypair.public_key,
            "secret_key": keypair.secret
        }

    def fund_account(self, public_key: str) -> bool:
        """Fund a testnet account using Friendbot"""
        try:
            response = requests.get(f"{self.friendbot_url}?addr={public_key}")
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            logger.error(f"Failed to fund account {public_key}: {e}")
            return False

    def create_keypair_from_secret(self, secret: str) -> Optional[Keypair]:
        """Create a Keypair from secret key"""
        try:
            return Keypair.from_secret(secret)
        except Exception as e:
            logger.error(f"Invalid secret key: {e}")
            return None

    def validate_public_key(self, public_key: str) -> bool:
        """Validate a Stellar public key"""
        try:
            Keypair.from_public_key(public_key)
            return True
        except Exception:
            return False

    def get_account_sequence(self, public_key: str) -> Optional[int]:
        """Get the sequence number for an account"""
        try:
            account = self.server.accounts().account_id(public_key).call()
            return int(account.sequence)
        except NotFoundError:
            return None
        except Exception as e:
            logger.error(f"Error getting account sequence: {e}")
            return None

    def build_transaction(
        self,
        source_keypair: Keypair,
        operations: list,
        memo: Optional[str] = None,
        timeout: int = 30
    ) -> Optional[Any]:
        """Build a Stellar transaction"""
        try:
            source_account = self.server.load_account(source_keypair.public_key)

            transaction_builder = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100
                )
                .add_memo(memo) if memo else TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100
                )
            )

            for operation in operations:
                transaction_builder.append_operation(operation)

            transaction = transaction_builder.set_timeout(timeout).build()
            transaction.sign(source_keypair)

            return transaction

        except Exception as e:
            logger.error(f"Error building transaction: {e}")
            return None

    def submit_transaction(self, transaction) -> Dict[str, Any]:
        """Submit a transaction to the network"""
        try:
            response = self.server.submit_transaction(transaction)
            return {
                "successful": response["successful"],
                "hash": response["hash"],
                "ledger": response.get("ledger"),
                "result_xdr": response.get("result_xdr")
            }
        except BadRequestError as e:
            logger.error(f"Transaction failed: {e}")
            return {
                "successful": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error submitting transaction: {e}")
            return {
                "successful": False,
                "error": str(e)
            }

    def get_network_info(self) -> Dict[str, Any]:
        """Get current network information"""
        try:
            ledger = self.server.ledgers().order(desc=True).limit(1).call()
            latest_ledger = ledger["_embedded"]["records"][0]

            return {
                "latest_ledger": latest_ledger["sequence"],
                "network_passphrase": self.network_passphrase,
                "horizon_url": self.horizon_url,
                "base_fee": latest_ledger.get("base_fee_in_stroops", 100)
            }
        except Exception as e:
            logger.error(f"Error getting network info: {e}")
            return {
                "error": str(e),
                "network_passphrase": self.network_passphrase,
                "horizon_url": self.horizon_url
            }


# Global utility instance
stellar_utils = StellarUtils()


# Helper functions for backward compatibility
def generate_stellar_keypair() -> Dict[str, str]:
    """Generate a new Stellar keypair"""
    return stellar_utils.generate_keypair()


def fund_testnet_account(public_key: str) -> bool:
    """Fund a testnet account"""
    return stellar_utils.fund_account(public_key)


def validate_stellar_address(address: str) -> bool:
    """Validate a Stellar address"""
    return stellar_utils.validate_public_key(address)


def get_account_sequence_number(public_key: str) -> Optional[int]:
    """Get account sequence number"""
    return stellar_utils.get_account_sequence(public_key)