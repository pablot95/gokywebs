const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491168926992';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
}

const CATEGORIAS = [
  { id: 'aceites', nombre: 'Aceites botánicos', img: 'images/aceite-botanico-esencial_1-1.webp' },
  { id: 'skincare', nombre: 'Skincare natural', img: 'images/crema-natural-con-aloe_1-1.webp' },
  { id: 'jabones', nombre: 'Jabones artesanales', img: 'images/jabones-artesanales_1-1.webp' },
  { id: 'infusiones', nombre: 'Infusiones y hierbas', img: 'images/te-de-manzanilla-y-limon_1-1.webp' },
  { id: 'colmena', nombre: 'Miel y colmena', img: 'images/miel-natural-y-panales_1-1.webp' },
  { id: 'kits', nombre: 'Kits para regalar', img: 'images/empaque-regalo-natural_4-5.webp' },
];

const PRODUCTOS = [
  { id: 'aceite-botanico', nombre: 'Aceite botánico esencial', cat: 'aceites', precio: 18900, descuento: 0, destacado: true, img: 'images/aceite-botanico-esencial_1-1.webp',
    desc: 'Nuestro más pedido. Unas gotas antes de dormir, sobre la piel limpia o en el difusor. Aroma fresco y herbal que baja un cambio.',
    ingr: ['Eucalipto', 'Menta', 'Lavanda', '30 ml'] },
  { id: 'aceite-lavanda', nombre: 'Aceite de lavanda pura', cat: 'aceites', precio: 16400, descuento: 0, destacado: false, img: 'images/aceite-botanico-esencial_1-1.webp',
    desc: 'Lavanda sola, sin mezclas. Para el almohadón, el difusor o diluido en crema neutra.', ingr: ['Lavanda', '30 ml'] },
  { id: 'crema-aloe', nombre: 'Crema facial con aloe', cat: 'skincare', precio: 22500, descuento: 0, destacado: true, img: 'images/crema-natural-con-aloe_1-1.webp',
    desc: 'Textura liviana, se absorbe rápido y no deja brillo. Pensada para pieles que se resecan con los cambios de estación.',
    ingr: ['Aloe vera', 'Manteca de karité', 'Sin perfume', '50 g'] },
  { id: 'serum-rosa', nombre: 'Sérum de rosa mosqueta', cat: 'skincare', precio: 27800, descuento: 12, destacado: true, img: 'images/ritual-skincare-natural_9-16.webp',
    desc: 'Rosa mosqueta prensada en frío. Tres o cuatro gotas de noche, después de limpiar la piel.', ingr: ['Rosa mosqueta', 'Vitamina E', '30 ml'] },
  { id: 'manteca-karite', nombre: 'Manteca corporal de karité', cat: 'skincare', precio: 19600, descuento: 0, destacado: false, img: 'images/crema-natural-con-aloe_1-1.webp',
    desc: 'Densa y nutritiva, para codos, rodillas y manos castigadas. Rinde muchísimo.', ingr: ['Karité', 'Almendras', '120 g'] },
  { id: 'jabon-avena', nombre: 'Jabón de avena y caléndula', cat: 'jabones', precio: 6900, descuento: 0, destacado: true, img: 'images/jabones-artesanales_1-1.webp',
    desc: 'Elaborado en frío y curado seis semanas. El más suave de los tres, ideal para pieles sensibles.', ingr: ['Avena', 'Caléndula', '100 g'] },
  { id: 'jabon-menta', nombre: 'Jabón de menta y arcilla', cat: 'jabones', precio: 6900, descuento: 0, destacado: false, img: 'images/jabones-artesanales_1-1.webp',
    desc: 'Con arcilla verde y menta. Refresca y deja la piel limpia sin tirantez.', ingr: ['Menta', 'Arcilla verde', '100 g'] },
  { id: 'trio-jabones', nombre: 'Trío de jabones artesanales', cat: 'jabones', precio: 20700, descuento: 15, destacado: true, img: 'images/jabones-artesanales_1-1.webp',
    desc: 'Los tres jabones juntos: avena y caléndula, menta y arcilla, y el de manzanilla. Vienen en caja de cartón reciclado.',
    ingr: ['3 unidades', '100 g c/u'] },
  { id: 'te-manzanilla', nombre: 'Té de manzanilla y limón', cat: 'infusiones', precio: 9800, descuento: 0, destacado: true, img: 'images/te-de-manzanilla-y-limon_1-1.webp',
    desc: 'Manzanilla entera con cáscara de limón y menta. En frasco de vidrio con cierre hermético.', ingr: ['Manzanilla', 'Limón', 'Menta', '80 g'] },
  { id: 'blend-digestivo', nombre: 'Blend digestivo de hierbas', cat: 'infusiones', precio: 10400, descuento: 0, destacado: false, img: 'images/te-de-manzanilla-y-limon_1-1.webp',
    desc: 'Boldo, menta y anís. El que tomamos después de comer.', ingr: ['Boldo', 'Menta', 'Anís', '80 g'] },
  { id: 'miel-flores', nombre: 'Miel pura de flores', cat: 'colmena', precio: 12700, descuento: 0, destacado: true, img: 'images/miel-natural-y-panales_1-1.webp',
    desc: 'De productores de la provincia de Buenos Aires. Sin agregados y sin pasteurizar.', ingr: ['Miel pura', '500 g'] },
  { id: 'propoleo', nombre: 'Propóleo en gotas', cat: 'colmena', precio: 14200, descuento: 0, destacado: false, img: 'images/miel-natural-y-panales_1-1.webp',
    desc: 'Extracto de propóleo en gotero. El clásico de los cambios de estación.', ingr: ['Propóleo', '30 ml'] },
  { id: 'curcuma-jengibre', nombre: 'Cápsulas de cúrcuma y jengibre', cat: 'suplementos', precio: 21300, descuento: 0, destacado: false, img: 'images/frasco-de-suplementos_1-1.webp',
    desc: 'Cúrcuma y jengibre en cápsulas vegetales, en frasco de vidrio ámbar.', ingr: ['Cúrcuma', 'Jengibre', '60 cápsulas'] },
  { id: 'kit-ritual', nombre: 'Kit ritual completo', cat: 'kits', precio: 54900, descuento: 15, destacado: true, img: 'images/empaque-regalo-natural_4-5.webp',
    desc: 'Aceite botánico, un jabón artesanal, el té de manzanilla y la miel, armados a mano en caja con moño. Podés cambiar cualquiera de los productos escribiéndonos.',
    ingr: ['4 productos', 'Caja de regalo', 'Tarjeta escrita a mano'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const fmt = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || 'Otros';

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add('hiding'); setTimeout(() => t.remove(), 220); }, 3000);
}

