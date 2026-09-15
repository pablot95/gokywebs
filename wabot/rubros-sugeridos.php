<?php
/**
 * wabot/rubros-sugeridos.php
 *
 * Qué mostrar cuando el cliente ya dijo su rubro: hasta 5 trabajos reales
 * del portfolio de ese nicho concreto (no solo del tipo de web) + el link al
 * portfolio ya filtrado + la letra del modelo de estructura que más se le
 * parece (ver modelos/modelos.js). Pedido de Pablo, 15-sep-2026: "leyendo
 * todos los rubros de la gente... crees que todos los rubros podrian encajar
 * con las paginas de portfolio... mostrar al menos 5 trabajos por cada rubro
 * que da la persona".
 *
 * NO está enganchado a wabot_config_portfolio() todavía: hoy esa función
 * arma el link SOLO por tipo de web (gokywebs.com/portfolio/?tipo=ecommerce),
 * sin mirar el rubro. Este archivo es standalone a propósito, para no tocar
 * lib.php/engine.php mientras la rama wabot-limpieza los está reescribiendo
 * (ver proyecto_revision_estructural_wabot_15sep en memoria). Para engancharlo:
 * llamar wabot_rubro_sugerido_texto(wabot_rubro_sugerido_detectar($texto), $cfg)
 * y sumar el resultado como mensaje aparte, después del precio.
 *
 * Los ids son los de portfolio/data.js al 15-sep-2026 (94 trabajos). Si se
 * agregan o sacan trabajos del portfolio, esta tabla queda vieja: no hay
 * chequeo automático todavía (ver TODO más abajo).
 */

/**
 * Nichos más finos que los 17 rubros del portfolio, armados leyendo los
 * chats del wabot de la semana del 15-sep (y semanas previas) + coverage
 * real del portfolio. Cada nicho apunta a los ids que más se le parecen,
 * aunque estén en un rubro "grande" distinto (ej: mates y dietética caen
 * los dos en gastronomía/comercios, no hay una sección de productos
 * puntual para cada uno).
 *
 * 'portfolio_rubro' es el id de GW_RUBROS (portfolio/data.js) para el link
 * "ver el resto": gokywebs.com/portfolio/?rubro=X
 * 'modelo' es la letra de modelos/modelos.js más parecida a ese negocio.
 */
