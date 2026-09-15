const WHATSAPP_NUMBER = '5493425847511';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGINA = 16;

const CATEGORIAS = [
  { id: 'modulos', nombre: 'Módulos y Pantallas' },
  { id: 'baterias', nombre: 'Baterías' },
  { id: 'carga', nombre: 'Cargadores y Cables' },
  { id: 'audio', nombre: 'Auriculares' },
  { id: 'fundas', nombre: 'Fundas y Protección' },
  { id: 'soportes', nombre: 'Soportes' },
  { id: 'celulares', nombre: 'Celulares' },
];

const MODELOS = [
  { id: 'todos', nombre: 'Todos los modelos' },
  { id: 'iphone-11', nombre: 'iPhone 11' },
  { id: 'iphone-13', nombre: 'iPhone 13' },
  { id: 'iphone-15', nombre: 'iPhone 15' },
  { id: 'samsung-a54', nombre: 'Samsung A54' },
  { id: 'samsung-s23', nombre: 'Samsung S23' },
  { id: 'motorola-g84', nombre: 'Motorola G84' },
  { id: 'xiaomi-redmi-13', nombre: 'Xiaomi Redmi 13' },
];
const TODOS_MODELOS = MODELOS.filter(m => m.id !== 'todos').map(m => m.id);

const IMG = {
  modulo: 'images/modulo-pantalla-celular.webp',
  bateria: 'images/bateria-repuesto-celular.webp',
  carga: 'images/cargador-y-cable-usb-c.webp',
  audio: 'images/auriculares-usb-c.webp',
  funda: 'images/fundas-para-celular.webp',
  soporte: 'images/soporte-para-celular.webp',
  celular: 'images/venta-de-celulares-nuevos-y-usados.webp',
};

