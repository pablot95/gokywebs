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

const WSP = '5493513187917';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'hogar', nombre: 'Hogar y deco', corto: 'Hogar', bajada: 'Luz, aromas y textiles para tu casa.', img: 'images/p-lampara.webp', alt: 'Lámpara de mesa blanca encendida sobre un mueble de madera' },
  { id: 'electro', nombre: 'Pequeños electro', corto: 'Electro', bajada: 'Cafetera, licuadora y pava para todos los días.', img: 'images/p-licuadora.webp', alt: 'Licuadora portátil blanca sobre una mesada, junto a un bowl de frutillas' },
  { id: 'accesorios', nombre: 'Accesorios', corto: 'Accesorios', bajada: 'Carteras, tecnología y lo que llevás encima.', img: 'images/p-bandolera.webp', alt: 'Cartera bandolera matelassé color crema con cadena dorada' },
  { id: 'joyas', nombre: 'Joyas', corto: 'Joyas', bajada: 'Collares, aros, anillos y pulseras.', img: 'images/p-set-joyas.webp', alt: 'Collar con dije de piedra y aros a juego, dorados, sobre lino' },
  { id: 'perfumes', nombre: 'Perfumes', corto: 'Perfumes', bajada: 'Para vos y para tu casa.', img: 'images/p-perfume.webp', alt: 'Frasco de perfume de vidrio con tapa negra sobre piedra clara' },
  { id: 'bienestar', nombre: 'Salud y bienestar', corto: 'Bienestar', bajada: 'Pequeños rituales para cuidarte.', img: 'images/p-rodillo.webp', alt: 'Rodillo facial de cuarzo rosa sobre mármol' },
];
const RANGOS = {
  hasta20: { nombre: 'Hasta $20.000', max: 19999 },
  '20a40': { nombre: '$20.000 a $40.000', min: 20000, max: 40000 },
  mas40: { nombre: 'Más de $40.000', min: 40001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Novedades', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { 'Tamaño': 'Elegí el tamaño', Color: 'Elegí el color', Capacidad: 'Elegí la capacidad', 'Opción': 'Elegí qué llevás', Aroma: 'Elegí el aroma' };

const PRODUCTOS = [
  { id: 'bandolera-matelasse', nombre: 'Cartera bandolera matelassé', cat: 'accesorios', tipo: null, ops: [{ v: 'Crema', precio: 44900 }],
    descuento: 0, stock: 5, tendencia: true, rango: 1, alta: 8, img: 'images/p-bandolera.webp', alt: 'Cartera bandolera matelassé color crema con cadena dorada sobre un pedestal de cemento',
    desc: 'Matelassé símil cuero con cierre de broche dorado. Correa de cadena y cuero para llevarla cruzada o al hombro.', tags: ['cartera', 'bolso', 'mujer', 'moda'] },
  { id: 'difusor-aromas', nombre: 'Difusor de aromas ultrasónico', cat: 'hogar', tipo: null, ops: [{ v: '300 ml', precio: 32900 }],
    descuento: 0, stock: 14, tendencia: true, rango: 2, alta: 7, img: 'images/p-difusor.webp', alt: 'Difusor de aromas de cerámica blanca soltando vapor sobre una mesa de luz',
    desc: 'Humidifica y perfuma el ambiente con unas gotas de esencia. Tanque de 300 ml, luz cálida opcional y apagado automático cuando se queda sin agua.', tags: ['humidificador', 'aromaterapia', 'esencias', 'vapor', 'dormitorio'] },
  { id: 'cafetera-compacta', nombre: 'Cafetera compacta de una taza', cat: 'electro', tipo: null, ops: [{ v: 'Blanca', precio: 89900 }],
    descuento: 10, stock: 6, tendencia: true, rango: 3, alta: 6, img: 'images/p-cafetera.webp', alt: 'Cafetera compacta blanca sirviendo café en una taza azul',
    desc: 'Prepara una taza por vez y ocupa poco lugar en la mesada. Bandeja removible para lavarla fácil.', tags: ['cafe', 'desayuno', 'cocina', 'taza'] },
  { id: 'set-punto-luz', nombre: 'Set collar y aros punto de luz', cat: 'joyas', tipo: 'Opción', ops: [{ v: 'Set completo', precio: 29900 }, { v: 'Solo collar', precio: 18900 }, { v: 'Solo aros', precio: 13900 }],
    descuento: 0, stock: 11, tendencia: true, rango: 4, alta: 5, img: 'images/p-set-joyas.webp', alt: 'Collar con dije de piedra y aros a juego, dorados, sobre lino',
    desc: 'Dije redondo con piedra facetada y aros pasantes a juego, en tono dorado. Cadena de 45 cm.', tags: ['collar', 'aros', 'cadena', 'dije', 'regalo', 'dorado'] },
  { id: 'lampara-recargable', nombre: 'Lámpara de mesa recargable', cat: 'hogar', tipo: null, ops: [{ v: 'Blanca', precio: 38900 }],
    descuento: 0, stock: 9, tendencia: true, rango: 5, alta: 4, img: 'images/p-lampara.webp', alt: 'Lámpara de mesa blanca tipo hongo encendida sobre un mueble de madera',
    desc: 'Sin cables: se carga por USB-C y va de la mesa de luz al balcón. Tres intensidades de luz cálida con un toque.', tags: ['luz', 'velador', 'led', 'usb', 'deco'] },
  { id: 'auriculares-inalambricos', nombre: 'Auriculares inalámbricos con estuche de carga', cat: 'accesorios', tipo: null, ops: [{ v: 'Blancos', precio: 34900 }],
    descuento: 15, stock: 20, tendencia: true, rango: 6, alta: 3, img: 'images/p-auriculares.webp', alt: 'Auriculares inalámbricos blancos junto a su estuche de carga abierto',
    desc: 'Conexión Bluetooth, almohadillas de silicona en tres medidas y un estuche que los carga mientras los guardás.', tags: ['bluetooth', 'musica', 'celular', 'tecnologia'] },
  { id: 'perfume-amaderado', nombre: 'Eau de parfum amaderado', cat: 'perfumes', tipo: 'Tamaño', ops: [{ v: '50 ml', precio: 39900 }, { v: '100 ml', precio: 59900 }],
    descuento: 0, stock: 9, tendencia: true, rango: 7, alta: 2, img: 'images/p-perfume.webp', alt: 'Frasco de perfume de vidrio con tapa negra sobre piedra clara',
    desc: 'Salida cítrica y fondo de maderas suaves. Frasco de vidrio con tapa negra.', tags: ['perfume', 'fragancia', 'unisex', 'amaderado'] },
  { id: 'licuadora-portatil', nombre: 'Licuadora portátil recargable', cat: 'electro', tipo: null, ops: [{ v: '380 ml', precio: 27900 }],
    descuento: 0, stock: 18, tendencia: true, rango: 8, alta: 1, img: 'images/p-licuadora.webp', alt: 'Licuadora portátil blanca sobre una mesada, junto a un bowl de frutillas',
    desc: 'Licuados y batidos donde estés: vaso de 380 ml, cuchillas de acero y carga por USB-C. La manija de silicona sirve para colgarla.', tags: ['batidos', 'licuados', 'jugo', 'usb', 'gym'] },
  { id: 'anteojos-sol', nombre: 'Anteojos de sol cuadrados', cat: 'accesorios', tipo: 'Color', ops: [{ v: 'Rojo', precio: 24900 }, { v: 'Carey', precio: 24900 }],
    descuento: 0, stock: 12, tendencia: true, rango: 9, alta: 24, img: 'images/p-anteojos.webp', alt: 'Dos anteojos de sol cuadrados, uno rojo y uno carey, sobre una superficie blanca',
    desc: 'Armazón de acetato con lentes oscuros. En rojo o carey.', tags: ['lentes', 'gafas', 'verano', 'sol', 'moda'] },
  { id: 'pinzas-pelo', nombre: 'Pinzas para el pelo, pack x 2', cat: 'accesorios', tipo: null, ops: [{ v: 'Carey y animal print', precio: 8900 }],
    descuento: 0, stock: 30, tendencia: true, rango: 10, alta: 18, img: 'images/p-pinzas.webp', alt: 'Pinza para el pelo color caramelo y pinza chica blanca y negra',
    desc: 'Una pinza grande color caramelo translúcido y una chica en blanco y negro. Agarran bien y no tironean.', tags: ['pelo', 'pinza', 'hebilla', 'broche'] },
  { id: 'rodillo-cuarzo', nombre: 'Rodillo facial de cuarzo rosa', cat: 'bienestar', tipo: null, ops: [{ v: 'Doble cabezal', precio: 13900 }],
    descuento: 0, stock: 17, tendencia: true, rango: 11, alta: 17, img: 'images/p-rodillo.webp', alt: 'Rodillo facial de cuarzo rosa con estructura dorada sobre mármol',
    desc: 'Doble cabezal de cuarzo rosa para masajear el rostro mientras aplicás tu crema. Guardalo en la heladera para un efecto más fresco.', tags: ['facial', 'skincare', 'masaje', 'cuarzo', 'rostro'] },
  { id: 'almohadones', nombre: 'Almohadón de pana o lino 45 × 45', cat: 'hogar', tipo: 'Color', ops: [{ v: 'Rosa viejo', precio: 12900 }, { v: 'Chocolate', precio: 12900 }, { v: 'Rayado natural', precio: 13900 }],
    descuento: 0, stock: 16, alta: 26, img: 'images/p-almohadones.webp', alt: 'Almohadones apilados: uno rayado natural, uno de pana chocolate y uno rosa viejo',
    desc: 'Funda con cierre y relleno incluido. Pana suave en rosa viejo o chocolate, o lino rayado en tono natural.', tags: ['almohadon', 'cojin', 'sillon', 'textil', 'living'] },
  { id: 'pava-electrica', nombre: 'Pava eléctrica de vidrio 1,7 L', cat: 'electro', tipo: null, ops: [{ v: '1,7 L', precio: 46900 }],
    descuento: 0, stock: 8, alta: 25, img: 'images/p-pava.webp', alt: 'Pava eléctrica de vidrio con base negra junto a una taza',
    desc: 'Jarra de vidrio con base giratoria y corte automático al hervir. Para el mate, el té o el café de filtro.', tags: ['mate', 'te', 'agua', 'cocina', 'hervidor'] },
  { id: 'reloj-inteligente', nombre: 'Reloj inteligente con malla de silicona', cat: 'accesorios', tipo: null, ops: [{ v: 'Rosa y blanco', precio: 54900 }],
    descuento: 0, stock: 4, alta: 23, img: 'images/p-smartwatch.webp', alt: 'Reloj inteligente con caja rosa y malla blanca de silicona',
    desc: 'Notificaciones del celular, pasos y ritmo cardíaco en la muñeca. Malla de silicona blanca intercambiable.', tags: ['smartwatch', 'reloj', 'tecnologia', 'deporte', 'celular'] },
  { id: 'anillos-finos', nombre: 'Anillos finos combinables, set x 6', cat: 'joyas', tipo: null, ops: [{ v: 'Set x 6', precio: 16900 }],
    descuento: 0, stock: 15, alta: 22, img: 'images/p-anillos.webp', alt: 'Anillos finos dorados apilados sobre un plato de vidrio',
    desc: 'Seis anillos finos dorados de distintos diseños, para combinar en varios dedos.', tags: ['anillo', 'dorado', 'regalo', 'bijou'] },
  { id: 'perfume-floral', nombre: 'Eau de parfum floral', cat: 'perfumes', tipo: 'Tamaño', ops: [{ v: '50 ml', precio: 36900 }, { v: '100 ml', precio: 54900 }],
    descuento: 0, stock: 7, alta: 21, img: 'images/p-perfume-rosa.webp', alt: 'Frasco de perfume rosado con tapa dorada visto desde arriba',
    desc: 'Notas de rosa y flores blancas sobre un fondo dulce y suave. Frasco rosado con tapa dorada.', tags: ['perfume', 'fragancia', 'mujer', 'floral'] },
  { id: 'aceites-esenciales', nombre: 'Aceites esenciales, set x 3', cat: 'bienestar', tipo: null, ops: [{ v: 'Lavanda, eucalipto y naranja', precio: 16900 }],
    descuento: 0, stock: 20, alta: 20, img: 'images/p-aceites.webp', alt: 'Tres frascos ámbar de aceites esenciales sobre fondo blanco',
    desc: 'Tres frascos de 10 ml para usar en el difusor de aromas o en un baño de inmersión.', nota: 'Uso externo y aromático. No ingerir y mantener fuera del alcance de los niños.',
    tags: ['aromaterapia', 'esencias', 'difusor', 'lavanda', 'eucalipto'] },
  { id: 'velas-soja', nombre: 'Velas de soja en vaso de vidrio', cat: 'hogar', tipo: 'Tamaño', ops: [{ v: 'Chica · 180 g', precio: 9900 }, { v: 'Grande · 400 g', precio: 15900 }],
    descuento: 0, stock: 22, alta: 19, img: 'images/p-velas.webp', alt: 'Velas blancas en vasos de vidrio, una de ellas encendida',
    desc: 'Cera de soja en vaso de vidrio transparente, con aroma suave a algodón y mecha de algodón.', tags: ['vela', 'aroma', 'deco', 'regalo'] },
  { id: 'botella-termica', nombre: 'Botella térmica de acero', cat: 'accesorios', tipo: 'Capacidad', ops: [{ v: '500 ml', precio: 19900 }, { v: '750 ml', precio: 23900 }],
    descuento: 0, stock: 25, alta: 16, img: 'images/p-botella.webp', alt: 'Botella térmica verde salvia con tapa de acero',
    desc: 'Doble pared de acero inoxidable: mantiene el agua fría o el café caliente por horas. Verde salvia con terminación mate.', tags: ['termo', 'agua', 'gym', 'oficina', 'acero'] },
  { id: 'cargador-inalambrico', nombre: 'Base de carga inalámbrica', cat: 'accesorios', tipo: null, ops: [{ v: 'Mármol y dorado', precio: 21900 }],
    descuento: 0, stock: 10, alta: 15, img: 'images/p-cargador.webp', alt: 'Celular apoyado sobre una base de carga redonda de mármol y dorado',
    desc: 'Apoyás el celular y carga, sin enchufar nada. Para teléfonos compatibles con carga inalámbrica.', tags: ['cargador', 'celular', 'tecnologia', 'escritorio'] },
  { id: 'argollas-perla', nombre: 'Argollas con perla barroca', cat: 'joyas', tipo: null, ops: [{ v: 'Par', precio: 15900 }],
    descuento: 0, stock: 3, alta: 14, img: 'images/p-aros-perla.webp', alt: 'Argollas doradas con perla colgante sobre una bandeja blanca',
    desc: 'Argollas chicas en tono dorado con una perla barroca colgante. Livianas, para usar todos los días.', tags: ['aros', 'perlas', 'argollas', 'dorado', 'regalo'] },
  { id: 'pulsera-eslabones', nombre: 'Pulsera de eslabones con strass', cat: 'joyas', tipo: null, ops: [{ v: '19 cm', precio: 22900 }],
    descuento: 0, stock: 0, alta: 13, img: 'images/p-pulsera.webp', alt: 'Pulsera dorada de eslabones con strass en su caja',
    desc: 'Eslabones dorados con detalle de strass y cierre de seguridad. Viene en caja, lista para regalar.', tags: ['pulsera', 'dorado', 'regalo', 'strass'] },
  { id: 'bruma-corporal', nombre: 'Bruma corporal 100 ml', cat: 'perfumes', tipo: null, ops: [{ v: '100 ml', precio: 14900 }],
    descuento: 10, stock: 2, alta: 12, img: 'images/p-bruma.webp', alt: 'Frasco de bruma corporal con etiqueta blanca sobre fondo beige',
    desc: 'Perfume liviano para el cuerpo y el pelo, para retocar durante el día.', tags: ['body splash', 'splash', 'perfume', 'fragancia'] },
  { id: 'difusor-varillas', nombre: 'Perfume para ambientes con varillas', cat: 'perfumes', tipo: 'Aroma', ops: [{ v: 'Lavanda', precio: 17900 }, { v: 'Vainilla', precio: 17900 }, { v: 'Limón', precio: 17900 }],
    descuento: 0, stock: 13, alta: 11, img: 'images/p-difusor-varillas.webp', alt: 'Difusor de varillas de madera en un frasco de vidrio con líquido aromático',
    desc: 'Frasco de 125 ml con varillas que perfuman el ambiente de forma continua. Dalas vuelta para intensificar el aroma.', tags: ['difusor', 'aromatizante', 'varillas', 'casa', 'aroma'] },
  { id: 'crema-corporal', nombre: 'Crema corporal hidratante 250 ml', cat: 'bienestar', tipo: null, ops: [{ v: '250 ml', precio: 12900 }],
    descuento: 0, stock: 19, alta: 10, img: 'images/p-crema.webp', alt: 'Frasco blanco de crema corporal con válvula dosificadora',
    desc: 'Textura liviana que se absorbe rápido. Frasco con válvula dosificadora.', tags: ['crema', 'hidratante', 'piel', 'cuerpo', 'skincare'] },
  { id: 'vajilla-gres', nombre: 'Set de plato, taza y cuencos de gres', cat: 'hogar', tipo: null, ops: [{ v: 'Set x 4', precio: 24900 }],
    descuento: 0, stock: 7, alta: 9, img: 'images/p-vajilla.webp', alt: 'Plato, taza y dos cuencos de gres blanco moteado',
    desc: 'Plato playo, taza y dos cuencos en gres blanco moteado con borde natural.', tags: ['vajilla', 'taza', 'plato', 'bowl', 'cocina', 'ceramica'] },
  { id: 'organizador-maquillaje', nombre: 'Organizador de maquillaje giratorio', cat: 'bienestar', tipo: null, ops: [{ v: 'Transparente', precio: 19900 }],
    descuento: 0, stock: 0, alta: 27, visible: false, img: 'images/p-crema.webp', alt: 'Próximo ingreso', desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.tendencia && !p.tendencia) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
    textoBusqueda.set(p.id, norm([p.nombre, cat?.nombre, cat?.corto, p.desc, p.tipo, ...p.ops.map(op => op.v), ...(p.tags || [])].join(' ')));
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
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];
const catDe = id => CATEGORIAS.find(c => c.id === id) || null;
const preciosDistintos = p => new Set(p.ops.map(op => op.precio)).size > 1;

const Cart = {
  KEY: 'tiendanovex_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && getProducto(i.id) && i.qty > 0) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento, el carrito vive en la página */ }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const op = opDe(producto, v).v;
    const tope = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, v: op, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
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

const ICO = {
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  tend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  tacho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(44px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

function badgesHTML(p) {
  const b = [];
  if (!(p.stock > 0)) b.push('<span class="badge badge--sin">Sin stock</span>');
  if (p.tendencia) b.push(`<span class="badge badge--tend">${ICO.tend}En tendencia</span>`);
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--ult">Últimas unidades</span>');
  return b.length ? `<div class="pcard__badges">${b.join('')}</div>` : '';
}

function precioHTML(p, op = null) {
  if (op) {
    const final = precioOp(p, op);
    return `<span class="precio${p.descuento > 0 ? ' precio--off' : ''}">${formatearPrecio(final)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}`;
  }
  const min = precioDesde(p);
  const orig = Math.min(...p.ops.map(o => o.precio));
  return `${preciosDistintos(p) ? '<span class="desde">desde</span>' : ''}<span class="precio${p.descuento > 0 ? ' precio--off' : ''}">${formatearPrecio(min)}</span>${p.descuento > 0 ? `<s>${formatearPrecio(orig)}</s>` : ''}`;
}

function stepperHTML(nombre, max, valor = 1) {
  return `<div class="stepper" data-stepper>
          <button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button>
          <input type="number" value="${valor}" min="1" max="${Math.max(1, max)}" aria-label="Cantidad de ${esc(nombre)}" readonly>
          <button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>`;
}

function cardHTML(p, { clase = 'pgrid__item', anim = 'subir', compacta = false } = {}) {
  const cat = catDe(p.cat);
  const href = `${URL_CATALOGO}?producto=${p.id}`;
  const agotado = !(p.stock > 0);
  return `<li class="${clase}"${anim ? ANIM[anim] : ''}>
    <article class="pcard${compacta ? ' pcard--compacta' : ''}" data-id="${p.id}">
      <div class="pcard__media ph">
        <a class="pcard__img" href="${href}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></a>
        ${badgesHTML(p)}
      </div>
      <div class="pcard__body">
        <p class="pcard__cat">${esc(cat?.corto || '')}</p>
        <h3 class="pcard__nombre"><a href="${href}" data-qv="${p.id}">${esc(p.nombre)}</a></h3>
        <div class="pcard__precio">${precioHTML(p)}</div>
        <div class="prod-actions">
          ${compacta ? '' : stepperHTML(p.nombre, p.stock)}
          <button type="button" class="btn btn--cta prod-add" data-add="${p.id}"${agotado ? ' disabled' : ''}><span class="lbl-largo">${agotado ? 'Sin stock' : 'Agregar al carrito'}</span><span class="lbl-corto">${agotado ? 'Sin stock' : 'Agregar'}</span></button>
        </div>
        ${agotado || compacta ? '' : `<button type="button" class="pcard__ya" data-buy="${p.id}">Comprar ahora</button>`}
      </div>
    </article>
  </li>`;
}

function mtileHTML(p, grande) {
  const href = `${URL_CATALOGO}?producto=${p.id}`;
  return `<li class="mosaico__item${grande ? ' mosaico__item--grande' : ''}"${ANIM.subir}>
    <article class="mtile ph" data-id="${p.id}">
      <a class="mtile__img" href="${href}" data-qv="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200" decoding="async"></a>
      ${badgesHTML(p)}
      <button type="button" class="mtile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito"${p.stock > 0 ? '' : ' disabled'}>${ICO.mas}</button>
      <div class="mtile__info"><span class="mtile__nombre">${esc(p.nombre)}</span><span class="mtile__precio">${formatearPrecio(precioDesde(p))}</span></div>
    </article>
  </li>`;
}

function pickerHTML(p, modo) {
  const titulo = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const conPrecio = preciosDistintos(p);
  return `<div class="pcard__picker" data-picker role="group" aria-label="${esc(titulo)}">
    <div class="pcard__picker-head"><span>${esc(titulo)}</span><button type="button" data-picker-close aria-label="Cerrar opciones">${ICO.cerrar}</button></div>
    <div class="ops">${p.ops.map(op => `<button type="button" class="op" data-pick="${esc(op.v)}" data-modo="${modo}">${esc(op.v)}${conPrecio ? `<small>${formatearPrecio(precioOp(p, op))}</small>` : ''}</button>`).join('')}</div>
  </div>`;
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
const refrescarTriggers = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function renderNavcat() {
  const list = document.querySelector('[data-navcat-list]');
  if (!list) return;
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  list.innerHTML = CATEGORIAS.map(c => `<li class="navcat__item"><a href="${URL_CATALOGO}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}>
    <span class="navcat__thumb"><img src="${c.img}" alt="" width="1200" height="1200" loading="lazy"></span>
    <span><span class="navcat__nombre">${esc(c.nombre)}</span><span class="navcat__cant">${Tienda.contar({ cat: c.id })} productos</span></span>
  </a></li>`).join('');
}

function renderFooterCats() {
  const ul = document.querySelector('[data-footer-cats]');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('');
}

function renderTotales() {
  const total = Tienda.contar({});
  document.querySelectorAll('[data-total]').forEach(el => { el.textContent = total; });
}

function renderCats() {
  const ul = document.querySelector('[data-cats]');
  if (!ul) return;
  ul.innerHTML = CATEGORIAS.map((c, i) => {
    const href = `${URL_CATALOGO}?cat=${c.id}`;
    if (i < 3) {
      return `<li class="cat cat--grande"${ANIM.subir}><a class="cat__link" href="${href}">
        <div class="cat__media ph"><img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1200" decoding="async"></div>
        <div class="cat__pie"><div><span class="cat__nombre">${esc(c.nombre)}</span><span class="cat__bajada">${esc(c.bajada)}</span></div><span class="cat__flecha">${ICO.flecha}</span></div>
      </a></li>`;
    }
    return `<li class="cat cat--chica"${ANIM.escala}><a class="cat__link" href="${href}">
      <div class="cat__media ph"><img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1200" decoding="async"></div>
      <div class="cat__texto"><span class="cat__nombre">${esc(c.nombre)}</span><span class="cat__cant">${Tienda.contar({ cat: c.id })} productos</span></div>
      <span class="cat__flecha">${ICO.flecha}</span>
    </a></li>`;
  }).join('');
}

let railIds = [];
function renderRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { tendencia: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  railIds = items.map(p => p.id);
  track.innerHTML = items.map(p => cardHTML(p, { clase: 'rail-item', anim: 'der', compacta: true })).join('');
}

function renderNuevos() {
  const ul = document.querySelector('[data-nuevos]');
  if (!ul) return;
  const { items } = Tienda.consultar({ filtros: { excluir: railIds }, orden: 'nuevos', limite: 8 });
  ul.innerHTML = items.map(p => cardHTML(cachear(p), { compacta: true })).join('');
}

function renderMosaico() {
  const ul = document.querySelector('[data-mosaico]');
  if (!ul) return;
  const { items } = Tienda.consultar({ filtros: { tendencia: true }, orden: 'destacados', limite: 8 });
  const total = Tienda.contar({});
  ul.innerHTML = items.map((p, i) => mtileHTML(cachear(p), i === 0)).join('')
    + `<li class="mosaico__item"${ANIM.escala}><a class="mtile mtile--todo" href="${URL_CATALOGO}"><strong>Ver los ${total} productos</strong><span>Todo el catálogo ${ICO.flecha}</span></a></li>`;
}

function initVitrina() {
  const tabs = document.querySelector('[data-vitrina-tabs]');
  const panel = document.querySelector('[data-vitrina-panel]');
  if (!tabs || !panel) return;
  tabs.innerHTML = CATEGORIAS.map((c, i) => `<button type="button" class="vtab" role="tab" id="vtab-${c.id}" aria-controls="vitrina-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-vtab="${c.id}">${esc(c.corto)}</button>`).join('');
  const pintar = (id, animar) => {
    const c = catDe(id);
    if (!c) return;
    const { items } = Tienda.consultar({ filtros: { cat: id }, orden: 'destacados', limite: 4 });
    const n = Tienda.contar({ cat: id });
    panel.setAttribute('aria-labelledby', `vtab-${id}`);
    panel.innerHTML = `<ul class="vitrina__grid">
      <li class="vitrina__destacada" data-animate="mascara" style="clip-path:inset(100% 0 0 0)">
        <img src="${c.img}" alt="${esc(c.alt)}" width="1200" height="1200" decoding="async">
        <div class="vitrina__info"><h3>${esc(c.nombre)}</h3><p>${esc(c.bajada)}</p><a href="${URL_CATALOGO}?cat=${c.id}" aria-label="Ver los ${n} productos de ${esc(c.nombre)}">Ver los ${n} ${ICO.flecha}</a></div>
      </li>
      ${items.map(p => cardHTML(cachear(p), { compacta: true })).join('')}
    </ul>`;
    if (animar) { revelarNuevos(panel); refrescarTriggers(); }
  };
  const activar = (b, foco) => {
    tabs.querySelectorAll('[data-vtab]').forEach(t => {
      const on = t === b;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (foco) b.focus();
    b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    pintar(b.dataset.vtab, true);
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-vtab]');
    if (b && b.getAttribute('aria-selected') !== 'true') activar(b, false);
  });
  tabs.addEventListener('keydown', e => {
    const todas = [...tabs.querySelectorAll('[data-vtab]')];
    const i = todas.indexOf(document.activeElement);
    if (i < 0) return;
    let j = null;
    if (e.key === 'ArrowRight') j = (i + 1) % todas.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + todas.length) % todas.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = todas.length - 1;
    if (j == null) return;
    e.preventDefault();
    activar(todas[j], true);
  });
  pintar(CATEGORIAS[0].id, false);
}

function cantidadDe(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function resetStepper(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  if (input) input.value = '1';
}
function bumpBoton(btn) {
  if (!btn || reduceMotion || typeof btn.animate !== 'function') return;
  btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('[data-picker]').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  const media = card.querySelector('.pcard__media');
  if (!media) return;
  const previo = media.querySelector('[data-picker]');
  cerrarPickers();
  if (previo && previo.querySelector('[data-pick]')?.dataset.modo === modo) return;
  media.insertAdjacentHTML('beforeend', pickerHTML(p, modo));
  media.querySelector('[data-pick]')?.focus({ preventScroll: true });
}

function agregar(p, qty, v, modo, origen) {
  if (!p || !(p.stock > 0)) return;
  Cart.add(p, qty, v);
  if (modo === 'buy') { openCartDrawer(origen); return; }
  const op = opDe(p, v);
  showToast(`Sumaste ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''} al carrito.`);
}

function initProductos() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv) { e.preventDefault(); openQV(qv.dataset.qv, qv); return; }

    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.closest('[data-stepper]')?.querySelector('input');
      if (!input) return;
      const max = parseInt(input.max, 10) || 99;
      input.value = String(Math.min(max, Math.max(1, (parseInt(input.value, 10) || 1) + Number(step.dataset.step))));
      return;
    }

    const cerrar = e.target.closest('[data-picker-close]');
    if (cerrar) { cerrar.closest('[data-picker]')?.remove(); return; }

    const pick = e.target.closest('[data-pick]');
    if (pick) {
      const card = pick.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p) return;
      const qty = cantidadDe(card);
      pick.closest('[data-picker]')?.remove();
      resetStepper(card);
      agregar(p, qty, pick.dataset.pick, pick.dataset.modo, card.querySelector('[data-add]'));
      return;
    }

    const add = e.target.closest('[data-add], [data-buy]');
    if (add) {
      const modo = add.hasAttribute('data-buy') ? 'buy' : 'add';
      const p = getProducto(add.dataset.add || add.dataset.buy);
      if (!p || !(p.stock > 0)) return;
      bumpBoton(add);
      const card = add.closest('.pcard');
      if (p.ops.length > 1) {
        if (card) abrirPicker(card, p, modo);
        else openQV(p.id, add);
        return;
      }
      const qty = cantidadDe(card);
      resetStepper(card);
      agregar(p, qty, p.ops[0].v, modo, add);
      return;
    }

    if (!e.target.closest('[data-picker]')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('[data-picker]');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus();
  });
}

function trapFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const focos = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const overlays = new Set();
function bloquearScroll(clave, on) {
  if (on) overlays.add(clave); else overlays.delete(clave);
  document.body.classList.toggle('no-scroll', overlays.size > 0);
}

const QV = { el: null, panel: null, content: null, origen: null, id: null, op: null };
function setParamProducto(id) {
  try {
    const url = new URL(location.href);
    if (id) url.searchParams.set('producto', id); else url.searchParams.delete('producto');
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  } catch { /* sin history */ }
}
function setLdProducto(p) {
  const ld = document.getElementById('ld-producto');
  if (!ld) return;
  if (!p) { ld.textContent = '{}'; return; }
  const base = 'https://gokywebs.com/demo/tiendanovex/';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: base + p.img, description: p.desc,
    category: catDe(p.cat)?.nombre, brand: { '@type': 'Brand', name: 'Tienda Novex' },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioDesde(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `${base}${URL_CATALOGO}?producto=${p.id}` },
  });
}

