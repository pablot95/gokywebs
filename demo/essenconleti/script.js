/* =========================================================
   ESSEN CON LETI — script.js
   ========================================================= */

/* ---------- flag de versión de hero (animado / clásico) ---------- */
(function () {
  var p = new URLSearchParams(location.search);
  var clasico = p.get('estilo') === 'clasico' || location.hash === '#clasica';
  if (document.body) document.body.dataset.hero = clasico ? 'clasico' : 'animado';
})();

const WSP = '5492235920700';
const ENVIO_GRATIS_DESDE = 150000;
const BASE = location.pathname.includes('/producto/') ? '../' : '';

/* ---------- helpers ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => (CATEGORIAS.find(c => c.id === id)?.nombre) || 'Catálogo';
const img = name => BASE + 'images/' + name;

/* ---------- datos ---------- */
const CATEGORIAS = [
  { id: 'ollas', nombre: 'Ollas y Cacerolas' },
  { id: 'sartenes', nombre: 'Sartenes y Woks' },
  { id: 'utensilios', nombre: 'Utensilios' },
  { id: 'sets', nombre: 'Sets y Combos' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const PRODUCTOS = [
  // ---- ollas y cacerolas ----
  { id: 'cacerola-tapa', nombre: 'Cacerola con Tapa 20cm', linea: 'Acero Quirúrgico 5 Capas', cat: 'ollas', precio: 58000, descuento: 0, stock: 14, img: 'p-cacerola-tapa.jpg', destacado: false,
    desc: 'La cacerola de todos los días. Tapa hermética que cocina con el vapor de los propios alimentos: menos agua, menos aceite y más sabor en cada plato.' },
  { id: 'olla-grande', nombre: 'Olla Grande Multiuso 24cm', linea: 'Acero Quirúrgico 5 Capas', cat: 'ollas', precio: 79000, descuento: 10, stock: 9, img: 'p-olla-grande.jpg', destacado: true,
    desc: 'Ideal para guisos, salsas y comidas de toda la familia. Distribución de calor pareja de borde a borde, para que nada se pegue ni se queme.' },
  { id: 'olla-pastas', nombre: 'Olla para Pastas con Colador', linea: 'Acero Quirúrgico 5 Capas', cat: 'ollas', precio: 92000, descuento: 0, stock: 7, img: 'p-olla-pastas.jpg', destacado: true,
    desc: 'Colador incorporado que escurre sin quemarte las manos ni derramar una gota. La aliada de las tardes de fideos caseros.' },
  // ---- sartenes y woks ----
  { id: 'sarten-antiadherente', nombre: 'Sartén Antiadherente 24cm', linea: 'Antiadherente Premium', cat: 'sartenes', precio: 61000, descuento: 0, stock: 12, img: 'p-sarten-antiadherente.jpg', destacado: false,
    desc: 'Salteados perfectos con mínima cantidad de aceite. Superficie antiadherente de larga duración, apta para todo tipo de cocinas incluida inducción.' },
  { id: 'sarten-wok', nombre: 'Sartén Wok Profunda', linea: 'Acero Quirúrgico 5 Capas', cat: 'sartenes', precio: 74000, descuento: 15, stock: 8, img: 'p-sarten-wok.jpg', destacado: true,
    desc: 'Paredes altas para saltear, freír o cocinar al wok sin que nada se salga de la sartén. La preferida para las cenas rápidas entre semana.' },
  // ---- utensilios ----
  { id: 'set-cuchillos', nombre: 'Set de Cuchillos x3', linea: 'Acero Inoxidable', cat: 'utensilios', precio: 48000, descuento: 0, stock: 11, img: 'p-set-cuchillos.jpg', destacado: true,
    desc: 'Tres cuchillos esenciales -chef, puntilla y pan- con filo de larga duración y mango ergonómico. Todo lo que necesitás para picar sin esfuerzo.' },
  { id: 'tabla-picar', nombre: 'Tabla de Picar Premium', linea: 'Madera Maciza', cat: 'utensilios', precio: 26900, descuento: 0, stock: 16, img: 'p-tabla-picar.jpg', destacado: false,
    desc: 'Superficie amable con el filo de tus cuchillos, resistente a la humedad y fácil de mantener. La base de toda buena preparación.' },
  { id: 'molinillo', nombre: 'Molinillo de Sal y Pimienta', linea: 'Acero y Cerámica', cat: 'utensilios', precio: 22900, descuento: 0, stock: 13, img: 'p-molinillo.jpg', destacado: false,
    desc: 'Mecanismo de cerámica que gradúa la molienda según lo que estés cocinando. El detalle que hace que cualquier plato se sienta terminado.' },
  { id: 'espatula', nombre: 'Espátula de Madera Antiadherente', linea: 'Madera Natural', cat: 'utensilios', precio: 14900, descuento: 0, stock: 20, img: 'p-espatula.jpg', destacado: false,
    desc: 'Cuida la superficie de tus sartenes Essen mientras revolvés. Liviana, resistente al calor y cómoda de sostener durante horas de cocina.' },
  // ---- sets y combos ----
  { id: 'bateria-completa', nombre: 'Batería Completa x5 Piezas', linea: 'Acero Quirúrgico 5 Capas', cat: 'sets', precio: 312000, descuento: 12, stock: 5, img: 'p-bateria-completa.jpg', destacado: true,
    desc: 'La forma más completa de empezar: cacerolas, olla y sartén en un solo combo, pensado para equipar tu cocina de una sola vez y ahorrar.' },
  { id: 'combo-inicial', nombre: 'Combo Inicial Cocina Sana', linea: 'Selección Essen', cat: 'sets', precio: 198000, descuento: 0, stock: 8, img: 'p-combo-inicial.jpg', destacado: true,
    desc: 'La selección que arma Leti para quienes recién empiezan: lo justo y necesario para dejar de usar agua y aceite en tu cocina de todos los días.' },
  // ---- accesorios ----
  { id: 'dosificador-aceite', nombre: 'Dosificador de Aceite en Spray', linea: 'Vidrio y Acero', cat: 'accesorios', precio: 16900, descuento: 0, stock: 22, img: 'p-dosificador-aceite.jpg', destacado: false,
    desc: 'Controlá la cantidad exacta de aceite que usás. Un accesorio simple que suma a la propuesta de cocinar más liviano todos los días.' },
  { id: 'set-bowls', nombre: 'Set de Bowls Apilables x3', linea: 'Acero Inoxidable', cat: 'accesorios', precio: 34900, descuento: 20, stock: 10, img: 'p-set-bowls.jpg', destacado: false,
    desc: 'Tres tamaños que se guardan uno dentro del otro sin ocupar lugar. Perfectos para tener los ingredientes a mano antes de cocinar.' },
];

/* =========================================================
   CART (canónico)
   ========================================================= */
const Cart = {
  KEY: 'essenconleti_cart',
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

/* ---------- wishlist ---------- */
const Wish = {
  KEY: 'essenconleti_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const l = this.get(); const i = l.indexOf(id);
    if (i >= 0) l.splice(i, 1); else l.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(l));
    document.dispatchEvent(new CustomEvent('wish:updated'));
    return this.has(id);
  },
};

/* =========================================================
   TOAST
   ========================================================= */
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

/* =========================================================
   SVG icons
   ========================================================= */
const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
};

