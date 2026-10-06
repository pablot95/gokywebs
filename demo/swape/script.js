document.documentElement.classList.add('js');

const WSP = '5491123629020';
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
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const clamp01 = v => Math.min(1, Math.max(0, v));
const wspLink = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const offModelos = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
const cuantos = n => `${n} ${n === 1 ? 'artículo' : 'artículos'}`;
const cap = s => String(s).charAt(0).toUpperCase() + String(s).slice(1);
const fmtMl = ml => (ml >= 1000 ? `${(ml / 1000).toLocaleString('es-AR', { maximumFractionDigits: 2 })} L` : `${ml} ml`);
const fmtM = cm => `${(cm / 100).toLocaleString('es-AR', { maximumFractionDigits: 1 })} m`;
const listaY = arr => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} y ${arr[arr.length - 1]}`);

const FOTOS = {
  botella: ['botella.webp', 1080, 1920],
  auris: ['auriculares.webp', 1586, 892],
  cont: ['contenedores.webp', 1178, 1178],
  vaso: ['vaso-termico.webp', 1172, 1172],
  llav: ['llaveros.webp', 1200, 1200],
  aro: ['ring-light.webp', 1174, 1174]
};

const CATEGORIAS = [
  { id: 'vasos', nombre: 'Vasos y botellas', corto: 'Vasos y botellas', tinte: 'var(--pastel-lila)', sticker: ['vaso', [0.44, 0.48, 1.3]], tile: ['vaso', [0.45, 0.55, 1.05]] },
  { id: 'tecno', nombre: 'Tecnología', corto: 'Tecnología', tinte: 'var(--pastel-celeste)', sticker: ['auris', [0.58, 0.58, 1.2]], tile: ['aro', [0.52, 0.5, 1.05]] },
  { id: 'cocina', nombre: 'Cocina y orden', corto: 'Cocina', tinte: 'var(--pastel-verde)', sticker: ['cont', [0.5, 0.5, 1.05]], tile: ['cont', [0.5, 0.5, 1]] },
  { id: 'personajes', nombre: 'Llaveros de personajes', corto: 'Llaveros', tinte: 'var(--pastel-rosa)', sticker: ['llav', [0.66, 0.7, 2.1]], tile: ['llav', [0.52, 0.62, 1.15]] }
];

const PRECIOS = [
  ['0-5000', 'Hasta $5.000'],
  ['5001-10000', '$5.000 a $10.000'],
  ['10001-20000', '$10.000 a $20.000'],
  ['20001-999999999', 'Más de $20.000']
];

const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const nombreCat = id => getCategoria(id)?.nombre || '';
const dims = k => (FOTOS[k] ? [FOTOS[k][1], FOTOS[k][2]] : [1, 1]);

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

function imgTag(k, alt = '') {
  const [w, h] = dims(k);
  return `<img src="images/${FOTOS[k]?.[0] || ''}" width="${w}" height="${h}" alt="${esc(alt)}">`;
}

const Servidor = (() => {
  const API_MAX = 100;
  const BD = [
    { id: 'llavero-stitch', ref: 'SW-5101', nombre: 'Llavero 3D de silicona · Stitch', corto: 'el llavero suelto', cat: 'personajes', grupo: 'llaveros', variante: 'Stitch', precio: 3990, stock: 24, img: 'llav', foco: [0.66, 0.69, 2.6], rank: 1,
      desc: 'Personaje de silicona con relieve, correa de color y argolla dorada. Entra en la mochila, la cartuchera o el llavero de casa.',
      ficha: [['Material', 'Silicona 3D'], ['Alto del personaje', '7 cm aprox.'], ['Correa', 'Silicona con remache']], num: { u: 1 },
      tags: 'llavero stitch personaje silicona azul regalo mochila' },
    { id: 'vaso-lila', ref: 'SW-2102', nombre: 'Vaso térmico 1,2 L con manija · lila', corto: 'el vaso térmico', cat: 'vasos', grupo: 'vasos-termicos', variante: 'Lila', precio: 18990, stock: 12, img: 'vaso', foco: [0.44, 0.5, 1.15], rank: 2,
      desc: 'Acero inoxidable de doble pared, tapa giratoria y bombilla. Entra en el portavasos del auto y la manija lo hace fácil de llevar.',
      ficha: [['Capacidad', '1,2 L'], ['Material', 'Acero inoxidable de doble pared'], ['Frío', 'Hasta 12 h aprox.'], ['Caliente', 'Hasta 6 h aprox.'], ['Tapa', 'Giratoria con bombilla']], num: { ml: 1200, termico: 1 },
      tags: 'vaso termico taza mate cafe agua fria stanley manija bombilla lila violeta' },
    { id: 'set-contenedores', ref: 'SW-4100', nombre: 'Set de 3 contenedores de vidrio herméticos', corto: 'el set de 3', cat: 'cocina', grupo: 'contenedores', variante: 'Set x 3', precio: 18490, stock: 15, img: 'cont', foco: [0.5, 0.5, 1], rank: 3,
      desc: 'Tres contenedores de vidrio con tapa de traba en rosa, verde y celeste: 640 ml, 1 L y 1,5 L. Se apilan en la heladera y van al microondas sin la tapa.',
      ficha: [['Piezas', '3: 640 ml, 1 L y 1,5 L'], ['Material', 'Vidrio templado'], ['Tapa', 'Traba en los 4 lados con burlete'], ['Uso', 'Heladera, freezer y microondas sin tapa']], num: { ml: 3140, piezas: 3 }, partes: ['cont-640', 'cont-1l', 'cont-15l'],
      tags: 'contenedor tupper taper hermetico vidrio vianda heladera freezer microondas set juego' },
    { id: 'aro-26', ref: 'SW-3201', nombre: 'Aro de luz LED 26 cm con trípode', corto: 'el aro de 26 cm', cat: 'tecno', grupo: 'aros', variante: '26 cm', precio: 21990, stock: 9, img: 'aro', foco: [0.5, 0.5, 1], rank: 4,
      desc: 'Para videos, clases en vivo y fotos de producto: luz pareja de frente, soporte para el celular y trípode que se estira.',
      ficha: [['Diámetro del aro', '26 cm'], ['Trípode', 'Hasta 1,6 m'], ['Tonos de luz', '3: frío, neutro y cálido'], ['Intensidad', '10 niveles'], ['Alimentación', 'USB']], num: { cm: 26, tripode: 160 },
      tags: 'aro de luz ring light anillo led tripode selfie video tiktok streaming maquillaje' },
    { id: 'auris-air', ref: 'SW-3101', nombre: 'Auriculares inalámbricos con estuche de carga', corto: 'los Air', cat: 'tecno', grupo: 'auriculares', variante: 'Air', precio: 16990, stock: 18, img: 'auris', foco: [0.56, 0.58, 1], rank: 5,
      desc: 'Bluetooth 5.3: se conectan solos al abrir el estuche. Micrófono para llamadas y control con un toque.',
      ficha: [['Batería', '4 h por carga'], ['Con el estuche', '20 h'], ['Bluetooth', '5.3'], ['Cancelación de ruido', 'No'], ['Carga', 'USB-C']], num: { bat: 4, estuche: 20, anc: 0 },
      tags: 'auriculares inalambricos bluetooth earbuds tws celular musica llamadas air' },
    { id: 'llaveros-pack', ref: 'SW-5100', nombre: 'Pack de 4 llaveros 3D de personajes', corto: 'el pack de 4', cat: 'personajes', grupo: 'llaveros', variante: 'Pack x 4', precio: 13990, stock: 10, img: 'llav', foco: [0.5, 0.55, 1], rank: 6,
      desc: 'Stitch, Angel, Kuromi y Melody, cada uno con su correa de color. Para repartir o para colgar los cuatro.',
      ficha: [['Unidades', '4'], ['Personajes', 'Stitch, Angel, Kuromi y Melody'], ['Material', 'Silicona 3D']], num: { u: 4 },
      tags: 'llaveros pack combo personajes stitch angel kuromi melody regalo souvenir' },
    { id: 'vaso-rosa', ref: 'SW-2104', nombre: 'Vaso térmico 1,2 L con manija · rosa', corto: 'el vaso térmico rosa', cat: 'vasos', grupo: 'vasos-termicos', variante: 'Rosa', precio: 18990, stock: 7, img: 'vaso', foco: [0.72, 0.36, 2], rank: 7,
      desc: 'El mismo vaso de doble pared, en rosa. Tapa giratoria, bombilla y manija.',
      ficha: [['Capacidad', '1,2 L'], ['Material', 'Acero inoxidable de doble pared'], ['Frío', 'Hasta 12 h aprox.'], ['Caliente', 'Hasta 6 h aprox.'], ['Tapa', 'Giratoria con bombilla']], num: { ml: 1200, termico: 1 },
      tags: 'vaso termico taza stanley manija bombilla rosa' },
    { id: 'cont-1l', ref: 'SW-4102', nombre: 'Contenedor de vidrio hermético 1 L · tapa verde', corto: 'el de 1 L', cat: 'cocina', grupo: 'contenedores', variante: '1 L', precio: 7290, stock: 20, img: 'cont', foco: [0.52, 0.56, 1.7], rank: 8,
      desc: 'El tamaño de la vianda: entra una porción con guarnición. Tapa verde con traba en los cuatro lados.',
      ficha: [['Capacidad', '1 L'], ['Material', 'Vidrio templado'], ['Tapa', 'Traba en los 4 lados con burlete'], ['Uso', 'Heladera, freezer y microondas sin tapa']], num: { ml: 1000, piezas: 1 },
      tags: 'contenedor tupper taper hermetico vidrio vianda 1 litro verde' },
    { id: 'aro-33', ref: 'SW-3202', nombre: 'Aro de luz LED 33 cm con trípode de 2,1 m', corto: 'el aro de 33 cm', cat: 'tecno', grupo: 'aros', variante: '33 cm', precio: 27990, stock: 5, nuevo: true, img: 'aro', foco: [0.53, 0.3, 1.3], rank: 9,
      desc: 'Más aro y más altura: ilumina de cuerpo entero y el trípode llega a 2,1 m. Soporte para el celular incluido.',
      ficha: [['Diámetro del aro', '33 cm'], ['Trípode', 'Hasta 2,1 m'], ['Tonos de luz', '3: frío, neutro y cálido'], ['Intensidad', '10 niveles'], ['Alimentación', 'USB']], num: { cm: 33, tripode: 210 },
      tags: 'aro de luz ring light anillo led tripode grande video tiktok streaming' },
    { id: 'botella-1l', ref: 'SW-2101', nombre: 'Botella motivacional degradé 1 L', corto: 'la botella', cat: 'vasos', grupo: 'botellas', variante: 'Rosa y celeste', precio: 7490, antes: 8990, stock: 30, img: 'botella', foco: [0.5, 0.6, 1], rank: 10,
      desc: 'Plástico libre de BPA con terminación mate, tapa con traba y correa para llevarla colgada. Un litro para todo el día.',
      ficha: [['Capacidad', '1 L'], ['Material', 'Plástico libre de BPA'], ['Tapa', 'Con traba y correa'], ['Térmica', 'No']], num: { ml: 1000, termico: 0 },
      tags: 'botella agua motivacional degrade gimnasio facultad correa rosa celeste' },
    { id: 'llavero-kuromi', ref: 'SW-5102', nombre: 'Llavero 3D de silicona · Kuromi', corto: 'el llavero de Kuromi', cat: 'personajes', grupo: 'llaveros', variante: 'Kuromi', precio: 3990, stock: 16, img: 'llav', foco: [0.17, 0.7, 2.7], rank: 11,
      desc: 'Kuromi en silicona con relieve, correa violeta y argolla dorada.',
      ficha: [['Material', 'Silicona 3D'], ['Alto del personaje', '7 cm aprox.'], ['Correa', 'Silicona con remache']], num: { u: 1 },
      tags: 'llavero kuromi personaje silicona negro regalo' },
    { id: 'vaso-crema', ref: 'SW-2105', nombre: 'Vaso térmico 1,2 L con manija · crema', corto: 'el vaso térmico crema', cat: 'vasos', grupo: 'vasos-termicos', variante: 'Crema', precio: 16990, antes: 18990, stock: 4, img: 'vaso', foco: [0.9, 0.56, 1.9], rank: 12,
      desc: 'El vaso de doble pared en crema, el color más pedido para la oficina.',
      ficha: [['Capacidad', '1,2 L'], ['Material', 'Acero inoxidable de doble pared'], ['Frío', 'Hasta 12 h aprox.'], ['Caliente', 'Hasta 6 h aprox.'], ['Tapa', 'Giratoria con bombilla']], num: { ml: 1200, termico: 1 },
      tags: 'vaso termico taza stanley manija bombilla crema beige blanco' },
    { id: 'cont-640', ref: 'SW-4101', nombre: 'Contenedor de vidrio hermético 640 ml · tapa rosa', corto: 'el de 640 ml', cat: 'cocina', grupo: 'contenedores', variante: '640 ml', precio: 5990, stock: 22, img: 'cont', foco: [0.5, 0.24, 1.8], rank: 13,
      desc: 'Para la fruta cortada, las salsas o lo que sobró de la cena. Tapa rosa con traba.',
      ficha: [['Capacidad', '640 ml'], ['Material', 'Vidrio templado'], ['Tapa', 'Traba en los 4 lados con burlete'], ['Uso', 'Heladera, freezer y microondas sin tapa']], num: { ml: 640, piezas: 1 },
      tags: 'contenedor tupper taper hermetico vidrio chico rosa' },
    { id: 'soporte-celu', ref: 'SW-3203', nombre: 'Soporte de celular para trípode', corto: 'el soporte', cat: 'tecno', grupo: 'soportes', variante: 'Universal', precio: 3490, stock: 26, img: 'aro', foco: [0.52, 0.24, 2.6], rank: 14,
      desc: 'Pinza con rosca universal: sostiene el celular en vertical u horizontal en cualquier trípode.',
      ficha: [['Rosca', 'Universal 1/4"'], ['Celulares', 'De 5,5 a 7"'], ['Giro', '360°']], num: {},
      tags: 'soporte celular pinza clip tripode holder' },
    { id: 'auris-pro', ref: 'SW-3102', nombre: 'Auriculares inalámbricos Pro con cancelación de ruido', corto: 'los Pro', cat: 'tecno', grupo: 'auriculares', variante: 'Pro', precio: 24990, antes: 27990, stock: 8, nuevo: true, img: 'auris', foco: [0.58, 0.42, 1.45], rank: 15,
      desc: 'Cancelación de ruido para el colectivo o la oficina, 6 h de batería y estuche con carga para 24 h.',
      ficha: [['Batería', '6 h por carga'], ['Con el estuche', '24 h'], ['Bluetooth', '5.3'], ['Cancelación de ruido', 'Sí'], ['Resistencia al agua', 'IPX4']], num: { bat: 6, estuche: 24, anc: 1 },
      tags: 'auriculares inalambricos bluetooth pro cancelacion ruido anc earbuds' },
    { id: 'llavero-melody', ref: 'SW-5103', nombre: 'Llavero 3D de silicona · Melody', corto: 'el llavero de Melody', cat: 'personajes', grupo: 'llaveros', variante: 'Melody', precio: 3990, stock: 0, img: 'llav', foco: [0.4, 0.72, 2.8], rank: 16,
      desc: 'Melody con su moño rosa, en silicona con relieve y correa rosa.',
      ficha: [['Material', 'Silicona 3D'], ['Alto del personaje', '7 cm aprox.'], ['Correa', 'Silicona con remache']], num: { u: 1 },
      tags: 'llavero melody personaje silicona blanco rosa regalo' },
    { id: 'vaso-negro', ref: 'SW-2103', nombre: 'Vaso térmico 1,2 L con manija · negro', corto: 'el vaso térmico negro', cat: 'vasos', grupo: 'vasos-termicos', variante: 'Negro', precio: 18990, stock: 9, img: 'vaso', foco: [0.12, 0.46, 1.9], rank: 17,
      desc: 'El vaso de doble pared en negro mate. Tapa giratoria, bombilla y manija.',
      ficha: [['Capacidad', '1,2 L'], ['Material', 'Acero inoxidable de doble pared'], ['Frío', 'Hasta 12 h aprox.'], ['Caliente', 'Hasta 6 h aprox.'], ['Tapa', 'Giratoria con bombilla']], num: { ml: 1200, termico: 1 },
      tags: 'vaso termico taza stanley manija bombilla negro' },
    { id: 'cont-15l', ref: 'SW-4103', nombre: 'Contenedor de vidrio hermético 1,5 L · tapa celeste', corto: 'el de 1,5 L', cat: 'cocina', grupo: 'contenedores', variante: '1,5 L', precio: 8490, stock: 14, img: 'cont', foco: [0.5, 0.84, 1.7], rank: 18,
      desc: 'El grande: para la comida de la semana o una tarta entera. Tapa celeste con traba.',
      ficha: [['Capacidad', '1,5 L'], ['Material', 'Vidrio templado'], ['Tapa', 'Traba en los 4 lados con burlete'], ['Uso', 'Heladera, freezer y microondas sin tapa']], num: { ml: 1500, piezas: 1 },
      tags: 'contenedor tupper taper hermetico vidrio grande celeste' }
  ];

  const porId = new Map(BD.map(p => [p.id, p]));
  const textos = new Map();
  const texto = p => {
    if (!textos.has(p.id)) {
      const t = norm([p.nombre, p.ref, p.ref.replace('-', ''), p.ref.split('-')[1], nombreCat(p.cat), p.variante, p.desc, p.tags].join(' '));
      textos.set(p.id, { t, w: t.split(/[^a-z0-9]+/).filter(Boolean) });
    }
    return textos.get(p.id);
  };
  const enRango = (p, k) => { const [a, b] = k.split('-').map(Number); return p.precio >= a && p.precio <= b; };

  const preparar = (f = {}) => ({
    cats: Array.isArray(f.cats) ? f.cats.filter(c => getCategoria(c)) : [],
    precios: Array.isArray(f.precios) ? f.precios.filter(k => PRECIOS.some(([x]) => x === k)) : [],
    oferta: !!f.oferta,
    nuevo: !!f.nuevo,
    stock: !!f.stock,
    terminos: norm(f.q || '').replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 8)
  });

  const cumple = (p, f, salvo = '') => {
    if (salvo !== 'cats' && f.cats.length && !f.cats.includes(p.cat)) return false;
    if (salvo !== 'precios' && f.precios.length && !f.precios.some(k => enRango(p, k))) return false;
    if (salvo !== 'oferta' && f.oferta && !(p.antes > 0)) return false;
    if (salvo !== 'nuevo' && f.nuevo && !p.nuevo) return false;
    if (salvo !== 'stock' && f.stock && !(p.stock > 0)) return false;
    if (f.terminos.length) {
      const { t, w } = texto(p);
      if (!f.terminos.every(x => (x.length <= 2 ? w.includes(x) : t.includes(x)))) return false;
    }
    return true;
  };

  const ordenar = (lista, orden) => {
    const l = lista.slice();
    if (orden === 'menor') return l.sort((a, b) => a.precio - b.precio || a.rank - b.rank);
    if (orden === 'mayor') return l.sort((a, b) => b.precio - a.precio || a.rank - b.rank);
    if (orden === 'nuevos') return l.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || a.rank - b.rank);
    return l.sort((a, b) => a.rank - b.rank);
  };

  const copia = p => JSON.parse(JSON.stringify(p));
  const tope = n => Math.max(1, Math.min(API_MAX, Math.floor(Number(n)) || 16));

  return {
    API_MAX,
    productos(params = {}) {
      const limite = tope(params.limite);
      const desde = Math.max(0, parseInt(params.cursor, 10) || 0);
      const f = preparar(params);
      const lista = ordenar(BD.filter(p => cumple(p, f)), params.orden);
      const items = lista.slice(desde, desde + limite).map(copia);
      const fin = desde + items.length;
      return { items, total: lista.length, siguiente: fin < lista.length ? String(fin) : null };
    },
    producto(id) {
      const p = porId.get(id);
      return p ? copia(p) : null;
    },
    porIds(ids = []) {
      return [...new Set(ids)].slice(0, API_MAX).map(id => porId.get(id)).filter(Boolean).map(copia);
    },
    hermanos(id) {
      const p = porId.get(id);
      if (!p) return [];
      return ordenar(BD.filter(x => x.grupo === p.grupo), 'vendidos').map(copia);
    },
    relacionados(id, limite = 3) {
      const p = porId.get(id);
      if (!p) return [];
      const otros = BD.filter(x => x.id !== id && x.stock > 0 && x.grupo !== p.grupo);
      const misma = ordenar(otros.filter(x => x.cat === p.cat), 'vendidos');
      const resto = ordenar(otros.filter(x => x.cat !== p.cat), 'vendidos');
      return misma.concat(resto).slice(0, tope(limite)).map(copia);
    },
    conteos(params = {}) {
      const f = preparar(params);
      const cuenta = (salvo, pred) => BD.reduce((n, p) => n + (cumple(p, f, salvo) && pred(p) ? 1 : 0), 0);
      return {
        total: cuenta('', () => true),
        cats: Object.fromEntries(CATEGORIAS.map(c => [c.id, cuenta('cats', p => p.cat === c.id)])),
        precios: Object.fromEntries(PRECIOS.map(([k]) => [k, cuenta('precios', p => enRango(p, k))])),
        oferta: cuenta('oferta', p => p.antes > 0),
        nuevo: cuenta('nuevo', p => !!p.nuevo),
        stock: cuenta('stock', p => p.stock > 0)
      };
    },
    resumen() {
      const cats = {};
      const desde = {};
      CATEGORIAS.forEach(c => {
        const l = BD.filter(p => p.cat === c.id);
        cats[c.id] = l.length;
        desde[c.id] = Math.min(...l.map(p => p.precio));
      });
      const precios = Object.fromEntries(PRECIOS.map(([k]) => [k, BD.filter(p => enRango(p, k)).length]));
      return { total: BD.length, cats, desde, precios, min: Math.min(...BD.map(p => p.precio)) };
    }
  };
})();

function pedirPagina(params) {
  const r = Servidor.productos(params);
  if (!r || !Array.isArray(r.items) || r.items.length > Servidor.API_MAX) throw new Error('La respuesta de productos supera el tope de 100.');
  return r;
}

const getProducto = id => Servidor.producto(id);
const descuentoDe = p => (p.antes > 0 ? Math.round((1 - p.precio / p.antes) * 100) : 0);

function precioUnidad(p) {
  if (p.num?.ml) return { v: p.precio / (p.num.ml / 1000), txt: 'el litro', por: 'litro' };
  if (p.num?.u > 1) return { v: p.precio / p.num.u, txt: 'cada uno', por: 'unidad' };
  return null;
}

const ICONO_CARRITO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICONO_CAMPANA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" stroke-linejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" stroke-linecap="round"/></svg>';
const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function etiquetaHTML(p) {
  return `<span class="etiqueta"><span class="etiqueta-ref">${esc(p.ref)}</span><span class="etiqueta-precio">${formatearPrecio(p.precio)}</span>${p.antes > 0 ? `<s class="etiqueta-antes">${formatearPrecio(p.antes)}</s>` : ''}</span>`;
}

function badgesHTML(p) {
  const b = [];
  if (!(p.stock > 0)) b.push('<span class="badge badge--agotado">Sin stock</span>');
  else {
    if (p.antes > 0) b.push(`<span class="badge badge--oferta">-${descuentoDe(p)}%</span>`);
    if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
    if (p.stock <= 5) b.push(`<span class="badge">Quedan ${p.stock}</span>`);
  }
  return b.join('');
}

function avisoLink(p) {
  return wspLink(`Hola Swape! Avisame cuando vuelva: ${p.nombre} (ref. ${p.ref}).`);
}

function accionHTML(p) {
  if (!(p.stock > 0)) return `<a class="card-add card-add--aviso" href="${esc(avisoLink(p))}" target="_blank" rel="noopener" aria-label="Avisame cuando vuelva: ${esc(p.nombre)}"><span class="card-add-t">Avisame</span>${ICONO_CAMPANA}</a>`;
  return `<button type="button" class="card-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"><span class="card-add-t">Agregar</span>${ICONO_CARRITO}</button>`;
}

function cardHTML(p, anim = true) {
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const agotado = !(p.stock > 0);
  return `<li class="card-wrap"${a}>
    <article class="card${agotado ? ' card--agotado' : ''}" data-id="${p.id}">
      <button type="button" class="card-foto recorte" data-quick="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}" style="${recorte(p.img, p.foco)}">${imgTag(p.img, p.nombre)}</button>
      ${etiquetaHTML(p)}
      <span class="card-badges">${badgesHTML(p)}</span>
      <div class="card-info">
        <p class="card-linea">${esc(nombreCat(p.cat))}</p>
        <div class="card-fila">
          <h3 class="card-nombre">${esc(p.nombre)}</h3>
          ${accionHTML(p)}
        </div>
      </div>
    </article>
  </li>`;
}

let toastWrap = null;
function showToast(msg) {
  if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.className = 'toast-wrap'; toastWrap.setAttribute('aria-live', 'polite'); document.body.appendChild(toastWrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  toastWrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const Cart = {
  KEY: 'swape_cart',
  memoria: [],
  sinStorage: false,
  leer() {
    let items = this.memoria;
    if (!this.sinStorage) {
      try { const v = JSON.parse(localStorage.getItem(this.KEY)); items = Array.isArray(v) ? v : []; } catch { items = this.memoria; }
    }
    return Array.isArray(items) ? items : [];
  },
  get() {
    const crudo = this.leer().filter(i => i && typeof i.id === 'string' && i.qty > 0);
    const prods = new Map(Servidor.porIds(crudo.map(i => i.id)).map(p => [p.id, p]));
    const vistos = new Set();
    return crudo.filter(i => {
      const p = prods.get(i.id);
      if (!p || !(p.stock > 0) || vistos.has(i.id)) return false;
      vistos.add(i.id);
      return true;
    }).map(i => ({ id: i.id, qty: Math.min(Math.floor(i.qty), prods.get(i.id).stock), prod: prods.get(i.id) }));
  },
  save(items) {
    const limpio = items.map(({ id, qty }) => ({ id, qty }));
    this.memoria = limpio;
    try { localStorage.setItem(this.KEY, JSON.stringify(limpio)); } catch { this.sinStorage = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(id, qty = 1) {
    const prod = getProducto(id);
    if (!prod || !(prod.stock > 0)) return 0;
    const items = this.get();
    const it = items.find(i => i.id === id);
    const antes = it ? it.qty : 0;
    const nuevo = Math.min(antes + Math.max(1, Math.floor(qty) || 1), prod.stock);
    if (it) it.qty = nuevo; else items.push({ id, qty: nuevo });
    this.save(items);
    return nuevo - antes;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(Math.floor(qty) || 1, it.prod.stock));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.prod.precio * i.qty, 0); }
};

function avisarAgregado(p, sumados) {
  if (!p) return;
  if (sumados > 0) showToast(`Sumaste ${p.nombre} al carrito`);
  else showToast(`Ya tenés todo el stock disponible de ${p.nombre}`);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const hayOverlay = () => !!document.querySelector('.main-nav.open, .drawer.is-open, .modal.is-open, .filtros.open');
function liberarScroll() { if (!hayOverlay()) document.body.classList.remove('no-scroll'); }

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden');
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function cerrarNavSiAbierto() {
  const nav = document.getElementById('mainNav');
  if (nav?.classList.contains('open')) document.getElementById('navClose')?.click();
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
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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

let revealsListos = false;
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

function fillDatos() {
  const r = Servidor.resumen();
  document.querySelectorAll('[data-precio-min]').forEach(el => { el.textContent = formatearPrecio(r.min); });
  document.querySelectorAll('[data-n-productos]').forEach(el => { el.textContent = cuantos(r.total); });
  document.querySelectorAll('[data-tag-de]').forEach(el => {
    const p = getProducto(el.dataset.tagDe);
    if (!p) return;
    el.querySelector('.etiqueta-ref').textContent = p.ref;
    el.querySelector('.etiqueta-precio').textContent = formatearPrecio(p.precio);
  });
}

function initStickers() {
  const ul = document.getElementById('stickers');
  if (!ul) return;
  const r = Servidor.resumen();
  ul.innerHTML = CATEGORIAS.map(c => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
    <a class="sticker" href="?cat=${c.id}#tienda" data-cat="${c.id}">
      <span class="sticker-foto-wrap"><span class="sticker-foto recorte" style="${recorte(c.sticker[0], c.sticker[1])}">${imgTag(c.sticker[0], '')}</span><span class="sticker-n" aria-hidden="true">${r.cats[c.id]}</span></span>
      <span class="sticker-nombre">${esc(c.corto)}</span>
      <span class="sticker-desde">desde ${formatearPrecio(r.desde[c.id])}</span>
      <span class="sr-only">${cuantos(r.cats[c.id])}</span>
    </a>
  </li>`).join('');
}

