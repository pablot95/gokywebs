const WA = '5491162539264';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const esM2 = document.body.classList.contains('m2');
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CAT = esM2 ? 'catalogo-2.html' : 'catalogo.html';

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
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const CATEGORIAS = [
  { id: 'aluminio', nombre: 'Aberturas de aluminio', corto: 'Aluminio', det: 'Ventanas, puertas y corredizas', img: 'images/p-ventana-blanca.webp' },
  { id: 'pvc', nombre: 'Aberturas de PVC', corto: 'PVC', det: 'Oscilobatientes y de abrir, con DVH', img: 'images/p-pvc-abrir.webp' },
  { id: 'mamparas', nombre: 'Mamparas de baño', corto: 'Mamparas', det: 'Vidrio templado de 8 mm', img: 'images/p-mampara-esquinera.webp' },
  { id: 'placard', nombre: 'Frentes de placard', corto: 'Frentes de placard', det: 'Corredizos, con o sin espejo', img: 'images/p-placard-espejo.webp' },
  { id: 'cortinas', nombre: 'Cortinas y persianas', corto: 'Cortinas', det: 'Roller y persianas de enrollar', img: 'images/p-roller.webp' },
  { id: 'revestimientos', nombre: 'Cielorrasos y wall panel', corto: 'Cielorrasos y wall panel', det: 'Cielorraso de PVC y revestimiento varillado', img: 'images/p-wall-panel-roble.webp' },
  { id: 'accesorios', nombre: 'Mosquiteros y herrajes', corto: 'Mosquiteros y herrajes', det: 'Telas a medida, manijas y bisagras', img: 'images/p-mosquitero.webp' },
];

const TONOS = {
  blanco: { nombre: 'Blanco', muestra: '#F3F2EF' },
  negro: { nombre: 'Negro', muestra: '#1F1C1C' },
  gris: { nombre: 'Gris y plata', muestra: '#BFC2C4' },
  madera: { nombre: 'Símil madera', muestra: '#A57A52' },
};
const COLORES = {
  'Blanco': 'blanco', 'Blanco hueso': 'blanco', 'Blanco con espejo central': 'blanco',
  'Negro': 'negro', 'Herrajes negros': 'negro',
  'Herrajes cromados': 'gris', 'Plata': 'gris', 'Gris perla': 'gris', 'Símil cemento + espejo': 'gris',
  'Roble claro': 'madera', 'Nogal': 'madera',
};
const PRECIOS = [
  { id: 'hasta-100', nombre: 'Hasta $100.000', min: 0, max: 100000 },
  { id: '100-400', nombre: '$100.000 a $400.000', min: 100001, max: 400000 },
  { id: '400-800', nombre: '$400.000 a $800.000', min: 400001, max: 800000 },
  { id: 'mas-800', nombre: 'Más de $800.000', min: 800001, max: Infinity },
];
const UNIDADES = { 'm²': ' / m²', placa: ' / placa' };

