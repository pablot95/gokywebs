'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- DATOS ---------- */
const PRODUCTOS = [
  {
    id: 'step-air-roja', nombre: 'Step Air Roja', cat: 'hombre', tipo: 'zapatilla',
    precio: 118000, descuento: 15, img: 'images/zapatilla-deportiva-negra-roja_1x1.webp',
    alt: 'Zapatilla urbana negra con trama roja y cámara de aire',
    desc: 'Malla tejida negra con trama roja, cámara de aire visible y suela combinada. Liviana para todo el día, con el golpe de color justo.',
    talles: [39, 40, 41, 42, 43, 44], etiquetas: 'urbana running aire deportiva'
  },
  {
    id: 'step-cuero-black', nombre: 'Step Cuero Black', cat: 'hombre', tipo: 'zapatilla',
    precio: 125000, descuento: 0, img: 'images/zapatilla-hombre-negra_1x1.webp',
    alt: 'Zapatilla de cuero negra con talón rojo',
    desc: 'Cuero graneado negro con talón en rojo y suela robusta al tono. Sobria de lejos, con detalle de cerca: la que va con todo.',
    talles: [39, 40, 41, 42, 43, 44], etiquetas: 'cuero clasica urbana negra'
  },
  {
    id: 'court-blanca', nombre: 'Court Blanca', cat: 'dama', tipo: 'zapatilla',
    precio: 98000, descuento: 0, img: 'images/zapatilla-mujer-blanca-roja_1x1.webp',
    alt: 'Zapatilla blanca de plataforma con talón rojo',
    desc: 'Blanca de plataforma con talón rojo en cuero. El clásico que estiliza cualquier look, de jean a vestido.',
    talles: [35, 36, 37, 38, 39, 40], etiquetas: 'blanca plataforma clasica mujer'
  },
  {
    id: 'chunky-motion', nombre: 'Chunky Motion', cat: 'dama', tipo: 'zapatilla',
    precio: 109000, descuento: 10, img: 'images/zapatilla-mujer-chunky-blanca-roja_1x1.webp',
    alt: 'Zapatilla chunky blanca con detalles rojos y negros',
    desc: 'Suela chunky escalonada, paneles combinados en blanco, rojo y negro. Presencia total sin perder comodidad.',
    talles: [35, 36, 37, 38, 39, 40], etiquetas: 'chunky plataforma urbana mujer'
  },
  {
    id: 'sultan-rojo', nombre: 'Sultán Rojo', cat: 'perfumes', tipo: 'perfume',
    precio: 72000, descuento: 0, img: 'images/perfume-arabe-rojo-dorado_1x1.webp',
    alt: 'Perfume árabe rojo con tapa dorada calada',
    desc: 'Eau de parfum árabe de 100 ml. Salida de azafrán y frutos rojos, corazón de rosa y ámbar, fondo almizclado que dura el día entero.',
    talles: null, etiquetas: 'perfume arabe ambar azafran rosa unisex fragancia'
  },
  {
    id: 'oud-nocturno', nombre: 'Oud Nocturno', cat: 'perfumes', tipo: 'perfume',
    precio: 84000, descuento: 0, img: 'images/perfume-arabe-negro-dorado_1x1.webp',
    alt: 'Perfume árabe negro labrado con medallón dorado',
    desc: 'Eau de parfum árabe de 100 ml. Oud profundo con vainilla, cuero y especias dulces. Para la noche y para quien no quiere pasar desapercibido.',
    talles: null, etiquetas: 'perfume arabe oud vainilla cuero noche fragancia'
  }
];

const CAT_LABEL = { hombre: 'Zapatillas · Hombre', dama: 'Zapatillas · Dama', perfumes: 'Perfume árabe' };

