document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491150352212';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const wsp = texto => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);

const CATEGORIAS = [
  { id: 'hormigon', nombre: 'Hormigón elaborado', unidad: 'm³', img: 'images/hormigon.webp', alt: 'Hormigón fresco colado dentro de un encofrado', bajada: 'H-8 a H-21, bombeado y alisado' },
  { id: 'baldosas', nombre: 'Baldosas y vereda', unidad: 'm²', img: 'images/baldosas.webp', alt: 'Baldosas intertrabadas de hormigón vistas desde arriba', bajada: 'Baldosón, calcáreo, adoquín y cordón' },
  { id: 'cemento', nombre: 'Cemento y cal', unidad: 'bolsa', img: 'images/cemento.webp', alt: 'Cuchara de albañil cargada con mezcla fresca', bajada: 'Albañilería, portland, cal y pastina' },
  { id: 'arena', nombre: 'Arena', unidad: 'm³', img: 'images/arena.webp', alt: 'Montaña de arena en el playón del corralón', bajada: 'Fina lavada, gruesa y de trituración' },
  { id: 'piedra', nombre: 'Piedra y granza', unidad: 'm³', img: 'images/piedra.webp', alt: 'Piedra partida gris a granel', bajada: 'Partida, canto rodado y gravilla' },
  { id: 'alquiler', nombre: 'Alquiler con chofer', unidad: 'día', img: 'images/alquiler.webp', alt: 'Camión trivolcador descargando material al atardecer', bajada: 'Trivolcador y cargadora con martillo' }
];

