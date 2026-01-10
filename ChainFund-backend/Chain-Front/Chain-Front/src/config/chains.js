/**
 * Multi-Chain Configuration
 * Supports Stellar, Ethereum, and Polygon networks
 */

// Chain IDs
export const CHAIN_IDS = {
  ETHEREUM_MAINNET: 1,
  ETHEREUM_SEPOLIA: 11155111,
  POLYGON_MAINNET: 137,
  POLYGON_AMOY: 80002,
  STELLAR_MAINNET: 'stellar-mainnet',
  STELLAR_TESTNET: 'stellar-testnet',
};

// Chain configurations
export const SUPPORTED_CHAINS = {
  // Stellar Networks
  stellar: {
    id: 'stellar',
    name: 'Stellar',
    type: 'stellar',
    networks: {
      mainnet: {
        id: CHAIN_IDS.STELLAR_MAINNET,
        name: 'Stellar Mainnet',
        horizonUrl: 'https://horizon.stellar.org',
        sorobanRpcUrl: 'https://soroban.stellar.org',
        networkPassphrase: 'Public Global Stellar Network ; September 2015',
        explorer: 'https://stellar.expert/explorer/public',
      },
      testnet: {
        id: CHAIN_IDS.STELLAR_TESTNET,
        name: 'Stellar Testnet',
        horizonUrl: 'https://horizon-testnet.stellar.org',
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
        networkPassphrase: 'Test SDF Network ; September 2015',
        explorer: 'https://stellar.expert/explorer/testnet',
      },
    },
    nativeCurrency: {
      name: 'Lumens',
      symbol: 'XLM',
      decimals: 7,
    },
    icon: '⭐',
    color: '#000000',
  },

  // Ethereum Networks
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    networks: {
      mainnet: {
        id: CHAIN_IDS.ETHEREUM_MAINNET,
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://eth.llamarpc.com',
        explorer: 'https://etherscan.io',
      },
      sepolia: {
        id: CHAIN_IDS.ETHEREUM_SEPOLIA,
        name: 'Sepolia Testnet',
        rpcUrl: 'https://rpc.sepolia.org',
        explorer: 'https://sepolia.etherscan.io',
      },
    },
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    icon: '💎',
    color: '#627EEA',
  },

  // Polygon Networks
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    type: 'evm',
    networks: {
      mainnet: {
        id: CHAIN_IDS.POLYGON_MAINNET,
        name: 'Polygon Mainnet',
        rpcUrl: 'https://polygon-rpc.com',
        explorer: 'https://polygonscan.com',
      },
      amoy: {
        id: CHAIN_IDS.POLYGON_AMOY,
        name: 'Polygon Amoy Testnet',
        rpcUrl: 'https://rpc-amoy.polygon.technology',
        explorer: 'https://amoy.polygonscan.com',
      },
    },
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    icon: '🔷',
    color: '#8247E5',
  },
};

// Get chain by ID
export const getChainById = (chainId) => {
  for (const chain of Object.values(SUPPORTED_CHAINS)) {
    for (const network of Object.values(chain.networks)) {
      if (network.id === chainId) {
        return { chain, network };
      }
    }
  }
  return null;
};

// Get all EVM chains
export const getEVMChains = () => {
  return Object.values(SUPPORTED_CHAINS).filter(chain => chain.type === 'evm');
};

// Default active networks (testnet for development)
export const DEFAULT_NETWORKS = {
  stellar: 'testnet',
  ethereum: 'sepolia',
  polygon: 'amoy',
};

// Price configuration - Using static prices to avoid CORS issues in production
// These are approximate values updated periodically
export const PRICE_FEEDS = null; // Disabled to prevent CORS errors

// Fallback prices when API is unavailable (updated periodically)
export const FALLBACK_PRICES = {
  stellar: 0.12,
  ethereum: 2400,
  polygon: 0.85,
};

export default SUPPORTED_CHAINS;
