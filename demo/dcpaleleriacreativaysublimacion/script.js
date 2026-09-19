const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5493513052383';
const PAGE = 16;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const clamp01 = v => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;
const wspLink = lineas => `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.filter(Boolean).join('\n'))}`;
const contarLetras = t => (String(t || '').match(/[\p{L}\p{N}]/gu) || []).length;
const metros = n => (n * 0.2).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const ICON = {
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  pencil: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
  cartPlus: '<svg class="lbl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg class="i" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const GRUPOS = [
  { id: 'cumple', nombre: 'Para el cumple' },
  { id: 'sublimados', nombre: 'Tazas y remeras' },
  { id: 'tarjetas', nombre: 'Tarjetas' },
];
const nombreGrupo = id => GRUPOS.find(g => g.id === id)?.nombre || '';

const PRODUCTOS = [
  {
    id: 'centro-mesa', nombre: 'Centro de mesa temático', grupo: 'cumple', tipo: 'Centro de mesa', precio: 6800, unidad: 'c/u',
    img: 'images/p-centro.webp', w: 1200, h: 1200,
    alt: 'Árboles de cartulina pintados y flores de cartón sobre una mesa blanca con banderines amarillos',
    desc: 'Piezas de cartulina y cartón para el centro de cada mesa, con la temática, el nombre y la edad del cumpleañero.',
    incluye: ['Diseño con la temática que elijas', 'Nombre y edad del cumpleañero', 'Base para que quede parado en la mesa'],
    etiquetas: 'centro centros mesa decoracion deco cumple arbol bosque tematica', personalizable: true, badge: 'Con nombre',
  },
  {
    id: 'taza-nombre', nombre: 'Taza con nombre', grupo: 'sublimados', tipo: 'Taza', precio: 10500, unidad: 'c/u',
    img: 'images/p-taza.webp', w: 1400, h: 1400,
    alt: 'Taza de cerámica blanca sobre fondo gris',
    desc: 'Taza de cerámica blanca de 11 oz sublimada con el nombre, la frase o la foto que elijas.',
    incluye: ['Cerámica blanca de 11 oz', 'Nombre, frase o foto', 'Letra y color a elección'],
    etiquetas: 'taza tazas sublimada sublimacion regalo nombre foto frase ceramica', personalizable: true, pieza: 'taza', badge: 'Con nombre',
  },
  {
    id: 'pinata-unicornio', nombre: 'Piñata unicornio', grupo: 'cumple', tipo: 'Piñata', precio: 32000, unidad: 'c/u',
    img: 'images/p-pinata.webp', w: 1200, h: 1200,
    alt: 'Piñata de papel crepé blanco con flecos rosas, orejas y cuerno dorado',
    desc: 'Hecha a mano en papel crepé, con flecos, orejas y cuerno dorado. Viene vacía, lista para llenar con golosinas.',
    incluye: ['Papel crepé con flecos', 'Cuerno dorado y orejas de cartulina', 'Cordón para colgar'],
    etiquetas: 'pinata pinatas unicornio cumple crepe golosinas', badge: 'Hecha a mano',
  },
  {
    id: 'cajitas-sorpresa', nombre: 'Cajitas sorpresa temáticas', grupo: 'cumple', tipo: 'Sorpresitas', precio: 1400, unidad: 'c/u', qtyDefault: 10,
    img: 'images/p-cajitas.webp', w: 1200, h: 1200,
    alt: 'Cajitas con manija impresas con animales de granja sobre una mesita de madera',
    desc: 'Cajita con manija impresa con la temática del cumple, para llenar de golosinas y sorpresas. Se piden por cantidad de invitados.',
    incluye: ['Impresa con la temática', 'Con el nombre del cumpleañero', 'Lista para llenar'],
    etiquetas: 'cajita cajitas sorpresita sorpresitas souvenir souvenirs granja cumple golosinas invitados', personalizable: true, badge: 'Por invitado',
  },
  {
    id: 'banderin-nombre', nombre: 'Banderín con nombre', grupo: 'cumple', tipo: 'Banderín', precio: 1500, unidad: 'por letra', porLetra: true, ancho: true,
    img: 'images/p-banderin.webp', w: 1200, h: 1200,
    alt: 'Guirnalda de banderines de papel mostaza, verde oscuro y violeta con su sombra sobre una pared blanca',
    desc: 'Un banderín de cartulina por letra, colgado de cordón. Elegís los colores y lo ves armado antes de pedirlo.',
    incluye: ['Un banderín por letra', 'Cordón para colgar', 'Colores a elección'],
    etiquetas: 'banderin banderines guirnalda nombre letras feliz cumple deco', personalizable: true, pieza: 'banderin', badge: 'Por letra',
  },
  {
    id: 'remera-sublimada', nombre: 'Remera sublimada', grupo: 'sublimados', tipo: 'Remera', unidad: 'c/u',
    variantes: [
      { id: 'nino', label: 'Niño · 4 a 14', corto: 'de niño', precio: 13900 },
      { id: 'adulto', label: 'Adulto · S a XXL', corto: 'de adulto', precio: 16500 },
    ],
    img: 'images/p-remera.webp', w: 1400, h: 1400,
    alt: 'Remera blanca lisa sobre fondo gris claro',
    desc: 'Remera blanca de poliéster sublimada al frente con nombre, número o diseño. Para el cumpleañero o para todo un equipo.',
    incluye: ['Poliéster blanco', 'Estampa al frente', 'Talles de niño y de adulto'],
    etiquetas: 'remera remeras sublimada ropa cumpleanero equipo nombre numero', personalizable: true, pieza: 'remera', badge: 'Con nombre',
  },
  {
    id: 'coronitas', nombre: 'Coronitas de papel x10', grupo: 'cumple', tipo: 'Sorpresitas', precio: 6500, unidad: 'pack de 10',
    img: 'images/p-coronitas.webp', w: 1200, h: 1200,
    alt: 'Corona de cartulina naranja y otra roja con confeti sobre fondo azul',
    desc: 'Coronas de cartulina de colores para que cada invitado se lleve la suya. Vienen en colores surtidos.',
    incluye: ['10 coronas de cartulina', 'Colores surtidos', 'Para chicos y grandes'],
    etiquetas: 'corona coronas coronitas cotillon sorpresitas invitados cumple',
  },
  {
    id: 'tarjetas', nombre: 'Tarjetas de presentación', grupo: 'tarjetas', tipo: 'Tarjetas', unidad: 'por pack',
    variantes: [
      { id: '100', label: 'x100', corto: 'x100', precio: 17500 },
      { id: '250', label: 'x250', corto: 'x250', precio: 29900 },
    ],
    img: 'images/p-tarjetas.webp', w: 1400, h: 1400,
    alt: 'Dos tarjetas de papel kraft sobre una mesa de madera con hojas verdes',
    desc: 'Tarjetas de 9 × 5 cm impresas a color con el nombre y el diseño de tu emprendimiento.',
    incluye: ['9 × 5 cm', 'Frente y dorso a color', 'Diseño con tu nombre o tu marca'],
    etiquetas: 'tarjeta tarjetas presentacion personales emprendimiento marca negocio', personalizable: true, pieza: 'tarjeta', badge: 'Para tu marca',
  },
];
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const BUSQUEDA = new Map(PRODUCTOS.map(p => [p.id, normalizar([p.nombre, p.tipo, p.etiquetas, p.desc].join(' '))]));
const PIEZA_PRODUCTO = { banderin: 'banderin-nombre', taza: 'taza-nombre', remera: 'remera-sublimada', tarjeta: 'tarjetas' };

