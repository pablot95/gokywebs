# tools/demo-auto/vigilar.ps1 - demo automatica cuando llega el zip de imagenes de ChatGPT
# (Pablo, 18-oct-2026: "cuando llega el zip con las imagenes, que crees la carpeta en demo
# y crees el demo, obteniendo la info de cada prospecto (boton Copiar)... dejar la PC prendida").
#
# Lo corre una tarea de Windows cada 5 minutos (instalar-tarea.ps1). En cada corrida:
#   1. Busca en Descargas un .zip nuevo (posterior a la instalacion), ya bajado del todo,
#      con al menos 5 imagenes adentro.
#   2. preparar.php encuentra el prospecto (id o nombre del negocio en el nombre del zip)
#      y escribe el pedido = el texto del boton "Copiar" del admin.
#   3. Copia las imagenes a demo\<carpeta>\images\ y lanza Claude Code sin ventana con
#      Opus en esfuerzo extra (xhigh), que arma y publica la demo como siempre.
#   4. Mueve el zip a Descargas\demos-auto\procesados (o sin-asignar), deja todo en
#      data\log.txt y avisa con una notificacion de Windows.
# Una demo por vez: si hay otra corriendo, sale. Este archivo va sin tildes (PowerShell 5.1
# lee los .ps1 sin BOM como ANSI); los textos con tildes estan en instrucciones.md.

# -Simular: hace todo menos lanzar Claude. -Descargas / -Datos: otras carpetas (para probar).
param([switch]$Simular, [string]$Descargas = (Join-Path $env:USERPROFILE 'Downloads'), [string]$Datos = (Join-Path $PSScriptRoot 'data'))

$ErrorActionPreference = 'Stop'
$Repo       = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$Claude     = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
$Modelo     = 'opus'
$Esfuerzo   = 'xhigh'
$Permisos   = 'auto'
$Log       = Join-Path $Datos 'log.txt'
$ArchivoEstado = Join-Path $Datos 'estado.json'
$Candado    = Join-Path $Datos 'corriendo.lock'
$Utf8       = New-Object System.Text.UTF8Encoding($false)

New-Item -ItemType Directory -Force -Path $Datos, (Join-Path $Datos 'pedidos'), (Join-Path $Datos 'sesiones') | Out-Null

function Anotar([string]$texto) {
    $linea = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $texto
    [IO.File]::AppendAllText($Log, $linea + "`r`n", $Utf8)
}

