/**
 * V-Mind Dashboard - Main Application Controller
 * 
 * This file contains the core dashboard functionality including:
 * - User interface management and navigation
 * - Learning roadmap personalization based on survey results
 * - Task management and progress tracking
 * - Notes system with rich text editing
 * - Resource management and organization
 * - Progress visualization with charts
 * - User profile and account management
 * 
 * Key Features:
 * - Dynamic roadmap switching (Python, JavaScript, Java, C#)
 * - Interactive planet-based learning interface
 * - Real-time progress tracking and XP system
 * - Persistent data storage (localStorage + database)
 * - Responsive design with smooth animations
 * 
 * @author V-Mind Team
 * @version 2.0.0
 */

// ===== DASHBOARD CON NAVEGACIÓN POR SCROLL STICKY =====

/**
 * Main Dashboard Class
 * Manages all dashboard functionality including UI, data, and user interactions
 */
class Dashboard {
    constructor() {
        // Core navigation and state management
        this.currentSection = 'home';
        this.sections = ['home', 'roadmap', 'notes', 'resources'];
        
        // Inspirational quotes for user motivation
        this.quotes = [
            { text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb" },
            { text: "Education is the most powerful weapon you can use to change the world.", author: "Nelson Mandela" },
            { text: "Knowledge is power, but practice is the key to mastery.", author: "Confucius" },
            { text: "Every day is a new opportunity to learn something new.", author: "Unknown" },
            { text: "The mind that opens to a new idea never returns to its original size.", author: "Albert Einstein" }
        ];
        
        // Data storage for user content
        this.notes = [];
        this.resources = [];
        this.charts = {};
        
        // Rich text editors for notes and resources
        this.quillEditor = null;
        this.resourceQuillEditor = null;
        
        // Interactive slider variables for roadmap navigation
        this.currentPlanetIndex = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragStartScrollLeft = 0;
        
        // Current active roadmap (dynamically set based on user survey)
        this.currentRoadmap = null;
        
        // Python Roadmap (default fallback)
        this.pythonRoadmap = {
            fundamentals: {
                name: "Python Fundamentals",
                description: "The foundations of your programming journey",
                status: "completed",
                tasks: [
                    { id: 1, title: "Create your first 'Hello World' program", description: "Write and run your first Python code", xp: 50, completed: false },
                    { id: 2, title: "Learn about variables", description: "Understand how to create and use variables", xp: 75, completed: false },
                    { id: 3, title: "Practice with data types", description: "Work with strings, numbers and booleans", xp: 100, completed: false },
                    { id: 4, title: "Use basic operators", description: "Learn arithmetic and logical operators", xp: 75, completed: false },
                    { id: 5, title: "Create your first project", description: "Combine everything learned in a project", xp: 150, completed: false }
                ],
                resources: [
                    "Video: Introduction to Python",
                    "Official Python documentation",
                    "Interactive practical exercises",
                    "Fundamentals quiz"
                ]
            },
            "control-flow": {
                name: "Control Flow",
                description: "Learn to control the flow of your program",
                status: "in-progress",
                tasks: [
                    { id: 1, title: "Use if/else conditionals", description: "Learn to make decisions in your code", xp: 100, completed: false },
                    { id: 2, title: "Implement for loops", description: "Repeat actions with loops", xp: 125, completed: false },
                    { id: 3, title: "Work with while loops", description: "Loops with stop condition", xp: 125, completed: false },
                    { id: 4, title: "Create basic functions", description: "Organize your code in functions", xp: 150, completed: false },
                    { id: 5, title: "Project: Calculator", description: "Create a calculator using control flow", xp: 200, completed: false }
                ],
                resources: [
                    "Video: Control flow in Python",
                    "Interactive functions tutorial",
                    "Programming logic exercises",
                    "Project: Basic calculator"
                ]
            },
            "data-structures": {
                name: "Data Structures",
                description: "Organize and manipulate data efficiently",
                status: "locked",
                tasks: [
                    { id: 1, title: "Work with lists", description: "Learn to create and manipulate lists", xp: 100, completed: false },
                    { id: 2, title: "Use tuples", description: "Understand tuples and their characteristics", xp: 75, completed: false },
                    { id: 3, title: "Create dictionaries", description: "Organize data with key-value pairs", xp: 125, completed: false },
                    { id: 4, title: "Set operations", description: "Work with unique sets", xp: 100, completed: false },
                    { id: 5, title: "List comprehensions", description: "Optimize your code with comprehensions", xp: 150, completed: false }
                ],
                resources: [
                    "Video: Data structures in Python",
                    "Complete dictionary guide",
                    "Data manipulation exercises",
                    "Project: Inventory system"
                ]
            },
            "functions": {
                name: "Advanced Functions",
                description: "Master functions and advanced techniques",
                status: "locked",
                tasks: [
                    { id: 1, title: "Create lambda functions", description: "Anonymous functions for simple operations", xp: 100, completed: false },
                    { id: 2, title: "Implement decorators", description: "Modify functions with decorators", xp: 150, completed: false },
                    { id: 3, title: "Work with generators", description: "Create efficient iterators", xp: 125, completed: false },
                    { id: 4, title: "Recursive functions", description: "Functions that call themselves", xp: 150, completed: false },
                    { id: 5, title: "Args and kwargs", description: "Functions with variable arguments", xp: 125, completed: false }
                ],
                resources: [
                    "Video: Advanced functions",
                    "Decorators tutorial",
                    "Generators guide",
                    "Project: Decorators framework"
                ]
            },
            "oop": {
                name: "Programación Orientada a Objetos",
                description: "Organiza tu código con clases y objetos",
                status: "locked",
                tasks: [
                    { id: 1, title: "Crear clases básicas", description: "Define tus primeras clases", xp: 150, completed: false },
                    { id: 2, title: "Implementar herencia", description: "Reutiliza código con herencia", xp: 175, completed: false },
                    { id: 3, title: "Usar métodos especiales", description: "Personaliza el comportamiento de objetos", xp: 150, completed: false },
                    { id: 4, title: "Encapsulación", description: "Protege datos con encapsulación", xp: 125, completed: false },
                    { id: 5, title: "Proyecto: Sistema de biblioteca", description: "Crea un sistema completo con POO", xp: 250, completed: false }
                ],
                resources: [
                    "Video: POO en Python",
                    "Tutorial de clases y objetos",
                    "Guía de herencia",
                    "Proyecto: Sistema de gestión de biblioteca"
                ]
            },
            "modules": {
                name: "Módulos y Paquetes",
                description: "Organiza y reutiliza tu código",
                status: "locked",
                tasks: [
                    { id: 1, title: "Importar módulos", description: "Usa módulos de la biblioteca estándar", xp: 75, completed: false },
                    { id: 2, title: "Crear módulos propios", description: "Organiza tu código en módulos", xp: 100, completed: false },
                    { id: 3, title: "Trabajar con paquetes", description: "Estructura proyectos complejos", xp: 125, completed: false },
                    { id: 4, title: "Instalar paquetes externos", description: "Usa pip para instalar librerías", xp: 75, completed: false },
                    { id: 5, title: "Entornos virtuales", description: "Aísla dependencias de proyectos", xp: 100, completed: false }
                ],
                resources: [
                    "Video: Módulos y paquetes",
                    "Guía de pip y PyPI",
                    "Tutorial de entornos virtuales",
                    "Proyecto: Paquete personalizado"
                ]
            },
            "exceptions": {
                name: "Manejo de Excepciones",
                description: "Escribe código robusto y maneja errores",
                status: "locked",
                tasks: [
                    { id: 1, title: "Try/except básico", description: "Captura y maneja errores", xp: 100, completed: false },
                    { id: 2, title: "Tipos de excepciones", description: "Conoce las excepciones más comunes", xp: 75, completed: false },
                    { id: 3, title: "Context managers", description: "Usa with para manejo de recursos", xp: 125, completed: false },
                    { id: 4, title: "Excepciones personalizadas", description: "Crea tus propias excepciones", xp: 100, completed: false },
                    { id: 5, title: "Logging", description: "Registra eventos y errores", xp: 125, completed: false }
                ],
                resources: [
                    "Video: Manejo de excepciones",
                    "Guía de context managers",
                    "Tutorial de logging",
                    "Proyecto: Sistema de logging"
                ]
            },
            "file-io": {
                name: "Archivos y I/O",
                description: "Lee y escribe datos en archivos",
                status: "locked",
                tasks: [
                    { id: 1, title: "Leer archivos de texto", description: "Abre y lee archivos", xp: 100, completed: false },
                    { id: 2, title: "Escribir archivos", description: "Crea y modifica archivos", xp: 100, completed: false },
                    { id: 3, title: "Trabajar con CSV", description: "Procesa datos tabulares", xp: 125, completed: false },
                    { id: 4, title: "Serialización JSON", description: "Guarda y carga datos estructurados", xp: 100, completed: false },
                    { id: 5, title: "Proyecto: Gestor de archivos", description: "Crea una aplicación de gestión de archivos", xp: 200, completed: false }
                ],
                resources: [
                    "Video: Archivos y I/O",
                    "Guía de CSV en Python",
                    "Tutorial de JSON",
                    "Proyecto: Gestor de archivos"
                ]
            },
            "web": {
                name: "Desarrollo Web",
                description: "Crea aplicaciones web con Python",
                status: "locked",
                tasks: [
                    { id: 1, title: "Primera app con Flask", description: "Crea tu primera aplicación web", xp: 150, completed: false },
                    { id: 2, title: "Rutas y templates", description: "Define rutas y crea vistas", xp: 125, completed: false },
                    { id: 3, title: "APIs REST", description: "Crea APIs para comunicación", xp: 175, completed: false },
                    { id: 4, title: "Bases de datos web", description: "Conecta tu app con una base de datos", xp: 150, completed: false },
                    { id: 5, title: "Despliegue", description: "Publica tu aplicación en la web", xp: 200, completed: false }
                ],
                resources: [
                    "Video: Desarrollo web con Python",
                    "Tutorial de Flask",
                    "Guía de Django",
                    "Proyecto: Blog web"
                ]
            },
            "data-science": {
                name: "Data Science",
                description: "Analiza y visualiza datos",
                status: "locked",
                tasks: [
                    { id: 1, title: "Introducción a Pandas", description: "Manipula datos con DataFrames", xp: 150, completed: false },
                    { id: 2, title: "Análisis básico", description: "Explora y limpia datos", xp: 125, completed: false },
                    { id: 3, title: "Visualización con Matplotlib", description: "Crea gráficos y visualizaciones", xp: 150, completed: false },
                    { id: 4, title: "Jupyter Notebooks", description: "Trabaja en notebooks interactivos", xp: 100, completed: false },
                    { id: 5, title: "Proyecto: Análisis de datos", description: "Realiza un análisis completo de datos", xp: 250, completed: false }
                ],
                resources: [
                    "Video: Data Science con Python",
                    "Tutorial de Pandas",
                    "Guía de Matplotlib",
                    "Proyecto: Análisis de datos"
                ]
            }
        };
        
        this.init();
    }

    async init() {
        try {
            // Verificar autenticación antes de continuar
            if (!this.checkAuthentication()) {
                return;
            }
            
            this.loadUserData();
            this.setupEventListeners();
            this.initializeScrollNavigation();
            this.renderDashboard();
            this.initializeCharts();
            await this.loadNotes();
            this.loadResources();
            this.setupQuillEditor();
            this.setupResourceQuillEditor();
            this.renderRoadmap();
            this.setupDragAndDrop();
            
            // Cargar tareas del usuario desde la base de datos
            await this.loadUserTasksFromDatabase();
            
            // Aplicar personalización basada en la encuesta
            this.applySurveyPersonalization();
            
            // Asegurar que el roadmap se inicialice correctamente después de que todo esté listo
            setTimeout(() => {
                this.initializeRoadmap();
            }, 500);
            
        } catch (error) {
            console.error('Error during dashboard initialization:', error);
            // Si hay error, limpiar datos corruptos y redirigir
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            window.location.href = 'login.html';
        }
    }

    checkAuthentication() {
        const userData = localStorage.getItem('userData');
        const authToken = localStorage.getItem('authToken');
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        
        if (!userData || !authToken) {
            console.log('Authentication check failed - missing data or token');
            return false;
        }
        
        // Verificar si el token ha expirado (24 horas)
        if (loginTimestamp) {
            const loginTime = parseInt(loginTimestamp);
            const currentTime = Date.now();
            const tokenAge = currentTime - loginTime;
            const maxAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
            
            if (tokenAge > maxAge) {
                console.log('Token expired, redirecting to login');
                localStorage.removeItem('userData');
                localStorage.removeItem('authToken');
                localStorage.removeItem('loginTimestamp');
                return false;
            }
        }
        
        try {
            JSON.parse(userData);
            return true;
        } catch (error) {
            console.error('Invalid user data format:', error);
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            localStorage.removeItem('loginTimestamp');
            return false;
        }
    }

    loadUserData() {
        try {
            const userData = localStorage.getItem('userData');
            const parsedUserData = JSON.parse(userData);
            
            console.log('Raw user data from localStorage:', parsedUserData);
            
            // Usar los datos reales del usuario del localStorage
            this.userData = {
                id: parsedUserData.id,
                name: parsedUserData.username || parsedUserData.name,
                email: parsedUserData.email,
                level: parsedUserData.level || 0,
                points: parsedUserData.level * 100 || 0, // XP basado en nivel
                streak: 3, // Valor por defecto
                objetive: parsedUserData.objetivo || 'Aprender programación',
                rol: parsedUserData.rol || 'user'
            };
            
            console.log('User data loaded successfully:', this.userData);
            this.updateUserInterface();
            
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error; // Dejar que checkAuthentication maneje el redirect
        }
    }

    updateUserInterface() {
        // Actualizar sidebar
        document.getElementById('sidebarUserName').textContent = this.userData.name;
        document.getElementById('sidebarAvatar').src = 'assets/ui_elements/avatar.png';
        
        // Calcular XP y progreso
        const currentXP = this.userData.points;
        const nextLevelXP = (this.userData.level + 1) * 200; // XP necesario para siguiente nivel
        const progressPercentage = Math.min((currentXP / nextLevelXP) * 100, 100);
        
        document.getElementById('sidebarXPFill').style.width = `${progressPercentage}%`;
        document.getElementById('sidebarXP').textContent = currentXP.toLocaleString();
        document.getElementById('sidebarXPNext').textContent = nextLevelXP.toLocaleString();

        // Actualizar home
        document.getElementById('userName').textContent = this.userData.name;
        
        // Actualizar cita inspiradora o mensaje personalizado
        const surveyData = localStorage.getItem('userSurveyData');
        if (surveyData) {
            try {
                const survey = JSON.parse(surveyData);
                const personalizedMessage = this.getPersonalizedMessage(survey);
                document.getElementById('quoteText').textContent = personalizedMessage.text;
                document.getElementById('quoteAuthor').textContent = personalizedMessage.author;
            } catch (error) {
                // Si hay error, usar cita por defecto
                const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
                document.getElementById('quoteText').textContent = randomQuote.text;
                document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
            }
        } else {
            // Si no hay encuesta, usar cita por defecto
            const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            document.getElementById('quoteText').textContent = randomQuote.text;
            document.getElementById('quoteAuthor').textContent = `- ${randomQuote.author}`;
        }

        // Actualizar streak
        this.updateStreakDisplay();
        
        console.log('User interface updated with:', {
            name: this.userData.name,
            level: this.userData.level,
            points: this.userData.points,
            progress: `${progressPercentage}%`
        });
    }

    updateStreakDisplay() {
        const streakDays = document.querySelectorAll('.streak-day-mini');
        const currentStreak = this.userData.streak;
        
        streakDays.forEach((day, index) => {
            if (index < currentStreak) {
                day.classList.add('active');
            } else {
                day.classList.remove('active');
            }
        });
    }

    setupEventListeners() {
        // Toggle de la tarjeta de perfil
        document.getElementById('profileCardHeader').addEventListener('click', () => {
            this.toggleProfileCard();
        });

        // Navegación por scroll
        document.querySelectorAll('.scroll-nav .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.scrollToSection(section);
            });
        });

        // Indicadores de scroll
        document.querySelectorAll('.scroll-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const sectionIndex = parseInt(e.currentTarget.dataset.section);
                this.scrollToSectionByIndex(sectionIndex);
            });
        });

        // Controles del slider
        const prevBtn = document.getElementById('prevPlanet');
        const nextBtn = document.getElementById('nextPlanet');
        
        console.log('Setting up slider controls:', prevBtn, nextBtn);
        
        prevBtn.addEventListener('click', () => {
            console.log('Prev button clicked');
            this.navigatePlanet(-1);
        });

        nextBtn.addEventListener('click', () => {
            console.log('Next button clicked');
            this.navigatePlanet(1);
        });

        // Botones de notas
        document.getElementById('newNoteBtn').addEventListener('click', () => {
            this.openNoteModal();
        });

        document.getElementById('newQuickNote').addEventListener('click', () => {
            this.openNoteModal();
        });

        // Modal de notas
        document.getElementById('closeNoteModal').addEventListener('click', () => {
            this.closeNoteModal();
        });

        document.getElementById('cancelNote').addEventListener('click', () => {
            this.closeNoteModal();
        });

        document.getElementById('saveNote').addEventListener('click', () => {
            this.saveNote();
        });

        // Modal de recursos
        document.getElementById('closeResourceModal').addEventListener('click', () => {
            this.closeResourceModal();
        });

        // Modal de planetas
        document.getElementById('closePlanetModal').addEventListener('click', () => {
            this.closePlanetModal();
        });

        document.getElementById('closePlanetBtn').addEventListener('click', () => {
            this.closePlanetModal();
        });

        document.getElementById('startPlanetBtn').addEventListener('click', () => {
            this.startPlanetLearning();
        });

        // Cerrar sesión
        document.getElementById('sidebarLogoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Eliminar cuenta
        document.getElementById('sidebarDeleteAccountBtn').addEventListener('click', () => {
            this.deleteAccount();
        });

        // Retomar encuesta
        const retakeSurveyBtn = document.getElementById('sidebarRetakeSurveyBtn');
        if (retakeSurveyBtn) {
            retakeSurveyBtn.addEventListener('click', () => {
                this.retakeSurvey();
            });
        }

        // Event listeners para modales
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeNoteModal();
                this.closeResourceModal();
                this.closePlanetModal();
            }
        });

        // Listener para resize de ventana
        window.addEventListener('resize', () => {
            // Reajustar el roadmap cuando cambie el tamaño de la ventana
            setTimeout(() => {
                this.scrollToPlanet(this.currentPlanetIndex);
            }, 100);
        });
    }

    initializeScrollNavigation() {
        const main = document.querySelector('.dashboard-main');
        let isScrolling = false;

        main.addEventListener('scroll', () => {
            if (isScrolling) return;
            
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 100);

            this.updateActiveSection();
        });

        // Scroll suave entre secciones
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        const main = document.querySelector('.dashboard-main');
        main.style.scrollBehavior = 'smooth';
    }

    updateActiveSection() {
        const main = document.querySelector('.dashboard-main');
        const scrollTop = main.scrollTop;
        const sectionHeight = window.innerHeight;
        const currentIndex = Math.floor(scrollTop / sectionHeight);
        
        const newSection = this.sections[currentIndex] || 'home';
        
        if (newSection !== this.currentSection) {
            this.currentSection = newSection;
            this.updateNavigation();
            this.updateScrollIndicators(currentIndex);
        }
    }

    updateNavigation() {
        document.querySelectorAll('.scroll-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNavItem = document.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }

    updateScrollIndicators(activeIndex) {
        document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    scrollToSection(section) {
        const sectionIndex = this.sections.indexOf(section);
        if (sectionIndex === -1) return;

        this.scrollToSectionByIndex(sectionIndex);
    }

    scrollToSectionByIndex(index) {
        const main = document.querySelector('.dashboard-main');
        const sectionHeight = window.innerHeight;
        const targetScroll = index * sectionHeight;

        main.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });

        this.currentSection = this.sections[index];
        this.updateNavigation();
        this.updateScrollIndicators(index);
    }

    toggleProfileCard() {
        const profileCardTop = document.getElementById('profileCardTop');
        const profileCardBottom = document.getElementById('profileCardBottom');
        const expandIcon = document.getElementById('expandIcon');
        
        const isExpanded = profileCardTop.classList.contains('expanded');
        
        if (isExpanded) {
            // Cerrar dropdown
            profileCardTop.classList.remove('expanded');
            expandIcon.style.transform = 'rotate(0deg)';
            
            // Cerrar el dropdown con transición suave
            if (profileCardBottom) {
                profileCardBottom.style.maxHeight = '0px';
                profileCardBottom.style.opacity = '0';
                profileCardBottom.style.transform = 'translateY(-10px)';
            }
        } else {
            // Abrir dropdown
            profileCardTop.classList.add('expanded');
            expandIcon.style.transform = 'rotate(180deg)';
            
            // Abrir el dropdown con transición suave
            if (profileCardBottom) {
                // Primero hacer visible
                profileCardBottom.style.opacity = '1';
                profileCardBottom.style.transform = 'translateY(0)';
                
                // Luego expandir la altura
                setTimeout(() => {
                    const scrollHeight = profileCardBottom.scrollHeight;
                    profileCardBottom.style.maxHeight = scrollHeight + 'px';
                }, 10);
            }
        }
    }

    initializeCharts() {
        this.initializeProgressChart();
        this.initializeStreakChart();
    }

    initializeProgressChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');
        
        this.charts.progress = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Pendiente'],
                datasets: [{
                    data: [1, 9],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(255, 255, 255, 0.1)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(255, 255, 255, 0.2)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    initializeStreakChart() {
        const ctx = document.getElementById('streakChart').getContext('2d');
        
        this.charts.streak = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Horas de estudio',
                    data: [2, 3, 1, 4, 2, 3, 1],
                    borderColor: 'rgba(255, 110, 199, 1)',
                    backgroundColor: 'rgba(255, 110, 199, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    renderRoadmap() {
        const sliderTrack = document.getElementById('sliderTrack');
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        
        sliderTrack.innerHTML = '';
        
        planetOrder.forEach((planetId, index) => {
            const planetData = this.pythonRoadmap[planetId];
            const planetCard = document.createElement('div');
            planetCard.className = `planet-card ${planetData.status}`;
            planetCard.dataset.planet = planetId;
            planetCard.dataset.index = index;
            planetCard.draggable = true;
            
            planetCard.innerHTML = `
                <div class="planet-image">
                    <img src="assets/ui_elements/planeta${(index % 4) + 1}.png" alt="${planetData.name}">
                </div>
                <div class="planet-info">
                    <h3>${planetData.name}</h3>
                    <p>${planetData.description}</p>
                </div>
                <div class="planet-status">
                    ${this.getStatusIcon(planetData.status)}
                </div>
            `;
            
            planetCard.addEventListener('click', () => {
                if (planetData.status !== 'locked') {
                    this.openPlanetModal(planetId);
                }
            });
            
            sliderTrack.appendChild(planetCard);
        });
        
        this.updateRoadmapProgress();
        this.updateSliderControls();
        
        // Debug: verificar que los planetas se renderizaron
        console.log('Planets rendered:', document.querySelectorAll('.planet-card').length);
    }

    initializeRoadmap() {
        // Asegurar que el primer planeta esté centrado y visible
        this.currentPlanetIndex = 0;
        
        // Forzar la posición inicial sin transform para asegurar visibilidad
        const sliderTrack = document.getElementById('sliderTrack');
        const sliderContainer = document.querySelector('.slider-container');
        
        // Debug: verificar que los elementos existen
        console.log('Slider elements:', {
            sliderTrack: !!sliderTrack,
            sliderContainer: !!sliderContainer,
            containerWidth: sliderContainer?.clientWidth,
            trackWidth: sliderTrack?.scrollWidth
        });
        
        sliderTrack.style.transform = 'translateX(0px)';
        
        // Esperar un momento y luego aplicar el centrado
        setTimeout(() => {
            this.scrollToPlanet(0);
            this.updateSliderControls();
            console.log('Roadmap initialized successfully');
        }, 100);
    }

    getStatusIcon(status) {
        switch (status) {
            case 'completed': return '✓';
            case 'in-progress': return '⟳';
            case 'locked': return '🔒';
            default: return '⏳';
        }
    }

    updateRoadmapProgress() {
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        const completedPlanets = planetOrder.filter(planetId => this.pythonRoadmap[planetId].status === 'completed').length;
        const inProgressPlanets = planetOrder.filter(planetId => this.pythonRoadmap[planetId].status === 'in-progress').length;
        const progressPercentage = ((completedPlanets + inProgressPlanets * 0.5) / planetOrder.length) * 100;
        
        document.getElementById('roadmapProgress').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${completedPlanets} completados, ${inProgressPlanets} en progreso de ${planetOrder.length} planetas`;
    }

    updateSliderControls() {
        const prevBtn = document.getElementById('prevPlanet');
        const nextBtn = document.getElementById('nextPlanet');
        
        // Habilitar/deshabilitar botones basado en el índice actual
        prevBtn.disabled = this.currentPlanetIndex === 0;
        nextBtn.disabled = this.currentPlanetIndex === 9;
        
        // Agregar clases visuales para el estado disabled
        prevBtn.classList.toggle('disabled', this.currentPlanetIndex === 0);
        nextBtn.classList.toggle('disabled', this.currentPlanetIndex === 9);
    }

    navigatePlanet(direction) {
        console.log('navigatePlanet called with direction:', direction, 'currentIndex:', this.currentPlanetIndex);
        const newIndex = this.currentPlanetIndex + direction;
        if (newIndex >= 0 && newIndex <= 9) {
            this.currentPlanetIndex = newIndex;
            this.scrollToPlanet(newIndex);
            this.updateSliderControls();
        }
    }

    scrollToPlanet(index) {
        const sliderTrack = document.getElementById('sliderTrack');
        const sliderContainer = document.querySelector('.slider-container');
        const cardWidth = 200; // Ancho de cada tarjeta
        const gap = 32; // Gap entre tarjetas
        const totalCardWidth = cardWidth + gap;
        const containerWidth = sliderContainer.clientWidth;
        
        // Asegurar que el índice esté dentro del rango válido
        const clampedIndex = Math.max(0, Math.min(9, index));
        
        // Calcular la posición para centrar el planeta
        const targetPosition = clampedIndex * totalCardWidth;
        const centerOffset = (containerWidth - cardWidth) / 2;
        const finalPosition = targetPosition - centerOffset;
        
        // Calcular el máximo scroll posible
        const totalWidth = 10 * totalCardWidth;
        const maxScroll = Math.max(0, totalWidth - containerWidth);
        const clampedPosition = Math.max(0, Math.min(maxScroll, finalPosition));
        
        console.log('scrollToPlanet:', {
            index: clampedIndex,
            containerWidth,
            targetPosition,
            centerOffset,
            finalPosition: clampedPosition,
            maxScroll
        });
        
        // Aplicar la transformación
        sliderTrack.style.transform = `translateX(-${clampedPosition}px)`;
        this.currentPlanetIndex = clampedIndex;
        
        // Actualizar la clase active en los planetas
        document.querySelectorAll('.planet-card').forEach((card, i) => {
            card.classList.toggle('active', i === clampedIndex);
        });
    }

    setupDragAndDrop() {
        const sliderTrack = document.getElementById('sliderTrack');
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        
        sliderTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            
            // Obtener la posición actual del transform
            const transform = window.getComputedStyle(sliderTrack).transform;
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                startScrollLeft = -matrix.m41;
            } else {
                startScrollLeft = 0;
            }
            
            sliderTrack.style.cursor = 'grabbing';
            sliderTrack.classList.add('dragging');
            e.preventDefault();
        });
        
        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const currentX = e.clientX;
            const diff = startX - currentX;
            const newScrollLeft = startScrollLeft + diff;
            
            // Limitar el rango de movimiento
            const sliderContainer = document.querySelector('.slider-container');
            const containerWidth = sliderContainer.clientWidth;
            const cardWidth = 200;
            const gap = 32;
            const totalCardWidth = cardWidth + gap;
            const totalWidth = 10 * totalCardWidth; // 10 planetas * totalCardWidth
            const maxScroll = Math.max(0, totalWidth - containerWidth);
            const clampedScroll = Math.max(0, Math.min(maxScroll, newScrollLeft));
            
            sliderTrack.style.transform = `translateX(-${clampedScroll}px)`;
        });
        
        sliderTrack.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                sliderTrack.style.cursor = 'grab';
                sliderTrack.classList.remove('dragging');
                
                // Snap al planeta más cercano
                this.snapToNearestPlanet();
            }
        });
        
        sliderTrack.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                sliderTrack.style.cursor = 'grab';
                sliderTrack.classList.remove('dragging');
                this.snapToNearestPlanet();
            }
        });
        
        // Prevenir selección de texto durante el drag
        sliderTrack.addEventListener('selectstart', (e) => {
            if (isDragging) {
                e.preventDefault();
            }
        });
    }
    
    snapToNearestPlanet() {
        const sliderTrack = document.getElementById('sliderTrack');
        const sliderContainer = document.querySelector('.slider-container');
        const transform = window.getComputedStyle(sliderTrack).transform;
        let currentTranslate = 0;
        
        if (transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            currentTranslate = -matrix.m41;
        }
        
        const cardWidth = 200;
        const gap = 32;
        const totalCardWidth = cardWidth + gap;
        const containerWidth = sliderContainer.clientWidth;
        
        // Calcular qué planeta está más cerca del centro
        const centerOffset = (containerWidth - cardWidth) / 2;
        const centerPosition = currentTranslate + centerOffset;
        const planetIndex = Math.round(centerPosition / totalCardWidth);
        const clampedIndex = Math.max(0, Math.min(9, planetIndex));
        
        this.currentPlanetIndex = clampedIndex;
        this.scrollToPlanet(clampedIndex);
        this.updateSliderControls();
    }

    setupQuillEditor() {
        this.quillEditor = new Quill('#noteEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Escribe tu nota aquí...'
        });
    }

    setupResourceQuillEditor() {
        this.resourceQuillEditor = new Quill('#resourceNoteEditor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                    ['clean']
                ]
            },
            placeholder: 'Toma notas mientras ves el video...'
        });
    }

    async loadNotes() {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/notes/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las notas desde la base de datos');
            }

            const result = await response.json();
            this.notes = result.data.map(note => ({
                id: note.note_id,
                title: note.title,
                content: note.content,
                tags: [], // Por ahora no implementamos tags en la BD
                createdAt: note.created_at,
                updatedAt: note.updated_at
            }));
            
            this.renderNotes();
        } catch (error) {
            console.error('Error al cargar notas desde la base de datos:', error);
            // Si hay error, usar localStorage como respaldo
            const userId = this.userData.id;
            const savedNotes = localStorage.getItem(`userNotes_${userId}`);
            this.notes = savedNotes ? JSON.parse(savedNotes) : [];
            this.renderNotes();
        }
    }

    renderNotes() {
        const notesGrid = document.getElementById('notesGrid');
        notesGrid.innerHTML = '';

        if (this.notes.length === 0) {
            notesGrid.innerHTML = `
                <div class="empty-notes">
                    <div class="empty-icon">📝</div>
                    <h3>No tienes notas aún</h3>
                    <p>Crea tu primera nota para comenzar a organizar tu aprendizaje</p>
                    <button class="btn-primary" onclick="dashboard.openNoteModal()">
                        <span>+</span> Crear Primera Nota
                    </button>
                </div>
            `;
            return;
        }

        this.notes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card';
            
            // Formatear fecha
            const date = new Date(note.updatedAt || note.createdAt);
            const formattedDate = date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            noteCard.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-actions">
                        <button class="note-action-btn edit-btn" title="Editar nota">
                            <span>✏️</span>
                        </button>
                        <button class="note-action-btn delete-btn" title="Eliminar nota">
                            <span>🗑️</span>
                        </button>
                    </div>
                </div>
                <div class="note-content">${note.content}</div>
                <div class="note-footer">
                    <div class="note-tags">
                        ${note.tags.map(tag => `<span class="note-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="note-date">${formattedDate}</div>
                </div>
            `;
            
            // Event listeners para los botones
            const editBtn = noteCard.querySelector('.edit-btn');
            const deleteBtn = noteCard.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editNote(note);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteNote(note.id);
            });
            
            // Click en la tarjeta para editar
            noteCard.addEventListener('click', () => {
                this.editNote(note);
            });
            
            notesGrid.appendChild(noteCard);
        });
    }

    loadResources() {
        this.resources = [
            {
                id: 1,
                title: 'Fundamentos de Python',
                description: 'Video introductorio a Python',
                type: 'video',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                planet: 'fundamentals',
                tags: ['python', 'fundamentos']
            },
            {
                id: 2,
                title: 'Estructuras de Datos',
                description: 'Listas, tuplas y diccionarios',
                type: 'video',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                planet: 'data-structures',
                tags: ['python', 'estructuras']
            },
            {
                id: 3,
                title: 'Programación Orientada a Objetos',
                description: 'Clases y objetos en Python',
                type: 'video',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                planet: 'oop',
                tags: ['python', 'poo']
            }
        ];
        this.renderResources();
    }

    renderResources() {
        const resourcesGrid = document.getElementById('resourcesGrid');
        resourcesGrid.innerHTML = '';

        this.resources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            resourceCard.innerHTML = `
                <div class="resource-thumbnail">
                    <span>🎥</span>
                </div>
                <div class="resource-content">
                    <h3 class="resource-title">${resource.title}</h3>
                    <p class="resource-description">${resource.description}</p>
                    <div class="resource-meta">
                        <span>Planeta: ${resource.planet}</span>
                        <span>Video</span>
                    </div>
                </div>
            `;
            resourceCard.addEventListener('click', () => {
                this.openResourceModal(resource);
            });
            resourcesGrid.appendChild(resourceCard);
        });
    }

    openPlanetModal(planetId) {
        const planetData = this.pythonRoadmap[planetId];
        if (!planetData) return;

        const modal = document.getElementById('planetModal');
        const title = document.getElementById('planetTitle');
        const name = document.getElementById('planetModalName');
        const description = document.getElementById('planetModalDescription');
        const status = document.getElementById('planetModalStatus');
        const image = document.getElementById('planetModalImage');
        const tasks = document.getElementById('planetModalTasks');
        const resources = document.getElementById('planetModalResources');
        const completedTasks = document.getElementById('completedTasks');
        const totalTasks = document.getElementById('totalTasks');
        const xpEarned = document.getElementById('xpEarned');

        title.textContent = planetData.name;
        name.textContent = planetData.name;
        description.textContent = planetData.description;
        status.textContent = this.getStatusText(planetData.status);
        
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        const planetIndex = planetOrder.indexOf(planetId);
        image.src = `assets/ui_elements/planeta${(planetIndex % 4) + 1}.png`;

        // Renderizar tareas
        const completedCount = planetData.tasks.filter(task => task.completed).length;
        const totalCount = planetData.tasks.length;
        const earnedXP = planetData.tasks.filter(task => task.completed).reduce((sum, task) => sum + task.xp, 0);

        completedTasks.textContent = completedCount;
        totalTasks.textContent = totalCount;
        xpEarned.textContent = `${earnedXP} XP`;

        tasks.innerHTML = planetData.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="dashboard.toggleTask('${planetId}', ${task.id})"></div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                </div>
                <div class="task-xp">
                    <span>⭐</span>
                    <span>${task.xp} XP</span>
                </div>
            </div>
        `).join('');

        // Renderizar recursos
        resources.innerHTML = planetData.resources.map(resource => 
            `<div class="resource-item">📚 ${resource}</div>`
        ).join('');

        modal.classList.add('active');
        this.currentPlanetId = planetId;
    }

    toggleTask(planetId, taskId) {
        const planetData = this.pythonRoadmap[planetId];
        const task = planetData.tasks.find(t => t.id === taskId);
        
        if (task) {
            // Verificar si ya hay una tarea marcada
            const completedTasks = planetData.tasks.filter(t => t.completed).length;
            
            if (task.completed) {
                // Desmarcar tarea
                task.completed = false;
                this.userData.points -= task.xp;
            } else {
                // Intentar marcar tarea
                if (completedTasks >= 1) {
                    // Mostrar easter egg warning
                    this.showEasterEggWarning();
                    return;
                } else {
                    // Marcar tarea
                    task.completed = true;
                    this.userData.points += task.xp;
                }
            }
            
            // Guardar en localStorage
            localStorage.setItem('userData', JSON.stringify(this.userData));
            
            // Verificar si se completó el planeta
            this.checkPlanetCompletion(planetId);
            
            // Actualizar UI
            this.updateUserInterface();
            this.updateRoadmapProgress();
            this.openPlanetModal(planetId); // Recargar modal
        }
    }
    
    showEasterEggWarning() {
        const warning = document.getElementById('easterEggWarning');
        warning.style.display = 'block';
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            warning.style.display = 'none';
        }, 3000);
    }

    checkPlanetCompletion(planetId) {
        const planetData = this.pythonRoadmap[planetId];
        const allTasksCompleted = planetData.tasks.every(task => task.completed);
        
        if (allTasksCompleted && planetData.status !== 'completed') {
            planetData.status = 'completed';
            
            // Desbloquear siguiente planeta
            this.unlockNextPlanet(planetId);
        }
    }

    unlockNextPlanet(completedPlanetId) {
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        const currentIndex = planetOrder.indexOf(completedPlanetId);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < planetOrder.length) {
            const nextPlanetId = planetOrder[nextIndex];
            this.pythonRoadmap[nextPlanetId].status = 'in-progress';
            
            // Actualizar UI
            this.renderRoadmap();
        }
    }

    closePlanetModal() {
        const modal = document.getElementById('planetModal');
        modal.classList.remove('active');
        this.currentPlanetId = null;
    }

    startPlanetLearning() {
        if (this.currentPlanetId) {
            // Aquí iría la lógica para comenzar el aprendizaje del planeta
            alert(`¡Comenzando aprendizaje de ${this.pythonRoadmap[this.currentPlanetId].name}!`);
            this.closePlanetModal();
        }
    }

    getStatusText(status) {
        const statusMap = {
            'completed': 'Completado',
            'in-progress': 'En Progreso',
            'locked': 'Bloqueado'
        };
        return statusMap[status] || status;
    }

    openNoteModal(note = null) {
        const modal = document.getElementById('noteModal');
        const titleInput = document.getElementById('noteTitle');
        const modalTitle = document.getElementById('modalTitle');

        if (note) {
            modalTitle.textContent = 'Editar Nota';
            titleInput.value = note.title;
            this.quillEditor.root.innerHTML = note.content;
            this.currentEditingNote = note;
        } else {
            modalTitle.textContent = 'Nueva Nota';
            titleInput.value = '';
            this.quillEditor.setText('');
            this.currentEditingNote = null;
        }

        modal.classList.add('active');
    }

    closeNoteModal() {
        const modal = document.getElementById('noteModal');
        modal.classList.remove('active');
        this.currentEditingNote = null;
    }

    async saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = this.quillEditor.root.innerHTML;
        const tags = document.getElementById('noteTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (!title) {
            alert('Por favor ingresa un título para la nota');
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            
            if (this.currentEditingNote) {
                // Editar nota existente
                const response = await fetch(`http://localhost:3000/api/notes/${this.currentEditingNote.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        tags
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la nota');
                }

                // Actualizar la nota local
                this.currentEditingNote.title = title;
                this.currentEditingNote.content = content;
                this.currentEditingNote.tags = tags;
                this.currentEditingNote.updatedAt = new Date().toISOString();
                
            } else {
                // Crear nueva nota
                const response = await fetch('http://localhost:3000/api/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        title,
                        content,
                        tags
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al crear la nota');
                }

                const result = await response.json();
                
                // Agregar la nueva nota al array local
                const newNote = {
                    id: result.data.note_id,
                    title,
                    content,
                    tags,
                    createdAt: result.data.created_at,
                    updatedAt: result.data.updated_at
                };
                this.notes.unshift(newNote);
            }

            // Guardar en localStorage como respaldo
            const userId = this.userData.id;
            localStorage.setItem(`userNotes_${userId}`, JSON.stringify(this.notes));
            
            this.renderNotes();
            this.closeNoteModal();
            
        } catch (error) {
            console.error('Error al guardar la nota:', error);
            alert(`Error al guardar la nota: ${error.message}`);
        }
    }

    editNote(note) {
        this.openNoteModal(note);
    }

    async deleteNote(noteId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota? Esta acción no se puede deshacer.')) {
            try {
                const authToken = localStorage.getItem('authToken');
                
                const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la nota');
                }

                // Eliminar la nota del array local
                this.notes = this.notes.filter(note => note.id !== noteId);
                
                // Guardar en localStorage como respaldo
                const userId = this.userData.id;
                localStorage.setItem(`userNotes_${userId}`, JSON.stringify(this.notes));
                
                this.renderNotes();
                console.log('Nota eliminada exitosamente');
                
            } catch (error) {
                console.error('Error al eliminar la nota:', error);
                alert(`Error al eliminar la nota: ${error.message}`);
            }
        }
    }

    openResourceModal(resource) {
        const modal = document.getElementById('resourceModal');
        const videoFrame = document.getElementById('videoFrame');
        const resourceTitle = document.getElementById('resourceTitle');

        resourceTitle.textContent = resource.title;
        videoFrame.src = resource.url;

        modal.classList.add('active');
    }

    closeResourceModal() {
        const modal = document.getElementById('resourceModal');
        const videoFrame = document.getElementById('videoFrame');
        
        videoFrame.src = '';
        modal.classList.remove('active');
    }

    renderDashboard() {
        // El dashboard se renderiza automáticamente con el HTML
        // Solo necesitamos actualizar datos dinámicos
        this.updateUserInterface();
    }

    logout() {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('loginTimestamp');
        sessionStorage.clear();
        
        window.location.href = 'login.html';
    }

    async deleteAccount() {
        if (!confirm('¿Estás completamente seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y se perderán todos tus datos, notas y progreso.')) {
            return;
        }

        if (!confirm('ÚLTIMA ADVERTENCIA: ¿Realmente quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            const userData = JSON.parse(localStorage.getItem('userData'));
            
            // Llamar a la API para eliminar la cuenta
            const response = await fetch(`http://localhost:3000/api/users/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    userId: userData.id,
                    email: userData.email
                })
            });

            if (response.ok) {
                // Limpiar todos los datos del usuario
                const userId = userData.id;
                localStorage.removeItem(`userNotes_${userId}`);
                localStorage.removeItem('userData');
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('loginTimestamp');
                sessionStorage.clear();
                
                alert('Tu cuenta ha sido eliminada exitosamente. Gracias por usar Vmind.');
                window.location.href = 'index.html';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar la cuenta');
            }
            
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(`Error al eliminar la cuenta: ${error.message}`);
        }
    }

    async loadUserTasksFromDatabase() {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:3000/api/tasks/user/roadmap-tasks', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las tareas desde la base de datos');
            }

            const result = await response.json();
            const userTasks = result.data;

            // Sincronizar el estado de las tareas con la base de datos
            this.syncTasksWithDatabase(userTasks);

        } catch (error) {
            console.error('Error al cargar tareas desde la base de datos:', error);
            // Si hay error, usar el estado local como respaldo
        }
    }

    syncTasksWithDatabase(userTasks) {
        // Mapear las tareas de la base de datos a los planetas del roadmap
        userTasks.forEach(dbTask => {
            // Buscar en qué planeta está esta tarea basándose en el level_title
            for (const planetId in this.pythonRoadmap) {
                const planet = this.pythonRoadmap[planetId];
                const matchingTask = planet.tasks.find(t => t.title === dbTask.title);
                
                if (matchingTask) {
                    // Actualizar el estado de la tarea
                    matchingTask.completed = dbTask.user_status === 'completed';
                    
                    // Si la tarea está completada, agregar los puntos al usuario
                    if (matchingTask.completed && !matchingTask.wasCompletedBefore) {
                        this.userData.points += matchingTask.xp;
                        matchingTask.wasCompletedBefore = true;
                    }
                }
            }
        });

        // Actualizar la UI con los datos sincronizados
        this.updateUserInterface();
        this.updateRoadmapProgress();
    }

    applySurveyPersonalization() {
        const surveyData = localStorage.getItem('userSurveyData');
        if (!surveyData) return;

        try {
            const survey = JSON.parse(surveyData);
            console.log('Aplicando personalización basada en encuesta:', survey);

            // Personalizar roadmap basado en el nivel de experiencia
            this.personalizeRoadmapByExperience(survey.experience);
            
            // Personalizar roadmap basado en el área de interés
            this.personalizeRoadmapByArea(survey.area);
            
            // Personalizar roadmap basado en el ritmo de aprendizaje
            this.personalizeRoadmapByPace(survey.pace);
            
            // Actualizar la UI
            this.renderRoadmap();
            this.updateRoadmapProgress();
            
        } catch (error) {
            console.error('Error al aplicar personalización:', error);
        }
    }

    personalizeRoadmapByExperience(experience) {
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        
        switch (experience) {
            case 'beginner':
                // Para principiantes, solo el primer planeta está desbloqueado
                this.pythonRoadmap.fundamentals.status = 'in-progress';
                this.pythonRoadmap['control-flow'].status = 'locked';
                break;
                
            case 'intermediate':
                // Para intermedios, los primeros 3 planetas están desbloqueados
                this.pythonRoadmap.fundamentals.status = 'completed';
                this.pythonRoadmap['control-flow'].status = 'in-progress';
                this.pythonRoadmap['data-structures'].status = 'in-progress';
                break;
                
            case 'advanced':
                // Para avanzados, los primeros 5 planetas están desbloqueados
                this.pythonRoadmap.fundamentals.status = 'completed';
                this.pythonRoadmap['control-flow'].status = 'completed';
                this.pythonRoadmap['data-structures'].status = 'in-progress';
                this.pythonRoadmap.functions.status = 'in-progress';
                this.pythonRoadmap.oop.status = 'in-progress';
                break;
        }
    }

    personalizeRoadmapByArea(area) {
        // Personalizar contenido basado en el área de interés
        switch (area) {
            case 'web':
                // Enfocar en desarrollo web
                this.pythonRoadmap.web.status = 'in-progress';
                this.pythonRoadmap.web.description = 'Crea aplicaciones web modernas con Python';
                break;
                
            case 'data':
                // Enfocar en data science
                this.pythonRoadmap['data-science'].status = 'in-progress';
                this.pythonRoadmap['data-science'].description = 'Analiza y visualiza datos con Python';
                break;
                
            case 'mobile':
                // Enfocar en desarrollo móvil (aunque Python no es ideal para esto)
                this.pythonRoadmap.web.description = 'Crea APIs para aplicaciones móviles';
                break;
                
            case 'general':
                // Mantener enfoque general
                break;
        }
    }

    personalizeRoadmapByPace(pace) {
        // Ajustar la cantidad de tareas por planeta basado en el ritmo
        const planetOrder = ['fundamentals', 'control-flow', 'data-structures', 'functions', 'oop', 'modules', 'exceptions', 'file-io', 'web', 'data-science'];
        
        planetOrder.forEach(planetId => {
            const planet = this.pythonRoadmap[planetId];
            
            switch (pace) {
                case 'fast':
                    // Ritmo rápido: más tareas, más XP
                    planet.tasks.forEach(task => {
                        task.xp = Math.floor(task.xp * 1.5);
                    });
                    break;
                    
                case 'balanced':
                    // Ritmo equilibrado: mantener valores por defecto
                    break;
                    
                case 'relaxed':
                    // Ritmo tranquilo: menos tareas, menos XP
                    planet.tasks.forEach(task => {
                        task.xp = Math.floor(task.xp * 0.8);
                    });
                    break;
            }
        });
    }

    retakeSurvey() {
        if (confirm('¿Te gustaría volver a tomar la encuesta de caracterización? Esto actualizará tu roadmap personalizado.')) {
            // Limpiar datos de la encuesta anterior
            localStorage.removeItem('surveyCompleted');
            localStorage.removeItem('userSurveyData');
            
            // Redirigir a la encuesta
            window.location.href = 'survey.html';
        }
    }

    getPersonalizedMessage(survey) {
        const messages = {
            beginner: {
                employment: {
                    text: "Cada línea de código te acerca más a tu primer trabajo en programación. ¡Tú puedes!",
                    author: "- Tu roadmap personalizado"
                },
                hobby: {
                    text: "La programación es como un juego donde tú creas las reglas. ¡Diviértete aprendiendo!",
                    author: "- Tu roadmap personalizado"
                },
                entrepreneurship: {
                    text: "Los mejores emprendedores tecnológicos empezaron con una línea de código. ¡Tú eres el siguiente!",
                    author: "- Tu roadmap personalizado"
                },
                academic: {
                    text: "El conocimiento es poder. Cada concepto que aprendas te hará más fuerte.",
                    author: "- Tu roadmap personalizado"
                }
            },
            intermediate: {
                employment: {
                    text: "Ya tienes una base sólida. Ahora es momento de especializarte y destacar.",
                    author: "- Tu roadmap personalizado"
                },
                hobby: {
                    text: "Con tu experiencia, puedes crear proyectos cada vez más interesantes.",
                    author: "- Tu roadmap personalizado"
                },
                entrepreneurship: {
                    text: "Tu conocimiento técnico es el cimiento perfecto para tu startup.",
                    author: "- Tu roadmap personalizado"
                },
                academic: {
                    text: "Estás construyendo una base sólida para la investigación y el desarrollo.",
                    author: "- Tu roadmap personalizado"
                }
            },
            advanced: {
                employment: {
                    text: "Eres un experto. Ahora es momento de liderar y enseñar a otros.",
                    author: "- Tu roadmap personalizado"
                },
                hobby: {
                    text: "Con tu nivel, puedes contribuir a proyectos open source y crear herramientas increíbles.",
                    author: "- Tu roadmap personalizado"
                },
                entrepreneurship: {
                    text: "Tu expertise técnico te da una ventaja competitiva enorme en el mercado.",
                    author: "- Tu roadmap personalizado"
                },
                academic: {
                    text: "Estás en la vanguardia del conocimiento. ¡Puedes innovar y descubrir!",
                    author: "- Tu roadmap personalizado"
                }
            }
        };

        const experience = survey.experience || 'beginner';
        const objective = survey.objective || 'hobby';
        
        return messages[experience][objective] || {
            text: "Tu roadmap personalizado está listo para llevarte al siguiente nivel.",
            author: "- V-Mind"
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
