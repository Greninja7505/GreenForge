import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Thirdweb/EVM Chain Context
 * Handles Ethereum, Polygon, and other EVM-compatible chains
 */

const ThirdwebContext = createContext();

// Supported chains configuration
export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: '#627EEA',
    testnet: false
  },
  goerli: {
    id: 5,
    name: 'Goerli Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://goerli.infura.io/v3/public',
    explorer: 'https://goerli.etherscan.io',
    icon: '⟠',
    color: '#627EEA',
    testnet: true
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    explorer: 'https://sepolia.etherscan.io',
    icon: '⟠',
    color: '#627EEA',
    testnet: true
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    icon: '⬡',
    color: '#8247E5',
    testnet: false
  },
  mumbai: {
    id: 80001,
    name: 'Mumbai Testnet',
    symbol: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
    icon: '⬡',
    color: '#8247E5',
    testnet: true
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
    symbol: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    icon: '🔵',
    color: '#28A0F0',
    testnet: false
  },
  optimism: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    icon: '🔴',
    color: '#FF0420',
    testnet: false
  }
};

// Storage keys
const STORAGE_KEYS = {
  EVM_ADDRESS: 'evm_wallet_address',
  EVM_CHAIN: 'evm_chain_id',
  EVM_CONNECTED: 'evm_wallet_connected'
};

export const useThirdweb = () => {
  const context = useContext(ThirdwebContext);
  if (!context) {
    throw new Error('useThirdweb must be used within ThirdwebProvider');
  }
  return context;
};

