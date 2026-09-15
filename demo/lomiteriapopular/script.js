const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const waLink = msg => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(msg)}`;

const Cart = {
  KEY: 'lomiteriapopular_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
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
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});
function initDevToolsGuard() {
  let overlay = null;
  let open = false;
  window.setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) {
      overlay.classList.remove('visible');
    }
  }, 800);
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initWaLinks() {
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.setAttribute('href', waLink(a.dataset.wa));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
}

function initHeader() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const close = () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

/* ---------- Categorías ---------- */
function renderCategorias() {
  const wrap = document.getElementById('cat-grid');
  if (!wrap) return;
  const destacadas = CATEGORIAS.filter(c => c.modo === 'foto').slice(0, 8);
  wrap.innerHTML = destacadas.map(c => `
    <a class="cat-card" href="#carta" data-cat="${esc(c.id)}" data-animate="up" style="transform:translateY(28px);opacity:0">
      <img src="${esc(c.img)}" alt="${esc(c.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
      <span class="cat-card-go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="cat-card-body">
        <span class="cat-card-kicker">${esc(c.kicker)}</span>
        <h3>${esc(c.nombre)}</h3>
        <p>${esc(c.bajada)}</p>
      </span>
    </a>
  `).join('');

  wrap.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      setCategoria(card.dataset.cat);
      document.getElementById('carta').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- Destacados ---------- */
function renderPicks() {
  const rail = document.getElementById('picks-rail');
  if (!rail) return;
  const picks = PRODUCTOS.filter(p => p.destacado).slice(0, 10);
  rail.innerHTML = picks.map(p => {
    const final = precioFinal(p);
    return `
    <article class="pick">
      <div class="pick-media">
        <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
        ${p.badge ? `<span class="pick-badge chapa">${esc(p.badge)}</span>` : ''}
      </div>
      <div class="pick-body">
        <h3>${esc(p.nombre)}</h3>
        <div class="pick-foot">
          <span class="pick-price">${formatearPrecio(final)}</span>
          <button class="pick-add" type="button" data-add="${esc(p.id)}">Agregar</button>
        </div>
      </div>
    </article>`;
  }).join('');

  const prev = document.getElementById('picks-prev');
  const next = document.getElementById('picks-next');
  const step = () => Math.max(240, rail.clientWidth * 0.42);
  prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));
}

function renderRibbon() {
  const track = document.getElementById('ribbon-track');
  if (!track) return;
  const frases = ['Todo viene con papas', 'Lomo de verdad', 'Mayonesa casera', 'Delivery en Valle Escondido', 'Abierto de 8 a 00', 'Cuádruple cheddar'];
  const bloque = frases.map(f => `<span>${esc(f)}</span>`).join('');
  track.innerHTML = bloque + bloque;
}

/* ---------- Carta ---------- */
const PASO_FOTO = 12;
const PASO_LISTA = 30;
let catActiva = 'todo';
let visibles = PASO_FOTO;
let fuse = null;

const RE_TILDES = new RegExp('[\\u0300-\\u036f]', 'g');
function normalizar(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(RE_TILDES, '');
}

function pasoActual() {
  const c = getCategoria(catActiva);
  return c && c.modo === 'lista' ? PASO_LISTA : PASO_FOTO;
}

function initFuse() {
  if (typeof Fuse === 'undefined') return;
  const dataset = PRODUCTOS.map(p => ({
    id: p.id,
    nombre: normalizar(p.nombre),
    tags: (p.tags || []).map(normalizar),
    desc: normalizar(p.desc),
    categoria: normalizar(getCategoria(p.cat)?.nombre || ''),
  }));
  fuse = new Fuse(dataset, {
    threshold: 0.35,
    ignoreLocation: true,
    keys: [
      { name: 'nombre', weight: 3 },
      { name: 'tags', weight: 2 },
      { name: 'categoria', weight: 1.5 },
      { name: 'desc', weight: 1 },
    ],
  });
}

function filtrar() {
  const q = normalizar(document.getElementById('q')?.value || '').trim();
  let lista = PRODUCTOS;

  if (q) {
    if (fuse) {
      const ids = fuse.search(q).map(r => r.item.id);
      const orden = new Map(ids.map((id, i) => [id, i]));
      lista = lista.filter(p => orden.has(p.id)).sort((a, b) => orden.get(a.id) - orden.get(b.id));
    } else {
      lista = lista.filter(p => {
        const heno = normalizar([p.nombre, p.desc, (p.tags || []).join(' '), getCategoria(p.cat)?.nombre].join(' '));
        return heno.includes(q);
      });
    }
  }

  if (catActiva !== 'todo') lista = lista.filter(p => p.cat === catActiva);
  return lista;
}

function cardProducto(p) {
  const final = precioFinal(p);
  const tieneOff = p.descuento > 0;
  return `
  <article class="p-card" data-id="${esc(p.id)}">
    <div class="p-media">
      <button class="p-open" type="button" data-open="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}">
        <img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy" decoding="async">
      </button>
      ${p.badge ? `<span class="p-badge chapa">${esc(p.badge)}</span>` : ''}
      ${tieneOff ? `<span class="p-off">-${p.descuento}%</span>` : ''}
      <button class="p-quick" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al pedido">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="p-body">
      <h3 class="p-name"><button type="button" data-open="${esc(p.id)}">${esc(p.nombre)}</button></h3>
      <div class="p-prices">
        <span class="p-price">${formatearPrecio(final)}</span>
        ${tieneOff ? `<s class="p-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="p-row">
        <div class="qty" data-qty="${esc(p.id)}">
          <button type="button" data-step="-1" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button>
          <span data-val="1">1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
        </div>
        <button class="p-add" type="button" data-add-qty="${esc(p.id)}">Agregar</button>
      </div>
      <button class="p-buy" type="button" data-buy="${esc(p.id)}">Pedir ahora</button>
    </div>
  </article>`;
}

