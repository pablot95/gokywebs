document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5493854114526';

const CATEGORIAS = {
  todos: 'Todo el catálogo',
  bombones: 'Bombones y chocolate',
  velas: 'Velas',
  jabones: 'Jabones',
  reposteria: 'Repostería',
  resina: 'Resina y yeso'
};

const MATERIALES = { silicona: 'Silicona', termoformado: 'Termoformado' };

const PRODUCTOS = [
  { id: 'termo-corazon-24', nombre: 'Termoformado corazón, 24 bombones', cat: 'bombones', mat: 'termoformado', cav: 24,
    precio: 7400, descuento: 0, medida: 'Placa 27 × 13,5 cm · cavidad 3 cm', stock: 40, destacado: true,
    desc: 'Placa de PET transparente para bombones con forma de corazón. Rígida, se desmolda con un golpe seco y aguanta el frío de la heladera.',
    img: 'images/termoformados.webp', tags: 'termoformado placa corazon bombon chocolate pet' },
  { id: 'molde-corazon-15', nombre: 'Molde corazón, 15 cavidades', cat: 'bombones', mat: 'silicona', cav: 15,
    precio: 18900, descuento: 0, medida: 'Placa 21 × 11 cm · cavidad 3,2 cm', stock: 25, destacado: true,
    desc: 'Silicona platino flexible para bombones rellenos. Soporta horno y freezer, y la pieza sale con el brillo del molde.',
    img: null, tags: 'molde silicona corazon bombon relleno' },
  { id: 'molde-bombon-facetado', nombre: 'Molde bombón facetado, 12 cavidades', cat: 'bombones', mat: 'silicona', cav: 12,
    precio: 17500, descuento: 0, medida: 'Placa 20 × 12 cm · cavidad 3,5 cm', stock: 18,
    desc: 'Caras planas y aristas vivas: el bombón sale con brillo de espejo si templás bien el chocolate.',
    img: null, tags: 'molde silicona bombon facetado diamante' },
  { id: 'termo-esferas-21', nombre: 'Termoformado esferas, 21 bombones', cat: 'bombones', mat: 'termoformado', cav: 21,
    precio: 6900, descuento: 0, medida: 'Placa 27 × 13,5 cm · esfera 2,8 cm', stock: 36,
    desc: 'La media esfera clásica para bombones y trufas. Dos placas encastran para cerrar la esfera entera.',
    img: null, tags: 'termoformado esfera media trufa bombon' },

  { id: 'molde-vela-burbuja', nombre: 'Molde vela burbuja, cubo', cat: 'velas', mat: 'silicona', cav: 1,
    precio: 12400, descuento: 0, medida: 'Cubo 6 × 6 cm · 180 g de cera', stock: 22, destacado: true,
    desc: 'El cubo de burbujas que no para de venderse. Silicona blanda para que las esferas salgan enteras.',
    img: 'images/velas.webp', tags: 'molde vela burbuja cubo bubble cera soja' },
  { id: 'molde-vela-acanalada', nombre: 'Molde vela acanalada', cat: 'velas', mat: 'silicona', cav: 1,
    precio: 11800, descuento: 0, medida: 'Cilindro 7 × 10 cm · 220 g de cera', stock: 20,
    desc: 'Canaletas parejas de arriba abajo, con base plana para que la vela quede firme sin portavelas.',
    img: null, tags: 'molde vela acanalada cilindro columna' },
  { id: 'molde-vela-corazon', nombre: 'Molde vela corazón 3D', cat: 'velas', mat: 'silicona', cav: 1,
    precio: 10900, descuento: 0, medida: 'Corazón 8 × 7 cm · 150 g de cera', stock: 26,
    desc: 'Corazón facetado en tres dimensiones, con el canal del pabilo ya marcado.',
    img: null, tags: 'molde vela corazon 3d facetado' },
  { id: 'molde-vela-flor', nombre: 'Molde vela flor', cat: 'velas', mat: 'silicona', cav: 1,
    precio: 11200, descuento: 10, medida: 'Flor 8 cm · 160 g de cera', stock: 15,
    desc: 'Pétalos redondeados y centro hundido. Queda igual de bien en cera de soja que en parafina.',
    img: null, tags: 'molde vela flor margarita petalos' },

  { id: 'molde-jabon-rosa', nombre: 'Molde jabón rosa', cat: 'jabones', mat: 'silicona', cav: 1,
    precio: 9800, descuento: 0, medida: 'Pieza 7,5 × 7,5 cm · 100 g', stock: 30, destacado: true,
    desc: 'Rosa en relieve alto, con hojas al costado. La silicona toma el detalle del pétalo sin burbujas.',
    img: 'images/florales.webp', tags: 'molde jabon rosa flor relieve glicerina' },
  { id: 'molde-jabon-margarita', nombre: 'Molde jabón margarita', cat: 'jabones', mat: 'silicona', cav: 1,
    precio: 9400, descuento: 0, medida: 'Pieza 7 cm · 90 g', stock: 28,
    desc: 'Margarita de doce pétalos, pensada para jabón de glicerina y para cemento decorativo.',
    img: null, tags: 'molde jabon margarita flor cemento' },
  { id: 'molde-jabon-rect-6', nombre: 'Molde jabón rectangular, 6 cavidades', cat: 'jabones', mat: 'silicona', cav: 6,
    precio: 16700, descuento: 0, medida: 'Placa 26 × 17 cm · barra 100 g', stock: 24,
    desc: 'Seis barras iguales en una sola colada. La medida estándar para vender jabón artesanal por unidad.',
    img: null, tags: 'molde jabon barra rectangular seis cavidades' },
  { id: 'termo-jabon-8', nombre: 'Termoformado jabonera, 8 cavidades', cat: 'jabones', mat: 'termoformado', cav: 8,
    precio: 5900, descuento: 0, medida: 'Placa 25 × 15 cm · cavidad 5 cm', stock: 34,
    desc: 'Placa rígida para jabón de glicerina: se llena caliente, se enfría y sale de una.',
    img: null, tags: 'termoformado jabon glicerina placa' },

  { id: 'molde-muffins-6', nombre: 'Molde muffins, 6 cavidades', cat: 'reposteria', mat: 'silicona', cav: 6,
    precio: 14600, descuento: 0, medida: 'Placa 26 × 18 cm · cavidad 7 cm', stock: 30, destacado: true,
    desc: 'Silicona apta horno hasta 230°. Los muffins salen sin pirotines y la placa se lava de un enjuague.',
    img: 'images/cupcakes.webp', tags: 'molde muffins cupcakes silicona horno' },
  { id: 'molde-savarin', nombre: 'Molde savarín 22 cm', cat: 'reposteria', mat: 'silicona', cav: 1,
    precio: 15900, descuento: 0, medida: 'Diámetro 22 cm · alto 8 cm', stock: 16,
    desc: 'El savarín de toda la vida en silicona: se desmolda sin enmantecar y no deja marcas.',
    img: null, tags: 'molde savarin corona budin horno' },
  { id: 'molde-budin', nombre: 'Molde budín rectangular', cat: 'reposteria', mat: 'silicona', cav: 1,
    precio: 13200, descuento: 0, medida: '24 × 11 × 6 cm', stock: 21,
    desc: 'Budinera de silicona con paredes firmes, para que el budín no se abra al sacarlo.',
    img: null, tags: 'molde budin budinera rectangular horno' },
  { id: 'molde-canele-6', nombre: 'Molde canelé, 6 cavidades', cat: 'reposteria', mat: 'silicona', cav: 6,
    precio: 15400, descuento: 12, medida: 'Placa 24 × 17 cm · cavidad 5,5 cm', stock: 14,
    desc: 'Estrías profundas y base angosta, la forma que le da al canelé la costra caramelizada.',
    img: null, tags: 'molde canele estrias reposteria francesa' },

  { id: 'molde-posavasos', nombre: 'Molde posavasos redondo', cat: 'resina', mat: 'silicona', cav: 1,
    precio: 8900, descuento: 0, medida: 'Diámetro 10 cm · alto 1 cm', stock: 32, destacado: true,
    desc: 'Base espejada para que la resina salga transparente de un lado, sin lijar.',
    img: null, tags: 'molde posavasos resina epoxi redondo' },
  { id: 'molde-bandeja-resina', nombre: 'Molde bandeja geométrica', cat: 'resina', mat: 'silicona', cav: 1,
    precio: 21500, descuento: 0, medida: '24 × 14 cm · alto 2,5 cm', stock: 12,
    desc: 'Bandeja con bordes rectos y esquinas vivas. Aguanta resina, cemento y yeso.',
    img: null, tags: 'molde bandeja resina cemento geometrica' },
  { id: 'termo-macetas-6', nombre: 'Termoformado macetas, 6 cavidades', cat: 'resina', mat: 'termoformado', cav: 6,
    precio: 7800, descuento: 0, medida: 'Placa 30 × 20 cm · maceta 6 cm', stock: 26,
    desc: 'Seis macetitas de cemento en una colada, con el borde ya terminado.',
    img: null, tags: 'termoformado maceta cemento suculenta' },
  { id: 'molde-letras-abc', nombre: 'Molde letras abecedario', cat: 'resina', mat: 'silicona', cav: 26,
    precio: 19800, descuento: 0, medida: 'Placa 30 × 20 cm · letra 3 cm', stock: 18,
    desc: 'Las 26 letras en una placa, para llaveros, imanes y carteles de resina.',
    img: null, tags: 'molde letras abecedario resina llavero' }
];

