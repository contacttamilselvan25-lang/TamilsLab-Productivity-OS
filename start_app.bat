@echo off
title Tamil'slab Productivity App
echo Starting Tamil'slab Productivity App (Standalone Window)...
cd /d "%~dp0"

netstat -o -n -a | findstr ":3000" > nul
if %ERRORLEVEL% neq 0 (
    echo Starting local offline app server...
    start "Tamil'slab Server" /min cmd /c "npm run dev"
    timeout /t 3 /nobreak > nul
)

where msedge >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start msedge --app=http://localhost:3000 --user-data-dir="%LOCALAPPDATA%\TamilslabApp"
    exit /b
)

where chrome >nul 2>&1
if %ERRORLEVEL% equ 0 (
    start chrome --app=http://localhost:3000 --user-data-dir="%LOCALAPPDATA%\TamilslabApp"
    exit /b
)

start http://localhost:3000
