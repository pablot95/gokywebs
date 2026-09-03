const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491133009312';

const CATEGORIAS = [
  { id: 'jeans', nombre: 'Jeans', img: 'cat-jeans', alt: 'Pila de jeans de AURA32 doblados sobre un estante blanco' },
  { id: 'indumentaria', nombre: 'Indumentaria', img: 'cat-indumentaria', alt: 'Persona con campera de jean de AURA32 contra una pared blanca' },
  { id: 'calzado', nombre: 'Calzado', img: 'cat-calzado', alt: 'Zapatilla urbana blanca de AURA32' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'cat-accesorios', alt: 'Cinturones de cuero de AURA32 sobre fondo negro' },
];

const TALLE_ORDEN = ['36', '37', '38', '39', '40', '41', '42', '44', '46', '90', '95', '100', 'S', 'M', 'L', 'XL', 'Único'];

const PRODUCTOS = [
  {
    id: 'j01', nombre: 'Jean recto — lavado claro', cat: 'jeans', precio: 72900, descuento: 0, stock: 24,
    img: 'pr-jean-recto-claro', alt: 'Jean recto de lavado claro colgado de una percha de madera',
    talles: ['36', '38', '40', '42', '44', '46'], calce: 'recto', lavado: 'claro', tiro: 'medio', destacado: true,
    desc: 'El recto de todos los días. Denim de 12 onzas con poca elastina: sostiene la forma después de la cuarta puesta y cae derecho desde la rodilla.',
  },
  {
    id: 'j02', nombre: 'Jean recto — lavado oscuro', cat: 'jeans', precio: 74900, descuento: 0, stock: 18,
    img: 'pr-jean-recto-oscuro', alt: 'Jean recto de lavado oscuro colgado de una percha de madera',
    talles: ['36', '38', '40', '42', '44'], calce: 'recto', lavado: 'oscuro', tiro: 'medio',
    desc: 'Mismo molde que el recto claro, en índigo profundo con bigotes apenas marcados. Es el que sirve tanto para la oficina como para salir.',
  },
  {
    id: 'j03', nombre: 'Jean wide leg — lavado claro', cat: 'jeans', precio: 79900, descuento: 0, stock: 15,
    img: 'pr-jean-wide-claro', alt: 'Jean wide leg de lavado claro doblado',
    talles: ['36', '38', '40', '42', '44'], calce: 'wide', lavado: 'claro', tiro: 'alto', destacado: true,
    desc: 'Pierna ancha desde la cadera, tiro alto y ruedo sin dobladillo. Va con zapatilla chata y también con plataforma sin que quede corto.',
  },
  {
    id: 'j04', nombre: 'Jean mom — lavado medio', cat: 'jeans', precio: 76900, descuento: 0, stock: 21,
    img: 'pr-jean-mom-medio', alt: 'Jean mom de lavado medio doblado',
    talles: ['36', '38', '40', '42', '44', '46'], calce: 'recto', lavado: 'medio', tiro: 'alto',
    desc: 'Tiro alto, cadera cómoda y pierna que se afina apenas hacia el tobillo. Rígido de entrada, se acomoda al cuerpo con el uso.',
  },
  {
    id: 'j05', nombre: 'Jean chupín elastizado', cat: 'jeans', precio: 69900, descuento: 0, stock: 30,
    img: 'pr-jean-skinny-azul', alt: 'Jean chupín azul doblado',
    talles: ['36', '38', '40', '42'], calce: 'chupin', lavado: 'medio', tiro: 'medio',
    desc: 'Con 2% de elastano para que acompañe el movimiento sin marcar de más. Entra sin pelear debajo de una bota.',
  },
  {
    id: 'j06', nombre: 'Jean negro tiro alto', cat: 'jeans', precio: 77900, descuento: 0, stock: 16,
    img: 'pr-jean-negro', alt: 'Jean negro doblado sobre fondo claro',
    talles: ['36', '38', '40', '42', '44'], calce: 'chupin', lavado: 'oscuro', tiro: 'alto', destacado: true,
    desc: 'Negro parejo, sin destiños. Es el jean que resuelve una salida de noche sin tener que pensar el resto del look.',
  },
  {
    id: 'j07', nombre: 'Jean tiro alto rígido', cat: 'jeans', precio: 81900, descuento: 0, stock: 12,
    img: 'pr-jean-tiro-alto', alt: 'Detalle del bolsillo trasero de un jean claro de tiro alto',
    talles: ['38', '40', '42', '44', '46'], calce: 'recto', lavado: 'claro', tiro: 'alto',
    desc: 'Denim rígido de 13 onzas, cintura ancha y bolsillos traseros bajos. El que más se pide para marcar la cintura.',
  },
  {
    id: 'j08', nombre: 'Jean rígido azul profundo', cat: 'jeans', precio: 84900, descuento: 0, stock: 9,
    img: 'pr-jean-rigido-oscuro', alt: 'Jean azul profundo rígido doblado',
    talles: ['38', '40', '42', '44'], calce: 'recto', lavado: 'oscuro', tiro: 'alto',
    desc: 'Índigo sin lavar: arranca oscuro y va tomando las marcas de quien lo usa. Es el de mayor gramaje del catálogo.',
  },
  {
    id: 'j09', nombre: 'Jean carpenter wide', cat: 'jeans', precio: 88900, descuento: 0, stock: 11,
    img: 'pr-jean-recto-uso', alt: 'Persona con un jean carpenter de pierna ancha sobre fondo blanco',
    talles: ['38', '40', '42', '44', '46'], calce: 'wide', lavado: 'medio', tiro: 'medio', destacado: true,
    desc: 'Con presilla de martillo y bolsillo utilitario en la pierna. Pierna ancha real, ruedo que apoya sobre la zapatilla.',
  },
  {
    id: 'j10', nombre: 'Jean claro con roturas', cat: 'jeans', precio: 79900, descuento: 15, stock: 7,
    img: 'pr-jean-roto', alt: 'Detalle de un jean claro con roturas y costura naranja',
    talles: ['36', '38', '40', '42'], calce: 'recto', lavado: 'claro', tiro: 'medio', destacado: true,
    desc: 'Roturas hechas a mano, una por una, sobre denim claro con costura naranja. No hay dos iguales.',
  },
  {
    id: 'i01', nombre: 'Campera de jean clásica', cat: 'indumentaria', precio: 118900, descuento: 0, stock: 14,
    img: 'pr-campera-clasica', alt: 'Campera de jean clásica azul colgada en un perchero',
    talles: ['S', 'M', 'L', 'XL'], destacado: true,
    desc: 'Trucker de cuatro bolsillos en denim medio, con puños ajustables y forro liviano. La que combina con cualquiera de los jeans.',
  },
  {
    id: 'i02', nombre: 'Campera de jean oversize', cat: 'indumentaria', precio: 124900, descuento: 10, stock: 8,
    img: 'pr-campera-oversize', alt: 'Campera de jean oversize de tono medio colgada en un perchero',
    talles: ['S', 'M', 'L', 'XL'],
    desc: 'Hombro caído y largo por debajo de la cadera. Se lleva abierta sobre remera y entra sin apretar arriba de un buzo.',
  },
  {
    id: 'i03', nombre: 'Remera de algodón peinado', cat: 'indumentaria', precio: 29900, descuento: 0, stock: 40,
    img: 'pr-remera-blanca', alt: 'Remera blanca de algodón colgada de una percha',
    talles: ['S', 'M', 'L', 'XL'],
    desc: 'Algodón peinado 24/1, cuello con refuerzo y costura lateral. Blanca de verdad: no amarillea al tercer lavado.',
  },
  {
    id: 'c01', nombre: 'Zapatillas plataforma blancas', cat: 'calzado', precio: 132900, descuento: 0, stock: 10,
    img: 'pr-zapatillas-plataforma', alt: 'Zapatilla blanca con plataforma y ojalillos dorados',
    talles: ['36', '37', '38', '39', '40', '41'],
    desc: 'Plataforma de 4 cm, cuerpo de cuero sintético liso y ojalillos dorados. Suma altura sin cambiar cómo cae el jean.',
  },
  {
    id: 'c02', nombre: 'Zapatillas urbanas blancas', cat: 'calzado', precio: 119900, descuento: 12, stock: 13,
    img: 'pr-zapatillas-urbanas', alt: 'Zapatilla urbana blanca de suela baja',
    talles: ['36', '37', '38', '39', '40', '41'], destacado: true,
    desc: 'Suela baja, puntera perforada y plantilla acolchada. La blanca de todos los días, la que va con los cinco lavados.',
  },
  {
    id: 'a01', nombre: 'Cinturón de cuero negro', cat: 'accesorios', precio: 38900, descuento: 0, stock: 22,
    img: 'pr-cinturon-negro', alt: 'Cinturón de cuero negro con hebilla plateada',
    talles: ['90', '95', '100'], destacado: true,
    desc: 'Cuero vacuno de 3,5 cm con hebilla plateada mate y costura al tono. Se ajusta sin marcar la pretina del jean.',
  },
  {
    id: 'a02', nombre: 'Cinturón de cuero suela', cat: 'accesorios', precio: 38900, descuento: 0, stock: 17,
    img: 'pr-cinturon-marron', alt: 'Cinturón de cuero color suela con costura contrastante',
    talles: ['90', '95', '100'],
    desc: 'Suela natural con costura naranja a la vista. Se oscurece con el uso, igual que un buen par de botas.',
  },
  {
    id: 'a03', nombre: 'Cinturón de gamuza verde', cat: 'accesorios', precio: 41900, descuento: 0, stock: 9,
    img: 'pr-cinturon-verde', alt: 'Cinturón de gamuza verde militar con hebilla plateada',
    talles: ['90', '95', '100'],
    desc: 'Gamuza verde militar, la única nota de color del catálogo. Levanta un look de jean claro y remera blanca.',
  },
  {
    id: 'a04', nombre: 'Cinturón hebilla plata', cat: 'accesorios', precio: 44900, descuento: 20, stock: 6,
    img: 'pr-cinturon-cuero', alt: 'Cinturón de cuero con hebilla plateada de gran tamaño',
    talles: ['90', '95', '100'],
    desc: 'Hebilla más ancha, de aleación plateada, sobre cuero gris verdoso. Es el accesorio que se ve primero.',
  },
  {
    id: 'a05', nombre: 'Anteojos de sol montura blanca', cat: 'accesorios', precio: 42500, descuento: 0, stock: 15,
    img: 'pr-anteojos-sol', alt: 'Anteojos de sol de montura blanca y lente oscura',
    talles: ['Único'],
    desc: 'Montura redonda blanca con lente gris. Livianos, con varillas flexibles y estuche rígido incluido.',
  },
];

