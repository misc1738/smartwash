#!/bin/bash

# M-Pesa Integration Setup Script for SmartWash
# This script installs dependencies for the M-Pesa integration

echo "🚀 Setting up M-Pesa Integration for SmartWash..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server

if [ ! -f "package.json" ]; then
    echo "❌ Error: server/package.json not found."
    exit 1
fi

npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install server dependencies."
    exit 1
fi

echo "✅ Server dependencies installed successfully"
echo ""

# Go back to root
cd ..

# Check if client dependencies are installed
echo "📦 Checking client dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install client dependencies."
        exit 1
    fi
    echo "✅ Client dependencies installed successfully"
else
    echo "✅ Client dependencies already installed"
fi

echo ""
echo "✨ M-Pesa integration setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the server: cd server && npm start"
echo "2. Start the client: npm run dev"
echo "3. Visit http://localhost:5173/mpesa-test to test"
echo ""
echo "📚 Documentation:"
echo "- Quick Start: MPESA_QUICKSTART.md"
echo "- Full Guide: MPESA_INTEGRATION.md"
echo ""
echo "🎯 Configuration:"
echo "- Server: server/.env"
echo "- Client: .env"
echo ""
echo "Happy coding! 🚀"
