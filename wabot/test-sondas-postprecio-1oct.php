<?php
/* Sondas post-precio contra OpenAI real: cada mensaje arranca de una charla recién cotizada (tienda, oferta del diseño abierta).
 * Son las preguntas más frecuentes de los chats reales de septiembre. Claves QATEST*: sin leads ni envíos. */
if (PHP_SAPI !== 'cli') exit;
error_reporting(E_ALL & ~E_DEPRECATED);
require_once __DIR__ . '/redactor.php';
$GLOBALS['WABOT_TEST_IA_PROVEEDOR'] = 'openai';
$GLOBALS['WABOT_TEST_IA_USO_DIR'] = sys_get_temp_dir() . '/wabot-vivo-1oct';
$cfg = wabot_config_load();
$cfg['openai_modelo'] = 'gpt-6-sol';
$cfg['postprecio_activo'] = true;
$sondas = [
    'Sisi es sin compromiso si',
    'Si si me interesa y puedo pagar por mes',
    'Si te paso el logo',
    'Que necesitas para realizar el diseño de prueba',
    'Se puede ver cómo quedaría?',
    'es caro, no hay algo mas economico?',
    'cual me conviene?',
    'es en pesos o en dolares?',
    'de donde son?',
    'me mandas algun ejemplo de lo que hacen?',
    'y despues la manejo yo o ustedes? me enseñan a usarla?',
    'ya tengo el dominio, eso lo descuentan?',
    'esto es como tiendanube?',
    'lo veo con mi socio y te aviso',
    'Gracias por comunicarte con Pescadería Las Grutas, en breve te atendemos. Que pedís hoy?',
];
foreach ($sondas as $i => $texto) {
    $clave = 'QATESTP' . str_pad((string)$i, 2, '0', STR_PAD_LEFT);
    @unlink(WABOT_DATA . '/conv/' . $clave . '.json');
    $conv = wabot_conv_load($clave);
    $conv['nombre'] = 'Sonda';
    $conv['tipo'] = 'ecommerce'; $conv['fase'] = 'prediseno'; $conv['precio_dado'] = true;
    $conv['oferta_diseno_ts'] = time() - 60; $conv['reconocimiento_hecho'] = true;
    $conv['ficha'] = array_merge(wabot_ficha($conv), ['rubro' => 'tu local de ropa', 'que_vende' => 'ropa de mujer', 'necesidad' => 'tienda']);
    wabot_precio_congelar($conv, 'ecommerce', $cfg);
    $ts = time() - 120;
    wabot_conv_transcript($conv, 'cliente', 'Hola, tengo un local de ropa de mujer y quiero vender online');
    $precio = wabot_pitch_precio_texto('ecommerce', $cfg, $conv);
    foreach ((array)$precio as $m) if (is_string($m) && !wabot_es_marcador_imagen_precio($m)) wabot_conv_transcript($conv, 'bot', $m);
    wabot_conv_transcript($conv, 'bot', 'Si te interesa, te preparamos sin cargo un primer diseño de tu tienda online, así ves cómo quedaría y cómo se verían presentados tus productos antes de decidir. Querés que lo armemos?');
    wabot_conv_transcript($conv, 'cliente', $texto);
    $conv['ultimo_cliente_ts'] = time();
    $ti = microtime(true);
    try { $r = wabot_salida_preparar(wabot_responder($texto, $conv, $cfg), $conv, $cfg); }
    catch (Throwable $e) { echo "!!! EXCEPCION: " . $e->getMessage() . "\n"; $r = null; }
    $seg = round(microtime(true) - $ti, 1);
    echo "\n>>> CLIENTE: $texto\n";
    if (!$r) echo "<<< BOT: (silencio) [{$seg}s]\n";
    else foreach ((array)$r as $g) echo "<<< BOT [{$seg}s]: " . str_replace("\n", "\n           ", wabot_respuesta_texto_transcript($g)) . "\n";
    echo "    [bot_off=" . (int)($conv['bot_off'] ?? 0) . " control_manual=" . (int)($conv['control_manual'] ?? 0) . " form=" . (int)($conv['link_form_enviado'] ?? 0)
       . (!empty($conv['postprecio_reglas']) ? " reglas=" . implode(',', $conv['postprecio_reglas']) : '')
       . (!empty($conv['postprecio_derivacion']) ? " derivacion=\"{$conv['postprecio_derivacion']}\"" : '') . "]\n";
    wabot_conv_save($conv);
}
