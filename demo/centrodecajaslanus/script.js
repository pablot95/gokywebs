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
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WSP = '5491144407836';
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const UBICACION = [-34.70115, -58.40204];
const PAGINA = document.body.dataset.pagina || 'home';
const PRODUCTO_INICIAL = new URLSearchParams(location.search).get('producto');
const MODELO = document.body.classList.contains('m2') ? 2 : 1;
const URL_CAT = MODELO === 2 ? 'catalogo-2.html' : 'catalogo.html';
const DESC_TRANSF = 10;
const LIMITE_SERVIDOR = 100;
const POR_PAGINA = 16;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioTransf = n => Math.round(n * (1 - DESC_TRANSF / 100));
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const intentar = fn => { try { return fn(); } catch { return null; } };
const img = nombre => `images/${nombre}.webp`;

const CATEGORIAS = [
  { id: 'cajas', nombre: 'Cajas de cambios', sub: 'Nuevas y reacondicionadas', img: 'p-caja-hilux' },
  { id: 'diferenciales', nombre: 'Diferenciales', sub: 'Completos, coronas y piñones', img: 'p-dif' },
  { id: 'cremalleras', nombre: 'Cremalleras', sub: 'Dirección hidráulica', img: 'p-crem' },
  { id: 'direccion', nombre: 'Cajas de dirección', sub: 'Livianos y pesados', img: 'p-dir' },
];
const MARCAS = [
  { id: 'toyota', nombre: 'Toyota' }, { id: 'ford', nombre: 'Ford' }, { id: 'chevrolet', nombre: 'Chevrolet' },
  { id: 'mercedes', nombre: 'Mercedes-Benz' }, { id: 'vw', nombre: 'Volkswagen' },
];
const MOTORES = [
  { id: 'ford', nombre: 'Ford' }, { id: 'perkins', nombre: 'Perkins' }, { id: 'deutz', nombre: 'Deutz' },
  { id: 'slant-six', nombre: 'Slant Six' }, { id: 'v8', nombre: 'V8' }, { id: 'chevrolet', nombre: 'Chevrolet' },
];
const LINEAS = [{ id: 'liviana', nombre: 'Livianos' }, { id: 'pesada', nombre: 'Pesados' }];
const ESTADOS = [{ id: 'nueva', nombre: 'Nueva' }, { id: 'reacondicionada', nombre: 'Reacondicionada' }];
const GARANTIAS = [{ id: '12', nombre: '12 meses' }, { id: '6', nombre: '6 meses' }];
const PRECIOS = [
  { id: 'hasta-600', nombre: 'Hasta $600.000', min: 0, max: 600000 },
  { id: '600-1200', nombre: '$600.000 a $1.200.000', min: 600000, max: 1200000 },
  { id: '1200-2000', nombre: '$1.200.000 a $2.000.000', min: 1200000, max: 2000000 },
  { id: 'mas-2000', nombre: 'Más de $2.000.000', min: 2000000, max: Infinity },
];
const GRUPOS = {
  cat: { titulo: 'Categoría', ops: CATEGORIAS },
  linea: { titulo: 'Línea', ops: LINEAS },
  marca: { titulo: 'Marca del vehículo', ops: MARCAS },
  motor: { titulo: 'Adaptable a motor', ops: MOTORES },
  estado: { titulo: 'Estado', ops: ESTADOS },
  garantia: { titulo: 'Garantía', ops: GARANTIAS },
  precio: { titulo: 'Precio', ops: PRECIOS },
};
const ORDENES_UI = ['relevancia', 'precio-asc', 'precio-desc', 'garantia', 'nombre'];
const nombreDe = (lista, id) => lista.find(x => x.id === String(id))?.nombre || '';