function initTagsPrecio() {
  const ul = document.getElementById('tagsPrecio');
  if (!ul) return;
  const r = Servidor.resumen();
  ul.innerHTML = PRECIOS.map(([k, txt]) => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
    <a class="tag-precio" href="?precio=${k}#tienda" data-precio="${k}"><b>${esc(txt)}</b><small>${cuantos(r.precios[k] || 0)}</small></a>
  </li>`).join('');
}

function initColecciones() {
  const ul = document.getElementById('colecciones');
  if (!ul) return;
  const r = Servidor.resumen();
  ul.innerHTML = CATEGORIAS.map(c => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">
    <a class="coleccion" href="?cat=${c.id}#tienda" data-cat="${c.id}" style="--c-tinte:${c.tinte}">
      <span class="coleccion-foto recorte" style="${recorte(c.tile[0], c.tile[1], 0.8)}">${imgTag(c.tile[0], '')}</span>
      <span class="sticker-n" aria-hidden="true">${r.cats[c.id]}</span>
      <span class="coleccion-texto">
        <span class="coleccion-nombre">${esc(c.nombre)}</span>
        <span class="coleccion-dato">${cuantos(r.cats[c.id])} · desde ${formatearPrecio(r.desde[c.id])}</span>
        <span class="coleccion-ir">Ver todo ${FLECHA}</span>
      </span>
    </a>
  </li>`).join('');
}