const MATRICES = [
  { id: 'jabon', nombre: 'Jabón de glicerina', min: 25, nota: 'Se desmolda en frío' },
  { id: 'vela', nombre: 'Cera de soja', min: 90, nota: 'Esperá el enfriado completo' },
  { id: 'chocolate', nombre: 'Chocolate templado', min: 20, nota: 'Heladera, nunca freezer' },
  { id: 'resina', nombre: 'Resina epoxi', min: 720, nota: 'Curado de 12 a 24 horas' },
  { id: 'yeso', nombre: 'Yeso o cemento', min: 60, nota: 'Fragua antes de desmoldar' }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const Cart = {
  KEY: 'egdeco_cart',
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); }
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

/* ---------- piezas de producto ---------- */
function mediaHTML(p) {
  if (p.img) return `<img src="${p.img}" width="1100" height="1100" alt="${esc(p.nombre)}">`;
  return `<span class="card__slot" aria-hidden="true">
      <span class="card__slotnum">${p.cav}</span>
      <span class="card__slotcat">${p.cav === 1 ? 'una pieza por colada' : 'cavidades'}</span>
    </span>`;
}

function cardHTML(p, clase, simple) {
  const fin = precioFinal(p);
  const badge = p.descuento > 0
    ? `<span class="card__badge card__badge--off">-${p.descuento}%</span>`
    : `<span class="card__badge">${MATERIALES[p.mat]}</span>`;
  return `<article class="card ${clase || ''}" data-id="${p.id}">
    <div class="card__media">${badge}${mediaHTML(p)}</div>
    <div class="card__body">
      <h3 class="card__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__corte">${esc(p.medida)}</p>
      <p class="card__precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}<span class="card__unidad">${p.cav === 1 ? '1 pieza' : p.cav + ' cav.'}</span></p>
      <div class="card__acciones">
        ${simple ? '' : `<span class="stepper" data-step="${p.id}">
          <button type="button" data-menos aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-mas aria-label="Sumar uno">+</button>
        </span>`}
        <button type="button" class="btn btn--solid prod-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function filaHTML(p) {
  const fin = precioFinal(p);
  return `<article class="fila" data-id="${p.id}">
    <span class="fila__media">${mediaHTML(p)}</span>
    <span class="fila__info">
      <span class="fila__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></span>
      <span class="fila__meta">${esc(p.medida)}</span>
    </span>
    <span class="fila__mat">${MATERIALES[p.mat]}</span>
    <span class="fila__cav">${p.cav === 1 ? '1 pieza' : p.cav + ' cav.'}</span>
    <span class="fila__precio">${formatearPrecio(fin)}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>
    <span class="fila__acc">
      <span class="stepper" data-step="${p.id}">
        <button type="button" data-menos aria-label="Quitar uno">−</button>
        <span data-qty>1</span>
        <button type="button" data-mas aria-label="Sumar uno">+</button>
      </span>
      <button type="button" class="btn btn--solid prod-add" data-add="${p.id}">Sumar</button>
    </span>
  </article>`;
}

/* ---------- catálogo ---------- */
const grid = document.getElementById('catalogoGrid');
const esLista = document.body.classList.contains('m2');
const estado = { cat: 'todos', mat: [], cav: [], max: 25000, q: '', orden: 'destacados', mostrados: 16 };
let revealsListos = false;

function listaFiltrada() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todos' && p.cat !== estado.cat) return false;
    if (estado.mat.length && !estado.mat.includes(p.mat)) return false;
    if (estado.cav.length) {
      const rango = p.cav === 1 ? 'una' : (p.cav <= 12 ? 'pocas' : 'muchas');
      if (!estado.cav.includes(rango)) return false;
    }
    if (precioFinal(p) > estado.max) return false;
    if (q.length) {
      const heno = normalizar([p.nombre, p.medida, p.desc, p.tags, CATEGORIAS[p.cat], MATERIALES[p.mat]].join(' '));
      if (!q.every(t => heno.includes(t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => ((b.img ? 2 : 0) + (b.destacado ? 1 : 0)) - ((a.img ? 2 : 0) + (a.destacado ? 1 : 0)));
  return lista;
}

function aplicar() {
  if (!grid) return;
  const lista = listaFiltrada();
  const visibles = lista.slice(0, estado.mostrados);
  grid.innerHTML = visibles.map(p => (esLista ? filaHTML(p) : cardHTML(p))).join('');
  const contador = document.getElementById('contador');
  if (contador) contador.textContent = lista.length;
  const vacio = document.getElementById('vacio');
  if (vacio) vacio.hidden = lista.length > 0;
  const verMas = document.getElementById('verMas');
  if (verMas) verMas.hidden = lista.length <= estado.mostrados;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
}

function initCatalogo() {
  if (!grid) return;

  document.querySelectorAll('.pestana').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pestana').forEach(b => b.classList.toggle('is-on', b === btn));
      estado.cat = btn.dataset.cat;
      estado.mostrados = 16;
      aplicar();
    });
  });

  document.querySelectorAll('input[name="mat"]').forEach(i => i.addEventListener('change', () => {
    estado.mat = [...document.querySelectorAll('input[name="mat"]:checked')].map(x => x.value);
    estado.mostrados = 16; aplicar();
  }));
  document.querySelectorAll('input[name="cav"]').forEach(i => i.addEventListener('change', () => {
    estado.cav = [...document.querySelectorAll('input[name="cav"]:checked')].map(x => x.value);
    estado.mostrados = 16; aplicar();
  }));

  const rango = document.getElementById('precioMax');
  const precioVal = document.getElementById('precioVal');
  rango?.addEventListener('input', () => {
    estado.max = Number(rango.value);
    if (precioVal) precioVal.textContent = formatearPrecio(estado.max);
    estado.mostrados = 16; aplicar();
  });

  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; aplicar(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.mostrados += 16; aplicar(); });
  document.getElementById('limpiarFiltros')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacioReset')?.addEventListener('click', limpiarTodo);

  const sync = input => input?.addEventListener('input', () => {
    estado.q = input.value; estado.mostrados = 16; aplicar();
    ['headerSearch', 'listaSearch'].forEach(id => {
      const otro = document.getElementById(id);
      if (otro && otro !== input) otro.value = input.value;
    });
  });
  sync(document.getElementById('headerSearch'));
  sync(document.getElementById('listaSearch'));
  ['headerSearchForm', 'listaSearchForm'].forEach(id => {
    document.getElementById(id)?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  document.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
    const chip = document.querySelector(`.pestana[data-cat="${a.dataset.catLink}"]`);
    if (chip) chip.click();
    document.getElementById('catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  const toggle = document.getElementById('filtrosToggle');
  const filtros = document.getElementById('filtros');
  const cerrarF = document.getElementById('filtrosClose');
  toggle?.addEventListener('click', () => {
    const abierto = filtros.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(abierto));
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  cerrarF?.addEventListener('click', () => {
    filtros.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false'); toggle?.focus();
  });

  aplicar();
}

function limpiarTodo() {
  estado.cat = 'todos'; estado.mat = []; estado.cav = []; estado.max = 25000; estado.q = ''; estado.orden = 'destacados'; estado.mostrados = 16;
  document.querySelectorAll('.pestana').forEach(b => b.classList.toggle('is-on', b.dataset.cat === 'todos'));
  document.querySelectorAll('input[name="mat"], input[name="cav"]').forEach(i => { i.checked = false; });
  const rango = document.getElementById('precioMax');
  if (rango) rango.value = 25000;
  const precioVal = document.getElementById('precioVal');
  if (precioVal) precioVal.textContent = formatearPrecio(25000);
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  ['headerSearch', 'listaSearch'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  aplicar();
}

/* ---------- rail (modelo 1) ---------- */
function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 6);
  track.innerHTML = destacados.map(p => cardHTML(p, 'rail-card', true)).join('');
  track.setAttribute('data-animate-stagger', '');
  [...track.children].forEach(c => {
    c.setAttribute('data-animate', '');
    c.style.opacity = '0';
    c.style.transform = 'translateY(26px)';
  });

  const vp = document.getElementById('railVp');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp) return;

  const syncFlechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', syncFlechas, { passive: true });
  window.addEventListener('resize', syncFlechas, { passive: true });
  syncFlechas();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    if (moved) { vp.scrollLeft = startScroll - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* ---------- momento propio: el molde y la pieza ---------- */
function initEscena() {
  const sec = document.getElementById('escena');
  if (!sec) return;
  const mundoB = sec.querySelector('.escena__b');
  const linea = sec.querySelector('.escena__linea');
  const num = document.getElementById('escenaNum');
  const sticky = sec.querySelector('.escena__sticky');
  const track = sec.querySelector('.escena__track');
  const cav = 24;

  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  const pintar = () => {
    const r = track.getBoundingClientRect();
    const recorrido = Math.max(1, r.height - sticky.getBoundingClientRect().height);
    let p = (OFF - r.top) / recorrido;
    p = Math.min(1, Math.max(0, p));
    const x = (1 - p) * 100;
    mundoB.style.clipPath = `inset(0 0 0 ${x}%)`;
    linea.style.left = `${x}%`;
    linea.style.opacity = p > 0.02 && p < 0.98 ? '1' : '0';
    num.textContent = Math.round(p * cav);
    sec.classList.toggle('is-b', p > 0.5);
  };

  if (reduceMotion) {
    mundoB.style.clipPath = 'inset(0 0 0 0)';
    linea.style.opacity = '0';
    num.textContent = cav;
    sec.classList.add('is-b');
    return;
  }
  pintar();
  window.addEventListener('scroll', pintar, { passive: true });
  window.addEventListener('resize', pintar, { passive: true });
  window.addEventListener('load', pintar);
  let i = 0;
  const t = setInterval(() => { pintar(); if (++i >= 12) clearInterval(t); }, 500);
}

/* ---------- componente funcional: cuánto te rinde ---------- */
function initRinde() {
  const selMolde = document.getElementById('rindeMolde');
  if (!selMolde) return;
  const selMat = document.getElementById('rindeMaterial');
  const selTandas = document.getElementById('rindeTandas');
  const outPiezas = document.getElementById('rindePiezas');
  const outDia = document.getElementById('rindeDia');
  const outCosto = document.getElementById('rindeCosto');
  const outTiempo = document.getElementById('rindeTiempo');
  const nota = document.getElementById('rindeNota');
  const add = document.getElementById('rindeAdd');
  const wsp = document.getElementById('rindeWsp');

  selMolde.innerHTML = PRODUCTOS.map(p => `<option value="${p.id}">${esc(p.nombre)}</option>`).join('');
  selMat.innerHTML = MATRICES.map(m => `<option value="${m.id}">${esc(m.nombre)}</option>`).join('');

  const pintar = () => {
    const p = getProducto(selMolde.value) || PRODUCTOS[0];
    const m = MATRICES.find(x => x.id === selMat.value) || MATRICES[0];
    const tandas = Number(selTandas.value) || 1;
    const porTanda = p.cav;
    const porDia = porTanda * tandas;
    const enSemana = porDia * 6;
    const costo = precioFinal(p) / Math.max(1, enSemana);
    outPiezas.textContent = porTanda;
    outDia.textContent = porDia;
    outCosto.textContent = formatearPrecio(costo);
    const horas = (m.min * tandas) / 60;
    outTiempo.textContent = m.min < 60 ? `${m.min * tandas} min` : `${horas.toFixed(horas < 10 ? 1 : 0)} h`;
    nota.textContent = `${m.nota}. En una semana de 6 días de trabajo salen ${enSemana} piezas de este molde.`;
    add.dataset.add = p.id;
    const msg = `Hola, me interesa el ${p.nombre}. Lo quiero para ${m.nombre.toLowerCase()}: ${porDia} piezas por día.`;
    wsp.setAttribute('href', `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`);
  };

  [selMolde, selMat, selTandas].forEach(el => el.addEventListener('change', pintar));
  pintar();
}

/* ---------- acciones ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = step.querySelector('[data-qty]');
      let q = Number(span.textContent) || 1;
      if (e.target.closest('[data-mas]')) q++;
      if (e.target.closest('[data-menos]')) q = Math.max(1, q - 1);
      span.textContent = q;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const cont = add.closest('.card, .fila, .modal__panel, .rinde');
      const qty = Number(cont?.querySelector('[data-qty]')?.textContent) || 1;
      Cart.add(p, qty);
      showToast(`${p.nombre} va al pedido`);
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const qty = Number(comprar.closest('.modal__panel')?.querySelector('[data-qty]')?.textContent) || 1;
      Cart.add(p, qty);
      cerrarQuick();
      abrirDrawer();
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) abrirQuick(quick.dataset.quick);
  });
}

/* ---------- vista rápida ---------- */
const modal = document.getElementById('quickModal');
let ultimoFoco = null;

function abrirQuick(id) {
  const p = getProducto(id);
  if (!p || !modal) return;
  ultimoFoco = document.activeElement;
  const fin = precioFinal(p);
  const rel = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  document.getElementById('quickContent').innerHTML = `
    <div class="quick__media">${mediaHTML(p)}</div>
    <div class="quick__info">
      <p class="eyebrow">${esc(CATEGORIAS[p.cat])}</p>
      <h2 id="quickTit">${esc(p.nombre)}</h2>
      <p class="quick__precio"><b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="quick__desc">${esc(p.desc)}</p>
      <ul class="quick__datos">
        <li><span>Material</span><strong>${MATERIALES[p.mat]}</strong></li>
        <li><span>Medidas</span><strong>${esc(p.medida)}</strong></li>
        <li><span>Rinde por colada</span><strong>${p.cav === 1 ? '1 pieza' : p.cav + ' piezas'}</strong></li>
      </ul>
      <div class="quick__acciones">
        <span class="stepper" data-step="${p.id}">
          <button type="button" data-menos aria-label="Quitar uno">−</button>
          <span data-qty>1</span>
          <button type="button" data-mas aria-label="Sumar uno">+</button>
        </span>
        <button type="button" class="btn btn--line" data-add="${p.id}">Agregar</button>
        <button type="button" class="btn btn--solid" data-comprar="${p.id}">Comprar ahora</button>
      </div>
      ${rel.length ? `<div class="quick__rel"><h4>De la misma familia</h4><div class="quick__rel-grid">
        ${rel.map(r => `<button type="button" class="quick__rel-item" data-quick="${r.id}">
          <span class="card__media">${mediaHTML(r)}</span>
          <span>${esc(r.nombre)}</span>
        </button>`).join('')}
      </div></div>` : ''}
    </div>`;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  modal.querySelector('#quickClose')?.focus();
}

function cerrarQuick() {
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initQuick() {
  if (!modal) return;
  document.getElementById('quickClose')?.addEventListener('click', cerrarQuick);
  modal.querySelector('[data-close-modal]')?.addEventListener('click', cerrarQuick);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) cerrarQuick();
    if (e.key === 'Tab' && !modal.hidden) trapFocus(e, modal.querySelector('.modal__panel'));
  });
}

function trapFocus(e, cont) {
  if (!cont) return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* ---------- carrito ---------- */
const drawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('drawerBackdrop');
let focoDrawer = null;

function abrirDrawer() {
  if (!drawer) return;
  focoDrawer = document.activeElement;
  drawer.hidden = false; backdrop.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); backdrop.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}
function cerrarDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); backdrop.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 380);
  focoDrawer?.focus();
}

function lineasHTML() {
  return Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea">
      <span class="linea__media">${mediaHTML(p)}</span>
      <span>
        <span class="linea__nombre">${esc(p.nombre)}</span>
        <span class="linea__meta">${MATERIALES[p.mat]} · ${p.cav === 1 ? '1 pieza' : p.cav + ' cav.'}</span>
        <span class="stepper" data-linea="${p.id}">
          <button type="button" data-lmenos aria-label="Quitar uno">−</button>
          <span>${i.qty}</span>
          <button type="button" data-lmas aria-label="Sumar uno">+</button>
        </span>
      </span>
      <span>
        <span class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</span><br>
        <button type="button" class="linea__quitar" data-quitar="${p.id}">Quitar</button>
      </span>
    </div>`;
  }).join('');
}

