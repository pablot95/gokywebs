const WHATSAPP_NUMBER = '5491137975190';
const SEMANAS = 42;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waHref = lines => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refreshST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const PRODUCTOS = [
  { id: 'honda-wave-110i-roja', marca: 'Honda', modelo: 'Wave 110i', color: 'Roja', estilo: 'urbana', freno: 'disco', llantas: 'aleación', precio: 98000, img: 'images/moto-honda-wave-roja.webp', badge: 'Freno a disco', credito: 'Foto: Chanokchon, CC BY-SA 4.0 (Wikimedia Commons), retocada', desc: 'Underbone urbana de 110 cc con llantas de aleación y freno delantero a disco. Cambios semiautomáticos: pasás de marcha sin embrague.' },
  { id: 'honda-wave-110-blanca', marca: 'Honda', modelo: 'Wave 110 Edición especial', color: 'Blanca', estilo: 'urbana', freno: 'disco', llantas: 'aleación', precio: 104000, img: 'images/moto-honda-wave-blanca.webp', badge: 'Llantas doradas', credito: 'Foto: Chanokchon, CC BY-SA 4.0 (Wikimedia Commons), retocada', desc: 'La Wave en su edición especial: carrocería blanca, llantas de aleación doradas y freno delantero a disco.' },
  { id: 'honda-super-cub-110-amarilla', marca: 'Honda', modelo: 'Super Cub 110', color: 'Amarilla', estilo: 'clasica', freno: 'disco', llantas: 'rayos', precio: 118000, img: 'images/moto-honda-cub-amarilla.webp', badge: 'Clásica', credito: 'Foto: Chanokchon, CC BY-SA 4.0 (Wikimedia Commons), retocada', desc: 'El diseño Cub de siempre, con escudo de piernas y llantas de rayos. Esta versión trae freno delantero a disco y parrilla delantera.' },
  { id: 'honda-super-cub-110-celeste', marca: 'Honda', modelo: 'Super Cub 110', color: 'Celeste', estilo: 'clasica', freno: 'tambor', llantas: 'rayos', precio: 112000, img: 'images/moto-honda-cub-celeste.webp', badge: 'Clásica', credito: 'Foto: Chanokchon, CC BY-SA 4.0 (Wikimedia Commons), retocada', desc: 'Super Cub en celeste y crema, con llantas de rayos, freno a tambor y parrilla delantera para llevar cosas.' },
  { id: 'zanella-zb-110-lt', marca: 'Zanella', modelo: 'ZB 110 LT', color: 'Blanca', estilo: 'urbana', freno: 'tambor', llantas: 'rayos', precio: 82000, img: 'images/moto-zanella-zb110.webp', badge: 'Marca argentina', credito: 'Foto: Just a Man, CC BY 4.0 (Wikimedia Commons), retocada', desc: 'La underbone de Zanella, marca argentina: 110 cc, llantas de rayos y freno a tambor. La opción más accesible del catálogo.' },
  { id: 'suzuki-smash-110', marca: 'Suzuki', modelo: 'Smash 110', color: 'Amarilla y negra', estilo: 'urbana', freno: 'disco', llantas: 'aleación', precio: 88000, img: 'images/moto-suzuki-smash.webp', badge: 'Freno a disco', credito: 'Foto: Jasonsamuelea, CC BY-SA 4.0 (Wikimedia Commons), retocada', desc: 'Underbone de Suzuki con llantas de aleación negras y freno delantero a disco.' }
];
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioFinal = p => p.precio;
const nombreCompleto = p => `${p.marca} ${p.modelo}`;

const Cart = {
  KEY: 'ra_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; } document.dispatchEvent(new CustomEvent('cart:updated')); },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function hoyCero() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function proximoLunes() {
  const d = hoyCero();
  const dia = d.getDay();
  d.setDate(d.getDate() + (dia === 1 ? 7 : (8 - dia) % 7));
  return d;
}
const sumarSemanas = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n * 7); return r; };
const fechaCorta = d => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
const fechaDiaMes = d => `${d.getDate()}/${d.getMonth() + 1}`;
const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = d => `${DIAS_LARGOS[d.getDay()]} ${d.getDate()} de ${MESES_LARGOS[d.getMonth()]} de ${d.getFullYear()}`;
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaDisplay = d => `${d.getDate()} ${MESES_CORTOS[d.getMonth()]} ${d.getFullYear()}`;
const INICIO = proximoLunes();

