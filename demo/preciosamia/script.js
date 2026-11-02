const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491139399642';
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

const svgCat = d => `<svg class="ico ico--cat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const CATEGORIAS = [
  { id: 'polleras', nombre: 'Maxi polleras', ico: svgCat('<path d="M8.5 3h7l4.5 18H4z"/><path d="M8.2 6h7.6M10.5 6 9 21M13.5 6 15 21"/>') },
  { id: 'vestidos', nombre: 'Vestidos', ico: svgCat('<path d="M9.5 2.5v3L8 9.5h8l-1.5-4v-3"/><path d="M9.5 5.5c.8.7 1.6 1 2.5 1s1.7-.3 2.5-1M8 9.5 4.5 21h15L16 9.5"/>') },
  { id: 'blusas', nombre: 'Blusas', ico: svgCat('<path d="M9.5 3.5h5l5 3-1.4 5-2.1-.8V20H8v-9.3l-2.1.8-1.4-5z"/><path d="M9.5 3.5c.6 1.3 1.4 2 2.5 2s1.9-.7 2.5-2"/>') },
  { id: 'camisas', nombre: 'Camisas', ico: svgCat('<path d="M9 3 4.5 5 3 10l3 1v10h12V11l3-1-1.5-5L15 3"/><path d="M9 3l-.6 3.2L12 9l3.6-2.8L15 3M9 3c1 .8 2 1.2 3 1.2S14 3.8 15 3M12 9v12"/>') },
  { id: 'blazers', nombre: 'Blazers', ico: svgCat('<path d="M9 3 4 5.5V19h5M15 3l5 2.5V19h-5"/><path d="M9 3l3 7 3-7M12 10v9M9 19h6M6.5 14h2"/>') },
  { id: 'abrigos', nombre: 'Abrigos', ico: svgCat('<path d="M9 2.5 5 4.5V22h14V4.5l-4-2"/><path d="M9 2.5 12 9l3-6.5M12 9v13M5 13.5h14M10 13.5l-1.5 3.5M14 13.5l1.5 3.5"/>') },
];
const LINEAS = [{ id: 'coro', nombre: 'Ideal para coros' }];
const COLORES = [
  { id: 'rosa-viejo', nombre: 'Rosa viejo', hex: '#C98A91' },
  { id: 'rosa', nombre: 'Rosa empolvado', hex: '#DDB5C6' },
  { id: 'crema', nombre: 'Crema', hex: '#EAE3D8' },
  { id: 'crema-floral', nombre: 'Crema floral', hex: '#E6D6C2' },
  { id: 'blanco', nombre: 'Blanco', hex: '#F4F2F3' },
  { id: 'lila', nombre: 'Lila', hex: '#BBA0C9' },
  { id: 'celeste', nombre: 'Celeste', hex: '#A3BCD0' },
  { id: 'verde-salvia', nombre: 'Verde salvia', hex: '#8E9C83' },
  { id: 'camel', nombre: 'Camel', hex: '#B07E56' },
  { id: 'gris', nombre: 'Gris topo', hex: '#8E8984' },
  { id: 'ciruela', nombre: 'Ciruela', hex: '#5C2843' },
  { id: 'bordo', nombre: 'Bordó', hex: '#6A2333' },
  { id: 'azul-marino', nombre: 'Azul marino', hex: '#263257' },
  { id: 'negro', nombre: 'Negro', hex: '#2A2729' },
];
const LETRAS = ['S', 'M', 'L', 'XL', 'XXL'];
const TALLES = [...LETRAS, 'Único'];
const PRECIOS = [
  { id: 'hasta40', nombre: 'Hasta $40.000', min: null, max: 40000 },
  { id: '40a75', nombre: '$40.000 a $75.000', min: 40001, max: 75000 },
  { id: 'mas75', nombre: 'Más de $75.000', min: 75001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  polleras: 'pollera polleras maxi falda faldas larga largas', vestidos: 'vestido vestidos largo largos',
  blusas: 'blusa blusas', camisas: 'camisa camisas camisero', blazers: 'blazer blazers saco sacos chaqueta',
  abrigos: 'abrigo abrigos tapado tapados campera',
  coro: 'coro coros iglesia uniforme uniformes grupo',
  'rosa-viejo': 'rosa viejo', rosa: 'rosa empolvado', crema: 'crema natural', 'crema-floral': 'crema floral flores estampado',
  blanco: 'blanco blanca', lila: 'lila violeta lavanda', celeste: 'celeste', 'verde-salvia': 'verde salvia', camel: 'camel marron',
  gris: 'gris topo', ciruela: 'ciruela violeta', bordo: 'bordo bordeaux vino', 'azul-marino': 'azul marino', negro: 'negro negra',
};
const S5 = (s, m, l, xl, xxl) => ({ S: s, M: m, L: l, XL: xl, XXL: xxl });

const Tienda = crearTienda([
  { id: 'vestido-coro', nombre: 'Vestido para coro', plural: 'vestidos para coro', cat: 'vestidos', linea: ['coro'], tipo: 'letras', precio: 74000, descuento: 0, alta: 30, rango: 1, tag: 'coro',
    colores: [
      { id: 'bordo', img: 'images/vestido-coro-bordo.webp', alt: 'Tres vestidos largos bordó iguales colgados en un perchero', stock: S5(2, 3, 2, 1, 0) },
      { id: 'azul-marino', img: 'images/vestido-coro-azul.webp', alt: 'Tres vestidos largos azul marino iguales colgados en un perchero', stock: S5(1, 2, 2, 0, 0) },
      { id: 'negro', img: 'images/vestido-coro-negro.webp', alt: 'Tres vestidos largos negros iguales colgados en un perchero', stock: S5(0, 2, 1, 1, 0) },
    ],
    desc: 'El modelo que más nos piden los coros: vestido largo de crepe, cuello redondo, manga larga y cintura marcada. Lo traemos en cantidad y en el mismo color para todas.',
    datos: [['Tela', 'Crepe'], ['Cuello', 'Redondo'], ['Manga', 'Larga con puño'], ['Largo', '125 cm']] },
  { id: 'maxi-pollera-lisa', nombre: 'Maxi pollera lisa', plural: 'maxi polleras lisas', cat: 'polleras', linea: ['coro'], tipo: 'letras', precio: 42000, descuento: 0, alta: 24, rango: 2,
    colores: [
      { id: 'rosa-viejo', img: 'images/pollera-lisa-rosa.webp', alt: 'Maxi pollera lisa rosa viejo colgada en una percha de madera', stock: S5(2, 4, 3, 2, 1) },
      { id: 'negro', img: 'images/pollera-lisa-negra.webp', alt: 'Maxi pollera lisa negra colgada en una percha de madera', stock: S5(3, 5, 4, 2, 1) },
      { id: 'azul-marino', img: 'images/pollera-lisa-azul.webp', alt: 'Maxi pollera lisa azul marino colgada en una percha de madera', stock: S5(1, 3, 2, 0, 0) },
    ],
    desc: 'Maxi pollera lisa de crepe, con cintura elastizada atrás y caída amplia hasta el tobillo. Va con blusa, camisa o blazer.',
    datos: [['Tela', 'Crepe con caída'], ['Cintura', 'Elastizada atrás'], ['Corte', 'Evasé'], ['Largo', '95 cm']] },
  { id: 'blusa-cuello-alto', nombre: 'Blusa cuello alto', plural: 'blusas cuello alto', cat: 'blusas', linea: ['coro'], tipo: 'letras', precio: 36000, descuento: 0, alta: 22, rango: 3,
    colores: [
      { id: 'crema', img: 'images/blusa-cuello-alto-crema.webp', alt: 'Blusa crema de cuello alto con pliegues, colgada en una percha', stock: S5(2, 4, 3, 2, 1) },
      { id: 'rosa', img: 'images/blusa-cuello-alto-rosa.webp', alt: 'Blusa rosa empolvado de cuello alto con pliegues, colgada en una percha', stock: S5(1, 2, 2, 1, 0) },
    ],
    desc: 'Blusa de cuello alto con pliegues al frente, manga larga abullonada y puño con botón. Delicada con maxi polleras lisas o plisadas.',
    datos: [['Tela', 'Gasa'], ['Cuello', 'Alto con botón atrás'], ['Manga', 'Larga abullonada'], ['Detalle', 'Pliegues al frente']] },
  { id: 'vestido-floral', nombre: 'Vestido floral manga larga', plural: 'vestidos florales', cat: 'vestidos', linea: [], tipo: 'letras', precio: 68000, descuento: 0, alta: 32, rango: 4, tag: 'nuevo',
    colores: [
      { id: 'crema-floral', img: 'images/vestido-floral-crema.webp', alt: 'Vestido largo floral color crema con manga larga, colgado en una percha', stock: S5(1, 3, 2, 1, 0) },
    ],
    desc: 'Vestido largo de fibrana estampada con florcitas, cuello redondo, manga larga con puño y falda con recorte bajo el busto.',
    datos: [['Tela', 'Fibrana estampada'], ['Cuello', 'Redondo'], ['Manga', 'Larga con puño'], ['Largo', '120 cm']] },
  { id: 'blazer-entallado', nombre: 'Blazer entallado', plural: 'blazers entallados', cat: 'blazers', linea: ['coro'], tipo: 'letras', precio: 79000, descuento: 0, alta: 18, rango: 5,
    colores: [
      { id: 'ciruela', img: 'images/blazer-entallado-ciruela.webp', alt: 'Blazer entallado color ciruela con un botón, colgado en una percha', stock: S5(1, 2, 2, 1, 0) },
      { id: 'negro', img: 'images/blazer-entallado-negro.webp', alt: 'Blazer entallado negro con un botón, colgado en una percha', stock: S5(1, 3, 2, 1, 1) },
    ],
    desc: 'Blazer entallado de gabardina con forro, solapa y un botón. Arma un conjunto con maxi pollera y blusa, para el culto o el trabajo.',
    datos: [['Tela', 'Gabardina con forro'], ['Cierre', 'Un botón'], ['Bolsillos', 'Dos con tapa'], ['Calce', 'Entallado']] },
  { id: 'maxi-pollera-plisada', nombre: 'Maxi pollera plisada', plural: 'maxi polleras plisadas', cat: 'polleras', linea: ['coro'], tipo: 'unico', precio: 46000, descuento: 0, alta: 26, rango: 6,
    colores: [
      { id: 'azul-marino', img: 'images/pollera-plisada-azul.webp', alt: 'Maxi pollera plisada azul marino', stock: { 'Único': 6 } },
      { id: 'negro', img: 'images/pollera-plisada-negra.webp', alt: 'Maxi pollera plisada negra', stock: { 'Único': 8 } },
      { id: 'bordo', img: 'images/pollera-plisada-bordo.webp', alt: 'Maxi pollera plisada bordó', stock: { 'Único': 0 } },
    ],
    desc: 'Maxi pollera plisada con cintura elastizada que se adapta del S al XL. El plisado se mueve con vos y no se arruga.',
    datos: [['Tela', 'Plisado permanente'], ['Cintura', 'Elastizada'], ['Talle', 'Único, del S al XL'], ['Largo', '92 cm']] },
  { id: 'camisa-clasica', nombre: 'Camisa clásica', plural: 'camisas clásicas', cat: 'camisas', linea: ['coro'], tipo: 'letras', precio: 38000, descuento: 0, alta: 16, rango: 7,
    colores: [
      { id: 'lila', img: 'images/camisa-clasica-lila.webp', alt: 'Camisa lila doblada, con cuello camisero', stock: S5(2, 3, 3, 1, 1) },
      { id: 'blanco', img: 'images/camisa-clasica-blanca.webp', alt: 'Camisa blanca doblada, con cuello camisero', stock: S5(3, 5, 4, 2, 1) },
      { id: 'celeste', img: 'images/camisa-clasica-celeste.webp', alt: 'Camisa celeste doblada, con cuello camisero', stock: S5(1, 2, 2, 1, 0) },
    ],
    desc: 'Camisa de poplín con cuello camisero, manga larga con puño y botones al tono. Sola, con blazer o debajo de un tapado.',
    datos: [['Tela', 'Poplín de algodón'], ['Cuello', 'Camisero'], ['Manga', 'Larga con puño'], ['Calce', 'Recto']] },
  { id: 'tapado-con-cinto', nombre: 'Tapado largo con cinto', plural: 'tapados largos', cat: 'abrigos', linea: [], tipo: 'letras', precio: 118000, descuento: 15, alta: 12, rango: 8,
    colores: [
      { id: 'camel', img: 'images/tapado-cinto-camel.webp', alt: 'Tapado largo color camel con cinto, colgado en una percha', stock: S5(1, 2, 2, 1, 0) },
      { id: 'gris', img: 'images/tapado-cinto-gris.webp', alt: 'Tapado largo gris topo con cinto, colgado en una percha', stock: S5(0, 1, 1, 1, 0) },
    ],
    desc: 'Tapado largo de paño con solapa, cinto para marcar la cintura y dos bolsillos. Abriga y acompaña el largo de las maxi polleras.',
    datos: [['Tela', 'Paño'], ['Cierre', 'Cruzado con cinto'], ['Bolsillos', 'Dos'], ['Largo', '110 cm']] },
  { id: 'vestido-cuello-alto', nombre: 'Vestido cuello alto', plural: 'vestidos cuello alto', cat: 'vestidos', linea: ['coro'], tipo: 'letras', precio: 72000, descuento: 0, alta: 28, rango: 9,
    colores: [
      { id: 'verde-salvia', img: 'images/vestido-cuello-alto-salvia.webp', alt: 'Vestido largo verde salvia de cuello alto, colgado en una percha', stock: S5(1, 2, 3, 1, 1) },
      { id: 'azul-marino', img: 'images/vestido-cuello-alto-azul.webp', alt: 'Vestido largo azul marino de cuello alto, colgado en una percha', stock: S5(0, 2, 2, 1, 0) },
    ],
    desc: 'Vestido largo de crepe con cuello alto, manga abullonada con puño y recorte bajo el busto que da vuelo a la falda.',
    datos: [['Tela', 'Crepe'], ['Cuello', 'Alto con botón'], ['Manga', 'Larga abullonada'], ['Largo', '118 cm']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreEn = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const tallesDeP = p => TALLES.filter(t => p.colores.some(v => t in v.stock));
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, ETIQUETAS[p.cat] || '', nombreEn(CATEGORIAS, p.cat),
    ...p.linea.map(e => `${ETIQUETAS[e] || ''} ${nombreEn(LINEAS, e)}`),
    ...p.colores.map(v => `${ETIQUETAS[v.id] || ''} ${nombreEn(COLORES, v.id)}`),
    tallesDeP(p).join(' '),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const variantes = (p, colores) => (colores.length ? p.colores.filter(v => colores.includes(v.id)) : p.colores);
  const hayTalle = (p, talles, colores) => variantes(p, colores).some(v => talles.some(t => (Number(v.stock?.[t]) || 0) > 0));

  function coincide(p, f) {
    const cat = lista(f.cat), linea = lista(f.linea), color = lista(f.color), talle = lista(f.talle), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (linea.length && !linea.some(e => p.linea.includes(e))) return false;
    if (color.length && !p.colores.some(v => color.includes(v.id))) return false;
    if (talle.length && !hayTalle(p, talle, color)) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const colorDe = id => COLORES.find(c => c.id === id) || { nombre: '', hex: '#ccc' };
const lineaTxt = p => (p.linea.includes('coro') ? 'Ideal para coros' : '');
const varDe = (p, c) => (p ? p.colores.find(v => v.id === c) || p.colores[0] : null);
const stockDe = (p, c, t) => { const v = p && p.colores.find(x => x.id === c); return v ? Number(v.stock[t]) || 0 : 0; };
const tallesDe = p => TALLES.filter(t => p.colores.some(v => t in v.stock));
const tallesColor = (p, c) => { const v = varDe(p, c); return TALLES.filter(t => v && t in v.stock); };
const stockTotal = p => p.colores.reduce((s, v) => s + Object.values(v.stock).reduce((a, b) => a + (Number(b) || 0), 0), 0);
const rangoTalles = p => { const t = tallesDe(p); return t.length === 1 ? (t[0] === 'Único' ? 'Talle único' : `Talle ${t[0]}`) : `Talles ${t[0]} al ${t[t.length - 1]}`; };
const prendas = n => `${n} ${n === 1 ? 'prenda' : 'prendas'}`;
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
const KEY_TALLE = 'preciosamia_talle';
let tallePref = (() => { const v = leer(KEY_TALLE, ''); return LETRAS.includes(v) ? v : ''; })();
const prefPara = p => (p.tipo === 'unico' ? 'Único' : tallePref);
const recordarTalle = t => { if (LETRAS.includes(t) && t !== tallePref) { tallePref = t; guardar(KEY_TALLE, t); } };
const colorCon = (p, t) => (t ? (p.colores.find(v => (Number(v.stock[t]) || 0) > 0) || p.colores[0]).id : p.colores[0].id);

const ICO = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const Cart = {
  KEY: 'preciosamia_cart',
  get() {
    const a = leer(this.KEY, []);
    if (!Array.isArray(a)) return [];
    return a.filter(i => i && getProducto(i.id) && i.qty > 0 && stockDe(getProducto(i.id), i.c, String(i.t)) > 0)
      .map(i => ({ id: i.id, c: i.c, t: String(i.t), qty: Math.min(i.qty, stockDe(getProducto(i.id), i.c, String(i.t))) }));
  },
  save(items) {
    guardar(this.KEY, items.map(({ id, c, t, qty }) => ({ id, c, t, qty })));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, c, t, qty = 1) {
    const items = this.get();
    const max = stockDe(producto, c, t);
    if (!max) return false;
    const existing = items.find(i => i.id === producto.id && i.c === c && i.t === t);
    const antes = existing ? existing.qty : 0;
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, c, t, qty: Math.min(qty, max) });
    this.save(items);
    recordarTalle(t);
    return (existing ? existing.qty : Math.min(qty, max)) > antes;
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    it.qty = Math.max(1, Math.min(qty, stockDe(getProducto(it.id), it.c, it.t)));
    this.save(items);
  },
  maxDe(idx) { const it = this.get()[idx]; return it ? stockDe(getProducto(it.id), it.c, it.t) : 1; },
  enCarrito(id, c, t) { return this.get().filter(i => i.id === id && i.c === c && i.t === t).reduce((s, i) => s + i.qty, 0); },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
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
const talleTxt = t => (t === 'Único' ? 'talle único' : `talle ${t}`);
const avisoSumado = (p, c, t, sumo) => (sumo
  ? `Sumaste ${p.nombre} en ${colorDe(c).nombre.toLowerCase()}, ${talleTxt(t)}.`
  : `Ya tenés en el carrito todas las unidades que quedan en ${talleTxt(t)}.`);
const msgEncargo = (p, c, t) => `Hola Preciosa Mía! Quiero encargar ${p.nombre} en ${colorDe(c).nombre.toLowerCase()}, ${talleTxt(t)}, para el pedido de la semana.`;

function precioHTML(p) {
  if (p.descuento > 0) return `<p class="precio precio--desc"><b>${formatearPrecio(precioFinal(p))}</b><s>${formatearPrecio(p.precio)}</s></p>`;
  return `<p class="precio">${formatearPrecio(p.precio)}</p>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="badge badge--desc">-${p.descuento}%</span>`;
  if (p.tag === 'coro') return '<span class="badge badge--coro">Para coros</span>';
  if (p.tag === 'nuevo') return '<span class="badge">Nuevo</span>';
  if (stockTotal(p) <= 8) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  return '';
}
const dotsHTML = p => `<span class="dots" aria-label="${esc(p.colores.map(v => colorDe(v.id).nombre).join(', '))}">${p.colores.map(v => `<span style="background:${colorDe(v.id).hex}"></span>`).join('')}</span>`;
function swsHTML(p, c, cls = '') {
  return `<div class="sws ${cls}" role="group" aria-label="Color de ${esc(p.nombre)}">${p.colores.map(v => {
    const k = colorDe(v.id);
    return `<button type="button" class="sw" data-sw="${v.id}" aria-pressed="${v.id === c}" aria-label="${esc(k.nombre)}" title="${esc(k.nombre)}"><span style="background:${k.hex}"></span></button>`;
  }).join('')}</div>`;
}
const ANIM_CARD = 'data-animate="subir" style="opacity:0;transform:translateY(30px)"';
function talleOptions(p, c) {
  const pref = prefPara(p);
  const elegido = pref && stockDe(p, c, pref) > 0 ? pref : '';
  return '<option value="">Talle</option>' + tallesColor(p, c).map(t => {
    const s = stockDe(p, c, t);
    const nom = t === 'Único' ? 'Único' : t;
    return `<option value="${esc(t)}"${s ? '' : ' disabled'}${t === elegido ? ' selected' : ''}>${esc(nom)}${s ? '' : ' · a pedido'}</option>`;
  }).join('');
}
function cardHTML(p, animar = true) {
  const c = colorCon(p, prefPara(p));
  const v = varDe(p, c);
  const linea = lineaTxt(p);
  return `<article class="card" ${animar ? ANIM_CARD : ''} data-id="${p.id}" data-color="${c}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${v.img}" width="1200" height="1200" alt="${esc(v.alt)}" decoding="async"></button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)}${linea ? ` · ${esc(linea)}` : ''}</p>
      <h3 class="card__nombre">${esc(p.nombre)}</h3>
      <div class="card__fila">${precioHTML(p)}${dotsHTML(p)}</div>
      <div class="card__fila card__sws">${swsHTML(p, c)}<span class="sw-nom" data-sw-nom>${esc(colorDe(c).nombre)}</span></div>
      <div class="prod-actions"><select class="talle-sel" data-talle-sel="${p.id}" aria-label="Talle de ${esc(p.nombre)}">${talleOptions(p, c)}</select><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span class="prod-add__txt">Agregar</span></button></div>
      <button type="button" class="prod-ahora" data-ahora="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}
