# ChainFund Soroban Integration

This document outlines how to integrate the ChainFund reward token system with Freighter wallet.

## Backend Configuration

1. Set environment variables in `chainfund-backend/.env`:
```
PROJECT_FUNDING_CONTRACT_ID=your_project_funding_contract_id
REWARD_TOKEN_CONTRACT_ID=your_reward_token_contract_id
```

2. The reward system is integrated through:
- `app/services/soroban_service.py`: Handles Soroban contract interactions
- `app/services/reward_service.py`: Business logic for rewards
- `app/routers/reward_routes.py`: API endpoints for reward operations

## Frontend Configuration

1. Set environment variables in `Chain-Front/.env`:
```
VITE_PROJECT_FUNDING_CONTRACT_ID=your_project_funding_contract_id
VITE_REWARD_TOKEN_CONTRACT_ID=your_reward_token_contract_id
```

2. Key components:
- `src/context/StellarContext.jsx`: Manages Stellar and reward token state
- `src/components/TokenRewardModal.jsx`: UI for reward claiming and display

## Testing Integration

1. Deploy contracts:
```bash
cd ChainFund/rust-contracts
./deploy.ps1
# Note the contract IDs
```

2. Update environment variables with contract IDs

3. Start backend:
```bash
cd ChainFund/chainfund-backend
python start_server.py
```

4. Start frontend:
```bash
cd Chain-Front
npm run dev
```

5. Connect Freighter wallet and test reward claiming