const op = (v, precio) => ({ v, precio });
const PRODUCTOS = [
  { id: 'ventana-corrediza-aluminio', nombre: 'Ventana corrediza de aluminio · 2 hojas', cat: 'aluminio', mat: 'Aluminio', tipo: 'ventana', img: 'images/p-corrediza-aluminio.webp', alt: 'Ventana corrediza de aluminio oscuro de dos hojas en una pared clara', colores: ['Blanco', 'Negro'], ops: [op('100 × 60 cm', 139000), op('120 × 110 cm', 189000), op('150 × 110 cm', 219000), op('180 × 110 cm', 259000), op('200 × 110 cm', 289000)], rango: 1, alta: 21, tags: ['corrediza'], desc: 'Dos hojas corredizas con vidrio float de 4 mm, felpas y cierre central. Para dormitorios, livings y cocinas.', ficha: [['Línea', 'Liviana'], ['Vidrio', 'Float 4 mm'], ['Apertura', 'Corrediza, 2 hojas']] },
  { id: 'puerta-entrada-aluminio', nombre: 'Puerta de entrada de aluminio con vidrio entero', cat: 'aluminio', mat: 'Aluminio', tipo: 'puerta', img: 'images/p-puerta-aluminio.webp', alt: 'Puerta de entrada de aluminio negro con vidrio de piso a techo', colores: ['Negro', 'Blanco'], ops: [op('90 × 200 cm', 690000), op('100 × 210 cm', 760000)], rango: 2, alta: 20, tags: ['puerta de calle', 'laminado'], badge: 'Vidrio laminado', desc: 'Hoja de abrir con vidrio laminado 3+3, manijón vertical y cerradura de seguridad.', ficha: [['Línea', 'Reforzada'], ['Vidrio', 'Laminado 3+3'], ['Apertura', 'De abrir, 1 hoja']] },
  { id: 'puerta-ventana-corrediza-4-hojas', nombre: 'Puerta-ventana corrediza de aluminio · 4 hojas', cat: 'aluminio', mat: 'Aluminio', tipo: 'puerta-ventana', img: 'images/p-corrediza-negra.webp', alt: 'Puerta-ventana corrediza de aluminio negro abierta hacia un jardín', colores: ['Negro', 'Blanco'], ops: [op('300 × 200 cm', 1290000), op('400 × 220 cm', 1690000)], rango: 3, alta: 19, tags: ['ventanal', 'corrediza'], desc: 'Cuatro hojas corredizas para cerrar un ventanal entero: las dos centrales abren hacia los lados.', ficha: [['Línea', 'Reforzada'], ['Vidrio', 'Float 5 mm'], ['Apertura', 'Corrediza, 4 hojas']] },
  { id: 'puerta-balcon-aluminio', nombre: 'Puerta balcón corrediza de aluminio · 2 hojas', cat: 'aluminio', mat: 'Aluminio', tipo: 'puerta-ventana', img: 'images/p-puerta-balcon.webp', alt: 'Puerta balcón corrediza de aluminio oscuro con cortinas a los lados', colores: ['Negro', 'Blanco'], ops: [op('150 × 200 cm', 520000), op('180 × 200 cm', 590000)], rango: 4, alta: 18, tags: ['balcon', 'corrediza'], desc: 'Dos hojas corredizas de piso a techo para salir al balcón o al patio, con traba de seguridad.', ficha: [['Línea', 'Reforzada'], ['Vidrio', 'Float 5 mm'], ['Apertura', 'Corrediza, 2 hojas']] },
  { id: 'ventana-aluminio-3-panos', nombre: 'Ventana de aluminio blanca · 3 paños', cat: 'aluminio', mat: 'Aluminio', tipo: 'ventana', img: 'images/p-ventana-blanca.webp', alt: 'Ventana de aluminio blanca de tres paños con vista a un jardín', colores: ['Blanco'], ops: [op('150 × 110 cm', 340000), op('180 × 120 cm', 395000)], alta: 12, tags: ['de abrir'], desc: 'Paño central de abrir y dos laterales fijos, para ganar luz sin perder ventilación.', ficha: [['Línea', 'Liviana'], ['Vidrio', 'Float 4 mm'], ['Apertura', 'Central de abrir']] },
  { id: 'ventana-pvc-oscilobatiente', nombre: 'Ventana de PVC oscilobatiente con DVH · 2 hojas', cat: 'pvc', mat: 'PVC', tipo: 'ventana', img: 'images/p-pvc-oscilo.webp', alt: 'Ventana de PVC blanca de dos hojas con una hoja abierta', colores: ['Blanco'], ops: [op('120 × 110 cm', 610000), op('150 × 110 cm', 690000)], rango: 5, alta: 17, tags: ['dvh', 'doble vidriado', 'termopanel'], badge: 'DVH', desc: 'Abre de costado o se inclina arriba para ventilar con seguridad. El doble vidriado aísla frío, calor y ruido.', ficha: [['Perfil', 'PVC multicámara'], ['Vidrio', 'DVH 4/9/4'], ['Apertura', 'Oscilobatiente']] },
  { id: 'ventana-pvc-bano', nombre: 'Ventana de PVC oscilobatiente para baño', cat: 'pvc', mat: 'PVC', tipo: 'ventana', img: 'images/p-pvc-bano.webp', alt: 'Hoja de PVC blanca abierta hacia adentro con manija plateada', colores: ['Blanco'], ops: [op('60 × 40 cm', 249000), op('60 × 60 cm', 289000)], alta: 11, tags: ['dvh', 'doble vidriado', 'lavadero'], badge: 'DVH', desc: 'Una hoja oscilobatiente para baños y lavaderos, con doble vidriado y una sola manija.', ficha: [['Perfil', 'PVC multicámara'], ['Vidrio', 'DVH 4/9/4'], ['Apertura', 'Oscilobatiente, 1 hoja']] },
  { id: 'ventana-pvc-repartidos', nombre: 'Ventana de PVC de abrir con repartidos', cat: 'pvc', mat: 'PVC', tipo: 'ventana', img: 'images/p-pvc-abrir.webp', alt: 'Ventana de PVC blanca de abrir con repartidos y vista a árboles', colores: ['Blanco'], ops: [op('100 × 120 cm', 640000), op('120 × 150 cm', 760000)], alta: 10, tags: ['dvh', 'doble vidriado', 'clasica'], badge: 'DVH', desc: 'Dos hojas de abrir con repartidos blancos, de estilo clásico, con doble vidriado hermético.', ficha: [['Perfil', 'PVC multicámara'], ['Vidrio', 'DVH 4/9/4'], ['Apertura', 'De abrir, 2 hojas']] },
  { id: 'mampara-fija-puerta', nombre: 'Mampara de baño · paño fijo + puerta rebatible', cat: 'mamparas', mat: 'Vidrio templado', tipo: 'mampara', img: 'images/p-mampara-fija.webp', alt: 'Mampara de vidrio templado con paño fijo y puerta en una ducha', colores: ['Herrajes cromados', 'Herrajes negros'], ops: [op('90 × 190 cm', 480000), op('120 × 190 cm', 560000)], rango: 6, alta: 16, tags: ['ducha', 'receptaculo'], badge: 'Templado 8 mm', desc: 'Vidrio templado de 8 mm con puerta rebatible sobre bisagras de acero, para receptáculos y duchas a ras de piso.', ficha: [['Vidrio', 'Templado 8 mm'], ['Herrajes', 'Acero'], ['Apertura', 'Rebatible']] },
  { id: 'mampara-corrediza', nombre: 'Mampara corrediza de vidrio templado', cat: 'mamparas', mat: 'Vidrio templado', tipo: 'mampara', img: 'images/p-mampara-corrediza.webp', alt: 'Mampara corrediza de vidrio en una ducha con revestimiento claro', colores: ['Herrajes cromados'], ops: [op('120 × 190 cm', 520000), op('140 × 190 cm', 580000), op('160 × 190 cm', 640000)], rango: 7, alta: 15, tags: ['ducha', 'banera'], badge: 'Templado 8 mm', desc: 'Una hoja fija y una corrediza sobre riel superior: no ocupa lugar al abrir.', ficha: [['Vidrio', 'Templado 8 mm'], ['Herrajes', 'Acero'], ['Apertura', 'Corrediza']] },
  { id: 'mampara-esquinera', nombre: 'Mampara esquinera de vidrio templado', cat: 'mamparas', mat: 'Vidrio templado', tipo: 'mampara', img: 'images/p-mampara-esquinera.webp', alt: 'Mampara esquinera de vidrio templado en un baño blanco', colores: ['Herrajes cromados'], ops: [op('80 × 80 × 190 cm', 590000), op('90 × 90 × 190 cm', 640000)], alta: 14, tags: ['ducha', 'esquina'], badge: 'Templado 8 mm', desc: 'Dos paños en ángulo para duchas en esquina, con puerta rebatible.', ficha: [['Vidrio', 'Templado 8 mm'], ['Herrajes', 'Acero'], ['Apertura', 'Rebatible']] },
  { id: 'frente-placard-3-hojas', nombre: 'Frente de placard corredizo · 3 hojas', cat: 'placard', mat: 'Melamina', img: 'images/p-placard-blanco.webp', alt: 'Frente de placard corredizo blanco de tres hojas con espejo central', colores: ['Blanco', 'Blanco con espejo central'], ops: [op('180 × 240 cm', 690000), op('240 × 240 cm', 860000)], rango: 8, alta: 13, tags: ['placar', 'espejo', 'dormitorio'], desc: 'Hojas de melamina de 18 mm sobre rieles de aluminio, con la hoja central en espejo si la elegís.', ficha: [['Hojas', 'Melamina 18 mm'], ['Rieles', 'Aluminio'], ['Apertura', 'Corrediza, 3 hojas']] },
  { id: 'frente-placard-espejo', nombre: 'Frente de placard con espejo · 2 hojas', cat: 'placard', mat: 'Melamina', img: 'images/p-placard-espejo.webp', alt: 'Frente de placard con una hoja símil cemento y otra de espejo', colores: ['Símil cemento + espejo'], ops: [op('160 × 240 cm', 720000), op('200 × 240 cm', 840000)], alta: 9, tags: ['placar', 'espejo'], desc: 'Una hoja símil cemento y una de espejo, corredizas sobre rieles de aluminio.', ficha: [['Hojas', 'Melamina 18 mm y espejo'], ['Rieles', 'Aluminio'], ['Apertura', 'Corrediza, 2 hojas']] },
  { id: 'cortina-roller-sunscreen', nombre: 'Cortina roller sunscreen', cat: 'cortinas', mat: 'Tela', img: 'images/p-roller.webp', alt: 'Cortinas roller sunscreen claras sobre una ventana con vista a árboles', colores: ['Blanco hueso', 'Gris perla'], ops: [op('100 × 160 cm', 78000), op('140 × 180 cm', 98000), op('180 × 200 cm', 126000)], alta: 8, tags: ['roller', 'cortina', 'black out'], desc: 'Tela técnica que filtra el sol y deja ver hacia afuera. Mecanismo a cadena con tope.', ficha: [['Tela', 'Sunscreen'], ['Mecanismo', 'A cadena'], ['Colocación', 'Pared o techo']] },
  { id: 'persiana-enrollar-pvc', nombre: 'Persiana de enrollar de PVC', cat: 'cortinas', mat: 'PVC', img: 'images/p-persiana.webp', alt: 'Persiana de enrollar de PVC blanca bajada en una ventana', colores: ['Blanco'], ops: [op('120 × 110 cm', 189000), op('150 × 110 cm', 219000), op('180 × 120 cm', 259000)], alta: 7, tags: ['persiana', 'taparrollo', 'enrollar'], desc: 'Tablillas de PVC con cinta y enrollador. Consultá también por el aislamiento del taparrollo.', ficha: [['Tablilla', 'PVC'], ['Accionamiento', 'Cinta y enrollador'], ['Color', 'Blanco']] },
  { id: 'cielorraso-pvc', nombre: 'Cielorraso de PVC blanco · tablilla de 20 cm', cat: 'revestimientos', mat: 'PVC', img: 'images/p-cielorraso.webp', alt: 'Cielorraso de PVC blanco en tablillas con spots embutidos', colores: ['Blanco'], ops: [op('Por m²', 16900)], unidad: 'm²', alta: 6, tags: ['cielorraso', 'techo'], desc: 'Tablillas machihembradas de 7 mm, livianas y lavables, para baños, cocinas y galerías. Precio por metro cuadrado.', ficha: [['Tablilla', '20 cm × 7 mm'], ['Terminación', 'Blanco satinado'], ['Venta', 'Por m²']] },
  { id: 'wall-panel-roble', nombre: 'Wall panel varillado símil roble', cat: 'revestimientos', mat: 'WPC', img: 'images/p-wall-panel-roble.webp', alt: 'Pared revestida con wall panel varillado de tono roble claro', colores: ['Roble claro'], ops: [op('Placa 280 × 60 cm', 64000)], unidad: 'placa', alta: 5, tags: ['wall panel', 'varillado', 'revestimiento'], desc: 'Placa de varillas para revestir una pared de living o dormitorio, sobre la pared existente.', ficha: [['Placa', '280 × 60 cm'], ['Terminación', 'Símil roble'], ['Venta', 'Por placa']] },
  { id: 'wall-panel-nogal', nombre: 'Wall panel varillado símil nogal', cat: 'revestimientos', mat: 'WPC', img: 'images/p-wall-panel-nogal.webp', alt: 'Revestimiento varillado de tono nogal junto a una pared blanca', colores: ['Nogal'], ops: [op('Placa 280 × 60 cm', 67000)], unidad: 'placa', alta: 4, tags: ['wall panel', 'varillado', 'revestimiento'], desc: 'Placa de varillas en tono nogal para una pared de acento o una separación de ambientes.', ficha: [['Placa', '280 × 60 cm'], ['Terminación', 'Símil nogal'], ['Venta', 'Por placa']] },
  { id: 'mosquitero-corredizo', nombre: 'Tela de mosquitero corrediza con marco de aluminio', cat: 'accesorios', mat: 'Aluminio', img: 'images/p-mosquitero.webp', alt: 'Tela de mosquitero de fibra de vidrio vista de cerca a contraluz', colores: ['Blanco', 'Negro'], ops: [op('60 × 110 cm', 42000), op('75 × 110 cm', 46000), op('90 × 110 cm', 49000)], alta: 3, tags: ['mosquitero', 'tela'], desc: 'Hoja de mosquitero que corre por el riel de tu ventana corrediza, con tela de fibra de vidrio.', ficha: [['Marco', 'Aluminio'], ['Tela', 'Fibra de vidrio'], ['Para', 'Ventanas corredizas']] },
  { id: 'manija-aluminio', nombre: 'Manija de aluminio para ventana de abrir', cat: 'accesorios', mat: 'Aluminio', img: 'images/p-manija.webp', alt: 'Manija de aluminio plateada en una hoja de abrir', colores: ['Plata', 'Negro'], ops: [op('Unidad', 14500)], alta: 2, tags: ['herraje', 'repuesto'], desc: 'Manija de repuesto para hojas de abrir y oscilobatientes.', ficha: [['Material', 'Aluminio'], ['Para', 'Hojas de abrir'], ['Venta', 'Por unidad']] },
  { id: 'bisagra-aluminio', nombre: 'Bisagra de aluminio para hoja de abrir', cat: 'accesorios', mat: 'Aluminio', img: 'images/p-bisagra.webp', alt: 'Bisagra de aluminio plateada en el marco de una ventana', colores: ['Plata'], ops: [op('Par', 12800)], alta: 1, tags: ['herraje', 'repuesto'], desc: 'Par de bisagras de repuesto para hojas de abrir de aluminio.', ficha: [['Material', 'Aluminio'], ['Para', 'Hojas de abrir'], ['Venta', 'Por par']] },
];

