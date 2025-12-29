import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * SoulBound Token (SBT) Badge Display
 * Shows user's non-transferable reputation tokens
 */

// SBT Role definitions with metadata
const SBT_ROLES = {
  BACKER: {
    name: 'Backer',
    description: 'Contributed to campaigns',
    icon: '💎',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30'
  },
  CREATOR: {
    name: 'Creator',
    description: 'Created campaigns',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30'
  },
  VERIFIED: {
    name: 'Verified',
    description: 'Identity verified',
    icon: '✓',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30'
  },
  EARLY_ADOPTER: {
    name: 'Early Adopter',
    description: 'Joined during beta',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30'
  },
  TOP_BACKER: {
    name: 'Top Backer',
    description: 'Top 10% contributor',
    icon: '👑',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30'
  },
  VOTER: {
    name: 'Active Voter',
    description: 'Participated in governance',
    icon: '🗳️',
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30'
  },
  SUCCESSFUL_CREATOR: {
    name: 'Successful Creator',
    description: 'Completed funded campaign',
    icon: '🏆',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30'
  },
  COMMUNITY_LEADER: {
    name: 'Community Leader',
    description: 'Community contributor',
    icon: '🌟',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30'
  }
};

/**
 * Individual SBT Badge
 */
export const SbtBadge = ({ role, size = 'md', showLabel = true }) => {
  const roleData = SBT_ROLES[role] || SBT_ROLES.BACKER;
  
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="group relative"
    >
      <div className={`
        ${sizes[size]} 
        ${roleData.bgColor} 
        ${roleData.borderColor}
        border rounded-xl flex items-center justify-center
        cursor-pointer transition-all
      `}>
        <span>{roleData.icon}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
        <div className="bg-black border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap">
          <p className="text-white text-xs font-medium">{roleData.name}</p>
          {showLabel && (
            <p className="text-white/50 text-xs">{roleData.description}</p>
          )}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
      </div>
    </motion.div>
  );
};

/**
 * SBT Badge Grid - Shows multiple badges
 */
export const SbtBadgeGrid = ({ roles = [], maxDisplay = 5 }) => {
  const displayRoles = roles.slice(0, maxDisplay);
  const remaining = roles.length - maxDisplay;

  if (roles.length === 0) {
    return (
      <div className="text-white/40 text-sm">
        No badges earned yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {displayRoles.map((role, index) => (
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <SbtBadge role={role} size="md" />
        </motion.div>
      ))}
      
      {remaining > 0 && (
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
          <span className="text-white/50 text-sm">+{remaining}</span>
        </div>
      )}
    </div>
  );
};

/**
 * SBT Profile Section - Full display for profile page
 */
export const SbtProfileSection = ({ 
  roles = [], 
  reputation = 0,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="bg-black border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-white/5 rounded" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">Reputation Badges</h3>
          <p className="text-white/50 text-sm">SoulBound Tokens (Non-transferable)</p>
        </div>
        
        {/* Reputation Score */}
        <div className="text-right">
          <p className="text-white/50 text-xs">Reputation Score</p>
          <p className="text-white text-2xl font-bold">{reputation}</p>
        </div>
      </div>

      {/* Badges */}
      {roles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {roles.map((role) => {
            const roleData = SBT_ROLES[role] || SBT_ROLES.BACKER;
            return (
              <motion.div
                key={role}
                whileHover={{ scale: 1.02 }}
                className={`
                  ${roleData.bgColor} ${roleData.borderColor}
                  border rounded-xl p-4 cursor-pointer transition-all
                `}
              >
                <div className="text-2xl mb-2">{roleData.icon}</div>
                <p className="text-white text-sm font-medium">{roleData.name}</p>
                <p className="text-white/50 text-xs">{roleData.description}</p>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-white font-medium">No badges yet</p>
          <p className="text-white/50 text-sm">
            Participate in campaigns to earn reputation badges
          </p>
        </div>
      )}

      {/* How to earn */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-white/30 text-xs">
          Badges are automatically awarded based on your platform activity.
          They are non-transferable and permanently linked to your wallet.
        </p>
      </div>
    </div>
  );
};

/**
 * Mini badge display for cards/lists
 */
export const SbtMiniBadges = ({ roles = [] }) => {
  if (roles.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {roles.slice(0, 3).map((role) => {
        const roleData = SBT_ROLES[role];
        if (!roleData) return null;
        return (
          <span
            key={role}
            className="text-xs"
            title={roleData.name}
          >
            {roleData.icon}
          </span>
        );
      })}
      {roles.length > 3 && (
        <span className="text-white/30 text-xs">+{roles.length - 3}</span>
      )}
    </div>
  );
};

/**
 * Hook to fetch user SBTs
 */
export const useSbtData = (walletAddress) => {
  const [data, setData] = useState({
    roles: [],
    reputation: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!walletAddress) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchSbts = async () => {
      try {
        // TODO: Replace with actual contract call
        // For now, return mock data based on address
        await new Promise(r => setTimeout(r, 500));
        
        // Mock logic - give some badges based on address hash
        const mockRoles = [];
        const hash = walletAddress.slice(-8);
        
        if (parseInt(hash[0], 16) > 8) mockRoles.push('BACKER');
        if (parseInt(hash[1], 16) > 10) mockRoles.push('VERIFIED');
        if (parseInt(hash[2], 16) > 12) mockRoles.push('EARLY_ADOPTER');
        if (parseInt(hash[3], 16) > 14) mockRoles.push('TOP_BACKER');
        
        setData({
          roles: mockRoles,
          reputation: mockRoles.length * 100 + Math.floor(Math.random() * 50),
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchSbts();
  }, [walletAddress]);

  return data;
};

export default {
  SbtBadge,
  SbtBadgeGrid,
  SbtProfileSection,
  SbtMiniBadges,
  useSbtData,
  SBT_ROLES
};
