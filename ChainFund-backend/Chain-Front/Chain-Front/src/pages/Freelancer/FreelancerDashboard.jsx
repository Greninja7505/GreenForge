import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  Briefcase,
  Calendar,
  Target,
  ArrowRight,
} from "lucide-react";

const FreelancerDashboard = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Mock data - replace with actual data from hooks
  const stats = {
    totalEarnings: 2450,
    activeOrders: 3,
    completedOrders: 24,
    averageRating: 4.8,
    responseTime: "2h",
    profileViews: 156,
  };

  const earningsData = [
    { month: "Jan", earnings: 450 },
    { month: "Feb", earnings: 520 },
    { month: "Mar", earnings: 680 },
    { month: "Apr", earnings: 720 },
    { month: "May", earnings: 890 },
    { month: "Jun", earnings: 950 },
  ];

  const orderStatusData = [
    { name: "Active", value: 3, fill: "#06b6d4" },
    { name: "Completed", value: 24, fill: "#10b981" },
    { name: "Pending", value: 2, fill: "#f59e0b" },
  ];

  const recentOrders = [
    {
      id: "001",
      title: "Smart Contract Audit",
      buyer: "DeFi Protocol A",
      status: "In Progress",
      amount: 1200,
    },
    {
      id: "002",
      title: "DApp Frontend Integration",
      buyer: "Stellar Launchpad",
      status: "Completed",
      amount: 2500,
    },
    {
      id: "003",
      title: "Asset Management Tool",
      buyer: "ChainFund DAO",
      status: "Active",
      amount: 3200,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-16">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: "700", letterSpacing: "-0.01em" }}
          >
            Freelancer Dashboard
          </h1>
          <p
            className="text-gray-400 text-base"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: "400" }}
          >
            Welcome back! Here's an overview of your freelance activity.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-3 rounded-lg font-medium transition-all ${timeRange === range
                ? "bg-white text-black"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
                }`}
              style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.02em" }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Earnings",
              value: `$${stats.totalEarnings}`,
              icon: DollarSign,
              color: "#ffffff",
              description: "Verified earnings from smart contracts",
            },
            {
              label: "Active Projects",
              value: stats.activeOrders,
              icon: Briefcase,
              color: "#ffffff",
              description: "Development milestones in progress",
            },
            {
              label: "Completed Milestones",
              value: stats.completedOrders,
              icon: Target,
              color: "#ffffff",
              description: "Successfully audited and released",
            },
            {
              label: "Trust Score",
              value: stats.averageRating,
              icon: Star,
              color: "#ffffff",
              description: "Your blockchain verification status",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-black rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-white/10 hover:border-white/30"
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
                className="text-2xl font-bold"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: stat.color,
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
                  fontSize: "0.75rem",
                  letterSpacing: "0.05em",
                }}
                className="mt-4 flex items-center gap-2 text-white hover:text-gray-300 transition-colors uppercase"
              >
                <span>VIEW DETAILS</span>
                <ArrowRight className="w-3 h-3" strokeWidth={2} />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Chart */}
          <div className="bg-black rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
            <h2
              className="text-xl font-bold text-white mb-6"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
            >
              Earnings Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis
                  dataKey="month"
                  stroke="#9CA3AF"
                  fontFamily="Inter, sans-serif"
                  fontSize="0.75rem"
                />
                <YAxis stroke="#9CA3AF" fontFamily="Inter, sans-serif" fontSize="0.75rem" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontFamily: "Inter, sans-serif",
                    color: "#ffffff",
                    fontSize: "0.875rem",
                  }}
                />
                <Bar dataKey="earnings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Chart */}
          <div className="bg-black rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300">
            <h2
              className="text-xl font-bold text-white mb-6"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
            >
              Order Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontFamily: "Inter, sans-serif",
                    color: "#ffffff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {orderStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span
                    className="text-gray-400 text-sm"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-black rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
            >
              Recent Orders
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", fontWeight: "600" }}
            >
              View All Orders
            </motion.button>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "1rem" }}
                    >
                      {order.title}
                    </h3>
                    <p
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Buyer: {order.buyer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className="text-white font-bold text-lg mb-1"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      ${order.amount}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === "Completed"
                        ? "bg-white/10 text-white border-white/20"
                        : order.status === "Active"
                          ? "bg-white/5 text-white/80 border-white/10"
                          : "bg-white/5 text-white/60 border-white/5"
                        }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-transparent text-white rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 border border-white/10 hover:border-white/20"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
