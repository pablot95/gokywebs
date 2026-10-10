const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492966252959';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refreshST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const FAMILIAS = {
  floral: { label: 'Floral', plural: 'Florales', color: '#C27A9C' },
  frutal: { label: 'Frutal', plural: 'Frutales', color: '#C9806A' },
  oriental: { label: 'Oriental', plural: 'Orientales', color: '#92306E' },
  amaderada: { label: 'Amaderada', plural: 'Amaderadas', color: '#8A6A35' },
  citrica: { label: 'Cítrica', plural: 'Cítricas', color: '#B79A4A' },
};
const PARA = { mujer: 'Mujer', hombre: 'Hombre', unisex: 'Sin género' };
const TIPOS = { edp: 'Eau de parfum', mist: 'Body mist', set: 'Set de regalo' };
const ESCENAS = {
  'hero-vidriera': { src: 'images/hero-vidriera.webp', ar: '1672 / 941', alt: 'Frascos de perfume rosados, dorado y fucsia sobre mármol blanco, entre peonías' },
  'vertical-tocador': { src: 'images/vertical-tocador.webp', ar: '941 / 1672', alt: 'Frasco de perfume fucsia sobre mármol, con peonías detrás' },
  'regalo-mono': { src: 'images/regalo-mono.webp', ar: '1 / 1', alt: 'Perfumes rosados junto a cajas blancas con moño fucsia' },
  'tocador-peonias': { src: 'images/tocador-peonias.webp', ar: '1 / 1', alt: 'Frascos de perfume rosados sobre una bandeja de mármol, junto a una peonía' },
  'bandeja-dorada': { src: 'images/bandeja-dorada.webp', ar: '1 / 1', alt: 'Perfumes sobre una bandeja dorada, entre cajas de regalo y cintas fucsia' },
  'estante-luz': { src: 'images/estante-luz.webp', ar: '1 / 1', alt: 'Perfumes rosados y fucsias en un estante blanco con luz de mañana' },
};

