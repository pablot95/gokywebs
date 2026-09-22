const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493794914489';
const TALLES = [35, 36, 37, 38, 39, 40, 41];

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const wsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

const CATEGORIAS = [
  { id: 'botas', nombre: 'Botas y botines', pie: 'Media caña y botinetas', img: 'images/cat-botas-4x5.webp' },
  { id: 'sandalias', nombre: 'Sandalias', pie: 'Planas, plataforma y taco', img: 'images/cat-sandalias-4x5.webp' },
  { id: 'tacones', nombre: 'Tacones y zapatos', pie: 'Stilettos y destalonados', img: 'images/cat-tacones-4x5.webp' },
  { id: 'chatas', nombre: 'Chatas y mocasines', pie: 'Para todo el día', img: 'images/prod-mocasines-marfil.webp' }
];

const PRODUCTOS = [
  {
    id: 'p01', nombre: 'Botín Taupe Charol', cat: 'botas', material: 'Gamuza', taco: 7, tono: 'Taupe',
    precio: 68900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 12,
    img: 'images/prod-botines-taupe.webp', etiquetas: ['botin', 'taupe', 'gamuza'],
    desc: 'Botín de gamuza con taco de madera de 7 cm y cierre lateral. El tono taupe combina con jean y con pollera por igual.'
  },
  {
    id: 'p02', nombre: 'Stiletto Nude Punta Fina', cat: 'tacones', material: 'Cuero', taco: 10, tono: 'Nude',
    precio: 74500, descuento: 0, talles: [35, 36, 37, 38, 39], stock: 8,
    img: 'images/prod-tacones-nude.webp', etiquetas: ['stiletto', 'nude', 'fiesta'],
    desc: 'El clásico que alarga la pierna: punta fina, taco aguja de 10 cm y cuero nude que combina con cualquier look de noche.'
  },
  {
    id: 'p03', nombre: 'Mocasín Marfil Hebilla Dorada', cat: 'chatas', material: 'Lienzo y cuero', taco: 1, tono: 'Marfil',
    precio: 52900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 15,
    img: 'images/prod-mocasines-marfil.webp', etiquetas: ['mocasin', 'marfil', 'hebilla'],
    desc: 'Mocasín de lienzo texturado con hebilla metálica dorada. Piso bajo para caminar todo el día sin resignar estilo.'
  },
  {
    id: 'p04', nombre: 'Sandalia Marfil de Tiras', cat: 'sandalias', material: 'Cuero', taco: 8, tono: 'Marfil',
    precio: 58900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 10,
    img: 'images/prod-sandalias-marfil.webp', etiquetas: ['sandalia', 'marfil', 'tiras'],
    desc: 'Sandalia de tiras finas cruzadas con hebilla al tobillo y taco ancho de 8 cm, el equilibrio justo entre firme y cómodo.'
  },
  {
    id: 'p05', nombre: 'Zapato de Encaje Marfil', cat: 'tacones', material: 'Encaje y raso', taco: 9, tono: 'Marfil',
    precio: 82900, descuento: 10, talles: [35, 36, 37, 38], stock: 6,
    img: 'images/hero-16x9.webp', etiquetas: ['zapato', 'encaje', 'fiesta'],
    desc: 'Punta fina revestida en encaje bordado sobre raso marfil. La pieza que se guarda para la ocasión especial.'
  },
  {
    id: 'p06', nombre: 'Botín Croquet Negro', cat: 'botas', material: 'Cuero', taco: 6, tono: 'Negro',
    precio: 71900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 9,
    img: null, etiquetas: ['botin', 'negro', 'cuero'],
    desc: 'Botín de cuero liso con costura visible y taco cubano de 6 cm. El básico que nunca falta en un placard prolijo.'
  },
  {
    id: 'p07', nombre: 'Bota Caña Alta Camel', cat: 'botas', material: 'Cuero', taco: 5, tono: 'Camel',
    precio: 96500, descuento: 0, talles: [36, 37, 38, 39, 40], stock: 5,
    img: null, etiquetas: ['bota', 'camel', 'invierno'],
    desc: 'Bota de caña alta hasta la rodilla en cuero camel, con taco bajo de 5 cm pensado para caminar el día entero.'
  },
  {
    id: 'p08', nombre: 'Botineta Serraje Gris', cat: 'botas', material: 'Serraje', taco: 4, tono: 'Gris',
    precio: 61900, descuento: 15, talles: [35, 36, 37, 38, 39], stock: 7,
    img: null, etiquetas: ['botineta', 'gris', 'serraje'],
    desc: 'Botineta corta de serraje gris con elástico lateral, sin cordones ni cierres. Se calza en un segundo.'
  },
  {
    id: 'p09', nombre: 'Sandalia Plataforma Natural', cat: 'sandalias', material: 'Yute y cuero', taco: 9, tono: 'Natural',
    precio: 64900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 11,
    img: null, etiquetas: ['sandalia', 'plataforma', 'verano'],
    desc: 'Plataforma de yute forrada en cuero natural, con tira ancha al empeine. Suma altura sin perder estabilidad.'
  },
  {
    id: 'p10', nombre: 'Sandalia Trenzada Dorada', cat: 'sandalias', material: 'Cuero metalizado', taco: 6, tono: 'Dorado',
    precio: 59900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 13,
    img: null, etiquetas: ['sandalia', 'dorado', 'trenzada'],
    desc: 'Tiras trenzadas en cuero metalizado dorado sobre taco cubano de 6 cm. El brillo justo para una salida de noche.'
  },
  {
    id: 'p11', nombre: 'Sandalia Plana Cuero', cat: 'sandalias', material: 'Cuero', taco: 1, tono: 'Natural',
    precio: 41900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 18,
    img: null, etiquetas: ['sandalia', 'plana', 'diario'],
    desc: 'Sandalia plana de cuero con doble tira cruzada, la que se usa todos los días de calor sin pensarlo.'
  },
  {
    id: 'p12', nombre: 'Stiletto Charol Negro', cat: 'tacones', material: 'Charol', taco: 10, tono: 'Negro',
    precio: 76900, descuento: 0, talles: [35, 36, 37, 38, 39], stock: 6,
    img: null, etiquetas: ['stiletto', 'negro', 'charol'],
    desc: 'El negro de charol brillante que combina con todo, con taco aguja de 10 cm y horma que estiliza el empeine.'
  },
  {
    id: 'p13', nombre: 'Zapato Destalonado Beige', cat: 'tacones', material: 'Cuero', taco: 5, tono: 'Beige',
    precio: 54900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 10,
    img: null, etiquetas: ['destalonado', 'beige', 'oficina'],
    desc: 'Destalonado de taco bajo en cuero beige, cómodo para el día de oficina y con la elegancia de un zapato cerrado.'
  },
  {
    id: 'p14', nombre: 'Taco Ancho Cuero Blanco', cat: 'tacones', material: 'Cuero', taco: 7, tono: 'Blanco',
    precio: 63900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 9,
    img: null, etiquetas: ['taco', 'blanco', 'primavera'],
    desc: 'Taco ancho de 7 cm en cuero blanco liso. Estable para caminar y con ese tono que ilumina cualquier look.'
  },
  {
    id: 'p15', nombre: 'Chata Trenzada Natural', cat: 'chatas', material: 'Cuero trenzado', taco: 1, tono: 'Natural',
    precio: 45900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 14,
    img: null, etiquetas: ['chata', 'trenzada', 'natural'],
    desc: 'Chata de cuero trenzado a mano, piso totalmente plano y capellada abierta al costado para que el pie respire.'
  },
  {
    id: 'p16', nombre: 'Mocasín Croco Camel', cat: 'chatas', material: 'Cuero texturado', taco: 2, tono: 'Camel',
    precio: 55900, descuento: 0, talles: [35, 36, 37, 38, 39], stock: 8,
    img: null, etiquetas: ['mocasin', 'croco', 'camel'],
    desc: 'Mocasín con textura croco en tono camel y borde cosido a mano. Un clásico que se usa de enero a diciembre.'
  },
  {
    id: 'p17', nombre: 'Chata Lazo Satén', cat: 'chatas', material: 'Satén', taco: 1, tono: 'Marfil',
    precio: 38900, descuento: 0, talles: [35, 36, 37, 38, 39, 40, 41], stock: 16,
    img: null, etiquetas: ['chata', 'lazo', 'saten'],
    desc: 'Chata de satén marfil con lazo al frente, punta redonda. La opción liviana para un casamiento o una cena.'
  },
  {
    id: 'p18', nombre: 'Bota Texana Camel', cat: 'botas', material: 'Cuero', taco: 4, tono: 'Camel',
    precio: 89900, descuento: 0, talles: [36, 37, 38, 39, 40, 41], stock: 4,
    img: null, etiquetas: ['bota', 'texana', 'camel'],
    desc: 'Bota texana de punta fina con costura decorativa, taco bajo de 4 cm. El toque country que no pasa de moda.'
  },
  {
    id: 'p19', nombre: 'Sandalia Doble Hebilla', cat: 'sandalias', material: 'Cuero', taco: 3, tono: 'Negro',
    precio: 47900, descuento: 0, talles: [35, 36, 37, 38, 39, 40], stock: 12,
    img: null, etiquetas: ['sandalia', 'negro', 'hebilla'],
    desc: 'Sandalia de piso con doble hebilla ajustable al empeine y al tobillo, en cuero negro que no pasa de moda.'
  },
  {
    id: 'p20', nombre: 'Stiletto Metalizado Champagne', cat: 'tacones', material: 'Cuero metalizado', taco: 10, tono: 'Champagne',
    precio: 79900, descuento: 0, talles: [35, 36, 37, 38], stock: 5,
    img: null, etiquetas: ['stiletto', 'champagne', 'fiesta'],
    desc: 'El brillo metalizado en tono champagne sobre un stiletto de 10 cm, pensado para la foto de la fiesta.'
  }
];

