const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5493624074350';
const MARCA = 'La mila-grosa';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const MAX_LINEA = 50;
const PARAMS = new URLSearchParams(location.search);

const CANALES = {
  menor: { para: 'Tu casa', modo: 'casa' },
  mayor: { para: 'Tu comercio', modo: 'comercio' },
};
const MODO_FORMATO = { casa: 'menor', comercio: 'mayor' };
const ORDENES = { destacados: 'Recomendados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const CATEGORIAS = [
  { id: 'milanesas', nombre: 'Milanesas', img: 'images/milanesa-cruda-600.webp', bajada: 'Milanesas de pollo rebozadas, por kilo para tu casa o en caja de 5 kg para tu comercio.' },
  { id: 'patys', nombre: 'Patys', img: 'images/paty-crudo-600.webp', bajada: 'Patys de pollo en pack de 4 para tu casa o en caja de 40 para tu comercio.' },
  { id: 'albondigas', nombre: 'Albóndigas', img: 'images/albondigas-crudas-600.webp', bajada: 'Albóndigas de pollo por kilo para tu casa o en caja de 5 kg para tu comercio.' },
  { id: 'chorizos', nombre: 'Chorizos', img: 'images/chorizos-crudos-600.webp', bajada: 'Chorizos de pollo por kilo para tu casa o en caja de 5 kg para tu comercio.' },
];

