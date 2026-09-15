const ENVIO_GRATIS_DESDE = 25000;

const PRODUCTOS = [
  { id: 'tomate', nombre: 'Tomate redondo', categoria: 'hortalizas', precio: 3900, descuento: 15, unidad: 'kg', paso: 0.5, stock: 34, badge: 'Oferta del día', badgeTipo: 'oferta', img: 'images/tomates-frescos_1x1.webp', alt: 'Tomates redondos frescos con gotas de agua', desc: 'Redondo, parejo y con perfume a tomate de verdad. Va igual de bien en la ensalada que en la salsa del domingo.', tags: 'tomate salsa ensalada' },
  { id: 'lechuga', nombre: 'Lechuga crespa', categoria: 'hoja', precio: 4300, descuento: 0, unidad: 'u', nombreUnidad: 'planta', paso: 1, stock: 12, badge: '', badgeTipo: '', img: 'images/lechuga-fresca_1x1.webp', alt: 'Lechuga crespa fresca en cajón de madera', desc: 'Planta entera, crocante y lavada una vez. Cortada esta madrugada; conviene comerla dentro de los tres días.', tags: 'lechuga ensalada verde hoja' },
  { id: 'papa', nombre: 'Papa lavada', categoria: 'hortalizas', precio: 1900, descuento: 0, unidad: 'kg', paso: 0.5, stock: 80, badge: '', badgeTipo: '', img: 'images/papas-frescas_1x1.webp', alt: 'Papas lavadas frescas', desc: 'Papa negra lavada, pareja, de las que no se desarman. Para el puré, el horno o las fritas de la semana.', tags: 'papa pure horno fritas' },
  { id: 'cebolla', nombre: 'Cebolla morada', categoria: 'hortalizas', precio: 2900, descuento: 0, unidad: 'kg', paso: 0.5, stock: 26, badge: '', badgeTipo: '', img: 'images/cebollas-moradas_1x1.webp', alt: 'Cebollas moradas enteras', desc: 'Dulce y suave, ideal para comer cruda. La que levanta cualquier ensalada y el escabeche de la abuela.', tags: 'cebolla morada ensalada escabeche' },
  { id: 'zanahoria', nombre: 'Zanahoria', categoria: 'hortalizas', precio: 2200, descuento: 0, unidad: 'kg', paso: 0.5, stock: 45, badge: '', badgeTipo: '', img: 'images/zanahorias-frescas_1x1.webp', alt: 'Manojo de zanahorias frescas con hojas', desc: 'Con las hojas todavía puestas, señal de que llegó hoy. Dulce para el jugo y firme para el guiso.', tags: 'zanahoria jugo guiso' },
  { id: 'pepino', nombre: 'Pepino', categoria: 'hortalizas', precio: 3400, descuento: 0, unidad: 'kg', paso: 0.5, stock: 4.5, badge: 'Últimos kilos', badgeTipo: 'ultimo', img: 'images/pepinos-frescos_1x1.webp', alt: 'Pepinos frescos enteros y en rodajas', desc: 'Fresco, de cáscara fina, para la ensalada del mediodía. Quedan los últimos kilos del cajón de hoy.', tags: 'pepino ensalada fresco' },
  { id: 'bolson', nombre: 'Bolsón semanal El Nono', categoria: 'bolsones', precio: 26500, descuento: 0, unidad: 'u', nombreUnidad: 'bolsón', nombreUnidadPlural: 'bolsones', paso: 1, stock: 7, badge: 'El más pedido', badgeTipo: 'top', img: 'images/canasta-de-verduras-frescas_9x16.webp', alt: 'Canasta con el surtido semanal de verduras', desc: 'El surtido que el Nono armaría para tu semana: hoja verde, tomate, cebolla, zanahoria y lo mejor que haya llegado del mercado. Rinde para una familia de cuatro.', tags: 'bolson surtido semanal canasta combo' }
];

