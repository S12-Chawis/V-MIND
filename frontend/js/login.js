class LoginManager {
    constructor() {
        // Core form elements
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginButton = document.getElementById('loginButton');
        
        // State management
        this.isLoading = false;
        
        // Initialize the login system
        this.init();
    }

    /**
     * Initialize login system with all necessary setup
     */
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupAnimations();
        this.checkForTempUserData();
    }

    /**
     * Set up all event listeners for form interactions
     */
    setupEventListeners() {
        // Form submission event
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time input validation events
        this.usernameInput.addEventListener('input', () => this.validateField('username'));
        this.passwordInput.addEventListener('input', () => this.validateField('password'));
        
        // Focus events for better UX
        this.usernameInput.addEventListener('focus', () => this.clearError('username'));
        this.passwordInput.addEventListener('focus', () => this.clearError('password'));
        
        // Additional navigation links
        document.getElementById('registerLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.redirectToRegister();
        });
        
        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    /**
     * Configure form validation rules and patterns
     */
    setupFormValidation() {
        // Validation configuration for each field
        this.validationRules = {
            username: {
                required: true,
                minLength: 3,
                pattern: /^[a-zA-Z0-9@._-]+$/
            },
            password: {
                required: true,
                minLength: 6
            }
        };
    }

    /**
     * Set up entrance animations for form elements
     * Creates a staggered animation effect for better visual appeal
     */
    setupAnimations() {
        // Staggered entrance animations for form elements
        const formElements = this.form.querySelectorAll('.form-group, .login-button');
        formElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }

    /**
     * Check for temporary user data from registration process
     * Auto-fills email field and shows welcome message
     */
    checkForTempUserData() {
        // Check if there's temporary user data (after registration)
        const tempUserData = localStorage.getItem('tempUserData');
        if (tempUserData) {
            try {
                const userData = JSON.parse(tempUserData);
                // Auto-fill email field
                if (userData.email) {
                    this.usernameInput.value = userData.email;
                    // Show informational message
                    this.showInfoMessage(`Hello ${userData.username}, complete your password to continue.`);
                }
            } catch (error) {
                console.error('Error processing temporary data:', error);
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isLoading) return;
        
        // Validate all fields before submission
        const isValid = this.validateAllFields();
        if (!isValid) return;
        
        // Start login process
        this.setLoading(true);
        
        try {
            const formData = this.getFormData();
            const result = await this.performLogin(formData);
            
            if (result.success) {
                this.handleLoginSuccess(result);
            } else {
                this.handleLoginError(result.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.handleLoginError('Error during login. Try again.');
        } finally {
            this.setLoading(false);
        }
    }

    validateAllFields() {
        let isValid = true;
        
        for (const fieldName in this.validationRules) {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        }
        
        return isValid;
    }

    validateField(fieldName) {
        const input = document.getElementById(fieldName);
        const rules = this.validationRules[fieldName];
        const value = input.value.trim();
        
        // Clear previous errors
        this.clearError(fieldName);
        
        // Validate required field
        if (rules.required && !value) {
            this.showError(fieldName, 'This field is required');
            return false;
        }
        
        // validate minimum length
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(fieldName, `Must have at least ${rules.minLength} characters`);
            return false;
        }
        
        // Validate pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            if (fieldName === 'username') {
                this.showError(fieldName, 'Invalid username or email format');
            }
            return false;
        }
        
        // Specific validations
        if (fieldName === 'username' && value.includes('@')) {
            // Basic email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                this.showError(fieldName, 'Invalid email format');
                return false;
            }
        }
        
        return true;
    }

    showError(fieldName, message) {
        const group = document.getElementById(`${fieldName}Group`);
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        group.classList.add('error');
        errorElement.textContent = message;
        
        // Shake animation
        const input = document.getElementById(fieldName);
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }

    clearError(fieldName) {
        const group = document.getElementById(`${fieldName}Group`);
        group.classList.remove('error');
    }

    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.loginButton.classList.add('loading');
            this.loginButton.disabled = true;
        } else {
            this.loginButton.classList.remove('loading');
            this.loginButton.disabled = false;
        }
    }

    getFormData() {
        return {
            username: this.usernameInput.value.trim(),
            password: this.passwordInput.value
        };
    }

    async performLogin(formData) {
        try {
            // Use the real backend API
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.username,
                    passwords: formData.password
                })
            });

            const result = await response.json();
            
            if (result.success) {
                return {
                    success: true,
                    user: {
                        id: result.data.user.user_id,
                        username: result.data.user.user_name,
                        email: result.data.user.email,
                        name: result.data.user.user_name,
                        level: result.data.user.current_level,
                        objetive: result.data.user.objetive,
                        rol: result.data.user.rol
                    },
                    token: result.data.token,
                    message: 'Login successful'
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Error during login'
                };
            }
            
        } catch (error) {
            console.error('Error during login:', error);
            return {
                success: false,
                message: 'Error during login. Verify that the backend is running.'
            };
        }
    }

    handleLoginSuccess(result) {
        // save token and user data
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
        
        // save refresh token if exists
        if (result.refreshToken) {
            localStorage.setItem('refreshToken', result.refreshToken);
        }
        
        // save login timestamp
        localStorage.setItem('loginTimestamp', Date.now().toString());
        
        // show success message
        const welcomeMessage = result.user.name ? 
            `Welcome back, ${result.user.name}!` : 
            'Welcome back!';
        
        this.showSuccessMessage(welcomeMessage);
        
        // redirect after a brief delay
        setTimeout(() => {
            // check if there is a saved redirect url
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || 'dashboard.html';
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        }, 1500);
    }

    handleLoginError(result) {
        // handle different types of database errors
        if (result.errors && Object.keys(result.errors).length > 0) {
            // specific validation errors by field
            this.handleValidationErrors(result.errors);
        } else {
            // general error
            this.showGlobalError(result.message);
        }
        
        // handle specific errors by status code
        if (result.status) {
            this.handleStatusSpecificErrors(result.status);
        }
        
        // clear sensitive fields
        this.passwordInput.value = '';
        this.passwordInput.focus();
    }

    handleValidationErrors(errors) {
        // clear previous errors
        this.clearAllErrors();
        
        // show specific errors by field
        for (const [field, messages] of Object.entries(errors)) {
            const message = Array.isArray(messages) ? messages[0] : messages;
            
            if (field === 'username' || field === 'email') {
                this.showError('username', message);
            } else if (field === 'password') {
                this.showError('password', message);
            }
        }
    }

    handleStatusSpecificErrors(status) {
        switch (status) {
            case 429: // Too Many Requests
                this.disableFormTemporarily(300000); // 5 minutos
                break;
            case 423: // Locked Account
                this.showAccountLockedMessage();
                break;
            case 451: // Account Suspended
                this.showAccountSuspendedMessage();
                break;
        }
    }

    clearAllErrors() {
        ['username', 'password'].forEach(field => this.clearError(field));
    }

    disableFormTemporarily(milliseconds) {
        this.form.style.pointerEvents = 'none';
        this.form.style.opacity = '0.6';
        
        setTimeout(() => {
            this.form.style.pointerEvents = '';
            this.form.style.opacity = '';
        }, milliseconds);
    }

    showAccountLockedMessage() {
        this.showGlobalError(
            'Your account has been blocked due to multiple failed attempts. ' +
            'Try again later or contact support.',
            8000
        );
    }

    showAccountSuspendedMessage() {
        this.showGlobalError(
            'Your account has been suspended. Contact support for more information.',
            10000
        );
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-card);
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    showGlobalError(message, duration = 4000) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'global-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--error);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-card);
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, duration);
    }

    showInfoMessage(message) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-message';
        infoDiv.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--info);
            color: white;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-card);
            z-index: 9999;
            animation: slideInRight 0.5s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;
        infoDiv.textContent = message;
        
        document.body.appendChild(infoDiv);
        
        setTimeout(() => {
            infoDiv.remove();
        }, 5000); // information message lasts longer
    }

    redirectToRegister() {
        // implement redirect to registration page
        console.log('Redirect to registration page');
        window.location.href = 'register.html';
    }

    handleForgotPassword() {
        // implement forgot password functionality
        console.log('Recover password');
        // window.location.href = 'forgot-password.html';
    }
}

// ===== ADDITIONAL ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// ===== ADDITIONAL UTILITIES =====
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // user already authenticated, redirect
        window.location.href = 'dashboard.html';
    }
}

// check if the user is already authenticated
checkAuthStatus();
