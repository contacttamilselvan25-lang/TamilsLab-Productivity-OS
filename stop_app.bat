@echo off
title Stop Tamil'slab Productivity App
echo Stopping Tamil'slab Productivity App server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo App server stopped successfully!
timeout /t 2 > nul
