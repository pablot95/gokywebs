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
    foto: 'ventana', foco: [0.5, 0.47, 1], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: true, amb: ['dormitorio', 'obra'],
    medidas: [M('100x110', 118900, 9), M('120x110', 139900, 7), M('150x110', 164900, 12), M('200x110', 219900, 4)], def: '150x110',
    spec: '2 hojas · float 3 mm o laminado',
    desc: 'La corrediza de todos los días: dos hojas sobre guía, con burletes y felpas para que cierre parejo. Para dormitorios, cocinas y comedores.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Colocación', 'Con premarco o amurada con grapas']],
    alt: 'Ventana corrediza de aluminio natural de dos hojas en una pared blanca' },
  { id: 'vc2-m', cod: 'TA-VC2-M', cat: 'ventanas', tipo: 'ventana', linea: 'm', hojas: 2, nombre: 'Ventana corrediza 2 hojas', prio: 2,
    foto: 'ventana', foco: [0.66, 0.42, 1.75], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['dormitorio'],
    medidas: [M('100x110', 189900, 6), M('120x110', 224900, 6), M('150x110', 269900, 8), M('200x110', 419900, 3)], def: '150x110',
    spec: '2 hojas · float 4 mm, laminado o DVH',
    desc: 'Perfil más robusto y hojas más pesadas, que aceptan doble vidriado hermético (DVH) para aislar mejor del frío y del ruido.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Colocación', 'Con premarco o amurada con grapas']],
    alt: 'Detalle del encuentro central de una ventana corrediza de aluminio con su manija' },
  { id: 'pv2-t', cod: 'TA-PV2-T', cat: 'puertas-ventana', tipo: 'puerta-ventana', linea: 't', hojas: 2, nombre: 'Puerta-ventana corrediza 2 hojas', prio: 1, descuento: 10,
    foto: 'terraza', foco: [0.42, 0.42, 1.05], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: true, amb: ['living', 'obra'],
    medidas: [M('150x200', 299900, 5), M('180x200', 349900, 6), M('200x200', 369900, 4)], def: '180x200',
    spec: '2 hojas · de piso a dintel',
    desc: 'Para salir al patio o al balcón: dos hojas corredizas de piso a dintel, con cierre lateral embutido.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Cierre', 'Lateral embutido']],
    alt: 'Puerta-ventana corrediza negra de dos hojas abierta hacia una terraza' },
  { id: 'pv2-m', cod: 'TA-PV2-M', cat: 'puertas-ventana', tipo: 'puerta-ventana', linea: 'm', hojas: 2, nombre: 'Puerta-ventana corrediza 2 hojas', prio: 2,
    foto: 'living', foco: [0.47, 0.42, 1.6], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('150x200', 449900, 4), M('180x200', 529900, 5), M('200x200', 579900, 3)], def: '200x200',
    spec: '2 hojas · acepta DVH',
    desc: 'La puerta-ventana de media prestación: hojas más anchas y pesadas, ruedas a rulemán y la opción de DVH para el living.',
    ficha: [['Apertura', 'Corrediza, 2 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Dos hojas corredizas negras con vista a un lago' },
  { id: 'pv3-m', cod: 'TA-PV3-M', cat: 'gran-luz', tipo: 'puerta-ventana', linea: 'm', hojas: 3, nombre: 'Puerta-ventana corrediza 3 hojas', prio: 1,
    foto: 'casa', foco: [0.64, 0.5, 1], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('270x200', 799900, 2), M('300x200', 869900, 3), M('300x220', 949900, 2)], def: '300x200',
    spec: '3 hojas · acepta DVH',
    desc: 'Tres hojas corredizas para abrir la galería o el quincho casi de punta a punta.',
    ficha: [['Apertura', 'Corrediza, 3 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Puerta-ventana corrediza negra de tres hojas en una casa con galería' },
  { id: 'pv4-m', cod: 'TA-PV4-M', cat: 'gran-luz', tipo: 'puerta-ventana', linea: 'm', hojas: 4, nombre: 'Ventanal corredizo 4 hojas', prio: 2,
    foto: 'living', foco: [0.54, 0.36, 1.04], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: true, amb: ['living'],
    medidas: [M('300x200', 979900, 2), M('360x200', 1149900, 2), M('400x220', 1389900, 1)], def: '360x200',
    spec: '4 hojas · acepta DVH',
    desc: 'Cuatro hojas que se corren hacia los costados y dejan el centro libre: el living queda abierto al patio.',
    ficha: [['Apertura', 'Corrediza, 4 hojas'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Ruedas', 'A rulemán']],
    alt: 'Ventanal corredizo negro de cuatro hojas en un living luminoso' },
  { id: 'pf-m', cod: 'TA-PF-M', cat: 'panos', tipo: 'pano', linea: 'm', hojas: 0, nombre: 'Paño fijo', prio: 1,
    foto: 'casa', foco: [0.8, 0.44, 1.7], colorFoto: 'negro', colores: ['blanco', 'negro', 'natural', 'madera'], vidrios: ['f4', 'lam', 'dvh'], mosq: false, amb: ['living'],
    medidas: [M('60x110', 119900, 6), M('100x110', 149900, 5), M('150x110', 184900, 4), M('100x200', 239900, 3)], def: '100x200',
    spec: 'Fijo · acepta DVH',
    desc: 'Vidrio que no abre, para sumar luz al lado de una puerta-ventana o en una pared donde no hace falta ventilar.',
    ficha: [['Apertura', 'Paño fijo'], ['Línea', 'Media prestación'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 4 mm, laminado 3+3 o DVH 4/9/4'], ['Uso', 'Solo o junto a una corrediza']],
    alt: 'Gran paño de vidrio con perfil negro en el frente de una casa' },
  { id: 'vl-t', cod: 'TA-VL-T', cat: 'ventiluces', tipo: 'ventiluz', linea: 't', hojas: 1, nombre: 'Ventiluz proyectante', prio: 2,
    foto: null, slot: 'ventiluz.webp', colores: ['blanco', 'negro', 'natural'], vidrios: ['sti'], mosq: false, amb: ['dormitorio'],
    medidas: [M('40x40', 54900, 10), M('60x40', 69900, 8), M('80x40', 84900, 6)], def: '60x40',
    spec: 'Proyectante · vidrio stipolite',
    desc: 'Para baños, lavaderos y cocinas: abre hacia afuera desde arriba y ventila aunque llueva. El stipolite deja pasar la luz pero no la vista.',
    ficha: [['Apertura', 'Proyectante, con brazo de empuje'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Stipolite 4 mm'], ['Uso', 'Baño, lavadero o cocina']],
    alt: 'Ventiluz proyectante de aluminio' },
  { id: 'pa-t', cod: 'TA-PA-T', cat: 'puertas', tipo: 'puerta', linea: 't', hojas: 1, nombre: 'Puerta de abrir medio vidrio', prio: 2,
    foto: null, slot: 'puerta-de-abrir.webp', colores: ['blanco', 'negro', 'natural'], vidrios: ['f3', 'lam'], mosq: false, amb: ['obra'],
    medidas: [M('70x200', 269900, 3), M('80x200', 289900, 5), M('90x200', 309900, 4)], def: '80x200',
    spec: '1 hoja · medio vidrio',
    desc: 'Puerta de una hoja con la mitad de arriba vidriada, para entradas de servicio, patios y lavaderos.',
    ficha: [['Apertura', 'De abrir, 1 hoja'], ['Línea', 'Tradicional'], ['Perfil', 'Aluminio de primera fundición'], ['Vidrio', 'Float 3 mm o laminado 3+3'], ['Mano', 'Derecha o izquierda, a pedido']],
    alt: 'Puerta de aluminio de una hoja con medio vidrio' },
  { id: 'premarco', cod: 'TA-PM', cat: 'accesorios', tipo: 'premarco', linea: null, hojas: 0, nombre: 'Premarco de aluminio', prio: 3,
    foto: 'taller', foco: [0.4, 0.64, 1.7], colorFoto: 'natural', colores: ['blanco', 'negro', 'natural'], vidrios: [], mosq: false, amb: ['obra'],
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

const DESTACADOS = ['vc2-t', 'pv2-t', 'vc2-m', 'pv2-m', 'pf-m', 'pv3-m', 'pv4-m', 'premarco'];

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
const redondeoMil = n => Math.round(n / 1000) * 1000;
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

const ICONO_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

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
  const chips = p.medidas.slice(0, 3).map(m => `<span>${m.a}×${m.h}</span>`).join('') +
    (p.medidas.length > 3 ? `<span class="mas-medidas">+${p.medidas.length - 3}</span>` : '');
  return `<article class="card" data-id="${p.id}"${animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
    <div class="card__media">
      ${fotoHTML(p, AR_CARD, 'card__img', ` data-quick="${p.id}"`)}
      <div class="card__badges">${badges}</div>
      <button type="button" class="card__quick" data-quick="${p.id}" tabindex="-1" aria-hidden="true">Vista rápida</button>
    </div>
    <div class="card__body">
      <p class="card__cod"><b>${esc(p.cod)}</b>${p.linea ? `<span>${esc(LINEAS[p.linea])}</span>` : ''}</p>
      <h3 class="card__t">${esc(p.nombre)}</h3>
      <p class="card__spec">${esc(p.spec)}</p>
      <div class="card__medidas">${chips}</div>
      ${precioDesdeHTML(p)}
      <div class="prod-actions"><button type="button" class="btn btn--solid btn--sm prod-add" data-quick="${p.id}" aria-label="Elegir medida y color de ${esc(nombreLinea(p))}"><span class="lbl-long">Elegir medida y color</span><span class="lbl-short">Elegir medida</span></button></div>
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

/* ---------- componente: ¿estándar o a medida? ---------- */
const TIPOS_VANO = {
  ventana: { n: 'Ventana corrediza', lim: { ancho: [50, 400], alto: [40, 200] } },
  'puerta-ventana': { n: 'Puerta-ventana corrediza', lim: { ancho: [120, 600], alto: [180, 300] } },
  pano: { n: 'Paño fijo', lim: { ancho: [30, 400], alto: [30, 300] } },
  ventiluz: { n: 'Ventiluz proyectante', lim: { ancho: [30, 100], alto: [30, 80] } }
};
const VIDRIOS_VANO = {
  ventana: { t: ['f3', 'lam'], m: ['f4', 'lam', 'dvh'] },
  'puerta-ventana': { t: ['f3', 'lam'], m: ['f4', 'lam', 'dvh'] },
  pano: { t: ['f3', 'lam'], m: ['f4', 'lam', 'dvh'] },
  ventiluz: { t: ['sti'], m: ['sti', 'dvh'] }
};
const COLORES_LINEA = { t: ['blanco', 'negro', 'natural'], m: ['blanco', 'negro', 'natural', 'madera'] };
const PM2 = {
  ventana: { t: [120000, 110000], m: [196000, 180000] },
  'puerta-ventana': { t: [117000, 290000], m: [177000, 430000] },
  pano: { t: [110000, 70000], m: [164000, 110000] },
  ventiluz: { t: [190000, 52000], m: [290000, 140000] }
};
const TOL = [1, 4];
const VANO = { tipo: 'ventana', ancho: 152, alto: 112, linea: 't', color: 'blanco', vidrio: 'f3', mosq: false };

function hojasPara(tipo, ancho) {
  if (tipo === 'pano') return 0;
  if (tipo === 'ventiluz') return 1;
  if (tipo === 'ventana') return ancho <= 240 ? 2 : 4;
  return ancho <= 220 ? 2 : ancho <= 330 ? 3 : 4;
}

function estandaresDe(tipo, linea) {
  const out = [];
  PRODUCTOS.filter(p => p.tipo === tipo && p.linea === linea).forEach(p => p.medidas.forEach(m => out.push({ p, m })));
  return out;
}

function buscarEstandar(s = VANO) {
  const lista = estandaresDe(s.tipo, s.linea);
  const entra = ({ m }) => s.ancho - m.a >= TOL[0] && s.ancho - m.a <= TOL[1] && s.alto - m.h >= TOL[0] && s.alto - m.h <= TOL[1];
  const ok = lista.filter(entra).sort((a, b) => b.m.a * b.m.h - a.m.a * a.m.h);
  if (ok.length) return { tipo: 'std', p: ok[0].p, m: ok[0].m };
  const dist = ({ m }) => {
    const da = s.ancho < m.a + TOL[0] ? m.a + TOL[0] - s.ancho : s.ancho > m.a + TOL[1] ? s.ancho - m.a - TOL[1] : 0;
    const dh = s.alto < m.h + TOL[0] ? m.h + TOL[0] - s.alto : s.alto > m.h + TOL[1] ? s.alto - m.h - TOL[1] : 0;
    return da + dh;
  };
  const cerca = lista.map(x => ({ ...x, d: dist(x) })).sort((a, b) => a.d - b.d)[0];
  return { tipo: 'medida', cerca: cerca && cerca.d <= 30 ? cerca : null };
}

function estimarMedida(s = VANO) {
  const ancho = Math.max(1, s.ancho - 2);
  const alto = Math.max(1, s.alto - 2);
  const m2 = (ancho / 100) * (alto / 100);
  const [pm2, minimo] = PM2[s.tipo][s.linea];
  const f = (COLORES[s.color]?.f || 1) * (VIDRIOS[s.vidrio]?.f || 1) * (s.mosq && (s.tipo === 'ventana' || s.tipo === 'puerta-ventana') ? MOSQ_F : 1);
  const base = Math.max(minimo, m2 * pm2) * f;
  return { m2, hojas: hojasPara(s.tipo, ancho), min: redondeoMil(base * 0.92), max: redondeoMil(base * 1.08) };
}

function varVano(p, m, s = VANO) {
  return armarVar(p, { medida: m.k, color: s.color, vidrio: s.vidrio, mosq: s.mosq });
}

function mensajeVano(r, s = VANO) {
  const t = TIPOS_VANO[s.tipo];
  const lineas = [`Hola ${MARCA}! Quiero presupuesto para esta abertura:`];
  lineas.push(`• ${t.n}, línea ${LINEAS[s.linea].toLowerCase()}`);
  lineas.push(`• Vano: ${s.ancho} × ${s.alto} cm`);
  lineas.push(`• Color ${COLORES[s.color].n.toLowerCase()} · vidrio ${VIDRIOS[s.vidrio].n}${s.mosq && (s.tipo === 'ventana' || s.tipo === 'puerta-ventana') ? ' · con mosquitero' : ''}`);
  if (r.tipo === 'std') lineas.push(`• En la web me sugiere la estándar de ${medidaTxt(r.m)} (${formatearPrecio(precioFinal(r.p, varVano(r.p, r.m, s)))})`);
  else { const e = estimarMedida(s); lineas.push(`• Estimado de la web: entre ${formatearPrecio(e.min)} y ${formatearPrecio(e.max)}`); }
  return lineas.join('\n');
}

function planoSVG(s, r, fijo) {
  const W = 600;
  const H = 430;
  const L = 36;
  const T = 62;
  const R = 92;
  const B = 44;
  const MURO = 16;
  const std = r.tipo === 'std';
  const ab = std ? { a: r.m.a, h: r.m.h } : { a: Math.max(1, s.ancho - 2), h: Math.max(1, s.alto - 2) };
  const hojas = std ? r.p.hojas : hojasPara(s.tipo, ab.a);
  const sc = fijo ? fijo.s : Math.min((W - L - R - 2 * MURO) / s.ancho, (H - T - B - 2 * MURO) / s.alto);
  const vw = s.ancho * sc;
  const vh = s.alto * sc;
  const x0 = fijo ? fijo.x : L + MURO + (W - L - R - 2 * MURO - vw) / 2;
  const y0 = fijo ? fijo.y : T + MURO + (H - T - B - 2 * MURO - vh) / 2;
  const ax = x0 + ((s.ancho - ab.a) / 2) * sc;
  const ay = y0 + ((s.alto - ab.h) / 2) * sc;
  const aw = ab.a * sc;
  const ah = ab.h * sc;
  const mk = Math.max(4, Math.min(9, 5 * sc));
  const n = v => v.toFixed(1);
  let g = '';
  g += `<rect class="pl-pared" x="${n(x0 - MURO)}" y="${n(y0 - MURO)}" width="${n(vw + 2 * MURO)}" height="${n(vh + 2 * MURO)}"/>`;
  g += `<rect class="pl-vano" x="${n(x0)}" y="${n(y0)}" width="${n(vw)}" height="${n(vh)}"/>`;
  g += `<rect class="pl-marco" x="${n(ax)}" y="${n(ay)}" width="${n(aw)}" height="${n(ah)}"/>`;
  g += `<rect class="pl-marco-in" x="${n(ax + mk)}" y="${n(ay + mk)}" width="${n(Math.max(2, aw - 2 * mk))}" height="${n(Math.max(2, ah - 2 * mk))}"/>`;
  const ix = ax + mk;
  const iy = ay + mk;
  const iw = Math.max(2, aw - 2 * mk);
  const ih = Math.max(2, ah - 2 * mk);
  const cy = iy + ih / 2;
  if (s.tipo === 'pano') {
    g += `<rect class="pl-fijo" x="${n(ix + 3)}" y="${n(iy + 3)}" width="${n(Math.max(1, iw - 6))}" height="${n(Math.max(1, ih - 6))}"/>`;
    g += `<text class="pl-etq" x="${n(ix + iw / 2)}" y="${n(cy + 4)}" text-anchor="middle">Fijo</text>`;
  } else if (s.tipo === 'ventiluz') {
    g += `<rect class="pl-hoja" x="${n(ix + 3)}" y="${n(iy + 3)}" width="${n(Math.max(1, iw - 6))}" height="${n(Math.max(1, ih - 6))}"/>`;
    g += `<path class="pl-apertura" d="M${n(ix + 4)} ${n(iy + ih - 4)}L${n(ix + iw / 2)} ${n(iy + 4)}L${n(ix + iw - 4)} ${n(iy + ih - 4)}"/>`;
  } else {
    const k = Math.max(2, hojas);
    const hw = iw / k;
    for (let i = 0; i < k; i++) {
      const hx = ix + i * hw;
      g += `<rect class="pl-hoja" x="${n(hx + 2)}" y="${n(iy + 2)}" width="${n(Math.max(1, hw - 4))}" height="${n(Math.max(1, ih - 4))}"/>`;
      const largo = Math.min(hw * 0.5, 64);
      const mx = hx + hw / 2;
      let dir = 0;
      if (k === 2) dir = i === 0 ? 1 : -1;
      if (k === 4) dir = i < 2 ? -1 : 1;
      if (dir === 0) {
        g += `<path class="pl-flecha" d="M${n(mx - largo / 2)} ${n(cy)}H${n(mx + largo / 2)}M${n(mx - largo / 2 + 7)} ${n(cy - 6)}L${n(mx - largo / 2)} ${n(cy)}L${n(mx - largo / 2 + 7)} ${n(cy + 6)}M${n(mx + largo / 2 - 7)} ${n(cy - 6)}L${n(mx + largo / 2)} ${n(cy)}L${n(mx + largo / 2 - 7)} ${n(cy + 6)}"/>`;
      } else {
        const a = mx - (dir * largo) / 2;
        const b = mx + (dir * largo) / 2;
        g += `<path class="pl-flecha" d="M${n(a)} ${n(cy)}H${n(b)}M${n(b - dir * 7)} ${n(cy - 6)}L${n(b)} ${n(cy)}L${n(b - dir * 7)} ${n(cy + 6)}"/>`;
      }
      if (s.mosq && i === k - 1) {
        let d = '';
        for (let yy = iy + 10; yy < iy + ih - 6; yy += 9) d += `M${n(hx + 6)} ${n(yy)}H${n(hx + hw - 6)}`;
        g += `<path class="pl-mosq" d="${d}"/>`;
      }
    }
  }
  const cyA = y0 - MURO - 24;
  g += `<path class="pl-cota" d="M${n(x0)} ${n(cyA)}H${n(x0 + vw)}M${n(x0)} ${n(cyA - 7)}V${n(cyA + 7)}M${n(x0 + vw)} ${n(cyA - 7)}V${n(cyA + 7)}M${n(x0)} ${n(y0 - MURO - 4)}V${n(cyA - 2)}M${n(x0 + vw)} ${n(y0 - MURO - 4)}V${n(cyA - 2)}"/>`;
  g += `<rect class="pl-cota-bg" x="${n(x0 + vw / 2 - 30)}" y="${n(cyA - 10)}" width="60" height="20"/>`;
  g += `<text class="pl-cota-txt" x="${n(x0 + vw / 2)}" y="${n(cyA + 5)}" text-anchor="middle">${s.ancho}</text>`;
  const cxA = x0 + vw + MURO + 26;
  g += `<path class="pl-cota" d="M${n(cxA)} ${n(y0)}V${n(y0 + vh)}M${n(cxA - 7)} ${n(y0)}H${n(cxA + 7)}M${n(cxA - 7)} ${n(y0 + vh)}H${n(cxA + 7)}M${n(x0 + vw + MURO + 4)} ${n(y0)}H${n(cxA - 2)}M${n(x0 + vw + MURO + 4)} ${n(y0 + vh)}H${n(cxA - 2)}"/>`;
  g += `<rect class="pl-cota-bg" x="${n(cxA - 26)}" y="${n(y0 + vh / 2 - 10)}" width="52" height="20"/>`;
  g += `<text class="pl-cota-txt" x="${n(cxA)}" y="${n(y0 + vh / 2 + 5)}" text-anchor="middle">${s.alto}</text>`;
  const etq = std ? `Estándar ${r.m.a} × ${r.m.h}` : `A medida ${ab.a} × ${ab.h}`;
  g += `<text class="pl-etq" x="${n(x0 - MURO)}" y="${n(Math.min(H - 8, y0 + vh + MURO + 22))}">Vano ${s.ancho} × ${s.alto} · ${etq} cm</text>`;
  const defs = '<defs><pattern id="pl-trama" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#EEF2F7"/><path d="M0 0V7" stroke="#B6C2D2" stroke-width="1.3"/></pattern></defs>';
  const desc = `Plano de ${TIPOS_VANO[s.tipo].n.toLowerCase()}${hojas > 1 ? ` de ${hojas} hojas` : ''}, vano de ${s.ancho} por ${s.alto} centímetros`;
  return { svg: `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(desc)}">${defs}${g}</svg>`, s: sc, x: x0, y: y0, hx: (x0 + vw) / W, hy: (y0 + vh) / H };
}

const PLANO_CAJA = { L: 36 + 16, T: 62 + 16, W: 600 - 36 - 92 - 32, H: 430 - 62 - 44 - 32 };
let planoFijo = null;
let planoGeo = null;

function pintarPlano(r) {
  const cont = document.getElementById('plano');
  if (!cont) return;
  let fijo = null;
  if (planoFijo) {
    const ajuste = Math.min(PLANO_CAJA.W / VANO.ancho, PLANO_CAJA.H / VANO.alto);
    const entra = planoFijo.x + VANO.ancho * planoFijo.s <= PLANO_CAJA.L + PLANO_CAJA.W && planoFijo.y + VANO.alto * planoFijo.s <= PLANO_CAJA.T + PLANO_CAJA.H;
    fijo = entra ? planoFijo : { s: ajuste, x: PLANO_CAJA.L, y: PLANO_CAJA.T };
  }
  const out = planoSVG(VANO, r, fijo);
  let svgEl = cont.querySelector('svg');
  if (svgEl) svgEl.outerHTML = out.svg;
  else cont.insertAdjacentHTML('afterbegin', out.svg);
  let handle = cont.querySelector('.plano__handle');
  if (!handle) {
    handle = document.createElement('span');
    handle.className = 'plano__handle';
    handle.setAttribute('aria-hidden', 'true');
    cont.appendChild(handle);
  }
  handle.style.left = `${(out.hx * 100).toFixed(3)}%`;
  handle.style.top = `${(out.hy * 100).toFixed(3)}%`;
  planoGeo = { s: out.s, x: out.x, y: out.y };
  const rot = document.getElementById('plano-rotulo');
  if (rot) {
    const hojas = r.tipo === 'std' ? r.p.hojas : hojasPara(VANO.tipo, VANO.ancho - 2);
    const tipologia = `${TIPOS_VANO[VANO.tipo].n}${hojas > 1 ? `, ${hojas} hojas` : ''}`;
    const folio = document.querySelector('#medida .folio__n')?.textContent || '04';
    const html = `<dl class="rotulo__grilla"><div><dt>Tipología</dt><dd>${esc(tipologia)}</dd></div><div><dt>Línea</dt><dd>${esc(LINEAS[VANO.linea])}</dd></div><div><dt>Perfil</dt><dd>${esc(COLORES[VANO.color].n)}</dd></div><div><dt>Vidrio</dt><dd>${esc(VIDRIOS[VANO.vidrio].n)}</dd></div></dl><p class="rotulo__folio"><span>Lámina ${esc(folio)}</span><span>${esc(MARCA)}</span><span>Diseño sin costo</span></p>`;
    if (rot.innerHTML !== html) rot.innerHTML = html;
  }
}

function resultadoHTML(r) {
  const s = VANO;
  const msg = mensajeVano(r, s);
  if (r.tipo === 'std') {
    const v = varVano(r.p, r.m, s);
    const libre = Cart.libre(r.p, v);
    const pre = getProducto('premarco');
    const preM = pre ? medidaDe(pre, r.m.k) : null;
    const preV = preM ? armarVar(pre, { medida: preM.k, color: COLORES_LINEA.t.includes(s.color) ? s.color : 'blanco' }) : '';
    const luzA = s.ancho - r.m.a;
    const luzH = s.alto - r.m.h;
    return `<p class="res__estado res__estado--ok">Entra una estándar</p>
      <div class="res__prod">
        ${fotoHTML(r.p, 1)}
        <div>
          <p class="res__cod">${esc(r.p.cod)} · ${esc(LINEAS[r.p.linea])}</p>
          <p class="res__t">${esc(r.p.nombre)} de ${medidaTxt(r.m)}</p>
          <p class="res__m">${esc(COLORES[s.color].n)} · ${esc(VIDRIOS[s.vidrio].n)}${s.mosq && r.p.mosq ? ' · con mosquitero' : ''}</p>
        </div>
      </div>
      <p class="res__precio">${formatearPrecio(precioFinal(r.p, v))}<small>${libre > 0 ? `Medida estándar · en stock` : 'Ya tenés en el carrito todo el stock de esta medida'}</small></p>
      <p class="res__p">Tu vano deja <b>${fmtDec(luzA / 2, luzA % 2 ? 1 : 0)} cm por lado</b> de ancho y <b>${fmtDec(luzH / 2, luzH % 2 ? 1 : 0)} cm</b> arriba y abajo, para la espuma y el sellador.</p>
      <div class="res__acts">
        <button type="button" class="btn btn--solid" data-add-std${libre <= 0 ? ' disabled' : ''}>Agregar al carrito</button>
        <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICONO_WSP}Consultar por WhatsApp</a>
      </div>
      ${preM ? `<p class="res__nota">¿Obra nueva? <button type="button" class="link res__link" data-add-premarco="${esc(preV)}">Sumá el premarco de ${medidaTxt(preM)} (${formatearPrecio(precioFinal(pre, preV))})</button></p>` : ''}`;
  }
  const e = estimarMedida(s);
  const cerca = r.cerca ? `<p class="res__p">La estándar más parecida es de <b>${medidaTxt(r.cerca.m)}</b>: entra en vanos de ${r.cerca.m.a + TOL[0]} a ${r.cerca.m.a + TOL[1]} × ${r.cerca.m.h + TOL[0]} a ${r.cerca.m.h + TOL[1]} cm. <button type="button" class="link res__link" data-quick="${r.cerca.p.id}" data-medida="${r.cerca.m.k}">Verla</button></p>` : '';
  const hojas = e.hojas > 1 ? ` · ${e.hojas} hojas` : '';
  return `<p class="res__estado res__estado--medida">Va a medida</p>
    <p class="res__precio">${formatearPrecio(e.min)} a ${formatearPrecio(e.max)}<small>Estimado · ${fmtM2(e.m2)}${hojas}</small></p>
    ${cerca}
    <div class="res__acts">
      <a class="btn btn--solid" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICONO_WSP}Pedir presupuesto sin costo</a>
    </div>
    <p class="res__nota">Es un estimado con precios de muestra: el presupuesto final lo armamos con vos, sin costo.</p>`;
}

function validarVano() {
  const lim = TIPOS_VANO[VANO.tipo].lim;
  let ok = true;
  ['ancho', 'alto'].forEach(dim => {
    const el = document.getElementById(`v-${dim}`);
    const err = document.getElementById(`v-${dim}-err`);
    const [a, b] = lim[dim];
    const val = Number(el?.value);
    const bien = el && el.value !== '' && Number.isFinite(val) && val >= a && val <= b;
    if (el) el.setAttribute('aria-invalid', String(!bien));
    if (err) { err.hidden = bien; err.textContent = `Entre ${a} y ${b} cm para ${TIPOS_VANO[VANO.tipo].n.toLowerCase()}`; }
    if (!bien) ok = false;
  });
  return ok;
}

function sincronizarVano() {
  const app = document.getElementById('vano-app');
  if (!app) return;
  const lim = TIPOS_VANO[VANO.tipo].lim;
  ['ancho', 'alto'].forEach(dim => {
    const el = document.getElementById(`v-${dim}`);
    if (!el) return;
    el.min = String(lim[dim][0]);
    el.max = String(lim[dim][1]);
    if (document.activeElement !== el) el.value = String(VANO[dim]);
  });
  app.querySelectorAll('input[name="v-tipo"]').forEach(i => { i.checked = i.value === VANO.tipo; });
  app.querySelectorAll('input[name="v-linea"]').forEach(i => { i.checked = i.value === VANO.linea; });
  const coloresOk = COLORES_LINEA[VANO.linea];
  if (!coloresOk.includes(VANO.color)) VANO.color = 'blanco';
  app.querySelectorAll('input[name="v-color"]').forEach(i => { i.disabled = !coloresOk.includes(i.value); i.checked = i.value === VANO.color; });
  const vidrios = VIDRIOS_VANO[VANO.tipo][VANO.linea];
  if (!vidrios.includes(VANO.vidrio)) VANO.vidrio = vidrios[0];
  const sel = document.getElementById('v-vidrio');
  if (sel) {
    sel.innerHTML = vidrios.map(v => `<option value="${v}">${esc(VIDRIOS[v].n)}</option>`).join('');
    sel.value = VANO.vidrio;
  }
  const corrediza = VANO.tipo === 'ventana' || VANO.tipo === 'puerta-ventana';
  const mw = document.getElementById('v-mosq-wrap');
  if (mw) mw.hidden = !corrediza;
  const mq = document.getElementById('v-mosq');
  if (mq) mq.checked = corrediza && VANO.mosq;
}

let ultimoRes = '';

function pintarVano(forzar = false) {
  const res = document.getElementById('vano-res');
  if (!res) return;
  const ok = validarVano();
  const r = buscarEstandar();
  pintarPlano(r);
  if (!ok) {
    const lim = TIPOS_VANO[VANO.tipo].lim;
    ultimoRes = 'error';
    res.innerHTML = `<p class="res__estado res__estado--error">Revisá la medida</p><p class="res__p">Para ${esc(TIPOS_VANO[VANO.tipo].n.toLowerCase())} cargá un vano de ${lim.ancho[0]} a ${lim.ancho[1]} cm de ancho y de ${lim.alto[0]} a ${lim.alto[1]} cm de alto. Si es más grande, <a class="res__link" href="${wspLink(`Hola ${MARCA}! Necesito una abertura grande y quiero asesoramiento.`)}" target="_blank" rel="noopener">escribinos y lo vemos</a>.</p>`;
    return;
  }
  const clave = r.tipo === 'std'
    ? `std|${r.p.id}|${r.m.k}|${VANO.ancho}|${VANO.alto}|${VANO.color}|${VANO.vidrio}|${VANO.mosq}|${Cart.libre(r.p, varVano(r.p, r.m))}`
    : `med|${VANO.tipo}|${VANO.linea}|${VANO.ancho}|${VANO.alto}|${VANO.color}|${VANO.vidrio}|${VANO.mosq}`;
  if (!forzar && clave === ultimoRes) return;
  ultimoRes = clave;
  res.innerHTML = resultadoHTML(r);
}

function cotizar(pre = {}) {
  ['tipo', 'linea', 'color', 'vidrio', 'ancho', 'alto', 'mosq'].forEach(k => { if (pre[k] !== undefined) VANO[k] = pre[k]; });
  const lim = TIPOS_VANO[VANO.tipo].lim;
  VANO.ancho = Math.min(lim.ancho[1], Math.max(lim.ancho[0], Math.round(VANO.ancho)));
  VANO.alto = Math.min(lim.alto[1], Math.max(lim.alto[0], Math.round(VANO.alto)));
  sincronizarVano();
  pintarVano(true);
  irA('medida');
}

function initVano() {
  const app = document.getElementById('vano-app');
  if (!app) return;
  const fijarDim = (dim, v) => {
    const [a, b] = TIPOS_VANO[VANO.tipo].lim[dim];
    VANO[dim] = Math.min(b, Math.max(a, Math.round(v)));
  };
  ['ancho', 'alto'].forEach(dim => {
    const el = document.getElementById(`v-${dim}`);
    if (!el) return;
    el.addEventListener('input', () => {
      const v = Number(el.value);
      const [a, b] = TIPOS_VANO[VANO.tipo].lim[dim];
      if (el.value !== '' && Number.isFinite(v) && v >= a && v <= b) VANO[dim] = Math.round(v);
      pintarVano();
    });
    el.addEventListener('change', () => {
      const v = Number(el.value);
      if (el.value !== '' && Number.isFinite(v) && v > 0) fijarDim(dim, v);
      el.value = String(VANO[dim]);
      pintarVano();
    });
  });
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-cm]');
    if (!b) return;
    const dim = b.dataset.cm;
    fijarDim(dim, VANO[dim] + Number(b.dataset.d));
    const el = document.getElementById(`v-${dim}`);
    if (el) el.value = String(VANO[dim]);
    pintarVano();
  });
  app.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'v-tipo') {
      VANO.tipo = t.value;
      const lim = TIPOS_VANO[VANO.tipo].lim;
      const ej = { ventana: [152, 112], 'puerta-ventana': [182, 202], pano: [102, 112], ventiluz: [62, 42] }[VANO.tipo];
      VANO.ancho = Math.min(lim.ancho[1], Math.max(lim.ancho[0], ej[0]));
      VANO.alto = Math.min(lim.alto[1], Math.max(lim.alto[0], ej[1]));
      if (VANO.tipo === 'pano') VANO.linea = 'm';
    } else if (t.name === 'v-linea') VANO.linea = t.value;
    else if (t.name === 'v-color') VANO.color = t.value;
    else if (t.id === 'v-vidrio') VANO.vidrio = t.value;
    else if (t.id === 'v-mosq') VANO.mosq = t.checked;
    else return;
    sincronizarVano();
    pintarVano();
  });
  const plano = document.getElementById('plano');
  let arrastre = null;
  const punto = ev => {
    const svg = plano?.querySelector('svg');
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    return pt.matrixTransform(ctm.inverse());
  };
  let cuadro = 0;
  plano?.addEventListener('pointerdown', ev => {
    if (!ev.target.closest('.plano__handle') || !planoGeo) return;
    const p = punto(ev);
    if (!p) return;
    ev.preventDefault();
    arrastre = { id: ev.pointerId, px: p.x, py: p.y, a: VANO.ancho, h: VANO.alto, s: planoGeo.s };
    planoFijo = { ...planoGeo };
    plano.classList.add('arrastrando');
    try { plano.setPointerCapture(ev.pointerId); } catch { arrastre.sinCaptura = true; }
  });
  plano?.addEventListener('pointermove', ev => {
    if (!arrastre || ev.pointerId !== arrastre.id) return;
    const p = punto(ev);
    if (!p) return;
    fijarDim('ancho', arrastre.a + (p.x - arrastre.px) / arrastre.s);
    fijarDim('alto', arrastre.h + (p.y - arrastre.py) / arrastre.s);
    if (cuadro) return;
    cuadro = requestAnimationFrame(() => { cuadro = 0; sincronizarVano(); pintarVano(); });
  });
  const soltar = ev => {
    if (!arrastre || (ev && ev.pointerId !== arrastre.id)) return;
    try { plano.releasePointerCapture(arrastre.id); } catch { arrastre = null; }
    arrastre = null;
    planoFijo = null;
    plano.classList.remove('arrastrando');
    sincronizarVano();
    pintarVano(true);
  };
  plano?.addEventListener('pointerup', soltar);
  plano?.addEventListener('pointercancel', soltar);
  sincronizarVano();
  pintarVano(true);
}

/* ---------- trabajos: la hoja que se corre (momento) ---------- */
let obraActiva = -1;

function fichaObraHTML(k) {
  const o = OBRAS[k];
  const n = PRODUCTOS.filter(p => p.cat === o.cat).length;
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
      <button type="button" class="btn btn--solid btn--sm" data-obra-cotizar="${k}">Quiero una así</button>
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
    body.innerHTML = '<div class="drawer-vacio"><p>Tu carrito está vacío. Elegí una abertura estándar, o cargá tu vano y te la cotizamos a medida.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver las aberturas</button></div>';
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
  const vistas = p.foto ? '<div class="m-vistas" role="group" aria-label="Fotos de la abertura"><button type="button" class="m-vista" data-m-vista="0" aria-pressed="true">De cerca</button><button type="button" class="m-vista" data-m-vista="1" aria-pressed="false">La foto entera</button></div>' : '';
  const rel = PRODUCTOS.filter(x => x.id !== p.id && (x.cat === p.cat || x.amb.some(a => p.amb.includes(a)))).sort((a, b) => (a.cat === p.cat ? 0 : 1) - (b.cat === p.cat ? 0 : 1)).slice(0, 3);
  const relHTML = rel.map(x => `<li><button type="button" class="m-rel" data-quick="${x.id}">${fotoHTML(x, 1)}<span>${esc(nombreLinea(x))}</span><b>Desde ${formatearPrecio(desde(x))}</b></button></li>`).join('');
  const ficha = `<dl class="ficha">${p.ficha.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}<div><dt>Medidas</dt><dd>${p.medidas.map(x => `${x.a}×${x.h}`).join(' · ')} cm</dd></div></dl>`;
  const cotizable = ['ventana', 'puerta-ventana', 'pano', 'ventiluz'].includes(p.tipo);
  return `<div class="m-grid">
    <div class="m-fotos">
      ${fotoHTML(p, AR_MODAL, 'm-foto', ' id="m-foto"')}
      ${vistas}
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
        ${cotizable ? `<button type="button" class="link" data-cotizar-p="${p.id}">¿Otra medida? Cotizala a medida</button>` : ''}
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
    const vista = e.target.closest('[data-m-vista]');
    if (vista) {
      const p = actual();
      const foto = document.getElementById('m-foto');
      if (!p || !foto || !p.foto) return;
      const k = Number(vista.dataset.mVista);
      foto.setAttribute('style', `--ar:${AR_MODAL};${recorte(p.foto, k ? [p.foco[0], p.foco[1], 1] : p.foco, AR_MODAL)}`);
      modal.querySelectorAll('[data-m-vista]').forEach(b => b.setAttribute('aria-pressed', String(b === vista)));
      return;
    }
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
    const cotP = e.target.closest('[data-cotizar-p]');
    if (cotP) {
      const p = getProducto(cotP.dataset.cotizarP);
      if (!p) return;
      const o = leerVar(p, varModal);
      const m = medidaDe(p, o.medida);
      cerrarModal(true);
      cotizar({ tipo: p.tipo, linea: p.linea || 't', color: o.color, vidrio: o.vidrio, mosq: o.mosq, ancho: m ? m.a + 2 : undefined, alto: m ? m.h + 2 : undefined });
      return;
    }
    if (e.target.closest('[data-add-std]')) {
      const r = buscarEstandar();
      if (r.tipo !== 'std') return;
      const v = varVano(r.p, r.m);
      const ok = Cart.add(r.p, 1, v);
      showToast(ok ? `Agregaste ${r.p.nombre} de ${medidaTxt(r.m)} al carrito.` : 'Ya tenés en el carrito todo el stock de esa medida.');
      pintarVano();
      return;
    }
    const pre = e.target.closest('[data-add-premarco]');
    if (pre) {
      const p = getProducto('premarco');
      if (!p) return;
      const ok = Cart.add(p, 1, pre.dataset.addPremarco);
      showToast(ok ? `Sumaste el premarco de ${varTxt(p, pre.dataset.addPremarco).split(' · ')[0]}.` : 'Ya tenés en el carrito todo el stock de ese premarco.');
      return;
    }
    const obra = e.target.closest('[data-obra-cotizar]');
    if (obra) {
      const o = OBRAS[Number(obra.dataset.obraCotizar)];
      if (o) cotizar({ tipo: o.tipo, linea: o.linea, color: o.color, vidrio: o.vidrio, mosq: false, ancho: o.ancho + 2, alto: o.alto + 2 });
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

function refrescarVistas() {
  if (document.getElementById('vano-res') && !document.querySelector('.plano.arrastrando')) pintarVano();
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
  initVano();
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
