document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const ES_M2 = document.body.classList.contains('m2');
const WSP = '5491131641861';
const MINIMO_MAYOR = 12;
const POR_PAGINA = 16;

const FOTOS = {
  f1: { src: 'images/01_hero_16x9.webp', w: 1672, h: 941 },
  f2: { src: 'images/02_vertical_9x16.webp', w: 941, h: 1672 },
  f3: { src: 'images/03_musculosas_lisas_1x1.webp', w: 1254, h: 1254 },
  f4: { src: 'images/04_baby_tees_1x1.webp', w: 1254, h: 1254 },
  f5: { src: 'images/05_mayorista_1x1.webp', w: 1254, h: 1254 },
  f6: { src: 'images/06_taller_estampado_1x1.webp', w: 1254, h: 1254 },
};

const CATS = { musculosas: 'Musculosa', babytees: 'Baby tee', remeras: 'Remera' };
const ESTILOS = { liso: 'Lisos', animado: 'Animados', banda: 'Bandas' };
const HEX = {
  'Negro': '#1B1B1F', 'Blanco': '#FBFBFA', 'Gris melange': '#A9ABAF', 'Gris': '#9C9EA3', 'Gris oscuro': '#45474D',
  'Crudo': '#ECE2CF', 'Verde oliva': '#4E5B36', 'Azul marino': '#1E2642', 'Bordó': '#7B2333',
  'Salvia': '#A8B79A', 'Celeste': '#9DB7D3', 'Rosa': '#F0BBC6',
};

