import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { config } from '../config/environment';

/**
 * ChainFund AI Assistant - Premium Black & White Design
 */

// Groq API Configuration from environment
const GROQ_API_URL = config.groq.apiUrl;
const GROQ_API_KEY = config.groq.apiKey;
const GROQ_MODEL = config.groq.model;

// System prompt
const SYSTEM_PROMPT = `You are the ChainFund AI Assistant. ChainFund is a crowdfunding platform on Stellar blockchain.

Help users with:
- Creating crowdfunding campaigns
- Milestone-based funding
- Quadratic voting governance
- SoulBound Tokens (SBT) reputation
- Freighter wallet connection
- Smart contracts on Stellar

Be concise and professional. No emojis. Keep responses under 100 words.`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to ChainFund. I'm here to help you navigate our crowdfunding platform. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    const newUserMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(-6),
            newUserMessage
          ],
          max_tokens: 300,
          temperature: 0.7,
          stream: false
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      const assistantMessage = data.choices?.[0]?.message?.content || 'Unable to process your request.';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection error. Please check your network and try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const quickActions = [
    { label: 'Create Campaign', message: 'How do I create a campaign?' },
    { label: 'How Funding Works', message: 'Explain milestone-based funding' },
    { label: 'Connect Wallet', message: 'How to connect my Stellar wallet?' },
    { label: 'About SBTs', message: 'What are SoulBound Tokens?' }
  ];

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I assist you?"
    }]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 ${isOpen ? 'hidden' : 'flex'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] border border-white/20">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full border-2 border-black" />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[360px] h-[520px] z-50"
          >
            <div className="h-full bg-black rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.47 4.409a2.25 2.25 0 01-2.136 1.541H8.606a2.25 2.25 0 01-2.136-1.541L5 14.5m14 0H5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">ChainFund AI</h3>
                    <p className="text-white/40 text-xs">Always available</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    title="Clear"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-white text-black rounded-br-sm'
                          : 'bg-white/5 text-white/90 border border-white/5 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(action.message)}
                        className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-white/5">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/5 focus-within:border-white/20 transition-all">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-white text-sm placeholder-white/30 focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/90 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
