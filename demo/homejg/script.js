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

const WSP = '5493516518302';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'vajilla', nombre: 'Vajilla y vasos', img: 'images/cat-vajilla.webp', bajada: 'Platos, bowls, tazas, vasos y jarras de gres, cerámica y vidrio para todos los días.' },
  { id: 'canastos', nombre: 'Canastos y textiles', img: 'images/cat-canastos.webp', bajada: 'Canastos y cestos de fibras naturales, fundas de almohadón y mantas tejidas.' },
  { id: 'deco', nombre: 'Jarrones y deco', img: 'images/cat-deco.webp', bajada: 'Jarrones, floreros, macetas, velas, espejos y flores secas para cada rincón.' },
  { id: 'mesa', nombre: 'Mesa y cocina', img: 'images/cat-mesa.webp', bajada: 'Bandejas, tablas, individuales, servilletas y todo para tener la cocina en orden.' },
];
const TIPOS = {
  platos: 'Platos y bowls',
  tazas: 'Tazas',
  vasos: 'Vasos y jarras',
  canastos: 'Canastos y cestos',
  textiles: 'Almohadones y mantas',
  jarrones: 'Jarrones y floreros',
  macetas: 'Macetas',
  velas: 'Velas',
  espejos: 'Espejos',
  secas: 'Flores secas',
  bandejas: 'Bandejas y tablas',
  mantel: 'Individuales y servilletas',
  orden: 'Orden y cocina',
};
const MATERIALES = {
  ceramica: 'Cerámica y gres',
  vidrio: 'Vidrio',
  madera: 'Madera y bambú',
  fibras: 'Fibras naturales',
  textil: 'Algodón y lino',
};
const MATERIAL_BUSQUEDA = { ceramica: 'ceramica gres', vidrio: 'vidrio', madera: 'madera bambu', fibras: 'fibras naturales', textil: 'textil tela' };
const RANGOS = {
  hasta15: { nombre: 'Hasta $15.000', max: 15000 },
  '15a30': { nombre: '$15.000 a $30.000', min: 15001, max: 30000 },
  mas30: { nombre: 'Más de $30.000', min: 30001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const PRODUCTOS = [
  { id: 'set-vajilla-gres', nombre: 'Set de vajilla de gres moteado (12 piezas)', cat: 'vajilla', tipo: 'platos', materiales: ['ceramica'], precio: 89900, stock: 6, rango: 1, alta: 18,
    medida: '4 platos playos de 27 cm, 4 hondos de 21 cm y 4 bowls de 15 cm', img: 'images/p-vajilla.webp',
    alt: 'Platos playos, hondos y bowls de gres moteado color crudo apilados sobre una mesada de mármol',
    desc: 'Gres color crudo con motitas y el borde tostado. Va al lavavajillas y al microondas, y se apila sin ocupar lugar.', tags: ['platos', 'bowls', 'gres', 'moteado', 'juego', 'mesa', 'regalo'] },
  { id: 'vasos-labrados', nombre: 'Vasos de vidrio labrado (set de 4)', cat: 'vajilla', tipo: 'vasos', materiales: ['vidrio'], precio: 19900, stock: 12, rango: 2, alta: 16,
    medida: '300 ml cada uno', img: 'images/p-vasos.webp',
    alt: 'Cuatro vasos de vidrio labrado con estrías verticales sobre una mesada clara iluminada por el sol',
    desc: 'Vidrio grueso con estrías verticales que juegan con la luz. Para el agua de todos los días o un trago con amigos.', tags: ['vasos', 'vidrio', 'acanalado', 'estriado', 'set'] },
  { id: 'canasto-trenzado', nombre: 'Canasto trenzado con asas', cat: 'canastos', tipo: 'canastos', materiales: ['fibras'], precio: 36900, stock: 4, rango: 3, alta: 17,
    medida: '40 cm de diámetro × 38 cm de alto', img: 'images/p-canasto.webp',
    alt: 'Canasto redondo trenzado en fibra natural con dos asas y una manta cruda con flecos adentro, sobre un piso de madera',
    desc: 'Trenzado a mano en fibra natural, con dos asas firmes. Para mantas, juguetes, revistas o la ropa del día.', tags: ['canasto', 'cesto', 'mimbre', 'fibra', 'asas', 'living', 'orden'] },
  { id: 'jarron-organico', nombre: 'Jarrón orgánico de cerámica', cat: 'deco', tipo: 'jarrones', materiales: ['ceramica'], precio: 23900, stock: 6, rango: 4, alta: 20,
    medida: 'Crudo de 22 cm de alto o verde oliva de 18 cm',
    opciones: { nombre: 'Color', valores: [{ id: 'crudo', nombre: 'Crudo, 22 cm', hex: '#E9E1D2' }, { id: 'oliva', nombre: 'Verde oliva, 18 cm', hex: '#7D8C68' }] },
    img: 'images/p-jarrones.webp', alt: 'Dos jarrones de cerámica de forma orgánica, uno crudo y uno verde oliva, sobre una mesa ratona redonda de madera',
    desc: 'Cerámica de terminación mate y forma irregular, como hecha a mano. Queda lindo solo o con una rama seca.', tags: ['jarron', 'florero', 'ceramica', 'organico', 'verde', 'crudo', 'regalo'] },
  { id: 'funda-tejida', nombre: 'Funda de almohadón tejida', cat: 'canastos', tipo: 'textiles', materiales: ['textil'], precio: 15900, stock: 10, rango: 5, alta: 19,
    medida: '45 × 45 cm, con cierre (sin relleno)',
    opciones: { nombre: 'Color', valores: [{ id: 'oliva', nombre: 'Verde oliva', hex: '#6B7A45' }, { id: 'crudo', nombre: 'Crudo', hex: '#EDE6D6' }] },
    img: 'images/p-almohadones.webp', alt: 'Dos almohadones tejidos, uno verde oliva y uno crudo, sobre un sillón de lino claro',
    desc: 'Tejido grueso de algodón con textura de punto arroz. Combiná los dos colores en el sillón o en la cama.', tags: ['almohadon', 'funda', 'tejido', 'sillon', 'living', 'verde'] },
  { id: 'maceta-acanalada', nombre: 'Maceta acanalada', cat: 'deco', tipo: 'macetas', materiales: ['ceramica'], precio: 12900, stock: 9, rango: 6, alta: 23,
    medida: '14 cm de diámetro × 12 cm de alto, con agujero de drenaje',
    opciones: { nombre: 'Color', valores: [{ id: 'salvia', nombre: 'Verde salvia', hex: '#A9BDB8' }, { id: 'negro', nombre: 'Negro', hex: '#2B2D2C' }, { id: 'arena', nombre: 'Arena', hex: '#D8C6A8' }] },
    img: 'images/p-maceta.webp', alt: 'Maceta redonda acanalada color verde salvia con una planta verde, sobre un fondo neutro',
    desc: 'Con relieve de líneas verticales y base redondeada. Para suculentas, potus o plantas chicas de interior. La planta no va incluida.', tags: ['maceta', 'planta', 'acanalada', 'interior', 'regalo'] },
  { id: 'bandeja-madera', nombre: 'Bandeja redonda de madera con asas', cat: 'mesa', tipo: 'bandejas', materiales: ['madera'], precio: 29900, stock: 5, rango: 7, alta: 15,
    medida: '40 cm de diámetro', img: 'images/p-bandeja.webp',
    alt: 'Bandeja redonda de madera con asas caladas, una taza de café con plato y una jarra de vidrio con agua',
    desc: 'Madera maciza con borde alto y dos asas caladas. Para llevar el desayuno a la cama o como centro de mesa.', tags: ['bandeja', 'madera', 'desayuno', 'servir', 'centro de mesa'] },
  { id: 'organizador-bambu', nombre: 'Organizador de utensilios de bambú', cat: 'mesa', tipo: 'orden', materiales: ['madera'], precio: 17900, stock: 6, rango: 8, alta: 14,
    medida: '3 divisiones, 22 × 13 × 15 cm (utensilios no incluidos)', img: 'images/p-organizador.webp',
    alt: 'Organizador de bambú de tres divisiones con cucharones, espátulas y cucharas de madera, sobre una mesada blanca',
    desc: 'Tres divisiones para tener cucharones, espátulas y batidores a mano. Bambú con base que no se resbala.', tags: ['organizador', 'utensilios', 'bambu', 'cocina', 'orden'] },
  { id: 'tazas-gres', nombre: 'Tazas de gres mate (par)', cat: 'vajilla', tipo: 'tazas', materiales: ['ceramica'], precio: 17500, stock: 8, alta: 21,
    medida: '350 ml cada una, una arena y una grafito', img: 'images/p-tazas.webp',
    alt: 'Dos tazas de gres mate, una arena y una grafito, sobre una bandeja de madera',
    desc: 'Un par en arena y grafito, con asa cómoda y terminación mate. Para el café de la mañana o el té de la tarde.', tags: ['tazas', 'taza', 'cafe', 'te', 'gres', 'par', 'regalo'] },
  { id: 'bowls-ceramica', nombre: 'Bowls de cerámica crudo (set de 3)', cat: 'vajilla', tipo: 'platos', materiales: ['ceramica'], precio: 21900, descuento: 10, stock: 5, alta: 22,
    medida: '12, 15 y 18 cm de diámetro', img: 'images/p-bowls.webp',
    alt: 'Bowls y vasos de cerámica color crudo de distintos tamaños sobre una mesa de madera clara',
    desc: 'Tres medidas que encajan una dentro de otra: para el yogur, la ensalada o los snacks.', tags: ['bowls', 'cuencos', 'ceramica', 'set', 'crudo'] },
  { id: 'jarra-vidrio', nombre: 'Jarra de vidrio con asa (1,5 L)', cat: 'vajilla', tipo: 'vasos', materiales: ['vidrio'], precio: 14500, stock: 7, alta: 12,
    medida: '1,5 litros', img: 'images/p-jarra.webp',
    alt: 'Jarra de vidrio transparente con asa y un vaso con agua sobre una bandeja de madera, junto a unos libros',
    desc: 'Vidrio transparente con asa amplia. Para el agua de la mesa, limonada o un jugo frío.', tags: ['jarra', 'vidrio', 'agua', 'limonada'] },
  { id: 'cesto-tapa', nombre: 'Cesto de fibra natural con tapa', cat: 'canastos', tipo: 'canastos', materiales: ['fibras'], precio: 42500, stock: 2, alta: 13,
    medida: '45 × 35 × 30 cm', img: 'images/p-cesto.webp',
    alt: 'Cesto rectangular de fibra natural tejida con tapa y asa, sobre una alfombra clara',
    desc: 'Tejido apretado con tapa y asas. Para la ropa, las mantas del invierno o lo que no querés que se vea.', tags: ['cesto', 'canasto', 'tapa', 'ropa', 'lavadero', 'orden'] },
  { id: 'manta-flecos', nombre: 'Manta tejida con flecos', cat: 'canastos', tipo: 'textiles', materiales: ['textil'], precio: 38900, stock: 3, alta: 11,
    medida: '1,30 × 1,70 m', img: 'images/p-manta.webp',
    alt: 'Manta tejida color gris piedra con flecos y textura en relieve, sobre una cama',
    desc: 'Algodón tejido con relieve y flecos en las puntas. Para los pies de la cama o el sillón en invierno.', tags: ['manta', 'pie de cama', 'flecos', 'sillon', 'tejida'] },
  { id: 'floreros-vidrio', nombre: 'Floreros de vidrio reciclado (set de 3)', cat: 'deco', tipo: 'jarrones', materiales: ['vidrio'], precio: 24500, stock: 4, alta: 24,
    medida: '12, 18 y 25 cm de alto', img: 'images/p-floreros.webp',
    alt: 'Floreros y botellas de vidrio reciclado verde agua con flores secas, sobre una mesa clara',
    desc: 'Vidrio reciclado verde agua, con burbujitas y formas distintas. Lindos con flores secas o una sola rama.', tags: ['florero', 'vidrio', 'reciclado', 'flores secas', 'set', 'regalo'] },
  { id: 'velas-soja', nombre: 'Vela de soja en frasco ámbar', cat: 'deco', tipo: 'velas', materiales: ['vidrio'], precio: 8900, stock: 15, alta: 10,
    medida: '180 g, unas 35 horas de duración', img: 'images/p-velas.webp',
    alt: 'Tres velas de cera blanca en frascos de vidrio ámbar sobre una rodaja de madera',
    desc: 'Cera de soja en frasco de vidrio ámbar, reutilizable cuando se termina. Un regalo que siempre queda bien.', tags: ['vela', 'aroma', 'soja', 'ambar', 'regalo'] },
  { id: 'espejo-redondo', nombre: 'Espejo redondo con correa de cuero', cat: 'deco', tipo: 'espejos', materiales: ['madera'], precio: 46900, stock: 0, alta: 9,
    medida: '50 cm de diámetro', img: 'images/p-espejo.webp',
    alt: 'Espejo redondo con marco de madera clara colgado de una correa de cuero, sobre una pared beige',
    desc: 'Marco de madera clara y correa de cuero para colgar de un gancho. Para el recibidor o arriba de una consola.', tags: ['espejo', 'redondo', 'recibidor', 'cuero', 'pared'] },
  { id: 'ramo-pampas', nombre: 'Ramo de pampas secas', cat: 'deco', tipo: 'secas', materiales: ['fibras'], precio: 11900, stock: 6, alta: 8,
    medida: '60 cm de alto, sin florero', img: 'images/p-pampas.webp',
    alt: 'Ramo de pampas secas en un florero de cerámica crudo, junto a otro florero chico',
    desc: 'Plumas naturales que duran años sin agua. Para un florero alto del living o el recibidor.', tags: ['pampas', 'flores secas', 'ramo', 'cortadera', 'deco'] },
  { id: 'frascos-corcho', nombre: 'Frascos de vidrio con tapa de corcho (set de 3)', cat: 'mesa', tipo: 'orden', materiales: ['vidrio', 'madera'], precio: 18500, stock: 8, alta: 25,
    medida: '1 litro cada uno', img: 'images/p-frascos.webp',
    alt: 'Tres frascos de vidrio con tapa de corcho llenos de porotos, arvejas y fideos, sobre un estante de madera',
    desc: 'Vidrio grueso y tapa de corcho que cierra bien. Para legumbres, fideos, yerba o café, a la vista y en orden.', tags: ['frascos', 'corcho', 'alacena', 'orden', 'vidrio', 'set'] },
  { id: 'tabla-redonda', nombre: 'Tabla redonda de madera con mango', cat: 'mesa', tipo: 'bandejas', materiales: ['madera'], precio: 16900, stock: 7, alta: 7,
    medida: '30 cm de diámetro', img: 'images/p-tabla.webp',
    alt: 'Tabla redonda de madera con mango, con un medialuna, frutillas y una taza de café',
    desc: 'Madera con mango para servir quesos, la picada o el desayuno, y colgarla en la cocina cuando no se usa.', tags: ['tabla', 'madera', 'picada', 'servir', 'desayuno'] },
  { id: 'individuales-yute', nombre: 'Individuales redondos de yute (set de 4)', cat: 'mesa', tipo: 'mantel', materiales: ['fibras'], precio: 19900, stock: 6, alta: 6,
    medida: '38 cm de diámetro', img: 'images/p-individuales.webp',
    alt: 'Individual redondo de yute trenzado con una taza de café encima, visto desde arriba',
    desc: 'Yute trenzado en espiral, firme y con textura. Le dan calidez a la mesa de madera o a un mantel liso.', tags: ['individuales', 'yute', 'mesa', 'set', 'redondos'] },
  { id: 'servilletas-lino', nombre: 'Servilletas de lino (set de 4)', cat: 'mesa', tipo: 'mantel', materiales: ['textil'], precio: 15500, descuento: 15, stock: 5, alta: 5,
    medida: '45 × 45 cm, en tonos tierra', img: 'images/p-servilletas.webp',
    alt: 'Servilletas de lino dobladas en tonos tierra, rosa viejo y crudo, junto a un florero blanco',
    desc: 'Lino lavado en tonos tierra, suave desde el primer uso. Se lavan en lavarropas y no necesitan plancha.', tags: ['servilletas', 'lino', 'mesa', 'set', 'tonos tierra'] },
  { id: 'camino-lino', nombre: 'Camino de mesa de lino lavado', cat: 'mesa', tipo: 'mantel', materiales: ['textil'], precio: 16900, stock: 4, alta: 4,
    medida: '40 × 180 cm, crudo', img: 'images/p-camino.webp',
    alt: 'Camino de mesa de lino crudo sobre un mantel rosa viejo, en una mesa con sillas de madera y un florero chico',
    desc: 'Lino crudo con caída suave y bordes deshilachados. Viste la mesa de todos los días sin taparla entera.', tags: ['camino', 'lino', 'mesa', 'mantel', 'crudo'] },
  { id: 'borrador-portavelas', nombre: 'Portavelas de vidrio (borrador)', cat: 'deco', tipo: 'velas', materiales: ['vidrio'], precio: 9900, stock: 3, alta: 1, visible: false,
    medida: '-', img: 'images/p-velas.webp', alt: '', desc: '', tags: [] },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
});

const GALERIA = [
  { img: 'images/recibidor.webp', w: 900, h: 1600, titulo: 'Un recibidor cálido', txt: 'Una consola de madera, un jarrón con ramas secas, un canasto abajo y un espejo redondo.', productos: ['jarron-organico', 'ramo-pampas', 'canasto-trenzado', 'espejo-redondo'], alt: 'Recibidor con una consola de madera, un jarrón de cerámica con ramas secas, un cuenco de piedra, un canasto trenzado y un espejo redondo' },
  { img: 'images/hero-mesa.webp', w: 1600, h: 900, titulo: 'La mesa del domingo', txt: 'Gres moteado, vasos labrados y lino en tonos tierra.', productos: ['set-vajilla-gres', 'vasos-labrados', 'servilletas-lino', 'camino-lino'], alt: 'Mesa de comedor de madera puesta con platos de gres moteado, vasos de vidrio labrado, servilletas y camino de lino' },
  { img: 'images/p-almohadones.webp', w: 1100, h: 1100, titulo: 'Un sillón en tonos tierra', txt: 'Fundas tejidas en verde oliva y crudo, con una manta a mano.', productos: ['funda-tejida', 'manta-flecos'], alt: 'Sillón de lino claro con dos almohadones tejidos, uno verde oliva y uno crudo, y una manta con flecos' },
  { img: 'images/p-jarrones.webp', w: 1100, h: 1100, titulo: 'La mesa ratona', txt: 'Dos jarrones orgánicos, crudo y verde oliva, sobre madera.', productos: ['jarron-organico', 'floreros-vidrio'], alt: 'Dos jarrones orgánicos de cerámica, crudo y verde oliva, sobre una mesa ratona redonda de madera' },
  { img: 'images/p-organizador.webp', w: 1100, h: 1100, titulo: 'La cocina en orden', txt: 'Los utensilios a mano en un organizador de bambú.', productos: ['organizador-bambu', 'tabla-redonda', 'frascos-corcho'], alt: 'Mesada de cocina con un organizador de bambú lleno de utensilios, una tabla de madera y una planta de albahaca' },
  { img: 'images/p-bandeja.webp', w: 1100, h: 1100, titulo: 'Café de la tarde', txt: 'Una bandeja de madera, una taza y una jarra con agua fresca.', productos: ['bandeja-madera', 'jarra-vidrio', 'tazas-gres'], alt: 'Bandeja redonda de madera con una taza de café y una jarra de vidrio sobre una mesa con mantel claro' },
];

const ZONAS = {
  cordoba: { tit: 'Envío a domicilio en la ciudad', txt: 'Te lo llevamos con día y franja horaria a coordinar. El costo depende del barrio.', label: 'Tu barrio (opcional)', ph: 'Ej.: Nueva Córdoba', destino: 'a Córdoba capital', dato: 'barrio' },
  gran: { tit: 'Envío a coordinar', txt: 'Villa Allende, Mendiolaza, Río Ceballos, Carlos Paz y alrededores: te pasamos el costo según la localidad.', label: 'Tu localidad (opcional)', ph: 'Ej.: Villa Allende', destino: 'a Gran Córdoba', dato: 'localidad' },
  pais: { tit: 'Envío por correo', txt: 'Lo despachamos por correo al resto del país. Te cotizamos con tu código postal y te pasamos el seguimiento.', label: 'Tu código postal (opcional)', ph: 'Ej.: 5500', destino: 'al resto del país', dato: 'código postal' },
  retiro: { tit: 'Retirás en el local', txt: 'Preparamos tu pedido y te avisamos por WhatsApp cuando está listo para pasar a buscarlo.', label: '¿Qué día te queda mejor? (opcional)', ph: 'Ej.: el sábado a la mañana', destino: '', dato: 'día' },
};

const HORARIO = {
  0: [],
  1: [[570, 780], [990, 1230]],
  2: [[570, 780], [990, 1230]],
  3: [[570, 780], [990, 1230]],
  4: [[570, 780], [990, 1230]],
  5: [[570, 780], [990, 1230]],
  6: [[570, 810]],
};
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), tipos = lista(f.tipos), materiales = lista(f.materiales);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipos.length && !tipos.includes(p.tipo)) return false;
    if (materiales.length && !materiales.some(m => p.materiales.includes(m))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const sinStockAlFinal = (a, b) => (b.stock > 0) - (a.stock > 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => sinStockAlFinal(a, b) || b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => sinStockAlFinal(a, b) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
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
      p.nombre, catDe(p.cat)?.nombre, TIPOS[p.tipo], ...p.materiales.map(m => MATERIAL_BUSQUEDA[m]), p.medida, p.desc, ...(p.tags || []),
      ...(p.opciones ? p.opciones.valores.map(v => v.nombre) : []), p.descuento > 0 ? 'oferta descuento' : '', p.stock > 0 ? '' : 'sin stock',
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
const opcionDe = (p, op) => p?.opciones?.valores.find(v => v.id === op) || null;

const Cart = {
  KEY: 'homejg_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, op = '') {
    const max = producto.stock ?? 0;
    const libre = max - this.enCarrito(producto.id);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, op, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, op, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.op || '') === op);
    if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 1) - otros));
    this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  paleta: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  campana: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33"/></svg>',
  ojo: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