const MATERIALES = [...new Set(PRODUCTOS.map(p => p.mat))];
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/×/g, 'x').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const catDe = id => CATEGORIAS.find(c => c.id === id);
const precioDesde = p => Math.min(...p.ops.map(o => o.precio));
const opDe = (p, v) => p.ops.find(o => o.v === v) || p.ops[0];
const precioDe = (p, v) => opDe(p, v).precio;
const unidadDe = p => UNIDADES[p.unidad] || '';
const tonoDe = c => COLORES[c] || 'gris';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
function medidaDe(v) {
  const n = (String(v).match(/\d+/g) || []).map(Number);
  if (n.length === 2) return { a: n[0], h: n[1] };
  if (n.length === 3) return { a: n[0], h: n[2] };
  return null;
}

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    if (f.cat && p.cat !== f.cat) return false;
    if (f.cats && !f.cats.includes(p.cat)) return false;
    if (f.tipo && p.tipo !== f.tipo) return false;
    if (f.destacado === true && p.rango == null) return false;
    if (f.destacado === false && p.rango != null) return false;
    if (f.mat && f.mat.length && !f.mat.includes(p.mat)) return false;
    if (f.col && f.col.length && !p.colores.some(c => f.col.includes(tonoDe(c)))) return false;
    if (f.dvh && !(p.tags || []).includes('dvh')) return false;
    if (f.precioMin != null && precioDesde(p) < f.precioMin) return false;
    if (f.precioMax != null && precioDesde(p) > f.precioMax) return false;
    if (f.excluir && f.excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango ?? 999) - (b.rango ?? 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  const contar = (filtros = {}) => visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, p.mat, p.desc, ...p.colores, ...p.ops.map(o => `${o.v} ${o.v.replace(/ /g, '')}`), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

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
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};

