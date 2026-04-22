#!/bin/bash

# Run Souplesse Pilates in DEV mode using the in-memory H2 database.
# No Docker or Postgres required.

echo "🚀 Starting Souplesse Pilates in DEV mode (H2 In-Memory DB) on port 8082..."
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.arguments="--server.port=8082"
