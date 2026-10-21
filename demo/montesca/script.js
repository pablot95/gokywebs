const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491151629677';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'collares', nombre: 'Collares', img: 'images/p-collar-selva.webp', bajada: 'Collares largos, cortos y colgantes, con piedras elegidas una por una.' },
  { id: 'aros', nombre: 'Aros', img: 'images/p-aros-lila.webp', bajada: 'Aros de gancho y de argolla con amatista, cristal de roca y más.' },
  { id: 'pulseras', nombre: 'Pulseras', img: 'images/p-pulsera-rosa.webp', bajada: 'Pulseras elásticas y con cierre, para usar solas o de a varias.' },
];
const FAMILIAS = {
  rosas: { nombre: 'Rosas', img: 'images/piedra-rosas.webp' },
  violetas: { nombre: 'Violetas', img: 'images/piedra-violetas.webp' },
  verdes: { nombre: 'Verdes', img: 'images/piedra-verdes.webp' },
  tierras: { nombre: 'Tierras', img: 'images/piedra-tierras.webp' },
  transparentes: { nombre: 'Transparentes', img: 'images/piedra-transparentes.webp' },
  grises: { nombre: 'Grises y azules', img: 'images/piedra-grises.webp' },
};
const PIEDRAS = {
  'cuarzo-rosa': { nombre: 'Cuarzo rosa', familia: 'rosas' },
  amatista: { nombre: 'Amatista', familia: 'violetas' },
  cristal: { nombre: 'Cristal facetado', familia: 'violetas' },
  prehnita: { nombre: 'Prehnita', familia: 'verdes' },
  aventurina: { nombre: 'Aventurina', familia: 'verdes' },
  'agata-musgo': { nombre: 'Ágata musgo', familia: 'verdes' },
  peridoto: { nombre: 'Peridoto', familia: 'verdes' },
  malaquita: { nombre: 'Malaquita', familia: 'verdes' },
  jaspe: { nombre: 'Jaspe', familia: 'tierras' },
  agata: { nombre: 'Ágata', familia: 'tierras' },
  'cristal-de-roca': { nombre: 'Cristal de roca', familia: 'transparentes' },
  labradorita: { nombre: 'Labradorita', familia: 'grises' },
  'cuarzo-ahumado': { nombre: 'Cuarzo ahumado', familia: 'grises' },
  apatita: { nombre: 'Apatita', familia: 'grises' },
};
const TERMINACIONES = { dorado: 'Dorada', plateado: 'Plateada' };
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 20000 },
  '20a35': { nombre: '$20.000 a $35.000', min: 20001, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Destacadas', nuevos: 'Recién ingresadas', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const LARGOS = [
  { id: 'gargantilla', nombre: 'Gargantilla', cm: '40 a 42 cm', min: 38, max: 43, txt: 'Queda en la base del cuello.' },
  { id: 'princesa', nombre: 'Princesa', cm: '45 cm', min: 44, max: 47, txt: 'Cae justo sobre la clavícula.' },
  { id: 'matine', nombre: 'Matiné', cm: '50 a 55 cm', min: 48, max: 60, txt: 'Llega a la altura del escote.' },
  { id: 'largo', nombre: 'Largo', cm: '70 cm o más', min: 61, max: 200, txt: 'Se usa suelto o con dos vueltas.' },
];
const NUEVO_DESDE = 27;

