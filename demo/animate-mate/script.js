const WHATSAPP_NUMBER = '5491156304490';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'mates', nombre: 'Mates' },
  { id: 'bombillas', nombre: 'Bombillas' },
  { id: 'yerba', nombre: 'Yerba Mate' },
  { id: 'termos', nombre: 'Termos' },
  { id: 'kits', nombre: 'Kits y Regalos' },
];

const PRODUCTOS = [
  { id: 'p1', slug: 'mate-camionero-negro', nombre: 'Mate Camionero Negro', categoria: 'mates', subcategoria: 'Cerámica', precio: 18500, descuento: 0, stock: 24, destacado: true, imagen: 'images/mate-camionero-negro.webp', descripcion: 'Mate de cerámica esmaltada negra con virola de alpaca grabada a mano. Base ancha, ideal para cebar parado.', tags: ['ceramica', 'negro', 'virola'] },
  { id: 'p2', slug: 'mate-imperial-grabado', nombre: 'Mate Imperial Grabado', categoria: 'mates', subcategoria: 'Cerámica', precio: 25400, descuento: 10, stock: 4, destacado: true, imagen: 'images/mate-camionero-negro.webp', descripcion: 'Edición con guarda tallada en la virola e interior curado. Para quien ya tiene el mate de todos los días.', tags: ['premium', 'grabado', 'edicion'] },
  { id: 'p3', slug: 'mate-mini-para-dos', nombre: 'Mate Mini para Dos', categoria: 'mates', subcategoria: 'Cerámica', precio: 15800, descuento: 0, stock: 30, destacado: false, imagen: 'images/mate-camionero-negro.webp', descripcion: 'Versión reducida, pensada para compartir una ronda corta o para llevar de mano.', tags: ['chico', 'compartir'] },
  { id: 'p4', slug: 'bombilla-alpaca-grabada', nombre: 'Bombilla de Alpaca Grabada', categoria: 'bombillas', subcategoria: 'Alpaca', precio: 9200, descuento: 0, stock: 40, destacado: true, imagen: 'images/bombilla-acero.webp', descripcion: 'Pico de cuchara calada, cuerpo de alpaca con guarda tallada. Resorte de acero inoxidable, fácil de limpiar.', tags: ['alpaca', 'grabada', 'cuchara'] },
  { id: 'p5', slug: 'bombilla-acero-clasica', nombre: 'Bombilla de Acero Clásica', categoria: 'bombillas', subcategoria: 'Acero', precio: 5400, descuento: 0, stock: 55, destacado: false, imagen: 'images/bombilla-acero.webp', descripcion: 'El clásico de todos los días: acero inoxidable 304, pico recto y resorte reforzado.', tags: ['acero', 'clasica', 'diaria'] },
  { id: 'p6', slug: 'yerba-elaborada-con-palo-500g', nombre: 'Yerba Elaborada con Palo 500g', categoria: 'yerba', subcategoria: 'Con palo', precio: 3200, descuento: 0, stock: 120, destacado: true, imagen: 'images/yerba-mate-con-palo.webp', descripcion: 'Sabor intenso y tradicional, con palo. La elección de quien ceba fuerte.', tags: ['tradicional', 'palo', 'intensa'] },
  { id: 'p7', slug: 'yerba-despalada-500g', nombre: 'Yerba Despalada 500g', categoria: 'yerba', subcategoria: 'Despalada', precio: 3600, descuento: 0, stock: 85, destacado: false, imagen: 'images/yerba-mate-con-palo.webp', descripcion: 'Sin palo, más suave y rendidora. Ideal para mates de cebado prolongado.', tags: ['suave', 'despalada', 'rendidora'] },
  { id: 'p8', slug: 'yerba-suave-1kg', nombre: 'Yerba Suave 1kg', categoria: 'yerba', subcategoria: 'Suave', precio: 7300, descuento: 15, stock: 60, destacado: false, imagen: 'images/yerba-mate-con-palo.webp', descripcion: 'Molienda suave en formato familiar de 1kg, para la casa que ceba todo el día.', tags: ['familiar', 'suave', 'kilo'] },
  { id: 'p9', slug: 'termo-matero-1l-crema', nombre: 'Termo Matero 1L Crema', categoria: 'termos', subcategoria: '1 litro', precio: 28900, descuento: 0, stock: 18, destacado: true, imagen: 'images/termo-matero.webp', descripcion: 'Acero inoxidable doble pared, mantiene la temperatura hasta 12 horas. Pico cebador y asa reforzada.', tags: ['acero', 'crema', 'doble pared'] },
  { id: 'p10', slug: 'termo-matero-12l-acero', nombre: 'Termo Matero 1.2L Acero', categoria: 'termos', subcategoria: '1.2 litros', precio: 32500, descuento: 0, stock: 0, destacado: false, imagen: 'images/termo-matero.webp', descripcion: 'Mayor capacidad para rondas largas, terminación acero natural y tapa rosca a prueba de derrames.', tags: ['grande', 'rondas largas'] },
  { id: 'p11', slug: 'kit-matero-iniciacion', nombre: 'Kit Matero de Iniciación', categoria: 'kits', subcategoria: 'Regalo', precio: 38800, descuento: 10, stock: 20, destacado: true, imagen: 'images/kit-matero-regalo.webp', descripcion: 'Mate, bombilla, yerba de 500g y cucharita dosificadora — todo en una caja lista para regalar.', tags: ['regalo', 'caja', 'iniciacion'] },
  { id: 'p12', slug: 'set-premium-bolso-cuero', nombre: 'Set Premium con Bolso de Cuero', categoria: 'kits', subcategoria: 'Regalo', precio: 52000, descuento: 0, stock: 8, destacado: true, imagen: 'images/animate-mate-hero.webp', descripcion: 'Mate, bombilla, mate cocido de cerámica y manta, presentados en bolso matero de cuero genuino.', tags: ['premium', 'cuero', 'regalo'] },
  { id: 'p13', slug: 'bolso-matero-cuero', nombre: 'Bolso Matero de Cuero', categoria: 'kits', subcategoria: 'Accesorios', precio: 19800, descuento: 0, stock: 15, destacado: false, imagen: 'images/bolso-matero-cuero.webp', descripcion: 'Cuero genuino curtido vegetal, cierre a presión y correa ajustable. Guarda el equipo matero completo.', tags: ['cuero', 'bolso', 'accesorio'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'animatemate_cart',
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

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initWhatsAppLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`);
  });
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
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function badgeHtml(p) {
  if (p.stock === 0) return '<span class="prod-badge prod-badge--sold">Agotado</span>';
  if (p.descuento > 0) return `<span class="prod-badge prod-badge--sale">-${p.descuento}%</span>`;
  if (p.stock <= 5) return '<span class="prod-badge prod-badge--low">Últimas unidades</span>';
  return '';
}

function cardHtml(p) {
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  const disabled = p.stock === 0 ? 'disabled' : '';
  return `
  <article class="prod-card" data-id="${p.id}" data-animate="scale" style="transform:scale(.94) translateY(16px);opacity:0">
    <button type="button" class="prod-media" data-open-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${badgeHtml(p)}
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy">
    </button>
    <div class="prod-body">
      <p class="prod-cat">${esc(CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '')}</p>
      <h3 class="prod-name"><button type="button" data-open-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <div class="prod-actions">
        <div class="qty-stepper" data-qty-wrap="${p.id}">
          <button type="button" data-qty-minus="${p.id}" aria-label="Restar cantidad">−</button>
          <span data-qty-val="${p.id}">1</span>
          <button type="button" data-qty-plus="${p.id}" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}" ${disabled}>${p.stock === 0 ? 'Agotado' : 'Agregar'}</button>
      </div>
    </div>
  </article>`;
}

const qtyState = {};
function getQty(id) { return qtyState[id] || 1; }

function renderDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = destacados.map(cardHtml).join('');
}

function renderCategorias() {
  const wrap = document.getElementById('categoriasGrid');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIAS.map(c => {
    const ejemplo = PRODUCTOS.find(p => p.categoria === c.id);
    const count = PRODUCTOS.filter(p => p.categoria === c.id).length;
    if (!ejemplo) return '';
    return `
    <button type="button" class="cat-card" data-goto-cat="${c.id}" data-animate="up" style="transform:translateY(40px);opacity:0">
      <img src="${ejemplo.imagen}" alt="${esc(c.nombre)}" width="1200" height="1200" loading="lazy">
      <span class="cat-card-label"><strong>${esc(c.nombre)}</strong><small>${count} producto${count === 1 ? '' : 's'}</small></span>
    </button>`;
  }).join('');
}

const filterState = { q: '', cat: 'all', precio: 'all' };

function precioEnRango(precio, rango) {
  if (rango === 'all') return true;
  if (rango === 'bajo') return precio < 10000;
  if (rango === 'medio') return precio >= 10000 && precio <= 25000;
  if (rango === 'alto') return precio > 25000;
  return true;
}

function productosFiltrados() {
  const q = normalizar(filterState.q);
  return PRODUCTOS.filter(p => {
    if (filterState.cat !== 'all' && p.categoria !== filterState.cat) return false;
    if (!precioEnRango(precioFinal(p), filterState.precio)) return false;
    if (!q) return true;
    const cat = CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '';
    const haystack = normalizar([p.nombre, cat, p.subcategoria, p.descripcion, ...(p.tags || [])].join(' '));
    return haystack.includes(q);
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const count = document.getElementById('catalogoCount');
  const empty = document.getElementById('catalogoEmpty');
  if (!grid) return;
  const items = productosFiltrados();
  grid.innerHTML = items.map(cardHtml).join('');
  if (count) count.textContent = `${items.length} producto${items.length === 1 ? '' : 's'}`;
  if (empty) empty.hidden = items.length !== 0;
  wireCardEvents(grid);
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initFiltros() {
  const search = document.getElementById('catalogoSearch');
  const chips = document.querySelectorAll('[data-filter-cat]');
  const precio = document.getElementById('filtroPrecio');
  const clear = document.getElementById('filtroClear');
  search?.addEventListener('input', () => { filterState.q = search.value; renderCatalogo(); });
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filterState.cat = chip.dataset.filterCat;
    renderCatalogo();
  }));
  precio?.addEventListener('change', () => { filterState.precio = precio.value; renderCatalogo(); });
  clear?.addEventListener('click', () => {
    filterState.q = ''; filterState.cat = 'all'; filterState.precio = 'all';
    if (search) search.value = '';
    if (precio) precio.value = 'all';
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === 'all'));
    renderCatalogo();
  });
}

function gotoCategoria(catId) {
  const chip = document.querySelector(`[data-filter-cat="${catId}"]`);
  document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.remove('is-active'));
  chip?.classList.add('is-active');
  filterState.cat = catId;
  renderCatalogo();
  document.getElementById('tienda')?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function renderDrawer() {
  const list = document.getElementById('drawerItems');
  const totalEl = document.getElementById('drawerTotal');
  const empty = document.getElementById('drawerEmpty');
  if (!list) return;
  const items = Cart.get();
  if (!items.length) {
    list.innerHTML = '';
    if (empty) empty.hidden = false;
    if (totalEl) totalEl.textContent = formatearPrecio(0);
    return;
  }
  if (empty) empty.hidden = true;
  list.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const final = precioFinal(p);
    return `
    <li class="drawer-item">
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="120" height="120" loading="lazy">
      <div class="drawer-item-info">
        <p class="drawer-item-name">${esc(p.nombre)}</p>
        <p class="drawer-item-price">${formatearPrecio(final)}</p>
        <div class="qty-stepper qty-stepper--sm">
          <button type="button" data-drawer-minus="${p.id}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-drawer-plus="${p.id}" aria-label="Sumar">+</button>
        </div>
      </div>
      <button type="button" class="drawer-item-remove" data-drawer-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </li>`;
  }).join('');
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
}
document.addEventListener('cart:updated', renderDrawer);

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  renderDrawer();
  drawer.classList.add('open'); drawer.removeAttribute('inert');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll', 'drawer-open');
  window.lenis?.stop();
  drawer.querySelector('button, a')?.focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  drawer.classList.remove('open'); drawer.setAttribute('inert', '');
  backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll', 'drawer-open');
  window.lenis?.start();
}

function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('cart-header')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-float')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCartDrawer(); });
  drawer.addEventListener('click', e => {
    const minus = e.target.closest('[data-drawer-minus]');
    const plus = e.target.closest('[data-drawer-plus]');
    const remove = e.target.closest('[data-drawer-remove]');
    if (minus) { const id = minus.dataset.drawerMinus; const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty - 1 <= 0 ? (Cart.remove(id), 0) : it.qty - 1); }
    if (plus) { const id = plus.dataset.drawerPlus; const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty + 1); }
    if (remove) Cart.remove(remove.dataset.drawerRemove);
  });
  document.getElementById('drawerCheckout')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    if (typeof confetti === 'function' && !reduceMotion) {
      confetti({ particleCount: 70, spread: 65, origin: { y: 0.7 }, colors: ['#000000', '#333333', '#2F4A3B'] });
    }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}

function wireCardEvents(scope) {
  scope.querySelectorAll('[data-qty-minus]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.qtyMinus;
    qtyState[id] = Math.max(1, getQty(id) - 1);
    scope.querySelectorAll(`[data-qty-val="${id}"]`).forEach(el => el.textContent = qtyState[id]);
  }));
  scope.querySelectorAll('[data-qty-plus]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.qtyPlus; const p = getProducto(id);
    qtyState[id] = Math.min(p?.stock ?? 99, getQty(id) + 1);
    scope.querySelectorAll(`[data-qty-val="${id}"]`).forEach(el => el.textContent = qtyState[id]);
  }));
  scope.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.add; const p = getProducto(id); if (!p || p.stock === 0) return;
    Cart.add(p, getQty(id));
    showToast('¡Agregado! Tu carrito te espera.');
  }));
  scope.querySelectorAll('[data-open-quick]').forEach(el => el.addEventListener('click', () => openQuickView(el.dataset.openQuick)));
}

function openQuickView(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickView');
  if (!p || !modal) return;
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  modal.querySelector('[data-qv-body]').innerHTML = `
    <div class="qv-media">${badgeHtml(p)}<img src="${p.imagen}" alt="${esc(p.nombre)}" width="1200" height="1200"></div>
    <div class="qv-info">
      <p class="prod-cat">${esc(CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '')}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <p class="qv-desc">${esc(p.descripcion)}</p>
      <div class="prod-actions">
        <div class="qty-stepper" data-qty-wrap="${p.id}">
          <button type="button" data-qty-minus="${p.id}" aria-label="Restar cantidad">−</button>
          <span data-qty-val="${p.id}">1</span>
          <button type="button" data-qty-plus="${p.id}" aria-label="Sumar cantidad">+</button>
        </div>
      </div>
      <div class="qv-ctas">
        <button type="button" class="btn btn-ghost" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Agotado' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn-cta" data-buy-now="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>Comprar ahora</button>
      </div>
      ${relacionados.length ? `<div class="qv-relacionados"><p>También te puede interesar</p><div class="qv-relacionados-grid">${relacionados.map(r => `<button type="button" data-open-quick="${r.id}"><img src="${r.imagen}" alt="${esc(r.nombre)}" width="200" height="200" loading="lazy"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;
  qtyState[p.id] = 1;
  wireCardEvents(modal);
  modal.querySelector('[data-buy-now]')?.addEventListener('click', () => {
    Cart.add(p, getQty(p.id));
    closeQuickView();
    openCartDrawer();
  });
  modal.classList.add('open'); modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  modal.querySelector('.qv-close')?.focus();
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.classList.remove('open'); modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
}

function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.querySelector('.qv-close')?.addEventListener('click', closeQuickView);
  modal.querySelector('.qv-backdrop')?.addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeQuickView(); });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initFloats() {
  const cart = document.getElementById('cart-float');
  const wsp = document.getElementById('wsp-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

function initDestacadosRail() {
  const vp = document.getElementById('destacadosRail');
  if (!vp) return;
  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
  initRailDrag(vp);
}

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || typeof gsap === 'undefined') return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    revealsListos = true;
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    left: { x: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
  };
  items.forEach(el => {
    if (el.classList.contains('in')) return;
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => el.classList.add('in'),
    });
  });
  revealsListos = true;
}

