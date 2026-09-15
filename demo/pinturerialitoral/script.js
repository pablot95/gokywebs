(function () {
  var p = new URLSearchParams(location.search);
  var clasico = p.get('estilo') === 'clasico' || location.hash === '#clasica';
  document.body.dataset.hero = clasico ? 'clasico' : 'animado';
})();

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.documentElement.classList.add('js-off');
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

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const HAS_GSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const BASE = location.pathname.includes('/producto/') ? '../' : '';
const ENVIO_GRATIS_DESDE = 50000;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = pr => pr.descuento > 0 ? Math.round(pr.precio * (1 - pr.descuento / 100)) : pr.precio;

const CATEGORIAS = {
  interior: 'Interiores',
  exterior: 'Exteriores',
  esmaltes: 'Esmaltes y Barnices',
  impermeabilizantes: 'Impermeabilizantes',
  preparacion: 'Fondos y Preparación',
  accesorios: 'Accesorios'
};

const PC_BG = { interior: '#EAF3EE', exterior: '#DCEEF3', esmaltes: '#FBEFE3', impermeabilizantes: '#E4F1EC', preparacion: '#F1EDE3', accesorios: '#EAF3EE' };

const PRODUCTOS = [
  { id: 'latex-interior-blanco', nombre: 'Látex Interior Premium Blanco 20L', categoria: 'interior', uso: 'Hogar', precio: 58000, descuento: 0, stock: 24, imagen: 'prod-latex-blanco-1200x1200.jpg', desc: 'Nuestro látex de mayor cobertura: cubre parejo en dos manos y queda con un blanco estable, sin amarillear con los años. El que más se lleva quien pinta la casa entera.' },
  { id: 'latex-interior-color', nombre: 'Látex Interior Mate Color a Elección 10L', categoria: 'interior', uso: 'Hogar', precio: 34500, descuento: 0, stock: 18, imagen: 'prod-latex-color-1200x1200.jpg', desc: 'Base para tintometrar cualquier color de nuestra carta o de una muestra que nos traigas. Terminación mate, ideal para living y dormitorios.' },
  { id: 'latex-lavable-antihongo', nombre: 'Látex Lavable Antihongo 4L', categoria: 'interior', uso: 'Hogar', precio: 16900, descuento: 0, stock: 30, imagen: 'prod-latex-lavable-1200x1200.jpg', desc: 'Con aditivo antihongo, pensado para baños y cocinas. Se limpia con un trapo húmedo sin perder color ni brillo.' },
  { id: 'cielorrasos-extra-blanco', nombre: 'Cielorrasos Extra Blanco 10L', categoria: 'interior', uso: 'Hogar', precio: 27800, descuento: 10, stock: 15, imagen: 'prod-cielorraso-1200x1200.jpg', desc: 'Blanco de máxima opacidad, formulada para techos: no gotea al aplicar y no marca las uniones de placa.' },

  { id: 'latex-exterior-frentes', nombre: 'Látex Exterior para Frentes 20L', categoria: 'exterior', uso: 'Hogar y obra', precio: 69900, descuento: 0, stock: 20, imagen: 'prod-exterior-frentes-1200x1200.jpg', desc: 'Resiste sol, lluvia y la salinidad del litoral sin desteñir. Nuestro látex más pedido para frentes de casas y edificios bajos.' },
  { id: 'elastomerico-premium', nombre: 'Frentes Elastomérico Premium 10L', categoria: 'exterior', uso: 'Hogar y obra', precio: 52000, descuento: 15, stock: 12, imagen: 'prod-elastomerico-1200x1200.jpg', desc: 'Elástico de verdad: tapa microfisuras del revoque y se estira con los movimientos de la pared sin rajarse.' },
  { id: 'membrana-liquida-muros', nombre: 'Membrana Líquida para Muros 4L', categoria: 'exterior', uso: 'Obra', precio: 24500, descuento: 0, stock: 16, imagen: 'prod-membrana-1200x1200.jpg', desc: 'Sella la humedad ascendente en muros antes de pintar. Se aplica con pincel o rodillo, dos manos cruzadas.' },
  { id: 'fijador-exteriores', nombre: 'Fijador para Exteriores 10L', categoria: 'exterior', uso: 'Hogar y obra', precio: 19900, descuento: 0, stock: 22, imagen: 'prod-fijador-ext-1200x1200.jpg', desc: 'Pareja la absorción del revoque nuevo o del frente muy pintado, para que el color final rinda como tiene que rendir.' },

  { id: 'esmalte-sintetico-brillante', nombre: 'Esmalte Sintético Brillante 4L', categoria: 'esmaltes', uso: 'Hogar y obra', precio: 22900, descuento: 0, stock: 28, imagen: 'prod-esmalte-sintetico-1200x1200.jpg', desc: 'El clásico para aberturas, rejas y zócalos. Brillo parejo, se lija fácil entre manos.' },
  { id: 'esmalte-agua-satinado', nombre: 'Esmalte al Agua Satinado 1L', categoria: 'esmaltes', uso: 'Hogar', precio: 8900, descuento: 0, stock: 40, imagen: 'prod-esmalte-satinado-1200x1200.jpg', desc: 'Sin olor a aguarrás, seca rápido y deja un satinado prolijo. Ideal para puertas y muebles de interior.' },
  { id: 'barniz-marino', nombre: 'Barniz Marino Alta Resistencia 4L', categoria: 'esmaltes', uso: 'Hogar y obra', precio: 26500, descuento: 0, stock: 14, imagen: 'prod-barniz-marino-1200x1200.jpg', desc: 'Protección extra para madera expuesta a la intemperie: deck, aberturas y muebles de exterior.' },
  { id: 'esmalte-martillado-antioxido', nombre: 'Esmalte Martillado Antióxido 1L', categoria: 'esmaltes', uso: 'Obra', precio: 9900, descuento: 10, stock: 19, imagen: 'prod-esmalte-martillado-1200x1200.jpg', desc: 'Va directo sobre metal, sin fondo antióxido aparte. La textura martillada disimula golpes e imperfecciones.' },

  { id: 'impermeabilizante-techos', nombre: 'Impermeabilizante para Techos 20L', categoria: 'impermeabilizantes', uso: 'Hogar y obra', precio: 64900, descuento: 0, stock: 10, imagen: 'prod-imper-techos-1200x1200.jpg', desc: 'Membrana acrílica para techos de chapa o losa. Refleja calor y corta filtraciones antes de que empiecen.' },
  { id: 'hidrofugo-frentes', nombre: 'Hidrófugo de Frentes 10L', categoria: 'impermeabilizantes', uso: 'Hogar y obra', precio: 23500, descuento: 0, stock: 17, imagen: 'prod-hidrofugo-1200x1200.jpg', desc: 'Transparente, se aplica antes o después de pintar. Corta la humedad que entra por revoque poroso.' },
  { id: 'impermeabilizante-terrazas', nombre: 'Impermeabilizante Terrazas Transitables 10L', categoria: 'impermeabilizantes', uso: 'Obra', precio: 48000, descuento: 0, stock: 8, imagen: 'prod-imper-terraza-1200x1200.jpg', desc: 'Pensado para pisos que se caminan: balcones, terrazas y patios. Terminación antideslizante.' },

  { id: 'fijador-sellador-universal', nombre: 'Fijador Sellador Universal 4L', categoria: 'preparacion', uso: 'Hogar y obra', precio: 12900, descuento: 0, stock: 26, imagen: 'prod-fijador-univ-1200x1200.jpg', desc: 'El primer paso de cualquier trabajo prolijo: sella la superficie para que la pintura final rinda y no se despegue.' },
  { id: 'antioxido-convertidor', nombre: 'Antióxido Convertidor 1L', categoria: 'preparacion', uso: 'Obra', precio: 7500, descuento: 0, stock: 32, imagen: 'prod-antioxido-1200x1200.jpg', desc: 'Convierte el óxido existente en una base pintable, sin necesidad de lijar hasta el metal blanco.' },
  { id: 'enduido-plastico-interior', nombre: 'Enduido Plástico Interior 5kg', categoria: 'preparacion', uso: 'Hogar y obra', precio: 9800, descuento: 0, stock: 24, imagen: 'prod-enduido-1200x1200.jpg', desc: 'Para tapar grietas finas y parejar la pared antes de pintar. Lija fácil una vez seco.' },

  { id: 'set-pinceles-profesional', nombre: 'Set de Pinceles Profesionales x5', categoria: 'accesorios', uso: 'Hogar y obra', precio: 11500, descuento: 0, stock: 35, imagen: 'prod-pinceles-1200x1200.jpg', desc: '5 pinceles de distintos anchos, cerda que no se pela ni deja marcas en el corte.' },
  { id: 'rodillo-antigota-bandeja', nombre: 'Rodillo Antigota 22cm + Bandeja', categoria: 'accesorios', uso: 'Hogar', precio: 6900, descuento: 20, stock: 40, imagen: 'prod-rodillo-1200x1200.jpg', desc: 'El combo para arrancar: rodillo de pelo corto antigota más su bandeja, listo para usar.' },
  { id: 'cinta-papel-pintor', nombre: 'Cinta de Papel para Pintor 48mm', categoria: 'accesorios', uso: 'Hogar y obra', precio: 2400, descuento: 0, stock: 60, imagen: 'prod-cinta-1200x1200.jpg', desc: 'Se despega limpia, sin levantar pintura ni dejar residuo de pegamento en el marco.' }
];

