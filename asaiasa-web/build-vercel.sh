#!/bin/bash

# Vercel build script to fix Rollup optional dependencies issue
echo "Starting Vercel build process..."

# Clean any existing node_modules and lock files
echo "Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with optional dependencies explicitly
echo "Installing dependencies..."
npm install --include=optional

# Ensure Rollup platform-specific binaries are available
echo "Checking Rollup binaries..."
npm ls @rollup/rollup-linux-x64-gnu || npm install @rollup/rollup-linux-x64-gnu --save-optional

# Run the build
echo "Running build..."
npm run build

echo "Build completed successfully!"