const swatchesHTML = p => (p.opciones ? `<span class="dots" aria-label="${esc(p.opciones.nombre)}: ${esc(p.opciones.valores.map(v => v.nombre).join(', '))}">${p.opciones.valores.map(v => `<i style="background:${v.hex}"></i>`).join('')}</span>` : '');
const msgAviso = p => `Hola Home JG! Me interesa «${p.nombre}», que figura sin stock. ¿Me avisás cuando vuelva a entrar?`;
const stepperHTML = (max, clase = '') => `<div class="stepper${clase ? ' ' + clase : ''}" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="prod-add prod-add--aviso" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}<span>Avisame</span></a>`;
  if (p.opciones) return `<button type="button" class="prod-add prod-add--elegir" data-quick="${esc(p.id)}" aria-label="Elegir ${esc(p.opciones.nombre.toLowerCase())}: ${esc(p.nombre)}">${ICO.paleta}<span>Elegir ${esc(p.opciones.nombre.toLowerCase())}</span></button>`;
  return `${stepperHTML(p.stock)}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>`;
}

function badgeHTML(p) {
  if (!(p.stock > 0)) return '<span class="etiqueta etiqueta--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (p.stock <= 2) return '<span class="etiqueta etiqueta--ultimas">Últimas unidades</span>';
  if (p.alta >= 20) return '<span class="etiqueta">Nuevo</span>';
  return '';
}

