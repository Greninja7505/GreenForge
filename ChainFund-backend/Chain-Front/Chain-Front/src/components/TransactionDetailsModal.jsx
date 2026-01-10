import React from 'react';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  const [copied, setCopied] = useState(null);
  
  if (!isOpen || !transaction) return null;

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  // Determine the correct explorer URL based on chain type
  const getExplorerUrl = () => {
    const { hash, chain, testnet } = transaction;
    
    if (!hash || hash === 'pending') return null;
    
    // EVM chains (Ethereum, Polygon)
    if (chain === 'ethereum') {
      return testnet 
        ? `https://sepolia.etherscan.io/tx/${hash}`
        : `https://etherscan.io/tx/${hash}`;
    }
    
    if (chain === 'polygon') {
      return testnet
        ? `https://amoy.polygonscan.com/tx/${hash}`
        : `https://polygonscan.com/tx/${hash}`;
    }
    
    // Default to Stellar Explorer
    return testnet
      ? `https://stellar.expert/explorer/testnet/tx/${hash}`
      : `https://stellar.expert/explorer/public/tx/${hash}`;
  };

  const copyToClipboard = (text, field) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const explorerUrl = getExplorerUrl();
  const networkName = transaction.chain === 'ethereum' 
    ? (transaction.testnet ? 'Sepolia Testnet' : 'Ethereum Mainnet')
    : transaction.chain === 'polygon'
    ? (transaction.testnet ? 'Polygon Amoy' : 'Polygon Mainnet')
    : (transaction.testnet ? 'Stellar Testnet' : 'Stellar Mainnet');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 relative z-10 shadow-2xl" style={{ boxShadow: '0 8px 32px 0 rgba(16, 185, 129, 0.15)' }}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
        </div>
        
        <div className="space-y-4">
          {transaction.contractId && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contract ID</h3>
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-sm">{formatAddress(transaction.contractId)}</p>
                <button 
                  onClick={() => copyToClipboard(transaction.contractId, 'contract')}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {copied === 'contract' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          )}
          
          {transaction.balance && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Amount</h3>
              <p className="text-white font-semibold text-lg">
                {transaction.amount || transaction.balance} {transaction.currency || 'XLM'}
              </p>
              {transaction.usdValue && (
                <p className="text-gray-400 text-sm">≈ ${transaction.usdValue.toFixed(2)} USD</p>
              )}
            </div>
          )}
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Transaction Hash</h3>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono text-sm">{formatAddress(transaction.hash)}</p>
              <button 
                onClick={() => copyToClipboard(transaction.hash, 'hash')}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {copied === 'hash' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-500" />}
              </button>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Network</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${transaction.testnet ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
              <p className="text-white">{networkName}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
            >
              Close
            </button>
            {explorerUrl && (
              <button
                onClick={() => window.open(explorerUrl, '_blank', 'noopener,noreferrer')}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-500/25"
              >
                View on Explorer <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;