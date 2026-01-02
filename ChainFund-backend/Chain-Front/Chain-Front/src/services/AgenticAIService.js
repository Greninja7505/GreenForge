/**
 * Agentic AI Service
 * Enhanced AI service with function calling and action execution
 */

import { config } from '../config/environment';
import { ACTION_TYPES } from '../hooks/useAgentActions';

const GROQ_API_URL = config.groq.apiUrl;
const GROQ_API_KEY = config.groq.apiKey;
const GROQ_MODEL = config.groq.model;

// Agentic system prompt with function calling
const AGENTIC_SYSTEM_PROMPT = `You are ChainFund AI Agent - an intelligent assistant that can UNDERSTAND and EXECUTE actions on the ChainFund platform.

ChainFund is a blockchain crowdfunding platform on Stellar with:
- Project creation and milestone-based funding
- Quadratic voting governance (DAO)
- SoulBound Token (SBT) reputation badges
- Multi-chain support (Stellar XLM, ETH, Polygon MATIC)
- Freighter wallet (Stellar) and MetaMask (EVM) integration

IMPORTANT: When users request actions, you MUST respond with valid JSON containing both a message and an action.

Response Format (ALWAYS use this JSON structure when an action is needed):
{
  "message": "Your helpful response explaining what you're doing",
  "action": {
    "type": "ACTION_TYPE",
    "params": { }
  }
}

Available Actions:

1. NAVIGATE - Go to a page
   Valid pages: "home", "projects", "create project", "governance", "dashboard", "profile", "about", "causes", "giveconomy", "givfarm", "join", "freelancer", "gigs", "orders", "earnings", "create gig", "onboarding", "signin", "signup"
   Example: { "type": "NAVIGATE", "params": { "page": "projects" } }
   Example: { "type": "NAVIGATE", "params": { "page": "create project" } }
   Example: { "type": "NAVIGATE", "params": { "page": "governance" } }
   Example: { "type": "NAVIGATE", "params": { "page": "freelancer" } }

2. FILL_FORM - Fill a form with suggested data
   { "type": "FILL_FORM", "params": { "formType": "project", "data": { "title": "...", "description": "...", "category": "...", "goal": 1000 } } }

3. SEARCH_PROJECTS - Search for projects
   { "type": "SEARCH_PROJECTS", "params": { "query": "search term", "filters": { "category": "DeFi", "maxGoal": 5000 } } }

4. SHOW_PROJECT - Open a specific project
   { "type": "SHOW_PROJECT", "params": { "projectId": "project-slug" } }

5. ENHANCE_TEXT - Improve text quality
   { "type": "ENHANCE_TEXT", "params": { "field": "title|description", "enhanced": "improved text here" } }

6. SUGGEST_MILESTONES - Generate project milestones
   { "type": "SUGGEST_MILESTONES", "params": { "milestones": [{ "title": "...", "amount": 500, "description": "..." }] } }

7. CONNECT_WALLET - Initiate wallet connection
   { "type": "CONNECT_WALLET", "params": { "walletType": "freighter|metamask" } }

8. START_DONATION - Open donation for a project
   { "type": "START_DONATION", "params": { "projectSlug": "project-slug", "suggestedAmount": 100 } }

Categories: DeFi Infrastructure, Smart Contracts, Layer 2 & Scaling, NFT & Gaming, Identity & Privacy, Cross-Chain, Developer Tools, Privacy Technology

RULES:
- For navigation: use "page" values exactly as shown (e.g., "projects", "create project", "governance", "freelancer")
- For project creation help, use FILL_FORM with realistic blockchain project data
- For searches, use SEARCH_PROJECTS
- Keep message under 100 words
- Be professional, no emojis
- Always return valid JSON when an action is needed
- For general questions, just return plain text (no JSON)`;

