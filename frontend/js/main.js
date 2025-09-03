// Main application for landing page

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all features
function initializeApp() {
    initializeStarField();
    setupNavigation();
    setupScrollEffects();
    setupButtonInteractions();
    setupConceptModals();
}

// Create animated star field effect
function initializeStarField() {
    const canvas = document.getElementById('space');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const stars = [];
    const numStars = 500;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(0, 10, 20, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.z -= 0.5;
            if (star.z <= 0) star.z = canvas.width;
            
            const x = (star.x - canvas.width / 2) * (canvas.width / star.z) + canvas.width / 2;
            const y = (star.y - canvas.height / 2) * (canvas.width / star.z) + canvas.height / 2;
            const size = Math.max(0.5, 2 * (canvas.width / star.z));
            
            ctx.fillStyle = `rgba(209, 255, 255, ${star.opacity})`;
            ctx.fillRect(x, y, size, size);
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Setup navigation buttons and scroll indicators
function setupNavigation() {
    const dots = document.querySelectorAll('.scroll-dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSection(index);
        });
    });
    
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveDot(index);
            }
        });
    });
}

// Navigate to specific section
function goToSection(index) {
    const sections = document.querySelectorAll('.section');
    if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    }
}

// Update active navigation dot
function updateActiveDot(activeIndex) {
    document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

// Setup scroll-triggered animations
function setupScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Setup button click handlers and hover effects
function setupButtonInteractions() {
    const exploreBtn = document.getElementById('exploreBtn');
    const finalCtaBtn = document.getElementById('finalCtaBtn');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            goToSection(1);
        });
    }
    
    if (finalCtaBtn) {
        finalCtaBtn.addEventListener('click', () => {
            showMessage('Welcome to your learning adventure!');
        });
    }
    
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Setup concept map modals
function setupConceptModals() {
    const planets = ['pythonPlanet', 'databasePlanet', 'tailwindPlanet'];
    const modals = ['pythonModal', 'databaseModal', 'tailwindModal'];
    
    planets.forEach((planetId, index) => {
        const planet = document.getElementById(planetId);
        const modal = document.getElementById(modals[index]);
        
        if (planet && modal) {
            planet.addEventListener('click', () => {
                openModal(modal);
            });
            
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    closeModal(modal);
                });
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (modal && modal.style.display === 'flex') {
                    closeModal(modal);
                }
            });
        }
    });
}

// Open concept modal
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

// Close concept modal
function closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Show user message
function showMessage(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .scroll-dot {
        transition: all 0.3s ease;
    }
    
    .scroll-dot.active {
        background: #6366f1;
        transform: scale(1.2);
    }
`;

document.head.appendChild(style);
