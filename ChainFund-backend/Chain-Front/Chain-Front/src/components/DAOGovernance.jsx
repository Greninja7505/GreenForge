/**
 * DAO Governance System with Quadratic Voting
 * Implements fair voting weighted by SBT reputation
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vote,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { useStellar } from '../context/StellarContext';
import toast from 'react-hot-toast';

// ============================================
// QUADRATIC VOTING LOGIC
// ============================================

/**
 * Calculate quadratic vote power
 * Formula: √(tokens) × reputation_multiplier
 * 
 * This prevents whales from dominating governance while
 * rewarding high-reputation users.
 * 
 * @param {number} tokens - Number of tokens/stake held
 * @param {number} reputationScore - User's SBT reputation (0-2)
 * @returns {number} - Calculated vote power
 */
export const calculateQuadraticVotePower = (tokens, reputationScore = 1.0) => {
  // Base quadratic calculation
  const baseVotes = Math.sqrt(Math.max(0, tokens));

  // Reputation multiplier (0.1 to 2.0)
  const multiplier = Math.max(0.1, Math.min(2.0, reputationScore));

  // Final vote power
  return Math.floor(baseVotes * multiplier * 100) / 100;
};

/**
 * Calculate reputation score from SBT badges
 * Different badges contribute different amounts
 */
export const calculateReputationFromBadges = (badges = []) => {
  const badgeWeights = {
    'BACKER': 0.1,
    'CREATOR': 0.15,
    'VERIFIED': 0.2,
    'EARLY_ADOPTER': 0.1,
    'TOP_BACKER': 0.25,
    'VOTER': 0.1,
    'SUCCESSFUL_CREATOR': 0.3,
    'COMMUNITY_LEADER': 0.2,
    'SCAM_REPORTER': 0.15,
    'GOVERNANCE_ACTIVE': 0.15,
  };

  let score = 0.5; // Base score for any connected wallet

  badges.forEach(badge => {
    const weight = badgeWeights[badge] || 0.05;
    score += weight;
  });

  return Math.min(2.0, score); // Cap at 2x multiplier
};

/**
 * Anti-Sybil check - basic heuristics
 */
export const calculateSybilRisk = (account) => {
  let risk = 0;

  // New account
  if (account.ageInDays < 7) risk += 30;
  else if (account.ageInDays < 30) risk += 15;

  // Low activity
  if (account.transactionCount < 5) risk += 20;

  // No badges
  if (!account.badges || account.badges.length === 0) risk += 25;

  // Suspicious patterns
  if (account.rapidVotes) risk += 30;

  return Math.min(100, risk);
};

// ============================================
// PROPOSAL STATUS
// ============================================

const PROPOSAL_STATUS = {
  ACTIVE: 'active',
  PASSED: 'passed',
  REJECTED: 'rejected',
  PENDING: 'pending',
  EXECUTED: 'executed',
};

const STATUS_CONFIG = {
  [PROPOSAL_STATUS.ACTIVE]: {
    color: 'text-white',
    bg: 'bg-white/10',
    border: 'border-white/30',
    icon: Clock
  },
  [PROPOSAL_STATUS.PASSED]: {
    color: 'text-white',
    bg: 'bg-white/10',
    border: 'border-white/30',
    icon: CheckCircle
  },
  [PROPOSAL_STATUS.REJECTED]: {
    color: 'text-white/40',
    bg: 'bg-white/5',
    border: 'border-white/10',
    icon: XCircle
  },
  [PROPOSAL_STATUS.PENDING]: {
    color: 'text-white/40',
    bg: 'bg-white/5',
    border: 'border-white/10',
    icon: AlertCircle
  },
  [PROPOSAL_STATUS.EXECUTED]: {
    color: 'text-white',
    bg: 'bg-white/20',
    border: 'border-white/40',
    icon: CheckCircle
  },
};

// ============================================
// MOCK DATA (Replace with contract calls)
// ============================================

