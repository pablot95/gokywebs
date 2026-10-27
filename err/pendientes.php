<?php
/*
 * GokyWebs – err/pendientes.php
 * Para la rutina de Claude en la nube que revisa los errores de las webs dos veces por día
 * (claude.ai/code/routines). Usa el resumen en disco que arma log.php (err/agrupados.php).
 *
 * GET  -> { pendientes: [...] } los errores que vale la pena mirar, con el repo de su web.
 * POST { hash, estado, nota?, rama? } -> la rutina anota qué hizo con uno.
 *
 * Header obligatorio `X-Err-Key`. Acá solo está el sha256 de la clave: la clave en sí
 * vive en el prompt de la rutina. Para cambiarla, generar otra y pisar ERR_CLAUDE_KEY_SHA256.
 */

require_once __DIR__ . '/agrupados.php';

const ERR_CLAUDE_KEY_SHA256 = 'c03ce2ffc8e27678ca3c119c2de8667c8dd50cc5369de9479e3cfb415ddce6a7';

// Filtro: un error de una sola vez (conexión cortada, bloqueador, pestaña cerrada) no vale una corrida.
const ERR_MIN_VECES      = 3;
const ERR_MIN_VISITANTES = 2;
const ERR_VENTANA_HORAS  = 72;      // tiene que haber pasado hace poco
const ERR_ESTADO_DIAS    = 7;       // lo que la rutina ya atendió no vuelve en 7 días

