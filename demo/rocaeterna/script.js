/* Rocaeterna — demo Gokywebs */
'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ---------- Categorías y ambientes ---------- */
const CATEGORIAS = [
  { id: 'sabanas', label: 'Sábanas', img: 'images/sabanas-1x1.webp' },
  { id: 'acolchados', label: 'Acolchados', img: 'images/hero-dormitorio-16x9.webp' },
  { id: 'cubrecamas', label: 'Cubrecamas', img: 'images/cubrecamas-1x1.webp' },
  { id: 'toallas', label: 'Toallas', img: 'images/toallas-9x16.webp' },
  { id: 'mantas', label: 'Mantas', img: 'images/mantas-1x1.webp' },
  { id: 'almohadas', label: 'Almohadas', img: 'images/almohadas-1x1.webp' },
];

const AMBIENTES = [
  { id: 'dormitorio', label: 'Dormitorio', categorias: ['sabanas', 'acolchados', 'cubrecamas', 'almohadas'], img: 'images/hero-dormitorio-16x9.webp',
    texto: 'Sábanas suaves, acolchados que abrigan y almohadas con la firmeza justa: todo lo que arma un descanso de verdad.' },
  { id: 'bano', label: 'Baño', categorias: ['toallas'], img: 'images/toallas-9x16.webp',
    texto: 'Toallas de felpa densa que absorben de verdad y secan rápido, para que el ritual de todos los días se sienta mejor.' },
  { id: 'living', label: 'Living', categorias: ['mantas'], img: 'images/mantas-1x1.webp',
    texto: 'Una manta tejida cerca del sofá cambia cualquier tarde de semana e instala calidez donde te sentás.' },
];

