document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const WA = '5493584365604';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'panchos', nombre: 'Panchos', img: 'images/p-pancho-gourmet.webp',
    bajada: 'Del clásico de siempre al gourmet bien cargado: cheddar, panceta, cebolla crispy y salsas de la casa.' },
  { id: 'hamburguesas', nombre: 'Hamburguesas', img: 'images/p-hamburguesa-clasica.webp',
    bajada: 'Medallón de carne vacuna en pan brioche, con cheddar, panceta y todo lo que les va. La clásica viene simple o doble.' },
  { id: 'papas', nombre: 'Papas fritas', img: 'images/p-papas-cono.webp',
    bajada: 'En cono para comer en la mano o por porción para compartir. También con cheddar y panceta, o rústicas.' },
  { id: 'combos', nombre: 'Combos y promos', img: 'images/p-combo-encuentro.webp',
    bajada: 'Panchos, hamburguesas, papas y bebidas juntos, a menos de lo que salen por separado.' },
  { id: 'bebidas', nombre: 'Bebidas y salsas', img: 'images/p-bebidas.webp',
    bajada: 'Gaseosas bien frías y salsas para mojar las papas.' },
];
const TAGS = { cheddar: 'Cheddar', panceta: 'Panceta', crispy: 'Cebolla crispy' };
const PARA = { individual: 'Para uno', compartir: 'Para compartir' };
const RANGOS = {
  'hasta-5000': { label: 'Hasta $5.000', max: 5000 },
  '5000-10000': { label: '$5.000 a $10.000', min: 5000, max: 10000 },
  'mas-10000': { label: 'Más de $10.000', min: 10000 },
};
const ORDENES = { destacados: 'Destacados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const Servidor = crearServidor([
  { id: 'pancho-gourmet', nombre: 'Pancho gourmet', cat: 'panchos', precio: 6000, rango: 1, alta: 20, para: ['individual'],
    img: 'p-pancho-gourmet', px: 640, escena: 'images/pancho-9x16.webp', tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Pancho gourmet con cheddar fundido, panceta, cebolla crispy, salsa blanca y barbacoa',
    lleva: ['Pan de viena tostado', 'Salchicha a la parrilla', 'Cheddar fundido', 'Panceta crocante', 'Cebolla crispy', 'Salsa blanca y barbacoa'],
    desc: 'El más cargado de la casa: pan de viena grande y tostado, salchicha a la parrilla, cheddar fundido, panceta crocante, cebolla crispy, salsa blanca y barbacoa.' },
  { id: 'pancho-cheddar-verdeo', nombre: 'Pancho cheddar, panceta y verdeo', cat: 'panchos', precio: 5800, rango: 5, alta: 19, para: ['individual'],
    img: 'p-pancho-verdeo', px: 640, tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Pancho con salsa cheddar, panceta crocante y cebolla de verdeo',
    lleva: ['Salsa cheddar', 'Panceta crocante', 'Cebolla crispy', 'Verdeo fresco', 'Hilo de barbacoa'],
    desc: 'Salsa cheddar bien caliente, panceta crocante, un poco de cebolla crispy, verdeo fresco y un hilo de barbacoa.' },
  { id: 'pancho-crispy', nombre: 'Pancho crispy', cat: 'panchos', precio: 5500, alta: 18, para: ['individual'],
    img: 'p-pancho-crispy', px: 640, tags: ['cheddar', 'crispy'],
    alt: 'Pancho cubierto de cebolla crispy con cheddar y salsa blanca',
    lleva: ['Cebolla crispy', 'Cheddar', 'Salsa blanca', 'Verdeo picado'],
    desc: 'Una montaña de cebolla crispy sobre cheddar y salsa blanca, con verdeo picado.' },
  { id: 'pancho-de-la-casa', nombre: 'Pancho de la casa', cat: 'panchos', precio: 5900, alta: 17, para: ['individual'],
    img: 'p-pancho-casa', px: 600, tags: ['cheddar', 'panceta'],
    alt: 'Pancho con panceta, cheddar, salsa blanca en zigzag y verdeo',
    lleva: ['Panceta', 'Cheddar', 'Salsa blanca', 'Verdeo'],
    desc: 'Panceta, cheddar y salsa blanca en zigzag, terminado con verdeo, sobre pan de viena tostado.' },
  { id: 'pancho-clasico', nombre: 'Pancho clásico', cat: 'panchos', precio: 3500, alta: 16, para: ['individual'],
    img: 'p-pancho-clasico', px: 640, tags: ['crispy'],
    alt: 'Pancho clásico con mostaza, kétchup, pepinos agridulces y cebolla crispy',
    lleva: ['Mostaza', 'Kétchup', 'Pepinos agridulces', 'Cebolla crispy'],
    desc: 'El de siempre, bien hecho: salchicha a la plancha, mostaza, kétchup, pepinos agridulces y cebolla crispy.' },
  { id: 'pancho-vegetariano', nombre: 'Pancho vegetariano', cat: 'panchos', precio: 5200, alta: 1, visible: false, para: ['individual'],
    img: 'p-pancho-clasico', px: 640, tags: [], alt: 'Pancho vegetariano', lleva: [], desc: 'Fuera de la carta por ahora.' },

  { id: 'hamburguesa-clasica', nombre: 'Hamburguesa clásica', cat: 'hamburguesas', rango: 2, alta: 15, para: ['individual'],
    var: { nombre: 'Medallón', ops: [{ id: 'simple', label: 'Simple', precio: 7500 }, { id: 'doble', label: 'Doble', precio: 9800 }] },
    img: 'p-hamburguesa-clasica', px: 640, tags: ['cheddar'],
    alt: 'Hamburguesa con cheddar, cebolla caramelizada, tomate y lechuga en pan brioche',
    lleva: ['Medallón de carne vacuna', 'Cheddar', 'Cebolla caramelizada', 'Lechuga', 'Tomate', 'Salsa especial'],
    desc: 'Medallón de carne vacuna, cheddar, cebolla caramelizada, lechuga, tomate y salsa especial en pan brioche. Simple o doble.' },
  { id: 'hamburguesa-completa', nombre: 'Hamburguesa completa', cat: 'hamburguesas', precio: 8500, rango: 6, alta: 14, para: ['individual'],
    img: 'p-hamburguesa-completa', px: 640, tags: ['cheddar', 'panceta'],
    alt: 'Hamburguesa con cheddar, panceta, cebolla morada, tomate y lechuga',
    lleva: ['Medallón de carne vacuna', 'Cheddar', 'Panceta', 'Cebolla morada', 'Tomate', 'Lechuga', 'Salsa de la casa'],
    desc: 'La que tiene de todo: medallón, cheddar, panceta, cebolla morada, tomate, lechuga y salsa de la casa.' },
  { id: 'hamburguesa-cheddar-panceta', nombre: 'Hamburguesa cheddar y panceta', cat: 'hamburguesas', precio: 8200, alta: 13, para: ['individual'],
    img: 'p-hamburguesa-bacon', px: 390, tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Hamburguesa con cheddar fundido, panceta y lechuga en pan con sésamo',
    lleva: ['Cheddar fundido', 'Panceta crocante', 'Cebolla crispy', 'Lechuga', 'Salsa de la casa'],
    desc: 'Cheddar fundido, panceta crocante, cebolla crispy, lechuga y salsa de la casa en pan con sésamo.' },
  { id: 'hamburguesa-crispy', nombre: 'Hamburguesa crispy', cat: 'hamburguesas', precio: 8000, alta: 12, para: ['individual'],
    img: 'p-hamburguesa-crispy', px: 400, tags: ['crispy', 'panceta'],
    alt: 'Hamburguesa con salsa blanca, cebolla crispy, lechuga y tomate',
    lleva: ['Salsa blanca', 'Cebolla crispy', 'Panceta', 'Lechuga', 'Tomate'],
    desc: 'Medallón con salsa blanca, cebolla crispy, panceta, lechuga y tomate.' },

  { id: 'papas-fritas', nombre: 'Papas fritas', cat: 'papas', rango: 3, alta: 11, para: ['individual', 'compartir'],
    var: { nombre: 'Presentación', ops: [{ id: 'cono', label: 'En cono', precio: 3200, img: 'p-papas-cono' }, { id: 'porcion', label: 'Porción', precio: 4000, img: 'p-papas-porcion' }] },
    img: 'p-papas-fritas', px: 640, tags: [],
    alt: 'Papas fritas en cono y en porción, con mayonesa y kétchup',
    lleva: ['Papas en bastón', 'Sal'],
    desc: 'Papas en bastón, doradas y crocantes. En cono para comer en la mano o en porción para compartir.' },
  { id: 'papas-cheddar-panceta', nombre: 'Papas con cheddar y panceta', cat: 'papas', precio: 5800, rango: 8, alta: 10, para: ['compartir'],
    img: 'p-papas-cheddar', px: 400, tags: ['cheddar', 'panceta'],
    alt: 'Papas fritas bañadas en cheddar con panceta y verdeo',
    lleva: ['Papas fritas', 'Cheddar', 'Panceta crocante', 'Verdeo'],
    desc: 'Porción de papas bañadas en cheddar, con panceta crocante y verdeo.' },
  { id: 'papas-rusticas', nombre: 'Papas rústicas', cat: 'papas', precio: 4500, alta: 9, para: ['compartir'],
    img: 'p-papas-rusticas', px: 640, tags: [],
    alt: 'Papas rústicas condimentadas en un balde de metal',
    lleva: ['Papas cortadas gruesas', 'Con piel', 'Condimentadas'],
    desc: 'Cortadas gruesas, con piel y condimentadas, en balde para compartir.' },

  { id: 'combo-encuentro', nombre: 'Combo del encuentro', cat: 'combos', precio: 16500, rango: 4, alta: 8, para: ['compartir'],
    img: 'p-combo-encuentro', px: 640, tags: ['cheddar', 'panceta'],
    alt: 'Combo con hamburguesa, pancho y papas fritas sobre una tabla',
    incluye: [{ id: 'hamburguesa-clasica', v: 'simple' }, { id: 'pancho-gourmet' }, { id: 'papas-fritas', v: 'porcion' }, { id: 'gaseosa', v: 'cola' }],
    desc: 'Para dos con hambre: hamburguesa clásica, pancho gourmet, porción de papas fritas y una gaseosa.' },
  { id: 'duo-gourmet', nombre: 'Dúo de panchos gourmet', cat: 'combos', precio: 9900, rango: 7, alta: 7, para: ['compartir'],
    img: 'p-duo-panchos', px: 640, tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Dos panchos gourmet, uno con cebolla crispy y otro con panceta y verdeo',
    incluye: [{ id: 'pancho-crispy' }, { id: 'pancho-cheddar-verdeo' }],
    desc: 'Un pancho crispy y uno de cheddar, panceta y verdeo, para probar los dos.' },
  { id: 'combo-pancho', nombre: 'Combo pancho', cat: 'combos', precio: 9500, alta: 6, para: ['individual'],
    img: 'p-combo-pancho', px: 640, tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Pancho gourmet con papas fritas y kétchup',
    incluye: [{ id: 'pancho-gourmet' }, { id: 'papas-fritas', v: 'cono' }, { id: 'gaseosa', v: 'cola' }],
    desc: 'Pancho gourmet, papas en cono y gaseosa: el almuerzo resuelto.' },
  { id: 'trio-panchos', nombre: 'Trío de panchos', cat: 'combos', precio: 12900, alta: 5, para: ['compartir'],
    img: 'p-trio-panchos', px: 640, tags: ['cheddar', 'panceta', 'crispy'],
    alt: 'Tres panchos cargados sobre tablas de madera',
    incluye: [{ id: 'pancho-clasico' }, { id: 'pancho-crispy' }, { id: 'pancho-de-la-casa' }],
    desc: 'Tres panchos para la mesa: clásico, crispy y de la casa.' },
  { id: 'promo-compartir', nombre: 'Promo para compartir', cat: 'combos', precio: 37900, alta: 4, para: ['compartir'],
    img: 'p-promo-compartir', px: 640, escena: 'images/hero-16x9.webp', tags: ['cheddar', 'panceta'],
    alt: 'Mesa con panchos, hamburguesas, papas y salsas para compartir',
    incluye: [{ id: 'hamburguesa-cheddar-panceta', qty: 2 }, { id: 'pancho-de-la-casa', qty: 3 }, { id: 'papas-cheddar-panceta' }, { id: 'gaseosa', v: 'cola', qty: 2 }],
    desc: 'La mesa llena para cinco: dos hamburguesas cheddar y panceta, tres panchos de la casa, papas con cheddar y panceta y dos gaseosas.' },

  { id: 'gaseosa', nombre: 'Gaseosa 500 ml', cat: 'bebidas', alta: 3, para: ['individual'],
    var: { nombre: 'Sabor', ops: [{ id: 'cola', label: 'Cola', precio: 2200 }, { id: 'lima', label: 'Lima limón', precio: 2200 }, { id: 'naranja', label: 'Naranja', precio: 2200 }] },
    img: 'p-bebidas', px: 380, tags: [], alt: 'Vasos de gaseosa y té helado con hielo', lleva: ['Botella de 500 ml', 'Bien fría'],
    desc: 'Bien fría, en botella de 500 ml.' },
  { id: 'salsas', nombre: 'Salsa para dipear', cat: 'bebidas', alta: 2, para: ['individual'],
    var: { nombre: 'Sabor', ops: [{ id: 'mayonesa', label: 'Mayonesa de la casa', precio: 900 }, { id: 'ketchup', label: 'Kétchup', precio: 900 }, { id: 'barbacoa', label: 'Barbacoa', precio: 900 }, { id: 'cheddar', label: 'Cheddar', precio: 1200 }] },
    img: 'p-salsas', px: 520, tags: [], alt: 'Potecitos de mayonesa y kétchup', lleva: ['Potecito individual'],
    desc: 'Potecito para mojar las papas o sumarle al pancho.' },
], { tope: 100 });

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const nombreDeCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const desde = p => (p.var ? Math.min(...p.var.ops.map(o => o.precio)) : p.precio);
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, nombreDeCat(p.cat), p.desc, ...(p.lleva || []), ...(p.tags || []).map(t => TAGS[t] || t),
    ...(p.var ? p.var.ops.map(o => o.label) : []), p.incluye ? 'combo promo' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), tag = lista(f.tag), para = lista(f.para), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tag.length && !tag.some(t => (p.tags || []).includes(t))) return false;
    if (para.length && !para.some(t => (p.para || []).includes(t))) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.rango && RANGOS[f.rango]) {
      const r = RANGOS[f.rango], precio = desde(p);
      if (r.min != null && precio <= r.min) return false;
      if (r.max != null && precio > r.max) return false;
    }
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => ({ id: c.id, cantidad: contar({ cat: c.id }) }));
  return { TOPE: tope, consultar, contar, obtener, resumen };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Servidor.obtener(id);
