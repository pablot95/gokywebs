/* global getComputedStyle */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const IMG = {
  bolsos: 'images/bolso-mochila-cuero-1200x1200.webp',
  carteras: 'images/cartera-billetera-cuero-1200x1200.webp',
  rinoneras: 'images/rinonera-bandolera-cuero-1200x1200.webp',
  gimnasio: 'images/accesorio-gimnasio-cinto-1200x1200.webp',
  bushcraft: 'images/funda-cuchillo-bushcraft-1200x1200.webp',
};

const CATEGORIAS = [
  { id: 'bolsos-mochilas', nombre: 'Bolsos y Mochilas', desc: 'Para llevar todo el día, sin perder la forma.', img: IMG.bolsos },
  { id: 'carteras-billeteras', nombre: 'Carteras y Billeteras', desc: 'Lo esencial, en un cuero que envejece bien.', img: IMG.carteras },
  { id: 'rinoneras-bandoleras', nombre: 'Riñoneras y Bandoleras', desc: 'Las manos libres, sin resignar estilo.', img: IMG.rinoneras },
  { id: 'gimnasio', nombre: 'Accesorios de Gimnasio', desc: 'Cuero pensado para aguantar carga real.', img: IMG.gimnasio },
  { id: 'bushcraft', nombre: 'Bushcraft y Outdoor', desc: 'Para el monte, el río o donde los lleves.', img: IMG.bushcraft },
];

