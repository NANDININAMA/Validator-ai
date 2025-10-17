@echo off
echo Starting Startup Validator Development Environment...
echo.

echo Starting Backend Server...
cd Backend
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
cd ..\frontend_original
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:5002
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