const PRODUCTOS = [
  { id: 'collar-aurora', num: 1, nombre: 'Collar Aurora', cat: 'collares', piedras: ['cuarzo-rosa'], precio: 38500, edicion: 1, stock: 1, terminacion: 'dorado', medida: 'Largo de 70 cm, se usa suelto o con dos vueltas', largo: [70, 70], rango: 4, alta: 27,
    img: 'images/p-collar-aurora.webp', alt: 'Collar largo de cuentas de cuarzo rosa facetado con separadores dorados, sobre lino claro',
    desc: 'Cuentas de cuarzo rosa facetado con separadores dorados, en un largo de 70 cm que se usa suelto o con dos vueltas. El rosa es suave y cambia con la luz.', tags: ['rosa', 'largo', 'facetado'] },
  { id: 'collar-selva', num: 2, nombre: 'Collar Selva', cat: 'collares', piedras: ['prehnita'], precio: 42000, edicion: 1, stock: 1, terminacion: 'dorado', medida: 'Largo de 45 cm con 5 cm de extensor', largo: [45, 50], rango: 1, alta: 30,
    img: 'images/p-collar-selva.webp', alt: 'Collar de piedras de prehnita verde con vetas oscuras y cuentas doradas, sobre lino claro',
    desc: 'Piedras de prehnita verde, cada una con sus vetas oscuras, intercaladas con cuentas doradas. Cierra con mosquetón y tiene extensor para ajustar el largo.', tags: ['verde', 'corto', 'piedras grandes'] },
  { id: 'aros-lila', num: 3, nombre: 'Aros Lila', cat: 'aros', piedras: ['amatista'], precio: 24000, edicion: 3, stock: 2, terminacion: 'dorado', medida: 'Caída de 4 cm, gancho dorado', rango: 2, alta: 29,
    img: 'images/p-aros-lila.webp', alt: 'Aros de gancho dorado con una amatista rodada violeta cada uno, sobre piedra clara',
    desc: 'Dos amatistas rodadas, de un violeta parejo y translúcido, colgando de ganchos dorados. Livianos para usar todo el día.', tags: ['violeta', 'colgantes', 'gancho'] },
  { id: 'pulsera-rosa', num: 4, nombre: 'Pulsera Rosa', cat: 'pulseras', piedras: ['cuarzo-rosa'], precio: 19500, edicion: 4, stock: 3, terminacion: 'dorado', medida: 'Elástica, cuentas de 10 mm', muneca: [15, 17], rango: 3, alta: 28,
    img: 'images/p-pulsera-rosa.webp', alt: 'Pulsera elástica de cuentas de cuarzo rosa con una cuenta dorada facetada, sobre piedra travertino',
    desc: 'Pulsera elástica de cuentas de cuarzo rosa de 10 mm con una cuenta dorada facetada. Se pone y se saca sin cierre.', tags: ['rosa', 'elastica', 'cuentas'] },
  { id: 'collar-tierra', num: 5, nombre: 'Collar Tierra', cat: 'collares', piedras: ['jaspe', 'agata'], precio: 44000, edicion: 1, stock: 1, terminacion: 'dorado', medida: 'Largo de 45 cm con 5 cm de extensor', largo: [45, 50], rango: 5, alta: 22,
    img: 'images/p-collar-tierra.webp', alt: 'Collar de piedras de jaspe y ágata en tonos rojizos y crema con cuentas doradas, sobre lino',
    desc: 'Jaspe y ágata en tonos tierra, de rojizo a crema, con cuentas doradas entre piedra y piedra. Cierra con mosquetón y extensor.', tags: ['marron', 'rojizo', 'corto'] },
  { id: 'aros-agua', num: 6, nombre: 'Aros Agua', cat: 'aros', piedras: ['cristal-de-roca'], precio: 26000, edicion: 3, stock: 2, terminacion: 'dorado', medida: 'Argolla de 12 mm con gota facetada', rango: 6, alta: 21,
    img: 'images/p-aros-agua.webp', alt: 'Aros de argolla dorada con gotas facetadas de cristal de roca, sobre piedra travertino',
    desc: 'Gotas facetadas de cristal de roca colgando de argollas doradas. Transparentes, van con todo.', tags: ['transparente', 'argolla', 'gota'] },
  { id: 'pulsera-musgo', num: 7, nombre: 'Pulsera Musgo', cat: 'pulseras', piedras: ['agata-musgo'], precio: 21000, edicion: 2, stock: 1, terminacion: 'dorado', medida: 'Elástica, cuentas de 8 mm', muneca: [15, 17], rango: 9, alta: 18,
    img: 'images/p-pulsera-musgo.webp', alt: 'Pulsera elástica de cuentas de ágata musgo verde con separadores dorados, sobre lino',
    desc: 'Ágata musgo en cuentas de 8 mm con separadores dorados. Cada cuenta tiene un dibujo verde distinto.', tags: ['verde', 'elastica', 'cuentas'] },
  { id: 'pulsera-bruma', num: 8, nombre: 'Pulsera Bruma', cat: 'pulseras', piedras: ['cuarzo-ahumado'], precio: 21000, edicion: 2, stock: 2, terminacion: 'dorado', medida: 'Elástica, cuentas de 8 mm', muneca: [16, 18], rango: 10, alta: 17,
    img: 'images/p-pulsera-bruma.webp', alt: 'Pulsera elástica de cuarzo ahumado con una piedra central alargada y separadores dorados',
    desc: 'Cuarzo ahumado en cuentas de 8 mm, con una piedra central alargada y separadores dorados.', tags: ['gris', 'elastica', 'cuentas'] },
  { id: 'colgante-luna', num: 9, nombre: 'Colgante Luna', cat: 'collares', piedras: ['labradorita'], precio: 34000, edicion: 3, stock: 2, terminacion: 'dorado', medida: 'Cadena de 45 cm, gota de 2 cm', largo: [45, 45], rango: 7, alta: 24,
    img: 'images/p-colgante-luna.webp', alt: 'Colgante de gota facetada de labradorita gris azulada en una cadena dorada fina, sobre fondo claro',
    desc: 'Una gota facetada de labradorita en una cadena dorada fina. Según cómo le dé la luz, muestra reflejos grises y azules.', tags: ['gris', 'azul', 'cadena', 'dije'] },
  { id: 'aros-cascada', num: 10, nombre: 'Aros Cascada', cat: 'aros', piedras: ['amatista'], precio: 18500, edicion: 2, stock: 1, terminacion: 'plateado', medida: 'Caída de 6 cm, cierre de palanca', rango: 12, alta: 14,
    img: 'images/p-aros-cascada.webp', alt: 'Aros largos de chips de amatista violeta en tira, con cierre de palanca plateado, sobre un espejo',
    desc: 'Chips de amatista en dos tiras que caen en cascada, con cierre de palanca plateado.', tags: ['violeta', 'largos', 'chips'] },
  { id: 'colgante-brote', num: 11, nombre: 'Colgante Brote', cat: 'collares', piedras: ['aventurina'], precio: 29000, edicion: 1, stock: 1, terminacion: 'plateado', medida: 'Cadena de 50 cm, piedra de 4 cm', largo: [50, 50], rango: 8, alta: 15,
    img: 'images/p-colgante-brote.webp', alt: 'Colgante de aventurina verde alargada envuelta en alambre plateado, sobre una bandeja clara',
    desc: 'Una aventurina verde alargada, envuelta a mano en alambre plateado, en una cadena fina.', tags: ['verde', 'dije', 'alambre'] },
  { id: 'collar-nube', num: 12, nombre: 'Collar Nube', cat: 'collares', piedras: ['cuarzo-rosa'], precio: 48000, descuento: 10, edicion: 1, stock: 1, terminacion: 'plateado', medida: 'Tres vueltas de 45, 50 y 55 cm', largo: [45, 55], rango: 11, alta: 12,
    img: 'images/p-collar-nube.webp', alt: 'Collar de tres vueltas de cuentas de cuarzo rosa y cristal, junto a hojas de eucalipto',
    desc: 'Tres vueltas de cuentas de cuarzo rosa y cristal, de más chicas a más grandes. Se usa como un solo collar.', tags: ['rosa', 'tres vueltas', 'cuentas'] },
  { id: 'collar-niebla', num: 13, nombre: 'Collar Niebla', cat: 'collares', piedras: ['labradorita'], precio: 36000, edicion: 1, stock: 1, terminacion: 'plateado', medida: 'Largo de 42 cm, hilo transparente', largo: [42, 42], rango: 13, alta: 16,
    img: 'images/p-collar-niebla.webp', alt: 'Collar de cuentas de labradorita en degradé sobre hilo transparente, puesto en el cuello',
    desc: 'Cuentas de labradorita en degradé, de mayor a menor, en hilo transparente: parece que flotan sobre la piel.', tags: ['gris', 'corto', 'degrade'] },
  { id: 'aros-corazon', num: 14, nombre: 'Aros Corazón', cat: 'aros', piedras: ['cristal'], precio: 16000, edicion: 6, stock: 4, terminacion: 'dorado', medida: 'Argolla de 14 mm con dije de corazón', rango: 14, alta: 20,
    img: 'images/p-aros-corazon.webp', alt: 'Aros de argolla dorada con dije de corazón de cristal facetado lila, sobre piedra travertino',
    desc: 'Argollas doradas con un dije de corazón de cristal facetado lila. Una pieza de fantasía para el día a día.', tags: ['lila', 'argolla', 'corazon', 'fantasia'] },
  { id: 'duo-brisa', num: 15, nombre: 'Dúo Brisa', cat: 'pulseras', piedras: ['peridoto'], precio: 22000, edicion: 2, stock: 2, terminacion: 'dorado', medida: 'Dos pulseras finas elásticas, se venden juntas', muneca: [14.5, 16.5], rango: 15, alta: 19,
    img: 'images/p-duo-brisa.webp', alt: 'Dos pulseras finas elásticas, una de peridoto verde y otra de cuentas champagne, con dije dorado',
    desc: 'Dos pulseras finas elásticas, una de peridoto verde y otra de cuentas de cristal champagne, con un dije dorado cada una. Se venden juntas.', tags: ['verde', 'finas', 'set', 'dos pulseras'] },
  { id: 'pulsera-laguna', num: 16, nombre: 'Pulsera Laguna', cat: 'pulseras', piedras: ['apatita'], precio: 18000, edicion: 1, stock: 1, terminacion: 'plateado', medida: 'Largo de 17 cm con 3 cm de extensor', muneca: [16, 19.5], rango: 16, alta: 13,
    img: 'images/p-pulsera-laguna.webp', alt: 'Pulsera de cuentas rectangulares de apatita azul verdosa con cadena y cierre plateados',
    desc: 'Cuentas rectangulares de apatita azul verdosa, con cadena y cierre plateados para ajustar el largo.', tags: ['celeste', 'azul', 'cierre'] },
  { id: 'pulsera-bosque', num: 17, nombre: 'Pulsera Bosque', cat: 'pulseras', piedras: ['malaquita'], precio: 23000, edicion: 1, stock: 0, terminacion: 'plateado', medida: 'Elástica, cuentas de 10 mm', muneca: [15.5, 17.5], rango: 17, alta: 11,
    img: 'images/p-pulsera-bosque.webp', alt: 'Pulsera elástica de cuentas de malaquita verde con bandas oscuras y separadores plateados, sobre arena',
    desc: 'Malaquita en cuentas de 10 mm, con sus bandas verdes, y separadores plateados.', tags: ['verde', 'elastica', 'cuentas'] },
  { id: 'borrador-aros-gota', num: 18, nombre: 'Aros Gota (borrador)', cat: 'aros', piedras: ['amatista'], precio: 20000, edicion: 1, stock: 1, terminacion: 'dorado', medida: '-', rango: 0, alta: 1, visible: false,
    img: 'images/p-aros-lila.webp', alt: '', desc: '', tags: [] },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
  p.familias = [...new Set(p.piedras.map(x => PIEDRAS[x]?.familia).filter(Boolean))];
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const precioFinal = p => (p.descuento > 0 ? redondear(p.precio * (1 - p.descuento / 100)) : p.precio);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const solapa = (r, min, max) => Array.isArray(r) && r[0] <= max && r[1] >= min;

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), familias = lista(f.familias), piedras = lista(f.piedras), terminaciones = lista(f.terminaciones);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (familias.length && !familias.some(x => p.familias.includes(x))) return false;
    if (piedras.length && !piedras.some(x => p.piedras.includes(x))) return false;
    if (terminaciones.length && !terminaciones.includes(p.terminacion)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.unicas && p.edicion !== 1) return false;
    if (f.largo && !solapa(p.largo, f.largo.min, f.largo.max)) return false;
    if (f.muneca != null && !solapa(p.muneca, f.muneca, f.muneca)) return false;
    if (f.precioMin != null && precioFinal(p) < f.precioMin) return false;
    if (f.precioMax != null && precioFinal(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    const vendidasAlFinal = (a, b) => (b.stock > 0) - (a.stock > 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => vendidasAlFinal(a, b) || b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioFinal(a) - precioFinal(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioFinal(b) - precioFinal(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => vendidasAlFinal(a, b) || (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden, filtros.ids));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
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

const piedrasTexto = p => p.piedras.map(x => PIEDRAS[x]?.nombre).filter(Boolean).join(' y ');
const dispTexto = p => (!(p.stock > 0) ? 'Vendida' : p.edicion === 1 ? 'Pieza única' : `Quedan ${p.stock} de ${p.edicion}`);
const folio = p => `N.º ${String(p.num).padStart(2, '0')}`;

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, ...p.piedras.map(x => PIEDRAS[x]?.nombre), ...p.familias.map(f => FAMILIAS[f]?.nombre),
      TERMINACIONES[p.terminacion], p.medida, p.desc, ...(p.tags || []), dispTexto(p), p.descuento > 0 ? 'oferta descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'montesca_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id) { return this.get().filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1) {
    const libre = (producto.stock ?? 0) - this.enCarrito(producto.id);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id);
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 1));
    this.save(items);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  lupa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>',
  gema: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function precioHTML(p, clase = 'precio') {
  return `<p class="${clase}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
const msgParecida = p => `Hola Montesca! Vi que «${p.nombre}» ya se vendió. ¿Me podés armar una parecida?`;
const stepperHTML = (max, clase = '') => `<div class="stepper${clase ? ' ' + clase : ''}" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;

function accionesHTML(p) {
  if (!(p.stock > 0)) return `<a class="prod-add prod-add--aviso" href="${wspLink(msgParecida(p))}" target="_blank" rel="noopener">${ICO.wsp}<span>Pedí una parecida</span></a>`;
  return `${p.stock > 1 ? stepperHTML(p.stock) : ''}<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO.carrito}<span>Agregar</span></button>`;
}

function badgeHTML(p) {
  if (!(p.stock > 0)) return '<span class="etiqueta etiqueta--vendida">Vendida</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (p.alta >= NUEVO_DESDE) return '<span class="etiqueta">Nuevo ingreso</span>';
  return '';
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sin = !(p.stock > 0);
  return `<article class="pcard${clase ? ' ' + clase : ''}${sin ? ' pcard--vendida' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badgeHTML(p)}
    ${sin ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <p class="pcard__folio">${folio(p)}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__meta"><span>${esc(piedrasTexto(p))}</span><span class="pcard__disp">${esc(dispTexto(p))}</span></p>
    ${precioHTML(p)}
    <div class="prod-actions">${accionesHTML(p)}</div>
  </div>
</article>`;
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
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${n} ${n === 1 ? 'pieza' : 'piezas'}</small></span></a></li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  const piezas = n => `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = piezas(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
  document.querySelectorAll('[data-cuenta-unicas]').forEach(el => { el.textContent = Tienda.contar({ unicas: true, stock: true }); });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const mosaico = cont.hasAttribute('data-mosaico');
    const ids = (cont.dataset.ids || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const filtros = ids.length ? { ids, stock: true } : { destacado: true, stock: true };
    const { items } = Tienda.consultar({ filtros, orden: ids.length ? 'ids' : 'destacados', limite });
    items.forEach(cachear);
    const total = Tienda.contar({});
    const todo = mosaico ? `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(36px)"><span class="mosaico__todo-tit">Ver las ${total} piezas</span><span class="mosaico__todo-n">Collares, aros y pulseras, con filtros por piedra, color y precio.</span>${ICO.flecha}</a>` : '';
    cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: mosaico && i === 0 ? 'pcard--grande' : '' })).join('') + todo;
  });
}