const MOCK_PROPOSALS = [
  {
    id: 1,
    title: 'Increase Milestone Approval Threshold to 60%',
    description: 'Proposal to increase the vote threshold required for milestone approval from 50% to 60% to ensure stronger community consensus.',
    proposer: 'GCMJ...XKQQ',
    status: PROPOSAL_STATUS.ACTIVE,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    forVotes: 1250,
    againstVotes: 430,
    totalVoters: 89,
    quorum: 2000,
    category: 'governance',
  },
  {
    id: 2,
    title: 'Add Polygon Support for Donations',
    description: 'Enable users to fund projects using MATIC on Polygon network to reduce gas fees and increase accessibility.',
    proposer: 'GBXY...MNOP',
    status: PROPOSAL_STATUS.PASSED,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    forVotes: 3420,
    againstVotes: 890,
    totalVoters: 234,
    quorum: 2000,
    category: 'feature',
  },
  {
    id: 3,
    title: 'Reduce Platform Fee from 3% to 2%',
    description: 'Lower the platform fee to attract more project creators and increase overall funding volume.',
    proposer: 'GDEF...UVWX',
    status: PROPOSAL_STATUS.REJECTED,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    forVotes: 890,
    againstVotes: 1560,
    totalVoters: 156,
    quorum: 2000,
    category: 'economics',
  },
];

// ============================================
// COMPONENTS
// ============================================

/**
 * Vote Power Display
 */
