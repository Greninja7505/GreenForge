import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Gift,
  Zap,
  ArrowRight,
  Users,
  Wallet,
  Lock,
  Percent,
  Sparkles,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStellar } from "../context/StellarContext";
import { useState } from "react";
import toast from "react-hot-toast";
const GIVeconomy = () => {
  const { isConnected, connectWallet, publicKey, balance } = useStellar();

  const features = [
    {
      icon: Coins,
      title: "CHAIN Token",
      description:
        "The native governance and utility token powering the Stellar Forge ecosystem on Stellar.",
      color: "from-white/10 to-white/5",
      link: "#",
    },
    {
      icon: Gift,
      title: "CHAINbacks",
      description:
        "Get rewarded with CHAIN tokens when you donate to verified projects on Stellar.",
      color: "from-white/10 to-white/5",
      link: "#",
    },
    {
      icon: TrendingUp,
      title: "CHAINpower",
      description:
        "Stake your CHAIN tokens to boost projects and earn additional rewards.",
      color: "from-white/10 to-white/5",
      link: "#",
    },
    {
      icon: Zap,
      title: "CHAINstream",
      description:
        "Continuous token distribution aligned with long-term commitment on Stellar network.",
      color: "from-white/10 to-white/5",
      link: "#",
    },
    {
      icon: Wallet,
      title: "ChainFarm",
      description:
        "Stake CHAIN tokens and provide liquidity to earn attractive rewards while supporting the Stellar Forge ecosystem.",
      color: "from-white/10 to-white/5",
      link: "/chainfarm",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 bg-black"
    >
      <div className="container-custom">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
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
            THE ECONOMY OF <span style={{ fontWeight: "400" }}>GIVING</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            className="text-white/40 max-w-3xl mx-auto mb-8 font-light"
          >
            Stellar Forge Economy rewards and empowers those who give to projects,
            society, and the world. Participate in the revolution of
            philanthropy on the Stellar blockchain.
          </p>

          {/* Wallet Connection Section */}
          {!isConnected ? (
            <motion.button
              onClick={connectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2 mx-auto mb-8 bg-white text-black hover:bg-white/90"
            >
              <Wallet className="w-5 h-5" />
              <span>Connect Stellar Wallet</span>
            </motion.button>
          ) : (
            <div className="mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md mx-auto mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/40 text-sm">
                    Connected Wallet
                  </span>
                  <span className="text-white font-semibold text-sm">
                    {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : 'Loading...'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Balance</span>
                  <span className="text-white font-semibold">
                    {balance ? `${parseFloat(balance.xlm || 0).toFixed(2)} XLM` : '0.00 XLM'}
                  </span>
                </div>
              </div>
              <Link to="/chainfarm">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center space-x-2 mx-auto bg-white text-black hover:bg-white/90"
                >
                  <span>Stake on ChainFarm</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300 group cursor-pointer"
            >
              <feature.icon
                className="w-12 h-12 text-white/60 mb-6 group-hover:text-white transition-colors"
                strokeWidth={1.5}
              />

              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.5rem",
                  letterSpacing: "0.02em",
                }}
                className="text-white mb-4 group-hover:text-white transition-colors"
              >
                {feature.title}
              </h3>

              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  lineHeight: "1.6",
                }}
                className="text-white/40 mb-6 leading-relaxed group-hover:text-white/60 transition-colors font-light"
              >
                {feature.description}
              </p>

              <a
                href={feature.link}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                }}
                className="text-white font-semibold flex items-center space-x-2 group-hover:translate-x-1 transition-transform uppercase"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { value: "10M+", label: "CHAIN Distributed", icon: Coins },
            { value: "$2M+", label: "CHAINbacks Rewarded", icon: Gift },
            { value: "5K+", label: "Active Participants", icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="card text-center border-white/10 bg-black py-10"
            >
              <stat.icon
                className="w-14 h-14 text-white/20 mx-auto mb-6"
                strokeWidth={1}
              />
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "clamp(2.5rem, 4vw, 3rem)",
                  letterSpacing: "-0.04em"
                }}
                className="text-white mb-2"
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.85rem",
                  letterSpacing: "0.15em",
                }}
                className="text-white/40 uppercase font-light"
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GIVeconomy;
