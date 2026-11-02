const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = "5492644572844";
const POR_PAGINA = 16;
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

const CATEGORIAS = [{"id": "refrescantes", "nombre": "Refrescantes", "bajada": "Menta, cítricos y burbujas", "img": "images/mojito.webp", "alt": "Mojito con menta y lima en vaso alto"}, {"id": "tropicales", "nombre": "Tropicales", "bajada": "Ananá, coco, maracuyá y naranja", "img": "images/tropical-anana-maracuya.webp", "alt": "Trago tropical de ananá con cereza en copa huracán"}, {"id": "clasicos", "nombre": "Clásicos de barra", "bajada": "Para tomar despacio", "img": "images/old-fashioned.webp", "alt": "Old Fashioned con piel de naranja y hielo grande"}];
const BASES = [{"id": "ron", "nombre": "Ron"}, {"id": "vodka", "nombre": "Vodka"}, {"id": "tequila", "nombre": "Tequila"}, {"id": "gin", "nombre": "Gin"}, {"id": "whisky", "nombre": "Whisky"}, {"id": "pisco", "nombre": "Pisco"}, {"id": "aperitivo", "nombre": "Aperitivo"}];
const INTENSIDADES = [{"id": "suave", "nombre": "Suave"}, {"id": "media", "nombre": "Media"}, {"id": "intensa", "nombre": "Intensa"}];
const PRECIOS = [{"id": "menos8", "nombre": "Vaso a menos de $8.000", "min": null, "max": 7999}, {"id": "mas8", "nombre": "Vaso desde $8.000", "min": 8000, "max": null}];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];

