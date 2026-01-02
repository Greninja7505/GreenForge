/**
 * ChainFund Smart Contract Configuration
 * 
 * Contract addresses for Stellar Soroban testnet deployment.
 * Update these after running deploy-chainfund.ps1
 */

// Network Configuration
export const NETWORK_CONFIG = {
  network: 'testnet',
  networkPassphrase: 'Test SDF Network ; September 2015',
  rpcUrl: 'https://soroban-testnet.stellar.org',
  horizonUrl: 'https://horizon-testnet.stellar.org',
  explorerUrl: 'https://stellar.expert/explorer/testnet'
};

// Contract IDs - Deployed to Stellar Testnet on Dec 10, 2025
export const CONTRACT_IDS = {
  // Main ChainFund contract with campaigns, milestones, voting
  CHAINFUND_CORE: 'CASAEVPPIRUVC2H4EAMZEPMIJCOAL7XOG2MH3U5SJCRWVGBEXIOWKGYG',
  
  // SoulBound Token contract for reputation
  CHAINFUND_SBT: 'CBN4UZRCLFTWQUVNJIV7KDNX4QSONEUMWHRDSO3OQEAWPFTQTQRWXODP',
  
  // Legacy contracts (for backward compatibility)
  PROJECT_FUNDING: 'CAYI6U5R3NYJRBDOZIX5OOUC6QXM6XU4QYH4CSHZRYKWD5OUT42HRISL',
  REWARD_TOKEN: null
};

// XLM Token Address on Testnet (Stellar Asset Contract)
export const XLM_TOKEN_ADDRESS = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2EZ4KUXH';

// Contract Verification Status Types
export const VERIFICATION_STATUS = {
  NOT_SUBMITTED: 0,
  PENDING: 1,
  COMPLETED: 2,
  PARTIAL: 3,
  SUSPICIOUS: 4,
  REJECTED: 5
};

// Campaign Status Types
export const CAMPAIGN_STATUS = {
  DRAFT: 0,
  ACTIVE: 1,
  FUNDED: 2,
  COMPLETED: 3,
  FAILED: 4,
  CANCELLED: 5
};

// Milestone Status Types
export const MILESTONE_STATUS = {
  PENDING: 0,
  IN_PROGRESS: 1,
  PROOF_SUBMITTED: 2,
  AI_VERIFIED: 3,
  VOTING_OPEN: 4,
  APPROVED: 5,
  RELEASED: 6,
  DISPUTED: 7,
  REJECTED: 8
};

// SBT Role Types
export const SBT_ROLES = {
  CREATOR: 0,
  BACKER: 1,
  SUPER_BACKER: 2,
  DEVELOPER: 3,
  DESIGNER: 4,
  TESTER: 5,
  MENTOR: 6,
  VALIDATOR: 7,
  AMBASSADOR: 8,
  PIONEER: 9
};

// SBT Reputation Values
export const REPUTATION_VALUES = {
  [SBT_ROLES.CREATOR]: 100,
  [SBT_ROLES.BACKER]: 10,
  [SBT_ROLES.SUPER_BACKER]: 50,
  [SBT_ROLES.DEVELOPER]: 30,
  [SBT_ROLES.DESIGNER]: 25,
  [SBT_ROLES.TESTER]: 20,
  [SBT_ROLES.MENTOR]: 40,
  [SBT_ROLES.VALIDATOR]: 15,
  [SBT_ROLES.AMBASSADOR]: 75,
  [SBT_ROLES.PIONEER]: 60
};

// Platform Configuration
export const PLATFORM_CONFIG = {
  platformFeeBps: 250,      // 2.5% platform fee
  votingPeriodDays: 7,      // 7 days voting period
  aiTimeoutHours: 24,       // 24 hours AI verification timeout
  minFundingXlm: 1000       // Minimum 1000 XLM campaign goal
};

// Helper Functions
export const getStatusLabel = (statusType, statusValue) => {
  const labels = {
    verification: ['Not Submitted', 'Pending', 'Completed', 'Partial', 'Suspicious', 'Rejected'],
    campaign: ['Draft', 'Active', 'Funded', 'Completed', 'Failed', 'Cancelled'],
    milestone: ['Pending', 'In Progress', 'Proof Submitted', 'AI Verified', 'Voting Open', 'Approved', 'Released', 'Disputed', 'Rejected']
  };
  return labels[statusType]?.[statusValue] || 'Unknown';
};

export const getRoleLabel = (roleValue) => {
  const labels = ['Creator', 'Backer', 'Super Backer', 'Developer', 'Designer', 'Tester', 'Mentor', 'Validator', 'Ambassador', 'Pioneer'];
  return labels[roleValue] || 'Unknown';
};

// Convert stroops to XLM
export const stroopsToXlm = (stroops) => stroops / 10000000;

// Convert XLM to stroops
export const xlmToStroops = (xlm) => Math.floor(xlm * 10000000);