const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const WHATSAPP_NUMBER = '5491124142445';

/* ===================== Catálogo (fixtures de demo) ===================== */
const PRODUCTOS = [
  { id: 'rastra-flor-costilla', slug: 'rastra-flor-cadena-costilla', nombre: 'Rastra Flor con Cadena Costilla', categoria: 'rastras', genero: 'caballero', precio: 68000, descuento: 0, stock: 6, destacado: false, tags: ['rastra', 'costilla', 'cuero', 'gauchesca'], imagenes: ['images/hero-vertical.webp'], descripcion: 'Cinturón de cuero con hebilla floral grabada en zamak y cadena costilla con dije. Pieza completa, lista para usar.' },
  { id: 'rastra-clasica-dama', slug: 'rastra-clasica-dama', nombre: 'Rastra Clásica Dama', categoria: 'rastras', genero: 'dama', precio: 52000, descuento: 0, stock: 8, destacado: false, tags: ['rastra', 'dama', 'clasica'], imagenes: ['images/hero-wide.webp'], descripcion: 'Rastra con hebilla ovalada y cadena fina, pensada para un uso diario. Terminación plateada envejecida.' },
  { id: 'rastra-monedas', slug: 'rastra-apliques-monedas', nombre: 'Rastra con Apliques de Monedas', categoria: 'rastras', genero: 'caballero', precio: 78000, descuento: 0, stock: 4, destacado: true, tags: ['rastra', 'monedas', 'apliques', 'gauchesca'], imagenes: ['images/hero-wide.webp'], descripcion: 'Rastra completa con cadena de apliques: monedas, flor de lis y cruz. La pieza más elaborada de fábrica propia.' },
  { id: 'rastra-sol', slug: 'rastra-sol-patrio', nombre: 'Rastra Sol Patrio', categoria: 'rastras', genero: 'unisex', precio: 72000, descuento: 8, stock: 5, destacado: true, tags: ['rastra', 'sol', 'unisex'], imagenes: ['images/hero-vertical.webp'], descripcion: 'Hebilla con motivo sol grabado a mano y cadena costilla larga. Una pieza para cualquier género.' },

  { id: 'hebilla-floral-grande', slug: 'hebilla-floral-grande', nombre: 'Hebilla Floral Grande', categoria: 'hebillas', genero: 'caballero', precio: 28000, descuento: 0, stock: 10, destacado: true, tags: ['hebilla', 'floral', 'grabada'], imagenes: ['images/hebilla.webp'], descripcion: 'Hebilla de zamak con grabado floral en relieve, terminación plateada envejecida. Se vende sola, sin cinto.' },
  { id: 'hebilla-clasica-oval', slug: 'hebilla-clasica-oval', nombre: 'Hebilla Oval Clásica', categoria: 'hebillas', genero: 'unisex', precio: 19500, descuento: 0, stock: 14, destacado: false, tags: ['hebilla', 'oval', 'clasica'], imagenes: ['images/hebilla.webp'], descripcion: 'Hebilla oval lisa con borde grabado, el modelo más pedido para un primer cinto gauchesco.' },
  { id: 'hebilla-dama-trenzada', slug: 'hebilla-dama-trenzada', nombre: 'Hebilla Dama Trenzada', categoria: 'hebillas', genero: 'dama', precio: 22000, descuento: 0, stock: 9, destacado: true, tags: ['hebilla', 'dama', 'trenzada'], imagenes: ['images/hebilla.webp'], descripcion: 'Hebilla de líneas más finas con textura trenzada, pensada para cintos angostos.' },
  { id: 'hebilla-rectangular-grabada', slug: 'hebilla-rectangular-grabada', nombre: 'Hebilla Rectangular Grabada', categoria: 'hebillas', genero: 'caballero', precio: 25000, descuento: 10, stock: 7, destacado: false, tags: ['hebilla', 'rectangular', 'grabada'], imagenes: ['images/hero-wide.webp'], descripcion: 'Hebilla rectangular con guarda geométrica grabada en todo el borde. Estilo más sobrio.' },

  { id: 'cadena-costilla-corta', slug: 'cadena-costilla-corta-25', nombre: 'Cadena Costilla Corta (25 cm)', categoria: 'cadenas', genero: 'unisex', precio: 14000, descuento: 0, stock: 12, destacado: false, tags: ['cadena', 'costilla', 'corta'], imagenes: ['images/engarzado.webp'], descripcion: 'Cadena tipo costilla de 25 cm, eslabones engarzados a mano, con mosquetón para enganchar a la hebilla.' },
  { id: 'cadena-costilla-larga', slug: 'cadena-costilla-larga-40', nombre: 'Cadena Costilla Larga (40 cm)', categoria: 'cadenas', genero: 'unisex', precio: 19000, descuento: 0, stock: 10, destacado: true, tags: ['cadena', 'costilla', 'larga'], imagenes: ['images/engarzado.webp'], descripcion: 'La misma cadena costilla en versión larga, para quienes prefieren que caiga más sobre la pierna.' },
  { id: 'cadena-clasica', slug: 'cadena-clasica-eslabon-doble', nombre: 'Cadena Clásica Eslabón Doble', categoria: 'cadenas', genero: 'unisex', precio: 16500, descuento: 0, stock: 11, destacado: false, tags: ['cadena', 'clasica', 'eslabon'], imagenes: ['images/engarzado.webp'], descripcion: 'Cadena de eslabón doble reforzado, más gruesa que la costilla. Terminación a juego con las hebillas.' },

  { id: 'dije-luna', slug: 'dije-luna', nombre: 'Dije Luna', categoria: 'dijes', genero: 'unisex', precio: 4200, descuento: 0, stock: 20, destacado: false, tags: ['dije', 'luna', 'pulsera'], imagenes: ['images/dijes.webp'], descripcion: 'Dije de zamak en forma de luna, con argolla para pulsera o para sumar a tu rastra.' },
  { id: 'dije-arbol-vida', slug: 'dije-arbol-de-la-vida', nombre: 'Dije Árbol de la Vida', categoria: 'dijes', genero: 'unisex', precio: 5800, descuento: 0, stock: 15, destacado: false, tags: ['dije', 'arbol', 'pulsera'], imagenes: ['images/dijes.webp'], descripcion: 'Dije calado con el motivo árbol de la vida, uno de los más pedidos para armar pulseras.' },
  { id: 'aplique-moneda-sol', slug: 'aplique-moneda-sol', nombre: 'Aplique Moneda Sol', categoria: 'dijes', genero: 'unisex', precio: 6500, descuento: 0, stock: 18, destacado: true, tags: ['aplique', 'moneda', 'sol'], imagenes: ['images/dijes.webp'], descripcion: 'Moneda aplique con el sol grabado, para sumar a una rastra o cadena como las de nuestras piezas completas.' },
  { id: 'dije-flor-de-lis', slug: 'dije-flor-de-lis', nombre: 'Dije Flor de Lis', categoria: 'dijes', genero: 'unisex', precio: 4800, descuento: 0, stock: 16, destacado: false, tags: ['dije', 'flor de lis', 'pulsera'], imagenes: ['images/dijes.webp'], descripcion: 'Dije flor de lis, el mismo motivo que usamos en la Rastra con Apliques de Monedas.' },

  { id: 'pasapanuelo-trenzado', slug: 'pasapanuelo-trenzado', nombre: 'Pasapañuelo Trenzado', categoria: 'pasapanuelos', genero: 'unisex', precio: 9500, descuento: 0, stock: 13, destacado: false, tags: ['pasapanuelo', 'trenzado'], imagenes: ['images/pasapanuelos.webp'], descripcion: 'Pasapañuelo de zamak con textura trenzada, para el pañuelo gauchesco o como aro decorativo.' },
  { id: 'pasapanuelo-hojas', slug: 'pasapanuelo-hojas-de-olivo', nombre: 'Pasapañuelo Hojas de Olivo', categoria: 'pasapanuelos', genero: 'unisex', precio: 11000, descuento: 0, stock: 9, destacado: true, tags: ['pasapanuelo', 'hojas', 'olivo'], imagenes: ['images/pasapanuelos.webp'], descripcion: 'Rama de olivo grabada en relieve alrededor de todo el aro. Nuestro pasapañuelo más elaborado.' },
  { id: 'pasapanuelo-tejido', slug: 'pasapanuelo-tejido-rustico', nombre: 'Pasapañuelo Tejido Rústico', categoria: 'pasapanuelos', genero: 'unisex', precio: 8500, descuento: 0, stock: 15, destacado: false, tags: ['pasapanuelo', 'tejido', 'rustico'], imagenes: ['images/pasapanuelos.webp'], descripcion: 'Textura tipo tejido en espiral, más angosto que el resto de la línea.' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
function normalizar(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function coincideTexto(p, q) {
  if (!q) return true;
  const hay = normalizar([p.nombre, p.categoria, p.genero, p.descripcion, ...(p.tags || [])].join(' '));
  return hay.includes(normalizar(q));
}

/* ===================== Carrito ===================== */
const Cart = {
  KEY: 'centrorastras_cart',
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

/* ===================== Toast ===================== */
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

/* ===================== Anti-copia ===================== */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

/* ===================== Foco atrapado (drawer / modal) ===================== */
function trapFocus(container, onEscape) {
  const focusables = () => [...container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent);
  function onKeydown(e) {
    if (e.key === 'Escape') { onEscape(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}

/* ===================== Nav mobile ===================== */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

/* ===================== Flotantes: carrito + WhatsApp ===================== */
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

/* ===================== Reveals ===================== */
let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  revealsListos = true;
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`; });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
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
}
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    requestAnimationFrame(() => { el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`; el.classList.add('in'); });
  });
}

/* ===================== Tarjeta de producto (HTML) ===================== */
function tarjetaProducto(p) {
  const precio = precioFinal(p);
  const agotado = p.stock <= 0;
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge-off">-${p.descuento}%</span>`);
  if (agotado) badges.push(`<span class="badge badge-agotado">Sin stock</span>`);
  else if (p.destacado) badges.push(`<span class="badge badge-nuevo">Destacado</span>`);
  return `
  <article class="prod-card" data-animate style="opacity:0;transform:translateY(24px)" data-id="${esc(p.id)}">
    <div class="prod-card__media">
      <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}, pieza en zamak" width="1000" height="1000">
      <div class="prod-card__badges">${badges.join('')}</div>
      <button type="button" class="prod-card__ver" data-ver="${esc(p.id)}" aria-label="Vista rápida de ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
    <p class="prod-card__cat">${esc(p.categoria)}</p>
    <h3 class="prod-card__nombre">${esc(p.nombre)}</h3>
    <p class="prod-card__precio">${formatearPrecio(precio)}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
    <div class="prod-actions">
      <span class="stepper" data-stepper="${esc(p.id)}">
        <button type="button" data-menos aria-label="Restar cantidad">&minus;</button>
        <output>1</output>
        <button type="button" data-mas aria-label="Sumar cantidad">+</button>
      </span>
      <button type="button" class="btn btn-primary btn-sm prod-add" data-agregar="${esc(p.id)}" ${agotado ? 'disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar'}</button>
    </div>
  </article>`;
}

function wireProductActions(container) {
  container.addEventListener('click', e => {
    const btnVer = e.target.closest('[data-ver]');
    if (btnVer) { openQuickView(btnVer.dataset.ver); return; }
    const menos = e.target.closest('[data-menos]');
    const mas = e.target.closest('[data-mas]');
    if (menos || mas) {
      const stepper = e.target.closest('[data-stepper]');
      const out = stepper.querySelector('output');
      let v = parseInt(out.textContent, 10) || 1;
      v = mas ? Math.min(v + 1, 10) : Math.max(1, v - 1);
      out.textContent = v;
      const card = e.target.closest('.prod-card');
      card.querySelector('[data-agregar]').dataset.qty = v;
      return;
    }
    const agregar = e.target.closest('[data-agregar]');
    if (agregar) {
      const p = getProducto(agregar.dataset.agregar);
      const qty = parseInt(agregar.dataset.qty, 10) || 1;
      Cart.add(p, qty);
      showToast(`Sumamos ${esc(p.nombre)} al carrito`);
    }
  });
}

/* ===================== Catálogo: estado, filtros, render ===================== */
const catalogo = {
  q: '', categorias: new Set(), generos: new Set(), orden: 'relevancia', visibles: 16,
  filtrar() {
    let r = PRODUCTOS.filter(p =>
      coincideTexto(p, this.q) &&
      (!this.categorias.size || this.categorias.has(p.categoria)) &&
      (!this.generos.size || this.generos.has(p.genero))
    );
    if (this.orden === 'menor') r = [...r].sort((a, b) => precioFinal(a) - precioFinal(b));
    if (this.orden === 'mayor') r = [...r].sort((a, b) => precioFinal(b) - precioFinal(a));
    return r;
  },
};

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const vacio = document.getElementById('catalogoVacio');
  const meta = document.getElementById('catalogoMeta');
  const btnVerMas = document.getElementById('catalogoVerMas');
  const inputBuscar = document.getElementById('catalogoBuscar');
  const formBuscar = document.getElementById('catalogoBuscarForm');
  const btnLimpiar = document.getElementById('catalogoLimpiar');
  const selectOrden = document.getElementById('catalogoOrden');
  const asideToggle = document.getElementById('catalogoAsideToggle');
  const aside = document.getElementById('catalogoAside');

  function render() {
    const filtrados = catalogo.filtrar();
    const visibles = filtrados.slice(0, catalogo.visibles);
    grid.innerHTML = visibles.map(tarjetaProducto).join('');
    grid.hidden = visibles.length === 0;
    vacio.hidden = visibles.length !== 0;
    meta.textContent = filtrados.length === 1 ? '1 producto' : `${filtrados.length} productos`;
    btnVerMas.hidden = catalogo.visibles >= filtrados.length;
    revelarNuevos(grid);
  }

  formBuscar?.addEventListener('submit', e => { e.preventDefault(); catalogo.q = inputBuscar.value.trim(); catalogo.visibles = 16; render(); });
  inputBuscar?.addEventListener('input', () => { catalogo.q = inputBuscar.value.trim(); catalogo.visibles = 16; render(); });

  document.querySelectorAll('[data-f="cat"]').forEach(cb => cb.addEventListener('change', () => {
    catalogo.categorias.clear();
    document.querySelectorAll('[data-f="cat"]:checked').forEach(el => catalogo.categorias.add(el.value));
    catalogo.visibles = 16; render();
  }));
  document.querySelectorAll('[data-f="genero"]').forEach(cb => cb.addEventListener('change', () => {
    catalogo.generos.clear();
    document.querySelectorAll('[data-f="genero"]:checked').forEach(el => catalogo.generos.add(el.value));
    catalogo.visibles = 16; render();
  }));
  selectOrden?.addEventListener('change', () => { catalogo.orden = selectOrden.value; render(); });

  btnLimpiar?.addEventListener('click', () => {
    catalogo.q = ''; catalogo.categorias.clear(); catalogo.generos.clear(); catalogo.orden = 'relevancia'; catalogo.visibles = 16;
    if (inputBuscar) inputBuscar.value = '';
    if (selectOrden) selectOrden.value = 'relevancia';
    document.querySelectorAll('[data-f="cat"], [data-f="genero"]').forEach(el => { el.checked = false; });
    render();
  });

  btnVerMas?.addEventListener('click', () => { catalogo.visibles += 16; render(); });

  asideToggle?.addEventListener('click', () => {
    const abierto = aside.classList.toggle('abierto');
    asideToggle.setAttribute('aria-expanded', String(abierto));
  });

  wireProductActions(grid);

  filtrarPorCategoriaGlobal = (cat) => {
    catalogo.categorias.clear(); catalogo.categorias.add(cat); catalogo.visibles = 16;
    document.querySelectorAll('[data-f="cat"]').forEach(el => { el.checked = el.value === cat; });
    render();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  render();
}
let filtrarPorCategoriaGlobal = () => {};

/* ===================== Rail de destacados ===================== */
function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');

  const destacados = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = destacados.map(tarjetaProducto).join('');
  wireProductActions(track);

  let startX = 0, startScroll = 0, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => { startX = e.clientX; startScroll = vp.scrollLeft; moved = false; pointerId = e.pointerId; });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (moved) vp.classList.remove('dragging');
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', () => { if (pointerId !== null) end(); });
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -300, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: 300, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  sync();
}

