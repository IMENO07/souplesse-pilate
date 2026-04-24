# 🚀 How to Run — Step-by-Step Guide

This guide explains exactly how to use the 5 different launch modes for Souplesse Pilates on both Windows and Linux.

---

## 1. Docker Mode (Recommended for Beginners)
*Best if you want everything to just work without installing databases or Java.*

### Steps:
1. **Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop). Make sure it's running.
2. **Open the Project Folder**: Navigate to the folder where you downloaded Souplesse.
3. **Launch the Script**:
   - **Windows**: Double-click `run.bat`.
   - **Linux**: Open terminal in the folder and type `./run.sh`.
4. **Select Mode**: When asked, type `1` and press **Enter**.
5. **Access**: Wait about 60 seconds for the "Ready" message. Open your browser and go to [http://localhost:8081](http://localhost:8081).

---

## 2. Hybrid Mode (Recommended for Developers)
*Best for fast development. The database is in a container, but the application runs natively for instant code updates.*

### Steps:
1. **Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and [Java 21](https://openjdk.org/projects/jdk/21/).
2. **Setup .env**: Ensure you have a `.env` file (the script creates one for you if it's missing).
3. **Launch the Script**:
   - **Windows**: Double-click `run.bat`.
   - **Linux**: Type `./run.sh` in terminal.
4. **Select Mode**: Type `2` and press **Enter**.
5. **Access**: Go to [http://localhost:8080](http://localhost:8080).

---

## 3. Native Mode (For Advanced Users)
*Best if you already have a local PostgreSQL server and want zero Docker overhead.*

### Steps:
1. **Prerequisites**: Install [Java 21](https://openjdk.org/projects/jdk/21/) and [PostgreSQL](https://www.postgresql.org/).
2. **Prepare Database**: Create a database named `souplesse_pilates` in your PostgreSQL.
3. **Configure .env**: Update your `.env` file with your local database username and password.
4. **Launch the Script**: Select Mode `3`.
5. **Access**: Go to [http://localhost:8080](http://localhost:8080).

---

## 4. Portable Mode (Zero-Config / Windows Only)
*Best for testing or if you can't install anything on your PC.*

### Steps:
1. **Launch the Script**: Double-click `run.bat`.
2. **Select Mode**: Type `4` and press **Enter**.
3. **Wait**: The script will download a standalone PostgreSQL version automatically.
4. **Access**: Go to [http://localhost:8080](http://localhost:8080).

---

## 5. Cleanup (The Reset Button)
*Use this if the app crashes, ports are blocked, or you want to wipe test data.*

### Steps:
1. **Launch the Script**: Select Mode `5`.
2. **Confirm**: The script will stop all running containers, kill any stray Java processes, and clear temporary files.
3. **Restart**: You can now run any other mode safely.
