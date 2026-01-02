import { motion } from 'framer-motion';
import { AlertTriangle, Wifi } from 'lucide-react';

/**
 * Demo Mode Badge - Floating indicator for testnet/demo mode
 */
const DemoModeBadge = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 right-4 z-50"
        >
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full backdrop-blur-md">
                <div className="relative">
                    <Wifi className="w-4 h-4 text-amber-400" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>
                <span className="text-xs font-medium text-amber-300 uppercase tracking-wider">
                    Stellar Testnet
                </span>
            </div>
        </motion.div>
    );
};

/**
 * Testnet Banner - Full width banner at top
 */
const TestnetBanner = ({ onDismiss }) => {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-amber-900/50 via-orange-900/50 to-amber-900/50 border-b border-amber-500/20"
        >
            <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-200">
                    <strong>Demo Mode:</strong> Using Stellar Testnet. Transactions use test XLM (not real currency).
                </span>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="ml-4 text-amber-400 hover:text-amber-300 text-xs underline"
                    >
                        Dismiss
                    </button>
                )}
            </div>
        </motion.div>
    );
};

/**
 * Feature Badge - Highlights key features
 */
const FeatureBadge = ({ icon: Icon, label, variant = 'default' }) => {
    const variants = {
        default: 'from-white/10 to-white/5 border-white/10 text-gray-300',
        success: 'from-green-500/20 to-emerald-500/10 border-green-500/30 text-green-300',
        warning: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
        info: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-300',
        premium: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r border backdrop-blur-sm ${variants[variant]}`}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        </div>
    );
};

/**
 * Skeleton Card - Loading placeholder
 */
const SkeletonCard = () => {
    return (
        <div className="bg-black border border-white/10 rounded-xl p-6 animate-pulse">
            <div className="h-40 bg-white/5 rounded-lg mb-4" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
            <div className="h-2 bg-white/10 rounded-full w-full mb-2" />
            <div className="flex justify-between">
                <div className="h-3 bg-white/5 rounded w-1/4" />
                <div className="h-3 bg-white/5 rounded w-1/4" />
            </div>
        </div>
    );
};

/**
 * Empty State - When no data available
 */
const EmptyState = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {Icon && (
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-gray-500" />
                </div>
            )}
            <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
            <p className="text-gray-400 max-w-md mb-6">{description}</p>
            {action}
        </div>
    );
};

export { DemoModeBadge, TestnetBanner, FeatureBadge, SkeletonCard, EmptyState };
