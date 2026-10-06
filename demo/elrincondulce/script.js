const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491125467032';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const normalizar = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const ICON = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
};

const IMG = {
  'mesa-dulce.webp': [1672, 941],
  'filmando.webp': [941, 1672],
  'tarta-frutal.webp': [1254, 1254],
  'budin-limon.webp': [1254, 1254],
  'shots.webp': [1254, 1254],
  'caja-dulce.webp': [1254, 1254],
};

const CATEGORIAS = [
  { id: 'promos', nombre: 'Promos' },
  { id: 'tartas', nombre: 'Tartas y tortas' },
  { id: 'budines', nombre: 'Budines' },
  { id: 'shots', nombre: 'Shots' },
  { id: 'postres', nombre: 'Postres y mesas dulces' },
];

const OCASIONES = {
  merienda: { nombre: 'Merienda', frase: 'para la merienda', wsp: 'una merienda' },
  cumple: { nombre: 'Cumpleaños', frase: 'para el cumple', wsp: 'un cumpleaños' },
  mesa: { nombre: 'Mesa dulce', frase: 'para la mesa dulce', wsp: 'una mesa dulce' },
};

const TARTA = [['Mediana · 8 porciones', 0], ['Grande · 12 porciones', 7000]];

const PRODUCTOS = [
  { id: 'caja-dulce', nombre: 'Caja dulce de la semana', cat: 'promos', precio: 26000, descuento: 15, foto: 'caja-dulce.webp', foco: [0.55, 0.5, 1.05], alt: 'Caja de cartón con budín marmolado, cookies, tartitas de frutos rojos, lemon pie individual y medialunas', destacado: 1, oc: ['merienda', 'mesa'], rinde: '6 a 8 personas', desc: 'Lo que sale esta semana, surtido en una caja: budín marmolado, tartitas, lemon pie individual, cookies y medialunas.', ficha: [['Rinde', '6 a 8 personas'], ['Cambia', 'Todas las semanas']], tags: 'promo caja surtida regalo cookies medialunas semana' },
  { id: 'combo-cumple', nombre: 'Combo cumple: torta + 12 shots', cat: 'promos', precio: 56000, descuento: 10, foto: 'filmando.webp', foco: [0.42, 0.4, 1.3], alt: 'Mesa con torta de chocolate, tarta frutal y shots vista desde arriba', destacado: 3, oc: ['cumple'], rinde: '20 porciones y 12 shots', desc: 'Torta de cumpleaños de 20 porciones con la temática que quieras, más 12 shots surtidos.', ficha: [['Torta', '20 porciones'], ['Shots', '12 surtidos']], tags: 'combo cumple cumpleanos torta shots promo' },
  { id: 'duo-budines', nombre: 'Dúo de budines', cat: 'promos', precio: 18500, descuento: 12, foto: 'budin-limon.webp', foco: [0.45, 0.5, 1], alt: 'Budín de limón glaseado cortado en rodajas sobre una tabla de madera', oc: ['merienda'], rinde: '20 porciones', desc: 'Un budín de limón y amapola y un budín marmolado, para la merienda de toda la semana.', ficha: [['Incluye', '2 budines enteros']], tags: 'budin budines promo duo limon marmolado merienda' },
  { id: 'tarta-frutal', nombre: 'Tarta frutal', cat: 'tartas', precio: 22000, descuento: 0, medidas: TARTA, foto: 'tarta-frutal.webp', foco: [0.6, 0.45, 1.25], alt: 'Tarta frutal con frutillas y arándanos sobre una fuente de cerámica', destacado: 4, oc: ['merienda', 'cumple'], rinde: '8 o 12 porciones', desc: 'Masa sablée, crema pastelera y frutas frescas arriba.', ficha: [['Base', 'Masa sablée'], ['Relleno', 'Crema pastelera']], tags: 'tarta frutal frutas frutilla arandanos crema' },
  { id: 'tarta-frutillas', nombre: 'Tarta de frutillas', cat: 'tartas', precio: 20000, descuento: 0, medidas: TARTA, foto: 'mesa-dulce.webp', foco: [0.4, 0.4, 2.4], alt: 'Tarta de frutillas con arándanos en una mesa dulce', oc: ['merienda', 'cumple'], rinde: '8 o 12 porciones', desc: 'La clásica: frutillas enteras sobre crema pastelera y masa sablée.', tags: 'tarta frutilla frutillas crema' },
  { id: 'lemon-pie', nombre: 'Lemon pie', cat: 'tartas', precio: 19000, descuento: 0, medidas: [['Mediana · 8 porciones', 0], ['Grande · 12 porciones', 6000]], foto: 'mesa-dulce.webp', foco: [0.55, 0.46, 3], alt: 'Lemon pie con merengue tostado', oc: ['merienda', 'cumple'], rinde: '8 o 12 porciones', desc: 'Crema de limón ácida y merengue tostado.', tags: 'lemon pie limon merengue tarta' },
  { id: 'cheesecake', nombre: 'Cheesecake de frutos rojos', cat: 'tartas', precio: 24000, descuento: 0, medidas: TARTA, foto: 'mesa-dulce.webp', foco: [0.83, 0.8, 2.6], alt: 'Porción de cheesecake con salsa de frutos rojos y arándanos', oc: ['merienda', 'cumple'], rinde: '8 o 12 porciones', desc: 'Horneado y cremoso, con salsa de frutos rojos arriba.', tags: 'cheesecake queso frutos rojos frutilla' },
  { id: 'torta-cumple', nombre: 'Torta de cumpleaños a pedido', cat: 'tartas', precio: 38000, descuento: 0, medidas: [['20 porciones', 0], ['30 porciones', 12000], ['40 porciones', 24000]], foto: 'mesa-dulce.webp', foco: [0.16, 0.4, 2.2], alt: 'Torta de chocolate con nueces en una mesa dulce', destacado: 2, oc: ['cumple'], rinde: '20 a 40 porciones', desc: 'La decoramos con la temática que nos pidas: contanos la idea cuando la encargás.', ficha: [['Decoración', 'Con la temática que elijas'], ['En la foto', 'Chocolate con nueces']], tags: 'torta cumpleanos cumple tematica personalizada chocolate' },
  { id: 'budin-limon', nombre: 'Budín de limón y amapola', cat: 'budines', precio: 9500, descuento: 0, foto: 'budin-limon.webp', foco: [0.33, 0.47, 1.4], alt: 'Budín de limón y amapola con glaseado, cortado en rodajas', destacado: 7, oc: ['merienda'], rinde: '10 porciones', desc: 'Húmedo, con semillas de amapola y glaseado de limón.', ficha: [['Rinde', '10 porciones']], tags: 'budin limon amapola glaseado merienda' },
  { id: 'budin-marmolado', nombre: 'Budín marmolado', cat: 'budines', precio: 9000, descuento: 0, foto: 'caja-dulce.webp', foco: [0.18, 0.4, 2.4], alt: 'Rodajas de budín marmolado de vainilla y chocolate', oc: ['merienda'], rinde: '10 porciones', desc: 'Vainilla y chocolate en la misma masa, el de toda la vida.', ficha: [['Rinde', '10 porciones']], tags: 'budin marmolado chocolate vainilla merienda' },
  { id: 'shots-frutos', nombre: 'Shots de frutos rojos x 6', cat: 'shots', precio: 12000, descuento: 0, foto: 'shots.webp', foco: [0.48, 0.6, 2.2], alt: 'Shot de crema y frutos rojos en vaso de vidrio', destacado: 5, oc: ['cumple', 'mesa'], rinde: '6 shots', desc: 'Crema, crumble y frutos rojos en capas, en vasitos individuales.', tags: 'shots vasitos frutos rojos postre' },
  { id: 'shots-chocolate', nombre: 'Shots de chocolate x 6', cat: 'shots', precio: 12000, descuento: 0, foto: 'shots.webp', foco: [0.8, 0.62, 2.2], alt: 'Shot de mousse de chocolate con pistachos', oc: ['cumple', 'mesa'], rinde: '6 shots', desc: 'Mousse de chocolate con crocante de pistacho arriba.', tags: 'shots chocolate mousse pistacho' },
  { id: 'shots-ddl', nombre: 'Shots de dulce de leche x 6', cat: 'shots', precio: 11500, descuento: 0, foto: 'shots.webp', foco: [0.17, 0.55, 2.4], alt: 'Shot de dulce de leche con crema y crumble de nueces', oc: ['cumple', 'mesa'], rinde: '6 shots', desc: 'Dulce de leche, crema y crumble de nueces.', tags: 'shots dulce de leche crumble nueces' },
  { id: 'shots-cheesecake', nombre: 'Shots de cheesecake x 6', cat: 'shots', precio: 12500, descuento: 0, foto: 'shots.webp', foco: [0.64, 0.4, 2.6], alt: 'Shot de cheesecake con frambuesas y arándanos', nuevo: true, oc: ['cumple', 'mesa'], rinde: '6 shots', desc: 'Crema de queso, base de galletita y frutos rojos.', tags: 'shots cheesecake queso' },
  { id: 'shots-surtidos', nombre: 'Shots surtidos x 12', cat: 'shots', precio: 22000, descuento: 0, foto: 'shots.webp', foco: [0.5, 0.55, 1.1], alt: 'Shots dulces de distintos gustos sobre una tabla de madera', oc: ['cumple', 'mesa'], rinde: '12 shots', desc: 'Una docena de los cuatro gustos, para el cumple o la mesa dulce.', tags: 'shots surtidos docena cumple mesa' },
  { id: 'tartitas-frutos', nombre: 'Tartitas de frutos rojos x 6', cat: 'postres', precio: 13500, descuento: 0, foto: 'caja-dulce.webp', foco: [0.5, 0.5, 2.2], alt: 'Tartitas individuales con frutillas, frambuesas y arándanos', oc: ['mesa', 'merienda'], rinde: '6 tartitas', desc: 'Tartitas individuales de crema pastelera y frutos rojos.', tags: 'tartitas individuales frutos rojos mesa dulce' },
  { id: 'lemon-individual', nombre: 'Lemon pie individuales x 6', cat: 'postres', precio: 12500, descuento: 0, foto: 'caja-dulce.webp', foco: [0.72, 0.52, 2.6], alt: 'Lemon pie individual con merengue tostado', nuevo: true, oc: ['mesa', 'merienda'], rinde: '6 unidades', desc: 'La versión chica del lemon pie, para servir en la mesa dulce.', tags: 'lemon pie individual limon mesa dulce' },
  { id: 'mesa-dulce', nombre: 'Mesa dulce para tu evento', cat: 'postres', precio: 120000, descuento: 0, medidas: [['20 personas', 0], ['30 personas', 50000], ['40 personas', 95000]], foto: 'mesa-dulce.webp', foco: [0.5, 0.55, 1], alt: 'Mesa dulce completa con tartas, budines, shots, cookies y cheesecake', destacado: 6, oc: ['mesa', 'cumple'], rinde: '20 a 40 personas', desc: 'Tartas, budines, shots y postres individuales para tu evento. La armamos según la cantidad de invitados.', ficha: [['Incluye', 'Tartas, budines, shots y postres'], ['Armado', 'Lo coordinamos con vos']], tags: 'mesa dulce evento cumpleanos fiesta' },
];

