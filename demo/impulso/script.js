const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493584370998';
const ES_M2 = document.body.classList.contains('m2');

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FOTOS = {
  '01': { src: 'images/impulso_01_vertical_9x16.webp', w: 941, h: 1672 },
  '02': { src: 'images/impulso_02_horizontal_16x9.webp', w: 1672, h: 941 },
  '03': { src: 'images/impulso_03_cuadrada_1x1.webp', w: 1254, h: 1254 },
  '04': { src: 'images/impulso_04_cuadrada_1x1.webp', w: 1254, h: 1254 },
  '05': { src: 'images/impulso_05_cuadrada_1x1.webp', w: 1254, h: 1254 },
  '06': { src: 'images/impulso_06_cuadrada_1x1.webp', w: 1254, h: 1254 }
};

const CATS = {
  proteinas: 'Proteínas',
  creatinas: 'Creatinas',
  pre: 'Pre-entrenos',
  aminos: 'Aminoácidos',
  salud: 'Vitaminas y salud',
  hidratacion: 'Hidratación',
  accesorios: 'Shakers y accesorios'
};

const OBJETIVOS = { masa: 'Ganar masa', fuerza: 'Fuerza', resistencia: 'Resistencia', recuperacion: 'Recuperación', bienestar: 'Bienestar' };

const SW = { Vainilla: 'vainilla', Chocolate: 'chocolate', Frutilla: 'frutilla', Cookies: 'cookies', 'Frutos rojos': 'frutosrojos', 'Limón': 'limon', Mango: 'mango', Naranja: 'naranja', Pomelo: 'pomelo', 'Sin sabor': 'sinsabor' };

