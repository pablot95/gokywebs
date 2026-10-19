const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5493424364862';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'terrarios', nombre: 'Terrarios de vidrio', img: 'images/p-terrario-cubo.webp', bajada: 'Musgo, fitonias y helechos bajo vidrio, en frascos abiertos o cerrados con corcho.' },
  { id: 'suculentas', nombre: 'Suculentas y cactus', img: 'images/p-cactus-terracota.webp', bajada: 'Cactus, echeverias y sedum en terracota, cemento, madera o loza reciclada.' },
  { id: 'paisajes', nombre: 'Paisajes en miniatura', img: 'images/p-casita-piedra.webp', bajada: 'Casitas, puentes y caminos de piedra: un paisaje entero dentro de una maceta.' },
  { id: 'follaje', nombre: 'Follaje y kokedamas', img: 'images/p-follaje-ceramica.webp', bajada: 'Verdes de interior: palmeras, potus, fitonias y kokedamas de musgo.' },
];
const UBICACIONES = {
  interior: { nombre: 'Interior', bajada: 'Diseños para adentro: viven con luz indirecta, cerca de una ventana.' },
  exterior: { nombre: 'Exterior', bajada: 'Diseños para afuera: patios, balcones y galerías con sol.' },
};
const MATERIALES = {
  madera: { nombre: 'Madera reciclada', origen: 'Reciclado', img: 'images/m-madera.webp', txt: 'Cajones y tablas recuperadas que vuelven a tener uso.' },
  loza: { nombre: 'Loza reciclada', origen: 'Reciclado', img: 'images/m-loza.webp', txt: 'Tazas y platos que tenían otra vida en la cocina.' },
  terracota: { nombre: 'Terracota', origen: 'Nuevo', img: 'images/m-terracota.webp', txt: 'Barro cocido que respira y saca la humedad de más. Ideal para cactus.' },
  vidrio: { nombre: 'Vidrio', origen: 'Nuevo', img: 'images/m-vidrio.webp', txt: 'Deja ver las capas de tierra, piedras y musgo.' },
  ceramica: { nombre: 'Cerámica esmaltada', origen: 'Nuevo', img: 'images/m-ceramica.webp', txt: 'No absorbe agua y guarda la humedad por más tiempo.' },
  cemento: { nombre: 'Cemento', origen: 'Nuevo', img: 'images/m-cemento.webp', txt: 'Pesado y firme: no se vuelca con el viento.' },
  piedra: { nombre: 'Piedra', origen: 'Natural', img: 'images/m-piedra.webp', txt: 'Aguanta sol, lluvia y frío. Para jardines de afuera.' },
  musgo: { nombre: 'Musgo y yute', origen: 'Natural', img: 'images/m-musgo.webp', txt: 'La planta crece en una bola de sustrato envuelta en musgo.' },
};
const TAMANOS = {
  chico: { nombre: 'Chico', medida: 'hasta 15 cm' },
  mediano: { nombre: 'Mediano', medida: '15 a 25 cm' },
  grande: { nombre: 'Grande', medida: 'más de 25 cm' },
};
const RANGOS = {
  hasta25: { nombre: 'Hasta $25.000', max: 25000 },
  '25a45': { nombre: '$25.000 a $45.000', min: 25001, max: 45000 },
  mas45: { nombre: 'Más de $45.000', min: 45001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién terminados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const CUIDADOS = {
  suculentas: {
    nombre: 'Suculentas y cactus', img: 'images/p-cactus-terracota.webp',
    luz: 'Sol directo al menos 4 horas, o la ventana más luminosa de la casa.',
    riego: 'Solo cuando la tierra está seca del todo: cada 10 a 15 días en verano y una vez al mes en invierno.',
    ambiente: 'Aire que circule y nada de platitos con agua estancada abajo.',
    alerta: 'Hojas blandas o transparentes: es exceso de agua. Dejá de regar hasta que se sequen.',
  },
  terrario: {
    nombre: 'Terrarios de vidrio', img: 'images/p-terrario-cubo.webp',
    luz: 'Mucha claridad pero sin sol directo: el vidrio hace lupa y quema las hojas.',
    riego: 'Abierto: un rocío cada 7 a 10 días. Cerrado con corcho: casi nunca, el agua circula sola.',
    ambiente: 'Si el vidrio se empaña todo el día, destapalo un rato para que respire.',
    alerta: 'Pelusa blanca sobre el musgo: hay humedad de más. Ventilá y espaciá el riego.',
  },
  follaje: {
    nombre: 'Follaje y helechos', img: 'images/p-follaje-ceramica.webp',
    luz: 'Luz indirecta, lejos del sol fuerte de la tarde.',
    riego: 'Tierra apenas húmeda, nunca encharcada: una o dos veces por semana según el calor.',
    ambiente: 'Les gusta la humedad: rocialos en días secos y alejalos de la estufa y el aire acondicionado.',
    alerta: 'Puntas secas y marrones: el aire está muy seco. Rociá más seguido.',
  },
  kokedama: {
    nombre: 'Kokedamas', img: 'images/p-kokedamas.webp',
    luz: 'Luz indirecta y clara, como la de un living luminoso.',
    riego: 'Cuando la bola se sienta liviana, sumergila 10 minutos en un balde con agua.',
    ambiente: 'Escurrila bien antes de volver a apoyarla o colgarla, así no gotea.',
    alerta: 'Musgo amarillento: le falta agua o luz. Cambiala de lugar y mojala por inmersión.',
  },
};
const LINEAS = {
  'terrario-abierto': { nombre: 'Terrario abierto de vidrio', ubic: 'interior', cat: 'terrarios', precios: [18900, 32900, 49900] },
  'terrario-cerrado': { nombre: 'Terrario cerrado con corcho', ubic: 'interior', cat: 'terrarios', precios: [24900, 36900, 54900] },
  follaje: { nombre: 'Jardín de follaje en cuenco', ubic: 'interior', cat: 'follaje', precios: [null, 34900, 46900] },
  kokedama: { nombre: 'Kokedama (por unidad)', ubic: 'interior', cat: 'follaje', precios: [9900, 14900, null] },
  taza: { nombre: 'Suculentas en taza o pieza reciclada', ubic: 'interior', cat: 'suculentas', precios: [14900, 22900, null] },
  suculentas: { nombre: 'Jardín de suculentas y cactus', ubic: 'ambos', cat: 'suculentas', precios: [16900, 28900, 42900] },
  madera: { nombre: 'Mini jardín en madera reciclada', ubic: 'ambos', cat: 'suculentas', precios: [19900, 34900, 59900] },
  paisaje: { nombre: 'Paisaje con casita o puente', ubic: 'ambos', cat: 'paisajes', precios: [null, 32900, 64900] },
  alpino: { nombre: 'Jardín alpino en piedra', ubic: 'exterior', cat: 'paisajes', precios: [null, 44900, 72900] },
};
const TAM_IDX = { chico: 0, mediano: 1, grande: 2 };

const PRODUCTOS = [
  { id: 'casita-piedra', nombre: 'Paisaje con casita de piedra', cat: 'paisajes', ubic: 'exterior', maceta: 'ceramica', linea: 'paisaje', tam: 'grande', medida: '40 cm de diámetro', cuidado: 'suculentas', rango: 1, alta: 9,
    img: 'images/p-casita-piedra.webp', alt: 'Cuenco de cerámica esmaltada con una casita de piedra en miniatura, un camino de lajas, un árbol de jade y echeverias',
    plantas: 'Árbol de jade, echeverias, aloe, sedum rojo y musgo', corto: 'Un camino de lajas que sube hasta la casita.',
    desc: 'Un camino de lajas sube hasta una casita de piedra entre echeverias y un árbol de jade. Es el diseño más grande de la colección: un paisaje entero en un cuenco esmaltado.', tags: ['casita', 'casa', 'camino', 'jade', 'echeveria', 'regalo'] },
  { id: 'columna-madera', nombre: 'Columna de madera reciclada con suculentas', cat: 'suculentas', ubic: 'exterior', maceta: 'madera', linea: 'madera', tam: 'grande', medida: '45 cm de alto', cuidado: 'suculentas', rango: 2, alta: 20,
    img: 'images/p-columna-madera.webp', alt: 'Columna alta de tablas de madera recuperada con suculentas arriba y un rosario que cae por el costado',
    plantas: 'Haworthia cebra, echeveria, sedum, rosario y crásulas', corto: 'Un jardín en lo alto de una columna de tablas.',
    desc: 'Una columna de tablas recuperadas con un jardín de suculentas arriba y un rosario que cae por el costado. Queda bien en la entrada, en un balcón o junto a una puerta con sol.', tags: ['columna', 'madera', 'alto', 'rosario', 'haworthia', 'entrada'] },
  { id: 'terrario-cubo', nombre: 'Terrario cubo de fitonia y musgo', cat: 'terrarios', ubic: 'interior', maceta: 'vidrio', linea: 'terrario-abierto', tam: 'mediano', medida: '20 × 20 cm', cuidado: 'terrario', rango: 3, alta: 8,
    img: 'images/p-terrario-cubo.webp', alt: 'Terrario cúbico de vidrio con fitonias rojas y verdes, musgo, un tronquito y piedras de río',
    plantas: 'Fitonia roja y verde, musgo, tronquito y piedras de río', corto: 'Un mundo en miniatura para tus espacios.',
    desc: 'Un cubo de vidrio con capas de tierra, piedras y musgo, y dos fitonias de hojas veteadas. Va sobre un escritorio, una mesa de luz o un estante con claridad.', tags: ['terrario', 'cubo', 'fitonia', 'musgo', 'vidrio', 'escritorio'] },
  { id: 'cactus-terracota', nombre: 'Jardín de cactus en cuenco de terracota', cat: 'suculentas', ubic: 'exterior', maceta: 'terracota', linea: 'suculentas', tam: 'grande', medida: '35 cm de diámetro', cuidado: 'suculentas', rango: 4, alta: 7,
    img: 'images/p-cactus-terracota.webp', alt: 'Cuenco de terracota con cactus columnar, mammillarias con flores fucsias, echeveria, haworthia y piedras',
    plantas: 'Cactus columnar, mammillarias en flor, echeveria, haworthia y sedum', corto: 'Combinaciones rústicas que perduran.',
    desc: 'Cactus de distintas alturas, mammillarias que florecen en fucsia y piedras volcánicas sobre un cuenco de barro. Pide sol y muy poca agua.', tags: ['cactus', 'terracota', 'barro', 'flores', 'sol', 'patio'] },
  { id: 'cajon-helechos', nombre: 'Cajón de madera con helechos y puente', cat: 'paisajes', ubic: 'interior', maceta: 'madera', linea: 'madera', tam: 'grande', medida: '35 × 35 cm', cuidado: 'follaje', rango: 5, alta: 6,
    img: 'images/p-cajon-helechos.webp', alt: 'Cajón de madera recuperada con helechos, musgo, piedras y un puente de piedra en miniatura',
    plantas: 'Helechos, musgo, pilea y piedras, con un puente de piedra en miniatura', corto: 'Naturaleza y diseño en armonía.',
    desc: 'Un cajón de madera recuperada con helechos, colchones de musgo y un puentecito de piedra sobre un arroyo de canto rodado. Para un rincón con luz suave.', tags: ['cajon', 'helecho', 'puente', 'musgo', 'madera', 'sombra'] },
  { id: 'follaje-ceramica', nombre: 'Jardín de follaje en cuenco blanco', cat: 'follaje', ubic: 'interior', maceta: 'ceramica', linea: 'follaje', tam: 'grande', medida: '32 cm de diámetro', cuidado: 'follaje', rango: 6, alta: 5,
    img: 'images/p-follaje-ceramica.webp', alt: 'Cuenco de cerámica blanca con palmera de interior, potus, fitonia, musgo y un trozo de corteza',
    plantas: 'Palmera de interior, potus, fitonia, musgo y corteza', corto: 'Un centro de mesa verde para el living.',
    desc: 'Verdes de distintas texturas en un cuenco blanco: la palmera da altura, el potus cae por el borde y la fitonia suma el veteado. Un centro de mesa que dura.', tags: ['follaje', 'palmera', 'potus', 'centro de mesa', 'living', 'ceramica'] },
  { id: 'botellon-fitonia', nombre: 'Terrario botellón con fitonia roja', cat: 'terrarios', ubic: 'interior', maceta: 'vidrio', linea: 'terrario-abierto', tam: 'grande', medida: '30 cm de alto', cuidado: 'terrario', rango: 7, alta: 21,
    img: 'images/p-botellon-fitonia.webp', alt: 'Botellón de vidrio con fitonia roja, helechos, almohadones de musgo y un tronco',
    plantas: 'Fitonia roja, helecho, musgo y tronco', corto: 'Un bosque húmedo dentro de un frasco.',
    desc: 'Un frasco grande con almohadones de musgo, un tronco y una fitonia roja en el centro. Se ve desde todos los lados: ideal para una mesa ratona.', tags: ['terrario', 'botellon', 'frasco', 'fitonia', 'musgo', 'bosque'] },
  { id: 'alpino-piedra', nombre: 'Jardín alpino en batea de piedra', cat: 'paisajes', ubic: 'exterior', maceta: 'piedra', linea: 'alpino', tam: 'grande', medida: '45 × 30 cm', cuidado: 'suculentas', rango: 8, alta: 12,
    img: 'images/p-alpino-piedra.webp', alt: 'Batea de piedra con siemprevivas rojas, sedum, flores blancas, rocas, un camino de lajas y un enebro enano',
    plantas: 'Siemprevivas, sedum, tomillo, enebro enano y musgo', corto: 'Un rincón de montaña para el patio.',
    desc: 'Una batea de piedra con siemprevivas, un enebro enano y un camino de lajas entre rocas. Aguanta sol, lluvia y frío: es el más resistente para afuera.', tags: ['alpino', 'piedra', 'siempreviva', 'montaña', 'patio', 'resistente'] },
  { id: 'conejito-hongos', nombre: 'Jardín del conejito y los hongos', cat: 'paisajes', ubic: 'interior', maceta: 'madera', linea: 'madera', tam: 'mediano', medida: '30 × 15 cm', cuidado: 'suculentas', rango: 9, alta: 24,
    img: 'images/p-conejito-hongos.webp', alt: 'Jardinera de madera con peperomia, suculentas, un conejo blanco y un hongo rojo en miniatura',
    plantas: 'Peperomia, echeverias y crásulas, con un conejito y hongos en miniatura', corto: 'Una escena chiquita para mirar de cerca.',
    desc: 'Suculentas de hojas redondas, un conejito blanco y un hongo rojo de los que tanto le gustan a Miriam. Para un estante a la altura de los ojos.', tags: ['conejo', 'hongo', 'escena', 'chicos', 'regalo', 'madera'] },
  { id: 'taza-suculentas', nombre: 'Suculentas en taza de loza reciclada', cat: 'suculentas', ubic: 'interior', maceta: 'loza', linea: 'taza', tam: 'chico', medida: '12 cm de diámetro', cuidado: 'suculentas', rango: 10, alta: 4,
    img: 'images/p-taza-suculentas.webp', alt: 'Taza de loza antigua con plato, echeveria, sedum, rosario y musgo',
    plantas: 'Echeveria, sedum, rosario y musgo', corto: 'Una taza con historia y plantas nuevas.',
    desc: 'Una taza con su plato, de loza gastada por los años, con una echeveria grande y un rosario que cae. El regalo chico que más sale.', tags: ['taza', 'loza', 'reciclado', 'regalo', 'echeveria', 'souvenir'] },
  { id: 'kokedamas', nombre: 'Kokedamas de palmera (set de 3)', cat: 'follaje', ubic: 'interior', maceta: 'musgo', linea: 'kokedama', tam: 'chico', precio: 29700, medida: '10 cm cada bola', cuidado: 'kokedama', rango: 11, alta: 23,
    img: 'images/p-kokedamas.webp', alt: 'Tres kokedamas de musgo con palmeras de interior, junto a ovillos de hilo de yute',
    plantas: 'Palmera de interior en bola de musgo atada con yute', corto: 'Tres bolas de musgo para agrupar o separar.',
    desc: 'Tres palmeritas en bolas de sustrato envueltas en musgo y atadas con yute. Se riegan por inmersión y van sobre un plato o colgadas.', tags: ['kokedama', 'musgo', 'palmera', 'yute', 'set', 'colgante'] },
  { id: 'cerco-blanco', nombre: 'Jardín de suculentas con cerco blanco', cat: 'paisajes', ubic: 'exterior', maceta: 'ceramica', linea: 'paisaje', tam: 'mediano', medida: '25 × 12 cm', cuidado: 'suculentas', rango: 12, alta: 17,
    img: 'images/p-cerco-blanco.webp', alt: 'Maceta rectangular verde con suculentas, un cerco blanco y una casita en miniatura',
    plantas: 'Echeverias, crásulas y aeonium, con cerco y casita en miniatura', corto: 'Un jardincito con su cerca y su casa.',
    desc: 'Una maceta rectangular con un cerco blanco que separa el jardín de la casita. Para el borde de una ventana con sol.', tags: ['cerco', 'casita', 'suculentas', 'ventana', 'rectangular'] },
  { id: 'terrario-orquidea', nombre: 'Terrario con orquídea mini', cat: 'terrarios', ubic: 'interior', maceta: 'vidrio', linea: 'terrario-abierto', tam: 'grande', medida: '32 cm de alto', cuidado: 'terrario', stock: 0, alta: 19,
    img: 'images/p-terrario-orquidea.webp', alt: 'Frasco de vidrio con una orquídea mini de flores blancas sobre almohadones de musgo',
    plantas: 'Orquídea mini blanca, musgo en almohadón y helecho', corto: 'Flores blancas sobre un colchón de musgo.',
    desc: 'Una orquídea mini de flores blancas en un frasco alto, con almohadones de musgo y un helecho. Este ya encontró casa: Miriam puede hacerte uno parecido.', tags: ['orquidea', 'flores', 'terrario', 'frasco', 'blanco'] },
  { id: 'terrario-casita', nombre: 'Frasco con casita roja y médanos', cat: 'terrarios', ubic: 'interior', maceta: 'vidrio', linea: 'terrario-abierto', tam: 'mediano', medida: '18 cm de diámetro', cuidado: 'terrario', alta: 18,
    img: 'images/p-terrario-casita.webp', alt: 'Frasco de vidrio acostado con arena, suculentas y una casita roja en miniatura',
    plantas: 'Haworthia, crásulas y rosario sobre arena, con una casita roja', corto: 'Un desierto chiquito con su casita.',
    desc: 'Un frasco acostado con médanos de arena, suculentas y una casita roja al fondo. Se mira por la boca del frasco como por una ventana.', tags: ['frasco', 'casita', 'arena', 'desierto', 'terrario'] },
  { id: 'terrario-corcho', nombre: 'Terrario cerrado con tapa de corcho', cat: 'terrarios', ubic: 'interior', maceta: 'vidrio', linea: 'terrario-cerrado', tam: 'chico', medida: '15 cm de alto', cuidado: 'terrario', alta: 22,
    img: 'images/p-terrario-corcho.webp', alt: 'Terrario de vidrio con tapa de corcho, musgo, fitonia y piedras, sostenido en una mano',
    plantas: 'Musgo, fitonia, helecho y piedras', corto: 'Cerrado, se riega solo casi todo el año.',
    desc: 'Un ecosistema cerrado: el agua se evapora, se condensa en el vidrio y vuelve a la tierra. Casi no hay que regarlo.', tags: ['cerrado', 'corcho', 'terrario', 'musgo', 'facil'] },
  { id: 'musgo-montana', nombre: 'Paisaje de musgo con montaña de piedra', cat: 'paisajes', ubic: 'exterior', maceta: 'cemento', linea: 'paisaje', tam: 'grande', medida: '40 × 30 cm', cuidado: 'follaje', stock: 0, alta: 16,
    img: 'images/p-musgo-montana.webp', alt: 'Batea pintada a mano con musgo verde, rocas oscuras que forman una montaña y piedras',
    plantas: 'Musgo, rocas volcánicas y helechitos', corto: 'Una montaña de roca sobre un prado de musgo.',
    desc: 'Rocas oscuras que arman una montaña sobre un prado de musgo, en una batea pintada a mano. Este ya se vendió: pedí uno parecido.', tags: ['musgo', 'montaña', 'roca', 'paisaje', 'sombra'] },
  { id: 'casita-terracota', nombre: 'Casita entre helechos en maceta de barro', cat: 'paisajes', ubic: 'exterior', maceta: 'terracota', linea: 'paisaje', tam: 'mediano', medida: '24 cm de diámetro', cuidado: 'follaje', alta: 15,
    img: 'images/p-casita-terracota.webp', alt: 'Maceta de barro con cubresuelo verde, un arbolito y una casita de dos pisos en miniatura',
    plantas: 'Cubresuelo, helechos y un arbolito, con una casita en miniatura', corto: 'Una casa de dos pisos bajo su árbol.',
    desc: 'Una casita de dos pisos rodeada de verde, debajo de su propio árbol. Para la galería o un patio con media sombra.', tags: ['casita', 'barro', 'arbol', 'helecho', 'galeria'] },
  { id: 'cactus-piedras', nombre: 'Cactus en cuenco con piedras negras', cat: 'suculentas', ubic: 'exterior', maceta: 'ceramica', linea: 'suculentas', tam: 'mediano', medida: '24 cm de diámetro', cuidado: 'suculentas', alta: 14,
    img: 'images/p-cactus-piedras.webp', alt: 'Cuenco claro con tres cactus redondos sobre canto rodado negro, visto desde arriba',
    plantas: 'Cactus erizo, mammillaria y astrophytum sobre canto rodado negro', corto: 'Tres cactus redondos sobre piedra negra.',
    desc: 'Tres cactus de formas distintas sobre canto rodado negro, que contrasta con las espinas claras. Se ve lindo desde arriba, en una mesa baja.', tags: ['cactus', 'piedras', 'negro', 'redondo', 'minimalista'] },
  { id: 'echeverias', nombre: 'Rosetas de echeveria en cuenco oscuro', cat: 'suculentas', ubic: 'exterior', maceta: 'ceramica', linea: 'suculentas', tam: 'mediano', descuento: 10, medida: '20 cm de diámetro', cuidado: 'suculentas', alta: 13,
    img: 'images/p-echeverias.webp', alt: 'Cuenco oscuro con varias rosetas de echeveria verde claro sobre un banco de madera',
    plantas: 'Echeverias y siemprevivas', corto: 'Rosetas verde agua que parecen flores.',
    desc: 'Un ramo de rosetas verde agua en un cuenco oscuro. Con sol de mañana se ponen rosadas en las puntas.', tags: ['echeveria', 'roseta', 'suculenta', 'balcon'] },
  { id: 'jardinera-madera', nombre: 'Jardinera larga de madera con suculentas', cat: 'suculentas', ubic: 'exterior', maceta: 'madera', linea: 'madera', tam: 'grande', medida: '60 × 18 cm', cuidado: 'suculentas', alta: 11,
    img: 'images/p-jardinera-madera.webp', alt: 'Jardinera larga de madera recuperada con echeverias, aeonium, sedum y una maceta de barro',
    plantas: 'Echeverias, aeonium, sedum, aloe y una macetita de barro', corto: 'Para la baranda del balcón o el borde del patio.',
    desc: 'Una jardinera larga de tablas recuperadas con suculentas de colores y una macetita de barro. Va sobre una baranda, un banco o el borde de un cantero.', tags: ['jardinera', 'madera', 'larga', 'balcon', 'baranda'] },
  { id: 'cactus-bowl', nombre: 'Cactus en bowl blanco', cat: 'suculentas', ubic: 'interior', maceta: 'ceramica', linea: 'suculentas', tam: 'chico', medida: '15 cm de diámetro', cuidado: 'suculentas', alta: 10,
    img: 'images/p-cactus-bowl.webp', alt: 'Bowl de cerámica blanca con cactus estrella, mammillaria y cactus dedos sobre tierra y piedritas',
    plantas: 'Cactus estrella, mammillaria y cactus dedos', corto: 'Chiquito, para la ventana de la cocina.',
    desc: 'Tres cactus chicos en un bowl blanco con piedritas. El más fácil de cuidar: una vez por mes y listo.', tags: ['cactus', 'bowl', 'blanco', 'chico', 'cocina', 'facil'] },
  { id: 'jade-cemento', nombre: 'Árbol de jade en cuenco de cemento', cat: 'suculentas', ubic: 'interior', maceta: 'cemento', linea: 'suculentas', tam: 'mediano', medida: '22 cm de diámetro', cuidado: 'suculentas', alta: 3,
    img: 'images/p-jade-cemento.webp', alt: 'Árbol de jade de tronco grueso en un cuenco de cemento con musgo, sedum y piedras',
    plantas: 'Árbol de jade, sedum, musgo y piedras', corto: 'Un arbolito de jade con aire de bonsái.',
    desc: 'Un árbol de jade de tronco grueso, como un bonsái, rodeado de musgo y sedum en un cuenco de cemento. Junto a una ventana luminosa.', tags: ['jade', 'arbol', 'bonsai', 'cemento', 'ventana'] },
];
PRODUCTOS.forEach(p => {
  if (p.precio == null) p.precio = LINEAS[p.linea].precios[TAM_IDX[p.tam]];
  if (p.stock == null) p.stock = 1;
  if (p.descuento == null) p.descuento = 0;
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const ubicTexto = u => (u === 'ambos' ? 'Interior y exterior' : UBICACIONES[u]?.nombre || '');

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), macetas = lista(f.macetas), tams = lista(f.tams);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.ubic && p.ubic !== f.ubic) return false;
    if (macetas.length && !macetas.includes(p.maceta)) return false;
    if (tams.length && !tams.includes(p.tam)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const vendidosAlFinal = (a, b) => (b.stock > 0) - (a.stock > 0);
    switch (orden) {
      case 'nuevos': return (a, b) => vendidosAlFinal(a, b) || b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => vendidosAlFinal(a, b) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, ubicTexto(p.ubic), MATERIALES[p.maceta]?.nombre, TAMANOS[p.tam]?.nombre, p.plantas, p.desc, ...(p.tags || []),
      p.descuento > 0 ? 'oferta descuento' : '', p.stock > 0 ? '' : 'vendido',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'minijardines_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const max = producto.stock ?? 1;
    if (!(max > 0)) return 0;
    const existing = items.find(i => i.id === producto.id);
    if (existing) {
      if (existing.qty >= max) return 0;
      existing.qty = Math.min(existing.qty + qty, max);
    } else items.push({ id: producto.id, qty: Math.min(qty, max) });
    this.save(items);
    return 1;
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 1)); this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  hoja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  sol: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  gota: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  viento: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>',
  alerta: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const ubicTagHTML = u => `<span class="tag ${u === 'interior' ? 'tag--int' : u === 'exterior' ? 'tag--ext' : 'tag--ambos'}">${esc(ubicTexto(u))}</span>`;
function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
const msgEncargo = p => `Hola Miriam! Vi que «${p.nombre}» ya se vendió. ¿Me podés hacer uno parecido?`;
function accionHTML(p) {
  if (!(p.stock > 0)) return `<a class="prod-add prod-add--encargo" href="${wspLink(msgEncargo(p))}" target="_blank" rel="noopener">${ICO.wsp}<span>Pedí uno parecido</span></a>`;
  return `<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const vendido = !(p.stock > 0);
  let badge = '';
  if (vendido) badge = '<span class="pcard__badge pcard__badge--vendido">Vendido</span>';
  else if (p.descuento > 0) badge = `<span class="pcard__badge">-${p.descuento}%</span>`;
  return `<article class="pcard${clase ? ' ' + clase : ''}${vendido ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    <span class="pcard__ubic">${ubicTagHTML(p.ubic)}</span>
    ${badge}
    ${vendido ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(MATERIALES[p.maceta]?.nombre)} · ${esc(TAMANOS[p.tam]?.nombre)}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <div class="pcard__pie">${precioHTML(p)}<div class="prod-actions">${accionHTML(p)}</div></div>
  </div>
</article>`;
}

function hcardHTML(p) {
  return `<article class="hcard" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
  <a class="hcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
  <div class="hcard__info">
    <h3 class="hcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <div class="tags">${ubicTagHTML(p.ubic)}<span class="tag">${esc(MATERIALES[p.maceta]?.nombre)}</span></div>
    <p class="hcard__txt">${esc(p.corto)}</p>
    <div class="hcard__pie">${precioHTML(p)}<div class="prod-actions">${accionHTML(p)}</div></div>
  </div>
</article>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="52" height="52"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'diseño' : 'diseños'}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-ubic]').forEach(el => {
    const n = Tienda.contar({ ubic: el.dataset.cuentaUbic, stock: true });
    el.textContent = `${n} ${n === 1 ? 'diseño disponible' : 'diseños disponibles'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

const DESTACADOS_M1 = ['terrario-cubo', 'cactus-terracota', 'cajon-helechos'];
function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { ids: DESTACADOS_M1 }, orden: 'destacados', limite: 3 });
  items.forEach(cachear);
  cont.innerHTML = items.map(hcardHTML).join('');
}

function initVistaPrevia() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const mosaico = cont.hasAttribute('data-mosaico');
  const excluir = (cont.dataset.excluir || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { destacado: true, stock: true, excluir }, orden: 'destacados', limite: mosaico ? 7 : 8 });
  items.forEach(cachear);
  const total = Tienda.contar({});
  const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver los ${total} diseños</span><span class="mosaico__todo-n">Filtrá por interior o exterior, maceta y tamaño.</span>${ICO.flecha}</a>` : '';
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

function initMuestras() {
  const cont = document.querySelector('[data-muestras]');
  if (!cont) return;
  cont.innerHTML = Object.entries(MATERIALES).map(([k, m]) => {
    const n = Tienda.contar({ macetas: [k] });
    return `<div class="muestra">
      <div class="muestra__disco" data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><img src="${esc(m.img)}" alt="Textura de ${esc(m.nombre.toLowerCase())} de una maceta" width="360" height="360"></div>
      <div data-animate="subir" style="opacity:0;transform:translateY(24px)">
        <p class="muestra__origen${m.origen === 'Reciclado' ? ' muestra__origen--reciclado' : ''}">${esc(m.origen)}</p>
        <h3 class="muestra__nombre">${esc(m.nombre)}</h3>
        <p class="muestra__txt">${esc(m.txt)}</p>
        <a class="link-flecha muestra__link" href="${URL_CATALOGO}?maceta=${k}">${n} ${n === 1 ? 'diseño' : 'diseños'} ${ICO.flecha}</a>
      </div>
    </div>`;
  }).join('');
  if (MODELO === '2') initRailDrag(cont);
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const inicio = parseFloat(window.getComputedStyle(vp).paddingInlineStart) || 0;
      const items = [...vp.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initPrecios() {
  const tbody = document.querySelector('[data-precios-tabla]');
  if (!tbody) return;
  const cols = Object.values(TAMANOS).map(t => t.nombre);
  const pintar = filtro => {
    const filas = Object.values(LINEAS).filter(l => !filtro || l.ubic === filtro || l.ubic === 'ambos');
    tbody.innerHTML = filas.map(l => `<tr data-animate="subir" style="opacity:0;transform:translateY(24px)">
      <th scope="row"><span class="fila__nombre">${esc(l.nombre)}</span><span class="fila__ubic">${ubicTagHTML(l.ubic)}</span></th>
      ${l.precios.map((v, i) => (v ? `<td data-col="${esc(cols[i])}">${formatearPrecio(v)}</td>` : `<td class="vacio" data-col="${esc(cols[i])}">—</td>`)).join('')}
    </tr>`).join('');
  };
  pintar('');
  document.querySelectorAll('[data-precios-tab]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-precios-tab]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    pintar(btn.dataset.preciosTab);
    revelarNuevos(tbody);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function cuidadoHTML(c) {
  return `<p class="eyebrow">Cuidados para</p>
    <h3 class="cuidado__tit">${esc(c.nombre)}</h3>
    <div class="cuidado__items">
      <div class="cuidado__item">${ICO.sol}<b>Luz</b><p>${esc(c.luz)}</p></div>
      <div class="cuidado__item">${ICO.gota}<b>Riego</b><p>${esc(c.riego)}</p></div>
      <div class="cuidado__item">${ICO.viento}<b>Ambiente</b><p>${esc(c.ambiente)}</p></div>
    </div>
    <p class="cuidado__alerta">${ICO.alerta}<span><b>Señal de alerta:</b> ${esc(c.alerta)}</span></p>`;
}
function initCuidados() {
  const box = document.querySelector('[data-cuidado]');
  if (!box) return;
  const panel = box.querySelector('[data-cuidado-panel]');
  const foto = box.querySelector('[data-cuidado-foto]');
  const wsp = document.querySelector('[data-cuidado-wsp]');
  const tabs = [...document.querySelectorAll('[data-cuidado-tab]')];
  let actual = '';
  const mostrar = (id, animar) => {
    const c = CUIDADOS[id];
    if (!c || id === actual) return;
    actual = id;
    tabs.forEach(t => { const on = t.dataset.cuidadoTab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    const aplicar = () => {
      panel.innerHTML = cuidadoHTML(c);
      foto.src = c.img;
      foto.alt = `Ejemplo de ${c.nombre.toLowerCase()}`;
      if (wsp) wsp.href = wspLink(`Hola Miriam! Tengo un mini jardín de ${c.nombre.toLowerCase()} y quiero consultarte por sus cuidados. Te mando una foto:`);
      box.classList.remove('cambiando');
    };
    if (animar && !reduceMotion) { box.classList.add('cambiando'); setTimeout(aplicar, 260); } else aplicar();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => mostrar(t.dataset.cuidadoTab, true));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const sig = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      sig.focus();
      mostrar(sig.dataset.cuidadoTab, true);
    });
  });
  mostrar(tabs[0]?.dataset.cuidadoTab || 'suculentas', false);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-31.6333, -60.7);
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 4500, color: '#4A6A38', weight: 1, fillColor: '#9DA83C', fillOpacity: .18 }).addTo(mapa);
  mapa.fitBounds(centro.toBounds(10000));
}

