document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491157497679';

const CATEGORIAS = [
  { id: 'algodones', nombre: 'Algodones de azúcar', bajada: 'Cuatro sabores, hilados al momento', img: 'images/cat-algodones.webp', alt: 'Bolsas de algodón de azúcar de colores apiladas' },
  { id: 'pochoclos', nombre: 'Pochoclos', bajada: 'Dulce, salado, caramelo y chocolate', img: 'images/cat-pochoclos.webp', alt: 'Bowls con pochoclos de distintos sabores' },
  { id: 'bolsitas', nombre: 'Bolsitas golosineras', bajada: 'Con el nombre de cada invitado', img: 'images/cat-bolsitas.webp', alt: 'Vasitos golosineros rosas sobre una mesa de cumpleaños' },
  { id: 'combos', nombre: 'Combos para fiestas', bajada: 'Todo junto, según cuánta gente viene', img: 'images/cat-combos.webp', alt: 'Mesa dulce armada con copas golosineras y bandeja de golosinas' },
];

const PRODUCTOS = [
  { id: 'algodon-rosa', nombre: 'Algodón de azúcar frutilla', cat: 'algodones', precio: 2900, descuento: 0, stock: 60, destacado: 1, badge: '',
    img: 'images/p-algodon-rosa.webp', alt: 'Algodón de azúcar rosa embolsado, sostenido al aire libre',
    desc: 'El clásico rosa de siempre: azúcar de frutilla hilada al momento y embolsada apenas sale de la máquina. Palito de madera y bolsa transparente.',
    tags: ['frutilla', 'rosa', 'clasico', 'palito'], perfil: ['algodones', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'algodon-celeste', nombre: 'Algodón de azúcar tutti frutti', cat: 'algodones', precio: 2900, descuento: 0, stock: 60, destacado: 4, badge: '',
    img: 'images/p-algodon-celeste.webp', alt: 'Algodón de azúcar celeste embolsado, sostenido al aire libre',
    desc: 'El celeste que se llevan todos los chicos. Tutti frutti bien suave, del mismo tamaño que el de frutilla.',
    tags: ['tutti frutti', 'celeste', 'azul', 'palito'], perfil: ['algodones', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'algodon-uva', nombre: 'Algodón de azúcar uva', cat: 'algodones', precio: 3100, descuento: 0, stock: 40, destacado: 0, badge: 'Nuevo',
    img: 'images/p-algodon-uva.webp', alt: 'Algodón de azúcar violeta embolsado',
    desc: 'Violeta intenso y gusto a uva de verdad. Es el que más piden en los cumples de más grandes.',
    tags: ['uva', 'violeta', 'morado'], perfil: ['algodones', 'quince-egreso', '30-50', 'mas-60'] },

  { id: 'algodon-limon', nombre: 'Algodón de azúcar limón', cat: 'algodones', precio: 3100, descuento: 0, stock: 40, destacado: 0, badge: '',
    img: 'images/p-algodon-limon.webp', alt: 'Algodones de azúcar amarillo y verde embolsados',
    desc: 'Amarillo, ácido y liviano. Va bien cuando ya hay mucha cosa dulce en la mesa.',
    tags: ['limon', 'amarillo', 'citrico'], perfil: ['algodones', 'kermes-evento', '30-50', 'mas-60'] },

  { id: 'algodon-nube', nombre: 'Copo gigante Nube (porción doble)', cat: 'algodones', precio: 4800, descuento: 0, stock: 25, destacado: 0, badge: '',
    img: 'images/p-algodon-nube.webp', alt: 'Bolsa grande de algodón de azúcar rosa',
    desc: 'El doble de azúcar en un solo palito. Es el que se saca en las fotos: no entra en una mano sola.',
    tags: ['gigante', 'doble', 'nube', 'grande'], perfil: ['algodones', 'cumple-infantil', 'hasta-20', 'quince-egreso'] },

  { id: 'algodon-pack', nombre: 'Algodones en bolsa x 6', cat: 'algodones', precio: 16500, descuento: 12, stock: 20, destacado: 7, badge: '',
    img: 'images/p-algodon-pack.webp', alt: 'Varias bolsas de algodón de azúcar de distintos colores',
    desc: 'Seis copos ya embolsados, con los cuatro sabores mezclados. Llegan cerrados y aguantan la tarde entera.',
    tags: ['pack', 'seis', 'combo', 'surtido'], perfil: ['algodones', 'cumple-infantil', '30-50', 'mas-60', 'kermes-evento'] },

  { id: 'pochoclo-dulce', nombre: 'Pochoclo dulce clásico', cat: 'pochoclos', precio: 3400, descuento: 0, stock: 80, destacado: 0, badge: '',
    img: 'images/p-pochoclo-dulce.webp', alt: 'Pochoclos dulces saliendo de un cono de papel',
    desc: 'El de toda la vida: maíz reventado y azucarado en el momento, servido en cono de papel.',
    tags: ['dulce', 'clasico', 'cono'], perfil: ['pochoclos', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'pochoclo-manteca', nombre: 'Pochoclo salado con manteca', cat: 'pochoclos', precio: 3200, descuento: 0, stock: 80, destacado: 0, badge: '',
    img: 'images/p-pochoclo-manteca.webp', alt: 'Bowl blanco con pochoclos dorados con manteca',
    desc: 'Para los que no quieren dulce. Sal fina y manteca, revuelto todavía caliente.',
    tags: ['salado', 'manteca', 'sal'], perfil: ['pochoclos', 'kermes-evento', '30-50', 'mas-60'] },

  { id: 'pochoclo-caramelo', nombre: 'Pochoclo con caramelo', cat: 'pochoclos', precio: 4200, descuento: 0, stock: 55, destacado: 2, badge: '',
    img: 'images/p-pochoclo-caramelo.webp', alt: 'Bowl azul lleno de pochoclos bañados en caramelo',
    desc: 'Caramelo tirado sobre el pochoclo tibio, que es cuando agarra parejo. Queda crocante hasta el final.',
    tags: ['caramelo', 'crocante', 'acaramelado'], perfil: ['pochoclos', 'cumple-infantil', '30-50', 'quince-egreso'] },

  { id: 'pochoclo-chocolate', nombre: 'Pochoclo bañado en chocolate', cat: 'pochoclos', precio: 4900, descuento: 0, stock: 45, destacado: 8, badge: 'Nuevo',
    img: 'images/p-pochoclo-chocolate.webp', alt: 'Bowls con pochoclos bañados en chocolate y pochoclos blancos',
    desc: 'Chocolate semiamargo por encima y unos minutos de heladera para que endurezca. El más pedido de los últimos meses.',
    tags: ['chocolate', 'bañado', 'semiamargo'], perfil: ['pochoclos', 'quince-egreso', 'hasta-20', '30-50'] },

  { id: 'pochoclo-mix', nombre: 'Pochoclo mix dulce y salado', cat: 'pochoclos', precio: 3900, descuento: 0, stock: 50, destacado: 0, badge: '',
    img: 'images/p-pochoclo-mix.webp', alt: 'Pochoclos dulces, salados y con cacao mezclados en un bowl',
    desc: 'Los tres sabores en el mismo bowl, para las mesas donde nunca se ponen de acuerdo.',
    tags: ['mix', 'surtido', 'dulce', 'salado'], perfil: ['pochoclos', 'kermes-evento', 'mas-60', '30-50'] },

  { id: 'pochoclo-conos', nombre: 'Conitos de pochoclo x 10', cat: 'pochoclos', precio: 12500, descuento: 10, stock: 30, destacado: 5, badge: '',
    img: 'images/p-pochoclo-conos.webp', alt: 'Cono de papel lleno de pochoclos con caramelo',
    desc: 'Diez conos individuales ya servidos y cerrados. Cada chico agarra el suyo y no hay que repartir nada.',
    tags: ['conos', 'individual', 'diez', 'porciones'], perfil: ['pochoclos', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'bolsita-clasica', nombre: 'Bolsita golosinera clásica', cat: 'bolsitas', precio: 3200, descuento: 0, stock: 120, destacado: 0, badge: '',
    img: 'images/p-bolsita-clasica.webp', alt: 'Bolsitas transparentes con bombones blancos y moño',
    desc: 'Bolsa transparente con moño y siete golosinas surtidas adentro. La que se lleva cada invitado al final.',
    tags: ['bolsita', 'clasica', 'moño', 'souvenir'], perfil: ['bolsitas', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'bolsita-nombre', nombre: 'Bolsita con el nombre del cumpleañero', cat: 'bolsitas', precio: 4100, descuento: 0, stock: 90, destacado: 3, badge: '',
    img: 'images/p-bolsita-nombre.webp', alt: 'Bolsita golosinera con etiqueta en forma de estrella',
    desc: 'Misma bolsita, con una etiqueta impresa con el nombre y la edad. Nos pasás los datos por WhatsApp y las imprimimos.',
    tags: ['personalizada', 'nombre', 'etiqueta', 'souvenir'], perfil: ['bolsitas', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'bolsita-premium', nombre: 'Bolsita golosinera premium', cat: 'bolsitas', precio: 5400, descuento: 0, stock: 70, destacado: 0, badge: '',
    img: 'images/p-bolsita-premium.webp', alt: 'Golosinas surtidas: rueditas de regaliz, gomitas y bolitas de colores',
    desc: 'El doble de golosinas y con las que más salen: rueditas, gomitas ácidas y bolitas de colores.',
    tags: ['premium', 'gomitas', 'regaliz', 'surtida'], perfil: ['bolsitas', 'quince-egreso', '30-50', 'mas-60'] },

  { id: 'copa-golosinera', nombre: 'Copa golosinera', cat: 'bolsitas', precio: 4600, descuento: 0, stock: 50, destacado: 0, badge: '',
    img: 'images/p-copa-golosinera.webp', alt: 'Copa de vidrio llena de malvaviscos de colores pastel con moño',
    desc: 'Copa alta con malvaviscos pastel y moño de cinta. Queda parada en la mesa y sirve de decoración.',
    tags: ['copa', 'malvaviscos', 'pastel', 'decoracion'], perfil: ['bolsitas', 'quince-egreso', 'hasta-20', '30-50'] },

  { id: 'balde-golosinero', nombre: 'Balde golosinero', cat: 'bolsitas', precio: 5900, descuento: 0, stock: 45, destacado: 0, badge: '',
    img: 'images/p-balde-golosinero.webp', alt: 'Vasito de cartón rosa lleno de golosinas',
    desc: 'Vasito de cartón con impresión, cargado de golosinas surtidas. Aguanta más que la bolsita y no se vuelca.',
    tags: ['balde', 'vasito', 'carton'], perfil: ['bolsitas', 'cumple-infantil', 'hasta-20', 'kermes-evento'] },

  { id: 'chupetin', nombre: 'Chupetín arcoíris gigante', cat: 'bolsitas', precio: 3800, descuento: 0, stock: 60, destacado: 0, badge: '',
    img: 'images/p-chupetin.webp', alt: 'Chupetín arcoíris gigante con moño de colores',
    desc: 'De los que duran toda la tarde. Va con moño de cintas y funciona bien como premio de los juegos.',
    tags: ['chupetin', 'arcoiris', 'gigante', 'premio'], perfil: ['bolsitas', 'cumple-infantil', 'kermes-evento', 'hasta-20'] },

  { id: 'combo-peques', nombre: 'Combo Peques x 10', cat: 'combos', precio: 32000, descuento: 0, stock: 15, destacado: 0, badge: '',
    img: 'images/p-copa-malvaviscos.webp', alt: 'Copa golosinera con malvaviscos celestes y blancos',
    desc: '10 algodones, 10 conitos de pochoclo y 10 bolsitas clásicas. Alcanza justo para un cumple de jardín.',
    tags: ['combo', 'diez', 'peques', 'jardin'], perfil: ['combos', 'cumple-infantil', 'hasta-20'] },

  { id: 'combo-cumple', nombre: 'Combo Cumple x 20', cat: 'combos', precio: 58000, descuento: 0, stock: 12, destacado: 6, badge: '',
    img: 'images/p-combo-cumple.webp', alt: 'Golosinas surtidas de colores desplegadas sobre fondo blanco',
    desc: '20 algodones surtidos, 20 conitos de pochoclo dulce y 20 bolsitas con nombre. El paquete que más sale.',
    tags: ['combo', 'veinte', 'cumple', 'completo'], perfil: ['combos', 'cumple-infantil', 'hasta-20', '30-50'] },

  { id: 'mesa-dulce', nombre: 'Mesa dulce chica', cat: 'combos', precio: 78000, descuento: 0, stock: 8, destacado: 0, badge: '',
    img: 'images/p-mesa-dulce.webp', alt: 'Mesa dulce con copas golosineras, chupetín y bandeja de golosinas',
    desc: 'Dos copas golosineras, bandeja de golosinas, 20 algodones y pochoclo en bowls. Te la dejamos armada en la mesa.',
    tags: ['mesa dulce', 'armada', 'decoracion', 'bandeja'], perfil: ['combos', 'quince-egreso', '30-50', 'mas-60'] },

  { id: 'combo-kermes', nombre: 'Combo Kermés x 40', cat: 'combos', precio: 104000, descuento: 8, stock: 6, destacado: 0, badge: '',
    img: 'images/p-combo-kermes.webp', alt: 'Bandeja de madera con golosinas y bombones de colores',
    desc: '40 algodones, 40 porciones de pochoclo y bandeja de golosinas para reponer. Vamos con la máquina y servimos en el momento.',
    tags: ['kermes', 'evento', 'cuarenta', 'escuela'], perfil: ['combos', 'kermes-evento', 'cumple-infantil', 'mas-60', '30-50'] },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(new RegExp('[\u0300-\u036f]', 'g'), '');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);

const Cart = {
  KEY: 'coposmagicoos_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
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
  toast.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg><span>' + esc(msg) + '</span>';
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

/* ---------------------------------------------------------------- cards --- */
function cardHTML(p) {
  const final = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push('<span class="badge badge--off">-' + p.descuento + '%</span>');
  if (p.badge) badges.push('<span class="badge badge--new">' + esc(p.badge) + '</span>');
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s>'
    : '<strong>' + formatearPrecio(final) + '</strong>';
  return '<article class="card" data-id="' + p.id + '" data-flip-id="' + p.id + '" data-cat="' + p.cat + '" data-animate style="transform:translateY(34px);opacity:0">' +
    '<div class="card-media">' +
      (badges.length ? '<div class="badges">' + badges.join('') + '</div>' : '') +
      '<img src="' + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
      '<button type="button" class="card-ver" data-ver="' + p.id + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.6"/></svg>' +
        'Ver más' +
      '</button>' +
    '</div>' +
    '<div class="card-body">' +
      '<span class="card-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
      '<h3 class="card-name">' + esc(p.nombre) + '</h3>' +
      '<div class="card-price">' + precio + '</div>' +
      '<div class="prod-actions">' +
        '<div class="stepper" data-stepper="' + p.id + '">' +
          '<button type="button" data-step="-1" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
          '<span data-qty>1</span>' +
          '<button type="button" data-step="1" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button>' +
        '</div>' +
        '<button type="button" class="prod-add" data-add="' + p.id + '">Agregar</button>' +
        '<button type="button" class="prod-buy" data-buy="' + p.id + '">Comprar</button>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function qtyDe(id, scope) {
  if (!scope) return 1;
  const st = scope.querySelector('[data-stepper="' + id + '"] [data-qty]');
  return st ? Math.max(1, parseInt(st.textContent, 10) || 1) : 1;
}

/* --------------------------------------------------------- categorías --- */
function renderCategorias() {
  const cont = document.getElementById('cat-grid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c =>
    '<a class="cat-card" href="#tienda" data-cat-link="' + c.id + '" data-animate style="transform:translateY(30px) scale(.94);opacity:0">' +
      '<div class="cat-media"><img src="' + c.img + '" width="1200" height="900" alt="' + esc(c.alt) + '" decoding="async"></div>' +
      '<div class="cat-body">' +
        '<div><h3>' + esc(c.nombre) + '</h3><span>' + esc(c.bajada) + '</span></div>' +
        '<span class="cat-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
      '</div>' +
    '</a>'
  ).join('');
  cont.querySelectorAll('[data-cat-link]').forEach(a => {
    a.addEventListener('click', () => setCategoria(a.dataset.catLink));
  });
}

/* --------------------------------------------------------------- rail --- */
function renderRail() {
  const track = document.getElementById('rail-track');
  if (!track) return;
  const elegidos = PRODUCTOS.filter(p => p.destacado > 0).sort((a, b) => a.destacado - b.destacado).slice(0, 8);
  track.innerHTML = elegidos.map(p => cardHTML(p)).join('');
}

function initRail() {
  const vp = document.getElementById('rail-vp');
  const track = document.getElementById('rail-track');
  const prev = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  if (!vp || !track) return;

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

  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  const paso = () => {
    const card = track.querySelector('.card');
    return card ? card.getBoundingClientRect().width + 18 : 280;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

/* ------------------------------------------------------------ catálogo --- */
const PASO_CATALOGO = 16;
const estado = { cat: 'todas', q: '', orden: 'destacado', visibles: PASO_CATALOGO };

function filtrar() {
  const q = norm(estado.q.trim());
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (!q) return true;
    const heno = norm([p.nombre, p.desc, getCategoria(p.cat)?.nombre, p.tags.join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es-AR'));
  return lista;
}

function renderChipsCat() {
  const cont = document.getElementById('chips-cat');
  if (!cont) return;
  const items = [{ id: 'todas', nombre: 'Todo' }].concat(CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre })));
  cont.innerHTML = items.map(c =>
    '<button type="button" class="chip-cat" data-cat="' + c.id + '" aria-pressed="' + (estado.cat === c.id ? 'true' : 'false') + '">' + esc(c.nombre) + '</button>'
  ).join('');
  cont.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => setCategoria(b.dataset.cat)));
}

function setCategoria(cat) {
  estado.cat = cat;
  estado.visibles = PASO_CATALOGO;
  document.querySelectorAll('#chips-cat [data-cat]').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat ? 'true' : 'false'));
  renderCatalogo(true);
}

function renderCatalogo(animar) {
  const grid = document.getElementById('catalogo-grid');
  const vacio = document.getElementById('vacio');
  const conteo = document.getElementById('conteo');
  const verMas = document.getElementById('ver-mas');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = filtrar();
  const mostrar = lista.slice(0, estado.visibles);
  const flipear = animar && typeof Flip !== 'undefined' && typeof gsap !== 'undefined' && !reduceMotion && grid.children.length;
  const state = flipear ? Flip.getState(grid.children) : null;

  grid.innerHTML = mostrar.map(p => cardHTML(p)).join('');

  if (vacio) vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  if (conteo) {
    const filtrando = estado.cat !== 'todas' || estado.q.trim();
    conteo.textContent = filtrando
      ? lista.length + (lista.length === 1 ? ' producto encontrado' : ' productos encontrados')
      : 'Mostrando los ' + PRODUCTOS.length + ' productos';
  }
  if (limpiar) limpiar.hidden = !(estado.cat !== 'todas' || estado.q.trim());
  if (verMas) verMas.hidden = lista.length <= estado.visibles;

  if (flipear) {
    const tl = Flip.from(state, {
      duration: .5, ease: 'power2.inOut', stagger: .015, absolute: true,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .35 }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .92, duration: .25 }),
    });
    const cerrarFlip = () => {
      if (tl.progress() < 1) tl.progress(1);
      tl.kill();
      gsap.set(grid.children, { clearProps: 'all' });
    };
    tl.eventCallback('onComplete', cerrarFlip);
    setTimeout(cerrarFlip, 1400);
    grid.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  } else {
    revelarNuevos(grid);
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function initCatalogo() {
  renderChipsCat();
  renderCatalogo(false);

  const buscador = document.getElementById('buscador');
  let t = null;
  buscador?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = buscador.value; estado.visibles = PASO_CATALOGO; renderCatalogo(true); }, 180);
  });
  document.getElementById('orden')?.addEventListener('change', e => {
    estado.orden = e.target.value; estado.visibles = PASO_CATALOGO; renderCatalogo(true);
  });
  document.getElementById('ver-mas')?.addEventListener('click', () => {
    estado.visibles += PASO_CATALOGO; renderCatalogo(false);
  });
  const reset = () => {
    estado.cat = 'todas'; estado.q = ''; estado.visibles = PASO_CATALOGO;
    if (buscador) buscador.value = '';
    document.querySelectorAll('#chips-cat [data-cat]').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === 'todas' ? 'true' : 'false'));
    renderCatalogo(true);
  };
  document.getElementById('limpiar')?.addEventListener('click', reset);
  document.getElementById('vacio-reset')?.addEventListener('click', reset);
}