function precioUnidad(p, variante, texto) {
  if (!p) return 0;
  if (p.porLetra) return contarLetras(texto) * p.precio;
  if (p.variantes) return (p.variantes.find(v => v.id === variante) || p.variantes[0]).precio;
  return p.precio;
}
const precioDesde = p => (p.variantes ? Math.min(...p.variantes.map(v => v.precio)) : p.precio);
const unidadDe = p => (p.porLetra ? 'por letra' : p.unidad);
const varianteDe = (p, id) => p?.variantes?.find(v => v.id === id) || p?.variantes?.[0];
const claveLinea = l => [l.id, l.variante || '', l.texto || '', l.estilo || '', l.color || ''].join('|');
const precioLinea = l => precioUnidad(getProducto(l.id), l.variante, l.texto);

const ESTILOS = {
  redonda: { nombre: 'Redonda', family: "'Gluten', 'Trebuchet MS', sans-serif", weight: 700, upper: false, spacing: 0 },
  imprenta: { nombre: 'Imprenta', family: "'Onest', system-ui, sans-serif", weight: 700, upper: true, spacing: 0.05 },
  fina: { nombre: 'Fina', family: "'Gluten', 'Trebuchet MS', sans-serif", weight: 300, upper: false, spacing: 0.01 },
};
const COMBOS = [
  { id: 'fiesta', nombre: 'Fiesta', colores: ['#00FFFF', '#2563EB', '#FFC933', '#16A34A'] },
  { id: 'mar', nombre: 'Mar', colores: ['#2563EB', '#00FFFF', '#FFFFFF'] },
  { id: 'pastel', nombre: 'Pastel', colores: ['#FFD6E8', '#C6F3F3', '#FFF1B8', '#DCD2FF'] },
  { id: 'bosque', nombre: 'Bosque', colores: ['#16A34A', '#FFC933', '#0E1B3D'] },
];
const TINTAS = [
  { id: 'azul', nombre: 'Azul', hex: '#2563EB' },
  { id: 'verde', nombre: 'Verde', hex: '#16A34A' },
  { id: 'negro', nombre: 'Negro', hex: '#111827' },
  { id: 'rojo', nombre: 'Rojo', hex: '#E23B3B' },
  { id: 'violeta', nombre: 'Violeta', hex: '#7C3AED' },
];
const nombreColor = id => (COMBOS.find(c => c.id === id) || TINTAS.find(c => c.id === id))?.nombre || id;

function luminancia(hex) {
  const n = parseInt(hex.slice(1), 16);
  const canal = v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
}
const tintaSobre = hex => (luminancia(hex) > 0.36 ? '#0E1B3D' : '#FFFFFF');

const Cart = {
  KEY: 'dcpapeleria_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento el carrito vive en la sesión */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, extra = {}) {
    const items = this.get();
    const linea = { id: producto.id, variante: extra.variante || '', texto: (extra.texto || '').trim(), estilo: extra.estilo || '', color: extra.color || '' };
    const key = claveLinea(linea);
    const existing = items.find(i => claveLinea(i) === key);
    if (existing) existing.qty = Math.min(existing.qty + qty, 999);
    else items.push({ ...linea, qty: Math.min(qty, 999) });
    this.save(items);
  },
  setQty(key, qty) {
    const items = this.get(); const it = items.find(i => claveLinea(i) === key); if (!it) return;
    it.qty = clamp(qty, 1, 999); this.save(items);
  },
  remove(key) { this.save(this.get().filter(i => claveLinea(i) !== key)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + precioLinea(i) * i.qty, 0); },
};

