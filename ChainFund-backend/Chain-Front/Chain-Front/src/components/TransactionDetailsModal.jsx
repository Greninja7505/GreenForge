import React from 'react';
import { ExternalLink } from 'lucide-react';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const viewOnExplorer = () => {
    const explorerUrl = `https://stellar.expert/explorer/${transaction.testnet ? 'testnet' : 'public'}/tx/${transaction.hash}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
        <h2 className="text-2xl font-bold mb-4">Transaction Details</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Contract ID</h3>
            <p className="text-gray-900 font-mono text-sm">{formatAddress(transaction.contractId)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Contract Balance</h3>
            <p className="text-gray-900">
              {transaction.balance} XLM
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Hash</h3>
            <p className="text-gray-900 font-mono text-sm">{transaction.transactionHash}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Network</h3>
            <p className="text-gray-900">{transaction.testnet ? 'Testnet' : 'Public Network'}</p>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => window.open(transaction.explorerUrl, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              View Contract <ExternalLink className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;