const CART_KEY = 'pasionderosario_cart';
const PAGE_SIZE = 16;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');

const CLUBES = [
  { id: 'newells', nombre: "Newell's Old Boys", a: '#E30613', b: '#000000', imagen: 'images/jersey-espalda-mochila-1200x1200.webp' },
  { id: 'central', nombre: 'Rosario Central', a: '#0033A0', b: '#FFD100', imagen: 'images/percha-remeras-color-1200x1200.webp' },
  { id: 'boca', nombre: 'Boca Juniors', a: '#0F1A3C', b: '#FFD100', imagen: 'images/botines-producto-1200x1200.webp' },
  { id: 'river', nombre: 'River Plate', a: '#D50032', b: '#FFFFFF', imagen: 'images/pelotas-petos-entrenamiento-1200x1200.webp' },
  { id: 'seleccion', nombre: 'Selección Argentina', a: '#75AADB', b: '#FFFFFF', imagen: 'images/remera-basica-percha-1200x1200.webp' },
  { id: 'basicos', nombre: 'Línea Básicos', a: '#808080', b: '#1A1A1A', imagen: 'images/textura-tela-franjas-1200x1200.webp' },
];
const CLUB_MAP = Object.fromEntries(CLUBES.map(c => [c.id, c]));

const IMAGENES_CLUB = {
  newells: ['images/jersey-espalda-mochila-1200x1200.webp', 'images/botines-producto-1200x1200.webp'],
  central: ['images/percha-remeras-color-1200x1200.webp', 'images/jersey-espalda-mochila-1200x1200.webp'],
  boca: ['images/botines-producto-1200x1200.webp', 'images/pelotas-petos-entrenamiento-1200x1200.webp'],
  river: ['images/pelotas-petos-entrenamiento-1200x1200.webp', 'images/percha-remeras-color-1200x1200.webp'],
  seleccion: ['images/remera-basica-percha-1200x1200.webp', 'images/jersey-espalda-mochila-1200x1200.webp'],
  basicos: ['images/remera-basica-percha-1200x1200.webp', 'images/textura-tela-franjas-1200x1200.webp'],
};

const TALLES_ADULTO = ['S', 'M', 'L', 'XL', 'XXL'];
const TALLES_NINO = ['4', '6', '8', '10', '12', '14'];
const TALLES_SHORT = ['S', 'M', 'L', 'XL'];
const TALLE_UNICO = ['Único'];

const PRECIO_BASE = {
  camiseta: [56000, 68000], camisetaRetro: [64000, 74000], camisetaNino: [38000, 46000],
  buzo: [58000, 70000], campera: [62000, 75000], short: [26000, 33000], gorra: [19000, 25000],
  remeraBasica: [23000, 29000], buzoBasico: [36000, 45000], shortBasico: [21000, 27000],
  musculosa: [18000, 23000], calza: [25000, 31000], medias: [12000, 15000], mochila: [33000, 41000],
};

function precioDeterministico(tipo, seed) {
  const [min, max] = PRECIO_BASE[tipo];
  const span = max - min;
  const raw = min + ((seed * 41) % span);
  return Math.round(raw / 500) * 500;
}

function productosDeClub(club) {
  const c = CLUB_MAP[club];
  const n = c.nombre;
  return [
    { key: 'titular', nombre: `Camiseta Titular — ${n}`, desc: `Camiseta titular de ${n}, corte oficial de partido.`, tipo: 'camiseta', talles: TALLES_ADULTO, tags: ['camiseta'] },
    { key: 'alternativa', nombre: `Camiseta Alternativa — ${n}`, desc: `Segunda camiseta de ${n} para usar fuera de casa.`, tipo: 'camiseta', talles: TALLES_ADULTO, tags: ['camiseta'] },
    { key: 'suplente', nombre: `Camiseta Suplente — ${n}`, desc: `Tercera camiseta de ${n}, diseño de la temporada.`, tipo: 'camiseta', talles: TALLES_ADULTO, tags: ['camiseta'] },
    { key: 'retro', nombre: `Camiseta Retro — ${n}`, desc: `Versión histórica de la camiseta de ${n}, para el hincha de siempre.`, tipo: 'camisetaRetro', talles: TALLES_ADULTO, tags: ['camiseta', 'retro'] },
    { key: 'buzo', nombre: `Buzo Canguro — ${n}`, desc: `Buzo con capucha y bolsillo canguro, escudo de ${n} al pecho.`, tipo: 'buzo', talles: TALLES_ADULTO, tags: ['abrigo'] },
    { key: 'campera', nombre: `Campera Rompeviento — ${n}`, desc: `Campera liviana e impermeable de ${n}, ideal para la cancha.`, tipo: 'campera', talles: TALLES_ADULTO, tags: ['abrigo'] },
    { key: 'short', nombre: `Short Oficial — ${n}`, desc: `Short a juego con la camiseta titular de ${n}.`, tipo: 'short', talles: TALLES_SHORT, tags: ['short'] },
    { key: 'nino', nombre: `Camiseta Niño Titular — ${n}`, desc: `La camiseta titular de ${n} en talles para chicos.`, tipo: 'camisetaNino', talles: TALLES_NINO, tags: ['camiseta', 'nino'] },
    { key: 'gorra', nombre: `Gorra Bordada — ${n}`, desc: `Gorra ajustable con el escudo de ${n} bordado al frente.`, tipo: 'gorra', talles: TALLE_UNICO, tags: ['accesorio'] },
  ];
}