function limpiarCarrito() {
  const items = Cart.get();
  const validos = items.filter(i => { const p = getProducto(i.id); return p && (!p.porLetra || contarLetras(i.texto)) && i.qty > 0; });
  if (validos.length !== items.length) { try { localStorage.setItem(Cart.KEY, JSON.stringify(validos)); } catch { /* nada que limpiar */ } }
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

const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const tienda = { q: '', grupo: 'todo', page: 1 };
let revealsListos = false;

function filtrar() {
  const palabras = normalizar(tienda.q).split(/\s+/).filter(Boolean);
  return PRODUCTOS.filter(p => (tienda.grupo === 'todo' || p.grupo === tienda.grupo) && palabras.every(w => BUSQUEDA.get(p.id).includes(w)));
}

function textoConteo(n) {
  const g = tienda.grupo !== 'todo' ? ` en ${nombreGrupo(tienda.grupo)}` : '';
  const q = tienda.q.trim() ? ` para «${tienda.q.trim()}»` : '';
  return `${plural(n, 'producto', 'productos')}${g}${q}`;
}

function chipsHTML() {
  const opciones = [{ id: 'todo', nombre: 'Todo', n: PRODUCTOS.length }, ...GRUPOS.map(g => ({ ...g, n: PRODUCTOS.filter(p => p.grupo === g.id).length }))];
  return opciones.map(c => `<button type="button" class="chip" data-grupo="${c.id}" aria-pressed="${tienda.grupo === c.id}">${esc(c.nombre)} <small>${c.n}</small></button>`).join('');
}
function syncChips() { $$('[data-grupo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.grupo === tienda.grupo))); }

function asignarTamanos(lista) {
  const n = lista.length;
  if (n <= 2) return lista.map(() => '');
  const clases = lista.map((_, i) => (i === 0 ? 'tile--grande' : ''));
  let faltan = (4 - ((n + 3) % 4)) % 4;
  const orden = lista.map((_, i) => i).slice(1).sort((a, b) => Number(!!lista[b].ancho) - Number(!!lista[a].ancho));
  for (const i of orden) { if (!faltan) break; clases[i] = 'tile--ancha'; faltan--; }
  return clases;
}

function stickerHTML(p) {
  return `<span class="tile-sticker">${p.variantes ? '<small>desde</small>' : ''}<b>${formatearPrecio(precioDesde(p))}</b><small>${esc(unidadDe(p))}</small></span>`;
}

function tileHTML(p, clase) {
  const qty = p.qtyDefault || 1;
  const acciones = p.porLetra
    ? `<button type="button" class="prod-nombre" data-nombre="${p.pieza}">${ICON.pencil}<span>Escribir el nombre</span></button>`
    : `<div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="-1" aria-label="Restar uno">${ICON.minus}</button><output aria-live="polite">${qty}</output><button type="button" data-step="1" aria-label="Sumar uno">${ICON.plus}</button></div>`
      + `<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.cartPlus}</button>`
      + `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`;
  return `<article class="tile ${clase}" data-id="${p.id}" data-animate="pop" style="opacity:0;transform:scale(.92)">
    <div class="tile-media">
      <button type="button" class="tile-open" data-open="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"></button>
      ${p.badge ? `<span class="tile-badge">${esc(p.badge)}</span>` : ''}
      ${stickerHTML(p)}
      <div class="tile-label"><span class="tile-grupo">${esc(p.tipo)}</span><h3 class="tile-name">${esc(p.nombre)}</h3></div>
    </div>
    <div class="tile-actions prod-actions">${acciones}</div>
  </article>`;
}

function renderTienda(animar = true) {
  const cont = $('#catalogo');
  if (!cont) return;
  const lista = filtrar();
  const visibles = lista.slice(0, tienda.page * PAGE);
  const clases = asignarTamanos(visibles);
  cont.classList.toggle('is-pocos', visibles.length === 2);
  cont.classList.toggle('is-uno', visibles.length === 1);
  cont.innerHTML = visibles.map((p, i) => tileHTML(p, clases[i])).join('');
  $('#tiendaVacio').hidden = lista.length > 0;
  if (!lista.length) $('#tiendaVacioQ').textContent = `«${tienda.q.trim()}»`;
  $('#verMas').hidden = visibles.length >= lista.length;
  $('#tiendaCount').textContent = textoConteo(lista.length);
  syncChips();
  if (animar) revelarNuevos(cont);
  refrescarST();
}

function platoHTML(p) {
  const add = p.porLetra
    ? `<button type="button" class="plato-add plato-add--nombre" data-nombre="${p.pieza}" aria-label="Escribir el nombre para el ${esc(p.nombre.toLowerCase())}">${ICON.pencil}</button>`
    : `<button type="button" class="plato-add" data-add="${p.id}" aria-label="Sumar ${esc(p.nombre)} al pedido">${ICON.plus}</button>`;
  return `<article class="plato" data-animate="up" style="opacity:0;transform:translateY(34px)">
    <div class="plato-txt">
      <span class="plato-tipo">${esc(p.tipo)}${p.badge ? ' · ' + esc(p.badge) : ''}</span>
      <h4 class="plato-name"><button type="button" class="plato-open" data-open="${p.id}">${esc(p.nombre)}</button></h4>
      <p class="plato-desc">${esc(p.desc)}</p>
      <p class="plato-precio">${p.variantes ? '<small>desde </small>' : ''}${formatearPrecio(precioDesde(p))} <small>${esc(unidadDe(p))}</small></p>
    </div>
    <div class="plato-media"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}">${add}</div>
  </article>`;
}

function renderMenu(animar = true) {
  const cont = $('#menuLista');
  if (!cont) return;
  const lista = filtrar();
  const grupos = tienda.grupo === 'todo' ? GRUPOS : GRUPOS.filter(g => g.id === tienda.grupo);
  cont.innerHTML = grupos.map(g => {
    const items = lista.filter(p => p.grupo === g.id);
    if (!items.length) return '';
    return `<div class="menu-bloque" id="bloque-${g.id}"><h3>${esc(g.nombre)} <small>${items.length}</small></h3><div class="platos">${items.map(platoHTML).join('')}</div></div>`;
  }).join('');
  $('#menuVacio').hidden = lista.length > 0;
  if (!lista.length) $('#menuVacioQ').textContent = `«${tienda.q.trim()}»`;
  $('#menuCount').textContent = textoConteo(lista.length);
  syncChips();
  if (animar) revelarNuevos(cont);
  refrescarST();
}

function renderCatalogos(animar = true) { renderTienda(animar); renderMenu(animar); }

function filtrarCatalogo(grupo) {
  tienda.grupo = GRUPOS.some(g => g.id === grupo) ? grupo : 'todo';
  tienda.q = '';
  tienda.page = 1;
  $$('#tiendaBuscar, #menuBuscar').forEach(i => { i.value = ''; });
  renderCatalogos();
}

function agregar(p, qty, extra = {}, abrir = false) {
  if (!p) return;
  if (p.porLetra && !contarLetras(extra.texto)) { abrirPersonalizador(p.pieza); return; }
  Cart.add(p, qty, extra);
  const detalle = extra.texto ? ` con «${extra.texto.trim()}»` : '';
  showToast(qty > 1 ? `Sumaste ${qty} × ${p.nombre}${detalle}` : `Sumaste ${p.nombre}${detalle}`);
  if (abrir) openCartDrawer();
}

function initBuscador(input) {
  if (!input) return;
  let t = null;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { tienda.q = input.value; tienda.page = 1; renderCatalogos(); }, 160);
  });
}

function initChips() {
  $$('[data-chips]').forEach(c => {
    c.innerHTML = chipsHTML();
    c.addEventListener('click', e => {
      const b = e.target.closest('[data-grupo]');
      if (!b) return;
      tienda.grupo = b.dataset.grupo;
      tienda.page = 1;
      renderCatalogos();
    });
  });
}

function initTienda() {
  const cont = $('#catalogo');
  if (!cont) return;
  renderTienda(false);
  initBuscador($('#tiendaBuscar'));
  $('#tiendaLimpiar').addEventListener('click', () => { tienda.q = ''; tienda.grupo = 'todo'; $('#tiendaBuscar').value = ''; renderTienda(); });
  $('#verMas').addEventListener('click', () => { tienda.page += 1; renderTienda(); });
  cont.addEventListener('click', e => {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const p = getProducto(tile.dataset.id);
    const out = $('output', tile);
    const st = e.target.closest('[data-step]');
    if (st && out) { out.textContent = clamp((parseInt(out.textContent, 10) || 1) + Number(st.dataset.step), 1, 999); return; }
    const qty = clamp(parseInt(out?.textContent, 10) || 1, 1, 999);
    if (e.target.closest('[data-add]')) { agregar(p, qty); return; }
    if (e.target.closest('[data-buy]')) agregar(p, qty, {}, true);
  });
}