const PRODUCTOS = [
  { id: 'p01', slug: 'mochila-cuero-lona-encerada', nombre: 'Mochila Cuero y Lona Encerada', categoria: 'bolsos-mochilas', color: 'marron', precio: 89900, descuento: 0, stock: 10, personalizable: true, nuevo: false, destacado: true, img: IMG.bolsos, descripcion: 'Lona encerada y cuero curtido, con bolsillo frontal a tapa y costura guarnicionera en los bordes.' },
  { id: 'p02', slug: 'mochila-portadocumentos-cuero', nombre: 'Mochila Portadocumentos de Cuero', categoria: 'bolsos-mochilas', color: 'marron', precio: 96500, descuento: 0, stock: 8, personalizable: true, nuevo: false, destacado: false, img: IMG.bolsos, descripcion: 'Compartimento para notebook de hasta 15 pulgadas y bolsillo interno para documentos.' },
  { id: 'p03', slug: 'bolso-weekender-cuero', nombre: 'Bolso Weekender de Cuero', categoria: 'bolsos-mochilas', color: 'marron', precio: 134000, descuento: 10, stock: 6, personalizable: true, nuevo: true, destacado: true, img: IMG.bolsos, descripcion: 'Para un fin de semana largo: cuerpo de cuero grueso y manijas reforzadas a mano.' },
  { id: 'p04', slug: 'mochila-urbana-cuero-lona', nombre: 'Mochila Urbana Cuero y Lona', categoria: 'bolsos-mochilas', color: 'negro', precio: 78500, descuento: 0, stock: 12, personalizable: false, nuevo: false, destacado: false, img: IMG.bolsos, descripcion: 'Uso diario, con cierre a la vista y base reforzada en cuero.' },
  { id: 'p05', slug: 'bolso-tote-cuero-curtido', nombre: 'Bolso Tote de Cuero Curtido', categoria: 'bolsos-mochilas', color: 'tostado', precio: 72000, descuento: 0, stock: 9, personalizable: false, nuevo: false, destacado: false, img: IMG.bolsos, descripcion: 'Un solo cuerpo, sin forro interior — el cuero al desnudo, con sus marcas naturales.' },
  { id: 'p06', slug: 'mochila-portanotebook-15', nombre: 'Mochila Portanotebook 15"', categoria: 'bolsos-mochilas', color: 'marron', precio: 99900, descuento: 0, stock: 7, personalizable: true, nuevo: false, destacado: false, img: IMG.bolsos, descripcion: 'Bolsillo acolchado para notebook, cuerpo de cuero curtido al tanino.' },
  { id: 'p07', slug: 'bolso-baul-viaje', nombre: 'Bolso Baúl de Viaje', categoria: 'bolsos-mochilas', color: 'negro', precio: 128000, descuento: 15, stock: 4, personalizable: true, nuevo: false, destacado: false, img: IMG.bolsos, descripcion: 'Para el que viaja liviano pero no quiere resignar espacio ni forma.' },

  { id: 'p08', slug: 'billetera-clasica-cuero', nombre: 'Billetera Clásica de Cuero', categoria: 'carteras-billeteras', color: 'tostado', precio: 24500, descuento: 0, stock: 25, personalizable: true, nuevo: false, destacado: false, img: IMG.carteras, descripcion: 'Seis tarjeteros, compartimento para billetes y costura guarnicionera vista.' },
  { id: 'p09', slug: 'billetera-portamonedas', nombre: 'Billetera con Portamonedas', categoria: 'carteras-billeteras', color: 'marron', precio: 26900, descuento: 0, stock: 20, personalizable: true, nuevo: false, destacado: true, img: IMG.carteras, descripcion: 'El clásico de siempre, con broche a presión para las monedas.' },
  { id: 'p10', slug: 'tarjetero-cuero-curtido', nombre: 'Tarjetero de Cuero Curtido', categoria: 'carteras-billeteras', color: 'marron', precio: 16500, descuento: 0, stock: 30, personalizable: true, nuevo: false, destacado: false, img: IMG.carteras, descripcion: 'Para el que no necesita billetera — cuatro tarjetas, medida justa.' },
  { id: 'p11', slug: 'cartera-sobre-cuero', nombre: 'Cartera Sobre de Cuero', categoria: 'carteras-billeteras', color: 'negro', precio: 31000, descuento: 0, stock: 14, personalizable: false, nuevo: false, destacado: false, img: IMG.carteras, descripcion: 'Formato sobre, cierre solapa, para lo esencial del día.' },
  { id: 'p12', slug: 'billetera-slim-minimalista', nombre: 'Billetera Slim Minimalista', categoria: 'carteras-billeteras', color: 'tostado', precio: 22000, descuento: 0, stock: 18, personalizable: false, nuevo: true, destacado: true, img: IMG.carteras, descripcion: 'La mitad de grosor de una billetera común, sin perder lugar para lo importante.' },
  { id: 'p13', slug: 'portadocumentos-cuero', nombre: 'Portadocumentos de Cuero', categoria: 'carteras-billeteras', color: 'marron', precio: 27500, descuento: 10, stock: 16, personalizable: false, nuevo: false, destacado: false, img: IMG.carteras, descripcion: 'Para llevar cédula, tarjetas y algunos billetes, sin bulto de más.' },
  { id: 'p14', slug: 'monedero-cuero-broche', nombre: 'Monedero de Cuero con Broche', categoria: 'carteras-billeteras', color: 'tostado', precio: 15900, descuento: 0, stock: 3, personalizable: false, nuevo: false, destacado: false, img: IMG.carteras, descripcion: 'Chico, con broche metálico, para las monedas que nunca tienen dónde ir.' },

  { id: 'p15', slug: 'rinonera-cuero-curtido', nombre: 'Riñonera de Cuero Curtido', categoria: 'rinoneras-bandoleras', color: 'marron', precio: 39900, descuento: 0, stock: 15, personalizable: true, nuevo: false, destacado: true, img: IMG.rinoneras, descripcion: 'Correa ajustable y broche doble, para tener las manos libres.' },
  { id: 'p16', slug: 'bandolera-cruzada-cuero', nombre: 'Bandolera Cruzada de Cuero', categoria: 'rinoneras-bandoleras', color: 'negro', precio: 45500, descuento: 0, stock: 11, personalizable: true, nuevo: false, destacado: false, img: IMG.rinoneras, descripcion: 'Correa larga ajustable, cuerpo compacto para lo justo y necesario.' },
  { id: 'p17', slug: 'rinonera-doble-broche', nombre: 'Riñonera Doble Broche', categoria: 'rinoneras-bandoleras', color: 'marron', precio: 42000, descuento: 0, stock: 9, personalizable: false, nuevo: false, destacado: false, img: IMG.rinoneras, descripcion: 'Dos solapas con broche, separadas para ordenar mejor lo que llevás.' },
  { id: 'p18', slug: 'bandolera-portacelular', nombre: 'Bandolera Portacelular', categoria: 'rinoneras-bandoleras', color: 'marron', precio: 34500, descuento: 0, stock: 13, personalizable: false, nuevo: true, destacado: false, img: IMG.rinoneras, descripcion: 'Medida exacta para el celular, la billetera y poco más.' },
  { id: 'p19', slug: 'rinonera-urbana-cuero', nombre: 'Riñonera Urbana de Cuero', categoria: 'rinoneras-bandoleras', color: 'negro', precio: 38000, descuento: 12, stock: 8, personalizable: false, nuevo: false, destacado: false, img: IMG.rinoneras, descripcion: 'Para moverse en bici o caminando, sin nada colgando de más.' },
  { id: 'p20', slug: 'bandolera-mini-cuero', nombre: 'Bandolera Mini de Cuero', categoria: 'rinoneras-bandoleras', color: 'tostado', precio: 31500, descuento: 0, stock: 0, personalizable: false, nuevo: false, destacado: false, img: IMG.rinoneras, descripcion: 'La más chica de la línea — solo para lo indispensable.' },

  { id: 'p21', slug: 'cinturon-fuerza-cuero', nombre: 'Cinturón de Fuerza de Cuero', categoria: 'gimnasio', color: 'marron', precio: 36500, descuento: 0, stock: 16, personalizable: true, nuevo: false, destacado: true, img: IMG.gimnasio, descripcion: 'Cuero grueso de una sola capa, para sentir el apoyo real en la zona lumbar.' },
  { id: 'p22', slug: 'straps-cuero-pesas', nombre: 'Straps de Cuero para Pesas', categoria: 'gimnasio', color: 'negro', precio: 22800, descuento: 0, stock: 20, personalizable: false, nuevo: false, destacado: false, img: IMG.gimnasio, descripcion: 'Agarre firme para levantamientos pesados, cosidos a mano en cada extremo.' },
  { id: 'p23', slug: 'cinturon-powerlifting-reforzado', nombre: 'Cinturón Powerlifting Reforzado', categoria: 'gimnasio', color: 'marron', precio: 41000, descuento: 0, stock: 10, personalizable: true, nuevo: false, destacado: false, img: IMG.gimnasio, descripcion: 'Hebilla simple y cuero de alto espesor, pensado para cargas máximas.' },
  { id: 'p24', slug: 'munequeras-cuero-entrenar', nombre: 'Muñequeras de Cuero para Entrenar', categoria: 'gimnasio', color: 'negro', precio: 19500, descuento: 0, stock: 18, personalizable: false, nuevo: false, destacado: false, img: IMG.gimnasio, descripcion: 'Sostén para la muñeca en press y levantamientos, ajuste con hebilla.' },
  { id: 'p25', slug: 'cinturon-levantamiento-angosto', nombre: 'Cinturón de Levantamiento Angosto', categoria: 'gimnasio', color: 'tostado', precio: 33000, descuento: 10, stock: 12, personalizable: false, nuevo: true, destacado: false, img: IMG.gimnasio, descripcion: 'Más flexible que el de powerlifting, para movimientos con más rango.' },

  { id: 'p26', slug: 'funda-cuero-cuchillo', nombre: 'Funda de Cuero para Cuchillo', categoria: 'bushcraft', color: 'negro', precio: 27500, descuento: 0, stock: 14, personalizable: true, nuevo: false, destacado: true, img: IMG.bushcraft, descripcion: 'Molde ajustado al filo, costura guarnicionera y presilla para el cinturón.' },
  { id: 'p27', slug: 'portahacha-cuero', nombre: 'Portahacha de Cuero', categoria: 'bushcraft', color: 'negro', precio: 32000, descuento: 0, stock: 9, personalizable: true, nuevo: false, destacado: false, img: IMG.bushcraft, descripcion: 'Cubre el filo del hacha y se sujeta a la mochila o al cinturón.' },
  { id: 'p28', slug: 'funda-multiherramienta', nombre: 'Funda para Multiherramienta', categoria: 'bushcraft', color: 'marron', precio: 21000, descuento: 0, stock: 17, personalizable: false, nuevo: false, destacado: false, img: IMG.bushcraft, descripcion: 'Compacta, con solapa a presión para que la herramienta no se salga.' },
  { id: 'p29', slug: 'cinturon-bushcraft-presillas', nombre: 'Cinturón Bushcraft con Presillas', categoria: 'bushcraft', color: 'marron', precio: 38500, descuento: 0, stock: 8, personalizable: false, nuevo: true, destacado: true, img: IMG.bushcraft, descripcion: 'Presillas para colgar funda, cantimplora o lo que lleves al monte.' },
  { id: 'p30', slug: 'funda-piedra-afilar', nombre: 'Funda de Cuero para Piedra de Afilar', categoria: 'bushcraft', color: 'negro', precio: 18500, descuento: 0, stock: 11, personalizable: false, nuevo: false, destacado: false, img: IMG.bushcraft, descripcion: 'Para llevar la piedra sin que se astille ni se moje.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const COLOR_LABEL = { marron: 'Marrón', negro: 'Negro', tostado: 'Tostado' };
const normalize = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
  KEY: 'raizcuero_cart',
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

function getBadges(p) {
  const badges = [];
  if (p.stock === 0) badges.push('<span class="badge badge-agotado">Agotado</span>');
  else if (p.stock <= 3) badges.push('<span class="badge badge-last">Últimas unidades</span>');
  if (p.descuento > 0) badges.push(`<span class="badge badge-off">-${p.descuento}%</span>`);
  if (p.nuevo) badges.push('<span class="badge badge-nuevo">Nuevo</span>');
  if (p.personalizable) badges.push('<span class="badge badge-medida">A medida</span>');
  return badges.join('');
}

function priceHTML(p) {
  const pf = precioFinal(p);
  return p.descuento > 0
    ? `<span class="price-now">${formatearPrecio(pf)}</span><s class="price-old">${formatearPrecio(p.precio)}</s>`
    : `<span class="price-now">${formatearPrecio(pf)}</span>`;
}

function cardHTML(p) {
  const agotado = p.stock === 0;
  return `
  <article class="prod-card${agotado ? ' is-agotado' : ''}" data-id="${p.id}" data-animate="up" style="transform:translateY(28px);opacity:0">
    <button type="button" class="prod-media" data-quickview="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="600" height="600" loading="lazy">
      <span class="prod-badges">${getBadges(p)}</span>
    </button>
    <div class="prod-info">
      <p class="prod-cat">${esc(catNombre(p.categoria))}</p>
      <h3 class="prod-name"><button type="button" data-quickview="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">${priceHTML(p)}</p>
      <div class="prod-actions">
        <div class="qty-stepper" data-qty="1">
          <button type="button" data-step="-1" aria-label="Restar cantidad">−</button>
          <span>1</span>
          <button type="button" data-step="1" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}"${agotado ? ' disabled' : ''}>${agotado ? 'Agotado' : 'Agregar'}</button>
      </div>
      <button type="button" class="btn-buy-desktop" data-buy="${p.id}"${agotado ? ' disabled' : ''}>Comprar ahora</button>
    </div>
  </article>`;
}

function cintaCardHTML(p) {
  return `
  <article class="cinta-card" data-id="${p.id}">
    <button type="button" class="cinta-plate" data-quickview="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="360" height="360" loading="lazy">
    </button>
    <p class="cinta-name">${esc(p.nombre)}</p>
    <p class="cinta-price">${formatearPrecio(precioFinal(p))}</p>
    <button type="button" class="cinta-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
      Agregar
    </button>
  </article>`;
}

function catCardHTML(c) {
  return `
  <a href="#tienda" class="cat-card" data-cat-jump="${c.id}" data-animate="up" style="transform:translateY(26px);opacity:0">
    <div class="cat-media"><img src="${c.img}" alt="${esc(c.nombre)}" width="400" height="500" loading="lazy"></div>
    <div class="cat-label"><p class="cat-name">${esc(c.nombre)}</p><p class="cat-desc">${esc(c.desc)}</p></div>
  </a>`;
}

const filtros = { categoria: 'todas', color: 'todos', personalizable: false, precio: 'todos', q: '' };
let visibleCount = 16;
const PAGE_SIZE = 16;

function getFiltered() {
  return PRODUCTOS.filter(p => {
    if (filtros.categoria !== 'todas' && p.categoria !== filtros.categoria) return false;
    if (filtros.color !== 'todos' && p.color !== filtros.color) return false;
    if (filtros.personalizable && !p.personalizable) return false;
    if (filtros.precio !== 'todos') {
      const [min, max] = filtros.precio.split('-').map(Number);
      const pf = precioFinal(p);
      if (pf < min || pf > max) return false;
    }
    if (filtros.q) {
      const haystack = normalize(`${p.nombre} ${catNombre(p.categoria)} ${COLOR_LABEL[p.color]} ${p.descripcion}`);
      if (!haystack.includes(normalize(filtros.q))) return false;
    }
    return true;
  });
}

let revealsListos = false;

function renderCatalogo({ resetPage = false } = {}) {
  if (resetPage) visibleCount = PAGE_SIZE;
  const grid = document.getElementById('catalogoGrid');
  const empty = document.getElementById('catalogoEmpty');
  const verMas = document.getElementById('verMasBtn');
  const count = document.getElementById('resultadosCount');
  const filtered = getFiltered();
  const visible = filtered.slice(0, visibleCount);

  grid.innerHTML = visible.map(cardHTML).join('');
  empty.hidden = filtered.length !== 0;
  verMas.hidden = visibleCount >= filtered.length;
  count.textContent = filtered.length === 0 ? '' : `${filtered.length} producto${filtered.length === 1 ? '' : 's'}`;

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderCinta() {
  const track = document.getElementById('cintaTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = destacados.map(cintaCardHTML).join('');
}

function renderCategorias() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(catCardHTML).join('');
  revelarNuevos(grid);
}

function jumpToCategoria(catId) {
  filtros.categoria = catId;
  syncChipUI('categoria', catId);
  renderCatalogo({ resetPage: true });
  document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function syncChipUI(group, value) {
  document.querySelectorAll(`[data-filter-group="${group}"] .chip`).forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.value === value);
  });
}

function initFiltroChips() {
  const catWrap = document.getElementById('filtroCategoria');
  CATEGORIAS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.value = c.id; b.textContent = c.nombre;
    catWrap.appendChild(b);
  });
  const colores = [
    { id: 'marron', label: 'Marrón' },
    { id: 'negro', label: 'Negro' },
    { id: 'tostado', label: 'Tostado' },
  ];
  const colorWrap = document.getElementById('filtroColor');
  colores.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.value = c.id; b.textContent = c.label;
    colorWrap.appendChild(b);
  });
  document.querySelectorAll('.filtro-group').forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const groupName = group.dataset.filterGroup;
      filtros[groupName] = chip.dataset.value;
      syncChipUI(groupName, chip.dataset.value);
      renderCatalogo({ resetPage: true });
    });
  });
}