function pintarCarrito() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (body && foot) {
    if (!Cart.get().length) {
      body.innerHTML = `<div class="drawer__vacio">
        <p>Todavía no sumaste ningún molde.</p>
        <a class="btn btn--solid" href="#catalogo" data-cerrar-drawer>Ver el catálogo</a>
      </div>`;
      foot.innerHTML = '';
    } else {
      body.innerHTML = lineasHTML();
      foot.innerHTML = `<p class="drawer__total"><span>Total del pedido</span><strong>${formatearPrecio(Cart.total())}</strong></p>
        <button type="button" class="btn btn--solid btn--block" id="finalizar">Finalizar compra</button>`;
    }
  }
  pintarPanel();
}

function pintarPanel() {
  const panel = document.getElementById('panelPedido');
  if (!panel) return;
  const items = Cart.get();
  const cuerpo = panel.querySelector('.panel__body');
  const total = panel.querySelector('.panel__total strong');
  const wsp = panel.querySelector('#panelWsp');
  const n = panel.querySelector('#panelN');
  if (n) n.textContent = Cart.count();
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (cuerpo) {
    cuerpo.innerHTML = items.length
      ? items.map(i => {
        const p = getProducto(i.id);
        if (!p) return '';
        return `<div class="panel__linea">
          <span>${esc(p.nombre)}</span>
          <span class="panel__qty">${i.qty} ×</span>
          <span class="panel__precio">${formatearPrecio(precioFinal(p) * i.qty)}</span>
          <button type="button" class="panel__quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}">×</button>
        </div>`;
      }).join('')
      : '<p class="panel__vacio">Cargá cantidades en la lista y el pedido se arma acá.</p>';
  }
  if (wsp) {
    const detalle = items.map(i => { const p = getProducto(i.id); return p ? `${i.qty} × ${p.nombre}` : ''; }).filter(Boolean).join(', ');
    const msg = items.length
      ? `Hola, quiero hacer este pedido: ${detalle}. Total ${formatearPrecio(Cart.total())}.`
      : 'Hola, quiero hacer un pedido de moldes.';
    wsp.setAttribute('href', `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`);
  }
}

function initDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  backdrop?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) cerrarDrawer();
    if (e.key === 'Tab' && drawer && !drawer.hidden) trapFocus(e, drawer);
  });
  document.addEventListener('click', e => {
    const linea = e.target.closest('[data-linea]');
    if (linea) {
      const id = linea.dataset.linea;
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      if (e.target.closest('[data-lmas]')) Cart.setQty(id, actual + 1);
      if (e.target.closest('[data-lmenos]')) { if (actual <= 1) Cart.remove(id); else Cart.setQty(id, actual - 1); }
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) Cart.remove(quitar.dataset.quitar);
    if (e.target.closest('#finalizar')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
    if (e.target.closest('#panelVaciar')) Cart.clear();
  });
  document.addEventListener('cart:updated', pintarCarrito);
  pintarCarrito();
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

/* ---------- banner del modelo 1 ---------- */
function initBanner() {
  const mensajes = document.querySelectorAll('.mensaje');
  const pips = document.querySelectorAll('.hero-banner__pips button');
  if (mensajes.length < 2) return;
  let i = 0;
  const mostrar = n => {
    i = n;
    mensajes.forEach((m, k) => m.classList.toggle('is-on', k === n));
    pips.forEach((p, k) => p.setAttribute('aria-current', String(k === n)));
  };
  pips.forEach((p, k) => p.addEventListener('click', () => mostrar(k)));
  mostrar(0);
  if (reduceMotion) return;
  setInterval(() => mostrar((i + 1) % mensajes.length), 5200);
}

/* ---------- newsletter ---------- */
function initNews() {
  const form = document.getElementById('newsForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const txt = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = txt; form.reset();
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
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

/* ---------- reveals ---------- */
function initReveals() {
  revealsListos = true;
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
  let intentos = 0;
  const tick = setInterval(() => { sweep(); if (++intentos >= 12) clearInterval(tick); }, 500);
}

/* ---------- flotantes ---------- */
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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

/* ---------- hero ---------- */
function initHero() {
  const foto = document.querySelector('.hero-banner__media img');
  if (foto && typeof gsap !== 'undefined' && !reduceMotion) gsap.to(foto, { scale: 1, duration: 1.4, ease: 'power2.out' });
  else if (foto) foto.style.transform = 'none';
}

/* ---------- arranque ---------- */
initCatalogo();
initRail();
initBanner();
initNews();
initReveals();
initNav();
initQuick();
initDrawer();
initAcciones();
initEscena();
initRinde();
initFloats();
initHero();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
const anio = document.getElementById('year');
if (anio) anio.textContent = new Date().getFullYear();