/* ---------- Fixtures de producto ---------- */
const PRODUCTOS = [
  { id: 1, slug: 'sabanas-percal-crudo-2p', nombre: 'Juego de sábanas Percal Crudo', categoria: 'sabanas', linea: 'Percal 200 hilos', medida: '2 plazas', color: 'Crudo', precio: 34900, descuento: 0, stock: 12, nuevo: true, descripcion: 'Percal de algodón 200 hilos, con la mano suave y fresca que se agradece todo el año. Incluye sábana ajustable, sábana superior y dos fundas.' },
  { id: 2, slug: 'sabanas-percal-arena-queen', nombre: 'Juego de sábanas Percal Arena', categoria: 'sabanas', linea: 'Percal 200 hilos', medida: 'Queen', color: 'Arena', precio: 38500, descuento: 15, stock: 8, nuevo: false, descripcion: 'El mismo percal de siempre en un tono arena cálido, pensado para dormitorios luminosos. Ajustable + superior + dos fundas.' },
  { id: 3, slug: 'sabanas-saten-topo-king', nombre: 'Juego de sábanas Satén Topo', categoria: 'sabanas', linea: 'Satén 300 hilos', medida: 'King', color: 'Topo', precio: 46900, descuento: 0, stock: 5, nuevo: false, descripcion: 'Satén de 300 hilos con un brillo apenas insinuado y una caída suave sobre el colchón. Ajustable + superior + dos fundas.' },
  { id: 4, slug: 'sabanas-gasa-miel-1p', nombre: 'Juego de sábanas Gasa de Algodón Miel', categoria: 'sabanas', linea: 'Gasa de algodón', medida: '1 plaza', color: 'Miel', precio: 29900, descuento: 0, stock: 14, nuevo: false, descripcion: 'Gasa de algodón liviana, ideal para quien duerme con calor. Textura arrugada natural, sin planchado.' },

  { id: 5, slug: 'acolchado-liviano-crudo-queen', nombre: 'Acolchado Liviano Crudo', categoria: 'acolchados', linea: 'Relleno liviano · entretiempo', medida: 'Queen', color: 'Crudo', precio: 56900, descuento: 0, stock: 9, nuevo: false, descripcion: 'Relleno liviano de fibra siliconada para las estaciones intermedias, con funda 100% algodón lavable.' },
  { id: 6, slug: 'acolchado-termico-topo-king', nombre: 'Acolchado Térmico Topo', categoria: 'acolchados', linea: 'Relleno térmico · invierno', medida: 'King', color: 'Topo', precio: 74900, descuento: 20, stock: 4, nuevo: false, descripcion: 'El más abrigado de la colección: relleno térmico de alta densidad para las noches más frías del año.' },
  { id: 7, slug: 'acolchado-liviano-arena-2p', nombre: 'Acolchado Liviano Arena', categoria: 'acolchados', linea: 'Relleno liviano · entretiempo', medida: '2 plazas', color: 'Arena', precio: 52500, descuento: 0, stock: 10, nuevo: false, descripcion: 'La versión de dos plazas del acolchado liviano, en un arena suave que combina con cualquier ambiente.' },

  { id: 8, slug: 'cubrecama-quilt-miel-queen', nombre: 'Cubrecama Quilt Miel', categoria: 'cubrecamas', linea: 'Quilt acolchado', medida: 'Queen', color: 'Miel', precio: 64900, descuento: 0, stock: 7, nuevo: false, descripcion: 'Costura quilt en rombos, con caída pesada que arma la cama de un vistazo. Doble faz.' },
  { id: 9, slug: 'cubrecama-liso-crudo-king', nombre: 'Cubrecama Liso Reversible Crudo', categoria: 'cubrecamas', linea: 'Liso reversible', medida: 'King', color: 'Crudo', precio: 71900, descuento: 10, stock: 6, nuevo: false, descripcion: 'Cubrecama liso, reversible a un tono levemente más oscuro para cambiar el ambiente sin cambiar de ropa de cama.' },
  { id: 10, slug: 'cubrecama-quilt-topo-2p', nombre: 'Cubrecama Quilt Topo', categoria: 'cubrecamas', linea: 'Quilt acolchado', medida: '2 plazas', color: 'Topo', precio: 58900, descuento: 0, stock: 11, nuevo: false, descripcion: 'El mismo quilt en rombos en dos plazas, en un topo profundo que oculta bien el uso diario.' },

  { id: 11, slug: 'toalla-bano-felpa-arena', nombre: 'Toalla de Baño Felpa Egipcia Arena', categoria: 'toallas', linea: 'Felpa egipcia', medida: 'Baño', color: 'Arena', precio: 15900, descuento: 0, stock: 20, nuevo: true, descripcion: 'Felpa egipcia de gramaje alto: absorbe rápido, seca rápido y no pierde densidad con los lavados.' },
  { id: 12, slug: 'toallon-felpa-crudo', nombre: 'Toallón Felpa Egipcia Crudo', categoria: 'toallas', linea: 'Felpa egipcia', medida: 'Toallón', color: 'Crudo', precio: 21900, descuento: 0, stock: 15, nuevo: false, descripcion: 'El toallón grande de la línea, para salir de la ducha envuelta en algo que realmente abriga.' },
  { id: 13, slug: 'toalla-mano-algodon-topo', nombre: 'Toalla de Mano Algodón Peinado Topo', categoria: 'toallas', linea: 'Algodón peinado', medida: 'Mano', color: 'Topo', precio: 8900, descuento: 0, stock: 25, nuevo: false, descripcion: 'Algodón peinado suave, en el tamaño justo para el lavabo. Combina con toda la línea Felpa Egipcia.' },
  { id: 14, slug: 'toalla-cara-algodon-miel', nombre: 'Toalla de Cara Algodón Peinado Miel', categoria: 'toallas', linea: 'Algodón peinado', medida: 'Cara', color: 'Miel', precio: 5900, descuento: 0, stock: 30, nuevo: false, descripcion: 'La pieza chica del set de baño, ideal para completar un juego o para regalar suelta.' },

  { id: 15, slug: 'manta-plaid-topo-2p', nombre: 'Manta Plaid Tejido Topo', categoria: 'mantas', linea: 'Plaid tejido', medida: '2 plazas', color: 'Topo', precio: 37900, descuento: 0, stock: 9, nuevo: false, descripcion: 'Tejido grueso a dos agujas, con flecos en los bordes. Tan linda sobre el sofá como sobre la cama.' },
  { id: 16, slug: 'manta-polar-crudo-1p', nombre: 'Manta Polar Liviana Crudo', categoria: 'mantas', linea: 'Polar liviana', medida: '1 plaza', color: 'Crudo', precio: 24900, descuento: 15, stock: 13, nuevo: false, descripcion: 'Polar liviano y suave, para tener siempre a mano en el living sin ocupar lugar.' },
  { id: 17, slug: 'manta-plaid-miel-1p', nombre: 'Manta Plaid Tejido Miel', categoria: 'mantas', linea: 'Plaid tejido', medida: '1 plaza', color: 'Miel', precio: 31900, descuento: 0, stock: 8, nuevo: false, descripcion: 'La versión de una plaza del tejido grueso, en un miel cálido que ilumina cualquier rincón.' },

  { id: 18, slug: 'almohada-fibra-media-estandar', nombre: 'Almohada Fibra Siliconada Media', categoria: 'almohadas', linea: 'Fibra siliconada · firmeza media', medida: 'Estándar', color: 'Crudo', precio: 16900, descuento: 0, stock: 18, nuevo: true, descripcion: 'La firmeza más elegida: sostiene sin hundirse del todo. Funda 100% algodón, lavable en casa.' },
  { id: 19, slug: 'almohada-plumon-suave-queen', nombre: 'Almohada Símil Plumón Suave', categoria: 'almohadas', linea: 'Símil plumón · firmeza suave', medida: 'Queen', color: 'Crudo', precio: 23900, descuento: 0, stock: 10, nuevo: false, descripcion: 'Relleno símil plumón, mullido y liviano, para quien duerme boca abajo o prefiere hundirse un poco.' },
  { id: 20, slug: 'almohada-fibra-firme-estandar', nombre: 'Almohada Fibra Siliconada Firme', categoria: 'almohadas', linea: 'Fibra siliconada · firmeza firme', medida: 'Estándar', color: 'Crudo', precio: 17900, descuento: 20, stock: 0, nuevo: false, descripcion: 'La más firme de la línea, pensada para quien duerme de costado y necesita sostén en el cuello.' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === Number(id));
const getProductoPorSlug = slug => PRODUCTOS.find(p => p.slug === slug);
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const catLabel = id => (CATEGORIAS.find(c => c.id === id) || {}).label || id;

/* ---------- Carrito ---------- */
const Cart = {
  KEY: 'rocaeterna_cart',
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

/* ---------- Toast ---------- */
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

/* ---------- Anti-copia ---------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ---------- Barra de modelos ---------- */
function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) { bar.classList.remove('gw-modelos--scrolling'); return; }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
}

