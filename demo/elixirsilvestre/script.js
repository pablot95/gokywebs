const WHATSAPP_NUMBER = '542615954811';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const CATEGORIAS_INFO = {
  jabones: { nombre: 'Jabones' },
  aceites: { nombre: 'Aceites' },
  velas: { nombre: 'Velas' },
};

const ICONOS_SVG = {
  jabones: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4c4 2 7 6 7 10a7 7 0 0 1-7-7 7 7 0 0 1-7 7c0-4 3-8 7-10z" stroke-linejoin="round"/><path d="M12 4v13" stroke-linecap="round"/></svg>',
  aceites: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3s7 8.2 7 13a7 7 0 0 1-14 0c0-4.8 7-13 7-13z" stroke-linejoin="round"/></svg>',
  velas: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3c2 2.6 1 4.3-.3 5.6C10.6 9.7 10 10.9 10 12.3a2 2 0 0 0 4 0c0-.7-.3-1.3-.3-1.3.8.5 1.8 1.7 1.8 3.4A3.5 3.5 0 0 1 12 18a3.5 3.5 0 0 1-3.5-3.6C8.5 11 10 7.3 12 3z" stroke-linejoin="round"/><path d="M6 21h12" stroke-linecap="round"/></svg>',
};

const PRODUCTOS = [
  { id: 1, slug: 'carbon-activado-arcilla-negra', nombre: 'Carbón Activado y Arcilla Negra', categoria: 'jabones', meta: 'Piel mixta a grasa · 100g', precio: 3800, descuento: 0, stock: 30 },
  { id: 2, slug: 'avena-y-miel', nombre: 'Avena y Miel', categoria: 'jabones', meta: 'Piel sensible · 100g', precio: 3500, descuento: 0, stock: 30 },
  { id: 3, slug: 'lavanda-y-manzanilla', nombre: 'Lavanda y Manzanilla', categoria: 'jabones', meta: 'Relajante · 100g', precio: 3600, descuento: 10, stock: 30 },
  { id: 4, slug: 'rosa-mosqueta-jabon', nombre: 'Jabón de Rosa Mosqueta', categoria: 'jabones', meta: 'Piel seca · 100g', precio: 4200, descuento: 0, stock: 30 },
  { id: 5, slug: 'calendula-y-manzanilla', nombre: 'Caléndula y Manzanilla', categoria: 'jabones', meta: 'Piel sensible · 100g', precio: 3700, descuento: 0, stock: 30 },
  { id: 6, slug: 'coco-y-vainilla', nombre: 'Coco y Vainilla', categoria: 'jabones', meta: 'Hidratante · 100g', precio: 3600, descuento: 0, stock: 30 },
  { id: 7, slug: 'petalos-dorados-y-miel', nombre: 'Pétalos Dorados y Miel', categoria: 'jabones', meta: 'Piel normal · 100g', precio: 4500, descuento: 15, stock: 30 },
  { id: 8, slug: 'arcilla-rosada-y-rosas', nombre: 'Arcilla Rosada y Rosas', categoria: 'jabones', meta: 'Piel normal a seca · 100g', precio: 4000, descuento: 0, stock: 30 },
  { id: 9, slug: 'cafe-y-canela', nombre: 'Café y Canela', categoria: 'jabones', meta: 'Exfoliante · 100g', precio: 3900, descuento: 0, stock: 30 },
  { id: 10, slug: 'menta-y-eucalipto', nombre: 'Menta y Eucalipto', categoria: 'jabones', meta: 'Piel grasa · 100g', precio: 3500, descuento: 0, stock: 30 },
  { id: 11, slug: 'aceite-corporal-almendras', nombre: 'Aceite Corporal de Almendras', categoria: 'aceites', meta: 'Hidratación diaria · 100ml', precio: 7200, descuento: 0, stock: 20 },
  { id: 12, slug: 'aceite-rosa-mosqueta', nombre: 'Aceite de Rosa Mosqueta', categoria: 'aceites', meta: 'Regenerador · 30ml', precio: 8500, descuento: 0, stock: 20 },
  { id: 13, slug: 'aceite-coco-prensado-frio', nombre: 'Aceite de Coco Prensado en Frío', categoria: 'aceites', meta: 'Multiuso · 200ml', precio: 6500, descuento: 10, stock: 20 },
  { id: 14, slug: 'serum-facial-nutritivo', nombre: 'Sérum Facial Nutritivo', categoria: 'aceites', meta: 'Piel seca · 30ml', precio: 9200, descuento: 0, stock: 20 },
  { id: 15, slug: 'vela-vainilla-sandalo', nombre: 'Vela de Vainilla y Sándalo', categoria: 'velas', meta: 'Cera de soja · 180g', precio: 6200, descuento: 0, stock: 20 },
  { id: 16, slug: 'vela-lavanda', nombre: 'Vela de Lavanda', categoria: 'velas', meta: 'Cera de soja · 180g', precio: 6000, descuento: 0, stock: 20 },
  { id: 17, slug: 'vela-citricos', nombre: 'Vela de Cítricos', categoria: 'velas', meta: 'Cera de soja · 180g', precio: 6000, descuento: 15, stock: 20 },
  { id: 18, slug: 'vela-madera-cedro', nombre: 'Vela de Madera y Cedro', categoria: 'velas', meta: 'Cera de soja · 220g', precio: 6800, descuento: 0, stock: 20 },
];