// Dominio (sin www.) => repo de GitHub. Una web sin repo acá se lista igual, con repo null.
const ERR_REPOS = [
    'autoserviciohudson.com.ar'        => 'pablot95/autoserviciohudson',
    'libreriajd.com.ar'                => 'pablot95/libreriajd',
    'micoloridomundo.com.ar'           => 'pablot95/micoloridomundo',
    'meencantoperfumes.com.ar'         => 'pablot95/meencanto',
    'institutoemmanuel.com.ar'         => 'pablot95/iglesiacentroderestauracionemmanuel',
    'vicenzabricokits.com.ar'          => 'pablot95/vicenza',
    'distsur.com.ar'                   => 'pablot95/dsur',
    'servitechba.com'                  => 'pablot95/Servitech',
    'bernalfleetconsulting.com.ar'     => 'pablot95/bernalfleetconsulting',
    'carinapelusomuebleria.com.ar'     => 'pablot95/carinapelusomuebleria',
    'clinicademaraguasabiertas.com.ar' => 'pablot95/clinicademaraguasabiertas',
    'tatetimegusta.com.ar'             => 'pablot95/tatetimegusta',
    'cooperativamanoscalidas.com.ar'   => 'pablot95/cooperativamanoscalidaslimitada',
    'estudiojuridicogianaria.com.ar'   => 'pablot95/estudiojuridicogianaria',
    'floreriaromina.com.ar'            => 'pablot95/floreriaromina',
    'leloircultiva.org'                => 'pablot95/leloircultiva',
    'lodebasim.com.ar'                 => 'pablot95/lodebasim',
    'losfantasmasdelapesca.com.ar'     => 'pablot95/losfantasmasdelapesca',
    'paoladivella.com.ar'              => 'pablot95/paoladivella',
    'reinamomo.com.ar'                 => 'pablot95/reinamomo',
    'regalartejuguetes.com.ar'         => 'pablot95/regalarte',
    'suanbaby.com.ar'                  => 'pablot95/suanbaby',
    'ecopiscinaschaco.com.ar'          => 'pablot95/ecopiscinas',
    'dcreparaciones.com.ar'            => 'pablot95/dcreparaciones',
    'fozconstrucciones.com.ar'         => 'pablot95/fozconstrucciones',
    'adumircarpinteria.com.ar'         => 'pablot95/adumircarpinteria',
    'xn--avanzams-fza.com.ar'          => 'pablot95/avanzamas',      // avanzamás.com.ar
    'ayurvedasivapriya.com.ar'         => 'pablot95/ayurvedasivapriya',
    'tintamorenabelleza.com.ar'        => 'pablot95/tintamorena',
    'electrolift.com.ar'               => 'pablot95/electrolift',
    'mdliving.com.ar'                  => 'pablot95/mdliving',
    'indumentarialulu.com.ar'          => 'pablot95/luluindumentaria',
    'joawindumentaria.com.ar'          => 'pablot95/joawindumentaria',
    'petshopbony.com.ar'               => 'pablot95/petshopbony',
    'pataclub.ar'                      => 'pablot95/pataclub',
    'afmasajesydepilacion.com.ar'      => 'pablot95/afmasajesydepilacion',
    'lxfparquetpisosdemadera.com.ar'   => 'pablot95/lxfparquetpisosdemadera',
    'julietaledesmaasesoracomercial.com.ar' => 'pablot95/julietaledesmaasesoracomercial',
    'julietaledesmacoberturas.com.ar' => 'pablot95/julietaledesmacoberturas',
    'pulidosreyes.com.ar'              => 'pablot95/pulidosreyes',
    'mrconstrucciones.com.ar'          => 'pablot95/mrconstrucciones',
    'carolinalucero.com.ar'          => 'pablot95/carolinalucero',
    'electricistarobertotorrano.com.ar' => 'pablot95/electricistarobertotorrano',
    'crematoriosanfrancisco.com.ar'    => 'pablot95/crematoriosanfrancisco',
    'cuidarmasintegrarsalud.com.ar'    => 'pablot95/cuidarmasintegrarsalud',
    'remodelacionesnm.com.ar'          => 'pablot95/remodelacionesnm',
    'mutualdicom.com.ar'               => 'pablot95/mutualdicom',
    'reynamidasholistica.com.ar'       => 'pablot95/reynamidasholistica',
    'asesoratesancorsalud.com.ar'      => 'pablot95/sancorsalud',
    'spstoreandservice.com.ar'         => 'pablot95/spstoreandservice',
    'territoriosinvisibles.com.ar'     => 'pablot95/territoriosinvisibles',
    'thetraveledit.com.ar'             => 'pablot95/thetraveledit',
    'tramaoperativa.com.ar'            => 'pablot95/tramaoperativa',
    'valuhcatyarte.com.ar'             => 'pablot95/valuhcatyarte',
    'yanzon.com.ar'                    => 'pablot95/yanzon',
    'zaguirinmobiliaria.com.ar'        => 'pablot95/zaguirinmobiliaria',
    'servimax.com.ar'                => 'pablot95/servimax',
    'concienciavital.com.ar'           => 'pablot95/concienciavital',
    'burgeradonai.com.ar'              => 'pablot95/burgeradonai',
    'adaradermocosmiatria.com.ar'      => 'pablot95/adara',
    'consultoranoa.com.ar' => 'pablot95/consultoranoa',
    'elysoloviajes.com.ar' => 'pablot95/elysoloviajes',
    'deltagasyagua.com.ar' => 'pablot95/deltagasyagua',
    'movimientodesuelodorrego.com.ar' => 'pablot95/movimientodesuelodorrego',
    'byjoyas.com.ar' => 'pablot95/byjoyas',
    'armoniapisos.com.ar' => 'pablot95/armoniapisos',
    'ahorramismo.com.ar' => 'pablot95/ahorramismo',
    'escuelaespaciomirenacer.com.ar' => 'pablot95/espaciomirenacer',
    'siaweb.com.ar' => 'pablot95/siaweb',
    'gestoriaimpulso.com.ar' => 'pablot95/gestoriaimpulso',
    'nor-bex.com' => 'pablot95/norbex',
    'serviciotecnicodelviso.com.ar' => 'pablot95/serviciotecnicodelviso',
    'mipatadeternera.com.ar' => 'pablot95/mipatadeternera',
    'altapintablanqueria.com.ar' => 'pablot95/altapintablanqueria',
    'abperfumes.com.ar' => 'pablot95/abperfumes',
    'transportechavarri.com.ar' => 'pablot95/transportechavarri',
    'nilehechoconamor.com.ar' => 'pablot95/nilehechoconamor',
    'pequesjardineria.com.ar' => 'pablot95/pequesjardineria',
];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function responder($codigo, $datos) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

