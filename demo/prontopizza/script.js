const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493444406749';
const POR_PAGINA = 16;
const UMBRAL = 5000;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'pizzas', nombre: 'Prepizzas y pizzetas', bajada: 'Con salsa, para agregarles lo tuyo' },
  { id: 'prelistas', nombre: 'Prelistas', bajada: 'Con muzzarella, directo al horno' },
  { id: 'empanadas', nombre: 'Empanadas', bajada: 'Crudas y congeladas, por media docena' },
  { id: 'tartas', nombre: 'Tartas', bajada: 'Medias tartas e individuales, en crudo' },
];
const FORMATOS = [
  { id: 'grande', nombre: 'Grande' },
  { id: 'individual', nombre: 'Individual' },
  { id: 'docena', nombre: 'Por media docena' },
];
const VIENE = [
  { id: 'horno', nombre: 'Lista para el horno' },
  { id: 'agregar', nombre: 'Para agregarle lo tuyo' },
];
const PRECIOS = [
  { id: 'menos5', nombre: 'Menos de $5.000', min: null, max: UMBRAL - 1 },
  { id: 'mas5', nombre: 'Desde $5.000', min: UMBRAL, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];

const GUIA = {
  prepizza: { nombre: 'Prepizza con salsa', prod: 'prepizza-grande', temp: '220 °C', min: [8, 10], timer: 9, desc: 'No hace falta', tip: 'Sumale la muzzarella y lo que quieras arriba antes de meterla al horno.' },
  prelista: { nombre: 'Prelista grande', prod: 'prelista-grande', temp: '220 °C', min: [12, 15], timer: 13, desc: 'No hace falta', tip: 'Directo del freezer a la placa: está lista cuando la muzzarella burbujea y el borde se dora.' },
  pizzetas: { nombre: 'Pizzetas', prod: 'pizzetas-x6', temp: '220 °C', min: [7, 9], timer: 8, desc: 'No hace falta', tip: 'Agregales queso o lo que quieras: como son chicas, se cocinan rápido.' },
  empanadas: { nombre: 'Empanadas crudas', prod: 'empanadas-x6', temp: '200 °C', min: [20, 25], timer: 22, desc: 'No: van congeladas', tip: 'Directo del freezer a la placa. Si las querés bien doradas, pincelalas con huevo batido.' },
  'media-tarta': { nombre: 'Media tarta', prod: 'media-tarta', temp: '190 °C', min: [35, 40], timer: 38, desc: 'No hace falta', tip: 'En la rejilla del medio, hasta que el borde de la masa esté dorado.' },
  'tarta-individual': { nombre: 'Tarta individual', prod: 'tarta-individual', temp: '190 °C', min: [25, 30], timer: 28, desc: 'No hace falta', tip: 'Está lista cuando la masa se dora y el relleno queda firme.' },
};

const Tienda = crearTienda([
  { id: 'prepizza-grande', nombre: 'Prepizza grande con salsa', cat: 'pizzas', formato: 'grande', viene: 'agregar', unidad: 'Unidad', precio: 2900, rango: 1, guia: 'prepizza',
    img: 'images/prepizza-salsa.webp', ancho: 900, alto: 1600, pos: '50% 49%', alt: 'Prepizza grande con salsa de tomate sobre la mesada enharinada',
    corto: 'Masa con salsa de tomate, para sumarle lo tuyo',
    desc: 'Prepizza grande de elaboración propia, con salsa de tomate. Le agregás la muzzarella y lo que quieras arriba, y va directo al horno.',
    tags: 'pizza masa salsa tomate grande',
    datos: [['Viene', 'Masa con salsa de tomate'], ['Tamaño', 'Grande'], ['Conservación', 'En freezer']] },
  { id: 'prelista-grande', nombre: 'Prelista grande de muzzarella', cat: 'prelistas', formato: 'grande', viene: 'horno', unidad: 'Unidad', precio: 6900, rango: 2, guia: 'prelista',
    img: 'images/prelista-grande.webp', ancho: 1200, alto: 1200, alt: 'Prelista grande con salsa y muzzarella rallada, cruda',
    galeria: [{ src: 'images/prelista-grande-2.webp', ancho: 1200, alto: 1200, alt: 'La prelista grande de muzzarella vista de costado' }],
    corto: 'Salsa y muzzarella, lista para gratinar',
    desc: 'Prelista grande con salsa de tomate y muzzarella rallada. Va directo del freezer al horno y en unos minutos tenés la pizza en la mesa.',
    tags: 'pizza muzza muzzarella queso grande lista',
    datos: [['Viene', 'Salsa de tomate y muzzarella'], ['Tamaño', 'Grande'], ['Conservación', 'En freezer']] },
  { id: 'empanadas-x6', nombre: 'Empanadas artesanales crudas x6', cat: 'empanadas', formato: 'docena', viene: 'horno', unidad: 'Media docena', precio: 7500, rango: 3, guia: 'empanadas',
    img: 'images/empanadas-crudas.webp', ancho: 1200, alto: 1200, alt: 'Bandeja con seis empanadas crudas de repulgue',
    galeria: [{ src: 'images/etiquetas-empanadas.webp', ancho: 718, alto: 470, alt: 'Etiquetas de las empanadas de carne, pollo y jamón y queso' }],
    variantes: [
      { id: 'carne', nombre: 'Carne', img: 'images/etiqueta-carne.webp', ancho: 245, alto: 470 },
      { id: 'pollo', nombre: 'Pollo', img: 'images/etiqueta-pollo.webp', ancho: 240, alto: 470 },
      { id: 'jyq', nombre: 'Jamón y queso', img: 'images/etiqueta-jyq.webp', ancho: 242, alto: 470 },
    ],
    corto: 'Carne, pollo o jamón y queso, crudas y congeladas',
    desc: 'Empanadas artesanales de elaboración propia, crudas y congeladas, por media docena. Cada paquete es de un sabor y sale con su etiqueta: contenido, fecha de elaboración y cómo conservarlas.',
    tags: 'empanada empanadas carne pollo jamon queso congeladas crudas media docena repulgue',
    datos: [['Contenido', '6 unidades'], ['Sabores', 'Carne, pollo, jamón y queso'], ['Conservación', 'En freezer a -18 °C']] },
  { id: 'media-tarta', nombre: 'Media tarta de tomate, muzzarella y aceitunas', cat: 'tartas', formato: 'grande', viene: 'horno', unidad: 'Media tarta', precio: 6500, rango: 4, guia: 'media-tarta',
    img: 'images/media-tarta.webp', ancho: 1200, alto: 1200, alt: 'Media tarta cruda de tomate, muzzarella y aceitunas en bandeja de aluminio',
    corto: 'En crudo, en su bandeja de aluminio',
    desc: 'Media tarta en crudo con rodajas de tomate, muzzarella, aceitunas y orégano. Viene en su bandeja de aluminio, lista para ir al horno.',
    tags: 'tarta tomate muzzarella aceitunas caprese cruda media',
    datos: [['Viene', 'En crudo, en bandeja de aluminio'], ['Relleno', 'Tomate, muzzarella y aceitunas'], ['Conservación', 'En freezer']] },
  { id: 'prepizzas-x3', nombre: 'Prepizzas grandes con salsa x3', cat: 'pizzas', formato: 'grande', viene: 'agregar', unidad: 'Pack x3', precio: 7900, rango: 5, guia: 'prepizza',
    img: 'images/prepizzas-x3.webp', ancho: 1200, alto: 1200, alt: 'Tres prepizzas grandes con salsa de tomate, apiladas',
    corto: 'Tres prepizzas para tener en el freezer',
    desc: 'Tres prepizzas grandes con salsa de tomate. Las guardás en el freezer y armás la pizza cuando quieras, con lo que tengas a mano.',
    tags: 'pizza pack tres masa salsa tomate grande',
    datos: [['Contenido', '3 prepizzas grandes'], ['Viene', 'Masa con salsa de tomate'], ['Conservación', 'En freezer']] },
  { id: 'tarta-individual', nombre: 'Tarta individual de jamón, queso y champiñones', cat: 'tartas', formato: 'individual', viene: 'horno', unidad: 'Unidad', precio: 3400, rango: 6, guia: 'tarta-individual',
    img: 'images/tarta-individual.webp', ancho: 1200, alto: 1200, alt: 'Tarta individual cruda de jamón, queso y champiñones con perejil',
    corto: 'Una porción, en crudo',
    desc: 'Tarta individual en crudo de jamón, queso, champiñones y perejil. Justa para una persona: del freezer al horno.',
    tags: 'tarta jamon queso champiñones hongos individual cruda',
    datos: [['Viene', 'En crudo'], ['Relleno', 'Jamón, queso y champiñones'], ['Conservación', 'En freezer']] },
  { id: 'pizzetas-x6', nombre: 'Pizzetas con salsa x6', cat: 'pizzas', formato: 'individual', viene: 'agregar', unidad: 'Pack x6', precio: 4800, rango: 7, guia: 'pizzetas',
    img: 'images/pizzetas-salsa.webp', ancho: 1600, alto: 900, pos: '52% 50%', alt: 'Seis pizzetas con salsa de tomate y orégano',
    corto: 'Seis pizzetas con salsa, para cumpleaños o la picada',
    desc: 'Seis pizzetas de elaboración propia con salsa de tomate y orégano. Les ponés queso o lo que quieras y salen en pocos minutos.',
    tags: 'pizzeta pizzetas chicas individual salsa tomate oregano cumple',
    datos: [['Contenido', '6 pizzetas'], ['Viene', 'Masa con salsa de tomate'], ['Conservación', 'En freezer']] },
  { id: 'prelistas-individuales-x6', nombre: 'Prelistas individuales x6', cat: 'prelistas', formato: 'individual', viene: 'horno', unidad: 'Caja x6', precio: 8900, descuento: 10, rango: 8, guia: 'pizzetas',
    img: 'images/prelistas-individuales.webp', ancho: 1200, alto: 1200, alt: 'Caja con seis prelistas individuales de muzzarella y orégano',
    corto: 'Seis pizzetas con muzzarella, listas para el horno',
    desc: 'Caja con seis prelistas individuales: salsa, muzzarella y orégano. Directo del freezer al horno, ideales para cumpleaños o una cena rápida.',
    tags: 'pizzeta pizzetas muzza muzzarella queso individual caja cumple lista',
    datos: [['Contenido', '6 prelistas individuales'], ['Viene', 'Salsa, muzzarella y orégano'], ['Conservación', 'En freezer']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.corto, p.tags || '', p.unidad || '', nombreDe(CATEGORIAS, p.cat), nombreDe(FORMATOS, p.formato), nombreDe(VIENE, p.viene),
    ...(p.variantes || []).map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), formato = lista(f.formato), viene = lista(f.viene), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (formato.length && !formato.includes(p.formato)) return false;
    if (viene.length && !viene.includes(p.viene)) return false;
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
    const candidatos = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = candidatos.findIndex(p => p.id === cursor);
      i = k < 0 ? candidatos.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q || !String(q).trim()) {
      items.push(...candidatos.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < candidatos.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < candidatos.length && items.length < lim) {
      const tanda = candidatos.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < candidatos.length;
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
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const formatoDe = id => FORMATOS.find(c => c.id === id) || { nombre: '' };
const varDe = (p, v) => (p?.variantes || []).find(x => x.id === v) || null;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'prontopizza_cart',
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(a)) return [];
      return a.filter(i => {
        const p = i && getProducto(i.id);
        if (!p || !(i.qty > 0)) return false;
        if (p.variantes) return !!varDe(p, i.v);
        return !i.v;
      });
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = '') {
    if (producto.variantes && !varDe(producto, v)) v = producto.variantes[0].id;
    if (!producto.variantes) v = '';
    const items = this.get();
    const k = claveLinea(producto.id, v);
    const existing = items.find(i => claveLinea(i.id, i.v) === k);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push(v ? { id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) } : { id: producto.id, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get(); const it = items.find(i => claveLinea(i.id, i.v) === k); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveLinea(i.id, i.v) !== k)); },
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
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

const svgIco = p => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  pizzas: svgIco('<path d="m12 14-1 1"/><path d="m13.75 18.25-1.25 1.42"/><path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"/><path d="M18.8 9.3a1 1 0 0 0 2.1 7.7"/><path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"/>'),
  prelistas: svgIco('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  empanadas: svgIco('<path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07 19.07 4.93"/><path d="m9 4 3 2 3-2M9 20l3-2 3 2M4 9l2 3-2 3M20 9l-2 3 2 3"/>'),
  tartas: svgIco('<path d="M16 13H3"/><path d="M16 17H3"/><path d="m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6"/><circle cx="9" cy="7" r="2"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  check: svgIco('<path d="M20 6 9 17l-5-5"/>'),
  flecha: svgIco('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  llama: svgIco('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  sabor: svgIco('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1"/>'),
};
const CARRITO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p) {
  const desc = p.descuento > 0;
  return `<span class="precio${desc ? ' precio--desc' : ''}"><b>${formatearPrecio(precioFinal(p))}</b>${desc ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>`;
}
const fotoHTML = (p, alt = true) => `<img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${alt ? esc(p.alt) : ''}"${p.pos ? ` style="object-position:${p.pos}"` : ''}>`;
function badgesHTML(p) {
  const b = [`<span class="badge badge--unidad">${esc(p.unidad)}</span>`];
  if (p.descuento > 0) b.push(`<span class="badge badge--desc">-${p.descuento}%</span>`);
  return `<span class="badges">${b.join('')}</span>`;
}
const accionAgregar = (p, clase, conTexto = true) => (p.variantes
  ? `<button type="button" class="${clase} btn--sabor" data-quick="${p.id}" aria-label="Elegir el sabor de ${esc(p.nombre)}">${ICO.sabor}${conTexto ? '<span>Elegir sabor</span>' : ''}</button>`
  : `<button type="button" class="${clase}" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${CARRITO_SVG}${conTexto ? '<span>Agregar</span>' : ''}</button>`);

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const sabores = p.variantes ? `<p class="card__sabores">${p.variantes.map(v => esc(v.nombre)).join(' · ')}</p>` : `<p class="card__sabores">${esc(p.corto)}</p>`;
  return `<article class="card"${anim} data-card="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${fotoHTML(p)}
      ${badgesHTML(p)}
    </button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)}</p>
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${sabores}
      ${precioHTML(p)}
      <div class="prod-actions">
        ${p.variantes ? '' : `<div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>`}
        ${accionAgregar(p, 'btn btn--cta prod-add')}
      </div>
      <button type="button" class="prod-buy" data-${p.variantes ? 'quick' : 'buy'}="${p.id}">Comprar ahora ${ICO.flecha}</button>
    </div>
  </article>`;
}

function vcardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  return `<article class="vcard"${anim} data-card="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}${badgesHTML(p)}</button>
    <div class="vcard__info">
      <p class="vcard__cat">${ICO[p.cat] || ''}${esc(catDe(p.cat).nombre)}</p>
      <h3 class="vcard__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <div class="vcard__pie">
        ${precioHTML(p)}
        ${p.variantes ? `<button type="button" class="vcard__add" data-quick="${p.id}" aria-label="Elegir el sabor de ${esc(p.nombre)}">${ICO.sabor}</button>` : `<button type="button" class="vcard__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>`}
      </div>
    </div>
  </article>`;
}

function filaHTML(p) {
  const sabores = p.variantes ? `<span class="fila__sabores">${p.variantes.map(v => esc(v.nombre)).join(' · ')}</span>` : '';
  return `<article class="fila" data-animate="der" style="opacity:0;transform:translateX(48px)" data-card="${p.id}">
    <button type="button" class="fila__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p, false)}</button>
    <div class="fila__info">
      <h4 class="fila__nombre"><button type="button" data-quick="${p.id}">${esc(p.nombre)}</button></h4>
      <p class="fila__corto">${esc(p.corto)}</p>
      <p class="fila__meta"><span class="fila__unidad">${esc(p.unidad)}</span>${sabores}${p.descuento > 0 ? `<span class="fila__desc">-${p.descuento}%</span>` : ''}</p>
    </div>
    <div class="fila__pie">
      ${precioHTML(p)}
      ${p.variantes ? `<button type="button" class="fila__add fila__add--sabor" data-quick="${p.id}" aria-label="Elegir el sabor de ${esc(p.nombre)}">${ICO.sabor}<span>Sabor</span></button>` : `<button type="button" class="fila__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>`}
    </div>
  </article>`;
}
const tarjetaHTML = (p, animar = true) => (MODELO === '2' ? vcardHTML(p, animar) : cardHTML(p, animar));

let revealsListos = false;
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const tabla = hero.querySelector('.hero__tabla');
  if (tabla) tl.from(tabla, { scale: 0.9, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-kicker span'), { y: 18, opacity: 0, duration: 0.9 }, 0.38)
    .from(hero.querySelectorAll('.hero-kicker__tri'), { scaleX: 0, duration: 1, ease: 'power3.out', clearProps: 'transform' }, 0.5)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__sello'), { rotate: -30, scale: 0.8, opacity: 0, duration: 1.2, ease: 'back.out(1.8)', clearProps: 'transform,opacity,rotate,scale' }, 0.55)
    .from(hero.querySelectorAll('.hero__chip'), { x: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
  const datos = hero.querySelectorAll('.hero2__datos li');
  if (datos.length) tl.from(datos, { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const giro = document.querySelector('[data-giro]');
  if (giro) gsap.to(giro, { rotate: 28, ease: 'none', scrollTrigger: { trigger: '.hero--m1', start: 'top top', end: 'bottom top', scrub: true } });
  const foto2 = document.querySelector('.hero2__foto img');
  if (foto2 && window.matchMedia('(min-width: 769px)').matches) gsap.to(foto2, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--m2', start: 'top top', end: 'bottom top', scrub: true } });
  const baja = document.querySelector('.elab__baja');
  if (baja && window.matchMedia('(min-width: 901px)').matches) gsap.fromTo(baja, { y: -16 }, { y: 16, ease: 'none', scrollTrigger: { trigger: baja, start: 'top bottom', end: 'bottom top', scrub: true } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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
  const wrap = document.querySelector('[data-nav-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const ul = wrap.querySelector('[data-menu-cats]');
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><span class="nav-cats__ico">${ICO[c.id]}</span><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
  const mq = window.matchMedia('(min-width: 1024px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (mq.matches && hover.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (mq.matches && hover.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (mq.matches && !panel.hidden && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && mq.matches) { cerrar(); btn.focus(); } });
  wrap.addEventListener('focusout', e => { if (mq.matches && e.relatedTarget && !wrap.contains(e.relatedTarget)) cerrar(); });
  mq.addEventListener('change', cerrar);
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const capas = new Set();
function abrirCapa(el, bd) {
  if (!el) return;
  el.hidden = false; if (bd) bd.hidden = false;
  void el.offsetWidth;
  el.classList.add('open'); bd?.classList.add('open');
  capas.add(el);
  document.body.classList.add('no-scroll');
}
function cerrarCapa(el, bd) {
  if (!el || !capas.has(el)) return;
  el.classList.remove('open'); bd?.classList.remove('open');
  capas.delete(el);
  if (!capas.size) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!el.classList.contains('open')) { el.hidden = true; if (bd) bd.hidden = true; } }, 400);
}
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const nombreLinea = i => { const p = getProducto(i.id); const v = varDe(p, i.v); return v ? `${p.nombre} (${v.nombre})` : p.nombre; };
function mensajePedido() {
  const items = Cart.get();
  if (!items.length) return 'Hola! Vi la web de Pronto Pizza y quiero hacer un pedido.';
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} x ${nombreLinea(i)} (${formatearPrecio(precioFinal(p))} c/u)`; });
  return `Hola! Quiero hacer este pedido en Pronto Pizza:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}\nPara coordinar la entrega, mi dirección es: `;
}

