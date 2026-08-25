document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491166870180';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const SIN_TILDES = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(SIN_TILDES, '');
const wsp = texto => 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);

const CATEGORIAS = [
  { id: 'parrilla', nombre: 'Parrilla', img: 'images/parrilla.webp', alt: 'Cortes de carne a la parrilla servidos sobre mantel a cuadros' },
  { id: 'minutas', nombre: 'Minutas', img: 'images/minutas.webp', alt: 'Milanesas con papas fritas en la mesa del bodegón' },
  { id: 'pastas', nombre: 'Pastas', img: 'images/pastas.webp', alt: 'Ravioles con salsa y queso rallado' },
  { id: 'pizzas', nombre: 'Pizzas', img: 'images/pizzas.webp', alt: 'Pizza de muzzarella recién salida del horno' },
  { id: 'bodegon', nombre: 'Clásicos del bodegón', img: 'images/bodegon.webp', alt: 'Guiso servido con puré desde la olla' },
  { id: 'cafeteria', nombre: 'Cafetería', img: 'images/cafeteria.webp', alt: 'Café con leche y medialuna sobre la mesa' },
  { id: 'tortas', nombre: 'Tortas y postres', img: 'images/tortas.webp', alt: 'Porción de torta de chocolate con frutos rojos' }
];