const PRODUCTOS = [
  { id: 'h8', nombre: 'Hormigón H-8 de limpieza', cat: 'hormigon', unidad: 'm³', precio: 158900, descuento: 0, presentacion: 'granel', stock: 40,
    desc: 'La capa de asiento que va antes de la estructura. Nivela el fondo de la excavación y aísla la armadura del terreno.',
    ficha: [['Resistencia', 'H-8'], ['Asentamiento', '10 cm'], ['Entrega', 'Mixer en obra'], ['Mínimo', '3 m³']] },
  { id: 'h13', nombre: 'Hormigón H-13 para contrapisos', cat: 'hormigon', unidad: 'm³', precio: 174500, descuento: 0, presentacion: 'granel', stock: 40,
    desc: 'Contrapisos de interior y bases de poco esfuerzo. Buena trabajabilidad para reglar a mano.',
    ficha: [['Resistencia', 'H-13'], ['Asentamiento', '12 cm'], ['Entrega', 'Mixer en obra'], ['Mínimo', '3 m³']] },
  { id: 'h17', nombre: 'Hormigón H-17 para veredas', cat: 'hormigon', unidad: 'm³', precio: 189900, descuento: 0, presentacion: 'granel', stock: 40, destacado: true, badge: 'Más pedido',
    desc: 'El de las veredas y plateas livianas. Es el que usamos nosotros cuando hacemos la obra completa.',
    ficha: [['Resistencia', 'H-17'], ['Asentamiento', '12 cm'], ['Espesor sugerido', '10 cm'], ['Rinde', '10 m² por m³']] },
  { id: 'h21', nombre: 'Hormigón H-21 estructural', cat: 'hormigon', unidad: 'm³', precio: 206400, descuento: 0, presentacion: 'granel', stock: 32,
    desc: 'Para bases, columnas, encadenados y plateas de vivienda. Se entrega con remito de resistencia.',
    ficha: [['Resistencia', 'H-21'], ['Asentamiento', '14 cm'], ['Entrega', 'Mixer en obra'], ['Mínimo', '3 m³']] },
  { id: 'h21b', nombre: 'Hormigón H-21 bombeado', cat: 'hormigon', unidad: 'm³', precio: 238700, descuento: 0, presentacion: 'granel', stock: 20,
    desc: 'Cuando el mixer no llega hasta el paño. Se bombea por manguera hasta fondo de lote o altura.',
    ficha: [['Resistencia', 'H-21'], ['Alcance', 'Hasta 40 m'], ['Incluye', 'Bomba y operador'], ['Mínimo', '5 m³']] },
  { id: 'halisado', nombre: 'Hormigón alisado con endurecedor', cat: 'hormigon', unidad: 'm³', precio: 224500, descuento: 0, presentacion: 'granel', stock: 18,
    desc: 'Terminación lisa y resistente al desgaste para veredas, cocheras y galpones. Se llana en fresco.',
    ficha: [['Resistencia', 'H-21'], ['Terminación', 'Llaneado mecánico'], ['Color', 'Gris natural'], ['Rinde', '10 m² por m³']] },

  { id: 'bald40', nombre: 'Baldosón de vereda 40×40 gris', cat: 'baldosas', unidad: 'm²', precio: 9850, descuento: 0, presentacion: 'premoldeado', stock: 900, destacado: true, badge: 'Más pedido',
    desc: 'La medida estándar de vereda municipal. Hormigón vibrado, cara peinada antideslizante.',
    ficha: [['Medida', '40 × 40 cm'], ['Espesor', '3,5 cm'], ['Piezas por m²', '6,25'], ['Peso', '9 kg por pieza']] },
  { id: 'baldcalc', nombre: 'Baldosa calcárea panes de jabón', cat: 'baldosas', unidad: 'm²', precio: 12400, descuento: 0, presentacion: 'premoldeado', stock: 620,
    desc: 'El clásico dibujo de vereda porteña, en calcáreo prensado. Recupera la vereda de una casa antigua.',
    ficha: [['Medida', '20 × 20 cm'], ['Espesor', '2,5 cm'], ['Piezas por m²', '25'], ['Terminación', 'Mate natural']] },
  { id: 'baldanti', nombre: 'Baldosa antideslizante 40×40', cat: 'baldosas', unidad: 'm²', precio: 11700, descuento: 0, presentacion: 'premoldeado', stock: 540,
    desc: 'Superficie con relieve para rampas, bordes de pileta y entradas de cochera en pendiente.',
    ficha: [['Medida', '40 × 40 cm'], ['Espesor', '3,5 cm'], ['Piezas por m²', '6,25'], ['Uso', 'Exterior en pendiente']] },
  { id: 'adoquin', nombre: 'Adoquín intertrabado 8 cm', cat: 'baldosas', unidad: 'm²', precio: 14900, descuento: 10, presentacion: 'premoldeado', stock: 480, destacado: true,
    desc: 'Se traba solo, sin mezcla. Aguanta el paso de vehículos y se levanta pieza por pieza si hay que romper.',
    ficha: [['Espesor', '8 cm'], ['Piezas por m²', '40'], ['Asiento', 'Arena 4 cm'], ['Tránsito', 'Vehicular liviano']] },
  { id: 'baldpiedra', nombre: 'Baldosa símil piedra 45×45', cat: 'baldosas', unidad: 'm²', precio: 16300, descuento: 0, presentacion: 'premoldeado', stock: 300,
    desc: 'Textura de piedra natural en pieza de hormigón. Para frentes y senderos de parque.',
    ficha: [['Medida', '45 × 45 cm'], ['Espesor', '4 cm'], ['Piezas por m²', '4,9'], ['Terminación', 'Símil laja']] },
  { id: 'cordon', nombre: 'Cordón cuneta premoldeado 1 m', cat: 'baldosas', unidad: 'unidad', precio: 18600, descuento: 0, presentacion: 'premoldeado', stock: 160,
    desc: 'Módulo de un metro para cerrar el borde de la vereda o rehacer el cordón roto por una raíz.',
    ficha: [['Largo', '1 m'], ['Alto', '30 cm'], ['Peso', '48 kg'], ['Colocación', 'Sobre base de hormigón']] },

  { id: 'cemalb', nombre: 'Cemento de albañilería 50 kg', cat: 'cemento', unidad: 'bolsa', precio: 12900, descuento: 0, presentacion: 'embolsado', stock: 300, destacado: true, badge: 'Más pedido',
    desc: 'El de todos los días: mampostería, revoques y asiento de baldosa. Fragüe parejo y buena plasticidad.',
    ficha: [['Peso', '50 kg'], ['Tipo', 'Albañilería'], ['Rinde', '18 a 20 m² de revoque'], ['Estiba', 'Pallet de 40 bolsas']] },
  { id: 'cemport', nombre: 'Cemento Portland normal 50 kg', cat: 'cemento', unidad: 'bolsa', precio: 15800, descuento: 0, presentacion: 'embolsado', stock: 260,
    desc: 'Para hormigones hechos en obra, bases y contrapisos donde se necesita resistencia.',
    ficha: [['Peso', '50 kg'], ['Tipo', 'Portland normal'], ['Uso', 'Estructural'], ['Estiba', 'Pallet de 40 bolsas']] },
  { id: 'cal', nombre: 'Cal hidratada 25 kg', cat: 'cemento', unidad: 'bolsa', precio: 7450, descuento: 8, presentacion: 'embolsado', stock: 340,
    desc: 'Da untuosidad a la mezcla y evita que el revoque se raje. Se usa junto al cemento, no en lugar de él.',
    ficha: [['Peso', '25 kg'], ['Tipo', 'Hidratada en polvo'], ['Uso', 'Revoques y asientos'], ['Estiba', 'Pallet de 60 bolsas']] },
  { id: 'pastina', nombre: 'Pastina para juntas 5 kg', cat: 'cemento', unidad: 'bolsa', precio: 4900, descuento: 0, presentacion: 'embolsado', stock: 180,
    desc: 'Toma las juntas de la baldosa una vez asentada. Gris cemento, que es lo que pide una vereda.',
    ficha: [['Peso', '5 kg'], ['Color', 'Gris cemento'], ['Junta', 'Hasta 5 mm'], ['Rinde', '8 a 10 m²']] },
  { id: 'mortero', nombre: 'Mortero seco de asiento 30 kg', cat: 'cemento', unidad: 'bolsa', precio: 9200, descuento: 0, presentacion: 'embolsado', stock: 210,
    desc: 'Viene dosificado: se le agrega agua y listo. Ahorra tener que hacer pastón cuando es poca superficie.',
    ficha: [['Peso', '30 kg'], ['Preparación', 'Solo agregar agua'], ['Rinde', '2,5 m² a 1 cm'], ['Uso', 'Asiento de piso']] },

  { id: 'arefina', nombre: 'Arena fina lavada', cat: 'arena', unidad: 'm³', precio: 41500, descuento: 0, presentacion: 'granel', stock: 60,
    desc: 'Arena de río lavada para revoque fino y cama de asiento de baldosa. Sin sales ni tierra.',
    ficha: [['Granulometría', '0 a 2 mm'], ['Origen', 'Río, lavada'], ['Entrega', 'A granel'], ['Mínimo', '1 m³']] },
  { id: 'aregruesa', nombre: 'Arena gruesa oriental', cat: 'arena', unidad: 'm³', precio: 46900, descuento: 0, presentacion: 'granel', stock: 55, destacado: true,
    desc: 'La de siempre para mezclas de albañilería y contrapisos. Grano parejo, sin exceso de finos.',
    ficha: [['Granulometría', '0 a 5 mm'], ['Origen', 'Oriental'], ['Entrega', 'A granel'], ['Mínimo', '1 m³']] },
  { id: 'aretrit', nombre: 'Arena de trituración', cat: 'arena', unidad: 'm³', precio: 52300, descuento: 0, presentacion: 'granel', stock: 34,
    desc: 'Arena de cantera, más angulosa. Traba mejor bajo adoquín y en bases que tienen que soportar tránsito.',
    ficha: [['Granulometría', '0 a 6 mm'], ['Origen', 'Cantera'], ['Uso', 'Bases y adoquín'], ['Mínimo', '1 m³']] },

  { id: 'piedra620', nombre: 'Piedra partida 6-20', cat: 'piedra', unidad: 'm³', precio: 63800, descuento: 0, presentacion: 'granel', stock: 48, destacado: true, badge: 'Más pedido',
    desc: 'El agregado grueso del hormigón y la cama drenante debajo del contrapiso de vereda.',
    ficha: [['Granulometría', '6 a 20 mm'], ['Origen', 'Granítica'], ['Uso', 'Hormigón y drenaje'], ['Mínimo', '1 m³']] },
  { id: 'piedra1030', nombre: 'Piedra partida 10-30', cat: 'piedra', unidad: 'm³', precio: 61200, descuento: 12, presentacion: 'granel', stock: 30,
    desc: 'Piedra más grande para rellenos, pozos absorbentes y drenajes de fondo de lote.',
    ficha: [['Granulometría', '10 a 30 mm'], ['Origen', 'Granítica'], ['Uso', 'Relleno y drenaje'], ['Mínimo', '1 m³']] },
  { id: 'canto', nombre: 'Canto rodado 10-20', cat: 'piedra', unidad: 'm³', precio: 74500, descuento: 0, presentacion: 'granel', stock: 22,
    desc: 'Piedra de río redondeada, para terminación de jardín, senderos y contrapisos a la vista.',
    ficha: [['Granulometría', '10 a 20 mm'], ['Origen', 'Río'], ['Uso', 'Decorativo y drenaje'], ['Mínimo', '1 m³']] },
  { id: 'granza', nombre: 'Granza fina 0-6', cat: 'piedra', unidad: 'm³', precio: 48700, descuento: 0, presentacion: 'granel', stock: 26,
    desc: 'Gravilla para caminos de entrada, nivelación de patios y terminación de accesos.',
    ficha: [['Granulometría', '0 a 6 mm'], ['Origen', 'Cantera'], ['Uso', 'Caminos y nivelación'], ['Mínimo', '1 m³']] },

  { id: 'trivolcador', nombre: 'Camión trivolcador con chofer', cat: 'alquiler', unidad: 'día', precio: 312000, descuento: 0, presentacion: 'servicio', stock: 2, destacado: true, badge: 'Más pedido',
    desc: 'Jornada de 8 horas con chofer nuestro. Descarga por los tres lados, entra en calles angostas.',
    ficha: [['Jornada', '8 horas'], ['Chofer', 'Incluido'], ['Capacidad', '6 m³'], ['Zona', 'CABA y GBA']] },
  { id: 'trivolmedia', nombre: 'Trivolcador media jornada', cat: 'alquiler', unidad: '4 h', precio: 186000, descuento: 0, presentacion: 'servicio', stock: 2,
    desc: 'Media jornada para un solo viaje de escombro o una descarga puntual de material.',
    ficha: [['Jornada', '4 horas'], ['Chofer', 'Incluido'], ['Capacidad', '6 m³'], ['Zona', 'CABA y GBA']] },
  { id: 'cargamartillo', nombre: 'Cargadora con martillo hidráulico', cat: 'alquiler', unidad: 'día', precio: 398000, descuento: 0, presentacion: 'servicio', stock: 1, destacado: true,
    desc: 'Rompe contrapiso y vereda vieja, y después carga el escombro con el mismo equipo. Con operador.',
    ficha: [['Jornada', '8 horas'], ['Operador', 'Incluido'], ['Accesorio', 'Martillo hidráulico'], ['Zona', 'CABA y GBA']] },
  { id: 'cargafrontal', nombre: 'Cargadora frontal con chofer', cat: 'alquiler', unidad: 'día', precio: 345000, descuento: 10, presentacion: 'servicio', stock: 1,
    desc: 'Movimiento de suelo, nivelación de terreno y carga de material a granel dentro del lote.',
    ficha: [['Jornada', '8 horas'], ['Operador', 'Incluido'], ['Balde', '1 m³'], ['Zona', 'CABA y GBA']] }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const imgDe = p => getCategoria(p.cat)?.img || 'images/hero.webp';
const altDe = p => getCategoria(p.cat)?.alt || p.nombre;

const Cart = {
  KEY: 'lailatec_cart',
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
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
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

let revealsListos = false;
function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.1, 0.6) + 's';
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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.055, 0.42) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function cardHTML(p, extraClase) {
  const final = precioFinal(p);
  const badge = p.descuento > 0
    ? '<span class="prod-badge is-off">-' + p.descuento + '%</span>'
    : (p.badge ? '<span class="prod-badge">' + esc(p.badge) + '</span>' : '');
  const precio = p.descuento > 0
    ? '<b>' + formatearPrecio(final) + '</b><s>' + formatearPrecio(p.precio) + '</s><i>/ ' + esc(p.unidad) + '</i>'
    : '<b>' + formatearPrecio(final) + '</b><i>/ ' + esc(p.unidad) + '</i>';
  return '<article class="prod-card ' + (extraClase || '') + '" data-animate style="transform:translateY(26px) scale(.96);opacity:0">' +
    '<div class="prod-media">' +
      '<img src="' + imgDe(p) + '" alt="' + esc(altDe(p)) + '" width="1200" height="900" decoding="async">' +
      '<button type="button" class="prod-open" data-ver="' + p.id + '" aria-label="Ver la ficha de ' + esc(p.nombre) + '"></button>' +
      badge +
      '<span class="unit prod-unit">' + esc(p.unidad) + '</span>' +
    '</div>' +
    '<div class="prod-body">' +
      '<span class="prod-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
      '<h3 class="prod-name">' + esc(p.nombre) + '</h3>' +
      '<div class="prod-precio">' + precio + '</div>' +
      '<div class="prod-actions">' +
        '<div class="stepper" data-stepper="' + p.id + '">' +
          '<button type="button" data-step="-1" aria-label="Restar una unidad">−</button>' +
          '<span data-qty>1</span>' +
          '<button type="button" data-step="1" aria-label="Sumar una unidad">+</button>' +
        '</div>' +
        '<button type="button" class="prod-add" data-add="' + p.id + '">Agregar</button>' +
        '<button type="button" class="prod-buy" data-buy="' + p.id + '">Comprar</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function qtyDe(id, scope) {
  const st = (scope || document).querySelector('[data-stepper="' + id + '"] [data-qty]');
  return Math.max(1, parseInt(st?.textContent || '1', 10) || 1);
}

