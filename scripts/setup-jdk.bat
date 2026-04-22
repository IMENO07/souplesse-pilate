@echo off
setlocal enabledelayedexpansion

set "JDK_DIR=%~dp0..\.jdk"
set "JDK_ZIP=%~dp0..\jdk.zip"
set "JDK_URL=https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse"

if exist "%JDK_DIR%" (
    echo [OK] Portable JDK 21 already exists in %JDK_DIR%
    exit /b 0
)

echo [INFO] Downloading Portable JDK 21...
echo This may take a few minutes depending on your internet connection...

powershell -Command "Invoke-WebRequest -Uri '%JDK_URL%' -OutFile '%JDK_ZIP%'"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to download JDK.
    exit /b 1
)

echo [INFO] Extracting JDK...
if not exist "%JDK_DIR%" mkdir "%JDK_DIR%"
powershell -Command "Expand-Archive -Path '%JDK_ZIP%' -DestinationPath '%JDK_DIR%'"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to extract JDK.
    exit /b 1
)

del "%JDK_ZIP%"

:: Find the actual bin folder (Adoptium zips usually have a subfolder)
for /d %%d in ("%JDK_DIR%\*") do (
    if exist "%%d\bin\java.exe" (
        echo [OK] JDK successfully setup in %%d
        exit /b 0
    )
)

echo [WARN] JDK extracted but couldn't find bin\java.exe in subfolders.
exit /b 1
