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

const WSP = '5491122967543';
const wa = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const PAGINA = document.body.dataset.pagina || 'home';
const PARAMS_INICIALES = new URLSearchParams(location.search);
const MODELO = document.body.classList.contains('m2') ? 2 : 1;
const URL_CAT = MODELO === 2 ? 'catalogo-2.html' : 'catalogo.html';
const URL_HOME = MODELO === 2 ? 'modelo-2.html' : './';
const LIMITE_SERVIDOR = 100;
const POR_PAGINA = 16;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const intentar = fn => { try { return fn(); } catch { return null; } };
const img = nombre => `images/${nombre}.webp`;

const CATEGORIAS = [
  { id: 'receta', nombre: 'Armazones de receta', sub: 'Para tus anteojos graduados', img: 'p-lucca' },
  { id: 'sol', nombre: 'Anteojos de sol', sub: 'Formas y colores para cada cara', img: 'p-capri' },
  { id: 'contacto', nombre: 'Lentes de contacto', sub: 'Lentes, estuches y líquidos', img: 'p-lc' },
  { id: 'accesorios', nombre: 'Accesorios y cuidado', sub: 'Estuches, paños y kits de limpieza', img: 'p-cuidado' },
];
const FORMAS = [
  { id: 'redondo', nombre: 'Redondo' }, { id: 'cuadrado', nombre: 'Cuadrado' }, { id: 'rectangular', nombre: 'Rectangular' },
  { id: 'cat-eye', nombre: 'Cat eye' }, { id: 'aviador', nombre: 'Aviador' }, { id: 'mariposa', nombre: 'Mariposa' },
];
const MATERIALES = [{ id: 'acetato', nombre: 'Acetato' }, { id: 'metal', nombre: 'Metal' }];
const COLORES = [{ id: 'negro', nombre: 'Negro' }, { id: 'carey', nombre: 'Carey / habano' }, { id: 'transparente', nombre: 'Transparente' }, { id: 'dorado', nombre: 'Dorado' }];
const PRECIOS = [
  { id: 'hasta-30', nombre: 'Hasta $30.000', min: 0, max: 30000 },
  { id: '30-70', nombre: '$30.000 a $70.000', min: 30000, max: 70000 },
  { id: '70-80', nombre: '$70.000 a $80.000', min: 70000, max: 80000 },
  { id: 'mas-80', nombre: 'Más de $80.000', min: 80000, max: Infinity },
];
const GRUPOS = {
  cat: { titulo: 'Categoría', ops: CATEGORIAS },
  forma: { titulo: 'Forma', ops: FORMAS },
  material: { titulo: 'Material', ops: MATERIALES },
  color: { titulo: 'Color', ops: COLORES },
  precio: { titulo: 'Precio', ops: PRECIOS },
};
const ORDENES_UI = ['relevancia', 'precio-asc', 'precio-desc', 'nuevos', 'nombre'];
const nombreDe = (lista, id) => lista.find(x => x.id === String(id))?.nombre || '';