function initSteppers(root) {
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const wrap = btn.closest('[data-stepper]');
    const span = wrap?.querySelector('[data-qty]');
    if (!span) return;
    const p = getProducto(wrap.getAttribute('data-stepper'));
    const max = p?.stock ?? 99;
    const actual = parseInt(span.textContent, 10) || 1;
    span.textContent = Math.max(1, Math.min(actual + parseInt(btn.getAttribute('data-step'), 10), max));
  });
}

function initAcciones(root) {
  root.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.getAttribute('data-add'));
      if (!p) return;
      Cart.add(p, qtyDe(p.id, root));
      showToast('Sumado al pedido: ' + p.nombre);
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.getAttribute('data-buy'));
      if (!p) return;
      Cart.add(p, qtyDe(p.id, root));
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirQuickView(ver.getAttribute('data-ver'), ver);
  });
}

function initCategorias() {
  const grid = document.getElementById('catsGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIAS.map(c =>
    '<a class="cat-card" href="#tienda" data-goto-cat="' + c.id + '" data-animate style="clip-path:inset(100% 0 0 0);opacity:0">' +
      '<div class="cat-media"><img src="' + c.img + '" alt="' + esc(c.alt) + '" width="1200" height="750" decoding="async"></div>' +
      '<div class="cat-body">' +
        '<div><span class="cat-name">' + esc(c.nombre) + '</span><span class="cat-bajada">' + esc(c.bajada) + '</span></div>' +
        '<span class="unit">' + esc(c.unidad) + '</span>' +
      '</div>' +
    '</a>').join('');

  const footer = document.getElementById('footerCats');
  if (footer) footer.innerHTML = CATEGORIAS.map(c => '<li><a href="#tienda" data-goto-cat="' + c.id + '">' + esc(c.nombre) + '</a></li>').join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('rail');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardHTML(p, 'rail-card')).join('');
  initSteppers(track);
  initAcciones(track);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

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
      try { vp.setPointerCapture?.(pointerId); } catch {}
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch {}
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

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => Math.max(240, vp.clientWidth * 0.72);
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 8;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