/* ------------------------------------------------- acciones delegadas --- */
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = step.parentElement.querySelector('[data-qty]');
      const val = Math.max(1, (parseInt(span.textContent, 10) || 1) + parseInt(step.dataset.step, 10));
      span.textContent = val;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(p.id, add.closest('.card') || add.closest('.modal')));
      showToast('¡Agregado! ' + p.nombre + ' ya está en tu carrito');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      const p = getProducto(buy.dataset.buy);
      if (!p) return;
      Cart.add(p, qtyDe(p.id, buy.closest('.card') || buy.closest('.modal')));
      abrirDrawer();
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) { abrirModal(ver.dataset.ver); return; }
    const card = e.target.closest('.card');
    if (card && !e.target.closest('button')) abrirModal(card.dataset.id);
  });
}

/* ------------------------------------------------------------- drawer --- */
let ultimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  const total = document.getElementById('drawer-total');
  const wsp = document.getElementById('drawer-wsp');
  if (!body) return;
  const items = Cart.get();

  if (!items.length) {
    body.innerHTML = '<div class="cart-vacio">' +
      '<span class="copo-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="#14103A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8l-1.4-8.6a2.6 2.6 0 0 0-5.2 0Z"/><path d="M12 3v3M6 6l2 2M18 6l-2 2M4 12h2M18 12h2"/></svg></span>' +
      '<h3>Todavía no elegiste nada</h3>' +
      '<p>Empezá por los más elegidos: los algodones y los conitos de pochoclo nunca fallan.</p>' +
      '<a class="btn btn--cta" href="#destacados" data-cerrar-drawer>Ver los más elegidos</a>' +
    '</div>';
    if (foot) foot.hidden = true;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return '<div class="cart-line">' +
        '<div class="cart-line-media"><img src="' + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
        '<div><h3>' + esc(p.nombre) + '</h3><span class="cart-line-price">' + formatearPrecio(precioFinal(p) * i.qty) + '</span></div>' +
        '<div class="cart-line-right">' +
          '<div class="stepper">' +
            '<button type="button" data-cart-step="-1" data-id="' + p.id + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
            '<span>' + i.qty + '</span>' +
            '<button type="button" data-cart-step="1" data-id="' + p.id + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button>' +
          '</div>' +
          '<button type="button" class="cart-remove" data-cart-remove="' + p.id + '">Quitar</button>' +
        '</div>' +
      '</div>';
    }).join('');
    if (foot) foot.hidden = false;
    if (total) total.textContent = formatearPrecio(Cart.total());
  }

  if (wsp) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? '• ' + p.nombre + ' x' + i.qty : '';
    }).filter(Boolean).join('\n');
    const msg = '¡Hola Copos Magicoos! Quiero consultar por este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total());
    wsp.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(msg);
  }
}

function abrirDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  ultimoFoco = document.activeElement;
  bd.hidden = false; dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer() {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  dr.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  renderDrawer();
  document.addEventListener('cart:updated', renderDrawer);
  document.getElementById('cart-open')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawer-close')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);

  document.getElementById('drawer-body')?.addEventListener('click', e => {
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === step.dataset.id);
      if (it) Cart.setQty(step.dataset.id, it.qty + parseInt(step.dataset.cartStep, 10));
      return;
    }
    const rm = e.target.closest('[data-cart-remove]');
    if (rm) { Cart.remove(rm.dataset.cartRemove); return; }
    if (e.target.closest('[data-cerrar-drawer]')) cerrarDrawer();
  });

  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (typeof confetti === 'function' && !reduceMotion) {
      confetti({ particleCount: 110, spread: 78, origin: { y: .72 }, colors: ['#00FFFF', '#FF00FF', '#FFFFFF', '#14103A'], disableForReducedMotion: true });
    }
  });
}

/* --------------------------------------------------------- vista rápida --- */
function abrirModal(id) {
  const p = getProducto(id);
  const bd = document.getElementById('modal-backdrop');
  const grid = document.getElementById('modal-grid');
  if (!p || !bd || !grid) return;
  if (bd.hidden) ultimoFoco = document.activeElement;

  const final = precioFinal(p);
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s><span class="badge badge--off">-' + p.descuento + '%</span>'
    : '<strong>' + formatearPrecio(final) + '</strong>';

  grid.innerHTML =
    '<div class="modal-media"><img src="' + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
    '<div class="modal-body">' +
      '<span class="card-cat">' + esc(getCategoria(p.cat)?.nombre || '') + '</span>' +
      '<h2 id="modal-title">' + esc(p.nombre) + '</h2>' +
      '<div class="modal-price">' + precio + '</div>' +
      '<p class="modal-desc">' + esc(p.desc) + '</p>' +
      '<div class="modal-tags">' + p.tags.slice(0, 4).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>' +
      '<div class="modal-actions">' +
        '<div class="stepper" data-stepper="' + p.id + '">' +
          '<button type="button" data-step="-1" aria-label="Quitar uno">−</button><span data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">+</button>' +
        '</div>' +
        '<button type="button" class="btn btn--cta" data-add="' + p.id + '">Agregar al carrito</button>' +
        '<button type="button" class="btn btn--ink" data-buy="' + p.id + '">Comprar ahora</button>' +
      '</div>' +
    '</div>';

  const mas = document.getElementById('modal-mas');
  const masGrid = document.getElementById('mas-grid');
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  if (mas && masGrid) {
    mas.hidden = relacionados.length === 0;
    masGrid.innerHTML = relacionados.map(r =>
      '<button type="button" class="mas-item" data-ver="' + r.id + '"><img src="' + r.img + '" width="1200" height="1200" alt="' + esc(r.alt) + '" decoding="async"><span>' + esc(r.nombre) + '</span></button>'
    ).join('');
  }

  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: 'https://gokywebs.com/demo/coposmagicoos/' + p.img, category: getCategoria(p.cat)?.nombre || '',
    brand: { '@type': 'Brand', name: 'Copos Magicoos' },
    offers: { '@type': 'Offer', price: final, priceCurrency: 'ARS', availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: 'https://gokywebs.com/demo/coposmagicoos/?producto=' + p.id },
  });

  bd.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
}