function initMenu() {
  const cont = $('#menuLista');
  if (!cont) return;
  renderMenu(false);
  initBuscador($('#menuBuscar'));
  $('#menuLimpiar').addEventListener('click', () => { tienda.q = ''; tienda.grupo = 'todo'; $('#menuBuscar').value = ''; renderMenu(); });
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const p = getProducto(b.dataset.add);
    agregar(p, p?.qtyDefault || 1);
  });
}

function initPedidoBar() {
  const bar = $('#pedidoBar');
  if (!bar) return;
  const sync = () => {
    const n = Cart.count();
    bar.hidden = n === 0;
    $('#pedidoN').textContent = plural(n, 'producto', 'productos');
    $('#pedidoTotal').textContent = formatearPrecio(Cart.total());
  };
  $('#pedidoBtn').addEventListener('click', openCartDrawer);
  document.addEventListener('cart:updated', sync);
  sync();
}

function focusables(cont) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', cont).filter(el => el.offsetParent !== null || el === document.activeElement);
}
function atraparFoco(e, cont) {
  const f = focusables(cont);
  if (!f.length) return;
  const first = f[0]; const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let qvOpener = null;
function openQuickView(id, opener) {
  const p = getProducto(id);
  const wrap = $('#quickView');
  if (!p || !wrap) return;
  qvOpener = opener || document.activeElement;
  const panel = $('#qvPanel');
  let variante = p.variantes ? p.variantes[0].id : '';
  let qty = p.qtyDefault || 1;
  const rel = PRODUCTOS.filter(x => x.grupo === p.grupo && x.id !== p.id).concat(PRODUCTOS.filter(x => x.grupo !== p.grupo)).slice(0, 3);
  const varTitulo = p.id === 'tarjetas' ? 'Cantidad de tarjetas' : 'Talle';
  panel.innerHTML = `
    <button type="button" class="qv-close" data-close-qv aria-label="Cerrar">${ICON.x}</button>
    <div class="qv-media"><img src="${p.img}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"></div>
    <div class="qv-info">
      <p class="qv-grupo">${esc(nombreGrupo(p.grupo))} · ${esc(p.tipo)}</p>
      <h2 id="qvTitle">${esc(p.nombre)}</h2>
      <p class="qv-precio"><b id="qvPrecio"></b><small id="qvUnidad"></small></p>
      ${p.variantes ? `<fieldset class="nf-group"><legend>${varTitulo}</legend><div class="seg">${p.variantes.map((v, i) => `<label class="seg-opt"><input type="radio" name="qvVar" value="${v.id}"${i === 0 ? ' checked' : ''}><span>${esc(v.label)} · ${formatearPrecio(v.precio)}</span></label>`).join('')}</div></fieldset>` : ''}
      <p class="qv-desc">${esc(p.desc)}</p>
      <ul class="qv-incluye">${p.incluye.map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>
      ${p.personalizable ? `<div class="nf-field"><label for="qvTexto">${p.porLetra ? '¿Qué nombre va?' : 'Nombre para personalizar (opcional)'}</label><input type="text" id="qvTexto" maxlength="${p.id === 'tarjetas' ? 22 : 16}" placeholder="${p.id === 'tarjetas' ? 'Lola Dulces' : 'Sofi'}" autocomplete="off" aria-describedby="qvAyuda"><small id="qvAyuda">${p.porLetra ? 'Va un banderín por letra: el precio se arma solo.' : 'Si lo dejás vacío, lo definimos por WhatsApp.'}</small></div>` : ''}
      <div class="qv-actions">
        <div class="stepper" role="group" aria-label="Cantidad"><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICON.minus}</button><output id="qvQty" aria-live="polite">${qty}</output><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICON.plus}</button></div>
        <button type="button" class="prod-add" id="qvAdd">Agregar al carrito</button>
        <button type="button" class="prod-buy" id="qvBuy">Comprar ahora</button>
      </div>
      ${p.pieza ? `<button type="button" class="btn btn--ghost qv-probar" data-nombre="${p.pieza}">${ICON.pencil}Ver cómo queda con tu nombre</button>` : ''}
      <a class="qv-wsp" id="qvWsp" href="https://wa.me/${WSP}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
      <div class="qv-rel"><p class="qv-rel-title">También te puede gustar</p><div class="qv-rel-list">${rel.map(r => `<button type="button" class="rel-item" data-rel="${r.id}"><img src="${r.img}" width="${r.w}" height="${r.h}" alt=""><b>${esc(r.nombre)}</b><span>${r.variantes ? 'desde ' : ''}${formatearPrecio(precioDesde(r))}</span></button>`).join('')}</div></div>
    </div>`;

  const texto = () => $('#qvTexto')?.value.trim() || '';
  const sync = () => {
    const letras = contarLetras(texto());
    $('#qvPrecio').textContent = formatearPrecio(p.porLetra && letras ? letras * p.precio : precioUnidad(p, variante, texto()) || p.precio);
    $('#qvUnidad').textContent = p.porLetra ? (letras ? `${plural(letras, 'letra', 'letras')} × ${formatearPrecio(p.precio)}` : 'por letra') : unidadDe(p);
    const bloquear = p.porLetra && !letras;
    $('#qvAdd').disabled = bloquear;
    $('#qvBuy').disabled = bloquear;
    const v = varianteDe(p, variante);
    $('#qvWsp').href = wspLink([`¡Hola DC! Quiero consultar por: ${p.nombre}${v ? ' (' + v.label + ')' : ''}.`, `Cantidad: ${qty}`, texto() ? `Nombre: ${texto()}` : '']);
  };
  sync();
  panel.oninput = e => { if (e.target.name === 'qvVar') variante = e.target.value; sync(); };
  panel.onclick = e => {
    const st = e.target.closest('[data-qv-step]');
    if (st) { qty = clamp(qty + Number(st.dataset.qvStep), 1, 999); $('#qvQty').textContent = qty; sync(); return; }
    if (e.target.closest('#qvAdd')) { agregar(p, qty, { variante: p.variantes ? variante : '', texto: texto() }); return; }
    if (e.target.closest('#qvBuy')) { closeQuickView(false); agregar(p, qty, { variante: p.variantes ? variante : '', texto: texto() }, true); return; }
    const r = e.target.closest('[data-rel]');
    if (r) { openQuickView(r.dataset.rel, qvOpener); return; }
    if (e.target.closest('[data-nombre]')) closeQuickView(false);
  };

  if (wrap.hidden) {
    wrap.hidden = false;
    document.body.classList.add('no-scroll');
  }
  panel.scrollTop = 0;
  const url = new URL(location.href); url.searchParams.set('producto', p.id); window.history.replaceState(null, '', url);
  setTimeout(() => $('.qv-close', panel)?.focus(), 40);
}

function closeQuickView(devolverFoco = true) {
  const wrap = $('#quickView');
  if (!wrap || wrap.hidden) return;
  wrap.hidden = true;
  if (!$('#cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  const url = new URL(location.href); url.searchParams.delete('producto'); window.history.replaceState(null, '', url);
  if (devolverFoco && qvOpener && document.contains(qvOpener)) qvOpener.focus({ preventScroll: true });
}

function initQuickView() {
  const wrap = $('#quickView');
  if (!wrap) return;
  wrap.addEventListener('click', e => { if (e.target.closest('[data-close-qv]')) closeQuickView(); });
  wrap.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeQuickView(); }
    if (e.key === 'Tab') atraparFoco(e, $('#qvPanel'));
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) openQuickView(slug);
}

function metaLinea(p, l) {
  const v = varianteDe(p, l.variante);
  const precio = p.porLetra ? `${plural(contarLetras(l.texto), 'letra', 'letras')} × ${formatearPrecio(p.precio)}` : `${formatearPrecio(precioLinea(l))} ${esc(unidadDe(p))}`;
  const primera = [v ? esc(v.label) : '', precio].filter(Boolean).join(' · ');
  const extras = [l.estilo ? `letra ${esc(ESTILOS[l.estilo]?.nombre.toLowerCase() || l.estilo)}` : '', l.color ? esc(nombreColor(l.color).toLowerCase()) : ''].filter(Boolean).join(' · ');
  const nombre = l.texto ? `Con <b>«${esc(l.texto)}»</b>${extras ? ' · ' + extras : ''}` : (p.personalizable ? 'El nombre lo definimos por WhatsApp' : '');
  return [primera, nombre].filter(Boolean).join('<br>');
}

function resumenWsp(items) {
  return items.map(l => {
    const p = getProducto(l.id); const v = varianteDe(p, l.variante);
    return `• ${l.qty} × ${p.nombre}${v ? ' (' + v.label + ')' : ''}${l.texto ? ' con «' + l.texto + '»' : ''} = ${formatearPrecio(precioLinea(l) * l.qty)}`;
  });
}

function renderCarrito() {
  const body = $('#cartItems');
  if (!body) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  $('#cartEmpty').hidden = items.length > 0;
  $('#cartFoot').hidden = !items.length;
  body.innerHTML = items.map((l, n) => {
    const p = getProducto(l.id);
    return `<div class="cart-line" style="--d:${Math.min(n * 0.06, 0.4)}s" data-key="${esc(claveLinea(l))}">
      <img src="${p.img}" width="${p.w}" height="${p.h}" alt="">
      <div>
        <h3>${esc(p.nombre)}</h3>
        <p class="cart-line-meta">${metaLinea(p, l)}</p>
        <div class="stepper" role="group" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-line-step="-1" aria-label="Restar uno">${ICON.minus}</button><output aria-live="polite">${l.qty}</output><button type="button" data-line-step="1" aria-label="Sumar uno">${ICON.plus}</button></div>
      </div>
      <div class="cart-line-right"><span class="cart-line-price">${formatearPrecio(precioLinea(l) * l.qty)}</span><button type="button" class="cart-remove" data-line-remove aria-label="Quitar ${esc(p.nombre)}">${ICON.trash}</button></div>
    </div>`;
  }).join('');
  const total = Cart.total();
  $('#cartTotal').textContent = formatearPrecio(total);
  $('#cartWsp').href = wspLink(['¡Hola DC! Te paso mi pedido desde la web:', ...resumenWsp(items), `Total: ${formatearPrecio(total)}`]);
}

let drawerOpener = null;
function openCartDrawer() {
  const drawer = $('#cartDrawer');
  if (!drawer) return;
  drawerOpener = document.activeElement;
  renderCarrito();
  drawer.hidden = false;
  void drawer.offsetWidth;
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  setTimeout(() => $('.drawer-close', drawer)?.focus(), 60);
}
function closeCartDrawer() {
  const drawer = $('#cartDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  if ($('#quickView')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!drawer.classList.contains('open')) drawer.hidden = true; }, 420);
  if (drawerOpener && document.contains(drawerOpener)) drawerOpener.focus({ preventScroll: true });
}

function initCarrito() {
  const drawer = $('#cartDrawer');
  if (!drawer) return;
  $('#headerCart')?.addEventListener('click', openCartDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { closeCartDrawer(); return; }
    const line = e.target.closest('.cart-line');
    if (!line) return;
    const key = line.dataset.key;
    const st = e.target.closest('[data-line-step]');
    if (st) { const it = Cart.get().find(i => claveLinea(i) === key); if (it) Cart.setQty(key, it.qty + Number(st.dataset.lineStep)); return; }
    if (e.target.closest('[data-line-remove]')) {
      const it = Cart.get().find(i => claveLinea(i) === key);
      Cart.remove(key);
      if (it) showToast(`Sacaste ${getProducto(it.id)?.nombre || 'el producto'} del pedido`);
    }
  });
  drawer.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeCartDrawer();
    if (e.key === 'Tab') atraparFoco(e, $('.drawer-panel', drawer));
  });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(); });
  $('#checkoutBtn').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (!reduceMotion && typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 70, origin: { x: 0.8, y: 0.85 }, colors: ['#00FFFF', '#2563EB', '#16A34A', '#FFC933'], disableForReducedMotion: true });
    }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initWspLinks() {
  $$('[data-wsp-msg]').forEach(a => { a.href = wspLink([a.dataset.wspMsg]); });
}

