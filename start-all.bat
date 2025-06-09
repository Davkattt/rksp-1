@echo off
echo Starting Course Store (Frontend + Backend)...
start "Backend" cmd /k "start-backend.bat"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "start-frontend.bat"
echo.
echo Course Store is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
