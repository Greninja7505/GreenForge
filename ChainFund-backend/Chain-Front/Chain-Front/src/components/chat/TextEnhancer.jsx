/**
 * TextEnhancer Component
 * Inline AI text enhancement button that can be added to any text input
 * Premium black & white design
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Check, X, RotateCcw } from 'lucide-react';
import { enhanceText } from '../../services/AgenticAIService';

/**
 * Text Enhancer Button & Modal
 */
const TextEnhancer = ({ 
  text, 
  onEnhance, 
  type = 'description',
  className = '',
  buttonOnly = false 
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedText, setEnhancedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  const handleEnhance = async () => {
    if (!text?.trim() || isEnhancing) return;
    
    setIsEnhancing(true);
    setError(null);
    
    try {
      const result = await enhanceText(text, type);
      if (result && result !== text) {
        setEnhancedText(result);
        setShowPreview(true);
      } else {
        setError('Text is already optimal');
      }
    } catch (err) {
      setError('Enhancement failed');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApply = () => {
    if (enhancedText && onEnhance) {
      onEnhance(enhancedText);
      setShowPreview(false);
      setEnhancedText('');
    }
  };

  const handleReject = () => {
    setShowPreview(false);
    setEnhancedText('');
  };

  if (buttonOnly) {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEnhance}
        disabled={isEnhancing || !text?.trim()}
        className={`
          p-2 rounded-lg transition-all flex items-center gap-1.5
          ${isEnhancing 
            ? 'bg-white/10 text-white/50 cursor-wait' 
            : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30'
          }
          disabled:opacity-30 disabled:cursor-not-allowed
          ${className}
        `}
        title="Enhance with AI"
      >
        {isEnhancing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="text-xs">Enhance</span>
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Enhance Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleEnhance}
        disabled={isEnhancing || !text?.trim()}
        className={`
          absolute top-2 right-2 z-10 p-1.5 rounded-lg transition-all
          ${isEnhancing 
            ? 'bg-white/20 text-white' 
            : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'
          }
          disabled:opacity-30 disabled:cursor-not-allowed
        `}
        title="Enhance with AI"
      >
        {isEnhancing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </motion.button>

      {/* Enhancement Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-20"
          >
            <div className="bg-black border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white font-medium">AI Enhanced Version</span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10 max-h-40 overflow-y-auto">
                  <p className="text-sm text-white/90 leading-relaxed">{enhancedText}</p>
                </div>

                {/* Comparison */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-1">Original:</p>
                  <p className="text-xs text-white/60 line-clamp-2">{text}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/10 flex items-center gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 py-2 px-4 bg-white text-black rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Apply
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnhance}
                  className="py-2 px-4 bg-white/5 text-white/70 rounded-lg text-sm flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  className="py-2 px-4 text-white/50 hover:text-white rounded-lg text-sm transition-all"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onAnimationComplete={() => setTimeout(() => setError(null), 2000)}
            className="absolute top-0 right-0 mt-12 mr-2 px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-lg"
          >
            <span className="text-xs text-red-400">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Enhanced Textarea with AI enhancement
 */
export const EnhancedTextarea = ({
  value,
  onChange,
  placeholder,
  label,
  rows = 4,
  type = 'description',
  className = '',
  ...props
}) => {
  const handleEnhance = (enhancedText) => {
    onChange({ target: { value: enhancedText, name: props.name } });
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm text-white/70 mb-2">{label}</label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/30 focus:border-white/30 focus:outline-none transition-all resize-none"
          {...props}
        />
        {value?.trim() && (
          <TextEnhancer 
            text={value} 
            onEnhance={handleEnhance} 
            type={type}
          />
        )}
      </div>
    </div>
  );
};

export default TextEnhancer;
