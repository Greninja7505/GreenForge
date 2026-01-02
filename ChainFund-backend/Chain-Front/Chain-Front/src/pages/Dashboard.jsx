import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
  RadialBarChart, RadialBar
} from "recharts";
import {
  ArrowUpDown, X, TrendingUp, Users, Calendar, Target, Download,
  AlertTriangle, CheckCircle, Clock, DollarSign, PieChart as PieIcon,
  Activity, BarChart3, Filter, Settings, Mail, Edit, Trash2
} from "lucide-react";
import { useProjects } from "../context/ProjectsContext";
import { useUser, USER_ROLES } from "../context/UserContext";

// Role-specific dashboard components
import {
  DonorDashboard,
  CreatorDashboard,
  FreelancerDashboardWidget,
  GovernorDashboardWidget
} from "../components/dashboard";

const Dashboard = () => {
  const { projects: allProjects } = useProjects();
  const { user, activeRole } = useUser();
  const [sortField, setSortField] = useState("raised");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedProject, setSelectedProject] = useState(null);
  const [timeRange, setTimeRange] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Colors for charts
  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const STATUS_COLORS = {
    'Fully Funded': '#10b981',
    'High Progress (80-99%)': '#06b6d4',
    'Medium Progress (60-79%)': '#f59e0b',
    'Low Progress (40-59%)': '#ef4444',
    'Critical (<40%)': '#8b5cf6'
  };

  // Calculate totals
  const totalRaised = allProjects.reduce((sum, p) => sum + p.raised, 0);
  const totalGoal = allProjects.reduce((sum, p) => sum + p.goal, 0);
  const totalRemaining = totalGoal - totalRaised;

  // Advanced metrics
  const averageDonation = totalRaised / allProjects.reduce((sum, p) => sum + p.donors, 0) || 0;
  const successRate = (allProjects.filter(p => p.raised >= p.goal * 0.8).length / allProjects.length) * 100;
  const totalDonors = allProjects.reduce((sum, p) => sum + p.donors, 0);
  const averageProgress = (totalRaised / totalGoal) * 100;

  // Category distribution
  const categoryData = allProjects.reduce((acc, project) => {
    const category = project.category;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, raised: 0 };
    }
    acc[category].value += 1;
    acc[category].raised += project.raised;
    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData);

  // Funding status distribution
  const fundingStatusData = [
    {
      name: 'Fully Funded',
      value: allProjects.filter(p => p.raised >= p.goal).length,
      fill: STATUS_COLORS['Fully Funded']
    },
    {
      name: 'High Progress (80-99%)',
      value: allProjects.filter(p => p.raised >= p.goal * 0.8 && p.raised < p.goal).length,
      fill: STATUS_COLORS['High Progress (80-99%)']
    },
    {
      name: 'Medium Progress (60-79%)',
      value: allProjects.filter(p => p.raised >= p.goal * 0.6 && p.raised < p.goal * 0.8).length,
      fill: STATUS_COLORS['Medium Progress (60-79%)']
    },
    {
      name: 'Low Progress (40-59%)',
      value: allProjects.filter(p => p.raised >= p.goal * 0.4 && p.raised < p.goal * 0.6).length,
      fill: STATUS_COLORS['Low Progress (40-59%)']
    },
    {
      name: 'Critical (<40%)',
      value: allProjects.filter(p => p.raised < p.goal * 0.4).length,
      fill: STATUS_COLORS['Critical (<40%)']
    }
  ].filter(item => item.value > 0);

  // Simulated time-based data
  const timeData = [
    { month: 'Jan', raised: totalRaised * 0.1, goal: totalGoal * 0.15 },
    { month: 'Feb', raised: totalRaised * 0.15, goal: totalGoal * 0.2 },
    { month: 'Mar', raised: totalRaised * 0.25, goal: totalGoal * 0.3 },
    { month: 'Apr', raised: totalRaised * 0.35, goal: totalGoal * 0.4 },
    { month: 'May', raised: totalRaised * 0.5, goal: totalGoal * 0.55 },
    { month: 'Jun', raised: totalRaised * 0.7, goal: totalGoal * 0.75 },
    { month: 'Jul', raised: totalRaised * 0.85, goal: totalGoal * 0.9 },
    { month: 'Aug', raised: totalRaised * 0.95, goal: totalGoal * 0.95 },
    { month: 'Sep', raised: totalRaised * 1.0, goal: totalGoal * 1.0 },
  ];

  // Risk assessment
  const highRiskProjects = allProjects.filter(p => p.raised < p.goal * 0.4);
  const mediumRiskProjects = allProjects.filter(p => p.raised >= p.goal * 0.4 && p.raised < p.goal * 0.6);
  const lowRiskProjects = allProjects.filter(p => p.raised >= p.goal * 0.6);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare chart data (top 6 projects)
  const chartData = allProjects
    .slice(0, 6)
    .map((p) => ({
      name: p.title.length > 20 ? p.title.substring(0, 20) + "..." : p.title,
      Raised: p.raised,
      Goal: p.goal,
    }));

  // Filter projects
  const filteredProjects = allProjects.filter(project => {
    if (categoryFilter !== "all" && project.category !== categoryFilter) return false;
    return true;
  });

  // Sort projects
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue;
    let bValue;

    if (sortField === "remaining") {
      aValue = a.goal - a.raised;
      bValue = b.goal - b.raised;
    } else if (sortField === "title") {
      aValue = a.title;
      bValue = b.title;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortOrder === "asc"
      ? aValue - bValue
      : bValue - aValue;
  });

  // Admin actions
  const handleExportData = () => {
    const csvData = [
      ['Project Name', 'Category', 'Raised', 'Goal', 'Remaining', 'Progress', 'Donors'],
      ...sortedProjects.map(p => [
        p.title,
        p.category,
        p.raised,
        p.goal,
        p.goal - p.raised,
        ((p.raised / p.goal) * 100).toFixed(1) + '%',
        p.donors
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendNotification = (project) => {
    alert(`Notification sent to project: ${project.title}`);
  };

  const handleEditProject = (project) => {
    alert(`Edit project: ${project.title}`);
  };

  const handleDeleteProject = (project) => {
    if (confirm(`Are you sure you want to delete project: ${project.title}?`)) {
      alert(`Project deleted: ${project.title}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 bg-black text-white"
    >
      <div className="container-custom max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
            className="text-white mb-6"
          >
            Chain<span className="text-white/80">Fund</span> Dashboard
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1.25rem",
              letterSpacing: "0.01em",
            }}
            className="text-gray-400"
          >
            Welcome back, {user?.name || 'User'}! Your current role: <span className="text-cyan-400 font-medium capitalize">{activeRole || 'donor'}</span>
          </p>
        </motion.div>

        {/* Role-Specific Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          {activeRole === USER_ROLES.DONOR && <DonorDashboard />}
          {activeRole === USER_ROLES.CREATOR && <CreatorDashboard />}
          {activeRole === USER_ROLES.FREELANCER && <FreelancerDashboardWidget />}
          {activeRole === USER_ROLES.GOVERNOR && <GovernorDashboardWidget />}
        </motion.div>

        {/* Platform Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">Platform Overview</h2>
          <p className="text-gray-400">Overall statistics for all projects on ChainFund</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="stat-card bg-black border border-white/10 rounded-xl p-4 md:p-6 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-gray-300">Total Funds Raised</h3>
            </div>
            <div className="text-3xl font-bold text-white">{formatCurrency(totalRaised)}</div>
            <div className="text-sm text-gray-400 mt-2">
              {averageProgress.toFixed(1)}% of total goals
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-gray-300">Total Donors</h3>
            </div>
            <div className="text-3xl font-bold text-white">{totalDonors.toLocaleString()}</div>
            <div className="text-sm text-gray-400 mt-2">
              Avg: {formatCurrency(averageDonation)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-gray-300">Success Rate</h3>
            </div>
            <div className="text-3xl font-bold text-white">{successRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400 mt-2">
              {allProjects.filter(p => p.raised >= p.goal).length} fully funded
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
              <h3 className="text-lg font-semibold text-gray-300">Needs Attention</h3>
            </div>
            <div className="text-3xl font-bold text-white">{highRiskProjects.length}</div>
            <div className="text-sm text-gray-400 mt-2">
              Projects below 40% funding
            </div>
          </motion.div>
        </div>

        {/* Advanced Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-white" />
              Category Distribution
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-white/70" />
              Funding Status
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {fundingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Controls and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-black border border-white/10 rounded-xl p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-black border border-white/10 rounded-lg text-white focus:border-white/30 focus:outline-none appearance-none"
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryData).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>

              <div className="text-sm text-gray-400">
                Showing {filteredProjects.length} of {allProjects.length} projects
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-black border border-white/10 rounded-xl p-8 hover:border-white/30 transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white">Project Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left py-4 px-4 text-sm font-medium">
                    <button onClick={() => handleSort("title")} className="flex items-center gap-2 hover:text-white transition-colors">
                      Project Name <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-medium">
                    <button onClick={() => handleSort("raised")} className="flex items-center gap-2 ml-auto hover:text-white transition-colors">
                      Raised <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-medium">
                    <button onClick={() => handleSort("goal")} className="flex items-center gap-2 ml-auto hover:text-white transition-colors">
                      Goal <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-medium">
                    <button onClick={() => handleSort("remaining")} className="flex items-center gap-2 ml-auto hover:text-white transition-colors">
                      Remaining <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Progress</th>
                  <th className="text-center py-4 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProjects.map((project) => {
                  const remaining = project.goal - project.raised;
                  const progress = (project.raised / project.goal) * 100;
                  const riskLevel = project.raised < project.goal * 0.4 ? 'high' :
                    project.raised < project.goal * 0.6 ? 'medium' : 'low';

                  return (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-white">{project.title}</td>
                      <td className="py-4 px-4 text-right text-white">{formatCurrency(project.raised)}</td>
                      <td className="py-4 px-4 text-right text-white">{formatCurrency(project.goal)}</td>
                      <td className="py-4 px-4 text-right text-gray-400">{formatCurrency(remaining)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(progress, 100)}%` }}
                              className={`h-full ${riskLevel === 'high' ? 'bg-red-500' : riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-cyan-500'}`}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-10">{progress.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setSelectedProject(project)} className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors">
                            <Target className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEditProject(project)} className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProject(project)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-black border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-light text-white">{selectedProject.title}</h2>
                    <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10">
                      <img src={selectedProject.image} alt="" className="w-full h-full object-cover opacity-80" />
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Raised</div>
                          <div className="text-xl text-white">{formatCurrency(selectedProject.raised)}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Goal</div>
                          <div className="text-xl text-white">{formatCurrency(selectedProject.goal)}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{((selectedProject.raised / selectedProject.goal) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-white" style={{ width: `${Math.min((selectedProject.raised / selectedProject.goal) * 100, 100)}%` }} />
                        </div>
                      </div>

                      <div className="pt-6 flex gap-4">
                        <button className="flex-1 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors">
                          View details
                        </button>
                        <button className="px-6 py-3 border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-colors">
                          Notify holders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Dashboard;