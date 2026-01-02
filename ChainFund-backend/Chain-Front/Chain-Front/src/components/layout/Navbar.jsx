import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Wallet, ChevronDown, User } from "lucide-react";
import { useStellar } from "../../context/StellarContext";
import { useUser, USER_ROLES } from "../../context/UserContext";
import RoleDropdown from "./RoleDropdown";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const location = useLocation();
  const {
    publicKey,
    isConnected,
    connectWallet,
    disconnectWallet,
    balance,
    network,
    switchNetwork,
    loading,
  } = useStellar();
  const { user, isLoggedIn, activeRole } = useUser();
  const currentRole = activeRole || USER_ROLES.DONOR;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Role-based navigation configuration - SIMPLIFIED (max 4 items per role)
  const roleNavConfig = {
    [USER_ROLES.DONOR]: [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects/all" },
      { name: "Causes", path: "/causes/all" },
    ],
    [USER_ROLES.CREATOR]: [
      { name: "Home", path: "/" },
      { name: "Dashboard", path: "/dashboard" },
      { name: "Create Project", path: "/create-project" },
    ],
    [USER_ROLES.FREELANCER]: [
      { name: "Home", path: "/" },
      { name: "Dashboard", path: "/freelancer/dashboard" },
      { name: "Gigs", path: "/freelancer/gigs" },
      { name: "Orders", path: "/freelancer/orders" },
    ],
    [USER_ROLES.GOVERNOR]: [
      { name: "Home", path: "/" },
      { name: "Governance", path: "/governance", badge: "DAO" },
      { name: "Projects", path: "/projects/all" },
      { name: "Causes", path: "/causes/all" },
    ],
  };

  // More dropdown items (always available)
  const moreItems = [
    { name: "Eco-Bounties", path: "/eco-bounties", desc: "Earn for impact" },
    { name: "Marketplace", path: "/marketplace", desc: "Carbon Cashback" },
    { name: "GIVeconomy", path: "/giveconomy", desc: "Token economics" },
    { name: "GIVfarm", path: "/givfarm", desc: "Yield farming" },
    { name: "Community", path: "/join", desc: "Join us" },
    { name: "About", path: "/about", desc: "Learn more" },
  ];

  // Get navigation links based on current role
  const navLinks = roleNavConfig[currentRole] || roleNavConfig[USER_ROLES.DONOR];

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletClick = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      try {
        await connectWallet();
      } catch (error) {
        // Error handling is already done in the context
        console.error("Wallet connection error:", error);
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-black/95 backdrop-blur-xl shadow-2xl"
        : "bg-transparent"
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <motion.img
              src="/Logo_Text.png"
              alt="Stellar Forge"
              className="h-10 w-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </Link>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center flex-1 ml-10">
            {/* Centered Nav Links */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 whitespace-nowrap ${isActive
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-medium bg-white/10 text-white/70 rounded">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {/* More Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                    setActiveDropdown("More");
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setActiveDropdown(null);
                    }, 150);
                    setDropdownTimeout(timeout);
                  }}
                >
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 whitespace-nowrap ${activeDropdown === "More"
                      ? "text-white bg-white/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <span>More</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === "More" ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "More" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                      >
                        <div className="py-2" onClick={() => setActiveDropdown(null)}>
                          {moreItems.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className="flex flex-col px-4 py-3 hover:bg-white/5 transition-all duration-200 group"
                            >
                              <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors">
                                {item.name}
                              </span>
                              {item.desc && (
                                <span className="text-white/40 text-xs mt-0.5 group-hover:text-white/60 transition-colors">
                                  {item.desc}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right Actions: Role, Profile, Network, Wallet */}
            <div className="flex items-center space-x-3 ml-auto">
              {/* Role Dropdown */}
              <RoleDropdown />

              {/* Network Selector - Only show when connected */}
              {isConnected && (
                <div className="relative">
                  <select
                    value={network}
                    onChange={(e) => switchNetwork(e.target.value)}
                    className="appearance-none px-3 py-2 pr-8 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-white/20 focus:outline-none focus:border-white/30 transition-all duration-300 cursor-pointer"
                  >
                    <option value="TESTNET">Testnet</option>
                    <option value="PUBLIC">Mainnet</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Circular Profile Button */}
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden ${isLoggedIn
                    ? "border-white/20 bg-white/5 group-hover:border-white/40 group-hover:bg-white/10"
                    : "border-white/10 bg-transparent group-hover:border-white/20"
                    }`}>
                    {isLoggedIn && user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-5 h-5 ${isLoggedIn ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                    )}
                  </div>
                  {isLoggedIn && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full shadow-lg" />
                  )}
                </motion.button>
              </Link>

              {/* Wallet Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWalletClick}
                disabled={loading}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isConnected
                  ? "bg-white/10 hover:bg-white/15 text-white border border-white/20"
                  : "btn-primary"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : isConnected ? (
                  <>
                    <Wallet className="w-4 h-4 flex-shrink-0" />
                    <span className="font-mono hidden xl:inline">
                      {formatAddress(publicKey)}
                    </span>
                    {balance && (
                      <span className="text-white/90">
                        {parseFloat(balance.xlm).toFixed(1)} XLM
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/98 backdrop-blur-xl border-t border-dark-700"
          >
            <div className="container-custom py-6 space-y-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <div key={link.name}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all ${isActive
                        ? "text-white bg-white/10"
                        : "text-gray-300"
                        }`}
                    >
                      {link.name}
                    </Link>
                  </div>
                );
              })}

              {/* Mobile Wallet Section */}
              <div className="pt-4 border-t border-dark-700 space-y-3">
                {/* Profile Button Mobile */}
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <button
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${isLoggedIn
                      ? "text-white bg-white/5 hover:bg-white/10"
                      : "text-gray-400 bg-white/5 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    <User className="w-4 h-4" />
                    <span>
                      {isLoggedIn ? user?.name || "Profile" : "Sign In"}
                    </span>
                  </button>
                </Link>

                {/* Network Selector - Only show when connected */}
                {isConnected && (
                  <div className="relative">
                    <select
                      value={network}
                      onChange={(e) => switchNetwork(e.target.value)}
                      className="w-full appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:border-white/20 focus:outline-none focus:border-white/30 transition-all duration-300"
                    >
                      <option value="TESTNET">Testnet</option>
                      <option value="PUBLIC">Mainnet</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}

                {/* Wallet Button */}
                <button
                  onClick={handleWalletClick}
                  disabled={loading}
                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${isConnected
                    ? "bg-white/10 hover:bg-white/15 text-white border border-white/20"
                    : "btn-primary"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      <span>
                        {isConnected
                          ? formatAddress(publicKey)
                          : "Connect Wallet"}
                      </span>
                    </>
                  )}
                </button>

                {/* Balance Display - Only show when connected */}
                {isConnected && balance && (
                  <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-center">
                    <span className="text-sm text-gray-400">Balance: </span>
                    <span className="text-sm font-semibold text-white">
                      {parseFloat(balance.xlm).toFixed(2)} XLM
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