/* ---------- HELPERS ---------- */
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/* ---------- CART ---------- */
const Cart = {
  KEY: 'stepscente_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = null) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

/* ---------- TOAST ---------- */
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

/* ---------- GRID ---------- */
let activeCat = 'all';
let query = '';

function productosFiltrados() {
  return PRODUCTOS.filter(p => {
    if (activeCat !== 'all' && p.cat !== activeCat) return false;
    if (query) {
      const hay = normalizar([p.nombre, p.cat, CAT_LABEL[p.cat], p.desc, p.etiquetas].join(' '));
      return query.split(/\s+/).every(t => hay.includes(t));
    }
    return true;
  });
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="card-badge badge-desc">-${p.descuento}%</span>`
    : (p.tipo === 'perfume' ? '<span class="card-badge">Original</span>' : '');
  const precio = p.descuento > 0
    ? `<span class="off">${formatearPrecio(final)}</span><s>${formatearPrecio(p.precio)}</s>`
    : `<span>${formatearPrecio(final)}</span>`;
  const acciones = p.tipo === 'zapatilla'
    ? `<button class="btn btn-dark" type="button" data-open="${p.id}">Elegir talle</button>`
    : `<div class="stepper" data-stepper>
         <button type="button" data-minus aria-label="Restar una unidad">−</button>
         <output aria-live="polite">1</output>
         <button type="button" data-plus aria-label="Sumar una unidad">+</button>
       </div>
       <button class="btn btn-cta" type="button" data-add="${p.id}">Agregar</button>`;
  return `<article class="card" data-id="${p.id}">
    <div class="card-media" data-open="${p.id}" role="button" tabindex="0" aria-label="Ver ${esc(p.nombre)}">
      ${badge}
      <img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" loading="lazy">
    </div>
    <div class="card-info">
      <span class="card-cat">${CAT_LABEL[p.cat] || ''}</span>
      <h3 class="card-name" data-open="${p.id}">${esc(p.nombre)}</h3>
      <p class="card-price">${precio}</p>
      <div class="card-actions">${acciones}</div>
    </div>
  </article>`;
}

function renderGrid() {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('results-count');
  const items = productosFiltrados();
  grid.innerHTML = items.map(cardHTML).join('');
  empty.hidden = items.length > 0;
  count.textContent = items.length === PRODUCTOS.length
    ? `${items.length} productos`
    : `${items.length} de ${PRODUCTOS.length} productos`;
  requestAnimationFrame(() => {
    grid.querySelectorAll('.card').forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 0.09, 0.6)}s`;
      requestAnimationFrame(() => card.classList.add('card-in'));
      card.addEventListener('transitionend', () => { card.style.transitionDelay = ''; }, { once: true });
    });
  });
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* ---------- RAIL DE DESTACADOS ---------- */
// orden curado: no es "los primeros del array" — abre con los que tienen descuento
// y alterna los dos mundos para que la vidriera cuente la marca entera
const DESTACADOS = ['step-air-roja', 'oud-nocturno', 'chunky-motion', 'step-cuero-black', 'sultan-rojo', 'court-blanca'];

function renderRail() {
  const track = document.getElementById('rail-track');
  if (!track) return;
  track.innerHTML = DESTACADOS.map(getProducto).filter(Boolean).map(cardHTML).join('');
  track.querySelectorAll('.card').forEach(c => c.classList.add('card-in'));
}

function initRail() {
  const vp = document.getElementById('rail');
  const track = document.getElementById('rail-track');
  if (!vp || !track) return;

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

  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => {
    const card = track.querySelector('.card');
    if (!card) return vp.clientWidth * 0.8;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
  };
  const syncArrows = () => {
    const max = vp.scrollWidth - vp.clientWidth;
    // el track lleva padding-inline para alinear con el container: con scroll-snap el reposo
    // de "principio" es ese padding, no 0 — sin esta tolerancia la flecha izquierda nunca se apaga
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= max - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();
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
    // el capture va en try/catch: si tira, no puede abortar el handler y dejar el rail
    // clavado en .dragging (esa clase apaga los pointer-events de las cards)
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
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

function setFilter(cat) {
  activeCat = cat;
  document.querySelectorAll('#chips .chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  renderGrid();
}

function initShop() {
  document.getElementById('chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) setFilter(chip.dataset.cat);
  });
  let debounce;
  document.getElementById('buscador').addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { query = normalizar(e.target.value.trim()); renderGrid(); }, 180);
  });
  document.getElementById('clear-filters').addEventListener('click', () => {
    query = '';
    document.getElementById('buscador').value = '';
    setFilter('all');
  });
  // mismas acciones en la grilla y en el rail de destacados
  ['grid', 'rail-track'].forEach(id => {
    const cont = document.getElementById(id);
    if (!cont) return;
    cont.addEventListener('click', onCardClick);
    cont.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.card-media')) {
        e.preventDefault();
        openModal(e.target.dataset.open);
      }
    });
  });
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });
}

function onCardClick(e) {
  const openId = e.target.closest('[data-open]')?.dataset.open;
  if (openId) { openModal(openId); return; }
  const addId = e.target.closest('[data-add]')?.dataset.add;
  if (addId) {
    const card = e.target.closest('.card');
    const qty = parseInt(card.querySelector('[data-stepper] output')?.textContent || '1', 10) || 1;
    const p = getProducto(addId);
    if (p) { Cart.add(p, qty); showToast('¡Agregado! Tu carrito te espera.'); }
    return;
  }
  handleStepper(e);
}

function handleStepper(e) {
  const stepper = e.target.closest('[data-stepper]');
  if (!stepper) return;
  const out = stepper.querySelector('output');
  let val = parseInt(out.textContent, 10) || 1;
  if (e.target.closest('[data-plus]')) val = Math.min(val + 1, 99);
  if (e.target.closest('[data-minus]')) val = Math.max(val - 1, 1);
  out.textContent = val;
}

