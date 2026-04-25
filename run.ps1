# 🕊️ Souplesse Pilates - Unified Launcher (PowerShell)
# ==================================================

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Souplesse Pilates - Unified Launcher" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
}

# --- Portable JDK Activation ---
if (Test-Path "$PSScriptRoot\.jdk") {
    $jdkDir = Get-ChildItem -Path "$PSScriptRoot\.jdk" -Filter "jdk-*" | Select-Object -First 1
    if ($null -ne $jdkDir) {
        $env:JAVA_HOME = $jdkDir.FullName
        $env:PATH = "$($jdkDir.FullName)\bin;$env:PATH"
        Write-Host "[INFO] Using Portable JDK: $($jdkDir.Name)" -ForegroundColor Gray
    }
}

# --- .env Loading ---
if (Test-Path "$PSScriptRoot\.env") {
    Get-Content "$PSScriptRoot\.env" | ForEach-Object {
        if ($_ -match "^(?<name>[^#\s][^=]*)=(?<value>.*)$") {
            $name = $Matches['name'].Trim()
            $value = $Matches['value'].Trim()
            $env:$name = $value
        }
    }
}

function Check-Environment {
    $javaOk = $false
    try {
        $javaVersion = java -version 2>&1 | Out-String
        if ($javaVersion -match "version ""(\d+)") {
            $major = [int]$Matches[1]
            if ($major -ge 21) {
                Write-Host "[OK] Found Java $major" -ForegroundColor Green
                $javaOk = $true
            } else {
                Write-Host "[WARN] Java version $major is too old (Required: 21+)" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "[ERROR] Java not found." -ForegroundColor Red
    }

    $dockerOk = $false
    try {
        docker version --format '{{.Server.Version}}' > $null 2>&1
        Write-Host "[OK] Found Docker" -ForegroundColor Green
        $dockerOk = $true
    } catch {
        Write-Host "[WARN] Docker not running or not installed." -ForegroundColor Yellow
    }

    return @{ Java = $javaOk; Docker = $dockerOk }
}

function Setup-DotEnv {
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "[INFO] Created .env from .env.example" -ForegroundColor Gray
        }
    }
}

Show-Header
Setup-DotEnv
$EnvInfo = Check-Environment

Write-Host "`nChoose Running Mode:" -ForegroundColor White
Write-Host "[1] Docker Mode (Full Stack: App + DB in Docker)"
Write-Host "[2] Hybrid Mode (DB in Docker, App runs Natively)"
Write-Host "[3] Native Mode (Use your local PostgreSQL)"
Write-Host "[4] Cleanup (Reset environment)"
Write-Host "[Q] Quit"

$choice = Read-Host "`nSelect mode (1-4) [Default=1]"
if ($choice -eq "") { $choice = "1" }

switch ($choice) {
    "1" {
        if (-not $EnvInfo.Docker) { Write-Host "[ERROR] Docker is required for this mode." -ForegroundColor Red; return }
        Write-Host "[RUN] Starting Full Stack Docker..." -ForegroundColor Magenta
        ./scripts/docker-run.bat
    }
    "2" {
        if (-not $EnvInfo.Docker) { Write-Host "[ERROR] Docker is required for this mode." -ForegroundColor Red; return }
        Write-Host "[RUN] Starting Hybrid Mode..." -ForegroundColor Magenta
        
        # Find a free port
        $s = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any,0)
        $s.Start()
        $dbPort = $s.LocalEndpoint.Port
        $s.Stop()
        $env:DB_PORT = $dbPort
        Write-Host "[INFO] Assigned dynamic DB port: $dbPort" -ForegroundColor Gray

        docker compose -f docker-compose.local.yml up -d db
        
        $env:SPRING_PROFILES_ACTIVE = "seed-running"
        $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:$dbPort/souplesse_pilates"
        $env:SPRING_DATASOURCE_USERNAME = "pilates_user"
        $env:SPRING_DATASOURCE_PASSWORD = "pilates_pass"

        ./mvnw.cmd spring-boot:run
    }
    "3" {
        if (-not $EnvInfo.Java) { Write-Host "[ERROR] Java 21+ is required." -ForegroundColor Red; return }
        Write-Host "[RUN] Starting Native Mode (using .env settings)..." -ForegroundColor Magenta
        $env:SPRING_PROFILES_ACTIVE = "seed-running"
        ./mvnw.cmd spring-boot:run
    }
    "4" {
        Write-Host "[RUN] Cleaning up..."
        ./scripts/clean.bat
    }
    "q" { exit }
    Default { Write-Host "❌ Invalid option." -ForegroundColor Red }
}

Write-Host "`nPress any key to exit..."
$null = [Console]::ReadKey($true)
