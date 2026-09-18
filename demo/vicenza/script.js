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
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const WSP = '5492226474826';
const RE_TILDES = new RegExp('[\\u0300-\\u036f]', 'g');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(RE_TILDES, '');
const precio = n => '$' + Math.round(n).toLocaleString('es-AR');
const wa = txt => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(txt);

const CATEGORIAS = [
  { id: 'kits', nombre: 'Kits completos', aro: 'var(--color-primary)', foto: 'prod-kit-completo.webp' },
  { id: 'sueltas', nombre: 'Piezas sueltas', aro: 'var(--t-coral)', foto: 'prod-piezas-sueltas.webp' },
  { id: 'souvenirs', nombre: 'Souvenirs', aro: 'var(--t-cielo)', foto: 'eventos-bolsitas.webp' },
  { id: 'eventos', nombre: 'Eventos', aro: 'var(--t-sol)', foto: 'prod-figuras-pintadas.webp' },
  { id: 'pinturas', nombre: 'Témperas y pinceles', aro: 'var(--color-primary)', foto: 'prod-temperas-pinceles.webp' }
];

const PRODUCTOS = [
  {
    id: 'kit-animalitos', nombre: 'Kit Animalitos', cat: 'kits', precio: 4900,
    foto: 'prod-kit-completo.webp', alt: 'Kit con témperas de colores, pincel y figuras de yeso sin pintar',
    chip: 'Más vendido', chipColor: 'var(--t-sol)', unitario: 2100,
    desc: 'La caja que más sale. Una figura de yeso de animalito, dos potes de témpera y un pincel, listos para sentarse a pintar.',
    incluye: ['1 figura de yeso de 7 cm', '2 potes de témpera', '1 pincel', 'Bolsita y tarjeta']
  },
  {
    id: 'kit-princesas', nombre: 'Kit Princesas', cat: 'kits', precio: 4900, nuevo: true,
    foto: 'momento-pincel.webp', alt: 'Figura de yeso de una nena siendo pintada con pincel',
    unitario: 2300,
    desc: 'Figura de nena con vestido y corona de flores. Es la que más piden para cumpleaños de 4 a 8 años.',
    incluye: ['1 figura de yeso de 8 cm', '2 potes de témpera', '1 pincel', 'Bolsita y tarjeta']
  },
  {
    id: 'kit-familia', nombre: 'Kit Familia · 3 piezas', cat: 'kits', precio: 12900,
    foto: 'prod-figuras-color.webp', alt: 'Dos figuras de yeso pintadas en tonos suaves sobre fondo rosado',
    unitario: 5900,
    desc: 'Tres figuras para pintar entre varios, con una paleta más grande. Va bien como regalo de fin de año.',
    incluye: ['3 figuras de yeso', '6 potes de témpera', '2 pinceles', 'Caja con instructivo']
  },
  {
    id: 'sueltas-chicas', nombre: 'Piezas sueltas chicas · x10', cat: 'sueltas', precio: 9800,
    foto: 'prod-piezas-sueltas.webp', alt: 'Pared con muchas figuras de yeso pintadas de distintos colores',
    desc: 'Diez piezas de yeso sin pintar, surtidas. Para quien ya tiene las pinturas o quiere probar sus propios colores.',
    incluye: ['10 piezas de yeso surtidas', 'Entre 5 y 8 cm cada una', 'Sin témperas ni pincel']
  },
  {
    id: 'sueltas-animalitos', nombre: 'Piezas sueltas animalitos · x6', cat: 'sueltas', precio: 7500, nuevo: true,
    foto: 'prod-animalitos.webp', alt: 'Figuras de patitos de yeso blancas apoyadas en un estante',
    desc: 'Seis animalitos sin pintar, todos distintos. Los que más se usan para mesas de cumpleaños.',
    incluye: ['6 piezas de yeso', 'Modelos surtidos', 'Sin témperas ni pincel']
  },
  {
    id: 'souvenir-unidad', nombre: 'Souvenir individual', cat: 'souvenirs', precio: 2100, nuevo: true,
    foto: 'eventos-bolsitas.webp', alt: 'Bolsitas de souvenir con tarjeta colgada, en fila sobre una mesa',
    unitario: 2100,
    desc: 'La bolsita armada, lista para repartir. Se cobra por unidad, así pedís exactamente los que te hacen falta.',
    incluye: ['1 figura de yeso', '2 potes de témpera', '1 pincel', 'Bolsita con tarjeta del evento']
  },
  {
    id: 'souvenir-x25', nombre: 'Souvenirs · pack x25', cat: 'souvenirs', precio: 52500,
    foto: 'eventos-bolsitas.webp', alt: 'Bolsitas de souvenir con tarjeta preparadas para un evento',
    chip: 'Para eventos', chipColor: 'var(--t-cielo)',
    desc: 'Veinticinco bolsitas armadas con la tarjeta del evento. Es el pack que más se lleva para un cumpleaños.',
    incluye: ['25 figuras de yeso', '50 potes de témpera', '25 pinceles', 'Tarjetas con nombre y fecha']
  },
  {
    id: 'evento-mesa', nombre: 'Mesa para pintar · x12', cat: 'eventos', precio: 31200, nuevo: true,
    foto: 'prod-figuras-pintadas.webp', alt: 'Figuras de yeso pintadas junto a un vaso con agua y pinceles',
    desc: 'Todo lo de una mesa de pintura para doce chicos: piezas, pinturas repartidas en potes y pinceles de repuesto.',
    incluye: ['12 figuras de yeso', 'Témperas en potes para compartir', '16 pinceles', 'Mantel y repuestos']
  },
  {
    id: 'temperas-x6', nombre: 'Set de témperas · x6', cat: 'pinturas', precio: 3800,
    foto: 'prod-temperas-pinceles.webp', alt: 'Potes de témpera de colores y pinceles sobre fondo blanco',
    desc: 'Seis colores base para seguir pintando cuando se terminan los del kit.',
    incluye: ['6 potes de témpera', 'Colores base surtidos', 'Se usan con agua']
  },
  {
    id: 'pinceles-x3', nombre: 'Pinceles · x3', cat: 'pinturas', precio: 2400, nuevo: true,
    foto: 'prod-temperas-pinceles.webp', alt: 'Pinceles de colores alineados sobre fondo blanco',
    desc: 'Tres pinceles de distinto grosor: uno para el fondo, uno para el detalle y uno finito para la cara.',
    incluye: ['3 pinceles', 'Grosores fino, medio y grueso', 'Mango de madera']
  }
];

