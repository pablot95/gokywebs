const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491122608209';

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
  { id: 'personajes', nombre: 'Personajes', pie: 'Animales en cerámica', img: 'images/personajes-1x1.webp' },
  { id: 'tazas', nombre: 'Tazas y jarros', pie: 'Para el café de todos los días', img: 'images/tazas-1x1.webp' },
  { id: 'mesa', nombre: 'Mesa', pie: 'Platos, bowls y jarras', img: 'images/mesa-1x1.webp' },
  { id: 'cocina', nombre: 'Cocina', pie: 'Teteras, frascos y bandejas', img: 'images/cocina-1x1.webp' },
  { id: 'deco', nombre: 'Deco', pie: 'Jarrones y floreros', img: 'images/prod-jarrones.webp' }
];

const PRODUCTOS = [
  {
    id: 'p01', nombre: 'Conejo Amelia', cat: 'personajes', sub: 'Animales', rol: 'personaje',
    precio: 12900, descuento: 0, alto: 16, esmalte: 'Blanco', apto: [], stock: 6,
    img: 'images/prod-conejo.webp', etiquetas: ['regalo', 'conejo'],
    desc: 'Conejo sentado con las orejas largas y esmalte blanco mate. Es de los personajes que más se van para regalo de nacimiento.'
  },
  {
    id: 'p02', nombre: 'Búho Tomás', cat: 'personajes', sub: 'Animales', rol: 'personaje',
    precio: 14500, descuento: 0, alto: 14, esmalte: 'Pintado', apto: [], stock: 4,
    img: 'images/prod-buho.webp', etiquetas: ['regalo', 'buho'],
    desc: 'Búho panzón pintado a dos tonos, con detalle dorado en las patas. Queda bien sobre una repisa angosta o entre libros.'
  },
  {
    id: 'p03', nombre: 'Jirafa Nina', cat: 'personajes', sub: 'Animales', rol: 'personaje',
    precio: 18700, descuento: 0, alto: 27, esmalte: 'Blanco', apto: [], stock: 3,
    img: 'images/prod-jirafa.webp', etiquetas: ['regalo', 'jirafa', 'alta'],
    desc: 'La pieza más alta de la familia: 27 cm con textura de escamas en el lomo. Va sola sobre una mesa o al lado de una planta.'
  },
  {
    id: 'p04', nombre: 'Gato Rita', cat: 'personajes', sub: 'Animales', rol: 'personaje',
    precio: 15900, descuento: 0, alto: 13, esmalte: 'Pintado', apto: [], stock: 5,
    img: 'images/prod-gato.webp', etiquetas: ['regalo', 'gato'],
    desc: 'Gato recostado con los ojos cerrados y bigotes pintados a mano alzada. Cada uno sale apenas distinto del anterior.'
  },
  {
    id: 'p05', nombre: 'Familia del estante · set de 4', cat: 'personajes', sub: 'Sets', rol: 'personaje',
    precio: 52000, descuento: 10, alto: 18, esmalte: 'Crema', apto: [], stock: 2,
    img: 'images/personajes-1x1.webp', etiquetas: ['set', 'regalo'],
    desc: 'Cuatro personajes que conversan entre sí: conejo, gato, pájaro y erizo, en el mismo esmalte crema. Se entregan en caja.'
  },
  {
    id: 'p06', nombre: 'Erizo Pepa', cat: 'personajes', sub: 'Animales', rol: 'personaje',
    precio: 9800, descuento: 0, alto: 11, esmalte: 'Crema', apto: [], stock: 7,
    img: null, etiquetas: ['regalo', 'erizo', 'chico'],
    desc: 'El más chico de la familia, con las púas marcadas a mano. Entra en la palma y es el que más se suma al final del pedido.'
  },
  {
    id: 'p07', nombre: 'Taza Campo 300 ml', cat: 'tazas', sub: 'Tazas', rol: 'taza',
    precio: 9800, descuento: 0, alto: 9, esmalte: 'Natural', apto: ['microondas', 'lavavajillas'], stock: 14,
    img: 'images/prod-taza.webp', etiquetas: ['cafe', 'diario'],
    desc: 'Taza de asa redonda y borde grueso, con el barro a la vista en la base. Aguanta el lavavajillas y el microondas.'
  },
  {
    id: 'p08', nombre: 'Juego de 4 tazas Mañana', cat: 'tazas', sub: 'Sets', rol: 'taza',
    precio: 34800, descuento: 0, alto: 10, esmalte: 'Crema', apto: ['microondas', 'lavavajillas'], stock: 5,
    img: 'images/tazas-1x1.webp', etiquetas: ['set', 'desayuno'],
    desc: 'Cuatro tazas de 350 ml en esmalte crema con pinta moteada. Todas del mismo horneado, así que combinan entre sí.'
  },
  {
    id: 'p09', nombre: 'Jarro Hornero 400 ml', cat: 'tazas', sub: 'Jarros', rol: 'taza',
    precio: 11200, descuento: 0, alto: 11, esmalte: 'Natural', apto: ['microondas'], stock: 9,
    img: null, etiquetas: ['mate', 'cafe'],
    desc: 'Jarro alto de 400 ml, el que se usa para el café con leche o para el mate cocido. Asa ancha, entra bien la mano.'
  },
  {
    id: 'p10', nombre: 'Tetera Nube 1,2 L', cat: 'cocina', sub: 'Teteras', rol: 'tetera',
    precio: 32400, descuento: 0, alto: 17, esmalte: 'Blanco', apto: ['lavavajillas'], stock: 3,
    img: 'images/prod-tetera.webp', etiquetas: ['te', 'desayuno'],
    desc: 'Tetera de 1,2 litros con pico corto y tapa con tope, para que no se caiga al servir. Blanco brillante por dentro y por fuera.'
  },
  {
    id: 'p11', nombre: 'Frascos Alacena · set de 3', cat: 'cocina', sub: 'Frascos', rol: 'frasco',
    precio: 27900, descuento: 0, alto: 18, esmalte: 'Blanco', apto: ['lavavajillas'], stock: 4,
    img: 'images/prod-frascos.webp', etiquetas: ['set', 'orden'],
    desc: 'Tres frascos de distinta altura con tapa de madera y junta de silicona. Van sobre la mesada con la harina, el azúcar y el café.'
  },
  {
    id: 'p12', nombre: 'Bandeja Olivo con dos bowls', cat: 'cocina', sub: 'Bandejas', rol: 'bandeja',
    precio: 23500, descuento: 0, alto: 6, esmalte: 'Crema', apto: ['lavavajillas'], stock: 4,
    img: 'images/cocina-1x1.webp', etiquetas: ['picada', 'mesa dulce'],
    desc: 'Bandeja ovalada de 38 cm con manijas y dos bowls chicos que encastran. Sale para la picada y para la mesa dulce.'
  },
  {
    id: 'p13', nombre: 'Juego Greda: plato, taza y bowl', cat: 'mesa', sub: 'Sets', rol: 'plato',
    precio: 21900, descuento: 0, alto: 9, esmalte: 'Crema', apto: ['microondas', 'lavavajillas'], stock: 8,
    img: 'images/prod-set.webp', etiquetas: ['set', 'individual'],
    desc: 'El lugar completo de una persona: plato playo de 26 cm, taza de 300 ml y bowl hondo, todos en esmalte crema moteado.'
  },
  {
    id: 'p14', nombre: 'Bowls Pétalo · set de 4', cat: 'mesa', sub: 'Bowls', rol: 'bowl',
    precio: 19800, descuento: 0, alto: 7, esmalte: 'Blanco', apto: ['microondas', 'lavavajillas'], stock: 6,
    img: 'images/prod-bowls.webp', etiquetas: ['set', 'ensalada'],
    desc: 'Cuatro bowls de 14 cm con el borde ondulado, del mismo esmalte blanco. Van para el desayuno y para servir en la mesa.'
  },
  {
    id: 'p15', nombre: 'Platos Lino · 6 piezas', cat: 'mesa', sub: 'Platos', rol: 'plato',
    precio: 46500, descuento: 12, alto: 3, esmalte: 'Crema', apto: ['microondas', 'lavavajillas'], stock: 3,
    img: 'images/mesa-1x1.webp', etiquetas: ['set', 'mesa completa'],
    desc: 'Seis platos: tres playos de 26 cm y tres hondos de 21 cm, apilables. El esmalte crema deja ver la textura del torno.'
  },
  {
    id: 'p16', nombre: 'Plato playo Greda 26 cm', cat: 'mesa', sub: 'Platos', rol: 'plato',
    precio: 8900, descuento: 0, alto: 3, esmalte: 'Crema', apto: ['microondas', 'lavavajillas'], stock: 18,
    img: null, etiquetas: ['suelto', 'diario'],
    desc: 'El plato de todos los días, de a uno. Borde ancho, base sin esmaltar y 26 cm de diámetro: entra en cualquier alacena.'
  },
  {
    id: 'p17', nombre: 'Bowl hondo Greda 14 cm', cat: 'mesa', sub: 'Bowls', rol: 'bowl',
    precio: 7400, descuento: 0, alto: 7, esmalte: 'Crema', apto: ['microondas', 'lavavajillas'], stock: 16,
    img: null, etiquetas: ['suelto', 'sopa'],
    desc: 'Bowl hondo de 14 cm para la sopa, el cereal o el guiso. Se apila con los demás y va del horno a la mesa.'
  },
  {
    id: 'p18', nombre: 'Jarra Campo 1,5 L', cat: 'mesa', sub: 'Jarras', rol: 'jarra',
    precio: 16800, descuento: 0, alto: 21, esmalte: 'Natural', apto: ['lavavajillas'], stock: 7,
    img: null, etiquetas: ['agua', 'mesa'],
    desc: 'Jarra de 1,5 litros con pico ancho y asa alta. La misma línea que la taza Campo, para que la mesa cierre.'
  },
  {
    id: 'p19', nombre: 'Jarrón Texturas 24 cm', cat: 'deco', sub: 'Jarrones', rol: 'jarron',
    precio: 24900, descuento: 0, alto: 24, esmalte: 'Natural', apto: [], stock: 5,
    img: 'images/prod-jarrones.webp', etiquetas: ['deco', 'flores secas'],
    desc: 'Jarrón de boca angosta con relieve de puntos en todo el cuerpo. Queda bien vacío y mejor con tres ramas secas.'
  },
  {
    id: 'p20', nombre: 'Florero Junco 18 cm', cat: 'deco', sub: 'Floreros', rol: 'jarron',
    precio: 15600, descuento: 0, alto: 18, esmalte: 'Blanco', apto: [], stock: 6,
    img: null, etiquetas: ['deco', 'flores'],
    desc: 'Florero angosto de 18 cm, pensado para una sola flor o para un ramito chico. Pesa lo suficiente como para no volcarse.'
  }
];