const estado = { q: '', cat: 'all', pres: 'all', orden: 'destacados', visibles: 16 };
const PASO_CATALOGO = 16;

function filtrar() {
  const q = normalizar(estado.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (estado.pres !== 'all' && p.presentacion !== estado.pres) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.unidad, p.presentacion, p.desc].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const resultados = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;
  const lista = filtrar();
  const mostrados = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrados.map(p => cardHTML(p)).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  if (resultados) resultados.textContent = lista.length === 1 ? '1 material' : lista.length + ' materiales';
  const filtrado = estado.q !== '' || estado.cat !== 'all' || estado.pres !== 'all' || estado.orden !== 'destacados';
  if (limpiar) limpiar.hidden = !filtrado;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const chips = document.getElementById('chips');
  if (!grid || !chips) return;

  chips.innerHTML = '<button type="button" class="chip on" data-chip="all">Todo</button>' +
    CATEGORIAS.map(c => '<button type="button" class="chip" data-chip="' + c.id + '">' + esc(c.nombre) + '</button>').join('');

  const setChip = id => {
    estado.cat = id;
    chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('on', b.getAttribute('data-chip') === id));
    estado.visibles = PASO_CATALOGO;
    renderCatalogo();
  };

  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (b) setChip(b.getAttribute('data-chip'));
  });

  const buscador = document.getElementById('buscador');
  let t;
  buscador?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscador.value; estado.visibles = PASO_CATALOGO; renderCatalogo(); }, 160);
  });

  document.getElementById('filtroPres')?.addEventListener('change', e => {
    estado.pres = e.target.value; estado.visibles = PASO_CATALOGO; renderCatalogo();
  });
  document.getElementById('orden')?.addEventListener('change', e => {
    estado.orden = e.target.value; estado.visibles = PASO_CATALOGO; renderCatalogo();
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    estado.visibles += PASO_CATALOGO; renderCatalogo();
  });

  const limpiarTodo = () => {
    estado.q = ''; estado.cat = 'all'; estado.pres = 'all'; estado.orden = 'destacados'; estado.visibles = PASO_CATALOGO;
    if (buscador) buscador.value = '';
    const fp = document.getElementById('filtroPres'); if (fp) fp.value = 'all';
    const or = document.getElementById('orden'); if (or) or.value = 'destacados';
    chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('on', b.getAttribute('data-chip') === 'all'));
    renderCatalogo();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarTodo);

  initSteppers(grid);
  initAcciones(grid);
  renderCatalogo();

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-goto-cat]');
    if (!link) return;
    const cat = link.getAttribute('data-goto-cat');
    if (!getCategoria(cat)) return;
    setChip(cat);
    const destino = document.getElementById('tienda');
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
}

