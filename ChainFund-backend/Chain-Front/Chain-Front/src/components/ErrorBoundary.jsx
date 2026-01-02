import { Component } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log error to your error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center px-6 max-w-lg"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30"
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "1.75rem",
                letterSpacing: "-0.02em",
              }}
              className="text-white mb-4"
            >
              Something Went Wrong
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.95rem",
              }}
              className="text-gray-400 mb-6"
            >
              We encountered an unexpected error. Don't worry, our team has been
              notified and is working on a fix.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left overflow-auto max-h-40">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={this.handleRetry}
                className="px-6 py-3 bg-white text-black rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-200 transition-colors"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "500",
                }}
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </motion.button>

              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold flex items-center space-x-2 hover:bg-white/5 transition-colors"
                  style={{
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontWeight: "500",
                  }}
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