$clave = (string)($_SERVER['HTTP_X_ERR_KEY'] ?? '');
if ($clave === '' || !hash_equals(ERR_CLAUDE_KEY_SHA256, hash('sha256', $clave))) responder(404, ['error' => 'no']);

/** Los grupos que pasan el filtro y no fueron atendidos hace menos de ERR_ESTADO_DIAS. */
function err_pendientes(array $grupos, array $estados, $ahora) {
    $lista = [];
    foreach ($grupos as $hash => $g) {
        if (!is_array($g)) continue;
        if (($g['ultima'] ?? 0) < $ahora - ERR_VENTANA_HORAS * 3600) continue;
        if ((int)($g['veces'] ?? 0) < ERR_MIN_VECES || count($g['visitantes'] ?? []) < ERR_MIN_VISITANTES) continue;
        $estado = $estados[$hash] ?? null;
        if (is_array($estado) && ($estado['at'] ?? 0) > $ahora - ERR_ESTADO_DIAS * 86400) continue;
        $lista[] = [
            'hash' => (string)$hash,
            'web' => $g['site'],
            'repo' => ERR_REPOS[$g['site']] ?? null,
            'tipo' => $g['tipo'], 'nivel' => $g['nivel'],
            'mensaje' => $g['msg'], 'motivo' => $g['detalle'] ?? '', 'archivo' => $g['src'], 'linea' => $g['line'], 'columna' => $g['col'],
            'stack' => $g['stack'] ?? '', 'paginas' => $g['urls'] ?? [], 'navegador' => $g['ua'] ?? '',
            'veces' => (int)$g['veces'], 'visitantes' => count($g['visitantes'] ?? []),
            'primera' => gmdate('c', (int)$g['primera']), 'ultima' => gmdate('c', (int)$g['ultima']),
            'atendido_antes' => is_array($estado) ? $estado : null,
        ];
    }
    usort($lista, function ($a, $b) { return [$b['visitantes'], $b['veces']] <=> [$a['visitantes'], $a['veces']]; });
    return $lista;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    responder(200, ['pendientes' => err_pendientes(err_json_leer('agrupados.json'), err_json_leer('estados.json'), time())]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $in = json_decode((string)file_get_contents('php://input', false, null, 0, 4096), true);
    $hash = is_array($in) ? (string)($in['hash'] ?? '') : '';
    $estado = is_array($in) ? (string)($in['estado'] ?? '') : '';
    if (!preg_match('/^[a-f0-9]{12}$/', $hash) || !in_array($estado, ['pr', 'rama', 'descartado', 'sin_repo', 'no_reproduce'], true)) {
        responder(422, ['error' => 'hash (12 hex) y estado (pr|rama|descartado|sin_repo|no_reproduce) obligatorios']);
    }
    $corto = function ($v, $max) { return mb_substr(preg_replace('/[\x00-\x1F\x7F]/u', ' ', is_string($v) ? $v : ''), 0, $max); };
    $nuevo = ['estado' => $estado, 'nota' => $corto($in['nota'] ?? '', 500), 'rama' => $corto($in['rama'] ?? '', 120), 'at' => time()];
    err_json_editar('estados.json', function ($e) use ($hash, $nuevo) {
        $e[$hash] = $nuevo;
        // Olvidar estados de más de 60 días.
        return array_filter($e, function ($x) { return is_array($x) && ($x['at'] ?? 0) > time() - 60 * 86400; });
    });
    responder(200, ['ok' => true]);
}

responder(405, ['error' => 'GET o POST']);
