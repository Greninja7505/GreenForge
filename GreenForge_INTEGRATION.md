# GreenForge Integration Guide

This document details the implementation of the **GreenForge** platform features within the ChainFund backend and frontend.

## 🚀 New Features Implemented

### 1. **Authentication System**

- **JWT-based Auth**: Secure login and registration flows.
- **Wallet Connection**: Link Stellar wallets to user profiles.
- **Persistence**: User session handling with `UserContext` and `localStorage`.

### 2. **Eco-Bounties**

- **Backend API**: `/api/bounties`
- **Database**: `bounties` table with location, reward, and status tracking.
- **Frontend**: `EcoBounties.jsx` fetching real data.
- **Features**:
  - List/Map View toggle.
  - Claim Bounty interaction.
  - Proof submission flow (Mocked AI verification).

### 3. **Marketplace (Carbon Cashback)**

- **Backend API**: `/api/marketplace`
- **Database**: `products` and `product_orders` tables.
- **Frontend**: `Marketplace.jsx` fetching products.
- **Features**:
  - Product listing via API.
  - Purchase flow with Carbon Credit Token (CCT) calculation.
  - Automatic stock management.

### 4. **AI Services**

- **Endpoint**: `/api/ai/analyze-sustainability` & `/api/ai/verify-proof`
- **Integration**: Graceful fallback to mock data if API keys are missing.
- **Purpose**: Automating greenwashing detection and proof-of-work verification.

## 🛠️ Technical Architecture

### **Backend (`ChainFund/chainfund-backend`)**

- **Server**: `sqlite_server.py` (FastAPI + SQLite).
- **Routers**:
  - `app/routers/auth.py`: User management.
  - `app/routers/bounties.py`: Bounty CRUD and claims.
  - `app/routers/marketplace.py`: E-commerce logic.
  - `app/routers/ai.py`: Groq/Mock AI integration.
- **Database**: `chainfund_lite.db` (SQLite).
- **Middleware**: Rate limiting and security headers enabled in `app/middleware/security.py`.

### **Frontend (`Chain-Front/Chain-Front`)**

- **State Management**: `UserContext.jsx` handling auth and roles.
- **API Utility**: `src/utils/api.js` for centralized, authenticated requests.
- **Pages**:
  - `EcoBounties.jsx`: Interactive bounty hunter interface.
  - `Marketplace.jsx`: Green product store.

## 🏃 How to Run

### 1. **Start the Backend**

```bash
# Navigate to backend directory
cd ChainFund/chainfund-backend

# Install dependencies (if not done)
pip install -r requirements-sqlite.txt

# Run the server
python sqlite_server.py
```

*The server will start on `http://localhost:8000`. Database tables will be auto-seeded on first run.*

### 2. **Start the Frontend**

```bash
# Navigate to frontend directory
cd Chain-Front/Chain-Front

# Install dependencies
npm install

# Run the dev server
npm run dev
```

*Access the app at `http://localhost:5173` (or port shown in terminal).*

## ✅ Verification Steps

1. **Register** a new account on the frontend.
2. Go to **Eco-Bounties**, see the list of tasks (loaded from DB).
3. Click **Claim** on a bounty -> Verification toast should appear.
4. Go to **Marketplace**, browse products.
5. Add items to cart and **Checkout** -> "Purchase Successful" toast with CCT earnings.

## ⚠️ Notes

- The "Smart Contract" integration is simulated for the demo interaction speed but the backend contracts logic is ready in `rust-contracts`.
- AI features will use "Mock Mode" if `GROQ_API_KEY` is not set in `.env`.
