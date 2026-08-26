const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'huerteros', nombre: 'Huerteros elevados', copy: 'Para no agacharte a cuidar tu huerta', imagen: 'images/jardinera_rectangular_elevada_1122x1402.webp' },
  { id: 'estanterias', nombre: 'Estanterías verticales', copy: 'Tres niveles de plantas en el lugar de uno', imagen: 'images/estanteria_de_jardineras_de_tres_niveles_1122x1402.webp' },
  { id: 'murales', nombre: 'Jardineras murales', copy: 'Un jardín que cuelga de la pared', imagen: 'images/jardinera_mural_con_flores_1122x1402.webp' },
  { id: 'bajos', nombre: 'Maceteros bajos', copy: 'El tamaño justo para el rincón que sobra', imagen: 'images/macetero_rectangular_bajo_1448x1086.webp' },
  { id: 'combos', nombre: 'Combos', copy: 'Varias piezas para arrancar tu huerta de una', imagen: 'images/coleccion_de_jardineras_de_madera_1448x1086.webp' },
];

const PRODUCTOS = [
  { id: 1, slug: 'huertero-clasico-con-plantas', nombre: 'Huertero Clásico', categoria: 'huerteros', precio: 34900, descuento: 0, stock: 4, descripcion: 'El diseño elevado de siempre — así se ve una vez que sumás tierra y tus primeras plantas.', imagenes: ['images/jardinera_elevada_con_plantas_1122x1402.webp'], tags: ['elevado'], destacado: true },
  { id: 2, slug: 'huertero-cuadrado-oscuro', nombre: 'Huertero Cuadrado Oscuro', categoria: 'huerteros', precio: 32500, descuento: 0, stock: 6, descripcion: 'Líneas rectas y un tono oscuro intenso, para quienes buscan algo más sobrio.', imagenes: ['images/jardinera_cuadrada_elevada_1254x1254.webp'], tags: ['elevado'] },
  { id: 3, slug: 'huertero-alargado', nombre: 'Huertero Alargado', categoria: 'huerteros', precio: 36900, descuento: 0, stock: 5, descripcion: 'El más largo de la línea, para una hilera completa de aromáticas o verdura de hoja.', imagenes: ['images/jardinera_alargada_de_madera_1122x1402.webp'], tags: ['elevado'] },
  { id: 4, slug: 'huertero-rustico', nombre: 'Huertero Rústico', categoria: 'huerteros', precio: 29900, descuento: 0, stock: 7, descripcion: 'Con las marcas propias de la madera recuperada a la vista — cada veta cuenta su historia.', imagenes: ['images/jardinera_elevada_rustica_1122x1402.webp'], tags: ['elevado'], destacado: true },
  { id: 5, slug: 'huertero-rectangular-miel', nombre: 'Huertero Rectangular Miel', categoria: 'huerteros', precio: 31900, descuento: 0, stock: 6, descripcion: 'Tono claro y cálido, el que más combina con espacios chicos y luminosos.', imagenes: ['images/jardinera_rectangular_elevada_1122x1402.webp'], tags: ['elevado'] },
  { id: 6, slug: 'huertero-listonado', nombre: 'Huertero Listonado', categoria: 'huerteros', precio: 33900, descuento: 10, stock: 3, descripcion: 'Terminación en listones verticales, un detalle distinto para el frente de tu huerta.', imagenes: ['images/jardinera_rectangular_listonada_1448x1086.webp'], tags: ['elevado'], destacado: true },
  { id: 7, slug: 'estanteria-huerta-3-niveles', nombre: 'Estantería de Huerta 3 Niveles', categoria: 'estanterias', precio: 52900, descuento: 0, stock: 3, descripcion: 'Tres bandejas escalonadas para triplicar tu huerta sin ocupar más piso.', imagenes: ['images/estanteria_de_jardineras_de_tres_niveles_1122x1402.webp'], tags: ['vertical'], destacado: true },
  { id: 8, slug: 'jardinera-mural-doble', nombre: 'Jardinera Mural Doble', categoria: 'murales', precio: 27900, descuento: 0, stock: 5, descripcion: 'Dos módulos para colgar en la pared o la baranda — ideal para flores de estación.', imagenes: ['images/jardinera_mural_con_flores_1122x1402.webp'], tags: ['mural'], destacado: true },
  { id: 9, slug: 'macetero-bajo', nombre: 'Macetero Bajo', categoria: 'bajos', precio: 18900, descuento: 0, stock: 8, descripcion: 'El más chico de la familia — perfecto para una mesa, un alféizar o el borde de una escalera.', imagenes: ['images/macetero_rectangular_bajo_1448x1086.webp'], tags: ['bajo'], destacado: true },
  { id: 10, slug: 'combo-huerta-inicial', nombre: 'Combo Huerta Inicial', categoria: 'combos', precio: 79900, descuento: 0, stock: 2, descripcion: 'Tres piezas para arrancar tu huerta de una — combiná tamaños y ubicaciones por toda la casa.', imagenes: ['images/coleccion_de_jardineras_de_madera_1448x1086.webp'], tags: ['combo'], destacado: true },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const categoriaNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || id;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const Cart = {
  KEY: 'oasisurbano_cart',
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

const Wishlist = {
  KEY: 'oasisurbano_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  toggle(id) {
    let items = this.get();
    if (items.includes(id)) items = items.filter(i => i !== id); else items.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(items));
  },
  has(id) { return this.get().includes(id); },
};