const Cart = {
  KEY: 'elusirteshoes_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, talle, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
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

const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function placaHTML(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  return `<span class="placa" aria-hidden="true">
      <span class="placa__dato">${p.taco}<small>cm</small></span>
      <span class="placa__cat">${esc(cat ? cat.nombre : '')}</span>
    </span>`;
}

function medioHTML(p) {
  if (!p.img) return placaHTML(p);
  return `<img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1600" loading="lazy">`;
}

/* ---------- Categorías ---------- */

function initCategorias() {
  const tarjetas = document.getElementById('colecciones');
  if (!tarjetas) return;
  tarjetas.innerHTML = CATEGORIAS.slice(0, 3).map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `<button type="button" class="coleccion" data-cat="${c.id}" data-animate style="opacity:0;transform:translateY(28px)">
      <span class="coleccion__foto"><img src="${c.img}" alt="${esc(c.nombre)}" width="960" height="1200" loading="lazy"></span>
      <span class="coleccion__txt">
        <span>
          <span class="coleccion__nom">${esc(c.nombre)}</span>
          <span class="coleccion__n">${esc(c.pie)} · ${n} modelos</span>
        </span>
        <span class="coleccion__ir">${ICONO_FLECHA}</span>
      </span>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', e => {
      if (el.tagName === 'A') e.preventDefault();
      aplicarCategoria(el.dataset.cat);
    });
  });
}

function aplicarCategoria(cat) {
  document.querySelectorAll('input[data-f="cat"]').forEach(inp => { inp.checked = inp.value === cat; });
  estado.pagina = 1;
  renderCatalogo();
  const c = CATEGORIAS.find(x => x.id === cat);
  if (c) showToast(`Catálogo filtrado: ${c.nombre}`);
  // Diferido: si el click vino del nav mobile, su propio listener de cierre
  // (agregado después, en initNav) todavía no sacó body.no-scroll en este
  // mismo tick, y scrollIntoView no mueve nada con overflow:hidden activo.
  setTimeout(() => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }, 0);
}

function aplicarTalle(talle) {
  document.querySelectorAll('input[data-f="talle"]').forEach(inp => { inp.checked = Number(inp.value) === talle; });
  estado.pagina = 1;
  renderCatalogo();
}

/* ---------- Catálogo ---------- */

const POR_PAGINA = 16;
const estado = { q: '', orden: 'destacados', pagina: 1 };

function leerFiltros(grupo) {
  return [...document.querySelectorAll(`input[data-f="${grupo}"]:checked`)].map(i => i.value);
}

function filtrar() {
  const q = normalizar(estado.q).split(/\s+/).filter(Boolean);
  const cats = leerFiltros('cat');
  const talles = leerFiltros('talle').map(Number);
  const precios = leerFiltros('precio');

  let lista = PRODUCTOS.filter(p => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (talles.length && !talles.every(t => p.talles.includes(t))) return false;
    if (precios.length) {
      const v = precioFinal(p);
      const ok = precios.some(r => (r === 'bajo' && v < 55000) || (r === 'medio' && v >= 55000 && v <= 75000) || (r === 'alto' && v > 75000));
      if (!ok) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.cat, p.material, p.tono, p.desc, p.etiquetas.join(' '), CATEGORIAS.find(c => c.id === p.cat)?.nombre].join(' '));
      if (!q.every(t => texto.includes(t))) return false;
    }
    return true;
  });

  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'taco') lista = lista.slice().sort((a, b) => b.taco - a.taco);

  return lista;
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 5) badges.push(`<span class="badge badge--ink">Quedan ${p.stock}</span>`);

  return `<article class="prod" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(26px)">
    <div class="prod__foto-wrap" style="position:relative">
      ${badges.length ? `<div class="prod__badges">${badges.join('')}</div>` : ''}
      <button type="button" class="prod__foto" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
        ${medioHTML(p)}
        <span class="prod__ver">Ver la ficha</span>
      </button>
    </div>
    <div class="prod__body">
      <span class="prod__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h3 class="prod__nom">${esc(p.nombre)}</h3>
      <div class="prod__precios">
        <span class="prod__precio${p.descuento > 0 ? ' prod__precio--off' : ''}">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <p class="prod__talles">Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]}</p>
      <div class="prod__actions">
        <span class="stepper">
          <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
          <span data-qty="${p.id}">1</span>
          <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
        </span>
        <button type="button" class="prod-add" data-ver="${p.id}">Elegir talle</button>
      </div>
    </div>
  </article>`;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;
  const lista = filtrar();
  const visibles = lista.slice(0, estado.pagina * POR_PAGINA);

  grid.classList.toggle('is-vacio', lista.length === 0);
  if (!lista.length) {
    grid.innerHTML = `<div class="vacio">
      <h3>No encontramos modelos con esa combinación</h3>
      <p>Probá con menos filtros o escribinos y te decimos qué tenemos disponible en tu talle.</p>
      <button type="button" class="btn btn--linea btn--sm" id="vacio-limpiar"><span>Limpiar filtros</span></button>
    </div>`;
    document.getElementById('vacio-limpiar')?.addEventListener('click', limpiarFiltros);
  } else {
    grid.innerHTML = visibles.map(cardHTML).join('');
  }

  const cont = document.getElementById('contador');
  if (cont) cont.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'modelo' : 'modelos'} en el catálogo`;

  const vermas = document.getElementById('vermas');
  if (vermas) {
    const quedan = lista.length - visibles.length;
    vermas.hidden = quedan <= 0;
    if (quedan > 0) vermas.querySelector('span').textContent = `Ver ${Math.min(quedan, POR_PAGINA)} modelos más`;
  }

  revelarNuevos(grid);
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function limpiarFiltros() {
  document.querySelectorAll('input[data-f]').forEach(i => { i.checked = false; });
  const buscador = document.getElementById('q');
  if (buscador) buscador.value = '';
  estado.q = '';
  estado.pagina = 1;
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  estado.orden = 'destacados';
  renderCatalogo();
}