function dibujarGuirnalda(svg, texto, colores, opciones = {}) {
  const { estilo = ESTILOS.redonda, animar = false, previas = null, maxAncho = 110, caida = 0.2 } = opciones;
  const rect = svg.getBoundingClientRect();
  const W = Math.max(260, Math.round(rect.width || 600));
  const H = Math.max(110, Math.round(rect.height || 180));
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const letras = [...String(texto).toUpperCase()];
  const n = Math.max(1, letras.length);
  const margen = Math.min(36, W * 0.05);
  const pw = Math.min(maxAncho, (W - margen * 2) / (n * 1.08));
  const ph = pw * 1.2;
  const top = 6;
  const sag = Math.max(10, Math.min(H * caida, W * 0.06));
  const yEn = x => top + sag * (1 - Math.pow((x - W / 2) / (W / 2), 2));
  const pend = x => (-2 * sag * (x - W / 2)) / Math.pow(W / 2, 2);
  const inicio = W / 2 - (n * pw * 1.08) / 2 + pw * 0.54;
  const cordon = `M0 ${top} Q${W / 2} ${top + sag * 2} ${W} ${top}`;
  let html = `<path class="gl-halo" d="${cordon}"/><path class="gl-cordon" d="${cordon}"/>`;
  let ci = 0;
  letras.forEach((l, i) => {
    if (!l.trim()) return;
    const x = inicio + i * pw * 1.08;
    const y = yEn(x);
    const ang = (Math.atan(pend(x)) * 180) / Math.PI;
    const fill = colores[ci % colores.length];
    ci += 1;
    const nueva = animar && (!previas || previas[i] !== l);
    html += `<g class="pn" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(2)})"><g class="${nueva ? 'pn-in' : 'pn-quieta'}" style="--i:${i}"><g class="pn-sw"><path class="pn-shape" d="M${(-pw / 2).toFixed(1)} 0H${(pw / 2).toFixed(1)}L0 ${ph.toFixed(1)}Z" fill="${fill}" stroke="#0E1B3D" stroke-width="${Math.max(1, pw * 0.025).toFixed(2)}"/><text class="pn-letra" x="0" y="${(ph * 0.34).toFixed(1)}" font-size="${(pw * 0.5).toFixed(1)}" fill="${tintaSobre(fill)}" style="font-family:${estilo.family};font-weight:${estilo.weight}">${esc(l)}</text></g></g></g>`;
  });
  svg.innerHTML = html;
  return letras;
}

