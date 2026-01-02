/**
 * Freelancer Dashboard Widget
 * Shows gigs, orders, and earnings summary for Dashboard page
 */

import { motion } from "framer-motion";
import { Briefcase, DollarSign, Clock, Star, Plus, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const FreelancerDashboardWidget = () => {
    // Mock data - in production, fetch from API
    const stats = {
        activeGigs: 3,
        pendingOrders: 2,
        totalEarnings: 4500,
        rating: 4.8,
        completedOrders: 12,
    };

    const recentGigs = [
        { id: 1, title: "Smart Contract Development", price: 500, status: "active", orders: 3 },
        { id: 2, title: "DApp Frontend Design", price: 300, status: "active", orders: 1 },
        { id: 3, title: "Blockchain Consulting", price: 150, status: "paused", orders: 0 },
    ];

    const pendingOrders = [
        { id: 1, gigTitle: "Smart Contract Development", buyer: "0x1234...5678", amount: 500, dueDate: "2025-12-25" },
        { id: 2, gigTitle: "DApp Frontend Design", buyer: "0xabcd...efgh", amount: 300, dueDate: "2025-12-28" },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Briefcase className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Active Gigs</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.activeGigs}</p>
                    <p className="text-sm text-gray-500 mt-1">Listed services</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Pending Orders</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
                    <p className="text-sm text-gray-500 mt-1">In progress</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <DollarSign className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Earnings</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalEarnings)}</p>
                    <p className="text-sm text-gray-500 mt-1">{stats.completedOrders} orders</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Rating</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.rating}</p>
                    <p className="text-sm text-gray-500 mt-1">⭐ Average</p>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link
                        to="/freelancer/create-gig"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:border-green-400/50 transition-colors"
                    >
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Plus className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Create New Gig</h3>
                            <p className="text-sm text-gray-400">List a new service</p>
                        </div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        to="/freelancer/orders"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl hover:border-orange-400/50 transition-colors"
                    >
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">Manage Orders</h3>
                            <p className="text-sm text-gray-400">{stats.pendingOrders} pending</p>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* My Gigs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">My Gigs</h2>
                    <Link to="/freelancer/gigs" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        View all →
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentGigs.map((gig) => (
                        <div
                            key={gig.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                            <div>
                                <h3 className="text-white font-medium">{gig.title}</h3>
                                <p className="text-sm text-gray-400">{gig.orders} orders</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-2 py-1 rounded text-xs ${gig.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {gig.status}
                                </span>
                                <span className="text-green-400 font-semibold">{formatCurrency(gig.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Pending Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Pending Orders</h2>
                {pendingOrders.length > 0 ? (
                    <div className="space-y-3">
                        {pendingOrders.map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                            >
                                <div>
                                    <h3 className="text-white font-medium">{order.gigTitle}</h3>
                                    <p className="text-sm text-gray-400">Buyer: {order.buyer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 font-semibold">{formatCurrency(order.amount)}</p>
                                    <p className="text-sm text-orange-400">Due: {order.dueDate}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No pending orders</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FreelancerDashboardWidget;