const PRODUCTOS = [
  { id: 'cafe-chico', nombre: 'Café chico', cat: 'cafeteria', precio: 2400, descuento: 0, desc: 'Espresso corto, de la máquina de siempre. Se sirve con un vaso de soda.', tags: ['vegetariano', 'sintacc'], momento: ['desayuno'], hambre: ['liviano'], tenta: ['loquesea'] },
  { id: 'cortado', nombre: 'Cortado en jarrito', cat: 'cafeteria', precio: 2700, descuento: 0, desc: 'El clásico de la barra: café con un toque de leche espumada, en jarrito de vidrio.', tags: ['vegetariano', 'sintacc'], badge: 'El más pedido', destacado: true, momento: ['desayuno'], hambre: ['liviano'], tenta: ['loquesea'] },
  { id: 'submarino', nombre: 'Submarino', cat: 'cafeteria', precio: 4900, descuento: 0, desc: 'Leche bien caliente y la barra de chocolate para hundir. Viene con dos vainillas.', tags: ['vegetariano'], momento: ['desayuno'], hambre: ['liviano'], tenta: ['dulce'] },
  { id: 'medialunas', nombre: 'Medialunas de manteca (3)', cat: 'cafeteria', precio: 3900, descuento: 0, desc: 'Recién horneadas, con el almíbar todavía brillando. Se piden de a tres o no se piden.', tags: ['vegetariano'], destacado: true, momento: ['desayuno'], hambre: ['liviano'], tenta: ['dulce'] },
  { id: 'tostado', nombre: 'Tostado de jamón y queso', cat: 'cafeteria', precio: 6800, descuento: 0, desc: 'En pan de miga, prensado hasta que el queso se escapa por el borde.', tags: [], momento: ['desayuno', 'almuerzo'], hambre: ['liviano'], tenta: ['loquesea'] },
  { id: 'licuado', nombre: 'Licuado de banana', cat: 'cafeteria', precio: 5200, descuento: 0, desc: 'Con leche fría y bien batido. También va con agua si lo preferís.', tags: ['vegetariano', 'sintacc'], momento: ['desayuno'], hambre: ['liviano'], tenta: ['dulce'] },

  { id: 'chocotorta', nombre: 'Porción de chocotorta', cat: 'tortas', precio: 6900, descuento: 0, desc: 'Galletitas, dulce de leche y queso crema. La que se lleva la mitad de la vitrina.', tags: ['vegetariano'], badge: 'El más pedido', destacado: true, momento: ['postre'], hambre: ['liviano', 'normal'], tenta: ['dulce'] },
  { id: 'lemonpie', nombre: 'Lemon pie', cat: 'tortas', precio: 6400, descuento: 0, desc: 'Base crocante, crema de limón ácida de verdad y merengue quemado arriba.', tags: ['vegetariano'], momento: ['postre'], hambre: ['liviano'], tenta: ['dulce'] },
  { id: 'flan', nombre: 'Flan casero con dulce de leche', cat: 'tortas', precio: 5900, descuento: 0, desc: 'Flan mixto de la casa: dulce de leche y crema, las dos cosas, sin discutir.', tags: ['vegetariano', 'sintacc'], destacado: true, momento: ['postre'], hambre: ['liviano'], tenta: ['dulce'] },
  { id: 'budin', nombre: 'Budín de pan', cat: 'tortas', precio: 4800, descuento: 0, desc: 'Como el de la abuela, con pasas y caramelo en el fondo del molde.', tags: ['vegetariano'], momento: ['postre', 'desayuno'], hambre: ['liviano'], tenta: ['dulce'] },
  { id: 'tiramisu', nombre: 'Tiramisú', cat: 'tortas', precio: 7200, descuento: 0, desc: 'Vainillas embebidas en café, mascarpone y cacao amargo tamizado arriba.', tags: ['vegetariano'], momento: ['postre'], hambre: ['normal'], tenta: ['dulce'] },
  { id: 'panqueque', nombre: 'Panqueque con dulce de leche', cat: 'tortas', precio: 5600, descuento: 0, desc: 'Dos panqueques finitos, bien cargados y flameados en la mesa si querés show.', tags: ['vegetariano'], momento: ['postre'], hambre: ['normal'], tenta: ['dulce'] },

  { id: 'mila-papas', nombre: 'Milanesa con papas fritas', cat: 'minutas', precio: 12900, descuento: 0, desc: 'De ternera, rebozada a mano, con una montaña de papas bastón. Tapa el plato.', tags: ['compartir'], badge: 'El más pedido', destacado: true, momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'suprema-napo', nombre: 'Suprema napolitana', cat: 'minutas', precio: 14500, descuento: 0, desc: 'Pollo, salsa, jamón y muzzarella gratinada. Sale con puré o papas, vos elegís.', tags: [], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'tortilla', nombre: 'Tortilla de papas', cat: 'minutas', precio: 9800, descuento: 0, desc: 'Alta, jugosa en el medio, cortada en cuña. Se puede pedir con cebolla o sin.', tags: ['vegetariano', 'sintacc'], momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['loquesea'] },
  { id: 'gramajo', nombre: 'Revuelto Gramajo', cat: 'minutas', precio: 11400, descuento: 0, desc: 'Papas pai, jamón, arvejas y huevo revuelto. Un plato que es dos platos.', tags: ['sintacc'], momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['loquesea'] },
  { id: 'hamburguesa', nombre: 'Hamburguesa completa', cat: 'minutas', precio: 11900, descuento: 0, desc: 'Doble medallón, queso, jamón, huevo, lechuga y tomate. Con papas incluidas.', tags: [], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'lomito', nombre: 'Sándwich de lomo', cat: 'minutas', precio: 13900, descuento: 0, desc: 'Pan francés, lomo a la plancha, queso, huevo y todo lo que le quieras poner.', tags: [], destacado: true, momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },

  { id: 'bife', nombre: 'Bife de chorizo', cat: 'parrilla', precio: 22500, descuento: 0, desc: '400 g a la parrilla, con la grasa dorada. Lo servimos al punto que pidas.', tags: ['sintacc'], badge: 'De la casa', destacado: true, momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'vacio', nombre: 'Vacío al asador', cat: 'parrilla', precio: 20900, descuento: 0, desc: 'Cocción lenta hasta que se corta con el tenedor. Con chimichurri de la casa.', tags: ['sintacc'], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'entrana', nombre: 'Entraña', cat: 'parrilla', precio: 24800, descuento: 0, desc: 'Fina, jugosa y con el borde crocante. La favorita de los que saben.', tags: ['sintacc'], momento: ['cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'asado-tira', nombre: 'Asado de tira', cat: 'parrilla', precio: 19800, descuento: 0, desc: 'Tres costillas anchas, doradas de los dos lados. Con ensalada mixta.', tags: ['sintacc'], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'provoleta', nombre: 'Provoleta a la parrilla', cat: 'parrilla', precio: 8900, descuento: 0, desc: 'Con orégano y aceite de oliva, servida en la cazuelita, todavía burbujeando.', tags: ['vegetariano', 'sintacc', 'compartir'], destacado: true, momento: ['cena'], hambre: ['normal'], tenta: ['loquesea'] },
  { id: 'achuras', nombre: 'Picada de achuras', cat: 'parrilla', precio: 12400, descuento: 0, desc: 'Chinchulines, mollejas y morcilla para arrancar mientras se hace la carne.', tags: ['sintacc', 'compartir'], momento: ['cena'], hambre: ['normal'], tenta: ['carne'] },

  { id: 'ravioles', nombre: 'Ravioles de ricota y nuez', cat: 'pastas', precio: 13400, descuento: 0, desc: 'Masa fina hecha el mismo día. Van con la salsa que elijas: fileto, crema o mixta.', tags: ['vegetariano'], badge: 'El más pedido', destacado: true, momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['pastapizza'] },
  { id: 'sorrentinos', nombre: 'Sorrentinos de jamón y queso', cat: 'pastas', precio: 14900, descuento: 0, desc: 'Grandes, rellenos hasta el borde. Pedilos con salsa rosa y no preguntes más.', tags: [], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'noquis', nombre: 'Ñoquis caseros', cat: 'pastas', precio: 11800, descuento: 0, desc: 'De papa, livianos, hechos a la mañana. Los 29 hay que reservar mesa.', tags: ['vegetariano'], momento: ['almuerzo'], hambre: ['normal'], tenta: ['pastapizza'] },
  { id: 'tallarines', nombre: 'Tallarines al huevo', cat: 'pastas', precio: 11200, descuento: 0, desc: 'Cortados anchos, con tuco de domingo cocinado tres horas.', tags: ['vegetariano'], momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['pastapizza'] },
  { id: 'lasagna', nombre: 'Lasaña de carne', cat: 'pastas', precio: 15600, descuento: 0, desc: 'Capas de pasta, boloñesa y bechamel, gratinada en la fuente hasta el borde.', tags: [], momento: ['almuerzo', 'cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'canelones', nombre: 'Canelones de verdura', cat: 'pastas', precio: 13900, descuento: 0, desc: 'Rellenos de acelga y ricota, con salsa mixta y una nube de queso rallado.', tags: ['vegetariano'], momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['pastapizza'] },

  { id: 'muzza', nombre: 'Pizza de muzzarella', cat: 'pizzas', precio: 13900, descuento: 0, desc: 'Molde alto, muzza generosa y aceitunas verdes. Ocho porciones que rinden.', tags: ['vegetariano', 'compartir'], badge: 'El más pedido', destacado: true, momento: ['cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'fugazzeta', nombre: 'Fugazzeta rellena', cat: 'pizzas', precio: 18400, descuento: 0, desc: 'Dos tapas de masa con queso adentro y cebolla arriba. Se comparte, sí o sí.', tags: ['vegetariano', 'compartir'], destacado: true, momento: ['cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'napolitana-pizza', nombre: 'Pizza napolitana', cat: 'pizzas', precio: 15200, descuento: 0, desc: 'Rodajas de tomate, ajo y perejil sobre la muzzarella. Clásica de mostrador.', tags: ['vegetariano', 'compartir'], momento: ['cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'calabresa', nombre: 'Pizza de calabresa', cat: 'pizzas', precio: 16800, descuento: 0, desc: 'Longaniza calabresa fina y morrones asados. Pica lo justo.', tags: ['compartir'], momento: ['cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'especial', nombre: 'Pizza especial', cat: 'pizzas', precio: 17500, descuento: 0, desc: 'Jamón, morrón y aceitunas. La que pide la mesa cuando nadie se pone de acuerdo.', tags: ['compartir'], momento: ['cena'], hambre: ['mucha'], tenta: ['pastapizza'] },
  { id: 'rucula', nombre: 'Pizza de rúcula y jamón crudo', cat: 'pizzas', precio: 19200, descuento: 0, desc: 'Se arma al salir del horno para que la rúcula quede fresca y el crudo tibio.', tags: ['compartir'], momento: ['cena'], hambre: ['normal'], tenta: ['pastapizza'] },

  { id: 'puchero', nombre: 'Puchero de la casa', cat: 'bodegon', precio: 17900, descuento: 0, desc: 'Carne, zapallo, choclo, garbanzos y el caldo aparte. Plato de domingo de lluvia.', tags: ['sintacc'], badge: 'De la casa', destacado: true, momento: ['almuerzo'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'mila-napo-xl', nombre: 'Milanesa napolitana para dos', cat: 'bodegon', precio: 26500, descuento: 0, desc: 'Una sola milanesa que ocupa la fuente entera, con papas y dos platos.', tags: ['compartir'], destacado: true, momento: ['cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'lengua', nombre: 'Lengua a la vinagreta', cat: 'bodegon', precio: 13800, descuento: 0, desc: 'Cortada finita, con vinagreta de huevo y morrón. De las que ya casi no se piden.', tags: ['sintacc'], momento: ['almuerzo'], hambre: ['normal'], tenta: ['carne'] },
  { id: 'matambre-pizza', nombre: 'Matambre a la pizza', cat: 'bodegon', precio: 18900, descuento: 0, desc: 'Tierno, con salsa, muzzarella y orégano, gratinado a último momento.', tags: ['compartir'], momento: ['cena'], hambre: ['mucha'], tenta: ['carne'] },
  { id: 'mondongo', nombre: 'Mondongo a la española', cat: 'bodegon', precio: 14200, descuento: 0, desc: 'Con garbanzos y chorizo colorado, cocinado despacio desde la mañana.', tags: ['sintacc'], momento: ['almuerzo'], hambre: ['mucha'], tenta: ['loquesea'] },
  { id: 'pollo-verdeo', nombre: 'Pollo al verdeo', cat: 'bodegon', precio: 15400, descuento: 0, desc: 'Suprema en salsa de verdeo y crema, con puré de papas de guarnición.', tags: ['sintacc'], momento: ['almuerzo', 'cena'], hambre: ['normal'], tenta: ['carne'] }
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const imgDe = p => getCategoria(p.cat)?.img || 'images/hero.webp';
const altDe = p => getCategoria(p.cat)?.alt || p.nombre;
const ETIQUETAS = { vegetariano: 'Vegetariano', sintacc: 'Sin TACC', compartir: 'Para compartir' };

const Cart = {
  KEY: 'ajdulcinea_comanda',
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
    const p = getProducto(id);
    if (qty < 1) { this.remove(id); return; }
    it.qty = Math.min(qty, p?.stock ?? 99); this.save(items);
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
    el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function ctrlHTML(p) {
  const qty = Cart.get().find(i => i.id === p.id)?.qty || 0;
  if (!qty) {
    return '<button type="button" class="ctrl-add" data-add="' + p.id + '" aria-label="Agregar ' + esc(p.nombre) + ' a la comanda">+</button>';
  }
  return '<div class="ctrl-step">' +
    '<button type="button" data-qstep="-1" data-id="' + p.id + '" aria-label="Sacar uno de ' + esc(p.nombre) + '">&minus;</button>' +
    '<span>' + qty + '</span>' +
    '<button type="button" data-qstep="1" data-id="' + p.id + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button>' +
  '</div>';
}

function syncCtrls() {
  document.querySelectorAll('[data-ctrl]').forEach(el => {
    const p = getProducto(el.getAttribute('data-ctrl'));
    if (p) el.innerHTML = ctrlHTML(p);
  });
}
document.addEventListener('cart:updated', syncCtrls);

function tagsHTML(p) {
  if (!p.tags || !p.tags.length) return '';
  const extra = p.badge ? '<span class="tag tag-top">' + esc(p.badge) + '</span>' : '';
  return '<div class="dish-tags">' + extra + p.tags.map(t => '<span class="tag">' + esc(ETIQUETAS[t] || t) + '</span>').join('') + '</div>';
}

function dishHTML(p) {
  return '<article class="dish" data-animate style="transform:translateY(18px);opacity:0">' +
    '<button type="button" class="dish-open" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '"></button>' +
    '<div class="dish-thumb"><img src="' + imgDe(p) + '" alt="' + esc(altDe(p)) + '" width="600" height="600" decoding="async"></div>' +
    '<div class="dish-main">' +
      '<div class="dish-top">' +
        '<h3 class="dish-name">' + esc(p.nombre) + '</h3>' +
        '<span class="dish-dots" aria-hidden="true"></span>' +
        '<span class="dish-precio">' + formatearPrecio(precioFinal(p)) + '</span>' +
      '</div>' +
      '<p class="dish-desc">' + esc(p.desc) + '</p>' +
      tagsHTML(p) +
    '</div>' +
    '<div class="ctrl" data-ctrl="' + p.id + '">' + ctrlHTML(p) + '</div>' +
  '</article>';
}

function pillHTML(p, extra) {
  return '<article class="pill" data-flip-id="' + p.id + '" data-animate style="transform:translateY(22px) scale(.97);opacity:0">' +
    '<div class="pill-media">' +
      '<img src="' + imgDe(p) + '" alt="' + esc(altDe(p)) + '" width="900" height="675" decoding="async">' +
      '<button type="button" class="pill-open" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '"></button>' +
      (p.badge ? '<span class="pill-badge">' + esc(p.badge) + '</span>' : '') +
    '</div>' +
    '<div class="pill-body">' +
      '<span class="pill-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
      '<h3 class="pill-name">' + esc(p.nombre) + '</h3>' +
      (extra || '') +
      '<div class="pill-foot">' +
        '<span class="pill-precio">' + formatearPrecio(precioFinal(p)) + '</span>' +
        '<div class="ctrl" data-ctrl="' + p.id + '">' + ctrlHTML(p) + '</div>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function initCategorias() {
  const grid = document.getElementById('catsGrid');
  if (grid) {
    grid.innerHTML = CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return '<a class="cat-card" href="#carta-completa" data-goto-cat="' + c.id + '" data-animate style="clip-path:inset(0 0 100% 0);opacity:0">' +
        '<div class="cat-media"><img src="' + c.img + '" alt="' + esc(c.alt) + '" width="1200" height="900" decoding="async"></div>' +
        '<div class="cat-body"><span class="cat-name">' + esc(c.nombre) + '</span><span class="cat-count">' + n + ' platos</span></div>' +
      '</a>';
    }).join('');
  }
  const chips = document.getElementById('heroChips');
  if (chips) {
    chips.innerHTML = CATEGORIAS.map(c => '<li><a class="hero-chip" href="#carta-completa" data-goto-cat="' + c.id + '">' + esc(c.nombre) + '</a></li>').join('');
  }
  const footer = document.getElementById('footerCats');
  if (footer) footer.innerHTML = CATEGORIAS.map(c => '<li><a href="#carta-completa" data-goto-cat="' + c.id + '">' + esc(c.nombre) + '</a></li>').join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('rail');
  if (!track || !vp) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => pillHTML(p)).join('');

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
  const paso = () => Math.max(230, vp.clientWidth * 0.72);
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

const estado = { q: '', cat: 'all', apto: 'all', orden: 'destacados', visibles: 16 };
const PASO_CARTA = 16;

function filtrar() {
  const q = normalizar(estado.q).trim();
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (estado.apto !== 'all' && !(p.tags || []).includes(estado.apto)) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, (p.tags || []).map(t => ETIQUETAS[t]).join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function renderCarta() {
  const grid = document.getElementById('cartaGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const resultados = document.getElementById('resultados');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;
  const lista = filtrar();
  grid.innerHTML = lista.slice(0, estado.visibles).map(p => dishHTML(p)).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= estado.visibles;
  if (resultados) resultados.textContent = lista.length === 1 ? '1 plato' : lista.length + ' platos';
  const filtrado = estado.q !== '' || estado.cat !== 'all' || estado.apto !== 'all' || estado.orden !== 'destacados';
  if (limpiar) limpiar.hidden = !filtrado;
  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCarta() {
  const grid = document.getElementById('cartaGrid');
  const chips = document.getElementById('chips');
  if (!grid || !chips) return;

  chips.innerHTML = '<button type="button" class="chip on" data-chip="all">Toda la carta</button>' +
    CATEGORIAS.map(c => '<button type="button" class="chip" data-chip="' + c.id + '">' + esc(c.nombre) + '</button>').join('');

  const setChip = id => {
    estado.cat = id;
    chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('on', b.getAttribute('data-chip') === id));
    estado.visibles = PASO_CARTA;
    renderCarta();
  };
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (b) setChip(b.getAttribute('data-chip'));
  });

  const buscador = document.getElementById('buscador');
  let t;
  buscador?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscador.value; estado.visibles = PASO_CARTA; renderCarta(); }, 160);
  });
  document.getElementById('filtroApto')?.addEventListener('change', e => {
    estado.apto = e.target.value; estado.visibles = PASO_CARTA; renderCarta();
  });
  document.getElementById('orden')?.addEventListener('change', e => {
    estado.orden = e.target.value; estado.visibles = PASO_CARTA; renderCarta();
  });
  document.getElementById('verMas')?.addEventListener('click', () => {
    estado.visibles += PASO_CARTA; renderCarta();
  });

  const limpiarTodo = () => {
    estado.q = ''; estado.cat = 'all'; estado.apto = 'all'; estado.orden = 'destacados'; estado.visibles = PASO_CARTA;
    if (buscador) buscador.value = '';
    const fa = document.getElementById('filtroApto'); if (fa) fa.value = 'all';
    const or = document.getElementById('orden'); if (or) or.value = 'destacados';
    chips.querySelectorAll('.chip').forEach(b => b.classList.toggle('on', b.getAttribute('data-chip') === 'all'));
    renderCarta();
  };
  document.getElementById('limpiar')?.addEventListener('click', limpiarTodo);
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarTodo);

  renderCarta();

  document.addEventListener('click', e => {
    const link = e.target.closest('[data-goto-cat]');
    if (!link) return;
    const cat = link.getAttribute('data-goto-cat');
    if (!getCategoria(cat)) return;
    setChip(cat);
    const destino = document.getElementById('carta-completa');
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = getProducto(add.getAttribute('data-add'));
    if (!p) return;
    Cart.add(p, 1);
    showToast('Sumado a la comanda: ' + p.nombre);
    return;
  }
  const step = e.target.closest('[data-qstep]');
  if (step) {
    const id = step.getAttribute('data-id');
    const actual = Cart.get().find(i => i.id === id)?.qty || 0;
    Cart.setQty(id, actual + parseInt(step.getAttribute('data-qstep'), 10));
    return;
  }
  const ver = e.target.closest('[data-ver]');
  if (ver) abrirQuickView(ver.getAttribute('data-ver'), ver);
});

const PREGUNTAS = [
  {
    clave: 'momento', titulo: '¿Para qué momento?',
    opciones: [
      { v: 'desayuno', l: 'Desayuno o merienda', e: '☕' },
      { v: 'almuerzo', l: 'Almuerzo', e: '🍽️' },
      { v: 'cena', l: 'Cena', e: '🌙' },
      { v: 'postre', l: 'Solo un postre', e: '🍰' }
    ]
  },
  {
    clave: 'hambre', titulo: '¿Con cuánta hambre venís?',
    opciones: [
      { v: 'liviano', l: 'Algo liviano', e: '🍃' },
      { v: 'normal', l: 'Lo normal', e: '👌' },
      { v: 'mucha', l: 'Vengo con todo', e: '🔥' }
    ]
  },
  {
    clave: 'tenta', titulo: '¿Con qué te tentás?',
    opciones: [
      { v: 'carne', l: 'Carne', e: '🥩' },
      { v: 'pastapizza', l: 'Pasta o pizza', e: '🍕' },
      { v: 'dulce', l: 'Algo dulce', e: '🍮' },
      { v: 'loquesea', l: 'Lo que salga', e: '🎲' }
    ]
  }
];

const respuestas = {};
let pasoGanas = 0;

function puntaje(p) {
  let s = 0;
  if (respuestas.momento && (p.momento || []).includes(respuestas.momento)) s += 3;
  if (respuestas.hambre && (p.hambre || []).includes(respuestas.hambre)) s += 2;
  if (respuestas.tenta) {
    if (respuestas.tenta === 'loquesea') s += 1;
    else if ((p.tenta || []).includes(respuestas.tenta)) s += 3;
  }
  if (p.destacado) s += 0.5;
  return s;
}

function porqueDe(p) {
  const razones = [];
  const etTenta = { carne: 'es carne', pastapizza: 'pasta o pizza', dulce: 'bien dulce' };
  const etMomento = { desayuno: 'para la mañana', almuerzo: 'para el mediodía', cena: 'para la noche', postre: 'para cerrar' };
  if (respuestas.tenta && respuestas.tenta !== 'loquesea' && (p.tenta || []).includes(respuestas.tenta)) razones.push(etTenta[respuestas.tenta]);
  if (p.badge) razones.push(p.badge.toLowerCase());
  if ((p.tags || []).includes('compartir')) razones.push('alcanza para compartir');
  if (respuestas.momento && (p.momento || []).includes(respuestas.momento)) razones.push(etMomento[respuestas.momento]);
  if (respuestas.hambre === 'mucha' && (p.hambre || []).includes('mucha')) razones.push('llena de verdad');
  if (respuestas.hambre === 'liviano' && (p.hambre || []).includes('liviano')) razones.push('liviano');
  if ((p.tags || []).includes('vegetariano')) razones.push('vegetariano');
  if ((p.tags || []).includes('sintacc')) razones.push('sin TACC');
  return 'Elegido por: ' + (razones.slice(0, 2).join(' + ') || 'lo que más sale');
}

function volarChip(chip, slot) {
  if (reduceMotion) return;
  const target = document.querySelector('.comanda-linea[data-slot="' + slot + '"] b');
  if (!target) return;
  const from = chip.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const clon = chip.cloneNode(true);
  clon.className = 'gana-chip gana-vuela';
  clon.style.left = from.left + 'px';
  clon.style.top = from.top + 'px';
  clon.style.width = from.width + 'px';
  clon.style.height = from.height + 'px';
  document.body.appendChild(clon);
  requestAnimationFrame(() => {
    clon.style.transform = 'translate(' + (to.left - from.left) + 'px,' + (to.top - from.top + 4) + 'px) scale(.35)';
    clon.style.opacity = '0';
  });
  setTimeout(() => clon.remove(), 700);
}

function renderComanda() {
  PREGUNTAS.forEach((preg, i) => {
    const linea = document.querySelector('.comanda-linea[data-slot="' + i + '"]');
    if (!linea) return;
    const val = respuestas[preg.clave];
    const op = preg.opciones.find(o => o.v === val);
    linea.querySelector('b').textContent = op ? op.l : '—';
    linea.classList.toggle('lleno', !!op);
  });
  const reset = document.getElementById('ganasReset');
  if (reset) reset.hidden = pasoGanas === 0;
}

function renderPregunta() {
  const cont = document.getElementById('ganasPregunta');
  if (!cont) return;
  if (pasoGanas >= PREGUNTAS.length) {
    cont.innerHTML = '<h3>Listo. Esto te dejamos.</h3><p class="ganas-lead">Si no te convence, cambiá una respuesta y se rearma solo.</p>';
    return;
  }
  const preg = PREGUNTAS[pasoGanas];
  cont.innerHTML = '<h3>' + esc(preg.titulo) + '</h3><div class="ganas-opciones">' +
    preg.opciones.map(o => '<button type="button" class="gana-chip" data-gana="' + o.v + '"><span class="emo" aria-hidden="true">' + o.e + '</span>' + esc(o.l) + '</button>').join('') +
    '</div>';
}

function renderResultado() {
  const cont = document.getElementById('ganasResultado');
  if (!cont) return;
  if (pasoGanas === 0) { cont.hidden = true; cont.innerHTML = ''; return; }
  const top = [...PRODUCTOS].map(p => ({ p, s: puntaje(p) })).sort((a, b) => b.s - a.s).slice(0, 3);
  cont.hidden = false;
  cont.innerHTML = '<div class="ganas-res-head"><h3>' + (pasoGanas >= PREGUNTAS.length ? 'Tu selección' : 'Por ahora, esto') + '</h3>' +
    '<a class="rail-all" href="#carta-completa">Ver más como estos</a></div>' +
    '<div class="ganas-res-grid">' + top.map(x => pillHTML(x.p, '<span class="ganas-porque">' + esc(porqueDe(x.p)) + '</span>')).join('') + '</div>';
  cont.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
}

function actualizarGanas() {
  const cont = document.getElementById('ganasResultado');
  const prev = new Map();
  cont?.querySelectorAll('[data-flip-id]').forEach(el => prev.set(el.getAttribute('data-flip-id'), el.getBoundingClientRect()));
  renderResultado();
  renderComanda();
  renderPregunta();
  if (reduceMotion || !cont) return;
  cont.querySelectorAll('[data-flip-id]').forEach(el => {
    const old = prev.get(el.getAttribute('data-flip-id'));
    const now = el.getBoundingClientRect();
    if (old) {
      const dx = old.left - now.left, dy = old.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.style.transition = 'none';
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      requestAnimationFrame(() => {
        el.style.transition = 'transform .55s cubic-bezier(0.23,1,0.32,1)';
        el.style.transform = '';
      });
    } else {
      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px) scale(.95)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity .45s ease-out, transform .5s cubic-bezier(0.23,1,0.32,1)';
        el.style.opacity = '1';
        el.style.transform = '';
      });
    }
  });
}

function initGanas() {
  const panel = document.getElementById('ganasPregunta');
  if (!panel) return;
  renderPregunta();
  renderComanda();
  panel.addEventListener('click', e => {
    const chip = e.target.closest('[data-gana]');
    if (!chip || pasoGanas >= PREGUNTAS.length) return;
    respuestas[PREGUNTAS[pasoGanas].clave] = chip.getAttribute('data-gana');
    volarChip(chip, pasoGanas);
    pasoGanas++;
    actualizarGanas();
  });
  document.getElementById('ganasReset')?.addEventListener('click', () => {
    PREGUNTAS.forEach(p => delete respuestas[p.clave]);
    pasoGanas = 0;
    actualizarGanas();
  });
}

const VISTOS_KEY = 'ajdulcinea_vistos';
function guardarVisto(id) {
  try {
    const prev = JSON.parse(localStorage.getItem(VISTOS_KEY)) || [];
    localStorage.setItem(VISTOS_KEY, JSON.stringify([id, ...prev.filter(x => x !== id)].slice(0, 8)));
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
  const titulo = vistos.length >= 2 ? 'Lo último que miraste' : 'De la misma sección';
  return '<div class="qv-relacionados"><h4>' + titulo + '</h4><div class="qv-rel-grid">' +
    lista.map(r => '<button type="button" class="qv-rel" data-ver="' + r.id + '">' +
      '<img src="' + imgDe(r) + '" alt="" width="104" height="104" decoding="async">' +
      '<span><b>' + esc(r.nombre) + '</b><span>' + formatearPrecio(precioFinal(r)) + '</span></span>' +
    '</button>').join('') + '</div></div>';
}

function abrirQuickView(id, origen) {
  const p = getProducto(id);
  if (!p || !modal || !qvPanel) return;
  qvUltimoFoco = origen || document.activeElement;
  const tags = (p.tags || []).map(t => '<span class="tag">' + esc(ETIQUETAS[t] || t) + '</span>').join('');
  qvPanel.innerHTML =
    '<button type="button" class="qv-close" id="qvClose" aria-label="Cerrar">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
    '</button>' +
    '<div class="qv">' +
      '<div class="qv-media"><img src="' + imgDe(p) + '" alt="' + esc(altDe(p)) + '" width="1200" height="1200" decoding="async"></div>' +
      '<div class="qv-body">' +
        '<span class="qv-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
        '<h2 class="qv-nombre" id="qvNombre">' + esc(p.nombre) + '</h2>' +
        '<p class="qv-desc">' + esc(p.desc) + '</p>' +
        (tags ? '<div class="qv-tags">' + (p.badge ? '<span class="tag tag-top">' + esc(p.badge) + '</span>' : '') + tags + '</div>' : '') +
        '<p class="qv-precio">' + formatearPrecio(precioFinal(p)) + '</p>' +
        '<div class="qv-actions">' +
          '<div class="ctrl" data-ctrl="' + p.id + '">' + ctrlHTML(p) + '</div>' +
          '<button type="button" class="btn btn-cta" data-pedir="' + p.id + '">Sumar y ver la comanda</button>' +
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
  qvPanel.addEventListener('click', e => {
    if (e.target.closest('#qvClose')) { cerrarQuickView(); return; }
    const pedir = e.target.closest('[data-pedir]');
    if (pedir) {
      const p = getProducto(pedir.getAttribute('data-pedir'));
      if (p) { Cart.add(p, 1); cerrarQuickView(); abrirDrawer(); }
    }
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
    body.innerHTML = '<div class="cart-vacio"><span class="vacio-ico" aria-hidden="true">📝</span>' +
      '<h3>La comanda está vacía</h3>' +
      '<p>Agregá lo que quieras de la carta y después decidís si es para la mesa o para tu casa.</p>' +
      '<button type="button" class="btn btn-cta" data-cerrar-drawer>Abrir la carta</button></div>';
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
        '<p class="ci-meta">' + formatearPrecio(precioFinal(p)) + ' c/u</p>' +
        '<div class="ctrl" data-ctrl="' + p.id + '">' + ctrlHTML(p) + '</div>' +
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
      return p ? '• ' + p.nombre + ' x' + i.qty : '';
    }).filter(Boolean).join('\n');
    wspBtn.href = wsp('Hola A.J. Dulcinea, va la comanda:\n' + detalle + '\n\nTotal estimado: ' + formatearPrecio(Cart.total()) + '\n¿Es para el salón (mesa N.º) o delivery a:');
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
      document.getElementById('carta-completa')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const p = getProducto(del.getAttribute('data-del'));
      Cart.remove(del.getAttribute('data-del'));
      showToast('Sacamos ' + (p?.nombre || 'el plato') + ' de la comanda');
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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-photo img', { scale: 1.12, duration: 1.3, ease: 'power2.out' }, 0)
    .from('.hero-photo', { clipPath: 'inset(0 0 0 100%)', duration: 1, ease: 'power3.inOut' }, 0)
    .from('.hero-eyebrow', { y: 14, opacity: 0, duration: .55 }, 0.15)
    .from('.hero-title', { y: 30, opacity: 0, duration: .85 }, 0.24)
    .from('.hero-lead', { y: 20, opacity: 0, duration: .75 }, 0.38)
    .from('.hero-cta > *', { y: 16, opacity: 0, duration: .55, stagger: .08 }, 0.5)
    .from('.hero-chips li', { y: 12, opacity: 0, duration: .45, stagger: .05 }, 0.62)
    .from('.hero-tag', { x: -24, opacity: 0, duration: .6 }, 0.7)
    .from('.hero-sello', { scale: .6, rotate: -40, opacity: 0, duration: .7, ease: 'back.out(1.7)' }, 0.8);
}

function initSecciones() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.utils.toArray('.sec-title').forEach(el => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, yPercent: 16, opacity: 0, duration: .8, ease: 'power3.out' });
  });
  gsap.utils.toArray('.pedir-pasos li').forEach((el, i) => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 92%' }, x: -22, opacity: 0, duration: .65, delay: i * 0.05, ease: 'power2.out' });
  });
  gsap.utils.toArray('.salon-list li').forEach((el, i) => {
    gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 94%' }, x: 18, opacity: 0, duration: .6, delay: i * 0.06, ease: 'power2.out' });
  });
  gsap.to('.cierre-word', {
    scrollTrigger: { trigger: '.cierre', start: 'top bottom', end: 'bottom bottom', scrub: true },
    yPercent: -12, ease: 'none'
  });
  gsap.to('.salon-fig-a img', {
    scrollTrigger: { trigger: '.salon-fig-a', start: 'top bottom', end: 'bottom top', scrub: true },
    yPercent: 6, ease: 'none'
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
initCarta();
initGanas();
initReveals();
initNav();
initQuickView();
initDrawer();
initFloats();
initHero();
initSecciones();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();
