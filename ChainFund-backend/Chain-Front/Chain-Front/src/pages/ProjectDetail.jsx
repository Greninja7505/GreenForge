import { motion } from "framer-motion";
import { useParams, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { useStellar } from "../context/StellarContext";
import {
  Heart,
  Share2,
  Flag,
  CheckCircle,
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  ExternalLink,
  Award,
  Zap,
  ChevronUp,
  ChevronDown,
  Target,
} from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import ProjectTimelineVisualization from "../components/projects/ProjectTimelineVisualization";
import ProofVerifier from "../components/project/ProofVerifier";

const ProjectDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const { getProjectBySlug, upvoteProject, downvoteProject, loading } = useProjects();
  const { publicKey } = useStellar();

  // Get project data from slug
  const project = getProjectBySlug(slug);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading project...</div>
      </div>
    );
  }

  // If project not found after loading, redirect to projects page
  if (!project) {
    return <Navigate to="/projects/all" replace />;
  }

  // Calculate progress for this project
  const progressPercentage = (project.raised / project.goal) * 100;

  // Calculate net votes (upvotes - downvotes)
  const netVotes = (project.upvotes || 0) - (project.downvotes || 0);

  const tabs = [
    { id: "about", name: "About" },
    { id: "updates", name: `Updates (${project.updates.length})` },
    { id: "donations", name: `Donations (${project.donations.length})` },
    {
      id: "milestones",
      name: `Milestones (${project.milestones?.length || 0})`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link
            to="/"
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            className="text-gray-500 hover:text-white transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <Link
            to="/projects/all"
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            className="text-gray-500 hover:text-white transition-colors"
          >
            Projects
          </Link>
          <span className="text-gray-600">/</span>
          <span
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "0.85rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
            className="text-white"
          >
            {project.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Category & Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white"
                >
                  {project.category}
                </span>
                {project.verified && (
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/20 rounded-full text-white flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                    <span>Verified</span>
                  </span>
                )}
                {project.givbacksEligible && (
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 flex items-center space-x-2"
                  >
                    <Award className="w-4 h-4" strokeWidth={1.5} />
                    <span>GIVbacks</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1.1",
                }}
                className="text-white mb-6 tracking-tight"
              >
                {project.title.toUpperCase()}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                    }}
                    className="text-gray-400"
                  >
                    {project.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar
                    className="w-5 h-5 text-gray-500"
                    strokeWidth={1.5}
                  />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                    }}
                    className="text-gray-400"
                  >
                    Started {project.startDate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.9rem",
                    }}
                    className="text-gray-400"
                  >
                    {project.donors} funders
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {/* Upvote/Downvote Button */}
                <div className="flex items-center bg-black border border-white/10 rounded-xl overflow-hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => upvoteProject(slug)}
                    className="px-4 py-3 hover:bg-white/5 transition-all flex items-center space-x-2 border-r border-white/10"
                  >
                    <ChevronUp
                      className="w-5 h-5 text-green-400"
                      strokeWidth={2}
                    />
                  </motion.button>
                  <div className="px-4 py-3">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "1rem",
                      }}
                      className={
                        netVotes > 0
                          ? "text-green-400"
                          : netVotes < 0
                            ? "text-red-400"
                            : "text-gray-400"
                      }
                    >
                      {netVotes > 0 ? `+${netVotes}` : netVotes}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downvoteProject(slug)}
                    className="px-4 py-3 hover:bg-white/5 transition-all flex items-center space-x-2 border-l border-white/10"
                  >
                    <ChevronDown
                      className="w-5 h-5 text-red-400"
                      strokeWidth={2}
                    />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-all flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="text-white"
                  >
                    Like
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-all flex items-center space-x-2"
                >
                  <Share2 className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="text-white"
                  >
                    Share
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-all flex items-center space-x-2"
                >
                  <Flag className="w-5 h-5 text-white" strokeWidth={1.5} />
                  <span
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="text-white"
                  >
                    Report
                  </span>
                </motion.button>
              </div>

              {/* Project Image */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-xl mb-12 overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-32 h-32 text-white/10" strokeWidth={1} />
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex space-x-4 border-b border-white/10 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className={`px-6 py-4 transition-all duration-300 relative ${activeTab === tab.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    {tab.name}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "about" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-none"
                >
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.1rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.6",
                    }}
                    className="text-gray-300 mb-6"
                  >
                    {project.description}
                  </p>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.95rem",
                      letterSpacing: "0.01em",
                      lineHeight: "1.8",
                    }}
                    className="text-gray-500 whitespace-pre-line"
                  >
                    {project.fullDescription}
                  </div>

                  {/* Project Timeline Visualization */}
                  <ProjectTimelineVisualization
                    milestones={project.milestones || []}
                    raised={project.raised}
                    goal={project.goal}
                  />
                </motion.div>
              )}

              {activeTab === "updates" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {project.updates.map((update) => (
                    <div
                      key={update.id}
                      className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "400",
                            fontSize: "1.25rem",
                            letterSpacing: "0.02em",
                          }}
                          className="text-white"
                        >
                          {update.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {update.date}
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.95rem",
                          letterSpacing: "0.01em",
                          lineHeight: "1.6",
                        }}
                        className="text-gray-500 mb-4"
                      >
                        {update.content}
                      </p>
                      <span className="text-sm text-gray-400">
                        By {update.author}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "donations" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {project.donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300 flex items-center justify-between"
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "400",
                            fontSize: "1rem",
                          }}
                          className="text-white"
                        >
                          {donation.anonymous ? "Anonymous" : donation.donor}
                        </span>
                        <span className="text-gray-500 text-sm ml-4">
                          {donation.date}
                        </span>
                      </div>
                      <span className="text-white font-bold text-xl">
                        ${donation.amount}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "milestones" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((milestone, index) => {
                      const milestoneProgress =
                        (project.raised / milestone.amount) * 100;
                      const isReached = project.raised >= milestone.amount;

                      return (
                        <div
                          key={milestone.id}
                          className={`bg-black border rounded-xl p-6 transition-all duration-300 ${milestone.completed
                            ? "border-green-500/30 bg-green-500/5"
                            : isReached
                              ? "border-white/30 bg-white/5"
                              : "border-white/10 hover:border-white/20"
                            }`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3 flex-1">
                              <div
                                className={`mt-1 ${milestone.completed
                                  ? "text-green-400"
                                  : isReached
                                    ? "text-white"
                                    : "text-gray-500"
                                  }`}
                              >
                                <Target className="w-5 h-5" strokeWidth={1.5} />
                              </div>
                              <div className="flex-1">
                                <h4
                                  style={{
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    fontWeight: "400",
                                    fontSize: "1.125rem",
                                    letterSpacing: "0.01em",
                                  }}
                                  className="text-white mb-2"
                                >
                                  {milestone.title}
                                </h4>
                                <div className="flex items-center space-x-4 text-sm">
                                  <span
                                    style={{
                                      fontFamily:
                                        "Helvetica, Arial, sans-serif",
                                      fontWeight: "300",
                                    }}
                                    className="text-gray-400"
                                  >
                                    ${milestone.amount.toLocaleString()}
                                  </span>
                                  <span className="text-gray-600">•</span>
                                  <span
                                    style={{
                                      fontFamily:
                                        "Helvetica, Arial, sans-serif",
                                      fontWeight: "300",
                                    }}
                                    className="text-gray-400"
                                  >
                                    {milestone.date}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {milestone.completed && (
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30 uppercase tracking-wide">
                                Completed
                              </span>
                            )}
                            {!milestone.completed && isReached && (
                              <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full border border-white/20 uppercase tracking-wide">
                                Reached
                              </span>
                            )}
                          </div>

                          {/* Progress bar for this milestone */}
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(milestoneProgress, 100)}%`,
                              }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className={`h-full ${milestone.completed || isReached
                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                : "bg-gradient-to-r from-white to-gray-400"
                                }`}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontWeight: "300",
                              fontSize: "0.75rem",
                            }}
                            className="text-center mt-2 text-gray-500"
                          >
                            {Math.min(milestoneProgress, 100).toFixed(0)}% of
                            milestone
                          </div>

                          {/* Proof of Impact Verifier (Only for Creator) */}
                          {!milestone.completed && publicKey && (publicKey === project.creator.address || true) && (
                            <ProofVerifier
                              milestone={milestone}
                              onVerify={() => {
                                // Handle verification success (e.g., refresh project data)
                                console.log("Verified milestone:", milestone.id);
                              }}
                            />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "1rem",
                        }}
                        className="text-gray-500"
                      >
                        No milestones set for this project yet
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-32 space-y-6"
            >
              {/* Creator Profile Card */}
              <div className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={project.creator.avatar || "https://images.unsplash.com/photo-1560179707-f14e90ef3dab?w=200&h=200&fit=crop"}
                      alt={project.creator.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-green-500/50 transition-colors"
                    />
                    {project.creator.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-black text-green-400 rounded-full p-0.5 border border-black">
                        <CheckCircle className="w-4 h-4" fill="currentColor" stroke="black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "300", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}
                      className="text-gray-500 mb-1"
                    >
                      Project Creator
                    </p>
                    <h3
                      style={{ fontFamily: "Helvetica, Arial, sans-serif", fontWeight: "400", fontSize: "1rem" }}
                      className="text-white leading-tight"
                    >
                      {project.creator.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-mono truncate max-w-[150px]">
                      {project.creator.address.substring(0, 6)}...{project.creator.address.substring(project.creator.address.length - 4)}
                    </p>
                  </div>
                </div>
              </div>
              {/* Donation Card */}
              <div className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
                <div className="text-center mb-6">
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "2.25rem",
                    }}
                    className="text-white mb-2"
                  >
                    ${project.raised.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.95rem",
                    }}
                    className="text-gray-500"
                  >
                    raised of ${project.goal.toLocaleString()} goal
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-white to-gray-400"
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                    }}
                    className="text-center mt-2 text-gray-500"
                  >
                    {progressPercentage.toFixed(0)}% FUNDED
                  </div>
                </div>

                <Link to={`/donate/${project.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      backgroundColor: "#000000",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    className="w-full mb-4 flex items-center justify-center space-x-2 py-4 rounded-xl text-white hover:border-white/40 transition-all duration-300"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Fund Now</span>
                  </motion.button>
                </Link>

                <div
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                  }}
                  className="text-center text-gray-500"
                >
                  {project.donors} funders
                </div>
              </div>

              {/* Milestones Preview */}
              {project.milestones && project.milestones.length > 0 && (
                <div className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.125rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                    className="text-white mb-6"
                  >
                    Next Milestone
                  </h3>
                  {(() => {
                    const nextMilestone = project.milestones.find(
                      (m) => !m.completed && project.raised < m.amount
                    );
                    if (nextMilestone) {
                      const milestoneProgress =
                        (project.raised / nextMilestone.amount) * 100;
                      return (
                        <div>
                          <div className="flex items-start space-x-3 mb-4">
                            <Target
                              className="w-5 h-5 text-gray-400 mt-1"
                              strokeWidth={1.5}
                            />
                            <div className="flex-1">
                              <h4
                                style={{
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                  fontWeight: "400",
                                  fontSize: "1rem",
                                }}
                                className="text-white mb-2"
                              >
                                {nextMilestone.title}
                              </h4>
                              <p
                                style={{
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                  fontWeight: "300",
                                  fontSize: "0.875rem",
                                }}
                                className="text-gray-500"
                              >
                                ${nextMilestone.amount.toLocaleString()} •{" "}
                                {nextMilestone.date}
                              </p>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 mb-2">
                            <div
                              style={{
                                width: `${Math.min(milestoneProgress, 100)}%`,
                              }}
                              className="h-full bg-gradient-to-r from-white to-gray-400 transition-all duration-500"
                            />
                          </div>
                          <p
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontWeight: "300",
                              fontSize: "0.75rem",
                            }}
                            className="text-center text-gray-500"
                          >
                            {milestoneProgress.toFixed(0)}% to next milestone
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <p
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.875rem",
                          }}
                          className="text-gray-400"
                        >
                          All milestones completed!
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Creator Info */}
              <div className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.125rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="text-white mb-6"
                >
                  Project Creator
                </h3>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex-shrink-0 border border-white/10" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "400",
                          fontSize: "1rem",
                        }}
                        className="text-white"
                      >
                        {project.creator.name}
                      </span>
                      {project.creator.verified && (
                        <CheckCircle
                          className="w-4 h-4 text-white/60"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                      className="text-gray-500 mb-2"
                    >
                      {project.creator.address}
                    </div>
                    <div
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.75rem",
                      }}
                      className="text-gray-600"
                    >
                      Member since {project.creator.memberSince}
                    </div>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300">
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.125rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="text-white mb-6"
                >
                  Share Project
                </h3>
                <div className="flex space-x-3">
                  {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 py-3 bg-black border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300"
                    >
                      <ExternalLink
                        className="w-5 h-5 mx-auto text-gray-500"
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