function cardHTML(p, { anim = true, clase = '', variante = 'subir' } = {}) {
  const sin = !(p.stock > 0);
  const inicial = variante === 'der' ? 'opacity:0;transform:translateX(56px)' : 'opacity:0;transform:translateY(40px)';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sin ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ` data-animate="${variante}" style="${inicial}"` : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1100" height="1100"></a>
    ${badgeHTML(p)}
    ${sin || p.opciones ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(TIPOS[p.tipo])}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p)}
    <div class="prod-actions">${accionesHTML(p)}</div>
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
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'producto' : 'productos'}</small></span></a></li>`;
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
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const mosaico = cont.hasAttribute('data-mosaico');
    const ids = (cont.dataset.ids || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ filtros: ids.length ? { ids, stock: true } : { destacado: true, stock: true }, orden: ids.length ? 'ids' : 'destacados', limite });
    items.forEach(cachear);
    const total = Tienda.contar({});
    const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}?orden=nuevos" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver los ${total} productos</span><span class="mosaico__todo-n">Vajilla, canastos, deco y todo para la mesa, con filtros por material y precio.</span>${ICO.flecha}</a>` : '';
    cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
  });
}

function initRailProductos() {
  const vp = document.querySelector('[data-rail-vp][data-ids]');
  if (!vp) return;
  const ids = vp.dataset.ids.split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids, stock: true }, orden: 'ids', limite: 8 });
  items.forEach(cachear);
  vp.innerHTML = items.map(p => `<div class="rail__item">${cardHTML(p, { variante: 'der' })}</div>`).join('');
  initRail(vp);
}

