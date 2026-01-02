# ChainFund Lite - Quick Start Script
# Run this to start the backend with SQLite database

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   CHAINFUND LITE - BACKEND SETUP" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
$backendPath = $PSScriptRoot
Set-Location $backendPath

# Check if Python is installed
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
} else {
    Write-Host "ERROR: Python is not installed!" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    exit 1
}

Write-Host "Using Python: $pythonCmd" -ForegroundColor Green

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host ""
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    & $pythonCmd -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "$backendPath\venv\Scripts\Activate.ps1"

# Install requirements
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements-sqlite.txt

# Seed the database
Write-Host ""
Write-Host "Seeding database with mock data..." -ForegroundColor Yellow
& $pythonCmd scripts/seed_database.py

# Start the server
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host "   STARTING CHAINFUND API SERVER" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "API Server: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs:   http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

& $pythonCmd sqlite_server.py
