const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const WHATSAPP_NUMBER = '5491138177352';

/* ===================== Talles y su factor de precio sobre la base (2 plazas) ===================== */
const TALLES = [
  { id: '1-plaza', label: '1 plaza', medida: '80x190', factor: 0.70 },
  { id: '1-plaza-media', label: '1 plaza y media', medida: '100x190', factor: 0.82 },
  { id: '2-plazas', label: '2 plazas', medida: '140x190', factor: 1 },
  { id: 'queen', label: 'Queen', medida: '160x200', factor: 1.22 },
  { id: 'king', label: 'King', medida: '200x200', factor: 1.45 },
];
const talleInfo = id => TALLES.find(t => t.id === id);
const RANK_FIRMEZA = { suave: 1, media: 2, firme: 3 };

/* ===================== Catálogo (fixtures de demo) ===================== */
const PRODUCTOS = [
  { id: 'resortes-esencial', slug: 'esencial-resortes', nombre: 'Esencial Resortes', categoria: 'resortes', subcategoria: 'Resortes Bonnell', firmeza: 'firme', precioBase: 259000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['entrada', 'bonnell', 'firme'], imagenes: ['images/hero.webp'], descripcion: 'Resortes bonnell con acolchado simple y funda de punto. Sostén parejo y firme, pensado como primer colchón de calidad de fábrica.' },
  { id: 'resortes-dual', slug: 'dual-verano-invierno', nombre: 'Dual Verano-Invierno', categoria: 'resortes', subcategoria: 'Resortes Pocket', firmeza: 'media', precioBase: 329000, descuento: 10, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['dual', 'pocket', 'media'], imagenes: ['images/hero-vertical.webp'], descripcion: 'Resortes pocket independientes con doble faz: una cara fresca para el verano y una acolchada para el invierno.' },
  { id: 'resortes-relax', slug: 'relax-pocket', nombre: 'Relax Pocket', categoria: 'resortes', subcategoria: 'Resortes Pocket', firmeza: 'suave', precioBase: 289000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen'], sinStock: [], destacado: false, tags: ['pocket', 'suave'], imagenes: ['images/variedad.webp'], descripcion: 'Resortes pocket individuales que acompañan cada movimiento sin transmitirlo al resto del colchón. Sensación suave y envolvente.' },
  { id: 'resortes-ortopedico', slug: 'ortopedico-reforzado', nombre: 'Ortopédico Reforzado', categoria: 'resortes', subcategoria: 'Resortes Bonnell', firmeza: 'firme', precioBase: 349000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: ['king'], destacado: false, tags: ['ortopedico', 'firme', 'refuerzo lumbar'], imagenes: ['images/hero.webp'], descripcion: 'Zonas de mayor densidad de resortes en el centro y refuerzo lumbar. Para quienes necesitan sostén extra en la zona media de la espalda.' },
  { id: 'resortes-premium', slug: 'premium-pillow-top', nombre: 'Premium Pillow Top', categoria: 'resortes', subcategoria: 'Resortes Pocket', firmeza: 'media', precioBase: 459000, descuento: 0, tamanos: ['1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: true, tags: ['premium', 'pillow top', 'pocket'], imagenes: ['images/hero-vertical.webp'], descripcion: 'Resortes pocket con una capa pillow top acolchada por encima: firmeza pareja por debajo y una superficie mullida al tacto.' },

  { id: 'espuma-alta-densidad', slug: 'alta-densidad-hr', nombre: 'Alta Densidad HR', categoria: 'espuma', subcategoria: 'Espuma HR', firmeza: 'firme', precioBase: 239000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['espuma', 'firme', 'una pieza'], imagenes: ['images/detalle.webp'], descripcion: 'Espuma de alta resiliencia en una sola pieza, sin resortes. Firmeza estable y duradera, ideal como base sólida.' },
  { id: 'espuma-viscoelastica-confort', slug: 'viscoelastica-confort', nombre: 'Viscoelástica Confort', categoria: 'espuma', subcategoria: 'Viscoelástica', firmeza: 'suave', precioBase: 379000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: true, tags: ['viscoelastica', 'suave', 'memory'], imagenes: ['images/detalle.webp'], descripcion: 'Capa viscoelástica que se adapta a la temperatura y el peso del cuerpo, con hundimiento suave y recuperación lenta.' },
  { id: 'espuma-ortopedica', slug: 'espuma-ortopedica', nombre: 'Espuma Ortopédica', categoria: 'espuma', subcategoria: 'Espuma HR', firmeza: 'media', precioBase: 299000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen'], sinStock: [], destacado: false, tags: ['ortopedica', 'media', 'capas'], imagenes: ['images/hero.webp'], descripcion: 'Capas de espuma de distinta densidad combinadas para un sostén parejo de columna, sin resultar rígida.' },
  { id: 'espuma-viscoelastica-premium', slug: 'viscoelastica-premium', nombre: 'Viscoelástica Premium', categoria: 'espuma', subcategoria: 'Viscoelástica', firmeza: 'suave', precioBase: 449000, descuento: 12, tamanos: ['1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['viscoelastica', 'premium', 'memory'], imagenes: ['images/detalle.webp'], descripcion: 'Viscoelástica de mayor espesor sobre núcleo de espuma HR: la combinación que más se acerca a la sensación de flotar.' },
  { id: 'espuma-economica', slug: 'espuma-clasica', nombre: 'Espuma Clásica', categoria: 'espuma', subcategoria: 'Espuma HR', firmeza: 'media', precioBase: 199000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas'], sinStock: [], destacado: false, tags: ['economica', 'liviana', 'entrada'], imagenes: ['images/variedad.webp'], descripcion: 'Espuma de densidad media en una sola pieza, con funda acolchada. Una opción liviana y directa para dormitorios secundarios.' },

  { id: 'sommier-box-clasico', slug: 'box-clasico', nombre: 'Box Clásico', categoria: 'sommiers', subcategoria: 'Box', firmeza: null, precioBase: 189000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['box', 'sin guardado', 'base'], imagenes: ['images/variedad.webp'], descripcion: 'Base tapizada lisa, sin espacio de guardado. Estructura simple y resistente para acompañar cualquiera de nuestros colchones.' },
  { id: 'sommier-baulera', slug: 'con-guardado-baulera', nombre: 'Con Guardado (Baulera)', categoria: 'sommiers', subcategoria: 'Con guardado', firmeza: null, precioBase: 349000, descuento: 0, tamanos: ['1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: true, tags: ['baulera', 'guardado', 'pistón a gas'], imagenes: ['images/sommier.webp'], descripcion: 'La tapa se levanta con pistón a gas y deja un compartimento interior para guardar blanquería o lo que no usás todos los días.' },
  { id: 'sommier-tapizado-alto', slug: 'tapizado-alto', nombre: 'Tapizado Alto', categoria: 'sommiers', subcategoria: 'Tapizado', firmeza: null, precioBase: 259000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['cabecera', 'tapizado', 'alto'], imagenes: ['images/sommier.webp'], descripcion: 'Cabecera tapizada de mayor altura integrada a la base. Suma presencia a la cama sin necesitar un respaldo aparte.' },
  { id: 'sommier-doble-base', slug: 'doble-base-reforzada', nombre: 'Doble Base Reforzada', categoria: 'sommiers', subcategoria: 'Box', firmeza: null, precioBase: 229000, descuento: 0, tamanos: ['2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['reforzado', 'doble base'], imagenes: ['images/variedad.webp'], descripcion: 'Dos bases unidas con refuerzo central, pensada para colchones más pesados o para quienes buscan mayor estabilidad.' },
  { id: 'sommier-box-bajo', slug: 'box-bajo', nombre: 'Box Bajo', categoria: 'sommiers', subcategoria: 'Box', firmeza: null, precioBase: 179000, descuento: 0, tamanos: ['1-plaza', '1-plaza-media', '2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['bajo', 'minimalista', 'perfil bajo'], imagenes: ['images/variedad.webp'], descripcion: 'Perfil bajo, de línea recta. Para dormitorios donde conviene que la base no compita con el colchón.' },
  { id: 'sommier-baulera-doble', slug: 'con-guardado-doble', nombre: 'Con Guardado Doble', categoria: 'sommiers', subcategoria: 'Con guardado', firmeza: null, precioBase: 419000, descuento: 0, tamanos: ['2-plazas', 'queen', 'king'], sinStock: [], destacado: false, tags: ['baulera', 'guardado', 'doble'], imagenes: ['images/sommier.webp'], descripcion: 'Dos compartimentos de guardado independientes, uno de cada lado de la cama. El doble de espacio que la baulera clásica.' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const talleDefault = p => p.tamanos.includes('2-plazas') ? '2-plazas' : p.tamanos[0];
const talleDisponible = (p, talle) => p.tamanos.includes(talle) && !p.sinStock.includes(talle);

function precioTalle(p, talle) {
  const t = talleInfo(talle);
  if (!t || !p.tamanos.includes(talle)) return null;
  return Math.round((p.precioBase * t.factor) / 100) * 100;
}
function precioFinal(p, talle) {
  const base = precioTalle(p, talle);
  if (base == null) return null;
  return p.descuento > 0 ? Math.round((base * (1 - p.descuento / 100)) / 100) * 100 : base;
}
function normalizar(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function coincideTexto(p, q) {
  if (!q) return true;
  const hay = normalizar([p.nombre, p.categoria, p.subcategoria, p.descripcion, ...(p.tags || [])].join(' '));
  return hay.includes(normalizar(q));
}

/* ===================== Carrito ===================== */
const Cart = {
  KEY: 'colchonsommier_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, 15);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, 15) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 15));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      const pf = p ? precioFinal(p, i.talle) : 0;
      return s + (pf || 0) * i.qty;
    }, 0);
  },
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
  const talle = talleDefault(p);
  const info = talleInfo(talle);
  const precio = precioFinal(p, talle);
  const original = precioTalle(p, talle);
  const agotadoDefault = p.sinStock.includes(talle);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge-off">-${p.descuento}%</span>`);
  if (p.destacado) badges.push(`<span class="badge badge-nuevo">Destacado</span>`);
  return `
  <article class="prod-card" data-animate style="opacity:0;transform:translateY(24px)" data-id="${esc(p.id)}">
    <div class="prod-card__media">
      <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}, ${esc(p.categoria === 'sommiers' ? 'sommier' : 'colchón')} de fábrica" width="1000" height="1000">
      <div class="prod-card__badges">${badges.join('')}</div>
      <button type="button" class="prod-card__ver" data-ver="${esc(p.id)}" aria-label="Vista rápida de ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>
      </button>
    </div>
    <p class="prod-card__cat">${esc(p.subcategoria)}</p>
    <h3 class="prod-card__nombre">${esc(p.nombre)}</h3>
    <p class="prod-card__precio">${formatearPrecio(precio)}${p.descuento > 0 ? `<s>${formatearPrecio(original)}</s>` : ''}</p>
    <p class="prod-card__talle">Medida ${esc(info.label)} (${esc(info.medida)})</p>
    <div class="prod-actions">
      <span class="stepper" data-stepper="${esc(p.id)}">
        <button type="button" data-menos aria-label="Restar cantidad">&minus;</button>
        <output>1</output>
        <button type="button" data-mas aria-label="Sumar cantidad">+</button>
      </span>
      <button type="button" class="btn btn-primary btn-sm prod-add" data-agregar="${esc(p.id)}" data-talle="${esc(talle)}" ${agotadoDefault ? 'disabled' : ''}>${agotadoDefault ? 'Sin stock' : 'Agregar'}</button>
    </div>
  </article>`;
}

/* ===================== Catálogo: estado, filtros, render ===================== */
const catalogo = {
  q: '', categorias: new Set(), firmezas: new Set(), tamanos: new Set(), visibles: 16,
  filtrar() {
    return PRODUCTOS.filter(p =>
      coincideTexto(p, this.q) &&
      (!this.categorias.size || this.categorias.has(p.categoria)) &&
      (!this.firmezas.size || (p.firmeza && this.firmezas.has(p.firmeza))) &&
      (!this.tamanos.size || p.tamanos.some(t => this.tamanos.has(t)))
    );
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
  document.querySelectorAll('[data-f="firmeza"]').forEach(cb => cb.addEventListener('change', () => {
    catalogo.firmezas.clear();
    document.querySelectorAll('[data-f="firmeza"]:checked').forEach(el => catalogo.firmezas.add(el.value));
    catalogo.visibles = 16; render();
  }));
  document.querySelectorAll('[data-f="tamano"]').forEach(cb => cb.addEventListener('change', () => {
    catalogo.tamanos.clear();
    document.querySelectorAll('[data-f="tamano"]:checked').forEach(el => catalogo.tamanos.add(el.value));
    catalogo.visibles = 16; render();
  }));

  btnLimpiar?.addEventListener('click', () => {
    catalogo.q = ''; catalogo.categorias.clear(); catalogo.firmezas.clear(); catalogo.tamanos.clear(); catalogo.visibles = 16;
    if (inputBuscar) inputBuscar.value = '';
    document.querySelectorAll('[data-f="cat"], [data-f="firmeza"], [data-f="tamano"]').forEach(el => { el.checked = false; });
    render();
  });

  btnVerMas?.addEventListener('click', () => { catalogo.visibles += 16; render(); });

  grid.addEventListener('click', e => {
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
      const talle = agregar.dataset.talle;
      const qty = parseInt(agregar.dataset.qty, 10) || 1;
      Cart.add(p, talle, qty);
      showToast(`Sumamos ${esc(p.nombre)} al carrito`);
    }
  });

  filtrarPorCategoriaGlobal = (cat) => {
    catalogo.categorias.clear(); catalogo.categorias.add(cat); catalogo.visibles = 16;
    document.querySelectorAll('[data-f="cat"]').forEach(el => { el.checked = el.value === cat; });
    render();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  render();
}
let filtrarPorCategoriaGlobal = () => {};

/* ===================== Vista rápida (modal de producto) ===================== */
let quickViewUntrap = null;
function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const backdrop = document.getElementById('modalProducto');
  if (!backdrop) return;
  const talle = talleDefault(p);
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);

  backdrop.querySelector('.modal-producto__grid').innerHTML = `
    <div class="modal-producto__media"><img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="900" height="900"></div>
    <div class="modal-producto__info">
      <p class="prod-card__cat">${esc(p.subcategoria)}</p>
      <h2 id="modalProductoTitulo">${esc(p.nombre)}</h2>
      <p class="modal-producto__precio" id="modalProductoPrecio"></p>
      <p class="modal-producto__desc">${esc(p.descripcion)}</p>
      <div class="modal-producto__opciones">
        <div>
          <label for="modalProductoTalle">Tamaño</label>
          <div class="modal-producto__talles" id="modalProductoTalles" role="group" aria-label="Elegí el tamaño"></div>
        </div>
        <div>
          <label>Cantidad</label>
          <span class="stepper" id="modalProductoStepper">
            <button type="button" data-menos aria-label="Restar cantidad">&minus;</button>
            <output>1</output>
            <button type="button" data-mas aria-label="Sumar cantidad">+</button>
          </span>
        </div>
      </div>
      <div class="modal-producto__cta">
        <button type="button" class="btn btn-primary" id="modalProductoAgregar">Agregar al carrito</button>
        <button type="button" class="btn btn-cta" id="modalProductoComprar">Comprar ahora</button>
      </div>
      <a class="btn btn-ghost btn-block btn-sm" style="margin-top:.6rem" target="_blank" rel="noopener" href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola ColchonSommier, tengo una consulta sobre ${p.nombre}.`)}">¿Dudas sobre este producto? Consultar por WhatsApp</a>
      ${relacionados.length ? `<div class="modal-relacionados"><h3>También te puede interesar</h3><div class="modal-relacionados__grid">${relacionados.map(r => `<button type="button" class="modal-relacionados__item" data-ver="${esc(r.id)}"><img src="${esc(r.imagenes[0])}" alt="${esc(r.nombre)}" width="200" height="200"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;

  let talleActivo = talle;
  const talles = backdrop.querySelector('#modalProductoTalles');
  const pintarTalles = () => {
    talles.innerHTML = p.tamanos.map(t => {
      const info = talleInfo(t);
      const disponible = talleDisponible(p, t);
      return `<label class="chip"><input type="radio" name="modalTalle" value="${t}" ${t === talleActivo ? 'checked' : ''} ${disponible ? '' : 'disabled'}>${esc(info.label)}${disponible ? '' : ' (sin stock)'}</label>`;
    }).join('');
  };
  const pintarPrecio = () => {
    const precio = precioFinal(p, talleActivo);
    const original = precioTalle(p, talleActivo);
    backdrop.querySelector('#modalProductoPrecio').innerHTML = `${formatearPrecio(precio)}${p.descuento > 0 ? `<s>${formatearPrecio(original)}</s>` : ''}`;
    const disponible = talleDisponible(p, talleActivo);
    const btnAgregar = backdrop.querySelector('#modalProductoAgregar');
    const btnComprar = backdrop.querySelector('#modalProductoComprar');
    btnAgregar.disabled = !disponible; btnComprar.disabled = !disponible;
    btnAgregar.textContent = disponible ? 'Agregar al carrito' : 'Sin stock en esta medida';
  };
  pintarTalles(); pintarPrecio();
  talles.addEventListener('change', e => { if (e.target.name === 'modalTalle') { talleActivo = e.target.value; pintarPrecio(); } });

  const stepper = backdrop.querySelector('#modalProductoStepper');
  const out = stepper.querySelector('output');
  stepper.addEventListener('click', e => {
    let v = parseInt(out.textContent, 10) || 1;
    if (e.target.closest('[data-mas]')) v = Math.min(v + 1, 10);
    if (e.target.closest('[data-menos]')) v = Math.max(1, v - 1);
    out.textContent = v;
  });

  backdrop.querySelector('#modalProductoAgregar').addEventListener('click', () => {
    Cart.add(p, talleActivo, parseInt(out.textContent, 10) || 1);
    showToast(`Sumamos ${esc(p.nombre)} al carrito`);
  });
  backdrop.querySelector('#modalProductoComprar').addEventListener('click', () => {
    Cart.add(p, talleActivo, parseInt(out.textContent, 10) || 1);
    closeQuickView();
    openCartDrawer();
  });
  backdrop.querySelectorAll('[data-ver]').forEach(btn => btn.addEventListener('click', () => openQuickView(btn.dataset.ver)));

  backdrop.hidden = false;
  window.lenis?.stop();
  document.body.classList.add('no-scroll');
  backdrop.querySelector('.modal-close')?.focus();
  quickViewUntrap = trapFocus(backdrop, closeQuickView);
}
function closeQuickView() {
  const backdrop = document.getElementById('modalProducto');
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  window.lenis?.start();
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
  if (!items.length) {
    lista.hidden = true; vacio.hidden = false; pie.hidden = true;
    return;
  }
  lista.hidden = false; vacio.hidden = true; pie.hidden = false;
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const info = talleInfo(i.talle);
    const precio = precioFinal(p, i.talle);
    return `
    <div class="cart-linea" data-id="${esc(i.id)}" data-talle="${esc(i.talle)}">
      <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="66" height="66">
      <div class="cart-linea__info">
        <h4>${esc(p.nombre)}</h4>
        <p class="talle">${esc(info.label)} · ${esc(info.medida)}</p>
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
  window.lenis?.stop();
  document.body.classList.add('no-scroll');
  drawer.querySelector('.cart-drawer__close')?.focus();
  cartUntrap = trapFocus(drawer, closeCartDrawer);
}
function closeCartDrawer() {
  const backdrop = document.getElementById('cartBackdrop');
  const drawer = document.getElementById('cartDrawer');
  if (!backdrop) return;
  backdrop.classList.remove('open'); drawer.classList.remove('open');
  window.lenis?.start();
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
    const { id, talle } = linea.dataset;
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, talle); renderCartDrawer(); return; }
    if (e.target.closest('[data-mas]') || e.target.closest('[data-menos]')) {
      const out = linea.querySelector('output');
      let v = parseInt(out.textContent, 10) || 1;
      v = e.target.closest('[data-mas]') ? v + 1 : Math.max(1, v - 1);
      Cart.setQty(id, talle, v);
      renderCartDrawer();
    }
  });
  document.getElementById('cartFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('cartVacioBtn')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCartDrawer(); });
}

/* ===================== Componente funcional: recomendador ===================== */
function recomendar({ postura, firmeza, tamano }) {
  const inferida = { 'boca-arriba': 'media', 'de-costado': 'suave', 'boca-abajo': 'firme', combinado: 'media' }[postura] || 'media';
  const objetivo = firmeza || inferida;
  const candidatos = PRODUCTOS.filter(p => p.categoria !== 'sommiers' && talleDisponible(p, tamano));
  const puntuados = candidatos.map(p => ({ p, dist: Math.abs(RANK_FIRMEZA[p.firmeza] - RANK_FIRMEZA[objetivo]) }));
  puntuados.sort((a, b) => a.dist - b.dist || precioFinal(a.p, tamano) - precioFinal(b.p, tamano));
  return puntuados.slice(0, 2).map(x => x.p);
}

function initRecomendador() {
  const el = document.querySelector('.recomendador');
  if (!el) return;
  const resultado = el.querySelector('.recomendador__resultado');
  const grid = el.querySelector('.reco-resultado-grid');
  const btn = el.querySelector('#recoCalcular');
  const grupos = el.querySelectorAll('input[type="radio"]');

  function estado() {
    const postura = el.querySelector('input[name="reco-postura"]:checked')?.value;
    const firmeza = el.querySelector('input[name="reco-firmeza"]:checked')?.value || '';
    const tamano = el.querySelector('input[name="reco-tamano"]:checked')?.value;
    return { postura, firmeza, tamano };
  }
  function sync() {
    const { postura, tamano } = estado();
    btn.disabled = !postura || !tamano;
  }
  grupos.forEach(r => r.addEventListener('change', sync));
  sync();

  btn.addEventListener('click', () => {
    const { postura, firmeza, tamano } = estado();
    if (!postura || !tamano) return;
    const recomendados = recomendar({ postura, firmeza, tamano });
    grid.innerHTML = recomendados.length ? recomendados.map(p => {
      const precio = precioFinal(p, tamano);
      const original = precioTalle(p, tamano);
      return `
      <div class="reco-card">
        <img src="${esc(p.imagenes[0])}" alt="${esc(p.nombre)}" width="74" height="74">
        <div class="reco-card__info">
          <h4>${esc(p.nombre)}</h4>
          <p class="precio">${formatearPrecio(precio)}${p.descuento > 0 ? `<s>${formatearPrecio(original)}</s>` : ''}</p>
          <p class="match">Firmeza ${esc(p.firmeza)} · ${esc(talleInfo(tamano).label)}</p>
          <div class="reco-card__cta">
            <button type="button" class="btn btn-ghost btn-ghost--claro btn-sm" data-ver="${esc(p.id)}">Ver ficha</button>
            <button type="button" class="btn btn-primary btn-sm" data-agregar-reco="${esc(p.id)}" data-talle="${esc(tamano)}">Agregar</button>
          </div>
        </div>
      </div>`;
    }).join('') : `<p style="color:rgba(255,255,255,.75)">No tenemos una medida ${esc(talleInfo(tamano)?.label || '')} disponible en esta combinación todavía. Escribinos por WhatsApp y te asesoramos.</p>`;
    resultado.classList.add('activo');
    resultado.querySelectorAll('[data-ver]').forEach(b => b.addEventListener('click', () => openQuickView(b.dataset.ver)));
    resultado.querySelectorAll('[data-agregar-reco]').forEach(b => b.addEventListener('click', () => {
      const p = getProducto(b.dataset.agregarReco);
      Cart.add(p, b.dataset.talle, 1);
      showToast(`Sumamos ${esc(p.nombre)} al carrito`);
    }));
  });
}

/* ===================== Momento propio: de la fábrica a tu casa ===================== */
function initDosMundos() {
  const wrap = document.querySelector('.dos-mundos');
  if (!wrap) return;
  const escena = wrap.querySelector('.dos-mundos__escena');
  const layerB = wrap.querySelector('.dos-mundos__layer--b');
  const linea = wrap.querySelector('.dos-mundos__linea');
  const etiquetas = wrap.querySelectorAll('.dos-mundos__etiqueta');
  if (!escena || !layerB) return;

  if (reduceMotion) {
    layerB.style.clipPath = 'inset(0 0 0 50%)';
    linea.style.left = '50%';
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
    const pct = (progreso * 100).toFixed(2);
    const bordeIzq = (100 - pct).toFixed(2);
    layerB.style.clipPath = `inset(0 0 0 ${bordeIzq}%)`;
    linea.style.left = bordeIzq + '%';
    etiquetas.forEach((elx, i) => elx.classList.toggle('activa', i === (progreso > 0.5 ? 1 : 0)));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', update);
  update();
}

/* ===================== Init ===================== */
document.addEventListener('DOMContentLoaded', () => {
  initCatalogo();
  updateCartBadge();
  initReveals();
  initNav();
  initFloats();
  initQuickView();
  initCartDrawer();
  initRecomendador();
  initDosMundos();

  document.querySelectorAll('[data-categoria]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); filtrarPorCategoriaGlobal(el.dataset.categoria); });
  });
  document.querySelectorAll('.recomendador-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.recomendador')?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      document.querySelector('input[name="reco-postura"]')?.focus();
    });
  });
});