const PASO = 16;
const FILTROS_VACIOS = { q: '', cats: [], precios: [], oferta: false, nuevo: false, stock: false };
const estado = { q: '', cats: [], precios: [], oferta: false, nuevo: false, stock: false, orden: 'vendidos', siguiente: null, total: 0, mostrados: 0 };
const ORDENES = ['vendidos', 'menor', 'mayor', 'nuevos'];
const filtrosActuales = () => ({ q: estado.q, cats: estado.cats.slice(), precios: estado.precios.slice(), oferta: estado.oferta, nuevo: estado.nuevo, stock: estado.stock, orden: estado.orden });

function leerUrl() {
  const u = new URLSearchParams(location.search);
  return {
    cats: (u.get('cat') || '').split(',').filter(c => getCategoria(c)),
    precios: (u.get('precio') || '').split(',').filter(k => PRECIOS.some(([x]) => x === k)),
    q: (u.get('q') || '').slice(0, 60),
    orden: ORDENES.includes(u.get('orden')) ? u.get('orden') : 'vendidos',
    producto: u.get('producto') || ''
  };
}

function escribirUrl() {
  const u = new URLSearchParams(location.search);
  ['cat', 'precio', 'q', 'orden'].forEach(k => u.delete(k));
  if (estado.cats.length) u.set('cat', estado.cats.join(','));
  if (estado.precios.length) u.set('precio', estado.precios.join(','));
  if (estado.q) u.set('q', estado.q);
  if (estado.orden !== 'vendidos') u.set('orden', estado.orden);
  const qs = u.toString();
  window.history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
}

