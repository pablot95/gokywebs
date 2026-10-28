const WA = '5493434561158';
const MARCA = 'El Guri 3';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const ICOS = {
  carniceria: '<circle cx="12.5" cy="8.5" r="2.5"/><path d="M12.5 2a6.5 6.5 0 0 0-6.22 4.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3A6.5 6.5 0 0 0 12.5 2Z"/><path d="m18.5 6 2.19 4.5a6.48 6.48 0 0 1 .31 2 6.49 6.49 0 0 1-2.6 5.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"/>',
  almacen: '<path d="m15 11-1 9"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/><path d="M4.5 15.5h15"/><path d="m5 11 4-7"/><path d="m9 11 1 9"/>',
  bebidas: '<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/>',
  lacteos: '<path d="M8 2h8"/><path d="M9 2v2.79a4 4 0 0 1-.67 2.22l-.66.98A4 4 0 0 0 7 10.21V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.79a4 4 0 0 0-.67-2.22l-.66-.98A4 4 0 0 1 15 4.79V2"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>',
  limpieza: '<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/>',
  perfumeria: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  libreria: '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.38 5.63a1 1 0 1 0-3-3l-5.02 5.01a2 2 0 0 0-.5.85l-.84 2.87a.5.5 0 0 0 .62.62l2.87-.84a2 2 0 0 0 .85-.5z"/>',
};
const icoCat = id => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICOS[id] || ''}</svg>`;

const CATEGORIAS = [
  { id: 'carniceria', nombre: 'Carnicería', bajada: 'Vacuna, pollo y cerdo por kilo', img: 'images/p-bife-ancho.webp' },
  { id: 'almacen', nombre: 'Almacén', bajada: 'Aceite, fideos, arroz y huevos', img: 'images/p-fideos.webp' },
  { id: 'bebidas', nombre: 'Bebidas', bajada: 'Agua y jugos', img: 'images/p-jugo.webp' },
  { id: 'lacteos', nombre: 'Lácteos', bajada: 'Leche y queso por kilo', img: 'images/p-leche.webp' },
  { id: 'limpieza', nombre: 'Limpieza', bajada: 'Ropa, pisos y papel', img: 'images/p-jabon-ropa.webp' },
  { id: 'perfumeria', nombre: 'Perfumería', bajada: 'Shampoo y jabón', img: 'images/p-shampoo.webp' },
  { id: 'libreria', nombre: 'Librería', bajada: 'Cuadernos y útiles', img: 'images/p-cuaderno.webp' },
];
const VENTAS = { kg: 'Por kilo', unidad: 'Por unidad' };

const PRODUCTOS = [
  {
    id: 'bife-ancho', nombre: 'Bife ancho', cat: 'carniceria', porKg: true, precio: 16900, pesos: [0.5, 1, 1.5, 2], pesoBase: 1,
    cortes: ['En bifes', 'Entero', 'Bifes finos'], porPersona: 0.3, descuento: 0, stock: 40, rango: 1, alta: 20261020,
    img: 'images/p-bife-ancho.webp', alt: 'Cuatro bifes anchos crudos con su veta de grasa en una bandeja negra',
    corto: 'Vacuno, con su veta de grasa.', tags: 'carne vacuna res bife ojo de bife parrilla plancha',
    desc: 'Corte vacuno con veta de grasa que lo mantiene jugoso. Va a la parrilla, a la plancha o a la sartén. Decinos el grosor y lo cortamos así.',
  },
  {
    id: 'pechuga', nombre: 'Pechuga de pollo', cat: 'carniceria', porKg: true, precio: 8400, pesos: [0.5, 1, 1.5, 2], pesoBase: 1,
    cortes: ['Entera', 'Fileteada', 'Para milanesa'], porPersona: 0.25, descuento: 0, stock: 40, rango: 2, alta: 20261018,
    img: 'images/p-pechuga.webp', alt: 'Tres pechugas de pollo crudas sin piel en una bandeja blanca',
    corto: 'Sin piel ni hueso.', tags: 'pollo ave suprema filet milanesa',
    desc: 'Pechuga de pollo sin piel ni hueso. Entera para el horno, fileteada para la plancha o abierta para milanesas.',
  },
  {
    id: 'aceite-girasol', nombre: 'Aceite de girasol 1,5 L', cat: 'almacen', pres: 'Botella de 1,5 L', precio: 3990, descuento: 0, stock: 24, rango: 3, alta: 20261001,
    img: 'images/p-aceite.webp', alt: 'Botella plástica de aceite de girasol de un litro y medio',
    corto: 'Para cocinar y freír.', tags: 'aceite girasol cocina freir',
    desc: 'Aceite de girasol en botella de 1,5 litros, para cocinar, freír y aderezar.',
  },
  {
    id: 'carne-picada', nombre: 'Carne picada especial', cat: 'carniceria', porKg: true, precio: 11200, pesos: [0.5, 1, 1.5, 2], pesoBase: 1,
    cortes: ['Picada una vez', 'Picada dos veces'], porPersona: 0.15, descuento: 0, stock: 40, rango: 4, alta: 20261015,
    img: 'images/p-carne-picada.webp', alt: 'Carne vacuna picada cruda en un bol de vidrio',
    corto: 'Vacuna, magra.', tags: 'carne picada vacuna hamburguesa salsa empanadas albondigas',
    desc: 'Carne vacuna magra picada en el momento. Para salsas, empanadas, albóndigas o hamburguesas caseras.',
  },
  {
    id: 'leche-entera', nombre: 'Leche entera 1 L', cat: 'lacteos', pres: 'Botella de 1 L', precio: 1650, descuento: 0, stock: 30, rango: 5, alta: 20261010,
    img: 'images/p-leche.webp', alt: 'Botella de vidrio con leche entera y tapa blanca',
    corto: 'Para el desayuno y la cocina.', tags: 'leche lacteo desayuno',
    desc: 'Leche entera de un litro, para el desayuno, el café con leche y las recetas de todos los días.',
  },
  {
    id: 'fideos-mostachol', nombre: 'Fideos mostachol 500 g', cat: 'almacen', pres: 'Paquete de 500 g', precio: 1450, descuento: 10, stock: 36, rango: 6, alta: 20261005,
    img: 'images/p-fideos.webp', alt: 'Paquete transparente de fideos mostachol secos',
    corto: 'Pasta seca de sémola.', tags: 'fideos pasta mostachol penne secos',
    desc: 'Fideos mostachol de sémola en paquete de 500 g. Rinden para cuatro platos con la salsa que más te guste.',
  },
  {
    id: 'pollo-entero', nombre: 'Pollo entero', cat: 'carniceria', porKg: true, precio: 4600, pesos: [2, 2.5, 3], pesoBase: 2.5,
    cortes: ['Entero', 'Trozado en 8', 'Mariposa'], porPersona: 0.625, descuento: 0, stock: 20, rango: 7, alta: 20261012,
    img: 'images/p-pollo-entero.webp', alt: 'Pollo entero crudo sobre una tabla de madera con romero',
    corto: 'Entero o trozado, como lo cocines.', tags: 'pollo entero ave horno parrilla trozado',
    desc: 'Pollo entero de unos 2 a 3 kg. Lo dejamos entero para el horno, trozado en ocho piezas o abierto en mariposa para la parrilla.',
  },
  {
    id: 'queso-cremoso', nombre: 'Queso cremoso', cat: 'lacteos', porKg: true, precio: 11900, pesos: [0.25, 0.5, 1], pesoBase: 0.5,
    cortes: ['En trozo', 'Feteado'], porPersona: 0, descuento: 0, stock: 20, rango: 8, alta: 20261008,
    img: 'images/p-queso.webp', alt: 'Horma rectangular de queso cremoso envuelta en film',
    corto: 'Por kilo, en trozo o feteado.', tags: 'queso cremoso lacteo pizza sandwich',
    desc: 'Queso cremoso de pasta blanda, por kilo. En trozo para la picada o feteado para sándwiches y pizzas.',
  },
  {
    id: 'chorizo', nombre: 'Chorizo puro cerdo', cat: 'carniceria', porKg: true, precio: 9400, pesos: [0.5, 1, 1.5, 2], pesoBase: 1,
    porPersona: 0.2, descuento: 0, stock: 40, rango: 9, alta: 20261016,
    img: 'images/p-chorizo.webp', alt: 'Chorizos crudos de cerdo sobre papel madera con romero y ajo',
    corto: 'Para la parrilla o el horno.', tags: 'chorizo cerdo embutido parrilla asado choripan',
    desc: 'Chorizo puro cerdo, unos cinco o seis por kilo. Para la parrilla, el horno o el choripán del fin de semana.',
  },
  {
    id: 'arroz-largo', nombre: 'Arroz largo fino 1 kg', cat: 'almacen', pres: 'Paquete de 1 kg', precio: 1890, descuento: 0, stock: 30, rango: 10, alta: 20261003,
    img: 'images/p-arroz.webp', alt: 'Paquete transparente de arroz largo fino junto a un bol de madera con arroz',
    corto: 'Grano largo, no se pasa.', tags: 'arroz grano largo fino guarnicion',
    desc: 'Arroz largo fino en paquete de un kilo. Queda suelto para guarniciones, ensaladas y arroz con pollo.',
  },
  {
    id: 'huevos', nombre: 'Huevos blancos x 12', cat: 'almacen', pres: 'Maple de 12 unidades', precio: 3200, descuento: 0, stock: 18, rango: 11, alta: 20261014,
    img: 'images/p-huevos.webp', alt: 'Maple de cartón con doce huevos blancos',
    corto: 'Docena, en maple de cartón.', tags: 'huevos docena maple',
    desc: 'Docena de huevos blancos en maple de cartón.',
  },
  {
    id: 'jugo-naranja', nombre: 'Jugo de naranja 1 L', cat: 'bebidas', pres: 'Botella de 1 L', precio: 2900, descuento: 0, stock: 14, rango: 12, alta: 20261011,
    img: 'images/p-jugo.webp', alt: 'Botella y vaso de jugo de naranja junto a naranjas cortadas',
    corto: 'Para el desayuno o la merienda.', tags: 'jugo naranja bebida desayuno',
    desc: 'Jugo de naranja en botella de un litro. Servilo frío en el desayuno o la merienda.',
  },
  {
    id: 'agua-mineral', nombre: 'Agua mineral sin gas 2 L', cat: 'bebidas', pres: 'Botella de 2 L', precio: 1300, descuento: 0, stock: 48, rango: 13, alta: 20261002,
    img: 'images/p-agua.webp', alt: 'Tres botellas plásticas de agua mineral sin gas',
    corto: 'Sin gas, botella grande.', tags: 'agua mineral sin gas bebida',
    desc: 'Agua mineral sin gas en botella de dos litros.',
  },
  {
    id: 'jabon-ropa', nombre: 'Jabón líquido para ropa 3 L', cat: 'limpieza', pres: 'Bidón de 3 L', precio: 9800, descuento: 0, stock: 4, rango: 14, alta: 20261009,
    img: 'images/p-jabon-ropa.webp', alt: 'Bidón blanco de jabón líquido para ropa con tapa azul junto a una toalla',
    corto: 'Para lavarropas y a mano.', tags: 'jabon liquido ropa lavarropas detergente',
    desc: 'Jabón líquido para ropa en bidón de 3 litros. Sirve para lavarropas automático y para lavar a mano.',
  },
  {
    id: 'lavandina', nombre: 'Lavandina 2 L', cat: 'limpieza', pres: 'Botella de 2 L', precio: 1890, descuento: 0, stock: 20, rango: 15, alta: 20261004,
    img: 'images/p-lavandina.webp', alt: 'Botella plástica amarilla de lavandina',
    corto: 'Para pisos, baño y cocina.', tags: 'lavandina cloro desinfectante pisos baño',
    desc: 'Lavandina en botella de dos litros, para desinfectar pisos, baño y cocina. Diluila en agua antes de usar.',
  },
  {
    id: 'papel-higienico', nombre: 'Papel higiénico x 4', cat: 'limpieza', pres: 'Paquete de 4 rollos', precio: 2600, descuento: 0, stock: 26, rango: 16, alta: 20261006,
    img: 'images/p-papel.webp', alt: 'Rollo de papel blanco desenrollado sobre fondo claro',
    corto: 'Paquete de cuatro rollos.', tags: 'papel higienico rollos baño',
    desc: 'Papel higiénico en paquete de cuatro rollos.',
  },
  {
    id: 'shampoo', nombre: 'Shampoo 400 ml', cat: 'perfumeria', pres: 'Frasco de 400 ml', precio: 4300, descuento: 0, stock: 12, rango: 17, alta: 20261013,
    img: 'images/p-shampoo.webp', alt: 'Frasco blanco de shampoo con tapa azul',
    corto: 'Para todo tipo de pelo.', tags: 'shampoo pelo higiene perfumeria',
    desc: 'Shampoo en frasco de 400 ml para el uso diario de toda la familia.',
  },
  {
    id: 'jabon-tocador', nombre: 'Jabón de tocador 125 g', cat: 'perfumeria', pres: 'Barra de 125 g', precio: 990, descuento: 0, stock: 30, rango: 18, alta: 20261007,
    img: 'images/p-jabon-tocador.webp', alt: 'Barra de jabón de tocador envuelta en papel blanco',
    corto: 'Barra para manos y ducha.', tags: 'jabon tocador barra higiene perfumeria',
    desc: 'Jabón de tocador en barra de 125 g, para manos y ducha.',
  },
  {
    id: 'cuaderno', nombre: 'Cuaderno espiral A4 80 hojas', cat: 'libreria', pres: 'Tapa dura, color surtido', precio: 3900, descuento: 0, stock: 15, rango: 19, alta: 20261017,
    img: 'images/p-cuaderno.webp', alt: 'Tres cuadernos con espiral de tapas azul, roja y verde con una birome y dos lápices',
    corto: 'Rayado, tapa dura.', tags: 'cuaderno espiral a4 escolar libreria utiles',
    desc: 'Cuaderno A4 de 80 hojas rayadas con espiral y tapa dura. El color de la tapa es surtido: si querés uno en especial, avisanos.',
  },
  {
    id: 'birome-lapices', nombre: 'Birome azul + 2 lápices', cat: 'libreria', pres: 'Pack de 3 útiles', precio: 1800, descuento: 0, stock: 22, rango: 20, alta: 20261019,
    img: 'images/p-biromes.webp', alt: 'Una birome azul y dos lápices negros sobre cuadernos',
    corto: 'Para la mochila o la oficina.', tags: 'birome lapiz lapices escolar libreria utiles',
    desc: 'Pack con una birome azul y dos lápices negros con goma.',
  },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const formatearPeso = kg => (kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg.toLocaleString('es-AR', { maximumFractionDigits: 2 })} kg`);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261016;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100) / 10) * 10 : p.precio);