const getProducto = id => PRODUCTOS.find(pr => pr.id === id);

const Cart = {
  KEY: 'pinturerialitoral_cart',
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
    const pr = getProducto(id); it.qty = Math.max(1, Math.min(qty, pr?.stock ?? 99)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const pr = getProducto(i.id); return pr ? s + precioFinal(pr) * i.qty : s; }, 0); }
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

function productCardHTML(pr, opts) {
  opts = opts || {};
  const final = precioFinal(pr);
  const href = `${BASE}producto/index.html?id=${encodeURIComponent(pr.id)}`;
  return `
  <article class="product-card" data-id="${pr.id}">
    <a class="ph-link" href="${href}">
      <div class="product-media" style="--pc-bg:${PC_BG[pr.categoria] || '#EAF3EE'}">
        <span class="product-chip">${esc(CATEGORIAS[pr.categoria] || '')}</span>
        ${pr.descuento > 0 ? `<span class="product-badge">-${pr.descuento}%</span>` : ''}
        <img src="${BASE}images/${pr.imagen}" width="1200" height="1200" alt="${esc(pr.nombre)}" ${opts.lazy === false ? '' : 'loading="lazy" decoding="async"'}>
      </div>
    </a>
    <div class="product-body">
      <a href="${href}" style="text-decoration:none;color:inherit"><h3>${esc(pr.nombre)}</h3></a>
      <div class="product-price">
        <span class="price-now">${formatearPrecio(final)}</span>
        ${pr.descuento > 0 ? `<s class="price-was">${formatearPrecio(pr.precio)}</s>` : ''}
      </div>
      <div class="product-actions">
        <div class="qty-row">
          <div class="qty-control" data-qty-for="${pr.id}">
            <button type="button" data-qty-dec aria-label="Restar cantidad">&minus;</button>
            <input type="text" inputmode="numeric" value="1" aria-label="Cantidad" readonly>
            <button type="button" data-qty-inc aria-label="Sumar cantidad">+</button>
          </div>
        </div>
        <div class="btns">
          <button type="button" class="btn btn-ghost btn-sm" data-add="${pr.id}">Agregar</button>
          <button type="button" class="btn btn-primary btn-sm" data-buy="${pr.id}">Comprar ahora</button>
        </div>
      </div>
    </div>
  </article>`;
}

