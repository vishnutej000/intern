@echo off
echo Starting SecureSight Dashboard...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: %NEXT_PUBLIC_BACKEND_URL%
echo Frontend: http://localhost:3000
echo.
pause