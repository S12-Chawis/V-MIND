# 🔐 Credenciales de Prueba - Vmind

## 👥 Usuarios Predefinidos

### 1. Usuario Demo
- **Usuario/Email**: `demo`
- **Contraseña**: `demo123`
- **Nombre**: Demo User
- **XP**: 1,250
- **Racha**: 7 días
- **Nivel**: Explorador 🪐

### 2. Usuario Test
- **Usuario/Email**: `test`
- **Contraseña**: `test123`
- **Nombre**: Test User
- **XP**: 850
- **Racha**: 3 días
- **Nivel**: Explorador 🪐

### 3. Usuario Admin
- **Usuario/Email**: `admin`
- **Contraseña**: `admin123`
- **Nombre**: Admin User
- **XP**: 2,500
- **Racha**: 15 días
- **Nivel**: Viajero 🌍

## 🚀 Cómo Usar

### Para Login:
1. Ve a `login.html`
2. Usa cualquiera de las credenciales arriba
3. Serás redirigido al dashboard

### Para Registro:
1. Ve a `register.html`
2. Crea una nueva cuenta
3. Los datos se guardan en localStorage
4. Puedes usar la nueva cuenta para login

## 📝 Notas Importantes

- **Los datos se guardan en localStorage** del navegador
- **Los usuarios predefinidos están siempre disponibles**
- **Puedes crear nuevos usuarios** que se agregarán a la lista
- **Para limpiar datos**: Usa el botón "Cerrar sesión" o limpia localStorage

## 🔧 Funcionalidades Implementadas

✅ **Sistema de login** con validación
✅ **Sistema de registro** con validación
✅ **Persistencia de datos** en localStorage
✅ **Redirección automática** al dashboard
✅ **Protección de rutas** (dashboard requiere login)
✅ **Cerrar sesión** funcional
✅ **Usuarios de prueba** predefinidos

## 🎯 Flujo Completo

1. **Registro** → Crear cuenta nueva
2. **Login** → Iniciar sesión con credenciales
3. **Dashboard** → Ver información del usuario
4. **Logout** → Cerrar sesión y limpiar datos