const Servidor = (() => {
  const INCLUYE_TOYOTA = ['Tripa de velocímetro', 'Bulbo de marcha atrás', 'Palanca de cambios', 'Yugo', 'Taco de caja'];
  const COLECCION = [
    { id: 'cc-hilux-30', nombre: 'Caja de cambios Toyota Hilux 3.0 original, usada reacondicionada a nuevo', cat: 'cajas', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 12, precio: 1960000, peso: 52, stock: 3, destacado: 1, img: 'p-caja-hilux', galeria: ['p-caja-campana'], motores: ['ford', 'perkins', 'deutz', 'slant-six', 'v8', 'chevrolet'], incluye: INCLUYE_TOYOTA, desc: 'Caja original de Toyota Hilux 3.0, usada y reacondicionada a nuevo. Máxima resistencia y adaptaciones de precisión para el motor de tu vehículo.' },
    { id: 'cc-hilux-taiwan', nombre: 'Caja de cambios Toyota Hilux Taiwán de 5ta, nueva', cat: 'cajas', marca: 'toyota', linea: 'liviana', estado: 'nueva', garantia: 6, precio: 1299000, peso: 48, stock: 5, destacado: 2, img: 'p-caja-banco', galeria: ['p-caja-taller'], motores: ['ford', 'perkins', 'slant-six'], motorNotas: { ford: 'Ford 221' }, incluye: INCLUYE_TOYOTA, desc: 'Caja de 5ta tipo Toyota Hilux, fabricación Taiwán, nueva. Máxima resistencia y adaptaciones de precisión para Ford 221, Perkins y Slant Six.' },
    { id: 'cc-hilux-perkins', nombre: 'Caja Toyota Hilux de 5ta adaptada a motor Perkins', cat: 'cajas', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 12, precio: 2350000, peso: 61, stock: 2, destacado: 3, img: 'p-caja-adaptada', galeria: ['p-caja-placa'], motores: ['perkins'], incluye: [...INCLUYE_TOYOTA, 'Placa adaptadora y bulonería'], desc: 'Caja Toyota Hilux reacondicionada con la adaptación a motor Perkins hecha en el taller, lista para instalar.' },
    { id: 'dif-hilux', nombre: 'Diferencial trasero Toyota Hilux completo, reacondicionado', cat: 'diferenciales', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 980000, peso: 58, stock: 3, destacado: 4, img: 'p-dif', galeria: ['p-dif-corona'], desc: 'Diferencial trasero completo de Toyota Hilux, con relación original, reacondicionado en el taller.' },
    { id: 'crem-hilux', nombre: 'Cremallera de dirección hidráulica Toyota Hilux, reacondicionada', cat: 'cremalleras', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 420000, peso: 13, stock: 4, destacado: 5, img: 'p-crem', galeria: ['p-crem-cuerpo'], desc: 'Cremallera de dirección hidráulica para Toyota Hilux, reacondicionada, con extremos y fuelles.' },
    { id: 'dif-mb1114', nombre: 'Diferencial para camión Mercedes-Benz 1114, reacondicionado', cat: 'diferenciales', marca: 'mercedes', linea: 'pesada', estado: 'reacondicionada', garantia: 12, precio: 1850000, peso: 165, stock: 1, destacado: 6, img: 'p-dif-negro', desc: 'Diferencial para camión Mercedes-Benz 1114, reacondicionado. Consultanos el año y la relación de tu unidad para confirmar compatibilidad.' },
    { id: 'dir-f100', nombre: 'Caja de dirección hidráulica Ford F-100, reacondicionada', cat: 'direccion', marca: 'ford', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 650000, peso: 17, stock: 2, destacado: 7, img: 'p-dir', desc: 'Caja de dirección hidráulica para Ford F-100, reacondicionada. Pasanos el año de la camioneta para confirmar el modelo.' },
    { id: 'dir-mb1114', nombre: 'Caja de dirección hidráulica para camión Mercedes-Benz 1114, reacondicionada', cat: 'direccion', marca: 'mercedes', linea: 'pesada', estado: 'reacondicionada', garantia: 12, precio: 1150000, peso: 38, stock: 1, destacado: 8, img: 'p-dir-b', desc: 'Caja de dirección hidráulica para camión Mercedes-Benz 1114, reacondicionada en el taller.' },
    { id: 'cc-hilux-28', nombre: 'Caja de cambios Toyota Hilux 2.8 de 5ta, usada reacondicionada', cat: 'cajas', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 12, precio: 1590000, peso: 50, stock: 2, img: 'p-caja-campana', galeria: ['p-caja-hilux'], motores: ['ford', 'perkins', 'chevrolet'], incluye: INCLUYE_TOYOTA, desc: 'Caja de 5ta de Toyota Hilux 2.8, usada y reacondicionada. Se adapta a motores Ford, Perkins y Chevrolet.' },
    { id: 'crem-amarok', nombre: 'Cremallera de dirección hidráulica Volkswagen Amarok, reacondicionada', cat: 'cremalleras', marca: 'vw', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 560000, peso: 14, stock: 2, img: 'p-crem-cuerpo', galeria: ['p-crem'], desc: 'Cremallera de dirección hidráulica para Volkswagen Amarok, reacondicionada.' },
    { id: 'dif-f100', nombre: 'Diferencial completo Ford F-100, relación original', cat: 'diferenciales', marca: 'ford', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 890000, peso: 62, stock: 2, img: 'p-dif-corona', galeria: ['p-dif'], desc: 'Diferencial completo para Ford F-100 con relación original, reacondicionado.' },
    { id: 'cc-hilux-ford221', nombre: 'Caja Toyota Hilux de 5ta adaptada a motor Ford 221', cat: 'cajas', marca: 'toyota', linea: 'liviana', estado: 'reacondicionada', garantia: 12, precio: 2290000, peso: 60, stock: 1, img: 'p-caja-placa', galeria: ['p-caja-adaptada'], motores: ['ford'], motorNotas: { ford: 'Ford 221' }, incluye: [...INCLUYE_TOYOTA, 'Placa adaptadora y bulonería'], desc: 'Caja Toyota Hilux reacondicionada con la adaptación a motor Ford 221 hecha en el taller, lista para instalar.' },
    { id: 'dir-c10', nombre: 'Caja de dirección mecánica Chevrolet C-10, reacondicionada', cat: 'direccion', marca: 'chevrolet', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 480000, peso: 16, stock: 3, img: 'p-dir', desc: 'Caja de dirección mecánica para Chevrolet C-10, reacondicionada.' },
    { id: 'cc-f100', nombre: 'Caja de cambios para Ford F-100 de 4 marchas, reacondicionada', cat: 'cajas', marca: 'ford', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 1150000, peso: 46, stock: 2, img: 'p-caja-taller', desc: 'Caja de 4 marchas para Ford F-100, reacondicionada en el taller. Consultanos el año y el motor para confirmar compatibilidad.' },
    { id: 'crem-ranger', nombre: 'Cremallera de dirección hidráulica Ford Ranger, reacondicionada', cat: 'cremalleras', marca: 'ford', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 480000, peso: 13, stock: 3, img: 'p-crem', desc: 'Cremallera de dirección hidráulica para Ford Ranger, reacondicionada.' },
    { id: 'dif-s10', nombre: 'Diferencial trasero Chevrolet S10, reacondicionado', cat: 'diferenciales', marca: 'chevrolet', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 940000, peso: 55, stock: 2, img: 'p-dif', desc: 'Diferencial trasero para Chevrolet S10, reacondicionado.' },
    { id: 'cc-c10', nombre: 'Caja de cambios para Chevrolet C-10 de 4 marchas, reacondicionada', cat: 'cajas', marca: 'chevrolet', linea: 'liviana', estado: 'reacondicionada', garantia: 6, precio: 1090000, peso: 45, stock: 0, img: 'p-caja-banco', desc: 'Caja de 4 marchas para Chevrolet C-10, reacondicionada. Escribinos para saber cuándo vuelve a entrar.' },
    { id: 'crem-s10', nombre: 'Cremallera de dirección hidráulica Chevrolet S10, nueva', cat: 'cremalleras', marca: 'chevrolet', linea: 'liviana', estado: 'nueva', garantia: 6, precio: 610000, peso: 13, stock: 2, img: 'p-crem-cuerpo', desc: 'Cremallera de dirección hidráulica nueva para Chevrolet S10.' },
    { id: 'dif-corona-hilux', nombre: 'Corona y piñón Toyota Hilux, nuevos', cat: 'diferenciales', marca: 'toyota', linea: 'liviana', estado: 'nueva', garantia: 6, precio: 520000, peso: 14, stock: 4, img: 'p-dif-corona', desc: 'Juego de corona y piñón nuevos para el diferencial de Toyota Hilux.' },
    { id: 'cc-mb1114', nombre: 'Caja de cambios para camión Mercedes-Benz 1114, reacondicionada', cat: 'cajas', marca: 'mercedes', linea: 'pesada', estado: 'reacondicionada', garantia: 12, precio: 2890000, peso: 145, stock: 1, img: 'p-caja-taller', desc: 'Caja de cambios para camión Mercedes-Benz 1114, reacondicionada en el taller.' },
  ];
  const textos = new Map();
  COLECCION.forEach((p, i) => {
    p.orden = i;
    textos.set(p.id, normalizar([
      p.nombre, nombreDe(CATEGORIAS, p.cat), nombreDe(MARCAS, p.marca), nombreDe(LINEAS, p.linea), nombreDe(ESTADOS, p.estado), p.desc,
      ...(p.motores || []).map(m => 'motor ' + nombreDe(MOTORES, m)), ...Object.values(p.motorNotas || {}),
    ].join(' ')));
  });
  const en = (vals, v) => !vals?.length || vals.includes(v);
  const coincide = (p, f) => {
    if (p.visible === false) return false;
    if (f.destacado && !p.destacado) return false;
    if (!en(f.cat, p.cat) || !en(f.linea, p.linea) || !en(f.marca, p.marca) || !en(f.estado, p.estado) || !en(f.garantia, String(p.garantia))) return false;
    if (f.motor?.length && !f.motor.some(m => (p.motores || []).includes(m))) return false;
    if (f.precio?.length && !f.precio.some(id => { const r = PRECIOS.find(x => x.id === id); return r && p.precio >= r.min && p.precio < r.max; })) return false;
    if (f.q) {
      const texto = textos.get(p.id);
      if (!normalizar(f.q).split(/\s+/).filter(Boolean).every(w => texto.includes(w))) return false;
    }
    return true;
  };
  const rel = p => p.destacado || 100 + p.orden;
  const ORDENES = {
    relevancia: (a, b) => rel(a) - rel(b),
    'precio-asc': (a, b) => a.precio - b.precio || a.orden - b.orden,
    'precio-desc': (a, b) => b.precio - a.precio || a.orden - b.orden,
    garantia: (a, b) => b.garantia - a.garantia || rel(a) - rel(b),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden - b.orden,
  };
  const copia = p => ({ ...p, motores: [...(p.motores || [])], incluye: [...(p.incluye || [])], galeria: [...(p.galeria || [])], motorNotas: { ...(p.motorNotas || {}) } });

  function consultar({ filtros = {}, orden = 'relevancia', cursor = null, limite = LIMITE_SERVIDOR } = {}) {
    const tope = Math.min(Math.max(1, Math.floor(Number(limite)) || LIMITE_SERVIDOR), LIMITE_SERVIDOR);
    const lista = COLECCION.filter(p => coincide(p, filtros)).sort(ORDENES[orden] || ORDENES.relevancia);
    let desde = 0;
    if (cursor) {
      const i = lista.findIndex(p => p.id === cursor);
      if (i < 0) return Promise.resolve({ items: [], siguiente: null, total: lista.length });
      desde = i + 1;
    }
    const items = lista.slice(desde, desde + tope);
    const siguiente = items.length && desde + tope < lista.length ? items[items.length - 1].id : null;
    return Promise.resolve({ items: items.map(copia), siguiente, total: lista.length });
  }
  function obtener(ids) {
    const buscados = new Set([].concat(ids).slice(0, LIMITE_SERVIDOR));
    return Promise.resolve(COLECCION.filter(p => buscados.has(p.id) && p.visible !== false).map(copia));
  }
  function facetas() {
    const n = {};
    Object.keys(GRUPOS).forEach(g => { n[g] = {}; });
    const sumar = (g, v) => { n[g][v] = (n[g][v] || 0) + 1; };
    COLECCION.forEach(p => {
      if (p.visible === false) return;
      sumar('cat', p.cat); sumar('linea', p.linea); sumar('marca', p.marca); sumar('estado', p.estado); sumar('garantia', String(p.garantia));
      (p.motores || []).forEach(m => sumar('motor', m));
      const r = PRECIOS.find(x => p.precio >= x.min && p.precio < x.max);
      if (r) sumar('precio', r.id);
    });
    return Promise.resolve(n);
  }
  return { consultar, obtener, facetas };
})();