function qvHTML(p) {
  const cat = catDe(p.cat);
  const op = QV.op;
  const agotado = !(p.stock > 0);
  const titulo = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stockTxt = agotado ? 'Sin stock por ahora. Escribinos y te avisamos cuando vuelva.' : p.stock <= 3 ? `Quedan ${p.stock} unidades.` : 'Disponible.';
  return `<div class="qv__grid">
    <div class="qv__media"><img src="${p.img}" alt="${esc(p.alt)}" width="1200" height="1200">${badgesHTML(p)}</div>
    <div class="qv__info">
      <p class="qv__cat">${esc(cat?.nombre || '')}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <div class="qv__precio" data-qv-precio>${precioHTML(p, op)}</div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.nota ? `<p class="qv__nota">${esc(p.nota)}</p>` : ''}
      ${p.ops.length > 1
        ? `<div><p class="qv__label">${esc(titulo)}</p><div class="ops" role="group" aria-label="${esc(titulo)}">${p.ops.map(o => `<button type="button" class="op" data-qv-op="${esc(o.v)}" aria-pressed="${o.v === op.v}">${esc(o.v)}${preciosDistintos(p) ? `<small>${formatearPrecio(precioOp(p, o))}</small>` : ''}</button>`).join('')}</div></div>`
        : `<p class="qv__label">Presentación: <span class="qv__valor">${esc(op.v)}</span></p>`}
      <p class="qv__stock">${stockTxt}</p>
      <div class="qv__acciones">
        ${stepperHTML(p.nombre, p.stock)}
        <button type="button" class="btn btn--cta" data-qv-add${agotado ? ' disabled' : ''}>${agotado ? 'Sin stock' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-buy${agotado ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Tienda Novex! Quería consultar por: ${p.nombre}.`)}" target="_blank" rel="noopener">${ICO.wsp} Consultar por WhatsApp</a>
    </div>
  </div>
  ${rel.length ? `<div class="qv__rel"><p class="qv__rel-titulo">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><img src="${r.img}" alt="" width="1200" height="1200"><span class="qv__rel-txt"><b>${esc(r.nombre)}</b><small>${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
}

function openQV(id, origen = null) {
  const p = getProducto(id);
  if (!p || !QV.el) return;
  cerrarPickers();
  if (!QV.el.hidden && QV.id === id) return;
  QV.id = id;
  QV.op = p.ops[0];
  if (QV.el.hidden) QV.origen = origen || document.activeElement;
  QV.content.innerHTML = qvHTML(p);
  QV.panel.scrollTop = 0;
  setParamProducto(id);
  setLdProducto(p);
  if (QV.el.hidden) {
    QV.el.hidden = false;
    bloquearScroll('qv', true);
    requestAnimationFrame(() => requestAnimationFrame(() => QV.el.classList.add('open')));
  }
  QV.panel.focus({ preventScroll: true });
}
function closeQV() {
  if (!QV.el || QV.el.hidden) return;
  QV.el.classList.remove('open');
  QV.id = null;
  setParamProducto(null);
  setLdProducto(null);
  bloquearScroll('qv', false);
  setTimeout(() => { if (!QV.el.classList.contains('open')) QV.el.hidden = true; }, reduceMotion ? 0 : 320);
  const o = QV.origen;
  QV.origen = null;
  if (o && document.contains(o)) o.focus({ preventScroll: true });
}
function initQV() {
  QV.el = document.getElementById('quickview');
  if (!QV.el) return;
  QV.panel = QV.el.querySelector('.qv__panel');
  QV.content = QV.el.querySelector('[data-qv-content]');
  QV.el.addEventListener('click', e => {
    if (e.target.closest('[data-qv-close]')) { closeQV(); return; }
    const p = getProducto(QV.id);
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      QV.op = opDe(p, opBtn.dataset.qvOp);
      QV.el.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === opBtn)));
      const precio = QV.el.querySelector('[data-qv-precio]');
      if (precio) precio.innerHTML = precioHTML(p, QV.op);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { openQV(rel.dataset.qvRel); return; }
    const add = e.target.closest('[data-qv-add], [data-qv-buy]');
    if (add) {
      const qty = cantidadDe(QV.el);
      const modo = add.hasAttribute('data-qv-buy') ? 'buy' : 'add';
      bumpBoton(add);
      resetStepper(QV.el);
      if (modo === 'buy') {
        Cart.add(p, qty, QV.op.v);
        const origen = QV.origen;
        closeQV();
        openCartDrawer(origen);
      } else {
        agregar(p, qty, QV.op.v, 'add');
      }
    }
  });
  QV.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); closeQV(); return; }
    trapFoco(QV.panel, e);
  });
}

const Drawer = { el: null, bd: null, origen: null };
function renderCart(animar = false) {
  const body = document.querySelector('[data-cart-lines]');
  const foot = document.querySelector('[data-cart-foot]');
  if (!body || !foot) return;
  const items = Cart.get();
  if (!items.length) {
    foot.hidden = true;
    body.innerHTML = `<div class="carrito-vacio">
      <span class="carrito-vacio__ico">${ICO.carrito}</span>
      <strong>Tu carrito está vacío</strong>
      <p>Mirá las tendencias de la semana y sumá lo que te guste.</p>
      <a class="btn btn--ink" href="${URL_CATALOGO}">Volver al catálogo ${ICO.flecha}</a>
    </div>`;
    return;
  }
  foot.hidden = false;
  body.innerHTML = items.map((it, i) => {
    const p = getProducto(it.id);
    const op = opDe(p, it.v);
    return `<div class="cline${animar ? ' cline--in' : ''}" style="animation-delay:${Math.min(i * 50, 300)}ms" data-line="${p.id}" data-v="${esc(op.v)}">
      <div class="cline__img"><img src="${p.img}" alt="" width="1200" height="1200"></div>
      <div>
        <div class="cline__top">
          <div><p class="cline__nombre">${esc(p.nombre)}</p><p class="cline__op">${esc(op.v)}</p></div>
          <button type="button" class="cline__rm" data-rm aria-label="Quitar ${esc(p.nombre)} del carrito">${ICO.tacho}</button>
        </div>
        <div class="cline__row">
          <div class="stepper">
            <button type="button" data-cstep="-1" aria-label="Restar uno">${ICO.menos}</button>
            <input type="number" value="${it.qty}" min="1" max="${Math.max(1, p.stock)}" aria-label="Cantidad de ${esc(p.nombre)}" readonly>
            <button type="button" data-cstep="1" aria-label="Sumar uno">${ICO.mas}</button>
          </div>
          <span class="cline__precio">${formatearPrecio(precioOp(p, op) * it.qty)}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  const total = Cart.total();
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = formatearPrecio(total); });
  const lineas = items.map(it => { const p = getProducto(it.id); const op = opDe(p, it.v); return `- ${it.qty} × ${p.nombre}${p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * it.qty)}`; });
  const wsp = document.querySelector('[data-cart-wsp]');
  if (wsp) wsp.href = wspLink(`Hola Tienda Novex! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(total)}`);
}
function openCartDrawer(origen) {
  if (!Drawer.el) return;
  cerrarPickers();
  Drawer.origen = origen instanceof Element ? origen : document.activeElement;
  renderCart(true);
  Drawer.el.hidden = false;
  Drawer.bd.hidden = false;
  bloquearScroll('drawer', true);
  requestAnimationFrame(() => requestAnimationFrame(() => { Drawer.el.classList.add('open'); Drawer.bd.classList.add('open'); }));
  Drawer.el.focus({ preventScroll: true });
}
function closeCartDrawer() {
  if (!Drawer.el || Drawer.el.hidden) return;
  Drawer.el.classList.remove('open');
  Drawer.bd.classList.remove('open');
  bloquearScroll('drawer', false);
  setTimeout(() => { if (!Drawer.el.classList.contains('open')) { Drawer.el.hidden = true; Drawer.bd.hidden = true; } }, reduceMotion ? 0 : 380);
  const o = Drawer.origen;
  Drawer.origen = null;
  if (o && document.contains(o)) o.focus({ preventScroll: true });
}
function initCart() {
  Drawer.el = document.getElementById('cart-drawer');
  Drawer.bd = document.querySelector('[data-drawer-backdrop]');
  if (!Drawer.el || !Drawer.bd) return;
  document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', () => openCartDrawer(b)));
  Drawer.bd.addEventListener('click', closeCartDrawer);
  Drawer.el.addEventListener('click', e => {
    if (e.target.closest('[data-drawer-close]')) { closeCartDrawer(); return; }
    if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const line = e.target.closest('[data-line]');
    if (!line) return;
    const id = line.dataset.line, v = line.dataset.v;
    if (e.target.closest('[data-rm]')) { Cart.remove(id, v); return; }
    const st = e.target.closest('[data-cstep]');
    if (st) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(st.dataset.cstep));
    }
  });
  Drawer.el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCartDrawer(); return; }
    trapFoco(Drawer.el, e);
  });
  document.addEventListener('cart:updated', () => {
    if (!Drawer.el.hidden) {
      const foco = document.activeElement;
      const linea = foco?.closest?.('[data-line]');
      const clave = linea ? [linea.dataset.line, linea.dataset.v, foco.dataset.cstep ? `[data-cstep="${foco.dataset.cstep}"]` : null] : null;
      renderCart(false);
      if (clave && clave[2]) {
        const nueva = [...Drawer.el.querySelectorAll('[data-line]')].find(l => l.dataset.line === clave[0] && l.dataset.v === clave[1]);
        (nueva?.querySelector(clave[2]) || Drawer.el).focus({ preventScroll: true });
      } else if (foco && !document.contains(foco)) Drawer.el.focus({ preventScroll: true });
    }
  });
  window.addEventListener('storage', e => { if (e.key === Cart.KEY) document.dispatchEvent(new CustomEvent('cart:updated')); });
}