const VISTOS_KEY = 'lailatec_vistos';
function guardarVisto(id) {
  try {
    const prev = JSON.parse(localStorage.getItem(VISTOS_KEY)) || [];
    const lista = [id, ...prev.filter(x => x !== id)].slice(0, 8);
    localStorage.setItem(VISTOS_KEY, JSON.stringify(lista));
  } catch {}
}
function getVistos(excluir) {
  try {
    const lista = JSON.parse(localStorage.getItem(VISTOS_KEY)) || [];
    return lista.filter(id => id !== excluir).map(getProducto).filter(Boolean).slice(0, 3);
  } catch { return []; }
}

const modal = document.getElementById('quickView');
const qvPanel = document.getElementById('qvPanel');
let qvUltimoFoco = null;

function relacionadosHTML(p) {
  const vistos = getVistos(p.id);
  const mismos = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const lista = vistos.length >= 2 ? vistos : mismos;
  if (!lista.length) return '';
  const titulo = vistos.length >= 2 ? 'Lo último que miraste' : 'También te puede servir';
  return '<div class="qv-relacionados"><h4>' + titulo + '</h4><div class="qv-rel-grid">' +
    lista.map(r => '<button type="button" class="qv-rel" data-ver="' + r.id + '">' +
      '<img src="' + imgDe(r) + '" alt="" width="112" height="112" decoding="async">' +
      '<span><b>' + esc(r.nombre) + '</b><span>' + formatearPrecio(precioFinal(r)) + ' / ' + esc(r.unidad) + '</span></span>' +
    '</button>').join('') + '</div></div>';
}

