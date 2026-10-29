# tools/demo-auto/vigilar.ps1 - demo automatica cuando llega el zip de imagenes de ChatGPT
# (Pablo, 18-oct-2026: "cuando llega el zip con las imagenes, que crees la carpeta en demo
# y crees el demo, obteniendo la info de cada prospecto (boton Copiar)... dejar la PC prendida").
#
# Lo corre una tarea de Windows cada 20 minutos (instalar-tarea.ps1; 29-oct: "con Opus extra,
# que se creen solos cuando esten las imagenes descargadas, cada 20 mins"). En cada corrida:
#   1. Busca en Descargas un .zip nuevo (posterior a la instalacion), bajado hace +15 min,
#      con al menos 5 imagenes adentro. Si trae otros zips adentro ("Descargar todas"),
#      los abre en Descargas y se procesan como zips sueltos.
#   2. preparar.php encuentra el prospecto (id o nombre del negocio en el nombre del zip)
#      y escribe el pedido = el texto del boton "Copiar" del admin.
#   3. Copia las imagenes a demo\<carpeta>\images\ y lanza Claude Code sin ventana con
#      Opus en esfuerzo extra (xhigh), que arma y publica la demo como siempre.
#   4. Mueve el zip a Descargas\demos-auto\procesados (o sin-asignar), deja todo en
#      data\log.txt y avisa con una notificacion de Windows.
# Hasta $Maximo demos al mismo tiempo (18-oct: "hay un monton para hacer"): cada corrida que
# encuentra un zip libre lo reclama (queda 'en proceso' en estado.json) y hace su demo; la tarea
# de Windows tiene que permitir instancias en paralelo (MultipleInstances = Parallel).
# Si quedo una demo del script viejo corriendo (corriendo.lock), espera a que termine.
# Este archivo va sin tildes (PowerShell 5.1 lee los .ps1 sin BOM como ANSI); los textos con
# tildes estan en instrucciones.md.

# -Simular: hace todo menos lanzar Claude. -Descargas / -Datos: otras carpetas (para probar).
param([switch]$Simular, [string]$Descargas = (Join-Path $env:USERPROFILE 'Downloads'), [string]$Datos = (Join-Path $PSScriptRoot 'data'))

$ErrorActionPreference = 'Stop'
$Repo       = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$Claude     = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
$Modelo     = 'opus'
$Esfuerzo   = 'xhigh'
$Permisos   = 'auto'
$Maximo     = 5     # demos al mismo tiempo (cada una es una sesion de Opus xhigh: gasta cuota)
$Log       = Join-Path $Datos 'log.txt'
$ArchivoEstado = Join-Path $Datos 'estado.json'
$Candado    = Join-Path $Datos 'corriendo.lock'   # el del script viejo (una demo por vez)
$Slots      = Join-Path $Datos 'slots'            # un archivo por corrida con demo en curso (nombre = PID)
$Utf8       = New-Object System.Text.UTF8Encoding($false)
$Mutex      = New-Object System.Threading.Mutex($false, 'Global\GokywebsDemoAuto')

New-Item -ItemType Directory -Force -Path $Datos, (Join-Path $Datos 'pedidos'), (Join-Path $Datos 'sesiones'), $Slots | Out-Null

