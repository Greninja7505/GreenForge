import { motion } from "framer-motion";
import { Award, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";

const GreenBadges = () => {
    const [selectedBadge, setSelectedBadge] = useState(null);

    // Reduced to 4 badges for compact view
    const badges = [
        {
            id: 1,
            name: "Tree Hugger",
            description: "Plant your first 10 trees",
            image: "🌳",
            rarity: "Common",
            unlocked: true,
            progress: 100,
            requirement: "10 trees planted",
            color: "from-green-500/20 to-emerald-500/20",
            borderColor: "border-green-500/50"
        },
        {
            id: 2,
            name: "Ocean Guardian",
            description: "Remove 50kg of ocean plastic",
            image: "🌊",
            rarity: "Rare",
            unlocked: true,
            progress: 100,
            requirement: "50kg plastic removed",
            color: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-500/50"
        },
        {
            id: 3,
            name: "Carbon Crusher",
            description: "Offset 100 tons of CO₂",
            image: "💨",
            rarity: "Epic",
            unlocked: false,
            progress: 67,
            requirement: "100 tons CO₂ offset",
            color: "from-purple-500/20 to-pink-500/20",
            borderColor: "border-purple-500/50"
        },
        {
            id: 4,
            name: "Green Pioneer",
            description: "Fund 5 environmental projects",
            image: "🚀",
            rarity: "Rare",
            unlocked: true,
            progress: 100,
            requirement: "5 projects funded",
            color: "from-yellow-500/20 to-orange-500/20",
            borderColor: "border-yellow-500/50"
        }
    ];

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case "Common": return "text-gray-400";
            case "Rare": return "text-blue-400";
            case "Epic": return "text-purple-400";
            case "Legendary": return "text-yellow-400";
            default: return "text-gray-400";
        }
    };

    return (
        <div className="w-full py-12 bg-black">
            <div className="container-custom">
                {/* Header - More Compact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Green Achievements
                    </h2>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">
                        Earn exclusive NFT badges as you make an impact
                    </p>
                </motion.div>

                {/* Badges Grid - 4 columns, more compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    {badges.map((badge, index) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ y: -8, scale: 1.05 }}
                            onClick={() => setSelectedBadge(badge)}
                            className={`relative group cursor-pointer bg-gradient-to-br ${badge.color} backdrop-blur-xl border ${badge.borderColor} rounded-xl p-4 overflow-hidden ${!badge.unlocked ? 'opacity-60' : ''}`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                            <div className="relative z-10">
                                {/* Badge Icon - Smaller */}
                                <div className="text-5xl mb-3 flex items-center justify-center relative">
                                    {badge.unlocked ? (
                                        <>
                                            <span className="filter drop-shadow-lg">{badge.image}</span>
                                            <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-400 bg-black rounded-full" />
                                        </>
                                    ) : (
                                        <div className="relative">
                                            <span className="filter grayscale blur-sm">{badge.image}</span>
                                            <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
                                        </div>
                                    )}
                                </div>

                                {/* Badge Name - Smaller */}
                                <h3 className="text-white font-bold text-sm mb-1 text-center">
                                    {badge.name}
                                </h3>

                                {/* Rarity - Smaller */}
                                <p className={`text-[10px] font-semibold uppercase tracking-wider text-center mb-2 ${getRarityColor(badge.rarity)}`}>
                                    {badge.rarity}
                                </p>

                                {/* Progress Bar (for locked badges) - Smaller */}
                                {!badge.unlocked && (
                                    <div className="mt-2">
                                        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                            <span>Progress</span>
                                            <span>{badge.progress}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${badge.progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-8"
                >
                    <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                        View All Achievements
                    </button>
                </motion.div>

                {/* Badge Detail Modal */}
                {selectedBadge && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBadge(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`bg-gradient-to-br ${selectedBadge.color} backdrop-blur-xl border ${selectedBadge.borderColor} rounded-3xl p-8 max-w-md w-full`}
                        >
                            <div className="text-center">
                                <div className="text-8xl mb-6">{selectedBadge.image}</div>
                                <h3 className="text-3xl font-bold text-white mb-2">{selectedBadge.name}</h3>
                                <p className={`text-sm font-semibold uppercase tracking-wider mb-4 ${getRarityColor(selectedBadge.rarity)}`}>
                                    {selectedBadge.rarity}
                                </p>
                                <p className="text-gray-300 mb-6">{selectedBadge.description}</p>

                                <div className="bg-black/40 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-gray-400 mb-1">Requirement</p>
                                    <p className="text-white font-semibold">{selectedBadge.requirement}</p>
                                </div>

                                {selectedBadge.unlocked ? (
                                    <div className="flex items-center justify-center gap-2 text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">Unlocked!</span>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                                            <span>Progress</span>
                                            <span>{selectedBadge.progress}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${selectedBadge.progress}%` }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedBadge(null)}
                                    className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GreenBadges;