function abrirQuickView(id, origen) {
  const p = getProducto(id);
  if (!p || !modal || !qvPanel) return;
  qvUltimoFoco = origen || document.activeElement;
  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? '<b>' + formatearPrecio(final) + '</b><s>' + formatearPrecio(p.precio) + '</s><i>por ' + esc(p.unidad) + '</i>'
    : '<b>' + formatearPrecio(final) + '</b><i>por ' + esc(p.unidad) + '</i>';
  qvPanel.innerHTML =
    '<button type="button" class="qv-close" id="qvClose" aria-label="Cerrar la ficha">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button>' +
    '<div class="qv">' +
      '<div class="qv-media"><img src="' + imgDe(p) + '" alt="' + esc(altDe(p)) + '" width="1200" height="1200" decoding="async"><span class="unit">' + esc(p.unidad) + '</span></div>' +
      '<div class="qv-body">' +
        '<span class="qv-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
        '<h2 class="qv-nombre" id="qvNombre">' + esc(p.nombre) + '</h2>' +
        '<p class="qv-desc">' + esc(p.desc) + '</p>' +
        '<ul class="qv-ficha">' + p.ficha.map(f => '<li><span>' + esc(f[0]) + '</span><b>' + esc(f[1]) + '</b></li>').join('') + '</ul>' +
        '<div class="qv-precio">' + precio + '</div>' +
        '<div class="qv-actions">' +
          '<div class="stepper" data-stepper="' + p.id + '">' +
            '<button type="button" data-step="-1" aria-label="Restar una unidad">−</button>' +
            '<span data-qty>1</span>' +
            '<button type="button" data-step="1" aria-label="Sumar una unidad">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-primary" data-add="' + p.id + '">Agregar al pedido</button>' +
          '<button type="button" class="btn btn-ghost" data-buy="' + p.id + '">Comprar ahora</button>' +
        '</div>' +
      '</div>' +
      relacionadosHTML(p) +
    '</div>';
  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('no-scroll');
  guardarVisto(p.id);
  document.getElementById('qvClose')?.focus();
}

function cerrarQuickView() {
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; qvPanel.innerHTML = ''; }, 300);
  qvUltimoFoco?.focus?.();
}

