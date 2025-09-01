// ===== SPACE WARP ESPECÍFICO PARA LOGIN =====
// Modo velocidad activado para crear sensación de movimiento

window.requestAnimFrame = (function(){ return window.requestAnimationFrame })();

var canvas = document.getElementById("space");
var c = canvas.getContext("2d");

var numStars = 2000;
var radius = '0.'+Math.floor(Math.random() * 9) + 1;
var focalLength = canvas.width * 2;
var warp = 1; // MODO WARP ACTIVADO para login
var centerX, centerY;

var stars = [], star;
var i;
var animate = true;

function initializeLoginWarp() {
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

    // MODO WARP - fondo negro para efecto de velocidad
    if(warp == 1) {
        c.fillStyle = "rgba(10,10,15,0.96)";
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

        // EFECTO WARP - líneas de velocidad
        if(warp == 1) {
            var px2 = (star.x - centerX) * (focalLength / (star.z + 2));
            px2 += centerX;
            var py2 = (star.y - centerY) * (focalLength / (star.z + 2));
            py2 += centerY;

            // Dibujar línea de velocidad
            c.strokeStyle = "rgba(209, 255, 255, " + star.o + ")";
            c.lineWidth = pixelRadius;
            c.beginPath();
            c.moveTo(px2, py2);
            c.lineTo(pixelX, pixelY);
            c.stroke();
        } else {
            // Modo normal - solo puntos
            c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        }
        
        c.fillStyle = "rgba(209, 255, 255, " + star.o + ")";
    }
}

// Auto-inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("space")) {
        initializeLoginWarp();
    }
});