function stripHTML(hasta, dueña) {
  let s = '';
  for (let i = 1; i <= SEMANAS; i++) {
    const cls = i === SEMANAS && dueña ? 'own' : i <= hasta ? 'on' : '';
    s += `<i${cls ? ` class="${cls}"` : ''}></i>`;
  }
  return s;
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
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
  cart?.addEventListener('click', () => openCartDrawer(cart));
  sync();
}

function focoAtrapado(e, cont) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('button:not([disabled]), [href], input, select, textarea')].filter(x => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirCapa(el, onKey) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  const mostrar = () => el.classList.add('open');
  requestAnimationFrame(() => requestAnimationFrame(mostrar));
  setTimeout(mostrar, 60);
  document.addEventListener('keydown', onKey);
}
function cerrarCapa(el, onKey, origen) {
  el.classList.remove('open');
  document.removeEventListener('keydown', onKey);
  const fin = () => { el.hidden = true; if (!document.querySelector('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll'); };
  if (reduceMotion) fin(); else setTimeout(fin, 380);
  origen?.focus?.();
}

const cartUI = { el: null, origen: null };
function teclasCarrito(e) { if (e.key === 'Escape') closeCartDrawer(); else focoAtrapado(e, cartUI.el); }
function openCartDrawer(origen) {
  cartUI.el = document.getElementById('cartDrawer');
  if (!cartUI.el) return;
  if (!document.getElementById('prodModal').hidden) cerrarModal(false);
  cartUI.origen = origen || document.activeElement;
  renderCart();
  abrirCapa(cartUI.el, teclasCarrito);
  setTimeout(() => cartUI.el.querySelector('.drawer-close')?.focus(), 60);
}
function closeCartDrawer() { if (cartUI.el && !cartUI.el.hidden) cerrarCapa(cartUI.el, teclasCarrito, cartUI.origen); }

function renderCart() {
  const items = Cart.get().filter(i => getProducto(i.id));
  const body = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const foot = document.getElementById('cartFoot');
  if (!body) return;
  if (!items.length) { body.innerHTML = ''; body.hidden = true; foot.hidden = true; empty.hidden = false; return; }
  body.hidden = false; foot.hidden = false; empty.hidden = true;
  body.innerHTML = items.map((it, i) => {
    const p = getProducto(it.id);
    return `<div class="cart-item" style="--i:${i}">
      <img src="${p.img}" width="1200" height="1200" alt="${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}">
      <div>
        <p class="ci-name">${esc(nombreCompleto(p))} · ${esc(p.color)}</p>
        <p class="ci-price">${formatearPrecio(p.precio)} por semana · es tuya el ${fechaCorta(sumarSemanas(INICIO, SEMANAS))}</p>
        <div class="ci-row">
          <div class="stepper" data-cart-step="${p.id}">
            <button type="button" data-step="-1" aria-label="Una moto menos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12l14 0"/></svg></button>
            <output>${it.qty}</output>
            <button type="button" data-step="1" aria-label="Una moto más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></button>
          </div>
          <button type="button" class="ci-remove" data-remove="${p.id}">Quitar</button>
        </div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}

function initCart() {
  document.getElementById('headerCart')?.addEventListener('click', e => openCartDrawer(e.currentTarget));
  const drawer = document.getElementById('cartDrawer');
  drawer?.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', closeCartDrawer));
  document.getElementById('cartItems')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step] [data-step]');
    if (step) {
      const id = step.closest('[data-cart-step]').dataset.cartStep;
      const it = Cart.get().find(x => x.id === id);
      if (it) Cart.setQty(id, it.qty + Number(step.dataset.step));
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) { Cart.remove(rm.dataset.remove); showToast('Listo, la sacamos del carrito.'); }
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); if (cartUI.el && !cartUI.el.hidden) renderCart(); });
  updateCartBadge();
}

function agregar(id, qty, abrir, origen) {
  const p = getProducto(id);
  if (!p) return;
  Cart.add(p, qty);
  if (abrir) openCartDrawer(origen);
  else showToast(`Sumaste la ${nombreCompleto(p)} ${p.color.toLowerCase()} al carrito.`);
}

const cat = { q: '', marca: '', estilo: '', freno: '', sort: 'rec', visibles: 16 };
const normalizar = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function cardHTML(p, i) {
  const own = sumarSemanas(INICIO, SEMANAS);
  return `<li class="prod" style="--i:${i}">
    <button type="button" class="prod-media" data-open="${p.id}" aria-label="Ver la ficha de la ${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}">
      <img src="${p.img}" width="1200" height="1200" alt="${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}">
      <span class="prod-badge">${esc(p.badge)}</span>
    </button>
    <div class="prod-body">
      <p class="prod-brand">${esc(p.marca)}</p>
      <h3><button type="button" class="prod-name" data-open="${p.id}">${esc(p.modelo)} · ${esc(p.color)}</button></h3>
      <p class="prod-meta">110 cc · 4 cambios · freno a ${esc(p.freno)}</p>
      <p class="prod-price"><strong>${formatearPrecio(p.precio)}</strong><span>por semana</span></p>
      <div class="prod-own"><span class="strip" aria-hidden="true">${stripHTML(0, true)}</span><span>Si arrancás el lunes ${fechaDiaMes(INICIO)}, es tuya el <strong>${fechaCorta(own)}</strong></span></div>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step="-1" aria-label="Una moto menos"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12l14 0"/></svg></button>
          <output aria-live="polite">1</output>
          <button type="button" data-step="1" aria-label="Una moto más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5l0 14"/><path d="M5 12l14 0"/></svg></button>
        </div>
        <button type="button" class="btn btn--ghost btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}"><svg class="lbl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6" stroke-linecap="round"/></svg><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button>
        <button type="button" class="btn btn--cta btn--sm prod-buy" data-buy="${p.id}">Reservar ahora</button>
      </div>
    </div>
  </li>`;
}

function filtrar() {
  const q = normalizar(cat.q.trim());
  let lista = PRODUCTOS.filter(p => {
    if (cat.marca && p.marca !== cat.marca) return false;
    if (cat.estilo && p.estilo !== cat.estilo) return false;
    if (cat.freno && p.freno !== cat.freno) return false;
    if (q) {
      const texto = normalizar([p.marca, p.modelo, p.color, p.estilo === 'clasica' ? 'clasica cub' : 'urbana', p.badge, p.desc, 'freno ' + p.freno, 'llantas ' + p.llantas].join(' '));
      if (!q.split(/\s+/).every(t => texto.includes(t))) return false;
    }
    return true;
  });
  if (cat.sort === 'asc') lista = [...lista].sort((a, b) => a.precio - b.precio);
  if (cat.sort === 'desc') lista = [...lista].sort((a, b) => b.precio - a.precio);
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrar();
  const vis = lista.slice(0, cat.visibles);
  grid.innerHTML = vis.map(cardHTML).join('');
  document.getElementById('catCount').textContent = lista.length === 1 ? '1 moto' : `${lista.length} motos`;
  document.getElementById('catEmpty').hidden = lista.length > 0;
  document.getElementById('catMore').hidden = lista.length <= cat.visibles;
  document.getElementById('catClear').hidden = !(cat.q || cat.marca || cat.estilo || cat.freno || cat.sort !== 'rec');
  refreshST();
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const search = document.getElementById('catSearch');
  let t = null;
  search.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { cat.q = search.value; cat.visibles = 16; renderCatalogo(); }, 180); });
  document.querySelectorAll('.filters input[type="radio"]').forEach(r => r.addEventListener('change', () => { cat[r.name] = r.value; cat.visibles = 16; renderCatalogo(); }));
  document.getElementById('catSort').addEventListener('change', e => { cat.sort = e.target.value; renderCatalogo(); });
  const limpiar = () => {
    Object.assign(cat, { q: '', marca: '', estilo: '', freno: '', sort: 'rec', visibles: 16 });
    search.value = '';
    document.getElementById('catSort').value = 'rec';
    document.querySelectorAll('.filters input[type="radio"][value=""]').forEach(r => { r.checked = true; });
    renderCatalogo();
  };
  document.getElementById('catClear').addEventListener('click', limpiar);
  document.getElementById('catEmptyClear').addEventListener('click', limpiar);
  document.getElementById('catMore').addEventListener('click', () => { cat.visibles += 16; renderCatalogo(); });
  const ft = document.getElementById('filtersToggle');
  const fp = document.getElementById('filtersPanel');
  ft?.addEventListener('click', () => {
    const abierto = fp.classList.toggle('open');
    ft.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    refreshST();
  });
  grid.addEventListener('click', e => {
    const step = e.target.closest('[data-stepper] [data-step]');
    if (step) {
      const out = step.closest('[data-stepper]').querySelector('output');
      out.textContent = Math.max(1, Math.min(5, Number(out.textContent) + Number(step.dataset.step)));
      return;
    }
    const cantidad = el => Number(el.closest('.prod')?.querySelector('[data-stepper] output')?.textContent || 1);
    const add = e.target.closest('[data-add]');
    if (add) { agregar(add.dataset.add, cantidad(add), false); return; }
    const buy = e.target.closest('[data-buy]');
    if (buy) { agregar(buy.dataset.buy, cantidad(buy), true, buy); return; }
    const open = e.target.closest('[data-open]');
    if (open) abrirModal(open.dataset.open, open);
  });
  renderCatalogo();
}

const modal = { el: null, id: null, origen: null, qty: 1 };
function teclasModal(e) { if (e.key === 'Escape') cerrarModal(true); else focoAtrapado(e, modal.el); }
function llenarModal(id) {
  const p = getProducto(id);
  if (!p) return false;
  modal.id = id; modal.qty = 1;
  const own = sumarSemanas(INICIO, SEMANAS);
  const img = document.getElementById('pmImg');
  img.src = p.img; img.alt = `${nombreCompleto(p)} ${p.color.toLowerCase()}`;
  document.getElementById('pmCredit').textContent = p.credito;
  document.getElementById('pmBrand').textContent = p.marca;
  document.getElementById('pmTitle').textContent = p.modelo;
  document.getElementById('pmColor').textContent = `Moto ${p.color.toLowerCase()}`;
  document.getElementById('pmPrice').textContent = formatearPrecio(p.precio);
  document.getElementById('pmStart').textContent = `lunes ${fechaDiaMes(INICIO)}`;
  document.getElementById('pmOwn').textContent = fechaLarga(own);
  document.getElementById('pmStrip').innerHTML = stripHTML(0, true);
  document.getElementById('pmSpecs').innerHTML = ['110 cc', '4 cambios semiautomáticos', `Llantas de ${p.llantas}`, `Freno delantero a ${p.freno}`, `42 semanas: ${formatearPrecio(p.precio * SEMANAS)} en total`].map(s => `<li>${esc(s)}</li>`).join('');
  document.getElementById('pmDesc').textContent = p.desc;
  document.getElementById('pmQty').textContent = '1';
  document.getElementById('pmWa').href = waHref([`Hola Ra! Quiero consultar por la ${nombreCompleto(p)} ${p.color.toLowerCase()} (${formatearPrecio(p.precio)} por semana).`, `Si arranco el lunes ${fechaDiaMes(INICIO)}, ¿sería mía el ${fechaCorta(own)}?`]);
  const rel = PRODUCTOS.filter(x => x.id !== id).sort((a, b) => (b.estilo === p.estilo) - (a.estilo === p.estilo) || Math.abs(a.precio - p.precio) - Math.abs(b.precio - p.precio)).slice(0, 3);
  document.getElementById('pmRelated').innerHTML = rel.map(r => `<li><button type="button" data-rel="${r.id}"><img src="${r.img}" width="1200" height="1200" alt=""><span>${esc(nombreCompleto(r))} · ${esc(r.color)}</span></button></li>`).join('');
  return true;
}
function abrirModal(id, origen) {
  modal.el = document.getElementById('prodModal');
  if (!modal.el || !llenarModal(id)) return;
  modal.origen = origen || document.activeElement;
  abrirCapa(modal.el, teclasModal);
  setTimeout(() => modal.el.querySelector('.modal-close')?.focus(), 60);
  const url = new URL(location.href); url.searchParams.set('moto', id); window.history.replaceState(null, '', url);
}
function cerrarModal(devolverFoco) {
  if (!modal.el || modal.el.hidden) return;
  cerrarCapa(modal.el, teclasModal, devolverFoco ? modal.origen : null);
  const url = new URL(location.href); url.searchParams.delete('moto'); window.history.replaceState(null, '', url);
}
function initModal() {
  const el = document.getElementById('prodModal');
  if (!el) return;
  el.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => cerrarModal(true)));
  document.getElementById('pmStepper').addEventListener('click', e => {
    const b = e.target.closest('[data-step]'); if (!b) return;
    modal.qty = Math.max(1, Math.min(5, modal.qty + Number(b.dataset.step)));
    document.getElementById('pmQty').textContent = modal.qty;
  });
  document.getElementById('pmAdd').addEventListener('click', () => agregar(modal.id, modal.qty, false));
  document.getElementById('pmBuy').addEventListener('click', () => { const id = modal.id; agregar(id, modal.qty, true, modal.origen); });
  document.getElementById('pmRelated').addEventListener('click', e => {
    const b = e.target.closest('[data-rel]'); if (!b) return;
    llenarModal(b.dataset.rel);
    el.querySelector('.modal-panel').scrollTop = 0;
    const url = new URL(location.href); url.searchParams.set('moto', b.dataset.rel); window.history.replaceState(null, '', url);
  });
  const slug = new URLSearchParams(location.search).get('moto');
  if (slug && getProducto(slug)) abrirModal(slug, null);
}

const antes = { moto: PRODUCTOS[0].id, semana: 16, festejo: false, demo: null };
function nombreCorto(p) { return p.estilo === 'clasica' ? `${p.modelo} ${p.color.toLowerCase()}` : p.modelo.replace(' Edición especial', ' SE'); }
function pintarAntes() {
  const p = getProducto(antes.moto);
  const w = antes.semana;
  const cmp = document.getElementById('compare');
  const pos = 4 + ((w - 1) / (SEMANAS - 1)) * 92;
  cmp.style.setProperty('--pos', `${pos.toFixed(2)}%`);
  const range = document.getElementById('compareRange');
  range.setAttribute('aria-valuetext', `Semana ${w} de ${SEMANAS}`);
  document.getElementById('awNum').textContent = w;
  document.querySelector('.antes-week').classList.toggle('is-own', w === SEMANAS);
  document.getElementById('awStrip').innerHTML = stripHTML(w, w === SEMANAS);
  document.getElementById('awPaid').textContent = formatearPrecio(p.precio * w);
  const faltan = SEMANAS - w;
  document.getElementById('awLeft').textContent = faltan === 0 ? 'Nada' : faltan === 1 ? '1 semana' : `${faltan} semanas`;
  const own = document.getElementById('awOwn');
  own.hidden = w !== SEMANAS;
  document.getElementById('awReserve').textContent = `Reservar la ${nombreCompleto(p)}`;
  document.getElementById('awWa').href = waHref([`Hola Ra! Estuve mirando el plan de 42 semanas con la ${nombreCompleto(p)} ${p.color.toLowerCase()} (${formatearPrecio(p.precio)} por semana).`, '¿Me contás cómo arrancar?']);
  if (w === SEMANAS && !antes.festejo) {
    antes.festejo = true;
    if (!reduceMotion && typeof confetti === 'function') {
      const r = cmp.getBoundingClientRect();
      confetti({ particleCount: 70, spread: 70, startVelocity: 32, ticks: 160, origin: { x: (r.left + r.width * 0.5) / window.innerWidth, y: (r.top + r.height * 0.4) / window.innerHeight }, colors: ['#16A34A', '#4ADE80', '#2563EB', '#FFFFFF'] });
    }
  }
  if (w < SEMANAS - 2) antes.festejo = false;
}
function initAntes() {
  const range = document.getElementById('compareRange');
  const chips = document.getElementById('antesChips');
  if (!range || !chips) return;
  chips.innerHTML = PRODUCTOS.map((p, i) => `<label class="chip"><input type="radio" name="antes-moto" value="${p.id}"${i === 0 ? ' checked' : ''}><span>${esc(nombreCorto(p))}</span></label>`).join('');
  chips.addEventListener('change', e => { if (e.target.name === 'antes-moto') { antes.moto = e.target.value; pintarAntes(); } });
  const detenerDemo = () => { if (antes.demo) { antes.demo.kill(); antes.demo = null; } };
  range.addEventListener('input', () => { detenerDemo(); antes.semana = Number(range.value); pintarAntes(); });
  range.addEventListener('pointerdown', detenerDemo);
  document.getElementById('awReserve').addEventListener('click', e => agregar(antes.moto, 1, true, e.currentTarget));
  range.value = antes.semana;
  pintarAntes();
  if (reduceMotion || typeof gsap === 'undefined' || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => {
    if (!entries.some(en => en.isIntersecting)) return;
    io.disconnect();
    const obj = { w: 1 };
    const aplicar = () => { const v = Math.round(obj.w); if (v !== antes.semana) { antes.semana = v; range.value = v; pintarAntes(); } };
    antes.demo = gsap.timeline({ onComplete: () => { antes.demo = null; } })
      .to(obj, { w: 42, duration: 1.8, ease: 'power2.inOut', onUpdate: aplicar })
      .to(obj, { w: 16, duration: 1.1, ease: 'back.out(1.4)', delay: 0.5, onUpdate: aplicar });
  }, { threshold: 0.45 });
  io.observe(document.getElementById('compare'));
}

function initTarjeta() {
  const g = document.getElementById('tarjetaGrid');
  if (!g) return;
  let s = '';
  for (let i = 1; i <= SEMANAS; i++) s += `<li class="${i === SEMANAS ? 'own' : i <= 16 ? 'on' : ''}" aria-hidden="true">${i === SEMANAS ? '✓' : i}</li>`;
  g.innerHTML = s;
}

function initCalc() {
  const sel = document.getElementById('calcMoto');
  const start = document.getElementById('calcStart');
  if (!sel || !start) return;
  sel.innerHTML = PRODUCTOS.map(p => `<option value="${p.id}">${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())} · ${formatearPrecio(p.precio)}/sem</option>`).join('');
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  start.value = iso(INICIO);
  start.min = iso(hoyCero());
  const leerFecha = () => {
    const [y, m, d] = (start.value || iso(INICIO)).split('-').map(Number);
    const f = new Date(y, m - 1, d); f.setHours(0, 0, 0, 0);
    return isNaN(f) ? new Date(INICIO) : f;
  };
  const pintar = anim => {
    const p = getProducto(sel.value) || PRODUCTOS[0];
    const ini = leerFecha();
    const own = sumarSemanas(ini, SEMANAS);
    const date = document.getElementById('calcDate');
    date.textContent = fechaDisplay(own);
    if (anim && !reduceMotion) { date.classList.remove('is-update'); void date.offsetWidth; date.classList.add('is-update'); }
    document.getElementById('calcWeekday').textContent = fechaLarga(own);
    document.getElementById('calcCuota').textContent = `${formatearPrecio(p.precio)}/sem`;
    document.getElementById('calcTotal').textContent = formatearPrecio(p.precio * SEMANAS);
    let mesPrevio = -1; let alt = false; let html = '';
    for (let i = 1; i <= SEMANAS; i++) {
      const d = sumarSemanas(ini, i - 1);
      if (d.getMonth() !== mesPrevio) { if (mesPrevio !== -1) alt = !alt; mesPrevio = d.getMonth(); }
      const cls = i === SEMANAS ? 'own' : alt ? 'alt' : '';
      html += `<li${cls ? ` class="${cls}"` : ''} style="--i:${anim ? i : 0}" title="Semana ${i} · ${fechaDiaMes(d)}">${i === SEMANAS ? '✓' : i}</li>`;
    }
    document.getElementById('calcWeeks').innerHTML = html;
    document.getElementById('calcReserve').textContent = `Reservar desde el ${fechaDiaMes(ini)}`;
    document.getElementById('calcWa').href = waHref([`Hola Ra! Quiero la ${nombreCompleto(p)} ${p.color.toLowerCase()} (${formatearPrecio(p.precio)} por semana).`, `Arrancaría el ${fechaLarga(ini)}, así que sería mía el ${fechaLarga(own)}.`, '¿Está disponible?']);
  };
  sel.addEventListener('change', () => pintar(true));
  start.addEventListener('change', () => pintar(true));
  document.getElementById('calcReserve').addEventListener('click', e => agregar(sel.value, 1, true, e.currentTarget));
  pintar(false);
}

function initDatosDinamicos() {
  const desde = formatearPrecio(Math.min(...PRODUCTOS.map(p => p.precio)));
  const hd = document.getElementById('heroDesde'); if (hd) hd.textContent = desde;
  const cd = document.getElementById('cierreDesde'); if (cd) cd.textContent = `Desde ${desde}`;
  const fm = document.getElementById('footerMotos');
  if (fm) fm.innerHTML = PRODUCTOS.map(p => `<li><a href="?moto=${p.id}" data-footer-moto="${p.id}">${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}</a></li>`).join('');
  fm?.addEventListener('click', e => { const a = e.target.closest('[data-footer-moto]'); if (!a) return; e.preventDefault(); abrirModal(a.dataset.footerMoto, a); });
  const fmoto = document.getElementById('f-moto');
  if (fmoto) fmoto.innerHTML = '<option>Todavía no sé</option>' + PRODUCTOS.map(p => `<option>${esc(nombreCompleto(p))} ${esc(p.color.toLowerCase())}</option>`).join('');
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nombre = form.querySelector('#f-nombre');
  const tel = form.querySelector('#f-tel');
  const errN = form.querySelector('#e-nombre');
  const errT = form.querySelector('#e-tel');
  let mask = null;
  if (typeof IMask !== 'undefined' && tel) {
    mask = IMask(tel, { mask: [
      { mask: '+{54} 9 (00) 0000-0000' },
      { mask: '+{54} 9 (000) 000-0000' },
      { mask: '+{54} 9 (0000) 00-0000' }
    ] });
  }
  const telOk = () => (mask ? mask.unmaskedValue.length >= 12 : tel.value.replace(/\D/g, '').length >= 10);
  const marcar = (input, err, mal) => { input.setAttribute('aria-invalid', mal ? 'true' : 'false'); err.hidden = !mal; };
  nombre.addEventListener('input', () => { if (nombre.value.trim().length >= 2) marcar(nombre, errN, false); });
  tel.addEventListener('input', () => { if (telOk()) marcar(tel, errT, false); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const okN = nombre.value.trim().length >= 2;
    const okT = telOk();
    marcar(nombre, errN, !okN);
    marcar(tel, errT, !okT);
    if (!okN || !okT) { (okN ? tel : nombre).focus(); return; }
    const btn = form.querySelector('button[type="submit"]');
    const texto = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    setTimeout(() => {
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
      form.reset();
      if (mask) mask.value = '';
      [nombre, tel].forEach(i => i.removeAttribute('aria-invalid'));
      btn.disabled = false;
      btn.textContent = texto;
    }, 800);
  });
}

function initHero() {
  const els = document.querySelectorAll('[data-hero]');
  const count = document.getElementById('heroCount');
  if (typeof gsap === 'undefined' || reduceMotion) { els.forEach(el => { el.style.opacity = 1; }); return; }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero .eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0.05)
    .fromTo('.hero-title .hl', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14, ease: 'back.out(1.5)' }, 0.12)
    .fromTo(['.hero-sub', '.hero-ctas', '.pruebas'], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.45)
    .fromTo('.hero-photo', { opacity: 0, clipPath: 'inset(0 0 0 100%)' }, { opacity: 1, clipPath: 'inset(0 0 0 0%)', duration: 1.1, ease: 'power4.out' }, 0.15)
    .fromTo('.hero-photo img', { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'power2.out' }, 0.15)
    .fromTo('.hero-ticket', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }, 0.9);
  if (count) {
    const obj = { n: 1 };
    tl.fromTo('.hero-42', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, 0.3)
      .to(obj, { n: 42, duration: 1.3, ease: 'power3.out', onUpdate: () => { count.textContent = String(Math.round(obj.n)).padStart(2, '0'); } }, 0.3);
  }
}

initNav();
initCart();
initFloats();
initDatosDinamicos();
initCatalogo();
initModal();
initAntes();
initTarjeta();
initCalc();
initForm();
initReveals();
initHero();