const DESTACADOS_IDS = [1, 11, 15, 7, 4, 13, 17, 3];

const NOTICIAS = [
  {
    slug: 'elegir-jabon-tipo-piel', tag: 'Guía',
    titulo: 'Cómo elegir el jabón según tu tipo de piel',
    excerpt: 'Piel grasa, seca, sensible o mixta — qué ingredientes buscar en cada caso.',
    cuerpo: [
      'No todos los jabones naturales sirven igual para todas las pieles. La avena y la caléndula calman pieles sensibles; el carbón activado y la arcilla negra ayudan a controlar la piel grasa; la rosa mosqueta y los aceites nutren la piel seca.',
      'Si no estás segura de cuál elegir, contanos por WhatsApp cómo es tu piel y te recomendamos la opción que mejor te sirva.',
      'Todos los jabones de Elixir Silvestre se mezclan en frío, así que conservan las propiedades reales de cada ingrediente.',
    ],
  },
  {
    slug: 'por-que-mezcla-fria', tag: 'Cómo funciona',
    titulo: 'Por qué mezclamos en frío (y no en caliente)',
    excerpt: 'El método que eligió Elixir Silvestre para conservar cada ingrediente intacto.',
    cuerpo: [
      'La mayoría de los jabones industriales se hacen con calor, un proceso más rápido pero que degrada buena parte de las propiedades de los aceites y extractos naturales.',
      'La mezcla en frío lleva más tiempo — y varias semanas de curado después — pero conserva mucho mejor lo que cada ingrediente aporta a la piel.',
      'Es la misma razón por la que cada lote de Elixir Silvestre es chico: no hay atajo para el tiempo que necesita este método.',
    ],
  },
  {
    slug: 'nuevos-aromas-velas', tag: 'Novedades',
    titulo: 'Nuevos aromas en la línea de velas',
    excerpt: 'Se suman variantes de cera de soja natural a la colección.',
    cuerpo: [
      'La línea de velas de cera de soja sumó nuevas variantes de aroma, buscando siempre esencias naturales por sobre las sintéticas.',
      'Todas se elaboran en los mismos lotes chicos que los jabones y los aceites — mismo cuidado, otro formato.',
      'Para conocer la disponibilidad de cada aroma, el catálogo se actualiza a medida que se elaboran nuevos lotes.',
    ],
  },
  {
    slug: 'cuidados-jabon-artesanal', tag: 'Guía',
    titulo: 'Cuidados para que tu jabón artesanal dure más',
    excerpt: 'Un jabón natural no tiene los conservantes de uno industrial — por eso conviene cuidarlo distinto.',
    cuerpo: [
      'Un jabonera con buen drenaje alarga mucho la vida útil del jabón — el agua estancada es lo que más rápido lo deshace.',
      'Guardarlo fuera del chorro directo de la ducha entre uso y uso también ayuda a que dure más.',
      'Es normal que el aroma natural sea más sutil que el de un jabón con fragancia sintética — es señal de que no lleva agregados artificiales.',
    ],
  },
];

