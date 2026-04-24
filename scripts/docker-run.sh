#!/bin/bash

# Configuration for local development using Docker
# This script starts the database and the application in separate containers

echo "Starting Souplesse Pilates Local Environment (Docker)..."

# Ensure docker-compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "[ERROR] Docker Compose is not installed. Please install it to continue."
    exit 1
fi

# Use 'docker compose' if available, otherwise fallback to 'docker-compose'
DOCKER_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    DOCKER_CMD="docker-compose"
fi

# Run the local compose file with optional profile
PROFILE=${1:-prod,seed-running}
echo "[INFO] Using profile: $PROFILE"

SPRING_PROFILES_ACTIVE=$PROFILE $DOCKER_CMD -f docker-compose.local.yml up --build -d

echo "----------------------------------------------------"
echo "[OK] Local environment is starting!"
echo "[INFO] App will be available at: http://localhost:8081"
echo "[INFO] Database is mapped to port: 5434"
echo "----------------------------------------------------"
echo "[TIP] To see logs, run: $DOCKER_CMD -f docker-compose.local.yml logs -f"
echo "[TIP] To stop, run: $DOCKER_CMD -f docker-compose.local.yml down"
