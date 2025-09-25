#!/usr/bin/env bash
set -o errexit

# Install Python dependencies
cd server
pip install -r requirements.txt

# Build React app
cd ../client
npm install
npm run build

# Copy build files to server static folder
mkdir -p ../server/static
cp -r build/* ../server/static/