function initFiltrosControles() {
  document.getElementById('filtroPersonalizable').addEventListener('change', e => {
    filtros.personalizable = e.target.checked;
    renderCatalogo({ resetPage: true });
  });
  document.getElementById('filtroPrecio').addEventListener('change', e => {
    filtros.precio = e.target.value;
    renderCatalogo({ resetPage: true });
  });
  const limpiar = () => {
    filtros.categoria = 'todas'; filtros.color = 'todos'; filtros.personalizable = false; filtros.precio = 'todos'; filtros.q = '';
    syncChipUI('categoria', 'todas'); syncChipUI('color', 'todos');
    document.getElementById('filtroPersonalizable').checked = false;
    document.getElementById('filtroPrecio').value = 'todos';
    document.getElementById('searchInput').value = '';
    renderCatalogo({ resetPage: true });
  };
  document.getElementById('limpiarFiltros').addEventListener('click', limpiar);
  document.getElementById('limpiarFiltrosEmpty').addEventListener('click', limpiar);
  document.getElementById('verMasBtn').addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    renderCatalogo();
  });
}

function wireSearch() {
  const input = document.getElementById('searchInput');
  let t;
  input.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      filtros.q = input.value;
      renderCatalogo({ resetPage: true });
    }, 180);
  });
}