const getProducto = id => PRODUCTOS.find(p => p.id === id);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const tieneMedidas = p => (p?.medidas?.length || 0) > 1;
const precioBase = (p, m = 0) => p.precio + (p.medidas?.[m]?.[1] || 0);
const precioFinal = (p, m = 0) => (p.descuento > 0 ? Math.round(precioBase(p, m) * (1 - p.descuento / 100)) : precioBase(p, m));
const varTexto = (p, m = 0) => (tieneMedidas(p) ? p.medidas[m]?.[0] || '' : '');

function recorte(img, foco, ar = 1) {
  const [w, h] = IMG[img] || [1, 1];
  const [cx, cy, z] = foco || [0.5, 0.5, 1];
  const c = Math.max(ar / w, 1 / h);
  const vw = ar / c;
  const vh = 1 / c;
  const px = w - vw > 0.5 ? clamp01((cx * w - vw / 2) / (w - vw)) : 0.5;
  const py = h - vh > 0.5 ? clamp01((cy * h - vh / 2) / (h - vh)) : 0.5;
  const x0 = (w - vw) * px;
  const y0 = (h - vh) * py;
  const fx = z > 1 ? clamp01((cx * w - x0 - vw / (2 * z)) / (vw * (1 - 1 / z))) : 0.5;
  const fy = z > 1 ? clamp01((cy * h - y0 - vh / (2 * z)) / (vh * (1 - 1 / z))) : 0.5;
  const pct = v => (v * 100).toFixed(1) + '%';
  return `--op:${pct(px)} ${pct(py)};--to:${pct(fx)} ${pct(fy)};--z:${z}`;
}