function initFiltrosTalle() {
  const cont = document.getElementById('filtros-talles');
  if (!cont) return;
  cont.innerHTML = TALLES.map(t => `<label class="filtro-op filtro-op--talle">
      <input type="checkbox" data-f="talle" value="${t}" class="sr-only">
      <span class="talle-chip" aria-hidden="true">${t}</span>
    </label>`).join('');
  cont.querySelectorAll('input[data-f="talle"]').forEach(inp => {
    inp.addEventListener('change', () => {
      inp.nextElementSibling.setAttribute('aria-pressed', String(inp.checked));
    });
  });
}

function initCatalogo() {
  const grid = document.getElementById('catalogo');
  if (!grid) return;

  document.querySelectorAll('input[data-f]').forEach(inp => {
    inp.addEventListener('change', () => { estado.pagina = 1; renderCatalogo(); });
  });

  const form = document.getElementById('form-buscar');
  const input = document.getElementById('q');
  if (form && input) {
    form.addEventListener('submit', e => { e.preventDefault(); estado.q = input.value; estado.pagina = 1; renderCatalogo(); });
    let t;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { estado.q = input.value; estado.pagina = 1; renderCatalogo(); }, 220);
    });
  }

  const orden = document.getElementById('orden');
  orden?.addEventListener('change', () => { estado.orden = orden.value; estado.pagina = 1; renderCatalogo(); });

  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vermas')?.addEventListener('click', () => { estado.pagina++; renderCatalogo(); });

  grid.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const span = grid.querySelector(`[data-qty="${step.dataset.id}"]`);
      if (!span) return;
      const p = getProducto(step.dataset.id);
      const val = Math.max(1, Math.min(parseInt(span.textContent, 10) + parseInt(step.dataset.step, 10), p?.stock ?? 99));
      span.textContent = val;
      return;
    }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });

  const toggle = document.getElementById('filtros-toggle');
  const panel = document.getElementById('filtros');
  const cerrar = document.getElementById('filtros-cerrar');
  if (toggle && panel) {
    const cerrarPanel = () => {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const abierto = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(abierto));
      document.body.classList.toggle('no-scroll', abierto);
      if (abierto) panel.querySelector('input')?.focus();
    });
    cerrar?.addEventListener('click', cerrarPanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  }

  initFiltrosTalle();
  renderCatalogo();
}