const opcion = (p, v) => (p?.var ? (p.var.ops.find(o => o.id === v) || p.var.ops[0]) : null);
const precioDe = (p, v) => (p.var ? opcion(p, v).precio : p.precio);
const precioDesde = p => (p.var ? Math.min(...p.var.ops.map(o => o.precio)) : p.precio);
const varDefault = p => (p.var ? p.var.ops[0].id : '');
const imgDe = (p, v) => `images/${(p.var && v && opcion(p, v).img) || p.img}.webp`;
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
function sueltoDe(p) {
  if (!p.incluye) return 0;
  return p.incluye.reduce((s, i) => { const x = getProducto(i.id); return x ? s + precioDe(x, i.v) * (i.qty || 1) : s; }, 0);
}
const ahorroDe = p => Math.max(0, sueltoDe(p) - (p.precio || 0));
function incluyeTexto(p) {
  return (p.incluye || []).map(i => {
    const x = getProducto(i.id);
    if (!x) return '';
    const o = opcion(x, i.v);
    const qty = i.qty || 1;
    let nombre = x.id === 'papas-fritas' ? `papas ${o?.id === 'cono' ? 'en cono' : 'en porción'}` : x.id === 'gaseosa' ? 'gaseosa' : x.nombre.toLowerCase();
    if (qty > 1) nombre = nombre.replace(/^(\S+)/, w => (w.endsWith('s') ? w : w + 's'));
    return `${qty > 1 ? qty + ' ' : ''}${nombre}`;
  }).filter(Boolean).join(' + ');
}
function metaDe(p) {
  if (p.incluye) return `Incluye ${p.incluye.reduce((n, i) => n + (i.qty || 1), 0)} productos`;
  if (p.var) return p.var.ops.map(o => o.label).join(' · ');
  return (p.lleva || []).slice(0, 3).join(' · ');
}