const DESTACADOS = ['kit-animalitos', 'souvenir-x25', 'sueltas-chicas', 'kit-familia', 'temperas-x6'];
const CAT_LABEL = Object.fromEntries(CATEGORIAS.map(c => [c.id, c.nombre]));
const getProducto = id => PRODUCTOS.find(p => p.id === id);

let catActiva = 'todas';
let busqueda = '';
let modalProd = null;
let modalQty = 1;
let ultimoFoco = null;

/* ---------- toast ---------- */
function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

/* ---------- carrito ---------- */
const Cart = {
  KEY: 'vicenza_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin storage */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 999);
    else items.push({ id: producto.id, qty: Math.min(qty, 999) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 999)); this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); }
};

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

/* ---------- categorías ---------- */
function initCategorias() {
  const cont = document.getElementById('catLista');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return '<li class="cat-item" data-animate="up" style="transform:translateY(28px);opacity:0">' +
      '<button type="button" class="cat-btn" data-cat="' + c.id + '">' +
      '<span class="cat-aro" style="--aro:' + c.aro + '"><span><img src="images/' + c.foto + '" width="600" height="600" alt="' + esc(c.nombre) + '"></span></span>' +
      '<span class="cat-nombre">' + esc(c.nombre) + '<span class="cat-n">' + n + (n === 1 ? ' producto' : ' productos') + '</span></span>' +
      '</button></li>';
  }).join('');
  cont.addEventListener('click', e => {
    const b = e.target.closest('.cat-btn');
    if (!b) return;
    catActiva = b.dataset.cat;
    busqueda = '';
    const input = document.getElementById('buscar');
    if (input) input.value = '';
    pintarChips();
    renderGrid();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- mosaico ---------- */
function initMosaico() {
  const cont = document.getElementById('mosaico');
  if (!cont) return;
  cont.innerHTML = DESTACADOS.map(id => {
    const p = getProducto(id);
    if (!p) return '';
    return '<button type="button" class="tile" data-id="' + p.id + '">' +
      '<img src="images/' + p.foto + '" width="1100" height="1100" alt="' + esc(p.alt) + '">' +
      (p.chip ? '<span class="tile-chip" style="--chip:' + p.chipColor + '">' + esc(p.chip) + '</span>' : '') +
      '<span class="tile-copy"><span class="tile-nombre">' + esc(p.nombre) + '</span><span class="tile-precio">' + precio(p.precio) + '</span></span>' +
      '</button>';
  }).join('');
  cont.addEventListener('click', e => {
    const t = e.target.closest('.tile');
    if (t) abrirModal(t.dataset.id);
  });
}

/* ---------- rail lo nuevo ---------- */
function initRail() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  if (!vp || !track) return;
  const nuevos = PRODUCTOS.filter(p => p.nuevo);
  track.innerHTML = nuevos.map(p =>
    '<button type="button" class="rail-card" data-id="' + p.id + '">' +
    '<span class="rail-foto"><img src="images/' + p.foto + '" width="1100" height="1100" alt="' + esc(p.alt) + '"></span>' +
    '<span class="rail-nombre">' + esc(p.nombre) + '</span>' +
    '<span class="rail-precio">' + precio(p.precio) + '</span>' +
    '</button>'
  ).join('');

  track.addEventListener('click', e => {
    const c = e.target.closest('.rail-card');
    if (c) abrirModal(c.dataset.id);
  });

  initRailDrag(vp);

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * 0.8;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture igual funciona */ }
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

/* ---------- catálogo ---------- */
function visibles() {
  const q = norm(busqueda.trim());
  return PRODUCTOS.filter(p => {
    if (catActiva !== 'todas' && p.cat !== catActiva) return false;
    if (!q) return true;
    return norm(p.nombre + ' ' + CAT_LABEL[p.cat] + ' ' + p.desc + ' ' + p.incluye.join(' ')).includes(q);
  });
}

function pintarChips() {
  const cont = document.getElementById('chips');
  if (!cont) return;
  const todas = [{ id: 'todas', nombre: 'Todo' }].concat(CATEGORIAS);
  cont.innerHTML = todas.map(c =>
    '<button type="button" class="chip' + (c.id === catActiva ? ' is-on' : '') + '" data-cat="' + c.id + '" aria-pressed="' + (c.id === catActiva) + '">' + esc(c.nombre) + '</button>'
  ).join('');
}

function tarjeta(p) {
  return '<article class="prod pre" data-id="' + p.id + '">' +
    '<button type="button" class="prod-foto" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
    '<img src="images/' + p.foto + '" width="1100" height="1100" alt="' + esc(p.alt) + '">' +
    (p.chip ? '<span class="prod-chip" style="--chip:' + p.chipColor + '">' + esc(p.chip) + '</span>' : '') +
    '</button>' +
    '<div class="prod-body">' +
    '<h3 class="prod-nombre">' + esc(p.nombre) + '</h3>' +
    '<p class="prod-precio">' + precio(p.precio) + '</p>' +
    '<div class="prod-actions">' +
    '<div class="stepper"><button type="button" class="stepper-btn" data-menos="' + p.id + '" aria-label="Quitar uno">−</button>' +
    '<span class="stepper-n" data-n="' + p.id + '">1</span>' +
    '<button type="button" class="stepper-btn" data-mas="' + p.id + '" aria-label="Sumar uno">+</button></div>' +
    '<button type="button" class="prod-add" data-add="' + p.id + '">Agregar</button>' +
    '</div></div></article>';
}

function renderGrid() {
  const grid = document.getElementById('gridProd');
  const vacio = document.getElementById('vacio');
  const conteo = document.getElementById('conteo');
  if (!grid) return;
  const lista = visibles();
  grid.innerHTML = lista.map(tarjeta).join('');
  if (vacio) vacio.hidden = lista.length > 0;
  if (conteo) {
    conteo.textContent = lista.length + (lista.length === 1 ? ' producto' : ' productos') +
      (catActiva !== 'todas' ? ' en ' + CAT_LABEL[catActiva].toLowerCase() : '') +
      (busqueda.trim() ? ' para «' + busqueda.trim() + '»' : '');
  }
  revelarProductos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarProductos(grid) {
  const cards = [...grid.children];
  if (reduceMotion) { cards.forEach(c => c.classList.remove('pre')); return; }
  if (grid.getBoundingClientRect().top < window.innerHeight * 0.95) {
    cards.forEach((c, i) => setTimeout(() => c.classList.remove('pre'), Math.min(i * 70, 560)));
    return;
  }
  let hecho = false;
  const soltar = () => {
    if (hecho) return;
    hecho = true;
    cards.forEach((c, i) => setTimeout(() => c.classList.remove('pre'), Math.min(i * 70, 560)));
    window.removeEventListener('scroll', mirar);
    window.removeEventListener('resize', mirar);
  };
  function mirar() {
    const r = grid.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight * 0.95) soltar();
  }
  window.addEventListener('scroll', mirar, { passive: true });
  window.addEventListener('resize', mirar, { passive: true });
  setTimeout(soltar, 4000);
}

function initTienda() {
  pintarChips();
  renderGrid();

  document.getElementById('chips')?.addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    catActiva = c.dataset.cat;
    pintarChips();
    renderGrid();
  });

  const buscar = document.getElementById('buscar');
  buscar?.addEventListener('input', () => { busqueda = buscar.value; renderGrid(); });

  document.getElementById('limpiar')?.addEventListener('click', () => {
    catActiva = 'todas'; busqueda = '';
    if (buscar) buscar.value = '';
    pintarChips(); renderGrid();
  });

  const grid = document.getElementById('gridProd');
  grid?.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver); return; }
    const mas = e.target.closest('[data-mas]');
    const menos = e.target.closest('[data-menos]');
    const add = e.target.closest('[data-add]');
    if (mas || menos) {
      const id = (mas || menos).dataset.mas || (mas || menos).dataset.menos;
      const span = grid.querySelector('[data-n="' + id + '"]');
      if (!span) return;
      const n = Math.max(1, Math.min(99, parseInt(span.textContent, 10) + (mas ? 1 : -1)));
      span.textContent = n;
      return;
    }
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const span = grid.querySelector('[data-n="' + p.id + '"]');
      const n = span ? parseInt(span.textContent, 10) : 1;
      Cart.add(p, n);
      if (span) span.textContent = '1';
      showToast(p.nombre + ' × ' + n + ' en el carrito');
    }
  });
}