PRODUCTOS.forEach((p, i) => { p.ref = 'A-' + String(i + 1).padStart(2, '0'); });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const ordenTalle = t => { const i = TALLE_ORDEN.indexOf(t); return i === -1 ? 99 : i; };

/* ------------------------------------------------------------------ CARRITO */

const Cart = {
  KEY: 'aura32_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === talle);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === talle))); },
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
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

/* ------------------------------------------------------------------ FICHAS */

function fichaHTML(p, opts = {}) {
  const fin = precioFinal(p);
  const off = p.descuento > 0;
  const conBuy = opts.buy !== false;
  return `
  <article class="prod" data-id="${p.id}" data-animate style="transform:translateY(24px);opacity:0">
    <div class="prod-media">
      <img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="960" height="1200" decoding="async">
      <span class="prod-ref">${p.ref}</span>
      ${off ? `<span class="prod-off">-${p.descuento}%</span>` : ''}
      <div class="prod-talles">${p.talles.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
    <button type="button" class="prod-open" data-open="${p.id}">Ver ${esc(p.nombre)}</button>
    <div class="prod-body">
      <p class="prod-cat">${esc(nombreCat(p.cat))}${p.stock <= 8 ? ' · Últimas unidades' : ''}</p>
      <h3 class="prod-name">${esc(p.nombre)}</h3>
      <p class="prod-precio">${formatearPrecio(fin)}${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <div class="prod-actions">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Restar uno">−</button>
          <output data-qty>1</output>
          <button type="button" data-step="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="prod-add" data-add="${p.id}">Agregar</button>
        ${conBuy ? `<button type="button" class="prod-buy" data-buy="${p.id}">Comprar</button>` : ''}
      </div>
    </div>
  </article>`;
}

function conectarFichas(root) {
  root.querySelectorAll('.prod').forEach(card => {
    if (card.dataset.listo) return;
    card.dataset.listo = '1';
    const out = card.querySelector('[data-qty]');
    card.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
      const p = getProducto(card.dataset.id);
      const max = p?.stock ?? 99;
      out.textContent = Math.max(1, Math.min(max, (+out.textContent || 1) + (+b.dataset.step)));
    }));
    card.querySelector('[data-add]')?.addEventListener('click', () => {
      const p = getProducto(card.dataset.id); if (!p) return;
      Cart.add(p, +out.textContent || 1, p.talles[0] || '');
      showToast('¡Agregado! Talle ' + (p.talles[0] || 'único') + ' — lo podés cambiar en el carrito');
      out.textContent = 1;
    });
    card.querySelector('[data-buy]')?.addEventListener('click', () => {
      const p = getProducto(card.dataset.id); if (!p) return;
      Cart.add(p, +out.textContent || 1, p.talles[0] || '');
      out.textContent = 1;
      abrirDrawer();
    });
    card.querySelector('[data-open]')?.addEventListener('click', () => abrirModal(card.dataset.id));
  });
}

