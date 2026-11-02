const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491139588923';
const MARCA = 'Vivienda los milagros';
const POR_PAGINA = 16;
const MAX_CANT = 10;
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

const CATEGORIAS = [
  { id: 'minimalistas', nombre: 'Minimalistas', uno: 'Minimalista', bajada: 'Techo plano, líneas rectas y ventanales', img: 'images/p-casa-en-l.webp' },
  { id: 'tradicionales', nombre: 'Tradicionales', uno: 'Tradicional', bajada: 'Techo a dos aguas, galería y revestimiento', img: 'images/p-casa-baranda.webp' },
  { id: 'dos-plantas', nombre: 'Dos plantas', uno: 'Dos plantas', bajada: 'Más metros en el mismo terreno', img: 'images/p-casa-dos-aguas.webp' },
];
const DORMS = [
  { id: '0', nombre: 'Monoambiente', min: 0, max: 0 },
  { id: '1', nombre: '1 dormitorio', min: 1, max: 1 },
  { id: '2', nombre: '2 dormitorios', min: 2, max: 2 },
  { id: '3', nombre: '3 o más', min: 3, max: null },
];
const SUPERFICIES = [
  { id: 'hasta45', nombre: 'Hasta 45 m²', min: null, max: 45 },
  { id: '46a70', nombre: 'De 46 a 70 m²', min: 46, max: 70 },
  { id: 'mas70', nombre: 'Más de 70 m²', min: 71, max: null },
];
const PRECIOS = [
  { id: 'hasta30', nombre: 'Hasta $30 millones', min: null, max: 30000000 },
  { id: '30a50', nombre: '$30 a $50 millones', min: 30000001, max: 50000000 },
  { id: 'mas50', nombre: 'Más de $50 millones', min: 50000001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Recomendados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'm2-asc', nombre: 'Menos metros' },
  { id: 'm2-desc', nombre: 'Más metros' },
];

