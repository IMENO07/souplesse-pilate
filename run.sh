#!/bin/bash

# ==========================================
# 🕊️ Souplesse Pilates - Unified Launcher
# ==========================================

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
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
        docker compose up -d db
        ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
        ;;
    3)
        echo "[RUN] Starting NATIVE MODE..."
        ./mvnw spring-boot:run -Dspring-boot.run.profiles=seed-running
        ;;
    4)
        echo "[RUN] Cleaning up..."
        # If clean.sh doesn't exist yet, we'll create it soon or just run commands
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