/* ------------------------------------------------------------------ CATEGORÍAS */

function initCategorias() {
  const cont = document.getElementById('catsGrid');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = PRODUCTOS.filter(p => p.cat === c.id).length;
    return `
    <a class="cat-card" href="#tienda" data-cat="${c.id}" data-animate style="transform:translateY(26px);opacity:0">
      <div class="cat-media"><img src="images/${c.img}.webp" alt="${esc(c.alt)}" width="1000" height="1250" decoding="async"></div>
      <div class="cat-foot">
        <span class="cat-name">${esc(c.nombre)}</span>
        <span class="cat-count">${n} ${n === 1 ? 'modelo' : 'modelos'}</span>
      </div>
    </a>`;
  }).join('');
  cont.querySelectorAll('[data-cat]').forEach(a => a.addEventListener('click', () => {
    aplicarCategoria(a.dataset.cat);
  }));
}

/* ------------------------------------------------------------------ RAIL */

function initRail() {
  const track = document.getElementById('railTrack');
  const vp = document.getElementById('railVp');
  if (!track || !vp) return;
  const destacados = PRODUCTOS.filter(p => p.destacado);
  track.innerHTML = destacados.map(p => fichaHTML(p, { buy: false })).join('');
  conectarFichas(track);

  vp.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const max = vp.scrollWidth - vp.clientWidth;
    if (max <= 1) return;
    const atStart = vp.scrollLeft <= 0, atEnd = vp.scrollLeft >= max - 1;
    if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
    e.preventDefault();
    vp.scrollLeft += e.deltaY;
  }, { passive: false });

  initRailDrag(vp);

  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
  const paso = () => Math.max(220, vp.clientWidth * 0.7);
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const syncArrows = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows, { passive: true });
  window.addEventListener('load', syncArrows);
  syncArrows();
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
}