const Cart = {
  KEY: 'saboresdeloalto_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 30);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 30) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 30)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer.open, .modal:not([hidden]), .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  subirCh: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};
function stepperHTML(nombre) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="20" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function precioHTML(p) {
  return `<p class="pcard__precio">${p.var && p.var.ops.some(o => o.precio !== p.var.ops[0].precio) ? '<small>Desde</small>' : ''}${formatearPrecio(precioDesde(p))}</p>`;
}
function cardHTML(p, { rail = false, anim = true } = {}) {
  const a = anim ? (rail ? ANIM.der : ANIM.subir) : '';
  const n = esc(p.nombre);
  const ahorro = ahorroDe(p);
  const badge = ahorro > 0 ? `<span class="pcard__badge">Ahorrás ${formatearPrecio(ahorro)}</span>` : '';
  const foto = `<button type="button" class="pcard__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}">${badge}</button>`;
  const acciones = `<div class="prod-actions">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta prod-add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carrito}<span>Agregar</span></button></div>`;
  if (rail) {
    return `<article class="pcard pcard--rail"${a}>${foto}
      <div class="pcard__info"><h3 class="pcard__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3><p class="pcard__desc">${esc(p.incluye ? incluyeTexto(p) : p.desc)}</p>${precioHTML(p)}</div>
      ${acciones}</article>`;
  }
  return `<article class="pcard"${a}>${foto}
    <div class="pcard__info"><p class="pcard__meta">${esc(metaDe(p))}</p><h3 class="pcard__nombre"><button type="button" data-quick="${p.id}">${n}</button></h3>${precioHTML(p)}
    ${acciones}<button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button></div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
document.addEventListener('cart:updated', updateCartBadge);

function waPedido() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) return waLink('¡Hola, Sabores de lo alto! Quiero hacer un pedido.');
  const txt = lineas.map(({ p, v, qty }) => {
    const o = opcion(p, v);
    return `• ${qty} × ${p.nombre}${o ? ' (' + o.label + ')' : ''}: ${formatearPrecio(precioDe(p, v) * qty)}`;
  }).join('\n');
  return waLink(`¡Hola, Sabores de lo alto! Quiero hacer este pedido:\n${txt}\nTotal: ${formatearPrecio(Cart.total())}\n¿Lo paso a buscar o me lo mandan?`);
}

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p) return false;
  const vv = p.var ? opcion(p, v).id : '';
  Cart.add(p, qty, vv);
  const extra = p.var ? ` (${opcion(p, vv).label})` : '';
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${extra} al pedido`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.pcard, .qv, .prod-actions, .qv__acciones')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 20)) : 1;
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, 20));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, cantidadDe(add), add.dataset.v || '');
      add.classList.remove('agregado'); void add.offsetWidth; add.classList.add('agregado');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '')) { cerrarQuickView(false); abrirCarrito(); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, quick); return; }
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, 20));
  });
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
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); syncNoScroll();
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); } else atraparFoco(nav, e);
  });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatMenu() {
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const resumen = Servidor.resumen();
  const href = catalogoHref();
  const activa = document.body.dataset.pagina === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  panel.innerHTML = CATEGORIAS.map(c => {
    const r = resumen.find(x => x.id === c.id);
    return `<a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="46" height="46"><span>${esc(c.nombre)}</span><span class="nav-cats__cant">${r?.cantidad || 0}</span></a>`;
  }).join('') + `<a class="nav-cats__todo" href="${href}">Ver todo el menú ${ICON.flecha}</a>`;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open') && hoverMq.matches) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target) && hoverMq.matches) cerrar(); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
}