function filaProducto(p) {
  return `
  <div class="l-row" data-id="${esc(p.id)}">
    <div class="l-info">
      <b>${esc(p.nombre)}</b>
      <span>${esc(p.desc)}</span>
    </div>
    <span class="l-price">${formatearPrecio(precioFinal(p))}</span>
    <button class="l-add" type="button" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al pedido">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 6v12M6 12h12" stroke-linecap="round"/></svg>
    </button>
  </div>`;
}

function renderGrid(animar = true) {
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const more = document.getElementById('more');
  const count = document.getElementById('results-count');
  const reset = document.getElementById('reset-filters');
  if (!grid) return;

  const lista = filtrar();
  const q = document.getElementById('q')?.value.trim() || '';
  const filtrando = Boolean(q) || catActiva !== 'todo';

  count.textContent = lista.length === 0
    ? 'Sin resultados'
    : `${lista.length} ${lista.length === 1 ? 'cosa' : 'cosas'} en la carta`;
  reset.hidden = !filtrando;

  if (lista.length === 0) {
    grid.innerHTML = '';
    empty.hidden = false;
    more.hidden = true;
    refrescarScroll();
    return;
  }
  empty.hidden = true;

  const trozo = lista.slice(0, visibles);
  let html = '';
  let ultimoHead = '';
  trozo.forEach(p => {
    const cat = getCategoria(p.cat);
    const head = q ? '' : (catActiva === 'todo' ? (cat?.nombre || '') : (p.sub || ''));
    if (head && head !== ultimoHead) {
      html += `<div class="grid-head"><h3>${esc(head)}</h3></div>`;
      ultimoHead = head;
    }
    const modoLista = p.modo === 'lista' || cat?.modo === 'lista' || !p.img;
    html += modoLista ? filaProducto(p) : cardProducto(p);
  });
  grid.innerHTML = html;

  more.hidden = visibles >= lista.length;
  if (animar) cascada(grid);
  refrescarScroll();
}

function cascada(grid) {
  const items = grid.querySelectorAll('.p-card, .l-row, .grid-head');
  if (typeof gsap === 'undefined') return;
  gsap.killTweensOf(items);
  gsap.fromTo(items,
    { y: 34, opacity: 0 },
    { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: { each: .045, from: 'start' }, overwrite: true }
  );
}

