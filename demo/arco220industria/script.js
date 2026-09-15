document.documentElement.classList.add('js');

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WA = '5491166771858';
const ENVIO_GRATIS_DESDE = 120000;
const TALLES = ['S', 'M', 'L', 'XL'];
const EDICION = 50;
const LIBRES = [7, 13, 22, 28, 31, 39, 44, 50];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof gsap !== 'undefined';
const hasST = typeof ScrollTrigger !== 'undefined';

if (hasGSAP && hasST) gsap.registerPlugin(ScrollTrigger);
if (!hasGSAP) {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (hasST) window.addEventListener('load', () => ScrollTrigger.refresh());

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h2.2l1.6 9.4a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 2-1.55L20.2 8H7"/><circle cx="10" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none"/></svg>'
};

const PRODUCTOS = [
  {
    id: 'coleccion', num: '00', tipo: 'coleccion',
    nombre: 'Colección completa',
    color: 'Las 4 piezas · numerada',
    precio: 232000, descuento: 15, stock: 8,
    badge: 'Ahorrás $34.800',
    img: 'images/pack-cuatro-remeras_1254x1254.webp',
    alt: 'Las cuatro remeras de la edición 01 dobladas dentro de la caja de presentación',
    desc: 'Las cuatro piezas de la edición 01 en una sola caja, con la misma numeración grabada en las cuatro chapas. Es la única forma de tener la edición entera con el mismo número, y quedan pocas: de las 50 colecciones originales todavía no tienen dueño 8.',
    detalle: 'Llega en la caja negra de presentación, con la ficha de la edición y el certificado del número. Elegís un solo talle para las cuatro.',
    tags: 'pack caja completa cuatro edicion numerada regalo'
  },
  {
    id: 'fragua', num: '01', tipo: 'remera',
    nombre: 'Remera FRAGUA',
    color: 'Negro forja',
    precio: 58000, descuento: 0, stock: 23,
    badge: '',
    img: 'images/remera-negra-en-percha_1254x1254.webp',
    alt: 'Remera FRAGUA en negro forja colgada de una percha de madera',
    desc: 'El negro de la pieza base: profundo, sin brillo y teñido en reactivo para que no se ponga gris a los tres lavados. Es la que más se repite en el taller y la que más rápido se va.',
    detalle: 'Bolsillo aplicado a mano en el pecho izquierdo. Cuello con cinta reforzada del mismo tono.',
    tags: 'negro forja basica oscura'
  },
  {
    id: 'ceniza', num: '02', tipo: 'remera',
    nombre: 'Remera CENIZA',
    color: 'Blanco roto',
    precio: 58000, descuento: 0, stock: 31,
    badge: '',
    img: 'images/remera-blanco-roto-doblada_1254x1254.webp',
    alt: 'Remera CENIZA en blanco roto, doblada sobre una mesa de acero',
    desc: 'Blanco roto tirando a crudo, el color del algodón antes de teñirse. Con 240 g no transparenta ni con luz de frente, que es donde se cae cualquier remera blanca barata.',
    detalle: 'Es la única de la edición sin teñir: el tono viene del hilado. Puede variar un punto entre tandas.',
    tags: 'blanco roto crudo claro natural'
  },
  {
    id: 'brasa', num: '03', tipo: 'remera',
    nombre: 'Remera BRASA',
    color: 'Granate oscuro',
    precio: 58000, descuento: 0, stock: 9,
    badge: 'Últimas 9', badgeAlerta: true,
    img: 'images/remera-granate-en-maniqui_1254x1254.webp',
    alt: 'Remera BRASA en granate oscuro montada sobre maniquí',
    desc: 'El granate es el color del metal cuando todavía está caliente y ya no ilumina. Es el tono más difícil de conseguir parejo y por eso es el que menos unidades tiene.',
    detalle: 'Tintura reactiva en dos baños. Puede soltar algo de color en los primeros lavados: lavala sola las dos primeras veces.',
    tags: 'granate bordo rojo oscuro vino'
  },
  {
    id: 'yunque', num: '04', tipo: 'remera',
    nombre: 'Remera YUNQUE',
    color: 'Grafito',
    precio: 58000, descuento: 0, stock: 44,
    badge: '',
    img: 'images/detalle-tela-y-costuras_1254x1254.webp',
    alt: 'Detalle del cuello reforzado y las costuras de la remera YUNQUE en grafito',
    desc: 'Un gris oscuro con carga de carbón, a medio camino entre el negro y el acero sin pulir. La que mejor aguanta el uso diario sin que se le note el desgaste.',
    detalle: 'Mismo molde y mismo gramaje que las otras tres. Es la que más stock tiene de la edición.',
    tags: 'gris grafito carbon oscuro acero'
  }
];