const pendingQty = new Map();
const getPendingQty = id => pendingQty.get(id) || 1;

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

/* ---------- Reveals al scroll ---------- */
let revealIO = null;
let revealsListos = false;
let sweepQueued = false;

function revealElements(els) {
  if (!els.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  if (!revealIO) {
    revealIO = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); revealIO.unobserve(entry.target); } });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  }
  els.forEach(el => revealIO.observe(el));
  queueSweep();
}
function queueSweep() { if (!sweepQueued) { sweepQueued = true; requestAnimationFrame(sweep); } }
function sweep() {
  sweepQueued = false;
  document.querySelectorAll('[data-animate]:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); revealIO && revealIO.unobserve(el); }
  });
}
function initReveals() {
  revealsListos = true;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
  });
  revealElements(document.querySelectorAll('[data-animate]'));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}
function revelarNuevos(container) {
  if (!revealsListos) return;
  revealElements(container.querySelectorAll('[data-animate]:not(.in)'));
}

/* ---------- Anti-copia ---------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ---------- Cards ---------- */
function badgeHTML(p) {
  if (p.stock === 0) return '<span class="prod-badge prod-badge--agotado">Sin stock</span>';
  if (p.descuento > 0) return `<span class="prod-badge">-${p.descuento}%</span>`;
  if (p.stock <= 3) return '<span class="prod-badge prod-badge--pocas">Últimas piezas</span>';
  return '';
}
function cardHTML(p, opts = {}) {
  const final = precioFinal(p);
  const enWishlist = Wishlist.has(p.id);
  const agotado = p.stock === 0;
  return `
  <article class="prod-card${opts.rail ? ' prod-card--rail' : ''}" data-id="${p.id}" data-animate="up" style="transform:translateY(32px);opacity:0">
    <button type="button" class="prod-wish${enWishlist ? ' is-active' : ''}" data-wish="${p.id}" aria-label="${enWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}" aria-pressed="${enWishlist}">
      <svg viewBox="0 0 24 24" fill="${enWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-10-9.3C.5 8 1.8 4.5 5 3.4c2.2-.8 4.4 0 5.6 1.8l1.4 2 1.4-2c1.2-1.8 3.4-2.6 5.6-1.8 3.2 1.1 4.5 4.6 3 7.8-2.5 4.7-10 9.3-10 9.3Z"/></svg>
    </button>
    ${badgeHTML(p)}
    <button type="button" class="prod-media" data-open="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.imagenes[0]}" alt="${esc(p.nombre)}" width="1200" height="1500">
    </button>
    <div class="prod-info">
      <span class="prod-cat">${esc(categoriaNombre(p.categoria))}</span>
      <h3 class="prod-nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="prod-precio">
        ${p.descuento > 0 ? `<span class="precio-final">${formatearPrecio(final)}</span><s class="precio-original">${formatearPrecio(p.precio)}</s>` : `<span class="precio-final">${formatearPrecio(p.precio)}</span>`}
      </div>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Restar cantidad" ${agotado ? 'disabled' : ''}>−</button>
          <span data-qty="${p.id}">${getPendingQty(p.id)}</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad" ${agotado ? 'disabled' : ''}>+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}" ${agotado ? 'disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
      </div>
    </div>
  </article>`;
}