/* ---------- Nav mobile ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

/* ---------- Reveals ---------- */
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) { items.forEach(el => el.classList.add('in')); revealsListos = true; return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); } });
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
    if (!pending) { window.removeEventListener('scroll', queueSweep); window.removeEventListener('resize', queueSweep); }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
  revealsListos = true;
}

/* ---------- Rail arrastrable (destacados) ---------- */
function initRail(root, vp) {
  const track = vp.querySelector('.rail-track');
  const prev = root.querySelector('[data-rail-prev]');
  const next = root.querySelector('[data-rail-next]');
  if (!vp || !track) return;
  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

  const updateArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const cardWidth = () => (track.querySelector('.prod-card')?.getBoundingClientRect().width || 260) + 16;

  prev?.addEventListener('click', () => vp.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' }));

  vp.addEventListener('pointerdown', e => { down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId; });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ } }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => { down = false; vp.classList.remove('dragging'); try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ } setTimeout(() => { moved = false; }, 0); };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  vp.addEventListener('scroll', updateArrows, { passive: true });
  updateArrows();
}

function renderProdCard(p, { compact = false } = {}) {
  const desc = p.descuento > 0;
  const agotado = p.stock <= 0;
  const badges = [];
  if (agotado) { badges.push('<span class="prod-badge off">Sin stock</span>'); }
  else {
    if (p.nuevo) badges.push('<span class="prod-badge">Nuevo</span>');
    if (desc) badges.push(`<span class="prod-badge off">-${p.descuento}%</span>`);
    else if (p.stock <= 5) badges.push('<span class="prod-badge">Últimas unidades</span>');
  }
  return `
  <article class="prod-card" data-animate data-id="${p.id}">
    <div class="media ar-11" data-open-quickview="${p.id}">
      ${badges.length ? `<div class="prod-badges">${badges.join('')}</div>` : ''}
      <button type="button" class="prod-fav" data-fav="${p.id}" aria-label="Guardar en favoritos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button>
      <img src="${p.img}" alt="${esc(p.nombre)}" width="600" height="600" loading="lazy">
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(catLabel(p.categoria))} · ${esc(p.medida)}</span>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${agotado ? '<span class="prod-sin-stock">Sin stock por ahora</span>' :
        `<div class="prod-precio">${desc ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${formatearPrecio(precioFinal(p))}</span></div>`}
      ${!compact ? `
      <div class="prod-actions">
        ${agotado ? '' : `
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar">−</button>
          <span data-step-val>1</span>
          <button type="button" data-step="1" aria-label="Sumar">+</button>
        </div>`}
        <button type="button" class="prod-add" data-add="${p.id}" ${agotado ? 'disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
      </div>` : ''}
    </div>
  </article>`;
}

/* imagen de una categoría */
const imgCategoria = id => (CATEGORIAS.find(c => c.id === id) || {}).img || '';

/* asigna la imagen de categoría a cada producto renderizado */
function withImg(p) { return { ...p, img: imgCategoria(p.categoria) }; }

/* ---------- Catálogo con filtros ---------- */
function initFiltros() {
  const cont = document.querySelector('[data-catalogo]');
  if (!cont) return;
  const grid = cont.querySelector('.catalogo-grid');
  const resultadosEl = document.querySelector('[data-resultados]');
  const searchInput = document.querySelector('[data-buscador]');
  const ordenSelect = document.querySelector('[data-orden]');
  const limpiarBtn = cont.querySelector('.filtros-limpiar');
  const vermasBtn = document.querySelector('[data-vermas]');
  const filtrosPanel = cont.querySelector('.filtros');
  const toggleMobile = document.querySelector('.filtros-toggle-mobile');
  const closeMobile = cont.querySelector('.filtros-drawer-close');

  const catGrupo = cont.querySelector('[data-grupo="categoria"]');
  const medGrupo = cont.querySelector('[data-grupo="medida"]');
  const colGrupo = cont.querySelector('[data-grupo="color"]');

  const medidas = [...new Set(PRODUCTOS.map(p => p.medida))];
  const colores = [...new Set(PRODUCTOS.map(p => p.color))];

  if (catGrupo) catGrupo.innerHTML = CATEGORIAS.map(c => `
    <label class="filtro-opcion"><input type="checkbox" data-f="categoria" value="${c.id}"> ${esc(c.label)}</label>`).join('');
  if (medGrupo) medGrupo.innerHTML = medidas.map(m => `
    <label class="filtro-opcion"><input type="checkbox" data-f="medida" value="${esc(m)}"> ${esc(m)}</label>`).join('');
  if (colGrupo) colGrupo.innerHTML = colores.map(cVal => `
    <label class="filtro-opcion"><input type="checkbox" data-f="color" value="${esc(cVal)}"> ${esc(cVal)}</label>`).join('');

  let visibles = 16;
  const PAGE = 16;

  function leerSeleccion(campo) {
    return [...cont.querySelectorAll(`input[data-f="${campo}"]:checked`)].map(i => i.value);
  }

  function filtrar() {
    const catsSel = leerSeleccion('categoria');
    const medSel = leerSeleccion('medida');
    const colSel = leerSeleccion('color');
    const q = normalizar(searchInput?.value || '');
    let lista = PRODUCTOS.filter(p => {
      if (catsSel.length && !catsSel.includes(p.categoria)) return false;
      if (medSel.length && !medSel.includes(p.medida)) return false;
      if (colSel.length && !colSel.includes(p.color)) return false;
      if (q) {
        const haystack = normalizar(`${p.nombre} ${p.linea} ${p.color} ${catLabel(p.categoria)}`);
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    const orden = ordenSelect?.value || 'relevancia';
    if (orden === 'precio-asc') lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (orden === 'precio-desc') lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (orden === 'nombre-asc') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    return lista;
  }

  function render(reset = true) {
    if (reset) visibles = PAGE;
    const lista = filtrar();
    if (resultadosEl) resultadosEl.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'producto' : 'productos'}`;
    if (!lista.length) {
      grid.innerHTML = `<div class="catalogo-vacio"><p>No encontramos productos con esos filtros.</p><button type="button" class="btn btn-outline" data-limpiar-vacio>Limpiar filtros</button></div>`;
      if (vermasBtn) vermasBtn.hidden = true;
      grid.querySelector('[data-limpiar-vacio]')?.addEventListener('click', limpiar);
      revelarNuevos(grid);
      return;
    }
    const corte = lista.slice(0, visibles);
    grid.innerHTML = corte.map(p => renderProdCard(withImg(p))).join('');
    if (vermasBtn) vermasBtn.hidden = visibles >= lista.length;
    wireCardActions(grid);
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function limpiar() {
    cont.querySelectorAll('input[data-f]').forEach(i => (i.checked = false));
    if (searchInput) searchInput.value = '';
    if (ordenSelect) ordenSelect.value = 'relevancia';
    render(true);
  }

  cont.querySelectorAll('input[data-f]').forEach(i => i.addEventListener('change', () => render(true)));
  searchInput?.addEventListener('input', () => render(true));
  ordenSelect?.addEventListener('change', () => render(true));
  limpiarBtn?.addEventListener('click', limpiar);
  vermasBtn?.addEventListener('click', () => { visibles += PAGE; render(false); });

  toggleMobile?.addEventListener('click', () => { filtrosPanel.classList.add('open'); document.body.classList.add('no-scroll'); });
  closeMobile?.addEventListener('click', () => { filtrosPanel.classList.remove('open'); document.body.classList.remove('no-scroll'); });

  cont.filtrarPorCategorias = (ids) => {
    cont.querySelectorAll('input[data-f="categoria"]').forEach(i => (i.checked = ids.includes(i.value)));
    render(true);
    cont.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const catsUrl = (new URLSearchParams(location.search).get('cats') || '').split(',').filter(Boolean);
  if (catsUrl.length) cont.querySelectorAll('input[data-f="categoria"]').forEach(i => (i.checked = catsUrl.includes(i.value)));

  render(true);
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function wireCardActions(root) {
  root.querySelectorAll('[data-stepper]').forEach(st => {
    const val = st.querySelector('[data-step-val]');
    st.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const p = getProducto(st.dataset.stepper);
      let n = parseInt(val.textContent, 10) + parseInt(btn.dataset.step, 10);
      n = Math.max(1, Math.min(n, p?.stock ?? 99));
      val.textContent = n;
    }));
  });
  root.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
    const p = getProducto(btn.dataset.add);
    if (!p) return;
    const stepper = root.querySelector(`[data-stepper="${p.id}"] [data-step-val]`);
    const qty = stepper ? parseInt(stepper.textContent, 10) : 1;
    Cart.add(p, qty);
    showToast(`${p.nombre} agregado al carrito`);
  }));
  root.querySelectorAll('[data-open-quickview]').forEach(el => el.addEventListener('click', (e) => {
    e.preventDefault();
    openQuickview(el.dataset.openQuickview);
  }));
  root.querySelectorAll('[data-fav]').forEach(btn => {
    if (Wishlist.has(btn.dataset.fav)) btn.classList.add('activo');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      Wishlist.toggle(btn.dataset.fav);
      btn.classList.toggle('activo');
    });
  });
}

/* ---------- Favoritos ---------- */
const Wishlist = {
  KEY: 'rocaeterna_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(Number(id)); },
  toggle(id) {
    id = Number(id);
    let items = this.get();
    items = items.includes(id) ? items.filter(x => x !== id) : [...items, id];
    localStorage.setItem(this.KEY, JSON.stringify(items));
  },
};

/* ---------- Rieles de destacados (todas las páginas) ---------- */
function initRailesDestacados() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    if (!track) return;
    const ids = (vp.dataset.rail || '').split(',').map(s => s.trim()).filter(Boolean);
    const productos = ids.length ? ids.map(getProducto).filter(Boolean) : PRODUCTOS.slice(0, 8);
    track.innerHTML = productos.map(p => renderProdCard(withImg(p))).join('');
    wireCardActions(track);
    const root = vp.closest('section') || vp.parentElement;
    initRail(root, vp);
  });
}

/* ---------- Focus trap genérico (modales/drawers) ---------- */
function trapFocus(container) {
  if (container.dataset.trapBound) return;
  container.dataset.trapBound = '1';
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const items = [...container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')]
      .filter(el => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}
let ultimoFoco = null;

/* ---------- Vista rápida ---------- */
function openQuickview(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('quickview');
  if (!modal) return;
  const relacionados = PRODUCTOS.filter(r => r.categoria === p.categoria && r.id !== p.id).slice(0, 3);
  modal.querySelector('[data-qv-media]').innerHTML = `<img src="${imgCategoria(p.categoria)}" alt="${esc(p.nombre)}" width="600" height="600">`;
  modal.querySelector('[data-qv-cat]').textContent = `${catLabel(p.categoria)} · ${p.linea}`;
  modal.querySelector('[data-qv-nombre]').textContent = p.nombre;
  const desc = p.descuento > 0;
  modal.querySelector('[data-qv-precio]').innerHTML = p.stock <= 0 ? '<span class="prod-sin-stock">Sin stock por ahora</span>' :
    `${desc ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${formatearPrecio(precioFinal(p))}</span>`;
  modal.querySelector('[data-qv-descripcion]').textContent = p.descripcion;
  modal.querySelector('[data-qv-atributos]').innerHTML = `<span>${esc(p.medida)}</span><span>${esc(p.color)}</span><span>${esc(p.linea)}</span>`;
  const addBtn = modal.querySelector('[data-qv-add]');
  addBtn.disabled = p.stock <= 0;
  addBtn.textContent = p.stock <= 0 ? 'Sin stock' : 'Agregar al carrito';
  addBtn.onclick = () => {
    const qty = parseInt(modal.querySelector('[data-qv-step-val]').textContent, 10) || 1;
    Cart.add(p, qty);
    showToast(`${p.nombre} agregado al carrito`);
  };
  modal.querySelector('[data-qv-step-val]').textContent = '1';
  modal.querySelectorAll('[data-qv-step]').forEach(btn => btn.onclick = () => {
    const val = modal.querySelector('[data-qv-step-val]');
    let n = parseInt(val.textContent, 10) + parseInt(btn.dataset.qvStep, 10);
    n = Math.max(1, Math.min(n, p.stock || 1));
    val.textContent = n;
  });
  const relEl = modal.querySelector('[data-qv-relacionados]');
  relEl.innerHTML = relacionados.map(r => `
    <a href="#" data-open-quickview="${r.id}">
      <div class="media ar-11"><img src="${imgCategoria(r.categoria)}" alt="${esc(r.nombre)}" width="300" height="300" loading="lazy"></div>
      <span>${esc(r.nombre)}</span>
    </a>`).join('');
  relEl.querySelectorAll('[data-open-quickview]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); openQuickview(a.dataset.openQuickview); }));

  ultimoFoco = document.activeElement;
  modal.hidden = false;
  trapFocus(modal);
  window.lenis?.stop();
  document.body.classList.add('no-scroll');
  modal.querySelector('.quickview-close')?.focus();
}
function closeQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.hidden = true;
  window.lenis?.start();
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus?.();
}
function initQuickview() {
  const modal = document.getElementById('quickview');
  if (!modal) return;
  modal.querySelector('.quickview-close')?.addEventListener('click', closeQuickview);
  modal.addEventListener('click', e => { if (e.target === modal) closeQuickview(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeQuickview(); });

  const params = new URLSearchParams(location.search);
  const slug = params.get('producto');
  if (slug) { const p = getProductoPorSlug(slug); if (p) openQuickview(p.id); }
}

/* ---------- Carrito: UI ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
function renderCart() {
  const itemsEl = document.querySelector('[data-cart-items]');
  const footerEl = document.querySelector('[data-cart-footer]');
  if (!itemsEl) return;
  const items = Cart.get();
  if (!items.length) {
    itemsEl.innerHTML = `<div class="cart-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
      <p>Tu carrito está vacío.<br>Elegí algo lindo para tu casa.</p></div>`;
    if (footerEl) footerEl.hidden = true;
    return;
  }
  if (footerEl) footerEl.hidden = false;
  itemsEl.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    return `<div class="cart-item" data-cart-item="${p.id}">
      <div class="media ar-11"><img src="${imgCategoria(p.categoria)}" alt="${esc(p.nombre)}" width="150" height="150" loading="lazy"></div>
      <div class="cart-item-info">
        <strong>${esc(p.nombre)}</strong>
        <span class="prod-cat">${esc(p.medida)} · ${esc(p.color)}</span>
        <div class="cart-item-row">
          <div class="stepper" data-stepper-cart="${p.id}">
            <button type="button" data-step="-1" aria-label="Restar">−</button>
            <span data-step-val>${i.qty}</span>
            <button type="button" data-step="1" aria-label="Sumar">+</button>
          </div>
          <span class="cart-item-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
        </div>
        <button type="button" class="cart-item-quitar" data-cart-remove="${p.id}">Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  itemsEl.querySelectorAll('[data-stepper-cart]').forEach(st => {
    const id = st.dataset.stepperCart;
    st.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const val = st.querySelector('[data-step-val]');
      const cur = parseInt(val.textContent, 10);
      Cart.setQty(id, cur + parseInt(btn.dataset.step, 10));
    }));
  });
  itemsEl.querySelectorAll('[data-cart-remove]').forEach(btn => btn.addEventListener('click', () => Cart.remove(btn.dataset.cartRemove)));
}
function openCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  ultimoFoco = document.activeElement;
  drawer?.classList.add('open');
  document.querySelector('.cart-backdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  if (drawer) { trapFocus(drawer); drawer.querySelector('.cart-close')?.focus(); }
}
function closeCartDrawer() {
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-backdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
  ultimoFoco?.focus?.();
}
function initCartUI() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCartDrawer));
  document.querySelector('.cart-close')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-backdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.querySelector('.cart-drawer.open')) closeCartDrawer(); });
  document.querySelector('[data-checkout]')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCart(); });
  renderCart();
}

