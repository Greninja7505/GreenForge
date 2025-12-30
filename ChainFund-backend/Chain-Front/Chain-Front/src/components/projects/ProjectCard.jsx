import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, CheckCircle, TrendingUp } from "lucide-react";
import { getCategoryDisplayName } from "../../utils/categories";

const ProjectCard = ({ project, index, viewMode = "grid" }) => {
  const progressPercentage = (project.raised / project.goal) * 100;

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
      >
        <Link to={`/project/${project.slug}`}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300 group flex flex-col md:flex-row gap-6"
          >
            {/* Image */}
            <div className="w-full md:w-64 h-48 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl flex-shrink-0 relative overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-16 h-16 text-white/20" />
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {project.verified && (
                  <span className="px-3 py-1 bg-gray-700/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
                {project.givbacksEligible && (
                  <span className="px-3 py-1 bg-gray-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                    GIVbacks
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <span className="text-sm text-gray-400 font-semibold mb-2 uppercase">
                {getCategoryDisplayName(project.category)}
              </span>

              <h3
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "400",
                  fontSize: "1.5rem",
                  letterSpacing: "0.02em",
                }}
                className="text-white mb-3 group-hover:text-gray-300 transition-colors"
              >
                {project.title}
              </h3>

              <p
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  lineHeight: "1.6",
                }}
                className="text-gray-500 mb-4 flex-1"
              >
                {project.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    {project.donors} funders
                  </span>
                  <span className="text-white font-semibold">
                    ${project.raised.toLocaleString()} of $
                    {project.goal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-gray-400 to-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-dark-700">
                <span className="text-gray-400 text-sm">
                  {progressPercentage.toFixed(0)}% funded
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-300 font-semibold text-sm flex items-center space-x-1"
                >
                  <span>View Project</span>
                  <TrendingUp className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/project/${project.slug}`}>
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300 h-full flex flex-col group"
        >
          {/* Project Image */}
          <div className="w-full h-48 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-xl mb-6 overflow-hidden relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-16 h-16 text-white/20" />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex space-x-2">
              {project.verified && (
                <span className="px-3 py-1 bg-gray-700/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
              {project.givbacksEligible && (
                <span className="px-3 py-1 bg-gray-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  GIVbacks
                </span>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="flex-1 flex flex-col">
            <span className="text-sm text-gray-400 font-semibold mb-2 uppercase">
              {getCategoryDisplayName(project.category)}
            </span>

            <h3
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1.5rem",
                letterSpacing: "0.02em",
              }}
              className="text-white mb-3 group-hover:text-gray-300 transition-colors"
            >
              {project.title}
            </h3>

            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
                lineHeight: "1.6",
              }}
              className="text-gray-500 mb-6 flex-1"
            >
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Raised</span>
                <span className="text-white font-semibold">
                  ${project.raised.toLocaleString()} / $
                  {project.goal.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercentage}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-gray-400 to-gray-300"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-dark-700">
              <div className="flex items-center space-x-2 text-gray-400">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{project.donors} funders</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-gray-300 font-semibold text-sm flex items-center space-x-1"
              >
                <span>Fund Now</span>
                <TrendingUp className="w-4 h-4" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
