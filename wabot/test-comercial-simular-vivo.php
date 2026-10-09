<?php
/**
 * wabot/test-comercial-simular-vivo.php — charlas simuladas de punta a punta contra GPT Sol REAL,
 * con el flujo comercial en AUTOMÁTICO, como contestaría en producción (9-oct-2026).
 *
 *   php wabot/test-comercial-simular-vivo.php [wabot/test-comercial-simulaciones.json] [--ids=01,05] [--md=salida.md]
 *
 * Cada charla tiene los turnos del cliente (escritos a partir de comportamientos reales de los
 * exports). Un turno con "si": "oferta" solo se manda si el bot ya ofreció la demo (si no, se
 * manda "sino" o se corta la charla); con "si": "form", solo si ya mandó el formulario.
 * Pipeline igual al webhook: wabot_responder() + wabot_salida_preparar(). WhatsApp, Firestore y
 * leads no se tocan (WABOT_TEST_SIN_RED, claves *TEST*); solo OpenAI es real. ~US$ 0,02 por charla.
 */
if (PHP_SAPI !== 'cli') exit;
error_reporting(E_ALL & ~E_DEPRECATED);
$GLOBALS['WABOT_TEST_SIN_RED'] = true;
$GLOBALS['WABOT_TEST_FLUJO_COMERCIAL'] = 'auto';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
// Una carpeta por corrida: las charlas reusan las mismas claves y el costo de cada una sumaba el de corridas anteriores.
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-simular-uso-' . date('Ymd-His');
require_once __DIR__ . '/redactor.php';
// Con SIN_RED el bot no llama a OpenAI solo: este gancho hace la llamada real.
$GLOBALS['WABOT_TEST_OPENAI_HTTP'] = function ($payload) {
    $ch = curl_init('https://api.openai.com/v1/responses');
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . wabot_openai_key(), 'Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_TIMEOUT => 45]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$code, is_string($body) ? $body : '', 0];
};

$args = array_slice($argv, 1);
$archivo = __DIR__ . '/test-comercial-simulaciones.json';
$ids = []; $md = '';
foreach ($args as $a) {
    if (str_starts_with($a, '--ids=')) $ids = array_filter(explode(',', substr($a, 6)));
    elseif (str_starts_with($a, '--md=')) $md = substr($a, 5);
    else $archivo = $a;
}
if (wabot_openai_key() === '') { fwrite(STDERR, "Falta la key de OpenAI.\n"); exit(2); }
$cfg = wabot_config_load();
$cfg['activo'] = true;
$cfg['form_activo'] = true;
$escenarios = json_decode((string)file_get_contents($archivo), true);
$salida = ['# Simulación de charlas — flujo comercial en automático', '',
    'Modelo ' . wabot_openai_modelo($cfg) . ' · ' . date('Y-m-d H:i') . ' · WhatsApp simulado (no sale nada), OpenAI real.', ''];
$costoTotal = 0.0; $t0 = microtime(true);

