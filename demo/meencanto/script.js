const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5493435097527';
const TRANSFERENCIA_MENOS = 10;
const POR_PAGINA = 16;

const IMG = {
  'vitrina-1x1.webp': [1254, 1254],
  'piel-9x16.webp': [941, 1672],
  'mostrador-16x9.webp': [1672, 941],
  'ambientes-1x1.webp': [1254, 1254],
  'cajas-1x1.webp': [1254, 1254],
  'regalo-1x1.webp': [1254, 1254],
};

const PARA = { ella: 'Para ella', el: 'Para él', unisex: 'Unisex' };
const PRESENTACION = { original: 'Original, con caja', alternativa: 'Alternativa' };
const FAMILIAS = [
  { id: 'floral', label: 'Floral', color: '#E7A3C2' },
  { id: 'frutal', label: 'Frutal', color: '#F2AE83' },
  { id: 'dulce', label: 'Dulce', color: '#D69B55' },
  { id: 'ambar', label: 'Ámbar', color: '#B8742F' },
  { id: 'amaderado', label: 'Amaderado', color: '#6E5240' },
  { id: 'fresco', label: 'Fresco', color: '#4DC3A3' },
];

const VISTAS = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'perfumes', label: 'Perfumes', test: p => p.tipo === 'perfume' },
  { id: 'ella', label: 'Para ella', test: p => p.para === 'ella' },
  { id: 'el', label: 'Para él', test: p => p.para === 'el' },
  { id: 'unisex', label: 'Unisex', test: p => p.para === 'unisex' },
  { id: 'aromas', label: 'Aromatizantes', test: p => p.tipo === 'aroma' },
  { id: 'regalos', label: 'Para regalar', test: p => !!p.regalo },
];

const ATAJOS = {
  ella: { label: 'Para ella', preset: { vista: 'ella' } },
  el: { label: 'Para él', preset: { vista: 'el' } },
  unisex: { label: 'Unisex', preset: { vista: 'unisex' } },
  originales: { label: 'Originales', preset: { vista: 'perfumes', presentacion: ['original'] } },
  alternativas: { label: 'Alternativas', preset: { vista: 'perfumes', presentacion: ['alternativa'] } },
  aromas: { label: 'Aromatizantes', preset: { vista: 'aromas' } },
  regalos: { label: 'Para regalar', preset: { vista: 'regalos' } },
};

const CIRCULOS = [
  { atajo: 'ella', img: 'piel-9x16.webp', foco: [0.518, 0.54, 1.5], alt: 'Frasco rosado de tapa tallada' },
  { atajo: 'el', img: 'cajas-1x1.webp', foco: [0.706, 0.43, 2.4], alt: 'Frasco negro junto a su caja' },
  { atajo: 'originales', img: 'cajas-1x1.webp', foco: [0.52, 0.55, 1.3], alt: 'Perfumes con sus cajas originales' },
  { atajo: 'alternativas', img: 'vitrina-1x1.webp', foco: [0.5, 0.6, 1.25], alt: 'Perfumes rosados y dorados sobre el mostrador' },
  { atajo: 'aromas', img: 'ambientes-1x1.webp', foco: [0.3, 0.52, 1.7], alt: 'Difusor de varillas sobre mármol' },
  { atajo: 'regalos', img: 'regalo-1x1.webp', foco: [0.5, 0.56, 1.3], alt: 'Caja de regalo con tres perfumes y moño rosado' },
];

const COLECCIONES = [
  { atajo: 'originales', titulo: 'Originales', sub: 'En su presentación original, con caja', img: 'cajas-1x1.webp', pos: '55% 50%', alt: 'Perfumes junto a sus cajas rosada, blanca, negra y bordó' },
  { atajo: 'alternativas', titulo: 'Alternativas', sub: 'Las fragancias que te gustan, a otro precio', img: 'vitrina-1x1.webp', pos: '50% 60%', alt: 'Seis frascos de perfume rosados y dorados sobre mármol' },
  { atajo: 'aromas', titulo: 'Aromas para tu casa', sub: 'Difusores, home spray y velas', img: 'ambientes-1x1.webp', pos: '45% 55%', alt: 'Difusor de varillas, home spray y vela encendida' },
  { atajo: 'regalos', titulo: 'Para regalar', sub: 'Cajas y perfumes con estuche', img: 'regalo-1x1.webp', pos: '50% 55%', alt: 'Caja de regalo con tres perfumes, papel de seda y moño' },
];

const ENTREGAS = [
  { id: 'retiro', nombre: 'Retiro en el showroom', zona: 'Bv. Racedo y Av. Francisco Ramírez', costo: 0, icono: 'i-pin', plazo: 'Lo retirás en el showroom: coordinamos el día y el horario por WhatsApp.' },
  { id: 'parana', nombre: 'Envío en Paraná', zona: 'En moto, a tu casa', costo: 3500, icono: 'i-bike', plazo: 'Llega en el día o al día siguiente (estimado).' },
  { id: 'litoral', nombre: 'Entre Ríos y Santa Fe', zona: 'Por correo', costo: 7900, icono: 'i-box', plazo: 'Llega en 2 a 4 días hábiles (estimado).' },
  { id: 'pais', nombre: 'Resto del país', zona: 'Por correo', costo: 11900, icono: 'i-truck', plazo: 'Llega en 3 a 7 días hábiles (estimado).' },
];

