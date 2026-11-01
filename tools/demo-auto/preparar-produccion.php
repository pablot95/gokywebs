<?php
/**
 * tools/demo-auto/preparar-produccion.php — el pedido para el agente que pasa la
 * demo a web definitiva (Pablo, 1-nov-2026: "mandarle todo a un agente que arme la
 * web a partir de la demo").
 *
 *   php tools/demo-auto/preparar-produccion.php            arma los pedidos que falten y los marca
 *   php tools/demo-auto/preparar-produccion.php --simular  los arma sin marcar nada (sufijo -simulado)
 *   php tools/demo-auto/preparar-produccion.php --solo=<slug o clave del chat>
 *
 * Para cada cliente de Firestore (`clientes`) con onboarding.completoAt y sin
 * produccion.pedidoAt (el bot ya le pidió todo por el chat, onboarding.php):
 *   1. baja del server el logo y las fotos que mandó (wabot/produccion.php,
 *      firmado con la cuenta de servicio) a data/produccion/<slug>/;
 *   2. escribe data/sesiones/<ts>-<slug>-produccion.md = instrucciones-produccion.md
 *      + el pedido: carpeta demo/<slug>/, modelo elegido, brief original del
 *      formulario (propuestaSnapshot, el mismo texto del botón Copiar), todo el
 *      onboarding (factura, dominios deseados, email del panel, cambios, datos),
 *      los archivos bajados, qué prompt_completar_<tipo>.md seguir y la
 *      checklist de lo que hace Pablo a mano (Firebase, dominio, DNS, factura);
 *   3. marca produccion.pedidoAt en el doc y produccion.pedido_ts en la charla
 *      (la pestaña Clientes pasa a "en producción").
 * Imprime un JSON por pedido: {ok, id, nombre, slug, pedido, archivos}; si no hay
 * nada, {"ok":false}. Solo por consola. La tarea de Desktop que lo lance (ver el
 * resumen del 1-nov) se crea a mano: acá no se toca la de las demos.
 */

if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

require_once __DIR__ . '/../../wabot/cron-prospectos-chatgpt.php';
require_once __DIR__ . '/../../wabot/produccion.php';

const PRODUCCION_URL = 'https://gokywebs.com/wabot/produccion.php';
const PRODUCCION_MEMORIA = 'C:\\Users\\pablo\\.claude\\projects\\C--Users-pablo\\memory';

/** Los clientes a los que les falta el pedido: onboarding completo y producción sin pedir. [id => doc]. */
function produccion_candidatos(array $docs, string $solo = ''): array {
    $out = [];
    foreach ($docs as $id => $c) {
        if (!is_array($c)) continue;
        $ob = (array)($c['onboarding'] ?? []);
        if (trim((string)($ob['completoAt'] ?? '')) === '') continue;
        if (trim((string)($c['produccion']['pedidoAt'] ?? '')) !== '') continue;
        if ($solo !== '' && !in_array($solo, [(string)$id, (string)($ob['slug'] ?? ''), (string)($ob['conversationKey'] ?? '')], true)) continue;
        $out[(string)$id] = $c;
    }
    return $out;
}

/** landing | ecommerce | elearning | inmobiliaria, del onboarding, del plan o del brief. */
function produccion_tipo(array $c): string {
    $t = (string)($c['onboarding']['tipo'] ?? '');
    if (in_array($t, ['landing', 'ecommerce', 'elearning', 'inmobiliaria'], true)) return $t;
    $pistas = implode(' ', [(string)($c['planLabel'] ?? ''), (string)($c['tipoDetectado'] ?? ''), (string)($c['tipoDetectadoLabel'] ?? ''),
        (string)($c['propuestaSnapshot']['tipo_web'] ?? ''), (string)($c['propuestaSnapshot']['tipoDetectado'] ?? '')]);
    $n = mb_strtolower($pistas);
    if (preg_match('/inmobil|propiedad/', $n)) return 'inmobiliaria';
    if (preg_match('/e-?commerce|tienda|catalogo|catálogo|shop|carrito/', $n)) return 'ecommerce';
    if (preg_match('/e-?learning|curso|academia/', $n)) return 'elearning';
    return 'landing';
}