const precioReferencia = p => precioFinal(p);
const leerOp = op => { const [peso, corte] = String(op || '').split('|'); return { peso: parseFloat(peso) || 0, corte: corte || '' }; };
const armarOp = (p, peso, corte) => (p.porKg ? `${peso}${corte ? `|${corte}` : ''}` : '');
const opPorDefecto = p => armarOp(p, p.pesoBase, p.cortes?.[0] || '');
const precioOp = (p, op) => {
  if (!p.porKg) return precioFinal(p);
  const { peso } = leerOp(op);
  return Math.round((precioFinal(p) * (peso || p.pesoBase)) / 10) * 10;
};
const textoOp = (p, op) => {
  if (!p.porKg) return p.pres || '';
  const { peso, corte } = leerOp(op);
  return [formatearPeso(peso || p.pesoBase), corte ? corte.toLowerCase() : ''].filter(Boolean).join(' · ');
};

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const referencia = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100) / 10) * 10 : p.precio);
  function coincide(p, f) {
    const cat = lista(f.cat), venta = lista(f.venta), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (venta.length && !venta.includes(p.porKg ? 'kg' : 'unidad')) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => referencia(a) - referencia(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => referencia(b) - referencia(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
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

function textoDe(p) {
  return norm([p.nombre, CATEGORIAS.find(c => c.id === p.cat)?.nombre, p.pres, p.corto, p.desc, p.tags, p.porKg ? 'por kilo kg' : 'unidad', ...(p.cortes || [])].join(' '));
}

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
      const texto = textoDe(p);
      if (palabras.every(w => texto.includes(w))) {
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
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'elguri3_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
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
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.op) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const p = getProducto(i.id);
      if (!p || p.stock <= 0) { changed = true; return false; }
      if (i.qty > p.stock) { i.qty = p.stock; changed = true; }
      return true;
    });
    if (changed) this.save(filtered);
  },
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

