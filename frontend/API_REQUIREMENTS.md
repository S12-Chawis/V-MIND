# 🔌 Requisitos de API para el Backend

## Documentación para el Desarrollador Backend

El frontend ya está preparado para conectarse con una base de datos SQL. Esta documentación especifica exactamente qué endpoints y estructura de datos necesita el sistema.

## 🛠️ Configuración Automática de URLs

El sistema detecta automáticamente el entorno:

- **Desarrollo**: `http://localhost:3000`
- **Staging**: `https://api-staging.vmind.com`
- **Producción**: `https://api.vmind.com`

> **Nota**: Puedes cambiar estas URLs en `js/api-config.js`

---

## 🔐 **Endpoint de Login**

### `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "string",  // Puede ser username o email
  "password": "string"
}
```

**Response Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number|string",
      "username": "string",
      "email": "string",
      "name": "string",           // Opcional - nombre completo
      "avatar": "string",         // Opcional - URL de avatar
      "role": "string",           // Opcional - rol del usuario
      "created_at": "string",     // Opcional - ISO date
      "last_login": "string"      // Opcional - ISO date
    },
    "token": "string",            // JWT token
    "refreshToken": "string",     // Opcional - para renovar token
    "expiresIn": "number"         // Opcional - segundos hasta expiración
  },
  "message": "Login exitoso"
}
```

**Response de Error (400/401/422):**
```json
{
  "success": false,
  "message": "Mensaje de error principal",
  "errors": {                    // Opcional - errores específicos por campo
    "username": ["El usuario es requerido"],
    "password": ["La contraseña debe tener al menos 6 caracteres"]
  }
}
```

**Códigos de Estado Esperados:**
- `200` - Login exitoso
- `400` - Datos inválidos
- `401` - Credenciales incorrectas
- `422` - Errores de validación
- `423` - Cuenta bloqueada
- `429` - Demasiados intentos
- `451` - Cuenta suspendida

---

## 📋 **Esquema de Base de Datos Sugerido**

### Tabla `users`
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Usar bcrypt
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
```

### Tabla `login_attempts` (Opcional - para seguridad)
```sql
CREATE TABLE login_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ip_address VARCHAR(45) NOT NULL,
    email VARCHAR(255),
    username VARCHAR(50),
    success BOOLEAN DEFAULT FALSE,
    user_agent TEXT,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ip_attempted (ip_address, attempted_at),
    INDEX idx_email_attempted (email, attempted_at),
    INDEX idx_success (success)
);
```

---

## 🔒 **Lógica de Autenticación Recomendada**

### 1. **Validación de Entrada**
```javascript
// Ejemplo en Node.js con express-validator
const { body, validationResult } = require('express-validator');

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
```

### 2. **Búsqueda de Usuario**
```sql
-- El frontend puede enviar username o email en el campo "username"
SELECT * FROM users 
WHERE (username = ? OR email = ?) 
AND locked_until IS NULL OR locked_until < NOW()
```

### 3. **Verificación de Contraseña**
```javascript
const bcrypt = require('bcrypt');

const isValidPassword = await bcrypt.compare(password, user.password_hash);
```

### 4. **Manejo de Intentos Fallidos**
```sql
-- Incrementar intentos fallidos
UPDATE users 
SET failed_login_attempts = failed_login_attempts + 1,
    locked_until = CASE 
        WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 30 MINUTE)
        ELSE locked_until 
    END
WHERE id = ?;
```

### 5. **Login Exitoso**
```sql
-- Resetear intentos y actualizar último login
UPDATE users 
SET failed_login_attempts = 0,
    locked_until = NULL,
    last_login_at = NOW()
WHERE id = ?;
```

### 6. **Generación de JWT**
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { 
        userId: user.id, 
        username: user.username,
        role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
```

---

## 🛡️ **Medidas de Seguridad Implementadas**

El frontend ya maneja:

✅ **Rate Limiting**: Desactiva formulario por 5 minutos en error 429
✅ **Cuenta Bloqueada**: Mensaje específico para error 423
✅ **Cuenta Suspendida**: Mensaje específico para error 451
✅ **Validación en Tiempo Real**: Verifica formato antes de enviar
✅ **Almacenamiento Seguro**: Tokens en localStorage con timestamp
✅ **Auto-refresh**: Soporte para refresh tokens
✅ **Redirección Segura**: Maneja URLs de redirección post-login

---

## 🔄 **Endpoint de Registro**

### `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "name": "string",
  // Datos del wizard inmersivo
  "intereses": ["string"],      // Array de IDs de intereses
  "nivel": "number",            // 1-5
  "objetivo": "string",         // Objetivo de aprendizaje
  "ritmo": "string"            // "rapido", "equilibrado", "tranquilo"
}
```

**Response Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "number|string",
      "username": "string",
      "email": "string",
      "name": "string",
      "intereses": ["string"],
      "nivel": "number",
      "objetivo": "string",
      "ritmo": "string",
      "created_at": "string"
    },
    "token": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  },
  "message": "Cuenta creada exitosamente"
}
```

**Response de Error (400/409/422):**
```json
{
  "success": false,
  "message": "Mensaje de error principal",
  "errors": {
    "username": ["El nombre de usuario ya está en uso"],
    "email": ["El email ya está registrado"],
    "password": ["La contraseña debe tener al menos 6 caracteres"]
  }
}
```

**Códigos de Estado Esperados:**
- `201` - Registro exitoso
- `400` - Datos inválidos
- `409` - Usuario o email ya existe
- `422` - Errores de validación

---

## 🔄 **Endpoints Adicionales (Preparados)**

El frontend ya está configurado para estos endpoints adicionales:

### `POST /api/auth/logout`
```json
{
  "token": "string"  // Token a invalidar
}
```

### `POST /api/auth/refresh`
```json
{
  "refreshToken": "string"
}
```

### `POST /api/auth/forgot-password`
```json
{
  "email": "string"
}
```

### `POST /api/auth/reset-password`
```json
{
  "token": "string",
  "password": "string"
}
```

---

## 🧪 **Modo Demo**

Para desarrollo, el frontend incluye un método demo:

```javascript
// En login.js - cambiar esta línea:
const result = await this.performLogin(formData);        // Producción
const result = await this.performLoginDemo(formData);    // Demo

// Credenciales demo: usuario "demo", contraseña "demo123"
```

---

## ⚡ **Configuración Rápida**

### 1. **Variables de Entorno Backend**
```env
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=3306
DB_NAME=vmind
DB_USER=usuario
DB_PASS=contraseña
```

### 2. **Headers CORS Necesarios**
```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'https://vmind.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. **Middleware de Autenticación**
```javascript
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
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
```

---

## 🎯 **Checklist para el Backend**

- [ ] Crear tabla `users` con el esquema sugerido
- [ ] Implementar endpoint `POST /api/auth/login`
- [ ] Configurar bcrypt para hash de contraseñas
- [ ] Implementar JWT con expiración
- [ ] Agregar validación de entrada
- [ ] Implementar rate limiting
- [ ] Configurar CORS correctamente
- [ ] Manejar códigos de error específicos
- [ ] Agregar logging de intentos de login
- [ ] Implementar bloqueo de cuentas por intentos fallidos

---

## 📞 **Soporte**

El frontend está completamente preparado y probado. Solo necesita que el backend implemente el endpoint `/api/auth/login` con la estructura de respuesta especificada.

**¡Todo está listo para la integración!** 🚀
