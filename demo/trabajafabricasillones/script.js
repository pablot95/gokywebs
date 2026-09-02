const WSP = '5491166954085';
const IMG = 'images/';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const TELAS = [
  { id: 'chenille', nombre: 'Chenille', color: '#8C8378', recargo: 0 },
  { id: 'pana', nombre: 'Pana', color: '#2E5A6B', recargo: 0 },
  { id: 'lino', nombre: 'Lino', color: '#CFC3AC', recargo: 0.04 },
  { id: 'ecocuero', nombre: 'Eco cuero', color: '#5B4436', recargo: 0.08 },
  { id: 'terciopelo', nombre: 'Terciopelo', color: '#1F4437', recargo: 0.12 },
];

const CATEGORIAS = [
  { id: 'dos-tres', nombre: 'Sillones 2 y 3 cuerpos', img: 'sillon-lino-1200x1200.webp', alt: 'Sillón de tres cuerpos tapizado en lino claro con almohadones' },
  { id: 'esquineros', nombre: 'Esquineros', img: 'sillon-gris-1200x1200.webp', alt: 'Sillón esquinero gris con almohadones en un living' },
  { id: 'sofa-cama', nombre: 'Sofá cama', img: 'sillon-pana-azul-1200x1200.webp', alt: 'Sofá cama de dos cuerpos tapizado en pana azul' },
  { id: 'butacas', nombre: 'Butacas y puffs', img: 'butacas-cuero-1200x1200.webp', alt: 'Par de butacas capitoné tapizadas en eco cuero marrón' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Sillón 3 cuerpos Palermo', cat: 'dos-tres', cuerpos: 'tres', esCama: false, precio: 829000, descuento: 0, img: 'hero-terciopelo-verde-1600x1400.webp', alt: 'Sillón de tres cuerpos tapizado en terciopelo verde con almohadón blanco', badge: 'Más vendido', telas: ['terciopelo', 'chenille', 'pana'], medidas: { ancho: 210, alto: 78, prof: 92 }, desc: 'Nuestro modelo más pedido. Asiento profundo con almohadones de pluma sintética y respaldo bajo, pensado para living amplio. En terciopelo queda de vidriera, en chenille aguanta el uso diario.', destacado: true },
  { id: 2, nombre: 'Sillón 3 cuerpos Recoleta', cat: 'dos-tres', cuerpos: 'tres', esCama: false, precio: 689000, descuento: 0, img: 'sillon-lino-1200x1200.webp', alt: 'Sillón de tres cuerpos en lino claro con almohadones blancos y patas de madera', badge: '', telas: ['lino', 'chenille', 'pana'], medidas: { ancho: 200, alto: 72, prof: 88 }, desc: 'Líneas rectas y patas de madera a la vista. Es el más liviano de la línea y el que mejor entra en departamentos con pasillos angostos.', destacado: true },
  { id: 3, nombre: 'Sillón 2 cuerpos Recoleta', cat: 'dos-tres', cuerpos: 'dos', esCama: false, precio: 512000, descuento: 0, img: 'sillon-blanco-1200x1200.webp', alt: 'Sillón de dos cuerpos tapizado en tela clara sobre fondo neutro', badge: '', telas: ['lino', 'chenille', 'ecocuero'], medidas: { ancho: 160, alto: 72, prof: 88 }, desc: 'La versión de dos cuerpos del Recoleta, misma estructura y mismo asiento. Entra en cualquier ascensor parado de costado.', destacado: true },
  { id: 4, nombre: 'Sillón 3 cuerpos Almagro', cat: 'dos-tres', cuerpos: 'tres', esCama: false, precio: 745000, descuento: 0, img: 'sillon-gris-1200x1200.webp', alt: 'Sillón de tres cuerpos gris con almohadones estampados', badge: '', telas: ['chenille', 'pana', 'lino'], medidas: { ancho: 215, alto: 80, prof: 95 }, desc: 'El más mullido: asiento con resorte ensacado y almohadones sueltos que se pueden dar vuelta. Es el que recomiendo si el sillón se usa todos los días.', destacado: true },
  { id: 5, nombre: 'Sillón 2 cuerpos Almagro', cat: 'dos-tres', cuerpos: 'dos', esCama: false, precio: 558000, descuento: 0, img: 'sillon-pana-azul-1200x1200.webp', alt: 'Sillón de dos cuerpos tapizado en pana azul en un living', badge: '', telas: ['pana', 'chenille', 'terciopelo'], medidas: { ancho: 168, alto: 80, prof: 95 }, desc: 'Mismo asiento del Almagro grande en dos cuerpos. En pana azul es el que más sale para departamentos chicos.', destacado: false },
  { id: 6, nombre: 'Sillón 2 cuerpos Once', cat: 'dos-tres', cuerpos: 'dos', esCama: false, precio: 478000, descuento: 0, img: 'sillon-blanco-1200x1200.webp', alt: 'Sillón compacto de dos cuerpos tapizado en tela lisa', badge: '', telas: ['ecocuero', 'chenille'], medidas: { ancho: 148, alto: 74, prof: 82 }, desc: 'El más chico y el más barato de la línea. Estructura simple, tapizado liso, ideal para monoambiente o cuarto de estudio.', destacado: false },

  { id: 7, nombre: 'Esquinero Villa Crespo', cat: 'esquineros', cuerpos: 'esquinero', esCama: false, precio: 1149000, descuento: 0, img: 'sillon-gris-1200x1200.webp', alt: 'Sillón esquinero gris con almohadones sobre pared empapelada', badge: 'Más vendido', telas: ['chenille', 'pana', 'lino'], medidas: { ancho: 265, alto: 82, prof: 175 }, desc: 'Esquinero en L con chaise a la izquierda o a la derecha, se define al pedirlo. Viene en dos módulos, así que sube por escalera sin problema.', destacado: true },
  { id: 8, nombre: 'Esquinero Caballito con chaise', cat: 'esquineros', cuerpos: 'esquinero', esCama: false, precio: 1320000, descuento: 0, img: 'sillon-lino-1200x1200.webp', alt: 'Sillón esquinero en lino claro con chaise longue', badge: '', telas: ['lino', 'chenille', 'terciopelo'], medidas: { ancho: 290, alto: 76, prof: 185 }, desc: 'El más grande que hacemos. Chaise con baulera bajo el asiento para guardar mantas y almohadones.', destacado: false },
  { id: 9, nombre: 'Esquinero compacto Flores', cat: 'esquineros', cuerpos: 'esquinero', esCama: false, precio: 985000, descuento: 10, img: 'sillon-pana-azul-1200x1200.webp', alt: 'Sillón esquinero compacto tapizado en pana azul oscuro', badge: '', telas: ['pana', 'chenille'], medidas: { ancho: 230, alto: 78, prof: 155 }, desc: 'Esquinero pensado para living de departamento: 30 cm menos de ancho que el Villa Crespo, mismo asiento.', destacado: false },

  { id: 10, nombre: 'Sofá cama Boedo 2 cuerpos', cat: 'sofa-cama', cuerpos: 'dos', esCama: true, precio: 698000, descuento: 0, img: 'sillon-pana-azul-1200x1200.webp', alt: 'Sofá cama de dos cuerpos tapizado en pana azul', badge: 'Más vendido', telas: ['pana', 'chenille', 'ecocuero'], medidas: { ancho: 172, alto: 82, prof: 94 }, desc: 'Se abre en dos movimientos y queda una plaza y media de 110 cm. El colchón es de espuma alta densidad, no de tela estirada.', destacado: true },
  { id: 11, nombre: 'Sofá cama Boedo 3 cuerpos', cat: 'sofa-cama', cuerpos: 'tres', esCama: true, precio: 845000, descuento: 0, img: 'sillon-gris-1200x1200.webp', alt: 'Sofá cama de tres cuerpos en tela gris', badge: '', telas: ['chenille', 'pana', 'lino'], medidas: { ancho: 205, alto: 82, prof: 94 }, desc: 'Misma mecánica del Boedo chico pero abre en dos plazas de 140 cm. El que se lleva quien recibe visitas seguido.', destacado: false },
  { id: 12, nombre: 'Sofá cama con baulera Liniers', cat: 'sofa-cama', cuerpos: 'dos', esCama: true, precio: 912000, descuento: 12, img: 'sillon-lino-1200x1200.webp', alt: 'Sofá cama claro con baulera bajo el asiento', badge: '', telas: ['lino', 'chenille'], medidas: { ancho: 180, alto: 84, prof: 96 }, desc: 'Abre como cama y además el asiento levanta: adentro entran dos acolchados. Es el que más resuelve en ambientes chicos.', destacado: false },
  { id: 13, nombre: 'Sofá cama esquinero Devoto', cat: 'sofa-cama', cuerpos: 'esquinero', esCama: true, precio: 1290000, descuento: 0, img: 'sillon-blanco-1200x1200.webp', alt: 'Sofá cama esquinero tapizado en tela clara', badge: '', telas: ['chenille', 'ecocuero'], medidas: { ancho: 250, alto: 80, prof: 160 }, desc: 'Esquinero que abre en dos plazas sin mover el mueble de la pared. Viene desarmado en tres módulos.', destacado: false },

  { id: 14, nombre: 'Butaca orejera Constitución', cat: 'butacas', cuerpos: 'butaca', esCama: false, precio: 349000, descuento: 0, img: 'butaca-orejera-1200x1200.webp', alt: 'Butaca orejera capitoné color arena con puff a juego', badge: 'Más vendido', telas: ['lino', 'chenille', 'terciopelo'], medidas: { ancho: 82, alto: 108, prof: 88 }, desc: 'Respaldo alto con orejas y capitoné a mano. Se puede pedir con el puff a juego, que va aparte.', destacado: true },
  { id: 15, nombre: 'Par de butacas Barracas', cat: 'butacas', cuerpos: 'butaca', esCama: false, precio: 685000, descuento: 0, img: 'butacas-cuero-1200x1200.webp', alt: 'Par de butacas capitoné tapizadas en eco cuero marrón', badge: '', telas: ['ecocuero', 'chenille'], medidas: { ancho: 78, alto: 112, prof: 84 }, desc: 'Se venden de a dos porque así se ven mejor. Eco cuero grueso, del que no se pela con el sol de la ventana.', destacado: true },
  { id: 16, nombre: 'Butaca tub Colegiales', cat: 'butacas', cuerpos: 'butaca', esCama: false, precio: 268000, descuento: 0, img: 'butacas-colores-1600x1080.webp', alt: 'Butacas tub tapizadas en rojo y azul con patas de madera clara', badge: 'Nuevo', telas: ['pana', 'chenille', 'terciopelo'], medidas: { ancho: 70, alto: 74, prof: 68 }, desc: 'Chiquita y redonda, entra donde no entra nada. La hacemos en cualquier color de la carta, no solo los de la foto.', destacado: false },
  { id: 17, nombre: 'Puff redondo Chacarita', cat: 'butacas', cuerpos: 'butaca', esCama: false, precio: 118000, descuento: 0, img: 'butaca-orejera-1200x1200.webp', alt: 'Puff redondo tapizado a juego con una butaca orejera', badge: '', telas: ['chenille', 'pana', 'lino', 'ecocuero'], medidas: { ancho: 60, alto: 42, prof: 60 }, desc: 'Sirve de apoyapiés o de asiento extra. Se tapiza en la misma tela que tu sillón si lo pedís junto.', destacado: false },
  { id: 18, nombre: 'Butaca giratoria Saavedra', cat: 'butacas', cuerpos: 'butaca', esCama: false, precio: 392000, descuento: 0, img: 'butacas-colores-1600x1080.webp', alt: 'Butaca giratoria tapizada en tela lisa con base metálica', badge: '', telas: ['pana', 'ecocuero', 'terciopelo'], medidas: { ancho: 74, alto: 82, prof: 76 }, desc: 'Base giratoria de metal con retorno. Es la que ponen en el rincón de la tele para no dar la espalda a la mesa.', destacado: false },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const getTela = id => TELAS.find(t => t.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const precioBase = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const precioCon = (p, telaId) => {
  const t = getTela(telaId);
  const recargo = t && (p.telas || []).includes(telaId) ? t.recargo : 0;
  return Math.round(precioBase(p) * (1 + recargo));
};
const telaMasBarata = p => {
  const disponibles = (p.telas || []).map(getTela).filter(Boolean);
  if (!disponibles.length) return null;
  return disponibles.reduce((a, b) => (b.recargo < a.recargo ? b : a)).id;
};

const Cart = {
  KEY: 'rosacoceres_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, telaId, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.tela === telaId);
    if (existing) existing.qty = Math.min(existing.qty + qty, 20);
    else items.push({ id: producto.id, tela: telaId, qty: Math.min(qty, 20) });
    this.save(items);
  },
  setQty(id, telaId, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.tela === telaId);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 20));
    this.save(items);
  },
  remove(id, telaId) { this.save(this.get().filter(i => !(i.id === id && i.tela === telaId))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioCon(p, i.tela) * i.qty : s;
    }, 0);
  },
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

