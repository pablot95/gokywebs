const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493455542654';
const MARCA = 'Daniela Res';
const POR_PAGINA = 16;
const MAX_CANT = 10;
const MAX_PROBAR = 6;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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

const CATEGORIAS = [
  { id: 'abrigos', nombre: 'Abrigos y sacos', bajada: 'Blazer, trench y campera de jean', img: 'images/p-trench.webp' },
  { id: 'tejidos', nombre: 'Tejidos', bajada: 'Cárdigan y bufanda de lana', img: 'images/p-cardigan.webp' },
  { id: 'camisas', nombre: 'Camisas y remeras', bajada: 'Algodón, cuello clásico o redondo', img: 'images/p-camisa.webp' },
  { id: 'pantalones', nombre: 'Pantalones y polleras', bajada: 'Rectos, de tiro alto y midi', img: 'images/p-pantalon.webp' },
];
const TALLES = ['S', 'M', 'L', 'XL'].map(t => ({ id: t, nombre: t }));
const COLORES = [
  { id: 'arena', nombre: 'Arena', hex: '#CDB89A' },
  { id: 'blanco', nombre: 'Blanco', hex: '#FFFFFF' },
  { id: 'crudo', nombre: 'Crudo', hex: '#EDE3CF' },
  { id: 'verde', nombre: 'Verde', hex: '#1F5A4E' },
  { id: 'azul', nombre: 'Denim', hex: '#3D5A80' },
  { id: 'gris', nombre: 'Gris carbón', hex: '#3A3B3D' },
];
const PRECIOS = [
  { id: 'hasta50', nombre: 'Hasta $50.000', min: null, max: 50000 },
  { id: '50a80', nombre: '$50.001 a $80.000', min: 50001, max: 80000 },
  { id: 'mas80', nombre: 'Más de $80.000', min: 80001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const MEDIDAS = { S: [86, 68, 94], M: [92, 74, 100], L: [98, 80, 106], XL: [104, 86, 112] };

const PRODUCTOS = [
  { id: 'blazer-sastrero', nombre: 'Blazer sastrero arena', cat: 'abrigos', color: 'arena', precio: 89000, rango: 1, etiqueta: 'Nuevo', var: 'talle',
    imgs: [{ src: 'images/p-blazer.webp', lado: 1000, alt: 'Blazer sastrero color arena de un botón, colgado de una percha de madera' }],
    desc: 'Blazer de un botón, con solapa en punta y bolsillos con cartera. Forrado y entallado, sin marcar de más.',
    claves: ['saco', 'sastre', 'oficina', 'beige', 'camel', 'forrado'] },
  { id: 'camisa-blanca', nombre: 'Camisa blanca de algodón', cat: 'camisas', color: 'blanco', precio: 48000, rango: 2, etiqueta: '', var: 'talle',
    imgs: [{ src: 'images/p-camisa.webp', lado: 1000, alt: 'Camisa blanca de algodón con cuello clásico, extendida sobre un fondo claro' }],
    desc: 'Algodón liviano, cuello clásico y botones nacarados. Va sola, debajo del blazer o abierta sobre una remera.',
    claves: ['blusa', 'algodon', 'oficina', 'clasica', 'manga larga'] },
  { id: 'trench-cruzado', nombre: 'Trench cruzado beige', cat: 'abrigos', color: 'arena', precio: 129000, rango: 3, etiqueta: 'Últimas unidades', var: 'talle', sinStock: ['S'],
    imgs: [{ src: 'images/p-trench.webp', lado: 1000, alt: 'Trench cruzado beige con cinturón y charreteras, colgado de una percha' }],
    desc: 'Cruzado, con cinturón, charreteras y presillas en los puños. Largo a la rodilla, para la media estación.',
    claves: ['piloto', 'gabardina', 'tapado', 'camel', 'cinturon', 'abrigo'] },
  { id: 'cardigan-trenzado', nombre: 'Cárdigan trenzado crudo', cat: 'tejidos', color: 'crudo', precio: 62000, rango: 4, etiqueta: 'Nuevo', var: 'talle',
    imgs: [{ src: 'images/p-cardigan.webp', lado: 1000, alt: 'Cárdigan tejido en ochos color crudo, con botones de madera, colgado de una percha' }],
    desc: 'Tejido en ochos, con botones de madera y dos bolsillos al frente. Abrigado y de calce holgado.',
    claves: ['saco', 'lana', 'tejido', 'sweater', 'ochos', 'abrigo'] },
  { id: 'pantalon-recto', nombre: 'Pantalón recto verde inglés', cat: 'pantalones', color: 'verde', precio: 58000, rango: 5, etiqueta: '', var: 'talle',
    imgs: [{ src: 'images/p-pantalon.webp', lado: 1000, alt: 'Pantalón recto verde inglés de tiro alto, extendido sobre un fondo claro' }],
    desc: 'Tiro alto, pierna recta y raya marcada. De gabardina liviana, para la oficina o el fin de semana.',
    claves: ['sastrero', 'gabardina', 'tiro alto', 'oficina', 'verde ingles'] },
  { id: 'pollera-midi', nombre: 'Pollera midi arena', cat: 'pantalones', color: 'arena', precio: 52000, rango: 6, etiqueta: '', var: 'talle',
    imgs: [{ src: 'images/p-pollera.webp', lado: 1000, alt: 'Pollera midi color arena con pinzas, colgada de una percha' }],
    desc: 'Largo midi, con pinzas en la cintura y vuelo suave. Cierre invisible al costado.',
    claves: ['falda', 'midi', 'beige', 'pinzas'] },
  { id: 'campera-jean', nombre: 'Campera de jean clásica', cat: 'abrigos', color: 'azul', precio: 79000, descuento: 15, rango: 7, etiqueta: '', var: 'talle',
    imgs: [{ src: 'images/p-campera.webp', lado: 1000, alt: 'Campera de jean azul medio con botones metálicos y bolsillos con tapa' }],
    desc: 'Denim azul medio, con botones metálicos, dos bolsillos con tapa y puños con botón.',
    claves: ['jean', 'denim', 'azul', 'casual', 'abrigo'] },
  { id: 'remera-algodon', nombre: 'Remera de algodón gris carbón', cat: 'camisas', color: 'gris', precio: 24000, rango: 8, etiqueta: '', var: 'talle',
    imgs: [{ src: 'images/p-remera.webp', lado: 1000, alt: 'Remera de algodón gris carbón de manga corta, extendida sobre un fondo claro' }],
    desc: 'Cuello redondo, manga corta y algodón peinado. La base que va con todo.',
    claves: ['basica', 'algodon', 'manga corta', 'gris oscuro', 'casual'] },
  { id: 'bufanda-lana', nombre: 'Bufanda de lana verde', cat: 'tejidos', color: 'verde', precio: 29000, rango: 9, etiqueta: '', var: 'unico',
    imgs: [{ src: 'images/p-bufanda.webp', lado: 1000, alt: 'Bufanda de lana verde con flecos, doblada sobre un fondo claro' }],
    desc: 'Tejido suave con flecos en las puntas. Un color que suma a los neutros de todo el placard.',
    claves: ['lana', 'flecos', 'accesorio', 'invierno', 'petroleo'] },
];

const talleLibre = (p, t) => p.var === 'talle' && TALLES.some(x => x.id === t) && !(p.sinStock || []).includes(t);
function opcionValida(p, v) {
  if (p.var === 'talle') return talleLibre(p, v) ? v : '';
  return 'U';
}
function textoVar(p, v) {
  if (p.var === 'talle') return v ? `Talle ${v}` : 'Sin talle';
  return 'Talle único';
}
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
function metaDe(p) {
  return `${nombreDe(COLORES, p.color)} · ${p.var === 'talle' ? 'Talles S a XL' : 'Talle único'}`;
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, nombreDe(CATEGORIAS, p.cat), nombreDe(COLORES, p.color), ...(p.claves || []),
    p.var === 'talle' ? `talle ${TALLES.map(t => t.id).join(' ')}` : 'talle unico',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), talle = lista(f.talle), color = lista(f.color), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (talle.length && !talle.some(t => talleLibre(p, t))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
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
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'danielares_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const op = opcionValida(producto, v);
    if (!op) return 0;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === op);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: op, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_CANT)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  linea(i) { const p = getProducto(i.id); return p ? precioFinal(p) * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = opcionValida(p, i.v);
      if (!v) { changed = true; return false; }
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, i.qty || 1)); changed = true; }
      return true;
    });
    if (changed) this.save(limpias);
  },
};