const PRODUCTOS = [
  { id: 'casa-cubo', nombre: 'Casa Cubo', cat: 'minimalistas', etiqueta: 'Techo plano', rango: 1, plantas: 1, ppm2: 760000,
    img: 'images/p-casa-cubo.webp', ancho: 900, alto: 675, cuadrada: 'images/q-casa-cubo.webp', lado: 900,
    alt: 'Casa Cubo: volumen blanco de techo plano con carpinterías oscuras y entrada bajo el alero',
    desc: 'Un volumen blanco de techo plano, con carpinterías oscuras y la entrada protegida bajo el alero. Pensada para terrenos chicos o como primera vivienda.',
    claves: ['alero', 'carpinterías oscuras', 'primera vivienda'],
    opciones: [{ m2: 36, dorm: 1, banos: 1 }, { m2: 48, dorm: 2, banos: 1 }] },
  { id: 'casa-porche', nombre: 'Casa Porche', cat: 'tradicionales', etiqueta: 'Galería al frente', rango: 2, plantas: 1, ppm2: 700000,
    img: 'images/p-casa-porche.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-porche.webp', lado: 900,
    alt: 'Casa Porche: una planta con revestimiento gris claro, techo a dos aguas y galería al frente',
    desc: 'Una planta con revestimiento gris claro, techo a dos aguas y galería al frente con escalón de madera. Ventanas a los cuatro lados para una casa luminosa.',
    claves: ['porche', 'galería', 'revestimiento', 'familia'],
    opciones: [{ m2: 64, dorm: 2, banos: 1 }, { m2: 78, dorm: 3, banos: 2 }] },
  { id: 'casa-dos-aguas', nombre: 'Casa Dos Aguas', cat: 'dos-plantas', etiqueta: 'Techo de tejas', rango: 3, plantas: 2, ppm2: 740000,
    img: 'images/p-casa-dos-aguas.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-dos-aguas.webp', lado: 1000,
    alt: 'Casa Dos Aguas: dos plantas, techo de tejas oscuras y alero sobre la entrada',
    desc: 'Dos plantas con techo de tejas a dos aguas y alero sobre la entrada. Los dormitorios arriba y el estar abajo, para aprovechar el terreno.',
    claves: ['tejas', 'alero', 'dormitorios arriba'],
    opciones: [{ m2: 90, dorm: 3, banos: 2 }, { m2: 104, dorm: 4, banos: 2 }] },
  { id: 'casa-en-l', nombre: 'Casa en L', cat: 'minimalistas', etiqueta: 'Con deck', rango: 4, plantas: 1, ppm2: 760000,
    img: 'images/p-casa-en-l.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-en-l.webp', lado: 1000,
    alt: 'Casa en L: planta en forma de L con ventanales de piso a techo que dan a un deck de madera',
    desc: 'Planta en forma de L con ventanales de piso a techo que se abren a un deck de madera. El patio queda protegido entre las dos alas.',
    claves: ['deck', 'ventanales', 'patio', 'techo plano'],
    opciones: [{ m2: 60, dorm: 2, banos: 1 }, { m2: 72, dorm: 3, banos: 2 }] },
  { id: 'cabana-galeria', nombre: 'Cabaña Galería', cat: 'tradicionales', etiqueta: 'Revestimiento de madera', rango: 5, plantas: 1, ppm2: 680000,
    img: 'images/p-cabana-galeria.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-cabana-galeria.webp', lado: 1000,
    alt: 'Cabaña Galería: revestimiento de madera, techo a dos aguas y galería con baranda',
    desc: 'Revestida en madera, con techo a dos aguas y galería con baranda en todo el frente. Para casa de fin de semana o vivienda en el campo.',
    claves: ['cabaña', 'madera', 'baranda', 'campo', 'fin de semana'],
    opciones: [{ m2: 40, dorm: 1, banos: 1 }, { m2: 52, dorm: 2, banos: 1 }] },
  { id: 'casa-vertical', nombre: 'Casa Vertical', cat: 'dos-plantas', etiqueta: 'Ventanales de piso a techo', rango: 6, plantas: 2, ppm2: 790000,
    img: 'images/p-casa-vertical.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-vertical.webp', lado: 1000,
    alt: 'Casa Vertical: dos plantas en blanco y gris oscuro con ventanales de piso a techo',
    desc: 'Dos plantas en blanco y gris oscuro, con ventanales de piso a techo en el estar y alero sobre la puerta. La más grande del catálogo.',
    claves: ['moderna', 'ventanales', 'techo plano', 'alero'],
    opciones: [{ m2: 98, dorm: 3, banos: 2 }, { m2: 115, dorm: 4, banos: 3 }] },
  { id: 'casa-liston', nombre: 'Casa Listón', cat: 'minimalistas', etiqueta: 'Detalles en madera', rango: 7, plantas: 1, ppm2: 780000,
    img: 'images/p-casa-liston.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-liston.webp', lado: 1000,
    alt: 'Casa Listón: fachada blanca de techo plano con listones de madera junto a la puerta',
    desc: 'Fachada blanca de techo plano con listones de madera que enmarcan la puerta y las esquinas. Ventanal amplio en el estar.',
    claves: ['listones', 'madera', 'techo plano', 'ventanal'],
    opciones: [{ m2: 48, dorm: 2, banos: 1 }, { m2: 60, dorm: 3, banos: 1 }] },
  { id: 'casa-baranda', nombre: 'Casa Baranda', cat: 'tradicionales', etiqueta: 'Porche con baranda', rango: 8, plantas: 1, ppm2: 700000,
    img: 'images/p-casa-baranda.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-baranda.webp', lado: 1000,
    alt: 'Casa Baranda: casa chica color crema con techo a dos aguas y porche con baranda blanca',
    desc: 'Casa chica color crema, con techo a dos aguas y porche de entrada con baranda blanca. Para empezar o para sumar en el fondo del terreno.',
    claves: ['crema', 'porche', 'baranda', 'chica'],
    opciones: [{ m2: 32, dorm: 1, banos: 1 }, { m2: 42, dorm: 2, banos: 1 }] },
  { id: 'casa-pergola', nombre: 'Casa Pérgola', cat: 'minimalistas', etiqueta: 'Pérgola de madera', rango: 9, plantas: 1, ppm2: 760000,
    img: 'images/p-casa-pergola.webp', ancho: 1200, alto: 900, cuadrada: 'images/q-casa-pergola.webp', lado: 1000,
    alt: 'Casa Pérgola: módulo gris de techo plano con pérgola y deck de madera en la entrada',
    desc: 'Módulo gris de techo plano con pérgola y deck de madera en la entrada. Funciona como monoambiente, estudio o casa de huéspedes.',
    claves: ['pérgola', 'deck', 'monoambiente', 'estudio', 'huéspedes'],
    opciones: [{ m2: 30, dorm: 0, banos: 1 }, { m2: 42, dorm: 1, banos: 1 }] },
];

