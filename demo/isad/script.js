const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491159321847';
const MARCA = 'ISAD';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'vestidos', nombre: 'Vestidos', bajada: 'Midi y con vuelo', img: 'images/p-vestido.webp',
    texto: 'Vestidos para ir de la oficina a una cena sin cambiarte.', subs: [] },
  { id: 'camisas', nombre: 'Camisas y blusas', bajada: 'Clásicas y con moño', img: 'images/p-camisa.webp',
    texto: 'La camisa blanca de siempre y blusas livianas para salir.',
    subs: [{ id: 'camisas', nombre: 'Camisas' }, { id: 'blusas', nombre: 'Blusas' }] },
  { id: 'pantalones', nombre: 'Pantalones y polleras', bajada: 'Sastreros, jeans y satén', img: 'images/p-pantalon.webp',
    texto: 'Pantalón sastrero, jean recto y pollera midi: la base de cualquier look.',
    subs: [{ id: 'pantalones', nombre: 'Pantalones' }, { id: 'jeans', nombre: 'Jeans' }, { id: 'polleras', nombre: 'Polleras' }] },
  { id: 'abrigos', nombre: 'Blazers y abrigos', bajada: 'Blazer, trench y cárdigan', img: 'images/p-trench.webp',
    texto: 'Las capas que terminan el look: blazer entallado, trench y cárdigan de punto.',
    subs: [{ id: 'blazers', nombre: 'Blazers' }, { id: 'trench', nombre: 'Trench' }, { id: 'cardigans', nombre: 'Cárdigans' }] },
];
const LOOKS = [
  { id: 'oficina', num: '01', nombre: 'Oficina', frase: 'Prolija sin esfuerzo',
    texto: 'El blazer crema sobre la camisa blanca y el pantalón sastrero negro. Se lleva igual de lunes a viernes.',
    piezas: ['blazer-crema', 'camisa-blanca', 'pantalon-sastrero-negro'] },
  { id: 'finde', num: '02', nombre: 'Fin de semana', frase: 'Abrigada y cómoda',
    texto: 'El trench beige arriba del cárdigan camel, con el jean recto. Para caminar, tomar algo o viajar.',
    piezas: ['trench-beige', 'cardigan-camel', 'jean-recto'] },
  { id: 'noche', num: '03', nombre: 'Una noche', frase: 'El blazer de la oficina, a la noche',
    texto: 'La blusa bordó con moño y la pollera satinada, con el mismo blazer crema encima.',
    piezas: ['blusa-bordo', 'pollera-satinada-negra', 'blazer-crema'] },
];
const COLORES = [
  { id: 'negro', nombre: 'Negro' }, { id: 'blanco', nombre: 'Blanco' }, { id: 'crema', nombre: 'Crema' },
  { id: 'beige', nombre: 'Beige' }, { id: 'camel', nombre: 'Camel' }, { id: 'azul', nombre: 'Azul' }, { id: 'bordo', nombre: 'Bordó' },
];
const LETRAS = ['XS', 'S', 'M', 'L', 'XL'];
const NUMEROS = ['36', '38', '40', '42', '44', '46'];
const TALLES = [...LETRAS, ...NUMEROS];
const PRECIOS = [
  { id: 'hasta50', nombre: 'Hasta $50.000', min: null, max: 50000 },
  { id: '50a80', nombre: '$50.000 a $80.000', min: 50001, max: 80000 },
  { id: 'mas80', nombre: 'Más de $80.000', min: 80001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  vestidos: 'vestido vestidos', camisas: 'camisa camisas blusa blusas top', pantalones: 'pantalon pantalones pollera polleras falda',
  abrigos: 'abrigo abrigos campera saco', blusas: 'blusa blusas', jeans: 'jean jeans denim vaquero pantalon', polleras: 'pollera polleras falda',
  blazers: 'blazer saco sastrero', trench: 'trench piloto gabardina tapado', cardigans: 'cardigan saco tejido sweater punto',
  oficina: 'oficina trabajo', finde: 'fin de semana finde', noche: 'noche salida cena fiesta',
  negro: 'negro negra', blanco: 'blanco blanca', crema: 'crema crudo marfil', beige: 'beige arena', camel: 'camel marron', azul: 'azul celeste', bordo: 'bordo vino borravino rojo',
};
const T_LETRAS = { tipo: 'Talle', ops: LETRAS };
const T_NUMEROS = { tipo: 'Talle', ops: NUMEROS };
const DESTACADAS = ['vestido-midi-negro', 'blazer-crema', 'camisa-blanca'];

const PRODUCTOS_BASE = [
  { id: 'vestido-midi-negro', folio: '01', corto: 'Vestido midi', nombre: 'Vestido Midi de Breteles Anchos', cat: 'vestidos', sub: '', color: 'negro', precio: 69900, descuento: 0, stock: 6, alta: 28, rango: 1,
    var: T_LETRAS, agotados: [], img: 'images/p-vestido.webp', extra: { src: 'images/vestido-alto.webp', ar: '9/16' },
    alt: 'Vestido midi negro de breteles anchos con escote cuadrado y falda con vuelo', desc: 'Escote cuadrado, breteles anchos y cintura marcada con costura. La falda tiene pliegues y vuelo, y llega a media pierna.' },
  { id: 'blazer-crema', folio: '02', corto: 'Blazer', nombre: 'Blazer Entallado Crema', cat: 'abrigos', sub: 'blazers', color: 'crema', precio: 98900, descuento: 0, stock: 5, alta: 26, rango: 2,
    var: T_LETRAS, agotados: ['XS'], img: 'images/p-blazer.webp', extra: { src: 'images/blazer-ancho.webp', ar: '16/9' },
    alt: 'Blazer entallado color crema con solapa, un botón y bolsillos con tapa', desc: 'Solapa clásica, un botón y bolsillos con tapa. Entallado con pinzas para marcar la cintura: va con pantalón sastrero, jean o vestido.' },
  { id: 'camisa-blanca', folio: '03', corto: 'Camisa', nombre: 'Camisa Clásica Blanca', cat: 'camisas', sub: 'camisas', color: 'blanco', precio: 47900, descuento: 0, stock: 12, alta: 22, rango: 3,
    var: T_LETRAS, agotados: [], img: 'images/p-camisa.webp', extra: null,
    alt: 'Camisa blanca clásica de manga larga con cuello y botones al frente', desc: 'Cuello camisero, botones al frente y puños con botón. Corte entallado con el ruedo redondeado para usar por fuera o adentro.' },
  { id: 'pantalon-sastrero-negro', folio: '04', corto: 'Pantalón sastrero', nombre: 'Pantalón Sastrero Tiro Alto', cat: 'pantalones', sub: 'pantalones', color: 'negro', precio: 62900, descuento: 0, stock: 8, alta: 24, rango: 6,
    var: T_NUMEROS, agotados: ['46'], img: 'images/p-pantalon.webp', extra: null,
    alt: 'Pantalón sastrero negro de tiro alto y pierna ancha con pinzas', desc: 'Tiro alto, pinzas al frente y pierna ancha con raya marcada. Largo al piso para usar con taco o con zapatillas.' },
  { id: 'cardigan-camel', folio: '05', corto: 'Cárdigan', nombre: 'Cárdigan de Punto Camel', cat: 'abrigos', sub: 'cardigans', color: 'camel', precio: 54900, descuento: 0, stock: 7, alta: 23, rango: 8,
    var: { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] }, agotados: [], img: 'images/p-cardigan.webp', extra: null,
    alt: 'Cárdigan de punto color camel con cuello redondo y botones al frente', desc: 'Tejido de punto suave con cuello redondo, botones al tono y puños y cintura en rib. Para encima de una camisa o solo.' },
  { id: 'jean-recto', folio: '06', corto: 'Jean recto', nombre: 'Jean Recto Tiro Alto', cat: 'pantalones', sub: 'jeans', color: 'azul', precio: 58900, descuento: 0, stock: 10, alta: 21, rango: 7,
    var: T_NUMEROS, agotados: [], img: 'images/p-jean.webp', extra: null,
    alt: 'Jean azul medio de tiro alto y pierna recta con lavado gastado', desc: 'Denim azul medio con lavado gastado, tiro alto y pierna recta. Cinco bolsillos y largo al tobillo.' },
  { id: 'pollera-satinada-negra', folio: '07', corto: 'Pollera satinada', nombre: 'Pollera Midi Satinada', cat: 'pantalones', sub: 'polleras', color: 'negro', precio: 49900, descuento: 0, stock: 4, alta: 25, rango: 9,
    var: { tipo: 'Talle', ops: ['XS', 'S', 'M', 'L'] }, agotados: [], img: 'images/p-pollera.webp', extra: null,
    alt: 'Pollera midi negra de satén con caída y vuelo al bies', desc: 'Satén con caída y corte al bies que se mueve al caminar. Cintura elástica escondida y largo midi.' },
  { id: 'trench-beige', folio: '08', corto: 'Trench', nombre: 'Trench Cruzado Beige', cat: 'abrigos', sub: 'trench', color: 'beige', precio: 134900, descuento: 0, stock: 4, alta: 30, rango: 4, tag: 'Nuevo',
    var: { tipo: 'Talle', ops: ['S', 'M', 'L', 'XL'] }, agotados: ['XL'], img: 'images/p-trench.webp', extra: null,
    alt: 'Trench beige cruzado de doble botonadura con cinturón y puños con hebilla', desc: 'Doble botonadura, charreteras y cinturón para atar. Puños con hebilla y largo a la pantorrilla.' },
  { id: 'blusa-bordo', folio: '09', corto: 'Blusa con moño', nombre: 'Blusa con Moño Bordó', cat: 'camisas', sub: 'blusas', color: 'bordo', precio: 45900, descuento: 0, stock: 9, alta: 29, rango: 5, tag: 'Nuevo',
    var: T_LETRAS, agotados: [], img: 'images/p-blusa.webp', extra: null,
    alt: 'Blusa bordó de tela liviana con cuello volado, moño y mangas abullonadas', desc: 'Tela liviana y transparente con cuello volado y moño para atar. Mangas abullonadas con puño fruncido.' },

  { id: 'vestido-camisero-proximo', folio: '10', corto: 'Vestido camisero', nombre: 'Vestido Camisero', cat: 'vestidos', sub: '', color: 'blanco', precio: 72900, descuento: 0, stock: 0, alta: 31, visible: false,
    var: T_LETRAS, agotados: [], img: 'images/p-vestido.webp', extra: null, alt: 'Próximo ingreso', desc: 'Próximo ingreso.' },
];
PRODUCTOS_BASE.forEach(p => { p.looks = LOOKS.filter(l => l.piezas.includes(p.id)).map(l => l.id); });

