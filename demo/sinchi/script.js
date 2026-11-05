const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493516009421';
const MARCA = 'SINCHI';
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const CATEGORIAS = [{"id": "argollas", "nombre": "Argollas", "bajada": "Lisas, trenzadas y ovaladas, de 15 a 40 mm", "img": "images/p-argollas-lisas.webp"}, {"id": "pequenos", "nombre": "Aros pequeños", "bajada": "Abridores de bolita, corazón, estrella y triángulo", "img": "images/p-abridores-bolita.webp"}, {"id": "colgantes", "nombre": "Aros colgantes", "bajada": "Gota pulida y disco satinado con gancho", "img": "images/p-colgantes-gota.webp"}];
const ACABADOS = [{"id": "brillante", "nombre": "Pulido brillante"}, {"id": "satinado", "nombre": "Satinado"}, {"id": "trenzado", "nombre": "Trenzado"}];
const PRECIOS = [{"id": "hasta20", "nombre": "Hasta $20.000", "min": 0, "max": 20000}, {"id": "20a30", "nombre": "$20.000 a $30.000", "min": 20000, "max": 30000}, {"id": "mas30", "nombre": "Más de $30.000", "min": 30000, "max": null}];
const PRODUCTOS = [{"id": "argollas-lisas", "rango": 1, "cat": "argollas", "acabado": "brillante", "nombre": "Argollas lisas", "nota": "Tres tamaños", "opciones": [{"id": "o1", "nombre": "15 mm", "precio": 24900}, {"id": "o2", "nombre": "20 mm", "precio": 28900}, {"id": "o3", "nombre": "25 mm", "precio": 33900}], "img": {"src": "images/p-argollas-lisas.webp", "w": 900, "h": 900, "alt": "Par de argollas lisas de plata sobre un pedestal de terciopelo beige"}, "desc": "Argollas de tubo liso con cierre a presión. Pulidas a espejo: van con todo, de día y de noche.", "claves": ["argolla", "argollas", "aro", "lisa", "clasica", "tubo"]}, {"id": "abridores-bolita", "rango": 2, "cat": "pequenos", "acabado": "brillante", "nombre": "Abridores de bolita", "nota": "Con traba mariposa", "opciones": [{"id": "o1", "nombre": "4 mm", "precio": 13900}, {"id": "o2", "nombre": "6 mm", "precio": 15900}, {"id": "o3", "nombre": "8 mm", "precio": 18900}], "img": {"src": "images/p-abridores-bolita.webp", "w": 1200, "h": 1200, "alt": "Par de abridores de bolita de plata pulida con traba mariposa"}, "desc": "Bolitas de plata pulida con perno y traba mariposa. El básico para el día a día, también para un segundo agujero.", "claves": ["abridor", "abridores", "bolita", "pasante", "perla", "chico"]}, {"id": "argollas-trenzadas", "rango": 3, "cat": "argollas", "acabado": "trenzado", "nombre": "Argollas trenzadas", "nota": "Dos tamaños", "opciones": [{"id": "o1", "nombre": "15 mm", "precio": 27900}, {"id": "o2", "nombre": "20 mm", "precio": 32900}], "img": {"src": "images/p-argollas-trenzadas.webp", "w": 1000, "h": 1000, "alt": "Par de argollas trenzadas de plata con cierre a presión"}, "desc": "Argollas con trama trenzada que refleja la luz en cada giro. Cierre a presión y tubo grueso.", "claves": ["argolla", "argollas", "trenzada", "torzada", "gruesa"]}, {"id": "colgantes-gota", "rango": 4, "cat": "colgantes", "acabado": "brillante", "nombre": "Colgantes gota", "nota": "Gancho fino", "opciones": [{"id": "o1", "nombre": "Largo 3 cm", "precio": 32900}], "img": {"src": "images/p-colgantes-gota.webp", "w": 1000, "h": 1000, "alt": "Par de aros colgantes en forma de gota de plata pulida"}, "desc": "Una gota de plata pulida que cuelga de un gancho fino. Liviana, se mueve con vos.", "claves": ["colgante", "colgantes", "gota", "largo", "gancho"]}, {"id": "abridores-corazon", "rango": 5, "cat": "pequenos", "acabado": "brillante", "nombre": "Abridores de corazón", "nota": "Corazón inflado", "opciones": [{"id": "o1", "nombre": "8 mm", "precio": 18900}], "img": {"src": "images/p-abridores-corazon.webp", "w": 1000, "h": 1000, "alt": "Par de abridores de corazón de plata pulida"}, "desc": "Corazón inflado de plata pulida con perno y traba. Ideal para regalar.", "claves": ["abridor", "abridores", "corazon", "regalo", "chico"]}, {"id": "argollas-ovaladas", "rango": 6, "cat": "argollas", "acabado": "brillante", "nombre": "Argollas ovaladas", "nota": "Dos largos", "opciones": [{"id": "o1", "nombre": "30 mm", "precio": 34900}, {"id": "o2", "nombre": "40 mm", "precio": 39900}], "img": {"src": "images/p-argollas-ovaladas.webp", "w": 1000, "h": 1000, "alt": "Par de argollas ovaladas largas de plata pulida"}, "desc": "Argollas alargadas de tubo fino. Estilizan y suman presencia sin pesar.", "claves": ["argolla", "argollas", "ovalada", "oval", "larga", "grande"]}, {"id": "colgantes-disco", "rango": 7, "cat": "colgantes", "acabado": "satinado", "nombre": "Colgantes disco", "nota": "Disco satinado", "opciones": [{"id": "o1", "nombre": "Largo 2,8 cm", "precio": 27900}], "img": {"src": "images/p-colgantes-disco.webp", "w": 1000, "h": 1000, "alt": "Par de aros colgantes con disco de plata satinada y gancho"}, "desc": "Disco de plata con terminación satinada y un leve ondulado que juega con la luz.", "claves": ["colgante", "colgantes", "disco", "moneda", "satinado", "mate"]}, {"id": "abridores-estrella", "rango": 8, "cat": "pequenos", "acabado": "satinado", "nombre": "Abridores de estrella", "nota": "Estrella satinada", "opciones": [{"id": "o1", "nombre": "9 mm", "precio": 17900}], "img": {"src": "images/p-abridores-estrella.webp", "w": 1000, "h": 1000, "alt": "Par de abridores de estrella de plata satinada"}, "desc": "Estrella de plata con terminación satinada, perno y traba mariposa.", "claves": ["abridor", "abridores", "estrella", "satinado", "chico"]}, {"id": "abridores-triangulo", "rango": 9, "cat": "pequenos", "acabado": "satinado", "nombre": "Abridores triángulo", "nota": "Triángulo satinado", "opciones": [{"id": "o1", "nombre": "8 mm", "precio": 16900}], "img": {"src": "images/p-abridores-triangulo.webp", "w": 1000, "h": 1000, "alt": "Par de abridores triangulares de plata satinada"}, "desc": "Triángulo geométrico de plata satinada con bordes pulidos. Minimalista y liviano.", "claves": ["abridor", "abridores", "triangulo", "geometrico", "satinado", "chico"]}, {"id": "argollas-mini", "rango": 99, "cat": "argollas", "acabado": "brillante", "nombre": "Argollas mini", "nota": "Oculto", "opciones": [{"id": "o1", "nombre": "10 mm", "precio": 19900}], "img": {"src": "images/p-argollas-lisas.webp", "w": 900, "h": 900, "alt": "Argollas mini de plata"}, "visible": false, "desc": "Producto oculto de prueba: no se muestra en la tienda.", "claves": ["mini"]}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

PRODUCTOS.forEach(p => {
  p.desde = Math.min(...p.opciones.map(o => o.precio));
  p.base = p.opciones[0].precio;
});

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const acabadoDe = id => ACABADOS.find(a => a.id === id) || null;
const enRango = (p, id) => {
  const r = PRECIOS.find(x => x.id === id);
  return !!r && p.desde >= r.min && (r.max == null || p.desde < r.max);
};

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.nota, p.desc, catDe(p.cat)?.nombre, acabadoDe(p.acabado)?.nombre,
    ...(p.opciones || []).map(o => o.nombre), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), acabado = lista(f.acabado), precio = lista(f.precio), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (acabado.length && !acabado.includes(p.acabado)) return false;
    if (precio.length && !precio.some(id => enRango(p, id))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id) || '';
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.base - b.base || desempate(a, b);
      case 'precio-desc': return (a, b) => b.base - a.base || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
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

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opcionDe = (p, v) => p?.opciones?.find(o => o.id === v) || null;
const varValida = (p, v) => (opcionDe(p, v) ? v : p?.opciones?.[0]?.id || '');
const precioDe = (p, v) => (opcionDe(p, v) || p?.opciones?.[0])?.precio || 0;
const presDe = (p, v) => (opcionDe(p, v) || p?.opciones?.[0])?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'sinchi_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    if (!vv) return 0;
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
  sync() {
    const crudo = this.get();
    const limpias = [];
    let changed = false;
    crudo.forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  brillo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
const botonSumar = p => `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
const presSelectHTML = p => p.opciones.length > 1
  ? `<label class="prod__pres"><span class="sr-only">Tamaño de ${esc(p.nombre)}</span><select data-pres-sel>${p.opciones.map(o => `<option value="${esc(o.id)}">${esc(o.nombre)}</option>`).join('')}</select></label>`
  : `<p class="prod__pres prod__pres--unica">${esc(p.opciones[0].nombre)}</p>`;

const ANIMS = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(40px)"',
};
function cardHTML(p, anim = 'subir') {
  const a = ANIMS[anim] || '';
  const cat = catDe(p.cat);
  return `<article class="prod" data-id="${esc(p.id)}"${a}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.w}" height="${p.img.h}" decoding="async"></button><span class="prod__cat">${esc(cat.nombre)}</span><span class="marca925" aria-hidden="true">925</span></div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__precio" data-card-precio><b>${formatearPrecio(p.base)}</b><span data-card-pres>${esc(presDe(p))}</span></p>
    <div class="prod__compra">${presSelectHTML(p)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function opcionesHTML(p, sel = null) {
  const v = varValida(p, sel);
  return `<div class="opciones" role="group" aria-label="Tamaño" data-opciones>${p.opciones.map(o => `<button type="button" class="opcion-btn" data-opcion="${esc(o.id)}" aria-pressed="${o.id === v}"><b>${esc(o.nombre)}</b><small>${formatearPrecio(o.precio)}</small></button>`).join('')}</div>`;
}
function elegirOpcion(cont, v) {
  const p = cont && getProducto(cont.dataset.id);
  if (!p) return;
  const vv = varValida(p, v);
  cont.querySelectorAll('[data-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.opcion === vv)));
  cont.querySelectorAll('[data-precio]').forEach(el => { el.textContent = formatearPrecio(precioDe(p, vv)); });
  cont.querySelectorAll('[data-det]').forEach(el => { el.textContent = presDe(p, vv); });
}
const opcionElegida = cont => cont?.querySelector('[data-opcion][aria-pressed="true"]')?.dataset.opcion || cont?.querySelector('[data-pres-sel]')?.value || null;
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${presDe(p, i.v)}) — ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el retiro o la entrega?`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.w}" height="${p.img.h}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><b>${esc(presDe(p, i.v))}</b> · ${formatearPrecio(precioDe(p, i.v))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}, ${esc(presDe(p, i.v))}">${ICO.x}</button>
</li>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? plural(n, 'producto', 'productos') : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» (${presDe(p, v)}) del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) return 0;
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${presDe(p, v)}) al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-pres-sel]');
    if (!sel) return;
    const card = sel.closest('[data-id]');
    const p = card && getProducto(card.dataset.id);
    const precio = card?.querySelector('[data-card-precio]');
    if (!p || !precio) return;
    precio.querySelector('b').textContent = formatearPrecio(precioDe(p, sel.value));
    precio.querySelector('[data-card-pres]').textContent = presDe(p, sel.value);
    if (!reduceMotion) { precio.classList.remove('cambia'); void precio.offsetWidth; precio.classList.add('cambia'); }
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const id = s ? s.dataset.sumar : c.dataset.comprar;
      const v = cont?.querySelector('[data-pres-sel]')?.value;
      const n = sumar(id, v, 1, b);
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, v: qv.closest('[data-id]')?.querySelector('[data-pres-sel]')?.value });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, v = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const vv = varValida(p, v);
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const acabado = acabadoDe(p.acabado);
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">
    <figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.w}" height="${p.img.h}"></figure>
  </div>
  <div class="qv__info">
    <p class="qv__meta"><span class="qv__cat">${esc(catDe(p.cat).nombre)}</span>${acabado ? `<span class="qv__fam">${esc(acabado.nombre)}</span>` : ''}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__precio"><b data-precio>${formatearPrecio(precioDe(p, vv))}</b><span data-det>${esc(presDe(p, vv))}</span></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__bloque"><p class="qv__label">Tamaño</p>${opcionesHTML(p, vv)}</div>
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al carrito</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <p class="qv__cuidado">${ICO.brillo}<span>Plata 925. Guardalos por separado y lejos de la humedad.</span></p>
    <div class="qv__links"><a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a></div>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.w}" height="${r.img.h}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.base)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const op = e.target.closest('[data-opcion]');
    if (op) { elegirOpcion(cont, op.dataset.opcion); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const v = opcionElegida(cont);
      const n = Cart.add(p, v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» (${presDe(p, v)}) al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.id, material: 'Plata 925',
    image: new URL(p.img.src, location.href).href, category: catDe(p.cat).nombre,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: p.desde, highPrice: Math.max(...p.opciones.map(o => o.precio)), offerCount: p.opciones.length, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { }
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
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } else if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['acabado', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${plural(n, 'modelo', 'modelos')}</em></a></li>`;
    }).join('');
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => { el.textContent = plural(Tienda.contar({ cat: el.dataset.catN }), 'modelo', 'modelos'); });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const cont = document.querySelector('[data-rail]');
  if (!cont) return;
  const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
  cont.innerHTML = Tienda.consultar({ limite }).items.map(p => cardHTML(p, 'der')).join('');
}

