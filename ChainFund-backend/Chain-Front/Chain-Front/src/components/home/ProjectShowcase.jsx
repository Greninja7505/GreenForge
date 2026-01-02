import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, TrendingUp, ExternalLink, CheckCircle } from "lucide-react";
import { useProjects } from "../../context/ProjectsContext";
import { getCategoryDisplayName } from "../../utils/categories";

const ProjectShowcase = () => {
  // Get top 3 featured projects by raised amount
  const { getFeaturedProjects } = useProjects();
  const projects = getFeaturedProjects();

  return (
    <section className="section-padding bg-black/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
              }}
              className="text-white mb-4"
            >
              Featured Projects
            </h2>
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "1.1rem",
                letterSpacing: "0.01em",
              }}
              className="text-gray-400"
            >
              Sustainable initiatives creating environmental impact
            </p>
          </div>

          <Link to="/projects/all" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline flex items-center space-x-2"
            >
              <span>View All</span>
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
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
                    <span
                      style={{
                        fontFamily: "Helvetica, Arial, sans-serif",
                        fontWeight: "400",
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                      className="text-gray-500 mb-3"
                    >
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
                      <div className="flex justify-between mb-2">
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.85rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                          className="text-gray-500"
                        >
                          Raised
                        </span>
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "400",
                            fontSize: "0.9rem",
                          }}
                          className="text-white"
                        >
                          ${project.raised.toLocaleString()} / $
                          {project.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(project.raised / project.goal) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-white/60 to-white/40"
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center space-x-2 text-gray-500">
                        <Heart className="w-4 h-4" strokeWidth={1.5} />
                        <span
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontWeight: "300",
                            fontSize: "0.85rem",
                          }}
                        >
                          {project.donors} donors
                        </span>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-1"
                      >
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
                          Fund Now
                        </span>
                        <TrendingUp
                          className="w-4 h-4 text-white"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center md:hidden"
        >
          <Link to="/projects/all">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <span>View All Projects</span>
              <ExternalLink className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