/* ------------------------------------------------------------------ CATÁLOGO */

const PAGINA = 16;
const filtro = { q: '', cat: 'todos', talle: '', orden: 'destacados', visibles: PAGINA };

function productosFiltrados() {
  const q = normalizar(filtro.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (filtro.cat !== 'todos' && p.cat !== filtro.cat) return false;
    if (filtro.talle && !p.talles.includes(filtro.talle)) return false;
    if (!q) return true;
    const heno = normalizar([p.nombre, nombreCat(p.cat), p.desc, p.calce, p.lavado, p.tiro, p.ref, p.talles.join(' ')].join(' '));
    return q.split(/\s+/).every(t => heno.includes(t));
  });
  if (filtro.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (filtro.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
  else if (filtro.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return lista;
}

function renderCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const count = document.getElementById('resultCount');
  const limpiar = document.getElementById('limpiar');
  if (!grid) return;

  const lista = productosFiltrados();
  const mostrar = lista.slice(0, filtro.visibles);
  grid.innerHTML = mostrar.map(p => fichaHTML(p)).join('');
  conectarFichas(grid);
  revelarNuevos(grid);

  grid.hidden = lista.length === 0;
  if (vacio) vacio.hidden = lista.length !== 0;
  if (verMas) verMas.hidden = lista.length <= filtro.visibles;
  if (count) count.textContent = lista.length === 1 ? '1 producto' : `${lista.length} productos`;
  if (limpiar) limpiar.hidden = !(filtro.q || filtro.cat !== 'todos' || filtro.talle || filtro.orden !== 'destacados');
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function resetPaginado() { filtro.visibles = PAGINA; }

function aplicarCategoria(cat) {
  filtro.cat = cat;
  resetPaginado();
  document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.chip === cat));
  renderCatalogo();
}

function initCatalogo() {
  const chips = document.getElementById('chipsCat');
  const q = document.getElementById('q');
  const fTalle = document.getElementById('fTalle');
  const fOrden = document.getElementById('fOrden');
  const verMas = document.getElementById('verMas');
  const limpiar = document.getElementById('limpiar');
  const vacioReset = document.getElementById('vacioReset');

  if (chips) {
    const opciones = [{ id: 'todos', nombre: 'Todo' }].concat(CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre })));
    chips.innerHTML = opciones.map(o => `<button type="button" class="chip${o.id === 'todos' ? ' is-on' : ''}" data-chip="${o.id}">${esc(o.nombre)}</button>`).join('');
    chips.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => aplicarCategoria(c.dataset.chip)));
  }

  if (fTalle) {
    const talles = [...new Set(PRODUCTOS.flatMap(p => p.talles))].sort((a, b) => ordenTalle(a) - ordenTalle(b));
    fTalle.insertAdjacentHTML('beforeend', talles.map(t => `<option value="${esc(t)}">Talle ${esc(t)}</option>`).join(''));
    fTalle.addEventListener('change', () => { filtro.talle = fTalle.value; resetPaginado(); renderCatalogo(); });
  }

  let tq;
  q?.addEventListener('input', () => {
    clearTimeout(tq);
    tq = setTimeout(() => { filtro.q = q.value; resetPaginado(); renderCatalogo(); }, 160);
  });
  fOrden?.addEventListener('change', () => { filtro.orden = fOrden.value; resetPaginado(); renderCatalogo(); });
  verMas?.addEventListener('click', () => { filtro.visibles += PAGINA; renderCatalogo(); });

  const reset = () => {
    filtro.q = ''; filtro.cat = 'todos'; filtro.talle = ''; filtro.orden = 'destacados';
    resetPaginado();
    if (q) q.value = '';
    if (fTalle) fTalle.value = '';
    if (fOrden) fOrden.value = 'destacados';
    document.querySelectorAll('#chipsCat .chip').forEach(c => c.classList.toggle('is-on', c.dataset.chip === 'todos'));
    renderCatalogo();
  };
  limpiar?.addEventListener('click', reset);
  vacioReset?.addEventListener('click', reset);

  renderCatalogo();
}