const Cart = {
  KEY: 'crissahomene_cart',
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

const ICONO_FLECHA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function placaHTML(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  return `<span class="placa" aria-hidden="true">
      <span class="placa__dato">${p.alto}<small>cm</small></span>
      <span class="placa__cat">${esc(cat ? cat.nombre : '')}</span>
    </span>`;
}

function medioHTML(p, cls) {
  if (!p.img) return placaHTML(p);
  return `<img src="${p.img}" alt="${esc(p.nombre)}" width="1200" height="1200" class="${cls || ''}">`;
}

/* ---------- Categorías ---------- */

function initCategorias() {
  const circulos = document.getElementById('circulos');
  if (circulos) {
    circulos.innerHTML = CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return `<button type="button" class="circulo" data-cat="${c.id}" data-animate style="opacity:0;transform:translateY(24px)">
        <span class="circulo__foto"><img src="${c.img}" alt="${esc(c.nombre)}" width="1200" height="1200"></span>
        <span class="circulo__nom">${esc(c.nombre)}</span>
        <span class="circulo__n">${n} piezas</span>
      </button>`;
    }).join('');
  }
  const tarjetas = document.getElementById('colecciones');
  if (tarjetas) {
    tarjetas.innerHTML = CATEGORIAS.map(c => {
      const n = PRODUCTOS.filter(p => p.cat === c.id).length;
      return `<button type="button" class="coleccion" data-cat="${c.id}" data-animate style="opacity:0;transform:translateY(28px)">
        <span class="coleccion__foto"><img src="${c.img}" alt="${esc(c.nombre)}" width="1200" height="1200"></span>
        <span class="coleccion__txt">
          <span>
            <span class="coleccion__nom">${esc(c.nombre)}</span>
            <span class="coleccion__n">${esc(c.pie)} · ${n} piezas</span>
          </span>
          <span class="coleccion__ir">${ICONO_FLECHA}</span>
        </span>
      </button>`;
    }).join('');
  }
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
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
  const esmaltes = leerFiltros('esmalte');
  const aptos = leerFiltros('apto');
  const precios = leerFiltros('precio');

  let lista = PRODUCTOS.filter(p => {
    if (cats.length && !cats.includes(p.cat)) return false;
    if (esmaltes.length && !esmaltes.includes(p.esmalte)) return false;
    if (aptos.length && !aptos.every(a => p.apto.includes(a))) return false;
    if (precios.length) {
      const v = precioFinal(p);
      const ok = precios.some(r => (r === 'bajo' && v < 15000) || (r === 'medio' && v >= 15000 && v <= 30000) || (r === 'alto' && v > 30000));
      if (!ok) return false;
    }
    if (q.length) {
      const texto = normalizar([p.nombre, p.cat, p.sub, p.esmalte, p.desc, p.etiquetas.join(' '), CATEGORIAS.find(c => c.id === p.cat)?.nombre].join(' '));
      if (!q.every(t => texto.includes(t))) return false;
    }
    return true;
  });

  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (estado.orden === 'alto') lista = lista.slice().sort((a, b) => b.alto - a.alto);

  return lista;
}