const PRODUCTOS = [
  { id: 'm1', sku: 'MOD-IP11', nombre: 'Módulo iPhone 11 Incell', categoria: 'modulos', compat: ['iphone-11'], precio: 142000, descuento: 0, stock: 8, destacado: true, imagen: IMG.modulo, descripcion: 'Módulo Incell con marco, calidad premium. Incluye colocación sin cargo en el local.' },
  { id: 'm2', sku: 'MOD-IP13', nombre: 'Módulo iPhone 13 OLED', categoria: 'modulos', compat: ['iphone-13'], precio: 218000, descuento: 0, stock: 5, destacado: true, imagen: IMG.modulo, descripcion: 'Módulo OLED original recuperado, con True Tone funcional. Garantía de 6 meses.' },
  { id: 'm3', sku: 'MOD-IP15', nombre: 'Módulo iPhone 15 OLED', categoria: 'modulos', compat: ['iphone-15'], precio: 385000, descuento: 0, stock: 3, destacado: false, imagen: IMG.modulo, descripcion: 'Módulo OLED para iPhone 15, calidad original. Consultanos por disponibilidad inmediata.' },
  { id: 'm4', sku: 'MOD-SA54', nombre: 'Módulo Samsung A54 Super AMOLED', categoria: 'modulos', compat: ['samsung-a54'], precio: 168000, descuento: 8, stock: 6, destacado: true, imagen: IMG.modulo, descripcion: 'Super AMOLED con marco incluido. Colocación en el día.' },
  { id: 'm5', sku: 'MOD-SS23', nombre: 'Módulo Samsung S23 AMOLED', categoria: 'modulos', compat: ['samsung-s23'], precio: 295000, descuento: 0, stock: 4, destacado: false, imagen: IMG.modulo, descripcion: 'Módulo AMOLED con marco original Samsung. Incluye service completo.' },
  { id: 'm6', sku: 'MOD-MG84', nombre: 'Módulo Motorola G84', categoria: 'modulos', compat: ['motorola-g84'], precio: 96000, descuento: 0, stock: 9, destacado: false, imagen: IMG.modulo, descripcion: 'Módulo con marco para Motorola G84. Repuesto de primera calidad.' },
  { id: 'm7', sku: 'MOD-XR13', nombre: 'Módulo Xiaomi Redmi 13', categoria: 'modulos', compat: ['xiaomi-redmi-13'], precio: 88000, descuento: 0, stock: 11, destacado: false, imagen: IMG.modulo, descripcion: 'Módulo completo con marco para Redmi 13. Stock permanente.' },

  { id: 'b1', sku: 'BAT-IP11', nombre: 'Batería iPhone 11', categoria: 'baterias', compat: ['iphone-11'], precio: 52000, descuento: 0, stock: 14, destacado: true, imagen: IMG.bateria, descripcion: 'Batería de reemplazo con capacidad original. Incluye colocación y sellado.' },
  { id: 'b2', sku: 'BAT-IP13', nombre: 'Batería iPhone 13', categoria: 'baterias', compat: ['iphone-13'], precio: 64000, descuento: 0, stock: 10, destacado: true, imagen: IMG.bateria, descripcion: 'Batería con chip original, sin mensaje de advertencia. Garantía de 6 meses.' },
  { id: 'b3', sku: 'BAT-IP15', nombre: 'Batería iPhone 15', categoria: 'baterias', compat: ['iphone-15'], precio: 78000, descuento: 0, stock: 6, destacado: false, imagen: IMG.bateria, descripcion: 'Batería para iPhone 15, capacidad certificada.' },
  { id: 'b4', sku: 'BAT-SA54', nombre: 'Batería Samsung A54', categoria: 'baterias', compat: ['samsung-a54'], precio: 46000, descuento: 10, stock: 12, destacado: false, imagen: IMG.bateria, descripcion: 'Batería de 5000 mAh para Samsung A54, con adhesivo incluido.' },
  { id: 'b5', sku: 'BAT-SS23', nombre: 'Batería Samsung S23', categoria: 'baterias', compat: ['samsung-s23'], precio: 58000, descuento: 0, stock: 7, destacado: false, imagen: IMG.bateria, descripcion: 'Batería original Samsung para S23. Colocación en el momento.' },
  { id: 'b6', sku: 'BAT-MG84', nombre: 'Batería Motorola G84', categoria: 'baterias', compat: ['motorola-g84'], precio: 42000, descuento: 0, stock: 15, destacado: false, imagen: IMG.bateria, descripcion: 'Batería de 5000 mAh para Motorola G84.' },
  { id: 'b7', sku: 'BAT-XR13', nombre: 'Batería Xiaomi Redmi 13', categoria: 'baterias', compat: ['xiaomi-redmi-13'], precio: 39000, descuento: 0, stock: 0, destacado: false, imagen: IMG.bateria, descripcion: 'Batería de reemplazo para Redmi 13. Reponemos todas las semanas.' },

  { id: 'c1', sku: 'CAR-20W', nombre: 'Cargador 20W USB-C + Cable', categoria: 'carga', compat: TODOS_MODELOS, precio: 24000, descuento: 0, stock: 40, destacado: true, imagen: IMG.carga, descripcion: 'Cargador de carga rápida 20W con cable USB-C de 1 metro incluido.' },
  { id: 'c2', sku: 'CAR-33W', nombre: 'Cargador 33W Carga Rápida', categoria: 'carga', compat: TODOS_MODELOS, precio: 32000, descuento: 12, stock: 25, destacado: true, imagen: IMG.carga, descripcion: 'Cargador de 33W compatible con carga rápida de Samsung, Xiaomi y Motorola.' },
  { id: 'c3', sku: 'CAB-CC1M', nombre: 'Cable USB-C a USB-C 1m', categoria: 'carga', compat: TODOS_MODELOS, precio: 9500, descuento: 0, stock: 60, destacado: false, imagen: IMG.carga, descripcion: 'Cable reforzado USB-C a USB-C, soporta hasta 60W.' },
  { id: 'c4', sku: 'CAB-LI1M', nombre: 'Cable Lightning 1m', categoria: 'carga', compat: ['iphone-11', 'iphone-13'], precio: 11000, descuento: 0, stock: 35, destacado: false, imagen: IMG.carga, descripcion: 'Cable Lightning certificado para iPhone 11 y 13.' },
  { id: 'c5', sku: 'CAB-CC2M', nombre: 'Cable USB-C a USB-C 2m', categoria: 'carga', compat: TODOS_MODELOS, precio: 13500, descuento: 0, stock: 28, destacado: false, imagen: IMG.carga, descripcion: 'Versión de 2 metros del cable reforzado, ideal para la mesa de luz.' },
  { id: 'c6', sku: 'CAR-AUTO', nombre: 'Cargador para Auto Doble USB', categoria: 'carga', compat: TODOS_MODELOS, precio: 16500, descuento: 0, stock: 22, destacado: false, imagen: IMG.carga, descripcion: 'Cargador de auto con dos puertos, USB-C y USB-A, carga rápida.' },

  { id: 'a1', sku: 'AUR-USBC', nombre: 'Auriculares In-Ear USB-C', categoria: 'audio', compat: TODOS_MODELOS, precio: 21000, descuento: 0, stock: 30, destacado: true, imagen: IMG.audio, descripcion: 'In-ear con conector USB-C, micrófono y control de volumen en el cable.' },
  { id: 'a2', sku: 'AUR-LIGHT', nombre: 'Auriculares In-Ear Lightning', categoria: 'audio', compat: ['iphone-11', 'iphone-13'], precio: 23000, descuento: 0, stock: 18, destacado: false, imagen: IMG.audio, descripcion: 'In-ear con conector Lightning para iPhone, con control remoto.' },
  { id: 'a3', sku: 'AUR-BT', nombre: 'Auriculares Bluetooth TWS', categoria: 'audio', compat: TODOS_MODELOS, precio: 48000, descuento: 15, stock: 16, destacado: true, imagen: IMG.audio, descripcion: 'True Wireless con estuche de carga, hasta 24 horas de autonomía.' },
  { id: 'a4', sku: 'AUR-35MM', nombre: 'Auriculares Mini Plug 3.5mm', categoria: 'audio', compat: TODOS_MODELOS, precio: 14000, descuento: 0, stock: 44, destacado: false, imagen: IMG.audio, descripcion: 'Clásicos con ficha 3.5mm, para celulares que todavía tienen entrada.' },
  { id: 'a5', sku: 'AUR-GAM', nombre: 'Auriculares Gamer con Mic', categoria: 'audio', compat: TODOS_MODELOS, precio: 36000, descuento: 0, stock: 9, destacado: false, imagen: IMG.audio, descripcion: 'Con micrófono desmontable y luz LED, para jugar desde el celu.' },

  { id: 'f1', sku: 'FUN-SIL', nombre: 'Funda Silicona Colores', categoria: 'fundas', compat: TODOS_MODELOS, precio: 12500, descuento: 0, stock: 80, destacado: true, imagen: IMG.funda, descripcion: 'Funda de silicona con interior aterciopelado. Disponible en varios colores.' },
  { id: 'f2', sku: 'FUN-TRA', nombre: 'Funda Transparente Antigolpe', categoria: 'fundas', compat: TODOS_MODELOS, precio: 14000, descuento: 0, stock: 65, destacado: true, imagen: IMG.funda, descripcion: 'Transparente con bordes reforzados, no amarillea con el uso.' },
  { id: 'f3', sku: 'FUN-MAG', nombre: 'Funda Magnética MagSafe', categoria: 'fundas', compat: ['iphone-13', 'iphone-15'], precio: 22000, descuento: 0, stock: 20, destacado: false, imagen: IMG.funda, descripcion: 'Compatible con carga MagSafe y accesorios magnéticos.' },
  { id: 'f4', sku: 'VID-TEM', nombre: 'Vidrio Templado 9H', categoria: 'fundas', compat: TODOS_MODELOS, precio: 7500, descuento: 0, stock: 120, destacado: true, imagen: IMG.funda, descripcion: 'Vidrio templado 9H con kit de colocación. Te lo colocamos gratis en el local.' },
  { id: 'f5', sku: 'VID-PRI', nombre: 'Vidrio Templado Privacidad', categoria: 'fundas', compat: TODOS_MODELOS, precio: 11500, descuento: 0, stock: 34, destacado: false, imagen: IMG.funda, descripcion: 'Filtro de privacidad: solo vos ves la pantalla de frente.' },
  { id: 'f6', sku: 'FUN-LIB', nombre: 'Funda Libro con Tarjetero', categoria: 'fundas', compat: TODOS_MODELOS, precio: 18000, descuento: 0, stock: 26, destacado: false, imagen: IMG.funda, descripcion: 'Tipo libro con espacio para tarjetas y cierre magnético.' },

  { id: 's1', sku: 'SOP-AUT', nombre: 'Soporte de Auto con Ventosa', categoria: 'soportes', compat: TODOS_MODELOS, precio: 17500, descuento: 0, stock: 24, destacado: true, imagen: IMG.soporte, descripcion: 'Brazo articulado con ventosa reforzada, se ajusta a cualquier celular.' },
  { id: 's2', sku: 'SOP-ESC', nombre: 'Soporte de Escritorio Plegable', categoria: 'soportes', compat: TODOS_MODELOS, precio: 13000, descuento: 0, stock: 38, destacado: false, imagen: IMG.soporte, descripcion: 'Plegable y regulable en altura, entra en cualquier bolsillo.' },
  { id: 's3', sku: 'SOP-REJ', nombre: 'Soporte de Auto para Rejilla', categoria: 'soportes', compat: TODOS_MODELOS, precio: 11000, descuento: 0, stock: 30, destacado: false, imagen: IMG.soporte, descripcion: 'Se engancha a la rejilla de ventilación, sin marcas en el tablero.' },
  { id: 's4', sku: 'SOP-ARO', nombre: 'Aro de Luz con Soporte', categoria: 'soportes', compat: TODOS_MODELOS, precio: 29000, descuento: 0, stock: 12, destacado: false, imagen: IMG.soporte, descripcion: 'Aro de luz LED con trípode y soporte para celular, tres temperaturas.' },
  { id: 's5', sku: 'POW-10K', nombre: 'Power Bank 10.000 mAh', categoria: 'soportes', compat: TODOS_MODELOS, precio: 38000, descuento: 0, stock: 18, destacado: true, imagen: IMG.soporte, descripcion: 'Batería portátil de 10.000 mAh con salida de carga rápida.' },

  { id: 'p1', sku: 'CEL-IP11U', nombre: 'iPhone 11 64GB — Usado', categoria: 'celulares', compat: ['iphone-11'], precio: 385000, descuento: 0, stock: 3, destacado: true, imagen: IMG.celular, descripcion: 'Usado en excelente estado, batería al 88%. Incluye garantía de 3 meses.' },
  { id: 'p2', sku: 'CEL-IP13U', nombre: 'iPhone 13 128GB — Usado', categoria: 'celulares', compat: ['iphone-13'], precio: 620000, descuento: 0, stock: 2, destacado: true, imagen: IMG.celular, descripcion: 'Usado impecable, batería al 91%, con caja. Garantía de 3 meses.' },
  { id: 'p3', sku: 'CEL-IP15N', nombre: 'iPhone 15 128GB — Nuevo', categoria: 'celulares', compat: ['iphone-15'], precio: 1450000, descuento: 0, stock: 2, destacado: false, imagen: IMG.celular, descripcion: 'Nuevo sellado, con garantía oficial. Consultanos por financiación.' },
  { id: 'p4', sku: 'CEL-SA54N', nombre: 'Samsung A54 256GB — Nuevo', categoria: 'celulares', compat: ['samsung-a54'], precio: 690000, descuento: 5, stock: 4, destacado: true, imagen: IMG.celular, descripcion: 'Nuevo sellado con garantía oficial Samsung Argentina.' },
  { id: 'p5', sku: 'CEL-MG84N', nombre: 'Motorola G84 256GB — Nuevo', categoria: 'celulares', compat: ['motorola-g84'], precio: 520000, descuento: 0, stock: 5, destacado: false, imagen: IMG.celular, descripcion: 'Nuevo sellado, pantalla pOLED y 256GB de almacenamiento.' },
  { id: 'p6', sku: 'CEL-XR13N', nombre: 'Xiaomi Redmi 13 256GB — Nuevo', categoria: 'celulares', compat: ['xiaomi-redmi-13'], precio: 445000, descuento: 0, stock: 6, destacado: false, imagen: IMG.celular, descripcion: 'Nuevo sellado, versión global con garantía.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const nombreModelo = id => MODELOS.find(m => m.id === id)?.nombre || '';

const Cart = {
  KEY: 'celulares_ar_cart',
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

function mensajePedido() {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `${i.qty}x ${p.nombre} (${p.sku}) — ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }).filter(Boolean);
  const texto = [
    'Hola! Quiero coordinar este pedido:',
    '',
    ...lineas,
    '',
    `Total: ${formatearPrecio(Cart.total())}`,
    '',
    '¿Cómo seguimos con el pago y la entrega?',
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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

const filterState = { q: '', cat: 'all', modelo: 'todos', visibles: PAGINA };

function compatibleCon(p, modelo) {
  return modelo === 'todos' || (p.compat || []).includes(modelo);
}

function productosFiltrados() {
  const q = normalizar(filterState.q);
  return PRODUCTOS.filter(p => {
    if (filterState.cat !== 'all' && p.categoria !== filterState.cat) return false;
    if (!compatibleCon(p, filterState.modelo)) return false;
    if (!q) return true;
    const cat = CATEGORIAS.find(c => c.id === p.categoria)?.nombre || '';
    const modelos = (p.compat || []).map(nombreModelo).join(' ');
    const haystack = normalizar([p.nombre, p.sku, cat, p.descripcion, modelos].join(' '));
    return haystack.includes(q);
  });
}

function badgeHtml(p) {
  if (p.stock === 0) return '<span class="prod-badge prod-badge--sold">Sin stock</span>';
  if (p.descuento > 0) return `<span class="prod-badge prod-badge--sale">-${p.descuento}%</span>`;
  if (p.stock <= 4) return '<span class="prod-badge prod-badge--low">Últimas unidades</span>';
  return '';
}

function cardHtml(p) {
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  return `
  <article class="prod-card" data-id="${p.id}" data-animate="up" style="transform:translateY(28px);opacity:0">
    <button type="button" class="prod-media" data-open-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${badgeHtml(p)}
      <img src="${p.imagen}" alt="${esc(p.nombre)}" width="1170" height="1172" loading="lazy">
    </button>
    <div class="prod-body">
      <p class="prod-sku">${esc(p.sku)}</p>
      <h3 class="prod-name"><button type="button" data-open-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <div class="prod-actions">
        <div class="qty-stepper">
          <button type="button" data-qty-minus="${p.id}" aria-label="Restar cantidad">−</button>
          <span data-qty-val="${p.id}">1</span>
          <button type="button" data-qty-plus="${p.id}" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn-add" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Sin stock' : 'Agregar'}</button>
      </div>
    </div>
  </article>`;
}

const qtyState = {};
const getQty = id => qtyState[id] || 1;

function renderDestacados() {
  const track = document.getElementById('destacadosTrack');
  if (!track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).map(cardHtml).join('');
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
    <button type="button" class="cat-card" data-goto-cat="${c.id}" data-animate="up" style="transform:translateY(30px);opacity:0">
      <img src="${ejemplo.imagen}" alt="" width="1170" height="1172" loading="lazy" aria-hidden="true">
      <span class="cat-card-label"><strong>${esc(c.nombre)}</strong><small>${count} artículo${count === 1 ? '' : 's'}</small></span>
    </button>`;
  }).join('');
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const count = document.getElementById('catalogoCount');
  const empty = document.getElementById('catalogoEmpty');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const items = productosFiltrados();
  const mostrados = items.slice(0, filterState.visibles);
  grid.innerHTML = mostrados.map(cardHtml).join('');
  if (count) {
    count.textContent = items.length
      ? `Mostrando ${mostrados.length} de ${items.length} artículo${items.length === 1 ? '' : 's'}`
      : '';
  }
  if (empty) empty.hidden = items.length !== 0;
  if (verMas) verMas.hidden = mostrados.length >= items.length;
  wireCardEvents(grid);
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
}

function actualizarChipModelo() {
  const chip = document.getElementById('modeloActivo');
  const label = document.getElementById('modeloActivoLabel');
  if (!chip || !label) return;
  const activo = filterState.modelo !== 'todos';
  chip.hidden = !activo;
  if (activo) label.textContent = nombreModelo(filterState.modelo);
}

function aplicarModelo(modeloId) {
  filterState.modelo = modeloId;
  filterState.visibles = PAGINA;
  document.querySelectorAll('[data-modelo]').forEach(b => {
    b.classList.toggle('is-on', b.dataset.modelo === modeloId);
  });
  const select = document.getElementById('modeloSelect');
  if (select && select.value !== modeloId) select.value = modeloId;
  actualizarChipModelo();
  renderCatalogo();
}

function initModeloSelector() {
  const select = document.getElementById('modeloSelect');
  if (select) {
    select.innerHTML = MODELOS.map(m => `<option value="${m.id}">${esc(m.nombre)}</option>`).join('');
    select.addEventListener('change', () => {
      aplicarModelo(select.value);
      document.getElementById('tienda')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }
  document.querySelectorAll('[data-modelo]').forEach(btn => btn.addEventListener('click', () => {
    aplicarModelo(btn.dataset.modelo);
    document.getElementById('tienda')?.scrollIntoView({ behavior: 'auto', block: 'start' });
  }));
  document.getElementById('modeloLimpiar')?.addEventListener('click', () => aplicarModelo('todos'));
}

function initFiltros() {
  const search = document.getElementById('catalogoSearch');
  const chips = document.querySelectorAll('[data-filter-cat]');
  const clear = document.getElementById('filtroClear');
  search?.addEventListener('input', () => { filterState.q = search.value; filterState.visibles = PAGINA; renderCatalogo(); });
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    filterState.cat = chip.dataset.filterCat;
    filterState.visibles = PAGINA;
    renderCatalogo();
  }));
  clear?.addEventListener('click', () => {
    filterState.q = ''; filterState.cat = 'all'; filterState.modelo = 'todos'; filterState.visibles = PAGINA;
    if (search) search.value = '';
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === 'all'));
    document.querySelectorAll('[data-modelo]').forEach(b => b.classList.toggle('is-on', b.dataset.modelo === 'todos'));
    const select = document.getElementById('modeloSelect');
    if (select) select.value = 'todos';
    actualizarChipModelo();
    renderCatalogo();
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    filterState.visibles += PAGINA;
    renderCatalogo();
  });
}