const Cart = {
  KEY: 'elixirsilvestre_cart',
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

function prodCardHtml(p) {
  const precio = precioFinal(p);
  const tieneDescuento = p.descuento > 0;
  return `
  <article class="prod-card prod-${p.categoria}" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(28px)">
    <div class="prod-media" data-open-modal="${p.id}">
      ${tieneDescuento ? `<span class="prod-badge">-${p.descuento}%</span>` : ''}
      ${ICONOS_SVG[p.categoria]}
    </div>
    <div class="prod-body">
      <span class="prod-cat">${CATEGORIAS_INFO[p.categoria].nombre}</span>
      <h3 class="prod-nombre" data-open-modal="${p.id}">${esc(p.nombre)}</h3>
      <span class="prod-meta">${esc(p.meta)}</span>
      <div class="prod-precio-row">
        <span class="prod-precio">${formatearPrecio(precio)}</span>
        ${tieneDescuento ? `<s class="prod-precio-orig">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <div class="prod-actions">
        <div class="stepper" data-stepper="${p.id}">
          <button type="button" data-step-down aria-label="Restar cantidad">−</button>
          <span data-step-value>1</span>
          <button type="button" data-step-up aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Agregar
        </button>
      </div>
    </div>
  </article>`;
}

function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = DESTACADOS_IDS.map(id => prodCardHtml(getProducto(id))).join('');
  initRailDrag();
  initRailArrows();
  initProdCardActions(track);
}

function initRailDrag() {
  const vp = document.getElementById('rail');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  let startX = 0, startScroll = 0, moved = false, pointerId = null;

  vp.addEventListener('pointerdown', e => {
    startX = e.clientX; startScroll = vp.scrollLeft; moved = false; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId === null) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) { vp.scrollLeft = startScroll - dx; }
  });
  const end = () => {
    if (moved) { setTimeout(() => vp.classList.remove('dragging'), 0); }
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

function initRailArrows() {
  const vp = document.getElementById('rail');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !prev || !next) return;
  const cardWidth = () => (track.firstElementChild?.getBoundingClientRect().width || 230) + 18;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -cardWidth() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: cardWidth() * 2, behavior: 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initProdCardActions(scope) {
  scope.querySelectorAll('[data-stepper]').forEach(stepper => {
    const valueEl = stepper.querySelector('[data-step-value]');
    let qty = 1;
    stepper.querySelector('[data-step-down]').addEventListener('click', () => { qty = Math.max(1, qty - 1); valueEl.textContent = qty; });
    stepper.querySelector('[data-step-up]').addEventListener('click', () => { qty = Math.min(20, qty + 1); valueEl.textContent = qty; });
    stepper._getQty = () => qty;
  });
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.add, 10);
      const p = getProducto(id);
      const stepper = scope.querySelector(`[data-stepper="${id}"]`);
      const qty = stepper?._getQty ? stepper._getQty() : 1;
      Cart.add(p, qty);
      showToast('¡Agregado! Tu carrito te espera');
    });
  });
  scope.querySelectorAll('[data-open-modal]').forEach(el => {
    el.addEventListener('click', () => openProductoModal(parseInt(el.dataset.openModal, 10)));
  });
}

let paginaActual = 16;
const PAGE_SIZE = 16;
let filtroCategoria = 'todos';
let filtroPrecio = '';
let terminoBusqueda = '';
let revealsListos = false;

function productosFiltrados() {
  const term = normalizar(terminoBusqueda.trim());
  return PRODUCTOS.filter(p => {
    if (filtroCategoria !== 'todos' && p.categoria !== filtroCategoria) return false;
    if (filtroPrecio) {
      const [min, max] = filtroPrecio.split('-').map(Number);
      const precio = precioFinal(p);
      if (precio < min || precio > max) return false;
    }
    if (term) {
      const haystack = normalizar(`${p.nombre} ${p.meta} ${CATEGORIAS_INFO[p.categoria].nombre}`);
      if (!haystack.includes(term)) return false;
    }
    return true;
  });
}

function renderCatalogo({ resetPagina = false } = {}) {
  if (resetPagina) paginaActual = PAGE_SIZE;
  const grid = document.getElementById('catalogoGrid');
  const sinResultados = document.getElementById('sinResultados');
  const count = document.getElementById('resultadosCount');
  const verMas = document.getElementById('verMas');
  const lista = productosFiltrados();

  count.textContent = `${lista.length} producto${lista.length === 1 ? '' : 's'} encontrado${lista.length === 1 ? '' : 's'}`;

  if (!lista.length) {
    grid.innerHTML = '';
    sinResultados.classList.add('show');
    sinResultados.hidden = false;
    verMas.hidden = true;
    return;
  }
  sinResultados.classList.remove('show');
  sinResultados.hidden = true;

  const visibles = lista.slice(0, paginaActual);
  grid.innerHTML = visibles.map(p => prodCardHtml(p)).join('');
  initProdCardActions(grid);
  revelarNuevos(grid);

  verMas.hidden = visibles.length >= lista.length;
}

function revelarNuevos(cont) {
  if (!revealsListos) return;
  const items = cont.querySelectorAll(':scope > [data-animate]');
  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initCatalogo() {
  document.getElementById('buscador').addEventListener('input', e => {
    terminoBusqueda = e.target.value;
    renderCatalogo({ resetPagina: true });
    syncLimpiarFiltros();
  });

  document.querySelectorAll('[data-filter-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      filtroCategoria = chip.dataset.filterCat;
      renderCatalogo({ resetPagina: true });
      syncLimpiarFiltros();
      if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  });

  document.getElementById('filtroPrecio').addEventListener('change', e => {
    filtroPrecio = e.target.value;
    renderCatalogo({ resetPagina: true });
    syncLimpiarFiltros();
  });

  document.getElementById('limpiarFiltros').addEventListener('click', resetFiltros);
  document.getElementById('sinResultadosReset').addEventListener('click', resetFiltros);

  document.getElementById('verMas').addEventListener('click', () => {
    paginaActual += PAGE_SIZE;
    renderCatalogo();
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  });

  const filtrosToggle = document.getElementById('filtrosToggle');
  const filtrosPanel = document.getElementById('filtrosPanel');
  filtrosToggle.addEventListener('click', () => {
    const abierto = filtrosPanel.classList.toggle('open');
    filtrosToggle.setAttribute('aria-expanded', String(abierto));
  });

  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      filtroCategoria = cat;
      document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === cat));
      renderCatalogo({ resetPagina: true });
      document.getElementById('tienda').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  renderCatalogo();
}

function syncLimpiarFiltros() {
  const activo = filtroCategoria !== 'todos' || filtroPrecio || terminoBusqueda.trim();
  document.getElementById('limpiarFiltros').hidden = !activo;
}

function resetFiltros() {
  filtroCategoria = 'todos'; filtroPrecio = ''; terminoBusqueda = '';
  document.getElementById('buscador').value = '';
  document.getElementById('filtroPrecio').value = '';
  document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === 'todos'));
  renderCatalogo({ resetPagina: true });
  syncLimpiarFiltros();
}

function newsCardHtml(n) {
  return `
  <article class="news-card" data-open-news="${n.slug}" data-animate style="opacity:0;transform:translateY(28px)">
    <div class="news-media">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 5-5 4 3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="9" r="1.3" fill="currentColor" stroke="none"/></svg>
    </div>
    <div class="news-body">
      <span class="news-tag">${esc(n.tag)}</span>
      <h3 class="news-title">${esc(n.titulo)}</h3>
      <p class="news-excerpt">${esc(n.excerpt)}</p>
    </div>
  </article>`;
}

function initNoticias() {
  const grid = document.getElementById('noticiasGrid');
  grid.innerHTML = NOTICIAS.map(newsCardHtml).join('');
  grid.querySelectorAll('[data-open-news]').forEach(el => {
    el.addEventListener('click', () => openNoticiaModal(el.dataset.openNews));
  });
}

let lastFocusedEl = null;

function openProductoModal(id) {
  const p = getProducto(id);
  if (!p) return;
  const precio = precioFinal(p);
  const body = document.getElementById('pmBody');
  body.innerHTML = `
    <div class="pm-grid">
      <div class="pm-media prod-${p.categoria}">
        ${ICONOS_SVG[p.categoria]}
      </div>
      <div>
        <span class="pm-cat">${CATEGORIAS_INFO[p.categoria].nombre}</span>
        <h2 class="pm-title" id="pmTitle">${esc(p.nombre)}</h2>
        <div class="pm-meta">
          <span>${esc(p.meta)}</span>
        </div>
        <p class="pm-desc">Elaborado a mano en pequeños lotes, con mezcla en frío y curado lento. Envíos a todo el país, pago por Mercado Pago o transferencia.</p>
        <div class="pm-precio-row">
          <span class="pm-precio">${formatearPrecio(precio)}</span>
          ${p.descuento > 0 ? `<s class="prod-precio-orig">${formatearPrecio(p.precio)}</s><span class="prod-badge" style="position:static">-${p.descuento}%</span>` : ''}
        </div>
        <div class="pm-actions">
          <div class="stepper" data-stepper="modal-${p.id}">
            <button type="button" data-step-down aria-label="Restar cantidad">−</button>
            <span data-step-value>1</span>
            <button type="button" data-step-up aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="prod-add" data-add="${p.id}" style="flex:0 0 auto;padding-inline:1.3rem">Agregar al carrito</button>
          <button type="button" class="pm-comprar" id="pmComprar">Comprar ahora</button>
        </div>
      </div>
    </div>`;
  productoModalEls.modal.setAttribute('aria-labelledby', 'pmTitle');
  initProdCardActions(body);
  document.getElementById('pmComprar').addEventListener('click', () => {
    const stepper = body.querySelector(`[data-stepper="modal-${p.id}"]`);
    const qty = stepper?._getQty ? stepper._getQty() : 1;
    Cart.add(p, qty);
    closeModal(productoModalEls);
    openCartDrawer();
  });
  openModal(productoModalEls);
}

function openNoticiaModal(slug) {
  const n = NOTICIAS.find(x => x.slug === slug);
  if (!n) return;
  const body = document.getElementById('nmBody');
  body.innerHTML = `
    <div class="nm-media">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15l5-4 4 3 5-5 4 3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="9" r="1.3" fill="currentColor" stroke="none"/></svg>
    </div>
    <span class="nm-tag">${esc(n.tag)}</span>
    <h2 class="nm-title" id="nmTitle">${esc(n.titulo)}</h2>
    <div class="nm-text">${n.cuerpo.map(p => `<p>${esc(p)}</p>`).join('')}</div>`;
  noticiaModalEls.modal.setAttribute('aria-labelledby', 'nmTitle');
  openModal(noticiaModalEls);
}

function buildModalControllers(modalId, backdropId, closeId) {
  const modal = document.getElementById(modalId);
  const backdrop = document.getElementById(backdropId);
  const closeBtn = document.getElementById(closeId);
  return { modal, backdrop, closeBtn };
}
const productoModalEls = buildModalControllers('productoModal', 'modalBackdrop', 'pmClose');
const noticiaModalEls = buildModalControllers('noticiaModal', 'newsBackdrop', 'nmClose');

function openModal({ modal, backdrop }) {
  lastFocusedEl = document.activeElement;
  modal.removeAttribute('inert');
  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  modal.querySelector('.modal-close')?.focus();
}
function closeModal({ modal, backdrop }) {
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  modal.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
  lastFocusedEl?.focus?.();
}
function initModals() {
  [productoModalEls, noticiaModalEls].forEach(els => {
    els.closeBtn.addEventListener('click', () => closeModal(els));
    els.backdrop.addEventListener('click', () => closeModal(els));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (productoModalEls.modal.classList.contains('open')) closeModal(productoModalEls);
    if (noticiaModalEls.modal.classList.contains('open')) closeModal(noticiaModalEls);
    if (cartDrawerEls.drawer.classList.contains('open')) closeCartDrawer();
  });
}

const cartDrawerEls = { drawer: null, backdrop: null };
function openCartDrawer() {
  cartDrawerEls.drawer.removeAttribute('inert');
  cartDrawerEls.drawer.classList.add('open');
  cartDrawerEls.backdrop.classList.add('open');
  document.body.classList.add('no-scroll');
  window.lenis?.stop();
  renderCartDrawer();
  cartDrawerEls.drawer.querySelector('.drawer-close')?.focus();
}
function closeCartDrawer() {
  cartDrawerEls.drawer.classList.remove('open');
  cartDrawerEls.backdrop.classList.remove('open');
  cartDrawerEls.drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  window.lenis?.start();
}

function renderCartDrawer() {
  const body = document.getElementById('cartBody');
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/></svg>
      <p>Todavía no agregaste ningún producto.<br>Cuando encuentres el tuyo, va a aparecer acá.</p>
    </div>`;
  } else {
    body.innerHTML = items.map(it => {
      const p = getProducto(it.id);
      if (!p) return '';
      const precio = precioFinal(p);
      return `
      <div class="cart-item" data-cart-item="${p.id}">
        <div class="cart-item-thumb prod-${p.categoria}">${ICONOS_SVG[p.categoria]}</div>
        <div class="cart-item-info">
          <p class="cart-item-nombre">${esc(p.nombre)}</p>
          <p class="cart-item-precio">${formatearPrecio(precio)}</p>
          <div class="cart-item-row">
            <div class="stepper" data-drawer-stepper="${p.id}">
              <button type="button" data-drawer-down aria-label="Restar cantidad">−</button>
              <span>${it.qty}</span>
              <button type="button" data-drawer-up aria-label="Sumar cantidad">+</button>
            </div>
            <button type="button" class="cart-item-remove" data-remove="${p.id}">Quitar</button>
          </div>
        </div>
      </div>`;
    }).join('');
    body.querySelectorAll('[data-drawer-down]').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.closest('[data-drawer-stepper]').dataset.drawerStepper, 10);
      const it = Cart.get().find(i => i.id === id);
      Cart.setQty(id, (it?.qty || 1) - 1);
      renderCartDrawer();
    }));
    body.querySelectorAll('[data-drawer-up]').forEach(b => b.addEventListener('click', () => {
      const id = parseInt(b.closest('[data-drawer-stepper]').dataset.drawerStepper, 10);
      const it = Cart.get().find(i => i.id === id);
      Cart.setQty(id, (it?.qty || 1) + 1);
      renderCartDrawer();
    }));
    body.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
      Cart.remove(parseInt(b.dataset.remove, 10));
      renderCartDrawer();
    }));
  }
  document.getElementById('cartTotal').textContent = formatearPrecio(Cart.total());
}