function cardHTML(p) {
  const final = precioFinal(p);
  const badges = [];
  if (p.descuento > 0) badges.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock <= 3) badges.push(`<span class="badge badge--ink">Quedan ${p.stock}</span>`);
  else if (p.sub === 'Sets') badges.push('<span class="badge">Set</span>');

  return `<article class="prod" data-id="${p.id}" data-animate style="opacity:0;transform:translateY(26px)">
    ${badges.length ? `<div class="prod__badges">${badges.join('')}</div>` : ''}
    <button type="button" class="prod__foto" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${medioHTML(p)}
      <span class="prod__ver">Ver la pieza</span>
    </button>
    <div class="prod__body">
      <span class="prod__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')}</span>
      <h3 class="prod__nom">${esc(p.nombre)}</h3>
      <div class="prod__precios">
        <span class="prod__precio${p.descuento > 0 ? ' prod__precio--off' : ''}">${formatearPrecio(final)}</span>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s>` : ''}
      </div>
      <p class="prod__medida">${p.alto} cm de alto · ${esc(p.esmalte)}</p>
      <div class="prod__actions">
        <span class="stepper">
          <button type="button" data-step="-1" data-id="${p.id}" aria-label="Quitar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
          <span data-qty="${p.id}">1</span>
          <button type="button" data-step="1" data-id="${p.id}" aria-label="Sumar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
        </span>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
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
      <h3>No encontramos piezas con esa combinación</h3>
      <p>Probá con menos filtros o escribinos y te decimos qué tenemos en el showroom.</p>
      <button type="button" class="btn btn--linea btn--sm" id="vacio-limpiar"><span>Limpiar filtros</span></button>
    </div>`;
    document.getElementById('vacio-limpiar')?.addEventListener('click', limpiarFiltros);
  } else {
    grid.innerHTML = visibles.map(cardHTML).join('');
  }

  const cont = document.getElementById('contador');
  if (cont) cont.innerHTML = `<b>${lista.length}</b> ${lista.length === 1 ? 'pieza' : 'piezas'} en el catálogo`;

  const vermas = document.getElementById('vermas');
  if (vermas) {
    const quedan = lista.length - visibles.length;
    vermas.hidden = quedan <= 0;
    if (quedan > 0) vermas.querySelector('span').textContent = `Ver ${Math.min(quedan, POR_PAGINA)} piezas más`;
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
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const span = grid.querySelector(`[data-qty="${p.id}"]`);
      const qty = span ? parseInt(span.textContent, 10) : 1;
      Cart.add(p, qty);
      showToast(`${p.nombre} está en el carrito`);
      if (span) span.textContent = '1';
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
  const aptos = p.apto.length ? p.apto.map(a => a === 'microondas' ? 'Microondas' : 'Lavavajillas').join(' y ') : 'Lavado a mano';
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  back.querySelector('.modal__grid').innerHTML = `
    <div class="modal__foto">${medioHTML(p)}</div>
    <div class="modal__info">
      <span class="modal__cat">${esc(CATEGORIAS.find(c => c.id === p.cat)?.nombre || '')} · ${esc(p.sub)}</span>
      <h2 id="modal-titulo-txt">${esc(p.nombre)}</h2>
      <div class="modal__precio">
        <b>${formatearPrecio(final)}</b>
        ${p.descuento > 0 ? `<s class="prod__antes">${formatearPrecio(p.precio)}</s><span class="badge badge--off">-${p.descuento}%</span>` : ''}
      </div>
      <p>${esc(p.desc)}</p>
      <dl class="modal__ficha">
        <div><dt>Alto</dt><dd>${p.alto} cm</dd></div>
        <div><dt>Esmalte</dt><dd>${esc(p.esmalte)}</dd></div>
        <div><dt>Cuidado</dt><dd>${esc(aptos)}</dd></div>
        <div><dt>En showroom</dt><dd>${p.stock} ${p.stock === 1 ? 'unidad' : 'unidades'}</dd></div>
      </dl>
      <div class="modal__acc">
        <button type="button" class="btn btn--cta" data-modal-add="${p.id}"><span>Agregar al carrito</span></button>
        <a class="btn btn--linea" href="${wsp(`Hola CRISSA HOMeñE, me interesa ${p.nombre} (${formatearPrecio(final)}). ¿Sigue disponible?`)}" target="_blank" rel="noopener"><span>Consultar</span></a>
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
    const add = e.target.closest('[data-modal-add]');
    if (add) {
      const p = getProducto(add.dataset.modalAdd);
      if (p) { Cart.add(p, 1); showToast(`${p.nombre} está en el carrito`); }
      return;
    }
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
      <p>Empezá por los personajes o armá tu mesa desde el catálogo.</p>
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
          <span class="linea__precio">${i.qty} × ${formatearPrecio(precioFinal(p))}</span>
        </span>
        <span class="linea__acc">
          <button type="button" class="linea__quitar" data-quitar="${p.id}" aria-label="Quitar ${esc(p.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg></button>
          <span class="stepper">
            <button type="button" data-cart-step="-1" data-id="${p.id}" aria-label="Quitar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg></button>
            <span>${i.qty}</span>
            <button type="button" data-cart-step="1" data-id="${p.id}" aria-label="Sumar uno"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
          </span>
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
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(quitar.dataset.quitar); return; }
    const step = e.target.closest('[data-cart-step]');
    if (step) {
      const item = Cart.get().find(i => i.id === step.dataset.id);
      if (!item) return;
      const nueva = item.qty + parseInt(step.dataset.cartStep, 10);
      if (nueva <= 0) Cart.remove(step.dataset.id); else Cart.setQty(step.dataset.id, nueva);
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => {
    const items = Cart.get();
    if (!items.length) return;
    const lineas = items.map(item => {
      const p = getProducto(item.id);
      return p ? `• ${item.qty}x ${p.nombre} — ${formatearPrecio(precioFinal(p) * item.qty)}` : '';
    }).filter(Boolean);
    const mensaje = [
      'Hola CRISSA HOMeñE, quiero consultar por este pedido:',
      '',
      ...lineas,
      '',
      `Total estimado: ${formatearPrecio(Cart.total())}`
    ].join('\n');
    window.open(wsp(mensaje), '_blank', 'noopener');
  });
  document.addEventListener('cart:updated', () => { renderCarrito(); updateCartBadge(); });
  renderCarrito();
  updateCartBadge();
}