function getQtyFor(id) {
  const el = document.querySelector(`[data-qty-for="${CSS.escape(id)}"] input`);
  return el ? Math.max(1, parseInt(el.value, 10) || 1) : 1;
}

function initQtyControls(root) {
  (root || document).querySelectorAll('[data-qty-for]').forEach(wrap => {
    const input = wrap.querySelector('input');
    const id = wrap.dataset.qtyFor;
    const pr = getProducto(id);
    const max = pr?.stock ?? 99;
    wrap.querySelector('[data-qty-dec]').addEventListener('click', () => { input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1); });
    wrap.querySelector('[data-qty-inc]').addEventListener('click', () => { input.value = Math.min(max, (parseInt(input.value, 10) || 1) + 1); });
  });
}

function initCartActions(root) {
  (root || document).addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add]');
    const buyBtn = e.target.closest('[data-buy]');
    if (addBtn) {
      const pr = getProducto(addBtn.dataset.add);
      if (!pr) return;
      Cart.add(pr, getQtyFor(pr.id));
      showToast('¡Agregado! Tu carrito te espera.');
    } else if (buyBtn) {
      const pr = getProducto(buyBtn.dataset.buy);
      if (!pr) return;
      Cart.add(pr, getQtyFor(pr.id));
      openCart();
    }
  });
}

function renderCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    const count = Cart.count();
    b.textContent = count;
    b.style.display = count > 0 ? 'grid' : 'none';
  });
}

function bumpBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  });
}

function renderEnvioBar() {
  const bar = document.getElementById('envio-bar');
  if (!bar) return;
  const total = Cart.total();
  const fill = bar.querySelector('.envio-fill');
  const text = bar.querySelector('.envio-text');
  const pct = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);
  fill.style.width = pct + '%';
  if (total >= ENVIO_GRATIS_DESDE) text.innerHTML = '¡Tenés envío gratis! 🎉';
  else text.innerHTML = `Te faltan <b>${formatearPrecio(ENVIO_GRATIS_DESDE - total)}</b> para el envío gratis`;
}

function renderCartDrawer() {
  const body = document.getElementById('cart-body');
  const footTotal = document.getElementById('cart-total-amount');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p>Tu carrito está vacío por ahora.</p>
        <a class="btn btn-primary btn-sm" href="${BASE}catalogo.html">Ver el catálogo</a>
      </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const pr = getProducto(i.id);
      if (!pr) return '';
      const final = precioFinal(pr);
      return `
      <div class="cart-item" data-id="${pr.id}">
        <div class="ph"><img src="${BASE}images/${pr.imagen}" width="120" height="120" alt="${esc(pr.nombre)}" loading="lazy" decoding="async"></div>
        <div class="cart-item-info">
          <b>${esc(pr.nombre)}</b>
          <span class="price-now">${formatearPrecio(final)}</span>
          <div class="qty-control" data-qty-for="cart-${pr.id}" style="margin-top:.4rem">
            <button type="button" data-cart-dec="${pr.id}" aria-label="Restar">&minus;</button>
            <input type="text" value="${i.qty}" readonly aria-label="Cantidad">
            <button type="button" data-cart-inc="${pr.id}" aria-label="Sumar">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" data-cart-remove="${pr.id}">Quitar</button>
      </div>`;
    }).join('');
  }
  if (footTotal) footTotal.textContent = formatearPrecio(Cart.total());
  renderEnvioBar();
  renderCartBadge();
}

function initCartDrawerEvents() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer) return;
  drawer.addEventListener('click', e => {
    const dec = e.target.closest('[data-cart-dec]');
    const inc = e.target.closest('[data-cart-inc]');
    const rm = e.target.closest('[data-cart-remove]');
    if (dec) { const items = Cart.get(); const it = items.find(x => x.id === dec.dataset.cartDec); if (it) Cart.setQty(it.id, it.qty - 1); }
    else if (inc) { const items = Cart.get(); const it = items.find(x => x.id === inc.dataset.cartInc); if (it) Cart.setQty(it.id, it.qty + 1); }
    else if (rm) { Cart.remove(rm.dataset.cartRemove); }
  });
  const checkout = document.getElementById('btn-checkout');
  if (checkout) checkout.addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (typeof confetti !== 'undefined' && !REDUCED) {
      confetti({ particleCount: 90, spread: 70, origin: { y: .7 }, colors: ['#1F6E52', '#3E9DC4', '#E8722E'] });
    }
  });
  document.addEventListener('cart:updated', renderCartDrawer);
}

let cartFocusables = [];
function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer) return;
  renderCartDrawer();
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  window.lenis && window.lenis.stop();
  cartFocusables = Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'));
  if (cartFocusables.length) cartFocusables[0].focus();
}
function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer) return;
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  window.lenis && window.lenis.start();
  const trigger = document.querySelector('[data-cart-open]');
  if (trigger) trigger.focus();
}
function initCartOpenClose() {
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCart));
  const closeBtn = document.getElementById('cart-close');
  const backdrop = document.getElementById('cart-backdrop');
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (backdrop) backdrop.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer || !drawer.classList.contains('open')) return;
    if (e.key === 'Escape') { closeCart(); return; }
    if (e.key !== 'Tab' || !cartFocusables.length) return;
    const first = cartFocusables[0], last = cartFocusables[cartFocusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  document.addEventListener('cart:updated', () => { if (document.getElementById('cart-drawer')?.classList.contains('open')) cartFocusables = Array.from(document.getElementById('cart-drawer').querySelectorAll('a[href], button:not([disabled])')); });
}

