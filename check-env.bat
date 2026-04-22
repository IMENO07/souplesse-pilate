@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo 🕊️  Souplesse Pilates - Environment Check
echo ==========================================

set "JAVA_REQUIRED=21"
set "JAVA_FOUND=0"
set "DOCKER_FOUND=0"

:: Check Java
java -version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
        set "JVER=%%g"
        set "JVER=!JVER:"=!"
        for /f "delims=. tokens=1" %%v in ("!JVER!") do (
            set "JMAJOR=%%v"
            if "!JMAJOR!"=="1" (
                for /f "delims=. tokens=2" %%v in ("!JVER!") do set "JMAJOR=%%v"
            )
            echo ✅ Found Java version: !JVER! (Major: !JMAJOR!)
            if !JMAJOR! geq %JAVA_REQUIRED% (
                set "JAVA_FOUND=1"
            ) else (
                echo ⚠️  Java version is below required %JAVA_REQUIRED%.
            )
        )
    )
) else (
    echo ❌ Java not found in PATH.
)

:: Check Docker
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Found Docker.
    set "DOCKER_FOUND=1"
) else (
    echo ⚠️  Docker not found. (Required for PostgreSQL mode)
)

echo.
echo Summary:
if !JAVA_FOUND! equ 1 (
    echo [OK] Java %JAVA_REQUIRED%+ is ready.
) else (
    echo [MISSING] Java %JAVA_REQUIRED%+ is required.
)

if !DOCKER_FOUND! equ 1 (
    echo [OK] Docker is ready for PostgreSQL mode.
) else (
    echo [INFO] Docker is missing. Please use Professional Mode - Portable DB.
)
echo ==========================================

endlocal & set "ENV_JAVA_OK=%JAVA_FOUND%" & set "ENV_DOCKER_OK=%DOCKER_FOUND%"