const VISTOS = new Map();
const recordar = items => { items.forEach(p => VISTOS.set(p.id, p)); return items; };
const getProducto = id => VISTOS.get(id);
async function pedir(params) {
  const r = await Servidor.consultar(params);
  recordar(r.items);
  return r;
}
async function asegurar(ids) {
  const faltan = [...new Set(ids)].filter(id => !VISTOS.has(id));
  if (faltan.length) recordar(await Servidor.obtener(faltan));
}

const Cart = {
  KEY: 'centrodecajas_cart',
  mem: [],
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return this.mem; } },
  save(items) { this.mem = items; intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items))); document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevD: '<path d="m6 9 6 6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  menos: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  basura: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  camion: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  local: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  paquete: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>',
  buscar: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  llave: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const ICO_CARRITO = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICO_WSP = '<svg class="ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

const ANIM = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
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

const corto = (s, n = 46) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const msgProducto = p => `Hola, quiero consultar por: ${p.nombre} (${formatearPrecio(precioFinal(p))}). ¿Está disponible?`;
const estadoTxt = p => (p.estado === 'nueva' ? 'Nueva' : 'Reacondicionada');
const nombreMotor = (m, p) => p.motorNotas?.[m] || nombreDe(MOTORES, m);
const stockHTML = p => {
  if (!(p.stock > 0)) return '<span class="card__stock card__stock--sin">Sin stock</span>';
  if (p.stock === 1) return '<span class="card__stock card__stock--ultimo">Última unidad</span>';
  return '<span class="card__stock">En stock</span>';
};
const garantiaHTML = p => `<span class="tag-g">${p.garantia} meses</span>`;
const fotoHTML = p => `<img src="${img(p.img)}" alt="${esc(p.nombre)}" width="800" height="800" decoding="async">`;
const stepperHTML = (p, valor = 1) => `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ico('menos')}</button><input type="number" min="1" max="${p.stock}" value="${valor}" inputmode="numeric" aria-label="Cantidad" data-qty><button type="button" data-step="1" aria-label="Sumar uno">${ico('mas')}</button></div>`;

function cardM1(p, anim = true) {
  const sin = !(p.stock > 0);
  const acciones = sin
    ? `<a class="prod-add prod-add--wsp" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener" aria-label="Consultar disponibilidad de ${esc(p.nombre)}"><span class="prod-add__txt">Consultar</span><span class="prod-add__ico">${ICO_WSP}</span></a>`
    : `${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="prod-add__txt">Agregar</span><span class="prod-add__ico">${ICO_CARRITO}</span></button>`;
  return `<article class="card card--m1" ${anim ? ANIM.subir : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${fotoHTML(p)}${stockHTML(p)}${garantiaHTML(p)}</button>
    <div class="card__info">
      <p class="card__meta">${esc(nombreDe(MARCAS, p.marca))} · ${estadoTxt(p)}</p>
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      <p class="card__transf">${formatearPrecio(precioTransf(precioFinal(p)))} <span class="card__transf-l">con transferencia</span><span class="card__transf-s">transf.</span></p>
      <div class="prod-actions">${acciones}</div>
      ${sin ? '' : `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`}
    </div>
  </article>`;
}

function cardM2(p, anim = true) {
  const sin = !(p.stock > 0);
  const boton = sin
    ? `<a class="card__add card__add--wsp" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener" aria-label="Consultar disponibilidad de ${esc(p.nombre)} por WhatsApp">${ICO_WSP}</a>`
    : `<button type="button" class="card__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_CARRITO}</button>`;
  return `<article class="card card--m2" ${anim ? ANIM.subir : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${fotoHTML(p)}</button>
    ${garantiaHTML(p)}
    <div class="card__info">
      <p class="card__meta">${esc(nombreDe(MARCAS, p.marca))} · ${sin ? 'Sin stock' : estadoTxt(p)}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      <p class="card__transf">${formatearPrecio(precioTransf(precioFinal(p)))} <span class="card__transf-l">con transferencia</span><span class="card__transf-s">transf.</span></p>
    </div>
    ${boton}
  </article>`;
}