const PRODUCTOS = [
  { id: 'p01', slug: 'peonia-real', nombre: 'Peonía Real', para: 'mujer', familia: 'floral', tipo: 'edp', presentacion: '100 ml', precio: 38900, descuento: 0, stock: 14, nuevo: false, destacado: false, img: 'images/p-peonia-real.webp', escena: 'tocador-peonias',
    notas: { salida: ['Mandarina', 'Pera'], corazon: ['Peonía', 'Rosa'], fondo: ['Almizcle blanco', 'Cedro'] },
    desc: 'Un floral luminoso para el día: abre fresco y termina suave, pegado a la piel.' },
  { id: 'p02', slug: 'rubi-de-noche', nombre: 'Rubí de Noche', para: 'mujer', familia: 'oriental', tipo: 'edp', presentacion: '100 ml', precio: 42900, descuento: 0, stock: 9, nuevo: true, destacado: false, img: 'images/p-rubi-de-noche.webp', escena: 'vertical-tocador',
    notas: { salida: ['Frambuesa', 'Pimienta rosa'], corazon: ['Rosa negra', 'Orquídea'], fondo: ['Pachulí', 'Vainilla'] },
    desc: 'Oriental intenso para salir: dulce, profundo y con mucha estela.' },
  { id: 'p03', slug: 'cristal-rose', nombre: 'Cristal Rosé', para: 'mujer', familia: 'frutal', tipo: 'edp', presentacion: '100 ml', precio: 36900, descuento: 0, stock: 11, nuevo: false, destacado: false, img: 'images/p-cristal-rose.webp', escena: 'hero-vidriera',
    notas: { salida: ['Lichi', 'Bergamota'], corazon: ['Peonía', 'Rosa'], fondo: ['Almizcle', 'Ámbar suave'] },
    desc: 'Frutal y chispeante, ideal para usar todos los días.' },
  { id: 'p04', slug: 'ambar-dorado', nombre: 'Ámbar Dorado', para: 'hombre', familia: 'oriental', tipo: 'edp', presentacion: '100 ml', precio: 41900, descuento: 0, stock: 10, nuevo: false, destacado: false, img: 'images/p-ambar-dorado.webp', escena: 'hero-vidriera',
    notas: { salida: ['Cardamomo', 'Bergamota'], corazon: ['Ámbar', 'Lavanda'], fondo: ['Cuero', 'Haba tonka'] },
    desc: 'Masculino cálido y especiado, para la noche o los días frescos.' },
  { id: 'p05', slug: 'seda-blanca', nombre: 'Seda Blanca', para: 'mujer', familia: 'floral', tipo: 'mist', presentacion: '200 ml', precio: 17900, descuento: 0, stock: 18, nuevo: false, destacado: false, img: 'images/p-seda-blanca.webp', escena: 'hero-vidriera',
    notas: { salida: ['Limón', 'Pera'], corazon: ['Jazmín', 'Flor de algodón'], fondo: ['Almizcle'] },
    desc: 'Body mist liviano para refrescarte durante el día. Se puede repetir sin cansar.' },
  { id: 'p06', slug: 'fucsia-intenso', nombre: 'Fucsia Intenso', para: 'mujer', familia: 'frutal', tipo: 'edp', presentacion: '100 ml', precio: 39900, descuento: 15, stock: 8, nuevo: false, destacado: true, img: 'images/p-fucsia-intenso.webp', escena: 'hero-vidriera',
    notas: { salida: ['Cassis', 'Pera'], corazon: ['Frutilla', 'Peonía'], fondo: ['Praliné', 'Vainilla'] },
    desc: 'Frutal goloso y alegre, con buena duración en la piel.' },
  { id: 'p07', slug: 'rosa-antigua', nombre: 'Rosa Antigua', para: 'mujer', familia: 'floral', tipo: 'edp', presentacion: '100 ml', precio: 35900, descuento: 0, stock: 12, nuevo: false, destacado: false, img: 'images/p-rosa-antigua.webp', escena: 'hero-vidriera',
    notas: { salida: ['Bergamota', 'Pimienta rosa'], corazon: ['Rosa damascena', 'Violeta'], fondo: ['Iris', 'Almizcle'] },
    desc: 'Una rosa clásica y empolvada, elegante para cualquier momento.' },
  { id: 'p08', slug: 'lazo-de-seda', nombre: 'Lazo de Seda', para: 'mujer', familia: 'floral', tipo: 'set', presentacion: 'Perfume 100 ml + body mist 200 ml', corta: '2 piezas', precio: 58900, descuento: 0, stock: 6, nuevo: false, destacado: true, img: 'images/p-lazo-de-seda.webp', escena: 'regalo-mono',
    notas: { salida: ['Mandarina', 'Pera'], corazon: ['Peonía', 'Jazmín'], fondo: ['Almizcle blanco'] },
    desc: 'Set de regalo con Peonía Real y el body mist Seda Blanca, en caja con moño.' },
  { id: 'p09', slug: 'terciopelo', nombre: 'Terciopelo', para: 'mujer', familia: 'oriental', tipo: 'edp', presentacion: '100 ml', precio: 40900, descuento: 0, stock: 9, nuevo: false, destacado: true, img: 'images/p-terciopelo.webp', escena: 'regalo-mono',
    notas: { salida: ['Pera', 'Almendra'], corazon: ['Orquídea', 'Jazmín'], fondo: ['Vainilla', 'Haba tonka'] },
    desc: 'Oriental cremoso y envolvente, pensado para la noche.' },
  { id: 'p10', slug: 'brisa-de-lichi', nombre: 'Brisa de Lichi', para: 'mujer', familia: 'frutal', tipo: 'edp', presentacion: '50 ml', precio: 26900, descuento: 0, stock: 13, nuevo: true, destacado: false, img: 'images/p-brisa-de-lichi.webp', escena: 'regalo-mono',
    notas: { salida: ['Lichi', 'Frambuesa'], corazon: ['Agua de rosas', 'Peonía'], fondo: ['Almizcle'] },
    desc: 'Fresco y frutal, en tamaño para llevar en la cartera.' },
  { id: 'p11', slug: 'joya-rosa', nombre: 'Joya Rosa', para: 'mujer', familia: 'floral', tipo: 'edp', presentacion: '50 ml', precio: 27900, descuento: 0, stock: 3, nuevo: false, destacado: false, img: 'images/p-joya-rosa.webp', escena: 'regalo-mono',
    notas: { salida: ['Mandarina', 'Grosella'], corazon: ['Peonía', 'Magnolia'], fondo: ['Almizcle', 'Cedro'] },
    desc: 'Floral delicado, en un frasco tallado que luce en el tocador.' },
  { id: 'p12', slug: 'velo-rosa', nombre: 'Velo Rosa', para: 'mujer', familia: 'floral', tipo: 'edp', presentacion: '100 ml', precio: 37900, descuento: 0, stock: 10, nuevo: false, destacado: false, img: 'images/p-velo-rosa.webp', escena: 'tocador-peonias',
    notas: { salida: ['Pera', 'Bergamota'], corazon: ['Peonía', 'Fresia'], fondo: ['Almizcle blanco'] },
    desc: 'Floral almizclado, suave y limpio: huele a piel recién bañada.' },
  { id: 'p13', slug: 'oro-viejo', nombre: 'Oro Viejo', para: 'hombre', familia: 'amaderada', tipo: 'edp', presentacion: '100 ml', precio: 43900, descuento: 0, stock: 7, nuevo: false, destacado: true, img: 'images/p-oro-viejo.webp', escena: 'bandeja-dorada',
    notas: { salida: ['Pimienta negra', 'Pomelo'], corazon: ['Vetiver', 'Lavanda'], fondo: ['Cedro', 'Sándalo'] },
    desc: 'Amaderado seco y elegante, para todos los días.' },
  { id: 'p14', slug: 'cuarzo', nombre: 'Cuarzo', para: 'unisex', familia: 'citrica', tipo: 'edp', presentacion: '100 ml', precio: 36900, descuento: 0, stock: 12, nuevo: false, destacado: false, img: 'images/p-cuarzo.webp', escena: 'bandeja-dorada',
    notas: { salida: ['Bergamota', 'Limón'], corazon: ['Té blanco', 'Neroli'], fondo: ['Cedro', 'Almizcle'] },
    desc: 'Cítrico limpio y luminoso, para usar sin pensar en el género.' },
  { id: 'p15', slug: 'granada', nombre: 'Granada', para: 'mujer', familia: 'oriental', tipo: 'edp', presentacion: '100 ml', precio: 44900, descuento: 0, stock: 8, nuevo: true, destacado: true, img: 'images/p-granada.webp', escena: 'bandeja-dorada',
    notas: { salida: ['Granada', 'Pimienta rosa'], corazon: ['Rosa turca', 'Azafrán'], fondo: ['Oud suave', 'Ámbar'] },
    desc: 'Oriental frutal con carácter, para ocasiones especiales.' },
  { id: 'p16', slug: 'perla', nombre: 'Perla', para: 'unisex', familia: 'citrica', tipo: 'edp', presentacion: '50 ml', precio: 27900, descuento: 0, stock: 11, nuevo: false, destacado: false, img: 'images/p-perla.webp', escena: 'bandeja-dorada',
    notas: { salida: ['Neroli', 'Mandarina'], corazon: ['Flor de azahar'], fondo: ['Almizcle blanco'] },
    desc: 'Cítrico floral, fresco y fácil de usar.' },
  { id: 'p17', slug: 'bandeja-dorada', nombre: 'Bandeja Dorada', para: 'unisex', familia: '', tipo: 'set', presentacion: '4 perfumes de 30 ml', corta: '4 × 30 ml', precio: 64900, descuento: 10, stock: 5, nuevo: false, destacado: true, img: 'images/p-bandeja-dorada.webp', escena: 'bandeja-dorada',
    notas: { salida: ['Bergamota', 'Pera'], corazon: ['Rosa', 'Azahar'], fondo: ['Ámbar', 'Almizcle'] },
    desc: 'Set de regalo con cuatro perfumes de 30 ml para probar familias distintas: cítrica, floral, frutal y oriental.' },
  { id: 'p18', slug: 'diamante-rosa', nombre: 'Diamante Rosa', para: 'mujer', familia: 'frutal', tipo: 'edp', presentacion: '100 ml', precio: 38900, descuento: 0, stock: 10, nuevo: false, destacado: false, img: 'images/p-diamante-rosa.webp', escena: 'estante-luz',
    notas: { salida: ['Frutilla', 'Mandarina'], corazon: ['Peonía', 'Malvavisco'], fondo: ['Caramelo', 'Almizcle'] },
    desc: 'Frutal dulce y divertido, de los que dejan estela.' },
  { id: 'p19', slug: 'magenta', nombre: 'Magenta', para: 'mujer', familia: 'oriental', tipo: 'edp', presentacion: '100 ml', precio: 41900, descuento: 0, stock: 9, nuevo: false, destacado: true, img: 'images/p-magenta.webp', escena: 'estante-luz',
    notas: { salida: ['Ciruela', 'Pimienta rosa'], corazon: ['Rosa', 'Heliotropo'], fondo: ['Ámbar', 'Pachulí'] },
    desc: 'Oriental floral, profundo y femenino.' },
  { id: 'p20', slug: 'te-blanco', nombre: 'Té Blanco', para: 'unisex', familia: 'citrica', tipo: 'edp', presentacion: '50 ml', precio: 26900, descuento: 0, stock: 12, nuevo: false, destacado: false, img: 'images/p-te-blanco.webp', escena: 'estante-luz',
    notas: { salida: ['Pomelo', 'Jengibre'], corazon: ['Té blanco', 'Jazmín'], fondo: ['Almizcle'] },
    desc: 'Cítrico fresco, perfecto para los días de calor.' },
  { id: 'p21', slug: 'luna-clara', nombre: 'Luna Clara', para: 'unisex', familia: 'amaderada', tipo: 'edp', presentacion: '100 ml', precio: 35900, descuento: 0, stock: 10, nuevo: false, destacado: true, img: 'images/p-luna-clara.webp', escena: 'estante-luz',
    notas: { salida: ['Pera', 'Bergamota'], corazon: ['Iris', 'Sándalo'], fondo: ['Cedro', 'Almizcle'] },
    desc: 'Amaderado suave y cremoso, sin género.' },
  { id: 'p22', slug: 'gota-fucsia', nombre: 'Gota Fucsia', para: 'mujer', familia: 'frutal', tipo: 'mist', presentacion: '200 ml', precio: 18900, descuento: 10, stock: 15, nuevo: false, destacado: false, img: 'images/p-gota-fucsia.webp', escena: 'estante-luz',
    notas: { salida: ['Frambuesa', 'Cassis'], corazon: ['Peonía'], fondo: ['Vainilla'] },
    desc: 'Body mist frutal para llevar en la cartera y retocarte en el día.' },
];
PRODUCTOS.forEach((p, i) => { p.n = String(i + 1).padStart(2, '0'); });

