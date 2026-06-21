@echo off
cd /d "%~dp0"
title Servidores - PHP Server
php -S localhost:8000 -t "Servidores Info"