const redondear = n => Math.round(n / 10000) * 10000;
const dormCorto = d => (d === 0 ? 'monoambiente' : `${d} dorm.`);
const dormLargo = d => (d === 0 ? 'Monoambiente' : d === 1 ? '1 dormitorio' : `${d} dormitorios`);
const leerOpcion = (p, v) => p.opciones.find(o => String(o.m2) === String(v)) || p.opciones[0];
const precioOpcion = (p, o) => redondear(o.m2 * p.ppm2);
const precioConfig = (p, v) => precioOpcion(p, leerOpcion(p, v));
const textoOpcion = o => `${o.m2} m² · ${dormCorto(o.dorm)}`;
const textoConfig = (p, v) => textoOpcion(leerOpcion(p, v));
function prepararProducto(p) {
  const precios = p.opciones.map(o => precioOpcion(p, o));
  const m2 = p.opciones.map(o => o.m2);
  const d = p.opciones.map(o => o.dorm);
  return { ...p, descuento: 0, precio: Math.min(...precios), m2Min: Math.min(...m2), m2Max: Math.max(...m2), dormMin: Math.min(...d), dormMax: Math.max(...d) };
}
const rangoM2 = p => (p.m2Min === p.m2Max ? `${p.m2Min}` : `${p.m2Min}–${p.m2Max}`);
function rangoDorm(p) {
  if (p.dormMin === p.dormMax) return dormLargo(p.dormMin).toLowerCase();
  if (p.dormMin === 0) return `monoambiente o ${dormLargo(p.dormMax)}`;
  return `${p.dormMin} a ${p.dormMax} dorm.`;
}
const specDe = p => `${rangoM2(p)} m² · ${rangoDorm(p)}`;

const Tienda = crearTienda(PRODUCTOS.map(prepararProducto), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, nombreCat(p.cat), ...(p.claves || []),
    p.plantas === 2 ? 'dos plantas' : 'una planta',
    ...p.opciones.map(o => `${o.m2} m2 ${o.m2}m2 ${dormLargo(o.dorm)} ${o.banos} ${o.banos === 1 ? 'baño' : 'baños'}`),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const enRango = (n, r) => (r.min == null || n >= r.min) && (r.max == null || n <= r.max);

  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    const dorm = lista(f.dorm).map(id => DORMS.find(d => d.id === id)).filter(Boolean);
    const sup = lista(f.sup).map(id => SUPERFICIES.find(s => s.id === id)).filter(Boolean);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (dorm.length && !p.opciones.some(o => dorm.some(r => enRango(o.dorm, r)))) return false;
    if (sup.length && !p.opciones.some(o => sup.some(r => enRango(o.m2, r)))) return false;
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
      case 'm2-asc': return (a, b) => a.m2Min - b.m2Min || desempate(a, b);
      case 'm2-desc': return (a, b) => b.m2Max - a.m2Max || desempate(a, b);
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
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'viviendalosmilagros_seleccion',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const op = String(leerOpcion(producto, v).m2);
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
  linea(i) { const p = getProducto(i.id); return p ? precioConfig(p, i.v) * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = String(leerOpcion(p, i.v).m2);
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, i.qty || 1)); changed = true; }
      return true;
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
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

