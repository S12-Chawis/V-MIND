// ===== USUARIOS DE PRUEBA =====

// Usuarios predefinidos para pruebas
const TEST_USERS = [
    {
        id: 1,
        username: 'demo',
        email: 'demo@vmind.com',
        password: 'demo123',
        name: 'Demo User',
        age: 25,
        points: 1250,
        streak: 7,
        level: 'Explorador',
        planet: '🪐',
        createdAt: '2024-01-15'
    },
    {
        id: 2,
        username: 'test',
        email: 'test@vmind.com',
        password: 'test123',
        name: 'Test User',
        age: 30,
        points: 850,
        streak: 3,
        level: 'Explorador',
        planet: '🪐',
        createdAt: '2024-01-20'
    },
    {
        id: 3,
        username: 'admin',
        email: 'admin@vmind.com',
        password: 'admin123',
        name: 'Admin User',
        age: 28,
        points: 2500,
        streak: 15,
        level: 'Viajero',
        planet: '🌍',
        createdAt: '2024-01-10'
    }
];

// Función para obtener usuarios desde localStorage
function getUsers() {
    const users = localStorage.getItem('vmind_users');
    return users ? JSON.parse(users) : TEST_USERS;
}

// Función para guardar usuarios en localStorage
function saveUsers(users) {
    localStorage.setItem('vmind_users', JSON.stringify(users));
}

// Función para agregar un nuevo usuario
function addUser(userData) {
    const users = getUsers();
    const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        password: userData.password,
        name: userData.name,
        age: userData.age,
        points: 0,
        streak: 0,
        level: 'Explorador',
        planet: '🪐',
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    saveUsers(users);
    return newUser;
}

// Función para verificar credenciales
function verifyCredentials(username, password) {
    const users = getUsers();
    return users.find(user => 
        (user.username === username || user.email === username) && 
        user.password === password
    );
}

// Función para verificar si un usuario existe
function userExists(username, email) {
    const users = getUsers();
    return users.some(user => 
        user.username === username || user.email === email
    );
}

// Función para obtener usuario por ID
function getUserById(id) {
    const users = getUsers();
    return users.find(user => user.id === id);
}

// Función para actualizar usuario
function updateUser(userId, updates) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        saveUsers(users);
        return users[userIndex];
    }
    
    return null;
}

// Exportar funciones para uso en otros archivos
window.TestUsers = {
    getUsers,
    saveUsers,
    addUser,
    verifyCredentials,
    userExists,
    getUserById,
    updateUser,
    TEST_USERS
};
