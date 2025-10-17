#!/bin/bash

echo "Starting Startup Validator Development Environment..."
echo

echo "Starting Backend Server..."
cd Backend
npm run dev &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd ../frontend_original
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting up..."
echo "Backend: http://localhost:5002"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
