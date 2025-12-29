import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Login with credential validation
    const result = await login(formData.email, formData.password);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Invalid credentials");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
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
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "1.5rem",
                letterSpacing: "0.02em",
              }}
              className="text-white"
            >
              Stellar Forge
            </span>
          </Link>
          <h1
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "2rem",
              letterSpacing: "-0.01em",
            }}
            className="text-white mt-8 mb-2"
          >
            Welcome Back
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.95rem",
            }}
            className="text-gray-400"
          >
            Sign in to continue to Stellar Forge
          </p>
        </div>

        {/* Sign In Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="block text-gray-400 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="block text-gray-400 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="mb-6 text-right">
            <Link
              to="/forgot-password"
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "600",
            }}
          >
            <span>Sign In</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
              }}
              className="px-4 text-gray-500 text-sm"
            >
              or
            </span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.875rem",
              }}
              className="text-gray-400"
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignIn;
