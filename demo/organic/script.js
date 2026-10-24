const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WA = '5492617228993';

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const CATEGORIAS = [
  { id: 'frutos-secos', nombre: 'Frutos secos', img: 'images/cat-frutos-secos-160.webp' },
  { id: 'frutas-desecadas', nombre: 'Frutas desecadas', img: 'images/cat-frutas-desecadas-160.webp' },
  { id: 'aceites', nombre: 'Aceites', img: 'images/cat-aceites-160.webp' },
  { id: 'mieles', nombre: 'Mieles y dulces', img: 'images/cat-mieles-160.webp' },
  { id: 'condimentos', nombre: 'Especias y condimentos', img: 'images/cat-condimentos-160.webp' },
  { id: 'conservas', nombre: 'Conservas', img: 'images/cat-conservas-160.webp' },
  { id: 'vinos', nombre: 'Vinos', img: 'images/cat-vinos-160.webp' },
  { id: 'granos', nombre: 'Granos y semillas', img: 'images/cat-granos-160.webp' },
];
const FORMATOS = { peso: 'Por peso', envasado: 'Envasado' };
const PRECIOS = { 'hasta-5': [0, 5000], '5-10': [5001, 10000], '10-20': [10001, 20000], 'mas-20': [20001, Infinity] };
const ORIGENES = ['Instagram', 'Google', 'Me lo recomendaron', 'Pasé por el local', 'Una publicidad', 'Otro'];

const g = (id, nombre, gramos, precio, stock) => ({ id, nombre, g: gramos, precio, stock });
const ml = (id, nombre, mililitros, precio, stock) => ({ id, nombre, ml: mililitros, precio, stock });
const u = (id, nombre, precio, stock) => ({ id, nombre, precio, stock });
const CONSERVAR = ['Conservación', 'En frasco cerrado, en un lugar fresco y seco'];

