# tools/demo-auto/instalar-tarea.ps1 - registra (o borra con -Desinstalar) la tarea de Windows
# que corre vigilar.ps1 cada 20 minutos mientras la sesion de Pablo esta abierta.
# Desde el 29-oct solo baja las imagenes de los prospectos (-Modo imagenes): las demos las hace
# la tarea programada de Claude Desktop "Demo automatica" (para que figuren en sus sesiones).
#   powershell -ExecutionPolicy Bypass -File tools\demo-auto\instalar-tarea.ps1
#   powershell -ExecutionPolicy Bypass -File tools\demo-auto\instalar-tarea.ps1 -Desinstalar
# Sin ventana (conhost --headless): no parpadea nada mientras se usa la PC.
# Instancias en paralelo (vigilar.ps1 limita a $Maximo demos a la vez) y hasta 6 horas por
# corrida (una demo en esfuerzo extra tarda).

param([switch]$Desinstalar)

$nombre = 'Gokywebs - demo automatica'
if ($Desinstalar) {
    Unregister-ScheduledTask -TaskName $nombre -Confirm:$false
    "Tarea borrada: $nombre"
    exit 0
}

$vigilar = Join-Path $PSScriptRoot 'vigilar.ps1'
$accion = New-ScheduledTaskAction -Execute 'conhost.exe' `
    -Argument ('--headless powershell.exe -NoProfile -ExecutionPolicy Bypass -File "' + $vigilar + '" -Modo imagenes')
$disparador = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 20)
$ajustes = New-ScheduledTaskSettingsSet -MultipleInstances Parallel -ExecutionTimeLimit (New-TimeSpan -Hours 6) `
    -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$quien = New-ScheduledTaskPrincipal -UserId ($env:USERDOMAIN + '\' + $env:USERNAME) -LogonType Interactive -RunLevel Limited
Register-ScheduledTask -TaskName $nombre -Action $accion -Trigger $disparador -Settings $ajustes -Principal $quien -Force | Out-Null
"Tarea registrada: $nombre (cada 20 minutos). Log: " + (Join-Path $PSScriptRoot 'data\log.txt')