const catDe = p => CATEGORIAS.find(c => c.id === p.cat);
function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const uno = catDe(p)?.uno || '';
  const precio = `<p class="precio"><small>Desde</small> ${formatearPrecio(precioFinal(p))}</p>`;
  const sumarLbl = `Sumar ${esc(p.nombre)} a tu selección`;
  if (estilo === 'vitrina') {
    return `<article class="prod prod--vitrina" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media" data-qv="${esc(p.id)}"><img src="${esc(p.cuadrada)}" alt="${esc(p.alt)}" width="${p.lado}" height="${p.lado}" decoding="async"></div>
  <span class="prod__badge">${esc(p.etiqueta)}</span>
  <button type="button" class="prod__sumar" data-sumar="${esc(p.id)}" aria-label="${sumarLbl}">${ICO.mas}</button>
  <div class="prod__ticket"><p class="prod__cat">${esc(uno)} · ${esc(rangoM2(p))} m²</p><h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3><p class="prod__spec">${esc(rangoDorm(p))}</p>${precio}</div>
</article>`;
  }
  return `<article class="prod prod--ficha" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media" data-qv="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="${p.ancho}" height="${p.alto}" decoding="async"></div>
  <span class="prod__badge">${esc(p.etiqueta)}</span>
  <div class="prod__info">
    <p class="prod__cat">${esc(uno)}</p>
    <h3 class="prod__nombre">${esc(p.nombre)}</h3>
    <p class="prod__spec">${esc(specDe(p))}</p>
    ${precio}
    <div class="prod__acc"><button type="button" class="btn btn--tinta btn--sm prod__ver" data-qv="${esc(p.id)}">Ver ficha</button><button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="${sumarLbl}">${ICO.mas}<span>Sumar</span></button></div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir tu selección, ${n} ${n === 1 ? 'modelo' : 'modelos'}` : 'Abrir tu selección'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty > 1 ? `${i.qty} × ` : ''}${p.nombre} (${textoConfig(p, i.v)}) — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola! Quiero consultar por estos modelos de ${MARCA}:\n${lineas.join('\n')}\nTotal de referencia: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k, conStepper) {
  const p = getProducto(i.id);
  if (!p) return '';
  const clave = esc(claveLinea(i.id, i.v));
  const stepper = conStepper
    ? `<div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una unidad"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una unidad"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div>`
    : (i.qty > 1 ? `<span class="linea__cant">× ${i.qty}</span>` : '');
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="${p.ancho}" height="${p.alto}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoConfig(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom">${stepper}<p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
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
    cuenta.textContent = n ? `${n} ${n === 1 ? 'modelo' : 'modelos'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k, true)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function initSeleccion() {
  const lista = document.querySelector('[data-sel-lista]');
  if (!lista) return;
  const vacio = document.querySelector('[data-sel-vacio]');
  const pie = document.querySelector('[data-sel-pie]');
  const total = document.querySelector('[data-sel-total]');
  const wsp = document.querySelector('[data-sel-wsp]');
  const pintar = () => {
    const items = Cart.get();
    lista.hidden = !items.length;
    vacio.hidden = items.length > 0;
    pie.hidden = !items.length;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k, false)).join('');
    total.textContent = formatearPrecio(Cart.total());
    wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function sumar(id, v = '', qty = 1) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, qty, v);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en tu selección`); return 0; }
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre} (${textoConfig(p, v)}) a tu selección`);
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) { e.preventDefault(); sumar(s.dataset.sumar, s.dataset.v || ''); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv, { v: qv.dataset.v || '' }); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: String(leerOpcion(p, v).m2), qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const ops = p.opciones.map(o => `<button type="button" class="chip chip--op" data-qv-op="${o.m2}" aria-pressed="false"><b>${o.m2} m²</b><small>${esc(dormLargo(o.dorm))}</small></button>`).join('');
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="${p.ancho}" height="${p.alto}"></div>
    <div class="qv__chapa" aria-hidden="true"><b data-qv-m2></b><span>m²</span><small data-qv-chapa></small></div>
  </div>
  <div class="qv__info">
    <p class="prod__cat">${esc(catDe(p)?.uno || '')} · ${esc(p.etiqueta)}</p>
    <h2>${esc(p.nombre)}</h2>
    <div class="qv__precio"><p class="precio" data-qv-precio></p><p class="qv__nota" data-qv-nota></p></div>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__var"><p>Superficie: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="Superficie">${ops}</div></div>
    <dl class="qv__datos" data-qv-datos></dl>
    <div class="qv__acciones">
      <div class="stepper" title="Unidades"><button type="button" data-qv-paso="-1" aria-label="Restar una unidad" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Sumar a mi selección</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Elegir este modelo</button>
    </div>
    <a class="qv__wsp" href="${wspHref(`Hola! Quiero consultar por la ${p.nombre}.`)}" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar este modelo por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="${r.ancho}" height="${r.alto}"><span>${esc(r.nombre)}</span><small>${esc(rangoM2(r))} m² · desde ${formatearPrecio(precioFinal(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  const o = leerOpcion(p, qvEstado.v);
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === String(o.m2))));
  modal.querySelector('[data-qv-elegida]').textContent = textoOpcion(o);
  const unidad = precioOpcion(p, o);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(unidad * qvEstado.qty);
  modal.querySelector('[data-qv-nota]').textContent = `Precio de referencia${qvEstado.qty > 1 ? ` por ${qvEstado.qty} unidades` : ''} para ${o.m2} m². Qué incluye y los plazos te los confirmamos por WhatsApp.`;
  modal.querySelector('[data-qv-m2]').textContent = o.m2;
  modal.querySelector('[data-qv-chapa]').textContent = `${dormLargo(o.dorm)} · ${o.banos} ${o.banos === 1 ? 'baño' : 'baños'}`;
  const datos = [
    ['Superficie', `${o.m2} m² cubiertos`],
    ['Dormitorios', o.dorm === 0 ? 'Monoambiente' : String(o.dorm)],
    ['Baños', String(o.banos)],
    ['Plantas', p.plantas === 2 ? 'Dos' : 'Una'],
    ['Estilo', catDe(p)?.uno || ''],
  ];
  modal.querySelector('[data-qv-datos]').innerHTML = datos.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por la ${p.nombre} de ${textoOpcion(o)}${qvEstado.qty > 1 ? ` (${qvEstado.qty} unidades)` : ''}.`);
  ponerJsonLdProducto(p, unidad);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const op = e.target.closest('[data-qv-op]');
    if (op) { qvEstado.v = op.dataset.qvOp; pintarQv(); return; }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en tu selección`); return; }
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}${p.nombre} (${textoConfig(p, qvEstado.v)}) a tu selección`);
    }
  });
}