function cargarCatalogo({ agregar = false } = {}) {
  const grilla = document.getElementById('grilla');
  if (!grilla) return;
  const r = pedirPagina({ ...filtrosActuales(), cursor: agregar ? estado.siguiente : null, limite: PASO });
  const html = r.items.map(p => cardHTML(p)).join('');
  if (agregar) { grilla.insertAdjacentHTML('beforeend', html); estado.mostrados += r.items.length; }
  else { grilla.innerHTML = html; estado.mostrados = r.items.length; }
  estado.siguiente = r.siguiente;
  estado.total = r.total;
  pintarEstadoTienda();
  revelarNuevos(grilla);
  refrescar();
}

function pintarEstadoTienda() {
  const vacio = document.getElementById('tiendaVacio');
  const grilla = document.getElementById('grilla');
  const pie = document.querySelector('.tienda-pie');
  const verMas = document.getElementById('verMas');
  const progreso = document.getElementById('tiendaProgreso');
  const n = document.getElementById('tiendaN');
  const nTxt = document.getElementById('tiendaNTxt');
  if (n) n.textContent = estado.total;
  if (nTxt) nTxt.textContent = estado.total === 1 ? 'artículo' : 'artículos';
  if (vacio) {
    vacio.hidden = estado.total > 0;
    const vq = document.getElementById('vacioQ');
    if (vq) vq.textContent = estado.q ? `«${estado.q}»` : 'eso';
    const vw = document.getElementById('vacioWsp');
    if (vw) vw.href = wspLink(`Hola Swape! Busco ${estado.q ? `«${estado.q}»` : 'un artículo'} y no lo vi en la tienda. ¿Lo tienen?`);
  }
  if (grilla) grilla.hidden = estado.total === 0;
  if (pie) pie.hidden = estado.total === 0;
  if (verMas) verMas.hidden = !estado.siguiente;
  if (progreso) {
    progreso.textContent = `Mostrando ${estado.mostrados} de ${estado.total}`;
    progreso.style.setProperty('--avance', `${estado.total ? Math.round((estado.mostrados / estado.total) * 100) : 0}%`);
  }
  pintarFacetas();
  pintarActivos();
  sincronizarControles();
}

function pintarFacetas() {
  const c = Servidor.conteos(filtrosActuales());
  document.querySelectorAll('[data-fn-cat]').forEach(el => {
    const v = c.cats[el.dataset.fnCat] ?? 0;
    el.textContent = v;
    el.closest('.f-check')?.classList.toggle('is-cero', v === 0);
  });
  document.querySelectorAll('[data-fn-precio]').forEach(el => {
    const v = c.precios[el.dataset.fnPrecio] ?? 0;
    el.textContent = v;
    el.closest('.f-check')?.classList.toggle('is-cero', v === 0);
  });
  ['oferta', 'nuevo', 'stock'].forEach(k => {
    const el = document.querySelector(`[data-fn="${k}"]`);
    if (el) { el.textContent = c[k]; el.closest('.f-check')?.classList.toggle('is-cero', c[k] === 0); }
  });
  document.querySelectorAll('[data-chip-n]').forEach(el => {
    const id = el.dataset.chipN;
    el.textContent = id ? (c.cats[id] ?? 0) : '';
  });
  document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = c.total; });
  const activos = estado.cats.length + estado.precios.length + (estado.oferta ? 1 : 0) + (estado.nuevo ? 1 : 0) + (estado.stock ? 1 : 0);
  document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = activos; el.hidden = activos === 0; });
}

function pintarActivos() {
  const ul = document.getElementById('activos');
  if (!ul) return;
  const chips = [];
  if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
  estado.cats.forEach(c => chips.push(['cat', c, nombreCat(c)]));
  estado.precios.forEach(k => chips.push(['precio', k, PRECIOS.find(([x]) => x === k)?.[1] || '']));
  if (estado.oferta) chips.push(['oferta', '', 'En oferta']);
  if (estado.nuevo) chips.push(['nuevo', '', 'Nuevos']);
  if (estado.stock) chips.push(['stock', '', 'Con stock']);
  ul.innerHTML = chips.map(([t, v, txt]) => `<li class="activo">${esc(txt)}<button type="button" data-quitar-filtro="${t}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(txt)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button></li>`).join('');
  ul.hidden = chips.length === 0;
}

