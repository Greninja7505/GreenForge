/**
 * Creator Dashboard Component
 * Shows created projects, funding progress, and milestone status
 */

import { motion } from "framer-motion";
import { Rocket, DollarSign, Target, Clock, Plus, ExternalLink, CheckCircle } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useProjects } from "../../context/ProjectsContext";
import { Link } from "react-router-dom";

const CreatorDashboard = () => {
    const { user } = useUser();
    const { projects } = useProjects();

    // Get user's created projects
    const projectsCreated = user?.projectsCreated || [];
    const myProjects = projects.filter(p => projectsCreated.includes(p.slug));

    // Calculate stats
    const totalRaised = myProjects.reduce((sum, p) => sum + (p.raised || 0), 0);
    const totalGoal = myProjects.reduce((sum, p) => sum + (p.goal || 0), 0);
    const totalBackers = myProjects.reduce((sum, p) => sum + (p.donors || 0), 0);
    const completedMilestones = myProjects.reduce((sum, p) => {
        return sum + (p.milestones?.filter(m => m.completed)?.length || 0);
    }, 0);
    const totalMilestones = myProjects.reduce((sum, p) => {
        return sum + (p.milestones?.length || 0);
    }, 0);

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
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Rocket className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">My Projects</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{myProjects.length}</p>
                    <p className="text-sm text-gray-500 mt-1">Active campaigns</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Raised</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalRaised)}</p>
                    <p className="text-sm text-gray-500 mt-1">of {formatCurrency(totalGoal)} goal</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Target className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Backers</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalBackers}</p>
                    <p className="text-sm text-gray-500 mt-1">Supporters</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-orange-400" />
                        </div>
                        <h3 className="text-gray-400 text-sm">Milestones</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{completedMilestones}/{totalMilestones}</p>
                    <p className="text-sm text-gray-500 mt-1">Completed</p>
                </motion.div>
            </div>

            {/* Create New Project CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Link
                    to="/create-project"
                    className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-400/50 transition-colors group"
                >
                    <div className="p-3 bg-purple-500/20 rounded-full group-hover:bg-purple-500/30 transition-colors">
                        <Plus className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Create New Project</h3>
                        <p className="text-sm text-gray-400">Launch a new crowdfunding campaign</p>
                    </div>
                </Link>
            </motion.div>

            {/* My Projects */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-dark-800 border border-white/10 rounded-xl p-6"
            >
                <h2 className="text-xl font-semibold text-white mb-4">My Projects</h2>
                {myProjects.length > 0 ? (
                    <div className="space-y-4">
                        {myProjects.map((project) => {
                            const progress = (project.raised / project.goal) * 100;
                            const pendingMilestones = project.milestones?.filter(m => !m.completed)?.length || 0;

                            return (
                                <div
                                    key={project.id}
                                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-white font-medium">{project.title}</h3>
                                            <p className="text-sm text-gray-400">{project.category}</p>
                                        </div>
                                        <Link
                                            to={`/project/${project.slug}`}
                                            className="text-cyan-400 hover:text-cyan-300"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    </div>

                                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">
                                            <span className="text-white font-medium">{formatCurrency(project.raised)}</span> of {formatCurrency(project.goal)}
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-400">{project.donors} backers</span>
                                            {pendingMilestones > 0 && (
                                                <span className="flex items-center gap-1 text-orange-400">
                                                    <Clock className="w-4 h-4" />
                                                    {pendingMilestones} pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Rocket className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No projects created yet</p>
                        <Link to="/create-project" className="text-purple-400 hover:underline text-sm mt-2 inline-block">
                            Create your first project →
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CreatorDashboard;
