const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WSP = '5493875949218';
const ENVIO_GRATIS_DESDE = 80000;

const PRODUCTOS = [
  {
    id: 'mochila-cafayate', nombre: 'Mochila Cafayate', cat: 'mochilas', precio: 86900, descuento: 0,
    badge: 'Más vendida', img: 'images/mochila-urbana_1254x1254.webp',
    desc: 'La mochila urbana de la temporada: tapa curva con cierre oculto, bolsillo frontal amplio y tiradores regulables. Entra una notebook de 14" con lugar de sobra.',
    feats: ['Símil cuero graneado con ribete rojo', 'Interior forrado en rojo, con bolsillo con cierre', 'Tiradores acolchados regulables', 'Herrajes metálicos dorados'],
  },
  {
    id: 'bolso-cachi', nombre: 'Bolso de viaje Cachi', cat: 'bolsos', precio: 109000, descuento: 0,
    badge: '', img: 'images/bolso-de-viaje_1254x1254.webp',
    desc: 'El compañero de escapadas: boca ancha con doble cierre, base firme y correa desmontable al hombro. Rinde igual en un finde en los Valles que en el gimnasio.',
    feats: ['Capacidad para 2-3 días de viaje', 'Doble manija + correa desmontable', 'Base reforzada con apoyos', 'Etiqueta identificadora de la casa'],
  },
  {
    id: 'tote-molinos', nombre: 'Tote Molinos', cat: 'carteras', precio: 74900, descuento: 20,
    badge: '', img: 'images/bolso-tote_1254x1254.webp',
    desc: 'La tote de todos los días: liviana, de boca abierta con cierre magnético y el interior rojo que la delata cuando la abrís. Va del trabajo al mercado sin cambiarse.',
    feats: ['Interior rojo con bolsillo organizador', 'Cierre magnético central', 'Manijas de caída media para el hombro', 'Dije etiqueta de la casa'],
  },
  {
    id: 'cartera-payogasta', nombre: 'Cartera Payogasta', cat: 'carteras', precio: 82500, descuento: 0,
    badge: 'Nueva', img: 'images/cartera-estructurada_1254x1254.webp',
    desc: 'Estructurada, prolija, de las que sostienen un look entero. Frente con tablas cosidas, herraje en T y espacio real adentro: billetera, neceser y algo más.',
    feats: ['Cuerpo estructurado que no se deforma', 'Frente con tablas cosidas a la vista', 'Interior rojo con tres divisiones', 'Herraje frontal en T'],
  },
  {
    id: 'hobo-angastaco', nombre: 'Bolso hobo Angastaco', cat: 'bolsos', precio: 69900, descuento: 0,
    badge: '', img: 'images/bolso-hobo_1254x1254.webp',
    desc: 'Relajado y con caída, se frunce con lazo y borla al tono. Es el bolso que se amolda a lo que lleves — y el rojo del interior asoma justo lo necesario.',
    feats: ['Cierre fruncido con lazo y borla', 'Correa ancha para el hombro', 'Interior rojo de gran capacidad', 'Peso pluma: ideal uso diario'],
  },
  {
    id: 'bandolera-iruya', nombre: 'Bandolera Iruya', cat: 'carteras', precio: 54900, descuento: 0,
    badge: '', img: 'images/bandolera_1254x1254.webp',
    desc: 'Chica por fuera, rendidora por dentro: tres compartimentos, correa regulable y el ribete rojo recorriendo el cierre. Manos libres para todo el día.',
    feats: ['Tres compartimentos con cierre', 'Correa regulable con hebilla dorada', 'Ribete rojo en todo el contorno', 'Entra celular, billetera y llaves'],
  },
  {
    id: 'billetera-la-caldera', nombre: 'Billetera La Caldera', cat: 'accesorios', precio: 32900, descuento: 0,
    badge: '', img: 'images/billetera-con-cierre_460x460.webp',
    desc: 'Billetera larga con cierre perimetral: doce tarjeteros, dos billeteras y monedero al centro. Del mismo azul y la misma costura que el resto de la colección.',
    feats: ['Cierre perimetral con tirador', 'Doce ranuras para tarjetas', 'Monedero central con cierre', 'Combina con toda la línea Valles'],
  },
  {
    id: 'tarjetero-vaqueros', nombre: 'Tarjetero Vaqueros', cat: 'accesorios', precio: 18900, descuento: 0,
    badge: '', img: 'images/tarjetero_335x335.webp',
    desc: 'Para salir liviano: seis ranuras, bolsillo central para billetes doblados y un tamaño que desaparece en el bolsillo. El regalo que nunca falla.',
    feats: ['Seis ranuras + bolsillo central', 'Formato compacto de bolsillo', 'Costura reforzada en los bordes', 'Ideal para regalar'],
  },
];

