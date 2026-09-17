document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'juguetes', nom: 'Juguetes', img: 'images/cat-juguetes.webp', etq: 'Para regalar', color: '#FF00FF', tint: '#FFE0FF', pie: 'Peluches, madera y encastres' },
  { id: 'electronica', nom: 'Electrónica', img: 'images/cat-electronica.webp', etq: 'Con garantía', color: '#0000FF', tint: '#E4E4FF', pie: 'Cocina, audio y hogar' },
  { id: 'blanqueria', nom: 'Blanquería', img: 'images/cat-blanqueria.webp', etq: 'Algodón', color: '#8A00E6', tint: '#F3E0FF', pie: 'Toallas, sábanas y acolchados' }
];

const PRODUCTOS = [
  {
    id: 'gs-1001', nombre: 'Camión de bomberos con luces y sirena', cat: 'juguetes', precio: 24900, descuento: 0,
    stock: 7, img: 'images/p-camion-bomberos.webp', alt: 'Camión de bomberos de juguete rojo con escalera',
    desc: 'Camión de plástico reforzado de 38 cm, con luces, sirena y escalera que gira. Funciona con 3 pilas AA.',
    datos: [['Edad', 'Desde 3 años'], ['Largo', '38 cm'], ['Pilas', '3 AA, no incluidas']],
    etiquetas: ['camion', 'bomberos', 'auto', 'luces'], destacado: true, nuevo: false, regalo: true
  },
  {
    id: 'gs-1002', nombre: 'Xilofón de madera 8 notas', cat: 'juguetes', precio: 14500, descuento: 0,
    stock: 12, img: 'images/p-xilofon.webp', alt: 'Xilofón de madera con teclas de colores y su baqueta',
    desc: 'Ocho notas afinadas en madera pintada con esmalte al agua. Viene con baqueta de madera.',
    datos: [['Edad', 'Desde 18 meses'], ['Material', 'Madera y metal'], ['Incluye', 'Baqueta']],
    etiquetas: ['xilofon', 'musica', 'madera', 'bebe'], destacado: false, nuevo: false, regalo: true
  },
  {
    id: 'gs-1003', nombre: 'Tractor con pala y volquete', cat: 'juguetes', precio: 11900, descuento: 10,
    stock: 9, img: 'images/p-tractor.webp', alt: 'Tractor de juguete azul y naranja con pala',
    desc: 'Tractor de plástico resistente con pala que sube y baja y volquete que descarga. Para jugar adentro o en la arena.',
    datos: [['Edad', 'Desde 3 años'], ['Largo', '26 cm'], ['Uso', 'Interior y arenero']],
    etiquetas: ['tractor', 'auto', 'arena', 'obra'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-1004', nombre: 'Bloques de encastre x 120 piezas', cat: 'juguetes', precio: 22400, descuento: 0,
    stock: 15, img: 'images/p-bloques-encastre.webp', alt: 'Bloques de encastre de colores mezclados',
    desc: 'Ciento veinte piezas compatibles entre sí, en seis colores. Vienen en balde con tapa para guardar.',
    datos: [['Edad', 'Desde 3 años'], ['Piezas', '120'], ['Incluye', 'Balde con tapa']],
    etiquetas: ['bloques', 'encastre', 'construccion', 'ladrillos'], destacado: true, nuevo: false, regalo: true
  },
  {
    id: 'gs-1005', nombre: 'Set de construcción grande x 200 piezas', cat: 'juguetes', precio: 34900, descuento: 15,
    stock: 6, img: 'images/p-bloques-set.webp', alt: 'Set grande de bloques de construcción de colores',
    desc: 'Doscientas piezas con bases grandes, ruedas y ventanas. El set más pedido para armar de a varios.',
    datos: [['Edad', 'Desde 4 años'], ['Piezas', '200'], ['Incluye', 'Bases y ruedas']],
    etiquetas: ['bloques', 'set', 'construccion', 'grande'], destacado: false, nuevo: false, regalo: true
  },
  {
    id: 'gs-1006', nombre: 'Dinosaurios de madera x 3', cat: 'juguetes', precio: 15600, descuento: 0,
    stock: 10, img: 'images/p-dinos-madera.webp', alt: 'Dinosaurios de madera pintados a mano',
    desc: 'Tres dinosaurios de madera maciza pintados a mano, con bordes redondeados. Livianos y sin plástico.',
    datos: [['Edad', 'Desde 3 años'], ['Material', 'Madera maciza'], ['Piezas', '3 figuras']],
    etiquetas: ['dinosaurios', 'madera', 'figuras', 'natural'], destacado: true, nuevo: true, regalo: true
  },
  {
    id: 'gs-1007', nombre: 'Ladrillos de encastre x 60 piezas', cat: 'juguetes', precio: 13800, descuento: 0,
    stock: 18, img: 'images/p-bloques-ladrillos.webp', alt: 'Ladrillos de encastre de colores en primer plano',
    desc: 'Sesenta ladrillos grandes, ideales para las primeras construcciones. Se lavan con agua y jabón.',
    datos: [['Edad', 'Desde 2 años'], ['Piezas', '60'], ['Tamaño', 'Pieza grande']],
    etiquetas: ['ladrillos', 'bloques', 'encastre', 'bebe'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-1008', nombre: 'Oso de peluche 40 cm', cat: 'juguetes', precio: 18900, descuento: 0,
    stock: 5, img: 'images/p-peluche-oso.webp', alt: 'Oso de peluche con remera roja sentado en la góndola',
    desc: 'Peluche de 40 cm con relleno siliconado y costuras reforzadas. Se puede lavar a mano.',
    datos: [['Alto', '40 cm'], ['Relleno', 'Siliconado'], ['Lavado', 'A mano']],
    etiquetas: ['peluche', 'oso', 'regalo', 'cumpleanos'], destacado: true, nuevo: false, regalo: true
  },
  {
    id: 'gs-2001', nombre: 'Auriculares inalámbricos con estuche', cat: 'electronica', precio: 42900, descuento: 10,
    stock: 8, img: 'images/p-auriculares.webp', alt: 'Auriculares inalámbricos negros sobre fondo blanco',
    desc: 'Vincha acolchada, bluetooth 5.3 y hasta 20 horas de uso. Incluye estuche rígido y cable auxiliar.',
    datos: [['Batería', 'Hasta 20 horas'], ['Conexión', 'Bluetooth 5.3'], ['Garantía', '6 meses']],
    etiquetas: ['auriculares', 'bluetooth', 'audio', 'inalambrico'], destacado: true, nuevo: true, regalo: true
  },
  {
    id: 'gs-2002', nombre: 'Licuadora de vaso de vidrio 1,5 L', cat: 'electronica', precio: 89900, descuento: 0,
    stock: 4, img: 'images/p-licuadora-vidrio.webp', alt: 'Licuadora con vaso de vidrio sobre la mesada',
    desc: 'Vaso de vidrio de 1,5 litros, dos velocidades más pulso y cuchillas de acero desmontables.',
    datos: [['Capacidad', '1,5 litros'], ['Potencia', '600 W'], ['Garantía', '6 meses']],
    etiquetas: ['licuadora', 'vidrio', 'cocina', 'electrodomestico'], destacado: true, nuevo: false, regalo: false
  },
  {
    id: 'gs-2003', nombre: 'Licuadora de alta potencia 1200 W', cat: 'electronica', precio: 124900, descuento: 12,
    stock: 3, img: 'images/p-licuadora-negra.webp', alt: 'Licuadora negra de alta potencia con vaso grande',
    desc: 'Mil doscientos watts para hielo y frutos secos, con vaso de 2 litros y base antideslizante.',
    datos: [['Capacidad', '2 litros'], ['Potencia', '1200 W'], ['Garantía', '6 meses']],
    etiquetas: ['licuadora', 'potencia', 'cocina', 'hielo'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-2004', nombre: 'Batidora de mano con vaso medidor', cat: 'electronica', precio: 54500, descuento: 0,
    stock: 6, img: 'images/p-batidora.webp', alt: 'Batidora de mano roja y negra apoyada en la mesada',
    desc: 'Cinco velocidades, pie desmontable de acero y vaso medidor. Sirve para purés, sopas y batidos.',
    datos: [['Velocidades', '5'], ['Pie', 'Acero desmontable'], ['Garantía', '6 meses']],
    etiquetas: ['batidora', 'minipimer', 'cocina', 'pure'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-3001', nombre: 'Juego de toallas 2 piezas', cat: 'blanqueria', precio: 32900, descuento: 20,
    stock: 11, img: 'images/p-toallas-set.webp', alt: 'Pilas de toallas dobladas en tonos claros',
    desc: 'Toallón y toalla de mano en algodón peinado de 500 g/m². Absorbe rápido y no destiñe.',
    datos: [['Piezas', 'Toallón + toalla'], ['Algodón', '500 g/m²'], ['Colores', 'Beige, gris y celeste']],
    etiquetas: ['toallas', 'juego', 'bano', 'algodon'], destacado: true, nuevo: false, regalo: true
  },
  {
    id: 'gs-3002', nombre: 'Toallón 90 x 150 cm', cat: 'blanqueria', precio: 19900, descuento: 0,
    stock: 14, img: 'images/p-toallon.webp', alt: 'Toallones grises doblados en la estantería',
    desc: 'Toallón grande de algodón con orillo reforzado. Entra en el lavarropas sin perder el color.',
    datos: [['Medida', '90 x 150 cm'], ['Algodón', '450 g/m²'], ['Lavado', 'Lavarropas']],
    etiquetas: ['toallon', 'bano', 'algodon', 'grande'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-3003', nombre: 'Juego de sábanas 2 plazas', cat: 'blanqueria', precio: 58900, descuento: 0,
    stock: 7, img: 'images/p-sabanas.webp', alt: 'Sábanas claras tendidas sobre la cama',
    desc: 'Sábana con elástico, encimera y dos fundas en percal de 144 hilos. Para colchón de hasta 30 cm.',
    datos: [['Medida', '2 plazas'], ['Hilos', 'Percal 144'], ['Piezas', '4']],
    etiquetas: ['sabanas', 'juego', 'cama', 'percal'], destacado: true, nuevo: false, regalo: false
  },
  {
    id: 'gs-3004', nombre: 'Acolchado liso 2 plazas', cat: 'blanqueria', precio: 74900, descuento: 10,
    stock: 5, img: 'images/p-acolchado.webp', alt: 'Acolchado claro sobre una cama tendida',
    desc: 'Acolchado reversible con relleno de vellón siliconado, liviano y abrigado. Funda lavable.',
    datos: [['Medida', '2 plazas'], ['Relleno', 'Vellón siliconado'], ['Reversible', 'Sí']],
    etiquetas: ['acolchado', 'cama', 'abrigo', 'invierno'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-3005', nombre: 'Toalla de mano de algodón', cat: 'blanqueria', precio: 9800, descuento: 0,
    stock: 22, img: 'images/p-toalla-mano.webp', alt: 'Toallas de mano dobladas por color',
    desc: 'La toalla de reposición: algodón liviano que seca rápido, en cinco colores lisos.',
    datos: [['Medida', '50 x 90 cm'], ['Algodón', '400 g/m²'], ['Colores', '5 lisos']],
    etiquetas: ['toalla', 'mano', 'bano', 'reposicion'], destacado: false, nuevo: false, regalo: false
  },
  {
    id: 'gs-3006', nombre: 'Pack de toallas de mano x 3', cat: 'blanqueria', precio: 26500, descuento: 0,
    stock: 9, img: 'images/p-toallas-pack.webp', alt: 'Pack de toallas de mano apiladas',
    desc: 'Tres toallas de mano en colores combinados, listas para regalar o para renovar el baño de una vez.',
    datos: [['Piezas', '3 toallas'], ['Medida', '50 x 90 cm'], ['Algodón', '400 g/m²']],
    etiquetas: ['toallas', 'pack', 'bano', 'regalo'], destacado: false, nuevo: false, regalo: true
  }
];

const WSP = '5491138921698';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const getCat = id => CATEGORIAS.find(c => c.id === id);
const nombreCat = id => getCat(id)?.nom ?? '';

const Cart = {
  KEY: 'gizemsenay_cart',
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

/* ---------- estado del catálogo ---------- */
const estado = { q: '', cat: 'todas', precio: 'todos', regalo: false, stock: false, orden: 'relevancia', pagina: 1 };
const PAGE = 16;
let revealsListos = false;

function estiloMundo(catId) {
  const c = getCat(catId);
  return c ? 'style="--mundo:' + c.color + ';--mundo-tint:' + c.tint + '"' : '';
}

function stepperHTML(id, contexto) {
  const ref = (contexto || 'cat') + '-' + id;
  return '<div class="stepper" data-stepper="' + ref + '">' +
    '<button type="button" data-paso="-1" aria-label="Quitar uno">−</button>' +
    '<input type="number" value="1" min="1" max="99" inputmode="numeric" aria-label="Cantidad" id="qty-' + ref + '">' +
    '<button type="button" data-paso="1" aria-label="Sumar uno">+</button>' +
  '</div>';
}

function cardHTML(p, contexto) {
  const final = precioFinal(p);
  const sinStock = p.stock <= 0;
  const flags = [];
  if (p.descuento > 0) flags.push('<span class="flag flag--off">-' + p.descuento + '%</span>');
  if (p.nuevo) flags.push('<span class="flag flag--nuevo">Nuevo</span>');
  if (p.regalo) flags.push('<span class="flag flag--regalo">Para regalar</span>');
  if (!sinStock && p.stock <= 5) flags.push('<span class="flag flag--ultimas">Últimas ' + p.stock + '</span>');
  return '<article class="prod-card' + (sinStock ? ' prod-card--sinstock' : '') + '" data-id="' + p.id + '" ' + estiloMundo(p.cat) + ' data-animate style="opacity:0;transform:translateY(24px)">' +
    '<div class="prod-media">' +
      '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      (flags.length ? '<div class="prod-flags">' + flags.join('') + '</div>' : '') +
      '<button type="button" class="prod-vista" data-vista="' + p.id + '">Ver ficha</button>' +
    '</div>' +
    '<div class="prod-body">' +
      '<p class="prod-rubro">' + esc(nombreCat(p.cat)) + '</p>' +
      '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
      '<p class="prod-stock">' + (sinStock ? 'Sin stock, lo repone el panel' : p.stock + ' disponibles') + '</p>' +
      '<div class="prod-precios">' +
        '<span class="prod-precio' + (p.descuento > 0 ? ' prod-precio--off' : '') + '">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s>' : '') +
      '</div>' +
      '<div class="prod-actions">' +
        stepperHTML(p.id, contexto) +
        '<button type="button" class="prod-add" data-add="' + p.id + '"' + (sinStock ? ' disabled' : '') + '>' +
          (sinStock ? 'Sin stock' : '<span class="add-largo">Sumar al carrito</span><span class="add-corto">Sumar</span>') +
        '</button>' +
      '</div>' +
      (sinStock ? '' : '<button type="button" class="prod-comprar" data-comprar="' + p.id + '">Comprar ahora</button>') +
    '</div>' +
  '</article>';
}

function qtyDe(el) {
  const st = el.closest('.prod-card, .mv, .cap-prod')?.querySelector('.stepper input');
  const n = parseInt(st?.value ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function initMundos() {
  const cont = document.getElementById('mundoGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return '<button type="button" class="mundo-card" data-cat="' + c.id + '" data-animate style="--mundo:' + c.color + ';--mundo-tint:' + c.tint + ';opacity:0;transform:translateY(26px)">' +
      '<span class="mundo-etq">' + esc(c.etq) + '</span>' +
      '<span class="mundo-media"><img src="' + c.img + '" width="1000" height="1000" alt="' + esc(c.nom) + '" decoding="async"></span>' +
      '<span class="mundo-body">' +
        '<span><span class="mundo-nom">' + esc(c.nom) + '</span><span class="mundo-n">' + n + ' artículos · ' + esc(c.pie) + '</span></span>' +
        '<span class="mundo-flecha"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '</span>' +
    '</button>';
  }).join('');
  cont.querySelectorAll('.mundo-card').forEach(b => {
    b.addEventListener('click', () => irAlCatalogo(b.dataset.cat));
  });

  const pie = document.getElementById('pieCats');
  if (pie) {
    pie.innerHTML = CATEGORIAS.map(c => '<li><a href="#tienda" data-cat-link="' + c.id + '">' + esc(c.nom) + '</a></li>').join('');
    pie.querySelectorAll('[data-cat-link]').forEach(a => a.addEventListener('click', () => {
      estado.cat = a.dataset.catLink; estado.pagina = 1; sincronizarChips(); render();
    }));
  }
  document.querySelectorAll('.vidriera-tile[data-cat]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); irAlCatalogo(a.dataset.cat);
  }));
}

function irAlCatalogo(cat) {
  estado.cat = cat; estado.q = ''; estado.pagina = 1;
  const input = document.getElementById('q'); if (input) input.value = '';
  sincronizarChips(); render();
  document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
}

function initRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  track.innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 8).map(p => cardHTML(p, 'rail')).join('');
  initRailDrag();
}

function initRailDrag() {
  const vp = document.getElementById('railVp');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  if (!vp || !track) return;

  let down = false, moved = false, startX = 0, startScroll = 0, pointerId = null;

  const sincronizarFlechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };

  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
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
      vp.classList.remove('dragging');
      const kill = e => { e.stopPropagation(); e.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 60);
    }
    moved = false;
    sincronizarFlechas();
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('pointerleave', end);
  vp.addEventListener('scroll', sincronizarFlechas, { passive: true });

  const paso = () => Math.max(220, Math.round(vp.clientWidth * 0.8));
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: 'smooth' }));
  sincronizarFlechas();
  window.addEventListener('resize', sincronizarFlechas, { passive: true });
}

