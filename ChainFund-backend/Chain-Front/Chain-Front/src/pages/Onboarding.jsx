import { motion } from "framer-motion";
import {
  Wallet,
  UserPlus,
  DollarSign,
  Gift,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import RoleSelector from "../components/RoleSelector";
import { useUser } from "../context/UserContext";

const Onboarding = () => {
  const { isLoggedIn } = useUser();
  
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description:
        "Install Freighter wallet extension and create your Stellar account",
      action: "Get Freighter",
      link: "https://www.freighter.app/",
    },
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description:
        "Set up your donor or project creator profile on the platform",
      action: "Sign Up",
      link: "/create-project",
    },
    {
      icon: DollarSign,
      title: "Fund Your Wallet",
      description:
        "Add XLM or other Stellar assets to your wallet to start donating",
      action: "Learn How",
      link: "#",
    },
    {
      icon: Gift,
      title: "Start Giving",
      description:
        "Browse projects and make your first donation to earn GIVbacks",
      action: "Explore Projects",
      link: "/projects/all",
    },
  ];

  const benefits = [
    "Zero platform fees - 100% goes to projects",
    "Instant transactions on Stellar network",
    "Earn GIV tokens through GIVbacks program",
    "Transparent on-chain verification",
    "Global accessibility from anywhere",
    "Low transaction costs",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Get Started with <span className="gradient-text">Stellar Forge</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of donors and changemakers making real impact through
            blockchain giving
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card group"
            >
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-primary-400 font-semibold text-sm mb-2">
                    Step {index + 1}
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 mb-6">{step.description}</p>
                  <Link
                    to={step.link}
                    target={step.link.startsWith("http") ? "_blank" : undefined}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>{step.action}</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Role Selection - Only show for logged in users */}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card mb-20"
          >
            <RoleSelector showTitle={true} />
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <h2 className="text-3xl font-display font-bold mb-8 text-white text-center">
            Why Choose Stellar Forge?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Onboarding;