/* =========================================================
   PRODUCT CARD
   ========================================================= */
function cardHTML(p, stagger) {
  const pf = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge">-${p.descuento}%</span>`);
  if (p.stock <= 6) badges.push(`<span class="badge badge-new">Últimas unidades</span>`);
  const stamp = p.destacado ? `<span class="badge-stamp">Favorito<br>de Leti</span>` : '';
  const st = stagger ? ' data-animate data-animate-stagger style="transform:translateY(26px);opacity:0"' : '';
  return `<article class="prod-card"${st}>
    <div class="prod-badges">${badges.join('')}${stamp}</div>
    <button class="wish-btn${Wish.has(p.id) ? ' active' : ''}" data-wish="${p.id}" aria-label="Guardar en favoritos">${ICON.heart}</button>
    <a class="prod-media" href="${BASE}producto/index.html?id=${p.id}" aria-label="${esc(p.nombre)}">
      <img src="${img(p.img)}" alt="Essen ${esc(p.nombre)}" loading="lazy" width="1200" height="1200">
    </a>
    <div class="prod-body">
      <span class="prod-brand">${esc(p.linea)}</span>
      <h3 class="prod-name"><a href="${BASE}producto/index.html?id=${p.id}">${esc(p.nombre)}</a></h3>
      <div class="prod-price-row">
        <span class="prod-price">${formatearPrecio(pf)}</span>
        ${p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="prod-buttons">
        <button class="btn-add" data-add="${p.id}">${ICON.cart} Agregar</button>
        <button class="btn-buy" data-buy="${p.id}">Comprar ahora</button>
      </div>
    </div>
  </article>`;
}