function wabot_rubros_sugeridos_tabla() {
    return [

        // ── Moda / indumentaria ──────────────────────────────────────
        'ropa_mujer' => [
            'match' => '/\b(ropa|indumentaria|prendas?)\b.{0,20}\b(mujer|dama|femenin\w*)\b|\bropa\b(?!.{0,20}\b(hombre|nin\w*|bebe\w*)\b)/u',
            'portfolio_rubro' => 'moda', 'modelo' => 'c',
            'trabajos' => ['tusencantos', 'mirameindumentaria', 'jukkamoda'],
        ],
        'calzado' => [
            'match' => '/\b(zapatillas?|calzados?|zapatos|mocasines)\b/u',
            'portfolio_rubro' => 'moda', 'modelo' => 'c',
            'trabajos' => ['elmundodelcalzado', 'sparrow'],
        ],
        'lenceria' => [
            'match' => '/\b(lenceria|corpinos?|bombachas?|fajas?|ropa interior)\b/u',
            'portfolio_rubro' => 'moda', 'modelo' => 'c',
            'trabajos' => ['esbelt', 'intimatebycelina'],
        ],
        'ropa_bebes_ninos' => [
            'match' => '/\b(ropa|indumentaria)\b.{0,20}\b(bebes?|ninos?|niñas?|infantil|teens?)\b/u',
            'portfolio_rubro' => 'moda', 'modelo' => 'c',
            'trabajos' => ['tusencantos', 'mirameindumentaria', 'jukkamoda'],
        ],
        'joyeria_accesorios' => [
            'match' => '/\b(joyeria|bijouteria|accesorios de moda|aros|collares|pulseras)\b/u',
            'portfolio_rubro' => 'moda', 'modelo' => 'c',
            'trabajos' => ['tusencantos', 'esbelt', 'sparrow'],
        ],

        // ── Gastronomía / comercios de consumo ───────────────────────
        'comida_delivery' => [
            'match' => '/\b(pizzeria|rotiseria|pollo|pollos|hamburguesas?|comida[s]? (casera|casers)|viandas?|delivery de comida)\b/u',
            'portfolio_rubro' => 'gastronomia', 'modelo' => 'e',
            'trabajos' => ['lanuevasantelmo', 'saborquetecuida', 'lasmagnolias', 'cococatering', 'masmomentosunicos'],
        ],
        'dietetica_organicos' => [
            'match' => '/\b(dietetica|organic\w*|sin tacc|nutricion|hierbas|suplementos|proteinas?)\b/u',
            'portfolio_rubro' => 'gastronomia', 'modelo' => 'a',
            'trabajos' => ['saborquetecuida', 'lasmagnolias', 'lanuevasantelmo'],
        ],
        'mercaderia_distribucion' => [
            'match' => '/\b(distribuidora|reparto|mayorista|por mayor|almacen|entrego mercaderia|entrega( de| a)? mercaderia|mercaderia a domicilio)\b/u',
            'portfolio_rubro' => 'comercios', 'modelo' => 'd',
            'trabajos' => ['distsur', 'movilmarket', 'giudicattivisual', 'infinitamente'],
        ],

        // ── Hogar / regalos / deco ────────────────────────────────────
        'regalos_deco_velas' => [
            'match' => '/\b(regalos?|deco|decoracion|velas|aromas|difusores?|souvenirs?)\b/u',
            'portfolio_rubro' => 'hogar', 'modelo' => 'c',
            'trabajos' => ['mdaromes', 'verdehogar', 'lasmagnoliasfloreria'],
        ],
        'muebles' => [
            'match' => '/\b(muebles|placares|cocinas a medida|carpinteria)\b/u',
            'portfolio_rubro' => 'hogar', 'modelo' => 'c',
            'trabajos' => ['carpinteriars', 'verdehogar'],
        ],
        'herramientas_ferreteria' => [
            'match' => '/\b(herramientas|ferreteria|materiales de construccion|pinturas?)\b/u',
            'portfolio_rubro' => 'industria', 'modelo' => 'd',
            'trabajos' => ['jdmaquinasyherramientas', 'grupoacot', 'silcasa'],
        ],
        'papeleria_encuadernacion' => [
            'match' => '/\b(papeleria|encuadernacion|libreria|imprenta)\b/u',
            'portfolio_rubro' => 'comercios', 'modelo' => 'a',
            'trabajos' => ['infinitamente', 'distsur'],
        ],

        // ── Belleza / estética ────────────────────────────────────────
        'estetica_cosmiatria' => [
            'match' => '/\b(estetica|cosmiatr\w*|medicina estetica|tratamientos faciales|depilacion|lashista|pesta[nñ]as)\b/u',
            'portfolio_rubro' => 'belleza', 'modelo' => 'h',
            'trabajos' => ['lessence', 'kare', 'distririogrande', 'encantoestetica'],
        ],
        'peluqueria_unas' => [
            'match' => '/\b(peluqueria|manicura|unas|barberia|tatuajes?)\b/u',
            'portfolio_rubro' => 'belleza', 'modelo' => 'h',
            'trabajos' => ['zechtatuajes', 'lessence', 'encantoestetica'],
        ],

        // ── Salud / bienestar ─────────────────────────────────────────
        'holistico_terapias' => [
            'match' => '/\b(holistic\w*|terapias?|reiki|tarot|hipnosis|sanacion|masajes?|bienestar)\b/u',
            'portfolio_rubro' => 'salud', 'modelo' => 'g',
            'trabajos' => ['experienciaki', 'entrecartasyjose', 'espaciovicenzo'],
        ],
        'psicologia_consultorios' => [
            'match' => '/\b(psicolog\w*|consultorio|nutricionista|kinesiolog\w*|odontolog\w*|dentista)\b/u',
            'portfolio_rubro' => 'salud', 'modelo' => 'h',
            'trabajos' => ['licenciadaluena', 'psicorodas', 'skymed', 'urgencias24hs', 'sanatoriosarmiento'],
        ],
        'cuidado_adultos_enfermeria' => [
            'match' => '/\b(cuidado de adultos|enfermeria|cuidadores?|acompa[nñ]ante terapeutic\w*)\b/u',
            'portfolio_rubro' => 'salud', 'modelo' => 'h',
            'trabajos' => ['sanatoriosarmiento', 'skymed', 'aisamsalud'],
        ],

        // ── Servicios / oficios ───────────────────────────────────────
        'plomeria_mantenimiento' => [
            'match' => '/\b(plomer\w*|gasista|electricist\w*|refrigeracion|aire acondicionado|mantenimiento tecnico|service tecnico)\b/u',
            'portfolio_rubro' => 'servicios', 'modelo' => 'f',
            'trabajos' => ['segeym', 'servitechba', 'jnservicios'],
        ],
        'construccion_metalurgica' => [
            'match' => '/\b(construccion|metalurgic\w*|paneles solares|soldadura|steel frame|obra)\b/u',
            'portfolio_rubro' => 'industria', 'modelo' => 'f',
            'trabajos' => ['silcasa', 'grupoacot', 'jnservicios', 'ampsolutionsar'],
        ],
        'fletes_transporte' => [
            'match' => '/\b(fletes?|mudanzas?|transporte de carga|logistica)\b/u',
            'portfolio_rubro' => 'servicios', 'modelo' => 'f',
            'trabajos' => ['grupohv', 'transportemrtruck'],
        ],
        'agrimensor_topografia' => [
            'match' => '/\b(agrimensor\w*|topograf\w*|mensuras?)\b/u',
            'portfolio_rubro' => 'servicios', 'modelo' => 'f',
            'trabajos' => ['agrimensurasatelital'],
        ],
        'consultoria_marketing' => [
            'match' => '/\b(consultor\w*|community manager|marketing digital|rrhh|recursos humanos)\b/u',
            'portfolio_rubro' => 'servicios', 'modelo' => 'f',
            'trabajos' => ['csgestionpymes', 'cansuarconsultora'],
        ],

        // ── Legales / contable ────────────────────────────────────────
        'contadores' => [
            'match' => '/\b(contador\w*|estudio contable|impuestos|sueldos y jornales)\b/u',
            'portfolio_rubro' => 'legales', 'modelo' => 'f',
            'trabajos' => ['bfsoluciones', 'mtgestoriaintegral'],
        ],
        'abogados' => [
            'match' => '/\b(abogad\w*|estudio juridico|jubilaciones|sucesiones|amparo)\b/u',
            'portfolio_rubro' => 'legales', 'modelo' => 'f',
            'trabajos' => ['estudioasilva', 'mgabogado', 'jubilacionesmisiones', 'viaamparo', 'mtgestoriaintegral'],
        ],

        // ── Educación / cursos ────────────────────────────────────────
        'iglesia_fundacion' => [
            'match' => '/\b(iglesia|fundacion|ong|mutual|asociacion civil)\b/u',
            'portfolio_rubro' => 'legales', 'modelo' => 'g',
            'trabajos' => ['tuproductoronline'],
        ],
        'artesanias_manualidades' => [
            'match' => '/\b(artesanias?|porcelana fria|manualidades|resina|scrapbook)\b/u',
            'portfolio_rubro' => 'educacion', 'modelo' => 'k',
            'trabajos' => ['espaciocreativo', 'historiaspapelytijeras', 'valuhcatyarte'],
        ],
        'clases_arte_idiomas' => [
            'match' => '/\b(clases de (arte|dibujo|pintura|ingles|idiomas|fotografia)|taller de (arte|escenografia))\b/u',
            'portfolio_rubro' => 'educacion', 'modelo' => 'k',
            'trabajos' => ['lenguasadicionales', 'culturapixel', 'catalinasolaridorda', 'valuhcatyarte'],
        ],
        'cursos_online' => [
            'match' => '/\b(cursos? online|capacitacion(es)?|plataforma de cursos|e-?learning)\b/u',
            'portfolio_rubro' => 'educacion', 'modelo' => 'k',
            'trabajos' => ['academiaalquimiadelser', 'espaciocreativo', 'danielsaire', 'valuhcatyarte', 'historiaspapelytijeras'],
        ],

        // ── Tecnología / autos ────────────────────────────────────────
        'celulares_tecnologia' => [
            'match' => '/\b(celulares?|repuestos de telefonia|electronica|informatica|tecnologia)\b/u',
            'portfolio_rubro' => 'tecnologia', 'modelo' => 'b',
            'trabajos' => ['spstoreandservice', 'gicold'],
        ],
        'autos_usados' => [
            'match' => '/\b(autos? usados?|neumaticos|repuestos de auto|taller mecanico)\b/u',
            'portfolio_rubro' => 'automotor', 'modelo' => 'b',
            'trabajos' => ['autofull', 'rivasrys', 'xbrake'],
        ],

        // ── Turismo / eventos ─────────────────────────────────────────
        'cabanas_turismo' => [
            'match' => '/\b(cabanas?|hostel|camping|turismo|alojamiento)\b/u',
            'portfolio_rubro' => 'turismo', 'modelo' => 'h',
            'trabajos' => ['elgaleondeoro', 'hostelsrosarinos'],
        ],
        'eventos_fiestas' => [
            'match' => '/\b(eventos?|catering|barra de tragos|djs?|salon de fiestas)\b/u',
            'portfolio_rubro' => 'gastronomia', 'modelo' => 'h',
            'trabajos' => ['cococatering', 'masmomentosunicos'],
        ],

        // ── Deportes ──────────────────────────────────────────────────
        'deportes_fitness' => [
            'match' => '/\b(ciclismo|running|gimnasio|entrenamiento|fitness|futbol|deportivos?)\b/u',
            'portfolio_rubro' => 'deportes', 'modelo' => 'c',
            'trabajos' => ['botinesfv', 'niftybar', 'ahcd', 'fiam'],
        ],

        // ── Inmobiliaria ──────────────────────────────────────────────
        'inmobiliaria' => [
            'match' => '/\b(inmobiliaria|propiedades|alquileres|bienes raices)\b/u',
            'portfolio_rubro' => 'inmobiliaria', 'modelo' => 'i',
            'trabajos' => ['bastonspaulete', 'inmobiliariagomezyasociados', 'inmobiliariatornquist', 'ventoinmobiliaria', 'zaguirinmobiliaria'],
        ],
    ];
}