/* ---------- Componente: armá tu mesa ---------- */

const RECETAS = {
  desayuno: { nombre: 'Desayuno', piezas: [{ rol: 'taza', porPersona: true }, { rol: 'plato', porPersona: true }, { rol: 'tetera', porPersona: false }] },
  diaria: { nombre: 'Mesa de todos los días', piezas: [{ rol: 'plato', porPersona: true }, { rol: 'bowl', porPersona: true }, { rol: 'taza', porPersona: true }, { rol: 'jarra', porPersona: false }] },
  dulce: { nombre: 'Mesa dulce', piezas: [{ rol: 'plato', porPersona: true }, { rol: 'taza', porPersona: true }, { rol: 'bandeja', porPersona: false }] }
};

const armado = { personas: 4, receta: 'diaria', lineas: [] };

function piezaPorRol(rol) {
  const candidatos = PRODUCTOS.filter(p => p.rol === rol && p.sub !== 'Sets' && p.stock > 0);
  if (!candidatos.length) return null;
  return candidatos.slice().sort((a, b) => precioFinal(a) - precioFinal(b))[0];
}

function calcularArmado() {
  const receta = RECETAS[armado.receta];
  if (!receta) return [];
  return receta.piezas.map(pieza => {
    const p = piezaPorRol(pieza.rol);
    if (!p) return null;
    const qty = pieza.porPersona ? Math.min(armado.personas, p.stock) : 1;
    return { producto: p, qty };
  }).filter(Boolean);
}