const VotePowerCard = ({ tokens = 100, badges = ['BACKER', 'VERIFIED'] }) => {
  const reputation = calculateReputationFromBadges(badges);
  const votePower = calculateQuadraticVotePower(tokens, reputation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black border border-white/10 rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white/70" />
        </div>
        <div>
          <h3 className="text-white font-medium uppercase tracking-wider text-sm">Your Voting Power</h3>
          <p className="text-xs text-white/40 font-light">Based on quadratic voting</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Vote Power */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-white">{votePower}</p>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">effective votes</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Reputation: <span className="text-white">{reputation.toFixed(2)}x</span></p>
            <p className="text-[10px] text-white/20 uppercase">from {badges.length} badges</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/40 font-light">Base tokens</span>
            <span className="text-white font-medium">{tokens}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40 font-light">√ Quadratic base</span>
            <span className="text-white font-medium">{Math.sqrt(tokens).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/40 font-light">× Reputation multiplier</span>
            <span className="text-white font-medium">{reputation.toFixed(2)}x</span>
          </div>
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-white/10">
            <span className="text-white/60">Final vote power</span>
            <span className="text-white">{votePower}</span>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
          <p className="text-[10px] text-white/30 font-mono text-center">
            √({tokens}) × {reputation.toFixed(2)} = {votePower}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Proposal Card
 */
const ProposalCard = ({ proposal, onVote, userVote, votePower }) => {
  const [expanded, setExpanded] = useState(false);
  const [voting, setVoting] = useState(false);

  const StatusIcon = STATUS_CONFIG[proposal.status]?.icon || AlertCircle;
  const statusStyle = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.pending;

  const totalVotes = proposal.forVotes + proposal.againstVotes;
  const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
  const quorumPercentage = Math.min(100, (totalVotes / proposal.quorum) * 100);

  const timeLeft = proposal.endTime > new Date()
    ? Math.ceil((proposal.endTime - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleVote = async (support) => {
    setVoting(true);
    try {
      await onVote(proposal.id, support);
      toast.success(`Voted ${support ? 'For' : 'Against'} with ${votePower} votes!`);
    } catch (error) {
      toast.error('Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all group"
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusStyle.bg} ${statusStyle.border} ${statusStyle.color} border mb-4`}>
              <StatusIcon className="w-3 h-3" />
              <span>{proposal.status}</span>
            </div>

            <h3 className="text-xl font-medium text-white mb-2 group-hover:text-white transition-colors">{proposal.title}</h3>

            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="font-light">by {proposal.proposer}</span>
              {proposal.status === PROPOSAL_STATUS.ACTIVE && (
                <span className="flex items-center gap-1 font-light">
                  <Clock className="w-3.5 h-3.5" />
                  {timeLeft} days left
                </span>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="p-1"
          >
            <ChevronDown className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
          </motion.div>
        </div>

        {/* Vote Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2 uppercase tracking-widest font-bold">
            <span className="text-white/60">{proposal.forVotes} For</span>
            <span className="text-white/20">{proposal.againstVotes} Against</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/20 mt-2 uppercase tracking-tight font-light">
            <span>{forPercentage.toFixed(1)}% approval</span>
            <span>{proposal.totalVoters} voters</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed font-light">
                {proposal.description}
              </p>

              {/* Quorum Progress */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-xs mb-2 uppercase tracking-widest">
                  <span className="text-white/40">Quorum Progress</span>
                  <span className="text-white">{totalVotes} / {proposal.quorum}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-white`}
                    style={{ width: `${quorumPercentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-white/20 mt-2 uppercase">
                  {quorumPercentage >= 100 ? '✓ Quorum reached' : `${(100 - quorumPercentage).toFixed(1)}% more needed`}
                </p>
              </div>

              {/* Vote Buttons */}
              {proposal.status === PROPOSAL_STATUS.ACTIVE && (
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.stopPropagation(); handleVote(true); }}
                    disabled={voting || userVote !== null}
                    className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest transition-all ${userVote === true
                        ? 'bg-white text-black'
                        : 'bg-white/10 border border-white/10 text-white hover:bg-white/20'
                      } disabled:opacity-20`}
                  >
                    {voting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                    <span>Vote For</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => { e.stopPropagation(); handleVote(false); }}
                    disabled={voting || userVote !== null}
                    className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs tracking-widest transition-all ${userVote === false
                        ? 'bg-white/20 border border-white/40 text-white'
                        : 'bg-transparent border border-white/10 text-white/40 hover:text-white hover:border-white/20'
                      } disabled:opacity-20`}
                  >
                    {voting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsDown className="w-4 h-4" />}
                    <span>Vote Against</span>
                  </motion.button>
                </div>
              )}

              {userVote !== null && (
                <p className="text-xs text-white/40 text-center uppercase tracking-widest font-light">
                  You voted <span className="text-white font-bold">{userVote ? 'For' : 'Against'}</span> with {votePower} votes
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Create Proposal Modal
 */
const CreateProposalModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('governance');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await onCreate({ title, description, category });
      toast.success('Proposal created!');
      onClose();
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to create proposal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[560px] bg-black border border-white/20 rounded-2xl z-50 overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-semibold text-white uppercase tracking-tight">Create Proposal</h2>
            <p className="text-sm text-white/40 mt-1 font-light">Submit a governance proposal for community voting</p>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter proposal title..."
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-light"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 transition-all font-light"
              >
                <option value="governance">Governance</option>
                <option value="feature">Feature Request</option>
                <option value="economics">Economics</option>
                <option value="security">Security</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest font-bold mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal in detail..."
                rows={4}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none transition-all font-light leading-relaxed"
              />
            </div>
          </div>

          <div className="p-8 border-t border-white/10 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-transparent border border-white/10 text-white/60 rounded-xl hover:bg-white/5 hover:text-white transition-all uppercase text-xs tracking-widest font-bold"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-white text-black rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Create Proposal</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

/**
 * Main DAO Governance Component
 */
const DAOGovernance = () => {
  const { publicKey, isConnected } = useStellar();
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [userVotes, setUserVotes] = useState({});
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  // const [loading, setLoading] = useState(false); // Removed as it's not used here

  // Mock user data (replace with actual data from SBT contract)
  const userTokens = 150;
  const userBadges = ['BACKER', 'VERIFIED', 'EARLY_ADOPTER'];
  const votePower = calculateQuadraticVotePower(userTokens, calculateReputationFromBadges(userBadges));

  // Filter proposals
  const filteredProposals = useMemo(() => {
    if (filter === 'all') return proposals;
    return proposals.filter(p => p.status === filter);
  }, [proposals, filter]);

  // Stats
  const stats = useMemo(() => ({
    total: proposals.length,
    active: proposals.filter(p => p.status === PROPOSAL_STATUS.ACTIVE).length,
    passed: proposals.filter(p => p.status === PROPOSAL_STATUS.PASSED).length,
    participation: proposals.reduce((acc, p) => acc + p.totalVoters, 0),
  }), [proposals]);

  // Handle vote
  const handleVote = async (proposalId, support) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setUserVotes(prev => ({ ...prev, [proposalId]: support }));
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          forVotes: support ? p.forVotes + votePower : p.forVotes,
          againstVotes: !support ? p.againstVotes + votePower : p.againstVotes,
          totalVoters: p.totalVoters + 1,
        };
      }
      return p;
    }));
  };

  // Handle create proposal
  const handleCreateProposal = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProposal = {
      id: proposals.length + 1,
      ...data,
      proposer: publicKey?.slice(0, 4) + '...' + publicKey?.slice(-4) || 'Unknown',
      status: PROPOSAL_STATUS.ACTIVE,
      createdAt: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      forVotes: 0,
      againstVotes: 0,
      totalVoters: 0,
      quorum: 2000,
    };

    setProposals(prev => [newProposal, ...prev]);
  };

  return (
    <div className="bg-black py-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
            <Vote className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">DAO Governance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Community Governance
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            Shape the future of ChainFund through quadratic voting. Your voice matters,
            weighted by your contribution and reputation.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Total Proposals', value: stats.total, icon: Vote },
            { label: 'Active Now', value: stats.active, icon: Clock },
            { label: 'Passed', value: stats.passed, icon: CheckCircle },
            { label: 'Total Votes Cast', value: stats.participation, icon: Users },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group">
              <stat.icon className="w-5 h-5 text-white/20 mb-3 group-hover:text-white/60 transition-colors" />
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Vote Power */}
          <div className="lg:col-span-1 space-y-6">
            <VotePowerCard tokens={userTokens} badges={userBadges} />

            {/* Create Proposal Button */}
            {isConnected && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="w-full py-5 bg-white text-black rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                <span>Create Proposal</span>
              </motion.button>
            )}

            {/* Quadratic Voting Explainer */}
            <div className="bg-black border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                <TrendingUp className="w-4 h-4 text-white/60" />
                Why Quadratic Voting?
              </h3>
              <div className="space-y-4 text-xs">
                <p className="leading-relaxed">
                  <strong className="text-white/80 block mb-1">Fair Distribution:</strong>
                  <span className="text-white/40 font-light">Prevents wealthy users from dominating decisions by growing cost quadratically.</span>
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white/80 block mb-1">Reputation Matters:</strong>
                  <span className="text-white/40 font-light">Active community contributors earn SBT badges that directly multiply voting influence.</span>
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white/80 block mb-1">Anti-Sybil:</strong>
                  <span className="text-white/40 font-light">Makes it economically exhausting to split power across multiple fake accounts.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Proposals */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'all', label: 'All Proposals' },
                { id: PROPOSAL_STATUS.ACTIVE, label: 'Active' },
                { id: PROPOSAL_STATUS.PASSED, label: 'Passed' },
                { id: PROPOSAL_STATUS.REJECTED, label: 'Rejected' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${filter === f.id
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white/40 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onVote={handleVote}
                    userVote={userVotes[proposal.id] ?? null}
                    votePower={votePower}
                  />
                ))
              ) : (
                <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
                  <Vote className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 uppercase tracking-widest text-xs font-bold">No proposals found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Proposal Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProposalModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateProposal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DAOGovernance;
export { VotePowerCard, ProposalCard };
