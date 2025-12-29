# build.ps1
# PowerShell script to build Soroban contracts

Write-Host "🔨 Building ChainFund Soroban contracts..." -ForegroundColor Cyan

# Function to build a contract
function Build-Contract {
    param($ContractName)
    
    Write-Host "Building $ContractName..." -ForegroundColor Yellow
    
    # Check if contract directory exists
    if (!(Test-Path $ContractName)) {
        Write-Host "⚠️  Contract directory $ContractName not found, skipping..." -ForegroundColor Yellow
        return
    }
    
    Set-Location $ContractName

    # Build for wasm32 target
    cargo build --target wasm32-unknown-unknown --release
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to build $ContractName" -ForegroundColor Red
        Set-Location ..
        return
    }

    Write-Host "✅ Built $ContractName successfully" -ForegroundColor Green
    Set-Location ..
}

# Make sure we're in the right directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Create output directory if it doesn't exist
$outDir = "target/wasm32-unknown-unknown/release"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

# Build all contracts using workspace
Write-Host "`n📦 Building all contracts via Cargo workspace..." -ForegroundColor Cyan
cargo build --target wasm32-unknown-unknown --release

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Workspace build completed!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Workspace build had errors, trying individual builds..." -ForegroundColor Yellow
    
    # Build each contract individually
    Build-Contract "chainfund_core"
    Build-Contract "chainfund_sbt"
    Build-Contract "project_funding"
    Build-Contract "reward_token"
}

# List built WASM files
Write-Host "`n📋 Built WASM files:" -ForegroundColor Cyan
if (Test-Path $outDir) {
    Get-ChildItem -Path $outDir -Filter "*.wasm" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  📄 $($_.Name) - ${size}KB" -ForegroundColor Green
    }
}

Write-Host "`n🎉 Build process completed!" -ForegroundColor Green
Write-Host "Use deploy.ps1 to deploy contracts to Stellar testnet" -ForegroundColor Cyan