function initSearchToggle() {
  document.getElementById('searchToggle')?.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('searchInput')?.focus(), 450);
  });
}

document.addEventListener('click', e => {
  const jumpEl = e.target.closest('[data-cat-jump]');
  if (jumpEl) { e.preventDefault(); jumpToCategoria(jumpEl.dataset.catJump); }
});

function wireQtyDelegation(container) {
  container.addEventListener('click', e => {
    const stepBtn = e.target.closest('[data-step]');
    if (!stepBtn) return;
    const stepper = stepBtn.closest('.qty-stepper');
    const span = stepper.querySelector('span');
    const p = getProducto(stepper.closest('[data-id]')?.dataset.id);
    const max = p?.stock > 0 ? p.stock : 99;
    let val = parseInt(span.textContent, 10) + parseInt(stepBtn.dataset.step, 10);
    val = Math.max(1, Math.min(val, max));
    span.textContent = val;
  });
}

function wireAddBuyDelegation(container) {
  container.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add]');
    const buyBtn = e.target.closest('[data-buy]');
    const qvBtn = e.target.closest('[data-quickview]');
    if (addBtn) {
      const p = getProducto(addBtn.dataset.add);
      if (!p || p.stock === 0) return;
      const card = addBtn.closest('[data-id]');
      const qtyEl = card?.querySelector('.qty-stepper span');
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      Cart.add(p, qty);
      showToast('¡Sumado! Ya está en tu carrito.');
    } else if (buyBtn) {
      const p = getProducto(buyBtn.dataset.buy);
      if (!p || p.stock === 0) return;
      const card = buyBtn.closest('[data-id]');
      const qtyEl = card?.querySelector('.qty-stepper span');
      const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
      Cart.add(p, qty);
      openCartDrawer();
    } else if (qvBtn) {
      openModal(qvBtn.dataset.quickview);
    }
  });
}