const BASE = location.pathname.includes('/producto/') ? '../' : '';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'perfumesara_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
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

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
PRODUCTOS.forEach(p => {
  p._q = norm([p.nombre, FAMILIAS[p.familia]?.label, FAMILIAS[p.familia]?.plural, PARA[p.para], TIPOS[p.tipo], p.presentacion, p.desc,
    ...p.notas.salida, ...p.notas.corazon, ...p.notas.fondo].join(' '));
});

const ICON_MENOS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICON_MAS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_WSP = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>';

const metaTexto = p => p.tipo === 'set' ? 'Set de regalo' : (FAMILIAS[p.familia]?.label ?? '');
const altProducto = p => `Frasco de ${p.nombre}, ${TIPOS[p.tipo].toLowerCase()} de ${p.presentacion}`;
const colorFamilia = p => FAMILIAS[p.familia]?.color ?? '#B8935A';

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `${ICON_CHECK}<span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const bloqueos = new Set();
function bloquear(on, clave) {
  if (on) bloqueos.add(clave); else bloqueos.delete(clave);
  document.body.classList.toggle('no-scroll', bloqueos.size > 0);
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length && window.getComputedStyle(el).visibility !== 'hidden');
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !cont.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function badgesHTML(p) {
  const b = [];
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}

function precioHTML(p, cls = 'prod__precio') {
  return `<p class="${cls}"><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}

