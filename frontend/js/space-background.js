// Space background effects system

let canvas, ctx;
let stars = [];
let centerX, centerY;
let animate = true;

// Initialize star field background
function initializeStarField() {
    canvas = document.getElementById('space');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    createStars();
    animateStars();
    
    window.addEventListener('resize', resizeCanvas);
}

// Resize canvas to match window size
function resizeCanvas() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
}

// Create star objects with random positions
function createStars() {
    const numStars = 800;
    stars = [];
    
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            opacity: Math.random() * 0.8 + 0.2
        });
    }
}

// Animate stars moving towards viewer
function animateStars() {
    if (!animate) return;
    
    ctx.fillStyle = 'rgba(0, 10, 20, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.z -= 0.5;
        if (star.z <= 0) star.z = canvas.width;
        
        const x = (star.x - centerX) * (canvas.width / star.z) + centerX;
        const y = (star.y - centerY) * (canvas.width / star.z) + centerY;
        const size = Math.max(0.5, 2 * (canvas.width / star.z));
        
        ctx.fillStyle = `rgba(209, 255, 255, ${star.opacity})`;
        ctx.fillRect(x, y, size, size);
    });
    
    requestAnimationFrame(animateStars);
}

// Setup mouse-based parallax effects
function setupParallaxEffects() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
    });
    
    function updateParallax() {
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;
        
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            const x = targetX * speed * 20;
            const y = targetY * speed * 20;
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
        
        requestAnimationFrame(updateParallax);
    }
    
    updateParallax();
}

// Create dynamic nebula background layers
function createNebulaEffect() {
    const nebulaContainer = document.createElement('div');
    nebulaContainer.className = 'nebula-effect';
    document.body.appendChild(nebulaContainer);
    
    for (let i = 0; i < 3; i++) {
        const nebula = document.createElement('div');
        nebula.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
                rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.05) 0%, 
                transparent 50%);
            animation: float ${6 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        nebulaContainer.appendChild(nebula);
    }
}

// Initialize all space background effects
function initializeSpaceBackground() {
    if (document.getElementById('space')) {
        initializeStarField();
    }
    setupParallaxEffects();
    createNebulaEffect();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSpaceBackground);
} else {
    initializeSpaceBackground();
}

// Make functions available globally for backward compatibility
window.initializeStarWarp = initializeStarField;
window.initializeSpaceBackground = initializeSpaceBackground;
