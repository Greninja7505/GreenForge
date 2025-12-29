import subprocess
from typing import Optional
import os
from app.config import STELLAR_PROJECT_FUNDING_ID, STELLAR_REWARD_TOKEN_ID

class StellarService:
    @staticmethod
    def invoke_contract(contract_id: str, function: str, *args) -> Optional[str]:
        """
        Invokes a Soroban contract function with the given arguments
        """
        try:
            cmd = ["soroban", "contract", "invoke",
                  "--id", contract_id,
                  "--network", "testnet",
                  "--fn", function]
            
            # Add arguments
            for arg in args:
                cmd.extend(["--arg", str(arg)])
            
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout.strip()
        except subprocess.CalledProcessError as e:
            print(f"Error invoking contract: {e.stderr}")
            return None
    
    def fund_project(self, donor_wallet: str, amount: int) -> bool:
        """
        Fund a project using the project funding contract
        """
        result = self.invoke_contract(
            STELLAR_PROJECT_FUNDING_ID,
            "fund",
            donor_wallet,
            amount
        )
        return result == "true"
    
    def mint_reward(self, admin_wallet: str, recipient: str, amount: int) -> bool:
        """
        Mint reward tokens for a donor
        """
        result = self.invoke_contract(
            STELLAR_REWARD_TOKEN_ID,
            "mint_reward",
            admin_wallet,
            recipient,
            amount
        )
        return result == "true"
    
    def get_donation_amount(self, donor_wallet: str) -> int:
        """
        Get the total donation amount for a donor
        """
        result = self.invoke_contract(
            STELLAR_PROJECT_FUNDING_ID,
            "get_donation",
            donor_wallet
        )
        return int(result) if result else 0
    
    def get_reward_balance(self, wallet: str) -> int:
        """
        Get the reward token balance for a wallet
        """
        result = self.invoke_contract(
            STELLAR_REWARD_TOKEN_ID,
            "get_balance",
            wallet
        )
        return int(result) if result else 0