const Cart = {
  KEY: 'arco220_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `${ICON.check}<span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const header = document.querySelector('.header');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (header || document.body).appendChild(bd); }
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
  const sync = () => { if (window.innerWidth > 768) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  sync();
  window.addEventListener('resize', sync, { passive: true });
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (!hasGSAP || reduceMotion) {
    hero.querySelectorAll('.hero-kicker,.hero-sub,.hero-cta,.hero-figure,.hero-chapa,.hero-title .line-in')
      .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-bg img', { scale: 1.1, opacity: .3 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
    .fromTo('.hero-kicker', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .28)
    .fromTo('.hero-title .line-in', { yPercent: 112 }, { yPercent: 0, duration: 1.05, stagger: .09, ease: 'expo.out' }, .34)
    .fromTo('.hero-sub', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, .74)
    .fromTo('.hero-cta', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .86)
    .fromTo('.hero-figure', { y: 60, opacity: 0, rotate: -3 }, { y: 0, opacity: 1, rotate: 0, duration: 1.25, ease: 'expo.out' }, .2)
    .fromTo('.hero-chapa', { scale: .82, opacity: 0 }, { scale: 1, opacity: 1, duration: .7, ease: 'back.out(1.7)' }, 1.05);

  if (hasST && window.matchMedia('(min-width: 641px)').matches) {
    gsap.to('.hero-bg img', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .5 } });
    gsap.to('.hero-arc', { yPercent: -16, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .9 } });
  }
}

/* ---------- catálogo ---------- */
let filtroActual = 'todos';
let terminoActual = '';
let primeraCarga = true;

function cardPieza(p) {
  const final = precioFinal(p);
  const destacada = p.tipo === 'coleccion' && filtroActual === 'todos' && !terminoActual;
  const bajo = p.stock <= 10;
  return `
  <article class="pieza${destacada ? ' destacada' : ''}" data-id="${esc(p.id)}" data-animate style="transform:translateY(30px);opacity:0">
    <div class="pieza-media">
      <img src="${esc(p.img)}" width="1254" height="1254" alt="${esc(p.alt)}" loading="lazy" decoding="async">
      <span class="pieza-plate">${esc(p.num)}/04</span>
      ${p.badge ? `<span class="pieza-badge${p.badgeAlerta ? ' pieza-badge--rojo' : ''}">${esc(p.badge)}</span>` : ''}
      <div class="pieza-flota">
        <button type="button" class="btn btn-primary btn-sm btn-block" data-ver="${esc(p.id)}">Ver la pieza</button>
      </div>
    </div>
    <div class="pieza-body">
      <p class="pieza-color">${esc(p.color)}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="pieza-stock${bajo ? ' bajo' : ''}">Quedan <b>${p.stock}</b> de ${EDICION}</p>
      <div class="pieza-pie">
        <p class="pieza-precio">${formatearPrecio(final)}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
        <button type="button" class="pieza-ver" data-ver="${esc(p.id)}">Ver →</button>
      </div>
    </div>
  </article>`;
}

