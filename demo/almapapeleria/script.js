const WSP = '5493876417305';
const IMG = 'images/';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'toppers', nombre: 'Toppers para tortas', img: 'topper-nombre-1200x1200.webp', alt: 'Topper de cartón con un nombre sobre una torta' },
  { id: 'banderines', nombre: 'Banderines', img: 'banderines-1200x1200.webp', alt: 'Banderines triangulares de colores colgados de un hilo' },
  { id: 'stickers', nombre: 'Stickers', img: 'stickers-plancha-1200x1200.webp', alt: 'Planchas de stickers troquelados de colores' },
  { id: 'libritos', nombre: 'Libritos para colorear', img: 'librito-colorear-1200x1200.webp', alt: 'Chicos coloreando un librito con marcadores' },
  { id: 'calendarios', nombre: 'Calendarios', img: 'calendario-1200x1200.webp', alt: 'Calendario de pared con la grilla del mes' },
  { id: 'cajitas', nombre: 'Cajitas y bolsitas', img: 'cajitas-1200x1200.webp', alt: 'Cajitas de regalo con moños y cintas' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Topper con nombre', cat: 'toppers', precio: 8500, unidad: 'la unidad', descuento: 0, img: 'topper-nombre-1200x1200.webp', alt: 'Topper temático de cartón con un nombre, clavado en una torta', badge: 'El más pedido', desc: 'El clásico: el nombre recortado en cartulina de 300 gramos, con el diseño y los colores que elijas. Va montado en dos varillas de madera listas para clavar.', etiquetas: ['topper', 'torta', 'personalizado'], destacado: true },
  { id: 2, nombre: 'Topper temático completo', cat: 'toppers', precio: 11900, unidad: 'la unidad', descuento: 0, img: 'topper-tematico-1200x1200.webp', alt: 'Torta decorada con topper temático de animales de la selva', badge: '', desc: 'Nombre, edad y los personajes del tema en varias capas de papel. Se arma pieza por pieza y viene con relieve, no es una impresión plana.', etiquetas: ['topper', 'temático', 'cumpleaños'], destacado: true },
  { id: 3, nombre: 'Topper de letras doradas', cat: 'toppers', precio: 9800, unidad: 'la unidad', descuento: 0, img: 'topper-letras-900.webp', alt: 'Letras doradas de un nombre apoyadas sobre una torta', badge: '', desc: 'Solo el nombre, en cartulina metalizada dorada o plateada. Queda fino, sin dibujos, para tortas más sobrias.', etiquetas: ['topper', 'dorado', 'nombre'], destacado: false },

  { id: 4, nombre: 'Banderín con nombre', cat: 'banderines', precio: 12500, unidad: 'la guirnalda', descuento: 0, img: 'banderines-1200x1200.webp', alt: 'Banderines triangulares de colores colgados de un hilo', badge: 'El más pedido', desc: 'Una bandera por letra, en los colores que elijas, ya ensartadas en el hilo. Llega lista para colgar: no hay que armar nada.', etiquetas: ['banderín', 'guirnalda', 'nombre'], destacado: true },
  { id: 5, nombre: 'Banderín temático de letras', cat: 'banderines', precio: 14900, unidad: 'la guirnalda', descuento: 10, img: 'banderin-letras-900.webp', alt: 'Banderines con letras impresas colgados sobre una mesa de cumpleaños', badge: '', desc: 'La frase que quieras —"Feliz Cumple", el nombre, la edad— con el fondo y los dibujos del tema de la fiesta.', etiquetas: ['banderín', 'temático', 'frase'], destacado: true },
  { id: 6, nombre: 'Guirnalda pastel de 3 metros', cat: 'banderines', precio: 16500, unidad: 'la guirnalda', descuento: 0, img: 'banderin-pastel-900.webp', alt: 'Guirnalda de banderines en tonos pastel colgada en un patio', badge: '', desc: 'Tres metros de banderines lisos en tonos pastel, sin texto. La que se usa para el fondo de la mesa o el arco de globos.', etiquetas: ['banderín', 'pastel', 'decoración'], destacado: false },
  { id: 7, nombre: 'Pompones de papel x3', cat: 'banderines', precio: 9900, unidad: 'el juego de 3', descuento: 0, img: 'pompones-900.webp', alt: 'Pompones de papel rosa y blanco colgando de un techo', badge: '', desc: 'Tres pompones de papel de seda, armados a mano, en los colores de tu fiesta. Van colgados del techo o del arco.', etiquetas: ['pompones', 'decoración', 'papel'], destacado: false },

  { id: 8, nombre: 'Plancha de stickers personalizada', cat: 'stickers', precio: 4900, unidad: 'la plancha A5', descuento: 0, img: 'stickers-plancha-1200x1200.webp', alt: 'Varias planchas de stickers troquelados de colores', badge: 'El más pedido', desc: 'Una plancha A5 con los stickers que necesites: el nombre, la edad, una foto o el logo. Papel adhesivo mate, troquelado uno por uno.', etiquetas: ['stickers', 'plancha', 'personalizado'], destacado: true },
  { id: 9, nombre: 'Stickers de cumpleaños', cat: 'stickers', precio: 3800, unidad: 'la plancha A5', descuento: 0, img: 'stickers-cumple-900.webp', alt: 'Plancha de stickers de globos, regalos y guirnaldas de cumpleaños', badge: '', desc: 'Globos, gorritos, tortas y guirnaldas para decorar sobres, bolsitas y tarjetas de invitación.', etiquetas: ['stickers', 'cumpleaños', 'globos'], destacado: false },
  { id: 10, nombre: 'Stickers de flores', cat: 'stickers', precio: 3500, unidad: 'la plancha A5', descuento: 0, img: 'stickers-flores-900.webp', alt: 'Plancha de stickers de flores de colores', badge: '', desc: 'Flores troqueladas en varios tamaños. Sirven para agenda, para el frasco de los souvenirs o para el libro de firmas.', etiquetas: ['stickers', 'flores', 'agenda'], destacado: false },
  { id: 11, nombre: 'Stickers para agenda', cat: 'stickers', precio: 4200, unidad: 'la plancha A5', descuento: 0, img: 'stickers-agenda-900.webp', alt: 'Plancha de stickers de viaje: cámara, brújula y carteles', badge: '', desc: 'Íconos chicos para marcar días, tareas y viajes en la agenda. La plancha trae más de cuarenta piezas.', etiquetas: ['stickers', 'agenda', 'planner'], destacado: false },

  { id: 12, nombre: 'Librito para colorear personalizado', cat: 'libritos', precio: 6500, unidad: 'la unidad', descuento: 0, img: 'librito-colorear-1200x1200.webp', alt: 'Dos chicos coloreando un librito sobre la mesa', badge: '', desc: 'Doce páginas con el nombre del cumpleañero en la tapa y dibujos del tema de la fiesta. El souvenir que los chicos usan el mismo día.', etiquetas: ['librito', 'colorear', 'souvenir'], destacado: true },
  { id: 13, nombre: 'Librito de mandalas', cat: 'libritos', precio: 5200, unidad: 'la unidad', descuento: 0, img: 'librito-mandala-900.webp', alt: 'Mano coloreando una mandala en un librito', badge: '', desc: 'Dieciséis mandalas en papel de 120 gramos, para que aguante marcador sin traspasar.', etiquetas: ['librito', 'mandalas', 'colorear'], destacado: false },
  { id: 14, nombre: 'Libro de firmas', cat: 'libritos', precio: 18900, unidad: 'la unidad', descuento: 0, img: 'libro-firmas-900.webp', alt: 'Cuaderno de tapa dura con papel de textura', badge: '', desc: 'Tapa dura, papel liso y la portada impresa con el nombre y la fecha. Para el cumple de quince, el casamiento o el bautismo.', etiquetas: ['libro', 'firmas', 'evento'], destacado: false },

  { id: 15, nombre: 'Calendario de pared personalizado', cat: 'calendarios', precio: 9800, unidad: 'la unidad', descuento: 0, img: 'calendario-1200x1200.webp', alt: 'Calendario de pared con la grilla del mes impresa', badge: '', desc: 'Doce hojas con tus fotos y las fechas que importan ya marcadas. Anillado arriba, con perchero de madera.', etiquetas: ['calendario', 'pared', 'fotos'], destacado: true },
  { id: 16, nombre: 'Planificador mensual', cat: 'calendarios', precio: 7400, unidad: 'el block', descuento: 0, img: 'planificador-900.webp', alt: 'Block de hojas rayadas con una lapicera al lado', badge: '', desc: 'Block de cincuenta hojas para colgar en la heladera: el mes entero, la lista de compras y el espacio de notas.', etiquetas: ['planificador', 'mensual', 'block'], destacado: false },
  { id: 17, nombre: 'Set de escritorio', cat: 'calendarios', precio: 6900, unidad: 'el set', descuento: 15, img: 'papeleria-flatlay-1200x1200.webp', alt: 'Set de papelería con cuaderno, tijera, sello y sobres', badge: '', desc: 'Calendario de escritorio, block de notas y diez etiquetas adhesivas, todo con el mismo diseño.', etiquetas: ['set', 'escritorio', 'regalo'], destacado: false },

  { id: 18, nombre: 'Cajita para souvenir x10', cat: 'cajitas', precio: 7900, unidad: 'x 10 unidades', descuento: 0, img: 'cajitas-1200x1200.webp', alt: 'Cajitas de regalo con moños y cintas sobre una mesa de madera', badge: '', desc: 'Cajitas armables de 8x8 cm con la etiqueta impresa con el nombre. Llegan planas y se arman en un minuto.', etiquetas: ['cajita', 'souvenir', 'armable'], destacado: true },
  { id: 19, nombre: 'Cajita para golosinas x10', cat: 'cajitas', precio: 8600, unidad: 'x 10 unidades', descuento: 0, img: 'cajita-golosinas-900.webp', alt: 'Cajita roja atada con hilo de yute', badge: '', desc: 'Más alta que la de souvenir: entran alfajores, chupetines o un puñado de golosinas. Va atada con hilo de yute.', etiquetas: ['cajita', 'golosinas', 'fiesta'], destacado: false },
  { id: 20, nombre: 'Caja porta cupcakes x6', cat: 'cajitas', precio: 11500, unidad: 'x 6 unidades', descuento: 0, img: 'cajita-cupcakes-900.webp', alt: 'Caja blanca con moño rojo lista para regalar', badge: '', desc: 'Caja con bandeja interna para que los cupcakes no se muevan en el viaje. Se imprime con el nombre en la tapa.', etiquetas: ['caja', 'cupcakes', 'transporte'], destacado: false },
  { id: 21, nombre: 'Cajita con tapa x10', cat: 'cajitas', precio: 6400, unidad: 'x 10 unidades', descuento: 0, img: 'cajita-tapa-900.webp', alt: 'Cajita abierta de cartulina rosa con su tapa al lado', badge: '', desc: 'Base y tapa por separado, en cartulina de color liso. La versión más simple, para llenar como quieras.', etiquetas: ['cajita', 'tapa', 'lisa'], destacado: false },
  { id: 22, nombre: 'Bolsita kraft con etiqueta x10', cat: 'cajitas', precio: 5900, unidad: 'x 10 unidades', descuento: 0, img: 'bolsita-kraft-900.webp', alt: 'Bolsa de papel kraft lisa vista desde arriba', badge: '', desc: 'Bolsita de papel kraft con la etiqueta personalizada pegada al frente. La opción más económica para el souvenir.', etiquetas: ['bolsita', 'kraft', 'souvenir'], destacado: false },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const Cart = {
  KEY: 'almapapeleria_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 30);
    else items.push({ id: producto.id, qty: Math.min(qty, 30) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 30)); this.save(items);
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
  if (p.descuento > 0) badges.push('<span class="pill pill-mag">-' + p.descuento + '%</span>');
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
            '<button type="button" data-step="-1" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" aria-label="Sumar uno">+</button>' +
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

/* ---------- momento firma: probá tu nombre ---------- */

const Pieza = { nombre: 'Alma', pieza: 'banderin', color: 'magenta' };

const COPY_PIEZA = {
  banderin: n => 'Banderín de ' + n.replace(/\s/g, '').length + ' banderas, una por letra, ya ensartadas en el hilo.',
  topper: () => 'Topper de cartulina de 300 gramos con dos varillas de madera.',
  cajita: () => 'Cajita armable de 8x8 cm con la etiqueta impresa al frente.',
};
const NOMBRE_COLOR = { magenta: 'magenta', tinta: 'tinta', papel: 'papel con borde magenta' };
const NOMBRE_PIEZA = { banderin: 'un banderín', topper: 'un topper', cajita: 'una cajita' };

function limpiarNombre(v) {
  return String(v || '').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s{2,}/g, ' ').slice(0, 12);
}

function pintarBanderin() {
  const cont = document.getElementById('banderines');
  if (!cont) return;
  const letras = [...Pieza.nombre];
  const ultimo = Math.max(letras.length - 1, 1);
  cont.innerHTML = letras.map((l, i) => {
    const caida = Math.round(Math.sin((i / ultimo) * Math.PI) * 14);
    const estilo = '--dy:' + caida + 'px;animation-delay:' + Math.min(i * 0.05, 0.5) + 's';
    if (l === ' ') return '<span class="bandera bandera-espacio" style="' + estilo + '" aria-hidden="true"></span>';
    return '<span class="bandera" style="' + estilo + '">' + esc(l.toUpperCase()) + '</span>';
  }).join('');
}

function pintarEscena() {
  const escena = document.getElementById('persEscena');
  if (!escena) return;
  escena.dataset.pieza = Pieza.pieza;
  escena.dataset.color = Pieza.color;

  document.getElementById('vistaBanderin').hidden = Pieza.pieza !== 'banderin';
  document.getElementById('vistaTopper').hidden = Pieza.pieza !== 'topper';
  document.getElementById('vistaCajita').hidden = Pieza.pieza !== 'cajita';

  if (Pieza.pieza === 'banderin') pintarBanderin();
  document.getElementById('topperNombre').textContent = Pieza.nombre;
  document.getElementById('cajitaNombre').textContent = Pieza.nombre;

  const pie = document.getElementById('escenaPie');
  if (pie) pie.textContent = COPY_PIEZA[Pieza.pieza](Pieza.nombre) + ' En ' + NOMBRE_COLOR[Pieza.color] + '.';

  const boton = document.getElementById('pedirPieza');
  if (boton) {
    const msg = 'Hola Alma! Quiero ' + NOMBRE_PIEZA[Pieza.pieza] + ' con el nombre «' + Pieza.nombre + '» en ' + NOMBRE_COLOR[Pieza.color] + '.';
    boton.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);
  }
}