function initGuirnaldas() {
  const svgs = $$('svg[data-guirnalda]');
  if (!svgs.length) return;
  const mq = window.matchMedia('(max-width: 700px)');
  const colores = COMBOS[0].colores;
  const pintar = animar => svgs.forEach(svg => {
    const texto = mq.matches && svg.dataset.guirnaldaCorta ? svg.dataset.guirnaldaCorta : svg.dataset.guirnalda;
    dibujarGuirnalda(svg, texto, colores, { animar: animar && !reduceMotion, maxAncho: 96, caida: 0.34 });
  });
  const listo = () => pintar(true);
  if (document.fonts?.ready) document.fonts.ready.then(listo); else listo();
  let t = null;
  let ancho = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === ancho) return;
    ancho = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(() => pintar(false), 180);
  }, { passive: true });
}

const nombreState = { pieza: 'banderin', texto: 'Sofi', linea: 'Tortas y mesas dulces', estilo: 'redonda', combo: 'fiesta', tinta: 'azul', talle: 'nino', pack: '100', cant: 1 };
let letrasPrevias = null;

function tamanoTexto(len, escala) {
  const i = len <= 4 ? 0 : len <= 6 ? 1 : len <= 9 ? 2 : len <= 12 ? 3 : 4;
  return escala[i];
}