function vcardHTML(p, animar = true, cls = '') {
  const v = varDe(p, colorCon(p, prefPara(p)));
  return `<article class="vcard${cls ? ` ${cls}` : ''}" ${animar ? ANIM_CARD : ''} data-id="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">${badgeHTML(p)}<img src="${v.img}" width="1200" height="1200" alt="${esc(v.alt)}" decoding="async"></button>
    <div class="vcard__info">
      <h3 class="vcard__nombre">${esc(p.nombre)}</h3>
      <p class="vcard__precio">${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>
      <p class="vcard__meta">${dotsHTML(p)}<span>${esc(rangoTalles(p))}</span></p>
      <button type="button" class="vcard__add" data-quick="${p.id}" aria-label="Elegir talle y color de ${esc(p.nombre)}">${ICO.carrito}</button>
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) {
    if (MODELO === '1') {
      tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
      tl.from(img, { rotation: 2.4, duration: 2.3, ease: 'elastic.out(1, 0.45)', transformOrigin: '50% 4%', clearProps: 'transform' }, 0);
    } else {
      tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
    }
  }
  const halo = hero.querySelector('.hero__halo');
  if (halo) tl.from(halo, { opacity: 0, scale: 0.86, duration: 1.6, clearProps: 'transform,opacity' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__nota li, .cat-linea li'), { y: 12, opacity: 0, duration: 0.8, stagger: 0.05, clearProps: 'transform,opacity' }, 0.75);
  const sello = hero.querySelector('.hero__sello');
  if (sello) tl.from(sello, { scale: 0.92, rotation: -12, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.65);
  const tag = hero.querySelector('.etiqueta');
  if (tag) tl.from(tag, { y: 26, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}
function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const img = document.querySelector('.hero--m2 [data-hero-img]');
  if (img) gsap.to(img, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
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
    nav.querySelector('.nav-drop__btn, a')?.focus();
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
  const lista = document.querySelector('[data-menu-categorias]');
  if (lista) {
    const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><span class="nav-drop__ico">${c.ico}</span><span class="nav-drop__nom">${esc(c.nombre)}</span><span class="nav-drop__cant">${n}</span></a></li>`;
    }).join('') + `<li><a href="${CATALOGO_URL}?linea=coro"><span class="nav-drop__ico nav-drop__ico--coro">${ICO.flecha}</span><span class="nav-drop__nom">Ideal para coros</span><span class="nav-drop__cant">${Tienda.contar({ linea: ['coro'] })}</span></a></li>`;
  }
  const drop = document.querySelector('[data-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const hover = window.matchMedia('(hover: hover) and (min-width: 961px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (hover.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (hover.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (!drop.contains(e.target) && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, summary, [tabindex]:not([tabindex="-1"])';
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
function abrirCapa(el, bd) {
  el.hidden = false; bd.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); bd.classList.add('open'); }));
}
function cerrarCapa(el, bd, despues) {
  el.classList.remove('open'); bd.classList.remove('open');
  setTimeout(() => {
    el.hidden = true; bd.hidden = true;
    if (!document.querySelector('.drawer.open, .modal.open')) document.body.classList.remove('no-scroll');
    despues?.();
  }, 320);
}

const Drawer = {
  el: null, bd: null, origen: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const paso = e.target.closest('[data-linea-step]');
      if (paso) {
        const idx = Number(paso.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaStep));
        return;
      }
      const quitar = e.target.closest('[data-quitar]');
      if (quitar) {
        const idx = Number(quitar.closest('[data-idx]').dataset.idx);
        const it = Cart.get()[idx];
        Cart.remove(idx);
        if (it) showToast(`Sacaste ${getProducto(it.id).nombre} del carrito.`);
        this.el.querySelector('.drawer__cab button')?.focus();
        return;
      }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-catalogo]')) this.close();
    });
    document.addEventListener('cart:updated', () => this.render());
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-open-cart]');
      if (b) { e.preventDefault(); this.open(b); }
    });
    this.render();
  },
  render() {
    if (!this.el) return;
    const body = this.el.querySelector('[data-lineas]');
    const foot = this.el.querySelector('[data-foot]');
    const items = Cart.get();
    if (!items.length) {
      body.innerHTML = `<div class="carrito-vacio">${ICO.carrito}<h3>Tu carrito está vacío</h3><p>Elegí una prenda, marcá tu talle y tu color, y sumala: queda guardada acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}" data-ir-catalogo>Ver la tienda</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map((it, idx) => {
      const p = getProducto(it.id);
      const v = varDe(p, it.c);
      const max = Cart.maxDe(idx);
      return `<div class="linea" data-idx="${idx}" style="animation-delay:${Math.min(idx * 0.05, 0.3)}s">
        <img src="${v.img}" width="72" height="72" alt="">
        <div><p class="linea__nom">${esc(p.nombre)}</p><p class="linea__op">${it.t === 'Único' ? 'Talle único' : `Talle ${esc(it.t)}`} · ${esc(colorDe(it.c).nombre)}</p>
          <div class="linea__fila"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar una unidad"${it.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${it.qty}</output><button type="button" data-linea-step="1" aria-label="Sumar una unidad"${it.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="linea__quitar" data-quitar>Quitar</button></div></div>
        <p class="linea__precio">${formatearPrecio(precioFinal(p) * it.qty)}</p>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open(origen) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.render();
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__cab button')?.focus(), 60);
  },
  close() {
    if (!this.el || !this.el.classList.contains('open')) return;
    cerrarCapa(this.el, this.bd, () => this.origen?.focus?.());
  },
};

