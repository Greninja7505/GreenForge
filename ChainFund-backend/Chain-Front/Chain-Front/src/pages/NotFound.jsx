import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6"
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "200",
            fontSize: "clamp(8rem, 20vw, 15rem)",
            letterSpacing: "-0.05em",
            lineHeight: "1",
          }}
          className="text-white/10 mb-4"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "300",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            letterSpacing: "-0.02em",
          }}
          className="text-white mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "300",
            fontSize: "1rem",
          }}
          className="text-gray-400 mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "500",
              }}
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-white/5 transition-colors"
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "500",
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <Link to="/projects/all">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-white/5 transition-colors"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "500",
              }}
            >
              <Search className="w-5 h-5" />
              <span>Browse Projects</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
