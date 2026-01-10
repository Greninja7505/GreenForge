import { motion } from "framer-motion";
import { Shield, Lock, FileText, CheckCircle, AlertTriangle, Eye, Server, Key, Globe, Layers, Activity, FileCheck, Fingerprint, Cpu } from "lucide-react";

const Security = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-black text-white selection:bg-green-500/30">
            {/* Background Gradients - Strict White/Green Theme */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-900/20 blur-[120px] rounded-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full opacity-50" />
            </div>

            <div className="container-custom max-w-7xl mx-auto space-y-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400 uppercase tracking-widest">Enterprise Grade Security</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
                        Trust Built on <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-green-400 to-green-600 font-medium">
                            Transparency
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        We leverage blockchain technology and rigorous auditing to create the world's most transparent and secure funding ecosystem.
                    </p>
                </motion.div>

                {/* Core Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Lock, title: "Smart Contract Logic", desc: "Multi-layered smart contracts audited by industry leaders to prevent vulnerabilities.", color: "text-white" },
                        { icon: Cpu, title: "Infrastructure", desc: "Decentralized storage and redundant node systems ensure 99.99% network uptime.", color: "text-green-400" },
                        { icon: Fingerprint, title: "Wallet Security", desc: "Non-custodial integration means you retain full control of your private keys at all times.", color: "text-white" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 bg-black border border-white/10 rounded-2xl hover:border-green-500/50 transition-all group"
                        >
                            <div className={`w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-green-500/30 transition-all duration-300`}>
                                <item.icon className={`w-6 h-6 ${item.color} group-hover:text-green-400 transition-colors`} />
                            </div>
                            <h3 className="text-xl font-medium mb-3 text-white group-hover:text-green-500 transition-colors">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Audit Process Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-zinc-950/50 rounded-3xl p-8 md:p-12 border border-white/10"
                >
                    <div>
                        <h2 className="text-3xl font-light mb-6"> Rigorous <span className="text-green-500 font-medium">Audit Process</span></h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Before any code goes live, it passes through a gauntlet of verification steps. We believe that security is a continuous process, not a one-time check.
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Static Analysis", desc: "Automated scanning for known vulnerability patterns." },
                                { title: "Manual Review", desc: "Line-by-line code inspection by senior security engineers." },
                                { title: "Testnet Simulations", desc: "Stress testing in a controlled environment." },
                                { title: "Bug Bounty Program", desc: "Incentivizing the community to find and report edge cases." }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 text-green-400 flex items-center justify-center font-mono text-sm border border-white/20">
                                        0{i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium mb-1">{step.title}</h4>
                                        <p className="text-sm text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-full min-h-[400px] bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-8">
                        {/* Abstract Visual Representation of Code Audit */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80')] bg-cover bg-center opacity-10 grayscale" />
                        <div className="relative z-10 glass-card p-6 rounded-2xl border border-white/20 backdrop-blur-md max-w-sm w-full bg-black/80">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono text-green-400">AUDIT_PASS_V2.4</span>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="space-y-3 font-mono text-xs text-white/70">
                                <div className="flex justify-between"><span>Reentrancy Check</span> <span className="text-green-400">PASSED</span></div>
                                <div className="flex justify-between"><span>Overflow Guard</span> <span className="text-green-400">PASSED</span></div>
                                <div className="flex justify-between"><span>Access Control</span> <span className="text-green-400">PASSED</span></div>
                                <div className="flex justify-between"><span>Gas Optimization</span> <span className="text-green-400">98/100</span></div>
                                <div className="w-full h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-white font-bold"><span>FINAL SCORE</span> <span className="text-white bg-green-600 px-2 py-0.5 rounded text-[10px]">A+</span></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Compliance & Regulation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="md:col-span-1">
                        <h2 className="text-3xl font-light mb-4 text-white">Global <span className="block font-medium text-green-500">Compliance</span></h2>
                        <p className="text-gray-400 text-sm">Navigating the complex landscape of digital asset regulation.</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-colors">
                            <Globe className="w-8 h-8 text-white mb-4" />
                            <h4 className="text-lg font-medium text-white mb-2">Cross-Border Standard</h4>
                            <p className="text-sm text-gray-400">Adhering to international FATF guidelines for digital asset service providers.</p>
                        </div>
                        <div className="p-6 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-colors">
                            <FileCheck className="w-8 h-8 text-green-500 mb-4" />
                            <h4 className="text-lg font-medium text-white mb-2">KYC/AML</h4>
                            <p className="text-sm text-gray-400">Integrated identity verification ensuring a safe environment for all donors and creators.</p>
                        </div>
                    </div>
                </div>

                {/* Live Security Stats Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="border-t border-white/10 pt-12 flex flex-wrap justify-between items-center gap-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-mono text-gray-400">SYSTEM STATUS: <span className="text-green-400">OPERATIONAL</span></span>
                    </div>

                    <div className="flex gap-8 md:gap-16">
                        <div>
                            <div className="text-2xl font-bold text-white mb-1">₹0</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Funds Lost</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Uptime</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-1">24/7</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Monitoring</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Security;
