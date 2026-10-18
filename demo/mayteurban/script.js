const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492634959322';
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

const CATEGORIAS = [
  { id: 'calzado', nombre: 'Calzado', bajada: 'Zapatillas de running y training', img: 'images/p-zapatillas-negras.webp',
    texto: 'Zapatillas de running y de training, en numeración del 35 al 44.',
    subs: [{ id: 'running', nombre: 'Running' }, { id: 'training', nombre: 'Training' }] },
  { id: 'indumentaria', nombre: 'Indumentaria', bajada: 'Camperas, remeras, calzas y shorts', img: 'images/p-campera-impermeable.webp',
    texto: 'Camperas, remeras técnicas, calzas, joggers y shorts para entrenar y para todos los días.',
    subs: [{ id: 'camperas', nombre: 'Camperas' }, { id: 'remeras', nombre: 'Remeras' }, { id: 'pantalones', nombre: 'Calzas y pantalones' }, { id: 'shorts', nombre: 'Shorts' }] },
  { id: 'accesorios', nombre: 'Accesorios', bajada: 'Mochilas, gorras y botellas', img: 'images/p-mochila-urbana.webp',
    texto: 'Mochilas deportivas y urbanas, gorras y botellas térmicas.',
    subs: [{ id: 'mochilas', nombre: 'Mochilas' }, { id: 'gorras', nombre: 'Gorras' }, { id: 'botellas', nombre: 'Botellas' }] },
];
const USOS = [
  { id: 'running', nombre: 'Running', texto: 'Zapatillas livianas, remeras dry y shorts para sumar kilómetros.' },
  { id: 'training', nombre: 'Training', texto: 'Para el gimnasio, el funcional y la clase de los martes.' },
  { id: 'urbano', nombre: 'Urbano', texto: 'Zapatillas, joggers y mochilas para el día a día.' },
  { id: 'outdoor', nombre: 'Outdoor', texto: 'Camperas con capucha, mochilas y botellas para salir.' },
];
const COLORES = [{ id: 'blanco', nombre: 'Blanco' }, { id: 'negro', nombre: 'Negro' }, { id: 'gris', nombre: 'Gris' }, { id: 'rojo', nombre: 'Rojo' }];
const TALLES_CALZADO = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'];
const TALLES_ROPA = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TALLES = [...TALLES_CALZADO, ...TALLES_ROPA];
const PRECIOS = [
  { id: 'hasta40', nombre: 'Hasta $40.000', min: null, max: 40000 },
  { id: '40a90', nombre: '$40.000 a $90.000', min: 40001, max: 90000 },
  { id: 'mas90', nombre: 'Más de $90.000', min: 90001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Más pedidos' }, { id: 'nuevos', nombre: 'Recién llegados' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  calzado: 'zapatilla zapatillas calzado championes', indumentaria: 'ropa indumentaria prenda', accesorios: 'accesorio accesorios',
  running: 'running correr runner', training: 'training gimnasio gym funcional entrenar', urbano: 'urbano urbana calle diario', outdoor: 'outdoor montana lluvia viento',
  camperas: 'campera camperas rompeviento abrigo', remeras: 'remera remeras camiseta dry', pantalones: 'calza calzas pantalon jogger', shorts: 'short shorts bermuda',
  mochilas: 'mochila mochilas bolso', gorras: 'gorra gorras cap', botellas: 'botella termo botellas',
  blanco: 'blanco blanca', negro: 'negro negra', gris: 'gris', rojo: 'rojo roja bordo',
};
const T_CALZADO = { tipo: 'Talle', ops: ['36', '37', '38', '39', '40', '41', '42', '43', '44'] };
const T_ROPA = { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL', 'XXL'] };

const Tienda = crearTienda([
  { id: 'zapatillas-running-mesh', nombre: 'Zapatillas Running Mesh Blanco y Rojo', cat: 'calzado', sub: 'running', uso: ['running', 'training'], color: 'blanco', precio: 119999, descuento: 0, stock: 12, alta: 30, rango: 1, tag: 'Nueva colección',
    var: { tipo: 'Talle', ops: ['35', '36', '37', '38', '39', '40', '41', '42', '43'] }, img: 'images/p-zapatillas-blancas.webp', escena: 'images/zapatillas-blancas-vertical.webp',
    alt: 'Par de zapatillas de running blancas con detalles rojos en la suela, los ojales y el talón, sobre un cubo blanco', desc: 'Capellada de malla calada que respira, suela con amortiguación y detalles rojos en ojales, talón y suela. Para correr o entrenar.' },
  { id: 'zapatillas-training-black', nombre: 'Zapatillas Training Total Black', cat: 'calzado', sub: 'training', uso: ['training', 'urbano'], color: 'negro', precio: 124999, descuento: 0, stock: 9, alta: 26, rango: 2,
    var: T_CALZADO, img: 'images/p-zapatillas-negras.webp', escena: null,
    alt: 'Par de zapatillas negras de malla con suela negra alta y ondulada, sobre fondo blanco', desc: 'Todo negro, de la malla a la suela. Suela alta y ondulada que acompaña el paso en el gimnasio y en la calle.' },
  { id: 'campera-impermeable', nombre: 'Campera Rompeviento con Capucha', cat: 'indumentaria', sub: 'camperas', uso: ['outdoor', 'urbano'], color: 'negro', precio: 139999, descuento: 0, stock: 6, alta: 29, rango: 3, tag: 'Nueva colección',
    var: T_ROPA, img: 'images/p-campera-impermeable.webp', escena: null,
    alt: 'Campera negra rompeviento con capucha, cierre central rojo y bolsillos con cierre rojo', desc: 'Tela técnica que corta el viento, capucha regulable, cierre central y tres bolsillos con cierre. Puños con abrojo.' },
  { id: 'calza-termica', nombre: 'Calza Larga Térmica Gris Melange', cat: 'indumentaria', sub: 'pantalones', uso: ['running', 'training'], color: 'gris', precio: 49999, descuento: 10, stock: 10, alta: 24, rango: 4,
    var: { tipo: 'Talle', ops: ['XS', 'S', 'M', 'L', 'XL'] }, img: 'images/p-calza.webp', escena: null,
    alt: 'Calza larga gris melange doblada, con costuras rojas a lo largo de la pierna y cintura alta', desc: 'Interior afelpado para los días frescos, cintura alta y costuras rojas que siguen la pierna. Para correr o para la clase.' },
  { id: 'mochila-urbana-22', nombre: 'Mochila Urbana 22 L', cat: 'accesorios', sub: 'mochilas', uso: ['urbano', 'outdoor'], color: 'negro', precio: 69999, descuento: 0, stock: 14, alta: 25, rango: 5,
    var: null, img: 'images/p-mochila-urbana.webp', escena: null,
    alt: 'Mochila negra urbana vista de frente y de costado, con tiradores rojos y bolsillos laterales de red', desc: 'Compartimento principal, bolsillo frontal con cierre y dos laterales de red para la botella. Tiradores rojos y espalda acolchada.' },
  { id: 'remera-dry', nombre: 'Remera Dry Fit Roja', cat: 'indumentaria', sub: 'remeras', uso: ['running', 'training'], color: 'rojo', precio: 29999, descuento: 0, stock: 20, alta: 22, rango: 6,
    var: T_ROPA, img: 'images/p-remera.webp', escena: null,
    alt: 'Remera deportiva roja de manga corta con paneles laterales de malla calada', desc: 'Tela liviana de secado rápido con paneles laterales calados para ventilar. Cuello redondo y mangas ranglan.' },
  { id: 'zapatillas-running-gris', nombre: 'Zapatillas Running Gris Perla', cat: 'calzado', sub: 'running', uso: ['running', 'urbano'], color: 'gris', precio: 109999, descuento: 15, stock: 5, alta: 21, rango: 7,
    var: T_CALZADO, img: 'images/p-zapatillas-grises.webp', escena: 'images/hero-coleccion.webp',
    alt: 'Par de zapatillas de running gris perla con suela blanca y detalles rojos', desc: 'Malla gris perla, suela blanca con amortiguación y un toque rojo en el talón. Para el rodaje de todos los días.' },
  { id: 'short-vivos', nombre: 'Short Deportivo con Vivos', cat: 'indumentaria', sub: 'shorts', uso: ['running', 'training'], color: 'gris', precio: 34999, descuento: 0, stock: 16, alta: 20, rango: 8,
    var: T_ROPA, img: 'images/p-short.webp', escena: null,
    alt: 'Short deportivo gris oscuro con cintura elástica, cordón y vivos rojos a los costados', desc: 'Cintura elástica con cordón, bolsillos laterales, vivos rojos y tajos con malla para moverte cómodo.' },
  { id: 'campera-entrenamiento', nombre: 'Campera de Entrenamiento con Vivos', cat: 'indumentaria', sub: 'camperas', uso: ['training', 'running'], color: 'negro', precio: 89999, descuento: 0, stock: 7, alta: 28,
    var: T_ROPA, img: 'images/p-campera-entrenamiento.webp', escena: 'images/hero-coleccion.webp',
    alt: 'Campera negra de entrenamiento doblada, con cuello alto forrado en rojo y vivos rojos en los hombros', desc: 'Cierre completo, cuello alto con interior rojo y vivos rojos en hombros y mangas. Abriga sin pesar.' },
  { id: 'jogger-vivos', nombre: 'Pantalón Jogger con Vivos', cat: 'indumentaria', sub: 'pantalones', uso: ['training', 'urbano'], color: 'negro', precio: 64999, descuento: 0, stock: 8, alta: 27,
    var: T_ROPA, img: 'images/p-jogger.webp', escena: 'images/hero-coleccion.webp',
    alt: 'Pantalón jogger negro doblado, con paneles de malla roja en la pierna', desc: 'Jogger de tela técnica con cintura elástica y paneles de malla roja en la pierna. Va con la campera de entrenamiento.' },
  { id: 'mochila-30-notebook', nombre: 'Mochila Deportiva 30 L con Portanotebook', cat: 'accesorios', sub: 'mochilas', uso: ['urbano', 'outdoor'], color: 'negro', precio: 84999, descuento: 0, stock: 6, alta: 23,
    var: null, img: 'images/p-mochila-30.webp', escena: 'images/hero-coleccion.webp',
    alt: 'Mochila deportiva negra grande con cierre frontal rojo y correas laterales', desc: '30 litros, compartimento acolchado para notebook, cierres verticales al frente y correas para ajustar la carga.' },
  { id: 'gorra-negra', nombre: 'Gorra Deportiva Negra', cat: 'accesorios', sub: 'gorras', uso: ['running', 'urbano'], color: 'negro', precio: 24999, descuento: 0, stock: 18, alta: 19,
    var: null, img: 'images/p-gorra.webp', escena: null,
    alt: 'Gorra negra de seis paneles con visera curva', desc: 'Seis paneles de algodón, visera curva y ajuste trasero. Talle único.' },
  { id: 'botella-termica', nombre: 'Botella Térmica Roja 750 ml', cat: 'accesorios', sub: 'botellas', uso: ['training', 'outdoor'], color: 'rojo', precio: 27999, descuento: 0, stock: 15, alta: 18,
    var: null, img: 'images/p-botella.webp', escena: null,
    alt: 'Botella térmica roja de acero con tapa y base plateadas', desc: 'Acero inoxidable de doble pared, 750 ml, tapa a rosca. Mantiene el agua fría en el entrenamiento.' },

  { id: 'bolso-deportivo', nombre: 'Bolso Deportivo 40 L', cat: 'accesorios', sub: 'mochilas', uso: ['training'], color: 'negro', precio: 79999, descuento: 0, stock: 0, alta: 31, visible: false,
    var: null, img: 'images/p-mochila-30.webp', escena: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ETIQUETAS[p.color] || '', ...(p.uso || []).map(u => ETIQUETAS[u] || u),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), uso = lista(f.uso), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (uso.length && !(p.uso || []).some(u => uso.includes(u))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !(p.var?.tipo === 'Talle' && p.var.ops.some(t => talle.includes(t)))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id);
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let desde = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      desde = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(desde, desde + lim);
    const hayMas = desde + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const talles = {}, colores = {}, usos = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      if (p.var?.tipo === 'Talle') p.var.ops.forEach(t => { talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
      (p.uso || []).forEach(u => { usos[u] = (usos[u] || 0) + 1; });
    });
    return { talles, colores, usos };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const conVar = p => (p.var?.ops || []).length > 1;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const varTxt = (p, op) => `talle ${op}`;

const Cart = {
  KEY: 'mayteurban_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'mayteurban_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  zapa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16.5V9.6a1 1 0 0 1 1.3-.95l3.2 1.05 2-2.2a1 1 0 0 1 1.5.05l3.4 4.2 5.6 1.6a2 2 0 0 1 1.45 1.93v1.22a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M3 14h18M10.5 10.5l1.2 1.5M12.8 9.8l1.2 1.5"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function metaDe(p) {
  return `${subDe(p)?.nombre || ''} · ${nombreDe(CATEGORIAS, p.cat)}`;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 5) b.push(`<span class="etiqueta etiqueta--clara">${p.cat === 'calzado' ? 'Últimos pares' : 'Últimas unidades'}</span>`);
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tallesHTML(p) {
  if (p.var?.tipo !== 'Talle') return '';
  const ops = p.var.ops;
  const vista = ops.length > 6 ? [ops[0], '…', ops[ops.length - 1]] : ops;
  return `<span class="prod__talles" aria-hidden="true"><span class="prod__talles-tit">Talles</span>${vista.map(t => `<span>${esc(t)}</span>`).join('')}</span>`;
}

function cardHTML(p, { compacta = false, grande = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const foto = `<a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    const accion = conVar(p)
      ? `<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir talle y agregar: ${nombre}">${ICON.carritoMas}</button>`
      : `<button type="button" class="prod-mini" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}</button>`;
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}">
      ${media}
      <div class="prod__body">
        <p class="prod__meta">${esc(metaDe(p))}</p>
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}${accion}</div>
      </div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">Talle de ${nombre}</span><select data-op><option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      ${precioHTML(p)}
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="52" height="52" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-deportes"><p class="cats-deportes__tit">Por deporte</p>${USOS.map(u => `<a href="${CATALOGO_URL}?uso=${u.id}">${esc(u.nombre)} <span class="cats-item__n">${Tienda.contar({ uso: u.id })}</span></a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search[hidden], .header-search.es-plegable');
  if (!btn || !form) return;
  form.classList.add('es-plegable');
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8 }, 0));
  tl.from(hero.querySelectorAll('.hero-vivo'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1.1, clearProps: 'transform' }, 0.05)
    .from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 44, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('.hero-sello'), { scale: 0.92, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
  document.querySelectorAll('[data-girar]').forEach(el => {
    gsap.to(el, { rotation: 120, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(box => {
    const vp = box.querySelector('.rail-vp');
    const track = box.querySelector('.rail-track');
    const prev = box.querySelector('[data-rail-prev]');
    const next = box.querySelector('[data-rail-next]');
    if (!vp || !track) return;
    const flechas = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    const paso = () => {
      const card = track.children[0];
      return card ? card.getBoundingClientRect().width + (parseFloat(window.getComputedStyle(track).columnGap) || 16) : vp.clientWidth * 0.8;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    flechas();

    let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
      }
      if (moved) vp.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      let destino = null;
      if (moved) {
        matar = true;
        setTimeout(() => { matar = false; }, 60);
        const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
        const posiciones = [...track.children].map(c => c.offsetLeft - inicio);
        if (posiciones.length) {
          const max = vp.scrollWidth - vp.clientWidth;
          destino = posiciones.reduce((a, b) => (Math.abs(b - vp.scrollLeft) < Math.abs(a - vp.scrollLeft) ? b : a));
          destino = Math.max(0, Math.min(destino, max));
        }
      }
      vp.classList.remove('dragging');
      if (destino !== null) vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
      pointerId = null; moved = false;
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('lostpointercapture', end);
    vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); } }, true);
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const tpl = (p, op = {}) => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p, op)}</li>`;
  const grilla = document.getElementById('grillaPedidos');
  if (grilla) grilla.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items.map(p => tpl(p)).join('');
  const mosaico = document.getElementById('mosaicoPedidos');
  let enMosaico = [];
  if (mosaico) {
    const items = Tienda.consultar({ orden: 'destacados', limite: 7 }).items;
    enMosaico = items.map(p => p.id);
    mosaico.innerHTML = items.map((p, k) => tpl(p, { compacta: true, grande: k === 0 })).join('')
      + `<li class="mosaico__cta-li" data-animate="subir" style="opacity:0;transform:translateY(48px)"><a class="mosaico-cta" href="${CATALOGO_URL}"><span class="mosaico-cta__n">${Tienda.contar({})}</span><strong>productos entre calzado, indumentaria y accesorios</strong><span class="mosaico-cta__link">Ver todo el catálogo ${ICON.flecha}</span></a></li>`;
  }
  const rail = document.getElementById('railNuevos');
  if (rail) {
    const items = Tienda.consultar({ orden: 'nuevos', filtros: { excluir: enMosaico }, limite: 8 }).items;
    rail.innerHTML = items.map(p => `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { compacta: true })}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const [cat, sub] = el.dataset.catN.split(':');
    const n = Tienda.contar(sub ? { cat, sub } : { cat });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-uso-n]').forEach(el => {
    const n = Tienda.contar({ uso: el.dataset.usoN });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: p.escena.includes('coleccion') ? 'El producto junto al resto de la colección: zapatillas, campera, jogger, mochila y botella' : `Otra vista: ${p.alt}` });
  const msg = `Hola Mayte Urban! Quiero que un asesor me ayude con ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''}.`;
  const on = Favs.has(p.id);
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${fotos[QV.foto].src.includes('vertical') ? ' qv__principal--alta' : ''}"><img src="${fotos[QV.foto].src}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || '')}${sub ? ' · ' : ''}${esc(cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__dato"><span>Ideal para</span>${(p.uso || []).map(u => esc(nombreDe(USOS, u))).join(' · ')}</p>
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}¿Dudás con el talle? Preguntale a un asesor</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre,
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : ''; QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola Mayte Urban! Quiero que un asesor me ayude con ${QV.p.nombre} (${varTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí tu talle para sumarlo al carrito.';
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''} al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.zapa}<p>Tu carrito está vacío. ¿Arrancamos por unas zapatillas?</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = ['Hola Mayte Urban! Quiero hacer este pedido:', ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || (Cart.count() > 0 && window.scrollY > 160));
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir); return; }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const acciones = add.closest('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (${varTxt(p, op)})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], uso: multi('uso', USOS), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];
  const tallesDe = cat => {
    const f = Tienda.facetas(cat ? { cat } : {});
    return TALLES.filter(t => f.talles[t]);
  };
  const compatibles = () => {
    if (!e.cat) e.sub = [];
    const ok = tallesDe(e.cat);
    e.talle = e.talle.filter(t => ok.includes(t));
  };
  compatibles();

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.uso.length) f.uso = e.uso;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
    if (e.oferta) f.oferta = true;
    if (e.fav) f.ids = Favs.get();
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Toda la tienda', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    const usos = USOS.filter(u => fac.usos[u.id]);
    if (usos.length) grupos.push(`<fieldset class="f-grupo"><legend>Deporte</legend>
      ${usos.map(u => opcion('checkbox', `uso-${u.id}`, u.id, esc(u.nombre), e.uso.includes(u.id), fac.usos[u.id], 'uso')).join('')}</fieldset>`);
    const talles = TALLES.filter(t => fac.talles[t]);
    if (talles.length) grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend><div class="f-talles">
      ${talles.map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div></fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const uso = !cat && e.uso.length === 1 ? USOS.find(u => u.id === e.uso[0]) : null;
    const titulo = sub ? `${sub.nombre}` : cat ? cat.nombre : uso ? uso.nombre : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.orden === 'nuevos' ? 'Recién llegados' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : uso ? uso.texto : e.oferta ? 'Productos con descuento, mientras haya talle.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Zapatillas, indumentaria deportiva, mochilas y accesorios. Elegís tu talle y lo sumás al carrito.';
    document.title = `${titulo} — Mayte Urban`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : uso ? uso.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : uso ? `${CATALOGO_URL}?uso=${uso.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta && !e.uso.length ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--oferta" href="${CATALOGO_URL}?oferta=1" data-chip-oferta${e.oferta && !e.cat ? ' aria-current="page"' : ''}>Ofertas <small>${Tienda.contar({ oferta: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.uso.forEach(v => quitar.push(['uso', v, nombreDe(USOS, v)]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'uso', 'color', 'talle', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.uso.length) u.searchParams.set('uso', e.uso.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(48px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : 'No encontramos productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    compatibles();
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  pintarFiltros();
  pintarCabecera();
  pintarActivos();
  syncURL();
  pintar(true);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    if (f.classList.contains('es-plegable')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.uso = []; e.color = []; e.talle = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-oferta]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-oferta')) { e.cat = ''; e.sub = []; e.uso = []; e.oferta = true; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.uso = []; e.oferta = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-deportes a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.uso = (u.searchParams.get('uso') || '').split(',').filter(v => USOS.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.color = []; e.talle = []; e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
  if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  modo();
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

document.addEventListener('cart:updated', updateCartBadge);
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax, initRail,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
