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

const WSP = '5492236003599';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const MAX_LINEA = 24;
const PARAMS = new URLSearchParams(location.search);

const PRES = {
  unidad: { nombre: 'Unidad', corto: '1 u.', n: 1 },
  caja6: { nombre: 'Caja de 6', corto: 'x6', n: 6 },
  caja12: { nombre: 'Caja de 12', corto: 'x12', n: 12 },
};
const PRES_FILTRO = { unidad: 'Por unidad', caja6: 'Caja de 6', caja12: 'Caja de 12' };
const COBERTURAS = { negro: 'Chocolate', blanco: 'Chocolate blanco' };
const ORDENES = { destacados: 'Recomendados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const SABORES = ['frambuesa', 'frutos-rojos', 'marroc', 'nueces', 'merengue'];

const CATEGORIAS = [
  { id: 'frambuesa', nombre: 'Frambuesa', img: 'images/p-frambuesa.webp', bajada: 'El alfajor de frambuesa por unidad o en caja, y las cajas surtidas que lo traen.' },
  { id: 'frutos-rojos', nombre: 'Frutos rojos', img: 'images/p-frutos-rojos.webp', bajada: 'El alfajor de frutos rojos por unidad o en caja, y las cajas surtidas que lo traen.' },
  { id: 'marroc', nombre: 'Marroc', img: 'images/p-marroc.webp', bajada: 'El alfajor de Marroc por unidad o en caja, y las cajas surtidas que lo traen.' },
  { id: 'nueces', nombre: 'Nueces', img: 'images/p-nueces.webp', bajada: 'El alfajor de nueces por unidad o en caja, y las cajas surtidas que lo traen.' },
  { id: 'merengue', nombre: 'Merengue', img: 'images/p-merengue.webp', bajada: 'El alfajor de merengue por unidad o en caja, y las cajas surtidas que lo traen.' },
  { id: 'cajas', nombre: 'Cajas surtidas', img: 'images/p-caja-6.webp', bajada: 'Los cinco sabores mezclados, en caja de 6 o en docena.' },
];

const PRECIOS_SABOR = { unidad: 2900, caja6: 16500, caja12: 31200 };
const PRODUCTOS = [
  { id: 'frambuesa', tipo: 'sabor', nombre: 'Frambuesa', titulo: 'Alfajor de frambuesa', cats: ['frambuesa'], cobertura: ['negro'], centro: 'frambuesa',
    img: 'images/p-frambuesa.webp', alt: 'Dos mitades de alfajor de chocolate apiladas, con dulce de leche y un centro de frambuesa, junto a frambuesas frescas',
    desc: 'Dulce de leche con un centro de frambuesa que se siente en cada mordida, bañado en chocolate.', precios: { ...PRECIOS_SABOR }, rango: 1 },
  { id: 'frutos-rojos', tipo: 'sabor', nombre: 'Frutos rojos', titulo: 'Alfajor de frutos rojos', cats: ['frutos-rojos'], cobertura: ['blanco'], centro: 'frutos rojos',
    img: 'images/p-frutos-rojos.webp', alt: 'Alfajor bañado en chocolate blanco cortado al medio, con dulce de leche y frutos rojos, junto a frutillas y moras',
    desc: 'Dulce de leche y un centro de frutos rojos, con baño de chocolate blanco.', precios: { ...PRECIOS_SABOR }, rango: 2 },
  { id: 'marroc', tipo: 'sabor', nombre: 'Marroc', titulo: 'Alfajor de Marroc', cats: ['marroc'], cobertura: ['negro'], centro: 'Marroc',
    img: 'images/p-marroc.webp', alt: 'Dos mitades de alfajor de chocolate apiladas, con dulce de leche y crema de Marroc, junto a un trozo de Marroc',
    desc: 'Dulce de leche y crema de Marroc, bañado en chocolate.', precios: { ...PRECIOS_SABOR }, rango: 3 },
  { id: 'nueces', tipo: 'sabor', nombre: 'Nueces', titulo: 'Alfajor de nueces', cats: ['nueces'], cobertura: ['negro'], centro: 'nueces',
    img: 'images/p-nueces.webp', alt: 'Alfajor de chocolate cortado al medio, con dulce de leche y trozos de nuez, sobre un plato con nueces',
    desc: 'Dulce de leche con trozos de nuez, bañado en chocolate.', precios: { ...PRECIOS_SABOR }, rango: 4 },
  { id: 'merengue', tipo: 'sabor', nombre: 'Merengue', titulo: 'Alfajor de merengue', cats: ['merengue'], cobertura: ['blanco'], centro: 'merengue',
    img: 'images/p-merengue.webp', alt: 'Alfajor bañado en chocolate blanco cortado al medio, con dulce de leche y trocitos de merengue, junto a merenguitos',
    desc: 'Dulce de leche con trocitos de merengue, con baño de chocolate blanco.', precios: { ...PRECIOS_SABOR }, rango: 5 },
  { id: 'caja-surtida-6', tipo: 'caja', nombre: 'Caja surtida de 6', titulo: 'Caja surtida de 6', cats: ['cajas', ...SABORES], cobertura: ['negro', 'blanco'], contenido: '6 alfajores, los 5 sabores',
    img: 'images/p-caja-6.webp', alt: 'Caja de cartón abierta con seis alfajores surtidos, bañados en chocolate y en chocolate blanco',
    desc: 'Un alfajor de cada sabor y uno más que elegís vos: avisanos cuál al hacer el pedido.', precios: { caja6: 16500 }, rango: 6 },
  { id: 'docena-surtida', tipo: 'caja', nombre: 'Docena surtida', titulo: 'Docena surtida', cats: ['cajas', ...SABORES], cobertura: ['negro', 'blanco'], contenido: '12 alfajores, los 5 sabores',
    img: 'images/p-docena.webp', alt: 'Plato con alfajores bañados en chocolate y en chocolate blanco, uno cortado con dulce de leche',
    desc: 'Dos alfajores de cada sabor y dos más que elegís vos: avisanos cuáles al hacer el pedido.', precios: { caja12: 31200 }, rango: 7 },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const catDe = id => CATEGORIAS.find(c => c.id === id);
const formatosDe = p => Object.keys(PRES).filter(k => p.precios[k] != null);
const formatoInicial = (p, pedido) => (pedido && p.precios[pedido] != null ? pedido : formatosDe(p)[0]);
const precioDe = (p, f) => p.precios[f] ?? null;
const precioMinimo = p => Math.min(...formatosDe(p).map(k => p.precios[k]));
const formatoNombre = (p, f) => (p.tipo === 'caja' ? p.contenido : PRES[f]?.nombre || '');
const capasDe = p => (p.tipo === 'caja' ? 'Dulce de leche + los 5 centros' : `Dulce de leche + ${p.centro}`);
const coberturaDe = p => p.cobertura.map(c => COBERTURAS[c]).join(' y ');

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const precioOrden = (p, pres) => (pres && p.precios[pres] != null ? p.precios[pres] : Math.min(...Object.values(p.precios).filter(v => v != null)));
  function coincide(p, f) {
    const coberturas = lista(f.coberturas), excluir = lista(f.excluir);
    if (f.cat && !p.cats.includes(f.cat)) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (coberturas.length && !coberturas.some(c => p.cobertura.includes(c))) return false;
    if (f.pres && p.precios[f.pres] == null) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, f) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioOrden(a, f.pres) - precioOrden(b, f.pres) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioOrden(b, f.pres) - precioOrden(a, f.pres) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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
      p.nombre, p.titulo, p.centro, p.contenido, p.desc, 'alfajor alfajores dulce de leche',
      ...p.cats.map(c => catDe(c)?.nombre), ...p.cobertura.map(c => COBERTURAS[c]),
      ...formatosDe(p).map(k => PRES[k].nombre), p.tipo === 'caja' ? 'caja surtida surtidos regalo' : 'sabor',
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

const Cart = {
  KEY: 'manademar_cart',
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
  alfajores() { return this.get().reduce((s, i) => s + i.qty * (PRES[i.f]?.n || 1), 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const pr = p ? precioDe(p, i.f) : null; return pr ? s + pr * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  caja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.7 4.73a2 2 0 0 0 2 0L20.7 7"/></svg>',
  camion: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  ola: '<svg class="ola" viewBox="0 0 120 14" aria-hidden="true"><path d="M2 9c9.5-8 19-8 28.5 0s19 8 28.5 0 19-8 28.5 0 19 8 30.5 0"/></svg>',
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

function precioHTML(p, f) {
  const precio = precioDe(p, f);
  const n = PRES[f]?.n || 1;
  return `<p class="precio" data-precio><b>${formatearPrecio(precio)}</b><span class="precio__cu">${n > 1 ? `${formatearPrecio(precio / n)} c/u` : 'por alfajor'}</span></p>`;
}

function selectorHTML(p, f, nombre) {
  const formatos = formatosDe(p);
  if (formatos.length < 2) return `<p class="pcard__fijo">${ICO.caja}${esc(p.contenido)}</p>`;
  return `<div class="formatos" role="radiogroup" aria-label="Presentación de ${esc(p.titulo)}">${formatos.map(k => `<label class="formato"><input type="radio" name="${nombre}" value="${k}"${k === f ? ' checked' : ''}><span>${esc(PRES[k].corto)}</span></label>`).join('')}</div>`;
}

const etiquetaHTML = p => `<span class="etiqueta${p.tipo === 'caja' ? ' etiqueta--caja' : p.cobertura[0] === 'blanco' ? ' etiqueta--blanco' : ''}">${esc(p.tipo === 'caja' ? 'Los 5 sabores' : COBERTURAS[p.cobertura[0]])}</span>`;

let cardSeq = 0;
function cardHTML(p, { anim = true, fila = false, formato = '', animTipo = 'subir' } = {}) {
  const f = formatoInicial(p, formato);
  const nombre = `pres-${p.id}-${++cardSeq}`;
  const estado = animTipo === 'der' ? 'opacity:0;transform:translateX(56px)' : 'opacity:0;transform:translateY(44px)';
  return `<article class="pcard${fila ? ' pcard--fila' : ''}" data-id="${esc(p.id)}" data-f="${f}"${anim ? ` data-animate="${animTipo}" style="${estado}"` : ''}>
  <div class="pcard__in">
    <div class="pcard__media">
      <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200"></a>
      ${etiquetaHTML(p)}
      ${fila ? '' : selectorHTML(p, f, nombre)}
      <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>
    </div>
    <div class="pcard__info">
      <p class="pcard__tipo">${p.tipo === 'caja' ? 'Caja surtida' : 'Alfajor · 75 a 80 g'}</p>
      <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      ${ICO.ola}
      <p class="pcard__capas">${esc(capasDe(p))}</p>
      ${fila ? `<p class="pcard__desc">${esc(p.desc)}</p>${selectorHTML(p, f, nombre)}` : ''}
      <div class="pcard__pie">
        ${precioHTML(p, f)}
        <div class="prod-actions"><button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.titulo)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
      </div>
    </div>
  </div>
</article>`;
}

function actualizarCard(card, f) {
  const p = getProducto(card.dataset.id);
  if (!p || precioDe(p, f) == null) return;
  card.dataset.f = f;
  const pr = card.querySelector('[data-precio]');
  if (!pr) return;
  pr.outerHTML = precioHTML(p, f);
  const nuevo = card.querySelector('[data-precio]');
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
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'opción' : 'opciones'}</small></span></a></li>`;
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

function estadoHoy(fecha = new Date()) {
  let h = fecha.getHours(), m = fecha.getMinutes();
  try {
    const partes = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
    h = parseInt(partes.find(x => x.type === 'hour').value, 10) % 24;
    m = parseInt(partes.find(x => x.type === 'minute').value, 10);
  } catch (e) { void e; }
  const min = h * 60 + m;
  if (min >= 540 && min < 1080) return { abierto: true, corto: 'Atendiendo ahora', titulo: 'Atendiendo ahora', texto: 'Tomamos pedidos hasta las 18 h.' };
  if (min < 540) return { abierto: false, corto: 'Abrimos a las 9 h', titulo: 'Abrimos a las 9 h', texto: 'Dejá tu pedido y te respondemos desde las 9.' };
  return { abierto: false, corto: 'Fuera de horario', titulo: 'Ya cerramos por hoy', texto: 'Dejá tu pedido y te respondemos mañana desde las 9.' };
}
function initEstado() {
  const pintar = () => {
    const e = estadoHoy();
    document.querySelectorAll('[data-estado]').forEach(el => { el.textContent = e.corto; });
    document.querySelectorAll('[data-estado-titulo]').forEach(el => { el.textContent = e.titulo; });
    document.querySelectorAll('[data-estado-texto]').forEach(el => { el.textContent = e.texto; });
    document.querySelectorAll('[data-estado-box]').forEach(el => el.classList.toggle('abierto', e.abierto));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initVitrinas() {
  document.querySelectorAll('[data-vitrina]').forEach(cont => {
    const tipo = cont.dataset.vitrina;
    const fila = cont.hasAttribute('data-fila');
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ filtros: { tipo }, orden: 'destacados', limite });
    items.forEach(cachear);
    cont.innerHTML = items.map(p => cardHTML(p, { fila })).join('');
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
  const que = p.tipo === 'caja' ? p.titulo : `${p.titulo} (${PRES[f].nombre.toLowerCase()})`;
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${que} al carrito`);
  if (n < qty) setTimeout(() => showToast(`Sumamos ${n}: es el máximo por pedido.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || MAX_LINEA;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
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
    const radio = e.target.closest('.pcard .formatos input');
    if (!radio) return;
    actualizarCard(radio.closest('.pcard'), radio.value);
  });
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      const card = quick.closest('.pcard');
      abrirQV(quick.dataset.quick, quick, card?.dataset.f);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, card?.dataset.f || formatoInicial(p), { comprar: add.hasAttribute('data-comprar') });
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
let qvFormato = 'unidad';
function abrirQV(id, origen, formato) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  qvFormato = formatoInicial(p, formato);
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.titulo, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Maná de Mar' },
    offers: formatosDe(p).map(f => ({ '@type': 'Offer', name: formatoNombre(p, f), priceCurrency: 'ARS', price: precioDe(p, f), availability: 'https://schema.org/InStock' })),
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const f = qvFormato;
  const filtrosRel = p.tipo === 'caja' ? { tipo: 'caja', excluir: p.id } : { tipo: 'sabor', excluir: p.id, coberturas: p.cobertura };
  let { items: rel } = Tienda.consultar({ filtros: filtrosRel, orden: 'destacados', limite: 3 });
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { tipo: 'sabor', excluir: [p.id, ...rel.map(r => r.id)] }, orden: 'destacados', limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const libre = MAX_LINEA - Cart.enCarrito(p.id, f);
  const formatos = formatosDe(p);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1200" height="1200">${etiquetaHTML(p)}</div>
    <div class="qv__info">
      <p class="qv__tipo">${p.tipo === 'caja' ? 'Caja surtida · Maná de Mar' : 'Alfajor artesanal · Maná de Mar'}</p>
      <h2 class="qv__nombre">${esc(p.titulo)}</h2>
      ${ICO.ola}
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Relleno</dt><dd>${esc(capasDe(p))}</dd></div>
        <div><dt>Cobertura</dt><dd>${esc(coberturaDe(p))}</dd></div>
        <div><dt>${p.tipo === 'caja' ? 'Trae' : 'Peso'}</dt><dd>${p.tipo === 'caja' ? esc(p.contenido) : 'Entre 75 y 80 g cada uno'}</dd></div>
      </dl>
      ${formatos.length > 1 ? `<fieldset class="qv__pres">
        <legend>Elegí la presentación</legend>
        ${formatos.map(k => `<label class="qv-pres"><input type="radio" name="qv-pres" value="${k}"${k === f ? ' checked' : ''}><span class="qv-pres__txt"><b>${esc(PRES[k].nombre)}</b><small>${PRES[k].n > 1 ? `${PRES[k].n} alfajores · ${formatearPrecio(p.precios[k] / PRES[k].n)} c/u` : '1 alfajor'}</small></span><span class="qv-pres__precio">${formatearPrecio(p.precios[k])}</span></label>`).join('')}
      </fieldset>` : `<p class="qv__precio-unico">${formatearPrecio(precioDe(p, f))} <small>${formatearPrecio(precioDe(p, f) / PRES[f].n)} c/u</small></p>`}
      <div class="qv__acc">
        ${libre > 0 ? `<div class="stepper stepper--grande" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${libre}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>` : ''}
        <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Llegaste al máximo'}</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
      </div>
      <p class="qv__envio">${ICO.camion}<span>Solo envíos a domicilio. El día y el costo del envío se coordinan por WhatsApp.</span></p>
      <a class="qv__wsp" href="${wspLink(`Hola Maná de Mar! Tengo una consulta sobre ${p.titulo}.`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Alguna duda? Consultanos por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>Desde ${formatearPrecio(precioMinimo(r))}</b></button>`).join('')}</div></div>` : ''}
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
  if (id && Tienda.obtener(id)) abrirQV(id, null, PARAMS.get('pres'));
}

function lineasValidas() {
  return Cart.get().filter(i => { const p = getProducto(i.id); return p && precioDe(p, i.f) != null; });
}
function lineasHTML(items) {
  return `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-linea-f="${i.f}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.titulo)}</p><p class="linea__var">${esc(formatoNombre(p, i.f))} · ${formatearPrecio(precioDe(p, i.f))}</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= MAX_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.titulo)}, ${esc(formatoNombre(p, i.f))}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.f) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
}
function pieHTML(items) {
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.titulo} (${formatoNombre(p, i.f).toLowerCase()}): ${formatearPrecio(precioDe(p, i.f) * i.qty)}`; }).join('\n');
  const msg = `Hola Maná de Mar! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi dirección para el envío: `;
  const n = Cart.alfajores();
  return `<p class="drawer__total"><span>Total <small>${n} ${n === 1 ? 'alfajor' : 'alfajores'}</small></span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">${ICO.camion}<span>Solo envíos: el día, el horario y el costo del envío se coordinan por WhatsApp.</span></p>`;
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
  cont.querySelector(`[data-linea="${CSS.escape(id)}"][data-linea-f="${f}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
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
    body.innerHTML = `<div class="cart-vacio">${ICO.ola}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Arrancá por un sabor o por una caja surtida con los cinco.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
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
    if (n) n.textContent = items.length ? `${Cart.alfajores()} alfajores` : '';
    if (!items.length) {
      cuerpo.innerHTML = `<div class="pedido__vacio">${ICO.ola}<p>Todavía no sumaste nada. Elegí un sabor y la presentación, y tocá «Agregar».</p></div>`;
      pie.hidden = true;
      return;
    }
    pie.hidden = false;
    cuerpo.innerHTML = lineasHTML(items);
    pie.innerHTML = pieHTML(items);
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    pres: valido(PARAMS.get('pres'), PRES_FILTRO),
    coberturas: new Set(lista('cobertura').filter(c => COBERTURAS[c])),
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const fila = MODELO === '2';
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los alfajores')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-pres-opciones]').forEach(cont => {
    const comoChip = cont.dataset.presOpciones === 'chips';
    const opciones = [['', 'Todas'], ...Object.entries(PRES_FILTRO)];
    cont.innerHTML = opciones.map(([k, n]) => (comoChip
      ? `<button type="button" class="chip" data-filtro="pres" data-valor="${k}" aria-pressed="false">${esc(k ? n : 'Todas las presentaciones')}</button>`
      : `<label class="opt"><input type="radio" name="f-pres" value="${k}" data-filtro="pres"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-pres="${k}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-cob-opciones]').forEach(cont => {
    const comoChip = cont.dataset.cobOpciones === 'chips';
    cont.innerHTML = Object.entries(COBERTURAS).map(([k, n]) => (comoChip
      ? `<button type="button" class="chip chip--cob" data-chip-cob="${k}" aria-pressed="false"><span class="chip__punto chip__punto--${k}"></span>${esc(n)}</button>`
      : `<label class="opt"><input type="checkbox" value="${k}" data-f="cobertura"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-cob="${k}"></span></label>`)).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.pres && sin !== 'pres') f.pres = estado.pres;
    if (estado.coberturas.size && sin !== 'cobertura') f.coberturas = [...estado.coberturas];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.pres) chips.push(['pres', '', PRES_FILTRO[estado.pres]]);
    estado.coberturas.forEach(v => chips.push(['cobertura', v, COBERTURAS[v]]));
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="cobertura"]').forEach(el => { el.checked = estado.coberturas.has(el.value); });
    document.querySelectorAll('[data-chip-cob]').forEach(b => b.setAttribute('aria-pressed', String(estado.coberturas.has(b.dataset.chipCob))));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-pres]').forEach(el => { const k = el.dataset.cuentaFiltroPres; el.textContent = Tienda.contar({ ...filtrosDe('pres'), ...(k ? { pres: k } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-cob]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('cobertura'), coberturas: [el.dataset.cuentaFiltroCob] }); });
    const enPanel = estado.coberturas.size + (estado.pres ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const titulo = cat ? cat.nombre : estado.pres ? PRES_FILTRO[estado.pres] : 'Todos los alfajores';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : 'Los cinco sabores por unidad, en caja de 6 o de 12, y las cajas surtidas. Todos con dulce de leche.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !(cat || estado.pres); miga.textContent = titulo; }
    document.querySelectorAll('[data-miga-sep]').forEach(s => { s.hidden = !(cat || estado.pres); });
    document.title = `${titulo} — Maná de Mar`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'pres', 'cobertura', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.pres) u.searchParams.set('pres', estado.pres);
    if (estado.coberturas.size) u.searchParams.set('cobertura', [...estado.coberturas].join(','));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p, { formato: estado.pres, fila })).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'opción' : 'opciones'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más alfajores para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.pres = ''; estado.q = '';
    estado.coberturas.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const cob = e.target.closest('input[data-f="cobertura"]');
    if (cob) {
      if (cob.checked) estado.coberturas.add(cob.value); else estado.coberturas.delete(cob.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    estado[el.dataset.filtro] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-chip-cob]');
    if (chip) {
      const k = chip.dataset.chipCob;
      if (estado.coberturas.has(k)) estado.coberturas.delete(k); else estado.coberturas.add(k);
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'cobertura') estado.coberturas.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = '';
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

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

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
  paso('.hero__ola', { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.55);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-badge', { y: 14, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
  paso('.ficha', { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  paso('.hero__sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] img:not(.sello)').forEach(img => {
    ScrollTrigger.create({
      trigger: img.closest('[data-parallax]'), start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initEstado,
  initVitrinas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initPedido,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