function updateCartBadge(bump = true) {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    b.classList.remove('bump');
    if (bump && n) { void b.offsetWidth; b.classList.add('bump'); }
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); bloquearScroll('nav', false);
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); bloquearScroll('nav', true);
    nav.querySelector('a, .navcat__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initNavcat() {
  const wrap = document.querySelector('[data-navcat]');
  if (!wrap) return;
  const btn = wrap.querySelector('.navcat__btn');
  const desk = window.matchMedia('(min-width: 981px)');
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let timer = 0;
  let abiertoPorHover = 0;
  const abrir = () => { clearTimeout(timer); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    if (wrap.classList.contains('open') && Date.now() - abiertoPorHover > 350) cerrar();
    else abrir();
  });
  wrap.addEventListener('mouseenter', () => { if (desk.matches && hover.matches && !wrap.classList.contains('open')) { abrir(); abiertoPorHover = Date.now(); } });
  wrap.addEventListener('mouseleave', () => { if (desk.matches && hover.matches) timer = setTimeout(cerrar, 140); });
  wrap.addEventListener('focusout', e => { if (desk.matches && !wrap.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (desk.matches && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
  desk.addEventListener('change', cerrar);
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('button, input')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el drag igual funciona */ }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
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

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.querySelector('[data-rail-track]');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => {
    const it = track.querySelector('.rail-item');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return it ? (it.getBoundingClientRect().width + gap) * (window.innerWidth > 1024 ? 2 : 1) : 300;
  };
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8, clearProps: 'transform' }, 0);
  const card = hero.classList.contains('hero--m2') ? hero.querySelector('.hero__copy') : null;
  if (card) tl.from(card, { y: 40, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const rango = parseFloat(el.dataset.parallax) || 5;
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => { el.style.translate = `0 ${((self.progress - 0.5) * 2 * rango).toFixed(2)}%`; },
    });
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

const Catalogo = { estado: null, cursor: null, mostrados: 0, total: 0 };
function leerURL() {
  const sp = new URLSearchParams(location.search);
  const ids = CATEGORIAS.map(c => c.id);
  const cats = (sp.get('cat') || '').split(',').map(s => s.trim()).filter(c => ids.includes(c));
  const orden = Object.prototype.hasOwnProperty.call(ORDENES, sp.get('orden')) ? sp.get('orden') : 'destacados';
  const precio = Object.prototype.hasOwnProperty.call(RANGOS, sp.get('precio')) ? sp.get('precio') : '';
  return {
    cats: MODELO === '2' ? cats.slice(0, 1) : [...new Set(cats)],
    q: (sp.get('q') || '').slice(0, 60),
    orden,
    precio,
    tendencia: sp.get('tendencia') === '1',
    oferta: sp.get('oferta') === '1',
    stock: sp.get('stock') === '1',
  };
}
function escribirURL() {
  const e = Catalogo.estado;
  const sp = new URLSearchParams();
  if (e.cats.length) sp.set('cat', e.cats.join(','));
  if (e.q) sp.set('q', e.q);
  if (e.orden !== 'destacados') sp.set('orden', e.orden);
  if (e.precio) sp.set('precio', e.precio);
  if (e.tendencia) sp.set('tendencia', '1');
  if (e.oferta) sp.set('oferta', '1');
  if (e.stock) sp.set('stock', '1');
  const prod = new URLSearchParams(location.search).get('producto');
  if (prod) sp.set('producto', prod);
  const qs = sp.toString();
  try { history.replaceState(null, '', location.pathname + (qs ? `?${qs}` : '')); } catch { /* sin history */ }
  sp.delete('producto');
  const otro = MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html';
  const qsOtro = sp.toString();
  document.querySelectorAll(`.gw-modelos__btn[href^="${otro}"]`).forEach(a => { a.setAttribute('href', otro + (qsOtro ? `?${qsOtro}` : '')); });
}
function filtrosDe() {
  const e = Catalogo.estado;
  const r = RANGOS[e.precio];
  return { cat: e.cats, tendencia: e.tendencia, oferta: e.oferta, stock: e.stock, precioMin: r?.min ?? null, precioMax: r?.max ?? null };
}
function filtrosActivos() {
  const e = Catalogo.estado;
  return (MODELO === '2' ? 0 : e.cats.length) + (e.precio ? 1 : 0) + (e.tendencia ? 1 : 0) + (e.oferta ? 1 : 0) + (e.stock ? 1 : 0);
}

function pintarCabecera() {
  const e = Catalogo.estado;
  const h1 = document.querySelector('[data-cat-h1]');
  const bajada = document.querySelector('[data-cat-bajada]');
  const miga = document.querySelector('[data-miga-actual]');
  const cat = e.cats.length === 1 ? catDe(e.cats[0]) : null;
  let titulo = 'Todo el catálogo';
  let texto = 'Hogar, pequeños electro, accesorios, joyas, perfumes y bienestar. Filtrá, buscá y sumá al carrito.';
  if (cat) { titulo = cat.nombre; texto = cat.bajada; }
  else if (e.tendencia && !e.cats.length) { titulo = 'Tendencias de la semana'; texto = 'Elegidos esta semana para mirar primero.'; }
  if (h1) h1.textContent = titulo;
  if (bajada) bajada.textContent = texto;
  if (miga) {
    miga.hidden = !cat && !(e.tendencia && !e.cats.length);
    miga.textContent = cat ? cat.nombre : 'Tendencias';
  }
  document.title = `${titulo === 'Todo el catálogo' ? 'Catálogo' : titulo} — Tienda Novex`;
  document.querySelectorAll('[data-navcat-list] a').forEach(a => {
    const id = new URL(a.href).searchParams.get('cat');
    if (cat && id === cat.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
}

function pintarControles() {
  const e = Catalogo.estado;
  document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cats.includes(i.value); });
  document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
  ['tendencia', 'oferta', 'stock'].forEach(k => document.querySelectorAll(`input[data-f="${k}"]`).forEach(i => { i.checked = e[k]; }));
  document.querySelectorAll('[data-chip]').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.chip === (e.cats[0] || ''))));
  const q = document.querySelector('[data-q]');
  if (q && q.value !== e.q) q.value = e.q;
  const clear = document.querySelector('[data-q-clear]');
  if (clear) clear.hidden = !e.q;
  const orden = document.querySelector('[data-orden]');
  if (orden) orden.value = e.orden;
  const n = filtrosActivos();
  document.querySelectorAll('[data-filtros-n]').forEach(b => { b.textContent = n; b.hidden = n === 0; });
  const limpiar = document.querySelector('[data-limpiar]');
  if (limpiar) limpiar.hidden = !(n || e.q || (MODELO === '2' && e.cats.length));
}

