/* global getComputedStyle */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const IMG = {
  fango: 'images/fango-terapeutico-1200x1200.webp',
  jabon: 'images/jabon-con-fango-1200x1200.webp',
  vela: 'images/vela-artesanal-1200x1200.webp',
  palosanto: 'images/palo-santo-sahumerio-1200x1200.webp',
  aceite: 'images/aceite-sales-naturales-1200x1200.webp',
  artesania: 'images/artesania-madera-fibra-1200x1200.webp',
};

const CATEGORIAS = [
  { id: 'fango-terapeutico', nombre: 'Fango Terapéutico', desc: 'El producto de origen, tal como lo da la tierra.', img: IMG.fango },
  { id: 'jabones', nombre: 'Jabones con Fango', desc: 'El fango de siempre, en formato de uso diario.', img: IMG.jabon },
  { id: 'velas-sahumerios', nombre: 'Velas y Sahumerios', desc: 'Para bajar un cambio, aunque sea un rato.', img: IMG.vela },
  { id: 'aceites-sales', nombre: 'Aceites y Sales Naturales', desc: 'Lo esencial del bienestar, sin vueltas.', img: IMG.aceite },
  { id: 'artesanias', nombre: 'Artesanías Naturales', desc: 'Piezas únicas, hechas a mano en materiales naturales.', img: IMG.artesania },
];

