document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const hasFlip = typeof Flip !== 'undefined';
const WSP = '5493513175845';

if (hasGsap) gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const PRODUCTOS = [
  {
    id: 'botineta-ravenna', nombre: 'Botineta Ravenna', cat: 'dama', tipo: 'Botinetas',
    precio: 89900, descuento: 0, badge: '',
    img: 'images/botines-negros-elegantes_1254x1254.webp',
    alt: 'Botineta negra de cuero con taco fino apoyada sobre una mesa de mármol',
    talles: [35, 36, 37, 38, 39, 40],
    desc: 'Caña corta, taco 7 cm y punta apenas afinada. La botineta que arranca en la oficina y termina en la cena sin que te cambies.',
    specs: ['Capellada y forro de cuero vacuno negro', 'Taco de 7 cm con base ancha', 'Cierre lateral con cremallera metálica', 'Suela de goma antideslizante'],
    tags: 'negro cuero taco bota invierno'
  },
  {
    id: 'stiletto-amalfi', nombre: 'Stiletto Amalfi', cat: 'dama', tipo: 'Stilettos',
    precio: 76500, descuento: 0, badge: 'Nuevo',
    img: 'images/stilettos-fucsia_1254x1254.webp',
    alt: 'Par de stilettos de gamuza fucsia sobre una superficie de mármol oscuro',
    talles: [35, 36, 37, 38, 39, 40],
    desc: 'Gamuza fucsia y taco 9 cm. Es el par que se lleva la foto de la fiesta, y viene con plantilla acolchada para que aguantes hasta el final.',
    specs: ['Gamuza fucsia con terminación mate', 'Taco aguja de 9 cm', 'Plantilla acolchada de cuero', 'Punta fina clásica'],
    tags: 'fucsia gamuza taco aguja fiesta noche rosa'
  },
  {
    id: 'zapatilla-bianca', nombre: 'Zapatilla Bianca', cat: 'dama', tipo: 'Zapatillas',
    precio: 68900, descuento: 15, badge: '',
    img: 'images/zapatillas-blancas-con-detalles-fucsia_1254x1254.webp',
    alt: 'Zapatilla urbana blanca de cuero con vivos fucsia y verde',
    talles: [35, 36, 37, 38, 39, 40],
    desc: 'Cuero blanco con vivos fucsia y verde. Liviana, sin taco y con suela de goma: la que te ponés cuando el día viene largo.',
    specs: ['Cuero blanco con vivos de color', 'Suela de goma liviana de 3 cm', 'Cordones de repuesto incluidos', 'Plantilla extraíble'],
    tags: 'blanca urbana sneaker liviana verde fucsia'
  },
  {
    id: 'oxford-torino', nombre: 'Oxford Torino', cat: 'caballero', tipo: 'Zapatos de vestir',
    precio: 112000, descuento: 0, badge: '',
    img: 'images/zapatos-oxford-marrones_1254x1254.webp',
    alt: 'Zapatos oxford de cuero marrón lustrado sobre mármol negro',
    talles: [39, 40, 41, 42, 43, 44],
    desc: 'Cuero marrón lustrado, cosido y acordonado. El zapato de vestir que se pone lindo con los años en vez de gastarse.',
    specs: ['Cuero vacuno marrón lustrado', 'Costura Blake, suela de cuero', 'Horma clásica acordonada', 'Bolsa de tela para guardarlo'],
    tags: 'marron vestir formal cuero acordonado traje'
  },
  {
    id: 'sneaker-como', nombre: 'Sneaker Como', cat: 'caballero', tipo: 'Zapatillas',
    precio: 84500, descuento: 0, badge: '',
    img: 'images/mocasines-de-cuero-marrones_1254x1254.webp',
    alt: 'Zapatilla de cuero negro con suela blanca sobre una mesa de mármol',
    talles: [39, 40, 41, 42, 43, 44],
    desc: 'Cuero negro liso y suela blanca. Va con jean y también con pantalón de vestir sin que nadie te diga nada.',
    specs: ['Cuero vacuno negro liso', 'Suela de goma blanca de 3,5 cm', 'Forro de cuero transpirable', 'Plantilla acolchada extraíble'],
    tags: 'negro sneaker zapatilla urbana casual cuero'
  },
  {
    id: 'mocasin-siena', nombre: 'Mocasín Siena', cat: 'caballero', tipo: 'Mocasines',
    precio: 98000, descuento: 0, badge: '',
    img: 'images/zapatillas-negras-casuales_1254x1254.webp',
    alt: 'Mocasines de cuero marrón claro con antifaz, apoyados sobre mármol',
    talles: [39, 40, 41, 42, 43, 44],
    desc: 'Cuero marrón claro, sin cordones y con antifaz. Te lo calzás en dos segundos y queda bien puesto igual.',
    specs: ['Cuero vacuno marrón claro', 'Antifaz cosido a mano', 'Suela de goma flexible', 'Forro de cuero sin costuras internas'],
    tags: 'marron mocasin sin cordones clasico verano'
  }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'calzados_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, 20);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, 20) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
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

function trapFoco(panel, e) {
  const focusables = panel.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="pcard-badge off">-${p.descuento}%</span>`
    : (p.badge ? `<span class="pcard-badge nuevo">${esc(p.badge)}</span>` : '');
  const precio = p.descuento > 0
    ? `<b>${formatearPrecio(final)}</b><s>${formatearPrecio(p.precio)}</s>`
    : `<b>${formatearPrecio(final)}</b>`;
  const talles = p.talles.map(t => `<button type="button" class="talle" data-talle="${t}" aria-pressed="false">${t}</button>`).join('');
  return `<article class="pcard" data-id="${p.id}" data-cat="${p.cat}">
    <div class="pcard-media">
      <span class="pcard-halo" aria-hidden="true"></span>
      ${badge}
      <img src="${p.img}" alt="${esc(p.alt)}" width="1254" height="1254" loading="lazy" decoding="async">
      <span class="pcard-plinth" aria-hidden="true"></span>
    </div>
    <div class="pcard-body">
      <span class="pcard-tipo">${esc(p.tipo)}</span>
      <h3 class="pcard-nombre">${esc(p.nombre)}</h3>
      <p class="pcard-precio">${precio}</p>
      <div class="pcard-talles" role="group" aria-label="Elegí tu talle para ${esc(p.nombre)}"><span>Talle</span>${talles}</div>
      <div class="pcard-acciones">
        <button type="button" class="btn btn-primary btn-sm js-add">Agregar</button>
        <button type="button" class="btn btn-ghost btn-sm js-ver">Ver detalle</button>
      </div>
    </div>
  </article>`;
}

let filtroCat = 'todo';
let filtroTexto = '';

function coincide(p) {
  if (filtroCat !== 'todo' && p.cat !== filtroCat) return false;
  if (!filtroTexto) return true;
  const q = normalizar(filtroTexto);
  return normalizar(`${p.nombre} ${p.tipo} ${p.cat} ${p.desc} ${p.tags}`).includes(q);
}

function aplicarFiltros(animar = true) {
  const grid = document.getElementById('gridProd');
  const vacio = document.getElementById('gridVacio');
  const meta = document.getElementById('filtrosMeta');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.pcard'));
  const state = (animar && hasFlip && !reduceMotion) ? Flip.getState(cards) : null;

  let visibles = 0;
  cards.forEach(card => {
    const p = getProducto(card.dataset.id);
    const ok = p ? coincide(p) : false;
    card.classList.toggle('is-hidden', !ok);
    if (ok) visibles++;
  });

  if (vacio) vacio.hidden = visibles > 0;
  if (meta) {
    meta.textContent = visibles === PRODUCTOS.length
      ? `${PRODUCTOS.length} pares en la vidriera`
      : `${visibles} ${visibles === 1 ? 'par' : 'pares'} de ${PRODUCTOS.length}`;
  }

  if (state) {
    Flip.from(state, {
      duration: .55, ease: 'power3.out', absolute: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .93 }, { opacity: 1, scale: 1, duration: .45, ease: 'power2.out' }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .94, duration: .28, ease: 'power2.in' }),
      onComplete: () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }
    });
  } else if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

function cascadaCards() {
  if (!hasGsap || reduceMotion) return;
  const cards = document.querySelectorAll('.pcard:not(.is-hidden)');
  if (!cards.length) return;
  gsap.fromTo(cards,
    { opacity: 0, y: 52 },
    { opacity: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '#gridProd', start: 'top 84%' } });
}

function initCatalogo() {
  const grid = document.getElementById('gridProd');
  if (!grid) return;
  grid.innerHTML = PRODUCTOS.map(cardHTML).join('');

  grid.addEventListener('click', e => {
    const card = e.target.closest('.pcard');
    if (!card) return;
    const p = getProducto(card.dataset.id);
    if (!p) return;

    const talleBtn = e.target.closest('.talle');
    if (talleBtn) {
      card.querySelectorAll('.talle').forEach(b => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
      talleBtn.classList.add('is-on'); talleBtn.setAttribute('aria-pressed', 'true');
      return;
    }
    if (e.target.closest('.js-add')) {
      const sel = card.querySelector('.talle.is-on');
      if (!sel) { showToast('Elegí tu talle y lo sumamos'); return; }
      Cart.add(p, Number(sel.dataset.talle));
      showToast(`${p.nombre} talle ${sel.dataset.talle} — sumado al pedido`);
      return;
    }
    if (e.target.closest('.js-ver') || e.target.closest('.pcard-media') || e.target.closest('.pcard-nombre')) {
      abrirModal(p.id);
    }
  });

  const buscador = document.getElementById('buscador');
  const clearBtn = document.getElementById('buscadorClear');
  buscador?.addEventListener('input', () => {
    filtroTexto = buscador.value.trim();
    if (clearBtn) clearBtn.hidden = filtroTexto === '';
    aplicarFiltros();
  });
  clearBtn?.addEventListener('click', () => {
    if (!buscador) return;
    buscador.value = ''; filtroTexto = ''; clearBtn.hidden = true;
    aplicarFiltros(); buscador.focus();
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active'); chip.setAttribute('aria-pressed', 'true');
      filtroCat = chip.dataset.cat;
      aplicarFiltros();
    });
  });

  document.getElementById('vaciarFiltros')?.addEventListener('click', () => {
    filtroCat = 'todo'; filtroTexto = '';
    if (buscador) buscador.value = '';
    if (clearBtn) clearBtn.hidden = true;
    document.querySelectorAll('.chip').forEach(c => {
      const on = c.dataset.cat === 'todo';
      c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on));
    });
    aplicarFiltros();
  });

  aplicarFiltros(false);
  cascadaCards();
}

let modalUltimoFoco = null;

function modalHTML(p) {
  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? `<b>${formatearPrecio(final)}</b><s>${formatearPrecio(p.precio)}</s>`
    : `<b>${formatearPrecio(final)}</b>`;
  const talles = p.talles.map(t => `<button type="button" class="talle" data-talle="${t}" aria-pressed="false">${t}</button>`).join('');
  const specs = p.specs.map(s => `<li>${esc(s)}</li>`).join('');
  const sug = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 2).map(x => `
    <button type="button" class="js-sug" data-id="${x.id}">
      <span class="modal-sug-media"><img src="${x.img}" alt="" width="1254" height="1254" loading="lazy" decoding="async"></span>
      <i>${esc(x.nombre)}<u>${formatearPrecio(precioFinal(x))}</u></i>
    </button>`).join('');
  return `
    <div class="modal-media">
      <span class="modal-halo" aria-hidden="true"></span>
      <img src="${p.img}" alt="${esc(p.alt)}" width="1254" height="1254" decoding="async">
    </div>
    <div class="modal-body">
      <span class="modal-tipo">${esc(p.tipo)} · ${p.cat === 'dama' ? 'Dama' : 'Caballero'}</span>
      <h3 id="modalNombre">${esc(p.nombre)}</h3>
      <p class="modal-precio">${precio}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <ul class="modal-specs">${specs}</ul>
      <div class="pcard-talles" role="group" aria-label="Elegí tu talle"><span>Talle</span>${talles}</div>
      <div class="modal-qty">
        <span>Cantidad</span>
        <div class="modal-qty-ctrl">
          <button type="button" class="js-menos" aria-label="Quitar una unidad">−</button>
          <span id="modalQty">1</span>
          <button type="button" class="js-mas" aria-label="Sumar una unidad">+</button>
        </div>
      </div>
      <div class="modal-acciones">
        <button type="button" class="btn btn-primary js-modal-add">Agregar al pedido</button>
        <button type="button" class="btn btn-ghost js-modal-buy">Pedir ahora</button>
      </div>
      ${sug ? `<div class="modal-sug"><b>También te puede gustar</b><div class="modal-sug-list">${sug}</div></div>` : ''}
    </div>`;
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modalProd');
  const backdrop = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalInner');
  if (!p || !modal || !inner) return;
  modalUltimoFoco = document.activeElement;
  inner.innerHTML = modalHTML(p);
  modal.dataset.id = p.id;
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  backdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  modal.scrollTop = 0;
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modalProd');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal) return;
  modal.classList.remove('open');
  backdrop?.classList.remove('open');
  modal.setAttribute('inert', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  modalUltimoFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modalProd');
  const backdrop = document.getElementById('modalBackdrop');
  if (!modal) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  backdrop?.addEventListener('click', cerrarModal);

  modal.addEventListener('click', e => {
    const p = getProducto(modal.dataset.id);
    if (!p) return;
    const qtyEl = document.getElementById('modalQty');

    const talleBtn = e.target.closest('.talle');
    if (talleBtn) {
      modal.querySelectorAll('.talle').forEach(b => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
      talleBtn.classList.add('is-on'); talleBtn.setAttribute('aria-pressed', 'true');
      return;
    }
    if (e.target.closest('.js-menos') && qtyEl) { qtyEl.textContent = String(Math.max(1, Number(qtyEl.textContent) - 1)); return; }
    if (e.target.closest('.js-mas') && qtyEl) { qtyEl.textContent = String(Math.min(20, Number(qtyEl.textContent) + 1)); return; }

    const sug = e.target.closest('.js-sug');
    if (sug) { abrirModal(sug.dataset.id); return; }

    const add = e.target.closest('.js-modal-add');
    const buy = e.target.closest('.js-modal-buy');
    if (add || buy) {
      const sel = modal.querySelector('.talle.is-on');
      if (!sel) { showToast('Elegí tu talle y lo sumamos'); return; }
      Cart.add(p, Number(sel.dataset.talle), Number(qtyEl?.textContent || 1));
      if (buy) { cerrarModal(); abrirDrawer(); }
      else showToast(`${p.nombre} talle ${sel.dataset.talle} — sumado al pedido`);
    }
  });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key === 'Tab') trapFoco(modal, e);
  });
}

let drawerUltimoFoco = null;

function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;
  drawerUltimoFoco = document.activeElement;
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.classList.add('open');
  backdrop?.classList.add('open');
  document.body.classList.add('no-scroll');
  document.getElementById('cartClose')?.focus();
  if (hasGsap && !reduceMotion) {
    const items = drawer.querySelectorAll('.citem');
    if (items.length) gsap.fromTo(items, { opacity: 0, x: 22 }, { opacity: 1, x: 0, duration: .4, stagger: .06, ease: 'power2.out' });
  }
}

function cerrarDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;
  drawer.classList.remove('open');
  backdrop?.classList.remove('open');
  drawer.setAttribute('inert', '');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
  drawerUltimoFoco?.focus();
}

function mensajeWsp() {
  const items = Cart.get();
  if (!items.length) return `https://wa.me/${WSP}`;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `• ${p.nombre} — Talle ${i.talle} × ${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const texto = `Hola Calzados! Quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${formatearPrecio(Cart.total())}\n\n¿Me confirman si están esos talles?`;
  return `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
}

function renderCarrito() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const badge = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  const wspBtn = document.getElementById('cartWsp');
  const items = Cart.get();
  const count = Cart.count();

  if (badge) {
    badge.textContent = String(count);
    badge.hidden = count === 0;
    if (count > 0) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }

  if (!body) return;
  if (!items.length) {
    body.innerHTML = `<div class="vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
      <h3>Todavía no elegiste ningún par</h3>
      <p>Date una vuelta por la vidriera, marcá tu talle y volvé.</p>
      <button type="button" class="btn btn-ghost btn-sm" id="cartIrVidriera">Ver la vidriera</button>
    </div>`;
    if (foot) foot.hidden = true;
    document.getElementById('cartIrVidriera')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('productos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    return;
  }

  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="citem" data-id="${i.id}" data-talle="${i.talle}">
      <span class="citem-media"><img src="${p.img}" alt="" width="1254" height="1254" loading="lazy" decoding="async"></span>
      <div class="citem-info">
        <b>${esc(p.nombre)}</b>
        <span>Talle ${i.talle} · ${formatearPrecio(precioFinal(p))} c/u</span>
        <div class="citem-qty">
          <button type="button" class="js-menos" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <span>${i.qty}</span>
          <button type="button" class="js-mas" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
      </div>
      <div>
        <button type="button" class="icon-btn citem-del" aria-label="Sacar ${esc(p.nombre)} del pedido">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <p class="citem-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>
    </div>`;
  }).join('');

  if (foot) foot.hidden = false;
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
  if (wspBtn) wspBtn.href = mensajeWsp();
}