function initIndice() {
  const cont = document.querySelector('[data-indice]');
  if (!cont) return;
  const vista = document.querySelector('[data-indice-vista]');
  const filas = Object.entries(FAMILIAS).map(([id, f]) => {
    const { items } = Tienda.consultar({ filtros: { familias: [id] }, orden: 'destacados', limite: Tienda.TOPE });
    if (!items.length) return '';
    items.forEach(cachear);
    const piedras = [...new Set(items.flatMap(p => p.piedras).filter(x => PIEDRAS[x]?.familia === id))].map(x => PIEDRAS[x].nombre);
    const n = items.length;
    const portada = items.find(p => p.stock > 0) || items[0];
    return `<li data-animate="subir" style="opacity:0;transform:translateY(28px)"><a class="indice__fila" href="${URL_CATALOGO}?color=${id}" data-indice-img="${esc(portada.img)}" data-indice-alt="${esc(portada.alt)}">
      <span class="indice__swatch"><img src="${esc(f.img)}" alt="" width="120" height="120"></span>
      <span class="indice__txt"><span class="indice__nombre">${esc(f.nombre)}</span><span class="indice__piedras">${esc(piedras.join(', '))}</span></span>
      <span class="indice__n">${n} ${n === 1 ? 'pieza' : 'piezas'}</span>${ICO.flecha}</a></li>`;
  }).join('');
  cont.innerHTML = filas;
  if (!vista) return;
  const img = vista.querySelector('img');
  const mostrar = a => {
    if (!img || img.getAttribute('src') === a.dataset.indiceImg) return;
    vista.classList.add('cambiando');
    setTimeout(() => {
      img.src = a.dataset.indiceImg;
      img.alt = a.dataset.indiceAlt || '';
      vista.classList.remove('cambiando');
    }, reduceMotion ? 0 : 180);
    cont.querySelectorAll('.indice__fila').forEach(f => f.classList.toggle('activa', f === a));
  };
  cont.addEventListener('mouseover', e => { const a = e.target.closest('.indice__fila'); if (a) mostrar(a); });
  cont.addEventListener('focusin', e => { const a = e.target.closest('.indice__fila'); if (a) mostrar(a); });
  const primera = cont.querySelector('.indice__fila');
  if (primera && img) { img.src = primera.dataset.indiceImg; img.alt = primera.dataset.indiceAlt || ''; primera.classList.add('activa'); }
}