/* ------------------------------------------------------------------ MODAL */

let modalUltimoFoco = null;
let modalTalle = '';

function abrirModal(id) {
  const p = getProducto(id);
  const bd = document.getElementById('modalBackdrop');
  const inner = document.getElementById('modalInner');
  if (!p || !bd || !inner) return;
  modalUltimoFoco = document.activeElement;
  modalTalle = p.talles[0] || '';
  const fin = precioFinal(p);
  const off = p.descuento > 0;
  const sug = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const specs = [];
  if (p.calce) specs.push(['Calce', p.calce === 'chupin' ? 'Chupín' : p.calce === 'wide' ? 'Wide leg' : 'Recto']);
  if (p.lavado) specs.push(['Lavado', p.lavado.charAt(0).toUpperCase() + p.lavado.slice(1)]);
  if (p.tiro) specs.push(['Tiro', p.tiro.charAt(0).toUpperCase() + p.tiro.slice(1)]);
  specs.push(['Referencia', p.ref]);

  inner.innerHTML = `
    <div class="mv-media"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="960" height="1200"></div>
    <div class="mv-body">
      <p class="mv-cat">${esc(nombreCat(p.cat))}${p.stock <= 8 ? ' · Últimas unidades' : ''}</p>
      <h3>${esc(p.nombre)}</h3>
      <p class="mv-precio">${formatearPrecio(fin)}${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="mv-desc">${esc(p.desc)}</p>
      <dl class="mv-specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <span class="mv-lbl">Talle</span>
      <div class="mv-talles" role="group" aria-label="Elegí el talle">
        ${p.talles.map((t, i) => `<button type="button" class="mv-talle${i === 0 ? ' is-on' : ''}" data-talle="${esc(t)}">${esc(t)}</button>`).join('')}
      </div>
      <div class="mv-actions">
        <div class="stepper">
          <button type="button" data-mstep="-1" aria-label="Restar uno">−</button>
          <output id="mvQty">1</output>
          <button type="button" data-mstep="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="btn btn--solid" id="mvAdd">Agregar al carrito</button>
        <button type="button" class="btn btn--ghost" id="mvBuy">Comprar ahora</button>
      </div>
      ${sug.length ? `<div class="mv-sug"><h4>También te puede interesar</h4><div class="mv-sug-row">
        ${sug.map(s => `<button type="button" class="mv-sug-item" data-sug="${s.id}"><img src="images/${s.img}.webp" alt="${esc(s.alt)}" width="960" height="1200"><span>${esc(s.nombre)}</span></button>`).join('')}
      </div></div>` : ''}
    </div>`;

  const out = inner.querySelector('#mvQty');
  inner.querySelectorAll('[data-mstep]').forEach(b => b.addEventListener('click', () => {
    out.textContent = Math.max(1, Math.min(p.stock ?? 99, (+out.textContent || 1) + (+b.dataset.mstep)));
  }));
  inner.querySelectorAll('[data-talle]').forEach(b => b.addEventListener('click', () => {
    modalTalle = b.dataset.talle;
    inner.querySelectorAll('[data-talle]').forEach(x => x.classList.toggle('is-on', x === b));
  }));
  inner.querySelector('#mvAdd')?.addEventListener('click', () => {
    Cart.add(p, +out.textContent || 1, modalTalle);
    showToast('¡Agregado! Tu carrito te espera');
  });
  inner.querySelector('#mvBuy')?.addEventListener('click', () => {
    Cart.add(p, +out.textContent || 1, modalTalle);
    cerrarModal();
    abrirDrawer();
  });
  inner.querySelectorAll('[data-sug]').forEach(b => b.addEventListener('click', () => abrirModal(b.dataset.sug)));

  document.getElementById('modalBox')?.setAttribute('aria-label', p.nombre);
  bd.hidden = false;
  requestAnimationFrame(() => bd.classList.add('open'));
  document.body.classList.add('no-scroll');
  document.getElementById('modalClose')?.focus();
}

function cerrarModal() {
  const bd = document.getElementById('modalBackdrop');
  if (!bd || bd.hidden) return;
  bd.classList.remove('open');
  setTimeout(() => { bd.hidden = true; }, 280);
  document.body.classList.remove('no-scroll');
  modalUltimoFoco?.focus();
}