function bindCardEvents(container) {
  container.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openModal(Number(btn.dataset.open))));
  container.querySelectorAll('[data-wish]').forEach(btn => btn.addEventListener('click', () => { Wishlist.toggle(Number(btn.dataset.wish)); syncWishlistButtons(); }));
  container.querySelectorAll('[data-stepper]').forEach(stepper => {
    const id = Number(stepper.dataset.stepper);
    stepper.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const p = getProducto(id);
      const next = Math.max(1, Math.min(getPendingQty(id) + Number(btn.dataset.step), p?.stock || 99));
      pendingQty.set(id, next);
      stepper.querySelector('[data-qty]').textContent = next;
    }));
  });
  container.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
    const id = Number(btn.dataset.add);
    const p = getProducto(id);
    if (!p || p.stock === 0) return;
    Cart.add(p, getPendingQty(id));
    pendingQty.delete(id);
    showToast('¡Agregado! Tu carrito te espera.');
  }));
}
function syncWishlistButtons() {
  document.querySelectorAll('[data-wish]').forEach(btn => {
    const activo = Wishlist.has(Number(btn.dataset.wish));
    btn.classList.toggle('is-active', activo);
    btn.setAttribute('aria-pressed', activo);
    btn.setAttribute('aria-label', activo ? 'Quitar de favoritos' : 'Agregar a favoritos');
    btn.querySelector('svg').setAttribute('fill', activo ? 'currentColor' : 'none');
  });
}

/* ---------- Categorías ---------- */
function renderCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map((c, i) => `
    <a href="#tienda" class="cat-card" data-cat-link="${c.id}" data-animate="scale" style="transform:scale(.94)translateY(20px);opacity:0" data-delay="${i * 0.08}">
      <div class="cat-media"><img src="${c.imagen}" alt="${esc(c.nombre)}" width="1200" height="1500"></div>
      <div class="cat-copy">
        <h3>${esc(c.nombre)}</h3>
        <p>${esc(c.copy)}</p>
      </div>
    </a>`).join('');
  grid.querySelectorAll('[data-animate]').forEach(el => { el.style.transitionDelay = `${el.dataset.delay || 0}s`; });
  grid.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    filtroState.categoria = a.dataset.catLink;
    syncFiltrosUI();
    refrescarCatalogoConFlip();
    document.getElementById('tienda').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  revelarNuevos(grid);
}

/* ---------- Destacados (rail) ---------- */
function renderDestacados() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = destacados.map(p => cardHTML(p, { rail: true })).join('');
  bindCardEvents(track);
  revelarNuevos(track);
}

/* ---------- Catálogo ---------- */
const filtroState = { q: '', categoria: 'todos', orden: 'relevancia', visibles: 16 };

function productosFiltrados() {
  const q = normalizar(filtroState.q);
  let out = PRODUCTOS.filter(p => {
    if (filtroState.categoria !== 'todos' && p.categoria !== filtroState.categoria) return false;
    if (q) {
      const hay = normalizar([p.nombre, categoriaNombre(p.categoria), p.descripcion, ...(p.tags || [])].join(' '));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  if (filtroState.orden === 'precio-asc') out = out.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtroState.orden === 'precio-desc') out = out.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  return out;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const emptyEl = document.getElementById('catalogoEmpty');
  const countEl = document.getElementById('catalogoCount');
  const verMasBtn = document.getElementById('verMasBtn');
  if (!grid) return;
  const todos = productosFiltrados();
  countEl.textContent = `${todos.length} ${todos.length === 1 ? 'producto' : 'productos'}`;
  if (!todos.length) {
    grid.innerHTML = '';
    emptyEl.hidden = false;
  } else {
    emptyEl.hidden = true;
    grid.innerHTML = todos.slice(0, filtroState.visibles).map(p => cardHTML(p)).join('');
  }
  verMasBtn.hidden = filtroState.visibles >= todos.length;
  bindCardEvents(grid);
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function refrescarCatalogoConFlip() {
  const grid = document.getElementById('catalogoGrid');
  filtroState.visibles = 16;
  if (typeof window.Flip !== 'undefined' && !reduceMotion && grid.children.length) {
    const state = window.Flip.getState(grid.children);
    renderCatalogo();
    window.Flip.from(state, {
      duration: 0.5, ease: 'power2.inOut', stagger: 0.02, absolute: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35 }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.25 }),
    });
  } else {
    renderCatalogo();
  }
}