/* ---------- Flotantes ---------- */
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

/* ---------- Componente funcional: Armá tu cama ideal ---------- */
const TAMANOS = ['1 plaza', '2 plazas', 'Queen', 'King'];
const PALETAS_ARMADOR = [
  { key: 'crudo-arena', label: 'Crudo & Arena', colores: ['Crudo', 'Arena'] },
  { key: 'miel-topo', label: 'Miel & Topo', colores: ['Miel', 'Topo'] },
];

function armarSet(tamano, paletaKey) {
  const paleta = PALETAS_ARMADOR.find(p => p.key === paletaKey) || PALETAS_ARMADOR[0];
  const disp = p => p.stock > 0;

  const sabanaCands = PRODUCTOS.filter(p => p.categoria === 'sabanas' && p.medida === tamano && disp(p));
  const sabana = sabanaCands.find(p => paleta.colores.includes(p.color)) || sabanaCands[0] || null;

  const abrigoPool = PRODUCTOS.filter(p => (p.categoria === 'acolchados' || p.categoria === 'cubrecamas') && disp(p));
  let abrigoCands = abrigoPool.filter(p => p.medida === tamano);
  let aproximado = false;
  if (!abrigoCands.length) {
    const dist = p => Math.abs(TAMANOS.indexOf(p.medida) - TAMANOS.indexOf(tamano));
    const min = Math.min(...abrigoPool.map(dist));
    abrigoCands = abrigoPool.filter(p => dist(p) === min);
    aproximado = true;
  }
  const abrigo = abrigoCands.find(p => paleta.colores.includes(p.color)) || abrigoCands[0] || null;

  const almPool = PRODUCTOS.filter(p => p.categoria === 'almohadas' && disp(p));
  const firmezaPref = paletaKey === 'miel-topo' ? 'firme' : 'suave';
  const almohada = almPool.find(p => normalizar(p.linea).includes(firmezaPref)) || almPool[0] || null;

  return { sabana, abrigo, almohada, aproximado };
}