function stepperHTML(p, attr = 'data-step') {
  return `<div class="stepper" data-max="${p.stock}"><button type="button" ${attr}="-1" aria-label="Restar una unidad de ${esc(p.nombre)}" disabled>${ICON_MENOS}</button><span class="stepper__val">1</span><button type="button" ${attr}="1" aria-label="Sumar una unidad de ${esc(p.nombre)}"${p.stock <= 1 ? ' disabled' : ''}>${ICON_MAS}</button></div>`;
}

function cardHTML(p, opts = {}) {
  const { compacta = false, animar = true, rail = false } = opts;
  const anim = !animar ? '' : rail
    ? ' data-animate="der" style="opacity:0;transform:translateX(64px)"'
    : ' data-animate="subir" style="opacity:0;transform:translateY(40px)"';
  const add = `<button class="btn btn--cta prod-add" type="button" data-add="${p.id}"><span class="lbl-largo">Agregar al carrito</span><span class="lbl-corto">Agregar</span></button>`;
  const acciones = compacta
    ? `<div class="prod-actions">${add}</div>`
    : `<div class="prod-actions">${stepperHTML(p)}${add}</div><button class="prod__comprar" type="button" data-buy="${p.id}">Comprar ahora</button>`;
  return `<li class="prod"${anim}><article class="prod__card">`
    + `<button class="prod__foto foto-card" type="button" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img src="${BASE}${p.img}" width="640" height="800" alt="${esc(altProducto(p))}">${badgesHTML(p)}<span class="prod__ver" aria-hidden="true">Vista rápida</span></button>`
    + `<span class="prod__num">N° ${p.n}</span>`
    + `<div class="prod__info"><p class="prod__meta"><span class="dot" style="--dot:${colorFamilia(p)}"></span><span>${esc(metaTexto(p))}</span><span class="meta-pres">· ${esc(p.corta || p.presentacion)}</span></p>`
    + `<h3 class="prod__nombre"><span>${esc(p.nombre)}</span></h3>${precioHTML(p)}${acciones}</div>`
    + `</article></li>`;
}

const POR_PAGINA = 16;
const estado = { q: '', familia: '', para: new Set(), tipo: new Set(), precio: 'todos', oferta: false, orden: 'recomendados', visibles: POR_PAGINA };
let resultado = [];

function coincide(p) {
  if (estado.familia && p.familia !== estado.familia) return false;
  if (estado.para.size && !estado.para.has(p.para)) return false;
  if (estado.tipo.size && !estado.tipo.has(p.tipo)) return false;
  if (estado.oferta && !(p.descuento > 0)) return false;
  const f = precioFinal(p);
  if (estado.precio === 'hasta30' && f > 30000) return false;
  if (estado.precio === '30a45' && (f < 30000 || f > 45000)) return false;
  if (estado.precio === 'mas45' && f <= 45000) return false;
  if (estado.q) {
    const palabras = norm(estado.q).split(/\s+/).filter(Boolean);
    if (!palabras.every(w => p._q.includes(w))) return false;
  }
  return true;
}