const imgAttrs = img => `width="${IMG[img]?.[0] || 800}" height="${IMG[img]?.[1] || 800}"`;
const rutaImg = img => `images/${img}?v=2`;
const intentar = fn => {
  try { fn(); } catch (err) { return err; }
  return null;
};

const Cart = {
  KEY: 'elrincondulce_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { intentar(() => localStorage.setItem(this.KEY, JSON.stringify(items))); document.dispatchEvent(new CustomEvent('cart:updated')); },
  sumar(items, producto, qty, m) {
    const existing = items.find(i => i.id === producto.id && (i.m || 0) === (m || 0));
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, m: m || 0, qty: Math.min(qty, 99) });
  },
  add(producto, qty = 1, m = 0) {
    const items = this.get();
    this.sumar(items, producto, qty, m);
    this.save(items);
  },
  addVarios(lineas) {
    const items = this.get();
    lineas.forEach(l => this.sumar(items, l.p, l.q, l.m));
    this.save(items);
  },
  setQty(index, qty) {
    const items = this.get();
    const it = items[index];
    if (!it) return;
    it.qty = Math.max(1, Math.min(Math.round(qty), 99));
    this.save(items);
  },
  remove(index) { const items = this.get(); items.splice(index, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.m) * i.qty : s; }, 0); },
};

function precioHTML(p) {
  const desde = tieneMedidas(p) ? '<span class="precio__desde">desde</span> ' : '';
  const fin = formatearPrecio(precioFinal(p));
  if (p.descuento > 0) return `${desde}<s>${formatearPrecio(precioBase(p))}</s> ${fin}`;
  return `${desde}${fin}`;
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">−${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  return `<span class="prod__badges">${b.join('')}</span>`;
}

function stepperHTML(p) {
  return `<div class="stepper" data-step="${p.id}"><button type="button" data-menos aria-label="Restar uno">−</button><span class="stepper__n" data-n data-v="1">1</span><button type="button" data-mas aria-label="Sumar uno">+</button></div>`;
}

function prodHTML(p, anim = true) {
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const variantes = tieneMedidas(p);
  const mas = variantes
    ? `<button type="button" class="prod__add" data-quick="${p.id}" aria-label="Elegir el tamaño de ${esc(p.nombre)}">${ICON.mas}</button>`
    : `<button type="button" class="prod__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.mas}</button>`;
  const acciones = variantes
    ? `<button type="button" class="prod-add" data-quick="${p.id}">Elegir tamaño</button>`
    : `${stepperHTML(p)}<button type="button" class="prod-add" data-add="${p.id}">Agregar</button>`;
  return `<li class="cat-item"${a}><article class="prod" data-id="${p.id}">
    <div class="prod__foto"><button type="button" class="prod__media recorte" data-quick="${p.id}" style="${recorte(p.foto, p.foco, 1)}" aria-label="Ver ${esc(p.nombre)}"><img src="${rutaImg(p.foto)}" alt="${esc(p.alt)}" ${imgAttrs(p.foto)} draggable="false"></button>${mas}</div>
    <div class="prod__info">
      ${badgesHTML(p)}
      <p class="prod__cat">${esc(catDe(p.cat)?.nombre)}</p>
      <h3 class="prod__nombre">${esc(p.nombre)}</h3>
      <p class="prod__desc">${esc(p.desc)}</p>
      <p class="prod__precio">${precioHTML(p)}</p>
      <div class="prod-actions">${acciones}</div>
      ${variantes ? '' : `<button type="button" class="prod-comprar" data-comprar="${p.id}">Comprar ahora</button>`}
    </div>
  </article></li>`;
}

let revealsListos = false;

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const entrar = (el, n) => {
    const d = Math.min(n * 0.1, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  };
  const io = new IntersectionObserver(entries => {
    let n = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    let n = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  requestAnimationFrame(() => requestAnimationFrame(queueSweep));
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

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

const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function irA(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function aplicarRecortes(root = document) {
  root.querySelectorAll('.recorte[data-foco]').forEach(el => {
    const f = el.dataset.foco.split(' ').map(Number);
    el.setAttribute('style', recorte(el.dataset.img, f, Number(el.dataset.ar) || 1));
  });
}

function contar() {
  document.querySelectorAll('[data-oc-count]').forEach(el => {
    el.textContent = PRODUCTOS.filter(p => (p.oc || []).includes(el.dataset.ocCount)).length;
  });
}

const POR_PAGINA = 16;
const estado = { q: '', cat: '', oc: '', orden: 'rel', visibles: POR_PAGINA };

function espaciar(lista) {
  const resto = [...lista];
  const out = [];
  const libre = (p, k) => ![...Array(k).keys()].some(j => out[out.length - 1 - j]?.foto === p.foto);
  while (resto.length) {
    let i = -1;
    for (const k of [3, 2, 1]) {
      i = resto.findIndex(p => libre(p, k));
      if (i >= 0) break;
    }
    out.push(resto.splice(Math.max(i, 0), 1)[0]);
  }
  return out;
}

function filtrar() {
  const palabras = normalizar(estado.q).trim().split(/\s+/).filter(Boolean);
  const lista = PRODUCTOS.filter(p => {
    if (estado.cat && p.cat !== estado.cat) return false;
    if (estado.oc && !(p.oc || []).includes(estado.oc)) return false;
    if (palabras.length) {
      const texto = normalizar([p.nombre, catDe(p.cat)?.nombre, p.desc, p.tags, (p.oc || []).map(o => OCASIONES[o].nombre).join(' ')].join(' '));
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  });
  const idx = p => PRODUCTOS.indexOf(p);
  if (estado.orden === 'menor') return lista.sort((a, b) => precioFinal(a) - precioFinal(b));
  if (estado.orden === 'mayor') return lista.sort((a, b) => precioFinal(b) - precioFinal(a));
  if (estado.orden === 'az') return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  return espaciar(lista.sort((a, b) => (a.destacado || 99) - (b.destacado || 99) || idx(a) - idx(b)));
}

function resumenCatalogo(n) {
  const unidad = n === 1 ? 'producto' : 'productos';
  if (estado.q.trim()) return `${n} ${n === 1 ? 'resultado' : 'resultados'} para «${estado.q.trim()}»`;
  const oc = estado.oc ? OCASIONES[estado.oc]?.frase : '';
  if (estado.cat) return `${n} ${unidad} en ${catDe(estado.cat)?.nombre}${oc ? ` ${oc}` : ''}`;
  if (oc) return `${n} ${unidad} ${oc}`;
  return `${n} ${unidad} para la merienda, el cumple o la mesa dulce`;
}

function renderCatalogo(mas = false) {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const lista = filtrar();
  const antes = mas ? Math.min(estado.visibles, lista.length) : 0;
  estado.visibles = mas ? estado.visibles + POR_PAGINA : POR_PAGINA;
  const visibles = lista.slice(0, estado.visibles);
  if (mas) grid.insertAdjacentHTML('beforeend', visibles.slice(antes).map(p => prodHTML(p)).join(''));
  else grid.innerHTML = visibles.map(p => prodHTML(p)).join('');
  const resumen = document.getElementById('catResumen');
  if (resumen) resumen.textContent = resumenCatalogo(lista.length);
  const pie = document.getElementById('catPie');
  if (pie) pie.textContent = lista.length ? `Mostrando ${visibles.length} de ${lista.length}` : '';
  const verMas = document.getElementById('verMas');
  if (verMas) {
    const faltan = lista.length - visibles.length;
    verMas.hidden = faltan <= 0;
    verMas.textContent = `Ver ${Math.min(POR_PAGINA, faltan)} ${faltan === 1 ? 'producto' : 'productos'} más`;
  }
  const vacio = document.getElementById('catVacio');
  if (vacio) vacio.hidden = lista.length > 0;
  document.querySelectorAll('#catPills [data-pill]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pill === estado.cat)));
  document.querySelectorAll('[data-oc]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.oc === estado.oc)));
  renderChips();
  revelarNuevos(grid);
  refrescar();
}

function renderChips() {
  const cont = document.getElementById('chipsActivos');
  if (!cont) return;
  cont.innerHTML = estado.q.trim() ? `<button type="button" class="chip-x" data-quitar="q" aria-label="Quitar la búsqueda «${esc(estado.q.trim())}»">«${esc(estado.q.trim())}» ${ICON.x}</button>` : '';
}

function sincronizarBuscador() {
  const q = document.getElementById('catQ');
  if (q && q.value !== estado.q) q.value = estado.q;
}

function limpiarFiltros() {
  estado.q = '';
  estado.cat = '';
  estado.oc = '';
  sincronizarBuscador();
  renderCatalogo();
}

function filtrarPor({ cat = '', oc = '' } = {}) {
  estado.q = '';
  estado.cat = cat;
  estado.oc = oc;
  sincronizarBuscador();
  renderCatalogo();
  irA('tienda');
}

function initCatalogoUI() {
  const q = document.getElementById('catQ');
  if (!q) return;
  let t = 0;
  q.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { estado.q = q.value; renderCatalogo(); }, 160);
  });
  document.getElementById('catOrden')?.addEventListener('change', e => { estado.orden = e.target.value; renderCatalogo(); });
  document.getElementById('catPills')?.addEventListener('click', e => {
    const b = e.target.closest('[data-pill]');
    if (!b) return;
    estado.cat = b.dataset.pill;
    renderCatalogo();
  });
  document.querySelector('.ocasion-chips')?.addEventListener('click', e => {
    const b = e.target.closest('[data-oc]');
    if (!b) return;
    estado.oc = estado.oc === b.dataset.oc ? '' : b.dataset.oc;
    renderCatalogo();
  });
  document.getElementById('vacioLimpiar')?.addEventListener('click', limpiarFiltros);
  document.getElementById('verMas')?.addEventListener('click', () => renderCatalogo(true));
  document.getElementById('chipsActivos')?.addEventListener('click', e => {
    if (!e.target.closest('[data-quitar]')) return;
    estado.q = '';
    sincronizarBuscador();
    renderCatalogo();
  });
}

function agregar(p, q = 1, m = 0) {
  if (!p) return;
  Cart.add(p, q, m);
  const v = varTexto(p, m);
  showToast(`Sumaste ${q > 1 ? `${q} × ` : ''}${p.nombre}${v ? ` (${v})` : ''} al carrito`);
}

function cantidadDe(el) {
  const n = el.closest('.prod')?.querySelector('.stepper [data-n]');
  return Number(n?.dataset.v || 1);
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const el = e.target.closest('button, a');
    if (!el) return;
    const st = el.closest('.stepper[data-step]');
    if (st && (el.hasAttribute('data-menos') || el.hasAttribute('data-mas'))) {
      const n = st.querySelector('[data-n]');
      if (!n) return;
      let v = Number(n.dataset.v || 1);
      v = el.hasAttribute('data-mas') ? Math.min(99, v + 1) : Math.max(1, v - 1);
      n.dataset.v = v;
      n.textContent = v;
      return;
    }
    if (el.dataset.add) {
      agregar(getProducto(el.dataset.add), cantidadDe(el), 0);
      return;
    }
    if (el.dataset.comprar) {
      const p = getProducto(el.dataset.comprar);
      if (!p) return;
      Cart.add(p, cantidadDe(el), 0);
      abrirDrawer(el);
      return;
    }
    if (el.dataset.quick) {
      e.preventDefault();
      abrirQuick(el.dataset.quick, el);
      return;
    }
    if (el.dataset.ocasion) {
      e.preventDefault();
      filtrarPor({ oc: el.dataset.ocasion });
      return;
    }
    if (el.dataset.cat) {
      e.preventDefault();
      filtrarPor({ cat: el.dataset.cat });
      return;
    }
    if (el.hasAttribute('data-ver-todo')) {
      e.preventDefault();
      filtrarPor({});
    }
  });
}

function focusables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length && !el.closest('[inert]'));
}