function revelarNuevos(container) {
  if (!revealsListos) return;
  requestAnimationFrame(() => {
    container.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.5)}s`;
      requestAnimationFrame(() => el.classList.add('in'));
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  items.forEach(el => { if (el.dataset.delay) el.style.transitionDelay = `${el.dataset.delay}s`; });
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.1, 0.6)}s`;
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

function initCintaRail() {
  const vp = document.getElementById('cintaRail');
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

  const prev = document.getElementById('cintaPrev');
  const next = document.getElementById('cintaNext');
  const track = document.getElementById('cintaTrack');
  const syncArrows = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -420, behavior: 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: 420, behavior: 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  setTimeout(syncArrows, 300);
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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
  cart?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-header')?.addEventListener('click', openCartDrawer);
  sync();
}

function renderCartDrawer() {
  const wrap = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const items = Cart.get();
  if (!items.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <p>Todavía no elegiste nada.</p>
        <p>¿Empezamos por acá?</p>
        <a href="#tienda" class="btn btn-primary" id="cartEmptyGo">Ver el catálogo</a>
      </div>`;
    document.getElementById('cartEmptyGo')?.addEventListener('click', closeCartDrawer);
  } else {
    wrap.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item-media"><img src="${p.img}" alt="${esc(p.nombre)}" width="68" height="68" loading="lazy"></div>
        <div>
          <p class="cart-item-name">${esc(p.nombre)}</p>
          <p class="cart-item-price">${formatearPrecio(precioFinal(p))} c/u</p>
        </div>
        <div class="cart-item-right">
          <div class="qty-stepper">
            <button type="button" data-cart-step="-1" aria-label="Restar cantidad">−</button>
            <span>${i.qty}</span>
            <button type="button" data-cart-step="1" aria-label="Sumar cantidad">+</button>
          </div>
          <button type="button" class="cart-item-remove" data-cart-remove>Quitar</button>
        </div>
      </div>`;
    }).join('');
  }
  totalEl.textContent = formatearPrecio(Cart.total());
}