/* ---------- instagram ---------- */
function initIg() {
  const cont = document.getElementById('igGrid');
  if (!cont) return;
  const fotos = [
    ['prod-kit-completo.webp', 'Kit con témperas, pincel y figuras de yeso'],
    ['prod-figuras-pintadas.webp', 'Figuras de yeso ya pintadas de colores'],
    ['prod-animalitos.webp', 'Patitos de yeso sin pintar en un estante'],
    ['prod-temperas-pinceles.webp', 'Potes de témpera y pinceles de colores'],
    ['prod-piezas-sueltas.webp', 'Muchas figuras de yeso pintadas juntas'],
    ['prod-figuras-color.webp', 'Dos figuras de yeso pintadas en tonos suaves']
  ];
  cont.innerHTML = fotos.map(f =>
    '<div class="ig-tile"><img src="images/' + f[0] + '" width="1100" height="1100" alt="' + esc(f[1]) + '"></div>'
  ).join('');
}

/* ---------- momento propio: la foto que crece ---------- */
function initCrece() {
  const sec = document.getElementById('crece');
  if (!sec) return;
  const elUnidades = document.getElementById('creceUnidades');
  const elPrecio = document.getElementById('crecePrecio');
  const elTxt = document.getElementById('creceTxt');
  const cta = document.getElementById('creceCta');
  const chico = window.matchMedia('(max-width: 768px)');
  const UNIT = 2100, TOPE = 25;

  const pintar = () => {
    const r = sec.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    const w0 = chico.matches ? 62 : 24;
    sec.style.setProperty('--w', (w0 + (100 - w0) * p).toFixed(2));
    sec.style.setProperty('--ar', (0.8 + 1.1 * p).toFixed(3));
    sec.style.setProperty('--r', (28 - 26 * p).toFixed(1));

    const n = Math.max(1, Math.round(1 + (TOPE - 1) * p));
    elUnidades.textContent = n;
    elPrecio.textContent = precio(n * UNIT);
    elTxt.textContent = n < 6
      ? 'Una pieza, dos témperas y un pincel.'
      : n < 18
        ? 'Cada bolsita sale igual, con la tarjeta del evento.'
        : 'Veinticinco bolsitas: alcanza para un cumpleaños entero.';
    cta.classList.toggle('on', p > 0.66);
  };

  let pedido = false;
  const pedir = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; pintar(); }); };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', pintar);
  setInterval(pintar, 900);
  pintar();

  cta?.addEventListener('click', () => {
    const p = getProducto('souvenir-unidad');
    if (!p) return;
    Cart.add(p, TOPE);
    showToast('25 souvenirs en el carrito');
  });
}

