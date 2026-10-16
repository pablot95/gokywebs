<?php
/** Arma para email el mismo pedido que el botón «Copiar 10» del admin. */

const PROSPECTO_CHATGPT_ASUNTO = 'Gokywebs Copiar 10';

function prospecto_chatgpt_primero(array $p, string ...$claves) {
    foreach ($claves as $clave) {
        if (!empty($p[$clave])) return $p[$clave];
    }
    return '';
}

function prospecto_chatgpt_valor($valor): string {
    $texto = is_array($valor) ? implode(', ', array_filter($valor)) : (string)($valor ?? '');
    $texto = trim($texto);
    return in_array($texto, ['', '(no completó)', '(no seleccionó)', 'No aplica', '—'], true) ? '' : $texto;
}

function prospecto_chatgpt_fila(string $titulo, $valor): string {
    $valor = prospecto_chatgpt_valor($valor);
    return $valor === '' ? '' : $titulo . "\n" . $valor;
}

function prospecto_chatgpt_instagram($valor): string {
    $texto = trim((string)($valor ?? ''));
    if (preg_match('~instagram\.com/([A-Za-z0-9._]{1,30})~i', $texto, $m)) $texto = $m[1];
    $texto = ltrim($texto, '@');
    if (!preg_match('/^[A-Za-z0-9._]{1,30}$/', $texto)
        || in_array(strtolower($texto), ['p', 'reel', 'reels', 'stories', 'explore'], true)) return '';
    return 'https://www.instagram.com/' . $texto . '/';
}

function prospecto_chatgpt_negocio(array $p): array {
    $nombre = prospecto_chatgpt_valor($p['nombre_negocio'] ?? '');
    $rubro = prospecto_chatgpt_valor($p['rubro'] ?? '');
    $combinado = prospecto_chatgpt_valor($p['negocio_rubro'] ?? '');
    $legacy = $combinado !== '' ? $combinado : ($nombre === $rubro ? $nombre : '');
    $partes = preg_split('/\s+[—–|]\s+/u', $legacy);
    $partes = array_values(array_filter(array_map('trim', $partes)));
    if (count($partes) >= 2) {
        if ($nombre === '' || $nombre === $rubro || $nombre === $combinado) $nombre = array_shift($partes);
        if ($rubro === '' || $rubro === $nombre || $rubro === $combinado || $rubro === $legacy) $rubro = implode(' — ', $partes);
    } else {
        if ($nombre === '' && $combinado !== '') $nombre = $combinado;
        if ($nombre !== '' && $rubro === $nombre) $rubro = '';
    }
    return [$nombre, $rubro];
}

function prospecto_chatgpt_objetivos(array $p): string {
    if (!empty($p['objetivos_texto'])) return prospecto_chatgpt_valor($p['objetivos_texto']);
    $valor = prospecto_chatgpt_primero($p, 'objetivos', 'objectives');
    if (!is_array($valor)) return prospecto_chatgpt_valor($valor);
    $labels = [
        'vender-online' => 'Productos y venta online',
        'catalogo-whatsapp' => 'Productos y venta por WhatsApp',
        'mostrar-servicios' => 'Mostrar servicios',
        'mostrar-productos-wp' => 'Mostrar productos (WhatsApp)',
        'cursos-digitales' => 'Vender cursos / productos digitales',
        'mostrar-negocio' => 'Mostrar servicios o prestaciones',
        'portfolio' => 'Mostrar portafolio',
        'inmobiliaria' => 'Bienes raíces / Inmobiliaria',
        'reservas-turnos' => 'Sistema de reserva de turnos, citas o alojamientos',
    ];
    return prospecto_chatgpt_valor(array_map(fn($v) => $labels[$v] ?? $v, $valor));
}

function prospecto_chatgpt_chat(string $chat): string {
    if ($chat === '') return '';
    $mensajes = preg_split('/(?=^\d{2}\/\d{2} \d{2}:\d{2} (?:Cliente|Bot|Vos): )/m', $chat);
    $limpios = [];
    foreach ($mensajes as $mensaje) {
        if (!preg_match('/^(\d{2}\/\d{2} \d{2}:\d{2} Bot: )([\s\S]*)$/', $mensaje, $m)) {
            $limpios[] = $mensaje;
            continue;
        }
        $cuerpo = $m[2];
        if (preg_match('~gokywebs\.com/form~i', $cuerpo)) continue;
        if (preg_match('/(?:Ten[eé]s dos opciones para contratar el servicio|Lo pod[eé]s contratar de dos formas|Pod[eé]s contratarla de dos maneras|Pod[eé]s elegir entre dos planes)\s*[:,]?/iu', $cuerpo, $plan, PREG_OFFSET_CAPTURE)) {
            $descripcion = trim(substr($cuerpo, 0, $plan[0][1]));
            if ($descripcion !== '') $limpios[] = $m[1] . $descripcion . "\n";
            continue;
        }
        $cotizacion = preg_match('/pago\s+[uú]nico|plan\s+anual/iu', $cuerpo)
            && preg_match('/(?:suscripci[oó]n\s+mensual|plan\s+mensual|mensualidad|por\s+mes)/iu', $cuerpo);
        if ($cotizacion || preg_match('~gokywebs\.com/presupuestos/~i', $cuerpo)) continue;
        $limpios[] = $mensaje;
    }
    return trim(implode('', $limpios));
}

