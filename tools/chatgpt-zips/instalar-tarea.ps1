# tools/chatgpt-zips/instalar-tarea.ps1 - registra (o borra con -Desinstalar) la tarea de Windows
# que corre subir.py cada 10 minutos mientras la sesion de Pablo esta abierta: sube a la ficha del
# prospecto los zips de "Gokywebs Copiar 10" que la extension de Chrome bajo a Descargas.
#   powershell -ExecutionPolicy Bypass -File tools\chatgpt-zips\instalar-tarea.ps1
#   powershell -ExecutionPolicy Bypass -File tools\chatgpt-zips\instalar-tarea.ps1 -Desinstalar
# La extension (tools\chatgpt-zips\extension) se instala aparte en Chrome.

param([switch]$Desinstalar)

$nombre = 'Gokywebs - zips de ChatGPT'
if ($Desinstalar) {
    Unregister-ScheduledTask -TaskName $nombre -Confirm:$false
    "Tarea borrada: $nombre"
    exit 0
}

$subir = Join-Path $PSScriptRoot 'subir.py'
# pythonw: sin ventana de consola.
$accion = New-ScheduledTaskAction -Execute 'C:\Python312\pythonw.exe' -Argument ('"' + $subir + '"')
$disparador = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 10)
$ajustes = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
    -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$quien = New-ScheduledTaskPrincipal -UserId ($env:USERDOMAIN + '\' + $env:USERNAME) -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $nombre -Action $accion -Trigger $disparador -Settings $ajustes -Principal $quien -Force | Out-Null
"Tarea registrada: $nombre (cada 10 minutos). Log: " + (Join-Path $PSScriptRoot 'data\log.txt')