/* ---------- Vista rápida ---------- */

let ultimoFoco = null;

function abrirModal(id) {
  const p = getProducto(id);
  const back = document.getElementById('modal-backdrop');
  if (!p || !back) return;
  ultimoFoco = document.activeElement;
  const final = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  back.querySelector('.modal__grid').innerHTML = `
    <div class="modal__foto">${medioHTML(p)}</div>
    <div class="modal__info">
      <span class="modal__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h2 id="modal-titulo-txt">${esc(p.nombre)}</h2>
      <div class="modal__precio">
        <b>${formatearPrecio(final)}</b>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
      </div>
      <p>${esc(p.desc)}</p>
      <div class="modal__talles">
        <span>Elegí tu talle</span>
        <div class="modal__talles-fila" data-talles-modal="${p.id}">
          ${p.talles.map((t, i) => `<button type="button" class="talle-chip" data-talle-modal="${t}" aria-pressed="${i === 0}">${t}</button>`).join('')}
        </div>
      </div>
      <dl class="modal__ficha">
        <div><dt>Material</dt><dd>${esc(p.material)}</dd></div>
        <div><dt>Altura de taco</dt><dd>${p.taco} cm</dd></div>
        <div><dt>Color</dt><dd>${esc(p.tono)}</dd></div>
        <div><dt>En showroom</dt><dd>${p.stock} ${p.stock === 1 ? 'par' : 'pares'}</dd></div>
      </dl>
      <div class="modal__acc">
        <button type="button" class="btn btn--cta" data-modal-add="${p.id}"><span>Agregar al carrito</span></button>
        <a class="btn btn--linea" href="${wsp(`Hola ELusirte shoes, me interesa ${p.nombre} en talle ${p.talles[0]} (${formatearPrecio(final)}). ¿Está disponible?`)}" target="_blank" rel="noopener"><span>Consultar</span></a>
      </div>
      ${relacionados.length ? `<div class="modal__tambien">
        <p>También te puede interesar</p>
        <div class="modal__mini">
          ${relacionados.map(r => `<button type="button" class="mini" data-ver="${r.id}">
            <span class="mini__foto">${medioHTML(r)}</span>
            <span>${esc(r.nombre)}</span>
          </button>`).join('')}
        </div>
      </div>` : ''}
    </div>`;

  const talleRow = back.querySelector(`[data-talles-modal="${p.id}"]`);
  let talleElegido = p.talles[0];
  talleRow?.addEventListener('click', e => {
    const btn = e.target.closest('[data-talle-modal]');
    if (!btn) return;
    talleElegido = Number(btn.dataset.talleModal);
    talleRow.querySelectorAll('.talle-chip').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  });
  back.dataset.talleActivo = talleElegido;
  back.querySelector('[data-modal-add]')?.addEventListener('click', () => {
    Cart.add(p, talleElegido, 1);
    showToast(`${p.nombre} (talle ${talleElegido}) está en el carrito`);
  });

  back.hidden = false;
  requestAnimationFrame(() => back.classList.add('open'));
  document.body.classList.add('no-scroll');
  back.querySelector('.modal__cerrar')?.focus();
}

function cerrarModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back || back.hidden) return;
  back.classList.remove('open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { back.hidden = true; }, 320);
  ultimoFoco?.focus();
}

function initModal() {
  const back = document.getElementById('modal-backdrop');
  if (!back) return;
  back.addEventListener('click', e => {
    if (e.target === back) { cerrarModal(); return; }
    if (e.target.closest('.modal__cerrar')) { cerrarModal(); return; }
    const ver = e.target.closest('[data-ver]');
    if (ver) abrirModal(ver.dataset.ver);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !back.hidden) cerrarModal();
    if (e.key === 'Tab' && !back.hidden) trapFoco(e, back.querySelector('.modal'));
  });
}

function trapFoco(e, cont) {
  if (!cont) return;
  const focusables = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const primero = focusables[0];
  const ultimo = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

/* ---------- Carrito ---------- */

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function renderCarrito() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-total');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="carrito-vacio">
      <h3>Todavía no elegiste nada</h3>
      <p>Empezá por «Encontrá tu talle» o mirá el catálogo completo.</p>
      <button type="button" class="btn btn--linea btn--sm" data-cerrar-drawer><span>Ver el catálogo</span></button>
    </div>`;
  } else {
    body.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      if (!p) return '';
      return `<div class="linea">
        <span class="linea__foto">${medioHTML(p)}</span>
        <span>
          <span class="linea__nom">${esc(p.nombre)}</span>
          <span class="linea__precio">Talle ${i.talle} · ${i.qty} × ${formatearPrecio(precioFinal(p))}</span>
        </span>
        <span class="linea__acc">
          <button type="button" class="linea__quitar" data-quitar-id="${p.id}" data-quitar-talle="${i.talle}" aria-label="Quitar ${esc(p.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg></button>
        </span>
      </div>`;
    }).join('');
  }
  if (foot) foot.textContent = formatearPrecio(Cart.total());
  const finalizar = document.getElementById('finalizar');
  if (finalizar) finalizar.disabled = !items.length;
}

function abrirDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  ultimoFoco = document.activeElement;
  drawer.removeAttribute('inert');
  back.classList.add('open');
  drawer.classList.add('open');
  document.body.classList.add('no-scroll');
  drawer.querySelector('button')?.focus();
}

function cerrarDrawer() {
  const back = document.getElementById('drawer-backdrop');
  const drawer = document.getElementById('drawer');
  if (!drawer || !back) return;
  back.classList.remove('open');
  drawer.classList.remove('open');
  drawer.setAttribute('inert', '');
  document.body.classList.remove('no-scroll');
  ultimoFoco?.focus();
}

function initCarrito() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirDrawer));
  document.getElementById('drawer-backdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawer-cerrar')?.addEventListener('click', cerrarDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) cerrarDrawer();
    if (e.key === 'Tab' && drawer.classList.contains('open')) trapFoco(e, drawer);
  });
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(); return; }
    const quitar = e.target.closest('[data-quitar-id]');
    if (quitar) { Cart.remove(quitar.dataset.quitarId, Number(quitar.dataset.quitarTalle)); return; }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { renderCarrito(); updateCartBadge(); });
  renderCarrito();
  updateCartBadge();
}

/* ---------- Componente: Encontrá tu talle ---------- */

const buscarTalle = { talle: null, ancho: false };

function calcularTalle() {
  if (!buscarTalle.talle) return [];
  return PRODUCTOS.filter(p => p.talles.includes(buscarTalle.talle));
}

function renderTalleFinder() {
  const num = document.getElementById('finder-num');
  const desglose = document.getElementById('finder-desglose');
  const acc = document.getElementById('finder-acc');
  const nota = document.getElementById('finder-nota');
  if (!num) return;

  const coincidencias = calcularTalle();

  if (!buscarTalle.talle) {
    num.innerHTML = '—';
    if (desglose) desglose.innerHTML = '';
    if (acc) acc.innerHTML = '';
    if (nota) nota.textContent = 'Elegí tu talle para ver cuántos pares tenemos.';
    return;
  }

  num.innerHTML = `${coincidencias.length}<span>${coincidencias.length === 1 ? 'par disponible' : 'pares disponibles'}</span>`;

  if (desglose) {
    const porCat = {};
    coincidencias.forEach(p => { porCat[p.cat] = (porCat[p.cat] || 0) + 1; });
    desglose.innerHTML = Object.entries(porCat).map(([cat, n]) => {
      const c = CATEGORIAS.find(x => x.id === cat);
      return `<span>${n} en ${esc(c ? c.nombre.toLowerCase() : cat)}</span>`;
    }).join('');
  }

  if (acc) {
    acc.innerHTML = coincidencias.length
      ? `<button type="button" class="btn btn--cta btn--sm" id="finder-ver"><span>Ver los ${coincidencias.length} pares en talle ${buscarTalle.talle}</span></button>
         <a class="btn btn--linea btn--sm" href="${wsp(`Hola ELusirte shoes, calzo talle ${buscarTalle.talle}${buscarTalle.ancho ? ' y necesito horma ancha' : ''}. ¿Qué modelos tienen disponibles?`)}" target="_blank" rel="noopener"><span>Consultar por WhatsApp</span></a>`
      : `<a class="btn btn--linea btn--sm" href="${wsp(`Hola ELusirte shoes, calzo talle ${buscarTalle.talle} y no encontré modelos disponibles en la web. ¿Tienen algo en ese talle?`)}" target="_blank" rel="noopener"><span>Consultar por WhatsApp</span></a>`;
    document.getElementById('finder-ver')?.addEventListener('click', () => {
      aplicarTalle(buscarTalle.talle);
      showToast(`Catálogo filtrado por talle ${buscarTalle.talle}`);
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  if (nota) nota.textContent = buscarTalle.ancho ? 'Filtrando por talle con horma ancha disponible bajo consulta.' : 'El talle es corrido: si estás entre dos números, elegí el más grande.';
}

function initTalleFinder() {
  const cont = document.getElementById('talle-finder');
  if (!cont) return;
  const talles = document.getElementById('finder-talles');
  if (talles) {
    talles.innerHTML = TALLES.map(t => `<button type="button" class="talle-chip" data-finder-talle="${t}" aria-pressed="false">${t}</button>`).join('');
    talles.addEventListener('click', e => {
      const btn = e.target.closest('[data-finder-talle]');
      if (!btn) return;
      buscarTalle.talle = Number(btn.dataset.finderTalle);
      talles.querySelectorAll('.talle-chip').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderTalleFinder();
    });
  }
  const anchoInput = document.getElementById('finder-ancho');
  anchoInput?.addEventListener('change', () => { buscarTalle.ancho = anchoInput.checked; renderTalleFinder(); });
  renderTalleFinder();
}

/* ---------- Momento propio: la vidriera se desliza ---------- */

const VIDRIERA = ['p01', 'p02', 'p03', 'p04', 'p05'];

function initVidriera() {
  const seccion = document.getElementById('vidriera');
  const escena = document.getElementById('vidriera-escena');
  const filas = document.getElementById('vidriera-filas');
  if (!seccion || !escena || !filas) return;

  const track = document.getElementById('vidriera-track');
  filas.innerHTML = VIDRIERA.map(id => {
    const p = getProducto(id);
    return `<div class="vidriera__pieza" data-pieza="${id}">${medioHTML(p)}</div>`;
  }).join('');

  const piezas = [...filas.querySelectorAll('.vidriera__pieza')];
  const index = document.getElementById('vidriera-index');
  const nombre = document.getElementById('vidriera-nombre');
  const talles = document.getElementById('vidriera-talles');
  const precio = document.getElementById('vidriera-precio');
  const barra = document.getElementById('vidriera-barra');
  const cta = document.getElementById('vidriera-add');
  const total = VIDRIERA.length;
  let activo = -1;

  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  const pintar = i => {
    if (i === activo) return;
    activo = i;
    piezas.forEach((el, n) => el.classList.toggle('is-on', n === i));
    const p = getProducto(VIDRIERA[i]);
    if (index) index.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (p) {
      if (nombre) nombre.textContent = p.nombre;
      if (talles) talles.textContent = `Talles ${p.talles[0]} a ${p.talles[p.talles.length - 1]} · ${esc(p.material)}`;
      if (precio) precio.textContent = formatearPrecio(precioFinal(p));
      if (cta) {
        cta.dataset.id = p.id;
        cta.querySelector('span').textContent = `Agregar ${p.nombre.split(' ')[0]} ${p.nombre.split(' ')[1] || ''}`.trim();
      }
    }
  };

  const centroDe = pieza => {
    const r = pieza.getBoundingClientRect();
    const m = filas.getBoundingClientRect();
    return (r.left + r.width / 2) - (m.left + m.width / 2);
  };

  const medir = () => {
    const alto = (track || seccion).offsetHeight - escena.offsetHeight;
    const r = (track || seccion).getBoundingClientRect();
    if (alto <= 0) { pintar(0); return; }
    const avance = Math.min(Math.max((OFF - r.top) / alto, 0), 1);
    if (barra) barra.style.width = `${(avance * 100).toFixed(2)}%`;

    const marco = document.getElementById('vidriera-marco');
    const anchoMarco = marco ? marco.offsetWidth : window.innerWidth;
    const anchoTotal = filas.scrollWidth - anchoMarco;
    const desplazar = Math.max(0, anchoTotal) * avance;
    filas.style.transform = `translateX(${-desplazar}px)`;

    const idx = Math.min(total - 1, Math.floor(avance * total * 0.999));
    pintar(idx);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; medir(); });
  };

  pintar(0);
  requestAnimationFrame(medir);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  cta?.addEventListener('click', () => {
    const p = getProducto(cta.dataset.id);
    if (!p) return;
    Cart.add(p, p.talles[0], 1);
    showToast(`${p.nombre} (talle ${p.talles[0]}) está en el carrito`);
  });
}

/* ---------- Texto que se lee con el scroll ---------- */

function initLectura() {
  const bloque = document.querySelector('.lectura');
  if (!bloque) return;
  const palabras = bloque.textContent.trim().split(/\s+/);
  bloque.innerHTML = palabras.map(p => `<span>${esc(p)}</span>`).join(' ');
  const spans = [...bloque.querySelectorAll('span')];
  if (reduceMotion) { spans.forEach(s => s.classList.add('on')); return; }

  let ticking = false;
  const medir = () => {
    const r = bloque.getBoundingClientRect();
    const inicio = window.innerHeight * .86;
    const fin = window.innerHeight * .34;
    const avance = Math.min(Math.max((inicio - r.top) / (inicio - fin), 0), 1);
    const hasta = Math.round(avance * spans.length);
    spans.forEach((s, n) => s.classList.toggle('on', n < hasta));
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; medir(); });
  };
  medir();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* ---------- Form del cierre ---------- */

function initForm() {
  const form = document.getElementById('form-cierre');
  if (!form) return;
  const input = form.querySelector('input[type="email"]');
  const error = form.querySelector('.error');
  const btn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const valor = input.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
    input.setAttribute('aria-invalid', String(!ok));
    if (!ok) {
      error.textContent = 'Escribinos un correo con formato válido.';
      input.focus();
      return;
    }
    error.textContent = '';
    const txt = btn.querySelector('span').textContent;
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Enviando…';
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = txt;
      form.reset();
      input.removeAttribute('aria-invalid');
      showToast('¡Gracias! El envío de mensajes se activa al pasar la web a producción.');
    }, 800);
  });
}

/* ---------- Buscador del header ---------- */

function initBuscarHeader() {
  const btn = document.getElementById('btn-buscar');
  const input = document.getElementById('q');
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => input.focus(), reduceMotion ? 0 : 450);
  });
}

/* ---------- Nav ---------- */

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

/* ---------- Reveals ---------- */

let revealsListos = false;

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

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  cont.querySelectorAll('[data-animate]:not(.in)').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.05, 0.4)}s`;
    requestAnimationFrame(() => el.classList.add('in'));
  });
}

/* ---------- Flotantes ---------- */

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

/* ---------- Hero y micro-movimiento ---------- */

function initHero() {
  // El texto del hero usa el sistema data-animate/initReveals (con red de
  // seguridad propia); acá solo el zoom decorativo de la foto, que si GSAP
  // no carga o no corre simplemente deja la imagen en su escala normal.
  if (typeof gsap === 'undefined') return;
  const foto = document.querySelector('[data-hero-foto] img');
  if (foto) gsap.fromTo(foto, { scale: 1.06 }, { scale: 1, duration: 1.5, ease: 'power2.out' });

  if (typeof ScrollTrigger !== 'undefined' && foto && !reduceMotion) {
    gsap.to(foto, {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: foto.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
    });
  }
}

/* ---------- Arranque ---------- */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

initCategorias();
initCatalogo();
initTalleFinder();
initModal();
initCarrito();
initVidriera();
initLectura();
initForm();
initReveals();
initNav();
initBuscarHeader();
initFloats();
if (!reduceMotion) initHero();
