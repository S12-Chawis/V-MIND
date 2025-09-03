// Login space warp effect system

let canvas, ctx;
let stars = [];
let centerX, centerY;
let animate = true;

// Initialize login warp effect
function initializeLoginWarp() {
    canvas = document.getElementById('space');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    createStars();
    animateWarp();
    
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

// Create star objects for warp effect
function createStars() {
    const numStars = 1500;
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

// Animate stars with warp effect
function animateWarp() {
    if (!animate) return;
    
    ctx.fillStyle = 'rgba(10, 10, 15, 0.96)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.z -= 1.5;
        if (star.z <= 0) star.z = canvas.width;
        
        const x = (star.x - centerX) * (canvas.width / star.z) + centerX;
        const y = (star.y - centerY) * (canvas.width / star.z) + centerY;
        const size = Math.max(0.5, 2 * (canvas.width / star.z));
        
        const prevX = (star.x - centerX) * (canvas.width / (star.z + 2)) + centerX;
        const prevY = (star.y - centerY) * (canvas.width / (star.z + 2)) + centerY;
        
        ctx.strokeStyle = `rgba(209, 255, 255, ${star.opacity})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        ctx.fillStyle = `rgba(209, 255, 255, ${star.opacity})`;
        ctx.fillRect(x, y, size, size);
    });
    
    requestAnimationFrame(animateWarp);
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('space')) {
        initializeLoginWarp();
    }
});

// Make function available globally
window.initializeLoginWarp = initializeLoginWarp;