function sincronizarControles() {
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = estado.cats.includes(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = estado.precios.includes(i.value); });
  ['oferta', 'nuevo', 'stock'].forEach(k => { const i = document.querySelector(`input[data-f="${k}"]`); if (i) i.checked = estado[k]; });
  document.querySelectorAll('[data-chip]').forEach(b => {
    const id = b.dataset.chip;
    const on = id ? (estado.cats.length === 1 && estado.cats[0] === id) : estado.cats.length === 0;
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  ['q', 'hq'].forEach(id => {
    const q = document.getElementById(id);
    if (q && document.activeElement !== q) q.value = estado.q;
  });
  const orden = document.getElementById('orden');
  if (orden) orden.value = estado.orden;
}

function aplicar(cambios = {}, { url = true } = {}) {
  Object.assign(estado, cambios);
  cargarCatalogo();
  if (url) escribirUrl();
}

function irATienda(cambios = {}, { foco = false, limpiar = true } = {}) {
  if (limpiar) aplicar({ ...FILTROS_VACIOS, ...cambios });
  else if (Object.keys(cambios).length) aplicar(cambios);
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  if (foco) setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 520);
}

function initCatalogo() {
  const grilla = document.getElementById('grilla');
  if (!grilla) return;
  const fCat = document.getElementById('fCat');
  if (fCat) fCat.innerHTML = CATEGORIAS.map(c => `<label class="f-check"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><em data-fn-cat="${c.id}"></em></label>`).join('');
  const fPrecio = document.getElementById('fPrecio');
  if (fPrecio) fPrecio.innerHTML = PRECIOS.map(([k, txt]) => `<label class="f-check"><input type="checkbox" data-f="precio" value="${k}"><span>${esc(txt)}</span><em data-fn-precio="${k}"></em></label>`).join('');
  const chips = document.getElementById('chipsCat');
  if (chips) chips.innerHTML = '<li><button type="button" class="chip" data-chip="" aria-pressed="true">Todo</button></li>' + CATEGORIAS.map(c => `<li><button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.nombre)}<em data-chip-n="${c.id}"></em></button></li>`).join('');

  const url = leerUrl();
  Object.assign(estado, { cats: url.cats, precios: url.precios, q: url.q, orden: url.orden });
  cargarCatalogo();

  document.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const f = i.dataset.f;
    if (f === 'cat') aplicar({ cats: [...document.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value) });
    else if (f === 'precio') aplicar({ precios: [...document.querySelectorAll('input[data-f="precio"]:checked')].map(x => x.value) });
    else aplicar({ [f]: i.checked });
  });

  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    aplicar({ cats: b.dataset.chip ? [b.dataset.chip] : [] });
  });

  const q = document.getElementById('q');
  let tq = 0;
  q?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => aplicar({ q: q.value.trim().slice(0, 60) }), 260); });
  document.querySelector('[data-tienda-buscar]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); aplicar({ q: (q?.value || '').trim().slice(0, 60) }); q?.blur(); });
  document.getElementById('orden')?.addEventListener('change', e => aplicar({ orden: e.target.value }));

  const hq = document.getElementById('hq');
  let th = 0;
  hq?.addEventListener('input', () => { clearTimeout(th); th = setTimeout(() => aplicar({ q: hq.value.trim().slice(0, 60) }), 260); });
  document.querySelector('[data-header-buscar]')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(th);
    irATienda({ q: (hq?.value || '').trim().slice(0, 60) }, { limpiar: false });
    hq?.blur();
  });

  document.getElementById('verMas')?.addEventListener('click', () => {
    if (!estado.siguiente) return;
    cargarCatalogo({ agregar: true });
  });

  document.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const t = quitar.dataset.quitarFiltro;
      const v = quitar.dataset.valor;
      if (t === 'q') aplicar({ q: '' });
      else if (t === 'cat') aplicar({ cats: estado.cats.filter(c => c !== v) });
      else if (t === 'precio') aplicar({ precios: estado.precios.filter(k => k !== v) });
      else aplicar({ [t]: false });
      return;
    }
    if (e.target.closest('[data-limpiar]')) aplicar({ ...FILTROS_VACIOS });
  });

  initFiltrosCajon();
}

function initFiltrosCajon() {
  const panel = document.getElementById('filtros');
  const abrir = document.querySelector('[data-filtros-abrir]');
  if (!panel || !abrir) return;
  const fondo = document.createElement('div');
  fondo.className = 'filtros-fondo';
  document.body.appendChild(fondo);
  const esCajon = () => !!document.querySelector('.tienda--cajon') || window.matchMedia('(max-width: 1100px)').matches;
  let opener = null;
  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    fondo.classList.remove('open');
    abrir.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', tecla);
    liberarScroll();
    (opener && opener !== document.body && !panel.contains(opener) ? opener : abrir).focus({ preventScroll: true });
  };
  const open = () => {
    if (!esCajon()) return;
    cerrarNavSiAbierto();
    opener = document.activeElement;
    panel.classList.add('open');
    fondo.classList.add('open');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => panel.querySelector('.filtros-cerrar')?.focus(), 60);
  };
  abrir.addEventListener('click', open);
  fondo.addEventListener('click', cerrar);
  panel.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  window.matchMedia('(max-width: 1100px)').addEventListener('change', () => { if (!esCajon()) cerrar(); });
}

function initFiltrosEntrada() {
  const f = document.querySelector('.tienda--lateral .filtros');
  if (!f) return;
  if (reduceMotion || !('IntersectionObserver' in window)) { f.classList.add('is-in'); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { f.classList.add('is-in'); io.disconnect(); }
  }), { threshold: 0 });
  io.observe(f);
}

const FAMILIAS = [
  { id: 'contenedores', nombre: 'Contenedores', ids: ['cont-640', 'cont-1l', 'cont-15l', 'set-contenedores'], a: 'cont-1l', b: 'set-contenedores', por: 'litro', ir: { cats: ['cocina'] }, irTxt: 'Ver los contenedores',
    filas: [
      { k: 'Capacidad', v: p => fmtMl(p.num.ml), n: p => p.num.ml, mejor: 'mayor', txt: (p, o) => `${fmtMl(p.num.ml - o.num.ml)} más` },
      { k: 'Piezas', v: p => String(p.num.piezas), n: () => 0, mejor: null }
    ] },
  { id: 'llaveros', nombre: 'Llaveros', ids: ['llavero-stitch', 'llavero-kuromi', 'llavero-melody', 'llaveros-pack'], a: 'llavero-stitch', b: 'llaveros-pack', por: 'unidad', ir: { cats: ['personajes'] }, irTxt: 'Ver los llaveros',
    filas: [
      { k: 'Unidades', v: p => String(p.num.u), n: () => 0, mejor: null },
      { k: 'Personajes', v: p => (p.num.u > 1 ? 'Stitch, Angel, Kuromi y Melody' : p.variante), n: () => 0, mejor: null }
    ] },
  { id: 'vasos', nombre: 'Vasos y botellas', ids: ['botella-1l', 'vaso-lila'], a: 'botella-1l', b: 'vaso-lila', por: 'litro', ir: { cats: ['vasos'] }, irTxt: 'Ver vasos y botellas',
    filas: [
      { k: 'Capacidad', v: p => fmtMl(p.num.ml), n: p => p.num.ml, mejor: 'mayor', txt: (p, o) => `${fmtMl(p.num.ml - o.num.ml)} más` },
      { k: 'Mantiene la temperatura', v: p => (p.num.termico ? 'Sí, doble pared' : 'No'), n: p => p.num.termico, mejor: 'mayor', txt: () => 'mantiene la temperatura' }
    ] },
  { id: 'aros', nombre: 'Aros de luz', ids: ['aro-26', 'aro-33'], a: 'aro-26', b: 'aro-33', por: null, ir: { q: 'aro de luz' }, irTxt: 'Ver los aros de luz',
    filas: [
      { k: 'Diámetro del aro', v: p => `${p.num.cm} cm`, n: p => p.num.cm, mejor: 'mayor', txt: (p, o) => `un aro ${p.num.cm - o.num.cm} cm más grande` },
      { k: 'Trípode', v: p => `Hasta ${fmtM(p.num.tripode)}`, n: p => p.num.tripode, mejor: 'mayor', txt: p => `trípode de hasta ${fmtM(p.num.tripode)}` },
      { k: 'Tonos de luz', v: () => '3', n: () => 0, mejor: null }
    ] },
  { id: 'auris', nombre: 'Auriculares', ids: ['auris-air', 'auris-pro'], a: 'auris-air', b: 'auris-pro', por: null, ir: { q: 'auriculares' }, irTxt: 'Ver los auriculares',
    filas: [
      { k: 'Batería por carga', v: p => `${p.num.bat} h`, n: p => p.num.bat, mejor: 'mayor', txt: p => `${p.num.bat} h de batería` },
      { k: 'Con el estuche', v: p => `${p.num.estuche} h`, n: p => p.num.estuche, mejor: 'mayor', txt: p => `${p.num.estuche} h con el estuche` },
      { k: 'Cancelación de ruido', v: p => (p.num.anc ? 'Sí' : 'No'), n: p => p.num.anc, mejor: 'mayor', txt: () => 'cancelación de ruido' }
    ] }
];