const BASE_SELECCION = [
  { key: 'titular', nombre: 'Camiseta Titular Albiceleste', desc: 'La celeste y blanca de siempre, corte oficial de partido.', tipo: 'camiseta', talles: TALLES_ADULTO, tags: ['camiseta'] },
  { key: 'alternativa', nombre: 'Camiseta Alternativa Selección', desc: 'Segunda camiseta de la Selección para el día a día.', tipo: 'camiseta', talles: TALLES_ADULTO, tags: ['camiseta'] },
  { key: 'tricampeon', nombre: 'Camiseta 3 Estrellas', desc: 'Edición con las tres estrellas de campeón del mundo.', tipo: 'camisetaRetro', talles: TALLES_ADULTO, tags: ['camiseta'] },
  { key: 'retro1986', nombre: 'Camiseta Retro 1986', desc: 'Versión histórica inspirada en el Mundial 86.', tipo: 'camisetaRetro', talles: TALLES_ADULTO, tags: ['camiseta', 'retro'] },
  { key: 'buzo', nombre: 'Buzo Canguro Selección', desc: 'Buzo con capucha, escudo de la AFA bordado.', tipo: 'buzo', talles: TALLES_ADULTO, tags: ['abrigo'] },
  { key: 'campera', nombre: 'Campera Selección', desc: 'Campera liviana albiceleste para los días de partido.', tipo: 'campera', talles: TALLES_ADULTO, tags: ['abrigo'] },
  { key: 'nino', nombre: 'Camiseta Niño Titular Selección', desc: 'La titular albiceleste en talles para chicos.', tipo: 'camisetaNino', talles: TALLES_NINO, tags: ['camiseta', 'nino'] },
  { key: 'gorra', nombre: 'Gorra Selección Argentina', desc: 'Gorra ajustable celeste y blanca.', tipo: 'gorra', talles: TALLE_UNICO, tags: ['accesorio'] },
];

const BASE_BASICOS = [
  { key: 'remera-basica', nombre: 'Remera Básica de Algodón', desc: '100% algodón, corte clásico que no pierde forma.', tipo: 'remeraBasica', talles: TALLES_ADULTO, tags: ['remera'] },
  { key: 'remera-oversize', nombre: 'Remera Oversize', desc: 'Corte oversize con tela de buena caída.', tipo: 'remeraBasica', talles: TALLES_ADULTO, tags: ['remera'] },
  { key: 'buzo-liso', nombre: 'Buzo Canguro Liso', desc: 'Buzo básico con capucha, interior afelpado.', tipo: 'buzoBasico', talles: TALLES_ADULTO, tags: ['abrigo'] },
  { key: 'buzo-cierre', nombre: 'Buzo con Cierre', desc: 'Buzo entero con cierre y cuello alto.', tipo: 'buzoBasico', talles: TALLES_ADULTO, tags: ['abrigo'] },
  { key: 'short-basico', nombre: 'Short Deportivo Básico', desc: 'Short liviano con bolsillos laterales.', tipo: 'shortBasico', talles: TALLES_SHORT, tags: ['short'] },
  { key: 'campera-basica', nombre: 'Campera Rompeviento Básica', desc: 'Campera liviana e impermeable, sin escudo.', tipo: 'buzoBasico', talles: TALLES_ADULTO, tags: ['abrigo'] },
  { key: 'musculosa', nombre: 'Musculosa Deportiva', desc: 'Tela liviana que seca rápido, ideal para entrenar.', tipo: 'musculosa', talles: TALLES_ADULTO, tags: ['remera'] },
  { key: 'calza', nombre: 'Calza Deportiva', desc: 'Calza con tela elastizada, buena compresión.', tipo: 'calza', talles: ['S', 'M', 'L'], tags: ['short'] },
  { key: 'medias', nombre: 'Medias Deportivas Pack x3', desc: 'Pack de tres pares con planta reforzada.', tipo: 'medias', talles: TALLE_UNICO, tags: ['accesorio'] },
  { key: 'mochila', nombre: 'Mochila Deportiva', desc: 'Mochila resistente con compartimento para botines.', tipo: 'mochila', talles: TALLE_UNICO, tags: ['accesorio'] },
];

