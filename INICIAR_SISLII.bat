@echo off
title Sislii ERP / POS - NYCE STORE
cd /d "%~dp0"
echo ===================================================
echo   Iniciando Sislii (NYCE STORE) en puerto 3000...
echo   URL: http://localhost:3000/dashboard
echo ===================================================
start "" "http://localhost:3000/dashboard"
"C:\laragon\bin\nodejs\node-v18\node.exe" server.js
pause