const PRODUCTOS = [
  {
    id: 'rosa-cristal', nombre: 'Rosa Cristal', tipo: 'perfume', para: 'ella', presentacion: 'alternativa', familia: 'floral',
    conc: 'Eau de parfum', formato: '100 ml', precio: 36000, stock: 9, destacado: true,
    desc: 'Rosado y luminoso: una rosa fresca con pera jugosa, para el día a día.',
    notas: { salida: 'Pera y bergamota', corazon: 'Peonía y rosa', fondo: 'Almizcle blanco' },
    fijacion: '6 a 8 h', fijacionMax: 8, estela: 'Moderada', momento: 'De día',
    img: 'piel-9x16.webp', foco: [0.518, 0.541, 1.34], ancho: [0.5, 0.55, 1], alto: [0.518, 0.53, 1.2],
    vistas: [['vitrina-1x1.webp', [0.183, 0.584, 2.24]], ['cajas-1x1.webp', [0.167, 0.586, 2.4]], ['regalo-1x1.webp', [0.303, 0.518, 2.7]]],
    alt: 'Frasco cuadrado rosado con tapa de cristal tallado',
  },
  {
    id: 'gota-rose', nombre: 'Gota Rosé', tipo: 'perfume', para: 'ella', presentacion: 'alternativa', familia: 'floral',
    conc: 'Eau de parfum', formato: '100 ml', precio: 34000, stock: 7, destacado: true,
    desc: 'Floral y suave, con un fondo de vainilla que abriga sin empalagar.',
    notas: { salida: 'Mandarina', corazon: 'Jazmín y flor de azahar', fondo: 'Vainilla y almizcle' },
    fijacion: '5 a 7 h', fijacionMax: 7, estela: 'Suave', momento: 'Día y noche',
    img: 'vitrina-1x1.webp', foco: [0.612, 0.415, 2.3], ancho: [0.6, 0.43, 1.15], alto: [0.612, 0.42, 1.9],
    vistas: [['mostrador-16x9.webp', [0.553, 0.471, 2.0]], ['regalo-1x1.webp', [0.49, 0.44, 2.24]], ['piel-9x16.webp', [0.276, 0.404, 1.3]]],
    alt: 'Frasco en forma de gota rosada con cuello dorado y tapa de cristal',
  },
  {
    id: 'gota-de-miel', nombre: 'Gota de Miel', tipo: 'perfume', para: 'ella', presentacion: 'original', familia: 'dulce',
    conc: 'Eau de parfum', formato: '100 ml, con caja', precio: 68000, stock: 4, nuevo: true, regalo: true,
    desc: 'Miel, ámbar y flores blancas: cálido, envolvente y para la noche.',
    notas: { salida: 'Bergamota y durazno', corazon: 'Miel y flores blancas', fondo: 'Ámbar y sándalo' },
    fijacion: '8 a 10 h', fijacionMax: 10, estela: 'Intensa', momento: 'De noche',
    img: 'cajas-1x1.webp', foco: [0.428, 0.407, 2.02], ancho: [0.44, 0.42, 1.2], alto: [0.428, 0.41, 1.8],
    alt: 'Frasco en forma de gota color miel delante de su caja blanca',
  },
  {
    id: 'diamante-rose', nombre: 'Diamante Rosé', tipo: 'perfume', para: 'ella', presentacion: 'alternativa', familia: 'dulce',
    conc: 'Eau de parfum', formato: '100 ml', precio: 38000, stock: 0,
    desc: 'Dulce y chispeante: frutos rojos con praliné, para salir.',
    notas: { salida: 'Frutos rojos', corazon: 'Praliné y rosa', fondo: 'Vainilla y pachulí' },
    fijacion: '7 a 9 h', fijacionMax: 9, estela: 'Intensa', momento: 'De noche',
    img: 'vitrina-1x1.webp', foco: [0.781, 0.67, 2.51], ancho: [0.76, 0.66, 1.3], alto: [0.781, 0.66, 2.2],
    vistas: [['mostrador-16x9.webp', [0.649, 0.697, 2.77]]],
    alt: 'Frasco rosado de cristal tallado con tapa dorada cuadrada',
  },
  {
    id: 'petalo', nombre: 'Pétalo', tipo: 'perfume', para: 'ella', presentacion: 'alternativa', familia: 'fresco',
    conc: 'Eau de toilette', formato: '100 ml', precio: 32000, stock: 11, nuevo: true,
    desc: 'Fresco y liviano, como flores recién cortadas: ideal para el verano.',
    notas: { salida: 'Limón y pepino', corazon: 'Lirio de los valles', fondo: 'Almizcle suave' },
    fijacion: '4 a 6 h', fijacionMax: 6, estela: 'Suave', momento: 'De día',
    img: 'mostrador-16x9.webp', foco: [0.309, 0.613, 2.54], ancho: [0.3, 0.6, 1.6], alto: [0.309, 0.6, 2.2],
    alt: 'Frasco rosado de cristal tallado con tapa de cristal',
  },
  {
    id: 'luna-dorada', nombre: 'Luna Dorada', tipo: 'perfume', para: 'unisex', presentacion: 'alternativa', familia: 'ambar',
    conc: 'Eau de parfum', formato: '100 ml', precio: 35000, stock: 8, destacado: true,
    desc: 'Ámbar y vainilla con un toque de canela: el abrazo de un buzo tibio.',
    notas: { salida: 'Canela y cardamomo', corazon: 'Ámbar', fondo: 'Vainilla y haba tonka' },
    fijacion: '7 a 9 h', fijacionMax: 9, estela: 'Moderada', momento: 'De noche',
    img: 'vitrina-1x1.webp', foco: [0.501, 0.644, 2.32], ancho: [0.5, 0.64, 1.2], alto: [0.501, 0.62, 2.0],
    vistas: [['mostrador-16x9.webp', [0.484, 0.675, 2.4]], ['regalo-1x1.webp', [0.682, 0.549, 3.0]]],
    alt: 'Frasco redondo dorado con tapa de cristal facetado',
  },
  {
    id: 'durazno-almizcle', nombre: 'Durazno & Almizcle', tipo: 'perfume', para: 'ella', presentacion: 'original', familia: 'frutal',
    conc: 'Eau de parfum', formato: '100 ml, con caja', precio: 72000, stock: 3, nuevo: true, regalo: true,
    desc: 'Frutal y aterciopelado: durazno maduro sobre un almizcle limpio.',
    notas: { salida: 'Durazno y pera', corazon: 'Rosa y peonía', fondo: 'Almizcle y cedro' },
    fijacion: '6 a 8 h', fijacionMax: 8, estela: 'Moderada', momento: 'Día y noche',
    img: 'cajas-1x1.webp', foco: [0.53, 0.646, 2.32], ancho: [0.53, 0.64, 1.2], alto: [0.53, 0.63, 2.0],
    alt: 'Frasco redondo color durazno con tapa de cristal tallado',
  },
  {
    id: 'noir-intenso', nombre: 'Noir Intenso', tipo: 'perfume', para: 'el', presentacion: 'original', familia: 'amaderado',
    conc: 'Eau de parfum', formato: '100 ml, con caja', precio: 89000, stock: 5, destacado: true, regalo: true,
    desc: 'Amaderado y especiado, con pimienta negra y cuero: presencia de noche.',
    notas: { salida: 'Pimienta negra y bergamota', corazon: 'Lavanda y cuero', fondo: 'Vetiver y cedro' },
    fijacion: '8 a 10 h', fijacionMax: 10, estela: 'Intensa', momento: 'De noche',
    img: 'cajas-1x1.webp', foco: [0.706, 0.408, 2.24], ancho: [0.7, 0.42, 1.2], alto: [0.706, 0.42, 2.0],
    alt: 'Frasco negro de tapa negra delante de su caja negra',
  },
  {
    id: 'ebano-cuero', nombre: 'Ébano & Cuero', tipo: 'perfume', para: 'el', presentacion: 'alternativa', familia: 'amaderado',
    conc: 'Eau de parfum', formato: '100 ml', precio: 38000, stock: 6, destacado: true,
    desc: 'Cuero suave y tabaco dulce: elegante sin ser pesado.',
    notas: { salida: 'Cardamomo', corazon: 'Tabaco y cuero', fondo: 'Ébano y vainilla' },
    fijacion: '7 a 9 h', fijacionMax: 9, estela: 'Moderada', momento: 'De noche',
    img: 'mostrador-16x9.webp', foco: [0.708, 0.544, 2.35], ancho: [0.7, 0.54, 1.5], alto: [0.708, 0.54, 2.1],
    vistas: [['vitrina-1x1.webp', [0.812, 0.517, 2.6]]],
    alt: 'Frasco cuadrado color ébano con tapa negra',
  },
  {
    id: 'rubi-oud', nombre: 'Rubí Oud', tipo: 'perfume', para: 'unisex', presentacion: 'original', familia: 'ambar',
    conc: 'Eau de parfum', formato: '100 ml, con caja', precio: 98000, stock: 2, destacado: true, nuevo: true, regalo: true,
    desc: 'Oud, rosa y azafrán al estilo de los perfumes árabes: intenso y con mucha estela.',
    notas: { salida: 'Azafrán', corazon: 'Rosa y oud', fondo: 'Ámbar y almizcle' },
    fijacion: '10 a 12 h', fijacionMax: 12, estela: 'Intensa', momento: 'De noche',
    img: 'cajas-1x1.webp', foco: [0.813, 0.64, 2.37], ancho: [0.78, 0.62, 1.2], alto: [0.8, 0.63, 2.0],
    alt: 'Frasco rojo rubí con tapa dorada delante de su caja bordó',
  },
  {
    id: 'ambar-real', nombre: 'Ámbar Real', tipo: 'perfume', para: 'el', presentacion: 'alternativa', familia: 'ambar',
    conc: 'Eau de parfum', formato: '100 ml', precio: 37000, stock: 9,
    desc: 'Ámbar seco y maderas claras: cálido, prolijo y para todos los días.',
    notas: { salida: 'Bergamota y jengibre', corazon: 'Ámbar y salvia', fondo: 'Cedro y almizcle' },
    fijacion: '6 a 8 h', fijacionMax: 8, estela: 'Moderada', momento: 'Día y noche',
    img: 'vitrina-1x1.webp', foco: [0.347, 0.424, 2.16], ancho: [0.36, 0.44, 1.2], alto: [0.347, 0.43, 1.9],
    vistas: [['mostrador-16x9.webp', [0.405, 0.459, 2.35]]],
    alt: 'Frasco alto dorado con tapa dorada hexagonal',
  },
  {
    id: 'difusor-flores', nombre: 'Difusor Flores Blancas', tipo: 'aroma', familia: 'floral',
    conc: 'Difusor de varillas', formato: '250 ml', precio: 21000, stock: 10, destacado: true,
    desc: 'Jazmín y azahar para el living: perfuma de a poco, sin encender nada.',
    dura: 'Hasta 60 días', duraDias: 60,
    img: 'ambientes-1x1.webp', foco: [0.285, 0.5, 1.62], ancho: [0.3, 0.52, 1.1], alto: [0.285, 0.5, 1.4],
    alt: 'Difusor de vidrio con varillas naturales y aro dorado',
  },
  {
    id: 'difusor-ambar', nombre: 'Difusor Ámbar & Vainilla', tipo: 'aroma', familia: 'ambar',
    conc: 'Difusor de varillas', formato: '250 ml', precio: 21000, stock: 6,
    desc: 'Ámbar, vainilla y un toque de madera: calidez para el dormitorio.',
    dura: 'Hasta 60 días', duraDias: 60,
    img: 'mostrador-16x9.webp', foco: [0.147, 0.468, 1.47], ancho: [0.2, 0.47, 1.6], alto: [0.15, 0.47, 1.3],
    alt: 'Difusor de vidrio con varillas negras entre flores blancas',
  },
  {
    id: 'spray-peonia', nombre: 'Home spray Peonía & Rosa', tipo: 'aroma', familia: 'floral',
    conc: 'Home spray', formato: '250 ml', precio: 14500, stock: 12, nuevo: true,
    desc: 'Dos disparos sobre cortinas o sábanas y el ambiente cambia al instante.',
    dura: 'Varias horas por uso',
    img: 'ambientes-1x1.webp', foco: [0.528, 0.48, 1.72], ancho: [0.52, 0.5, 1.1], alto: [0.528, 0.48, 1.45],
    alt: 'Botella alta de home spray color rosado con válvula dorada',
  },
  {
    id: 'spray-limon', nombre: 'Home spray Limón & Verbena', tipo: 'aroma', familia: 'fresco',
    conc: 'Home spray', formato: '250 ml', precio: 13500, stock: 8,
    desc: 'Cítrico y limpio: ideal para cocina, baño o el auto.',
    dura: 'Varias horas por uso',
    img: 'mostrador-16x9.webp', foco: [0.886, 0.577, 2.09], ancho: [0.86, 0.56, 1.6], alto: [0.886, 0.57, 1.8],
    alt: 'Botella alta de home spray transparente con válvula dorada',
  },
  {
    id: 'vela-algodon', nombre: 'Vela Algodón & Lino', tipo: 'aroma', familia: 'fresco',
    conc: 'Vela de soja', formato: '220 g', precio: 16800, stock: 7, nuevo: true,
    desc: 'Cera de soja en vaso de vidrio, con aroma a ropa limpia.',
    dura: 'Hasta 40 horas de llama',
    img: 'ambientes-1x1.webp', foco: [0.762, 0.66, 2.51], ancho: [0.75, 0.66, 1.3], alto: [0.762, 0.64, 2.1],
    alt: 'Vela blanca encendida en un vaso de vidrio tallado',
  },
  {
    id: 'trio-rose', nombre: 'Caja regalo Trío Rosé', tipo: 'regalo', regalo: true, familia: 'floral',
    conc: 'Caja regalo', formato: '3 perfumes de 100 ml', precio: 99000, stock: 4, destacado: true,
    desc: 'Rosa Cristal, Gota Rosé y Luna Dorada en una caja con papel de seda y moño: para regalar (o regalarte).',
    incluye: ['rosa-cristal', 'gota-rose', 'luna-dorada'],
    img: 'regalo-1x1.webp', foco: [0.51, 0.558, 1.25], ancho: [0.5, 0.56, 1], alto: [0.5, 0.55, 1.15],
    alt: 'Caja de regalo con tres perfumes, papel de seda y moño rosado',
  },
  {
    id: 'caja-regalo', nombre: 'Caja para regalo con moño', tipo: 'regalo', regalo: true, familia: 'floral',
    conc: 'Packaging', formato: 'Caja rígida con moño satinado', precio: 4500, stock: 20,
    desc: 'Sumala a cualquier perfume y llega listo para regalar.',
    img: 'regalo-1x1.webp', foco: [0.86, 0.37, 2.9], ancho: [0.78, 0.4, 1.3], alto: [0.86, 0.38, 2.4],
    alt: 'Caja color crema con moño de satén rosado',
  },
];

