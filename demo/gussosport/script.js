const WHATSAPP_NUMBER = '5493814638511';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const formatearFecha = iso => {
  const [y, m, d] = iso.split('-');
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${parseInt(d, 10)} ${meses[parseInt(m, 10) - 1]}`;
};
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const CATEGORIAS_INFO = {
  rugby: { nombre: 'Rugby', claseIcono: 'icon-rugby' },
  hockey: { nombre: 'Hockey', claseIcono: 'icon-hockey' },
  atletismo: { nombre: 'Atletismo', claseIcono: 'icon-atletismo' },
};

const ICONOS_SVG = {
  rugby: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><ellipse cx="12" cy="12" rx="9.2" ry="5.4" transform="rotate(-42 12 12)"/><path d="M6.8 6.8 17.2 17.2M9 6.2l1 2M14 15.8l1 2M6.2 9l2 1M15.8 14l2 1" stroke-linecap="round"/></svg>',
  hockey: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M8 4v10.5a2.5 2.5 0 0 0 4.6 1.4L18 8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.5" cy="18.5" r="1.6" fill="currentColor" stroke="none"/></svg>',
  atletismo: '<svg class="cat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="13" r="7.2"/><path d="M12 13V9.2M12 13l3 1.8M10 3.6h4M9.5 5.6l1-1.7M14.5 5.6l-1-1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const CART_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';

const PRODUCTOS = [
  { id: 1, slug: 'try-ingoal-yerbabuena-cardones', nombre: 'Try en el ingoal', categoria: 'rugby', club: 'Yerba Buena RC vs Los Cardones RC', torneo: 'Torneo Regional NOA · Fecha 5', fecha: '2026-08-16', precio: 4200, descuento: 0, stock: 20 },
  { id: 2, slug: 'scrum-22-tucumansur-union', nombre: 'Scrum en los 22', categoria: 'rugby', club: 'Tucumán Sur RC vs Unión Norte RC', torneo: 'Torneo Regional NOA · Fecha 6', fecha: '2026-08-23', precio: 4500, descuento: 15, stock: 20 },
  { id: 3, slug: 'lineout-tafiviejo-yerbabuena', nombre: 'Line out ganado', categoria: 'rugby', club: 'Tafí Viejo RC vs Yerba Buena RC', torneo: 'Copa Apertura NOA', fecha: '2026-08-09', precio: 4500, descuento: 0, stock: 20 },
  { id: 4, slug: 'tackle-cardones-tucumansur', nombre: 'Tackle decisivo', categoria: 'rugby', club: 'Los Cardones RC vs Tucumán Sur RC', torneo: 'Torneo Regional NOA · Fecha 4', fecha: '2026-08-02', precio: 3900, descuento: 0, stock: 20 },
  { id: 5, slug: 'maul-union-tafiviejo', nombre: 'Formación de maul', categoria: 'rugby', club: 'Unión Norte RC vs Tafí Viejo RC', torneo: 'Torneo Regional NOA · Fecha 6', fecha: '2026-08-23', precio: 4100, descuento: 0, stock: 20 },
  { id: 6, slug: 'patada-yerbabuena-union', nombre: 'Patada a los palos', categoria: 'rugby', club: 'Yerba Buena RC vs Unión Norte RC', torneo: 'Copa Apertura NOA', fecha: '2026-08-16', precio: 3700, descuento: 10, stock: 20 },
  { id: 7, slug: 'ruck-cardones-tafiviejo', nombre: 'Ruck disputado', categoria: 'rugby', club: 'Los Cardones RC vs Tafí Viejo RC', torneo: 'Torneo Regional NOA · Fecha 3', fecha: '2026-07-26', precio: 3700, descuento: 0, stock: 20 },
  { id: 8, slug: 'pase-union-cardones', nombre: 'Pase a la mano', categoria: 'rugby', club: 'Unión Norte RC vs Los Cardones RC', torneo: 'Copa Apertura NOA', fecha: '2026-08-09', precio: 4000, descuento: 0, stock: 20 },
  { id: 9, slug: 'definicion-circulo-yerbabuena-norte', nombre: 'Definición en el círculo', categoria: 'hockey', club: 'Yerba Buena HC vs Norte Hockey Unión', torneo: 'Liga Tucumana Femenino · Fecha 5', fecha: '2026-08-15', precio: 4200, descuento: 0, stock: 20 },
  { id: 10, slug: 'atajada-termas-tucumansur', nombre: 'Atajada bajo los tres palos', categoria: 'hockey', club: 'Las Termas HC vs Tucumán Sur HC', torneo: 'Liga Tucumana Femenino · Fecha 6', fecha: '2026-08-22', precio: 4500, descuento: 0, stock: 20 },
  { id: 11, slug: 'corto-norte-yerbabuena', nombre: 'Corto esquina', categoria: 'hockey', club: 'Norte Hockey Unión vs Yerba Buena HC', torneo: 'Liga Tucumana Femenino · Fecha 4', fecha: '2026-08-08', precio: 3800, descuento: 0, stock: 20 },
  { id: 12, slug: 'salida-tucumansur-termas', nombre: 'Salida jugada desde el fondo', categoria: 'hockey', club: 'Tucumán Sur HC vs Las Termas HC', torneo: 'Interclubes NOA', fecha: '2026-08-25', precio: 4000, descuento: 15, stock: 20 },
  { id: 13, slug: 'festejo-yerbabuena-termas', nombre: 'Festejo de gol', categoria: 'hockey', club: 'Yerba Buena HC vs Las Termas HC', torneo: 'Liga Tucumana Femenino · Fecha 6', fecha: '2026-08-22', precio: 4300, descuento: 0, stock: 20 },
  { id: 14, slug: 'marca-termas-norte', nombre: 'Marca cerrada', categoria: 'hockey', club: 'Las Termas HC vs Norte Hockey Unión', torneo: 'Liga Tucumana Femenino · Fecha 4', fecha: '2026-08-08', precio: 3900, descuento: 0, stock: 20 },
  { id: 15, slug: 'paloapalo-tucumansur-yerbabuena', nombre: 'Palo a palo', categoria: 'hockey', club: 'Tucumán Sur HC vs Yerba Buena HC', torneo: 'Interclubes NOA', fecha: '2026-08-25', precio: 4100, descuento: 20, stock: 20 },
  { id: 16, slug: 'la-salida-10k-tucuman', nombre: 'La salida', categoria: 'atletismo', club: '10K Ciudad de San Miguel de Tucumán', torneo: 'Circuito Atlético NOA', fecha: '2026-08-09', precio: 3500, descuento: 0, stock: 20 },
  { id: 17, slug: 'subida-cerro-aconquija', nombre: 'Subida al cerro', categoria: 'atletismo', club: 'Cross Aconquija · Circuito Trail', torneo: 'Circuito Atlético NOA', fecha: '2026-08-16', precio: 3900, descuento: 0, stock: 20 },
  { id: 18, slug: 'ultimo-tramo-maraton-tucuman', nombre: 'Último tramo', categoria: 'atletismo', club: 'Maratón Tucumán 21K', torneo: 'Circuito Atlético NOA', fecha: '2026-08-23', precio: 4000, descuento: 0, stock: 20 },
  { id: 19, slug: 'posta-relevos-yerbabuena', nombre: 'Posta de relevos', categoria: 'atletismo', club: 'Encuentro Atlético Yerba Buena', torneo: 'Circuito Atlético NOA', fecha: '2026-07-30', precio: 3600, descuento: 10, stock: 20 },
  { id: 20, slug: 'foto-llegada-10k-tucuman', nombre: 'Foto de llegada', categoria: 'atletismo', club: '10K Ciudad de San Miguel de Tucumán', torneo: 'Circuito Atlético NOA', fecha: '2026-08-09', precio: 3800, descuento: 0, stock: 20 },
];

const DESTACADOS_IDS = [1, 9, 6, 10, 18, 3, 12, 19];

const NOTICIAS = [
  {
    slug: 'resolucion-imprimir', tag: 'Guía',
    titulo: 'Cómo elegir la resolución correcta para imprimir tu foto',
    excerpt: 'Web, cuadro chico o poster grande: qué versión pedir según dónde la vayas a usar.',
    cuerpo: [
      'Todas las fotos de GussoSport se entregan en alta resolución, lista tanto para compartir en redes como para mandar a imprimir.',
      'Si la idea es un cuadro o un poster grande, cuanto más lejos se vaya a mirar la foto, menos se nota la definición — para un cuadro de escritorio o una foto de perfil, la resolución estándar de entrega sobra sin problema.',
      'Ante la duda, un mensaje por WhatsApp con la medida que estás pensando alcanza para confirmar que la foto rinde bien impresa.',
    ],
  },
  {
    slug: 'galeria-torneo-regional', tag: 'Novedades',
    titulo: 'Ya está la galería del Torneo Regional NOA',
    excerpt: 'Rugby y hockey de las últimas fechas, cargados y listos para buscar tu jugada.',
    cuerpo: [
      'Se subieron las fotos de las últimas fechas del Torneo Regional NOA, tanto de rugby como de hockey.',
      'Podés filtrar por club o por fecha desde el catálogo para encontrar más rápido la jugada que buscás.',
      'Si jugaste y no encontrás tu foto, escribí por WhatsApp — puede que todavía esté en proceso de carga.',
    ],
  },
  {
    slug: 'agenda-septiembre', tag: 'Agenda',
    titulo: 'Agenda de coberturas: lo que viene en septiembre',
    excerpt: 'Las próximas fechas de rugby, hockey y atletismo que va a cubrir GussoSport.',
    cuerpo: [
      'Septiembre viene cargado: nuevas fechas del Torneo Regional NOA y de la Liga Tucumana de hockey, además de una carrera de calle en el circuito de atletismo.',
      'Las galerías de cada evento se suben apenas terminan de editarse, normalmente dentro de las 48 horas.',
      'Para coordinar la cobertura de un evento puntual, el contacto directo es por WhatsApp.',
    ],
  },
  {
    slug: 'sin-marca-agua', tag: 'Cómo funciona',
    titulo: 'Por qué el catálogo no muestra la foto completa antes de la compra',
    excerpt: 'En cada ficha se ve el dato de la jugada — club, torneo y fecha — para que protejas tu compra sin exponer el archivo.',
    cuerpo: [
      'Para proteger el trabajo, el catálogo de GussoSport no exhibe la imagen completa de cada foto: se ve el deporte, el club, el torneo y la fecha, suficiente para identificar tu jugada antes de comprarla.',
      'Apenas se acredita el pago, ya sea por Mercado Pago o por transferencia, la foto en alta resolución se envía por mail o WhatsApp — esa es la primera vez que se ve completa.',
      'No hace falta esperar a que termine el evento: la entrega es apenas se confirma cada pago, foto por foto.',
    ],
  },
];

const Cart = {
  KEY: 'gussosport_cart',
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

function prodCardHtml(p, frameNo) {
  const precio = precioFinal(p);
  const tieneDescuento = p.descuento > 0;
  return `
  <article class="prod-card prod-${p.categoria}" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(28px)">
    <div class="prod-media" data-open-modal="${p.id}">
      <span class="vf-corner vf-tl"></span><span class="vf-corner vf-tr"></span><span class="vf-corner vf-bl"></span><span class="vf-corner vf-br"></span>
      <span class="prod-frame-no">N.º ${String(frameNo).padStart(4, '0')}</span>
      ${tieneDescuento ? `<span class="prod-badge">-${p.descuento}%</span>` : ''}
      ${ICONOS_SVG[p.categoria]}
    </div>
    <div class="prod-body">
      <span class="prod-cat">${CATEGORIAS_INFO[p.categoria].nombre}</span>
      <h3 class="prod-nombre" data-open-modal="${p.id}">${esc(p.nombre)}</h3>
      <span class="prod-meta">${esc(p.club)} · ${formatearFecha(p.fecha)}</span>
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
  track.innerHTML = DESTACADOS_IDS.map((id, i) => prodCardHtml(getProducto(id), id * 7 + 100)).join('');
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
  const cardWidth = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 18;
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
    stepper.dataset.getQty = '';
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
let filtroClub = '';
let terminoBusqueda = '';
let revealsListos = false;

function productosFiltrados() {
  const term = normalizar(terminoBusqueda.trim());
  return PRODUCTOS.filter(p => {
    if (filtroCategoria !== 'todos' && p.categoria !== filtroCategoria) return false;
    if (filtroClub && p.club !== filtroClub) return false;
    if (term) {
      const haystack = normalizar(`${p.nombre} ${p.club} ${p.torneo} ${CATEGORIAS_INFO[p.categoria].nombre}`);
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

  count.textContent = `${lista.length} foto${lista.length === 1 ? '' : 's'} encontrada${lista.length === 1 ? '' : 's'}`;

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
  grid.innerHTML = visibles.map(p => prodCardHtml(p, p.id * 11 + 200)).join('');
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
  const clubSelect = document.getElementById('filtroClub');
  const clubes = [...new Set(PRODUCTOS.map(p => p.club))].sort((a, b) => a.localeCompare(b, 'es'));
  clubSelect.innerHTML = '<option value="">Todos</option>' + clubes.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');

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

  clubSelect.addEventListener('change', e => {
    filtroClub = e.target.value;
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
  const activo = filtroCategoria !== 'todos' || filtroClub || terminoBusqueda.trim();
  document.getElementById('limpiarFiltros').hidden = !activo;
}

function resetFiltros() {
  filtroCategoria = 'todos'; filtroClub = ''; terminoBusqueda = '';
  document.getElementById('buscador').value = '';
  document.getElementById('filtroClub').value = '';
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
        <span class="vf-corner vf-tl"></span><span class="vf-corner vf-tr"></span><span class="vf-corner vf-bl"></span><span class="vf-corner vf-br"></span>
        ${ICONOS_SVG[p.categoria]}
      </div>
      <div>
        <span class="pm-cat">${CATEGORIAS_INFO[p.categoria].nombre}</span>
        <h2 class="pm-title" id="pmTitle">${esc(p.nombre)}</h2>
        <div class="pm-meta">
          <span>${esc(p.club)}</span>
          <span>${esc(p.torneo)} · ${formatearFecha(p.fecha)}</span>
        </div>
        <p class="pm-desc">Descarga digital en alta resolución, sin marca de agua. Se entrega por mail o WhatsApp apenas se acredita el pago con Mercado Pago o transferencia.</p>
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

const cartDrawerEls = {
  drawer: null, backdrop: null,
};
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
      <p>Todavía no agregaste ninguna foto.<br>Cuando encuentres tu jugada, va a aparecer acá.</p>
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

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
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
  const items = document.querySelectorAll('[data-animate]:not(.hero *)');
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
  const stage = document.getElementById('procesoStage');
  const pasos = [...document.querySelectorAll('.pp-item')];
  const stepNo = document.querySelector('.pv-step-no');
  const label = document.querySelector('.pv-label');
  const dots = [...document.querySelectorAll('.pv-dot')];
  if (!stage || !pasos.length) return;

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
  tl.to('.hero-media', { opacity: 1, scale: 1, duration: 1.3 })
    .to('.hero-kicker', { opacity: 1, y: 0, duration: .7 }, '-=0.9')
    .to('.hero-title', { opacity: 1, y: 0, duration: .9 }, '-=0.55')
    .to('.hero-sub', { opacity: 1, y: 0, duration: .7 }, '-=0.55')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: .6 }, '-=0.45');
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