function renderPiezas() {
  const grid = document.getElementById('gridPiezas');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  if (!grid) return;

  const t = normalizar(terminoActual);
  const lista = PRODUCTOS.filter(p => {
    if (filtroActual !== 'todos' && p.tipo !== filtroActual) return false;
    if (!t) return true;
    return normalizar([p.nombre, p.color, p.tipo, p.desc, p.tags].join(' ')).includes(t);
  });

  const modo = lista.length === 5 ? 'todos' : lista.length === 4 ? 'remeras' : lista.length === 1 ? 'uno' : 'libre';
  grid.dataset.modo = modo;
  grid.innerHTML = lista.map(cardPieza).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  if (res) res.textContent = lista.length ? `${lista.length} ${lista.length === 1 ? 'pieza' : 'piezas'} de la edición 01` : '';

  if (!primeraCarga) {
    grid.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.3)}s`;
      requestAnimationFrame(() => el.classList.add('in'));
    });
  }
  primeraCarga = false;
  if (hasST) ScrollTrigger.refresh();
}

function initPiezas() {
  const grid = document.getElementById('gridPiezas');
  if (!grid) return;
  renderPiezas();

  document.querySelectorAll('[data-filtro]').forEach(btn => {
    btn.addEventListener('click', () => {
      filtroActual = btn.dataset.filtro;
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c.dataset.filtro === filtroActual));
      renderPiezas();
    });
  });

  const buscador = document.getElementById('buscador');
  let tId = null;
  buscador?.addEventListener('input', () => {
    clearTimeout(tId);
    tId = setTimeout(() => { terminoActual = buscador.value.trim(); renderPiezas(); }, 160);
  });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    filtroActual = 'todos'; terminoActual = '';
    if (buscador) buscador.value = '';
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-on', c.dataset.filtro === 'todos'));
    renderPiezas();
  });

  grid.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver, ver);
  });

  if (window.matchMedia('(hover: hover)').matches) {
    grid.addEventListener('pointermove', e => {
      const card = e.target.closest('.pieza');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }
}

/* ---------- vista rápida ---------- */
let modalPrevio = null;

function abrirModal(id, origen) {
  const p = getProducto(id);
  const modal = document.getElementById('modalPieza');
  const body = document.getElementById('modalBody');
  if (!p || !modal || !body) return;
  modalPrevio = origen || null;
  const final = precioFinal(p);
  let talle = '';
  let qty = 1;

  body.innerHTML = `
  <div class="m-grid">
    <div class="m-media">
      <img src="${esc(p.img)}" width="1254" height="1254" alt="${esc(p.alt)}" decoding="async">
      <span class="m-plate">PIEZA ${esc(p.num)}/04</span>
    </div>
    <div class="m-info">
      <p class="m-color">${esc(p.color)}</p>
      <h3 id="modalTitulo">${esc(p.nombre)}</h3>
      <p class="m-precio">${formatearPrecio(final)}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="m-desc">${esc(p.desc)}</p>
      <dl class="m-specs">
        <div class="m-spec"><dt>Tela</dt><dd>Algodón 240 g/m²</dd></div>
        <div class="m-spec"><dt>Calce</dt><dd>Oversize recto</dd></div>
        <div class="m-spec"><dt>Edición</dt><dd>${p.stock} de ${EDICION}</dd></div>
      </dl>
      <p class="m-desc">${esc(p.detalle)}</p>
      <div>
        <span class="m-label" id="lblTalle">Talle</span>
        <div class="m-talles" role="group" aria-labelledby="lblTalle">
          ${TALLES.map(t => `<button type="button" class="talle" data-talle="${t}">${t}</button>`).join('')}
        </div>
      </div>
      <div class="m-qty">
        <div class="qty">
          <button type="button" data-qty="-1" aria-label="Restar una unidad">−</button>
          <span id="qtyVal">1</span>
          <button type="button" data-qty="1" aria-label="Sumar una unidad">+</button>
        </div>
        <p class="m-stock">Quedan <b>${p.stock}</b> unidades</p>
      </div>
      <div class="m-acciones">
        <button type="button" class="btn btn-primary btn-block" data-agregar>Agregar al carrito</button>
        <button type="button" class="btn btn-ghost btn-block" data-comprar>Comprar ahora</button>
      </div>
    </div>
  </div>`;

  modal.setAttribute('aria-labelledby', 'modalTitulo');
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => modal.classList.add('open'));
  document.getElementById('modalClose')?.focus();

  const qtyVal = body.querySelector('#qtyVal');
  body.querySelectorAll('[data-talle]').forEach(b => b.addEventListener('click', () => {
    body.querySelectorAll('[data-talle]').forEach(x => x.classList.remove('is-sel'));
    b.classList.add('is-sel');
    talle = b.dataset.talle;
  }));
  body.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
    qty = Math.max(1, Math.min(qty + Number(b.dataset.qty), p.stock));
    qtyVal.textContent = qty;
  }));

  const sumar = abrir => {
    if (!talle) { showToast('Elegí un talle antes de seguir'); return; }
    Cart.add(p, talle, qty);
    pulseBadge();
    if (abrir) { cerrarModal(); setTimeout(abrirDrawer, 120); }
    else showToast(`${p.nombre} · talle ${talle} — sumada al pedido`);
  };
  body.querySelector('[data-agregar]')?.addEventListener('click', () => sumar(false));
  body.querySelector('[data-comprar]')?.addEventListener('click', () => sumar(true));
}

function cerrarModal() {
  const modal = document.getElementById('modalPieza');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => {
    modal.hidden = true;
    if (document.getElementById('drawer')?.hidden !== false) document.body.classList.remove('no-scroll');
    modalPrevio?.focus();
    modalPrevio = null;
  }, 300);
}

function trapFocus(e, panel) {
  if (e.key !== 'Tab' || !panel) return;
  const foco = panel.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,summary,[tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initModal() {
  const modal = document.getElementById('modalPieza');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  modal.querySelector('[data-cerrar-modal]')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    else trapFocus(e, modal.querySelector('.modal-panel'));
  });
}

/* ---------- carrito ---------- */
let drawerPrevio = null;

function pulseBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge || reduceMotion) return;
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const badge = document.getElementById('cartBadge');
  const envio = document.getElementById('envio');
  if (!body) return;
  const items = Cart.get();
  const count = Cart.count();

  if (badge) { badge.textContent = String(count); badge.hidden = count === 0; }

  if (!items.length) {
    body.innerHTML = `<div class="d-vacio">${ICON.carro}<p>Tu pedido está vacío.</p><p style="font-size:.82rem">La edición 01 son 200 prendas. Todavía estás a tiempo.</p></div>`;
    if (foot) foot.hidden = true;
    if (envio) envio.hidden = true;
    return;
  }

  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="d-item" data-id="${esc(p.id)}" data-talle="${esc(i.talle)}">
      <img src="${esc(p.img)}" width="66" height="78" alt="" aria-hidden="true" loading="lazy">
      <div>
        <h4>${esc(p.nombre)}</h4>
        <p>${esc(p.color)} · Talle ${esc(i.talle)}</p>
        <span class="d-precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
      </div>
      <div class="d-side">
        <button type="button" class="d-quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} talle ${esc(i.talle)}">${ICON.cerrar}</button>
        <div class="d-qty">
          <button type="button" data-mod="-1" aria-label="Restar una unidad">−</button>
          <span>${i.qty}</span>
          <button type="button" data-mod="1" aria-label="Sumar una unidad">+</button>
        </div>
      </div>
    </div>`;
  }).join('');

  body.querySelectorAll('.d-item').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.25)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });

  const total = Cart.total();
  document.getElementById('drawerTotal').textContent = formatearPrecio(total);

  if (envio) {
    envio.hidden = false;
    const falta = ENVIO_GRATIS_DESDE - total;
    const pct = Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100);
    document.getElementById('envioTexto').innerHTML = falta > 0
      ? `Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis.`
      : '<b>Tenés envío gratis.</b> Despachamos en 48 h hábiles.';
    document.getElementById('envioBar').style.width = `${pct}%`;
  }

  const wa = document.getElementById('drawerWa');
  if (wa) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${p.nombre} (${p.color}) · Talle ${i.talle} × ${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
    }).filter(Boolean).join('\n');
    const msg = `Hola ARCO 220, quiero cerrar este pedido de la edición 01:\n\n${detalle}\n\nTotal: ${formatearPrecio(total)}`;
    wa.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  }
  if (foot) foot.hidden = false;
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  drawerPrevio = document.activeElement;
  drawer.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => drawer.classList.add('open'));
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open');
  setTimeout(() => {
    drawer.hidden = true;
    if (document.getElementById('modalPieza')?.hidden !== false) document.body.classList.remove('no-scroll');
    if (drawerPrevio && document.contains(drawerPrevio)) drawerPrevio.focus();
    drawerPrevio = null;
  }, 340);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  drawer.querySelector('[data-cerrar-drawer]')?.addEventListener('click', cerrarDrawer);

  drawer.addEventListener('click', e => {
    const item = e.target.closest('.d-item');
    if (!item) return;
    const { id, talle } = item.dataset;
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, talle); return; }
    const mod = e.target.closest('[data-mod]');
    if (mod) {
      const actual = Cart.get().find(i => i.id === id && i.talle === talle);
      if (!actual) return;
      const nueva = actual.qty + Number(mod.dataset.mod);
      if (nueva < 1) Cart.remove(id, talle); else Cart.setQty(id, talle, nueva);
    }
  });

  document.getElementById('btnFinalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (drawer.hidden) return;
    if (e.key === 'Escape') cerrarDrawer();
    else trapFocus(e, drawer.querySelector('.drawer-panel'));
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

/* ---------- momento firma: el muro de 50 ---------- */
function initMuro() {
  const muro = document.getElementById('muro');
  const sec = document.getElementById('edicion');
  if (!muro || !sec) return;

  const libres = new Set(LIBRES);
  muro.innerHTML = Array.from({ length: EDICION }, (_, i) => {
    const n = i + 1;
    const libre = libres.has(n);
    return `<span class="chapa ${libre ? 'libre' : 'vendida'}" data-n="${n}">${String(n).padStart(2, '0')}</span>`;
  }).join('');

  const chapas = [...muro.querySelectorAll('.chapa')];
  const hudV = document.getElementById('hudVendidas');
  const hudL = document.getElementById('hudLibres');
  const hudBar = document.getElementById('hudBar');
  const pie = document.getElementById('muroPie');
  const cierreLibres = document.getElementById('cierreLibres');
  if (cierreLibres) cierreLibres.textContent = String(LIBRES.length);

  const pintar = reveladas => {
    let vendidas = 0;
    chapas.forEach((c, i) => {
      const on = i < reveladas;
      c.classList.toggle('is-on', on);
      if (on && c.classList.contains('vendida')) vendidas++;
    });
    if (hudV) hudV.textContent = String(vendidas).padStart(2, '0');
    if (hudL) hudL.textContent = String(EDICION - vendidas).padStart(2, '0');
    if (hudBar) hudBar.style.width = `${(vendidas / EDICION) * 100}%`;
    if (pie) {
      pie.textContent = reveladas >= EDICION
        ? `Quedan ${LIBRES.length} colecciones sin asignar: la ${LIBRES.map(n => String(n).padStart(2, '0')).join(', la ')}.`
        : 'Deslizá para ver cómo se fue asignando la edición.';
    }
  };

  if (!hasGSAP || !hasST || reduceMotion) {
    pintar(EDICION);
    return;
  }

  pintar(0);
  ScrollTrigger.create({
    trigger: muro,
    start: 'top 88%',
    end: 'bottom 38%',
    scrub: .5,
    invalidateOnRefresh: true,
    onUpdate: self => pintar(Math.round(self.progress * EDICION))
  });
}

/* ---------- coreografía mayor: color journey "el temple" ---------- */
function initTemple() {
  if (!hasGSAP || !hasST || reduceMotion) return;
  const paradas = ['#101011', '#191410', '#0B0B0C'];
  const tl = gsap.timeline({
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true }
  });
  paradas.forEach(color => tl.to(document.body, { backgroundColor: color, duration: 1, ease: 'none' }));
}