function swatchesHTML(p) {
  return (p.telas || []).slice(0, 4).map(id => {
    const t = getTela(id);
    return t ? '<span class="swatch" style="background:' + t.color + '" title="' + esc(t.nombre) + '"></span>' : '';
  }).join('');
}

function cardProducto(p, ctx) {
  const base = precioBase(p);
  const cat = getCategoria(p.cat);
  const badges = [];
  if (p.descuento > 0) badges.push('<span class="pill">-' + p.descuento + '%</span>');
  if (p.badge) badges.push('<span class="pill pill-suave">' + esc(p.badge) + '</span>');
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(base) + '</strong><s>' + formatearPrecio(p.precio) + '</s>'
    : '<strong>' + formatearPrecio(base) + '</strong>';
  return '' +
    '<article class="prod" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(38px)">' +
      (badges.length ? '<div class="prod-badges">' + badges.join('') + '</div>' : '') +
      '<div class="prod-media" role="button" tabindex="0" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
        '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
        '<span class="prod-medidas"><span>' + p.medidas.ancho + ' cm ancho</span><span>' + p.medidas.alto + ' cm alto</span><span>' + p.medidas.prof + ' cm fondo</span></span>' +
      '</div>' +
      '<div class="prod-body">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
        '<p class="prod-telas">' + swatchesHTML(p) + '</p>' +
        '<p class="prod-precio">' + precio + '<span class="prod-desde">desde</span></p>' +
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
    const desde = Math.min(...PRODUCTOS.filter(p => p.cat === c.id).map(precioBase));
    return '<a class="cat-card" href="#tienda" data-cat-link="' + c.id + '" data-animate style="opacity:0;transform:translateY(34px)">' +
      '<span class="cat-flecha"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '<div class="cat-media"><img src="' + IMG + c.img + '" width="1200" height="1200" alt="' + esc(c.alt) + '" decoding="async"></div>' +
      '<div class="cat-info">' +
        '<h3>' + esc(c.nombre) + '</h3>' +
        '<p class="cat-desde">Desde ' + formatearPrecio(desde) + '</p>' +
      '</div>' +
    '</a>';
  }).join('');
}

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).slice(0, 8);
  track.innerHTML = destacados.map(p => cardProducto(p, 'rail')).join('');

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

