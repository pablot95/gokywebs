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

const WSP = '5491156694145';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const SALUDO = 'Hola, BRASAL!';
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'tablas', nombre: 'Tablas de madera', corto: 'Tablas', bajada: 'Para cortar el asado, servir y sacar la pizza del horno.', img: 'images/p-tabla-servir.webp', xs: 'images/p-tabla-servir-xs.webp' },
  { id: 'asado', nombre: 'Asado y parrilla', corto: 'Asado', bajada: 'Utensilios, parrillas, chimichurreras y cuchillos.', img: 'images/brasas.webp', xs: 'images/brasas-xs.webp' },
  { id: 'cocina', nombre: 'Cocina', corto: 'Cocina', bajada: 'Acero gastronómico y utensilios de madera para cocinar.', img: 'images/p-cucharas-madera.webp', xs: 'images/p-cucharas-madera-xs.webp' },
  { id: 'mesa', nombre: 'Mesa', corto: 'Mesa', bajada: 'Molinillos, saleros, bowls y cubiertos de madera.', img: 'images/p-molinillo.webp', xs: 'images/p-molinillo-xs.webp' },
];
const MATERIALES = {
  madera: { nombre: 'Madera', cuidado: 'Lavala a mano con agua tibia, secala parada y pasale aceite de cocina cada tanto. No la dejes en remojo ni la pongas en el lavavajillas.' },
  acero: { nombre: 'Acero inoxidable', cuidado: 'Lavalo con detergente y una esponja que no raye, y secalo enseguida para que no queden marcas de agua.' },
  hierro: { nombre: 'Hierro', cuidado: 'Limpiala en caliente con un cepillo de parrilla y pasale un poco de aceite antes de guardarla, así no se oxida.' },
};
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 20000 },
  '20a35': { nombre: '$20.000 a $35.000', min: 20001, max: 35000 },
  mas35: { nombre: 'Más de $35.000', min: 35001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const PRODUCTOS = [
  { id: 'tabla-mango', nombre: 'Tabla para asado con mango', cat: 'tablas', mats: ['madera'],
    ops: [{ v: '40 × 20 cm', precio: 27900 }, { v: '50 × 25 cm', precio: 33900 }, { v: '60 × 30 cm', precio: 41900 }],
    descuento: 0, stock: 14, rango: 1, alta: 1, img: 'images/p-tabla-mango.webp', xs: 'images/p-tabla-mango-xs.webp',
    alt: 'Tabla de madera veteada con mango y agujero para colgar, apoyada contra la pared de la cocina',
    desc: 'Tabla de madera con mango y agujero para colgarla. Sirve para cortar el asado en la mesa, para el pan y para armar una picada.',
    tags: ['asado', 'picada', 'carne', 'servir', 'colgar'] },
  { id: 'tabla-canaleta', nombre: 'Tabla de corte con canaleta', cat: 'tablas', mats: ['madera'],
    ops: [{ v: '35 × 25 cm', precio: 32900 }, { v: '45 × 30 cm', precio: 42900 }],
    descuento: 0, stock: 10, rango: 2, alta: 2, img: 'images/p-tabla-canaleta.webp', xs: 'images/p-tabla-canaleta-xs.webp',
    alt: 'Tabla de corte rectangular de madera oscura con canaleta en todo el borde, sobre una mesada de mármol',
    desc: 'La canaleta del borde junta los jugos mientras cortás la carne y no se escurren a la mesada. Canto grueso para que la tabla quede firme.',
    tags: ['asado', 'carne', 'jugo', 'picar', 'cortar', 'gruesa'] },
  { id: 'set-parrillero', nombre: 'Set parrillero: pinza, espátula y tenedor', cat: 'asado', mats: ['acero'],
    ops: [{ v: '3 piezas', precio: 39900 }],
    descuento: 10, stock: 12, rango: 3, alta: 3, img: 'images/p-set-parrillero.webp', xs: 'images/p-set-parrillero-xs.webp',
    alt: 'Pinza, espátula y tenedor de acero inoxidable apoyados sobre una mesa de madera',
    desc: 'Pinza, espátula y tenedor trinchante de acero inoxidable, con mango largo para dar vuelta la carne sin acercar la mano a las brasas.',
    tags: ['parrilla', 'pinza', 'espatula', 'tenedor', 'utensilios', 'asador'] },
  { id: 'chimichurrera', nombre: 'Chimichurrera doble con soporte', cat: 'asado', mats: ['acero'],
    ops: [{ v: '2 cuencos', precio: 26900 }],
    descuento: 0, stock: 9, rango: 4, alta: 4, img: 'images/p-chimichurrera.webp', xs: 'images/p-chimichurrera-xs.webp',
    alt: 'Dos cuencos de acero con salsa criolla y chimichurri sobre un soporte con manija central',
    desc: 'Dos cuencos de acero inoxidable sobre un soporte con manija, para llevar el chimichurri y la salsa criolla juntos a la mesa.',
    tags: ['chimichurri', 'salsa criolla', 'salsero', 'cuencos', 'aderezos'] },
  { id: 'pala-pizza', nombre: 'Pala para pizza de madera', cat: 'tablas', mats: ['madera'],
    ops: [{ v: '30 cm', precio: 24900 }, { v: '35 cm', precio: 28900 }],
    descuento: 0, stock: 11, rango: 5, alta: 5, img: 'images/p-pala-pizza.webp', xs: 'images/p-pala-pizza-xs.webp',
    alt: 'Pala de madera para pizza con mango largo sobre una mesada clara, con una pizza al fondo',
    desc: 'Para entrar y sacar la pizza del horno o de la parrilla y llevarla directo a la mesa. El borde es fino para deslizarla debajo de la masa.',
    tags: ['pizza', 'horno', 'pala', 'pizzeria'] },
  { id: 'parrilla-redonda', nombre: 'Parrilla redonda con patas', cat: 'asado', mats: ['hierro'],
    ops: [{ v: '30 cm', precio: 21900 }, { v: '40 cm', precio: 28900 }],
    descuento: 0, stock: 8, rango: 6, alta: 6, img: 'images/p-parrilla-redonda.webp', xs: 'images/p-parrilla-redonda-xs.webp',
    alt: 'Parrilla redonda de hierro negro con varillas paralelas y tres patas',
    desc: 'Rejilla de hierro con patas para apoyar sobre las brasas, o para usar de trébede debajo de la olla o el disco.',
    tags: ['rejilla', 'trebede', 'disco', 'brasero', 'fogon', 'hierro'] },
  { id: 'taco-cuchillos', nombre: 'Taco de madera con 5 cuchillos', cat: 'asado', mats: ['madera', 'acero'],
    ops: [{ v: '5 cuchillos', precio: 89900 }],
    descuento: 0, stock: 5, rango: 7, alta: 7, img: 'images/p-taco-cuchillos.webp', xs: 'images/p-taco-cuchillos-xs.webp',
    alt: 'Taco de madera con cinco cuchillos de acero inoxidable de distintos tamaños',
    desc: 'Taco de madera con cinco cuchillos de acero inoxidable de distintos tamaños, para la carne, el pan y la cocina de todos los días.',
    tags: ['cuchillos', 'cuchilleria', 'taco', 'carne', 'pan'] },
  { id: 'bandeja-gn', nombre: 'Bandeja gastronómica de acero inoxidable', cat: 'cocina', mats: ['acero'],
    ops: [{ v: 'GN 1/2 · 6,5 cm', precio: 24900 }, { v: 'GN 1/2 · 10 cm', precio: 29900 }, { v: 'GN 1/1 · 6,5 cm', precio: 38900 }],
    descuento: 0, stock: 20, rango: 8, alta: 8, img: 'images/p-bandeja-gn.webp', xs: 'images/p-bandeja-gn-xs.webp',
    alt: 'Bandeja rectangular de acero inoxidable con bordes doblados sobre una mesada gris',
    desc: 'Bandeja de medida gastronómica para hornear, conservar y servir. Entra en los baños maría, heladeras y mesas frías de medida GN.',
    tags: ['gastronorm', 'gn', 'asadera', 'fuente', 'horno', 'restaurante', 'profesional', 'bano maria'] },
  { id: 'portautensilios', nombre: 'Portautensilios perforado con cucharón y espumadera', cat: 'cocina', mats: ['acero'],
    ops: [{ v: 'Con 2 utensilios', precio: 29900 }],
    descuento: 0, stock: 7, rango: 9, alta: 9, img: 'images/p-portautensilios.webp', xs: 'images/p-portautensilios-xs.webp',
    alt: 'Portautensilios de acero perforado con un cucharón y una espumadera adentro',
    desc: 'Porta de acero inoxidable perforado, que deja escurrir y secar lo que guardás. Viene con un cucharón y una espumadera.',
    tags: ['cucharon', 'espumadera', 'utensilios', 'organizador', 'mesada'] },
  { id: 'molinillo', nombre: 'Molinillo de pimienta de madera', cat: 'mesa', mats: ['madera'],
    ops: [{ v: '22 cm', precio: 19900 }],
    descuento: 0, stock: 10, rango: 10, alta: 14, img: 'images/p-molinillo.webp', xs: 'images/p-molinillo-xs.webp',
    alt: 'Molinillo de pimienta de madera torneada sobre una mesada de mármol blanco',
    desc: 'Molinillo de madera torneada para pimienta en grano, para tener a mano en la cocina o en la mesa.',
    tags: ['pimienta', 'especias', 'pimentero', 'moler'] },
  { id: 'tabla-servir', nombre: 'Tabla para servir de madera oscura', cat: 'tablas', mats: ['madera'],
    ops: [{ v: '40 × 18 cm', precio: 25900 }],
    descuento: 0, stock: 3, rango: 11, alta: 15, img: 'images/p-tabla-servir.webp', xs: 'images/p-tabla-servir-xs.webp',
    alt: 'Tabla de madera oscura con mango y forma irregular sobre mármol blanco',
    desc: 'Tabla con mango, de forma irregular y terminación oscura, para servir fiambres, quesos o pan en la mesa.',
    tags: ['picada', 'quesos', 'fiambres', 'servir', 'oscura'] },
  { id: 'tabla-redonda', nombre: 'Tabla redonda con mango', cat: 'tablas', mats: ['madera'],
    ops: [{ v: '30 cm', precio: 23900 }, { v: '35 cm', precio: 27900 }],
    descuento: 0, stock: 9, rango: 12, alta: 18, img: 'images/p-tabla-redonda.webp', xs: 'images/p-tabla-redonda-xs.webp',
    alt: 'Tabla redonda de madera con mango, con una taza de café, frutillas y una medialuna',
    desc: 'Redonda, con mango y tira para colgar. Para desayunos, quesos, fiambres o para servir una pizza chica.',
    tags: ['redonda', 'desayuno', 'picada', 'quesos', 'pizza'] },
  { id: 'salero', nombre: 'Salero de madera con cuchara', cat: 'mesa', mats: ['madera'],
    ops: [{ v: 'Con cuchara', precio: 14900 }],
    descuento: 0, stock: 15, rango: 13, alta: 13, img: 'images/p-salero.webp', xs: 'images/p-salero-xs.webp',
    alt: 'Cuenco de madera lleno de sal gruesa con una cuchara de madera, junto a unas ramas verdes',
    desc: 'Cuenco de madera con su cuchara para tener la sal gruesa a mano, en la cocina o al lado de la parrilla.',
    tags: ['sal', 'sal gruesa', 'salero', 'cuenco', 'parrilla'] },
  { id: 'mortero', nombre: 'Mortero de madera', cat: 'cocina', mats: ['madera'],
    ops: [{ v: '12 cm', precio: 19900 }],
    descuento: 0, stock: 6, rango: 14, alta: 12, img: 'images/p-mortero.webp', xs: 'images/p-mortero-xs.webp',
    alt: 'Mortero y pisón de madera clara vistos desde arriba sobre una mesa de madera',
    desc: 'Mortero con pisón de madera para moler especias, ajo y hierbas, o para preparar el chimichurri.',
    tags: ['especias', 'ajo', 'chimichurri', 'pison', 'moler'] },
  { id: 'bowl-madera', nombre: 'Bowl de madera', cat: 'mesa', mats: ['madera'],
    ops: [{ v: '16 cm', precio: 16900 }, { v: '20 cm', precio: 21900 }],
    descuento: 0, stock: 12, rango: 15, alta: 11, img: 'images/p-bowl-madera.webp', xs: 'images/p-bowl-madera-xs.webp',
    alt: 'Bowl de madera torneada apoyado sobre platos blancos en una cocina luminosa',
    desc: 'Bowl de madera torneada para ensaladas, snacks o para servir el pan.',
    tags: ['ensalada', 'ensaladera', 'snacks', 'pan', 'cuenco'] },
  { id: 'cucharas-madera', nombre: 'Set de cucharas y espátulas de madera', cat: 'cocina', mats: ['madera'],
    ops: [{ v: '4 piezas', precio: 16900 }],
    descuento: 0, stock: 18, rango: 16, alta: 10, img: 'images/p-cucharas-madera.webp', xs: 'images/p-cucharas-madera-xs.webp',
    alt: 'Cucharas y espátulas ranuradas de madera clara sobre una mesada',
    desc: 'Dos cucharas y dos espátulas ranuradas de madera clara, para revolver y dar vuelta sin rayar ollas ni sartenes.',
    tags: ['cucharas', 'espatula', 'utensilios', 'revolver', 'sarten'] },
  { id: 'apoya-cucharas', nombre: 'Apoya cucharas de madera', cat: 'cocina', mats: ['madera'],
    ops: [{ v: '26 cm', precio: 12900 }],
    descuento: 0, stock: 14, rango: 17, alta: 17, img: 'images/p-apoya-cucharas.webp', xs: 'images/p-apoya-cucharas-xs.webp',
    alt: 'Apoya cucharas de madera con un cucharón de acero, al lado del anafe',
    desc: 'Para dejar la cuchara o el cucharón mientras cocinás, sin ensuciar la mesada.',
    tags: ['cuchara', 'cucharon', 'mesada', 'anafe', 'cocinar'] },
  { id: 'cubiertos-ensalada', nombre: 'Cubiertos para ensalada de madera', cat: 'mesa', mats: ['madera'],
    ops: [{ v: '2 piezas', precio: 11900 }],
    descuento: 0, stock: 16, rango: 18, alta: 16, img: 'images/p-cubiertos-ensalada.webp', xs: 'images/p-cubiertos-ensalada-xs.webp',
    alt: 'Cuchara y tenedor de madera para servir ensalada en un porta, junto a un bowl de madera',
    desc: 'Cuchara y tenedor de madera para mezclar y servir la ensalada.',
    tags: ['ensalada', 'servir', 'cuchara', 'tenedor'] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/×/g, 'x').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const opMasBarata = p => p.ops.reduce((a, b) => (precioOp(p, b) < precioOp(p, a) ? b : a), p.ops[0]);
const desde = p => precioOp(p, opMasBarata(p));
const hasta = p => Math.max(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), material = lista(f.material), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (material.length && !p.mats.some(m => material.includes(m))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(p.stock > 0)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    const cat = CATEGORIAS.find(c => c.id === p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, cat?.corto, p.desc, ...p.mats.map(m => MATERIALES[m]?.nombre || m),
      ...p.ops.map(op => `${op.v} ${String(op.v).replace(/\s/g, '')}`), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
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
      if (palabras.every(w => textoDe(p).includes(w))) {
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
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const ICO = {
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  cerrar: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  gota: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>',
  madera: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z"/><path d="M12 19v3"/></svg>',
  acero: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h20"/><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="m4 8 16-4"/><path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8"/></svg>',
  hierro: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  wsp: '<svg class="ico ico--wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  bolsa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
};

const Cart = {
  KEY: 'brasal_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  enCarrito(id, items = this.get()) { return items.filter(i => i.id === id).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = opDe(producto, v ?? producto.ops[0].v).v;
    const libre = Math.max(0, (producto.stock ?? 99) - this.enCarrito(producto.id, items));
    const suma = Math.min(qty, libre);
    if (suma <= 0) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty += suma; else items.push({ id: producto.id, v: variante, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    const p = getProducto(id);
    if (!it || !p) return;
    const otros = this.enCarrito(id, items) - it.qty;
    it.qty = Math.max(1, Math.min(qty, (p.stock ?? 99) - otros));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
  limpiar() {
    const items = this.get();
    const validos = items.filter(i => getProducto(i.id) && Number.isFinite(i.qty) && i.qty > 0);
    if (validos.length !== items.length) this.save(validos);
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const focoAtrapable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll(focoAtrapable)].filter(x => x.getClientRects().length && !x.closest('[hidden]'));
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const overlays = new Set();
function bloquearScroll(nombre, on) {
  if (on) overlays.add(nombre); else overlays.delete(nombre);
  document.body.classList.toggle('no-scroll', overlays.size > 0 || document.getElementById('mainNav')?.classList.contains('open'));
}

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.alta >= 16) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<span class="card__badges">${b.join('')}</span>` : '';
}

function precioHTML(p, op = null) {
  const o = op || opMasBarata(p);
  const varia = !op && new Set(p.ops.map(x => x.precio)).size > 1;
  const off = p.descuento > 0;
  return `<p class="precio${off ? ' precio--off' : ''}">${varia ? '<span class="precio__desde">desde</span>' : ''}<span class="precio__final">${formatearPrecio(precioOp(p, o))}</span>${off ? `<s><span class="sr-only">Antes </span>${formatearPrecio(o.precio)}</s>` : ''}</p>`;
}

const estiloEntrada = {
  subir: 'opacity:0;transform:translateY(40px)',
  der: 'opacity:0;transform:translateX(64px)',
  escala: 'opacity:0;transform:translateY(20px) scale(.92)',
};

function cardHTML(p, { entrada = 'subir', modo = 'completa' } = {}) {
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const anim = entrada ? ` data-animate="${entrada}" style="${estiloEntrada[entrada]}"` : '';
  const completa = modo === 'completa';
  const nombre = completa ? `<button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button>` : esc(p.nombre);
  const stepper = modo === 'rail' ? '' : `<div class="stepper" data-stepper data-max="${p.stock}"><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><output>1</output><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
  return `<article class="card card--${modo}"${anim} data-id="${esc(p.id)}">
    <button type="button" class="card__media" data-qv="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}">
      <img src="${esc(p.xs)}" srcset="${esc(p.xs)} 480w, ${esc(p.img)} 960w" sizes="(max-width: 640px) 50vw, (max-width: 1180px) 33vw, 320px" width="480" height="600" alt="${esc(p.alt)}">
      ${badgesHTML(p)}
      <span class="card__mat">${esc(MATERIALES[p.mats[0]]?.nombre || '')}</span>
    </button>
    <div class="card__body">
      <p class="card__cat">${esc(cat?.corto || '')}</p>
      <h3 class="card__nombre">${nombre}</h3>
      ${precioHTML(p)}
      <div class="prod-actions">
        ${stepper}
        <button type="button" class="btn btn--cta prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar<span class="prod-add__txt-largo"> al carrito</span></span></button>
      </div>
      ${completa ? `<button type="button" class="card__comprar" data-buy="${esc(p.id)}">Comprar ahora</button>` : ''}
    </div>
  </article>`;
}

function teselaHTML(p, clase = '') {
  const off = p.descuento > 0;
  const varia = new Set(p.ops.map(x => x.precio)).size > 1;
  return `<article class="tesela${clase ? ' ' + clase : ''}" data-animate="subir" style="${estiloEntrada.subir}" data-id="${esc(p.id)}">
    <button type="button" class="tesela__abrir" data-qv="${esc(p.id)}" aria-label="Ver detalle: ${esc(p.nombre)}"><img src="${esc(clase ? p.img : p.xs)}" width="${clase ? 960 : 480}" height="${clase ? 1200 : 600}" alt="${esc(p.alt)}"></button>
    ${badgesHTML(p)}
    <div class="tesela__info">
      <div><span class="tesela__nombre">${esc(p.nombre)}</span><span class="tesela__precio">${varia ? 'desde ' : ''}${formatearPrecio(desde(p))}${off ? `<s>${formatearPrecio(opMasBarata(p).precio)}</s>` : ''}</span></div>
      <button type="button" class="tesela__add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}</button>
    </div>
  </article>`;
}

function cantidadDe(btn) {
  const out = btn.closest('.card, .qv')?.querySelector('[data-stepper] output');
  return Math.max(1, parseInt(out?.textContent, 10) || 1);
}
function resetStepper(btn) {
  const out = btn.closest('.card, .qv')?.querySelector('[data-stepper] output');
  if (out) out.textContent = '1';
}
function agregar(id, qty, v, abrir = false) {
  const p = getProducto(id);
  if (!p) return;
  const sumados = Cart.add(p, qty, v);
  if (!sumados) { showToast(`No quedan más unidades de ${p.nombre} para sumar.`); if (abrir) openCartDrawer(); return; }
  if (abrir) openCartDrawer();
  else showToast(sumados === 1 ? `Sumaste ${p.nombre} al carrito.` : `Sumaste ${sumados} × ${p.nombre} al carrito.`);
}

document.addEventListener('click', e => {
  const step = e.target.closest('[data-step]');
  if (step) {
    const st = step.closest('[data-stepper]');
    const out = st?.querySelector('output');
    if (!out) return;
    const max = parseInt(st.dataset.max, 10) || 99;
    out.textContent = String(Math.min(max, Math.max(1, (parseInt(out.textContent, 10) || 1) + Number(step.dataset.step))));
    return;
  }
  const qv = e.target.closest('[data-qv]');
  if (qv) { e.preventDefault(); openQuickView(qv.dataset.qv, qv); return; }
  const add = e.target.closest('[data-add]');
  if (add) {
    const v = add.closest('.qv') ? add.closest('.qv').querySelector('input[name="qv-op"]:checked')?.value : null;
    agregar(add.dataset.add, cantidadDe(add), v);
    resetStepper(add);
    return;
  }
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    const v = buy.closest('.qv') ? buy.closest('.qv').querySelector('input[name="qv-op"]:checked')?.value : null;
    const q = cantidadDe(buy);
    if (buy.closest('.qv')) closeQuickView(false);
    agregar(buy.dataset.buy, q, v, true);
    resetStepper(buy);
    return;
  }
  if (e.target.closest('[data-abrir-carrito]')) { openCartDrawer(); }
});

let drawerUltimoFoco = null;
function construirDrawer() {
  if (document.getElementById('cartDrawer')) return;
  const bd = document.createElement('div');
  bd.className = 'drawer-backdrop';
  bd.id = 'drawerBackdrop';
  const d = document.createElement('aside');
  d.className = 'drawer';
  d.id = 'cartDrawer';
  d.setAttribute('role', 'dialog');
  d.setAttribute('aria-modal', 'true');
  d.setAttribute('aria-label', 'Tu carrito');
  d.setAttribute('inert', '');
  d.innerHTML = `<div class="drawer__head"><h2>Tu carrito</h2><button type="button" data-cerrar-carrito aria-label="Cerrar el carrito">${ICO.cerrar}</button></div>
    <div class="drawer__lista" id="cartLista"></div>
    <div class="drawer__pie" id="cartPie"></div>`;
  document.body.append(bd, d);
  bd.addEventListener('click', closeCartDrawer);
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { closeCartDrawer(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const { id, v } = linea.dataset;
    const it = Cart.get().find(i => i.id === id && i.v === v);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, v); return; }
    const st = e.target.closest('[data-cart-step]');
    if (st && it) Cart.setQty(id, v, it.qty + Number(st.dataset.cartStep));
  });
  d.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    if (e.target.closest('[data-volver-catalogo]') && PAGINA === 'catalogo') closeCartDrawer();
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeCartDrawer(); }
    atraparFoco(d, e);
  });
  document.addEventListener('cart:updated', renderCart);
  renderCart();
}