const Tienda = crearTienda(PRODUCTOS_BASE, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.corto, p.cat, p.sub, p.desc, ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ETIQUETAS[p.color] || '', ...(p.looks || []).map(l => ETIQUETAS[l] || l),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), look = lista(f.look), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (look.length && !(p.looks || []).some(l => look.includes(l))) return false;
    if (color.length && !color.includes(p.color)) return false;
    if (talle.length && !(p.var?.ops || []).some(t => talle.includes(t) && !(p.agotados || []).includes(t))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden, q) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    const palabras = q ? norm(q).split(/\s+/).filter(Boolean) : [];
    const rel = p => (palabras.every(w => norm(`${p.nombre} ${ETIQUETAS[p.sub] || ''}`).includes(w)) ? 0 : 1);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (palabras.length ? rel(a) - rel(b) : 0) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.q));
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
    const talles = {}, colores = {}, looks = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.var?.ops || []).forEach(t => { if (!(p.agotados || []).includes(t)) talles[t] = (talles[t] || 0) + 1; });
      colores[p.color] = (colores[p.color] || 0) + 1;
      (p.looks || []).forEach(l => { looks[l] = (looks[l] || 0) + 1; });
    });
    return { talles, colores, looks };
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
const disponibles = p => (p.var?.ops || []).filter(t => !(p.agotados || []).includes(t));
const rangoTalles = p => {
  const ops = p.var?.ops || [];
  return ops.length > 1 ? `Talles ${ops[0]} a ${ops[ops.length - 1]}` : ops.length ? `Talle ${ops[0]}` : '';
};