const RAIL_ELEGIDOS = ['rosa-cristal', 'noir-intenso', 'difusor-flores', 'luna-dorada', 'rubi-oud', 'trio-rose'];
const RAIL_NUEVOS = ['petalo', 'durazno-almizcle', 'spray-peonia', 'rubi-oud', 'vela-algodon', 'gota-de-miel'];

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const clamp01 = v => Math.max(0, Math.min(1, v));
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const familiaDe = id => FAMILIAS.find(f => f.id === id) || FAMILIAS[0];
const precioTarjeta = p => p.precio;
const precioTransf = p => Math.round(p.precio * (1 - TRANSFERENCIA_MENOS / 100) / 100) * 100;
const precioSegun = (p, pago) => (pago === 'tarjeta' ? precioTarjeta(p) : precioTransf(p));
const icono = (id, cls = 'i') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const cuantos = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dims = img => IMG[img] || [1200, 1200];
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const irA = sel => { const el = sel === '#top' ? document.body : document.querySelector(sel); el?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); };
const mqCelu = window.matchMedia('(max-width: 760px)');

function recorte(img, foco, ar = 1) {
  const [w, h] = dims(img);
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w > vw + 0.5 ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h > vh + 0.5 ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const Cart = {
  KEY: 'meencanto_cart',
  memoria: null,
  get() {
    let items;
    try { items = JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { items = this.memoria || []; }
    if (!Array.isArray(items)) items = [];
    return items
      .filter(i => i && getProducto(i.id) && Number.isFinite(Number(i.qty)) && Number(i.qty) > 0)
      .map(i => { const p = getProducto(i.id); return { id: i.id, qty: Math.min(Math.floor(Number(i.qty)), p.stock > 0 ? p.stock : 99) }; });
  },
  save(items) {
    this.memoria = items;
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total(pago = 'transferencia') { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioSegun(p, pago) * i.qty : s; }, 0); },
};

const Prefs = {
  memoria: {},
  leer(k, def, validos) {
    let v;
    try { v = localStorage.getItem('meencanto_' + k); } catch { v = this.memoria[k]; }
    return validos.includes(v) ? v : def;
  },
  get pago() { return this.leer('pago', 'transferencia', ['transferencia', 'tarjeta']); },
  get entrega() { return this.leer('entrega', 'parana', ENTREGAS.map(e => e.id)); },
  guardar(k, v) {
    this.memoria[k] = v;
    try { localStorage.setItem('meencanto_' + k, v); } catch { this.memoria[k] = v; }
    document.dispatchEvent(new CustomEvent('prefs:updated'));
  },
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

function totales(items, pago, entregaId) {
  const suma = modo => items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioSegun(p, modo) * i.qty : s; }, 0);
  const entrega = ENTREGAS.find(e => e.id === entregaId) || ENTREGAS[0];
  const sub = suma(pago);
  return { sub, envio: entrega.costo, total: sub + entrega.costo, dif: suma('tarjeta') - suma('transferencia'), entrega };
}

function agregar(p, qty = 1, boton) {
  if (!p) return 0;
  if (p.stock <= 0) { showToast(`${p.nombre} está sin stock por ahora`); return 0; }
  const antes = Cart.get().find(i => i.id === p.id)?.qty || 0;
  Cart.add(p, qty);
  const n = (Cart.get().find(i => i.id === p.id)?.qty || 0) - antes;
  showToast(n > 0 ? `Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre} al carrito` : `Ya tenés en el carrito todas las unidades de ${p.nombre}`);
  if (boton && n > 0) { boton.classList.add('sumado'); setTimeout(() => boton.classList.remove('sumado'), 900); }
  return n;
}

function metaDe(p) {
  if (p.tipo === 'perfume') return `${PARA[p.para]} · ${familiaDe(p.familia).label}`;
  if (p.tipo === 'aroma') return `Para tu casa · ${familiaDe(p.familia).label}`;
  return 'Para regalar';
}
const detalleDe = p => `${p.conc} · ${p.formato}`;
function metaCard(p) {
  if (p.tipo === 'perfume') return `${PARA[p.para]} · ${familiaDe(p.familia).label} · ${p.formato.replace(', con caja', '')}`;
  return `${p.conc} · ${p.formato}`;
}
const notasCortas = p => (p.notas ? `${p.notas.salida} · ${p.notas.corazon} · ${p.notas.fondo}` : p.dura || p.desc);

function badgeHTML(p) {
  if (p.stock <= 0) return '<span class="prod-badge prod-badge--sin">Sin stock</span>';
  if (p.stock <= 3) return '<span class="prod-badge prod-badge--ultimas">Últimas unidades</span>';
  if (p.nuevo) return '<span class="prod-badge prod-badge--nuevo">Nuevo</span>';
  if (p.presentacion === 'original') return '<span class="prod-badge">Original con caja</span>';
  return '';
}

function preciosHTML(p) {
  return `<dl class="precios"><div class="precio-fila precio-fila--transf"><dt>Transferencia</dt><dd>${formatearPrecio(precioTransf(p))}</dd></div><div class="precio-fila"><dt>Tarjeta</dt><dd>${formatearPrecio(precioTarjeta(p))}</dd></div></dl>`;
}

function botonAgregar(p) {
  return p.stock > 0
    ? `<button type="button" class="btn-add prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span></button>`
    : '<button type="button" class="btn-add prod-add" disabled>Sin stock</button>';
}

function mediaHTML(p, cls, ar, clave = 'foco') {
  const [w, h] = dims(p.img);
  return `<button type="button" class="${cls} recorte" data-qv="${p.id}" style="${recorte(p.img, p[clave] || p.foco, ar)}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"><span class="prod-notas">${esc(notasCortas(p))}</span></button>`;
}

function cardHTML(p, animar = true) {
  return `<article class="prod"${animar ? ' data-animate style="opacity:0;transform:translateY(40px)"' : ''}>
    ${mediaHTML(p, 'prod-media', 1)}
    <div class="prod-body">
      <p class="prod-meta">${esc(metaCard(p))}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${preciosHTML(p)}
      <div class="prod-actions">${botonAgregar(p)}</div>
    </div>
  </article>`;
}

function cardFotoHTML(p) {
  const fam = familiaDe(p.familia);
  const quien = p.tipo === 'perfume' ? PARA[p.para] : p.tipo === 'aroma' ? 'Para tu casa' : 'Para regalar';
  return `<article class="prod prod--foto">
    ${mediaHTML(p, 'prod-media', 0.75, 'alto')}
    <div class="prod-body">
      <p class="prod-familia"><i style="--dot:${fam.color}"></i>${esc(fam.label)} · ${esc(quien)}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${preciosHTML(p)}
      <div class="prod-actions">${botonAgregar(p)}</div>
    </div>
  </article>`;
}

function teselaHTML(p, ancha, animar = true) {
  const [w, h] = dims(p.img);
  const foco = ancha ? (p.ancho || p.foco) : p.foco;
  const boton = p.stock > 0
    ? `<button type="button" class="tesela-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${icono('i-plus')}</button>`
    : `<button type="button" class="tesela-add" disabled aria-label="${esc(p.nombre)}: sin stock">${icono('i-x')}</button>`;
  return `<article class="tesela${ancha ? ' tesela--ancha' : ''}"${animar ? ' data-animate style="opacity:0;transform:translateY(40px)"' : ''}>
    <button type="button" class="tesela-media recorte" data-qv="${p.id}" style="${recorte(p.img, foco, ancha ? 2.05 : 1)}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"></button>
    <div class="tesela-info">
      <h3 class="tesela-nombre">${esc(p.nombre)}</h3>
      <p class="tesela-extra">${esc(metaDe(p))} · ${esc(p.formato)}</p>
      <p class="tesela-precio"><b>${formatearPrecio(precioTransf(p))}</b> transferencia<span class="tesela-tarj"><span class="tesela-sep"> · </span>${formatearPrecio(precioTarjeta(p))} tarjeta</span></p>
      ${boton}
    </div>
  </article>`;
}

