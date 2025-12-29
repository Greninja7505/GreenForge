import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// User roles - exported at module level for use in other components
export const USER_ROLES = {
  DONOR: 'donor',           // Can donate to projects
  CREATOR: 'creator',       // Can create projects
  FREELANCER: 'freelancer', // Can offer services
  GOVERNOR: 'governor',     // Can participate in governance
  ADMIN: 'admin'            // Full access
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage
    const stored = localStorage.getItem("stellar_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        return null;
      }
    }
    return null;
  });

  const [isAnonymous, setIsAnonymous] = useState(() => {
    // Check if user prefers to be anonymous
    const stored = localStorage.getItem("stellar_anonymous");
    return stored === "true";
  });

  // Active role state - allows users to switch between roles
  const [activeRole, setActiveRoleState] = useState(() => {
    const stored = localStorage.getItem("stellar_active_role");
    if (stored && Object.values(USER_ROLES).includes(stored)) {
      return stored;
    }
    return USER_ROLES.DONOR; // Default to donor
  });

  // Save active role to localStorage
  useEffect(() => {
    localStorage.setItem("stellar_active_role", activeRole);
  }, [activeRole]);

  // Function to change active role
  const setActiveRole = (role) => {
    if (Object.values(USER_ROLES).includes(role)) {
      setActiveRoleState(role);
    }
  };

  // Default role is donor for all users
  const getUserRole = (user) => {
    if (!user) return null;
    return user.role || USER_ROLES.DONOR;
  };

  // Check if user has specific role (uses activeRole for current session)
  const hasRole = (role) => {
    // Everyone can donate regardless of active role
    if (role === USER_ROLES.DONOR) return true;
    // Check against the currently active role (from navbar switcher)
    return activeRole === role || activeRole === USER_ROLES.ADMIN;
  };

  // Check if user can access specific feature (based on activeRole)
  const canAccess = (feature) => {
    // Must be logged in
    if (!user) return false;

    // Use activeRole - the currently selected role from navbar
    switch (feature) {
      case 'create_project':
        return [USER_ROLES.CREATOR, USER_ROLES.ADMIN].includes(activeRole);
      case 'freelancer':
        return [USER_ROLES.FREELANCER, USER_ROLES.ADMIN].includes(activeRole);
      case 'governance':
        return [USER_ROLES.GOVERNOR, USER_ROLES.ADMIN].includes(activeRole);
      case 'admin':
        return activeRole === USER_ROLES.ADMIN;
      default:
        return true; // Default access for all roles
    }
  };

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("stellar_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("stellar_user");
    }
  }, [user]);

  // Save anonymous preference
  useEffect(() => {
    localStorage.setItem("stellar_anonymous", isAnonymous.toString());
  }, [isAnonymous]);

  const createProfile = (profileData) => {
    const newUser = {
      id: Date.now().toString(),
      role: profileData.role || USER_ROLES.DONOR, // Default to donor
      ...profileData,
      createdAt: new Date().toISOString(),
      totalDonations: 0,
      donationHistory: [],
      projectsCreated: [],
      projectsSupported: [],
      upvotedProjects: [],
      downvotedProjects: [],
      freelancerProfile: null, // For freelancer role
      reputation: 0, // For governance
      sbtBadges: [], // SoulBound Tokens
    };
    setUser(newUser);
    setIsAnonymous(false);
    return newUser;
  };

  const updateRole = (newRole) => {
    if (user && Object.values(USER_ROLES).includes(newRole)) {
      const updatedUser = {
        ...user,
        role: newRole,
        roles: user.roles?.includes(newRole)
          ? user.roles
          : [...(user.roles || []), newRole]
      };
      setUser(updatedUser);
      // Also update in localStorage
      updateUserInStorage(updatedUser);
    }
  };

  // Add wallet address to user profile
  const addWalletAddress = (address, chain = 'stellar') => {
    if (user && address) {
      const walletEntry = { address, chain, addedAt: new Date().toISOString() };
      const existingWallets = user.walletAddresses || [];

      // Check if wallet already exists
      if (existingWallets.some(w => w.address === address)) {
        return false; // Already added
      }

      const updatedUser = {
        ...user,
        walletAddresses: [...existingWallets, walletEntry]
      };
      setUser(updatedUser);
      updateUserInStorage(updatedUser);
      return true;
    }
    return false;
  };

  // Helper to update user in localStorage
  const updateUserInStorage = (updatedUser) => {
    localStorage.setItem("stellar_user", JSON.stringify(updatedUser));

    // Also update in the all_users storage
    const storedUsers = localStorage.getItem("stellar_all_users");
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      const userIndex = users.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        localStorage.setItem("stellar_all_users", JSON.stringify(users));
      }
    }
  };

  const updateProfile = (updates) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const addDonation = (projectSlug, amount, txHash) => {
    if (user) {
      const donation = {
        id: Date.now().toString(),
        projectSlug,
        amount,
        txHash,
        date: new Date().toISOString(),
      };
      setUser({
        ...user,
        totalDonations: user.totalDonations + amount,
        donationHistory: [...user.donationHistory, donation],
        projectsSupported: user.projectsSupported.includes(projectSlug)
          ? user.projectsSupported
          : [...user.projectsSupported, projectSlug],
      });
    }
  };

  const addCreatedProject = (projectSlug) => {
    if (user) {
      setUser({
        ...user,
        projectsCreated: [...user.projectsCreated, projectSlug],
      });
    }
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const logout = () => {
    setUser(null);
    setIsAnonymous(true);
    localStorage.removeItem("stellar_user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.setItem("stellar_anonymous", "true");
  };

  const login = async (email, password) => {
    try {
      // First, try backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store tokens for future authenticated requests
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        const userData = data.user || data;
        // Ensure user has roles array
        if (!userData.roles) {
          userData.roles = [userData.role || USER_ROLES.DONOR];
        }
        setUser(userData);
        setIsAnonymous(false);
        localStorage.setItem("stellar_user", JSON.stringify(userData));
        return { success: true };
      }

      const error = await response.json().catch(() => ({}));

      // If backend returned specific error, use it
      if (error.detail) {
        return { success: false, error: error.detail };
      }

      // Fallback to localStorage for development/offline mode
      console.warn('Backend auth failed, trying localStorage fallback');
    } catch (networkError) {
      console.warn('Backend unavailable, using localStorage fallback');
    }

    // localStorage fallback (for development/offline mode)
    try {
      const storedUsers = localStorage.getItem("stellar_all_users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Hash the input password for comparison (same as register)
      const passwordHash = btoa(password + '_salted_' + email);

      const foundUser = users.find(
        (u) => u.email === email && (u.password === passwordHash || u.password === password)
      );

      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        if (!userWithoutPassword.roles) {
          userWithoutPassword.roles = [USER_ROLES.DONOR];
        }
        setUser(userWithoutPassword);
        setIsAnonymous(false);
        localStorage.setItem("stellar_user", JSON.stringify(userWithoutPassword));
        return { success: true };
      }

      return {
        success: false,
        error: "Invalid email or password. Please try again or create an account."
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login." };
    }
  };

  const register = async (name, email, password, selectedRole = USER_ROLES.DONOR) => {
    // Validate password strength first
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    try {
      // First, try backend API (passwords are hashed on backend)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          email,
          password, // Backend will hash this with bcrypt
          role: selectedRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store tokens for future authenticated requests
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        const userData = data.user || {
          id: data.user_id || Date.now().toString(),
          name: name,
          email: email,
          roles: [selectedRole],
          createdAt: new Date().toISOString(),
          totalDonations: 0,
          donationHistory: [],
          projectsCreated: [],
          projectsSupported: [],
          upvotedProjects: [],
          downvotedProjects: [],
          walletAddresses: [],
        };

        if (!userData.roles) {
          userData.roles = [selectedRole];
        }

        setUser(userData);
        setIsAnonymous(false);
        localStorage.setItem("stellar_user", JSON.stringify(userData));
        return { success: true };
      }

      const error = await response.json().catch(() => ({}));

      if (error.detail) {
        return { success: false, error: error.detail };
      }

      console.warn('Backend registration failed, trying localStorage fallback');
    } catch (networkError) {
      console.warn('Backend unavailable, using localStorage fallback');
    }

    // localStorage fallback (for development/offline mode)
    try {
      const storedUsers = localStorage.getItem("stellar_all_users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return { success: false, error: "An account with this email already exists." };
      }

      // Simple hash for localStorage fallback (NOT secure, just for demo)
      // In production, ALWAYS use backend API which uses bcrypt
      const simpleHash = btoa(password + '_salted_' + email);

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: simpleHash, // Hashed for localStorage (backend uses bcrypt)
        roles: [selectedRole],
        createdAt: new Date().toISOString(),
        totalDonations: 0,
        donationHistory: [],
        projectsCreated: [],
        projectsSupported: [],
        upvotedProjects: [],
        downvotedProjects: [],
        walletAddresses: [],
      };

      users.push(newUser);
      localStorage.setItem("stellar_all_users", JSON.stringify(users));

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      setIsAnonymous(false);
      localStorage.setItem("stellar_user", JSON.stringify(userWithoutPassword));
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "An error occurred during registration." };
    }
  };

  const value = {
    user,
    isAnonymous,
    isLoggedIn: !!user,
    USER_ROLES,
    activeRole,
    setActiveRole,
    getUserRole: () => getUserRole(user),
    hasRole: (role) => hasRole(role),
    canAccess: (feature) => canAccess(feature),
    createProfile,
    updateProfile,
    updateRole,
    addDonation,
    addCreatedProject,
    addWalletAddress,
    toggleAnonymous,
    logout,
    login,
    register,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
