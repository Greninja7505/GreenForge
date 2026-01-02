/**
 * API Service - Centralized API calls for ChainFund
 * 
 * Connects frontend to backend REST API while maintaining
 * localStorage fallback for offline/development mode.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper: Get stored auth token
export const getAuthToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

// Helper: Make authenticated API request
export const fetchWithAuth = async (url, options = {}) => {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // If token expired, try to refresh
        if (response.status === 401 && getRefreshToken()) {
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                // Retry original request with new token
                headers['Authorization'] = `Bearer ${getAuthToken()}`;
                return fetch(url, { ...options, headers });
            }
        }

        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Refresh auth token
export const refreshAuthToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    // Clear tokens on failed refresh
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return false;
};

// ============================================================================
// AUTH API
// ============================================================================

export const authAPI = {
    /**
     * Register new user
     * Falls back to localStorage if backend unavailable
     */
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role || 'donor',
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store tokens
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                }
                if (data.refresh_token) {
                    localStorage.setItem('refresh_token', data.refresh_token);
                }
                return { success: true, user: data.user || data };
            }

            const error = await response.json();
            return { success: false, error: error.detail || 'Registration failed' };
        } catch (error) {
            console.warn('Backend unavailable, using localStorage fallback');
            // Return null to trigger fallback in UserContext
            return { success: false, error: 'Backend unavailable', useFallback: true };
        }
    },

    /**
     * Login user
     * Falls back to localStorage if backend unavailable
     */
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Store tokens
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                }
                if (data.refresh_token) {
                    localStorage.setItem('refresh_token', data.refresh_token);
                }
                return { success: true, user: data.user || data };
            }

            const error = await response.json();
            return { success: false, error: error.detail || 'Invalid credentials' };
        } catch (error) {
            console.warn('Backend unavailable, using localStorage fallback');
            return { success: false, error: 'Backend unavailable', useFallback: true };
        }
    },

    /**
     * Get current user profile
     */
    getMe: async () => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/auth/me`);
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.warn('Could not fetch user profile');
            return null;
        }
    },

    /**
     * Logout - clear tokens
     */
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
};

// ============================================================================
// PROJECTS API
// ============================================================================

export const projectsAPI = {
    /**
     * Get all projects
     * Falls back to mock data if backend unavailable
     */
    getAll: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.category) queryParams.append('category', params.category);
            if (params.status) queryParams.append('status', params.status);
            if (params.limit) queryParams.append('limit', params.limit);

            const url = `${API_BASE}/api/v1/projects?${queryParams}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                return { success: true, projects: data.projects || data };
            }

            return { success: false, useFallback: true };
        } catch (error) {
            console.warn('Backend unavailable, using mock data');
            return { success: false, useFallback: true };
        }
    },

    /**
     * Get single project by ID or slug
     */
    getById: async (projectId) => {
        try {
            const response = await fetch(`${API_BASE}/api/v1/projects/${projectId}`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, project: data.project || data };
            }
            return { success: false, useFallback: true };
        } catch (error) {
            return { success: false, useFallback: true };
        }
    },

    /**
     * Create new project
     */
    create: async (projectData) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/v1/projects/create`, {
                method: 'POST',
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, project: data };
            }

            const error = await response.json();
            return { success: false, error: error.detail || 'Failed to create project' };
        } catch (error) {
            return { success: false, error: 'Backend unavailable', useFallback: true };
        }
    },

    /**
     * Donate to project
     */
    donate: async (projectId, donationData) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/v1/projects/${projectId}/donate`, {
                method: 'POST',
                body: JSON.stringify(donationData),
            });

            if (response.ok) {
                return await response.json();
            }

            const error = await response.json();
            return { success: false, error: error.detail || 'Donation failed' };
        } catch (error) {
            return { success: false, error: 'Backend unavailable' };
        }
    },
};

// ============================================================================
// GOVERNANCE API
// ============================================================================

export const governanceAPI = {
    /**
     * Get all proposals
     */
    getProposals: async () => {
        try {
            const response = await fetch(`${API_BASE}/api/governance/proposals`);
            if (response.ok) {
                return await response.json();
            }
            return { proposals: [] };
        } catch (error) {
            return { proposals: [] };
        }
    },

    /**
     * Cast vote on proposal
     */
    vote: async (proposalId, voteData) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/votes/${proposalId}/vote`, {
                method: 'POST',
                body: JSON.stringify(voteData),
            });

            if (response.ok) {
                return await response.json();
            }

            return { success: false };
        } catch (error) {
            return { success: false };
        }
    },
};

// ============================================================================
// FREELANCER API
// ============================================================================

export const freelancerAPI = {
    /**
     * Get all gigs
     */
    getGigs: async () => {
        try {
            const response = await fetch(`${API_BASE}/api/gigs`);
            if (response.ok) {
                return await response.json();
            }
            return { gigs: [] };
        } catch (error) {
            return { gigs: [] };
        }
    },

    /**
     * Create new gig
     */
    createGig: async (gigData) => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/gigs`, {
                method: 'POST',
                body: JSON.stringify(gigData),
            });

            if (response.ok) {
                return await response.json();
            }

            return { success: false };
        } catch (error) {
            return { success: false };
        }
    },

    /**
     * Get orders for freelancer
     */
    getOrders: async () => {
        try {
            const response = await fetchWithAuth(`${API_BASE}/api/orders`);
            if (response.ok) {
                return await response.json();
            }
            return { orders: [] };
        } catch (error) {
            return { orders: [] };
        }
    },
};

export default {
    auth: authAPI,
    projects: projectsAPI,
    governance: governanceAPI,
    freelancer: freelancerAPI,
};