foreach ($escenarios as $n => $esc) {
    if ($ids && !in_array($esc['id'], $ids, true)) continue;
    $clave = '5491100007' . str_pad((string)$esc['id'], 3, '0', STR_PAD_LEFT) . 'TEST';
    @unlink(wabot_conv_path($clave));
    $conv = wabot_conv_load($clave);
    $conv['nombre'] = 'Cliente';
    $salida[] = '## ' . $esc['id'] . ' — ' . $esc['titulo'];
    $salida[] = '';
    echo "\n########## {$esc['id']} — {$esc['titulo']}\n";
    foreach ($esc['turnos'] as $turno) {
        $texto = (string)$turno['t'];
        $cond = (string)($turno['si'] ?? '');
        if ($cond === 'oferta' && !wabot_comercial_oferta_hecha($conv, $cfg)) {
            if (!empty($turno['sino'])) { $texto = (string)$turno['sino']; }
            else { $salida[] = '_(el cliente iba a contestar a la oferta de la demo, pero el bot no la hizo: fin de la charla)_'; $salida[] = ''; break; }
        }
        if ($cond === 'form' && empty($conv['link_form_enviado'])) {
            $salida[] = '_(el cliente iba a escribir después del formulario, pero no se lo mandaron: fin de la charla)_'; $salida[] = ''; break;
        }
        wabot_conv_transcript($conv, 'cliente', $texto, null, ['id' => 'wamid.sim.' . uniqid()]);
        $conv['ultimo_cliente_ts'] = time();
        $GLOBALS['WABOT_IA_CLAVE'] = $clave;
        unset($conv['comercial_ultimo']['revision']);
        $ti = microtime(true);
        try { $r = wabot_salida_preparar(wabot_responder($texto, $conv, $cfg), $conv, $cfg); }
        catch (Throwable $e) { $r = []; echo "!!! " . $e->getMessage() . "\n"; }
        $seg = round(microtime(true) - $ti, 1);
        $salida[] = '**Cliente:** ' . str_replace("\n", '  ' . "\n", $texto);
        $salida[] = '';
        echo ">>> CLIENTE: $texto\n";
        if (!$r) {
            $estado = wabot_comercial_estado($conv);
            $motivo = $estado === 'humano' ? 'para Pablo: ' . ($conv['comercial_motivo'] ?? '')
                : ($estado === 'formulario' ? 'formulario ya enviado, sigue Pablo' : ($estado === 'rechazo' ? 'el cliente no quiere avanzar' : (!empty($conv['contexto_consulta']) ? 'no viene a comprar (' . $conv['contexto_consulta'] . ')' : 'no hace falta contestar')));
            $salida[] = "> _(el bot no contesta — $motivo — {$seg} s)_";
            $salida[] = '';
            echo "<<< BOT: (silencio: $motivo) [{$seg}s]\n";
        } else {
            foreach ((array)$r as $m) {
                $m = wabot_respuesta_texto_transcript((string)$m);
                wabot_conv_transcript($conv, 'bot', $m);
                $salida[] = '> **Bot:** ' . str_replace("\n", "  \n> ", $m);
                $salida[] = '>';
                echo "<<< BOT [{$seg}s]: " . str_replace("\n", "\n           ", $m) . "\n";
            }
            $salida[count($salida) - 1] = '';
        }
        // Lo que vio el revisor en este turno (9-oct): qué corrigió, o por qué la frenó.
        $rev = $conv['comercial_ultimo']['revision'] ?? null;
        if (is_array($rev) && in_array($rev['estado'] ?? '', ['corregida', 'dudosa', 'frenada'], true)) {
            $det = implode(' · ', array_map(function ($p) { return $p['tipo'] . ': ' . rtrim((string)$p['detalle'], '. '); }, (array)($rev['problemas'] ?? [])));
            $antes = implode(' / ', array_map(function ($t) { return mb_substr(str_replace("\n", ' ', (string)$t), 0, 140); }, (array)($rev['antes'] ?? [])));
            $nota = ['corregida' => 'el revisor corrigió la primera versión', 'dudosa' => 'el revisor corrigió, pero le quedó una duda menor',
                     'frenada' => 'el revisor la frenó: la contesta Pablo'][$rev['estado']];
            $salida[] = "> 🔎 _({$nota} — {$det}. La primera versión decía: «{$antes}»)_";
            $salida[] = '';
            echo "    [revisor: {$rev['estado']} — {$det}]\n";
        }
        $u = $conv['comercial_ultimo'] ?? [];
        echo "    [accion=" . ($u['accion'] ?? '-') . " sol=" . ($conv['comercial_solucion'] ?? '-') . " precio=" . (int)!empty($conv['precio_dado'])
           . " oferta=" . (int)!empty($conv['comercial_oferta_ts']) . " form=" . (int)!empty($conv['link_form_enviado']) . " pausa=" . ($conv['comercial_pausa'] ?? '-') . "]\n";
        $conv['ultimo_ts'] = time();
    }
    $costo = wabot_ia_uso_conversacion($clave)['costo_usd'];
    $costoTotal += $costo;
    $salida[] = '_Estado final: ' . wabot_comercial_estado($conv) . (!empty($conv['comercial_solucion']) ? ' · solución ' . $conv['comercial_solucion'] : '')
        . (!empty($conv['precio_dado']) ? ' · cotizado ' . ($conv['precio_cotizado'] ?? '') . ' / ' . ($conv['mensualidad_cotizada'] ?? '') : '')
        . (!empty($conv['link_form_enviado']) ? ' · formulario enviado' : '') . ' · US$ ' . round($costo, 3) . '_';
    $salida[] = '';
    @unlink(wabot_conv_path($clave)); @unlink(wabot_cola_path($clave));
}
$salida[] = '---';
$salida[] = 'Total: US$ ' . round($costoTotal, 3) . ' · ' . round(microtime(true) - $t0) . ' s.';
echo "\nTotal US\$" . round($costoTotal, 3) . " · " . round(microtime(true) - $t0) . "s\n";
if ($md !== '') { file_put_contents($md, implode("\n", $salida) . "\n"); echo "Guardado en $md\n"; }
