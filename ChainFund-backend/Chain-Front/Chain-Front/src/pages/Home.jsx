import { motion } from "framer-motion";
import HeroSection from "../components/home/HeroSection";
import CoreFeatures from "../components/home/CoreFeatures";
import FeaturesGrid from "../components/home/FeaturesGrid";
import ProjectShowcase from "../components/home/ProjectShowcase";
import RecentPosts from "../components/home/RecentPosts";
import Marquee from "../components/home/Marquee";
import AnnouncementBanner from "../components/home/AnnouncementBanner";
import ImpactGlobe from "../components/home/ImpactGlobe";

const Home = () => {
  return (
    <>
      {/* Announcement Banner - at bottom of window */}
      <AnnouncementBanner position="bottom" />

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

        {/* New: Detailed Core Features Cards */}
        <CoreFeatures />
        {/* Swapped: ProjectShowcase now comes before FeaturesGrid */}
        <ProjectShowcase />
        {/* New: Recent Posts Section */}
        <RecentPosts />
        {/* Marquee Section */}
        <Marquee />
        {/* Swapped: FeaturesGrid (NEED HELP? GET IN TOUCH!) now at the bottom */}
        <FeaturesGrid />
      </motion.div>
    </>
  );
};

export default Home;