const ppuDe = (fam, p) => (fam.por === 'litro' ? p.precio / (p.num.ml / 1000) : fam.por === 'unidad' ? p.precio / p.num.u : p.precio);

function ahorroDe(gana, pierde) {
  if (gana.partes?.length) {
    const partes = Servidor.porIds(gana.partes);
    const suma = partes.reduce((s, x) => s + x.precio, 0);
    return suma > gana.precio ? { monto: suma - gana.precio, txt: 'los tres' } : null;
  }
  if (gana.num?.u > 1 && pierde.num?.u === 1) {
    const suma = pierde.precio * gana.num.u;
    return suma > gana.precio ? { monto: suma - gana.precio, txt: gana.num.u === 4 ? 'cuatro' : String(gana.num.u) } : null;
  }
  return null;
}

function compararFamilia(fam, A, B) {
  const filas = fam.filas.map(f => {
    const na = f.n(A);
    const nb = f.n(B);
    let mejor = '';
    if (f.mejor && na !== nb) mejor = (f.mejor === 'mayor' ? na > nb : na < nb) ? 'a' : 'b';
    return { k: f.k, a: f.v(A), b: f.v(B), mejor, fila: f };
  });
  const precio = { k: 'Precio', a: formatearPrecio(A.precio), b: formatearPrecio(B.precio), mejor: A.precio === B.precio ? '' : A.precio < B.precio ? 'a' : 'b' };
  const res = { filas: [...filas, precio], gana: '', sellos: { a: '', b: '' }, barras: null, texto: '' };
  if (fam.por) {
    const pa = ppuDe(fam, A);
    const pb = ppuDe(fam, B);
    const etiqueta = fam.por === 'litro' ? 'Precio por litro' : 'Precio por unidad';
    res.filas.push({ k: etiqueta, a: formatearPrecio(pa), b: formatearPrecio(pb), mejor: Math.round(pa) === Math.round(pb) ? '' : pa < pb ? 'a' : 'b' });
    const max = Math.max(pa, pb) || 1;
    res.barras = { a: Math.round((pa / max) * 100), b: Math.round((pb / max) * 100), etiqueta: fam.por === 'litro' ? 'Por litro' : 'Por unidad', va: pa, vb: pb };
    if (Math.round(pa) === Math.round(pb)) {
      res.texto = `Salen lo mismo por ${fam.por}: elegí por color o por tamaño.`;
      return res;
    }
    const lado = pa < pb ? 'a' : 'b';
    const g = lado === 'a' ? A : B;
    const p = lado === 'a' ? B : A;
    res.gana = lado;
    res.sellos[lado] = 'Rinde más';
    let t = `Por ${fam.por}, ${esc(g.corto)} sale <b>${formatearPrecio(Math.min(pa, pb))}</b> y ${esc(p.corto)}, ${formatearPrecio(Math.max(pa, pb))}.`;
    const ah = ahorroDe(g, p);
    if (ah) t += ` Si ibas a llevar ${ah.txt}, ${esc(g.corto)} te ahorra <b>${formatearPrecio(ah.monto)}</b>.`;
    const extras = filas.filter(f => f.mejor && f.mejor !== lado && f.fila.txt).map(f => f.fila.txt(p, g));
    if (extras.length) t += ` ${esc(cap(p.corto))} cuesta más por ${fam.por}, pero suma: ${esc(listaY(extras))}.`;
    res.texto = t;
    return res;
  }
  if (A.precio === B.precio) {
    res.texto = 'Cuestan lo mismo: elegí por lo que más vas a usar.';
    return res;
  }
  const caroLado = A.precio > B.precio ? 'a' : 'b';
  const caro = caroLado === 'a' ? A : B;
  const barato = caroLado === 'a' ? B : A;
  res.sellos[caroLado] = 'Más completo';
  res.sellos[caroLado === 'a' ? 'b' : 'a'] = 'Más barato';
  const ventajas = filas.filter(f => f.mejor === caroLado && f.fila.txt).map(f => f.fila.txt(caro, barato));
  res.texto = `${esc(cap(caro.corto))} ${caro.corto.startsWith('los ') ? 'cuestan' : 'cuesta'} <b>${formatearPrecio(caro.precio - barato.precio)}</b> más${ventajas.length ? ` y suma${caro.corto.startsWith('los ') ? 'n' : ''} ${esc(listaY(ventajas))}` : ''}. Si te alcanza con lo básico, ${esc(barato.corto)} ${barato.corto.startsWith('los ') ? 'resuelven' : 'resuelve'}.`;
  return res;
}

function initComparador() {
  const sec = document.getElementById('comparar');
  const fams = document.getElementById('compFamilias');
  if (!sec || !fams) return;
  const lados = { a: sec.querySelector('[data-lado="a"]'), b: sec.querySelector('[data-lado="b"]') };
  const tabla = document.getElementById('compTabla');
  const veredicto = document.getElementById('compVeredicto');
  const ver = document.getElementById('compVer');
  let fam = FAMILIAS[0];
  const sel = { a: fam.a, b: fam.b };

  fams.innerHTML = FAMILIAS.map((f, i) => `<button type="button" class="comp-fam" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-fam="${f.id}">${esc(f.nombre)}</button>`).join('');

  ['a', 'b'].forEach(l => {
    lados[l].innerHTML = `<span class="comp-sello" aria-hidden="true"></span>
      <span class="comp-foto recorte"><img src="" width="1" height="1" alt=""></span>
      <div class="comp-nav">
        <button type="button" data-comp-mover="${l}" data-dir="-1" aria-label="Ver la opción anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <span class="comp-pos"></span>
        <button type="button" data-comp-mover="${l}" data-dir="1" aria-label="Ver la opción siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      </div>
      <p class="comp-ref"></p>
      <p class="comp-nombre"></p>
      <p class="comp-precio"></p>
      <div class="comp-metrica"><span class="comp-metrica-t"></span><span class="comp-barra"><span></span></span></div>
      <button type="button" class="btn btn--cta btn--chico" data-comp-add="${l}">Agregar</button>`;
  });

  const pintar = () => {
    const A = getProducto(sel.a);
    const B = getProducto(sel.b);
    if (!A || !B) return;
    const r = compararFamilia(fam, A, B);
    [['a', A], ['b', B]].forEach(([l, p]) => {
      const el = lados[l];
      el.classList.toggle('gana', r.gana === l);
      el.classList.toggle('con-sello', !!r.sellos[l]);
      el.querySelector('.comp-sello').textContent = r.sellos[l] || '';
      const foto = el.querySelector('.comp-foto');
      foto.setAttribute('style', recorte(p.img, p.foco));
      const img = foto.querySelector('img');
      const [w, h] = dims(p.img);
      img.src = `images/${FOTOS[p.img][0]}`;
      img.width = w;
      img.height = h;
      img.alt = p.nombre;
      const pos = fam.ids.indexOf(p.id) + 1;
      el.querySelector('.comp-pos').textContent = `${pos} de ${fam.ids.length}`;
      el.querySelectorAll('[data-comp-mover]').forEach(b => { b.disabled = fam.ids.length <= 2; });
      el.querySelector('.comp-ref').textContent = p.ref;
      el.querySelector('.comp-nombre').textContent = p.nombre;
      el.querySelector('.comp-precio').textContent = formatearPrecio(p.precio);
      const met = el.querySelector('.comp-metrica');
      if (r.barras) {
        met.hidden = false;
        met.querySelector('.comp-metrica-t').innerHTML = `${r.barras.etiqueta}: <b>${formatearPrecio(l === 'a' ? r.barras.va : r.barras.vb)}</b>`;
        met.querySelector('.comp-barra span').style.setProperty('--w', `${l === 'a' ? r.barras.a : r.barras.b}%`);
      } else met.hidden = true;
      const add = el.querySelector('[data-comp-add]');
      add.disabled = !(p.stock > 0);
      add.textContent = p.stock > 0 ? 'Agregar' : 'Sin stock';
      add.setAttribute('aria-label', p.stock > 0 ? `Agregar al carrito: ${p.nombre}` : `Sin stock: ${p.nombre}`);
    });
    tabla.innerHTML = `<table><caption class="sr-only">Comparación entre ${esc(A.nombre)} y ${esc(B.nombre)}</caption>
      <thead><tr><th scope="col">${esc(A.variante)}</th><th scope="col"><span class="sr-only">Dato</span></th><th scope="col">${esc(B.variante)}</th></tr></thead>
      <tbody>${r.filas.map(f => `<tr><td class="${f.mejor === 'a' ? 'mejor' : ''}">${esc(f.a)}</td><th scope="row">${esc(f.k)}</th><td class="${f.mejor === 'b' ? 'mejor' : ''}">${esc(f.b)}</td></tr>`).join('')}</tbody></table>`;
    veredicto.innerHTML = r.texto;
    ver.textContent = fam.irTxt;
    ver.href = fam.ir.cats ? `?cat=${fam.ir.cats[0]}#tienda` : `?q=${encodeURIComponent(fam.ir.q)}#tienda`;
    ver.dataset.cat = fam.ir.cats ? fam.ir.cats[0] : '';
    ver.dataset.q = fam.ir.q || '';
  };

  const elegirFamilia = id => {
    const f = FAMILIAS.find(x => x.id === id);
    if (!f) return;
    fam = f;
    sel.a = f.a;
    sel.b = f.b;
    fams.querySelectorAll('[data-fam]').forEach(b => {
      const on = b.dataset.fam === id;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    pintar();
  };

  fams.addEventListener('click', e => {
    const b = e.target.closest('[data-fam]');
    if (b) elegirFamilia(b.dataset.fam);
  });
  fams.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const i = FAMILIAS.indexOf(fam);
    const n = FAMILIAS[(i + (e.key === 'ArrowRight' ? 1 : -1) + FAMILIAS.length) % FAMILIAS.length];
    elegirFamilia(n.id);
    fams.querySelector(`[data-fam="${n.id}"]`)?.focus();
  });

  sec.addEventListener('click', e => {
    const mover = e.target.closest('[data-comp-mover]');
    if (mover) {
      const l = mover.dataset.compMover;
      const otro = l === 'a' ? 'b' : 'a';
      const dir = Number(mover.dataset.dir);
      let i = fam.ids.indexOf(sel[l]);
      do { i = (i + dir + fam.ids.length) % fam.ids.length; } while (fam.ids[i] === sel[otro]);
      sel[l] = fam.ids[i];
      pintar();
      return;
    }
    const add = e.target.closest('[data-comp-add]');
    if (add) {
      const p = getProducto(sel[add.dataset.compAdd]);
      if (p) avisarAgregado(p, Cart.add(p.id, 1));
    }
  });

  pintar();
}

