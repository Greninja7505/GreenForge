# PowerShell script to build and deploy Rust contracts to Stellar testnet

# Secret and public keys are defined here
$SECRET_KEY = "SAM6TDE3WTTNMMONRR74E2ENZPHNRUJIQXZOAM5FWBBJGUT5722HFYKB"
$PUBLIC_KEY = "GCMB6IDKZHDMN4ONXVCKGRSA24TXBLNRUHVJQX5DNJ2IKDZ75NLQXQOR"

# Function to show error and exit
function Show-Error {
    param($Message)
    Write-Host "Error: $Message" -ForegroundColor Red
    exit 1
}

# Function to verify Soroban response
function Test-SorobanResponse {
    param($Output, $ErrorMessage)
    if ($LASTEXITCODE -ne 0 -or $null -eq $Output) {
        Show-Error $ErrorMessage
    }
    return $Output
}

# Function to run Soroban command with retries
function Invoke-SorobanCommand {
    param(
        [string]$Command,
        [string]$ErrorMessage,
        [int]$MaxRetries = 3
    )
    
    $attempt = 1
    while ($attempt -le $MaxRetries) {
        try {
            $result = Invoke-Expression $Command
            if ($LASTEXITCODE -eq 0) {
                return $result
            }
        }
        catch {
            Write-Host "Attempt $attempt failed: $_" -ForegroundColor Yellow
        }
        
        if ($attempt -lt $MaxRetries) {
            Write-Host "Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
        $attempt++
    }
    
    Show-Error $ErrorMessage
}

# Function to check if running in the correct directory
function Test-WorkingDirectory {
    if (!(Test-Path "project_funding") -or !(Test-Path "reward_token")) {
        Show-Error "Please run this script from the rust-contracts directory"
    }
}

# Check if Rust and Soroban CLI are installed
if (!(Get-Command cargo -ErrorAction SilentlyContinue)) {
    Show-Error "Rust is not installed. Please install it from https://rustup.rs/"
}
if (!(Get-Command soroban -ErrorAction SilentlyContinue)) {
    Show-Error "Soroban CLI is not installed. Please install it with 'cargo install soroban-cli'"
}

# Verify working directory
Test-WorkingDirectory

Write-Host "Building and deploying Rust contracts..." -ForegroundColor Cyan

# Build project funding contract
Write-Host "Building project funding contract..."
Set-Location -Path project_funding
cargo build --target wasm32-unknown-unknown --release
if ($LASTEXITCODE -ne 0) {
    Show-Error "Failed to build project funding contract"
}
Set-Location -Path ..

# Build reward token contract
Write-Host "Building reward token contract..."
Set-Location -Path reward_token
cargo build --target wasm32-unknown-unknown --release
if ($LASTEXITCODE -ne 0) {
    Show-Error "Failed to build reward token contract"
}
Set-Location -Path ..

# Deploy to testnet
Write-Host "Deploying contracts to testnet..."

# Deploy project funding contract
Write-Host "Deploying project funding contract..." -ForegroundColor Cyan
$projectFundingCommand = "soroban contract deploy --wasm project_funding/target/wasm32-unknown-unknown/release/project_funding.wasm --source-account $SourceAccount --network testnet"
$projectFundingId = Invoke-SorobanCommand -Command $projectFundingCommand -ErrorMessage "Failed to deploy project funding contract"
Test-SorobanResponse -Output $projectFundingId -ErrorMessage "Failed to get project funding contract ID"
Write-Host "Project Funding Contract ID: $projectFundingId" -ForegroundColor Green

# Deploy reward token contract
Write-Host "Deploying reward token contract..." -ForegroundColor Cyan
$rewardTokenCommand = "soroban contract deploy --wasm reward_token/target/wasm32-unknown-unknown/release/reward_token.wasm --source-account $SourceAccount --network testnet"
$rewardTokenId = Invoke-SorobanCommand -Command $rewardTokenCommand -ErrorMessage "Failed to deploy reward token contract"
Test-SorobanResponse -Output $rewardTokenId -ErrorMessage "Failed to get reward token contract ID"
Write-Host "Reward Token Contract ID: $rewardTokenId" -ForegroundColor Green

# Initialize contracts
Write-Host "`nInitializing contracts..." -ForegroundColor Cyan

# Initialize project funding contract
Write-Host "Initializing project funding contract..." -ForegroundColor Cyan
$initProjectFundingCommand = "soroban contract invoke --id $projectFundingId --source-account $SourceAccount --network testnet -- initialize --admin $SourceAccount"
$initProjectResult = Invoke-SorobanCommand -Command $initProjectFundingCommand -ErrorMessage "Failed to initialize project funding contract"
Test-SorobanResponse -Output $initProjectResult -ErrorMessage "Failed to verify project funding initialization"

# Initialize reward token contract with name and symbol
Write-Host "Initializing reward token contract..." -ForegroundColor Cyan
$initRewardTokenCommand = "soroban contract invoke --id $rewardTokenId --source-account $SourceAccount --network testnet -- initialize --admin $SourceAccount --name 'ChainFund Reward' --symbol 'CFUND'"
$initRewardResult = Invoke-SorobanCommand -Command $initRewardTokenCommand -ErrorMessage "Failed to initialize reward token contract"
Test-SorobanResponse -Output $initRewardResult -ErrorMessage "Failed to verify reward token initialization"

# Write contract IDs to .env files
Write-Host "`nUpdating environment files..." -ForegroundColor Cyan

# Backend .env
$backendEnvPath = "../chainfund-backend/.env"
if (Test-Path $backendEnvPath) {
    $envContent = Get-Content $backendEnvPath
    $envContent = $envContent | ForEach-Object {
        if ($_ -match "^PROJECT_FUNDING_CONTRACT_ID=") {
            "PROJECT_FUNDING_CONTRACT_ID=$projectFundingId"
        }
        elseif ($_ -match "^REWARD_TOKEN_CONTRACT_ID=") {
            "REWARD_TOKEN_CONTRACT_ID=$rewardTokenId"
        }
        else {
            $_
        }
    }
    $envContent | Set-Content $backendEnvPath
} else {
    @"
PROJECT_FUNDING_CONTRACT_ID=$projectFundingId
REWARD_TOKEN_CONTRACT_ID=$rewardTokenId
"@ | Add-Content $backendEnvPath
}

# Frontend .env
$frontendEnvPath = "../../Chain-Front/Chain-Front/.env"
if (Test-Path $frontendEnvPath) {
    $envContent = Get-Content $frontendEnvPath
    $envContent = $envContent | ForEach-Object {
        if ($_ -match "^VITE_PROJECT_FUNDING_CONTRACT_ID=") {
            "VITE_PROJECT_FUNDING_CONTRACT_ID=$projectFundingId"
        }
        elseif ($_ -match "^VITE_REWARD_TOKEN_CONTRACT_ID=") {
            "VITE_REWARD_TOKEN_CONTRACT_ID=$rewardTokenId"
        }
        else {
            $_
        }
    }
    $envContent | Set-Content $frontendEnvPath
} else {
    @"
VITE_PROJECT_FUNDING_CONTRACT_ID=$projectFundingId
VITE_REWARD_TOKEN_CONTRACT_ID=$rewardTokenId
"@ | Add-Content $frontendEnvPath
}

Write-Host "`nDeployment completed successfully!" -ForegroundColor Green
Write-Host "Project Funding Contract: $projectFundingId" -ForegroundColor Cyan
Write-Host "Reward Token Contract: $rewardTokenId" -ForegroundColor Cyan
Write-Host "`nEnvironment files have been updated with the new contract IDs." -ForegroundColor Yellow
    Show-Error "Failed to deploy reward token contract"

# Update .env file with contract IDs
$envPath = Join-Path -Path ".." -ChildPath ".env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    $envContent = $envContent -replace "STELLAR_PROJECT_FUNDING_ID=.*", "STELLAR_PROJECT_FUNDING_ID=$projectFundingId"
    $envContent = $envContent -replace "STELLAR_REWARD_TOKEN_ID=.*", "STELLAR_REWARD_TOKEN_ID=$rewardTokenId"
    $envContent | Set-Content $envPath
} else {
    @"
STELLAR_PROJECT_FUNDING_ID=$projectFundingId
STELLAR_REWARD_TOKEN_ID=$rewardTokenId
"@ | Set-Content $envPath
}

Write-Host "`nDeployment complete!" -ForegroundColor Green
Write-Host "Project Funding Contract ID: $projectFundingId"
Write-Host "Reward Token Contract ID: $rewardTokenId"
Write-Host "`nContract IDs have been saved to ../.env"