function miniHTML(p) {
  return `<li><button type="button" class="mini" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="" width="96" height="96"><span><b>${esc(p.nombre)}</b><small>${esc(piedrasTexto(p))} · ${esc(p.medida)}</small></span><span class="mini__precio">${formatearPrecio(precioFinal(p))}</span></button></li>`;
}

function initMedidas() {
  const box = document.querySelector('[data-medidas]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-med-tab]')];
  const elegirTab = (t, foco = false) => {
    tabs.forEach(b => {
      const activo = b === t;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      if (panel) panel.hidden = !activo;
    });
    if (foco) t.focus();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegirTab(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      elegirTab(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });

  const largosBox = box.querySelector('[data-largos]');
  const largosRes = box.querySelector('[data-largos-res]');
  if (largosBox && largosRes) {
    const collaresDe = l => {
      const { items } = Tienda.consultar({ filtros: { cat: 'collares', largo: l, stock: true }, orden: 'destacados', limite: 3 });
      items.forEach(cachear);
      return { items, total: Tienda.contar({ cat: 'collares', largo: l, stock: true }) };
    };
    largosBox.innerHTML = LARGOS.map(l => `<button type="button" class="largo" data-largo="${l.id}" aria-pressed="false"><span class="largo__cm">${esc(l.cm)}</span><span class="largo__nombre">${esc(l.nombre)}</span><span class="largo__txt">${esc(l.txt)}</span></button>`).join('');
    const pintarLargo = id => {
      const l = LARGOS.find(x => x.id === id) || LARGOS[1];
      largosBox.querySelectorAll('[data-largo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.largo === l.id)));
      const { items, total } = collaresDe(l);
      largosRes.innerHTML = items.length
        ? `<p class="medidas__res-tit">${total} ${total === 1 ? 'collar disponible' : 'collares disponibles'} con largo ${esc(l.nombre.toLowerCase())}</p><ul class="minis">${items.map(miniHTML).join('')}</ul>`
        : `<p class="medidas__res-tit">Hoy no hay collares con ese largo.</p><a class="link-wsp" href="${wspLink(`Hola Montesca! Busco un collar de ${l.cm}. ¿Me armás uno?`)}" target="_blank" rel="noopener">${ICO.wsp}Pedilo por WhatsApp</a>`;
    };
    largosBox.addEventListener('click', e => { const b = e.target.closest('[data-largo]'); if (b) pintarLargo(b.dataset.largo); });
    pintarLargo('princesa');
  }

  const rango = box.querySelector('[data-muneca]');
  const salida = box.querySelector('[data-muneca-out]');
  const munecaRes = box.querySelector('[data-muneca-res]');
  if (rango && munecaRes) {
    const cm = n => n.toLocaleString('es-AR', { maximumFractionDigits: 1 });
    const pintarMuneca = () => {
      const w = Math.min(21, Math.max(13, parseFloat(rango.value) || 16));
      if (salida) salida.textContent = `${cm(w)} cm`;
      rango.setAttribute('aria-valuetext', `${cm(w)} centímetros`);
      const { items } = Tienda.consultar({ filtros: { cat: 'pulseras', muneca: w, stock: true }, orden: 'destacados', limite: 3 });
      items.forEach(cachear);
      const sugerida = `${cm(w + 1)} a ${cm(w + 1.5)} cm`;
      munecaRes.innerHTML = `<p class="medidas__res-tit">Buscá una pulsera de <b>${sugerida}</b> de largo.</p>${items.length
        ? `<p class="medidas__res-sub">Te quedan cómodas:</p><ul class="minis">${items.map(miniHTML).join('')}</ul>`
        : `<p class="medidas__res-sub">Hoy no hay pulseras para esa medida, pero te la armamos.</p><a class="link-wsp" href="${wspLink(`Hola Montesca! Mi muñeca mide ${cm(w)} cm. ¿Me armás una pulsera a medida?`)}" target="_blank" rel="noopener">${ICO.wsp}Pedila a tu medida</a>`}`;
    };
    rango.addEventListener('input', pintarMuneca);
    pintarMuneca();
  }
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, { qty = 1, comprar = false } = {}) {
  const n = Cart.add(p, qty);
  if (!n) {
    if (comprar && Cart.enCarrito(p.id)) { abrirCarrito(); return; }
    showToast(p.stock > 0 ? (p.stock === 1 ? `«${p.nombre}» es pieza única y ya está en tu carrito.` : `Ya tenés en el carrito las ${p.stock} que quedan de «${p.nombre}».`) : 'Esta pieza ya se vendió. Pedí una parecida por WhatsApp.');
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}«${p.nombre}» al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} disponibles.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, { qty: leerCantidad(add.closest('.pcard')), comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc,
    brand: { '@type': 'Brand', name: 'Montesca' }, material: piedrasTexto(p),
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut' },
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sin = !(p.stock > 0);
  const libre = p.stock - Cart.enCarrito(p.id);
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media" data-lupa><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgeHTML(p)}<span class="qv__lupa">${ICO.lupa}Pasá el mouse para ver la piedra de cerca</span></div>
    <div class="qv__info">
      <p class="muestra muestra--qv"><span class="muestra__folio">${folio(p)}</span><span>${esc(catDe(p.cat)?.nombre)}</span><span>${esc(dispTexto(p))}</span></p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'precio qv__precio')}
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__ficha">
        <div><dt>Piedra</dt><dd>${esc(piedrasTexto(p))}</dd></div>
        <div><dt>Medida</dt><dd>${esc(p.medida)}</dd></div>
        <div><dt>Terminación</dt><dd>${esc(TERMINACIONES[p.terminacion])}</dd></div>
        <div><dt>Disponibles</dt><dd>${sin ? 'Ya se vendió' : p.edicion === 1 ? 'Pieza única: hay una sola' : `${p.stock} de una edición de ${p.edicion}`}</dd></div>
      </dl>
      <div class="qv__acc">
        ${sin
          ? `<a class="btn btn--cta" href="${wspLink(msgParecida(p))}" target="_blank" rel="noopener">${ICO.wsp}Pedí una parecida</a>`
          : `${p.stock > 1 && libre > 0 ? stepperHTML(libre, 'stepper--grande') : ''}
             <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está en tu carrito'}</button>
             <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Montesca! Tengo una consulta sobre «${p.nombre}» (${folio(p)}).`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Dudas con la medida o la piedra? Consultá por WhatsApp</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioFinal(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qty);
      if (!Cart.enCarrito(p.id)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, { qty });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const lupaMq = window.matchMedia('(hover: hover) and (pointer: fine)');
  qv.addEventListener('pointermove', e => {
    const media = e.target.closest('[data-lupa]');
    if (!media || !lupaMq.matches || reduceMotion) return;
    const r = media.getBoundingClientRect();
    media.style.setProperty('--ox', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    media.style.setProperty('--oy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
    media.classList.add('lupa');
  });
  qv.addEventListener('pointerout', e => {
    const media = e.target.closest('[data-lupa]');
    if (media && !media.contains(e.relatedTarget)) media.classList.remove('lupa');
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.gema}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Todavía no elegiste ninguna pieza. Las únicas no esperan mucho.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver a la colección</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(piedrasTexto(p))} · ${formatearPrecio(precioFinal(p))}${p.stock > 1 ? ' c/u' : ''}</p>
        <div class="linea__acc">${p.stock > 1 ? `<div class="stepper" data-linea-stepper><button type="button" data-linea-paso="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= p.stock ? ' disabled' : ''}>${ICO.mas}</button></div>` : '<span class="linea__unica">Pieza única</span>'}
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${folio(p)}): ${formatearPrecio(precioFinal(p) * i.qty)}`; }).join('\n');
  const msg = `Hola Montesca! Quiero estas piezas:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nMi localidad para el envío: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El envío a cualquier punto del país se coordina por WhatsApp después de la compra.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    familias: new Set(lista('color').filter(c => FAMILIAS[c])),
    piedras: new Set(lista('piedra').filter(c => PIEDRAS[c])),
    terminaciones: new Set(lista('terminacion').filter(c => TERMINACIONES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    stock: PARAMS.get('disponibles') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const SETS = { familia: estado.familias, piedra: estado.piedras, terminacion: estado.terminaciones };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoChip = cont.dataset.catOpciones === 'chips';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoChip
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Toda la colección')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-familia-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(FAMILIAS).map(([k, f]) => `<label class="opt" data-opt-familia="${k}"><input type="checkbox" value="${k}" data-f="familia"><span class="opt__dot"><img src="${esc(f.img)}" alt="" width="40" height="40"></span><span>${esc(f.nombre)}</span><span class="opt__n" data-cuenta-filtro-familia="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-familia-chips]').forEach(cont => {
    cont.innerHTML = Object.entries(FAMILIAS).map(([k, f]) => `<button type="button" class="chip-piedra" data-chip-familia="${k}" aria-pressed="false"><span class="chip-piedra__dot"><img src="${esc(f.img)}" alt="" width="40" height="40"></span>${esc(f.nombre)}</button>`).join('');
  });
  document.querySelectorAll('[data-piedra-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(PIEDRAS).map(([k, pd]) => `<label class="opt" data-opt-piedra="${k}"><input type="checkbox" value="${k}" data-f="piedra"><span>${esc(pd.nombre)}</span><span class="opt__n" data-cuenta-filtro-piedra="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-terminacion-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TERMINACIONES).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="terminacion"><span class="opt__metal opt__metal--${k}"></span><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-terminacion="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.familias.size && sin !== 'familia') f.familias = [...estado.familias];
    if (estado.piedras.size && sin !== 'piedra') f.piedras = [...estado.piedras];
    if (estado.terminaciones.size && sin !== 'terminacion') f.terminaciones = [...estado.terminaciones];
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    estado.familias.forEach(v => chips.push(['familia', v, `Piedras ${FAMILIAS[v].nombre.toLowerCase()}`]));
    estado.piedras.forEach(v => chips.push(['piedra', v, PIEDRAS[v].nombre]));
    estado.terminaciones.forEach(v => chips.push(['terminacion', v, `Terminación ${TERMINACIONES[v].toLowerCase()}`]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.stock) chips.push(['stock', '', 'Solo disponibles']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    document.querySelectorAll('[data-chip-familia]').forEach(b => b.setAttribute('aria-pressed', String(estado.familias.has(b.dataset.chipFamilia))));
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-familia]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('familia'), familias: [el.dataset.cuentaFiltroFamilia] }); });
    document.querySelectorAll('[data-cuenta-filtro-piedra]').forEach(el => {
      const k = el.dataset.cuentaFiltroPiedra;
      const n = Tienda.contar({ ...filtrosDe('piedra'), piedras: [k] });
      el.textContent = n;
      const opt = el.closest('[data-opt-piedra]');
      if (opt) opt.hidden = n === 0 && !estado.piedras.has(k);
    });
    document.querySelectorAll('[data-cuenta-filtro-terminacion]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('terminacion'), terminaciones: [el.dataset.cuentaFiltroTerminacion] }); });
    const enPanel = estado.piedras.size + estado.terminaciones.size + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0)
      + (document.querySelector('#filtros [data-familia-opciones]') ? estado.familias.size : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const fam = !cat && estado.familias.size === 1 ? FAMILIAS[[...estado.familias][0]] : null;
    const titulo = cat ? cat.nombre : fam ? `Piedras ${fam.nombre.toLowerCase()}` : 'Toda la colección';
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : fam ? 'Collares, aros y pulseras con piedras de ese color, cada una con su ficha.' : 'Collares, aros y pulseras en piedras naturales. Filtrá por tipo de pieza, color de piedra o precio.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !(cat || fam); miga.textContent = titulo; }
    document.title = `${titulo} — Montesca`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'color', 'piedra', 'terminacion', 'precio', 'q', 'orden', 'disponibles'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.familias.size) u.searchParams.set('color', [...estado.familias].join(','));
    if (estado.piedras.size) u.searchParams.set('piedra', [...estado.piedras].join(','));
    if (estado.terminaciones.size) u.searchParams.set('terminacion', [...estado.terminaciones].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('disponibles', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'pieza' : 'piezas'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más piezas para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.precio = ''; estado.stock = false; estado.q = '';
    Object.values(SETS).forEach(s => s.clear());
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = SETS[multi.dataset.f];
      if (!set) return;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-chip-familia]');
    if (chip) {
      const k = chip.dataset.chipFamilia;
      if (estado.familias.has(k)) estado.familias.delete(k); else estado.familias.add(k);
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.hero__muestra', { y: 14, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.8);
  paso('.hero__folio', { opacity: 0, duration: 1.2, clearProps: 'opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-6 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initVistaPrevia,
  initIndice,
  initMedidas,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