function gotoCategoria(catId) {
  document.querySelectorAll('[data-filter-cat]').forEach(c => c.classList.toggle('is-active', c.dataset.filterCat === catId));
  filterState.cat = catId;
  filterState.visibles = PAGINA;
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
  const cta = document.getElementById('drawerCheckout');
  if (!list) return;
  const items = Cart.get();
  if (!items.length) {
    list.innerHTML = '';
    if (empty) empty.hidden = false;
    if (totalEl) totalEl.textContent = formatearPrecio(0);
    if (cta) { cta.setAttribute('aria-disabled', 'true'); cta.removeAttribute('href'); }
    return;
  }
  if (empty) empty.hidden = true;
  list.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `
    <li class="drawer-item">
      <img src="${p.imagen}" alt="" width="120" height="120" loading="lazy" aria-hidden="true">
      <div class="drawer-item-info">
        <p class="drawer-item-sku">${esc(p.sku)}</p>
        <p class="drawer-item-name">${esc(p.nombre)}</p>
        <p class="drawer-item-price">${formatearPrecio(precioFinal(p))}</p>
        <div class="qty-stepper qty-stepper--sm">
          <button type="button" data-drawer-minus="${p.id}" aria-label="Restar">−</button>
          <span>${i.qty}</span>
          <button type="button" data-drawer-plus="${p.id}" aria-label="Sumar">+</button>
        </div>
      </div>
      <button type="button" class="drawer-item-remove" data-drawer-remove="${p.id}" aria-label="Quitar ${esc(p.nombre)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
    </li>`;
  }).join('');
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
  if (cta) { cta.removeAttribute('aria-disabled'); cta.setAttribute('href', mensajePedido()); }
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
    if (minus) { const id = minus.dataset.drawerMinus; const it = Cart.get().find(i => i.id === id); if (it) { if (it.qty - 1 <= 0) Cart.remove(id); else Cart.setQty(id, it.qty - 1); } }
    if (plus) { const id = plus.dataset.drawerPlus; const it = Cart.get().find(i => i.id === id); if (it) Cart.setQty(id, it.qty + 1); }
    if (remove) Cart.remove(remove.dataset.drawerRemove);
  });
  document.getElementById('drawerCheckout')?.addEventListener('click', e => {
    if (!Cart.count()) { e.preventDefault(); return; }
    showToast('Te llevamos a WhatsApp con el pedido listo.');
  });
}