/* ---------- MODAL (vista rápida) ---------- */
let modalLastFocus = null;
let modalTalle = null;

function openModal(id) {
  const p = getProducto(id);
  if (!p) return;
  modalTalle = null;
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? `${formatearPrecio(final)} <s>${formatearPrecio(p.precio)}</s> <span class="off">-${p.descuento}%</span>`
    : formatearPrecio(final);
  const talles = p.talles
    ? `<p class="talle-label">Elegí tu talle <em id="talle-aviso"></em></p>
       <div class="talles" id="talles">${p.talles.map(t => `<button class="talle" type="button" data-talle="${t}">${t}</button>`).join('')}</div>`
    : '';
  body.innerHTML = `
    <div class="modal-media"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800"></div>
    <div class="modal-info">
      <span class="card-cat">${CAT_LABEL[p.cat] || ''}</span>
      <h3>${esc(p.nombre)}</h3>
      <p class="modal-price">${precio}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      ${talles}
      <div class="modal-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-minus aria-label="Restar una unidad">−</button>
          <output aria-live="polite">1</output>
          <button type="button" data-plus aria-label="Sumar una unidad">+</button>
        </div>
        <button class="btn btn-dark" type="button" id="modal-add">Agregar al carrito</button>
        <button class="btn btn-cta" type="button" id="modal-buy">Comprar ahora</button>
      </div>
    </div>`;
  const tallesWrap = body.querySelector('#talles');
  if (tallesWrap) {
    tallesWrap.addEventListener('click', e => {
      const t = e.target.closest('.talle');
      if (!t) return;
      tallesWrap.querySelectorAll('.talle').forEach(b => b.classList.remove('sel'));
      t.classList.add('sel');
      modalTalle = t.dataset.talle;
      document.getElementById('talle-aviso').textContent = '';
    });
  }
  const agregar = abrirDrawer => {
    if (p.talles && !modalTalle) {
      document.getElementById('talle-aviso').textContent = '← elegí uno para seguir';
      return;
    }
    const qty = parseInt(body.querySelector('[data-stepper] output').textContent, 10) || 1;
    Cart.add(p, qty, modalTalle);
    closeModal();
    if (abrirDrawer) openDrawer();
    else showToast('¡Agregado! Tu carrito te espera.');
  };
  body.querySelector('#modal-add').addEventListener('click', () => agregar(false));
  body.querySelector('#modal-buy').addEventListener('click', () => agregar(true));

  modalLastFocus = document.activeElement;
  document.getElementById('modal-backdrop').hidden = false;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.inert = false;
  document.body.classList.add('overlay-open');
  document.getElementById('modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  document.getElementById('modal-backdrop').hidden = true;
  if (!document.getElementById('drawer').classList.contains('open')) document.body.classList.remove('overlay-open');
  if (modalLastFocus) modalLastFocus.focus();
}

/* ---------- DRAWER ---------- */
let drawerLastFocus = null;

function drawerItemHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  return `<div class="drawer-item" data-id="${p.id}" data-talle="${i.talle ?? ''}">
    <div class="drawer-item-img"><img src="${p.img}" alt="" width="72" height="72" loading="lazy"></div>
    <div class="drawer-item-info">
      <p>${esc(p.nombre)}</p>
      <span>${i.talle ? 'Talle ' + esc(i.talle) : 'EDP 100 ml'}</span>
      <div class="stepper" data-stepper>
        <button type="button" data-minus aria-label="Restar una unidad">−</button>
        <output aria-live="polite">${i.qty}</output>
        <button type="button" data-plus aria-label="Sumar una unidad">+</button>
      </div>
    </div>
    <div class="drawer-item-side">
      <strong>${formatearPrecio(precioFinal(p) * i.qty)}</strong>
      <button class="item-remove" type="button" data-remove aria-label="Quitar del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13"/></svg>
      </button>
    </div>
  </div>`;
}

function renderDrawer() {
  const drawer = document.getElementById('drawer');
  const items = Cart.get();
  drawer.classList.toggle('is-empty', items.length === 0);
  document.getElementById('drawer-items').innerHTML = items.map(drawerItemHTML).join('');
  document.getElementById('drawer-total-amount').textContent = formatearPrecio(Cart.total());
}

function openDrawer() {
  drawerLastFocus = document.activeElement;
  renderDrawer();
  document.getElementById('drawer-backdrop').hidden = false;
  const drawer = document.getElementById('drawer');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.inert = false;
  document.body.classList.add('overlay-open');
  document.getElementById('drawer-close').focus();
}

function closeDrawer() {
  const drawer = document.getElementById('drawer');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.inert = true;
  document.getElementById('drawer-backdrop').hidden = true;
  document.body.classList.remove('overlay-open');
  if (drawerLastFocus) drawerLastFocus.focus();
}