const Cart = {
  KEY: 'renacernatural_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const ex = items.find(i => i.id === producto.id);
    if (ex) ex.qty = Math.min(ex.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function cardHTML(p) {
  const fin = precioFinal(p);
  const badge = p.descuento > 0 ? `<span class="prod-badge">-${p.descuento}%</span>` : '';
  const old = p.descuento > 0 ? `<s class="precio-old">${fmt(p.precio)}</s>` : '';
  return `<article class="prod" data-id="${p.id}">
    <div class="prod-media">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="lazy">
      ${badge}
      <button type="button" class="prod-ver" data-ver="${p.id}">Ver detalle</button>
    </div>
    <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
    <h3 class="prod-nom">${esc(p.nombre)}</h3>
    <p class="prod-precio"><span class="precio">${fmt(fin)}</span>${old}</p>
    <div class="prod-acciones">
      <span class="stepper">
        <button type="button" data-step="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
        <span data-qty>1</span>
        <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
      </span>
      <button type="button" class="btn btn-add" data-add="${p.id}">Agregar</button>
    </div>
  </article>`;
}

const Catalogo = {
  cat: 'todas',
  q: '',
  visibles: 8,
  PASO: 8,
  filtrar() {
    const t = norm(this.q).trim();
    return PRODUCTOS.filter(p => {
      if (this.cat !== 'todas' && p.cat !== this.cat) return false;
      if (!t) return true;
      return norm(p.nombre).includes(t) || norm(nombreCat(p.cat)).includes(t) ||
        norm(p.desc).includes(t) || p.ingr.some(i => norm(i).includes(t));
    });
  },
  render() {
    const grid = document.getElementById('gridCatalogo');
    const vacio = document.getElementById('vacio');
    const verMas = document.getElementById('verMas');
    const res = document.getElementById('resultados');
    const limpiar = document.getElementById('limpiar');
    if (!grid) return;
    const lista = this.filtrar();
    const muestra = lista.slice(0, this.visibles);
    grid.innerHTML = muestra.map(cardHTML).join('');
    grid.hidden = lista.length === 0;
    vacio.hidden = lista.length > 0;
    verMas.parentElement.hidden = lista.length <= this.visibles;
    res.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
    limpiar.hidden = this.cat === 'todas' && !this.q;
    document.querySelectorAll('.chip-cat').forEach(c => c.classList.toggle('on', c.dataset.cat === this.cat));
    if (typeof gsap !== 'undefined' && !reduceMotion && muestra.length) {
      gsap.from(grid.children, { opacity: 0, y: 26, duration: .6, stagger: .06, ease: 'power3.out', clearProps: 'all' });
    }
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  },
  set(cat, q) {
    if (cat !== undefined) this.cat = cat;
    if (q !== undefined) this.q = q;
    this.visibles = this.PASO;
    this.render();
  },
};

function initCatalogo() {
  const grid = document.getElementById('gridCatalogo');
  if (!grid) return;
  const dest = document.getElementById('gridDestacados');
  if (dest) dest.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(cardHTML).join('');

  const catGrid = document.getElementById('catGrid');
  if (catGrid) {
    catGrid.innerHTML = CATEGORIAS.map(c => `<button type="button" class="cat-card" data-cat="${c.id}" data-animate style="opacity:0;transform:translateY(22px)">
      <img src="${c.img}" alt="${esc(c.nombre)}" width="1254" height="1254" loading="lazy">
      <span>${esc(c.nombre)}</span>
    </button>`).join('');
  }

  const chips = document.getElementById('chipsCat');
  if (chips) {
    chips.innerHTML = [{ id: 'todas', nombre: 'Todo' }].concat(CATEGORIAS)
      .map(c => `<button type="button" class="chip-cat" data-cat="${c.id}">${esc(c.nombre)}</button>`).join('');
  }

  const buscar = document.getElementById('buscar');
  buscar?.addEventListener('input', () => Catalogo.set(undefined, buscar.value));
  document.getElementById('limpiar')?.addEventListener('click', () => { if (buscar) buscar.value = ''; Catalogo.set('todas', ''); });
  document.getElementById('vacioReset')?.addEventListener('click', () => { if (buscar) buscar.value = ''; Catalogo.set('todas', ''); });
  document.getElementById('verMas')?.addEventListener('click', () => { Catalogo.visibles += Catalogo.PASO; Catalogo.render(); });

  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip-cat');
    if (chip) { Catalogo.set(chip.dataset.cat, undefined); return; }
    const catCard = e.target.closest('[data-cat]:not(.chip-cat)');
    if (catCard) {
      Catalogo.set(catCard.dataset.cat, '');
      if (buscar) buscar.value = '';
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });

  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const card = step.closest('.prod');
      const span = card?.querySelector('[data-qty]');
      if (!span) return;
      const n = Math.max(1, Math.min(99, Number(span.textContent) + Number(step.dataset.step)));
      span.textContent = n;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = add.closest('.prod') || add.closest('.modal-info');
      const qty = Number(card?.querySelector('[data-qty]')?.textContent || 1);
      Cart.add(p, qty);
      showToast(`${p.nombre} — agregado a tu pedido`);
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });

  Catalogo.render();
}