/** El prompt de producción que corresponde (en la memoria compartida de Gokywebs). */
function produccion_prompt_de(string $tipo): string {
    $archivo = ['landing' => 'prompt_completar_landing.md', 'ecommerce' => 'prompt_completar_ecommerce.md',
                'elearning' => 'prompt_completar_cursos.md', 'inmobiliaria' => 'prompt_completar_inmobiliaria.md'][$tipo] ?? 'prompt_completar_landing.md';
    return PRODUCCION_MEMORIA . '\\' . $archivo;
}

function produccion_slug(array $c): string {
    $slug = preg_replace('/[^a-z0-9]/', '', (string)($c['onboarding']['slug'] ?? ''));
    if ($slug !== '') return $slug;
    [$nombre] = prospecto_chatgpt_negocio((array)($c['propuestaSnapshot'] ?? []));
    return prospecto_demo_slug($nombre ?: (string)($c['proyecto'] ?? ''));
}

function produccion_fecha($iso): string {
    $ts = is_string($iso) ? strtotime($iso) : 0;
    return $ts ? gmdate('j/n/Y H:i', $ts - 3 * 3600) : '—';
}

function produccion_monto($n): string {
    return '$' . number_format((int)$n, 0, ',', '.');
}

/**
 * El pedido en Markdown. $archivos: los nombres bajados (logo.pdf, foto-1.jpg…);
 * $carpetaArchivos: dónde quedaron; $avisos: lo que no se pudo (demo que no está, zip que no bajó).
 */
