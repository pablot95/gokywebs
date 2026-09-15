'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = {
  buzos: 'Buzos y cardigans',
  camperas: 'Camperas',
  tops: 'Tops',
  faldas: 'Faldas',
  vestidos: 'Vestidos',
  conjuntos: 'Conjuntos',
};

const TALLES = ['XS', 'S', 'M', 'L'];

const PRODUCTOS = [
  {
    id: 'buzo-oversize-frutilla',
    nombre: 'Buzo oversize Frutilla',
    cat: 'buzos',
    precio: 38900,
    descuento: 0,
    nuevo: true,
    img: 'images/buzo-rosa-y-falda-plisada_1x1.webp',
    alt: 'Buzo rosa oversize con capucha sobre falda plisada blanca',
    desc: 'El buzo rosa que va con todo: calce oversize, frisa suave y capucha con cordones. Combinalo con tu falda plisada o un jean ancho.',
    tags: 'buzo hoodie canguro rosa frisa oversize',
  },
  {
    id: 'campera-denim-cherry',
    nombre: 'Campera denim Cherry',
    cat: 'camperas',
    precio: 52900,
    descuento: 15,
    nuevo: false,
    img: 'images/campera-denim-y-falda-rosa_1x1.webp',
    alt: 'Campera de jean celeste con falda rosa y lentes corazón',
    desc: 'Campera de jean lavado con roturas sutiles y calce cropped. La de las fotos con tus amigas: queda bien con falda, vestido o cargo.',
    tags: 'campera jean denim celeste cropped',
  },
  {
    id: 'bomber-school-black',
    nombre: 'Bomber School Black',
    cat: 'camperas',
    precio: 49900,
    nuevo: true,
    descuento: 0,
    img: 'images/campera-negra-y-pantalon-crema_1x1.webp',
    alt: 'Bomber negra con vivos crema y pantalón wide leg',
    desc: 'Bomber negra con vivos crema estilo college. Cierre metálico, puños elastizados y ese toque retro que levanta cualquier look.',
    tags: 'campera bomber negra college varsity',
  },
  {
    id: 'conjunto-comfy-vainilla',
    nombre: 'Conjunto comfy Vainilla',
    cat: 'conjuntos',
    precio: 45900,
    descuento: 0,
    nuevo: false,
    img: 'images/look-comfy-crema-y-rosa_1x1.webp',
    alt: 'Conjunto comfy: buzo crema y jogger rosa',
    desc: 'Buzo crema + jogger rosa en frisa peinada. El conjunto para estar cómoda sin resignar estilo: de la cama a la juntada sin escalas.',
    tags: 'conjunto comfy jogger buzo crema rosa set',
  },
  {
    id: 'top-puntilla-rose',
    nombre: 'Top puntilla Rosé',
    cat: 'tops',
    precio: 19900,
    descuento: 20,
    nuevo: false,
    img: 'images/top-rosa-y-falda-negra_1x1.webp',
    alt: 'Top rosa de morley con puntilla y falda plisada negra',
    desc: 'Top de morley rosa con detalle de puntilla en el escote. Manga larga, calce al cuerpo: la base perfecta para tu falda plisada.',
    tags: 'top morley puntilla rosa manga larga remera',
  },
  {
    id: 'vestido-volados-dulce',
    nombre: 'Vestido volados Dulce',
    cat: 'vestidos',
    precio: 41900,
    descuento: 0,
    nuevo: true,
    img: 'images/vestido-rosa-y-cardigan_1x1.webp',
    alt: 'Vestido rosa corto con volados y breteles',
    desc: 'Vestido rosa con volados en el ruedo y lazo en el escote. Liviano, con vuelo y romántico: para cumples, salidas y fotos que quedan.',
    tags: 'vestido rosa volados corto fiesta',
  },
  {
    id: 'falda-plisada-ballet',
    nombre: 'Falda plisada Ballet',
    cat: 'faldas',
    precio: 26900,
    descuento: 0,
    nuevo: false,
    img: 'images/modelo-look-negro-y-rosa_4x5.webp',
    alt: 'Falda plisada rosa con cardigan negro',
    desc: 'La falda plisada rosa del momento: tiro alto, tablas marcadas y calza con short interior. Con cardigan o buzo oversize, no falla.',
    tags: 'falda plisada rosa tenis pollera',
  },
  {
    id: 'cardigan-soft-cloud',
    nombre: 'Cardigan Soft Cloud',
    cat: 'buzos',
    precio: 33900,
    descuento: 10,
    nuevo: false,
    img: 'images/probador-look-cardigan-y-falda_9x16.webp',
    alt: 'Cardigan rosa suave con top blanco y falda negra',
    desc: 'Cardigan tejido rosa bebé, suave de verdad. Botones forrados y calce relajado: el abrigo liviano que te vas a poner todos los días.',
    tags: 'cardigan saco tejido rosa abrigo sweater',
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'bymicasentin_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Wishlist = {
  KEY: 'bymicasentin_wishlist',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  toggle(id) {
    const ids = this.get();
    const i = ids.indexOf(id);
    if (i >= 0) ids.splice(i, 1); else ids.push(id);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    return i < 0;
  },
  has(id) { return this.get().includes(id); },
};

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

const state = { cat: 'all', query: '' };

function productosFiltrados() {
  const q = normalizar(state.query.trim());
  return PRODUCTOS.filter(p => {
    if (state.cat !== 'all' && p.cat !== state.cat) return false;
    if (!q) return true;
    const blob = normalizar(`${p.nombre} ${CATEGORIAS[p.cat] || ''} ${p.cat} ${p.desc} ${p.tags}`);
    return q.split(/\s+/).every(w => blob.includes(w));
  });
}

function cardHTML(p) {
  const final = precioFinal(p);
  const wished = Wishlist.has(p.id);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media" data-qv="${p.id}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}">
      <button type="button" class="wish-btn${wished ? ' is-on' : ''}" data-wish="${p.id}" aria-label="${wished ? 'Quitar de favoritos' : 'Agregar a favoritos'}" aria-pressed="${wished}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21c-5-4-9-7.5-9-11.5C3 6.5 5 4.5 7.7 4.5c1.8 0 3.1 1 4.3 2.6 1.2-1.6 2.5-2.6 4.3-2.6C19 4.5 21 6.5 21 9.5c0 4-4 7.5-9 11.5Z" stroke-linejoin="round"/></svg>
      </button>
      <img src="${p.img}" alt="${esc(p.alt)}" width="600" height="600" loading="lazy">
      <span class="card-view" data-qv="${p.id}">Vista rápida</span>
    </div>
    <div class="card-info">
      <h3 class="card-name" data-qv="${p.id}">${esc(p.nombre)}</h3>
      <div class="card-price">
        <span>${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
      </div>
    </div>
  </article>`;
}

const grid = document.getElementById('productGrid');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const clearBtn = document.getElementById('clearFilters');

let cardObserver = null;

function revealCards() {
  const cards = grid.querySelectorAll('.card:not(.in)');
  if (!cards.length) return;
  cards.forEach((el, i) => { el.style.transitionDelay = `${Math.min((i % 4) * 0.1, 0.4)}s`; });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach(el => el.classList.add('in'));
    return;
  }
  if (cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); cardObserver.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  cards.forEach(el => cardObserver.observe(el));
  requestAnimationFrame(() => {
    cards.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) el.classList.add('in');
    });
  });
}

function renderGrid() {
  const items = productosFiltrados();
  grid.innerHTML = items.map(cardHTML).join('');
  emptyState.hidden = items.length > 0;
  resultCount.textContent = items.length === 1 ? '1 producto' : `${items.length} productos`;
  const filtered = state.cat !== 'all' || state.query.trim() !== '';
  clearBtn.hidden = !filtered;
  revealCards();
}

function setCat(cat, scroll = false) {
  state.cat = cat;
  document.querySelectorAll('#filterChips .chip').forEach(c => {
    const on = c.dataset.cat === cat;
    c.classList.toggle('is-active', on);
  });
  document.querySelectorAll('.cat-circle').forEach(c => c.classList.toggle('is-active', c.dataset.cat === cat));
  renderGrid();
  if (scroll) document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function initShop() {
  renderGrid();

  document.getElementById('filterChips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) setCat(chip.dataset.cat);
  });

  document.querySelectorAll('.cat-circle').forEach(btn => {
    btn.addEventListener('click', () => setCat(btn.dataset.cat, true));
  });

  document.querySelectorAll('[data-goto-cat]').forEach(btn => {
    btn.addEventListener('click', () => setCat(btn.dataset.gotoCat, true));
  });

  const search = document.getElementById('searchInput');
  search.addEventListener('input', () => { state.query = search.value; renderGrid(); });

  const clearAll = () => { state.query = ''; search.value = ''; setCat('all'); };
  clearBtn.addEventListener('click', clearAll);
  document.getElementById('emptyClear').addEventListener('click', clearAll);

  grid.addEventListener('click', e => {
    const wish = e.target.closest('[data-wish]');
    if (wish) {
      const added = Wishlist.toggle(wish.dataset.wish);
      wish.classList.toggle('is-on', added);
      wish.setAttribute('aria-pressed', added);
      wish.setAttribute('aria-label', added ? 'Quitar de favoritos' : 'Agregar a favoritos');
      wish.classList.remove('pop'); void wish.offsetWidth; wish.classList.add('pop');
      showToast(added ? 'Guardado en tus favoritos ♥' : 'Quitado de favoritos');
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) openQuickview(qv.dataset.qv);
  });

  document.getElementById('verTodo')?.addEventListener('click', () => {
    clearAll();
    grid.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  initRailDrag(grid);

  grid.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.card-media')) {
      e.preventDefault();
      openQuickview(e.target.dataset.qv);
    }
  });
}

let lastFocusQV = null;
const quickview = document.getElementById('quickview');
const qvBackdrop = document.getElementById('qvBackdrop');
const qvBody = document.getElementById('qvBody');

function openQuickview(id) {
  const p = getProducto(id);
  if (!p) return;
  lastFocusQV = document.activeElement;
  const final = precioFinal(p);
  const related = PRODUCTOS.filter(x => x.id !== id && x.cat === p.cat);
  const fill = PRODUCTOS.filter(x => x.id !== id && x.cat !== p.cat);
  const rel = related.concat(fill).slice(0, 3);
  qvBody.innerHTML = `
    <div class="qv-media"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800"></div>
    <div class="qv-info">
      <span class="qv-cat">${esc(CATEGORIAS[p.cat] || p.cat)}</span>
      <h2 class="qv-name">${esc(p.nombre)}</h2>
      <div class="qv-price">
        <span>${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s><span class="badge badge-off">-${p.descuento}%</span>` : ''}
      </div>
      <p class="qv-desc">${esc(p.desc)}</p>
      <span class="qv-label">Talle</span>
      <div class="qv-talles" role="group" aria-label="Elegir talle">
        ${TALLES.map(t => `<button type="button" class="talle-chip${t === 'M' ? ' is-on' : ''}" data-talle="${t}" aria-pressed="${t === 'M'}">${t}</button>`).join('')}
      </div>
      <div class="qv-actions">
        <div class="qty-step" aria-label="Cantidad">
          <button type="button" data-step="-1" aria-label="Restar uno">−</button>
          <output>1</output>
          <button type="button" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn-dark" data-qv-add="${p.id}">Agregar al carrito</button>
        <button type="button" class="btn-link" data-qv-buy="${p.id}">Comprar ahora</button>
      </div>
      ${rel.length ? `
      <div class="qv-related">
        <h3>También te puede gustar</h3>
        <div class="qv-rel-row">
          ${rel.map(r => `<div class="qv-rel" data-qv-open="${r.id}" role="button" tabindex="0"><img src="${r.img}" alt="${esc(r.alt)}" width="300" height="300" loading="lazy"><span>${esc(r.nombre)}</span></div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  quickview.classList.add('open');
  qvBackdrop.classList.add('open');
  quickview.removeAttribute('inert');
  document.body.classList.add('qv-open', 'no-scroll');
  document.getElementById('qvClose').focus();
}

function closeQuickview() {
  quickview.classList.remove('open');
  qvBackdrop.classList.remove('open');
  quickview.setAttribute('inert', '');
  document.body.classList.remove('qv-open', 'no-scroll');
  if (lastFocusQV) { lastFocusQV.focus?.(); lastFocusQV = null; }
}

function initQuickview() {
  document.getElementById('qvClose').addEventListener('click', closeQuickview);
  qvBackdrop.addEventListener('click', closeQuickview);
  qvBody.addEventListener('click', e => {
    const talle = e.target.closest('.talle-chip');
    if (talle) {
      talle.closest('.qv-talles').querySelectorAll('.talle-chip').forEach(t => { t.classList.toggle('is-on', t === talle); t.setAttribute('aria-pressed', t === talle); });
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.closest('.qty-step').querySelector('output');
      out.textContent = Math.max(1, Math.min(9, parseInt(out.textContent, 10) + parseInt(step.dataset.step, 10)));
      return;
    }
    const openRel = e.target.closest('[data-qv-open]');
    if (openRel) { openQuickview(openRel.dataset.qvOpen); return; }
    const addBtn = e.target.closest('[data-qv-add]');
    const buyBtn = e.target.closest('[data-qv-buy]');
    if (addBtn || buyBtn) {
      const p = getProducto((addBtn || buyBtn).dataset.qvAdd || (addBtn || buyBtn).dataset.qvBuy);
      if (!p) return;
      const talleSel = qvBody.querySelector('.qv-talles .talle-chip.is-on')?.dataset.talle || 'M';
      const qty = parseInt(qvBody.querySelector('.qty-step output')?.textContent || '1', 10);
      Cart.add(p, talleSel, qty);
      if (buyBtn) { closeQuickview(); openDrawer(); }
      else showToast(`¡Agregado! ${p.nombre} (${talleSel}) te espera en el carrito`);
    }
  });
  qvBody.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-qv-open]')) {
      e.preventDefault();
      openQuickview(e.target.dataset.qvOpen);
    }
  });
}

const drawer = document.getElementById('cartDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
let lastFocusDrawer = null;

function renderDrawer() {
  const items = Cart.get();
  const itemsBox = document.getElementById('drawerItems');
  const emptyBox = document.getElementById('drawerEmpty');
  const foot = document.getElementById('drawerFoot');
  if (!items.length) {
    itemsBox.innerHTML = '';
    emptyBox.style.display = 'grid';
    foot.style.display = 'none';
    return;
  }
  emptyBox.style.display = 'none';
  foot.style.display = 'grid';
  itemsBox.innerHTML = items.map((i, idx) => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
    <div class="drawer-item" style="animation-delay:${Math.min(idx * 0.06, 0.3)}s" data-line-id="${p.id}" data-line-talle="${i.talle}">
      <img src="${p.img}" alt="${esc(p.alt)}" width="76" height="76">
      <div class="di-info">
        <span class="di-name">${esc(p.nombre)}</span>
        <span class="di-meta">Talle ${esc(i.talle)}</span>
        <span class="di-price">${formatearPrecio(precioFinal(p) * i.qty)}</span>
      </div>
      <div class="di-side">
        <button type="button" class="di-remove" data-line-remove aria-label="Quitar ${esc(p.nombre)} talle ${esc(i.talle)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"/></svg>
        </button>
        <div class="qty-step sm" aria-label="Cantidad">
          <button type="button" data-line-step="-1" aria-label="Restar uno">−</button>
          <output>${i.qty}</output>
          <button type="button" data-line-step="1" aria-label="Sumar uno">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
}

function openDrawer() {
  lastFocusDrawer = document.activeElement;
  renderDrawer();
  drawer.classList.add('open');
  drawerBackdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('drawer-open', 'no-scroll');
  document.getElementById('drawerClose').focus();
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('drawer-open', 'no-scroll');
  if (lastFocusDrawer) { lastFocusDrawer.focus?.(); lastFocusDrawer = null; }
}

function initDrawer() {
  document.getElementById('cartBtnHeader').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  document.getElementById('drawerEmptyCta').addEventListener('click', () => {
    closeDrawer();
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.getElementById('clearCart').addEventListener('click', () => { Cart.clear(); showToast('Carrito vacío. ¡A empezar de nuevo!'); });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.getElementById('drawerItems').addEventListener('click', e => {
    const line = e.target.closest('[data-line-id]');
    if (!line) return;
    const id = line.dataset.lineId;
    const talle = line.dataset.lineTalle;
    if (e.target.closest('[data-line-remove]')) { Cart.remove(id, talle); return; }
    const step = e.target.closest('[data-line-step]');
    if (step) {
      const current = Cart.get().find(i => i.id === id && i.talle === talle);
      if (current) Cart.setQty(id, talle, current.qty + parseInt(step.dataset.lineStep, 10));
    }
  });
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderDrawer(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
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
  cart?.addEventListener('click', openDrawer);
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

function initReveals() {
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

function initDoodles() {
  const doodles = document.querySelectorAll('.doodle');
  if (!doodles.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    doodles.forEach(d => d.classList.add('drawn'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } });
  }, { threshold: 0 });
  doodles.forEach(d => io.observe(d));
}

function initStories() {
  const section = document.querySelector('.stories');
  const track = document.getElementById('storiesTrack');
  const slides = track ? Array.from(track.querySelectorAll('.story-slide')) : [];
  const segs = track ? Array.from(track.querySelectorAll('.phone-progress .seg i')) : [];
  if (!track || !slides.length) return;

  document.querySelectorAll('[data-story-product]').forEach(btn => {
    btn.addEventListener('click', () => openQuickview(btn.dataset.storyProduct));
  });

  if (reduceMotion) {
    section.classList.add('is-static');
    slides.forEach(s => s.classList.add('is-on'));
    return;
  }

  const total = slides.length;
  let current = -1;
  const setStep = p => {
    const step = Math.max(0, Math.min(total - 1, Math.floor(p * total)));
    if (step !== current) {
      current = step;
      slides.forEach((s, i) => s.classList.toggle('is-on', i <= step));
    }
    segs.forEach((seg, i) => {
      const fill = Math.max(0, Math.min(1, p * total - i));
      seg.style.width = `${fill * 100}%`;
    });
  };

  const update = () => {
    const rect = track.getBoundingClientRect();
    const range = rect.height - window.innerHeight;
    if (range <= 0) { setStep(1); return; }
    const p = Math.max(0, Math.min(1, -rect.top / range));
    setStep(p);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initRailDrag(rail) {
  if (!rail) return;
  let startX = 0, startLeft = 0, dragging = false, moved = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragging = true; moved = false;
    startX = e.clientX; startLeft = rail.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6 && !moved) { moved = true; rail.classList.add('dragging'); }
    if (moved) rail.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    if (moved) requestAnimationFrame(() => rail.classList.remove('dragging'));
  });
  rail.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
}

function initHeroCarousel() {
  const wrap = document.getElementById('heroCarousel');
  if (!wrap) return;
  const slides = Array.from(wrap.querySelectorAll('.hero-slide'));
  const dots = Array.from(wrap.querySelectorAll('.hero-dot'));
  if (slides.length < 2) return;
  let current = 0, timer = null;
  const go = i => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-on', j === current));
    dots.forEach((d, j) => d.classList.toggle('is-on', j === current));
  };
  const play = () => {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 5000);
  };
  dots.forEach(d => d.addEventListener('click', () => { go(parseInt(d.dataset.slide, 10)); play(); }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer); else play();
  });
  play();
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (quickview.classList.contains('open')) { closeQuickview(); return; }
  if (drawer.classList.contains('open')) closeDrawer();
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const modal = quickview.classList.contains('open') ? quickview : (drawer.classList.contains('open') ? drawer : null);
  if (!modal) return;
  const focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

document.addEventListener('cart:updated', updateCartBadge);

initShop();
initQuickview();
initDrawer();
initFloats();
initNav();
initReveals();
initDoodles();
initStories();
initHeroCarousel();
updateCartBadge();
renderDrawer();