function ajustarAncho(el, maxW) {
  el.removeAttribute('textLength');
  el.removeAttribute('lengthAdjust');
  try {
    const host = el.tagName.toLowerCase() === 'textpath' ? el.parentNode : el;
    if (host.getComputedTextLength() > maxW) { el.setAttribute('textLength', maxW); el.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
  } catch { /* sin medición el texto queda con su tamaño base */ }
}

function aplicarEstilo(el, est) {
  el.style.fontFamily = est.family;
  el.style.fontWeight = est.weight;
  el.style.letterSpacing = `${est.spacing}em`;
}

function iniciales(t) {
  return t.split(/\s+/).filter(Boolean).slice(0, 2).map(w => [...w][0]).join('').toUpperCase();
}

function coloresHTML() {
  const st = nombreState;
  if (st.pieza === 'banderin') {
    return COMBOS.map(c => `<label class="sw"><input type="radio" name="color" value="${c.id}"${c.id === st.combo ? ' checked' : ''}><span class="sw-dots" aria-hidden="true">${c.colores.map(h => `<i style="background:${h}"></i>`).join('')}</span><span>${esc(c.nombre)}</span></label>`).join('');
  }
  return TINTAS.map(c => `<label class="sw"><input type="radio" name="color" value="${c.id}"${c.id === st.tinta ? ' checked' : ''}><span class="sw-dots" aria-hidden="true"><i style="background:${c.hex}"></i></span><span>${esc(c.nombre)}</span></label>`).join('');
}

function calcularNombre() {
  const st = nombreState;
  const p = getProducto(PIEZA_PRODUCTO[st.pieza]);
  const letras = contarLetras(st.texto);
  if (st.pieza === 'banderin') {
    const unidad = letras * p.precio;
    return { p, variante: '', unidad, total: unidad * st.cant, detalle: `${plural(letras, 'letra', 'letras')} × ${formatearPrecio(p.precio)}${st.cant > 1 ? ` × ${plural(st.cant, 'banderín', 'banderines')}` : ''}` };
  }
  if (st.pieza === 'taza') {
    return { p, variante: '', unidad: p.precio, total: p.precio * st.cant, detalle: `${plural(st.cant, 'taza', 'tazas')} × ${formatearPrecio(p.precio)}` };
  }
  const variante = st.pieza === 'remera' ? st.talle : st.pack;
  const v = varianteDe(p, variante);
  const detalle = st.pieza === 'remera'
    ? `${plural(st.cant, 'remera', 'remeras')} ${v.corto} × ${formatearPrecio(v.precio)}`
    : `${plural(st.cant, 'pack', 'packs')} ${v.corto} × ${formatearPrecio(v.precio)}`;
  return { p, variante, unidad: v.precio, total: v.precio * st.cant, detalle };
}

function textoNombre() {
  const st = nombreState;
  return st.pieza === 'tarjeta' && st.linea.trim() ? `${st.texto.trim()} / ${st.linea.trim()}` : st.texto.trim();
}

function renderNombre(animarLetras = false) {
  const app = $('#nombreApp');
  if (!app) return;
  const st = nombreState;
  const est = ESTILOS[st.estilo];
  const tinta = TINTAS.find(t => t.id === st.tinta)?.hex || '#2563EB';
  const stage = $('.nombre-stage', app);
  stage.dataset.pieza = st.pieza;
  $$('[data-solo]', app).forEach(el => {
    const solo = el.dataset.solo;
    el.hidden = !(solo === st.pieza || solo === 'unidades');
  });
  const input = $('#nfTexto');
  const max = st.pieza === 'tarjeta' ? 22 : st.pieza === 'remera' ? 12 : 16;
  input.maxLength = max;
  if (input.value.length > max) { input.value = input.value.slice(0, max); st.texto = input.value; }
  $('#nfTextoLabel').textContent = st.pieza === 'tarjeta' ? 'Nombre de tu marca' : '¿Qué nombre va?';
  const letras = contarLetras(st.texto);
  const vacio = letras === 0;
  input.setAttribute('aria-invalid', String(vacio));
  const ayuda = $('#nfTextoAyuda');
  ayuda.textContent = vacio ? 'Escribí al menos una letra para ver la vista previa.' : `Hasta ${max} caracteres, con espacios.`;
  ayuda.classList.toggle('is-error', vacio);
  const colores = $('#nfColores');
  const tipoColores = st.pieza === 'banderin' ? 'combos' : 'tintas';
  if (colores.dataset.tipo !== tipoColores) { colores.innerHTML = coloresHTML(); colores.dataset.tipo = tipoColores; }
  $('#nfColorLegend').textContent = st.pieza === 'banderin' ? 'Colores del banderín' : 'Color de la impresión';
  $('#nfCant').textContent = st.cant;

  const texto = st.texto.trim();
  const mostrar = est.upper ? texto.toUpperCase() : texto;
  let dato;
  if (st.pieza === 'banderin') {
    const combo = COMBOS.find(c => c.id === st.combo) || COMBOS[0];
    letrasPrevias = dibujarGuirnalda($('#prevBanderin'), vacio ? '' : texto, combo.colores, { estilo: est, animar: animarLetras && !reduceMotion, previas: letrasPrevias, maxAncho: 132, caida: 0.1 });
    dato = vacio ? 'Escribí un nombre y armamos el banderín.' : `<b>${esc(texto.toUpperCase())}</b> · ${plural(letras, 'banderín', 'banderines')} · ${metros(letras)} m de guirnalda aprox.`;
  } else if (st.pieza === 'taza') {
    const path = $('#prevTazaPath'); const txt = $('#prevTazaTxt');
    path.textContent = mostrar;
    txt.setAttribute('fill', tinta);
    txt.style.fontSize = `${tamanoTexto([...mostrar].length, [190, 160, 124, 98, 82])}px`;
    aplicarEstilo(txt, est);
    ajustarAncho(path, 520);
    dato = `<b>Taza de 11 oz</b> · letra ${est.nombre.toLowerCase()} en ${nombreColor(st.tinta).toLowerCase()}`;
  } else if (st.pieza === 'remera') {
    const txt = $('#prevRemeraTxt');
    txt.textContent = mostrar;
    txt.setAttribute('fill', tinta);
    txt.style.fontSize = `${tamanoTexto([...mostrar].length, [170, 140, 108, 88, 76])}px`;
    aplicarEstilo(txt, est);
    ajustarAncho(txt, 440);
    dato = `<b>Remera ${varianteDe(getProducto('remera-sublimada'), st.talle).corto}</b> · estampa al frente en ${nombreColor(st.tinta).toLowerCase()}`;
  } else {
    const nom = $('#prevCardName'); const lin = $('#prevCardLine');
    nom.textContent = mostrar;
    nom.setAttribute('fill', tinta);
    nom.style.fontSize = `${tamanoTexto([...mostrar].length, [96, 92, 84, 70, 58])}px`;
    aplicarEstilo(nom, est);
    ajustarAncho(nom, 610);
    lin.textContent = st.linea.trim();
    ajustarAncho(lin, 610);
    $('#prevCardDot').setAttribute('fill', tinta);
    $('#prevCardBack').setAttribute('fill', tinta);
    const mono = $('#prevCardMono');
    mono.textContent = iniciales(texto) || 'DC';
    mono.setAttribute('fill', tintaSobre(tinta));
    dato = `<b>9 × 5 cm</b> · frente con tu nombre y dorso ${nombreColor(st.tinta).toLowerCase()} con tus iniciales`;
  }
  $('#nombreDato').innerHTML = dato;

  const c = calcularNombre();
  $('#nfTotal').textContent = formatearPrecio(vacio ? 0 : c.total);
  $('#nfDetalle').textContent = vacio ? 'Falta el nombre' : c.detalle;
  $('#nfAgregar').disabled = vacio;
  const piezaTxt = { banderin: 'Banderín', taza: 'Taza', remera: 'Remera', tarjeta: 'Tarjetas de presentación' }[st.pieza];
  const colorTxt = st.pieza === 'banderin' ? `colores ${nombreColor(st.combo)}` : `impresión en ${nombreColor(st.tinta).toLowerCase()}`;
  const v = c.variante ? varianteDe(c.p, c.variante) : null;
  $('#nfWsp').href = wspLink([
    '¡Hola DC! Armé esto en «Con tu nombre»:',
    `Pieza: ${piezaTxt}${v ? ' (' + v.label + ')' : ''}`,
    texto ? `Nombre: ${st.pieza === 'banderin' ? texto.toUpperCase() : texto}` : '',
    st.pieza === 'tarjeta' && st.linea.trim() ? `Segunda línea: ${st.linea.trim()}` : '',
    `Letra ${est.nombre.toLowerCase()} · ${colorTxt}`,
    `Cantidad: ${st.cant}`,
    vacio ? '' : `Total estimado: ${formatearPrecio(c.total)}`,
  ]);
}

function abrirPersonalizador(pieza) {
  const app = $('#nombreApp');
  if (!app) return;
  if (PIEZA_PRODUCTO[pieza]) {
    nombreState.pieza = pieza;
    const radio = $(`input[name="pieza"][value="${pieza}"]`, app);
    if (radio) radio.checked = true;
    nombreState.cant = 1;
    renderNombre(true);
  }
  const sec = $('#con-tu-nombre');
  sec?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => $('#nfTexto')?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
}

function initNombre() {
  const app = $('#nombreApp');
  if (!app) return;
  const form = $('#nombreForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const st = nombreState;
    if (!contarLetras(st.texto)) { $('#nfTexto').focus(); return; }
    const c = calcularNombre();
    agregar(c.p, st.cant, { variante: c.variante, texto: textoNombre(), estilo: st.estilo, color: st.pieza === 'banderin' ? st.combo : st.tinta });
  });
  form.addEventListener('input', e => {
    const t = e.target;
    if (t.id === 'nfTexto') { nombreState.texto = t.value; renderNombre(true); return; }
    if (t.id === 'nfLinea') { nombreState.linea = t.value; renderNombre(); return; }
    if (t.name === 'pieza') { nombreState.pieza = t.value; nombreState.cant = 1; letrasPrevias = null; renderNombre(true); return; }
    if (t.name === 'estilo') { nombreState.estilo = t.value; letrasPrevias = null; renderNombre(true); return; }
    if (t.name === 'color') {
      if (nombreState.pieza === 'banderin') { nombreState.combo = t.value; letrasPrevias = null; } else nombreState.tinta = t.value;
      renderNombre(true);
      return;
    }
    if (t.name === 'talle') { nombreState.talle = t.value; renderNombre(); return; }
    if (t.name === 'pack') { nombreState.pack = t.value; renderNombre(); }
  });
  form.addEventListener('click', e => {
    const st = e.target.closest('[data-nf-step]');
    if (st) { nombreState.cant = clamp(nombreState.cant + Number(st.dataset.nfStep), 1, 99); renderNombre(); }
  });
  let t = null;
  let ancho = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === ancho) return;
    ancho = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(() => { letrasPrevias = null; renderNombre(false); }, 180);
  }, { passive: true });
  renderNombre(false);
  if (document.fonts?.ready) document.fonts.ready.then(() => { letrasPrevias = null; renderNombre(false); });
}