const PRODUCTOS = [
  { id: 'almendras', nombre: 'Almendras', cat: 'frutos-secos', formato: 'peso', vars: [g('250', '250 g', 250, 9900, 30), g('500', '500 g', 500, 18900, 20), g('1000', '1 kg', 1000, 35900, 12)], descuento: 0, rango: 1, alta: 20261001, img: 'p-almendras', alt: 'Bowl de cerámica lleno de almendras, con algunas sueltas sobre una mesa de madera', corto: 'Enteras · Para picar o cocinar', desc: 'Almendras enteras, sin cáscara. Van solas como colación, en la granola del desayuno o picadas en budines y ensaladas.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Colaciones, granola y repostería'], CONSERVAR] },
  { id: 'nueces', nombre: 'Nueces mariposa', cat: 'frutos-secos', formato: 'peso', vars: [g('250', '250 g', 250, 8900, 25), g('500', '500 g', 500, 16900, 18), g('1000', '1 kg', 1000, 31900, 10)], descuento: 0, rango: 2, alta: 20261003, img: 'p-nueces', alt: 'Bowl con nueces peladas en mitades y dos nueces sueltas sobre la mesa de madera', corto: 'Mitades enteras, sin cáscara', desc: 'Nueces peladas en mitades enteras (mariposa). Para el desayuno, ensaladas, budines o para tener a mano en la alacena.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Desayunos, ensaladas y budines'], CONSERVAR] },
  { id: 'mix-frutos-secos', nombre: 'Mix de frutos secos', cat: 'frutos-secos', formato: 'peso', vars: [g('250', '250 g', 250, 8500, 22), g('500', '500 g', 500, 16200, 15), g('1000', '1 kg', 1000, 30900, 8)], descuento: 10, rango: 3, alta: 20261012, img: 'p-mix-frutos-secos', alt: 'Bowls de nueces, almendras y avellanas sobre una mesa de madera', corto: 'Almendras, nueces y avellanas', desc: 'Almendras, nueces y avellanas mezcladas en partes parecidas. Para picar entre comidas o sumar a la avena y al yogur.', ficha: [['Incluye', 'Almendras, nueces y avellanas'], ['Presentación', '250 g, 500 g o 1 kg'], CONSERVAR] },
  { id: 'miel', nombre: 'Miel pura de abejas', cat: 'mieles', formato: 'envasado', vars: [u('500', '500 g', 8900, 16), u('1000', '1 kg', 15900, 9)], descuento: 0, rango: 4, alta: 20260920, img: 'p-miel', alt: 'Frasco de vidrio con miel dorada y tapa metálica, con un cucharón de madera chorreando miel', corto: 'Frasco de vidrio · 500 g o 1 kg', desc: 'Miel pura en frasco de vidrio. Para endulzar el té, untar tostadas o usar en aderezos y marinadas.', ficha: [['Presentación', 'Frasco de 500 g o de 1 kg'], ['Uso', 'Infusiones, tostadas y aderezos'], ['Conservación', 'A temperatura ambiente; si se cristaliza, a baño María']] },
  { id: 'aceite-oliva', nombre: 'Aceite de oliva extra virgen', cat: 'aceites', formato: 'envasado', vars: [ml('500', '500 ml', 500, 13900, 18), ml('1000', '1 L', 1000, 24900, 10), ml('5000', 'Bidón 5 L', 5000, 109000, 4)], descuento: 0, rango: 5, alta: 20260925, img: 'p-aceite-oliva', alt: 'Botella de vidrio verde de aceite de oliva junto a un cuenco con aceite, ramas de olivo y aceitunas', corto: 'Botella de vidrio o bidón', desc: 'Aceite de oliva extra virgen en botella de vidrio oscuro. En crudo sobre ensaladas y verduras, o para cocinar. El bidón de 5 L conviene para la casa o el comercio.', ficha: [['Presentación', 'Botella de 500 ml o 1 L, bidón de 5 L'], ['Uso', 'En crudo o para cocinar'], ['Conservación', 'Lejos de la luz y del calor']] },
  { id: 'vegetales-asados', nombre: 'Vegetales asados en aceite', cat: 'conservas', formato: 'envasado', vars: [u('360', 'Frasco 360 g', 7900, 14)], descuento: 0, rango: 6, alta: 20261015, img: 'p-vegetales-asados', alt: 'Frasco de vidrio con morrones, berenjenas y zucchini asados en aceite, rodeado de verduras frescas', corto: 'Morrón, berenjena y zucchini', desc: 'Morrones, berenjenas y zucchini asados, conservados en aceite. Para una picada, una pasta rápida o un sándwich.', ficha: [['Presentación', 'Frasco de vidrio de 360 g'], ['Ideal para', 'Picadas, pastas y sándwiches'], ['Conservación', 'Una vez abierto, en la heladera']] },
  { id: 'trio-especias', nombre: 'Trío de especias en frasco', cat: 'condimentos', formato: 'envasado', vars: [u('trio', '3 frascos de vidrio', 11900, 6)], descuento: 0, rango: 7, alta: 20261018, img: 'p-trio-especias', alt: 'Tres frascos de vidrio con tapa de madera: pimentón, cúrcuma y orégano', corto: 'Pimentón, cúrcuma y orégano', desc: 'Tres frascos de vidrio con tapa de madera: pimentón dulce, cúrcuma y orégano. Quedan lindos en la mesada y también son un buen regalo.', ficha: [['Incluye', 'Pimentón dulce, cúrcuma y orégano'], ['Presentación', '3 frascos de vidrio con tapa de madera'], ['Ideal para', 'Tu cocina o para regalar']] },
  { id: 'mix-desecadas', nombre: 'Mix de frutas desecadas', cat: 'frutas-desecadas', formato: 'peso', vars: [g('250', '250 g', 250, 7900, 20), g('500', '500 g', 500, 14900, 12), g('1000', '1 kg', 1000, 28500, 6)], descuento: 0, rango: 8, alta: 20261008, img: 'p-mix-desecadas', alt: 'Bowl de cerámica con orejones, dátiles y pasas de uva', corto: 'Orejones, dátiles y pasas', desc: 'Orejones de durazno, dátiles y pasas de uva. Para el desayuno, para picar o para sumar a la granola casera.', ficha: [['Incluye', 'Orejones, dátiles y pasas de uva'], ['Presentación', '250 g, 500 g o 1 kg'], CONSERVAR] },
  { id: 'vino-malbec', nombre: 'Vino tinto Malbec', cat: 'vinos', formato: 'envasado', vars: [u('botella', '750 ml', 11900, 24), u('caja', 'Caja x 6', 69900, 5)], descuento: 0, rango: 9, alta: 20261010, img: 'p-malbec', alt: 'Botella de vino tinto sin etiqueta junto a una copa servida sobre una mesa de madera', corto: 'Botella o caja de 6', desc: 'Malbec para acompañar carnes, pastas o una picada. Lo llevás por botella o por caja de 6.', ficha: [['Presentación', 'Botella de 750 ml o caja de 6'], ['Va con', 'Carnes, pastas y quesos'], ['Venta', 'Solo para mayores de 18 años']] },
  { id: 'castanas-caju', nombre: 'Castañas de cajú', cat: 'frutos-secos', formato: 'peso', vars: [g('250', '250 g', 250, 11900, 14), g('500', '500 g', 500, 22900, 9), g('1000', '1 kg', 1000, 43900, 4)], descuento: 0, rango: 10, alta: 20261019, img: 'p-castanas-caju', alt: 'Castañas de cajú enteras en un bowl blanco', corto: 'Enteras, sin sal', desc: 'Castañas de cajú enteras, sin sal. Para picar, para salteados o para hacer leche y cremas vegetales.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Colaciones, salteados y cremas'], CONSERVAR] },
  { id: 'avellanas', nombre: 'Avellanas', cat: 'frutos-secos', formato: 'peso', vars: [g('250', '250 g', 250, 10900, 16), g('500', '500 g', 500, 20900, 7), g('1000', '1 kg', 1000, 39900, 0)], descuento: 0, rango: 11, alta: 20260915, img: 'p-avellanas', alt: 'Bowl de cerámica con avellanas enteras y algunas sueltas sobre la mesa', corto: 'Enteras, con su piel', desc: 'Avellanas enteras, sin cáscara. Para picar, tostar y sumar a postres o a una crema casera.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Colaciones y repostería'], CONSERVAR] },
  { id: 'chia', nombre: 'Semillas de chía', cat: 'granos', formato: 'peso', vars: [g('250', '250 g', 250, 3900, 30), g('500', '500 g', 500, 7200, 20), g('1000', '1 kg', 1000, 13500, 10)], descuento: 0, rango: 12, alta: 20260910, img: 'p-chia', alt: 'Fuente blanca con semillas de chía sobre una mesa de madera clara', corto: 'Para el yogur o el pudín', desc: 'Semillas de chía para sumar al yogur, a la avena o a un pudín. También se usan en panes y galletitas caseras.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Desayunos, pudines y panes'], CONSERVAR] },
  { id: 'pimenton', nombre: 'Pimentón dulce', cat: 'condimentos', formato: 'peso', vars: [g('100', '100 g', 100, 2900, 25), g('250', '250 g', 250, 6500, 12)], descuento: 0, rango: 13, alta: 20260905, img: 'p-pimenton', alt: 'Frasco de vidrio con tapa de madera lleno de pimentón dulce', corto: 'Molido · Color y sabor', desc: 'Pimentón dulce molido, para el guiso, las papas al horno, el adobo o la salsa criolla.', ficha: [['Presentación', '100 g o 250 g'], ['Ideal para', 'Guisos, adobos y verduras al horno'], CONSERVAR] },
  { id: 'curcuma', nombre: 'Cúrcuma en polvo', cat: 'condimentos', formato: 'peso', vars: [g('100', '100 g', 100, 3200, 20), g('250', '250 g', 250, 7200, 10)], descuento: 0, rango: 14, alta: 20261014, img: 'p-curcuma', alt: 'Frasco de vidrio con tapa de madera lleno de cúrcuma en polvo', corto: 'Molida · Para arroces y currys', desc: 'Cúrcuma molida, de color intenso. Para arroces, currys, sopas y verduras salteadas.', ficha: [['Presentación', '100 g o 250 g'], ['Ideal para', 'Arroces, currys y sopas'], CONSERVAR] },
  { id: 'oregano', nombre: 'Orégano', cat: 'condimentos', formato: 'peso', vars: [g('50', '50 g', 50, 1900, 30), g('100', '100 g', 100, 3400, 15)], descuento: 0, rango: 15, alta: 20260901, img: 'p-oregano', alt: 'Frasco de vidrio con tapa de madera lleno de hojas de orégano seco', corto: 'En hojas · Para pizza y salsas', desc: 'Orégano seco en hojas, para la pizza, la salsa de tomate, el chimichurri o la provoleta.', ficha: [['Presentación', '50 g o 100 g'], ['Ideal para', 'Pizzas, salsas y chimichurri'], CONSERVAR] },
  { id: 'orejones', nombre: 'Orejones de durazno', cat: 'frutas-desecadas', formato: 'peso', vars: [g('250', '250 g', 250, 6900, 3), g('500', '500 g', 500, 12900, 2)], descuento: 0, rango: 16, alta: 20261016, img: 'p-orejones', alt: 'Orejones de durazno en un bowl junto a dátiles y pasas', corto: 'Tiernos · Para picar o cocinar', desc: 'Orejones de durazno tiernos. Para picar, para budines o para sumar a un guiso o un relleno.', ficha: [['Presentación', '250 g o 500 g'], ['Ideal para', 'Colaciones, budines y rellenos'], CONSERVAR] },
  { id: 'datiles', nombre: 'Dátiles', cat: 'frutas-desecadas', formato: 'peso', vars: [g('250', '250 g', 250, 7500, 18), g('500', '500 g', 500, 13900, 10), g('1000', '1 kg', 1000, 26500, 5)], descuento: 0, rango: 17, alta: 20260918, img: 'p-datiles', alt: 'Dátiles sueltos sobre una superficie clara', corto: 'Dulces y carnosos', desc: 'Dátiles dulces y carnosos. Para una colación, para endulzar un licuado o para rellenar con frutos secos.', ficha: [['Presentación', '250 g, 500 g o 1 kg'], ['Ideal para', 'Colaciones y licuados'], CONSERVAR] },
  { id: 'aceitunas', nombre: 'Aceitunas negras en aceite de oliva', cat: 'conservas', formato: 'envasado', vars: [u('330', 'Frasco 330 g', 6900, 12)], descuento: 0, rango: 18, alta: 20260928, img: 'p-aceitunas', alt: 'Frasco de vidrio con cierre hermético lleno de aceitunas negras en aceite de oliva', corto: 'Frasco con cierre hermético', desc: 'Aceitunas negras conservadas en aceite de oliva, en frasco de vidrio con cierre hermético. Para la picada o la pizza.', ficha: [['Presentación', 'Frasco de vidrio de 330 g'], ['Ideal para', 'Picadas, pizzas y ensaladas'], ['Conservación', 'Una vez abierto, en la heladera']] },
  { id: 'vino-blanco', nombre: 'Vino blanco Chardonnay', cat: 'vinos', formato: 'envasado', vars: [u('botella', '750 ml', 9900, 20), u('caja', 'Caja x 6', 57900, 4)], descuento: 0, rango: 19, alta: 20261005, img: 'p-vino-blanco', alt: 'Botella de vino blanco con etiqueta en blanco sobre fondo claro', corto: 'Botella o caja de 6', desc: 'Chardonnay para pescados, pastas con crema o una tarde de quesos. Por botella o por caja de 6.', ficha: [['Presentación', 'Botella de 750 ml o caja de 6'], ['Va con', 'Pescados, pastas y quesos'], ['Venta', 'Solo para mayores de 18 años']] },
  { id: 'mermelada', nombre: 'Mermelada de frutos rojos', cat: 'mieles', formato: 'envasado', vars: [u('420', 'Frasco 420 g', 5900, 15)], descuento: 0, rango: 20, alta: 20261011, img: 'p-mermelada', alt: 'Frasco de mermelada de frutos rojos con tapa dorada, rodeado de frambuesas, arándanos y frutillas', corto: 'Frambuesa, frutilla y arándano', desc: 'Mermelada de frutos rojos con trocitos de fruta. Para tostadas, panqueques, yogur o rellenar una tarta.', ficha: [['Presentación', 'Frasco de vidrio de 420 g'], ['Ideal para', 'Desayunos y repostería'], ['Conservación', 'Una vez abierto, en la heladera']] },
  { id: 'granola', nombre: 'Granola con frutos secos', cat: 'granos', formato: 'peso', vars: [g('500', '500 g', 500, 6900, 14), g('1000', '1 kg', 1000, 12900, 7)], descuento: 0, rango: 21, alta: 20261017, img: 'p-granola', alt: 'Bowl negro con granola y una cuchara, junto a una tostada y vasos de leche', corto: 'Avena tostada y frutos secos', desc: 'Avena tostada con frutos secos y semillas. Con yogur, con leche o sola, para el desayuno o la merienda.', ficha: [['Presentación', '500 g o 1 kg'], ['Ideal para', 'Desayunos y meriendas'], CONSERVAR] },
  { id: 'avena', nombre: 'Avena arrollada', cat: 'granos', formato: 'peso', vars: [g('500', '500 g', 500, 2400, 40), g('1000', '1 kg', 1000, 4400, 25)], descuento: 0, rango: 22, alta: 20260902, img: 'p-avena', alt: 'Bowl de madera con avena arrollada junto a una bolsa de papel kraft', corto: 'Gruesa · Para porridge y galletitas', desc: 'Avena arrollada gruesa. Para el porridge, la granola casera, galletitas o para sumar a un licuado.', ficha: [['Presentación', '500 g o 1 kg'], ['Ideal para', 'Desayunos, galletitas y panes'], CONSERVAR] },
  { id: 'lentejas', nombre: 'Lentejas rojas partidas', cat: 'granos', formato: 'peso', vars: [g('500', '500 g', 500, 3600, 20), g('1000', '1 kg', 1000, 6800, 12)], descuento: 0, rango: 23, alta: 20261020, img: 'p-lentejas', alt: 'Bowl con lentejas rojas partidas y porotos sueltos alrededor', corto: 'Se cocinan en 15 minutos', desc: 'Lentejas rojas partidas: no hace falta remojarlas y se cocinan rápido. Para guisos, hamburguesas o un dahl.', ficha: [['Presentación', '500 g o 1 kg'], ['Ideal para', 'Guisos, sopas y hamburguesas'], CONSERVAR] },
  { id: 'pasas-uva', nombre: 'Pasas de uva', cat: 'frutas-desecadas', formato: 'peso', vars: [g('250', '250 g', 250, 4900, 0)], descuento: 0, rango: 99, alta: 20250101, visible: false, img: 'p-mix-desecadas', alt: '', corto: '', desc: '', ficha: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conDescuento = (p, v) => (p.descuento > 0 ? Math.round(v.precio * (1 - p.descuento / 100)) : v.precio);
const varDe = (p, vid) => p?.vars.find(v => v.id === vid) || null;
const varInicial = p => p.vars.find(v => v.stock > 0) || p.vars[0];
const stockTotal = p => p.vars.reduce((n, v) => n + Math.max(0, v.stock), 0);
const precioDesde = p => Math.min(...p.vars.map(v => conDescuento(p, v)));
const catDe = id => CATEGORIAS.find(c => c.id === id);
const esNuevo = p => p.alta >= 20261014;
const wa = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
const foto = (p, chica) => `images/${p.img}${chica ? '-480' : ''}.webp`;
const paginaCatalogo = () => (document.body.dataset.modelo === '2' ? 'catalogo-2.html' : 'catalogo.html');
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };
const nombreLinea = (p, v) => (p.vars.length > 1 ? `${p.nombre} (${v.nombre})` : p.nombre);