function initCarrito() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cartClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('cartBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('cartClear')?.addEventListener('click', () => {
    Cart.clear();
    showToast('Vaciamos el pedido');
  });

  document.getElementById('cartBody')?.addEventListener('click', e => {
    const row = e.target.closest('.citem');
    if (!row) return;
    const id = row.dataset.id;
    const talle = Number(row.dataset.talle);
    const actual = Cart.get().find(i => i.id === id && i.talle === talle);
    if (!actual) return;
    if (e.target.closest('.js-menos')) {
      if (actual.qty <= 1) Cart.remove(id, talle);
      else Cart.setQty(id, talle, actual.qty - 1);
    } else if (e.target.closest('.js-mas')) {
      Cart.setQty(id, talle, actual.qty + 1);
    } else if (e.target.closest('.citem-del')) {
      Cart.remove(id, talle);
    }
  });

  const drawer = document.getElementById('cartDrawer');
  document.addEventListener('keydown', e => {
    if (!drawer?.classList.contains('open')) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key === 'Tab') trapFoco(drawer, e);
  });

  document.addEventListener('cart:updated', renderCarrito);
  renderCarrito();
}

function initHero() {
  if (!hasGsap || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: .7 }, .05)
    .from('.hero-title .line-inner', { yPercent: 118, duration: 1.1, stagger: .09 }, .1)
    .from('.hero-lead', { opacity: 0, y: 20, duration: .85 }, .55)
    .from('.hero-cta .btn', { opacity: 0, y: 16, duration: .7, stagger: .08 }, .72)
    .from('.hero-facts li', { opacity: 0, y: 14, duration: .6, stagger: .08 }, .88)
    .from('.hero-plinth', { opacity: 0, scaleX: .6, duration: 1, ease: 'power2.out' }, .3)
    .from('.hero-box', { opacity: 0, x: -46, rotate: -22, duration: 1, ease: 'expo.out' }, .35)
    .from('.hero-shoe-a', { opacity: 0, y: 60, rotate: 9, scale: .9, duration: 1.2, ease: 'expo.out' }, .42)
    .from('.hero-shoe-b', { opacity: 0, y: 44, x: -22, duration: 1.1, ease: 'expo.out' }, .62)
    .from('.hero-price', { opacity: 0, scale: .92, duration: .7 }, .95)
    .from('.sello', { opacity: 0, scale: .9, duration: .8 }, 1);

  gsap.to('.hero-stage', {
    y: -46, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
  });
}