function cerrarModal() {
  const bd = document.getElementById('modal-backdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initModal() {
  document.getElementById('modal-close')?.addEventListener('click', cerrarModal);
  document.getElementById('modal-backdrop')?.addEventListener('click', e => {
    if (e.target === document.getElementById('modal-backdrop')) cerrarModal();
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) abrirModal(slug);
}

function initFocusTraps() {
  document.addEventListener('keydown', e => {
    const modalBd = document.getElementById('modal-backdrop');
    const drawer = document.getElementById('drawer');
    const abierto = (modalBd && !modalBd.hidden) ? document.getElementById('modal')
      : (drawer && !drawer.hidden) ? drawer : null;
    if (!abierto) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (modalBd && !modalBd.hidden) cerrarModal(); else cerrarDrawer();
      return;
    }
    if (e.key !== 'Tab') return;
    const foco = [...abierto.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => el.getClientRects().length > 0);
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* --------------------------------------------------- bloque interactivo --- */
const SELECCION = { ocasion: 'cumple-infantil', invitados: 'hasta-20', imperdible: 'algodones' };
const ETIQUETAS = {
  'cumple-infantil': 'un cumple infantil', 'quince-egreso': 'un quince o egresados', 'kermes-evento': 'una kermés o un evento',
  'hasta-20': 'hasta 20 invitados', '30-50': '30 a 50 invitados', 'mas-60': 'más de 60 invitados',
  algodones: 'algodón de azúcar', pochoclos: 'pochoclos', bolsitas: 'bolsitas golosineras',
};

function puntuar(p) {
  let s = 0;
  if (p.cat === SELECCION.imperdible) s += 2;
  if (p.perfil.includes(SELECCION.ocasion)) s += 1;
  if (p.perfil.includes(SELECCION.invitados)) s += (p.cat === 'combos' ? 2 : 1);
  return s;
}

function mejorDe(cat, usados) {
  return PRODUCTOS.filter(p => p.cat === cat && !usados.includes(p.id))
    .map(p => ({ p, s: puntuar(p) }))
    .sort((a, b) => b.s - a.s || a.p.precio - b.p.precio)[0]?.p || null;
}

function elegirPicks() {
  const principales = ['algodones', 'pochoclos', 'bolsitas'];
  const usados = [];
  const picks = [];
  const p1 = mejorDe(SELECCION.imperdible, usados);
  if (p1) { picks.push(p1); usados.push(p1.id); }
  const otras = principales.filter(c => c !== SELECCION.imperdible);
  const candidatos = otras.map(c => mejorDe(c, usados)).filter(Boolean).sort((a, b) => puntuar(b) - puntuar(a) || a.precio - b.precio);
  if (candidatos[0]) { picks.push(candidatos[0]); usados.push(candidatos[0].id); }
  const p3 = mejorDe('combos', usados);
  if (p3) picks.push(p3);
  else if (candidatos[1]) picks.push(candidatos[1]);
  return picks;
}

function porQue(p) {
  if (p.cat === SELECCION.imperdible) return 'Elegido por: ' + ETIQUETAS[SELECCION.imperdible];
  if (p.cat === 'combos') return 'Elegido por: ' + ETIQUETAS[SELECCION.invitados];
  return 'Elegido por: ' + ETIQUETAS[SELECCION.ocasion];
}

function renderPicks(conSwap) {
  const cont = document.getElementById('picks');
  const titulo = document.getElementById('resultado-titulo');
  const total = document.getElementById('resultado-total');
  if (!cont) return;
  const picks = elegirPicks();

  const pintar = () => {
    cont.innerHTML = picks.map(p =>
      '<article class="pick">' +
        '<div class="pick-media"><img src="' + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
        '<div class="pick-body">' +
          '<h4 class="pick-name">' + esc(p.nombre) + '</h4>' +
          '<p class="pick-why">' + esc(porQue(p)) + '</p>' +
          '<span class="pick-price">' + formatearPrecio(precioFinal(p)) + '</span>' +
          '<button type="button" class="pick-add" data-add="' + p.id + '">Agregar al carrito</button>' +
        '</div>' +
      '</article>'
    ).join('');
    cont.classList.remove('is-swapping');
  };

  if (conSwap && !reduceMotion) {
    cont.classList.add('is-swapping');
    setTimeout(pintar, 170);
  } else {
    pintar();
  }

  if (titulo) titulo.textContent = 'Tu mesa para ' + ETIQUETAS[SELECCION.ocasion] + ' de ' + ETIQUETAS[SELECCION.invitados];
  if (total) total.innerHTML = formatearPrecio(picks.reduce((s, p) => s + precioFinal(p), 0)) + '<small>Total de los tres</small>';
  document.getElementById('armar-add')?.setAttribute('data-picks', picks.map(p => p.id).join(','));
}

function initArmar() {
  renderPicks(false);
  document.querySelectorAll('.chips[data-grupo]').forEach(grupo => {
    grupo.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      grupo.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      SELECCION[grupo.dataset.grupo] = chip.dataset.valor;
      renderPicks(true);
    });
  });
  document.getElementById('armar-add')?.addEventListener('click', e => {
    const ids = (e.currentTarget.getAttribute('data-picks') || '').split(',').filter(Boolean);
    ids.forEach(id => { const p = getProducto(id); if (p) Cart.add(p, 1); });
    showToast('¡Listo! Sumamos los tres a tu carrito');
    abrirDrawer();
  });
  document.getElementById('armar-ver')?.addEventListener('click', () => {
    setCategoria(SELECCION.imperdible);
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}

/* ------------------------------------------------------------- reveals --- */
let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.06, .48) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = Math.min(i * 0.12, 0.72) + 's';
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

/* ----------------------------------------------------------------- nav --- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop';
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

/* ------------------------------------------------------------ flotantes --- */
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

/* ----------------------------------------------------------------- hero --- */
function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const escena = document.querySelector('.hero-scene');
  if (escena) {
    const CAPAS = ['.tile--main', '.tile--pop', '.tile--bag', '.sello'];
    const tl = gsap.timeline();
    tl.from('.tile--main', { yPercent: 8, rotate: -8, opacity: 0, duration: 1.1, ease: 'expo.out' }, .15)
      .from('.tile--pop', { yPercent: 14, rotate: 12, opacity: 0, duration: 1, ease: 'expo.out' }, .34)
      .from('.tile--bag', { yPercent: 16, rotate: -14, opacity: 0, duration: 1, ease: 'expo.out' }, .48)
      .from('.sello', { scale: .5, opacity: 0, duration: .7, ease: 'back.out(1.8)' }, .72);
    const limpiarHero = () => {
      if (tl.progress() < 1) tl.progress(1);
      tl.kill();
      gsap.set(CAPAS, { clearProps: 'all' });
    };
    tl.eventCallback('onComplete', limpiarHero);
    setTimeout(limpiarHero, 2400);
    gsap.to('.copo--1', { y: -18, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.copo--2', { y: 14, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: .4 });
    gsap.to('.copo--3', { y: -12, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: .8 });

    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const capas = [
        { el: document.querySelector('.tile--main'), f: 6 },
        { el: document.querySelector('.tile--pop'), f: -11 },
        { el: document.querySelector('.tile--bag'), f: 9 },
        { el: document.querySelector('.sello'), f: -15 },
      ].filter(c => c.el);
      escena.addEventListener('pointermove', e => {
        const r = escena.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - .5;
        const my = (e.clientY - r.top) / r.height - .5;
        capas.forEach(c => gsap.to(c.el, { x: mx * c.f, y: my * c.f, duration: .6, ease: 'power2.out', overwrite: 'auto' }));
      });
      escena.addEventListener('pointerleave', () => {
        capas.forEach(c => gsap.to(c.el, { x: 0, y: 0, duration: .8, ease: 'power2.out', overwrite: 'auto' }));
      });
    }
  }
}

/* ------------------------------------------------------------- proceso --- */
function initProceso() {
  const stage = document.getElementById('proceso-stage');
  const visual = document.getElementById('proceso-visual');
  if (!stage || !visual) return;
  const imgs = [...visual.querySelectorAll('img')];
  const pasos = [...stage.querySelectorAll('.paso')];
  const num = document.getElementById('proceso-num');
  if (!imgs.length || !pasos.length) return;

  let actual = 0;
  const setStep = i => {
    i = Math.max(0, Math.min(pasos.length - 1, i));
    if (i === actual) return;
    actual = i;
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    pasos.forEach((p, k) => p.classList.toggle('is-on', k === i));
    if (num) num.textContent = i + 1;
  };

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;

  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const trigs = pasos.map((p, i) => ScrollTrigger.create({
      trigger: p, start: 'top 62%', end: 'bottom 45%', invalidateOnRefresh: true,
      onToggle: self => { if (self.isActive) setStep(i); },
    }));
    return () => trigs.forEach(t => t.kill());
  });
  mm.add('(max-width: 900px)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => setStep(Math.min(pasos.length - 1, Math.floor(self.progress * pasos.length))),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); setStep(0); };
  });
}

