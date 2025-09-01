# 💻 Ejemplo de Implementación Backend

## Ejemplo completo para Node.js + Express + MySQL

Este es un ejemplo funcional que puedes usar como base para implementar el backend.

## 📦 **Dependencias Necesarias**

```bash
npm install express mysql2 bcryptjs jsonwebtoken express-validator helmet cors dotenv express-rate-limit
```

## 🔧 **Configuración Básica**

### `server.js`
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting global
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por IP
    message: {
        success: false,
        message: 'Demasiadas solicitudes, intenta de nuevo más tarde.'
    }
});
app.use(limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### `.env`
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vmind
DB_USER=root
DB_PASS=password

# JWT
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-de-al-menos-32-caracteres
JWT_EXPIRES_IN=24h

# Frontend
FRONTEND_URL=http://localhost:3000

# Configuración de seguridad
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=30
```

## 🗄️ **Configuración de Base de Datos**

### `config/database.js`
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
});

module.exports = pool;
```

### `schema.sql`
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS vmind CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vmind;

-- Tabla de usuarios
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar VARCHAR(500),
    role ENUM('user', 'admin', 'premium') DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_failed_attempts (failed_login_attempts),
    INDEX idx_locked_until (locked_until)
);

-- Tabla de intentos de login (opcional)
CREATE TABLE login_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45) NOT NULL,
    email VARCHAR(255),
    username VARCHAR(50),
    success BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ip_attempted (ip_address, attempted_at),
    INDEX idx_email_attempted (email, attempted_at)
);

-- Usuario de prueba (password: demo123)
INSERT INTO users (username, email, password_hash, name) VALUES 
('demo', 'demo@vmind.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJL9w8OJG', 'Usuario Demo');
```

## 🔐 **Implementación del Login**

### `routes/auth.js`
```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const db = require('../config/database');
const router = express.Router();

// Rate limiting específico para login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.'
    }
});

// Validaciones
const loginValidation = [
    body('username')
        .notEmpty()
        .withMessage('El usuario o email es requerido')
        .isLength({ min: 3 })
        .withMessage('Debe tener al menos 3 caracteres'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Endpoint de login
router.post('/login', loginLimiter, loginValidation, async (req, res) => {
    try {
        // Verificar validaciones
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errors.mapped()
            });
        }

        const { username, password } = req.body;
        const ipAddress = req.ip;
        const userAgent = req.get('User-Agent');

        // Buscar usuario por username o email
        const [users] = await db.execute(
            'SELECT * FROM users WHERE (username = ? OR email = ?) AND (locked_until IS NULL OR locked_until < NOW())',
            [username, username]
        );

        // Registrar intento de login
        await db.execute(
            'INSERT INTO login_attempts (ip_address, email, username, success, user_agent) VALUES (?, ?, ?, ?, ?)',
            [ipAddress, username.includes('@') ? username : null, username.includes('@') ? null : username, false, userAgent]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const user = users[0];

        // Verificar si la cuenta está bloqueada
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(423).json({
                success: false,
                message: 'Cuenta bloqueada temporalmente por múltiples intentos fallidos'
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            // Incrementar intentos fallidos
            const newAttempts = user.failed_login_attempts + 1;
            const lockUntil = newAttempts >= 5 ? 
                new Date(Date.now() + 30 * 60 * 1000) : null; // 30 minutos

            await db.execute(
                'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?',
                [newAttempts, lockUntil, user.id]
            );

            const message = newAttempts >= 5 ? 
                'Cuenta bloqueada por múltiples intentos fallidos' :
                'Usuario o contraseña incorrectos';

            return res.status(401).json({
                success: false,
                message: message
            });
        }

        // Login exitoso - resetear intentos y actualizar último login
        await db.execute(
            'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?',
            [user.id]
        );

        // Actualizar registro de intento exitoso
        await db.execute(
            'UPDATE login_attempts SET success = TRUE WHERE ip_address = ? AND attempted_at >= DATE_SUB(NOW(), INTERVAL 1 MINUTE) ORDER BY id DESC LIMIT 1',
            [ipAddress]
        );

        // Generar JWT
        const token = jwt.sign(
            {
                userId: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Respuesta exitosa
        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                    last_login: user.last_login_at
                },
                token: token,
                expiresIn: 24 * 60 * 60 // 24 horas en segundos
            },
            message: 'Login exitoso'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;
```

## 🛡️ **Middleware de Autenticación**

### `middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de acceso requerido'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
```

## 🧪 **Probando la Implementación**

### 1. **Instalar y configurar**
```bash
npm install
# Configurar .env con tus datos de BD
# Ejecutar schema.sql en tu base de datos
npm start
```

### 2. **Probar con curl**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'
```

### 3. **Respuesta esperada**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "demo",
      "email": "demo@vmind.com",
      "name": "Usuario Demo",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  },
  "message": "Login exitoso"
}
```

## 🔄 **Integración con el Frontend**

Una vez implementado el backend:

1. **Cambiar en `login.js`:**
```javascript
// Cambiar esta línea:
const result = await this.performLoginDemo(formData);  // ← Quitar
// Por esta:
const result = await this.performLogin(formData);      // ← Usar
```

2. **Verificar URL en `api-config.js`:**
```javascript
// Asegurarse que la URL base sea correcta
getBaseURL() {
    if (hostname === 'localhost') {
        return 'http://localhost:3000';  // ← Tu puerto del backend
    }
    // ...
}
```

## ✅ **¡Listo!**

Con esta implementación, tu frontend se conectará automáticamente con la base de datos SQL y tendrás un sistema de autenticación completo y seguro.

**El frontend ya está 100% preparado para esta integración.** 🚀