function ponerJsonLdProducto(p, precio) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precio, availability: 'https://schema.org/MadeToOrder' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1181px)');
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
  const actual = (new URLSearchParams(location.search).get('cat') || '').split(',');
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && actual.length === 1 && actual[0] === c.id ? ' aria-current="page"' : '';
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur}><img src="${esc(c.img)}" alt="" width="1200" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1181px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1181px)');
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
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.textContent = `${r.n} ${r.n === 1 ? 'modelo' : 'modelos'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-desde]').forEach(el => {
    const p = getProducto(el.dataset.desde);
    if (p) el.textContent = `Desde ${formatearPrecio(precioFinal(p))}`;
  });
  document.querySelectorAll('[data-m2-rango]').forEach(el => {
    const p = getProducto(el.dataset.m2Rango);
    if (p) el.textContent = rangoM2(p);
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
    const pintar = (cat = '') => {
      const prods = cat ? Tienda.consultar({ filtros: { cat }, limite: ids.length }).items : productosPorIds(ids);
      cont.innerHTML = prods.map(p => cardHTML(p, 'ficha')).join('');
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
  document.querySelectorAll('[data-rail]').forEach(track => {
    track.innerHTML = productosPorIds(idsDe(track, 'data-rail')).map(p => `<div class="rail-item"><div data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, 'vitrina', false)}</div></div>`).join('');
  });
}

const GUIA_PERSONAS = {
  chica: { dorm: ['0', '1'], txt: '1 o 2 personas', dormTxt: 'monoambiente o 1 dormitorio', ok: d => d <= 1 },
  familia: { dorm: ['2'], txt: '3 o 4 personas', dormTxt: '2 dormitorios', ok: d => d === 2 },
  grande: { dorm: ['3'], txt: '5 o más personas', dormTxt: '3 dormitorios o más', ok: d => d >= 3 },
};
const GUIA_PLANTAS = { '': { cat: [], txt: '' }, 1: { cat: ['minimalistas', 'tradicionales'], txt: 'de una planta' }, 2: { cat: ['dos-plantas'], txt: 'de dos plantas' } };
function guiaFilas(per, pla) {
  const g = GUIA_PERSONAS[per] || GUIA_PERSONAS.familia;
  const pl = GUIA_PLANTAS[pla] || GUIA_PLANTAS[''];
  const filtros = { dorm: g.dorm, ...(pl.cat.length ? { cat: pl.cat } : {}) };
  const prods = Tienda.consultar({ filtros, limite: 100 }).items;
  const filas = prods.flatMap(p => p.opciones.filter(o => g.ok(o.dorm)).map(o => ({ p, o, precio: precioOpcion(p, o) })));
  filas.sort((a, b) => a.precio - b.precio || a.p.id.localeCompare(b.p.id));
  return { filas, modelos: prods.length, filtros, g, pl };
}
function initGuia() {
  const sec = document.getElementById('guia');
  if (!sec) return;
  const lista = sec.querySelector('[data-g-lista]');
  const cuenta = sec.querySelector('[data-g-cuenta]');
  const ver = sec.querySelector('[data-g-ver]');
  const wsp = sec.querySelector('[data-g-wsp]');
  let per = sec.querySelector('[data-g-per][aria-pressed="true"]')?.dataset.gPer || 'familia';
  let pla = sec.querySelector('[data-g-pla][aria-pressed="true"]')?.dataset.gPla || '';
  const pintar = (animar = false) => {
    const { filas, modelos, filtros, g, pl } = guiaFilas(per, pla);
    const vis = filas.slice(0, 4);
    cuenta.innerHTML = filas.length
      ? `<b>${modelos} ${modelos === 1 ? 'modelo' : 'modelos'}</b>${pl.txt ? ` ${esc(pl.txt)}` : ''} con ${esc(g.dormTxt)}`
      : `<b>Sin modelos</b> ${esc(pl.txt)} con ${esc(g.dormTxt)}`;
    const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(22px)"' : '';
    lista.innerHTML = vis.length ? vis.map(({ p, o, precio }) => `<li class="gfila"${anim}>
  <button type="button" class="gfila__ver" data-qv="${esc(p.id)}" data-v="${o.m2}"><img src="${esc(p.img)}" alt="" width="${p.ancho}" height="${p.alto}"><span class="gfila__txt"><b>${esc(p.nombre)}</b><small>${esc(textoOpcion(o))} · ${o.banos} ${o.banos === 1 ? 'baño' : 'baños'}</small></span><span class="gfila__precio">${formatearPrecio(precio)}</span><span class="gfila__ir" aria-hidden="true">${ICO.flecha}</span></button>
