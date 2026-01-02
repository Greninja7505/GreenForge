/**
 * ChatInput Component
 * Premium input with voice support and smart suggestions
 * Black & white design matching ChainFund theme
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';

/**
 * Voice recognition hook
 */
const useVoiceInput = (onTranscript) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return { isListening, isSupported, toggleListening, startListening, stopListening };
};

/**
 * Premium Chat Input Component
 */
const ChatInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading = false,
  placeholder = 'Type your message...',
  showVoice = true,
  showEnhance = false,
  onEnhance,
  className = ''
}) => {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleVoiceTranscript = (transcript) => {
    onChange(transcript);
  };

  const { isListening, isSupported, toggleListening } = useVoiceInput(handleVoiceTranscript);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div 
        className={`
          relative flex items-center gap-2 
          bg-white/5 rounded-xl px-4 py-2 
          border transition-all duration-200
          ${isFocused 
            ? 'border-white/30 bg-white/[0.07] shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
            : 'border-white/10'
          }
          ${isListening ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
      >
        {/* Voice indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs">Listening...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhance button */}
        {showEnhance && value.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            type="button"
            onClick={() => onEnhance?.(value)}
            className="p-1.5 text-white/40 hover:text-purple-400 transition-colors"
            title="Enhance with AI"
          >
            <Sparkles className="w-4 h-4" />
          </motion.button>
        )}

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isListening ? 'Speak now...' : placeholder}
          disabled={isLoading}
          className="flex-1 bg-transparent text-white text-sm placeholder-white/30 focus:outline-none disabled:opacity-50"
        />

        {/* Voice Button */}
        {showVoice && isSupported && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            className={`p-1.5 rounded-lg transition-all ${
              isListening 
                ? 'text-red-400 bg-red-500/10' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </motion.button>
        )}

        {/* Send Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading || !value.trim()}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center 
            transition-all duration-200
            ${value.trim() && !isLoading
              ? 'bg-white text-black hover:bg-white/90' 
              : 'bg-white/10 text-white/20 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Character count for long inputs */}
      {value.length > 200 && (
        <div className="mt-1 text-right">
          <span className={`text-xs ${value.length > 500 ? 'text-red-400' : 'text-white/30'}`}>
            {value.length}/500
          </span>
        </div>
      )}
    </form>
  );
};

export default ChatInput;
