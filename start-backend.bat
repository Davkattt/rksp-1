@echo off
echo Starting Course Store Backend (SQLite)...
cd backend
call venv\Scripts\activate
set PYTHONPATH=%CD%
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