const PRODUCTOS = [
  { id: 'musculosa-clasica-lisa', nombre: 'Musculosa clásica lisa', cat: 'musculosas', estilo: 'liso', precio: 9900, mayor: 6900, talles: ['S', 'M', 'L', 'XL'], badge: 'Más vendida', stock: 300,
    desc: 'La básica de siempre: escote redondo, sisas con ribete y largo a la cadera. Lisa, para usar así o para estampar tu marca.', tags: 'basica tank top algodon',
    colores: [{ n: 'Negro', f: 'f3', foco: [0.235, 0.475, 1.42] }, { n: 'Blanco', f: 'f3', foco: [0.55, 0.38, 1.6] }, { n: 'Gris melange', f: 'f3', foco: [0.82, 0.36, 1.6] }, { n: 'Crudo', f: 'f3', foco: [0.585, 0.7, 2] }, { n: 'Verde oliva', f: 'f3', foco: [0.75, 0.75, 2] }, { n: 'Azul marino', f: 'f3', foco: [0.88, 0.78, 2] }] },
  { id: 'musculosa-acanalada-lisa', nombre: 'Musculosa acanalada lisa', cat: 'musculosas', estilo: 'liso', precio: 11500, mayor: 7900, talles: ['S', 'M', 'L', 'XL'], nuevo: true, stock: 220,
    desc: 'Tejido acanalado que se ajusta al cuerpo. Lisa, ideal para estampar o bordar tu logo.', tags: 'morley ribb tank top',
    colores: [{ n: 'Blanco', f: 'f5', foco: [0.22, 0.47, 1.75] }, { n: 'Negro', f: 'f5', foco: [0.47, 0.37, 2.1] }, { n: 'Verde oliva', f: 'f5', foco: [0.26, 0.82, 1.75] }] },
  { id: 'musculosa-larga-lisa', nombre: 'Musculosa larga lisa', cat: 'musculosas', estilo: 'liso', precio: 10900, mayor: 7500, talles: ['S', 'M', 'L', 'XL'], stock: 180,
    desc: 'Más larga que la clásica, para usar suelta o por dentro del pantalón. Lisa y lista para estampar.', tags: 'larga tank top',
    colores: [{ n: 'Bordó', f: 'f2', foco: [0.89, 0.28, 2.3] }, { n: 'Azul marino', f: 'f2', foco: [0.77, 0.27, 2.3] }, { n: 'Gris', f: 'f2', foco: [0.66, 0.3, 2.3] }] },
  { id: 'musculosa-basica-colores', nombre: 'Musculosa básica de colores', cat: 'musculosas', estilo: 'liso', precio: 9500, mayor: 6600, talles: ['S', 'M', 'L', 'XL'], stock: 240,
    desc: 'La musculosa lisa en tonos suaves para combinar o para estampar encima.', tags: 'pastel color tank top',
    colores: [{ n: 'Salvia', f: 'f1', foco: [0.41, 0.35, 2.2] }, { n: 'Celeste', f: 'f1', foco: [0.5, 0.37, 2.2] }, { n: 'Blanco', f: 'f1', foco: [0.31, 0.33, 2.2] }, { n: 'Negro', f: 'f1', foco: [0.58, 0.39, 2.2] }] },
  { id: 'baby-tee-lisa', nombre: 'Baby tee lisa', cat: 'babytees', estilo: 'liso', precio: 10500, mayor: 7300, talles: ['S', 'M', 'L'], badge: 'Más vendida', stock: 260,
    desc: 'Corte corto y al cuerpo, manga corta. Lisa, en los colores que más se estampan.', tags: 'remerita corta crop',
    colores: [{ n: 'Blanco', f: 'f5', foco: [0.62, 0.67, 1.6] }, { n: 'Negro', f: 'f5', foco: [0.88, 0.58, 2] }, { n: 'Crudo', f: 'f5', foco: [0.8, 0.44, 2.3] }, { n: 'Rosa', f: 'f4', foco: [0.58, 0.52, 1.6] }, { n: 'Celeste', f: 'f4', foco: [0.68, 0.5, 1.8] }] },
  { id: 'remera-lisa-clasica', nombre: 'Remera lisa clásica', cat: 'remeras', estilo: 'liso', precio: 11900, mayor: 8300, talles: ['S', 'M', 'L', 'XL', 'XXL'], stock: 300,
    desc: 'Remera unisex de cuello redondo, lisa. La base para estampar remeras de tu marca o de tu banda.', tags: 'unisex manga corta',
    colores: [{ n: 'Blanco', f: 'f6', foco: [0.36, 0.42, 1.9] }, { n: 'Negro', f: 'f6', foco: [0.9, 0.44, 2.2] }, { n: 'Crudo', f: 'f1', foco: [0.37, 0.63, 2.2] }, { n: 'Rosa', f: 'f1', foco: [0.49, 0.68, 2.2] }, { n: 'Celeste', f: 'f1', foco: [0.58, 0.72, 2.2] }] },
  { id: 'baby-tee-cerezas', nombre: 'Baby tee Cerezas con moño', cat: 'babytees', estilo: 'animado', precio: 15900, mayor: 11200, talles: ['S', 'M', 'L'], badge: 'Nuevo', nuevo: true, stock: 60,
    desc: 'Baby tee blanca con cerezas, moño y corazones en rosa.', tags: 'cereza corazon moño',
    colores: [{ n: 'Blanco', f: 'f4', foco: [0.29, 0.53, 1.25] }] },
  { id: 'baby-tee-gatito', nombre: 'Baby tee Gatito con auriculares', cat: 'babytees', estilo: 'animado', precio: 15900, mayor: 11200, talles: ['S', 'M', 'L'], stock: 55,
    desc: 'Un gatito escuchando un vinilo, con estrellas rosas alrededor.', tags: 'gato vinilo musica',
    colores: [{ n: 'Crudo', f: 'f6', foco: [0.45, 0.8, 1.6] }] },
  { id: 'remera-dino-musical', nombre: 'Remera Dino musical', cat: 'remeras', estilo: 'animado', precio: 16900, mayor: 11900, talles: ['S', 'M', 'L', 'XL'], stock: 48,
    desc: 'Dinosaurio con auriculares, rayos y notas musicales sobre remera cruda.', tags: 'dinosaurio musica rayo',
    colores: [{ n: 'Crudo', f: 'f1', foco: [0.74, 0.77, 2] }] },
  { id: 'remera-florcita', nombre: 'Remera Florcita sonriente', cat: 'remeras', estilo: 'animado', precio: 16500, mayor: 11600, talles: ['S', 'M', 'L', 'XL'], stock: 40,
    desc: 'La flor sonriente en remera rosa.', tags: 'flor smile',
    colores: [{ n: 'Rosa', f: 'f1', foco: [0.2, 0.56, 2.2] }] },
  { id: 'musculosa-smile-rayos', nombre: 'Musculosa Smile y rayos', cat: 'musculosas', estilo: 'animado', precio: 14900, mayor: 10400, talles: ['S', 'M', 'L', 'XL'], stock: 50,
    desc: 'Caritas sonrientes, rayos, estrellas y damero sobre musculosa cruda.', tags: 'smile rayo damero',
    colores: [{ n: 'Crudo', f: 'f1', foco: [0.72, 0.43, 2.1] }] },
  { id: 'baby-tee-estrellas', nombre: 'Baby tee Estrellas', cat: 'babytees', estilo: 'animado', precio: 14500, mayor: 10200, talles: ['S', 'M', 'L'], stock: 45,
    desc: 'Baby tee gris con dos estrellas al costado.', tags: 'estrella',
    colores: [{ n: 'Gris', f: 'f4', foco: [0.86, 0.57, 2.2] }] },
  { id: 'musculosa-guitarra', nombre: 'Musculosa Guitarra eléctrica', cat: 'musculosas', estilo: 'banda', etiqueta: 'Edición recital', precio: 15900, mayor: 11200, talles: ['S', 'M', 'L', 'XL'], badge: 'Edición recital', stock: 70,
    desc: 'Guitarra eléctrica, rayos y estrellas sobre musculosa gris oscuro. Para el próximo recital.', tags: 'rock guitarra rayo banda recital',
    colores: [{ n: 'Gris oscuro', f: 'f1', foco: [0.89, 0.49, 2] }] },
  { id: 'remera-estrella-fugaz', nombre: 'Remera Estrella fugaz', cat: 'remeras', estilo: 'banda', etiqueta: 'Edición recital', precio: 17900, mayor: 12600, talles: ['S', 'M', 'L', 'XL', 'XXL'], stock: 64,
    desc: 'Estrella fugaz con estela de colores sobre remera negra.', tags: 'estrella rock banda recital',
    colores: [{ n: 'Negro', f: 'f1', foco: [0.9, 0.84, 2] }] },
  { id: 'baby-tee-bola-espejos', nombre: 'Baby tee Bola de espejos', cat: 'babytees', estilo: 'banda', etiqueta: 'Edición pop', precio: 15900, mayor: 11200, talles: ['S', 'M', 'L'], stock: 52,
    desc: 'Bola de espejos con corazón y notas musicales sobre baby tee rosa.', tags: 'disco pop musica banda recital',
    colores: [{ n: 'Rosa', f: 'f6', foco: [0.8, 0.72, 1.75] }] },
  { id: 'baby-tee-vinilo', nombre: 'Baby tee Vinilo', cat: 'babytees', estilo: 'banda', etiqueta: 'Edición pop', precio: 15900, mayor: 11200, talles: ['S', 'M', 'L'], badge: 'Últimas unidades', stock: 9,
    desc: 'Vinilo, notas, rayos y corazones sobre baby tee cruda.', tags: 'vinilo disco musica banda',
    colores: [{ n: 'Crudo', f: 'f2', foco: [0.3, 0.4, 1.9] }] },
  { id: 'remera-diseno-banda', nombre: 'Remera con el diseño de tu banda', cat: 'remeras', estilo: 'banda', etiqueta: 'A pedido', aPedido: true, precio: 18900, mayor: 13500, talles: ['S', 'M', 'L', 'XL', 'XXL'], badge: 'A pedido', stock: 500,
    desc: 'Nos pasás la banda o el diseño por WhatsApp y lo estampamos en remera blanca o negra. Para ir al recital con la tuya.', tags: 'personalizada a pedido banda recital estampado',
    colores: [{ n: 'Blanco', f: 'f6', foco: [0.78, 0.24, 1.9] }, { n: 'Negro', f: 'f6', foco: [0.9, 0.44, 2.2] }] },
  { id: 'remera-estrellitas', nombre: 'Remera Estrellitas de colores', cat: 'remeras', estilo: 'animado', precio: 15500, mayor: 10900, talles: ['S', 'M', 'L', 'XL'], stock: 38,
    desc: 'Estrellas de colores sobre remera cruda.', tags: 'estrella colores',
    colores: [{ n: 'Crudo', f: 'f1', foco: [0.07, 0.52, 2.2] }] },
];

const MAS_VENDIDOS = ['musculosa-clasica-lisa', 'baby-tee-lisa', 'baby-tee-cerezas', 'musculosa-guitarra', 'baby-tee-gatito', 'musculosa-acanalada-lisa', 'baby-tee-bola-espejos', 'remera-dino-musical'];