function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      const [k, v] = tab ? tab.split(':') : [];
      const filtros = k ? { [k]: v } : {};
      cont.innerHTML = Tienda.consultar({ filtros, limite }).items.map(p => cardHTML(p, 'subir')).join('');
      if (verTodo) verTodo.href = k ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function initFichaHero() {
  document.querySelectorAll('[data-ficha-precio]').forEach(el => {
    const p = getProducto(el.closest('[data-qv]')?.dataset.qv);
    if (p) el.textContent = formatearPrecio(p.desde);
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('select')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
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

function initRails() {
  document.querySelectorAll('[data-rail-vp]').forEach(vp => {
    initRailDrag(vp);
    const sec = vp.closest('section');
    const prev = sec?.querySelector('[data-rail-prev]');
    const next = sec?.querySelector('[data-rail-next]');
    const track = vp.querySelector('.rail-track');
    if (!prev || !next || !track) return;
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
      const w = card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
      return w * Math.max(1, Math.floor(vp.clientWidth / w) - 1);
    };
    const sync = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, acabado: ACABADOS, precio: PRECIOS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    acabado: valida(params.get('acabado'), ACABADOS),
    precio: valida(params.get('precio'), PRECIOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    return f;
  };
  const opcion = (grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.keys(GRUPOS).forEach(k => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = GRUPOS[k].map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    if (e.cat.length === 1 && !e.acabado.length && !e.precio.length) return nombreDe(CATEGORIAS, e.cat[0]);
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.keys(GRUPOS).flatMap(k => e[k].map(id => ({ k, id, t: nombreDe(GRUPOS[k], id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los aros';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo de aros de plata 925'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, 'subir')).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'modelo' : 'modelos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-31.3935, -64.1835);
  const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(centro, 14);
  mapa.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const estilos = getComputedStyle(document.documentElement);
  const color = estilos.getPropertyValue('--color-primary').trim() || '#8B7355';
  L.circle(centro, { radius: 900, color, weight: 1.5, fillColor: color, fillOpacity: 0.16 }).addTo(mapa).bindTooltip('Alta Córdoba', { permanent: true, direction: 'center', className: 'mapa-etq' });
  mapa.fitBounds(centro.toBounds(2600));
  const ajustar = () => mapa.invalidateSize();
  window.addEventListener('load', ajustar);
  setTimeout(ajustar, 1400);
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 34, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-badge', { y: 14, scale: 0.94, opacity: 0, duration: 1, stagger: 0.08, clearProps: 'transform,opacity' }, 0.66);
  if (typeof ScrollTrigger !== 'undefined') {
    const ancha = hero.querySelector('.hero__ancha');
    if (ancha) gsap.to(ancha, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

[
  initRail, initPreviews, initMenuCategorias, initCatalogo, initFichaHero, initReveals, initHeroMotion,
  initRails, initNav, initDrawer, initVistaRapida, initCompras, initFloats, initModelBarScroll, initMapa,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); updateCartBadge(); } catch (err) { console.error(err); }
