@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo 🧹 Souplesse Pilates - Cleanup Utility
echo ==========================================
echo This will stop all running processes and RESET the database.
echo.
set /p "CONFIRM=Are you sure you want to proceed? (y/n): "
if /i "!CONFIRM!" neq "y" exit /b 0

echo.
echo 🛑 Stopping Application and Processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM postgres.exe >nul 2>&1

:: Docker Cleanup
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo 🐳 Cleaning up Docker containers and volumes...
    docker compose down -v >nul 2>&1
)

:: Portable DB Cleanup
if exist ".db\data" (
    echo 🐘 Resetting Portable Database...
    :: Use pg_ctl stop just in case
    ".db\bin\pg_ctl.exe" stop -D ".db\data" >nul 2>&1
    rd /s /q ".db\data" >nul 2>&1
    echo ✨ Portable Database data cleared.
)

:: Environment & Build Cleanup
echo 📝 Removing temporary files...
if exist ".env" del ".env"
if exist "target" rd /s /q "target"
if exist "logfile.txt" del "logfile.txt"
if exist ".db\logfile.txt" del ".db\logfile.txt"

echo.
echo ✅ Cleanup Complete!
echo 🚀 Run 'run.bat' to start a fresh installation.
echo.
pause
