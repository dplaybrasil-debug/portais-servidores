@echo off
echo Abrindo Portal dos Apps...

:: Tenta abrir com Chrome (permite carregar arquivos locais)
set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
set "CHROME_X86=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
set "DIR=%~dp0"
set "URL=file:///%DIR:\=/%index.html"
set "URL=%URL: =%%20%"

if exist "%CHROME%" (
    echo Usando Google Chrome...
    start "" "%CHROME%" --allow-file-access-from-files --disable-web-security --user-data-dir="%TEMP%\chrome_portal" "%DIR%index.html"
    goto :fim
)

if exist "%CHROME_X86%" (
    echo Usando Google Chrome x86...
    start "" "%CHROME_X86%" --allow-file-access-from-files --disable-web-security --user-data-dir="%TEMP%\chrome_portal" "%DIR%index.html"
    goto :fim
)

if exist "%EDGE%" (
    echo Usando Microsoft Edge...
    start "" "%EDGE%" --allow-file-access-from-files --disable-web-security --user-data-dir="%TEMP%\edge_portal" "%DIR%index.html"
    goto :fim
)

echo Nenhum browser encontrado! Abrindo com padrao do sistema...
start "" "%DIR%index.html"

:fim
echo Pronto!