function construirProductos() {
  const productos = [];
  let seed = 0;
  const agregar = (club, base) => {
    base.forEach(item => {
      seed++;
      const id = `${club}-${item.key}`;
      const precio = precioDeterministico(item.tipo, seed);
      const descuento = seed % 11 === 0 ? 15 : (seed % 17 === 0 ? 25 : 0);
      const stock = seed % 23 === 0 ? 0 : 10 + (seed % 12);
      const imagenes = IMAGENES_CLUB[club];
      productos.push({
        id,
        club,
        clubNombre: CLUB_MAP[club].nombre,
        nombre: item.nombre,
        descCorta: item.desc,
        descLarga: `${item.desc} Tela pensada para uso diario, con terminaciones cuidadas para que dure temporada tras temporada.`,
        beneficios: ['Tela resistente al uso diario', 'Estampado que no se despega ni destiñe', 'Talles reales, guía de talles disponible', 'Cambios sin vueltas en el local de Rosario'],
        precio,
        descuento,
        stock,
        talles: item.talles,
        tags: [...item.tags, club],
        imagen: imagenes[seed % imagenes.length],
        destacado: false,
      });
    });
  };
  CLUBES.filter(c => c.id !== 'basicos' && c.id !== 'seleccion').forEach(c => agregar(c.id, productosDeClub(c.id)));
  agregar('seleccion', BASE_SELECCION);
  agregar('basicos', BASE_BASICOS);
  return productos;
}

const PRODUCTOS = construirProductos();
const DESTACADOS_IDS = ['newells-titular', 'central-titular', 'boca-titular', 'river-titular', 'seleccion-titular', 'seleccion-tricampeon', 'basicos-remera-basica', 'newells-retro'];
DESTACADOS_IDS.forEach(id => { const p = PRODUCTOS.find(x => x.id === id); if (p) { p.destacado = true; p.stock = Math.max(p.stock, 5); } });

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100) / 100) * 100 : p.precio;

const Cart = {
  get() { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(CART_KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock || 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock || 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.talle === talle); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 2800);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', () => { if (document.getElementById('cartDrawer')?.classList.contains('open')) renderDrawer(); });

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 500;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', openDrawer);
  sync();
}

function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  const items = CLUBES.map(c => ({ text: c.nombre, a: c.a, b: c.b }));
  const html = items.map(i => `<span class="marquee-item"><span class="dot" style="--club-a:${i.a};--club-b:${i.b}"></span>${esc(i.text)}</span>`).join('');
  track.innerHTML = html + html;
}

function initClubRail() {
  const track = document.getElementById('clubRailTrack');
  if (!track) return;
  track.innerHTML = CLUBES.map(c => `
    <a class="club-pill" href="#club-${c.id}" style="--club-a:${c.a};--club-b:${c.b}">
      <span class="dot"></span>${esc(c.nombre)}
    </a>
  `).join('');
  initDraggableRail(track.parentElement, track, null, null);
}

function priceRowHTML(p) {
  const final = precioFinal(p);
  if (p.descuento > 0) {
    return `<div class="price-row"><span class="final">${formatearPrecio(final)}</span><span class="original">${formatearPrecio(p.precio)}</span><span class="off">-${p.descuento}%</span></div>`;
  }
  return `<div class="price-row"><span class="final">${formatearPrecio(p.precio)}</span></div>`;
}

