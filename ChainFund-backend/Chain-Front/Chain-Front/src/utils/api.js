/**
 * API Utility - Centralized API calls with authentication
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Make an authenticated fetch request
 * Automatically handles token refresh on 401 errors
 */
export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url.startsWith('http') ? url : `${API_BASE}${url}`, {
        ...options,
        headers,
    });

    // If unauthorized, try to refresh token
    if (response.status === 401 && token) {
        const refreshed = await refreshToken();
        if (refreshed) {
            // Retry with new token
            const newToken = localStorage.getItem('access_token');
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url.startsWith('http') ? url : `${API_BASE}${url}`, {
                ...options,
                headers,
            });
        } else {
            // Token refresh failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('stellar_user');
            window.location.href = '/signin';
        }
    }

    return response;
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) return false;

    try {
        const response = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }

    return false;
};

/**
 * API helper methods
 */
export const api = {
    /**
     * GET request
     */
    get: async (endpoint) => {
        const response = await fetchWithAuth(endpoint, { method: 'GET' });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Request failed');
        }
        return response.json();
    },

    /**
     * POST request
     */
    post: async (endpoint, data) => {
        const response = await fetchWithAuth(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Request failed');
        }
        return response.json();
    },

    /**
     * PUT request
     */
    put: async (endpoint, data) => {
        const response = await fetchWithAuth(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Request failed');
        }
        return response.json();
    },

    /**
     * DELETE request
     */
    delete: async (endpoint) => {
        const response = await fetchWithAuth(endpoint, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Request failed');
        }
        return response.json();
    },
};

export default api;
