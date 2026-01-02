/**
 * Governance Page
 * DAO Governance with Quadratic Voting
 */

import React from 'react';
import { motion } from 'framer-motion';
import DAOGovernance from '../components/DAOGovernance';
import AIHelper from '../components/AIHelper';

const Governance = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-black">
      <div className="container mx-auto px-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "400",
              fontSize: "3.5rem",
              letterSpacing: "-0.02em",
            }}
            className="text-white mb-4"
          >
            DAO GOVERNANCE
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "1.125rem",
              letterSpacing: "0.01em",
            }}
            className="text-white/40 max-w-2xl mx-auto font-light"
          >
            Participate in decentralized governance with quadratic voting.
            Your vote power is based on your SBT reputation and stake.
          </p>
        </motion.div>

        {/* AI Governance Helper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <AIHelper
            context="GOVERNANCE_HELPER"
            title="Governance AI Guide"
            placeholder="Ask about voting, proposals, or governance..."
            suggestions={[
              "How does quadratic voting work?",
              "What is my vote power?",
              "How to create a proposal?",
              "What are reputation badges?",
            ]}
          />
        </motion.div>

        {/* DAO Governance Component */}
        <DAOGovernance />
      </div>
    </div>
  );
};

export default Governance;