const cardHTML = (p, anim = true) => (MODELO === 2 ? cardM2(p, anim) : cardM1(p, anim));
function pintar(cont, items, { agregar = false } = {}) {
  const html = items.map(p => cardHTML(p)).join('');
  if (agregar) cont.insertAdjacentHTML('beforeend', html);
  else cont.innerHTML = html;
}
const miniHTML = p => `<button type="button" class="mini" data-quick="${p.id}"><span class="mini__foto"><img src="${img(p.img)}" alt="" width="64" height="64"></span><span><span class="mini__nombre">${esc(p.nombre)}</span><span class="mini__meta">${p.garantia} meses de garantía · ${estadoTxt(p)}</span></span><span class="mini__precio">${formatearPrecio(precioFinal(p))}</span></button>`;

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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const foto = hero.querySelector('[data-hero-img]');
  if (foto) tl.from(foto, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li'), { y: 16, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.72)
    .from(hero.querySelectorAll('.hero-badge, .selector'), { y: 24, scale: 0.96, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero1__media img');
  if (foto) gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero1', start: 'top top', end: 'bottom top', scrub: true } });
  const taller = document.querySelector('.taller2__foto img');
  if (taller) gsap.fromTo(taller, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.taller2__foto', start: 'top bottom', end: 'bottom top', scrub: true } });
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

const hayOverlay = () => {
  const dr = document.getElementById('cartDrawer');
  const q = document.getElementById('qv');
  return (dr && !dr.hidden) || (q && !q.hidden) || document.getElementById('mainNav')?.classList.contains('open') || document.getElementById('filtros')?.classList.contains('open');
};
const syncScroll = () => document.body.classList.toggle('no-scroll', !!hayOverlay());

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  const header = document.querySelector('.site-header');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); syncScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
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

async function initCatsMenu() {
  const menus = document.querySelectorAll('[data-cats-menu]');
  if (!menus.length) return;
  const n = await Servidor.facetas();
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  const hover = window.matchMedia('(hover: hover) and (min-width: 1101px)');
  menus.forEach(menu => {
    const btn = menu.querySelector('.cats-menu__btn');
    const panel = menu.querySelector('[data-cats-panel]');
    if (!btn || !panel) return;
    panel.innerHTML = `<ul>${CATEGORIAS.map(c => `<li class="cats-menu__item"><a href="${URL_CAT}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${img(c.img)}" alt="" width="52" height="52"><span><span class="cats-menu__nombre">${esc(c.nombre)}</span><span class="cats-menu__sub">${esc(c.sub)}</span></span><span class="cats-menu__n">${n.cat[c.id] || 0}</span></a></li>`).join('')}</ul><a class="cats-menu__todo" href="${URL_CAT}">Ver todo el catálogo ${ico('flecha')}</a>`;
    let timer = 0;
    const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    menu.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    menu.addEventListener('mouseleave', () => { if (hover.matches) timer = setTimeout(cerrar, 120); });
    menu.addEventListener('focusout', e => { if (hover.matches && !menu.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hover.matches && !panel.hidden && !menu.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

async function initConteos() {
  const els = document.querySelectorAll('[data-cat-n]');
  if (!els.length) return;
  const n = await Servidor.facetas();
  els.forEach(el => { const c = n.cat[el.dataset.catN] || 0; el.textContent = `${c} ${c === 1 ? 'producto' : 'productos'}`; });
}

async function initDestacados() {
  const grid = document.querySelector('[data-grid="destacados"]');
  if (!grid) return;
  const { items } = await pedir({ filtros: { destacado: true }, limite: Number(grid.dataset.limite) || 8 });
  pintar(grid, items);
}

function initTabs() {
  const tabs = document.querySelector('[data-tabs]');
  const grid = document.querySelector('[data-grid="destacados"]');
  if (!tabs || !grid) return;
  const todo = document.querySelector('[data-tabs-todo]');
  tabs.innerHTML = [`<button type="button" class="chip" role="tab" aria-selected="true" aria-controls="${grid.id}" data-tab="">Destacados</button>`]
    .concat(CATEGORIAS.map(c => `<button type="button" class="chip" role="tab" aria-selected="false" aria-controls="${grid.id}" data-tab="${c.id}">${esc(c.nombre)}</button>`)).join('');
  tabs.addEventListener('click', async e => {
    const b = e.target.closest('[data-tab]');
    if (!b || b.getAttribute('aria-selected') === 'true') return;
    tabs.querySelectorAll('[data-tab]').forEach(t => t.setAttribute('aria-selected', String(t === b)));
    const cat = b.dataset.tab;
    const { items } = await pedir({ filtros: cat ? { cat: [cat] } : { destacado: true }, limite: 8 });
    pintar(grid, items);
    revelarNuevos(grid);
    if (todo) todo.href = cat ? `${URL_CAT}?cat=${cat}` : URL_CAT;
    refrescarST();
  });
}

async function initMotores() {
  const cajas = document.querySelectorAll('[data-motores]');
  for (const box of cajas) {
    const res = box.querySelector('[data-motores-res]');
    const chips = [...box.querySelectorAll('[data-motor]')];
    if (!res || !chips.length) continue;
    const elegir = async chip => {
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      const id = chip.dataset.motor;
      const nombre = nombreDe(MOTORES, id);
      const { items, total } = await pedir({ filtros: { motor: [id] }, limite: 2 });
      const consulta = esc(wa(`Hola, quiero consultar por una caja adaptada a motor ${nombre}. Mi vehículo es: `));
      res.innerHTML = total
        ? `<p class="motores__n"><b>${total}</b> ${total === 1 ? 'caja lista' : 'cajas listas'} para adaptar a motor ${esc(nombre)}</p>
           <div class="mini-lista">${items.map(miniHTML).join('')}</div>
           <div class="motores__acciones"><a class="btn btn--dark btn--sm" href="${URL_CAT}?motor=${id}">Ver ${total === 1 ? 'la caja' : `las ${total}`} en el catálogo</a><a class="btn btn--line btn--sm" href="${consulta}" target="_blank" rel="noopener">Consultar la adaptación</a></div>`
        : `<p class="motores__n">Todavía no hay una caja cargada para motor ${esc(nombre)}.</p><div class="motores__acciones"><a class="btn btn--wsp btn--sm" href="${consulta}" target="_blank" rel="noopener">Consultar la adaptación</a></div>`;
      refrescarST();
    };
    chips.forEach(c => c.addEventListener('click', () => elegir(c)));
    await elegir(chips[0]);
  }
}

function initSelector() {
  const form = document.querySelector('[data-selector]');
  if (!form) return;
  const btn = form.querySelector('[data-selector-btn]');
  const vacio = form.querySelector('[data-selector-vacio]');
  const leer = () => {
    const f = {};
    ['cat', 'marca', 'linea', 'motor'].forEach(k => { const v = form.elements[k]?.value; if (v) f[k] = [v]; });
    return f;
  };
  const actualizar = async () => {
    const f = leer();
    const { total } = await Servidor.consultar({ filtros: f, limite: 1 });
    if (btn) {
      btn.hidden = !total;
      btn.querySelector('[data-selector-txt]').textContent = `Ver ${total} ${total === 1 ? 'repuesto' : 'repuestos'}`;
    }
    if (vacio) {
      vacio.hidden = !!total;
      const pieza = nombreDe(CATEGORIAS, f.cat?.[0]) || 'un repuesto';
      const marca = nombreDe(MARCAS, f.marca?.[0]);
      const motor = nombreDe(MOTORES, f.motor?.[0]);
      vacio.querySelector('a').href = wa(`Hola, busco ${pieza.toLowerCase()}${marca ? ` para ${marca}` : ''}${motor ? ` adaptada a motor ${motor}` : ''}. ¿Lo tienen?`);
    }
  };
  form.addEventListener('change', actualizar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(leer()).forEach(([k, v]) => params.set(k, v.join(',')));
    const qs = params.toString();
    location.href = qs ? `${URL_CAT}?${qs}` : URL_CAT;
  });
  actualizar();
}

const ENVIO_KEY = 'centrodecajas_envio';
const Envio = {
  mem: {},
  get() { try { return JSON.parse(localStorage.getItem(ENVIO_KEY)) || {}; } catch { return this.mem; } },
  set(v) { this.mem = { ...this.get(), ...v }; intentar(() => localStorage.setItem(ENVIO_KEY, JSON.stringify(this.mem))); },
};
const ZONAS = {
  1: { nombre: 'CABA y Gran Buenos Aires', tier: 0 },
  2: { nombre: 'Santa Fe y norte de Buenos Aires', tier: 1 },
  3: { nombre: 'Litoral y NEA', tier: 1 },
  4: { nombre: 'Noroeste argentino', tier: 2 },
  5: { nombre: 'Córdoba y Cuyo', tier: 1 },
  6: { nombre: 'Oeste de Buenos Aires y La Pampa', tier: 1 },
  7: { nombre: 'Costa y sur de Buenos Aires', tier: 1 },
  8: { nombre: 'Bahía Blanca y Patagonia norte', tier: 3 },
  9: { nombre: 'Patagonia sur', tier: 4 },
};
const TARIFAS = [
  { flete: [16000, 240], correo: 1, dias: '24 a 48 h hábiles', diasCorreo: '2 a 3 días hábiles' },
  { expreso: [22000, 480], correo: 1.25, dias: '3 a 5 días hábiles', diasCorreo: '3 a 6 días hábiles' },
  { expreso: [29000, 620], correo: 1.5, dias: '4 a 7 días hábiles', diasCorreo: '4 a 7 días hábiles' },
  { expreso: [31000, 680], correo: 1.55, dias: '4 a 7 días hábiles', diasCorreo: '5 a 8 días hábiles' },
  { expreso: [37000, 790], correo: 1.8, dias: '5 a 8 días hábiles', diasCorreo: '6 a 10 días hábiles' },
];
const redondear = n => Math.round(n / 100) * 100;
const leerCP = v => { const m = String(v || '').trim().toUpperCase().match(/^[A-Z]?\s*(\d{4})(?:[A-Z]{3})?$/); return m ? m[1] : null; };
function opcionesEnvio(cp, peso) {
  const zona = ZONAS[cp?.[0]];
  if (!zona || Number(cp) < 1000) return null;
  const t = TARIFAS[zona.tier];
  const kg = Math.max(1, Math.ceil(peso || 1));
  const ops = [{ id: 'retiro', nombre: 'Retiro en el local', det: 'Viamonte 542, Lanús', precio: 0, icono: 'local' }];
  if (t.flete) ops.push({ id: 'flete', nombre: 'Flete a domicilio', det: `${t.dias} · estimado`, precio: redondear(t.flete[0] + t.flete[1] * kg), icono: 'camion' });
  else ops.push({ id: 'expreso', nombre: 'Expreso a sucursal de destino', det: `${t.dias} · estimado`, precio: redondear(t.expreso[0] + t.expreso[1] * kg), icono: 'camion' });
  if (kg <= 25) {
    const base = (12500 + 1050 * kg) * t.correo;
    ops.push({ id: 'andreani', nombre: 'Andreani a domicilio', det: `${t.diasCorreo} · estimado`, precio: redondear(base), icono: 'paquete' });
    ops.push({ id: 'correo', nombre: 'Correo Argentino a sucursal', det: `${t.diasCorreo} · estimado`, precio: redondear(base * 0.86), icono: 'paquete' });
  }
  return { cp, zona, ops, kg };
}
const pesoCarrito = () => Cart.get().reduce((s, i) => s + (getProducto(i.id)?.peso || 0) * i.qty, 0);
let envioUid = 0;
function opcionesHTML(r, modo, uid, elegido) {
  const filas = r.ops.map(o => {
    const inner = `${ico(o.icono)}<span><span class="opcion__nombre">${esc(o.nombre)}</span><span class="opcion__det">${esc(o.det)}</span></span><span class="opcion__precio">${formatearPrecio(o.precio)}</span>`;
    const cls = `opcion${o.precio ? '' : ' opcion--gratis'}`;
    return modo === 'carrito'
      ? `<label class="${cls}"><input type="radio" name="envio-${uid}" value="${o.id}"${o.id === elegido ? ' checked' : ''}>${inner}</label>`
      : `<div class="${cls}">${inner}</div>`;
  }).join('');
  return `<p class="envio__zona">CP <b>${r.cp}</b> · ${esc(r.zona.nombre)} · ${r.kg} kg</p>${filas}<p class="envio__nota">Valores estimados de referencia.${r.kg > 25 ? ' Por el peso, viaja por expreso o flete.' : ''}</p>`;
}
function initEnvios(raiz = document) {
  raiz.querySelectorAll('form[data-envio]').forEach(form => {
    if (form.dataset.listo) return;
    form.dataset.listo = '1';
    const uid = ++envioUid;
    const input = form.querySelector('[data-envio-cp]');
    const err = form.querySelector('[data-envio-err]');
    const res = form.querySelector('[data-envio-res]');
    const pieza = form.querySelector('[data-envio-pieza]');
    const modo = form.dataset.modo;
    const guardado = Envio.get();
    if (guardado.cp && input && !input.value) input.value = guardado.cp;
    const peso = () => {
      if (modo === 'carrito') return pesoCarrito();
      if (modo === 'producto') {
        const qty = Number(form.closest('.qv__info')?.querySelector('[data-qty]')?.value) || 1;
        return Number(form.dataset.peso) * qty;
      }
      return Number(pieza?.value) || 50;
    };
    const calcular = (avisar = true) => {
      if (!avisar && !input.value.trim()) input.value = Envio.get().cp || '';
      const valor = input.value.trim();
      const cp = leerCP(valor);
      const r = cp ? opcionesEnvio(cp, peso()) : null;
      if (!r) {
        res.innerHTML = '';
        if (avisar || valor) {
          err.textContent = valor ? 'Revisá el código postal: son 4 números, por ejemplo 1824.' : 'Escribí tu código postal para calcular el envío.';
          err.hidden = false;
          input.setAttribute('aria-invalid', 'true');
        }
        if (modo === 'carrito') renderResumen();
        return;
      }
      err.hidden = true;
      input.removeAttribute('aria-invalid');
      Envio.set({ cp });
      let elegido = Envio.get().opcion;
      if (!r.ops.some(o => o.id === elegido)) elegido = r.ops[1].id;
      if (modo === 'carrito') Envio.set({ opcion: elegido });
      res.innerHTML = opcionesHTML(r, modo, uid, elegido);
      if (modo === 'carrito') renderResumen();
    };
    form.addEventListener('submit', e => { e.preventDefault(); calcular(); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid')) { err.hidden = true; input.removeAttribute('aria-invalid'); } });
    pieza?.addEventListener('change', () => { if (res.innerHTML) calcular(false); });
    if (modo === 'carrito') {
      res.addEventListener('change', e => {
        const radio = e.target.closest('input[type="radio"]');
        if (radio) { Envio.set({ opcion: radio.value }); renderResumen(); }
      });
    }
    form.calcularEnvio = calcular;
    if (guardado.cp && modo === 'producto') calcular(false);
  });
}

const drawer = document.getElementById('cartDrawer');
let focoCarrito = null;
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

async function abrirCarrito() {
  if (!drawer) return;
  focoCarrito = document.activeElement;
  await renderCarrito();
  drawer.hidden = false;
  syncScroll();
  void drawer.offsetWidth;
  drawer.classList.add('open');
  drawer.querySelector('.drawer__panel')?.focus();
}
function cerrarCarrito() {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  setTimeout(() => { drawer.hidden = true; syncScroll(); }, reduceMotion ? 0 : 380);
  focoCarrito?.focus?.();
}
async function renderCarrito() {
  if (!drawer) return;
  const cont = drawer.querySelector('[data-cart-items]');
  const foot = drawer.querySelector('[data-cart-foot]');
  const env = drawer.querySelector('[data-cart-envio]');
  const items = Cart.get();
  await asegurar(items.map(i => i.id));
  if (!items.length) {
    cont.innerHTML = `<div class="drawer__vacio">${ICO_CARRITO}<p class="cat-vacio__t">Tu pedido está vacío</p><p>Sumá una caja, un diferencial o una cremallera y calculá el envío acá mismo.</p><a class="btn btn--cta" href="${URL_CAT}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    env.hidden = true;
    return;
  }
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea" data-linea="${p.id}">
      <div class="linea__foto"><img src="${img(p.img)}" alt="" width="72" height="72"></div>
      <div>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__unit">${formatearPrecio(precioFinal(p))} c/u · ${p.garantia} meses de garantía</p>
        <div class="linea__fila">
          <div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ico('menos')}</button><input type="number" min="1" max="${p.stock}" value="${i.qty}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-step="1" aria-label="Sumar uno">${ico('mas')}</button></div>
          <span class="linea__total" data-linea-total>${formatearPrecio(precioFinal(p) * i.qty)}</span>
        </div>
        <button type="button" class="linea__quitar" data-linea-quitar>${ico('basura')} Quitar</button>
      </div>
    </div>`;
  }).join('');
  env.hidden = false;
  foot.hidden = false;
  const form = env.querySelector('form');
  if (form?.calcularEnvio) form.calcularEnvio(false);
  else renderResumen();
}
function renderResumen() {
  const foot = drawer?.querySelector('[data-cart-foot]');
  if (!foot || foot.hidden) return;
  const sub = Cart.total();
  const e = Envio.get();
  const cp = leerCP(e.cp);
  const r = cp ? opcionesEnvio(cp, pesoCarrito()) : null;
  const op = r?.ops.find(o => o.id === e.opcion) || null;
  const envio = op ? op.precio : null;
  foot.innerHTML = `<div class="res-fila"><span>Subtotal</span><span>${formatearPrecio(sub)}</span></div>
    <div class="res-fila"><span>Envío${op ? ` · ${esc(op.nombre)}` : ''}</span><span>${envio === null ? 'Calculalo arriba' : formatearPrecio(envio)}</span></div>
    <div class="res-total"><span>Total</span><span>${formatearPrecio(sub + (envio || 0))}</span></div>
    <p class="res-transf">Con efectivo o transferencia: ${formatearPrecio(precioTransf(sub) + (envio || 0))} (10% OFF en los productos)</p>
    <button type="button" class="btn btn--cta btn--block" data-checkout>Finalizar compra</button>
    <button type="button" class="seguir" data-cart-close>Seguir comprando</button>`;
}
function actualizarLinea(id) {
  const fila = drawer?.querySelector(`[data-linea="${window.CSS.escape(id)}"]`);
  const p = getProducto(id);
  const it = Cart.get().find(i => i.id === id);
  if (!fila || !p || !it) return;
  fila.querySelector('[data-linea-qty]').value = it.qty;
  fila.querySelector('[data-linea-total]').textContent = formatearPrecio(precioFinal(p) * it.qty);
  const form = drawer.querySelector('[data-cart-envio] form');
  if (form?.calcularEnvio) form.calcularEnvio(false); else renderResumen();
}
drawer?.addEventListener('click', e => {
  const fila = e.target.closest('[data-linea]');
  if (!fila) return;
  const id = fila.dataset.linea;
  const paso = e.target.closest('[data-linea-step]');
  if (paso) {
    const it = Cart.get().find(i => i.id === id);
    if (it) { Cart.setQty(id, it.qty + Number(paso.dataset.lineaStep)); actualizarLinea(id); }
    return;
  }
  if (e.target.closest('[data-linea-quitar]')) {
    Cart.remove(id);
    if (!Cart.count()) renderCarrito();
    else { fila.remove(); const form = drawer.querySelector('[data-cart-envio] form'); if (form?.calcularEnvio) form.calcularEnvio(false); else renderResumen(); }
  }
});
drawer?.addEventListener('change', e => {
  const inp = e.target.closest('[data-linea-qty]');
  if (!inp) return;
  const id = inp.closest('[data-linea]').dataset.linea;
  Cart.setQty(id, Number(inp.value) || 1);
  actualizarLinea(id);
});

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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

const qv = document.getElementById('qv');
let focoQV = null;
function ldProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(img(p.img), location.href).href, category: nombreDe(CATEGORIAS, p.cat), brand: nombreDe(MARCAS, p.marca),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: 'Centro de Cajas Lanús' } },
  });
}
function escribirProductoURL(id) {
  const u = new URL(location.href);
  if (id) u.searchParams.set('producto', id); else u.searchParams.delete('producto');
  intentar(() => window.history.replaceState(null, '', u.pathname + u.search + u.hash));
}
async function abrirQV(id) {
  if (!qv) return;
  await asegurar([id]);
  const p = getProducto(id);
  if (!p) return;
  const { items } = await pedir({ filtros: { cat: [p.cat] }, limite: 4 });
  const relacionados = items.filter(x => x.id !== p.id).slice(0, 3);
  const fotos = [p.img, ...(p.galeria || [])];
  const sin = !(p.stock > 0);
  const comprar = sin
    ? `<a class="btn btn--wsp" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener">Consultar disponibilidad por WhatsApp</a>`
    : `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}">${ICO_CARRITO}<span>Agregar al carrito</span></button><button type="button" class="btn btn--dark" data-buy="${p.id}">Comprar ahora</button></div>`;
  qv.querySelector('#qvBody').innerHTML = `<div class="qv__grid">
    <div class="qv__galeria"><div class="qv__galeria-in">
      <div class="qv__principal"><img src="${img(fotos[0])}" alt="${esc(p.nombre)}" width="800" height="800" data-qv-img></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-qv-foto="${img(f)}" aria-pressed="${i === 0}" aria-label="Ver la foto ${i + 1}"><img src="${img(f)}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
    </div></div>
    <div class="qv__info">
      <div class="qv__chips"><span class="qv__chip">${esc(nombreDe(CATEGORIAS, p.cat))}</span><span class="qv__chip">${esc(nombreDe(MARCAS, p.marca))}</span><span class="qv__chip">${p.linea === 'pesada' ? 'Línea pesada' : 'Línea liviana'}</span><span class="qv__chip">${estadoTxt(p)}</span></div>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precios"><span class="qv__lista">Precio de lista</span><span class="qv__precio">${formatearPrecio(precioFinal(p))}</span><span class="qv__transf">${ico('check', 'ico--sm')}${formatearPrecio(precioTransf(precioFinal(p)))} con efectivo o transferencia (10% OFF)</span></div>
      <div class="qv__garantia"><span class="tag-g">${p.garantia} meses de garantía</span></div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.motores?.length ? `<div><p class="qv__bloque-t">Adaptaciones para</p><ul class="qv__checks">${p.motores.map(m => `<li>${ico('check')}${esc(nombreMotor(m, p))}</li>`).join('')}</ul></div>` : ''}
      ${p.incluye?.length ? `<div><p class="qv__bloque-t">Incluye</p><p class="qv__incluye">${esc(p.incluye.join(' · '))}</p></div>` : ''}
      ${comprar}
      <a class="qv__wsp" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener">${ICO_WSP}Consultar por WhatsApp</a>
      <div class="qv__envio">
        <form class="envio" data-envio data-modo="producto" data-peso="${p.peso}" novalidate>
          <p class="envio__t">${ico('camion')}Calculá el envío</p>
          <div class="envio__fila envio__campos"><label class="sr-only" for="qv-cp">Código postal</label><input class="campo" id="qv-cp" data-envio-cp type="text" inputmode="numeric" autocomplete="postal-code" maxlength="8" placeholder="Código postal (ej. 1824)"><button class="btn btn--dark" type="submit">Calcular</button></div>
          <p class="envio__err" data-envio-err role="alert" hidden></p>
          <div class="envio__res" data-envio-res aria-live="polite"></div>
        </form>
      </div>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__bloque-t">También te puede interesar</p><div class="mini-lista">${relacionados.map(miniHTML).join('')}</div></div>` : ''}
    </div>
  </div>`;
  initEnvios(qv);
  ldProducto(p);
  escribirProductoURL(p.id);
  const panel = qv.querySelector('.qv__panel');
  panel.scrollTop = 0;
  if (qv.hidden) {
    focoQV = document.activeElement;
    qv.hidden = false;
    syncScroll();
    void qv.offsetWidth;
    qv.classList.add('open');
  }
  panel.focus();
}
function cerrarQV(devolverFoco = true) {
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  escribirProductoURL(null);
  setTimeout(() => { qv.hidden = true; syncScroll(); }, reduceMotion ? 0 : 320);
  if (devolverFoco) focoQV?.focus?.();
}

const leerQty = (btn, p) => {
  const inp = btn.closest('.card, .qv__comprar')?.querySelector('[data-qty]');
  return Math.max(1, Math.min(Number(inp?.value) || 1, p.stock || 99));
};
document.addEventListener('click', async e => {
  const q = e.target.closest('[data-quick]');
  if (q) { e.preventDefault(); abrirQV(q.dataset.quick); return; }
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = getProducto(add.dataset.add);
    if (!p) return;
    const qty = leerQty(add, p);
    Cart.add(p, qty);
    showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${corto(p.nombre)}`);
    return;
  }
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    const p = getProducto(buy.dataset.buy);
    if (!p) return;
    Cart.add(p, leerQty(buy, p));
    cerrarQV(false);
    abrirCarrito();
    return;
  }
  const paso = e.target.closest('[data-step]');
  if (paso) {
    const inp = paso.parentElement.querySelector('[data-qty]');
    if (!inp) return;
    const max = Number(inp.max) || 99;
    inp.value = Math.max(1, Math.min(max, (Number(inp.value) || 1) + Number(paso.dataset.step)));
    const form = inp.closest('.qv__info')?.querySelector('form[data-envio]');
    if (form?.calcularEnvio && form.querySelector('[data-envio-res]').innerHTML) form.calcularEnvio(false);
    return;
  }
  const foto = e.target.closest('[data-qv-foto]');
  if (foto) {
    const principal = qv.querySelector('[data-qv-img]');
    if (principal) principal.src = foto.dataset.qvFoto;
    qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
    return;
  }
  if (e.target.closest('[data-cart-open]')) { abrirCarrito(); return; }
  if (e.target.closest('[data-cart-close]')) { cerrarCarrito(); return; }
  if (e.target.closest('[data-qv-close]')) { cerrarQV(); return; }
  if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); }
});
document.addEventListener('change', e => {
  const inp = e.target.closest('[data-qty]');
  if (!inp) return;
  const max = Number(inp.max) || 99;
  inp.value = Math.max(1, Math.min(max, Math.round(Number(inp.value)) || 1));
});

