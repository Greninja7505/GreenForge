import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useStellar } from '../context/StellarContext';
import toast from 'react-hot-toast';

const TokenRewardModal = ({ isOpen, onClose, rewardData }) => {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const { 
    publicKey, 
    rewardBalance, 
    refreshBalances, 
    fundProject,
    handleContractTransaction,
    REWARD_TOKEN_ID 
  } = useStellar();
  const [claimingReward, setClaimingReward] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleRewardClaim = async () => {
    try {
      setClaimingReward(true);
      setTransactionStatus("Processing your reward...");

      // First, record the donation through the project funding contract
      const fundingResult = await fundProject(rewardData.projectId, rewardData.amount);
      
      // If funding successful, mint reward tokens
      if (fundingResult) {
        const mintResult = await handleContractTransaction(
          REWARD_TOKEN_ID,
          'mint_reward',
          [publicKey, rewardData.tokensAwarded]
        );

        if (mintResult) {
          setTransactionStatus("Success! Your rewards have been minted!");
          await refreshBalances();
        }
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      setTransactionStatus("Failed to process reward. Please try again.");
      toast.error("Failed to process reward");
    } finally {
      setClaimingReward(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTransactionStatus(null);
      // Stop confetti after 2 seconds for performance
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { campaignName, tokensAwarded, tier, backerWallet } = rewardData || {};

  return (
    <>
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={180}
          colors={['#00ffff', '#007bff', '#ffffff']}
        />
      )}

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        {/* Modal Content */}
        <div
          className="relative max-w-md w-full mx-4 bg-gradient-to-br from-[#0d1117]/90 to-black/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8
          transform transition-all duration-500 ease-out scale-100 opacity-100"
          style={{
            background: 'rgba(13,17,23,0.85)',
            boxShadow: '0 8px 32px 0 rgba(0, 123, 255, 0.25)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">🎉 Reward Unlocked!</h2>
            <p className="text-gray-300">Congratulations on your contribution!</p>
          </div>

          {/* Reward Details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Campaign Supported:</span>
              <span className="text-white font-semibold">{campaignName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tokens Earned:</span>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text font-bold text-lg">
                {tokensAwarded} CFND
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tier Achieved:</span>
              <span className="text-white font-semibold">{tier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Wallet:</span>
              <span className="text-gray-400 text-sm font-mono">
                {backerWallet?.slice(0, 6)}...{backerWallet?.slice(-4)}
              </span>
            </div>
          </div>

          {/* Transaction Status */}
          {transactionStatus && (
            <div className={`text-center mb-6 ${
              transactionStatus.includes('Success') ? 'text-green-400' : 'text-blue-400'
            }`}>
              {transactionStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRewardClaim}
              disabled={claimingReward}
              className={`flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 
                text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform 
                ${claimingReward ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-lg`}
            >
              {claimingReward ? 'Processing...' : 'Claim Rewards'}
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View Dashboard
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-transparent border border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenRewardModal;