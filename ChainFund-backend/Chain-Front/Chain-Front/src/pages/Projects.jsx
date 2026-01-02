import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, TrendingUp, Leaf } from "lucide-react";
import ProjectCard from "../components/projects/ProjectCard";
import CategoryFilter from "../components/projects/CategoryFilter";
import { useProjects } from "../context/ProjectsContext";
import { SkeletonCard } from "../components/ui/DemoModeBadge";

// Project Skeleton Loader Component
const ProjectSkeleton = () => (
  <div className="bg-black border border-white/10 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-br from-white/5 to-white/10" />
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-white/10 rounded-full" />
        <div className="h-5 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="h-6 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/5 rounded w-full" />
      <div className="h-4 bg-white/5 rounded w-2/3" />
      <div className="h-2 bg-white/10 rounded-full w-full mt-4" />
      <div className="flex justify-between">
        <div className="h-5 w-20 bg-white/10 rounded" />
        <div className="h-5 w-24 bg-white/5 rounded" />
      </div>
    </div>
  </div>
);

const Projects = () => {
  const { projects: allProjects, getProjectsByCategory, loading } = useProjects();
  const [projects, setProjects] = useState(allProjects);
  const [filteredProjects, setFilteredProjects] = useState(allProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const [viewMode, setViewMode] = useState("grid");

  // Update when context projects change
  useEffect(() => {
    setProjects(allProjects);
    setFilteredProjects(allProjects);
  }, [allProjects]);

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects;

    // Category filter
    if (selectedCategory !== "all" && selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "trending":
        filtered = [...filtered].sort((a, b) => b.donors - a.donors);
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      case "mostRaised":
        filtered = [...filtered].sort((a, b) => b.raised - a.raised);
        break;
      default:
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, searchTerm, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20"
    >
      <div className="container-custom max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6 tracking-tight"
          >
            FIND <span style={{ fontWeight: "400" }}>TALENT</span>
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            className="text-gray-400 max-w-3xl mx-auto"
          >
            Discover skilled freelancers from around the world ready to bring your vision to life
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8">
            <div>
              <span className="text-3xl font-bold text-white">
                {filteredProjects.length}
              </span>
              <span className="text-gray-400 ml-2">Freelancers</span>
            </div>
            <div className="w-px h-8 bg-dark-700" />
            <div>
              <span className="text-3xl font-bold text-white">
                $
                {filteredProjects
                  .reduce((sum, p) => sum + p.raised, 0)
                  .toLocaleString()}
              </span>
              <span className="text-gray-400 ml-2">Earned</span>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search freelancers by skills, expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-4 bg-dark-800/50 border border-dark-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="trending">Top Rated</option>
              <option value="newest">Recently Joined</option>
              <option value="mostRaised">Most Experienced</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-4 rounded-xl border transition-all ${viewMode === "grid"
                  ? "bg-gray-600 border-gray-600 text-white"
                  : "bg-dark-800/50 border-dark-700 text-gray-400"
                  }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-4 rounded-xl border transition-all ${viewMode === "list"
                  ? "bg-gray-600 border-gray-600 text-white"
                  : "bg-dark-800/50 border-dark-700 text-gray-400"
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </motion.div>

        {/* Projects Grid */}
        {/* Projects Grid with Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[...Array(6)].map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </motion.div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-10 h-10 text-green-500/50" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              No projects found
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Try adjusting your filters or search for different sustainability projects
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
