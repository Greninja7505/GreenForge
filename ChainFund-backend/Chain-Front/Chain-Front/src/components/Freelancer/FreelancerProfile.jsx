import { motion } from "framer-motion";
import { useState } from "react";
import {
  Star,
  MapPin,
  Globe,
  Award,
  Briefcase,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { mockFreelancer } from "../../data/freelancer";

const FreelancerProfile = ({ freelancer = mockFreelancer }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black opacity-50" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col items-center mb-12">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                src={freelancer.avatar || "/default-avatar.png"}
                alt={freelancer.name}
                className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4 shadow-2xl"
              />
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl font-bold text-white mb-3"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                }}
              >
                {freelancer.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-gray-400 mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "400",
                  lineHeight: "1.4",
                }}
              >
                {freelancer.title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-gray-400 mb-6 max-w-2xl text-base"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "400",
                  lineHeight: "1.6",
                }}
              >
                {freelancer.tagline}
              </motion.p>
              <div className="flex items-center gap-6 text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {freelancer.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                    {freelancer.languages?.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  label: "Orders Completed",
                  value: freelancer.stats?.ordersCompleted || 0,
                  icon: Briefcase,
                  description: "Total projects delivered successfully",
                },
                {
                  label: "Reviews",
                  value: freelancer.stats?.reviews || 0,
                  icon: Star,
                  description: "Client feedback and ratings received",
                },
                {
                  label: "Repeat Clients",
                  value: freelancer.stats?.repeatClients || 0,
                  icon: Award,
                  description: "Clients who returned for more work",
                },
                {
                  label: "Response Time",
                  value: freelancer.stats?.responseTime || "1h",
                  icon: MessageSquare,
                  description: "Average time to respond to inquiries",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#1a1a1a] rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-white/5 hover:border-white/10"
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <stat.icon
                      className="w-10 h-10 text-gray-400"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Label */}
                  <h3
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "600",
                      fontSize: "1rem",
                      letterSpacing: "-0.01em",
                    }}
                    className="text-white mb-2"
                  >
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                    }}
                    className="text-gray-400 mb-4"
                  >
                    {stat.description}
                  </p>

                  {/* Value */}
                  <div
                    className="text-3xl font-bold mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "#49E4A4",
                      fontWeight: "700",
                    }}
                  >
                    {stat.value}
                  </div>

                  {/* View Details Link */}
                  <button
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                    className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Tabs */}
      <div className="container-custom py-8 max-w-6xl mx-auto">
        <div className="flex gap-3 mb-12 flex-wrap">
          {["overview", "portfolio", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#5B6FED] text-white"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a] border border-white/10"
              }`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300"
              >
                <div className="mb-6">
                  <h2
                    className="text-2xl font-bold text-white mb-6"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                      letterSpacing: "-0.01em",
                      lineHeight: "1.2",
                    }}
                  >
                    About Me
                  </h2>
                  <p
                    className="text-gray-400 text-base leading-relaxed"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.7",
                    }}
                  >
                    {freelancer.bio}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-6">
                  <h3
                    className="text-xl font-semibold text-white mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "600",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {freelancer.skills?.map((skill, index) => (
                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
              >
                <h3
                  className="text-xl font-semibold text-white mb-6"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "600",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Contact & Hire
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-2 h-2 bg-[#49E4A4] rounded-full"></div>
                    <span className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                      Available for new projects
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                    <span className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                      Response time: ~2 hours
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-2 h-2 bg-[#5B6FED] rounded-full"></div>
                    <span className="text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                      Starting from ${freelancer.hourlyRate}/hr
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-[#5B6FED] text-white rounded-xl hover:bg-[#5B6FED]/90 transition-all duration-300 font-semibold text-base"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "600",
                    letterSpacing: "0.01em",
                  }}
                >
                  Send Message
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freelancer.portfolio?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex flex-wrap gap-2">
                      {item.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-md"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-bold text-white mb-3 group-hover:text-[#5B6FED] transition-colors duration-300"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "700",
                      letterSpacing: "-0.01em",
                      lineHeight: "1.3",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-gray-400 text-sm leading-relaxed mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.technologies?.slice(0, 2).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-black text-gray-400 text-xs rounded-full font-medium border border-white/10"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-[#5B6FED]/10 text-[#5B6FED] rounded-lg hover:bg-[#5B6FED] hover:text-white transition-all duration-300 text-sm font-medium border border-[#5B6FED]/20"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                    >
                      View Project
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {freelancer.reviews?.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={review.avatar || "/default-avatar.png"}
                      alt={review.name}
                      className="w-14 h-14 rounded-full border-2 border-[#49E4A4]/50 group-hover:border-[#49E4A4] transition-colors duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#49E4A4] rounded-full border-2 border-[#1a1a1a]"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4
                          className="text-white font-semibold text-lg"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "600",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {review.client}
                        </h4>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-[#FFD700] fill-current"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                        {review.date}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-[#5B6FED] font-medium text-base mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        {review.project}
                      </h5>
                      <p
                        className="text-gray-400 text-base leading-relaxed"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          lineHeight: "1.6",
                        }}
                      >
                        "{review.comment}"
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#49E4A4] rounded-full"></div>
                        <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                          Verified Review
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#5B6FED] rounded-full"></div>
                        <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                          Repeat Client
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
