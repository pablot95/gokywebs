const WSP = '5491122622723';
const IMG = 'images/';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'frutas', nombre: 'Frutas', img: 'naranjas-1200x1200.webp', alt: 'Naranjas de jugo apiladas en el cajón' },
  { id: 'verduras', nombre: 'Verduras', img: 'lechuga-1200x1200.webp', alt: 'Lechuga mantecosa fresca, hojas abiertas' },
  { id: 'almacen', nombre: 'Almacén', img: 'almacen-frascos-1200x1200.webp', alt: 'Frascos de vidrio con arroz, fideos y legumbres en la estantería' },
  { id: 'dietetica', nombre: 'Dietética', img: 'dietetica-granel-1200x1200.webp', alt: 'Bols con semillas, avena y legumbres a granel' },
  { id: 'bebidas', nombre: 'Bebidas', img: 'bebidas-botellas-1200x1200.webp', alt: 'Botellas de agua mineral frías' },
  { id: 'lena', nombre: 'Carbón y leña', img: 'lena-1200x1200.webp', alt: 'Leña cortada y apilada lista para el asado' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Manzana roja', cat: 'frutas', precio: 3500, unidad: 'por kg', descuento: 0, img: 'manzanas-1200x1200.webp', alt: 'Manzanas rojas apiladas en el cajón', badge: 'Lo más pedido', desc: 'Manzana roja de estación, firme y dulce. Se elige de a una: la que está golpeada no entra en la bolsa.', etiquetas: ['fruta', 'postre', 'vianda'], destacado: true },
  { id: 2, nombre: 'Naranja de jugo', cat: 'frutas', precio: 2400, unidad: 'por kg', descuento: 0, img: 'naranjas-1200x1200.webp', alt: 'Naranjas de jugo enteras', badge: '', desc: 'Naranja fina de jugo, bien pesada. Con tres kilos sale más de un litro y medio.', etiquetas: ['fruta', 'jugo', 'cítrico'], destacado: true },
  { id: 3, nombre: 'Mandarina', cat: 'frutas', precio: 2900, unidad: 'por kg', descuento: 0, img: 'naranjas-mandarina-900.webp', alt: 'Cítricos frescos apilados en el mostrador', badge: '', desc: 'Mandarina de cáscara floja, fácil de pelar. La que más sale para la vianda de los chicos.', etiquetas: ['fruta', 'cítrico', 'vianda'], destacado: false },
  { id: 4, nombre: 'Bolsón de frutas 5 kg', cat: 'frutas', precio: 14500, unidad: 'el bolsón', descuento: 0, img: 'bolson-frutas-900.webp', alt: 'Frutas y verduras de estación mezcladas en el puesto', badge: '', desc: 'Lo que está mejor esa semana, elegido por nosotros. Si hay algo que no comen en tu casa, avisanos y lo cambiamos.', etiquetas: ['bolsón', 'fruta', 'semana'], destacado: false },

  { id: 5, nombre: 'Tomate perita', cat: 'verduras', precio: 3200, unidad: 'por kg', descuento: 0, img: 'tomates-1200x1200.webp', alt: 'Tomates perita rojos en el cajón', badge: 'Lo más pedido', desc: 'Tomate perita para salsa: más carne y menos agua que el redondo. Llega a la mañana.', etiquetas: ['verdura', 'salsa', 'tomate'], destacado: true },
  { id: 6, nombre: 'Lechuga mantecosa', cat: 'verduras', precio: 1800, unidad: 'la planta', descuento: 0, img: 'lechuga-1200x1200.webp', alt: 'Lechuga mantecosa con las hojas abiertas', badge: '', desc: 'Hoja tierna y sin amargor. Se corta el mismo día que la vendemos.', etiquetas: ['verdura', 'hoja', 'ensalada'], destacado: true },
  { id: 7, nombre: 'Tomate redondo', cat: 'verduras', precio: 2800, unidad: 'por kg', descuento: 0, img: 'tomates-cherry-900.webp', alt: 'Tomates redondos maduros y brillantes', badge: '', desc: 'El de todos los días, para ensalada y para el sánguche. Lo pedís maduro o verde, como lo uses.', etiquetas: ['verdura', 'ensalada', 'tomate'], destacado: false },
  { id: 8, nombre: 'Lechuga criolla', cat: 'verduras', precio: 1600, unidad: 'la planta', descuento: 0, img: 'lechuga-acelga-900.webp', alt: 'Hojas verdes de lechuga criolla recién lavadas', badge: '', desc: 'Hoja más firme que la mantecosa, aguanta mejor en la heladera toda la semana.', etiquetas: ['verdura', 'hoja', 'ensalada'], destacado: false },

  { id: 9, nombre: 'Arroz largo fino 1 kg', cat: 'almacen', precio: 2900, unidad: 'el paquete', descuento: 0, img: 'almacen-arroz-900.webp', alt: 'Frasco de vidrio con arroz largo fino', badge: '', desc: 'Arroz doble carolina, grano suelto. El que más se lleva para el día a día.', etiquetas: ['almacén', 'seco', 'arroz'], destacado: false },
  { id: 10, nombre: 'Harina 000 1 kg', cat: 'almacen', precio: 2200, unidad: 'el paquete', descuento: 0, img: 'almacen-harina-900.webp', alt: 'Frascos de vidrio en la estantería del almacén', badge: '', desc: 'Harina de trigo 000 para pan, pizza y masa de tarta.', etiquetas: ['almacén', 'seco', 'harina'], destacado: false },
  { id: 11, nombre: 'Fideos guiseros 500 g', cat: 'almacen', precio: 1900, unidad: 'el paquete', descuento: 0, img: 'almacen-fideos-900.webp', alt: 'Envases con pastas secas y legumbres fraccionadas', badge: '', desc: 'Fideo corto para guiso y sopa. Aguanta la cocción sin deshacerse.', etiquetas: ['almacén', 'seco', 'fideos'], destacado: false },
  { id: 12, nombre: 'Azúcar 1 kg', cat: 'almacen', precio: 2600, unidad: 'el paquete', descuento: 0, img: 'almacen-azucar-900.webp', alt: 'Envases con azúcar y granos claros en la alacena', badge: '', desc: 'Azúcar común tipo A, la de siempre.', etiquetas: ['almacén', 'seco', 'azúcar'], destacado: false },
  { id: 13, nombre: 'Huevos blancos x12', cat: 'almacen', precio: 4500, unidad: 'la docena', descuento: 0, img: 'huevos-1200x1200.webp', alt: 'Docena de huevos blancos y colorados', badge: 'Lo más pedido', desc: 'Docena de huevos frescos, tamaño mediano. Los recibimos dos veces por semana.', etiquetas: ['huevos', 'almacén', 'docena'], destacado: true },
  { id: 14, nombre: 'Huevos colorados x12', cat: 'almacen', precio: 4900, unidad: 'la docena', descuento: 0, img: 'huevos-colorados-900.webp', alt: 'Huevos colorados vistos de cerca', badge: '', desc: 'Huevo colorado grande, de yema más firme. Se termina rápido, conviene encargarlo con el pedido.', etiquetas: ['huevos', 'almacén', 'docena'], destacado: false },

  { id: 15, nombre: 'Lentejas 500 g', cat: 'dietetica', precio: 3800, unidad: 'el paquete', descuento: 0, img: 'dietetica-lentejas-900.webp', alt: 'Bol con lentejas secas', badge: '', desc: 'Lenteja chica, se cocina sin remojo previo. Fraccionada en el local.', etiquetas: ['dietética', 'legumbre', 'granel'], destacado: true },
  { id: 16, nombre: 'Avena arrollada 500 g', cat: 'dietetica', precio: 2400, unidad: 'el paquete', descuento: 0, img: 'dietetica-avena-900.webp', alt: 'Bol con avena arrollada fina', badge: '', desc: 'Avena fina, para el desayuno o para ligar hamburguesas caseras.', etiquetas: ['dietética', 'desayuno', 'granel'], destacado: false },
  { id: 17, nombre: 'Mix de semillas 250 g', cat: 'dietetica', precio: 4200, unidad: 'el paquete', descuento: 10, img: 'dietetica-semillas-900.webp', alt: 'Bol con semillas de girasol peladas', badge: '', desc: 'Girasol, lino y sésamo. Para el pan casero o para tirarle a la ensalada.', etiquetas: ['dietética', 'semillas', 'granel'], destacado: false },
  { id: 18, nombre: 'Polenta 500 g', cat: 'dietetica', precio: 2100, unidad: 'el paquete', descuento: 0, img: 'dietetica-polenta-900.webp', alt: 'Bol con polenta de grano fino', badge: '', desc: 'Polenta de cocción rápida. Con un poco de queso rinde para toda la mesa.', etiquetas: ['dietética', 'polenta', 'granel'], destacado: false },

  { id: 19, nombre: 'Agua mineral 2 L', cat: 'bebidas', precio: 1900, unidad: 'la botella', descuento: 0, img: 'bebidas-botellas-1200x1200.webp', alt: 'Botellas de agua mineral frías', badge: '', desc: 'Agua mineral sin gas. Si llevás seis, entran en la misma caja del pedido.', etiquetas: ['bebida', 'agua'], destacado: true },
  { id: 20, nombre: 'Soda 1,5 L', cat: 'bebidas', precio: 1600, unidad: 'la botella', descuento: 0, img: 'bebidas-saborizada-900.webp', alt: 'Botella de soda fría sobre el mostrador', badge: '', desc: 'Soda bien fría para la mesa. También la tenemos en sifón, preguntanos por WhatsApp.', etiquetas: ['bebida', 'soda'], destacado: false },

  { id: 21, nombre: 'Leña de quebracho 15 kg', cat: 'lena', precio: 12500, unidad: 'la bolsa', descuento: 0, img: 'lena-1200x1200.webp', alt: 'Leña de quebracho cortada y apilada', badge: 'Lo más pedido', desc: 'Quebracho blanco seco, cortado a medida de parrilla. Prende parejo y dura.', etiquetas: ['leña', 'asado', 'quebracho'], destacado: true },
  { id: 22, nombre: 'Carbón vegetal 5 kg', cat: 'lena', precio: 8900, unidad: 'la bolsa', descuento: 12, img: 'lena-carbon-900.webp', alt: 'Leña dura apilada en el depósito del local', badge: '', desc: 'Carbón de leña dura, poco polvo. Para el asado del domingo sin vueltas.', etiquetas: ['carbón', 'asado'], destacado: false },
];

