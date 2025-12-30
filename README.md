# � GreenChain (StellarForge)

<div align="center">

![Stellar](https://img.shields.io/badge/Stellar-Blockchain-blue?style=for-the-badge&logo=stellar)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=for-the-badge&logo=fastapi)
![Rust](https://img.shields.io/badge/Rust-Smart_Contracts-orange?style=for-the-badge&logo=rust)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**AI-Verified Sustainable Crowdfunding Platform on Stellar Blockchain**

[🚀 Live Demo](#) • [📖 Documentation](./PROJECT_OVERVIEW.md) • [🔗 Smart Contracts](#smart-contracts) • [💬 Community](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**GreenChain (StellarForge)** is a revolutionary decentralized crowdfunding platform built on the Stellar blockchain using Soroban smart contracts. It combines **AI-powered verification**, **quadratic voting governance**, and **milestone-based funding** to create a transparent, trustless crowdfunding ecosystem focused on **sustainable development and environmental impact**.

### Why GreenChain?

Traditional crowdfunding platforms suffer from:

- ❌ Centralized control and high fees
- ❌ Lack of transparency
- ❌ No accountability for fund usage
- ❌ Risk of fraud and mismanagement

**GreenChain solves these problems with:**

- ✅ **Sustainability Matching**: Connect investors with projects aligned to their environmental focus areas
- ✅ **Impact Tracking**: Real-time monitoring of environmental outcomes and carbon reduction metrics
- ✅ **Green Rewards**: Earn tokens for supporting verified sustainable initiatives
- ✅ **Community Governance**: Quadratic voting ensures fair decision-making for environmental priorities

- ✅ **Trustless Escrow** - Funds locked in smart contracts
- ✅ **AI Verification** - Automated milestone verification
- ✅ **Community Governance** - Quadratic voting for fairness
- ✅ **Transparent Tracking** - All transactions on-chain
- ✅ **Low Fees** - Stellar's minimal transaction costs
- ✅ **Reputation System** - Non-transferable SoulBound Tokens

---

## ✨ Key Features

### 🔐 Trustless Fund Management

- **Smart Contract Escrow** - Funds locked until milestones are verified
- **Automated Release** - Trustless fund distribution based on conditions
- **Emergency Refunds** - Backer protection mechanisms
- **Platform Fee** - Only 2.5% on successful releases

### 🤖 AI-Powered Verification

- **Automated Analysis** - AI oracle verifies milestone completion
- **Confidence Scoring** - 0-100% verification confidence
- **Multiple Statuses** - Completed, Partial, Suspicious, Rejected
- **Dispute Resolution** - Community voting on disputed milestones

### 🗳️ Quadratic Voting Governance

- **Fair Voting Power** - `voting_power = √(contribution)`
- **Prevents Whale Dominance** - Democratic decision-making
- **Milestone Approval** - Community validates completions
- **Transparent Tallies** - All votes recorded on-chain

### 🏅 SoulBound Token (SBT) Reputation

- **Non-Transferable** - Prevents reputation gaming
- **Role-Based Points** - 10 different reputation tiers
- **Cumulative System** - Reputation grows with participation
- **Revocable** - Admin can revoke for fraud

### 💼 Freelancer Marketplace

- **Gig Listings** - Create and browse freelance opportunities
- **Order Management** - Track project orders
- **Earnings Dashboard** - Analytics and insights
- **Skill Matching** - Connect creators with talent

### 🌐 Multi-Wallet Support

- **Freighter Wallet** - Browser extension integration
- **Albedo Wallet** - Secure web wallet
- **LOBSTR Wallet** - Mobile and web support
- **Future** - WalletConnect integration

---

## 🔧 Technology Stack

### Frontend

```
React 18.2.0          - Modern UI framework
Vite 4.5.14           - Lightning-fast build tool
TypeScript 5.0.2      - Type-safe development
Tailwind CSS 3.3.3    - Utility-first styling
Framer Motion 10.16.4 - Smooth animations
Zustand 4.4.6         - State management
React Router 6.18.0   - Client-side routing
```

### Backend

```
FastAPI 0.104.1       - High-performance API framework
SQLite 3              - Lightweight database
Stellar SDK 9.0.0     - Blockchain integration
Uvicorn 0.24.0        - ASGI server
Pydantic              - Data validation
Python Jose 3.3.0     - JWT authentication
```

### Blockchain

```
Stellar Network       - Layer-1 blockchain
Soroban               - Smart contract runtime
Rust 1.70+            - Contract language
Stellar SDK 11.0.0    - JavaScript integration
Freighter API 2.0.0   - Wallet connection
```

### AI & Analytics

```
Groq API              - AI chatbot integration
Recharts 2.9.0        - Data visualization
Custom AI Oracle      - Milestone verification
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                              │
│                   (React + TailwindCSS)                          │
│              http://localhost:3000                               │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                   │
│              (FastAPI + SQLite)                                  │
│              http://localhost:8000                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Projects   │  │   Gigs      │  │  Contracts  │             │
│  │   API       │  │   API       │  │   API (v2)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               STELLAR BLOCKCHAIN (Testnet)                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐       │
│  │   ChainFund Core        │  │   ChainFund SBT         │       │
│  │   - Campaigns           │  │   - Reputation Tokens   │       │
│  │   - Milestones          │  │   - Role Management     │       │
│  │   - Quadratic Voting    │  │   - Non-transferable    │       │
│  │   - AI Verification     │  │                         │       │
│  │   - Escrow Release      │  │                         │       │
│  └─────────────────────────┘  └─────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⛓️ Smart Contracts

### Deployed Contracts (Stellar Testnet)

#### ChainFund Core Contract

**Contract ID:** `CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG`

**Modules:**

- **Campaign Registry** - Create and manage campaigns
- **Milestone Manager** - Track milestone progress
- **AI Verification Handler** - Process AI oracle verdicts
- **Quadratic Voting Engine** - Fair community voting
- **Escrow & Release Logic** - Trustless fund management
- **SBT Integration** - Award reputation tokens

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG)

#### ChainFund SBT Contract

**Contract ID:** `CBN4UZRCLFTWQUVNJIV7KDNX4QSONEUMWHRDSO3OQEAWPFTQTQRWXODP`

**Features:**

- Non-transferable SoulBound Tokens
- 10 reputation roles (Backer to Creator)
- Cumulative point system
- Admin revocation capability

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBN4UZRCLFTWQUVNJIV7KDNX4QSONEUMWHRDSO3OQEAWPFTQTQRWXODP)

### Contract Flow

```
1. CAMPAIGN CREATION
   Creator → create_campaign() → Campaign Active

2. FUNDING PHASE  
   Backer → fund_campaign() → XLM Locked in Escrow
   (Backer receives voting power = √amount)

3. MILESTONE WORK
   Creator completes work → submit_proof(ipfs_hash)
   
4. AI VERIFICATION
   AI Oracle → submit_ai_verdict(Completed, 95%)
   → Opens Community Voting

5. COMMUNITY VOTING
   Backers → vote(approve: true/false)
   (Using quadratic voting power)

6. FUND RELEASE (if conditions met)
   Anyone → release_funds()
   → 97.5% to Creator
   → 2.5% Platform Fee

7. CAMPAIGN COMPLETION
   All milestones released → close_campaign()
   → SBT tokens minted for participants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Rust** 1.70+ (for smart contracts)
- **Stellar CLI** (for contract deployment)
- **Freighter Wallet** (for testing)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/GauravPatil2515/StellarForge.git
cd StellarForge
```

2. **Install Frontend Dependencies**

```bash
cd ChainFund-backend/Chain-Front/Chain-Front
npm install
```

3. **Install Backend Dependencies**

```bash
cd ../../ChainFund/chainfund-backend
pip install -r requirements-sqlite.txt
```

4. **Configure Environment Variables**

Create `.env` in backend directory:

```env
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
CHAINFUND_CONTRACT_ID=CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG
JWT_SECRET_KEY=your_secret_key_here
```

### Running the Application

#### Start Backend Server

```bash
cd ChainFund-backend/ChainFund/chainfund-backend
python sqlite_server.py
```

Backend will run on: <http://localhost:8000>

#### Start Frontend Server

```bash
cd ChainFund-backend/Chain-Front/Chain-Front
npm run dev
```

Frontend will run on: <http://localhost:3000>

#### Access the Application

- **Frontend:** <http://localhost:3000>
- **API Docs:** <http://localhost:8000/docs>
- **API Base:** <http://localhost:8000>

### Building Smart Contracts

```bash
cd ChainFund-backend/ChainFund/rust-contracts
./build.ps1
```

### Deploying Smart Contracts

```bash
cd ChainFund-backend/ChainFund/rust-contracts
./deploy-chainfund.ps1
```

---

## 📁 Project Structure

```
StellarForge/
├── ChainFund-backend/
│   ├── Chain-Front/Chain-Front/     # React Frontend
│   │   ├── src/
│   │   │   ├── components/          # UI Components
│   │   │   ├── pages/               # Page Components
│   │   │   ├── context/             # React Context
│   │   │   ├── services/            # API Services
│   │   │   └── config/              # Configuration
│   │   └── package.json
│   │
│   └── ChainFund/
│       ├── chainfund-backend/       # Python Backend
│       │   ├── app/                 # FastAPI App
│       │   ├── scripts/             # Utility Scripts
│       │   ├── sqlite_server.py     # Main Server
│       │   └── chainfund.db         # SQLite Database
│       │
│       └── rust-contracts/          # Smart Contracts
│           ├── chainfund_core/      # Main Contract
│           ├── chainfund_sbt/       # SBT Contract
│           └── deployed_addresses.json
│
├── package.json                     # Root Package
├── PROJECT_OVERVIEW.md              # Detailed Documentation
└── README.md                        # This File
```

---

## 📡 API Documentation

### Core Endpoints

#### Projects API

```
GET    /api/v1/projects              - List all projects
GET    /api/v1/projects/:id          - Get project details
POST   /api/v1/projects              - Create project
PUT    /api/v1/projects/:id          - Update project
DELETE /api/v1/projects/:id          - Delete project
```

#### Smart Contracts API (v2)

```
POST   /contracts/v2/campaigns                      - Create campaign
GET    /contracts/v2/campaigns/:id                  - Get campaign
POST   /contracts/v2/campaigns/:id/fund             - Fund campaign
POST   /contracts/v2/milestones/submit-proof        - Submit proof
POST   /contracts/v2/ai/submit-verdict              - AI verification
POST   /contracts/v2/voting/cast                    - Cast vote
POST   /contracts/v2/sbt/mint                       - Mint SBT
GET    /contracts/v2/sbt/reputation/:addr           - Get reputation
```

#### Freelancer API

```
GET    /api/v1/gigs                  - List gigs
POST   /api/v1/gigs                  - Create gig
GET    /api/v1/gigs/:id              - Get gig details
POST   /api/v1/orders                - Create order
GET    /api/v1/orders                - List orders
```

**Full API Documentation:** <http://localhost:8000/docs>

---

## 📸 Screenshots

### Homepage

![Homepage](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=StellarForge+Homepage)

### Project Dashboard

![Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Project+Dashboard)

### Campaign Details

![Campaign](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Campaign+Details)

### Governance Voting

![Governance](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Governance+Voting)

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)

- [x] Smart contract development (Core + SBT)
- [x] Frontend application with React
- [x] Backend API with FastAPI
- [x] Wallet integration (Freighter)
- [x] AI chatbot integration
- [x] Freelancer marketplace
- [x] Quadratic voting system
- [x] SoulBound Token system

### 🚧 In Progress (v1.1)

- [ ] Mainnet deployment
- [ ] Enhanced AI verification
- [ ] Mobile responsiveness optimization
- [ ] Performance improvements

### 🔮 Planned (v2.0)

- [ ] Multi-signature project wallets
- [ ] Quadratic funding rounds
- [ ] NFT rewards for donors
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Payment streaming
- [ ] Social features and updates
- [ ] Integration with more wallets (WalletConnect)
- [ ] Cross-chain bridge support
- [ ] DAO governance expansion

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📊 Project Statistics

- **Total Files:** 450+
- **Smart Contracts:** 5
- **API Endpoints:** 30+
- **Frontend Components:** 57+
- **Database Tables:** 8
- **Supported Wallets:** 3+

---

## 🔐 Security

### Smart Contract Security

- AI Oracle authorization
- Creator verification
- Admin controls
- SBT non-transferability
- Quadratic voting fairness

### Backend Security

- JWT authentication
- Input validation
- CORS configuration
- Environment variables
- Rate limiting (planned)

### Reporting Security Issues

Please report security vulnerabilities to: **<gauravpatil2516@gmail.com>**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** - For the amazing blockchain platform
- **Soroban Team** - For smart contract capabilities
- **FastAPI Community** - For the excellent web framework
- **React Ecosystem** - For modern frontend development
- **Open Source Community** - For inspiration and support

---

## 📞 Support & Community

- **Documentation:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **GitHub Issues:** [Report Issues](https://github.com/GauravPatil2515/StellarForge/issues)
- **Email:** <gauravpatil2516@gmail.com>
- **Stellar Docs:** <https://developers.stellar.org>
- **Soroban Docs:** <https://soroban.stellar.org>

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=GauravPatil2515/StellarForge&type=Date)](https://star-history.com/#GauravPatil2515/StellarForge&Date)

---

<div align="center">

**Built with ❤️ for decentralized crowdfunding on Stellar**

[⬆ Back to Top](#-stellarforge-chainfund)

</div>
