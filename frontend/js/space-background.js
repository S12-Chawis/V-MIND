// ===== EFECTO WARP DE ESTRELLAS CON CANVAS =====
// Basado en el ejemplo de @curran y adaptado por @nodws
window.requestAnimFrame = (function(){ return window.requestAnimationFrame })();

var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 1900;
var radius = '0.'+Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 0; // Modo normal siempre
var centerX, centerY;

var stars = [], star;
var i;
var animate = true;

function initializeStarWarp() {
    initializeStars();
    executeFrame();
}

function executeFrame(){
    if(animate)
        requestAnimFrame(executeFrame);
    moveStars();
    drawStars();
}

function initializeStars(){
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    stars = [];
    for(i = 0; i < numStars; i++){
        star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            o: '0.' + Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}

function moveStars(){
    for(i = 0; i < numStars; i++){
        star = stars[i];
        star.z--;

        if(star.z <= 0){
            star.x = Math.random() * canvas.width;
            star.y = Math.random() * canvas.height;
            star.z = canvas.width;
        }
    }
}

function drawStars(){
    var pixelX, pixelY, pixelRadius;

    // Resize to the screen
    if(canvas.width != window.innerWidth || canvas.width != window.innerWidth){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
    }

    if(warp == 0) {
        c.fillStyle = "rgba(10,10,15,1)";
        c.fillRect(0,0, canvas.width, canvas.height);
    }

    c.fillStyle = "rgba(209, 255, 255, " + radius + ")";
    for(i = 0; i < numStars; i++){
        star = stars[i];

        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);

        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}

// ===== EFECTOS DE PARALLAX =====
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

// ===== EFECTOS DE NEBULOSA DINÁMICOS =====
function createNebulaEffect() {
    const nebulaContainer = document.createElement('div');
    nebulaContainer.className = 'nebula-effect';
    document.body.appendChild(nebulaContainer);

    // Crear múltiples capas de nebulosa
    for (let i = 0; i < 3; i++) {
        const nebula = document.createElement('div');
        nebula.style.position = 'absolute';
        nebula.style.width = '100%';
        nebula.style.height = '100%';
        nebula.style.background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 255, 0.05) 0%, transparent 50%)`;
        nebula.style.animation = `float ${6 + Math.random() * 4}s ease-in-out infinite`;
        nebula.style.animationDelay = `${Math.random() * 2}s`;
        nebulaContainer.appendChild(nebula);
    }
}

// ===== INICIALIZACIÓN =====
function initializeSpaceBackground() {
    if (document.getElementById("space")) {
        initializeStarWarp();
    }
    setupParallaxEffects();
    createNebulaEffect();
}

// Auto-inicialización cuando se carga el DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSpaceBackground);
} else {
    initializeSpaceBackground();
}
