const WSP = '5491154170686';
const IMG = 'images/';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CATEGORIAS = [
  { id: 'clasicos', nombre: 'Clásicos de maicena', bajada: 'Ver los clásicos', img: 'alfajor-maicena-1200x1200.webp', alt: 'Alfajores de maicena abiertos con dulce de leche a la vista' },
  { id: 'banados', nombre: 'Bañados en chocolate', bajada: 'Ver los bañados', img: 'alfajor-chocolate-1200x1200.webp', alt: 'Alfajores artesanales bañados en chocolate sobre mármol' },
  { id: 'cajas', nombre: 'Cajas para regalar', bajada: 'Ver las cajas', img: 'caja-surtida-1200x1200.webp', alt: 'Caja surtida de alfajores artesanales' },
  { id: 'packs', nombre: 'Packs y docenas', bajada: 'Ver los packs', img: 'pack-torre-1200x1200.webp', alt: 'Torre de alfajores atada con hilo junto a una botella de leche' },
];

const PRODUCTOS = [
  { id: 1, nombre: 'Alfajor de maicena con coco', cat: 'clasicos', precio: 1450, descuento: 0, img: 'alfajor-maicena-1200x1200.webp', alt: 'Alfajores de maicena abiertos mostrando el dulce de leche', badge: 'Más elegido', desc: 'El de siempre: masa de maicena que se deshace en la boca, dulce de leche repostero hasta el borde y coco rallado fresco alrededor. Descanso de masa de doce horas, sin excepción.', etiquetas: ['maicena', 'coco', 'dulce de leche', 'clásico'], peso: '55 g aprox.', destacado: true },
  { id: 2, nombre: 'Alfajor de maicena relleno doble', cat: 'clasicos', precio: 1750, descuento: 0, img: 'alfajor-dulce-fila-1200x1200.webp', alt: 'Alfajores artesanales rellenos de dulce de leche en fila sobre mármol', badge: '', desc: 'La misma masa del clásico, con el doble de dulce de leche. Es el que piden los que dicen que a los alfajores siempre les falta relleno.', etiquetas: ['maicena', 'doble', 'dulce de leche'], peso: '70 g aprox.', destacado: true },
  { id: 3, nombre: 'Alfajorcito mini de dulce de leche', cat: 'clasicos', precio: 850, descuento: 0, img: 'alfajor-dulce-fila-1200x1200.webp', alt: 'Alfajorcitos mini rellenos de dulce de leche', badge: '', desc: 'Bocado chico para la mesa dulce o para acompañar el café. Se vende por unidad, pero casi nadie se lleva uno solo.', etiquetas: ['mini', 'bocado', 'mesa dulce'], peso: '25 g aprox.', destacado: false },
  { id: 4, nombre: 'Alfajor de vainilla y dulce de leche', cat: 'clasicos', precio: 1350, descuento: 0, img: 'alfajor-maicena-1200x1200.webp', alt: 'Alfajores de vainilla rellenos de dulce de leche', badge: '', desc: 'Tapa de vainilla, un poco más firme que la de maicena, para quien prefiere que el alfajor tenga algo de mordida.', etiquetas: ['vainilla', 'clásico'], peso: '58 g aprox.', destacado: false },
  { id: 5, nombre: 'Alfajor de nuez y dulce de leche', cat: 'clasicos', precio: 1850, descuento: 0, img: 'alfajor-dulce-fila-1200x1200.webp', alt: 'Alfajores artesanales con nuez y dulce de leche', badge: 'Nuevo', desc: 'Nuez picada gruesa en la masa y en el borde. Sale en tandas chicas porque la nuez buena no siempre se consigue.', etiquetas: ['nuez', 'frutos secos'], peso: '62 g aprox.', destacado: true },
  { id: 6, nombre: 'Alfajor bañado en chocolate semiamargo', cat: 'banados', precio: 1900, descuento: 0, img: 'alfajor-chocolate-1200x1200.webp', alt: 'Alfajores bañados en chocolate semiamargo', badge: 'Más elegido', desc: 'Baño de cobertura semiamarga, bien crocante, sobre la masa de siempre. El contraste entre el amargo y el dulce de leche es todo el punto.', etiquetas: ['chocolate', 'bañado', 'semiamargo'], peso: '68 g aprox.', destacado: true },
  { id: 7, nombre: 'Alfajor bañado en chocolate blanco', cat: 'banados', precio: 1900, descuento: 0, img: 'alfajor-chocolate-1200x1200.webp', alt: 'Alfajores bañados en chocolate blanco', badge: '', desc: 'Cobertura blanca con un hilo de chocolate negro por encima. Más dulce que el semiamargo y el favorito de los chicos.', etiquetas: ['chocolate blanco', 'bañado'], peso: '68 g aprox.', destacado: false },
  { id: 8, nombre: 'Alfajor de chocolate relleno de crema', cat: 'banados', precio: 2100, descuento: 0, img: 'alfajor-negro-1200x1200.webp', alt: 'Alfajores de chocolate negro rellenos de crema blanca', badge: 'Nuevo', desc: 'Tapas de cacao negro y relleno de crema de vainilla. Distinto a todo el resto del mostrador y se nota en la primera mordida.', etiquetas: ['cacao', 'crema', 'chocolate'], peso: '72 g aprox.', destacado: true },
  { id: 9, nombre: 'Alfajor triple bañado', cat: 'banados', precio: 2400, descuento: 0, img: 'alfajor-negro-1200x1200.webp', alt: 'Alfajor triple bañado en chocolate, cortado al medio', badge: '', desc: 'Tres tapas, dos capas de dulce de leche y baño entero de chocolate. Es el más grande que hago y no entra en la caja chica.', etiquetas: ['triple', 'chocolate', 'grande'], peso: '110 g aprox.', destacado: false },
  { id: 10, nombre: 'Alfajor bañado con dulce de leche repostero', cat: 'banados', precio: 2050, descuento: 0, img: 'alfajor-chocolate-1200x1200.webp', alt: 'Alfajores bañados con abundante dulce de leche repostero', badge: '', desc: 'Baño de chocolate con leche y relleno generoso de repostero. El más goloso de la línea bañada.', etiquetas: ['chocolate con leche', 'repostero'], peso: '75 g aprox.', destacado: false },
  { id: 11, nombre: 'Caja x6 surtida', cat: 'cajas', precio: 8400, descuento: 0, img: 'caja-surtida-1200x1200.webp', alt: 'Caja de seis alfajores artesanales surtidos', badge: 'Más elegido', desc: 'Seis alfajores elegidos por mí, tres clásicos y tres bañados, con separadores y tarjeta escrita a mano. Si querés otra combinación, avisame en el pedido.', etiquetas: ['caja', 'regalo', 'surtido'], peso: '6 unidades', destacado: true },
  { id: 12, nombre: 'Caja x9 “Para regalar”', cat: 'cajas', precio: 12900, descuento: 10, img: 'caja-surtida-1200x1200.webp', alt: 'Caja de nueve alfajores artesanales para regalar', badge: '', desc: 'Nueve alfajores en caja rígida con lazo, pensada para llevar de visita o mandar a una oficina. Va con tarjeta y sin precio adentro.', etiquetas: ['caja', 'regalo', 'lazo'], peso: '9 unidades', destacado: false },
  { id: 13, nombre: 'Caja x12 de maicena', cat: 'cajas', precio: 15600, descuento: 0, img: 'caja-surtida-1200x1200.webp', alt: 'Caja de doce alfajores de maicena', badge: '', desc: 'Docena entera del clásico de maicena con coco. La que se lleva quien ya sabe cuál quiere y no quiere sorpresas.', etiquetas: ['caja', 'docena', 'maicena'], peso: '12 unidades', destacado: false },
  { id: 14, nombre: 'Caja x6 de bañados', cat: 'cajas', precio: 10500, descuento: 0, img: 'caja-surtida-1200x1200.webp', alt: 'Caja de seis alfajores bañados en chocolate', badge: '', desc: 'Seis bañados: dos semiamargos, dos de chocolate blanco y dos de chocolate con leche. Viajan con separador para que no se toquen.', etiquetas: ['caja', 'bañados', 'chocolate'], peso: '6 unidades', destacado: false },
  { id: 15, nombre: 'Caja “Merienda para dos”', cat: 'cajas', precio: 13800, descuento: 0, img: 'pack-torre-1200x1200.webp', alt: 'Caja de merienda con alfajores y dulce de leche', badge: 'Nuevo', desc: 'Seis alfajores surtidos más un frasco de dulce de leche repostero de 400 g. Es el regalo que mando cuando no sé qué mandar.', etiquetas: ['caja', 'merienda', 'regalo', 'dulce de leche'], peso: '6 unidades + 400 g', destacado: true },
  { id: 16, nombre: 'Docena de alfajorcitos mini', cat: 'packs', precio: 8900, descuento: 15, img: 'pack-torre-1200x1200.webp', alt: 'Docena de alfajorcitos mini artesanales', badge: 'Más elegido', desc: 'Doce mini para mesa dulce, cumpleaños o para tener en el frasco de la cocina. Se pueden pedir todos de un solo sabor.', etiquetas: ['mini', 'docena', 'mesa dulce'], peso: '12 unidades', destacado: true },
  { id: 17, nombre: 'Pack x3 de maicena', cat: 'packs', precio: 4100, descuento: 0, img: 'pack-torre-1200x1200.webp', alt: 'Pack de tres alfajores de maicena atados con hilo', badge: '', desc: 'Tres clásicos atados con hilo de panadería. El pack más chico que despacho y el que más se pide para probar.', etiquetas: ['pack', 'maicena', 'probar'], peso: '3 unidades', destacado: false },
  { id: 18, nombre: 'Pack x3 de bañados', cat: 'packs', precio: 5400, descuento: 0, img: 'alfajor-chocolate-1200x1200.webp', alt: 'Pack de tres alfajores bañados en chocolate', badge: '', desc: 'Uno de cada baño: semiamargo, blanco y con leche. Para decidir cuál va a ser tu favorito antes de encargar la caja.', etiquetas: ['pack', 'bañados', 'chocolate'], peso: '3 unidades', destacado: false },
  { id: 19, nombre: 'Dulce de leche repostero 400 g', cat: 'packs', precio: 4800, descuento: 0, img: 'dulce-de-leche-1200x1200.webp', alt: 'Frasco abierto de dulce de leche repostero artesanal', badge: '', desc: 'El mismo dulce de leche que uso en los alfajores, en frasco de 400 g. Espeso, para que puedas rellenar en casa sin que se te escape.', etiquetas: ['dulce de leche', 'repostero', 'frasco'], peso: '400 g', destacado: false },
  { id: 20, nombre: 'Torre de 10 para cumpleaños', cat: 'packs', precio: 13500, descuento: 12, img: 'pack-torre-1200x1200.webp', alt: 'Torre de diez alfajores apilados y atados', badge: '', desc: 'Diez alfajores apilados y atados, con vela arriba si querés. Reemplaza a la torta cuando la torta no da.', etiquetas: ['torre', 'cumpleaños', 'regalo'], peso: '10 unidades', destacado: false },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const getCategoria = id => CATEGORIAS.find(c => c.id === id);
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

const Cart = {
  KEY: 'saboresemma_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* modo privado */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, qty) {
    const items = this.get(); const it = items.find(i => i.id === id); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
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
  if (p.descuento > 0) badges.push('<span class="pill">-' + p.descuento + '%</span>');
  if (p.badge) badges.push('<span class="pill pill-suave">' + esc(p.badge) + '</span>');
  const precio = p.descuento > 0
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s>'
    : '<strong>' + formatearPrecio(final) + '</strong>';
  return '' +
    '<article class="prod" data-id="' + p.id + '" data-animate style="opacity:0;transform:translateY(38px)">' +
      (badges.length ? '<div class="prod-badges">' + badges.join('') + '</div>' : '') +
      '<div class="prod-media" role="button" tabindex="0" data-ver="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '">' +
        '<img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async">' +
        '<span class="prod-ver">Ver más</span>' +
      '</div>' +
      '<div class="prod-body">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h3 class="prod-nom">' + esc(p.nombre) + '</h3>' +
        '<p class="prod-precio">' + precio + '</p>' +
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
  cont.innerHTML = CATEGORIAS.map((c, i) => '' +
    '<a class="cat-card" href="#tienda" data-cat-link="' + c.id + '" data-animate style="opacity:0;transform:translateY(34px)">' +
      '<span class="cat-n">0' + (i + 1) + '</span>' +
      '<div class="cat-media"><img src="' + IMG + c.img + '" width="1200" height="1200" alt="' + esc(c.alt) + '" decoding="async"></div>' +
      '<div class="cat-info">' +
        '<h3>' + esc(c.nombre) + '</h3>' +
        '<p>' + esc(c.bajada) + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></p>' +
      '</div>' +
    '</a>').join('');
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
  const begin = e => {
    if (e.button !== undefined && e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startScroll = vp.scrollLeft; pointerId = e.pointerId;
  };
  const move = e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    vp.scrollLeft = startScroll - dx;
  };
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
  vp.addEventListener('pointerdown', begin);
  vp.addEventListener('pointermove', move);
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
    document.getElementById('verMas').addEventListener('click', () => {
      this.mostrados += 16;
      this.render(true);
    });
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
      const heno = normalizar([p.nombre, getCategoria(p.cat)?.nombre, p.desc, (p.etiquetas || []).join(' ')].join(' '));
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
      const nuevos = visibles.slice(yaHay);
      this.cont.insertAdjacentHTML('beforeend', nuevos.map(p => cardProducto(p, 'catalogo')).join(''));
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
        const v = Math.max(1, Math.min(99, (parseInt(out.textContent, 10) || 1) + parseInt(step.dataset.step, 10)));
        out.textContent = v;
      }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(parseInt(add.dataset.add, 10));
      if (!p) return;
      Cart.add(p, pedirQty(p.id));
      showToast('¡Agregado! Tu caja te espera');
      return;
    }
    const directo = e.target.closest('[data-add-directo]');
    if (directo) {
      const p = getProducto(parseInt(directo.dataset.addDirecto, 10));
      if (!p) return;
      Cart.add(p, 1);
      showToast('¡Agregado! Tu caja te espera');
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(parseInt(comprar.dataset.comprar, 10));
      if (!p) return;
      Cart.add(p, pedirQty(p.id));
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
      '<p class="cart-vacio-t">Todavía no elegiste nada</p>' +
      '<p>Armá tu caja con los de maicena, los bañados o una caja lista para regalar.</p>' +
      '<a class="btn btn-cta" href="#tienda" data-cerrar-drawer>Ver los alfajores</a>' +
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
  foot.innerHTML = '<p class="cart-total"><span>Total</span><strong>' + formatearPrecio(Cart.total()) + '</strong></p>' +
    '<button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>' +
    '<a class="btn btn-line" href="https://wa.me/' + WSP + '?text=' + encodeURIComponent('Hola Emma, quiero encargar: ' + items.map(i => { const p = getProducto(i.id); return p ? p.nombre + ' x' + i.qty : ''; }).filter(Boolean).join(', ') + '.') + '" target="_blank" rel="noopener">Encargar por WhatsApp</a>' +
    '<p class="cart-nota">Los pedidos se coordinan con Emma antes del despacho.</p>';
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
      const it = Cart.get().find(i => i.id === id);
      if (it) Cart.setQty(id, it.qty + parseInt(s.dataset.cartStep, 10));
      if (it && it.qty + parseInt(s.dataset.cartStep, 10) < 1) Cart.remove(id);
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

/* ---------- modal vista rápida ---------- */

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
    ? '<strong>' + formatearPrecio(final) + '</strong><s>' + formatearPrecio(p.precio) + '</s><span class="pill">-' + p.descuento + '%</span>'
    : '<strong>' + formatearPrecio(final) + '</strong>';

  panel.innerHTML = '' +
    '<button type="button" class="icon-btn modal-cerrar" id="modalCerrar" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg></button>' +
    '<div class="modal-grid">' +
      '<div class="modal-media"><img src="' + IMG + p.img + '" width="1200" height="1200" alt="' + esc(p.alt) + '" decoding="async"></div>' +
      '<div class="modal-info">' +
        '<p class="prod-cat">' + esc(cat?.nombre || '') + '</p>' +
        '<h2 id="modalTitulo">' + esc(p.nombre) + '</h2>' +
        '<p class="modal-precio">' + precio + '</p>' +
        '<p class="modal-desc">' + esc(p.desc) + '</p>' +
        '<div class="modal-meta">' + ['<span class="tag">' + esc(p.peso) + '</span>'].concat((p.etiquetas || []).map(t => '<span class="tag">' + esc(t) + '</span>')).join('') + '</div>' +
        '<div class="modal-actions">' +
          '<div class="stepper">' +
            '<button type="button" data-step="-1" data-id="' + p.id + '" aria-label="Quitar uno">−</button>' +
            '<output data-qty="' + p.id + '">1</output>' +
            '<button type="button" data-step="1" data-id="' + p.id + '" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-cta" data-add="' + p.id + '">Agregar al carrito</button>' +
          '<button type="button" class="btn btn-ghost" data-comprar="' + p.id + '">Comprar ahora</button>' +
        '</div>' +
        (sug.length ? '<div class="modal-sug"><h3>También te puede interesar</h3><div class="sug-grid">' +
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

/* ---------- badges y flotantes ---------- */

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

/* ---------- nav ---------- */

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

/* ---------- capítulo: el alfajor que se arma ---------- */

const CAP_FINAL = {
  base: { yPercent: 9, rotation: 0, opacity: 1, scale: 1 },
  dulce: { yPercent: 0, scale: 1, opacity: 1 },
  top: { yPercent: -11, rotation: -4, opacity: 1, scale: 1 },
  coco: { scale: 1, opacity: 1 },
};

function capMarcarPaso(i) {
  document.querySelectorAll('#capPasos li').forEach((li, k) => li.classList.toggle('is-on', k === i));
  document.getElementById('alfFicha')?.classList.toggle('is-on', i >= 3);
}

function initCapitulo() {
  const stage = document.getElementById('capStage');
  const alf = document.getElementById('alf');
  if (!stage || !alf) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { capMarcarPaso(3); return; }

  const base = alf.querySelector('[data-capa="1"]');
  const dulce = alf.querySelector('[data-capa="2"]');
  const top = alf.querySelector('[data-capa="3"]');
  const coco = alf.querySelector('[data-capa="4"]');

  const estadoFinal = () => {
    gsap.set(base, CAP_FINAL.base);
    gsap.set(dulce, CAP_FINAL.dulce);
    gsap.set(top, CAP_FINAL.top);
    gsap.set(coco, CAP_FINAL.coco);
    capMarcarPaso(3);
  };

  const construirTL = trigger => {
    gsap.set(base, { yPercent: -130, rotation: -16, opacity: 0 });
    gsap.set(dulce, { scale: .22, opacity: 0 });
    gsap.set(top, { yPercent: -165, rotation: 18, opacity: 0 });
    gsap.set(coco, { scale: .72, opacity: 0 });
    capMarcarPaso(0);

    const tl = gsap.timeline({ scrollTrigger: trigger, defaults: { ease: 'none' } });
    tl.to(base, { yPercent: CAP_FINAL.base.yPercent, rotation: 0, opacity: 1, duration: 1 })
      .to(dulce, { scale: 1, opacity: 1, duration: 1 })
      .to(top, { yPercent: CAP_FINAL.top.yPercent, rotation: -4, opacity: 1, duration: 1 })
      .to(coco, { scale: 1, opacity: 1, duration: 1 });
    return tl;
  };

  const alPaso = self => capMarcarPaso(Math.min(3, Math.floor(self.progress * 4 + 0.001)));

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => { estadoFinal(); });

  mm.add('(min-width: 1081px) and (prefers-reduced-motion: no-preference)', () => {
    construirTL({
      trigger: stage, start: 'top top', end: '+=220%',
      pin: true, scrub: .6, invalidateOnRefresh: true, onUpdate: alPaso,
    });
    return () => estadoFinal();
  });

  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    construirTL({
      trigger: stage, start: 'top top', end: 'bottom bottom',
      scrub: .6, invalidateOnRefresh: true, onUpdate: alPaso,
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { stage.classList.remove('is-sticky-mobile'); estadoFinal(); };
  });
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
  const arco = document.querySelector('.hero-arco img');
  if (arco) gsap.fromTo(arco, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power2.out' });
  if (typeof ScrollTrigger === 'undefined') return;
  const inset = document.querySelector('.hero-inset');
  const ficha = document.querySelector('.hero-ficha');
  if (inset) gsap.to(inset, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
  if (ficha) gsap.to(ficha, { yPercent: 22, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
}

/* ---------- SEO estructurado ---------- */

function initJsonLd() {
  const base = location.href.split('#')[0].split('?')[0];
  const grafo = [{
    '@type': 'Bakery',
    '@id': base + '#negocio',
    name: 'Sabores Emma',
    description: 'Alfajores artesanales de maicena, bañados en chocolate y cajas para regalar, amasados a mano.',
    telephone: '+54 9 11 5417-0686',
    image: base + 'images/alfajor-maicena-1200x1200.webp',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', addressCountry: 'AR', addressRegion: 'Buenos Aires' },
    areaServed: 'Argentina',
  }].concat(PRODUCTOS.map(p => ({
    '@type': 'Product',
    name: p.nombre,
    description: p.desc,
    image: base + 'images/' + p.img,
    category: getCategoria(p.cat)?.nombre,
    brand: { '@type': 'Brand', name: 'Sabores Emma' },
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
initReveals();
initNav();
initAcciones();
initDrawer();
initModal();
initFloats();
initCapitulo();
initHero();
initLeeScroll();
initJsonLd();
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);

if (typeof ScrollTrigger !== 'undefined') {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
