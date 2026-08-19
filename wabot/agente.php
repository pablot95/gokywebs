<?php
/**
 * wabot/agente.php — modo "agente": Gemini lleva la conversación (pregunta,
 * indaga, vende) en vez de seguir un árbol de decisiones fijo.
 *
 * La diferencia con soltarlo libre: los datos duros NO están en el prompt, están
 * en HERRAMIENTAS que el modelo tiene que llamar. No puede inventar un precio
 * porque no lo tiene hasta que lo pide, y lo que recibe es el texto exacto de
 * bot-config.json. Las acciones con consecuencia (derivar, guardar el lead)
 * también son herramientas, así que quedan registradas de verdad.
 *
 * Si algo falla —Gemini caído, respuesta inválida, demasiadas vueltas— cae al
 * motor de reglas de engine.php, que sigue siendo la red de seguridad.
 */

require_once __DIR__ . '/redactor.php';

define('WABOT_AGENTE_MAX_VUELTAS', 5);

/**
 * Punto de entrada del modo agente.
 * Devuelve array de textos, o null si hay que caer al motor de reglas.
 */
function wabot_agente($mensaje, &$conv, $cfg) {
    // Las herramientas mutan estado. Se trabaja sobre una copia y se confirma
    // recién cuando hay una respuesta completa: una segunda llamada con 429 o
    // una validación fallida no puede dejar una fase/precio a medio aplicar.
    $trabajo = $conv;
    $trabajo['_eventos_diferir'] = true;
    $trabajo['_mensaje_agente'] = $mensaje;
    wabot_turno_marcar($trabajo);
    unset($trabajo['_eventos_pendientes']);

    if (isset($GLOBALS['WABOT_TEST_AGENTE'])) {
        $fn = $GLOBALS['WABOT_TEST_AGENTE'];
        $salida = $fn($mensaje, $trabajo, $cfg);
    } else {
        $salida = wabot_agente_intento($mensaje, $trabajo, $cfg);
    }

    if ($salida === null) return null;
    unset($trabajo['_mensaje_agente']);
    $conv = $trabajo;
    wabot_eventos_confirmar($conv);
    return $salida;
}

/** Una ejecución aislada del agente; el wrapper decide si confirma el estado. */
function wabot_agente_intento($mensaje, &$conv, $cfg) {
    // Este paso no necesita IA: el identificador de Instagram no sirve como
    // teléfono y el número que manda el cliente se valida antes de crear el lead.
    if (($conv['fase'] ?? '') === 'prediseno_wsp') {
        $num = wabot_extraer_celular($mensaje);
        if ($num !== null) {
            $conv['telefono_wsp'] = $num;
            return wabot_prediseno_completo($conv, $cfg);
        }
        // Si parecía un número pero está incompleto, se corrige sin gastar IA.
        // Una pregunta normal sigue al agente para que pueda contestarla.
        if (strlen(preg_replace('/\D+/', '', $mensaje)) >= 6) {
            return [$cfg['prediseno_whatsapp_invalido']];
        }
    }
    if (($conv['fase'] ?? '') === 'sistema_wsp') {
        $num = wabot_extraer_celular($mensaje);
        if ($num !== null) {
            $conv['telefono_wsp'] = $num;
            return wabot_sistema_completo($conv, $cfg);
        }
        if (strlen(preg_replace('/\D+/', '', $mensaje)) >= 6) {
            return [wabot_sistema_whatsapp_texto($cfg, true)];
        }
    }

    // Respuesta a una pregunta de desempate: si se entiende con palabras
    // ("por la web", "vender", "la segunda"), se cotiza directo sin gastar una
    // vuelta de IA. En producción el agente falló dos turnos seguidos justo acá
    // y el motor de respaldo repitió la misma pregunta: el cliente vio un bot
    // tildado. Este atajo es determinista y no depende de nadie.
    if (($conv['fase'] ?? '') === 'catalogo_cantidad') {
        $cant = wabot_extraer_cantidad_productos($mensaje);
        if ($cant !== null) {
            wabot_handoff_aclaracion_resuelta($conv);
            return wabot_catalogo_cotizar($cant, $conv, $cfg);
        }
    }

    $faseDesempate = (string)($conv['fase'] ?? '');
    if (in_array($faseDesempate, ['desempate_comercio', 'desempate_turnos', 'desempate_cursos'], true)) {
        $local = wabot_desempate_por_palabras($faseDesempate, $mensaje);
        $mapa = [
            'comercio_vender' => 'ecommerce', 'comercio_mostrar' => 'catalogo',
            'turnos_si' => 'turnos', 'turnos_no' => 'landing',
            'cursos_vender' => 'elearning', 'cursos_mostrar' => 'landing',
        ];
        if ($local !== null && isset($mapa[$local])) {
            wabot_handoff_aclaracion_resuelta($conv);
            return wabot_precio($mapa[$local], $conv, $cfg);
        }
    }

    if (WABOT_GEMINI_KEY === 'COMPLETAR') return null;

    $cerrada  = ($conv['fase'] ?? '') === 'derivado';
    $contents = wabot_agente_historial($conv, $mensaje);
    $tools    = [['functionDeclarations' => wabot_agente_tools($cerrada)]];
    $sistema  = wabot_agente_sistema($conv, $cfg);

    $pendientes = [];   // textos que las herramientas obligan a mandar
    $terminal   = null; // si una herramienta corta la charla, su texto es la respuesta final
    $exacta     = null; // corta solo esta vuelta, sin cerrar la conversación
    $aparte     = [];   // los que van en su propio globo, detrás del que escribe el modelo

    for ($vuelta = 0; $vuelta < WABOT_AGENTE_MAX_VUELTAS; $vuelta++) {
        $r = wabot_agente_llamar($contents, $tools, $sistema);
        if ($r === null) return null;

        $partes = $r['candidates'][0]['content']['parts'] ?? [];
        if (!$partes) return null;

        $llamadas = [];
        $texto    = '';
        foreach ($partes as $p) {
            if (isset($p['functionCall'])) $llamadas[] = $p['functionCall'];
            elseif (isset($p['text']))     $texto .= $p['text'];
        }

        if (!$llamadas) {
            // El modelo contestó y no pidió nada más.
            if ($terminal !== null) return [$terminal];

            // Promesa colgada: anuncia que va a pasar algo y no llamó a ninguna
            // herramienta, así que el mensaje termina en la nada. Pasó de verdad
            // ("Te paso el precio y el link de presupuesto:" y ahí cortaba).
            if (preg_match('/[:：]\s*$/u', trim($texto))) {
                wabot_log('error', ['donde' => 'agente', 'msg' => 'promesa sin herramienta', 'texto' => mb_substr($texto, -80)]);
                return null;
            }

            // Promesa de cierre sin cierre real: el modelo le dice al cliente que
            // ya quedó registrado / que lo van a contactar, pero no llamó a
            // ninguna herramienta terminal, así que NO hay lead ni boceto. Pasó
            // en producción: el cliente se quedó esperando una muestra que nunca
            // se pidió. Vale para toda la ejecución, no solo para esta vuelta.
            if ($terminal === null && $exacta === null && wabot_texto_promete_cierre($texto)) {
                wabot_log('error', ['donde' => 'agente', 'msg' => 'promete cierre sin herramienta', 'texto' => mb_substr($texto, 0, 120)]);
                return null;
            }

            $limpio = wabot_validar_redaccion($texto, implode("\n", $pendientes), $cfg);
            if ($limpio === null) return null;
            wabot_agente_marcar_nombre_usado($limpio, $conv);
            return array_merge([$limpio], wabot_agente_filtrar_aparte($limpio, $aparte));
        }

        // Ejecutamos lo que pidió y se lo devolvemos para que redacte.
        $contents[] = ['role' => 'model', 'parts' => $partes];
        $respuestas = [];
        foreach ($llamadas as $ll) {
            $res = wabot_agente_ejecutar($ll['name'] ?? '', $ll['args'] ?? [], $conv, $cfg);
            if (!empty($res['texto']))    $pendientes[] = $res['texto'];
            if (!empty($res['terminal'])) $terminal     = $res['texto'];
            if (!empty($res['exacta']))   $exacta       = $res['texto'];
            // Se lo sacamos antes de devolvérselo al modelo: si lo ve, lo copia
            // dentro de su mensaje y el segundo globo llega repetido.
            if (!empty($res['aparte'])) { $aparte[] = $res['aparte']; }
            unset($res['aparte']);
            $respuestas[] = ['functionResponse' => [
                'name'     => $ll['name'] ?? '',
                'response' => $res,
            ]];
        }
        $contents[] = ['role' => 'user', 'parts' => $respuestas];

        // Las herramientas que cortan la charla mandan su texto tal cual:
        // no dejamos que el modelo ablande una derivación.
        if ($terminal !== null) return [$terminal];
        // Pedir un teléfono no cierra el lead, pero también es texto operativo:
        // se manda exacto y se espera el próximo mensaje del cliente.
        if ($exacta !== null) return [$exacta];
    }

    wabot_log('error', ['donde' => 'agente', 'msg' => 'demasiadas vueltas']);
    return null;
}