function ordenar(lista) {
  const l = [...lista];
  if (estado.orden === 'menor') l.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'mayor') l.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'az') l.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return l;
}

function filtrosActivos() {
  return estado.para.size + estado.tipo.size + (estado.precio !== 'todos' ? 1 : 0) + (estado.oferta ? 1 : 0);
}

function actualizarPie() {
  const grid = document.getElementById('catalogo-grid');
  const mas = document.getElementById('ver-mas');
  const vacio = document.getElementById('catalogo-vacio');
  if (!grid) return;
  document.querySelectorAll('[data-res-count]').forEach(el => { el.textContent = resultado.length; });
  if (vacio) vacio.hidden = resultado.length > 0;
  if (mas) mas.closest('.tienda__mas').hidden = estado.visibles >= resultado.length;
  const n = filtrosActivos();
  document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n; el.hidden = n === 0; });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  resultado = ordenar(PRODUCTOS.filter(coincide));
  estado.visibles = POR_PAGINA;
  grid.innerHTML = resultado.slice(0, estado.visibles).map(p => cardHTML(p)).join('');
  actualizarPie();
  revelarNuevos(grid);
  refreshST();
}

function verMas() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  const desde = estado.visibles;
  estado.visibles += POR_PAGINA;
  grid.insertAdjacentHTML('beforeend', resultado.slice(desde, estado.visibles).map(p => cardHTML(p)).join(''));
  actualizarPie();
  revelarNuevos(grid);
  refreshST();
}

function sincronizarControles() {
  const q = document.getElementById('cat-q');
  if (q && q.value !== estado.q) q.value = estado.q;
  document.querySelectorAll('.chip[data-familia]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.familia === estado.familia)));
  document.querySelectorAll('input[data-f="para"]').forEach(i => { i.checked = estado.para.has(i.value); });
  document.querySelectorAll('input[data-f="tipo"]').forEach(i => { i.checked = estado.tipo.has(i.value); });
  document.querySelectorAll('input[data-f="oferta"]').forEach(i => { i.checked = estado.oferta; });
  document.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
  const orden = document.getElementById('cat-orden');
  if (orden) orden.value = estado.orden;
}

function limpiarFiltros() {
  estado.q = '';
  estado.familia = '';
  estado.para.clear();
  estado.tipo.clear();
  estado.precio = 'todos';
  estado.oferta = false;
  sincronizarControles();
  renderCatalogo();
}

function irA(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function aplicarFiltro(valor) {
  const [clave, dato] = String(valor).split(':');
  estado.q = '';
  estado.familia = '';
  estado.para.clear();
  estado.tipo.clear();
  estado.precio = 'todos';
  estado.oferta = false;
  if (clave === 'familia' && FAMILIAS[dato]) estado.familia = dato;
  if (clave === 'tipo' && TIPOS[dato]) estado.tipo.add(dato);
  if (clave === 'para' && PARA[dato]) estado.para.add(dato);
  sincronizarControles();
  renderCatalogo();
  irA('tienda');
}

function initConteos() {
  const contar = (clave, dato) => PRODUCTOS.filter(p => clave === 'oferta' ? p.descuento > 0 : p[clave] === dato).length;
  document.querySelectorAll('[data-n]').forEach(el => {
    const [clave, dato] = el.dataset.n.split(':');
    el.textContent = contar(clave, dato);
  });
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [clave, dato] = el.dataset.cuenta.split(':');
    const n = contar(clave, dato);
    el.textContent = clave === 'tipo' && dato === 'set' ? `${n} ${n === 1 ? 'set' : 'sets'}` : `${n} ${n === 1 ? 'fragancia' : 'fragancias'}`;
  });
  document.querySelectorAll('[data-num]').forEach(el => {
    const [clave, dato] = el.dataset.num.split(':');
    el.textContent = contar(clave, dato);
  });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = PRODUCTOS.length; });
}

function initCatalogo() {
  const grid = document.getElementById('catalogo-grid');
  if (!grid) return;
  renderCatalogo();
  document.getElementById('ver-mas')?.addEventListener('click', verMas);

  const q = document.getElementById('cat-q');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value.trim(); renderCatalogo(); }, 160);
  });
  document.querySelectorAll('form[data-buscador]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    if (q) { estado.q = q.value.trim(); q.blur(); }
    renderCatalogo();
    irA('tienda');
  }));

  document.querySelectorAll('.chip[data-familia]').forEach(chip => chip.addEventListener('click', () => {
    estado.familia = chip.dataset.familia;
    sincronizarControles();
    renderCatalogo();
  }));

  document.getElementById('cat-orden')?.addEventListener('change', e => {
    estado.orden = e.target.value;
    renderCatalogo();
  });

  document.querySelectorAll('input[data-f]').forEach(inp => inp.addEventListener('change', () => {
    const grupo = inp.dataset.f;
    if (grupo === 'oferta') estado.oferta = inp.checked;
    else if (inp.checked) estado[grupo].add(inp.value);
    else estado[grupo].delete(inp.value);
    renderCatalogo();
  }));
  document.querySelectorAll('input[name="precio"]').forEach(inp => inp.addEventListener('change', () => {
    if (inp.checked) { estado.precio = inp.value; renderCatalogo(); }
  }));
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', limpiarFiltros));
}