const Drawer = {
  el: null, bd: null, volver: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el) return;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); this.open(); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const linea = e.target.closest('[data-linea]');
      const k = linea?.dataset.linea;
      const paso = e.target.closest('[data-linea-paso]');
      if (paso && k) { const it = Cart.get().find(i => claveLinea(i.id, i.v) === k); if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
      if (e.target.closest('[data-quitar]') && k) { Cart.remove(k); showToast('Lo sacamos del pedido'); return; }
      if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
      if (e.target.closest('[data-ir-tienda]')) this.close();
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render(false));
    this.render(false);
  },
  render(animar) {
    if (!this.el) return;
    const cont = this.el.querySelector('[data-cart-lineas]');
    const foot = this.el.querySelector('[data-cart-foot]');
    const items = Cart.get();
    if (!items.length) {
      cont.innerHTML = `<div class="drawer__vacio"><img src="images/logo.webp" width="567" height="617" alt=""><p class="drawer__vacio-titulo">Tu pedido está vacío</p><p>Sumá unas prepizzas, una media docena de empanadas o una tarta, y te lo llevamos.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ver los productos</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    cont.innerHTML = items.map((i, n) => {
      const p = getProducto(i.id); const v = varDe(p, i.v);
      const max = p.stock ?? 99;
      const k = claveLinea(i.id, i.v);
      return `<div class="linea${animar ? ' entra' : ''}" data-linea="${k}" style="--i:${n}">
        <div class="linea__foto">${fotoHTML(p, false)}</div>
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          <p class="linea__meta">${v ? `<span class="linea__sabor">${ICO.sabor}${esc(v.nombre)}</span>` : `<span class="linea__sabor">${esc(p.unidad)}</span>`} ${formatearPrecio(precioFinal(p))} c/u</p>
          <div class="linea__abajo">
            <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
            <b>${formatearPrecio(precioFinal(p) * i.qty)}</b>
            <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(nombreLinea(i))}">${ICO.quitar}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
    const wsp = this.el.querySelector('[data-cart-wsp]');
    if (wsp) wsp.href = waLink(mensajePedido());
  },
  open() {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render(!reduceMotion);
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__head .icon-btn')?.focus(), 60);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null, sabor: '',
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-modal-cuerpo]');
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quick]');
      if (q) { e.preventDefault(); this.open(q.dataset.quick); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const th = e.target.closest('[data-vr-thumb]');
      if (th) { this.mostrar(Number(th.dataset.vrThumb)); return; }
      const sab = e.target.closest('[data-vr-sabor]');
      if (sab) { this.elegirSabor(sab.dataset.vrSabor); return; }
      const paso = e.target.closest('[data-vr-paso]');
      if (paso) {
        const span = this.el.querySelector('[data-vr-cant]');
        const max = this.actual.stock ?? 99;
        const n = Math.max(1, Math.min(max, Number(span.textContent) + Number(paso.dataset.vrPaso)));
        span.textContent = n;
        this.el.querySelector('[data-vr-paso="-1"]').disabled = n <= 1;
        this.el.querySelector('[data-vr-paso="1"]').disabled = n >= max;
        return;
      }
      if (e.target.closest('[data-vr-add]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vr-buy]')) this.agregar(true);
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
  },
  galeria() {
    const p = this.actual; if (!p) return [];
    const g = [{ src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt }];
    (p.galeria || []).forEach(x => g.push(x));
    return g;
  },
  mediaHTML(m) {
    return `<img src="${m.src}" width="${m.ancho}" height="${m.alto}" alt="${esc(m.alt)}"${m.ancho / m.alto < 0.7 || m.contain ? ' class="contain"' : ''}>`;
  },
  mostrar(i) {
    const g = this.galeria()[i];
    const marco = this.el.querySelector('[data-vr-marco]');
    if (!g || !marco) return;
    marco.innerHTML = this.mediaHTML(g);
    marco.classList.toggle('vr__foto--etiqueta', g.ancho / g.alto > 1.3 || g.ancho / g.alto < 0.7);
    this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.vrThumb) === i)));
  },
  elegirSabor(id) {
    const p = this.actual; const v = varDe(p, id); if (!v) return;
    this.sabor = id;
    this.el.querySelectorAll('[data-vr-sabor]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vrSabor === id)));
    const marco = this.el.querySelector('[data-vr-marco]');
    if (marco) {
      marco.innerHTML = this.mediaHTML({ src: v.img, ancho: v.ancho, alto: v.alto, alt: `Etiqueta de las empanadas de ${v.nombre.toLowerCase()}` });
      marco.classList.add('vr__foto--etiqueta');
      this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    }
    const lbl = this.el.querySelector('[data-vr-sabor-elegido]');
    if (lbl) lbl.textContent = v.nombre;
  },
  html(p) {
    const gal = this.galeria();
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    const g = GUIA[p.guia];
    const thumbs = gal.length > 1 ? `<div class="vr__thumbs">${gal.map((x, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver la imagen ${i + 1}" aria-pressed="${i === 0}"><img src="${x.src}" width="${x.ancho}" height="${x.alto}" alt=""></button>`).join('')}</div>` : '';
    const sabores = p.variantes ? `<div class="vr__sabores"><p class="vr__sub">Sabor: <span data-vr-sabor-elegido>${esc(p.variantes[0].nombre)}</span></p><div class="vr__sabor-opc" role="group" aria-label="Elegí el sabor">${p.variantes.map((v, i) => `<button type="button" class="sabor-btn sabor-btn--${v.id}" data-vr-sabor="${v.id}" aria-pressed="${i === 0}">${esc(v.nombre)}</button>`).join('')}</div></div>` : '';
    const coc = g ? `<div class="vr__coccion">${ICO.llama}<span><b>Al horno: ${esc(g.temp)}, ${g.min[0]} a ${g.min[1]} min</b> ${esc(g.desc === 'No hace falta' ? 'sin descongelar' : 'directo del freezer')}. Tiempos orientativos.</span></div>` : '';
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto" data-vr-marco>${this.mediaHTML(gal[0])}</div>
        ${thumbs}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)} · ${esc(p.unidad)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio">${precioHTML(p)}${p.descuento > 0 ? `<span class="badge badge--desc">-${p.descuento}%</span>` : ''}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        ${sabores}
        ${coc}
        <div class="vr__acciones">
          <div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="btn btn--ghost" data-vr-add>Agregar al pedido</button>
          <button type="button" class="btn btn--cta" data-vr-buy>Comprar ahora</button>
        </div>
        <a class="vr__wsp" href="${waLink(`Hola! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
        <dl class="vr__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><p class="vr__sub">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><span class="mini__foto">${fotoHTML(r, false)}</span><span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  open(id) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.sabor = p.variantes ? p.variantes[0].id : '';
    this.cuerpo.innerHTML = this.html(p);
    this.el.setAttribute('aria-label', p.nombre);
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(comprar) {
    const p = this.actual; if (!p) return;
    const n = Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1;
    Cart.add(p, n, this.sabor);
    if (comprar) { this.close(true); Drawer.open(); return; }
    const v = varDe(p, this.sabor);
    showToast(`Sumaste ${p.nombre}${v ? ` de ${v.nombre.toLowerCase()}` : ''} al pedido`);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
    if (PAGINA === 'catalogo') { const u = new URL(location.href); if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); history.replaceState(null, '', u); } }
  },
};

function initCardAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-card]');
      const p = getProducto(card?.dataset.card);
      const span = st.querySelector('[data-cant]');
      const n = Math.max(1, Math.min(p?.stock ?? 99, Number(span.textContent) + Number(paso.dataset.paso)));
      span.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.buy;
    const p = getProducto(id); if (!p) return;
    if (p.variantes) { Vista.open(id); return; }
    const card = add.closest('[data-card]');
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    Cart.add(p, n);
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const etiqueta = add.querySelector('span');
    add.classList.add('ok');
    if (etiqueta) etiqueta.textContent = '¡Sumado!';
    setTimeout(() => { add.classList.remove('ok'); if (etiqueta) etiqueta.textContent = 'Agregar'; }, 1400);
    showToast(`Sumaste ${p.nombre} al pedido`);
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

const VITRINAS = {
  todo: {},
  pizzas: { cat: ['pizzas', 'prelistas'] },
  empanadas: { cat: ['empanadas'] },
  tartas: { cat: ['tartas'] },
};
function initVitrinas() {
  document.querySelectorAll('[data-vitrina]').forEach(cont => {
    const grupo = cont.dataset.vitrina;
    const limite = Number(cont.dataset.limite) || 8;
    const tabs = [...document.querySelectorAll(`[data-tabs="${grupo}"] [data-tab]`)];
    const pintar = (clave, animar) => {
      const items = Tienda.consultar({ filtros: VITRINAS[clave] || {}, limite }).items;
      cont.innerHTML = items.map(p => cardHTML(p, true)).join('');
      if (animar) revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined' && animar) ScrollTrigger.refresh();
    };
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
      pintar(t.dataset.tab, true);
    }));
    pintar(tabs[0]?.dataset.tab || 'todo', false);
  });
}

