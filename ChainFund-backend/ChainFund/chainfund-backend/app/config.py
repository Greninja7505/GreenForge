import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # MongoDB Configuration
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "chainfund_lite"

    # Stellar Network Configuration
    stellar_network_passphrase: str = "Test SDF Network ; September 2015"  # Testnet
    stellar_horizon_url: str = "https://horizon-testnet.stellar.org"
    stellar_admin_secret: str = ""  # Admin account secret key
    chainfund_contract_id: str = ""  # Deployed project funding contract ID

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8"
    }
    stellar_reward_token_id: str = ""  # Deployed reward token contract ID

    # SMTP Configuration
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    from_email: str = "noreply@chainfund.com"

    # IPFS Configuration
    pinata_api_key: str = ""
    pinata_secret_key: str = ""
    web3_storage_token: str = ""

    # JWT Configuration
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # CORS Configuration - Using List directly
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080"
    ]

    class Config:
        env_file = ".env"


settings = Settings()

# Export settings variables for easier access
MONGODB_URL = settings.mongodb_url
MONGODB_DB = settings.database_name

# Stellar Contract IDs
STELLAR_PROJECT_FUNDING_ID = settings.stellar_project_funding_id
STELLAR_REWARD_TOKEN_ID = settings.stellar_reward_token_id

# Stellar Network
STELLAR_NETWORK = settings.stellar_network_passphrase
STELLAR_HORIZON_URL = settings.stellar_horizon_url
STELLAR_ADMIN_SECRET = settings.stellar_admin_secret

# SMTP Settings
SMTP_SERVER = settings.smtp_server
SMTP_PORT = settings.smtp_port
SMTP_USERNAME = settings.smtp_username
SMTP_PASSWORD = settings.smtp_password
FROM_EMAIL = settings.from_email

# Security
JWT_SECRET = settings.jwt_secret_key
JWT_ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes