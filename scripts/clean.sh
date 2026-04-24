#!/bin/bash

# ==========================================
# Souplesse Pilates - Cleanup Utility
# ==========================================

echo "This will stop all running processes and RESET the database."
read -p "Are you sure you want to proceed? (y/n): " CONFIRM

if [[ $CONFIRM != "y" ]]; then
    exit 0
fi

echo "[STOP] Stopping Application and Processes..."
# Kill java processes
pkill -f 'spring-boot:run' || true

# Docker Cleanup
if command -v docker &> /dev/null; then
    echo "[DOCKER] Cleaning up Docker containers and volumes..."
    docker compose down -v
fi

# Build Cleanup
echo "[CLEAN] Removing temporary files..."
rm -rf target
rm -f logfile.txt
rm -f crash.log
rm -f server_live.log

echo "[OK] Cleanup Complete!"