const PRODUCTOS = [
  { id: 'whey-2lb', cat: 'proteinas', obj: ['masa', 'recuperacion'], nombre: 'Whey Protein 2 lb (907 g)', corto: 'Whey 2 lb', precio: 98900, descuento: 0, stock: 12, foto: '03', foco: [0.5, 0.48, 1.18], hd: true,
    porciones: 30, dosis: '24 g de proteína por porción de 30 g', sabores: ['Vainilla', 'Chocolate', 'Frutilla', 'Cookies'],
    desc: 'Proteína de suero de leche concentrada. Se prepara con 200 ml de agua o leche en el shaker.',
    info: [['Porción', '30 g'], ['Proteínas', '24 g'], ['Carbohidratos', '3 g'], ['Grasas totales', '1,8 g']],
    alt: 'Pote de Whey Protein blanco con tapa plateada y etiqueta azul' },
  { id: 'creatina-300', cat: 'creatinas', obj: ['fuerza', 'masa'], nombre: 'Creatina monohidrato 300 g', corto: 'Creatina 300 g', precio: 28900, descuento: 0, stock: 20, foto: '04', foco: [0.415, 0.47, 1.51], hd: true,
    porciones: 60, dosis: '5 g de creatina monohidrato por porción', sabores: ['Sin sabor'],
    desc: 'Creatina monohidrato en polvo, sin sabor. Se disuelve en agua, en jugo o en el batido de proteína.',
    info: [['Porción', '5 g'], ['Creatina monohidrato', '5 g'], ['Calorías', '0 kcal']],
    alt: 'Pote blanco de creatina con etiqueta verde' },
  { id: 'cafeina-90', cat: 'pre', obj: ['resistencia', 'fuerza'], nombre: 'Cafeína 200 mg · 90 cápsulas', corto: 'Cafeína 90 cáps.', precio: 17900, descuento: 0, stock: 15, foto: '02', foco: [0.2, 0.68, 2.65], hd: false,
    porciones: 90, dosis: '200 mg de cafeína anhidra por cápsula', sabores: [],
    desc: 'Cápsulas de cafeína anhidra. Una cápsula con agua, antes de entrenar.',
    info: [['Porción', '1 cápsula'], ['Cafeína anhidra', '200 mg']],
    alt: 'Frasco negro chico de cápsulas de cafeína' },
  { id: 'isotonico-500', cat: 'hidratacion', obj: ['resistencia'], nombre: 'Isotónico en polvo 500 g', corto: 'Isotónico 500 g', precio: 19900, descuento: 0, stock: 14, foto: '05', foco: [0.82, 0.36, 1.7], hd: true,
    porciones: 14, dosis: '35 g en 500 ml de agua', sabores: ['Naranja', 'Pomelo'],
    desc: 'Bebida isotónica en polvo con sodio, potasio y carbohidratos. El pote rinde 7 litros.',
    info: [['Porción', '35 g'], ['Carbohidratos', '30 g'], ['Sodio', '250 mg'], ['Potasio', '90 mg']],
    alt: 'Shaker con bebida isotónica celeste' },
  { id: 'isolate-2lb', cat: 'proteinas', obj: ['masa', 'recuperacion'], nombre: 'Proteína Isolate 2 lb (907 g)', corto: 'Isolate 2 lb', precio: 134900, descuento: 10, stock: 6, foto: '02', foco: [0.625, 0.53, 1.54], hd: false,
    porciones: 30, dosis: '27 g de proteína por porción de 30 g', sabores: ['Chocolate', 'Vainilla'],
    desc: 'Proteína de suero aislada, con menos grasas y carbohidratos que la concentrada.',
    info: [['Porción', '30 g'], ['Proteínas', '27 g'], ['Carbohidratos', '1 g'], ['Grasas totales', '0,5 g']],
    alt: 'Pote negro de proteína isolate' },
  { id: 'magnesio-90', cat: 'salud', obj: ['recuperacion', 'bienestar'], nombre: 'Magnesio bisglicinato · 90 cápsulas', corto: 'Magnesio 90 cáps.', precio: 21900, descuento: 0, stock: 10, foto: '06', foco: [0.225, 0.655, 2.38], hd: false,
    porciones: 45, dosis: '200 mg de magnesio por porción de 2 cápsulas', sabores: [],
    desc: 'Magnesio en forma de bisglicinato. Dos cápsulas por día, con agua.',
    info: [['Porción', '2 cápsulas'], ['Magnesio', '200 mg']],
    alt: 'Frasco de vidrio con cápsulas de magnesio' },
  { id: 'pre-300', cat: 'pre', obj: ['fuerza', 'resistencia'], nombre: 'Pre-entreno 300 g', corto: 'Pre-entreno 300 g', precio: 38900, descuento: 0, stock: 9, foto: '04', foco: [0.76, 0.57, 1.69], hd: true, nuevo: true,
    porciones: 30, dosis: '200 mg de cafeína y 4 g de citrulina por porción', sabores: ['Frutos rojos', 'Limón'],
    desc: 'Pre-entreno en polvo con cafeína, citrulina y beta alanina. Se toma 30 minutos antes de entrenar.',
    info: [['Porción', '10 g'], ['Citrulina', '4 g'], ['Beta alanina', '2 g'], ['Cafeína', '200 mg']],
    alt: 'Pote negro de pre-entreno con etiqueta azul' },
  { id: 'whey-5lb', cat: 'proteinas', obj: ['masa', 'recuperacion'], nombre: 'Whey Protein 5 lb (2,27 kg)', corto: 'Whey 5 lb', precio: 219900, descuento: 0, stock: 5, foto: '01', foco: [0.42, 0.465, 1.4], hd: true,
    porciones: 75, dosis: '24 g de proteína por porción de 30 g', sabores: ['Chocolate', 'Vainilla'],
    desc: 'La misma proteína concentrada en el pote grande: cada porción sale menos que en el de 2 lb.',
    info: [['Porción', '30 g'], ['Proteínas', '24 g'], ['Carbohidratos', '3 g'], ['Grasas totales', '1,8 g']],
    alt: 'Pote grande de proteína con tapa negra' },
  { id: 'beta-200', cat: 'pre', obj: ['resistencia'], nombre: 'Beta alanina 200 g', corto: 'Beta alanina 200 g', precio: 24900, descuento: 0, stock: 8, foto: '05', foco: [0.23, 0.665, 2.1], hd: false,
    porciones: 66, dosis: '3 g de beta alanina por porción', sabores: ['Sin sabor'],
    desc: 'Beta alanina en polvo, sin sabor. Se mezcla con agua o con el pre-entreno.',
    info: [['Porción', '3 g'], ['Beta alanina', '3 g']],
    alt: 'Pote blanco chico de beta alanina' },
  { id: 'bcaa-270', cat: 'aminos', obj: ['recuperacion', 'resistencia'], nombre: 'Aminoácidos BCAA 270 g', corto: 'BCAA 270 g', precio: 36900, descuento: 15, stock: 7, foto: '02', foco: [0.763, 0.7, 2.4], hd: false,
    porciones: 30, dosis: '5 g de BCAA 2:1:1 por porción', sabores: ['Limón', 'Mango'],
    desc: 'Leucina, isoleucina y valina en proporción 2:1:1. Se toman durante o después de entrenar.',
    info: [['Porción', '9 g'], ['L-leucina', '2,5 g'], ['L-isoleucina', '1,25 g'], ['L-valina', '1,25 g']],
    alt: 'Frasco negro abierto con aminoácidos en polvo' },
  { id: 'glutamina-300', cat: 'aminos', obj: ['recuperacion'], nombre: 'Glutamina 300 g', corto: 'Glutamina 300 g', precio: 29900, descuento: 0, stock: 11, foto: '01', foco: [0.655, 0.6, 2.55], hd: false,
    porciones: 60, dosis: '5 g de L-glutamina por porción', sabores: ['Sin sabor'],
    desc: 'L-glutamina en polvo, sin sabor. Se disuelve en agua o en el batido.',
    info: [['Porción', '5 g'], ['L-glutamina', '5 g']],
    alt: 'Pote blanco chico con tapa negra' },
  { id: 'vegetal-1kg', cat: 'proteinas', obj: ['masa', 'bienestar'], nombre: 'Proteína vegetal 1 kg', corto: 'Vegetal 1 kg', precio: 59900, descuento: 0, stock: 8, foto: '06', foco: [0.49, 0.48, 1.63], hd: true, nuevo: true,
    porciones: 30, dosis: '22 g de proteína por porción de 33 g', sabores: ['Sin sabor', 'Chocolate'],
    desc: 'Proteína de arveja y arroz, sin lácteos. Apta para quienes no consumen productos de origen animal.',
    info: [['Porción', '33 g'], ['Proteínas', '22 g'], ['Carbohidratos', '4 g'], ['Grasas totales', '2 g']],
    alt: 'Pote blanco de proteína vegetal' },
  { id: 'colageno-400', cat: 'salud', obj: ['recuperacion', 'bienestar'], nombre: 'Colágeno hidrolizado 400 g', corto: 'Colágeno 400 g', precio: 32900, descuento: 0, stock: 9, foto: '02', foco: [0.477, 0.62, 2.23], hd: false,
    porciones: 40, dosis: '10 g de colágeno hidrolizado por porción', sabores: ['Sin sabor', 'Limón'],
    desc: 'Colágeno hidrolizado en polvo. Se disuelve en agua, en jugo o en el café.',
    info: [['Porción', '10 g'], ['Colágeno hidrolizado', '10 g'], ['Vitamina C', '40 mg']],
    alt: 'Pote blanco mediano sobre una base de piedra' },
  { id: 'shaker-pico', cat: 'accesorios', obj: [], nombre: 'Shaker con pico 700 ml', corto: 'Shaker 700 ml', precio: 12900, descuento: 0, stock: 18, foto: '03', foco: [0.87, 0.55, 1.58], hd: true,
    porciones: 0, dosis: 'Tapa a rosca con pico y traba', sabores: [],
    desc: 'Vaso de 700 ml con marcas de medida, tapa a rosca y pico con traba. Libre de BPA.',
    info: [['Capacidad', '700 ml'], ['Material', 'Plástico libre de BPA'], ['Tapa', 'A rosca, con pico']],
    alt: 'Shaker transparente con tapa negra y traba azul' },
  { id: 'banda', cat: 'accesorios', obj: [], nombre: 'Banda elástica de resistencia', corto: 'Banda elástica', precio: 11900, descuento: 0, stock: 16, foto: '06', foco: [0.84, 0.7, 1.98], hd: false,
    porciones: 0, dosis: 'Resistencia media, 60 cm', sabores: [],
    desc: 'Banda de látex de resistencia media para activación, movilidad y ejercicios en casa.',
    info: [['Largo', '60 cm'], ['Resistencia', 'Media'], ['Material', 'Látex']],
    alt: 'Banda elástica azul grisácea doblada' },
  { id: 'creatina-500', cat: 'creatinas', obj: ['fuerza', 'masa'], nombre: 'Creatina monohidrato 500 g', corto: 'Creatina 500 g', precio: 44900, descuento: 10, stock: 10, foto: '05', foco: [0.54, 0.53, 1.49], hd: true,
    porciones: 100, dosis: '5 g de creatina monohidrato por porción', sabores: ['Sin sabor'],
    desc: 'El pote grande de creatina sin sabor: tomando 5 g por día, te dura más de tres meses.',
    info: [['Porción', '5 g'], ['Creatina monohidrato', '5 g'], ['Calorías', '0 kcal']],
    alt: 'Pote blanco grande de creatina' },
  { id: 'botella-750', cat: 'accesorios', obj: [], nombre: 'Botella de vidrio 750 ml con funda', corto: 'Botella 750 ml', precio: 18900, descuento: 0, stock: 0, foto: '06', foco: [0.8, 0.4, 1.52], hd: true,
    porciones: 0, dosis: 'Vidrio con funda de silicona', sabores: [],
    desc: 'Botella de vidrio borosilicato con funda de silicona y tapa de acero con manija.',
    info: [['Capacidad', '750 ml'], ['Material', 'Vidrio borosilicato'], ['Tapa', 'Acero, con manija']],
    alt: 'Botella de vidrio con funda gris y tapa de acero' },
  { id: 'ganador-3kg', cat: 'proteinas', obj: ['masa'], nombre: 'Ganador de masa 3 kg', corto: 'Ganador 3 kg', precio: 79900, descuento: 0, stock: 3, foto: '02', foco: [0.36, 0.42, 1.37], hd: false,
    porciones: 20, dosis: '38 g de proteína y 100 g de carbohidratos por porción', sabores: ['Chocolate', 'Vainilla'],
    desc: 'Proteína y carbohidratos para sumar calorías en el día. Se prepara con leche o agua.',
    info: [['Porción', '150 g'], ['Proteínas', '38 g'], ['Carbohidratos', '100 g'], ['Calorías', '580 kcal']],
    alt: 'Pote blanco grande de ganador de masa' },
  { id: 'electrolitos-10', cat: 'hidratacion', obj: ['resistencia'], nombre: 'Electrolitos · caja x 10 sobres', corto: 'Electrolitos x 10', precio: 12900, descuento: 0, stock: 20, foto: '01', foco: [0.21, 0.74, 2.6], hd: false,
    porciones: 10, dosis: '1 sobre en 500 ml de agua', sabores: ['Naranja', 'Limón'],
    desc: 'Sobres monodosis con sodio, potasio y magnesio, sin azúcar. Para llevar en el bolso.',
    info: [['Porción', '1 sobre (6 g)'], ['Sodio', '300 mg'], ['Potasio', '150 mg'], ['Magnesio', '50 mg']],
    alt: 'Sobres monodosis blancos con borde azul' },
  { id: 'multi-60', cat: 'salud', obj: ['bienestar'], nombre: 'Multivitamínico · 60 cápsulas', corto: 'Multivitamínico', precio: 24900, descuento: 0, stock: 13, foto: '02', foco: [0.62, 0.705, 2.97], hd: false,
    porciones: 60, dosis: '12 vitaminas y 8 minerales por cápsula', sabores: [],
    desc: 'Vitaminas y minerales en una cápsula diaria, con el desayuno.',
    info: [['Porción', '1 cápsula'], ['Vitaminas', '12'], ['Minerales', '8']],
    alt: 'Frasco transparente con cápsulas blancas' },
  { id: 'shaker-600', cat: 'accesorios', obj: [], nombre: 'Shaker clásico 600 ml', corto: 'Shaker 600 ml', precio: 9900, descuento: 0, stock: 22, foto: '02', foco: [0.82, 0.5, 1.6], hd: false,
    porciones: 0, dosis: 'Tapa a presión con pico', sabores: [],
    desc: 'Vaso de 600 ml con tapa a presión y pico. Marcas de medida en mililitros y onzas.',
    info: [['Capacidad', '600 ml'], ['Material', 'Plástico libre de BPA'], ['Tapa', 'A presión, con pico']],
    alt: 'Shaker transparente con tapa negra' }
];