const Cart = {
  KEY: 'isad_cart',
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
  KEY: 'isad_favs',
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
  percha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2"/><path d="M12 7.5v1.6L3.4 15.2a1.4 1.4 0 0 0 .8 2.5h15.6a1.4 1.4 0 0 0 .8-2.5L12 9.1"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  else if (p.stock <= 4) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
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
  if (!p.var) return '';
  return `<span class="prod__talles" aria-hidden="true">${p.var.ops.map(t => `<span${(p.agotados || []).includes(t) ? ' class="is-agotado"' : ''}>${esc(t)}</span>`).join('')}</span>`;
}
function laminaHTML(p, { src = p.img, ar = '1/1', w = 1200, h = 1200 } = {}) {
  return `<a class="lamina" href="${urlProducto(p)}" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}">
    <span class="lamina__foto" style="--ar:${ar}"><img src="${src}" alt="${esc(p.alt)}" width="${w}" height="${h}" decoding="async"></span>
    <span class="lamina__folio">Nº ${esc(p.folio)} · ${esc(p.corto)}</span>
  </a>`;
}

function cardHTML(p, { compacta = false, grande = false } = {}) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async">`;
  const foto = `<a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>`;
  const media = `<div class="prod__media">${foto}<span class="prod__folio" aria-hidden="true">Nº ${esc(p.folio)}</span>${badgesHTML(p)}${favHTML(p)}${tallesHTML(p)}</div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  if (compacta) {
    return `<article class="prod prod--compacta${grande ? ' prod--grande' : ''}">
      ${media}
      <div class="prod__body">
        ${titulo}
        <div class="prod__fila">${precioHTML(p)}<button type="button" class="prod-mini" data-qv-abrir="${p.id}" aria-label="Elegir talle y agregar: ${nombre}">${ICON.carritoMas}</button></div>
      </div>
    </article>`;
  }
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">Talle de ${nombre}</span><select data-op><option value="">Talle</option>${p.var.ops.map(o => `<option value="${esc(o)}"${(p.agotados || []).includes(o) ? ' disabled' : ''}>${esc(o)}${(p.agotados || []).includes(o) ? ' · agotado' : ''}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      ${titulo}
      ${precioHTML(p)}
      <div class="prod-actions">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span></button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function destHTML(p) {
  return `<article class="dest">
    <a class="dest__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></a>
    <div class="dest__body">
      <p class="dest__folio">Nº ${esc(p.folio)}</p>
      <h3 class="dest__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${esc(p.corto)}</a></h3>
      <span class="dest__regla" aria-hidden="true"></span>
      ${precioHTML(p)}
      <p class="dest__talles">${esc(rangoTalles(p))}</p>
      <button type="button" class="btn btn--cta btn--chico" data-qv-abrir="${p.id}">Ver prenda${ICON.flecha}</button>
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
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        ${c.subs.length ? `<div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>` : ''}
      </div>`).join('') + '</div>'
      + `<div class="cats-looks"><p class="cats-looks__tit">Por look</p>${LOOKS.map(l => `<a href="${CATALOGO_URL}?look=${l.id}"><span>${l.num}</span>${esc(l.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
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
  const form = document.querySelector('.header-search--barra');
  if (!btn || !form) return;
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
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, duration: 1.1 }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.4)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-lamina, .vidriera__item'), { y: 64, opacity: 0, duration: 1.3, stagger: 0.12, clearProps: 'transform,opacity' }, 0.3);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top top', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function initHome() {
  if (PAGINA !== 'home') return;
  const dest = document.getElementById('destacadasLista');
  if (dest) {
    dest.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADAS }, orden: 'destacados', limite: DESTACADAS.length }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${destHTML(p)}</li>`).join('');
  }
  const prev = document.getElementById('previewGrid');
  if (prev) {
    prev.innerHTML = Tienda.consultar({ filtros: { excluir: DESTACADAS }, orden: 'destacados', limite: 6 }).items
      .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p)}</li>`).join('');
  }
  const mos = document.getElementById('mosaicoGrid');
  if (mos) {
    mos.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 5 }).items
      .map((p, i) => `<li class="${i === 0 ? 'mosaico__grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p, { compacta: true, grande: i === 0 })}</li>`).join('');
  }
  const chips = document.getElementById('chipsHome');
  if (chips) chips.innerHTML = CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`).join('');
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
  });
  document.querySelectorAll('[data-total-tienda]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initLooks() {
  const mesa = document.getElementById('lookMesa');
  const panel = document.getElementById('lookPanel');
  if (!mesa || !panel) return;
  const box = mesa.closest('.looks');
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const frase = document.getElementById('lookFrase');
  const texto = document.getElementById('lookTexto');
  const piezas = document.getElementById('lookPiezas');
  const total = document.getElementById('lookTotal');
  const ver = document.getElementById('lookVer');
  const wsp = document.getElementById('lookWsp');
  const mostrar = (id, foco) => {
    const l = LOOKS.find(x => x.id === id) || LOOKS[0];
    tabs.forEach(t => {
      const on = t.dataset.look === l.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) { panel.setAttribute('aria-labelledby', t.id); if (foco) t.focus(); }
    });
    const prods = l.piezas.map(getProducto).filter(Boolean);
    frase.textContent = l.frase;
    texto.textContent = l.texto;
    mesa.dataset.n = String(prods.length);
    mesa.innerHTML = prods.map((p, i) => `<li class="mesa__item mesa__item--${i + 1}" data-animate="subir" style="opacity:0;transform:translateY(36px)">${laminaHTML(p)}</li>`).join('');
    piezas.innerHTML = prods.map(p => `<li><button type="button" data-qv-abrir="${p.id}"><span class="look__folio">Nº ${esc(p.folio)}</span><span class="look__nombre">${esc(p.nombre)}</span><span class="look__precio">${formatearPrecio(precioFinal(p))}</span></button></li>`).join('');
    total.textContent = formatearPrecio(prods.reduce((s, p) => s + precioFinal(p), 0));
    ver.href = `${CATALOGO_URL}?look=${l.id}`;
    wsp.href = wspHref(`Hola ${MARCA}! Me interesa el look ${l.nombre}: ${prods.map(p => p.nombre).join(', ')}. ¿Qué talles tienen?`);
    revelarNuevos(mesa);
    refrescarTriggers();
  };
  box.addEventListener('click', e => {
    const t = e.target.closest('[role="tab"]');
    if (t) mostrar(t.dataset.look);
  });
  box.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j === null) return;
    e.preventDefault();
    mostrar(tabs[j].dataset.look, true);
  });
  mostrar(tabs[0]?.dataset.look);
}

const MEDIDAS = [
  { t: 'XS', busto: 84, cintura: 66, cadera: 90, pantalon: '36' },
  { t: 'S', busto: 89, cintura: 71, cadera: 95, pantalon: '38' },
  { t: 'M', busto: 94, cintura: 76, cadera: 100, pantalon: '40' },
  { t: 'L', busto: 100, cintura: 82, cadera: 106, pantalon: '42' },
  { t: 'XL', busto: 106, cintura: 88, cadera: 112, pantalon: '44' },
];
function talleSugerido({ busto = 0, cintura = 0, cadera = 0 } = {}) {
  if (!(busto > 0) && !(cintura > 0) && !(cadera > 0)) return null;
  let idx = 0, fuera = false;
  [['busto', busto], ['cintura', cintura], ['cadera', cadera]].forEach(([k, v]) => {
    if (!(v > 0)) return;
    const i = MEDIDAS.findIndex(f => v <= f[k]);
    if (i < 0) { fuera = true; idx = MEDIDAS.length - 1; } else idx = Math.max(idx, i);
  });
  const fila = MEDIDAS[idx];
  const pantalon = cadera > 0 || cintura > 0 ? fila.pantalon : null;
  return { talle: fila.t, pantalon, fuera };
}
function initGuiaTalles() {
  const form = document.getElementById('guiaTalles');
  if (!form) return;
  const res = document.getElementById('guiaRes');
  const resTalle = document.getElementById('guiaTalle');
  const resPant = document.getElementById('guiaPantalon');
  const resTxt = document.getElementById('guiaTxt');
  const ver = document.getElementById('guiaVer');
  const wsp = document.getElementById('guiaWsp');
  const num = id => Number(String(document.getElementById(id)?.value || '').replace(',', '.')) || 0;
  const pintar = () => {
    const datos = { busto: num('guiaBusto'), cintura: num('guiaCintura'), cadera: num('guiaCadera') };
    const r = talleSugerido(datos);
    res.classList.toggle('is-listo', !!r);
    if (!r) {
      resTalle.textContent = '—';
      resPant.textContent = 'Pantalón —';
      resTxt.textContent = 'Cargá al menos tu busto y te sugerimos un talle.';
      ver.hidden = true;
      wsp.href = wspHref(`Hola ${MARCA}! Quiero que me ayuden a elegir el talle.`);
      return;
    }
    const talles = [r.talle, ...(r.pantalon ? [r.pantalon] : [])];
    const n = Tienda.contar({ talle: talles });
    resTalle.textContent = r.talle;
    resPant.textContent = r.pantalon ? `Pantalón ${r.pantalon}` : 'Sumá cintura o cadera para el pantalón';
    resTxt.textContent = r.fuera
      ? 'Alguna medida pasa la tabla. Escribinos y te decimos cómo calza cada prenda antes de comprar.'
      : `${n} ${n === 1 ? 'prenda viene' : 'prendas vienen'} en tu talle. Si estás entre dos, elegí el más grande.`;
    ver.hidden = !n || r.fuera;
    ver.href = `${CATALOGO_URL}?talle=${talles.join(',')}`;
    const medidas = [datos.busto && `busto ${datos.busto} cm`, datos.cintura && `cintura ${datos.cintura} cm`, datos.cadera && `cadera ${datos.cadera} cm`].filter(Boolean).join(', ');
    wsp.href = wspHref(`Hola ${MARCA}! Según la guía soy talle ${r.talle}${r.pantalon ? ` (pantalón ${r.pantalon})` : ''}, con ${medidas}. ¿Me lo confirman?`);
  };
  form.addEventListener('input', pintar);
  form.addEventListener('submit', e => { e.preventDefault(); pintar(); });
  pintar();
}

const QV = { p: null, op: '', foto: 0, opener: null };
function combinaCon(p) {
  const ids = [];
  LOOKS.filter(l => l.piezas.includes(p.id)).forEach(l => l.piezas.forEach(id => { if (id !== p.id && !ids.includes(id)) ids.push(id); }));
  let rel = ids.map(getProducto).filter(Boolean).slice(0, 3);
  if (!rel.length) rel = Tienda.consultar({ filtros: { excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  return rel;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = combinaCon(p);
  const fotos = [{ src: p.img, alt: p.alt, ar: '1/1' }];
  if (p.extra) fotos.push({ src: p.extra.src, alt: `Otra vista: ${p.alt}`, ar: p.extra.ar });
  const f = fotos[QV.foto] || fotos[0];
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''}.`;
  const on = Favs.has(p.id);
  const agot = p.agotados || [];
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal" style="--ar:${f.ar}"><img src="${f.src}" alt="${esc(f.alt)}" width="1200" height="1200"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((x, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto de la prenda'}"><img src="${x.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">Nº ${esc(p.folio)} · ${esc(sub?.nombre || cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${conVar(p) ? `<div class="qv__talles">
          <p class="f-grupo__titulo">Talle</p>
          <div class="qv__ops" role="group" aria-label="Elegí tu talle">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}"${agot.includes(o) ? ` disabled aria-label="Talle ${esc(o)} agotado"` : ''}>${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite">${agot.length ? `Sin stock en ${agot.join(', ')}.` : ''}</p>
          <a class="qv__guia" href="${HOME_URL}#talles">¿No sabés tu talle? Usá la guía</a>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar medidas por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>Combinalo con</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.corto)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = disponibles(p).includes(op) ? op : ''; QV.foto = 0;
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
    if (e.target.closest('.qv__guia') && PAGINA === 'home') { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (talle ${QV.op}).`);
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
        modal.querySelector('[data-qv-op]:not([disabled])')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (talle ${QV.op})` : ''} al carrito.`);
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
    items.innerHTML = `<div class="drawer__vacio">${ICON.percha}<p>Tu carrito está vacío. El blazer crema y el vestido midi te esperan con tu talle.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
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
      const acciones = add.closest('.prod-actions');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (talle ${op})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod-actions');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      Cart.add(p, 1, op);
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
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], look: multi('look', LOOKS), color: multi('color', COLORES), talle: multi('talle', TALLES),
    precio: valido(params.get('precio'), PRECIOS), fav: params.get('fav') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];

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
  let pagina = [], cursorSrv = null, agotado = false, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.look.length) f.look = e.look;
    if (e.color.length) f.color = e.color;
    if (e.talle.length) f.talle = e.talle;
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
    if (e.cat && subsDe(e.cat).length > 1) grupos.push(`<fieldset class="f-grupo"><legend>Tipo</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), Tienda.contar({ cat: e.cat, sub: s.id }), 'sub')).join('')}</fieldset>`);
    const tallaBox = arr => arr.filter(t => fac.talles[t]).map(t => `<label class="f-talle"><input type="checkbox" name="talle-${t}" value="${t}" data-f="talle"${e.talle.includes(t) ? ' checked' : ''}><span>${t}</span></label>`).join('');
    const letras = tallaBox(LETRAS), nums = tallaBox(NUMEROS);
    if (letras || nums) grupos.push(`<fieldset class="f-grupo"><legend>Talle</legend>${letras ? `<div class="f-talles">${letras}</div>` : ''}${nums ? `<p class="f-nota">Pantalones y jeans</p><div class="f-talles">${nums}</div>` : ''}</fieldset>`);
    const looks = LOOKS.filter(l => fac.looks[l.id]);
    if (looks.length) grupos.push(`<fieldset class="f-grupo"><legend>Look</legend>
      ${looks.map(l => opcion('checkbox', `look-${l.id}`, l.id, esc(l.nombre), e.look.includes(l.id), fac.looks[l.id], 'look')).join('')}</fieldset>`);
    const colores = COLORES.filter(c => fac.colores[c.id]);
    if (colores.length) grupos.push(`<fieldset class="f-grupo"><legend>Color</legend><div class="f-colores">
      ${colores.map(c => `<label class="f-color"><input type="checkbox" name="color-${c.id}" value="${c.id}" data-f="color"${e.color.includes(c.id) ? ' checked' : ''}><i class="swatch swatch--${c.id}" aria-hidden="true"></i><span>${c.nombre}</span><small>${fac.colores[c.id]}</small></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const look = !cat && e.look.length === 1 ? LOOKS.find(l => l.id === e.look[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : look ? `Look ${look.num} · ${look.nombre}` : e.fav ? 'Tus favoritos' : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : look ? look.texto : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Vestidos, camisas, pantalones, polleras y abrigos de mujer. Elegís tu talle y lo sumás al carrito.';
    document.title = `${titulo} — ${MARCA} · Boutique femenina`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : look ? `Look ${look.nombre}` : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : look ? `${CATALOGO_URL}?look=${look.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.look.length ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.look.forEach(v => quitar.push(['look', v, `Look ${nombreDe(LOOKS, v)}`]));
    e.talle.forEach(v => quitar.push(['talle', v, `Talle ${v}`]));
    e.color.forEach(v => quitar.push(['color', v, nombreDe(COLORES, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'look', 'color', 'talle', 'precio', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.look.length) u.searchParams.set('look', e.look.join(','));
    if (e.talle.length) u.searchParams.set('talle', e.talle.join(','));
    if (e.color.length) u.searchParams.set('color', e.color.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  const pedirPagina = () => {
    const r = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor: cursorSrv, limite: Tienda.TOPE });
    pagina = pagina.concat(r.items);
    cursorSrv = r.cursor;
    agotado = !r.cursor;
  };
  function pintar(reiniciar) {
    if (reiniciar) { pagina = []; cursorSrv = null; agotado = false; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    if (pagina.length - mostrados < POR_PAGINA && !agotado) pedirPagina();
    const nuevos = pagina.slice(mostrados, mostrados + POR_PAGINA);
    grid.insertAdjacentHTML('beforeend', nuevos.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(36px)">${cardHTML(p)}</li>`).join(''));
    mostrados += nuevos.length;
    contador.textContent = `${total} ${total === 1 ? 'prenda' : 'prendas'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de una prenda y aparece acá.'
      : 'No encontramos prendas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    verMas.hidden = mostrados >= pagina.length && agotado;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    if (!e.cat) e.sub = [];
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
    else if (grupo === 'fav') e.fav = inp.checked;
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
    if (f.classList.contains('header-search--barra')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.look = []; e.color = []; e.talle = []; e.precio = ''; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'fav') e.fav = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = []; e.look = [];
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-looks a, .cats-todo, .footer__col a');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.look = (u.searchParams.get('look') || '').split(',').filter(v => LOOKS.some(x => x.id === v));
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
  const enfocarBuscador = () => { if (location.hash === '#buscar') setTimeout(() => buscar.focus({ preventScroll: false }), 60); };
  enfocarBuscador();
  window.addEventListener('hashchange', enfocarBuscador);
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
  form.style.transition = 'none';
  modo();
  void form.offsetWidth;
  form.style.transition = '';
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

[initCatsMenu, initHome, initLooks, initGuiaTalles, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