const CAJA_IDS = ['vaso-lila', 'auris-air', 'llavero-stitch', 'set-contenedores', 'aro-26', 'botella-1l'];

function initCaja() {
  const sec = document.getElementById('caja');
  const pista = document.getElementById('cajaPista');
  const ul = document.getElementById('cintaItems');
  if (!sec || !pista || !ul) return;
  const items = Servidor.porIds(CAJA_IDS);
  if (!items.length) return;
  const n = items.length;
  const dos = v => String(v).padStart(2, '0');
  ul.innerHTML = items.map((p, i) => `<li class="cinta-item${i === 0 ? ' activo-caja' : ''}" data-i="${i}"><span class="cinta-foto recorte" style="${recorte(p.img, p.foco)}">${imgTag(p.img, p.nombre)}</span>${etiquetaHTML(p)}</li>`).join('');
  const prog = document.getElementById('cajaProgreso');
  if (prog) prog.innerHTML = items.map((_, i) => `<li${i === 0 ? ' class="hecho"' : ''}></li>`).join('');
  const display = sec.querySelector('.caja-display');
  const lector = sec.querySelector('.lector');
  const banda = sec.querySelector('.cinta-banda');
  const elN = document.getElementById('cajaN');
  const elRef = document.getElementById('cajaRef');
  const elNombre = document.getElementById('cajaNombre');
  const elPrecio = document.getElementById('cajaPrecio');
  const btnAdd = document.getElementById('cajaAgregar');
  const btnVer = document.getElementById('cajaVer');
  const lis = [...ul.children];
  const ticks = prog ? [...prog.children] : [];
  let activo = 0;
  let tBip = 0;

  const mostrar = (i, conBip = true) => {
    const p = items[i];
    activo = i;
    elN.textContent = `${dos(i + 1)} / ${dos(n)}`;
    elRef.textContent = p.ref;
    elNombre.textContent = p.nombre;
    elPrecio.textContent = formatearPrecio(p.precio);
    btnAdd.disabled = !(p.stock > 0);
    btnAdd.setAttribute('aria-label', `Agregar al carrito: ${p.nombre}`);
    btnVer.setAttribute('aria-label', `Ver detalle: ${p.nombre}`);
    lis.forEach((li, k) => li.classList.toggle('activo-caja', k === i));
    ticks.forEach((t, k) => t.classList.toggle('hecho', k <= i));
    if (!conBip || reduceMotion) return;
    display.classList.remove('cambio');
    lector.classList.remove('bip');
    void display.offsetWidth;
    display.classList.add('cambio');
    lector.classList.add('bip');
    clearTimeout(tBip);
    tBip = setTimeout(() => { display.classList.remove('cambio'); lector.classList.remove('bip'); }, 520);
  };

  btnAdd.addEventListener('click', () => {
    const p = items[activo];
    avisarAgregado(p, Cart.add(p.id, 1));
  });
  btnVer.addEventListener('click', () => window.abrirQuick?.(items[activo].id, btnVer));

  if (reduceMotion) {
    sec.classList.add('is-static');
    lis.forEach((li, k) => li.addEventListener('click', () => mostrar(k, false)));
    mostrar(0, false);
    return;
  }

  const retener = f => { const x = clamp01((f - 0.32) / 0.42); return x * x * (3 - 2 * x); };
  let frame = 0;
  const update = () => {
    frame = 0;
    const r = pista.getBoundingClientRect();
    const off = offModelos();
    const recorrido = r.height - (window.innerHeight - off);
    const p = recorrido > 0 ? clamp01((off - r.top) / recorrido) : 0;
    const t = p * (n - 1);
    const k = Math.min(n - 1, Math.floor(t));
    const pos = k >= n - 1 ? n - 1 : k + retener(t - k);
    const gap = parseFloat(window.getComputedStyle(ul).columnGap) || 0;
    const paso = (lis[0]?.offsetWidth || 0) + gap;
    ul.style.setProperty('--tx', String(-pos * paso));
    banda?.style.setProperty('--mov', String(pos * paso));
    const cerca = Math.round(pos);
    if (cerca !== activo && Math.abs(pos - cerca) < 0.18) mostrar(cerca);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  mostrar(0, false);
  update();
}

function initCarrito() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  const panel = drawer.querySelector('.drawer-panel');
  const lista = document.getElementById('drawerItems');
  const vacio = document.getElementById('drawerVacio');
  const pie = document.getElementById('drawerPie');
  const totalEl = document.getElementById('drawerTotal');
  const nEl = document.getElementById('drawerN');
  const wsp = document.getElementById('drawerWsp');
  let opener = null;
  let tCierre = 0;

  const render = () => {
    const items = Cart.get();
    lista.innerHTML = items.map((it, k) => `<li class="d-item" style="--i:${k}" data-linea-carrito="${it.id}">
        <span class="d-foto recorte" style="${recorte(it.prod.img, it.prod.foco)}">${imgTag(it.prod.img, '')}</span>
        <p class="d-nombre">${esc(it.prod.nombre)}<small>${esc(it.prod.ref)}</small></p>
        <b class="d-precio">${formatearPrecio(it.prod.precio * it.qty)}</b>
        <div class="d-acciones">
          <div class="stepper"><button type="button" data-d-menos aria-label="Restar uno de ${esc(it.prod.nombre)}" ${it.qty <= 1 ? 'disabled' : ''}>−</button><output>${it.qty}</output><button type="button" data-d-mas aria-label="Sumar uno de ${esc(it.prod.nombre)}" ${it.qty >= it.prod.stock ? 'disabled' : ''}>+</button></div>
          <button type="button" class="d-quitar" data-d-quitar>Quitar</button>
        </div>
      </li>`).join('');
    const n = items.reduce((s, it) => s + it.qty, 0);
    const total = items.reduce((s, it) => s + it.prod.precio * it.qty, 0);
    lista.hidden = !items.length;
    vacio.hidden = !!items.length;
    pie.hidden = !items.length;
    totalEl.textContent = formatearPrecio(total);
    nEl.textContent = n ? `(${n})` : '';
    const lineas = items.map(it => `• ${it.prod.ref} · ${it.prod.nombre} × ${it.qty} — ${formatearPrecio(it.prod.precio * it.qty)}`).join('\n');
    wsp.href = wspLink(items.length ? `Hola Swape! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(total)}\n¿Me confirman stock y cómo lo recibo?` : 'Hola Swape! Quiero hacer un pedido.');
  };

  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };

  const abrir = desde => {
    cerrarNavSiAbierto();
    if (document.getElementById('quick')?.classList.contains('is-open')) cerrarQuick(false);
    opener = desde || document.activeElement;
    clearTimeout(tCierre);
    render();
    drawer.hidden = false;
    drawer.classList.add('animando');
    void drawer.offsetWidth;
    drawer.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => drawer.classList.remove('animando'), 900);
    setTimeout(() => panel.querySelector('.drawer-cerrar')?.focus(), 60);
  };

  const cerrar = () => {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    document.removeEventListener('keydown', tecla);
    tCierre = setTimeout(() => { drawer.hidden = true; liberarScroll(); }, reduceMotion ? 0 : 380);
    if (reduceMotion) liberarScroll();
    opener?.focus?.({ preventScroll: true });
  };

  window.abrirCarrito = abrir;

  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', () => abrir(b)));
  drawer.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrar));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('is-open')) render(); });

  lista.addEventListener('click', e => {
    const li = e.target.closest('[data-linea-carrito]');
    if (!li) return;
    const id = li.dataset.lineaCarrito;
    const actual = Cart.get().find(i => i.id === id);
    if (!actual) return;
    if (e.target.closest('[data-d-menos]')) Cart.setQty(id, actual.qty - 1);
    else if (e.target.closest('[data-d-mas]')) Cart.setQty(id, actual.qty + 1);
    else if (e.target.closest('[data-d-quitar]')) { Cart.remove(id); showToast(`Sacaste ${actual.prod.nombre} del carrito`); }
    if (!Cart.get().length) panel.querySelector('.drawer-cerrar')?.focus();
  });

  drawer.querySelector('[data-checkout]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  drawer.querySelectorAll('[data-carrito-ir]').forEach(b => b.addEventListener('click', () => {
    cerrar();
    const cat = b.dataset.carritoIr;
    setTimeout(() => irATienda({ cats: [cat] }), reduceMotion ? 0 : 300);
  }));
}