function patronMosaico(n, cols) {
  const anchas = [];
  let fila = 0;
  if (cols <= 2) {
    const ciclo = [1, 2, 2];
    while (anchas.length < n) {
      const r = n - anchas.length;
      const cap = r === 1 ? 1 : ciclo[fila % 3];
      if (cap === 1) anchas.push(true); else anchas.push(false, false);
      fila++;
    }
    return anchas.slice(0, n);
  }
  const ciclo = [3, 4, 3, 4];
  while (anchas.length < n) {
    const r = n - anchas.length;
    let cap = ciclo[fila % 4];
    if (r <= 4) cap = r;
    else if (r - cap === 1) cap = cap === 3 ? 4 : 3;
    if (cap === 4) anchas.push(false, false, false, false);
    else if (cap === 3) { if (fila % 4 === 0) anchas.push(true, false, false); else anchas.push(false, false, true); }
    else if (cap === 2) anchas.push(true, true);
    else anchas.push(false);
    fila++;
  }
  return anchas.slice(0, n);
}

function prepararProductos() {
  PRODUCTOS.forEach((p, i) => {
    p._i = i;
    const fam = familiaDe(p.familia).label;
    p._txt = normalizar([
      p.nombre, p.conc, p.formato, PARA[p.para], PRESENTACION[p.presentacion], fam, p.desc,
      p.notas ? Object.values(p.notas).join(' ') : '',
      p.tipo === 'aroma' ? 'aromatizante ambiente casa hogar' : '',
      p.regalo ? 'regalo regalar' : '',
      p.tipo === 'perfume' ? 'perfume fragancia' : '',
    ].join(' '));
    p._palabras = normalizar(`${p.nombre} ${fam} ${PARA[p.para] || ''}`).split(/[^a-z0-9]+/).filter(Boolean);
  });
}

const Catalogo = { vista: 'todos', q: '', presentacion: new Set(), familias: new Set(), max: null, stock: false, orden: 'relevancia', visibles: POR_PAGINA };
const PRECIO_TOPE = Math.ceil(Math.max(...PRODUCTOS.map(precioTransf)) / 1000) * 1000;
const PRECIO_PISO = Math.floor(Math.min(...PRODUCTOS.map(precioTransf)) / 1000) * 1000;

