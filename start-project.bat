@echo off
echo ========================================
echo    CONFIGURACION RAPIDA DE VMIND
echo ========================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo [2/5] Instalando dependencias del backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del backend
    pause
    exit /b 1
)
echo ✅ Dependencias del backend instaladas

echo.
echo [3/5] Instalando dependencias del frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: No se pudieron instalar las dependencias del frontend
    pause
    exit /b 1
)
echo ✅ Dependencias del frontend instaladas

echo.
echo [4/5] Verificando archivo .env...
cd ..\backend
if not exist .env (
    echo ⚠️  Archivo .env no encontrado
    echo Creando archivo .env con configuración por defecto...
    echo # Database Configuration > .env
    echo DB_HOST=localhost >> .env
    echo DB_USER=root >> .env
    echo DB_PASSWORD=tu_contraseña_aqui >> .env
    echo DB_NAME=crisalida >> .env
    echo DB_PORT=3306 >> .env
    echo. >> .env
    echo # Server Configuration >> .env
    echo PORT=3000 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # JWT Configuration >> .env
    echo JWT_SECRET=vmind_super_secret_jwt_key_2024 >> .env
    echo JWT_EXPIRES_IN=24h >> .env
    echo. >> .env
    echo # CORS Configuration >> .env
    echo CORS_ORIGIN=http://localhost:5173 >> .env
    echo.
    echo ⚠️  IMPORTANTE: Edita el archivo backend\.env y cambia tu contraseña de MySQL
    echo.
) else (
    echo ✅ Archivo .env encontrado
)

echo.
echo [5/5] Iniciando servidores...
echo.
echo 🚀 Iniciando backend en http://localhost:3000
echo 🎨 Iniciando frontend en http://localhost:5173
echo.
echo Presiona Ctrl+C para detener los servidores
echo.

start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo    ¡CONFIGURACION COMPLETADA!
echo ========================================
echo.
echo 📋 Próximos pasos:
echo 1. Asegúrate de que MySQL esté ejecutándose
echo 2. Ejecuta el script SQL para crear la base de datos
echo 3. Edita backend\.env con tu contraseña de MySQL
echo 4. Ejecuta: cd backend && npm run test:db
echo 5. Ejecuta: cd backend && npm run seed:data
echo 6. Ve a http://localhost:5173 para usar la aplicación
echo.
echo 🔑 Credenciales de prueba (después de seed:data):
echo    juan@example.com / password123
echo    maria@example.com / password123
echo    admin@vmind.com / admin123
echo.
pause