/* Ocho items con ocho fotos distintas: dos vecinos con la misma imagen se leen como un bug. */
const BOLSON = [1, 2, 5, 6, 13, 15, 9, 19];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const COLOR_BOLSON = {
  1: '#C0392B', 2: '#E8890C', 5: '#CE3B22', 6: '#7CB342',
  9: '#C9B892', 13: '#F0E2C4', 15: '#8C6D46', 19: '#4E9FD1',
};

const Cart = {
  KEY: 'fadafruver_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 40);
    else items.push({ id: producto.id, qty: Math.min(qty, 40) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 40)); this.save(items);
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
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function cardProducto(p, ctx) {
  const final = precioFinal(p);
  const cat = getCategoria(p.cat);
  const badges = [];
  if (p.descuento > 0) badges.push('<span class="pill pill-oro">-' + p.descuento + '%</span>');
  if (p.badge) badges.push('<span class="pill">' + esc(p.badge) + '</span>');
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s>'
    : '<strong>' + formatearPrecio(final) + '</strong>';
  return '' +
    '<article class="prod" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(34px)">' +
      (badges.length ? '<div class="prod-badges">' + badges.join('') + '</div>' : '') +
      '<div class="prod-media" role="button" tabindex="0" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
        '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
        '<span class="prod-ver">Ver más</span>' +
      '</div>' +
      '<div class="prod-body">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
        '<p class="prod-precio">' + precio + '<span class="prod-unidad">' + esc(p.unidad) + '</span></p>' +
        '<div class="prod-actions">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" data-id="' + p.id + '" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-cta btn-sm prod-add" data-add="' + p.id + '" data-ctx="' + ctx + '">Agregar</button>' +
        '</div>' +
      '</div>' +
    '</article>';
}

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const pendientes = cont.querySelectorAll('[data-animate]:not(.in)');
  if (!pendientes.length) return;
  pendientes.forEach((el, i) => { el.style.transitionDelay = Math.min(i * 0.07, 0.5) + 's'; });
  void cont.offsetWidth;
  pendientes.forEach(el => el.classList.add('in'));
}