const Cart = {
  KEY: 'aberturala_cart',
  memoria: [],
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return [...this.memoria]; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.memoria = items; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v, c) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === v && i.c === c);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, v, c, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(n, qty) {
    const items = this.get(); const it = items[n]; if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(n) { const items = this.get(); items.splice(n, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
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

const ICON = {
  cota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 12h18M3 8v8M21 8v8"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  ojo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
};

const stepperHTML = (n = 1) => `<div class="stepper"><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><output aria-live="polite">${n}</output><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;

function cardHTML(p, anim = true) {
  const unica = p.ops.length === 1;
  const st = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const sel = unica
    ? `<p class="card__unica">${esc(p.colores.length > 1 ? p.colores.length + ' colores' : p.colores[0])}</p>`
    : `<label class="card__sel"><span class="sr-only">Medida de ${esc(p.nombre)}</span><select data-medida>${p.ops.map((o, i) => `<option value="${i}">${esc(o.v)}</option>`).join('')}</select></label>`;
  return `<article class="card"${st} data-id="${p.id}">
  <button type="button" class="card__media" data-qv="${p.id}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${p.img}" width="880" height="1100" alt="${esc(p.alt)}">${p.badge ? `<span class="card__badge">${esc(p.badge)}</span>` : ''}<span class="card__medida">${ICON.cota}${esc(unica ? p.ops[0].v : p.ops.length + ' medidas estándar')}</span></button>
  <div class="card__body">
    <p class="card__cat">${esc(catDe(p.cat)?.corto || '')}</p>
    <h3 class="card__nombre"><button type="button" data-qv="${p.id}">${esc(p.nombre)}</button></h3>
    <div class="card__fila"><p class="card__precio" data-precio>${formatearPrecio(p.ops[0].precio)}${unidadDe(p) ? `<small>${unidadDe(p)}</small>` : ''}</p>${sel}</div>
    <div class="prod-actions">${stepperHTML()}<button type="button" class="prod-add" data-add aria-label="Agregar ${esc(p.nombre)} al carrito">${ICON.carrito}<span>Agregar</span></button></div>
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
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initMenuCategorias(catActual = '') {
  const cont = document.getElementById('navCats');
  const btn = document.getElementById('navCatsBtn');
  const lista = document.getElementById('navCatsLista');
  if (!cont || !btn || !lista) return;
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CAT}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" width="46" height="46" alt=""><span><b>${esc(c.nombre)}</b><small>${Tienda.contar({ cat: c.id })} productos</small></span></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 961px) and (hover: hover)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); cont.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); cont.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (cont.classList.contains('open') ? cerrar() : abrir()));
  cont.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (!cont.contains(e.target) && cont.classList.contains('open') && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && cont.classList.contains('open')) { cerrar(); btn.focus(); } });
  cont.addEventListener('focusout', e => { if (window.matchMedia('(min-width: 961px)').matches && !cont.contains(e.relatedTarget)) cerrar(); });
}

function initBuscadorHeader() {
  const btn = document.getElementById('buscarBtn');
  const form = document.getElementById('buscadorHeader');
  if (!btn || !form) return;
  const input = form.querySelector('input');
  btn.addEventListener('click', () => {
    const catQ = document.getElementById('catQ');
    if (catQ) { catQ.scrollIntoView({ block: 'center' }); catQ.focus(); return; }
    const abierto = !form.hidden;
    form.hidden = abierto;
    btn.setAttribute('aria-expanded', String(!abierto));
    if (!abierto) input.focus();
  });
  form.addEventListener('submit', e => {
    if (!input.value.trim()) { e.preventDefault(); input.focus(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !form.hidden) { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
  });
}

function initCategorias() {
  const cards = document.getElementById('catsCards');
  const chips = document.getElementById('catsChips');
  const planilla = document.getElementById('planillaLista');
  if (cards) {
    cards.innerHTML = CATEGORIAS.slice(0, 4).map(c => `<a class="cat-card" href="${URL_CAT}?cat=${c.id}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="cat-card__img"><img src="${c.img}" width="880" height="1100" alt=""></span><span class="cat-card__pie"><span><b>${esc(c.corto)}</b><small>${esc(c.det)}</small></span>${ICON.flecha}</span></a>`).join('');
  }
  if (chips) {
    chips.innerHTML = CATEGORIAS.slice(4).map(c => `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"><a class="chip" href="${URL_CAT}?cat=${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  }
  if (planilla) {
    planilla.innerHTML = CATEGORIAS.map((c, i) => {
      const barato = Tienda.consultar({ filtros: { cat: c.id }, orden: 'precio-asc', limite: 1 }).items[0];
      const n = Tienda.contar({ cat: c.id });
      return `<li data-animate="subir" style="opacity:0;transform:translateY(32px)"><a class="planilla__fila" href="${URL_CAT}?cat=${c.id}"><span class="planilla__cod">R-0${i + 1}</span><span class="planilla__img"><img src="${c.img}" width="880" height="1100" alt=""></span><span class="planilla__nom">${esc(c.nombre)}</span><span class="planilla__det">${esc(c.det)} · ${n} ${n === 1 ? 'producto' : 'productos'}</span><span class="planilla__desde">desde<b>${barato ? formatearPrecio(precioDesde(barato)) + unidadDe(barato) : ''}</b></span>${ICON.flecha}</a></li>`;
    }).join('');
  }
}

function initRailFlechas(vp, prev, next, paso) {
  if (!vp || !prev || !next) return;
  const track = vp.firstElementChild;
  const actualizar = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
}

function initRailDrag(vp) {
  if (!vp) return;
  let down = false;
  let moved = false;
  let startX = 0;
  let startLeft = 0;
  let pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('select, input, label, .stepper, [data-add]')) return;
    down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
    if (!moved) return;
    vp.classList.remove('dragging');
    const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
    vp.addEventListener('click', kill, { capture: true, once: true });
    setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

function initDestacados() {
  const track = document.getElementById('railDestacados');
  const mosaico = document.getElementById('mosaicoDestacados');
  const destino = track || mosaico;
  if (!destino) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, limite: track ? 8 : 5 });
  items.forEach(p => cacheProductos.set(p.id, p));
  destino.innerHTML = items.map(p => cardHTML(p).replace('data-animate="subir" style="opacity:0;transform:translateY(40px)"', track ? 'data-animate="der" style="opacity:0;transform:translateX(64px)"' : 'data-animate="subir" style="opacity:0;transform:translateY(40px)"')).join('');
  if (track) {
    const vp = document.getElementById('railVp');
    const sec = vp.closest('section');
    initRailDrag(vp);
    initRailFlechas(vp, sec.querySelector('[data-rail-prev]'), sec.querySelector('[data-rail-next]'), () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 16);
  }
}

function initPreview() {
  const grid = document.getElementById('previewGrid');
  if (!grid) return;
  const items = ['mamparas', 'cortinas', 'revestimientos', 'accesorios'].map(cat => Tienda.consultar({ filtros: { destacado: false, cat }, orden: 'nuevos', limite: 1 }).items[0]).filter(Boolean);
  items.forEach(p => cacheProductos.set(p.id, p));
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function leerStepper(cont) {
  const out = cont?.querySelector('.stepper output');
  return Math.max(1, Math.min(99, parseInt(out?.textContent, 10) || 1));
}

function sumarAlCarrito(p, qty, v, c, comprar = false) {
  Cart.add(p, qty, v, c);
  const detalle = [p.ops.length > 1 || p.unidad ? v : '', p.colores.length > 1 ? c : ''].filter(Boolean).join(', ');
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty} × ${p.nombre}${detalle ? ` (${detalle})` : ''} al pedido.`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const step = e.target.closest('.stepper [data-step]');
    if (step) {
      const out = step.parentElement.querySelector('output');
      const n = Math.max(1, Math.min(99, (parseInt(out.textContent, 10) || 1) + Number(step.dataset.step)));
      out.textContent = n;
      if (step.closest('.qv')) qvEstado.qty = n;
      return;
    }
    const add = e.target.closest('.card [data-add]');
    if (add) {
      const card = add.closest('.card');
      const p = getProducto(card.dataset.id);
      if (!p) return;
      const sel = card.querySelector('select[data-medida]');
      const o = p.ops[Number(sel?.value || 0)] || p.ops[0];
      sumarAlCarrito(p, leerStepper(card), o.v, p.colores[0]);
      const out = card.querySelector('.stepper output');
      if (out) out.textContent = '1';
      add.classList.add('ok');
      add.querySelector('span').textContent = 'Listo';
      setTimeout(() => { add.classList.remove('ok'); add.querySelector('span').textContent = 'Agregar'; }, 1300);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      const card = qv.closest('.card');
      const sel = card?.querySelector('select[data-medida]');
      const p = getProducto(qv.dataset.qv);
      abrirQV(qv.dataset.qv, qv, { v: sel && p ? p.ops[Number(sel.value)]?.v : qv.dataset.v });
    }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('.card select[data-medida]');
    if (!sel) return;
    const card = sel.closest('.card');
    const p = getProducto(card.dataset.id);
    const o = p?.ops[Number(sel.value)];
    if (!o) return;
    card.querySelector('[data-precio]').innerHTML = formatearPrecio(o.precio) + (unidadDe(p) ? `<small>${unidadDe(p)}</small>` : '');
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab') return;
  const f = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const primero = f[0];
  const ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, v: '', c: '', qty: 1, origen: null };
function abrirQV(id, origen, { v, c } = {}) {
  const p = getProducto(id);
  const modal = document.getElementById('qv');
  if (!p || !modal) return;
  qvEstado.p = p;
  qvEstado.v = p.ops.some(o => o.v === v) ? v : p.ops[0].v;
  qvEstado.c = p.colores.includes(c) ? c : p.colores[0];
  qvEstado.qty = 1;
  if (origen) qvEstado.origen = origen;
  pintarQV();
  if (modal.hidden) {
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
  }
  modal.querySelector('.qv__panel').scrollTop = 0;
  modal.querySelector('.qv__cerrar').focus();
  if (PAGINA === 'catalogo') {
    const url = new URL(location.href);
    url.searchParams.set('producto', p.id);
    window.history.replaceState(null, '', url);
  }
  const ld = document.getElementById('ld-producto') || Object.assign(document.createElement('script'), { type: 'application/ld+json', id: 'ld-producto' });
  ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, brand: { '@type': 'Brand', name: 'AberturaLA' }, offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(o => o.precio)), availability: 'https://schema.org/InStock' } });
  if (!ld.parentNode) document.head.appendChild(ld);
}

