import { motion } from "framer-motion";
import { useState } from "react";
import { useStellar } from "../context/StellarContext";
import {
  Wallet,
  Lock,
  TrendingUp,
  Gift,
  Percent,
  Sparkles,
  DollarSign,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const GIVfarm = () => {
  const { publicKey, isConnected, connectWallet, balance } = useStellar();
  const [activePool, setActivePool] = useState(null);
  const [stakeAmount, setStakeAmount] = useState("");

  const stakingPools = [
    {
      id: 1,
      name: "CHAIN Single Staking",
      pair: "CHAIN",
      apr: "55%",
      tvl: "$3.2M",
      rewards: "CHAIN",
      icon: Gift,
      description: "Stake your CHAIN tokens directly to earn rewards and support the ecosystem"
    },
    {
      id: 2,
      name: "CHAIN-XLM LP",
      pair: "CHAIN/XLM",
      apr: "95%",
      tvl: "$5.8M",
      rewards: "CHAIN + XLM",
      icon: Sparkles,
      description: "Provide liquidity to the CHAIN-XLM pool and earn dual rewards"
    },
    {
      id: 3,
      name: "CHAIN-USDC LP",
      pair: "CHAIN/USDC",
      apr: "75%",
      tvl: "$4.1M",
      rewards: "CHAIN + USDC",
      icon: DollarSign,
      description: "Stable liquidity provision with attractive yields and low volatility"
    },
  ];

  const userStats = {
    totalStaked: "2,450.00",
    totalEarned: "387.50",
    pendingRewards: "28.75",
  };

  const handleStake = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      connectWallet();
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    toast.success("Staking transaction submitted!");
    setStakeAmount("");
    setActivePool(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 bg-black"
    >
      <div className="container-custom">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "3.5rem",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6 tracking-tight uppercase"
          >
            CHAINFARM <span className="font-light text-white/40">STAKING</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            className="text-white/40 max-w-3xl mx-auto font-light"
          >
            Stake your CHAIN tokens or provide liquidity to earn attractive rewards while supporting impactful blockchain projects on the Stellar Forge ecosystem.
          </p>
        </motion.div>

        {/* Info Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-black border border-white/10 p-8 hover:border-white/30 transition-all rounded-3xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">About Stellar Forge</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">
                    Stellar Forge is a decentralized platform connecting blockchain innovation with real-world impact. We fund sustainable development projects, support emerging technologies, and build communities that drive positive change through transparent, blockchain-powered giving.
                  </p>
                </div>
              </div>
            </div>

            <div className="card bg-black border border-white/10 p-8 hover:border-white/30 transition-all rounded-3xl">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Your Impact</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">
                    By staking CHAIN tokens, you're not just earning rewards—you're actively supporting our ecosystem. Your staked tokens help fund verified projects in education, healthcare, environmental conservation, and technological innovation across the globe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white/70" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Total Staked</div>
                <div className="text-3xl font-bold text-white">
                  {userStats.totalStaked}
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-white/10 uppercase tracking-widest font-bold">CHAIN TOKENS</div>
          </div>

          <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white/70" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Total Earned</div>
                <div className="text-3xl font-bold text-white">
                  {userStats.totalEarned}
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-white/10 uppercase tracking-widest font-bold">CHAIN TOKENS</div>
          </div>

          <div className="bg-black border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white/70" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">Pending Rewards</div>
                <div className="text-3xl font-bold text-white">
                  {userStats.pendingRewards}
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] text-white/10 uppercase tracking-widest font-bold">CHAIN TOKENS</div>
          </div>
        </motion.div>

        {/* Staking Pools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {stakingPools.map((pool, index) => (
            <motion.div
              key={pool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-black border border-white/10 rounded-3xl p-10 hover:border-white/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-all">
                    <pool.icon className="w-7 h-7 text-white/70 group-hover:text-white transition-all" />
                  </div>
                  <div className="max-w-[180px]">
                    <h3 className="font-bold text-white text-2xl tracking-tighter leading-tight mb-1">{pool.name}</h3>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{pool.pair}</p>
                    <p className="text-[10px] text-white/20 mt-2 font-light leading-relaxed italic">{pool.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">APR</span>
                  <span className="text-3xl font-bold text-white flex items-center">
                    <span className="text-white/20 mr-1 text-xl font-light">%</span>
                    {pool.apr.replace('%', '')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">TVL</span>
                  <span className="text-xl font-bold text-white">
                    {pool.tvl}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Rewards</span>
                  <span className="text-sm font-bold text-white/60">
                    {pool.rewards}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActivePool(pool)}
                className="w-full py-5 bg-white text-black rounded-3xl flex items-center justify-center space-x-3 font-bold uppercase text-sm tracking-widest hover:bg-white/90 transition-all"
              >
                <Lock className="w-5 h-5" />
                <span>Stake</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Global Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { value: "10M+", label: "CHAIN DISTRIBUTED", icon: Gift },
            { value: "$2M+", label: "CHAINBACKS REWARDED", icon: Gift },
            { value: "5K+", label: "ACTIVE PARTICIPANTS", icon: Users },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 border border-white/5 rounded-3xl p-12 text-center hover:border-white/10 transition-all"
            >
              <stat.icon className="w-14 h-14 text-white/10 mx-auto mb-8" strokeWidth={1} />
              <div
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "4.5rem",
                  letterSpacing: "-0.04em"
                }}
                className="text-white mb-4 leading-none"
              >
                {stat.value}
              </div>
              <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Staking Modal */}
      {activePool && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setActivePool(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-black border border-white/20 rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <activePool.icon className="w-7 h-7 text-white/70" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-2xl tracking-tighter">
                    {activePool.name}
                  </h3>
                  <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{activePool.pair}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePool(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            <div className="p-10 space-y-10">
              <div className="p-8 bg-white/5 border border-white/5 rounded-[2rem]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Amount to Stake</span>
                  {balance && (
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                      Available: {parseFloat(balance.xlm).toFixed(2)} CHAIN
                    </span>
                  )}
                </div>

                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-5xl font-bold text-white placeholder:text-white/5 focus:outline-none mb-8 tracking-tighter"
                  min="0"
                  step="0.01"
                />

                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => {
                        if (balance) {
                          const amount = (
                            (parseFloat(balance.xlm) * percent) /
                            100
                          ).toFixed(2);
                          setStakeAmount(amount);
                        }
                      }}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white/40 hover:text-white transition-all font-bold uppercase tracking-widest border border-white/5"
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between text-xs uppercase tracking-widest font-bold">
                  <span className="text-white/30 italic">APR</span>
                  <span className="text-white text-lg">{activePool.apr}</span>
                </div>

                <div className="flex justify-between text-xs uppercase tracking-widest font-bold">
                  <span className="text-white/30 italic">Est. Daily Rewards</span>
                  <span className="text-white text-lg">
                    {stakeAmount
                      ? (
                        (parseFloat(stakeAmount) *
                          parseFloat(activePool.apr)) /
                        100 /
                        365
                      ).toFixed(4)
                      : "0.0000"}{" "}
                    CHAIN
                  </span>
                </div>

                <div className="flex justify-between text-xs uppercase tracking-widest font-bold">
                  <span className="text-white/30 italic">Lock Period</span>
                  <span className="text-white text-lg">None</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStake}
                disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                className="w-full py-6 bg-white text-black rounded-3xl flex items-center justify-center space-x-3 font-bold uppercase text-sm tracking-widest hover:bg-white/90 transition-all disabled:opacity-10"
              >
                <Lock className="w-5 h-5" />
                <span>Confirm Staking</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GIVfarm;