function refrescarScroll() {
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function setCategoria(id) {
  catActiva = id;
  visibles = pasoActual();
  document.querySelectorAll('.chip').forEach(ch => {
    ch.setAttribute('aria-selected', String(ch.dataset.cat === id));
  });
  moverPill();
  renderGrid();
}

function moverPill() {
  const chips = document.getElementById('chips');
  const pill = chips?.querySelector('.chip-pill');
  const activo = chips?.querySelector('.chip[aria-selected="true"]');
  if (!pill || !activo) return;
  pill.style.width = `${activo.offsetWidth}px`;
  pill.style.transform = `translateX(${activo.offsetLeft}px)`;
}

function renderChips() {
  const chips = document.getElementById('chips');
  if (!chips) return;
  const todas = [{ id: 'todo', nombre: 'Todo' }, ...CATEGORIAS];
  chips.innerHTML = '<span class="chip-pill" aria-hidden="true"></span>' + todas.map(c => `
    <button class="chip" type="button" role="tab" data-cat="${esc(c.id)}" aria-selected="${c.id === 'todo'}">${esc(c.nombre)}</button>
  `).join('');

  chips.querySelectorAll('.chip').forEach(ch => {
    ch.addEventListener('click', () => {
      setCategoria(ch.dataset.cat);
      ch.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });
  requestAnimationFrame(moverPill);
  window.addEventListener('resize', moverPill);
}

function initCartaTools() {
  const q = document.getElementById('q');
  const clear = document.getElementById('q-clear');
  const more = document.getElementById('more');
  const reset = document.getElementById('reset-filters');
  const emptyReset = document.getElementById('empty-reset');

  let t;
  q?.addEventListener('input', () => {
    clear.hidden = !q.value;
    clearTimeout(t);
    t = setTimeout(() => { visibles = pasoActual(); renderGrid(); }, 180);
  });
  clear?.addEventListener('click', () => {
    q.value = '';
    clear.hidden = true;
    visibles = pasoActual();
    renderGrid();
    q.focus();
  });
  more?.addEventListener('click', () => {
    visibles += pasoActual();
    renderGrid(false);
    const grid = document.getElementById('grid');
    const nuevos = Array.from(grid.children).slice(-pasoActual());
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(nuevos, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .6, ease: 'power3.out', stagger: .04 });
    }
  });

  const limpiar = () => {
    if (q) { q.value = ''; clear.hidden = true; }
    setCategoria('todo');
    document.getElementById('carta').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  reset?.addEventListener('click', limpiar);
  emptyReset?.addEventListener('click', limpiar);
}

/* ---------- Acciones de producto ---------- */
function leerQty(btn) {
  const scope = btn.closest('.p-card, .m-body');
  const box = scope?.querySelector('.qty [data-val]');
  return box ? parseInt(box.textContent, 10) || 1 : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('.qty');
      const val = box.querySelector('[data-val]');
      const n = Math.max(1, Math.min(99, (parseInt(val.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
      val.textContent = n;
      return;
    }

    const open = e.target.closest('[data-open]');
    if (open) { abrirModal(open.dataset.open); return; }

    const addQty = e.target.closest('[data-add-qty]');
    if (addQty) {
      const p = getProducto(addQty.dataset.addQty);
      if (!p) return;
      Cart.add(p, leerQty(addQty));
      showToast(`${p.nombre} va para la cocina 🔥`);
      return;
    }

    const add = e.target.closest('[data-add]');
    if (add) {
      if (add.tagName === 'A') e.preventDefault();
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, 1);
      showToast(`${p.nombre} va para la cocina 🔥`);
      return;
    }

    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, leerQty(buy));
      abrirDrawer();
      return;
    }
  });
}

