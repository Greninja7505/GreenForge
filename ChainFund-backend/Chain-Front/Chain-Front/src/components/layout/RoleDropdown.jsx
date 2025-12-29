import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Heart, Rocket, Briefcase, Shield } from "lucide-react";
import { useUser, USER_ROLES } from "../../context/UserContext";
import toast from "react-hot-toast";

const roleConfig = [
  {
    role: USER_ROLES.DONOR,
    title: "Donor",
    icon: Heart,
    description: "Support projects"
  },
  {
    role: USER_ROLES.CREATOR,
    title: "Creator",
    icon: Rocket,
    description: "Launch projects"
  },
  {
    role: USER_ROLES.FREELANCER,
    title: "Freelancer",
    icon: Briefcase,
    description: "Offer services"
  },
  {
    role: USER_ROLES.GOVERNOR,
    title: "Governor",
    icon: Shield,
    description: "DAO governance"
  }
];

const RoleDropdown = ({ onChange }) => {
  const { user, activeRole, setActiveRole } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentRole = activeRole || USER_ROLES.DONOR;
  const currentConfig = roleConfig.find(r => r.role === currentRole) || roleConfig[0];
  const CurrentIcon = currentConfig.icon;

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

  const handleRoleSelect = (role) => {
    if (role !== currentRole) {
      setActiveRole(role);
      const config = roleConfig.find(r => r.role === role);
      toast.success(`Switched to ${config.title} mode`);
      if (onChange) onChange(role);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
      >
        <CurrentIcon className="w-4 h-4 text-white/80" />
        <span className="text-sm font-medium text-white/90">{currentConfig.title}</span>
        <ChevronDown
          className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
          >
            <div className="py-2">
              {roleConfig.map((config) => {
                const Icon = config.icon;
                const isActive = config.role === currentRole;

                return (
                  <button
                    key={config.role}
                    onClick={() => handleRoleSelect(config.role)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all duration-200 ${isActive ? 'bg-white/10' : ''
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
                    <div className="flex-1 text-left">
                      <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {config.title}
                      </span>
                      <span className="block text-xs text-white/40">
                        {config.description}
                      </span>
                    </div>
                    {isActive && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleDropdown;