function cardTemplate(p) {
  const club = CLUB_MAP[p.club];
  const badge = p.stock === 0 ? '<span class="badge badge--out">Sin stock</span>' : (p.descuento > 0 ? `<span class="badge badge--sale">-${p.descuento}%</span>` : '');
  const talleOptions = p.talles.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  return `
  <article class="product-card" style="--card-accent:${club.a};opacity:0;transform:translateY(28px)" data-animate data-id="${p.id}">
    <div class="product-media">
      ${badge}
      <img src="${p.imagen}" width="1200" height="1200" alt="${esc(p.nombre)}" loading="lazy">
    </div>
    <div class="product-body">
      <span class="product-cat">${esc(p.clubNombre)}</span>
      <h3>${esc(p.nombre)}</h3>
      ${priceRowHTML(p)}
      <div class="product-actions">
        <select class="talle-select" data-talle-select aria-label="Elegir talle">${talleOptions}</select>
        <div class="add-row">
          <button type="button" class="btn btn--icon-only btn--ghost" data-open-modal="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <button type="button" class="btn btn--cta" data-add-cart ${p.stock === 0 ? 'disabled' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
            <span>${p.stock === 0 ? 'Sin stock' : 'Agregar'}</span>
          </button>
        </div>
      </div>
    </div>
  </article>`;
}

function bindCardActions(container) {
  container.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = card.dataset.id;
    const p = getProducto(id);
    if (!p) return;
    if (e.target.closest('[data-add-cart]')) {
      const talle = card.querySelector('[data-talle-select]')?.value || p.talles[0];
      Cart.add(p, talle, 1);
      showToast(`Agregado: ${p.nombre} (talle ${talle})`);
    } else if (e.target.closest('[data-open-modal]')) {
      window.openModal(id);
    }
  });
}

const catalogState = { search: '', club: 'todo', visible: PAGE_SIZE };

function filtrarProductos() {
  const q = normalizar(catalogState.search);
  return PRODUCTOS.filter(p => {
    if (catalogState.club !== 'todo' && p.club !== catalogState.club) return false;
    if (!q) return true;
    const hay = normalizar(`${p.nombre} ${p.clubNombre}`);
    return hay.includes(q);
  });
}

function syncFilterChips() {
  document.querySelectorAll('[data-filter-club]').forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.filterClub === catalogState.club);
  });
}

