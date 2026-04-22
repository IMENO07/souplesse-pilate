@echo off
chcp 65001 >nul
setlocal

:: Configuration for local development using Docker
:: This script starts the database and the application in separate containers

echo Starting Souplesse Pilates Local Environment (Docker)...

:: Check for docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed or not in PATH.
    pause
    exit /b 1
)

:: Set profile (default to 'seed-running' if not provided)
set PROFILE=%1
if "%PROFILE%"=="" set PROFILE=seed-running
echo [INFO] Using profile: %PROFILE%

:: Use 'docker compose' (modern)
echo [RUN] Building and starting containers...
set SPRING_PROFILES_ACTIVE=%PROFILE%
docker compose -f docker-compose.local.yml up --build -d

echo ----------------------------------------------------
echo [OK] Local environment is starting!
echo [INFO] App will be available at: http://localhost:8081
echo [INFO] Database is mapped to port: 5434
echo ----------------------------------------------------
echo [TIP] To see logs, run: docker compose -f docker-compose.local.yml logs -f
echo [TIP] To stop, run: docker compose -f docker-compose.local.yml down
echo ----------------------------------------------------

pause
endlocal
