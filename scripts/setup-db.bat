@echo off
setlocal enabledelayedexpansion

set "DB_DIR=%~dp0..\.db"
set "DB_ZIP=%~dp0..\pgsql.zip"
set "DB_URL=https://get.enterprisedb.com/postgresql/postgresql-15.10-1-windows-x64-binaries.zip"
set "DB_PORT=5433"

:: 1. Check/Download Binaries
if not exist "%DB_DIR%\bin\pg_ctl.exe" (
    echo [INFO] Downloading Portable PostgreSQL 15...
    powershell -Command "Invoke-WebRequest -Uri '%DB_URL%' -OutFile '%DB_ZIP%'"
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to download PostgreSQL.
        exit /b 1
    )

    echo [INFO] Extracting PostgreSQL...
    powershell -Command "Expand-Archive -Path '%DB_ZIP%' -DestinationPath '%~dp0..\.tmp_db'"
    move "%~dp0..\.tmp_db\pgsql" "%DB_DIR%"
    rd /s /q "%~dp0..\.tmp_db"
    del "%DB_ZIP%"
)

:: 2. Initialize Data if missing
if not exist "%DB_DIR%\data" (
    echo [INFO] Initializing Database...
    "%DB_DIR%\bin\initdb.exe" -D "%DB_DIR%\data" -U postgres --auth=trust
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize database.
        exit /b 1
    )
)

:: 3. Start Database
"%DB_DIR%\bin\pg_ctl.exe" status -D "%DB_DIR%\data" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL is already running.
) else (
    echo [RUN] Starting PostgreSQL on port %DB_PORT%...
    start "PostgreSQL" /min "%DB_DIR%\bin\pg_ctl.exe" -D "%DB_DIR%\data" -o "-p %DB_PORT%" -l "%DB_DIR%\logfile.txt" start
    echo [WAIT] Waiting for PostgreSQL to be ready...
    :wait_db
    "%DB_DIR%\bin\pg_isready.exe" -h localhost -p %DB_PORT% >nul 2>&1
    if %errorlevel% neq 0 (
        timeout /t 1 >nul
        goto wait_db
    )
)

:: 4. Ensure Credentials
echo [INFO] Creating user and database...
"%DB_DIR%\bin\psql.exe" -h localhost -p %DB_PORT% -U postgres -c "CREATE USER pilates_user WITH PASSWORD 'pilates_pass' SUPERUSER;" >nul 2>&1
"%DB_DIR%\bin\psql.exe" -h localhost -p %DB_PORT% -U postgres -c "CREATE DATABASE souplesse_pilates OWNER pilates_user;" >nul 2>&1

echo [OK] Database ready on port %DB_PORT%
exit /b 0