function wireCardEvents(scope) {
  scope.querySelectorAll('[data-qty-minus]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.qtyMinus;
    qtyState[id] = Math.max(1, getQty(id) - 1);
    scope.querySelectorAll(`[data-qty-val="${id}"]`).forEach(el => el.textContent = qtyState[id]);
  }));
  scope.querySelectorAll('[data-qty-plus]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.qtyPlus; const p = getProducto(id);
    qtyState[id] = Math.min(p?.stock ?? 99, getQty(id) + 1);
    scope.querySelectorAll(`[data-qty-val="${id}"]`).forEach(el => el.textContent = qtyState[id]);
  }));
  scope.querySelectorAll('[data-add]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.add; const p = getProducto(id); if (!p || p.stock === 0) return;
    Cart.add(p, getQty(id));
    showToast('Agregado al pedido.');
  }));
  scope.querySelectorAll('[data-open-quick]').forEach(el => el.addEventListener('click', () => openQuickView(el.dataset.openQuick)));
}

function openQuickView(id) {
  const p = getProducto(id);
  const modal = document.getElementById('quickView');
  if (!p || !modal) return;
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s class="prod-price-old">${formatearPrecio(p.precio)}</s>` : '';
  const compatTodos = (p.compat || []).length >= TODOS_MODELOS.length;
  const compatTexto = compatTodos
    ? 'Compatible con todos los modelos'
    : (p.compat || []).map(nombreModelo).join(' · ');
  const relacionados = PRODUCTOS.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 3);
  modal.querySelector('[data-qv-body]').innerHTML = `
    <div class="qv-media">${badgeHtml(p)}<img src="${p.imagen}" alt="${esc(p.nombre)}" width="1170" height="1172"></div>
    <div class="qv-info">
      <p class="prod-sku">${esc(p.sku)}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="prod-price">${formatearPrecio(final)} ${tachado}</p>
      <p class="qv-desc">${esc(p.descripcion)}</p>
      <p class="qv-compat"><span>Compatibilidad</span>${esc(compatTexto)}</p>
      <div class="qv-actions">
        <div class="qty-stepper">
          <button type="button" data-qty-minus="${p.id}" aria-label="Restar cantidad">−</button>
          <span data-qty-val="${p.id}">1</span>
          <button type="button" data-qty-plus="${p.id}" aria-label="Sumar cantidad">+</button>
        </div>
        <button type="button" class="btn btn-cta" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''} style="flex:1">${p.stock === 0 ? 'Sin stock' : 'Agregar al pedido'}</button>
      </div>
      <a class="qv-consulta" data-wsp-msg="Hola! Quiero consultar por ${p.nombre} (${p.sku})." href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener">Consultar por este artículo →</a>
      ${relacionados.length ? `<div class="qv-relacionados"><p>Del mismo rubro</p><div class="qv-relacionados-grid">${relacionados.map(r => `<button type="button" data-open-quick="${r.id}"><img src="${r.imagen}" alt="" width="200" height="200" loading="lazy" aria-hidden="true"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
    </div>`;
  qtyState[p.id] = 1;
  wireCardEvents(modal);
  initWhatsAppLinks();
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
    up: { y: 0, opacity: 1, duration: .85 },
    clip: { clipPath: 'inset(0 0 0% 0)', opacity: 1, duration: 1.1 },
    scale: { scale: 1, y: 0, opacity: 1, duration: 1 },
  };
  items.forEach(el => {
    if (el.classList.contains('in')) return;
    gsap.to(el, {
      ...presets[el.dataset.animate || 'up'],
      ease: 'expo.out',
      delay: parseFloat(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
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
      y: 0, opacity: 1, duration: .85, ease: 'expo.out',
      delay: Math.min(i * 0.04, 0.35),
      scrollTrigger: { trigger: el, start: 'top 96%', once: true },
      onComplete: () => el.classList.add('in'),
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDestacados();
  renderCategorias();
  initModeloSelector();
  renderCatalogo();
  initWhatsAppLinks();
  initFloats();
  initNav();
  initDestacadosRail();
  initFiltros();
  initCartDrawer();
  initQuickView();
  initReveals();
  updateCartBadge();
  document.querySelectorAll('[data-goto-cat]').forEach(btn => btn.addEventListener('click', () => gotoCategoria(btn.dataset.gotoCat)));
});
