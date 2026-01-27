// API configuration and helper functions

// Base API URL - Update this with your actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

/**
 * Makes an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    // Add authorization header if access token exists
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                // Try to refresh token
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry the original request with new token
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const retryResponse = await fetch(url, config);
                    const retryData = await retryResponse.json();

                    if (!retryResponse.ok) {
                        throw new Error(retryData.message || 'Request failed');
                    }

                    return retryData;
                } else {
                    // Refresh failed, logout user
                    logout();
                    throw new Error('Session expired. Please login again.');
                }
            }

            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise} Login response with user and tokens
 */
export async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Store tokens and user data
    if (data.tokens) {
        localStorage.setItem('accessToken', data.tokens.access);
        localStorage.setItem('refreshToken', data.tokens.refresh);
    }

    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<boolean>} True if refresh successful, false otherwise
 */
export async function refreshAccessToken() {
    try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            return false;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            return false;
        }

        // Update access token
        if (data.access) {
            localStorage.setItem('accessToken', data.access);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}

/**
 * Logout user
 */
export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');

    // Redirect to login page
    if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
    }
}

/**
 * Get current user from localStorage
 * @returns {object|null} User object or null
 */
export function getCurrentUser() {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has access token
 */
export function isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
}