function mensajePedido() {
  const items = Cart.get();
  const lineas = items.map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const op = opDe(p, i.v);
    return `• ${i.qty} × ${p.nombre} (${op.v}) — ${formatearPrecio(precioOp(p, op) * i.qty)}`;
  }).filter(Boolean);
  return `${SALUDO} Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function renderCart() {
  const lista = document.getElementById('cartLista');
  const pie = document.getElementById('cartPie');
  if (!lista || !pie) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (!items.length) {
    lista.innerHTML = `<div class="drawer-vacio">${ICO.bolsa}<h3>Tu carrito está vacío</h3><p>Sumá tablas, utensilios o piezas de acero y armamos el pedido.</p><a class="btn btn--cta" href="${URL_CATALOGO}" data-volver-catalogo>Volver al catálogo${ICO.flecha}</a></div>`;
    pie.hidden = true;
    return;
  }
  pie.hidden = false;
  lista.innerHTML = items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<div class="linea-cart" data-linea data-id="${esc(p.id)}" data-v="${esc(op.v)}">
      <span class="linea-cart__img"><img src="${esc(p.xs)}" width="480" height="600" alt=""></span>
      <div><p class="linea-cart__nombre">${esc(p.nombre)}</p><p class="linea-cart__var">${esc(op.v)} · ${formatearPrecio(precioOp(p, op))} c/u</p>
        <div class="stepper"><button type="button" data-cart-step="-1" aria-label="Restar uno de ${esc(p.nombre)}">${ICO.menos}</button><span>${i.qty}</span><button type="button" data-cart-step="1" aria-label="Sumar uno de ${esc(p.nombre)}">${ICO.mas}</button></div></div>
      <div><p class="linea-cart__precio">${formatearPrecio(precioOp(p, op) * i.qty)}</p><button type="button" class="linea-cart__quitar" data-quitar aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.basura}</button></div>
    </div>`;
  }).join('');
  pie.innerHTML = `<div class="drawer__total"><span>Total</span><strong>${formatearPrecio(Cart.total())}</strong></div>
    <p class="drawer__nota">El envío o el retiro se coordinan por WhatsApp.</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra${ICO.flecha}</button>
    <a class="btn btn--ghost btn--wsp" href="${esc(wspLink(mensajePedido()))}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}

function openCartDrawer() {
  construirDrawer();
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || d.classList.contains('open')) return;
  drawerUltimoFoco = document.activeElement;
  renderCart();
  d.removeAttribute('inert');
  d.classList.add('open');
  bd.classList.add('open');
  bloquearScroll('drawer', true);
  setTimeout(() => d.querySelector('[data-cerrar-carrito]')?.focus(), 60);
}
function closeCartDrawer() {
  const d = document.getElementById('cartDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (!d || !d.classList.contains('open')) return;
  d.classList.remove('open');
  bd.classList.remove('open');
  d.setAttribute('inert', '');
  bloquearScroll('drawer', false);
  if (drawerUltimoFoco && document.contains(drawerUltimoFoco)) drawerUltimoFoco.focus();
}

let qvUltimoFoco = null;
function ldProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'BRASAL' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: desde(p), highPrice: hasta(p), offerCount: p.ops.length, availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}

function openQuickView(id, origen = null) {
  const p = getProducto(id);
  if (!p) return false;
  if (document.getElementById('lb')) closeLightbox(false);
  let bd = document.getElementById('qvBackdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'qv-backdrop';
    bd.id = 'qvBackdrop';
    bd.hidden = true;
    document.body.appendChild(bd);
    bd.addEventListener('click', e => { if (e.target === bd || e.target.closest('[data-cerrar-qv]')) closeQuickView(); });
    bd.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); closeQuickView(); }
      atraparFoco(bd, e);
    });
    bd.addEventListener('change', e => {
      if (e.target.name !== 'qv-op') return;
      const prod = getProducto(bd.dataset.id);
      const op = opDe(prod, e.target.value);
      bd.querySelector('[data-qv-precio]').innerHTML = precioHTML(prod, op);
      const wsp = bd.querySelector('[data-qv-wsp]');
      if (wsp) wsp.href = wspLink(`${SALUDO} Quiero consultar por ${prod.nombre} (${op.v}).`);
    });
  }
  if (bd.hidden) qvUltimoFoco = origen || document.activeElement;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const op0 = p.ops[0];
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  const relacionados = rel.length ? rel : Tienda.consultar({ filtros: { excluir: [p.id] }, limite: 3 }).items;
  const ops = p.ops.length > 1
    ? `<fieldset class="qv__ops"><legend>Elegí la medida</legend><div class="qv__ops-lista">${p.ops.map((op, i) => `<label class="op-pill"><input type="radio" name="qv-op" value="${esc(op.v)}"${i === 0 ? ' checked' : ''}><strong>${esc(op.v)}</strong><small>${formatearPrecio(precioOp(p, op))}</small></label>`).join('')}</div></fieldset>`
    : `<p class="qv__stock"><strong>Presentación:</strong> ${esc(op0.v)}<input type="radio" name="qv-op" value="${esc(op0.v)}" checked hidden></p>`;
  bd.dataset.id = p.id;
  bd.innerHTML = `<div class="qv" role="dialog" aria-modal="true" aria-label="${esc(p.nombre)}">
    <button type="button" class="qv__cerrar" data-cerrar-qv aria-label="Cerrar">${ICO.cerrar}</button>
    <div class="qv__media"><img src="${esc(p.img)}" width="960" height="1200" alt="${esc(p.alt)}">${badgesHTML(p)}</div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre || '')}</p>
      <h2>${esc(p.nombre)}</h2>
      <div data-qv-precio>${precioHTML(p, op0)}</div>
      <div class="qv__mats">${p.mats.map(m => `<span class="qv__mat">${ICO[m] || ''}${esc(MATERIALES[m]?.nombre || m)}</span>`).join('')}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${ops}
      <div class="qv__compra">
        <div class="stepper" data-stepper data-max="${p.stock}"><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><output>1</output><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta prod-add" data-add="${esc(p.id)}">${ICO.carrito}Agregar al carrito</button>
      </div>
      <div class="qv__secundarias">
        <button type="button" class="qv__comprar" data-buy="${esc(p.id)}">Comprar ahora</button>
        <a class="qv__wsp" data-qv-wsp href="${esc(wspLink(`${SALUDO} Quiero consultar por ${p.nombre} (${op0.v}).`))}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a>
      </div>
      ${p.stock <= 5 ? `<p class="qv__stock">${p.stock === 1 ? 'Queda 1 unidad.' : `Quedan ${p.stock} unidades.`}</p>` : ''}
      <p class="qv__cuidado">${ICO.gota}<span><strong>Cuidado:</strong> ${esc(MATERIALES[p.mats[0]]?.cuidado || '')}</span></p>
      <div class="qv__rel"><h3>También te puede interesar</h3><div class="qv__rel-lista">${relacionados.map(r => `<button type="button" class="qv__rel-item" data-qv="${esc(r.id)}"><span><img src="${esc(r.xs)}" width="480" height="600" alt=""></span><span>${esc(r.nombre)}</span></button>`).join('')}</div></div>
    </div>
  </div>`;
  bd.hidden = false;
  bloquearScroll('qv', true);
  ldProducto(p);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    history.replaceState(null, '', u);
  }
  setTimeout(() => bd.querySelector('.qv__cerrar')?.focus(), 40);
  return true;
}
function closeQuickView(devolverFoco = true) {
  const bd = document.getElementById('qvBackdrop');
  if (!bd || bd.hidden) return;
  bd.hidden = true;
  bd.innerHTML = '';
  bloquearScroll('qv', false);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    history.replaceState(null, '', u);
  }
  if (devolverFoco && qvUltimoFoco && document.contains(qvUltimoFoco)) qvUltimoFoco.focus();
}

let lbItems = [];
let lbIndice = 0;
let lbUltimoFoco = null;
function openLightbox(items, i) {
  lbItems = items;
  lbIndice = i;
  lbUltimoFoco = document.activeElement;
  let lb = document.getElementById('lb');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.id = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Trabajos realizados');
    lb.innerHTML = `<button type="button" class="lb__btn lb__cerrar" data-lb="cerrar" aria-label="Cerrar">${ICO.cerrar}</button>
      <button type="button" class="lb__btn lb__prev" data-lb="prev" aria-label="Foto anterior"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>
      <figure class="lb__fig"><img src="" alt=""><figcaption class="lb__pie"><span class="lb__titulo"></span><span class="lb__cuenta"></span><button type="button" class="btn btn--claro" data-lb="ver">Ver el producto${ICO.flecha}</button><span class="lb__nota">Imagen ilustrativa</span></figcaption></figure>
      <button type="button" class="lb__btn lb__next" data-lb="next" aria-label="Foto siguiente"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>`;
    document.body.appendChild(lb);
    lb.addEventListener('click', e => {
      const b = e.target.closest('[data-lb]');
      if (!b) { if (e.target === lb) closeLightbox(); return; }
      if (b.dataset.lb === 'cerrar') closeLightbox();
      if (b.dataset.lb === 'prev') pintarLightbox(lbIndice - 1);
      if (b.dataset.lb === 'next') pintarLightbox(lbIndice + 1);
      if (b.dataset.lb === 'ver') openQuickView(lbItems[lbIndice].producto, lbUltimoFoco);
    });
    lb.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.stopPropagation(); closeLightbox(); }
      if (e.key === 'ArrowLeft') pintarLightbox(lbIndice - 1);
      if (e.key === 'ArrowRight') pintarLightbox(lbIndice + 1);
      atraparFoco(lb, e);
    });
  }
  lb.hidden = false;
  bloquearScroll('lb', true);
  pintarLightbox(i);
  setTimeout(() => lb.querySelector('[data-lb="cerrar"]')?.focus(), 40);
}
function pintarLightbox(i) {
  const lb = document.getElementById('lb');
  if (!lb || !lbItems.length) return;
  lbIndice = (i + lbItems.length) % lbItems.length;
  const it = lbItems[lbIndice];
  const img = lb.querySelector('img');
  img.src = it.src;
  img.alt = it.alt;
  lb.querySelector('.lb__titulo').textContent = it.titulo;
  lb.querySelector('.lb__cuenta').textContent = `${lbIndice + 1} / ${lbItems.length}`;
}
function closeLightbox(devolverFoco = true) {
  const lb = document.getElementById('lb');
  if (!lb || lb.hidden) return;
  lb.hidden = true;
  bloquearScroll('lb', false);
  if (devolverFoco && lbUltimoFoco && document.contains(lbUltimoFoco)) lbUltimoFoco.focus();
}
const trabajosDe = nodos => [...nodos].map(n => ({ src: n.dataset.src, alt: n.dataset.alt || '', titulo: n.dataset.titulo || '', producto: n.dataset.producto }));

function initTrabajos() {
  const tiles = document.querySelectorAll('.trabajos1 [data-trabajo]');
  if (!tiles.length) return;
  const items = trabajosDe(tiles);
  tiles.forEach((t, i) => t.addEventListener('click', () => openLightbox(items, i)));
}

function initVisor() {
  const v = document.querySelector('[data-visor]');
  if (!v) return;
  const minis = [...v.querySelectorAll('[data-trabajo]')];
  const items = trabajosDe(minis);
  const img = v.querySelector('.visor__escena img');
  const titulo = v.querySelector('.visor__titulo');
  const cuenta = v.querySelector('.visor__cuenta');
  const ver = v.querySelector('.visor__ver');
  let i = 0;
  let t = 0;
  const pintar = () => {
    const it = items[i];
    img.src = it.src;
    img.alt = it.alt;
    titulo.textContent = it.titulo;
    cuenta.textContent = `${i + 1} / ${items.length}`;
    ver.dataset.qv = it.producto;
    img.classList.remove('saliendo');
  };
  const ir = n => {
    i = (n + items.length) % items.length;
    minis.forEach((m, k) => m.setAttribute('aria-pressed', k === i ? 'true' : 'false'));
    clearTimeout(t);
    if (reduceMotion) { pintar(); return; }
    img.classList.add('saliendo');
    t = setTimeout(pintar, 230);
  };
  minis.forEach((m, k) => m.addEventListener('click', () => ir(k)));
  v.querySelector('[data-visor-prev]')?.addEventListener('click', () => ir(i - 1));
  v.querySelector('[data-visor-next]')?.addEventListener('click', () => ir(i + 1));
  v.querySelector('.visor__ampliar')?.addEventListener('click', () => openLightbox(items, i));
}

function initCategoriasMenu() {
  const listas = document.querySelectorAll('[data-cats-lista]');
  if (!listas.length) return;
  const actual = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  const html = CATEGORIAS.map(c => `<li class="nav-dd__item"><a href="${URL_CATALOGO}?cat=${c.id}"${actual === c.id ? ' aria-current="page"' : ''}><img src="${esc(c.xs)}" width="52" height="52" alt=""><span><span class="nav-dd__nombre">${esc(c.nombre)}</span><span class="nav-dd__cant">${plural(Tienda.contar({ cat: c.id }), 'producto', 'productos')}</span></span></a></li>`).join('');
  listas.forEach(l => { l.innerHTML = html; });
  const desk = window.matchMedia('(min-width: 901px)');
  document.querySelectorAll('[data-dd]').forEach(dd => {
    const btn = dd.querySelector('.nav-dd__btn');
    const panel = dd.querySelector('.nav-dd__panel');
    if (!btn || !panel) return;
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    dd.addEventListener('mouseenter', () => { if (desk.matches) abrir(); });
    dd.addEventListener('mouseleave', () => { if (desk.matches) t = setTimeout(cerrar, 140); });
    document.addEventListener('click', e => { if (desk.matches && !dd.contains(e.target)) cerrar(); });
    dd.addEventListener('focusout', e => { if (desk.matches && !dd.contains(e.relatedTarget)) cerrar(); });
    dd.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); cerrar(); btn.focus(); } });
    desk.addEventListener('change', cerrar);
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 901px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    bloquearScroll('nav', true);
    nav.querySelector('a, button.nav-dd__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  nav.addEventListener('keydown', e => { if (nav.classList.contains('open')) atraparFoco(nav, e); });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-buscar-toggle]');
  if (!btn) return;
  const panel = document.getElementById('hdrSearch');
  btn.addEventListener('click', () => {
    const q = document.getElementById('catQ');
    if (q) { q.scrollIntoView({ block: 'center' }); q.focus(); return; }
    if (!panel) { location.href = URL_CATALOGO; return; }
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) panel.querySelector('input')?.focus();
  });
  panel?.addEventListener('keydown', e => { if (e.key === 'Escape') { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.focus(); } });
}

function initCategoriasHome() {
  const cont = document.querySelector('[data-cats-home]');
  if (!cont) return;
  cont.innerHTML = CATEGORIAS.map(c => {
    const n = plural(Tienda.contar({ cat: c.id }), 'producto', 'productos');
    if (MODELO === '2') return `<a class="coleccion" href="${URL_CATALOGO}?cat=${c.id}" data-animate="subir" style="${estiloEntrada.subir}"><img src="${esc(c.img)}" width="960" height="1200" alt=""><span class="coleccion__txt"><span class="coleccion__nombre">${esc(c.nombre)}</span><span class="coleccion__cant">${n}${ICO.flecha}</span></span></a>`;
    return `<a class="cat-tile" href="${URL_CATALOGO}?cat=${c.id}" data-animate="subir" style="${estiloEntrada.subir}"><span class="cat-tile__img"><img src="${esc(c.xs)}" width="72" height="72" alt=""></span><span class="cat-tile__txt"><span class="cat-tile__nombre">${esc(c.nombre)}</span><span class="cat-tile__cant">${n}</span></span>${ICO.flecha}</a>`;
  }).join('');
}

let idsRail = [];
function initRail() {
  const track = document.querySelector('[data-rail]');
  if (!track) return;
  const items = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 }).items;
  items.forEach(p => cacheProductos.set(p.id, p));
  idsRail = items.map(p => p.id);
  track.innerHTML = items.map(p => cardHTML(p, { entrada: 'der', modo: 'rail' })).join('');
  const vp = track.closest('.rail-vp');
  const sec = track.closest('section');
  const prev = sec?.querySelector('[data-rail-prev]');
  const next = sec?.querySelector('[data-rail-next]');
  if (!vp) return;
  const paso = () => {
    const c = track.querySelector('.card');
    return c ? c.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 18) : vp.clientWidth * .8;
  };
  const actualizar = () => {
    if (prev) prev.disabled = vp.scrollLeft <= 4;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 4;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
  actualizar();
  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null, matar = false;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; matar = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
  });
  const fin = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
    if (!moved) return;
    matar = true;
    const destino = Math.round(vp.scrollLeft / paso()) * paso();
    vp.classList.remove('dragging');
    vp.scrollTo({ left: destino, behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(() => { matar = false; }, 50);
  };
  vp.addEventListener('pointerup', fin);
  vp.addEventListener('pointercancel', fin);
  vp.addEventListener('lostpointercapture', fin);
  vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const limite = MODELO === '2' ? 6 : 8;
  const items = Tienda.consultar({ filtros: { excluir: idsRail }, orden: 'nuevos', limite }).items;
  items.forEach(p => cacheProductos.set(p.id, p));
  if (MODELO === '2') {
    cont.innerHTML = items.map((p, i) => teselaHTML(p, i === 0 ? 'tesela--a' : i === 3 ? 'tesela--b' : '')).join('');
  } else {
    cont.innerHTML = items.map(p => cardHTML(p, { modo: 'grilla' })).join('');
  }
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const filtros = document.getElementById('filtros');
  const form = document.getElementById('catBuscar');
  const inputQ = document.getElementById('catQ');
  const selOrden = document.getElementById('catOrden');
  const verMas = document.getElementById('catVerMas');
  const verMasTxt = document.getElementById('catVerMasTxt');
  const contador = document.getElementById('catContador');
  const chips = document.getElementById('catChips');
  const vacio = document.getElementById('catVacio');
  const migaCat = document.getElementById('migaCat');
  const btnFiltrar = document.getElementById('btnFiltrar');
  const nFiltros = document.getElementById('nFiltros');
  const verResultados = document.getElementById('verResultados');
  const params = new URLSearchParams(location.search);
  const estado = {
    cat: CATEGORIAS.some(c => c.id === params.get('cat')) ? params.get('cat') : '',
    material: (params.get('material') || '').split(',').filter(m => MATERIALES[m]),
    precio: RANGOS[params.get('precio')] ? params.get('precio') : '',
    stock: params.get('stock') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const grupoCat = filtros.querySelector('[data-grupo="cat"] .filtros__opciones');
  const grupoMat = filtros.querySelector('[data-grupo="material"] .filtros__opciones');
  const grupoPrecio = filtros.querySelector('[data-grupo="precio"] .filtros__opciones');
  grupoCat.innerHTML = `<label class="opcion"><input type="radio" name="f-cat" data-f="cat" value=""><span>Todas</span><span class="opcion__cant" data-cant-cat=""></span></label>` +
    CATEGORIAS.map(c => `<label class="opcion"><input type="radio" name="f-cat" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><span class="opcion__cant" data-cant-cat="${c.id}"></span></label>`).join('');
  grupoMat.innerHTML = Object.entries(MATERIALES).map(([id, m]) => `<label class="opcion"><input type="checkbox" data-f="material" value="${id}"><span>${esc(m.nombre)}</span><span class="opcion__cant" data-cant-mat="${id}"></span></label>`).join('');
  grupoPrecio.innerHTML = `<label class="opcion"><input type="radio" name="f-precio" data-f="precio" value=""><span>Todos los precios</span></label>` +
    Object.entries(RANGOS).map(([id, r]) => `<label class="opcion"><input type="radio" name="f-precio" data-f="precio" value="${id}"><span>${esc(r.nombre)}</span><span class="opcion__cant" data-cant-precio="${id}"></span></label>`).join('');
  selOrden.innerHTML = Object.entries(ORDENES).map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join('');

  const filtrosDe = (e = estado, sin = '') => {
    const f = {};
    if (e.cat && sin !== 'cat') f.cat = e.cat;
    if (e.material.length && sin !== 'material') f.material = e.material;
    if (e.precio && sin !== 'precio') { f.precioMin = RANGOS[e.precio].min; f.precioMax = RANGOS[e.precio].max; }
    if (e.stock) f.stock = true;
    return f;
  };
  const activos = () => (estado.cat ? 1 : 0) + estado.material.length + (estado.precio ? 1 : 0) + (estado.stock ? 1 : 0);

  const sincronizarUI = () => {
    filtros.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = i.value === estado.cat; });
    filtros.querySelectorAll('input[data-f="material"]').forEach(i => { i.checked = estado.material.includes(i.value); });
    filtros.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === estado.precio; });
    const st = filtros.querySelector('input[data-f="stock"]');
    if (st) st.checked = estado.stock;
    inputQ.value = estado.q;
    selOrden.value = estado.orden;
    filtros.querySelectorAll('[data-cant-cat]').forEach(s => { s.textContent = Tienda.contar({ ...filtrosDe(estado, 'cat'), ...(s.dataset.cantCat ? { cat: s.dataset.cantCat } : {}) }); });
    filtros.querySelectorAll('[data-cant-mat]').forEach(s => { s.textContent = Tienda.contar({ ...filtrosDe(estado, 'material'), material: [s.dataset.cantMat] }); });
    filtros.querySelectorAll('[data-cant-precio]').forEach(s => { const r = RANGOS[s.dataset.cantPrecio]; s.textContent = Tienda.contar({ ...filtrosDe(estado, 'precio'), precioMin: r.min, precioMax: r.max }); });
    const cat = CATEGORIAS.find(c => c.id === estado.cat);
    if (migaCat) { migaCat.hidden = !cat; migaCat.querySelector('span').textContent = cat ? cat.nombre : ''; }
    document.querySelectorAll('[data-cats-lista] a').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const n = activos();
    if (nFiltros) { nFiltros.textContent = n; nFiltros.hidden = !n; }
    const quitar = [];
    if (cat) quitar.push({ k: 'cat', v: '', txt: cat.nombre });
    estado.material.forEach(m => quitar.push({ k: 'material', v: m, txt: MATERIALES[m].nombre }));
    if (estado.precio) quitar.push({ k: 'precio', v: '', txt: RANGOS[estado.precio].nombre });
    if (estado.stock) quitar.push({ k: 'stock', v: '', txt: 'Con stock' });
    if (estado.q) quitar.push({ k: 'q', v: '', txt: `«${estado.q}»` });
    chips.innerHTML = quitar.map(c => `<button type="button" class="chip-activa" data-quitar-k="${c.k}" data-quitar-v="${esc(c.v)}" aria-label="Quitar filtro ${esc(c.txt)}">${esc(c.txt)}${ICO.cerrar}</button>`).join('') +
      (quitar.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };

  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'material', 'precio', 'stock', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.material.length) u.searchParams.set('material', estado.material.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    history.replaceState(null, '', u);
  };

  const pintar = (agregarMas = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregarMas ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(p => cacheProductos.set(p.id, p));
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregarMas) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    mostrados = agregarMas ? mostrados + res.items.length : res.items.length;
    cursor = res.cursor;
    verMas.hidden = !cursor;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    if (verMasTxt) verMasTxt.textContent = total ? `Mostrando ${mostrados} de ${total}` : `Mostrando ${mostrados}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (estado.q) contador.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
    else contador.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}`;
    if (verResultados) verResultados.textContent = mostrados ? `Ver ${estado.q ? mostrados : total} ${(estado.q ? mostrados : total) === 1 ? 'resultado' : 'resultados'}` : 'Sin resultados';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  filtros.addEventListener('change', e => {
    const i = e.target;
    if (!i.dataset.f) return;
    if (i.dataset.f === 'cat') estado.cat = i.value;
    if (i.dataset.f === 'precio') estado.precio = i.value;
    if (i.dataset.f === 'stock') estado.stock = i.checked;
    if (i.dataset.f === 'material') estado.material = [...filtros.querySelectorAll('input[data-f="material"]:checked')].map(x => x.value);
    aplicar();
  });
  const limpiar = () => { estado.cat = ''; estado.material = []; estado.precio = ''; estado.stock = false; estado.q = ''; aplicar(); };
  document.addEventListener('click', e => {
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    const q = e.target.closest('[data-quitar-k]');
    if (!q) return;
    const k = q.dataset.quitarK;
    if (k === 'material') estado.material = estado.material.filter(m => m !== q.dataset.quitarV);
    else if (k === 'stock') estado.stock = false;
    else estado[k] = '';
    aplicar();
  });
  form.addEventListener('submit', e => { e.preventDefault(); estado.q = inputQ.value.trim().slice(0, 60); aplicar(); });
  let tq = 0;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { const v = inputQ.value.trim().slice(0, 60); if (v !== estado.q) { estado.q = v; aplicar(); } }, 280); });
  selOrden.addEventListener('change', () => { estado.orden = ORDENES[selOrden.value] ? selOrden.value : 'destacados'; aplicar(); });
  verMas.querySelector('button').addEventListener('click', () => pintar(true));

  let filtrosFoco = null;
  const abrirFiltros = () => {
    filtrosFoco = document.activeElement;
    filtros.classList.add('open');
    filtros.removeAttribute('inert');
    bloquearScroll('filtros', true);
    btnFiltrar?.setAttribute('aria-expanded', 'true');
    let bd = document.querySelector('.filtros-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop filtros-backdrop'; document.body.appendChild(bd); bd.addEventListener('click', cerrarFiltros); }
    bd.style.zIndex = '115';
    bd.classList.add('open');
    setTimeout(() => filtros.querySelector('.filtros__head button')?.focus(), 60);
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open');
    if (!window.matchMedia('(min-width: 901px)').matches) filtros.setAttribute('inert', '');
    bloquearScroll('filtros', false);
    btnFiltrar?.setAttribute('aria-expanded', 'false');
    document.querySelector('.filtros-backdrop')?.classList.remove('open');
    if (filtrosFoco && document.contains(filtrosFoco)) filtrosFoco.focus();
  };
  btnFiltrar?.addEventListener('click', abrirFiltros);
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  filtros.addEventListener('keydown', e => { if (filtros.classList.contains('open')) { if (e.key === 'Escape') cerrarFiltros(); atraparFoco(filtros, e); } });
  const mq = window.matchMedia('(min-width: 901px)');
  const syncFiltros = () => { if (mq.matches) { filtros.removeAttribute('inert'); cerrarFiltros(); } else if (!filtros.classList.contains('open')) filtros.setAttribute('inert', ''); };
  mq.addEventListener('change', syncFiltros);
  syncFiltros();
  if (mq.matches) {
    filtros.querySelectorAll('.filtros__grupo, .filtros__pie').forEach(g => { g.dataset.animate = 'subir'; g.style.opacity = '0'; g.style.transform = 'translateY(24px)'; });
  }

  sincronizarUI();
  pintar();
}

function abrirProductoDeURL() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) openQuickView(id);
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero1, .hero2');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.linea'), { scaleX: 0, transformOrigin: '0 50%', duration: .9, clearProps: 'transform' }, .05)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter,transform,opacity' }, .15)
    .from(hero.querySelectorAll('.hero-kicker'), { y: 22, opacity: 0, duration: .9, clearProps: 'transform,opacity' }, .32)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, .42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: .9, stagger: .12, clearProps: 'transform,opacity' }, .55)
    .from(hero.querySelectorAll('.hero-mats li'), { y: 14, opacity: 0, duration: .8, stagger: .08, clearProps: 'transform,opacity' }, .7)
    .from(hero.querySelectorAll('.sello'), { scale: .92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, .65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const bg = document.querySelector('.marca2__bg img');
  if (bg) gsap.fromTo(bg, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: bg.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
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

Cart.limpiar();
initCategoriasMenu();
initCategoriasHome();
initRail();
initPreview();
initCatalogo();
initReveals();
initNav();
initBuscadorHeader();
initTrabajos();
initVisor();
initFloats();
initModelBarScroll();
initHeroMotion();
initParallax();
updateCartBadge();
abrirProductoDeURL();