function filtrar() {
  const c = Catalogo;
  const vista = VISTAS.find(v => v.id === c.vista) || VISTAS[0];
  const terminos = normalizar(c.q).split(/[^a-z0-9]+/).filter(t => t.length >= 2);
  const exactos = new Set(terminos.filter(t => t.length <= 2 && PRODUCTOS.some(p => p._palabras.includes(t))));
  const coincide = (p, t) => {
    if (t.length > 2) return p._txt.includes(t);
    return exactos.has(t) ? p._palabras.includes(t) : p._palabras.some(w => w.startsWith(t));
  };
  const lista = PRODUCTOS.filter(p =>
    vista.test(p)
    && (!c.presentacion.size || c.presentacion.has(p.presentacion))
    && (!c.familias.size || c.familias.has(p.familia))
    && (c.max == null || precioTransf(p) <= c.max)
    && (!c.stock || p.stock > 0)
    && terminos.every(t => coincide(p, t)));
  const ordenes = {
    menor: (a, b) => precioTransf(a) - precioTransf(b),
    mayor: (a, b) => precioTransf(b) - precioTransf(a),
    az: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
    relevancia: (a, b) => (b.stock > 0) - (a.stock > 0) || (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || a._i - b._i,
  };
  return lista.sort(ordenes[c.orden] || ordenes.relevancia);
}

const filtrosActivos = () => Catalogo.presentacion.size + Catalogo.familias.size + (Catalogo.max != null && Catalogo.max < PRECIO_TOPE ? 1 : 0) + (Catalogo.stock ? 1 : 0);

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = $$('[data-animate]:not(.in)', cont);
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.06, 0.6)}s`; });
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
}

function renderCatalogo({ reiniciar = true, yaVistos = 0 } = {}) {
  const cont = $('[data-catalogo]');
  if (!cont) return;
  const lista = filtrar();
  if (reiniciar) Catalogo.visibles = POR_PAGINA;
  const vis = lista.slice(0, Catalogo.visibles);
  if (cont.dataset.layout === 'mosaico') {
    const anchas = patronMosaico(vis.length, mqCelu.matches ? 2 : 4);
    cont.innerHTML = vis.map((p, k) => teselaHTML(p, anchas[k], k >= yaVistos)).join('');
  } else {
    cont.innerHTML = vis.map((p, k) => cardHTML(p, k >= yaVistos)).join('');
  }
  const cuenta = $('[data-cuenta]');
  if (cuenta) cuenta.textContent = lista.length === PRODUCTOS.length ? cuantos(lista.length, 'producto', 'productos') : `${cuantos(lista.length, 'producto', 'productos')} con estos filtros`;
  const mostrando = $('[data-mostrando]');
  if (mostrando) mostrando.textContent = lista.length ? `Mostrando ${vis.length} de ${lista.length}` : '';
  const verMas = $('[data-ver-mas]');
  if (verMas) verMas.hidden = vis.length >= lista.length;
  const vacio = $('[data-vacio]');
  if (vacio) vacio.hidden = lista.length > 0;
  $$('[data-chip]').forEach(ch => ch.setAttribute('aria-pressed', String(ch.dataset.chip === Catalogo.vista)));
  const n = filtrosActivos();
  $$('[data-filtros-n]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
  revelarNuevos(cont);
  refrescarScroll();
}

function renderChips() {
  const cont = $('[data-chips]');
  if (!cont) return;
  cont.innerHTML = VISTAS.map(v => `<button type="button" class="chip" data-chip="${v.id}" aria-pressed="${Catalogo.vista === v.id}">${esc(v.label)}<span class="chip-n">${PRODUCTOS.filter(v.test).length}</span></button>`).join('');
}

function renderFiltros() {
  const cont = $('[data-filtros-cuerpo]');
  if (!cont) return;
  const tope = Catalogo.max ?? PRECIO_TOPE;
  cont.innerHTML = `
    <div class="filtro-grupo">
      <p class="filtro-tit">Presentación</p>
      <div class="check-chips">${Object.entries(PRESENTACION).map(([id, label]) => `<label class="check-chip"><input type="checkbox" data-f="presentacion" value="${id}"${Catalogo.presentacion.has(id) ? ' checked' : ''}><span>${esc(label)} <small>${PRODUCTOS.filter(p => p.presentacion === id).length}</small></span></label>`).join('')}</div>
    </div>
    <div class="filtro-grupo">
      <p class="filtro-tit">Familia olfativa</p>
      <div class="check-chips">${FAMILIAS.map(f => `<label class="check-chip"><input type="checkbox" data-f="familia" value="${f.id}"${Catalogo.familias.has(f.id) ? ' checked' : ''}><span>${esc(f.label)} <small>${PRODUCTOS.filter(p => p.familia === f.id).length}</small></span></label>`).join('')}</div>
    </div>
    <div class="filtro-grupo">
      <p class="filtro-tit">Precio por transferencia</p>
      <input class="rango" type="range" min="${PRECIO_PISO}" max="${PRECIO_TOPE}" step="1000" value="${tope}" data-f="max" aria-label="Precio máximo por transferencia">
      <p class="rango-valor"><span>${formatearPrecio(PRECIO_PISO)}</span><output data-max-out>Hasta ${formatearPrecio(tope)}</output></p>
    </div>
    <div class="filtro-grupo">
      <label class="switch">Solo lo que tiene stock<input type="checkbox" data-f="stock"${Catalogo.stock ? ' checked' : ''}></label>
    </div>`;
}

function syncURL() {
  try {
    const u = new URL(location.href);
    let cat = Catalogo.vista;
    if (cat === 'perfumes' && Catalogo.presentacion.size === 1) cat = Catalogo.presentacion.has('original') ? 'originales' : 'alternativas';
    if (cat && cat !== 'todos') u.searchParams.set('cat', cat); else u.searchParams.delete('cat');
    window.history.replaceState(null, '', u);
  } catch { /* sin history */ }
}

function aplicarPreset(preset = {}) {
  Catalogo.vista = VISTAS.some(v => v.id === preset.vista) ? preset.vista : 'todos';
  Catalogo.presentacion = new Set(preset.presentacion || []);
  Catalogo.familias = new Set();
  Catalogo.max = null;
  Catalogo.stock = false;
  Catalogo.q = '';
  $$('[data-q]').forEach(i => { i.value = ''; });
  renderFiltros();
  renderCatalogo();
  syncURL();
}

function leerURL() {
  try {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat && ATAJOS[cat]) { const pr = ATAJOS[cat].preset; Catalogo.vista = pr.vista; Catalogo.presentacion = new Set(pr.presentacion || []); }
    else if (cat && VISTAS.some(v => v.id === cat)) Catalogo.vista = cat;
    return params.get('producto');
  } catch { return null; }
}

function initCatalogoEventos() {
  const form = $('[data-buscador]');
  const input = $('[data-q]');
  let t = 0;
  form?.addEventListener('submit', e => { e.preventDefault(); Catalogo.q = input.value; renderCatalogo(); });
  input?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { Catalogo.q = input.value; renderCatalogo(); }, 160); });
  $('[data-orden]')?.addEventListener('change', e => { Catalogo.orden = e.target.value; renderCatalogo(); });
  const cuerpo = $('[data-filtros-cuerpo]');
  const leer = () => {
    Catalogo.presentacion = new Set($$('input[data-f="presentacion"]:checked', cuerpo).map(i => i.value));
    Catalogo.familias = new Set($$('input[data-f="familia"]:checked', cuerpo).map(i => i.value));
    const r = $('input[data-f="max"]', cuerpo);
    Catalogo.max = r && Number(r.value) < PRECIO_TOPE ? Number(r.value) : null;
    Catalogo.stock = !!$('input[data-f="stock"]', cuerpo)?.checked;
    const out = $('[data-max-out]', cuerpo);
    if (out && r) out.textContent = `Hasta ${formatearPrecio(Number(r.value))}`;
    renderCatalogo();
    syncURL();
  };
  cuerpo?.addEventListener('change', leer);
  cuerpo?.addEventListener('input', e => { if (e.target.matches('input[data-f="max"]')) leer(); });
  mqCelu.addEventListener('change', () => { if ($('[data-catalogo]')?.dataset.layout === 'mosaico') renderCatalogo({ reiniciar: false, yaVistos: Catalogo.visibles }); });
}

const cuentaPreset = pr => PRODUCTOS.filter(p => (VISTAS.find(v => v.id === pr.vista) || VISTAS[0]).test(p) && (!pr.presentacion || pr.presentacion.includes(p.presentacion))).length;

function initCirculos() {
  const cont = $('[data-circulos]');
  if (!cont) return;
  cont.innerHTML = CIRCULOS.map(c => {
    const a = ATAJOS[c.atajo];
    const n = cuentaPreset(a.preset);
    const [w, h] = dims(c.img);
    return `<li data-animate style="opacity:0;transform:translateY(30px)">
      <button type="button" class="circulo-btn" data-atajo="${c.atajo}">
        <span class="circulo-media recorte" style="${recorte(c.img, c.foco, 1)}"><img src="images/${c.img}" alt="${esc(c.alt)}" width="${w}" height="${h}"></span>
        <span class="circulo-nombre">${esc(a.label)}</span>
        <span class="circulo-n">${cuantos(n, 'producto', 'productos')}</span>
      </button>
    </li>`;
  }).join('');
}

function initColecciones() {
  const cont = $('[data-colecciones]');
  if (!cont) return;
  cont.innerHTML = COLECCIONES.map(c => {
    const n = cuentaPreset(ATAJOS[c.atajo].preset);
    const [w, h] = dims(c.img);
    return `<li data-animate style="opacity:0;transform:translateY(40px)">
      <button type="button" class="coleccion" data-atajo="${c.atajo}">
        <img src="images/${c.img}" alt="${esc(c.alt)}" width="${w}" height="${h}" style="object-position:${c.pos}">
        <span class="coleccion-txt">
          <span class="coleccion-nombre">${esc(c.titulo)} ${icono('i-arrow')}</span>
          <span class="coleccion-sub">${esc(c.sub)}</span>
          <span class="coleccion-n">${cuantos(n, 'producto', 'productos')}</span>
        </span>
      </button>
    </li>`;
  }).join('');
}

function initRecortesEstaticos() {
  $$('[data-recorte]').forEach(el => {
    const [img, cx, cy, z] = el.dataset.recorte.split('|');
    el.setAttribute('style', recorte(img, [Number(cx), Number(cy), Number(z)], Number(el.dataset.ar) || 1));
  });
}

function initRail() {
  const vp = $('[data-rail]');
  if (!vp) return;
  const track = $('[data-rail-track]', vp);
  const nuevo = vp.dataset.rail === 'nuevo';
  const ids = nuevo ? RAIL_NUEVOS : RAIL_ELEGIDOS;
  track.innerHTML = ids.map(getProducto).filter(Boolean).slice(0, 8).map(p => `<li class="rail-item" data-animate style="opacity:0;transform:translateY(40px)">${nuevo ? cardFotoHTML(p) : cardHTML(p, false)}</li>`).join('');
  initRailDrag(vp, track, $('[data-rail-prev]'), $('[data-rail-next]'));
}

function initRailDrag(vp, track, prev, next) {
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture igual arrastra */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const fin = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) setTimeout(() => vp.classList.remove('dragging'), 0);
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('pointerleave', fin);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => {
    const item = $('.rail-item', track);
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return item ? item.getBoundingClientRect().width + gap : 300;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas);
  flechas();
}

const Overlay = {
  pila: [],
  abrir(fondo, { panel = fondo, opener = document.activeElement, alCerrar } = {}) {
    if (!fondo || this.pila.some(o => o.panel === panel)) return;
    clearTimeout(panel._cierre);
    const o = { fondo, panel, opener, alCerrar };
    o.onKey = e => this.teclas(e, o);
    this.pila.push(o);
    fondo.hidden = false;
    panel.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => { fondo.classList.add('abierto'); panel.classList.add('abierto'); }));
    document.addEventListener('keydown', o.onKey);
    const foco = panel.querySelector('[data-foco-inicial]') || panel.querySelector('button:not([disabled]), a[href], input, select');
    setTimeout(() => (foco || panel).focus({ preventScroll: true }), 80);
  },
  cerrar(panel) {
    const k = this.pila.findIndex(o => o.panel === panel || o.fondo === panel);
    if (k < 0) return;
    const [o] = this.pila.splice(k, 1);
    document.removeEventListener('keydown', o.onKey);
    o.fondo.classList.remove('abierto');
    o.panel.classList.remove('abierto');
    o.panel._cierre = setTimeout(() => { o.fondo.hidden = true; o.panel.hidden = true; }, 420);
    if (!this.pila.length) document.body.classList.remove('no-scroll');
    o.alCerrar?.();
    if (o.opener && document.contains(o.opener) && o.opener.offsetParent !== null) o.opener.focus({ preventScroll: true });
  },
  teclas(e, o) {
    if (this.pila[this.pila.length - 1] !== o) return;
    if (e.key === 'Escape') { e.preventDefault(); this.cerrar(o.panel); return; }
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', o.panel).filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !o.panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !o.panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  },
};

function abrirCarrito(opener) {
  renderCarrito();
  Overlay.abrir($('[data-cart-fondo]'), { panel: $('#carrito'), opener });
}

function mensajePedido(items, pago, t) {
  const lineas = ['Hola Me Encantó! Quiero hacer este pedido:'];
  items.forEach(i => { const p = getProducto(i.id); if (p) lineas.push(`- ${i.qty} × ${p.nombre} (${p.formato}): ${formatearPrecio(precioSegun(p, pago) * i.qty)}`); });
  lineas.push(`Pago: ${pago === 'tarjeta' ? 'con tarjeta' : 'por transferencia'}`);
  lineas.push(`Entrega: ${t.entrega.nombre}${t.envio ? ` (${formatearPrecio(t.envio)}, estimado)` : ''}`);
  lineas.push(`Total: ${formatearPrecio(t.total)}`);
  return lineas.join('\n');
}

function segmentoHTML(pago) {
  return `<div class="segmento" data-activo="${pago}" role="group" aria-label="Cómo pagás">
    <button type="button" class="segmento-opt" data-pago="transferencia" aria-pressed="${pago === 'transferencia'}">${icono('i-bank')} Transferencia</button>
    <button type="button" class="segmento-opt" data-pago="tarjeta" aria-pressed="${pago === 'tarjeta'}">${icono('i-card')} Tarjeta</button>
    <span class="segmento-thumb" aria-hidden="true"></span>
  </div>`;
}

function renderCarrito(focoSel) {
  const cuerpo = $('[data-cart-cuerpo]');
  const pie = $('[data-cart-pie]');
  if (!cuerpo || !pie) return;
  const items = Cart.get();
  const pago = Prefs.pago;
  const n = items.reduce((s, i) => s + i.qty, 0);
  const tit = $('[data-cart-titulo-n]');
  if (tit) tit.textContent = n ? `(${n})` : '';
  if (!items.length) {
    cuerpo.innerHTML = `<div class="drawer-vacio">${icono('i-cart')}<p>Tu carrito está vacío</p><p>Arrancá por los más elegidos o buscá tu próximo perfume por nota.</p><a class="btn btn-cta" href="#tienda" data-vista="perfumes" data-close-cart>Ver los perfumes</a></div>`;
    pie.hidden = true;
    pie.innerHTML = '';
    return;
  }
  cuerpo.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const [w, h] = dims(p.img);
    return `<div class="linea">
      <div class="linea-media recorte" style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="" width="${w}" height="${h}"></div>
      <div class="linea-info">
        <p class="linea-nombre">${esc(p.nombre)}</p>
        <p class="linea-detalle">${esc(detalleDe(p))}</p>
        <div class="linea-fila">
          <div class="stepper">
            <button type="button" data-linea-menos="${p.id}" aria-label="Restar una unidad de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${icono('i-minus')}</button>
            <output>${i.qty}</output>
            <button type="button" data-linea-mas="${p.id}" aria-label="Sumar una unidad de ${esc(p.nombre)}"${i.qty >= p.stock ? ' disabled' : ''}>${icono('i-plus')}</button>
          </div>
          <span class="linea-precio">${formatearPrecio(precioSegun(p, pago) * i.qty)}</span>
          <button type="button" class="linea-quitar" data-linea-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)} del carrito">${icono('i-trash')}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const t = totales(items, pago, Prefs.entrega);
  pie.hidden = false;
  pie.innerHTML = `${segmentoHTML(pago)}
    <dl class="resumen">
      <div><dt>Productos</dt><dd>${formatearPrecio(t.sub)}</dd></div>
      <div class="resumen-envio"><dt>${esc(t.entrega.nombre)} · <button type="button" data-ir-pagos>Cambiar</button></dt><dd>${t.envio ? formatearPrecio(t.envio) : 'Sin costo'}</dd></div>
      <div class="resumen-total"><dt>Total</dt><dd>${formatearPrecio(t.total)}</dd></div>
    </dl>
    <p class="resumen-dif">${pago === 'transferencia' ? `Pagando por transferencia ahorrás ${formatearPrecio(t.dif)}.` : `Por transferencia pagarías ${formatearPrecio(t.dif)} menos.`}</p>
    <button type="button" class="btn btn-cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn-wsp" href="${wspHref(mensajePedido(items, pago, t))}" target="_blank" rel="noopener noreferrer">${icono('i-wsp')} Enviar el pedido por WhatsApp</a>`;
  if (focoSel) {
    const el = $(focoSel, cuerpo) || $(focoSel, pie);
    if (el && !el.disabled) el.focus({ preventScroll: true });
  }
}

