// Registration wizard system

class RegisterWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.userData = {
            name: '',
            email: '',
            phone: '',
            username: '',
            password: '',
            interests: [],
            level: 'beginner',
            objective: ''
        };
        
        this.init();
    }
    
    // Initialize wizard
    init() {
        this.renderStep();
        this.setupEventListeners();
    }
    
    // Setup navigation event listeners
    setupEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => this.previousStep());
        }
    }
    
    // Render current step content
    renderStep() {
        const container = document.getElementById('wizardContent');
        if (!container) return;
        
        let content = '';
        
        switch (this.currentStep) {
            case 1: content = this.renderPersonalInfo(); break;
            case 2: content = this.renderInterests(); break;
            case 3: content = this.renderLevel(); break;
            case 4: content = this.renderObjective(); break;
        }
        
        container.innerHTML = content;
        this.setupStepListeners();
        this.updateProgress();
    }
    
    // Render personal information step
    renderPersonalInfo() {
        return `
            <div class="step-content">
                <h2>Personal Information</h2>
                <p>Tell us about yourself to get started</p>
                
                <div class="form-group">
                    <label for="name">Full Name *</label>
                    <input type="text" id="name" class="form-input" placeholder="Your full name" value="${this.userData.name}">
                </div>
                
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" class="form-input" placeholder="your@email.com" value="${this.userData.email}">
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" class="form-input" placeholder="Your phone number" value="${this.userData.phone}">
                </div>
                
                <div class="form-group">
                    <label for="username">Username *</label>
                    <input type="text" id="username" class="form-input" placeholder="Choose a username" value="${this.userData.username}">
                </div>
                
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input type="password" id="password" class="form-input" placeholder="Minimum 6 characters" value="${this.userData.password}">
                </div>
            </div>
        `;
    }
    
    // Render interests selection step
    renderInterests() {
        const interests = [
            { id: 'javascript', name: 'JavaScript', emoji: '⚡' },
            { id: 'python', name: 'Python', emoji: '🐍' },
            { id: 'web', name: 'Web Development', emoji: '🌐' },
            { id: 'mobile', name: 'Mobile Apps', emoji: '📱' },
            { id: 'ai', name: 'Artificial Intelligence', emoji: '🤖' },
            { id: 'data', name: 'Data Science', emoji: '📊' }
        ];
        
        return `
            <div class="step-content">
                <h2>What interests you?</h2>
                <p>Select the topics you'd like to learn about</p>
                
                <div class="interests-grid">
                    ${interests.map(interest => `
                        <button class="interest-card ${this.userData.interests.includes(interest.id) ? 'selected' : ''}" 
                                data-interest="${interest.id}">
                            <span class="emoji">${interest.emoji}</span>
                            <span class="name">${interest.name}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="selection-count">
                    Selected: ${this.userData.interests.length} topics
                </div>
            </div>
        `;
    }
    
    // Render skill level step
    renderLevel() {
        const levels = [
            { id: 'beginner', name: 'Beginner', description: 'Starting from scratch' },
            { id: 'intermediate', name: 'Intermediate', description: 'Some experience' },
            { id: 'advanced', name: 'Advanced', description: 'Experienced developer' }
        ];
        
        return `
            <div class="step-content">
                <h2>What's your current level?</h2>
                <p>This helps us customize your learning path</p>
                
                <div class="level-options">
                    ${levels.map(level => `
                        <button class="level-option ${this.userData.level === level.id ? 'selected' : ''}" 
                                data-level="${level.id}">
                            <h3>${level.name}</h3>
                            <p>${level.description}</p>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Render learning objective step
    renderObjective() {
        return `
            <div class="step-content">
                <h2>What's your goal?</h2>
                <p>Tell us what you want to achieve</p>
                
                <div class="form-group">
                    <label for="objective">Learning Objective</label>
                    <textarea id="objective" class="form-textarea" 
                              placeholder="I want to..." maxlength="200">${this.userData.objective}</textarea>
                    <div class="char-count">${this.userData.objective.length}/200</div>
                </div>
                
                <div class="examples">
                    <p><strong>Examples:</strong></p>
                    <ul>
                        <li>Build my first web application</li>
                        <li>Switch careers to software development</li>
                        <li>Improve my programming skills</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // Setup event listeners for current step
    setupStepListeners() {
        switch (this.currentStep) {
            case 1: this.setupPersonalInfoListeners(); break;
            case 2: this.setupInterestsListeners(); break;
            case 3: this.setupLevelListeners(); break;
            case 4: this.setupObjectiveListeners(); break;
        }
    }
    
    // Setup personal info form listeners
    setupPersonalInfoListeners() {
        const inputs = ['name', 'email', 'phone', 'username', 'password'];
        
        inputs.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.userData[field] = e.target.value;
                });
            }
        });
    }
    
    // Setup interests selection listeners
    setupInterestsListeners() {
        const cards = document.querySelectorAll('.interest-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const interestId = card.dataset.interest;
                this.toggleInterest(interestId);
                card.classList.toggle('selected');
                this.updateSelectionCount();
            });
        });
    }
    
    // Setup level selection listeners
    setupLevelListeners() {
        const options = document.querySelectorAll('.level-option');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.userData.level = option.dataset.level;
            });
        });
    }
    
    // Setup objective textarea listener
    setupObjectiveListeners() {
        const textarea = document.getElementById('objective');
        const charCount = document.querySelector('.char-count');
        
        if (textarea && charCount) {
            textarea.addEventListener('input', (e) => {
                this.userData.objective = e.target.value;
                charCount.textContent = `${e.target.value.length}/200`;
            });
        }
    }
    
    // Toggle interest selection
    toggleInterest(interestId) {
        const index = this.userData.interests.indexOf(interestId);
        if (index > -1) {
            this.userData.interests.splice(index, 1);
        } else {
            this.userData.interests.push(interestId);
        }
    }
    
    // Update selection count display
    updateSelectionCount() {
        const count = document.querySelector('.selection-count');
        if (count) {
            count.textContent = `Selected: ${this.userData.interests.length} topics`;
        }
    }
    
    // Update progress indicator
    updateProgress() {
        const progress = document.getElementById('progress');
        if (progress) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progress.style.width = `${percentage}%`;
        }
        
        const stepText = document.getElementById('stepText');
        if (stepText) {
            stepText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }
    
    // Navigate to next step
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.renderStep();
        } else {
            this.completeRegistration();
        }
    }
    
    // Navigate to previous step
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep();
        }
    }
    
    // Complete registration process
    async completeRegistration() {
        try {
            if (!this.validateData()) {
                this.showError('Please fill in all required fields');
                return;
            }
            
            this.showLoading();
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: this.userData.name,
                    email: this.userData.email,
                    phone: this.userData.phone,
                    username: this.userData.username,
                    passwords: this.userData.password,
                    objective: this.userData.objective,
                    preferred_language: 'en'
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Account created successfully!');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                throw new Error(result.message || 'Registration failed');
            }
            
        } catch (error) {
            console.error('Registration error:', error);
            this.showError(error.message || 'Registration failed. Please try again.');
        }
    }
    
    // Validate user data
    validateData() {
        return this.userData.name.trim() !== '' &&
               this.userData.email.trim() !== '' &&
               this.userData.username.trim() !== '' &&
               this.userData.password.length >= 6 &&
               this.userData.interests.length > 0 &&
               this.userData.objective.trim() !== '';
    }
    
    // Show loading state
    showLoading() {
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.textContent = 'Creating Account...';
            nextBtn.disabled = true;
        }
    }
    
    // Show success message
    showSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    // Show error message
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    // Show message to user
    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RegisterWizard();
});