const enfocables = cont => [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
document.addEventListener('keydown', e => {
  const filtrosEl = document.getElementById('filtros');
  let capa = null;
  let cerrar = null;
  if (qv && !qv.hidden) { capa = qv.querySelector('.qv__panel'); cerrar = () => cerrarQV(); }
  else if (drawer && !drawer.hidden) { capa = drawer.querySelector('.drawer__panel'); cerrar = cerrarCarrito; }
  else if (filtrosEl?.classList.contains('open')) { capa = filtrosEl; cerrar = cerrarFiltros; }
  if (!capa) return;
  if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
  if (e.key !== 'Tab') return;
  const f = enfocables(capa);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === primero || document.activeElement === capa)) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
});

function initMapas() {
  if (typeof L === 'undefined') return;
  document.querySelectorAll('[data-mapa]').forEach(el => {
    const grande = !!el.closest('.envios2__mapa');
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: grande }).setView(UBICACION, 15);
    mapa.attributionControl.setPrefix(false);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({
      className: 'pin-mapa',
      html: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.2 6.4 11.1 7.3 11.8a1 1 0 0 0 1.4 0C13.6 21.1 20 15.2 20 10a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>',
      iconSize: [38, 38], iconAnchor: [19, 36],
    });
    L.marker(UBICACION, { icon: icono, title: 'Centro de Cajas Lanús · Viamonte 542' }).addTo(mapa);
    const centrar = () => {
      mapa.invalidateSize();
      mapa.setView(UBICACION, 15, { animate: false });
      const tarjeta = el.parentElement.querySelector('.envios2__dir');
      if (tarjeta && window.getComputedStyle(tarjeta).position === 'absolute') mapa.panBy([-Math.round(tarjeta.offsetWidth / 2), Math.round(tarjeta.offsetHeight / 2)], { animate: false });
    };
    centrar();
    window.addEventListener('load', centrar);
  });
}