const WSP_ICO = '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';
const ICO_FLECHA = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICO_CARRITO = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = (p, op) => wa(`¡Hola ${MARCA}! Quiero consultar por ${p.nombre}${p.porKg ? ` (${textoOp(p, op || opPorDefecto(p))})` : ''}.`);

function precioHTML(p) {
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '';
  if (p.porKg) {
    return `<p class="precio"><span class="precio__main">${formatearPrecio(precioFinal(p))}<small>/kg</small></span>${tachado}<span class="precio__calc" data-calc>${formatearPeso(p.pesoBase)}: ${formatearPrecio(precioOp(p, opPorDefecto(p)))}</span></p>`;
  }
  return `<p class="precio"><span class="precio__main${p.descuento > 0 ? ' precio__main--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${tachado}</p>`;
}
function badgesDe(p) {
  const b = [];
  if (p.descuento > 0) b.push(['oferta', `-${p.descuento}%`]);
  if (p.stock <= 0) b.push(['sin', 'Sin stock']);
  else if (p.stock <= 5) b.push(['ultimas', 'Últimas unidades']);
  if (p.porKg) b.push(['kg', 'Por kilo']);
  else if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const fotoHTML = (p, clase, badges = true) => `<button type="button" class="${clase}" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badges ? badgesHTML(p) : ''}<img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"></button>`;
const stepperHTML = (p, valor = 1) => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${valor}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${valor >= p.stock ? ' disabled' : ''}>+</button></div>`;
const pesoSelHTML = p => `<label class="peso-sel"><span class="sr-only">Peso de ${esc(p.nombre)}</span><select data-peso>${p.pesos.map(w => `<option value="${w}"${w === p.pesoBase ? ' selected' : ''}>${formatearPeso(w)}</option>`).join('')}</select></label>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola ${MARCA}! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando llegue</a>`;
const controlHTML = p => (p.porKg ? pesoSelHTML(p) : stepperHTML(p));
const presDe = p => (p.porKg ? (p.cortes ? `Por kilo · ${p.cortes.slice(0, 2).join(' o ').toLowerCase()}` : 'Por kilo') : p.pres);

function cardV(p, anim = true) {
  const acc = p.stock > 0
    ? `<div class="prod-actions">${controlHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO_CARRITO}<span>Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard" ${anim ? ANIM_SUBIR : ''}>
    ${fotoHTML(p, 'pcard__foto')}
    <div class="pcard__body">
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}
function cardH(p) {
  return `<article class="hcard" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'hcard__foto')}
    <div class="hcard__body">
      <p class="pcard__pres">${esc(catDe(p.cat)?.nombre)} · ${esc(p.porKg ? 'por kilo' : p.pres)}</p>
      <h3 class="hcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      <div class="prod-actions">${controlHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO_CARRITO}<span>Agregar</span></button></div>
    </div>
  </article>`;
}
function filaHTML(p) {
  const acc = p.stock > 0
    ? `<div class="fila__acc">${controlHTML(p)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICO_CARRITO}<span>Agregar</span></button></div>`
    : `<div class="fila__acc fila__acc--sin">${avisameHTML(p)}</div>`;
  const estado = badgesDe(p).filter(([k]) => k !== 'kg').map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('');
  return `<article class="fila" ${ANIM_SUBIR}>
    ${fotoHTML(p, 'fila__foto', false)}
    <div class="fila__info">
      <h3 class="fila__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button>${estado}</h3>
      <p class="fila__meta">${esc(presDe(p))}</p>
    </div>
    <div class="fila__precio">${precioHTML(p)}</div>
    ${acc}
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

function syncModelosLink() {
  if (document.body.dataset.pagina !== 'catalogo') return;
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (otro) otro.href = `${document.body.dataset.modelo === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
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

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><span class="nav-drop__ico nav-drop__ico--${c.id}">${icoCat(c.id)}</span><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${Tienda.contar({ cat: c.id })}</em></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 961px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); drop.classList.add('abierto'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); drop.classList.remove('abierto'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (drop.classList.contains('abierto') ? cerrar() : abrir()));
  drop.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
  drop.addEventListener('mouseleave', () => { if (desktop.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  drop.addEventListener('focusout', e => { if (desktop.matches && !drop.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desktop.matches && !drop.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && desktop.matches && drop.classList.contains('abierto')) { cerrar(); btn.focus(); } });
}

function initCatCounts() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.closest('.chk') ? n : `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const ids = (cont.dataset.ids || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: ids.length || 3 });
  items.forEach(cachear);
  cont.innerHTML = items.map(cardH).join('');
}

function initPrevia() {
  const cont = document.querySelector('[data-previa]');
  if (!cont) return;
  const excluir = (cont.dataset.excluir || '').split(',').filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { excluir }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initLista() {
  const cont = document.querySelector('[data-lista]');
  if (!cont) return;
  const lim = parseInt(cont.dataset.limite, 10) || 8;
  const tabs = [...document.querySelectorAll('[data-lista-tab]')];
  const pie = document.querySelector('[data-lista-pie]');
  const pintar = (cat, animar) => {
    const { items } = Tienda.consultar({ filtros: cat ? { cat } : {}, orden: 'destacados', limite: lim });
    items.forEach(cachear);
    cont.innerHTML = items.map(filaHTML).join('');
    if (pie) {
      const n = Tienda.contar(cat ? { cat } : {});
      pie.href = cat ? `${paginaCatalogo()}?cat=${cat}` : paginaCatalogo();
      pie.querySelector('span').textContent = cat ? `Ver ${catDe(cat).nombre.toLowerCase()} completa (${n})` : `Ver la lista completa (${n} productos)`;
    }
    if (animar) { revelarNuevos(cont); refrescarST(); }
  };
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === t)));
    pintar(t.dataset.listaTab, true);
  }));
  pintar(tabs.find(t => t.getAttribute('aria-pressed') === 'true')?.dataset.listaTab || '', false);
}

function initMostrador() {
  const root = document.querySelector('[data-mostrador]');
  if (!root) return;
  const { items } = Tienda.consultar({ filtros: { cat: 'carniceria', stock: true }, orden: 'destacados', limite: 12 });
  const carnes = items.filter(p => p.porKg && p.porPersona > 0);
  if (!carnes.length) return;
  carnes.forEach(cachear);
  const cortesEl = root.querySelector('[data-m-cortes]');
  const foto = root.querySelector('[data-m-foto]');
  const prepWrap = root.querySelector('[data-m-prep-wrap]');
  const prepEl = root.querySelector('[data-m-prep]');
  const personasOut = root.querySelector('[data-m-personas]');
  const pesoOut = root.querySelector('[data-m-peso]');
  const sugeridoEl = root.querySelector('[data-m-sugerido]');
  const ticket = root.querySelector('[data-ticket]');
  const t = k => root.querySelector(`[data-t-${k}]`);
  const estado = { id: carnes[0].id, personas: 4, peso: 0, prep: carnes[0].cortes?.[0] || '', manual: false };
  const actual = () => carnes.find(p => p.id === estado.id);
  const sugerido = p => Math.max(0.5, Math.ceil((estado.personas * p.porPersona) / 0.25 - 1e-9) * 0.25);

  cortesEl.innerHTML = carnes.map(p => `<button type="button" class="pill" data-m-corte="${p.id}" aria-pressed="${p.id === estado.id}">${esc(p.nombre)}</button>`).join('');

  const pintar = (cambioCorte = false) => {
    const p = actual();
    if (!estado.manual) estado.peso = sugerido(p);
    if (cambioCorte) {
      foto.src = p.img;
      foto.alt = p.alt;
      cortesEl.querySelectorAll('[data-m-corte]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mCorte === p.id)));
      if (!p.cortes?.includes(estado.prep)) estado.prep = p.cortes?.[0] || '';
      prepWrap.hidden = !p.cortes?.length;
      prepEl.innerHTML = (p.cortes || []).map(c => `<button type="button" class="pill pill--chica" data-m-prep="${esc(c)}" aria-pressed="${c === estado.prep}">${esc(c)}</button>`).join('');
    }
    personasOut.textContent = estado.personas;
    pesoOut.textContent = formatearPeso(estado.peso);
    const sug = sugerido(p);
    sugeridoEl.textContent = estado.manual && sug !== estado.peso ? `Sugerido para ${estado.personas}: ${formatearPeso(sug)}` : `Calculamos ${Math.round(p.porPersona * 1000)} g por persona`;
    root.querySelector('[data-m-personas-menos]').disabled = estado.personas <= 1;
    root.querySelector('[data-m-personas-mas]').disabled = estado.personas >= 20;
    root.querySelector('[data-m-peso-menos]').disabled = estado.peso <= 0.25;
    root.querySelector('[data-m-peso-mas]').disabled = estado.peso >= 10;
    const op = armarOp(p, estado.peso, estado.prep);
    t('nombre').textContent = p.nombre;
    t('prep').textContent = estado.prep || 'Como sale';
    t('peso').textContent = `${estado.peso.toLocaleString('es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} kg`;
    t('kg').textContent = formatearPrecio(precioFinal(p));
    t('total').textContent = formatearPrecio(precioOp(p, op));
    t('para').textContent = `${estado.personas} ${estado.personas === 1 ? 'persona' : 'personas'}`;
    ticket.classList.remove('ticket--impreso');
    void ticket.offsetWidth;
    ticket.classList.add('ticket--impreso');
  };

  root.addEventListener('click', e => {
    const corte = e.target.closest('[data-m-corte]');
    if (corte) { estado.id = corte.dataset.mCorte; estado.manual = false; pintar(true); return; }
    const prep = e.target.closest('[data-m-prep]');
    if (prep) {
      estado.prep = prep.dataset.mPrep;
      prepEl.querySelectorAll('[data-m-prep]').forEach(b => b.setAttribute('aria-pressed', String(b === prep)));
      pintar();
      return;
    }
    if (e.target.closest('[data-m-personas-menos]')) { estado.personas = Math.max(1, estado.personas - 1); estado.manual = false; pintar(); return; }
    if (e.target.closest('[data-m-personas-mas]')) { estado.personas = Math.min(20, estado.personas + 1); estado.manual = false; pintar(); return; }
    if (e.target.closest('[data-m-peso-menos]')) { estado.peso = Math.max(0.25, +(estado.peso - 0.25).toFixed(2)); estado.manual = true; pintar(); return; }
    if (e.target.closest('[data-m-peso-mas]')) { estado.peso = Math.min(10, +(estado.peso + 0.25).toFixed(2)); estado.manual = true; pintar(); return; }
    if (e.target.closest('[data-m-add]')) {
      const p = actual();
      const op = armarOp(p, estado.peso, estado.prep);
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre} (${textoOp(p, op)}) al carrito`);
    }
  });
  pintar(true);
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const grid = root.querySelector('[data-grid]');
  const vacio = root.querySelector('[data-vacio]');
  const verMas = root.querySelector('[data-ver-mas]');
  const contador = root.querySelector('[data-contador]');
  const input = document.getElementById('catQ');
  const formQ = root.querySelector('[data-cat-buscar]');
  const selOrden = root.querySelector('[data-orden]');
  const filtrosEl = document.getElementById('filtros');
  const fondo = document.querySelector('[data-filtros-fondo]');
  const cuentaRes = document.querySelector('[data-cuenta-res]');
  const nFiltros = document.querySelector('[data-n-filtros]');
  const migaCat = document.querySelector('[data-miga-cat]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const chips = [...document.querySelectorAll('[data-chip-cat]')];
  const vistas = [...root.querySelectorAll('[data-vista]')];
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), venta: Object.keys(VENTAS) };
  const vistaInicial = root.dataset.vistaInicial === 'lista' ? 'lista' : 'fotos';
  const tituloBase = titulo?.textContent || 'Todos los productos';
  const bajadaBase = bajada?.textContent || '';
  const estado = { cat: [], venta: [], oferta: false, stock: false, q: '', orden: 'destacados', vista: vistaInicial };
  let cursor = null;
  let mostrados = 0;

  const u = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((u.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.venta = listaURL('venta');
  estado.oferta = u.get('oferta') === '1';
  estado.stock = u.get('stock') === '1';
  estado.q = (u.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(u.get('orden')) ? u.get('orden') : 'destacados';
  if (['fotos', 'lista'].includes(u.get('vista'))) estado.vista = u.get('vista');

  const filtrosDe = () => ({ cat: estado.cat, venta: estado.venta, oferta: estado.oferta, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.venta.length) p.set('venta', estado.venta.join(','));
    if (estado.oferta) p.set('oferta', '1');
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    if (estado.vista !== vistaInicial) p.set('vista', estado.vista);
    const prod = new URLSearchParams(location.search).get('producto');
    if (prod) p.set('producto', prod);
    const s = p.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', s ? `?${s}` : location.pathname);
    syncModelosLink();
  };
  const sincronizarUI = () => {
    document.querySelectorAll('#filtros input[data-f]').forEach(i => {
      const f = i.dataset.f;
      i.checked = f === 'oferta' || f === 'stock' ? estado[f] : estado[f].includes(i.value);
    });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    vistas.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === estado.vista)));
    grid.classList.toggle('es-lista', estado.vista === 'lista');
    const n = estado.cat.length + estado.venta.length + (estado.oferta ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    const una = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    if (una) {
      migaCat.hidden = false;
      migaCat.textContent = una.nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
    if (titulo) titulo.textContent = una ? una.nombre : estado.oferta ? 'Ofertas' : tituloBase;
    if (bajada) bajada.textContent = una ? `${una.bajada}.` : bajadaBase;
    document.title = `${una ? una.nombre : estado.oferta ? 'Ofertas' : 'Catálogo'} — ${MARCA}`;
    chips.forEach(ch => {
      const id = ch.dataset.chipCat;
      const on = id ? estado.cat.length === 1 && estado.cat[0] === id : !estado.cat.length;
      if (on) ch.setAttribute('aria-current', 'page'); else ch.removeAttribute('aria-current');
    });
    document.querySelectorAll('.nav-drop__panel li a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (una && id === una.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (estado.vista === 'lista' ? filaHTML(p) : cardV(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregar ? mostrados + res.items.length : res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) {
      contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'producto' : 'productos'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      cuentaRes.textContent = mostrados + (cursor ? '+' : '');
    } else {
      const total = Tienda.contar(filtrosDe());
      contador.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : '';
      cuentaRes.textContent = total;
    }
    revelarNuevos(grid);
    refrescarST();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtrosEl.addEventListener('change', e => {
    const i = e.target;
    const f = i.dataset.f;
    if (!f) return;
    if (f === 'oferta' || f === 'stock') estado[f] = i.checked;
    else {
      const set = new Set(estado[f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[f] = [...set];
    }
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], venta: [], oferta: false, stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  chips.forEach(ch => ch.addEventListener('click', e => {
    e.preventDefault();
    estado.cat = ch.dataset.chipCat ? [ch.dataset.chipCat] : [];
    aplicar();
  }));
  document.addEventListener('click', e => {
    const a = e.target.closest('.nav-drop__panel a, a[data-ir-catalogo]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (!url.pathname.endsWith(paginaCatalogo())) return;
    e.preventDefault();
    const cat = url.searchParams.get('cat');
    estado.cat = cat && VALIDOS.cat.includes(cat) ? [cat] : [];
    estado.oferta = url.searchParams.get('oferta') === '1';
    estado.venta = []; estado.stock = false; estado.q = ''; input.value = '';
    document.querySelector('[data-nav-drop]')?.classList.remove('abierto');
    document.querySelector('.nav-drop__btn')?.setAttribute('aria-expanded', 'false');
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelectorAll('.header-buscar').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const v = f.querySelector('input')?.value || '';
    input.value = v;
    estado.q = v.trim().slice(0, 60);
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  vistas.forEach(b => b.addEventListener('click', () => { if (estado.vista === b.dataset.vista) return; estado.vista = b.dataset.vista; aplicar(); }));
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    fondo.hidden = true;
    document.body.classList.remove('no-scroll');
    volverFiltros?.focus?.();
  };
  document.querySelectorAll('[data-filtros-abrir]').forEach(b => b.addEventListener('click', abrirFiltros));
  document.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarFiltros));
  fondo.addEventListener('click', cerrarFiltros);
  document.addEventListener('keydown', e => {
    if (!filtrosEl.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarFiltros();
    else atraparFoco(filtrosEl, e);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) cerrarFiltros(); });

  sincronizarUI();
  escribirURL();
  pintar();
  if (u.has('q')) input.focus({ preventScroll: true });
}

function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function lineaHTML(item, p, mini) {
  const op = item.op || '';
  return `<div class="linea${mini ? ' linea--mini' : ''}">
    ${mini ? '' : `<div class="linea__foto"><img src="${p.img}" alt="" width="900" height="900"></div>`}
    <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(textoOp(p, op))} · ${formatearPrecio(precioOp(p, op))} c/u</p></div>
    <p class="linea__precio">${formatearPrecio(precioOp(p, op) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${p.id}" data-op="${esc(op)}"><button type="button" data-linea-step="-1" data-id="${p.id}" data-op="${esc(op)}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${p.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${p.id}" data-op="${esc(op)}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= p.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${p.id}" data-op="${esc(op)}">Quitar</button></div>
  </div>`;
}

function mensajePedido() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  if (!items.length) return wa(`¡Hola ${MARCA}! Quiero hacer un pedido.`);
  const lineas = items.map(({ i, p }) => `• ${i.qty} × ${p.nombre} (${textoOp(p, i.op)}) — ${formatearPrecio(precioOp(p, i.op) * i.qty)}`);
  const hayKg = items.some(({ p }) => p.porKg);
  return wa(`¡Hola ${MARCA}! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${hayKg ? '\n(La carne se pesa al prepararla: me confirman el total.)' : ''}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => ({ i, p: getProducto(i.id) })).filter(x => x.p);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas], [data-pedido-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"][data-op="${CSS.escape(activo.dataset.op || '')}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const total = formatearPrecio(Cart.total());
  const vacio = !items.length;
  const hayKg = items.some(({ p }) => p.porKg);
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICOS.almacen}</svg><p>Tu carrito está vacío</p><small>Sumá carne por kilo y lo del almacén: acá se arma el pedido.</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p }) => lineaHTML(i, p, false)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  const pedido = document.querySelector('[data-pedido-lineas]');
  if (pedido) {
    pedido.innerHTML = vacio
      ? '<p class="pedido__vacio">Todavía no sumaste nada. Tocá «Agregar» en la lista y el pedido se arma acá.</p>'
      : items.map(({ i, p }) => lineaHTML(i, p, true)).join('');
  }
  document.querySelectorAll('[data-nota-kg]').forEach(el => { el.hidden = !hayKg; });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  document.querySelectorAll('[data-finalizar]').forEach(b => { b.disabled = vacio; });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp], [data-pedido-wsp]').forEach(a => { a.href = msg; });
  if (selector && enLineas) {
    const cont = document.querySelector(enLineas.hasAttribute('data-drawer-lineas') ? '[data-drawer-lineas]' : '[data-pedido-lineas]');
    (cont.querySelector(selector) || cont.querySelector('button:not([disabled])'))?.focus();
  }
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

let drawerVolver = null;
let drawerTimer = 0;
function openCartDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d) return;
  cerrarQV(false);
  clearTimeout(drawerTimer);
  if (d.hidden || !d.classList.contains('abierto')) drawerVolver = document.activeElement;
  renderCarrito();
  d.hidden = false; f.hidden = false;
  void d.offsetWidth;
  d.classList.add('abierto'); f.classList.add('abierto');
  document.body.classList.add('no-scroll');
  d.querySelector('.drawer__cerrar')?.focus();
}
function cerrarDrawer() {
  const d = document.getElementById('drawer');
  const f = document.querySelector('.drawer-fondo');
  if (!d || d.hidden) return;
  d.classList.remove('abierto'); f.classList.remove('abierto');
  drawerTimer = setTimeout(() => { d.hidden = true; f.hidden = true; }, reduceMotion ? 0 : 380);
  document.body.classList.remove('no-scroll');
  if (drawerVolver && document.contains(drawerVolver)) drawerVolver.focus();
}

const QV = { p: null, peso: 0, corte: '' };
let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const op = armarOp(p, QV.peso, QV.corte);
  const precios = p.porKg
    ? `<dl class="qv__precios"><div><dt>Precio por kilo</dt><dd>${formatearPrecio(precioFinal(p))}</dd></div><div><dt data-qv-peso-txt>${esc(formatearPeso(QV.peso))}</dt><dd data-qv-total>${formatearPrecio(precioOp(p, op))}</dd></div></dl>`
    : `<dl class="qv__precios"><div><dt>${esc(p.pres)}</dt><dd>${formatearPrecio(precioFinal(p))}${p.descuento > 0 ? ` <s>${formatearPrecio(p.precio)}</s>` : ''}</dd></div></dl>`;
  const opciones = p.porKg
    ? `<div class="qv__grupo"><p class="qv__label">Peso</p><div class="qv__ops" role="group" aria-label="Elegí el peso">${p.pesos.map(w => `<button type="button" class="pill pill--chica" data-qv-peso="${w}" aria-pressed="${w === QV.peso}">${formatearPeso(w)}</button>`).join('')}</div></div>
       ${p.cortes ? `<div class="qv__grupo"><p class="qv__label">¿Cómo lo querés?</p><div class="qv__ops" role="group" aria-label="Elegí cómo lo querés">${p.cortes.map(c => `<button type="button" class="pill pill--chica" data-qv-corte="${esc(c)}" aria-pressed="${c === QV.corte}">${esc(c)}</button>`).join('')}</div></div>` : ''}
       <p class="qv__nota">Al pesarlo te confirmamos el total exacto por WhatsApp.</p>`
    : '';
  const comprar = p.stock > 0
    ? `<div class="qv__comprar">${stepperHTML(p)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}" data-qv-add>${ICO_CARRITO}<span>Agregar al carrito</span></button><button type="button" class="btn btn--line" data-buy="${p.id}" data-qv-add>Comprar ahora</button></div>${p.stock <= 5 ? `<p class="qv__stock">Quedan ${p.stock} unidades</p>` : ''}`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<figure class="qv__foto"><img src="${p.img}" alt="${esc(p.alt)}" width="900" height="900"></figure>
  <div class="qv__info">
    <p class="pcard__pres">${esc(cat?.nombre)}${p.porKg ? ' · por kilo' : ` · ${esc(p.pres)}`}</p>
    <h2>${esc(p.nombre)}</h2>
    ${precios}
    <p class="qv__desc">${esc(p.desc)}</p>
    ${opciones}
    ${comprar}
    <a class="link-wsp" data-qv-wsp href="${waConsulta(p, op)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${r.img}" alt="" width="900" height="900"></span><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioFinal(r))}${r.porKg ? '/kg' : ''}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function actualizarQV() {
  const p = QV.p;
  const qv = document.getElementById('qv');
  if (!p || !qv || !p.porKg) return;
  const op = armarOp(p, QV.peso, QV.corte);
  qv.querySelectorAll('[data-qv-peso]').forEach(b => b.setAttribute('aria-pressed', String(parseFloat(b.dataset.qvPeso) === QV.peso)));
  qv.querySelectorAll('[data-qv-corte]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvCorte === QV.corte)));
  const txt = qv.querySelector('[data-qv-peso-txt]');
  const tot = qv.querySelector('[data-qv-total]');
  if (txt) txt.textContent = formatearPeso(QV.peso);
  if (tot) tot.textContent = formatearPrecio(precioOp(p, op));
  const w = qv.querySelector('[data-qv-wsp]');
  if (w) w.href = waConsulta(p, op);
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  QV.p = p; QV.peso = p.pesoBase || 0; QV.corte = p.cortes?.[0] || '';
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  const ld = document.getElementById('ldProducto');
  if (ld) {
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href, description: p.desc,
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
    });
  }
  clearTimeout(qvTimer);
  if (qv.hidden || !qv.classList.contains('abierto')) {
    qvVolver = origen || document.activeElement;
    qv.hidden = false;
    void qv.offsetWidth;
    qv.classList.add('abierto');
    document.body.classList.add('no-scroll');
  }
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__cerrar').focus();
  if (document.body.dataset.pagina === 'catalogo') {
    const url = new URL(location.href); url.searchParams.set('producto', p.id); window.history.replaceState(null, '', url);
    syncModelosLink();
  }
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  if (document.body.dataset.pagina === 'catalogo') {
    const url = new URL(location.href); url.searchParams.delete('producto'); window.history.replaceState(null, '', url);
    syncModelosLink();
  }
  if (devolver && qvVolver && document.contains(qvVolver)) qvVolver.focus();
}