function produccion_pedido_texto(array $c, string $id, string $slug, string $tipo, array $archivos, string $carpetaArchivos, array $avisos = []): string {
    $ob = (array)($c['onboarding'] ?? []);
    $d = (array)($ob['datos'] ?? []);
    $snap = (array)($c['propuestaSnapshot'] ?? []);
    $valor = function ($paso) use ($d) { return isset($d[$paso]) && empty($d[$paso]['omitido']) ? ($d[$paso]['valor'] ?? null) : null; };
    $nota = function ($paso) use ($d) { return trim((string)($d[$paso]['nota'] ?? '')); };
    $negocio = trim((string)($c['proyecto'] ?? '')) ?: trim((string)($snap['nombre_negocio'] ?? '')) ?: $slug;
    $pago = (array)($c['pagoBot'] ?? []);
    $modalidad = ['mensual' => 'plan mensual', 'anual' => 'plan anual', 'unico' => 'pago único', 'inicial' => 'pago inicial + mensual'][(string)($pago['modalidad'] ?? '')] ?? (string)($c['modalidad'] ?? '');
    $modelo = (int)($valor('modelo') ?? 0);
    $factura = (array)($valor('factura') ?? []);
    $dominios = array_values(array_filter(array_map('strval', (array)($valor('dominio') ?? []))));
    $email = trim((string)($valor('email') ?? ''));
    $cambios = trim((string)($valor('cambios') ?? ''));
    $datos = trim((string)($valor('datos') ?? ''));
    $logos = array_values(array_filter($archivos, fn($a) => strpos($a, 'logo') === 0));
    $fotos = array_values(array_filter($archivos, fn($a) => strpos($a, 'foto') === 0));
    $tel = trim((string)($c['telefono'] ?? ''));
    $clave = (string)($ob['conversationKey'] ?? '');

    $L = [];
    $L[] = '# Pedido de producción: ' . $negocio . ' (demo/' . $slug . '/)';
    $L[] = '';
    $L[] = 'Cliente: ' . (trim((string)($c['nombre'] ?? '')) ?: '—') . ($tel !== '' ? ' · WhatsApp ' . $tel : '') . ($clave !== '' ? ' · chat del bot ' . $clave : '') . ' · ficha del admin `clientes/' . $id . '`';
    if ($pago) $L[] = 'Pagó: ' . produccion_monto($pago['monto'] ?? 0) . ' el ' . produccion_fecha($pago['at'] ?? '') . ' (' . $modalidad . ')' . (trim((string)($c['planLabel'] ?? '')) !== '' ? ' · plan ' . $c['planLabel'] : '');
    $L[] = 'Tipo de web: ' . $tipo . ' · onboarding completo el ' . produccion_fecha($ob['completoAt'] ?? '');
    foreach ($avisos as $a) $L[] = '> ⚠️ ' . $a;
    $L[] = '';
    $L[] = '## Qué hacer';
    $L[] = '- La demo está en `Gokywebsweb/demo/' . $slug . '/` (si no está en este checkout, `git pull` primero). Es la base: el front se mantiene, el backend se adopta del template.';
    $L[] = '- Modelo elegido: ' . ($modelo > 0 ? '**modelo ' . $modelo . '**' . ($modelo === 2 ? ' (modelo-2.html pasa a ser index.html)' : '') . '. Sacar el otro modelo y la barra Modelo 1 / Modelo 2.' : 'no eligió (' . ($nota('modelo') ?: 'quedó a elección del diseñador') . '): usar el modelo 1.');
    $L[] = '- Seguir el prompt de producción: `' . produccion_prompt_de($tipo) . '` (y `' . PRODUCCION_MEMORIA . '\\prompt_panel_editor_visual.md` para el panel).';
    $L[] = '- Dominio: ' . ($dominios ? 'quiere ' . implode(', ', array_map(fn($x) => '`' . $x . '`', $dominios)) . '. TODAVÍA NO ESTÁ COMPRADO: lo elige y compra Pablo. Usar `' . $dominios[0] . '` como provisorio, en un solo lugar (SITE_URL), para cambiarlo con un reemplazo.' : 'no propuso nombres (' . ($nota('dominio') ?: 'queda para Pablo') . '). Dejar SITE_URL con un valor provisorio claro.');
    $L[] = '- Email del admin del panel: ' . ($email !== '' ? '`' . $email . '` (ADMIN_EMAIL, firestore.rules, admin/firebase-config.js; la cuenta la crea Pablo en Firebase Auth).' : 'no lo dio: dejar el del template y anotarlo como pendiente de Pablo.');
    $L[] = '- Logo: ' . ($logos ? implode(', ', array_map(fn($x) => '`' . $x . '`', $logos)) . ' en `' . $carpetaArchivos . '`' . (array_filter($logos, fn($x) => str_ends_with($x, '.pdf')) ? ' (viene en PDF: extraerlo en alta)' : '') : 'no tiene (' . ($nota('logo') ?: 'armar un logotipo tipográfico como en la demo') . ').');
    $L[] = '- Fotos del cliente: ' . ($fotos ? count($fotos) . ' en `' . $carpetaArchivos . '` (' . implode(', ', $fotos) . '): reemplazan a las de la demo donde corresponda.' : 'no mandó: quedan las de la demo.');
    $L[] = '- Cambios que pidió respecto de la demo: ' . ($cambios !== '' ? "\n  > " . str_replace("\n", "\n  > ", $cambios) : 'ninguno (' . ($nota('cambios') ?: 'está bien así') . ').');
    $L[] = '- Horarios, dirección y redes: ' . ($datos !== '' ? "\n  > " . str_replace("\n", "\n  > ", $datos) : 'no los dio: dejar los de la demo marcados como a confirmar.');
    $L[] = '- Datos para la factura (NO van en la web; son para Pablo): ' . ($factura ? implode(' · ', array_filter([trim((string)($factura['razon_social'] ?? '')), ($factura['cuit'] ?? '') !== '' ? 'CUIT/CUIL ' . $factura['cuit'] : '', (string)($factura['iva'] ?? '')])) : 'no los dio (' . ($nota('factura') ?: 'pendiente') . ').');
    $L[] = '';
    $L[] = '## Brief original (lo que llenó en el formulario)';
    $L[] = $snap ? prospecto_chatgpt_datos($snap) : '(sin propuestaSnapshot en la ficha: mirar el chat ' . $clave . ')';
    $L[] = '';
    $L[] = '## Lo que hace Pablo a mano (checklist)';
    $L[] = '- [ ] Crear el proyecto de Firebase para ' . $negocio . ' (Firestore + Authentication con email y contraseña' . ($email !== '' ? ', usuario ' . $email : '') . '), pegar la config web en `admin/firebase-config.js`, bajar la cuenta de servicio al server del cliente (`config/service-account.json`, fuera del repo) y publicar `firestore.rules`.';
    $L[] = '- [ ] Elegir y comprar el dominio' . ($dominios ? ' entre ' . implode(', ', $dominios) : '') . ' (.com.ar incluido en el plan; .com tiene adicional), apuntar los DNS a Hostinger (o Cloudflare delante) y poner el definitivo en SITE_URL, canonical, OG, JSON-LD, robots.txt y sitemap.xml.';
    $L[] = '- [ ] Crear el sitio en Hostinger y el repo privado del cliente; configurar el deploy.';
    $L[] = '- [ ] Emitir la Factura C' . ($factura ? ' a ' . implode(', ', array_filter([trim((string)($factura['razon_social'] ?? '')), (string)($factura['cuit'] ?? ''), (string)($factura['iva'] ?? '')])) : ' (pedir los datos: el cliente no los pasó)') . '.';
    $L[] = '- [ ] Revisar la web terminada, mandarle el acceso al panel al cliente y marcar la entrega en el admin.';
    $L[] = '';
    return implode("\n", $L);
}