function referencia(p, v) {
  if (v.g && v.g < 1000) return `Equivale a ${formatearPrecio(conDescuento(p, v) / v.g * 1000)} el kilo`;
  if (v.ml && v.ml !== 1000) return `Equivale a ${formatearPrecio(conDescuento(p, v) / v.ml * 1000)} el litro`;
  return '';
}

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), formato = lista(f.formato), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (formato.length && !formato.includes(p.formato)) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v > max) return false;
    }
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden, ids) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    if (orden === 'ids' && Array.isArray(ids)) return (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, FORMATOS[p.formato], p.corto, p.desc, ...p.ficha.map(f => f[1]), ...p.vars.map(v => v.nombre),
      p.descuento > 0 ? 'oferta descuento' : '', esNuevo(p) ? 'nuevo novedad' : '', p.formato === 'peso' ? 'suelto granel fraccionado kilo' : '',
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

const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));

const Cart = {
  KEY: 'organic_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, vid, qty = 1) {
    const v = varDe(producto, vid);
    if (!v) return;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === vid);
    if (existing) existing.qty = Math.min(existing.qty + qty, v.stock ?? 99);
    else items.push({ id: producto.id, v: vid, qty: Math.min(qty, v.stock ?? 99) });
    this.save(items);
  },
  setQty(id, vid, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === vid); if (!it) return;
    const v = varDe(getProducto(id), vid); it.qty = Math.max(1, Math.min(qty, v?.stock ?? 99)); this.save(items);
  },
  remove(id, vid) { this.save(this.get().filter(i => !(i.id === id && i.v === vid))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  qtyDe(id, vid) { return this.get().find(i => i.id === id && i.v === vid)?.qty || 0; },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const v = varDe(p, i.v); return v ? s + conDescuento(p, v) * i.qty : s; }, 0); },
  syncStock() {
    const items = this.get(); let changed = false;
    const filtered = items.filter(i => {
      const v = varDe(getProducto(i.id), i.v);
      if (!v || v.stock <= 0) { changed = true; return false; }
      if (i.qty > v.stock) { i.qty = v.stock; changed = true; }
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

const ico = n => `<svg class="ico" aria-hidden="true"><use href="#i-${n}"></use></svg>`;
const WSP_ICO = '<svg class="ico-wsp" aria-hidden="true"><use href="#i-wsp"></use></svg>';
const ANIM_SUBIR = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';
const waConsulta = p => wa(`¡Hola Orgánic! Quiero consultar por ${p.nombre}.`);
const waMayor = p => wa(`¡Hola Orgánic! Quiero consultar el precio por mayor de ${p.nombre}.`);

function precioHTML(p, v) {
  const final = conDescuento(p, v);
  const ref = referencia(p, v);
  const off = p.descuento > 0 ? `<s>${formatearPrecio(v.precio)}</s><span class="precio__off">−${p.descuento}%</span>` : '';
  return `<p class="precio"><span>${formatearPrecio(final)}</span>${off}</p>${ref ? `<p class="precio__ref">${ref}</p>` : ''}`;
}
function badgesDe(p) {
  const b = [];
  const total = stockTotal(p);
  if (total <= 0) b.push(['sin', 'Sin stock']);
  if (p.descuento > 0) b.push(['off', `−${p.descuento}%`]);
  if (total > 0 && total <= 5) b.push(['ultimas', 'Últimas unidades']);
  if (esNuevo(p)) b.push(['nuevo', 'Nuevo']);
  return b.slice(0, 2);
}
const badgesHTML = p => { const b = badgesDe(p); return b.length ? `<span class="badges">${b.map(([k, t]) => `<span class="badge badge--${k}">${t}</span>`).join('')}</span>` : ''; };
const stepperHTML = (p, v) => `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno" disabled>−</button><input type="number" inputmode="numeric" min="1" max="${Math.max(1, v.stock)}" value="1" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-step="1" aria-label="Sumar uno"${v.stock <= 1 ? ' disabled' : ''}>+</button></div>`;
const avisameHTML = p => `<a class="prod-avisame" href="${wa(`¡Hola Orgánic! ¿Me avisan cuando vuelva a entrar ${p.nombre}?`)}" target="_blank" rel="noopener">Avisame cuando vuelva</a>`;

function presHTML(p, v) {
  if (p.vars.length < 2) return `<p class="pres-una">${esc(v.nombre)}</p>`;
  return `<div class="pres" role="group" aria-label="Presentación de ${esc(p.nombre)}">${p.vars.map(x => `<button type="button" class="pres__op" data-pres="${x.id}" aria-pressed="${x.id === v.id}"${x.stock <= 0 ? ' disabled title="Sin stock"' : ''}>${esc(x.nombre)}</button>`).join('')}</div>`;
}

function cardV(p, anim = true) {
  const v = varInicial(p);
  const hay = stockTotal(p) > 0;
  const acc = hay
    ? `<div class="prod-actions">${stepperHTML(p, v)}<button type="button" class="btn btn--cta btn--sm prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('cart')}<span>Agregar</span></button></div><button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>`
    : `<p class="prod-sin">Sin stock por ahora</p>${avisameHTML(p)}`;
  return `<article class="pcard" data-card="${p.id}" data-v="${v.id}"${anim ? ` ${ANIM_SUBIR}` : ''}>
    <button type="button" class="pcard__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, true)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="(min-width: 1100px) 300px, (min-width: 761px) 33vw, 50vw" alt="${esc(p.alt)}" width="480" height="640"></button>
    <div class="pcard__body">
      <p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p>
      <h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3>
      ${presHTML(p, v)}
      <div class="pcard__precio" data-precio>${precioHTML(p, v)}</div>
      <div class="pcard__acc">${acc}</div>
    </div>
  </article>`;
}

function cardT(p, grande = false) {
  const unica = p.vars.length < 2;
  const v = varInicial(p);
  const add = stockTotal(p) <= 0
    ? '<span class="ptile__sin">Sin stock</span>'
    : unica
      ? `<button type="button" class="ptile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ico('plus')}</button>`
      : `<button type="button" class="ptile__elegir" data-open="${p.id}" aria-label="Elegir presentación de ${esc(p.nombre)}">Elegir</button>`;
  const precio = unica ? formatearPrecio(conDescuento(p, v)) : `Desde ${formatearPrecio(precioDesde(p))}`;
  return `<article class="ptile" data-card="${p.id}" data-v="${v.id}" ${ANIM_SUBIR}>
    <button type="button" class="ptile__foto" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.nombre)}">${badgesHTML(p)}<img src="${foto(p, !grande)}" srcset="${foto(p, true)} 480w, ${foto(p)} 900w" sizes="${grande ? '(min-width: 901px) 50vw, 100vw' : '(min-width: 901px) 25vw, 50vw'}" alt="${esc(p.alt)}" width="480" height="640"></button>
    <div class="ptile__info">
      <div><p class="pcard__cat">${esc(catDe(p.cat)?.nombre)}</p><h3 class="pcard__nombre"><button type="button" data-open="${p.id}">${esc(p.nombre)}</button></h3><p class="ptile__precio">${precio}${p.descuento > 0 ? ` <span class="precio__off">−${p.descuento}%</span>` : ''}</p></div>
      ${add}
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
    nav.querySelector('a, button.nav-drop__btn')?.focus();
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

function initNavDrop() {
  const drop = document.querySelector('[data-nav-drop]');
  if (!drop) return;
  const btn = drop.querySelector('.nav-drop__btn');
  const lista = drop.querySelector('[data-drop-lista]');
  const base = paginaCatalogo();
  const enCatalogo = document.body.dataset.pagina === 'catalogo';
  const actual = new URLSearchParams(location.search).get('cat');
  lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${base}?cat=${c.id}"${enCatalogo && actual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></a></li>`).join('');
  const desktop = window.matchMedia('(min-width: 1025px)');
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

function initCuentas() {
  const txt = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  const pintar = (sel, clave, filtro) => document.querySelectorAll(sel).forEach(el => {
    const n = Tienda.contar({ [filtro]: el.dataset[clave] });
    el.textContent = el.closest('.chk') ? n : txt(n);
  });
  pintar('[data-cuenta-cat]', 'cuentaCat', 'cat');
  pintar('[data-cuenta-formato]', 'cuentaFormato', 'formato');
}

function destacados(n) {
  const items = Tienda.consultar({ orden: 'destacados', filtros: { stock: true }, limite: n }).items;
  items.forEach(cachear);
  return items;
}

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(initRail);
}

function initRail(rail) {
  const vp = rail.querySelector('[data-rail-vp]');
  const track = rail.querySelector('[data-rail-track]');
  if (track.hasAttribute('data-rail-productos')) track.innerHTML = destacados(8).map(p => `<div class="rail-item" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardV(p, false)}</div>`).join('');
  const scope = rail.closest('[data-rail-scope]') || rail.closest('section') || document;
  const prev = scope.querySelector('[data-rail-prev]');
  const next = scope.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 18;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let moved = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    if (e.target.closest('input, .stepper, .pres')) return;
    pointerId = e.pointerId; startX = e.clientX; startScroll = vp.scrollLeft; moved = false;
  });
  vp.addEventListener('pointermove', e => {
    if (pointerId !== e.pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startScroll - dx;
  });
  const end = () => {
    if (pointerId === null) return;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    pointerId = null;
    vp.classList.remove('dragging');
    if (moved) vp.addEventListener('click', ev => { ev.stopPropagation(); ev.preventDefault(); }, { capture: true, once: true });
    setTimeout(() => { moved = false; }, 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const excluir = destacados(8).map(p => p.id);
  const items = Tienda.consultar({ filtros: { excluir }, orden: 'nuevos', limite: 8 }).items;
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardV(p)).join('');
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const ids = (cont.dataset.mosaico || '').split(',').filter(Boolean);
  const items = ids.length ? Tienda.consultar({ filtros: { ids }, orden: 'ids', limite: 5 }).items : destacados(5);
  items.forEach(cachear);
  cont.innerHTML = items.map((p, i) => cardT(p, i === 0)).join('');
}

const GALERIA = [
  { src: 'images/gal-01.webp', w: 900, h: 1600, alt: 'Botella de aceite de oliva junto a un cuenco con aceite, ramas de olivo y aceitunas' },
  { src: 'images/gal-03.webp', w: 1200, h: 1200, alt: 'Frasco de miel con un cucharón de madera chorreando miel' },
  { src: 'images/gal-04.webp', w: 1200, h: 1200, alt: 'Frascos de vidrio con tapa de madera con pimentón, cúrcuma y orégano' },
  { src: 'images/gal-05.webp', w: 1200, h: 1200, alt: 'Frasco de vegetales asados en aceite rodeado de morrón, berenjena y zucchini' },
  { src: 'images/gal-06.webp', w: 1200, h: 1200, alt: 'Botella de vino blanco sobre fondo claro' },
  { src: 'images/gal-07.webp', w: 1200, h: 1200, alt: 'Bowl de madera con avena arrollada junto a una bolsa de papel kraft' },
  { src: 'images/gal-08.webp', w: 1200, h: 1200, alt: 'Bowl de cerámica con orejones, dátiles y pasas de uva' },
  { src: 'images/gal-09.webp', w: 1200, h: 1200, alt: 'Frasco de mermelada de frutos rojos rodeado de frambuesas, arándanos y frutillas' },
];

let visorVolver = null;
let visorIdx = 0;
function pintarVisor() {
  const v = document.getElementById('visor');
  const it = GALERIA[visorIdx];
  if (!v || !it) return;
  const img = v.querySelector('[data-visor-img]');
  img.src = it.src; img.width = it.w; img.height = it.h; img.alt = it.alt;
  v.querySelector('[data-visor-txt]').textContent = it.alt;
  v.querySelector('[data-visor-n]').textContent = `${visorIdx + 1} / ${GALERIA.length}`;
}
function abrirVisor(i, origen) {
  const v = document.getElementById('visor');
  if (!v) return;
  visorIdx = Math.max(0, Math.min(GALERIA.length - 1, i));
  visorVolver = origen || document.activeElement;
  pintarVisor();
  v.hidden = false;
  void v.offsetWidth;
  v.classList.add('abierto');
  document.body.classList.add('no-scroll');
  v.querySelector('.visor__cerrar').focus();
}
function cerrarVisor() {
  const v = document.getElementById('visor');
  if (!v || v.hidden) return;
  v.classList.remove('abierto');
  setTimeout(() => { v.hidden = true; }, reduceMotion ? 0 : 300);
  document.body.classList.remove('no-scroll');
  if (visorVolver && document.contains(visorVolver)) visorVolver.focus();
}
function moverVisor(d) {
  visorIdx = (visorIdx + d + GALERIA.length) % GALERIA.length;
  pintarVisor();
}
function initVisor() {
  const v = document.getElementById('visor');
  if (!v) return;
  v.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) cerrarVisor();
    else if (e.target.closest('[data-visor-prev]')) moverVisor(-1);
    else if (e.target.closest('[data-visor-next]')) moverVisor(1);
  });
  document.addEventListener('keydown', e => {
    if (v.hidden || !v.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrarVisor();
    else if (e.key === 'ArrowLeft') moverVisor(-1);
    else if (e.key === 'ArrowRight') moverVisor(1);
    else atraparFoco(v.querySelector('.visor__panel'), e);
  });
}