function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContenido');
  if (!p || !cont) return;
  const cat = catDe(p.cat);
  const precio = formatearPrecio(precioDe(p, qvEstado.v));
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { destacado: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  rel.forEach(r => cacheProductos.set(r.id, r));
  const msg = `Hola AberturaLA, me interesa «${p.nombre}» pero a medida. Mi vano mide (ancho × alto): `;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${p.img}" width="880" height="1100" alt="${esc(p.alt)}"></div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre || '')}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio" id="qvPrecio">${precio}${unidadDe(p) ? `<small>${unidadDe(p)}</small>` : ''}</p>
      <p class="qv__desc">${esc(p.desc)}</p>
      <fieldset class="qv__grupo"><legend>${p.unidad ? 'Presentación' : 'Medida (ancho × alto)'}</legend><div class="qv__ops">${p.ops.map(o => `<label class="qv__op"><input type="radio" name="qv-medida" value="${esc(o.v)}"${o.v === qvEstado.v ? ' checked' : ''}><span>${esc(o.v)}</span></label>`).join('')}</div></fieldset>
      <fieldset class="qv__grupo"><legend>${p.cat === 'mamparas' ? 'Herrajes' : 'Color'}</legend><div class="qv__ops">${p.colores.map(c => `<label class="qv__op"><input type="radio" name="qv-color" value="${esc(c)}"${c === qvEstado.c ? ' checked' : ''}><span>${esc(c)}</span></label>`).join('')}</div></fieldset>
      <div class="qv__acciones">${stepperHTML(qvEstado.qty)}<button type="button" class="btn btn--cta" data-qv-add>Agregar al carrito</button><button type="button" class="btn btn--linea" data-qv-comprar>Comprar ahora</button></div>
      <p class="qv__medida">¿Tu vano no coincide? <a href="${waLink(msg)}" target="_blank" rel="noopener">Pedilo a medida por WhatsApp</a></p>
      <dl class="qv__ficha"><dt>Material</dt><dd>${esc(p.mat)}</dd>${p.ficha.map(([k, val]) => `<dt>${esc(k)}</dt><dd>${esc(val)}</dd>`).join('')}</dl>
    </div>
  </div>
  <div class="qv__rel"><p>También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><img src="${r.img}" width="880" height="1100" alt=""><span><b>${esc(r.nombre)}</b><small>desde ${formatearPrecio(precioDesde(r))}${unidadDe(r)}</small></span></button></li>`).join('')}</ul></div>`;
}

function cerrarQV() {
  const modal = document.getElementById('qv');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => {
    modal.hidden = true;
    if (!document.querySelector('.drawer.open, .visor.open, .main-nav.open')) document.body.classList.remove('no-scroll');
  }, reduceMotion ? 0 : 320);
  if (PAGINA === 'catalogo') {
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
  }
  qvEstado.origen?.focus?.();
}

function initQV() {
  const modal = document.getElementById('qv');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); return; }
    const p = qvEstado.p;
    if (!p) return;
    if (e.target.closest('[data-qv-add]')) { sumarAlCarrito(p, qvEstado.qty, qvEstado.v, qvEstado.c); return; }
    if (e.target.closest('[data-qv-comprar]')) { cerrarQV(); sumarAlCarrito(p, qvEstado.qty, qvEstado.v, qvEstado.c, true); }
  });
  modal.addEventListener('change', e => {
    const p = qvEstado.p;
    if (!p) return;
    if (e.target.name === 'qv-medida') {
      qvEstado.v = e.target.value;
      document.getElementById('qvPrecio').innerHTML = formatearPrecio(precioDe(p, qvEstado.v)) + (unidadDe(p) ? `<small>${unidadDe(p)}</small>` : '');
    }
    if (e.target.name === 'qv-color') qvEstado.c = e.target.value;
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); return; }
    atraparFoco(modal.querySelector('.qv__panel'), e);
  });
}

let origenCarrito = null;
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  origenCarrito = document.activeElement;
  renderCarrito();
  d.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  d.querySelector('[data-cerrar-carrito].icon-btn')?.focus();
}
function cerrarCarrito() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => {
    d.hidden = true;
    if (!document.querySelector('.qv.open, .visor.open, .main-nav.open')) document.body.classList.remove('no-scroll');
  }, reduceMotion ? 0 : 380);
  origenCarrito?.focus?.();
}