function initRail(vp) {
  initRailDrag(vp);
  const wrap = vp.closest('section');
  const prev = wrap?.querySelector('[data-rail-prev]');
  const next = wrap?.querySelector('[data-rail-next]');
  const paso = () => (vp.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const sync = () => {
    const ini = parseFloat(getComputedStyle(vp).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= ini + 2;
    if (next) next.disabled = vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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

function initPuntos() {
  document.querySelectorAll('[data-punto]').forEach(b => {
    const p = getProducto(b.dataset.punto);
    if (!p) { b.closest('.punto-wrap')?.remove(); return; }
    const precio = b.querySelector('[data-punto-precio]');
    if (precio) precio.textContent = formatearPrecio(precioFinal(p));
  });
  const lista = document.querySelector('[data-mesa-lista]');
  if (!lista) return;
  const ids = [...new Set([...document.querySelectorAll('.mesa [data-punto]')].map(b => b.dataset.punto))];
  lista.innerHTML = ids.map(id => getProducto(id)).filter(Boolean).map(p => `<li><button type="button" class="mesa__item" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="1100" height="1100"><span><b>${esc(p.nombre)}</b><small>${formatearPrecio(precioFinal(p))}</small></span>${ICO.flecha}</button></li>`).join('');
}

function galeriaBotonHTML(g, i, clase) {
  return `<button type="button" class="${clase}" data-visor="${i}" aria-label="Ver la foto: ${esc(g.titulo)}">
    <span class="${clase}__foto"><img src="${esc(g.img)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}"></span>
    <span class="${clase}__txt"><b>${esc(g.titulo)}</b><small>${g.productos.length} ${g.productos.length === 1 ? 'pieza' : 'piezas'} de la tienda</small></span>
  </button>`;
}
function initGaleria() {
  const bento = document.querySelector('[data-galeria-bento]');
  if (bento) {
    const elegidos = bento.dataset.galeriaBento.split(',').map(Number).filter(i => GALERIA[i]);
    bento.innerHTML = elegidos.map((i, n) => `<div class="bento__item bento__item--${n + 1}" data-animate="mascara" style="clip-path:inset(100% 0 0 0)">${galeriaBotonHTML(GALERIA[i], i, 'gfoto')}</div>`).join('');
  }
  const rail = document.querySelector('[data-galeria-rail]');
  if (rail) {
    rail.innerHTML = GALERIA.map((g, i) => `<div class="rail__foto" data-animate="der" style="opacity:0;transform:translateX(56px)">${galeriaBotonHTML(g, i, 'gfoto')}</div>`).join('');
    initRail(rail);
  }
  const visor = document.getElementById('visor');
  if (!visor) return;
  const img = visor.querySelector('[data-visor-img]');
  const tit = visor.querySelector('[data-visor-tit]');
  const txt = visor.querySelector('[data-visor-txt]');
  const num = visor.querySelector('[data-visor-num]');
  const prods = visor.querySelector('[data-visor-prods]');
  let actual = 0;
  let foco = null;
  const pintar = i => {
    actual = (i + GALERIA.length) % GALERIA.length;
    const g = GALERIA[actual];
    img.src = g.img; img.alt = g.alt; img.width = g.w; img.height = g.h;
    img.closest('.visor__foto').classList.toggle('visor__foto--alta', g.h > g.w);
    tit.textContent = g.titulo;
    txt.textContent = g.txt;
    num.textContent = `${actual + 1} / ${GALERIA.length}`;
    prods.innerHTML = g.productos.map(id => getProducto(id)).filter(Boolean).map(p => `<li><button type="button" class="vprod" data-visor-pieza="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="1100" height="1100"><span><b>${esc(p.nombre)}</b><small>${p.stock > 0 ? formatearPrecio(precioFinal(p)) : 'Sin stock por ahora'}</small></span>${ICO.ojo}</button></li>`).join('');
  };
  const abrir = (i, origen) => {
    foco = origen || document.activeElement;
    pintar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('.visor__close')?.focus({ preventScroll: true });
  };
  const cerrar = (devolver = true) => {
    if (visor.hidden) return;
    visor.classList.remove('open');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { visor.hidden = true; }, 320);
    if (devolver && foco && document.contains(foco)) foco.focus({ preventScroll: true });
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) { e.preventDefault(); abrir(parseInt(b.dataset.visor, 10) || 0, b); }
  });
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) { cerrar(); return; }
    if (e.target.closest('[data-visor-prev]')) { pintar(actual - 1); return; }
    if (e.target.closest('[data-visor-next]')) { pintar(actual + 1); return; }
    const pieza = e.target.closest('[data-visor-pieza]');
    if (pieza) { cerrar(false); setTimeout(() => abrirQV(pieza.dataset.visorPieza, foco), 60); }
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'ArrowLeft') { pintar(actual - 1); return; }
    if (e.key === 'ArrowRight') { pintar(actual + 1); return; }
    atraparFoco(visor.querySelector('.visor__panel'), e);
  });
}

