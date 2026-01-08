import { motion } from "framer-motion";
import { TrendingUp, Trees, Droplets, Recycle, Globe, Zap } from "lucide-react";
import { useState, useEffect } from "react";

const ImpactDashboard = () => {
    const [stats, setStats] = useState({
        treesPlanted: 0,
        co2Offset: 0,
        plasticRemoved: 0,
        fundsRaised: 0,
        activeProjects: 0,
        volunteers: 0
    });

    // Animate numbers on mount
    useEffect(() => {
        const targetStats = {
            treesPlanted: 12547,
            co2Offset: 3421, // in tons
            plasticRemoved: 8932, // in kg
            fundsRaised: 234567, // in USD
            activeProjects: 47,
            volunteers: 1893
        };

        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setStats({
                treesPlanted: Math.floor(targetStats.treesPlanted * progress),
                co2Offset: Math.floor(targetStats.co2Offset * progress),
                plasticRemoved: Math.floor(targetStats.plasticRemoved * progress),
                fundsRaised: Math.floor(targetStats.fundsRaised * progress),
                activeProjects: Math.floor(targetStats.activeProjects * progress),
                volunteers: Math.floor(targetStats.volunteers * progress)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setStats(targetStats);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const impactCards = [
        {
            icon: Trees,
            label: "Trees Planted",
            value: stats.treesPlanted.toLocaleString(),
            color: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-400",
            borderColor: "border-green-500/30"
        },
        {
            icon: Globe,
            label: "CO₂ Offset",
            value: `${stats.co2Offset.toLocaleString()} tons`,
            color: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-400",
            borderColor: "border-blue-500/30"
        },
        {
            icon: Recycle,
            label: "Plastic Removed",
            value: `${stats.plasticRemoved.toLocaleString()} kg`,
            color: "from-purple-500/20 to-pink-500/20",
            iconColor: "text-purple-400",
            borderColor: "border-purple-500/30"
        },
        {
            icon: Zap,
            label: "Funds Raised",
            value: `$${stats.fundsRaised.toLocaleString()}`,
            color: "from-yellow-500/20 to-orange-500/20",
            iconColor: "text-yellow-400",
            borderColor: "border-yellow-500/30"
        },
        {
            icon: TrendingUp,
            label: "Active Projects",
            value: stats.activeProjects.toLocaleString(),
            color: "from-teal-500/20 to-green-500/20",
            iconColor: "text-teal-400",
            borderColor: "border-teal-500/30"
        },
        {
            icon: Droplets,
            label: "Volunteers",
            value: stats.volunteers.toLocaleString(),
            color: "from-indigo-500/20 to-blue-500/20",
            iconColor: "text-indigo-400",
            borderColor: "border-indigo-500/30"
        }
    ];

    return (
        <div className="w-full py-20 bg-black">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Our Collective Impact
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Together, we're making a measurable difference for our planet.
                        Every contribution counts.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {impactCards.map((card, index) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`relative group bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.borderColor} rounded-2xl p-8 overflow-hidden`}
                        >
                            {/* Glow effect on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                            <div className="relative z-10">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-black/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                                </div>

                                {/* Value */}
                                <div className="mb-2">
                                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                        {card.value}
                                    </span>
                                </div>

                                {/* Label */}
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                    {card.label}
                                </p>
                            </div>

                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-gray-400 mb-6">
                        Want to see your impact grow? Start contributing today.
                    </p>
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-xl hover:shadow-2xl">
                        Explore Projects
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ImpactDashboard;