function initDestacados() {
  const lista = document.getElementById('destacados-lista');
  if (!lista) return;
  const rail = lista.dataset.vista === 'rail';
  lista.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p, { compacta: true, rail })).join('');
}

function resetStepper(cont) {
  const st = cont?.querySelector('.stepper');
  if (!st) return;
  st.querySelector('.stepper__val').textContent = '1';
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = true;
  mas.disabled = Number(st.dataset.max) <= 1;
}

function moverStepper(btn, dir) {
  const st = btn.closest('.stepper');
  if (!st) return 1;
  const val = st.querySelector('.stepper__val');
  const max = Number(st.dataset.max) || 99;
  const n = Math.max(1, Math.min(max, (Number(val.textContent) || 1) + dir));
  val.textContent = n;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = n <= 1;
  mas.disabled = n >= max;
  return n;
}

function bruma(btn) {
  if (reduceMotion || !btn) return;
  const cont = btn.closest('.prod__card, .qv__info');
  if (!cont) return;
  const r = btn.getBoundingClientRect();
  const c = cont.getBoundingClientRect();
  const s = document.createElement('span');
  s.className = 'bruma';
  s.style.left = `${r.left - c.left + r.width / 2}px`;
  s.style.top = `${r.top - c.top + r.height / 2}px`;
  cont.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
  setTimeout(() => s.remove(), 1200);
}

function agregar(p, qty, btn) {
  if (!p) return;
  Cart.add(p, qty);
  bruma(btn);
  showToast(qty > 1 ? `Sumaste ${qty} × ${p.nombre} al carrito` : `Sumaste ${p.nombre} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQV(quick.dataset.quick, quick); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const card = add.closest('.prod__card');
      const qty = Number(card?.querySelector('.stepper__val')?.textContent) || 1;
      agregar(getProducto(add.dataset.add), qty, add);
      resetStepper(card);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const card = buy.closest('.prod__card');
      const qty = Number(card?.querySelector('.stepper__val')?.textContent) || 1;
      const p = getProducto(buy.dataset.buy);
      if (p) { Cart.add(p, qty); resetStepper(card); openCartDrawer(buy); }
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) { moverStepper(step, Number(step.dataset.step)); return; }
    const filtro = e.target.closest('[data-filtro]');
    if (filtro) { e.preventDefault(); aplicarFiltro(filtro.dataset.filtro); }
  });
}

function initBuscarLink() {
  document.querySelectorAll('[data-ir-buscar]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    irA('tienda');
    setTimeout(() => document.getElementById('cat-q')?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  }));
}

function initFiltrosDrawer() {
  const panel = document.getElementById('filtros');
  if (!panel) return;
  const abrirBtn = document.querySelector('[data-filtros-abrir]');
  const bd = document.createElement('div');
  bd.className = 'filtros-backdrop';
  document.body.appendChild(bd);
  const fijo = window.matchMedia('(min-width: 1025px)');
  const esLateral = () => document.body.classList.contains('m2') && fijo.matches;
  let ultimoFoco = null;
  const abrir = () => {
    if (esLateral()) return;
    ultimoFoco = document.activeElement;
    panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.classList.add('open');
    bd.classList.add('open');
    abrirBtn?.setAttribute('aria-expanded', 'true');
    bloquear(true, 'filtros');
    setTimeout(() => panel.querySelector('input')?.focus({ preventScroll: true }), 80);
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    bd.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    bloquear(false, 'filtros');
    ultimoFoco?.focus?.({ preventScroll: true });
  };
  abrirBtn?.addEventListener('click', abrir);
  panel.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrar));
  bd.addEventListener('click', cerrar);
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(panel, e);
  });
  fijo.addEventListener('change', () => { if (esLateral()) cerrar(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

let openCartDrawer = () => {};

function renderCart() {
  const lista = document.getElementById('cart-items');
  const vacio = document.getElementById('cart-vacio');
  const pie = document.getElementById('cart-pie');
  if (!lista) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  const n = items.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('[data-cart-resumen]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
  lista.hidden = !items.length;
  if (vacio) vacio.hidden = !!items.length;
  if (pie) pie.hidden = !items.length;
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${p.id}"><div class="linea__foto"><img src="${BASE}${p.img}" width="640" height="800" alt=""></div>`
      + `<div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(metaTexto(p))} · ${esc(p.presentacion)}</p>`
      + `<div class="stepper" data-max="${p.stock}"><button type="button" data-linea-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICON_MENOS}</button><span class="stepper__val">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}"${i.qty >= p.stock ? ' disabled' : ''}>${ICON_MAS}</button></div></div>`
      + `<div class="linea__der"><p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p><button class="linea__quitar" type="button" data-quitar="${p.id}">Quitar</button></div></li>`;
  }).join('');
  const total = document.getElementById('cart-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
  const wsp = document.getElementById('cart-wsp');
  if (wsp) {
    const lineas = items.map(i => { const p = getProducto(i.id); return `• ${i.qty} × ${p.nombre} (${p.presentacion}) — ${formatearPrecio(precioFinal(p) * i.qty)}`; });
    wsp.href = items.length
      ? wspLink(`Hola Perfumes Ara! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`)
      : wspLink('Hola Perfumes Ara! Quiero hacer un pedido.');
  }
}