function renderArmado() {
  const lista = document.getElementById('armador-lista');
  const total = document.getElementById('armador-total');
  const resumen = document.getElementById('armador-resumen');
  const wspBtn = document.getElementById('armador-wsp');
  const addBtn = document.getElementById('armador-add');
  if (!lista) return;

  armado.lineas = calcularArmado();
  const piezas = armado.lineas.reduce((s, l) => s + l.qty, 0);
  const suma = armado.lineas.reduce((s, l) => s + precioFinal(l.producto) * l.qty, 0);

  lista.innerHTML = armado.lineas.map(l => `<li>
      <span class="armador__qty">${l.qty}×</span>
      <span>${esc(l.producto.nombre)}</span>
      <span class="armador__precio">${formatearPrecio(precioFinal(l.producto) * l.qty)}</span>
    </li>`).join('');

  if (total) total.textContent = formatearPrecio(suma);
  if (resumen) resumen.textContent = `${RECETAS[armado.receta].nombre} para ${armado.personas} · ${piezas} piezas`;
  if (addBtn) addBtn.querySelector('span').textContent = `Sumar las ${piezas} piezas al carrito`;
  if (wspBtn) {
    const detalle = armado.lineas.map(l => `${l.qty}x ${l.producto.nombre}`).join(', ');
    wspBtn.href = wsp(`Hola CRISSA HOMeñE, quiero armar la ${RECETAS[armado.receta].nombre.toLowerCase()} para ${armado.personas}: ${detalle}. Total estimado ${formatearPrecio(suma)}.`);
  }
}

