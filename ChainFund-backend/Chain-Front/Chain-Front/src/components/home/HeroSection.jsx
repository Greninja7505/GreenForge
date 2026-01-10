import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Smartphone, Download } from "lucide-react";
import ParticlesBg from "../ui/ParticlesBg";
import Iphone17Pro from "../ui/Iphone17Pro";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden select-none">
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

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row justify-center items-center px-6 lg:px-16 max-w-[1400px] mx-auto w-full pt-32 pb-20 gap-12 lg:gap-20">
        {/* Left Content - Text and CTA */}
        <div className="flex-1 text-center lg:text-left">
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
              className="text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.95]"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">Forge a</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 drop-shadow-[0_0_25px_rgba(74,222,128,0.4)]">Greener</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">Tomorrow.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.01em",
              }}
              className="text-lg md:text-xl max-w-[600px] mx-auto lg:mx-0 font-light leading-relaxed"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400">Blockchain-powered</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">environmental crowdfunding</span>{" "}
              <span className="text-gray-400">on Stellar. Support verified eco-projects, track real-world impact, and earn rewards for building a </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">sustainable future</span>.
            </motion.p>
          </motion.div>

          {/* Action Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-12"
          >
            <Link to="/projects/all">
              <button
                className="px-10 py-4 bg-white text-black font-semibold text-sm tracking-tight hover:bg-gray-200 transition-all duration-300 rounded-sm shadow-xl"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore Projects
              </button>
            </Link>

            <Link to="/create-project">
              <button
                className="px-10 py-4 border border-white/20 text-white font-semibold text-sm tracking-tight hover:bg-white/5 transition-all duration-300 rounded-sm backdrop-blur-sm"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Start Building
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Content - Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 relative hidden lg:block"
        >
          {/* Phone Container */}
          <div className="relative">
            <Iphone17Pro
              src="/Phone.jpeg"
              width={280}
              height={570}
              className="drop-shadow-2xl"
            />
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-16 top-1/4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Mobile App</p>
                  <p className="text-green-400 text-xs font-medium">Available Now</p>
                </div>
              </div>
            </motion.div>

            {/* Download CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-8 bottom-1/3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-2xl shadow-green-500/20"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-white" />
                <div>
                  <p className="text-white font-semibold text-sm">Get the App</p>
                  <p className="text-white/70 text-xs">Recycle & Earn</p>
                </div>
              </div>
            </motion.div>

            {/* Glow Effect */}
            <div className="absolute inset-0 -z-10 blur-[100px] opacity-40 bg-gradient-to-b from-green-500/30 via-emerald-500/20 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Optical bottom spacing */}
      <div className="h-12 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
