@echo off
:: Enable UTF-8 for emojis
chcp 65001 >nul
setlocal

:: Internal parameter for jumping to specific mode (used by run.ps1 or other scripts)
if "%1"=="1" goto mode_docker_full
if "%1"=="2" goto mode_docker_db
if "%1"=="3" goto mode_native
if "%1"=="4" goto mode_portable
if "%1"=="5" goto mode_cleanup

:header
cls
echo ==========================================
echo Souplesse Pilates - Unified Launcher
echo ==========================================
echo.

:: 1. Initialize .env if missing
if not exist .env (
    if exist .env.example (
        echo [INFO] Creating .env from .env.example...
        copy .env.example .env >nul
    )
)

:choose_mode
echo Choose Running Mode:
echo [1] Docker Mode (Full Stack: App + DB in Docker)
echo [2] Hybrid Mode (DB in Docker, App runs Natively)
echo [3] Native Mode (Use your local PostgreSQL/pgAdmin)
echo [4] Cleanup (Stop everything and reset data)
echo [Q] Quit
echo.
set /p "MODE=Select mode (1-4) [Default=1]: "

if "%MODE%"=="" set "MODE=1"
if /i "%MODE%"=="q" exit /b 0

if "%MODE%"=="1" goto mode_docker_full
if "%MODE%"=="2" goto mode_docker_db
if "%MODE%"=="3" goto mode_native
if "%MODE%"=="4" goto mode_cleanup
goto choose_mode

:mode_docker_full
echo.
echo [RUN] Starting FULL STACK DOCKER...
call "%~dp0scripts\docker-run.bat"
goto end

:mode_docker_db
echo.
echo [RUN] Starting HYBRID MODE (DB in Docker)...

:: Find a free port using PowerShell
for /f %%a in ('powershell -Command "$s=[System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any,0);$s.Start();$s.LocalEndpoint.Port;$s.Stop()"') do set DB_PORT=%%a
echo [INFO] Assigned dynamic DB port: %DB_PORT%

docker compose -f docker-compose.local.yml up -d db
if %errorlevel% neq 0 (
    echo [ERROR] Failed to start Docker DB. Check your Docker permissions.
    pause
    goto choose_mode
)

:: Pass the dynamic port to the Spring Boot application
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=seed-running -Dspring.datasource.url=jdbc:postgresql://localhost:%DB_PORT%/souplesse_pilates
goto end

:mode_native
echo.
echo [RUN] Starting in NATIVE MODE (Local PostgreSQL)...
echo [TIP] Ensure your local PostgreSQL is running on port 5432.
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=seed-running
goto end


:mode_cleanup
echo.
call "%~dp0scripts\clean.bat"
goto choose_mode

:end
echo.
echo 👋 Exiting Souplesse Launcher.
pause
endlocal