function syncStepper(st) {
  if (!st) return 1;
  const inp = st.querySelector('input');
  const max = parseInt(inp.max, 10) || 99;
  const v = Math.max(1, Math.min(parseInt(inp.value, 10) || 1, max));
  inp.value = v;
  const [menos, mas] = st.querySelectorAll('button');
  menos.disabled = v <= 1;
  mas.disabled = v >= max;
  return v;
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar], [data-qv-peso], [data-qv-corte]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-qv-peso]')) { QV.peso = parseFloat(t.dataset.qvPeso); actualizarQV(); return; }
    if (t.matches('[data-qv-corte]')) { QV.corte = t.dataset.qvCorte; actualizarQV(); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const op = t.dataset.op || '';
      const it = Cart.get().find(i => i.id === t.dataset.id && (i.op || '') === op);
      if (it) Cart.setQty(it.id, op, it.qty + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const p = getProducto(t.dataset.quitar);
      Cart.remove(t.dataset.quitar, t.dataset.op || '');
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || p.stock <= 0) return;
    const caja = t.closest('.pcard, .hcard, .fila, .qv__info');
    const st = caja?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    let op = '';
    if (p.porKg) {
      if (t.hasAttribute('data-qv-add')) op = armarOp(p, QV.peso, QV.corte);
      else {
        const peso = parseFloat(caja?.querySelector('[data-peso]')?.value) || p.pesoBase;
        op = armarOp(p, peso, p.cortes?.[0] || '');
      }
    }
    const enCarrito = Cart.get().find(i => i.id === p.id && (i.op || '') === op)?.qty || 0;
    if (enCarrito >= p.stock) { showToast(`Ya tenés todo el stock de ${p.nombre} en el carrito`); return; }
    Cart.add(p, qty, op);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${qty > 1 ? `${qty} × ` : ''}${p.nombre}${p.porKg ? ` (${textoOp(p, op)})` : ''} al carrito`);
    t.classList.add('is-ok');
    setTimeout(() => t.classList.remove('is-ok'), 700);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-peso]');
    if (sel) {
      const caja = sel.closest('.pcard, .hcard, .fila');
      const p = getProducto(caja?.querySelector('[data-add]')?.dataset.add);
      const calc = caja?.querySelector('[data-calc]');
      if (p && calc) {
        const peso = parseFloat(sel.value) || p.pesoBase;
        calc.textContent = `${formatearPeso(peso)}: ${formatearPrecio(precioOp(p, armarOp(p, peso)))}`;
      }
      return;
    }
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) Cart.setQty(st.dataset.linea, st.dataset.op || '', v);
  });
  document.addEventListener('keydown', e => {
    const qv = document.getElementById('qv');
    const d = document.getElementById('drawer');
    if (qv && !qv.hidden && qv.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarQV(); else atraparFoco(qv.querySelector('.qv__panel'), e);
    } else if (d && !d.hidden && d.classList.contains('abierto')) {
      if (e.key === 'Escape') cerrarDrawer(); else atraparFoco(d, e);
    }
  });
  document.addEventListener('cart:updated', () => { updateCartBadge(); renderCarrito(); });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { img.style.translate = `0 ${((self.progress - 0.5) * 8).toFixed(2)}%`; },
    });
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero-datos li', { y: 14, opacity: 0, duration: 0.8, stagger: 0.08, clearProps: 'transform,opacity' }, 0.7);
  paso('.hero-etiqueta-wrap', { y: -28, opacity: 0, duration: 1, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.85);
}

function pintarPrecios() {
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.textContent = formatearPrecio(precioFinal(p));
  });
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => abrirProducto(id), 80);
}

Cart.syncStock();
[initCatCounts, pintarPrecios, initNavDrop, initDestacados, initPrevia, initLista, initMostrador, initCatalogo, renderCarrito, initReveals, initNav,
  initModelBarScroll, syncModelosLink, initFloats, updateCartBadge, initDelegacion, initHeroMotion, initParallax, abrirDesdeURL]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
