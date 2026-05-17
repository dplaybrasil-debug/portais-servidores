@echo off
echo =========================================
echo   Iniciando Servidor Portal dos Apps
echo =========================================
echo.
echo Site Principal: http://localhost:9090/index.html
echo Painel Admin:   http://localhost:9090/admin.html
echo Gerenciar:      http://localhost:9090/partners-manager.html
echo.
echo Para parar o servidor, feche esta janela ou pressione Ctrl+C.
echo.

cd /d "%~dp0"

:: Iniciar servidor em background
start /B python server_manager.py

:: Aguardar 2 segundos para o servidor subir
timeout /t 2 /nobreak > nul

:: Abrir o portal no navegador automaticamente
echo Abrindo portal no navegador...
start "" "http://localhost:9090/index.html"

echo.
echo [OK] Servidor rodando! Portal aberto no navegador.
echo [!]  Nao feche esta janela - o servidor ficara ativo.
echo.

:: Manter a janela aberta com o servidor rodando
python server_manager.py

echo.
echo [!] Servidor encerrado.
echo [!] Se apareceu erro, verifique se o Python esta instalado.
echo [!] Baixe em: https://www.python.org/downloads/
pause
