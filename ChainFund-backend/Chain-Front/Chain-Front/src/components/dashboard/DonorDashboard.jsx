/**
 * Donor Dashboard Component
 * Shows donation history, backed projects, and impact metrics
 */

import { motion } from "framer-motion";
import { Heart, TrendingUp, Users, Award, ExternalLink } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useProjects } from "../../context/ProjectsContext";
import { Link } from "react-router-dom";

const DonorDashboard = () => {
    const { user } = useUser();
    const { projects } = useProjects();

    // Get user's donation stats
    const totalDonated = user?.totalDonations || 0;
    const donationHistory = user?.donationHistory || [];
    const projectsSupported = user?.projectsSupported || [];
    const supportedProjects = projects.filter(p => projectsSupported.includes(p.slug));

    // Calculate impact metrics
    const totalImpact = supportedProjects.reduce((sum, p) => sum + (p.raised || 0), 0);
    const avgDonation = donationHistory.length > 0
        ? totalDonated / donationHistory.length
        : 0;

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
                    className="bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-pink-500/20 rounded-lg">
                            <Heart className="w-5 h-5 text-pink-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Donated</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalDonated)}</p>
                    <p className="text-sm text-gray-500 mt-1">{donationHistory.length} donations</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Projects Backed</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{projectsSupported.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Active campaigns</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Impact</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalImpact)}</p>
                    <p className="text-sm text-gray-500 mt-1">Funds raised by backed projects</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Award className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Avg Donation</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(avgDonation)}</p>
                    <p className="text-sm text-gray-500 mt-1">Per contribution</p>
                </motion.div>
            </div>

            {/* Recent Donations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Recent Donations</h2>
                {donationHistory.length > 0 ? (
                    <div className="space-y-3">
                        {donationHistory.slice(-5).reverse().map((donation, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">{donation.projectTitle || 'Project'}</p>
                                    <p className="text-sm text-gray-400">{new Date(donation.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-green-400 font-semibold">{formatCurrency(donation.amount)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No donations yet</p>
                        <Link to="/projects/all" className="text-cyan-400 hover:underline text-sm mt-2 inline-block">
                            Browse projects to support →
                        </Link>
                    </div>
                )}
            </motion.div>

            {/* Backed Projects */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4">Projects You've Backed</h2>
                {supportedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {supportedProjects.slice(0, 6).map((project) => (
                            <Link
                                key={project.id}
                                to={`/project/${project.slug}`}
                                className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-white font-medium line-clamp-1">{project.title}</h3>
                                    <ExternalLink className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                        style={{ width: `${Math.min((project.raised / project.goal) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">{formatCurrency(project.raised)} raised</span>
                                    <span className="text-cyan-400">{((project.raised / project.goal) * 100).toFixed(0)}%</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No backed projects yet</p>
                        <Link to="/projects/all" className="text-cyan-400 hover:underline text-sm mt-2 inline-block">
                            Discover projects →
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default DonorDashboard;