const Catalogo = {
  cont: null, q: '', cat: 'todos', mostrados: 16,
  init() {
    this.cont = document.getElementById('catalogo');
    if (!this.cont) return;
    const chips = document.getElementById('chips');
    chips.innerHTML = [{ id: 'todos', nombre: 'Todos' }].concat(CATEGORIAS)
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
      const telas = (p.telas || []).map(id => getTela(id)?.nombre || '').join(' ');
      const medidas = p.medidas.ancho + ' ' + p.medidas.alto + ' ' + p.medidas.prof;
      const heno = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, telas, medidas].join(' '));
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
      : lista.length + (lista.length === 1 ? ' modelo' : ' modelos') + (hayFiltro ? ' con estos filtros' : ' en la tienda');
    vacio.hidden = lista.length !== 0;
    this.cont.hidden = lista.length === 0;
    verMas.hidden = visibles.length >= lista.length;
    document.querySelector('.vermas-wrap').hidden = verMas.hidden;

    revelarNuevos(this.cont);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  },
};

function pedirQty(id) {
  const out = document.querySelector('[data-qty="' + id + '"]');
  return out ? Math.max(1, parseInt(out.textContent, 10) || 1) : 1;
}

function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const out = document.querySelector('[data-qty="' + step.dataset.id + '"]');
      if (out) {
        const v = Math.max(1, Math.min(20, (parseInt(out.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
        out.textContent = v;
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(parseInt(add.dataset.add, 10));
      if (!p) return;
      const tela = add.dataset.tela || telaMasBarata(p);
      Cart.add(p, tela, pedirQty(p.id));
      showToast('Sumado al pedido: ' + p.nombre);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(parseInt(comprar.dataset.comprar, 10));
      if (!p) return;
      Cart.add(p, comprar.dataset.tela || telaMasBarata(p), pedirQty(p.id));
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

/* ---------- capítulo: armá tu sillón ---------- */

const PREGUNTAS = [
  {
    id: 'cuerpos', titulo: '¿Para cuántos tiene que ser?', etiqueta: 'Tamaño',
    opciones: [
      { v: 'dos', t: 'Dos personas' },
      { v: 'tres', t: 'Tres o más' },
      { v: 'esquinero', t: 'Un esquinero' },
      { v: 'butaca', t: 'Una butaca sola' },
    ],
  },
  {
    id: 'cama', titulo: '¿Necesitás que se abra como cama?', etiqueta: 'Cama',
    opciones: [
      { v: 'si', t: 'Sí, para invitados' },
      { v: 'no', t: 'No hace falta' },
    ],
  },
  {
    id: 'tela', titulo: '¿Con qué tela lo ves?', etiqueta: 'Tela',
    opciones: TELAS.map(t => ({ v: t.id, t: t.nombre })),
  },
];

const Armar = { respuestas: {} };

function armarCandidatos() {
  const r = Armar.respuestas;
  return PRODUCTOS.filter(p => {
    if (r.cama === 'si' && !p.esCama) return false;
    if (r.cuerpos === 'butaca' && p.cuerpos !== 'butaca') return false;
    if (r.cuerpos && r.cuerpos !== 'butaca' && p.cuerpos === 'butaca') return false;
    return true;
  });
}

function armarPuntaje(p) {
  const r = Armar.respuestas;
  let s = 0;
  if (r.cuerpos) s += p.cuerpos === r.cuerpos ? 3 : -1;
  if (r.cama === 'no' && p.esCama) s -= 1;
  if (r.tela) s += (p.telas || []).includes(r.tela) ? 2 : -1;
  if (p.destacado) s += 0.5;
  return s;
}

function armarJustificacion(p) {
  const r = Armar.respuestas;
  const motivos = [];
  if (r.cuerpos && p.cuerpos === r.cuerpos) {
    motivos.push({ dos: 'entra dos', tres: 'entran tres', esquinero: 'es esquinero', butaca: 'es butaca' }[r.cuerpos]);
  }
  if (r.cama === 'si' && p.esCama) motivos.push('se abre como cama');
  if (r.cama === 'no' && !p.esCama) motivos.push('asiento fijo, más mullido');
  if (r.tela && (p.telas || []).includes(r.tela)) motivos.push('lo hacemos en ' + (getTela(r.tela)?.nombre || '').toLowerCase());
  return motivos.length ? 'Por: ' + motivos.join(' + ') : 'Uno de los que más sale';
}

function renderArmarPasos() {
  const cont = document.getElementById('armarPasos');
  if (!cont) return;
  const primeraSinResponder = PREGUNTAS.findIndex(q => !Armar.respuestas[q.id]);
  cont.innerHTML = PREGUNTAS.map((q, i) => {
    const resp = Armar.respuestas[q.id];
    const estado = resp ? 'is-done' : (i === primeraSinResponder ? 'is-on' : '');
    return '<li class="paso ' + estado + '" data-paso="' + q.id + '">' +
      '<div class="paso-cab"><span class="paso-n">0' + (i + 1) + '</span><h3>' + esc(q.titulo) + '</h3></div>' +
      '<div class="opciones">' + q.opciones.map(o =>
        '<button type="button" class="opcion" data-resp="' + q.id + '" data-valor="' + o.v + '" aria-pressed="' + (resp === o.v) + '">' + esc(o.t) + '</button>'
      ).join('') + '</div>' +
    '</li>';
  }).join('');
}

function renderArmarFicha() {
  const cont = document.getElementById('armarFicha');
  const reset = document.getElementById('armarReset');
  if (!cont) return;
  const puestas = PREGUNTAS.filter(q => Armar.respuestas[q.id]);
  reset.hidden = puestas.length === 0;
  if (!puestas.length) {
    cont.innerHTML = '<p class="ficha-vacia">Contestá la primera pregunta y se empieza a llenar.</p>';
    return;
  }
  cont.innerHTML = puestas.map(q => {
    const op = q.opciones.find(o => o.v === Armar.respuestas[q.id]);
    return '<div><dt>' + esc(q.etiqueta) + '</dt><dd>' + esc(op?.t || '') + '</dd></div>';
  }).join('');
}

function volarChip(boton) {
  const destino = document.getElementById('armarFicha');
  if (!boton || !destino || reduceMotion || typeof gsap === 'undefined') return;
  const a = boton.getBoundingClientRect();
  const b = destino.getBoundingClientRect();
  const clon = boton.cloneNode(true);
  clon.style.cssText = 'position:fixed;margin:0;z-index:150;pointer-events:none;left:' + a.left + 'px;top:' + a.top + 'px;width:' + a.width + 'px;height:' + a.height + 'px';
  document.body.appendChild(clon);
  gsap.to(clon, {
    left: b.left + 8, top: b.bottom - 34, scale: .8, opacity: 0,
    duration: .62, ease: 'power2.inOut',
    onComplete: () => clon.remove(),
  });
}

function renderArmarResultado() {
  const wrap = document.getElementById('armarResultado');
  const cont = document.getElementById('armarCards');
  if (!wrap || !cont) return;
  const completo = PREGUNTAS.every(q => Armar.respuestas[q.id]);
  if (!completo) { wrap.hidden = true; cont.innerHTML = ''; return; }

  const top = armarCandidatos()
    .map(p => ({ p, s: armarPuntaje(p) }))
    .sort((a, b) => b.s - a.s || precioBase(a.p) - precioBase(b.p))
    .slice(0, 3)
    .map(x => x.p);

  const estado = (window.Flip && !reduceMotion && !wrap.hidden)
    ? window.Flip.getState('#armarCards .res-card') : null;

  wrap.hidden = false;

  if (!top.length) {
    cont.innerHTML = '<p class="res-nada">Ninguna butaca se abre como cama: las camas arrancan en los sofá cama de dos cuerpos. Cambiá una respuesta y te muestro los que sí.</p>';
    const vm = document.getElementById('armarVerMas');
    if (vm) vm.onclick = () => document.querySelector('[data-chip="sofa-cama"]')?.click();
    return;
  }

  cont.innerHTML = top.map(p => {
    const tela = Armar.respuestas.tela && (p.telas || []).includes(Armar.respuestas.tela)
      ? Armar.respuestas.tela : telaMasBarata(p);
    return '<article class="res-card" data-flip-id="res-' + p.id + '">' +
      '<div class="res-media"><img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
      '<div class="res-body">' +
        '<h4 class="res-nom">' + esc(p.nombre) + '</h4>' +
        '<p class="res-por">' + esc(armarJustificacion(p)) + '</p>' +
        '<p class="res-precio">' + formatearPrecio(precioCon(p, tela)) + '</p>' +
        '<button type="button" class="btn btn-cta btn-sm" data-add="' + p.id + '" data-tela="' + tela + '">Agregar al pedido</button>' +
      '</div>' +
    '</article>';
  }).join('');

  const verMas = document.getElementById('armarVerMas');
  if (verMas) {
    const catSugerida = top[0] ? top[0].cat : 'todos';
    verMas.onclick = () => {
      const chip = document.querySelector('[data-chip="' + catSugerida + '"]');
      if (chip) chip.click();
    };
  }

  if (estado && window.Flip) {
    window.Flip.from(estado, {
      duration: .6, ease: 'power2.inOut', absolute: true, stagger: .06,
      onEnter: els => gsap.fromTo(els, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .45 }),
      onLeave: els => gsap.to(els, { opacity: 0, scale: .92, duration: .3 }),
    });
  } else if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(cont.querySelectorAll('.res-card'), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .5, stagger: .08, ease: 'power2.out' });
  }
}

function initArmar() {
  const cont = document.getElementById('armarPreguntas');
  if (!cont) return;
  renderArmarPasos();
  renderArmarFicha();
  cont.addEventListener('click', e => {
    const b = e.target.closest('[data-resp]');
    if (!b) return;
    const { resp, valor } = b.dataset;
    Armar.respuestas[resp] = Armar.respuestas[resp] === valor ? undefined : valor;
    if (Armar.respuestas[resp] === undefined) delete Armar.respuestas[resp];
    else volarChip(b);
    renderArmarPasos();
    renderArmarFicha();
    renderArmarResultado();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  document.getElementById('armarReset')?.addEventListener('click', () => {
    Armar.respuestas = {};
    renderArmarPasos();
    renderArmarFicha();
    renderArmarResultado();
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
      '<p class="cart-vacio-t">Todavía no elegiste nada</p>' +
      '<p>Mirá los modelos, elegí la tela y sumalos acá. Después lo confirmamos por WhatsApp.</p>' +
      '<a class="btn btn-cta" href="#tienda" data-cerrar-drawer>Ver los sillones</a>' +
      '</div>';
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const tela = getTela(i.tela);
    return '<div class="cart-line">' +
      '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
      '<div>' +
        '<p class="cart-nom">' + esc(p.nombre) + '</p>' +
        '<p class="cart-tela">Tela: ' + esc(tela?.nombre || 'a definir') + '</p>' +
        '<p class="cart-precio">' + formatearPrecio(precioCon(p, i.tela)) + ' c/u</p>' +
        '<div class="stepper">' +
          '<button type="button" data-cart-step="-1" data-id="' + p.id + '" data-tela="' + esc(i.tela) + '" aria-label="Quitar uno de ' + esc(p.nombre) + '">−</button>' +
          '<output>' + i.qty + '</output>' +
          '<button type="button" data-cart-step="1" data-id="' + p.id + '" data-tela="' + esc(i.tela) + '" aria-label="Sumar uno de ' + esc(p.nombre) + '">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-col-der">' +
        '<span class="cart-precio">' + formatearPrecio(precioCon(p, i.tela) * i.qty) + '</span>' +
        '<button type="button" class="cart-quitar" data-cart-remove="' + p.id + '" data-tela="' + esc(i.tela) + '">Quitar</button>' +
      '</div>' +
    '</div>';
  }).join('');

  const detalle = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return p.nombre + ' en ' + (getTela(i.tela)?.nombre || 'tela a definir') + ' x' + i.qty;
  }).filter(Boolean).join(', ');

  foot.innerHTML = '<p class="cart-total"><span>Total</span><strong>' + formatearPrecio(Cart.total()) + '</strong></p>' +
    '<button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>' +
    '<a class="btn btn-line" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola Rosa, quiero encargar: ' + detalle + '.') + '" target="_blank" rel="noopener">Confirmar por WhatsApp</a>' +
    '<p class="cart-nota">Se fabrica a pedido: entre 15 y 20 días desde que confirmás.</p>';
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
      const tela = s.dataset.tela;
      const paso = parseInt(s.dataset.cartStep, 10);
      const it = Cart.get().find(i => i.id === id && i.tela === tela);
      if (!it) return;
      if (it.qty + paso < 1) Cart.remove(id, tela);
      else Cart.setQty(id, tela, it.qty + paso);
      return;
    }
    const r = e.target.closest('[data-cart-remove]');
    if (r) { Cart.remove(parseInt(r.dataset.cartRemove, 10), r.dataset.tela); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    if (e.target.closest('#finalizar')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  renderDrawer();
}

/* ---------- modal ---------- */

let ultimoFocoModal = null;

function cotasSVG(p) {
  const { ancho, alto } = p.medidas;
  return '<div class="cotas" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none">' +
    '<path class="cota-linea" vector-effect="non-scaling-stroke" d="M8 93 H92 M8 89 V97 M92 89 V97" />' +
    '<path class="cota-linea" vector-effect="non-scaling-stroke" d="M5 12 V84 M1 12 H9 M1 84 H9" />' +
    '</svg>' +
    '<svg viewBox="0 0 100 100">' +
    '<rect class="cota-fondo" x="35" y="88.5" width="30" height="9" rx="1"/>' +
    '<text class="cota-txt" x="50" y="95" text-anchor="middle">' + ancho + ' cm</text>' +
    '<rect class="cota-fondo" x="1" y="43" width="26" height="9" rx="1"/>' +
    '<text class="cota-txt" x="14" y="49.5" text-anchor="middle">' + alto + ' cm</text>' +
    '</svg></div>';
}

function pintarPrecioModal(p, telaId) {
  const cont = document.getElementById('modalPrecio');
  if (!cont) return;
  const final = precioCon(p, telaId);
  const t = getTela(telaId);
  const extra = t && t.recargo > 0 ? '<span class="tela-extra">incluye ' + Math.round(t.recargo * 100) + '% por ' + esc(t.nombre.toLowerCase()) + '</span>' : '';
  cont.innerHTML = (p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(Math.round(p.precio * (1 + (t?.recargo || 0)))) + '</s><span class="pill">-' + p.descuento + '%</span>'
    : '<strong>' + formatearPrecio(final) + '</strong>') + extra;
  document.querySelectorAll('#modalPanel [data-add], #modalPanel [data-comprar]').forEach(b => { b.dataset.tela = telaId; });
}

function abrirModal(id) {
  const p = getProducto(id);
  const modal = document.getElementById('modal');
  const bd = document.getElementById('modalBackdrop');
  const panel = document.getElementById('modalPanel');
  if (!p || !modal || !bd || !panel) return;
  ultimoFocoModal = document.activeElement;
  const cat = getCategoria(p.cat);
  const sug = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const telaInicial = telaMasBarata(p);

  panel.innerHTML = '' +
    '<button type="button" class="icon-btn modal-cerrar" id="modalCerrar" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg></button>' +
    '<div class="modal-grid">' +
      '<div class="modal-media">' +
        '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
        cotasSVG(p) +
      '</div>' +
      '<div class="modal-info">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h2 id="modalTitulo">' + esc(p.nombre) + '</h2>' +
        '<p class="modal-precio" id="modalPrecio"></p>' +
        '<p class="modal-desc">' + esc(p.desc) + '</p>' +
        '<p class="telas-cap">Elegí la tela</p>' +
        '<div class="telas-opts" id="telasOpts">' + (p.telas || []).map(tid => {
          const t = getTela(tid);
          if (!t) return '';
          return '<button type="button" class="tela-btn" data-tela-op="' + tid + '" aria-pressed="' + (tid === telaInicial) + '">' +
            '<span class="swatch" style="background:' + t.color + '"></span>' + esc(t.nombre) + '</button>';
        }).join('') + '</div>' +
        '<dl class="modal-ficha">' +
          '<div><dt>Ancho</dt><dd>' + p.medidas.ancho + ' cm</dd></div>' +
          '<div><dt>Alto</dt><dd>' + p.medidas.alto + ' cm</dd></div>' +
          '<div><dt>Fondo</dt><dd>' + p.medidas.prof + ' cm</dd></div>' +
        '</dl>' +
        '<div class="modal-actions">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" data-id="' + p.id + '" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-cta" data-add="' + p.id + '" data-tela="' + telaInicial + '">Agregar al pedido</button>' +
          '<button type="button" class="btn btn-line" data-comprar="' + p.id + '" data-tela="' + telaInicial + '">Comprar ahora</button>' +
        '</div>' +
        (sug.length ? '<div class="modal-sug"><h3>De la misma línea</h3><div class="sug-grid">' +
          sug.map(s => '<button type="button" class="sug-card" data-ver="' + s.id + '">' +
            '<img src="' + IMG + s.img + '" width="1200" height="1200" alt="' + esc(s.alt) + '" decoding="async">' +
            '<span class="sug-nom">' + esc(s.nombre) + '</span>' +
            '<span class="sug-precio">' + formatearPrecio(precioBase(s)) + '</span>' +
          '</button>').join('') + '</div></div>' : '') +
      '</div>' +
    '</div>';

  pintarPrecioModal(p, telaInicial);

  document.getElementById('telasOpts')?.addEventListener('click', e => {
    const b = e.target.closest('[data-tela-op]');
    if (!b) return;
    document.querySelectorAll('[data-tela-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintarPrecioModal(p, b.dataset.telaOp);
  });

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

function initHero() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  const foto = document.querySelector('.hero-foto img');
  if (foto) gsap.fromTo(foto, { scale: 1.1 }, { scale: 1, duration: 1.5, ease: 'power2.out' });
  const etiqueta = document.querySelector('.etiqueta-hero');
  if (etiqueta) gsap.fromTo(etiqueta, { rotation: -9 }, { rotation: -3, duration: 1.1, delay: .5, ease: 'elastic.out(1, 0.5)' });
  if (typeof ScrollTrigger === 'undefined') return;
  if (foto) {
    gsap.to(foto, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
  }
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const grafo = [{
    '@type': 'FurnitureStore',
    '@id': base + '#negocio',
    name: 'Rosa Cóceres',
    description: 'Sillones, esquineros, sofá cama y butacas fabricados en Buenos Aires y vendidos directo de fábrica.',
    telephone: '+54 9 11 6695-4085',
    image: base + 'images/hero-terciopelo-verde-1600x1400.webp',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
    areaServed: 'Argentina',
  }].concat(PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: base + 'images/' + p.img,
    category: getCategoria(p.cat)?.nombre,
    width: { '@type': 'QuantitativeValue', value: p.medidas.ancho, unitCode: 'CMT' },
    height: { '@type': 'QuantitativeValue', value: p.medidas.alto, unitCode: 'CMT' },
    depth: { '@type': 'QuantitativeValue', value: p.medidas.prof, unitCode: 'CMT' },
    brand: { '@type': 'Brand', name: 'Rosa Cóceres' },
    offers: {
      '@type': 'Offer',
      price: precioBase(p),
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
  if (window.Flip) gsap.registerPlugin(window.Flip);
}
if (typeof gsap === 'undefined') {
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
}

document.getElementById('anio').textContent = new Date().getFullYear();

initCategorias();
initRail();
Catalogo.init();
initArmar();
initReveals();
initNav();
initAcciones();
initDrawer();
initModal();
initFloats();
initHero();
initLeeScroll();
initJsonLd();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
