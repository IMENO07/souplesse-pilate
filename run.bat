@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo 🕊️  Souplesse Pilates - Launcher
echo ==========================================

:: 1. Initialize .env if missing
if not exist .env (
    if exist .env.example (
        echo 📝 Creating .env from .env.example...
        copy .env.example .env >nul
    )
)

:: 2. Load environment variables
if exist .env (
    for /f "usebackq tokens=*" %%a in (`findstr /v "^#" .env`) do (
        set %%a
    )
)

:: 3. Check for Java 21
call check-env.bat
if "!ENV_JAVA_OK!"=="1" goto choose_mode

echo.
echo ⚠️  Java 21+ is required but not found in your PATH.
if not exist ".jdk" goto download_jdk

echo ✅ Using portable JDK found in .jdk
for /d %%d in ("%~dp0.jdk\*") do (
    if exist "%%d\bin\java.exe" (
        set "JAVA_HOME=%%d"
        set "PATH=%%d\bin;!PATH!"
        goto choose_mode
    )
)

:download_jdk
echo 📥 Java 21 not found. I can download it for you.
set /p "DOWNLOAD=Download portable JDK 21 automatically? (y/n): "
if /i "!DOWNLOAD!" neq "y" (
    echo ❌ Cannot continue without Java 21.
    pause
    exit /b 1
)

call setup-jdk.bat
for /d %%d in ("%~dp0.jdk\*") do (
    if exist "%%d\bin\java.exe" (
        set "JAVA_HOME=%%d"
        set "PATH=%%d\bin;!PATH!"
        goto choose_mode
    )
)
echo ❌ JDK setup failed.
pause
exit /b 1

:choose_mode
echo.
echo Choose Running Mode:
echo [1] 🐳 Docker Mode (Requires Docker Desktop)
echo [2] 💻 Native Mode (Use your local PostgreSQL/pgAdmin)
echo [3] 🌟 Portable Mode (Auto-setup everything into .db folder)
set /p "MODE=Select mode (1-3) [Default=2]: "
if "!MODE!"=="" set "MODE=2"

if "!MODE!"=="1" goto mode_docker
if "!MODE!"=="2" goto mode_native
if "!MODE!"=="3" goto mode_portable
goto choose_mode

:mode_docker
echo 🚀 Starting in DOCKER MODE...
docker compose up -d db
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=seed-running
goto end

:mode_native
echo 🚀 Starting in NATIVE MODE (Local PostgreSQL)...
echo 💡 Ensure your local PostgreSQL is running (default port 5432).
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=seed-running
goto end

:mode_portable
echo 🚀 Starting in PORTABLE MODE...
call setup-db.bat
if %errorlevel% neq 0 (
    echo ❌ Failed to start Portable DB.
    pause
    exit /b 1
)
echo ✅ Portable DB started on port 5433.
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=portable,seed-running
goto end

:end
pause
endlocal