/**
 * Detecta que el modelo le prometió al cliente algo que solo una herramienta
 * puede cumplir: que quedó registrado, que le van a escribir, que ya se está
 * preparando la muestra. Si lo dice sin haber llamado a guardar_prediseno o
 * derivar, el lead no existe y el cliente espera para siempre.
 */
function wabot_texto_promete_cierre($texto) {
    $t = wabot_normalizar_frase($texto);
    if ($t === '') return false;

    $registro = '(registr|anot|guardam|guardad|tomad nota|tomo nota|quedo todo|quedo registrad|ya tengo todo|con esto ya|pasamos el pedido|derivad|paso tu consulta|ya esta todo)';
    $accion   = '(prepara|armamos|arma|disen|muestra|predise|boceto|equipo|pablo|te escrib|te contact|se comunica|comunicamos|coordinar|24 a 48|24 y 48)';

    if (preg_match('/' . $registro . '/u', $t) && preg_match('/' . $accion . '/u', $t)) return true;
    if (preg_match('/(pablo|el equipo|nuestro equipo).{0,45}(te escrib|te contact|se comunica|comunicando|se pone en contacto|te acerca|coordina)/u', $t)) return true;
    if (preg_match('/(en breve|enseguida|en un rato|pronto).{0,40}(te escrib|te contact|se comunica|la muestra|el predise)/u', $t)) return true;

    return false;
}

/** Marca el uso del nombre para que el prompt no lo repita en cada mensaje. */
function wabot_agente_marcar_nombre_usado($texto, &$conv) {
    $nombre = trim((string)($conv['nombre'] ?? ''));
    if ($nombre === '') return;
    $primero = preg_split('/\s+/', $nombre)[0] ?? '';
    if ($primero !== '' && preg_match('/\b' . preg_quote($primero, '/') . '\b/iu', $texto)) {
        $conv['nombre_usado'] = true;
    }
}

/**
 * El globo aparte (la oferta del prediseño) se descarta si el modelo ya la
 * ofreció por su cuenta dentro del mensaje. La nota se lo prohíbe, pero una
 * instrucción se ignora: pasó en un chat real y el cliente recibió la muestra
 * ofrecida dos veces seguidas. Esto lo garantiza el código, no el prompt.
 */
function wabot_agente_filtrar_aparte($texto, $aparte) {
    if (!$aparte) return [];
    if (mb_stripos($texto, 'predise') !== false || mb_stripos($texto, 'muestra') !== false) return [];
    return $aparte;
}

/**
 * Lo que este cliente contó en charlas ANTERIORES (antes del último reset).
 *
 * La venta arranca de cero cuando vuelve después de días —fase, precio, datos—
 * pero la MEMORIA no se borra: si hace dos semanas dijo que vende mates, el bot
 * tiene que saberlo, no preguntarle otra vez a qué se dedica. Esto devuelve
 * las últimas líneas de las sesiones viejas para meterlas como contexto en el
 * system prompt, separadas de la charla actual para que el modelo no las mezcle.
 */
function wabot_agente_memoria_previa($conv, $max = 10) {
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    if ($inicio <= 0) return [];
    $previas = [];
    foreach ((array)($conv['transcript'] ?? []) as $t) {
        if ((int)($t['ts'] ?? 0) >= $inicio) break;
        $q = $t['q'] ?? '';
        if ($q !== 'cliente' && $q !== 'bot' && $q !== 'humano') continue;
        $txt = trim((string)($t['t'] ?? ''));
        if ($txt === '') continue;
        $previas[] = ['q' => $q, 't' => mb_substr($txt, 0, 220), 'ts' => (int)($t['ts'] ?? 0)];
    }
    return array_slice($previas, -$max);
}

/** Historial de la charla en el formato de Gemini. */
function wabot_agente_historial($conv, $mensaje) {
    $contents = [];
    $inicio = (int)($conv['session_started_ts'] ?? 0);
    $sesion = array_values(array_filter((array)($conv['transcript'] ?? []), function ($t) use ($inicio) {
        return $inicio <= 0 || (int)($t['ts'] ?? 0) >= $inicio;
    }));
    // Webhook ya persistió el turno actual. Puede ser uno o varios mensajes
    // agrupados con saltos de línea; se quita solo ese sufijo, nunca ocurrencias
    // anteriores iguales.
    $actualQuitado = false;
    $trozos = [];
    for ($i = count($sesion) - 1; $i >= 0; $i--) {
        if (($sesion[$i]['q'] ?? '') !== 'cliente') break;
        array_unshift($trozos, (string)($sesion[$i]['t'] ?? ''));
        $unido = implode("\n", $trozos);
        if ($unido === $mensaje) {
            array_splice($sesion, $i);
            $actualQuitado = true;
            break;
        }
        if (mb_strlen($unido) > mb_strlen($mensaje)) break;
    }
    if (!$actualQuitado) {
        for ($i = count($sesion) - 1; $i >= 0; $i--) {
            if (($sesion[$i]['q'] ?? '') === 'cliente' && ($sesion[$i]['t'] ?? '') === $mensaje) {
                array_splice($sesion, $i, 1);
                break;
            }
        }
    }
    foreach (array_slice($sesion, -14) as $t) {
        $contents[] = [
            'role'  => $t['q'] === 'cliente' ? 'user' : 'model',
            'parts' => [['text' => $t['t']]],
        ];
    }
    $contents[] = ['role' => 'user', 'parts' => [['text' => $mensaje]]];
    return $contents;
}