const HORARIO = { 0: [], 1: [[540, 810], [1020, 1260]], 2: [[540, 810], [1020, 1260]], 3: [[540, 810], [1020, 1260]], 4: [[540, 810], [1020, 1260]], 5: [[540, 810], [1020, 1260]], 6: [[570, 810]] };
const LOCAL = { lat: -32.8895, lng: -68.8458 };
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function ahoraEnMendoza() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Mendoza', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia, min: parseInt(val('hour'), 10) * 60 + parseInt(val('minute'), 10) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
function estadoLocal({ dia, min }) {
  const abierto = HORARIO[dia].find(([a, c]) => min >= a && min < c);
  if (abierto) return { abierto: true, texto: `Abierto ahora · cierra a las ${hhmm(abierto[1])}` };
  const hoy = HORARIO[dia].find(([a]) => a > min);
  if (hoy) return { abierto: false, texto: `Cerrado · abre hoy a las ${hhmm(hoy[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    if (HORARIO[d].length) return { abierto: false, texto: `Cerrado · abre ${k === 1 ? 'mañana' : `el ${DIAS[d]}`} a las ${hhmm(HORARIO[d][0][0])}` };
  }
  return { abierto: false, texto: 'Cerrado' };
}
function initHorario() {
  const pills = document.querySelectorAll('[data-estado-local]');
  if (!pills.length) return;
  const pintar = () => {
    const ahora = ahoraEnMendoza();
    const e = estadoLocal(ahora);
    pills.forEach(el => { el.textContent = e.texto; el.classList.toggle('estado--abierto', e.abierto); });
    document.querySelectorAll('[data-dias]').forEach(fila => {
      const dias = fila.dataset.dias.split(',').map(Number);
      fila.classList.toggle('hoy', dias.includes(ahora.dia));
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  try {
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomControl: true }).setView([LOCAL.lat, LOCAL.lng], 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: 'pin', html: '<span></span>', iconSize: [30, 40], iconAnchor: [15, 40] });
    L.marker([LOCAL.lat, LOCAL.lng], { icon: icono, title: 'Orgánic, Mendoza' }).addTo(mapa).bindPopup('<b>Orgánic</b><br>Mendoza · dirección a confirmar');
    const ajustar = () => { mapa.invalidateSize(); mapa.setView([LOCAL.lat, LOCAL.lng], mapa.getZoom(), { animate: false }); };
    window.addEventListener('load', ajustar);
    setTimeout(ajustar, 1500);
  } catch { /* el mapa no debe frenar el resto */ }
}

function initCatalogo() {
  const root = document.querySelector('[data-catalogo]');
  if (!root) return;
  const esM2 = document.body.dataset.modelo === '2';
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
  const chips = document.querySelector('[data-chips-cat]');
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'nuevos'];
  const VALIDOS = { cat: CATEGORIAS.map(c => c.id), formato: Object.keys(FORMATOS) };
  const estado = { cat: [], formato: [], precio: '', stock: false, q: '', orden: 'destacados' };
  let cursor = null;
  let mostrados = 0;

  const params = new URLSearchParams(location.search);
  const listaURL = k => [...new Set((params.get(k) || '').split(',').map(s => s.trim()).filter(v => VALIDOS[k].includes(v)))];
  estado.cat = listaURL('cat');
  estado.formato = listaURL('formato');
  estado.precio = PRECIOS[params.get('precio')] ? params.get('precio') : '';
  estado.stock = params.get('stock') === '1';
  estado.q = (params.get('q') || '').trim().slice(0, 60);
  estado.orden = ORDENES.includes(params.get('orden')) ? params.get('orden') : 'destacados';

  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="">Todo <small>${Tienda.contar({})}</small></button>` + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}">${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  }

  const filtrosDe = () => ({ cat: estado.cat, formato: estado.formato, precio: estado.precio, stock: estado.stock });
  const escribirURL = () => {
    const p = new URLSearchParams();
    if (estado.cat.length) p.set('cat', estado.cat.join(','));
    if (estado.formato.length) p.set('formato', estado.formato.join(','));
    if (estado.precio) p.set('precio', estado.precio);
    if (estado.stock) p.set('stock', '1');
    if (estado.q) p.set('q', estado.q);
    if (estado.orden !== 'destacados') p.set('orden', estado.orden);
    const s = p.toString().replace(/%2C/g, ',');
    try { window.history.replaceState(null, '', s ? `?${s}` : location.pathname); } catch { /* file:// */ }
  };
  const sincronizarUI = () => {
    filtrosEl.querySelectorAll('input[data-f]').forEach(i => {
      i.checked = i.dataset.f === 'stock' ? estado.stock : estado[i.dataset.f].includes(i.value);
    });
    filtrosEl.querySelectorAll('input[name="fPrecio"]').forEach(i => { i.checked = i.value === estado.precio; });
    selOrden.value = estado.orden;
    if (document.activeElement !== input) input.value = estado.q;
    chips?.querySelectorAll('[data-chip]').forEach(b => {
      const v = b.dataset.chip;
      b.setAttribute('aria-pressed', String(v ? estado.cat.length === 1 && estado.cat[0] === v : !estado.cat.length));
    });
    const n = (esM2 ? 0 : estado.cat.length) + estado.formato.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);
    nFiltros.hidden = !n;
    nFiltros.textContent = n;
    if (estado.cat.length === 1) {
      migaCat.hidden = false;
      migaCat.textContent = catDe(estado.cat[0]).nombre;
      migaCat.setAttribute('aria-current', 'page');
    } else {
      migaCat.hidden = true;
      migaCat.removeAttribute('aria-current');
    }
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => (esM2 ? cardT(p) : cardV(p))).join('');
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
    if (i.name === 'fPrecio') estado.precio = PRECIOS[i.value] ? i.value : '';
    else if (i.dataset.f === 'stock') estado.stock = i.checked;
    else if (i.dataset.f) {
      const set = new Set(estado[i.dataset.f]);
      if (i.checked) set.add(i.value); else set.delete(i.value);
      estado[i.dataset.f] = [...set];
    }
    aplicar();
  });
  chips?.addEventListener('click', e => {
    const b = e.target.closest('[data-chip]');
    if (!b) return;
    estado.cat = b.dataset.chip ? [b.dataset.chip] : [];
    aplicar();
  });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    Object.assign(estado, { cat: [], formato: [], precio: '', stock: false, q: '' });
    input.value = '';
    aplicar();
  }));
  let tq = 0;
  formQ.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = input.value.trim().slice(0, 60); aplicar(); });
  input.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = input.value.trim().slice(0, 60); aplicar(); }, 260); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  verMas.addEventListener('click', () => pintar(true));

  let volverFiltros = null;
  const drawerFiltros = () => esM2 || window.matchMedia('(max-width: 1024px)').matches;
  const abrirFiltros = () => {
    volverFiltros = document.activeElement;
    filtrosEl.classList.add('abierto');
    filtrosEl.setAttribute('role', 'dialog');
    filtrosEl.setAttribute('aria-modal', 'true');
    fondo.hidden = false;
    document.body.classList.add('no-scroll');
    filtrosEl.querySelector('.filtros__cerrar')?.focus();
  };
  const cerrarFiltros = () => {
    if (!filtrosEl.classList.contains('abierto')) return;
    filtrosEl.classList.remove('abierto');
    filtrosEl.removeAttribute('role');
    filtrosEl.removeAttribute('aria-modal');
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
  window.matchMedia('(min-width: 1025px)').addEventListener('change', () => { if (!drawerFiltros()) cerrarFiltros(); });

  sincronizarUI();
  pintar();
  if (params.has('q')) input.focus({ preventScroll: true });
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

function lineaHTML(item, p, v) {
  const clave = `${p.id}|${v.id}`;
  return `<div class="linea">
    <div class="linea__foto"><img src="${foto(p, true)}" alt="" width="480" height="640"></div>
    <div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__pres">${esc(v.nombre)}</p></div>
    <p class="linea__precio">${formatearPrecio(conDescuento(p, v) * item.qty)}</p>
    <div class="linea__ctrl"><div class="stepper" data-stepper data-linea="${clave}"><button type="button" data-linea-step="-1" data-id="${clave}" aria-label="Restar uno de ${esc(p.nombre)}"${item.qty <= 1 ? ' disabled' : ''}>−</button><input type="number" inputmode="numeric" min="1" max="${v.stock}" value="${item.qty}" aria-label="Cantidad de ${esc(p.nombre)}"><button type="button" data-linea-step="1" data-id="${clave}" aria-label="Sumar uno de ${esc(p.nombre)}"${item.qty >= v.stock ? ' disabled' : ''}>+</button></div><button type="button" class="linea__quitar" data-quitar="${clave}">Quitar</button></div>
  </div>`;
}

const ORIGEN_KEY = 'organic_origen';
const leerOrigen = () => { try { return localStorage.getItem(ORIGEN_KEY) || ''; } catch { return ''; } };
function mensajePedido() {
  const items = Cart.get().map(i => { const p = getProducto(i.id); return { i, p, v: varDe(p, i.v) }; }).filter(x => x.v);
  const origen = leerOrigen();
  const pie = origen ? `\nLos conocí por: ${origen}` : '';
  if (!items.length) return wa(`¡Hola Orgánic! Vi la web y quiero hacer una consulta.${pie}`);
  const lineas = items.map(({ i, p, v }) => `• ${i.qty} × ${nombreLinea(p, v)} — ${formatearPrecio(conDescuento(p, v) * i.qty)}`);
  return wa(`¡Hola Orgánic! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}${pie}`);
}

function renderCarrito() {
  const items = Cart.get().map(i => { const p = getProducto(i.id); return { i, p, v: varDe(p, i.v) }; }).filter(x => x.v);
  const activo = document.activeElement;
  const enLineas = activo?.closest?.('[data-drawer-lineas]');
  let selector = null;
  if (enLineas) {
    if (activo.dataset.lineaStep) selector = `[data-linea-step="${activo.dataset.lineaStep}"][data-id="${activo.dataset.id}"]`;
    else if (activo.dataset.quitar) selector = '.linea__quitar';
  }
  const vacio = !items.length;
  const drawer = document.querySelector('[data-drawer-lineas]');
  if (drawer) {
    drawer.innerHTML = vacio
      ? `<div class="carrito-vacio"><p>Tu carrito está vacío</p><small>Sumá unos frutos secos, una miel o lo que te falte en la alacena.</small><a class="btn btn--line" href="${paginaCatalogo()}">Volver al catálogo</a></div>`
      : items.map(({ i, p, v }) => lineaHTML(i, p, v)).join('');
    document.querySelector('[data-drawer-pie]').hidden = vacio;
  }
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(Cart.total()); });
  const msg = mensajePedido();
  document.querySelectorAll('[data-drawer-wsp]').forEach(a => { a.href = msg; });
  if (selector && drawer) (drawer.querySelector(selector) || drawer.querySelector('button:not([disabled])'))?.focus();
}