const ENTRADAS = [
  { nombre: 'Musculosas', cat: 'musculosas', f: 'f3', foco: [0.5, 0.47, 1.02], tinte: 'var(--tint-crudo)' },
  { nombre: 'Baby tees', cat: 'babytees', f: 'f4', foco: [0.42, 0.5, 1.02], tinte: 'var(--tint-rosa)' },
  { nombre: 'Lisos para estampar', estilo: 'liso', f: 'f5', foco: [0.42, 0.5, 1.05], tinte: 'var(--tint-salvia)' },
  { nombre: 'Animados', estilo: 'animado', f: 'f6', foco: [0.6, 0.76, 1.45], tinte: 'var(--tint-celeste)' },
  { nombre: 'Bandas', estilo: 'banda', f: 'f1', foco: [0.88, 0.5, 1.75], tinte: 'var(--tint-ambar)' },
];

const CAPITULOS = [
  { filtro: p => p.cat === 'musculosas' && p.estilo === 'liso', cta: n => `Ver las ${n} musculosas lisas`, cat: 'musculosas', estilo: 'liso' },
  { filtro: p => p.cat === 'babytees', cta: n => `Ver las ${n} baby tees`, cat: 'babytees', estilo: '' },
  { filtro: p => p.estilo === 'liso', cta: n => `Ver los ${n} lisos`, cat: '', estilo: 'liso', sec: { txt: 'Calcular por cantidad', href: '#por-mayor' } },
  { filtro: p => p.estilo !== 'liso', cta: n => `Ver los ${n} estampados`, cat: '', estilo: 'estampado', sec: { txt: 'Pedir la de mi banda', msg: 'Hola Emunah! Quiero una remera con el diseño de mi banda favorita.' } },
];

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioSegun = (p, mayor) => (mayor ? p.mayor : precioFinal(p));
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const clamp01 = v => Math.max(0, Math.min(1, v));
const talleDefault = p => (p.talles.includes('M') ? 'M' : p.talles[0]);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lineaDe = p => p.etiqueta || (p.estilo === 'liso' ? 'Liso para estampar' : p.estilo === 'animado' ? 'Estampado animado' : 'Estampado de banda');
const colorDe = (p, nombre) => p.colores.find(c => c.n === nombre) || p.colores[0];

const Cart = {
  KEY: 'emunah_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { void 0; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  clave: i => `${i.id}|${i.talle}|${i.color}`,
  add(producto, qty = 1, talle, color) {
    const items = this.get();
    const t = talle || talleDefault(producto);
    const c = color || producto.colores[0].n;
    const existing = items.find(i => i.id === producto.id && i.talle === t && i.color === c);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle: t, color: c, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get(); const it = items.find(i => this.clave(i) === k); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  setVariante(k, talle, color) {
    const items = this.get(); const it = items.find(i => this.clave(i) === k); if (!it) return;
    const otra = items.find(i => i !== it && i.id === it.id && i.talle === talle && i.color === color);
    if (otra) { otra.qty += it.qty; items.splice(items.indexOf(it), 1); } else { it.talle = talle; it.color = color; }
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  esMayor() { return this.count() >= MINIMO_MAYOR; },
  totalUnidad() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  total() { const m = this.esMayor(); return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioSegun(p, m) * i.qty : s; }, 0); },
};

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

function fotoHTML(fotoId, foco, ar, clase = '', alt = '') {
  const f = FOTOS[fotoId];
  return `<div class="recorte ${clase}" style="${recorte(fotoId, foco, ar)}"><img src="${BASE}${f.src}" width="${f.w}" height="${f.h}" alt="${esc(alt)}" draggable="false"></div>`;
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const estado = { q: '', cat: '', estilo: '', talle: '', orden: 'destacados', mostrados: POR_PAGINA };

function coincide(p) {
  if (estado.cat && p.cat !== estado.cat) return false;
  if (estado.estilo) {
    if (estado.estilo === 'estampado' ? p.estilo === 'liso' : p.estilo !== estado.estilo) return false;
  }
  if (estado.talle && !p.talles.includes(estado.talle)) return false;
  if (estado.q) {
    const hay = normal([p.nombre, CATS[p.cat], ESTILOS[p.estilo], lineaDe(p), p.colores.map(c => c.n).join(' '), p.desc, p.tags].join(' '));
    const palabras = normal(estado.q).split(/\s+/).filter(Boolean).map(w => (w.length > 4 ? w.replace(/(as|os|es|a|o|s)$/, '') : w));
    if (!palabras.every(w => hay.includes(w))) return false;
  }
  return true;
}

function filtrados() {
  const lista = PRODUCTOS.filter(coincide);
  const idx = p => PRODUCTOS.indexOf(p);
  if (estado.orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b) || idx(a) - idx(b));
  else if (estado.orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a) || idx(a) - idx(b));
  else if (estado.orden === 'nuevos') lista.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0) || idx(a) - idx(b));
  return lista;
}

function badgeHTML(p) {
  if (!p.badge) return '';
  const tipo = { 'Más vendida': 'badge--ambar', 'Nuevo': '', 'Últimas unidades': 'badge--borde', 'A pedido': 'badge--azul', 'Edición recital': '' }[p.badge] ?? '';
  return `<div class="card__badges"><span class="badge ${tipo}">${esc(p.badge)}</span></div>`;
}

function dotsHTML(p) {
  return `<span class="dots" aria-label="${plural(p.colores.length, 'color', 'colores')}">${p.colores.slice(0, 6).map(c => `<span class="dot" style="--c:${HEX[c.n] || '#ccc'}" title="${esc(c.n)}"></span>`).join('')}</span>`;
}

function stepperHTML(n = 1, extra = '') {
  return `<div class="stepper" data-stepper${extra}><button type="button" data-paso="-1" aria-label="Restar uno">−</button><span class="stepper__n" aria-live="polite">${n}</span><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>`;
}

