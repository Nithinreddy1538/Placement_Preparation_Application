@echo off
title Placement Prep App Starter
echo ========================================================
echo   Starting Placement Prep Platform
echo   Backend:  Django (http://localhost:8000)
echo   Frontend: React + Vite (http://localhost:5173)
echo ========================================================

cd /d "%~dp0"

echo [1/3] Starting Django Backend...
start "Placement Prep Backend" cmd /k "cd /d "%~dp0backend" && python manage.py runserver 0.0.0.0:8000"

timeout /t 2 /nobreak > nul

echo [2/3] Starting Vite Frontend...
start "Placement Prep Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak > nul

echo [3/3] Opening Browser...
start http://localhost:5173

echo ========================================================
echo   App is now running! Keep the terminal windows open.
echo   To access the app, visit: http://localhost:5173
echo ========================================================