function initArmador() {
  document.querySelectorAll('[data-armador]').forEach(root => {
    const tamanoSel = root.querySelector('[data-armador-tamano]');
    const paletaSel = root.querySelector('[data-armador-paleta]');
    const form = root.querySelector('form');
    const resultado = root.querySelector('[data-armador-resultado]');
    if (!tamanoSel || !paletaSel || !resultado) return;

    tamanoSel.innerHTML = TAMANOS.map(t => `<option value="${t}">${t}</option>`).join('');
    paletaSel.innerHTML = PALETAS_ARMADOR.map(p => `<option value="${p.key}">${p.label}</option>`).join('');
    tamanoSel.value = '2 plazas';

    const pintar = () => {
      const { sabana, abrigo, almohada, aproximado } = armarSet(tamanoSel.value, paletaSel.value);
      const items = [sabana, abrigo, almohada].filter(Boolean);
      if (!items.length) {
        resultado.innerHTML = `<p class="armador-empty">No encontramos un set disponible para esa combinación. Probá con otro tamaño.</p>`;
        resultado.hidden = false;
        return;
      }
      const total = items.reduce((s, p) => s + precioFinal(p), 0);
      resultado.innerHTML = `
        <div class="armador-set">
          ${items.map(p => `
            <div class="armador-item">
              <div class="media ar-11"><img src="${imgCategoria(p.categoria)}" alt="${esc(p.nombre)}" width="140" height="140" loading="lazy"></div>
              <div class="armador-item-info"><strong>${esc(p.nombre)}</strong><span>${formatearPrecio(precioFinal(p))}</span></div>
            </div>`).join('')}
        </div>
        ${aproximado ? '<p class="armador-empty">No tenemos abrigo de cama en ese tamaño exacto: te sugerimos el más cercano.</p>' : ''}
        <div class="armador-footer">
          <span class="armador-total">Set completo: <b>${formatearPrecio(total)}</b></span>
          <button type="button" class="btn btn-cta" data-armador-agregar>Agregar el set al carrito</button>
        </div>`;
      resultado.hidden = false;
      resultado.querySelector('[data-armador-agregar]').addEventListener('click', () => {
        items.forEach(p => Cart.add(p, p.categoria === 'almohadas' ? 2 : 1));
        showToast('¡Listo! Agregamos tu set al carrito');
      });
    };
    form ? form.addEventListener('submit', e => { e.preventDefault(); pintar(); }) : root.querySelector('[data-armador-submit]')?.addEventListener('click', pintar);
    pintar();
  });
}