function cardHTML(p, { i = 0, anim = true, enRail = false } = {}) {
  const c = p.colores[0];
  const ancha = ES_M2 && !enRail && i % 5 === 0;
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card${ancha ? ' card--ancha' : ''}" data-id="${p.id}"${a}>
    <div class="card__media">
      <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(c.f, c.foco, 1, '', `${p.nombre}, color ${c.n.toLowerCase()}`)}<span class="card__ver" aria-hidden="true">Vista rápida</span></button>
      ${badgeHTML(p)}
    </div>
    <div class="card__body">
      <div class="card__top"><p class="card__linea">${esc(lineaDe(p))}</p>${dotsHTML(p)}</div>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      <div class="card__precios">
        <span class="precio">${formatearPrecio(precioFinal(p))}</span>
        <span class="precio-mayor"><span class="tag12">x${MINIMO_MAYOR}+</span><b>${formatearPrecio(p.mayor)}</b> c/u</span>
      </div>
      <div class="prod-actions">
        ${stepperHTML()}
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"><span class="prod-add__largo">Agregar al carrito</span><span class="prod-add__corto">Agregar</span></button>
      </div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initEntradas() {
  const cont = $('#entradas');
  if (!cont) return;
  const vista = cont.dataset.vista;
  const flecha = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  cont.innerHTML = ENTRADAS.map((e, k) => {
    const n = PRODUCTOS.filter(p => (!e.cat || p.cat === e.cat) && (!e.estilo || p.estilo === e.estilo)).length;
    const attrs = `href="#tienda" data-ir-tienda${e.cat ? ` data-cat="${e.cat}"` : ''}${e.estilo ? ` data-estilo="${e.estilo}"` : ''}`;
    if (vista === 'tarjetas') {
      const anim = k === 0 ? 'data-animate="mascara" style="clip-path:inset(100% 0 0 0)"' : 'data-animate="subir" style="opacity:0;transform:translateY(48px)"';
      return `<li ${anim}><a class="tarjeta" ${attrs}>${fotoHTML(e.f, e.foco, 1, '', e.nombre)}<span class="tarjeta__txt"><span><span class="tarjeta__nombre">${esc(e.nombre)}</span><span class="tarjeta__n">${plural(n, 'prenda', 'prendas')}</span></span><span class="tarjeta__ir">${flecha}</span></span></a></li>`;
    }
    return `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><a class="circulo" ${attrs}><span class="circulo__foto" style="--tinte:${e.tinte}">${fotoHTML(e.f, e.foco, 1, '', e.nombre)}</span><span class="circulo__nombre">${esc(e.nombre)}</span><span class="circulo__n">${plural(n, 'prenda', 'prendas')}</span></a></li>`;
  }).join('');
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
      try { vp.setPointerCapture?.(pointerId); } catch { void 0; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { void 0; }
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

function initRail() {
  const track = $('#rail-track');
  const vp = $('#rail-vp');
  if (!track || !vp) return;
  track.innerHTML = MAS_VENDIDOS.map(getProducto).filter(Boolean).map(p => `<li data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false, enRail: true })}</li>`).join('');
  initRailDrag(vp);
  const prev = $('#rail-prev');
  const next = $('#rail-next');
  const paso = () => { const li = track.querySelector('li'); return li ? li.getBoundingClientRect().width + parseFloat(window.getComputedStyle(track).columnGap || 16) : 300; };
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function syncControles() {
  const q = $('#q'); if (q && q.value !== estado.q) q.value = estado.q;
  $$('#chips-cat .chip').forEach(ch => { const on = ch.dataset.cat === estado.cat; ch.classList.toggle('is-on', on); ch.setAttribute('aria-pressed', on); });
  const fe = $('#f-estilo'); if (fe) fe.value = estado.estilo;
  const ft = $('#f-talle'); if (ft) ft.value = estado.talle;
  const fo = $('#f-orden'); if (fo) fo.value = estado.orden;
  const activo = !!(estado.q || estado.cat || estado.estilo || estado.talle || estado.orden !== 'destacados');
  const lim = $('#filtros-limpiar'); if (lim) lim.hidden = !activo;
}

function renderCatalogo() {
  const grid = $('#catalogo');
  if (!grid) return;
  const lista = filtrados();
  estado.mostrados = POR_PAGINA;
  const vis = lista.slice(0, estado.mostrados);
  grid.innerHTML = vis.map((p, i) => cardHTML(p, { i })).join('');
  pieCatalogo(lista);
  syncControles();
  revelarNuevos(grid);
  refrescar();
}

function pieCatalogo(lista) {
  const total = lista.length;
  const vistos = Math.min(estado.mostrados, total);
  const cuenta = $('#tienda-cuenta');
  if (cuenta) cuenta.textContent = total === PRODUCTOS.length && !estado.q ? plural(total, 'prenda', 'prendas') : `${plural(total, 'prenda', 'prendas')} con estos filtros`;
  const vacio = $('#vacio');
  if (vacio) {
    vacio.hidden = total > 0;
    const t = $('#vacio-txt');
    if (t && !total) t.textContent = estado.q ? `No encontramos «${estado.q}». Probá con «musculosa», «baby tee» o un color.` : 'Probá con otro talle o estilo, o volvé a ver todo.';
  }
  const mas = $('#mas-wrap');
  const btn = $('#ver-mas');
  const n = $('#mas-n');
  if (mas) mas.hidden = total === 0;
  if (btn) btn.hidden = vistos >= total;
  if (n) n.textContent = total ? `Viendo ${vistos} de ${total}` : '';
}

function verMas() {
  const grid = $('#catalogo');
  if (!grid) return;
  const lista = filtrados();
  const desde = estado.mostrados;
  estado.mostrados += POR_PAGINA;
  grid.insertAdjacentHTML('beforeend', lista.slice(desde, estado.mostrados).map((p, k) => cardHTML(p, { i: desde + k })).join(''));
  pieCatalogo(lista);
  revelarNuevos(grid);
  refrescar();
}

function irATienda({ cat = '', estilo = '' } = {}) {
  Object.assign(estado, { q: '', cat, estilo, talle: '' });
  renderCatalogo();
  const t = $('#tienda');
  if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initCatalogoUI() {
  const q = $('#q');
  let tq = 0;
  q?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = q.value.trim(); renderCatalogo(); }, 220); });
  $('#busca-form')?.addEventListener('submit', e => { e.preventDefault(); estado.q = q.value.trim(); renderCatalogo(); });
  $$('#chips-cat .chip').forEach(ch => ch.addEventListener('click', () => { estado.cat = ch.dataset.cat; renderCatalogo(); }));
  $('#f-estilo')?.addEventListener('change', e => { estado.estilo = e.target.value; renderCatalogo(); });
  $('#f-talle')?.addEventListener('change', e => { estado.talle = e.target.value; renderCatalogo(); });
  $('#f-orden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  const limpiar = () => { Object.assign(estado, { q: '', cat: '', estilo: '', talle: '', orden: 'destacados' }); renderCatalogo(); };
  $('#filtros-limpiar')?.addEventListener('click', limpiar);
  $('#vacio-limpiar')?.addEventListener('click', limpiar);
  $('#ver-mas')?.addEventListener('click', verMas);
  const mas = $('#filtros-mas');
  mas?.addEventListener('click', () => {
    const f = mas.closest('.filtros');
    const abierto = f.classList.toggle('is-open');
    mas.setAttribute('aria-expanded', abierto);
    refrescar();
  });
}

let ultimoFoco = null;
function focoAtrapado(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function abrirCapa(el) {
  ultimoFoco = document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  void el.offsetWidth;
  requestAnimationFrame(() => el.classList.add('open'));
}
function cerrarCapa(el, despues) {
  el.classList.remove('open');
  const fin = () => {
    el.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open')) document.body.classList.remove('no-scroll');
    despues?.();
  };
  if (reduceMotion) fin(); else setTimeout(fin, 320);
}

const qv = { p: null, color: '', talle: '' };

function abrirModal(id) {
  const p = getProducto(id);
  const modal = $('#modal');
  const cont = $('#modal-content');
  if (!p || !modal || !cont) return;
  qv.p = p; qv.color = p.colores[0].n; qv.talle = talleDefault(p);
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat).slice(0, 3);
  const pedido = p.aPedido ? `<a class="qv__pedido" href="${wspLink(`Hola Emunah! Quiero la remera con el diseño de mi banda. La banda es: `)}" target="_blank" rel="noopener"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>Contanos qué banda querés por WhatsApp</a>` : '';
  cont.innerHTML = `<div class="qv">
    <div class="qv__media"><div class="qv__foto" id="qv-foto">${fotoHTML(p.colores[0].f, p.colores[0].foco, 0.8, '', `${p.nombre}, color ${p.colores[0].n.toLowerCase()}`)}</div></div>
    <div class="qv__info">
      <p class="card__linea">${esc(lineaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precios">
        <div class="qv__precio"><span>Por unidad</span><strong>${formatearPrecio(precioFinal(p))}</strong></div>
        <div class="qv__precio qv__precio--mayor"><span>Por mayor, desde ${MINIMO_MAYOR} prendas</span><strong>${formatearPrecio(p.mayor)} c/u</strong></div>
      </div>
      <div><p class="qv__lbl">Color: <b id="qv-color">${esc(qv.color)}</b></p><div class="qv__ops">${p.colores.map((c, k) => `<button type="button" class="sw" data-sw="${esc(c.n)}" aria-pressed="${k === 0}" aria-label="Color ${esc(c.n)}"><span style="--c:${HEX[c.n] || '#ccc'}"></span></button>`).join('')}</div></div>
      <div><p class="qv__lbl">Talle</p><div class="qv__ops">${p.talles.map(t => `<button type="button" class="talle" data-talle="${t}" aria-pressed="${t === qv.talle}">${t}</button>`).join('')}</div></div>
      <div class="qv__acc">${stepperHTML(1, ' id="qv-stepper"')}<button type="button" class="btn btn--line" data-qv-add>Agregar al carrito</button></div>
      <button type="button" class="btn btn--cta btn--block" data-qv-ahora>Comprar ahora</button>
      ${pedido}
      <p class="qv__desc">${esc(p.desc)}</p>
      ${rel.length ? `<div class="qv__rel"><p class="qv__lbl">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__mini" data-quick="${r.id}">${fotoHTML(r.colores[0].f, r.colores[0].foco, 1, '', '')}<span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
  if (modal.hidden) abrirCapa(modal);
  cont.closest('.modal-box').scrollTop = 0;
  setTimeout(() => $('#modal-close')?.focus(), 60);
}

function cerrarModal() {
  const modal = $('#modal');
  if (!modal || modal.hidden) return;
  const volver = ultimoFoco;
  cerrarCapa(modal, () => volver?.focus?.());
}

function qtyDe(btn) {
  const st = btn.closest('.prod-actions, .qv__acc')?.querySelector('[data-stepper] .stepper__n');
  return Math.max(1, parseInt(st?.textContent, 10) || 1);
}

function sumarAlCarrito(p, qty, talle, color) {
  const antes = Cart.count();
  Cart.add(p, qty, talle, color);
  return Cart.count() - antes;
}

function agregar(p, qty, talle, color, abrir = false) {
  const sumadas = sumarAlCarrito(p, qty, talle, color);
  if (abrir) { openCartDrawer(); return; }
  const t = talle || talleDefault(p);
  const c = color || p.colores[0].n;
  if (!sumadas) { showToast(`De ${p.nombre} ya tenés en el carrito todo lo que hay en stock.`); return; }
  showToast(`Sumaste ${sumadas} × ${p.nombre} (${c}, ${t}).${sumadas < qty ? ` Era lo que quedaba en stock.` : ' El talle y el color los cambiás en el carrito.'}`);
}

function lineasHTML() {
  const items = Cart.get();
  const mayor = Cart.esMayor();
  return items.map((it, k) => {
    const p = getProducto(it.id);
    if (!p) return '';
    const c = colorDe(p, it.color);
    const unit = precioSegun(p, mayor);
    const key = Cart.clave(it);
    return `<li class="linea" data-k="${esc(key)}" style="--d:${Math.min(k * 0.05, 0.4)}s">
      ${fotoHTML(c.f, c.foco, 0.8, 'linea__foto', '')}
      <div class="linea__info">
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <div class="linea__vars">
          <label><span class="sr-only">Color</span><select data-var="color">${p.colores.map(o => `<option${o.n === it.color ? ' selected' : ''}>${esc(o.n)}</option>`).join('')}</select></label>
          <label><span class="sr-only">Talle</span><select data-var="talle">${p.talles.map(t => `<option${t === it.talle ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
        </div>
        <div class="linea__fila">
          ${stepperHTML(it.qty, ' data-linea')}
          <p class="linea__precio"><strong>${formatearPrecio(unit * it.qty)}</strong><small>${formatearPrecio(unit)} c/u${mayor ? ' por mayor' : ''}</small></p>
        </div>
      </div>
      <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </li>`;
  }).join('');
}

function mensajePedido() {
  const mayor = Cart.esMayor();
  const filas = Cart.get().map(it => {
    const p = getProducto(it.id);
    return p ? `• ${it.qty} × ${p.nombre} (${it.color}, talle ${it.talle}) — ${formatearPrecio(precioSegun(p, mayor))} c/u` : '';
  }).filter(Boolean);
  return `Hola Emunah! Quiero hacer este pedido:\n${filas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${mayor ? ' (precio por mayor)' : ''}`;
}

function renderDrawer() {
  const body = $('#drawer-body');
  const foot = $('#drawer-foot');
  if (!body || !foot) return;
  const n = Cart.count();
  const cant = $('#drawer-cant');
  if (cant) cant.textContent = n ? `· ${plural(n, 'prenda', 'prendas')}` : '';
  if (!n) {
    body.innerHTML = `<div class="drawer-vacio"><p class="drawer-vacio__tit">Todavía no elegiste nada</p><p>Una musculosa para vos o doce para tu marca: arrancá por la tienda.</p><a class="btn btn--cta" href="#tienda" data-cerrar-drawer>Ir a la tienda</a></div>`;
    foot.hidden = true;
    return;
  }
  const act = document.activeElement;
  const li = act && body.contains(act) ? act.closest('.linea') : null;
  const volver = li ? { k: li.dataset.k, sel: act.matches('[data-paso]') ? `[data-paso="${act.dataset.paso}"]` : act.matches('select') ? `select[data-var="${act.dataset.var}"]` : '' } : null;
  body.innerHTML = `<ul class="lineas">${lineasHTML()}</ul>`;
  if (volver?.sel) {
    const nuevo = [...body.querySelectorAll('.linea')].find(l => l.dataset.k === volver.k) || body.querySelector('.linea');
    nuevo?.querySelector(volver.sel)?.focus();
  }
  foot.hidden = false;
  const mayor = Cart.esMayor();
  const aviso = $('#drawer-mayor');
  if (aviso) {
    aviso.classList.toggle('es-mayor', mayor);
    const ahorro = Cart.totalUnidad() - Cart.total();
    if (mayor) aviso.textContent = `Precio por mayor aplicado: con ${n} prendas ahorrás ${formatearPrecio(ahorro)} sobre el precio por unidad.`;
    else {
      const faltan = MINIMO_MAYOR - n;
      const ahorroPosible = Cart.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + (precioFinal(p) - p.mayor) * i.qty : s; }, 0);
      aviso.textContent = `Sumá ${plural(faltan, 'prenda más', 'prendas más')} y pasás a precio por mayor: con lo que tenés ya ahorrarías ${formatearPrecio(ahorroPosible)}.`;
    }
  }
  const tot = $('#drawer-total');
  if (tot) tot.innerHTML = mayor ? `<s>${formatearPrecio(Cart.totalUnidad())}</s>${formatearPrecio(Cart.total())}` : formatearPrecio(Cart.total());
  const w = $('#drawer-wsp');
  if (w) w.href = wspLink(mensajePedido());
}

function openCartDrawer() {
  const d = $('#drawer');
  if (!d) return;
  renderDrawer();
  if (d.hidden) {
    if (!reduceMotion) {
      d.classList.add('entrando');
      setTimeout(() => d.classList.remove('entrando'), 1100);
    }
    abrirCapa(d);
  }
  setTimeout(() => $('#drawer-close')?.focus(), 60);
}
function closeCartDrawer() {
  const d = $('#drawer');
  if (!d || d.hidden) return;
  const volver = ultimoFoco;
  cerrarCapa(d, () => volver?.focus?.());
}

function initOverlays() {
  $('#cart-header')?.addEventListener('click', openCartDrawer);
  $('#drawer-close')?.addEventListener('click', closeCartDrawer);
  $('#drawer')?.addEventListener('click', e => {
    if (e.target.closest('[data-close-drawer]')) closeCartDrawer();
    if (e.target.closest('[data-cerrar-drawer]')) { e.preventDefault(); closeCartDrawer(); setTimeout(() => irATienda(), 340); }
  });
  $('#modal-close')?.addEventListener('click', cerrarModal);
  $('#modal')?.addEventListener('click', e => { if (e.target.closest('[data-close-modal]')) cerrarModal(); });
  document.addEventListener('keydown', e => {
    const modal = $('#modal');
    const drawer = $('#drawer');
    if (modal && !modal.hidden) { if (e.key === 'Escape') cerrarModal(); else focoAtrapado(modal, e); return; }
    if (drawer && !drawer.hidden) { if (e.key === 'Escape') closeCartDrawer(); else focoAtrapado(drawer, e); }
  });
  $('#checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  $('#drawer-body')?.addEventListener('change', e => {
    const sel = e.target.closest('select[data-var]');
    if (!sel) return;
    const li = sel.closest('.linea');
    const [id] = li.dataset.k.split('|');
    const color = li.querySelector('select[data-var="color"]').value;
    const talle = li.querySelector('select[data-var="talle"]').value;
    Cart.setVariante(li.dataset.k, talle, color);
    const p = getProducto(id);
    if (p) showToast(`${p.nombre}: ${color}, talle ${talle}.`);
  });
  document.addEventListener('cart:updated', () => { if (!$('#drawer')?.hidden) renderDrawer(); });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const out = st.querySelector('.stepper__n');
      const nuevo = Math.max(1, Math.min(99, (parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso)));
      if (st.hasAttribute('data-linea')) { Cart.setQty(st.closest('.linea').dataset.k, nuevo); return; }
      out.textContent = nuevo;
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.closest('.linea').dataset.k); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) { const p = getProducto(add.dataset.add); if (p) agregar(p, qtyDe(add)); return; }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) { const p = getProducto(ahora.dataset.ahora); if (p) agregar(p, qtyDe(ahora.closest('.card__body').querySelector('[data-add]')), undefined, undefined, true); return; }
    const sw = e.target.closest('[data-sw]');
    if (sw && qv.p) {
      qv.color = sw.dataset.sw;
      $$('[data-sw]').forEach(b => b.setAttribute('aria-pressed', b === sw));
      const c = colorDe(qv.p, qv.color);
      const foto = $('#qv-foto');
      if (foto) foto.innerHTML = fotoHTML(c.f, c.foco, 0.8, '', `${qv.p.nombre}, color ${c.n.toLowerCase()}`);
      const lbl = $('#qv-color'); if (lbl) lbl.textContent = c.n;
      return;
    }
    const talle = e.target.closest('[data-talle]');
    if (talle && qv.p) { qv.talle = talle.dataset.talle; $$('[data-talle]').forEach(b => b.setAttribute('aria-pressed', b === talle)); return; }
    const qadd = e.target.closest('[data-qv-add]');
    if (qadd && qv.p) { agregar(qv.p, qtyDe(qadd), qv.talle, qv.color); return; }
    const qahora = e.target.closest('[data-qv-ahora]');
    if (qahora && qv.p) {
      const n = qtyDe($('[data-qv-add]'));
      sumarAlCarrito(qv.p, n, qv.talle, qv.color);
      const volver = ultimoFoco;
      const modal = $('#modal');
      modal.classList.remove('open'); modal.hidden = true;
      openCartDrawer();
      ultimoFoco = volver;
      return;
    }
    const ir = e.target.closest('[data-ir-tienda]');
    if (ir) {
      e.preventDefault();
      irATienda({ cat: ir.dataset.cat || '', estilo: ir.dataset.estilo || '' });
    }
  });
}

const cu = { linea: 'liso', n: 12, talle: 'M' };

function renderCuanto() {
  const tabla = $('#cu-tabla');
  if (!tabla) return;
  const enCarrito = Cart.count();
  const total = cu.n + enCarrito;
  const mayor = total >= MINIMO_MAYOR;
  const filas = PRODUCTOS.filter(p => p.estilo === cu.linea);
  const cab = `<div class="fila fila--cab" aria-hidden="true"><span>Prenda</span><span>Precio c/u</span><span>${cu.n} ${cu.n === 1 ? 'prenda' : 'prendas'}</span><span></span></div>`;
  tabla.innerHTML = cab + filas.map(p => {
    const unit = precioSegun(p, mayor);
    const hay = p.talles.includes(cu.talle);
    const ahorro = (precioFinal(p) - p.mayor) * cu.n;
    return `<div class="fila">
      <div class="fila__info"><span class="fila__nombre">${esc(p.nombre)}</span><span class="fila__sub">${dotsHTML(p)}${plural(p.colores.length, 'color', 'colores')} · ${p.talles.join(', ')}</span></div>
      <div class="fila__cu">${mayor ? `<s>${formatearPrecio(precioFinal(p))}</s>` : ''}<strong>${formatearPrecio(unit)}</strong></div>
      <div class="fila__tot"><strong>${formatearPrecio(unit * cu.n)}</strong>${mayor ? `<span class="fila__ahorro">Ahorrás ${formatearPrecio(ahorro)}</span>` : ''}</div>
      <div class="fila__acc">${hay ? `<button type="button" class="btn btn--line fila__btn" data-cu-add="${p.id}">Sumar ${cu.n}</button>` : `<span class="fila__no">Sin talle ${cu.talle}</span>`}</div>
    </div>`;
  }).join('');
  const est = $('#cu-estado');
  if (est) {
    est.classList.toggle('es-mayor', mayor);
    const base = enCarrito
      ? `Con ${cu.n === 1 ? 'esta' : `estas ${cu.n}`} y ${enCarrito === 1 ? 'la prenda' : `las ${enCarrito} prendas`} de tu carrito sumás ${total}`
      : `Con ${plural(cu.n, 'prenda', 'prendas')}`;
    const faltan = MINIMO_MAYOR - total;
    est.innerHTML = mayor
      ? `<p class="cuanto__estado-tit">Precio por mayor</p><p>${base}: pagás el precio mayorista en todo el pedido.</p><div class="cuanto__barra"><span style="--v:1"></span></div>`
      : `<p class="cuanto__estado-tit">Precio por unidad</p><p>${base}: te ${faltan === 1 ? 'falta' : 'faltan'} ${plural(faltan, 'prenda', 'prendas')} para el precio por mayor.</p><div class="cuanto__barra"><span style="--v:${(total / MINIMO_MAYOR).toFixed(3)}"></span></div>`;
  }
  const num = $('#cu-num');
  if (num) num.textContent = cu.n;
  const rango = $('#cu-n');
  if (rango) { rango.value = cu.n; rango.style.setProperty('--p', `${((cu.n - 1) / (Number(rango.max) - 1)) * 100}%`); }
  const nombres = { liso: 'lisos', animado: 'animados', banda: 'estampados de bandas' };
  const w = $('#cu-wsp');
  if (w) {
    const lineas = filas.filter(p => p.talles.includes(cu.talle)).map(p => `• ${p.nombre}: ${formatearPrecio(precioSegun(p, mayor))} c/u → ${formatearPrecio(precioSegun(p, mayor) * cu.n)}`);
    w.href = wspLink(`Hola Emunah! Quiero cotizar ${cu.n} de cada una, talle ${cu.talle} (${nombres[cu.linea]}):\n${lineas.join('\n')}\n¿Me confirman disponibilidad?`);
  }
}

function initCuanto() {
  if (!$('#cu-tabla')) return;
  $$('#cu-linea input[type="radio"]').forEach(inp => inp.addEventListener('change', () => {
    if (!inp.checked) return;
    cu.linea = inp.value;
    $$('#cu-linea .segmento__op').forEach(l => l.classList.toggle('is-on', l.contains(inp)));
    renderCuanto();
  }));
  $('#cu-n')?.addEventListener('input', e => { cu.n = Number(e.target.value); renderCuanto(); });
  $('#cu-talle')?.addEventListener('change', e => { cu.talle = e.target.value; renderCuanto(); });
  $('#cu-tabla').addEventListener('click', e => {
    const b = e.target.closest('[data-cu-add]');
    if (!b) return;
    const p = getProducto(b.dataset.cuAdd);
    if (!p) return;
    const sumadas = sumarAlCarrito(p, cu.n, cu.talle, p.colores[0].n);
    if (!sumadas) { showToast(`De ${p.nombre} ya tenés en el carrito todo lo que hay en stock.`); return; }
    const resto = MINIMO_MAYOR - Cart.count();
    showToast(`Sumaste ${sumadas} × ${p.nombre} (${p.colores[0].n}, ${cu.talle}). ${resto <= 0 ? 'Ya tenés precio por mayor.' : `Te ${resto === 1 ? 'falta' : 'faltan'} ${plural(resto, 'prenda', 'prendas')} para el precio por mayor.`}`);
  });
  document.addEventListener('cart:updated', renderCuanto);
  renderCuanto();
}

function initMomento() {
  const pista = $('#momento');
  if (!pista) return;
  const caps = $$('.cap', pista);
  const fotos = $$('.momento__foto', pista);
  const marcas = $$('.momento__marca', pista);
  const N = Math.min(caps.length, 4);
  const datos = CAPITULOS.slice(0, N).map(c => {
    const l = PRODUCTOS.filter(c.filtro);
    return { n: l.length, unidad: Math.min(...l.map(precioFinal)), mayor: Math.min(...l.map(p => p.mayor)) };
  });
  const tag = $('.momento__tag', pista);
  const cta = $('#mo-cta', pista);
  const cta2 = $('#mo-cta2', pista);
  const num = $('#mo-num');
  const outN = $('#mo-n');
  const outU = $('#mo-unidad');
  const outM = $('#mo-mayor');
  let actual = -1;
  const activar = i => {
    if (i === actual) return;
    const primera = actual === -1;
    actual = i;
    caps.forEach((c, k) => c.classList.toggle('is-on', k === i));
    fotos.forEach((f, k) => f.classList.toggle('is-on', k === i));
    marcas.forEach((m, k) => { m.classList.toggle('is-on', k === i); m.setAttribute('aria-selected', k === i); });
    if (num) num.textContent = String(i + 1).padStart(2, '0');
    const d = datos[i];
    if (d) {
      if (outN) outN.textContent = d.n;
      if (outU) outU.textContent = formatearPrecio(d.unidad);
      if (outM) outM.textContent = formatearPrecio(d.mayor);
    }
    const cap = CAPITULOS[i];
    if (cta && cap && d) { cta.textContent = cap.cta(d.n); cta.dataset.cat = cap.cat; cta.dataset.estilo = cap.estilo; }
    if (cta2) {
      cta2.hidden = !cap?.sec;
      if (cap?.sec) {
        cta2.textContent = cap.sec.txt;
        cta2.href = cap.sec.msg ? wspLink(cap.sec.msg) : cap.sec.href;
        if (cap.sec.msg) { cta2.target = '_blank'; cta2.rel = 'noopener'; } else { cta2.removeAttribute('target'); cta2.removeAttribute('rel'); }
      }
    }
    if (tag && !primera && !reduceMotion) { tag.classList.remove('cambia'); void tag.offsetWidth; tag.classList.add('cambia'); }
  };
  const off = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    const o = off();
    const r = pista.getBoundingClientRect();
    const recorrido = pista.offsetHeight - (window.innerHeight - o);
    const p = recorrido > 0 ? clamp01((o - r.top) / recorrido) : 0;
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    pista.style.setProperty('--local', clamp01(p * N - i).toFixed(3));
  };
  const pedir = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  marcas.forEach((m, k) => m.addEventListener('click', () => {
    const o = off();
    const recorrido = pista.offsetHeight - (window.innerHeight - o);
    const top = pista.getBoundingClientRect().top + window.scrollY - o;
    window.scrollTo({ top: top + recorrido * ((k + 0.5) / N), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  update();
}

function initBannerMsgs() {
  const cont = $('#banner-msgs');
  if (!cont) return;
  const msgs = $$('.msg', cont);
  const dots = $$('.msg__dot', cont);
  const lente = $('.banner__lente');
  const cta = $('#msg-cta');
  const DUR = 5200;
  let i = 0;
  let timer = 0;
  let pausado = false;
  cont.style.setProperty('--msg-dur', `${DUR / 1000}s`);
  const ir = k => {
    i = (k + msgs.length) % msgs.length;
    msgs.forEach((m, j) => { const on = j === i; m.classList.toggle('is-on', on); m.setAttribute('aria-hidden', !on); });
    if (cta) { cta.querySelector('span').textContent = msgs[i].dataset.cta || ''; cta.dataset.estilo = msgs[i].dataset.estilo || ''; }
    dots.forEach((d, j) => { d.classList.toggle('is-on', j === i); d.setAttribute('aria-selected', j === i); });
    const [fx, fy, fz] = (msgs[i].dataset.foco || '0.5,0.5,1').split(',').map(Number);
    if (lente) { lente.style.setProperty('--fx', `${fx * 100}%`); lente.style.setProperty('--fy', `${fy * 100}%`); lente.style.setProperty('--fz', fz); }
  };
  const programar = () => {
    clearTimeout(timer);
    if (reduceMotion || pausado) return;
    timer = setTimeout(() => { ir(i + 1); programar(); }, DUR);
  };
  if (reduceMotion) cont.classList.add('quieto');
  dots.forEach((d, j) => d.addEventListener('click', () => { ir(j); programar(); }));
  const pausar = () => { pausado = true; clearTimeout(timer); cont.classList.add('pausa'); };
  const seguir = () => { pausado = false; cont.classList.remove('pausa'); ir(i); programar(); };
  cont.addEventListener('mouseenter', pausar);
  cont.addEventListener('mouseleave', seguir);
  cont.addEventListener('focusin', pausar);
  cont.addEventListener('focusout', e => { if (!cont.contains(e.relatedTarget)) seguir(); });
  ir(0);
  programar();
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
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = $('.pantalla__foto picture');
  if (foto) gsap.fromTo(foto, { yPercent: 0 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--pantalla', start: 'top top', end: 'bottom top', scrub: true } });
  const hist = $('.historia__foto-wrap');
  if (hist) gsap.fromTo(hist, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: { trigger: hist, start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initHdrH() {
  const h = $('.site-header');
  if (!h || !ES_M2) return;
  const set = () => document.documentElement.style.setProperty('--hdr-h', `${h.offsetHeight}px`);
  set();
  window.addEventListener('resize', set, { passive: true });
  if ('ResizeObserver' in window) new window.ResizeObserver(set).observe(h);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia(ES_M2 ? '(min-width: 1241px)' : '(min-width: 961px)');
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirModal(id);
}

initEntradas();
initRail();
renderCatalogo();
initCatalogoUI();
initCuanto();
initMomento();
initReveals();
initNav();
initModelBarScroll();
initOverlays();
initAcciones();
initFloats();
updateCartBadge();
initHdrH();
initHeroMotion();
initBannerMsgs();
initParallax();
initDeepLink();