function initCategorias() {
  const cont = document.getElementById('catGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const desde = Math.min(...PRODUCTOS.filter(p => p.cat === c.id).map(precioFinal));
    return '<a class="cat-card" href="#tienda" data-cat-link="' + c.id + '" data-animate style="opacity:0;transform:translateY(28px)">' +
      '<div class="cat-media"><img src="' + IMG + c.img + '" width="1200" height="1200" alt="' + esc(c.alt) + '" decoding="async"></div>' +
      '<div class="cat-info"><h3>' + esc(c.nombre) + '</h3><p class="cat-desde">Desde ' + formatearPrecio(desde) + '</p></div>' +
    '</a>';
  }).join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardProducto(p, 'rail')).join('');

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => vp.clientWidth * 0.7;
  const syncArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  syncArrows();

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== undefined && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      setTimeout(() => vp.classList.remove('dragging'), 0);
    }
    pointerId = null;
    syncArrows();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    const enBorde = (e.deltaY < 0 && vp.scrollLeft <= 0) || (e.deltaY > 0 && vp.scrollLeft >= max - 1);
    if (enBorde) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });
}

/* ---------- armá tu bolsón ---------- */

const Bolson = { elegidos: {} };

function bolsonTotal() {
  return Object.entries(Bolson.elegidos).reduce((s, [id, q]) => {
    const p = getProducto(Number(id));
    return p ? s + precioFinal(p) * q : s;
  }, 0);
}
function bolsonCantidad() {
  return Object.values(Bolson.elegidos).reduce((s, q) => s + q, 0);
}

