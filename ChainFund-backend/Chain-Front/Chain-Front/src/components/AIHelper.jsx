/**
 * AI Helper Component - Contextual AI assistance for different pages
 * Can be embedded inline or as a modal
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { sendAIMessage, AI_CONTEXTS } from '../services/AIService';

const AIHelper = ({
  context = 'GENERAL',
  title,
  placeholder = 'Ask AI for help...',
  suggestions = [],
  compact = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const aiContext = AI_CONTEXTS[context] || AI_CONTEXTS.GENERAL;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setShowResponse(true);

    try {
      const result = await sendAIMessage(input, context);
      setResponse(result);
    } catch (error) {
      setResponse('Unable to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async (suggestion) => {
    setInput(suggestion);
    setIsLoading(true);
    setShowResponse(true);

    try {
      const result = await sendAIMessage(suggestion, context);
      setResponse(result);
    } catch (error) {
      setResponse('Unable to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact && !isExpanded) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:border-white/30 transition-all ${className}`}
      >
        <Sparkles className="w-4 h-4 text-white/70" />
        <span>AI Assistant</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-black border border-white/10 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-white">{title || aiContext.name}</h4>
            <p className="text-xs text-white/40 font-light">Powered by AI</p>
          </div>
        </div>
        {compact && (
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && !showResponse && (
        <div className="px-4 py-3 border-b border-white/5">
          <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Quick questions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestion(suggestion)}
                className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-full text-white/70 hover:text-white transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Response Area */}
      <AnimatePresence>
        {showResponse && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 border-b border-white/5"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            ) : (
              <div>
                <p className="text-sm text-white/80 font-light leading-relaxed">{response}</p>
                <button
                  onClick={() => setShowResponse(false)}
                  className="mt-2 text-xs text-white/50 hover:text-white underline underline-offset-4"
                >
                  Ask another question
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10 focus-within:border-white/30 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white text-sm placeholder-white/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/90 transition-all font-bold"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <Send className="w-4 h-4 text-black" />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AIHelper;