function initModal() {
  const bd = document.getElementById('modalBackdrop');
  if (!bd) return;
  document.getElementById('modalClose')?.addEventListener('click', cerrarModal);
  bd.addEventListener('click', e => { if (e.target === bd) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (bd.hidden) return;
    if (e.key === 'Escape') { cerrarModal(); return; }
    if (e.key !== 'Tab') return;
    const foco = bd.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
}

/* ------------------------------------------------------------------ DRAWER */

let drawerUltimoFoco = null;

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  const total = document.getElementById('drawerTotal');
  const wsp = document.getElementById('drawerWsp');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <p class="vacio-n">00</p>
      <h3>Tu carrito está en blanco</h3>
      <p>Todavía no elegiste nada. Empezá por los jeans: son lo que mejor hacemos.</p>
      <button type="button" class="btn btn--solid" id="drawerIrTienda">Ver el catálogo</button>
    </div>`;
    body.querySelector('#drawerIrTienda')?.addEventListener('click', () => {
      cerrarDrawer();
      document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="ci" data-id="${p.id}" data-talle="${esc(i.talle)}">
      <div class="ci-media"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="960" height="1200"></div>
      <div>
        <p class="ci-name">${esc(p.nombre)}</p>
        <p class="ci-var">Talle ${esc(i.talle || 'único')} · ${p.ref}</p>
        <p class="ci-precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
      </div>
      <div class="ci-tools">
        <div class="stepper">
          <button type="button" data-ci="-1" aria-label="Restar uno">−</button>
          <output>${i.qty}</output>
          <button type="button" data-ci="1" aria-label="Sumar uno">+</button>
        </div>
        <button type="button" class="ci-del" data-del>Quitar</button>
      </div>
    </div>`;
  }).join('');
  body.querySelectorAll('.ci').forEach(row => {
    const id = row.dataset.id, talle = row.dataset.talle;
    row.querySelectorAll('[data-ci]').forEach(b => b.addEventListener('click', () => {
      const actual = Cart.get().find(x => x.id === id && x.talle === talle);
      if (!actual) return;
      const nueva = actual.qty + (+b.dataset.ci);
      if (nueva < 1) Cart.remove(id, talle); else Cart.setQty(id, talle, nueva);
    }));
    row.querySelector('[data-del]')?.addEventListener('click', () => Cart.remove(id, talle));
  });
  if (foot) foot.hidden = false;
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (wsp) {
    const lineas = items.map(i => {
      const p = getProducto(i.id);
      return p ? `• ${p.nombre} (talle ${i.talle || 'único'}) x${i.qty}` : '';
    }).filter(Boolean);
    const msg = `Hola AURA32, quiero avanzar con este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
  }
}

function abrirDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !bd) return;
  drawerUltimoFoco = document.activeElement;
  d.hidden = false; bd.hidden = false;
  requestAnimationFrame(() => { d.classList.add('open'); bd.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawerClose')?.focus();
}

function cerrarDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.hidden) return;
  d.classList.remove('open'); bd?.classList.remove('open');
  setTimeout(() => { d.hidden = true; if (bd) bd.hidden = true; }, 340);
  document.body.classList.remove('no-scroll');
  drawerUltimoFoco?.focus();
}

function initDrawer() {
  const d = document.getElementById('cartDrawer');
  if (!d) return;
  document.getElementById('cartHeader')?.addEventListener('click', abrirDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', cerrarDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarDrawer);
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('keydown', e => {
    if (d.hidden) return;
    if (e.key === 'Escape') { cerrarDrawer(); return; }
    if (e.key !== 'Tab') return;
    const foco = d.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const visibles = [...foco].filter(el => el.offsetParent !== null);
    if (!visibles.length) return;
    const primero = visibles[0], ultimo = visibles[visibles.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  });
  document.addEventListener('cart:updated', renderDrawer);
  renderDrawer();
}

/* ------------------------------------------------------------------ BLOQUE INTERACTIVO */

const tj = { calce: 'recto', lavado: 'claro', tiro: 'alto' };
const TJ_ETQ = {
  calce: { recto: 'Recto', wide: 'Wide leg', chupin: 'Chupín' },
  lavado: { claro: 'Claro', medio: 'Medio', oscuro: 'Oscuro' },
  tiro: { alto: 'Alto', medio: 'Medio' },
};

function tjRanking() {
  return PRODUCTOS
    .filter(p => p.cat === 'jeans')
    .map(p => ({
      p,
      score: (p.calce === tj.calce ? 3 : 0) + (p.lavado === tj.lavado ? 2 : 0) + (p.tiro === tj.tiro ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || precioFinal(a.p) - precioFinal(b.p))
    .slice(0, 3);
}

function tjRazon(p) {
  const ok = [];
  if (p.calce === tj.calce) ok.push('calce ' + TJ_ETQ.calce[tj.calce].toLowerCase());
  if (p.lavado === tj.lavado) ok.push('lavado ' + TJ_ETQ.lavado[tj.lavado].toLowerCase());
  if (p.tiro === tj.tiro) ok.push('tiro ' + TJ_ETQ.tiro[tj.tiro].toLowerCase());
  if (!ok.length) return 'Elegido por: es lo más cerca que tenemos de lo que buscás.';
  return 'Elegido por: ' + ok.join(' + ') + '.';
}

function tjRender(animar) {
  const cont = document.getElementById('tjCards');
  const lead = document.getElementById('tjLead');
  if (!cont) return;
  if (lead) lead.textContent = `${TJ_ETQ.calce[tj.calce]} · lavado ${TJ_ETQ.lavado[tj.lavado].toLowerCase()} · tiro ${TJ_ETQ.tiro[tj.tiro].toLowerCase()}`;
  cont.innerHTML = tjRanking().map(({ p }) => {
    const fin = precioFinal(p);
    const off = p.descuento > 0;
    return `<article class="tj-card${animar && !reduceMotion ? ' tj-swap' : ''}" data-id="${p.id}">
      <div class="tj-media"><img src="images/${p.img}.webp" alt="${esc(p.alt)}" width="960" height="1200" decoding="async"></div>
      <p class="tj-etq"><span>${esc(TJ_ETQ.calce[p.calce])}</span><span>${esc(p.talles[0])}—${esc(p.talles[p.talles.length - 1])}</span></p>
      <h3 class="tj-name">${esc(p.nombre)}</h3>
      <p class="tj-precio">${formatearPrecio(fin)}${off ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="tj-por">${esc(tjRazon(p))}</p>
      <button type="button" class="tj-add" data-tjadd="${p.id}">Agregar al carrito</button>
    </article>`;
  }).join('');
  cont.querySelectorAll('[data-tjadd]').forEach(b => b.addEventListener('click', () => {
    const p = getProducto(b.dataset.tjadd); if (!p) return;
    Cart.add(p, 1, p.talles[0] || '');
    showToast('¡Agregado! Talle ' + (p.talles[0] || 'único') + ' — lo podés cambiar en el carrito');
  }));
}

function initTuJean() {
  const panel = document.querySelector('.tj-panel');
  if (!panel) return;
  panel.querySelectorAll('.tj-chips').forEach(grupo => {
    const eje = grupo.dataset.eje;
    grupo.querySelectorAll('.tj-chip').forEach(chip => chip.addEventListener('click', () => {
      tj[eje] = chip.dataset.valor;
      grupo.querySelectorAll('.tj-chip').forEach(c => c.classList.toggle('is-on', c === chip));
      tjRender(true);
    }));
  });
  document.getElementById('tjMas')?.addEventListener('click', () => {
    aplicarCategoria('jeans');
    const q = document.getElementById('q');
    if (q) { q.value = TJ_ETQ.calce[tj.calce]; filtro.q = q.value; resetPaginado(); renderCatalogo(); }
  });
  tjRender(false);
}

/* ------------------------------------------------------------------ REVEALS */

let revealsListos = false;

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate], [data-reveal]');
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
  if (!revealsListos) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (!nuevos.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    nuevos.forEach(el => el.classList.add('in'));
    return;
  }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.05, 0.5)}s`; });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  nuevos.forEach(el => io.observe(el));
  requestAnimationFrame(() => {
    nuevos.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
    });
  });
}