function renderCarrito() {
  const body = document.getElementById('drawerBody');
  const foot = document.getElementById('drawerFoot');
  if (!body) return;
  const items = Cart.get();
  const n = Cart.count();
  document.querySelectorAll('[data-cart-resumen]').forEach(s => { s.textContent = n ? `(${n})` : ''; });
  if (!items.length) {
    body.innerHTML = `<div class="drawer__vacio">${ICON.carrito}<b>Tu pedido está vacío</b><p>Elegí la medida en el catálogo o pedinos un presupuesto a medida.</p><a class="btn btn--cta" href="${URL_CAT}">Ver el catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map((i, k) => {
    const p = getProducto(i.id);
    if (!p) return '';
    const variante = [i.v, p.colores.length > 1 ? i.c : ''].filter(Boolean).join(' · ');
    return `<div class="linea" data-linea="${k}"><img src="${p.img}" width="880" height="1100" alt=""><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(variante)}</p>${stepperHTML(i.qty).replace('class="stepper"', 'class="stepper" data-linea-stepper')}</div><div class="linea__der"><p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p><button type="button" class="linea__quitar" data-quitar="${k}" aria-label="Quitar ${esc(p.nombre)} del pedido">Quitar</button></div></div>`;
  }).join('');
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
  const lineas = items.map(i => { const p = getProducto(i.id); return p ? `- ${i.qty} × ${p.nombre} (${[i.v, i.c].join(', ')}): ${formatearPrecio(precioDe(p, i.v) * i.qty)}` : ''; }).filter(Boolean);
  document.getElementById('pedidoWsp').href = waLink(`Hola AberturaLA, quiero consultar este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
}

function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrirCarrito));
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) { Cart.remove(Number(quitar.dataset.quitar)); return; }
    const step = e.target.closest('[data-linea-stepper] [data-step]');
    if (step) {
      const k = Number(step.closest('[data-linea]').dataset.linea);
      const it = Cart.get()[k];
      if (it) Cart.setQty(k, it.qty + Number(step.dataset.step));
    }
  }, true);
  document.getElementById('finalizarCompra')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(d.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

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

function initMedidor() {
  const form = document.getElementById('medidorForm');
  if (!form) return;
  const ancho = document.getElementById('medAncho');
  const alto = document.getElementById('medAlto');
  const error = document.getElementById('medidorError');
  const vano = document.getElementById('planoVano');
  const res = document.getElementById('medidorResultado');
  const NOMBRES = { ventana: 'una ventana', 'puerta-ventana': 'una puerta-ventana', puerta: 'una puerta', mampara: 'una mampara' };
  const dibujar = (a, h) => {
    const plano = vano.parentElement;
    const cs = window.getComputedStyle(plano);
    const W = plano.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = plano.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (W <= 0 || H <= 0) return;
    const k = Math.min(W / a, H / h);
    vano.style.aspectRatio = 'auto';
    vano.style.width = `${Math.max(24, a * k)}px`;
    vano.style.height = `${Math.max(24, h * k)}px`;
    document.getElementById('planoAncho').textContent = `${a} cm`;
    document.getElementById('planoAlto').textContent = `${h} cm`;
  };
  const leer = () => ({
    tipo: form.querySelector('input[name="tipo"]:checked')?.value || 'ventana',
    a: parseInt(ancho.value, 10),
    h: parseInt(alto.value, 10),
  });
  const valido = ({ a, h }) => a >= 30 && a <= 600 && h >= 30 && h <= 300;
  const calcular = (anunciar = false) => {
    const d = leer();
    vano.dataset.tipo = d.tipo;
    ancho.closest('.campo__input').classList.toggle('error', !(d.a >= 30 && d.a <= 600));
    alto.closest('.campo__input').classList.toggle('error', !(d.h >= 30 && d.h <= 300));
    if (!valido(d)) {
      error.hidden = false;
      error.textContent = 'Cargá un ancho entre 30 y 600 cm y un alto entre 30 y 300 cm.';
      if (anunciar) (Number.isNaN(d.a) || d.a < 30 || d.a > 600 ? ancho : alto).focus();
      return;
    }
    error.hidden = true;
    dibujar(d.a, d.h);
    const candidatos = Tienda.consultar({ filtros: { tipo: d.tipo }, limite: Tienda.TOPE }).items;
    const encontrados = [];
    candidatos.forEach(p => p.ops.forEach(o => {
      const m = medidaDe(o.v);
      if (!m) return;
      const da = d.a - m.a;
      const dh = d.h - m.h;
      if (da >= 0 && da <= 4 && dh >= 0 && dh <= 4) encontrados.push({ p, o, dif: da + dh });
    }));
    encontrados.sort((x, y) => x.dif - y.dif || x.o.precio - y.o.precio);
    encontrados.forEach(({ p }) => cacheProductos.set(p.id, p));
    const pedido = `Hola AberturaLA, necesito ${NOMBRES[d.tipo]} a medida para un vano de ${d.a} × ${d.h} cm (ancho × alto).`;
    if (encontrados.length) {
      res.innerHTML = `<p class="res__titulo">Para ${d.a} × ${d.h} cm te sirve${encontrados.length > 1 ? 'n' : ''} ${encontrados.length === 1 ? 'esta medida estándar' : `estas ${Math.min(3, encontrados.length)} medidas estándar`}</p><p class="res__sub">Con holgura para el sellado. Elegí y sumala al pedido.</p><ul class="res__lista">${encontrados.slice(0, 3).map(({ p, o }) => `<li class="res__item"><img src="${p.img}" width="880" height="1100" alt=""><div><b>${esc(p.nombre)}</b><small>${esc(o.v)} · ${formatearPrecio(o.precio)}</small></div><div class="res__acc"><button type="button" class="prod-add" data-med-add="${p.id}" data-v="${esc(o.v)}" aria-label="Agregar ${esc(p.nombre)} de ${esc(o.v)} al carrito">${ICON.carrito}<span>Agregar</span></button><button type="button" class="icon-btn" data-qv="${p.id}" data-v="${esc(o.v)}" aria-label="Ver detalle de ${esc(p.nombre)}">${ICON.ojo}</button></div></li>`).join('')}</ul><p class="res__link">¿Preferís que quede justa al vano? <a href="${waLink(pedido)}" target="_blank" rel="noopener">Pedila a medida por WhatsApp</a></p>`;
    } else {
      res.innerHTML = `<p class="res__titulo">${d.a} × ${d.h} cm no coincide con una medida estándar</p><p class="res__sub">No pasa nada: la fabricamos a la medida exacta de tu vano y te pasamos el presupuesto sin cargo.</p><div class="res__medida"><p>Te mandamos el pedido armado por WhatsApp con tipo y medidas.</p><a class="btn btn--cta" href="${waLink(pedido)}" target="_blank" rel="noopener">Pedir ${esc(NOMBRES[d.tipo])} a medida</a></div>`;
    }
  };
  let t = 0;
  form.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => calcular(false), 220); });
  form.addEventListener('change', () => calcular(false));
  form.addEventListener('submit', e => { e.preventDefault(); calcular(true); });
  res.addEventListener('click', e => {
    const b = e.target.closest('[data-med-add]');
    if (!b) return;
    const p = getProducto(b.dataset.medAdd);
    if (p) sumarAlCarrito(p, 1, b.dataset.v, p.colores[0]);
  });
  window.addEventListener('resize', () => { const d = leer(); if (valido(d)) dibujar(d.a, d.h); }, { passive: true });
  calcular(false);
}