function filtrados() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'todas' && p.cat !== estado.cat) return false;
    if (estado.regalo && !p.regalo) return false;
    if (estado.stock && p.stock <= 0) return false;
    if (estado.precio !== 'todos') {
      const [min, max] = estado.precio.split('-').map(Number);
      const f = precioFinal(p);
      if (f < min || f > max) return false;
    }
    if (q.length) {
      const heno = normalizar([p.nombre, nombreCat(p.cat), p.desc, (p.etiquetas || []).join(' ')].join(' '));
      if (!q.every(t => heno.includes(t))) return false;
    }
    return true;
  });
  if (estado.orden === 'precio-asc') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return lista;
}

function render() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const res = document.getElementById('resultados');
  const verMas = document.getElementById('verMas');
  if (!grid) return;
  const lista = filtrados();
  const visibles = lista.slice(0, PAGE * estado.pagina);

  grid.innerHTML = visibles.map(p => cardHTML(p, 'cat')).join('');
  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length > 0;
  if (res) res.textContent = lista.length === 1 ? '1 artículo' : lista.length + ' artículos';
  if (verMas) {
    verMas.hidden = visibles.length >= lista.length;
    verMas.parentElement.hidden = visibles.length >= lista.length;
  }

  const n = [estado.cat !== 'todas', estado.precio !== 'todos', estado.regalo, estado.stock].filter(Boolean).length;
  const chipN = document.getElementById('filtrosN');
  if (chipN) { chipN.textContent = n; chipN.hidden = n === 0; }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = Math.min(i * 0.05, 0.4) + 's';
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