let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const body = document.getElementById('modalBody');
  const bd = document.getElementById('modalBackdrop');
  if (!p || !modal || !body) return;
  ultimoFoco = document.activeElement;
  const fin = precioFinal(p);
  const old = p.descuento > 0 ? `<s class="precio-old">${fmt(p.precio)}</s>` : '';
  body.innerHTML = `<div class="modal-grid">
    <div class="modal-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="1254" height="1254"></div>
    <div class="modal-info">
      <p class="prod-cat">${esc(nombreCat(p.cat))}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="prod-precio"><span class="precio">${fmt(fin)}</span>${old}</p>
      <p class="modal-desc">${esc(p.desc)}</p>
      <div class="modal-ingr">${p.ingr.map(i => `<span>${esc(i)}</span>`).join('')}</div>
      <div class="modal-acc">
        <span class="stepper">
          <button type="button" data-step="-1" aria-label="Quitar una unidad">−</button>
          <span data-qty>1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">+</button>
        </span>
        <button type="button" class="btn" data-add="${p.id}">Agregar al pedido</button>
      </div>
    </div>
  </div>`;
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  bd.classList.add('open');
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  document.getElementById('modalBackdrop').classList.remove('open');
  if (!document.getElementById('drawer').classList.contains('open')) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initModal() {
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('modal')?.classList.contains('open')) cerrarModal();
  });
}