function initGaleria() {
  const track = document.getElementById('galeriaTrack');
  const visor = document.getElementById('visor');
  if (!track) return;
  const items = [...track.querySelectorAll('[data-galeria]')];
  if (esM2) {
    const vp = document.getElementById('galeriaVp');
    const sec = vp.closest('section');
    initRailDrag(vp);
    initRailFlechas(vp, sec.querySelector('[data-galeria-prev]'), sec.querySelector('[data-galeria-next]'), () => (track.firstElementChild?.getBoundingClientRect().width || 320) + 16);
  }
  if (!visor) return;
  const img = document.getElementById('visorImg');
  let actual = 0;
  let origen = null;
  const mostrar = i => {
    actual = (i + items.length) % items.length;
    const fuente = items[actual].querySelector('img');
    img.src = fuente.getAttribute('src');
    img.alt = fuente.alt;
    document.getElementById('visorTitulo').textContent = items[actual].querySelector('.galeria__pie b').textContent;
    document.getElementById('visorDetalle').textContent = items[actual].querySelector('.galeria__pie span').textContent;
    document.getElementById('visorCuenta').textContent = `${actual + 1} / ${items.length}`;
  };
  const abrir = (i, btn) => {
    origen = btn;
    mostrar(i);
    visor.hidden = false;
    document.body.classList.add('no-scroll');
    requestAnimationFrame(() => requestAnimationFrame(() => visor.classList.add('open')));
    visor.querySelector('.visor__btn--cerrar').focus();
  };
  const cerrar = () => {
    visor.classList.remove('open');
    setTimeout(() => {
      visor.hidden = true;
      if (!document.querySelector('.qv.open, .drawer.open, .main-nav.open')) document.body.classList.remove('no-scroll');
    }, reduceMotion ? 0 : 320);
    origen?.focus();
  };
  items.forEach((b, i) => b.addEventListener('click', () => abrir(i, b)));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) cerrar();
    else if (e.target.closest('[data-visor-prev]')) mostrar(actual - 1);
    else if (e.target.closest('[data-visor-next]')) mostrar(actual + 1);
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    else atraparFoco(visor, e);
  });
}

