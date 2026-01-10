import { motion } from "framer-motion";
import { useUser, USER_ROLES } from "../context/UserContext";
import {
  Users,
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";

const roleConfig = [
  {
    role: USER_ROLES.USER,
    title: "User",
    description: "Explore projects, donate, participate in bounties and governance",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    features: ["Explore projects", "Donate & earn rewards", "Join Eco-Bounties", "Participate in governance"]
  },
  {
    role: USER_ROLES.ADMIN,
    title: "Admin",
    description: "Full platform access to manage projects, users and settings",
    icon: Shield,
    color: "from-red-500 to-rose-500",
    features: ["Manage all projects", "User administration", "Platform settings", "All User features"]
  }
];

const RoleSelector = ({ onComplete, showTitle = true, compact = false }) => {
  const { user, updateRole, hasRole } = useUser();

  const handleRoleSelect = (role) => {
    updateRole(role);
    toast.success(`You are now a ${role.charAt(0).toUpperCase() + role.slice(1)}!`);
    if (onComplete) {
      onComplete(role);
    }
  };

  return (
    <div className={`${compact ? '' : 'py-8'}`}>
      {showTitle && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>
          <p className="text-gray-400">Select how you want to participate in the GreenForge ecosystem</p>
        </div>
      )}

      <div className={`grid ${compact ? 'grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
        {roleConfig.map((config) => {
          const Icon = config.icon;
          const isCurrentRole = hasRole(config.role);

          return (
            <motion.button
              key={config.role}
              onClick={() => handleRoleSelect(config.role)}
              className={`relative p-6 rounded-2xl border text-left transition-all ${isCurrentRole
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Current role badge */}
              {isCurrentRole && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-white mb-2">{config.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{config.description}</p>

              {/* Features */}
              {!compact && (
                <ul className="space-y-2">
                  {config.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                      <ArrowRight className="w-3 h-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </motion.button>
          );
        })}
      </div>

      {user?.roles && user.roles.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Current roles: {user.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