/* ---------- componente funcional: calculá tu evento ---------- */
function initCalc() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const rango = document.getElementById('calcInvitados');
  const salida = document.getElementById('calcInvitadosOut');
  const pieza = document.getElementById('calcPieza');
  const segs = [...form.querySelectorAll('.seg')];
  const elSouvenirs = document.getElementById('calcSouvenirs');
  const elPiezas = document.getElementById('calcPiezas');
  const elTemperas = document.getElementById('calcTemperas');
  const elPinceles = document.getElementById('calcPinceles');
  const elTotal = document.getElementById('calcTotal');
  const elNota = document.getElementById('calcNota');
  const linkWsp = document.getElementById('calcWsp');

  const opciones = PRODUCTOS.filter(p => p.unitario);
  pieza.innerHTML = opciones.map(p => '<option value="' + p.id + '">' + esc(p.nombre) + ' — ' + precio(p.unitario) + ' c/u</option>').join('');

  const REPUESTO = { infantil: 0.15, familiar: 0.10, empresa: 0.05 };
  const LABEL = { infantil: 'un cumple infantil', familiar: 'un evento familiar', empresa: 'un evento de empresa' };
  let evento = 'infantil';
  let estado = null;

  const pintar = () => {
    const invitados = parseInt(rango.value, 10);
    const extra = REPUESTO[evento];
    const souvenirs = Math.ceil(invitados * (1 + extra));
    const p = getProducto(pieza.value) || opciones[0];
    const piezasPorSouvenir = p.id === 'kit-familia' ? 3 : 1;
    const total = souvenirs * p.unitario;

    salida.innerHTML = '<strong>' + invitados + '</strong>';
    elSouvenirs.textContent = souvenirs;
    elPiezas.textContent = souvenirs * piezasPorSouvenir;
    elTemperas.textContent = souvenirs * 2;
    elPinceles.textContent = souvenirs;
    elTotal.textContent = precio(total);
    elNota.textContent = 'Incluye ' + Math.round(extra * 100) + '% de repuesto sobre los ' + invitados + ' invitados.';

    estado = { invitados, souvenirs, total, p };
    linkWsp.setAttribute('href', wa(
      'Hola Vicenza, estoy armando ' + LABEL[evento] + ' para ' + invitados + ' invitados. ' +
      'Me da ' + souvenirs + ' souvenirs de ' + p.nombre + ', ' + precio(total) + ' estimado. ¿Lo vemos?'
    ));
  };

  rango.addEventListener('input', pintar);
  pieza.addEventListener('change', pintar);
  segs.forEach(b => b.addEventListener('click', () => {
    evento = b.dataset.evento;
    segs.forEach(x => x.classList.toggle('is-on', x === b));
    pintar();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!estado) return;
    const unidad = getProducto('souvenir-unidad');
    if (!unidad) return;
    Cart.add(unidad, estado.souvenirs);
    showToast(estado.souvenirs + ' souvenirs en el carrito');
    abrirDrawer();
  });

  pintar();
}