/* =========================================================
   DRAWER CARRITO
   ========================================================= */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function renderCart() {
  const items = Cart.get();
  const wrap = $('#drawerItems'); if (!wrap) return;
  const count = Cart.count();
  const cc = $('#cartCount'); if (cc) { cc.textContent = count; cc.hidden = count === 0; cc.classList.remove('bump'); void cc.offsetWidth; if (count) cc.classList.add('bump'); }
  const dCount = $('#drawerCount'); if (dCount) dCount.textContent = count;

  if (!items.length) {
    wrap.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      <b>Tu carrito está vacío</b>
      <p>Sumá tus productos Essen favoritos y armá tu pedido.</p>
      <a href="${BASE}catalogo.html" class="btn btn-primary" style="margin-top:18px">Ver catálogo</a>
    </div>`;
    $('#drawerFoot').hidden = true;
    renderShipBar(0);
    return;
  }
  wrap.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const pf = precioFinal(p);
    return `<div class="cart-item">
      <img src="${img(p.img)}" alt="${esc(p.nombre)}" width="68" height="68">
      <div>
        <span class="ci-brand">${esc(p.linea)}</span>
        <div class="ci-name">${esc(p.nombre)}</div>
        <div class="ci-price">${formatearPrecio(pf)}</div>
        <div class="ci-controls">
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Restar">−</button>
            <input type="text" inputmode="numeric" value="${i.qty}" data-qtyinput="${p.id}" aria-label="Cantidad">
            <button data-inc="${p.id}" aria-label="Sumar">+</button>
          </div>
          <button class="ci-remove" data-remove="${p.id}">${ICON.trash} Quitar</button>
        </div>
      </div>
      <b>${formatearPrecio(pf * i.qty)}</b>
    </div>`;
  }).join('');
  $('#drawerFoot').hidden = false;
  $('#drawerTotal').textContent = formatearPrecio(Cart.total());
  renderShipBar(Cart.total());
}

function renderShipBar(total) {
  const bar = $('#shipBar'); if (!bar) return;
  if (total >= ENVIO_GRATIS_DESDE) {
    bar.className = 'ship-bar free';
    bar.innerHTML = `<p>🎉 ¡Tenés <b>envío gratis</b> a todo el país!</p><div class="ship-track"><div class="ship-fill" style="width:100%"></div></div>`;
  } else {
    const falta = ENVIO_GRATIS_DESDE - total;
    const pct = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);
    bar.className = 'ship-bar';
    bar.innerHTML = `<p>Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis a todo el país</p><div class="ship-track"><div class="ship-fill" style="width:${pct}%"></div></div>`;
  }
}

/* ---------- drawer open/close + focus trap ---------- */
let lastFocused = null;
function trapFocus(container, e) {
  const foco = container.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openDrawer() {
  lastFocused = document.activeElement;
  $('#cartDrawer').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('open');
  window.lenis?.stop();
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#cartClose')?.focus(), 100);
}
function closeDrawer() {
  $('#cartDrawer').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden', 'true');
  $('#overlay').classList.remove('open');
  window.lenis?.start();
  document.body.style.overflow = '';
  lastFocused?.focus();
}

/* =========================================================
   ADD / BUY / delegación global
   ========================================================= */
function addToCart(id, qty = 1, open = false) {
  const p = getProducto(id); if (!p) return;
  Cart.add(p, qty);
  if (open) openDrawer();
  else showToast('¡Agregado! Tu carrito te espera 🍲');
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  const buy = e.target.closest('[data-buy]');
  const wish = e.target.closest('[data-wish]');
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  const rem = e.target.closest('[data-remove]');
  if (add) { addToCart(add.dataset.add, 1, false); }
  if (buy) { addToCart(buy.dataset.buy, 1, true); }
  if (wish) { const on = Wish.toggle(wish.dataset.wish); wish.classList.toggle('active', on); showToast(on ? 'Guardado en favoritos ♥' : 'Quitado de favoritos'); }
  if (inc) { const it = Cart.get().find(i => i.id === inc.dataset.inc); Cart.setQty(inc.dataset.inc, (it?.qty || 1) + 1); }
  if (dec) { const it = Cart.get().find(i => i.id === dec.dataset.dec); Cart.setQty(dec.dataset.dec, (it?.qty || 1) - 1); }
  if (rem) { Cart.remove(rem.dataset.remove); }
});

document.addEventListener('input', (e) => {
  const qi = e.target.closest('[data-qtyinput]');
  if (qi) { const v = parseInt(qi.value.replace(/\D/g, ''), 10); if (!isNaN(v)) Cart.setQty(qi.dataset.qtyinput, v); }
});

document.addEventListener('cart:updated', renderCart);

/* =========================================================
   PÁGINA: HOME
   ========================================================= */
function initHome() {
  const destList = $('#destList');
  if (destList) {
    const destacados = PRODUCTOS.filter(p => p.destacado);
    destList.innerHTML = destacados.map(p => `<li class="splide__slide">${cardHTML(p, false)}</li>`).join('');
    if (typeof Splide !== 'undefined') {
      new Splide('#destSplide', {
        perPage: 4, gap: '20px', padding: { right: '6%' }, pagination: false, arrows: true,
        breakpoints: { 1024: { perPage: 3 }, 768: { perPage: 2, padding: { right: '12%' } }, 560: { perPage: 1, padding: { right: '22%' } } },
      }).mount();
    }
  }
  // mini-cards de productos en el hero túnel
  const heroCards = $('#heroProdCards');
  if (heroCards) {
    const picks = PRODUCTOS.filter(p => p.destacado).slice(0, 3);
    heroCards.innerHTML = picks.map(p => `<a class="mini-card" href="${BASE}producto/index.html?id=${p.id}">
      <img src="${img(p.img)}" alt="${esc(p.nombre)}" loading="lazy" width="190" height="190">
      <div class="mc-body"><span class="mc-cat">${esc(p.linea)}</span><span class="mc-name">${esc(p.nombre)}</span><span class="mc-price">${formatearPrecio(precioFinal(p))}</span></div>
    </a>`).join('');
  }
}

/* =========================================================
   PÁGINA: CATÁLOGO
   ========================================================= */
function initCatalog() {
  const grid = $('#catalogGrid'); if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = { cat: params.get('cat') || 'all', offer: 'all', q: '', sort: 'destacados', shown: 12 };
  const PER = 12;

  // chips categorías
  const catChips = $('#catChips');
  catChips.innerHTML = `<button class="chip${state.cat === 'all' ? ' active' : ''}" data-cat="all">Todas <span class="chip-n">${PRODUCTOS.length}</span></button>` +
    CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return `<button class="chip${state.cat === c.id ? ' active' : ''}" data-cat="${c.id}">${esc(c.nombre)} <span class="chip-n">${n}</span></button>`;
    }).join('');

  function filtered() {
    let list = PRODUCTOS.slice();
    if (state.cat !== 'all') list = list.filter(p => p.cat === state.cat);
    if (state.offer === 'sale') list = list.filter(p => p.descuento > 0);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p => (p.nombre + ' ' + p.linea + ' ' + catNombre(p.cat)).toLowerCase().includes(q));
    }
    if (state.sort === 'precio-asc') list.sort((a, b) => precioFinal(a) - precioFinal(b));
    else if (state.sort === 'precio-desc') list.sort((a, b) => precioFinal(b) - precioFinal(a));
    else if (state.sort === 'nombre') list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    else list.sort((a, b) => (b.destacado - a.destacado) || (b.descuento - a.descuento));
    return list;
  }

  function render() {
    const list = filtered();
    const visible = list.slice(0, state.shown);
    $('#catalogCount').innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'producto' : 'productos'}`;
    if (!list.length) {
      grid.innerHTML = `<div class="no-results">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <b>No encontramos productos</b>
        <p>Probá con otra búsqueda o quitá algún filtro.</p>
        <button class="btn btn-dark" id="clearFilters" style="margin-top:16px">Ver todo el catálogo</button>
      </div>`;
      $('#loadMore').hidden = true;
      $('#clearFilters')?.addEventListener('click', () => { state.cat = 'all'; state.offer = 'all'; state.q = ''; state.shown = PER; syncUI(); render(); });
      return;
    }
    grid.innerHTML = visible.map(p => cardHTML(p, true)).join('');
    $('#loadMore').hidden = state.shown >= list.length;
    refreshReveal();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function syncUI() {
    $$('#catChips .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === state.cat));
    $$('[data-offer]').forEach(c => c.classList.toggle('active', c.dataset.offer === state.offer));
    updateHead();
  }

  function updateHead() {
    const title = state.cat === 'all' ? 'Todo el catálogo' : catNombre(state.cat);
    $('#catalogTitle').textContent = title;
    $('#crumbCat').textContent = title;
    document.title = `${title} — Essen con Leti`;
  }

  // eventos filtros
  catChips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; state.shown = PER; syncUI(); render(); });
  $$('[data-offer]').forEach(b => b.addEventListener('click', () => { state.offer = b.dataset.offer; state.shown = PER; syncUI(); render(); }));
  let tmo; $('#searchInput').addEventListener('input', e => { clearTimeout(tmo); tmo = setTimeout(() => { state.q = e.target.value.trim(); state.shown = PER; render(); }, 220); });
  $('#sortSelect').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#loadMore').addEventListener('click', () => { state.shown += PER; render(); });

  // filtros mobile
  const filters = $('#filters'), backdrop = $('#filtersBackdrop'), fToggle = $('#filterToggle');
  function openFilters() { filters.classList.add('open'); backdrop.classList.add('open'); fToggle.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
  function closeFilters() { filters.classList.remove('open'); backdrop.classList.remove('open'); fToggle.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
  fToggle?.addEventListener('click', openFilters);
  $('#filtersClose')?.addEventListener('click', closeFilters);
  backdrop?.addEventListener('click', closeFilters);
  filters?.addEventListener('click', e => { if (e.target.closest('.chip') && window.innerWidth <= 860) setTimeout(closeFilters, 150); });

  updateHead();
  render();
}

/* =========================================================
   PÁGINA: PRODUCTO
   ========================================================= */
function initProducto() {
  const cont = $('#pdpContent'); if (!cont) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = getProducto(id);

  if (!p) {
    cont.innerHTML = `<div class="pdp-notfound">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <h1>Producto no encontrado</h1>
      <p>Puede que ya no esté disponible o el enlace sea incorrecto.</p>
      <a href="${BASE}catalogo.html" class="btn btn-primary">Volver al catálogo</a>
    </div>`;
    return;
  }

  const pf = precioFinal(p);
  const cuota = Math.round(pf / 3);
  document.title = `Essen ${p.nombre} — Essen con Leti`;
  const stockLow = p.stock <= 6;

  cont.innerHTML = `
    <nav class="breadcrumb" aria-label="Ruta"><a href="${BASE}index.html">Inicio</a> · <a href="${BASE}catalogo.html?cat=${p.cat}">${esc(catNombre(p.cat))}</a> · <span>${esc(p.nombre)}</span></nav>
    <div class="pdp-grid">
      <div class="pdp-gallery">
        <div class="pdp-main-img"><img src="${img(p.img)}" alt="Essen ${esc(p.nombre)}" width="1200" height="1200"></div>
      </div>
      <div class="pdp-info">
        <span class="prod-brand">${esc(p.linea)}</span>
        <h1>${esc(p.nombre)}</h1>
        <div class="pdp-price-row">
          <span class="pdp-price">${formatearPrecio(pf)}</span>
          ${p.descuento > 0 ? `<s class="pdp-price-old">${formatearPrecio(p.precio)}</s><span class="pdp-price-badge">-${p.descuento}%</span>` : ''}
        </div>
        <p class="pdp-cuotas">o <b>3 cuotas sin interés</b> de ${formatearPrecio(cuota)}</p>
        <p class="pdp-desc">${esc(p.desc)}</p>
        <div class="pdp-stock ${stockLow ? 'low' : ''}"><span class="dot"></span>${stockLow ? `¡Últimas ${p.stock} unidades!` : 'Disponible · coordinamos entrega con Leti'}</div>
        <div class="pdp-buy-row">
          <div class="qty">
            <button id="pdpDec" aria-label="Restar">−</button>
            <input type="text" inputmode="numeric" value="1" id="pdpQty" aria-label="Cantidad">
            <button id="pdpInc" aria-label="Sumar">+</button>
          </div>
          <button class="btn btn-add" id="pdpAdd" style="padding:14px 24px">${ICON.cart} Agregar al carrito</button>
          <button class="btn btn-primary" id="pdpBuy">Comprar ahora</button>
          <button class="wish-btn${Wish.has(p.id) ? ' active' : ''}" data-wish="${p.id}" aria-label="Guardar en favoritos" style="position:static">${ICON.heart}</button>
        </div>
        <ul class="pdp-features">
          <li>${ICON.check}<span><b>100% original</b> — revendedora oficial Essen</span></li>
          <li>${ICON.check}<span><b>Garantía de por vida</b> respaldada por Essen</span></li>
          <li>${ICON.check}<span><b>Cuotas sin interés</b> con todas las tarjetas</span></li>
          <li>${ICON.check}<span><b>Envío a todo el país</b>, coordinado por Leti</span></li>
        </ul>
      </div>
    </div>`;

  const qtyEl = $('#pdpQty');
  const getQty = () => Math.max(1, parseInt(qtyEl.value.replace(/\D/g, ''), 10) || 1);
  $('#pdpInc').addEventListener('click', () => qtyEl.value = Math.min(getQty() + 1, p.stock));
  $('#pdpDec').addEventListener('click', () => qtyEl.value = Math.max(1, getQty() - 1));
  qtyEl.addEventListener('input', () => { qtyEl.value = qtyEl.value.replace(/\D/g, ''); });
  qtyEl.addEventListener('blur', () => qtyEl.value = getQty());
  $('#pdpAdd').addEventListener('click', () => addToCart(p.id, getQty(), false));
  $('#pdpBuy').addEventListener('click', () => addToCart(p.id, getQty(), true));

  // vistos recientemente
  try {
    const K = 'essenconleti_vistos';
    let v = JSON.parse(localStorage.getItem(K)) || [];
    v = [p.id, ...v.filter(x => x !== p.id)].slice(0, 8);
    localStorage.setItem(K, JSON.stringify(v));
  } catch {}

  // relacionados
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (rel.length) {
    $('#relatedSection').hidden = false;
    $('#relatedGrid').innerHTML = rel.map(x => cardHTML(x, true)).join('');
  }

  // sticky add-to-cart mobile
  const sticky = $('#stickyAtc');
  if (sticky) {
    $('#saPrice').textContent = formatearPrecio(pf);
    $('#saName').textContent = p.nombre;
    sticky.hidden = false;
    $('#saAdd').addEventListener('click', () => addToCart(p.id, getQty(), true));
    const addBtn = $('#pdpAdd');
    if ('IntersectionObserver' in window && addBtn) {
      new IntersectionObserver(([e]) => {
        sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0);
      }, { threshold: 0 }).observe(addBtn);
    }
  }

  // JSON-LD Product
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Product",
    name: `Essen ${p.nombre}`, brand: { "@type": "Brand", name: "Essen" },
    description: p.desc, image: img(p.img), category: catNombre(p.cat),
    offers: { "@type": "Offer", price: pf, priceCurrency: "ARS", availability: "https://schema.org/InStock" }
  });
  document.head.appendChild(ld);
}

