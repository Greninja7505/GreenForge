/**
 * Multi-Chain Wallet Connector Component
 * Unified wallet connection for Stellar & EVM chains
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Link2, 
  Link2Off, 
  ChevronDown, 
  ExternalLink, 
  Copy, 
  Check,
  Loader2,
  X
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';
import { useEVM } from '../context/EVMContext';
import { SUPPORTED_CHAINS, CHAIN_IDS } from '../config/chains';
import toast from 'react-hot-toast';

const MultiChainWallet = ({ compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('stellar');

  // Stellar wallet
  const stellar = useStellar();
  
  // EVM wallet
  const evm = useEVM();

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getConnectionStatus = () => {
    const connections = [];
    if (stellar.isConnected) connections.push('Stellar');
    if (evm.isConnected) connections.push(evm.getNativeCurrency());
    return connections;
  };

  const totalConnections = getConnectionStatus().length;

  // Compact mode - just show status
  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black border border-white/20 rounded-xl hover:border-white/40 transition-all"
      >
        <Wallet className="w-4 h-4 text-white" />
        <span className="text-sm text-white font-medium">
          {totalConnections > 0 ? `${totalConnections} Connected` : 'Connect Wallet'}
        </span>
        {totalConnections > 0 && (
          <div className="flex -space-x-1">
            {stellar.isConnected && (
              <div className="w-5 h-5 bg-black border border-white/30 rounded-full flex items-center justify-center text-xs">
                ⭐
              </div>
            )}
            {evm.isConnected && (
              <div className="w-5 h-5 bg-purple-600 border border-white/30 rounded-full flex items-center justify-center text-xs">
                💎
              </div>
            )}
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-5 py-3 bg-black border border-white/20 rounded-xl hover:border-white/40 transition-all"
      >
        <Wallet className="w-5 h-5 text-white" />
        <div className="flex flex-col items-start">
          <span className="text-sm text-white font-medium">
            {totalConnections > 0 ? 'Wallets Connected' : 'Connect Wallets'}
          </span>
          {totalConnections > 0 && (
            <span className="text-xs text-gray-400">
              {getConnectionStatus().join(' + ')}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[480px] bg-black border border-white/10 rounded-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-semibold text-white">Multi-Chain Wallet</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Connect wallets to fund projects across chains
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Chain Tabs */}
              <div className="flex border-b border-white/10">
                {[
                  { id: 'stellar', name: 'Stellar', icon: '⭐', color: 'white' },
                  { id: 'evm', name: 'Ethereum / Polygon', icon: '💎', color: 'purple' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-white border-b-2 border-white'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'stellar' ? (
                  <StellarWalletSection 
                    stellar={stellar} 
                    copyAddress={copyAddress}
                    copied={copied}
                  />
                ) : (
                  <EVMWalletSection 
                    evm={evm}
                    copyAddress={copyAddress}
                    copied={copied}
                  />
                )}
              </div>

              {/* Footer Stats */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Connected:</span>
                  <span className="text-white font-medium">{totalConnections} chains</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Stellar Wallet Section
const StellarWalletSection = ({ stellar, copyAddress, copied }) => {
  return (
    <div className="space-y-4">
      {stellar.isConnected ? (
        <>
          {/* Connected State */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black border border-white/20 rounded-full flex items-center justify-center">
                  ⭐
                </div>
                <div>
                  <p className="text-sm text-gray-400">Stellar (Freighter)</p>
                  <p className="text-white font-mono text-sm">
                    {stellar.publicKey?.slice(0, 8)}...{stellar.publicKey?.slice(-8)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyAddress(stellar.publicKey)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${stellar.publicKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-sm text-gray-400">Balance</span>
              <div className="text-right">
                <p className="text-white font-medium">{stellar.balance || '0'} XLM</p>
                {stellar.xlmPrice && stellar.balance && (
                  <p className="text-xs text-gray-400">
                    ≈ ${(parseFloat(stellar.balance) * stellar.xlmPrice).toFixed(2)} USD
                  </p>
                )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={stellar.disconnect}
            className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Link2Off className="w-4 h-4" />
            <span>Disconnect</span>
          </motion.button>
        </>
      ) : (
        <>
          {/* Disconnected State */}
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              ⭐
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Connect Stellar Wallet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Connect your Freighter wallet to fund projects with XLM
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={stellar.connect}
              disabled={stellar.loading}
              className="w-full py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              {stellar.loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect Freighter</span>
                </>
              )}
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

// EVM Wallet Section
const EVMWalletSection = ({ evm, copyAddress, copied }) => {
  const chainOptions = [
    { id: CHAIN_IDS.ETHEREUM_SEPOLIA, name: 'Sepolia', icon: '💎', color: 'blue' },
    { id: CHAIN_IDS.POLYGON_AMOY, name: 'Polygon Amoy', icon: '🔷', color: 'purple' },
  ];

  return (
    <div className="space-y-4">
      {evm.isConnected ? (
        <>
          {/* Connected State */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600/20 border border-purple-500/30 rounded-full flex items-center justify-center">
                  💎
                </div>
                <div>
                  <p className="text-sm text-gray-400">
                    {evm.getCurrentChain()?.network?.name || 'EVM Chain'}
                  </p>
                  <p className="text-white font-mono text-sm">{evm.shortAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyAddress(evm.address)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-sm text-gray-400">Balance</span>
              <div className="text-right">
                <p className="text-white font-medium">{evm.balance || '0'} {evm.getNativeCurrency()}</p>
                {evm.getUSDValue(evm.balance) && (
                  <p className="text-xs text-gray-400">≈ ${evm.getUSDValue(evm.balance)} USD</p>
                )}
              </div>
            </div>
          </div>

          {/* Chain Switcher */}
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Switch Network</p>
            <div className="grid grid-cols-2 gap-2">
              {chainOptions.map((chain) => (
                <motion.button
                  key={chain.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => evm.switchChain(chain.id)}
                  className={`p-3 border rounded-xl flex items-center justify-center gap-2 transition-all ${
                    evm.chainId === chain.id
                      ? 'bg-white/10 border-white/30 text-white'
                      : 'border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <span>{chain.icon}</span>
                  <span className="text-sm">{chain.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={evm.disconnect}
            className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Link2Off className="w-4 h-4" />
            <span>Disconnect</span>
          </motion.button>
        </>
      ) : (
        <>
          {/* Disconnected State */}
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              💎
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Connect EVM Wallet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Connect MetaMask to fund with ETH or MATIC
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={evm.connect}
              disabled={evm.loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50"
            >
              {evm.loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect MetaMask</span>
                </>
              )}
            </motion.button>
            {!evm.hasMetaMask && (
              <p className="text-xs text-gray-500 mt-3">
                MetaMask not detected.{' '}
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  Install here
                </a>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MultiChainWallet;