function initEnvios() {
  document.querySelectorAll('[data-envios]').forEach(box => {
    let zona = 'cordoba';
    const tit = box.querySelector('[data-zona-tit]');
    const txt = box.querySelector('[data-zona-txt]');
    const label = box.querySelector('[data-zona-label]');
    const input = box.querySelector('[data-zona-input]');
    const link = box.querySelector('[data-zona-wsp]');
    const mensaje = () => {
      const z = ZONAS[zona];
      const dato = (input?.value || '').trim().slice(0, 40);
      const n = Cart.count();
      const carrito = n ? ` Tengo ${n} ${n === 1 ? 'producto' : 'productos'} en el carrito (${formatearPrecio(Cart.total())}).` : '';
      if (zona === 'retiro') return `Hola Home JG! Quiero retirar mi pedido en el local${dato ? `, ${dato}` : ''}.${carrito} ¿Cuándo puedo pasar?`;
      return `Hola Home JG! Quiero consultar el envío ${z.destino}${dato ? ` (${z.dato}: ${dato})` : ''}.${carrito}`;
    };
    const pintar = () => {
      const z = ZONAS[zona];
      box.querySelectorAll('[data-zona]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.zona === zona)));
      tit.textContent = z.tit;
      txt.textContent = z.txt;
      label.textContent = z.label;
      input.placeholder = z.ph;
      link.href = wspLink(mensaje());
    };
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-zona]');
      if (!b) return;
      zona = b.dataset.zona;
      input.value = '';
      pintar();
    });
    box.addEventListener('keydown', e => {
      const b = e.target.closest('[data-zona]');
      if (!b || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const ids = Object.keys(ZONAS);
      const i = (ids.indexOf(zona) + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + ids.length) % ids.length;
      zona = ids[i];
      input.value = '';
      pintar();
      box.querySelector(`[data-zona="${zona}"]`)?.focus();
    });
    input?.addEventListener('input', () => { link.href = wspLink(mensaje()); });
    document.addEventListener('cart:updated', () => { link.href = wspLink(mensaje()); });
    pintar();
  });
}

