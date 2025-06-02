@echo off
:: start-all-simple.bat - Start Course Store with simple database setup

echo ========================================
echo  Course Store - Simple Start
echo ========================================
echo.

:: Fix database first
echo [INFO] Setting up database...
python fix-db-simple.py
if errorlevel 1 (
    echo [ERROR] Database setup failed
    pause
    exit /b 1
)

echo.
echo [INFO] Starting backend...
cd backend
call venv\Scripts\activate

:: Start backend in background
start "Course Store Backend" cmd /c "call venv\Scripts\activate && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait a moment
timeout /t 3 /nobreak > nul

:: Start frontend
echo [INFO] Starting frontend...
cd ..\frontend
start "Course Store Frontend" cmd /c "npm run dev"

echo.
echo ✅ Course Store is starting!
echo.
echo 🔗 Access URLs:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo.
echo 👥 Test Accounts:
echo    admin@coursestore.ru / admin123
echo    test@example.com / test123
echo.
echo Press any key to close this window...
pause > nul