function renderBolsonItems() {
  const cont = document.getElementById('bolsonItems');
  if (!cont) return;
  cont.innerHTML = BOLSON.map(id => {
    const p = getProducto(id);
    if (!p) return '';
    const q = Bolson.elegidos[id] || 0;
    return '<div class="bit-wrap">' +
      '<button type="button" class="bit' + (q ? ' is-on' : '') + '" data-bolson="' + p.id + '" aria-pressed="' + (q > 0) + '">' +
        '<img class="bit-img" src="' + IMG + p.img + '" width="1200" height="1200" alt="" decoding="async">' +
        '<span class="bit-nom">' + esc(p.nombre) + '</span>' +
        '<span class="bit-precio">' + formatearPrecio(precioFinal(p)) + ' · ' + esc(p.unidad) + '</span>' +
      '</button>' +
      (q ? '<span class="bit-cant">' + q + '</span>' : '') +
    '</div>';
  }).join('');
}

/* Repinta un solo item: rehacer el innerHTML entero robaría el foco en cada clic. */
function pintarItem(id) {
  const btn = document.querySelector('[data-bolson="' + id + '"]');
  if (!btn) return;
  const q = Bolson.elegidos[id] || 0;
  btn.classList.toggle('is-on', q > 0);
  btn.setAttribute('aria-pressed', String(q > 0));
  const wrap = btn.parentElement;
  let chip = wrap.querySelector('.bit-cant');
  if (q > 0) {
    if (!chip) {
      chip = document.createElement('span');
      chip.className = 'bit-cant';
      wrap.appendChild(chip);
    }
    chip.textContent = q;
  } else if (chip) {
    chip.remove();
  }
}