function initCartDrawer() {
  cartDrawerEls.drawer = document.getElementById('cartDrawer');
  cartDrawerEls.backdrop = document.getElementById('cartBackdrop');
  document.getElementById('cart-btn').addEventListener('click', openCartDrawer);
  document.getElementById('cart-float').addEventListener('click', openCartDrawer);
  document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
  cartDrawerEls.backdrop.addEventListener('click', closeCartDrawer);
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!Cart.count()) { showToast('Tu carrito está vacío'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (cartDrawerEls.drawer.classList.contains('open')) renderCartDrawer(); });
}

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
  sync();
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
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
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
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
    revealsListos = true;
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
  revealsListos = true;
}

function initProceso() {
  const pasos = [...document.querySelectorAll('.pp-item')];
  const stepNo = document.querySelector('.pv-step-no');
  const label = document.querySelector('.pv-label');
  const dots = [...document.querySelectorAll('.pv-dot')];
  if (!pasos.length) return;

  const setStep = idx => {
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === idx));
    if (stepNo) stepNo.textContent = String(idx + 1).padStart(2, '0');
    if (label) label.textContent = pasos[idx].querySelector('h3').textContent;
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    setStep(0);
    return;
  }

  pasos.forEach((paso, i) => {
    ScrollTrigger.create({
      trigger: paso,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setStep(i),
      onEnterBack: () => setStep(i),
    });
  });
  setStep(0);
}

function initHeroAnim() {
  if (typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-kicker', { opacity: 1, y: 0, duration: .7 })
    .to('.hero-title', { opacity: 1, y: 0, duration: .9 }, '-=0.5')
    .to('.hero-sub', { opacity: 1, y: 0, duration: .7 }, '-=0.55')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: .6 }, '-=0.45')
    .to('.hero-media', { opacity: 1, scale: 1, rotate: 0, duration: 1.1 }, '-=0.9');
}

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });
}

function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = '2026';
}

initAntiCopia();

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  initRail();
  initNoticias();
  initCatalogo();
  initReveals();
  initModals();
  initCartDrawer();
  initNav();
  initFloats();
  initWspFloat();
  initProceso();
  initHeroAnim();
  initFooterYear();
  updateCartBadge();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