function initFolios() {
  const folios = document.querySelectorAll('.folio');
  if (!folios.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    folios.forEach(f => f.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  folios.forEach(f => io.observe(f));
  window.addEventListener('load', () => {
    folios.forEach(f => {
      const r = f.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) f.classList.add('in');
    });
  });
}

/* ------------------------------------------------------------------ HERO */

function initHero() {
  const h1 = document.querySelector('[data-split]');
  if (h1 && !reduceMotion && typeof gsap !== 'undefined') {
    const texto = h1.textContent;
    h1.innerHTML = texto.split(' ').map(w => `<span class="pal"><span class="pal-i">${esc(w)}</span></span>`).join(' ');
    const partes = h1.querySelectorAll('.pal-i');
    gsap.set(h1.querySelectorAll('.pal'), { display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' });
    gsap.set(partes, { display: 'inline-block', yPercent: 110 });
    const tw = gsap.to(partes, { yPercent: 0, duration: 1, ease: 'power3.out', stagger: 0.045, delay: 0.15 });
    setTimeout(() => {
      if (tw.progress() < 1) { tw.progress(1).kill(); gsap.set(partes, { yPercent: 0 }); }
    }, 2200);
  }
  const media = document.querySelector('.hero-media');
  if (media) requestAnimationFrame(() => media.classList.add('in'));
  const mark = document.querySelector('.hero-mark');
  if (mark && !reduceMotion && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.to(mark, { yPercent: -26, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
  }
}

/* ------------------------------------------------------------------ STICKY CHAPTERS */

function initLocal() {
  const stage = document.getElementById('localStage');
  const visual = document.getElementById('localVisual');
  const pasos = document.getElementById('localPasos');
  if (!stage || !visual || !pasos) return;
  const imgs = [...visual.querySelectorAll('img')];
  const items = [...pasos.querySelectorAll('li')];
  let activo = 0;

  const setPaso = n => {
    const i = Math.max(0, Math.min(items.length - 1, n));
    if (i === activo) return;
    activo = i;
    imgs.forEach((im, k) => im.classList.toggle('is-on', k === i));
    items.forEach((li, k) => li.classList.toggle('is-on', k === i));
  };

  const mqMobile = window.matchMedia('(max-width: 899px)');

  const porScroll = () => {
    const r = stage.getBoundingClientRect();
    const recorrido = r.height - window.innerHeight;
    if (recorrido <= 0) return;
    const p = Math.max(0, Math.min(0.999, -r.top / recorrido));
    setPaso(Math.floor(p * items.length));
  };

  const porCentro = () => {
    const centro = window.innerHeight * 0.52;
    let mejor = 0, dist = Infinity;
    items.forEach((li, i) => {
      const r = li.getBoundingClientRect();
      const d = Math.abs((r.top + r.height / 2) - centro);
      if (d < dist) { dist = d; mejor = i; }
    });
    setPaso(mejor);
  };

  let calculo = porCentro, ultimo = 0, cola = null;
  const queue = () => {
    const ahora = Date.now();
    if (ahora - ultimo >= 50) { ultimo = ahora; calculo(); return; }
    clearTimeout(cola);
    cola = setTimeout(() => { ultimo = Date.now(); calculo(); }, 50);
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });

  const aplicar = () => {
    if (mqMobile.matches && !reduceMotion) {
      stage.classList.add('is-sticky-mobile');
      calculo = porScroll;
    } else {
      stage.classList.remove('is-sticky-mobile');
      calculo = porCentro;
    }
    calculo();
    if (typeof ScrollTrigger !== 'undefined') requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  mqMobile.addEventListener('change', aplicar);
  aplicar();
}

/* ------------------------------------------------------------------ TEXTO QUE SE LEE */

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
      trigger: el, start: 'top 82%', end: 'bottom 55%', scrub: 0.4, invalidateOnRefresh: true,
      onUpdate: self => {
        const hasta = self.progress * ws.length;
        ws.forEach((w, i) => w.classList.toggle('on', i < hasta));
      },
    });
  });
}