function updateCartBadge(bump = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n && bump) b.classList.add('bump');
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

let totalActual = null;
let totalTween = null;
function pintarTotal(el, valor) {
  if (!el) return;
  totalTween?.kill();
  if (totalActual == null || reduceMotion || typeof gsap === 'undefined') {
    totalActual = valor;
    el.textContent = formatearPrecio(valor);
    return;
  }
  const obj = { v: totalActual };
  totalTween = gsap.to(obj, { v: valor, duration: 0.6, ease: 'power2.out', onUpdate: () => { totalActual = obj.v; el.textContent = formatearPrecio(obj.v); } });
}

function initPagos() {
  const cont = $('[data-entregas]');
  if (!cont) return;
  cont.setAttribute('role', 'radiogroup');
  cont.setAttribute('aria-label', 'Dónde lo recibís');
  cont.innerHTML = ENTREGAS.map(e => `<button type="button" class="entrega" role="radio" data-entrega="${e.id}" aria-checked="false" tabindex="-1">${icono(e.icono)}<span class="entrega-nombre">${esc(e.nombre)}</span><span class="entrega-zona">${esc(e.zona)}</span><span class="entrega-costo">${e.costo ? `${formatearPrecio(e.costo)}<small>estimado</small>` : 'Sin costo'}</span></button>`).join('');
  cont.addEventListener('keydown', e => {
    const teclas = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in teclas)) return;
    e.preventDefault();
    const k = ENTREGAS.findIndex(x => x.id === Prefs.entrega);
    const sig = ENTREGAS[(k + teclas[e.key] + ENTREGAS.length) % ENTREGAS.length];
    Prefs.guardar('entrega', sig.id);
    $(`[data-entrega="${sig.id}"]`, cont)?.focus();
  });
}

function renderPagos() {
  const ticket = $('[data-ticket]');
  const pago = Prefs.pago;
  const entregaId = Prefs.entrega;
  $$('[data-pago-seg]').forEach(s => { s.dataset.activo = pago; });
  $$('[data-pago-seg] [data-pago]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pago === pago)));
  const ayuda = $('[data-pago-ayuda]');
  if (ayuda) ayuda.textContent = pago === 'tarjeta' ? 'Débito o crédito, con Mercado Pago. Pagás el precio de lista.' : 'Te pasamos el alias cuando confirmás el pedido.';
  $$('[data-entrega]').forEach(b => { const on = b.dataset.entrega === entregaId; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
  if (!ticket) return;
  const items = Cart.get();
  const ejemplo = !items.length;
  const lista = ejemplo ? [{ id: 'rosa-cristal', qty: 1 }] : items;
  const t = totales(lista, pago, entregaId);
  $('[data-ticket-origen]', ticket).textContent = ejemplo ? 'Ejemplo con Rosa Cristal: sumá lo tuyo al carrito y se recalcula.' : `Con ${cuantos(items.reduce((s, i) => s + i.qty, 0), 'producto', 'productos')} de tu carrito.`;
  const lineas = lista.slice(0, 3).map(i => { const p = getProducto(i.id); return `<li><span>${i.qty} × ${esc(p.nombre)}</span><b>${formatearPrecio(precioSegun(p, pago) * i.qty)}</b></li>`; });
  if (lista.length > 3) lineas.push(`<li class="ticket-mas"><span>y ${cuantos(lista.length - 3, 'producto más', 'productos más')}</span></li>`);
  $('[data-ticket-lineas]', ticket).innerHTML = lineas.join('');
  $('[data-ticket-sub]', ticket).textContent = formatearPrecio(t.sub);
  $('[data-ticket-envio-lbl]', ticket).textContent = t.entrega.nombre;
  $('[data-ticket-envio]', ticket).textContent = t.envio ? formatearPrecio(t.envio) : 'Sin costo';
  pintarTotal($('[data-ticket-total]', ticket), t.total);
  $('[data-ticket-dif]', ticket).innerHTML = pago === 'transferencia'
    ? `Pagando por transferencia ahorrás ${formatearPrecio(t.dif)}.`
    : `<span>Por transferencia pagarías ${formatearPrecio(t.dif)} menos.</span><button type="button" data-cambiar-pago>Pasar a transferencia</button>`;
  $('[data-ticket-plazo]', ticket).textContent = t.entrega.plazo;
  const accion = $('[data-ticket-accion]', ticket);
  accion.textContent = ejemplo ? 'Agregar Rosa Cristal al carrito' : 'Revisar y finalizar compra';
  accion.dataset.modo = ejemplo ? 'ejemplo' : 'carrito';
  const msg = ejemplo
    ? `Hola Me Encantó! Quiero consultar por Rosa Cristal (100 ml) con ${t.entrega.nombre.toLowerCase()}, pagando ${pago === 'tarjeta' ? 'con tarjeta' : 'por transferencia'}.`
    : mensajePedido(items, pago, t);
  $('[data-ticket-wsp]', ticket).href = wspHref(msg);
  ticket.classList.remove('recalcula');
  void ticket.offsetWidth;
  ticket.classList.add('recalcula');
}

function abrirQV(id, opener) {
  const p = getProducto(id);
  const fondo = $('[data-qv-fondo]');
  const cuerpo = $('[data-qv-cuerpo]');
  if (!p || !fondo || !cuerpo) return;
  const vistas = [[p.img, p.foco], ...(p.vistas || [])];
  const [w, h] = dims(p.img);
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.tipo === p.tipo && x.stock > 0)
    .sort((a, b) => (b.para === p.para) - (a.para === p.para) || (b.familia === p.familia) - (a.familia === p.familia))
    .slice(0, 3);
  const tags = [p.tipo === 'perfume' ? PARA[p.para] : p.tipo === 'aroma' ? 'Para tu casa' : 'Para regalar', familiaDe(p.familia).label];
  const linea = p.presentacion ? `<span class="qv-tag qv-tag--linea">${esc(PRESENTACION[p.presentacion])}</span>` : '';
  const ficha = p.tipo === 'perfume'
    ? `<span>${icono('i-clock')} Dura ${esc(p.fijacion)}</span><span>${icono('i-drop')} Estela ${esc(p.estela.toLowerCase())}</span><span>${esc(p.momento)}</span>`
    : p.dura ? `<span>${icono('i-clock')} ${esc(p.dura)}</span>` : '';
  const incluye = p.incluye ? `<p class="qv-desc"><b>Incluye:</b> ${p.incluye.map(getProducto).filter(Boolean).map(x => esc(x.nombre)).join(', ')}.</p>` : '';
  const stock = p.stock <= 0 ? 'Sin stock por ahora' : p.stock <= 3 ? `Quedan ${cuantos(p.stock, 'unidad', 'unidades')}` : 'Disponible para enviar o retirar';
  const msg = p.stock > 0 ? `Hola Me Encantó! Quiero consultar por ${p.nombre} (${p.formato}).` : `Hola Me Encantó! Avisame cuando vuelva ${p.nombre} (${p.formato}).`;
  cuerpo.innerHTML = `
    <div class="qv-galeria">
      <div class="qv-foto recorte" data-qv-foto style="${recorte(p.img, p.foco, 1)}"><img src="images/${p.img}" alt="${esc(p.alt)}" width="${w}" height="${h}"></div>
      ${vistas.length > 1 ? `<div class="qv-thumbs">${vistas.map(([img, foco], k) => { const [tw, th] = dims(img); return `<button type="button" class="qv-thumb recorte" data-qv-vista="${k}" aria-pressed="${k === 0}" aria-label="Ver la foto ${k + 1} de ${vistas.length}" style="${recorte(img, foco, 1)}"><img src="images/${img}" alt="" width="${tw}" height="${th}"></button>`; }).join('')}</div>` : ''}
    </div>
    <div class="qv-info">
      <div class="qv-tags">${linea}${tags.map(tg => `<span class="qv-tag">${esc(tg)}</span>`).join('')}</div>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-detalle">${esc(detalleDe(p))}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${incluye}
      <div class="qv-precios">
        <p class="qv-precio qv-precio--transf"><span>Por transferencia</span><b>${formatearPrecio(precioTransf(p))}</b></p>
        <p class="qv-precio"><span>Con tarjeta</span><b>${formatearPrecio(precioTarjeta(p))}</b></p>
      </div>
      ${p.notas ? `<dl class="qv-notas"><div><dt>Salida</dt><dd>${esc(p.notas.salida)}</dd></div><div><dt>Corazón</dt><dd>${esc(p.notas.corazon)}</dd></div><div><dt>Fondo</dt><dd>${esc(p.notas.fondo)}</dd></div></dl>` : ''}
      ${ficha ? `<p class="qv-ficha">${ficha}</p>` : ''}
      <p class="qv-stock${p.stock <= 0 ? ' qv-stock--sin' : ''}">${esc(stock)}</p>
      ${p.stock > 0 ? `<div class="qv-comprar">
        <div class="stepper"><button type="button" data-qv-menos aria-label="Restar una unidad" disabled>${icono('i-minus')}</button><output data-qv-qty aria-live="polite">1</output><button type="button" data-qv-mas aria-label="Sumar una unidad"${p.stock <= 1 ? ' disabled' : ''}>${icono('i-plus')}</button></div>
        <button type="button" class="btn btn-ghost" data-qv-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn-cta" data-qv-comprar>Comprar ahora</button>
      </div>` : ''}
      <a class="btn btn-wsp qv-wsp" href="${wspHref(msg)}" target="_blank" rel="noopener noreferrer">${icono('i-wsp')} ${p.stock > 0 ? 'Preguntar por WhatsApp' : 'Avisame cuando vuelva'}</a>
      ${rel.length ? `<p class="qv-rel-tit">También te puede interesar</p><div class="qv-rel">${rel.map(x => { const [rw, rh] = dims(x.img); return `<button type="button" class="qv-rel-item" data-qv-rel="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco, 1)}"><img src="images/${x.img}" alt="" width="${rw}" height="${rh}"></span><span>${esc(x.nombre)}</span><span class="qv-rel-precio">${formatearPrecio(precioTransf(x))}</span></button>`; }).join('')}</div>` : ''}
    </div>`;
  cuerpo.dataset.id = p.id;
  cuerpo.dataset.qty = '1';
  const modal = $('[data-qv]');
  if (!Overlay.pila.some(o => o.fondo === fondo)) Overlay.abrir(fondo, { panel: fondo, opener, alCerrar: () => { $('#ld-producto')?.remove(); } });
  else { modal.scrollTop = 0; $('[data-close-qv]')?.focus({ preventScroll: true }); }
  ldProducto(p);
}

function ldProducto(p) {
  let s = $('#ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: `https://gokywebs.com/demo/meencanto/images/${p.img}`,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: precioTarjeta(p),
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://gokywebs.com/demo/meencanto/?producto=${p.id}`,
    },
  });
}

