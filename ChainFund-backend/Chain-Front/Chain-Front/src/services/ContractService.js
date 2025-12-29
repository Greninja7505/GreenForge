/**
 * ChainFund Contract Service
 * 
 * Frontend service for interacting with ChainFund smart contracts
 * on Stellar/Soroban testnet.
 * 
 * Features:
 * - Campaign creation and funding
 * - Milestone proof submission
 * - Quadratic voting
 * - SBT reputation queries
 */

import * as StellarSdk from '@stellar/stellar-sdk';
import { 
  CONTRACT_IDS, 
  NETWORK_CONFIG,
  VERIFICATION_STATUS,
  CAMPAIGN_STATUS,
  MILESTONE_STATUS,
  SBT_ROLES,
  stroopsToXlm,
  xlmToStroops
} from '../config/contracts';

// Initialize Soroban RPC server
const server = new StellarSdk.SorobanRpc.Server(NETWORK_CONFIG.rpcUrl);

// API Base URL for backend contract endpoints
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Contract Service Class
 */
class ContractService {
  constructor() {
    this.coreContractId = CONTRACT_IDS.CHAINFUND_CORE;
    this.sbtContractId = CONTRACT_IDS.CHAINFUND_SBT;
  }

  // ========================================================================
  // CONFIGURATION
  // ========================================================================