/* ── Red: Firestore y el server ────────────────────────────────────────── */

function produccion_fs_clientes(): array {
    $sa = wabot_push_cuenta();
    $ch = curl_init('https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents:runQuery');
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode(['structuredQuery' => [
            'from' => [['collectionId' => 'clientes']],
            'where' => ['fieldFilter' => ['field' => ['fieldPath' => 'estadoCliente'], 'op' => 'EQUAL', 'value' => ['stringValue' => 'cliente']]],
        ]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
    ]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http !== 200 || !is_array($filas = json_decode((string)$res, true))) throw new RuntimeException('No se pudo consultar clientes (HTTP ' . $http . ').');
    $docs = [];
    foreach ($filas as $fila) {
        if (empty($fila['document']['name'])) continue;
        $docs[basename($fila['document']['name'])] = array_map('prospecto_chatgpt_firestore_valor', $fila['document']['fields'] ?? []);
    }
    return $docs;
}

function produccion_fs_marcar(string $id, string $pedido, string $slug): bool {
    $sa = wabot_push_cuenta();
    $url = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($sa['project_id']) . '/databases/(default)/documents/clientes/' . rawurlencode($id)
         . '?updateMask.fieldPaths=produccion&updateMask.fieldPaths=updatedAt&currentDocument.exists=true';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'PATCH',
        CURLOPT_POSTFIELDS => json_encode(['fields' => [
            'produccion' => ['mapValue' => ['fields' => ['pedidoAt' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')], 'pedido' => ['stringValue' => $pedido], 'slug' => ['stringValue' => $slug]]]],
            'updatedAt' => ['timestampValue' => gmdate('Y-m-d\TH:i:s\Z')],
        ]]),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . prospecto_chatgpt_access_token(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
    ]);
    curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $http === 200;
}

function produccion_server(string $clave, string $accion, array $extra = []): array {
    $url = PRODUCCION_URL . '?' . http_build_query(['tel' => $clave, 'accion' => $accion, 'firma' => wabot_produccion_firma($clave, $accion)] + $extra);
    $ch = curl_init($url);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 60]);
    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [(int)$http, (string)$res];
}

/** Un .zip de wabot_zip_armar (entradas sin comprimir o deflate), desarmado a una carpeta: los nombres que quedaron. */
function produccion_unzip(string $zip, string $carpeta): array {
    if (!is_dir($carpeta)) mkdir($carpeta, 0755, true);
    $nombres = [];
    $pos = 0;
    while (($pos = strpos($zip, "PK\x03\x04", $pos)) !== false) {
        $h = unpack('vversion/vflag/vmetodo/vhora/vfecha/Vcrc/Vcomprimido/Voriginal/vlargoNombre/vlargoExtra', substr($zip, $pos + 4, 26));
        $nombre = basename(substr($zip, $pos + 30, $h['largoNombre']));
        $inicio = $pos + 30 + $h['largoNombre'] + $h['largoExtra'];
        $datos = substr($zip, $inicio, $h['comprimido']);
        if ($h['metodo'] === 8) $datos = (string)@gzinflate($datos);
        if ($nombre !== '' && preg_match('/^[A-Za-z0-9._-]+$/', $nombre) && $datos !== '') {
            file_put_contents($carpeta . DIRECTORY_SEPARATOR . $nombre, $datos);
            $nombres[] = $nombre;
        }
        $pos = $inicio + $h['comprimido'];
    }
    return $nombres;
}