const Probar = {
  KEY: 'danielares_probar',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v.filter(id => getProducto(id)).slice(0, MAX_PROBAR) : []; } catch { return []; } },
  save(ids) { try { localStorage.setItem(this.KEY, JSON.stringify(ids)); } catch { } document.dispatchEvent(new CustomEvent('probar:updated')); },
  add(id) {
    if (!getProducto(id)) return 'no';
    const ids = this.get();
    if (ids.includes(id)) return 'ya';
    if (ids.length >= MAX_PROBAR) return 'lleno';
    ids.push(id); this.save(ids); return 'ok';
  },
  remove(id) { this.save(this.get().filter(x => x !== id)); },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  percha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8.5V7.6a2 2 0 1 0-2-2"/><path d="M12 8.5 2.8 15.4a1.2 1.2 0 0 0 .7 2.1h17a1.2 1.2 0 0 0 .7-2.1z"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

function botonCompra(p, clase) {
  if (p.var === 'unico') return `<button type="button" class="${clase}" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}<span>Agregar</span></button>`;
  return `<button type="button" class="${clase}" data-qv="${esc(p.id)}" data-elegir aria-label="Elegir talle de ${esc(p.nombre)}">${ICO.mas}<span>Elegir talle</span></button>`;
}
function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio"><span class="precio__final">${formatearPrecio(precioFinal(p))}</span><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="prod__badge prod__badge--off">-${p.descuento}%</span>`;
  return p.etiqueta ? `<span class="prod__badge${p.etiqueta === 'Nuevo' ? ' prod__badge--nuevo' : ''}">${esc(p.etiqueta)}</span>` : '';
}
function mediaHTML(p) {
  return `<div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].lado}" height="${p.imgs[0].lado}" decoding="async"></div>`;
}
function cardHTML(p, estilo = 'ficha', animar = true, extra = '') {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  const cls = `prod prod--${estilo}${extra ? ` ${extra}` : ''}`;
  if (estilo === 'look') {
    return `<article class="${cls}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__marco">${mediaHTML(p)}${badgeHTML(p)}${botonCompra(p, 'prod__sumar')}</div>
  <div class="prod__pie"><h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>${precioHTML(p)}<p class="prod__meta">${esc(metaDe(p))}</p></div>
</article>`;
  }
  return `<article class="${cls}" data-id="${esc(p.id)}"${anim}>
  ${mediaHTML(p)}${badgeHTML(p)}
  <div class="prod__info">
    <p class="prod__meta">${esc(metaDe(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    ${precioHTML(p)}
    <div class="prod-actions">${botonCompra(p, 'btn btn--cta btn--sm prod-add')}</div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'prenda' : 'prendas'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${textoVar(p, i.v)}) — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola Daniela! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const clave = esc(claveLinea(i.id, i.v));
  const im = p.imgs[0];
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(im.src)}" alt="" width="${im.lado}" height="${im.lado}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoVar(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una unidad"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una unidad"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div><p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
  </div>
</li>`;
}
const partirClave = s => { const k = s.indexOf('|'); return [s.slice(0, k), s.slice(k + 1)]; };
function escucharLineas(lista) {
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(...partirClave(q.dataset.quitar)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const [id, v] = partirClave(b.dataset.linea);
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
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
    cuenta.textContent = n ? `${n} ${n === 1 ? 'prenda' : 'prendas'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function sumar(id, v = '', qty = 1) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, qty, v);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return 0; }
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre}${p.var === 'unico' ? '' : ` (${textoVar(p, opcionValida(p, v))})`} al carrito`);
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) { e.preventDefault(); sumar(s.dataset.sumar, s.dataset.v || ''); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv, { v: qv.dataset.v || '', elegir: qv.hasAttribute('data-elegir') }); }
  });
}