function initCartDrawerEvents() {
  const wrap = document.getElementById('cartItems');
  wrap.addEventListener('click', e => {
    const stepBtn = e.target.closest('[data-cart-step]');
    const removeBtn = e.target.closest('[data-cart-remove]');
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const id = row.dataset.id;
    if (stepBtn) {
      const items = Cart.get();
      const it = items.find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + parseInt(stepBtn.dataset.cartStep, 10));
    } else if (removeBtn) {
      Cart.remove(id);
    }
  });
  document.getElementById('cartCheckout').addEventListener('click', () => {
    if (!Cart.count()) { showToast('Tu carrito está vacío por ahora.'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
}

function openCartDrawer() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartDrawer').removeAttribute('inert');
  document.getElementById('cartBackdrop').classList.add('open');
  document.body.classList.add('no-scroll', 'drawer-open');
  window.lenis?.stop?.();
}
function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartDrawer').setAttribute('inert', '');
  document.getElementById('cartBackdrop').classList.remove('open');
  document.body.classList.remove('no-scroll', 'drawer-open');
  window.lenis?.start?.();
}

function initCartDrawerToggle() {
  document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
  document.getElementById('cartBackdrop').addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('cartDrawer').classList.contains('open')) closeCartDrawer();
  });
  document.addEventListener('cart:updated', renderCartDrawer);
  renderCartDrawer();
}

