import { motion } from "framer-motion";
import { useState } from "react";
import { Star, Clock, DollarSign, User, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockGigs, gigCategories } from "../../data/gigs";

const GigList = ({ gigs = mockGigs, isOwner = false }) => {
  const [filter, setFilter] = useState("all");

  const filteredGigs = gigs.filter((gig) => {
    if (filter === "all") return true;
    return gig.category === filter;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1
              className="text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                letterSpacing: "-0.01em",
              }}
            >
              {isOwner ? "My Gigs" : "Available Gigs"}
            </h1>
            <p
              className="text-base text-gray-400 max-w-2xl"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "400",
                lineHeight: "1.5",
              }}
            >
              {isOwner
                ? "Manage your active gigs and track their performance"
                : "Discover talented freelancers and find the perfect service for your project"}
            </p>
          </motion.div>
          {isOwner && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/create-project">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-blue to-electric-blue text-white rounded-2xl hover:shadow-2xl hover:shadow-primary-blue/25 transition-all duration-300 flex items-center gap-3 font-display font-semibold shadow-xl"
                  style={{
                    fontFamily: "Poppins, system-ui, sans-serif",
                    fontSize: "1rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Create New Gig
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide"
        >
          <div className="flex gap-3 flex-wrap">
            {gigCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilter(category.value)}
                className={`px-5 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  filter === category.value
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gig Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGigs.map((gig, index) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-white/10 group"
            >
              {/* Image */}
              <div className="relative h-52 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                {gig.images?.[0] && (
                  <img
                    src={gig.images[0]}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {!gig.images?.[0] && (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-600" strokeWidth={1.5} />
                  </div>
                )}
                
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/20">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-white text-xs font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                    Verified
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="bg-black/40 backdrop-blur-sm text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-white/10 uppercase font-medium"
                    style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.05em" }}
                  >
                    {gig.category.replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h3
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "600",
                    fontSize: "1.25rem",
                    letterSpacing: "-0.01em",
                  }}
                  className="text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors"
                >
                  {gig.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "400",
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                  }}
                  className="text-gray-400 mb-4 line-clamp-3"
                >
                  {gig.description}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-6 pt-4 border-t border-white/5">
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      Raised
                    </span>
                    <span
                      className="text-white font-bold text-lg"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      ${Math.min(...(gig.packages?.map((p) => p.price) || [0]))}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {gig.freelancer.rating || 0}
                    </span>
                  </div>
                </div>

                {/* Funders */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {gig.freelancer.reviews || 0} funders
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/hire/${gig.id}`}>
                  <button
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 bg-transparent text-white rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-between border border-white/10 hover:border-white/20 group/btn"
                  >
                    <span>Hire Now</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredGigs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h3 
              className="text-2xl font-semibold text-white mb-3"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
            >
              No gigs found
            </h3>
            <p
              className="text-gray-400 text-lg max-w-md mx-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              No gigs found in this category. Try selecting a different category
              or check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GigList;
