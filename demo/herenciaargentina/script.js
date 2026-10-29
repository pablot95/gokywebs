const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492615889409';
const MARCA = 'Herencia Argentina';
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
  { id: 'mates', nombre: 'Mates y materos', corto: 'Mates', bajada: 'Calabaza, cuero y virolas cinceladas.', img: 'images/p-mate-cuero.webp',
    texto: 'Mates de calabaza forrados en cuero, portatermos y todo lo que acompaña la ronda.',
    subs: [{ id: 'mates', nombre: 'Mates' }, { id: 'materos', nombre: 'Portatermos y materos' }] },
  { id: 'cuchilleria', nombre: 'Cuchillería y asado', corto: 'Cuchillería', bajada: 'Cuchillos criollos y tablas de madera.', img: 'images/p-cuchillo-criollo.webp',
    texto: 'Cuchillos criollos con vaina de cuero y tablas de algarrobo para servir el asado.',
    subs: [{ id: 'cuchillos', nombre: 'Cuchillos' }, { id: 'asado', nombre: 'Tablas y asado' }] },
  { id: 'ponchos', nombre: 'Ponchos y textiles', corto: 'Ponchos', bajada: 'Telar con guarda pampa.', img: 'images/p-poncho-bordo.webp',
    texto: 'Ponchos tejidos en telar con guarda pampa, en tres colores.',
    subs: [] },
  { id: 'accesorios', nombre: 'Cuero y accesorios', corto: 'Accesorios', bajada: 'Cintos, llaveros y alpargatas.', img: 'images/p-cinto-repujado.webp',
    texto: 'Cintos repujados, llaveros trenzados y alpargatas para vestir criollo todos los días.',
    subs: [{ id: 'cintos', nombre: 'Cintos' }, { id: 'llaveros', nombre: 'Llaveros' }, { id: 'calzado', nombre: 'Alpargatas' }] },
  { id: 'regalos', nombre: 'Regalos corporativos', corto: 'Regalos corporativos', bajada: 'Kits en caja para empresas.', img: 'images/p-kit-matero.webp',
    texto: 'Kits criollos armados en su caja, para clientes, equipos y fechas especiales. Pedí cotización por cantidad.',
    subs: [] },
];
const MATERIALES = [
  { id: 'cuero', nombre: 'Cuero' }, { id: 'madera', nombre: 'Madera' }, { id: 'metal', nombre: 'Alpaca y metal' },
  { id: 'lana', nombre: 'Telar' }, { id: 'yute', nombre: 'Lona y yute' },
];
const PARA = [
  { id: 'matero', nombre: 'Para quien ceba mates', corto: 'Matero', frase: 'Para la ronda de todos los días: mates forrados en cuero, portatermos y kits listos para regalar.' },
  { id: 'asador', nombre: 'Para quien hace el asado', corto: 'Asador', frase: 'Cuchillo criollo, tabla de algarrobo o el set completo para servir la parrilla.' },
  { id: 'campo', nombre: 'Para vestir criollo', corto: 'Criollo', frase: 'Ponchos de telar, cintos repujados, alpargatas y detalles en cuero trenzado.' },
  { id: 'empresa', nombre: 'Para regalar en la empresa', corto: 'Empresas', frase: 'Kits en caja para clientes y equipos. Elegí uno y pedí la cotización por cantidad.' },
];
const PRECIOS = [
  { id: 'hasta30', nombre: 'Hasta $30.000', min: null, max: 30000 },
  { id: '30a70', nombre: '$30.000 a $70.000', min: 30001, max: 70000 },
  { id: 'mas70', nombre: 'Más de $70.000', min: 70001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  mates: 'mate mates calabaza matero yerba bombilla virola ronda', cuchilleria: 'cuchillo cuchillos facon cuchilleria criollo hoja acero',
  ponchos: 'poncho ponchos manta telar abrigo guarda pampa textil', accesorios: 'cuero accesorio accesorios',
  regalos: 'regalo regalos kit kits empresa empresas corporativo corporativos caja set', materos: 'portatermo termo matero bolso',
  asado: 'asado parrilla tabla tablas asador', cintos: 'cinto cintos cinturon cinturones hebilla repujado', llaveros: 'llavero llaveros trenzado',
  calzado: 'alpargata alpargatas calzado lona', cuero: 'cuero vacuno tiento', madera: 'madera algarrobo', metal: 'alpaca acero bronce metal virola',
  lana: 'telar tejido lana', yute: 'yute lona',
};

const Tienda = crearTienda([
  { id: 'mate-calabaza-cuero', nombre: 'Mate de calabaza forrado en cuero', cat: 'mates', sub: 'mates', material: ['cuero', 'metal'], para: ['matero'],
    precio: 48500, descuento: 0, stock: 14, alta: 30, rango: 1, img: 'images/p-mate-cuero.webp', galeria: ['images/mate-vertical.webp'],
    alt: 'Mate de calabaza forrado en cuero marrón con costura trenzada y virola cincelada, con bombilla',
    desc: 'Calabaza curada, forrada en cuero con costura trenzada a la vista y virola de alpaca cincelada con flores.',
    datos: [['Materiales', 'Calabaza, cuero vacuno y alpaca'], ['Cuidado', 'Curalo antes del primer uso y dejalo secar boca abajo.']] },
  { id: 'cuchillo-criollo-vaina', nombre: 'Cuchillo criollo con vaina de cuero', cat: 'cuchilleria', sub: 'cuchillos', material: ['metal', 'madera', 'cuero'], para: ['asador', 'campo'],
    precio: 56900, descuento: 0, stock: 9, alta: 29, rango: 2, var: { tipo: 'Hoja', ops: ['12 cm', '14 cm', '16 cm'] }, img: 'images/p-cuchillo-criollo.webp',
    alt: 'Cuchillo criollo de hoja de acero y cabo de madera junto a su vaina de cuero marrón, sobre una mesa de madera',
    desc: 'Hoja de acero inoxidable, cabo de madera con virola de alpaca y vaina de cuero cosida a mano con botón.',
    datos: [['Materiales', 'Acero inoxidable, madera, alpaca y cuero'], ['Cuidado', 'Lavalo a mano y secalo enseguida.']] },
  { id: 'poncho-telar-guarda', nombre: 'Poncho de telar con guarda pampa', cat: 'ponchos', sub: '', material: ['lana'], para: ['campo'],
    precio: 128000, descuento: 0, stock: 6, alta: 28, rango: 3,
    var: { tipo: 'Color', ops: ['Bordó', 'Azul', 'Verde'], fotos: { 'Bordó': 'images/p-poncho-bordo.webp', Azul: 'images/p-poncho-azul.webp', Verde: 'images/p-poncho-verde.webp' } },
    img: 'images/p-poncho-bordo.webp', alt: 'Poncho de telar bordó con guarda pampa negra y flecos, doblado',
    desc: 'Tejido en telar, con guarda pampa en negro y flecos anudados a mano. Abriga y viste: va sobre los hombros, en la silla o en el sillón.',
    datos: [['Material', 'Tejido de telar'], ['Cuidado', 'Lavado a mano en agua fría, secado a la sombra.']] },
  { id: 'kit-matero-caja', nombre: 'Kit matero en caja', cat: 'regalos', sub: '', material: ['cuero', 'metal', 'madera'], para: ['matero', 'empresa'],
    precio: 96000, descuento: 0, stock: 25, alta: 27, rango: 4, tag: 'Kit en caja', img: 'images/p-kit-matero.webp', galeria: ['images/hero-caja.webp'],
    alt: 'Caja kraft abierta con un mate forrado en cuero, una bombilla y una yerbera de madera sobre un paño tejido',
    desc: 'Todo para el primer mate, listo para regalar: viene armado en su caja con viruta de papel.',
    incluye: ['Mate forrado en cuero con virola', 'Bombilla de alpaca', 'Yerbera de madera con tapa', 'Paño tejido y caja kraft'] },
  { id: 'cinto-cuero-repujado', nombre: 'Cinto de cuero repujado', cat: 'accesorios', sub: 'cintos', material: ['cuero', 'metal'], para: ['campo'],
    precio: 46500, descuento: 0, stock: 12, alta: 26, rango: 5, var: { tipo: 'Talle', ops: ['90', '95', '100', '105', '110'] }, img: 'images/p-cinto-repujado.webp',
    alt: 'Cinto de cuero marrón con guarda pampa repujada y hebilla de metal, enrollado sobre lino',
    desc: 'Cuero vacuno con guarda pampa repujada, costura perimetral y hebilla de metal envejecido. Ancho de 4 cm.',
    datos: [['Materiales', 'Cuero vacuno y hebilla de metal'], ['Talles', 'Medida en centímetros, de la hebilla al agujero del medio.']] },
  { id: 'portatermo-cuero', nombre: 'Portatermo de cuero con correa', cat: 'mates', sub: 'materos', material: ['cuero', 'metal'], para: ['matero'],
    precio: 54500, descuento: 0, stock: 8, alta: 25, rango: 6, img: 'images/p-portatermo.webp',
    alt: 'Portatermo de cuero suela con guarda trenzada al frente y correa con hebillas, con un termo adentro',
    desc: 'Cuero vacuno con guarda trenzada al frente, correa regulable y hebillas de bronce. Para termos de 1 litro.',
    datos: [['Materiales', 'Cuero vacuno y bronce'], ['Medida', 'Para termos de 1 litro']] },
  { id: 'set-asador', nombre: 'Set asador: cuchillo y tabla', cat: 'regalos', sub: '', material: ['metal', 'madera', 'cuero'], para: ['asador', 'empresa'],
    precio: 89500, descuento: 0, stock: 18, alta: 24, rango: 7, tag: 'Kit en caja', img: 'images/p-set-asador.webp', galeria: ['images/p-cuchillo-criollo.webp', 'images/p-tabla-asado.webp'],
    alt: 'Cuchillo criollo con vaina de cuero al lado de una tabla redonda de madera de algarrobo',
    desc: 'El regalo para quien se encarga de la parrilla: cuchillo criollo y tabla de algarrobo, en caja.',
    incluye: ['Cuchillo criollo con vaina de cuero (hoja de 14 cm)', 'Tabla redonda de algarrobo', 'Caja de regalo'] },
  { id: 'alpargatas-lona-yute', nombre: 'Alpargatas de lona con base de yute', cat: 'accesorios', sub: 'calzado', material: ['yute'], para: ['campo'],
    precio: 21900, descuento: 0, stock: 20, alta: 23, rango: 8, var: { tipo: 'Talle', ops: ['36', '37', '38', '39', '40', '41', '42', '43', '44'] }, img: 'images/p-alpargatas.webp',
    alt: 'Par de alpargatas de lona color crudo con base de yute cosida',
    desc: 'Lona natural con base de yute cosida a mano. Livianas y frescas para el día a día.',
    datos: [['Materiales', 'Lona de algodón y yute'], ['Talles', 'Del 36 al 44']] },
  { id: 'tabla-asado-algarrobo', nombre: 'Tabla de asado redonda de algarrobo', cat: 'cuchilleria', sub: 'asado', material: ['madera', 'cuero'], para: ['asador'],
    precio: 33900, descuento: 0, stock: 15, alta: 22, rango: 9, img: 'images/p-tabla-asado.webp',
    alt: 'Tabla redonda de madera de algarrobo con mango y tiento de cuero, sobre un paño de lino',
    desc: 'Madera de algarrobo con canaleta para los jugos, mango con agujero y tiento de cuero para colgarla. 30 cm de diámetro.',
    datos: [['Material', 'Algarrobo macizo'], ['Cuidado', 'Lavala a mano y aceitala de vez en cuando.']] },
  { id: 'kit-matero-viaje', nombre: 'Kit matero de viaje', cat: 'regalos', sub: '', material: ['cuero', 'metal'], para: ['matero', 'empresa'],
    precio: 99000, descuento: 0, stock: 12, alta: 21, rango: 10, tag: 'Kit en caja', img: 'images/p-kit-viaje.webp', galeria: ['images/p-portatermo.webp', 'images/p-mate-cuero.webp'],
    alt: 'Portatermo de cuero con correa al lado de un mate forrado en cuero con virola cincelada',
    desc: 'Para tomar mate en la ruta, en la oficina o en el campo: portatermo con correa y mate forrado, en caja.',
    incluye: ['Portatermo de cuero con correa', 'Mate forrado en cuero con virola', 'Caja de regalo'] },
  { id: 'llavero-cuero-trenzado', nombre: 'Llavero de cuero trenzado y madera', cat: 'accesorios', sub: 'llaveros', material: ['cuero', 'madera', 'metal'], para: ['campo', 'empresa'],
    precio: 9800, descuento: 10, stock: 40, alta: 20, rango: 11, img: 'images/p-llavero-trenzado.webp',
    alt: 'Llavero de tiento de cuero trenzado con medallón de madera y argolla de bronce',
    desc: 'Tiento trenzado a mano, medallón de madera y argolla de bronce. Un detalle para sumar a cualquier regalo.',
    datos: [['Materiales', 'Cuero, madera y bronce']] },
  { id: 'kit-cuero-cinto-llavero', nombre: 'Kit de cuero: cinto y llavero', cat: 'regalos', sub: '', material: ['cuero', 'metal', 'madera'], para: ['campo', 'empresa'],
    precio: 54900, descuento: 0, stock: 15, alta: 19, rango: 12, tag: 'Kit en caja', img: 'images/p-kit-cuero.webp', galeria: ['images/p-cinto-repujado.webp', 'images/p-llavero-trenzado.webp'],
    alt: 'Cinto de cuero repujado con hebilla al lado de un llavero de cuero trenzado con medallón de madera',
    desc: 'Cinto repujado y llavero trenzado en caja: un regalo criollo que se usa todos los días.',
    incluye: ['Cinto de cuero repujado (talle a elegir por WhatsApp)', 'Llavero de cuero trenzado', 'Caja de regalo'] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, p.tag || '', ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ...(p.incluye || []),
    ...(p.material || []).map(m => `${m} ${ETIQUETAS[m] || ''}`), ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), material = lista(f.material), para = lista(f.para), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (material.length && !(p.material || []).some(m => material.includes(m))) return false;
    if (para.length && !(p.para || []).some(m => para.includes(m))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function facetas(filtros = {}) {
    const material = {}, subs = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.material || []).forEach(x => { material[x] = (material[x] || 0) + 1; });
      if (p.sub) subs[p.sub] = (subs[p.sub] || 0) + 1;
    });
    return { material, subs };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, facetas, obtener };
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
const tipoVar = p => p.var?.tipo || 'Opción';
const varTxt = (p, op) => tipoVar(p) === 'Color' ? `color ${op.toLowerCase()}` : tipoVar(p) === 'Talle' ? `talle ${op}` : `${tipoVar(p).toLowerCase()} de ${op}`;
const fotoDe = (p, op) => p.var?.fotos?.[op] || p.img;
const artVar = p => (tipoVar(p) === 'Hoja' ? 'la' : 'el');

const Cart = {
  KEY: 'herenciaargentina_cart',
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
  KEY: 'herenciaargentina_favs',
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

const PROVINCIAS_CPA = {
  A: 'Salta', B: 'Buenos Aires', C: 'Ciudad de Buenos Aires', D: 'San Luis', E: 'Entre Ríos', F: 'La Rioja', G: 'Santiago del Estero', H: 'Chaco',
  J: 'San Juan', K: 'Catamarca', L: 'La Pampa', M: 'Mendoza', N: 'Misiones', P: 'Formosa', Q: 'Neuquén', R: 'Río Negro', S: 'Santa Fe',
  T: 'Tucumán', U: 'Chubut', V: 'Tierra del Fuego', W: 'Corrientes', X: 'Córdoba', Y: 'Jujuy', Z: 'Santa Cruz',
};
const ZONA_CPA = { A: 'noa', B: 'bsas', C: 'amba', D: 'cuyo', E: 'centro', F: 'noa', G: 'noa', H: 'nea', J: 'cuyo', K: 'noa', L: 'bsas', M: 'cuyo', N: 'nea', P: 'nea', Q: 'patagonia', R: 'patagonia', S: 'centro', T: 'noa', U: 'patagonia', V: 'patagonia', W: 'nea', X: 'centro', Y: 'noa', Z: 'patagonia' };
const ZONAS = {
  cuyo: { nombre: 'Cuyo', dom: [2, 4], suc: [2, 4], pDom: 6900, pSuc: 5200 },
  centro: { nombre: 'Centro', dom: [3, 5], suc: [3, 5], pDom: 8900, pSuc: 6900 },
  amba: { nombre: 'Ciudad y Gran Buenos Aires', dom: [3, 6], suc: [3, 5], pDom: 9900, pSuc: 7400 },
  bsas: { nombre: 'Interior de Buenos Aires y La Pampa', dom: [4, 6], suc: [4, 6], pDom: 9900, pSuc: 7400 },
  noa: { nombre: 'Noroeste', dom: [4, 7], suc: [4, 6], pDom: 10900, pSuc: 8200 },
  nea: { nombre: 'Noreste', dom: [5, 8], suc: [5, 7], pDom: 11900, pSuc: 8900 },
  patagonia: { nombre: 'Patagonia', dom: [5, 9], suc: [5, 8], pDom: 12900, pSuc: 9600 },
};
const RANGOS_CP = [[1000, 1999, 'amba'], [2000, 3199, 'centro'], [3200, 3799, 'nea'], [4000, 4799, 'noa'], [5000, 5299, 'centro'], [5300, 5399, 'noa'],
  [5400, 5799, 'cuyo'], [5800, 5999, 'centro'], [6000, 8199, 'bsas'], [8200, 9499, 'patagonia']];
function zonaPorCP(valor) {
  const v = String(valor || '').toUpperCase().replace(/\s+/g, '');
  const cpa = v.match(/^([A-HJ-NP-Z])(\d{4})([A-Z]{3})?$/);
  const num = v.match(/^(\d{4})$/);
  if (!cpa && !num) return null;
  const n = Number(cpa ? cpa[2] : num[1]);
  let id = null, provincia = '';
  if (cpa) {
    provincia = PROVINCIAS_CPA[cpa[1]];
    id = ZONA_CPA[cpa[1]];
    if (cpa[1] === 'B' && n < 2000) id = 'amba';
  } else {
    id = RANGOS_CP.find(([a, b]) => n >= a && n <= b)?.[2] || null;
  }
  if (!id) return null;
  return { id, cp: cpa ? cpa[0] : String(n), provincia, ...ZONAS[id] };
}
const diasTxt = r => `${r[0]} a ${r[1]} días hábiles`;

const Envio = {
  KEY: 'herenciaargentina_envio',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return v && typeof v === 'object' ? { metodo: v.metodo || 'domicilio', cp: v.cp || '' } : { metodo: 'domicilio', cp: '' }; } catch { return { metodo: 'domicilio', cp: '' }; } },
  set(cambios) { const v = { ...this.get(), ...cambios }; try { localStorage.setItem(this.KEY, JSON.stringify(v)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('envio:updated')); return v; },
  costo() {
    const { metodo, cp } = this.get();
    const z = zonaPorCP(cp);
    if (metodo === 'coordinar' || !z) return null;
    return metodo === 'sucursal' ? z.pSuc : z.pDom;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  opcion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.2"/></svg>',
  caja: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  camion: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ESTADO = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(36px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(40px)"',
};

function metaDe(p) {
  return subDe(p)?.nombre || CATEGORIAS.find(c => c.id === p.cat)?.corto || '';
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  if (p.stock <= 6) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
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
function opsHTML(p) {
  if (!conVar(p)) return '';
  if (p.var.fotos) return `<span class="prod__tonos" aria-label="Colores: ${esc(p.var.ops.join(', '))}">${p.var.ops.map(o => `<span class="tono tono--${esc(o.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''))}"></span>`).join('')}</span>`;
  return `<span class="prod__tonos">${ICON.opcion}${esc(p.var.ops[0])} a ${esc(p.var.ops[p.var.ops.length - 1])}</span>`;
}
function selectHTML(p, nombre) {
  return `<label class="var-sel"><span class="sr-only">${esc(tipoVar(p))} de ${nombre}</span><select data-op><option value="">${esc(tipoVar(p))}</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver detalle</span></div>`;
  const control = conVar(p) ? selectHTML(p, nombre) : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <div class="prod__precio-fila">${precioHTML(p)}${opsHTML(p)}</div>
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function destacadoHTML(p) {
  const nombre = esc(p.nombre);
  const accion = conVar(p)
    ? `<button type="button" class="btn btn--oscuro btn--full" data-qv-abrir="${p.id}" aria-label="Elegir ${esc(tipoVar(p).toLowerCase())} de ${nombre}">Elegir ${esc(tipoVar(p).toLowerCase())}</button>`
    : `<button type="button" class="btn btn--oscuro btn--full" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">Agregar al carrito</button>`;
  return `<article class="dest">
    <a class="dest__foto prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>
    <div class="dest__info">
      <h3 class="dest__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioHTML(p)}
      ${accion}
    </div>
  </article>`;
}

function filaHTML(p) {
  const nombre = esc(p.nombre);
  const accion = conVar(p)
    ? `<button type="button" class="fila__btn" data-qv-abrir="${p.id}" aria-label="Elegir ${esc(tipoVar(p).toLowerCase())} de ${nombre}">${ICON.opcion}<span>Elegir ${esc(tipoVar(p).toLowerCase())}</span></button>`
    : `<button type="button" class="fila__btn" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}<span>Agregar</span></button>`;
  return `<article class="fila">
    <a class="fila__foto prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="400" height="400" decoding="async"></a>
    <div class="fila__info">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="fila__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <div class="fila__pie">${precioHTML(p)}${accion}</div>
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
      + `<div class="cats-nec"><p class="cats-nec__tit">Por material</p>${MATERIALES.map(m => `<a href="${CATALOGO_URL}?material=${m.id}">${esc(m.nombre)}</a>`).join('')}</div>`
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver toda la tienda ${ICON.flecha}</a></div>`;
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
  const form = document.getElementById('busquedaHeader');
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
  const q = sel => [...hero.querySelectorAll(sel)];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  if (q('.hero__guarda').length) tl.from(q('.hero__guarda'), { scaleX: 0, duration: 1, clearProps: 'transform' }, 0.1);
  tl.from(q('h1'), { y: 32, opacity: 0, duration: 1.2, clearProps: 'transform' }, 0.18)
    .from(q('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.38)
    .from(q('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.5);
  if (q('.sello').length) tl.from(q('.sello'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.62);
  if (q('.indice li').length) tl.from(q('.indice li'), { x: 24, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.6);
}

const DESTACADOS = ['mate-calabaza-cuero', 'cuchillo-criollo-vaina', 'poncho-telar-guarda'];
function initHome() {
  if (PAGINA !== 'home') return;
  const dest = document.getElementById('destacadosLista');
  if (dest) dest.innerHTML = DESTACADOS.map(getProducto).filter(Boolean).map(p => `<li ${ESTADO.subir}>${destacadoHTML(p)}</li>`).join('');
  const vista = document.getElementById('vistaLista');
  if (vista) {
    vista.innerHTML = Tienda.consultar({ filtros: { excluir: DESTACADOS }, orden: 'destacados', limite: 8 }).items
      .map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catN });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-cat-cuenta]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catCuenta });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function initPara() {
  const box = document.getElementById('para');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panel = box.querySelector('[role="tabpanel"]');
  const frase = box.querySelector('[data-para-frase]');
  const ver = box.querySelector('[data-para-ver]');
  const pintar = (id, foco) => {
    const d = PARA.find(x => x.id === id) || PARA[0];
    tabs.forEach(t => {
      const on = t.dataset.para === d.id;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${d.id}`);
    if (frase) frase.textContent = d.frase;
    const filtros = d.id === 'empresa' ? { cat: 'regalos' } : { para: d.id };
    const res = Tienda.consultar({ filtros, orden: 'destacados', limite: 4 });
    const n = Tienda.contar(filtros);
    if (ver) {
      ver.href = d.id === 'empresa' ? `${CATALOGO_URL}?cat=regalos` : `${CATALOGO_URL}?para=${d.id}`;
      ver.querySelector('span').textContent = `Ver los ${n} productos`;
    }
    const lista = panel.querySelector('.para__lista');
    lista.innerHTML = res.items.map(p => `<li ${ESTADO.der}>${filaHTML(p)}</li>`).join('');
    revelarNuevos(lista);
    refrescarTriggers();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.para));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      pintar(tabs[(i + d + tabs.length) % tabs.length].dataset.para, true);
    });
  });
  pintar(tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.para || PARA[0].id);
}

const KITS_PERSONALIZACION = {
  sin: 'Sin personalizar',
  logo: 'Con el logo de la empresa',
  tarjeta: 'Con tarjeta y mensaje',
};
const KITS_FECHA = { mes: 'este mes', fin: 'para fin de año', coordinar: 'en una fecha a coordinar' };
function initEmpresas() {
  const form = document.getElementById('empresasForm');
  if (!form) return;
  const kits = Tienda.consultar({ filtros: { cat: 'regalos' }, orden: 'destacados', limite: 8 }).items;
  const lista = form.querySelector('[data-kits]');
  lista.innerHTML = kits.map((k, i) => `<label class="kit-op"><input type="radio" name="kit" value="${k.id}"${i === 0 ? ' checked' : ''}><span class="kit-op__foto"><img src="${k.img}" alt="" width="120" height="120" decoding="async"></span><span class="kit-op__txt"><span class="kit-op__nombre">${esc(k.nombre)}</span><span class="kit-op__precio">${formatearPrecio(precioFinal(k))} c/u</span></span></label>`).join('');
  const cant = form.querySelector('#kitCantidad');
  const empresa = form.querySelector('#kitEmpresa');
  const tag = document.getElementById('etiquetaRegalo');
  const res = document.getElementById('empresasRes');
  const pintar = () => {
    const kit = getProducto(form.querySelector('input[name="kit"]:checked')?.value) || kits[0];
    const n = Math.min(Math.max(parseInt(cant.value, 10) || 1, 1), 999);
    const per = form.querySelector('input[name="perso"]:checked')?.value || 'sin';
    const fecha = form.querySelector('#kitFecha')?.value || 'coordinar';
    const quien = empresa.value.trim().slice(0, 40);
    if (tag) {
      tag.querySelector('[data-tag-para]').textContent = quien ? `el equipo de ${quien}` : 'tu equipo';
      tag.querySelector('[data-tag-kit]').textContent = `${n} × ${kit.nombre}`;
      tag.querySelector('[data-tag-perso]').textContent = KITS_PERSONALIZACION[per];
      tag.querySelector('[data-tag-foto]').src = kit.img;
    }
    const total = precioFinal(kit) * n;
    const msg = [`Hola ${MARCA}! Quiero pedir una cotización de regalos corporativos:`, `- ${n} × ${kit.nombre}`, `- Personalización: ${KITS_PERSONALIZACION[per].toLowerCase()}`,
      `- Entrega: ${KITS_FECHA[fecha]}`, quien ? `- Empresa: ${quien}` : '', `Precio de lista de referencia: ${formatearPrecio(total)}`].filter(Boolean).join('\n');
    res.innerHTML = `<p class="empresas__ref"><span>Referencia con precio de lista</span><strong>${formatearPrecio(total)}</strong><small>${n} × ${formatearPrecio(precioFinal(kit))}</small></p>
      <p class="empresas__nota">La cotización final por cantidad y la personalización las confirma ${MARCA} por WhatsApp.</p>
      <a class="btn btn--cta btn--grande btn--full" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Pedir la cotización por WhatsApp</a>`;
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => e.preventDefault());
  form.querySelectorAll('[data-cant]').forEach(b => b.addEventListener('click', () => {
    const v = (parseInt(cant.value, 10) || 0) + Number(b.dataset.cant);
    cant.value = Math.min(Math.max(v, 1), 999);
    pintar();
  }));
  pintar();
}

function envioResultadoHTML(z) {
  const lugar = z.provincia ? `${esc(z.provincia)} · zona ${esc(z.nombre)}` : `Zona ${esc(z.nombre)}`;
  return `<p class="envio__lugar">${ICON.camion}<span>CP ${esc(z.cp)} · ${lugar}</span></p>
    <ul class="envio__ops">
      <li><span class="envio__op">A domicilio</span><span>${diasTxt(z.dom)}</span><strong>${formatearPrecio(z.pDom)}</strong></li>
      <li><span class="envio__op">A sucursal de Correo Argentino</span><span>${diasTxt(z.suc)}</span><strong>${formatearPrecio(z.pSuc)}</strong></li>
    </ul>`;
}
function initEnvios() {
  const form = document.getElementById('envioForm');
  if (!form) return;
  const input = form.querySelector('input');
  const res = document.getElementById('envioRes');
  const calcular = guardar => {
    const z = zonaPorCP(input.value);
    if (!z) {
      res.innerHTML = `<p class="envio__error">Escribí un código postal de 4 números (por ejemplo, 5500) o el CPA completo (M5500ABC).</p>`;
      return;
    }
    res.innerHTML = envioResultadoHTML(z);
    if (guardar) Envio.set({ cp: z.cp });
  };
  form.addEventListener('submit', e => { e.preventDefault(); calcular(true); });
  const prev = Envio.get().cp;
  if (prev) { input.value = prev; calcular(false); }
}

const QV = { p: null, op: '', foto: 0, opener: null };
function fotosQV(p) {
  const fotos = [{ src: fotoDe(p, QV.op), alt: QV.op ? `${p.alt} (${varTxt(p, QV.op)})` : p.alt }];
  (p.galeria || []).forEach(src => fotos.push({ src, alt: `Otra vista: ${p.nombre}` }));
  return fotos;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = fotosQV(p);
  if (QV.foto >= fotos.length) QV.foto = 0;
  const tipo = tipoVar(p);
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto].src;
  const forma = actual.includes('vertical') ? ' qv__principal--alta' : actual.includes('hero') ? ' qv__principal--ancha' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto principal'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.incluye ? `<div class="qv__incluye"><p class="f-grupo__titulo">Incluye</p><ul>${p.incluye.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        ${(p.datos || []).map(([k, v]) => `<p class="qv__dato"><span>${esc(k)}</span>${esc(v)}</p>`).join('')}
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">${esc(tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí ${artVar(p)} ${esc(tipo.toLowerCase())}">${p.var.ops.map(o => `<button type="button" class="qv__op${p.var.fotos ? ' qv__op--color' : ''}" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${p.var.fotos ? `<span class="tono tono--${esc(o.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''))}"></span>` : ''}${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${p.cat === 'regalos' ? `<a class="qv__empresas" href="${MODELO === '2' ? 'modelo-2.html' : './'}#empresas">${ICON.caja}¿Lo necesitás para tu empresa? Pedí cotización por cantidad</a>` : ''}
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
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
      if (QV.p.var?.fotos) { QV.foto = 0; renderQV(); modal.querySelector(`[data-qv-op="${CSS.escape(QV.op)}"]`)?.focus(); return; }
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (${varTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí ${artVar(p)} ${tipoVar(p).toLowerCase()} para sumarlo al carrito.`;
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
    <img src="${fotoDe(p, op)}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function pintarEnvioCarrito() {
  const box = document.getElementById('cartEnvio');
  if (!box) return;
  const { metodo, cp } = Envio.get();
  const z = zonaPorCP(cp);
  box.querySelectorAll('input[name="envio"]').forEach(r => { r.checked = r.value === metodo; });
  const input = box.querySelector('#cartCp');
  if (input && document.activeElement !== input) input.value = cp;
  box.querySelectorAll('[data-envio-precio]').forEach(el => {
    const m = el.dataset.envioPrecio;
    el.textContent = z ? `${formatearPrecio(m === 'sucursal' ? z.pSuc : z.pDom)} · ${diasTxt(m === 'sucursal' ? z.suc : z.dom)}` : 'Ingresá tu CP';
  });
  const cpBox = box.querySelector('.envio-cp');
  if (cpBox) cpBox.hidden = metodo === 'coordinar';
  const res = box.querySelector('[data-envio-res]');
  if (res) res.textContent = metodo === 'coordinar' ? '' : z ? `${z.provincia ? `${z.provincia} · ` : ''}zona ${z.nombre}` : (cp ? 'No reconocemos ese código postal.' : '');
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.caja}<p>Tu carrito está vacío. Hay mates, cuchillos y ponchos hechos a mano esperando su regalo.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver a la tienda ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  pintarEnvioCarrito();
  const sub = Cart.total();
  const env = Envio.costo();
  const { metodo, cp } = Envio.get();
  document.getElementById('cartSubtotal').textContent = formatearPrecio(sub);
  document.getElementById('cartEnvioCosto').textContent = metodo === 'coordinar' ? 'A coordinar' : env == null ? 'Falta el CP' : formatearPrecio(env);
  document.getElementById('cartTotal').textContent = formatearPrecio(sub + (env || 0));
  const z = zonaPorCP(cp);
  const envioTxt = metodo === 'coordinar' ? 'Envío: a coordinar por WhatsApp'
    : `Envío: Correo Argentino ${metodo === 'sucursal' ? 'a sucursal' : 'a domicilio'}${z ? ` (CP ${z.cp}): ${formatearPrecio(env)}` : ' (paso el código postal)'}`;
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), envioTxt, `Total: ${formatearPrecio(sub + (env || 0))}`].join('\n');
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
  const envio = document.getElementById('cartEnvio');
  envio?.addEventListener('change', e => { if (e.target.name === 'envio') Envio.set({ metodo: e.target.value }); });
  let t = 0;
  envio?.querySelector('#cartCp')?.addEventListener('input', e => {
    clearTimeout(t);
    const v = e.target.value;
    t = setTimeout(() => Envio.set({ cp: v.trim().toUpperCase().slice(0, 8) }), 250);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const { metodo } = Envio.get();
    if (metodo !== 'coordinar' && Envio.costo() == null) {
      showToast('Ingresá tu código postal para calcular el envío por Correo Argentino.');
      document.getElementById('cartCp')?.focus();
      return;
    }
    showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
  document.addEventListener('envio:updated', () => { if (!d.hidden) renderCarrito(); });
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
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvOp || ''); return; }
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
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], material: multi('material', MATERIALES), para: valido(params.get('para'), PARA),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
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
  const vacioWsp = document.getElementById('vacioWsp');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.material.length) f.material = e.material;
    if (e.para) f.para = e.para;
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
    grupos.push(`<fieldset class="f-grupo"><legend>Rubro</legend>
      ${opcion('radio', 'cat', '', 'Todos', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat && subsDe(e.cat).length) grupos.push(`<fieldset class="f-grupo"><legend>${esc(nombreDe(CATEGORIAS, e.cat))}</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    const mats = MATERIALES.filter(m => fac.material[m.id]);
    if (mats.length) grupos.push(`<fieldset class="f-grupo"><legend>Material</legend><div class="f-necs">
      ${mats.map(m => `<label class="f-nec"><input type="checkbox" name="material-${m.id}" value="${m.id}" data-f="material"${e.material.includes(m.id) ? ' checked' : ''}><span>${esc(m.nombre)}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Para quién es</legend>
      ${opcion('radio', 'para', '', 'Para cualquiera', !e.para, null, 'para')}
      ${PARA.map(x => opcion('radio', 'para', x.id, esc(x.nombre), e.para === x.id, Tienda.contar({ ...base, para: x.id }), 'para')).join('')}</fieldset>`);
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
    const para = !cat && e.para ? PARA.find(x => x.id === e.para) : null;
    const mat = !cat && !para && e.material.length === 1 ? MATERIALES.find(m => m.id === e.material[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : para ? para.nombre : mat ? `Piezas de ${mat.nombre.toLowerCase()}` : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.q ? `Resultados para «${e.q}»` : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Toda la tienda';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : para ? para.frase : mat ? `Artículos artesanales con ${mat.nombre.toLowerCase()}.` : e.oferta ? 'Piezas con descuento, mientras haya stock.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Mates, cuchillería, ponchos, cuero y kits para regalar. Elegí y recibilo por Correo Argentino.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : para ? para.corto : mat ? mat.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : para ? `${CATALOGO_URL}?para=${para.id}` : mat ? `${CATALOGO_URL}?material=${mat.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta && !e.material.length && !e.para ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.corto)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.material.forEach(v => quitar.push(['material', v, nombreDe(MATERIALES, v)]));
    if (e.para) quitar.push(['para', e.para, nombreDe(PARA, e.para)]);
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
    ['cat', 'sub', 'material', 'para', 'precio', 'oferta', 'fav', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.material.length) u.searchParams.set('material', e.material.join(','));
    if (e.para) u.searchParams.set('para', e.para);
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = e.q ? 0 : Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const hay = mostrados > 0;
    contador.textContent = e.q
      ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'}`
      : `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te decimos si lo conseguimos.` : 'No hay productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! ¿Tienen ${e.q}?` : `Hola ${MARCA}! Estoy buscando un artículo y no lo encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados} ${cursor ? '· hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
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
  aplicar();
  if (e.q || params.has('q')) setTimeout(() => buscar.focus(), 120);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio' || grupo === 'para') e[grupo] = inp.value;
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
    f.hidden = true;
    document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.material = []; e.para = ''; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio' || k === 'para') e[k] = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = []; e.material = []; e.para = ''; e.oferta = false;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-nec a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.material = (u.searchParams.get('material') || '').split(',').filter(v => MATERIALES.some(x => x.id === v));
    e.para = valido(u.searchParams.get('para'), PARA);
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
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

[initCatsMenu, initHome, initPara, initEmpresas, initEnvios, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