function renderCatalogo(agregar = false) {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid) return;
  const e = Catalogo.estado;
  const res = buscarPaginado(Tienda, { q: e.q, filtros: filtrosDe(), orden: e.orden, cursor: agregar ? Catalogo.cursor : null, limite: POR_PAGINA });
  res.items.forEach(cachear);
  Catalogo.cursor = res.cursor;
  if (!agregar) { grid.innerHTML = ''; Catalogo.mostrados = 0; Catalogo.total = e.q ? null : Tienda.contar(filtrosDe()); }
  grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
  Catalogo.mostrados += res.items.length;
  if (agregar && !res.items.length) Catalogo.cursor = null;
  const vacio = document.querySelector('[data-vacio]');
  if (vacio) vacio.hidden = Catalogo.mostrados > 0;
  grid.hidden = Catalogo.mostrados === 0;
  const vermas = document.querySelector('[data-vermas]');
  if (vermas) vermas.hidden = !Catalogo.cursor;
  const info = document.querySelector('[data-vermas-info]');
  const contador = document.querySelector('[data-contador]');
  const total = Catalogo.total;
  const etiqueta = n => `${n} ${n === 1 ? 'producto' : 'productos'}`;
  if (contador) {
    contador.textContent = e.q
      ? `${Catalogo.mostrados}${Catalogo.cursor ? '+' : ''} ${Catalogo.mostrados === 1 && !Catalogo.cursor ? 'resultado' : 'resultados'} para «${e.q}»`
      : etiqueta(total);
  }
  if (info) info.textContent = total != null ? `Mostrando ${Catalogo.mostrados} de ${total}` : `Mostrando ${Catalogo.mostrados}`;
  document.querySelectorAll('[data-filtros-total]').forEach(el => { el.textContent = total != null ? etiqueta(total) : `${Catalogo.mostrados}${Catalogo.cursor ? '+' : ''} resultados`; });
  pintarControles();
  if (!agregar) { pintarCabecera(); escribirURL(); }
  revelarNuevos(grid);
  refrescarTriggers();
}