export const ThirdwebProvider = ({ children }) => {
  const [address, setAddress] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EVM_ADDRESS) || null;
  });
  const [chainId, setChainId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVM_CHAIN);
    return saved ? parseInt(saved) : null;
  });
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EVM_CONNECTED) === 'true';
  });
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState(null);
  const [maticPrice, setMaticPrice] = useState(null);

  // Get current chain info
  const currentChain = Object.values(SUPPORTED_CHAINS).find(c => c.id === chainId) || null;

  // Persist state
  useEffect(() => {
    if (address) {
      localStorage.setItem(STORAGE_KEYS.EVM_ADDRESS, address);
      localStorage.setItem(STORAGE_KEYS.EVM_CONNECTED, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
      localStorage.setItem(STORAGE_KEYS.EVM_CONNECTED, 'false');
    }
  }, [address]);

  useEffect(() => {
    if (chainId) {
      localStorage.setItem(STORAGE_KEYS.EVM_CHAIN, chainId.toString());
    }
  }, [chainId]);

  // Fetch token prices
  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    // Default prices for development to avoid CORS issues
    const DEFAULT_ETH_PRICE = 3500;
    const DEFAULT_MATIC_PRICE = 0.85;
    
    try {
      // Try fetching from CoinGecko via CORS proxy
      const response = await fetch(
        'https://corsproxy.io/?' + encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network&vs_currencies=usd'),
        { signal: AbortSignal.timeout(5000) } // 5 second timeout
      );
      const data = await response.json();
      if (data.ethereum) setEthPrice(data.ethereum.usd);
      if (data['matic-network']) setMaticPrice(data['matic-network'].usd);
      return;
    } catch (error) {
      // Silently fall back to default prices
      console.log('Using default crypto prices');
    }
    setEthPrice(DEFAULT_ETH_PRICE);
    setMaticPrice(DEFAULT_MATIC_PRICE);
  };

  // Check if MetaMask is available
  const isMetaMaskAvailable = () => {
    return typeof window !== 'undefined' && window.ethereum;
  };

  // Connect wallet
  const connectWallet = useCallback(async (preferredChainId = null) => {
    if (!isMetaMaskAvailable()) {
      toast.error('Please install MetaMask to connect EVM wallets');
      window.open('https://metamask.io/download/', '_blank');
      return null;
    }

    setLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const userAddress = accounts[0];
      setAddress(userAddress);
      setIsConnected(true);

      // Get current chain
      const currentChainId = await window.ethereum.request({
        method: 'eth_chainId'
      });
      setChainId(parseInt(currentChainId, 16));

      // Switch to preferred chain if specified
      if (preferredChainId && parseInt(currentChainId, 16) !== preferredChainId) {
        await switchChain(preferredChainId);
      }

      // Get balance
      await fetchBalance(userAddress);

      toast.success('EVM Wallet Connected!');
      return userAddress;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setChainId(null);
    setIsConnected(false);
    setBalance(null);
    localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.EVM_CHAIN);
    localStorage.setItem(STORAGE_KEYS.EVM_CONNECTED, 'false');
    toast.success('Wallet disconnected');
  }, []);

  // Fetch balance
  const fetchBalance = async (addr = address) => {
    if (!addr || !isMetaMaskAvailable()) return;

    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [addr, 'latest']
      });
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = balanceWei / 1e18;
      setBalance(balanceEth);
      return balanceEth;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  };

  // Switch chain
  const switchChain = async (targetChainId) => {
    if (!isMetaMaskAvailable()) return false;

    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.id === targetChainId);
    if (!chain) {
      toast.error('Unsupported chain');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
      setChainId(targetChainId);
      toast.success(`Switched to ${chain.name}`);
      return true;
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: {
                name: chain.symbol,
                symbol: chain.symbol,
                decimals: 18
              },
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.explorer]
            }]
          });
          setChainId(targetChainId);
          return true;
        } catch (addError) {
          console.error('Error adding chain:', addError);
          toast.error('Failed to add network');
          return false;
        }
      }
      console.error('Error switching chain:', switchError);
      toast.error('Failed to switch network');
      return false;
    }
  };

  // Send transaction
  const sendTransaction = async (to, amountInEth, data = '0x') => {
    if (!address || !isMetaMaskAvailable()) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      const amountWei = `0x${(amountInEth * 1e18).toString(16)}`;
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: to,
          value: amountWei,
          data: data
        }]
      });

      toast.success('Transaction sent!');
      
      // Wait for confirmation
      await waitForTransaction(txHash);
      
      // Refresh balance
      await fetchBalance();
      
      return txHash;
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Wait for transaction confirmation
  const waitForTransaction = async (txHash, maxAttempts = 30) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });
        
        if (receipt) {
          if (receipt.status === '0x1') {
            toast.success('Transaction confirmed!');
            return receipt;
          } else {
            throw new Error('Transaction failed');
          }
        }
        
        await new Promise(r => setTimeout(r, 2000));
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
      }
    }
    throw new Error('Transaction confirmation timeout');
  };

  // Sign message
  const signMessage = async (message) => {
    if (!address || !isMetaMaskAvailable()) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });
      return signature;
    } catch (error) {
      console.error('Signing error:', error);
      throw error;
    }
  };

  // Get USD value
  const getUsdValue = (amount) => {
    if (!currentChain) return 0;
    const price = currentChain.symbol === 'ETH' ? ethPrice : maticPrice;
    return amount * (price || 0);
  };

  // Listen for account/chain changes
  useEffect(() => {
    if (!isMetaMaskAvailable()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        fetchBalance(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      fetchBalance();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [address, disconnectWallet]);

  // Auto-reconnect on load
  useEffect(() => {
    if (isConnected && isMetaMaskAvailable()) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            fetchBalance(accounts[0]);
            window.ethereum.request({ method: 'eth_chainId' })
              .then(chainIdHex => setChainId(parseInt(chainIdHex, 16)));
          } else {
            setIsConnected(false);
          }
        });
    }
  }, []);

  const value = {
    // State
    address,
    chainId,
    currentChain,
    isConnected,
    balance,
    loading,
    ethPrice,
    maticPrice,
    
    // Chains
    supportedChains: SUPPORTED_CHAINS,
    
    // Methods
    connectWallet,
    disconnectWallet,
    switchChain,
    sendTransaction,
    signMessage,
    fetchBalance,
    getUsdValue,
    isMetaMaskAvailable: isMetaMaskAvailable()
  };

  return (
    <ThirdwebContext.Provider value={value}>
      {children}
    </ThirdwebContext.Provider>
  );
};

export default ThirdwebContext;
