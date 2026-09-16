<?php
/* Selecciona trabajos publicados del catálogo del portfolio y modelos del rubro. */
function wabot_rubro_detectar($texto) {
    $t = function_exists('wabot_normalizar_frase') ? wabot_normalizar_frase((string)$texto) : strtolower((string)$texto);
    $pistas = [
        'gastronomia' => 'restaurant|restaurante|cafeter|panader|pasteler|torta|catering|bar\b|comida|pizzeria|hotel|evento',
        'moda' => 'ropa|indumentaria|prenda|calzado|zapatilla|boutique|lenceria|textil|vestido',
        'hogar' => 'mueble|decoracion|bazar|hogar|colchon|interiorismo',
        'belleza' => 'estetica|cosmet|peluquer|maquill|unas|spa\b|perfumer',
        'salud' => 'salud|medic|odont|dentist|psicol|terapia|nutric|kinesiol|farmacia',
        'legales' => 'abogad|estudio jurid|contador|contable|notar|escriban',
        'finanzas' => 'seguro|finanz|inversion|prestamo|credito',
        'inmobiliaria' => 'inmobili|propiedad|alquiler|casa en venta|departamento|terreno|loteo',
        'educacion' => 'curso|academia|escuela|capacit|educacion|clase|profesor|docente',
        'tecnologia' => 'tecnolog|electron|celular|computador|software|informat|repuesto de telefon',
        'industria' => 'industr|construccion|ferreter|herramienta|fabrica|maquina|arquitect|obra\b',
        'servicios' => 'servicio|oficio|electric|plomer|limpieza|reparacion|consultor|asesor|mudanza',
        'automotor' => 'auto\b|automotor|moto|taller mecan|vehiculo|repuesto de auto|neumatic',
        'deportes' => 'deporte|fitness|gimnasio|entren|futbol|running|suplement',
        'arte' => 'arte|musica|fotograf|teatro|espectaculo|artista|diseno grafico',
        'turismo' => 'turismo|viaje|hostel|hospedaje|hotel|alojamiento|excursion',
        'comercios' => 'tienda|comercio|mayorista|distribuid|almacen|mercaderia|producto|venta'
    ];
    foreach ($pistas as $rubro => $patron) if (preg_match('/(?:' . $patron . ')/u', $t)) return $rubro;
    return null;
}

function wabot_rubro_sugerencias($texto, $tipo = '') {
    $rubro = wabot_rubro_detectar($texto);
    $archivo = __DIR__ . '/../portfolio/catalogo-online.json';
    $trabajos = json_decode((string)@file_get_contents($archivo), true);
    if (!is_array($trabajos) || (!$rubro && !$tipo)) return null;
    $tipo = $tipo === 'institucional' ? 'landing' : $tipo;
    usort($trabajos, function ($a, $b) use ($rubro, $tipo) {
        $puntuar = function ($x) use ($rubro, $tipo) {
            $tipos = (array)($x['tipo'] ?? []);
            return (isset($x['rubro']) && $x['rubro'] === $rubro ? 4 : 0) + ($tipo && in_array($tipo, $tipos, true) ? 2 : 0);
        };
        return $puntuar($b) <=> $puntuar($a);
    });
    $seleccion = array_slice($trabajos, 0, 5);
    if (count($seleccion) < 5) return null;
    $lineas = ['Te dejo cinco trabajos reales para mirar:'];
    foreach ($seleccion as $x) $lineas[] = '• ' . $x['nombre'] . ': ' . $x['url'];
    $link = 'gokywebs.com/modelos/' . ($rubro ? '?rubro=' . rawurlencode($rubro) : ($tipo ? '?tipo=' . rawurlencode($tipo) : ''));
    $lineas[] = 'Y acá podés elegir uno o dos modelos: ' . $link;
    return ['rubro' => $rubro, 'texto' => implode("\n", $lineas)];
}
