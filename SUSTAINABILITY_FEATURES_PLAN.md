# 🌿 GreenForge: Sustainable Innovation Feature Implementation Plan

## 🎯 Goal
Transform GreenForge into a "Hackathon Winning" Regenerative Finance (ReFi) platform with unique, high-impact features.

## 📋 Features Roadmap

### 1. 🤖 "Greenwashing" Detector (AI Analysis)
**Priority:** High (Immediate)
**Description:** Analyze project descriptions for vagueness and sustainability alignment.
**Architecture:**
- **Backend:** New `POST /api/ai/analyze-sustainability` endpoint.
- **AI:** Use Groq (Llama3-70b/8b) with a "Scientific Auditor" system prompt.
- **Frontend:** Update `CreateProject.jsx` to show a real-time "Sustainability Score" gauge and improvement suggestions.

### 2. 🌳 "Proof of Impact" Verified by AI Oracles
**Priority:** High
**Description:** Verify milestone completion using Computer Vision.
**Architecture:**
- **Backend:** Update `POST /api/milestones/submit-proof`.
- **AI:** Use specific vision-capable model (if available via Groq or fallback to mock/another provider) to analyze uploaded images.
- **Frontend:** Add image upload to `Milestone` submission form with "Verifying..." animation.

### 3. 🚮 "Eco-Bounties" (Uber for Nature)
**Priority:** Medium
**Description:** Geo-located tasks for environmental cleanup.
**Architecture:**
- **Database:** New `bounties` table (lat, long, reward, status).
- **Frontend:** Interactive Map (Leaflet/Mapbox) showing pins.
- **Flow:** User clicks pin -> Claims task -> Uploads proof -> System verifies -> Releases funds.

### 4. 💎 Tokenized Carbon/Impact Credits (NFTs)
**Priority:** Medium
**Description:** Issue "Impact NFTs" for every donation.
**Architecture:**
- **Smart Contract:** Update `ChainFundCore` to interact with `ChainFundSBT` or a new `ImpactNFT` contract.
- **Backend:** Trigger minting upon `fund_campaign` success.
- **Frontend:** User Dashboard > "My Impact" portfolio view.

### 5. 🌍 "Global Garden" (Visual Impact Map)
**Priority:** Low (Visual Polish)
**Description:** 3D Globe showing all live projects.
**Architecture:**
- **Frontend:** `react-globe.gl` integration.
- **Data:** Fetch lat/long from projects.

### 6. 🛍️ "Carbon Cashback" Marketplace
**Priority:** Low (Extension)
**Description:** Marketplace for green goods with rebate logic.
**Architecture:**
- **Database:** `products` and `orders` tables.
- **Smart Contract:** "Rebate" logic.

---

## 🚀 Execution Phase 1: AI & Greenwashing Detector

### Step 1: Backend Setup
- Create `app/services/ai_service.py` to handle Groq API calls.
- Create `app/routers/ai.py` to expose endpoints.
- Register router in `sqlite_server.py`.

### Step 2: Frontend Integration
- Create `components/project/SustainabilityAnalyzer.jsx`.
- Integrate into `CreateProject` wizard step.