/**
 * Las herramientas que el modelo puede pedir.
 * Con la charla cerrada le queda SOLO consultar_info: sin dar_precio no puede
 * recotizar, y sin guardar_prediseno no puede reabrir algo que ya se entregó.
 * La restricción es la herramienta, no el pedido: una instrucción se ignora.
 */
function wabot_agente_tools($cerrada = false) {
    $consultar = [
        'name' => 'consultar_info',
        'description' => 'Trae la respuesta oficial a una duda del cliente. Usala SIEMPRE antes de contestar sobre estos temas: nunca los contestes de memoria.',
        'parameters' => [
            'type' => 'object',
            'properties' => [
                'clave' => [
                    'type' => 'string',
                    'enum' => ['proceso', 'pago', 'plazos', 'hosting', 'mantenimiento', 'objecion_precio', 'carga', 'logo', 'marketing', 'reuniones', 'tecnologia', 'prediseno', 'otra'],
                ],
            ],
            'required' => ['clave'],
        ],
    ];
    if ($cerrada) return [$consultar];

    return [
        [
            'name' => 'dar_precio',
            'description' => 'Devuelve el precio y el link de presupuesto de un tipo de web. Usala SOLO cuando ya sabés con certeza qué tipo necesita el cliente. El texto que devuelve hay que incluirlo tal cual en la respuesta.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'tipo' => [
                        'type' => 'string',
                        'enum' => ['landing', 'catalogo', 'turnos', 'institucional', 'ecommerce', 'inmobiliaria', 'elearning'],
                        'description' => 'landing: un profesional u oficio que trabaja por pedido y lo contactan por WhatsApp (plomero, electricista, abogado, contador, fotógrafo), o cursos que solo se muestran. catalogo: vende productos pero NO quiere cobrar online: quiere mostrar su catálogo y que le consulten por WhatsApp. Se cotiza por cantidad de productos, así que necesitás el parámetro productos; si no sabés cuántos son, llamala igual sin ese dato y te va a devolver la pregunta que hay que hacerle. turnos: un servicio que atiende con día y horario Y YA CONFIRMÓ que quiere la reserva online (peluquería, consultorio, estética, veterinaria, canchas, cabañas, gimnasio). institucional: una EMPRESA o institución, no un profesional solo NI un comercio a la calle (pyme, fábrica, distribuidora, consultora, colegio, fundación, ONG, club, municipio); un local que vende productos va por el desempate de comercios. ecommerce exige que YA HAYA CONFIRMADO que quiere vender online. ecommerce: vende productos físicos o digitales, incluye revendedores de marcas. inmobiliaria: publica propiedades. elearning: vende cursos desde la web con videos y acceso de alumnos.',
                    ],
                    'productos' => [
                        'type' => 'integer',
                        'description' => 'Solo para tipo catalogo: cuántos productos va a publicar el cliente. Usalo únicamente si te lo dijo; nunca lo inventes ni lo estimes.',
                    ],
                ],
                'required' => ['tipo'],
            ],
        ],
        $consultar,
        [
            'name' => 'manejar_objecion',
            'description' => 'Trae la respuesta comercial oficial para una objeción y la conecta con la muestra gratis. Usala SIEMPRE para estas cuatro objeciones; no improvises.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'tipo' => [
                        'type' => 'string',
                        'enum' => ['pensarlo', 'socio', 'ya_tiene_web', 'plataforma'],
                    ],
                ],
                'required' => ['tipo'],
            ],
        ],
        [
            'name' => 'anotar_prediseno',
            'description' => 'Anotá un dato del prediseño APENAS el cliente te lo dice, en el mismo turno, sin esperar a tenerlos todos. Mandá solo el campo que acabás de escuchar. No cierra la charla ni contesta nada: seguí vos con la conversación.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'descripcion' => ['type' => 'string', 'description' => 'Qué ofrece el cliente, con sus palabras.'],
                    'colores'     => ['type' => 'string', 'description' => 'Los colores de su marca, tal como los dijo.'],
                    'referencia'  => ['type' => 'string', 'description' => 'La web o el estilo que nombró, con SUS palabras y sin resumir.'],
                ],
            ],
        ],
        [
            'name' => 'guardar_prediseno',
            'description' => 'Guardá los datos del prediseño. Antes de llamarla tenés que tener las tres cosas: descripción de lo que ofrece, colores de su marca, y haberle preguntado por una web de referencia o un estilo. Cierra la charla y la toma una persona.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'descripcion' => ['type' => 'string', 'description' => 'Qué ofrece el cliente, resumido en una línea.'],
                    'colores'     => ['type' => 'string', 'description' => 'Los colores de su marca, tal como los dijo.'],
                    'referencia'  => ['type' => 'string', 'description' => 'La web que le gustó y el estilo que describió, con SUS palabras y sin resumir: si dijo "royalcanin, limpia y con muchas fotos", guardá eso entero, porque el detalle visual es lo que sirve para diseñar. Cadena vacía solo si dijo que no tiene ninguna.'],
                ],
                'required' => ['descripcion', 'colores', 'referencia'],
            ],
        ],
        [
            'name' => 'anotar_sistema',
            'description' => 'Inicia o continúa el brief de un sistema de gestión. Llamala APENAS aparezca un sistema/app/panel a medida y cada vez que el cliente diga qué problema resuelve, cuántas personas lo usarían o cómo lo maneja hoy. El orden de preguntas es problema, usuarios y método actual. No cotiza ni cierra.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'problema' => ['type' => 'string', 'description' => 'Qué necesita resolver o automatizar, con las palabras del cliente.'],
                    'usuarios' => ['type' => 'string', 'description' => 'Cuántas personas o qué roles usarían el sistema.'],
                    'metodo_actual' => ['type' => 'string', 'description' => 'Cómo lo maneja hoy: papel, Excel, WhatsApp, otro sistema, etc.'],
                ],
            ],
        ],
        [
            'name' => 'guardar_sistema',
            'description' => 'Cierra un lead de sistema a medida SOLO cuando ya están las tres respuestas: problema, usuarios y método actual. No da un precio fijo; crea el brief y lo toma Pablo.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'problema' => ['type' => 'string'],
                    'usuarios' => ['type' => 'string'],
                    'metodo_actual' => ['type' => 'string'],
                ],
                'required' => ['problema', 'usuarios', 'metodo_actual'],
            ],
        ],
        [
            'name' => 'derivar',
            'description' => 'Solicita handoff. El código SOLO lo permite si el texto real pide humano, expresa pago/avance concreto, combina productos+cursos, o ya hubo dos respuestas distintas a aclaraciones que siguieron siendo ambiguas. Ante la primera ambigüedad, la herramienta te obliga a repreguntar. Nunca la uses ante un "dale" u "ok" pelados.',
            'parameters' => [
                'type' => 'object',
                'properties' => [
                    'motivo' => ['type' => 'string', 'description' => 'Por qué derivás, en pocas palabras.'],
                    'causa' => [
                        'type' => 'string',
                        'enum' => ['pide_humano', 'pago_explicito', 'productos_y_cursos', 'ambiguedad'],
                    ],
                ],
                'required' => ['motivo', 'causa'],
            ],
        ],
    ];
}