const Servidor = (() => {
  const COLECCION = [
    { id: 'rc-lucca', nombre: 'Armazón Lucca acetato habano', cat: 'receta', forma: 'cuadrado', material: 'acetato', color: 'carey', precio: 68000, stock: 4, destacado: 1, img: 'p-lucca', galeria: ['receta'], desc: 'Acetato habano con remaches metálicos y frente de líneas suaves. Pensado para usar con cristales graduados.' },
    { id: 'rc-mia', nombre: 'Armazón Mía redondo carey', cat: 'receta', forma: 'redondo', material: 'acetato', color: 'carey', precio: 72000, stock: 3, destacado: 2, img: 'p-mia', desc: 'Frente redondo en acetato carey, liviano y cómodo para el uso diario.' },
    { id: 'rc-dora', nombre: 'Armazón Dora metal dorado', cat: 'receta', forma: 'cuadrado', material: 'metal', color: 'dorado', precio: 86000, stock: 2, destacado: 3, nuevo: true, img: 'p-dora', desc: 'Metal fino en tono dorado con terminales de acetato y plaquetas regulables.' },
    { id: 'rc-gala', nombre: 'Armazón Gala cat eye negro y carey', cat: 'receta', forma: 'cat-eye', material: 'acetato', color: 'negro', precio: 76000, stock: 3, destacado: 4, img: 'p-gala', desc: 'Cat eye en acetato negro con interior carey: un armazón con carácter para tus anteojos graduados.' },
    { id: 'sl-capri', nombre: 'Anteojos de sol Capri habano degradé', cat: 'sol', forma: 'cuadrado', material: 'acetato', color: 'carey', precio: 79000, stock: 4, destacado: 5, img: 'p-capri', galeria: ['sol'], desc: 'Acetato habano translúcido con cristales marrones degradé.' },
    { id: 'sl-roma', nombre: 'Anteojos de sol Roma mariposa carey', cat: 'sol', forma: 'mariposa', material: 'acetato', color: 'carey', precio: 88000, stock: 2, destacado: 6, nuevo: true, img: 'p-roma', desc: 'Mariposa en acetato carey grueso con cristales verde oscuro.' },
    { id: 'lc-mensual', nombre: 'Lentes de contacto mensuales (caja x 6)', cat: 'contacto', precio: 36000, stock: 6, destacado: 7, requiereReceta: true, img: 'p-lc', galeria: ['contacto'], desc: 'Lentes blandas de reemplazo mensual. Se venden con receta: te pedimos tu graduación por WhatsApp.' },
    { id: 'ac-estuche', nombre: 'Estuche rígido símil cuero', cat: 'accesorios', precio: 12000, stock: 8, destacado: 8, img: 'p-estuche', desc: 'Estuche rígido con terminación símil cuero para guardar tus anteojos sin rayarlos.' },
    { id: 'rc-noa', nombre: 'Armazón Noa redondo negro', cat: 'receta', forma: 'redondo', material: 'acetato', color: 'negro', precio: 64000, stock: 5, img: 'p-noa', desc: 'Redondo en acetato negro de perfil fino.' },
    { id: 'sl-nina', nombre: 'Anteojos de sol Nina cat eye negro', cat: 'sol', forma: 'cat-eye', material: 'acetato', color: 'negro', precio: 84000, stock: 3, img: 'p-nina', desc: 'Cat eye de líneas rectas en acetato negro con cristales oscuros.' },
    { id: 'rc-clara', nombre: 'Armazón Clara cristal transparente', cat: 'receta', forma: 'cuadrado', material: 'acetato', color: 'transparente', precio: 66000, stock: 4, nuevo: true, img: 'p-clara', desc: 'Acetato transparente, liviano y discreto para todos los días.' },
    { id: 'ac-spray', nombre: 'Spray limpiador de cristales 60 ml', cat: 'accesorios', precio: 6500, stock: 12, img: 'p-spray', desc: 'Limpiador en spray para cristales y pantallas. Usalo con un paño de microfibra.' },
    { id: 'rc-piloto', nombre: 'Armazón Piloto aviador metal negro', cat: 'receta', forma: 'aviador', material: 'metal', color: 'negro', precio: 82000, stock: 2, img: 'p-piloto', desc: 'Aviador de metal negro con doble puente y plaquetas regulables.' },
    { id: 'sl-costa', nombre: 'Anteojos de sol Costa redondo carey', cat: 'sol', forma: 'redondo', material: 'acetato', color: 'carey', precio: 76000, stock: 3, img: 'p-costa', desc: 'Frente redondo carey con patillas de metal y cristales grises.' },
    { id: 'rc-tilo', nombre: 'Armazón Tilo transparente con patillas madera', cat: 'receta', forma: 'rectangular', material: 'acetato', color: 'transparente', precio: 79000, stock: 2, img: 'p-tilo', desc: 'Frente transparente con detalle de madera en las patillas.' },
    { id: 'lc-solucion', nombre: 'Solución multipropósito para lentes de contacto 360 ml', cat: 'contacto', precio: 14500, stock: 10, img: 'p-liquido', desc: 'Limpia, enjuaga y conserva tus lentes de contacto. Incluye estuche.' },
    { id: 'rc-vera', nombre: 'Armazón Vera carey cuadrado', cat: 'receta', forma: 'cuadrado', material: 'acetato', color: 'carey', precio: 70000, stock: 3, img: 'p-vera', desc: 'Cuadrado en acetato carey oscuro con remaches metálicos.' },
    { id: 'sl-urbano', nombre: 'Anteojos de sol Urbano rectangular negro', cat: 'sol', forma: 'rectangular', material: 'acetato', color: 'negro', precio: 69000, stock: 4, img: 'p-urbano', desc: 'Rectangular de acetato negro con cristales oscuros.' },
    { id: 'rc-bruno', nombre: 'Armazón Bruno rectangular negro', cat: 'receta', forma: 'rectangular', material: 'acetato', color: 'negro', precio: 62000, stock: 5, img: 'p-bruno', desc: 'Rectangular clásico en acetato negro brillante.' },
    { id: 'ac-pano', nombre: 'Paño de microfibra', cat: 'accesorios', precio: 3000, stock: 20, img: 'p-pano', desc: 'Paño suave de microfibra para limpiar los cristales sin rayarlos.' },
    { id: 'lc-estuche', nombre: 'Estuche para lentes de contacto con pinza', cat: 'contacto', precio: 4500, stock: 15, img: 'p-lc-estuche', desc: 'Estuche doble con tapas de color y pinza para manipular las lentes.' },
    { id: 'ac-reparacion', nombre: 'Kit de reparación: destornillador y plaquetas', cat: 'accesorios', precio: 5500, stock: 9, img: 'p-kit', desc: 'Destornillador de bolsillo y plaquetas de repuesto para ajustar tus anteojos.' },
    { id: 'ac-kit', nombre: 'Kit de cuidado: estuche, paño, spray y destornillador', cat: 'accesorios', precio: 19000, stock: 0, img: 'p-cuidado', desc: 'Todo para cuidar tus anteojos en un solo kit.' },
  ];
  const textos = new Map();
  COLECCION.forEach((p, i) => {
    p.orden = i;
    textos.set(p.id, normalizar([p.nombre, nombreDe(CATEGORIAS, p.cat), nombreDe(FORMAS, p.forma), nombreDe(MATERIALES, p.material), nombreDe(COLORES, p.color), p.desc].join(' ')));
  });
  const en = (vals, v) => !vals?.length || vals.includes(v);
  const coincide = (p, f) => {
    if (p.visible === false) return false;
    if (f.destacado && !p.destacado) return false;
    if (!en(f.cat, p.cat) || !en(f.forma, p.forma) || !en(f.material, p.material) || !en(f.color, p.color)) return false;
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
    nuevos: (a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || rel(a) - rel(b),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden - b.orden,
  };
  const copia = p => ({ ...p, galeria: [...(p.galeria || [])] });

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
    const sumar = (g, v) => { if (v) n[g][v] = (n[g][v] || 0) + 1; };
    COLECCION.forEach(p => {
      if (p.visible === false) return;
      sumar('cat', p.cat); sumar('forma', p.forma); sumar('material', p.material); sumar('color', p.color);
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
  KEY: 'skayvision_cart',
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
  izq: '<path d="m15 18-6-6 6-6"/>',
  der: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  mas: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  menos: '<path d="M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  basura: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  receta: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  anteojos: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
};
const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;
const ICO_CARRITO = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ICO_WSP = '<svg class="ico" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICO_ESTRELLA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11a.56.56 0 0 0 .48.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61l-4.73-2.89a.56.56 0 0 0-.59 0l-4.72 2.89a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .47-.35l2.13-5.11Z"/></svg>';
const ANIM = { subir: 'data-animate="subir" style="opacity:0;transform:translateY(36px)"' };

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3400);
}

const corto = (s, n = 44) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const msgProducto = p => `Hola skay.vision, quiero consultar por: ${p.nombre} (${formatearPrecio(precioFinal(p))}).`;
const metaDe = p => [nombreDe(MATERIALES, p.material), nombreDe(FORMAS, p.forma)].filter(Boolean).join(' · ') || nombreDe(CATEGORIAS, p.cat);
const tagsHTML = p => {
  const t = [];
  if (p.cat === 'receta') t.push('<span class="tag tag--receta">Para receta</span>');
  if (p.nuevo) t.push('<span class="tag">Nuevo</span>');
  if (!(p.stock > 0)) t.push('<span class="tag tag--sin">Sin stock</span>');
  else if (p.stock === 1) t.push('<span class="tag">Última unidad</span>');
  return t.length ? `<span class="card__tags">${t.join('')}</span>` : '';
};
const fotoHTML = p => `<img src="${img(p.img)}" alt="${esc(p.nombre)}" width="800" height="800" decoding="async">`;
const stepperHTML = p => `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ico('menos')}</button><input type="number" min="1" max="${p.stock}" value="1" inputmode="numeric" aria-label="Cantidad" data-qty><button type="button" data-step="1" aria-label="Sumar uno">${ico('mas')}</button></div>`;

function cardM1(p, anim = true) {
  const sin = !(p.stock > 0);
  const acciones = sin
    ? `<a class="prod-add prod-add--wsp" href="${esc(wa(msgProducto(p) + ' ¿Cuándo vuelve a entrar?'))}" target="_blank" rel="noopener" aria-label="Consultar disponibilidad de ${esc(p.nombre)}"><span class="prod-add__txt">Consultar</span><span class="prod-add__ico">${ICO_WSP}</span></a>`
    : `${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="prod-add__txt">Agregar</span><span class="prod-add__ico">${ICO_CARRITO}</span></button>`;
  return `<article class="card card--m1" ${anim ? ANIM.subir : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${fotoHTML(p)}${tagsHTML(p)}</button>
    <div class="card__info">
      <p class="card__meta">${esc(metaDe(p))}</p>
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      ${p.cat === 'receta' ? '<p class="card__nota">Cristales según tu receta</p>' : ''}
      <div class="prod-actions">${acciones}</div>
    </div>
  </article>`;
}

function cardM2(p, anim = true, clase = '') {
  const sin = !(p.stock > 0);
  const boton = sin
    ? `<a class="card__add card__add--wsp" href="${esc(wa(msgProducto(p) + ' ¿Cuándo vuelve a entrar?'))}" target="_blank" rel="noopener" aria-label="Consultar disponibilidad de ${esc(p.nombre)}">${ICO_WSP}</a>`
    : `<button type="button" class="card__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO_CARRITO}</button>`;
  return `<article class="card card--m2 ${clase}" ${anim ? ANIM.subir : ''} data-id="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${fotoHTML(p)}</button>
    ${tagsHTML(p)}
    <div class="card__info">
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      <p class="card__precio">${formatearPrecio(precioFinal(p))}</p>
      ${boton}
    </div>
  </article>`;
}

const cardHTML = (p, anim = true) => (MODELO === 2 ? cardM2(p, anim) : cardM1(p, anim));
function pintar(cont, items, { agregar = false } = {}) {
  const html = items.map(p => cardHTML(p)).join('');
  if (agregar) cont.insertAdjacentHTML('beforeend', html);
  else cont.innerHTML = html;
}
const miniHTML = p => `<button type="button" class="mini" data-quick="${p.id}"><img src="${img(p.img)}" alt="" width="58" height="58"><span class="mini__nombre">${esc(p.nombre)}</span><span class="mini__precio">${formatearPrecio(precioFinal(p))}</span></button>`;

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
  if (foto) tl.fromTo(foto, { clipPath: 'circle(14% at 50% 45%)', filter: 'blur(14px)', scale: 1.1 }, { clipPath: 'circle(75% at 50% 45%)', filter: 'blur(0px)', scale: 1, duration: 1.8, clearProps: 'clipPath,filter' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-trust li'), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.fromTo(el, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
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
  const capas = [...document.querySelectorAll('#cartDrawer, #qv, .dlg')];
  return capas.some(c => !c.hidden) || document.getElementById('mainNav')?.classList.contains('open') || document.getElementById('filtros')?.classList.contains('open');
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
  const activa = PAGINA === 'catalogo' ? PARAMS_INICIALES.get('cat') : null;
  const hover = window.matchMedia('(hover: hover) and (min-width: 1101px)');
  menus.forEach(menu => {
    const btn = menu.querySelector('.cats-menu__btn');
    const panel = menu.querySelector('[data-cats-panel]');
    if (!btn || !panel) return;
    panel.innerHTML = `<ul>${CATEGORIAS.map(c => `<li class="cats-menu__item"><a href="${URL_CAT}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${img(c.img)}" alt="" width="54" height="54"><span><span class="cats-menu__nombre">${esc(c.nombre)}</span><span class="cats-menu__sub">${esc(c.sub)}</span></span><span class="cats-menu__n">${n.cat[c.id] || 0}</span></a></li>`).join('')}</ul><a class="cats-menu__todo" href="${URL_CAT}">Ver todo el catálogo ${ico('flecha')}</a>`;
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

async function initDestacados() {
  const grid = document.querySelector('[data-grid="destacados"]');
  if (grid) {
    const { items } = await pedir({ filtros: { destacado: true }, limite: Number(grid.dataset.limite) || 8 });
    pintar(grid, items);
  }
  const mosaico = document.querySelector('[data-grid="mosaico"]');
  if (mosaico) {
    const { items } = await pedir({ filtros: { destacado: true }, limite: 8 });
    mosaico.innerHTML = items.map((p, i) => cardM2(p, true, i === 0 ? 'card--grande' : i === 1 ? 'card--ancho' : '')).join('');
  }
}

const COT = {
  uso: { lejos: 'Para ver de lejos', cerca: 'Para leer o ver de cerca', ambas: 'Para lejos y cerca', asesorar: 'No sé, que me asesoren' },
  extras: { antirreflejo: 'Antirreflejo', 'luz-azul': 'Filtro de luz azul', fotocromatico: 'Fotocromático', delgado: 'Cristal más delgado' },
  receta: { tengo: 'Tengo la receta: la mando por WhatsApp', notengo: 'Todavía no tengo receta' },
};
async function initCotizador() {
  const form = document.querySelector('[data-cotizador]');
  if (!form) return;
  const sel = form.querySelector('[data-armazon]');
  const { items } = await pedir({ filtros: { cat: ['receta'] }, limite: LIMITE_SERVIDOR });
  sel.innerHTML = '<option value="asesorar">Todavía no elegí: quiero que me asesoren</option>'
    + items.map(p => `<option value="${p.id}">${esc(p.nombre)} · ${formatearPrecio(p.precio)}</option>`).join('')
    + '<option value="propio">Tengo mi propio armazón</option>';
  const inicial = PARAMS_INICIALES.get('armazon');
  if (inicial && items.some(p => p.id === inicial)) sel.value = inicial;
  const res = document.querySelector('[data-resumen]');
  const pintarResumen = () => {
    const armazonId = sel.value;
    const p = getProducto(armazonId);
    const armazon = p ? `${p.nombre} (${formatearPrecio(p.precio)})` : sel.selectedOptions[0]?.textContent || '';
    const uso = COT.uso[form.querySelector('input[name="uso"]:checked')?.value] || 'Sin indicar';
    const extras = [...form.querySelectorAll('input[data-extra]:checked')].map(i => COT.extras[i.value]);
    const receta = COT.receta[form.querySelector('input[name="receta"]:checked')?.value] || 'Sin indicar';
    if (!res) return;
    res.querySelector('[data-r="armazon"]').textContent = armazon;
    res.querySelector('[data-r="uso"]').textContent = uso;
    res.querySelector('[data-r="extras"]').textContent = extras.length ? extras.join(', ') : 'Que me recomienden';
    res.querySelector('[data-r="receta"]').textContent = receta;
    const foto = res.querySelector('[data-r-img]');
    if (foto) {
      foto.hidden = !p;
      if (p) { foto.querySelector('img').src = img(p.img); foto.querySelector('[data-r-nombre]').textContent = p.nombre; }
    }
    const texto = ['Hola skay.vision, quiero cotizar anteojos con receta.', `Armazón: ${armazon}`, `Uso: ${uso}`, `Me interesa consultar por: ${extras.length ? extras.join(', ') : 'lo que me recomienden'}`, `Receta: ${receta}`].join('\n');
    res.querySelector('[data-cotizar-wsp]').href = wa(texto);
  };
  form.addEventListener('change', pintarResumen);
  pintarResumen();
}
function cotizarCon(id) {
  const sel = document.querySelector('[data-cotizador] [data-armazon]');
  if (sel && [...sel.options].some(o => o.value === id)) {
    sel.value = id;
    sel.dispatchEvent(new window.Event('change', { bubbles: true }));
    cerrarQV(false);
    document.getElementById('receta')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => sel.focus({ preventScroll: true }), reduceMotion ? 0 : 600);
    showToast('Elegiste el armazón: ahora contanos para qué los usás');
    return;
  }
  location.href = `${URL_HOME}?armazon=${encodeURIComponent(id)}#receta`;
}

const GALERIA = [
  { src: 'asesoramiento', cap: 'Asesoramiento personalizado para elegir el armazón' },
  { src: 'modelo', cap: 'Probando un armazón frente al espejo' },
  { src: 'receta', cap: 'Armazón de acetato habano' },
  { src: 'g-marmol', cap: 'Armazones de acetato y de metal' },
  { src: 'sol', cap: 'Anteojos de sol de acetato habano' },
  { src: 'cuidado', cap: 'Estuche, paño y kit de cuidado' },
  { src: 'g-flores', cap: 'Armazón redondo de metal' },
  { src: 'contacto', cap: 'Lentes de contacto, estuche y solución' },
];
let lbIndice = 0;
function pintarLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const g = GALERIA[lbIndice];
  const foto = lb.querySelector('[data-lb-img]');
  foto.src = img(g.src);
  foto.alt = g.cap;
  lb.querySelector('[data-lb-cap]').textContent = g.cap;
  lb.querySelector('[data-lb-n]').textContent = `${lbIndice + 1} de ${GALERIA.length}`;
}
function moverLightbox(paso) {
  lbIndice = (lbIndice + paso + GALERIA.length) % GALERIA.length;
  pintarLightbox();
}
function initGaleria() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.querySelector('[data-lb-prev]').addEventListener('click', () => moverLightbox(-1));
  lb.querySelector('[data-lb-next]').addEventListener('click', () => moverLightbox(1));
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') moverLightbox(-1);
    if (e.key === 'ArrowRight') moverLightbox(1);
  });
  let x0 = null;
  const fig = lb.querySelector('.lb__fig');
  fig.addEventListener('pointerdown', e => { x0 = e.clientX; });
  fig.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) moverLightbox(dx < 0 ? 1 : -1);
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    const cab = rail.closest('section')?.querySelector('[data-rail-flechas]');
    const prev = cab?.querySelector('[data-rail-prev]');
    const next = cab?.querySelector('[data-rail-next]');
    if (!vp || !track) return;
    let pointerId = null;
    let x0 = 0;
    let s0 = 0;
    let moved = false;
    let bloquearClick = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; x0 = e.clientX; s0 = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
      }
      if (moved) vp.scrollLeft = s0 - dx;
    });
    const fin = e => {
      if (pointerId !== e.pointerId) return;
      if (moved) { bloquearClick = true; setTimeout(() => { bloquearClick = false; }, 60); }
      try { vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
      pointerId = null; moved = false;
      vp.classList.remove('dragging');
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('click', e => { if (bloquearClick) { e.preventDefault(); e.stopPropagation(); } }, true);
    const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 300) + 14;
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    const flechas = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
    };
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();
  });
}