const PRODUCTOS = [
  { id: 'p01', slug: 'fango-terapeutico-facial', nombre: 'Fango Terapéutico Facial', categoria: 'fango-terapeutico', aroma: 'Neutro', precio: 9500, descuento: 0, stock: 22, sensible: true, nuevo: false, destacado: true, img: IMG.fango, descripcion: 'Pote de fango puro para uso facial — se aplica, se deja secar y se enjuaga con agua tibia.' },
  { id: 'p02', slug: 'fango-terapeutico-corporal', nombre: 'Fango Terapéutico Corporal', categoria: 'fango-terapeutico', aroma: 'Neutro', precio: 14500, descuento: 10, stock: 16, sensible: true, nuevo: false, destacado: false, img: IMG.fango, descripcion: 'Formato grande para todo el cuerpo, mismo fango que el facial en mayor cantidad.' },
  { id: 'p03', slug: 'fango-aloe-vera', nombre: 'Fango con Aloe Vera', categoria: 'fango-terapeutico', aroma: 'Neutro', precio: 11000, descuento: 0, stock: 18, sensible: true, nuevo: false, destacado: false, img: IMG.fango, descripcion: 'Fango combinado con aloe vera fresca, para pieles que necesitan más hidratación.' },
  { id: 'p04', slug: 'fango-extracto-romero', nombre: 'Fango con Extracto de Romero', categoria: 'fango-terapeutico', aroma: 'Romero', precio: 11500, descuento: 0, stock: 14, sensible: false, nuevo: false, destacado: false, img: IMG.fango, descripcion: 'Fango con extracto de romero, pensado para después de un día largo.' },
  { id: 'p05', slug: 'kit-fango-espatula', nombre: 'Kit Fango + Espátula', categoria: 'fango-terapeutico', aroma: 'Neutro', precio: 16800, descuento: 10, stock: 9, sensible: true, nuevo: false, destacado: false, img: IMG.fango, descripcion: 'El pote de fango terapéutico junto con la espátula de madera para aplicarlo.' },
  { id: 'p06', slug: 'fango-terapeutico-viaje', nombre: 'Fango Terapéutico Viaje (mini)', categoria: 'fango-terapeutico', aroma: 'Neutro', precio: 5800, descuento: 0, stock: 3, sensible: true, nuevo: false, destacado: false, img: IMG.fango, descripcion: 'El mismo fango, en formato mini para llevar de viaje o probar por primera vez.' },

  { id: 'p07', slug: 'jabon-fango-neutro', nombre: 'Jabón de Fango Neutro', categoria: 'jabones', aroma: 'Neutro', precio: 4800, descuento: 0, stock: 30, sensible: true, nuevo: false, destacado: true, img: IMG.jabon, descripcion: 'Jabón de fango sin agregados, para piel sensible o quien prefiere sin perfume.' },
  { id: 'p08', slug: 'jabon-fango-lavanda', nombre: 'Jabón de Fango y Lavanda', categoria: 'jabones', aroma: 'Lavanda', precio: 5200, descuento: 0, stock: 25, sensible: false, nuevo: false, destacado: false, img: IMG.jabon, descripcion: 'Jabón de fango con aceite esencial de lavanda, para antes de dormir.' },
  { id: 'p09', slug: 'jabon-fango-avena', nombre: 'Jabón de Fango y Avena', categoria: 'jabones', aroma: 'Neutro', precio: 5000, descuento: 0, stock: 20, sensible: true, nuevo: false, destacado: false, img: IMG.jabon, descripcion: 'Fango y avena molida, con un poco más de textura exfoliante.' },
  { id: 'p10', slug: 'jabon-fango-carbon', nombre: 'Jabón de Fango y Carbón Activado', categoria: 'jabones', aroma: 'Neutro', precio: 5500, descuento: 0, stock: 17, sensible: false, nuevo: true, destacado: false, img: IMG.jabon, descripcion: 'Fango y carbón activado, para piel con tendencia grasa.' },
  { id: 'p11', slug: 'jabon-fango-manzanilla', nombre: 'Jabón de Fango y Manzanilla', categoria: 'jabones', aroma: 'Manzanilla', precio: 5100, descuento: 0, stock: 19, sensible: false, nuevo: false, destacado: false, img: IMG.jabon, descripcion: 'Fango con manzanilla, más suave para uso diario.' },
  { id: 'p12', slug: 'set-jabones-x3', nombre: 'Set de Jabones x3', categoria: 'jabones', aroma: 'Lavanda', precio: 13500, descuento: 15, stock: 11, sensible: false, nuevo: false, destacado: true, img: IMG.jabon, descripcion: 'Tres jabones de fango, aroma lavanda, para probar sin comprar de a uno.' },

  { id: 'p13', slug: 'vela-soja-natural', nombre: 'Vela de Soja Natural', categoria: 'velas-sahumerios', aroma: 'Neutro', precio: 7200, descuento: 0, stock: 20, sensible: false, nuevo: false, destacado: false, img: IMG.vela, descripcion: 'Vela de soja 100%, sin aroma agregado, mecha de algodón.' },
  { id: 'p14', slug: 'vela-soja-lavanda', nombre: 'Vela de Soja y Lavanda', categoria: 'velas-sahumerios', aroma: 'Lavanda', precio: 7600, descuento: 0, stock: 16, sensible: false, nuevo: false, destacado: false, img: IMG.vela, descripcion: 'Vela de soja con lavanda, para relajar el ambiente.' },
  { id: 'p15', slug: 'palo-santo-x3', nombre: 'Palo Santo x3 Varillas', categoria: 'velas-sahumerios', aroma: 'Neutro', precio: 6000, descuento: 0, stock: 24, sensible: false, nuevo: false, destacado: true, img: IMG.palosanto, descripcion: 'Tres varillas de palo santo, para sahumar antes o después de meditar.' },
  { id: 'p16', slug: 'sahumerio-salvia-blanca', nombre: 'Sahumerio de Salvia Blanca', categoria: 'velas-sahumerios', aroma: 'Neutro', precio: 6500, descuento: 0, stock: 0, sensible: false, nuevo: false, destacado: false, img: IMG.palosanto, descripcion: 'Sahumerio de salvia blanca en manojo, para limpiar el ambiente.' },
  { id: 'p17', slug: 'vela-soja-citronela', nombre: 'Vela de Soja y Citronela', categoria: 'velas-sahumerios', aroma: 'Cítrico', precio: 7900, descuento: 0, stock: 13, sensible: false, nuevo: true, destacado: true, img: IMG.vela, descripcion: 'Vela de soja con citronela, también funciona como repelente natural.' },
  { id: 'p18', slug: 'set-ritual-vela-palosanto', nombre: 'Set Ritual (Vela + Palo Santo)', categoria: 'velas-sahumerios', aroma: 'Neutro', precio: 12800, descuento: 0, stock: 10, sensible: false, nuevo: false, destacado: false, img: IMG.palosanto, descripcion: 'Una vela de soja y un manojo de palo santo, para armar tu propio ritual.' },

  { id: 'p19', slug: 'aceite-romero-natural', nombre: 'Aceite de Romero Natural', categoria: 'aceites-sales', aroma: 'Romero', precio: 8200, descuento: 0, stock: 15, sensible: false, nuevo: false, destacado: false, img: IMG.aceite, descripcion: 'Aceite de romero puro, para masajes o para el cuero cabelludo.' },
  { id: 'p20', slug: 'aceite-coco-puro', nombre: 'Aceite de Coco Puro', categoria: 'aceites-sales', aroma: 'Neutro', precio: 6800, descuento: 0, stock: 21, sensible: true, nuevo: false, destacado: true, img: IMG.aceite, descripcion: 'Aceite de coco sin refinar, sirve para piel, pelo y cocina.' },
  { id: 'p21', slug: 'sales-bano-manzanilla', nombre: 'Sales de Baño y Manzanilla', categoria: 'aceites-sales', aroma: 'Manzanilla', precio: 6200, descuento: 0, stock: 18, sensible: true, nuevo: false, destacado: false, img: IMG.aceite, descripcion: 'Sales de baño con manzanilla, para un baño que relaja de verdad.' },
  { id: 'p22', slug: 'sales-bano-lavanda', nombre: 'Sales de Baño y Lavanda', categoria: 'aceites-sales', aroma: 'Lavanda', precio: 6200, descuento: 12, stock: 14, sensible: false, nuevo: false, destacado: false, img: IMG.aceite, descripcion: 'Sales de baño con lavanda, ideales para la noche.' },
  { id: 'p23', slug: 'aceite-esencial-citricos', nombre: 'Aceite Esencial de Cítricos', categoria: 'aceites-sales', aroma: 'Cítrico', precio: 7500, descuento: 0, stock: 12, sensible: false, nuevo: true, destacado: false, img: IMG.aceite, descripcion: 'Aceite esencial de cítricos, para difusor o para perfumar ambientes.' },
  { id: 'p24', slug: 'manteca-corporal-natural', nombre: 'Manteca Corporal Natural', categoria: 'aceites-sales', aroma: 'Neutro', precio: 9800, descuento: 0, stock: 9, sensible: true, nuevo: false, destacado: false, img: IMG.aceite, descripcion: 'Manteca corporal 100% natural, para la piel más reseca.' },

  { id: 'p25', slug: 'colgante-madera-tallada', nombre: 'Colgante de Madera Tallada', categoria: 'artesanias', aroma: 'Sin aroma', precio: 8500, descuento: 0, stock: 13, sensible: false, nuevo: false, destacado: true, img: IMG.artesania, descripcion: 'Colgante tallado a mano en madera nativa, cada pieza es única.' },
  { id: 'p26', slug: 'pulsera-piedras-naturales', nombre: 'Pulsera de Piedras Naturales', categoria: 'artesanias', aroma: 'Sin aroma', precio: 7200, descuento: 0, stock: 20, sensible: false, nuevo: false, destacado: false, img: IMG.artesania, descripcion: 'Pulsera con piedras naturales, ninguna combinación se repite igual.' },
  { id: 'p27', slug: 'collar-semillas', nombre: 'Collar de Semillas', categoria: 'artesanias', aroma: 'Sin aroma', precio: 9200, descuento: 0, stock: 11, sensible: false, nuevo: false, destacado: false, img: IMG.artesania, descripcion: 'Collar armado con semillas naturales, liviano para el uso diario.' },
  { id: 'p28', slug: 'atrapasuenos-chico', nombre: 'Atrapasueños Chico', categoria: 'artesanias', aroma: 'Sin aroma', precio: 12500, descuento: 0, stock: 8, sensible: false, nuevo: false, destacado: true, img: IMG.artesania, descripcion: 'Atrapasueños chico, tejido a mano con materiales naturales.' },
  { id: 'p29', slug: 'portasahumerios-madera', nombre: 'Portasahumerios de Madera Tallada', categoria: 'artesanias', aroma: 'Sin aroma', precio: 6800, descuento: 0, stock: 16, sensible: false, nuevo: false, destacado: false, img: IMG.artesania, descripcion: 'Portasahumerios de madera tallada, con espacio para juntar la ceniza.' },
  { id: 'p30', slug: 'set-piedras-rodadas', nombre: 'Set de Piedras Rodadas Naturales', categoria: 'artesanias', aroma: 'Sin aroma', precio: 10500, descuento: 10, stock: 7, sensible: false, nuevo: true, destacado: false, img: IMG.artesania, descripcion: 'Set de piedras rodadas naturales, para decorar o para el jardín.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catNombre = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const normalize = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const Cart = {
  KEY: 'arqueasproductosnaturales_cart',
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
  if (p.sensible) badges.push('<span class="badge badge-sensible">Piel sensible</span>');
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
    <span class="cinta-tag">${formatearPrecio(precioFinal(p))}</span>
    <button type="button" class="cinta-plate" data-quickview="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="360" height="360" loading="lazy">
    </button>
    <p class="cinta-name">${esc(p.nombre)}</p>
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

const filtros = { categoria: 'todas', aroma: 'todos', sensible: false, precio: 'todos', q: '' };
let visibleCount = 16;
const PAGE_SIZE = 16;

function getFiltered() {
  return PRODUCTOS.filter(p => {
    if (filtros.categoria !== 'todas' && p.categoria !== filtros.categoria) return false;
    if (filtros.aroma !== 'todos' && p.aroma !== filtros.aroma) return false;
    if (filtros.sensible && !p.sensible) return false;
    if (filtros.precio !== 'todos') {
      const [min, max] = filtros.precio.split('-').map(Number);
      const pf = precioFinal(p);
      if (pf < min || pf > max) return false;
    }
    if (filtros.q) {
      const haystack = normalize(`${p.nombre} ${catNombre(p.categoria)} ${p.aroma} ${p.descripcion}`);
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
  const aromas = ['Neutro', 'Lavanda', 'Romero', 'Manzanilla', 'Cítrico', 'Sin aroma'];
  const aromaWrap = document.getElementById('filtroAroma');
  aromas.forEach(a => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.value = a; b.textContent = a;
    aromaWrap.appendChild(b);
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
  document.getElementById('filtroSensible').addEventListener('change', e => {
    filtros.sensible = e.target.checked;
    renderCatalogo({ resetPage: true });
  });
  document.getElementById('filtroPrecio').addEventListener('change', e => {
    filtros.precio = e.target.value;
    renderCatalogo({ resetPage: true });
  });
  const limpiar = () => {
    filtros.categoria = 'todas'; filtros.aroma = 'todos'; filtros.sensible = false; filtros.precio = 'todos'; filtros.q = '';
    syncChipUI('categoria', 'todas'); syncChipUI('aroma', 'todos');
    document.getElementById('filtroSensible').checked = false;
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
  document.getElementById('modalCat').textContent = `${catNombre(p.categoria)} · ${p.aroma}`;
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
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    nav.setAttribute('inert', '');
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
  nav.setAttribute('inert', '');
}

function initOficio() {
  const stage = document.getElementById('oficioStage');
  const pasos = document.querySelectorAll('.oficio-pasos .paso');
  if (!stage) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.oficio .capa, .oficio .tapa-g, .oficio .mono-g').forEach(el => { el.style.opacity = 1; });
    document.getElementById('capaBase')?.setAttribute('height', '204');
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  const setStep = progress => {
    const idx = Math.min(pasos.length - 1, Math.floor(progress * pasos.length));
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
  };

  if (reduceMotion) {
    gsap.set('#capaBase', { attr: { y: 146, height: 204 } });
    gsap.set('#tapaGroup, #monoGroup', { opacity: 1 });
    pasos.forEach(p => p.classList.add('is-on'));
    return;
  }

  function buildTimeline(stVars) {
    const tl = gsap.timeline({ scrollTrigger: { ...stVars, onUpdate: self => setStep(self.progress) } });
    tl.to('#capaBase', { attr: { y: 264, height: 86 }, duration: 1, ease: 'power1.inOut' }, 0)
      .to('#capaDos', { attr: { y: 224, height: 40 }, duration: .8, ease: 'power1.inOut' }, 1)
      .to('#capaTres', { attr: { y: 184, height: 40 }, duration: .8, ease: 'power1.inOut' }, 2)
      .to('#capaCuatro', { attr: { y: 146, height: 38 }, duration: .8, ease: 'power1.inOut' }, 2.8)
      .to('#capasGroup', { y: -6, duration: .3, ease: 'power1.out' }, 3.7)
      .to('#capasGroup', { y: 0, duration: .3, ease: 'power1.out' }, 4.0)
      .to('#tapaGroup', { opacity: 1, duration: .3 }, 4.3)
      .fromTo('#tapaGroup', { y: -40 }, { y: 0, duration: .5, ease: 'back.out(1.6)' }, 4.3)
      .to('#monoGroup', { opacity: 1, duration: .4 }, 5.0);
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