const Tienda = crearTienda([{"id": "mojito", "nombre": "Mojito", "cat": "refrescantes", "base": "ron", "intensidad": "media", "rango": 1, "img": "images/mojito.webp", "ancho": 960, "alto": 1200, "alt": "Mojito con menta, lima y hielo picado en vaso alto", "galeria": [{"src": "images/mojito-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Mojito sobre la barra de mármol, con la coctelera atrás"}], "lleva": "Ron blanco, menta fresca, lima, azúcar y soda", "desc": "El clásico cubano: menta machacada con lima y azúcar, ron blanco y un toque de soda, con mucho hielo.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 6900}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 12900}], "tags": "menta hierbabuena lima limon soda cubano fresco"}, {"id": "caipiroska-frutos-rojos", "nombre": "Caipiroska de frutos rojos", "cat": "refrescantes", "base": "vodka", "intensidad": "media", "rango": 2, "img": "images/caipiroska-frutos-rojos.webp", "ancho": 720, "alto": 900, "alt": "Caipiroska de frutos rojos con frambuesa, mora y menta en vaso bajo", "galeria": [{"src": "images/barra-frutos-rojos.webp", "ancho": 1600, "alto": 900, "alt": "Caipiroska de frutos rojos sobre la barra oscura"}], "lleva": "Vodka, frutos rojos, lima y azúcar", "desc": "Frutos rojos machacados con lima y azúcar, vodka y hielo. Frutal, ácido y bien frío.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 7400}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 13900}], "tags": "frutilla frambuesa mora frutos rojos lima caipi caipirinha"}, {"id": "spritz", "nombre": "Spritz", "cat": "refrescantes", "base": "aperitivo", "intensidad": "suave", "rango": 3, "img": "images/spritz.webp", "ancho": 960, "alto": 1200, "alt": "Spritz naranja con rodaja de naranja en copa de vino", "galeria": [{"src": "images/spritz-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Spritz sobre la barra, con naranjas al costado"}], "lleva": "Aperitivo de naranja, espumante, soda y naranja", "desc": "Aperitivo amargo de naranja con espumante y soda, servido con hielo y una rodaja de naranja.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 7900}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 14900}], "tags": "aperitivo espumante burbujas naranja amargo"}, {"id": "tequila-sunrise", "nombre": "Tequila Sunrise", "cat": "tropicales", "base": "tequila", "intensidad": "media", "rango": 4, "descuento": 10, "img": "images/tequila-sunrise.webp", "ancho": 900, "alto": 1125, "alt": "Tequila Sunrise naranja con rodaja de naranja en vaso alto", "galeria": [{"src": "images/tequila-sunrise-alto.webp", "ancho": 900, "alto": 1600, "alt": "Tequila Sunrise entero, del hielo a la base del vaso"}], "lleva": "Tequila, jugo de naranja y granadina", "desc": "Tequila con jugo de naranja y un hilo de granadina que baja al fondo del vaso y le da el degradé.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 7200}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 13500}], "tags": "naranja granadina degrade amanecer"}, {"id": "tropical-anana-maracuya", "nombre": "Tropical de ananá y maracuyá", "cat": "tropicales", "base": "ron", "intensidad": "suave", "rango": 5, "img": "images/tropical-anana-maracuya.webp", "ancho": 960, "alto": 1200, "alt": "Trago tropical amarillo con ananá y cereza en copa huracán", "galeria": [{"src": "images/tropical-anana-maracuya-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Trago tropical sobre la barra, con plantas atrás"}], "lleva": "Ron, ananá, maracuyá y lima", "desc": "Ron con jugo de ananá y maracuyá, un toque de lima y una tajada de ananá con cereza arriba.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 7600}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 14200}], "tags": "anana piña maracuya fruta de la pasion cereza frutal"}, {"id": "pina-colada", "nombre": "Piña colada", "cat": "tropicales", "base": "ron", "intensidad": "suave", "rango": 6, "img": "images/pina-colada.webp", "ancho": 960, "alto": 1200, "alt": "Piña colada cremosa con coco tostado en copa huracán", "galeria": [{"src": "images/pina-colada-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Piña colada sobre la barra, con cocos al costado"}], "lleva": "Ron, crema de coco y ananá, con coco tostado", "desc": "Ron, crema de coco y jugo de ananá, batidos con hielo hasta quedar cremosos. Arriba, coco tostado.", "tamanos": [{"id": "vaso", "nombre": "Vaso 500 ml", "precio": 7800}, {"id": "botella", "nombre": "Botella 1 litro", "precio": 14500}], "tags": "coco anana piña cremoso batido frozen"}, {"id": "old-fashioned", "nombre": "Old Fashioned", "cat": "clasicos", "base": "whisky", "intensidad": "intensa", "rango": 7, "img": "images/old-fashioned.webp", "ancho": 960, "alto": 1200, "alt": "Old Fashioned ámbar con piel de naranja y hielo grande en vaso tallado", "galeria": [{"src": "images/old-fashioned-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Old Fashioned sobre la barra de mármol oscuro"}], "lleva": "Whisky, azúcar, amargo de angostura y piel de naranja", "desc": "Whisky con azúcar y amargo de angostura, revuelto sobre un hielo grande y perfumado con piel de naranja.", "tamanos": [{"id": "vaso", "nombre": "Vaso 250 ml", "precio": 8900}, {"id": "botella", "nombre": "Botella 750 ml", "precio": 16900}], "tags": "bourbon whiskey angostura amargo naranja corto"}, {"id": "pisco-sour", "nombre": "Pisco sour", "cat": "clasicos", "base": "pisco", "intensidad": "media", "rango": 8, "img": "images/pisco-sour.webp", "ancho": 960, "alto": 1200, "alt": "Pisco sour con espuma y espiral de limón en copa", "galeria": [{"src": "images/pisco-sour-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Pisco sour sobre la barra, con la coctelera atrás"}], "lleva": "Pisco, limón, almíbar y clara batida", "desc": "Pisco con jugo de limón y almíbar, batido con clara hasta formar la espuma, con una espiral de limón.", "tamanos": [{"id": "vaso", "nombre": "Vaso 250 ml", "precio": 8200}, {"id": "botella", "nombre": "Botella 750 ml", "precio": 15500}], "tags": "sour limon espuma clara acido"}, {"id": "bramble-moras-romero", "nombre": "Bramble de moras y romero", "cat": "clasicos", "base": "gin", "intensidad": "media", "rango": 9, "img": "images/bramble-moras-romero.webp", "ancho": 960, "alto": 1200, "alt": "Bramble violeta con mora y romero en vaso tallado", "galeria": [{"src": "images/bramble-moras-romero-barra.webp", "ancho": 1200, "alto": 1200, "alt": "Bramble de moras sobre la barra de mármol"}], "lleva": "Gin, limón, licor de moras y romero", "desc": "Gin con limón y almíbar sobre hielo picado, coronado con licor de moras, una mora y una rama de romero.", "tamanos": [{"id": "vaso", "nombre": "Vaso 250 ml", "precio": 8400}, {"id": "botella", "nombre": "Botella 750 ml", "precio": 15900}], "tags": "moras romero violeta frutos del bosque"}], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false && Array.isArray(p.tamanos) && p.tamanos.length);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.lleva, p.tags || '', nombreDe(CATEGORIAS, p.cat), nombreDe(BASES, p.base), nombreDe(INTENSIDADES, p.intensidad),
    ...p.tamanos.map(t => t.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.tamanos[0].precio * (1 - p.descuento / 100)) : p.tamanos[0].precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), base = lista(f.base), intensidad = lista(f.intensidad), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (base.length && !base.includes(p.base)) return false;
    if (intensidad.length && !intensidad.includes(p.intensidad)) return false;
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
const conDesc = (p, n) => (p.descuento > 0 ? Math.round(n * (1 - p.descuento / 100)) : n);
const tamDe = (p, v) => (p?.tamanos || []).find(t => t.id === v) || p?.tamanos?.[0] || null;
const precioDe = (p, v) => conDesc(p, tamDe(p, v)?.precio || 0);
const precioFinal = p => precioDe(p, p.tamanos[0].id);
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const baseDe = id => BASES.find(c => c.id === id) || { nombre: '' };
const intDe = id => INTENSIDADES.find(c => c.id === id) || { nombre: '' };
const claveLinea = (id, v) => `${id}|${v || ''}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'altotrago_cart',
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY));
      if (!Array.isArray(a)) return [];
      return a.filter(i => {
        const p = i && getProducto(i.id);
        return !!(p && i.qty > 0 && p.tamanos.some(t => t.id === i.v));
      });
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = '') {
    if (!producto.tamanos.some(t => t.id === v)) v = producto.tamanos[0].id;
    const items = this.get();
    const k = claveLinea(producto.id, v);
    const existing = items.find(i => claveLinea(i.id, i.v) === k);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get(); const it = items.find(i => claveLinea(i.id, i.v) === k); if (!it) return;
    const p = getProducto(it.id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => claveLinea(i.id, i.v) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const Datos = {
  KEY: 'altotrago_datos',
  v: { modo: 'retiro', nombre: '', tel: '', dir: '', ref: '', cuando: 'ya', hora: '', obs: '', mayor: false },
  cargar() {
    try {
      const g = JSON.parse(localStorage.getItem(this.KEY));
      if (!g || typeof g !== 'object') return;
      ['nombre', 'tel', 'dir', 'ref', 'hora', 'obs'].forEach(k => { if (typeof g[k] === 'string') this.v[k] = g[k].slice(0, 240); });
      if (g.modo === 'delivery' || g.modo === 'retiro') this.v.modo = g.modo;
      if (g.cuando === 'ya' || g.cuando === 'hora') this.v.cuando = g.cuando;
    } catch { }
  },
  set(k, val, origen) {
    if (!(k in this.v)) return;
    this.v[k] = val;
    try { const { mayor: _mayor, ...resto } = this.v; localStorage.setItem(this.KEY, JSON.stringify(resto)); } catch { }
    document.dispatchEvent(new CustomEvent('datos:updated', { detail: { origen, campo: k } }));
  },
};
Datos.cargar();

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
  refrescantes: svgIco('<path d="M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z"/><path d="M19.65 15.66A8 8 0 0 1 8.35 4.34"/><path d="m14 10-5.5 5.5"/><path d="M14 17.85V10H6.15"/>'),
  tropicales: svgIco('<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>'),
  clasicos: svgIco('<path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  flecha: svgIco('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  vaso: svgIco('<path d="M5 3h14l-1.6 16.2A2 2 0 0 1 15.4 21H8.6a2 2 0 0 1-2-1.8z"/><path d="M5.6 9h12.8"/>'),
};
const CARRITO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p, v) {
  const desc = p.descuento > 0;
  const t = tamDe(p, v);
  return `<span class="precio${desc ? ' precio--desc' : ''}"><b>${formatearPrecio(precioDe(p, t.id))}</b>${desc ? `<s>${formatearPrecio(t.precio)}</s>` : ''}</span>`;
}
const fotoHTML = (p, alt = true) => `<img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${alt ? esc(p.alt) : ''}">`;
const badgesHTML = p => (p.descuento > 0 ? `<span class="badges"><span class="badge badge--desc">-${p.descuento}%</span></span>` : '');
const tamCorto = t => t.nombre.replace('Botella ', 'Botella ').replace(' litro', ' L');

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const t0 = p.tamanos[0];
  return `<article class="card"${anim} data-card="${p.id}" data-tam="${t0.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}${badgesHTML(p)}</button>
    <div class="card__info">
      <p class="card__base">${esc(baseDe(p.base).nombre)} <span aria-hidden="true">·</span> ${esc(catDe(p.cat).nombre)}</p>
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__lleva">${esc(p.lleva)}</p>
      <div class="card__tam" role="group" aria-label="Tamaño de ${esc(p.nombre)}">${p.tamanos.map((t, i) => `<button type="button" data-card-tam="${t.id}" aria-pressed="${i === 0}">${esc(tamCorto(t))}</button>`).join('')}</div>
      <div class="card__precio" data-card-precio>${precioHTML(p, t0.id)}<small data-card-tam-txt>${esc(t0.nombre.toLowerCase())}</small></div>
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al pedido">${CARRITO_SVG}<span>Agregar</span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Pedir ahora ${ICO.flecha}</button>
    </div>
  </article>`;
}

