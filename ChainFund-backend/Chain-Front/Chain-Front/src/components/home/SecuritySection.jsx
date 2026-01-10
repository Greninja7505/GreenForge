import { Shield, Lock, Server, Fingerprint, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const SecuritySection = () => {
    return (
        <div className="w-full bg-black py-24 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-medium uppercase tracking-wider mb-6"
                    >
                        <Shield className="w-3 h-3" />
                        Enterprise Grade Security
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                    >
                        Trust Built on{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            Transparency
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        We leverage blockchain technology and rigorous auditing to create the
                        world's most transparent and secure funding ecosystem.
                    </motion.p>
                </div>

                {/* Security Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            icon: Lock,
                            title: "Smart Contract Logic",
                            description: "Multi-layered smart contracts audited by industry leaders to prevent vulnerabilities and ensure fund safety."
                        },
                        {
                            icon: Server,
                            title: "Infrastructure",
                            description: "Decentralized storage and redundant node systems ensure 99.99% network uptime and data integrity."
                        },
                        {
                            icon: Fingerprint,
                            title: "Wallet Security",
                            description: "Non-custodial integration means you retain full control of your private keys and assets at all times."
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center mb-6 group-hover:border-green-500/50 transition-colors">
                                <feature.icon className="w-6 h-6 text-gray-400 group-hover:text-green-400 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Process Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-3xl font-bold text-white mb-8">
                            Rigorous <span className="text-green-500">Audit Process</span>
                        </h3>
                        <p className="text-gray-400 mb-8">
                            Before any code goes live, it passes through a gauntlet of verification steps.
                            We believe that security is a continuous process, not a one-time check.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Static Analysis", desc: "Automated scanning for known vulnerability patterns." },
                                { title: "Manual Review", desc: "Line-by-line code inspection by senior security engineers." },
                                { title: "Testnet Simulations", desc: "Stress testing in a controlled environment." },
                                { title: "Bug Bounty Program", desc: "Incentivizing the community to find and report edge cases." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-400 font-mono text-sm">
                                        0{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                                        <p className="text-gray-500 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                        <div className="relative bg-black border border-white/10 rounded-xl p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                                <span className="text-green-500 font-mono text-sm">AUDIT_PASS_V2.4</span>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                {[
                                    { label: "Reentrancy Check", status: "PASSED", score: "100/100" },
                                    { label: "Overflow Guard", status: "PASSED", score: "100/100" },
                                    { label: "Access Control", status: "PASSED", score: "100/100" },
                                    { label: "Gas Optimization", status: "98/100", score: "98/100" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-gray-300">{item.label}</span>
                                        <span className="text-green-400">{item.status}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                                <span className="text-white font-bold">FINAL SCORE</span>
                                <span className="px-2 py-1 rounded bg-green-500 text-black font-bold text-xs">A+</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySection;