function initFiltrosDrawer() {
  const panel = document.querySelector('[data-filtros]');
  if (!panel) return;
  const bd = document.querySelector('[data-filtros-backdrop]');
  const abrirBtn = document.querySelector('[data-filtros-abrir]');
  const esDrawer = () => panel.classList.contains('filtros--drawer') || window.matchMedia('(max-width: 900px)').matches;
  let origen = null;
  const abrir = () => {
    if (!esDrawer()) return;
    origen = document.activeElement;
    panel.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in'));
    panel.classList.add('open');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    if (bd) { bd.hidden = false; requestAnimationFrame(() => bd.classList.add('open')); }
    abrirBtn?.setAttribute('aria-expanded', 'true');
    bloquearScroll('filtros', true);
    panel.querySelector('[data-filtros-cerrar]')?.focus({ preventScroll: true });
  };
  const cerrar = () => {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    if (bd) { bd.classList.remove('open'); setTimeout(() => { if (!panel.classList.contains('open')) bd.hidden = true; }, 300); }
    abrirBtn?.setAttribute('aria-expanded', 'false');
    bloquearScroll('filtros', false);
    if (origen && document.contains(origen)) origen.focus({ preventScroll: true });
  };
  abrirBtn?.addEventListener('click', abrir);
  bd?.addEventListener('click', cerrar);
  panel.addEventListener('click', e => { if (e.target.closest('[data-filtros-cerrar]')) cerrar(); });
  panel.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrar(); return; }
    if (panel.classList.contains('open')) trapFoco(panel, e);
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => { if (!panel.classList.contains('filtros--drawer')) cerrar(); });
}