function initDrawer() {
  document.getElementById('cart-open').addEventListener('click', openDrawer);
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);
  document.getElementById('drawer-empty-cta').addEventListener('click', () => {
    closeDrawer();
    document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.getElementById('checkout-btn').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('drawer-items').addEventListener('click', e => {
    const item = e.target.closest('.drawer-item');
    if (!item) return;
    const id = item.dataset.id;
    const talle = item.dataset.talle || null;
    if (e.target.closest('[data-remove]')) { Cart.remove(id, talle); renderDrawer(); return; }
    const out = item.querySelector('output');
    let val = parseInt(out.textContent, 10) || 1;
    if (e.target.closest('[data-plus]')) val += 1;
    else if (e.target.closest('[data-minus]')) val = Math.max(1, val - 1);
    else return;
    Cart.setQty(id, talle, val);
    renderDrawer();
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  document.getElementById('modal-body').addEventListener('click', handleStepper);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('modal').classList.contains('open')) closeModal();
    else if (document.getElementById('drawer').classList.contains('open')) closeDrawer();
  });
}

/* ---------- BADGES ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

/* ---------- FLOATS: carrito + WhatsApp ---------- */
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
  cart?.addEventListener('click', openDrawer);
  sync();
}

/* ---------- NAV MOBILE ---------- */
function initNav() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-mobile');
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.getElementById('nav-close');
  const open = () => {
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    nav.inert = false;
    toggle.setAttribute('aria-expanded', 'true');
    backdrop.hidden = false;
  };
  const close = () => {
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    nav.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    backdrop.hidden = true;
  };
  toggle.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) close(); });
}

/* ---------- ANTI-COPIA ---------- */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ---------- REVEALS ---------- */
function initReveals() {
  const els = Array.from(document.querySelectorAll('[data-animate]'));
  if (!els.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const show = el => {
    el.style.transition = 'opacity .8s cubic-bezier(0.23,1,0.32,1), transform .8s cubic-bezier(0.23,1,0.32,1)';
    el.style.opacity = 1;
    el.style.transform = 'none';
    el.classList.add('in');
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { show(el); io.unobserve(el); }
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

/* ---------- MOVIMIENTO (GSAP) ---------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}

function setDualStatic() {
  document.getElementById('dual-scene')?.classList.add('is-static');
  document.querySelector('.dual')?.classList.add('is-short');
}

function initMotion() {
  const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (reduceMotion || !hasGsap) {
    setDualStatic();
    return;
  }

  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .fromTo('#hero-shoe', { x: 180, y: -40, rotation: -22, opacity: 0 }, { x: 0, y: 0, rotation: -8, opacity: 1, duration: 1.2 }, 0.15)
    .fromTo('#hero-perfume', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.45)
    .fromTo('.hero-scente-tag', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.8);

  gsap.to('.hero-giant-step', {
    xPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
  });
  gsap.to('#hero-shoe', {
    y: 60, rotation: -3,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 }
  });

  const dualTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.dual',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true
    }
  });
  // x:0 explícito: el CSS deja translateX(110%) y GSAP lo parsea a px; animar solo xPercent
  // dejaba ese desplazamiento heredado vivo y el panel nunca llegaba a cubrir la escena.
  dualTl
    .fromTo('#dual-panel',
      { xPercent: 110, x: 0, skewX: -7 },
      { xPercent: 0, x: 0, skewX: -7, duration: 4.6 }, 0)
    .to('.dual-step .dual-copy', { x: -70, opacity: 0, duration: 2.6 }, 1.2)
    .to('.dual-shoe', { x: -90, opacity: 0, duration: 2.6 }, 1.4)
    // yPercent explícito por el mismo motivo: el centrado vive en un translateY(-52%) del CSS
    .fromTo('.dual-giant-inv', { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 2 }, 4.5)
    .fromTo('.dual-perfume',
      { opacity: 0, y: 60, yPercent: -52 },
      { opacity: 1, y: 0, yPercent: -52, duration: 2 }, 4.8)
    .fromTo('.dual-copy-inv', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.7 }, 5.1);

  const path = document.getElementById('estela-path');
  if (path) {
    const len = path.getTotalLength();
    gsap.fromTo(path,
      { strokeDasharray: len, strokeDashoffset: len },
      {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#nosotros', start: 'top 85%', end: 'top 25%', scrub: 0.6 }
      }
    );
  }

  window.addEventListener('load', () => requestAnimationFrame(() => ScrollTrigger.refresh()));
  if (document.fonts?.ready) document.fonts.ready.then(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
}

/* ---------- ARRANQUE ---------- */
document.addEventListener('cart:updated', updateCartBadge);
renderRail();
renderGrid();
initShop();
initRail();
initDrawer();
initNav();
initFloats();
initReveals();
initMotion();
updateCartBadge();