/* ------------------------------------------ texto que se lee con scroll --- */
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

/* --------------------------------------------------- devolución de demo --- */
const GKY_SLUG_ACENTOS = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u' };
function gkySlugify(s) {
  return String(s || '').toLowerCase()
    .replace(/[áéíóúñü]/g, c => GKY_SLUG_ACENTOS[c] || c)
    .replace(/[^a-z0-9]/g, '');
}

function initFeedbackFloat() {
  const GKY_FEEDBACK_WHATSAPP = '5491125068578';
  const btn = document.getElementById('feedback-float');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('feedback-modal-close');
  const starsWrap = document.getElementById('feedback-stars');
  const coloresEl = document.getElementById('feedback-colores');
  const contenidoEl = document.getElementById('feedback-contenido');
  const otrosEl = document.getElementById('feedback-otros');
  const submitBtn = document.getElementById('feedback-submit');
  if (!btn || !backdrop) return;

  const stars = [...starsWrap.querySelectorAll('.feedback-star')];
  let rating = 0;
  const paintStars = n => stars.forEach((s, i) => {
    s.classList.toggle('active', i < n);
    s.setAttribute('aria-pressed', i < n ? 'true' : 'false');
  });
  stars.forEach((s, i) => {
    s.addEventListener('click', () => { rating = i + 1; paintStars(rating); });
    s.addEventListener('mouseenter', () => paintStars(i + 1));
  });
  starsWrap.addEventListener('mouseleave', () => paintStars(rating));

  const open = () => {
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    (stars[0] || coloresEl)?.focus();
  };
  const close = () => {
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    btn.focus();
  };
  btn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) close(); });

  submitBtn.addEventListener('click', () => {
    const colores = coloresEl.value.trim();
    const contenido = contenidoEl.value.trim();
    const otros = otrosEl.value.trim();
    if (!rating && !colores && !contenido && !otros) { coloresEl.focus(); return; }

    const slugUrl = (location.pathname.match(/\/demo\/([^/]+)/) || [])[1] || document.title;
    const slug = gkySlugify(slugUrl);
    const negocio = (document.title.split(/\s[—|]\s|\s-\s/)[0] || document.title || '').trim();
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ' (' + rating + '/5)' : 'Sin calificar';
    const lineas = [
      'Devolución de la demo' + (negocio ? ' — ' + negocio : ''),
      'Calificación: ' + estrellas,
      colores ? 'Colores: ' + colores : null,
      contenido ? 'Contenido: ' + contenido : null,
      otros ? 'Otros: ' + otros : null,
      location.href,
    ].filter(Boolean);

    window.open('https://wa.me/' + GKY_FEEDBACK_WHATSAPP + '?text=' + encodeURIComponent(lineas.join('\n')), '_blank', 'noopener');
    window.__gkySendResena?.({ slug, negocio, rating: rating || null, colores, contenido, otros, url: location.href })
      ?.catch(err => console.warn('No se pudo guardar la devolución en Firestore:', err));

    if (typeof showToast === 'function') showToast('¡Gracias por tu devolución!'); else window.alert('¡Gracias por tu devolución!');
    close();
    rating = 0; paintStars(0); coloresEl.value = ''; contenidoEl.value = ''; otrosEl.value = '';
  });

  if (reduceMotion) return;
  let hideTimer = null;
  window.addEventListener('scroll', () => {
    btn.classList.add('is-hidden');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => btn.classList.remove('is-hidden'), 550);
  }, { passive: true });
}

/* ------------------------------------------------------------- arranque --- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; el.style.filter = 'none'; });
}

renderCategorias();
renderRail();
initCatalogo();
initArmar();
initReveals();
initNav();
initDrawer();
initModal();
initFocusTraps();
initAcciones();
initRail();
initFloats();
initHero();
initProceso();
initLeeScroll();
initFeedbackFloat();
updateCartBadge();

const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
