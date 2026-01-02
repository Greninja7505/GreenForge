#!/bin/bash

set -e

# Navigate to backend folder
cd "$(dirname "$0")/chainfund-backend"

# Create virtual environment if not exists
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install FastAPI and Uvicorn if not installed
pip install --upgrade pip
pip install fastapi uvicorn

# Run the FastAPI server
echo "Starting ChainFund mock backend at http://localhost:8000 ..."
uvicorn simple_server:app --reload
