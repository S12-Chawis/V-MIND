// ===== CONFIGURACIÓN DE API =====

class ApiConfig {
    constructor() {
        // Configuración base de la API
        this.baseURL = this.getBaseURL();
        this.endpoints = {
            // Autenticación
            login: '/api/auth/login',
            register: '/api/auth/register',
            logout: '/api/auth/logout',
            refresh: '/api/auth/refresh',
            forgotPassword: '/api/auth/forgot-password',
            resetPassword: '/api/auth/reset-password',
            
            // Usuario
            profile: '/api/user/profile',
            updateProfile: '/api/user/profile',
            changePassword: '/api/user/change-password',
            
            // Dashboard
            dashboard: '/api/dashboard/data',
            progress: '/api/user/progress',
            roadmaps: '/api/roadmaps',
        };
        
        // Headers por defecto
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    getBaseURL() {
        // Detectar automáticamente el entorno
        const hostname = window.location.hostname;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Desarrollo local - Backend en puerto 3000
            return 'http://localhost:3000';
        } else if (hostname.includes('staging')) {
            // Staging
            return 'https://api-staging.vmind.com';
        } else {
            // Producción
            return 'https://api.vmind.com';
        }
    }

    getFullURL(endpoint) {
        return this.baseURL + this.endpoints[endpoint];
    }

    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            ...this.defaultHeaders,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }
}

// ===== CLASE PARA MANEJO DE API =====

class ApiClient {
    constructor() {
        this.config = new ApiConfig();
    }

    async makeRequest(endpoint, options = {}) {
        const url = this.config.getFullURL(endpoint);
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

        // Agregar body si existe
        if (options.body && typeof options.body === 'object') {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            
            // Manejar respuestas no exitosas
            if (!response.ok) {
                const errorData = await this.handleErrorResponse(response);
                throw new ApiError(errorData.message, response.status, errorData);
            }

            // Intentar parsear JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            // Error de red o conexión
            throw new ApiError('Error de conexión. Verifica tu conexión a internet.', 0, {
                type: 'network_error',
                originalError: error.message
            });
        }
    }

    async handleErrorResponse(response) {
        try {
            const errorData = await response.json();
            return {
                message: errorData.message || 'Error del servidor',
                errors: errorData.errors || {},
                ...errorData
            };
        } catch {
            // Si no se puede parsear JSON, usar mensaje por defecto
            return {
                message: this.getDefaultErrorMessage(response.status),
                status: response.status
            };
        }
    }

    getDefaultErrorMessage(status) {
        const errorMessages = {
            400: 'Datos inválidos. Verifica la información ingresada.',
            401: 'Credenciales incorrectas. Verifica tu usuario y contraseña.',
            403: 'No tienes permisos para realizar esta acción.',
            404: 'Recurso no encontrado.',
            409: 'Conflicto: El usuario ya existe o hay datos duplicados.',
            422: 'Datos de entrada inválidos.',
            429: 'Demasiadas solicitudes. Intenta de nuevo más tarde.',
            500: 'Error interno del servidor. Intenta de nuevo más tarde.',
            502: 'Servidor no disponible temporalmente.',
            503: 'Servicio no disponible. Intenta de nuevo más tarde.'
        };
        
        return errorMessages[status] || 'Error desconocido del servidor.';
    }

    // Métodos específicos para autenticación
    async login(credentials) {
        return this.makeRequest('login', {
            method: 'POST',
            body: credentials
        });
    }

    async register(userData) {
        return this.makeRequest('register', {
            method: 'POST',
            body: userData
        });
    }

    async logout() {
        return this.makeRequest('logout', {
            method: 'POST',
            requireAuth: true
        });
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        return this.makeRequest('refresh', {
            method: 'POST',
            body: { refreshToken }
        });
    }

    async forgotPassword(email) {
        return this.makeRequest('forgotPassword', {
            method: 'POST',
            body: { email }
        });
    }

    async resetPassword(token, newPassword) {
        return this.makeRequest('resetPassword', {
            method: 'POST',
            body: { token, password: newPassword }
        });
    }

    // Métodos para usuario
    async getUserProfile() {
        return this.makeRequest('profile', {
            requireAuth: true
        });
    }

    async updateUserProfile(profileData) {
        return this.makeRequest('updateProfile', {
            method: 'PUT',
            body: profileData,
            requireAuth: true
        });
    }
}

// ===== CLASE DE ERROR PERSONALIZADA =====

class ApiError extends Error {
    constructor(message, status = 0, data = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    isNetworkError() {
        return this.status === 0;
    }

    isAuthError() {
        return this.status === 401 || this.status === 403;
    }

    isValidationError() {
        return this.status === 400 || this.status === 422;
    }

    isServerError() {
        return this.status >= 500;
    }
}

// ===== INSTANCIA GLOBAL =====

// Crear instancia global del cliente API
window.apiClient = new ApiClient();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiConfig, ApiError };
}

