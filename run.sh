#!/bin/bash

# ==========================================
# 🕊️ Souplesse Pilates - Unified Launcher
# ==========================================

# Load environment variables from .env if it exists
if [ -f .env ]; then
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Ignore comments and empty lines
        if [[ ! "$line" =~ ^# ]] && [[ -n "$line" ]]; then
            # Remove any trailing \r from Windows line endings
            clean_line=$(echo "$line" | sed 's/\r$//')
            export "$clean_line"
        fi
    done < .env
    echo "[OK] Loaded environment variables from .env"
else
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "[INFO] Created .env from .env.example"
    fi
fi

echo "Choose Running Mode:"
echo "[1] Docker Mode (Full Stack: App + DB in Docker)"
echo "[2] Hybrid Mode (DB in Docker, App runs Natively)"
echo "[3] Native Mode (Use your local PostgreSQL)"
echo "[4] Cleanup (Stop everything and reset data)"
read -p "Select mode (1-4) [Default=1]: " MODE
MODE=${MODE:-1}

case $MODE in
    1)
        echo "[RUN] Starting FULL STACK DOCKER..."
        ./scripts/docker-run.sh
        ;;
    2)
        echo "[RUN] Starting HYBRID MODE (DB in Docker)..."
        # Find a free port for the database
        export DB_PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1]); s.close()' 2>/dev/null || echo 5434)
        echo "[INFO] Assigned dynamic DB port: $DB_PORT"
        
        if ! docker compose -f docker-compose.local.yml up -d db; then
            echo "❌ Failed to start Docker database. Check your Docker permissions."
            exit 1
        fi
        
        # Pass the dynamic port to the Spring Boot application
        ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running \
            -Dspring.datasource.url=jdbc:postgresql://localhost:$DB_PORT/souplesse_pilates
        ;;
    3)
        echo "[RUN] Starting NATIVE MODE..."
        ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
        ;;
    4)
        echo "[RUN] Cleaning up..."
        if [ -f ./scripts/clean.sh ]; then
            ./scripts/clean.sh
        else
            docker compose down -v
            ./mvnw clean
        fi
        ;;
    *)
        echo "❌ Invalid option."
        exit 1
        ;;
esac