/* ---------- Modal de producto ---------- */
let modalPrev = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const back = document.getElementById('modal-backdrop');
  const inner = document.getElementById('modal-inner');
  if (!p || !modal) return;

  const final = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id && x.img).slice(0, 3);

  inner.innerHTML = `
    <div class="m-media">
      <img src="${esc(p.img || 'images/lomito-clasico-1200x1200.webp')}" alt="${esc(p.nombre)}" width="1200" height="1200" decoding="async">
    </div>
    <div class="m-body">
      ${p.badge ? `<span class="chapa">${esc(p.badge)}</span>` : `<span class="chapa">${esc(getCategoria(p.cat)?.nombre || '')}</span>`}
      <h2>${esc(p.nombre)}</h2>
      <p class="m-desc">${esc(p.desc)}</p>
      ${(p.tags || []).length ? `<div class="m-tags">${p.tags.map(t => `<span class="m-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="m-prices">
        <span class="m-price">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="p-old">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="m-actions">
        <div class="qty" data-qty="${esc(p.id)}">
          <button type="button" data-step="-1" aria-label="Restar una unidad">−</button>
          <span data-val="1">1</span>
          <button type="button" data-step="1" aria-label="Sumar una unidad">+</button>
        </div>
        <button class="btn btn-primary" type="button" data-add-qty="${esc(p.id)}">Agregar al pedido</button>
      </div>
      ${rel.length ? `
      <div class="m-rel">
        <h3>De la misma categoría</h3>
        <div class="m-rel-list">
          ${rel.map(r => `
            <button class="m-rel-item" type="button" data-open="${esc(r.id)}">
              <img src="${esc(r.img)}" alt="" aria-hidden="true" width="1200" height="1200" loading="lazy" decoding="async">
              <span>${esc(r.nombre)}</span>
              <b>${formatearPrecio(precioFinal(r))}</b>
            </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;

  modal.setAttribute('aria-label', p.nombre);
  if (modal.hidden) modalPrev = document.activeElement;
  modal.hidden = false;
  back.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); back.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const back = document.getElementById('modal-backdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  back.classList.remove('open');
  setTimeout(() => { modal.hidden = true; back.hidden = true; }, 320);
  if (!document.getElementById('drawer')?.classList.contains('open')) document.body.style.overflow = '';
  modalPrev?.focus();
  modalPrev = null;
}

/* ---------- Drawer ---------- */
let drawerPrev = null;

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const back = document.getElementById('drawer-backdrop');
  if (!drawer || drawer.classList.contains('open')) return;
  drawerPrev = document.activeElement;
  drawer.hidden = false;
  back.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); back.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  document.getElementById('drawer-close')?.focus();
  const items = drawer.querySelectorAll('.d-item');
  if (typeof gsap !== 'undefined' && items.length) {
    gsap.fromTo(items, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .42, ease: 'power2.out', stagger: .05 });
  }
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const back = document.getElementById('drawer-backdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  back.classList.remove('open');
  setTimeout(() => { drawer.hidden = true; back.hidden = true; }, 380);
  if (document.getElementById('modal')?.hidden !== false) document.body.style.overflow = '';
  drawerPrev?.focus();
  drawerPrev = null;
}

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const totalEl = document.getElementById('drawer-total');
  const foot = document.getElementById('drawer-foot');
  const ship = document.getElementById('drawer-ship');
  const shipMsg = document.getElementById('ship-msg');
  const shipFill = document.getElementById('ship-fill');
  const send = document.getElementById('drawer-send');
  if (!body) return;

  const items = Cart.get();
  const total = Cart.total();

  if (items.length === 0) {
    body.innerHTML = `
      <div class="d-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <b>Todavía no pediste nada</b>
        <p>Metele un lomito y volvé. Te esperamos con las papas listas.</p>
      </div>`;
    foot.hidden = true;
    ship.hidden = true;
  } else {
    foot.hidden = false;
    ship.hidden = false;
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      const sub = precioFinal(p) * i.qty;
      return `
      <div class="d-item" data-id="${esc(p.id)}">
        ${p.img
          ? `<img src="${esc(p.img)}" alt="" aria-hidden="true" width="1200" height="1200" loading="lazy" decoding="async">`
          : `<span class="d-thumb" aria-hidden="true">${esc(p.nombre.charAt(0))}</span>`}
        <div class="d-info">
          <b>${esc(p.nombre)}</b>
          <div class="qty">
            <button type="button" data-dstep="-1" data-id="${esc(p.id)}" aria-label="Restar una unidad de ${esc(p.nombre)}">−</button>
            <span>${i.qty}</span>
            <button type="button" data-dstep="1" data-id="${esc(p.id)}" aria-label="Sumar una unidad de ${esc(p.nombre)}">+</button>
          </div>
        </div>
        <div class="d-side">
          <b>${formatearPrecio(sub)}</b>
          <button type="button" class="d-del" data-del="${esc(p.id)}">Quitar</button>
        </div>
      </div>`;
    }).join('');
  }

  totalEl.textContent = formatearPrecio(total);

  const falta = NEGOCIO.envioGratisDesde - total;
  if (falta > 0) {
    ship.classList.remove('done');
    shipMsg.textContent = `Te faltan ${formatearPrecio(falta)} para el envío sin cargo`;
    shipFill.style.width = `${Math.min(100, (total / NEGOCIO.envioGratisDesde) * 100)}%`;
  } else {
    ship.classList.add('done');
    shipMsg.textContent = '¡Listo! Tenés el envío sin cargo 🎉';
    shipFill.style.width = '100%';
  }

  if (send) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} x ${p.nombre} — ${formatearPrecio(precioFinal(p) * i.qty)}` : '';
    }).filter(Boolean);
    const msg = items.length
      ? `Hola! Quería hacer este pedido:\n\n${lineas.join('\n')}\n\nTotal: ${formatearPrecio(total)}\n\n¿Me confirman el tiempo de entrega?`
      : 'Hola! Quería hacer un pedido 🍔';
    send.setAttribute('href', waLink(msg));
    send.setAttribute('target', '_blank');
    send.setAttribute('rel', 'noopener');
  }
}