/* =========================================================
   ANIMACIONES (reveal + subrayado dibujado + hero túnel)
   ========================================================= */
function refreshReveal() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  $$('[data-animate]').forEach(el => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    const sib = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-animate-stagger')) : [];
    const idx = el.hasAttribute('data-animate-stagger') ? sib.indexOf(el) : 0;
    gsap.to(el, {
      opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out',
      delay: Math.min(idx, 6) * 0.09,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
}

function initScribbles() {
  const paths = $$('.accent-underline path');
  if (!paths.length) return;
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  paths.forEach(path => {
    if (typeof DrawSVGPlugin !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(DrawSVGPlugin);
      gsap.set(path, { drawSVG: '0%' });
      gsap.to(path, { drawSVG: '100%', duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: path, start: 'top 85%' } });
    }
  });
}

function initHeroTunnel() {
  const hero = document.getElementById('hero');
  const animado = document.body.dataset.hero === 'animado';
  const iframe = document.getElementById('hero-bg');

  if (!animado) { refreshReveal(); initScribbles(); return; }

  if (iframe && iframe.dataset.src && !iframe.src) iframe.src = iframe.dataset.src;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canTunnel = hero && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduce;

  if (iframe) {
    const post = () => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const max = hero.offsetHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, -r.top / max)) : 0;
      iframe.contentWindow?.postMessage({ type: 'scroll', progress }, '*');
    };
    window.addEventListener('scroll', post, { passive: true });
    window.addEventListener('resize', post);
    iframe.addEventListener('load', post);
    post();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        iframe.style.visibility = e.isIntersecting ? 'visible' : 'hidden';
      }, { threshold: 0 }).observe(hero);
    }
  }

  if (!canTunnel) { refreshReveal(); initScribbles(); return; }

  hero.classList.add('hero--tunnel');
  const beats = Array.from(hero.querySelectorAll('[data-beat]'));
  const floats = Array.from(hero.querySelectorAll('[data-float]'));
  const step = 1;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.6 }
  });

  beats.forEach((c, i) => {
    const last = i === beats.length - 1;
    const t0 = i * step;
    if (i === 0) {
      tl.to(c, { scale: 1.5, duration: step * 0.6, ease: "power1.in" }, t0 + step * 0.3)
        .to(c, { autoAlpha: 0, duration: step * 0.3, ease: "power2.in" }, t0 + step * 0.75);
    } else {
      gsap.set(c, { scale: 0.46, autoAlpha: 0, transformOrigin: "50% 50%" });
      tl.to(c, { autoAlpha: 1, duration: step * 0.2 }, t0)
        .to(c, { scale: 1, duration: step * 0.4, ease: "power1.in" }, t0);
      if (!last) tl.to(c, { scale: 1.55, duration: step * 0.45, ease: "power1.in" }, t0 + step)
        .to(c, { autoAlpha: 0, duration: step * 0.32 }, t0 + step * 1.05);
    }
  });

  floats.forEach((f, i) => {
    const near = f.dataset.float === 'near';
    const start = 1.4 + i * 0.25;
    gsap.set(f, { scale: near ? 0.3 : 0.5, autoAlpha: 0 });
    tl.to(f, { autoAlpha: 1, duration: step * 0.25 }, start)
      .to(f, { scale: near ? 1.12 : 1, duration: step * 0.9, ease: 'none' }, start)
      .to(f, { scale: near ? 1.9 : 1.5, autoAlpha: 0, duration: step * 0.6, ease: 'power1.in' }, start + step * 1.1);
  });

  refreshReveal();
  initScribbles();
}