function sincronizarChips() {
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.catChip === estado.cat));
  document.querySelectorAll('#chipsPrecio .chip').forEach(c => c.classList.toggle('is-on', c.dataset.precio === estado.precio));
  const r = document.getElementById('soloRegalo'); if (r) r.checked = estado.regalo;
  const s = document.getElementById('soloStock'); if (s) s.checked = estado.stock;
  const o = document.getElementById('orden'); if (o) o.value = estado.orden;
}

function initFiltros() {
  const chipsCat = document.getElementById('chipsCat');
  if (chipsCat) {
    chipsCat.innerHTML = '<button type="button" class="chip is-on" data-cat-chip="todas">Todos</button>' +
      CATEGORIAS.map(c => '<button type="button" class="chip" data-cat-chip="' + c.id + '">' + esc(c.nom) + '</button>').join('');
  }
  document.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    if (chip.dataset.catChip) estado.cat = chip.dataset.catChip;
    else if (chip.dataset.precio) estado.precio = chip.dataset.precio;
    else return;
    estado.pagina = 1; sincronizarChips(); render();
  });

  document.getElementById('soloRegalo')?.addEventListener('change', e => { estado.regalo = e.target.checked; estado.pagina = 1; render(); });
  document.getElementById('soloStock')?.addEventListener('change', e => { estado.stock = e.target.checked; estado.pagina = 1; render(); });
  document.getElementById('orden')?.addEventListener('change', e => { estado.orden = e.target.value; estado.pagina = 1; render(); });
  document.getElementById('verMas')?.addEventListener('click', () => { estado.pagina++; render(); });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', precio: 'todos', regalo: false, stock: false, orden: 'relevancia', pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
    showToast('Listo, catálogo completo otra vez');
  });
  document.getElementById('vaciarBusqueda')?.addEventListener('click', () => {
    Object.assign(estado, { q: '', cat: 'todas', precio: 'todos', regalo: false, stock: false, pagina: 1 });
    const q = document.getElementById('q'); if (q) q.value = '';
    sincronizarChips(); render();
  });

  document.getElementById('formBuscador')?.addEventListener('submit', e => e.preventDefault());
  document.getElementById('q')?.addEventListener('input', e => { estado.q = e.target.value.trim(); estado.pagina = 1; render(); });

  const abrir = document.getElementById('abrirBuscador');
  const cajon = document.getElementById('cajonBuscador');
  abrir?.addEventListener('click', () => {
    const visible = cajon.hidden;
    cajon.hidden = !visible;
    abrir.setAttribute('aria-expanded', visible ? 'true' : 'false');
    if (visible) document.getElementById('qHead')?.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  cajon?.addEventListener('submit', e => {
    e.preventDefault();
    const valor = document.getElementById('qHead').value.trim();
    estado.q = valor; estado.cat = 'todas'; estado.pagina = 1;
    const q = document.getElementById('q'); if (q) q.value = valor;
    sincronizarChips(); render();
    document.getElementById('tienda')?.scrollIntoView({ block: 'start' });
  });

  const toggle = document.getElementById('filtrosToggle');
  const panel = document.getElementById('filtrosPanel');
  toggle?.addEventListener('click', () => {
    const abiertoPanel = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', abiertoPanel ? 'true' : 'false');
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

/* ---------- carrito ---------- */
let ultimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = '<div class="carrito-vacio"><span class="marca-estrella" aria-hidden="true"></span>' +
      '<p>Tu pedido está vacío. Entrá por el catálogo y sumá lo que necesites de cada rubro.</p>' +
      '<button type="button" class="btn btn--cta" data-cerrar-drawer>Ver el catálogo</button></div>';
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return '<div class="ci" data-linea="' + p.id + '">' +
        '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
        '<div><p class="ci-nom">' + esc(p.nombre) + '</p>' +
        '<p class="ci-rubro">' + esc(nombreCat(p.cat)) + '</p>' +
        '<div class="ci-bajo"><span class="stepper">' +
          '<button type="button" data-linea-paso="-1" aria-label="Quitar uno">−</button>' +
          '<input type="number" value="' + i.qty + '" min="1" max="99" inputmode="numeric" aria-label="Cantidad">' +
          '<button type="button" data-linea-paso="1" aria-label="Sumar uno">+</button>' +
        '</span><span class="ci-precio">' + formatearPrecio(precioFinal(p) * i.qty) + '</span></div></div>' +
        '<button type="button" class="ci-quitar" data-quitar aria-label="Quitar ' + esc(p.nombre) + ' del pedido">' +
          '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');
  }
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const detalle = items.map(i => {
      const p = getProducto(i.id);
      return p ? '- ' + p.nombre + ' x ' + i.qty + ' (' + formatearPrecio(precioFinal(p) * i.qty) + ')' : '';
    }).filter(Boolean).join('\n');
    const texto = items.length
      ? 'Hola Gizem Senay, quiero confirmar este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total())
      : 'Hola Gizem Senay, quiero confirmar un pedido';
    wsp.href = 'https://wa.me/' + WSP + '?text=' + encodeURIComponent(texto);
  }
}

function abrirDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd) return;
  ultimoFoco = document.activeElement;
  drawer.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const drawer = document.getElementById('drawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !bd || drawer.hidden) return;
  drawer.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartHead')?.addEventListener('click', abrirDrawer);
  document.getElementById('cart-float')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);

  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); document.getElementById('tienda')?.scrollIntoView({ block: 'start' }); return; }
    const linea = e.target.closest('.ci');
    if (!linea) return;
    const id = linea.dataset.linea;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const actual = Cart.get().find(i => i.id === id)?.qty ?? 1;
      const nueva = actual + parseInt(paso.dataset.lineaPaso, 10);
      if (nueva < 1) Cart.remove(id); else Cart.setQty(id, nueva);
      return;
    }
    if (e.target.closest('[data-quitar]')) { Cart.remove(id); showToast('Artículo quitado del pedido'); }
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.ci input');
    if (!input) return;
    Cart.setQty(input.closest('.ci').dataset.linea, parseInt(input.value, 10) || 1);
  });

  document.getElementById('finalizar')?.addEventListener('click', () => {
    if (!Cart.count()) { showToast('Sumá algún artículo antes de finalizar'); return; }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('drawer')?.hidden) cerrarDrawer();
  });
  drawer.addEventListener('keydown', e => trapFoco(e, drawer));
}