// Context-specific prompts for different pages
const PAGE_CONTEXTS = {
  CREATE_PROJECT: `You are helping create a blockchain crowdfunding project. 
When user describes their idea, generate complete form data with:
- A compelling title (max 60 chars)
- Short description (max 200 chars)
- Full description (detailed, 500-1000 chars)
- Appropriate category from: DeFi Infrastructure, Smart Contracts, Layer 2 & Scaling, NFT & Gaming, Identity & Privacy, Cross-Chain, Developer Tools, Privacy Technology
- Realistic funding goal in XLM (100-10000)
- 3-5 milestones with amounts that sum to the goal`,

  DONATE: `You are helping a user make a donation on ChainFund.
Explain the donation process, milestone-based funding, and help them choose appropriate amounts.
You can suggest donation amounts and explain how their contribution helps.`,

  GOVERNANCE: `You are helping with DAO governance on ChainFund.
Explain quadratic voting (vote power = √tokens × reputation), proposal creation, and voting strategies.`,

  PROJECTS: `You are helping users discover and explore projects on ChainFund.
Help them search, filter, and understand project details.`,
};

/**
 * Parse AI response to extract message and action
 */
export const parseAgentResponse = (response) => {
  // Try to parse as JSON first
  try {
    // Check if response contains JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.message || parsed.action) {
        return {
          message: parsed.message || response,
          action: parsed.action || null,
          hasAction: !!parsed.action
        };
      }
    }
  } catch (e) {
    // Not JSON, return as plain message
  }
  
  return {
    message: response,
    action: null,
    hasAction: false
  };
};

/**
 * Send message to agentic AI
 */
export const sendAgenticMessage = async (message, context = null, history = []) => {
  if (!GROQ_API_KEY) {
    return {
      message: 'AI service not configured. Please set VITE_GROQ_API_KEY.',
      action: null,
      hasAction: false
    };
  }

  // Build system prompt with page context
  let systemPrompt = AGENTIC_SYSTEM_PROMPT;
  if (context && PAGE_CONTEXTS[context]) {
    systemPrompt += `\n\nCurrent Context: ${PAGE_CONTEXTS[context]}`;
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
          { role: 'system', content: systemPrompt },
          ...history.slice(-8).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.7,
        stream: false
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'API Error');
    }

    const aiResponse = data.choices?.[0]?.message?.content || '';
    return parseAgentResponse(aiResponse);

  } catch (error) {
    console.error('Agentic AI error:', error);
    return {
      message: 'Connection error. Please try again.',
      action: null,
      hasAction: false
    };
  }
};

/**
 * Generate enhanced text
 */
export const enhanceText = async (text, type = 'description') => {
  if (!GROQ_API_KEY || !text?.trim()) {
    return text;
  }

  const prompts = {
    title: `Improve this project title to be more compelling and professional. Keep under 60 characters. Return only the improved title:\n\n${text}`,
    description: `Enhance this project description to be more compelling, professional, and clear. Keep the core meaning. Return only the improved text:\n\n${text}`,
    milestone: `Improve this milestone description to be clearer and more specific. Return only the improved text:\n\n${text}`,
  };

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
          { role: 'system', content: 'You are a professional copywriter. Improve text quality while keeping the meaning. Return only the improved text, no explanations.' },
          { role: 'user', content: prompts[type] || prompts.description }
        ],
        max_tokens: 300,
        temperature: 0.6
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
};

/**
 * Generate milestones for a project
 */
export const generateMilestones = async (projectTitle, projectDescription, goalAmount) => {
  if (!GROQ_API_KEY) {
    return [];
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
          { 
            role: 'system', 
            content: `Generate 4 realistic milestones for a blockchain project. Return ONLY a JSON array with objects containing title, amount (number), and description. Amounts should sum to approximately the goal amount.` 
          },
          { 
            role: 'user', 
            content: `Project: ${projectTitle}\nDescription: ${projectDescription}\nGoal: ${goalAmount} XLM\n\nGenerate 4 milestones as JSON array.` 
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse milestones from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Generate milestones error:', error);
    return [];
  }
};

export { ACTION_TYPES };