function initQuickView() {
  if (!modal || !qvPanel) return;
  initSteppers(qvPanel);
  qvPanel.addEventListener('click', e => {
    if (e.target.closest('#qvClose')) { cerrarQuickView(); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.getAttribute('data-add'));
      if (p) { Cart.add(p, qtyDe(p.id, qvPanel)); showToast('Sumado al pedido: ' + p.nombre); }
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.getAttribute('data-buy'));
      if (p) { Cart.add(p, qtyDe(p.id, qvPanel)); cerrarQuickView(); abrirDrawer(); }
      return;
    }
    const rel = e.target.closest('.qv-rel[data-ver]');
    if (rel) abrirQuickView(rel.getAttribute('data-ver'), qvUltimoFoco);
  });
  document.getElementById('qvBackdrop')?.addEventListener('click', cerrarQuickView);
}

const drawer = document.getElementById('cartDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
let drawerUltimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const totalEl = document.getElementById('drawerTotal');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="cart-vacio"><span class="unit">0</span>' +
      '<h3>Todavía no cargaste nada</h3>' +
      '<p>Armá el pedido con lo que necesitás bajar en la obra y te pasamos el flete aparte.</p>' +
      '<button type="button" class="btn btn-primary" data-cerrar-drawer>Ver el catálogo</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return '<div class="ci">' +
      '<div class="ci-media"><img src="' + imgDe(p) + '" alt="" width="160" height="160" decoding="async"></div>' +
      '<div>' +
        '<h3 class="ci-name">' + esc(p.nombre) + '</h3>' +
        '<p class="ci-meta">' + formatearPrecio(precioFinal(p)) + ' por ' + esc(p.unidad) + '</p>' +
        '<div class="stepper" data-stepper="' + p.id + '">' +
          '<button type="button" data-ci-step="-1" data-id="' + p.id + '" aria-label="Restar una unidad">−</button>' +
          '<span data-qty>' + i.qty + '</span>' +
          '<button type="button" data-ci-step="1" data-id="' + p.id + '" aria-label="Sumar una unidad">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="ci-side">' +
        '<span class="ci-precio">' + formatearPrecio(precioFinal(p) * i.qty) + '</span>' +
        '<button type="button" class="ci-del" data-del="' + p.id + '">Quitar</button>' +
      '</div>' +
    '</div>';
  }).join('');
  if (foot) foot.hidden = false;
  if (totalEl) totalEl.textContent = formatearPrecio(Cart.total());
  const wspBtn = document.getElementById('pedirWsp');
  if (wspBtn) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? '• ' + p.nombre + ' × ' + i.qty + ' ' + p.unidad : '';
    }).filter(Boolean).join('\n');
    wspBtn.href = wsp('Hola Lailatec, quiero pedir estos materiales:\n' + detalle + '\n\nTotal estimado: ' + formatearPrecio(Cart.total()) + '\nLa obra queda en:');
  }
}

function abrirDrawer() {
  if (!drawer || !drawerBackdrop) return;
  drawerUltimoFoco = document.activeElement;
  drawer.hidden = false; drawerBackdrop.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); drawerBackdrop.classList.add('open'); });
  document.body.classList.add('no-scroll', 'drawer-open');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.classList.remove('open'); drawerBackdrop?.classList.remove('open');
  document.body.classList.remove('no-scroll', 'drawer-open');
  setTimeout(() => { drawer.hidden = true; if (drawerBackdrop) drawerBackdrop.hidden = true; }, 380);
  drawerUltimoFoco?.focus?.();
}

function initDrawer() {
  if (!drawer) return;
  document.getElementById('cartBtnHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  drawerBackdrop?.addEventListener('click', cerrarDrawer);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) {
      cerrarDrawer();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const step = e.target.closest('[data-ci-step]');
    if (step) {
      const id = step.getAttribute('data-id');
      const actual = Cart.get().find(i => i.id === id)?.qty || 1;
      Cart.setQty(id, actual + parseInt(step.getAttribute('data-ci-step'), 10));
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const p = getProducto(del.getAttribute('data-del'));
      Cart.remove(del.getAttribute('data-del'));
      showToast('Sacamos ' + (p?.nombre || 'el material') + ' del pedido');
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

function trapFoco(e) {
  const panel = !modal?.hidden ? qvPanel : (!drawer?.hidden ? drawer : null);
  if (!panel) return;
  const foco = panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal && !modal.hidden) cerrarQuickView();
    else if (drawer && !drawer.hidden) cerrarDrawer();
  }
  if (e.key === 'Tab' && ((modal && !modal.hidden) || (drawer && !drawer.hidden))) trapFoco(e);
});

