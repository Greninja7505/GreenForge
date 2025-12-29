import { motion } from "framer-motion";
import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { mockEarnings } from "../../data/earnings";

const EarningsDashboard = ({ earnings = mockEarnings }) => {
  const [timeRange, setTimeRange] = useState("month");

  const totalEarnings = earnings?.total || 0;
  const availableBalance = earnings?.available || 0;
  const pendingBalance = earnings?.pending || 0;
  const monthlyEarnings = earnings?.monthly || [];

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
              Earnings Dashboard
            </h1>
            <p
              className="text-base text-gray-400 max-w-2xl"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "400",
                lineHeight: "1.5",
              }}
            >
              Track your income, manage withdrawals, and monitor escrow status
            </p>
          </motion.div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 flex-wrap">
            {["week", "month", "year", "all"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  timeRange === range
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
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              label: "Total Earnings",
              value: totalEarnings,
              icon: DollarSign,
              description: "Your total earnings from all completed work",
            },
            {
              label: "Available Balance",
              value: availableBalance,
              icon: Wallet,
              description: "Funds available for withdrawal",
            },
            {
              label: "Pending Balance",
              value: pendingBalance,
              icon: TrendingUp,
              description: "Earnings held in escrow or pending approval",
            },
          ].map((card, index) => (
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
                <card.icon
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
                {card.label}
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
                {card.description}
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
                ${card.value.toLocaleString()}
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

        {/* Monthly Earnings Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#1a1a1a] rounded-2xl p-8 mb-16 border border-white/5 hover:border-white/10 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-2xl font-bold text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                letterSpacing: "-0.01em",
              }}
            >
              Earnings Over Time
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="w-5 h-5 text-[#49E4A4]" />
              <span
                className="text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                +12.5% this month
              </span>
            </div>
          </div>
          <div className="h-80 bg-black rounded-xl flex items-center justify-center border border-white/5">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p
                className="text-gray-300 text-lg font-medium"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
              >
                Chart visualization would go here (using Recharts)
              </p>
              <p
                className="text-gray-400 text-sm mt-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Interactive earnings chart with monthly breakdown
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#1a1a1a] rounded-2xl p-8 mb-16 border border-white/5 hover:border-white/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-2xl font-bold text-white"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "700",
                letterSpacing: "-0.01em",
              }}
            >
              Recent Transactions
            </h2>
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-transparent border border-white/10 hover:border-white/20 text-white rounded-xl hover:bg-white/5 transition-all duration-300 flex items-center gap-2 font-semibold"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    className="text-left py-4 px-6 text-gray-400 font-semibold uppercase text-xs tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Date
                  </th>
                  <th
                    className="text-left py-4 px-6 text-gray-400 font-semibold uppercase text-xs tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Order
                  </th>
                  <th
                    className="text-left py-4 px-6 text-gray-400 font-semibold uppercase text-xs tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Type
                  </th>
                  <th
                    className="text-left py-4 px-6 text-gray-400 font-semibold uppercase text-xs tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Amount
                  </th>
                  <th
                    className="text-left py-4 px-6 text-gray-400 font-semibold uppercase text-xs tracking-wider"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnings?.recentTransactions?.map((transaction, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    <td
                      className="py-4 px-6 text-gray-300 font-medium"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {transaction.date}
                    </td>
                    <td
                      className="py-4 px-6 text-white font-semibold"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      #{transaction.id}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border ${
                          transaction.type === "earning"
                            ? "bg-[#49E4A420] text-[#49E4A4] border-[#49E4A430]"
                            : "bg-white/5 text-gray-300 border-white/10"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td
                      className="py-4 px-6 text-[#49E4A4] font-bold text-lg"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      ${transaction.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase border ${
                          transaction.status === "completed"
                            ? "bg-[#49E4A420] text-[#49E4A4] border-[#49E4A430]"
                            : transaction.status === "pending"
                            ? "bg-[#7F56D920] text-[#7F56D9] border-[#7F56D930]"
                            : "bg-white/5 text-gray-300 border-white/10"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Withdrawal Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300"
        >
          <h2
            className="text-2xl font-bold text-white mb-8"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: "700",
              letterSpacing: "-0.01em",
            }}
          >
            Withdraw Funds
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-black rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3
                className="text-xl font-bold text-white mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                }}
              >
                Available Balance
              </h3>
              <div
                className="text-4xl font-bold text-[#49E4A4] mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                }}
              >
                ${availableBalance.toLocaleString()}
              </div>
              <p
                className="text-gray-400 text-sm mb-6 font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Funds available for withdrawal after escrow clearance
              </p>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 bg-[#5B6FED] text-white rounded-xl hover:bg-[#5B6FED]/90 transition-all duration-300 font-semibold text-lg"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "600",
                  letterSpacing: "-0.01em",
                }}
              >
                Withdraw to Wallet
              </motion.button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-black rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                }}
              >
                Escrow Status
              </h3>
              <div className="space-y-4">
                {earnings?.escrow?.map((escrow, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-white/10 hover:bg-[#1a1a1a]/80 transition-all duration-300"
                  >
                    <div>
                      <p
                        className="text-white font-semibold text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Order #{escrow.orderId}
                      </p>
                      <p
                        className="text-gray-400 text-xs font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {escrow.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[#49E4A4] font-bold text-lg mb-1"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: "700",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        ${escrow.amount}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase mt-1 inline-block border ${
                          escrow.status === "cleared"
                            ? "bg-[#49E4A420] text-[#49E4A4] border-[#49E4A430]"
                            : "bg-[#7F56D920] text-[#7F56D9] border-[#7F56D930]"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {escrow.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EarningsDashboard;