function initMenu() {
  const btn = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('menu-backdrop');
  if (!btn || !menu || !backdrop) return;
  const focusables = () => menu.querySelectorAll('a[href], button:not([disabled])');
  function open() {
    menu.classList.add('open'); backdrop.classList.add('open');
    btn.setAttribute('aria-expanded', 'true'); btn.setAttribute('aria-label', 'Cerrar menú');
    window.lenis && window.lenis.stop();
    const f = focusables(); if (f.length) f[0].focus();
  }
  function close() {
    menu.classList.remove('open'); backdrop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menú');
    window.lenis && window.lenis.start(); btn.focus();
  }
  function isOpen() { return menu.classList.contains('open'); }
  btn.addEventListener('click', () => { isOpen() ? close() : open(); });
  backdrop.addEventListener('click', close);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(); if (!f.length) return;
    const firstEl = f[0], lastEl = f[f.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initReveals() {
  const els = document.querySelectorAll('[data-animate]');
  if (!HAS_GSAP || REDUCED) {
    els.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    left: { x: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 }
  };
  els.forEach(el => {
    gsap.to(el, Object.assign({}, presets[el.dataset.animate || 'up'], {
      ease: 'expo.out', delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }));
  });
}

function initStagger() {
  if (!HAS_GSAP || REDUCED) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(wrap => {
    const kids = wrap.children;
    if (!kids.length) return;
    gsap.set(kids, { y: 46, opacity: 0 });
    gsap.to(kids, {
      y: 0, opacity: 1, duration: .8, stagger: .1, ease: 'expo.out',
      scrollTrigger: { trigger: wrap, start: 'top 85%', once: true }
    });
  });
}

function reRevealStagger(wrap) {
  if (!HAS_GSAP || REDUCED || !wrap) return;
  const kids = Array.from(wrap.children);
  if (!kids.length) return;
  gsap.set(kids, { y: 30, opacity: 0 });
  gsap.to(kids, { y: 0, opacity: 1, duration: .55, stagger: .06, ease: 'expo.out' });
}

function initCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!HAS_GSAP || REDUCED) return;
  els.forEach(el => {
    const end = parseFloat(el.dataset.counter), obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.6, ease: 'power1.out', snap: { v: 1 },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = obj.v.toLocaleString('es-AR'); }
    });
  });
}

function initSwatches() {
  const strip = document.getElementById('swatch-strip');
  const preview = document.getElementById('swatch-preview');
  if (!strip || !preview) return;
  const textB = preview.querySelector('b');
  const textSpan = preview.querySelector('span');
  strip.addEventListener('click', e => {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    strip.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    preview.style.setProperty('--sw-bg', btn.dataset.tint);
    if (textB) textB.textContent = btn.dataset.name;
    if (textSpan) textSpan.textContent = btn.dataset.desc;
  });
}