function syncFiltrosUI() {
  document.querySelectorAll('[data-cat-chip]').forEach(chip => chip.classList.toggle('is-active', chip.dataset.catChip === filtroState.categoria));
  const ordenSel = document.getElementById('filtroOrden'); if (ordenSel) ordenSel.value = filtroState.orden;
  const buscador = document.getElementById('buscador'); if (buscador) buscador.value = filtroState.q;
}

function initFiltros() {
  const chipsWrap = document.getElementById('catChips');
  if (chipsWrap) {
    chipsWrap.innerHTML = ['<button type="button" class="chip is-active" data-cat-chip="todos">Todos</button>']
      .concat(CATEGORIAS.map(c => `<button type="button" class="chip" data-cat-chip="${c.id}">${esc(c.nombre)}</button>`)).join('');
    chipsWrap.addEventListener('click', e => {
      const chip = e.target.closest('[data-cat-chip]'); if (!chip) return;
      filtroState.categoria = chip.dataset.catChip;
      syncFiltrosUI();
      refrescarCatalogoConFlip();
    });
  }
  document.getElementById('buscador')?.addEventListener('input', e => { filtroState.q = e.target.value; filtroState.visibles = 16; refrescarCatalogoConFlip(); });
  document.getElementById('filtroOrden')?.addEventListener('change', e => { filtroState.orden = e.target.value; refrescarCatalogoConFlip(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    filtroState.q = ''; filtroState.categoria = 'todos'; filtroState.orden = 'relevancia'; filtroState.visibles = 16;
    syncFiltrosUI();
    refrescarCatalogoConFlip();
  });
  document.getElementById('limpiarFiltrosVacio')?.addEventListener('click', () => document.getElementById('limpiarFiltros')?.click());
  document.getElementById('verMasBtn')?.addEventListener('click', () => { filtroState.visibles += 16; renderCatalogo(); });
}

/* ---------- Modal / vista rápida ---------- */
let modalQty = 1;
let lastFocused = null;

function openModal(id) {
  const p = getProducto(id);
  if (!p) return;
  modalQty = 1;
  const modal = document.getElementById('quickView');
  const final = precioFinal(p);
  document.getElementById('qvImg').src = p.imagenes[0];
  document.getElementById('qvImg').alt = p.nombre;
  document.getElementById('qvCat').textContent = categoriaNombre(p.categoria);
  document.getElementById('qvNombre').textContent = p.nombre;
  document.getElementById('qvDescripcion').textContent = p.descripcion;
  document.getElementById('qvPrecio').innerHTML = p.descuento > 0
    ? `<span class="precio-final">${formatearPrecio(final)}</span><s class="precio-original">${formatearPrecio(p.precio)}</s><span class="prod-badge">-${p.descuento}%</span>`
    : `<span class="precio-final">${formatearPrecio(p.precio)}</span>`;
  document.getElementById('qvQty').textContent = modalQty;
  document.getElementById('qvAgotado').hidden = p.stock !== 0;
  document.getElementById('qvAgregar').disabled = p.stock === 0;
  document.getElementById('qvComprar').disabled = p.stock === 0;
  modal.dataset.id = id;

  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  document.getElementById('qvRelacionados').innerHTML = relacionados.length
    ? `<h3>También te puede interesar</h3><div class="qv-relacionados-grid">${relacionados.map(r => `
        <button type="button" class="qv-rel-card" data-open-rel="${r.id}">
          <img src="${r.imagenes[0]}" alt="${esc(r.nombre)}" width="1200" height="1500">
          <span>${esc(r.nombre)}</span>
          <span class="precio-final">${formatearPrecio(precioFinal(r))}</span>
        </button>`).join('')}</div>`
    : '';
  document.getElementById('qvRelacionados').querySelectorAll('[data-open-rel]').forEach(btn => btn.addEventListener('click', () => openModal(Number(btn.dataset.openRel))));

  lastFocused = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => modal.classList.add('open'));
  modal.querySelector('.qv-close')?.focus();
}
function closeModal() {
  const modal = document.getElementById('quickView');
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; }, 280);
  lastFocused?.focus();
}
function initModal() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.querySelector('.qv-close')?.addEventListener('click', closeModal);
  modal.querySelector('.qv-backdrop')?.addEventListener('click', closeModal);
  document.getElementById('qvStepMinus')?.addEventListener('click', () => { modalQty = Math.max(1, modalQty - 1); document.getElementById('qvQty').textContent = modalQty; });
  document.getElementById('qvStepPlus')?.addEventListener('click', () => {
    const p = getProducto(Number(modal.dataset.id));
    modalQty = Math.min(modalQty + 1, p?.stock || 99);
    document.getElementById('qvQty').textContent = modalQty;
  });
  document.getElementById('qvAgregar')?.addEventListener('click', () => {
    const p = getProducto(Number(modal.dataset.id));
    if (!p) return;
    Cart.add(p, modalQty);
    showToast('¡Agregado! Tu carrito te espera.');
  });
  document.getElementById('qvComprar')?.addEventListener('click', () => {
    const p = getProducto(Number(modal.dataset.id));
    if (!p) return;
    Cart.add(p, modalQty);
    closeModal();
    openCartDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || modal.hidden) return;
    closeModal();
  });
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusables = modal.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ---------- Carrito (drawer) ---------- */
function renderCartDrawer() {
  const items = Cart.get();
  const wrap = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footer = document.getElementById('cartFooter');
  if (!items.length) {
    wrap.innerHTML = '';
    emptyEl.hidden = false;
    footer.hidden = true;
    return;
  }
  emptyEl.hidden = true;
  footer.hidden = false;
  wrap.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const final = precioFinal(p);
    return `
    <div class="cart-item" data-cart-id="${p.id}">
      <img src="${p.imagenes[0]}" alt="${esc(p.nombre)}" width="1200" height="1500">
      <div class="cart-item-info">
        <h4>${esc(p.nombre)}</h4>
        <span class="precio-final">${formatearPrecio(final)}</span>
        <div class="stepper stepper--sm">
          <button type="button" data-cart-step="-1" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-cart-step="1" aria-label="Sumar">+</button>
        </div>
      </div>
      <button type="button" class="cart-item-remove" aria-label="Quitar ${esc(p.nombre)} del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16M9 6V4h6v2m-8 0 1 14h8l1-14" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.cart-item').forEach(row => {
    const id = Number(row.dataset.cartId);
    row.querySelector('[data-cart-step="-1"]').addEventListener('click', () => { const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty - 1); });
    row.querySelector('[data-cart-step="1"]').addEventListener('click', () => { const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty + 1); });
    row.querySelector('.cart-item-remove').addEventListener('click', () => Cart.remove(id));
  });
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  lastFocused = document.activeElement;
  drawer.hidden = false;
  document.body.classList.add('no-scroll', 'drawer-open');
  requestAnimationFrame(() => drawer.classList.add('open'));
  drawer.querySelector('.drawer-close')?.focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.remove('open');
  document.body.classList.remove('no-scroll', 'drawer-open');
  setTimeout(() => { drawer.hidden = true; }, 320);
  lastFocused?.focus();
}
function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.querySelectorAll('[data-cart-open]').forEach(btn => btn.addEventListener('click', openCartDrawer));
  document.querySelectorAll('[data-cart-open-close]').forEach(btn => btn.addEventListener('click', closeCartDrawer));
  drawer.querySelector('.drawer-close')?.addEventListener('click', closeCartDrawer);
  drawer.querySelector('.drawer-backdrop')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCartDrawer(); });
  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
    const focusables = drawer.querySelectorAll('button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('cart:updated', renderCartDrawer);
  renderCartDrawer();
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

/* ---------- Floats (carrito + WhatsApp) ---------- */
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

/* ---------- Nav mobile ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
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

/* ---------- Rail arrastrable (destacados) — receta 4a ---------- */
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
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ } }
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
function initRailWheel() {
  const vp = document.getElementById('railTrack')?.closest('.hscroll');
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
}
function initRailArrows() {
  const vp = document.getElementById('railTrack')?.closest('.hscroll');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track || !prev || !next) return;
  const update = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -360, behavior: 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: 360, behavior: 'smooth' }));
  vp.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
}

/* ---------- Capítulo "Así nace cada huertero" (momento firma) ---------- */
function initArmado() {
  const stage = document.getElementById('armadoStage');
  if (!stage || typeof gsap === 'undefined') return;
  const tablones = gsap.utils.toArray('.tablon');
  const pasos = gsap.utils.toArray('#armado .paso');
  const brote = document.querySelector('.brote-tallo');
  if (brote) {
    const len = brote.getTotalLength();
    brote.style.strokeDasharray = len;
    brote.style.strokeDashoffset = len;
  }
  if (reduceMotion) {
    tablones.forEach(t => t.classList.add('is-armado'));
    if (brote) brote.style.strokeDashoffset = 0;
    document.querySelectorAll('.brote-hoja').forEach(h => h.style.opacity = 1);
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }
  const setStep = progress => {
    const i = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, idx) => p.classList.toggle('is-on', idx === i));
  };
  const buildTimeline = () => {
    const tl = gsap.timeline({ paused: true });
    tl.to(tablones, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power2.out' }, 0.15);
    if (brote) tl.to(brote, { strokeDashoffset: 0, duration: 0.5, ease: 'power1.out' }, 0.95);
    tl.to('.brote-hoja', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, 1.05);
    return tl;
  };
  if (typeof ScrollTrigger === 'undefined') return;
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': () => {
      const tl = buildTimeline();
      ScrollTrigger.create({
        trigger: '#armado', start: 'top top', end: '+=180%', pin: true, scrub: 0.6, anticipatePin: 1,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
    },
    '(max-width: 860px)': () => {
      stage.closest('#armado').classList.add('is-sticky-mobile');
      const tl = buildTimeline();
      ScrollTrigger.create({
        trigger: '#armado', start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: self => { tl.progress(self.progress); setStep(self.progress); },
      });
      return () => stage.closest('#armado').classList.remove('is-sticky-mobile');
    },
  });
}

/* ---------- Hero + parallax ---------- */
function initHeroAnim() {
  const heroEls = document.querySelectorAll('.hero-media, .hero-eyebrow, .hero-title, .hero-sub, .hero-ctas .btn, .hero-sello');
  if (typeof gsap === 'undefined' || reduceMotion) {
    heroEls.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.to('.hero-media', { clipPath: 'inset(0% 0 0 0)', duration: 1.1 })
    .to('.hero-eyebrow', { y: 0, opacity: 1, duration: 0.7 }, 0.15)
    .to('.hero-title', { y: 0, opacity: 1, duration: 0.9 }, 0.28)
    .to('.hero-sub', { y: 0, opacity: 1, duration: 0.7 }, 0.5)
    .to('.hero-ctas .btn', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.62)
    .to('.hero-sello', { scale: 1, opacity: 1, duration: 0.8 }, 0.5);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.closest('.parallax'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
}

/* ---------- JSON-LD ---------- */
function initJsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', name: 'Oasis Urbano', url: location.href, description: 'Huerteros y macetas hechos a mano con pallets de madera reciclados.' },
      ...PRODUCTOS.map(p => ({
        '@type': 'Product', name: p.nombre, description: p.descripcion, image: location.origin + location.pathname.replace(/index\.html$/, '') + p.imagenes[0],
        offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
      })),
    ],
  };
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap !== 'undefined' && typeof window.Flip !== 'undefined') gsap.registerPlugin(window.Flip);

  renderCategorias();
  renderDestacados();
  renderCatalogo();
  initFiltros();
  syncFiltrosUI();
  initModal();
  initCartDrawer();
  updateCartBadge();
  initReveals();
  initNav();
  initFloats();
  initRailDrag(document.getElementById('railTrack')?.closest('.hscroll'));
  initRailWheel();
  initRailArrows();
  initHeroAnim();
  initArmado();
  initJsonLd();

  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
});
