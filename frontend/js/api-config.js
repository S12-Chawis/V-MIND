/**
 * V-Mind API Configuration and Client
 * 
 * This file provides a centralized configuration for all API endpoints and a robust
 * HTTP client for making authenticated requests to the backend server.
 * 
 * Features:
 * - Environment-aware base URL detection (local, staging, production)
 * - Automatic JWT token management for authenticated requests
 * - Comprehensive error handling with custom error types
 * - Centralized endpoint configuration
 * - Request/response interceptors for consistent error handling
 * 
 * @author V-Mind Team
 * @version 2.0.0
 */

// ===== API CONFIGURATION =====

/**
 * API Configuration Class
 * Manages API endpoints, base URLs, and default headers for different environments
 */
class ApiConfig {
    constructor() {
        // Base API configuration
        this.baseURL = this.getBaseURL();
        
        // Centralized endpoint definitions for easy maintenance
        this.endpoints = {
            // Authentication endpoints
            login: '/api/auth/login',
            register: '/api/auth/register',
            logout: '/api/auth/logout',
            refresh: '/api/auth/refresh',
            forgotPassword: '/api/auth/forgot-password',
            resetPassword: '/api/auth/reset-password',
            
            // User management endpoints
            profile: '/api/user/profile',
            updateProfile: '/api/user/profile',
            changePassword: '/api/user/change-password',
            
            // Dashboard and learning endpoints
            dashboard: '/api/dashboard/data',
            progress: '/api/user/progress',
            roadmaps: '/api/roadmaps',
        };
        
        // Default headers for all requests
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    /**
     * Automatically detect the appropriate base URL based on current environment
     * @returns {string} Base URL for API requests
     */
    getBaseURL() {
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Local development - Backend on port 3000
            return 'http://localhost:3000';
        } else if (hostname.includes('staging')) {
            // Staging environment
            return 'https://api-staging.vmind.com';
        } else {
            // Production environment
            return 'https://api.vmind.com';
        }
    }

    /**
     * Build full URL for a specific endpoint
     * @param {string} endpoint - Endpoint key from this.endpoints
     * @returns {string} Complete URL for the endpoint
     */
    getFullURL(endpoint) {
        return this.baseURL + this.endpoints[endpoint];
    }

    /**
     * Get headers with authentication token if available
     * @returns {Object} Headers object with optional Authorization header
     */
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            ...this.defaultHeaders,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }
}

// ===== API CLIENT CLASS =====

/**
 * HTTP Client for making API requests
 * Handles authentication, error handling, and request/response processing
 */
class ApiClient {
    constructor() {
        this.config = new ApiConfig();
    }

    /**
     * Make HTTP request to API endpoint
     * @param {string} endpoint - Endpoint key from config
     * @param {Object} options - Request options (method, body, headers, etc.)
     * @returns {Promise<Object>} Parsed response data
     * @throws {ApiError} When request fails
     */
    async makeRequest(endpoint, options = {}) {
        const url = this.config.getFullURL(endpoint);
        
        // Determine headers based on authentication requirement
        const headers = options.requireAuth ? 
            this.config.getAuthHeaders() : 
            this.config.defaultHeaders;

        const requestOptions = {
            method: options.method || 'GET',
            headers: {
                ...headers,
                ...options.headers
            },
            ...options
        };

        // Add request body if provided
        if (options.body && typeof options.body === 'object') {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            // Handle non-successful responses
            if (!response.ok) {
                const errorData = await this.handleErrorResponse(response);
                throw new ApiError(errorData.message, response.status, errorData);
            }

            // Parse response based on content type
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // Network or connection error
            throw new ApiError('Connection error. Please check your internet connection.', 0, {
                type: 'network_error',
                originalError: error.message
            });
        }
    }

    /**
     * Handle error responses from the server
     * @param {Response} response - Fetch Response object
     * @returns {Object} Parsed error data
     */
    async handleErrorResponse(response) {
        try {
            const errorData = await response.json();
            return {
                message: errorData.message || 'Server error',
                errors: errorData.errors || {},
                ...errorData
            };
        } catch {
            // If JSON parsing fails, use default error message
            return {
                message: this.getDefaultErrorMessage(response.status),
                status: response.status
            };
        }
    }