const Cat = { filtros: {}, orden: 'relevancia', buffer: [], siguiente: null, total: 0, mostrados: 0, pedido: 0 };
let filtrosBackdrop = null;
function abrirFiltros() {
  const f = document.getElementById('filtros');
  if (!f) return;
  if (!filtrosBackdrop) {
    filtrosBackdrop = document.createElement('div');
    filtrosBackdrop.className = 'filtros-backdrop';
    filtrosBackdrop.addEventListener('click', cerrarFiltros);
    f.parentElement.appendChild(filtrosBackdrop);
  }
  f.classList.add('open');
  filtrosBackdrop.classList.add('open');
  syncScroll();
  f.querySelector('button, input')?.focus();
}
function cerrarFiltros() {
  const f = document.getElementById('filtros');
  if (!f?.classList.contains('open')) return;
  f.classList.remove('open');
  filtrosBackdrop?.classList.remove('open');
  syncScroll();
  document.querySelector('[data-filtros-abrir]')?.focus();
}

async function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const filtrosEl = document.getElementById('filtros');
  const buscar = document.querySelector('[data-cat-q]');
  const orden = document.querySelector('[data-cat-orden]');
  const mas = document.querySelector('[data-ver-mas]');
  const pie = document.querySelector('[data-cat-pie]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const chips = document.querySelector('[data-chips]');
  const contador = document.querySelectorAll('[data-cat-total]');
  const miga = document.querySelector('[data-miga-cat]');
  const pidioBuscar = location.hash === '#buscar';
  const n = await Servidor.facetas();

  filtrosEl?.querySelectorAll('[data-grupo]').forEach(ops => {
    const g = ops.dataset.grupo;
    ops.innerHTML = GRUPOS[g].ops.filter(o => n[g][o.id]).map(o => `<label class="fop"><input type="checkbox" data-f="${g}" value="${o.id}"><span>${esc(o.nombre)}</span><span class="fop__n">${n[g][o.id]}</span></label>`).join('');
  });

  const params = new URLSearchParams(location.search);
  Object.keys(GRUPOS).forEach(g => {
    const vals = (params.get(g) || '').split(',').filter(v => GRUPOS[g].ops.some(o => o.id === v));
    if (vals.length) Cat.filtros[g] = [...new Set(vals)];
  });
  const q = (params.get('q') || '').trim().slice(0, 80);
  if (q) Cat.filtros.q = q;
  const o = params.get('orden');
  if (ORDENES_UI.includes(o)) Cat.orden = o;

  const sincronizarUI = () => {
    filtrosEl?.querySelectorAll('input[data-f]').forEach(inp => { inp.checked = !!Cat.filtros[inp.dataset.f]?.includes(inp.value); });
    filtrosEl?.querySelectorAll('[data-badge]').forEach(b => { const c = Cat.filtros[b.dataset.badge]?.length || 0; b.textContent = c; b.classList.toggle('on', c > 0); });
    if (buscar && buscar.value !== (Cat.filtros.q || '')) buscar.value = Cat.filtros.q || '';
    if (orden) orden.value = Cat.orden;
  };
  const escribirURL = () => {
    const u = new URLSearchParams();
    Object.keys(GRUPOS).forEach(g => { if (Cat.filtros[g]?.length) u.set(g, Cat.filtros[g].join(',')); });
    if (Cat.filtros.q) u.set('q', Cat.filtros.q);
    if (Cat.orden !== 'relevancia') u.set('orden', Cat.orden);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod && qv && !qv.hidden) u.set('producto', prod);
    const qs = u.toString();
    intentar(() => window.history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '')));
  };
  const pintarChips = () => {
    if (!chips) return;
    const lista = [];
    Object.keys(GRUPOS).forEach(g => (Cat.filtros[g] || []).forEach(v => lista.push({ g, v, t: nombreDe(GRUPOS[g].ops, v) })));
    if (Cat.filtros.q) lista.push({ g: 'q', v: Cat.filtros.q, t: `“${Cat.filtros.q}”` });
    chips.innerHTML = lista.map(c => `<button type="button" class="chip-activo" data-quitar="${c.g}" data-valor="${esc(c.v)}" aria-label="Quitar el filtro ${esc(c.t)}">${esc(c.t)}${ico('x')}</button>`).join('');
  };
  const pintarMiga = () => {
    if (!miga) return;
    const cats = Cat.filtros.cat || [];
    miga.hidden = cats.length !== 1;
    miga.innerHTML = cats.length === 1 ? `${ico('chevR')}<span>${esc(nombreDe(CATEGORIAS, cats[0]))}</span>` : '';
  };
  const actualizarPie = () => {
    contador.forEach(c => { c.textContent = Cat.total; });
    document.querySelectorAll('[data-cat-palabra]').forEach(el => { el.textContent = Cat.total === 1 ? 'producto' : 'productos'; });
    vacio.hidden = Cat.total > 0;
    if (Cat.total === 0) {
      const consulta = vacio.querySelector('[data-vacio-wsp]');
      if (consulta) consulta.href = wa(`Hola, busco ${Cat.filtros.q ? `“${Cat.filtros.q}”` : 'una pieza que no encontré en el catálogo'}. ¿La tienen?`);
    }
    mas.hidden = Cat.mostrados >= Cat.total;
    pie.textContent = Cat.total ? `Mostrando ${Cat.mostrados} de ${Cat.total}` : '';
    document.querySelectorAll('[data-limpiar]').forEach(b => { b.hidden = !Object.keys(Cat.filtros).length; });
  };
  const mostrarMas = async () => {
    while (Cat.buffer.length < Cat.mostrados + POR_PAGINA && Cat.siguiente) {
      const r = await pedir({ filtros: Cat.filtros, orden: Cat.orden, cursor: Cat.siguiente, limite: LIMITE_SERVIDOR });
      Cat.buffer.push(...r.items);
      Cat.siguiente = r.siguiente;
    }
    const nuevos = Cat.buffer.slice(Cat.mostrados, Cat.mostrados + POR_PAGINA);
    pintar(grid, nuevos, { agregar: true });
    Cat.mostrados += nuevos.length;
    actualizarPie();
    revelarNuevos(grid);
    refrescarST();
  };
  const cargar = async () => {
    const id = ++Cat.pedido;
    const r = await pedir({ filtros: Cat.filtros, orden: Cat.orden, limite: LIMITE_SERVIDOR });
    if (id !== Cat.pedido) return;
    Cat.buffer = r.items;
    Cat.siguiente = r.siguiente;
    Cat.total = r.total;
    Cat.mostrados = 0;
    grid.innerHTML = '';
    sincronizarUI();
    pintarChips();
    pintarMiga();
    escribirURL();
    await mostrarMas();
  };
  const leerFiltros = () => {
    const nuevos = {};
    filtrosEl?.querySelectorAll('input[data-f]:checked').forEach(inp => { (nuevos[inp.dataset.f] ||= []).push(inp.value); });
    if (Cat.filtros.q) nuevos.q = Cat.filtros.q;
    Cat.filtros = nuevos;
  };

  filtrosEl?.addEventListener('change', e => { if (e.target.matches('input[data-f]')) { leerFiltros(); cargar(); } });
  let espera = 0;
  buscar?.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      const v = buscar.value.trim().slice(0, 80);
      if (v) Cat.filtros.q = v; else delete Cat.filtros.q;
      cargar();
    }, 250);
  });
  buscar?.closest('form')?.addEventListener('submit', e => e.preventDefault());
  orden?.addEventListener('change', () => { Cat.orden = ORDENES_UI.includes(orden.value) ? orden.value : 'relevancia'; cargar(); });
  mas?.addEventListener('click', mostrarMas);
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-quitar]');
    if (!b) return;
    const g = b.dataset.quitar;
    if (g === 'q') delete Cat.filtros.q;
    else {
      Cat.filtros[g] = (Cat.filtros[g] || []).filter(v => v !== b.dataset.valor);
      if (!Cat.filtros[g].length) delete Cat.filtros[g];
    }
    cargar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => { Cat.filtros = {}; cargar(); }));
  document.querySelector('[data-filtros-abrir]')?.addEventListener('click', abrirFiltros);
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  const popovers = window.matchMedia('(min-width: 1025px)');
  if (MODELO === 2 && filtrosEl) {
    filtrosEl.addEventListener('toggle', e => {
      if (!popovers.matches || !e.target.open) return;
      filtrosEl.querySelectorAll('details[open]').forEach(d => { if (d !== e.target) d.open = false; });
    }, true);
    document.addEventListener('click', e => {
      if (!popovers.matches || filtrosEl.contains(e.target)) return;
      filtrosEl.querySelectorAll('details[open]').forEach(d => { d.open = false; });
    });
  }
  document.querySelectorAll('a[href="#buscar"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); buscar?.scrollIntoView({ block: 'center' }); buscar?.focus({ preventScroll: true }); }));
  sincronizarUI();
  await cargar();
  if (pidioBuscar) buscar?.focus();
}

async function iniciar() {
  initHeroMotion();
  initModelBarScroll();
  initFloats();
  updateCartBadge();
  initEnvios();
  initSelector();
  initTabs();
  try {
    await Promise.all([initCatsMenu(), initConteos(), initDestacados(), initMotores(), initCatalogo()]);
  } catch (err) {
    console.error(err);
  }
  initReveals();
  initNav();
  initMapas();
  initParallax();
  if (PRODUCTO_INICIAL && /^[a-z0-9-]{2,60}$/.test(PRODUCTO_INICIAL)) abrirQV(PRODUCTO_INICIAL);
}
iniciar();
