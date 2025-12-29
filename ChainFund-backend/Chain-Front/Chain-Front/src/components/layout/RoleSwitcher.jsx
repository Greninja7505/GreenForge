import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User, Briefcase, Code, Vote, Shield, Sparkles } from "lucide-react";
import { useUser, USER_ROLES } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const RoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dropdownRef = useRef(null);
  const { activeRole, setActiveRole, user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Role configuration with icons and descriptions
  const roleConfig = {
    [USER_ROLES.DONOR]: {
      name: "Donor",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      description: "Support projects",
    },
    [USER_ROLES.CREATOR]: {
      name: "Creator",
      icon: Code,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      description: "Build & fundraise",
    },
    [USER_ROLES.FREELANCER]: {
      name: "Freelancer",
      icon: Briefcase,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      description: "Offer services",
    },
    [USER_ROLES.GOVERNOR]: {
      name: "Governor",
      icon: Vote,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
      description: "Vote & govern",
    },
    [USER_ROLES.ADMIN]: {
      name: "Admin",
      icon: Shield,
      color: "from-red-500 to-rose-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      description: "Full access",
    },
  };

  const currentRole = roleConfig[activeRole] || roleConfig[USER_ROLES.DONOR];
  const CurrentIcon = currentRole.icon;

  // Available roles - all users can switch between these
  const availableRoles = [
    USER_ROLES.DONOR,
    USER_ROLES.CREATOR,
    USER_ROLES.FREELANCER,
    USER_ROLES.GOVERNOR,
  ];

  // Add admin if user is admin
  if (user?.role === USER_ROLES.ADMIN) {
    availableRoles.push(USER_ROLES.ADMIN);
  }

  const handleRoleChange = (role) => {
    if (role === activeRole) {
      setIsOpen(false);
      return;
    }

    const config = roleConfig[role];

    // Start transition animation
    setIsTransitioning(true);
    setIsOpen(false);

    // Show toast with role-specific styling
    toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-medium">Switched to {config.name}</p>
            <p className="text-sm text-gray-400">Dashboard updated</p>
          </div>
        </div>
      ),
      {
        duration: 2000,
        style: {
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      }
    );

    // Change role after brief delay for visual effect
    setTimeout(() => {
      setActiveRole(role);

      // Redirect to dashboard to see role-specific content
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
      }

      // End transition animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Role Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isTransitioning ? {
          scale: [1, 1.1, 1],
          boxShadow: ["0 0 0 0 rgba(255,255,255,0)", "0 0 20px 5px rgba(255,255,255,0.3)", "0 0 0 0 rgba(255,255,255,0)"]
        } : {}}
        transition={{ duration: 0.4 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${currentRole.bgColor} ${currentRole.borderColor} border hover:bg-white/5 ${isTransitioning ? 'ring-2 ring-white/30' : ''}`}
      >
        <motion.div
          className={`p-1 rounded-md bg-gradient-to-r ${currentRole.color}`}
          animate={isTransitioning ? { rotate: [0, 360] } : {}}
          transition={{ duration: 0.4 }}
        >
          <CurrentIcon className="w-3.5 h-3.5 text-white" />
        </motion.div>
        <span className="text-white">{currentRole.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 mb-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Switch Role
                </p>
              </div>

              {availableRoles.map((role) => {
                const config = roleConfig[role];
                const Icon = config.icon;
                const isActive = activeRole === role;

                return (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                      ? `${config.bgColor} ${config.borderColor} border`
                      : "hover:bg-white/5"
                      }`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${config.color} ${isActive ? "shadow-lg" : ""
                        }`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-300"
                            }`}
                        >
                          {config.name}
                        </span>
                        {isActive && (
                          <span className="text-xs text-green-400">✓</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Your view adapts to your selected role
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
