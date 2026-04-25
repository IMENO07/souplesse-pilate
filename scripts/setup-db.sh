#!/bin/bash

# ==========================================
# Souplesse Pilates - Database Setup (Linux)
# ==========================================

DB_NAME="souplesse_pilates"
DB_USER="pilates_user"
DB_PASS="pilates_pass"

echo "[INFO] Checking for PostgreSQL..."

if ! command -v psql &> /dev/null; then
    echo "[ERROR] PostgreSQL (psql) not found."
    echo "Please install it: sudo apt install postgresql"
    exit 1
fi

echo "[INFO] Setting up database and user..."
echo "This might require your sudo password to run psql as the 'postgres' user."

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS' SUPERUSER;" || echo "[SKIP] User already exists or error."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || echo "[SKIP] Database already exists or error."

echo "[OK] Setup complete. You can now use Native Mode."
