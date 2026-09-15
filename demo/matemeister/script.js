const WSP = '5491168599612';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = 16;

const TRAMOS_UNIDAD = [{ min: 1, off: 0 }, { min: 6, off: .22 }, { min: 12, off: .28 }, { min: 24, off: .33 }];
const TRAMOS_PACK = [{ min: 1, off: 0 }, { min: 2, off: .06 }, { min: 4, off: .1 }];

const CATEGORIAS = [
  { id: 'mates', nombre: 'Mates' },
  { id: 'termos', nombre: 'Termos' },
  { id: 'sets', nombre: 'Sets' },
  { id: 'mayorista', nombre: 'Por mayor' },
];

const PRODUCTOS = [
  {
    id: 'nogal', nombre: 'Mate Meister Nogal', cat: 'mates', precio: 28900, descuento: 0, stock: 60, orden: 1,
    img: 'images/mate-madera-premium_1254x1254.webp', w: 1254, h: 1254, pos: '50% 52%',
    img2: 'images/coleccion-mates-artesanales_1920x686.webp', w2: 1920, h2: 686,
    tags: ['madera', 'nogal', 'clasico', 'torneado'], badge: 'Más vendido', destacado: 1,
    desc: 'Nogal macizo torneado en una sola pieza, con virola y base de acero inoxidable. La boca ancha deja armar la montañita sin que se te desarme a la tercera cebada.',
    specs: ['Virola de acero 304 soldada', 'Curado listo de fábrica', 'Base con peso antivuelco'],
    variantes: [{ n: '350 ml', d: 0 }, { n: '500 ml', d: 4200 }],
  },
  {
    id: 'cuero', nombre: 'Mate Meister Cuero Negro', cat: 'mates', precio: 32400, descuento: 0, stock: 45, orden: 2,
    img: 'images/mate-cuero-premium_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/artesano-trabajando-mate_1122x1402.webp', w2: 1122, h2: 1402,
    tags: ['cuero', 'negro', 'premium', 'oficina'], badge: 'Nuevo', destacado: 2,
    desc: 'Interior de acero forrado en cuero vacuno negro, cosido a mano en el taller. No transpira, no larga gusto y aguanta el ida y vuelta de la mochila.',
    specs: ['Cuero vacuno curtido al vegetal', 'Interior de acero apto lavavajillas', 'No necesita curado'],
    variantes: [{ n: '350 ml', d: 0 }, { n: '500 ml', d: 4200 }],
  },
  {
    id: 'quebracho', nombre: 'Mate Meister Quebracho', cat: 'mates', precio: 27900, descuento: 15, stock: 32, orden: 3,
    img: 'images/mate-rustico-artesanal_1254x1254.webp', w: 1254, h: 1254, pos: '50% 52%',
    img2: 'images/coleccion-mates-artesanales_1920x686.webp', w2: 1920, h2: 686,
    tags: ['madera', 'quebracho', 'rustico', 'veta'], destacado: 3,
    desc: 'Quebracho colorado con la veta viva a la vista: no hay dos iguales. Terminación rústica encerada, para el que quiere que se le note el uso.',
    specs: ['Veta única en cada pieza', 'Terminación encerada natural', 'Boca ancha de 6 cm'],
    variantes: [{ n: '350 ml', d: 0 }, { n: '500 ml', d: 4200 }],
  },
  {
    id: 'termo1l', nombre: 'Termo Meister 1 L', cat: 'termos', precio: 46800, descuento: 0, stock: 50, orden: 4,
    img: 'images/termo-meister-1l_941x1176.webp', w: 941, h: 1176, pos: '50% 26%',
    img2: 'images/preparando-mate_941x1672.webp', w2: 941, h2: 1672,
    tags: ['termo', 'acero', 'pico cebador', 'azul'], destacado: 4,
    desc: 'Acero inoxidable doble capa con pico cebador: doce horas de temperatura y un chorro fino que no te lava la yerba de una.',
    specs: ['12 h de temperatura', 'Pico cebador de precisión', 'Tapón a rosca con traba'],
    variantes: [{ n: '1 L', d: 0 }, { n: '1,3 L', d: 8900 }],
  },
  {
    id: 'set-marino', nombre: 'Set Marino: mate + termo', cat: 'sets', precio: 74500, descuento: 0, stock: 28, orden: 5,
    img: 'images/mate-azul-con-termo_1254x1254.webp', w: 1254, h: 1254, pos: '50% 55%',
    img2: 'images/preparando-mate_941x1672.webp', w2: 941, h2: 1672,
    tags: ['set', 'azul', 'termo', 'regalo'], badge: 'Combo', destacado: 5,
    desc: 'Mate azul marino con textura mate, termo de 1 L y bombilla pico de loro. Llega en caja de regalo, listo para entregar.',
    specs: ['Mate 350 ml + termo 1 L', 'Bombilla pico de loro con filtro', 'Caja de regalo incluida'],
    variantes: [],
  },
  {
    id: 'set-completo', nombre: 'Set Meister Completo', cat: 'sets', precio: 89900, descuento: 10, stock: 20, orden: 6,
    img: 'images/set-matero-premium_1254x1254.webp', w: 1254, h: 1254, pos: '50% 55%',
    img2: 'images/catalogo-mates-termo-yerba_1619x971.webp', w2: 1619, h2: 971,
    tags: ['set', 'verde', 'imperial', 'yerbera', 'regalo'], destacado: 6,
    desc: 'El equipo completo: mate imperial verde texturado, termo de 1 L, bombilla de acero y yerbera de cerámica. Es el que más se regala en fin de año.',
    specs: ['Mate imperial 400 ml', 'Termo 1 L con pico cebador', 'Yerbera de cerámica esmaltada'],
    variantes: [],
  },
  {
    id: 'ronda6', nombre: 'Ronda x6 surtida', cat: 'mayorista', precio: 132000, descuento: 0, stock: 24, orden: 7,
    img: 'images/catalogo-mates-termo-yerba_1619x971.webp', w: 1619, h: 971, pos: '50% 60%',
    img2: 'images/coleccion-mates-mayorista_1254x1254.webp', w2: 1254, h2: 1254,
    tags: ['mayorista', 'pack', 'reventa', 'surtido'], tramos: TRAMOS_PACK,
    desc: 'Seis mates surtidos en las cuatro terminaciones más una bombilla por unidad. El arranque ideal para probar qué se vende en tu zona.',
    specs: ['6 mates surtidos + 6 bombillas', '$22.000 por unidad', 'Embalaje individual con etiqueta'],
    variantes: [],
  },
  {
    id: 'caja12', nombre: 'Caja x12 surtida', cat: 'mayorista', precio: 246000, descuento: 0, stock: 15, orden: 8,
    img: 'images/coleccion-mates-mayorista_1254x1254.webp', w: 1254, h: 1254, pos: '50% 52%',
    img2: 'images/catalogo-mates-termo-yerba_1619x971.webp', w2: 1619, h2: 971,
    tags: ['mayorista', 'caja', 'reventa', 'surtido', 'distribuidor'], badge: 'Distribuidor', tramos: TRAMOS_PACK,
    desc: 'Caja cerrada de doce mates surtidos con bombilla, embalaje reforzado y reposición coordinada por WhatsApp.',
    specs: ['12 mates surtidos + 12 bombillas', '$20.500 por unidad', 'Reposición coordinada'],
    variantes: [],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const redondear = n => Math.round(n / 100) * 100;
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const tramosDe = p => p?.tramos || TRAMOS_UNIDAD;
const minMayor = p => tramosDe(p)[1]?.min || 6;
const deltaVariante = (p, variante) => p?.variantes?.find(v => v.n === variante)?.d || 0;
const offPorCantidad = (p, qty) => tramosDe(p).reduce((acc, t) => (qty >= t.min ? t.off : acc), 0);
const precioUnidad = (p, qty = 1, variante = '') => {
  if (!p) return 0;
  const base = p.precio + deltaVariante(p, variante);
  return redondear(base * (1 - (p.descuento || 0) / 100) * (1 - offPorCantidad(p, qty)));
};
const precioLista = (p, variante = '') => (p ? p.precio + deltaVariante(p, variante) : 0);

const Cart = {
  KEY: 'matemeister_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, variante = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.variante || '') === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, variante, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, variante, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.variante || '') === (variante || ''));
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, variante) { this.save(this.get().filter(i => !(i.id === id && (i.variante || '') === (variante || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  unidadesDe(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  total() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      return p ? s + precioUnidad(p, this.unidadesDe(i.id), i.variante) * i.qty : s;
    }, 0);
  },
  ahorro() {
    return this.get().reduce((s, i) => {
      const p = getProducto(i.id);
      if (!p) return s;
      const uni = precioUnidad(p, 1, i.variante) - precioUnidad(p, this.unidadesDe(i.id), i.variante);
      return s + uni * i.qty;
    }, 0);
  },
};

const estado = { cat: 'all', q: '', orden: 'destacados', modo: 'menor', visibles: PAGE };

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

function cardHTML(p) {
  const nombreCat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const mayorista = estado.modo === 'mayor';
  const minM = minMayor(p);
  const pUno = precioUnidad(p, 1);
  const pMayor = precioUnidad(p, minM);
  const principal = mayorista ? pMayor : pUno;
  const lista = precioLista(p);
  const tachado = !mayorista && p.descuento > 0 ? `<s>${formatearPrecio(lista)}</s>` : '';
  const badge = p.badge ? `<span class="card-tag">${esc(p.badge)}</span>` : '';
  const off = !mayorista && p.descuento > 0 ? `<span class="card-off">-${p.descuento}%</span>` : '';
  const linea = mayorista
    ? `<span class="card-mayor">c/u desde ${minM} u. · por menor ${formatearPrecio(pUno)}</span>`
    : `<span class="card-mayor">x${minM} · <b>${formatearPrecio(pMayor)} c/u</b></span>`;
  const qtyInicial = mayorista ? minM : 1;
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" style="object-position:${p.pos || '50% 50%'}">
      ${badge}${off}
      <button type="button" class="card-ver" data-qv="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"></button>
      <button type="button" class="card-buy" data-comprar="${p.id}">Comprar ahora</button>
    </div>
    <div class="card-body">
      <span class="card-cat">${esc(nombreCat)}</span>
      <button type="button" class="card-name" data-qv="${p.id}">${esc(p.nombre)}</button>
      <span class="card-precio"><b>${formatearPrecio(principal)}</b>${tachado}</span>
      ${linea}
      <div class="card-acciones">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Restar unidad">−</button>
          <input type="number" value="${qtyInicial}" min="1" max="${p.stock}" step="1" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-step="1" aria-label="Sumar unidad">+</button>
        </div>
        <button type="button" class="card-add" data-add="${p.id}">Agregar</button>
      </div>
    </div>
  </article>`;
}

function productosFiltrados() {
  const q = normalizar(estado.q).trim();
  let lista = PRODUCTOS.filter(p => {
    if (estado.cat !== 'all' && p.cat !== estado.cat) return false;
    if (!q) return true;
    const campos = normalizar([p.nombre, p.cat, CATEGORIAS.find(c => c.id === p.cat)?.nombre, p.desc, (p.tags || []).join(' ')].join(' '));
    return q.split(/\s+/).every(t => campos.includes(t));
  });
  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioUnidad(a) - precioUnidad(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioUnidad(b) - precioUnidad(a));
  else if (estado.orden === 'nombre') lista = lista.slice().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else lista = lista.slice().sort((a, b) => (a.orden || 99) - (b.orden || 99));
  return lista;
}

function renderCatalogo(animar = true) {
  const grid = document.getElementById('gridProductos');
  const vacio = document.getElementById('vacio');
  const verMas = document.getElementById('verMas');
  const resultados = document.getElementById('resultados');
  if (!grid) return;
  const lista = productosFiltrados();
  const mostrados = lista.slice(0, estado.visibles);
  grid.innerHTML = mostrados.map(cardHTML).join('');
  vacio.hidden = lista.length > 0;
  grid.hidden = lista.length === 0;
  verMas.hidden = lista.length <= estado.visibles;
  resultados.textContent = lista.length === 0
    ? 'Sin resultados'
    : `${lista.length} ${lista.length === 1 ? 'producto' : 'productos'}${estado.cat !== 'all' ? ' en ' + (CATEGORIAS.find(c => c.id === estado.cat)?.nombre || '') : ''}${estado.modo === 'mayor' ? ' · precios por mayor' : ''}`;
  document.getElementById('limpiar').hidden = estado.cat === 'all' && !estado.q && estado.orden === 'destacados';
  if (animar && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(grid.children, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: 'expo.out', overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).sort((a, b) => a.destacado - b.destacado);
  track.innerHTML = destacados.map(cardHTML).join('');
}

function renderChips() {
  const chips = document.getElementById('chips');
  if (!chips) return;
  const items = [{ id: 'all', nombre: 'Todos' }, ...CATEGORIAS];
  chips.innerHTML = items.map(c => `<button type="button" class="chip${estado.cat === c.id ? ' is-on' : ''}" data-chip="${c.id}">${esc(c.nombre)}</button>`).join('');
}

function setCategoria(cat) {
  estado.cat = cat;
  estado.visibles = PAGE;
  renderChips();
  renderCatalogo();
}

function irATienda(cat) {
  if (cat) setCategoria(cat);
  document.getElementById('tienda')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

/* ---------- Carrito ---------- */
function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    void b.offsetWidth;
    if (n) b.classList.add('bump');
  });
}

function renderDrawer() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;
  const items = Cart.get();
  if (!items.length) {
    body.innerHTML = `<div class="drawer-vacio">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5"/><circle cx="17.5" cy="20" r="1.5"/></svg>
      <h3>Todavía no hay nada acá</h3>
      <p>Sumá tu primer mate y, si llegás a 6 unidades, el precio por unidad baja solo.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver la tienda</button>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const uni = precioUnidad(p, Cart.unidadesDe(i.id), i.variante);
    return `<div class="linea" data-id="${p.id}" data-variante="${esc(i.variante || '')}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="66" height="66" loading="lazy" style="object-position:${p.pos || '50% 50%'}">
      <div>
        <div class="linea-nombre">${esc(p.nombre)}</div>
        ${i.variante ? `<div class="linea-var">${esc(i.variante)}</div>` : ''}
        <div class="stepper">
          <button type="button" data-lstep="-1" aria-label="Restar unidad">−</button>
          <input type="number" value="${i.qty}" min="1" max="${p.stock}" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-lstep="1" aria-label="Sumar unidad">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="linea-precio">${formatearPrecio(uni * i.qty)}</div>
        <div class="linea-var">${formatearPrecio(uni)} c/u</div>
        <button type="button" class="linea-quitar" data-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  const ahorro = Cart.ahorro();
  foot.innerHTML = `
    ${ahorro > 0 ? `<p class="drawer-aviso">Precio por mayor aplicado: ahorrás ${formatearPrecio(ahorro)} en este pedido.</p>` : ''}
    <div class="drawer-total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></div>
    <button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>
    <a class="btn btn-ghost" id="pedirWsp" href="#" target="_blank" rel="noopener">Consultar el pedido por WhatsApp</a>`;
  const wsp = document.getElementById('pedirWsp');
  if (wsp) {
    const detalle = Cart.get().map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} x ${p.nombre}${i.variante ? ' (' + i.variante + ')' : ''}` : '';
    }).filter(Boolean).join('\n');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent('Hola Matemeister, quiero este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total()))}`;
  }
}

/* ---------- Focus trap / overlays ---------- */
function trapFocus(cont, e) {
  const foco = cont.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!foco.length) return;
  const first = foco[0], last = foco[foco.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let lastFocus = null;

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  lastFocus = document.activeElement;
  renderDrawer();
  drawer.classList.add('open');
  bd.classList.add('open');
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open', 'no-scroll');
  setTimeout(() => document.getElementById('drawerClose')?.focus(), 60);
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(drawer.querySelectorAll('.linea'), { x: 22, opacity: 0 }, { x: 0, opacity: 1, duration: .45, stagger: .06, ease: 'expo.out', delay: .12 });
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  drawer.classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  drawer.setAttribute('inert', '');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open', 'no-scroll');
  lastFocus?.focus();
}

/* ---------- Vista rápida ---------- */
const qvEstado = { id: null, variante: '', img: 0 };

function qvHTML(p) {
  const nombreCat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const imgs = [{ src: p.img, w: p.w, h: p.h, pos: p.pos }, p.img2 ? { src: p.img2, w: p.w2, h: p.h2, pos: '50% 50%' } : null].filter(Boolean);
  const activa = imgs[qvEstado.img] || imgs[0];
  const pUno = precioUnidad(p, 1, qvEstado.variante);
  const lista = precioLista(p, qvEstado.variante);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const minM = minMayor(p);
  const escalera = tramosDe(p).map(t => {
    const activo = t.min === 1 ? false : t.min === minM;
    return `<tr class="${activo ? 'is-on' : ''}"><td>${t.min === 1 ? (minM > 2 ? '1 a ' + (minM - 1) + ' u.' : '1 u.') : 'Desde ' + t.min + ' u.'}</td><td>${formatearPrecio(precioUnidad(p, t.min, qvEstado.variante))} c/u</td></tr>`;
  }).join('');
  return `
  <div class="qv-media">
    <div class="qv-main"><img src="${activa.src}" alt="${esc(p.nombre)}" width="${activa.w}" height="${activa.h}" style="object-position:${activa.pos || '50% 50%'}"></div>
    ${imgs.length > 1 ? `<div class="qv-thumbs">${imgs.map((im, i) => `<button type="button" class="${i === qvEstado.img ? 'is-on' : ''}" data-qvimg="${i}" aria-label="Ver imagen ${i + 1}"><img src="${im.src}" alt="" width="58" height="58"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv-body">
    <span class="qv-cat">${esc(nombreCat)}</span>
    <h3 id="qvTitle">${esc(p.nombre)}</h3>
    <span class="qv-precio"><b>${formatearPrecio(pUno)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(lista)}</s>` : ''}</span>
    <p class="qv-desc">${esc(p.desc)}</p>
    <ul class="qv-specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    ${p.variantes.length ? `<div class="qv-variantes">${p.variantes.map(v => `<button type="button" class="qv-var${qvEstado.variante === v.n ? ' is-on' : ''}" data-var="${esc(v.n)}">${esc(v.n)}${v.d ? ' · +' + formatearPrecio(v.d) : ''}</button>`).join('')}</div>` : ''}
    <table class="qv-escalera"><thead><tr><th>Cantidad</th><th>Precio por unidad</th></tr></thead><tbody>${escalera}</tbody></table>
    <div class="qv-acciones">
      <div class="stepper">
        <button type="button" data-step="-1" aria-label="Restar unidad">−</button>
        <input type="number" id="qvQty" value="1" min="1" max="${p.stock}" aria-label="Cantidad">
        <button type="button" data-step="1" aria-label="Sumar unidad">+</button>
      </div>
      <button type="button" class="btn btn-cta" data-qvadd>Agregar al carrito</button>
      <button type="button" class="btn btn-ghost" data-qvbuy>Comprar ahora</button>
    </div>
    ${relacionados.length ? `<div class="qv-relacionados"><h4>También te puede interesar</h4><div class="qv-rel-grid">${relacionados.map(r => `<button type="button" class="qv-rel" data-qv="${r.id}"><img src="${r.img}" alt="${esc(r.nombre)}" width="${r.w}" height="${r.h}" loading="lazy" style="object-position:${r.pos || '50% 50%'}"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
  </div>`;
}

function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('quickView');
  const bd = document.getElementById('modalBackdrop');
  if (!modal.classList.contains('open')) lastFocus = document.activeElement;
  qvEstado.id = id;
  qvEstado.variante = p.variantes[0]?.n || '';
  qvEstado.img = 0;
  document.getElementById('qvInner').innerHTML = qvHTML(p);
  modal.classList.add('open');
  bd.classList.add('open');
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  modal.setAttribute('aria-labelledby', 'qvTitle');
  document.body.classList.add('modal-open', 'no-scroll');
  modal.scrollTop = 0;
  setTimeout(() => document.getElementById('qvClose')?.focus(), 60);
}

function refreshQuickView() {
  const p = getProducto(qvEstado.id);
  if (!p) return;
  document.getElementById('qvInner').innerHTML = qvHTML(p);
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  modal.classList.remove('open');
  document.getElementById('modalBackdrop').classList.remove('open');
  modal.setAttribute('inert', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open', 'no-scroll');
  lastFocus?.focus();
}

/* ---------- Rail ---------- */
function initRail() {
  const vp = document.getElementById('rail');
  const track = document.getElementById('railTrack');
  const prev = document.getElementById('railPrev');
  const next = document.getElementById('railNext');
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

  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 18;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));

  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

/* ---------- Capítulo: de uno a cien ---------- */
const MATES_CUT = ['images/cutout-mate-nogal.webp', 'images/cutout-mate-cuero.webp', 'images/cutout-mate-quebracho.webp'];
const TOTAL_MESA = 24;

function initEscala() {
  const mesa = document.getElementById('mesa');
  const stage = document.getElementById('escalaStage');
  const pasos = Array.from(document.querySelectorAll('#escalaPasos .paso'));
  const elUnidades = document.getElementById('escalaUnidades');
  const elPrecio = document.getElementById('escalaPrecio');
  const ref = getProducto('nogal');
  if (!mesa || !stage || !ref) return;

  mesa.innerHTML = Array.from({ length: TOTAL_MESA }, (_, i) =>
    `<img src="${MATES_CUT[i % MATES_CUT.length]}" alt="" width="454" height="742" loading="lazy" decoding="async">`).join('');
  const mates = Array.from(mesa.children);

  const setEstado = n => {
    mates.forEach((img, i) => img.classList.toggle('on', i < n));
    if (elUnidades) elUnidades.textContent = n.toLocaleString('es-AR');
    if (elPrecio) elPrecio.textContent = formatearPrecio(precioUnidad(ref, n));
    const idx = n >= 24 ? 3 : n >= 12 ? 2 : n >= 6 ? 1 : 0;
    pasos.forEach((p, i) => p.classList.toggle('is-on', i === idx));
  };

  const desdeProgreso = p => setEstado(Math.max(1, Math.min(TOTAL_MESA, Math.round(1 + p * (TOTAL_MESA - 1)))));

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    setEstado(TOTAL_MESA);
    return;
  }

  setEstado(1);
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1081px)', () => {
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: '+=240%', pin: true, scrub: .6,
      anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: self => desdeProgreso(self.progress),
    });
    return () => st.kill();
  });
  mm.add('(max-width: 1080px) and (prefers-reduced-motion: no-preference)', () => {
    stage.classList.add('is-sticky-mobile');
    const st = ScrollTrigger.create({
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
      onUpdate: self => desdeProgreso(self.progress),
    });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { st.kill(); stage.classList.remove('is-sticky-mobile'); };
  });
}

/* ---------- Reveals ---------- */
function initReveals() {
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

/* ---------- Nav mobile ---------- */
function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  const bd = document.getElementById('navBackdrop');
  if (!toggle || !nav || !bd) return;
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open'); nav.setAttribute('inert', '');
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
  const mq = window.matchMedia('(min-width: 769px)');
  mq.addEventListener('change', e => { if (e.matches) { close(); nav.removeAttribute('inert'); } else if (!nav.classList.contains('open')) nav.setAttribute('inert', ''); });
  if (mq.matches) nav.removeAttribute('inert');
}

/* ---------- Flotantes ---------- */
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

/* ---------- Movimiento del hero y parallax ---------- */
function initMovimiento() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero-block', { clipPath: 'inset(0 0 0 100%)', duration: 1.1 }, 0)
    .from('.hero-mate', { y: 70, rotation: -9, opacity: 0, duration: 1.15 }, .18)
    .from('.hero-set', { y: 46, x: 30, opacity: 0, duration: 1 }, .38)
    .from('.hero-sello', { scale: .82, opacity: 0, duration: .8 }, .6);

  if (typeof ScrollTrigger === 'undefined') return;
  gsap.utils.toArray('.parallax').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  gsap.to('.hero-wordmark', {
    yPercent: -18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
  gsap.fromTo('.band img', { scale: 1.12 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom center', scrub: .8 },
  });
}

/* ---------- Eventos globales ---------- */
function stepperDelta(input, delta) {
  const min = parseInt(input.min || '1', 10);
  const max = parseInt(input.max || '99', 10);
  const val = Math.max(min, Math.min(max, (parseInt(input.value, 10) || min) + delta));
  input.value = val;
  return val;
}

function initEventos() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      if (input) stepperDelta(input, parseInt(step.dataset.step, 10));
      return;
    }
    const lstep = e.target.closest('[data-lstep]');
    if (lstep) {
      const linea = lstep.closest('.linea');
      const input = lstep.parentElement.querySelector('input');
      if (linea && input) Cart.setQty(linea.dataset.id, linea.dataset.variante, stepperDelta(input, parseInt(lstep.dataset.lstep, 10)));
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const linea = quitar.closest('.linea');
      if (linea) { Cart.remove(linea.dataset.id, linea.dataset.variante); showToast('Producto quitado del carrito'); }
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const input = add.closest('.card-acciones')?.querySelector('input');
      const qty = parseInt(input?.value, 10) || 1;
      if (p) { Cart.add(p, qty, p.variantes[0]?.n || ''); showToast('¡Agregado! Tu carrito te espera'); }
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      const input = comprar.closest('.card-media')?.parentElement.querySelector('.card-acciones input');
      if (p) { Cart.add(p, parseInt(input?.value, 10) || 1, p.variantes[0]?.n || ''); openCartDrawer(); }
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { openQuickView(qv.dataset.qv); return; }
    const qvimg = e.target.closest('[data-qvimg]');
    if (qvimg) { qvEstado.img = parseInt(qvimg.dataset.qvimg, 10); refreshQuickView(); return; }
    const qvvar = e.target.closest('[data-var]');
    if (qvvar) { qvEstado.variante = qvvar.dataset.var; refreshQuickView(); return; }
    const qvadd = e.target.closest('[data-qvadd]');
    const qvbuy = e.target.closest('[data-qvbuy]');
    if (qvadd || qvbuy) {
      const p = getProducto(qvEstado.id);
      const qty = parseInt(document.getElementById('qvQty')?.value, 10) || 1;
      if (p) {
        Cart.add(p, qty, qvEstado.variante);
        if (qvbuy) { closeQuickView(); openCartDrawer(); }
        else showToast('¡Agregado! Tu carrito te espera');
      }
      return;
    }
    const chip = e.target.closest('[data-chip]');
    if (chip) { setCategoria(chip.dataset.chip); return; }
    const catCard = e.target.closest('.cat-card');
    if (catCard) { irATienda(catCard.dataset.cat); return; }
    const navCat = e.target.closest('a[data-cat]');
    if (navCat) { e.preventDefault(); irATienda(navCat.dataset.cat); return; }
    const modo = e.target.closest('[data-modo]');
    if (modo) {
      estado.modo = modo.dataset.modo;
      document.querySelectorAll('[data-modo]').forEach(b => b.classList.toggle('is-on', b.dataset.modo === estado.modo));
      renderRail(); renderCatalogo();
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { closeCartDrawer(); irATienda(); return; }
    if (e.target.closest('#finalizar')) {
      showToast('¡Genial! El pago online se activa al pasar la web a producción.');
      return;
    }
  });

  document.getElementById('buscar')?.addEventListener('input', e => {
    estado.q = e.target.value;
    estado.visibles = PAGE;
    renderCatalogo();
  });
  document.getElementById('orden')?.addEventListener('change', e => {
    estado.orden = e.target.value;
    estado.visibles = PAGE;
    renderCatalogo();
  });
  document.getElementById('limpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('vaciarFiltros')?.addEventListener('click', limpiarFiltros);
  document.getElementById('verMas')?.addEventListener('click', () => {
    estado.visibles += PAGE;
    renderCatalogo(false);
  });
  document.getElementById('verMayorista')?.addEventListener('click', e => {
    e.preventDefault();
    estado.modo = 'mayor';
    document.querySelectorAll('[data-modo]').forEach(b => b.classList.toggle('is-on', b.dataset.modo === 'mayor'));
    renderRail(); renderCatalogo();
    irATienda();
    showToast('Listo: estás viendo los precios por mayor');
  });

  document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  document.getElementById('qvClose')?.addEventListener('click', closeQuickView);
  document.getElementById('modalBackdrop')?.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cartDrawer');
    const modal = document.getElementById('quickView');
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) { closeQuickView(); return; }
      if (drawer.classList.contains('open')) { closeCartDrawer(); return; }
    }
    if (e.key === 'Tab') {
      if (modal.classList.contains('open')) trapFocus(modal, e);
      else if (drawer.classList.contains('open')) trapFocus(drawer, e);
    }
  });

  document.addEventListener('cart:updated', () => {
    updateCartBadge();
    if (document.getElementById('cartDrawer').classList.contains('open')) renderDrawer();
  });
}

function limpiarFiltros() {
  estado.cat = 'all';
  estado.q = '';
  estado.orden = 'destacados';
  estado.visibles = PAGE;
  const buscar = document.getElementById('buscar');
  if (buscar) buscar.value = '';
  const orden = document.getElementById('orden');
  if (orden) orden.value = 'destacados';
  renderChips();
  renderCatalogo();
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-animate]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.style.clipPath = 'none'; });
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  renderChips();
  renderRail();
  renderCatalogo(false);
  updateCartBadge();
  initEventos();
  initRail();
  initNav();
  initFloats();
  initReveals();
  initMovimiento();
  initEscala();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