function sumarAlCarrito(p, comprar) {
  if (Cart.has(p.id)) {
    if (comprar) { abrirCarrito(); return; }
    showToast(`«${p.nombre}» ya está en tu carrito: es una pieza única.`);
    return;
  }
  const ok = Cart.add(p, 1);
  if (!ok) { showToast('Este diseño ya se vendió. Pedí uno parecido por WhatsApp.'); return; }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste «${p.nombre}» al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, add.hasAttribute('data-comprar'));
    }
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let qvActual = null;
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Mini Jardines' }, material: MATERIALES[p.maceta]?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut' },
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  const extra = rel.length < 3 ? Tienda.consultar({ filtros: { ubic: p.ubic, excluir: [p.id, ...rel.map(r => r.id)], stock: true }, orden: 'destacados', limite: 3 - rel.length }).items : [];
  const relacionados = [...rel, ...extra];
  relacionados.forEach(cachear);
  const vendido = !(p.stock > 0);
  const enCarrito = Cart.has(p.id);
  const c = CUIDADOS[p.cuidado];
  const t = TAMANOS[p.tam];
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media" data-lupa><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"><span class="pcard__ubic">${ubicTagHTML(p.ubic)}</span>${vendido ? '<span class="pcard__badge pcard__badge--vendido">Vendido</span>' : p.descuento > 0 ? `<span class="pcard__badge">-${p.descuento}%</span>` : ''}<span class="qv__lupa">${ICO.lupa}Pasá el mouse para ver de cerca</span></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'precio qv__precio')}
      <p class="qv__unica${vendido ? ' qv__unica--vendido' : ''}">${vendido ? ICO.info : ICO.hoja}<span>${vendido ? 'Este diseño ya se vendió. Miriam te puede hacer uno parecido, nunca igual.' : 'Pieza única: cuando se vende, no vuelve igual.'}</span></p>
      <dl class="qv__ficha">
        <div><dt>Dónde va</dt><dd>${esc(ubicTexto(p.ubic))}</dd></div>
        <div><dt>Maceta</dt><dd>${esc(MATERIALES[p.maceta]?.nombre)}</dd></div>
        <div><dt>Tamaño</dt><dd>${esc(t.nombre)} · ${esc(p.medida)}</dd></div>
        <div><dt>Origen</dt><dd>${esc(MATERIALES[p.maceta]?.origen)}</dd></div>
      </dl>
      <div class="qv__acc">
        ${vendido
          ? `<a class="btn btn--musgo" href="${wspLink(msgEncargo(p))}" target="_blank" rel="noopener">${ICO.wsp}Pedí uno parecido</a>`
          : `<button type="button" class="btn btn--cta" data-qv-add${enCarrito ? ' disabled' : ''}>${ICO.carrito}${enCarrito ? 'Ya está en tu carrito' : 'Agregar al carrito'}</button>
             <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <details class="qv__det" open><summary>${ICO.hoja}Qué plantas lleva</summary><p>${esc(p.plantas)}. ${esc(p.desc)}</p></details>
      ${c ? `<details class="qv__det"><summary>${ICO.gota}Cómo cuidarlo</summary><ul class="qv__cuidados">
        <li>${ICO.sol}<span><b>Luz:</b> ${esc(c.luz)}</span></li>
        <li>${ICO.gota}<span><b>Riego:</b> ${esc(c.riego)}</span></li>
        <li>${ICO.viento}<span><b>Ambiente:</b> ${esc(c.ambiente)}</span></li></ul></details>` : ''}
      <a class="qv__wsp" href="${wspLink(`Hola Miriam! Tengo una consulta sobre «${p.nombre}».`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas? Preguntale a Miriam por WhatsApp</span></a>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    if (e.target.closest('[data-qv-comprar]')) { if (!Cart.has(p.id)) Cart.add(p, 1); cerrarQV(); abrirCarrito(); return; }
    if (e.target.closest('[data-qv-add]')) { sumarAlCarrito(p, false); pintarQV(); qv.querySelector('[data-qv-comprar]')?.focus(); }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const lupaMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  qv.addEventListener('pointermove', e => {
    const media = e.target.closest('[data-lupa]');
    if (!media || !lupaMq.matches || reduceMotion) return;
    const r = media.getBoundingClientRect();
    media.style.setProperty('--ox', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    media.style.setProperty('--oy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    media.classList.add('lupa');
  });
  qv.addEventListener('pointerout', e => {
    const media = e.target.closest('[data-lupa]');
    if (media && !media.contains(e.relatedTarget)) media.classList.remove('lupa');
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Cada diseño es único: elegí el tuyo antes de que encuentre otra casa.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(ubicTexto(p.ubic))} · ${esc(MATERIALES[p.maceta]?.nombre)} · Pieza única</p>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${p.nombre} (${ubicTexto(p.ubic).toLowerCase()}, ${MATERIALES[p.maceta]?.nombre.toLowerCase()}): ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Miriam! Quiero estos mini jardines:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El envío o el retiro se coordinan con Miriam por WhatsApp.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (linea && e.target.closest('[data-linea-quitar]')) {
      Cart.remove(linea.dataset.linea);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    ubic: valido(PARAMS.get('ubicacion'), UBICACIONES),
    macetas: new Set(lista('maceta').filter(m => MATERIALES[m])),
    tams: new Set(lista('tam').filter(t => TAMANOS[t])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    stock: PARAMS.get('disponibles') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los diseños')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-ubic-opciones]').forEach(cont => {
    const comoTab = cont.dataset.ubicOpciones === 'tabs';
    const opciones = [['', 'Todos'], ...Object.entries(UBICACIONES).map(([k, u]) => [k, u.nombre])];
    cont.innerHTML = opciones.map(([k, n]) => (comoTab
      ? `<button type="button" class="tab" data-filtro="ubic" data-valor="${k}" aria-pressed="false">${esc(n)} <small data-cuenta-filtro-ubic="${k}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-ubic" value="${k}" data-filtro="ubic"><span>${esc(k ? n : 'Interior y exterior')}</span><span class="opt__n" data-cuenta-filtro-ubic="${k}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-maceta-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(MATERIALES).map(([k, m]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="maceta"><span class="opt__dot"><img src="${esc(m.img)}" alt="" width="22" height="22"></span><span>${esc(m.nombre)}</span><span class="opt__n" data-cuenta-filtro-maceta="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-tam-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TAMANOS).map(([k, t]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="tam"><span>${esc(t.nombre)} <small>(${esc(t.medida)})</small></span><span class="opt__n" data-cuenta-filtro-tam="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.ubic && sin !== 'ubic') f.ubic = estado.ubic;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.macetas.size && sin !== 'maceta') f.macetas = [...estado.macetas];
    if (estado.tams.size && sin !== 'tam') f.tams = [...estado.tams];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.ubic && !document.querySelector('[data-ubic-opciones="tabs"]')) chips.push(['ubic', '', UBICACIONES[estado.ubic].nombre]);
    estado.macetas.forEach(m => chips.push(['maceta', m, MATERIALES[m].nombre]));
    estado.tams.forEach(t => chips.push(['tam', t, TAMANOS[t].nombre]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo disponibles']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="maceta"]').forEach(el => { el.checked = estado.macetas.has(el.value); });
    document.querySelectorAll('input[data-f="tam"]').forEach(el => { el.checked = estado.tams.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-ubic]').forEach(el => { const id = el.dataset.cuentaFiltroUbic; el.textContent = Tienda.contar({ ...filtrosDe('ubic'), ...(id ? { ubic: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-maceta]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('maceta'), macetas: [el.dataset.cuentaFiltroMaceta] }); });
    document.querySelectorAll('[data-cuenta-filtro-tam]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('tam'), tams: [el.dataset.cuentaFiltroTam] }); });
    const enPanel = estado.macetas.size + estado.tams.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0) + (document.querySelector('#filtros [data-ubic-opciones]') && estado.ubic ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const ubic = UBICACIONES[estado.ubic];
    let titulo = cat ? cat.nombre : 'Todos los diseños';
    if (ubic) titulo = cat ? `${cat.nombre} de ${ubic.nombre.toLowerCase()}` : `Diseños de ${ubic.nombre.toLowerCase()}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : ubic ? ubic.bajada : 'Jardines en miniatura hechos a mano en Santa Fe. Cada diseño es único: filtrá por dónde va, la maceta y el tamaño.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !ubic; miga.textContent = titulo; }
    document.title = `${titulo} — Mini Jardines`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.main-nav > a[data-ubic-link]').forEach(a => {
      if (a.dataset.ubicLink === estado.ubic && !estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'ubicacion', 'maceta', 'tam', 'precio', 'q', 'orden', 'disponibles'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.ubic) u.searchParams.set('ubicacion', estado.ubic);
    if (estado.macetas.size) u.searchParams.set('maceta', [...estado.macetas].join(','));
    if (estado.tams.size) u.searchParams.set('tam', [...estado.tams].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('disponibles', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'diseño' : 'diseños'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.ubic = ''; estado.precio = ''; estado.stock = false; estado.q = '';
    estado.macetas.clear(); estado.tams.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'maceta' ? estado.macetas : estado.tams;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'maceta') estado.macetas.delete(quitar.dataset.valor);
      else if (f === 'tam') estado.tams.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-chips li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.hero__tag', { y: 12, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.85);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initDestacados,
  initVistaPrevia,
  initMuestras,
  initPrecios,
  initCuidados,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
  initMapa,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