function ahoraCordoba() {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Cordoba', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const v = t => partes.find(x => x.type === t)?.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
  return { dia, min: parseInt(v('hour'), 10) * 60 + parseInt(v('minute'), 10) };
}
const horaTxt = m => `${Math.floor(m / 60)}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''}`;
function estadoLocal() {
  const { dia, min } = ahoraCordoba();
  const tramo = HORARIO[dia].find(([a, b]) => min >= a && min < b);
  if (tramo) return { abierto: true, largo: `Abierto ahora · cierra a las ${horaTxt(tramo[1])}`, corto: `Abierto ahora · hasta las ${horaTxt(tramo[1])}` };
  const luego = HORARIO[dia].find(([a]) => a > min);
  if (luego) return { abierto: false, largo: `Cerrado ahora · abre hoy a las ${horaTxt(luego[0])}`, corto: `Cerrado · abre a las ${horaTxt(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d].length) {
      const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
      return { abierto: false, largo: `Cerrado ahora · abre ${cuando} a las ${horaTxt(HORARIO[d][0][0])}`, corto: `Cerrado · abre ${cuando} ${horaTxt(HORARIO[d][0][0])} h` };
    }
  }
  return { abierto: false, largo: 'Horario a confirmar', corto: 'Horario a confirmar' };
}
function initHorario() {
  const pintar = () => {
    const e = estadoLocal();
    const { dia } = ahoraCordoba();
    document.querySelectorAll('[data-estado]').forEach(el => {
      el.classList.toggle('estado--abierto', e.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = e.largo;
    });
    document.querySelectorAll('[data-estado-corto]').forEach(el => {
      el.textContent = e.corto;
      el.classList.toggle('estado-corto--abierto', e.abierto);
    });
    document.querySelectorAll('.horarios [data-dia]').forEach(li => {
      const [a, b] = li.dataset.dia.split('-').map(Number);
      li.classList.toggle('hoy', b != null ? dia >= a && dia <= b : dia === a);
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = L.latLng(-31.4167, -64.1833);
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: true });
    mapa.setView(centro, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(centro, { radius: 1400, color: '#3C5A30', weight: 1, fillColor: '#557A44', fillOpacity: .16 }).addTo(mapa);
    L.circleMarker(centro, { radius: 7, color: '#F8FAF8', weight: 2, fillColor: '#2F4A2A', fillOpacity: 1 }).addTo(mapa);
  } catch (e) { console.error(e); }
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, { qty = 1, op = '', comprar = false } = {}) {
  if (p.opciones && !opcionDe(p, op)) { abrirQV(p.id); showToast(`Elegí el ${p.opciones.nombre.toLowerCase()} antes de agregarlo.`); return; }
  const n = Cart.add(p, qty, op);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id)) { abrirCarrito(); return; }
    showToast(p.stock > 0 ? `Ya tenés en el carrito todas las unidades de «${p.nombre}».` : 'Este producto está sin stock. Pedí que te avisen por WhatsApp.');
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  const v = opcionDe(p, op);
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}«${p.nombre}»${v ? ` (${v.nombre.toLowerCase()})` : ''} al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
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
      sumarAlCarrito(p, { qty: leerCantidad(add.closest('.pcard')), comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvOpcion = '';
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  if (qvActual?.id !== p.id) qvOpcion = '';
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
    brand: { '@type': 'Brand', name: 'Home JG' }, material: p.materiales.map(m => MATERIALES[m]).join(', '),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sin = !(p.stock > 0);
  const libre = p.stock - Cart.enCarrito(p.id);
  const op = opcionDe(p, qvOpcion);
  const opcionesHTML = p.opciones ? `<div class="qv__ops" role="radiogroup" aria-label="${esc(p.opciones.nombre)}">
      <p class="qv__ops-tit">${esc(p.opciones.nombre)}: <b data-qv-op-txt>${op ? esc(op.nombre) : 'elegí uno'}</b></p>
      <div class="qv__ops-lista">${p.opciones.valores.map(v => `<button type="button" class="op" role="radio" aria-checked="${String(v.id === qvOpcion)}" data-qv-op="${esc(v.id)}"><i style="background:${v.hex}"></i>${esc(v.nombre)}</button>`).join('')}</div>
    </div>` : '';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media" data-lupa><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1100" height="1100">${badgeHTML(p)}<span class="qv__lupa">${ICO.lupa}Pasá el mouse para ver el detalle</span></div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)} · ${esc(TIPOS[p.tipo])}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'precio qv__precio')}
      <p class="qv__corto">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Medida</dt><dd>${esc(p.medida)}</dd></div>
        <div><dt>Material</dt><dd>${esc(p.materiales.map(m => MATERIALES[m]).join(' y '))}</dd></div>
        <div><dt>Disponibles</dt><dd>${sin ? 'Sin stock por ahora' : p.stock <= 2 ? `Últimas ${p.stock} unidades` : `${p.stock} unidades`}</dd></div>
        <div><dt>Envío</dt><dd>En Córdoba y al interior</dd></div>
      </dl>
      ${opcionesHTML}
      <div class="qv__acc">
        ${sin
          ? `<a class="btn btn--cta" href="${wspLink(msgAviso(p))}" target="_blank" rel="noopener">${ICO.campana}Avisame cuando vuelva</a>`
          : `${stepperHTML(Math.max(1, libre), 'stepper--grande')}
             <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está todo en tu carrito'}</button>
             <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Home JG! Tengo una consulta sobre «${p.nombre}».`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Tenés dudas con la medida o el color? Consultá por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
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
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvOpcion = opBtn.dataset.qvOp;
      qv.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-checked', String(b === opBtn)));
      const t = qv.querySelector('[data-qv-op-txt]');
      if (t) t.textContent = opcionDe(p, qvOpcion)?.nombre || '';
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    if (p.opciones && !opcionDe(p, qvOpcion)) {
      showToast(`Elegí el ${p.opciones.nombre.toLowerCase()} antes de agregarlo.`);
      qv.querySelector('[data-qv-op]')?.focus();
      return;
    }
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qty, qvOpcion);
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, { qty, op: qvOpcion });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
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
    body.innerHTML = `<div class="cart-vacio">${ICO.carrito}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Todavía no elegiste nada. Hay vajilla, canastos y jarrones esperando un lugar en tu casa.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const v = opcionDe(p, i.op);
    const otros = Cart.enCarrito(p.id) - i.qty;
    return `<li class="linea" data-linea="${esc(i.id)}" data-op="${esc(i.op || '')}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${v ? esc(v.nombre) + ' · ' : ''}${formatearPrecio(precioFinal(p))} c/u</p>
        <div class="linea__acc"><div class="stepper" data-linea-stepper><button type="button" data-linea-paso="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty + otros >= p.stock ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const v = opcionDe(p, i.op); return `- ${i.qty} × ${p.nombre}${v ? ` (${v.nombre.toLowerCase()})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Home JG! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El envío o el retiro en el local se coordinan después de la compra.</p>`;
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
    if (!linea) return;
    const id = linea.dataset.linea;
    const op = linea.dataset.op || '';
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, op);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, op, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"][data-op="${CSS.escape(op)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
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
    tipos: new Set(lista('tipo').filter(t => TIPOS[t])),
    materiales: new Set(lista('material').filter(m => MATERIALES[m])),
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
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los productos')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-tipo-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TIPOS).map(([k, n]) => `<label class="opt" data-tipo-opt="${k}"><input type="checkbox" value="${k}" data-f="tipo"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-tipo="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-material-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(MATERIALES).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="material"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-material="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.tipos.size && sin !== 'tipo') f.tipos = [...estado.tipos];
    if (estado.materiales.size && sin !== 'material') f.materiales = [...estado.materiales];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.tipos.forEach(t => chips.push(['tipo', t, TIPOS[t]]));
    estado.materiales.forEach(m => chips.push(['material', m, MATERIALES[m]]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
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
    document.querySelectorAll('input[data-f="tipo"]').forEach(el => { el.checked = estado.tipos.has(el.value); });
    document.querySelectorAll('input[data-f="material"]').forEach(el => { el.checked = estado.materiales.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-tipo]').forEach(el => {
      const n = Tienda.contar({ ...filtrosDe('tipo'), tipos: [el.dataset.cuentaFiltroTipo] });
      el.textContent = n;
      const opt = el.closest('[data-tipo-opt]');
      if (opt) opt.hidden = n === 0 && !estado.tipos.has(el.dataset.cuentaFiltroTipo);
    });
    document.querySelectorAll('[data-cuenta-filtro-material]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('material'), materiales: [el.dataset.cuentaFiltroMaterial] }); });
    const enPanel = estado.tipos.size + estado.materiales.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : 'Todo el catálogo';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Bazar y deco para cada espacio de tu casa. Filtrá por categoría, tipo, material o precio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat; miga.textContent = titulo; }
    document.title = `${titulo} — Home JG`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'material', 'precio', 'q', 'orden', 'disponibles'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.tipos.size) u.searchParams.set('tipo', [...estado.tipos].join(','));
    if (estado.materiales.size) u.searchParams.set('material', [...estado.materiales].join(','));
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
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.precio = ''; estado.stock = false; estado.q = '';
    estado.tipos.clear(); estado.materiales.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'tipo' ? estado.tipos : estado.materiales;
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
      if (f === 'tipo') estado.tipos.delete(quitar.dataset.valor);
      else if (f === 'material') estado.materiales.delete(quitar.dataset.valor);
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
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
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
  paso('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-datos li, .hero-pista', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.punto', { scale: 0.6, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.9);
  paso('.editorial__chica', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

[
  initModelBarScroll,
  initNav,
  initVistaPrevia,
  initRailProductos,
  initGaleria,
  initPuntos,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initEnvios,
  initHorario,
  initHeroMotion,
  initReveals,
  initMapa,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