function initEstado() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    let h;
    try { h = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/Argentina/Cordoba' }).format(new Date())); } catch { h = new Date().getHours(); }
    const abierto = h >= 12 && h <= 23;
    els.forEach(el => {
      const largo = el.closest('.topbar');
      el.textContent = abierto ? (largo ? 'Abierto ahora · hasta las 00 h' : 'Abierto ahora') : (largo ? 'Cerrado · abrimos a las 12 h' : 'Cerrado · abre 12 h');
      el.classList.toggle('is-cerrado', !abierto);
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('.hero-eyebrow .chispas'), { scale: 0.4, rotate: -30, duration: 0.9, ease: 'back.out(3)', clearProps: 'transform' }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, y: 14, duration: 1.1, stagger: 0.12, ease: 'back.out(2)', clearProps: 'transform,opacity' }, 0.7);
  const ficha = hero.querySelector('.hero__ficha');
  if (ficha) tl.from(ficha, { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.55);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const fotoPromo = document.querySelector('.promos__foto img');
    if (fotoPromo) gsap.fromTo(fotoPromo, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.promos', start: 'top bottom', end: 'bottom top', scrub: true } });
    const sello = document.querySelector('.hero .sello-wrap');
    if (sello) gsap.to(sello, { y: -30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  });
}

function renderRail() {
  const track = document.getElementById('railTrack');
  if (!track) return;
  const items = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  track.innerHTML = items.map(p => cardHTML(p, { rail: true })).join('');
  const vp = document.getElementById('railDest');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) * 1.5;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, .stepper, [data-add]')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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

function promoHTML(p) {
  const n = esc(p.nombre);
  const ahorro = ahorroDe(p);
  return `<li class="promo"${ANIM.subirCh}>
    <span class="promo__foto"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span>
    <div class="promo__txt"><button type="button" class="promo__nombre" data-quick="${p.id}">${n}</button><p class="promo__incluye">${esc(incluyeTexto(p))}</p></div>
    <div class="promo__precio">${ahorro > 0 ? `<span class="promo__ahorro">Ahorrás ${formatearPrecio(ahorro)}</span>` : ''}<strong>${formatearPrecio(p.precio)}</strong></div>
    <button type="button" class="promo__add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}</button>
  </li>`;
}
function renderPromos() {
  const cont = document.getElementById('promosLista');
  if (!cont) return;
  const ids = ['combo-encuentro', 'combo-pancho', 'trio-panchos'];
  const items = Servidor.consultar({ filtros: { cat: 'combos', ids }, orden: 'destacados', limite: 3 }).items;
  cont.innerHTML = items.map(promoHTML).join('');
  document.querySelectorAll('[data-total-combos]').forEach(el => { el.textContent = `${Servidor.contar({ cat: 'combos' })} combos`; });
}

function filaHTML(p) {
  const n = esc(p.nombre);
  const ahorro = ahorroDe(p);
  const desde = p.var && p.var.ops.some(o => o.precio !== p.var.ops[0].precio) ? '<small>desde</small>' : '';
  return `<article class="fila"${ANIM.subirCh}>
    <button type="button" class="fila__foto" data-quick="${p.id}" aria-label="Ver ${n}"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></button>
    <div class="fila__txt"><div class="fila__linea"><button type="button" class="fila__nombre" data-quick="${p.id}">${n}</button><span class="fila__puntos" aria-hidden="true"></span><span class="fila__precio">${desde}${formatearPrecio(precioDesde(p))}</span></div>
      <p class="fila__desc">${esc(p.incluye ? incluyeTexto(p) : p.desc)}</p>${ahorro > 0 ? `<span class="fila__ahorro">Ahorrás ${formatearPrecio(ahorro)}</span>` : ''}</div>
    <button type="button" class="fila__add" data-add="${p.id}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}</button>
  </article>`;
}
function renderCarta() {
  const tabs = document.getElementById('cartaTabs');
  const panel = document.getElementById('cartaPanel');
  if (!tabs || !panel) return;
  const resumen = Servidor.resumen();
  tabs.innerHTML = CATEGORIAS.map((c, i) => `<button type="button" class="tab" role="tab" id="tab-${c.id}" data-tab="${c.id}" aria-controls="cartaPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><img src="${c.img}" alt="" width="40" height="40">${esc(c.nombre)} <span>${resumen.find(r => r.id === c.id)?.cantidad || 0}</span></button>`).join('');
  const mostrar = (id, animar) => {
    const c = CATEGORIAS.find(x => x.id === id);
    if (!c) return;
    tabs.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    const res = Servidor.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 6 });
    panel.innerHTML = res.items.map(filaHTML).join('') +
      `<div class="carta__pie"${ANIM.subirCh}><p>${res.total > res.items.length ? `Mostramos ${res.items.length} de ${res.total}.` : `${res.total} ${res.total === 1 ? 'opción' : 'opciones'} de ${esc(c.nombre.toLowerCase())}.`} ${esc(c.bajada)}</p><a class="link-flecha" href="${catalogoHref()}?cat=${id}"><span>Ver ${esc(c.nombre.toLowerCase())} en el menú completo</span>${ICON.flecha}</a></div>`;
    if (animar) { revelarNuevos(panel); refrescarScroll(); }
  };
  tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) mostrar(b.dataset.tab, true); });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    const bs = [...tabs.querySelectorAll('[data-tab]')];
    const i = bs.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? bs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
    bs[j].focus(); mostrar(bs[j].dataset.tab, true);
  });
  mostrar(CATEGORIAS[0].id, false);
}