function initPersonalizar() {
  const input = document.getElementById('nombrePieza');
  if (!input) return;

  input.addEventListener('input', () => {
    const limpio = limpiarNombre(input.value);
    if (limpio !== input.value) input.value = limpio;
    Pieza.nombre = limpio.trim() || 'Alma';
    pintarEscena();
  });
  input.addEventListener('blur', () => {
    if (!input.value.trim()) { input.value = 'Alma'; Pieza.nombre = 'Alma'; pintarEscena(); }
  });

  document.getElementById('opsPieza')?.addEventListener('click', e => {
    const b = e.target.closest('[data-pieza]');
    if (!b) return;
    Pieza.pieza = b.dataset.pieza;
    document.querySelectorAll('#opsPieza [data-pieza]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarEscena();
  });

  document.getElementById('opsColor')?.addEventListener('click', e => {
    const b = e.target.closest('[data-color]');
    if (!b) return;
    Pieza.color = b.dataset.color;
    document.querySelectorAll('#opsColor [data-color]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarEscena();
  });

  pintarEscena();
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
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { this.q = input.value.trim(); this.mostrados = 16; this.render(); }, 180);
    });
    document.getElementById('limpiar').addEventListener('click', () => this.reset());
    document.getElementById('vacioReset').addEventListener('click', () => this.reset());
    document.getElementById('verMas').addEventListener('click', () => { this.mostrados += 16; this.render(true); });
    this.render();
  },
  reset() {
    this.q = ''; this.cat = 'todos'; this.mostrados = 16;
    const input = document.getElementById('q');
    if (input) input.value = '';
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

/* El mismo producto puede estar en la card y en el modal: el contador se busca
   dentro del bloque del botón, nunca en todo el documento. */
function salidaQty(desde) {
  return desde.closest('.prod, .modal-info')?.querySelector('output[data-qty]') || null;
}

function pedirQty(desde) {
  const out = salidaQty(desde);
  return out ? Math.max(1, Math.min(30, parseInt(out.textContent, 10) || 1)) : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = step.parentElement?.querySelector('output[data-qty]');
      if (out) {
        const v = Math.max(1, Math.min(30, (parseInt(out.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
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
      showToast('¡Anotado! ' + p.nombre + ' está en tu pedido');
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
      '<p class="cart-vacio-t">Tu pedido todavía está vacío</p>' +
      '<p>Elegí lo que necesitás para la fiesta y después definimos los nombres por WhatsApp.</p>' +
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
    '<a class="btn btn-line" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola Alma! Quiero encargar: ' + detalle + '.') + '" target="_blank" rel="noopener">Pasar los nombres por WhatsApp</a>' +
    '<p class="cart-nota">Los nombres, colores y la fecha los definimos por mensaje antes de imprimir.</p>';
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
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s><span class="pill pill-mag">-' + p.descuento + '%</span>'
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
            '<button type="button" data-step="-1" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-cta" data-add="' + p.id + '">Agregar al pedido</button>' +
          '<button type="button" class="btn btn-line" data-comprar="' + p.id + '">Comprar ahora</button>' +
        '</div>' +
        (sug.length ? '<div class="modal-sug"><h3>Del mismo estante</h3><div class="sug-grid">' +
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
    const header = document.querySelector('.masthead');
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
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  const piezas = document.querySelectorAll('.hero-collage .hc');
  if (!piezas.length) return;
  piezas.forEach((el, i) => {
    gsap.to(el, {
      yPercent: (i - 1) * -4, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 },
    });
  });
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const grafo = [{
    '@type': 'Store',
    '@id': base + '#negocio',
    name: 'Alma Papelería',
    description: 'Papelería creativa personalizada: toppers para tortas, banderines, stickers, libritos para colorear, calendarios y cajitas.',
    telephone: '+54 9 387 641-7305',
    image: base + 'images/hero-taller-1800x1200.webp',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Salta' },
    areaServed: 'Argentina',
  }].concat(PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: base + 'images/' + p.img,
    category: getCategoria(p.cat)?.nombre,
    brand: { '@type': 'Brand', name: 'Alma Papelería' },
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
initPersonalizar();
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
