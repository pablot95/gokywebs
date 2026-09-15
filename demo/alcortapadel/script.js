'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'paletas', nombre: 'Paletas' },
  { id: 'pelotas', nombre: 'Pelotas' },
  { id: 'cubregrips', nombre: 'Cubregrips' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const PRODUCTOS = [
  { id: 'pal-diamante-3k', cat: 'paletas', nombre: 'Paleta AP Carbono 3K Diamante', precio: 486000, descuento: 0, badge: 'Nuevo', destacado: true, img: 'images/paleta-padel-negra_1x1.webp', desc: 'Carbono 3K en las caras, goma EVA de densidad media-alta y balance alto: la salida de bola que pide el remate. Para jugadores de ataque que definen de tres.', specs: ['Forma diamante', 'Carbono 3K', '365 g', 'Avanzado'], tags: 'potencia remate atacante carbono diamante avanzada' },
  { id: 'pal-redonda-eva', cat: 'paletas', nombre: 'Paleta AP Redonda Eva Soft', precio: 342000, descuento: 0, destacado: true, img: 'images/coleccion-paletas-padel_1x1.webp', desc: 'Punto dulce enorme y goma EVA blanda que perdona todo. Control absoluto para armar el punto sin regalar errores: la elegida de los que juegan de fondo.', specs: ['Forma redonda', 'Fibra + EVA soft', '355 g', 'Control'], tags: 'control redonda comoda punto dulce fondo defensa' },
  { id: 'pal-lagrima-hibrida', cat: 'paletas', nombre: 'Paleta AP Lágrima Híbrida', precio: 398000, descuento: 10, destacado: true, img: 'images/paleta-padel-negra_1x1.webp', desc: 'El balance justo: defendés cómodo y, cuando aparece la corta, tenés con qué lastimar. La forma que más jugadores acompaña, en versión carbono + fibra.', specs: ['Forma lágrima', 'Híbrida carbono', '360 g', 'Polivalente'], tags: 'lagrima polivalente intermedio balance hibrida' },
  { id: 'pal-iniciacion-fibra', cat: 'paletas', nombre: 'Paleta AP Iniciación Fibra', precio: 168000, descuento: 0, destacado: true, img: 'images/coleccion-paletas-padel_1x1.webp', desc: 'Tu primera paleta en serio: fibra de vidrio liviana, punto dulce generoso y un precio que no asusta. Ideal para arrancar con material noble.', specs: ['Forma redonda', 'Fibra de vidrio', '350 g', 'Iniciación'], tags: 'iniciacion principiante primera paleta liviana economica' },
  { id: 'pal-pro-tour-12k', cat: 'paletas', nombre: 'Paleta AP Pro Tour 12K', precio: 545000, descuento: 0, img: 'images/paleta-padel-negra_1x1.webp', desc: 'La tope de gama: carbono 12K, rugosidad 3D para dar efecto y núcleo EVA de alta recuperación. La que llevan los que compiten todos los fines de semana.', specs: ['Forma diamante', 'Carbono 12K', '370 g', 'Competición'], tags: 'pro tour competicion 12k rugosa efecto tope de gama' },
  { id: 'pal-black-rugosa', cat: 'paletas', nombre: 'Paleta AP Black Rugosa', precio: 462000, descuento: 15, img: 'images/coleccion-paletas-padel_1x1.webp', desc: 'Cara rugosa para morder la bola en cada golpe cortado. Lágrima de carbono con estética total black y detalles amarillos, como debe ser.', specs: ['Forma lágrima', 'Carbono rugoso', '362 g', 'Intermedio+'], tags: 'rugosa efecto negra black lagrima cortado' },
  { id: 'pel-tubo-x3', cat: 'pelotas', nombre: 'Tubo AP Premium x3 presurizadas', precio: 19800, descuento: 0, destacado: true, img: 'images/tubo-pelotas-padel_1x1.webp', desc: 'Tubo sellado de 3 pelotas presurizadas con bote parejo y fieltro resistente. El pique que esperás desde el primer game hasta el tie-break.', specs: ['Tubo x3', 'Presurizadas', 'Bote parejo'], tags: 'pelota tubo presurizada bote partido' },
  { id: 'pel-pack-2-tubos', cat: 'pelotas', nombre: 'Pack 2 tubos AP Premium (6 pelotas)', precio: 37500, descuento: 0, img: 'images/pelotas-y-paleta-padel_1x1.webp', desc: 'Dos tubos sellados para que el partido del sábado no dependa de la pelota muerta del fondo del bolso. Rinde para semanas de juego.', specs: ['2 tubos x3', 'Presurizadas', 'Ahorro por pack'], tags: 'pack tubos pelotas ahorro seis' },
  { id: 'pel-training-x12', cat: 'pelotas', nombre: 'Pelotas AP Training bolsa x12', precio: 68400, descuento: 0, img: 'images/pelotas-y-paleta-padel_1x1.webp', desc: 'Docena de pelotas de entrenamiento con fieltro reforzado: para el canasto, las clases y los drills de volea. Aguantan cancha de cemento sin despeinarse.', specs: ['Bolsa x12', 'Entrenamiento', 'Fieltro reforzado'], tags: 'training entrenamiento canasto clases docena profesor' },
  { id: 'grip-x3-negro-amarillo', cat: 'cubregrips', nombre: 'Cubregrips AP x3 negro y amarillo', precio: 9900, descuento: 0, destacado: true, img: 'images/cubregrips-negros-amarillos_1x1.webp', desc: 'Pack de 3 cubregrips perforados con los colores de la casa. Absorción real de sudor y tacto seco hasta en el quinto set.', specs: ['Pack x3', 'Perforados', 'Alta absorción'], tags: 'cubregrip overgrip pack sudor amarillo negro' },
  { id: 'grip-pro-perforado', cat: 'cubregrips', nombre: 'Cubregrip AP Pro perforado', precio: 4300, descuento: 0, img: 'images/cubregrips-negros-amarillos_1x1.webp', desc: 'El cubregrip que usan los que no negocian el tacto: perforado, fino y con adherencia pareja de punta a punta. Cambialo seguido, tu muñeca lo nota.', specs: ['Unidad', 'Perforado', 'Tacto fino'], tags: 'cubregrip unidad perforado pro tacto' },
  { id: 'grip-x6-mix', cat: 'cubregrips', nombre: 'Overgrips AP x6 mix', precio: 18200, descuento: 10, img: 'images/cubregrips-negros-amarillos_1x1.webp', desc: 'Seis overgrips surtidos en negro, amarillo y moteado. Para los que cambian el grip como cábala antes de cada torneo.', specs: ['Pack x6', 'Colores mix', 'Perforados'], tags: 'overgrip mix surtido pack seis torneo cabala' },
  { id: 'acc-paletero-termico', cat: 'accesorios', nombre: 'Paletero AP Térmico', precio: 158000, descuento: 0, destacado: true, img: 'images/equipamiento-padel-premium_5x3.webp', desc: 'Paletero con compartimento térmico para 2 paletas, calzado separado y bolsillo seco. Detalles en amarillo y espalda acolchada para ir en bici a la cancha.', specs: ['Térmico', '2 paletas', 'Porta calzado'], tags: 'paletero bolso termico mochila equipamiento' },
  { id: 'acc-kit-completo', cat: 'accesorios', nombre: 'Kit AP Completo', precio: 598000, descuento: 10, destacado: true, img: 'images/kit-completo-padel_1x1.webp', desc: 'Todo lo que necesitás para entrar a la cancha: paleta híbrida, tubo de pelotas, 3 cubregrips y bolso con cordón. El regalo que no falla — ni para vos.', specs: ['Paleta + tubo', '3 cubregrips', 'Bolso incluido'], tags: 'kit completo combo regalo inicio equipo' },
];

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';

const Cart = {
  KEY: 'alcortapadel_cart',
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

/* ---------- Render de cards ---------- */
function cardHTML(p) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="prod-badge">-${p.descuento}%</span>`
    : (p.badge ? `<span class="prod-badge is-new">${esc(p.badge)}</span>` : '');
  return `
  <article class="prod-card" data-id="${esc(p.id)}">
    <div class="prod-media" data-open="${esc(p.id)}" role="button" tabindex="0" aria-label="Ver detalle de ${esc(p.nombre)}">
      ${badge}
      <img src="${esc(p.img)}" alt="${esc(p.nombre)}" loading="lazy" width="600" height="600">
      <span class="prod-quick">Vista rápida</span>
    </div>
    <div class="prod-info">
      <span class="prod-cat">${esc(catNombre(p.cat))}</span>
      <h3 class="prod-name" data-open="${esc(p.id)}">${esc(p.nombre)}</h3>
      <p class="prod-price">
        <b>${formatearPrecio(final)}</b>
        ${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}
      </p>
      <div class="prod-actions">
        <span class="stepper" data-stepper>
          <button type="button" data-minus aria-label="Restar una unidad">−</button>
          <output aria-live="polite">1</output>
          <button type="button" data-plus aria-label="Sumar una unidad">+</button>
        </span>
        <button type="button" class="btn-add" data-add="${esc(p.id)}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
          Agregar
        </button>
      </div>
    </div>
  </article>`;
}

function bindCardActions(root) {
  $$('[data-stepper]', root).forEach(st => {
    const out = $('output', st);
    $('[data-minus]', st)?.addEventListener('click', () => { out.textContent = Math.max(1, +out.textContent - 1); });
    $('[data-plus]', st)?.addEventListener('click', () => { out.textContent = Math.min(99, +out.textContent + 1); });
  });
  $$('[data-add]', root).forEach(btn => {
    btn.addEventListener('click', () => {
      const p = getProducto(btn.dataset.add); if (!p) return;
      const qty = +($('output', btn.closest('.prod-actions'))?.textContent || 1);
      Cart.add(p, qty);
      showToast(`¡Agregado! ${p.nombre} espera en tu carrito.`);
    });
  });
  $$('[data-open]', root).forEach(el => {
    el.addEventListener('click', () => openQuickView(el.dataset.open));
    if (el.getAttribute('role') === 'button') {
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQuickView(el.dataset.open); } });
    }
  });
}

/* ---------- Rail de destacados ---------- */
function initRail() {
  const vp = $('#railVp'), track = $('#railTrack');
  if (!vp || !track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(cardHTML).join('');
  bindCardActions(track);

  const prev = $('#railPrev'), next = $('#railNext');
  const inicio = () => parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
  const syncArrows = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= inicio() + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();
  const card = () => $('.prod-card', track)?.getBoundingClientRect().width || 280;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -(card() + 18) * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: (card() + 18) * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const goingRight = e.deltaY > 0;
    if ((goingRight && vp.scrollLeft < max - 1) || (!goingRight && vp.scrollLeft > 1)) {
      e.preventDefault();
      vp.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  let startX = 0, startLeft = 0, pointerId = null, moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    pointerId = null;
    if (moved) {
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    vp.classList.remove('dragging');
    moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

/* ---------- Catálogo ---------- */
const PAGE = 16;
const shopState = { query: '', cat: 'all', orden: 'destacados', page: 1 };

function filtrarProductos() {
  let list = [...PRODUCTOS];
  if (shopState.cat !== 'all') list = list.filter(p => p.cat === shopState.cat);
  const q = norm(shopState.query).trim();
  if (q) {
    const words = q.split(/\s+/);
    list = list.filter(p => {
      const hay = norm(`${p.nombre} ${catNombre(p.cat)} ${p.cat} ${p.desc} ${p.tags} ${(p.specs || []).join(' ')}`);
      return words.every(w => hay.includes(w));
    });
  }
  switch (shopState.orden) {
    case 'precio-asc': list.sort((a, b) => precioFinal(a) - precioFinal(b)); break;
    case 'precio-desc': list.sort((a, b) => precioFinal(b) - precioFinal(a)); break;
    case 'az': list.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); break;
    default: list.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  }
  return list;
}

function renderShop() {
  const grid = $('#shopGrid'), empty = $('#shopEmpty'), more = $('#shopMore'), count = $('#shopCount');
  if (!grid) return;
  const list = filtrarProductos();
  const visible = list.slice(0, shopState.page * PAGE);
  grid.innerHTML = visible.map(cardHTML).join('');
  bindCardActions(grid);
  empty.hidden = list.length > 0;
  grid.style.display = list.length ? '' : 'none';
  more.hidden = list.length <= visible.length;
  count.innerHTML = list.length
    ? `<b>${list.length}</b> ${list.length === 1 ? 'producto' : 'productos'}${shopState.cat !== 'all' ? ` en <b>${esc(catNombre(shopState.cat))}</b>` : ''}${shopState.query ? ` para “${esc(shopState.query)}”` : ''}`
    : '';
  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo($$('.prod-card', grid), { y: 44, opacity: 0 }, {
      y: 0, opacity: 1, duration: .75, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity',
    });
  }
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initShop() {
  const search = $('#shopSearch');
  let t = null;
  search?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { shopState.query = search.value; shopState.page = 1; renderShop(); }, 220);
  });
  $('#catChips')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    setCat(chip.dataset.cat, false);
  });
  $('#shopOrder')?.addEventListener('change', e => { shopState.orden = e.target.value; shopState.page = 1; renderShop(); });
  $('#shopMore')?.addEventListener('click', () => { shopState.page++; renderShop(); });
  $('#shopReset')?.addEventListener('click', () => {
    shopState.query = ''; shopState.cat = 'all'; shopState.page = 1;
    if (search) search.value = '';
    $$('#catChips .chip').forEach(c => c.classList.toggle('is-active', c.dataset.cat === 'all'));
    renderShop();
  });
  $$('[data-cat-count]').forEach(el => {
    const n = PRODUCTOS.filter(p => p.cat === el.dataset.catCount).length;
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  $$('[data-cat-link]').forEach(a => {
    a.addEventListener('click', () => setCat(a.dataset.catLink));
  });
  renderShop();
}

function setCat(cat) {
  shopState.cat = cat; shopState.page = 1;
  $$('#catChips .chip').forEach(c => c.classList.toggle('is-active', c.dataset.cat === cat));
  renderShop();
}

/* ---------- Vista rápida ---------- */
let qvLastFocus = null;
function openQuickView(id) {
  const p = getProducto(id); if (!p) return;
  const modal = $('#quickView'), backdrop = $('#qvBackdrop'), content = $('#qvContent');
  if (!modal || !content) return;
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="prod-badge">-${p.descuento}%</span>`
    : (p.badge ? `<span class="prod-badge is-new">${esc(p.badge)}</span>` : '');
  const related = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  content.innerHTML = `
    <div class="qv-media">${badge}<img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="800" height="800"></div>
    <div class="qv-info">
      <span class="prod-cat">${esc(catNombre(p.cat))}</span>
      <h2>${esc(p.nombre)}</h2>
      <p class="qv-price"><b>${formatearPrecio(final)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <div class="qv-specs">${(p.specs || []).map(s => `<span class="qv-spec">${esc(s)}</span>`).join('')}</div>
      <div class="qv-actions">
        <span class="stepper" data-stepper>
          <button type="button" data-minus aria-label="Restar una unidad">−</button>
          <output aria-live="polite">1</output>
          <button type="button" data-plus aria-label="Sumar una unidad">+</button>
        </span>
        <button type="button" class="btn btn-cta" id="qvAdd">Agregar al carrito</button>
        <button type="button" class="btn btn-ghost" id="qvBuy">Comprar ahora</button>
      </div>
      ${related.length ? `
      <div class="qv-related">
        <h3>También te puede interesar</h3>
        <div class="qv-related-grid">
          ${related.map(r => `
            <button type="button" class="qv-rel" data-rel="${esc(r.id)}">
              <img src="${esc(r.img)}" alt="${esc(r.nombre)}" loading="lazy" width="300" height="300">
              <span>${esc(r.nombre)}</span>
              <b>${formatearPrecio(precioFinal(r))}</b>
            </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
  const st = $('[data-stepper]', content), out = $('output', st);
  $('[data-minus]', st).addEventListener('click', () => { out.textContent = Math.max(1, +out.textContent - 1); });
  $('[data-plus]', st).addEventListener('click', () => { out.textContent = Math.min(99, +out.textContent + 1); });
  $('#qvAdd', content).addEventListener('click', () => {
    Cart.add(p, +out.textContent);
    showToast(`¡Agregado! ${p.nombre} espera en tu carrito.`);
  });
  $('#qvBuy', content).addEventListener('click', () => {
    Cart.add(p, +out.textContent);
    closeQuickView();
    openCartDrawer();
  });
  $$('.qv-rel', content).forEach(b => b.addEventListener('click', () => openQuickView(b.dataset.rel)));

  qvLastFocus = document.activeElement;
  modal.classList.add('open'); backdrop.classList.add('open');
  modal.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'drawer-open');
  modal.scrollTop = 0;
  $('#qvClose')?.focus();
}
function closeQuickView() {
  const modal = $('#quickView'), backdrop = $('#qvBackdrop');
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open'); backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  if (!$('#cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll', 'drawer-open');
  qvLastFocus?.focus?.();
}

/* ---------- Drawer del carrito ---------- */
let cartLastFocus = null;
function renderCart() {
  const body = $('#cartItems'), total = $('#cartTotal'), drawer = $('#cartDrawer');
  if (!body) return;
  const items = Cart.get();
  drawer.classList.toggle('is-empty', items.length === 0);
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id); if (!p) return '';
    const final = precioFinal(p);
    return `
    <div class="cart-item" data-id="${esc(p.id)}">
      <span class="cart-item-media"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="152" height="152"></span>
      <div class="cart-item-info">
        <h3>${esc(p.nombre)}</h3>
        <span class="u">${formatearPrecio(final)} c/u</span>
      </div>
      <div class="cart-item-side">
        <b>${formatearPrecio(final * i.qty)}</b>
        <span class="stepper">
          <button type="button" data-cminus aria-label="Restar una unidad">−</button>
          <output aria-live="polite">${i.qty}</output>
          <button type="button" data-cplus aria-label="Sumar una unidad">+</button>
        </span>
        <button type="button" class="cart-remove" data-cremove>Quitar</button>
      </div>
    </div>`;
  }).join('');
  total.textContent = formatearPrecio(Cart.total());
  $$('.cart-item', body).forEach(row => {
    const id = row.dataset.id;
    $('[data-cminus]', row)?.addEventListener('click', () => { Cart.setQty(id, (Cart.get().find(i => i.id === id)?.qty || 1) - 1); });
    $('[data-cplus]', row)?.addEventListener('click', () => { Cart.setQty(id, (Cart.get().find(i => i.id === id)?.qty || 1) + 1); });
    $('[data-cremove]', row)?.addEventListener('click', () => { Cart.remove(id); showToast('Producto quitado del carrito.'); });
  });
}
function openCartDrawer() {
  const drawer = $('#cartDrawer'), backdrop = $('#drawerBackdrop');
  renderCart();
  cartLastFocus = document.activeElement;
  drawer.classList.add('open'); backdrop.classList.add('open');
  drawer.removeAttribute('inert');
  document.body.classList.add('no-scroll', 'drawer-open');
  if (!reduceMotion && typeof gsap !== 'undefined') {
    gsap.fromTo($$('.cart-item', drawer), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: .4, stagger: .06, ease: 'power2.out', clearProps: 'all' });
  }
  $('#cartClose')?.focus();
}
function closeCartDrawer() {
  const drawer = $('#cartDrawer'), backdrop = $('#drawerBackdrop');
  if (!drawer?.classList.contains('open')) return;
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  drawer.setAttribute('inert', '');
  if (!$('#quickView')?.classList.contains('open')) document.body.classList.remove('no-scroll', 'drawer-open');
  cartLastFocus?.focus?.();
}
function initCartUI() {
  $('#cartOpen')?.addEventListener('click', openCartDrawer);
  $('#cartClose')?.addEventListener('click', closeCartDrawer);
  $('#drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  $('#cartGoShop')?.addEventListener('click', () => { closeCartDrawer(); document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); });
  $('#cartClear')?.addEventListener('click', () => { Cart.clear(); showToast('Carrito vacío: cancha lista para el próximo punto.'); });
  $('#cartCheckout')?.addEventListener('click', () => { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); });
  $('#qvClose')?.addEventListener('click', closeQuickView);
  $('#qvBackdrop')?.addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($('#quickView')?.classList.contains('open')) closeQuickView();
      else if ($('#cartDrawer')?.classList.contains('open')) closeCartDrawer();
    }
    if (e.key === 'Tab') {
      const overlay = $('#quickView')?.classList.contains('open') ? $('#quickView')
        : ($('#cartDrawer')?.classList.contains('open') ? $('#cartDrawer') : null);
      if (!overlay) return;
      const focusables = $$('button, [href], input, select, output[tabindex]', overlay).filter(el => !el.disabled && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if ($('#cartDrawer')?.classList.contains('open')) renderCart();
  });
  updateCartBadge();
}
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- Flotantes ---------- */
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

/* ---------- Nav mobile ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const mq = window.matchMedia('(min-width: 861px)');
  const syncDesktop = () => { if (mq.matches) nav.removeAttribute('inert'); else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); };
  mq.addEventListener?.('change', syncDesktop);
  syncDesktop();
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!mq.matches) nav.setAttribute('inert', '');
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

/* ---------- Reveals ---------- */
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

/* ---------- Capítulo formas ---------- */
function initFormas() {
  const steps = $$('.formas-step');
  if (!steps.length) return;
  const paths = { redonda: $('#shapeRedonda'), lagrima: $('#shapeLagrima'), diamante: $('#shapeDiamante') };
  const name = $('#fvName'), barC = $('#barControl'), barP = $('#barPotencia'), numC = $('#numControl'), numP = $('#numPotencia');
  const activate = step => {
    steps.forEach(s => s.classList.toggle('is-active', s === step));
    Object.entries(paths).forEach(([k, el]) => {
      if (!el) return;
      const on = k === step.dataset.shape;
      if (on && !el.classList.contains('is-on')) { el.classList.remove('is-on'); void el.getBoundingClientRect(); el.classList.add('is-on'); }
      else if (!on) el.classList.remove('is-on');
    });
    if (name) name.textContent = step.dataset.nombre || '';
    if (barC) barC.style.width = `${step.dataset.control}%`;
    if (barP) barP.style.width = `${step.dataset.potencia}%`;
    if (numC) numC.textContent = step.dataset.control;
    if (numP) numP.textContent = step.dataset.potencia;
  };
  const mqM = window.matchMedia('(max-width: 900px)');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (mqM.matches) return;
      entries.forEach(e => { if (e.isIntersecting) activate(e.target); });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    steps.forEach(s => io.observe(s));
  }
  const stage = $('#formasStage');
  let fq = false;
  const onScroll = () => {
    fq = false;
    if (!mqM.matches || !stage) return;
    const r = stage.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    if (travel <= 0) return;
    const prog = Math.min(0.999, Math.max(0, -r.top / travel));
    const step = steps[Math.min(steps.length - 1, Math.floor(prog * steps.length))];
    if (step && !step.classList.contains('is-active')) activate(step);
  };
  const queueF = () => { if (!fq) { fq = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', queueF, { passive: true });
  window.addEventListener('resize', queueF, { passive: true });
  onScroll();
}

/* ---------- Coreografía GSAP ---------- */
function initMotion() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const paleta = $('#scenePaleta'), ball = $('#sceneBall'), shadow = $('#sceneShadow'), panel = $('.scene-panel');
  if (panel && paleta && ball) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(panel, { scaleX: .94, scaleY: .94, opacity: 0, transformOrigin: '100% 50%' }, { scaleX: 1, scaleY: 1, opacity: 1, duration: 1 }, 0)
      .fromTo(paleta, { x: 90, y: -40, rotate: 4, opacity: 0 }, { x: 0, y: 0, rotate: -14, opacity: 1, duration: 1.15 }, .15)
      .fromTo(shadow, { opacity: 0, scaleX: .4 }, { opacity: 1, scaleX: 1, duration: .5 }, 1.05)
      .fromTo(ball,
        { y: -420, opacity: 0, scaleY: 1 },
        { y: 0, opacity: 1, duration: .55, ease: 'power2.in' }, .55)
      .to(ball, { scaleY: .78, scaleX: 1.12, duration: .09, transformOrigin: '50% 100%' })
      .to(ball, { scaleY: 1, scaleX: 1, duration: .12 })
      .to(ball, { y: -130, duration: .38, ease: 'power2.out' })
      .to(ball, { y: 0, duration: .34, ease: 'power2.in' })
      .to(ball, { scaleY: .85, scaleX: 1.08, duration: .08, transformOrigin: '50% 100%' })
      .to(ball, { scaleY: 1, scaleX: 1, duration: .1 })
      .to(ball, { y: -48, duration: .24, ease: 'power2.out' })
      .to(ball, { y: 0, duration: .22, ease: 'power2.in' })
      .to(ball, { y: -14, duration: .15, ease: 'power2.out' })
      .to(ball, { y: 0, duration: .13, ease: 'power2.in' });
    tl.fromTo(shadow, { scaleX: 1.15, opacity: .4 }, { scaleX: 1, opacity: 1, duration: .4 }, '<');
  }

  if (typeof ScrollTrigger === 'undefined') return;

  const word = $('.hero-word');
  if (word) {
    gsap.to(word, {
      xPercent: -6, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 },
    });
  }
  if (ball && paleta) {
    gsap.to(ball, { y: () => 90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
    gsap.to(paleta, { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }

  const seamRig = $('#seamBallRig'), seamHop = $('#seamBallHop'),
        seamBall = $('#seamBall'), seamShadow = $('#seamBallShadow'), seamPaleta = $('#seamPaleta');
  if (seamRig && seamHop && seamBall) {
    const armarRebote = chico => {
      /* cada pique conserva ~58% de la altura del anterior */
      const picos = chico ? [128, 74, 43, 25, 13, 6] : [206, 120, 70, 40, 21, 9];
      const viaje = chico ? 150 : 290;
      /* el tiempo de vuelo va con la raíz de la altura: la caída se siente real */
      const vuelo = h => Math.sqrt(h) / 11;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '#formas', start: 'bottom 96%', end: 'bottom 2%', scrub: .5 },
      });

      tl.fromTo(seamHop, { y: -picos[0] }, { y: 0, duration: vuelo(picos[0]), ease: 'power2.in' });
      picos.slice(1).forEach(h => {
        tl.to(seamHop, { scaleY: .74, scaleX: 1.19, duration: .05, ease: 'power2.out' })
          .to(seamHop, { scaleY: 1, scaleX: 1, duration: .07, ease: 'power1.out' })
          .to(seamHop, { y: -h, duration: vuelo(h), ease: 'power2.out' })
          .to(seamHop, { y: 0, duration: vuelo(h), ease: 'power2.in' });
      });
      tl.to(seamHop, { scaleY: .9, scaleX: 1.06, duration: .04, ease: 'power2.out' })
        .to(seamHop, { scaleY: 1, scaleX: 1, duration: .06, ease: 'power1.out' });

      /* el avance y el giro corren parejos por encima de todos los piques */
      const total = tl.duration();
      tl.fromTo(seamRig, { x: viaje * .4 }, { x: -viaje, duration: total, ease: 'none' }, 0)
        .fromTo(seamBall, { rotate: 34 }, { rotate: -226, duration: total, ease: 'none' }, 0);

      /* la sombra se cierra y se aclara cuando la pelota sube */
      if (seamShadow) {
        const alto = picos[0];
        tl.eventCallback('onUpdate', () => {
          const h = Math.min(1, Math.abs(gsap.getProperty(seamHop, 'y')) / alto);
          gsap.set(seamShadow, { scaleX: 1 - h * .42, scaleY: 1 - h * .28, opacity: 1 - h * .7 });
        });
      }
    };
    const mm = gsap.matchMedia();
    mm.add('(max-width: 900px)', () => armarRebote(true));
    mm.add('(min-width: 901px)', () => armarRebote(false));
  }
  if (seamPaleta) {
    gsap.fromTo(seamPaleta, { y: 40, rotate: 18 }, {
      y: -46, rotate: 27, ease: 'none',
      scrollTrigger: { trigger: '#formas', start: 'bottom 95%', end: 'bottom 15%', scrub: .7 },
    });
  }

  const editPhoto = $('#editPhoto');
  if (editPhoto) {
    gsap.fromTo(editPhoto, { objectPosition: '50% 8%' }, {
      objectPosition: '50% 32%', ease: 'none',
      scrollTrigger: { trigger: '.editorial', start: 'top bottom', end: 'bottom top', scrub: .8 },
    });
  }

  const cierreBall = $('#cierreBall');
  if (cierreBall) {
    gsap.fromTo(cierreBall, { y: -260, opacity: 0 }, {
      y: 0, opacity: 1, duration: .8, ease: 'bounce.out', immediateRender: true,
      scrollTrigger: { trigger: '.cierre', start: 'top 62%' },
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- Arranque ---------- */
initRail();
initShop();
initCartUI();
initFloats();
initNav();
initReveals();
initFormas();
initMotion();
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
