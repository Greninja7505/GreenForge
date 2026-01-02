import { motion } from "framer-motion";
import { Shield, Users, Globe, Zap } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Milestone-Based Escrow",
        description: "Multi-sig smart contracts release funds only as predefined project phases are verified by the governance quorum.",
    },
    {
        icon: Users,
        title: "Institutional Governance",
        description: "Decentralized decision-making ensures that platform capital is allocated to high-integrity projects with proven roadmaps.",
    },
    {
        icon: Globe,
        title: "Instant Global Settlement",
        description: "Powered by Stellar's L1, providing 5-second settlement times and fractional-penny fees for cross-border capital flow.",
    },
    {
        icon: Zap,
        title: "Verified Talent Network",
        description: "A curated layer of blockchain engineers and technical founders vetted through on-chain reputation and past performance.",
    },
];

const CoreFeatures = () => {
    return (
        <section className="bg-black py-32 px-6 lg:px-16 border-t border-white/5">
            <div className="container-custom max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2
                        style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "clamp(2.5rem, 5vw, 4rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: "1.1",
                            textTransform: "uppercase",
                        }}
                        className="text-white mb-6"
                    >
                        PROTOCOL <br />
                        <span style={{ fontWeight: "400" }}>INFRASTRUCTURE</span>
                    </h2>
                    <p
                        style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "1.1rem",
                            letterSpacing: "0.01em",
                        }}
                        className="text-gray-500 max-w-xl"
                    >
                        The structural foundation for decentralized capital, institutional governance, and verifiable global development.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col p-8 rounded-sm bg-[#050505] border border-white/[0.03] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-sm bg-white/[0.02] flex items-center justify-center mb-8 border border-white/[0.05] group-hover:bg-white/5 transition-colors">
                                <feature.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-white font-medium text-base mb-4 tracking-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-500 text-xs leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreFeatures;
