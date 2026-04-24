@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo Souplesse Pilates - Cleanup Utility
echo ==========================================
echo This will stop all running processes and RESET the database.
echo.
set /p "CONFIRM=Are you sure you want to proceed? (y/n): "
if /i "!CONFIRM!" neq "y" exit /b 0

echo.
echo [STOP] Stopping Application and Processes...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM postgres.exe >nul 2>&1

:: Docker Cleanup
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo [DOCKER] Cleaning up Docker containers and volumes...
    docker compose down -v >nul 2>&1
)

:: Portable DB Cleanup
if exist "%~dp0..\.db\data" (
    echo [DB] Resetting Portable Database...
    :: Use pg_ctl stop just in case
    "%~dp0..\.db\bin\pg_ctl.exe" stop -D "%~dp0..\.db\data" >nul 2>&1
    rd /s /q "%~dp0..\.db\data" >nul 2>&1
    echo [OK] Portable Database data cleared.
)

:: Environment & Build Cleanup
echo [CLEAN] Removing temporary files...
if exist "%~dp0..\target" rd /s /q "%~dp0..\target"
if exist "%~dp0..\logfile.txt" del "%~dp0..\logfile.txt"
if exist "%~dp0..\.db\logfile.txt" del "%~dp0..\.db\logfile.txt"

echo.
echo [OK] Cleanup Complete!
echo [RUN] Run 'run.bat' to start a fresh installation.
echo.
pause
