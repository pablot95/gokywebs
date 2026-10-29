# tools/chatgpt-zips/instalar-tarea.ps1 - registra (o borra con -Desinstalar) la tarea de Windows
# que corre bajar.py cada 10 minutos mientras la sesion de Pablo esta abierta: baja a Descargas
# los zips nuevos de la tarea de ChatGPT "Gokywebs Copiar 10" y los sube a la ficha del prospecto.
#   powershell -ExecutionPolicy Bypass -File tools\chatgpt-zips\instalar-tarea.ps1
#   powershell -ExecutionPolicy Bypass -File tools\chatgpt-zips\instalar-tarea.ps1 -Desinstalar
# Antes, una vez: tools\chatgpt-zips\login.cmd (iniciar sesion en ChatGPT).

param([switch]$Desinstalar)

$nombre = 'Gokywebs - zips de ChatGPT'
if ($Desinstalar) {
    Unregister-ScheduledTask -TaskName $nombre -Confirm:$false
    "Tarea borrada: $nombre"
    exit 0
}

$bajar = Join-Path $PSScriptRoot 'bajar.py'
# pythonw: sin ventana de consola.
$accion = New-ScheduledTaskAction -Execute 'C:\Python312\pythonw.exe' -Argument ('"' + $bajar + '"')
$disparador = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 10)
$ajustes = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
    -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$quien = New-ScheduledTaskPrincipal -UserId ($env:USERDOMAIN + '\' + $env:USERNAME) -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $nombre -Action $accion -Trigger $disparador -Settings $ajustes -Principal $quien -Force | Out-Null
"Tarea registrada: $nombre (cada 10 minutos). Log: " + (Join-Path $PSScriptRoot 'data\log.txt')