function renderCajon() {
  const slots = document.getElementById('cajonSlots');
  const vacio = document.getElementById('cajonVacio');
  const total = document.getElementById('cajonTotal');
  const agregar = document.getElementById('bolsonAgregar');
  const reset = document.getElementById('bolsonReset');
  if (!slots) return;
  const bolitas = [];
  Object.entries(Bolson.elegidos).forEach(([id, q]) => {
    for (let i = 0; i < q; i++) bolitas.push(COLOR_BOLSON[id] || '#9AA39C');
  });
  /* Solo se agrega o se saca la diferencia: si no, cada bolita vuelve a caer. */
  const puestas = [...slots.children];
  const mismoArranque = bolitas.slice(0, puestas.length)
    .every((c, i) => puestas[i].dataset.color === c);
  if (!mismoArranque) slots.textContent = '';
  else while (slots.children.length > bolitas.length) slots.lastElementChild.remove();
  for (let i = slots.children.length; i < bolitas.length; i++) {
    const s = document.createElement('span');
    s.dataset.color = bolitas[i];
    s.style.background = bolitas[i];
    slots.appendChild(s);
  }
  const hay = bolitas.length > 0;
  vacio.hidden = hay;
  total.hidden = !hay;
  agregar.hidden = !hay;
  reset.hidden = !hay;
  document.getElementById('cajonCant').textContent = String(bolsonCantidad());
  document.getElementById('cajonMonto').textContent = formatearPrecio(bolsonTotal());
}

function initBolson() {
  const cont = document.getElementById('bolsonItems');
  if (!cont) return;
  renderBolsonItems();
  renderCajon();
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-bolson]');
    if (!b) return;
    const id = Number(b.dataset.bolson);
    const actual = Bolson.elegidos[id] || 0;
    Bolson.elegidos[id] = actual >= 5 ? 0 : actual + 1;
    if (Bolson.elegidos[id] === 0) delete Bolson.elegidos[id];
    pintarItem(id);
    renderCajon();
  });
  document.getElementById('bolsonReset')?.addEventListener('click', () => {
    Bolson.elegidos = {};
    BOLSON.forEach(pintarItem);
    renderCajon();
  });
  document.getElementById('bolsonAgregar')?.addEventListener('click', () => {
    const entradas = Object.entries(Bolson.elegidos);
    if (!entradas.length) return;
    entradas.forEach(([id, q]) => {
      const p = getProducto(Number(id));
      if (p) Cart.add(p, q);
    });
    Bolson.elegidos = {};
    BOLSON.forEach(pintarItem);
    renderCajon();
    showToast('Tu cajón pasó al carrito');
    abrirDrawer();
  });
}

/* ---------- catálogo ---------- */

