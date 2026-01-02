import { motion } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AnnouncementBanner = ({ position = "top" }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const announcement = {
    icon: Sparkles,
    title: "New Feature Alert! 🎉",
    message:
      "Real-time XLM to USD conversion now live! Donate with accurate pricing.",
    actionText: "Try it now",
    actionLink: "/projects/all",
  };

  const Icon = announcement.icon;

  const bannerStyles = {
    top: "sticky top-[72px] z-40", // Below navbar
    bottom: "fixed bottom-0 left-0 right-0 z-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: position === "top" ? -20 : 20 }}
      className={`${bannerStyles[position]} w-full`}
    >
      <div className="relative bg-[#0a0a0a] border-b border-white/10 overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                  {announcement.title}
                  <span className="hidden sm:inline text-gray-400 font-normal">
                    {announcement.message}
                  </span>
                </p>
                <p className="sm:hidden text-gray-400 text-xs mt-1">
                  {announcement.message}
                </p>
              </div>
            </div>

            {/* Right: Action Button + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {announcement.actionText && (
                <Link
                  to={announcement.actionLink}
                  className="group px-4 py-2 bg-white text-[#0a0a0a] hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-lg"
                >
                  {announcement.actionText}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close announcement"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBanner;
