import { motion } from "framer-motion";
import { Leaf, Award, ExternalLink, Zap } from "lucide-react";

// Mock data for hackathon demo
const MOCK_NFTS = [
    {
        id: 1,
        title: "Rainforest Guardian",
        tier: "Gold",
        impact: "Saved 1 Tonne CO2",
        image: "https://images.unsplash.com/photo-1596706069922-8d4aa6970bc4?q=80&w=1000&auto=format&fit=crop",
        date: "2024-12-15",
        project: "Amazon Reforestation"
    },
    {
        id: 2,
        title: "Ocean Cleaner",
        tier: "Silver",
        impact: "Removed 50kg Plastic",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1000&auto=format&fit=crop",
        date: "2024-12-28",
        project: "Bali Beach Cleanup"
    },
    {
        id: 3,
        title: "Solar Pioneer",
        tier: "Bronze",
        impact: "Funded 2 Panels",
        image: "https://plus.unsplash.com/premium_photo-1679917152960-b9e64563125d?q=80&w=2532&auto=format&fit=crop",
        date: "2024-11-05",
        project: "Community Solar Grid"
    }
];

const GreenPortfolio = () => {
    return (
        <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-400" />
                Impact NFT Portfolio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_NFTS.map((nft) => (
                    <motion.div
                        key={nft.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group relative bg-black rounded-xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                    >
                        {/* Holographic Overlay Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20" />

                        {/* Image Section */}
                        <div className="h-64 overflow-hidden relative">
                            <img
                                src={nft.image}
                                alt={nft.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            {/* Tier Badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md ${nft.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' :
                                    nft.tier === 'Silver' ? 'bg-slate-400/20 text-slate-300 border-slate-400/50' :
                                        'bg-orange-700/20 text-orange-300 border-orange-700/50'
                                }`}>
                                {nft.tier} Tier
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl text-white font-medium">{nft.title}</h3>
                                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                            </div>

                            <p className="text-green-400 font-mono text-sm mb-4 flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                {nft.impact}
                            </p>

                            <div className="space-y-2 border-t border-white/10 pt-4">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Project</span>
                                    <span className="text-gray-300">{nft.project}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Minted</span>
                                    <span>{nft.date}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Token ID</span>
                                    <span className="font-mono">#00{832 + nft.id}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                                View on Stellar Explorer <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State / Mint Prompt */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/40 border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-green-500/30 transition-colors bg-gradient-to-br from-green-900/10 to-transparent"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                        <Leaf className="w-8 h-8 text-green-500/50 group-hover:text-green-400 transition-colors" />
                    </div>
                    <h3 className="text-lg text-white font-medium mb-2">Mint New Impact NFT</h3>
                    <p className="text-sm text-gray-500 max-w-xs mb-6">
                        Make a donation to a verified project to mint your next Proof of Impact collectible.
                    </p>
                    <div className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm border border-green-500/30">
                        Explore Projects
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GreenPortfolio;