function mensajePedido() {
  const items = Cart.get();
  if (!items.length) return `Hola Rocío! Quiero hacer un pedido.`;
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `• ${i.qty}x ${p.nombre} — ${fmt(precioFinal(p) * i.qty)}`;
  }).filter(Boolean).join('\n');
  return `Hola Rocío! Quiero hacer este pedido:\n\n${lineas}\n\nTotal: ${fmt(Cart.total())}`;
}

function renderCarrito() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  const badge = document.getElementById('cartBadge');
  const total = document.getElementById('drawerTotal');
  const btn = document.getElementById('pedirWsp');
  if (!body) return;
  const items = Cart.get();
  const n = Cart.count();
  if (badge) {
    badge.textContent = n;
    badge.classList.toggle('on', n > 0);
  }
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <b>Tu pedido está vacío</b>
      <p>Sumá lo que quieras y te lo confirmamos por WhatsApp.</p>
      <button type="button" class="btn" data-cerrar-drawer>Ver el catálogo</button>
    </div>`;
    pie.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea" data-linea="${p.id}">
      <span class="linea-media"><img src="${p.img}" alt="" width="200" height="200" loading="lazy"></span>
      <span>
        <span class="linea-nom">${esc(p.nombre)}</span>
        <span class="linea-precio">${fmt(precioFinal(p))} c/u</span>
      </span>
      <span class="linea-acc">
        <span class="stepper">
          <button type="button" data-lstep="-1" aria-label="Quitar una unidad de ${esc(p.nombre)}">−</button>
          <span>${i.qty}</span>
          <button type="button" data-lstep="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </span>
        <button type="button" class="quitar" data-quitar="${p.id}">Quitar</button>
      </span>
    </div>`;
  }).join('');
  pie.hidden = false;
  total.textContent = fmt(Cart.total());
  btn.href = `https://wa.me/${WSP}?text=${encodeURIComponent(mensajePedido())}`;
}

function initCarrito() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  const abrir = () => {
    drawer.classList.add('open');
    drawer.removeAttribute('inert');
    bd.classList.add('open');
    document.body.classList.add('no-scroll');
    document.getElementById('drawerClose')?.focus();
  };
  const cerrar = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('inert', '');
    bd.classList.remove('open');
    if (!document.getElementById('modal').classList.contains('open')) document.body.classList.remove('no-scroll');
    document.getElementById('cartBtn')?.focus();
  };
  document.getElementById('cartBtn')?.addEventListener('click', abrir);
  document.getElementById('drawerClose')?.addEventListener('click', cerrar);
  bd?.addEventListener('click', cerrar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) cerrar(); });

  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrar();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); return; }
    const s = e.target.closest('[data-lstep]');
    if (s) {
      const id = s.closest('[data-linea]')?.dataset.linea;
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + Number(s.dataset.lstep));
    }
  });

  document.addEventListener('cart:updated', () => {
    renderCarrito();
    const badge = document.getElementById('cartBadge');
    if (badge && !reduceMotion) {
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    }
  });
  renderCarrito();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (nav.closest('.site-header') || document.body).appendChild(bd); }
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
  const mq = window.matchMedia('(min-width: 1001px)');
  const sync = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener('change', sync);
  sync();
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

function initRitual() {
  const stage = document.getElementById('ritualStage');
  const pasos = [...document.querySelectorAll('.ritual-paso')];
  const items = [...document.querySelectorAll('.caja-item')];
  const caja = document.getElementById('caja');
  if (!stage || !pasos.length) return;

  let actual = -1;
  const aplicar = n => {
    if (n === actual) return;
    actual = n;
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === n));
    items.forEach(it => it.classList.toggle('is-in', n >= Number(it.dataset.item)));
    caja?.classList.toggle('is-cerrada', n >= pasos.length - 1);
  };
  aplicar(0);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    stage.classList.add('is-lista');
    pasos.forEach(p => p.classList.add('is-on'));
    items.forEach(it => it.classList.add('is-in'));
    return;
  }

  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: self => aplicar(Math.min(pasos.length - 1, Math.max(0, Math.floor(self.progress * pasos.length)))),
  });
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.escena-campo', { scale: .88, opacity: 0, duration: 1.1 })
    .from('.escena-wordmark', { y: 18, opacity: 0, duration: .9 }, '-=.8')
    .from('.escena-producto', { y: 44, opacity: 0, duration: 1 }, '-=.7')
    .from('.escena-nota', { x: 20, y: 12, opacity: 0, duration: .8 }, '-=.6');
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initAnclas() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCatalogo();
  initModal();
  initCarrito();
  initRitual();
  initHero();
  initWspFloat();
  initAnclas();
  initReveals();
});