function vcardHTML(p, animar = true, entrada = 'subir') {
  const est = entrada === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(48px)';
  const anim = animar ? ` data-animate="${entrada}" style="${est}"` : '';
  const [a, b] = p.tamanos;
  return `<article class="vcard"${anim} data-card="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${fotoHTML(p)}</button>
    ${badgesHTML(p)}
    <div class="vcard__info">
      <p class="vcard__cat">${ICO[p.cat] || ''}${esc(catDe(p.cat).nombre)} · ${esc(baseDe(p.base).nombre)}</p>
      <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
      <p class="vcard__precios"><span>${esc(tamCorto(a))} <b>${formatearPrecio(precioDe(p, a.id))}</b></span>${b ? `<span>${esc(tamCorto(b))} <b>${formatearPrecio(precioDe(p, b.id))}</b></span>` : ''}</p>
    </div>
    <button type="button" class="vcard__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} en ${esc(a.nombre.toLowerCase())} al pedido">${ICO.mas}</button>
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
  tl.from(hero.querySelectorAll('.hero2__marca'), { y: 24, opacity: 0, duration: 1 }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow > span'), { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  const sello = hero.querySelector('.sello');
  if (sello) tl.from(sello, { scale: 0.8, rotate: -40, opacity: 0, duration: 1.3, ease: 'back.out(1.6)', clearProps: 'transform,opacity,rotate,scale' }, 0.6);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('.sello__giro').forEach(g => {
    gsap.to(g, { rotate: 160, ease: 'none', scrollTrigger: { trigger: g.closest('section') || document.body, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  const foto1 = document.querySelector('.hero--m1 .hero__foto img');
  if (foto1) gsap.to(foto1, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero--m1', start: 'top top', end: 'bottom top', scrub: true } });
  const foto2 = document.querySelector('.hero2__foto img');
  if (foto2) gsap.to(foto2, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--m2', start: 'top top', end: 'bottom top', scrub: true } });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1101px)');
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
  const mq = window.matchMedia('(min-width: 1101px)');
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
  document.querySelectorAll('[data-cart-txt]').forEach(s => { s.textContent = n ? plural(n, 'trago', 'tragos') : 'Sin tragos todavía'; });
  document.documentElement.style.setProperty('--nivel', `${Math.min(18 + n * 12, 90)}%`);
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

function lineaTxt(i) {
  const p = getProducto(i.id); const t = tamDe(p, i.v);
  return `• ${i.qty} × ${p.nombre} (${t.nombre.toLowerCase()}) — ${formatearPrecio(precioDe(p, i.v) * i.qty)}`;
}
function mensajePedido(conHuecos = false) {
  const items = Cart.get();
  const d = Datos.v;
  const falta = conHuecos ? '…' : '';
  const L = ['¡Hola Alto Trago! Quiero hacer este pedido:', ''];
  if (items.length) { items.forEach(i => L.push(lineaTxt(i))); L.push('', `Total: ${formatearPrecio(Cart.total())}`); }
  else if (conHuecos) L.push('(todavía no sumaste tragos)');
  L.push('');
  L.push(`Entrega: ${d.modo === 'delivery' ? 'delivery' : 'retiro por el local'}`);
  if (d.modo === 'delivery') {
    L.push(`Dirección: ${d.dir.trim() || falta}`);
    if (d.ref.trim()) L.push(`Referencia: ${d.ref.trim()}`);
  }
  L.push(`Para: ${d.cuando === 'hora' ? (d.hora ? `las ${d.hora} hs` : falta) : 'lo antes posible'}`);
  L.push(`Nombre: ${d.nombre.trim() || falta}`);
  L.push(`Teléfono: ${d.tel.trim() || falta}`);
  if (d.obs.trim()) L.push(`Aclaraciones: ${d.obs.trim()}`);
  if (d.mayor) L.push('Confirmo que soy mayor de 18 años.');
  return L.filter((x, i, a) => !(x === '' && a[i - 1] === '')).join('\n').trim();
}

function lineasHTML(compacto) {
  const items = Cart.get();
  return items.map((i, n) => {
    const p = getProducto(i.id); const t = tamDe(p, i.v);
    const k = claveLinea(i.id, i.v);
    const max = p.stock ?? 99;
    if (compacto) {
      return `<li class="cl" data-linea="${k}">
        <span class="cl__foto">${fotoHTML(p, false)}</span>
        <span class="cl__nom"><b>${esc(p.nombre)}</b><small>${esc(t.nombre)} · ${formatearPrecio(precioDe(p, i.v))}</small></span>
        <span class="cl__pr">${formatearPrecio(precioDe(p, i.v) * i.qty)}</span>
        <span class="cl__acc"><span class="stepper stepper--chico"><button type="button" data-linea-paso="-1" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></span><button type="button" class="icon-btn icon-btn--chico" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button></span>
      </li>`;
    }
    return `<div class="linea entra" data-linea="${k}" style="--i:${n}">
      <div class="linea__foto">${fotoHTML(p, false)}</div>
      <div class="linea__info">
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__meta">${esc(t.nombre)} · ${formatearPrecio(precioDe(p, i.v))} c/u</p>
        <div class="linea__abajo">
          <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <b>${formatearPrecio(precioDe(p, i.v) * i.qty)}</b>
          <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function initLineas() {
  document.addEventListener('click', e => {
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const k = linea.dataset.linea;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { const it = Cart.get().find(i => claveLinea(i.id, i.v) === k); if (it) Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-quitar]')) { Cart.remove(k); showToast('Lo sacamos del pedido'); }
  });
}

function initComanda() {
  const coms = [...document.querySelectorAll('[data-comanda]')];
  if (!coms.length) return;
  const pintar = () => {
    const items = Cart.get();
    coms.forEach(c => {
      const cont = c.querySelector('[data-comanda-lineas]');
      cont.innerHTML = items.length ? `<ul class="comanda__ul">${lineasHTML(true)}</ul>` : `<p class="comanda__vacio">${ICO.vaso}<span>Todavía no sumaste tragos. Tocá <b>Agregar</b> en los que quieras y aparecen acá.</span></p>`;
      c.querySelector('[data-comanda-total]').textContent = formatearPrecio(Cart.total());
      c.classList.toggle('comanda--vacia', !items.length);
    });
  };
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function initVistaWsp() {
  const vistas = [...document.querySelectorAll('[data-vista-msg]')];
  if (!vistas.length) return;
  const pintar = () => {
    const txt = mensajePedido(true);
    vistas.forEach(v => { v.innerHTML = esc(txt).replace(/\*/g, '').replace(/\n/g, '<br>'); });
  };
  document.addEventListener('cart:updated', pintar);
  document.addEventListener('datos:updated', pintar);
  pintar();
}

const Forms = [];
function initForms() {
  document.querySelectorAll('[data-form-pedido]').forEach(form => {
    const p = form.dataset.formPedido;
    const campos = [...form.querySelectorAll('[data-campo]')];
    const tel = form.querySelector('[data-campo="tel"]');
    let mask = null;
    if (tel && typeof IMask !== 'undefined') {
      try {
        mask = IMask(tel, { mask: [{ mask: '+{54} 9 (000) 000-0000' }, { mask: '+{54} 9 (00) 0000-0000' }, { mask: '+{54} 9 (0000) 00-0000' }] });
      } catch { mask = null; }
    }
    const enviar = form.querySelector('[data-enviar]');
    const limpiarError = campo => {
      const el = form.querySelector(`[data-campo="${campo}"]`);
      const box = form.querySelector(`#${p}-${campo}-err`);
      el?.removeAttribute('aria-invalid');
      if (box) { box.hidden = true; box.textContent = ''; }
    };
    const valor = el => (el.type === 'checkbox' ? el.checked : el === tel && mask ? mask.value : el.value);
    const pintar = () => {
      const d = Datos.v;
      campos.forEach(el => {
        const k = el.dataset.campo;
        if (el.type === 'radio') el.checked = el.value === d[k];
        else if (el.type === 'checkbox') el.checked = !!d[k];
        else if (el !== document.activeElement) {
          if (el === tel && mask) { if (mask.value !== d.tel) mask.value = d.tel; }
          else if (el.value !== d[k]) el.value = d[k];
        }
      });
      form.querySelectorAll('[data-solo-delivery]').forEach(x => { x.hidden = d.modo !== 'delivery'; });
      form.querySelectorAll('[data-solo-hora]').forEach(x => { x.hidden = d.cuando !== 'hora'; });
      if (enviar) enviar.href = waLink(mensajePedido());
    };
    campos.forEach(el => {
      const k = el.dataset.campo;
      const ev = el.type === 'radio' || el.type === 'checkbox' || el.type === 'time' ? 'change' : 'input';
      if (el === tel && mask) mask.on('accept', () => { Datos.set('tel', mask.value, form); limpiarError('tel'); });
      else el.addEventListener(ev, () => { Datos.set(k, valor(el), form); limpiarError(k); });
    });
    const validar = () => {
      const d = Datos.v;
      const errores = [];
      const err = (campo, msg) => {
        const el = form.querySelector(`[data-campo="${campo}"]`);
        const box = form.querySelector(`#${p}-${campo}-err`);
        el?.setAttribute('aria-invalid', 'true');
        if (box) { box.textContent = msg; box.hidden = false; }
        if (el) errores.push(el);
      };
      ['nombre', 'tel', 'dir', 'hora', 'mayor'].forEach(limpiarError);
      if (d.nombre.trim().length < 2) err('nombre', 'Contanos a nombre de quién va el pedido.');
      const digitos = d.tel.replace(/\D/g, '').replace(/^549/, '').replace(/^54/, '');
      if (digitos.length < 10) err('tel', 'Revisá el teléfono: con característica, sin 0 ni 15.');
      if (d.modo === 'delivery' && d.dir.trim().length < 5) err('dir', 'Decinos a qué dirección te lo llevamos.');
      if (d.cuando === 'hora' && !d.hora) err('hora', 'Elegí el horario.');
      if (!d.mayor) err('mayor', 'Para pedir tragos con alcohol tenés que ser mayor de 18 años.');
      return errores;
    };
    const intentar = e => {
      if (!Cart.count()) {
        e?.preventDefault();
        showToast('Sumá al menos un trago al pedido');
        if (p === 'd') Drawer.paso(1);
        else document.getElementById('carta')?.scrollIntoView({ block: 'start' });
        return false;
      }
      const errores = validar();
      if (errores.length) {
        e?.preventDefault();
        errores[0].focus();
        showToast('Te falta completar algún dato');
        return false;
      }
      enviar.href = waLink(mensajePedido());
      showToast('¡Listo! Se abrió WhatsApp con tu pedido: mandalo y te confirmamos.');
      return true;
    };
    enviar?.addEventListener('click', e => { intentar(e); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (intentar(null)) window.open(enviar.href, '_blank', 'noopener');
    });
    document.addEventListener('datos:updated', ev => { if (ev.detail?.origen !== form) pintar(); else if (enviar) enviar.href = waLink(mensajePedido()); });
    document.addEventListener('datos:updated', ev => { if (ev.detail?.origen === form) { form.querySelectorAll('[data-solo-delivery]').forEach(x => { x.hidden = Datos.v.modo !== 'delivery'; }); form.querySelectorAll('[data-solo-hora]').forEach(x => { x.hidden = Datos.v.cuando !== 'hora'; }); } });
    document.addEventListener('cart:updated', () => { if (enviar) enviar.href = waLink(mensajePedido()); });
    pintar();
    Forms.push({ form, pintar });
  });
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
      if (e.target.closest('[data-ir-datos]')) { this.paso(2); return; }
      if (e.target.closest('[data-volver-pedido]')) { this.paso(1); return; }
      if (e.target.closest('[data-ir-tienda]')) this.close();
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render());
    this.render();
  },
  render() {
    if (!this.el) return;
    const cont = this.el.querySelector('[data-cart-lineas]');
    const foot = this.el.querySelector('[data-cart-foot]');
    const items = Cart.get();
    const res = this.el.querySelector('[data-drawer-resumen]');
    if (res) res.innerHTML = items.length ? `<b>${plural(Cart.count(), 'trago', 'tragos')}</b> · ${formatearPrecio(Cart.total())}` : 'Tu pedido está vacío';
    if (!items.length) {
      cont.innerHTML = `<div class="drawer__vacio"><span class="vaso vaso--vacio" aria-hidden="true"><i></i></span><p class="drawer__vacio-titulo">Todavía no hay tragos en tu pedido</p><p>Elegí un mojito, una piña colada o lo que tengas ganas, en vaso o en botella.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ver la carta</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    cont.innerHTML = lineasHTML(false);
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  paso(n) {
    if (!this.el) return;
    if (n === 2 && !Cart.count()) { showToast('Sumá al menos un trago al pedido'); n = 1; }
    this.el.querySelectorAll('[data-paso]').forEach(x => { x.hidden = Number(x.dataset.paso) !== n; });
    const t = this.el.querySelector('[data-drawer-titulo]');
    if (t) t.textContent = n === 2 ? 'Tus datos' : 'Tu pedido';
    this.el.querySelectorAll('.drawer__body').forEach(b => { b.scrollTop = 0; });
    setTimeout(() => (n === 2 ? this.el.querySelector('[data-paso="2"] input:not([type="radio"])') : this.el.querySelector('.drawer__head .icon-btn'))?.focus(), 60);
  },
  open(paso = 1) {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render();
    this.el.classList.toggle('drawer--anim', !reduceMotion);
    abrirCapa(this.el, this.bd);
    this.paso(paso);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null, tam: '',
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
      const tb = e.target.closest('[data-vr-tam]');
      if (tb) { this.elegirTam(tb.dataset.vrTam); return; }
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
    return [{ src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])];
  },
  mostrar(i) {
    const g = this.galeria()[i];
    const marco = this.el.querySelector('[data-vr-marco]');
    if (!g || !marco) return;
    marco.innerHTML = `<img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt="${esc(g.alt)}">`;
    this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.vrThumb) === i)));
  },
  elegirTam(id) {
    const p = this.actual; const t = tamDe(p, id); if (!t) return;
    this.tam = t.id;
    this.el.querySelectorAll('[data-vr-tam]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vrTam === t.id)));
    const pr = this.el.querySelector('[data-vr-precio]');
    if (pr) pr.innerHTML = `${precioHTML(p, t.id)}${p.descuento > 0 ? `<span class="badge badge--desc">-${p.descuento}%</span>` : ''}`;
  },
  html(p) {
    const gal = this.galeria();
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    const thumbs = gal.length > 1 ? `<div class="vr__thumbs">${gal.map((x, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver la foto ${i + 1}" aria-pressed="${i === 0}"><img src="${x.src}" width="${x.ancho}" height="${x.alto}" alt=""></button>`).join('')}</div>` : '';
    const tams = `<div class="vr__tams" role="group" aria-label="Elegí el tamaño">${p.tamanos.map((t, i) => `<button type="button" class="tam-btn" data-vr-tam="${t.id}" aria-pressed="${i === 0}"><b>${esc(t.nombre)}</b><span>${formatearPrecio(precioDe(p, t.id))}</span></button>`).join('')}</div>`;
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto" data-vr-marco><img src="${gal[0].src}" width="${gal[0].ancho}" height="${gal[0].alto}" alt="${esc(gal[0].alt)}"></div>
        ${thumbs}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${ICO[p.cat] || ''}${esc(catDe(p.cat).nombre)} · ${esc(baseDe(p.base).nombre)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio" data-vr-precio>${precioHTML(p, p.tamanos[0].id)}${p.descuento > 0 ? `<span class="badge badge--desc">-${p.descuento}%</span>` : ''}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        <p class="vr__lleva"><b>Lleva:</b> ${esc(p.lleva)}</p>
        <p class="vr__sub">Tamaño</p>
        ${tams}
        <div class="vr__acciones">
          <div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="btn btn--ghost" data-vr-add>Agregar al pedido</button>
          <button type="button" class="btn btn--cta" data-vr-buy>Pedir ahora</button>
        </div>
        <a class="vr__wsp" href="${waLink(`Hola Alto Trago! Quiero consultar por el ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
        <dl class="vr__datos"><div><dt>Base</dt><dd>${esc(baseDe(p.base).nombre)}</dd></div><div><dt>Intensidad</dt><dd>${esc(intDe(p.intensidad).nombre)}</dd></div><div><dt>Tamaños</dt><dd>${p.tamanos.map(t => esc(t.nombre)).join(' o ')}</dd></div></dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><p class="vr__sub">También te puede gustar</p><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><span class="mini__foto">${fotoHTML(r, false)}</span><span><b>${esc(r.nombre)}</b><small>Desde ${formatearPrecio(precioFinal(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  open(id, tam) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.tam = p.tamanos[0].id;
    this.cuerpo.innerHTML = this.html(p);
    if (tam) this.elegirTam(tam);
    this.el.setAttribute('aria-label', p.nombre);
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(pedir) {
    const p = this.actual; if (!p) return;
    const n = Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1;
    Cart.add(p, n, this.tam);
    if (pedir) { this.close(true); Drawer.open(); return; }
    showToast(`Sumaste ${n > 1 ? `${n} ` : ''}${p.nombre} (${tamDe(p, this.tam).nombre.toLowerCase()}) al pedido`);
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
    const tb = e.target.closest('[data-card-tam]');
    if (tb) {
      const card = tb.closest('[data-card]');
      const p = getProducto(card?.dataset.card); const t = tamDe(p, tb.dataset.cardTam);
      if (!p || !t) return;
      card.dataset.tam = t.id;
      card.querySelectorAll('[data-card-tam]').forEach(b => b.setAttribute('aria-pressed', String(b === tb)));
      const pr = card.querySelector('[data-card-precio]');
      if (pr) pr.innerHTML = `${precioHTML(p, t.id)}<small data-card-tam-txt>${esc(t.nombre.toLowerCase())}</small>`;
      return;
    }
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
    const card = add.closest('[data-card]');
    const v = card?.dataset.tam || p.tamanos[0].id;
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    Cart.add(p, n, v);
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const etiqueta = add.querySelector('span');
    add.classList.add('ok');
    if (etiqueta) etiqueta.textContent = '¡Sumado!';
    setTimeout(() => { add.classList.remove('ok'); if (etiqueta) etiqueta.textContent = 'Agregar'; }, 1400);
    showToast(`Sumaste ${n > 1 ? `${n} ` : ''}${p.nombre} (${tamDe(p, v).nombre.toLowerCase()}) al pedido`);
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

function initVitrinas() {
  document.querySelectorAll('[data-vitrina]').forEach(cont => {
    const limite = Number(cont.dataset.limite) || 8;
    const items = Tienda.consultar({ limite }).items;
    cont.innerHTML = items.map(p => (cont.dataset.vitrina === 'm2' ? vcardHTML(p, true, 'der') : cardHTML(p, true))).join('');
  });
}

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

function initRiel() {
  const vp = document.querySelector('[data-riel]');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('.riel__track');
  const prev = document.querySelector('[data-riel-prev]');
  const next = document.querySelector('[data-riel-next]');
  const paso = () => (track.querySelector('.vcard')?.getBoundingClientRect().width || 300) + 20;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2 && vp.scrollLeft <= 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [g, v] = el.dataset.cuenta.split(':');
    el.textContent = plural(Tienda.contar({ [g]: [v] }), 'trago', 'tragos');
  });
  document.querySelectorAll('[data-total-carta]').forEach(el => { el.textContent = `(${Tienda.contar()})`; });
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
    base: (params.get('base') || '').split(',').filter(v => valida(BASES, v)),
    intensidad: (params.get('intensidad') || '').split(',').filter(v => valida(INTENSIDADES, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    ['cat', 'base', 'intensidad'].forEach(g => { if (sin !== g && e[g].length) f[g] = e[g]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('base', e.base.join(','));
    set('intensidad', e.intensidad.join(','));
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
    ['cat', 'base', 'intensidad'].forEach(g => document.querySelectorAll(`input[data-f="${g}"]`).forEach(i => { i.checked = e[g].includes(i.value); }));
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.length === 1 && e.cat[0] === c.dataset.catChip : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => { const [g, v] = s.dataset.n.split(':'); s.textContent = cuentaDe(g, v); });
    const activos = e.cat.length + e.base.length + e.intensidad.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = e.cat.length + e.base.length + e.intensidad.length + (e.precio ? 1 : 0);
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
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'trago' : 'tragos'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${plural(total, 'trago', 'tragos')}${donde}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (q ? `Mostrando ${mostrados}${cursor ? ' · hay más' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
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
    e.cat = []; e.base = []; e.intensidad = []; e.precio = ''; e.q = '';
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
initCuentas();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initNav();
initModelBarScroll();
initLineas();
Drawer.init();
Vista.init();
initCardAcciones();
initFloats();
initRiel();
initComanda();
initForms();
initVistaWsp();
updateCartBadge();
abrirProductoDeUrl();
