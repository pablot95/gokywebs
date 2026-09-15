const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'electricas', nombre: 'Herramientas eléctricas' },
  { id: 'manuales', nombre: 'Herramientas manuales' },
  { id: 'plomeria', nombre: 'Plomería' },
  { id: 'fijaciones', nombre: 'Fijaciones y mechas' },
  { id: 'pintura', nombre: 'Pintura' }
];

const PRODUCTOS = [
  { id: 'taladro-20v', nombre: 'Taladro percutor inalámbrico 20V + 2 baterías', cat: 'electricas', precio: 189000, descuento: 0, stock: 6, destacado: true, badge: 'Más pedido', img: 'images/taladro-inalambrico_1x1.webp', desc: 'Percutor de 13 mm con dos baterías de litio y cargador rápido. Pared, madera o chapa sin depender del alargue.', tags: ['taladro', 'inalambrico', 'bateria', 'percutor'] },
  { id: 'amoladora-115', nombre: 'Amoladora angular 115 mm 850 W', cat: 'electricas', precio: 96500, descuento: 0, stock: 8, destacado: true, badge: '', img: 'images/amoladora-angular_1x1.webp', desc: 'Liviana y firme para corte y desbaste. Traba de eje y empuñadura lateral incluida.', tags: ['amoladora', 'corte', 'disco'] },
  { id: 'atornillador-12v', nombre: 'Atornillador de impacto 12V compacto', cat: 'electricas', precio: 132000, descuento: 15, stock: 4, destacado: true, badge: '', img: 'images/taladro-inalambrico_1x1.webp', desc: 'Para durlock, muebles y techos: liviano, con torque de sobra y luz LED en la punta.', tags: ['atornillador', 'impacto', 'durlock'] },
  { id: 'amoladora-180', nombre: 'Amoladora 180 mm 2.200 W uso intensivo', cat: 'electricas', precio: 168900, descuento: 0, stock: 3, destacado: false, badge: '', img: 'images/amoladora-angular_1x1.webp', desc: 'La grande, para hierro y hormigón. Arranque suave y protector regulable sin llave.', tags: ['amoladora', 'obra', 'hierro'] },
  { id: 'martillo-carpintero', nombre: 'Martillo de carpintero mango antideslizante', cat: 'manuales', precio: 18900, descuento: 0, stock: 15, destacado: true, badge: '', img: 'images/martillo-con-clavos_1x1.webp', desc: 'Cabeza forjada y balanceada, saca clavos y mango engomado. El clásico que dura años.', tags: ['martillo', 'carpintero', 'clavos'] },
  { id: 'set-martillos', nombre: 'Set de 3 martillos + sacaclavos', cat: 'manuales', precio: 42500, descuento: 10, stock: 5, destacado: false, badge: '', img: 'images/martillo-con-clavos_1x1.webp', desc: 'Carpintero, bolita y goma, más barreta sacaclavos. Para el taller completo.', tags: ['martillo', 'set', 'taller'] },
  { id: 'llave-ajustable-10', nombre: 'Llave ajustable 10" cromo vanadio', cat: 'manuales', precio: 23400, descuento: 0, stock: 10, destacado: true, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Mordaza milimétrica que no cede. Cromada, con escala grabada y apertura de 30 mm.', tags: ['llave', 'ajustable', 'francesa'] },
  { id: 'juego-llaves', nombre: 'Juego de llaves combinadas 8–22 mm', cat: 'manuales', precio: 56900, descuento: 0, stock: 6, destacado: false, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Doce llaves combinadas en estuche enrollable. Acero al cromo vanadio pulido espejo.', tags: ['llaves', 'combinadas', 'juego'] },
  { id: 'kit-conexiones', nombre: 'Kit de conexiones flexibles 1/2"', cat: 'plomeria', precio: 17500, descuento: 0, stock: 12, destacado: false, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Flexibles mallados, cuplas y teflón para dejar la bacha instalada en una tarde.', tags: ['conexiones', 'flexible', 'agua', 'banio'] },
  { id: 'llave-stillson', nombre: 'Llave Stillson 14" para caños', cat: 'plomeria', precio: 39800, descuento: 0, stock: 5, destacado: false, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Agarre dentado autoajustable para caños y uniones duras. Cuerpo de fundición reforzada.', tags: ['stillson', 'canios', 'plomero'] },
  { id: 'pack-teflon', nombre: 'Pack teflón + sellador de roscas', cat: 'plomeria', precio: 8200, descuento: 0, stock: 20, destacado: false, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Cuatro rollos de teflón profesional y sellador anaeróbico. Chau goteo.', tags: ['teflon', 'sellador', 'rosca'] },
  { id: 'flexible-mallado', nombre: 'Flexible mallado 40 cm acero inoxidable', cat: 'plomeria', precio: 9900, descuento: 0, stock: 14, destacado: false, badge: '', img: 'images/llave-ajustable-y-conexiones_1x1.webp', desc: 'Malla de acero con tuercas cónicas. Para canillas, mochilas y calefones.', tags: ['flexible', 'mallado', 'canilla'] },
  { id: 'tornillos-500', nombre: 'Caja 500 tornillos autoperforantes', cat: 'fijaciones', precio: 20500, descuento: 0, stock: 9, destacado: true, badge: 'Rinde', img: 'images/tornillos-tarugos-y-mechas_1x1.webp', desc: 'Punta mecha para chapa y perfiles, cabeza Phillips. La caja que rinde toda la obra.', tags: ['tornillos', 'autoperforantes', 'chapa'] },
  { id: 'kit-tarugos', nombre: 'Kit tarugos + tornillos 8 mm ×100', cat: 'fijaciones', precio: 12800, descuento: 0, stock: 11, destacado: false, badge: '', img: 'images/tornillos-tarugos-y-mechas_1x1.webp', desc: 'Tarugos de expansión con sus tornillos. Para colgar de estantes a termotanques.', tags: ['tarugos', 'fijacion', 'pared'] },
  { id: 'mechas-widia', nombre: 'Set de mechas widia ×5 para pared', cat: 'fijaciones', precio: 16400, descuento: 20, stock: 7, destacado: true, badge: '', img: 'images/tornillos-tarugos-y-mechas_1x1.webp', desc: 'De 5 a 12 mm con pastilla de widia. Entran derecho hasta en ladrillo hueco.', tags: ['mechas', 'widia', 'pared'] },
  { id: 'clavos-2', nombre: 'Clavos 2" caja 1 kg', cat: 'fijaciones', precio: 7100, descuento: 0, stock: 18, destacado: false, badge: '', img: 'images/tornillos-tarugos-y-mechas_1x1.webp', desc: 'Punta París pulidos. El kilo que siempre conviene tener en el cajón.', tags: ['clavos', 'caja', 'carpinteria'] },
  { id: 'kit-pintor', nombre: 'Kit pintor: rodillo, bandeja y pinceles', cat: 'pintura', precio: 25900, descuento: 0, stock: 10, destacado: true, badge: '', img: 'images/kit-de-pintura_1x1.webp', desc: 'Rodillo semifelpa, bandeja con escurridor y tres pinceles. Listo para arrancar el finde.', tags: ['pintura', 'rodillo', 'pincel', 'kit'] },
  { id: 'latex-20l', nombre: 'Látex interior 20 L blanco mate', cat: 'pintura', precio: 94500, descuento: 0, stock: 4, destacado: false, badge: '', img: 'images/kit-de-pintura_1x1.webp', desc: 'Lavable, de alto poder cubritivo. Rinde hasta 200 m² por mano.', tags: ['latex', 'pintura', 'interior', 'blanco'] },
  { id: 'esmalte-1l', nombre: 'Esmalte sintético 1 L brillante', cat: 'pintura', precio: 14900, descuento: 0, stock: 13, destacado: false, badge: '', img: 'images/kit-de-pintura_1x1.webp', desc: 'Para rejas, aberturas y muebles. Secado en 6 horas, terminación espejo.', tags: ['esmalte', 'sintetico', 'rejas'] },
  { id: 'cinta-papel', nombre: 'Cinta de papel 36 mm ×4 unidades', cat: 'pintura', precio: 9500, descuento: 0, stock: 16, destacado: false, badge: '', img: 'images/kit-de-pintura_1x1.webp', desc: 'Se despega sin llevarse la pintura. Bordes prolijos sin retocar.', tags: ['cinta', 'papel', 'enmascarar'] }
];

const ENVIO_GRATIS_DESDE = 80000;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function filtrarProductos(lista, texto, cat) {
  const q = normalizar(texto).trim();
  return lista.filter(p => {
    if (cat && cat !== 'all' && p.cat !== cat) return false;
    if (!q) return true;
    const catNombre = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    const blob = normalizar(`${p.nombre} ${catNombre} ${p.desc} ${(p.tags || []).join(' ')}`);
    return q.split(/\s+/).every(word => blob.includes(word));
  });
}

function ordenarProductos(lista, orden) {
  const copia = [...lista];
  if (orden === 'menor') copia.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (orden === 'mayor') copia.sort((a, b) => precioFinal(b) - precioFinal(a));
  return copia;
}

const Cart = {
  KEY: 'lomaferreteria_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
};

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.getElementById('catGrid')) {

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

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
    const header = document.querySelector('.site-header');
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
    const mq = window.matchMedia('(min-width: 861px)');
    const sync = () => { if (mq.matches) { close(); nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
    mq.addEventListener('change', sync);
    sync();
  }

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
  }

  function initProgressBar() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    let queued = false;
    const update = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
    update();
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

  function cardHTML(p, featured) {
    const final = precioFinal(p);
    const catNombre = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    const badge = p.descuento > 0
      ? `<span class="prod-badge prod-badge-desc">-${p.descuento}%</span>`
      : (p.badge ? `<span class="prod-badge">${esc(p.badge)}</span>` : '');
    const precio = p.descuento > 0
      ? `<span class="prod-precio"><strong>${formatearPrecio(final)}</strong><s>${formatearPrecio(p.precio)}</s></span>`
      : `<span class="prod-precio"><strong>${formatearPrecio(final)}</strong></span>`;
    return `
    <article class="prod-card${featured ? ' prod-card-feat' : ''}" data-id="${p.id}">
      <div class="prod-media">
        ${badge}
        <img src="${p.img}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="lazy">
        <button type="button" class="prod-quick" data-quick="${p.id}">Vista rápida</button>
      </div>
      <div class="prod-info">
        <span class="prod-cat">${esc(catNombre)}</span>
        <h3 class="prod-nombre">${esc(p.nombre)}</h3>
        ${precio}
        <div class="prod-actions">
          <div class="qty-stepper" data-qty="1">
            <button type="button" class="qty-minus" aria-label="Restar cantidad">−</button>
            <span class="qty-val" aria-live="polite">1</span>
            <button type="button" class="qty-plus" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="btn btn-cta btn-sm" data-add="${p.id}">Agregar</button>
          <button type="button" class="btn btn-buy btn-sm" data-buy="${p.id}">Comprar ahora</button>
        </div>
      </div>
    </article>`;
  }

  const featGrid = document.getElementById('featGrid');
  const catGrid = document.getElementById('catGrid');
  const catSearch = document.getElementById('catSearch');
  const catChips = document.getElementById('catChips');
  const catOrden = document.getElementById('catOrden');
  const catCount = document.getElementById('catCount');
  const catEmpty = document.getElementById('catEmpty');
  const catMore = document.getElementById('catMore');
  const PAGE = 12;
  let filtroCat = 'all';
  let visibles = PAGE;

  function renderFeat() {
    featGrid.innerHTML = PRODUCTOS.filter(p => p.destacado).map(p => cardHTML(p, true)).join('');
    featGrid.querySelectorAll('.prod-card').forEach((el, i) => {
      el.setAttribute('data-animate', 'up');
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });
  }

  function resultadoActual() {
    return ordenarProductos(filtrarProductos(PRODUCTOS, catSearch.value, filtroCat), catOrden.value);
  }

  function renderCat({ recascada = true } = {}) {
    const lista = resultadoActual();
    const pagina = lista.slice(0, visibles);
    catGrid.innerHTML = pagina.map(p => cardHTML(p, false)).join('');
    catEmpty.hidden = lista.length > 0;
    catMore.hidden = lista.length <= visibles;
    catCount.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
    if (recascada && !reduceMotion && typeof gsap !== 'undefined') {
      gsap.from(catGrid.querySelectorAll('.prod-card'), {
        opacity: 0, y: 34, duration: 0.7, stagger: 0.06, ease: 'expo.out', clearProps: 'opacity,transform'
      });
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function resetPaginado() { visibles = PAGE; }

  function initCatalogo() {
    renderFeat();
    renderCat({ recascada: false });
    let debounce;
    catSearch.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { resetPaginado(); renderCat(); }, 220);
    });
    catChips.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        catChips.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        filtroCat = chip.dataset.cat;
        resetPaginado();
        renderCat();
      });
    });
    catOrden.addEventListener('change', () => { resetPaginado(); renderCat(); });
    catMore.addEventListener('click', () => { visibles += PAGE; renderCat({ recascada: false }); });
    document.getElementById('catClear').addEventListener('click', () => {
      catSearch.value = '';
      filtroCat = 'all';
      catChips.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c.dataset.cat === 'all'));
      resetPaginado();
      renderCat();
      catSearch.focus();
    });
  }

  function getCardQty(btn) {
    const stepper = btn.closest('.prod-actions, .qv-actions')?.querySelector('.qty-stepper');
    return stepper ? parseInt(stepper.dataset.qty, 10) || 1 : 1;
  }

  document.addEventListener('click', e => {
    const minus = e.target.closest('.qty-minus');
    const plus = e.target.closest('.qty-plus');
    if (minus || plus) {
      const stepper = (minus || plus).closest('.qty-stepper');
      let q = parseInt(stepper.dataset.qty, 10) || 1;
      q = Math.max(1, Math.min(99, q + (plus ? 1 : -1)));
      stepper.dataset.qty = q;
      stepper.querySelector('.qty-val').textContent = q;
      return;
    }
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const p = getProducto(addBtn.dataset.add);
      if (!p) return;
      Cart.add(p, getCardQty(addBtn));
      showToast('¡Agregado! Tu carrito te espera.');
      return;
    }
    const buyBtn = e.target.closest('[data-buy]');
    if (buyBtn) {
      const p = getProducto(buyBtn.dataset.buy);
      if (!p) return;
      Cart.add(p, getCardQty(buyBtn));
      openDrawer();
      return;
    }
    const quickBtn = e.target.closest('[data-quick], [data-open]');
    if (quickBtn) {
      openQuickView(quickBtn.dataset.quick || quickBtn.dataset.open);
    }
  });

  const drawer = document.getElementById('cartDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerItems = document.getElementById('drawerItems');
  const drawerEmpty = document.getElementById('drawerEmpty');
  const drawerFoot = document.getElementById('drawerFoot');
  const drawerTotal = document.getElementById('drawerTotal');
  const shipBar = document.getElementById('shipBar');
  const shipMsg = document.getElementById('shipMsg');
  const shipFill = document.getElementById('shipFill');
  const cartCount = document.getElementById('cartCount');
  let lastFocus = null;

  function trapFocus(container, e) {
    const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openDrawer() {
    lastFocus = document.activeElement;
    renderDrawer();
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    drawer.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('drawerClose').focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    drawer.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    lastFocus?.focus?.();
  }

  function renderDrawer() {
    const items = Cart.get();
    const total = Cart.total();
    drawerEmpty.hidden = items.length > 0;
    drawerFoot.hidden = items.length === 0;
    shipBar.hidden = items.length === 0;
    drawerItems.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      const final = precioFinal(p);
      return `
      <div class="drawer-item" data-id="${p.id}">
        <div class="di-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="1254" height="1254" loading="lazy"></div>
        <div class="di-info">
          <p class="di-nombre">${esc(p.nombre)}</p>
          <span class="di-precio">${formatearPrecio(final)}</span>
          <div class="qty-stepper di-stepper">
            <button type="button" class="di-minus" data-id="${p.id}" aria-label="Restar cantidad">−</button>
            <span class="qty-val">${i.qty}</span>
            <button type="button" class="di-plus" data-id="${p.id}" aria-label="Sumar cantidad">+</button>
          </div>
        </div>
        <button type="button" class="di-remove" data-id="${p.id}" aria-label="Quitar del carrito">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>`;
    }).join('');
    drawerTotal.textContent = formatearPrecio(total);
    if (total >= ENVIO_GRATIS_DESDE) {
      shipMsg.innerHTML = '¡Tenés <strong>envío gratis</strong> en 9 de Julio! 🎉';
      shipFill.style.width = '100%';
    } else {
      const falta = ENVIO_GRATIS_DESDE - total;
      shipMsg.innerHTML = `Te faltan <strong>${formatearPrecio(falta)}</strong> para el envío gratis`;
      shipFill.style.width = `${Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100)}%`;
    }
    const wsp = document.getElementById('wspOrder');
    if (items.length) {
      const lineas = items.map(i => {
        const p = getProducto(i.id);
        return p ? `• ${p.nombre} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
      }).filter(Boolean).join('%0A');
      wsp.href = `https://wa.me/5492317403132?text=${encodeURIComponent('Hola Loma Ferretería, quiero pedir:')}%0A${lineas}%0A${encodeURIComponent('Total: ' + formatearPrecio(total))}`;
    }
  }

  drawerItems.addEventListener('click', e => {
    const minus = e.target.closest('.di-minus');
    const plus = e.target.closest('.di-plus');
    const remove = e.target.closest('.di-remove');
    if (minus || plus) {
      const id = (minus || plus).dataset.id;
      const item = Cart.get().find(i => i.id === id);
      if (item) Cart.setQty(id, item.qty + (plus ? 1 : -1));
    } else if (remove) {
      Cart.remove(remove.dataset.id);
    }
  });

  document.getElementById('cartBtn').addEventListener('click', openDrawer);
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  document.getElementById('emptyGo').addEventListener('click', () => {
    closeDrawer();
    document.getElementById('catalogo').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (typeof confetti !== 'undefined' && !reduceMotion) {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.75 }, colors: ['#E8641B', '#1F3A54', '#F6F3EC'] });
    }
  });

  document.addEventListener('cart:updated', () => {
    const n = Cart.count();
    cartCount.textContent = n;
    cartCount.classList.toggle('has-items', n > 0);
    if (!reduceMotion) {
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth;
      cartCount.classList.add('bump');
    }
    if (drawer.classList.contains('open')) renderDrawer();
  });

  const quickView = document.getElementById('quickView');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const qvBody = document.getElementById('qvBody');
  let qvLastFocus = null;

  function openQuickView(id) {
    const p = getProducto(id);
    if (!p) return;
    qvLastFocus = document.activeElement;
    const final = precioFinal(p);
    const catNombre = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
    const precio = p.descuento > 0
      ? `<span class="qv-precio"><strong>${formatearPrecio(final)}</strong><s>${formatearPrecio(p.precio)}</s><em class="qv-desc-badge">-${p.descuento}%</em></span>`
      : `<span class="qv-precio"><strong>${formatearPrecio(final)}</strong></span>`;
    qvBody.innerHTML = `
      <div class="qv-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="1254" height="1254"></div>
      <div class="qv-info">
        <span class="prod-cat">${esc(catNombre)}</span>
        <h2 id="qvTitle">${esc(p.nombre)}</h2>
        ${precio}
        <p class="qv-desc">${esc(p.desc)}</p>
        <p class="qv-stock">${p.stock <= 4 ? `Quedan ${p.stock} en góndola` : 'En stock, listo para retirar'}</p>
        <div class="qv-actions">
          <div class="qty-stepper" data-qty="1">
            <button type="button" class="qty-minus" aria-label="Restar cantidad">−</button>
            <span class="qty-val" aria-live="polite">1</span>
            <button type="button" class="qty-plus" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="btn btn-cta" data-add="${p.id}">Agregar al carrito</button>
          <button type="button" class="btn btn-buy" data-buy="${p.id}">Comprar ahora</button>
        </div>
        ${relacionados.length ? `
        <div class="qv-rel">
          <p class="qv-rel-title">También te puede servir</p>
          <div class="qv-rel-grid">
            ${relacionados.map(r => `
            <button type="button" class="qv-rel-card" data-quick="${r.id}">
              <img src="${r.img}" alt="${esc(r.nombre)}" width="1254" height="1254" loading="lazy">
              <span>${esc(r.nombre)}</span>
              <strong>${formatearPrecio(precioFinal(r))}</strong>
            </button>`).join('')}
          </div>
        </div>` : ''}
      </div>`;
    quickView.classList.add('open');
    modalBackdrop.classList.add('open');
    quickView.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('qvClose').focus();
  }

  function closeQuickView() {
    quickView.classList.remove('open');
    modalBackdrop.classList.remove('open');
    quickView.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    qvLastFocus?.focus?.();
  }

  document.getElementById('qvClose').addEventListener('click', closeQuickView);
  modalBackdrop.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (quickView.classList.contains('open')) closeQuickView();
      else if (drawer.classList.contains('open')) closeDrawer();
    }
    if (e.key === 'Tab') {
      if (quickView.classList.contains('open')) trapFocus(quickView, e);
      else if (drawer.classList.contains('open')) trapFocus(drawer, e);
    }
  });

  function initHero() {
    if (typeof gsap === 'undefined' || reduceMotion) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero-board', { opacity: 0, duration: 1.1 }, 0)
      .from('.h-line-in', { yPercent: 112, duration: 1.05, stagger: 0.14 }, 0.1)
      .from('[data-hero="eyebrow"]', { opacity: 0, y: 18, duration: 0.8 }, 0.35)
      .from('[data-hero="sub"]', { opacity: 0, y: 24, duration: 0.9 }, 0.5)
      .from('[data-hero="ctas"]', { opacity: 0, y: 24, duration: 0.9 }, 0.65)
      .from('[data-hero="note"]', { opacity: 0, duration: 0.8 }, 0.85)
      .from('.hero-taladro', { opacity: 0, y: -70, rotation: -7, duration: 1.1, ease: 'back.out(1.4)' }, 0.35)
      .from('.hero-martillo', { opacity: 0, y: 40, rotation: 6, duration: 0.9 }, 0.7)
      .from('.hero-tag-1', { opacity: 0, y: -14, scale: 0.94, duration: 0.7 }, 1)
      .from('.hero-tag-2', { opacity: 0, y: -14, scale: 0.94, duration: 0.7 }, 1.15);

    gsap.to('.hero-taladro', { y: -10, duration: 3.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.to('.hero-scene', {
        y: 60, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
      });
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const scene = document.querySelector('.hero-scene');
      const layers = document.querySelectorAll('.hero-scene [data-depth]');
      if (scene && layers.length) {
        const setters = [...layers].map(el => ({
          x: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' }),
          d: parseFloat(el.dataset.depth) || 1
        }));
        document.querySelector('.hero').addEventListener('mousemove', e => {
          const r = scene.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          setters.forEach(s => { s.x(dx * 12 * s.d); s.y(dy * 9 * s.d); });
        });
      }
    }
  }

  function initPegboard() {
    const stage = document.getElementById('pbStage');
    if (!stage) return;
    const pasos = stage.querySelectorAll('.pb-paso');
    const tools = stage.querySelectorAll('.pb-tool');
    const STEPS = pasos.length;
    let current = -1;

    const setStep = idx => {
      idx = Math.max(0, Math.min(STEPS - 1, idx));
      if (idx === current) return;
      current = idx;
      pasos.forEach((el, i) => el.classList.toggle('is-on', i === idx));
      tools.forEach((el, i) => el.classList.toggle('hung', i <= idx));
      stage.classList.toggle('complete', idx === STEPS - 1);
    };

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
      stage.classList.add('pb-static');
      tools.forEach(el => el.classList.add('hung'));
      pasos.forEach(el => el.classList.add('is-on'));
      stage.classList.add('complete');
      return;
    }

    setStep(0);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1081px)', () => {
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=240%',
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(Math.min(STEPS - 1, Math.floor(self.progress * STEPS)))
      });
      return () => st.kill();
    });

    mm.add('(max-width: 1080px)', () => {
      stage.classList.add('is-sticky-mobile');
      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: self => setStep(Math.min(STEPS - 1, Math.floor(self.progress * STEPS)))
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { stage.classList.remove('is-sticky-mobile'); st.kill(); };
    });
  }

  function initCierre() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
    gsap.from('.cierre-martillo', {
      rotation: -14, y: -30, ease: 'none',
      scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'center center', scrub: 0.6 }
    });
  }

  initNav();
  initWspFloat();
  initProgressBar();
  initCatalogo();
  initReveals();
  initHero();
  initPegboard();
  initCierre();
  document.dispatchEvent(new CustomEvent('cart:updated'));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTOS, CATEGORIAS, Cart, precioFinal, formatearPrecio, filtrarProductos, ordenarProductos, normalizar, ENVIO_GRATIS_DESDE };
}
