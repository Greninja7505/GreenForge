# ChainFund - Decentralized Crowdfunding on Stellar

ChainFund is a revolutionary decentralized crowdfunding platform built on the Stellar blockchain using Soroban smart contracts. It combines skill-based reputation systems with milestone-driven funding to create a transparent, community-governed crowdfunding ecosystem.

## 🚀 Features

### Core Functionality
- **Milestone-Based Funding**: Projects are broken into verifiable milestones with community voting
- **Skill NFTs**: Soulbound NFTs that represent user reputation and expertise levels
- **Decentralized Governance**: Community voting on milestone completion and fund releases
- **Multi-Category Support**: Support for Technology, Healthcare, Environment, Education, and more
- **Real-Time Progress Tracking**: Transparent funding progress and milestone completion status

### Blockchain Integration
- **Stellar Network**: Built on Stellar's fast, low-cost blockchain
- **Soroban Smart Contracts**: Rust-based smart contracts for maximum security and performance
- **XLM Native Asset**: Uses Stellar Lumens (XLM) for all transactions
- **Cross-Platform Compatibility**: Works with all Stellar-compatible wallets

## 🏗️ Architecture

### Smart Contracts (Rust + Soroban)
```
rust-contracts/
├── src/
│   ├── lib.rs          # Main ChainFund contract
│   └── test.rs         # Contract tests
├── Cargo.toml          # Rust dependencies
└── README.md           # Contract documentation
```

### Backend (FastAPI + Python)
```
chainfund-backend/
├── app/
│   ├── main.py         # FastAPI application
│   ├── config.py       # Configuration settings
│   ├── services/
│   │   ├── stellar_service.py    # Stellar SDK integration
│   │   └── web3_service.py       # Backward compatibility
│   └── routers/         # API endpoints
├── requirements.txt    # Python dependencies
└── .env               # Environment configuration
```

### Frontend (React + TypeScript)
```
chainfund-frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Application pages
│   └── services/      # API integration
├── package.json       # Node dependencies
└── vite.config.ts     # Build configuration
```

## 🔧 Technology Stack

### Blockchain Layer
- **Stellar Network**: Primary blockchain platform
- **Soroban**: Smart contract runtime for Rust contracts
- **Rust**: Smart contract development with memory safety
- **Stellar SDK**: Python integration for backend

### Backend Layer
- **FastAPI**: High-performance async web framework
- **MongoDB**: Document database for user and campaign data
- **Stellar SDK**: Direct blockchain integration
- **JWT**: Authentication and authorization

### Frontend Layer
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI components

## 🌐 Wallet Integration

**Important**: ChainFund uses Stellar blockchain, not Ethereum. MetaMask does not support Stellar natively.

### Supported Stellar Wallets:
- **Stellar Wallet** (Official): https://www.stellar.org/wallet
- **Lobstr**: Mobile and web wallet for Stellar
- **Keybase**: Integrated Stellar wallet
- **Future**: WalletConnect integration for Stellar

### Connection Methods:
1. **Direct URL Connection**: Wallets connect via URL parameters
2. **QR Code**: Scan QR codes for mobile wallet connections
3. **Browser Extensions**: Stellar-compatible browser extensions
4. **Mobile Apps**: Native mobile wallet apps

### For Development:
- Use Stellar Laboratory: https://laboratory.stellar.org/
- Fund test accounts: Use friendbot for test XLM
- Testnet Horizon: https://horizon-testnet.stellar.org/

## 📋 Prerequisites

### System Requirements
- Rust 1.70+ (for smart contracts)
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- MongoDB 5.0+ (database)
- Stellar account with XLM (for deployment)

### Stellar Setup
1. Create a Stellar account on testnet: https://laboratory.stellar.org/
2. Fund your account with test XLM from friendbot
3. Install Soroban CLI: `cargo install soroban-cli`

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone https://github.com/parthparmar07/ChainFund.git
cd ChainFund
```

### 2. Smart Contracts
```bash
cd rust-contracts
cargo build --target wasm32-unknown-unknown --release
```

### 3. Backend Setup
```bash
cd ../chainfund-backend
pip install -r requirements.txt
# Configure .env with your Stellar credentials
python simple_server.py
```

### 4. Frontend Setup
```bash
cd ../chainfund-frontend
npm install
npm run dev
```

## 🔐 Environment Configuration

### Backend (.env)
```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=chainfund_lite

# Stellar Network
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_ADMIN_SECRET=your_stellar_secret_key
CHAINFUND_CONTRACT_ID=your_deployed_contract_id

# IPFS (Optional)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key

# JWT
JWT_SECRET_KEY=your_jwt_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:8080"]
```

## 📚 API Documentation

### Core Endpoints

#### Campaigns
- `GET /api/v1/campaigns` - List all campaigns
- `GET /api/v1/campaigns/{id}` - Get campaign details
- `POST /api/v1/campaigns` - Create new campaign
- `GET /api/v1/campaigns/categories` - Get campaign categories

#### Users & Skills
- `GET /api/v1/users/skill-score/{wallet}` - Get user skill data
- `POST /api/v1/users/skill-activity/{wallet}` - Add skill activity
- `POST /api/v1/users/mint-skill-nft/{wallet}` - Mint skill NFT

#### Funding
- `POST /api/v1/funding/back` - Back a campaign
- `GET /api/v1/funding/campaign/{id}/progress` - Get funding progress

## 🎯 Smart Contract Functions

### Campaign Management
- `create_campaign()` - Deploy new crowdfunding campaign
- `back_campaign()` - Contribute funds to campaign
- `vote_milestone()` - Vote on milestone completion
- `complete_milestone()` - Release funds for completed milestone

### NFT Operations
- `mint_skill_nft()` - Mint reputation-based NFT
- `get_skill_nft()` - Retrieve NFT details
- `get_campaign_count()` - Get total campaigns

## 🔄 Development Workflow

### Contract Development
1. Modify contracts in `rust-contracts/src/`
2. Build: `cargo build --target wasm32-unknown-unknown --release`
3. Test: `cargo test`
4. Deploy: `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/chainfund_contracts.wasm`

### Backend Development
1. Modify code in `chainfund-backend/app/`
2. Run tests: `python -m pytest`
3. Start server: `python simple_server.py`

### Frontend Development
1. Modify code in `chainfund-frontend/src/`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## 🧪 Testing

### Smart Contract Tests
```bash
cd rust-contracts
cargo test
```

### Backend Tests
```bash
cd chainfund-backend
python -m pytest tests/
```

### Integration Tests
```bash
# Start all services
# Run end-to-end tests
npm run test:e2e
```

## 🚢 Deployment

### Smart Contracts
```bash
# Build optimized contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/chainfund_contracts.wasm \
  --source <your-secret-key> \
  --network testnet
```

### Backend
```bash
# Build and deploy
docker build -t chainfund-backend .
docker run -p 8000:8000 chainfund-backend
```

### Frontend
```bash
# Build for production
npm run build

# Deploy to hosting service (Vercel, Netlify, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stellar Development Foundation for the Soroban platform
- FastAPI community for the excellent web framework
- React ecosystem for modern frontend development

## 📞 Support

- **Documentation**: https://docs.chainfund.io
- **Discord**: https://discord.gg/chainfund
- **Issues**: https://github.com/parthparmar07/ChainFund/issues
- **Stellar Docs**: https://developers.stellar.org/docs

---

**ChainFund** - Democratizing innovation through decentralized crowdfunding on Stellar! 🌟