/** Ejecuta una herramienta y devuelve lo que ve el modelo. */
function wabot_agente_ejecutar($nombre, $args, &$conv, $cfg) {
    switch ($nombre) {

        case 'dar_precio':
            $tipo = $args['tipo'] ?? '';
            if (!isset($cfg['tipos'][$tipo])) {
                return ['error' => 'Tipo desconocido.'];
            }
            // Nunca dos precios distintos en la misma charla.
            if (!empty($conv['tipo']) && $conv['tipo'] !== $tipo) {
                $causa = wabot_agente_handoff_causa($conv, ['causa' => 'ambiguedad']);
                if ($causa !== null) {
                    wabot_handoff_marcar($conv, $causa);
                    return ['texto' => $cfg['derivar'], 'terminal' => true,
                            'nota' => 'Ya había otro precio y la aclaración quedó agotada.'];
                }
                return ['error' => 'Ya hay otro tipo cotizado. No des un segundo precio ni derives todavía.',
                        'nota' => 'Preguntale si esto es para el mismo proyecto o para otra web. Recién tras dos respuestas todavía ambiguas se habilita el handoff.'];
            }
            if ($tipo === 'catalogo') {
                $cantidad = (int)($args['productos'] ?? 0);
                if ($cantidad < WABOT_PRODUCTOS_MIN || $cantidad > WABOT_PRODUCTOS_MAX) {
                    $cantidad = (int)($conv['productos_cantidad'] ?? 0);
                }
                if ($cantidad >= WABOT_PRODUCTOS_MIN) {
                    $conv['productos_cantidad'] = $cantidad;
                } else {
                    $pregunta = wabot_catalogo_preguntar($conv, $cfg);
                    return ['texto' => $pregunta[0], 'exacta' => true,
                            'nota' => 'Todavía no sabemos cuántos productos tiene y sin ese dato no hay precio. Preguntáselo con este texto y esperá la respuesta.'];
                }
            }

            $precio = wabot_precio($tipo, $conv, $cfg);
            return [
                'texto' => $precio[0],
                'nota'  => 'Incluí este texto tal cual, con el precio y el link idénticos, y respetando el salto de línea: la frase del link arranca en un renglón nuevo. Podés agregar una frase tuya antes. NO menciones el prediseño gratis: sale solo, en un mensaje aparte, unos segundos después. Si lo escribís vos queda repetido.',
                'aparte' => $precio[1] ?? '',
            ];

        case 'consultar_info':
            $clave = $args['clave'] ?? 'otra';
            if ($clave === 'prediseno') {
                $conv['fase'] = 'prediseno';
                wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'consulta']);
                return ['texto' => $cfg['prediseno'], 'nota' => 'Pedile la descripción y los colores.'];
            }
            // El mantenimiento cambia de precio y de link según lo cotizado.
            if ($clave === 'mantenimiento') {
                return wabot_agente_agregar_cta([
                    'texto' => wabot_texto_mantenimiento($conv, $cfg),
                    'nota' => 'Contestá con esta información y nada más. El precio y el link van idénticos.',
                ], $conv, $cfg);
            }
            if ($clave === 'pago') {
                return wabot_agente_agregar_cta([
                    'texto' => wabot_texto_pago($conv, $cfg),
                    'nota' => 'Contestá con esto. El monto de la seña ya es el que corresponde a lo cotizado.',
                ], $conv, $cfg);
            }
            // La respuesta oficial a "es caro": acá viven las 3 cuotas sin
            // interés, así el modelo no inventa montos dividiendo el precio.
            if ($clave === 'objecion_precio') {
                return wabot_agente_agregar_cta([
                    'texto' => wabot_objecion_texto('caro', $cfg['caro'], $conv, $cfg),
                    'nota' => 'Contestá con esto. No calcules el monto de cada cuota ni agregues números que no estén acá.',
                ], $conv, $cfg);
            }
            $txt = $cfg['info'][$clave] ?? $cfg['info']['otra'];
            return wabot_agente_agregar_cta([
                'texto' => $txt,
                'nota' => 'Contestá con esta información y nada más.',
            ], $conv, $cfg);

        case 'manejar_objecion':
            $tipo = $args['tipo'] ?? '';
            $mapa = [
                'pensarlo' => 'pensarlo',
                'socio' => 'socio',
                'ya_tiene_web' => 'ya_tengo_web',
                'plataforma' => 'plataformas',
            ];
            if (!isset($mapa[$tipo]) || empty($cfg[$mapa[$tipo]])) {
                return ['error' => 'Objeción desconocida.'];
            }
            $res = [
                'texto' => wabot_objecion_texto($tipo, $cfg[$mapa[$tipo]], $conv, $cfg),
                'nota' => 'Usá este texto como respuesta comercial. No presiones ni inventes descuentos.',
            ];
            if ($tipo === 'plataforma' && empty($conv['cta_muestra'])) {
                $res['aparte'] = trim((string)($cfg['cta_muestra'] ?? ''));
                $res['nota'] .= ' La invitación a la muestra sale en un globo aparte: no la repitas.';
            }
            $conv['cta_muestra'] = true;
            wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'objecion_' . $tipo]);
            return $res;

        case 'anotar_prediseno':
            wabot_agente_anotar($args, $conv);
            if ($conv['fase'] === 'nuevo' || $conv['fase'] === 'menu') $conv['fase'] = 'prediseno';
            wabot_handoff_aclaracion_resuelta($conv);
            wabot_evento_sesion($conv, 'muestra_aceptada', ['origen' => 'datos']);
            return ['ok' => true, 'anotado' => wabot_agente_ficha($conv),
                    'nota' => 'Dato guardado. No contestes con esto: seguí la charla normal.'];

        case 'guardar_prediseno':
            // Los datos se acumulan: lo que ya estaba anotado no se pisa con vacío.
            wabot_agente_anotar($args, $conv);
            if (empty($conv['precio_dado'])) {
                return ['error' => 'Todavía no le diste el precio. Antes de guardar el prediseño, llamá a dar_precio con el tipo que ya identificaste.',
                        'anotado' => wabot_agente_ficha($conv)];
            }
            if (($conv['descripcion'] ?? '') === '' || ($conv['colores'] ?? '') === '') {
                return ['error' => 'Faltan datos: necesito descripción y colores.',
                        'anotado' => wabot_agente_ficha($conv)];
            }
            // En Instagram falta el teléfono: se pide antes de cerrar, si no el
            // boceto queda sin forma de contactarlo.
            if (wabot_canal($conv) === 'instagram' && empty($conv['telefono_wsp'])) {
                $conv['fase'] = 'prediseno_wsp';
                return ['texto' => $cfg['prediseno_whatsapp'],
                        'exacta' => true,
                        'nota' => 'Pedile el WhatsApp con este texto. Todavía NO cierres: falta ese dato.'];
            }
            if (empty($conv['lead_creado'])) {
                $conv['lead_creado'] = wabot_firestore_lead($conv, $cfg);
                wabot_muestra_guardar($conv, $cfg, $conv['lead_creado']);
            }
            wabot_handoff_marcar($conv, 'prediseno');
            return ['texto' => $cfg['prediseno_completo'], 'terminal' => true];

        case 'anotar_sistema':
            wabot_agente_anotar_sistema($args, $conv);
            wabot_handoff_aclaracion_resuelta($conv);
            $ficha = wabot_agente_ficha_sistema($conv);
            $faltan = [];
            if ($ficha['problema'] === '') {
                $faltan[] = 'qué necesita resolver';
                $conv['fase'] = 'sistema_problema';
            } elseif ($ficha['usuarios'] === '') {
                $faltan[] = 'cuántas personas lo usarían';
                $conv['fase'] = 'sistema_usuarios';
            } elseif ($ficha['metodo_actual'] === '') {
                $faltan[] = 'cómo lo maneja hoy';
                $conv['fase'] = 'sistema_actual';
            } else {
                $conv['fase'] = 'sistema_listo';
            }
            return [
                'ok' => true,
                'anotado' => $ficha,
                'nota' => $faltan
                    ? 'Dato guardado. Preguntá UNA sola cosa ahora: ' . $faltan[0] . '.'
                    : 'Ya están los tres datos. Llamá ahora a guardar_sistema.',
            ];

        case 'guardar_sistema':
            wabot_agente_anotar_sistema($args, $conv);
            $ficha = wabot_agente_ficha_sistema($conv);
            if ($ficha['problema'] === '' || $ficha['metodo_actual'] === '' || $ficha['usuarios'] === '') {
                return ['error' => 'Faltan datos del sistema.', 'anotado' => $ficha,
                        'nota' => 'Pedí solo el primer dato que falte; todavía no cierres.'];
            }
            $cerrado = wabot_sistema_completo($conv, $cfg);
            if (($conv['fase'] ?? '') === 'sistema_wsp') {
                return ['texto' => $cerrado[0],
                        'exacta' => true,
                        'nota' => 'Pedile el WhatsApp con este texto. Todavía NO cierres: falta un número real de contacto.'];
            }
            return ['texto' => $cerrado[0], 'terminal' => true];

        case 'derivar':
            $causa = wabot_agente_handoff_causa($conv, $args);
            if ($causa === null) {
                if (function_exists('wabot_evento')) {
                    wabot_evento($conv, 'handoff_rechazado', [
                        'motivo' => (string)($args['motivo'] ?? ''),
                        'aclaraciones_fallidas' => (int)($conv['aclaraciones_fallidas'] ?? 0),
                    ]);
                }
                return [
                    'error' => 'Handoff no autorizado: el cliente no pidió humano ni mostró intención explícita de pago, y todavía no agotaste dos aclaraciones.',
                    'nota' => 'No derives. Hacé UNA pregunta concreta para entender qué necesita. Si una respuesta posterior sigue ambigua, podés volver a intentar; dos respuestas fallidas habilitan el handoff.',
                    'aclaraciones_fallidas' => (int)($conv['aclaraciones_fallidas'] ?? 0),
                ];
            }
            wabot_handoff_marcar($conv, $causa);
            wabot_log('agente_deriva', ['tel' => $conv['tel'], 'motivo' => $args['motivo'] ?? '', 'causa' => $causa]);
            return ['texto' => $cfg['derivar'], 'terminal' => true];
    }
    return ['error' => 'Herramienta desconocida.'];
}