let modalCurrentId = null;

function openModal(id) {
  const p = getProducto(id);
  if (!p) return;
  modalCurrentId = id;
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalImg').alt = p.nombre;
  document.getElementById('modalBadges').innerHTML = getBadges(p);
  document.getElementById('modalCat').textContent = `${catNombre(p.categoria)} · ${COLOR_LABEL[p.color]}`;
  document.getElementById('modalTitle').textContent = p.nombre;
  document.getElementById('modalPrice').innerHTML = priceHTML(p);
  document.getElementById('modalDesc').textContent = p.descripcion;
  document.getElementById('modalQty').textContent = '1';
  const agotado = p.stock === 0;
  document.getElementById('modalAdd').disabled = agotado;
  document.getElementById('modalAdd').textContent = agotado ? 'Agotado' : 'Agregar al carrito';
  document.getElementById('modalBuy').disabled = agotado;

  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  const relWrap = document.getElementById('modalRelacionados');
  const relGrid = document.getElementById('modalRelacionadosGrid');
  if (relacionados.length) {
    relWrap.hidden = false;
    relGrid.innerHTML = relacionados.map(r => `
      <button type="button" class="modal-rel-card" data-quickview="${r.id}">
        <div class="modal-rel-media"><img src="${r.img}" alt="${esc(r.nombre)}" width="200" height="200" loading="lazy"></div>
        <p class="modal-rel-name">${esc(r.nombre)}</p>
        <p class="modal-rel-price">${formatearPrecio(precioFinal(r))}</p>
      </button>`).join('');
  } else {
    relWrap.hidden = true;
  }

  injectProductJsonLd(p);

  const overlay = document.getElementById('modalOverlay');
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('open'));
  document.getElementById('productModal').removeAttribute('inert');
  document.body.classList.add('no-scroll', 'modal-open');
  window.lenis?.stop?.();
  document.getElementById('modalClose').focus();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.getElementById('productModal').setAttribute('inert', '');
  document.body.classList.remove('no-scroll', 'modal-open');
  window.lenis?.start?.();
  setTimeout(() => { overlay.hidden = true; }, 320);
}

function injectProductJsonLd(p) {
  let tag = document.getElementById('productJsonLd');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'productJsonLd';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: location.origin + location.pathname.replace(/index\.html$/, '') + p.img,
    description: p.descripcion,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: precioFinal(p),
      availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  });
}

