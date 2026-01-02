#!/bin/bash

# Build script for Render deployment
echo "Starting ChainFund build process..."
echo "Current working directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if frontend directory exists
if [ -d "ChainFund-backend/Chain-Front/Chain-Front" ]; then
    echo "Found frontend directory"
    # Navigate to frontend directory
    cd ChainFund-backend/Chain-Front/Chain-Front
    
    echo "Frontend directory contents:"
    ls -la
    
    # Install dependencies
    echo "Installing frontend dependencies..."
    npm ci || npm install
    
    # Build the frontend
    echo "Building frontend..."
    npm run build
    
    echo "Build completed successfully!"
    echo "Checking dist directory:"
    ls -la dist/
else
    echo "ERROR: Frontend directory not found!"
    echo "Looking for: ChainFund-backend/Chain-Front/Chain-Front"
    echo "Available directories:"
    find . -name "package.json" -type f
    exit 1
fi