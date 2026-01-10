import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import CoreFeatures from "../components/home/CoreFeatures";
import ProjectShowcase from "../components/home/ProjectShowcase";
import ImpactGlobe from "../components/home/ImpactGlobe";
import Marquee from "../components/home/Marquee";
import SocialFeed from "../components/SocialFeed";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />

      {/* Living Globe 3D Visualization */}
      <section className="bg-black py-0 border-y border-white/10">
        <ImpactGlobe />
      </section>

      {/* Core Features */}
      <CoreFeatures />

      {/* Project Showcase */}
      <ProjectShowcase />

      {/* Community Updates / Instagram-style Feed */}
      <SocialFeed />

      {/* Marquee Testimonials */}
      <Marquee />
    </motion.div>
  );
};

export default Home;
