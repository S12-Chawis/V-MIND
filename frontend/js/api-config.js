class ApiConfig {
    constructor() {
        // Base API configuration
        this.baseURL = this.getBaseURL();
        
        // Centralized endpoint definitions for easy maintenance
        this.endpoints = {
            // Authentication endpoints
            login: '/api/auth/login',
            register: '/api/auth/register',
            
            // User management endpoints
            profile: '/api/user/profile',
            updateProfile: '/api/user/profile',
            
            // Dashboard and learning endpoints
            roadmaps: '/api/roadmaps',
        };
        
        // Default headers for all requests
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

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

    // build full url for a specific endpoint
    getFullURL(endpoint) {
        return this.baseURL + this.endpoints[endpoint];
    }

    // get headers with authentication token if available
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            ...this.defaultHeaders,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }
}

// api client class
class ApiClient {
    constructor() {
        this.config = new ApiConfig();
    }

    // make http request to api endpoint
    async makeRequest(endpoint, options = {}) {
        const url = this.config.getFullURL(endpoint);
        
        // determine headers based on authentication requirement
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

        // add request body if provided
        if (options.body && typeof options.body === 'object') {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            // handle non-successful responses
            if (!response.ok) {
                const errorData = await this.handleErrorResponse(response);
                throw new ApiError(errorData.message, response.status, errorData);
            }

            // parse response based on content type
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // network or connection error
            throw new ApiError('Connection error. Please check your internet connection.', 0, {
                type: 'network_error',
                originalError: error.message
            });
        }
    }

    // handle error responses from the server
    async handleErrorResponse(response) {
        try {
            const errorData = await response.json();
            return {
                message: errorData.message || 'Server error',
                errors: errorData.errors || {},
                ...errorData
            };
        } catch {
            // if json parsing fails, use default error message
            return {
                message: this.getDefaultErrorMessage(response.status),
                status: response.status
            };
        }
    }

    // get user-friendly error messages for common http status codes
    getDefaultErrorMessage(status) {
        const errorMessages = {
            400: 'Invalid data. Please check the information entered.',
            401: 'Incorrect credentials. Please verify your email and password.',
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

    // authentication methods

    // authenticate user with credentials
    async login(credentials) {
        return this.makeRequest('login', {
            method: 'POST',
            body: credentials
        });
    }

    // register new user account
    async register(userData) {
        return this.makeRequest('register', {
            method: 'POST',
            body: userData
        });
    }

    // logout current user (invalidate tokens)
    async logout() {
        return this.makeRequest('logout', {
            method: 'POST',
            requireAuth: true
        });
    }

    // refresh authentication token
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.makeRequest('refresh', {
            method: 'POST',
            body: { refreshToken }
        });
    }

    // request password reset
    async forgotPassword(email) {
        return this.makeRequest('forgotPassword', {
            method: 'POST',
            body: { email }
        });
    }

    // reset password with reset token
    async resetPassword(token, newPassword) {
        return this.makeRequest('resetPassword', {
            method: 'POST',
            body: { token, password: newPassword }
        });
    }

    // user management methods

    // get current user's profile information
    async getUserProfile() {
        return this.makeRequest('profile', {
            requireAuth: true
        });
    }

    // update user profile information
    async updateUserProfile(profileData) {
        return this.makeRequest('updateProfile', {
            method: 'PUT',
            body: profileData,
            requireAuth: true
        });
    }
}

// custom error class

// custom api error class for better error handling
class ApiError extends Error {
    constructor(message, status = 0, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    // check if error is a network/connection issue
    isNetworkError() {
        return this.status === 0;
    }

    // check if error is related to authentication/authorization
    isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    // check if error is due to invalid input data
    isValidationError() {
        return this.status === 400 || this.status === 422;
    }

    // check if error is a server-side issue
    isServerError() {
        return this.status >= 500;
    }
}

// global instance

// create global instance of api client for easy access
window.apiClient = new ApiClient();

// export for module usage (node.js compatibility)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiConfig, ApiError };
}

