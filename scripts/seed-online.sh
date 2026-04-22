#!/bin/bash

# Load .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "[OK] Loaded credentials from .env"
else
    echo "[ERROR] .env file not found!"
    exit 1
fi

# Run the seeder (headless mode to avoid port 8080 conflict)
echo "[RUN] Starting seeding process for ONLINE database..."
./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.main.web-application-type=none"