function initQVEventos() {
  const cuerpo = $('[data-qv-cuerpo]');
  const fondo = $('[data-qv-fondo]');
  if (!cuerpo || !fondo) return;
  fondo.addEventListener('click', e => { if (e.target === fondo) Overlay.cerrar(fondo); });
  cuerpo.addEventListener('click', e => {
    const p = getProducto(cuerpo.dataset.id);
    if (!p) return;
    const vista = e.target.closest('[data-qv-vista]');
    if (vista) {
      const vistas = [[p.img, p.foco], ...(p.vistas || [])];
      const [img, foco] = vistas[Number(vista.dataset.qvVista)] || vistas[0];
      const foto = $('[data-qv-foto]', cuerpo);
      const [w, h] = dims(img);
      foto.setAttribute('style', recorte(img, foco, 1));
      foto.innerHTML = `<img src="images/${img}" alt="${esc(p.alt)}" width="${w}" height="${h}">`;
      $$('[data-qv-vista]', cuerpo).forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    const qtyOut = $('[data-qv-qty]', cuerpo);
    let qty = Number(cuerpo.dataset.qty) || 1;
    if (e.target.closest('[data-qv-menos]') || e.target.closest('[data-qv-mas]')) {
      qty = Math.max(1, Math.min(p.stock, qty + (e.target.closest('[data-qv-mas]') ? 1 : -1)));
      cuerpo.dataset.qty = String(qty);
      qtyOut.textContent = qty;
      $('[data-qv-menos]', cuerpo).disabled = qty <= 1;
      $('[data-qv-mas]', cuerpo).disabled = qty >= p.stock;
      return;
    }
    if (e.target.closest('[data-qv-agregar]')) { agregar(p, qty, e.target.closest('button')); return; }
    if (e.target.closest('[data-qv-comprar]')) {
      if (agregar(p, qty) > 0 || Cart.get().some(i => i.id === p.id)) { Overlay.cerrar(fondo); setTimeout(() => abrirCarrito(), 120); }
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) abrirQV(rel.dataset.qvRel, rel);
  });
}

function initMundos() {
  const sec = $('[data-mundos]');
  if (!sec) return;
  const escena = $('.mundos-escena', sec);
  const mundoA = $('.mundo--piel', sec);
  const mundoB = $('[data-mundo-b]', sec);
  const svg = $('.mundos-linea', sec);
  const path = $('path', svg);
  const chip = $('.mundos-chip', sec);
  const dato = $('[data-mundos-dato]', sec);
  const donde = $('[data-mundos-donde]', sec);
  const perf = PRODUCTOS.filter(p => p.tipo === 'perfume');
  const aro = PRODUCTOS.filter(p => p.tipo === 'aroma');
  $$('[data-mundo-cuenta="perfumes"]', sec).forEach(el => { el.textContent = cuantos(perf.length, 'perfume', 'perfumes'); });
  $$('[data-mundo-cuenta="aromas"]', sec).forEach(el => { el.textContent = cuantos(aro.length, 'aroma', 'aromas'); });
  $$('[data-mundo-desde="perfumes"]', sec).forEach(el => { el.textContent = formatearPrecio(Math.min(...perf.map(precioTransf))); });
  $$('[data-mundo-desde="aromas"]', sec).forEach(el => { el.textContent = formatearPrecio(Math.min(...aro.map(precioTransf))); });
  $$('[data-mundo-cta="perfumes"]', sec).forEach(el => { el.textContent = `Ver los ${perf.length} perfumes`; });
  $$('[data-mundo-cta="aromas"]', sec).forEach(el => { el.textContent = `Ver los ${aro.length} aromas`; });
  const horas0 = getProducto('rosa-cristal')?.fijacionMax || 8;
  const dias1 = getProducto('difusor-flores')?.duraDias || 60;
  const mqApilado = window.matchMedia('(max-width: 900px)');
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let frame = 0;
  const pintar = p => {
    const W = escena.clientWidth;
    const H = escena.clientHeight;
    if (!W || !H) return;
    const vertical = mqApilado.matches;
    const t = clamp01((p - 0.06) / 0.78);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const w = 108 - 116 * e;
    const fase = p * Math.PI * 3;
    const puntos = [];
    let poly;
    let chipX;
    let chipY;
    let lineaEn;
    if (vertical) {
      const amp = Math.min(16, H * 0.02);
      const largo = W * 1.1;
      const pos = 100 - w;
      const yDe = x => (H * pos) / 100 + amp * Math.sin((2 * Math.PI * x) / largo + fase);
      lineaEn = yDe;
      for (let x = 0; x < W; x += 12) puntos.push([x, yDe(x)]);
      puntos.push([W, yDe(W)]);
      poly = `polygon(-80px -80px,${W + 80}px -80px,${[...puntos].reverse().map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
      chipX = chip.offsetWidth / 2 + 12;
      chipY = Math.max(chip.offsetHeight / 2 + 8, Math.min(H - chip.offsetHeight / 2 - 8, yDe(chipX)));
    } else {
      const amp = Math.min(26, W * 0.03);
      const largo = H * 0.95;
      const xDe = y => (W * w) / 100 + amp * Math.sin((2 * Math.PI * y) / largo + fase);
      lineaEn = xDe;
      for (let y = 0; y < H; y += 14) puntos.push([xDe(y), y]);
      puntos.push([xDe(H), H]);
      poly = `polygon(${puntos.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')},${W + 80}px ${H}px,${W + 80}px 0px)`;
      chipY = H * 0.15;
      chipX = Math.max(chip.offsetWidth / 2 + 8, Math.min(W - chip.offsetWidth / 2 - 8, xDe(chipY)));
    }
    mundoB.style.clipPath = poly;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    path.setAttribute('d', 'M' + puntos.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L'));
    const visible = w > -4 && w < 104;
    svg.style.opacity = visible ? '1' : '0';
    chip.style.opacity = visible ? '1' : '0';
    chip.style.transform = `translate(${(chipX - chip.offsetWidth / 2).toFixed(1)}px, ${(chipY - chip.offsetHeight / 2).toFixed(1)}px)`;
    const k = clamp01((108 - w) / 116);
    if (k < 0.5) {
      dato.textContent = `${Math.max(1, Math.round(horas0 * (k / 0.5)))} h`;
      donde.textContent = 'en la piel';
    } else {
      dato.textContent = cuantos(Math.max(1, Math.round(dias1 * ((k - 0.5) / 0.5))), 'día', 'días');
      donde.textContent = 'en tu casa';
    }
    const ctaB = $('.btn', mundoB);
    const re = escena.getBoundingClientRect();
    const rb = ctaB ? ctaB.getBoundingClientRect() : null;
    let pasoCta = w < 50;
    if (rb) {
      const cx = rb.left - re.left + rb.width / 2;
      const cy = rb.top - re.top + rb.height / 2;
      pasoCta = vertical ? lineaEn(cx) >= cy : lineaEn(cy) <= cx;
    }
    mundoA.inert = pasoCta;
    mundoB.inert = !pasoCta;
  };
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - escena.offsetHeight;
    return total > 0 ? clamp01((OFF() - r.top) / total) : 0;
  };
  const tick = () => { frame = 0; pintar(progreso()); };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(tick); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir);
  window.addEventListener('load', pedir);
  pintar(progreso());
}

function initHeroMsgs() {
  const box = $('[data-hero-msgs]');
  if (!box) return;
  const msgs = $$('[data-msg]', box);
  const dots = $$('[data-msg-dot]');
  let i = 0;
  let timer = 0;
  const ir = n => {
    i = (n + msgs.length) % msgs.length;
    msgs.forEach((m, k) => { m.hidden = k !== i; m.classList.toggle('is-on', k === i); });
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-pressed', String(k === i)); });
  };
  const auto = () => { window.clearInterval(timer); if (!reduceMotion) timer = window.setInterval(() => ir(i + 1), 5200); };
  $('[data-msg-prev]')?.addEventListener('click', () => { ir(i - 1); auto(); });
  $('[data-msg-next]')?.addEventListener('click', () => { ir(i + 1); auto(); });
  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); auto(); }));
  const banner = box.closest('.banner');
  banner?.addEventListener('mouseenter', () => window.clearInterval(timer));
  banner?.addEventListener('mouseleave', auto);
  banner?.addEventListener('focusin', () => window.clearInterval(timer));
  auto();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = $('.hero');
  if (!hero) return;
  const img = $('[data-hero-img]', hero);
  const h1 = $('[data-hero-h1]', hero);
  const subs = $$('[data-hero-sub]', hero);
  const sello = $('.sello', hero);
  const eyebrow = $('[data-hero-msgs]', hero) || $('.hero-eyebrow', hero);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (img) tl.from(img, { scale: 1.08, duration: 1.6 }, 0);
  if (eyebrow) tl.from(eyebrow, { y: 14, opacity: 0, duration: 0.8 }, 0.1);
  if (h1) tl.from(h1, { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1.1, clearProps: 'filter' }, 0.15);
  if (subs.length) tl.from(subs, { y: 22, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.4);
  if (sello) tl.from(sello, { scale: 0.92, rotate: -25, opacity: 0, duration: 1.1 }, 0.5);
  if (img && typeof ScrollTrigger !== 'undefined') {
    gsap.to(img, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.12, 0.72)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
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
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initWspLinks() {
  $$('[data-wsp-msg]').forEach(a => { a.href = wspHref(a.dataset.wspMsg); });
}

function initMapa() {
  const el = $('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  let hecho = false;
  const crear = () => {
    if (hecho) return;
    hecho = true;
    const centro = [-31.7475, -60.519];
    const mapa = L.map(el, { center: centro, zoom: 15, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: false });
    mapa.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.marker(centro, {
      icon: L.divIcon({ className: 'mapa-pin', html: '<span><b>M</b></span>', iconSize: [44, 44], iconAnchor: [22, 53] }),
      keyboard: false,
      title: 'Showroom Me Encantó',
    }).addTo(mapa);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { crear(); io.disconnect(); } }, { rootMargin: '400px 0px' });
    io.observe(el);
  } else crear();
}

function initFormsDemo() {
  $$('[data-form-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input[type="email"]', form);
      const error = $('[data-error]', form);
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((input?.value || '').trim());
      input?.setAttribute('aria-invalid', String(!ok));
      if (error) error.hidden = ok;
      if (!ok) { input?.focus(); return; }
      const btn = $('[type="submit"]', form);
      const texto = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = texto;
        form.reset();
        input.removeAttribute('aria-invalid');
        showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      }, 800);
    });
  });
}