const Modal = {
  el: null, bd: null, origen: null, p: null, c: '', t: '', qty: 1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el || !this.bd) return;
    this.bd.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const sw = e.target.closest('[data-sw]');
      if (sw) { this.elegirColor(sw.dataset.sw); return; }
      const talle = e.target.closest('[data-talle]');
      if (talle) { this.elegirTalle(talle.dataset.talle); return; }
      const paso = e.target.closest('[data-vstep]');
      if (paso) { this.qty += Number(paso.dataset.vstep); this.syncQty(); return; }
      if (e.target.closest('[data-vadd]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vahora]')) { this.agregar(true); return; }
      const rel = e.target.closest('[data-rel]');
      if (rel) this.mostrar(rel.dataset.rel, '', this.t);
    });
  },
  pintarTalles() {
    const cont = this.el.querySelector('[data-talles-lista]');
    if (!cont) return;
    const p = this.p;
    cont.innerHTML = tallesColor(p, this.c).map(t => {
      const s = stockDe(p, this.c, t);
      const nom = t === 'Único' ? 'Único' : t;
      return `<button type="button" data-talle="${esc(t)}" aria-pressed="${t === this.t}"${s ? '' : ` class="a-pedido" aria-label="Talle ${esc(nom)}, a pedido"`}>${esc(nom)}${s ? '' : '<small>a pedido</small>'}</button>`;
    }).join('');
  },
  elegirColor(c) {
    const p = this.p;
    if (!p || !p.colores.some(v => v.id === c)) return;
    this.c = c;
    const v = varDe(p, c);
    const img = this.el.querySelector('.vista__principal img');
    if (img) { img.src = v.img; img.alt = v.alt; }
    this.el.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sw === c)));
    const nom = this.el.querySelector('[data-color-nom]');
    if (nom) nom.textContent = colorDe(c).nombre;
    const wsp = this.el.querySelector('[data-vwsp]');
    if (wsp) wsp.href = waLink(`Hola Preciosa Mía! Quiero consultar por ${p.nombre} en ${colorDe(c).nombre.toLowerCase()} que vi en la web.`);
    if (this.t && !tallesColor(p, c).includes(this.t)) this.t = '';
    this.pintarTalles();
    this.infoTalle();
    this.syncQty();
  },
  infoTalle() {
    const info = this.el.querySelector('[data-talle-stock]');
    const compra = this.el.querySelector('[data-compra]');
    const encargo = this.el.querySelector('[data-encargo]');
    const s = this.t ? stockDe(this.p, this.c, this.t) : 0;
    const aPedido = Boolean(this.t) && !s;
    if (compra) compra.hidden = aPedido;
    if (encargo) {
      encargo.hidden = !aPedido;
      if (aPedido) encargo.querySelector('a').href = waLink(msgEncargo(this.p, this.c, this.t));
    }
    if (!info) return;
    if (!this.t) { info.textContent = ''; return; }
    if (aPedido) { info.textContent = `El ${talleTxt(this.t)} en ${colorDe(this.c).nombre.toLowerCase()} no está en stock: lo traemos en el pedido de la semana.`; return; }
    info.textContent = s <= 2 ? `Quedan ${s === 1 ? '1 unidad' : `${s} unidades`} en ${talleTxt(this.t)}.` : `Hay stock en ${talleTxt(this.t)}.`;
  },
  elegirTalle(t) {
    if (!this.p || !tallesColor(this.p, this.c).includes(t)) return;
    this.t = t;
    this.el.querySelectorAll('[data-talle]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.talle === t)));
    const aviso = this.el.querySelector('[data-talle-aviso]');
    if (aviso) aviso.hidden = true;
    this.infoTalle();
    this.syncQty();
  },
  maximo() {
    if (!this.p || !this.t) return 1;
    return Math.max(1, stockDe(this.p, this.c, this.t) - Cart.enCarrito(this.p.id, this.c, this.t));
  },
  syncQty() {
    const max = this.maximo();
    this.qty = Math.max(1, Math.min(this.qty, max));
    const out = this.el.querySelector('[data-vqty]');
    if (out) out.textContent = this.qty;
    const menos = this.el.querySelector('[data-vstep="-1"]'), mas = this.el.querySelector('[data-vstep="1"]');
    if (menos) menos.disabled = this.qty <= 1;
    if (mas) mas.disabled = this.qty >= max;
  },
  agregar(ahora) {
    const p = this.p;
    if (!p) return;
    if (!this.t) {
      const aviso = this.el.querySelector('[data-talle-aviso]');
      if (aviso) aviso.hidden = false;
      this.el.querySelector('[data-talle]')?.focus();
      return;
    }
    if (!stockDe(p, this.c, this.t)) return;
    const sumo = Cart.add(p, this.c, this.t, this.qty);
    if (ahora) {
      this.close(false);
      setTimeout(() => Drawer.open(this.origen), 340);
    } else {
      showToast(avisoSumado(p, this.c, this.t, sumo));
      this.syncQty();
    }
  },
  html(p, c) {
    const v = varDe(p, c);
    const rel = Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { linea: p.linea.length ? p.linea : [], excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const unico = p.tipo === 'unico';
    const tabla = unico ? '' : (document.getElementById('tabla-talles')?.innerHTML || '');
    const linea = lineaTxt(p);
    return `<div class="vista">
      <div class="vista__galeria"><div class="vista__principal"><img src="${v.img}" alt="${esc(v.alt)}" width="1200" height="1200"></div></div>
      <div class="vista__info">
        <p class="vista__cat">${esc(catDe(p.cat).nombre)}${linea ? ` · ${esc(linea)}` : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        <div class="colores"><span class="colores__etq">Color: <b data-color-nom>${esc(colorDe(c).nombre)}</b></span>${swsHTML(p, c)}</div>
        <fieldset class="talles"><legend>${unico ? 'Talle' : 'Elegí tu talle'}</legend><div class="talles__lista" data-talles-lista></div><p class="talles__aviso" data-talle-aviso hidden>Elegí tu talle para sumarlo al carrito.</p><p class="talles__stock" data-talle-stock></p>${tabla}</fieldset>
        <div class="vista__compra" data-compra>
          <div class="stepper"><button type="button" data-vstep="-1" aria-label="Restar una unidad">${ICO.menos}</button><output data-vqty aria-live="polite">1</output><button type="button" data-vstep="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vadd>Agregar al carrito</button>
          <button type="button" class="btn btn--linea" data-vahora>Comprar ahora</button>
        </div>
        <div class="vista__encargo" data-encargo hidden><a class="btn btn--wsp btn--full" href="${waLink(`Hola Preciosa Mía! Quiero encargar ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.wsp} Encargar en el pedido de la semana</a></div>
        <dl class="vista__datos">${(p.datos || []).map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
        <a class="link-wsp vista__wsp" href="${waLink(`Hola Preciosa Mía! Quiero consultar por ${p.nombre} en ${colorDe(c).nombre.toLowerCase()} que vi en la web.`)}" data-vwsp target="_blank" rel="noopener">${ICO.wsp} Consultar por esta prenda</a>
        ${rel.length ? `<div class="relacionados"><h3>También te puede interesar</h3><div class="relacionados__lista">${rel.map(r => `<button type="button" data-rel="${r.id}"><img src="${r.colores[0].img}" alt="" width="200" height="200">${esc(r.nombre)}</button>`).join('')}</div></div>` : ''}
      </div>
    </div>`;
  },
  mostrar(id, color, talle) {
    const p = getProducto(id);
    if (!p) return;
    const pref = [talle, prefPara(p)].find(t => t && p.colores.some(v => (Number(v.stock[t]) || 0) > 0)) || '';
    let c = p.colores.some(v => v.id === color) ? color : colorCon(p, pref);
    if (pref && !stockDe(p, c, pref)) c = colorCon(p, pref);
    this.p = p; this.c = c; this.t = ''; this.qty = 1;
    this.el.querySelector('[data-modal-cuerpo]').innerHTML = this.html(p, c);
    this.el.setAttribute('aria-label', `Detalle: ${p.nombre}`);
    this.el.scrollTop = 0;
    this.pintarTalles();
    if (p.tipo === 'unico') this.elegirTalle('Único');
    else if (pref) this.elegirTalle(pref);
    this.infoTalle();
    this.syncQty();
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', id); history.replaceState(null, '', u); }
  },
  open(id, origen, color, talle) {
    if (!this.el) return;
    this.origen = origen || document.activeElement;
    this.mostrar(id, color, talle);
    if (!this.el.classList.contains('open')) abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
  },
  close(devolver = true) {
    if (!this.el || !this.el.classList.contains('open')) return;
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('producto'); history.replaceState(null, '', u); }
    cerrarCapa(this.el, this.bd, () => { if (devolver) this.origen?.focus?.(); });
  },
};

const cardDe = el => el.closest('.card, .vcard');
function talleDeCard(el) {
  return cardDe(el)?.querySelector('[data-talle-sel]') || null;
}
function pedirTalle(sel) {
  if (!sel) return;
  sel.setAttribute('aria-invalid', 'true');
  sel.focus();
  showToast('Elegí tu talle para sumarlo al carrito.');
}
function cambiarColorCard(card, c) {
  const p = getProducto(card.dataset.id);
  if (!p || !p.colores.some(v => v.id === c)) return;
  card.dataset.color = c;
  const v = varDe(p, c);
  const img = card.querySelector('.card__foto img');
  if (img) { img.src = v.img; img.alt = v.alt; }
  card.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.sw === c)));
  const nom = card.querySelector('[data-sw-nom]');
  if (nom) nom.textContent = colorDe(c).nombre;
  const sel = card.querySelector('[data-talle-sel]');
  if (sel) {
    const antes = sel.value;
    sel.innerHTML = talleOptions(p, c);
    if (antes && stockDe(p, c, antes)) sel.value = antes;
    sel.removeAttribute('aria-invalid');
  }
}
function initCardAcciones() {
  document.addEventListener('click', e => {
    if (e.target.closest('.modal, .drawer')) return;
    const sw = e.target.closest('.card [data-sw]');
    if (sw) { cambiarColorCard(cardDe(sw), sw.dataset.sw); return; }
    const quick = e.target.closest('[data-quick]');
    if (quick) { const card = cardDe(quick); Modal.open(quick.dataset.quick, quick, card?.dataset.color || '', talleDeCard(quick)?.value || ''); return; }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const card = cardDe(add);
      const sel = talleDeCard(add);
      if (!sel) { Modal.open(p.id, add); return; }
      if (!sel.value) { pedirTalle(sel); return; }
      const c = card.dataset.color || p.colores[0].id;
      const sumo = Cart.add(p, c, sel.value, 1);
      showToast(avisoSumado(p, c, sel.value, sumo));
      add.classList.add('ok');
      setTimeout(() => add.classList.remove('ok'), 900);
      return;
    }
    const ahora = e.target.closest('[data-ahora]');
    if (ahora) {
      const p = getProducto(ahora.dataset.ahora);
      if (!p) return;
      const sel = talleDeCard(ahora);
      if (!sel || !sel.value) { pedirTalle(sel); return; }
      Cart.add(p, cardDe(ahora).dataset.color || p.colores[0].id, sel.value, 1);
      Drawer.open(ahora);
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-talle-sel]');
    if (sel) sel.removeAttribute('aria-invalid');
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
  sync();
}

function initConteos() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = prendas(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-precio-de]').forEach(el => { const p = getProducto(el.dataset.precioDe); if (p) el.textContent = formatearPrecio(precioFinal(p)); });
}
function porIds(lista) {
  const ids = lista.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  const items = Tienda.consultar({ filtros: { ids }, limite: ids.length }).items;
  return ids.map(id => items.find(p => p.id === id)).filter(Boolean);
}
function initPreview() {
  const fichas = document.querySelector('[data-fichas]');
  if (fichas) fichas.innerHTML = porIds(fichas.dataset.fichas).map(p => cardHTML(p)).join('');
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) {
    const lista = porIds(mosaico.dataset.mosaico);
    mosaico.innerHTML = lista.map((p, i) => vcardHTML(p, true, i === 0 ? 'vcard--grande' : '')).join('')
      + `<a class="mosaico__todo" href="${CATALOGO_URL}" ${ANIM_CARD}><span class="mosaico__todo-n">${Tienda.contar({})}</span><span>prendas en la tienda</span><span class="mosaico__todo-cta">Ver todo ${ICO.flecha}</span></a>`;
  }
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const HORARIO = { dias: [2, 3, 4, 5, 6], abre: 9, cierra: 19 };
function horaArgentina(fecha) {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[val('weekday')];
    return { dia, min: (Number(val('hour')) % 24) * 60 + Number(val('minute')) };
  } catch {
    const ar = new Date(fecha.getTime() - 3 * 3600 * 1000);
    return { dia: ar.getUTCDay(), min: ar.getUTCHours() * 60 + ar.getUTCMinutes() };
  }
}
function estadoHorario(fecha = new Date()) {
  const { dia, min } = horaArgentina(fecha);
  const abreHoy = HORARIO.dias.includes(dia);
  if (abreHoy && min >= HORARIO.abre * 60 && min < HORARIO.cierra * 60) {
    const falta = HORARIO.cierra * 60 - min;
    return { abierto: true, texto: falta <= 60 ? `Abierto ahora · cerramos en ${falta} min` : `Abierto ahora · hasta las ${HORARIO.cierra} h` };
  }
  if (abreHoy && min < HORARIO.abre * 60) return { abierto: false, texto: `Cerrado · abrimos hoy a las ${HORARIO.abre} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO.dias.includes(d)) return { abierto: false, texto: `Cerrado · abrimos ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${HORARIO.abre} h` };
  }
  return { abierto: false, texto: 'Horario de atención' };
}
function initHorario() {
  const els = document.querySelectorAll('[data-horario-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoHorario();
    els.forEach(el => { el.textContent = e.texto; el.classList.toggle('estado--abierto', e.abierto); el.classList.toggle('estado--cerrado', !e.abierto); });
  };
  pintar();
  setInterval(pintar, 60000);
}

