// ===== CONFIGURACIÓN INICIAL =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== FUNCIONES PRINCIPALES =====
function initializeApp() {
    initializeStarWarp();
    setupNavbar();
    setupScrollAnimations();
    setupButtonInteractions();
    setupProgressAnimation();
    setupLeaderboardAnimations();
    setupParallaxEffects();
    setupRocketProgress();
    setupRoadmapSystem();
    setupScrolltellingEffects();
}

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
            o: '0.'+Math.floor(Math.random() * 99) + 1
        };
        stars.push(star);
    }
}

function moveStars(){
    for(i = 0; i < numStars; i++){
        star = stars[i];
        star.z--;
        
        if(star.z <= 0){
            star.z = canvas.width;
        }
    }
}

function drawStars(){
    var pixelX, pixelY, pixelRadius;
    
    // Redimensionar al tamaño de la pantalla
    if(canvas.width != window.innerWidth || canvas.height != window.innerHeight){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializeStars();
    }
    
    if(warp == 0) {
        c.fillStyle = "rgba(0,10,20,0.1)";
        c.fillRect(0,0, canvas.width, canvas.height);
    }
    
    c.fillStyle = "rgba(209, 255, 255, "+radius+")";
    for(i = 0; i < numStars; i++){
        star = stars[i];
        
        pixelX = (star.x - centerX) * (focalLength / star.z);
        pixelX += centerX;
        pixelY = (star.y - centerY) * (focalLength / star.z);
        pixelY += centerY;
        pixelRadius = 1 * (focalLength / star.z);
        
        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
        c.fillStyle = "rgba(209, 255, 255, "+star.o+")";
    }
}

// ===== FUNCIÓN PARA CAMBIAR MODO WARP =====
function toggleWarpMode() {
    warp = warp == 1 ? 0 : 1;
    c.clearRect(0, 0, canvas.width, canvas.height);
    executeFrame();
    
    // Si cambiamos a modo normal, desactivar el warp automático
    if (warp == 0) {
        window.disableWarpMode();
    }
}

// ===== EFECTO WARP BASADO EN SCROLL =====
function setupWarpEffect() {
    let lastScrollTop = 0;
    let warpIntensity = 0;
    let warpModeActive = true; // Controla si el modo warp está activo
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const scrollDelta = scrollTop - lastScrollTop;
        
        // Solo aplicar efecto warp si estamos en modo warp activo
        if (warpModeActive) {
            // Calcular intensidad del warp basado en la velocidad del scroll
            warpIntensity = Math.min(1, Math.abs(scrollDelta) / 10);
            
            // Aplicar efecto warp temporal
            if (warpIntensity > 0.1) {
                warp = 1;
                setTimeout(() => {
                    warp = 0;
                }, 100);
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Función para desactivar el modo warp automático
    window.disableWarpMode = function() {
        warpModeActive = false;
    };
}

// ===== NAVBAR =====
function setupNavbar() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    loginBtn.addEventListener('click', () => {
        showSuccessMessage('Funcionalidad de login próximamente');
    });
    
    registerBtn.addEventListener('click', () => {
        showSuccessMessage('Funcionalidad de registro próximamente');
    });
}

// ===== SCROLLTELLING EFFECTS =====
function setupScrolltellingEffects() {
    const sections = document.querySelectorAll('.section');
    let currentSection = 0;
    let isScrolling = false;
    
    // Función para navegar a una sección específica
    function goToSection(sectionIndex) {
        if (isScrolling || sectionIndex < 0 || sectionIndex >= sections.length) return;
        
        isScrolling = true;
        currentSection = sectionIndex;
        
        sections[sectionIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        updateSectionEffects(currentSection);
        window.updateScrollIndicators(currentSection);
        
        // Permitir scroll después de la animación
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                goToSection(currentSection + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                goToSection(currentSection - 1);
                break;
            case 'Home':
                e.preventDefault();
                goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                goToSection(sections.length - 1);
                break;
        }
    });
    
    // Navegación con rueda del mouse (más suave)
    let wheelTimeout;
    let stretchTimeout;
    let currentStretchDirection = '';
    
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        // Determinar dirección del scroll
        const direction = e.deltaY > 0 ? 'down' : 'up';
        const currentSectionElement = sections[currentSection];
        
        // Limpiar timeouts anteriores
        clearTimeout(wheelTimeout);
        clearTimeout(stretchTimeout);
        
        // Remover clases de stretch anteriores
        sections.forEach(section => {
            section.classList.remove('stretching', 'stretching-up', 'stretching-down');
        });
        
        // Aplicar efecto de stretch
        if (direction === 'down' && currentSection < sections.length - 1) {
            currentSectionElement.classList.add('stretching-down');
            currentStretchDirection = 'down';
        } else if (direction === 'up' && currentSection > 0) {
            currentSectionElement.classList.add('stretching-up');
            currentStretchDirection = 'up';
        } else {
            // Si no hay más secciones, hacer stretch general
            currentSectionElement.classList.add('stretching');
            currentStretchDirection = 'bounce';
        }
        
        // Remover efecto de stretch después de un tiempo
        stretchTimeout = setTimeout(() => {
            sections.forEach(section => {
                section.classList.remove('stretching', 'stretching-up', 'stretching-down');
            });
        }, 300);
        
        // Navegar después de un pequeño delay para mostrar el efecto
        wheelTimeout = setTimeout(() => {
            if (direction === 'down' && currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            } else if (direction === 'up' && currentSection > 0) {
                goToSection(currentSection - 1);
            } else {
                // Efecto de bounce si no hay más secciones
                createBounceEffect(currentSectionElement, direction);
            }
        }, 150);
    }, { passive: false });
    
    // Detectar sección actual en scroll
    window.addEventListener('scroll', () => {
        if (isScrolling) return;
        
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const newSection = Math.round(scrolled / windowHeight);
        
        if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
            currentSection = newSection;
            updateSectionEffects(currentSection);
            window.updateScrollIndicators(currentSection);
        }
    });
    
    // Configurar efecto warp
    setupWarpEffect();
    
    // Exponer función para navegación programática
    window.goToSection = goToSection;
    
    // Configurar indicadores de scroll
    setupScrollIndicators();
}