function initMenu() {
  const lista = document.querySelector('[data-menu-lista]');
  if (!lista) return;
  lista.innerHTML = CATEGORIAS.map(c => {
    const items = Tienda.consultar({ filtros: { cat: [c.id] }, limite: 8 }).items;
    if (!items.length) return '';
    return `<div class="menu-grupo" id="menu-${c.id}">
      <div class="menu-grupo__head" data-animate="subir" style="opacity:0;transform:translateY(22px)"><span class="menu-grupo__ico">${ICO[c.id]}</span><div><h3>${esc(c.nombre)}</h3><p>${esc(c.bajada)}</p></div></div>
      ${items.map(filaHTML).join('')}
    </div>`;
  }).join('');
  const links = [...document.querySelectorAll('[data-menu-idx]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const marcar = id => links.forEach(a => { if (a.dataset.menuIdx === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  marcar(CATEGORIAS[0].id);
  const io = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting) marcar(en.target.id.replace('menu-', '')); });
  }, { rootMargin: '-35% 0px -55% 0px' });
  lista.querySelectorAll('.menu-grupo').forEach(g => io.observe(g));
}

function initPanelPedido() {
  const panel = document.querySelector('.panel-pedido');
  if (!panel) return;
  const cont = panel.querySelector('[data-panel-lineas]');
  const total = panel.querySelector('[data-panel-total]');
  const wsp = panel.querySelector('[data-panel-wsp]');
  const pintar = () => {
    const items = Cart.get();
    cont.innerHTML = items.length
      ? `<ul>${items.map(i => { const p = getProducto(i.id); return `<li><span class="panel-pedido__n">${i.qty}×</span><span class="panel-pedido__nom">${esc(nombreLinea(i))}</span><b>${formatearPrecio(precioFinal(p) * i.qty)}</b></li>`; }).join('')}</ul>`
      : '<p class="panel-pedido__vacio">Todavía no sumaste nada. Tocá <b>+</b> en lo que quieras.</p>';
    total.textContent = formatearPrecio(Cart.total());
    panel.classList.toggle('panel-pedido--vacio', !items.length);
    if (wsp) wsp.href = waLink(mensajePedido());
  };
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function initGuia() {
  const sec = document.querySelector('.horno');
  if (!sec) return;
  const chips = [...sec.querySelectorAll('[data-guia]')];
  const $ = s => sec.querySelector(s);
  const arco = $('[data-t-arco]');
  const num = $('[data-t-num]');
  const estado = $('[data-t-estado]');
  const minLbl = $('[data-t-min]');
  const play = $('[data-t-play]');
  const timer = $('[data-timer]');
  const C = 2 * Math.PI * 88;
  arco.style.strokeDasharray = C.toFixed(1);
  let actual = 'prepizza';
  let total = 0, restante = 0, corriendo = false, fin = 0, raf = 0;
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const dibujar = () => {
    num.textContent = fmt(Math.ceil(restante));
    arco.style.strokeDashoffset = (C * (1 - restante / total)).toFixed(1);
    minLbl.textContent = `${Math.round(total / 60)} min`;
  };
  const parar = () => { corriendo = false; cancelAnimationFrame(raf); play.textContent = restante < total && restante > 0 ? 'Seguir' : 'Arrancar el timer'; timer.classList.remove('corriendo'); };
  const tick = () => {
    restante = Math.max(0, (fin - Date.now()) / 1000);
    dibujar();
    if (restante <= 0) {
      parar(); play.textContent = 'Arrancar de nuevo'; estado.textContent = '¡listo!';
      timer.classList.add('listo');
      showToast('¡Listo! Fijate el dorado antes de sacarlo del horno.');
      restante = total;
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  const setTotal = min => { total = Math.max(1, Math.min(90, min)) * 60; restante = total; parar(); estado.textContent = 'listo para arrancar'; timer.classList.remove('listo'); dibujar(); };
  const elegir = id => {
    const g = GUIA[id]; if (!g) return;
    actual = id;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.guia === id)));
    $('[data-g-nombre]').textContent = g.nombre;
    $('[data-g-temp]').textContent = g.temp;
    $('[data-g-min]').textContent = `${g.min[0]} a ${g.min[1]} min`;
    $('[data-g-desc]').textContent = g.desc;
    $('[data-g-tip]').textContent = g.tip;
    const p = getProducto(g.prod);
    $('[data-g-precio]').innerHTML = p ? `${esc(p.nombre)} · <b>${formatearPrecio(precioFinal(p))}</b>` : '';
    const rot = $('[data-guia-rotulo]');
    rot.classList.remove('cambia'); void rot.offsetWidth; rot.classList.add('cambia');
    setTotal(g.timer);
  };
  chips.forEach(c => c.addEventListener('click', () => elegir(c.dataset.guia)));
  $('[data-t-menos]').addEventListener('click', () => setTotal(Math.round(total / 60) - 1));
  $('[data-t-mas]').addEventListener('click', () => setTotal(Math.round(total / 60) + 1));
  $('[data-t-reset]').addEventListener('click', () => setTotal(Math.round(total / 60)));
  play.addEventListener('click', () => {
    if (corriendo) { parar(); estado.textContent = 'en pausa'; return; }
    timer.classList.remove('listo');
    corriendo = true; fin = Date.now() + restante * 1000;
    play.textContent = 'Pausar'; estado.textContent = 'cocinando'; timer.classList.add('corriendo');
    showToast(`Timer en marcha: ${GUIA[actual].nombre}, ${Math.round(restante / 60)} min.`);
    raf = requestAnimationFrame(tick);
  });
  $('[data-g-add]').addEventListener('click', () => {
    const p = getProducto(GUIA[actual].prod); if (!p) return;
    if (p.variantes) { Vista.open(p.id); return; }
    Cart.add(p, 1);
    showToast(`Sumaste ${p.nombre} al pedido`);
  });
  const pedido = new URLSearchParams(location.search).get('horno');
  elegir(GUIA[pedido] ? pedido : 'prepizza');
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [g, v] = el.dataset.cuenta.split(':');
    const n = Tienda.contar({ [g]: [v] });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const contador = document.querySelector('[data-contador]');
  const mostrando = document.querySelector('[data-mostrando]');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-vacio]');
  const qIn = document.getElementById('q');
  const ordenSel = document.querySelector('[data-orden]');
  const filtros = document.getElementById('filtros');
  const filtrosBd = document.querySelector('[data-filtros-bd]');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const nFiltros = document.querySelector('[data-filtros-n]');
  const limpiarTop = document.querySelector('[data-limpiar-top]');
  const miga = document.querySelector('[data-miga-cat]');
  const chips = [...document.querySelectorAll('[data-cat-chip]')];
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const e = {
    cat: (params.get('cat') || '').split(',').filter(v => valida(CATEGORIAS, v)),
    formato: (params.get('formato') || '').split(',').filter(v => valida(FORMATOS, v)),
    viene: (params.get('viene') || '').split(',').filter(v => valida(VIENE, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'formato' && e.formato.length) f.formato = e.formato;
    if (sin !== 'viene' && e.viene.length) f.viene = e.viene;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('formato', e.formato.join(','));
    set('viene', e.viene.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const cuentaDe = (g, v) => {
    const base = filtrosDe(g);
    if (g === 'precio') { const pr = PRECIOS.find(x => x.id === v); return Tienda.contar({ ...base, precioMin: pr.min, precioMax: pr.max }); }
    return Tienda.contar({ ...base, [g]: [v] });
  };
  const pintarControles = () => {
    ['cat', 'formato', 'viene'].forEach(g => document.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = e[g].includes(i.value); }));
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => { const [g, v] = s.dataset.n.split(':'); s.textContent = cuentaDe(g, v); });
    const activos = e.cat.length + e.formato.length + e.viene.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.formato.length + e.viene.length + (e.precio ? 1 : 0);
    if (nFiltros) { nFiltros.textContent = enPanel; nFiltros.hidden = !enPanel; }
    if (limpiarTop) limpiarTop.hidden = !activos;
    if (miga) {
      const c = e.cat.length === 1 ? catDe(e.cat[0]) : null;
      miga.hidden = !c;
      miga.innerHTML = c ? `<span aria-current="page">${esc(c.nombre)}</span>` : '';
    }
    document.querySelectorAll('.nav-cats__list a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (e.cat.length === 1 && id === e.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  function render(reiniciar) {
    const f = { ...filtrosDe(), q: e.q.trim() };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => tarjetaHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosDe());
    const q = e.q.trim();
    const donde = e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : '';
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${total} ${total === 1 ? 'producto' : 'productos'}${donde}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const aplicar = () => { urlSync(); pintarControles(); render(true); };
  document.addEventListener('change', ev => {
    const i = ev.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    if (g === 'precio') e.precio = i.checked ? i.value : '';
    else e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  chips.forEach(c => c.addEventListener('click', () => { e.cat = c.dataset.catChip ? [c.dataset.catChip] : []; aplicar(); }));
  ordenSel?.addEventListener('change', () => { e.orden = valida(ORDENES, ordenSel.value) ? ordenSel.value : 'destacados'; aplicar(); });
  let tq = 0;
  qIn?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = qIn.value.slice(0, 60); aplicar(); }, 220); });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = qIn.value.slice(0, 60); aplicar(); qIn.blur(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    e.cat = []; e.formato = []; e.viene = []; e.precio = ''; e.q = '';
    aplicar();
  }));
  verMas.addEventListener('click', () => render(false));
  const drawerMq = window.matchMedia(MODELO === '2' ? 'all' : '(max-width: 1024px)');
  const abrirFiltros = () => {
    if (!drawerMq.matches) return;
    abrirCapa(filtros, filtrosBd);
    abrirBtn?.setAttribute('aria-expanded', 'true');
    revelarNuevos(filtros);
    setTimeout(() => filtros.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); filtrosBd?.classList.remove('open');
    capas.delete(filtros);
    if (!capas.size) document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!filtros.classList.contains('open') && filtrosBd) filtrosBd.hidden = true; }, 400);
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  abrirBtn?.addEventListener('click', abrirFiltros);
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  filtrosBd?.addEventListener('click', cerrarFiltros);
  filtros.addEventListener('keydown', ev => { if (!filtros.classList.contains('open')) return; if (ev.key === 'Escape') cerrarFiltros(); else atrapar(filtros, ev); });
  drawerMq.addEventListener?.('change', () => { if (!drawerMq.matches) cerrarFiltros(); });
  pintarControles();
  render(true);
  urlSync();
  if (params.get('buscar') && qIn) setTimeout(() => qIn.focus(), 300);
}

function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => Vista.open(id), 350);
}

initMenuCategorias();
initVitrinas();
initMenu();
initCuentas();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initNav();
initModelBarScroll();
Drawer.init();
Vista.init();
initCardAcciones();
initFloats();
initPanelPedido();
initGuia();
updateCartBadge();
abrirProductoDeUrl();
