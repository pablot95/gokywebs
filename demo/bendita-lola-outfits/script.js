const WHATSAPP_NUMBER = '5491158079585';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'noche', nombre: 'Noche' },
  { id: 'denim', nombre: 'Denim' },
  { id: 'cuero', nombre: 'Cuero y Abrigos' },
  { id: 'calzado', nombre: 'Calzado' },
  { id: 'accesorios', nombre: 'Accesorios' },
];

const TALLES_ROPA = ['1', '2', '3', '4'];
const TALLES_CALZADO = ['35', '36', '37', '38', '39', '40'];
const TALLE_UNICO = ['Único'];

const PRODUCTOS = [
  { id: 'p1', slug: 'vestido-satinado-negro', nombre: 'Vestido Satinado Negro', categoria: 'noche', mundo: 'noche', precio: 96000, descuento: 0, talles: TALLES_ROPA, stock: 14, destacado: true, imagen: 'images/vestido-satinado-negro.webp', descripcion: 'Corte midi al bies en satén, con escote drapeado. El vestido que resuelve cualquier salida sin pensarlo.', tags: ['vestido', 'saten', 'midi', 'fiesta'] },
  { id: 'p2', slug: 'vestido-satinado-tostado', nombre: 'Vestido Satinado Tostado', categoria: 'noche', mundo: 'noche', precio: 96000, descuento: 15, talles: TALLES_ROPA, stock: 6, destacado: false, imagen: 'images/vestido-satinado-negro.webp', descripcion: 'El mismo corte al bies, en tono tostado cálido. Un clásico de temporada en versión menos obvia.', tags: ['vestido', 'saten', 'tostado'] },
  { id: 'p3', slug: 'top-lentejuelas-negro', nombre: 'Top Lentejuelas Negro', categoria: 'noche', mundo: 'noche', precio: 58000, descuento: 0, talles: TALLES_ROPA, stock: 22, destacado: true, imagen: 'images/top-negro-lentejuelas.webp', descripcion: 'Bretel finito y lentejuela mate. Va con jean de día y con cuero de noche.', tags: ['top', 'lentejuelas', 'brillo'] },
  { id: 'p4', slug: 'conjunto-noche-lentejuelas', nombre: 'Conjunto Noche Lentejuelas', categoria: 'noche', mundo: 'noche', precio: 142000, descuento: 0, talles: TALLES_ROPA, stock: 5, destacado: true, imagen: 'images/look-nocturno-lentejuelas.webp', descripcion: 'Top de lentejuelas + pantalón engomado, el look armado que más sale los fines de semana.', tags: ['conjunto', 'noche', 'engomado'] },
  { id: 'p5', slug: 'jean-wide-leg-azul', nombre: 'Jean Wide Leg Azul', categoria: 'denim', mundo: 'dia', precio: 68000, descuento: 0, talles: TALLES_ROPA, stock: 30, destacado: true, imagen: 'images/jean-wide-leg-denim.webp', descripcion: 'Tiro alto y pierna ancha en denim rígido con lavado medio. Nuestro corte más pedido.', tags: ['jean', 'wide leg', 'tiro alto'] },
  { id: 'p6', slug: 'jean-wide-leg-negro', nombre: 'Jean Wide Leg Negro', categoria: 'denim', mundo: 'dia', precio: 68000, descuento: 0, talles: TALLES_ROPA, stock: 18, destacado: false, imagen: 'images/jean-wide-leg-denim.webp', descripcion: 'El mismo molde wide leg en negro profundo, para cruzar del día a la noche sin cambiarte.', tags: ['jean', 'negro', 'wide leg'] },
  { id: 'p7', slug: 'campera-jean-oversize', nombre: 'Campera de Jean Oversize', categoria: 'denim', mundo: 'dia', precio: 89000, descuento: 10, talles: TALLES_ROPA, stock: 12, destacado: true, imagen: 'images/look-denim-contemporaneo.webp', descripcion: 'Denim lavado con hombro caído y bolsillos con tapa. Se lleva sobre todo, literalmente.', tags: ['campera', 'jean', 'oversize'] },
  { id: 'p8', slug: 'campera-cuero-negra', nombre: 'Campera de Cuero Negra', categoria: 'cuero', mundo: 'dia', precio: 186000, descuento: 0, talles: TALLES_ROPA, stock: 8, destacado: true, imagen: 'images/campera-cuero-negra.webp', descripcion: 'Biker de cuero ecológico con cinto y cierres metálicos. La prenda que no pasa de moda.', tags: ['campera', 'cuero', 'biker'] },
  { id: 'p9', slug: 'blazer-cuero-negro', nombre: 'Blazer de Cuero Negro', categoria: 'cuero', mundo: 'noche', precio: 174000, descuento: 0, talles: TALLES_ROPA, stock: 7, destacado: true, imagen: 'images/look-urbano-cuero-y-denim.webp', descripcion: 'Blazer cruzado de cuero ecológico, estructura suave. Sobre jean de día, sobre top de noche.', tags: ['blazer', 'cuero', 'sastreria'] },
  { id: 'p10', slug: 'botas-negras-taco', nombre: 'Botas Negras de Taco', categoria: 'calzado', mundo: 'noche', precio: 128000, descuento: 0, talles: TALLES_CALZADO, stock: 16, destacado: true, imagen: 'images/botas-negras-taco.webp', descripcion: 'Caña corta, taco cuadrado de 8 cm y punta suave. Cómodas de verdad para toda la noche.', tags: ['botas', 'taco', 'negro'] },
  { id: 'p11', slug: 'botas-negras-cana-alta', nombre: 'Botas Negras Caña Alta', categoria: 'calzado', mundo: 'dia', precio: 152000, descuento: 0, talles: TALLES_CALZADO, stock: 0, destacado: false, imagen: 'images/botas-negras-taco.webp', descripcion: 'Caña alta hasta la rodilla con taco bajo. La aliada del jean wide leg.', tags: ['botas', 'cana alta'] },
  { id: 'p12', slug: 'cartera-matelasse-negra', nombre: 'Cartera Matelassé Negra', categoria: 'accesorios', mundo: 'noche', precio: 84000, descuento: 0, talles: TALLE_UNICO, stock: 20, destacado: true, imagen: 'images/cartera-negra-elegante.webp', descripcion: 'Matelassé con cadena dorada y cierre metálico. Entra lo justo y necesario.', tags: ['cartera', 'matelasse', 'cadena'] },
  { id: 'p13', slug: 'cartera-mini-negra', nombre: 'Cartera Mini Negra', categoria: 'accesorios', mundo: 'noche', precio: 62000, descuento: 0, talles: TALLE_UNICO, stock: 4, destacado: false, imagen: 'images/cartera-negra-elegante.webp', descripcion: 'Versión mini de nuestra matelassé, para las noches en las que solo llevás lo esencial.', tags: ['cartera', 'mini'] },
  { id: 'p14', slug: 'look-urbano-cuero-denim', nombre: 'Look Urbano Cuero & Denim', categoria: 'denim', mundo: 'dia', precio: 198000, descuento: 12, talles: TALLES_ROPA, stock: 6, destacado: false, imagen: 'images/look-urbano-cuero-y-denim.webp', descripcion: 'Blazer de cuero + top + jean, el conjunto completo armado por nosotras.', tags: ['look', 'conjunto', 'urbano'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'benditalola_cart',
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
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (window.Flip) gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none';
  });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function initWhatsAppLinks() {
  document.querySelectorAll('[data-wsp-msg]').forEach(a => {
    a.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wspMsg)}`);
  });
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

let modoActual = 'dia';

function initModoToggle() {
  const btns = document.querySelectorAll('[data-modo]');
  if (!btns.length) return;
  const aplicar = (modo, { reorder = true } = {}) => {
    modoActual = modo;
    document.body.classList.toggle('is-night', modo === 'noche');
    btns.forEach(b => {
      const on = b.dataset.modo === modo;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    document.querySelectorAll('[data-hero-visual]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.heroVisual === modo);
    });
    document.querySelectorAll('[data-hero-copy]').forEach(el => {
      el.hidden = el.dataset.heroCopy !== modo;
    });
    if (reorder) reordenarDestacados();
  };
  btns.forEach(b => b.addEventListener('click', () => aplicar(b.dataset.modo)));
  aplicar('dia', { reorder: false });
}

function ordenDestacados() {
  const destacados = PRODUCTOS.filter(p => p.destacado);
  const propios = destacados.filter(p => p.mundo === modoActual);
  const resto = destacados.filter(p => p.mundo !== modoActual);
  return [...propios, ...resto];
}

function reordenarDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  const orden = ordenDestacados();
  const puedeFlip = typeof gsap !== 'undefined' && window.Flip && !reduceMotion && track.children.length;
  const state = puedeFlip ? window.Flip.getState(track.children) : null;
  orden.forEach(p => {
    const card = track.querySelector(`.prod-card[data-id="${p.id}"]`);
    if (card) track.appendChild(card);
  });
  track.scrollTo?.({ left: 0 });
  document.getElementById('destacadosRail')?.scrollTo({ left: 0, behavior: 'auto' });
  if (state) window.Flip.from(state, { duration: .6, ease: 'power2.inOut', stagger: .03, absolute: true });
}

function badgeHtml(p) {
  if (p.stock === 0) return '<span class="prod-badge prod-badge--sold">Agotado</span>';
  if (p.descuento > 0) return `<span class="prod-badge prod-badge--sale">-${p.descuento}%</span>`;
  if (p.stock <= 6) return '<span class="prod-badge prod-badge--low">Últimas unidades</span>';
  return '';
}

function cardHtml(p) {
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  return `
  <article class="prod-card" data-id="${p.id}" data-mundo="${p.mundo}" data-animate="scale" style="transform:scale(.94) translateY(16px);opacity:0">
    <button type="button" class="prod-media" data-open-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${badgeHtml(p)}
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="1200" height="1200" loading="lazy">
    </button>
    <div class="prod-body">
      <p class="prod-cat">${esc(CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '')}</p>
      <h3 class="prod-name"><button type="button" data-open-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <button type="button" class="btn-add" data-open-quick="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Agotado' : 'Elegir talle'}</button>
    </div>
  </article>`;
}

function renderDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  track.innerHTML = ordenDestacados().map(cardHtml).join('');
  wireCardEvents(track);
}

function renderCategorias() {
  const wrap = document.getElementById('categoriasGrid');
  if (!wrap) return;
  wrap.innerHTML = CATEGORIAS.map(c => {
    const ejemplo = PRODUCTOS.find(p => p.categoria === c.id);
    const count = PRODUCTOS.filter(p => p.categoria === c.id).length;
    if (!ejemplo) return '';
    return `
    <button type="button" class="cat-card" data-goto-cat="${c.id}" data-animate="up" style="transform:translateY(40px);opacity:0">
      <img src="${ejemplo.imagen}" alt="${esc(c.nombre)}" width="1200" height="1200" loading="lazy">
      <span class="cat-card-label"><strong>${esc(c.nombre)}</strong><small>${count} pieza${count === 1 ? '' : 's'}</small></span>
    </button>`;
  }).join('');
}

const filterState = { q: '', cat: 'all', precio: 'all' };

function precioEnRango(precio, rango) {
  if (rango === 'all') return true;
  if (rango === 'bajo') return precio < 70000;
  if (rango === 'medio') return precio >= 70000 && precio <= 130000;
  if (rango === 'alto') return precio > 130000;
  return true;
}

function productosFiltrados() {
  const q = normalizar(filterState.q);
  return PRODUCTOS.filter(p => {
    if (filterState.cat !== 'all' && p.categoria !== filterState.cat) return false;
    if (!precioEnRango(precioFinal(p), filterState.precio)) return false;
    if (!q) return true;
    const cat = CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '';
    const haystack = normalizar([p.nombre, cat, p.descripcion, ...(p.tags || [])].join(' '));
    return haystack.includes(q);
  });
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const count = document.getElementById('catalogoCount');
  const empty = document.getElementById('catalogoEmpty');
  if (!grid) return;
  const items = productosFiltrados();
  grid.innerHTML = items.map(cardHtml).join('');
  if (count) count.textContent = `${items.length} pieza${items.length === 1 ? '' : 's'}`;
  if (empty) empty.hidden = items.length !== 0;
  wireCardEvents(grid);
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function initFiltros() {
  const search = document.getElementById('catalogoSearch');
  const chips = document.querySelectorAll('[data-filter-cat]');
  const precio = document.getElementById('filtroPrecio');
  const clear = document.getElementById('filtroClear');
  search?.addEventListener('input', () => { filterState.q = search.value; renderCatalogo(); });
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filterState.cat = chip.dataset.filterCat;
    renderCatalogo();
  }));
  precio?.addEventListener('change', () => { filterState.precio = precio.value; renderCatalogo(); });
  clear?.addEventListener('click', () => {
    filterState.q = ''; filterState.cat = 'all'; filterState.precio = 'all';
    if (search) search.value = '';
    if (precio) precio.value = 'all';
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === 'all'));
    renderCatalogo();
  });
}

function gotoCategoria(catId) {
  document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === catId));
  filterState.cat = catId;
  renderCatalogo();
  document.getElementById('tienda')?.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function renderDrawer() {
  const list = document.getElementById('drawerItems');
  const totalEl = document.getElementById('drawerTotal');
  const empty = document.getElementById('drawerEmpty');
  if (!list) return;
  const items = Cart.get();
  if (!items.length) {
    list.innerHTML = '';
    if (empty) empty.hidden = false;
    if (totalEl) totalEl.textContent = formatearPrecio(0);
    return;
  }
  if (empty) empty.hidden = true;
  list.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
    <li class="drawer-item">
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="120" height="120" loading="lazy">
      <div class="drawer-item-info">
        <p class="drawer-item-name">${esc(p.nombre)}</p>
        <p class="drawer-item-talle">Talle ${esc(i.talle)}</p>
        <p class="drawer-item-price">${formatearPrecio(precioFinal(p))}</p>
        <div class="qty-stepper qty-stepper--sm">
          <button type="button" data-drawer-minus="${p.id}" data-talle="${esc(i.talle)}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-drawer-plus="${p.id}" data-talle="${esc(i.talle)}" aria-label="Sumar">+</button>
        </div>
      </div>
      <button type="button" class="drawer-item-remove" data-drawer-remove="${p.id}" data-talle="${esc(i.talle)}" aria-label="Quitar ${esc(p.nombre)} talle ${esc(i.talle)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </li>`;
  }).join('');
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
}
document.addEventListener('cart:updated', renderDrawer);

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  renderDrawer();
  drawer.classList.add('open'); drawer.removeAttribute('inert');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll', 'drawer-open');
  drawer.querySelector('button, a')?.focus();
}
function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  drawer.classList.remove('open'); drawer.setAttribute('inert', '');
  backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll', 'drawer-open');
}

function initCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('cart-header')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-float')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCartDrawer(); });
  drawer.addEventListener('click', e => {
    const minus = e.target.closest('[data-drawer-minus]');
    const plus = e.target.closest('[data-drawer-plus]');
    const remove = e.target.closest('[data-drawer-remove]');
    if (minus) {
      const id = minus.dataset.drawerMinus, talle = minus.dataset.talle;
      const it = Cart.get().find(i => i.id === id && i.talle === talle);
      if (it) { if (it.qty - 1 <= 0) Cart.remove(id, talle); else Cart.setQty(id, talle, it.qty - 1); }
    }
    if (plus) {
      const id = plus.dataset.drawerPlus, talle = plus.dataset.talle;
      const it = Cart.get().find(i => i.id === id && i.talle === talle);
      if (it) Cart.setQty(id, talle, it.qty + 1);
    }
    if (remove) Cart.remove(remove.dataset.drawerRemove, remove.dataset.talle);
  });
  document.getElementById('drawerCheckout')?.addEventListener('click', () => {
    if (!Cart.count()) return;
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}

function wireCardEvents(scope) {
  scope.querySelectorAll('[data-open-quick]').forEach(el => {
    if (el.disabled) return;
    el.addEventListener('click', () => openQuickView(el.dataset.openQuick));
  });
}

let qvTalle = null;
let qvQty = 1;

function openQuickView(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickView');
  if (!p || !modal) return;
  qvTalle = p.talles.length === 1 ? p.talles[0] : null;
  qvQty = 1;
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  modal.querySelector('[data-qv-body]').innerHTML = `
    <div class="qv-media">${badgeHtml(p)}<img src="${p.imagen}" alt="${esc(p.nombre)}" width="1200" height="1200"></div>
    <div class="qv-info">
      <p class="prod-cat">${esc(CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '')}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <p class="qv-desc">${esc(p.descripcion)}</p>
      <div class="qv-talles">
        <p class="qv-talles-label">Talle<span data-talle-error hidden> — elegí uno para continuar</span></p>
        <div class="talle-row" data-talle-row>
          ${p.talles.map(t => `<button type="button" class="talle-chip${qvTalle === t ? ' is-on' : ''}" data-talle-pick="${esc(t)}">${esc(t)}</button>`).join('')}
        </div>
      </div>
      <div class="qv-actions">
        <div class="qty-stepper">
          <button type="button" data-qv-minus aria-label="Restar cantidad">−</button>
          <span data-qv-qty>1</span>
          <button type="button" data-qv-plus aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-qv-add ${p.stock === 0 ? 'disabled' : ''} style="flex:1">${p.stock === 0 ? 'Agotado' : 'Agregar al carrito'}</button>
      </div>
      ${relacionados.length ? `<div class="qv-relacionados"><p>También te puede interesar</p><div class="qv-relacionados-grid">${relacionados.map(r => `<button type="button" data-open-quick="${r.id}"><img src="${r.imagen}" alt="${esc(r.nombre)}" width="200" height="200" loading="lazy"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;

  const body = modal.querySelector('[data-qv-body]');
  const errorEl = body.querySelector('[data-talle-error]');
  const qtyEl = body.querySelector('[data-qv-qty]');
  body.querySelectorAll('[data-talle-pick]').forEach(btn => btn.addEventListener('click', () => {
    qvTalle = btn.dataset.tallePick;
    body.querySelectorAll('[data-talle-pick]').forEach(b => b.classList.toggle('is-on', b === btn));
    if (errorEl) errorEl.hidden = true;
    body.querySelector('[data-talle-row]')?.classList.remove('has-error');
  }));
  body.querySelector('[data-qv-minus]')?.addEventListener('click', () => { qvQty = Math.max(1, qvQty - 1); qtyEl.textContent = qvQty; });
  body.querySelector('[data-qv-plus]')?.addEventListener('click', () => { qvQty = Math.min(p.stock || 1, qvQty + 1); qtyEl.textContent = qvQty; });
  body.querySelector('[data-qv-add]')?.addEventListener('click', () => {
    if (!qvTalle) {
      if (errorEl) errorEl.hidden = false;
      body.querySelector('[data-talle-row]')?.classList.add('has-error');
      return;
    }
    Cart.add(p, qvTalle, qvQty);
    closeQuickView();
    showToast(`¡Agregado! ${p.nombre}, talle ${qvTalle}.`);
  });
  wireCardEvents(body);

  modal.classList.add('open'); modal.removeAttribute('inert');
  document.body.classList.add('no-scroll');
  modal.querySelector('.qv-close')?.focus();
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.classList.remove('open'); modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
}

function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.querySelector('.qv-close')?.addEventListener('click', closeQuickView);
  modal.querySelector('.qv-backdrop')?.addEventListener('click', closeQuickView);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeQuickView(); });
}

function initFloats() {
  const cart = document.getElementById('cart-float');
  const wsp = document.getElementById('wsp-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
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
      moved = true; vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

function initDestacadosRail() {
  const vp = document.getElementById('destacadosRail');
  if (!vp) return;
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

function initMagnetic() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || typeof gsap === 'undefined') return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * .2, y: (e.clientY - r.top - r.height / 2) * .3, duration: .3 });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .45, ease: 'elastic.out(1, .55)' }));
  });
}

let revealsListos = false;
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    revealsListos = true;
    return;
  }
  const presets = {
    up: { y: 0, opacity: 1, duration: .9 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
  };
  items.forEach(el => {
    if (el.classList.contains('in')) return;
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onComplete: () => el.classList.add('in'),
    });
  });
  revealsListos = true;
}

function revelarNuevos(container) {
  if (!revealsListos) return;
  const items = container.querySelectorAll('[data-animate]:not(.in)');
  if (typeof gsap === 'undefined' || reduceMotion) {
    items.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('in'); });
    return;
  }
  items.forEach((el, i) => {
    gsap.to(el, {
      scale: 1, y: 0, opacity: 1, duration: 1, ease: 'expo.out',
      delay: Math.min(i * 0.06, 0.4),
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      onComplete: () => el.classList.add('in'),
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDestacados();
  renderCategorias();
  renderCatalogo();
  initWhatsAppLinks();
  initFloats();
  initNav();
  initModoToggle();
  initDestacadosRail();
  initFiltros();
  initCartDrawer();
  initQuickView();
  initMagnetic();
  initReveals();
  updateCartBadge();
  document.querySelectorAll('[data-goto-cat]').forEach(btn => btn.addEventListener('click', () => gotoCategoria(btn.dataset.gotoCat)));
});