function initArmador() {
  const cont = document.getElementById('armador');
  if (!cont) return;

  cont.querySelectorAll('[data-personas]').forEach(btn => {
    btn.addEventListener('click', () => {
      armado.personas = parseInt(btn.dataset.personas, 10);
      cont.querySelectorAll('[data-personas]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderArmado();
    });
  });
  cont.querySelectorAll('[data-receta]').forEach(btn => {
    btn.addEventListener('click', () => {
      armado.receta = btn.dataset.receta;
      cont.querySelectorAll('[data-receta]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderArmado();
    });
  });
  document.getElementById('armador-add')?.addEventListener('click', () => {
    if (!armado.lineas.length) return;
    armado.lineas.forEach(l => Cart.add(l.producto, l.qty));
    const piezas = armado.lineas.reduce((s, l) => s + l.qty, 0);
    showToast(`Sumamos ${piezas} piezas al carrito`);
    abrirDrawer();
  });
  renderArmado();
}

/* ---------- Momento propio: la repisa ---------- */

const REPISA = [
  { id: 'p01', titulo: 'Amelia', texto: 'Arranca la repisa: el conejo blanco de orejas largas, el que más sale para regalo de nacimiento.' },
  { id: 'p04', titulo: 'Rita', texto: 'Al lado se acomoda la gata dormida. Los bigotes van pintados a mano alzada, así que no hay dos iguales.' },
  { id: 'p02', titulo: 'Tomás', texto: 'El búho panzón ocupa el medio del estante. Dos tonos de esmalte y un detalle dorado en las patas.' },
  { id: 'p03', titulo: 'Nina', texto: 'Cierra la jirafa, la pieza más alta de la familia: 27 cm de lomo texturado que se ven desde la puerta.' }
];

function initRepisa() {
  const seccion = document.getElementById('repisa');
  const escena = document.getElementById('repisa-escena');
  if (!seccion || !escena) return;

  const track = document.getElementById('repisa-track');
  const fotos = [...seccion.querySelectorAll('.repisa__foto')];
  const pasos = [...seccion.querySelectorAll('.repisa__paso')];
  const index = document.getElementById('repisa-index');
  const alto = document.getElementById('repisa-alto');
  const precio = document.getElementById('repisa-precio');
  const barra = document.getElementById('repisa-barra');
  const cta = document.getElementById('repisa-add');
  const total = REPISA.length;
  let activo = -1;

  const OFF = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;

  const pintar = i => {
    if (i === activo) return;
    activo = i;
    fotos.forEach((f, n) => f.classList.toggle('is-on', n === i));
    pasos.forEach((p, n) => p.classList.toggle('is-on', n === i));
    const p = getProducto(REPISA[i].id);
    if (index) index.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (p) {
      if (alto) alto.textContent = `${p.alto} cm`;
      if (precio) precio.textContent = formatearPrecio(precioFinal(p));
      if (cta) {
        cta.dataset.id = p.id;
        cta.querySelector('span').textContent = `Sumar ${REPISA[i].titulo} al carrito`;
      }
    }
  };

  const medir = () => {
    const r = (track || seccion).getBoundingClientRect();
    const recorrido = (track || seccion).offsetHeight - escena.offsetHeight;
    if (recorrido <= 0) { pintar(0); return; }
    const avance = Math.min(Math.max((OFF - r.top) / recorrido, 0), 1);
    if (barra) barra.style.width = `${(avance * 100).toFixed(2)}%`;
    pintar(Math.min(total - 1, Math.floor(avance * total * 0.999)));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; medir(); });
  };

  pintar(0);
  medir();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  cta?.addEventListener('click', () => {
    const p = getProducto(cta.dataset.id);
    if (!p) return;
    Cart.add(p, 1);
    showToast(`${p.nombre} está en el carrito`);
  });
  document.getElementById('repisa-ver')?.addEventListener('click', e => {
    e.preventDefault();
    aplicarCategoria('personajes');
  });
}

