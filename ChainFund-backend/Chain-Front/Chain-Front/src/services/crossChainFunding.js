/**
 * Cross-Chain Funding Service
 * Handles donations from multiple blockchains and normalizes to USD
 */

import { SUPPORTED_CHAINS, PRICE_FEEDS } from '../config/chains';

// Cache for price data
let priceCache = {
  xlm: null,
  eth: null,
  matic: null,
  lastUpdated: null,
};

const CACHE_DURATION = 60000; // 1 minute

/**
 * Fetch current prices for all supported currencies
 */
export const fetchAllPrices = async () => {
  const now = Date.now();
  
  // Return cached data if fresh
  if (priceCache.lastUpdated && (now - priceCache.lastUpdated) < CACHE_DURATION) {
    return priceCache;
  }

  try {
    const [xlmRes, ethRes, maticRes] = await Promise.all([
      fetch(PRICE_FEEDS.stellar).then(r => r.json()),
      fetch(PRICE_FEEDS.ethereum).then(r => r.json()),
      fetch(PRICE_FEEDS.polygon).then(r => r.json()),
    ]);

    priceCache = {
      xlm: xlmRes.stellar?.usd || 0.12,
      eth: ethRes.ethereum?.usd || 2000,
      matic: maticRes['matic-network']?.usd || 0.8,
      lastUpdated: now,
    };

    return priceCache;
  } catch (error) {
    console.error('Error fetching prices:', error);
    // Return fallback prices
    return {
      xlm: 0.12,
      eth: 2000,
      matic: 0.8,
      lastUpdated: now,
    };
  }
};

/**
 * Convert amount to USD
 * @param {number} amount - Amount in native currency
 * @param {string} currency - Currency symbol (XLM, ETH, MATIC)
 * @returns {number} - USD equivalent
 */
export const convertToUSD = async (amount, currency) => {
  const prices = await fetchAllPrices();
  
  const currencyMap = {
    'XLM': prices.xlm,
    'ETH': prices.eth,
    'MATIC': prices.matic,
  };

  const price = currencyMap[currency.toUpperCase()];
  if (!price) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return amount * price;
};

/**
 * Convert USD to native currency amount
 * @param {number} usdAmount - Amount in USD
 * @param {string} currency - Target currency symbol
 * @returns {number} - Amount in native currency
 */
export const convertFromUSD = async (usdAmount, currency) => {
  const prices = await fetchAllPrices();
  
  const currencyMap = {
    'XLM': prices.xlm,
    'ETH': prices.eth,
    'MATIC': prices.matic,
  };

  const price = currencyMap[currency.toUpperCase()];
  if (!price) {
    throw new Error(`Unsupported currency: ${currency}`);
  }

  return usdAmount / price;
};

/**
 * Contribution record structure
 */
export class Contribution {
  constructor({
    id,
    projectId,
    contributor,
    chain,
    currency,
    amount,
    usdValue,
    txHash,
    timestamp,
    status = 'pending',
  }) {
    this.id = id;
    this.projectId = projectId;
    this.contributor = contributor;
    this.chain = chain;
    this.currency = currency;
    this.amount = amount;
    this.usdValue = usdValue;
    this.txHash = txHash;
    this.timestamp = timestamp;
    this.status = status;
  }
}

/**
 * Cross-Chain Funding Manager
 */
class CrossChainFundingService {
  constructor() {
    this.contributions = new Map(); // projectId -> Contribution[]
    this.listeners = new Set();
  }

  /**
   * Subscribe to funding updates
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notify(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }

  /**
   * Record a new contribution
   */
  async recordContribution({
    projectId,
    contributor,
    chain,
    currency,
    amount,
    txHash,
  }) {
    // Calculate USD value
    const usdValue = await convertToUSD(amount, currency);

    const contribution = new Contribution({
      id: `${chain}-${txHash.slice(0, 8)}`,
      projectId,
      contributor,
      chain,
      currency,
      amount,
      usdValue,
      txHash,
      timestamp: new Date(),
      status: 'confirmed',
    });

    // Store contribution
    if (!this.contributions.has(projectId)) {
      this.contributions.set(projectId, []);
    }
    this.contributions.get(projectId).push(contribution);

    // Notify listeners
    this.notify('contribution', contribution);

    // Save to backend
    await this.saveToBackend(contribution);

    return contribution;
  }

  /**
   * Get total funding for a project
   */
  async getProjectFunding(projectId) {
    const contributions = this.contributions.get(projectId) || [];
    
    const byChain = {
      stellar: { amount: 0, usd: 0 },
      ethereum: { amount: 0, usd: 0 },
      polygon: { amount: 0, usd: 0 },
    };

    let totalUSD = 0;

    for (const c of contributions) {
      if (c.status === 'confirmed') {
        const chainKey = c.chain.toLowerCase();
        if (byChain[chainKey]) {
          byChain[chainKey].amount += c.amount;
          byChain[chainKey].usd += c.usdValue;
        }
        totalUSD += c.usdValue;
      }
    }

    return {
      totalUSD,
      byChain,
      contributionCount: contributions.length,
      contributions,
    };
  }

  /**
   * Get all contributions by a user
   */
  getUserContributions(address) {
    const userContributions = [];
    
    for (const [projectId, contributions] of this.contributions) {
      for (const c of contributions) {
        if (c.contributor.toLowerCase() === address.toLowerCase()) {
          userContributions.push({ ...c, projectId });
        }
      }
    }

    return userContributions;
  }

  /**
   * Save contribution to backend
   */
  async saveToBackend(contribution) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contribution),
      });

      if (!response.ok) {
        console.error('Failed to save contribution to backend');
      }
    } catch (error) {
      console.error('Backend save error:', error);
      // Continue anyway - contribution is recorded locally
    }
  }

  /**
   * Load contributions from backend
   */
  async loadFromBackend(projectId) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/projects/${projectId}/contributions`
      );

      if (response.ok) {
        const data = await response.json();
        this.contributions.set(projectId, data.contributions || []);
      }
    } catch (error) {
      console.error('Backend load error:', error);
    }
  }
}

// Singleton instance
export const crossChainFunding = new CrossChainFundingService();

/**
 * Hook for using cross-chain funding in React components
 */
export const useCrossChainFunding = (projectId) => {
  const [funding, setFunding] = React.useState({
    totalUSD: 0,
    byChain: {},
    contributionCount: 0,
    contributions: [],
    loading: true,
  });

  React.useEffect(() => {
    const loadFunding = async () => {
      await crossChainFunding.loadFromBackend(projectId);
      const data = await crossChainFunding.getProjectFunding(projectId);
      setFunding({ ...data, loading: false });
    };

    loadFunding();

    // Subscribe to updates
    const unsubscribe = crossChainFunding.subscribe((event, contribution) => {
      if (event === 'contribution' && contribution.projectId === projectId) {
        loadFunding();
      }
    });

    return unsubscribe;
  }, [projectId]);

  return funding;
};

// Import React for the hook
import React from 'react';

export default crossChainFunding;
