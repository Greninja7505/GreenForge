import { motion } from "framer-motion";
import {
  Globe,
  Coins,
  Lock,
  TrendingUp,
  Network,
  Layers,
  Wallet,
  Code,
  Zap,
  Shield,
  Database,
  GitBranch,
  Users,
} from "lucide-react";

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { id: "all", name: "All Projects", icon: Globe },
    { id: "DeFi Infrastructure", name: "DeFi Protocol", icon: Coins },
    { id: "Trading & Analytics", name: "DEX & AMM", icon: TrendingUp },
    { id: "Lending & Borrowing", name: "Lending & Borrowing", icon: Wallet },
    { id: "Staking & Yield", name: "Staking & Yield", icon: Layers },
    { id: "NFT & Gaming", name: "NFT & Gaming", icon: Zap },
    { id: "DAO & Governance", name: "DAO & Governance", icon: Users },
    { id: "Layer 2 & Scaling", name: "Infrastructure", icon: Network },
    { id: "Developer Tools", name: "Security & Audit", icon: Shield },
    { id: "Cross-Chain & Interoperability", name: "Cross-Chain Bridge", icon: GitBranch },
    { id: "Oracle & Data", name: "Oracle & Data", icon: Database },
    { id: "Privacy Technology", name: "Privacy & ZK", icon: Lock },
    { id: "Identity & Privacy", name: "Dev Tools", icon: Code },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category.id)}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: selectedCategory === category.id ? "400" : "300",
            fontSize: "0.95rem",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
          className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 ${selectedCategory === category.id
              ? "bg-black border-2 border-white text-white shadow-lg"
              : "bg-black border border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
        >
          <category.icon className="w-5 h-5" strokeWidth={1.5} />
          <span>{category.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