const COM_KEY = 'skayvision_comentarios';
const Comentarios = {
  mem: [],
  get() { try { return JSON.parse(localStorage.getItem(COM_KEY)) || []; } catch { return this.mem; } },
  save(lista) { this.mem = lista; intentar(() => localStorage.setItem(COM_KEY, JSON.stringify(lista))); },
};
const QUE = { receta: 'Anteojos con receta', sol: 'Anteojos de sol', contacto: 'Lentes de contacto', accesorios: 'Accesorios', asesoramiento: 'Asesoramiento' };
function pintarComentarios() {
  const lista = document.querySelector('[data-comentarios-lista]');
  const vacio = document.querySelector('[data-comentarios-vacio]');
  if (!lista) return;
  const items = Comentarios.get();
  if (vacio) vacio.hidden = items.length > 0;
  lista.innerHTML = items.map(c => `<article class="coment">
    <div class="coment__cab"><span class="coment__avatar" aria-hidden="true">${esc(c.nombre.trim().charAt(0).toUpperCase())}</span><div><p class="coment__nombre">${esc(c.nombre)}</p><p class="coment__meta">${esc([QUE[c.que], c.fecha].filter(Boolean).join(' · '))}</p></div></div>
    <p class="estrellas" aria-label="${c.estrellas} de 5 estrellas">${ICO_ESTRELLA.repeat(c.estrellas)}</p>
    <p class="coment__texto">${esc(c.texto)}</p>
    <p class="coment__estado">Vista previa: se publica cuando la óptica lo aprueba</p>
  </article>`).join('');
}
function initComentarios() {
  pintarComentarios();
  const url = location.origin + location.pathname.replace(/[^/]*$/, '');
  document.querySelectorAll('[data-recomendar]').forEach(a => { a.href = `https://wa.me/?text=${encodeURIComponent(`Te recomiendo skay.vision, la óptica donde me asesoraron con mis anteojos: ${url}`)}`; });
  document.querySelectorAll('[data-copiar-link]').forEach(b => b.addEventListener('click', async () => {
    const ok = await (navigator.clipboard?.writeText(url).then(() => true).catch(() => false) ?? false);
    showToast(ok ? 'Link copiado: pegalo donde quieras recomendarnos' : url);
  }));
  const form = document.getElementById('formComentario');
  if (!form) return;
  const texto = form.elements.texto;
  const cuenta = form.querySelector('[data-cuenta]');
  texto.addEventListener('input', () => { cuenta.textContent = `${texto.value.length}/400`; });
  const error = (campo, msg) => {
    const el = form.querySelector(`[data-error="${campo}"]`);
    if (el) { el.textContent = msg; el.hidden = !msg; }
    const input = form.elements[campo];
    if (input && input.setAttribute && !(input instanceof window.RadioNodeList)) { if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    return !msg;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = form.elements.nombre.value.trim();
    const estrellas = Number(form.elements.estrellas.value || 0);
    const valor = texto.value.trim();
    const ok = [
      error('nombre', nombre.length < 2 ? 'Escribí tu nombre.' : ''),
      error('estrellas', estrellas < 1 ? 'Elegí de 1 a 5 estrellas.' : ''),
      error('texto', valor.length < 10 ? 'Contanos un poco más (mínimo 10 caracteres).' : ''),
      error('acepto', form.elements.acepto.checked ? '' : 'Necesitamos tu OK para publicarlo.'),
    ].every(Boolean);
    if (!ok) { form.querySelector('[aria-invalid="true"], input:invalid')?.focus(); return; }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      const fecha = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
      Comentarios.save([{ nombre: nombre.slice(0, 40), que: form.elements.que.value, estrellas, texto: valor.slice(0, 400), fecha }, ...Comentarios.get()].slice(0, 6));
      pintarComentarios();
      form.reset();
      cuenta.textContent = '0/400';
      btn.disabled = false;
      btn.textContent = 'Publicar comentario';
      cerrarDlg(document.getElementById('dlgComentar'));
      showToast('¡Gracias! En la web publicada, la óptica aprueba cada comentario antes de mostrarlo.');
      refrescarST();
    }, 800);
  });
}