/* ------------------------------------------------------------------ NAV */

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
  const desktopMq = window.matchMedia('(min-width: 861px)');
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

/* ------------------------------------------------------------------ FLOTANTES */

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

/* ------------------------------------------------------------------ SEO */

function initSchema() {
  const nodo = document.getElementById('ldGraph');
  if (!nodo) return;
  const base = 'https://gokywebs.com/demo/aura32/';
  const grafo = [
    {
      '@type': 'ClothingStore',
      '@id': base + '#negocio',
      name: 'AURA32',
      description: 'Marca de indumentaria especializada en jean. Camperas, remeras, calzado y accesorios.',
      url: base,
      image: base + 'images/hero-modelo.webp',
      telephone: '+54 9 11 3300-9312',
      priceRange: '$$',
      address: { '@type': 'PostalAddress', addressLocality: 'Buenos Aires', addressCountry: 'AR' },
    },
    ...PRODUCTOS.map(p => ({
      '@type': 'Product',
      '@id': base + '#' + p.id,
      name: p.nombre,
      description: p.desc,
      image: base + 'images/' + p.img + '.webp',
      sku: p.ref,
      category: nombreCat(p.cat),
      brand: { '@type': 'Brand', name: 'AURA32' },
      offers: {
        '@type': 'Offer',
        price: precioFinal(p),
        priceCurrency: 'ARS',
        availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: base,
      },
    })),
  ];
  nodo.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
}

/* ------------------------------------------------------------------ DEVOLUCIÓN DE DEMO */

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
    const estrellas = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'Sin calificar';
    const lineas = [
      `Devolución de la demo${negocio ? ' — ' + negocio : ''}`,
      `Calificación: ${estrellas}`,
      colores ? `Colores: ${colores}` : null,
      contenido ? `Contenido: ${contenido}` : null,
      otros ? `Otros: ${otros}` : null,
      location.href,
    ].filter(Boolean);

    window.open(`https://wa.me/${GKY_FEEDBACK_WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
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

/* ------------------------------------------------------------------ ARRANQUE */

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
  document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
}
if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

document.addEventListener('DOMContentLoaded', () => {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  initCategorias();
  initRail();
  initCatalogo();
  initTuJean();
  initReveals();
  initFolios();
  initHero();
  initLocal();
  initLeeScroll();
  initNav();
  initModal();
  initDrawer();
  initFloats();
  initFeedbackFloat();
  initSchema();

  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
});
