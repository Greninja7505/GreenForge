import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParticlesBg from "../ui/ParticlesBg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex flex-col bg-black overflow-hidden select-none">
      {/* Background Particles */}
      <ParticlesBg
        className="absolute inset-0 z-0"
        quantity={100}
        color="#FFFFFF"
        staticity={10}
        ease={100}
      />

      {/* Subtle Grain Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-1" />

      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 lg:px-16 max-w-[1200px] mx-auto w-full text-center py-20">
        {/* Headline Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h1
            style={{
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: "1.05",
            }}
            className="text-white text-[clamp(3.5rem,10vw,7rem)] font-medium leading-[0.95]"
          >
            Fund the Future <br />
            <span className="text-white/40">of Web3.</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
            }}
            className="text-gray-400 text-lg md:text-xl max-w-[700px] mx-auto font-light leading-relaxed"
          >
            Institutional-grade crowdfunding on Stellar. Milestone-based escrow,
            transparent governance, and blockchain-verified accountability.
          </motion.p>
        </motion.div>

        {/* Action Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-6 mt-16"
        >
          <Link to="/projects/all">
            <button
              className="px-12 py-4 bg-white text-black font-semibold text-sm tracking-tight hover:bg-gray-200 transition-all duration-300 rounded-sm shadow-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore Projects
            </button>
          </Link>

          <Link to="/create-project">
            <button
              className="px-12 py-4 border border-white/20 text-white font-semibold text-sm tracking-tight hover:bg-white/5 transition-all duration-300 rounded-sm backdrop-blur-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Start Building
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Optical bottom spacing */}
      <div className="h-24 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
