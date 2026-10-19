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

const WSP = '5492995227570';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'ropa-circular', nombre: 'Ropa circular', grupo: 'circular', bajada: 'Prendas únicas: hay una sola de cada una.', img: 'images/p-campera-jean.webp' },
  { id: 'ropa-interior', nombre: 'Ropa interior', grupo: 'interior', bajada: 'Para dama, hombre y niños, por talle y en pack.', img: 'images/p-bombachas-pastel.webp' },
  { id: 'bijouterie', nombre: 'Bijouterie', grupo: 'accesorios', bajada: 'Argollas, aros colgantes y pulseras.', img: 'images/p-argollas.webp' },
  { id: 'marroquineria', nombre: 'Marroquinería', grupo: 'accesorios', bajada: 'Carteras y billeteras.', img: 'images/p-cartera.webp' },
  { id: 'calzado', nombre: 'Calzado', grupo: 'temporada', bajada: 'Ojotas y crocs para el verano.', img: 'images/p-zuecos.webp' },
  { id: 'gorras-lentes', nombre: 'Gorras y lentes', grupo: 'temporada', bajada: 'Gorras, anteojos de sol y de lectura.', img: 'images/p-gorra.webp' },
];
const GRUPOS = {
  temporada: { nombre: 'Temporada', titulo: 'Temporada: calzado, gorras y lentes', bajada: 'Ojotas, crocs, gorras y anteojos de sol y de lectura.' },
  accesorios: { nombre: 'Accesorios', titulo: 'Bijouterie y marroquinería', bajada: 'Argollas, aros, pulseras, carteras y billeteras.' },
};
const PARA = { mujer: 'Mujer', hombre: 'Hombre', ninos: 'Niños' };
const TIPOS = { unica: 'Piezas únicas', nuevo: 'Nuevos' };
const RANGOS = {
  hasta10: { nombre: 'Menos de $10.000', max: 9999 },
  '10a25': { nombre: '$10.000 a $25.000', min: 10000, max: 25000 },
  mas25: { nombre: 'Más de $25.000', min: 25001 },
};
const ORDENES = { destacados: 'Destacados', nuevos: 'Recién llegados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const TITULO_VAR = { Talle: 'Elegí el talle', Aumento: 'Elegí el aumento', Color: 'Elegí el color' };
const NOTA_UNICA = 'Pieza única: hay una sola. Cuando alguien la compra, sale del perchero.';

const PRODUCTOS = [
  { id: 'campera-jean', nombre: 'Campera de jean clásica', cat: 'ropa-circular', para: ['mujer', 'hombre'], unica: true, talle: 'M', estado: 'Muy bueno', tipo: null,
    ops: [{ v: 'Talle M', precio: 28900 }], descuento: 0, stock: 1, rango: 1, alta: 20, img: 'images/p-campera-jean.webp', alt: 'Campera de jean azul colgada en una percha de madera, con una remera cruda debajo',
    desc: 'Jean azul medio con lavado parejo, botones metálicos y bolsillos con tapa. Corte recto, para usar abierta o abotonada. Las medidas exactas te las pasamos por WhatsApp.',
    tags: ['denim', 'chaqueta', 'jean', 'unisex', 'americana'] },
  { id: 'sweater-guarda', nombre: 'Sweater tejido con guarda', cat: 'ropa-circular', para: ['mujer'], unica: true, talle: 'L', estado: 'Excelente', tipo: null,
    ops: [{ v: 'Talle L', precio: 21900 }], descuento: 0, stock: 1, rango: 3, alta: 19, img: 'images/p-sweater-guarda.webp', alt: 'Sweater tejido crudo con guardas verdes, terracota y azules, doblado sobre lino',
    desc: 'Tejido grueso color crudo con guardas en verde, terracota y azul. Cuello redondo y puños elastizados. Abriga sin pesar.',
    tags: ['pullover', 'tejido', 'lana', 'guarda', 'nordico', 'abrigo'] },
  { id: 'vestido-floral', nombre: 'Vestido floral vintage', cat: 'ropa-circular', para: ['mujer'], unica: true, talle: 'S', estado: 'Muy bueno', tipo: null,
    ops: [{ v: 'Talle S', precio: 24900 }], descuento: 0, stock: 1, rango: 5, alta: 18, img: 'images/p-vestido-floral.webp', alt: 'Vestido con estampado de rosas sobre fondo oscuro, colgado de una puerta',
    desc: 'Estampado de rosas sobre fondo verde oscuro, mangas abullonadas tres cuartos, cuello camisero y botones al frente. Una pieza con mucho de los ochenta.',
    tags: ['vestido', 'floral', 'flores', 'vintage', 'retro'] },
  { id: 'camisaco', nombre: 'Camisaco de gabardina camel', cat: 'ropa-circular', para: ['hombre', 'mujer'], unica: true, talle: 'L', estado: 'Excelente', tipo: null,
    ops: [{ v: 'Talle L', precio: 22900 }], descuento: 0, stock: 1, rango: 7, alta: 17, img: 'images/p-camisaco.webp', alt: 'Camisaco de gabardina color camel colgado en un perchero negro, delante de otra camisa',
    desc: 'El de adelante en la foto: gabardina color camel, dos bolsillos al pecho y botones a presión. Calce amplio, para usar como camisa o como abrigo liviano.',
    tags: ['camisa', 'sobrecamisa', 'gabardina', 'camel', 'unisex'] },
  { id: 'jean-recto', nombre: 'Jean recto de tiro alto', cat: 'ropa-circular', para: ['mujer'], unica: true, talle: '40', estado: 'Muy bueno', tipo: null,
    ops: [{ v: 'Talle 40', precio: 19900 }], descuento: 0, stock: 1, alta: 16, img: 'images/p-jean-recto.webp', alt: 'Jean azul de tiro alto doblado, con el bolsillo delantero y la pretina a la vista',
    desc: 'Jean azul medio de tiro alto, pierna recta y botón metálico. Denim rígido, del que dura años.',
    tags: ['pantalon', 'denim', 'mom', 'tiro alto'] },
  { id: 'cardigan-trenzado', nombre: 'Cárdigan trenzado crudo', cat: 'ropa-circular', para: ['mujer'], unica: true, talle: 'M', estado: 'Excelente', tipo: null,
    ops: [{ v: 'Talle M', precio: 23900 }], descuento: 0, stock: 1, alta: 15, img: 'images/p-cardigan.webp', alt: 'Cárdigan tejido con trenzas color crudo con un ramito de rosas amarillas encima',
    desc: 'Tejido de trenzas en color crudo, abierto adelante y con puños elastizados. Las flores son solo de la foto.',
    tags: ['saco', 'tejido', 'trenzas', 'lana', 'abrigo'] },
  { id: 'sweater-rayado', nombre: 'Sweater rayado azul y gris', cat: 'ropa-circular', para: ['hombre', 'mujer'], unica: true, talle: 'XL', estado: 'Muy bueno', tipo: null,
    ops: [{ v: 'Talle XL', precio: 18900 }], descuento: 0, stock: 1, alta: 14, img: 'images/p-sweater-rayado.webp', alt: 'Sweater tejido con rayas anchas azul marino y gris, doblado',
    desc: 'Punto grueso con rayas anchas azul marino y gris, cuello redondo y calce holgado.',
    tags: ['pullover', 'rayado', 'tejido', 'lana', 'abrigo'] },
  { id: 'argollas-martilladas', nombre: 'Argollas doradas martilladas', cat: 'bijouterie', para: ['mujer'], tipo: null,
    ops: [{ v: 'Par', precio: 6900 }], descuento: 0, stock: 8, alta: 13, img: 'images/p-argollas.webp', alt: 'Par de argollas doradas con textura martillada',
    desc: 'Argollas doradas con textura martillada y cierre a presión. Livianas, para usar todo el día.',
    tags: ['aros', 'argollas', 'dorado', 'bijou'] },
  { id: 'aros-piedra-verde', nombre: 'Aros colgantes con piedra verde', cat: 'bijouterie', para: ['mujer'], tipo: null,
    ops: [{ v: 'Par', precio: 5900 }], descuento: 0, stock: 6, alta: 12, img: 'images/p-aros-piedra.webp', alt: 'Aros colgantes con una piedra verde agua y una medalla dorada martillada',
    desc: 'Gancho dorado, una piedra verde agua y una medalla martillada que se mueve con vos.',
    tags: ['aros', 'colgantes', 'piedra', 'verde', 'medalla', 'bijou'] },
  { id: 'set-pulseras', nombre: 'Set de 3 pulseras: piedras, perlas y cadena', cat: 'bijouterie', para: ['mujer'], tipo: null,
    ops: [{ v: 'Set x3', precio: 9900 }], descuento: 0, stock: 5, rango: 8, alta: 11, img: 'images/p-pulseras.webp', alt: 'Tres pulseras: una de piedras verdes, una de perlas y una cadena dorada con medalla',
    desc: 'Una de piedras verdes, una de perlas y una cadenita dorada con medalla. Se usan juntas o por separado.',
    tags: ['pulseras', 'perlas', 'piedras', 'cadena', 'set', 'bijou'] },
  { id: 'cartera-bandolera', nombre: 'Cartera bandolera color suela', cat: 'marroquineria', para: ['mujer'], tipo: null,
    ops: [{ v: 'Unidad', precio: 38900 }], descuento: 0, stock: 3, rango: 4, alta: 10, img: 'images/p-cartera.webp', alt: 'Cartera bandolera color suela con tapa y correa regulable',
    desc: 'Color suela, con tapa y tira de cierre al frente, correa larga regulable y herrajes dorados.',
    tags: ['bandolera', 'bolso', 'suela', 'marroquineria'] },
  { id: 'billetera-cierre', nombre: 'Billetera con cierre color suela', cat: 'marroquineria', para: ['mujer', 'hombre'], tipo: null,
    ops: [{ v: 'Unidad', precio: 15900 }], descuento: 10, stock: 4, alta: 9, img: 'images/p-billetera.webp', alt: 'Billetera chica color suela con cierre',
    desc: 'Billetera chica con cierre alrededor, en el mismo tono que la cartera bandolera. Entra en cualquier bolsillo.',
    tags: ['monedero', 'cierre', 'suela', 'marroquineria'] },
  { id: 'ojotas-tropical', nombre: 'Ojotas con estampa tropical', cat: 'calzado', para: ['mujer'], tipo: 'Talle',
    ops: [{ v: '35/36', precio: 9900 }, { v: '37/38', precio: 9900 }, { v: '39/40', precio: 9900 }], descuento: 0, stock: 14, rango: 6, alta: 8, img: 'images/p-ojotas.webp', alt: 'Par de ojotas coral con estampado de flores y hojas tropicales',
    desc: 'Plantilla con flores de hibisco y hojas, tiras de goma color coral. Para la pileta, el río o el día a día.',
    tags: ['chinelas', 'sandalias', 'verano', 'playa', 'pileta'] },
  { id: 'zuecos-arena', nombre: 'Zuecos de goma tipo crocs, arena', cat: 'calzado', para: ['mujer', 'hombre'], tipo: 'Talle',
    ops: [{ v: '35/36', precio: 26900 }, { v: '37/38', precio: 26900 }, { v: '39/40', precio: 26900 }, { v: '41/42', precio: 26900 }, { v: '43/44', precio: 26900 }], descuento: 0, stock: 10, rango: 2, alta: 7, img: 'images/p-zuecos.webp', alt: 'Par de zuecos de goma color arena con agujeros y tira trasera',
    desc: 'Livianos, con agujeros de ventilación y tira trasera que se sube o se baja. Color arena, combinan con todo.',
    tags: ['crocs', 'zuecos', 'suecos', 'sandalias', 'verano'] },
  { id: 'gorra-lavada', nombre: 'Gorra de gabardina lavada', cat: 'gorras-lentes', para: ['mujer', 'hombre'], tipo: 'Color',
    ops: [{ v: 'Arena', precio: 11900 }, { v: 'Azul', precio: 11900 }], descuento: 0, stock: 9, alta: 6, img: 'images/p-gorra.webp', alt: 'Dos gorras de gabardina lavada, una color arena y otra azul',
    desc: 'Visera curva, seis paneles y regulador atrás. Gabardina con lavado suave, en arena o en azul.',
    tags: ['gorro', 'visera', 'cap', 'sol'] },
  { id: 'anteojos-sol-carey', nombre: 'Anteojos de sol carey', cat: 'gorras-lentes', para: ['mujer', 'hombre'], tipo: null,
    ops: [{ v: 'Unidad', precio: 16900 }], descuento: 0, stock: 6, alta: 5, img: 'images/p-anteojos-sol.webp', alt: 'Anteojos de sol redondos con armazón carey y lentes marrones',
    desc: 'Armazón redondo carey con lentes marrones. En la foto, sobre un estuche que no viene incluido.',
    tags: ['lentes', 'gafas', 'sol', 'carey'] },
  { id: 'anteojos-lectura', nombre: 'Anteojos de lectura transparentes', cat: 'gorras-lentes', para: ['mujer', 'hombre'], tipo: 'Aumento',
    ops: [{ v: '+1,00', precio: 12900 }, { v: '+1,50', precio: 12900 }, { v: '+2,00', precio: 12900 }, { v: '+2,50', precio: 12900 }, { v: '+3,00', precio: 12900 }], descuento: 0, stock: 12, alta: 4, img: 'images/p-anteojos-lectura.webp', alt: 'Anteojos de lectura con armazón redondo gris transparente sobre un estuche de lino',
    desc: 'Armazón redondo gris transparente. Elegí el aumento que usás.', nota: 'Si no sabés qué aumento usás, consultá con tu óptica o tu oftalmólogo antes de elegir.',
    tags: ['lentes', 'lectura', 'aumento', 'leer'] },
  { id: 'bombachas-pastel', nombre: 'Bombachas de algodón, pack x3 pastel', cat: 'ropa-interior', para: ['mujer'], tipo: 'Talle',
    ops: [{ v: 'S', precio: 10900 }, { v: 'M', precio: 10900 }, { v: 'L', precio: 10900 }, { v: 'XL', precio: 10900 }], descuento: 0, stock: 15, alta: 3, img: 'images/p-bombachas-pastel.webp', alt: 'Tres bombachas de algodón: celeste, blanca con florcitas y blanca lisa',
    desc: 'Tres bombachas de algodón: celeste, blanca con florcitas y blanca lisa. Tiro medio y elástico suave.',
    tags: ['calzon', 'ropa interior', 'algodon', 'pack', 'lenceria'] },
  { id: 'bombachas-lunares', nombre: 'Bombachas de algodón, pack x3 rosa y lunares', cat: 'ropa-interior', para: ['mujer'], tipo: 'Talle',
    ops: [{ v: 'S', precio: 10900 }, { v: 'M', precio: 10900 }, { v: 'L', precio: 10900 }, { v: 'XL', precio: 10900 }], descuento: 0, stock: 3, alta: 2, img: 'images/p-bombachas-lunares.webp', alt: 'Tres bombachas de algodón: rosa, blanca con lunares y blanca',
    desc: 'Tres bombachas de algodón: rosa, blanca con lunares y blanca lisa. Tiro medio y elástico suave.',
    tags: ['calzon', 'ropa interior', 'algodon', 'pack', 'lenceria'] },
  { id: 'medias-algodon', nombre: 'Medias de algodón, pack x3', cat: 'ropa-interior', para: ['mujer', 'hombre', 'ninos'], tipo: 'Talle',
    ops: [{ v: 'Niños 2 a 4 años', precio: 6900 }, { v: 'Niños 6 a 10 años', precio: 6900 }, { v: 'Adulto 35 a 39', precio: 7900 }, { v: 'Adulto 40 a 44', precio: 7900 }], descuento: 0, stock: 20, alta: 1, img: 'images/p-medias-lisas.webp', alt: 'Tres pares de medias de algodón enrolladas con faja de papel, en gris, violeta y azul',
    desc: 'Tres pares lisos en gris, violeta y azul. Hay talles para chicos y para grandes.',
    tags: ['soquetes', 'calcetines', 'chicos', 'pack', 'ropa interior'] },
  { id: 'malla-enteriza', nombre: 'Malla enteriza', cat: 'ropa-interior', para: ['mujer'], tipo: null,
    ops: [{ v: 'Unidad', precio: 1 }], descuento: 0, stock: 0, alta: 21, visible: false, img: 'images/p-bombachas-pastel.webp', alt: 'Próximo ingreso',
    desc: 'Próximo ingreso.', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const precioOp = (p, op) => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio);
const precioDesde = p => Math.min(...p.ops.map(op => precioOp(p, op)));
const catDe = id => CATEGORIAS.find(c => c.id === id);

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  const grupoDe = p => CATEGORIAS.find(c => c.id === p.cat)?.grupo;
  function coincide(p, f) {
    const cat = lista(f.cat), para = lista(f.para), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.grupo && grupoDe(p) !== f.grupo) return false;
    if (para.length && !(p.para || []).some(x => para.includes(x))) return false;
    if (f.tipo === 'unica' && !p.unica) return false;
    if (f.tipo === 'nuevo' && p.unica) return false;
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
    const cat = catDe(p.cat);
    textoBusqueda.set(p.id, norm([
      p.nombre, cat?.nombre, p.desc, p.tipo, p.talle ? `talle ${p.talle}` : '', p.estado, p.unica ? 'pieza unica circular americana usada segunda mano' : 'nuevo',
      ...(p.para || []).map(x => PARA[x] || ''),
      ...p.ops.map(op => op.v), ...(p.tags || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9+,]+/).filter(Boolean)));
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
const opDe = (p, v) => p.ops.find(op => op.v === v) || p.ops[0];

const Cart = {
  KEY: 'laguanaka_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { console.warn(e); } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = null) {
    const items = this.get();
    const variante = v ?? producto.ops[0].v;
    const max = producto.stock ?? 99;
    const existing = items.find(i => i.id === producto.id && i.v === variante);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v: variante, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  has(id) { return this.get().some(i => i.id === id); },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, opDe(p, i.v)) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  percha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7.5a2 2 0 1 1 2-2c0 1.2-2 1.7-2 3v1"/><path d="m12 9.5 9 6.2a1.3 1.3 0 0 1-.74 2.3H3.74A1.3 1.3 0 0 1 3 15.7Z"/></svg>',
  hoja: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22V9"/><path d="M12 13c-3.5 0-5.5-2-6-5 3.3 0 5.5 1.8 6 5Z"/><path d="M12 10c3.2 0 5.2-1.8 5.6-4.6-3 0-5.1 1.7-5.6 4.6Z"/><path d="M12 17c3.4 0 5.6-1.7 6.2-4.6-3.2 0-5.6 1.6-6.2 4.6Z"/></svg>',
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

function resumenVar(p) {
  if (p.unica) return `Talle ${p.talle} · Estado ${p.estado.toLowerCase()}`;
  if (p.ops.length === 1) return p.ops[0].v;
  const primero = p.ops[0].v, ultimo = p.ops[p.ops.length - 1].v;
  if (p.tipo === 'Aumento') return `Aumentos ${primero} a ${ultimo}`;
  if (p.tipo === 'Color') return `${p.ops.length} colores: ${p.ops.map(op => op.v.toLowerCase()).join(' y ')}`;
  if (p.tipo === 'Talle' && p.ops.some(op => /años|adulto/i.test(op.v))) return 'Talles de niños y de adultos';
  return `Talles ${primero} a ${ultimo}`;
}
const metaDe = p => (p.unica ? 'Ropa circular · Pieza única' : catDe(p.cat)?.nombre || '');

function cardHTML(p, { anim = true } = {}) {
  const varias = p.ops.length > 1 && new Set(p.ops.map(op => op.precio)).size > 1;
  const base = Math.min(...p.ops.map(op => op.precio));
  let badge = '';
  if (p.unica) badge = '<span class="tag tag--card">Pieza única</span>';
  else if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (p.stock > 0 && p.stock <= 3) badge = '<span class="pcard__badge">Últimas unidades</span>';
  else if (catDe(p.cat)?.grupo === 'temporada') badge = '<span class="pcard__badge pcard__badge--nuevo">Temporada</span>';
  const sinStock = !(p.stock > 0);
  const control = p.unica
    ? '<span class="pcard__uno" title="Hay una sola">1 de 1</span>'
    : `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
  return `<article class="pcard${p.unica ? ' pcard--unica' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : ''}>
  <div class="pcard__media">
    <div class="pcard__foto" data-quick="${esc(p.id)}"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800"></div>
    ${badge}
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>Comprar ahora</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${esc(metaDe(p))}</p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__var">${esc(resumenVar(p))}</p>
    <p class="pcard__precio">${varias ? '<span class="desde">desde</span>' : ''}<span>${formatearPrecio(precioDesde(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(base)}</s>` : ''}</p>
    <div class="prod-actions">
      ${control}
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
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
  const desktopMq = window.matchMedia('(min-width: 1024px)');
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

function initCatsMenu(catActual = '') {
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    const lista = box.querySelector('[data-cats-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="40" height="40"><span>${esc(c.nombre)}</span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    lista.querySelectorAll('a').forEach(a => a.addEventListener('click', () => cerrar()));
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1024px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    function cerrar() { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
  });
}

function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const percha = track.hasAttribute('data-percha');
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  items.forEach(cachear);
  track.innerHTML = items.map(p => percha
    ? `<div class="rail-item rail-item--percha"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)"><div class="percha"><span class="percha__gancho" aria-hidden="true"><svg viewBox="0 0 40 30"><path d="M20 11V8.5c0-1.4 2.6-2 2.6-4.1a2.6 2.6 0 0 0-5.2 0"/><path d="M20 11 3 24.5h34Z"/></svg></span>${cardHTML(p, { anim: false })}</div></div></div>`
    : `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(64px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 16;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
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
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => {
    if (el.closest('[data-cat-opciones]')) return;
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.hasAttribute('data-cuenta-corta') ? String(n) : `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
  document.querySelectorAll('[data-cuenta-unicas]').forEach(el => {
    const n = Tienda.contar({ tipo: 'unica', stock: true });
    el.textContent = `${n} piezas únicas`;
  });
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const tit = TITULO_VAR[p.tipo] || 'Elegí una opción';
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', tit);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.innerHTML = `<div class="picker__head"><p class="picker__tit">${esc(tit)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    <div class="picker__ops">${p.ops.map((op, i) => `<button type="button" class="picker__op" data-picker-op="${i}"><span>${esc(op.v)}</span><b>${formatearPrecio(precioOp(p, op))}</b></button>`).join('')}</div>
    ${qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : ''}`;
  card.appendChild(pk);
  pk.querySelector('.picker__op')?.focus();
}

function sumarAlCarrito(p, qty, v, comprar) {
  if (p.unica && Cart.has(p.id)) {
    if (comprar) abrirCarrito();
    else showToast(`${p.nombre} ya está en tu carrito: hay una sola.`);
    return;
  }
  Cart.add(p, qty, v);
  const op = opDe(p, v);
  const detalle = p.ops.length > 1 ? ` (${op.v})` : '';
  if (comprar) abrirCarrito();
  else showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${detalle} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p?.stock || 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (p.ops.length > 1) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const op = p.ops[Number(opBtn.dataset.pickerOp)] || p.ops[0];
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, op.v, pk.dataset.modo === 'comprar');
      pk.remove();
      card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab') return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: 0, qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p; qvEstado.op = 0; qvEstado.qty = 1;
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
    itemCondition: p.unica ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(op => precioOp(p, op))), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const op = p.ops[qvEstado.op];
  const tit = TITULO_VAR[p.tipo] || '';
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = p.unica ? 'Hay una sola' : p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  const enCarrito = p.unica && Cart.has(p.id);
  const ficha = p.unica
    ? `<dl class="qv__ficha"><div><dt>Talle</dt><dd>${esc(p.talle)}</dd></div><div><dt>Estado</dt><dd>${esc(p.estado)}</dd></div><div><dt>Para</dt><dd>${esc((p.para || []).map(x => PARA[x]).join(' y '))}</dd></div></dl>`
    : p.ops.length > 1 ? `<div class="qv__var"><p class="qv__var-tit">${esc(tit)}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(tit)}">${p.ops.map((o, i) => `<button type="button" class="qv__op" role="radio" aria-checked="${i === qvEstado.op}" data-qv-op="${i}"><b>${esc(o.v)}</b><span>${formatearPrecio(precioOp(p, o))}</span></button>`).join('')}</div></div>` : `<p class="qv__meta">${esc(op.v)}</p>`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="800" height="800">${p.unica ? '<span class="tag tag--qv">Pieza única</span>' : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(metaDe(p))}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__precio"><span data-qv-precio>${formatearPrecio(precioOp(p, op))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(op.precio)}</s>` : ''}</p>
      ${ficha}
      <p class="qv__stock">${ICO.check}${esc(stock)} · confirmás el pedido por WhatsApp</p>
      <div class="qv__acc">
        ${p.unica ? '' : `<div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`}
        <button type="button" class="btn btn--cta" data-qv-add${p.stock > 0 && !enCarrito ? '' : ' disabled'}>${ICO.carrito}${enCarrito ? 'Ya está en tu carrito' : 'Agregar al carrito'}</button>
        <button type="button" class="btn btn--ghost" data-qv-comprar${p.stock > 0 ? '' : ' disabled'}>Comprar ahora</button>
      </div>
      <p class="qv__desc">${esc(p.desc)}</p>
      ${p.unica ? `<p class="qv__nota">${ICO.percha}<span>${esc(NOTA_UNICA)}</span></p>` : ''}
      ${p.nota ? `<p class="qv__nota">${ICO.info}<span>${esc(p.nota)}</span></p>` : ''}
      <a class="qv__wsp" href="${wspLink(`Hola La Guanaka! Tengo una consulta sobre: ${p.nombre}${p.unica ? ` (talle ${p.talle})` : ''}`)}" target="_blank" rel="noopener">${ICO.wsp}${p.unica ? 'Pedí medidas o más fotos por WhatsApp' : '¿Dudas con el talle? Preguntanos por WhatsApp'}</a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede gustar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
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
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = Number(opBtn.dataset.qvOp);
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      qvEstado.qty = Math.max(1, Math.min(qvEstado.p?.stock || 99, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const add = e.target.closest('[data-qv-add], [data-qv-comprar]');
    if (add && qvEstado.p) {
      const p = qvEstado.p;
      const comprar = add.hasAttribute('data-qv-comprar');
      if (comprar) { if (!(p.unica && Cart.has(p.id))) Cart.add(p, qvEstado.qty, p.ops[qvEstado.op].v); cerrarQV(); abrirCarrito(); return; }
      sumarAlCarrito(p, qvEstado.qty, p.ops[qvEstado.op].v, false);
      if (p.unica) { pintarQV(); qv.querySelector('[data-qv-comprar]')?.focus(); }
    }
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.closest('[data-qv-op]') && qvEstado.p) {
      const n = qvEstado.p.ops.length;
      qvEstado.op = (qvEstado.op + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      pintarQV();
      qv.querySelector(`[data-qv-op="${qvEstado.op}"]`)?.focus();
      e.preventDefault();
      return;
    }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = new URLSearchParams(location.search).get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
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
    body.innerHTML = `<div class="cart-vacio">${ICO.percha}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Hay prendas únicas esperando en el perchero.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul>${items.map(i => {
    const p = getProducto(i.id);
    const op = opDe(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="74" height="74">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(p.unica ? `Pieza única · talle ${p.talle}` : op.v)} · ${formatearPrecio(precioOp(p, op))}${p.unica ? '' : ' c/u'}</p>
        <div class="linea__acc">${p.unica ? '<span class="pcard__uno">1 de 1</span>' : `<div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>`}
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioOp(p, op) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); const op = opDe(p, i.v); return `- ${i.qty} × ${p.nombre}${p.unica ? ` (pieza única, talle ${p.talle})` : p.ops.length > 1 ? ` (${op.v})` : ''}: ${formatearPrecio(precioOp(p, op) * i.qty)}`; }).join('\n');
  const msg = `Hola La Guanaka! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <p class="drawer__nota">${ICO.info}Confirmamos talle, stock y entrega por WhatsApp.</p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--ghost" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); }
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
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

function initBusco() {
  document.querySelectorAll('[data-busco]').forEach(form => {
    const que = form.querySelector('[name="que"]');
    const talle = form.querySelector('[name="talle"]');
    const nota = form.querySelector('.busco__nota');
    if (!que || !nota) return;
    const original = nota.textContent;
    const limpiar = () => { que.removeAttribute('aria-invalid'); nota.textContent = original; nota.classList.remove('error'); };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const texto = que.value.trim().replace(/\s+/g, ' ');
      if (texto.length < 3) {
        que.setAttribute('aria-invalid', 'true');
        nota.textContent = 'Contanos qué prenda o accesorio buscás (por ejemplo, «campera de jean»).';
        nota.classList.add('error');
        que.focus();
        return;
      }
      limpiar();
      const t = talle?.value ? ` en talle ${talle.value}` : '';
      window.open(wspLink(`Hola La Guanaka! Estoy buscando: ${texto}${t}. ¿Me avisan si entra algo así?`), '_blank', 'noopener');
      showToast('Te abrimos WhatsApp con tu búsqueda lista para enviar.');
    });
    que.addEventListener('input', () => { if (que.hasAttribute('aria-invalid')) limpiar(); });
  });
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-38.9516, -68.0591);
  const mapa = L.map(el, { center: centro, zoom: 14, scrollWheelZoom: false, zoomControl: true, attributionControl: true, dragging: !window.matchMedia('(pointer: coarse)').matches, tap: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  const icono = L.divIcon({ className: 'pin', html: '<span class="pin__dot"></span>', iconSize: [44, 44], iconAnchor: [22, 22] });
  L.marker(centro, { icon: icono, keyboard: false, title: 'La Guanaka' }).addTo(mapa);
  L.circle(centro, { radius: 520, color: '#2E5AAC', weight: 1, fillColor: '#2E5AAC', fillOpacity: 0.08 }).addTo(mapa);
  const ancho = el.closest('.enc2__mapa');
  const refrescar = () => {
    mapa.invalidateSize();
    if (!ancho) return;
    mapa.setView(centro, 14, { animate: false });
    if (window.innerWidth > 700) mapa.panBy([-Math.round(el.clientWidth * 0.22), 0], { animate: false });
  };
  refrescar();
  window.addEventListener('load', refrescar);
  window.addEventListener('resize', refrescar, { passive: true });
  setTimeout(refrescar, 600);
}

function initLeerScroll() {
  document.querySelectorAll('[data-leer]').forEach(p => {
    const palabras = p.textContent.trim().split(/\s+/);
    p.innerHTML = palabras.map(w => `<span class="leer__w">${esc(w)}</span>`).join(' ');
    const spans = [...p.querySelectorAll('.leer__w')];
    if (reduceMotion || typeof ScrollTrigger === 'undefined') { spans.forEach(s => s.classList.add('on')); return; }
    ScrollTrigger.create({
      trigger: p, start: 'top 82%', end: 'bottom 48%',
      onUpdate: s => { const n = Math.round(s.progress * spans.length); spans.forEach((sp, i) => sp.classList.toggle('on', i < n)); },
      onLeave: () => spans.forEach(sp => sp.classList.add('on')),
    });
  });
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const estado = {
    cat: valido(params.get('cat'), catIds),
    grupo: valido(params.get('grupo'), GRUPOS),
    para: valido(params.get('para'), PARA),
    tipo: valido(params.get('tipo'), TIPOS),
    precio: valido(params.get('precio'), RANGOS),
    stock: params.get('stock') === '1',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: valido(params.get('orden'), ORDENES) || 'destacados',
  };
  if (estado.cat) estado.grupo = '';
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosN = document.querySelector('[data-filtros-n]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoBoton = cont.dataset.catOpciones === 'botones';
    const opciones = [{ id: '', nombre: 'Todo' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => comoBoton
      ? `<button type="button" class="chip" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todas')}</span><span class="opt__n" data-cuenta-cat="${c.id}"></span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.grupo && sin !== 'cat') f.grupo = estado.grupo;
    if (estado.para && sin !== 'para') f.para = estado.para;
    if (estado.tipo && sin !== 'tipo') f.tipo = estado.tipo;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      const todoConGrupo = f === 'cat' && !!estado.grupo;
      if (el.type === 'radio') el.checked = el.value === estado[f] && !(todoConGrupo && !el.value);
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else if (el.tagName === 'SELECT') el.value = estado[f] || '';
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === estado[f] && !(todoConGrupo && !el.dataset.valor)));
    });
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cat-opciones] [data-cuenta-cat]').forEach(el => {
      const id = el.dataset.cuentaCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-para]').forEach(el => {
      const id = el.dataset.cuentaPara;
      el.textContent = Tienda.contar({ ...filtrosDe('para'), ...(id ? { para: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-tipo]').forEach(el => {
      const id = el.dataset.cuentaTipo;
      el.textContent = Tienda.contar({ ...filtrosDe('tipo'), ...(id ? { tipo: id } : {}) });
    });
    const activos = ['cat', 'grupo', 'para', 'tipo', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0);
    if (filtrosN) { const enPanel = ['para', 'tipo', 'precio'].filter(k => estado[k]).length + (estado.stock ? 1 : 0) + (document.querySelector('#filtros [data-cat-opciones]') ? (estado.cat ? 1 : 0) : 0); filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    limpiarBtns.forEach(b => { b.hidden = !(activos || estado.q); });
    const cat = catIds[estado.cat];
    const grupo = GRUPOS[estado.grupo];
    const para = PARA[estado.para];
    let titulo = cat ? cat.nombre : grupo ? grupo.titulo : estado.tipo === 'unica' ? 'Piezas únicas' : 'Todo el catálogo';
    if (para) titulo += ` · ${para}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? cat.bajada : grupo ? grupo.bajada : 'Ropa circular de una sola pieza, ropa interior, bijouterie, marroquinería, calzado, gorras y lentes.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = !cat && !grupo && !para && !estado.tipo; miga.textContent = titulo; }
    document.title = `${titulo} — La Guanaka`;
    document.querySelectorAll('.nav-cats__lista a').forEach(a => {
      if (a.getAttribute('href') === `${URL_CATALOGO}?cat=${estado.cat}`) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'grupo', 'para', 'tipo', 'precio', 'q', 'orden', 'stock', 'buscar'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.grupo) u.searchParams.set('grupo', estado.grupo);
    if (estado.para) u.searchParams.set('para', estado.para);
    if (estado.tipo) u.searchParams.set('tipo', estado.tipo);
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.stock) u.searchParams.set('stock', '1');
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
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    if (f === 'cat') estado.grupo = '';
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) { estado[b.dataset.filtro] = b.dataset.valor || ''; if (b.dataset.filtro === 'cat') estado.grupo = ''; aplicar(); return; }
    if (e.target.closest('[data-limpiar]')) {
      estado.cat = ''; estado.grupo = ''; estado.para = ''; estado.tipo = ''; estado.precio = ''; estado.stock = false; estado.q = '';
      if (buscar) buscar.value = '';
      aplicar();
    }
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
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('input, button')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (params.get('buscar') === '1' && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.sticker, .hero-badge', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-4 + 8 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initRail,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initCatsMenu(cat || ''); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initBusco,
  initMapa,
  initLeerScroll,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
