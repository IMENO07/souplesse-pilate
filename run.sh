#!/bin/bash

# Load environment variables from .env if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo "✅ Loaded environment variables from .env"
else
    echo "⚠️ .env file not found. Running with default environment."
fi

# Run the Spring Boot application using the Maven wrapper
echo "🚀 Starting Souplesse Pilates..."
./mvnw spring-boot:run