function initCapitulo() {
  const cap = document.getElementById('desempaque');
  const box = document.getElementById('box3d');
  const lid = document.getElementById('bxLid');
  const shoe = document.getElementById('bxShoe');
  const tisL = document.getElementById('tisL');
  const tisR = document.getElementById('tisR');
  const sombra = document.getElementById('capSombra');
  const pasos = Array.from(cap?.querySelectorAll('.paso') || []);
  if (!cap || !box || !lid || !shoe || !pasos.length || !hasGsap || reduceMotion) return;

  cap.classList.add('is-cap');
  const TOTAL = pasos.length;
  let current = -1;

  const setStep = p => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.floor(p * TOTAL)));
    if (i === current) return;
    current = i;
    pasos.forEach((s, k) => s.classList.toggle('is-on', k === i));
  };

  const construir = trigger => {
    const bh = box.offsetHeight || 70;
    gsap.set(lid, { y: 0, z: 0, rotateZ: 0, rotateX: 0 });
    gsap.set([tisL, tisR], { rotateY: 0 });
    gsap.set(shoe, { y: 0, scale: .42, opacity: 0 });
    gsap.set(box, { rotateY: -32 });

    const tl = gsap.timeline({ scrollTrigger: trigger });
    tl.to(lid, { y: -bh * 2.7, z: bh * 1.5, rotateZ: -13, rotateX: 14, duration: 1, ease: 'power2.inOut' }, .55)
      .to(lid, { opacity: .82, duration: .8 }, .8)
      .to(tisL, { rotateY: 104, duration: .85, ease: 'power2.inOut' }, 1.75)
      .to(tisR, { rotateY: -104, duration: .85, ease: 'power2.inOut' }, 1.8)
      .to(shoe, { opacity: 1, duration: .5, ease: 'power1.out' }, 2.55)
      .to(shoe, { y: -bh * 2.2, scale: 1, duration: 1.15, ease: 'power2.out' }, 2.6)
      .to(box, { rotateY: -12, duration: 1.4, ease: 'power1.inOut' }, 2.6);
    if (sombra) tl.to(sombra, { scaleX: 1.16, opacity: .82, duration: 1.2, ease: 'power1.out' }, 2.6);
    tl.to({}, { duration: .3 }, TOTAL - .3);
    return tl;
  };

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    const tl = construir({
      trigger: cap, start: 'top top', end: '+=280%', pin: true, scrub: .65,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; setStep(0);
    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });

  mm.add('(max-width: 1080px)', () => {
    cap.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = construir({
      trigger: cap, start: 'top top', end: 'bottom bottom', scrub: .65,
      invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
    });
    current = -1; setStep(0);
    return () => {
      cap.classList.remove('is-sticky-mobile');
      tl.scrollTrigger?.kill(); tl.kill();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  });
}

function initParallax() {
  if (!hasGsap || reduceMotion) return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amount = parseFloat(el.dataset.parallax) || .12;
    gsap.fromTo(el, { yPercent: -amount * 100 }, {
      yPercent: amount * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: .6 }
    });
  });
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

initNav();
initReveals();
initWspFloat();
initCatalogo();
initModal();
initCarrito();
initHero();
initCapitulo();
initParallax();
initFooterYear();
