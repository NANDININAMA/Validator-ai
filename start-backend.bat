@echo off
echo Starting Backend Server with In-Memory Database...
cd Backend
set USE_IN_MEMORY_DB=true
set JWT_SECRET=dev-secret-change-me
echo Environment variables set:
echo USE_IN_MEMORY_DB=%USE_IN_MEMORY_DB%
echo JWT_SECRET=%JWT_SECRET%
echo.
echo Starting server...
node server.js
pause
