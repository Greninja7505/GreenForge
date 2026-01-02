# StellarForge - Complete Project Overview

**Generated on:** December 11, 2025  
**Project Type:** Blockchain Crowdfunding Platform  
**Blockchain:** Stellar Network (Testnet)  
**Status:** ✅ Fully Functional

---

## 📋 Table of Contents

1. [Project Summary](#project-summary)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Frontend Details](#frontend-details)
5. [Backend Details](#backend-details)
6. [Smart Contracts](#smart-contracts)
7. [Key Features](#key-features)
8. [Running Services](#running-services)
9. [Deployment Information](#deployment-information)
10. [File Inventory](#file-inventory)

---

## 🎯 Project Summary

**ChainFund (StellarForge)** is an AI-Verified Trustless Crowdfunding Platform built on the Stellar blockchain using Soroban smart contracts. The platform enables:

- **Milestone-based funding** with community verification
- **AI-powered verification** of project milestones
- **Quadratic voting** for fair governance
- **SoulBound Tokens (SBT)** for reputation management
- **Freelancer marketplace** for project collaboration
- **Multi-wallet support** (Freighter, Albedo, LOBSTR)

### Core Innovation
Unlike traditional crowdfunding platforms, ChainFund uses:
- Smart contract escrow for trustless fund management
- AI oracles for milestone verification
- Community governance through quadratic voting
- Non-transferable reputation tokens

---

## 📁 Project Structure

```
StellarForge-master/
│
├── StellarForge-master/                    # Main project directory
│   │
│   ├── ChainFund-backend/                  # Backend services & frontend
│   │   │
│   │   ├── Chain-Front/                    # Frontend application
│   │   │   └── Chain-Front/                # React + Vite app
│   │   │       ├── src/                    # Source code
│   │   │       │   ├── components/         # React components
│   │   │       │   ├── pages/              # Page components
│   │   │       │   ├── context/            # React Context providers
│   │   │       │   ├── services/           # API services
│   │   │       │   ├── config/             # Configuration files
│   │   │       │   ├── hooks/              # Custom React hooks
│   │   │       │   ├── utils/              # Utility functions
│   │   │       │   └── data/               # Mock data
│   │   │       ├── public/                 # Static assets
│   │   │       ├── server/                 # Express backend
│   │   │       │   ├── models/             # MongoDB models
│   │   │       │   └── routes/             # API routes
│   │   │       ├── package.json            # Frontend dependencies
│   │   │       ├── vite.config.ts          # Vite configuration
│   │   │       └── tailwind.config.js      # Tailwind CSS config
│   │   │
│   │   └── ChainFund/                      # Backend & Smart Contracts
│   │       │
│   │       ├── chainfund-backend/          # Python FastAPI backend
│   │       │   ├── app/                    # FastAPI application
│   │       │   │   ├── routers/            # API endpoints
│   │       │   │   ├── services/           # Business logic
│   │       │   │   ├── models/             # Data models
│   │       │   │   ├── schemas/            # Pydantic schemas
│   │       │   │   ├── contracts/          # Contract interfaces
│   │       │   │   └── utils/              # Utility functions
│   │       │   ├── scripts/                # Deployment scripts
│   │       │   ├── chainfund.db            # SQLite database
│   │       │   ├── requirements.txt        # Python dependencies
│   │       │   ├── sqlite_server.py        # Main server file
│   │       │   └── start.ps1               # PowerShell start script
│   │       │
│   │       └── rust-contracts/             # Soroban Smart Contracts
│   │           ├── chainfund_core/         # Main contract
│   │           │   └── src/
│   │           │       └── lib.rs          # Core contract logic
│   │           ├── chainfund_sbt/          # SoulBound Token contract
│   │           │   └── src/
│   │           │       └── lib.rs          # SBT logic
│   │           ├── project_funding/        # Legacy funding contract
│   │           ├── reward_token/           # Legacy token contract
│   │           ├── bridge_protocol/        # Bridge protocol
│   │           ├── Cargo.toml              # Rust workspace config
│   │           ├── build.ps1               # Build script
│   │           ├── deploy-chainfund.ps1    # Deployment script
│   │           └── deployed_addresses.json # Contract addresses
│   │
│   ├── package.json                        # Root package.json (monorepo)
│   ├── build.sh                            # Build script
│   ├── DEPLOYMENT.md                       # Deployment guide
│   ├── render.yaml                         # Render.com config
│   ├── render-simple.yaml                  # Simplified Render config
│   ├── render-backup.yaml                  # Backup Render config
│   └── render-static.yaml                  # Static site Render config
│
└── PROJECT_OVERVIEW.md                     # This file
```

---

## 🔧 Technology Stack

### Frontend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 4.5.14 | Build tool & dev server |
| TypeScript | 5.0.2 | Type safety |
| Tailwind CSS | 3.3.3 | Styling framework |
| Framer Motion | 10.16.4 | Animations |
| React Router | 6.18.0 | Client-side routing |
| Zustand | 4.4.6 | State management |
| Axios | 1.6.2 | HTTP client |
| Lucide React | 0.294.0 | Icon library |
| React Hot Toast | 2.4.1 | Notifications |
| Recharts | 2.9.0 | Data visualization |

### Blockchain Integration
| Technology | Version | Purpose |
|------------|---------|---------|
| Stellar SDK | 11.0.0 | Blockchain interaction |
| Freighter API | 2.0.0 | Wallet integration |
| Soroban CLI | Latest | Smart contract deployment |
| Stellar CLI | Latest | Network interaction |

### Backend Layer
| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.104.1 | Web framework |
| Uvicorn | 0.24.0 | ASGI server |
| SQLite | 3 | Database |
| Stellar SDK (Python) | 9.0.0 | Blockchain integration |
| Pydantic | Latest | Data validation |
| Python Jose | 3.3.0 | JWT authentication |

### Smart Contracts
| Technology | Version | Purpose |
|------------|---------|---------|
| Rust | 1.70+ | Contract language |
| Soroban | Latest | Smart contract runtime |
| Stellar Network | Testnet | Blockchain platform |

### Development Tools
| Tool | Purpose |
|------|---------|
| Node.js | 18.x (Frontend runtime) |
| Python | 3.8+ (Backend runtime) |
| Cargo | Rust package manager |
| Git | Version control |
| PowerShell | Deployment scripts |

---

## 🎨 Frontend Details

### Application Structure

#### Pages (19 total)
1. **Home.jsx** - Landing page with hero section
2. **Projects.jsx** - Browse all projects
3. **ProjectDetail.jsx** - Individual project details
4. **Donate.jsx** - Donation flow
5. **CreateProject.jsx** - Create new campaign
6. **Dashboard.jsx** - User dashboard
7. **Profile.jsx** - User profile management
8. **GIVeconomy.jsx** - Token economy page
9. **GIVfarm.jsx** - Staking/farming page
10. **Community.jsx** - Community features
11. **Causes.jsx** - Browse by cause
12. **About.jsx** - About page
13. **Governance.jsx** - DAO governance
14. **Onboarding.jsx** - User onboarding
15. **SignIn.jsx** - Authentication
16. **SignUp.jsx** - Registration
17. **NotFound.jsx** - 404 page
18. **HireGig.jsx** - Hire freelancers
19. **CreateGig.jsx** - Create gig listing

#### Freelancer Pages (4 total)
1. **FreelancerDashboard.jsx** - Freelancer overview
2. **FreelancerProfile.jsx** - Profile management
3. **GigList.jsx** - Manage gigs
4. **OrderManagement.jsx** - Order tracking
5. **EarningsDashboard.jsx** - Earnings analytics

#### Core Components
- **Navbar** - Navigation with wallet connection
- **Footer** - Site footer
- **ErrorBoundary** - Error handling
- **LoadingSpinner** - Loading states
- **LazyImage** - Lazy loading images
- **ChatBot** - AI chatbot (Groq API)
- **AgenticChatBot** - Advanced AI assistant
- **ClickSpark** - Click effect animations
- **RoleBasedRoute** - Role-based access control
- **SbtBadges** - Display reputation badges
- **DAOGovernance** - Governance UI
- **TransactionProgress** - Transaction tracking
- **MultiChainWallet** - Multi-wallet support

#### Context Providers
1. **StellarContext** - Stellar wallet & transactions
2. **EVMContext** - EVM chain support
3. **ProjectsContext** - Project data management
4. **UserContext** - User authentication & state
5. **ThirdwebContext** - Thirdweb integration

#### Services
- **contractService.js** - Soroban contract interactions
- **API integration** - Backend API calls

#### Configuration
- **contracts.js** - Contract addresses & ABIs
- **chains.js** - Blockchain network configs
- **environment.js** - Environment variables

### UI/UX Features
✅ Dark mode with gradient accents  
✅ Smooth page transitions  
✅ Loading skeletons  
✅ Toast notifications  
✅ Responsive design (mobile-first)  
✅ Lazy loading & code splitting  
✅ Error boundaries  
✅ Click spark effects  
✅ Animated backgrounds  
✅ Premium glassmorphism effects  

---

## 🔌 Backend Details

### API Architecture

#### Database Schema (SQLite)
```sql
-- 8 Tables Total
users          -- User accounts & profiles
projects       -- Crowdfunding campaigns
milestones     -- Project milestones
donations      -- Donation records
project_updates -- Project news/updates
gigs           -- Freelancer gigs
orders         -- Gig orders
transactions   -- Payment history
```

#### API Endpoints

**Projects API** (`/api/v1/projects`)
- `GET /` - List all projects
- `GET /:id` - Get project details
- `POST /` - Create project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `GET /categories` - Get categories

**Users API** (`/api/v1/users`)
- `GET /skill-score/:wallet` - Get user skills
- `POST /skill-activity/:wallet` - Add skill activity
- `POST /mint-skill-nft/:wallet` - Mint skill NFT

**Funding API** (`/api/v1/funding`)
- `POST /back` - Back a campaign
- `GET /campaign/:id/progress` - Funding progress

**Contracts API v2** (`/contracts/v2`)
- `POST /campaigns` - Create campaign on-chain
- `GET /campaigns/:id` - Get campaign from chain
- `POST /campaigns/:id/fund` - Fund campaign
- `POST /milestones/submit-proof` - Submit proof
- `POST /ai/submit-verdict` - AI verification
- `POST /voting/cast` - Cast vote
- `POST /sbt/mint` - Mint SBT
- `GET /sbt/reputation/:addr` - Get reputation

**Gigs API** (`/api/v1/gigs`)
- `GET /` - List gigs
- `POST /` - Create gig
- `GET /:id` - Get gig details

**Orders API** (`/api/v1/orders`)
- `GET /` - List orders
- `POST /` - Create order
- `PUT /:id` - Update order status

### Seeded Mock Data
- 5 Users
- 5 Projects (various funding stages)
- 42 Milestones
- 28 Donations
- 18 Project Updates
- 12 Gigs
- 6 Orders
- 10 Transactions

### Backend Services
- **stellar_service.py** - Stellar SDK integration
- **contract_service.py** - Smart contract calls
- **database.py** - SQLite connection & queries
- **Authentication** - JWT-based auth

---

## ⛓️ Smart Contracts

### Deployed Contracts (Stellar Testnet)

#### 1. ChainFund Core Contract
**Contract ID:** `CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG`  
**Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG)

**Modules:**
1. **Campaign Registry**
   - `create_campaign()` - Create crowdfunding campaign
   - `get_campaign()` - Fetch campaign details
   - `close_campaign()` - Mark campaign complete

2. **Milestone Manager**
   - `submit_proof()` - Submit IPFS proof hash
   - `get_milestone()` - Get milestone status

3. **AI Verification Handler**
   - `submit_ai_verdict()` - Oracle submits verification
   - Status: Completed, Partial, Suspicious, Rejected

4. **Quadratic Voting Engine**
   - `vote()` - Cast quadratic vote
   - `get_vote_status()` - Get voting tallies
   - Formula: `voting_power = √(contribution)`

5. **Escrow & Release Logic**
   - `fund_campaign()` - Lock XLM in escrow
   - `release_funds()` - Trustless release (2.5% platform fee)
   - `refund_backers()` - Emergency refund

6. **SBT Integration**
   - `award_sbt()` - Trigger reputation award

#### 2. ChainFund SBT Contract
**Contract ID:** `CBN4UZRCLFTWQUVNJIV7KDNX4QSONEUMWHRDSO3OQEAWPFTQTQRWXODP`  
**Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBN4UZRCLFTWQUVNJIV7KDNX4QSONEUMWHRDSO3OQEAWPFTQTQRWXODP)

**Features:**
- Non-transferable SoulBound Tokens
- Role-based reputation system
- Admin revocation capability

**Reputation Roles:**
| Role | Points | Awarded For |
|------|--------|-------------|
| Creator | 100 | Completing a campaign |
| Ambassador | 75 | Community leadership |
| Pioneer | 60 | Early adopter |
| Super Backer | 50 | Funding 5+ projects |
| Mentor | 40 | Providing guidance |
| Developer | 30 | Contributing code |
| Designer | 25 | Contributing design |
| Tester | 20 | Testing work |
| Validator | 15 | Active voting |
| Backer | 10 | Funding a project |

### Admin Account
**Public Key:** `GCMJRARFR2PWZUUKGRS3VTET3ZXRGHMVS63XAPV4RIH7ZCJF7GUZXKQQ`

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

## ✨ Key Features

### 1. Milestone-Based Funding
- Projects broken into verifiable milestones
- Funds released only when milestones are verified
- Community voting on milestone completion

### 2. AI Verification
- Backend AI analyzes proof of completion
- Confidence scoring (0-100%)
- Multiple verification statuses

### 3. Quadratic Voting
- Fair community governance
- Voting power = √(contribution amount)
- Prevents whale dominance

### 4. SoulBound Tokens (SBT)
- Non-transferable reputation tokens
- Role-based point system
- Cumulative across projects

### 5. Multi-Wallet Support
- Freighter Wallet
- Albedo Wallet
- LOBSTR Wallet
- Future: WalletConnect

### 6. Freelancer Marketplace
- Create and browse gigs
- Order management
- Earnings tracking
- Skill-based matching

### 7. DAO Governance
- Community proposals
- Token-weighted voting
- Transparent decision-making

### 8. AI ChatBot
- Groq API integration
- Context-aware responses
- Voice input support (planned)
- Text-to-speech (planned)

---

## 🚀 Running Services

### Current Setup

| Service | URL | Status |
|---------|-----|--------|
| Frontend (React + Vite) | http://localhost:3000 | 🟢 Running |
| Backend API (FastAPI + SQLite) | http://localhost:8000 | 🟢 Running |
| API Documentation | http://localhost:8000/docs | 🟢 Available |

### How to Start

#### Backend
```powershell
cd ChainFund-backend/ChainFund/chainfund-backend
python sqlite_server.py
```

#### Frontend
```powershell
cd ChainFund-backend/Chain-Front/Chain-Front
npm run dev
```

#### Build Contracts
```powershell
cd ChainFund-backend/ChainFund/rust-contracts
./build.ps1
```

#### Deploy Contracts
```powershell
cd ChainFund-backend/ChainFund/rust-contracts
./deploy-chainfund.ps1
```

---

## 🌐 Deployment Information

### Deployment Options

#### Option 1: Render.com (Recommended)
- Use `render.yaml` for automatic configuration
- Set environment variables in dashboard
- Supports both frontend and backend

#### Option 2: Manual Deployment

**Frontend (Static Site)**
- Build Command: `npm run build`
- Publish Directory: `dist/`
- Redirects: All routes → `/index.html`

**Backend (Web Service)**
- Build Command: `pip install -r requirements.txt`
- Start Command: `python sqlite_server.py`
- Port: 8000

### Environment Variables

**Frontend (.env)**
```env
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_API_BASE_URL=/api
```

**Backend (.env)**
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=chainfund_lite
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_ADMIN_SECRET=your_stellar_secret_key
CHAINFUND_CONTRACT_ID=CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG
JWT_SECRET_KEY=your_jwt_secret_key
```

---

## 📊 File Inventory

### Root Level Files
- `package.json` - Monorepo configuration
- `build.sh` - Build script for deployment
- `DEPLOYMENT.md` - Deployment guide
- `render.yaml` - Render.com configuration
- `render-simple.yaml` - Simplified Render config
- `render-backup.yaml` - Backup configuration
- `render-static.yaml` - Static site configuration
- `.gitignore` - Git ignore rules

### Frontend Files (Chain-Front/Chain-Front/)

**Configuration Files**
- `package.json` - Frontend dependencies
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS config
- `tsconfig.json` - TypeScript config
- `tsconfig.node.json` - TypeScript Node config
- `postcss.config.js` - PostCSS config
- `vercel.json` - Vercel deployment config
- `index.html` - HTML entry point

**Documentation Files**
- `README.md` - Frontend documentation
- `BLOCKCHAIN_UPDATES.md` - Blockchain integration updates
- `CLEANUP_SUMMARY.md` - Code cleanup summary
- `CLICKSPARK_INTEGRATION.md` - Click effect integration
- `FREIGHTER_WALLET_SETUP.md` - Wallet setup guide
- `HOMEPAGE_UPDATE_SUMMARY.md` - Homepage changes
- `IMPLEMENTATION_SUMMARY.md` - Implementation notes
- `STELLAR_WALLET_GUIDE.md` - Stellar wallet guide

**Source Files** (57+ files in src/)
- Components: 13+ files
- Pages: 19+ files
- Context: 5 files
- Services: Multiple API services
- Config: 3 configuration files
- Hooks: Custom React hooks
- Utils: Utility functions
- Data: Mock data files

### Backend Files (ChainFund/chainfund-backend/)

**Main Files**
- `sqlite_server.py` - Main server file
- `simple_server.py` - Simplified server
- `start_server.py` - Server starter
- `start.ps1` - PowerShell start script
- `requirements.txt` - Python dependencies (MongoDB)
- `requirements-sqlite.txt` - SQLite dependencies
- `chainfund.db` - SQLite database file
- `README.md` - Backend documentation

**App Directory** (app/)
- `main.py` - FastAPI application
- `config.py` - Configuration
- `database.py` - SQLite connection
- `db.py` - Database utilities
- `__init__.py` - Package init
- `routers/` - API endpoints
- `services/` - Business logic
- `models/` - Data models
- `schemas/` - Pydantic schemas
- `contracts/` - Contract interfaces
- `utils/` - Utility functions

**Scripts Directory** (scripts/)
- `seed_database.py` - Database seeding
- `deploy_contract.py` - Contract deployment
- `deploy_all_contracts.py` - Deploy all contracts
- `simulate_votes.py` - Voting simulation
- `testnet_setup.py` - Testnet configuration

### Smart Contract Files (rust-contracts/)

**Configuration Files**
- `Cargo.toml` - Rust workspace config
- `Cargo.lock` - Dependency lock file
- `build.ps1` - Build script
- `deploy.ps1` - Deployment script
- `deploy.sh` - Unix deployment script
- `deploy-chainfund.ps1` - ChainFund deployment
- `deployed_addresses.json` - Contract addresses
- `README.md` - Contract documentation
- `CHAINFUND_CONTRACTS.md` - Detailed contract docs

**Contract Directories**
1. `chainfund_core/` - Main contract
   - `src/lib.rs` - Core logic
   - `Cargo.toml` - Dependencies

2. `chainfund_sbt/` - SBT contract
   - `src/lib.rs` - SBT logic
   - `Cargo.toml` - Dependencies

3. `project_funding/` - Legacy funding contract
4. `reward_token/` - Legacy token contract
5. `bridge_protocol/` - Bridge protocol

### Documentation Files (ChainFund-backend/)
- `README.md` - Main documentation
- `PROJECT_CHANGES.md` - Detailed change log
- `SOROBAN_INTEGRATION.md` - Soroban integration guide
- `deploy-contracts.sh` - Contract deployment script
- `run_mock_backend.sh` - Mock backend runner

---

## 📈 Project Statistics

### Code Metrics
- **Total Files:** 450+
- **Frontend Components:** 57+
- **Backend Endpoints:** 30+
- **Smart Contracts:** 5
- **Database Tables:** 8
- **Mock Data Records:** 100+

### Technology Breakdown
- **Languages:** JavaScript/TypeScript (60%), Python (25%), Rust (15%)
- **Frameworks:** React, FastAPI, Soroban
- **Database:** SQLite (development), MongoDB (production option)
- **Blockchain:** Stellar Testnet

---

## 🔐 Security Features

1. **Smart Contract Security**
   - AI Oracle authorization
   - Creator verification
   - Admin controls
   - SBT non-transferability
   - Quadratic voting

2. **Backend Security**
   - JWT authentication
   - Input validation
   - CORS configuration
   - Environment variables

3. **Frontend Security**
   - Wallet signature verification
   - Transaction confirmation
   - Error boundaries
   - Secure routing

---

## 📝 Recent Changes

### December 10, 2025
- ✅ Frontend syntax errors fixed
- ✅ SQLite database implemented
- ✅ Smart contracts deployed to testnet
- ✅ AI ChatBot integrated (Groq API)
- ✅ Mock data seeded
- ✅ Contract service created
- ✅ Documentation completed

---

## 🎯 Next Steps

### Planned Features
- [ ] Multi-signature project wallets
- [ ] Quadratic funding rounds
- [ ] NFT rewards for donors
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Payment streaming
- [ ] Social features
- [ ] Integration with more wallets

### Improvements
- [ ] Mainnet deployment
- [ ] Production database setup
- [ ] Enhanced AI verification
- [ ] Mobile responsiveness optimization
- [ ] Performance optimization
- [ ] Comprehensive testing

---

## 📞 Support & Resources

### Documentation
- **Stellar Docs:** https://developers.stellar.org
- **Soroban Docs:** https://soroban.stellar.org
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev

### Tools
- **Stellar Laboratory:** https://laboratory.stellar.org
- **Stellar Expert:** https://stellar.expert
- **Friendbot (Testnet):** https://friendbot.stellar.org

### Repository
- **GitHub:** https://github.com/GauravPatil2515/StellarForge.git

---

## 📄 License

MIT License - Free to use for learning or production

---

**Built with ❤️ for decentralized crowdfunding on Stellar!** 🌟

*Last Updated: December 11, 2025*