function initClicks() {
  document.addEventListener('click', e => {
    const t = e.target;
    if (!(t instanceof window.Element)) return;
    const add = t.closest('[data-add]');
    if (add) { agregar(getProducto(add.dataset.add), 1, add); return; }
    const qv = t.closest('[data-qv]');
    if (qv) { abrirQV(qv.dataset.qv, qv); return; }
    const atajo = t.closest('[data-atajo]');
    if (atajo) { const a = ATAJOS[atajo.dataset.atajo]; if (a) { aplicarPreset(a.preset); irA('#tienda'); } return; }
    const chip = t.closest('[data-chip]');
    if (chip) { Catalogo.vista = chip.dataset.chip; renderCatalogo(); syncURL(); return; }
    const pago = t.closest('[data-pago]');
    if (pago) { Prefs.guardar('pago', pago.dataset.pago); return; }
    if (t.closest('[data-cambiar-pago]')) { Prefs.guardar('pago', 'transferencia'); return; }
    const entrega = t.closest('[data-entrega]');
    if (entrega) { Prefs.guardar('entrega', entrega.dataset.entrega); return; }
    const vista = t.closest('[data-vista]');
    if (vista) {
      aplicarPreset({ vista: vista.dataset.vista });
      if (vista.hasAttribute('data-close-cart')) Overlay.cerrar($('#carrito'));
    }
    if (t.closest('[data-open-cart]') || t.closest('#cart-float')) { abrirCarrito(t.closest('button')); return; }
    if (t.closest('[data-cart-fondo]') || (t.closest('[data-close-cart]') && !vista)) { Overlay.cerrar($('#carrito')); return; }
    if (t.closest('[data-open-filtros]')) {
      const btn = t.closest('[data-open-filtros]');
      btn.setAttribute('aria-expanded', 'true');
      Overlay.abrir($('[data-filtros-fondo]'), { panel: $('#filtros'), opener: btn, alCerrar: () => btn.setAttribute('aria-expanded', 'false') });
      return;
    }
    if (t.closest('[data-close-filtros]') || t.closest('[data-filtros-fondo]')) { Overlay.cerrar($('#filtros')); return; }
    if (t.closest('[data-limpiar]')) { aplicarPreset({}); return; }
    if (t.closest('[data-close-qv]')) { Overlay.cerrar($('[data-qv-fondo]')); return; }
    if (t.closest('[data-ver-mas]')) { const antes = Catalogo.visibles; Catalogo.visibles += POR_PAGINA; renderCatalogo({ reiniciar: false, yaVistos: antes }); return; }
    if (t.closest('[data-ir-buscar]')) { irA('#tienda'); setTimeout(() => $('[data-q]')?.focus({ preventScroll: true }), reduceMotion ? 0 : 600); return; }
    if (t.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (t.closest('[data-ir-pagos]')) { Overlay.cerrar($('#carrito')); setTimeout(() => irA('#pagos'), 200); return; }
    const menos = t.closest('[data-linea-menos]');
    if (menos) { const id = menos.dataset.lineaMenos; const it = Cart.get().find(i => i.id === id); if (it) { Cart.setQty(id, it.qty - 1); renderCarrito(`[data-linea-menos="${id}"]`); } return; }
    const mas = t.closest('[data-linea-mas]');
    if (mas) { const id = mas.dataset.lineaMas; const it = Cart.get().find(i => i.id === id); if (it) { Cart.setQty(id, it.qty + 1); renderCarrito(`[data-linea-mas="${id}"]`); } return; }
    const quitar = t.closest('[data-linea-quitar]');
    if (quitar) {
      const p = getProducto(quitar.dataset.lineaQuitar);
      Cart.remove(quitar.dataset.lineaQuitar);
      if (p) showToast(`Sacaste ${p.nombre} del carrito`);
      ($('[data-linea-quitar]') || $('#carrito [data-close-cart]'))?.focus({ preventScroll: true });
      return;
    }
    const accion = t.closest('[data-ticket-accion]');
    if (accion) { if (accion.dataset.modo === 'ejemplo') agregar(getProducto('rosa-cristal'), 1, accion); else abrirCarrito(accion); return; }
    const ancla = t.closest('a[href^="#"]');
    if (ancla && ancla.getAttribute('href').length > 1 && !e.defaultPrevented) {
      e.preventDefault();
      irA(ancla.getAttribute('href'));
    }
  });
}

function boot() {
  prepararProductos();
  const productoURL = leerURL();
  initModelBarScroll();
  initNav();
  initRecortesEstaticos();
  initCirculos();
  initColecciones();
  initRail();
  renderChips();
  renderFiltros();
  renderCatalogo();
  initCatalogoEventos();
  initPagos();
  renderPagos();
  renderCarrito();
  initQVEventos();
  initClicks();
  initReveals();
  initMundos();
  initHeroMsgs();
  initHeroMotion();
  initFloats();
  updateCartBadge(false);
  initWspLinks();
  initMapa();
  initFormsDemo();
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); renderPagos(); });
  document.addEventListener('prefs:updated', () => { renderPagos(); renderCarrito(); });
  window.addEventListener('storage', e => {
    if (!e.key || !e.key.startsWith('meencanto_')) return;
    updateCartBadge(false);
    renderCarrito();
    renderPagos();
  });
  if (productoURL && getProducto(productoURL)) setTimeout(() => abrirQV(productoURL), 300);
}

boot();