function setClubFilter(club) {
  catalogState.club = club;
  catalogState.visible = PAGE_SIZE;
  syncFilterChips();
  renderCatalog();
  document.getElementById('catalogo')?.scrollIntoView({ block: 'start' });
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function renderCatalog() {
  const grid = document.getElementById('catalogGrid');
  const moreBtn = document.getElementById('catalogMore');
  const countEl = document.getElementById('resultsCount');
  const emptyEl = document.getElementById('emptyState');
  if (!grid) return;
  const filtered = filtrarProductos();
  const slice = filtered.slice(0, catalogState.visible);
  grid.innerHTML = slice.map(cardTemplate).join('');
  bindCardActions(grid);
  countEl.textContent = filtered.length ? `Mostrando ${slice.length} de ${filtered.length} productos` : '';
  moreBtn.hidden = catalogState.visible >= filtered.length;
  emptyEl.classList.toggle('is-visible', filtered.length === 0);
  grid.hidden = filtered.length === 0;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initCatalogo() {
  const grid = document.getElementById('catalogGrid');
  const searchInput = document.getElementById('searchInput');
  const moreBtn = document.getElementById('catalogMore');
  const clearBtn = document.getElementById('clearFilters');
  if (!grid) return;
  searchInput.addEventListener('input', () => { catalogState.search = searchInput.value; catalogState.visible = PAGE_SIZE; renderCatalog(); });
  document.querySelectorAll('[data-filter-club]').forEach(chip => chip.addEventListener('click', () => setClubFilter(chip.dataset.filterClub)));
  moreBtn.addEventListener('click', () => { catalogState.visible += PAGE_SIZE; renderCatalog(); });
  clearBtn.addEventListener('click', () => {
    catalogState.search = ''; catalogState.club = 'todo'; catalogState.visible = PAGE_SIZE;
    searchInput.value = ''; syncFilterChips(); renderCatalog();
  });
  syncFilterChips();
  renderCatalog();
}

function initDraggableRail(viewport, track, prevBtn, nextBtn) {
  if (!viewport || !track) return;
  let isDown = false, moved = false, justDragged = false, startX = 0, startScroll = 0, pointerId = null;

  viewport.addEventListener('pointerdown', e => {
    isDown = true; moved = false; startX = e.clientX; startScroll = viewport.scrollLeft; pointerId = e.pointerId;
  });
  viewport.addEventListener('pointermove', e => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      viewport.classList.add('dragging');
      try { viewport.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) viewport.scrollLeft = startScroll - dx;
  });
  const endDrag = () => {
    isDown = false;
    if (moved) {
      try { viewport.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      justDragged = true;
      setTimeout(() => viewport.classList.remove('dragging'), 50);
    }
    moved = false;
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointerleave', endDrag);
  viewport.addEventListener('click', e => {
    if (justDragged) { e.preventDefault(); e.stopPropagation(); justDragged = false; }
  }, true);

  if (prevBtn && nextBtn) {
    const syncArrows = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prevBtn.disabled = viewport.scrollLeft <= inicio + 2;
      nextBtn.disabled = viewport.scrollLeft >= (viewport.scrollWidth - viewport.clientWidth) - 2;
    };
    prevBtn.addEventListener('click', () => viewport.scrollBy({ left: -320, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => viewport.scrollBy({ left: 320, behavior: 'smooth' }));
    viewport.addEventListener('scroll', syncArrows, { passive: true });
    syncArrows();
  }

  viewport.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const atStart = viewport.scrollLeft <= 0;
    const atEnd = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    viewport.scrollLeft += e.deltaY;
  }, { passive: false });
}

function initDestacadosRail() {
  const track = document.getElementById('railTrack');
  const viewport = document.getElementById('railViewport');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!track || !viewport) return;
  const items = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = items.map(cardTemplate).join('');
  bindCardActions(track);
  initDraggableRail(viewport, track, prev, next);
}

function initClubSections() {
  document.querySelectorAll('[data-club-section]').forEach(section => {
    const clubId = section.dataset.clubSection;
    const club = CLUB_MAP[clubId];
    if (!club) return;
    section.style.setProperty('--club-a', club.a);
    section.style.setProperty('--club-b', club.b);
    const track = section.querySelector('[data-club-track]');
    const viewport = section.querySelector('[data-club-viewport]');
    const prev = section.querySelector('[data-club-prev]');
    const next = section.querySelector('[data-club-next]');
    const items = PRODUCTOS.filter(p => p.club === clubId).slice(0, 8);
    track.innerHTML = items.map(cardTemplate).join('');
    bindCardActions(track);
    initDraggableRail(viewport, track, prev, next);
  });
}

function initModal() {
  const backdrop = document.getElementById('modalBackdrop');
  const cardEl = document.getElementById('modalCard');
  const imgEl = document.getElementById('modalImg');
  const catEl = document.getElementById('modalCat');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const priceEl = document.getElementById('modalPrice');
  const benefEl = document.getElementById('modalBenefits');
  const talleSelect = document.getElementById('modalTalle');
  const addBtn = document.getElementById('modalAdd');
  const buyBtn = document.getElementById('modalBuyNow');
  const closeBtn = document.getElementById('modalClose');
  if (!backdrop) return;
  let lastFocused = null;
  let currentId = null;

  function onKeydown(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const focusables = Array.from(cardEl.querySelectorAll('a,button,select')).filter(el => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  window.openModal = id => {
    const p = getProducto(id);
    if (!p) return;
    currentId = id;
    lastFocused = document.activeElement;
    catEl.textContent = p.clubNombre;
    titleEl.textContent = p.nombre;
    descEl.textContent = p.descLarga;
    priceEl.innerHTML = p.descuento > 0
      ? `<span class="final">${formatearPrecio(precioFinal(p))}</span><span class="original">${formatearPrecio(p.precio)}</span>`
      : `<span class="final">${formatearPrecio(p.precio)}</span>`;
    benefEl.innerHTML = p.beneficios.map(b => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg><span>${esc(b)}</span></li>`).join('');
    talleSelect.innerHTML = p.talles.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
    imgEl.src = p.imagen;
    imgEl.alt = p.nombre;
    const sinStock = p.stock === 0;
    addBtn.disabled = sinStock; buyBtn.disabled = sinStock;
    addBtn.querySelector('span').textContent = sinStock ? 'Sin stock' : 'Agregar al carrito';
    buyBtn.textContent = sinStock ? 'Sin stock' : 'Comprar ahora';
    document.body.classList.add('modal-open', 'no-scroll');
    window.lenis?.stop();
    backdrop.classList.add('open');
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  };

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.classList.remove('modal-open', 'no-scroll');
    window.lenis?.start();
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  }

  addBtn.addEventListener('click', () => {
    const p = getProducto(currentId);
    if (!p) return;
    Cart.add(p, talleSelect.value, 1);
    showToast(`Agregado: ${p.nombre} (talle ${talleSelect.value})`);
  });
  buyBtn.addEventListener('click', () => {
    const p = getProducto(currentId);
    if (!p) return;
    Cart.add(p, talleSelect.value, 1);
    closeModal();
    openDrawer();
  });
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
}

function cartLineTemplate(p, talle, qty) {
  return `
  <div class="cart-line" data-id="${p.id}" data-talle="${esc(talle)}">
    <img src="${p.imagen}" width="54" height="54" alt="${esc(p.nombre)}">
    <div class="cart-line-body">
      <div class="name">${esc(p.nombre)}</div>
      <div class="meta">Talle ${esc(talle)}</div>
      <div class="line-price">${formatearPrecio(precioFinal(p) * qty)}</div>
    </div>
    <div class="qty-stepper">
      <button type="button" data-line-minus aria-label="Restar cantidad"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg></button>
      <span class="qty-val">${qty}</span>
      <button type="button" data-line-plus aria-label="Sumar cantidad"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg></button>
    </div>
    <button type="button" class="cart-line-remove" data-line-remove aria-label="Quitar ${esc(p.nombre)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
  </div>`;
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const totalsWrap = document.getElementById('drawerTotals');
  const totalAmount = document.getElementById('drawerTotalAmount');
  const checkoutBtn = document.getElementById('drawerCheckout');
  const clearBtn = document.getElementById('drawerClear');
  if (!body) return;
  const items = Cart.get();

  if (!items.length) {
    body.innerHTML = `<div class="drawer-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
      <p>Todavía no agregaste productos.<br>Elegí tu camiseta o prenda favorita.</p>
    </div>`;
    totalsWrap.hidden = true;
    checkoutBtn.disabled = true;
    clearBtn.hidden = true;
    return;
  }

  body.innerHTML = items.map(i => { const p = getProducto(i.id); return p ? cartLineTemplate(p, i.talle, i.qty) : ''; }).join('');
  totalsWrap.hidden = false;
  totalAmount.textContent = formatearPrecio(Cart.total());
  checkoutBtn.disabled = false;
  clearBtn.hidden = false;
}

function openDrawer() {
  renderDrawer();
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
  document.body.classList.add('drawer-open', 'no-scroll');
  window.lenis?.stop();
  document.getElementById('drawerClose')?.focus();
}
function closeDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  document.body.classList.remove('drawer-open', 'no-scroll');
  window.lenis?.start();
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const clearBtn = document.getElementById('drawerClear');
  const checkoutBtn = document.getElementById('drawerCheckout');
  const body = document.getElementById('drawerBody');
  if (!drawer) return;

  document.querySelectorAll('[data-open-drawer]').forEach(btn => btn.addEventListener('click', openDrawer));
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  clearBtn.addEventListener('click', () => Cart.clear());
  checkoutBtn.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  body.addEventListener('click', e => {
    const line = e.target.closest('.cart-line');
    if (!line) return;
    const id = line.dataset.id, talle = line.dataset.talle;
    if (e.target.closest('[data-line-plus]')) {
      const current = Cart.get().find(i => i.id === id && i.talle === talle)?.qty || 1;
      Cart.setQty(id, talle, current + 1);
    } else if (e.target.closest('[data-line-minus]')) {
      const current = Cart.get().find(i => i.id === id && i.talle === talle)?.qty || 1;
      if (current <= 1) Cart.remove(id, talle); else Cart.setQty(id, talle, current - 1);
    } else if (e.target.closest('[data-line-remove]')) {
      Cart.remove(id, talle);
    }
  });

  renderDrawer();
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    revealsListos = true;
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
  revealsListos = true;
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  initNav();
  initFloats();
  initMarquee();
  initClubRail();
  initDestacadosRail();
  initClubSections();
  initCatalogo();
  initModal();
  initDrawer();
  updateCartBadge();
  initReveals();
});