function initCatalogo() {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid) return;
  Catalogo.estado = leerURL();

  const fCats = document.querySelector('[data-f-cats]');
  if (fCats) {
    fCats.innerHTML = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"> ${esc(c.nombre)} <span class="check__cant">${Tienda.contar({ cat: c.id })}</span></label>`).join('');
  }
  const fPrecio = document.querySelector('[data-f-precio]');
  if (fPrecio) {
    fPrecio.innerHTML = `<label class="check"><input type="radio" name="precio" data-f="precio" value=""> Todos los precios</label>`
      + Object.entries(RANGOS).map(([k, r]) => `<label class="check"><input type="radio" name="precio" data-f="precio" value="${k}"> ${esc(r.nombre)}</label>`).join('');
  }
  const chips = document.querySelector('[data-chips]');
  if (chips) {
    chips.innerHTML = `<button type="button" class="chip" data-chip="" aria-pressed="false">Todas <small>${Tienda.contar({})}</small></button>`
      + CATEGORIAS.map(c => `<button type="button" class="chip" data-chip="${c.id}" aria-pressed="false">${esc(c.corto)} <small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
    chips.addEventListener('click', e => {
      const c = e.target.closest('[data-chip]');
      if (!c) return;
      Catalogo.estado.cats = c.dataset.chip ? [c.dataset.chip] : [];
      renderCatalogo();
    });
  }
  const orden = document.querySelector('[data-orden]');
  if (orden) {
    orden.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    orden.addEventListener('change', () => { Catalogo.estado.orden = Object.prototype.hasOwnProperty.call(ORDENES, orden.value) ? orden.value : 'destacados'; renderCatalogo(); });
  }
  document.querySelector('[data-filtros]')?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    const est = Catalogo.estado;
    const f = i.dataset.f;
    if (f === 'cat') est.cats = [...document.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value);
    else if (f === 'precio') est.precio = i.value;
    else est[f] = i.checked;
    renderCatalogo();
  });
  const q = document.querySelector('[data-q]');
  let t = 0;
  q?.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { Catalogo.estado.q = q.value.trim().slice(0, 60); renderCatalogo(); }, 220);
  });
  document.querySelector('[data-csearch]')?.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(t);
    Catalogo.estado.q = (q?.value || '').trim().slice(0, 60);
    renderCatalogo();
    q?.blur();
  });
  document.querySelector('[data-q-clear]')?.addEventListener('click', () => {
    Catalogo.estado.q = '';
    if (q) { q.value = ''; q.focus(); }
    renderCatalogo();
  });
  const limpiarTodo = () => {
    Catalogo.estado = { cats: [], q: '', orden: Catalogo.estado.orden, precio: '', tendencia: false, oferta: false, stock: false };
    renderCatalogo();
  };
  document.querySelectorAll('[data-limpiar], [data-vacio-limpiar]').forEach(b => b.addEventListener('click', limpiarTodo));
  document.querySelector('[data-vermas-btn]')?.addEventListener('click', () => renderCatalogo(true));

  document.querySelectorAll('[data-hsearch]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const v = (form.querySelector('input')?.value || '').trim().slice(0, 60);
    Catalogo.estado.q = v;
    renderCatalogo();
    document.querySelector('.catalogo')?.scrollIntoView({ block: 'start' });
  }));
  document.querySelectorAll('a.hsearch-mobile').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    q?.focus({ preventScroll: true });
    document.querySelector('.catalogo')?.scrollIntoView({ block: 'start' });
  }));
  document.querySelectorAll('.main-nav a[href*="catalogo"]').forEach(a => a.addEventListener('click', e => {
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname) return;
    e.preventDefault();
    history.replaceState(null, '', url.pathname + url.search);
    Catalogo.estado = leerURL();
    renderCatalogo();
    window.scrollTo({ top: 0 });
  }));

  renderCatalogo();
  if (new URLSearchParams(location.search).get('buscar') === '1') setTimeout(() => q?.focus({ preventScroll: true }), 300);
}

function initDeepLink() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) openQV(id);
}

renderNavcat();
renderFooterCats();
renderTotales();
renderCats();
renderRail();
renderNuevos();
renderMosaico();
initVitrina();
initCatalogo();
initReveals();
initNav();
initNavcat();
initProductos();
initQV();
initCart();
initFloats();
initRail();
initFiltrosDrawer();
initHeroMotion();
initParallax();
initModelBarScroll();
updateCartBadge(false);
document.addEventListener('cart:updated', () => updateCartBadge(true));
initDeepLink();