function initVitrina() {
  const sec = $('.vitrina');
  if (!sec) return;
  const items = $$('.vit-item', sec);
  const track = $('.vitrina-track', sec);
  const vp = $('.vitrina-vp', sec);
  const numero = $('.vitrina-i', sec);
  const tipo = $('.vit-tipo', sec);
  const nombre = $('.vit-nombre', sec);
  const precio = $('.vit-precio', sec);
  const barra = $('.vit-barra i', sec);
  const btnAdd = $('#vitAgregar');
  const btnVer = $('#vitVer');
  if (!items.length || !btnAdd) return;
  let activo = -1;
  const pintarDatos = i => {
    if (i === activo) return;
    activo = i;
    const p = getProducto(items[i].dataset.producto);
    if (!p) return;
    items.forEach((it, k) => it.classList.toggle('is-activa', k === i));
    numero.textContent = String(i + 1).padStart(2, '0');
    tipo.textContent = p.tipo;
    nombre.textContent = p.nombre;
    precio.innerHTML = `${p.variantes ? '<small>desde </small>' : ''}${formatearPrecio(precioDesde(p))} <small>${esc(unidadDe(p))}</small>`;
    btnAdd.textContent = p.porLetra ? 'Escribir el nombre' : 'Sumar al carrito';
    btnAdd.dataset.producto = p.id;
  };
  btnAdd.addEventListener('click', () => {
    const p = getProducto(btnAdd.dataset.producto);
    if (!p) return;
    if (p.porLetra) abrirPersonalizador(p.pieza);
    else agregar(p, p.qtyDefault || 1);
  });
  btnVer?.addEventListener('click', () => openQuickView(btnAdd.dataset.producto, btnVer));
  pintarDatos(0);
  if (reduceMotion) return;
  sec.classList.add('js-on');
  let centros = [];
  const medir = () => { centros = items.map(it => it.offsetLeft + it.offsetWidth / 2); };
  const offset = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const progreso = () => {
    const r = sec.getBoundingClientRect();
    const off = offset();
    const total = r.height - (window.innerHeight - off);
    return total > 0 ? clamp01((off - r.top) / total) : 0;
  };
  const pintar = p => {
    if (!centros.length) medir();
    const pos = p * (items.length - 1);
    const i0 = Math.min(items.length - 2, Math.floor(pos));
    const centro = lerp(centros[i0], centros[i0 + 1], pos - i0);
    track.style.transform = `translate3d(${(vp.clientWidth / 2 - centro).toFixed(1)}px, 0, 0)`;
    barra.style.transform = `scaleX(${p.toFixed(3)})`;
    pintarDatos(Math.round(pos));
  };
  let pedido = false;
  const tick = () => { pedido = false; pintar(progreso()); };
  const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(tick); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', () => { medir(); pedir(); }, { passive: true });
  window.addEventListener('load', () => { medir(); pintar(progreso()); });
  medir();
  pintar(progreso());
}

function initMapa() {
  const el = $('#mapa');
  if (!el) return;
  const crear = () => {
    if (typeof L === 'undefined' || el.dataset.listo) return;
    el.dataset.listo = '1';
    const pos = [-31.4167, -64.1833];
    const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false }).setView(pos, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circle(pos, { radius: 420, color: '#2563EB', weight: 2, fillColor: '#00FFFF', fillOpacity: 0.2 }).addTo(mapa);
    const icono = L.divIcon({ className: 'mapa-pin', html: '<span class="pin"><b>DC</b></span>', iconSize: [50, 56], iconAnchor: [25, 56] });
    L.marker(pos, { icon: icono, keyboard: false, title: 'DC · Córdoba Capital' }).addTo(mapa);
    setTimeout(() => mapa.invalidateSize(), 400);
  };
  if (!('IntersectionObserver' in window)) { window.addEventListener('load', crear); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
  window.addEventListener('load', () => { if (el.getBoundingClientRect().top < window.innerHeight + 400) crear(); });
}

function initHero() {
  const title = $('[data-hero-title]');
  if (!title) return;
  const palabras = title.textContent.trim().split(/\s+/);
  title.innerHTML = palabras.map(w => `<span class="w"><span class="w-in">${esc(w)}</span></span>`).join(' ');
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const img = $('.hero-media img, .portada-foto img');
  if (img) tl.from(img, { scale: 1.08, duration: 1.4 }, 0);
  tl.from($$('.w-in', title), { yPercent: 115, duration: 0.9, ease: 'back.out(1.5)', stagger: 0.06 }, 0.15);
  tl.from($$('[data-hero]'), { y: 26, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.3);
  if (typeof ScrollTrigger !== 'undefined' && $('.hero--pantalla')) {
    gsap.to('.hero-media img', { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--pantalla', start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function initClicksGlobales() {
  document.addEventListener('click', e => {
    const f = e.target.closest('[data-filtro]');
    if (f) filtrarCatalogo(f.dataset.filtro);
    const n = e.target.closest('[data-nombre]');
    if (n) { e.preventDefault(); abrirPersonalizador(n.dataset.nombre); return; }
    const o = e.target.closest('[data-open]');
    if (o) openQuickView(o.dataset.open, o);
  });
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

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const nuevos = $$('[data-animate]:not(.in)', cont);
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.06, 0.48)}s`; });
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach(el => el.classList.add('in'))));
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

limpiarCarrito();
initChips();
initTienda();
initMenu();
initNombre();
initGuirnaldas();
initReveals();
initHero();
initQuickView();
initCarrito();
initFloats();
initPedidoBar();
initVitrina();
initMapa();
initWspLinks();
initNav();
initClicksGlobales();
updateCartBadge();