let focoDlg = null;
function abrirDlg(dlg) {
  if (!dlg) return;
  focoDlg = document.activeElement;
  dlg.hidden = false;
  syncScroll();
  void dlg.offsetWidth;
  dlg.classList.add('open');
  (dlg.querySelector('[autofocus]') || dlg.querySelector('.dlg__panel'))?.focus();
}
function cerrarDlg(dlg) {
  if (!dlg || dlg.hidden) return;
  dlg.classList.remove('open');
  setTimeout(() => { dlg.hidden = true; syncScroll(); }, reduceMotion ? 0 : 320);
  focoDlg?.focus?.();
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
  const items = Cart.get();
  await asegurar(items.map(i => i.id));
  if (!items.length) {
    cont.innerHTML = `<div class="drawer__vacio">${ico('anteojos')}<p class="drawer__vacio-t">Tu carrito está vacío</p><p>Sumá un armazón, unos anteojos de sol o algo para cuidar tus lentes.</p><a class="btn btn--cta" href="${URL_CAT}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  const conReceta = items.find(i => getProducto(i.id)?.cat === 'receta');
  cont.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea" data-linea="${p.id}">
      <div class="linea__foto"><img src="${img(p.img)}" alt="" width="72" height="72"></div>
      <div>
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__unit">${formatearPrecio(precioFinal(p))} c/u${p.cat === 'receta' ? ' · armazón' : ''}</p>
        <div class="linea__fila">
          <div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ico('menos')}</button><input type="number" min="1" max="${p.stock}" value="${i.qty}" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}" data-linea-qty><button type="button" data-linea-step="1" aria-label="Sumar uno">${ico('mas')}</button></div>
          <span class="linea__total" data-linea-total>${formatearPrecio(precioFinal(p) * i.qty)}</span>
        </div>
        <button type="button" class="linea__quitar" data-linea-quitar>${ico('basura')} Quitar</button>
      </div>
    </div>`;
  }).join('') + (conReceta ? `<div class="qv__nota drawer__receta">${ico('receta')}<span>¿Lo querés con cristales graduados? <button type="button" class="link-mas" data-cotizar="${conReceta.id}">Cotizalo con tu receta</button></span></div>` : '');
  foot.hidden = false;
  renderResumen();
}
function renderResumen() {
  const foot = drawer?.querySelector('[data-cart-foot]');
  if (!foot || foot.hidden) return;
  foot.innerHTML = `<div class="res-total"><span>Total</span><span>${formatearPrecio(Cart.total())}</span></div>
    <p class="res-nota">El envío o el retiro se coordina por WhatsApp al confirmar el pedido.</p>
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
  renderResumen();
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
  if (e.target.closest('[data-linea-quitar]')) { Cart.remove(id); renderCarrito(); }
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
    image: new URL(img(p.img), location.href).href, category: nombreDe(CATEGORIAS, p.cat),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@type': 'Organization', name: 'skay.vision' } },
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
  const chips = [nombreDe(CATEGORIAS, p.cat), nombreDe(FORMAS, p.forma), nombreDe(MATERIALES, p.material), nombreDe(COLORES, p.color)].filter(Boolean);
  const nota = p.cat === 'receta'
    ? `<p class="qv__nota">${ico('receta')}<span>Precio del armazón. Los cristales se cotizan con tu receta: elegí este armazón en el cotizador y te pasamos las opciones por WhatsApp.</span></p>`
    : p.requiereReceta ? `<p class="qv__nota">${ico('info')}<span>Para lentes de contacto necesitamos tu receta: te la pedimos por WhatsApp al confirmar el pedido.</span></p>` : '';
  const comprar = sin
    ? `<a class="btn btn--teal" href="${esc(wa(msgProducto(p) + ' ¿Cuándo vuelve a entrar?'))}" target="_blank" rel="noopener">${ICO_WSP}Consultar disponibilidad</a>`
    : `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}">${ICO_CARRITO}<span>Agregar al carrito</span></button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div>`;
  qv.querySelector('#qvBody').innerHTML = `<div class="qv__grid">
    <div class="qv__galeria"><div class="qv__galeria-in">
      <div class="qv__principal"><img src="${img(fotos[0])}" alt="${esc(p.nombre)}" width="800" height="800" data-qv-img></div>
    </div></div>
    <div class="qv__info">
      <div class="qv__chips">${chips.map(c => `<span class="qv__chip">${esc(c)}</span>`).join('')}</div>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${formatearPrecio(precioFinal(p))}</p>
      ${nota}
      <p class="qv__desc">${esc(p.desc)}</p>
      ${comprar}
      ${p.cat === 'receta' ? `<button type="button" class="btn btn--teal" data-cotizar="${p.id}">${ico('receta')}Cotizar con mi receta</button>` : ''}
      <a class="qv__wsp" href="${esc(wa(msgProducto(p)))}" target="_blank" rel="noopener">${ICO_WSP}Consultar por WhatsApp</a>
      ${relacionados.length ? `<div class="qv__rel"><p class="qv__bloque-t">También te puede interesar</p><div class="mini-lista">${relacionados.map(miniHTML).join('')}</div></div>` : ''}
    </div>
  </div>`;
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
document.addEventListener('click', e => {
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
  const cot = e.target.closest('[data-cotizar]');
  if (cot) { cerrarCarrito(); cotizarCon(cot.dataset.cotizar); return; }
  const paso = e.target.closest('[data-step]');
  if (paso) {
    const inp = paso.parentElement.querySelector('[data-qty]');
    if (!inp) return;
    const max = Number(inp.max) || 99;
    inp.value = Math.max(1, Math.min(max, (Number(inp.value) || 1) + Number(paso.dataset.step)));
    return;
  }
  const lb = e.target.closest('[data-lb]');
  if (lb) { lbIndice = Number(lb.dataset.lb) || 0; pintarLightbox(); abrirDlg(document.getElementById('lightbox')); return; }
  const abre = e.target.closest('[data-abrir]');
  if (abre) { abrirDlg(document.getElementById(abre.dataset.abrir)); return; }
  const cierra = e.target.closest('[data-dlg-cerrar]');
  if (cierra) { cerrarDlg(cierra.closest('.dlg')); return; }
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
  const dlgAbierto = [...document.querySelectorAll('.dlg.open')].pop();
  let capa = null;
  let cerrar = null;
  if (dlgAbierto) { capa = dlgAbierto.querySelector('.dlg__panel'); cerrar = () => cerrarDlg(dlgAbierto); }
  else if (qv && !qv.hidden) { capa = qv.querySelector('.qv__panel'); cerrar = () => cerrarQV(); }
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

  Object.keys(GRUPOS).forEach(g => {
    const vals = (PARAMS_INICIALES.get(g) || '').split(',').filter(v => GRUPOS[g].ops.some(o => o.id === v));
    if (vals.length) Cat.filtros[g] = [...new Set(vals)];
  });
  const q = (PARAMS_INICIALES.get('q') || '').trim().slice(0, 80);
  if (q) Cat.filtros.q = q;
  const o = PARAMS_INICIALES.get('orden');
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
    miga.innerHTML = cats.length === 1 ? `${ico('der')}<span>${esc(nombreDe(CATEGORIAS, cats[0]))}</span>` : '';
  };
  const actualizarPie = () => {
    contador.forEach(c => { c.textContent = Cat.total; });
    document.querySelectorAll('[data-cat-palabra]').forEach(el => { el.textContent = Cat.total === 1 ? 'producto' : 'productos'; });
    vacio.hidden = Cat.total > 0;
    if (Cat.total === 0) {
      const consulta = vacio.querySelector('[data-vacio-wsp]');
      if (consulta) consulta.href = wa(`Hola skay.vision, busco ${Cat.filtros.q ? `“${Cat.filtros.q}”` : 'un producto que no encontré en el catálogo'}. ¿Lo tienen?`);
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
  const aplicarBusqueda = () => {
    const v = buscar.value.trim().slice(0, 80);
    if (v) Cat.filtros.q = v; else delete Cat.filtros.q;
    cargar();
  };
  buscar?.addEventListener('input', () => { clearTimeout(espera); espera = setTimeout(aplicarBusqueda, 250); });
  buscar?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(espera); aplicarBusqueda(); });
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
  document.querySelectorAll('a[href="#buscar"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); buscar?.scrollIntoView({ block: 'center' }); buscar?.focus({ preventScroll: true }); }));
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
  sincronizarUI();
  await cargar();
  if (pidioBuscar) buscar?.focus();
}

async function iniciar() {
  initHeroMotion();
  initModelBarScroll();
  initFloats();
  updateCartBadge();
  initGaleria();
  try {
    await Promise.all([initCatsMenu(), initDestacados(), initCotizador(), initCatalogo()]);
  } catch (err) {
    console.error(err);
  }
  initComentarios();
  initReveals();
  initNav();
  initRail();
  initParallax();
  const prod = PARAMS_INICIALES.get('producto');
  if (prod && /^[a-z0-9-]{2,60}$/.test(prod)) abrirQV(prod);
  if (PARAMS_INICIALES.get('armazon') && location.hash === '#receta') {
    setTimeout(() => document.getElementById('receta')?.scrollIntoView({ block: 'start' }), 60);
  }
}
iniciar();