/* ---------- Hero: rotador de mensajes (Modelo 1) ---------- */

function initRotador() {
  const cont = document.getElementById('rotador');
  if (!cont) return;
  const items = [...cont.querySelectorAll('.rotador__item')];
  const dots = [...cont.querySelectorAll('.rotador__dot')];
  if (items.length < 2) return;
  let i = 0;
  let timer = null;

  const ir = n => {
    i = (n + items.length) % items.length;
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
  };

  const arrancar = () => {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => ir(i + 1), 5200);
  };

  dots.forEach((d, k) => d.addEventListener('click', () => { ir(k); arrancar(); }));
  cont.addEventListener('mouseenter', () => clearInterval(timer));
  cont.addEventListener('mouseleave', arrancar);
  ir(0);
  arrancar();
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
  if (typeof gsap === 'undefined') return;
  const foto = document.querySelector('[data-hero-foto] img');
  const bloques = document.querySelectorAll('[data-hero-in]');
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (foto) tl.fromTo(foto, { scale: 1.08 }, { scale: 1, duration: 1.5 }, 0);
  if (bloques.length) tl.fromTo(bloques, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .11 }, .18);

  if (typeof ScrollTrigger !== 'undefined' && foto && !reduceMotion) {
    gsap.to(foto, {
      yPercent: 6, ease: 'none',
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
initArmador();
initModal();
initCarrito();
initRepisa();
initRotador();
initLectura();
initReveals();
initNav();
initFloats();
if (!reduceMotion) initHero();
