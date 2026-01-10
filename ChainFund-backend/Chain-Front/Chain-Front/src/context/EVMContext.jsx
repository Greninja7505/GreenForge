/**
 * EVM Chain Context (Thirdweb Integration)
 * Handles Ethereum and Polygon wallet connections
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { SUPPORTED_CHAINS, CHAIN_IDS, getChainById, PRICE_FEEDS, FALLBACK_PRICES } from '../config/chains';

const EVMContext = createContext();

export const useEVM = () => {
  const context = useContext(EVMContext);
  if (!context) {
    throw new Error('useEVM must be used within EVMProvider');
  }
  return context;
};

// Storage keys
const STORAGE_KEYS = {
  EVM_CONNECTED: 'evm_wallet_connected',
  EVM_ADDRESS: 'evm_address',
  EVM_CHAIN_ID: 'evm_chain_id',
};

export const EVMProvider = ({ children }) => {
  const [address, setAddress] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EVM_ADDRESS) || null;
  });
  const [chainId, setChainId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVM_CHAIN_ID);
    return saved ? parseInt(saved) : null;
  });
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.EVM_CONNECTED) === 'true';
  });
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState({ eth: null, matic: null });

  // Check if MetaMask is available
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum;

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
      localStorage.setItem(STORAGE_KEYS.EVM_CHAIN_ID, chainId.toString());
    }
  }, [chainId]);

  // Fetch crypto prices with fallback support - skip API if recently failed
  const [apiFailedAt, setApiFailedAt] = useState(null);
  
  const fetchPrices = async () => {
    // Skip API calls for 5 minutes after a failure to avoid rate limits
    if (apiFailedAt && Date.now() - apiFailedAt < 5 * 60 * 1000) {
      console.log('Using fallback prices (API cooldown)');
      setPrices({ eth: FALLBACK_PRICES.ethereum, matic: FALLBACK_PRICES.polygon });
      return;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const [ethRes, maticRes] = await Promise.all([
        fetch(PRICE_FEEDS.ethereum, { signal: controller.signal }).catch(() => null),
        fetch(PRICE_FEEDS.polygon, { signal: controller.signal }).catch(() => null),
      ]);
      
      clearTimeout(timeoutId);
      
      let ethPrice = FALLBACK_PRICES.ethereum;
      let maticPrice = FALLBACK_PRICES.polygon;
      let hadError = false;
      
      if (ethRes?.ok) {
        try {
          const ethData = await ethRes.json();
          ethPrice = ethData.ethereum?.usd || FALLBACK_PRICES.ethereum;
        } catch { hadError = true; }
      } else {
        hadError = true;
      }
      
      if (maticRes?.ok) {
        try {
          const maticData = await maticRes.json();
          maticPrice = maticData['matic-network']?.usd || FALLBACK_PRICES.polygon;
        } catch { hadError = true; }
      } else {
        hadError = true;
      }
      
      if (hadError) {
        setApiFailedAt(Date.now());
      }
      
      setPrices({
        eth: ethPrice,
        matic: maticPrice,
      });
    } catch (error) {
      console.log('Price API unavailable, using fallback prices');
      setApiFailedAt(Date.now());
      setPrices({ eth: FALLBACK_PRICES.ethereum, matic: FALLBACK_PRICES.polygon });
    }
  };

  useEffect(() => {
    // Set fallback prices immediately
    setPrices({ eth: FALLBACK_PRICES.ethereum, matic: FALLBACK_PRICES.polygon });
    
    // Delayed initial fetch to avoid immediate API calls on page load
    const initialTimeout = setTimeout(fetchPrices, 3000);
    
    // Update every 5 minutes instead of every minute to avoid rate limits
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Handle account changes
  useEffect(() => {
    if (!hasMetaMask) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = (newChainId) => {
      setChainId(parseInt(newChainId, 16));
      loadBalance();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [hasMetaMask]);

  // Load balance
  const loadBalance = useCallback(async () => {
    if (!address || !hasMetaMask) return;

    try {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = balanceWei / 1e18;
      setBalance(balanceEth.toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }, [address, hasMetaMask]);

  useEffect(() => {
    if (address) {
      loadBalance();
    }
  }, [address, chainId, loadBalance]);

  // Connect wallet
  const connect = async () => {
    if (!hasMetaMask) {
      toast.error('Please install MetaMask to connect an EVM wallet');
      window.open('https://metamask.io/download/', '_blank');
      return false;
    }

    setLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        const chainIdHex = await window.ethereum.request({
          method: 'eth_chainId',
        });
        setChainId(parseInt(chainIdHex, 16));
        
        toast.success('EVM Wallet connected!');
        return true;
      }
    } catch (error) {
      console.error('Error connecting:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
    return false;
  };

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null);
    setChainId(null);
    setBalance(null);
    setIsConnected(false);
    localStorage.removeItem(STORAGE_KEYS.EVM_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.EVM_CHAIN_ID);
    localStorage.setItem(STORAGE_KEYS.EVM_CONNECTED, 'false');
    toast.success('EVM Wallet disconnected');
  };

  // Switch chain
  const switchChain = async (targetChainId) => {
    if (!hasMetaMask) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      return true;
    } catch (error) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        return await addChain(targetChainId);
      }
      console.error('Error switching chain:', error);
      toast.error('Failed to switch network');
      return false;
    }
  };

  // Add chain to MetaMask
  const addChain = async (targetChainId) => {
    const chainInfo = getChainById(targetChainId);
    if (!chainInfo) return false;

    const { chain, network } = chainInfo;

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: network.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorer],
        }],
      });
      return true;
    } catch (error) {
      console.error('Error adding chain:', error);
      toast.error('Failed to add network');
      return false;
    }
  };

  // Send transaction
  const sendTransaction = async (to, amountEth, data = '0x') => {
    if (!address || !hasMetaMask) {
      toast.error('Wallet not connected');
      return null;
    }

    setLoading(true);
    try {
      const amountWei = `0x${(parseFloat(amountEth) * 1e18).toString(16)}`;
      
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to,
          value: amountWei,
          data,
        }],
      });

      toast.success('Transaction sent!');
      return txHash;
    } catch (error) {
      console.error('Transaction error:', error);
      toast.error(error.message || 'Transaction failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Sign message
  const signMessage = async (message) => {
    if (!address || !hasMetaMask) return null;

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });
      return signature;
    } catch (error) {
      console.error('Signing error:', error);
      return null;
    }
  };

  // Get current chain info
  const getCurrentChain = () => {
    if (!chainId) return null;
    return getChainById(chainId);
  };

  // Get native currency symbol
  const getNativeCurrency = () => {
    const chainInfo = getCurrentChain();
    return chainInfo?.chain?.nativeCurrency?.symbol || 'ETH';
  };

  // Get USD value
  const getUSDValue = (amount) => {
    const currency = getNativeCurrency();
    const price = currency === 'MATIC' ? prices.matic : prices.eth;
    return price ? (parseFloat(amount) * price).toFixed(2) : null;
  };

  const value = {
    // State
    address,
    chainId,
    isConnected,
    balance,
    loading,
    prices,
    hasMetaMask,
    
    // Actions
    connect,
    disconnect,
    switchChain,
    sendTransaction,
    signMessage,
    loadBalance,
    
    // Helpers
    getCurrentChain,
    getNativeCurrency,
    getUSDValue,
    
    // Formatted address
    shortAddress: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
  };

  return (
    <EVMContext.Provider value={value}>
      {children}
    </EVMContext.Provider>
  );
};

export default EVMProvider;
