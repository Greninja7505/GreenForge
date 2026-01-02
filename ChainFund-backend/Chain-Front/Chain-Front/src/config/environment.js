/**
 * Environment Configuration
 * Centralized access to all environment variables with defaults
 */

export const config = {
  // Stellar Network
  stellar: {
    network: import.meta.env.VITE_STELLAR_NETWORK || 'testnet',
    horizonUrl: import.meta.env.VITE_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    sorobanRpcUrl: import.meta.env.VITE_STELLAR_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org',
  },

  // Smart Contracts
  contracts: {
    core: import.meta.env.VITE_CONTRACT_CORE || '',
    sbt: import.meta.env.VITE_CONTRACT_SBT || '',
    admin: import.meta.env.VITE_CONTRACT_ADMIN || '',
  },

  // API
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    get url() {
      return `${this.baseUrl}/api/${this.version}`;
    },
  },

  // AI Chatbot
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },

  // Feature Flags
  features: {
    testnetMode: import.meta.env.VITE_ENABLE_TESTNET_MODE === 'true',
    mockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // Rate Limiting
  rateLimit: {
    maxRequests: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
    windowMs: parseInt(import.meta.env.VITE_API_RATE_WINDOW || '60000'),
  },
};

// Validate required config
export const validateConfig = () => {
  const errors = [];
  
  if (!config.contracts.core) {
    errors.push('VITE_CONTRACT_CORE is not set');
  }
  if (!config.contracts.sbt) {
    errors.push('VITE_CONTRACT_SBT is not set');
  }
  
  if (errors.length > 0) {
    console.warn('Configuration warnings:', errors);
  }
  
  return errors.length === 0;
};

export default config;