/* ---------- Momento propio: Capítulos (Dormitorio / Baño / Living) ---------- */
function datoAmbiente(amb) {
  const items = PRODUCTOS.filter(p => amb.categorias.includes(p.categoria) && p.stock > 0);
  const desde = items.length ? Math.min(...items.map(precioFinal)) : 0;
  return { desde, piezas: items.length };
}

function initCapitulos() {
  document.querySelectorAll('[data-capitulos]').forEach(root => {
    const track = root.querySelector('.capitulos-track');
    const scene = root.querySelector('.capitulos-scene');
    if (!track || !scene) return;
    const imgs = [...scene.querySelectorAll('.capitulos-img')];
    const titulo = scene.querySelector('[data-cap-titulo]');
    const texto = scene.querySelector('[data-cap-texto]');
    const dato = scene.querySelector('[data-cap-dato]');
    const indexEl = scene.querySelector('[data-cap-index]');
    const cta = scene.querySelector('[data-cap-cta]');
    const dots = [...scene.querySelectorAll('.capitulos-dot')];
    const OFF = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const N = AMBIENTES.length;
    let activo = -1;

    const pintar = (i) => {
      if (i === activo) return;
      activo = i;
      const amb = AMBIENTES[i];
      const d = datoAmbiente(amb);
      imgs.forEach(img => img.classList.toggle('activo', img.dataset.ambiente === amb.id));
      if (titulo) titulo.textContent = amb.label;
      if (texto) texto.textContent = amb.texto;
      if (dato) dato.innerHTML = `${formatearPrecio(d.desde)} <small>desde · ${d.piezas} piezas</small>`;
      if (indexEl) indexEl.textContent = `0${i + 1} / 0${N}`;
      if (cta) cta.dataset.capCta = amb.id;
      dots.forEach((dot, di) => dot.classList.toggle('activo', di === i));
    };
    pintar(0);

    cta?.addEventListener('click', () => {
      const amb = AMBIENTES.find(a => a.id === cta.dataset.capCta) || AMBIENTES[activo];
      const catalogo = document.querySelector('[data-catalogo]');
      if (catalogo?.filtrarPorCategorias) catalogo.filtrarPorCategorias(amb.categorias);
      else location.href = `modelo-2.html?cats=${amb.categorias.join(',')}#catalogo`;
    });

    const update = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight + OFF;
      let progreso = (-rect.top) / Math.max(total, 1);
      progreso = Math.min(Math.max(progreso, 0), 0.999);
      pintar(Math.floor(progreso * N));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  });
}