function Anotar([string]$texto) {
    $linea = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $texto
    for ($i = 0; $i -lt 5; $i++) {   # varias corridas escriben el mismo log
        try { [IO.File]::AppendAllText($Log, $linea + "`r`n", $Utf8); return } catch { Start-Sleep -Milliseconds 200 }
    }
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

# Todo lo que lee y escribe estado.json (y los slots) pasa por este candado entre corridas.
function Bajo-Candado([scriptblock]$bloque) {
    $tomado = $false
    try { $tomado = $Mutex.WaitOne(60000) } catch [System.Threading.AbandonedMutexException] { $tomado = $true }
    if (-not $tomado) { throw 'No se pudo tomar el candado del estado' }
    try { & $bloque } finally { $Mutex.ReleaseMutex() }
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

# Anota (o actualiza) el resultado de un zip: la clave es nombre + tamanio.
function Marcar($zip, [string]$resultado) {
    Bajo-Candado {
        $e = Leer-Estado
        $clave = $zip.Name + '|' + $zip.Length
        $otros = @($e.hechos | Where-Object { ($_.zip + '|' + $_.tam) -ne $clave })
        $e.hechos = $otros + [pscustomobject]@{ zip = $zip.Name; tam = $zip.Length; fecha = (Get-Date).ToString('o'); resultado = $resultado }
        Guardar-Estado $e
    }
}

# Devuelve el proximo zip libre y lo deja reclamado ('en proceso'), o $null si no hay o ya
# hay $Maximo demos en curso. Tambien deja el slot de esta corrida.
function Reclamar-Siguiente {
    Bajo-Candado {
        # 15 min: tools/chatgpt-zips/subir.py (cada 10 min) ya lo subio a la ficha antes de moverlo.
        Get-ChildItem -LiteralPath $Slots -File | Where-Object { -not (Get-Process -Id ([int]$_.BaseName) -ErrorAction SilentlyContinue) } | Remove-Item -Force
        $ajenos = @(Get-ChildItem -LiteralPath $Slots -File | Where-Object { $_.BaseName -ne [string]$PID })
        if ($ajenos.Count -ge $Maximo) { return $null }
        $e = Leer-Estado
        $desde = [datetime]::Parse($e.desde)
        $hechos = @($e.hechos | ForEach-Object { $_.zip + '|' + $_.tam })
        $zips = Get-ChildItem -LiteralPath $Descargas -Filter '*.zip' -File |
            Where-Object { $_.LastWriteTime -gt $desde -and $_.LastWriteTime -lt (Get-Date).AddMinutes(-15) -and ($hechos -notcontains ($_.Name + '|' + $_.Length)) } |
            Sort-Object LastWriteTime
        foreach ($z in $zips) {
            if (-not (Libre $z.FullName)) { continue }   # todavia se esta bajando
            [IO.File]::WriteAllText((Join-Path $Slots ([string]$PID)), $z.Name, $Utf8)
            $e.hechos = @($e.hechos) + [pscustomobject]@{ zip = $z.Name; tam = $z.Length; fecha = (Get-Date).ToString('o'); resultado = 'en proceso' }
            Guardar-Estado $e
            return $z
        }
        return $null
    }
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

function Zips-Del-Zip([string]$ruta) {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $z = [IO.Compression.ZipFile]::OpenRead($ruta)
    try { return @($z.Entries | Where-Object { $_.Name -match '\.zip$' -and $_.FullName -notmatch '__MACOSX' }) }
    finally { $z.Dispose() }
}

function Libre([string]$ruta) {
    try { $f = [IO.File]::Open($ruta, 'Open', 'Read', 'None'); $f.Close(); return $true } catch { return $false }
}

# --- Si quedo corriendo una demo del script viejo (una por vez), esperar a que termine ---
if (Test-Path $Candado) {
    $pidViejo = [IO.File]::ReadAllText($Candado).Trim()
    if ($pidViejo -and (Get-Process -Id $pidViejo -ErrorAction SilentlyContinue)) { exit 0 }
    Remove-Item $Candado -Force
}

# --- Imagenes de los prospectos nuevos a Descargas\imagenes-prospectos\<negocio> (29-oct) ---
# Una corrida por vez (la baja cada 5 min alcanza); si falla, no frena las demos.
function Bajar-Imagenes-Prospectos {
    try {
        $ErrorActionPreference = 'Continue'
        $lineas = @(& php (Join-Path $PSScriptRoot 'bajar-imagenes.php') 2>$null)
        $ErrorActionPreference = 'Stop'
        foreach ($l in $lineas) {
            if (-not "$l".Trim().StartsWith('{')) { continue }
            $r = "$l" | ConvertFrom-Json
            $dest = Join-Path $Descargas ('imagenes-prospectos\' + $r.slug)
            New-Item -ItemType Directory -Force -Path $dest | Out-Null
            Expand-Archive -LiteralPath $r.zip -DestinationPath $dest -Force
            Remove-Item -LiteralPath $r.zip -Force
            Anotar ('Imagenes de ' + $r.nombre + ' -> ' + $dest)
            Avisar 'Imagenes del prospecto' ($r.nombre + ' - ya estan en Descargas')
        }
    } catch { Anotar ('No se pudieron bajar las imagenes de los prospectos: ' + $_.Exception.Message) }
    finally { $ErrorActionPreference = 'Stop' }
}
Bajar-Imagenes-Prospectos

$zip = $null
try {
    while ($zip = Reclamar-Siguiente) {
        $imgs = Imagenes-Del-Zip $zip.FullName
        # "Descargar todas" del admin baja un zip que trae un zip por prospecto: se abren en
        # Descargas (cada uno con su nombre) y se procesan como zips sueltos.
        if ($imgs.Count -lt 5) {
            $internos = @(Zips-Del-Zip $zip.FullName)
            if ($internos.Count -gt 0) {
                $tmpC = Join-Path $env:TEMP ('demo-auto-c-' + [guid]::NewGuid().ToString('N'))
                Expand-Archive -LiteralPath $zip.FullName -DestinationPath $tmpC -Force
                foreach ($f in (Get-ChildItem -LiteralPath $tmpC -Recurse -File -Filter '*.zip')) {
                    $dest = Join-Path $Descargas $f.Name
                    if (Test-Path $dest) { $dest = Join-Path $Descargas ((Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + $f.Name) }
                    Move-Item -LiteralPath $f.FullName -Destination $dest
                    (Get-Item -LiteralPath $dest).LastWriteTime = Get-Date
                }
                Remove-Item -LiteralPath $tmpC -Recurse -Force
                Anotar ('Contenedor abierto (' + $internos.Count + ' zips adentro): ' + $zip.Name)
                Mover-Zip $zip 'contenedores'
                Marcar $zip 'contenedor'
                continue
            }
            Anotar ('Ignorado (no son las imagenes de una demo, ' + $imgs.Count + ' imagenes): ' + $zip.Name)
            Marcar $zip 'ignorado'
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
            Marcar $zip ('sin asignar: ' + $r.error)
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
            Marcar $zip 'simulado'
            break
        }

        # --- Claude Code sin ventana, Opus en esfuerzo extra ---
        if (-not (Test-Path $Claude)) { throw ('No esta instalado Claude Code en ' + $Claude) }
        $argumentos = '-p "Lee el archivo ' + $relativo + ' y segui sus instrucciones al pie de la letra." ' +
                      '--model ' + $Modelo + ' --effort ' + $Esfuerzo + ' --permission-mode ' + $Permisos + ' --output-format stream-json --verbose'
        Anotar ('Lanzando Claude (' + $Modelo + ', esfuerzo ' + $Esfuerzo + ') para ' + $r.slug)
        $inicio = Get-Date
        $p = Start-Process -FilePath $Claude -ArgumentList $argumentos -WorkingDirectory $Repo -NoNewWindow -Wait -PassThru `
                           -RedirectStandardOutput ($sesion + '.json') -RedirectStandardError ($sesion + '.err.txt')
        $minutos = [math]::Round(((Get-Date) - $inicio).TotalMinutes)
        $final = ''
        try {
            # stream-json: una linea JSON por evento; la del resultado trae "type":"result" (no siempre al principio).
            $lineaFinal = [IO.File]::ReadAllLines($sesion + '.json', $Utf8) | Where-Object { $_ -match '"type":"result"' } | Select-Object -Last 1
            $j = $lineaFinal | ConvertFrom-Json
            $final = (($j.result -split "`n") | Where-Object { $_.Trim() } | Select-Object -Last 1)
        } catch { $final = 'sin respuesta legible (codigo ' + $p.ExitCode + ')' }
        Mover-Zip $zip 'procesados'
        Marcar $zip $final
        Anotar ('Termino ' + $r.slug + ' en ' + $minutos + ' min: ' + $final)
        if ($final -match '^DEMO OK') {
            # Deja prendido "Boceto hecho" en la fila del prospecto (propuestas/<id>.bocetoHecho).
            $ErrorActionPreference = 'Continue'
            $m = (& php (Join-Path $PSScriptRoot 'marcar-boceto.php') $r.id 2>$null | Out-String)
            $ErrorActionPreference = 'Stop'
            Anotar ('Boceto hecho de ' + $r.slug + ': ' + $m.Trim())
            Avisar ('Demo lista: ' + $r.nombre) $final
        }
        else { Avisar ('Demo con problemas: ' + $r.nombre) $final }
        # sigue el while: toma el proximo zip libre si hay lugar
    }
} catch {
    Anotar ('ERROR: ' + $_.Exception.Message)
    Avisar 'Demo automatica: error' $_.Exception.Message
    if ($zip) { try { Marcar $zip ('error: ' + $_.Exception.Message) } catch {} }
} finally {
    Remove-Item -LiteralPath (Join-Path $Slots ([string]$PID)) -Force -ErrorAction SilentlyContinue
}