/* ---------- ficha rápida ---------- */
function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalIn');
  if (!p || !modal || !bd || !inner) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const rel = PRODUCTOS.filter(o => o.cat === p.cat && o.id !== p.id).slice(0, 3);
  inner.innerHTML = '<div class="mv" ' + estiloMundo(p.cat) + '>' +
    '<div class="mv-media">' +
      '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<button type="button" class="mv-cerrar" data-cerrar-modal aria-label="Cerrar la ficha">' +
        '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>' +
    '<div class="mv-body">' +
      '<p class="mv-rubro">' + esc(nombreCat(p.cat)) + (p.regalo ? ' · Ideal para regalo' : '') + '</p>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p class="mv-desc">' + esc(p.desc) + '</p>' +
      '<ul class="mv-datos">' + (p.datos || []).map(d => '<li><strong>' + esc(d[0]) + '</strong><span>' + esc(d[1]) + '</span></li>').join('') +
        '<li><strong>Disponibilidad</strong><span>' + (p.stock > 0 ? p.stock + ' en stock' : 'Sin stock por ahora') + '</span></li>' +
      '</ul>' +
      '<div class="mv-precios">' +
        '<span class="mv-precio">' + formatearPrecio(final) + '</span>' +
        (p.descuento > 0 ? '<s class="prod-tachado">' + formatearPrecio(p.precio) + '</s><span class="flag flag--off">-' + p.descuento + '%</span>' : '') +
      '</div>' +
      '<div class="prod-actions mv-acc">' +
        stepperHTML(p.id, 'mv') +
        '<button type="button" class="btn btn--cta" data-add="' + p.id + '"' + (p.stock <= 0 ? ' disabled' : '') + '>' + (p.stock > 0 ? 'Sumar al carrito' : 'Sin stock') + '</button>' +
        (p.stock > 0 ? '<button type="button" class="btn btn--linea" data-comprar="' + p.id + '">Comprar ahora</button>' : '') +
      '</div>' +
      '<a class="mv-consulta" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola Gizem Senay, quiero consultar por ' + p.nombre) + '" target="_blank" rel="noopener">Consultar este artículo por WhatsApp</a>' +
    '</div>' +
    (rel.length ? '<div class="mv-rel"><p class="mv-rel-t">Del mismo rubro</p><div class="mv-rel-grid">' +
      rel.map(o => '<button type="button" class="mv-rel-card" data-vista="' + o.id + '">' +
        '<img src="' + o.img + '" width="900" height="900" alt="' + esc(o.alt) + '" decoding="async">' +
        '<span><span class="mv-rel-nom">' + esc(o.nombre) + '</span><br><span class="mv-rel-pre">' + formatearPrecio(precioFinal(o)) + '</span></span>' +
      '</button>').join('') + '</div></div>' : '') +
  '</div>';
  const titulo = document.getElementById('modalTitulo');
  if (titulo) titulo.textContent = p.nombre;
  modal.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { modal.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  inner.querySelector('[data-cerrar-modal]')?.focus();
}

