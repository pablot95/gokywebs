const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492281312467';
const MARCA = 'Todo Aberturas';
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
  casa: { src: 'images/obra-casa-gran-luz.webp', w: 1672, h: 941 },
  terraza: { src: 'images/obra-terraza.webp', w: 941, h: 1672 },
  colocacion: { src: 'images/obra-colocacion.webp', w: 1254, h: 1254 },
  taller: { src: 'images/taller-montaje.webp', w: 1254, h: 1254 },
  living: { src: 'images/obra-living-4-hojas.webp', w: 1254, h: 1254 },
  ventana: { src: 'images/ventana-corrediza.webp', w: 1254, h: 1254 }
};

const CATS = { ventanas: 'Ventanas corredizas', 'puertas-ventana': 'Puertas-ventana', 'gran-luz': 'Gran luz, 3 y 4 hojas', panos: 'Paños fijos', ventiluces: 'Ventiluces', puertas: 'Puertas de abrir', accesorios: 'Premarcos' };
const CATS_CORTO = { ventanas: 'ventanas', 'puertas-ventana': 'puertas-ventana', 'gran-luz': 'ventanales', panos: 'paños fijos', ventiluces: 'ventiluces', puertas: 'puertas', accesorios: 'premarcos' };
const AMBIENTES = { living: 'Living y salida al patio', dormitorio: 'Dormitorios, cocina y baño', obra: 'Obra nueva y recambio' };
const LINEAS = { t: 'Tradicional', m: 'Media prestación' };
const COLORES = { blanco: { n: 'Blanco', f: 1 }, negro: { n: 'Negro', f: 1.15 }, natural: { n: 'Natural anodizado', f: 1.2 }, madera: { n: 'Símil madera', f: 1.45 } };
const VIDRIOS = { f3: { n: 'Float 3 mm', f: 1 }, f4: { n: 'Float 4 mm', f: 1 }, lam: { n: 'Laminado 3+3', f: 1.4 }, dvh: { n: 'DVH 4/9/4', f: 1.5 }, sti: { n: 'Stipolite 4 mm', f: 1 } };
const ANCHOS = { chico: [0, 120], medio: [121, 200], grande: [201, 100000] };
const ANCHOS_TXT = { chico: 'Hasta 120 cm', medio: 'De 121 a 200 cm', grande: 'Más de 200 cm' };
const MOSQ_F = 1.12;
const PRECIO_MAX = 1400000;

const M = (k, precio, stock) => { const [a, h] = k.split('x').map(Number); return { k, a, h, precio, stock }; };

