Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Placement Prep Platform" -ForegroundColor Cyan
Write-Host "  Backend:  Django (http://localhost:8000)" -ForegroundColor Cyan
Write-Host "  Frontend: React + Vite (http://localhost:5173)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; python manage.py runserver 0.0.0.0:8000"

Start-Sleep -Seconds 2

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\frontend'; npm run dev"

Start-Sleep -Seconds 3

# Open Browser
Start-Process "http://localhost:5173"

Write-Host "App launched! Access it at http://localhost:5173" -ForegroundColor Green