function cerrarModal() {
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open'); bd.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { modal.hidden = true; bd.hidden = true; }, 380);
  ultimoFoco?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modalBackdrop')?.addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrarModal();
    if (e.target.closest('[data-cerrar-modal]')) cerrarModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });
  modal.addEventListener('keydown', e => trapFoco(e, modal));
}

function trapFoco(e, cont) {
  if (e.key !== 'Tab') return;
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const primero = foco[0], ultimo = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- acciones de producto ---------- */
function initAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('.stepper [data-paso]');
    if (paso) {
      const input = paso.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + parseInt(paso.dataset.paso, 10);
      input.value = Math.max(1, Math.min(99, n));
      return;
    }
    const vista = e.target.closest('[data-vista]');
    if (vista) { abrirModal(vista.dataset.vista); return; }
    const add = e.target.closest('[data-add]');
    if (add && !add.disabled) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      Cart.add(p, qtyDe(add));
      showToast('Sumado al pedido: ' + p.nombre);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      Cart.add(p, qtyDe(comprar));
      cerrarModal();
      setTimeout(abrirDrawer, 120);
    }
  });
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
  sync();
}

/* ---------- nav ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.querySelector('.cabecera').appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
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
}

/* ---------- sección firma: capítulos que cambian en el lugar ---------- */
function initFirma() {
  const sec = document.getElementById('firma');
  const escena = document.getElementById('firmaEscena');
  const visual = document.getElementById('firmaVisual');
  const copy = document.getElementById('firmaCopy');
  const indice = document.getElementById('firmaIndice');
  const barra = document.getElementById('firmaBarra');
  if (!sec || !escena || !visual || !copy || !indice) return;

  copy.querySelectorAll('.cap-prod').forEach(slot => {
    const p = getProducto(slot.dataset.prod);
    if (!p) return;
    slot.innerHTML = '<img src="' + p.img + '" width="900" height="900" alt="' + esc(p.alt) + '" decoding="async">' +
      '<span class="cap-prod-txt">' +
        '<span class="cap-prod-nom">' + esc(p.nombre) + '</span>' +
        '<span class="cap-prod-precio">' + formatearPrecio(precioFinal(p)) + '</span>' +
      '</span>' +
      '<button type="button" class="prod-add" data-add="' + p.id + '">' +
        '<span class="add-largo">Sumar al carrito</span><span class="add-corto">Sumar</span>' +
      '</button>';
  });

  const fotos = [...visual.querySelectorAll('.cap-foto')];
  const caps = [...copy.querySelectorAll('.cap')];
  const items = [...indice.children];
  const total = caps.length;
  if (!total) return;

  if (reduceMotion) {
    items.forEach(li => li.classList.add('is-on'));
    return;
  }

  let raf = false, ultimo = -1;
  const pintar = () => {
    raf = false;
    const r = sec.getBoundingClientRect();
    const recorrido = sec.offsetHeight - window.innerHeight;
    const p = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
    if (barra) barra.style.width = (p * 100).toFixed(1) + '%';
    const idx = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    if (idx === ultimo) return;
    ultimo = idx;
    fotos.forEach((f, i) => f.classList.toggle('is-on', i === idx));
    caps.forEach((c, i) => c.classList.toggle('is-on', i === idx));
    items.forEach((li, i) => li.classList.toggle('is-on', i === idx));
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- texto que se lee con el scroll ---------- */
function initLee() {
  const el = document.querySelector('[data-lee]');
  if (!el) return;
  const palabras = el.textContent.trim().split(/\s+/);
  el.innerHTML = palabras.map(w => '<span data-w>' + esc(w) + '</span>').join(' ');
  if (reduceMotion) { el.querySelectorAll('[data-w]').forEach(s => s.classList.add('on')); return; }
  const spans = [...el.querySelectorAll('[data-w]')];
  let raf = false;
  const pintar = () => {
    raf = false;
    const r = el.getBoundingClientRect();
    const alto = window.innerHeight;
    const p = Math.min(1, Math.max(0, (alto * 0.82 - r.top) / (alto * 0.45)));
    const n = Math.round(p * spans.length);
    spans.forEach((s, i) => s.classList.toggle('on', i < n));
  };
  const pedir = () => { if (!raf) { raf = true; requestAnimationFrame(pintar); } };
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pintar();
}

/* ---------- newsletter ---------- */
function initNews() {
  const form = document.getElementById('formNews');
  if (!form) return;
  const input = document.getElementById('mail');
  const err = document.getElementById('mailErr');
  const btn = document.getElementById('newsBtn');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valor = input.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.hidden = ok;
    if (!ok) { input.focus(); return; }
    const texto = btn.textContent;
    btn.disabled = true; btn.textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false; btn.textContent = texto;
      form.reset(); input.setAttribute('aria-invalid', 'false');
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- movimiento ---------- */
function initGsap() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
    return;
  }
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) return;

  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.09 }, { scale: 1, duration: 1.5, ease: 'power2.out' });
  const panel = document.querySelector('.hero-panel');
  if (panel) gsap.fromTo(panel, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: 'power3.out' });
  const sello = document.querySelector('.sello--horario');
  if (sello) gsap.fromTo(sello, { scale: .6, rotate: -40, opacity: 0 }, { scale: 1, rotate: -12, opacity: 1, duration: .8, delay: .5, ease: 'back.out(1.7)' });
  gsap.fromTo('.confeti', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: .6, delay: .7, stagger: .1, ease: 'back.out(2)' });

  if (typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.mundo-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -4 }, {
      yPercent: 4, ease: 'none',
      scrollTrigger: { trigger: img.closest('.mundo-card'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  document.querySelectorAll('.confeti').forEach((c, i) => {
    gsap.to(c, { y: (i % 2 ? 40 : -40), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
  const foco = document.querySelector('.historia-foto');
  if (foco) gsap.to(foco.querySelector('img'), { scale: 1.06, ease: 'none', scrollTrigger: { trigger: foco, start: 'top bottom', end: 'bottom top', scrub: true } });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- arranque ---------- */
const elAnio = document.getElementById('anio');
if (elAnio) elAnio.textContent = new Date().getFullYear();

initMundos();
initRail();
initFiltros();
render();
initReveals();
initNav();
initDrawer();
initModal();
initAcciones();
initFloats();
initFirma();
initLee();
initNews();
initGsap();

document.addEventListener('cart:updated', () => { updateCartBadge(); renderDrawer(); });
updateCartBadge();
renderDrawer();