const Catalogo = {
  cont: null, q: '', cat: 'todos', mostrados: 16,
  init() {
    this.cont = document.getElementById('catalogo');
    if (!this.cont) return;
    const chips = document.getElementById('chips');
    chips.innerHTML = [{ id: 'todos', nombre: 'Todo' }].concat(CATEGORIAS)
      .map(c => '<button type="button" class="chip" data-chip="' + c.id + '" aria-pressed="' + (c.id === 'todos') + '">' + esc(c.nombre) + '</button>').join('');
    chips.addEventListener('click', e => {
      const b = e.target.closest('[data-chip]');
      if (!b) return;
      this.cat = b.dataset.chip;
      this.mostrados = 16;
      this.render();
    });
    const input = document.getElementById('q');
    const arriba = document.getElementById('qTop');
    let t;
    const buscar = valor => {
      clearTimeout(t);
      t = setTimeout(() => { this.q = valor.trim(); this.mostrados = 16; this.render(); }, 180);
    };
    input.addEventListener('input', () => { if (arriba) arriba.value = input.value; buscar(input.value); });
    arriba?.addEventListener('input', () => { input.value = arriba.value; buscar(arriba.value); });
    document.getElementById('barraBuscar')?.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    document.getElementById('limpiar').addEventListener('click', () => this.reset());
    document.getElementById('vacioReset').addEventListener('click', () => this.reset());
    document.getElementById('verMas').addEventListener('click', () => { this.mostrados += 16; this.render(true); });
    this.render();
  },
  reset() {
    this.q = ''; this.cat = 'todos'; this.mostrados = 16;
    const input = document.getElementById('q');
    const arriba = document.getElementById('qTop');
    if (input) input.value = '';
    if (arriba) arriba.value = '';
    this.render();
  },
  filtrados() {
    const q = normalizar(this.q);
    return PRODUCTOS.filter(p => {
      if (this.cat !== 'todos' && p.cat !== this.cat) return false;
      if (!q) return true;
      const heno = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, p.unidad, (p.etiquetas || []).join(' ')].join(' '));
      return q.split(/\s+/).every(w => heno.includes(w));
    });
  },
  render(soloAgregar) {
    const lista = this.filtrados();
    const visibles = lista.slice(0, this.mostrados);
    const vacio = document.getElementById('vacio');
    const verMas = document.getElementById('verMas');
    const res = document.getElementById('resultados');
    const limpiar = document.getElementById('limpiar');

    if (soloAgregar) {
      const yaHay = this.cont.querySelectorAll('.prod').length;
      this.cont.insertAdjacentHTML('beforeend', visibles.slice(yaHay).map(p => cardProducto(p, 'catalogo')).join(''));
    } else {
      this.cont.innerHTML = visibles.map(p => cardProducto(p, 'catalogo')).join('');
    }

    document.querySelectorAll('[data-chip]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.chip === this.cat)));

    const hayFiltro = this.q !== '' || this.cat !== 'todos';
    limpiar.hidden = !hayFiltro;
    res.textContent = lista.length === 0
      ? 'Sin resultados'
      : lista.length + (lista.length === 1 ? ' producto' : ' productos') + (hayFiltro ? ' con estos filtros' : ' en la tienda');
    vacio.hidden = lista.length !== 0;
    this.cont.hidden = lista.length === 0;
    verMas.hidden = visibles.length >= lista.length;
    document.querySelector('.vermas-wrap').hidden = verMas.hidden;

    revelarNuevos(this.cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  },
};

/* El mismo producto puede estar en la tarjeta y en el modal a la vez:
   el contador se busca dentro del bloque del botón, nunca en todo el documento. */
function salidaQty(desde) {
  return desde.closest('.prod, .modal-info')?.querySelector('output[data-qty]') || null;
}

function pedirQty(desde) {
  const out = salidaQty(desde);
  return out ? Math.max(1, Math.min(40, parseInt(out.textContent, 10) || 1)) : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.parentElement?.querySelector('output[data-qty]');
      if (out) {
        const v = Math.max(1, Math.min(40, (parseInt(out.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
        out.textContent = v;
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(parseInt(add.dataset.add, 10));
      if (!p) return;
      Cart.add(p, pedirQty(add));
      const out = salidaQty(add);
      if (out) out.textContent = '1';
      showToast('Sumado al pedido: ' + p.nombre);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(parseInt(comprar.dataset.comprar, 10));
      if (!p) return;
      Cart.add(p, pedirQty(comprar));
      cerrarModal();
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(parseInt(ver.dataset.ver, 10)); return; }

    const catLink = e.target.closest('[data-cat-link]');
    if (catLink) {
      e.preventDefault();
      const chip = document.querySelector('[data-chip="' + catLink.dataset.catLink + '"]');
      if (chip) chip.click();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const ver = e.target.closest?.('[data-ver]');
    if (ver && e.target.classList.contains('prod-media')) {
      e.preventDefault();
      abrirModal(parseInt(ver.dataset.ver, 10));
    }
  });
}

/* ---------- drawer ---------- */

let ultimoFocoDrawer = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="cart-vacio">' +
      '<p class="cart-vacio-t">Todavía no cargaste nada</p>' +
      '<p>Armá el pedido desde la tienda o probá el bolsón de la semana.</p>' +
      '<a class="btn btn-cta" href="#tienda" data-cerrar-drawer>Ver la tienda</a>' +
      '</div>';
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return '<div class="cart-line">' +
      '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
      '<div>' +
        '<p class="cart-nom">' + esc(p.nombre) + '</p>' +
        '<p class="cart-unidad">' + esc(p.unidad) + '</p>' +
        '<p class="cart-precio">' + formatearPrecio(precioFinal(p)) + '</p>' +
        '<div class="stepper">' +
          '<button type="button" data-cart-step="-1" data-id="' + p.id + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
          '<output>' + i.qty + '</output>' +
          '<button type="button" data-cart-step="1" data-id="' + p.id + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-col-der">' +
        '<span class="cart-precio">' + formatearPrecio(precioFinal(p) * i.qty) + '</span>' +
        '<button type="button" class="cart-quitar" data-cart-remove="' + p.id + '">Quitar</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const detalle = items.map(i => {
    const p = getProducto(i.id);
    return p ? p.nombre + ' x' + i.qty : '';
  }).filter(Boolean).join(', ');

  foot.innerHTML = '<p class="cart-total"><span>Total</span><strong>' + formatearPrecio(Cart.total()) + '</strong></p>' +
    '<button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>' +
    '<a class="btn btn-line" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola FaDa FruVer, quiero pedir: ' + detalle + '.') + '" target="_blank" rel="noopener">Confirmar por WhatsApp</a>' +
    '<p class="cart-nota">Coordinamos envío o retiro cuando confirmás el pedido.</p>';
}

function abrirDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  ultimoFocoDrawer = document.activeElement;
  bd.hidden = false; d.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); d.classList.add('open'); });
  document.body.classList.add('drawer-open', 'no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd || d.hidden) return;
  d.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('drawer-open', 'no-scroll');
  setTimeout(() => { d.hidden = true; bd.hidden = true; }, 380);
  ultimoFocoDrawer?.focus();
}

function initDrawer() {
  document.getElementById('cart-header')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('cart:updated', renderDrawer);
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-cart-step]');
    if (s) {
      const id = parseInt(s.dataset.id, 10);
      const paso = parseInt(s.dataset.cartStep, 10);
      const it = Cart.get().find(i => i.id === id);
      if (!it) return;
      if (it.qty + paso < 1) Cart.remove(id);
      else Cart.setQty(id, it.qty + paso);
      return;
    }
    const r = e.target.closest('[data-cart-remove]');
    if (r) { Cart.remove(parseInt(r.dataset.cartRemove, 10)); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (e.target.closest('#finalizar')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  renderDrawer();
}

/* ---------- modal ---------- */

let ultimoFocoModal = null;

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const panel = document.getElementById('modalPanel');
  if (!p || !modal || !bd || !panel) return;
  ultimoFocoModal = document.activeElement;
  const final = precioFinal(p);
  const cat = getCategoria(p.cat);
  const sug = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s><span class="pill pill-oro">-' + p.descuento + '%</span>'
    : '<strong>' + formatearPrecio(final) + '</strong>';

  panel.innerHTML = '' +
    '<button type="button" class="icon-btn modal-cerrar" id="modalCerrar" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg></button>' +
    '<div class="modal-grid">' +
      '<div class="modal-media"><img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
      '<div class="modal-info">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h2 id="modalTitulo">' + esc(p.nombre) + '</h2>' +
        '<p class="modal-precio">' + precio + '<span class="prod-unidad">' + esc(p.unidad) + '</span></p>' +
        '<p class="modal-desc">' + esc(p.desc) + '</p>' +
        '<div class="modal-meta">' + (p.etiquetas || []).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>' +
        '<div class="modal-actions">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" data-id="' + p.id + '" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-cta" data-add="' + p.id + '">Agregar al pedido</button>' +
          '<button type="button" class="btn btn-line" data-comprar="' + p.id + '">Comprar ahora</button>' +
        '</div>' +
        (sug.length ? '<div class="modal-sug"><h3>De la misma góndola</h3><div class="sug-grid">' +
          sug.map(s => '<button type="button" class="sug-card" data-ver="' + s.id + '">' +
            '<img src="' + IMG + s.img + '" width="1200" height="1200" alt="' + esc(s.alt) + '" decoding="async">' +
            '<span class="sug-nom">' + esc(s.nombre) + '</span>' +
            '<span class="sug-precio">' + formatearPrecio(precioFinal(s)) + '</span>' +
          '</button>').join('') + '</div></div>' : '') +
      '</div>' +
    '</div>';

  modal.setAttribute('aria-labelledby', 'modalTitulo');
  bd.hidden = false; modal.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); modal.classList.add('open'); });
  document.body.classList.add('drawer-open', 'no-scroll');
  document.getElementById('modalCerrar')?.addEventListener('click', cerrarModal);
  document.getElementById('modalCerrar')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || !bd || modal.hidden) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  modal.removeAttribute('aria-labelledby');
  if (!document.getElementById('drawer')?.classList.contains('open')) {
    document.body.classList.remove('drawer-open', 'no-scroll');
  }
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 340);
  ultimoFocoModal?.focus();
}

