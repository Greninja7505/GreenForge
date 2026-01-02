import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Sparkles, Heart, Rocket, Briefcase, Shield } from "lucide-react";
import { useUser, USER_ROLES } from "../context/UserContext";
import toast from "react-hot-toast";

const roleOptions = [
  { value: USER_ROLES.DONOR, label: "Donor", icon: Heart, description: "Support projects and earn rewards" },
  { value: USER_ROLES.CREATOR, label: "Project Creator", icon: Rocket, description: "Launch and manage projects" },
  { value: USER_ROLES.FREELANCER, label: "Freelancer", icon: Briefcase, description: "Offer services to projects" },
  { value: USER_ROLES.GOVERNOR, label: "DAO Governor", icon: Shield, description: "Participate in governance" },
];

const SignUp = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.DONOR,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Registration with role selection
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      toast.success("Account created successfully! Welcome to Stellar Forge!");
      navigate("/onboarding");
    } else {
      toast.error(result.error || "Registration failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden py-12">
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
            Create Account
          </h1>
          <p
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: "300",
              fontSize: "0.95rem",
            }}
            className="text-gray-400"
          >
            Join Stellar Forge and start making a difference
          </p>
        </div>

        {/* Sign Up Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          {/* Name Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="block text-gray-400 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                style={{
                  fontFamily: "Helvetica, Arial, sans-serif",
                  fontWeight: "300",
                }}
              />
            </div>
          </div>

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

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="block text-gray-400 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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

          {/* Role Selection */}
          <div className="mb-6">
            <label
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "400",
                fontSize: "0.875rem",
              }}
              className="block text-gray-400 mb-3"
            >
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: option.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.role === option.value
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 bg-black/30 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${formData.role === option.value ? 'text-white' : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${formData.role === option.value ? 'text-white' : 'text-gray-300'}`}>
                        {option.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign Up Button */}
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
            <span>Create Account</span>
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

          {/* Sign In Link */}
          <div className="text-center">
            <p
              style={{
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "300",
                fontSize: "0.875rem",
              }}
              className="text-gray-400"
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-white font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignUp;
