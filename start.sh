#!/bin/bash

echo "🚀 Starting Startup Validator Application..."
echo ""

# Kill any existing processes on the ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

echo "✅ Ports cleared"
echo ""

# Start the application
echo "🚀 Starting both servers..."
npm run dev
