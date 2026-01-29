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
        
        // Try to parse JSON response, handle non-JSON errors
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            // If we got HTML, it's likely an error page
            if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<!doctype')) {
                throw new Error(`Server returned HTML instead of JSON. Status: ${response.status} ${response.statusText}. The endpoint may be incorrect or the server is returning an error page.`);
            }
            throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                // Try to refresh token
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    // Retry the original request with new token
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const retryResponse = await fetch(url, config);
                    
                    // Parse retry response
                    let retryData;
                    const retryContentType = retryResponse.headers.get('content-type');
                    if (retryContentType && retryContentType.includes('application/json')) {
                        retryData = await retryResponse.json();
                    } else {
                        const retryText = await retryResponse.text();
                        throw new Error(retryText || `Server returned ${retryResponse.status} ${retryResponse.statusText}`);
                    }

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

            throw new Error(data.message || data.detail || 'Request failed');
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
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data);

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

/**
 * Fetch all administrators
 * @returns {Promise} Array of administrator objects
 */
export async function getAllAdmins() {
    return await apiRequest('/api/auth/admins/', {
        method: 'GET',
    });
}

/**
 * Parse API error response to extract meaningful error message
 * @param {object} errorData - Error response from API
 * @returns {string} Formatted error message
 */
function parseApiError(errorData) {
    if (!errorData) {
        return 'An unexpected error occurred';
    }

    // If there's a direct message or detail
    if (errorData.message) {
        return errorData.message;
    }
    if (errorData.detail) {
        return errorData.detail;
    }

    // Handle field-specific errors (common in Django REST Framework)
    const fieldErrors = [];
    for (const [field, errors] of Object.entries(errorData)) {
        if (Array.isArray(errors) && errors.length > 0) {
            fieldErrors.push(`${field}: ${errors.join(', ')}`);
        } else if (typeof errors === 'string') {
            fieldErrors.push(`${field}: ${errors}`);
        }
    }

    if (fieldErrors.length > 0) {
        return fieldErrors.join('. ');
    }

    // Handle non_field_errors
    if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
        return errorData.non_field_errors.join('. ');
    }

    // Fallback
    return 'Failed to create admin. Please check your input and try again.';
}

/**
 * Create a new administrator
 * @param {FormData} formData - FormData object containing admin details
 * @returns {Promise} Created admin object
 */
export async function createAdmin(formData) {
    const url = `${API_BASE_URL}/api/auth/admins/create/`;
    const accessToken = localStorage.getItem('accessToken');

    const config = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData,
    };

    try {
        const response = await fetch(url, config);
        
        // Try to parse JSON response, handle non-JSON errors
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const retryResponse = await fetch(url, config);
                    
                    // Parse retry response
                    let retryData;
                    const retryContentType = retryResponse.headers.get('content-type');
                    if (retryContentType && retryContentType.includes('application/json')) {
                        retryData = await retryResponse.json();
                    } else {
                        const retryText = await retryResponse.text();
                        throw new Error(retryText || `Server returned ${retryResponse.status} ${retryResponse.statusText}`);
                    }

                    if (!retryResponse.ok) {
                        // Parse detailed error messages
                        const errorMessage = parseApiError(retryData);
                        throw new Error(errorMessage);
                    }

                    return retryData;
                } else {
                    logout();
                    throw new Error('Session expired. Please login again.');
                }
            }

            // Parse detailed error messages
            const errorMessage = parseApiError(data);
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Update an existing administrator
 * @param {number} adminId - ID of the admin to update
 * @param {FormData} formData - FormData object containing updated admin details
 * @returns {Promise} Updated admin object
 */
export async function updateAdmin(adminId, formData) {
    const url = `${API_BASE_URL}/api/auth/admins/${adminId}/update/`;
    const accessToken = localStorage.getItem('accessToken');

    const config = {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData,
    };

    try {
        const response = await fetch(url, config);
        
        // Try to parse JSON response, handle non-JSON errors
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
        }

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const retryResponse = await fetch(url, config);
                    
                    // Parse retry response
                    let retryData;
                    const retryContentType = retryResponse.headers.get('content-type');
                    if (retryContentType && retryContentType.includes('application/json')) {
                        retryData = await retryResponse.json();
                    } else {
                        const retryText = await retryResponse.text();
                        throw new Error(retryText || `Server returned ${retryResponse.status} ${retryResponse.statusText}`);
                    }

                    if (!retryResponse.ok) {
                        // Parse detailed error messages
                        const errorMessage = parseApiError(retryData);
                        throw new Error(errorMessage);
                    }

                    return retryData;
                } else {
                    logout();
                    throw new Error('Session expired. Please login again.');
                }
            }

            // Parse detailed error messages
            const errorMessage = parseApiError(data);
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Delete an administrator
 * @param {number} adminId - ID of the admin to delete
 * @returns {Promise} Delete response
 */
export async function deleteAdmin(adminId) {
    const url = `${API_BASE_URL}/api/auth/admins/${adminId}/delete/`;
    const accessToken = localStorage.getItem('accessToken');

    const config = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            // Handle token expiration
            if (response.status === 401) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
                    const retryResponse = await fetch(url, config);
                    const retryData = await retryResponse.json();

                    if (!retryResponse.ok) {
                        throw new Error(retryData.message || retryData.detail || 'Failed to delete admin');
                    }

                    return retryData;
                } else {
                    logout();
                    throw new Error('Session expired. Please login again.');
                }
            }

            throw new Error(data.message || data.detail || 'Failed to delete admin');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetch all programs
 * @returns {Promise} Array of program objects
 */
export async function getAllPrograms() {
    return await apiRequest('/api/program/programs/', {
        method: 'GET',
    });
}

/**
 * Fetch a single program by ID
 * @param {number} programId - ID of the program
 * @returns {Promise} Program object
 */
export async function getProgramById(programId) {
    // Fetch all programs and filter by ID
    const programs = await getAllPrograms()
    const program = programs.find(p => p.id === programId)
    if (!program) {
        throw new Error('Program not found')
    }
    return program
}