function Avisar([string]$titulo, [string]$texto) {
    try {
        [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
        $xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
        $nodos = $xml.GetElementsByTagName('text')
        $nodos.Item(0).AppendChild($xml.CreateTextNode($titulo)) | Out-Null
        $nodos.Item(1).AppendChild($xml.CreateTextNode($texto)) | Out-Null
        $app = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
        [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($app).Show([Windows.UI.Notifications.ToastNotification]::new($xml))
    } catch { Anotar ('No se pudo mostrar la notificacion: ' + $_.Exception.Message) }
}

function Leer-Estado {
    if (Test-Path $ArchivoEstado) { return ([IO.File]::ReadAllText($ArchivoEstado, $Utf8) | ConvertFrom-Json) }
    # Primera corrida: solo cuentan los zips que lleguen desde ahora (no los viejos de Descargas).
    $e = [pscustomobject]@{ desde = (Get-Date).ToString('o'); hechos = @() }
    Guardar-Estado $e
    Anotar ('Vigilancia iniciada: zips de Descargas desde ' + $e.desde)
    return $e
}

function Guardar-Estado($e) { [IO.File]::WriteAllText($ArchivoEstado, [string]($e | ConvertTo-Json -Depth 5), $Utf8) }

function Marcar($e, $zip, [string]$resultado) {
    $e.hechos = @($e.hechos) + [pscustomobject]@{ zip = $zip.Name; tam = $zip.Length; fecha = (Get-Date).ToString('o'); resultado = $resultado }
    Guardar-Estado $e
}

function Mover-Zip($zip, [string]$sub) {
    $dest = Join-Path $Descargas ('demos-auto\' + $sub)
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    $destino = Join-Path $dest $zip.Name
    if (Test-Path $destino) { $destino = Join-Path $dest ((Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + $zip.Name) }
    Move-Item -LiteralPath $zip.FullName -Destination $destino
}

function Imagenes-Del-Zip([string]$ruta) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $z = [IO.Compression.ZipFile]::OpenRead($ruta)
    try { return @($z.Entries | Where-Object { $_.Name -match '\.(png|jpe?g|webp)$' -and $_.FullName -notmatch '__MACOSX' }) }
    finally { $z.Dispose() }
}

function Libre([string]$ruta) {
    try { $f = [IO.File]::Open($ruta, 'Open', 'Read', 'None'); $f.Close(); return $true } catch { return $false }
}

# --- Una demo por vez ---
if (Test-Path $Candado) {
    $pidViejo = [IO.File]::ReadAllText($Candado).Trim()
    if ($pidViejo -and (Get-Process -Id $pidViejo -ErrorAction SilentlyContinue)) { exit 0 }
    Remove-Item $Candado -Force
}
[IO.File]::WriteAllText($Candado, [string]$PID)

try {
    $estado = Leer-Estado
    $desde = [datetime]::Parse($estado.desde)
    $hechos = @($estado.hechos | ForEach-Object { $_.zip + '|' + $_.tam })
    $zips = Get-ChildItem -LiteralPath $Descargas -Filter '*.zip' -File |
        Where-Object { $_.LastWriteTime -gt $desde -and $_.LastWriteTime -lt (Get-Date).AddSeconds(-90) -and ($hechos -notcontains ($_.Name + '|' + $_.Length)) } |
        Sort-Object LastWriteTime
    foreach ($zip in $zips) {
        if (-not (Libre $zip.FullName)) { continue }   # todavia se esta bajando
        $imgs = Imagenes-Del-Zip $zip.FullName
        if ($imgs.Count -lt 5) {
            Anotar ('Ignorado (no son las imagenes de una demo, ' + $imgs.Count + ' imagenes): ' + $zip.Name)
            Marcar $estado $zip 'ignorado'
            continue
        }

        # --- El prospecto y el pedido ---
        [Console]::OutputEncoding = $Utf8
        # Con 'Stop', un aviso de PHP por stderr cortaria el script (PowerShell 5.1).
        $ErrorActionPreference = 'Continue'
        $salida = & php (Join-Path $PSScriptRoot 'preparar.php') $zip.FullName 2>$null
        $ErrorActionPreference = 'Stop'
        $r = ($salida | Out-String) | ConvertFrom-Json
        if (-not $r.ok) {
            Anotar ('SIN ASIGNAR ' + $zip.Name + ': ' + $r.error)
            Mover-Zip $zip 'sin-asignar'
            Marcar $estado $zip ('sin asignar: ' + $r.error)
            Avisar 'Demo automatica: zip sin asignar' ($zip.Name + ' - ' + $r.error)
            continue
        }

        # --- Las imagenes a demo\<carpeta>\images ---
        $images = Join-Path $r.carpeta 'images'
        New-Item -ItemType Directory -Force -Path $images | Out-Null
        $tmp = Join-Path $env:TEMP ('demo-auto-' + [guid]::NewGuid().ToString('N'))
        Expand-Archive -LiteralPath $zip.FullName -DestinationPath $tmp -Force
        $copiadas = 0
        Get-ChildItem -LiteralPath $tmp -Recurse -File | Where-Object { $_.Name -match '\.(png|jpe?g|webp)$' -and $_.FullName -notmatch '__MACOSX' } | ForEach-Object {
            $dest = Join-Path $images $_.Name
            if (Test-Path $dest) { $dest = Join-Path $images ($_.BaseName + '-' + $copiadas + $_.Extension) }
            Copy-Item -LiteralPath $_.FullName -Destination $dest
            $copiadas++
        }
        Remove-Item -LiteralPath $tmp -Recurse -Force
        Anotar ('Zip ' + $zip.Name + ' -> ' + $r.slug + ' (prospecto ' + $r.id + '), ' + $copiadas + ' imagenes en demo\' + $r.slug + '\images')

        # --- El pedido completo para la sesion ---
        $sesion = Join-Path $Datos ('sesiones\' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + $r.slug)
        $pedido = $sesion + '.md'
        $texto = [IO.File]::ReadAllText((Join-Path $PSScriptRoot 'instrucciones.md'), $Utf8) + [IO.File]::ReadAllText($r.pedido, $Utf8)
        [IO.File]::WriteAllText($pedido, $texto, $Utf8)
        $relativo = if ($pedido.StartsWith($Repo + '\')) { $pedido.Substring($Repo.Length + 1).Replace('\', '/') } else { $pedido }

        if ($Simular) {
            Anotar ('SIMULADO: no se lanzo Claude. Pedido en ' + $relativo)
            Marcar $estado $zip 'simulado'
            break
        }

        # --- Claude Code sin ventana, Opus en esfuerzo extra ---
        if (-not (Test-Path $Claude)) { throw ('No esta instalado Claude Code en ' + $Claude) }
        $argumentos = '-p "Lee el archivo ' + $relativo + ' y segui sus instrucciones al pie de la letra." ' +
                      '--model ' + $Modelo + ' --effort ' + $Esfuerzo + ' --permission-mode ' + $Permisos + ' --output-format json'
        Anotar ('Lanzando Claude (' + $Modelo + ', esfuerzo ' + $Esfuerzo + ') para ' + $r.slug)
        $inicio = Get-Date
        $p = Start-Process -FilePath $Claude -ArgumentList $argumentos -WorkingDirectory $Repo -NoNewWindow -Wait -PassThru `
                           -RedirectStandardOutput ($sesion + '.json') -RedirectStandardError ($sesion + '.err.txt')
        $minutos = [math]::Round(((Get-Date) - $inicio).TotalMinutes)
        $final = ''
        try {
            $j = [IO.File]::ReadAllText($sesion + '.json', $Utf8) | ConvertFrom-Json
            $final = (($j.result -split "`n") | Where-Object { $_.Trim() } | Select-Object -Last 1)
        } catch { $final = 'sin respuesta legible (codigo ' + $p.ExitCode + ')' }
        Mover-Zip $zip 'procesados'
        Marcar $estado $zip $final
        Anotar ('Termino ' + $r.slug + ' en ' + $minutos + ' min: ' + $final)
        if ($final -match '^DEMO OK') { Avisar ('Demo lista: ' + $r.nombre) $final }
        else { Avisar ('Demo con problemas: ' + $r.nombre) $final }
        break   # una por corrida: la proxima corrida sigue con el zip que venga
    }
} catch {
    Anotar ('ERROR: ' + $_.Exception.Message)
    Avisar 'Demo automatica: error' $_.Exception.Message
} finally {
    Remove-Item $Candado -Force -ErrorAction SilentlyContinue
}
