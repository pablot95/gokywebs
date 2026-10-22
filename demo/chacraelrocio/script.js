const WA = '5492996225359';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'frutilla', nombre: 'Frutilla', img: 'images/cat-frutilla.webp' },
  { id: 'frambuesa', nombre: 'Frambuesa', img: 'images/cat-frambuesa.webp' },
  { id: 'mora', nombre: 'Mora', img: 'images/cat-mora.webp' },
];
const PRESENTACIONES = { iqf: 'IQF', block: 'Block' };
const USOS = { pasteleria: 'Pastelería', heladeria: 'Heladería', licuados: 'Licuados y jugos', dulces: 'Dulces y salsas' };
const CAJAS = [13, 15];

const PRODUCTOS = [
  {
    id: 'frutilla-iqf', nombre: 'Frutilla IQF', cat: 'frutilla', pres: 'iqf', usos: ['pasteleria', 'licuados', 'heladeria'], precioKg: 5200, stock: { 13: 36, 15: 24 },
    img: 'images/p-frutilla-iqf.webp', alt: 'Bolsa transparente llena de frutillas enteras congeladas sobre una mesada de acero',
    corto: 'Frutilla entera, congelada pieza por pieza.',
    desc: 'Frutilla entera congelada en forma individual (IQF): cada fruta queda suelta, así sacás de la bolsa lo que necesitás y el resto sigue congelado. Para pastelería, licuados, desayunos y helados con fruta.',
    rango: 1,
  },
  {
    id: 'frambuesa-iqf', nombre: 'Frambuesa IQF', cat: 'frambuesa', pres: 'iqf', usos: ['pasteleria', 'heladeria', 'licuados'], precioKg: 9800, stock: { 13: 18, 15: 3 },
    img: 'images/p-frambuesa-iqf.webp', alt: 'Bolsa transparente con frambuesas enteras congeladas sobre una mesada de acero',
    corto: 'Frambuesa entera, suelta y sin aplastar.',
    desc: 'Frambuesa entera congelada en forma individual (IQF), suelta y sin aplastar. Rinde para decorar tortas y postres, tartas, licuados y helados con fruta.',
    rango: 2,
  },
  {
    id: 'mora-iqf', nombre: 'Mora IQF', cat: 'mora', pres: 'iqf', usos: ['pasteleria', 'licuados', 'heladeria'], precioKg: 8400, stock: { 13: 22, 15: 14 },
    img: 'images/p-mora-iqf.webp', alt: 'Bolsa abierta con moras enteras congeladas cubiertas de escarcha',
    corto: 'Mora entera, sale suelta de la bolsa.',
    desc: 'Mora entera congelada en forma individual (IQF). Sale suelta de la bolsa: para tartas, cheesecakes, licuados, yogures y helados con fruta.',
    rango: 3,
  },
  {
    id: 'frutilla-block', nombre: 'Frutilla en block', cat: 'frutilla', pres: 'block', usos: ['dulces', 'heladeria', 'licuados'], precioKg: 3900, stock: { 13: 30, 15: 40 },
    img: 'images/p-frutilla-block.webp', alt: 'Caja de cartón abierta con frutillas congeladas dentro de una bolsa',
    corto: 'Frutilla compacta, para cocinar o procesar.',
    desc: 'Frutilla congelada en bloque compacto. Pensada para cocinar o procesar: dulces y mermeladas, salsas, pulpas, jugos y bases de helado.',
    rango: 4,
  },
  {
    id: 'frambuesa-block', nombre: 'Frambuesa en block', cat: 'frambuesa', pres: 'block', usos: ['dulces', 'heladeria'], precioKg: 7600, stock: { 13: 12, 15: 16 },
    img: 'images/p-frambuesa-block.webp', alt: 'Caja de cartón llena de frambuesas congeladas con bolsa interior',
    corto: 'Frambuesa compacta, para cocción y procesos.',
    desc: 'Frambuesa congelada en bloque compacto, para cocción y procesos: mermeladas, coulis y salsas, rellenos, jugos y bases de helado.',
    rango: 5,
  },
  {
    id: 'mora-block', nombre: 'Mora en block', cat: 'mora', pres: 'block', usos: ['dulces', 'heladeria', 'licuados'], precioKg: 6500, stock: { 13: 0, 15: 10 },
    img: 'images/p-mora-block.webp', alt: 'Caja de cartón con moras congeladas y bolsa interior',
    corto: 'Mora compacta, para dulces y salsas.',
    desc: 'Mora congelada en bloque compacto. Rinde en mermeladas y dulces, salsas para carnes y postres, licores, jugos y bases de helado.',
    rango: 6,
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioCaja = (p, kg) => Math.round((p.precioKg * kg) / 100) * 100;
const stockDe = (p, kg) => Math.max(0, p?.stock?.[kg] ?? 0);
const stockTotal = p => CAJAS.reduce((n, kg) => n + stockDe(p, kg), 0);
const kgInicial = p => CAJAS.find(kg => stockDe(p, kg) > 0) ?? CAJAS[0];
const catDe = id => CATEGORIAS.find(c => c.id === id);
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), pres = lista(f.pres), uso = lista(f.uso), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (pres.length && !pres.includes(p.pres)) return false;
    if (uso.length && !uso.some(x => p.usos.includes(x))) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.precioKg - b.precioKg || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precioKg - a.precioKg || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
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
      p.nombre, catDe(p.cat)?.nombre, PRESENTACIONES[p.pres], ...p.usos.map(u => USOS[u]), p.corto, p.desc,
      p.pres === 'iqf' ? 'iqf suelta suelto individual entera' : 'block bloque bloques',
      'frutos rojos congelado congelada congelados caja cajas 13 kg 15 kg',
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

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'chacraelrocio_cart',
  get() {
    try {
      const items = JSON.parse(localStorage.getItem(this.KEY)) || [];
      return Array.isArray(items) ? items.filter(i => i && CAJAS.includes(Number(i.kg))).map(i => ({ id: i.id, kg: Number(i.kg), qty: Math.max(1, parseInt(i.qty, 10) || 1) })) : [];
    } catch { return []; }
  },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinStorage = true; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, kg, qty = 1) {
    const items = this.get();
    const max = stockDe(producto, kg);
    const existing = items.find(i => i.id === producto.id && i.kg === kg);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, kg, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, kg, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.kg === kg); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, stockDe(p, kg) || 1)); this.save(items);
  },
  remove(id, kg) { this.save(this.get().filter(i => !(i.id === id && i.kg === kg))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioCaja(p, i.kg) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      const max = stockDe(p, i.kg);
      if (!p || max <= 0) { changed = true; return false; }
      if (i.qty > max) { i.qty = max; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICO_CARRITO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = (p, kg) => wa(`¡Hola Chacra el Rocío! Quiero consultar por ${p.nombre}${kg ? ` en caja de ${kg} kg` : ''}.`);

let uid = 0;
function cajasHTML(p, sel) {
  const n = `kg${++uid}`;
  return `<fieldset class="cajas"><legend class="sr-only">Caja de ${esc(p.nombre)}</legend>${CAJAS.map(kg => {
    const sin = stockDe(p, kg) <= 0;
    return `<label class="caja"><input type="radio" name="${n}" value="${kg}" data-kg${kg === sel ? ' checked' : ''}${sin ? ' disabled' : ''} aria-label="Caja de ${kg} kg${sin ? ', sin stock' : ''}"><span>${kg} kg</span></label>`;
  }).join('')}</fieldset>`;
}
function badgesDe(p) {
  const b = [[p.pres, PRESENTACIONES[p.pres]]];
  const total = stockTotal(p);
  if (total <= 0) b.push(['sin', 'Sin stock']);
  else if (CAJAS.some(kg => stockDe(p, kg) > 0 && stockDe(p, kg) <= 3)) b.push(['ultimas', 'Últimas cajas']);
  return b;
}
const badgesHTML = p => `<span class="badges">${badgesDe(p).map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>`;
const fotoHTML = (p, clase) => `<button type="button" class="${clase}" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${clase === 'pcard__foto' ? badgesHTML(p) : ''}<img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"></button>`;
const stepperHTML = (p, kg) => { const max = stockDe(p, kg); return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar una caja" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${max}" value="1" aria-label="Cantidad de cajas de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar una caja"${max <= 1 ? ' disabled' : ''}>+</button></div>`; };
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Chacra el Rocío! ¿Me avisan cuando vuelva a haber ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;
const precioHTML = (p, kg) => `<p class="precio" data-precio><span class="precio__caja">${formatearPrecio(precioCaja(p, kg))}</span><span class="precio__kg">${formatearPrecio(p.precioKg)}/kg</span></p>`;

function cardV(p, anim = true) {
  const kg = kgInicial(p);
  const acc = stockTotal(p) > 0
    ? `<div class="prod-actions">${stepperHTML(p, kg)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al pedido">${ICO_CARRITO}<span>Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard" data-prod="${p.id}" ${anim ? ANIM_SUBIR : ''}>
    ${fotoHTML(p, 'pcard__foto')}
    <div class="pcard__body">
      <p class="pcard__pres">${esc(catDe(p.cat)?.nombre)} · ${esc(PRESENTACIONES[p.pres])}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${cajasHTML(p, kg)}
      ${precioHTML(p, kg)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}
function filaHTML(p) {
  const kg = kgInicial(p);
  const acc = stockTotal(p) > 0
    ? `<div class="fila__acc">${stepperHTML(p, kg)}<button type="button" class="btn btn--cta btn--sm" data-add="${p.id}">Agregar</button></div>`
    : `<div class="fila__acc fila__acc--sin">${avisameHTML(p)}</div>`;
  const estado = badgesDe(p).filter(([k]) => k === 'ultimas' || k === 'sin').map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('');
  return `<article class="fila" data-prod="${p.id}" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'fila__foto')}
    <div class="fila__info">
      <h3 class="fila__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button>${estado}</h3>
      <p class="fila__meta">${esc(PRESENTACIONES[p.pres])} · ${formatearPrecio(p.precioKg)}/kg · ${esc(p.usos.map(u => USOS[u]).join(', '))}</p>
    </div>
    ${cajasHTML(p, kg)}
    <p class="fila__precio" data-precio><span>Por caja</span><b class="precio__caja">${formatearPrecio(precioCaja(p, kg))}</b></p>
    ${acc}
  </article>`;
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button:not(.nav-close)')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => {
    const n = Tienda.contar({ cat: c.id });
    return `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="48" height="48"><span>${esc(c.nombre)}</span><small>${n} ${n === 1 ? 'producto' : 'productos'}</small></a></li>`;
  }).join('');
  const desktop = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCatCounts() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-pres]').forEach(el => { el.textContent = Tienda.contar({ pres: el.dataset.cuentaPres }); });
}

function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const { items } = Tienda.consultar({ orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initLista() {
  const cont = document.querySelector('[data-lista]');
  if (!cont) return;
  const lim = parseInt(cont.dataset.limite, 10) || 8;
  const tabs = [...document.querySelectorAll('[data-lista-tab]')];
  const pie = document.querySelector('[data-lista-pie]');
  const pintar = (cat, animar) => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: lim });
    items.forEach(cachear);
    cont.innerHTML = items.map(filaHTML).join('');
    if (pie) {
      const n = Tienda.contar(cat ? { cat } : {});
      pie.href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
      pie.querySelector('span').textContent = cat ? `Ver ${catDe(cat).nombre.toLowerCase()} con filtros (${n})` : `Ver la lista con filtros (${n} productos)`;
    }
    if (animar) { revelarNuevos(cont); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.listaTab, true);
  }));
  pintar(tabs.find(t => t.getAttribute('aria-pressed') === 'true')?.dataset.listaTab || '', false);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const vistas = [...root.querySelectorAll('[data-vista]')];
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), pres: Object.keys(PRESENTACIONES), uso: Object.keys(USOS) };
  const vistaInicial = root.dataset.vistaInicial === 'lista' ? 'lista' : 'fotos';
  const estado = { cat: [], pres: [], uso: [], stock: false, q: '', orden: 'destacados', vista: vistaInicial };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.pres = listaURL('pres');
  estado.uso = listaURL('uso');
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';
  if (['fotos', 'lista'].includes(u.get('vista'))) estado.vista = u.get('vista');

  const filtrosDe = () => ({ cat: estado.cat, pres: estado.pres, uso: estado.uso, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.pres.length) p.set('pres', estado.pres.join(','));
    if (estado.uso.length) p.set('uso', estado.uso.join(','));
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    if (estado.vista !== vistaInicial) p.set('vista', estado.vista);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    vistas.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === estado.vista)));
    grid.classList.toggle('es-lista', estado.vista === 'lista');
    const n = estado.cat.length + estado.pres.length + estado.uso.length + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (estado.vista === 'lista' ? filaHTML(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'producto' : 'productos'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], pres: [], uso: [], stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  vistas.forEach(b => b.addEventListener('click', () => { if (estado.vista === b.dataset.vista) return; estado.vista = b.dataset.vista; aplicar(); }));
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function combinarCajas(kilos, disp) {
  let mejor = null;
  const max15 = Math.min(disp[15], Math.ceil(kilos / 15));
  for (let a = 0; a <= max15; a++) {
    const resto = kilos - a * 15;
    const b = resto > 0 ? Math.ceil(resto / 13) : 0;
    if (b > disp[13]) continue;
    const total = a * 15 + b * 13;
    const sobra = total - kilos;
    const cajas = a + b;
    if (!mejor || sobra < mejor.sobra || (sobra === mejor.sobra && cajas < mejor.cajas)) mejor = { c15: a, c13: b, total, sobra, cajas };
  }
  return mejor;
}

function initCalc() {
  const root = document.querySelector('[data-calc]');
  if (!root) return;
  const kgInput = root.querySelector('#calcKg');
  const combo = root.querySelector('[data-calc-combo]');
  const cajasEl = root.querySelector('[data-calc-cajas]');
  const detalle = root.querySelector('[data-calc-detalle]');
  const totalEl = root.querySelector('[data-calc-total]');
  const sumar = root.querySelector('[data-calc-sumar]');
  const wsp = root.querySelector('[data-calc-wsp]');
  const aviso = root.querySelector('[data-calc-aviso]');
  let actual = null;
  const leer = () => {
    const cat = root.querySelector('input[name="calcFruta"]:checked')?.value || 'frutilla';
    const pres = root.querySelector('input[name="calcPres"]:checked')?.value || 'iqf';
    const kilos = Math.max(1, Math.min(parseInt(kgInput.value, 10) || 1, 600));
    return { cat, pres, kilos };
  };
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  const calcular = () => {
    const { cat, pres, kilos } = leer();
    const p = getProducto(`${cat}-${pres}`);
    if (!p) return;
    const disp = { 13: stockDe(p, 13), 15: stockDe(p, 15) };
    const r = combinarCajas(kilos, disp);
    actual = r ? { p, r, kilos } : null;
    const faltante = CAJAS.filter(kg => disp[kg] <= 0);
    aviso.hidden = !faltante.length;
    if (faltante.length) aviso.textContent = `Ahora no hay cajas de ${faltante.join(' y ')} kg de ${p.nombre}, así que la cuenta usa solo las de ${CAJAS.filter(kg => disp[kg] > 0).join(' y ')} kg.`;
    if (!r) {
      combo.textContent = 'Para esa cantidad, consultanos';
      cajasEl.innerHTML = '';
      detalle.textContent = `El stock online de ${p.nombre} no llega a ${kilos} kg. Escribinos y vemos cómo armarlo.`;
      totalEl.textContent = '—';
      sumar.disabled = true;
      wsp.href = wa(`¡Hola Chacra el Rocío! Necesito unos ${kilos} kg de ${p.nombre}. ¿Me pasan disponibilidad?`);
      return;
    }
    const partes = [];
    if (r.c15) partes.push(plural(r.c15, 'caja de 15 kg', 'cajas de 15 kg'));
    if (r.c13) partes.push(r.c15 ? `${r.c13} de 13 kg` : plural(r.c13, 'caja de 13 kg', 'cajas de 13 kg'));
    combo.textContent = partes.join(' y ');
    const lista = [...Array(r.c15).fill(15), ...Array(r.c13).fill(13)];
    const visibles = lista.slice(0, 10);
    cajasEl.innerHTML = visibles.map(kg => `<li class="es-${kg}">${kg}<small>kg</small></li>`).join('') + (lista.length > visibles.length ? `<li class="mas">+${lista.length - visibles.length}</li>` : '');
    detalle.textContent = `${r.total} kg en total · ${r.sobra ? `te sobran ${r.sobra} kg` : 'justo lo que necesitás'}`;
    const total = r.c15 * precioCaja(p, 15) + r.c13 * precioCaja(p, 13);
    totalEl.textContent = formatearPrecio(total);
    sumar.disabled = false;
    wsp.href = wa(`¡Hola Chacra el Rocío! Necesito ${kilos} kg de ${p.nombre}: ${partes.join(' y ')} (${r.total} kg). ¿Lo tienen disponible?`);
  };
  root.addEventListener('change', calcular);
  kgInput.addEventListener('input', calcular);
  root.querySelectorAll('[data-calc-step]').forEach(b => b.addEventListener('click', () => {
    const v = (parseInt(kgInput.value, 10) || 0) + Number(b.dataset.calcStep);
    kgInput.value = Math.max(1, Math.min(v, 600));
    calcular();
  }));
  kgInput.addEventListener('blur', () => { kgInput.value = leer().kilos; });
  sumar.addEventListener('click', () => {
    if (!actual) return;
    const { p, r } = actual;
    if (r.c15) Cart.add(p, 15, r.c15);
    if (r.c13) Cart.add(p, 13, r.c13);
    showToast(`Sumaste ${r.cajas} ${r.cajas === 1 ? 'caja' : 'cajas'} de ${p.nombre} al pedido`);
  });
  calcular();
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  try {
    const centro = [-38.9565, -68.2338];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(centro, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 15] });
    L.marker(centro, { icon: icono, keyboard: false, title: 'Chacra el Rocío' }).addTo(mapa).bindPopup('<b>Chacra el Rocío</b><br>Plottier, Neuquén');
    const ajustar = () => mapa.invalidateSize();
    window.addEventListener('load', ajustar);
    setTimeout(ajustar, 1400);
  } catch (e) {
    el.hidden = true;
  }
}