function initModal() {
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('modal')?.hidden) { cerrarModal(); return; }
      if (!document.getElementById('drawer')?.hidden) cerrarDrawer();
    }
    if (e.key !== 'Tab') return;
    const abierto = !document.getElementById('modal')?.hidden
      ? document.getElementById('modal')
      : (!document.getElementById('drawer')?.hidden ? document.getElementById('drawer') : null);
    if (!abierto) return;
    const focusables = abierto.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ---------- badges, flotantes, nav ---------- */

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
  cart?.addEventListener('click', abrirDrawer);
  sync();
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.barra');
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

/* ---------- texto que se lee con el scroll ---------- */

function initLeeScroll() {
  const els = document.querySelectorAll('[data-lee]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    if (palabras.length < 2) return;
    el.textContent = '';
    palabras.forEach((palabra, i) => {
      const s = document.createElement('span');
      s.className = 'lee-w';
      s.textContent = palabra;
      el.appendChild(s);
      if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    document.querySelectorAll('.lee-w').forEach(w => w.classList.add('on'));
    return;
  }
  els.forEach(el => {
    const ws = el.querySelectorAll('.lee-w');
    if (!ws.length) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: .4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ---------- reveals ---------- */

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.09, 0.63) + 's';
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

/* ---------- hero ---------- */

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'power2.out' });
  if (typeof ScrollTrigger === 'undefined' || !foto) return;
  gsap.to(foto, {
    yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const grafo = [{
    '@type': 'GroceryStore',
    '@id': base + '#negocio',
    name: 'FaDa FruVer',
    description: 'Verdulería y almacén: frutas, verduras, dietética, huevos, bebidas, carbón y leña. Envío a domicilio y retiro por el local.',
    telephone: '+54 9 11 2262-2723',
    image: base + 'images/hero-puesto-1800x1200.webp',
    priceRange: '$',
    address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
    areaServed: 'Argentina',
  }].concat(PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: base + 'images/' + p.img,
    category: getCategoria(p.cat)?.nombre,
    brand: { '@type': 'Brand', name: 'FaDa FruVer' },
    offers: {
      '@type': 'Offer',
      price: precioFinal(p),
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      seller: { '@id': base + '#negocio' },
    },
  })));
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
  document.head.appendChild(s);
}

/* ---------- arranque ---------- */

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}

document.getElementById('anio').textContent = new Date().getFullYear();

initCategorias();
initRail();
Catalogo.init();
initBolson();
initReveals();
initNav();
initAcciones();
initDrawer();
initModal();
initFloats();
initLeeScroll();
initHero();
initJsonLd();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