  /**
   * Check if contracts are deployed and configured
   */
  async getContractStatus() {
    try {
      const response = await fetch(`${API_BASE}/contracts/v2/status`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get contract status:', error);
      return { ready: false, error: error.message };
    }
  }

  /**
   * Update contract IDs from deployment
   */
  setContractIds(coreId, sbtId) {
    this.coreContractId = coreId;
    this.sbtContractId = sbtId;
  }

  // ========================================================================
  // CAMPAIGN OPERATIONS
  // ========================================================================

  /**
   * Create a new crowdfunding campaign
   * @param {string} creatorAddress - Stellar public key
   * @param {string} title - Campaign title
   * @param {string} description - Campaign description
   * @param {number} totalGoalXlm - Funding goal in XLM
   * @param {Array} milestones - Array of {title, description, amountXlm}
   * @param {string} ipfsMetadata - Optional IPFS hash
   */
  async createCampaign(creatorAddress, title, description, totalGoalXlm, milestones, ipfsMetadata = '') {
    const payload = {
      creator_address: creatorAddress,
      title,
      description,
      ipfs_metadata: ipfsMetadata,
      total_goal: xlmToStroops(totalGoalXlm),
      milestones: milestones.map(m => ({
        title: m.title,
        description: m.description,
        amount: xlmToStroops(m.amountXlm)
      }))
    };

    try {
      const response = await fetch(`${API_BASE}/contracts/v2/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Create campaign failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get campaign details
   * @param {number} campaignId - On-chain campaign ID
   */
  async getCampaign(campaignId) {
    try {
      const response = await fetch(`${API_BASE}/contracts/v2/campaigns/${campaignId}`);
      const result = await response.json();
      
      // Parse and format data for frontend
      if (result.success && result.data) {
        result.data = this._formatCampaign(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get campaign failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Fund a campaign with XLM
   * @param {number} campaignId - Campaign to fund
   * @param {string} backerAddress - Stellar public key
   * @param {number} amountXlm - Amount in XLM
   */
  async fundCampaign(campaignId, backerAddress, amountXlm) {
    const payload = {
      backer_address: backerAddress,
      amount: xlmToStroops(amountXlm)
    };

    try {
      const response = await fetch(`${API_BASE}/contracts/v2/campaigns/${campaignId}/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Fund campaign failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // MILESTONE OPERATIONS
  // ========================================================================

  /**
   * Get milestone details
   * @param {number} campaignId 
   * @param {number} milestoneId 
   */
  async getMilestone(campaignId, milestoneId) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}`
      );
      const result = await response.json();
      
      if (result.success && result.data) {
        result.data = this._formatMilestone(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Get milestone failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit proof of milestone completion
   * @param {number} campaignId 
   * @param {number} milestoneId 
   * @param {string} creatorAddress 
   * @param {string} ipfsHash - IPFS hash of proof documents
   */
  async submitProof(campaignId, milestoneId, creatorAddress, ipfsHash) {
    const payload = {
      creator_address: creatorAddress,
      ipfs_hash: ipfsHash
    };

    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}/proof`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Submit proof failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request fund release for approved milestone
   * @param {number} campaignId 
   * @param {number} milestoneId 
   */
  async releaseFunds(campaignId, milestoneId) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}/release`,
        { method: 'POST' }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Release funds failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // VOTING OPERATIONS
  // ========================================================================

  /**
   * Cast a quadratic vote on a milestone
   * @param {number} campaignId 
   * @param {number} milestoneId 
   * @param {string} voterAddress - Must be a backer
   * @param {boolean} approve - true to approve, false to reject
   */
  async vote(campaignId, milestoneId, voterAddress, approve) {
    const payload = {
      voter_address: voterAddress,
      approve
    };

    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}/vote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      
      return await response.json();
    } catch (error) {
      console.error('Vote failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get voting status for a milestone
   * @param {number} campaignId 
   * @param {number} milestoneId 
   */
  async getVoteStatus(campaignId, milestoneId) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}/votes`
      );
      
      return await response.json();
    } catch (error) {
      console.error('Get vote status failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get backer info including voting power
   * @param {number} campaignId 
   * @param {string} backerAddress 
   */
  async getBackerInfo(campaignId, backerAddress) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/campaigns/${campaignId}/backers/${backerAddress}`
      );
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Format for frontend
        result.data.contributionXlm = stroopsToXlm(result.data.amount || 0);
        result.data.votingPower = result.data.voting_power || 0;
      }
      
      return result;
    } catch (error) {
      console.error('Get backer info failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // SBT REPUTATION OPERATIONS
  // ========================================================================

  /**
   * Get user's SBT profile and reputation
   * @param {string} userAddress 
   */
  async getSbtProfile(userAddress) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/sbt/profile/${userAddress}`
      );
      
      return await response.json();
    } catch (error) {
      console.error('Get SBT profile failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's total reputation score
   * @param {string} userAddress 
   */
  async getReputation(userAddress) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/sbt/reputation/${userAddress}`
      );
      
      return await response.json();
    } catch (error) {
      console.error('Get reputation failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all SBTs owned by a user
   * @param {string} userAddress 
   */
  async getUserSbts(userAddress) {
    try {
      const response = await fetch(
        `${API_BASE}/contracts/v2/sbt/user/${userAddress}/tokens`
      );
      
      return await response.json();
    } catch (error) {
      console.error('Get user SBTs failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  /**
   * Format campaign data from contract
   */
  _formatCampaign(data) {
    return {
      ...data,
      totalGoalXlm: stroopsToXlm(data.total_goal || 0),
      fundsRaisedXlm: stroopsToXlm(data.funds_raised || 0),
      fundsReleasedXlm: stroopsToXlm(data.funds_released || 0),
      fundsLockedXlm: stroopsToXlm(data.funds_locked || 0),
      statusLabel: this._getStatusLabel('campaign', data.status),
      milestones: (data.milestones || []).map(m => this._formatMilestone(m))
    };
  }

  /**
   * Format milestone data from contract
   */
  _formatMilestone(data) {
    return {
      ...data,
      amountXlm: stroopsToXlm(data.amount || 0),
      statusLabel: this._getStatusLabel('milestone', data.status),
      aiVerdictLabel: this._getStatusLabel('verification', data.ai_verdict),
      votesFor: data.votes_for || 0,
      votesAgainst: data.votes_against || 0,
      approvalRatio: data.votes_for && data.votes_against 
        ? (data.votes_for / (data.votes_for + data.votes_against) * 100).toFixed(1)
        : null
    };
  }

  /**
   * Get human-readable status label
   */
  _getStatusLabel(type, value) {
    const labels = {
      verification: ['Not Submitted', 'Pending', 'Completed', 'Partial', 'Suspicious', 'Rejected'],
      campaign: ['Draft', 'Active', 'Funded', 'Completed', 'Failed', 'Cancelled'],
      milestone: ['Pending', 'In Progress', 'Proof Submitted', 'AI Verified', 'Voting Open', 'Approved', 'Released', 'Disputed', 'Rejected']
    };
    return labels[type]?.[value] || 'Unknown';
  }

  /**
   * Calculate quadratic voting power from contribution
   * @param {number} contributionXlm 
   */
  calculateVotingPower(contributionXlm) {
    return Math.floor(Math.sqrt(xlmToStroops(contributionXlm)));
  }
}

// Export singleton instance
export const contractService = new ContractService();

// Also export class for testing
export default ContractService;