function actualizarBadge() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const n = Cart.count();
  el.textContent = n;
  el.classList.remove('bump');
  void el.offsetWidth;
  if (n > 0) el.classList.add('bump');
}

function initDrawer() {
  document.getElementById('cart-btn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', cerrarModal);
  document.getElementById('drawer-clear')?.addEventListener('click', () => {
    Cart.clear();
    showToast('Pedido vaciado');
  });

  document.getElementById('drawer-body')?.addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) { Cart.remove(del.dataset.del); return; }
    const step = e.target.closest('[data-dstep]');
    if (step) {
      const id = step.dataset.id;
      const actual = Cart.get().find(i => i.id === id);
      if (!actual) return;
      const n = actual.qty + parseInt(step.dataset.dstep, 10);
      if (n <= 0) Cart.remove(id); else Cart.setQty(id, n);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (document.getElementById('modal')?.hidden === false) cerrarModal();
      else cerrarDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('modal');
    const drawer = document.getElementById('drawer');
    const activo = modal?.hidden === false ? modal : (drawer?.classList.contains('open') ? drawer : null);
    if (!activo) return;
    const foco = activo.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    if (!foco.length) return;
    const primero = foco[0];
    const ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });

  document.addEventListener('cart:updated', () => { renderDrawer(); actualizarBadge(); });
}

/* ---------- Movimiento ---------- */
function initFallbackAnimaciones() {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
    el.style.clipPath = 'none';
  });
}

function initReveals() {
  const grupos = new Map();
  document.querySelectorAll('[data-animate]').forEach(el => {
    const key = el.parentElement;
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key).push(el);
  });

  grupos.forEach(els => {
    ScrollTrigger.create({
      trigger: els[0],
      start: 'top 88%',
      once: true,
      onEnter: () => els.forEach((el, i) => {
        const tipo = el.dataset.animate;
        const delay = i * .085;
        if (tipo === 'plancha') {
          gsap.to(el, { clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: 1.05, ease: 'power4.out', delay });
        } else if (tipo === 'mask') {
          gsap.to(el, { clipPath: 'inset(0% 0 0% 0)', opacity: 1, duration: 1.1, ease: 'power3.out', delay });
          const img = el.querySelector('img');
          if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.5, ease: 'power3.out', delay });
        } else {
          gsap.to(el, { y: 0, opacity: 1, duration: .85, ease: 'power3.out', delay });
        }
      }),
    });
  });
}