/**
 * Detecta el nicho más fino a partir del texto libre del cliente. Devuelve
 * la clave de wabot_rubros_sugeridos_tabla() o null si no matchea ninguno
 * (en ese caso el llamador cae al link genérico por tipo, como hoy).
 */
function wabot_rubro_sugerido_detectar($texto) {
    $t = function_exists('wabot_normalizar_frase') ? wabot_normalizar_frase((string)$texto) : mb_strtolower(trim((string)$texto), 'UTF-8');
    if ($t === '') return null;
    foreach (wabot_rubros_sugeridos_tabla() as $clave => $datos) {
        if (preg_match($datos['match'], $t)) return $clave;
    }
    return null;
}

/**
 * Arma el mensaje con hasta 5 trabajos + el link al portfolio filtrado por
 * rubro + el link a los modelos de estructura de ese tipo. $portfolioData
 * es el array de portfolio/data.js ya decodificado (id => ['nombre'=>,'url'=>])
 * para poder nombrar cada trabajo; si no se pasa, solo arma los links.
 */
function wabot_rubro_sugerido_texto($clave, array $portfolioData = []) {
    if ($clave === null || !isset(wabot_rubros_sugeridos_tabla()[$clave])) return null;
    $d = wabot_rubros_sugeridos_tabla()[$clave];
    $ids = $d['trabajos'];
    $lineas = [];
    foreach ($ids as $id) {
        if (isset($portfolioData[$id])) {
            $lineas[] = '• ' . $portfolioData[$id]['nombre'] . ': ' . $portfolioData[$id]['url'];
        } else {
            $lineas[] = '• gokywebs.com/portfolio/#' . $id;
        }
    }
    $texto = "Así quedaron algunos trabajos parecidos al tuyo:\n" . implode("\n", $lineas);
    $texto .= "\nY el resto los podés ver acá: gokywebs.com/portfolio/?rubro=" . $d['portfolio_rubro'];
    $texto .= "\nTambién tenés modelos de cómo se puede armar tu web: gokywebs.com/modelos/?m=" . $d['modelo'];
    return $texto;
}

/**
 * TODO (no resuelto al 15-sep): esta tabla se puede desincronizar del
 * portfolio real si se agregan/sacan trabajos. wabot/test-detectores.php
 * (o el suite que corresponda tras el merge de wabot-limpieza) debería
 * correr wabot_rubros_sugeridos_tabla() contra portfolio/data.js y fallar
 * si algún id ya no existe. Rubros con MENOS de 5 trabajos reales en el
 * portfolio al 15-sep (avisar si el cliente pregunta "¿tenés más ejemplos
 * como este?" y no hay): automotor (3), deportes (4), finanzas (2),
 * hogar (3), tecnologia (4), turismo (2).
 */
