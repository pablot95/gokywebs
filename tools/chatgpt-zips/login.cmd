@echo off
rem Abre Chrome (perfil propio de esta herramienta) para iniciar sesion en ChatGPT una vez.
rem Despues los zips de "Gokywebs Copiar 10" se bajan solos (instalar-tarea.ps1).
"C:\Python312\python.exe" "%~dp0bajar.py" --login
pause
