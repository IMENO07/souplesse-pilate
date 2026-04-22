@echo off
setlocal

:: Load environment variables from .env if it exists
if exist .env (
    echo ✅ Loading environment variables from .env
    for /f "usebackq tokens=*" %%a in (`findstr /v "^#" .env`) do (
        set %%a
    )
) else (
    echo ⚠️ .env file not found. Running with default environment.
)

:: Run the Spring Boot application using the Maven wrapper
echo 🚀 Starting Souplesse Pilates...
call mvnw.cmd spring-boot:run

endlocal