function abrirOverlay(el, origen) {
  if (!el) return;
  clearTimeout(el._t);
  if (!el.classList.contains('open')) el._origen = origen || document.activeElement;
  el.hidden = false;
  void el.offsetWidth;
  el.classList.add('open');
  document.body.classList.add('no-scroll');
  const foco = el.querySelector('.modal__x, .drawer__cab [data-cerrar-drawer]');
  foco?.focus({ preventScroll: true });
}

function cerrarOverlay(el, devolver = true) {
  if (!el || el.hidden || !el.classList.contains('open')) return;
  el.classList.remove('open');
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.hidden = true; }, reduceMotion ? 0 : 450);
  if (!document.querySelector('.modal.open, .drawer.open')) document.body.classList.remove('no-scroll');
  if (devolver && el._origen && document.contains(el._origen)) el._origen.focus({ preventScroll: true });
}

let qv = null;

function fotosDe(p) {
  const fotos = [[p.foto, p.foco]];
  if ((p.foco?.[2] || 1) > 1.2) fotos.push([p.foto, [p.foco[0], p.foco[1], 1]]);
  return fotos;
}

function precioQV(p, m) {
  const fin = formatearPrecio(precioFinal(p, m));
  return p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, m))}</s> ${fin}` : fin;
}

function renderQuick() {
  const p = getProducto(qv.id);
  const body = document.getElementById('qvBody');
  if (!p || !body) return;
  const fotos = fotosDe(p);
  const f = fotos[qv.foto] || fotos[0];
  const medidas = tieneMedidas(p) ? `<div class="qv__opc"><p class="qv__lbl" id="qvLblM">Tamaño</p><div class="opciones" role="radiogroup" aria-labelledby="qvLblM">${p.medidas.map((m, i) => `<button type="button" class="opcion" role="radio" aria-checked="${i === qv.m}" data-qv-m="${i}">${esc(m[0])}</button>`).join('')}</div></div>` : '';
  const ficha = [...(p.ficha || [])];
  if (!ficha.some(([k]) => k === 'Rinde')) ficha.unshift(['Rinde', tieneMedidas(p) ? varTexto(p, qv.m) : p.rinde]);
  const ocs = (p.oc || []).map(o => OCASIONES[o].nombre).join(' · ');
  const mismos = PRODUCTOS.filter(x => x.id !== p.id && x.cat === p.cat);
  const vecinos = PRODUCTOS.filter(x => x.id !== p.id && x.cat !== p.cat && (x.oc || []).some(o => (p.oc || []).includes(o)));
  const tambien = [...mismos, ...vecinos].slice(0, 3);
  body.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__foto recorte" style="${recorte(f[0], f[1], 1)}"><img src="${rutaImg(f[0])}" alt="${esc(p.alt)}" ${imgAttrs(f[0])}>${badgesHTML(p)}</div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((x, i) => `<button type="button" class="qv__thumb recorte" data-qv-foto="${i}" aria-pressed="${i === qv.foto}" aria-label="Ver la foto ${i + 1}" style="${recorte(x[0], x[1], 1)}"><img src="${rutaImg(x[0])}" alt="" ${imgAttrs(x[0])}></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(catDe(p.cat)?.nombre)}${ocs ? ` · ${esc(ocs)}` : ''}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio">${precioQV(p, qv.m)}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">${ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Pedido</dt><dd>Por encargue, con la fecha que elijas</dd></div></dl>
      ${medidas}
      <div class="qv__acciones"><div class="stepper"><button type="button" data-qv-menos aria-label="Restar uno">−</button><span class="stepper__n">${qv.q}</span><button type="button" data-qv-mas aria-label="Sumar uno">+</button></div><button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button><button type="button" class="btn btn--ghost" data-qv-comprar>Comprar ahora</button></div>
    </div>
    ${tambien.length ? `<div class="qv__tambien"><p class="qv__tambien-tit">También te puede gustar</p><div class="qv__mini-lista">${tambien.map(x => `<button type="button" class="mini" data-quick="${x.id}"><span class="mini__foto recorte" style="${recorte(x.foto, x.foco, 1)}"><img src="${rutaImg(x.foto)}" alt="" ${imgAttrs(x.foto)}></span><span class="mini__txt"><b>${esc(x.nombre)}</b><span>${precioHTML(x)}</span></span></button>`).join('')}</div></div>` : ''}`;
}

function ldProducto(p) {
  let s = document.getElementById('ldProducto');
  if (!s) {
    s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'ldProducto';
    document.head.appendChild(s);
  }
  const url = location.href.split('#')[0];
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nombre,
    image: new URL(`images/${p.foto}`, url).href,
    description: p.desc,
    brand: { '@type': 'Brand', name: 'El Rincón Dulce' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/PreOrder', url },
  });
}

function abrirQuick(id, origen) {
  const p = getProducto(id);
  const modal = document.getElementById('qv');
  if (!p || !modal) return;
  qv = { id, m: 0, q: 1, foto: 0 };
  renderQuick();
  ldProducto(p);
  const panel = modal.querySelector('.modal__panel');
  if (panel) panel.scrollTop = 0;
  abrirOverlay(modal, origen);
}

function initQuick() {
  const modal = document.getElementById('qv');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar]')) { cerrarOverlay(modal); return; }
    const b = e.target.closest('button');
    if (!b || !qv || b.dataset.quick) return;
    const p = getProducto(qv.id);
    let foco;
    if (b.dataset.qvFoto) { qv.foto = Number(b.dataset.qvFoto); foco = `[data-qv-foto="${qv.foto}"]`; }
    else if (b.dataset.qvM) { qv.m = Number(b.dataset.qvM); foco = `[data-qv-m="${qv.m}"]`; }
    else if (b.hasAttribute('data-qv-mas')) { qv.q = Math.min(99, qv.q + 1); foco = '[data-qv-mas]'; }
    else if (b.hasAttribute('data-qv-menos')) { qv.q = Math.max(1, qv.q - 1); foco = '[data-qv-menos]'; }
    else if (b.hasAttribute('data-qv-agregar')) { agregar(p, qv.q, qv.m); return; }
    else if (b.hasAttribute('data-qv-comprar')) {
      Cart.add(p, qv.q, qv.m);
      const origen = modal._origen;
      cerrarOverlay(modal, false);
      abrirDrawer(origen);
      return;
    } else return;
    renderQuick();
    modal.querySelector(foco)?.focus({ preventScroll: true });
  });
}

function renderDrawer() {
  const lista = document.getElementById('drawerLista');
  const pie = document.getElementById('drawerPie');
  if (!lista) return;
  const items = Cart.get();
  if (!items.length) {
    lista.innerHTML = '<div class="drawer__vacio"><svg viewBox="0 0 200 200" aria-hidden="true"><use href="#blonda"/></svg><p class="drawer__vacio-tit">Tu pedido está vacío</p><p>¿Arrancamos por una tarta, unos shots o la caja de la semana?</p><button type="button" class="btn btn--ghost" data-ir-tienda>Ver el menú</button></div>';
    if (pie) pie.hidden = true;
    return;
  }
  lista.innerHTML = items.map((it, i) => {
    const p = getProducto(it.id);
    if (!p) return '';
    const v = varTexto(p, it.m);
    return `<div class="linea" style="--i:${i}">
      <div class="linea__foto recorte" style="${recorte(p.foto, p.foco, 1)}"><img src="${rutaImg(p.foto)}" alt="" ${imgAttrs(p.foto)}></div>
      <div class="linea__cuerpo">
        <p class="linea__nombre">${esc(p.nombre)}</p>
        ${v ? `<p class="linea__var">${esc(v)}</p>` : ''}
        <div class="linea__fila">
          <div class="stepper" data-linea="${i}"><button type="button" data-linea-menos aria-label="Restar uno">−</button><span class="stepper__n">${it.qty}</span><button type="button" data-linea-mas aria-label="Sumar uno">+</button></div>
          <span class="linea__precio">${formatearPrecio(precioFinal(p, it.m) * it.qty)}</span>
          <button type="button" class="linea__quitar" data-linea-quitar="${i}" aria-label="Quitar ${esc(p.nombre)}">${ICON.basura}</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const total = document.getElementById('drawerTotal');
  if (total) total.textContent = formatearPrecio(Cart.total());
  if (pie) pie.hidden = false;
}

