/**
 * AgenticChatBot Component
 * Premium AI Agent that can execute actions on the ChainFund platform
 * Features: Voice input, Action cards, Form filling, Navigation
 * Design: Black & white theme with glassmorphism
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  Bot,
  User,
  Zap
} from 'lucide-react';

import ChatInput from './ChatInput';
import { ActionCard, SuggestionChips, TypingIndicator } from './ActionCards';
import { sendAgenticMessage, ACTION_TYPES } from '../../services/AgenticAIService';
import { useAgentActions } from '../../hooks/useAgentActions';

// Page context mapping
const getPageContext = (pathname) => {
  if (pathname.includes('create-project')) return 'CREATE_PROJECT';
  if (pathname.includes('donate')) return 'DONATE';
  if (pathname.includes('governance')) return 'GOVERNANCE';
  if (pathname.includes('projects')) return 'PROJECTS';
  return null;
};

// Smart suggestions based on current page
const getSmartSuggestions = (pathname) => {
  if (pathname.includes('create-project')) {
    return [
      { label: 'Help me create a project', message: 'Help me create a DeFi project for cross-chain lending' },
      { label: 'Suggest milestones', message: 'Suggest 4 milestones for a blockchain project with 5000 XLM goal' },
      { label: 'Improve my description', message: 'How can I write a better project description?' },
    ];
  }
  if (pathname.includes('donate')) {
    return [
      { label: 'How donations work', message: 'How does milestone-based funding work?' },
      { label: 'Donation tips', message: 'What should I consider before donating?' },
      { label: 'Payment options', message: 'What cryptocurrencies can I use to donate?' },
    ];
  }
  if (pathname.includes('governance')) {
    return [
      { label: 'Explain voting', message: 'How does quadratic voting work?' },
      { label: 'Create proposal', message: 'How do I create a governance proposal?' },
      { label: 'Voting power', message: 'How is my voting power calculated?' },
    ];
  }
  if (pathname.includes('freelancer')) {
    return [
      { label: 'Create a gig', message: 'Take me to create gig page' },
      { label: 'View my orders', message: 'Go to my orders' },
      { label: 'Check earnings', message: 'Show me my earnings' },
    ];
  }
  return [
    { label: 'Create Campaign', message: 'Take me to create a new project' },
    { label: 'Explore Projects', message: 'Go to projects page' },
    { label: 'DAO Governance', message: 'Take me to governance' },
    { label: 'About SBTs', message: 'What are SoulBound Tokens and how do they work?' },
  ];
};

/**
 * Message Bubble Component
 */