function initCartDrawer() {
  const dr = document.getElementById('cart-drawer');
  if (!dr) return;
  const panel = dr.querySelector('.drawer__panel');
  let ultimoFoco = null;
  openCartDrawer = trigger => {
    ultimoFoco = trigger || document.activeElement;
    renderCart();
    dr.hidden = false;
    void dr.offsetWidth;
    dr.classList.add('open');
    bloquear(true, 'cart');
    panel.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!dr.classList.contains('open')) return;
    dr.classList.remove('open');
    bloquear(false, 'cart');
    setTimeout(() => { if (!dr.classList.contains('open')) dr.hidden = true; }, 420);
    ultimoFoco?.focus?.({ preventScroll: true });
  };
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', e => openCartDrawer(e.currentTarget)));
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cart-close]')) { cerrar(); return; }
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const id = step.closest('[data-linea]').dataset.linea;
      const item = Cart.get().find(i => i.id === id);
      if (!item) return;
      const dir = step.dataset.lineaStep;
      Cart.setQty(id, item.qty + Number(dir));
      const nuevo = dr.querySelector(`[data-linea="${id}"] [data-linea-step="${dir}"]`);
      (nuevo && !nuevo.disabled ? nuevo : dr.querySelector(`[data-linea="${id}"] .linea__quitar`))?.focus({ preventScroll: true });
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const p = getProducto(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      if (p) showToast(`Sacaste ${p.nombre} del carrito`);
      panel.focus({ preventScroll: true });
    }
  });
  document.getElementById('cart-checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  dr.addEventListener('keydown', e => {
    if (!dr.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(panel, e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCart(); });
}

let abrirQV = () => {};

function ldProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(BASE + p.img, location.href).href,
    description: p.desc,
    brand: { '@type': 'Brand', name: 'Millanel' },
    category: TIPOS[p.tipo],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: precioFinal(p),
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${location.origin}${location.pathname}?producto=${p.slug}`,
    },
  });
}

function qvHTML(p) {
  const escena = ESCENAS[p.escena];
  const rel = PRODUCTOS.filter(x => x.id !== p.id && (p.tipo === 'set' ? x.tipo === 'set' || x.destacado : x.familia === p.familia)).slice(0, 4);
  const fam = FAMILIAS[p.familia];
  const notas = [['Salida', p.notas.salida], ['Corazón', p.notas.corazon], ['Fondo', p.notas.fondo]]
    .map(([t, l]) => `<div><dt>${t}</dt><dd>${esc(l.join(', '))}</dd></div>`).join('');
  const meta = [p.tipo === 'set' ? 'Set de regalo' : fam?.label, PARA[p.para], p.presentacion].filter(Boolean).map(esc).join(' · ');
  return `<div class="qv__galeria">`
    + `<div class="qv__main es-producto" style="--ar:4 / 5"><img src="${BASE}${p.img}" width="640" height="800" alt="${esc(altProducto(p))}"></div>`
    + `<div class="qv__thumbs" role="group" aria-label="Fotos de ${esc(p.nombre)}">`
    + `<button class="qv__thumb" type="button" aria-pressed="true" data-qv-foto="${BASE}${p.img}" data-ar="4 / 5" data-alt="${esc(altProducto(p))}" aria-label="Ver el frasco"><img src="${BASE}${p.img}" width="640" height="800" alt=""></button>`
    + (escena ? `<button class="qv__thumb" type="button" aria-pressed="false" data-qv-foto="${BASE}${escena.src}" data-ar="${escena.ar}" data-alt="${esc(escena.alt)}" aria-label="Ver el frasco en su escena"><img src="${BASE}${escena.src}" alt=""></button>` : '')
    + `</div></div>`
    + `<div class="qv__info">`
    + `<p class="qv__num">N° ${p.n} · Fragancias Millanel</p>`
    + `<h2 class="qv__nombre">${esc(p.nombre)}</h2>`
    + `<p class="qv__meta">${meta}</p>`
    + `${precioHTML(p, 'qv__precio')}`
    + `<p class="qv__desc">${esc(p.desc)}</p>`
    + `<dl class="piramide">${notas}</dl>`
    + `<div class="qv__acciones">${stepperHTML(p, 'data-qv-step')}<button class="btn btn--cta" type="button" data-qv-add="${p.id}">Agregar al carrito</button><button class="btn btn--ghost" type="button" data-qv-buy="${p.id}">Comprar ahora</button></div>`
    + `<a class="qv__wsp" href="${wspLink(`Hola Perfumes Ara! Me interesa ${p.nombre} (${p.presentacion}). ¿Está disponible?`)}" target="_blank" rel="noopener">${ICON_WSP}Consultar por este perfume</a>`
    + (rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" data-quick="${r.id}"><span class="mini"><img src="${BASE}${r.img}" width="640" height="800" alt="${esc(altProducto(r))}"></span><span>${esc(r.nombre)}</span></button></li>`).join('')}</ul></div>` : '')
    + `</div>`;
}

function initQuickView() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  const panel = qv.querySelector('.qv__panel');
  const body = document.getElementById('qv-body');
  let ultimoFoco = null;
  let actual = null;
  abrirQV = (id, trigger) => {
    const p = getProducto(id);
    if (!p) return;
    if (qv.hidden) ultimoFoco = trigger || document.activeElement;
    actual = p;
    body.innerHTML = qvHTML(p);
    panel.scrollTop = 0;
    if (qv.hidden) {
      qv.hidden = false;
      void qv.offsetWidth;
      qv.classList.add('open');
      bloquear(true, 'qv');
    }
    panel.focus({ preventScroll: true });
    window.history.replaceState(null, '', `${location.pathname}?producto=${p.slug}${location.hash}`);
    ldProducto(p);
  };
  const cerrar = () => {
    if (!qv.classList.contains('open')) return;
    qv.classList.remove('open');
    bloquear(false, 'qv');
    setTimeout(() => { if (!qv.classList.contains('open')) { qv.hidden = true; body.innerHTML = ''; } }, 420);
    window.history.replaceState(null, '', `${location.pathname}${location.hash}`);
    ultimoFoco?.focus?.({ preventScroll: true });
    actual = null;
  };
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-qv-close]')) { cerrar(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) {
      const main = qv.querySelector('.qv__main');
      const img = main.querySelector('img');
      img.src = foto.dataset.qvFoto;
      img.alt = foto.dataset.alt;
      img.removeAttribute('width');
      img.removeAttribute('height');
      main.style.setProperty('--ar', foto.dataset.ar);
      main.classList.toggle('es-producto', foto.dataset.ar === '4 / 5');
      qv.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === foto)));
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) { moverStepper(step, Number(step.dataset.qvStep)); return; }
    const add = e.target.closest('[data-qv-add]');
    if (add && actual) {
      const qty = Number(qv.querySelector('.qv__acciones .stepper__val')?.textContent) || 1;
      agregar(actual, qty, add);
      resetStepper(qv.querySelector('.qv__acciones'));
      return;
    }
    const buy = e.target.closest('[data-qv-buy]');
    if (buy && actual) {
      const qty = Number(qv.querySelector('.qv__acciones .stepper__val')?.textContent) || 1;
      Cart.add(actual, qty);
      const origen = ultimoFoco;
      cerrar();
      openCartDrawer(origen);
    }
  });
  qv.addEventListener('keydown', e => {
    if (!qv.classList.contains('open')) return;
    if (e.key === 'Escape') cerrar();
    else atraparFoco(panel, e);
  });
}

function initDeepLink() {
  const slug = new URLSearchParams(location.search).get('producto');
  if (!slug) return;
  const p = PRODUCTOS.find(x => x.slug === slug);
  if (p) abrirQV(p.id);
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
  cart?.addEventListener('click', () => openCartDrawer(cart));
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const marco = hero.querySelector('.hero__etiqueta, .hero--buscador .hero__foto');
  if (marco) tl.from(marco, { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero__marca, .hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('.hero__regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1 }, 0.25)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__datos > *'), { y: 16, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero--vidriera [data-hero-img]');
  if (!img) return;
  gsap.to(img, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero--vidriera', start: 'top top', end: 'bottom top', scrub: true } });
}

function initLectura() {
  const el = document.querySelector('[data-lectura]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => `<span class="lw">${esc(w)}</span>`).join(' ');
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { el.classList.add('leida'); return; }
  const cs = window.getComputedStyle(document.documentElement);
  const desde = cs.getPropertyValue('--color-text-muted').trim();
  const hasta = cs.getPropertyValue('--color-text').trim();
  gsap.fromTo(el.querySelectorAll('.lw'), { color: desde }, {
    color: hasta, ease: 'none', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 46%', scrub: true },
  });
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
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => {
    const card = track.firstElementChild;
    return card ? card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 20) : 300;
  };
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

initModelBarScroll();
initNav();
initConteos();
initDestacados();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initLectura();
initRail();
initTarjetas();
initBuscarLink();
initFiltrosDrawer();
initCartDrawer();
initQuickView();
initFloats();
updateCartBadge();
initDeepLink();