const PRODUCTOS = [
  { id: 'vc2-t', cod: 'TA-VC2-T', cat: 'ventanas', tipo: 'ventana', linea: 't', hojas: 2, nombre: 'Ventana corrediza 2 hojas', prio: 1,
    foto: 'ventana', foco: [0.5, 0.5, 1], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: true, amb: ['dormitorio', 'obra'],
    medidas: [M('100x110', 118900, 9), M('120x110', 139900, 7), M('150x110', 164900, 12), M('200x110', 219900, 4)], def: '150x110',
    spec: '2 hojas · float 3 mm o laminado',
    desc: 'La corrediza de todos los días: dos hojas sobre guía, con burletes y felpas para que cierre parejo. Para dormitorios, cocinas y comedores.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Colocación', 'Con premarco o amurada con grapas']],
    alt: 'Ventana corrediza de aluminio natural de dos hojas en una pared blanca' },
  { id: 'vc2-m', cod: 'TA-VC2-M', cat: 'ventanas', tipo: 'ventana', linea: 'm', hojas: 2, nombre: 'Ventana corrediza 2 hojas', prio: 6,
    foto: 'ventana', foco: [0.5, 0.5, 1], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['dormitorio'],
    medidas: [M('100x110', 189900, 6), M('120x110', 224900, 6), M('150x110', 269900, 8), M('200x110', 419900, 3)], def: '150x110',
    spec: '2 hojas · float 4 mm, laminado o DVH',
    desc: 'Perfil más robusto y hojas más pesadas, que aceptan doble vidriado hermético (DVH) para aislar mejor del frío y del ruido.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Colocación', 'Con premarco o amurada con grapas']],
    alt: 'Ventana corrediza de aluminio de dos hojas en una pared blanca' },
  { id: 'pv2-t', cod: 'TA-PV2-T', cat: 'puertas-ventana', tipo: 'puerta-ventana', linea: 't', hojas: 2, nombre: 'Puerta-ventana corrediza 2 hojas', prio: 2, descuento: 10,
    foto: 'terraza', foco: [0.5, 0.45, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: true, amb: ['living', 'obra'],
    medidas: [M('150x200', 299900, 5), M('180x200', 349900, 6), M('200x200', 369900, 4)], def: '180x200',
    spec: '2 hojas · de piso a dintel',
    desc: 'Para salir al patio o al balcón: dos hojas corredizas de piso a dintel, con cierre lateral embutido.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Cierre', 'Lateral embutido']],
    alt: 'Puerta-ventana corrediza negra de dos hojas abierta hacia una terraza' },
  { id: 'pv2-m', cod: 'TA-PV2-M', cat: 'puertas-ventana', tipo: 'puerta-ventana', linea: 'm', hojas: 2, nombre: 'Puerta-ventana corrediza 2 hojas', prio: 8,
    foto: 'terraza', foco: [0.5, 0.45, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('150x200', 449900, 4), M('180x200', 529900, 5), M('200x200', 579900, 3)], def: '200x200',
    spec: '2 hojas · acepta DVH',
    desc: 'La puerta-ventana de media prestación: hojas más anchas y pesadas, ruedas a rulemán y la opción de DVH para el living.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Puerta-ventana corrediza negra de dos hojas abierta hacia una terraza con árboles' },
  { id: 'pv3-m', cod: 'TA-PV3-M', cat: 'gran-luz', tipo: 'puerta-ventana', linea: 'm', hojas: 3, nombre: 'Puerta-ventana corrediza 3 hojas', prio: 3,
    foto: 'casa', foco: [0.62, 0.5, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('270x200', 799900, 2), M('300x200', 869900, 3), M('300x220', 949900, 2)], def: '300x200',
    spec: '3 hojas · acepta DVH',
    desc: 'Tres hojas corredizas para abrir la galería o el quincho casi de punta a punta.',
    ficha: [['Apertura', 'Corrediza, 3 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Puerta-ventana corrediza negra de tres hojas en una casa con galería' },
  { id: 'pv4-m', cod: 'TA-PV4-M', cat: 'gran-luz', tipo: 'puerta-ventana', linea: 'm', hojas: 4, nombre: 'Ventanal corredizo 4 hojas', prio: 4,
    foto: 'living', foco: [0.5, 0.5, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('300x200', 979900, 2), M('360x200', 1149900, 2), M('400x220', 1389900, 1)], def: '360x200',
    spec: '4 hojas · acepta DVH',
    desc: 'Cuatro hojas que se corren hacia los costados y dejan el centro libre: el living queda abierto al patio.',
    ficha: [['Apertura', 'Corrediza, 4 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Ventanal corredizo negro de cuatro hojas en un living luminoso' },
  { id: 'pf-m', cod: 'TA-PF-M', cat: 'panos', tipo: 'pano', linea: 'm', hojas: 0, nombre: 'Paño fijo', prio: 5,
    foto: 'casa', foco: [0.3, 0.5, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: false, amb: ['living'],
    medidas: [M('60x110', 119900, 6), M('100x110', 149900, 5), M('150x110', 184900, 4), M('100x200', 239900, 3)], def: '100x200',
    spec: 'Fijo · acepta DVH',
    desc: 'Vidrio que no abre, para sumar luz al lado de una puerta-ventana o en una pared donde no hace falta ventilar.',
    ficha: [['Apertura', 'Paño fijo'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Uso', 'Solo o junto a una corrediza']],
    alt: 'Frente vidriado de una casa con galería y pileta' },
  { id: 'vl-t', cod: 'TA-VL-T', cat: 'ventiluces', tipo: 'ventiluz', linea: 't', hojas: 1, nombre: 'Ventiluz proyectante', prio: 9,
    foto: null, slot: 'ventiluz.webp', colores: ['blanco', 'negro', 'natural'], vidrios: ['sti'], mosq: false, amb: ['dormitorio'],
    medidas: [M('40x40', 54900, 10), M('60x40', 69900, 8), M('80x40', 84900, 6)], def: '60x40',
    spec: 'Proyectante · vidrio stipolite',
    desc: 'Para baños, lavaderos y cocinas: abre hacia afuera desde arriba y ventila aunque llueva. El stipolite deja pasar la luz pero no la vista.',
    ficha: [['Apertura', 'Proyectante, con brazo de empuje'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Stipolite 4 mm'], ['Uso', 'Baño, lavadero o cocina']],
    alt: 'Ventiluz proyectante de aluminio' },
  { id: 'pa-t', cod: 'TA-PA-T', cat: 'puertas', tipo: 'puerta', linea: 't', hojas: 1, nombre: 'Puerta de abrir medio vidrio', prio: 10,
    foto: null, slot: 'puerta-de-abrir.webp', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: false, amb: ['obra'],
    medidas: [M('70x200', 269900, 3), M('80x200', 289900, 5), M('90x200', 309900, 4)], def: '80x200',
    spec: '1 hoja · medio vidrio',
    desc: 'Puerta de una hoja con la mitad de arriba vidriada, para entradas de servicio, patios y lavaderos.',
    ficha: [['Apertura', 'De abrir, 1 hoja'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Mano', 'Derecha o izquierda, a pedido']],
    alt: 'Puerta de aluminio de una hoja con medio vidrio' },
  { id: 'premarco', cod: 'TA-PM', cat: 'accesorios', tipo: 'premarco', linea: null, hojas: 0, nombre: 'Premarco de aluminio', prio: 7,
    foto: 'taller', foco: [0.5, 0.5, 1], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural'], vidrios: [], mosq: false, amb: ['obra'],
    medidas: [M('100x110', 39900, 20), M('150x110', 46900, 20), M('200x110', 54900, 12), M('180x200', 69900, 10), M('200x200', 74900, 10)], def: '150x110',
    spec: 'Para colocar en seco',
    desc: 'Se amura en la obra antes de terminar el revoque, y la abertura se coloca después, en seco, sin romper nada.',
    ficha: [['Uso', 'Colocación en seco con contramarco'], ['Perfil', 'Aluminio de primera fundición'], ['Medidas', 'Las mismas de la abertura'], ['Para', 'Obra nueva']],
    alt: 'Marco de aluminio armándose sobre la mesa del taller' }
];

const OBRAS = [
  { foto: 'casa', pos: '64% 50%', t1: 'La galería,', t2: 'abierta de punta a punta', tipologia: 'Puerta-ventana corrediza, 3 hojas', linea: 'm', color: 'negro', vidrio: 'dvh', ancho: 450, alto: 250, cat: 'gran-luz', tipo: 'puerta-ventana' },
  { foto: 'living', pos: '50% 40%', t1: 'El lago', t2: 'entra al living', tipologia: 'Ventanal corredizo, 4 hojas', linea: 'm', color: 'negro', vidrio: 'dvh', ancho: 400, alto: 240, cat: 'gran-luz', tipo: 'puerta-ventana' },
  { foto: 'terraza', pos: '48% 44%', t1: 'Un paso', t2: 'y estás en la terraza', tipologia: 'Puerta-ventana corrediza, 2 hojas', linea: 'm', color: 'negro', vidrio: 'lam', ancho: 180, alto: 230, cat: 'puertas-ventana', tipo: 'puerta-ventana' },
  { foto: 'ventana', pos: '50% 46%', t1: 'La de todos los días,', t2: 'en aluminio natural', tipologia: 'Ventana corrediza, 2 hojas', linea: 't', color: 'natural', vidrio: 'f3', ancho: 150, alto: 110, cat: 'ventanas', tipo: 'ventana' }
];

const DESTACADOS = ['vc2-t', 'pv3-m', 'pv2-t', 'pv4-m', 'vc2-m', 'pf-m', 'pv2-m', 'premarco'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s*[x×]\s*(?=\d)/g, 'x');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const fmtDec = (n, d) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtM2 = m2 => `${fmtDec(m2, 2)} m²`;
const redondeo = n => Math.max(900, Math.round(n / 1000) * 1000 - 100);
const nombreLinea = p => (p.linea ? `${p.nombre} · ${LINEAS[p.linea]}` : p.nombre);
const medidaTxt = m => `${m.a} × ${m.h} cm`;
const medidaDe = (p, k) => p.medidas.find(m => m.k === k) || null;

function armarVar(p, o = {}) {
  const medida = medidaDe(p, o.medida) ? o.medida : p.def;
  const color = p.colores.includes(o.color) ? o.color : (p.colorFoto && p.colores.includes(p.colorFoto) ? p.colorFoto : p.colores[0]);
  const vidrio = p.vidrios.includes(o.vidrio) ? o.vidrio : (p.vidrios[0] || '');
  const mosq = p.mosq && o.mosq ? 1 : 0;
  return `${medida}|${color}|${vidrio}|${mosq}`;
}
function leerVar(p, v) {
  const [medida = '', color = '', vidrio = '', mosq = '0'] = String(v || '').split('|');
  return { medida, color, vidrio, mosq: mosq === '1' };
}
function varValida(p, v) {
  const o = leerVar(p, v);
  return !!medidaDe(p, o.medida) && p.colores.includes(o.color) && (p.vidrios.length ? p.vidrios.includes(o.vidrio) : o.vidrio === '') && (!o.mosq || p.mosq);
}
function precioBase(p, v) {
  const o = leerVar(p, v);
  const m = medidaDe(p, o.medida);
  if (!m) return 0;
  const f = (COLORES[o.color]?.f || 1) * (o.vidrio ? VIDRIOS[o.vidrio]?.f || 1 : 1) * (o.mosq ? MOSQ_F : 1);
  return f === 1 ? m.precio : redondeo(m.precio * f);
}
function precioFinal(p, v) {
  const b = precioBase(p, v);
  return p.descuento > 0 ? redondeo(b * (1 - p.descuento / 100)) : b;
}
function desdeBase(p) {
  return Math.min(...p.medidas.map(m => precioBase(p, `${m.k}|${p.colores[0]}|${p.vidrios[0] || ''}|0`)));
}
function desde(p) {
  return Math.min(...p.medidas.map(m => precioFinal(p, `${m.k}|${p.colores[0]}|${p.vidrios[0] || ''}|0`)));
}
const stockDe = (p, v) => medidaDe(p, leerVar(p, v).medida)?.stock ?? 0;
function varTxt(p, v) {
  const o = leerVar(p, v);
  const m = medidaDe(p, o.medida);
  return [m ? medidaTxt(m) : '', COLORES[o.color]?.n || '', o.vidrio ? VIDRIOS[o.vidrio]?.n : '', o.mosq ? 'con mosquitero' : ''].filter(Boolean).join(' · ');
}

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
  const pct = n => (n * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

function fotoHTML(p, ar, clase = '', extra = '') {
  if (!p.foto) {
    return `<span class="recorte recorte--pendiente ${clase}"${extra} role="img" aria-label="${esc(p.alt)}" data-foto-esperada="images/${esc(p.slot)}" style="--ar:${ar};--pend:url('images/${esc(p.slot)}')"></span>`;
  }
  const f = FOTOS[p.foto];
  return `<span class="recorte ${clase}"${extra} style="--ar:${ar};${recorte(p.foto, p.foco, ar)}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="${esc(p.alt)}"></span>`;
}

function aplicarRecortes() {
  document.querySelectorAll('.recorte[data-foto]').forEach(el => {
    const foco = (el.dataset.foco || '0.5,0.5,1').split(',').map(Number);
    const w = el.clientWidth;
    const h = el.clientHeight;
    const ar = w > 0 && h > 0 ? w / h : 1;
    const css = recorte(el.dataset.foto, foco, ar);
    css.split(';').forEach(par => { const [k, v] = par.split(':'); if (k && v) el.style.setProperty(k, v); });
  });
}

const Cart = {
  KEY: 'todoaberturas_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { showToast('Este navegador no deja guardar el carrito. Probá sin modo privado.'); }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enCarrito(id, medida) { return this.get().filter(i => i.id === id && String(i.v || '').split('|')[0] === medida).reduce((s, i) => s + i.qty, 0); },
  libre(p, v) { return stockDe(p, v) - this.enCarrito(p.id, leerVar(p, v).medida); },
  add(producto, qty = 1, v = '') {
    if (!varValida(producto, v)) return 0;
    const items = this.get();
    const suma = Math.max(0, Math.min(qty, this.libre(producto, v)));
    if (!suma) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id);
    const otros = p ? this.enCarrito(id, leerVar(p, v).medida) - it.qty : 0;
    it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) - otros : 99));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); }
};

function sanearCarrito() {
  let items;
  try { items = JSON.parse(localStorage.getItem(Cart.KEY)) || []; } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  const limpios = [];
  items.forEach(i => {
    const p = i && getProducto(i.id);
    if (!p || !varValida(p, i.v)) return;
    const medida = leerVar(p, i.v).medida;
    const ya = limpios.filter(x => x.id === p.id && leerVar(p, x.v).medida === medida).reduce((s, x) => s + x.qty, 0);
    const qty = Math.min(Math.max(1, Math.floor(Number(i.qty)) || 1), stockDe(p, i.v) - ya);
    const igual = limpios.find(x => x.id === p.id && x.v === i.v);
    if (qty > 0) { if (igual) igual.qty += qty; else limpios.push({ id: p.id, v: i.v, qty }); }
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

const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function precioDesdeHTML(p) {
  const o = p.descuento > 0 ? desdeBase(p) : 0;
  return `<p class="precio"><span class="precio__u">Desde</span><span class="precio__f">${formatearPrecio(desde(p))}</span>${o ? `<s class="precio__o">${formatearPrecio(o)}</s>` : ''}</p>`;
}

/* ---------- tarjeta ---------- */
const AR_CARD = 1;

function cardHTML(p, animar = true) {
  const badges = [
    p.descuento > 0 ? `<span class="badge badge--off">−${p.descuento}%</span>` : '',
    p.vidrios.includes('dvh') ? '<span class="badge badge--dvh">Acepta DVH</span>' : ''
  ].join('');
  return `<article class="card" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
    ${fotoHTML(p, AR_CARD, 'card__img', ` data-quick="${p.id}"`)}
    <div class="card__badges">${badges}</div>
    <div class="card__info">
      <p class="card__cod"><b>${esc(p.cod)}</b><span>${p.linea ? esc(LINEAS[p.linea]) : 'Para obra'} · ${p.medidas.length} medidas</span></p>
      <h3 class="card__t">${esc(p.nombre)}</h3>
      <div class="card__fila">
        ${precioDesdeHTML(p)}
        <button type="button" class="card__cta" data-quick="${p.id}" aria-label="Elegir medida y color de ${esc(nombreLinea(p))}"><span class="card__cta-t">Elegir medida</span>${ICONO_FLECHA}</button>
      </div>
    </div>
  </article>`;
}

/* ---------- catálogo ---------- */
const PASO = 16;
let visibles = PASO;
const FILTRO = { q: '', tipos: new Set(), lineas: new Set(), colores: new Set(), anchos: new Set(), dvh: false, precioMax: PRECIO_MAX, amb: '', orden: 'recomendados' };

function textoDe(p) {
  return normal([
    p.nombre, p.cod, CATS[p.cat], p.linea ? LINEAS[p.linea] : '', p.spec, p.desc,
    ...p.colores.map(c => COLORES[c].n), ...p.vidrios.map(v => VIDRIOS[v].n), ...p.amb.map(a => AMBIENTES[a]),
    ...p.medidas.map(m => `${m.a}x${m.h} ${m.k}`), ...p.ficha.map(f => f.join(' ')), p.vidrios.includes('dvh') ? 'dvh doble vidriado hermetico' : ''
  ].join(' '));
}

function pasaFiltros(p, f = FILTRO) {
  if (f.tipos.size && !f.tipos.has(p.cat)) return false;
  if (f.lineas.size && !(p.linea && f.lineas.has(p.linea))) return false;
  if (f.colores.size && !p.colores.some(c => f.colores.has(c))) return false;
  if (f.anchos.size && !p.medidas.some(m => [...f.anchos].some(b => m.a >= ANCHOS[b][0] && m.a <= ANCHOS[b][1]))) return false;
  if (f.dvh && !p.vidrios.includes('dvh')) return false;
  if (f.precioMax < PRECIO_MAX && desde(p) > f.precioMax) return false;
  if (f.amb && !p.amb.includes(f.amb)) return false;
  return true;
}

function filtrar(f = FILTRO) {
  const palabras = normal(f.q).split(/\s+/).filter(Boolean);
  let lista = PRODUCTOS.filter(p => {
    if (!pasaFiltros(p, f)) return false;
    if (palabras.length) { const t = textoDe(p); if (!palabras.every(w => t.includes(w))) return false; }
    return true;
  });
  const anchoMax = p => Math.max(...p.medidas.map(m => m.a));
  if (f.orden === 'menor') lista = lista.slice().sort((a, b) => desde(a) - desde(b));
  else if (f.orden === 'mayor') lista = lista.slice().sort((a, b) => desde(b) - desde(a));
  else if (f.orden === 'ancho') lista = lista.slice().sort((a, b) => anchoMax(b) - anchoMax(a));
  else {
    const enNombre = p => (palabras.length && palabras.every(w => normal(p.nombre + ' ' + p.cod).includes(w)) ? 0 : 1);
    lista = lista.slice().sort((a, b) => (enNombre(a) - enNombre(b)) || (a.prio - b.prio) || (PRODUCTOS.indexOf(a) - PRODUCTOS.indexOf(b)));
  }
  return lista;
}

function cantFiltros() {
  return (FILTRO.tipos.size ? 1 : 0) + (FILTRO.lineas.size ? 1 : 0) + (FILTRO.colores.size ? 1 : 0) + (FILTRO.anchos.size ? 1 : 0) + (FILTRO.dvh ? 1 : 0) + (FILTRO.precioMax < PRECIO_MAX ? 1 : 0) + (FILTRO.amb ? 1 : 0);
}
function hayFiltros() { return !!FILTRO.q || cantFiltros() > 0; }

function pintarTitulo() {
  const tit = document.getElementById('t-tienda');
  if (!tit) return;
  const soloTipo = FILTRO.tipos.size === 1 && !FILTRO.q && cantFiltros() === 1;
  if (soloTipo) tit.innerHTML = `${esc(CATS[[...FILTRO.tipos][0]])}, <em>precio a la vista</em>`;
  else if (FILTRO.amb && cantFiltros() === 1 && !FILTRO.q) tit.innerHTML = `Para ${esc(AMBIENTES[FILTRO.amb].toLowerCase())}, <em>precio a la vista</em>`;
  else tit.innerHTML = 'Medidas estándar, <em>precio a la vista</em>';
}

function pintarPills() {
  const cont = document.getElementById('pills');
  if (!cont) return;
  const pills = [];
  if (FILTRO.q) pills.push(['q', '', `«${FILTRO.q}»`]);
  if (FILTRO.amb) pills.push(['amb', '', AMBIENTES[FILTRO.amb]]);
  FILTRO.tipos.forEach(t => pills.push(['tipo', t, CATS[t]]));
  FILTRO.lineas.forEach(t => pills.push(['linea', t, `Línea ${LINEAS[t].toLowerCase()}`]));
  FILTRO.colores.forEach(t => pills.push(['color', t, COLORES[t].n]));
  FILTRO.anchos.forEach(t => pills.push(['ancho', t, ANCHOS_TXT[t]]));
  if (FILTRO.dvh) pills.push(['dvh', '', 'Acepta DVH']);
  if (FILTRO.precioMax < PRECIO_MAX) pills.push(['precio', '', `Hasta ${formatearPrecio(FILTRO.precioMax)}`]);
  const hay = hayFiltros();
  cont.innerHTML = pills.map(([k, v, t]) => `<button type="button" class="pill" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar el filtro ${esc(t)}">${esc(t)}<span aria-hidden="true">×</span></button>`).join('') +
    (hay ? '<button type="button" class="pills__limpiar" data-limpiar>Limpiar filtros</button>' : '');
  cont.hidden = !hay;
}

function sincronizarControles() {
  document.querySelectorAll('#filtros input[data-f]').forEach(i => {
    const f = i.dataset.f;
    if (f === 'tipo') i.checked = FILTRO.tipos.has(i.value);
    else if (f === 'linea') i.checked = FILTRO.lineas.has(i.value);
    else if (f === 'color') i.checked = FILTRO.colores.has(i.value);
    else if (f === 'ancho') i.checked = FILTRO.anchos.has(i.value);
    else if (f === 'dvh') i.checked = FILTRO.dvh;
    else if (f === 'precio') i.value = String(FILTRO.precioMax);
  });
  const out = document.getElementById('f-precio-v');
  if (out) out.textContent = `Hasta ${formatearPrecio(FILTRO.precioMax)}`;
  document.querySelectorAll('.chips [data-cat]').forEach(b => {
    const k = b.dataset.cat;
    const activo = k ? FILTRO.tipos.size === 1 && FILTRO.tipos.has(k) : FILTRO.tipos.size === 0;
    b.setAttribute('aria-pressed', String(activo));
  });
  const q = document.getElementById('q');
  if (q && q.value !== FILTRO.q) q.value = FILTRO.q;
  const orden = document.getElementById('orden');
  if (orden) orden.value = FILTRO.orden;
  const n = cantFiltros();
  document.querySelectorAll('[data-nfiltros]').forEach(el => { el.textContent = String(n); el.hidden = n === 0; });
}

function pintarCatalogo(reiniciar = true, yaVistos = 0) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  if (reiniciar) visibles = PASO;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, visibles).map((p, k) => cardHTML(p, k >= yaVistos)).join('');
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const count = document.getElementById('cat-count');
  if (count) count.textContent = lista.length ? plural(lista.length, 'abertura', 'aberturas') : 'Sin resultados';
  const mas = document.getElementById('ver-mas');
  if (mas) mas.hidden = lista.length - visibles <= 0;
  const ver = document.getElementById('filtros-ver');
  if (ver) ver.textContent = lista.length ? `Ver ${plural(lista.length, 'abertura', 'aberturas')}` : 'Sin resultados';
  pintarTitulo();
  pintarPills();
  sincronizarControles();
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function irA(id) {
  const t = document.getElementById(id);
  if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function resetFiltros() {
  FILTRO.q = ''; FILTRO.tipos.clear(); FILTRO.lineas.clear(); FILTRO.colores.clear(); FILTRO.anchos.clear();
  FILTRO.dvh = false; FILTRO.precioMax = PRECIO_MAX; FILTRO.amb = '';
}

function filtrarPor(cambios, ir = true) {
  resetFiltros();
  if (cambios.tipos) cambios.tipos.forEach(t => { if (CATS[t]) FILTRO.tipos.add(t); });
  if (cambios.amb && AMBIENTES[cambios.amb]) FILTRO.amb = cambios.amb;
  if (cambios.q) FILTRO.q = cambios.q;
  pintarCatalogo();
  if (ir) irA('tienda');
}

function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const q = document.getElementById('q');
  let t = 0;
  q?.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { FILTRO.q = q.value.trim().slice(0, 60); pintarCatalogo(); }, 200); });
  document.getElementById('busca-form')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value.trim().slice(0, 60) : '';
    pintarCatalogo();
    irA('tienda');
  });
  document.getElementById('orden')?.addEventListener('change', e => { FILTRO.orden = e.target.value; pintarCatalogo(); });
  document.getElementById('ver-mas')?.addEventListener('click', () => { const antes = visibles; visibles += PASO; pintarCatalogo(false, antes); });
  const params = new URLSearchParams(location.search);
  let desdeURL = false;
  if (params.get('cat') && CATS[params.get('cat')]) { FILTRO.tipos.add(params.get('cat')); desdeURL = true; }
  if (params.get('amb') && AMBIENTES[params.get('amb')]) { FILTRO.amb = params.get('amb'); desdeURL = true; }
  if (params.get('q')) { FILTRO.q = params.get('q').slice(0, 60); desdeURL = true; }
  pintarCatalogo();
  if (desdeURL) window.addEventListener('load', () => setTimeout(() => irA('tienda'), 60));
}

function pintarConteos() {
  document.querySelectorAll('[data-n]').forEach(el => {
    const v = el.dataset.n;
    el.textContent = String(v === 'todo' ? PRODUCTOS.length : PRODUCTOS.filter(p => p.cat === v).length);
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    const lista = PRODUCTOS.filter(p => p.cat === el.dataset.desde);
    if (lista.length) el.textContent = `Desde ${formatearPrecio(Math.min(...lista.map(desde)))}`;
  });
  document.querySelectorAll('[data-amb-dato]').forEach(el => {
    const lista = PRODUCTOS.filter(p => p.amb.includes(el.dataset.ambDato));
    if (lista.length) el.textContent = `${plural(lista.length, 'abertura', 'aberturas')} · desde ${formatearPrecio(Math.min(...lista.map(desde)))}`;
  });
}

/* ---------- filtros (barra o cajón) ---------- */
let focoFiltros = null;
const mqFiltros = window.matchMedia('(max-width: 1024px)');
const filtrosEsCajon = () => ES_M2 || mqFiltros.matches;

function abrirFiltros() {
  const aside = document.getElementById('filtros');
  const bd = document.getElementById('filtros-backdrop');
  if (!aside || !filtrosEsCajon()) return;
  focoFiltros = document.activeElement;
  aside.removeAttribute('inert');
  aside.setAttribute('role', 'dialog');
  aside.setAttribute('aria-modal', 'true');
  aside.classList.add('open');
  if (bd) { bd.hidden = false; requestAnimationFrame(() => bd.classList.add('open')); }
  document.body.classList.add('no-scroll');
  document.getElementById('btn-filtrar')?.setAttribute('aria-expanded', 'true');
  document.getElementById('filtros-close')?.focus();
}

function cerrarFiltros(devolverFoco = true) {
  const aside = document.getElementById('filtros');
  const bd = document.getElementById('filtros-backdrop');
  if (!aside || !aside.classList.contains('open')) return;
  aside.classList.remove('open');
  aside.removeAttribute('role');
  aside.removeAttribute('aria-modal');
  if (filtrosEsCajon()) aside.setAttribute('inert', '');
  if (bd) { bd.classList.remove('open'); setTimeout(() => { if (!aside.classList.contains('open')) bd.hidden = true; }, 320); }
  document.body.classList.remove('no-scroll');
  document.getElementById('btn-filtrar')?.setAttribute('aria-expanded', 'false');
  if (devolverFoco) focoFiltros?.focus?.();
}

function initFiltros() {
  const aside = document.getElementById('filtros');
  if (!aside) return;
  const syncInert = () => {
    if (!filtrosEsCajon()) { aside.removeAttribute('inert'); aside.classList.remove('open'); document.getElementById('filtros-backdrop')?.setAttribute('hidden', ''); }
    else if (!aside.classList.contains('open')) aside.setAttribute('inert', '');
  };
  mqFiltros.addEventListener('change', syncInert);
  syncInert();
  document.getElementById('btn-filtrar')?.addEventListener('click', abrirFiltros);
  document.getElementById('filtros-close')?.addEventListener('click', () => cerrarFiltros());
  document.getElementById('filtros-ver')?.addEventListener('click', () => { cerrarFiltros(false); irA('tienda'); });
  document.getElementById('filtros-backdrop')?.addEventListener('click', () => cerrarFiltros());
  let tr = 0;
  aside.addEventListener('input', e => {
    const i = e.target;
    if (i.dataset.f !== 'precio') return;
    const out = document.getElementById('f-precio-v');
    if (out) out.textContent = `Hasta ${formatearPrecio(Number(i.value))}`;
    clearTimeout(tr);
    tr = setTimeout(() => { FILTRO.precioMax = Number(i.value) || PRECIO_MAX; pintarCatalogo(); }, 160);
  });
  aside.addEventListener('change', e => {
    const i = e.target;
    const f = i.dataset.f;
    if (!f || f === 'precio') return;
    const set = { tipo: FILTRO.tipos, linea: FILTRO.lineas, color: FILTRO.colores, ancho: FILTRO.anchos }[f];
    if (set) { if (i.checked) set.add(i.value); else set.delete(i.value); }
    else if (f === 'dvh') FILTRO.dvh = i.checked;
    pintarCatalogo();
  });
  document.addEventListener('keydown', e => {
    if (!aside.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros();
    if (e.key === 'Tab') trap(e, aside);
  });
}

/* ---------- rail de destacados (modelo 2) ---------- */
function piezaHTML(p) {
  return `<li data-animate="der" style="opacity:0;transform:translateX(56px)">
    <button type="button" class="pieza" data-quick="${p.id}">
      <span class="pieza__media">${fotoHTML(p, 0.8)}<span class="badge pieza__cod">${esc(p.cod)}</span></span>
      <span class="pieza__t">${esc(nombreLinea(p))}</span>
      <span class="pieza__spec">${esc(p.spec)}</span>
      <span class="pieza__p"><small>Desde</small>${formatearPrecio(desde(p))}</span>
    </button>
  </li>`;
}

function initRail() {
  const track = document.getElementById('rail');
  const vp = document.getElementById('rail-vp');
  if (!track || !vp) return;
  track.innerHTML = DESTACADOS.map(getProducto).filter(Boolean).map(piezaHTML).join('');
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const paso = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 20 : 300);
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  initRailDrag(vp);
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startScroll = 0;
  let pointerId = null;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { moved = true; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

/* ---------- trabajos: la hoja que se corre (momento) ---------- */
let obraActiva = -1;

function fichaObraHTML(k) {
  const o = OBRAS[k];
  const n = PRODUCTOS.filter(p => p.cat === o.cat).length;
  const pedido = `Hola ${MARCA}! Vi la obra «${o.t1} ${o.t2}» en la web y quiero presupuesto para una así: ${o.tipologia.toLowerCase()}, línea ${LINEAS[o.linea].toLowerCase()}, ${COLORES[o.color].n.toLowerCase()}, ${VIDRIOS[o.vidrio].n}. Mi vano mide __ × __ cm.`;
  return `<p class="ficha-obra__n">Obra ${String(k + 1).padStart(2, '0')} <span>/ ${String(OBRAS.length).padStart(2, '0')}</span></p>
    <p class="ficha-obra__etq">${esc(o.tipologia)}</p>
    <p class="ficha-obra__t">${esc(o.t1)} <em>${esc(o.t2)}</em></p>
    <dl class="rotulo rotulo--obra">
      <div><dt>Línea</dt><dd>${esc(LINEAS[o.linea])}</dd></div>
      <div class="opc"><dt>Perfil</dt><dd>${esc(COLORES[o.color].n)}</dd></div>
      <div class="opc"><dt>Vidrio</dt><dd>${esc(VIDRIOS[o.vidrio].n)}</dd></div>
      <div><dt>Medida</dt><dd class="vivo" id="obra-medida">${o.ancho} × ${o.alto} cm</dd></div>
      <div><dt>Vidriado</dt><dd class="vivo" id="obra-m2">${fmtM2((o.ancho * o.alto * 0.82) / 10000)}</dd></div>
    </dl>
    <div class="ficha-obra__ctas">
      <a class="btn btn--solid btn--sm" href="${wspLink(pedido)}" target="_blank" rel="noopener">Quiero una así</a>
      <button type="button" class="btn btn--claro btn--sm" data-ver-cat="${o.cat}">Ver ${esc(CATS_CORTO[o.cat])} (${n})</button>
    </div>`;
}

function initObras() {
  const cont = document.getElementById('obras');
  const vidrio = document.getElementById('obras-vidrio');
  const ficha = document.getElementById('obras-ficha');
  if (!cont || !vidrio || !ficha) return;
  const N = OBRAS.length;
  vidrio.innerHTML = OBRAS.map((o, k) => {
    const f = FOTOS[o.foto];
    return `<div class="hoja${k === N - 1 ? ' es-ultima' : ''}" style="z-index:${N - k}"><img src="${f.src}" width="${f.w}" height="${f.h}" alt="" style="--pos:${o.pos}"${k > 1 ? ' loading="lazy"' : ''}><span class="hoja__brillo"></span><span class="hoja__perfil"><span class="hoja__manija"></span></span></div>`;
  }).join('');
  const hojas = [...vidrio.children];
  const imgs = hojas.map(h => h.querySelector('img'));
  const escena = cont.querySelector('.obras__escena');
  const marca = document.getElementById('riel-marca');
  const cm = document.getElementById('riel-cm');
  const OFF = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const recorrido = () => cont.offsetHeight - (escena ? escena.offsetHeight : window.innerHeight - OFF());
  const pintarFicha = (k, animar) => {
    obraActiva = k;
    ficha.innerHTML = fichaObraHTML(k);
    if (animar && !reduceMotion) { ficha.classList.remove('is-cambio'); void ficha.offsetWidth; ficha.classList.add('is-cambio'); }
  };
  const set = (id, v) => { const el = document.getElementById(id); if (el && el.textContent !== v) el.textContent = v; };
  let frame = 0;
  const medir = () => {
    frame = 0;
    const total = recorrido();
    const p = total > 0 ? clamp01((OFF() - cont.getBoundingClientRect().top) / total) : 0;
    const u = p * (N - 1);
    const i = Math.min(N - 2, Math.floor(u));
    let t = clamp01((u - i - 0.16) / 0.68);
    if (reduceMotion) t = t >= 0.5 ? 1 : 0;
    const e = t * t * (3 - 2 * t);
    hojas.forEach((h, k) => {
      const x = k < i ? 1 : k === i ? e : 0;
      h.style.transform = `translate3d(${(-x * 100).toFixed(3)}%,0,0)`;
      h.style.setProperty('--brillo', `${(-30 + x * 80).toFixed(1)}%`);
      const z = k === i + 1 ? 1.06 - 0.06 * e : k > i + 1 ? 1.06 : 1;
      imgs[k].style.transform = z === 1 ? '' : `scale(${z.toFixed(4)})`;
    });
    const k = e >= 0.5 ? i + 1 : i;
    if (k !== obraActiva) pintarFicha(k, true);
    const a = OBRAS[i];
    const b = OBRAS[i + 1];
    const ancho = Math.round(lerp(a.ancho, b.ancho, e));
    const alto = Math.round(lerp(a.alto, b.alto, e));
    set('obra-medida', `${ancho} × ${alto} cm`);
    set('obra-m2', fmtM2((ancho * alto * 0.82) / 10000));
    if (marca) marca.style.setProperty('--x', (1 - e).toFixed(4));
    if (cm) cm.textContent = e > 0.02 && e < 0.98 ? `Abriendo ${Math.round(e * a.ancho)} de ${a.ancho} cm` : `Ancho ${OBRAS[k].ancho} cm`;
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(medir); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintarFicha(0, false);
  medir();
  window.addEventListener('load', medir);
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function pedidoTexto() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${nombreLinea(p)} (${varTxt(p, i.v)}) — ${formatearPrecio(precioFinal(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const libre = Cart.libre(p, i.v);
  return `<div class="linea">
    ${fotoHTML(p, 1, 'linea__img')}
    <div class="linea__info">
      <p class="linea__t">${esc(nombreLinea(p))}</p>
      <p class="linea__m">${esc(varTxt(p, i.v))}</p>
      <div class="linea__acts">
        <div class="stepper stepper--linea"><button type="button" data-linea="-1" data-id="${p.id}" data-v="${esc(i.v)}" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>−</button><output>${i.qty}</output><button type="button" data-linea="1" data-id="${p.id}" data-v="${esc(i.v)}" aria-label="Sumar uno"${libre <= 0 ? ' disabled' : ''}>+</button></div>
        <button type="button" class="linea__x" data-quitar="${p.id}" data-v="${esc(i.v)}">Quitar</button>
      </div>
    </div>
    <p class="linea__pr">${formatearPrecio(precioFinal(p, i.v) * i.qty)}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Elegí una abertura estándar, o pedinos una a medida por WhatsApp.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver las aberturas</button></div>';
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
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
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
      Cart.remove(q.dataset.quitar, q.dataset.v || '');
      showToast(p ? `Sacaste ${p.nombre} del carrito.` : 'Lo sacamos del carrito.');
      return;
    }
    const paso = e.target.closest('[data-linea]');
    if (paso) {
      const v = paso.dataset.v || '';
      const it = Cart.get().find(x => x.id === paso.dataset.id && x.v === v);
      if (it) Cart.setQty(it.id, v, it.qty + Number(paso.dataset.linea));
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); irA('tienda'); }
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
let varModal = '';
let idModal = '';
const AR_MODAL = 1;

function consultaTxt(p, v) { return `Hola ${MARCA}! Quiero consultar por ${nombreLinea(p)} (${varTxt(p, v)}).`; }

function modalHTML(p) {
  const v = varModal;
  const o = leerVar(p, v);
  const libre = Cart.libre(p, v);
  const st = stockDe(p, v);
  const medidas = `<fieldset class="m-op"><legend>Medida (ancho × alto)</legend><div class="chips-op">${p.medidas.map(m => `<label class="chip-op chip-op--mono"><input type="radio" name="m-medida" value="${m.k}"${m.k === o.medida ? ' checked' : ''}><span>${m.a} × ${m.h}<small>cm</small></span></label>`).join('')}</div></fieldset>`;
  const colores = `<fieldset class="m-op"><legend>Color del perfil</legend><div class="swatches">${p.colores.map(c => `<label class="swatch"><input type="radio" name="m-color" value="${c}"${c === o.color ? ' checked' : ''}><span class="sw sw--${c}"></span><span class="swatch__n">${esc(COLORES[c].n)}</span></label>`).join('')}</div></fieldset>`;
  const vidrios = p.vidrios.length > 1
    ? `<fieldset class="m-op"><legend>Vidrio</legend><div class="chips-op">${p.vidrios.map(x => `<label class="chip-op"><input type="radio" name="m-vidrio" value="${x}"${x === o.vidrio ? ' checked' : ''}><span>${esc(VIDRIOS[x].n)}</span></label>`).join('')}</div></fieldset>`
    : (p.vidrios.length ? `<p class="m-desc">Vidrio: ${esc(VIDRIOS[p.vidrios[0]].n)}.</p>` : '');
  const mosq = p.mosq ? `<label class="op__check"><input type="checkbox" name="m-mosq"${o.mosq ? ' checked' : ''}><span>Sumar mosquitero corredizo</span></label>` : '';
  let stock;
  if (st <= 0) stock = '<p class="m-stock m-stock--poco">Sin stock en esta medida. Consultanos o pedila a medida.</p>';
  else if (libre <= 0) stock = '<p class="m-stock m-stock--poco">Ya tenés en el carrito todo el stock de esta medida.</p>';
  else if (st <= 3) stock = `<p class="m-stock m-stock--poco">Quedan ${st} en esta medida</p>`;
  else stock = '<p class="m-stock">En stock en esta medida</p>';
  const base = precioBase(p, v);
  const fin = precioFinal(p, v);
  const m = medidaDe(p, o.medida);
  const rel = PRODUCTOS.filter(x => x.id !== p.id && (x.cat === p.cat || x.amb.some(a => p.amb.includes(a)))).sort((a, b) => (a.cat === p.cat ? 0 : 1) - (b.cat === p.cat ? 0 : 1)).slice(0, 3);
  const relHTML = rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x, 1)}<span>${esc(nombreLinea(x))}</span><b>Desde ${formatearPrecio(desde(x))}</b></button></li>`).join('');
  const ficha = `<dl class="ficha">${p.ficha.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}<div><dt>Medidas</dt><dd>${p.medidas.map(x => `${x.a}×${x.h}`).join(' · ')} cm</dd></div></dl>`;
  const aMedida = `Hola ${MARCA}! Quiero ${nombreLinea(p)} a medida, en ${(COLORES[o.color]?.n || '').toLowerCase()}${o.vidrio ? ` con ${VIDRIOS[o.vidrio].n}` : ''}. Mi vano mide __ × __ cm.`;
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p, AR_MODAL, 'm-foto')}
    </div>
    <div class="m-info">
      <p class="m-cod"><b>${esc(p.cod)}</b>${p.linea ? ` · Línea ${esc(LINEAS[p.linea].toLowerCase())}` : ''}</p>
      <h2 class="m-t">${esc(p.nombre)}</h2>
      <div class="m-precio"><p class="precio"><span class="precio__f">${formatearPrecio(fin)}</span>${p.descuento > 0 ? `<s class="precio__o">${formatearPrecio(base)}</s>` : ''}<span class="precio__u">${m ? medidaTxt(m) : ''} · ${esc(COLORES[o.color]?.n || '')}${o.vidrio ? ` · ${esc(VIDRIOS[o.vidrio].n)}` : ''}${o.mosq ? ' · con mosquitero' : ''}</span></p></div>
      <p class="m-desc">${esc(p.desc)}</p>
      ${medidas}
      ${colores}
      ${vidrios}
      ${mosq}
      ${stock}
      <div class="m-compra"><div class="stepper stepper--modal" data-stepper="${p.id}"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><output>1</output><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div><button type="button" class="btn btn--solid" data-add-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button></div>
      <button type="button" class="btn btn--line btn--block" data-comprar-modal="${p.id}"${libre <= 0 ? ' disabled' : ''}>Comprar ahora</button>
      <div class="m-links">
        <a class="link" href="${wspLink(consultaTxt(p, v))}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
        <a class="link" href="${wspLink(aMedida)}" target="_blank" rel="noopener">¿Otra medida? Pedila a medida</a>
      </div>
      ${ficha}
      ${relHTML ? `<div class="m-rels"><p class="m-rels__t">También te puede servir</p><ul>${relHTML}</ul></div>` : ''}
    </div>
  </div>`;
}

function inyectarLD(p) {
  document.getElementById('ld-producto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ld-producto';
  const img = p.foto ? new URL(FOTOS[p.foto].src, location.href).href : undefined;
  const precios = p.medidas.map(m => precioFinal(p, armarVar(p, { medida: m.k, color: p.colores[0] })));
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: nombreLinea(p), sku: p.cod, image: img, description: p.desc, category: CATS[p.cat], brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: String(Math.min(...precios)), highPrice: String(Math.max(...precios)), offerCount: String(p.medidas.length), availability: 'https://schema.org/InStock' } });
  document.head.appendChild(ld);
}

function abrirModal(id, medida = '') {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modal-content');
  if (!p || !modal || !cont) return;
  if (modal.hidden) ultimoFoco = document.activeElement;
  idModal = p.id;
  varModal = armarVar(p, { medida });
  cont.innerHTML = modalHTML(p);
  modal.querySelector('.modal-box').scrollTop = 0;
  modal.setAttribute('aria-label', nombreLinea(p));
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
  return out ? Math.max(1, parseInt(out.textContent, 10) || 1) : 1;
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  const cont = document.getElementById('modal-content');
  const actual = () => getProducto(idModal);
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('change', e => {
    const p = actual();
    if (!p) return;
    const t = e.target;
    const o = leerVar(p, varModal);
    if (t.name === 'm-medida') o.medida = t.value;
    else if (t.name === 'm-color') o.color = t.value;
    else if (t.name === 'm-vidrio') o.vidrio = t.value;
    else if (t.name === 'm-mosq') o.mosq = t.checked;
    else return;
    varModal = armarVar(p, o);
    const scroll = modal.querySelector('.modal-box').scrollTop;
    cont.innerHTML = modalHTML(p);
    modal.querySelector('.modal-box').scrollTop = scroll;
    const sel = t.type === 'checkbox' ? modal.querySelector(`input[name="${t.name}"]`) : [...modal.querySelectorAll(`input[name="${t.name}"]`)].find(i => i.value === t.value);
    sel?.focus();
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-close-modal]')) { cerrarModal(); return; }
    const add = e.target.closest('[data-add-modal], [data-comprar-modal]');
    if (add) {
      const p = getProducto(add.dataset.addModal || add.dataset.comprarModal);
      if (!p) return;
      const ok = Cart.add(p, cantidadDe(modal.querySelector('.stepper--modal')), varModal);
      if (!ok) { showToast('Ya tenés en el carrito todo el stock de esta medida.'); return; }
      if (add.dataset.comprarModal) { cerrarModal(true); abrirDrawer(); return; }
      showToast(`Agregaste ${ok} × ${p.nombre} de ${varTxt(p, varModal).split(' · ')[0]}.`);
      cont.innerHTML = modalHTML(p);
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
    if (quick) { abrirModal(quick.dataset.quick, quick.dataset.medida || ''); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('.stepper');
      const out = st?.querySelector('output');
      const p = getProducto(st?.dataset.stepper);
      if (!out || !p) return;
      const libre = Math.max(1, Cart.libre(p, varModal));
      out.textContent = String(Math.max(1, Math.min(libre, (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso))));
      return;
    }
    const verCat = e.target.closest('[data-ver-cat]');
    if (verCat) { filtrarPor({ tipos: [verCat.dataset.verCat] }); return; }
    const amb = e.target.closest('[data-amb]');
    if (amb) { filtrarPor({ amb: amb.dataset.amb }); return; }
    const quitar = e.target.closest('[data-quitar-filtro]');
    if (quitar) {
      const k = quitar.dataset.quitarFiltro;
      const v = quitar.dataset.valor;
      if (k === 'q') FILTRO.q = '';
      if (k === 'amb') FILTRO.amb = '';
      if (k === 'tipo') FILTRO.tipos.delete(v);
      if (k === 'linea') FILTRO.lineas.delete(v);
      if (k === 'color') FILTRO.colores.delete(v);
      if (k === 'ancho') FILTRO.anchos.delete(v);
      if (k === 'dvh') FILTRO.dvh = false;
      if (k === 'precio') FILTRO.precioMax = PRECIO_MAX;
      pintarCatalogo();
      return;
    }
    if (e.target.closest('[data-limpiar]')) { resetFiltros(); pintarCatalogo(); return; }
    const cat = e.target.closest('[data-cat]');
    if (cat && !cat.closest('#modal') && !cat.closest('#filtros')) {
      e.preventDefault();
      const k = cat.dataset.cat;
      if (cat.closest('.chips')) {
        const solo = FILTRO.tipos.size === 1 && FILTRO.tipos.has(k);
        FILTRO.tipos.clear();
        if (k && !solo) FILTRO.tipos.add(k);
        pintarCatalogo();
        return;
      }
      filtrarPor({ tipos: k ? [k] : [] });
    }
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

/* ---------- hero ---------- */
function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const card = hero.querySelector('.hero-inm__card');
  if (card) tl.from(card, { y: 36, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.3);
  const d = card ? 0.4 : 0;
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, d + 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, d + 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, d + 0.36)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, d + 0.48)
    .from(hero.querySelectorAll('.rotulo--hero, .hero-inm__datos li'), { y: 20, scale: 0.96, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, d + 0.6);
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
  const desktopMq = window.matchMedia('(min-width: 1201px)');
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
  aplicarRecortes();
  initModelBarScroll();
  initCatalogo();
  initFiltros();
  initRail();
  initObras();
  initReveals();
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  initHeroMotion();
  initNav();
  initDrawer();
  initModal();
  initAcciones();
  initFloats();
  updateCartBadge();
  abrirDesdeURL();
  let rz = 0;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(aplicarRecortes, 150); }, { passive: true });
});