const MessageBubble = ({ message, isUser, action, onActionExecute, actionExecuted }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-start gap-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-white text-black' 
            : 'bg-gradient-to-br from-white/20 to-white/5 border border-white/10'
        }`}>
          {isUser ? (
            <User className="w-3.5 h-3.5" />
          ) : (
            <Bot className="w-3.5 h-3.5 text-white/80" />
          )}
        </div>

        <div className="space-y-2">
          {/* Message Text */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-white text-black rounded-br-sm'
                : 'bg-white/5 text-white/90 border border-white/5 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>

          {/* Action Card */}
          {action && !isUser && (
            <ActionCard
              type={action.type}
              title={getActionTitle(action)}
              description={getActionDescription(action)}
              data={action.params?.data || action.params?.milestones || action.params}
              onExecute={() => onActionExecute(action)}
              isExecuted={actionExecuted}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions for action cards
const getActionTitle = (action) => {
  const titles = {
    FILL_FORM: 'Auto-fill Project Form',
    NAVIGATE: `Navigate to ${action.params?.page}`,
    SEARCH_PROJECTS: 'Search Results',
    SUGGEST_MILESTONES: 'Suggested Milestones',
    CONNECT_WALLET: 'Connect Wallet',
    START_DONATION: 'Start Donation',
    ENHANCE_TEXT: 'Enhanced Text',
    SHOW_PROJECT: 'View Project',
  };
  return titles[action.type] || 'Action';
};

const getActionDescription = (action) => {
  const descriptions = {
    FILL_FORM: 'Click to apply suggested project details',
    NAVIGATE: 'Click to go to this page',
    SEARCH_PROJECTS: `Found matching projects`,
    SUGGEST_MILESTONES: 'Click to add these milestones',
    CONNECT_WALLET: `Connect your ${action.params?.walletType || 'wallet'}`,
    START_DONATION: 'Open donation page',
    ENHANCE_TEXT: 'Use this improved version',
  };
  return descriptions[action.type] || '';
};

/**
 * Main Agentic ChatBot Component
 */
const AgenticChatBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeAction } = useAgentActions();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Welcome to ChainFund. I'm your AI agent - I can help you create projects, navigate the platform, and execute actions. What would you like to do?",
      action: null,
      actionExecuted: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get context based on current page
  const pageContext = getPageContext(location.pathname);
  const suggestions = getSmartSuggestions(location.pathname);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage,
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get history for context
      const history = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Send to AI with page context
      const response = await sendAgenticMessage(userMessage, pageContext, history);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
        action: response.action,
        actionExecuted: false,
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'I encountered an error. Please try again.',
        action: null,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, pageContext]);

  // Handle action execution
  const handleActionExecute = useCallback(async (action) => {
    const result = await executeAction(action);
    
    // Mark action as executed
    setMessages(prev => prev.map(msg => 
      msg.action === action 
        ? { ...msg, actionExecuted: true }
        : msg
    ));

    // If action has form data, dispatch event for form to catch
    if (action.type === 'FILL_FORM' && action.params?.data) {
      window.dispatchEvent(new CustomEvent('ai-fill-form', {
        detail: { 
          formType: action.params.formType,
          data: action.params.data 
        }
      }));
    }

    // If action has milestones, dispatch event
    if (action.type === 'SUGGEST_MILESTONES' && action.params?.milestones) {
      window.dispatchEvent(new CustomEvent('ai-suggest-milestones', {
        detail: { milestones: action.params.milestones }
      }));
    }

    // Show feedback
    if (result.success) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: `Done. ${result.message}`,
        action: null,
      }]);
    }
  }, [executeAction]);

  // Clear chat
  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: "Chat cleared. How can I help you?",
      action: null,
    }]);
  };

  // Size classes based on expanded state
  const windowSize = isExpanded 
    ? 'w-[480px] h-[680px]' 
    : 'w-[380px] h-[540px]';

  return (
    <>
      {/* Floating AI Button - Premium Animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }
            }}
            exit={{ 
              scale: 0, 
              rotate: 180,
              transition: { duration: 0.2 }
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative group">
              {/* Animated ring */}
              <motion.div 
                className="absolute -inset-2 rounded-full border border-white/10"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Glow effect */}
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full blur-md"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Main button */}
              <motion.div 
                className="relative w-14 h-14 bg-black rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(255,255,255,0.1)",
                    "0 0 50px rgba(255,255,255,0.2)",
                    "0 0 30px rgba(255,255,255,0.1)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Status dot */}
              <motion.span 
                className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-black/90 backdrop-blur border border-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 whitespace-nowrap pointer-events-none">
                <span className="text-white text-xs font-medium">AI Agent</span>
                <div className="absolute top-full right-4 border-4 border-transparent border-t-white/20" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 50, 
              scale: 0.9,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }}
            className={`fixed bottom-6 right-6 ${windowSize} z-50`}
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.div 
              className="h-full bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden"
              initial={{ boxShadow: "0 0 0 rgba(255,255,255,0)" }}
              animate={{ 
                boxShadow: [
                  "0 0 60px rgba(255,255,255,0.05)",
                  "0 0 80px rgba(255,255,255,0.08)",
                  "0 0 60px rgba(255,255,255,0.05)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="px-5 py-4 border-b border-white/10 flex items-center bg-gradient-to-r from-white/[0.02] to-transparent"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </motion.div>
                    <motion.span 
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm flex items-center gap-2">
                      ChainFund AI Agent
                      <span className="px-1.5 py-0.5 text-[10px] bg-white/10 rounded text-white/60">BETA</span>
                    </h3>
                    <p className="text-white/40 text-xs">I can execute actions for you</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title={isExpanded ? 'Minimize' : 'Expand'}
                  >
                    {isExpanded ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -180 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearChat}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg.content}
                    isUser={msg.role === 'user'}
                    action={msg.action}
                    onActionExecute={handleActionExecute}
                    actionExecuted={msg.actionExecuted}
                  />
                ))}

                {isLoading && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Smart Suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-4 pb-2">
                  <p className="text-white/30 text-xs mb-2">Quick actions:</p>
                  <SuggestionChips
                    suggestions={suggestions}
                    onSelect={sendMessage}
                  />
                </div>
              )}

              {/* Input */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="p-4 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent"
              >
                <ChatInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={sendMessage}
                  isLoading={isLoading}
                  placeholder={pageContext ? `Ask about ${pageContext.toLowerCase().replace('_', ' ')}...` : 'Ask me anything or request an action...'}
                  showVoice={true}
                />
                <p className="text-white/20 text-[10px] text-center mt-2">
                  Powered by AI • Try: "Create a DeFi project" or "Go to governance"
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgenticChatBot;