function revelarNuevos(container) {
  if (!revealsListos) return;
  const items = container.querySelectorAll('[data-animate]:not(.in)');
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('in'); });
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
  };
  items.forEach((el, i) => {
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: Math.min(i * 0.06, 0.4),
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      onComplete: () => el.classList.add('in'),
    });
  });
}

function initCebadoChapter() {
  const stage = document.getElementById('cebadoStage');
  const grid = document.getElementById('cebadoGrid');
  const visual = document.getElementById('cebadoVisual');
  const pasos = document.querySelectorAll('#cebadoPasos li');
  if (!stage || !grid || !visual || !pasos.length) return;

  const yerbaFill = document.getElementById('yerbaFill');
  const bombillaEl = document.getElementById('bombillaMate');
  const vapor = document.getElementById('vaporMate');
  const glow = visual.querySelector('.mate-glow');

  const setStep = progress => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach(li => li.classList.toggle('is-on', Number(li.dataset.paso) === idx));
  };

  if (typeof gsap === 'undefined') { setStep(0); return; }

  if (reduceMotion) {
    if (yerbaFill) yerbaFill.style.clipPath = 'inset(0% 0 0 0)';
    if (bombillaEl) bombillaEl.style.transform = 'translateY(0)';
    if (bombillaEl) bombillaEl.style.opacity = 1;
    if (vapor) vapor.style.opacity = .5;
    if (glow) glow.classList.add('is-lit');
    pasos.forEach((li, i) => li.classList.toggle('is-on', i === pasos.length - 1));
    return;
  }

  const buildTimeline = () => {
    const tl = gsap.timeline({ paused: true });
    if (yerbaFill) tl.to(yerbaFill, { clipPath: 'inset(38% 0 0 0)', ease: 'none', duration: 1 }, .1);
    if (bombillaEl) tl.to(bombillaEl, { y: 0, opacity: 1, ease: 'none', duration: .8 }, 1.15);
    if (vapor) tl.to(vapor, { opacity: .55, y: -14, ease: 'none', duration: .8 }, 2.05);
    if (glow) tl.call(() => glow.classList.add('is-lit'), null, 2.05).call(() => glow.classList.remove('is-lit'), null, 0);
    return tl;
  };

  ScrollTrigger.matchMedia({
    '(min-width: 1081px)': () => {
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: stage, start: 'top top', end: '+=220%', pin: true, scrub: .6,
        anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => st.kill();
    },
    '(max-width: 1080px) and (prefers-reduced-motion: no-preference)': () => {
      stage.classList.add('is-sticky-mobile');
      let inner = grid.querySelector('.sticky-inner');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'sticky-inner';
        inner.appendChild(visual);
        inner.appendChild(document.getElementById('cebadoPasos'));
        grid.appendChild(inner);
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const tl = buildTimeline();
      const st = ScrollTrigger.create({
        trigger: grid, start: 'top top', end: 'bottom bottom', scrub: .6,
        invalidateOnRefresh: true,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDestacados();
  renderCategorias();
  renderCatalogo();
  initWhatsAppLinks();
  initWspFloat();
  initFloats();
  initNav();
  initDestacadosRail();
  initFiltros();
  initCartDrawer();
  initQuickView();
  initMagnetic();
  initReveals();
  initCebadoChapter();
  updateCartBadge();
  document.querySelectorAll('[data-goto-cat]').forEach(btn => btn.addEventListener('click', () => gotoCategoria(btn.dataset.gotoCat)));
});