let cerrarQuick = () => {};

function initQuick() {
  const modal = document.getElementById('quick');
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  const qv = document.getElementById('qv');
  let opener = null;
  let actual = null;
  let tCierre = 0;
  let ld = null;

  const stockTxt = p => (!(p.stock > 0) ? ['sin', 'Sin stock por ahora'] : p.stock <= 5 ? ['poco', `Quedan ${p.stock}`] : ['', 'Hay stock']);
  const etiquetaGrupo = p => (p.grupo === 'vasos-termicos' ? 'Otros colores' : p.grupo === 'llaveros' ? 'Otros personajes' : 'Otras opciones');

  const render = () => {
    const p = actual;
    const agotado = !(p.stock > 0);
    const herm = Servidor.hermanos(p.id);
    const rel = Servidor.relacionados(p.id, 3);
    const u = precioUnidad(p);
    const [clase, txtStock] = stockTxt(p);
    qv.innerHTML = `
      <div class="qv-foto recorte" style="${recorte(p.img, p.foco)}">${imgTag(p.img, p.nombre)}${etiquetaHTML(p)}</div>
      <div class="qv-info">
        <p class="qv-linea">${esc(nombreCat(p.cat))}</p>
        <p class="qv-nombre">${esc(p.nombre)}</p>
        <p class="qv-ref"><code>${esc(p.ref)}</code><button type="button" class="qv-copiar" data-copiar-ref="${esc(p.ref)}">Copiar referencia</button></p>
        <div class="qv-precio"><b>${formatearPrecio(p.precio)}</b>${p.antes > 0 ? `<s>${formatearPrecio(p.antes)}</s>` : ''}${u ? `<span class="qv-unidad">${formatearPrecio(u.v)} ${u.txt}</span>` : ''}</div>
        <p class="qv-stock ${clase}">${esc(txtStock)}</p>
        ${herm.length > 1 ? `<p class="qv-sub">${etiquetaGrupo(p)}</p><div class="qv-hermanos">${herm.map(h => `<button type="button" class="qv-hermano" data-quick="${h.id}" aria-current="${h.id === p.id}"><span class="recorte" style="${recorte(h.img, h.foco)}">${imgTag(h.img, '')}</span>${esc(h.variante)}</button>`).join('')}</div>` : ''}
        ${agotado ? `<a class="btn btn--wsp" href="${esc(avisoLink(p))}" target="_blank" rel="noopener">Avisame cuando vuelva</a>` : `<div class="qv-acciones"><div class="stepper" data-stepper data-max="${p.stock}"><button type="button" data-menos aria-label="Restar uno" disabled>−</button><output aria-live="polite">1</output><button type="button" data-mas aria-label="Sumar uno" ${p.stock <= 1 ? 'disabled' : ''}>+</button></div><button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button><button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button></div>`}
        <a class="qv-wsp" href="${esc(wspLink(`Hola Swape! Quiero consultar por ${p.nombre} (ref. ${p.ref}).`))}" target="_blank" rel="noopener">${ICONO_WSP}Consultar por WhatsApp con la referencia</a>
        <p class="qv-desc">${esc(p.desc)}</p>
        <dl class="qv-ficha">${p.ficha.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
        ${rel.length ? `<p class="qv-sub">También te puede interesar</p><div class="qv-rel">${rel.map(x => `<button type="button" class="qv-rel-item" data-quick="${x.id}"><span class="recorte" style="${recorte(x.img, x.foco)}">${imgTag(x.img, '')}</span><span>${esc(x.nombre)}</span><b>${formatearPrecio(x.precio)}</b></button>`).join('')}</div>` : ''}
      </div>`;
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.ref, description: p.desc, image: new URL(`images/${FOTOS[p.img][0]}`, location.href).href, category: nombreCat(p.cat), offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: agotado ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' } });
  };

  const tecla = e => {
    if (e.key === 'Escape') { e.preventDefault(); cerrar(); }
    else atraparFoco(panel, e);
  };

  const escribirProducto = id => {
    const u = new URLSearchParams(location.search);
    if (id) u.set('producto', id); else u.delete('producto');
    const qs = u.toString();
    window.history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  };

  const abrir = (id, desde) => {
    const p = getProducto(id);
    if (!p) return;
    cerrarNavSiAbierto();
    actual = p;
    const yaAbierto = modal.classList.contains('is-open');
    if (!yaAbierto) opener = desde || document.activeElement;
    clearTimeout(tCierre);
    render();
    escribirProducto(p.id);
    if (yaAbierto) { panel.scrollTop = 0; panel.focus({ preventScroll: true }); return; }
    modal.hidden = false;
    void modal.offsetWidth;
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', tecla);
    setTimeout(() => panel.focus({ preventScroll: true }), 60);
  };

  const cerrar = (devolverFoco = true) => {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.removeEventListener('keydown', tecla);
    escribirProducto('');
    tCierre = setTimeout(() => { modal.hidden = true; liberarScroll(); }, reduceMotion ? 0 : 340);
    if (reduceMotion) liberarScroll();
    if (devolverFoco) opener?.focus?.({ preventScroll: true });
  };

  cerrarQuick = cerrar;
  window.abrirQuick = abrir;

  modal.querySelectorAll('[data-cerrar-modal]').forEach(b => b.addEventListener('click', () => cerrar()));
  qv.addEventListener('click', e => {
    const qty = Number(qv.querySelector('.stepper output')?.textContent || 1);
    if (e.target.closest('[data-qv-add]')) {
      avisarAgregado(actual, Cart.add(actual.id, qty));
      return;
    }
    if (e.target.closest('[data-qv-comprar]')) {
      Cart.add(actual.id, qty);
      cerrar(false);
      window.abrirCarrito?.(opener);
    }
  });

  const u = leerUrl();
  if (u.producto && getProducto(u.producto)) abrir(u.producto, document.getElementById('grilla') || document.body);
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  let enCarrito = Cart.count();
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || enCarrito > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', () => { enCarrito = Cart.count(); sync(); });
  cart?.addEventListener('click', () => window.abrirCarrito?.(cart));
  sync();
}

function copiarTexto(t) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t).catch(() => {});
  return Promise.resolve();
}

function initDelegados() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-menos], [data-stepper] [data-mas]');
    if (step) {
      const st = step.closest('[data-stepper]');
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      const v = Math.max(1, Math.min(max, Number(out.textContent || 1) + (step.hasAttribute('data-mas') ? 1 : -1)));
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      avisarAgregado(p, Cart.add(add.dataset.add, 1));
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      window.abrirQuick?.(quick.dataset.quick, quick);
      return;
    }
    const copiar = e.target.closest('[data-copiar-ref]');
    if (copiar) {
      const ref = copiar.dataset.copiarRef;
      copiarTexto(ref).then(() => showToast(`Copiaste la referencia ${ref}`));
      return;
    }
    const link = e.target.closest('a[data-cat], a[data-precio], a[data-orden], a[data-q]');
    if (link && document.getElementById('grilla') && (link.dataset.cat || link.dataset.precio || link.dataset.orden || link.dataset.q)) {
      e.preventDefault();
      const cambios = {};
      if (link.dataset.cat) cambios.cats = [link.dataset.cat];
      if (link.dataset.precio) cambios.precios = [link.dataset.precio];
      if (link.dataset.q) cambios.q = link.dataset.q;
      if (link.dataset.orden) {
        aplicar({ ...FILTROS_VACIOS, orden: link.dataset.orden });
        irATienda({}, { limpiar: false });
        return;
      }
      irATienda(cambios);
      return;
    }
    if (e.target.closest('[data-ir-buscar]')) {
      e.preventDefault();
      irATienda({}, { foco: true, limpiar: false });
      return;
    }
    const ancla = e.target.closest('a[href^="#"]');
    if (ancla && ancla.getAttribute('href').length > 1 && !reduceMotion) {
      const destino = document.querySelector(ancla.getAttribute('href'));
      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge, .hero-tag'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

initModelBarScroll();
initNav();
fillDatos();
initStickers();
initTagsPrecio();
initColecciones();
initCatalogo();
initComparador();
initCaja();
initCarrito();
initQuick();
initFloats();
initDelegados();
initReveals();
initFiltrosEntrada();
initHeroMotion();
updateCartBadge();