</li>`).join('') : `<li class="gfila gfila--vacia"${anim}><p>Para esa cantidad de personas te conviene una casa de una planta. Probá con «Me da igual» o consultanos tu caso.</p></li>`;
    const u = new URLSearchParams();
    if (filtros.cat) u.set('cat', filtros.cat.join(','));
    u.set('dorm', filtros.dorm.join(','));
    ver.href = `${CATALOGO_URL}?${u.toString().replace(/%2C/g, ',')}`;
    ver.hidden = !filas.length;
    wsp.href = wspHref(`Hola! Busco una casa para ${g.txt} (${g.dormTxt})${pl.txt ? `, ${pl.txt}` : ''}. ¿Qué modelo me recomiendan?`);
    if (animar) revelarNuevos(lista);
  };
  sec.addEventListener('click', e => {
    const a = e.target.closest('[data-g-per]');
    const b = e.target.closest('[data-g-pla]');
    if (!a && !b) return;
    if (a) { per = a.dataset.gPer; sec.querySelectorAll('[data-g-per]').forEach(x => x.setAttribute('aria-pressed', String(x === a))); }
    if (b) { pla = b.dataset.gPla; sec.querySelectorAll('[data-g-pla]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }
    pintar(true);
  });
  pintar(false);
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
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    dorm: valida(params.get('dorm'), DORMS),
    sup: valida(params.get('sup'), SUPERFICIES),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'dorm' && e.dorm.length) f.dorm = e.dorm;
    if (sin !== 'sup' && e.sup.length) f.sup = e.sup;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) =>
    `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cats]').innerHTML = CATEGORIAS.map(c => opcion('checkbox', 'cat', c, e.cat.includes(c.id), Tienda.contar({ ...filtros('cat'), cat: c.id }))).join('');
    panel.querySelector('[data-f-dorm]').innerHTML = DORMS.map(d => opcion('checkbox', 'dorm', d, e.dorm.includes(d.id), Tienda.contar({ ...filtros('dorm'), dorm: d.id }))).join('');
    panel.querySelector('[data-f-sup]').innerHTML = SUPERFICIES.map(s => opcion('checkbox', 'sup', s, e.sup.includes(s.id), Tienda.contar({ ...filtros('sup'), sup: s.id }))).join('');
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.cat.length === 2 && e.cat.every(c => c !== 'dos-plantas')) return 'Una planta';
    if (!e.cat.length && e.dorm.length === 1) return `Con ${nombreDe(DORMS, e.dorm[0]).toLowerCase()}`;
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...e.dorm.map(id => ({ k: 'dorm', id, t: nombreDe(DORMS, id) })),
      ...e.sup.map(id => ({ k: 'sup', id, t: nombreDe(SUPERFICIES, id) })),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = e.cat.length + e.dorm.length + e.sup.length + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todos los modelos';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    setParam('cat', e.cat); setParam('dorm', e.dorm); setParam('sup', e.sup); setParam('precio', e.precio); setParam('q', e.q);
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
  const limpiar = () => { e.cat = []; e.dorm = []; e.sup = []; e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (k === 'cat' || k === 'dorm' || k === 'sup') e[k] = e[k].filter(x => x !== v);
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

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
  const flechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (vp.dataset.arrastrado === '1') { e.preventDefault(); e.stopPropagation(); } }, true);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  const marco = hero.querySelector('[data-hero-plano]');
  if (marco) {
    const plano = document.createElement('span');
    plano.className = 'hero__plano';
    plano.setAttribute('aria-hidden', 'true');
    marco.appendChild(plano);
    tl.fromTo(plano, { clipPath: 'polygon(0% 0%, 130% 0%, 130% 100%, -30% 100%)' }, { clipPath: 'polygon(130% 0%, 130% 0%, 130% 100%, 100% 100%)', duration: 1.4, ease: 'power3.inOut', onComplete: () => plano.remove() }, 0.15);
  }
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-badge', { y: 14, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
  desde('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.85);
  desde('.hero-ficha', { y: 24, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 1);
}

initPreviews();
initResumenes();
initMenuCategorias();
initGuia();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initSeleccion();
initVistaRapida();
initCompras();
initRail();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