const DIA = [
  { hora: '18:30', min: 1110, momento: 'Antes', detalle: '30 minutos antes de entrenar', id: 'pre-300' },
  { hora: '19:15', min: 1155, momento: 'Durante', detalle: 'Mientras entrenás, de a sorbos', id: 'isotonico-500' },
  { hora: '20:30', min: 1230, momento: 'Después', detalle: 'Al terminar la rutina', id: 'whey-2lb' },
  { hora: '23:00', min: 1380, momento: 'A la noche', detalle: 'Antes de dormir', id: 'magnesio-90' }
];

const DURA_CATS = {
  proteina: { cat: 'proteinas', ids: ['whey-2lb', 'whey-5lb', 'isolate-2lb'], dias: [0, 2, 4], ver: 'las {n} proteínas', nota: 'Una porción por cada día marcado.' },
  creatina: { cat: 'creatinas', ids: ['creatina-300', 'creatina-500'], dias: [0, 1, 2, 3, 4, 5, 6], ver: 'las {n} creatinas', nota: 'Con creatina, lo habitual es una porción todos los días.' },
  pre: { cat: 'pre', ids: ['pre-300', 'cafeina-90', 'beta-200'], dias: [0, 2, 4], ver: 'los {n} pre-entrenos', nota: 'Una porción por cada día que entrenás.' },
  aminos: { cat: 'aminos', ids: ['bcaa-270', 'glutamina-300'], dias: [0, 2, 4], ver: 'los {n} aminoácidos', nota: 'Una porción por cada día marcado.' }
};

const DIAS_JS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const porPorcion = p => (p.porciones ? precioFinal(p) / p.porciones : 0);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const multiSabor = p => p.sabores.length > 1;
const saborDefault = p => p.sabores[0] || '';
const AR_CARD = ES_M2 && window.matchMedia('(min-width: 769px)').matches ? 1 : 0.8;
const conSabor = (p, sabor) => (sabor && multiSabor(p) ? ` (${sabor})` : '');
const fechaLarga = d => `${DIAS_JS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}${d.getFullYear() !== new Date().getFullYear() ? ` de ${d.getFullYear()}` : ''}`;

