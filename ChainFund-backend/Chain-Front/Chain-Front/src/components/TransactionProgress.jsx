import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Transaction Progress Indicator
 * Shows step-by-step progress for blockchain transactions
 */

const steps = [
  { id: 'prepare', label: 'Preparing' },
  { id: 'sign', label: 'Signing' },
  { id: 'submit', label: 'Submitting' },
  { id: 'confirm', label: 'Confirming' },
  { id: 'complete', label: 'Complete' }
];

export const TransactionProgress = ({ 
  currentStep, 
  status = 'pending',
  txHash = null,
  error = null,
  onClose 
}) => {
  const stepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black border border-white/10 rounded-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {status === 'error' ? 'Transaction Failed' : 
             status === 'success' ? 'Transaction Complete' : 
             'Processing Transaction'}
          </h3>
          {(status === 'success' || status === 'error') && (
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, index) => {
            const isActive = index === stepIndex;
            const isComplete = index < stepIndex || status === 'success';
            const isFailed = status === 'error' && index === stepIndex;

            return (
              <div key={step.id} className="flex items-center gap-3">
                {/* Step indicator */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isComplete ? 'bg-white text-black' : 
                    isActive ? 'bg-white/20 text-white border border-white/40' : 
                    isFailed ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    'bg-white/5 text-white/30'}
                `}>
                  {isComplete ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isFailed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step label */}
                <span className={`text-sm ${
                  isComplete ? 'text-white' : 
                  isActive ? 'text-white' : 
                  isFailed ? 'text-red-400' :
                  'text-white/30'
                }`}>
                  {step.label}
                </span>

                {/* Loading spinner for active step */}
                {isActive && status === 'pending' && (
                  <div className="ml-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transaction Hash */}
        {txHash && (
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-white/50 text-xs mb-1">Transaction Hash</p>
            <div className="flex items-center gap-2">
              <code className="text-white text-xs font-mono flex-1 truncate">
                {txHash}
              </code>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
            <p className="text-green-400 text-sm">
              Transaction confirmed successfully!
            </p>
          </div>
        )}

        {/* Action Button */}
        {(status === 'success' || status === 'error') && (
          <button
            onClick={onClose}
            className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            {status === 'success' ? 'Done' : 'Close'}
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * Simple loading spinner
 */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-white/20 border-t-white rounded-full ${className}`}
    />
  );
};

/**
 * Button with loading state
 */
export const LoadingButton = ({ 
  loading, 
  children, 
  className = '',
  disabled,
  ...props 
}) => (
  <button
    disabled={loading || disabled}
    className={`relative ${className} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    {...props}
  >
    <span className={loading ? 'invisible' : ''}>{children}</span>
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    )}
  </button>
);

/**
 * Inline transaction status
 */
export const TransactionStatus = ({ status, message }) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pending' },
    success: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Success' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Failed' },
    confirming: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Confirming' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`${config.bg} rounded-lg px-3 py-2 flex items-center gap-2`}>
      {status === 'pending' || status === 'confirming' ? (
        <Spinner size="sm" />
      ) : status === 'success' ? (
        <svg className={`w-4 h-4 ${config.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className={`w-4 h-4 ${config.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={`text-sm ${config.text}`}>
        {message || config.label}
      </span>
    </div>
  );
};

/**
 * Hook for managing transaction state
 */
export const useTransactionState = () => {
  const [state, setState] = React.useState({
    isOpen: false,
    currentStep: 'prepare',
    status: 'pending',
    txHash: null,
    error: null
  });

  const start = () => setState({
    isOpen: true,
    currentStep: 'prepare',
    status: 'pending',
    txHash: null,
    error: null
  });

  const setStep = (step) => setState(prev => ({ ...prev, currentStep: step }));

  const setSuccess = (txHash) => setState(prev => ({
    ...prev,
    currentStep: 'complete',
    status: 'success',
    txHash
  }));

  const setError = (error) => setState(prev => ({
    ...prev,
    status: 'error',
    error: typeof error === 'string' ? error : error.message
  }));

  const close = () => setState(prev => ({ ...prev, isOpen: false }));

  return {
    ...state,
    start,
    setStep,
    setSuccess,
    setError,
    close
  };
};

export default TransactionProgress;
