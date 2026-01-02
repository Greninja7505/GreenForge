import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  Network,
  Lock,
  Layers,
  Shield,
  Database,
  GitBranch,
  Zap,
  Code,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Causes = () => {
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    setCauses([
      {
        id: 1,
        name: "DeFi Protocols",
        icon: Coins,
        projects: 127,
        tvl: 2340000,
        description: "Decentralized finance infrastructure and protocols",
      },
      {
        id: 2,
        name: "DEX & AMM",
        icon: TrendingUp,
        projects: 89,
        tvl: 1560000,
        description: "Decentralized exchanges and automated market makers",
      },
      {
        id: 3,
        name: "Staking & Yield",
        icon: Layers,
        projects: 156,
        tvl: 3890000,
        description: "Staking protocols and yield optimization",
      },
      {
        id: 4,
        name: "Cross-Chain",
        icon: GitBranch,
        projects: 67,
        tvl: 890000,
        description: "Bridges and cross-chain interoperability",
      },
      {
        id: 5,
        name: "Infrastructure",
        icon: Network,
        projects: 92,
        tvl: 1200000,
        description: "Blockchain infrastructure and node operators",
      },
      {
        id: 6,
        name: "Security Tools",
        icon: Shield,
        projects: 54,
        tvl: 670000,
        description: "Smart contract auditing and security",
      },
      {
        id: 7,
        name: "Oracles & Data",
        icon: Database,
        projects: 43,
        tvl: 890000,
        description: "On-chain data feeds and oracle networks",
      },
      {
        id: 8,
        name: "Privacy Tech",
        icon: Lock,
        projects: 38,
        tvl: 560000,
        description: "Zero-knowledge proofs and privacy solutions",
      },
      {
        id: 9,
        name: "NFT Platforms",
        icon: Zap,
        projects: 78,
        tvl: 1340000,
        description: "NFT marketplaces and gaming infrastructure",
      },
    ]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6 tracking-tight"
          >
            BLOCKCHAIN <span style={{ fontWeight: "400" }}>CATEGORIES</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            className="text-gray-400 max-w-3xl mx-auto"
          >
            Explore decentralized projects across different blockchain sectors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="mb-8">
                <cause.icon
                  className="w-12 h-12 text-white/80 mb-6"
                  strokeWidth={1.5}
                />

                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.5rem",
                    letterSpacing: "0.02em",
                  }}
                  className="text-white mb-3 group-hover:text-gray-300 transition-colors"
                >
                  {cause.name}
                </h3>

                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.95rem",
                    letterSpacing: "0.01em",
                    lineHeight: "1.6",
                  }}
                  className="text-gray-500 mb-6"
                >
                  {cause.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.9rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-gray-500"
                    >
                      {cause.projects} Projects
                    </span>
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "0.95rem",
                      }}
                      className="text-white"
                    >
                      ${(cause.tvl / 1000).toFixed(0)}K TVL
                    </span>
                  </div>
                </div>
              </div>

              <Link to="/projects/all">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "0.9rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="w-full px-6 py-3 bg-black border border-white/10 rounded-xl hover:border-white/30 text-white transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Causes;