function produccion_salir(array $r): void {
    echo json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
}

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $opciones = getopt('', ['simular', 'solo:']);
    $simular = isset($opciones['simular']);
    $solo = trim((string)($opciones['solo'] ?? ''));
    try {
        $docs = produccion_fs_clientes();
    } catch (Throwable $e) {
        produccion_salir(['ok' => false, 'error' => 'Firestore: ' . $e->getMessage()]);
        exit(1);
    }
    $candidatos = produccion_candidatos($docs, $solo);
    if (!$candidatos) { produccion_salir(['ok' => false]); exit(0); }

    $raiz = realpath(__DIR__ . '/../..');
    $datos = __DIR__ . '/data';
    foreach (['/sesiones', '/produccion'] as $sub) if (!is_dir($datos . $sub)) mkdir($datos . $sub, 0755, true);
    $instrucciones = (string)file_get_contents(__DIR__ . '/instrucciones-produccion.md');

    foreach ($candidatos as $id => $c) {
        $slug = produccion_slug($c);
        $tipo = produccion_tipo($c);
        $clave = (string)($c['onboarding']['conversationKey'] ?? '');
        $avisos = [];
        if ($slug === '') { produccion_salir(['ok' => false, 'id' => $id, 'error' => 'La ficha no tiene nombre de negocio ni slug.']); continue; }
        if (!is_file($raiz . DIRECTORY_SEPARATOR . 'demo' . DIRECTORY_SEPARATOR . $slug . DIRECTORY_SEPARATOR . 'index.html')) {
            $avisos[] = 'En este checkout no está demo/' . $slug . '/index.html: hacé git pull antes de arrancar, o buscá la demo por el nombre del negocio.';
        }
        // Los archivos del cliente.
        $carpetaArchivos = $datos . '/produccion/' . $slug;
        $archivos = [];
        if ($clave !== '') {
            [$http, $zip] = produccion_server($clave, 'archivos');
            if ($http === 200 && $zip !== '') $archivos = produccion_unzip($zip, $carpetaArchivos);
            elseif ($http !== 404) $avisos[] = 'No se pudieron bajar los archivos del chat (HTTP ' . $http . '): están en el server en wabot/data/media/' . $clave . '/.';
        } else {
            $avisos[] = 'La ficha no tiene la clave del chat: los archivos del cliente hay que buscarlos a mano en el panel del bot.';
        }
        $relArchivos = 'tools/demo-auto/data/produccion/' . $slug . '/';
        $pedidoTexto = produccion_pedido_texto($c, (string)$id, $slug, $tipo, $archivos, $relArchivos, $avisos);
        $archivoPedido = $datos . '/sesiones/' . date('Ymd-His') . '-' . $slug . '-produccion' . ($simular ? '-simulado' : '') . '.md';
        file_put_contents($archivoPedido, $instrucciones . $pedidoTexto);
        $relPedido = str_replace('\\', '/', substr(realpath($archivoPedido), strlen($raiz) + 1));
        $marcado = ['firestore' => false, 'chat' => false];
        if (!$simular) {
            $marcado['firestore'] = produccion_fs_marcar((string)$id, $relPedido, $slug);
            if ($clave !== '') { [$http] = produccion_server($clave, 'marcar', ['pedido' => $relPedido]); $marcado['chat'] = $http === 200; }
        }
        produccion_salir(['ok' => true, 'id' => $id, 'nombre' => trim((string)($c['proyecto'] ?? $c['nombre'] ?? '')) ?: $slug, 'slug' => $slug, 'tipo' => $tipo,
            'pedido' => $relPedido, 'archivos' => $archivos, 'avisos' => $avisos, 'marcado' => $marcado, 'simulado' => $simular]);
    }
}