function abrirDrawer(origen) {
  renderDrawer();
  abrirOverlay(document.getElementById('drawer'), origen);
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  if (!drawer) return;
  document.getElementById('cartBtn')?.addEventListener('click', e => abrirDrawer(e.currentTarget));
  document.getElementById('pedidoVer')?.addEventListener('click', e => abrirDrawer(e.currentTarget));
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarOverlay(drawer); return; }
    if (e.target.closest('[data-ir-tienda]')) { cerrarOverlay(drawer, false); irA('tienda'); return; }
    const b = e.target.closest('button');
    if (!b) return;
    const items = Cart.get();
    const st = b.closest('[data-linea]');
    if (st) {
      const i = Number(st.dataset.linea);
      const it = items[i];
      if (!it) return;
      const accion = b.hasAttribute('data-linea-mas') ? 'data-linea-mas' : 'data-linea-menos';
      Cart.setQty(i, it.qty + (accion === 'data-linea-mas' ? 1 : -1));
      drawer.querySelector(`[data-linea="${i}"] [${accion}]`)?.focus({ preventScroll: true });
      return;
    }
    if (b.dataset.lineaQuitar) {
      Cart.remove(Number(b.dataset.lineaQuitar));
      drawer.querySelector('.linea__quitar, [data-ir-tienda]')?.focus({ preventScroll: true });
    }
  });
  document.getElementById('finalizar')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('keydown', e => {
    const abierto = ['qv', 'drawer'].map(id => document.getElementById(id)).find(x => x && x.classList.contains('open'));
    if (!abierto) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarOverlay(abierto); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(abierto);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!abierto.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}

function updatePedidoBar() {
  const txt = document.getElementById('pedidoTxt');
  const btn = document.getElementById('pedidoVer');
  if (!txt) return;
  const n = Cart.count();
  if (!n) {
    txt.textContent = 'Tu pedido está vacío: sumá lo que quieras del menú.';
    if (btn) btn.hidden = true;
    return;
  }
  txt.innerHTML = `Tu pedido: <b>${n} ${n === 1 ? 'producto' : 'productos'}</b> · <b>${formatearPrecio(Cart.total())}</b>`;
  if (btn) btn.hidden = false;
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  let visto = false;
  const sync = () => {
    if (window.scrollY > 600) visto = true;
    wsp?.classList.toggle('visible', visto);
    cart?.classList.toggle('visible', visto || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', () => abrirDrawer(cart));
  sync();
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const ANTICIPO = 2;
const DIAS_A_LA_VISTA = 10;
const sumarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const primeraFecha = (hoy = new Date()) => sumarDias(hoy, ANTICIPO);
const fechaLarga = d => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
const fechaCorta = d => `${DIAS[d.getDay()]} ${d.getDate()}`;
const TAMANOS = [20, 30, 40];

function calcularEncargo(st) {
  const n = Math.max(1, Math.round(st.n));
  const lineas = [];
  const sumar = (id, m = 0, q = 1) => {
    const p = getProducto(id);
    if (!p || q <= 0) return;
    const ya = lineas.find(l => l.p === p && l.m === m);
    if (ya) ya.q += q;
    else lineas.push({ p, m, q });
  };
  let porciones = 0;
  let dato;
  if (st.oc === 'cumple') {
    let resto = n;
    while (resto > 0) {
      const i = TAMANOS.findIndex(t => t >= resto);
      const k = i < 0 ? TAMANOS.length - 1 : i;
      sumar('torta-cumple', k);
      porciones += TAMANOS[k];
      resto -= TAMANOS[k];
    }
    const cajas = Math.ceil(n / 12);
    sumar('shots-surtidos', 0, cajas);
    dato = `<b>${porciones} porciones</b> de torta y ${cajas * 12} shots`;
  } else if (st.oc === 'mesa') {
    const i = TAMANOS.findIndex(t => t >= n);
    const k = i < 0 ? TAMANOS.length - 1 : i;
    sumar('mesa-dulce', k);
    porciones = TAMANOS[k];
    const extra = n - TAMANOS[k];
    if (extra > 0) {
      sumar('shots-surtidos', 0, Math.ceil(extra / 12));
      sumar('tartitas-frutos', 0, Math.ceil(extra / 12));
      porciones = n;
      dato = `<b>Mesa para ${TAMANOS[k]}</b> y extras para ${extra} más`;
    } else {
      dato = `<b>Mesa para ${TAMANOS[k]}</b> personas, con ${n} invitados`;
    }
  } else {
    const meta = Math.ceil(n * 1.5);
    const budines = Math.max(1, Math.round(n / 12));
    sumar('budin-limon', 0, Math.ceil(budines / 2));
    sumar('budin-marmolado', 0, Math.floor(budines / 2));
    porciones = budines * 10;
    let resto = meta - porciones;
    while (resto > 2) {
      const grande = resto > 8;
      sumar('tarta-frutal', grande ? 1 : 0);
      porciones += grande ? 12 : 8;
      resto -= grande ? 12 : 8;
    }
    dato = `<b>${porciones} porciones</b> para ${n} invitados`;
  }
  const total = lineas.reduce((s, l) => s + precioFinal(l.p, l.m) * l.q, 0);
  return { n, oc: st.oc, lineas, porciones, total, dato };
}

function mensajeEncargo(r, fecha) {
  const lista = r.lineas.map(l => `${l.q} × ${l.p.nombre}${tieneMedidas(l.p) ? ` (${varTexto(l.p, l.m)})` : ''}`).join(', ');
  return `Hola El Rincón Dulce! Quiero encargar para ${OCASIONES[r.oc]?.wsp || 'un festejo'} de ${r.n} personas, para el ${fechaLarga(fecha)}: ${lista}. ¿Me confirman si tienen lugar ese día?`;
}

function initFechas() {
  const f = primeraFecha();
  document.querySelectorAll('[data-entrega-header]').forEach(el => { el.textContent = `Encargá hoy para el ${fechaCorta(f)}`; });
  document.querySelectorAll('[data-entrega-hero]').forEach(el => { el.textContent = fechaLarga(f); });
}

function initEncargo() {
  const root = document.getElementById('encargo');
  const inv = document.getElementById('eInv');
  const fechas = document.getElementById('eFechas');
  if (!root || !inv || !fechas) return;
  const oInv = document.getElementById('oInv');
  const dato = document.getElementById('eDato');
  const lista = document.getElementById('eLista');
  const total = document.getElementById('eTotal');
  const nota = document.getElementById('eNota');
  const btn = document.getElementById('eCarrito');
  const wsp = document.getElementById('eWsp');
  const dias = Array.from({ length: DIAS_A_LA_VISTA }, (_, k) => sumarDias(primeraFecha(), k));
  fechas.innerHTML = dias.map((d, k) => `<label class="fecha"><input class="sr-only" type="radio" name="fecha" value="${k}"${k === 0 ? ' checked' : ''} aria-label="${esc(fechaLarga(d))}"><span class="fecha__dia" aria-hidden="true">${DIAS[d.getDay()].slice(0, 3)}</span><b aria-hidden="true">${d.getDate()}</b><span class="fecha__mes" aria-hidden="true">${MESES[d.getMonth()].slice(0, 3)}</span></label>`).join('');
  const st = { oc: root.querySelector('input[name="ocasion"]:checked')?.value || 'merienda', n: Number(inv.value), fecha: dias[0] };
  let ultimo = null;
  const pct = () => ((Number(inv.value) - Number(inv.min)) / (Number(inv.max) - Number(inv.min)) * 100).toFixed(1) + '%';
  const actualizar = () => {
    st.n = Number(inv.value);
    if (oInv) oInv.textContent = st.n;
    inv.style.setProperty('--p', pct());
    const r = calcularEncargo(st);
    ultimo = r;
    if (dato) dato.innerHTML = r.dato;
    if (lista) lista.innerHTML = r.lineas.map(l => `<li><span class="encargo__q">${l.q} ×</span><span>${esc(l.p.nombre)}${tieneMedidas(l.p) ? `<small>${esc(varTexto(l.p, l.m))}</small>` : ''}</span><span class="encargo__p">${formatearPrecio(precioFinal(l.p, l.m) * l.q)}</span></li>`).join('');
    if (total) total.textContent = formatearPrecio(r.total);
    if (nota) nota.textContent = `Para el ${fechaLarga(st.fecha)}. Te confirmamos por WhatsApp si hay lugar ese día.`;
    if (wsp) wsp.href = wspLink(mensajeEncargo(r, st.fecha));
  };
  root.addEventListener('change', e => {
    const i = e.target;
    if (i.name === 'ocasion' && i.checked) st.oc = i.value;
    else if (i.name === 'fecha' && i.checked) st.fecha = dias[Number(i.value)] || dias[0];
    else return;
    actualizar();
  });
  inv.addEventListener('input', actualizar);
  btn?.addEventListener('click', () => {
    if (!ultimo?.lineas.length) return;
    Cart.addVarios(ultimo.lineas);
    const n = ultimo.lineas.reduce((s, l) => s + l.q, 0);
    showToast(`Sumaste ${n} ${n === 1 ? 'producto' : 'productos'} para ${ultimo.n} invitados al carrito`);
  });
  actualizar();
}

function datoHistoria(p) {
  const desde = tieneMedidas(p) ? 'desde ' : '';
  const off = p.descuento > 0 ? ` con ${p.descuento}% off` : '';
  return `${desde}${formatearPrecio(precioFinal(p))}${off} · ${p.rinde}`;
}

function initHistorias() {
  const sec = document.getElementById('historias');
  if (!sec) return;
  const items = [...sec.querySelectorAll('.historia')];
  const barras = [...sec.querySelectorAll('.historia-barra')];
  const nEl = sec.querySelector('[data-hist-n]');
  const nombreEl = sec.querySelector('[data-hist-nombre]');
  const precioEl = sec.querySelector('[data-hist-precio]');
  const btn = sec.querySelector('[data-hist-add]');
  const blonda = sec.querySelector('.historias__blonda');
  const N = Math.min(items.length, 4);
  if (!N) return;
  let actual = -1;
  const off = () => parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--gw-modelos-h')) || 0;
  const recorrido = () => {
    const r = sec.getBoundingClientRect();
    const o = off();
    return { r, o, total: r.height - (window.innerHeight - o) };
  };
  const progreso = () => {
    const { r, o, total } = recorrido();
    return total > 0 ? clamp01((o - r.top) / total) : 0;
  };
  const activar = i => {
    if (i === actual) return;
    actual = i;
    items.forEach((x, k) => x.classList.toggle('is-on', k === i));
    barras.forEach((b, k) => b.setAttribute('aria-current', k === i ? 'true' : 'false'));
    const p = getProducto(items[i].dataset.prod);
    if (nEl) nEl.textContent = String(i + 1).padStart(2, '0');
    if (nombreEl) nombreEl.textContent = p?.nombre || '';
    if (precioEl && p) precioEl.textContent = datoHistoria(p);
    if (btn && p) {
      btn.dataset.histProd = p.id;
      btn.setAttribute('aria-label', `Agregar ${p.nombre} al carrito`);
    }
  };
  const pintar = p => {
    const i = Math.min(N - 1, Math.floor(p * N * 0.9999));
    activar(i);
    const local = clamp01(p * N - i);
    barras.forEach((b, k) => b.style.setProperty('--f', k < i ? '1' : k === i ? local.toFixed(3) : '0'));
    if (reduceMotion) return;
    items[i].style.scale = (1.08 - local * 0.08).toFixed(4);
    if (blonda) blonda.style.setProperty('--rot', `${(p * 48).toFixed(1)}deg`);
  };
  const calcular = () => pintar(progreso());
  let pedido = false;
  const pedir = () => {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(() => { pedido = false; calcular(); });
  };
  barras.forEach((b, k) => b.addEventListener('click', () => {
    const { r, o, total } = recorrido();
    const y = window.scrollY + r.top - o + Math.max(0, total) * ((k + 0.15) / N);
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  btn?.addEventListener('click', () => agregar(getProducto(btn.dataset.histProd), 1, 0));
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  window.addEventListener('load', calcular);
  calcular();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 0.95, clearProps: 'transform,opacity' }, 0.28)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.85, stagger: 0.1, clearProps: 'transform,opacity' }, 0.4)
    .from(hero.querySelectorAll('.ficha__datos li'), { y: 16, opacity: 0, duration: 0.7, stagger: 0.06, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.sello, .sticker'), { scale: 0.92, opacity: 0, duration: 0.85, stagger: 0.1, clearProps: 'transform,opacity' }, 0.45);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-plx]').forEach(el => {
    const amt = Number(el.dataset.plx) || 3;
    gsap.fromTo(el, { yPercent: -amt }, {
      yPercent: amt,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: el.dataset.plxStart || 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function initModelBarScroll() {
  const bar = document.querySelector('.gw-modelos');
  if (!bar) return;
  let showTimer = 0;
  let frame = 0;
  const update = () => {
    frame = 0;
    if (window.scrollY <= 8) {
      bar.classList.remove('gw-modelos--scrolling');
      return;
    }
    bar.classList.add('gw-modelos--scrolling');
    clearTimeout(showTimer);
    showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
  };
  window.addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('cart:updated', renderDrawer);
document.addEventListener('cart:updated', updatePedidoBar);

aplicarRecortes();
contar();
initFechas();
renderCatalogo();
renderDrawer();
updateCartBadge();
updatePedidoBar();
initModelBarScroll();
initNav();
initCatalogoUI();
initDelegacion();
initQuick();
initDrawer();
initFloats();
initEncargo();
initHistorias();
initHeroMotion();
initParallax();
initReveals();