function prospecto_chatgpt_prompt(array $p): string {
    [$nombre, $rubro] = prospecto_chatgpt_negocio($p);
    $sobre = array_unique(array_filter([
        $rubro,
        prospecto_chatgpt_valor(prospecto_chatgpt_primero($p, 'productos_servicios', 'productosServicios')),
        prospecto_chatgpt_valor(prospecto_chatgpt_primero($p, 'objetivo_web', 'objetivoWeb')),
    ], fn($v) => $v !== ''));
    $fondos = prospecto_chatgpt_valor($p['color_fondos'] ?? '');
    $principal = prospecto_chatgpt_valor($p['color_principal'] ?? '');
    $secundario = prospecto_chatgpt_valor($p['color_secundario'] ?? '');
    $colores = $fondos === '' && $principal === '' && $secundario === ''
        ? prospecto_chatgpt_valor(prospecto_chatgpt_primero($p, 'colores', 'colores_extra')) : '';
    $tipo = array_key_exists('tipo_web', $p)
        ? prospecto_chatgpt_valor($p['tipo_web'])
        : prospecto_chatgpt_valor(prospecto_chatgpt_primero($p, 'tipoDetectadoLabel', 'tipoDetectado'));
    $filas = [
        prospecto_chatgpt_fila('Nombre del negocio / marca', $nombre),
        prospecto_chatgpt_fila('Sobre el negocio y qué quiere lograr con la web', implode(' · ', $sobre)),
        prospecto_chatgpt_fila('Objetivos de la web', prospecto_chatgpt_objetivos($p)),
        prospecto_chatgpt_fila('Estilo de página', $p['estilo_pagina'] ?? ''),
        prospecto_chatgpt_fila('Incluir sí o sí', $p['incluir_si_o_si'] ?? ''),
        prospecto_chatgpt_fila('Adicionales elegidos', $p['adicionales_texto'] ?? ''),
        prospecto_chatgpt_fila('Teléfono / WhatsApp (número real para los wa.me del demo)', prospecto_chatgpt_primero($p, 'telefono', 'contacto_cel')),
        prospecto_chatgpt_fila('Instagram', prospecto_chatgpt_instagram($p['instagram'] ?? '')),
        prospecto_chatgpt_fila('Tipo de web', $tipo),
        prospecto_chatgpt_fila('Ciudad / zona', $p['ciudad_zona'] ?? ''),
        prospecto_chatgpt_fila('Cantidad de cursos', $p['cant_cursos'] ?? ''),
        prospecto_chatgpt_fila('Imágenes que mandó por WhatsApp/Instagram', (int)($p['imagenes_recibidas'] ?? 0) > 0 ? (string)(int)$p['imagenes_recibidas'] : ''),
        prospecto_chatgpt_fila('Color de fondos', $fondos),
        prospecto_chatgpt_fila('Color principal', $principal),
        prospecto_chatgpt_fila('Color secundario', $secundario),
        prospecto_chatgpt_fila('Colores de marca', $colores),
        prospecto_chatgpt_fila('Tipografías', $p['tipografias'] ?? ''),
    ];
    $datos = implode("\n\n", array_filter($filas, fn($v) => $v !== ''));
    $chat = prospecto_chatgpt_chat(prospecto_chatgpt_valor($p['chat_completo'] ?? ''));
    if ($chat !== '') $datos .= "\n\nAcá está el chat con el cliente, por si algún dato del brief quedó corto:\n\n" . $chat . "\n";
    return "Crea 9 imágenes y crea un mock up de la web 720 x 480 usando estas imágenes.\n\n"
        . "Las 9 imágenes, todas juntas y sin textos: 1 tamaño 9:16 y otra tamaño 16:9. 7 imágenes 1:1. Que todas las imágenes sean diferentes entre sí, para secciones diferentes. Si es ecommerce, que sean simplemente imágenes de distintos productos. Que parezcan fotos reales, tomadas de la realidad: nada de ilustraciones, dibujos ni renders.\n\n"
        . "La web es para:\n" . $datos;
}
