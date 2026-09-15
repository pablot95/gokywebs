const WSP = '5493424760778';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = 16;

const CATEGORIAS = [
  { id: 'abrigos', nombre: 'Abrigos' },
  { id: 'buzos', nombre: 'Buzos y remeras' },
  { id: 'pantalones', nombre: 'Pantalones' },
  { id: 'sets', nombre: 'Sets' },
];

const PRODUCTOS = [
  {
    id: 'buzo', nombre: 'Buzo Oversize Blackout', cat: 'buzos', precio: 89900, descuento: 0, orden: 1, destacado: 1,
    img: 'images/buzo-oversize-negro_1254x1254.webp', w: 1254, h: 1254, pos: '50% 32%',
    img2: 'images/look-urbano-callejero_941x1672.webp', w2: 941, h2: 1672,
    talles: { S: 3, M: 6, L: 5, XL: 4, XXL: 2 }, badge: 'Más vendido',
    tags: ['buzo', 'hoodie', 'oversize', 'frisa', 'capucha'],
    desc: 'Frisa pesada de 400 g con capucha forrada, cierres técnicos en los bolsillos y cordones amarillos. Calza oversize real: hombro caído y cuerpo ancho.',
    specs: ['Frisa 400 g peinada', 'Cierres metálicos en bolsillos', 'Puños y cintura reforzados'],
    guia: 'Calza oversize. Si buscás un fit más ajustado, pedí un talle menos.',
  },
  {
    id: 'bomber', nombre: 'Bomber Nightshift', cat: 'abrigos', precio: 154900, descuento: 0, orden: 2, destacado: 2,
    img: 'images/campera-bomber-negra_1254x1254.webp', w: 1254, h: 1254, pos: '50% 38%',
    img2: 'images/editorial-streetwear-masculino_1122x1402.webp', w2: 1122, h2: 1402,
    talles: { S: 2, M: 5, L: 5, XL: 3, XXL: 0 }, badge: 'Nuevo',
    tags: ['campera', 'bomber', 'nylon', 'capucha', 'abrigo'],
    desc: 'Bomber de nylon acolchado con capucha desmontable e interior amarillo. Corta el viento sin volumen extra.',
    specs: ['Nylon acolchado impermeable', 'Capucha desmontable', 'Interior contrastante amarillo'],
    guia: 'Fit regular: se lleva sobre buzo sin apretar.',
  },
  {
    id: 'puffer', nombre: 'Chaleco Puffer Sector', cat: 'abrigos', precio: 129900, descuento: 15, orden: 3, destacado: 3,
    img: 'images/chaleco-puffer-negro_1254x1254.webp', w: 1254, h: 1254, pos: '50% 36%',
    img2: 'images/showroom-streetwear_1619x971.webp', w2: 1619, h2: 971,
    talles: { S: 4, M: 4, L: 6, XL: 2, XXL: 1 },
    tags: ['chaleco', 'puffer', 'abrigo', 'termico'],
    desc: 'Chaleco inflado con relleno térmico y cierre doble. Va encima del buzo cuando la noche baja de diez grados.',
    specs: ['Relleno térmico liviano', 'Cierre doble carro', 'Bolsillos con cierre metálico'],
    guia: 'Pensado para superponer: pedí tu talle habitual.',
  },
  {
    id: 'cargo', nombre: 'Cargo Táctico 8 Bolsillos', cat: 'pantalones', precio: 98500, descuento: 0, orden: 4, destacado: 4,
    img: 'images/pantalon-cargo-tecnico_1254x1254.webp', w: 1254, h: 1254, pos: '50% 50%',
    img2: 'images/coleccion-urbana-nocturna_1920x686.webp', w2: 1920, h2: 686,
    talles: { S: 3, M: 5, L: 6, XL: 4, XXL: 2 }, badge: 'Ícono',
    tags: ['pantalon', 'cargo', 'tactico', 'gabardina', 'bolsillos'],
    desc: 'Gabardina técnica con ocho bolsillos, correas ajustables y ruedo con cordón. El pantalón que sostiene toda la colección.',
    specs: ['Gabardina técnica antidesgarro', '8 bolsillos funcionales', 'Ruedo ajustable con cordón'],
    guia: 'Tiro medio y pierna ancha. Talle según cintura.',
  },
  {
    id: 'jogger', nombre: 'Jogger Ripstop Chain', cat: 'pantalones', precio: 84900, descuento: 10, orden: 5, destacado: 5,
    img: 'images/jogger-urbano-negro_1254x1254.webp', w: 1254, h: 1254, pos: '50% 55%',
    img2: 'images/coleccion-urbana-nocturna_1920x686.webp', w2: 1920, h2: 686,
    talles: { S: 5, M: 6, L: 4, XL: 3, XXL: 0 },
    tags: ['pantalon', 'jogger', 'ripstop', 'cadena'],
    desc: 'Ripstop liviano con puño elástico, bolsillos con cierre y cadena desmontable. Para moverte rápido.',
    specs: ['Ripstop liviano', 'Puño elástico', 'Cadena desmontable incluida'],
    guia: 'Fit recto. Si dudás entre dos talles, llevá el mayor.',
  },
  {
    id: 'remera', nombre: 'Remera Oversize Charcoal', cat: 'buzos', precio: 42900, descuento: 0, orden: 6, destacado: 6,
    img: 'images/remera-oversize-charcoal_1254x1254.webp', w: 1254, h: 1254, pos: '50% 34%',
    img2: 'images/showroom-streetwear_1619x971.webp', w2: 1619, h2: 971,
    talles: { S: 6, M: 8, L: 7, XL: 5, XXL: 3 },
    tags: ['remera', 'oversize', 'algodon', 'basica', 'charcoal'],
    desc: 'Algodón peinado 24/1 con caída ancha y hombro caído. El gris que no se lava a los tres usos.',
    specs: ['Algodón peinado 24/1', 'Hombro caído', 'Cuello reforzado'],
    guia: 'Corte oversize unisex.',
  },
  {
    id: 'set-nocturno', nombre: 'Set Nocturno: buzo + cargo', cat: 'sets', precio: 164900, descuento: 0, orden: 7, destacado: 7,
    img: 'images/look-urbano-callejero_941x1672.webp', w: 941, h: 1672, pos: '50% 45%',
    img2: 'images/buzo-oversize-negro_1254x1254.webp', w2: 1254, h2: 1254,
    talles: { S: 2, M: 4, L: 3, XL: 2, XXL: 0 }, badge: 'Combo',
    tags: ['set', 'combo', 'buzo', 'cargo', 'look'],
    desc: 'El look completo de la campaña: buzo oversize más cargo ancho con arneses. Se envía en una sola caja.',
    specs: ['Buzo Blackout + Cargo Táctico', 'Mismo talle en las dos prendas', 'Ahorro respecto de comprarlas sueltas'],
    guia: 'El talle aplica a las dos prendas del set.',
  },
  {
    id: 'set-bloque', nombre: 'Set Bloque: bomber + hoodie + cargo', cat: 'sets', precio: 239900, descuento: 0, orden: 8, destacado: 8,
    img: 'images/editorial-streetwear-masculino_1122x1402.webp', w: 1122, h: 1402, pos: '50% 40%',
    img2: 'images/campera-bomber-negra_1254x1254.webp', w2: 1254, h2: 1254,
    talles: { S: 1, M: 3, L: 3, XL: 2, XXL: 0 },
    tags: ['set', 'combo', 'bomber', 'hoodie', 'cargo', 'look'],
    desc: 'Tres capas armadas: bomber, hoodie con vivo amarillo y cargo. El pedido más grande del drop.',
    specs: ['Bomber + hoodie + cargo', 'Mismo talle en las tres prendas', 'Se despacha en 48 h'],
    guia: 'El talle aplica a las tres prendas.',
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const normalizar = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
const getProducto = id => PRODUCTOS.find(p => p.id === id);
const precioFinal = p => (p ? Math.round(p.precio * (1 - (p.descuento || 0) / 100)) : 0);
const stockTalle = (p, talle) => (p?.talles?.[talle] ?? 0);
const stockTotal = p => Object.values(p?.talles || {}).reduce((s, n) => s + n, 0);
const tallesDe = p => Object.keys(p?.talles || {});

const Cart = {
  KEY: 'diskontrol_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, talle = '') {
    const items = this.get();
    const tope = stockTalle(producto, talle) || 1;
    const existing = items.find(i => i.id === producto.id && i.talle === talle);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, talle, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, talle, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.talle === (talle || ''));
    if (!it) return;
    const tope = stockTalle(getProducto(id), talle) || 1;
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(id, talle) { this.save(this.get().filter(i => !(i.id === id && i.talle === (talle || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const estado = { cat: 'all', q: '', orden: 'destacados', visibles: PAGE };
const talleElegido = {};

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
  const final = precioFinal(p);
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '';
  const badge = p.badge ? `<span class="card-tag">${esc(p.badge)}</span>` : '';
  const off = p.descuento > 0 ? `<span class="card-off">-${p.descuento}%</span>` : '';
  const talles = tallesDe(p).map(t => {
    const hay = stockTalle(p, t) > 0;
    const on = talleElegido[p.id] === t;
    return `<button type="button" class="talle${on ? ' is-on' : ''}" data-talle="${t}" data-prod="${p.id}"${hay ? '' : ' disabled'} aria-label="Talle ${t}${hay ? '' : ', sin stock'}">${t}</button>`;
  }).join('');
  return `
  <article class="card" data-id="${p.id}">
    <div class="card-media">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="${p.w}" height="${p.h}" loading="lazy" decoding="async" style="object-position:${p.pos || '50% 50%'}">
      ${badge}${off}
      <button type="button" class="card-ver" data-qv="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}"></button>
      <div class="card-talles">${talles}</div>
    </div>
    <div class="card-body">
      <span class="card-cat">${esc(nombreCat)}</span>
      <button type="button" class="card-name" data-qv="${p.id}">${esc(p.nombre)}</button>
      <span class="card-precio"><b>${formatearPrecio(final)}</b>${tachado}</span>
      <div class="card-acciones">
        <div class="stepper">
          <button type="button" data-step="-1" aria-label="Restar unidad">−</button>
          <input type="number" value="1" min="1" max="${stockTotal(p)}" step="1" aria-label="Cantidad de ${esc(p.nombre)}">
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
  if (estado.orden === 'precio-asc') lista = lista.slice().sort((a, b) => precioFinal(a) - precioFinal(b));
  else if (estado.orden === 'precio-desc') lista = lista.slice().sort((a, b) => precioFinal(b) - precioFinal(a));
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
    : `${lista.length} ${lista.length === 1 ? 'prenda' : 'prendas'}${estado.cat !== 'all' ? ' · ' + (CATEGORIAS.find(c => c.id === estado.cat)?.nombre || '') : ''}`;
  document.getElementById('limpiar').hidden = estado.cat === 'all' && !estado.q && estado.orden === 'destacados';
  if (animar && typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(grid.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .05, ease: 'expo.out', overwrite: true });
  }
  if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const destacados = PRODUCTOS.filter(p => p.destacado).sort((a, b) => a.destacado - b.destacado).slice(0, 8);
  track.innerHTML = destacados.map(cardHTML).join('');
}

function renderChips() {
  const chips = document.getElementById('chips');
  if (!chips) return;
  const items = [{ id: 'all', nombre: 'Todo' }, ...CATEGORIAS];
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
      <h3>Carrito vacío</h3>
      <p>Todavía no elegiste nada. La vidriera te espera.</p>
      <button type="button" class="btn btn-cta" data-cerrar-drawer>Ver la tienda</button>
    </div>`;
    foot.innerHTML = '';
    return;
  }
  body.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    return `<div class="linea" data-id="${p.id}" data-talle="${esc(i.talle || '')}">
      <img src="${p.img}" alt="${esc(p.nombre)}" width="62" height="78" loading="lazy" style="object-position:${p.pos || '50% 50%'}">
      <div>
        <div class="linea-nombre">${esc(p.nombre)}</div>
        <div class="linea-var">Talle ${esc(i.talle || 'único')}</div>
        <div class="stepper">
          <button type="button" data-lstep="-1" aria-label="Restar unidad">−</button>
          <input type="number" value="${i.qty}" min="1" max="${stockTalle(p, i.talle) || 1}" aria-label="Cantidad de ${esc(p.nombre)}">
          <button type="button" data-lstep="1" aria-label="Sumar unidad">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div class="linea-precio">${formatearPrecio(precioFinal(p) * i.qty)}</div>
        <div class="linea-var">${formatearPrecio(precioFinal(p))} c/u</div>
        <button type="button" class="linea-quitar" data-quitar>Quitar</button>
      </div>
    </div>`;
  }).join('');
  foot.innerHTML = `
    <div class="drawer-total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></div>
    <button type="button" class="btn btn-cta" id="finalizar">Finalizar compra</button>
    <a class="btn btn-line" id="pedirWsp" href="#" target="_blank" rel="noopener">Consultar por WhatsApp</a>`;
  const wsp = document.getElementById('pedirWsp');
  if (wsp) {
    const detalle = Cart.get().map(i => {
      const p = getProducto(i.id);
      return p ? `• ${i.qty} x ${p.nombre} (talle ${i.talle || 'único'})` : '';
    }).filter(Boolean).join('\n');
    wsp.href = `https://wa.me/${WSP}?text=${encodeURIComponent('Hola DISKONTROL, quiero este pedido:\n' + detalle + '\nTotal: ' + formatearPrecio(Cart.total()))}`;
  }
}

/* ---------- Overlays ---------- */
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
  if (!drawer) return;
  lastFocus = document.activeElement;
  renderDrawer();
  drawer.classList.add('open');
  document.getElementById('drawerBackdrop').classList.add('open');
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open', 'no-scroll');
  setTimeout(() => document.getElementById('drawerClose')?.focus(), 60);
  if (typeof gsap !== 'undefined' && !reduceMotion) {
    gsap.fromTo(drawer.querySelectorAll('.linea'), { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: .4, stagger: .06, ease: 'expo.out', delay: .12 });
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('open');
  document.getElementById('drawerBackdrop').classList.remove('open');
  drawer.setAttribute('inert', '');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open', 'no-scroll');
  lastFocus?.focus();
}

const qvEstado = { id: null, img: 0 };

function qvHTML(p) {
  const nombreCat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
  const imgs = [{ src: p.img, w: p.w, h: p.h, pos: p.pos }, p.img2 ? { src: p.img2, w: p.w2, h: p.h2, pos: '50% 50%' } : null].filter(Boolean);
  const activa = imgs[qvEstado.img] || imgs[0];
  const final = precioFinal(p);
  const relacionados = PRODUCTOS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 3);
  const talles = tallesDe(p).map(t => {
    const hay = stockTalle(p, t) > 0;
    const on = talleElegido[p.id] === t;
    return `<button type="button" class="qv-talle${on ? ' is-on' : ''}" data-talle="${t}" data-prod="${p.id}"${hay ? '' : ' disabled'}>${t}</button>`;
  }).join('');
  return `
  <div class="qv-media">
    <div class="qv-main"><img src="${activa.src}" alt="${esc(p.nombre)}" width="${activa.w}" height="${activa.h}" style="object-position:${activa.pos || '50% 50%'}"></div>
    ${imgs.length > 1 ? `<div class="qv-thumbs">${imgs.map((im, i) => `<button type="button" class="${i === qvEstado.img ? 'is-on' : ''}" data-qvimg="${i}" aria-label="Ver imagen ${i + 1}"><img src="${im.src}" alt="" width="54" height="66"></button>`).join('')}</div>` : ''}
  </div>
  <div class="qv-body">
    <span class="qv-cat">${esc(nombreCat)}</span>
    <h3>${esc(p.nombre)}</h3>
    <span class="qv-precio"><b>${formatearPrecio(final)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>
    <p class="qv-desc">${esc(p.desc)}</p>
    <ul class="qv-specs">${p.specs.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
    <p class="qv-label">Talle</p>
    <div class="qv-talles">${talles}</div>
    <p class="qv-guia">${esc(p.guia)}</p>
    <div class="qv-acciones">
      <div class="stepper">
        <button type="button" data-step="-1" aria-label="Restar unidad">−</button>
        <input type="number" id="qvQty" value="1" min="1" max="${stockTotal(p)}" aria-label="Cantidad">
        <button type="button" data-step="1" aria-label="Sumar unidad">+</button>
      </div>
      <button type="button" class="btn btn-cta" data-qvadd>Agregar al carrito</button>
      <button type="button" class="btn btn-line" data-qvbuy>Comprar ahora</button>
    </div>
    ${relacionados.length ? `<div class="qv-relacionados"><h4>Combina con</h4><div class="qv-rel-grid">${relacionados.map(r => `<button type="button" class="qv-rel" data-qv="${r.id}"><img src="${r.img}" alt="${esc(r.nombre)}" width="${r.w}" height="${r.h}" loading="lazy" style="object-position:${r.pos || '50% 50%'}"><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>` : ''}
  </div>`;
}

function openQuickView(id) {
  const p = getProducto(id);
  if (!p) return;
  const modal = document.getElementById('quickView');
  if (!modal) return;
  if (!modal.classList.contains('open')) lastFocus = document.activeElement;
  qvEstado.id = id;
  qvEstado.img = 0;
  document.getElementById('qvInner').innerHTML = qvHTML(p);
  modal.classList.add('open');
  document.getElementById('modalBackdrop').classList.add('open');
  modal.removeAttribute('inert');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open', 'no-scroll');
  modal.scrollTop = 0;
  setTimeout(() => document.getElementById('qvClose')?.focus(), 60);
}

function refreshQuickView() {
  const p = getProducto(qvEstado.id);
  if (p) document.getElementById('qvInner').innerHTML = qvHTML(p);
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.classList.remove('open');
  document.getElementById('modalBackdrop').classList.remove('open');
  modal.setAttribute('inert', '');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open', 'no-scroll');
  lastFocus?.focus();
}

/* ---------- Rails arrastrables ---------- */
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

  initRailDrag(vp);

  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 14;
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

/* ---------- Lookbook (momento firma) ---------- */
function initLookbook() {
  const vp = document.getElementById('lbViewport');
  const track = document.getElementById('lbTrack');
  const barra = document.getElementById('lbBarra');
  const planchas = Array.from(document.querySelectorAll('.lb-plancha'));
  if (!vp || !track || !planchas.length) return;

  const marcarCercana = () => {
    const centro = vp.getBoundingClientRect().left + vp.clientWidth / 2;
    let mejor = 0, dist = Infinity;
    planchas.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - centro);
      if (d < dist) { dist = d; mejor = i; }
    });
    planchas.forEach((p, i) => p.classList.toggle('is-on', i === mejor));
  };

  initRailDrag(vp);
  vp.addEventListener('scroll', marcarCercana, { passive: true });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) {
    marcarCercana();
    return;
  }

  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    const recorrido = () => Math.max(0, track.scrollWidth - vp.clientWidth);
    const tw = gsap.to(track, {
      x: () => -recorrido(), ease: 'none',
      scrollTrigger: {
        trigger: '.lookbook', start: 'top top', end: () => '+=' + recorrido(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: self => {
          if (barra) barra.style.transform = `scaleX(${self.progress})`;
          marcarCercana();
        },
      },
    });
    marcarCercana();
    return () => { tw.scrollTrigger?.kill(); tw.kill(); gsap.set(track, { clearProps: 'x' }); };
  });
  mm.add('(max-width: 860px)', () => {
    marcarCercana();
    return () => { };
  });
}

/* ---------- Hero: wordmark descontrolado ---------- */
function initHeroWord() {
  const word = document.getElementById('heroWord');
  if (!word) return;
  const letras = 'DISKONTROL'.split('');
  word.innerHTML = letras.map(l => `<span>${l}</span>`).join('');
  const spans = Array.from(word.children);
  if (typeof gsap === 'undefined' || reduceMotion) return;
  gsap.from(spans, {
    yPercent: 115, rotate: () => gsap.utils.random(-14, 14), opacity: 0,
    duration: 1.1, ease: 'expo.out', stagger: { each: .045, from: 'random' }, delay: .25,
  });
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const hero = document.querySelector('.hero');
  hero?.addEventListener('pointermove', e => {
    spans.forEach(s => {
      const r = s.getBoundingClientRect();
      const d = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      gsap.to(s, { x: -d * 26, y: Math.abs(d) * -8, duration: .6, ease: 'power2.out', overwrite: 'auto' });
    });
  });
  hero?.addEventListener('pointerleave', () => gsap.to(spans, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .6)' }));
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

/* ---------- Nav ---------- */
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

/* ---------- Movimiento general ---------- */
function initMovimiento() {
  if (typeof gsap === 'undefined' || reduceMotion) return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero-bloque', { scaleY: 0, transformOrigin: 'bottom', duration: 1 }, .1)
    .from('.hero-cut', { y: 60, opacity: 0, duration: 1.1 }, .25)
    .from('.hero-tag', { scale: .8, opacity: 0, rotate: -20, duration: .7 }, .7);

  if (typeof ScrollTrigger === 'undefined') return;
  gsap.to('.hero-foto img', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 },
  });
  const showroom = document.querySelector('.taller-media img');
  if (showroom) {
    gsap.fromTo(showroom, { scale: 1.14 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.taller-media', start: 'top bottom', end: 'bottom center', scrub: .8 },
    });
  }
}

/* ---------- Eventos ---------- */
function stepperDelta(input, delta) {
  const min = parseInt(input.min || '1', 10);
  const max = parseInt(input.max || '99', 10);
  const val = Math.max(min, Math.min(max, (parseInt(input.value, 10) || min) + delta));
  input.value = val;
  return val;
}

function agregar(p, qty, origen) {
  const talle = talleElegido[p.id];
  if (!talle) {
    showToast('Elegí tu talle para continuar');
    openQuickView(p.id);
    return false;
  }
  if (stockTalle(p, talle) <= 0) { showToast('Ese talle está agotado'); return false; }
  Cart.add(p, qty, talle);
  if (origen !== 'buy') showToast(`Sumaste ${p.nombre} (talle ${talle})`);
  return true;
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
      if (linea && input) Cart.setQty(linea.dataset.id, linea.dataset.talle, stepperDelta(input, parseInt(lstep.dataset.lstep, 10)));
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const linea = quitar.closest('.linea');
      if (linea) { Cart.remove(linea.dataset.id, linea.dataset.talle); showToast('Prenda quitada del carrito'); }
      return;
    }
    const talleBtn = e.target.closest('[data-talle]');
    if (talleBtn && !talleBtn.disabled) {
      const prod = talleBtn.dataset.prod;
      talleElegido[prod] = talleBtn.dataset.talle;
      document.querySelectorAll(`[data-talle][data-prod="${prod}"]`).forEach(b => b.classList.toggle('is-on', b.dataset.talle === talleElegido[prod]));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      const input = add.closest('.card-acciones')?.querySelector('input');
      if (p) agregar(p, parseInt(input?.value, 10) || 1);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) { openQuickView(qv.dataset.qv); return; }
    const qvimg = e.target.closest('[data-qvimg]');
    if (qvimg) { qvEstado.img = parseInt(qvimg.dataset.qvimg, 10); refreshQuickView(); return; }
    const qvadd = e.target.closest('[data-qvadd]');
    const qvbuy = e.target.closest('[data-qvbuy]');
    if (qvadd || qvbuy) {
      const p = getProducto(qvEstado.id);
      const qty = parseInt(document.getElementById('qvQty')?.value, 10) || 1;
      if (!p) return;
      const talle = talleElegido[p.id];
      if (!talle) { showToast('Elegí tu talle para continuar'); return; }
      Cart.add(p, qty, talle);
      if (qvbuy) { closeQuickView(); openCartDrawer(); }
      else showToast(`Sumaste ${p.nombre} (talle ${talle})`);
      return;
    }
    const chip = e.target.closest('[data-chip]');
    if (chip) { setCategoria(chip.dataset.chip); return; }
    const catCard = e.target.closest('.cat-card');
    if (catCard) { irATienda(catCard.dataset.cat); return; }
    const navCat = e.target.closest('a[data-cat]');
    if (navCat) { e.preventDefault(); irATienda(navCat.dataset.cat); return; }
    if (e.target.closest('[data-cerrar-drawer]')) { closeCartDrawer(); irATienda(); return; }
    if (e.target.closest('#finalizar')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
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
  document.getElementById('verMas')?.addEventListener('click', () => { estado.visibles += PAGE; renderCatalogo(false); });

  document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);
  document.getElementById('drawerClose')?.addEventListener('click', closeCartDrawer);
  document.getElementById('drawerBackdrop')?.addEventListener('click', closeCartDrawer);
  document.getElementById('qvClose')?.addEventListener('click', closeQuickView);
  document.getElementById('modalBackdrop')?.addEventListener('click', closeQuickView);

  document.addEventListener('keydown', e => {
    const drawer = document.getElementById('cartDrawer');
    const modal = document.getElementById('quickView');
    if (!drawer || !modal) return;
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
    if (document.getElementById('cartDrawer')?.classList.contains('open')) renderDrawer();
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
  initHeroWord();
  initMovimiento();
  initLookbook();

  if (typeof ScrollTrigger !== 'undefined') {
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});
