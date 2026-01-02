# deploy-chainfund.ps1
# Deploy ChainFund contracts to Stellar Testnet

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ChainFund Contract Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$NETWORK = "testnet"
$NETWORK_PASSPHRASE = "Test SDF Network ; September 2015"
$RPC_URL = "https://soroban-testnet.stellar.org"
$WASM_DIR = "target/wasm32-unknown-unknown/release"

# Contract WASM files
$CORE_WASM = "$WASM_DIR/chainfund_core.wasm"
$SBT_WASM = "$WASM_DIR/chainfund_sbt.wasm"

# Output file for contract addresses
$ADDRESSES_FILE = "deployed_addresses.json"

# Check prerequisites
function Check-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    # Check for stellar CLI
    $stellarCli = Get-Command stellar -ErrorAction SilentlyContinue
    if (-not $stellarCli) {
        Write-Host "  ❌ Stellar CLI not found. Install with: cargo install stellar-cli" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Stellar CLI found" -ForegroundColor Green
    
    # Check WASM files exist
    if (-not (Test-Path $CORE_WASM)) {
        Write-Host "  ❌ Core contract WASM not found. Run build.ps1 first." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Core contract WASM found" -ForegroundColor Green
    
    if (-not (Test-Path $SBT_WASM)) {
        Write-Host "  ❌ SBT contract WASM not found. Run build.ps1 first." -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ SBT contract WASM found" -ForegroundColor Green
    
    Write-Host ""
}

# Generate or load admin keypair
function Get-AdminKeypair {
    $keyFile = ".admin_keypair"
    
    if (Test-Path $keyFile) {
        Write-Host "Loading existing admin keypair..." -ForegroundColor Yellow
        $keypair = Get-Content $keyFile | ConvertFrom-Json
    } else {
        Write-Host "Generating new admin keypair..." -ForegroundColor Yellow
        
        # Generate keypair using stellar CLI
        $output = stellar keys generate admin --network testnet 2>&1
        $publicKey = stellar keys address admin 2>&1
        
        $keypair = @{
            public = $publicKey.Trim()
            name = "admin"
        }
        
        $keypair | ConvertTo-Json | Set-Content $keyFile
        
        Write-Host "  Admin Public Key: $($keypair.public)" -ForegroundColor Green
        Write-Host "  ⚠️  Fund this account using Stellar Friendbot!" -ForegroundColor Yellow
        Write-Host "  https://friendbot.stellar.org/?addr=$($keypair.public)" -ForegroundColor Cyan
        
        # Auto-fund using friendbot
        Write-Host "`n  Requesting testnet funds from Friendbot..." -ForegroundColor Yellow
        try {
            Invoke-RestMethod -Uri "https://friendbot.stellar.org/?addr=$($keypair.public)" -Method Get | Out-Null
            Write-Host "  ✓ Account funded successfully!" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Could not auto-fund. Please fund manually." -ForegroundColor Yellow
        }
    }
    
    return $keypair
}

# Deploy a contract
function Deploy-Contract {
    param(
        [string]$WasmPath,
        [string]$ContractName,
        [string]$AdminKey
    )
    
    Write-Host "`nDeploying $ContractName..." -ForegroundColor Yellow
    
    # Deploy the WASM
    $output = stellar contract deploy `
        --wasm $WasmPath `
        --source $AdminKey `
        --network testnet `
        2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ❌ Failed to deploy $ContractName" -ForegroundColor Red
        Write-Host "  Error: $output" -ForegroundColor Red
        return $null
    }
    
    $contractId = $output.Trim()
    Write-Host "  ✓ $ContractName deployed!" -ForegroundColor Green
    Write-Host "  Contract ID: $contractId" -ForegroundColor Cyan
    
    return $contractId
}

# Initialize the core contract
function Initialize-CoreContract {
    param(
        [string]$ContractId,
        [string]$AdminKey,
        [string]$AdminPublic,
        [string]$SbtContractId
    )
    
    Write-Host "`nInitializing Core Contract..." -ForegroundColor Yellow
    
    # Get native token address (XLM)
    $xlmToken = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2EZ4KUXH" # Testnet XLM SAC
    
    # Initialize contract
    $output = stellar contract invoke `
        --id $ContractId `
        --source $AdminKey `
        --network testnet `
        -- initialize `
        --admin $AdminPublic `
        --ai_oracle $AdminPublic `
        --sbt_contract $SbtContractId `
        --token_address $xlmToken `
        2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️  Initialization may have failed or already done" -ForegroundColor Yellow
        Write-Host "  Output: $output" -ForegroundColor Gray
    } else {
        Write-Host "  ✓ Core contract initialized!" -ForegroundColor Green
    }
}

# Initialize the SBT contract
function Initialize-SbtContract {
    param(
        [string]$ContractId,
        [string]$AdminKey,
        [string]$AdminPublic,
        [string]$CoreContractId
    )
    
    Write-Host "`nInitializing SBT Contract..." -ForegroundColor Yellow
    
    $output = stellar contract invoke `
        --id $ContractId `
        --source $AdminKey `
        --network testnet `
        -- initialize `
        --admin $AdminPublic `
        --core_contract $CoreContractId `
        --name "ChainFund SBT" `
        --symbol "CFSBT" `
        2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️  Initialization may have failed or already done" -ForegroundColor Yellow
        Write-Host "  Output: $output" -ForegroundColor Gray
    } else {
        Write-Host "  ✓ SBT contract initialized!" -ForegroundColor Green
    }
}

# Main deployment flow
function Main {
    Check-Prerequisites
    
    # Get admin keypair
    $admin = Get-AdminKeypair
    Write-Host ""
    
    # Deploy contracts
    $coreId = Deploy-Contract -WasmPath $CORE_WASM -ContractName "ChainFund Core" -AdminKey "admin"
    if (-not $coreId) { exit 1 }
    
    $sbtId = Deploy-Contract -WasmPath $SBT_WASM -ContractName "ChainFund SBT" -AdminKey "admin"
    if (-not $sbtId) { exit 1 }
    
    # Initialize contracts
    Initialize-SbtContract -ContractId $sbtId -AdminKey "admin" -AdminPublic $admin.public -CoreContractId $coreId
    Initialize-CoreContract -ContractId $coreId -AdminKey "admin" -AdminPublic $admin.public -SbtContractId $sbtId
    
    # Save deployed addresses
    $addresses = @{
        network = $NETWORK
        rpc_url = $RPC_URL
        admin = $admin.public
        contracts = @{
            chainfund_core = $coreId
            chainfund_sbt = $sbtId
        }
        deployed_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    $addresses | ConvertTo-Json -Depth 3 | Set-Content $ADDRESSES_FILE
    
    Write-Host "`n============================================" -ForegroundColor Cyan
    Write-Host "  Deployment Complete!" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Contract Addresses:" -ForegroundColor Yellow
    Write-Host "  Core Contract: $coreId" -ForegroundColor Cyan
    Write-Host "  SBT Contract:  $sbtId" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Addresses saved to: $ADDRESSES_FILE" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Update frontend config with these contract addresses" -ForegroundColor Gray
    Write-Host "  2. Update backend config for AI oracle submissions" -ForegroundColor Gray
}

# Run main
Main