const PRODUCTOS = [
  {
    id: 'milanesas-de-pollo', cat: 'milanesas', nombre: 'Milanesas de pollo', rango: 1,
    cruda: { src: 'images/milanesa-cruda', alt: 'Dos milanesas de pollo crudas y rebozadas sobre un plato blanco' },
    cocida: { src: 'images/milanesa-cocida', w: 860, alt: 'Milanesas de pollo doradas y crocantes en una fuente' },
    desc: 'Pechuga de pollo fileteada y rebozada a mano con pan rallado, lista para cocinar.',
    coccion: 'Al horno, en sartén o en freidora de aire.',
    claves: 'milanesa milanesas mila milas pechuga rebozada empanada',
    formatos: {
      menor: { nombre: '1 kg', largo: 'Bolsa de 1 kg', detalle: 'De 6 a 8 milanesas', precio: 10500, cant: 1, unidad: 'kg' },
      mayor: { nombre: '5 kg', prefijo: 'Caja ', largo: 'Caja de 5 kg', detalle: 'Caja cerrada para comercios', precio: 47000, cant: 5, unidad: 'kg' },
    },
  },
  {
    id: 'patys-de-pollo', cat: 'patys', nombre: 'Patys de pollo', rango: 2,
    cruda: { src: 'images/paty-crudo', alt: 'Patys de pollo crudos apilados con papel entre uno y otro, en una bandeja blanca' },
    cocida: { src: 'images/paty-cocido', alt: 'Paty de pollo a la plancha servido con ensalada de lechuga, tomate y cebolla morada' },
    desc: 'Hamburguesas de pollo condimentadas, separadas con papel para que no se peguen.',
    coccion: 'A la plancha, en sartén o a la parrilla.',
    claves: 'paty patys pati patis hamburguesa hamburguesas medallon medallones',
    formatos: {
      menor: { nombre: 'x4', prefijo: 'Pack ', largo: 'Pack de 4', detalle: '4 patys separados con papel', precio: 5200, cant: 4, unidad: 'u' },
      mayor: { nombre: 'x40', prefijo: 'Caja ', largo: 'Caja de 40', detalle: '10 packs de 4', precio: 46000, cant: 40, unidad: 'u' },
    },
  },
  {
    id: 'albondigas-de-pollo', cat: 'albondigas', nombre: 'Albóndigas de pollo', rango: 3,
    cruda: { src: 'images/albondigas-crudas', alt: 'Albóndigas de pollo crudas con perejil, ordenadas en una bandeja de acero' },
    cocida: { src: 'images/albondigas-salsa', alt: 'Albóndigas de pollo cocidas en salsa de tomate, servidas en un plato hondo' },
    desc: 'Albóndigas de pollo con perejil, listas para la salsa, el horno o el guiso.',
    coccion: 'En salsa, al horno o en guiso.',
    claves: 'albondiga albondigas bolitas',
    formatos: {
      menor: { nombre: '1 kg', largo: 'Bolsa de 1 kg', detalle: 'Unas 30 albóndigas', precio: 9800, cant: 1, unidad: 'kg' },
      mayor: { nombre: '5 kg', prefijo: 'Caja ', largo: 'Caja de 5 kg', detalle: 'Caja cerrada para comercios', precio: 43500, cant: 5, unidad: 'kg' },
    },
  },
  {
    id: 'chorizos-de-pollo', cat: 'chorizos', nombre: 'Chorizos de pollo', rango: 4,
    cruda: { src: 'images/chorizos-crudos', alt: 'Cinco chorizos de pollo crudos en una bandeja blanca' },
    cocida: { src: 'images/chorizos-grill', alt: 'Chorizos de pollo a la parrilla con morrón y zucchini grillados' },
    desc: 'Chorizos de pollo condimentados, para la parrilla, el horno o la plancha.',
    coccion: 'A la parrilla, al horno o a la plancha.',
    claves: 'chorizo chorizos parrilla parrillero asado choripan',
    formatos: {
      menor: { nombre: '1 kg', largo: 'Bolsa de 1 kg', detalle: 'Unos 8 chorizos', precio: 9200, cant: 1, unidad: 'kg' },
      mayor: { nombre: '5 kg', prefijo: 'Caja ', largo: 'Caja de 5 kg', detalle: 'Caja cerrada para comercios', precio: 41000, cant: 5, unidad: 'kg' },
    },
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const catDe = id => CATEGORIAS.find(c => c.id === id);
const FORMATOS_ORDEN = ['menor', 'mayor'];
const formatosDe = p => FORMATOS_ORDEN.filter(k => p.formatos[k]);
const precioDe = (p, f) => p.formatos[f]?.precio ?? null;
const precioMinimo = p => Math.min(...formatosDe(p).map(k => p.formatos[k].precio));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const precioOrden = (p, f) => (f && p.formatos[f] ? p.formatos[f].precio : Math.min(...Object.values(p.formatos).map(x => x.precio)));
  function coincide(p, f) {
    const excluir = lista(f.excluir);
    if (f.cat && p.cat !== f.cat) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, f) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioOrden(a, f.formato) - precioOrden(b, f.formato) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioOrden(b, f.formato) - precioOrden(a, f.formato) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango ?? 999) - (b.rango ?? 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.desc, p.coccion, p.claves, catDe(p.cat)?.nombre, 'pollo casero caseros',
      ...formatosDe(p).map(k => `${p.formatos[k].largo} ${p.formatos[k].detalle}`), 'mayor mayorista comercio caja menor kilo',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Modo = {
  KEY: 'lamilagrosa_modo',
  get() { try { return localStorage.getItem(this.KEY) === 'comercio' ? 'comercio' : 'casa'; } catch { return 'casa'; } },
  set(m) { try { localStorage.setItem(this.KEY, m); } catch (e) { void e; } },
};
let modoActual = Modo.get();
const pedidoPara = PARAMS.get('para');
if (pedidoPara === 'casa' || pedidoPara === 'comercio') { modoActual = pedidoPara; Modo.set(pedidoPara); }
const formatoModo = () => MODO_FORMATO[modoActual];

const Cart = {
  KEY: 'lamilagrosa_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id, f) { return this.get().filter(i => i.id === id && i.f === f).reduce((s, i) => s + i.qty, 0); },
  add(producto, f, qty = 1) {
    if (precioDe(producto, f) == null) return 0;
    const libre = MAX_LINEA - this.enCarrito(producto.id, f);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.f === f);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, f, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, f, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.f === f);
    if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_LINEA));
    this.save(items);
  },
  remove(id, f) { this.save(this.get().filter(i => !(i.id === id && i.f === f))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const pr = p ? precioDe(p, i.f) : null; return pr ? s + pr * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  plato: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>',
  llama: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  flechas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>',
  camion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const imgSrc = (foto, chica = true) => `${foto.src}${chica ? '-600' : ''}.webp`;
const imgSrcset = foto => `${foto.src}-600.webp 600w, ${foto.src}.webp ${foto.w || 1200}w`;
const unidadDe = (p, f) => {
  const fo = p.formatos[f];
  if (!fo) return '';
  if (fo.unidad === 'kg') return fo.cant === 1 ? 'por kilo' : `${formatearPrecio(fo.precio / fo.cant)} el kilo`;
  return `${formatearPrecio(fo.precio / fo.cant)} c/u`;
};
const formatoTexto = (p, f) => p.formatos[f]?.largo || '';

function precioHTML(p, f) {
  return `<p class="precio" data-precio><b>${formatearPrecio(precioDe(p, f))}</b><span class="precio__cu">${esc(unidadDe(p, f))}</span></p>`;
}

let cardSeq = 0;
function formatosChipsHTML(p, f, nombre) {
  return `<div class="formatos" role="radiogroup" aria-label="Presentación de ${esc(p.nombre)}">${formatosDe(p).map(k => {
    const fo = p.formatos[k];
    return `<label class="formato"><input type="radio" name="${nombre}" value="${k}" data-formato${k === f ? ' checked' : ''} aria-label="${esc(CANALES[k].para)}: ${esc(fo.largo)}"><span>${fo.prefijo ? `<span class="formato__largo">${esc(fo.prefijo)}</span>` : ''}${esc(fo.nombre)}</span></label>`;
  }).join('')}</div>`;
}

function cardGridHTML(p, f, anim) {
  const nombre = `fmt-${p.id}-${++cardSeq}`;
  const cat = catDe(p.cat);
  return `<article class="pcard" data-id="${esc(p.id)}" data-f="${f}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__in">
    <div class="pcard__media">
      <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true">
        <img class="pcard__cruda" src="${imgSrc(p.cruda)}" srcset="${imgSrcset(p.cruda)}" sizes="(max-width: 900px) 50vw, 300px" alt="${esc(p.cruda.alt)}" width="600" height="600">
        <img class="pcard__cocida" src="${imgSrc(p.cocida)}" srcset="${imgSrcset(p.cocida)}" sizes="(max-width: 900px) 50vw, 300px" alt="" width="600" height="600">
      </a>
      <button type="button" class="pcard__vista" data-cocida aria-pressed="false" aria-label="Ver ${esc(p.nombre.toLowerCase())} cocidas">${ICO.plato}<span>Así queda</span></button>
      <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>
    </div>
    <div class="pcard__info">
      <p class="pcard__cat">${esc(cat?.nombre || '')} · casero</p>
      <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      ${formatosChipsHTML(p, f, nombre)}
      <div class="pcard__pie">
        ${precioHTML(p, f)}
        <div class="prod-actions"><button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
      </div>
    </div>
  </div>
</article>`;
}

function cardFilaHTML(p, f, anim, n) {
  const nombre = `fila-${p.id}-${++cardSeq}`;
  return `<article class="pfila" data-id="${esc(p.id)}" data-f="${f}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : ''}>
  <div class="pfila__in">
    <div class="comparador" data-comparador>
      <img src="${imgSrc(p.cruda, false)}" srcset="${imgSrcset(p.cruda)}" sizes="(max-width: 860px) 100vw, 600px" alt="${esc(p.cruda.alt)}" width="1200" height="1200">
      <div class="comparador__cocida"><img src="${imgSrc(p.cocida, false)}" srcset="${imgSrcset(p.cocida)}" sizes="(max-width: 860px) 100vw, 600px" alt="${esc(p.cocida.alt)}" width="1200" height="1200"></div>
      <span class="comparador__linea" aria-hidden="true"></span>
      <span class="comparador__manija" aria-hidden="true">${ICO.flechas}</span>
      <span class="comparador__et comparador__et--cruda" aria-hidden="true">Así llega</span>
      <span class="comparador__et comparador__et--cocida" aria-hidden="true">Así queda</span>
      <input class="comparador__rango" type="range" min="0" max="100" value="50" aria-label="Deslizá para comparar ${esc(p.nombre.toLowerCase())} crudas y cocidas">
    </div>
    <div class="pfila__info">
      <p class="pfila__num">${String(n).padStart(2, '0')}</p>
      <h3 class="pfila__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      <p class="pfila__desc">${esc(p.desc)}</p>
      <p class="pfila__coccion">${ICO.llama}${esc(p.coccion)}</p>
      <fieldset class="pfila__ops"><legend class="sr-only">Presentación de ${esc(p.nombre)}</legend>${formatosDe(p).map(k => {
        const fo = p.formatos[k];
        return `<label class="pop"><input type="radio" name="${nombre}" value="${k}" data-formato${k === f ? ' checked' : ''}><span class="pop__para">${esc(CANALES[k].para)}</span><span class="pop__nombre">${esc(fo.largo)}</span><span class="pop__precio">${formatearPrecio(fo.precio)}</span><span class="pop__cu">${esc(unidadDe(p, k))}</span></label>`;
      }).join('')}</fieldset>
      <div class="pfila__acc">
        <div class="prod-actions"><button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar al carrito</span></button></div>
        <button type="button" class="pfila__detalle" data-quick="${esc(p.id)}">Ver detalle ${ICO.flecha}</button>
      </div>
    </div>
  </div>
</article>`;
}

function cardListaHTML(p, anim) {
  return `<article class="plista" data-id="${esc(p.id)}" data-f="${formatoModo()}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="plista__in">
    <a class="plista__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${imgSrc(p.cruda)}" alt="${esc(p.cruda.alt)}" width="600" height="600"></a>
    <div class="plista__info">
      <h3 class="plista__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      <p class="plista__desc">${esc(p.desc)}</p>
    </div>
    ${formatosDe(p).map(k => `<div class="plista__op" data-f="${k}">
      <p class="plista__op-tit"><span class="plista__para">${esc(CANALES[k].para)} · </span>${esc(p.formatos[k].largo)}</p>
      ${precioHTML(p, k)}
      <div class="prod-actions"><button type="button" class="prod-add" data-add="${esc(p.id)}" data-add-f="${k}" aria-label="Agregar ${esc(p.nombre)}, ${esc(p.formatos[k].largo.toLowerCase())}, al carrito">${ICO.carrito}<span>Agregar</span></button></div>
    </div>`).join('')}
  </div>
</article>`;
}

function cardHTML(p, { anim = true, tipo = 'grid', n = 1 } = {}) {
  const f = formatoModo();
  if (tipo === 'fila') return cardFilaHTML(p, f, anim, n);
  if (tipo === 'lista') return cardListaHTML(p, anim);
  return cardGridHTML(p, f, anim);
}

function actualizarCard(card, f) {
  const p = getProducto(card.dataset.id);
  if (!p || precioDe(p, f) == null) return;
  card.dataset.f = f;
  card.querySelectorAll('input[data-formato]').forEach(r => { r.checked = r.value === f; });
  const pr = card.querySelector('.pcard__pie [data-precio]');
  if (!pr) return;
  pr.outerHTML = precioHTML(p, f);
  const nuevo = card.querySelector('.pcard__pie [data-precio]');
  if (!reduceMotion && nuevo) { nuevo.classList.add('precio--cambia'); setTimeout(() => nuevo.classList.remove('precio--cambia'), 450); }
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
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const { items } = Tienda.consultar({ filtros: { cat: c.id }, limite: 1 });
      const p = items[0];
      const sub = p ? formatosDe(p).map(k => p.formatos[k].largo).join(' o ').replace(/ o (Caja|Bolsa|Pack)/, (m, w) => ` o ${w.toLowerCase()}`) : '';
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${esc(sub)}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

const TRAMOS = d => (d >= 1 && d <= 5 ? [[480, 750], [1020, 1230]] : d === 6 ? [[480, 780]] : []);
const DIAS = ['el domingo', 'el lunes', 'el martes', 'el miércoles', 'el jueves', 'el viernes', 'el sábado'];
function estadoHoy(fecha = new Date()) {
  let dia = fecha.getDay();
  let h = fecha.getHours();
  let m = fecha.getMinutes();
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
    const v = t => partes.find(x => x.type === t)?.value;
    const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
    if (d >= 0) dia = d;
    h = parseInt(v('hour'), 10) % 24;
    m = parseInt(v('minute'), 10);
  } catch (e) { void e; }
  const min = h * 60 + m;
  const hora = x => `${Math.floor(x / 60)}${x % 60 ? ':' + String(x % 60).padStart(2, '0') : ''}`;
  const actual = TRAMOS(dia).find(([a, b]) => min >= a && min < b);
  if (actual) return { dia, abierto: true, corto: 'Abierto ahora', titulo: `Abierto ahora · hasta las ${hora(actual[1])}` };
  const luego = TRAMOS(dia).find(([a]) => min < a);
  if (luego) return { dia, abierto: false, corto: `Abrimos hoy a las ${hora(luego[0])}`, titulo: `Cerrado · abrimos hoy a las ${hora(luego[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const t = TRAMOS(d);
    if (!t.length) continue;
    const cuando = k === 1 ? 'mañana' : DIAS[d];
    return { dia, abierto: false, corto: `Abrimos ${cuando} a las ${hora(t[0][0])}`, titulo: `Cerrado · abrimos ${cuando} a las ${hora(t[0][0])}` };
  }
  return { dia, abierto: false, corto: 'Consultá el horario', titulo: 'Consultá el horario' };
}
function initEstado() {
  const pintar = () => {
    const e = estadoHoy();
    document.querySelectorAll('[data-estado]').forEach(el => { el.textContent = e.corto; });
    document.querySelectorAll('[data-estado-titulo]').forEach(el => { el.textContent = e.titulo; });
    document.querySelectorAll('[data-estado-box]').forEach(el => el.classList.toggle('abierto', e.abierto));
    document.querySelectorAll('.horario [data-dias]').forEach(li => li.classList.toggle('hoy', li.dataset.dias.split(',').includes(String(e.dia))));
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initVitrinas() {
  document.querySelectorAll('[data-vitrina]').forEach(cont => {
    const tipo = cont.dataset.vitrina || 'grid';
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ orden: 'destacados', limite });
    items.forEach(cachear);
    cont.innerHTML = items.map((p, i) => cardHTML(p, { tipo, n: i + 1 })).join('');
  });
}

function initModo() {
  const pintarBotones = () => {
    document.querySelectorAll('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === modoActual)));
    document.body.classList.toggle('modo-comercio', modoActual === 'comercio');
    document.body.classList.toggle('modo-casa', modoActual === 'casa');
  };
  pintarBotones();
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-modo]');
    if (!b || b.dataset.modo === modoActual) return;
    modoActual = b.dataset.modo === 'comercio' ? 'comercio' : 'casa';
    Modo.set(modoActual);
    pintarBotones();
    const f = formatoModo();
    document.querySelectorAll('.pcard[data-id], .pfila[data-id]').forEach(card => actualizarCard(card, f));
    document.querySelectorAll('.plista[data-id]').forEach(card => { card.dataset.f = f; });
    document.dispatchEvent(new CustomEvent('modo:cambio'));
  });
}

function initCocida() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cocida]');
    if (!b) return;
    const media = b.closest('.pcard__media');
    if (!media) return;
    const on = !media.classList.contains('ver-cocida');
    media.classList.toggle('ver-cocida', on);
    b.setAttribute('aria-pressed', String(on));
    const txt = b.querySelector('span');
    if (txt) txt.textContent = on ? 'Así llega' : 'Así queda';
  });
}

function initComparador() {
  const setPos = (comp, pct) => {
    const v = Math.max(0, Math.min(100, pct));
    comp.style.setProperty('--pos', `${v.toFixed(1)}%`);
    const r = comp.querySelector('.comparador__rango');
    if (r) r.value = String(Math.round(v));
  };
  document.addEventListener('pointerdown', e => {
    const comp = e.target.closest('[data-comparador]');
    if (!comp || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const rect = comp.getBoundingClientRect();
    const x0 = e.clientX;
    const y0 = e.clientY;
    const raton = e.pointerType === 'mouse';
    let arrastre = raton;
    const pct = ev => ((ev.clientX - rect.left) / rect.width) * 100;
    if (raton) { e.preventDefault(); comp.classList.add('arrastrando'); setPos(comp, pct(e)); }
    const mover = ev => {
      if (!arrastre) {
        const dx = Math.abs(ev.clientX - x0);
        const dy = Math.abs(ev.clientY - y0);
        if (dy > 10 && dy > dx) { fin(); return; }
        if (dx < 6) return;
        arrastre = true;
        comp.classList.add('arrastrando');
      }
      setPos(comp, pct(ev));
    };
    const fin = ev => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', fin);
      window.removeEventListener('pointercancel', fin);
      if (!arrastre && ev?.type === 'pointerup') setPos(comp, pct(ev));
      comp.classList.remove('arrastrando');
    };
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('pointerup', fin);
    window.addEventListener('pointercancel', fin);
  });
  document.addEventListener('input', e => {
    const r = e.target.closest('.comparador__rango');
    if (!r) return;
    setPos(r.closest('[data-comparador]'), parseFloat(r.value));
  });
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, f, { qty = 1, comprar = false } = {}) {
  const n = Cart.add(p, f, qty);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id, f)) { abrirCarrito(); return; }
    showToast(`Llegaste al máximo de ${MAX_LINEA} por pedido. Si necesitás más, escribinos.`);
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${p.nombre} (${formatoTexto(p, f).toLowerCase()}) al carrito`);
  if (n < qty) setTimeout(() => showToast(`Sumamos ${n}: es el máximo por pedido.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || MAX_LINEA;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || MAX_LINEA;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('change', e => {
    const radio = e.target.closest('.pcard input[data-formato], .pfila input[data-formato]');
    if (!radio) return;
    actualizarCard(radio.closest('[data-id]'), radio.value);
  });
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !quick.closest('.qv')) {
      e.preventDefault();
      const card = quick.closest('[data-id]');
      abrirQV(quick.dataset.quick, quick, card?.dataset.f);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const card = add.closest('[data-id]');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, add.dataset.addF || card?.dataset.f || formatoModo(), { comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvFormato = 'menor';
let qvCocida = false;
function abrirQV(id, origen, formato) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  qvFormato = formato && p.formatos[formato] ? formato : formatoModo();
  qvCocida = false;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(imgSrc(p.cruda, false), location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: MARCA },
    offers: formatosDe(p).map(f => ({ '@type': 'Offer', name: p.formatos[f].largo, priceCurrency: 'ARS', price: precioDe(p, f), availability: 'https://schema.org/InStock' })),
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const f = qvFormato;
  const cat = catDe(p.cat);
  const { items: rel } = Tienda.consultar({ filtros: { excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const libre = MAX_LINEA - Cart.enCarrito(p.id, f);
  const menor = p.formatos.menor;
  const mayor = p.formatos.mayor;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media${qvCocida ? ' ver-cocida' : ''}">
      <img src="${imgSrc(p.cruda, false)}" alt="${esc(p.cruda.alt)}" width="1200" height="1200">
      <img class="qv__cocida" src="${imgSrc(p.cocida, false)}" alt="${esc(p.cocida.alt)}" width="1200" height="1200">
      <div class="qv__vistas" role="group" aria-label="Elegí la foto"><button type="button" data-qv-vista="cruda" aria-pressed="${!qvCocida}">Así llega</button><button type="button" data-qv-vista="cocida" aria-pressed="${qvCocida}">Así queda</button></div>
    </div>
    <div class="qv__info">
      <p class="qv__tipo">${esc(cat?.nombre || '')} · Todo de pollo</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <span class="raya" aria-hidden="true"></span>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Cómo se cocina</dt><dd>${esc(p.coccion)}</dd></div>
        ${menor ? `<div><dt>Para tu casa</dt><dd>${esc(menor.largo)} · ${esc(menor.detalle)}</dd></div>` : ''}
        ${mayor ? `<div><dt>Para comercios</dt><dd>${esc(mayor.largo)} · ${esc(mayor.detalle)}</dd></div>` : ''}
      </dl>
      <fieldset class="qv__pres">
        <legend>Elegí la presentación</legend>
        ${formatosDe(p).map(k => `<label class="qv-pres"><input type="radio" name="qv-pres" value="${k}"${k === f ? ' checked' : ''}><span class="qv-pres__txt"><b>${esc(CANALES[k].para)} · ${esc(p.formatos[k].largo)}</b><small>${esc(p.formatos[k].detalle)}</small></span><span class="qv-pres__precio">${formatearPrecio(p.formatos[k].precio)}<small>${esc(unidadDe(p, k))}</small></span></label>`).join('')}
      </fieldset>
      <div class="qv__acc">
        ${libre > 0 ? `<div class="stepper stepper--grande" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${libre}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>` : ''}
        <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Llegaste al máximo'}</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <p class="qv__nota">${ICO.camion}<span>Retirás en Resistencia o coordinamos la entrega por WhatsApp. A los comercios les llevamos el pedido.</span></p>
      <a class="qv__wsp" href="${wspLink(`Hola ${MARCA}! Tengo una consulta sobre ${p.nombre.toLowerCase()}.`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Alguna duda? Consultanos por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${imgSrc(r.cruda)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>Desde ${formatearPrecio(precioMinimo(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('change', e => {
    const r = e.target.closest('input[name="qv-pres"]');
    if (!r || !qvActual) return;
    qvFormato = r.value;
    pintarQV();
    qv.querySelector(`input[name="qv-pres"][value="${qvFormato}"]`)?.focus({ preventScroll: true });
  });
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const rel = e.target.closest('.qv__rel-item[data-quick]');
    if (rel) { abrirQV(rel.dataset.quick, ultimoFoco, qvFormato); return; }
    const vista = e.target.closest('[data-qv-vista]');
    if (vista) {
      qvCocida = vista.dataset.qvVista === 'cocida';
      qv.querySelector('.qv__media')?.classList.toggle('ver-cocida', qvCocida);
      qv.querySelectorAll('[data-qv-vista]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvVista === vista.dataset.qvVista)));
      return;
    }
    const p = qvActual;
    if (!p) return;
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qvFormato, qty);
      if (!Cart.enCarrito(p.id, qvFormato)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, qvFormato, { qty });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null, PARAMS.get('formato'));
}

function lineasValidas() {
  return Cart.get().filter(i => { const p = getProducto(i.id); return p && precioDe(p, i.f) != null; });
}
function lineasHTML(items) {
  return `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-linea-f="${i.f}">
      <img src="${imgSrc(p.cruda)}" alt="" width="64" height="64">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(formatoTexto(p, i.f))} · ${formatearPrecio(precioDe(p, i.f))}</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= MAX_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}, ${esc(formatoTexto(p, i.f))}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.f) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
}
function mensajePedido(items) {
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${formatoTexto(p, i.f).toLowerCase()}): ${formatearPrecio(precioDe(p, i.f) * i.qty)}`; }).join('\n');
  const comercio = items.some(i => i.f === 'mayor');
  return `Hola ${MARCA}! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\n${comercio ? 'Es para mi comercio: ' : 'Mi nombre es: '}\n${comercio ? 'Dirección de entrega: ' : '¿Retiro o me lo acercan?: '}`;
}
function pieHTML(items, clase = 'drawer') {
  const n = items.reduce((s, i) => s + i.qty, 0);
  return `<p class="${clase}__total"><span>Total <small>${n} ${n === 1 ? 'unidad' : 'unidades'}</small></span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(mensajePedido(items))}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">${ICO.camion}<span>Retiro en Resistencia o entrega a coordinar. A los comercios les llevamos el pedido.</span></p>`;
}
function manejarLineas(cont, e, foco) {
  const linea = e.target.closest('[data-linea]');
  if (!linea) return;
  const id = linea.dataset.linea;
  const f = linea.dataset.lineaF;
  if (e.target.closest('[data-linea-quitar]')) {
    Cart.remove(id, f);
    foco?.focus({ preventScroll: true });
    return;
  }
  const paso = e.target.closest('[data-linea-paso]');
  if (!paso) return;
  const it = Cart.get().find(i => i.id === id && i.f === f);
  if (!it) return;
  const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
  if (nuevo < 1) return;
  Cart.setQty(id, f, nuevo);
  cont.querySelector(`[data-linea="${window.CSS.escape(id)}"][data-linea-f="${f}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (!document.getElementById('qv')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = lineasValidas();
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio"><span class="raya" aria-hidden="true"></span><p class="cart-vacio__tit">Tu carrito está vacío</p><p>Arrancá por las milanesas: por kilo para tu casa o en caja para tu comercio.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver a los productos</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = lineasHTML(items);
  foot.innerHTML = pieHTML(items);
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    manejarLineas(dr, e, dr.querySelector('.drawer__head .icon-btn'));
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
}

function initPedido() {
  const box = document.querySelector('[data-pedido]');
  if (!box) return;
  const cuerpo = box.querySelector('[data-pedido-lineas]');
  const pie = box.querySelector('[data-pedido-pie]');
  const n = box.querySelector('[data-pedido-n]');
  if (!cuerpo || !pie) return;
  const pintar = () => {
    const items = lineasValidas();
    if (n) n.textContent = items.length ? `${Cart.count()} ${Cart.count() === 1 ? 'unidad' : 'unidades'}` : '';
    if (!items.length) {
      cuerpo.innerHTML = '<div class="pedido__vacio"><span class="raya" aria-hidden="true"></span><p>Todavía no sumaste nada. Tocá «Agregar» en la presentación que quieras: por kilo o pack, o por caja cerrada.</p></div>';
      pie.hidden = true;
      return;
    }
    pie.hidden = false;
    cuerpo.innerHTML = lineasHTML(items);
    pie.innerHTML = pieHTML(items, 'pedido');
  };
  box.addEventListener('click', e => manejarLineas(box, e, box.querySelector('h2')));
  document.addEventListener('cart:updated', pintar);
  pintar();
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

function initConsulta() {
  const form = document.getElementById('consulta');
  if (!form) return;
  const msj = form.querySelector('[data-consulta-msj]');
  const nombre = form.elements.comercio;
  const errNombre = document.getElementById('errComercio');
  const errProd = document.getElementById('errProductos');
  const armar = () => {
    const d = new window.FormData(form);
    const comercio = String(d.get('comercio') || '').trim();
    const localidad = String(d.get('localidad') || '').trim();
    const productos = [...form.querySelectorAll('input[data-producto]:checked')].map(i => i.value);
    return `Hola ${MARCA}! Tengo un comercio y quiero vender sus productos.\nComercio: ${comercio || '(nombre del comercio)'} · ${d.get('tipo')}\nLocalidad: ${localidad || 'a confirmar'}\nMe interesan: ${productos.length ? productos.join(', ') : '(elegí al menos uno)'}\nVolumen: ${d.get('volumen')}\n¿Me pasan los precios por caja y los días de entrega?`;
  };
  const pintar = () => { if (msj) msj.textContent = armar(); };
  form.addEventListener('input', e => {
    if (e.target === nombre && nombre.value.trim()) { nombre.removeAttribute('aria-invalid'); if (errNombre) errNombre.hidden = true; }
    pintar();
  });
  form.addEventListener('change', e => {
    if (e.target.matches('[data-producto]') && form.querySelector('input[data-producto]:checked') && errProd) errProd.hidden = true;
    pintar();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    if (!nombre.value.trim()) {
      ok = false;
      nombre.setAttribute('aria-invalid', 'true');
      if (errNombre) errNombre.hidden = false;
      nombre.focus();
    }
    if (!form.querySelector('input[data-producto]:checked')) {
      if (ok) form.querySelector('input[data-producto]')?.focus();
      ok = false;
      if (errProd) errProd.hidden = false;
    }
    if (!ok) { showToast('Completá lo que falta para armar la consulta.'); return; }
    window.open(wspLink(armar()), '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
  });
  pintar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-27.4512, -58.9866);
  const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView(centro, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.circle(centro, { radius: 700, color: '#0E7C83', weight: 1, fillColor: '#2BB5BB', fillOpacity: 0.14 }).addTo(mapa);
  const icono = L.divIcon({ className: '', html: '<span class="pin"><span>m</span></span>', iconSize: [44, 44], iconAnchor: [22, 53] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'La mila-grosa · Resistencia' }).addTo(mapa);
  const ajustar = () => {
    mapa.invalidateSize();
    mapa.setView(centro, 14, { animate: false });
    if (el.closest('.donde--m2') && window.innerWidth > 860) mapa.panBy([-Math.round(el.clientWidth * 0.2), 0], { animate: false });
  };
  ajustar();
  window.addEventListener('load', ajustar);
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const tipo = MODELO === '2' ? 'lista' : 'grid';
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = () => (estado.cat ? { cat: estado.cat, formato: formatoModo() } : { formato: formatoModo() });
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.cat) chips.push(['cat', catIds[estado.cat].nombre]);
    if (estado.q) chips.push(['q', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, t]) => `<button type="button" class="activo" data-quitar="${f}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro="cat"]').forEach(el => el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado.cat)));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar(id ? { cat: id } : {}); });
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : 'Productos y precios';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Milanesas, patys, albóndigas y chorizos de pollo. Por kilo o pack para tu casa, y por caja cerrada para tu comercio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat; miga.textContent = titulo; }
    document.querySelectorAll('[data-miga-sep]').forEach(s => { s.hidden = !cat; });
    const migaCat = document.querySelector('[data-miga-cat]');
    if (migaCat) { if (cat) migaCat.removeAttribute('aria-current'); else migaCat.setAttribute('aria-current', 'page'); }
    document.title = `${titulo} — ${MARCA}`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'q', 'orden', 'para'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p, { tipo })).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más productos para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.q = '';
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro="cat"]');
    if (b) { estado.cat = b.dataset.valor || ''; aplicar(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      if (quitar.dataset.quitar === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado.cat = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));
  document.addEventListener('modo:cambio', () => { if (estado.orden.startsWith('precio')) { cursor = null; pintar(); } });

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero__raya', { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.55);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-badge', { y: 14, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax-img]').forEach(capa => {
    ScrollTrigger.create({
      trigger: capa.closest('section') || capa, start: 'top top', end: 'bottom top',
      onUpdate: s => { capa.style.translate = `0 ${(6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initEstado,
  initVitrinas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initModo,
  initCocida,
  initComparador,
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initPedido,
  initFloats,
  initConsulta,
  initMapa,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