function initModalEvents() {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  document.getElementById('modalQtyStepper').addEventListener('click', e => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const p = getProducto(modalCurrentId);
    const max = p?.stock > 0 ? p.stock : 99;
    const span = document.getElementById('modalQty');
    let val = parseInt(span.textContent, 10) + parseInt(btn.dataset.step, 10);
    val = Math.max(1, Math.min(val, max));
    span.textContent = val;
  });

  document.getElementById('modalAdd').addEventListener('click', () => {
    const p = getProducto(modalCurrentId);
    if (!p || p.stock === 0) return;
    const qty = parseInt(document.getElementById('modalQty').textContent, 10);
    Cart.add(p, qty);
    showToast('¡Sumado! Ya está en tu carrito.');
  });
  document.getElementById('modalBuy').addEventListener('click', () => {
    const p = getProducto(modalCurrentId);
    if (!p || p.stock === 0) return;
    const qty = parseInt(document.getElementById('modalQty').textContent, 10);
    Cart.add(p, qty);
    closeModal();
    setTimeout(openCartDrawer, 260);
  });
  document.getElementById('modalRelacionadosGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-quickview]');
    if (btn) openModal(btn.dataset.quickview);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 769px)');
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

const PUNTOS_X = [60, 127, 194, 261, 328, 395, 462, 529, 596];
const PUNTOS_T = [1.2, 2.1, 3.0, 3.9, 4.8, 5.7, 6.6, 7.5, 8.3];

function initOficio() {
  const stage = document.getElementById('oficioStage');
  const pasos = document.querySelectorAll('.oficio-pasos .paso');
  if (!stage) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.oficio .punto').forEach(el => { el.style.opacity = 1; el.setAttribute('fill', '#C9975E'); });
    document.querySelectorAll('.oficio .cruz').forEach(el => { el.style.opacity = 1; });
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  const setStep = progress => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
  };

  gsap.set('#agujaGroup', { x: 20 });

  if (reduceMotion) {
    gsap.set('.punto', { opacity: 1, fill: '#C9975E' });
    gsap.set('.cruz', { opacity: 1 });
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  function buildTimeline(stVars) {
    const tl = gsap.timeline({ scrollTrigger: { ...stVars, onUpdate: self => setStep(self.progress) } });
    tl.to('.punto', { opacity: 1, duration: .7, stagger: .05, ease: 'power2.out' }, 0);
    tl.fromTo('#agujaGroup', { opacity: 0, x: 20 }, { opacity: 1, duration: .3 }, 1);
    tl.to('#agujaGroup', { x: 620, duration: 7.1, ease: 'none' }, 1.2);
    PUNTOS_X.forEach((cx, i) => {
      tl.to(`.punto:nth-child(${i + 1})`, { fill: '#C9975E', duration: .25 }, PUNTOS_T[i]);
      tl.to(`.cruz[data-i="${i}"]`, { opacity: 1, duration: .25 }, PUNTOS_T[i]);
    });
    tl.to('#agujaGroup', { opacity: 0, duration: .3 }, 8.4);
    tl.to('.panel-cuero', { scale: 1.015, transformOrigin: '50% 50%', duration: .4, yoyo: true, repeat: 1 }, 8.6);
    return tl;
  }

  ScrollTrigger.matchMedia({
    '(min-width: 1081px)': () => {
      buildTimeline({ trigger: stage, start: 'top top', end: '+=200%', pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true });
    },
    '(max-width: 1080px)': () => {
      stage.classList.add('is-sticky-mobile');
      const tl = buildTimeline({ trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true });
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => { stage.classList.remove('is-sticky-mobile'); tl.scrollTrigger?.kill(); tl.kill(); };
    },
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

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

renderCinta();
renderCategorias();
initFiltroChips();
renderCatalogo({ resetPage: true });
initFiltrosControles();
wireSearch();
initSearchToggle();
wireQtyDelegation(document.getElementById('cintaTrack'));
wireAddBuyDelegation(document.getElementById('cintaTrack'));
wireQtyDelegation(document.getElementById('catalogoGrid'));
wireAddBuyDelegation(document.getElementById('catalogoGrid'));
initCintaRail();
initNav();
initReveals();
initFloats();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
initCartDrawerToggle();
initCartDrawerEvents();
initModalEvents();
initOficio();
