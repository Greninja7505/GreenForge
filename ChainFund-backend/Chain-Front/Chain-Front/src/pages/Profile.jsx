import { motion } from "framer-motion";
import { useState } from "react";
import {
  User,
  Mail,
  Globe,
  Twitter,
  MapPin,
  Wallet,
  Heart,
  FolderPlus,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Edit,
  LogOut,
  EyeOff,
  Eye,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useProjects } from "../context/ProjectsContext";
import { useStellar } from "../context/StellarContext";
import { useNavigate } from "react-router-dom";
import ProfileSetupModal from "../components/profile/ProfileSetupModal";
import SbtBadgesModule from "../components/SbtBadges";

const { SbtProfileSection, useSbtData, SbtBadgeGrid, SbtMiniBadges } = SbtBadgesModule;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAnonymous, toggleAnonymous, logout, isLoggedIn } = useUser();
  const { projects } = useProjects();
  const { publicKey } = useStellar();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Fetch SBT data for the connected wallet
  const sbtData = useSbtData(publicKey);

  // If no user, show create profile message
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-black border border-white/10 rounded-xl p-12">
              <User className="w-20 h-20 text-gray-500 mx-auto mb-6" />
              <h1
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "2.5rem",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
                className="text-white mb-4"
              >
                Create Your Profile
              </h1>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "1.125rem",
                  lineHeight: "1.8",
                }}
                className="text-gray-400 mb-8"
              >
                Set up your profile to track donations, create projects, and
                engage with the community.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="px-8 py-4 bg-black border border-white/20 text-white rounded-xl hover:border-white/40 transition-all duration-300"
              >
                Create Profile
              </motion.button>
            </div>
          </motion.div>
        </div>
        <ProfileSetupModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </div>
    );
  }

  // Get user's created projects
  const createdProjects = projects.filter((p) =>
    user.projectsCreated?.includes(p.slug)
  );

  // Get user's supported projects
  const supportedProjects = projects.filter((p) =>
    user.projectsSupported?.includes(p.slug)
  );

  // Get user's upvoted projects
  const upvotedProjects = projects.filter((p) =>
    user.upvotedProjects?.includes(p.slug)
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center border border-white/10">
                <User className="w-12 h-12 text-gray-500" />
              </div>

              {/* User Info */}
              <div>
                <h1
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "2.5rem",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                  className="text-white mb-2"
                >
                  {user.name}
                </h1>

                {user.bio && (
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "1.125rem",
                      lineHeight: "1.8",
                    }}
                    className="text-gray-400 max-w-2xl mb-4"
                  >
                    {user.bio}
                  </p>
                )}

                {/* User Meta */}
                <div className="flex flex-wrap gap-4 text-gray-400">
                  {user.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.875rem",
                        }}
                      >
                        {user.location}
                      </span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.875rem",
                        }}
                      >
                        {user.email}
                      </span>
                    </div>
                  )}
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.875rem",
                        }}
                      >
                        Website
                      </span>
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={`https://twitter.com/${user.twitter.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-white transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      <span
                        style={{
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontWeight: "300",
                          fontSize: "0.875rem",
                        }}
                      >
                        {user.twitter}
                      </span>
                    </a>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                    >
                      Joined{" "}
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="px-4 py-2 bg-black border border-white/20 text-white rounded-xl hover:border-white/40 transition-all duration-300 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="px-4 py-2 bg-black border border-white/10 text-white rounded-xl hover:border-white/30 transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          {/* SBT Reputation Badges */}
          {publicKey && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <SbtProfileSection walletAddress={publicKey} />
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Total Donations */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-gray-500" />
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "2rem",
                }}
                className="text-white mb-1"
              >
                ${user.totalDonations?.toLocaleString() || 0}
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="text-gray-400"
              >
                Total Donated
              </p>
            </motion.div>

            {/* Projects Created */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black border border-white/10 rounded-xl p-6"
            >
              <FolderPlus className="w-8 h-8 text-gray-500 mb-2" />
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "2rem",
                }}
                className="text-white mb-1"
              >
                {user.projectsCreated?.length || 0}
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="text-gray-400"
              >
                Projects Created
              </p>
            </motion.div>

            {/* Projects Supported */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black border border-white/10 rounded-xl p-6"
            >
              <Heart className="w-8 h-8 text-gray-500 mb-2" />
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "2rem",
                }}
                className="text-white mb-1"
              >
                {user.projectsSupported?.length || 0}
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="text-gray-400"
              >
                Projects Supported
              </p>
            </motion.div>

            {/* Upvotes Given */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-black border border-white/10 rounded-xl p-6"
            >
              <ThumbsUp className="w-8 h-8 text-gray-500 mb-2" />
              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "2rem",
                }}
                className="text-white mb-1"
              >
                {user.upvotedProjects?.length || 0}
              </h3>
              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                className="text-gray-400"
              >
                Upvotes Given
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Anonymous Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-black border border-white/10 rounded-xl p-6 mb-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isAnonymous ? (
                <EyeOff className="w-6 h-6 text-gray-500" />
              ) : (
                <Eye className="w-6 h-6 text-gray-500" />
              )}
              <div>
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="text-white mb-1"
                >
                  Anonymous Donations
                </h3>
                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                  }}
                  className="text-gray-400"
                >
                  {isAnonymous
                    ? "Your donations are currently anonymous"
                    : "Your name will be shown on donations"}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleAnonymous}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isAnonymous ? "bg-gray-700" : "bg-white"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-black transition-transform ${
                  isAnonymous ? "translate-x-1" : "translate-x-7"
                }`}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Wallet Section */}
        {user.stellarAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-black border border-white/10 rounded-xl p-6 mb-12"
          >
            <div className="flex items-center space-x-4">
              <Wallet className="w-6 h-6 text-gray-500" />
              <div className="flex-1">
                <h3
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "400",
                    fontSize: "1.25rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                  className="text-white mb-1"
                >
                  Stellar Wallet
                </h3>
                <p
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "300",
                    fontSize: "0.875rem",
                  }}
                  className="text-gray-400 font-mono break-all"
                >
                  {user.stellarAddress}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Donation History */}
        {user.donationHistory && user.donationHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Donation History
            </h2>
            <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-left text-gray-400 px-6 py-4"
                    >
                      Date
                    </th>
                    <th
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-left text-gray-400 px-6 py-4"
                    >
                      Project
                    </th>
                    <th
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-left text-gray-400 px-6 py-4"
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                      className="text-left text-gray-400 px-6 py-4"
                    >
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {user.donationHistory.map((donation, index) => {
                    const project = projects.find(
                      (p) => p.slug === donation.projectSlug
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.875rem",
                          }}
                          className="text-gray-400 px-6 py-4"
                        >
                          {new Date(donation.date).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.875rem",
                          }}
                          className="text-white px-6 py-4"
                        >
                          {project ? (
                            <button
                              onClick={() =>
                                navigate(`/project/${donation.projectSlug}`)
                              }
                              className="hover:text-gray-400 transition-colors"
                            >
                              {project.title}
                            </button>
                          ) : (
                            donation.projectSlug
                          )}
                        </td>
                        <td
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.875rem",
                          }}
                          className="text-white px-6 py-4"
                        >
                          ${donation.amount?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {donation.txHash && (
                            <a
                              href={`https://stellar.expert/explorer/public/tx/${donation.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <span
                                style={{
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                  fontWeight: "300",
                                  fontSize: "0.875rem",
                                }}
                                className="font-mono"
                              >
                                {donation.txHash.substring(0, 8)}...
                              </span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Created Projects */}
        {createdProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-12"
          >
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="bg-black border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/30 transition-all duration-300"
                >
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.25rem",
                      letterSpacing: "0.02em",
                    }}
                    className="text-white mb-2"
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                    }}
                    className="text-gray-400 mb-4 line-clamp-2"
                  >
                    {project.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "1.125rem",
                      }}
                      className="text-white"
                    >
                      ${project.raised?.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                      className="text-gray-500"
                    >
                      of ${project.goal?.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Supported Projects */}
        {supportedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Supported Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="bg-black border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/30 transition-all duration-300"
                >
                  <h3
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "400",
                      fontSize: "1.25rem",
                      letterSpacing: "0.02em",
                    }}
                    className="text-white mb-2"
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                    }}
                    className="text-gray-400 mb-4 line-clamp-2"
                  >
                    {project.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "1.125rem",
                      }}
                      className="text-white"
                    >
                      ${project.raised?.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                      className="text-gray-500"
                    >
                      of ${project.goal?.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Upvoted Projects */}
        {upvotedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-6"
            >
              Upvoted Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upvotedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/project/${project.slug}`)}
                  className="bg-black border border-white/10 rounded-xl p-6 cursor-pointer hover:border-white/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "1.25rem",
                        letterSpacing: "0.02em",
                      }}
                      className="text-white flex-1"
                    >
                      {project.title}
                    </h3>
                    <ThumbsUp className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
                  </div>
                  <p
                    style={{
                      fontFamily: "Helvetica, Arial, sans-serif",
                      fontWeight: "300",
                      fontSize: "0.875rem",
                    }}
                    className="text-gray-400 mb-4 line-clamp-2"
                  >
                    {project.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "1.125rem",
                      }}
                      className="text-white"
                    >
                      ${project.raised?.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "300",
                        fontSize: "0.875rem",
                      }}
                      className="text-gray-500"
                    >
                      {(project.upvotes || 0) - (project.downvotes || 0)} votes
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <ProfileSetupModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