function initHero() {
  if (document.body.dataset.hero !== 'animado') return;
  const hero = document.getElementById('hero');
  const stage = document.getElementById('hero-stage');
  const iframe = document.getElementById('hero-bg');
  if (!hero || !stage) return;
  if (iframe && iframe.dataset.src && !iframe.src) iframe.src = iframe.dataset.src;
  if (!HAS_GSAP || REDUCED) return;
  const beats = gsap.utils.toArray('.beat');
  if (!beats.length) return;

  hero.classList.add('hero--tunnel');
  ScrollTrigger.refresh();

  const first = beats[0];
  gsap.from(first.querySelectorAll('.kicker, h1, .hero-lead, .hero-actions'), {
    y: 26, opacity: 0, duration: 1.1, stagger: .11, ease: 'expo.out', delay: .15
  });

  const step = 1;
  const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: .6 } });

  beats.forEach((c, i) => {
    const t0 = i * step;
    const last = i === beats.length - 1;
    const big = c.querySelectorAll('.beat-big, h1');
    const soft = c.querySelectorAll('.kicker, .hero-lead, .hero-actions, .beat-cards');

    if (i === 0) {
      tl.to(c, { scale: 1.5, duration: step * 0.6, ease: "power1.in" }, t0 + step * 0.3)
        .to(c, { autoAlpha: 0, duration: step * 0.3, ease: "power2.in" }, t0 + step * 0.75);
    } else {
      gsap.set(c, { scale: 0.46, autoAlpha: 0, transformOrigin: "50% 50%" });
      gsap.set(big, { scale: 0.913, transformOrigin: "50% 50%" });
      gsap.set(soft, { scale: 1.26, transformOrigin: "50% 50%" });
      tl.to(c, { autoAlpha: 1, duration: step * 0.2 }, t0)
        .to(c, { scale: 1, duration: step * 0.4, ease: "power1.in" }, t0);
      tl.to(big, { scale: 1, duration: step * 0.4, ease: "power1.in" }, t0)
        .to(soft, { scale: 1, duration: step * 0.4, ease: "power1.in" }, t0);
      if (!last) {
        tl.to(c, { scale: 1.55, duration: step * 0.45, ease: "power1.in" }, t0 + step)
          .to(c, { autoAlpha: 0, duration: step * 0.32 }, t0 + step * 1.05);
        tl.to(big, { scale: 1.032, duration: step * 0.45, ease: "power1.in" }, t0 + step)
          .to(soft, { scale: 0.839, duration: step * 0.45, ease: "power1.in" }, t0 + step);
      }
    }
  });

  const total = beats.length * step;
  tl.to({}, { duration: step * 0.6 }, total - step * 0.6);

  const near = document.getElementById('float-near');
  const far = document.getElementById('float-far');
  if (near && far) {
    gsap.set(near, { scale: .3, autoAlpha: 0, transformOrigin: "50% 50%" });
    gsap.set(far, { scale: .5, autoAlpha: 0, transformOrigin: "50% 50%" });
    tl.to(near, { autoAlpha: 1, duration: step * .35 }, step * .78)
      .to(near, { scale: 1.9, duration: total - step * .9, ease: 'power1.in' }, step * .9)
      .to(near, { autoAlpha: 0, duration: step * .4 }, total - step * .5);
    tl.to(far, { autoAlpha: 1, duration: step * .35 }, step * .9)
      .to(far, { scale: 1.5, duration: total - step, ease: 'power1.in' }, step)
      .to(far, { autoAlpha: 0, duration: step * .4 }, total - step * .42);
  }

  if (iframe) {
    ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'scroll', progress: self.progress }, '*'); }
    });
    iframe.addEventListener('load', () => {
      if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'scroll', progress: 0 }, '*');
      ScrollTrigger.refresh();
    });
  }
}

function initSplide() {
  if (typeof Splide === 'undefined') return;
  document.querySelectorAll('.splide.destacados').forEach(el => {
    new Splide(el, {
      perPage: 4, gap: '1.2rem', pagination: false, arrows: true,
      padding: { right: '6%' },
      breakpoints: { 1100: { perPage: 3 }, 768: { perPage: 2, padding: { right: '14%' } }, 480: { perPage: 1, padding: { right: '20%' } } }
    }).mount();
  });
}

function initCatScroll() {
  document.querySelectorAll('.cat-scroll').forEach(el => {
    let down = false, startX, scrollLeft;
    el.addEventListener('pointerdown', e => { down = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
    window.addEventListener('pointerup', () => { down = false; });
    el.addEventListener('pointermove', e => {
      if (!down) return;
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initReveals();
  initStagger();
  initCounters();
  initSwatches();
  initSplide();
  initCatScroll();
  initMenu();
  initWspFloat();
  initQtyControls();
  initCartActions();
  initCartDrawerEvents();
  initCartOpenClose();
  renderCartBadge();
});

window.PinturaShop = { PRODUCTOS, CATEGORIAS, getProducto, precioFinal, formatearPrecio, esc, Cart, showToast, productCardHTML, initQtyControls, initCartActions, reRevealStagger, BASE, ENVIO_GRATIS_DESDE, bumpBadge, openCart };
document.addEventListener('cart:updated', bumpBadge);
