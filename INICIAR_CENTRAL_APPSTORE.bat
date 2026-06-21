@echo off
cd /d "%~dp0Central AppStore"
title Central AppStore - PHP Server
"C:\Users\dimil\.gemini\antigravity\scratch\AppStore\php\php.exe" -S localhost:8003 -t "%~dp0Central AppStore"