function initDetalle() {
  const fig = document.querySelector('.detalle__foto');
  if (!fig) return;
  const img = fig.querySelector('img');
  const pins = [...fig.querySelectorAll('.pin')];
  const ings = [...document.querySelectorAll('.ing')];
  const label = document.getElementById('pinLabel');
  const NW = 940, NH = 1672;
  let activo = 0;
  const ubicar = () => {
    const W = fig.clientWidth, H = fig.clientHeight;
    if (!W || !H) return;
    const s = Math.max(W / NW, H / NH);
    const rw = NW * s, rh = NH * s;
    const pos = window.getComputedStyle(img).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const ox = (W - rw) * (Number.isFinite(pos[0]) ? pos[0] : 0.5);
    const oy = (H - rh) * (Number.isFinite(pos[1]) ? pos[1] : 0.5);
    pins.forEach(p => {
      const x = ox + Number(p.dataset.x) * s, y = oy + Number(p.dataset.y) * s;
      p.style.setProperty('--px', `${Math.round(x)}px`);
      p.style.setProperty('--py', `${Math.round(y)}px`);
    });
    if (activo) ponerLabel();
  };
  const ponerLabel = () => {
    const p = pins.find(x => Number(x.dataset.pin) === activo);
    if (!p || !label) return;
    label.innerHTML = `<span>${activo}</span>${esc(p.getAttribute('aria-label'))}`;
    label.classList.add('is-on');
  };
  const activar = n => {
    activo = n;
    pins.forEach(p => p.setAttribute('aria-pressed', String(Number(p.dataset.pin) === n)));
    ings.forEach(b => b.classList.toggle('is-on', Number(b.dataset.ing) === n));
    ponerLabel();
  };
  pins.forEach(p => p.addEventListener('click', () => activar(Number(p.dataset.pin))));
  const hover = window.matchMedia('(hover: hover)');
  ings.forEach(b => {
    b.addEventListener('click', () => activar(Number(b.dataset.ing)));
    b.addEventListener('mouseenter', () => { if (hover.matches) activar(Number(b.dataset.ing)); });
  });
  if ('ResizeObserver' in window) new window.ResizeObserver(ubicar).observe(fig);
  else window.addEventListener('resize', ubicar, { passive: true });
  if (img.complete) ubicar(); else img.addEventListener('load', ubicar);
  ubicar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = [-33.1237, -64.3494];
  const tactil = window.matchMedia('(hover: none)').matches;
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !tactil, tap: false, zoomControl: true, attributionControl: true }).setView(centro, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  L.marker(centro, {
    icon: L.divIcon({ className: 'mapa-pin', html: '<span class="mapa-pin__dot"></span><span class="mapa-pin__label">Sabores de lo alto</span>', iconSize: [0, 0] }),
    keyboard: false,
  }).addTo(mapa);
  const fix = () => mapa.invalidateSize();
  window.addEventListener('load', fix);
  if ('ResizeObserver' in window) new window.ResizeObserver(fix).observe(el);
}