const CORO_IDS = ['vestido-coro', 'maxi-pollera-plisada', 'maxi-pollera-lisa', 'blusa-cuello-alto', 'camisa-clasica', 'blazer-entallado'];
const MAX_TALLE = 60;
function planillaCoro(p, c, cant, nombre = '', cuando = '') {
  const talles = tallesDe(p).filter(t => (Number(cant[t]) || 0) > 0);
  const total = talles.reduce((s, t) => s + Number(cant[t]), 0);
  const color = colorDe(c).nombre.toLowerCase();
  const prenda = total === 1 ? p.nombre.toLowerCase() : p.plural;
  const lineas = talles.map(t => ({ t: t === 'Único' ? 'Talle único' : t, n: Number(cant[t]) }));
  const titulo = total ? `${total} ${prenda} en ${color}` : 'Cargá cuántas necesitás de cada talle';
  const nom = String(nombre || '').trim().slice(0, 60);
  const para = nom ? `para el coro “${nom}”` : 'para nuestro coro';
  const detalle = talles.map(t => `${cant[t]} ${t === 'Único' ? 'talle único' : t}`).join(', ');
  const msg = total
    ? `Hola Preciosa Mía! Quiero hacer un pedido ${para}: ${titulo}. Talles: ${detalle}.${cuando ? ` Lo necesitamos ${cuando}.` : ''} ¿Me confirman precio y fecha de llegada?`
    : `Hola Preciosa Mía! Quiero consultar por un pedido ${para}: ${p.plural} en ${color}.`;
  return { total, lineas, titulo, referencia: total * precioFinal(p), msg };
}
function initCoros() {
  const panel = document.querySelector('[data-coros]');
  if (!panel) return;
  const prendasEl = panel.querySelector('[data-coros-prendas]');
  const coloresEl = panel.querySelector('[data-coros-colores]');
  const colorNom = panel.querySelector('[data-coros-color-nom]');
  const tallesEl = panel.querySelector('[data-coros-talles]');
  const nombre = panel.querySelector('[data-coros-nombre]');
  const cuando = panel.querySelector('[data-coros-cuando]');
  const img = panel.querySelector('[data-coros-img]');
  const titulo = panel.querySelector('[data-coros-titulo]');
  const lista = panel.querySelector('[data-coros-lista]');
  const precio = panel.querySelector('[data-coros-precio]');
  const wsp = panel.querySelector('[data-coros-wsp]');
  const fotoSec = document.querySelector('.coros__arco img');
  const productos = CORO_IDS.map(getProducto).filter(Boolean);
  if (!productos.length) return;
  const estado = { id: productos[0].id, c: productos[0].colores[0].id, cant: { S: 2, M: 4, L: 3, XL: 1 } };
  const pintarPrendas = () => {
    prendasEl.innerHTML = productos.map(p => `<button type="button" class="coros__prenda" data-coro-prenda="${p.id}" aria-pressed="${p.id === estado.id}"><img src="${p.colores[0].img}" width="1200" height="1200" alt=""><span>${esc(p.nombre)}</span></button>`).join('');
  };
  const pintarTalles = p => {
    tallesEl.innerHTML = tallesDe(p).map(t => {
      const n = Number(estado.cant[t]) || 0;
      const nom = t === 'Único' ? 'Talle único' : t;
      return `<div class="coro-talle"><span class="coro-talle__t">${esc(nom)}</span><div class="stepper"><button type="button" data-coro-paso="${esc(t)}" data-d="-1" aria-label="Restar una en ${esc(nom)}"${n <= 0 ? ' disabled' : ''}>${ICO.menos}</button><output aria-live="polite">${n}</output><button type="button" data-coro-paso="${esc(t)}" data-d="1" aria-label="Sumar una en ${esc(nom)}"${n >= MAX_TALLE ? ' disabled' : ''}>${ICO.mas}</button></div></div>`;
    }).join('');
  };
  const pintar = () => {
    const p = getProducto(estado.id);
    if (!p.colores.some(v => v.id === estado.c)) estado.c = p.colores[0].id;
    prendasEl.querySelectorAll('[data-coro-prenda]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.coroPrenda === estado.id)));
    coloresEl.innerHTML = swsHTML(p, estado.c);
    colorNom.textContent = colorDe(estado.c).nombre;
    pintarTalles(p);
    const v = varDe(p, estado.c);
    img.src = v.img;
    if (fotoSec && p.id === 'vestido-coro') { fotoSec.src = v.img; fotoSec.alt = v.alt; }
    const r = planillaCoro(p, estado.c, estado.cant, nombre.value, cuando.value);
    titulo.textContent = r.titulo;
    lista.innerHTML = r.lineas.map(l => `<li><span>${esc(l.t)}</span><i aria-hidden="true"></i><b>${l.n}</b></li>`).join('');
    precio.textContent = r.total ? `Precio de lista: ${formatearPrecio(precioFinal(p))} cada una · ${formatearPrecio(r.referencia)} en total` : '';
    wsp.href = waLink(r.msg);
    panel.classList.toggle('coros__panel--vacio', !r.total);
  };
  panel.addEventListener('click', e => {
    const pr = e.target.closest('[data-coro-prenda]');
    if (pr) {
      const antes = getProducto(estado.id);
      estado.id = pr.dataset.coroPrenda;
      const p = getProducto(estado.id);
      if (p.tipo === 'unico' && !(Number(estado.cant['Único']) > 0)) estado.cant['Único'] = LETRAS.reduce((s, t) => s + (Number(estado.cant[t]) || 0), 0) || 1;
      if (antes.tipo === 'unico' && p.tipo !== 'unico' && !LETRAS.some(t => estado.cant[t] > 0)) estado.cant.M = Number(estado.cant['Único']) || 1;
      const mismo = p.colores.find(v => v.id === estado.c);
      estado.c = mismo ? mismo.id : p.colores[0].id;
      pintar();
      return;
    }
    const sw = e.target.closest('[data-sw]');
    if (sw) { estado.c = sw.dataset.sw; pintar(); return; }
    const paso = e.target.closest('[data-coro-paso]');
    if (paso) {
      const t = paso.dataset.coroPaso;
      estado.cant[t] = Math.max(0, Math.min(MAX_TALLE, (Number(estado.cant[t]) || 0) + Number(paso.dataset.d)));
      pintar();
      tallesEl.querySelector(`[data-coro-paso="${t}"][data-d="${paso.dataset.d}"]:not([disabled])`)?.focus();
      return;
    }
    if (e.target.closest('[data-coros-wsp]') && panel.classList.contains('coros__panel--vacio')) {
      e.preventDefault();
      showToast('Cargá al menos una prenda en algún talle para armar la planilla.');
    }
  });
  nombre.addEventListener('input', pintar);
  cuando.addEventListener('change', pintar);
  pintarPrendas();
  pintar();
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const pos = [-34.5337287, -58.759089];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(pos, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', iconSize: [26, 26] });
  L.marker(pos, { icon: icono, keyboard: false, alt: 'Preciosa Mía, Julián Martel 4765' }).addTo(mapa).bindTooltip('Preciosa Mía · Julián Martel 4765', { direction: 'top', offset: [0, -16] });
  setTimeout(() => mapa.invalidateSize(), 500);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo]');
  if (!grid) return;
  const form = document.querySelector('[data-filtros]');
  const buscador = document.getElementById('buscar');
  const ordenSel = document.getElementById('orden');
  const contador = document.querySelector('[data-contador]');
  const verMas = document.querySelector('[data-ver-mas]');
  const miga = document.querySelector('[data-miga-cat]');
  const params = new URLSearchParams(location.search);
  const TALLES_OP = TALLES.map(t => ({ id: t, nombre: t }));
  const valida = (lista, v) => lista.some(x => x.id === v);
  const multiples = (clave, lista) => (params.get(clave) || '').split(',').filter(v => valida(lista, v));
  const estado = {
    cat: multiples('cat', CATEGORIAS),
    linea: multiples('linea', LINEAS),
    color: multiples('color', COLORES),
    talle: multiples('talle', TALLES_OP),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
    q: (params.get('q') || '').slice(0, 60),
  };
  const GRUPOS = { cat: CATEGORIAS, linea: LINEAS, color: COLORES };
  Object.entries(GRUPOS).forEach(([g, lista]) => {
    const cont = form.querySelector(`[data-ops="${g}"]`);
    if (!cont) return;
    cont.innerHTML = lista.filter(x => Tienda.contar({ [g]: x.id }) > 0).map(x => `<label class="opcion"><input type="checkbox" data-f="${g}" value="${x.id}"${estado[g].includes(x.id) ? ' checked' : ''}>${g === 'color' ? `<span class="opcion__dot" style="background:${x.hex}"></span>` : ''} ${esc(x.nombre)} <small>${Tienda.contar({ [g]: x.id })}</small></label>`).join('');
  });
  const tallesCont = form.querySelector('[data-ops="talle"]');
  if (tallesCont) {
    tallesCont.innerHTML = TALLES.map(t => `<label class="talle-chip${t === 'Único' ? ' talle-chip--ancho' : ''}" title="${prendas(Tienda.contar({ talle: [t] }))} con stock en talle ${t}"><input type="checkbox" data-f="talle" value="${t}"${estado.talle.includes(t) ? ' checked' : ''} aria-label="Talle ${t}"><span aria-hidden="true">${t}</span></label>`).join('');
  }
  const precioCont = form.querySelector('[data-ops="precio"]');
  if (precioCont) {
    precioCont.innerHTML = [{ id: '', nombre: 'Todos los precios' }, ...PRECIOS].map(x => `<label class="opcion"><input type="radio" name="precio" value="${x.id}"${estado.precio === x.id ? ' checked' : ''}> ${esc(x.nombre)}</label>`).join('');
  }
  if (ordenSel) ordenSel.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === estado.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  if (buscador) buscador.value = estado.q;

  const filtros = () => {
    const f = { cat: estado.cat, linea: estado.linea, color: estado.color, talle: estado.talle };
    const pr = PRECIOS.find(x => x.id === estado.precio);
    if (pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    if (estado.q.trim()) f.q = estado.q.trim();
    return f;
  };
  const syncUrl = () => {
    const u = new URL(location.href);
    ['cat', 'linea', 'color', 'talle', 'precio', 'orden', 'q', 'buscar'].forEach(k => u.searchParams.delete(k));
    ['cat', 'linea', 'color', 'talle'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    if (estado.q.trim()) u.searchParams.set('q', estado.q.trim());
    history.replaceState(null, '', u);
  };
  let cursor = null, mostrados = 0;
  const pintarCard = p => (MODELO === '2' ? vcardHTML(p) : cardHTML(p));
  function render(reiniciar) {
    const f = filtros();
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const r = Tienda.consultar({ filtros: f, orden: estado.orden, cursor, limite: POR_PAGINA });
    cursor = r.cursor;
    mostrados += r.items.length;
    if (reiniciar && !r.items.length) {
      grid.innerHTML = `<div class="vacio"><h2>No hay prendas con esos filtros</h2><p>Probá con otra palabra o sacá algún filtro: la tienda tiene ${prendas(Tienda.contar({}))}. Si buscás un talle o un color que no está, lo traemos en el pedido de la semana.</p><button type="button" class="btn btn--cta" data-limpiar>Ver todas las prendas</button></div>`;
    } else {
      grid.insertAdjacentHTML('beforeend', r.items.map(pintarCard).join(''));
    }
    const total = f.q ? null : Tienda.contar(f);
    if (contador) contador.textContent = total != null ? `${prendas(total)}${total !== Tienda.contar({}) ? ' con estos filtros' : ''}` : `${prendas(mostrados)}${cursor ? ' o más' : ''} para «${f.q}»`;
    if (verMas) verMas.hidden = !cursor;
    if (miga) {
      const una = estado.cat.length === 1 ? catDe(estado.cat[0]).nombre : '';
      miga.hidden = !una; miga.textContent = una;
    }
    document.querySelectorAll('[data-menu-categorias] a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && id === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const sincronizarControles = () => {
    form.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
    form.querySelectorAll('input[name="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    if (buscador) buscador.value = estado.q;
  };
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.matches('input[data-f]')) estado[t.dataset.f] = [...form.querySelectorAll(`input[data-f="${t.dataset.f}"]:checked`)].map(i => i.value);
    if (t.name === 'precio') estado.precio = t.value;
    syncUrl(); render(true);
  });
  form.addEventListener('submit', e => e.preventDefault());
  const limpiar = () => {
    estado.cat = []; estado.linea = []; estado.color = []; estado.talle = []; estado.precio = ''; estado.q = '';
    sincronizarControles(); syncUrl(); render(true);
  };
  document.addEventListener('click', e => { if (e.target.closest('[data-limpiar]')) limpiar(); });
  if (ordenSel) ordenSel.addEventListener('change', () => { estado.orden = ordenSel.value; syncUrl(); render(true); });
  let t = 0;
  if (buscador) {
    buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); }, 250); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.slice(0, 60); syncUrl(); render(true); });
  }
  if (verMas) verMas.querySelector('button')?.addEventListener('click', () => render(false));
  render(true);
  if (params.has('buscar') && buscador) setTimeout(() => buscador.focus(), 300);

  const panel = document.querySelector('.filtros');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const mq = window.matchMedia('(min-width: 901px)');
  let bd = null;
  const cerrarPanel = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    document.body.classList.remove('no-scroll');
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  if (abrirBtn && panel) {
    bd = document.createElement('div'); bd.className = 'nav-backdrop'; document.body.appendChild(bd);
    abrirBtn.addEventListener('click', () => {
      panel.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll');
      abrirBtn.setAttribute('aria-expanded', 'true');
      panel.querySelector('button, input')?.focus();
    });
    bd.addEventListener('click', cerrarPanel);
    panel.addEventListener('click', e => { if (e.target.closest('[data-cerrar-filtros]')) cerrarPanel(); });
    panel.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPanel(); else if (panel.classList.contains('open')) atrapar(panel, e); });
  }
  const detalles = [...document.querySelectorAll('.filtro')];
  const ajustarDetalles = () => {
    const comoBarra = MODELO === '2' && mq.matches;
    detalles.forEach(d => { d.open = !comoBarra; });
    if (mq.matches) cerrarPanel();
  };
  ajustarDetalles();
  mq.addEventListener('change', ajustarDetalles);
  if (MODELO === '2') {
    detalles.forEach(d => d.addEventListener('toggle', () => { if (d.open && mq.matches) detalles.forEach(o => { if (o !== d) o.open = false; }); }));
    document.addEventListener('click', e => { if (mq.matches && !e.target.closest('.filtro')) detalles.forEach(d => { d.open = false; }); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mq.matches) detalles.forEach(d => { d.open = false; }); });
  }
}

function initBuscar() {
  if (PAGINA !== 'catalogo') return;
  document.querySelectorAll('[data-buscar]').forEach(a => a.addEventListener('click', e => {
    const input = document.getElementById('buscar');
    if (!input) return;
    e.preventDefault();
    input.scrollIntoView({ block: 'center' });
    input.focus();
  }));
}
function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) Modal.open(id);
}

initMenuCategorias();
initConteos();
initPreview();
initCatalogo();
initCoros();
initHorario();
initReveals();
initNav();
initModelBarScroll();
initHeroMotion();
initParallax();
initCardAcciones();
Drawer.init();
Modal.init();
initFloats();
updateCartBadge();
initBuscar();
abrirProductoDeUrl();
try { initMapa(); } catch (err) { }
