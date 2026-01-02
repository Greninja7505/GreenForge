import { motion } from "framer-motion";
import { useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { mockOrders } from "../../data/orders";

const OrderManagement = ({ orders = mockOrders, isBuyer = false }) => {
  const [activeTab, setActiveTab] = useState("active");

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "active")
      return order.status === "Active" || order.status === "In Progress";
    if (activeTab === "completed") return order.status === "Completed";
    if (activeTab === "disputes") return order.status === "Disputed";
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#36D1C4";
      case "In Progress":
        return "#7F56D9";
      case "Completed":
        return "#49E4A4";
      case "Disputed":
        return "#FF6B4A";
      default:
        return "#C9CCD9";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return Clock;
      case "In Progress":
        return AlertTriangle;
      case "Completed":
        return CheckCircle;
      case "Disputed":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-16">
        {/* Header */}
        <div className="mb-16">
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
              {isBuyer ? "My Orders" : "Order Management"}
            </h1>
            <p
              className="text-base text-gray-400 max-w-2xl"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "400",
                lineHeight: "1.5",
              }}
            >
              {isBuyer
                ? "Track your active orders and completed work"
                : "Manage orders for your gigs and track progress"}
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide"
        >
          <div className="flex gap-3">
            {["active", "completed", "disputes", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#5B6FED] text-white"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20"
                }`}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 hover:border-white/10"
              >
                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <StatusIcon className="w-6 h-6 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <h3
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "600",
                            fontSize: "1.125rem",
                            letterSpacing: "-0.01em",
                          }}
                          className="text-white mb-1"
                        >
                          {order.gig?.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "400",
                            fontSize: "0.875rem",
                          }}
                          className="text-gray-400"
                        >
                          {isBuyer
                            ? `Seller: ${order.seller?.name}`
                            : `Buyer: ${order.buyer?.name}`}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border"
                      style={{
                        backgroundColor: `${getStatusColor(order.status)}15`,
                        color: getStatusColor(order.status),
                        borderColor: `${getStatusColor(order.status)}30`,
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center gap-6 mb-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        Order #
                      </span>
                      <span className="text-white font-medium text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {order.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                        {order.date}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      Amount
                    </span>
                    <span
                      className="text-[#49E4A4] font-bold text-xl"
                      style={{
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      ${order.amount}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                    className="w-full px-4 py-3 bg-transparent text-white rounded-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3
              className="text-2xl font-semibold text-white mb-3"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
            >
              No orders found
            </h3>
            <p
              className="text-gray-400 text-lg max-w-md mx-auto"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              No orders found in this category. Check back later or try a
              different filter.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