let qvUltimoFoco = null;
function abrirQuickView(id, trigger) {
  const modal = document.getElementById('quickView');
  const cont = document.getElementById('qvContenido');
  const p = getProducto(id);
  if (!modal || !cont || !p) return;
  if (modal.hidden) qvUltimoFoco = trigger || document.activeElement;
  const n = esc(p.nombre);
  const vIni = varDefault(p);
  const fotos = [imgDe(p), ...(p.var ? p.var.ops.filter(o => o.img).map(o => `images/${o.img}.webp`) : []), p.escena].filter(Boolean);
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const ahorro = ahorroDe(p);
  const variantes = p.var ? `<fieldset class="qv__var"><legend>${esc(p.var.nombre)}</legend><div class="qv__ops">${p.var.ops.map((o, i) => `<button type="button" class="qv__op" data-op="${o.id}" aria-pressed="${i === 0}">${esc(o.label)}<small>${formatearPrecio(o.precio)}</small></button>`).join('')}</div></fieldset>` : '';
  const incluye = p.incluye ? `<ul class="qv__incluye">${p.incluye.map(i => { const x = getProducto(i.id); if (!x) return ''; const o = opcion(x, i.v); return `<li><span>${i.qty > 1 ? i.qty + ' × ' : ''}${esc(x.nombre)}${o ? ' · ' + esc(o.label) : ''}</span><span>${formatearPrecio(precioDe(x, i.v) * (i.qty || 1))}</span></li>`; }).join('')}<li><span><strong>Por separado</strong></span><span><s>${formatearPrecio(sueltoDe(p))}</s></span></li></ul>` : '';
  const lleva = !p.incluye && p.lleva?.length ? `<ul class="qv__lleva" aria-label="Lleva">${p.lleva.map(l => `<li>${esc(l)}</li>`).join('')}</ul>` : '';
  cont.innerHTML = `
    <div class="qv__galeria">
      <div class="qv__principal"><img src="${fotos[0]}" alt="${esc(p.alt)}" width="640" height="640" data-qv-img></div>
      ${fotos.length > 1 ? `<div class="qv__thumbs">${fotos.map((f, i) => `<button type="button" class="qv__thumb" data-foto="${f}" aria-pressed="${i === 0}" aria-label="Ver la foto ${i + 1}"><img src="${f}" alt="" width="64" height="64"></button>`).join('')}</div>` : ''}
    </div>
    <div class="qv__info">
      <p class="qv__cat">${esc(nombreCat(p.cat))}</p>
      <h2 class="qv__nombre">${n}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioDe(p, vIni))}</span>${ahorro > 0 ? `<span class="promo__ahorro">Ahorrás ${formatearPrecio(ahorro)}</span>` : ''}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${lleva}${incluye}${variantes}
      <div class="qv__acciones">${stepperHTML(p.nombre)}<button type="button" class="btn btn-cta" data-add="${p.id}" data-v="${vIni}">${ICON.carrito}<span>Agregar al pedido</span></button><button type="button" class="btn btn-ghost" data-buy="${p.id}" data-v="${vIni}">Comprar ahora</button></div>
      <p class="qv__nota">Retiro en el local o envío: lo coordinamos por WhatsApp.</p>
    </div>
    ${rel.length ? `<div class="qv__rel"><h3>También te puede gustar</h3><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="54" height="54"><span>${esc(r.nombre)}<small>${formatearPrecio(precioDesde(r))}</small></span></button>`).join('')}</div></div>` : ''}`;
  const pintarFoto = src => {
    const im = cont.querySelector('[data-qv-img]');
    if (im) im.src = src;
    cont.querySelectorAll('[data-foto]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.foto === src)));
  };
  cont.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    cont.querySelectorAll('[data-op]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    cont.querySelectorAll('[data-add], [data-buy]').forEach(x => { x.dataset.v = b.dataset.op; });
    const el = cont.querySelector('[data-qv-precio]');
    if (el) el.textContent = formatearPrecio(precioDe(p, b.dataset.op));
    if (opcion(p, b.dataset.op)?.img) pintarFoto(imgDe(p, b.dataset.op));
  }));
  cont.querySelectorAll('[data-foto]').forEach(b => b.addEventListener('click', () => pintarFoto(b.dataset.foto)));
  let ld = document.getElementById('ld-producto');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(imgDe(p), location.href).href, brand: { '@type': 'Brand', name: 'Sabores de lo alto' }, offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: 'https://schema.org/InStock' } });
  const yaAbierto = !modal.hidden;
  modal.hidden = false;
  cont.parentElement.scrollTop = 0;
  syncNoScroll();
  if (!yaAbierto) requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  modal.querySelector('.modal__cerrar')?.focus();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
  }
}
function cerrarQuickView(devolverFoco = true) {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  modal.hidden = true;
  syncNoScroll();
  if (document.body.dataset.pagina === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
  }
  if (devolverFoco && qvUltimoFoco?.isConnected) qvUltimoFoco.focus();
}
function initQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close-modal]')) cerrarQuickView(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarQuickView();
    else atraparFoco(modal, e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQuickView(id, null);
}

let carritoUltimoFoco = null;
function renderCarrito(animar = false) {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  const total = document.getElementById('cartTotal');
  if (!body) return;
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) {
    body.innerHTML = `<div class="carrito-vacio">${ICON.carrito}<h3>Tu pedido está vacío</h3><p>Todavía no sumaste nada. Arrancá por un pancho gourmet o por un combo para compartir.</p><a class="btn btn-cta" href="${catalogoHref()}">Volver al menú</a></div>`;
    if (foot) foot.hidden = true;
    return;
  }
  if (foot) foot.hidden = false;
  body.innerHTML = lineas.map(({ p, v, qty }, k) => {
    const o = opcion(p, v);
    const detalle = o ? `${p.var.nombre}: ${o.label}` : (p.incluye ? incluyeTexto(p) : '');
    return `<div class="linea" data-id="${p.id}" data-v="${v || ''}"${animar ? ` style="animation-delay:${Math.min(k * 0.05, 0.3)}s"` : ' style="animation:none"'}>
      <img src="${imgDe(p, v)}" alt="" width="72" height="72">
      <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p>${detalle ? `<p class="linea__var">${esc(detalle)}</p>` : ''}
        <div class="linea__fila"><div class="stepper" data-stepper><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="${qty}" min="1" max="30" inputmode="numeric" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>
        <span class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</span>
        <button type="button" class="linea__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del pedido">${ICON.basura}</button></div>
      </div></div>`;
  }).join('');
  if (total) total.textContent = formatearPrecio(Cart.total());
}
function abrirCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer) return;
  carritoUltimoFoco = document.activeElement;
  renderCarrito(true);
  drawer.removeAttribute('inert');
  drawer.classList.add('open'); bd?.classList.add('open');
  syncNoScroll();
  drawer.querySelector('[data-close-cart]')?.focus();
}
function cerrarCarrito() {
  const drawer = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!drawer || !drawer.classList.contains('open')) return;
  drawer.classList.remove('open'); bd?.classList.remove('open');
  drawer.setAttribute('inert', '');
  syncNoScroll();
  if (carritoUltimoFoco?.isConnected) carritoUltimoFoco.focus();
}
function initCarrito() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  document.getElementById('drawerBackdrop')?.addEventListener('click', cerrarCarrito);
  drawer.addEventListener('click', e => {
    if (e.target.closest('[data-close-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('.linea');
    if (!linea) return;
    const { id, v } = linea.dataset;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const actual = Cart.get().find(i => i.id === id && (i.v || '') === v)?.qty || 1;
      Cart.setQty(id, v, actual + Number(step.dataset.lineaStep));
    }
    if (e.target.closest('[data-quitar]')) Cart.remove(id, v);
  });
  drawer.addEventListener('change', e => {
    const input = e.target.closest('.linea input');
    if (!input) return;
    const { id, v } = input.closest('.linea').dataset;
    Cart.setQty(id, v, parseInt(input.value, 10) || 1);
  });
  document.getElementById('checkout')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (drawer.classList.contains('open')) renderCarrito(false); });
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarCarrito();
    else atraparFoco(drawer, e);
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

const POR_PAGINA = 16;
function initCatalogo() {
  const grid = document.getElementById('grid');
  if (!grid || document.body.dataset.pagina !== 'catalogo') return;
  const params = new URLSearchParams(location.search);
  const valida = (v, mapa) => (v && Object.prototype.hasOwnProperty.call(mapa, v) ? v : '');
  const catsValidas = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const st = {
    cat: valida(params.get('cat'), catsValidas),
    tag: (params.get('lleva') || '').split(',').filter(s => TAGS[s]),
    para: (params.get('para') || '').split(',').filter(s => PARA[s]),
    precio: valida(params.get('precio'), RANGOS),
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valida(params.get('orden'), ORDENES) || 'destacados',
  };
  const el = {
    titulo: document.getElementById('catTitulo'), bajada: document.getElementById('catBajada'), miga: document.getElementById('migaCat'),
    q: document.getElementById('q'), orden: document.getElementById('orden'), resumen: document.getElementById('resumen'),
    mas: document.getElementById('masWrap'), verMas: document.getElementById('verMas'), mostrando: document.getElementById('mostrando'),
    cats: document.getElementById('filtroCats'), tags: document.getElementById('filtroTags'), para: document.getElementById('filtroPara'),
    precios: document.getElementById('filtroPrecios'), filtros: document.getElementById('filtros'), abrir: document.getElementById('abrirFiltros'),
  };
  const bajadaBase = el.bajada?.textContent || '';
  const tituloBase = el.titulo?.textContent || 'El menú completo';
  let cursor = null, mostrados = 0, total = 0;

  el.cats.innerHTML = [{ id: '', nombre: 'Todo el menú' }, ...CATEGORIAS].map(c => `<button type="button" class="filtro__cat" data-cat="${c.id}" aria-pressed="${st.cat === c.id}">${esc(c.nombre)}<span>${Servidor.contar(c.id ? { cat: c.id } : {})}</span></button>`).join('');
  el.tags.innerHTML = Object.entries(TAGS).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="tag" value="${id}"${st.tag.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.para.innerHTML = Object.entries(PARA).map(([id, l]) => `<label class="check"><input type="checkbox" data-f="para" value="${id}"${st.para.includes(id) ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.precios.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([id, r]) => [id, r.label])].map(([id, l]) => `<label class="check"><input type="radio" name="precio" value="${id}"${st.precio === id ? ' checked' : ''}>${esc(l)}</label>`).join('');
  el.orden.innerHTML = Object.entries(ORDENES).map(([id, l]) => `<option value="${id}"${st.orden === id ? ' selected' : ''}>${esc(l)}</option>`).join('');
  el.q.value = st.q;

  const filtrosServidor = () => ({ cat: st.cat || undefined, tag: st.tag, para: st.para, rango: st.precio || undefined, q: st.q || undefined });
  const activos = () => (st.cat ? 1 : 0) + st.tag.length + st.para.length + (st.precio ? 1 : 0) + (st.q ? 1 : 0);

  function escribirURL() {
    const u = new URL(location.href);
    ['cat', 'lleva', 'para', 'precio', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (st.cat) u.searchParams.set('cat', st.cat);
    if (st.tag.length) u.searchParams.set('lleva', st.tag.join(','));
    if (st.para.length) u.searchParams.set('para', st.para.join(','));
    if (st.precio) u.searchParams.set('precio', st.precio);
    if (st.q) u.searchParams.set('q', st.q);
    if (st.orden !== 'destacados') u.searchParams.set('orden', st.orden);
    window.history.replaceState(null, '', u);
  }
  function pintarCabecera() {
    const c = catsValidas[st.cat];
    if (el.titulo) el.titulo.textContent = c ? c.nombre : tituloBase;
    if (el.bajada) el.bajada.textContent = c ? c.bajada : bajadaBase;
    if (el.miga) { el.miga.hidden = !c; const s = el.miga.querySelector('span:last-child'); if (s) s.textContent = c ? c.nombre : ''; }
    document.title = `${c ? c.nombre : 'Menú completo'} — Sabores de lo alto, panchería en Río Cuarto`;
    el.cats.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === st.cat)));
    document.querySelectorAll('.nav-cats__item').forEach(a => {
      if (st.cat && new URL(a.href).searchParams.get('cat') === st.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  function pintarResumen() {
    const chips = [];
    if (st.cat) chips.push(['cat', st.cat, catsValidas[st.cat].nombre]);
    st.tag.forEach(t => chips.push(['tag', t, `Con ${TAGS[t].toLowerCase()}`]));
    st.para.forEach(t => chips.push(['para', t, PARA[t]]));
    if (st.precio) chips.push(['precio', st.precio, RANGOS[st.precio].label]);
    if (st.q) chips.push(['q', st.q, `«${st.q}»`]);
    el.resumen.innerHTML = `<span><strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}</span>` +
      chips.map(([k, v, l]) => `<button type="button" class="chip-activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') +
      (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    document.querySelectorAll('[data-total]').forEach(s => { s.textContent = total; });
    const nf = document.querySelector('[data-nfiltros]');
    if (nf) nf.textContent = activos() ? `(${activos()})` : '';
  }
  function vacioHTML() {
    return `<div class="vacio"${ANIM.subirCh}><h2>Eso no está en el menú (todavía)</h2><p>Probá con otra palabra o sacá algún filtro. Y si buscás algo especial para un evento, escribinos.</p><div class="vacio__ctas"><button type="button" class="btn btn-cta" data-limpiar>Limpiar filtros</button><a class="btn btn-ghost" href="${waLink('¡Hola, Sabores de lo alto! Busco algo que no encontré en el menú: ')}" target="_blank" rel="noopener">${ICON.wa}<span>Preguntanos por WhatsApp</span></a></div></div>`;
  }
  function cargar(reset) {
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
    if (reset) { grid.innerHTML = ''; mostrados = 0; }
    total = res.total; cursor = res.cursor;
    if (!total) grid.innerHTML = vacioHTML();
    else grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    el.mas.hidden = !cursor;
    if (el.mostrando) el.mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    pintarResumen();
    revelarNuevos(grid);
    refrescarScroll();
  }
  function aplicar() { pintarCabecera(); escribirURL(); cargar(true); }

  el.cats.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; st.cat = b.dataset.cat; aplicar(); });
  el.filtros.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) {
      st[t.dataset.f] = [...el.filtros.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
      aplicar();
    } else if (t.matches('input[name="precio"]')) { st.precio = valida(t.value, RANGOS); aplicar(); }
  });
  el.orden.addEventListener('change', () => { st.orden = valida(el.orden.value, ORDENES) || 'destacados'; aplicar(); });
  let deb = 0;
  el.q.addEventListener('input', () => { clearTimeout(deb); deb = setTimeout(() => { st.q = el.q.value.trim().slice(0, 60); aplicar(); }, 250); });
  document.getElementById('buscador')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(deb); st.q = el.q.value.trim().slice(0, 60); aplicar(); });
  el.verMas.addEventListener('click', () => cargar(false));
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) {
      Object.assign(st, { cat: '', tag: [], para: [], precio: '', q: '' });
      el.q.value = '';
      el.filtros.querySelectorAll('input[type="checkbox"]').forEach(i => { i.checked = false; });
      const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true;
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-quitar-filtro]');
    if (!chip) return;
    const k = chip.dataset.quitarFiltro, v = chip.dataset.valor;
    if (k === 'cat') st.cat = '';
    else if (k === 'precio') { st.precio = ''; const todos = el.filtros.querySelector('input[name="precio"][value=""]'); if (todos) todos.checked = true; }
    else if (k === 'q') { st.q = ''; el.q.value = ''; }
    else { st[k] = st[k].filter(x => x !== v); const i = el.filtros.querySelector(`input[data-f="${k}"][value="${v}"]`); if (i) i.checked = false; }
    aplicar();
  });

  const mobileMq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  let filtrosFoco = null;
  const cerrarFiltros = () => {
    if (!el.filtros.classList.contains('open')) return;
    el.filtros.classList.remove('open'); bd.classList.remove('open');
    el.abrir?.setAttribute('aria-expanded', 'false');
    if (mobileMq.matches) el.filtros.setAttribute('inert', '');
    syncNoScroll();
    filtrosFoco?.focus();
  };
  const abrirFiltros = () => {
    filtrosFoco = document.activeElement;
    el.filtros.removeAttribute('inert');
    el.filtros.classList.add('open'); bd.classList.add('open');
    el.abrir?.setAttribute('aria-expanded', 'true');
    syncNoScroll();
    el.filtros.querySelector('[data-cerrar-filtros]')?.focus();
  };
  el.abrir?.addEventListener('click', abrirFiltros);
  bd.addEventListener('click', cerrarFiltros);
  el.filtros.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarFiltros(); });
  document.addEventListener('keydown', e => {
    if (!el.filtros.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros(); else atraparFoco(el.filtros, e);
  });
  const syncFiltros = () => {
    if (mobileMq.matches) {
      if (!el.filtros.classList.contains('open')) el.filtros.setAttribute('inert', '');
      el.filtros.querySelectorAll('[data-animate]').forEach(x => x.classList.add('in'));
    } else { el.filtros.removeAttribute('inert'); cerrarFiltros(); }
  };
  mobileMq.addEventListener('change', syncFiltros);
  syncFiltros();

  pintarCabecera();
  cargar(true);
  if (params.has('q') && !st.q) setTimeout(() => el.q.focus({ preventScroll: true }), 300);
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

initModelBarScroll();
initNav();
initCatMenu();
initEstado();
renderRail();
renderPromos();
renderCarta();
initDetalle();
initAcciones();
initQuickView();
initCarrito();
initFloats();
initCatalogo();
updateCartBadge();
initReveals();
initHeroMotion();
initParallax();
initMapa();