function chipsVar(p, actual, attr) {
  if (p.var !== 'talle') return '';
  return TALLES.map(t => {
    const sin = (p.sinStock || []).includes(t.id);
    return `<button type="button" class="chip chip--talle" ${attr}="${t.id}" aria-pressed="${t.id === actual}"${sin ? ' disabled aria-label="Talle ' + t.id + ' sin stock"' : ''}>${t.id}${sin ? '<small>sin stock</small>' : ''}</button>`;
  }).join('');
}
function medidaTexto(p, t) {
  if (p.var !== 'talle') return '';
  const m = MEDIDAS[t];
  if (!m) return 'Elegí un talle para ver sus medidas de referencia.';
  return `Talle ${t}: busto ${m[0]} cm, cintura ${m[1]} y cadera ${m[2]}, medidas del cuerpo.`;
}

function irACita() {
  const sec = document.getElementById('cita');
  if (sec) { sec.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); return; }
  location.href = `${HOME_URL}#cita`;
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '', elegir = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: opcionValida(p, v), qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const varBloque = p.var === 'unico'
    ? '<p class="qv__var-t">Talle único</p>'
    : `<p class="qv__var-t">Talle: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="Talle">${chipsVar(p, qvEstado.v, 'data-qv-op')}</div><p class="qv__medida" data-qv-medida></p>`;
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img data-qv-img src="${esc(p.imgs[0].src)}" alt="${esc(p.imgs[0].alt)}" width="${p.imgs[0].lado}" height="${p.imgs[0].lado}">${badgeHTML(p)}</div>
  </div>
  <div class="qv__info">
    <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(nombreDe(COLORES, p.color))}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__var">${varBloque}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Unidades"><button type="button" data-qv-paso="-1" aria-label="Restar una unidad" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <p class="qv__aviso" data-qv-aviso hidden>Elegí un talle para sumarla al carrito.</p>
    <div class="qv__probar">
      <button type="button" class="qv__probar-btn" data-qv-probar>${ICO.percha}<span>Probármela en el showroom</span></button>
      <a class="qv__wsp" href="${wspHref(`Hola Daniela! Quiero consultar por la prenda ${p.nombre}.`)}" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar por WhatsApp</span></a>
    </div>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>Combina con</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.imgs[0].src)}" alt="" width="${r.imgs[0].lado}" height="${r.imgs[0].lado}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => {
      const foco = elegir && p.var !== 'unico' ? modal.querySelector('[data-qv-op]:not([disabled])') : null;
      (foco || modal.querySelector('.qv__close'))?.focus();
    }, 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === qvEstado.v)));
  const elegida = modal.querySelector('[data-qv-elegida]');
  if (elegida) elegida.textContent = qvEstado.v || 'elegí uno';
  const med = modal.querySelector('[data-qv-medida]');
  if (med) med.textContent = medidaTexto(p, qvEstado.v);
  modal.querySelector('[data-qv-precio]').innerHTML = p.descuento > 0
    ? `${formatearPrecio(precioFinal(p) * qvEstado.qty)} <s>${formatearPrecio(p.precio * qvEstado.qty)}</s>`
    : formatearPrecio(precioFinal(p) * qvEstado.qty);
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  const enLista = Probar.get().includes(p.id);
  const pb = modal.querySelector('[data-qv-probar]');
  if (pb) { pb.setAttribute('aria-pressed', String(enLista)); pb.querySelector('span').textContent = enLista ? 'Ya está en tu cita · Ver la cita' : 'Probármela en el showroom'; }
  const detalle = p.var === 'unico' ? '' : qvEstado.v ? ` en talle ${qvEstado.v}` : '';
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola Daniela! Quiero consultar por la prenda ${p.nombre}${detalle}${qvEstado.qty > 1 ? `, ${qvEstado.qty} unidades` : ''}.`);
  ponerJsonLdProducto(p);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const aviso = modal.querySelector('[data-qv-aviso]');
    const op = e.target.closest('[data-qv-op]');
    if (op && !op.disabled) { qvEstado.v = op.dataset.qvOp; aviso.hidden = true; pintarQv(); return; }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    if (e.target.closest('[data-qv-probar]')) {
      const r = Probar.add(p.id);
      if (r === 'lleno') { showToast(`Ya marcaste ${MAX_PROBAR} prendas para probarte`); return; }
      if (r === 'ok') showToast(`Sumamos ${p.nombre} a tu cita: elegí el día y la franja`);
      cerrarCapa(modal, { devolverFoco: false });
      setTimeout(irACita, reduceMotion ? 0 : 200);
      return;
    }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      if (!opcionValida(p, qvEstado.v)) {
        aviso.hidden = false;
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return; }
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre}${p.var === 'unico' ? '' : ` (${textoVar(p, qvEstado.v)})`} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.imgs[0].src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    color: nombreDe(COLORES, p.color),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: 'https://schema.org/InStock' },
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
  const desktopMq = window.matchMedia('(min-width: 1081px)');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias() {
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(Boolean);
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="1000" height="1000"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1081px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1081px)');
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

function initResumenes() {
  document.querySelectorAll('[data-resumen]').forEach(el => {
    if (!CATEGORIAS.some(c => c.id === el.dataset.resumen)) return;
    const r = Tienda.resumen({ cat: el.dataset.resumen });
    el.textContent = `${r.n} ${r.n === 1 ? 'prenda' : 'prendas'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids, filtros = {}) {
  const res = Tienda.consultar({ filtros: { ...filtros, ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = idsDe(cont, 'data-preview');
    const looks = cont.hasAttribute('data-looks');
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = Tienda.consultar({ filtros: { [k]: v }, limite: 8 }).items;
      } else prods = productosPorIds(ids);
      let html = prods.map(p => cardHTML(p, looks ? 'look' : 'ficha')).join('');
      if (looks) {
        const total = Tienda.contar({});
        html += `<a class="looks__cta" href="${CATALOGO_URL}" data-animate="subir" style="opacity:0;transform:translateY(36px)"><span class="looks__ico" aria-hidden="true">${ICO.percha}</span><b>Ver las ${total} prendas</b><span>Con filtros por talle, color y precio ${ICO.flecha}</span></a>`;
      }
      cont.innerHTML = html;
    };
    pintar();
    if (!cont.hasAttribute('data-tabs')) return;
    const tabs = cont.closest('section')?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

const MOTIVOS_TXT = { prendas: 'Ver y probar prendas', asesoria: 'Asesoría de imagen', ambas: 'Ver prendas y asesoría de imagen' };
const FRANJAS_TXT = { manana: 'por la mañana (9 a 12 h)', tarde: 'por la tarde (16 a 20 h)' };
const isoDia = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
function proximosDias(desde = new Date(), n = 6) {
  const dias = [];
  const d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate());
  while (dias.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) dias.push(new Date(d));
  }
  return dias;
}
const fmtCorto = new Intl.DateTimeFormat('es-AR', { weekday: 'short' });
const fmtLargo = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtMes = new Intl.DateTimeFormat('es-AR', { month: 'long' });
const fechaLarga = d => fmtLargo.format(d).replace(',', '');
function mensajeCita({ motivo, dia, franja, prendas = [], nombre = '' }) {
  const lineas = [`Hola Daniela! Quiero coordinar una visita al showroom${nombre ? `. Soy ${nombre}` : ''}.`];
  if (motivo) lineas.push(`• Para: ${MOTIVOS_TXT[motivo]}`);
  if (dia) lineas.push(`• Día: ${fechaLarga(dia)}${franja ? `, ${FRANJAS_TXT[franja]}` : ''}`);
  else if (franja) lineas.push(`• Franja: ${FRANJAS_TXT[franja]}`);
  if (prendas.length) lineas.push(`• Prendas para tener listas: ${prendas.join(', ')}`);
  lineas.push('¿Me confirmás el horario y la dirección?');
  return lineas.join('\n');
}
function initCita() {
  const sec = document.getElementById('cita');
  if (!sec) return;
  const diasBox = sec.querySelector('[data-c-dias]');
  const mes = sec.querySelector('[data-c-mes]');
  const lista = sec.querySelector('[data-c-probar]');
  const vacio = sec.querySelector('[data-c-probar-vacio]');
  const nombre = sec.querySelector('[data-c-nombre]');
  const resumen = sec.querySelector('[data-c-resumen]');
  const enviar = sec.querySelector('[data-c-enviar]');
  const aviso = sec.querySelector('[data-c-aviso]');
  const dias = proximosDias();
  const est = { motivo: '', dia: '', franja: '' };
  const meses = [...new Set(dias.map(d => fmtMes.format(d)))];
  mes.textContent = meses.join(' y ');
  diasBox.innerHTML = dias.map(d => `<button type="button" class="dia" data-c-dia="${isoDia(d)}" aria-pressed="false" aria-label="${esc(fechaLarga(d))}"><small>${esc(fmtCorto.format(d).replace('.', ''))}</small><b>${d.getDate()}</b></button>`).join('');
  const params = new URLSearchParams(location.search);
  const probarUrl = params.get('probar');
  if (probarUrl) { Probar.add(probarUrl); setParam('probar', null); }
  const pintar = () => {
    sec.querySelectorAll('[data-c-motivo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cMotivo === est.motivo)));
    sec.querySelectorAll('[data-c-dia]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cDia === est.dia)));
    sec.querySelectorAll('[data-c-franja]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cFranja === est.franja)));
    const ids = Probar.get();
    lista.hidden = !ids.length;
    vacio.hidden = ids.length > 0;
    lista.innerHTML = ids.map(id => { const p = getProducto(id); return `<li><img src="${esc(p.imgs[0].src)}" alt="" width="40" height="40"><span>${esc(p.nombre)}</span><button type="button" data-c-quitar="${esc(id)}" aria-label="Quitar ${esc(p.nombre)} de la cita">${ICO.x}</button></li>`; }).join('');
    const dia = dias.find(d => isoDia(d) === est.dia);
    const prendas = ids.map(id => getProducto(id).nombre);
    const partes = [];
    if (est.motivo) partes.push(MOTIVOS_TXT[est.motivo]);
    if (dia) partes.push(fechaLarga(dia));
    if (est.franja) partes.push(FRANJAS_TXT[est.franja]);
    if (prendas.length) partes.push(`${prendas.length} ${prendas.length === 1 ? 'prenda' : 'prendas'} para probarte`);
    resumen.textContent = partes.length ? partes.join(' · ') : 'Elegí qué querés hacer, el día y la franja.';
    sec.classList.toggle('cita--lista', !!(est.motivo && dia && est.franja));
    enviar.href = wspHref(mensajeCita({ motivo: est.motivo, dia, franja: est.franja, prendas, nombre: nombre.value.trim().slice(0, 40) }));
    if (est.motivo && dia && est.franja) aviso.hidden = true;
  };
  sec.addEventListener('click', e => {
    const m = e.target.closest('[data-c-motivo]');
    if (m) { est.motivo = m.dataset.cMotivo; pintar(); return; }
    const d = e.target.closest('[data-c-dia]');
    if (d) { est.dia = d.dataset.cDia; pintar(); return; }
    const f = e.target.closest('[data-c-franja]');
    if (f) { est.franja = f.dataset.cFranja; pintar(); return; }
    const q = e.target.closest('[data-c-quitar]');
    if (q) { Probar.remove(q.dataset.cQuitar); return; }
  });
  enviar.addEventListener('click', e => {
    const falta = !est.motivo ? ['qué querés hacer', '[data-c-motivo]'] : !est.dia ? ['el día', '[data-c-dia]'] : !est.franja ? ['la franja', '[data-c-franja]'] : null;
    if (!falta) return;
    e.preventDefault();
    aviso.textContent = `Te falta elegir ${falta[0]} para pedir la cita.`;
    aviso.hidden = false;
    sec.querySelector(falta[1])?.focus();
  });
  nombre.addEventListener('input', pintar);
  document.addEventListener('probar:updated', pintar);
  document.querySelectorAll('[data-cita-motivo]').forEach(a => a.addEventListener('click', () => { est.motivo = a.dataset.citaMotivo; pintar(); }));
  pintar();
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
  const estilo = MODELO === '2' ? 'look' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, talle: TALLES, color: COLORES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    talle: valida(params.get('talle'), TALLES),
    color: valida(params.get('color'), COLORES),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) => {
    const sw = grupo === 'color' ? `<span class="swatch" style="--sw:${item.hex}"></span>` : '';
    return `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${sw}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  };
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (e.cat.length === 1 && solo.every(k => k === 'cat' || k === 'talle')) return `${nombreDe(CATEGORIAS, e.cat[0])}${e.talle.length === 1 ? ` en talle ${e.talle[0]}` : ''}`;
    if (solo.length === 1 && e.color.length === 1) return `Prendas en ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    if (solo.length === 1 && e.talle.length === 1) return `Prendas en talle ${e.talle[0]}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: k === 'talle' ? `Talle ${id}` : nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Toda la colección';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Colección'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'prenda' : 'prendas'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'las' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
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
  if (!hero) return;
  hero.classList.add('hero--lista');
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('.hero__espejo [data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desde('.percha', { y: -26, opacity: 0, duration: 1.3, stagger: 0.14, clearProps: 'transform,opacity' }, 0.15);
  desde('.percha [data-hero-img]', { scale: 1.08, duration: 1.8 }, 0.15);
  desde('h1', { y: 34, opacity: 0, skewY: 2.5, duration: 1.2, clearProps: 'transform' }, 0.1);
  desde('.hero-kicker', { y: 18, opacity: 0, duration: 0.9 }, 0.3);
  desde('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desde('.etiqueta', { y: -18, rotate: -9, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.75);
  desde('.hero__nota', { opacity: 0, duration: 0.8 }, 1);
}

initPreviews();
initResumenes();
initMenuCategorias();
initCita();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