/** Agrega un único empujón hacia la muestra después de una duda en fase precio. */
function wabot_agente_agregar_cta($res, &$conv, $cfg) {
    if (($conv['fase'] ?? '') !== 'precio' || !empty($conv['cta_muestra'])) return $res;
    $cta = trim((string)($cfg['cta_muestra'] ?? ''));
    if ($cta === '') return $res;
    $res['aparte'] = $cta;
    $res['nota'] = trim((string)($res['nota'] ?? ''))
                 . ' La invitación a la muestra sale después en otro globo: no la repitas.';
    $conv['cta_muestra'] = true;
    wabot_evento_sesion($conv, 'muestra_ofrecida', ['origen' => 'duda_caliente']);
    return $res;
}

/**
 * Guarda y valida la causa de handoff usando el texto real. El enum que manda
 * Gemini es una pista, nunca la autorización.
 */
function wabot_agente_handoff_causa(&$conv, $args) {
    $actual = trim((string)($conv['_mensaje_agente'] ?? ''));
    if ($actual === '') $actual = wabot_ultimo_texto_cliente($conv);
    $causa = wabot_handoff_causa_explicita($actual);

    if ($causa === null && ($args['causa'] ?? '') === 'productos_y_cursos') {
        $reciente = '';
        foreach (array_slice((array)($conv['transcript'] ?? []), -10) as $t) {
            if (($t['q'] ?? '') === 'cliente') $reciente .= ' ' . ($t['t'] ?? '');
        }
        $reciente .= ' ' . $actual;
        $posible = wabot_handoff_causa_explicita(trim($reciente));
        if ($posible === 'productos_y_cursos') $causa = $posible;
    }

    if ($causa !== null) return $causa;
    return wabot_handoff_ambiguedad($conv, $actual !== '' ? $actual : (string)($args['motivo'] ?? ''));
}

/** Acumula el brief estructurado de un sistema sin pisar datos con vacío. */
function wabot_agente_anotar_sistema($args, &$conv) {
    $mapa = [
        'problema' => 'sistema_problema',
        'usuarios' => 'sistema_usuarios',
        'metodo_actual' => 'sistema_actual',
    ];
    foreach ($mapa as $entrada => $estado) {
        $v = trim((string)($args[$entrada] ?? ''));
        if ($v !== '') $conv[$estado] = $v;
    }
}

function wabot_agente_ficha_sistema($conv) {
    return [
        'problema' => trim((string)($conv['sistema_problema'] ?? '')),
        'usuarios' => trim((string)($conv['sistema_usuarios'] ?? '')),
        'metodo_actual' => trim((string)($conv['sistema_actual'] ?? '')),
    ];
}

/**
 * Guarda los datos del prediseño que vayan llegando. Nunca pisa con vacío: si
 * el modelo manda solo los colores, la descripción que ya estaba se conserva.
 * Esto es lo que hace que, si el agente se cae, el motor de reglas siga desde
 * donde iba la charla y no vuelva a pedir lo que el cliente ya contestó.
 */
