const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491163739515';
const MARCA = 'Manjares de la casa';
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

const CATEGORIAS = [
  { id: 'packs', nombre: 'Packs semanales', corto: 'Pack semanal', bajada: 'El menú de lunes a viernes', img: 'images/t-carne-cacerola.webp' },
  { id: 'viandas', nombre: 'Viandas sueltas', corto: 'Vianda suelta', bajada: 'Un plato, listo para calentar', img: 'images/t-wok-pollo.webp' },
  { id: 'bandejas', nombre: 'Para compartir', corto: 'Para compartir', bajada: 'Bandejas de 2 a 4 porciones', img: 'images/t-lasana.webp' },
];
const TIPOS = [
  { id: 'pollo', nombre: 'Con pollo', titulo: 'Platos con pollo' },
  { id: 'carne', nombre: 'Con carne', titulo: 'Platos con carne' },
  { id: 'pescado', nombre: 'Pescado y mar', titulo: 'Pescados y mariscos' },
  { id: 'sin-carne', nombre: 'Sin carne', titulo: 'Platos sin carne' },
];
const PRECIOS = [
  { id: 'hasta-9000', nombre: 'Hasta $9.000', min: null, max: 9000 },
  { id: '9000-30000', nombre: '$9.001 a $30.000', min: 9001, max: 30000 },
  { id: 'mas-30000', nombre: 'Más de $30.000', min: 30001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const DIAS_CORTO = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const PLATOS = {
  'pollo-horno': { nombre: 'Pollo al horno con arroz y vegetales', tipo: 'pollo', img: 'images/t-pollo-horno.webp' },
  'carne-cacerola': { nombre: 'Carne a la cacerola con puré de papas', tipo: 'carne', img: 'images/t-carne-cacerola.webp' },
  'lentejas': { nombre: 'Guiso de lentejas con verduras', tipo: 'sin-carne', img: 'images/t-lentejas.webp' },
  'merluza': { nombre: 'Merluza al horno con vegetales', tipo: 'pescado', img: 'images/t-merluza.webp' },
  'lasana': { nombre: 'Lasaña de carne y bechamel', tipo: 'carne', img: 'images/t-lasana.webp' },
  'bowl-quinoa': { nombre: 'Bowl de quinoa y vegetales asados', tipo: 'sin-carne', img: 'images/t-bowl-quinoa.webp' },
  'wok-pollo': { nombre: 'Wok de pollo con vegetales y sésamo', tipo: 'pollo', img: 'images/t-wok-pollo.webp' },
  'tarta-vegetales': { nombre: 'Tarta de vegetales asados', tipo: 'sin-carne', img: 'images/t-tarta-vegetales.webp' },
  'pollo-grillado': { nombre: 'Pollo grillado con boniato y brócoli', tipo: 'pollo', img: 'images/t-pollo-grillado.webp' },
  'salmon': { nombre: 'Salmón con quinoa y limón', tipo: 'pescado', img: 'images/t-salmon.webp' },
  'chili': { nombre: 'Chili de carne con porotos y choclo', tipo: 'carne', img: 'images/t-chili.webp' },
  'ensalada-bife': { nombre: 'Ensalada de bife con queso feta', tipo: 'carne', img: 'images/t-ensalada-bife.webp' },
  'langostinos': { nombre: 'Tallarines salteados con langostinos', tipo: 'pescado', img: 'images/t-langostinos.webp' },
};

const packOpciones = (p5, p10) => [
  { id: '5', nombre: '5 viandas', detalle: 'Una por día, de lunes a viernes', precio: p5, n: 5 },
  { id: '10', nombre: '10 viandas', detalle: 'Dos por día: almuerzo y cena', precio: p10, n: 10 },
];

const PRODUCTOS = [
  {
    id: 'pack-clasico', cat: 'packs', rango: 1, nombre: 'Pack Clásico', bajada: 'Los platos de siempre, como en casa.',
    semana: ['pollo-horno', 'carne-cacerola', 'lentejas', 'merluza', 'lasana'], opciones: packOpciones(42500, 81000),
    porcion: 'Porciones de 450 g aprox.',
    desc: 'Cinco platos caseros distintos para la semana: pollo al horno, carne a la cacerola, lentejas, merluza y lasaña. Llegan listos para calentar.',
    claves: ['casero', 'clasico', 'almuerzo', 'cena', 'semana', 'oficina'],
  },
  {
    id: 'pack-liviano', cat: 'packs', rango: 2, nombre: 'Pack Liviano', bajada: 'Más verduras, sin resignar sabor.',
    semana: ['bowl-quinoa', 'wok-pollo', 'tarta-vegetales', 'merluza', 'lentejas'], opciones: packOpciones(44000, 84000),
    porcion: 'Porciones de 400 g aprox.',
    desc: 'Una semana con más vegetales: bowl de quinoa, wok de pollo, tarta de vegetales, merluza al horno y guiso de lentejas.',
    claves: ['liviano', 'light', 'saludable', 'verduras', 'vegetales', 'semana'],
  },
  {
    id: 'pack-proteico', cat: 'packs', rango: 3, nombre: 'Pack Proteico', bajada: 'Más proteína, para entrenar o cuidarte.',
    semana: ['pollo-grillado', 'salmon', 'chili', 'ensalada-bife', 'langostinos'], opciones: packOpciones(49500, 95000),
    foto: { src: 'images/semana-tuppers.webp', w: 1600, h: 900, alt: 'Las cinco viandas del Pack Proteico en recipientes transparentes sobre una mesada' },
    porcion: 'Porciones de 450 g aprox.',
    desc: 'Pollo grillado con boniato, salmón con quinoa, chili de carne, ensalada de bife y tallarines con langostinos: una semana alta en proteína.',
    claves: ['proteina', 'proteico', 'fit', 'gimnasio', 'entrenar', 'deporte', 'semana'],
  },
  {
    id: 'pollo-horno', cat: 'viandas', rango: 4, nombre: 'Pollo al horno con arroz y vegetales', plato: 'pollo-horno', precio: 9200,
    porcion: '450 g aprox.', img: { src: 'images/p-pollo-horno.webp', lado: 900, alt: 'Cuarto de pollo al horno con arroz blanco, brócoli, zanahoria y morrón en una bandeja negra' },
    desc: 'Cuarto trasero dorado al horno con hierbas, arroz blanco con perejil y vegetales salteados.',
    incluye: ['Pollo al horno con hierbas', 'Arroz blanco con perejil', 'Brócoli, zanahoria, zucchini y morrón'],
    claves: ['pollo', 'arroz', 'brocoli', 'zanahoria', 'casero'],
  },
  {
    id: 'carne-cacerola', cat: 'viandas', rango: 5, nombre: 'Carne a la cacerola con puré de papas', plato: 'carne-cacerola', precio: 9800,
    porcion: '450 g aprox.', img: { src: 'images/p-carne-cacerola.webp', lado: 1200, alt: 'Carne a la cacerola con zanahoria y puré de papas en una bandeja negra' },
    desc: 'Carne de cocción lenta con su salsa y zanahoria, con puré de papas casero.',
    incluye: ['Carne en cubos cocida a fuego lento', 'Salsa con zanahoria y cebolla', 'Puré de papas'],
    claves: ['carne', 'estofado', 'pure', 'papas', 'guiso', 'casero'],
  },
  {
    id: 'lasana', cat: 'bandejas', rango: 6, nombre: 'Lasaña de carne y bechamel', plato: 'lasana', precio: 27500,
    porcion: 'Bandeja para 4 personas', img: { src: 'images/p-lasana.webp', lado: 1200, alt: 'Lasaña gratinada con salsa de carne y queso en una bandeja de aluminio' },
    desc: 'Capas de pasta, salsa de carne, bechamel y queso gratinado. Viene en bandeja lista para el horno.',
    incluye: ['Pasta en capas', 'Salsa de carne con tomate', 'Bechamel y queso gratinado'],
    claves: ['lasagna', 'pasta', 'carne', 'queso', 'familia', 'horno', 'compartir'],
  },
  {
    id: 'tarta-vegetales', cat: 'viandas', rango: 7, nombre: 'Tarta de vegetales asados', plato: 'tarta-vegetales', precio: 7900,
    porcion: 'Porción grande', img: { src: 'images/p-tarta-vegetales.webp', lado: 1200, alt: 'Porción de tarta de zucchini, morrones y cebolla morada en una caja de cartón' },
    desc: 'Masa casera con zucchini, morrones y cebolla morada asados, ligados con huevo y queso.',
    incluye: ['Masa casera', 'Zucchini, morrones y cebolla morada', 'Huevo y queso'],
    claves: ['tarta', 'vegetariano', 'veggie', 'zucchini', 'morron', 'sin carne'],
  },
  {
    id: 'wok-pollo', cat: 'viandas', rango: 8, nombre: 'Wok de pollo con vegetales y sésamo', plato: 'wok-pollo', precio: 9400,
    porcion: '400 g aprox.', img: { src: 'images/p-wok-pollo.webp', lado: 1200, alt: 'Salteado de pollo con brócoli, morrones y cebolla con semillas de sésamo en una bandeja' },
    desc: 'Pollo salteado al wok con brócoli, morrones, cebolla y chauchas, con salsa de soja y sésamo.',
    incluye: ['Pollo salteado', 'Brócoli, morrones, cebolla y chauchas', 'Salsa de soja y sésamo'],
    claves: ['pollo', 'wok', 'salteado', 'oriental', 'soja', 'liviano'],
  },
  {
    id: 'lentejas', cat: 'viandas', rango: 9, nombre: 'Guiso de lentejas con verduras', plato: 'lentejas', precio: 8400,
    porcion: '500 g aprox.', img: { src: 'images/p-lentejas.webp', lado: 1200, alt: 'Guiso de lentejas con zanahoria, apio y perejil en un bowl de cartón' },
    desc: 'Lentejas cocidas con zanahoria, apio, cebolla y tomate. Sin carne y bien abundante.',
    incluye: ['Lentejas', 'Zanahoria, apio, cebolla y tomate', 'Perejil fresco'],
    claves: ['lentejas', 'guiso', 'legumbres', 'vegetariano', 'veggie', 'sin carne', 'invierno'],
  },
  {
    id: 'merluza', cat: 'bandejas', rango: 10, nombre: 'Merluza al horno con vegetales', plato: 'merluza', precio: 25900,
    porcion: 'Bandeja para 2 o 3 personas', img: { src: 'images/p-merluza.webp', lado: 1200, alt: 'Filet de merluza al horno con tomates cherry, zucchini y morrones en una bandeja de aluminio' },
    desc: 'Filet de merluza con especias sobre tomates, zucchini, morrones y cebolla morada asados.',
    incluye: ['Filet de merluza', 'Tomates cherry y zucchini', 'Morrones y cebolla morada'],
    claves: ['pescado', 'merluza', 'horno', 'liviano', 'compartir'],
  },
  {
    id: 'bowl-quinoa', cat: 'viandas', rango: 11, nombre: 'Bowl de quinoa y vegetales asados', plato: 'bowl-quinoa', precio: 8900,
    porcion: '400 g aprox.', img: { src: 'images/p-bowl-quinoa.webp', lado: 1200, alt: 'Bowl de quinoa con calabaza, brócoli, morrón, zucchini y cebolla morada asados' },
    desc: 'Quinoa tricolor con calabaza, brócoli, zucchini, morrón y cebolla morada asados.',
    incluye: ['Quinoa tricolor', 'Calabaza y brócoli asados', 'Zucchini, morrón y cebolla morada'],
    claves: ['quinoa', 'bowl', 'vegano', 'vegetariano', 'veggie', 'sin carne', 'saludable'],
  },
];

PRODUCTOS.forEach(p => {
  const tipos = p.semana ? p.semana.map(id => PLATOS[id]?.tipo).filter(Boolean) : [PLATOS[p.plato]?.tipo].filter(Boolean);
  const sinCarne = tipos.length && tipos.every(t => t === 'sin-carne');
  p.tipos = sinCarne ? ['sin-carne'] : [...new Set(tipos.filter(t => t !== 'sin-carne'))];
  p.desde = p.opciones ? Math.min(...p.opciones.map(o => o.precio)) : p.precio;
});

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.bajada, p.desc, p.porcion, catDe(p.cat).nombre, catDe(p.cat).corto,
    ...(p.tipos || []).map(t => nombreDe(TIPOS, t)), ...(p.semana || []).map(id => PLATOS[id]?.nombre),
    ...(p.opciones || []).map(o => o.nombre), ...(p.incluye || []), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.some(t => (p.tipos || []).includes(t))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.desde < f.precioMin) return false;
    if (f.precioMax != null && p.desde > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => a.desde - b.desde || desempate(a, b);
      case 'precio-desc': return (a, b) => b.desde - a.desde || desempate(a, b);
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
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, p.desde); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opcionDe = (p, v) => (p?.opciones ? p.opciones.find(o => o.id === v) || null : null);
const varValida = (p, v) => (p?.opciones ? (opcionDe(p, v) ? v : p.opciones[0].id) : 'U');
const precioDe = (p, v) => (p?.opciones ? (opcionDe(p, v) || p.opciones[0]).precio : p?.precio || 0);
const detalleVar = (p, v) => (p?.opciones ? (opcionDe(p, v) || p.opciones[0]).nombre : p?.porcion || '');
const porUnidad = (p, v) => { const o = opcionDe(p, v) || p.opciones?.[0]; return o ? Math.round(o.precio / o.n) : 0; };
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const imgPrincipal = p => (p.img ? { src: p.img.src, w: p.img.lado, h: p.img.lado } : { src: PLATOS[p.semana[0]].img, w: 480, h: 480 });

const Cart = {
  KEY: 'manjaresdelacasa_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = 'U', qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
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
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  caja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/></svg>',
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

const mosaicoHTML = p => `<span class="mosaico">${p.semana.map(id => `<img src="${esc(PLATOS[id].img)}" alt="" width="480" height="480" decoding="async">`).join('')}</span>`;
function mediaHTML(p) {
  if (p.semana) return mosaicoHTML(p);
  return `<img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async">`;
}
const tiposTxt = p => (p.tipos || []).map(t => nombreDe(TIPOS, t)).join(' · ');
function opcionesHTML(p, sel = null, clase = 'opciones') {
  if (!p.opciones) return '';
  const v = varValida(p, sel);
  return `<div class="${clase}" role="group" aria-label="Cantidad de viandas" data-opciones>${p.opciones.map(o => `<button type="button" class="opcion-btn" data-opcion="${o.id}" aria-pressed="${o.id === v}"><b>${esc(o.nombre)}</b><small>${esc(o.detalle)}</small></button>`).join('')}</div>`;
}
const stepperHTML = (n = 1, extra = '') => `<div class="stepper${extra}" data-stepper><button type="button" data-paso="-1" aria-label="Restar una">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar una">${ICO.mas}</button></div>`;
const botonSumar = (p, txt = 'Agregar') => `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>${txt}</span></button>`;

function cardHTML(p, estilo = 'etiqueta', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const v = varValida(p, null);
  const cat = catDe(p.cat);
  const precio = `<p class="prod__precio precio" data-precio>${formatearPrecio(precioDe(p, v))}</p>`;
  if (estilo === 'menu') {
    const detalle = p.semana ? `${p.semana.length} platos · ${esc(p.opciones.map(o => o.nombre).join(' o '))}` : esc(p.porcion);
    return `<article class="plato-fila${p.semana ? ' plato-fila--pack' : ''}" data-id="${esc(p.id)}"${anim}>
  <div class="plato-fila__txt">
    <h3 class="plato-fila__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="plato-fila__desc">${esc(p.bajada || p.desc)}</p>
    <p class="plato-fila__meta">${detalle}${p.tipos?.length ? ` · ${esc(tiposTxt(p))}` : ''}</p>
    <p class="plato-fila__precio precio">${p.semana ? 'Desde ' : ''}${formatearPrecio(p.desde)}</p>
  </div>
  <div class="plato-fila__media">
    <button type="button" class="plato-fila__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p)}</button>
    <button type="button" class="plato-fila__mas" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>
  </div>
</article>`;
  }
  const marca = estilo === 'plato'
    ? `<span class="prod__cat">${esc(cat.corto)}</span>`
    : `<span class="cinta prod__cinta">${esc(cat.corto)}</span>`;
  const acciones = p.opciones
    ? `${opcionesHTML(p, v)}<div class="prod__fila">${precio}${botonSumar(p)}</div>`
    : `<div class="prod__fila">${precio}<div class="prod-actions">${stepperHTML(1)}${botonSumar(p)}</div></div>`;
  return `<article class="prod prod--${estilo}${p.semana ? ' prod--pack' : ''}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p)}</button>${marca}</div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__porcion">${esc(p.semana ? p.porcion : `${p.porcion} · ${tiposTxt(p)}`)}</p>
    ${acciones}
    <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
}

function packFilaHTML(p) {
  const v = varValida(p, null);
  return `<article class="pack" data-id="${esc(p.id)}">
  <div class="pack__info" data-animate="izq" style="opacity:0;transform:translateX(-48px)">
    <p class="pack__tag">${ICO.caja}Pack semanal · ${esc(p.porcion)}</p>
    <h3 class="pack__nombre">${esc(p.nombre)}</h3>
    <p class="pack__bajada">${esc(p.bajada)}</p>
    ${opcionesHTML(p, v)}
    <div class="pack__compra"><p class="precio precio--pack" data-precio>${formatearPrecio(precioDe(p, v))}</p><p class="pack__cu" data-cu>${formatearPrecio(porUnidad(p, v))} por vianda</p></div>
    <div class="pack__acciones">${botonSumar(p, 'Agregar el pack')}<button type="button" class="link-ver" data-qv="${esc(p.id)}">Ver el detalle ${ICO.flecha}</button></div>
  </div>
  <ol class="pack__semana" aria-label="Menú de la semana del ${esc(p.nombre)}">
${p.semana.map((id, k) => `    <li class="dia"><div class="dia__in" data-animate="der" style="opacity:0;transform:translateX(48px)"><figure class="dia__foto"><img src="${esc(PLATOS[id].img)}" alt="${esc(PLATOS[id].nombre)}" width="480" height="480" decoding="async"></figure><span class="cinta dia__cinta">${DIAS_CORTO[k]}</span><p class="dia__plato">${esc(PLATOS[id].nombre)}</p></div></li>`).join('\n')}
  </ol>
</article>`;
}

function initPacks() {
  const packs = Tienda.consultar({ filtros: { cat: 'packs' }, limite: 6 }).items;
  const filas = document.querySelector('[data-packs="filas"]');
  if (filas) filas.innerHTML = packs.map(packFilaHTML).join('');
  const tablero = document.querySelector('[data-packs="tablero"]');
  const tabs = document.querySelector('[data-pack-tabs]');
  if (!tablero || !tabs || !packs.length) return;
  tabs.innerHTML = packs.map((p, k) => `<button type="button" class="tab" data-pack-tab="${esc(p.id)}" aria-pressed="${k === 0}">${esc(p.nombre.replace('Pack ', ''))}</button>`).join('');
  const pintar = (p, animar) => {
    const v = varValida(p, null);
    const anim = (t, s) => (animar ? ` data-animate="${t}" style="${s}"` : '');
    tablero.dataset.id = p.id;
    tablero.innerHTML = `<ol class="tablero__dias${animar ? '' : ' cambia'}" aria-label="Menú de la semana del ${esc(p.nombre)}">
${p.semana.map((id, k) => `  <li class="tdia" style="--i:${k}"><div class="tdia__in"${anim('subir', 'opacity:0;transform:translateY(40px)')}><span class="cinta tdia__cinta">${DIAS[k]}</span><figure class="tdia__foto"><img src="${esc(PLATOS[id].img)}" alt="${esc(PLATOS[id].nombre)}" width="480" height="480" decoding="async"></figure><p class="tdia__plato">${esc(PLATOS[id].nombre)}</p><p class="tdia__tipo">${esc(nombreDe(TIPOS, PLATOS[id].tipo))}</p></div></li>`).join('\n')}
</ol>
<aside class="ticket" data-id="${esc(p.id)}" aria-label="${esc(p.nombre)}"><div class="ticket__in"${anim('der', 'opacity:0;transform:translateX(48px)')}>
  <p class="ticket__tag">${ICO.caja}Pack semanal</p>
  <h3 class="ticket__nombre">${esc(p.nombre)}</h3>
  <p class="ticket__bajada">${esc(p.bajada)}</p>
  ${opcionesHTML(p, v, 'opciones opciones--lista')}
  <div class="ticket__total"><span>Total</span><p class="precio precio--pack" data-precio>${formatearPrecio(precioDe(p, v))}</p></div>
  <p class="pack__cu" data-cu>${formatearPrecio(porUnidad(p, v))} por vianda · ${esc(p.porcion)}</p>
  ${botonSumar(p, 'Agregar el pack')}
  <button type="button" class="link-ver" data-qv="${esc(p.id)}">Ver el detalle ${ICO.flecha}</button>
</div></aside>`;
  };
  pintar(packs[0], true);
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-pack-tab]');
    if (!b || b.getAttribute('aria-pressed') === 'true') return;
    tabs.querySelectorAll('[data-pack-tab]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const p = getProducto(b.dataset.packTab);
    if (p) pintar(p, false);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function elegirOpcion(btn) {
  const grupo = btn.closest('[data-opciones]');
  const cont = btn.closest('[data-id]');
  if (!grupo || !cont) return;
  grupo.querySelectorAll('[data-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  const p = getProducto(cont.dataset.id);
  if (!p) return;
  const v = btn.dataset.opcion;
  cont.querySelectorAll('[data-precio]').forEach(el => { el.textContent = formatearPrecio(precioDe(p, v)); });
  cont.querySelectorAll('[data-cu]').forEach(el => { el.textContent = el.textContent.replace(/^\$[\d.]+/, formatearPrecio(porUnidad(p, v))); });
}
const opcionElegida = cont => cont?.querySelector('[data-opcion][aria-pressed="true"]')?.dataset.opcion || null;
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${total}` : 'Abrir el carrito'); });
  document.querySelectorAll('[data-barra-txt]').forEach(el => { el.textContent = n ? `Ver tu pedido · ${plural(n, 'producto', 'productos')}` : 'Tu pedido está vacío'; });
  document.querySelectorAll('[data-barra-pedido]').forEach(el => el.classList.toggle('is-lleno', n > 0));
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleVar(p, i.v)}) — ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const im = imgPrincipal(p);
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.semana ? PLATOS[p.semana[0]].img : im.src)}" alt="" width="${p.semana ? 480 : im.w}" height="${p.semana ? 480 : im.h}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleVar(p, i.v))} · ${formatearPrecio(precioDe(p, i.v))}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar una de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar una de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
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
    if (p) showToast(`Sacaste «${p.nombre}» del pedido`);
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
  const det = p.opciones ? ` (${detalleVar(p, varValida(p, v))})` : '';
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${det} al pedido`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('[data-panel]')) { showToast('El acceso al panel se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const op = e.target.closest('[data-opcion]');
    if (op) { elegirOpcion(op); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const out = st?.querySelector('[data-qty]');
      if (out) out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const id = (s ? s.dataset.sumar : c.dataset.comprar);
      const n = sumar(id, opcionElegida(cont), cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out) out.textContent = '1';
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const v = varValida(p, null);
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const media = p.semana
    ? `${p.foto ? `<figure class="qv__foto qv__foto--ancha"><img src="${esc(p.foto.src)}" alt="${esc(p.foto.alt)}" width="${p.foto.w}" height="${p.foto.h}"></figure>` : `<div class="qv__foto qv__foto--mosaico">${mosaicoHTML(p)}</div>`}
    <ol class="qv__semana" aria-label="Menú de la semana">${p.semana.map((pid, k) => `<li><img src="${esc(PLATOS[pid].img)}" alt="" width="480" height="480"><span class="cinta">${DIAS_CORTO[k]}</span><b>${esc(PLATOS[pid].nombre)}</b></li>`).join('')}</ol>`
    : `<figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></figure>`;
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <div class="qv__media">${media}</div>
  <div class="qv__info">
    <p class="qv__meta"><span class="cinta">${esc(catDe(p.cat).corto)}</span><span>${esc(tiposTxt(p))}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__porcion">${esc(p.porcion)}</p>
    <p class="precio precio--qv" data-precio>${formatearPrecio(precioDe(p, v))}</p>
    ${p.opciones ? `<p class="pack__cu" data-cu>${formatearPrecio(porUnidad(p, v))} por vianda</p>` : ''}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${p.incluye ? `<ul class="qv__incluye">${p.incluye.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    ${opcionesHTML(p, v, 'opciones opciones--lista')}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><ul>${rel.map(r => { const im = imgPrincipal(r); return `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.semana ? PLATOS[r.semana[0]].img : im.src)}" alt="" width="${r.semana ? 480 : im.w}" height="${r.semana ? 480 : im.h}"><span>${esc(r.nombre)}</span><small>${r.semana ? 'Desde ' : ''}${formatearPrecio(r.desde)}</small></button></li>`; }).join('')}</ul></div>` : ''}`;
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
    if (op) { elegirOpcion(op); return; }
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
      const n = Cart.add(p, opcionElegida(cont), cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}» al pedido`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  const im = imgPrincipal(p);
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.foto?.src || (p.semana ? PLATOS[p.semana[0]].img : im.src), location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.desde, availability: 'https://schema.org/InStock' },
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

const HORARIO = { 0: null, 1: [9, 18], 2: [9, 18], 3: [9, 18], 4: [9, 18], 5: [9, 18], 6: [9, 13] };
const NOMBRE_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function ahoraAR(fecha = new Date()) {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(fecha);
    const v = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
    const h = parseInt(v('hour'), 10) % 24;
    return { dia: dia < 0 ? fecha.getDay() : dia, min: h * 60 + (parseInt(v('minute'), 10) || 0) };
  } catch { return { dia: fecha.getDay(), min: fecha.getHours() * 60 + fecha.getMinutes() }; }
}
const rangoTxt = r => (r ? `${r[0]} a ${r[1]} h` : 'Cerrado');
function estadoHorario(dia, min) {
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] * 60 && min < hoy[1] * 60) {
    return { abierto: true, texto: `Abierto ahora · hasta las ${hoy[1]} h`, corto: 'Abierto ahora', hoy: rangoTxt(hoy) };
  }
  if (hoy && min < hoy[0] * 60) return { abierto: false, texto: `Cerrado · abrimos hoy a las ${hoy[0]} h`, corto: 'Cerrado', hoy: rangoTxt(hoy) };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const r = HORARIO[d];
    if (!r) continue;
    const cuando = k === 1 ? 'mañana' : `el ${NOMBRE_DIA[d]}`;
    return { abierto: false, texto: `Cerrado · abrimos ${cuando} a las ${r[0]} h`, corto: 'Cerrado', hoy: rangoTxt(hoy) };
  }
  return { abierto: false, texto: 'Cerrado', corto: 'Cerrado', hoy: rangoTxt(hoy) };
}
function initHorario() {
  const objetivos = document.querySelectorAll('[data-estado]');
  const hoyEls = document.querySelectorAll('[data-horario-hoy]');
  const tablas = document.querySelectorAll('[data-horario-tabla]');
  if (!objetivos.length && !hoyEls.length && !tablas.length) return;
  const pintar = () => {
    const { dia, min } = ahoraAR();
    const est = estadoHorario(dia, min);
    objetivos.forEach(el => {
      el.classList.toggle('is-abierto', est.abierto);
      el.classList.toggle('is-cerrado', !est.abierto);
      const t = el.querySelector('[data-estado-txt]');
      if (t) t.textContent = est.texto;
    });
    hoyEls.forEach(el => { el.textContent = est.hoy; });
    tablas.forEach(t => t.querySelectorAll('[data-dias]').forEach(tr => {
      const es = tr.dataset.dias.split(',').map(Number).includes(dia);
      tr.classList.toggle('es-hoy', es);
      if (es) tr.setAttribute('aria-current', 'date'); else tr.removeAttribute('aria-current');
    }));
  };
  pintar();
  setInterval(pintar, 60000);
}

const ESTADOS_PEDIDO = ['Recibido', 'En preparación', 'En camino', 'Entregado'];
const MENSAJES_PEDIDO = [
  'Recibimos tu pedido y el pago.',
  'Lo estamos cocinando. Te escribimos por WhatsApp para coordinar la entrega.',
  'Salió en el reparto de hoy. Si no vas a estar, avisanos por WhatsApp.',
  'Entregado. ¡Que lo disfrutes!',
];
const CORREO_PRUEBA = 'demo@manjaresdelacasa.com';
const PEDIDOS_DEMO = [
  { n: '1047', correo: CORREO_PRUEBA, detalle: 'Pack Clásico · 5 viandas', estado: 2, pasos: [[-2, '19:12'], [-1, '10:30'], [0, '11:05']] },
  { n: '1052', correo: CORREO_PRUEBA, detalle: 'Pack Liviano · 10 viandas', estado: 1, pasos: [[-1, '21:40'], [0, '09:15']] },
  { n: '1041', correo: CORREO_PRUEBA, detalle: 'Lasaña para 4 y 2 viandas sueltas', estado: 3, pasos: [[-6, '17:20'], [-5, '09:40'], [-4, '11:20'], [-4, '13:05']] },
];
const CORREO_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normPedido = s => String(s ?? '').replace(/\D/g, '').replace(/^0+(?=\d)/, '');
function buscarPedido(numero, correo) {
  const n = normPedido(numero);
  const c = String(correo ?? '').trim().toLowerCase();
  const errores = {};
  if (!n) errores.pedido = 'Escribí el número de pedido (está en el mail de compra).';
  if (!c) errores.correo = 'Escribí el correo con el que compraste.';
  else if (!CORREO_OK.test(c)) errores.correo = 'Revisá el correo: le falta algo.';
  if (Object.keys(errores).length) return { ok: false, errores };
  const pedido = PEDIDOS_DEMO.find(p => p.n === n);
  if (!pedido) return { ok: false, motivo: 'no-existe', n };
  if (pedido.correo !== c) return { ok: false, motivo: 'correo', n };
  return { ok: true, pedido };
}
function fechaPaso(dias, hora, base = new Date()) {
  const d = new Date(base.getTime() + dias * 86400000);
  try {
    return `${new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', day: 'numeric', month: 'short' }).format(d).replace(/\./g, '')} · ${hora} h`;
  } catch { return `${d.getDate()}/${d.getMonth() + 1} · ${hora} h`; }
}
function resultadoPedidoHTML(r) {
  if (!r.ok) {
    const t = r.motivo === 'correo'
      ? `El pedido N.° ${esc(r.n)} existe, pero el correo no coincide con el de la compra.`
      : `No encontramos el pedido N.° ${esc(r.n)}. Revisá el número en el mail de compra.`;
    return `<div class="seg-res seg-res--error"><p>${t}</p><a class="btn btn--ghost btn--sm" href="${esc(wspHref(`Hola! No encuentro mi pedido N.° ${r.n} en el seguimiento de la web.`))}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a></div>`;
  }
  const p = r.pedido;
  return `<div class="seg-res">
  <div class="seg-res__head"><span class="cinta">Pedido N.° ${esc(p.n)}</span><p>${esc(p.detalle)}</p></div>
  <p class="seg-res__estado seg-res__estado--${p.estado}"><i aria-hidden="true"></i>${esc(ESTADOS_PEDIDO[p.estado])}</p>
  <ol class="seg-pasos">${ESTADOS_PEDIDO.map((t, k) => `<li class="${k < p.estado ? 'hecho' : k === p.estado ? 'actual' : 'pendiente'}"${k === p.estado ? ' aria-current="step"' : ''}><span class="seg-pasos__punto" aria-hidden="true">${k <= p.estado ? ICO.check : ''}</span><b>${esc(t)}</b><small>${p.pasos[k] ? esc(fechaPaso(p.pasos[k][0], p.pasos[k][1])) : 'Pendiente'}</small></li>`).join('')}</ol>
  <p class="seg-res__msg">${esc(MENSAJES_PEDIDO[p.estado])}</p>
  <a class="btn btn--ghost btn--sm" href="${esc(wspHref(`Hola! Quiero consultar por mi pedido N.° ${p.n} (${p.detalle}).`))}" target="_blank" rel="noopener">${ICO.wsp}Consultar por este pedido</a>
  <p class="seg-res__demo">Pedido de prueba: en producción los estados se cargan desde el panel.</p>
</div>`;
}
function initSeguimiento() {
  document.querySelectorAll('[data-seguimiento]').forEach(form => {
    const res = form.parentElement.querySelector('[data-seg-resultado]');
    const inN = form.querySelector('[name="pedido"]');
    const inC = form.querySelector('[name="correo"]');
    const btn = form.querySelector('[data-seg-enviar]');
    const error = (input, msg) => {
      const p = document.getElementById(input.getAttribute('aria-describedby'));
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (p) { p.textContent = msg || ''; p.hidden = !msg; }
    };
    [inN, inC].forEach(i => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') error(i, ''); }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const r = buscarPedido(inN.value, inC.value);
      error(inN, r.errores?.pedido); error(inC, r.errores?.correo);
      if (r.errores) { (r.errores.pedido ? inN : inC).focus(); return; }
      btn.disabled = true;
      const span = btn.querySelector('span');
      span.textContent = 'Consultando…';
      setTimeout(() => {
        btn.disabled = false; span.textContent = 'Consultar estado';
        res.innerHTML = resultadoPedidoHTML(r);
        res.hidden = false;
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, reduceMotion ? 0 : 650);
    });
    form.addEventListener('click', e => {
      const chip = e.target.closest('[data-seg-prueba]');
      if (!chip) return;
      inN.value = chip.dataset.segPrueba;
      inC.value = CORREO_PRUEBA;
      error(inN, ''); error(inC, '');
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
    });
  });
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
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['tipo', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="480" height="480"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n} · desde ${formatearPrecio(r.desde)}</em></a></li>`;
    }).join('');
  });
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

function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'etiqueta';
    const limite = Math.min(Number(cont.dataset.limite) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = productosPorIds(ids).filter(p => p[k] === v).slice(0, limite);
      } else prods = productosPorIds(ids).slice(0, limite);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo)).join('');
      if (verTodo) {
        const [k, v] = tab ? tab.split(':') : [];
        verTodo.href = tab ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
      }
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
  const estilo = MODELO === '2' ? 'plato' : 'etiqueta';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    tipo: valida(params.get('tipo'), TIPOS),
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
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return e.cat[0] === 'bandejas' ? 'Bandejas para compartir' : nombreDe(CATEGORIAS, e.cat[0]);
    if (e.tipo.length === 1) return TIPOS.find(t => t.id === e.tipo[0])?.titulo || '';
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Packs, viandas y bandejas';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Menú completo'} — ${MARCA}`;
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
      : `${total} <small>${total === 1 ? 'plato' : 'platos'}</small>`;
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-estado, .hero-badge', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.66);
  desde('.cinta--hero', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
}

initPacks();
initPreviews();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initHorario();
initSeguimiento();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