const HORARIO = { 0: null, 1: [8, 18], 2: [8, 18], 3: [8, 18], 4: [8, 18], 5: [8, 18], 6: [8, 13] };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function ahoraAR() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia, min: (parseInt(val('hour'), 10) % 24) * 60 + parseInt(val('minute'), 10) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
function estadoHorario() {
  const { dia, min } = ahoraAR();
  const hoy = HORARIO[dia];
  if (hoy && min >= hoy[0] * 60 && min < hoy[1] * 60) return { abierto: true, dia, texto: `Abierto ahora · cerramos a las ${hoy[1]} h` };
  if (hoy && min < hoy[0] * 60) return { abierto: false, dia, texto: `Cerrado · abrimos hoy a las ${hoy[0]} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d]) return { abierto: false, dia, texto: `Cerrado · abrimos ${k === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${HORARIO[d][0]} h` };
  }
  return { abierto: false, dia, texto: 'Cerrado' };
}
function initHorario() {
  const textos = document.querySelectorAll('[data-horario-estado]');
  if (!textos.length) return;
  const pintar = () => {
    const e = estadoHorario();
    textos.forEach(t => { t.textContent = e.texto; });
    document.querySelectorAll('[data-horario-punto]').forEach(p => p.classList.toggle('abierto', e.abierto));
    document.querySelectorAll('.horario-fila').forEach(f => {
      const r = f.dataset.dia;
      f.classList.toggle('hoy', r === '1-5' ? e.dia >= 1 && e.dia <= 5 : Number(r) === e.dia);
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  let listo = false;
  const crear = () => {
    if (listo) return;
    listo = true;
    try {
      const centro = [-34.6345, -58.542];
      const mapa = L.map(el, { center: centro, zoom: 14, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
      L.circle(centro, { radius: 900, color: '#8E1F2B', weight: 1, fillColor: '#8E1F2B', fillOpacity: 0.1 }).addTo(mapa);
      L.circleMarker(centro, { radius: 7, color: '#ffffff', weight: 2, fillColor: '#8E1F2B', fillOpacity: 1 }).addTo(mapa)
        .bindTooltip('AberturaLA · Ciudadela', { permanent: true, direction: 'top', className: 'mapa-etiqueta', offset: [0, -8] });
      setTimeout(() => mapa.invalidateSize(), 1300);
    } catch {
      el.textContent = '';
    }
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      if (entries.some(en => en.isIntersecting)) { io.disconnect(); crear(); }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
  } else crear();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.regla i'), { scaleX: 0, duration: 1, stagger: 0.15, clearProps: 'transform' }, 0.45)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.cota--h i'), { scaleX: 0, duration: 1, clearProps: 'transform' }, 0.7)
    .from(hero.querySelectorAll('.cota--v i'), { scaleY: 0, duration: 1, clearProps: 'transform' }, 0.75)
    .from(hero.querySelectorAll('.cota b'), { opacity: 0, duration: 0.6 }, 0.9)
    .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return null;
  const POR_PAGINA = 16;
  const params = new URLSearchParams(location.search);
  const lista = v => (v || '').split(',').map(s => s.trim()).filter(Boolean);
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];
  const estado = {
    cat: catDe(params.get('cat')) ? params.get('cat') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.includes(params.get('orden')) ? params.get('orden') : 'destacados',
    mat: new Set(lista(params.get('mat')).filter(m => MATERIALES.includes(m))),
    col: new Set(lista(params.get('col')).filter(c => TONOS[c])),
    precio: PRECIOS.some(r => r.id === params.get('precio')) ? params.get('precio') : '',
    dvh: params.get('dvh') === '1',
  };
  let cursor = null;
  let mostrados = 0;
  const chips = document.getElementById('catChips');
  const cuerpo = document.getElementById('filtrosCuerpo');
  const q = document.getElementById('catQ');
  const orden = document.getElementById('catOrden');
  const contador = document.getElementById('catContador');
  const verMas = document.getElementById('catVerMas');
  const vacio = document.getElementById('catVacio');
  const panel = document.getElementById('filtros');
  const abrirBtn = document.getElementById('abrirFiltros');
  const nFiltros = document.getElementById('filtrosN');
  const verRes = document.getElementById('verResultados');
  q.value = estado.q;
  orden.value = estado.orden;

  const filtrosDe = () => {
    const r = PRECIOS.find(x => x.id === estado.precio);
    return { cat: estado.cat || undefined, mat: [...estado.mat], col: [...estado.col], dvh: estado.dvh, precioMin: r ? r.min : null, precioMax: r && r.max !== Infinity ? r.max : null };
  };

  const pintarChips = () => {
    chips.innerHTML = [{ id: '', nombre: 'Todo', n: Tienda.contar({}) }, ...CATEGORIAS.map(c => ({ id: c.id, nombre: c.corto, n: Tienda.contar({ cat: c.id }) }))]
      .map(c => `<li><button type="button" class="chip" data-cat="${c.id}" aria-pressed="${c.id === estado.cat}">${esc(c.nombre)} <small>${c.n}</small></button></li>`).join('');
  };

  const pintarFiltros = () => {
    const base = { cat: estado.cat || undefined };
    const grupo = (titulo, html) => `<fieldset class="f-grupo"><legend>${titulo}</legend>${html}</fieldset>`;
    const mats = MATERIALES.filter(m => Tienda.contar({ ...base, mat: [m] }) > 0);
    const tonos = Object.keys(TONOS).filter(t => Tienda.contar({ ...base, col: [t] }) > 0);
    const dvhN = Tienda.contar({ ...base, dvh: true });
    cuerpo.innerHTML = [
      grupo('Material', mats.map(m => `<label class="f-op"><input type="checkbox" data-f="mat" value="${esc(m)}"${estado.mat.has(m) ? ' checked' : ''}><span>${esc(m)}</span><small>${Tienda.contar({ ...base, mat: [m] })}</small></label>`).join('')),
      grupo('Color', `<div class="f-colores">${tonos.map(t => `<label class="f-color"><input type="checkbox" data-f="col" value="${t}"${estado.col.has(t) ? ' checked' : ''}><span><i style="background:${TONOS[t].muestra}"></i>${esc(TONOS[t].nombre)}</span></label>`).join('')}</div>`),
      grupo('Precio', [`<label class="f-op"><input type="radio" name="precio" value=""${!estado.precio ? ' checked' : ''}><span>Todos los precios</span></label>`, ...PRECIOS.map(r => `<label class="f-op"><input type="radio" name="precio" value="${r.id}"${estado.precio === r.id ? ' checked' : ''}><span>${r.nombre}</span></label>`)].join('')),
      dvhN ? grupo('Vidrio', `<label class="f-op"><input type="checkbox" data-f="dvh" value="1"${estado.dvh ? ' checked' : ''}><span>Con doble vidriado (DVH)</span><small>${dvhN}</small></label>`) : '',
    ].join('');
  };

  const actualizarURL = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', estado.cat);
    set('q', estado.q);
    set('orden', estado.orden === 'destacados' ? '' : estado.orden);
    set('mat', [...estado.mat].join(','));
    set('col', [...estado.col].join(','));
    set('precio', estado.precio);
    set('dvh', estado.dvh ? '1' : '');
    window.history.replaceState(null, '', u);
    document.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => { a.href = a.getAttribute('href').split('?')[0] + u.search; });
  };

  const actualizarCabecera = () => {
    const c = catDe(estado.cat);
    document.getElementById('cat-titulo').textContent = c ? c.nombre : 'Catálogo de aberturas y terminaciones';
    document.getElementById('catBajada').textContent = c ? `${c.det}. Si tu vano no coincide con una medida estándar, lo fabricamos a medida.` : 'Medidas estándar con precio online. Si tu vano no coincide, la fabricamos a medida.';
    const miga = document.getElementById('migaCat');
    miga.hidden = !c;
    miga.querySelector('span').textContent = c ? c.nombre : '';
    document.getElementById('catCota').textContent = `${Tienda.contar({ cat: estado.cat || undefined })} productos`;
    document.title = c ? `${c.nombre} — AberturaLA` : 'Catálogo de aberturas, mamparas y placares — AberturaLA';
    document.querySelectorAll('#navCatsLista a').forEach(a => {
      if (a.getAttribute('href').endsWith(`cat=${estado.cat}`) && estado.cat) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  const activos = () => estado.mat.size + estado.col.size + (estado.precio ? 1 : 0) + (estado.dvh ? 1 : 0);

  const render = (agregar = false) => {
    const filtros = filtrosDe();
    const res = buscarPaginado(Tienda, { q: estado.q, filtros, orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    res.items.forEach(p => cacheProductos.set(p.id, p));
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html);
    else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    if (estado.q) contador.textContent = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${estado.q}»`;
    else { const total = Tienda.contar(filtros); contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`; }
    const n = activos();
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    verRes.textContent = estado.q ? 'Ver productos' : `Ver ${Tienda.contar(filtros)} productos`;
    if (agregar && !res.items.length) showToast('No hay más productos con esa búsqueda.');
    revelarNuevos(grid);
    refrescar();
  };

  const aplicar = () => { actualizarURL(); actualizarCabecera(); render(false); };

  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    estado.cat = b.dataset.cat;
    estado.mat.clear(); estado.col.clear(); estado.dvh = false;
    pintarChips();
    pintarFiltros();
    aplicar();
  });
  cuerpo.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.f === 'mat') t.checked ? estado.mat.add(t.value) : estado.mat.delete(t.value);
    else if (t.dataset.f === 'col') t.checked ? estado.col.add(t.value) : estado.col.delete(t.value);
    else if (t.dataset.f === 'dvh') estado.dvh = t.checked;
    else if (t.name === 'precio') estado.precio = t.value;
    aplicar();
  });
  let tq = 0;
  q.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = q.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.getElementById('catBuscar').addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = q.value.trim().slice(0, 60); aplicar(); });
  orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => render(true));
  const limpiar = () => {
    estado.mat.clear(); estado.col.clear(); estado.precio = ''; estado.dvh = false; estado.q = ''; q.value = '';
    pintarFiltros();
    aplicar();
  };
  document.getElementById('limpiarFiltros').addEventListener('click', limpiar);
  document.getElementById('vacioLimpiar').addEventListener('click', limpiar);

  let bd = null;
  const esCajon = () => esM2 || window.matchMedia('(max-width: 960px)').matches;
  const abrirPanel = () => {
    if (!esCajon()) return;
    if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); bd.addEventListener('click', cerrarPanel); }
    panel.classList.add('open'); bd.classList.add('open');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
    abrirBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    document.getElementById('cerrarFiltros').focus();
  };
  function cerrarPanel() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open'); bd?.classList.remove('open');
    panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    abrirBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrirPanel);
  document.getElementById('cerrarFiltros').addEventListener('click', cerrarPanel);
  verRes.addEventListener('click', () => { cerrarPanel(); grid.scrollIntoView({ block: 'start' }); });
  panel.addEventListener('keydown', e => {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarPanel();
    else atraparFoco(panel, e);
  });

  pintarChips();
  pintarFiltros();
  actualizarURL();
  actualizarCabecera();
  render(false);
  return estado.cat;
}

let catActual = '';
if (PAGINA === 'catalogo') catActual = initCatalogo() || '';
initCategorias();
initDestacados();
initPreview();
initReveals();
initModelBarScroll();
initNav();
initMenuCategorias(catActual);
initBuscadorHeader();
initTarjetas();
initQV();
initCarrito();
initFloats();
initMedidor();
initGaleria();
initHorario();
initMapa();
initHeroMotion();
updateCartBadge();

if (PAGINA === 'catalogo') {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirQV(id, null);
}
