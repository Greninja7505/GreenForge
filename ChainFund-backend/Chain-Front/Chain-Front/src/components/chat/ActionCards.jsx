/**
 * ActionCard Component
 * Rich interactive cards for AI agent responses with action buttons
 * Premium black & white design matching ChainFund theme
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Search, 
  Wallet, 
  Navigation, 
  Target,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

// Icon mapping for action types
const ACTION_ICONS = {
  FILL_FORM: FileText,
  NAVIGATE: Navigation,
  SEARCH_PROJECTS: Search,
  CONNECT_WALLET: Wallet,
  ENHANCE_TEXT: Sparkles,
  SUGGEST_MILESTONES: Target,
  SHOW_PROJECT: ExternalLink,
  START_DONATION: Wallet,
  default: ArrowRight
};

/**
 * Single Action Card
 */
export const ActionCard = ({ 
  type, 
  title, 
  description, 
  data,
  onExecute, 
  onModify,
  isExecuted = false 
}) => {
  const Icon = ACTION_ICONS[type] || ACTION_ICONS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
    >
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate">{title}</h4>
          {description && (
            <p className="text-white/50 text-xs truncate">{description}</p>
          )}
        </div>
        {isExecuted && (
          <CheckCircle className="w-4 h-4 text-green-400" />
        )}
      </div>

      {/* Card Content - Show preview of data */}
      {data && (
        <div className="px-4 py-3 bg-white/[0.02]">
          {type === 'FILL_FORM' && data.title && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs w-16">Title:</span>
                <span className="text-white/90 text-xs">{data.title}</span>
              </div>
              {data.category && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs w-16">Category:</span>
                  <span className="text-white/90 text-xs">{data.category}</span>
                </div>
              )}
              {data.goal && (
                <div className="flex items-center gap-2">
                  <span className="text-white/40 text-xs w-16">Goal:</span>
                  <span className="text-white/90 text-xs">{data.goal} XLM</span>
                </div>
              )}
            </div>
          )}

          {type === 'SUGGEST_MILESTONES' && Array.isArray(data) && (
            <div className="space-y-1">
              {data.slice(0, 3).map((m, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-white/70 truncate flex-1">{m.title}</span>
                  <span className="text-white/50 ml-2">{m.amount} XLM</span>
                </div>
              ))}
              {data.length > 3 && (
                <span className="text-white/40 text-xs">+{data.length - 3} more</span>
              )}
            </div>
          )}

          {type === 'SEARCH_PROJECTS' && Array.isArray(data) && (
            <div className="space-y-1">
              {data.slice(0, 3).map((p, i) => (
                <div key={i} className="text-xs text-white/70 truncate">
                  • {p.title}
                </div>
              ))}
            </div>
          )}

          {type === 'ENHANCE_TEXT' && typeof data === 'string' && (
            <p className="text-white/70 text-xs line-clamp-3">{data}</p>
          )}

          {type === 'NAVIGATE' && (
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-white/50" />
              <span className="text-white/70 text-xs capitalize">
                Go to: {typeof data === 'string' ? data : data?.page || 'page'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Actions */}
      <div className="px-4 py-3 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onExecute}
          disabled={isExecuted}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
            isExecuted 
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {isExecuted ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Applied
            </>
          ) : (
            <>
              Apply
              <ArrowRight className="w-3 h-3" />
            </>
          )}
        </motion.button>
        
        {onModify && !isExecuted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onModify}
            className="py-2 px-4 rounded-lg text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/30 transition-all"
          >
            Modify
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Project Preview Card
 */
export const ProjectPreviewCard = ({ project, onView, onDonate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-medium truncate">{project.title}</h4>
          <p className="text-white/50 text-xs mt-1 line-clamp-2">{project.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-white/40">{project.category}</span>
            <span className="text-xs text-white/60">{project.goal} XLM</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onView}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-medium bg-white/5 text-white/80 hover:bg-white/10 transition-all"
        >
          View Details
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDonate}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-medium bg-white text-black hover:bg-white/90 transition-all"
        >
          Donate
        </motion.button>
      </div>
    </motion.div>
  );
};

/**
 * Quick Suggestion Chips
 */
export const SuggestionChips = ({ suggestions, onSelect, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {suggestions.map((suggestion, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(suggestion.message || suggestion)}
          className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
        >
          {suggestion.label || suggestion}
        </motion.button>
      ))}
    </div>
  );
};

/**
 * Typing Indicator with AI thinking animation
 */
export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-white/40 animate-pulse" />
          <div className="flex items-center gap-1">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              className="w-1.5 h-1.5 bg-white/60 rounded-full"
            />
          </div>
          <span className="text-white/30 text-xs ml-1">thinking</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActionCard;