/* ---------- Buscador del header y chips de categoría ---------- */
function initHeaderSearch() {
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', e => e.preventDefault()));
}
function initChips() {
  document.querySelectorAll('[data-cat-chip]').forEach(btn => btn.addEventListener('click', () => {
    const cont = document.querySelector('[data-catalogo]');
    cont?.filtrarPorCategorias?.([btn.dataset.catChip]);
  }));
}

/* ---------- Tarjetas de ambientes ---------- */
function initAmbientes() {
  document.querySelectorAll('[data-ambiente-cta]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const amb = AMBIENTES.find(a => a.id === el.dataset.ambienteCta);
      if (!amb) return;
      const catalogo = document.querySelector('[data-catalogo]');
      if (catalogo?.filtrarPorCategorias) catalogo.filtrarPorCategorias(amb.categorias);
      else location.href = `modelo-2.html?cats=${amb.categorias.join(',')}#catalogo`;
    });
  });
}

/* ---------- Movimiento del hero (GSAP) ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

function initHeroMotion() {
  const hero = document.querySelector('.hero-inmersivo');
  if (!hero) return;
  const mostrar = () => hero.classList.add('in');
  requestAnimationFrame(() => requestAnimationFrame(mostrar));
  setTimeout(mostrar, 600);
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(hero.querySelectorAll('.eyebrow, h1, p.lede, .hero-actions'), {
    y: 26, opacity: 0, duration: .9, stagger: .12,
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');
  initNav();
  initModelBarScroll();
  initHeaderSearch();
  initFiltros();
  initChips();
  initRailesDestacados();
  initArmador();
  initCapitulos();
  initAmbientes();
  initQuickview();
  initCartUI();
  initFloats();
  updateCartBadge();
  initReveals();
  initHeroMotion();
});