/* =========================================================
   UI GLOBAL (header, drawer, menú, esc)
   ========================================================= */
function initUI() {
  $('#cartToggle')?.addEventListener('click', openDrawer);
  $('#cartClose')?.addEventListener('click', closeDrawer);
  $('#overlay')?.addEventListener('click', closeDrawer);
  $('#checkoutBtn')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    if (typeof confetti === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#b4291f', '#b5752f', '#241811', '#ffffff'] });
    }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  const menuToggle = $('#menuToggle'), nav = $('#mainNav');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    if (open) { window.lenis?.stop(); document.body.style.overflow = 'hidden'; }
    else { window.lenis?.start(); document.body.style.overflow = ''; }
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('open')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); window.lenis?.start(); document.body.style.overflow = ''; }
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('#cartDrawer')?.classList.contains('open')) closeDrawer();
      if (nav?.classList.contains('open')) { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); window.lenis?.start(); document.body.style.overflow = ''; }
      const filters = $('#filters'); if (filters?.classList.contains('open')) { filters.classList.remove('open'); $('#filtersBackdrop')?.classList.remove('open'); document.body.style.overflow = ''; }
    }
    if (e.key === 'Tab' && $('#cartDrawer')?.classList.contains('open')) trapFocus($('#cartDrawer'), e);
  });

  const wsp = $('#wsp-float');
  if (wsp) window.addEventListener('scroll', () => {
    if (window.scrollY > 600) wsp.classList.add('visible'); else wsp.classList.remove('visible');
  }, { passive: true });

  document.addEventListener('wish:updated', () => {
    $$('[data-wish]').forEach(b => b.classList.toggle('active', Wish.has(b.dataset.wish)));
  });
}

/* =========================================================
   LENIS + BOOT
   ========================================================= */
function initMotion() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const lenis = new Lenis();
    window.lenis = lenis;
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMotion();
  initUI();
  renderCart();
  initHome();
  initCatalog();
  initProducto();
  initHeroTunnel();
});