function initOrigen() {
  const sel = document.querySelector('[data-origen]');
  if (!sel) return;
  sel.innerHTML = '<option value="">Elegí una opción</option>' + ORIGENES.map(o => `<option>${esc(o)}</option>`).join('');
  sel.value = ORIGENES.includes(leerOrigen()) ? leerOrigen() : '';
  sel.addEventListener('change', () => {
    try { if (sel.value) localStorage.setItem(ORIGEN_KEY, sel.value); else localStorage.removeItem(ORIGEN_KEY); } catch { /* sin almacenamiento */ }
    renderCarrito();
  });
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

let qvVolver = null;
let qvTimer = 0;
function qvHTML(p) {
  const cat = catDe(p.cat);
  const v = varInicial(p);
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id], stock: true }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)], stock: true }, limite: 3 - rel.length }).items);
  rel.forEach(cachear);
  const comprar = stockTotal(p) > 0
    ? `<div class="qv__comprar">${stepperHTML(p, v)}<button type="button" class="btn btn--cta prod-add" data-add="${p.id}">Agregar al carrito</button><button type="button" class="btn btn--line" data-buy="${p.id}">Comprar ahora</button></div><p class="qv__stock" data-qv-stock>${v.stock <= 3 ? `Quedan ${v.stock} unidades` : ''}</p>`
    : `<p class="qv__stock">Sin stock por ahora.</p>${avisameHTML(p)}`;
  return `<figure class="qv__foto"><img src="${foto(p)}" alt="${esc(p.alt)}" width="900" height="1200"></figure>
  <div class="qv__info" data-card="${p.id}" data-v="${v.id}">
    <p class="pcard__cat">${esc(cat?.nombre)} · ${esc(FORMATOS[p.formato])}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__corto">${esc(p.corto)}</p>
    ${presHTML(p, v)}
    <div class="qv__precio" data-precio>${precioHTML(p, v)}</div>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="ficha-dl">${p.ficha.map(([t, val]) => `<div><dt>${esc(t)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
    ${comprar}
    <div class="qv__links"><a class="link-wsp" href="${waConsulta(p)}" target="_blank" rel="noopener">${WSP_ICO}Consultar por este producto</a><a class="link-wsp link-wsp--sec" href="${waMayor(p)}" target="_blank" rel="noopener">${ico('box')}¿Por mayor? Pedí el precio</a></div>
    ${rel.length ? `<div class="rel"><p class="rel__tit">También te puede interesar</p><ul class="rel__lista">${rel.map(r => `<li><button type="button" data-open="${r.id}"><span class="rel__foto"><img src="${foto(r, true)}" alt="" width="480" height="640"></span><b>${esc(r.nombre)}</b><small>${r.vars.length > 1 ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</small></button></li>`).join('')}</ul></div>` : ''}
  </div>`;
}
function abrirProducto(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qv.querySelector('[data-qv-body]').innerHTML = qvHTML(p);
  qv.querySelector('.qv__panel').setAttribute('aria-label', `Detalle: ${p.nombre}`);
  document.getElementById('ldProducto')?.remove();
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.id = 'ldProducto';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(foto(p), location.href).href, description: p.desc,
    category: catDe(p.cat)?.nombre,
    offers: p.vars.map(v => ({ '@type': 'Offer', name: v.nombre, priceCurrency: 'ARS', price: conDescuento(p, v), availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })),
  });
  document.head.appendChild(ld);
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
}
function cerrarQV(devolver = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('abierto');
  qvTimer = setTimeout(() => { qv.hidden = true; }, reduceMotion ? 0 : 360);
  document.body.classList.remove('no-scroll');
  document.getElementById('ldProducto')?.remove();
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

function elegirPresentacion(card, vid) {
  const p = getProducto(card.dataset.card);
  const v = varDe(p, vid);
  if (!v || v.stock <= 0) return;
  card.dataset.v = v.id;
  card.querySelectorAll('[data-pres]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pres === v.id)));
  const precio = card.querySelector('[data-precio]');
  if (precio) precio.innerHTML = precioHTML(p, v);
  const st = card.querySelector('[data-stepper]');
  if (st) { const inp = st.querySelector('input'); inp.max = v.stock; inp.value = 1; syncStepper(st); }
  const aviso = card.querySelector('[data-qv-stock]');
  if (aviso) aviso.textContent = v.stock <= 3 ? `Quedan ${v.stock} unidades` : '';
}

function finalizar() {
  if (!Cart.count()) { showToast('Tu carrito está vacío: sumá un producto primero'); return; }
  showToast('¡Genial! El pago online se activa al pasar la web a producción.');
}

function initDelegacion() {
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-open], [data-add], [data-buy], [data-step], [data-linea-step], [data-quitar], [data-open-cart], [data-finalizar], [data-qv-cerrar], [data-drawer-cerrar], [data-pres], [data-galeria-i]');
    if (!t) return;
    if (t.matches('[data-qv-cerrar]')) { cerrarQV(); return; }
    if (t.matches('[data-drawer-cerrar]')) { cerrarDrawer(); return; }
    if (t.matches('[data-galeria-i]')) { abrirVisor(Number(t.dataset.galeriaI), t); return; }
    if (t.matches('[data-pres]')) { const card = t.closest('[data-card]'); if (card) elegirPresentacion(card, t.dataset.pres); return; }
    if (t.matches('[data-step]')) {
      const st = t.closest('[data-stepper]');
      const inp = st.querySelector('input');
      inp.value = (parseInt(inp.value, 10) || 1) + Number(t.dataset.step);
      syncStepper(st);
      return;
    }
    if (t.matches('[data-linea-step]')) {
      const [id, vid] = t.dataset.id.split('|');
      Cart.setQty(id, vid, Cart.qtyDe(id, vid) + Number(t.dataset.lineaStep));
      return;
    }
    if (t.matches('[data-quitar]')) {
      const [id, vid] = t.dataset.quitar.split('|');
      const p = getProducto(id);
      Cart.remove(id, vid);
      showToast(`Sacaste ${p ? p.nombre : 'el producto'} del carrito`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-finalizar]')) { finalizar(); return; }
    if (t.matches('[data-open]')) { abrirProducto(t.dataset.open, t.closest('.qv') ? null : t); return; }
    const id = t.dataset.add || t.dataset.buy;
    const p = getProducto(id);
    if (!p || stockTotal(p) <= 0) return;
    const card = t.closest('[data-card]');
    const v = varDe(p, card?.dataset.v) || varInicial(p);
    if (!v || v.stock <= 0) return;
    const st = card?.querySelector('[data-stepper]');
    const qty = st ? syncStepper(st) : 1;
    if (Cart.qtyDe(p.id, v.id) >= v.stock) { showToast(`Ya tenés todas las unidades de ${nombreLinea(p, v)} en el carrito`); return; }
    Cart.add(p, v.id, qty);
    if (t.matches('[data-buy]')) { openCartDrawer(); return; }
    showToast(`Sumaste ${nombreLinea(p, v)} al carrito`);
    if (st) { st.querySelector('input').value = 1; syncStepper(st); }
  });
  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-stepper] input');
    if (!inp) return;
    const st = inp.closest('[data-stepper]');
    const v = syncStepper(st);
    if (st.dataset.linea) { const [id, vid] = st.dataset.linea.split('|'); Cart.setQty(id, vid, v); }
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero .lema'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.2 }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.hero__sello, .hero__logo'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.5);
}

function abrirDesdeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) abrirProducto(id, null);
}

initCuentas();
initNavDrop();
initRails();
initPreview();
initMosaico();
initCatalogo();
initReveals();
initNav();
initModelBarScroll();
initFloats();
initOrigen();
initVisor();
initHorario();
initMapa();
Cart.syncStock();
updateCartBadge();
renderCarrito();
initDelegacion();
initHeroMotion();
abrirDesdeURL();
