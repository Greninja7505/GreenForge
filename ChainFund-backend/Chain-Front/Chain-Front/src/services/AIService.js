/**
 * ChainFund AI Service
 * Centralized AI service using Groq API for different use cases
 */

import { config } from '../config/environment';

const GROQ_API_URL = config.groq.apiUrl;
const GROQ_API_KEY = config.groq.apiKey;
const GROQ_MODEL = config.groq.model;

// Different AI personas for different contexts
export const AI_CONTEXTS = {
  // General chat assistant
  GENERAL: {
    name: 'ChainFund Assistant',
    systemPrompt: `You are the ChainFund AI Assistant. ChainFund is a crowdfunding platform on Stellar blockchain.
Help users with: campaigns, milestone funding, quadratic voting, SBT badges, wallet connection, donations.
Be concise and professional. No emojis. Keep responses under 100 words.`
  },

  // Project creation helper
  PROJECT_CREATOR: {
    name: 'Campaign Advisor',
    systemPrompt: `You are a Campaign Creation Advisor for ChainFund, a Stellar blockchain crowdfunding platform.
Help users create compelling campaigns:
- Suggest clear titles and descriptions
- Recommend realistic funding goals
- Help define milestones (3-5 recommended)
- Suggest categories and tags
- Write engaging pitch content
Be specific and actionable. Keep responses under 150 words.`
  },

  // Donation advisor
  DONATION_ADVISOR: {
    name: 'Donation Guide',
    systemPrompt: `You are a Donation Advisor for ChainFund.
Help donors:
- Understand project legitimacy
- Explain milestone-based funding (funds released on milestones)
- Explain XLM, ETH, MATIC payment options
- Explain SBT rewards for donors
- Guide wallet connection (Freighter for Stellar, MetaMask for EVM)
Be helpful and encouraging. Keep responses under 100 words.`
  },

  // Governance helper
  GOVERNANCE_HELPER: {
    name: 'DAO Governance Guide',
    systemPrompt: `You are a DAO Governance Guide for ChainFund.
Explain:
- Quadratic voting: vote power = √(tokens × reputation)
- Proposal creation and voting
- Reputation from SBT badges
- How governance decisions affect projects
- Voting strategies
Be clear about blockchain democracy. Keep responses under 120 words.`
  },

  // Technical support
  TECH_SUPPORT: {
    name: 'Technical Support',
    systemPrompt: `You are Technical Support for ChainFund.
Help with:
- Freighter wallet setup and connection
- MetaMask setup for ETH/Polygon
- Transaction issues
- Smart contract interactions
- Network switching (Testnet/Mainnet)
Provide step-by-step guidance. Keep responses under 150 words.`
  },

  // Investment analyzer
  PROJECT_ANALYZER: {
    name: 'Project Analyzer',
    systemPrompt: `You are a Project Analyzer for ChainFund crowdfunding.
When given project details, analyze:
- Funding goal feasibility
- Milestone clarity and achievability
- Team/creator credibility signals
- Risk factors
- Potential impact
Be balanced and objective. Mention both strengths and concerns. Keep responses under 200 words.`
  }
};

/**
 * Send a message to the AI with specific context
 * @param {string} message - User message
 * @param {string} context - AI context from AI_CONTEXTS
 * @param {Array} history - Previous messages for context
 * @returns {Promise<string>} - AI response
 */
export const sendAIMessage = async (message, context = 'GENERAL', history = []) => {
  const aiContext = AI_CONTEXTS[context] || AI_CONTEXTS.GENERAL;
  
  if (!GROQ_API_KEY) {
    return 'AI service not configured. Please set VITE_GROQ_API_KEY in your environment.';
  }

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
          { role: 'system', content: aiContext.systemPrompt },
          ...history.slice(-6),
          { role: 'user', content: message }
        ],
        max_tokens: 400,
        temperature: 0.7,
        stream: false
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    return data.choices?.[0]?.message?.content || 'Unable to process your request.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'Connection error. Please try again.';
  }
};

/**
 * Generate project description from basic info
 */
export const generateProjectDescription = async (projectInfo) => {
  const prompt = `Generate a compelling crowdfunding campaign description for:
Title: ${projectInfo.title}
Category: ${projectInfo.category}
Goal: $${projectInfo.goal}
Brief: ${projectInfo.brief}

Write a 2-3 paragraph description that inspires donations.`;

  return sendAIMessage(prompt, 'PROJECT_CREATOR');
};

/**
 * Suggest milestones for a project
 */
export const suggestMilestones = async (projectInfo) => {
  const prompt = `Suggest 4 milestones for this crowdfunding campaign:
Title: ${projectInfo.title}
Category: ${projectInfo.category}
Goal: $${projectInfo.goal}
Description: ${projectInfo.description}

Format: List 4 milestones with title, percentage of funds, and brief description.`;

  return sendAIMessage(prompt, 'PROJECT_CREATOR');
};

/**
 * Analyze a project for potential donors
 */
export const analyzeProject = async (project) => {
  const prompt = `Analyze this crowdfunding project:
Title: ${project.title}
Goal: $${project.goal}
Raised: $${project.raised || 0}
Category: ${project.category}
Description: ${project.description}
Milestones: ${project.milestones?.length || 0}

Provide a balanced analysis for potential donors.`;

  return sendAIMessage(prompt, 'PROJECT_ANALYZER');
};

/**
 * Get quick tips based on context
 */
export const getQuickTips = async (context) => {
  const tips = {
    donation: 'What should I know before donating?',
    project: 'How do I create a successful campaign?',
    governance: 'How does quadratic voting work?',
    wallet: 'How do I connect my wallet?'
  };
  
  return sendAIMessage(tips[context] || tips.donation, context.toUpperCase());
};

export default {
  sendAIMessage,
  generateProjectDescription,
  suggestMilestones,
  analyzeProject,
  getQuickTips,
  AI_CONTEXTS
};