function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-blob', { scale: .78, opacity: 0, duration: 1.1 }, 0)
    .from('.hero-plate', { scale: 1.14, opacity: 0, duration: 1.1 }, .05)
    .from('.hero-chapa', { y: 18, opacity: 0, duration: .7 }, .15)
    .from('.hero-title .ln > span', { yPercent: 108, duration: .95, stagger: .09, ease: 'power4.out' }, .2)
    .from('.hero-star', { y: 54, scale: .9, opacity: 0, duration: 1.15, ease: 'back.out(1.25)' }, .3)
    .from('.hero-side', { x: 70, y: 20, opacity: 0, duration: .95 }, .6)
    .from('.hero-price', { scale: .68, rotate: -24, opacity: 0, duration: .8, ease: 'back.out(2)' }, .78)
    .from('.hero-tag', { y: 20, opacity: 0, duration: .6 }, .88)
    .from('.hero-sub', { y: 22, opacity: 0, duration: .8 }, .5)
    .from('.hero-cta > *', { y: 22, opacity: 0, duration: .7, stagger: .1 }, .62)
    .from('.hero-facts li', { y: 20, opacity: 0, duration: .7, stagger: .08 }, .78)
    .from('.hero-ghost', { opacity: 0, y: 40, duration: 1.2 }, .5);

  const escena = document.querySelector('.hero-scene');
  if (!escena || window.matchMedia('(hover: none)').matches) return;
  const capas = [
    { el: escena.querySelector('.hero-star'), f: 16 },
    { el: escena.querySelector('.hero-side'), f: 30 },
    { el: escena.querySelector('.hero-price'), f: 40 },
  ];
  escena.addEventListener('pointermove', e => {
    const r = escena.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - .5;
    const dy = (e.clientY - r.top) / r.height - .5;
    capas.forEach(c => {
      if (!c.el) return;
      gsap.to(c.el, { x: dx * c.f, y: dy * c.f, duration: .9, ease: 'power2.out', overwrite: 'auto' });
    });
  });
  escena.addEventListener('pointerleave', () => {
    capas.forEach(c => c.el && gsap.to(c.el, { x: 0, y: 0, duration: .9, ease: 'power2.out' }));
  });
}

function initDespiece() {
  const seccion = document.querySelector('.despiece');
  const numEl = document.getElementById('despiece-num');
  if (!seccion) return;

  const estatico = () => {
    seccion.classList.add('despiece-static');
    if (numEl) numEl.textContent = '7';
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !gsap.matchMedia) { estatico(); return; }

  const mm = gsap.matchMedia();
  mm.add({ ancho: '(min-width: 1081px)', reduce: '(prefers-reduced-motion: reduce)' }, ctx => {
    const { ancho, reduce } = ctx.conditions;
    if (!ancho || reduce) { estatico(); return; }
    seccion.classList.remove('despiece-static');

    const capas = gsap.utils.toArray('.dl');
    const contador = { v: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: seccion,
        start: 'top top',
        end: '+=190%',
        pin: '.despiece-sticky',
        scrub: .7,
        invalidateOnRefresh: true,
      },
    });

    tl.to(capas, {
      y: (i, el) => parseFloat(el.style.getPropertyValue('--dy')) || 0,
      duration: 1,
      ease: 'power2.out',
      stagger: .05,
    }, 0)
      .to(contador, {
        v: 7,
        duration: 1,
        snap: { v: 1 },
        onUpdate: () => { if (numEl) numEl.textContent = Math.round(contador.v); },
      }, .1)
      .to('.dl .lead', { strokeDashoffset: 0, duration: .55, ease: 'power2.out', stagger: .05 }, .45)
      .to('.dl .tag', { opacity: 1, duration: .35, stagger: .05 }, .5)
      .to({}, { duration: .7 })
      .to('.dl .tag', { opacity: 0, duration: .28, stagger: { each: .03, from: 'end' } })
      .to('.dl .lead', { strokeDashoffset: 130, duration: .3, stagger: { each: .03, from: 'end' } }, '<')
      .to(capas, { y: 0, duration: .6, ease: 'power3.inOut' }, '<.12')
      .to(contador, {
        v: 0,
        duration: .5,
        snap: { v: 1 },
        onUpdate: () => { if (numEl) numEl.textContent = Math.round(contador.v); },
      }, '<');

    return () => { gsap.set(capas, { clearProps: 'transform' }); };
  });
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initDevToolsGuard();
  initWspFloat();
  initWaLinks();
  initHeader();
  initFuse();
  renderCategorias();
  renderPicks();
  renderRibbon();
  renderChips();
  initCartaTools();
  initAcciones();
  initDrawer();
  renderGrid(false);
  renderDrawer();
  actualizarBadge();

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initHero();
    initReveals();
    initDespiece();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  } else {
    initFallbackAnimaciones();
    initDespiece();
  }
});
