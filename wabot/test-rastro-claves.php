<?php
/**
 * Respuestas oficiales que nadie pidió (devolución de las charlas del 25/26-oct):
 * los 3 idiomas por "Educación Bilingüe Intercultural", "Publicidad y redes no
 * hacemos" por "llegar a más almas" y Google Analytics por "dónde me
 * encuentran". Una clave angosta sale solo si el cliente nombró el tema, en el
 * motor y en lo que elige OpenAI. Solo CLI, sin red.
 */
require_once __DIR__ . '/test-lib.php';
require_once __DIR__ . '/ia.php';

$sinNada = ['transcript' => []];
$r = function ($clave, $texto, $conv = null) use ($sinNada) {
    return wabot_info_clave_tiene_rastro($clave, $texto, $conv ?? $sinNada);
};

echo "=== Bilingüe: el idioma del rubro no es un pedido de idiomas ===\n";
foreach ([
    'Queremos difundir las actividades de Educación Bilingüe Intercultural' => false,
    'Tengo un instituto de inglés online'                                 => false,
    'Soy profesora de inglés'                                             => false,
    'doy clases de portugués'                                             => false,
    'soy traductora pública'                                              => false,
    'se puede en ingles?'                                                 => true,
    'es bilingue?'                                                        => true,
    'tengo un instituto de inglés y quiero la web también en inglés'      => true,
    'puede tener boton para cambiar de idioma?'                           => true,
] as $texto => $esperado) {
    caso("«{$texto}» → " . ($esperado ? 'con rastro' : 'sin rastro'), $r('bilingue', $texto) === $esperado);
}
caso('el rubro dicho un turno antes tampoco cuenta',
    $r('bilingue', 'y cuanto sale?', ['transcript' => [['q' => 'cliente', 't' => 'Somos un jardín bilingüe']]]) === false);

echo "\n=== Publicidad: solo si la nombra ===\n";
foreach ([
    'Soy terapeuta hace 22 años. Y quiero vender unos talleres x la web para llegar a más almas' => false,
    'Hola, vi tu anuncio'                                                 => false,
    'vi el anuncio en instagram'                                          => true,   // nombra Instagram: el freno no alcanza a esto
    'Ya tengo web y quiero conseguir más clientes'                        => false,
    'hacen anuncios?'                                                     => true,
] as $texto => $esperado) {
    caso("«{$texto}» → " . ($esperado ? 'con rastro' : 'sin rastro'), $r('marketing', $texto) === $esperado);
}

echo "\n=== Estadísticas: solo si pregunta por visitas o métricas ===\n";
foreach ([
    'Quiero que me encuentren cuando las familias buscan jardines maternales' => false,
    'Dónde pueden encontrar mi página?'                                   => false,
    'puedo ver cuanta gente entra?'                                       => true,
] as $texto => $esperado) {
    caso("«{$texto}» → " . ($esperado ? 'con rastro' : 'sin rastro'), $r('estadisticas', $texto) === $esperado);
}

echo "\n=== Las formas reales de preguntar (consultas-ejemplos.php) siguen pasando ===\n";
$ejemplos = (array)(require __DIR__ . '/consultas-ejemplos.php');
foreach (['bilingue', 'marketing', 'estadisticas'] as $clave) {
    $sin = [];
    foreach ((array)($ejemplos[$clave] ?? []) as $ej) if (!$r($clave, $ej)) $sin[] = $ej;
    caso("$clave: los " . count((array)($ejemplos[$clave] ?? [])) . ' ejemplos tienen rastro', !$sin, implode(' | ', $sin));
}

echo "\n=== Lo que elige OpenAI pasa por el mismo freno ===\n";
caso('CEAPI: bilingue se descarta y lo demás queda',
    wabot_ia_claves_con_rastro(['bilingue', 'plazos'], 'Queremos difundir las actividades de Educación Bilingüe Intercultural', $sinNada) === ['plazos']);
caso('Flavia: marketing se descarta',
    wabot_ia_claves_con_rastro(['marketing'], 'quiero vender unos talleres x la web para llegar a más almas', $sinNada) === []);
caso('Jardín: estadisticas se descarta',
    wabot_ia_claves_con_rastro(['estadisticas'], 'Dónde pueden encontrar mi página?', $sinNada) === []);
caso('una pregunta real por publicidad sigue saliendo',
    wabot_ia_claves_con_rastro(['marketing'], 'hacen aparte publicidad?', $sinNada) === ['marketing']);

todo_ok();