/* ---------- rail del lookbook ---------- */
function initRail() {
  const rail = document.getElementById('rail');
  if (!rail) return;
  let down = false, moved = false, startX = 0, startLeft = 0;

  rail.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = rail.scrollLeft;
    rail.classList.add('dragging');
  });
  rail.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; rail.setPointerCapture(e.pointerId); }
    if (moved) { rail.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const end = () => { if (!down) return; down = false; rail.classList.remove('dragging'); setTimeout(() => { moved = false; }, 0); };
  rail.addEventListener('pointerup', end);
  rail.addEventListener('pointercancel', end);
  rail.addEventListener('pointerleave', end);
  rail.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 2) return;
    if ((rail.scrollLeft <= 0 && e.deltaY < 0) || (rail.scrollLeft >= max - 1 && e.deltaY > 0)) return;
    e.preventDefault();
    rail.scrollLeft += e.deltaY;
  }, { passive: false });
}

function initTallerParallax() {
  if (!hasGSAP || !hasST || reduceMotion) return;
  if (!window.matchMedia('(min-width: 1081px)').matches) return;
  const media = document.querySelector('.taller-media');
  if (!media) return;
  gsap.fromTo(media, { y: 36 }, {
    y: -36, ease: 'none',
    scrollTrigger: { trigger: '.taller', start: 'top bottom', end: 'bottom top', scrub: .7, invalidateOnRefresh: true }
  });
}

document.getElementById('anio')?.replaceChildren(String(new Date().getFullYear()));

initNav();
initPiezas();
initModal();
initDrawer();
initMuro();
initReveals();
initWspFloat();
initHero();
initTemple();
initRail();
initTallerParallax();
