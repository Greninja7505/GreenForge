/**
 * Governor Dashboard Widget
 * Shows governance participation, proposals, and voting history
 */

import { motion } from "framer-motion";
import { Vote, FileText, Award, TrendingUp, Plus, ExternalLink, CheckCircle, XCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const GovernorDashboardWidget = () => {
    // Mock data - in production, fetch from API/smart contract
    const stats = {
        votingPower: 1250,
        proposalsVoted: 8,
        proposalsCreated: 2,
        reputationScore: 450,
    };

    const activeProposals = [
        {
            id: 1,
            title: "Increase Platform Fee to 3%",
            status: "active",
            votesFor: 12500,
            votesAgainst: 8300,
            endDate: "2025-12-30",
            hasVoted: true,
            myVote: "for"
        },
        {
            id: 2,
            title: "Add Polygon Chain Support",
            status: "active",
            votesFor: 18700,
            votesAgainst: 2100,
            endDate: "2025-12-28",
            hasVoted: false,
            myVote: null
        },
        {
            id: 3,
            title: "Fund Security Audit Program",
            status: "active",
            votesFor: 15200,
            votesAgainst: 5400,
            endDate: "2026-01-05",
            hasVoted: true,
            myVote: "against"
        },
    ];

    const recentVotes = [
        { proposalId: 1, title: "Treasury Diversification", vote: "for", date: "2025-12-15", result: "passed" },
        { proposalId: 2, title: "Reduce Minimum Stake", vote: "against", date: "2025-12-10", result: "failed" },
        { proposalId: 3, title: "Add New Categories", vote: "for", date: "2025-12-05", result: "passed" },
    ];

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Vote className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Voting Power</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatNumber(stats.votingPower)}</p>
                    <p className="text-sm text-gray-500 mt-1">Quadratic votes</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Proposals Voted</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.proposalsVoted}</p>
                    <p className="text-sm text-gray-500 mt-1">Participation</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Plus className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Proposals Created</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.proposalsCreated}</p>
                    <p className="text-sm text-gray-500 mt-1">Submitted</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Award className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Reputation</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.reputationScore}</p>
                    <p className="text-sm text-gray-500 mt-1">SBT score</p>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    to="/governance"
                    className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl hover:border-orange-400/50 transition-colors group"
                >
                    <div className="p-3 bg-orange-500/20 rounded-full group-hover:bg-orange-500/30 transition-colors">
                        <Vote className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Go to Governance</h3>
                        <p className="text-sm text-gray-400">View all proposals and vote</p>
                    </div>
                </Link>
            </motion.div>

            {/* Active Proposals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Active Proposals</h2>
                    <Link to="/governance" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        View all →
                    </Link>
                </div>
                <div className="space-y-4">
                    {activeProposals.map((proposal) => {
                        const totalVotes = proposal.votesFor + proposal.votesAgainst;
                        const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 50;

                        return (
                            <div
                                key={proposal.id}
                                className="p-4 bg-white/5 rounded-lg"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-white font-medium">{proposal.title}</h3>
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            <Clock className="w-4 h-4" />
                                            Ends: {proposal.endDate}
                                        </p>
                                    </div>
                                    {proposal.hasVoted ? (
                                        <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${proposal.myVote === 'for'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {proposal.myVote === 'for' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            Voted {proposal.myVote}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                                            Vote pending
                                        </span>
                                    )}
                                </div>

                                {/* Vote bar */}
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                        style={{ width: `${forPercentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-green-400">For: {formatNumber(proposal.votesFor)}</span>
                                    <span className="text-red-400">Against: {formatNumber(proposal.votesAgainst)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Recent Voting History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Your Voting History</h2>
                <div className="space-y-3">
                    {recentVotes.map((vote, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                            <div>
                                <h3 className="text-white font-medium">{vote.title}</h3>
                                <p className="text-sm text-gray-400">{vote.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs ${vote.vote === 'for' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {vote.vote}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${vote.result === 'passed' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {vote.result}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default GovernorDashboardWidget;