function lineaHTML(item, p, mini) {
  const max = stockDe(p, item.kg);
  const unit = precioCaja(p, item.kg);
  return `<div class="linea${mini ? ' linea--mini' : ''}">
    ${mini ? '' : `<div class="linea__foto"><img src="${p.img}" alt="" width="900" height="900"></div>`}
    <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">Caja de ${item.kg} kg · ${formatearPrecio(unit)} c/u</p></div>
    <p class="linea__precio">${formatearPrecio(unit * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}" data-linea-kg="${item.kg}"><button type="button" data-linea-step="-1" data-id="${p.id}" data-kg="${item.kg}" aria-label="Restar una caja de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${max}" value="${item.qty}" aria-label="Cajas de ${item.kg} kg de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" data-kg="${item.kg}" aria-label="Sumar una caja de ${esc(p.nombre)}"${item.qty >= max ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}" data-kg="${item.kg}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa('¡Hola Chacra el Rocío! Quiero consultar por frutos rojos congelados.');
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${p.nombre}, caja de ${i.kg} kg — ${formatearPrecio(precioCaja(p, i.kg) * i.qty)}`);
  return wa(`¡Hola Chacra el Rocío! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas], [data-pedido-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"][data-kg="${activo.dataset.kg}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const total = formatearPrecio(Cart.total());
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu pedido está vacío</p><small>Elegí la fruta y la caja, y sumala con «Agregar».</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p, false)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  const pedido = document.querySelector('[data-pedido-lineas]');
  if (pedido) {
    pedido.innerHTML = vacio
      ? '<p class="pedido__vacio">Todavía no sumaste cajas. Tocá «Agregar» en la lista y el pedido se arma acá.</p>'
      : items.map(({ i, p }) => lineaHTML(i, p, true)).join('');
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp], [data-pedido-wsp]').forEach(a => { a.href = msg; });
  if (selector && enLineas) {
    const cont = document.querySelector(enLineas.hasAttribute('data-drawer-lineas') ? '[data-drawer-lineas]' : '[data-pedido-lineas]');
    (cont.querySelector(selector) || cont.querySelector('button:not([disabled])'))?.focus();
  }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  const kg = kgInicial(p);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { pres: p.pres, excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const fotos = [{ src: p.img, alt: p.alt }, { src: cat.img, alt: `${cat.nombre} congelada servida en un bowl blanco` }];
  const comprar = stockTotal(p) > 0
    ? `<div class="qv__comprar">${cajasHTML(p, kg)}${stepperHTML(p, kg)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al pedido</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div><p class="qv__stock" data-qv-stock>${stockAviso(p, kg)}</p>`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<div class="qv__galeria">
    <figure class="qv__foto"><img src="${fotos[0].src}" alt="${esc(fotos[0].alt)}" width="900" height="900" data-qv-img></figure>
    <div class="qv__miniaturas">${fotos.map((f, i) => `<button type="button" data-qv-foto="${f.src}" data-alt="${esc(f.alt)}" aria-pressed="${i === 0}" aria-label="Ver foto ${i + 1}"><img src="${f.src}" alt="" width="900" height="900"></button>`).join('')}</div>
  </div>
  <div class="qv__info" data-prod="${p.id}">
    <p class="pcard__pres">${esc(cat?.nombre)} · ${esc(PRESENTACIONES[p.pres])}</p>
    <h2>${esc(p.nombre)}</h2>
    <dl class="qv__precios"><div><dt data-qv-caja>Caja de ${kg} kg</dt><dd class="precio__caja">${formatearPrecio(precioCaja(p, kg))}</dd></div><div><dt>Precio por kilo</dt><dd>${formatearPrecio(p.precioKg)}</dd></div></dl>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="rasgos">${p.usos.map(x => `<span class="rasgo">${USOS[x]}</span>`).join('')}</div>
    ${comprar}
    <a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener" data-qv-wsp>${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="900" height="900"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(r.precioKg)}/kg</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function stockAviso(p, kg) {
  const s = stockDe(p, kg);
  return s > 0 && s <= 3 ? `Quedan ${s} ${s === 1 ? 'caja' : 'cajas'} de ${kg} kg` : '';
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href, description: p.desc,
      offers: CAJAS.map(kg => ({ '@type': 'Offer', name: `Caja de ${kg} kg`, priceCurrency: 'ARS', price: precioCaja(p, kg), availability: stockDe(p, kg) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })),
    });
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 1;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

const contenedorDe = el => el.closest('.pcard, .fila, .qv__info');
const kgDe = cont => Number(cont?.querySelector('input[data-kg]:checked')?.value) || null;

function actualizarVariante(cont) {
  const p = getProducto(cont.dataset.prod);
  const kg = kgDe(cont);
  if (!p || !kg) return;
  cont.querySelectorAll('.precio__caja').forEach(el => { el.textContent = formatearPrecio(precioCaja(p, kg)); });
  const st = cont.querySelector('[data-stepper]:not([data-linea])');
  if (st) { st.querySelector('input').max = stockDe(p, kg); syncStepper(st); }
  const caja = cont.querySelector('[data-qv-caja]');
  if (caja) caja.textContent = `Caja de ${kg} kg`;
  const aviso = cont.querySelector('[data-qv-stock]');
  if (aviso) aviso.textContent = stockAviso(p, kg);
  const link = cont.querySelector('[data-qv-wsp]');
  if (link) link.href = waConsulta(p, kg);
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu pedido está vacío: sumá una caja primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar], [data-qv-foto]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-qv-foto]')) {
      const img = document.querySelector('[data-qv-img]');
      if (img) { img.src = t.dataset.qvFoto; img.alt = t.dataset.alt || ''; }
      t.parentElement.querySelectorAll('[data-qv-foto]').forEach(b => b.setAttribute('aria-pressed', String(b === t)));
      return;
    }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const kg = Number(t.dataset.kg);
      const it = Cart.get().find(i => i.id === t.dataset.id && i.kg === kg);
      if (it) Cart.setQty(it.id, kg, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar, Number(t.dataset.kg));
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del pedido`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || stockTotal(p) <= 0) return;
    const cont = contenedorDe(t);
    const kg = kgDe(cont) || kgInicial(p);
    const max = stockDe(p, kg);
    if (max <= 0) { showToast(`No hay cajas de ${kg} kg de ${p.nombre} ahora`); return; }
    const st = cont?.querySelector('[data-stepper]:not([data-linea])');
    const qty = st ? syncStepper(st) : 1;
    const enCarrito = Cart.get().find(i => i.id === p.id && i.kg === kg)?.qty || 0;
    if (enCarrito >= max) { showToast(`Ya tenés todas las cajas de ${kg} kg de ${p.nombre} en el pedido`); return; }
    Cart.add(p, kg, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${qty > 1 ? `${qty} cajas` : '1 caja'} de ${kg} kg de ${p.nombre}`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    if (e.target.matches('input[data-kg]')) {
      const cont = contenedorDe(e.target);
      if (cont) actualizarVariante(cont);
      return;
    }
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, Number(st.dataset.lineaKg), v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * 8).toFixed(2)}%`; }
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero-datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
  paso('.hero-etiqueta', { y: 30, scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.65);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id);
}

Cart.syncStock();
initCatCounts();
initNavDrop();
initPrevia();
initLista();
initCatalogo();
initCalc();
renderCarrito();
initReveals();
initNav();
initModelBarScroll();
initFloats();
updateCartBadge();
initDelegacion();
initHeroMotion();
initParallax();
initMapa();
abrirDesdeURL();