/* ---------- modal de producto ---------- */
function abrirModal(id) {
  const p = getProducto(id);
  const back = document.getElementById('modal');
  if (!p || !back) return;
  modalProd = p;
  modalQty = 1;
  document.getElementById('modalFoto').innerHTML = '<img src="images/' + p.foto + '" width="1100" height="688" alt="' + esc(p.alt) + '">';
  document.getElementById('modalCat').textContent = CAT_LABEL[p.cat];
  document.getElementById('modalTitulo').textContent = p.nombre;
  document.getElementById('modalPrecio').textContent = precio(p.precio);
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalIncluye').innerHTML = p.incluye.map(i => '<li>' + esc(i) + '</li>').join('');
  document.getElementById('modalQty').textContent = modalQty;

  const mismaCat = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id);
  const resto = PRODUCTOS.filter(x => x.cat !== p.cat && x.id !== p.id);
  const rel = mismaCat.concat(resto).slice(0, 3);
  const cont = document.getElementById('modalRelacionados');
  cont.innerHTML = rel.length
    ? '<p class="rel-titulo">También te puede servir</p><div class="rel-lista">' + rel.map(x =>
      '<button type="button" class="rel-card" data-rel="' + x.id + '"><span class="rel-foto"><img src="images/' + x.foto + '" width="600" height="600" alt="' + esc(x.alt) + '"></span><span>' + esc(x.nombre) + '</span></button>'
    ).join('') + '</div>'
    : '';

  ultimoFoco = document.activeElement;
  back.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('modal');
  if (!back || back.hidden) return;
  back.hidden = true;
  if (document.getElementById('drawer')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initModal() {
  const back = document.getElementById('modal');
  if (!back) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  back.addEventListener('click', e => { if (e.target === back) cerrarModal(); });
  document.getElementById('modalMas')?.addEventListener('click', () => {
    modalQty = Math.min(99, modalQty + 1);
    document.getElementById('modalQty').textContent = modalQty;
  });
  document.getElementById('modalMenos')?.addEventListener('click', () => {
    modalQty = Math.max(1, modalQty - 1);
    document.getElementById('modalQty').textContent = modalQty;
  });
  document.getElementById('modalAgregar')?.addEventListener('click', () => {
    if (!modalProd) return;
    Cart.add(modalProd, modalQty);
    showToast(modalProd.nombre + ' × ' + modalQty + ' en el carrito');
    cerrarModal();
  });
  document.getElementById('modalRelacionados')?.addEventListener('click', e => {
    const r = e.target.closest('[data-rel]');
    if (r) abrirModal(r.dataset.rel);
  });
  document.addEventListener('keydown', e => {
    if (back.hidden) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key !== 'Tab') return;
    const foco = back.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- drawer del carrito ---------- */
function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const pie = document.getElementById('drawerPie');
  if (!body || !pie) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><p>Todavía no sumaste nada.</p><a class="btn btn-linea" href="#tienda" data-cerrar>Ver el catálogo</a></div>';
    pie.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return '<div class="linea">' +
      '<span class="linea-foto"><img src="images/' + p.foto + '" width="200" height="200" alt="' + esc(p.alt) + '"></span>' +
      '<span><span class="linea-nombre">' + esc(p.nombre) + '</span>' +
      '<span class="linea-precio">' + i.qty + ' × ' + precio(p.precio) + '</span></span>' +
      '<button type="button" class="linea-quitar" data-quitar="' + p.id + '">Quitar</button>' +
      '</div>';
  }).join('');
  const total = Cart.total();
  pie.innerHTML = '<div class="drawer-total"><span>Total</span><b>' + precio(total) + '</b></div>' +
    '<button type="button" class="btn btn-cta btn-block" id="finalizar">Finalizar compra</button>' +
    '<a class="btn btn-linea btn-block" id="pedirWsp" href="' + wa('Hola Vicenza, armé un pedido de ' + Cart.count() + ' productos por ' + precio(total) + '. ¿Lo confirmamos?') + '" target="_blank" rel="noopener">Consultarlo por WhatsApp</a>';
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d || !b) return;
  renderDrawer();
  ultimoFoco = document.activeElement;
  d.hidden = false; b.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const b = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.hidden = true; b.hidden = true;
  if (document.getElementById('modal')?.hidden !== false) document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initDrawer() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.getElementById('cartBtn')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  d.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(q.dataset.quitar); return; }
    if (e.target.closest('[data-cerrar]')) { cerrarDrawer(); return; }
    if (e.target.closest('#finalizar')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderDrawer(); });
  document.addEventListener('keydown', e => {
    if (d.hidden) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key !== 'Tab') return;
    const foco = d.querySelectorAll('a[href], button:not([disabled])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
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
  sync();
}

/* ---------- reveals ---------- */
function initReveals() {
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.1, 0.6) + 's';
    });
  });
  document.querySelectorAll('[data-animate][data-delay]').forEach(el => {
    el.style.transitionDelay = parseFloat(el.dataset.delay) + 's';
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
  const reloj = setInterval(() => { sweep(); if (++intentos > 12) clearInterval(reloj); }, 500);
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
  window.addEventListener('resize', syncInert, { passive: true });
  syncInert();
}

function initAnio() {
  const el = document.getElementById('anio');
  if (el) el.textContent = new Date().getFullYear();
}

function initLd() {
  const el = document.getElementById('ldGraph');
  if (!el) return;
  try {
    const data = JSON.parse(el.textContent);
    PRODUCTOS.forEach(p => {
      data['@graph'].push({
        '@type': 'Product',
        name: p.nombre,
        image: 'https://gokywebs.com/demo/vicenza/images/' + p.foto,
        description: p.desc,
        category: CAT_LABEL[p.cat],
        offers: { '@type': 'Offer', price: p.precio, priceCurrency: 'ARS', availability: 'https://schema.org/InStock' }
      });
    });
    el.textContent = JSON.stringify(data);
  } catch { /* si el JSON cambia, el LocalBusiness estático queda igual */ }
}

initCategorias();
initMosaico();
initRail();
initTienda();
initIg();
initReveals();
initCrece();
initCalc();
initModal();
initDrawer();
initFloats();
initNav();
initAnio();
initLd();
updateCartBadge();