    /**
     * Get user-friendly error messages for common HTTP status codes
     * @param {number} status - HTTP status code
     * @returns {string} Human-readable error message
     */
    getDefaultErrorMessage(status) {
        const errorMessages = {
            400: 'Invalid data. Please check the information entered.',
            401: 'Incorrect credentials. Please verify your username and password.',
            403: 'You do not have permission to perform this action.',
            404: 'Resource not found.',
            409: 'Conflict: User already exists or there are duplicate data.',
            422: 'Invalid input data.',
            429: 'Too many requests. Please try again later.',
            500: 'Internal server error. Please try again later.',
            502: 'Server temporarily unavailable.',
            503: 'Service unavailable. Please try again later.'
        };
        
        return errorMessages[status] || 'Unknown server error.';
    }

    // ===== AUTHENTICATION METHODS =====

    /**
     * Authenticate user with credentials
     * @param {Object} credentials - User credentials (username/email, password)
     * @returns {Promise<Object>} Authentication response with tokens
     */
    async login(credentials) {
        return this.makeRequest('login', {
            method: 'POST',
            body: credentials
        });
    }

    /**
     * Register new user account
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration response
     */
    async register(userData) {
        return this.makeRequest('register', {
            method: 'POST',
            body: userData
        });
    }

    /**
     * Logout current user (invalidate tokens)
     * @returns {Promise<Object>} Logout response
     */
    async logout() {
        return this.makeRequest('logout', {
            method: 'POST',
            requireAuth: true
        });
    }

    /**
     * Refresh authentication token
     * @returns {Promise<Object>} New token response
     */
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.makeRequest('refresh', {
            method: 'POST',
            body: { refreshToken }
        });
    }

    /**
     * Request password reset
     * @param {string} email - User's email address
     * @returns {Promise<Object>} Password reset response
     */
    async forgotPassword(email) {
        return this.makeRequest('forgotPassword', {
            method: 'POST',
            body: { email }
        });
    }

    /**
     * Reset password with reset token
     * @param {string} token - Password reset token
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Password reset confirmation
     */
    async resetPassword(token, newPassword) {
        return this.makeRequest('resetPassword', {
            method: 'POST',
            body: { token, password: newPassword }
        });
    }

    // ===== USER MANAGEMENT METHODS =====

    /**
     * Get current user's profile information
     * @returns {Promise<Object>} User profile data
     */
    async getUserProfile() {
        return this.makeRequest('profile', {
            requireAuth: true
        });
    }

    /**
     * Update user profile information
     * @param {Object} profileData - Updated profile data
     * @returns {Promise<Object>} Updated profile response
     */
    async updateUserProfile(profileData) {
        return this.makeRequest('updateProfile', {
            method: 'PUT',
            body: profileData,
            requireAuth: true
        });
    }
}

// ===== CUSTOM ERROR CLASS =====

/**
 * Custom API Error class for better error handling
 * Provides methods to categorize errors and extract useful information
 */
class ApiError extends Error {
    constructor(message, status = 0, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    /**
     * Check if error is a network/connection issue
     * @returns {boolean} True if network error
     */
    isNetworkError() {
        return this.status === 0;
    }

    /**
     * Check if error is related to authentication/authorization
     * @returns {boolean} True if authentication error
     */
    isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    /**
     * Check if error is due to invalid input data
     * @returns {boolean} True if validation error
     */
    isValidationError() {
        return this.status === 400 || this.status === 422;
    }

    /**
     * Check if error is a server-side issue
     * @returns {boolean} True if server error
     */
    isServerError() {
        return this.status >= 500;
    }
}

// ===== GLOBAL INSTANCE =====

// Create global instance of API client for easy access
window.apiClient = new ApiClient();

// Export for module usage (Node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiConfig, ApiError };
}