/* ===================== Vista rápida (modal de producto) ===================== */
let quickViewUntrap = null;
function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const backdrop = document.getElementById('modalProducto');
  if (!backdrop) return;
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const precio = precioFinal(p);
  const agotado = p.stock <= 0;

  backdrop.querySelector('.modal-producto__grid').innerHTML = `
    <div class="modal-producto__media"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="900" height="900"></div>
    <div class="modal-producto__info">
      <p class="prod-card__cat">${esc(p.categoria)}</p>
      <h2>${esc(p.nombre)}</h2>
      <p class="modal-producto__precio">${formatearPrecio(precio)}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="modal-producto__desc">${esc(p.descripcion)}</p>
      <div class="modal-producto__cta">
        <span class="stepper" id="modalProductoStepper">
          <button type="button" data-menos aria-label="Restar cantidad">&minus;</button>
          <output>1</output>
          <button type="button" data-mas aria-label="Sumar cantidad">+</button>
        </span>
        <button type="button" class="btn btn-primary" id="modalProductoAgregar" ${agotado ? 'disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar al carrito'}</button>
      </div>
      <a class="btn btn-ghost btn-block btn-sm" style="margin-top:.6rem" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola CentroRastrasEngarzados, tengo una consulta sobre ${p.nombre}.`)}">¿Dudas sobre esta pieza? Consultar por WhatsApp</a>
      ${relacionados.length ? `<div class="modal-relacionados"><h3>También te puede interesar</h3><div class="modal-relacionados__grid">${relacionados.map(r => `<button type="button" class="modal-relacionados__item" data-ver="${esc(r.id)}"><img src="${esc(r.imagenes[0])}" alt="${esc(r.nombre)}" width="200" height="200"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;

  const stepper = backdrop.querySelector('#modalProductoStepper');
  const out = stepper.querySelector('output');
  stepper.addEventListener('click', e => {
    let v = parseInt(out.textContent, 10) || 1;
    if (e.target.closest('[data-mas]')) v = Math.min(v + 1, 10);
    if (e.target.closest('[data-menos]')) v = Math.max(1, v - 1);
    out.textContent = v;
  });
  backdrop.querySelector('#modalProductoAgregar')?.addEventListener('click', () => {
    Cart.add(p, parseInt(out.textContent, 10) || 1);
    showToast(`Sumamos ${esc(p.nombre)} al carrito`);
  });
  backdrop.querySelectorAll('[data-ver]').forEach(btn => btn.addEventListener('click', () => openQuickView(btn.dataset.ver)));

  backdrop.hidden = false;
  document.body.classList.add('no-scroll');
  backdrop.querySelector('.modal-close')?.focus();
  quickViewUntrap = trapFocus(backdrop, closeQuickView);
}
function closeQuickView() {
  const backdrop = document.getElementById('modalProducto');
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.classList.remove('no-scroll');
  quickViewUntrap?.(); quickViewUntrap = null;
}
function initQuickView() {
  const backdrop = document.getElementById('modalProducto');
  if (!backdrop) return;
  backdrop.querySelector('.modal-close')?.addEventListener('click', closeQuickView);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeQuickView(); });
}