const CATEGORIAS = [
  { id: 'todas', nombre: 'Todo' },
  { id: 'mochilas', nombre: 'Mochilas' },
  { id: 'carteras', nombre: 'Carteras' },
  { id: 'bolsos', nombre: 'Bolsos' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

const Cart = {
  KEY: 'innata_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

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

const state = { cat: 'todas', q: '' };

function filtrarProductos() {
  const q = normalizar(state.q.trim());
  return PRODUCTOS.filter(p => {
    if (state.cat !== 'todas' && p.cat !== state.cat) return false;
    if (!q) return true;
    const hay = normalizar([p.nombre, nombreCat(p.cat), p.desc, (p.feats || []).join(' ')].join(' '));
    return q.split(/\s+/).every(t => hay.includes(t));
  });
}

function cardHTML(p) {
  const final = precioFinal(p);
  const off = p.descuento > 0;
  const badge = off ? `-${p.descuento}%` : p.badge;
  return `
  <article class="prod-card" data-id="${p.id}">
    <div class="prod-media">
      ${badge ? `<span class="prod-badge${off ? ' off' : ''}">${esc(badge)}</span>` : ''}
      <img src="${p.img}" alt="${esc(p.nombre)} en azul Francia con ribete rojo" width="600" height="600" loading="lazy">
      <button type="button" class="quick-btn" data-quick="${p.id}">Vista rápida</button>
    </div>
    <div class="prod-body">
      <span class="prod-cat">${esc(nombreCat(p.cat))}</span>
      <h3 class="prod-name"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">
        <span>${formatearPrecio(final)}</span>
        ${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <span class="qty-step" data-qty-widget>
          <button type="button" data-qty="-1" aria-label="Restar cantidad">−</button>
          <output aria-label="Cantidad">1</output>
          <button type="button" data-qty="1" aria-label="Sumar cantidad">+</button>
        </span>
        <span class="btns">
          <button type="button" class="btn-add" data-add="${p.id}">Agregar al carrito</button>
          <button type="button" class="btn-buy" data-buy="${p.id}">Comprar ahora</button>
        </span>
      </div>
    </div>
  </article>`;
}

function renderGrid(animar = true) {
  const grid = document.getElementById('prodGrid');
  const meta = document.getElementById('shopMeta');
  if (!grid) return;
  const items = filtrarProductos();
  if (!items.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <h3>Acá no hay nada… todavía</h3>
        <p>Probá con otra palabra o mirá la colección completa.</p>
        <button type="button" class="btn btn-primary" id="btnLimpiarEmpty">Ver todo</button>
      </div>`;
    document.getElementById('btnLimpiarEmpty')?.addEventListener('click', limpiarFiltros);
  } else {
    grid.innerHTML = items.map(cardHTML).join('');
  }
  if (meta) {
    const activo = state.cat !== 'todas' || state.q.trim();
    meta.innerHTML = `<span>${items.length} ${items.length === 1 ? 'producto' : 'productos'}</span>` +
      (activo ? `<button type="button" id="btnLimpiar">Limpiar filtros</button>` : '');
    document.getElementById('btnLimpiar')?.addEventListener('click', limpiarFiltros);
  }
  if (animar && !reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo(grid.children, { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out', overwrite: 'auto', clearProps: 'opacity,transform' });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function limpiarFiltros() {
  state.cat = 'todas';
  state.q = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'todas'));
  renderGrid(true);
}

function initShop() {
  const chipsWrap = document.getElementById('chips');
  if (chipsWrap) {
    chipsWrap.innerHTML = CATEGORIAS.map(c =>
      `<button type="button" class="chip${c.id === 'todas' ? ' active' : ''}" data-cat="${c.id}">${esc(c.nombre)}</button>`).join('');
    chipsWrap.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.cat = chip.dataset.cat;
      chipsWrap.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
      renderGrid(true);
    });
  }
  const input = document.getElementById('searchInput');
  if (input) {
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { state.q = input.value; renderGrid(true); }, 140);
    });
  }
  const grid = document.getElementById('prodGrid');
  grid?.addEventListener('click', e => {
    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const out = qtyBtn.closest('[data-qty-widget]').querySelector('output');
      out.textContent = Math.max(1, Math.min(9, parseInt(out.textContent, 10) + parseInt(qtyBtn.dataset.qty, 10)));
      return;
    }
    const addBtn = e.target.closest('[data-add]');
    const buyBtn = e.target.closest('[data-buy]');
    if (addBtn || buyBtn) {
      const id = (addBtn || buyBtn).dataset.add || (addBtn || buyBtn).dataset.buy;
      const p = getProducto(id);
      if (!p) return;
      const card = e.target.closest('.prod-card');
      const qty = parseInt(card?.querySelector('[data-qty-widget] output')?.textContent || '1', 10);
      Cart.add(p, qty);
      if (buyBtn) { abrirDrawer(); }
      else { showToast(`¡${p.nombre} agregado! Tu carrito te espera.`); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirModal(quick.dataset.quick); return; }
    const media = e.target.closest('.prod-media');
    if (media) {
      const id = media.closest('.prod-card')?.dataset.id;
      if (id) abrirModal(id);
    }
  });
  document.querySelectorAll('[data-goto-cat]').forEach(el => {
    el.addEventListener('click', () => {
      state.cat = el.dataset.gotoCat;
      document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === state.cat));
      renderGrid(false);
      document.getElementById('productos')?.scrollIntoView();
    });
  });
  renderGrid(false);
}

let lastFocusModal = null;
let modalQty = 1;
let modalProdId = null;

function trapFocus(container, e) {
  const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickModal');
  const panel = modal?.querySelector('.quick-panel');
  if (!p || !modal || !panel) return;
  modalQty = 1;
  const final = precioFinal(p);
  const off = p.descuento > 0;
  const badge = off ? `-${p.descuento}%` : p.badge;
  const rel = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat).concat(PRODUCTOS.filter(x => x.id !== p.id && x.cat !== p.cat)).slice(0, 3);
  panel.innerHTML = `
    <button type="button" class="modal-close" data-close-modal aria-label="Cerrar vista rápida">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    <div class="qp-media">
      ${badge ? `<span class="prod-badge${off ? ' off' : ''}">${esc(badge)}</span>` : ''}
      <img src="${p.img}" alt="${esc(p.nombre)} en azul Francia con ribete rojo" width="600" height="600">
    </div>
    <div class="qp-info">
      <span class="prod-cat">${esc(nombreCat(p.cat))} · Colección Valles</span>
      <h2 id="quickTitle">${esc(p.nombre)}</h2>
      <p class="qp-price"><span>${formatearPrecio(final)}</span>${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="qp-desc">${esc(p.desc)}</p>
      <ul class="qp-feats">${(p.feats || []).map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      <div class="qp-actions">
        <span class="qty-step" data-qty-widget>
          <button type="button" data-mqty="-1" aria-label="Restar cantidad">−</button>
          <output aria-label="Cantidad">1</output>
          <button type="button" data-mqty="1" aria-label="Sumar cantidad">+</button>
        </span>
        <span class="btns">
          <button type="button" class="btn-add" data-madd>Agregar al carrito</button>
          <button type="button" class="btn-buy" data-mbuy>Comprar ahora</button>
        </span>
      </div>
      ${rel.length ? `
      <div class="qp-related">
        <h3>También te puede interesar</h3>
        <div class="qp-rel-grid">
          ${rel.map(r => `
            <button type="button" class="qp-rel-card" data-rel="${r.id}">
              <img src="${r.img}" alt="${esc(r.nombre)}" width="200" height="200" loading="lazy">
              <span>${esc(r.nombre)}</span>
              <em>${formatearPrecio(precioFinal(r))}</em>
            </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  modalProdId = p.id;
  if (!modal.classList.contains('open')) lastFocusModal = document.activeElement;
  modal.classList.add('open');
  modal.removeAttribute('inert');
  document.getElementById('modalBackdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  panel.querySelector('.modal-close')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('quickModal');
  if (!modal || !modal.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('inert', '');
  document.getElementById('modalBackdrop')?.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  lastFocusModal?.focus?.();
}

let lastFocusDrawer = null;

function renderDrawer() {
  const items = Cart.get();
  const list = document.getElementById('drawerItems');
  const foot = document.getElementById('drawerFoot');
  const ship = document.getElementById('shipBar');
  const count = document.getElementById('cartCount');
  if (count) {
    const n = Cart.count();
    count.textContent = n;
    count.style.display = n ? 'grid' : 'none';
  }
  if (!list || !foot || !ship) return;
  if (!items.length) {
    ship.style.display = 'none';
    list.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>
        <h3>Tu carrito está vacío</h3>
        <p>El azul Francia te está esperando en la colección.</p>
        <button type="button" class="btn btn-primary" data-close-drawer-goto>Ver la colección</button>
      </div>`;
    foot.style.display = 'none';
    return;
  }
  ship.style.display = '';
  const total = Cart.total();
  const falta = ENVIO_GRATIS_DESDE - total;
  ship.classList.toggle('done', falta <= 0);
  ship.innerHTML = (falta > 0
    ? `Te faltan <strong>${formatearPrecio(falta)}</strong> para el envío gratis`
    : `¡Tenés <strong>envío gratis</strong>! 🎉`) +
    `<div class="ship-track"><div class="ship-fill" style="width:${Math.min(100, Math.round(total / ENVIO_GRATIS_DESDE * 100))}%"></div></div>`;
  list.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
    <div class="cart-item" data-id="${p.id}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="72" height="72">
      <div>
        <h3>${esc(p.nombre)}</h3>
        <p class="ci-price">${formatearPrecio(precioFinal(p))}</p>
        <span class="ci-qty">
          <button type="button" data-cqty="-1" aria-label="Restar cantidad">−</button>
          <output>${i.qty}</output>
          <button type="button" data-cqty="1" aria-label="Sumar cantidad">+</button>
        </span>
      </div>
      <button type="button" class="ci-remove" data-cremove aria-label="Quitar ${esc(p.nombre)} del carrito">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
      </button>
    </div>`;
  }).join('');
  foot.style.display = '';
  const lineas = items.map(i => { const p = getProducto(i.id); return p ? `• ${p.nombre} x${i.qty} — ${formatearPrecio(precioFinal(p) * i.qty)}` : ''; }).filter(Boolean);
  const wspMsg = encodeURIComponent(['Hola Innat@! Quiero hacer este pedido:', ...lineas, `Total: ${formatearPrecio(total)}`].join('\n'));
  foot.innerHTML = `
    <p class="drawer-total"><span>Total</span><span class="amount">${formatearPrecio(total)}</span></p>
    <button type="button" class="btn btn-cta" id="btnCheckout">Finalizar compra</button>
    <a class="btn btn-wsp" href="https://wa.me/${WSP}?text=${wspMsg}" target="_blank" rel="noopener">
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>
    Pedir por WhatsApp</a>`;
  document.getElementById('btnCheckout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (typeof confetti !== 'undefined' && !reduceMotion) {
      confetti({ particleCount: 90, spread: 68, origin: { y: 0.75 }, colors: ['#002fa7', '#c8102e', '#ffffff'] });
    }
  });
}

function abrirDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  lastFocusDrawer = document.activeElement;
  renderDrawer();
  drawer.classList.add('open');
  drawer.removeAttribute('inert');
  document.getElementById('drawerBackdrop')?.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('.drawer-close')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.getElementById('drawerBackdrop')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
  lastFocusDrawer?.focus?.();
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  const drawer = document.getElementById('cartDrawer');
  drawer?.addEventListener('click', e => {
    if (e.target.closest('.drawer-close')) { cerrarDrawer(); return; }
    if (e.target.closest('[data-close-drawer-goto]')) {
      cerrarDrawer();
      document.getElementById('productos')?.scrollIntoView();
      return;
    }
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = item.dataset.id;
    const q = e.target.closest('[data-cqty]');
    if (q) {
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + parseInt(q.dataset.cqty, 10));
      return;
    }
    if (e.target.closest('[data-cremove]')) Cart.remove(id);
  });
  document.addEventListener('cart:updated', () => {
    renderDrawer();
    const count = document.getElementById('cartCount');
    if (count) { count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump'); }
  });
  renderDrawer();
}

function initModal() {
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  const panel = document.querySelector('#quickModal .quick-panel');
  panel?.addEventListener('click', e => {
    const p = getProducto(modalProdId);
    if (!p) return;
    const q = e.target.closest('[data-mqty]');
    if (q) {
      modalQty = Math.max(1, Math.min(9, modalQty + parseInt(q.dataset.mqty, 10)));
      const out = panel.querySelector('[data-qty-widget] output');
      if (out) out.textContent = modalQty;
      return;
    }
    if (e.target.closest('[data-madd]')) { Cart.add(p, modalQty); showToast(`¡${p.nombre} agregado! Tu carrito te espera.`); return; }
    if (e.target.closest('[data-mbuy]')) { Cart.add(p, modalQty); cerrarModal(); abrirDrawer(); return; }
    const relBtn = e.target.closest('[data-rel]');
    if (relBtn) { abrirModal(relBtn.dataset.rel); return; }
    if (e.target.closest('[data-close-modal]')) cerrarModal();
  });
}

function initEscYTrap() {
  document.addEventListener('keydown', e => {
    const modal = document.getElementById('quickModal');
    const drawer = document.getElementById('cartDrawer');
    const modalOpen = modal?.classList.contains('open');
    const drawerOpen = drawer?.classList.contains('open');
    if (e.key === 'Escape') {
      if (modalOpen) cerrarModal();
      else if (drawerOpen) cerrarDrawer();
      return;
    }
    if (e.key === 'Tab') {
      if (modalOpen) trapFocus(modal, e);
      else if (drawerOpen) trapFocus(drawer, e);
    }
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  const header = document.querySelector('.site-header');
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
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-copy .eyebrow', { y: 24, opacity: 0, duration: 0.7 })
    .from('.hero-copy h1', { y: 46, opacity: 0, duration: 1 }, 0.08)
    .from('.hero-sub', { y: 30, opacity: 0, duration: 0.9 }, 0.22)
    .from('.hero-copy .hero-ctas .btn', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.36)
    .from('.hero-note', { opacity: 0, duration: 0.7 }, 0.55)
    .from('.hero-field', { scale: 0.9, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.1)
    .from('.hero-cut-main', { y: 90, rotate: -10, opacity: 0, duration: 1.2, ease: 'back.out(1.4)' }, 0.35)
    .from('.hero-cut-a', { y: -60, rotate: 8, opacity: 0, duration: 1 }, 0.55)
    .from('.hero-cut-b', { x: -60, opacity: 0, duration: 1 }, 0.65)
    .from('.hero-tag', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, 0.85)
    .from('.hero-seal', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(2)' }, 0.95);

  const heroThread = document.querySelector('.hero-copy .thread path');
  if (heroThread) {
    const len = heroThread.getTotalLength();
    gsap.fromTo(heroThread, { strokeDasharray: '11 8', strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.9 });
  }

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const scene = document.querySelector('.hero-scene');
    if (scene) {
      const capas = [
        { el: scene.querySelector('.hero-cut-main'), f: 14 },
        { el: scene.querySelector('.hero-cut-a'), f: 26 },
        { el: scene.querySelector('.hero-cut-b'), f: 20 },
        { el: scene.querySelector('.hero-tag'), f: 32 },
      ].filter(c => c.el);
      scene.addEventListener('mousemove', e => {
        const r = scene.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        capas.forEach(c => gsap.to(c.el, { x: dx * c.f, y: dy * c.f, duration: 0.6, ease: 'power2.out' }));
      });
      scene.addEventListener('mouseleave', () => {
        capas.forEach(c => gsap.to(c.el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)' }));
      });
    }
  }
}

function initStitches() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  document.querySelectorAll('.stitch-under path').forEach(path => {
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDashoffset: len }, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: path.closest('.section-head') || path, start: 'top 82%', end: 'top 45%', scrub: 0.6 },
    });
  });
}

function railProdHTML(p) {
  const final = precioFinal(p);
  const off = p.descuento > 0;
  const badge = off ? `-${p.descuento}%` : p.badge;
  return `
  <button type="button" class="rail-prod" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
    <span class="rp-media">
      ${badge ? `<span class="prod-badge${off ? ' off' : ''}">${esc(badge)}</span>` : ''}
      <img src="${p.img}" alt="${esc(p.nombre)} en azul Francia con ribete rojo" width="600" height="600" loading="lazy">
      <span class="rp-go">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
      </span>
    </span>
    <span class="rp-body">
      <span class="rp-cat">${esc(nombreCat(p.cat))}</span>
      <span class="rp-name">${esc(p.nombre)}</span>
      <span class="rp-price">${formatearPrecio(final)}${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>
    </span>
  </button>`;
}

function initRailProductos() {
  const marker = document.getElementById('railProds');
  if (!marker) return;
  const track = marker.parentElement;
  const frag = document.createRange().createContextualFragment(PRODUCTOS.map(railProdHTML).join(''));
  track.insertBefore(frag, marker);
  marker.remove();
  track.addEventListener('click', e => {
    const card = e.target.closest('.rail-prod');
    if (card) abrirModal(card.dataset.quick);
  });
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
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      vp.setPointerCapture?.(pointerId);
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      vp.releasePointerCapture?.(pointerId);
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

function initRail() {
  const vp = document.querySelector('.hscroll');
  if (vp) {
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
  }
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
    const word = document.querySelector('.rail-word');
    if (word) {
      gsap.fromTo(word, { xPercent: 4 }, {
        xPercent: -18, ease: 'none',
        scrollTrigger: { trigger: '.rail-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    }
  }
}

function initChapters() {
  const caps = document.querySelectorAll('.chapter');
  if (!caps.length) return;
  const visual = document.querySelector('.chapters-visual');
  const num = document.getElementById('chapterNum');
  const label = document.getElementById('chapterLabel');
  if (window.matchMedia('(max-width: 900px)').matches) {
    caps.forEach(c => c.classList.add('is-active'));
    return;
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    caps.forEach(c => c.classList.remove('is-active'));
    e.target.classList.add('is-active');
    if (visual) visual.dataset.cap = e.target.dataset.cap;
    if (num && label && !reduceMotion && typeof gsap !== 'undefined') {
      gsap.fromTo([num, label], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    }
    if (num) num.textContent = e.target.dataset.cap;
    if (label) label.textContent = e.target.dataset.label;
  }), { threshold: 0.55 });
  caps.forEach(c => io.observe(c));
}

function initSplitTitles() {
  if (typeof gsap === 'undefined' || typeof window.SplitText === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.registerPlugin(window.SplitText);
  document.querySelectorAll('.split-title').forEach(el => {
    const split = window.SplitText.create(el, { type: 'lines', mask: 'lines' });
    gsap.from(split.lines, {
      yPercent: 110, duration: 1, stagger: 0.09, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initShop();
initDrawer();
initModal();
initEscYTrap();
initNav();
initWspFloat();
initReveals();
initHero();
initStitches();
initRailProductos();
initRail();
initChapters();
initSplitTitles();