function recorte(fotoId, foco, ar = 1) {
  const f = FOTOS[fotoId] || { w: 1, h: 1 };
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / f.w, 1 / f.h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = f.w > vw + 0.5 ? clamp01((cx * f.w - vw / 2) / (f.w - vw)) : 0.5;
  const py = f.h > vh + 0.5 ? clamp01((cy * f.h - vh / 2) / (f.h - vh)) : 0.5;
  const x0 = (f.w - vw) * px;
  const y0 = (f.h - vh) * py;
  const fx = z > 1 ? clamp01((cx * f.w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * f.h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fotoHTML(fotoId, foco, ar, clase = '', extra = '', alt = '') {
  const f = FOTOS[fotoId];
  return `<div class="recorte ${clase}"${extra} style="${recorte(fotoId, foco, ar)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(alt)}"></div>`;
}

const Cart = {
  KEY: 'impulso_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, sabor = '') {
    const items = this.get();
    const libre = (producto.stock ?? 99) - this.enCarrito(producto.id);
    const suma = Math.max(0, Math.min(qty, libre));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && (i.sabor || '') === sabor);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, sabor, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, sabor, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.sabor || '') === sabor); if (!it) return;
    const p = getProducto(id);
    const otros = items.filter(i => i.id === id && i !== it).reduce((s, i) => s + i.qty, 0);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - otros)); this.save(items);
  },
  remove(id, sabor) { this.save(this.get().filter(i => !(i.id === id && (i.sabor || '') === sabor))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function sanearCarrito() {
  let items;
  try { items = JSON.parse(localStorage.getItem(Cart.KEY)) || []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  const limpios = [];
  items.forEach(i => {
    const p = i && getProducto(i.id);
    if (!p || p.stock <= 0) return;
    const sabor = p.sabores.length ? (p.sabores.includes(i.sabor) ? i.sabor : saborDefault(p)) : '';
    const ya = limpios.filter(x => x.id === p.id).reduce((s, x) => s + x.qty, 0);
    const qty = Math.min(Math.max(1, Number(i.qty) || 1), p.stock - ya);
    if (qty > 0) limpios.push({ id: p.id, sabor, qty });
  });
  try { localStorage.setItem(Cart.KEY, JSON.stringify(limpios)); } catch { limpios.length = 0; }
}

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

const ICONO_CARRITO_MAS = '<svg class="lbl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

function precioHTML(p) {
  return `<p class="precio"><span class="precio__f">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s class="precio__o">${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}

function stepperHTML(id, clase = '') {
  return `<div class="stepper${clase}" data-stepper="${id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

/* ---------- tarjeta ---------- */
function cardHTML(p, animar = true) {
  const libre = p.stock - Cart.enCarrito(p.id);
  const varios = multiSabor(p);
  const meta = [p.porciones ? plural(p.porciones, 'porción', 'porciones') : 'Accesorio', varios ? `${p.sabores.length} sabores` : (p.sabores[0] || '')].filter(Boolean).join(' · ');
  const badges = [
    p.nuevo ? '<span class="badge">Nuevo</span>' : '',
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : '',
    p.stock > 0 && p.stock <= 3 ? '<span class="badge badge--poco">Últimas unidades</span>' : '',
    p.stock <= 0 ? '<span class="badge badge--sin">Sin stock</span>' : ''
  ].join('');
  let acciones;
  if (p.stock <= 0) acciones = '<button type="button" class="btn btn--line btn--sm card__add" disabled>Sin stock</button>';
  else if (varios) acciones = `<button type="button" class="btn btn--solid btn--sm card__add card__add--sabor" data-quick="${p.id}">Elegir sabor</button>`;
  else acciones = `${stepperHTML(p.id)}<button type="button" class="btn btn--solid btn--sm card__add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"${libre <= 0 ? ' disabled' : ''}>${ICONO_CARRITO_MAS}<span class="lbl-long">Agregar</span></button>`;
  return `<article class="card" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
    <div class="card__media">
      ${fotoHTML(p.foto, p.foco, AR_CARD, 'card__img', ` data-quick="${p.id}"`, p.alt)}
      <div class="card__badges">${badges}</div>
      <button type="button" class="card__quick" data-quick="${p.id}" tabindex="-1" aria-hidden="true">Vista rápida</button>
    </div>
    <div class="card__body">
      <p class="card__cat">${esc(CATS[p.cat])}</p>
      <h3 class="card__t"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__meta">${esc(meta)}</p>
      ${precioHTML(p)}
      ${p.porciones ? `<p class="card__porcion mono"><b>${formatearPrecio(porPorcion(p))}</b> por porción</p>` : ''}
      <div class="card__acts">${acciones}</div>
      ${p.stock > 0 ? `<button type="button" class="card__comprar" data-comprar="${p.id}">Comprar ahora</button>` : ''}
    </div>
  </article>`;
}

/* ---------- catálogo ---------- */
const PASO = 16;
let visibles = PASO;
const FILTRO = { q: '', cats: new Set(), objs: new Set(), sabores: new Set(), precio: new Set(), stock: false, orden: 'recomendados' };
const RANGOS = { hasta20: [0, 20000], de20a50: [20001, 50000], mas50: [50001, Infinity] };
const RANGOS_TXT = { hasta20: 'Hasta $20.000', de20a50: '$20.000 a $50.000', mas50: 'Más de $50.000' };

function textoDe(p) {
  return normal([p.nombre, CATS[p.cat], ...p.obj.map(o => OBJETIVOS[o]), ...p.sabores, p.desc, p.dosis].join(' '));
}

function filtrar() {
  const palabras = normal(FILTRO.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (FILTRO.cats.size && !FILTRO.cats.has(p.cat)) return false;
    if (FILTRO.objs.size && !p.obj.some(o => FILTRO.objs.has(o))) return false;
    if (FILTRO.sabores.size && !p.sabores.some(s => FILTRO.sabores.has(s))) return false;
    if (FILTRO.precio.size && ![...FILTRO.precio].some(r => { const [a, b] = RANGOS[r]; const f = precioFinal(p); return f >= a && f <= b; })) return false;
    if (FILTRO.stock && p.stock <= 0) return false;
    if (palabras.length) { const t = textoDe(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  if (FILTRO.orden === 'menor') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (FILTRO.orden === 'mayor') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (FILTRO.orden === 'porcion') lista = lista.slice().sort((a, b) => (a.porciones ? porPorcion(a) : Infinity) - (b.porciones ? porPorcion(b) : Infinity));
  return lista;
}

function tituloTienda() {
  if (FILTRO.cats.size === 1 && !FILTRO.objs.size) return CATS[[...FILTRO.cats][0]];
  if (FILTRO.objs.size === 1 && !FILTRO.cats.size) return OBJETIVOS[[...FILTRO.objs][0]];
  return 'Todos los productos';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.q) pills.push(['q', '', `«${FILTRO.q}»`]);
  FILTRO.objs.forEach(o => { if (!(FILTRO.objs.size === 1 && !FILTRO.cats.size)) pills.push(['obj', o, OBJETIVOS[o]]); });
  FILTRO.sabores.forEach(s => pills.push(['sabor', s, s]));
  FILTRO.precio.forEach(r => pills.push(['precio', r, RANGOS_TXT[r]]));
  if (FILTRO.stock) pills.push(['stock', '', 'Solo con stock']);
  cont.innerHTML = pills.map(([k, v, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('');
  cont.hidden = !pills.length;
}

function sincronizarControles() {
  document.querySelectorAll('input[data-f="cat"]').forEach(c => { c.checked = FILTRO.cats.has(c.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(c => { c.checked = FILTRO.precio.has(c.value); });
  document.querySelectorAll('.f-chip[data-obj]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.objs.has(b.dataset.obj))));
  document.querySelectorAll('.f-chip[data-sabor]').forEach(b => b.setAttribute('aria-pressed', String(FILTRO.sabores.has(b.dataset.sabor))));
  const stock = document.getElementById('f-stock');
  if (stock) stock.checked = FILTRO.stock;
  const una = FILTRO.cats.size === 1 ? [...FILTRO.cats][0] : (FILTRO.cats.size ? null : '');
  document.querySelectorAll('.chips-cat [data-cat]').forEach(b => b.setAttribute('aria-pressed', String(una !== null && b.dataset.cat === una && !FILTRO.objs.size)));
  const q = document.getElementById('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
}

let columnasMosaico = 0;
function aplicarMosaico() {
  const grid = document.getElementById('grid');
  if (!ES_M2 || !grid) return;
  const cards = [...grid.children];
  const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
  columnasMosaico = cols;
  cards.forEach(c => c.classList.remove('card--grande'));
  if (cols < 2 || cards.length < 5) return;
  const k = cards.findIndex(c => getProducto(c.dataset.id)?.hd);
  cards[k < 0 ? 0 : k].classList.add('card--grande');
}

function pintarCatalogo(reiniciar = true, yaVistos = 0) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  if (reiniciar) visibles = PASO;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, visibles).map((p, k) => cardHTML(p, k >= yaVistos)).join('');
  aplicarMosaico();
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const count = document.getElementById('cat-count');
  if (count) count.textContent = lista.length ? plural(lista.length, 'producto', 'productos') : 'Sin resultados';
  const tit = document.getElementById('t-tienda');
  if (tit) tit.textContent = tituloTienda();
  const mas = document.getElementById('ver-mas');
  const masN = document.getElementById('mas-n');
  const quedan = lista.length - visibles;
  if (mas) mas.hidden = quedan <= 0;
  if (masN) masN.textContent = quedan > 0 ? `Mostrando ${visibles} de ${lista.length}` : (lista.length > PASO ? `Estás viendo los ${lista.length}` : '');
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irATienda() {
  const t = document.getElementById('tienda');
  if (!t) return;
  t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() {
  FILTRO.q = ''; FILTRO.cats = new Set(); FILTRO.objs = new Set(); FILTRO.sabores = new Set(); FILTRO.precio = new Set(); FILTRO.stock = false;
}

function filtrarPor(tipo, valor, ir = true) {
  resetFiltros();
  if (tipo === 'cat' && valor) FILTRO.cats = new Set([valor]);
  if (tipo === 'obj' && valor) FILTRO.objs = new Set([valor]);
  pintarCatalogo();
  if (ir) irATienda();
}

function limpiarFiltros() {
  resetFiltros();
  pintarCatalogo();
}

function toggleSet(set, v) { if (set.has(v)) set.delete(v); else set.add(v); }

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim(); pintarCatalogo(); }, 180); });
  document.getElementById('busca-form')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value.trim() : '';
    pintarCatalogo();
    irATienda();
  });
  document.querySelectorAll('input[data-f="cat"]').forEach(c => c.addEventListener('change', () => {
    if (c.checked) FILTRO.cats.add(c.value); else FILTRO.cats.delete(c.value);
    pintarCatalogo();
  }));
  document.querySelectorAll('input[data-f="precio"]').forEach(c => c.addEventListener('change', () => {
    if (c.checked) FILTRO.precio.add(c.value); else FILTRO.precio.delete(c.value);
    pintarCatalogo();
  }));
  document.querySelectorAll('.f-chip[data-obj]').forEach(b => b.addEventListener('click', () => { toggleSet(FILTRO.objs, b.dataset.obj); pintarCatalogo(); }));
  document.querySelectorAll('.f-chip[data-sabor]').forEach(b => b.addEventListener('click', () => { toggleSet(FILTRO.sabores, b.dataset.sabor); pintarCatalogo(); }));
  document.getElementById('f-stock')?.addEventListener('change', e => { FILTRO.stock = e.target.checked; pintarCatalogo(); });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('f-clear')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vacio-reset')?.addEventListener('click', limpiarFiltros);
  document.getElementById('ver-mas')?.addEventListener('click', () => { const antes = visibles; visibles += PASO; pintarCatalogo(false, antes); });
  document.getElementById('pills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro;
    const v = b.dataset.valor || '';
    if (k === 'q') FILTRO.q = '';
    if (k === 'obj') FILTRO.objs.delete(v);
    if (k === 'sabor') FILTRO.sabores.delete(v);
    if (k === 'precio') FILTRO.precio.delete(v);
    if (k === 'stock') FILTRO.stock = false;
    pintarCatalogo();
  });
  const params = new URLSearchParams(location.search);
  const cat = params.get('cat');
  const obj = params.get('obj');
  let desdeURL = false;
  if (cat && CATS[cat]) { FILTRO.cats = new Set([cat]); desdeURL = true; }
  if (obj && OBJETIVOS[obj]) { FILTRO.objs = new Set([obj]); desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(irATienda, 60));
  if (ES_M2) {
    let r = 0;
    window.addEventListener('resize', () => {
      clearTimeout(r);
      r = setTimeout(() => {
        const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
        if (cols !== columnasMosaico) aplicarMosaico();
      }, 120);
    }, { passive: true });
  }
}

function pintarConteos() {
  document.querySelectorAll('[data-n]').forEach(el => {
    const [tipo, v] = el.dataset.n.split(':');
    const n = PRODUCTOS.filter(p => (tipo === 'cat' ? p.cat === v : p.obj.includes(v))).length;
    el.textContent = el.hasAttribute('data-n-txt') ? plural(n, 'producto', 'productos') : String(n);
  });
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = String(PRODUCTOS.length); });
  const desde = Math.min(...PRODUCTOS.filter(p => p.porciones).map(porPorcion));
  document.querySelectorAll('[data-desde-porcion]').forEach(el => { el.textContent = formatearPrecio(desde); });
}

function initFiltrosPanel() {
  const panel = document.getElementById('filtros');
  const toggle = document.getElementById('filtrosToggle');
  if (!panel || !toggle) return;
  const mq = window.matchMedia(ES_M2 ? '(min-width: 0px)' : '(max-width: 1024px)');
  let bd = null;
  const cerrar = () => {
    panel.classList.remove('open');
    bd?.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (mq.matches) panel.setAttribute('inert', '');
  };
  const abrir = () => {
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-bd'; bd.addEventListener('click', cerrar); document.body.appendChild(bd); }
    panel.removeAttribute('inert');
    panel.classList.add('open');
    bd.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    panel.querySelector('button, input')?.focus();
  };
  toggle.addEventListener('click', () => (panel.classList.contains('open') ? cerrar() : abrir()));
  document.getElementById('filtrosClose')?.addEventListener('click', () => { cerrar(); toggle.focus(); });
  document.getElementById('filtrosVer')?.addEventListener('click', () => { cerrar(); irATienda(); });
  document.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrar(); toggle.focus(); }
    if (e.key === 'Tab') trap(e, panel);
  });
  const sync = () => {
    if (mq.matches) { if (!panel.classList.contains('open')) panel.setAttribute('inert', ''); }
    else { panel.removeAttribute('inert'); if (panel.classList.contains('open')) cerrar(); }
  };
  mq.addEventListener('change', sync);
  sync();
}

/* ---------- ¿cuánto te dura? ---------- */
const DURA = { cat: 'proteina', id: 'whey-2lb', dias: new Set([0, 2, 4]), potes: 1, sabor: 'Vainilla' };

function calcularDura(p) {
  const porSemana = DURA.dias.size;
  if (!porSemana || !p || !p.porciones) return null;
  const tomas = p.porciones * DURA.potes;
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  let n = 0;
  for (let k = 0; k < 4000; k++) {
    if (DURA.dias.has((d.getDay() + 6) % 7)) { n++; if (n >= tomas) break; }
    d.setDate(d.getDate() + 1);
  }
  const pp = porPorcion(p);
  return { tomas, semanas: tomas / porSemana, fin: d, pp, semana: pp * porSemana };
}

function semanasTxt(s, tomas) {
  if (s < 1) return plural(tomas, 'toma', 'tomas');
  const v = Math.round(s * 10) / 10;
  return `${v.toLocaleString('es-AR', { maximumFractionDigits: 1 })} ${v === 1 ? 'semana' : 'semanas'}`;
}

function maxPotes(p) {
  return Math.max(1, Math.min(6, p.stock - Cart.enCarrito(p.id)));
}

function pintarDura() {
  const app = document.getElementById('dura-app');
  if (!app) return;
  const cfg = DURA_CATS[DURA.cat];
  const p = getProducto(DURA.id);
  if (!cfg || !p) return;
  app.querySelectorAll('input[name="dura-cat"]').forEach(r => { r.checked = r.value === DURA.cat; });
  const potes = document.getElementById('dura-potes');
  if (potes && potes.dataset.cat !== DURA.cat) {
    potes.dataset.cat = DURA.cat;
    potes.innerHTML = cfg.ids.map(getProducto).filter(Boolean).map(x => `<label class="pote"><input type="radio" name="dura-pote" value="${x.id}"><span class="pote__in"><b>${esc(x.corto)}</b><span>${plural(x.porciones, 'porción', 'porciones')} · ${formatearPrecio(precioFinal(x))}</span></span></label>`).join('');
  }
  potes?.querySelectorAll('input[name="dura-pote"]').forEach(r => { r.checked = r.value === DURA.id; });
  app.querySelectorAll('[data-dia]').forEach(b => b.setAttribute('aria-pressed', String(DURA.dias.has(Number(b.dataset.dia)))));
  const nota = document.getElementById('dura-nota');
  if (nota) nota.textContent = cfg.nota;
  DURA.potes = Math.min(DURA.potes, maxPotes(p));
  const r = calcularDura(p);
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  const n = document.getElementById('dura-n');
  if (r) {
    set('dura-n', semanasTxt(r.semanas, r.tomas));
    n?.classList.remove('is-vacio');
    set('dura-fin', fechaLarga(r.fin));
    set('dura-porcion', formatearPrecio(r.pp));
    set('dura-semana', formatearPrecio(r.semana));
  } else {
    set('dura-n', 'Marcá al menos un día');
    n?.classList.add('is-vacio');
    set('dura-fin', '—');
    set('dura-porcion', formatearPrecio(porPorcion(p)));
    set('dura-semana', '—');
  }
  set('dura-q', String(DURA.potes));
  const libre = p.stock - Cart.enCarrito(p.id);
  const menos = app.querySelector('[data-dura-paso="-1"]');
  const mas = app.querySelector('[data-dura-paso="1"]');
  if (menos) menos.disabled = DURA.potes <= 1;
  if (mas) mas.disabled = DURA.potes >= maxPotes(p);
  const wrap = document.getElementById('dura-sabor-wrap');
  const sel = document.getElementById('dura-sabor');
  if (wrap && sel) {
    wrap.hidden = !multiSabor(p);
    sel.innerHTML = p.sabores.map(s => `<option value="${esc(s)}"${s === DURA.sabor ? ' selected' : ''}>${esc(s)}</option>`).join('');
  }
  const add = document.getElementById('dura-add');
  if (add) {
    add.disabled = !r || libre <= 0;
    add.textContent = libre <= 0 ? 'Ya tenés todo el stock en el carrito' : (DURA.potes > 1 ? `Agregar ${DURA.potes} potes al carrito` : 'Agregar al carrito');
  }
  const ver = document.getElementById('dura-ver');
  if (ver) ver.textContent = `Ver ${cfg.ver.replace('{n}', PRODUCTOS.filter(x => x.cat === cfg.cat).length)}`;
}

function initDura() {
  const app = document.getElementById('dura-app');
  if (!app) return;
  const elegirCat = v => {
    const cfg = DURA_CATS[v];
    if (!cfg) return;
    DURA.cat = v;
    DURA.id = cfg.ids[0];
    DURA.dias = new Set(cfg.dias);
    DURA.potes = 1;
    DURA.sabor = saborDefault(getProducto(DURA.id));
    pintarDura();
  };
  const elegirPote = v => {
    const p = getProducto(v);
    if (!p) return;
    DURA.id = p.id;
    DURA.potes = 1;
    DURA.sabor = saborDefault(p);
    pintarDura();
  };
  app.addEventListener('change', e => {
    if (e.target.name === 'dura-cat') elegirCat(e.target.value);
    else if (e.target.name === 'dura-pote') elegirPote(e.target.value);
  });
  app.addEventListener('click', e => {
    const d = e.target.closest('[data-dia]');
    if (d) { toggleSet(DURA.dias, Number(d.dataset.dia)); pintarDura(); return; }
    const paso = e.target.closest('[data-dura-paso]');
    if (paso) {
      const p = getProducto(DURA.id);
      DURA.potes = Math.max(1, Math.min(maxPotes(p), DURA.potes + Number(paso.dataset.duraPaso)));
      pintarDura();
      return;
    }
    if (e.target.closest('#dura-add')) {
      const p = getProducto(DURA.id);
      if (!p) return;
      const sabor = p.sabores.length ? (multiSabor(p) ? DURA.sabor : p.sabores[0]) : '';
      const ok = Cart.add(p, DURA.potes, sabor);
      showToast(ok ? `Agregaste ${plural(ok, 'pote', 'potes')} de ${p.nombre}${conSabor(p, sabor)}.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    if (e.target.closest('#dura-ver')) {
      e.preventDefault();
      filtrarPor('cat', DURA_CATS[DURA.cat].cat);
    }
  });
  document.getElementById('dura-sabor')?.addEventListener('change', e => { DURA.sabor = e.target.value; pintarDura(); });
  DURA.sabor = saborDefault(getProducto(DURA.id));
  pintarDura();
}

/* ---------- cada cosa a su hora (momento) ---------- */
let diaActual = -1;

function diaTagHTML(k) {
  const s = DIA[k];
  const p = getProducto(s.id);
  if (!p) return '';
  const libre = p.stock - Cart.enCarrito(p.id);
  const sabores = multiSabor(p)
    ? `<label class="dia__sabor"><span>Sabor</span><select data-dia-sabor>${p.sabores.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('')}</select></label>`
    : '';
  return `<p class="dia__cuando mono">${s.hora} · ${esc(s.detalle)}</p>
    <div class="dia__fila"><p class="dia__prod">${esc(p.nombre)}</p><p class="dia__precio">${formatearPrecio(precioFinal(p))}</p></div>
    <p class="dia__dato mono">${plural(p.porciones, 'porción', 'porciones')} · ${formatearPrecio(porPorcion(p))} por porción</p>
    <div class="dia__compra">${sabores}<button type="button" class="btn btn--solid btn--sm" data-add-dia="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar</button></div>`;
}

function activarDia(k, animar = true) {
  if (k === diaActual || !DIA[k]) return;
  diaActual = k;
  document.querySelectorAll('#dia-track .dia__panel').forEach((el, i) => el.classList.toggle('is-activo', i === k));
  document.querySelectorAll('[data-dia-paso]').forEach((b, i) => { if (i === k) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  const tag = document.getElementById('dia-tag');
  if (!tag) return;
  tag.innerHTML = diaTagHTML(k);
  if (animar && !reduceMotion) { tag.classList.remove('is-cambio'); void tag.offsetWidth; tag.classList.add('is-cambio'); }
}

function horaTxt(min) {
  const m = Math.round(min);
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

function initDia() {
  const cont = document.getElementById('dia-cont');
  const track = document.getElementById('dia-track');
  const pista = document.getElementById('dia-pista');
  const reloj = document.getElementById('dia-hora');
  if (!cont || !track || !pista) return;
  const N = DIA.length;
  const escena = cont.querySelector('.dia__escena');
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const paso = () => { const a = track.children[0]; const b = track.children[1]; return a && b ? b.offsetLeft - a.offsetLeft : 0; };
  if (reduceMotion) {
    cont.classList.add('dia--estatico');
    const centrado = () => {
      const medio = pista.scrollLeft + pista.clientWidth / 2;
      let k = 0;
      [...track.children].forEach((panel, i) => { if (Math.abs(panel.offsetLeft + panel.offsetWidth / 2 - medio) < Math.abs(track.children[k].offsetLeft + track.children[k].offsetWidth / 2 - medio)) k = i; });
      activarDia(k, false);
      if (reloj) reloj.textContent = DIA[k].hora;
    };
    pista.addEventListener('scroll', centrado, { passive: true });
    centrado();
    return;
  }
  const recorrido = () => cont.offsetHeight - (escena ? escena.offsetHeight : window.innerHeight - OFF());
  let frame = 0;
  const medir = () => {
    frame = 0;
    const off = OFF();
    const total = recorrido();
    const p = total > 0 ? clamp01((off - cont.getBoundingClientRect().top) / total) : 0;
    const u = p * (N - 1);
    const i = Math.min(N - 2, Math.floor(u));
    const f = u - i;
    const t = clamp01((f - 0.22) / 0.56);
    const pos = i + t * t * (3 - 2 * t);
    track.style.transform = `translate3d(${(-pos * paso()).toFixed(1)}px, 0, 0)`;
    if (reloj) reloj.textContent = horaTxt(DIA[i].min + (DIA[i + 1].min - DIA[i].min) * f);
    activarDia(Math.round(pos));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  medir();
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function pedidoTexto() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre}${conSabor(p, i.sabor)} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola Impulso! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const libre = p.stock - Cart.enCarrito(p.id);
  const s = esc(i.sabor || '');
  return `<div class="linea">
    ${fotoHTML(p.foto, p.foco, 0.8, 'linea__img')}
    <div class="linea__info">
      <p class="linea__t">${esc(p.nombre)}</p>
      <p class="linea__m">${esc(CATS[p.cat])}${multiSabor(p) && i.sabor ? ` · ${s}` : ''}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea"><button type="button" data-linea="-1" data-id="${p.id}" data-sabor="${s}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" data-sabor="${s}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-sabor="${s}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Arrancá por las proteínas o calculá cuánto te dura un pote.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver los productos</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (foot) {
    foot.hidden = false;
    const tot = document.getElementById('drawer-total');
    if (tot) tot.textContent = formatearPrecio(Cart.total());
    const n = document.getElementById('drawer-n');
    if (n) n.textContent = plural(Cart.count(), 'producto', 'productos');
    const wsp = document.getElementById('drawer-wsp');
    if (wsp) wsp.href = wspLink(pedidoTexto());
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.hidden && dr.classList.contains('open')) return;
  const activo = document.activeElement;
  ultimoFoco = activo && activo.offsetParent !== null ? activo : document.getElementById('cart-header');
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  ultimoFoco?.focus?.();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  dr.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const p = getProducto(q.dataset.quitar);
      Cart.remove(q.dataset.quitar, q.dataset.sabor || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const sabor = paso.dataset.sabor || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && (x.sabor || '') === sabor);
      if (it) Cart.setQty(it.id, sabor, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); irATienda(); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (dr.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) pintarDrawer(); });
}

/* ---------- vista rápida ---------- */
let saborModal = '';

function modalHTML(p) {
  const libre = p.stock - Cart.enCarrito(p.id);
  const objs = p.obj.map(o => OBJETIVOS[o]).join(' · ');
  const sabores = multiSabor(p)
    ? `<fieldset class="m-sabores"><legend>Sabor</legend><div class="m-sabores__lista">${p.sabores.map(s => `<button type="button" class="m-sabor" data-sabor-modal="${esc(s)}" aria-pressed="${s === saborModal}"><i class="sw" data-sw="${SW[s] || ''}"></i>${esc(s)}</button>`).join('')}</div></fieldset>`
    : '';
  let stock = '<p class="m-stock">En stock</p>';
  if (p.stock <= 0) stock = '<p class="m-stock m-stock--sin">Sin stock por ahora. Consultanos cuándo vuelve.</p>';
  else if (libre <= 0) stock = '<p class="m-stock m-stock--sin">Ya tenés en el carrito todo el stock.</p>';
  else if (p.stock <= 3) stock = `<p class="m-stock m-stock--poco">Quedan ${p.stock}</p>`;
  const filas = p.info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd class="mono">${esc(v)}</dd></div>`).join('') + (p.porciones ? `<div><dt>Porciones por envase</dt><dd class="mono">${p.porciones}</dd></div>` : '');
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const relHTML = rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x.foto, x.foco, 0.8)}<span>${esc(x.nombre)}</span><b>${formatearPrecio(precioFinal(x))}</b></button></li>`).join('');
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p.foto, p.foco, 0.8, 'm-foto', ' id="m-foto"', p.alt)}
      <div class="m-vistas" role="group" aria-label="Fotos del producto">
        <button type="button" class="m-vista" data-m-vista="0" aria-pressed="true">El producto</button>
        <button type="button" class="m-vista" data-m-vista="1" aria-pressed="false">En la foto</button>
      </div>
    </div>
    <div class="m-info">
      <p class="m-cat">${esc(CATS[p.cat])}${objs ? ` · ${esc(objs)}` : ''}</p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      <div class="m-precio">${precioHTML(p)}${p.porciones ? `<p class="m-porcion mono">${plural(p.porciones, 'porción', 'porciones')} · ${formatearPrecio(porPorcion(p))} por porción</p>` : ''}</div>
      <p class="m-dosis">${esc(p.dosis)}</p>
      <p class="m-desc">${esc(p.desc)}</p>
      ${sabores}
      ${stock}
      <div class="m-compra">
        ${stepperHTML(p.id, ' stepper--modal')}
        <button type="button" class="btn btn--solid" data-add-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button>
      </div>
      <button type="button" class="btn btn--line btn--block" data-comprar-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      <a class="link m-wsp" id="m-wsp" href="${wspLink(`Hola Impulso! Quiero consultar por ${p.nombre}${conSabor(p, saborModal)}.`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      <div class="etiqueta m-label"><p class="etiqueta__k">${p.porciones ? 'Información por porción' : 'Ficha del producto'}</p><dl class="etiqueta__filas">${filas}</dl></div>
      ${relHTML ? `<div class="m-rels"><p class="m-rels__t">También en ${esc(CATS[p.cat])}</p><ul>${relHTML}</ul></div>` : ''}
    </div>
  </div>`;
}

function inyectarLD(p) {
  document.getElementById('ld-producto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ld-producto';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(FOTOS[p.foto].src, location.href).href,
    description: p.desc, category: CATS[p.cat], brand: { '@type': 'Brand', name: 'Impulso' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: String(precioFinal(p)), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  });
  document.head.appendChild(ld);
}

function abrirModal(id, sabor = '') {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modal-content');
  if (!p || !modal || !cont) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  saborModal = sabor && p.sabores.includes(sabor) ? sabor : saborDefault(p);
  cont.innerHTML = modalHTML(p);
  cont.scrollTop = 0;
  modal.setAttribute('aria-label', p.nombre);
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
  inyectarLD(p);
  try { window.history.replaceState(null, '', `${location.pathname}?producto=${p.id}`); } catch { return; }
}

function cerrarModal(sinFoco) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  document.getElementById('ld-producto')?.remove();
  if (!sinFoco) ultimoFoco?.focus?.();
  try { window.history.replaceState(null, '', location.pathname); } catch { return; }
}

function cantidadDe(cont) {
  const out = cont?.querySelector('output');
  return out ? Math.max(1, Number(out.textContent) || 1) : 1;
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const vista = e.target.closest('[data-m-vista]');
    if (vista) {
      const p = getProducto(modal.querySelector('[data-add-modal]')?.dataset.addModal);
      const foto = document.getElementById('m-foto');
      if (!p || !foto) return;
      const k = Number(vista.dataset.mVista);
      foto.setAttribute('style', recorte(p.foto, k ? [p.foco[0], p.foco[1], 1] : p.foco, 0.8));
      modal.querySelectorAll('[data-m-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
    const s = e.target.closest('[data-sabor-modal]');
    if (s) {
      saborModal = s.dataset.saborModal;
      modal.querySelectorAll('[data-sabor-modal]').forEach(b => b.setAttribute('aria-pressed', String(b === s)));
      const p = getProducto(modal.querySelector('[data-add-modal]')?.dataset.addModal);
      const wsp = document.getElementById('m-wsp');
      if (p && wsp) wsp.href = wspLink(`Hola Impulso! Quiero consultar por ${p.nombre}${conSabor(p, saborModal)}.`);
      return;
    }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (add) {
      const p = getProducto(add.dataset.addModal || add.dataset.comprarModal);
      if (!p) return;
      const sabor = p.sabores.length ? (multiSabor(p) ? saborModal : p.sabores[0]) : '';
      const ok = Cart.add(p, cantidadDe(modal.querySelector('.stepper--modal')), sabor);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de este producto.'); return; }
      if (add.dataset.comprarModal) { cerrarModal(true); abrirDrawer(); return; }
      showToast(`Agregaste ${p.nombre}${conSabor(p, sabor)} al carrito.`);
    }
  });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirModal(id);
}

/* ---------- acciones ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('.stepper');
      const out = st?.querySelector('output');
      const p = getProducto(st?.dataset.stepper);
      if (!out || !p) return;
      const libre = Math.max(1, p.stock - Cart.enCarrito(p.id));
      out.textContent = String(Math.max(1, Math.min(libre, (Number(out.textContent) || 1) + Number(paso.dataset.paso))));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      if (multiSabor(p)) { abrirModal(p.id); return; }
      const ok = Cart.add(p, cantidadDe(add.closest('.card')?.querySelector('.stepper')), p.sabores[0] || '');
      showToast(ok ? `Agregaste ${plural(ok, 'unidad', 'unidades')} de ${p.nombre}.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      if (multiSabor(p)) { abrirModal(p.id); return; }
      Cart.add(p, cantidadDe(comprar.closest('.card')?.querySelector('.stepper')), p.sabores[0] || '');
      abrirDrawer();
      return;
    }
    const addDia = e.target.closest('[data-add-dia]');
    if (addDia) {
      const p = getProducto(addDia.dataset.addDia);
      if (!p) return;
      const sel = addDia.closest('.dia__tag')?.querySelector('[data-dia-sabor]');
      const sabor = p.sabores.length ? (sel ? sel.value : p.sabores[0]) : '';
      const ok = Cart.add(p, 1, sabor);
      showToast(ok ? `Agregaste ${p.nombre}${conSabor(p, sabor)} al carrito.` : 'Ya tenés en el carrito todo el stock de este producto.');
      return;
    }
    const obj = e.target.closest('[data-ir-obj]');
    if (obj) { e.preventDefault(); filtrarPor('obj', obj.dataset.irObj); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#modal')) {
      e.preventDefault();
      filtrarPor('cat', cat.dataset.cat, !cat.closest('#tienda'));
      return;
    }
    if (e.target.closest('[data-ir-busqueda]')) {
      irATienda();
      setTimeout(() => document.getElementById('q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    }
  });
}

function refrescarVistas() {
  document.querySelectorAll('#grid .card').forEach(card => {
    const p = getProducto(card.dataset.id);
    if (!p) return;
    const t = document.createElement('template');
    t.innerHTML = cardHTML(p, false);
    card.replaceChildren(...t.content.firstElementChild.childNodes);
  });
  const tag = document.getElementById('dia-tag');
  const btn = tag?.querySelector('[data-add-dia]');
  if (btn) {
    const p = getProducto(btn.dataset.addDia);
    if (p) btn.disabled = p.stock - Cart.enCarrito(p.id) <= 0;
  }
  pintarDura();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', refrescarVistas);

/* ---------- entradas ---------- */
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

/* ---------- hero y texto que se lee ---------- */
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const panel = hero.querySelector('.etiqueta--hero');
  if (panel) tl.from(panel, { y: 36, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter,transform,opacity' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-dato'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      }
    });
  });
}

/* ---------- menú ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
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

/* ---------- flotantes ---------- */
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

/* ---------- barra de modelos ---------- */
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

/* ---------- arranque ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
  sanearCarrito();
  pintarConteos();
  initModelBarScroll();
  initCatalogo();
  initDura();
  initDia();
  initReveals();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  initLeeScroll();
  initHeroMotion();
  initNav();
  initFiltrosPanel();
  initDrawer();
  initModal();
  initAcciones();
  initFloats();
  updateCartBadge();
  abrirDesdeURL();
});