// ===== EFECTO BOUNCE =====
function createBounceEffect(element, direction) {
    // Crear partículas de bounce
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Crear múltiples partículas
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'bounce-particle';
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(135deg, #5D3FD3 0%, #FF6EC7 100%);
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 1000;
            animation: bounceParticle 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Animar partícula
        setTimeout(() => {
            const angle = (i / 8) * 360;
            const distance = 80;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
        }, 50);
        
        // Remover partícula
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 800);
    }
    
    // Efecto de vibración en la sección
    element.style.animation = 'bounceShake 0.6s ease-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
    
    // Crear ondas de sonido visual
    createSoundWaves(centerX, centerY);
}

// ===== ONDAS DE SONIDO VISUAL =====
function createSoundWaves(centerX, centerY) {
    for (let i = 0; i < 3; i++) {
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        wave.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(93, 63, 211, 0.6);
            border-radius: 50%;
            left: ${centerX - 10}px;
            top: ${centerY - 10}px;
            pointer-events: none;
            z-index: 999;
            animation: soundWave 1s ease-out forwards;
            animation-delay: ${i * 0.1}s;
        `;
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            document.body.removeChild(wave);
        }, 1000 + (i * 100));
    }
}

// ===== INDICADORES DE SCROLL =====
function setupScrollIndicators() {
    const dots = document.querySelectorAll('.scroll-dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            window.goToSection(index);
        });
    });
    
    // Función para actualizar indicadores
    window.updateScrollIndicators = function(sectionIndex) {
        dots.forEach((dot, index) => {
            if (index === sectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
}

function updateSectionEffects(sectionIndex) {
    const sections = document.querySelectorAll('.section');
    
    // Efectos específicos por sección (sin nave espacial)
    switch(sectionIndex) {
        case 0: // Intro
            // Efectos de intro
            break;
        case 1: // Problem
            // Efectos de problema
            break;
        case 2: // Solution
            // Efectos de solución
            break;
        case 3: // Gamification
            // Efectos de gamificación
            break;
        case 4: // Social
            // Efectos sociales
            break;
        case 5: // Conclusion
            // Efectos de conclusión
            break;
    }
}

// ===== ANIMACIONES DE SCROLL =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animaciones específicas por sección
                const sectionId = entry.target.id;
                switch(sectionId) {
                    case 'intro':
                        animateIntroSection();
                        break;
                    case 'problem':
                        animateProblemSection();
                        break;
                    case 'solution':
                        animateSolutionSection();
                        break;
                    case 'gamification':
                        animateGamificationSection();
                        break;
                    case 'social':
                        animateSocialSection();
                        break;
                    case 'conclusion':
                        animateConclusionSection();
                        break;
                }
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// ===== ANIMACIONES ESPECÍFICAS POR SECCIÓN =====
function animateIntroSection() {
    const title = document.querySelector('.main-title');
    const subtitle = document.querySelector('.main-subtitle');
    const ctaButton = document.getElementById('exploreBtn');

    // Animación secuencial más dramática
    setTimeout(() => title.classList.add('fade-in-up'), 200);
    setTimeout(() => subtitle.classList.add('fade-in-up'), 600);
    setTimeout(() => ctaButton.classList.add('fade-in-up'), 1000);
}

function animateProblemSection() {
    // Animación simple para la sección de problema
    const problemContent = document.querySelector('.problem-content');
    if (problemContent) {
        problemContent.classList.add('fade-in-up');
    }
}

function animateSolutionSection() {
    const roadmapContainer = document.querySelector('.roadmap-container');
    
    setTimeout(() => roadmapContainer.classList.add('fade-in-up'), 500);
}

function animateGamificationSection() {
    const fuelTank = document.querySelector('.fuel-tank');
    const badges = document.querySelectorAll('.badge');
    
    setTimeout(() => fuelTank.classList.add('fade-in-up'), 500);
    
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.classList.add('fade-in-scale');
            badge.style.animationDelay = `${index * 0.2}s`;
        }, 800 + (index * 150));
    });
}

function animateSocialSection() {
    const communityStats = document.querySelector('.community-stats');
    const leaderboard = document.querySelector('.leaderboard');
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    setTimeout(() => communityStats.classList.add('fade-in-up'), 300);
    setTimeout(() => leaderboard.classList.add('fade-in-up'), 700);
    
    leaderboardItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in-right');
        }, 900 + (index * 100));
    });
}

function animateConclusionSection() {
    const finalButton = document.getElementById('finalCtaBtn');
    
    setTimeout(() => finalButton.classList.add('fade-in-up'), 1000);
}



// ===== INTERACCIONES DE BOTONES =====
function setupButtonInteractions() {
    const exploreBtn = document.getElementById('exploreBtn');
    const finalCtaBtn = document.getElementById('finalCtaBtn');
    
    exploreBtn.addEventListener('click', () => {
        // Scroll suave a la siguiente sección con efecto
        const problemSection = document.getElementById('problem');
        problemSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Efecto de partículas
        createParticleEffect(exploreBtn);
    });
    
    finalCtaBtn.addEventListener('click', () => {
        // Efecto de partículas más intenso
        createParticleEffect(finalCtaBtn, true);
        
        setTimeout(() => {
            showSuccessMessage('¡Bienvenido a tu aventura de aprendizaje!');
        }, 500);
    });
    
    // Efectos hover mejorados en todos los botones CTA
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', addButtonGlow);
        button.addEventListener('mouseleave', removeButtonGlow);
    });
}

function addButtonGlow(event) {
    const button = event.currentTarget;
    button.style.transform = 'translateY(-2px) scale(1.02)';
    button.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
}

function removeButtonGlow(event) {
    const button = event.currentTarget;
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
}

// ===== EFECTO DE PARTÍCULAS =====
function createParticleEffect(element, isFinal = false) {
    const rect = element.getBoundingClientRect();
    const particleCount = isFinal ? 20 : 10;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${isFinal ? '#06b6d4' : '#6366f1'};
            border-radius: 50%;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            z-index: 1000;
            animation: particleExplosion 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Animar partícula
        setTimeout(() => {
            const angle = (i / particleCount) * 360;
            const distance = isFinal ? 100 : 50;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0';
        }, 50);
        
        // Remover partícula
        setTimeout(() => {
            document.body.removeChild(particle);
        }, 1000);
    }
}







// ===== SISTEMA DE PROGRESO CON COHETE =====
function setupRocketProgress() {
    const progressNumber = document.getElementById('progressNumber');
    const rocketProgress = document.getElementById('rocketProgress');
    let currentProgress = 0;
    let hasAnimated = false;
    
    function updateProgress() {
        const progress = Math.min(currentProgress, 100);
        progressNumber.textContent = `${progress}%`;
        
        // Cambiar color según el progreso
        if (progress <= 30) {
            progressNumber.style.color = '#FFD700'; // Amarillo crítico
        } else if (progress <= 60) {
            progressNumber.style.color = '#FFA500'; // Naranja
        } else if (progress <= 90) {
            progressNumber.style.color = '#32CD32'; // Verde claro
        } else {
            progressNumber.style.color = '#00FF00'; // Verde estable
        }
        
        currentProgress += 1;
        
        if (currentProgress <= 100) {
            setTimeout(updateProgress, 40); // 40ms = 4 segundos total para llegar a 100%
        }
    }
    
    // Iniciar la animación cuando la sección sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                setTimeout(() => {
                    currentProgress = 0;
                    rocketProgress.classList.add('animate');
                    updateProgress();
                }, 1000);
            }
        });
    });
    
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        observer.observe(progressContainer);
    }
}

// ===== SISTEMA DE MAPA CONCEPTUAL =====
function setupRoadmapSystem() {
    const pythonPlanet = document.getElementById('pythonPlanet');
    const databasePlanet = document.getElementById('databasePlanet');
    const tailwindPlanet = document.getElementById('tailwindPlanet');
    const pythonModal = document.getElementById('pythonModal');
    const databaseModal = document.getElementById('databaseModal');
    const tailwindModal = document.getElementById('tailwindModal');
    const closePythonModal = document.getElementById('closePythonModal');
    const closeDatabaseModal = document.getElementById('closeDatabaseModal');
    const closeTailwindModal = document.getElementById('closeTailwindModal');
    
    // Abrir modal al hacer click en el planeta Python
    pythonPlanet.addEventListener('click', () => {
        openModal(pythonModal);
    });
    
    // Abrir modal al hacer click en el planeta Bases de Datos
    databasePlanet.addEventListener('click', () => {
        openModal(databaseModal);
    });
    
    // Abrir modal al hacer click en el planeta Tailwind
    tailwindPlanet.addEventListener('click', () => {
        openModal(tailwindModal);
    });
    
    // Cerrar modales
    closePythonModal.addEventListener('click', () => closeModal(pythonModal));
    closeDatabaseModal.addEventListener('click', () => closeModal(databaseModal));
    closeTailwindModal.addEventListener('click', () => closeModal(tailwindModal));
    
    // Cerrar modales al hacer click en el backdrop
    [pythonModal, databaseModal, tailwindModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                closeModal(modal);
            }
        });
    });
    
    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (pythonModal.style.display === 'flex') closeModal(pythonModal);
            if (databaseModal.style.display === 'flex') closeModal(databaseModal);
            if (tailwindModal.style.display === 'flex') closeModal(tailwindModal);
        }
    });
    
    // Interacciones con los nodos del mapa conceptual
    const allConceptNodes = document.querySelectorAll('.concept-node');
    allConceptNodes.forEach(node => {
        node.addEventListener('click', () => {
            const topic = node.dataset.topic;
            showTopicDetails(topic, node);
        });
    });
    
    function openModal(modal) {
        modal.style.display = 'flex';
        // Bloquear scroll del body
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Animación de entrada del modal
        setTimeout(() => {
            modal.style.opacity = '1';
            // Esperar a que el modal esté completamente visible antes de dibujar líneas
            setTimeout(() => {
                drawConnectionLines(modal);
            }, 100);
        }, 10);
    }
    
    function closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            // Restaurar scroll del body
            document.body.style.overflow = 'auto';
            document.body.style.position = '';
            document.body.style.width = '';
        }, 300);
    }
    
    function showTopicDetails(topic, node) {
        // Efecto visual al hacer click
        node.style.transform = 'scale(1.15)';
        node.style.zIndex = '30';
        
        // Crear efecto de ondas
        createRippleEffect(node);
        
        setTimeout(() => {
            node.style.transform = '';
            node.style.zIndex = '';
        }, 300);
        
        // Aquí se podría mostrar más detalles del tema
        console.log(`Tema seleccionado: ${topic}`);
    }
    
    function drawConnectionLines(modal) {
        const svg = modal.querySelector('.connection-lines');
        const nodes = modal.querySelectorAll('.concept-node');
        
        // Limpiar líneas existentes
        const existingLines = svg.querySelectorAll('line');
        existingLines.forEach(line => line.remove());
        
        // Definir conexiones según el modal
        let connections = [];
        
        if (modal === pythonModal) {
            connections = [
                ['fundamentals', 'data-structures'],
                ['fundamentals', 'functions'],
                ['data-structures', 'oop'],
                ['functions', 'modules'],
                ['oop', 'web'],
                ['modules', 'data-science'],
                ['web', 'automation'],
                ['data-science', 'automation'],
                ['fundamentals', 'oop'],
                ['functions', 'data-science']
            ];
        } else if (modal === databaseModal) {
            connections = [
                ['fundamentals', 'sql'],
                ['fundamentals', 'nosql'],
                ['sql', 'design'],
                ['nosql', 'optimization'],
                ['design', 'security'],
                ['optimization', 'backup'],
                ['security', 'cloud'],
                ['backup', 'cloud'],
                ['fundamentals', 'design'],
                ['sql', 'security']
            ];
        } else if (modal === tailwindModal) {
            connections = [
                ['fundamentals', 'utilities'],
                ['fundamentals', 'layout'],
                ['utilities', 'components'],
                ['layout', 'responsive'],
                ['components', 'customization'],
                ['responsive', 'plugins'],
                ['customization', 'production'],
                ['plugins', 'production'],
                ['fundamentals', 'components'],
                ['utilities', 'customization']
            ];
        }
        
        connections.forEach(([fromTopic, toTopic]) => {
            const fromNode = modal.querySelector(`[data-topic="${fromTopic}"]`);
            const toNode = modal.querySelector(`[data-topic="${toTopic}"]`);
            
            if (fromNode && toNode) {
                const fromRect = fromNode.getBoundingClientRect();
                const toRect = toNode.getBoundingClientRect();
                const svgRect = svg.getBoundingClientRect();
                
                const fromX = fromRect.left + fromRect.width / 2 - svgRect.left;
                const fromY = fromRect.top + fromRect.height / 2 - svgRect.top;
                const toX = toRect.left + toRect.width / 2 - svgRect.left;
                const toY = toRect.top + toRect.height / 2 - svgRect.top;
                
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromX);
                line.setAttribute('y1', fromY);
                line.setAttribute('x2', toX);
                line.setAttribute('y2', toY);
                line.setAttribute('stroke', 'url(#lineGradient)');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('opacity', '0.6');
                line.setAttribute('stroke-dasharray', '5,5');
                line.style.animation = 'dash 2s linear infinite';
                
                svg.appendChild(line);
            }
        });
    }
    
    // Redibujar líneas cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (pythonModal.style.display === 'flex') {
            setTimeout(() => drawConnectionLines(pythonModal), 100);
        }
        if (databaseModal.style.display === 'flex') {
            setTimeout(() => drawConnectionLines(databaseModal), 100);
        }
        if (tailwindModal.style.display === 'flex') {
            setTimeout(() => drawConnectionLines(tailwindModal), 100);
        }
    });
}

// ===== EFECTO DE ONDAS =====
function createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.style.cssText = `
        position: fixed;
        width: 0;
        height: 0;
        border: 2px solid rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        pointer-events: none;
        z-index: 999;
        animation: rippleEffect 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        document.body.removeChild(ripple);
    }, 600);
}