function wabot_agente_anotar($args, &$conv) {
    foreach (['descripcion', 'colores'] as $k) {
        $v = trim((string)($args[$k] ?? ''));
        if ($v !== '') $conv[$k] = $v;
    }
    if (array_key_exists('referencia', $args)) {
        $ref = trim((string)$args['referencia']);
        if ($ref !== '' && !wabot_es_negativa($ref) && !wabot_apunta_a_lo_ya_dicho($ref)) {
            $conv['referencia'] = $ref;
        } elseif ($ref !== '' && wabot_es_negativa($ref)) {
            $conv['referencia'] = '';        // dijo que no tiene: queda contestada
        }
        $conv['referencia_preguntada'] = true;
    }
}

/** Qué datos del prediseño ya están, para que el modelo no los vuelva a pedir. */
function wabot_agente_ficha($conv) {
    return [
        'descripcion' => (string)($conv['descripcion'] ?? ''),
        'colores'     => (string)($conv['colores'] ?? ''),
        'referencia'  => (string)($conv['referencia'] ?? ''),
        'referencia_preguntada' => !empty($conv['referencia_preguntada']),
    ];
}

/** El playbook de venta. Sale de bot-config.json, así lo que edita Pablo manda. */
function wabot_agente_sistema($conv, $cfg) {
    $extra = trim((string)($cfg['indicaciones_estilo'] ?? ''));
    $ind   = trim((string)($cfg['indicaciones'] ?? ''));
    $canal = wabot_canal($conv);
    $nombre = trim((string)($conv['nombre'] ?? ''));

    $p = <<<EOT
Sos el asistente comercial de Gokywebs, agencia argentina de diseño y desarrollo de páginas web y sistemas de gestión. Atendés por WhatsApp o Instagram a dueños de negocios que responden a un anuncio. Tu objetivo es entender qué necesitan, avanzar la venta y dejar siempre un próximo paso concreto.

CÓMO TRABAJÁS
- Conversás como una persona, no como un formulario. Podés preguntar, repreguntar y comentar lo que te cuentan.
- Sonás profesional y cercano a la vez: tuteás (voseo), pero con un registro cuidado, como un asesor que atiende a un dueño de negocio, no como un amigo ni como un vendedor. Nada de muletillas coloquiales ("che", "dale", "de una", "posta", "buenísimo", "joya", "genial") en lo que escribís vos: se reemplazan por "perfecto", "excelente", "de acuerdo", "por supuesto". Nada de frases de venta ("aprovechá", "imperdible", "oferta", "no te lo pierdas") ni de presión. Informás, orientás y siempre dejás un próximo paso concreto; el que decide es el cliente.
- Una pregunta por mensaje. Mensajes cortos, de 2 a 4 líneas: es chat.
- Apuntá a dar el precio rápido, sin interrogatorios. Si con lo que te dijeron ya sabés qué tipo es, dalo.
- Pero si el rubro no alcanza para saber qué tipo de web necesita, preguntá lo que haga falta (de a una) antes de cotizar. Cotizar mal por no preguntar es el peor error: después no se puede dar otro precio.
- No repitas lo que ya dijiste en la charla.
- Un "sí", "dale", "ok", "listo" o "de una" pelados contestan LA ÚLTIMA PREGUNTA QUE HICISTE, no abren un tema nuevo. Si venías de ofrecer el prediseño, ese "dale" es que lo acepta: pedile la descripción, no lo derives. Derivar ahí corta la venta en el mejor momento.

LOS TIPOS DE WEB
- Landing: un profesional u oficio que trabaja por pedido y lo contactan por WhatsApp. Plomero, gasista, electricista, pintor, fletes, cerrajero, jardinero, contador, abogado, fotógrafo. Es la web más básica: presenta y contacta.
- Web con turnos: un servicio que atiende con día y horario y quiere que el cliente reserve solo desde la página.
- Web institucional: una EMPRESA o una institución, no un profesional solo. Pyme, fábrica, distribuidora, constructora, consultora, estudio con equipo, colegio, universidad, fundación, ONG, club, cámara, municipio. Necesita una web más completa que una landing.
- Web con catálogo: vende productos pero NO quiere cobrar online. Quiere mostrar su catálogo completo y que le consulten por WhatsApp. Se cotiza $200.000 más $500 por cada producto cargado, así que ANTES de cotizar necesitás saber cuántos productos va a publicar.
- Ecommerce: quiere vender productos físicos o digitales DESDE la web, con catálogo, carrito y cobro online. Revender marcas como Just, Essen o Avon también puede ser ecommerce, pero solo si confirmó esa modalidad.
- Inmobiliaria: publica propiedades.
- Plataforma de cursos: vende cursos desde la web, con los videos subidos y acceso propio para cada alumno.

DESEMPATE OBLIGATORIO CON TURNOS
Hay rubros que trabajan con turno o reserva y ahí SIEMPRE preguntás antes de cotizar. Son: peluquería, barbería, salón de belleza, estética, spa, masajes, uñas, depilación, tatuajes; consultorio médico, odontológico, kinesiología, psicología, nutrición, fonoaudiología; veterinaria; gimnasio, pilates, yoga o clases con cupo; canchas de fútbol, pádel o tenis; cabañas, hotel o alquiler temporario; restaurante que reserva mesa; taller mecánico con turno; estudio fotográfico con sesiones.
La pregunta es si quiere que sus clientes saquen el turno solos desde la página, eligiendo día y horario, o si alcanza con que le escriban por WhatsApp y los agenda él.
Que reserven desde la web = web con turnos. Que le escriban nomás = landing.
NUNCA cotices uno de esos rubros sin haber hecho la pregunta.

DESEMPATE OBLIGATORIO CON COMERCIOS
Si vende CUALQUIER producto y no dijo cómo quiere usar la web, SIEMPRE preguntá antes de cotizar: si quiere vender desde la página con catálogo, carrito y cobro online, o mostrar lo que hace y que lo contacten por WhatsApp. Vale aunque no haya dicho que tiene un local. "Para mates", "vendo velas" o "hacemos muebles" todavía no alcanzan para cotizar.
Ejemplos de comercios: ferretería, kiosco, almacén, dietética, ropa, bazar, vivero, librería, juguetería, panadería, carnicería, pet shop, corralón y repuestos.
Vender online = ecommerce. Solo mostrar el catálogo y que le escriban = web con catálogo, y ahí necesitás UN dato más antes de dar el precio: cuántos productos va a publicar, porque se cobra $500 por cada uno. Preguntáselo con dar_precio(catalogo) sin el parámetro productos, que te devuelve la pregunta exacta; cuando te diga el número, volvés a llamarla con productos. Nunca estimes vos la cantidad ni cotices sin ese dato. Un comercio a la calle NUNCA es una web institucional.

DESEMPATE OBLIGATORIO CON CURSOS
Si da o vende cursos, antes de cotizar preguntale si quiere venderlos desde la web misma con los videos y acceso para cada alumno, o si prefiere solo mostrarlos y que lo contacten por WhatsApp. Venderlos = plataforma de cursos. Solo mostrarlos = landing.

EMPRESA O INSTITUCIÓN
Si te dice que es una empresa, una pyme, una fábrica, una institución, un colegio, una fundación o una ONG, eso NO es una landing: es una web institucional y se cotiza como tal. No hace falta preguntar nada más.

SISTEMAS DE GESTIÓN A MEDIDA
- También hacemos sistemas, apps internas y paneles a medida para stock, ventas, turnos, clientes, operaciones o procesos propios.
- APENAS aparezca esa necesidad llamá a anotar_sistema, aunque todavía no tengas ningún dato: eso abre el flujo correcto y evita derivarlo frío.
- No tienen precio de lista y NUNCA se cotizan con dar_precio. Para calificarlos juntá tres respuestas, de a una y en este orden: (1) qué problema necesita resolver, (2) cuántas personas o qué roles lo usarían, y (3) cómo lo maneja hoy —papel, Excel, WhatsApp u otro sistema—.
- Cada dato se guarda en el mismo turno con anotar_sistema. Si ya dijo dos juntos, guardá los dos y preguntá solo el tercero.
- Cuando estén los tres, llamá a guardar_sistema. Esa herramienta crea el brief, cierra y deja la propuesta con Pablo.
- En Instagram guardar_sistema puede pedir el WhatsApp antes de cerrar. En ese caso hacé esa pregunta y no anuncies el cierre todavía; el código valida el número en el mensaje siguiente.

REGLAS QUE NO PODÉS ROMPER
- Los precios y los links los conocés SOLO llamando a dar_precio. Nunca los digas de memoria ni los inventes.
- NUNCA anuncies que vas a pasar un precio, un link o un dato sin haber llamado a la herramienta en ese mismo turno. Primero llamás a la herramienta, y recién con lo que te devuelve escribís el mensaje completo. Un mensaje que termina en "te paso el precio:" y no lo pasa es un error grave.
- Un solo tipo y un solo precio por conversación.
- Si vende productos Y ADEMÁS cursos online, no cotices: solicitá derivar con causa productos_y_cursos.
- Las dudas sobre cómo trabajamos, pago, plazos, hosting, mantenimiento, carga de productos, logo, marketing, reuniones o tecnología se contestan llamando a consultar_info. Nunca de memoria.
- Si pregunta CÓMO TRABAJAMOS o cómo es el paso a paso ("cómo se manejan", "cómo arrancamos", "cómo sigue"), usá consultar_info('proceso'). Ese texto explica que primero va la muestra gratis, después la seña para el desarrollo y el saldo al entregar. **No digas el monto de la seña ahí**: si quiere el número, es otra pregunta y va por consultar_info('pago').
- Si te preguntan algo que no cubre ninguna herramienta, decí que ese detalle se lo confirma el equipo. No inventes.
- Nunca bajes el precio ni ofrezcas descuentos.
- Si dice que es caro, regatea o duda por la plata, llamá a consultar_info('objecion_precio') y contestá con ese texto: ahí ya están las 3 cuotas sin interés. Es la ÚNICA situación donde se mencionan — nunca las ofrezcas de entrada (regalás el descuento a alguien que iba a pagar igual) y nunca calcules el monto de cada cuota.
- Si dice "lo tengo que pensar", usá manejar_objecion('pensarlo'). Si lo habla con un socio, 'socio'. Si ya tiene página, 'ya_tiene_web'. Si compara con Wix, Tiendanube, Shopify u otra plataforma, 'plataforma'. Esas respuestas conducen a la muestra gratis; no las reemplaces por "te confirma el equipo".
- Después de una duda caliente en fase precio, consultar_info puede devolverte una invitación a la muestra en un globo aparte. No la copies dentro de tu texto y no vuelvas a ofrecerla después: el código la permite una sola vez.
- El mantenimiento es opcional y se contesta con consultar_info, que ya te devuelve el precio y el link que corresponden al tipo cotizado. No los digas de memoria: cambian según la web.
- Si dice que no le interesa, cerrá cordial y sin insistir.

EL PREDISEÑO
Es gratis y sin compromiso: le armamos una versión de su web para que la vea antes de decidir. Ofrecelo siempre junto al precio. Si muerde, pedile tres cosas, de a una por mensaje:
1. Una descripción breve de lo que ofrece.
2. Los colores de su marca.
3. Si tiene alguna página de referencia que le haya gustado, o algún estilo pensado. Aclarale que puede ser de cualquier rubro y que si no tiene ninguna no hay problema.
APENAS el cliente te contesta una de las tres, llamá a anotar_prediseno con ese dato EN EL MISMO TURNO, antes de escribirle. No esperes a tenerlas las tres: si la charla se corta y no lo anotaste, ese dato se pierde y después se lo terminamos pidiendo de nuevo, que es lo peor que nos puede pasar.
Cuando tengas las tres respuestas (la tercera puede ser "no tengo"), llamá a guardar_prediseno. No pidas ningún otro dato: ni mail, ni cantidad de productos, ni formularios.
Si el cliente ya te había pasado una referencia antes de que se la pidieras, dala por contestada: anotala y no se la preguntes.

HANDOFF: ÚLTIMO RECURSO, CON GUARDA DE CÓDIGO
- Solo llamá a derivar si el cliente pide hablar con una persona, muestra intención concreta de pagar/contratar, vende productos y cursos a la vez, o si ya hiciste aclaraciones concretas y sigue siendo imposible entenderlo.
- Una frase corta o ambigua como "para mates" NO se deriva: se pregunta si quiere vender online o solo mostrar/contacto.
- Ante ambigüedad, la primera llamada a derivar será rechazada y te obliga a preguntar. Hacen falta dos respuestas posteriores distintas que sigan sin aclarar para habilitar el handoff. No repitas la tool dos veces en la misma vuelta.
- Nunca prometas que Pablo va a escribir si una herramienta terminal no confirmó el handoff.

ESTILO
- Voseo argentino, cordial y directo, como el dueño de la agencia. Formal en el registro, tuteando en la conjugación: "te preparo la muestra", "contame qué necesitás", nunca "le preparo" ni "cuénteme".
- Sin emojis y sin íconos.
- Nunca uses los signos de apertura de interrogación ni de exclamación: solo el de cierre o ninguno.
- Con las tildes correctas: "querés", "preferís", "ahí". Cercano no es escribir mal.
- Español rioplatense, nunca peninsular: jamás uses "vosotros", "os", "vale" ni formas como "dediquéis" o "tenéis". Se dice "a qué te dedicás".
- Si hay un nombre visible y todavía no fue usado, podés usar SOLO el primer nombre una vez, en una confirmación, avance o cierre donde suene natural. No lo pongas en cada mensaje ni fuerces un saludo. Si el estado dice que ya se usó, no lo repitas.

EOT;

    if ($ind !== '')   $p .= "CÓMO INTERPRETAR A LOS CLIENTES (indicaciones del dueño):\n$ind\n\n";
    $ejemplosEntrenados = [];
    foreach (array_slice((array)($cfg['ejemplos'] ?? []), 0, 40) as $ej) {
        $textoEj = trim(preg_replace('/\s+/u', ' ', (string)($ej['texto'] ?? '')));
        $accionEj = preg_replace('/[^a-z0-9_]/', '', mb_strtolower((string)($ej['accion'] ?? '')));
        if ($textoEj === '' || $accionEj === '') continue;
        $lineaEj = '- Cliente: ' . json_encode(mb_substr($textoEj, 0, 180), JSON_UNESCAPED_UNICODE)
                 . ' → interpretá: ' . $accionEj;
        $infoEj = array_values(array_filter(array_map('trim', (array)($ej['info_keys'] ?? []))));
        if ($infoEj) $lineaEj .= ' (' . implode(', ', array_slice($infoEj, 0, 4)) . ')';
        $ejemplosEntrenados[] = $lineaEj;
    }
    if ($ejemplosEntrenados) {
        $p .= "EJEMPLOS ENTRENADOS POR EL DUEÑO\n" . implode("\n", $ejemplosEntrenados)
            . "\nUsalos para interpretar la intención; las reglas y herramientas de arriba siguen mandando.\n\n";
    }
    if ($extra !== '') $p .= "CÓMO QUIERE EL DUEÑO QUE SUENES:\n$extra\n\n";

    // Lo que Pablo contestó de su puño cuando tomó una charla: el mejor ejemplo
    // que hay de cómo se vende acá. Es referencia de estilo y de criterio, no
    // texto para copiar: los precios y los links siguen saliendo de las herramientas.
    $aprendido = wabot_aprendizaje_humano(10);
    if ($aprendido) {
        $p .= "ASÍ CONTESTA PABLO CUANDO ATIENDE ÉL (aprendé el tono y el criterio, no copies literal):\n";
        foreach ($aprendido as $par) {
            $p .= '- Cliente: "' . $par['cliente'] . '" -> Pablo: "' . $par['pablo'] . "\"\n";
        }
        $p .= "Si alguno de esos casos contradice una regla de arriba, mandan las reglas.\n\n";
    }

    if (($conv['fase'] ?? '') === 'derivado') {
        $p .= "ESTA CHARLA YA ESTA CERRADA\n";
        $p .= "Ya le dijimos que le va a escribir Pablo. Quedás disponible SOLO para sacarle dudas mientras espera.\n";
        $p .= "- No vuelvas a cotizar, no ofrezcas el prediseño otra vez y no le pidas ningún dato: eso ya está hecho.\n";
        $p .= "- Las dudas se contestan llamando a consultar_info, como siempre.\n";
        $p .= "- Si pregunta algo que no cubre la herramienta, decile que eso se lo confirma Pablo cuando le escriba. No inventes.\n";
        $p .= "- Si insiste en avanzar o pagar, no lo derives de nuevo: ya está derivado. Decile que Pablo lo toma.\n";
        $p .= "- Si solo agradece o se despide, contestá en una línea y nada más.\n\n";
    }

    $previa = wabot_agente_memoria_previa($conv);
    if ($previa) {
        $hace = max(1, (int)round((time() - (int)end($previa)['ts']) / 86400));
        $p .= "LO QUE ESTE CLIENTE YA CONTÓ EN UNA CHARLA ANTERIOR (hace unos $hace días)\n";
        foreach ($previa as $t) {
            $quien = $t['q'] === 'cliente' ? 'Cliente' : ($t['q'] === 'humano' ? 'Pablo' : 'Vos');
            $p .= "- $quien: \"" . $t['t'] . "\"\n";
        }
        $p .= "Usalo: si ya dijo a qué se dedica o qué necesita, NO se lo vuelvas a preguntar; "
            . "retomá desde ahí (\"la vez pasada me contaste que...\"). Los precios y datos de "
            . "esa charla anterior NO valen: la cotización arranca de nuevo con las herramientas.\n\n";
    }

    $f = wabot_agente_ficha($conv);
    $fs = wabot_agente_ficha_sistema($conv);
    $p .= "ESTADO DE ESTA CHARLA\n";
    $p .= "- Canal: $canal\n";
    $p .= "- Nombre visible: " . ($nombre !== '' ? $nombre : 'no disponible') . "\n";
    $p .= "- Nombre ya usado por el bot: " . (!empty($conv['nombre_usado']) ? 'sí; no lo repitas' : 'no') . "\n";
    $p .= "- Sesión: " . (string)($conv['session_id'] ?? 'sin id') . "\n";
    $p .= "- Tipo ya cotizado: " . ($conv['tipo'] ? $conv['tipo'] : 'ninguno todavía') . "\n";
    $p .= "- Fase: " . $conv['fase'] . "\n";
    $p .= "- Handoff pendiente: " . (!empty($conv['handoff_pendiente']) ? 'sí' : 'no') . "\n";
    $p .= "- Aclaraciones ambiguas fallidas: " . (int)($conv['aclaraciones_fallidas'] ?? 0) . " de 2\n";
    $p .= "- Descripción anotada: " . ($f['descripcion'] !== '' ? $f['descripcion'] : 'todavía no') . "\n";
    $p .= "- Colores anotados: "    . ($f['colores']     !== '' ? $f['colores']     : 'todavía no') . "\n";
    $p .= "- Referencia anotada: "  . ($f['referencia']  !== '' ? $f['referencia']
                                      : ($f['referencia_preguntada'] ? 'ya se la preguntaste y dijo que no tiene' : 'todavía no')) . "\n";
    $p .= "- Sistema / problema: " . ($fs['problema'] !== '' ? $fs['problema'] : 'todavía no') . "\n";
    $p .= "- Sistema / usuarios: " . ($fs['usuarios'] !== '' ? $fs['usuarios'] : 'todavía no') . "\n";
    $p .= "- Sistema / método actual: " . ($fs['metodo_actual'] !== '' ? $fs['metodo_actual'] : 'todavía no') . "\n";
    $p .= "Lo que figura como anotado NO se vuelve a pedir. Si el cliente te reclama que ya te lo dijo, tiene razón: pedile disculpas en una línea y seguí con lo que falta.\n";

    return $p;
}

/** POST a Gemini con historial + herramientas. */
function wabot_agente_llamar($contents, $tools, $sistema) {
    if (function_exists('wabot_ia_disponible') && !wabot_ia_disponible()) {
        wabot_log('agente_circuito_abierto', []);
        return null;
    }

    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . WABOT_GEMINI_MODEL . ':generateContent?key=' . WABOT_GEMINI_KEY;

    $body = json_encode([
        'systemInstruction' => ['parts' => [['text' => $sistema]]],
        'contents'          => $contents,
        'tools'             => $tools,
        'generationConfig'  => ['temperature' => 0.6, 'maxOutputTokens' => 500],
    ], JSON_UNESCAPED_UNICODE);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code < 200 || $code >= 300 || !$res) {
        wabot_log('error', ['donde' => 'agente_api', 'http' => $code, 'res' => substr((string)$res, 0, 300)]);
        if (function_exists('wabot_ia_reportar_error')) wabot_ia_reportar_error('agente_api', (int)$code);
        return null;
    }
    if (function_exists('wabot_ia_reportar_ok')) wabot_ia_reportar_ok();
    return json_decode($res, true);
}