const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const formatearQty = (p, qty) => {
  if (p.unidad === 'u') {
    const uno = p.nombreUnidad || 'u';
    const varios = p.nombreUnidadPlural || (uno === 'u' ? 'u' : uno + 's');
    return `${qty} ${qty === 1 ? uno : varios}`;
  }
  if (qty < 1) return `${Math.round(qty * 1000)} g`;
  return `${String(qty).replace('.', ',')} kg`;
};

const etiquetaUnidad = p => p.unidad === 'u' ? `por ${p.nombreUnidad || 'unidad'}` : 'por kg';

const filtrarProductos = (productos, { q = '', cat = 'todo' } = {}) => {
  const nq = norm(q).trim();
  return productos.filter(p => {
    if (cat !== 'todo' && p.categoria !== cat) return false;
    if (!nq) return true;
    const blob = norm(`${p.nombre} ${p.categoria} ${p.desc} ${p.tags}`);
    return nq.split(/\s+/).every(t => blob.includes(t));
  });
};

const Cart = {
  KEY: 'elnono_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* almacenamiento no disponible */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    const cant = qty ?? producto.paso;
    if (existing) existing.qty = Math.min(Math.round((existing.qty + cant) * 100) / 100, producto.stock);
    else items.push({ id: producto.id, qty: Math.min(cant, producto.stock) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    const p = getProducto(id); if (!p) return;
    it.qty = Math.max(p.paso, Math.min(Math.round(qty * 100) / 100, p.stock));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  syncStock(productos) {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = productos.find(x => x.id === i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  }
};

const armarMensajeWsp = items => {
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    return p ? `• ${p.nombre} × ${formatearQty(p, i.qty)} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
  }).filter(Boolean);
  const total = items.reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0);
  return `¡Hola! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}\n¿Me confirmás para hoy?`;
};

if (typeof document !== 'undefined') {

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
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }
  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
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
    const bd = document.querySelector('.nav-backdrop');
    const close = () => {
      nav.classList.remove('open'); bd?.classList.remove('open'); nav.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    };
    const open = () => {
      nav.classList.add('open'); bd?.classList.add('open'); nav.removeAttribute('inert');
      toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
      nav.querySelector('a')?.focus();
    };
    toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
    closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
    bd?.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    const mq = window.matchMedia('(min-width: 769px)');
    const sync = () => { if (mq.matches) { nav.removeAttribute('inert'); close(); } else if (!nav.classList.contains('open')) { nav.setAttribute('inert', ''); } };
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

  function initWspFloat() {
    const btn = document.getElementById('wsp-float');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
    }, { passive: true });
  }

  function initHero() {
    if (!hasGsap || reduceMotion) return;
    const lines = document.querySelectorAll('.hero-title .line > span');
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-eyebrow', { opacity: 0, y: 14, duration: 0.7 }, 0.05)
      .from(lines, { yPercent: 112, duration: 1.05, stagger: 0.1 }, 0.1)
      .from('.hero-lead', { opacity: 0, y: 20, duration: 0.85 }, 0.55)
      .from('.hero-cta .btn', { opacity: 0, y: 16, duration: 0.7, stagger: 0.09 }, 0.7)
      .from('.hero-mini li', { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.85)
      .from('.scene-blob', { scale: 0.7, opacity: 0, transformOrigin: '50% 60%', duration: 1, ease: 'power2.out' }, 0.15)
      .from('.scene-canasta', { y: -70, opacity: 0, rotation: -5, duration: 1.1, ease: 'bounce.out' }, 0.4)
      .from('.scene-tag', { scale: 0.4, opacity: 0, rotation: 20, transformOrigin: 'top center', duration: 0.7, ease: 'back.out(1.8)' }, 1)
      .from('.scene-stamp', { scale: 1.7, opacity: 0, duration: 0.5, ease: 'power4.in' }, 1.15);
  }

  const grid = document.getElementById('gridProductos');
  const shopCount = document.getElementById('shopCount');
  const shopEmpty = document.getElementById('shopEmpty');
  const estado = { q: '', cat: 'todo' };
  const cardQty = {};

  const enCarrito = id => Cart.get().find(i => i.id === id)?.qty || 0;
  const disponible = p => Math.max(0, Math.round((p.stock - enCarrito(p.id)) * 100) / 100);

  function stockLabel(p) {
    const disp = p.stock;
    if (disp <= 0) return { txt: 'Sin stock por hoy', low: true };
    const low = p.unidad === 'kg' ? disp <= 6 : disp <= 3;
    return { txt: `Quedan ${formatearQty(p, disp)}`, low };
  }

  function cardHTML(p) {
    const pf = precioFinal(p);
    const st = stockLabel(p);
    const sinStock = p.stock <= 0;
    return `
    <article class="pcard${p.id === 'bolson' ? ' wide' : ''}" data-id="${p.id}">
      <div class="pcard-media" data-open="${p.id}" role="button" tabindex="0" aria-label="Ver ${esc(p.nombre)}">
        ${p.badge ? `<span class="pcard-badge ${p.badgeTipo}">${esc(p.badge)}</span>` : ''}
        <img src="${p.img}" width="600" height="600" alt="${esc(p.alt)}" loading="lazy" decoding="async">
      </div>
      <div class="pcard-body">
        <button type="button" class="pcard-nombre" data-open="${p.id}">${esc(p.nombre)}</button>
        <p class="pcard-precio">
          <b>${formatearPrecio(pf)}</b>
          ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
          <span>${etiquetaUnidad(p)}</span>
        </p>
        <p class="pcard-stock${st.low ? ' low' : ''}">${st.txt}</p>
        <div class="pcard-acciones">
          <div class="stepper" data-stepper="${p.id}">
            <button type="button" class="st-btn" data-menos="${p.id}" aria-label="Restar cantidad de ${esc(p.nombre)}">−</button>
            <span class="st-val" data-qty="${p.id}">${formatearQty(p, cardQty[p.id] || p.paso * (p.unidad === 'kg' ? 2 : 1))}</span>
            <button type="button" class="st-btn" data-mas="${p.id}" aria-label="Sumar cantidad de ${esc(p.nombre)}">+</button>
          </div>
          <button type="button" class="btn-add" data-add="${p.id}" ${sinStock ? 'disabled' : ''}>${sinStock ? 'Sin stock' : 'Agregar'}</button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid(animar) {
    const lista = filtrarProductos(PRODUCTOS, estado);
    lista.forEach(p => { if (!cardQty[p.id]) cardQty[p.id] = p.paso * (p.unidad === 'kg' ? 2 : 1); });
    grid.innerHTML = lista.map(cardHTML).join('');
    shopCount.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
    shopEmpty.hidden = lista.length > 0;
    if (animar && !reduceMotion) {
      grid.querySelectorAll('.pcard').forEach((el, i) => {
        el.classList.add('anim-in');
        el.style.animationDelay = `${Math.min(i * 0.09, 0.6)}s`;
      });
    }
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function initShop() {
    const buscador = document.getElementById('buscador');
    const chips = Array.from(document.querySelectorAll('.chip'));
    buscador?.addEventListener('input', () => { estado.q = buscador.value; renderGrid(true); });
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active'); chip.setAttribute('aria-pressed', 'true');
        estado.cat = chip.dataset.cat;
        renderGrid(true);
      });
    });
    document.getElementById('btnLimpiar')?.addEventListener('click', () => {
      estado.q = ''; estado.cat = 'todo';
      if (buscador) buscador.value = '';
      chips.forEach(c => { const on = c.dataset.cat === 'todo'; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      renderGrid(true);
    });

    grid.addEventListener('click', e => {
      const t = e.target.closest('[data-add],[data-mas],[data-menos],[data-open]');
      if (!t) return;
      if (t.dataset.open) { abrirModal(t.dataset.open); return; }
      const id = t.dataset.add || t.dataset.mas || t.dataset.menos;
      const p = getProducto(id); if (!p) return;
      const span = grid.querySelector(`[data-qty="${id}"]`);
      if (t.dataset.mas) {
        cardQty[id] = Math.min(Math.round((cardQty[id] + p.paso) * 100) / 100, Math.max(p.paso, disponible(p)));
        if (span) span.textContent = formatearQty(p, cardQty[id]);
        return;
      }
      if (t.dataset.menos) {
        cardQty[id] = Math.max(p.paso, Math.round((cardQty[id] - p.paso) * 100) / 100);
        if (span) span.textContent = formatearQty(p, cardQty[id]);
        return;
      }
      const disp = disponible(p);
      if (disp <= 0) { showToast('Ya tenés todo el stock disponible en el pedido.'); return; }
      const qty = Math.min(cardQty[id], disp);
      Cart.add(p, qty);
      showToast(`¡Al pedido! ${p.nombre} × ${formatearQty(p, qty)}.`);
    });
    grid.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.pcard-media')) {
        e.preventDefault();
        abrirModal(e.target.dataset.open);
      }
    });
    renderGrid(false);
  }

  const modal = document.getElementById('modal');
  const modalBd = document.getElementById('modalBackdrop');
  let modalId = null;
  let modalQtyVal = 1;
  let modalRetorno = null;

  function pintarModal(p) {
    modalId = p.id;
    modalQtyVal = p.paso * (p.unidad === 'kg' ? 2 : 1);
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalImg').alt = p.alt;
    document.getElementById('modalCat').textContent = p.categoria === 'hoja' ? 'Hoja verde' : p.categoria === 'bolsones' ? 'Bolsones' : 'Hortalizas';
    document.getElementById('modalNombre').textContent = p.nombre;
    document.getElementById('modalPrecio').innerHTML = `<b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span>${etiquetaUnidad(p)}</span>`;
    document.getElementById('modalDesc').textContent = p.desc;
    const st = stockLabel(p);
    const stEl = document.getElementById('modalStock');
    stEl.textContent = st.txt;
    stEl.classList.toggle('low', st.low);
    document.getElementById('modalQty').textContent = formatearQty(p, modalQtyVal);
    const rel = PRODUCTOS.filter(x => x.id !== p.id && x.categoria === p.categoria).concat(PRODUCTOS.filter(x => x.id !== p.id && x.categoria !== p.categoria)).slice(0, 3);
    document.getElementById('modalRel').innerHTML = `<p>También del puesto</p><div class="modal-rel-grid">${rel.map(r =>
      `<button type="button" data-rel="${r.id}" aria-label="Ver ${esc(r.nombre)}"><img src="${r.img}" width="72" height="72" alt="${esc(r.alt)}" loading="lazy" decoding="async"></button>`).join('')}</div>`;
  }

  function abrirModal(id) {
    const p = getProducto(id); if (!p) return;
    pintarModal(p);
    modalRetorno = document.activeElement;
    modal.classList.add('open'); modalBd.classList.add('open');
    modal.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('modalClose').focus();
  }

  function cerrarModal() {
    modal.classList.remove('open'); modalBd.classList.remove('open');
    modal.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    modalRetorno?.focus?.();
  }

  function initModal() {
    document.getElementById('modalClose').addEventListener('click', cerrarModal);
    modalBd.addEventListener('click', cerrarModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) cerrarModal();
      if (e.key === 'Tab' && modal.classList.contains('open')) {
        const f = Array.from(modal.querySelectorAll('button:not([disabled])'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    document.getElementById('modalMas').addEventListener('click', () => {
      const p = getProducto(modalId); if (!p) return;
      modalQtyVal = Math.min(Math.round((modalQtyVal + p.paso) * 100) / 100, Math.max(p.paso, disponible(p)));
      document.getElementById('modalQty').textContent = formatearQty(p, modalQtyVal);
    });
    document.getElementById('modalMenos').addEventListener('click', () => {
      const p = getProducto(modalId); if (!p) return;
      modalQtyVal = Math.max(p.paso, Math.round((modalQtyVal - p.paso) * 100) / 100);
      document.getElementById('modalQty').textContent = formatearQty(p, modalQtyVal);
    });
    document.getElementById('modalAgregar').addEventListener('click', () => {
      const p = getProducto(modalId); if (!p) return;
      const disp = disponible(p);
      if (disp <= 0) { showToast('Ya tenés todo el stock disponible en el pedido.'); return; }
      Cart.add(p, Math.min(modalQtyVal, disp));
      showToast(`¡Al pedido! ${p.nombre} × ${formatearQty(p, Math.min(modalQtyVal, disp))}.`);
      cerrarModal();
    });
    document.getElementById('modalRel').addEventListener('click', e => {
      const b = e.target.closest('[data-rel]');
      if (b) { const p = getProducto(b.dataset.rel); if (p) { pintarModal(p); document.getElementById('modalClose').focus(); } }
    });
  }

  const drawer = document.getElementById('drawer');
  const drawerBd = document.getElementById('drawerBackdrop');
  let drawerRetorno = null;

  function renderDrawer() {
    const items = Cart.get();
    const cont = document.getElementById('drawerItems');
    const total = Cart.total();
    document.getElementById('cartCount').textContent = Cart.count();
    if (!items.length) {
      cont.innerHTML = `<div class="drawer-vacio">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="21" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="21" r="1.6" fill="currentColor" stroke="none"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        <b>El changuito está vacío</b>
        <p>Pasá por el puesto y elegí lo fresco de hoy.</p>
        <a class="btn btn-ghost" href="#productos" id="irProductos">Ver los productos</a>
      </div>`;
      cont.querySelector('#irProductos')?.addEventListener('click', cerrarDrawer);
    } else {
      cont.innerHTML = items.map(i => {
        const p = getProducto(i.id); if (!p) return '';
        return `<div class="d-item">
          <img src="${p.img}" width="64" height="64" alt="${esc(p.alt)}" loading="lazy" decoding="async">
          <div class="d-info">
            <b>${esc(p.nombre)}</b>
            <span>${formatearPrecio(precioFinal(p))} ${etiquetaUnidad(p)}</span>
            <div class="d-qty">
              <button type="button" data-dmenos="${p.id}" aria-label="Restar ${esc(p.nombre)}">−</button>
              <span>${formatearQty(p, i.qty)}</span>
              <button type="button" data-dmas="${p.id}" aria-label="Sumar ${esc(p.nombre)}">+</button>
            </div>
          </div>
          <div class="d-side">
            <b>${formatearPrecio(precioFinal(p) * i.qty)}</b>
            <button type="button" class="d-del" data-ddel="${p.id}">Quitar</button>
          </div>
        </div>`;
      }).join('');
    }
    document.getElementById('drawerTotal').textContent = formatearPrecio(total);
    const envio = document.getElementById('envioBar');
    const fill = document.getElementById('envioFill');
    const txt = document.getElementById('envioTxt');
    const falta = ENVIO_GRATIS_DESDE - total;
    if (falta > 0) {
      envio.classList.remove('done');
      txt.innerHTML = `Te faltan <b>${formatearPrecio(falta)}</b> para el envío gratis`;
      fill.style.width = `${Math.min(100, (total / ENVIO_GRATIS_DESDE) * 100)}%`;
    } else {
      envio.classList.add('done');
      txt.textContent = '¡Tenés envío gratis! 🎉';
      fill.style.width = '100%';
    }
    const wsp = document.getElementById('btnWspPedido');
    if (wsp) wsp.href = items.length
      ? `https://wa.me/5493525457547?text=${encodeURIComponent(armarMensajeWsp(items))}`
      : 'https://wa.me/5493525457547?text=' + encodeURIComponent('¡Hola! Quiero hacer un pedido a la verdulería.');
  }

  function abrirDrawer() {
    drawerRetorno = document.activeElement;
    drawer.classList.add('open'); drawerBd.classList.add('open');
    drawer.removeAttribute('inert');
    document.body.classList.add('no-scroll');
    document.getElementById('drawerClose').focus();
  }
  function cerrarDrawer() {
    drawer.classList.remove('open'); drawerBd.classList.remove('open');
    drawer.setAttribute('inert', '');
    document.body.classList.remove('no-scroll');
    drawerRetorno?.focus?.();
  }

  function initDrawer() {
    document.getElementById('cartBtn').addEventListener('click', abrirDrawer);
    document.getElementById('drawerClose').addEventListener('click', cerrarDrawer);
    drawerBd.addEventListener('click', cerrarDrawer);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) cerrarDrawer();
    });
    document.getElementById('drawerItems').addEventListener('click', e => {
      const t = e.target.closest('[data-dmas],[data-dmenos],[data-ddel]');
      if (!t) return;
      const id = t.dataset.dmas || t.dataset.dmenos || t.dataset.ddel;
      const p = getProducto(id); if (!p) return;
      const it = Cart.get().find(i => i.id === id); if (!it) return;
      if (t.dataset.ddel) { Cart.remove(id); return; }
      if (t.dataset.dmas) {
        if (it.qty + p.paso > p.stock) { showToast(`Del cajón de hoy quedan ${formatearQty(p, p.stock)} en total.`); return; }
        Cart.setQty(id, it.qty + p.paso);
        return;
      }
      if (it.qty - p.paso < p.paso) Cart.remove(id);
      else Cart.setQty(id, it.qty - p.paso);
    });
    document.getElementById('btnCheckout').addEventListener('click', () => {
      if (!Cart.count()) { showToast('El changuito está vacío. Elegí algo fresco primero.'); return; }
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    });
    document.addEventListener('cart:updated', () => {
      renderDrawer();
      renderGrid(false);
      const badge = document.getElementById('cartCount');
      badge.classList.remove('bounce');
      void badge.offsetWidth;
      badge.classList.add('bounce');
    });
    renderDrawer();
  }

  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    const piezas = PRODUCTOS.map(p => `<span>${esc(p.nombre)} <b>${formatearPrecio(precioFinal(p))}</b> ${p.unidad === 'kg' ? 'el kilo' : `la ${p.nombreUnidad || 'unidad'}`}</span><i></i>`).join('');
    track.innerHTML = piezas + piezas;
  }

  function initBalanza() {
    const stage = document.getElementById('balanza');
    const scene = document.getElementById('balScene');
    if (!stage || !scene) return;
    const ticks = document.getElementById('balTicks');
    if (ticks) {
      let out = '';
      for (let i = 0; i <= 20; i++) {
        const ang = (-88 + i * 8.8) * Math.PI / 180;
        const r1 = 108, r2 = i % 5 === 0 ? 94 : 100;
        const x1 = 180 + r1 * Math.sin(ang), y1 = 130 - r1 * Math.cos(ang);
        const x2 = 180 + r2 * Math.sin(ang), y2 = 130 - r2 * Math.cos(ang);
        out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--bal-line)" stroke-width="${i % 5 === 0 ? 2.5 : 1.2}"/>`;
      }
      ticks.innerHTML = out;
    }
    const steps = Array.from(stage.querySelectorAll('.step'));
    if (!hasGsap || reduceMotion) return;

    stage.classList.add('is-chapter');
    const TOTAL = 4;
    const kgEl = document.getElementById('balKg');
    const pesosEl = document.getElementById('balPesos');
    const stockTxt = document.getElementById('balStockTxt');
    const stockBar = document.getElementById('balStockBar');
    let current = -1;

    const setStep = p => {
      const i = Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length)));
      if (i === current) return;
      current = i;
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    };

    const buildTimeline = trigger => {
      const tomates = ['.bal-tomate.t1', '.bal-tomate.t2', '.bal-tomate.t3'];
      const medidor = { kg: 0, plata: 0, stockKg: 34 };
      gsap.set(tomates, { y: -240, opacity: 0, rotation: i => [-16, 12, -6][i] });
      gsap.set('#balAguja', { rotation: -88, transformOrigin: '180px 130px', svgOrigin: '180 130' });
      gsap.set('.tk-line', { opacity: 0, x: -14 });
      gsap.set('#tkStamp', { opacity: 0, scale: 1.8, rotation: -8 });
      gsap.set(stockBar, { width: '100%' });
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger: trigger });
      tomates.forEach((t, i) => {
        tl.to(t, { y: 0, opacity: 1, rotation: [-4, 6, -2][i], duration: 0.34, ease: 'bounce.out' }, 0.12 + i * 0.22);
      });
      tl.to('#balAguja', { rotation: -22, duration: 0.7, ease: 'elastic.out(1, 0.55)' }, 0.3);
      tl.to(medidor, {
        kg: 1.5, plata: 4973, duration: 0.7, ease: 'power1.inOut',
        onUpdate: () => {
          if (kgEl) kgEl.textContent = medidor.kg.toFixed(1).replace('.', ',') + ' kg';
          if (pesosEl) pesosEl.textContent = formatearPrecio(medidor.plata);
        }
      }, 0.3);
      document.querySelectorAll('.bal-ticket ul .tk-line').forEach((li, i) => {
        tl.to(li, { opacity: 1, x: 0, duration: 0.3 }, 1.15 + i * 0.28);
      });
      tl.to('.tk-total', { opacity: 1, x: 0, duration: 0.3 }, 2.05);
      tl.to(medidor, {
        stockKg: 32.5, duration: 0.6, ease: 'power1.inOut',
        onUpdate: () => { if (stockTxt) stockTxt.textContent = String(Math.round(medidor.stockKg * 10) / 10).replace('.', ',') + ' kg'; }
      }, 2.3);
      tl.to(stockBar, { width: '92%', duration: 0.6, ease: 'power1.inOut' }, 2.3);
      tl.to('#tkStamp', { opacity: 1, scale: 1, duration: 0.35, ease: 'power4.in' }, 3.25);
      tl.to({}, { duration: 0.3 }, TOTAL - 0.3);
      return tl;
    };

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = buildTimeline({
        trigger: stage, start: 'top top', end: '+=260%', pin: true, scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      });
      current = -1; setStep(0);
      return () => { tl.scrollTrigger?.kill(); tl.kill(); };
    });

    mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
      stage.classList.add('is-sticky-mobile');
      requestAnimationFrame(() => ScrollTrigger.refresh());
      const tl = buildTimeline({
        trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        invalidateOnRefresh: true, onUpdate: self => setStep(self.progress)
      });
      current = -1; setStep(0);
      return () => {
        stage.classList.remove('is-sticky-mobile');
        tl.scrollTrigger?.kill(); tl.kill();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };
    });
  }

  function initParallax() {
    if (!hasGsap || reduceMotion) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.gestion-media img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.gestion-media', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
      gsap.to('.puesto-media img', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.puesto-media', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
      gsap.to('.scene-canasta', { y: 26, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 } });
    });
  }

  function init() {
    document.getElementById('year').textContent = new Date().getFullYear();
    Cart.syncStock(PRODUCTOS);
    initNav();
    initReveals();
    initWspFloat();
    initHero();
    initShop();
    initModal();
    initDrawer();
    initMarquee();
    initBalanza();
    initParallax();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}

/* eslint-disable no-undef */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTOS, ENVIO_GRATIS_DESDE, Cart, norm, formatearPrecio, precioFinal, formatearQty, etiquetaUnidad, filtrarProductos, getProducto, armarMensajeWsp };
}
/* eslint-enable no-undef */