// ===== ANIMACIÓN DE PROGRESO =====
function setupProgressAnimation() {
    const fuelLevel = document.getElementById('fuelLevel');
    const fuelText = document.querySelector('.fuel-text');
    
    // Simular progreso dinámico más realista
    let progress = 0;
    const targetProgress = 75;
    
    function animateProgress() {
        if (progress < targetProgress) {
            progress += 1;
            fuelLevel.style.width = `${progress}%`;
            fuelText.textContent = `Progreso: ${progress}%`;
            
            // Cambiar color según el progreso
            if (progress < 25) {
                fuelLevel.style.background = 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)';
            } else if (progress < 50) {
                fuelLevel.style.background = 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)';
            } else {
                fuelLevel.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
            }
            
            setTimeout(animateProgress, 50);
        }
    }
    
    // Iniciar animación cuando la sección sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(document.getElementById('gamification'));
}

// ===== ANIMACIONES DEL LEADERBOARD =====
function setupLeaderboardAnimations() {
    const leaderboardItems = document.querySelectorAll('.leaderboard-item');
    
    leaderboardItems.forEach((item, index) => {
        // Efecto hover mejorado
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px) scale(1.02)';
            item.style.background = 'rgba(255, 255, 255, 0.15)';
            item.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1)';
            if (!item.classList.contains('current-user')) {
                item.style.background = 'transparent';
            }
            item.style.boxShadow = 'none';
        });
    });
}

// ===== EFECTOS PARALLAX =====
function setupParallaxEffects() {
    // El efecto parallax ahora está manejado por el canvas
    // No necesitamos efectos adicionales aquí
}

// ===== UTILIDADES =====
function showSuccessMessage(message) {
    // Crear notificación de éxito mejorada
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🚀</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    // Estilos inline para la notificación
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
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== CLASES CSS PARA ANIMACIONES =====
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .fade-in-scale {
        animation: fadeInScale 0.6s ease forwards;
    }
    
    .fade-in-left {
        animation: fadeInLeft 0.6s ease forwards;
    }
    
    .fade-in-right {
        animation: fadeInRight 0.6s ease forwards;
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
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes particleExplosion {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    @keyframes rippleEffect {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
            transform: translate(-50px, -50px);
        }
    }
    
    @keyframes fleetFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-icon {
        font-size: 1.2rem;
    }
`;

document.head.appendChild(style);

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (event) => {
    console.error('Error en la aplicación:', event.error);
});

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
let ticking = false;

function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Aquí irían las actualizaciones que dependen del scroll
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);