function initFloats() {
  const wspBtn = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wspBtn?.classList.toggle('visible', scrolled);
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
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 900px)');
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

const CAPAS_CM = [10, 8, 10, 3, 3];
const CAPAS_TOTAL = 34;

function initCorte() {
  const stage = document.getElementById('corteStage');
  const visual = document.getElementById('corteVisual');
  if (!stage || !visual) return;

  const regla = visual.querySelector('.regla');
  if (regla && !regla.querySelector('.regla-fill')) {
    const fill = document.createElement('span');
    fill.className = 'regla-fill';
    regla.prepend(fill);
  }
  const cmEl = visual.querySelector('#corteCm');
  const capas = [...visual.querySelectorAll('.capa')];
  const pasos = [...stage.querySelectorAll('.paso')];

  let ultimo = -2;
  const setStep = progreso => {
    const idx = Math.max(-1, Math.min(Math.floor(progreso * (capas.length + 0.6)) - 1, capas.length - 1));
    if (idx === ultimo) return;
    ultimo = idx;
    capas.forEach((c, i) => c.classList.toggle('is-on', i <= idx));
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === Math.max(0, idx)));
    const cm = CAPAS_CM.slice(0, idx + 1).reduce((s, n) => s + n, 0);
    visual.style.setProperty('--cota', (cm / CAPAS_TOTAL).toFixed(3));
    if (cmEl) cmEl.textContent = cm;
  };

  const mostrarTodo = () => {
    capas.forEach(c => c.classList.add('is-on'));
    pasos.forEach(p => p.classList.add('is-on'));
    visual.style.setProperty('--cota', '1');
    if (cmEl) cmEl.textContent = CAPAS_TOTAL;
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    mostrarTodo();
    return;
  }

  setStep(0);
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress),
      onRefresh: self => setStep(self.progress)
    });
    return () => st.kill();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: self => setStep(self.progress),
      onRefresh: self => setStep(self.progress)
    });
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

function initCombo() {
  document.getElementById('comboVereda')?.addEventListener('click', () => {
    ['piedra620', 'h17', 'arefina', 'bald40'].forEach(id => {
      const p = getProducto(id);
      if (p) Cart.add(p, 1);
    });
    showToast('Cargamos las 4 capas. Ajustá las cantidades a tus metros.');
    abrirDrawer();
  });
}

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-photo img', { scale: 1.1, duration: 1.25, ease: 'power2.out' }, 0)
    .from('.hero-photo', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.inOut' }, 0)
    .from('.hero-eyebrow', { y: 16, opacity: 0, duration: .6 }, 0.15)
    .from('.hero-title', { y: 34, opacity: 0, duration: .9 }, 0.25)
    .from('.hero-lead', { y: 22, opacity: 0, duration: .8 }, 0.4)
    .from('.hero-cta > *', { y: 18, opacity: 0, duration: .6, stagger: .09 }, 0.52)
    .from('.hero-chip', { x: 26, opacity: 0, duration: .7, stagger: .12 }, 0.6)
    .from('.hero-tape', { scaleX: 0, transformOrigin: 'left center', duration: .8, ease: 'power2.inOut' }, 0.5)
    .from('.hero-seal', { y: 22, opacity: 0, duration: .7 }, 0.85)
    .from('.cota', { y: 18, opacity: 0, duration: .6, stagger: .1 }, 0.7);
}

function initSecciones() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.utils.toArray('.sec-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      yPercent: 18, opacity: 0, duration: .85, ease: 'power3.out'
    });
  });
  gsap.utils.toArray('.obras-list li').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%' },
      x: -26, opacity: 0, duration: .7, delay: i * 0.04, ease: 'power2.out'
    });
  });
  gsap.utils.toArray('.maq-card').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%' },
      y: 30, opacity: 0, duration: .75, delay: i * 0.1, ease: 'power3.out'
    });
  });
  gsap.to('.maq-bg', {
    scrollTrigger: { trigger: '.maquinas', start: 'top bottom', end: 'bottom top', scrub: true },
    yPercent: 6, ease: 'none'
  });
  gsap.to('.cierre-word', {
    scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom bottom', scrub: true },
    yPercent: -14, ease: 'none'
  });
}

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

initCategorias();
initRail();
initCatalogo();
initReveals();
initNav();
initQuickView();
initDrawer();
initFloats();
initCombo();
initCorte();
initHero();
initSecciones();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