/* ===================== Drawer del carrito ===================== */
let cartUntrap = null;
function renderCartDrawer() {
  const lista = document.getElementById('cartLista');
  const vacio = document.getElementById('cartVacio');
  const pie = document.getElementById('cartPie');
  if (!lista) return;
  const items = Cart.get();
  if (!items.length) { lista.hidden = true; vacio.hidden = false; pie.hidden = true; return; }
  lista.hidden = false; vacio.hidden = true; pie.hidden = false;
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const precio = precioFinal(p);
    return `
    <div class="cart-linea" data-id="${esc(i.id)}">
      <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="66" height="66">
      <div class="cart-linea__info">
        <h4>${esc(p.nombre)}</h4>
        <p class="cat">${esc(p.categoria)}</p>
        <div class="cart-linea__fila">
          <span class="stepper" data-cart-stepper>
            <button type="button" data-menos aria-label="Restar cantidad">&minus;</button>
            <output>${i.qty}</output>
            <button type="button" data-mas aria-label="Sumar cantidad">+</button>
          </span>
          <span class="cart-linea__precio">${formatearPrecio(precio * i.qty)}</span>
        </div>
        <button type="button" class="cart-linea__quitar" data-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}
function openCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (!backdrop || !drawer) return;
  renderCartDrawer();
  backdrop.classList.add('open'); drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('.cart-drawer__close')?.focus();
  cartUntrap = trapFocus(drawer, closeCartDrawer);
}
function closeCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (!backdrop) return;
  backdrop.classList.remove('open'); drawer.classList.remove('open');
  document.body.classList.remove('no-scroll');
  cartUntrap?.(); cartUntrap = null;
}
function initCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (!backdrop || !drawer) return;
  document.querySelectorAll('#btnCarritoHeader').forEach(b => b.addEventListener('click', openCartDrawer));
  drawer.querySelector('.cart-drawer__close')?.addEventListener('click', closeCartDrawer);
  backdrop.addEventListener('click', closeCartDrawer);
  drawer.addEventListener('click', e => {
    const linea = e.target.closest('.cart-linea');
    if (!linea) return;
    const { id } = linea.dataset;
    if (e.target.closest('[data-quitar]')) { Cart.remove(id); renderCartDrawer(); return; }
    if (e.target.closest('[data-mas]') || e.target.closest('[data-menos]')) {
      const out = linea.querySelector('output');
      let v = parseInt(out.textContent, 10) || 1;
      v = e.target.closest('[data-mas]') ? v + 1 : Math.max(1, v - 1);
      Cart.setQty(id, v);
      renderCartDrawer();
    }
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('cartVacioBtn')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCartDrawer(); });
}

/* ===================== Componente funcional: Armá tu rastra ===================== */
function calcularArmado({ hebillaId, cadenaId, dijeIds }) {
  const hebilla = hebillaId ? getProducto(hebillaId) : null;
  const cadena = cadenaId ? getProducto(cadenaId) : null;
  const dijes = (dijeIds || []).map(getProducto).filter(Boolean);
  const piezas = [hebilla, cadena, ...dijes].filter(Boolean);
  const total = piezas.reduce((s, p) => s + precioFinal(p), 0);
  return { hebilla, cadena, dijes, piezas, total };
}

function initArmador() {
  const el = document.querySelector('.armador');
  if (!el) return;
  const resumenDetalle = el.querySelector('.armador__resumen-detalle');
  const resumenTotal = el.querySelector('.armador__resumen-total b');
  const btnAgregar = el.querySelector('#armadorAgregar');
  const btnWsp = el.querySelector('#armadorWsp');

  function estado() {
    const hebillaId = el.querySelector('input[name="armador-hebilla"]:checked')?.value || '';
    const cadenaId = el.querySelector('input[name="armador-cadena"]:checked')?.value || '';
    const dijeIds = [...el.querySelectorAll('[data-armador="dije"]:checked')].map(i => i.value);
    return { hebillaId, cadenaId, dijeIds };
  }
  function actualizar() {
    const { hebillaId, cadenaId, dijeIds } = estado();
    const { piezas, total } = calcularArmado({ hebillaId, cadenaId, dijeIds });
    if (!piezas.length) {
      resumenDetalle.textContent = 'Elegí al menos una pieza para armar tu combinación.';
      resumenTotal.textContent = formatearPrecio(0);
      btnAgregar.disabled = true; btnWsp.setAttribute('aria-disabled', 'true'); btnWsp.tabIndex = -1;
      btnWsp.href = '#';
      return;
    }
    resumenDetalle.textContent = piezas.map(p => p.nombre).join(' + ');
    resumenTotal.textContent = formatearPrecio(total);
    btnAgregar.disabled = false; btnWsp.removeAttribute('aria-disabled'); btnWsp.tabIndex = 0;
    const msg = `Hola CentroRastrasEngarzados, quiero armar esta combinación:\n${piezas.map(p => `- ${p.nombre} (${formatearPrecio(precioFinal(p))})`).join('\n')}\nTotal: ${formatearPrecio(total)}`;
    btnWsp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }
  el.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(i => i.addEventListener('change', actualizar));
  btnAgregar.addEventListener('click', () => {
    const { hebillaId, cadenaId, dijeIds } = estado();
    const { piezas } = calcularArmado({ hebillaId, cadenaId, dijeIds });
    piezas.forEach(p => Cart.add(p, 1));
    showToast(`Sumamos ${piezas.length === 1 ? 'la pieza' : piezas.length + ' piezas'} al carrito`);
  });
  actualizar();
}

/* ===================== Momento propio: de la variedad al detalle ===================== */
function initCrece() {
  const wrap = document.querySelector('.crece');
  if (!wrap) return;
  const escena = wrap.querySelector('.crece__escena');
  const marco = wrap.querySelector('.crece__marco');
  const detalle = wrap.querySelector('.crece__layer--detalle');
  const tituloA = wrap.querySelector('.crece__titulo--a');
  const tituloB = wrap.querySelector('.crece__titulo--b');
  if (!escena || !marco || !detalle) return;

  if (reduceMotion) {
    marco.style.transform = 'scale(1.1)';
    detalle.style.opacity = '.55';
    if (tituloA) tituloA.style.opacity = '.5';
    if (tituloB) tituloB.style.opacity = '.5';
    return;
  }

  let ticking = false;
  const update = () => {
    ticking = false;
    const off = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
    const r = wrap.getBoundingClientRect();
    const recorrido = wrap.offsetHeight - escena.offsetHeight;
    if (recorrido <= 0) return;
    const progreso = Math.min(1, Math.max(0, (off - r.top) / recorrido));
    const escala = 0.72 + progreso * 0.5;
    marco.style.transform = `scale(${escala.toFixed(3)})`;
    const fade = Math.min(1, Math.max(0, (progreso - 0.55) / 0.35));
    detalle.style.opacity = fade.toFixed(3);
    if (tituloA) tituloA.style.opacity = (1 - fade).toFixed(3);
    if (tituloB) tituloB.style.opacity = fade.toFixed(3);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', update);
  update();
}

/* ===================== Lo más pedido (columna del taller, Modelo 2) ===================== */
function initTallerDestacados() {
  const cont = document.getElementById('tallerDestacados');
  if (!cont) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 5);
  cont.innerHTML = destacados.map(p => `
    <button type="button" class="taller-destacados__item" data-ver="${esc(p.id)}">
      <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="58" height="58">
      <span>
        <h3>${esc(p.nombre)}</h3>
        <p>${formatearPrecio(precioFinal(p))}</p>
      </span>
    </button>`).join('');
  cont.addEventListener('click', e => {
    const btn = e.target.closest('[data-ver]');
    if (btn) openQuickView(btn.dataset.ver);
  });
}

/* ===================== Mapa del taller (Leaflet) ===================== */
function initMapa() {
  const el = document.getElementById('tallerMapa');
  if (!el || typeof L === 'undefined') return;
  const coords = [-34.6037, -58.3816];
  const mapa = L.map(el, { zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false }).setView(coords, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapa);
  L.marker(coords).addTo(mapa);
}

/* ===================== Init ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initCatalogo();
  initRail();
  initTallerDestacados();
  updateCartBadge();
  initReveals();
  initNav();
  initFloats();
  initQuickView();
  initCartDrawer();
  initArmador();
  initCrece();
  initMapa();

  document.querySelectorAll('[data-categoria]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); filtrarPorCategoriaGlobal(el.dataset.categoria); });
  });
});
