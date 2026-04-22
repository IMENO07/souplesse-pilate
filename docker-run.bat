@echo off
setlocal

:: Configuration for local development using Docker
:: This script starts the database and the application in separate containers

echo 🐳 Starting Souplesse Pilates Local Environment (Docker)...

:: Check for docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Docker is not installed or not in PATH.
    pause
    exit /b 1
)

:: Set profile (default to 'seed-running' if not provided)
set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=seed-running
echo 🔧 Using profile: %PROFILE%

:: Use 'docker compose' (modern)
echo 🚀 Building and starting containers...
set SPRING_PROFILES_ACTIVE=%PROFILE%
docker compose -f docker-compose.local.yml up --build -d

echo ----------------------------------------------------
echo ✅ Local environment is starting!
echo 📱 App will be available at: http://localhost:8081
echo 🗄️ Database is mapped to port: 5434
echo ----------------------------------------------------
echo 💡 To see logs, run: docker compose -f docker-compose.local.yml logs -f
echo 💡 To stop, run: docker compose -f docker-compose.local.yml down
echo ----------------------------------------------------

pause
endlocal
