'use strict';

const WA = '5491137721174';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const HORARIO = { dias: [1, 2, 3, 4, 5, 6], abre: 11, cierra: 19 };
const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const CATEGORIAS = [
  { id: 'anillos', nombre: 'Anillos', img: 'images/p-alianza-oro.webp' },
  { id: 'aros', nombre: 'Aros', img: 'images/p-abridores-oro.webp' },
  { id: 'cadenas', nombre: 'Cadenas y dijes', img: 'images/p-cadena-piedra-luna-acero.webp' },
  { id: 'pulseras', nombre: 'Pulseras', img: 'images/p-esclava-labrada-plata.webp' },
  { id: 'relojes', nombre: 'Relojes', img: 'images/p-reloj-cuadrado-dorado.webp' },
];

const MATERIALES = [
  { id: 'plata', nombre: 'Plata 925', punzon: '925', img: 'images/p-cadena-corazon-plata.webp' },
  { id: 'oro', nombre: 'Oro 18k', punzon: '750', img: 'images/p-abridores-oro.webp' },
  { id: 'acero', nombre: 'Acero quirúrgico', punzon: '316L', img: 'images/p-pulsera-acero.webp' },
];

const PRECIOS = {
  'hasta-50': [0, 50000, 'Hasta $50.000'],
  '50-200': [50000, 200000, '$50.000 a $200.000'],
  'mas-200': [200000, Infinity, 'Más de $200.000'],
};

const ORDENES = {
  destacados: 'Destacados',
  nuevos: 'Recién llegadas',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const TALLE_MIN = 6;
const TALLE_MAX = 30;
const TALLES_FILTRO = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

const talles = (stock, precio) => Object.entries(stock).map(([t, s]) => ({ id: `t${t}`, nombre: t, talle: Number(t), precio, stock: s }));
const largos = lista => lista.map(([cm, precio, stock]) => ({ id: `${cm}cm`, nombre: `${cm} cm`, precio, stock }));
const unico = (precio, stock) => [{ id: 'unico', nombre: 'Única', precio, stock }];

const PRODUCTOS = [
  {
    id: 'cadena-chapita-oro', nombre: 'Cadena con dije chapita', cat: 'cadenas', mat: 'oro', img: 'images/p-cadena-chapita-oro.webp',
    desc: 'Cadena fina de oro 18 kilates con una chapita lisa y redonda. Elegís el largo: 40 cm queda a la altura del cuello y 50 cm cae sobre el escote.',
    opcTipo: 'largo', opc: largos([[40, 389000, 3], [45, 412000, 4], [50, 436000, 2]]),
    ficha: [['Material', 'Oro 18k'], ['Dije', 'Chapita lisa de 9 mm'], ['Cierre', 'Mosquetón']], destacado: 1,
  },
  {
    id: 'anillo-solitario-plata', nombre: 'Anillo solitario con circonia', cat: 'anillos', mat: 'plata', img: 'images/p-solitario-plata.webp',
    desc: 'Anillo fino de plata 925 con una circonia engarzada en cuatro garras. Liviano para usar todos los días y clásico para regalar.',
    opcTipo: 'talle', opc: talles({ 10: 2, 11: 3, 12: 4, 13: 5, 14: 6, 15: 4, 16: 3, 17: 2, 18: 0, 19: 1, 20: 1 }, 38900),
    ficha: [['Material', 'Plata 925'], ['Piedra', 'Circonia de 5 mm'], ['Ancho', '1,6 mm']], destacado: 2,
  },
  {
    id: 'reloj-clasico-cuero', nombre: 'Reloj clásico esfera blanca', cat: 'relojes', mat: null, img: 'images/p-reloj-clasico.webp',
    desc: 'Reloj analógico con caja de acero, esfera blanca con índices finos y malla de cuero negro con hebilla.',
    opcTipo: null, opc: unico(96000, 5),
    ficha: [['Caja', 'Acero, 40 mm'], ['Malla', 'Cuero negro'], ['Mecanismo', 'Cuarzo'], ['Esfera', 'Blanca con índices']], destacado: 3,
  },
  {
    id: 'argollas-plata', nombre: 'Argollas lisas de 12 mm', cat: 'aros', mat: 'plata', img: 'images/p-argollas-plata.webp',
    desc: 'Argollas abombadas de plata 925 con cierre a presión. Quedan pegadas al lóbulo y combinan con todo.',
    opcTipo: null, opc: unico(32900, 9),
    ficha: [['Material', 'Plata 925'], ['Diámetro', '12 mm'], ['Cierre', 'A presión']], destacado: 4,
  },
  {
    id: 'alianza-oro', nombre: 'Alianza clásica de 4 mm', cat: 'anillos', mat: 'oro', img: 'images/p-alianza-oro.webp',
    desc: 'Alianza de oro 18 kilates, media caña de 4 mm, pulida a espejo. Para casamiento, compromiso o para usar sola.',
    opcTipo: 'talle', opc: talles({ 10: 1, 11: 2, 12: 2, 13: 3, 14: 3, 15: 2, 16: 2, 17: 1, 18: 2, 19: 1, 20: 2, 21: 1, 22: 1 }, 520000),
    ficha: [['Material', 'Oro 18k'], ['Ancho', '4 mm'], ['Terminación', 'Pulida']], destacado: 5,
  },
  {
    id: 'pulsera-eslabones-acero', nombre: 'Pulsera de eslabones', cat: 'pulseras', mat: 'acero', img: 'images/p-pulsera-acero.webp',
    desc: 'Pulsera de acero quirúrgico con eslabones que alternan mate y brillo, y cierre de traba. No se oscurece con el uso diario.',
    opcTipo: null, opc: unico(28900, 7),
    ficha: [['Material', 'Acero quirúrgico 316L'], ['Largo', '20 cm'], ['Ancho', '10 mm']], destacado: 6,
  },
  {
    id: 'abridores-oro', nombre: 'Abridores con circonia engarzada', cat: 'aros', mat: 'oro', img: 'images/p-abridores-oro.webp',
    desc: 'Abridores de oro 18 kilates con una circonia en engarce de bisel. Chicos y cómodos para usar todos los días.',
    opcTipo: null, opc: unico(168000, 4),
    ficha: [['Material', 'Oro 18k'], ['Piedra', 'Circonia de 3 mm'], ['Cierre', 'Mariposa']], destacado: 7,
  },
  {
    id: 'cadena-corazon-plata', nombre: 'Cadena con dije corazón', cat: 'cadenas', mat: 'plata', img: 'images/p-cadena-corazon-plata.webp',
    desc: 'Cadena de plata 925 tipo rolo fino con un dije de corazón inflado. Elegís el largo según dónde querés que caiga.',
    opcTipo: 'largo', opc: largos([[40, 45900, 4], [45, 47900, 6], [50, 49900, 3]]),
    ficha: [['Material', 'Plata 925'], ['Dije', 'Corazón de 1 cm'], ['Cierre', 'Mosquetón']], destacado: 8,
  },
  {
    id: 'reloj-acero-gris', nombre: 'Reloj de acero esfera gris', cat: 'relojes', mat: null, img: 'images/p-reloj-acero.webp',
    desc: 'Reloj analógico con caja y malla de acero, esfera gris con terminación soleil e índices aplicados.',
    opcTipo: null, opc: unico(148000, 3),
    ficha: [['Caja', 'Acero, 42 mm'], ['Malla', 'Eslabones de acero'], ['Mecanismo', 'Cuarzo'], ['Esfera', 'Gris']], destacado: 9,
  },
  {
    id: 'abridores-circonia-plata', nombre: 'Abridores con circonia de 6 mm', cat: 'aros', mat: 'plata', img: 'images/p-abridores-circonia-plata.webp',
    desc: 'Abridores de plata 925 con una circonia redonda montada en seis garras. Brillan sin ser grandes.',
    opcTipo: null, opc: unico(24900, 12),
    ficha: [['Material', 'Plata 925'], ['Piedra', 'Circonia de 6 mm'], ['Cierre', 'Mariposa']], destacado: 10, nuevo: true,
  },
  {
    id: 'argollas-oro', nombre: 'Argollas de 15 mm', cat: 'aros', mat: 'oro', img: 'images/p-argollas-oro.webp',
    desc: 'Argollas de oro 18 kilates de caña redonda, con cierre de bisagra. Un clásico que no pasa.',
    opcTipo: null, opc: unico(245000, 3),
    ficha: [['Material', 'Oro 18k'], ['Diámetro', '15 mm'], ['Cierre', 'Bisagra']], destacado: 11,
  },
  {
    id: 'aros-estrella-acero', nombre: 'Abridores estrella dorados', cat: 'aros', mat: 'acero', img: 'images/p-aros-estrella-acero.webp',
    desc: 'Abridores de acero quirúrgico con baño dorado y forma de estrella. Livianos y para todos los días.',
    opcTipo: null, opc: unico(12900, 15),
    ficha: [['Material', 'Acero quirúrgico con baño dorado'], ['Medida', '8 mm'], ['Cierre', 'Mariposa']], destacado: 12,
  },
  {
    id: 'anillo-serpiente-acero', nombre: 'Anillo serpiente', cat: 'anillos', mat: 'acero', img: 'images/p-anillo-serpiente-acero.webp',
    desc: 'Anillo de acero quirúrgico con forma de serpiente texturada y terminación oscura.',
    opcTipo: 'talle', opc: talles({ 14: 2, 16: 4, 18: 4, 20: 3, 22: 2 }, 16900),
    ficha: [['Material', 'Acero quirúrgico 316L'], ['Terminación', 'Oscura'], ['Ancho', '3 mm']], destacado: 13,
  },
  {
    id: 'cadena-piedra-luna-acero', nombre: 'Cadena con dije de piedra luna', cat: 'cadenas', mat: 'acero', img: 'images/p-cadena-piedra-luna-acero.webp',
    desc: 'Cadena de acero quirúrgico dorado con un dije redondo de piedra luna enmarcado.',
    opcTipo: null, opc: unico(22900, 8),
    ficha: [['Material', 'Acero quirúrgico con baño dorado'], ['Largo', '45 cm'], ['Dije', 'Piedra luna de 12 mm']], destacado: 14,
  },
  {
    id: 'reloj-cuero-marron', nombre: 'Reloj slim malla marrón', cat: 'relojes', mat: null, img: 'images/p-reloj-cuero-marron.webp',
    desc: 'Reloj de caja fina dorada, esfera blanca con índices rosados y malla de cuero marrón.',
    opcTipo: null, opc: unico(88000, 4),
    ficha: [['Caja', 'Dorada, 40 mm'], ['Malla', 'Cuero marrón'], ['Mecanismo', 'Cuarzo'], ['Esfera', 'Blanca']], destacado: 15,
  },
  {
    id: 'reloj-cuadrado-dorado', nombre: 'Reloj cuadrado dorado', cat: 'relojes', mat: null, img: 'images/p-reloj-cuadrado-dorado.webp',
    desc: 'Reloj de mujer con caja cuadrada, esfera con números romanos y malla de eslabones dorados.',
    opcTipo: null, opc: unico(112000, 2),
    ficha: [['Caja', 'Dorada, 26 mm'], ['Malla', 'Eslabones dorados'], ['Mecanismo', 'Cuarzo'], ['Números', 'Romanos']], destacado: 16, nuevo: true,
  },
  {
    id: 'solitario-oro', nombre: 'Solitario con circonia oval', cat: 'anillos', mat: 'oro', img: 'images/p-solitario-oro.webp',
    desc: 'Anillo de oro 18 kilates con una circonia oval montada en cuatro garras. Pensado para un compromiso.',
    opcTipo: 'talle', opc: talles({ 11: 1, 12: 2, 13: 2, 14: 3, 15: 2, 16: 1, 17: 1 }, 485000),
    ficha: [['Material', 'Oro 18k'], ['Piedra', 'Circonia oval de 9 x 7 mm'], ['Montura', 'Cuatro garras']], nuevo: true,
  },
  {
    id: 'aros-perla-oro', nombre: 'Argollitas con perla', cat: 'aros', mat: 'oro', img: 'images/p-aros-perla-oro.webp',
    desc: 'Argollitas de oro 18 kilates con una perla colgante. Chicas, delicadas y fáciles de combinar.',
    opcTipo: null, opc: unico(198000, 3),
    ficha: [['Material', 'Oro 18k'], ['Perla', 'Colgante de 6 mm'], ['Cierre', 'Bisagra']], nuevo: true,
  },
  {
    id: 'anillo-geometrico-plata', nombre: 'Anillo calado geométrico', cat: 'anillos', mat: 'plata', img: 'images/p-anillo-geometrico-plata.webp',
    desc: 'Anillo de plata 925 con diseño calado en líneas rectas. Moderno, liviano y fácil de combinar con otros.',
    opcTipo: 'talle', opc: talles({ 12: 2, 13: 3, 14: 3, 15: 2, 16: 2, 17: 1 }, 29900),
    ficha: [['Material', 'Plata 925'], ['Ancho', '9 mm'], ['Terminación', 'Pulida']], nuevo: true,
  },
  {
    id: 'esclava-labrada-plata', nombre: 'Esclava labrada con bisagra', cat: 'pulseras', mat: 'plata', img: 'images/p-esclava-labrada-plata.webp',
    desc: 'Esclava ancha de plata 925 con textura labrada y terminación envejecida. Abre con bisagra y cierra con traba.',
    opcTipo: null, opc: unico(89900, 2),
    ficha: [['Material', 'Plata 925'], ['Ancho', '2,2 cm'], ['Diámetro interior', '6 cm']],
  },
  {
    id: 'anillo-pave-plata', nombre: 'Anillo pavé de circonias', cat: 'anillos', mat: 'plata', img: 'images/p-anillo-pave-plata.webp',
    desc: 'Anillo ancho de plata 925 cubierto de circonias. Para usarlo solo, como pieza principal.',
    opcTipo: 'talle', opc: talles({ 13: 1, 14: 2, 15: 2, 16: 1, 17: 1, 18: 1 }, 52900),
    ficha: [['Material', 'Plata 925'], ['Piedras', 'Circonias en pavé'], ['Ancho', '11 mm']],
  },
  {
    id: 'anillo-piedra-verde-plata', nombre: 'Anillo con piedra verde y circonias', cat: 'anillos', mat: 'plata', img: 'images/p-anillo-piedra-verde-plata.webp',
    desc: 'Anillo de plata 925 con una piedra verde rectangular rodeada por una orla de circonias.',
    opcTipo: 'talle', opc: talles({ 12: 1, 13: 2, 14: 2, 15: 1, 16: 1 }, 58900),
    ficha: [['Material', 'Plata 925'], ['Piedra', 'Verde sintética de 8 x 6 mm'], ['Orla', 'Circonias']],
  },
  {
    id: 'esclava-cubic-oro', nombre: 'Esclava con línea de cubic', cat: 'pulseras', mat: 'oro', img: 'images/p-esclava-cubic-oro.webp',
    desc: 'Esclava rígida de oro 18 kilates con una línea de cubic en el frente y cierre de traba.',
    opcTipo: null, opc: unico(690000, 1),
    ficha: [['Material', 'Oro 18k'], ['Piedras', 'Línea de cubic'], ['Diámetro interior', '6 cm']],
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const opcDe = (p, opcId) => p.opc.find(x => x.id === opcId) || p.opc[0];
const precioDesde = p => Math.min(...p.opc.map(x => x.precio));
const stockTotal = p => p.opc.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const matDe = id => MATERIALES.find(m => m.id === id);
const necesitaOpciones = p => p.opc.length > 1;
const textoBoton = p => (p.opcTipo === 'talle' ? 'Elegir talle' : p.opcTipo === 'largo' ? 'Elegir largo' : 'Agregar');
const etiquetaOpc = p => (p.opcTipo === 'talle' ? 'Talle' : p.opcTipo === 'largo' ? 'Largo' : 'Presentación');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;
const talleDePerimetro = mm => Math.min(TALLE_MAX, Math.max(TALLE_MIN, Math.round(mm - 40)));
const tieneTalle = (p, t) => p.opcTipo === 'talle' && p.opc.some(x => x.talle === t && x.stock > 0);

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), mat = lista(f.mat), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (mat.length && !mat.includes(p.mat)) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v >= max) return false;
    }
    if (f.talle && !tieneTalle(p, Number(f.talle))) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (f.destacado && !p.destacado) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'nuevos': return (a, b) => Number(!!b.nuevo) - Number(!!a.nuevo) || (a.destacado || 999) - (b.destacado || 999) || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || Number(!!b.nuevo) - Number(!!a.nuevo) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
    const m = matDe(p.mat);
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, m?.nombre, m?.punzon, m ? 'joya joyas' : 'reloj relojeria', p.desc,
      ...p.opc.map(x => x.nombre), ...(p.ficha || []).map(f => f[1]), p.nuevo ? 'nuevo novedad' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
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

const Tienda = crearTienda(PRODUCTOS, { tope: TOPE_CONSULTA });

const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) {
    const p = Tienda.obtener(id);
    if (p) cacheProductos.set(id, p);
  }
  return cacheProductos.get(id) || null;
};

const Cart = {
  KEY: 'darioandreoli_cart',
  clave: (id, opc) => `${id}|${opc}`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, { opc } = {}) {
    const o = opcDe(producto, opc);
    const items = this.get();
    const k = this.clave(producto.id, o.id);
    const existing = items.find(i => this.clave(i.id, i.opc) === k);
    const tope = o.stock ?? 99;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, opc: o.id, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i.id, i.opc) === k);
    if (!it) return;
    const p = getProducto(it.id);
    const tope = p ? opcDe(p, it.opc).stock ?? 99 : 99;
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i.id, i.opc) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      const o = opcDe(p, i.opc);
      return { ...i, clave: this.clave(i.id, i.opc), producto: p, opcion: o, unitario: o.precio };
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.unitario * l.qty, 0); },
};

function estadoLocal(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
  const val = t => partes.find(x => x.type === t)?.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
  const min = Number(val('hour')) * 60 + Number(val('minute'));
  const abreHoy = HORARIO.dias.includes(dia);
  if (abreHoy && min >= HORARIO.abre * 60 && min < HORARIO.cierra * 60) {
    return { abierto: true, texto: `Abierto ahora · cierra a las ${HORARIO.cierra} h` };
  }
  if (abreHoy && min < HORARIO.abre * 60) return { abierto: false, texto: `Cerrado · abre hoy a las ${HORARIO.abre} h` };
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (HORARIO.dias.includes(d)) {
      return { abierto: false, texto: `Cerrado · abre ${i === 1 ? 'mañana' : `el ${NOMBRES_DIA[d]}`} a las ${HORARIO.abre} h` };
    }
  }
  return { abierto: false, texto: 'Cerrado' };
}

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const urlProducto = id => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  tarjeta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
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

function punzonHTML(p) {
  const m = matDe(p.mat);
  return m ? `<span class="punzon punzon--${m.id}" title="${esc(m.nombre)}">${esc(m.punzon)}</span>` : '';
}

function sellosHTML(p) {
  const b = [];
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  else if (stockTotal(p) > 0 && stockTotal(p) <= 3) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  const pz = punzonHTML(p);
  return pz || b.length ? `<div class="prod-sellos">${pz || '<span></span>'}${b.join('')}</div>` : '';
}

function precioHTML(p) {
  const desde = new Set(p.opc.map(x => x.precio)).size > 1;
  return `<p class="prod-precio">${desde ? '<span class="prod-desde">desde</span> ' : ''}<strong>${formatearPrecio(precioDesde(p))}</strong></p>`;
}

function metaDe(p) {
  const m = matDe(p.mat);
  return `${esc(catDe(p.cat)?.nombre || '')}${m ? ` · ${esc(m.nombre)}` : ''}`;
}

function cardVitrina(p) {
  return `<article class="prod prod--vitrina" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}" tabindex="-1"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1000" decoding="async"></a>
      ${sellosHTML(p)}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      <a class="btn btn--cta prod-ver" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}">Ver producto ${ICONOS.flecha}</a>
    </div>
  </article>`;
}

function cardHTML(p) {
  return `<article class="prod" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1000" decoding="async"></a>
      ${sellosHTML(p)}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" tabindex="-1">${esc(p.nombre)}</a></h3>
      ${precioHTML(p)}
      <div class="prod-actions">
        ${necesitaOpciones(p) ? `<button type="button" class="prod-add prod-add--opciones" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${textoBoton(p)}</button>` : `<div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">1</output>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICONOS.carrito}<span class="prod-add-txt">Agregar</span></button>`}
      </div>
    </div>
  </article>`;
}

function mosHTML(p, grande) {
  return `<article class="mos${grande ? ' mos--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <a class="mos-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="1000" height="1000" decoding="async"></a>
    ${sellosHTML(p)}
    <div class="mos-body">
      <div class="mos-txt">
        <p class="mos-meta">${metaDe(p)}</p>
        <h3 class="mos-nombre">${esc(p.nombre)}</h3>
        <p class="mos-precio">${new Set(p.opc.map(x => x.precio)).size > 1 ? 'desde ' : ''}${formatearPrecio(precioDesde(p))}</p>
      </div>
      <button type="button" class="mos-add" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${ICONOS.carrito}</button>
    </div>
  </article>`;
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.07, 0.6);
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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
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

function initMenuCategorias() {
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats-btn');
  const panel = cont.querySelector('.nav-cats-panel');
  const params = new URLSearchParams(location.search);
  const catActual = params.get('cat');
  const matActual = params.get('mat');
  $('[data-menu-cats]', cont).innerHTML = CATEGORIAS.map(c => `<li><a href="${paginaCatalogo()}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="1000" height="1000" loading="lazy"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} piezas</small></span></a></li>`).join('');
  $('[data-menu-mats]', cont).innerHTML = MATERIALES.map(m => `<li><a href="${paginaCatalogo()}?mat=${m.id}"${matActual === m.id ? ' aria-current="page"' : ''}><span class="punzon punzon--${m.id}">${esc(m.punzon)}</span><span><strong>${esc(m.nombre)}</strong><small>${Tienda.contar({ mat: m.id })} piezas</small></span></a></li>`).join('');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (hover.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (hover.matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (hover.matches && !cont.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  $$('[data-cuenta-cat]').forEach(el => { el.textContent = `${Tienda.contar({ cat: el.dataset.cuentaCat })} piezas`; });
  $$('[data-cuenta-mat]').forEach(el => { el.textContent = `${Tienda.contar({ mat: el.dataset.cuentaMat })} piezas`; });
}

function initHorario() {
  const els = $$('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoLocal();
    els.forEach(el => { el.textContent = e.texto; el.classList.toggle('estado--abierto', e.abierto); });
  };
  pintar();
  window.setInterval(pintar, 60000);
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

let abrirCarrito = () => {};
let abrirVista = () => {};

function bloquear(on) {
  document.body.classList.toggle('no-scroll', on);
}

function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
      <header class="drawer-head">
        <h2>Tu compra <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <p class="drawer-aviso">${ICONOS.tarjeta}<span>Pagás con Mercado Pago</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--wsp btn--block" data-pedido-wsp href="${waLink('Hola! Quiero hacer un pedido desde la web de Dario Andreoli.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
      </footer>
    </aside>`);
  const drawer = $('#drawer');
  const bd = $('#drawer-bd');
  const body = $('[data-drawer-body]', drawer);
  const foot = $('[data-drawer-foot]', drawer);
  let opener = null;
  let timer = 0;

  const pintar = () => {
    const lineas = Cart.lineas();
    $('[data-drawer-cuenta]', drawer).textContent = lineas.length ? `(${Cart.count()})` : '';
    foot.hidden = !lineas.length;
    if (!lineas.length) {
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.carrito}<p><strong>Tu carrito está vacío.</strong> Mirá la vitrina: anillos, aros, cadenas, pulseras y relojes.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver al catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.img)}" alt="" width="1000" height="1000">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${matDe(l.producto.mat) ? `${esc(matDe(l.producto.mat).nombre)}` : 'Relojería'}${l.producto.opcTipo ? ` · ${esc(etiquetaOpc(l.producto))} ${esc(l.opcion.nombre)}` : ''}</p>
          <div class="linea-acciones">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-paso="-1" aria-label="Restar uno"${l.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
              <output aria-label="Cantidad">${l.qty}</output>
              <button type="button" data-linea-paso="1" aria-label="Sumar uno"${l.qty >= (l.opcion.stock ?? 99) ? ' disabled' : ''}>${ICONOS.mas}</button>
            </div>
            <button type="button" class="linea-quitar" data-linea-quitar aria-label="Quitar ${esc(l.producto.nombre)}">${ICONOS.basura}</button>
          </div>
        </div>
        <p class="linea-precio">${formatearPrecio(l.unitario * l.qty)}</p>
      </li>`).join('')}</ul>`;
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(Cart.total());
    const texto = ['Hola! Quiero hacer este pedido en Dario Andreoli:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre}${l.producto.opcTipo ? ` (${etiquetaOpc(l.producto).toLowerCase()} ${l.opcion.nombre})` : ''} ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
    $('[data-pedido-wsp]', drawer).href = waLink(texto);
  };

  const abrir = () => {
    opener = document.activeElement;
    clearTimeout(timer);
    pintar();
    drawer.hidden = false; bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
    drawer.querySelector('.drawer-close').focus();
  };
  const cerrar = () => {
    drawer.classList.remove('open'); bd.classList.remove('open');
    bloquear(false);
    timer = setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
    opener?.focus?.();
  };
  abrirCarrito = abrir;
  bd.addEventListener('click', cerrar);
  drawer.querySelector('.drawer-close').addEventListener('click', cerrar);
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    const li = e.target.closest('.linea');
    if (!li) return;
    const k = li.dataset.clave;
    const it = Cart.get().find(i => Cart.clave(i.id, i.opc) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  $('[data-finalizar]', drawer).addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle del producto">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media"><img src="images/p-solitario-plata.webp" alt="" width="1000" height="1000" data-qv-img><span data-qv-punzon></span></div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const img = $('[data-qv-img]', bd);
  const punzon = $('[data-qv-punzon]', bd);
  let opener = null;
  let estado = null;

  const guiaHTML = () => `<details class="qv-guia"${estado.guia ? ' open' : ''}>
      <summary>¿No sabés tu talle?</summary>
      <div class="qv-guia-cuerpo">
        <p>Rodeá el dedo con un hilo, marcá dónde se junta y medilo con una regla.</p>
        <div class="qv-guia-campo">
          <label for="qv-perimetro">Perímetro</label>
          <span class="medida-num"><input id="qv-perimetro" type="number" inputmode="decimal" min="40" max="75" step="0.5" value="${estado.perimetro}"><span>mm</span></span>
          <span class="qv-guia-res" data-qv-talle aria-live="polite">Talle ${talleDePerimetro(estado.perimetro)}</span>
        </div>
        <button type="button" class="btn btn--line" data-qv-usar-talle>Usar talle ${talleDePerimetro(estado.perimetro)}</button>
      </div>
    </details>`;

  const pintar = () => {
    const p = estado.p;
    const o = opcDe(p, estado.opc);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { destacado: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const m = matDe(p.mat);
    const elegido = p.opcTipo ? estado.elegido : true;
    const sinStock = elegido && !(o.stock > 0);
    info.innerHTML = `
      <p class="qv-meta">${metaDe(p)}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio"><strong>${formatearPrecio(o.precio)}</strong></p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${necesitaOpciones(p) ? `<fieldset class="opciones${estado.falta ? ' opciones--falta' : ''}"><legend>${etiquetaOpc(p)} ${elegido ? '' : `<span class="opciones-aviso">· elegí ${p.opcTipo === 'talle' ? 'tu talle' : 'el largo'}</span>`}</legend><div class="chips">${p.opc.map(x => `<label class="chip"><input type="radio" name="qv-opc" value="${esc(x.id)}"${elegido && x.id === o.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.nombre)}</span></label>`).join('')}</div></fieldset>` : ''}
      ${p.opcTipo === 'talle' ? guiaHTML() : ''}
      <p class="qv-stock">${sinStock ? 'Sin stock en esta opción.' : elegido && o.stock <= 3 ? `Quedan ${o.stock} ${p.opcTipo === 'talle' ? 'en este talle' : ''}.` : 'En stock · también la podés ver en el local.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por: ${p.nombre}${m ? ` (${m.nombre})` : ''}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar por esta pieza</span></a>
      <dl class="qv-ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Tipo</dt><dd>${esc(catDe(p.cat)?.nombre)}</dd></div></dl>
      <p class="qv-legal">Foto ilustrativa. Precio y stock de muestra.</p>
      ${rel.length ? `<div class="qv-rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    img.src = p.img;
    img.alt = p.nombre;
    punzon.innerHTML = punzonHTML(p);
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre,
      material: m?.nombre, image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'Dario Andreoli' },
      offers: p.opc.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: x.precio, availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const agregar = () => {
    const p = estado.p;
    if (p.opcTipo && !estado.elegido) {
      estado.falta = true;
      pintar();
      info.querySelector('.opciones input:not(:disabled)')?.focus();
      showToast(p.opcTipo === 'talle' ? 'Elegí tu talle para agregarlo.' : 'Elegí el largo para agregarla.');
      return false;
    }
    const o = opcDe(p, estado.opc);
    Cart.add(p, estado.qty, { opc: o.id });
    showToast(`${p.nombre}${p.opcTipo ? ` · ${etiquetaOpc(p).toLowerCase()} ${o.nombre}` : ''} al carrito`);
    return true;
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    const o = p.opc.find(x => x.stock > 0) || p.opc[0];
    estado = { p, opc: o.id, elegido: !p.opcTipo, qty: Math.max(1, Math.min(qty, o.stock || 1)), falta: false, perimetro: 54, guia: false };
    if (bd.hidden) opener = document.activeElement;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    const objetivo = foco === 'opciones' ? info.querySelector('.opciones input:not(:disabled)') : null;
    (objetivo || bd.querySelector('.qv-close')).focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    window.history.replaceState(null, '', url);
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
    opener?.focus?.();
  };
  const elegir = (opcId, foco = true) => {
    estado.opc = opcId;
    estado.elegido = true;
    estado.falta = false;
    const o = opcDe(estado.p, opcId);
    estado.qty = Math.min(estado.qty, o.stock || 1);
    pintar();
    if (foco) info.querySelector(`input[name="qv-opc"][value="${window.CSS.escape(opcId)}"]`)?.focus();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name === 'qv-opc') elegir(e.target.value);
  });
  info.addEventListener('input', e => {
    if (e.target.id !== 'qv-perimetro') return;
    const v = parseFloat(String(e.target.value).replace(',', '.'));
    if (!Number.isFinite(v)) return;
    estado.perimetro = v;
    const t = talleDePerimetro(v);
    $('[data-qv-talle]', info).textContent = `Talle ${t}`;
    $('[data-qv-usar-talle]', info).textContent = `Usar talle ${t}`;
  });
  info.addEventListener('toggle', e => { if (e.target.classList?.contains('qv-guia')) estado.guia = e.target.open; }, true);
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const o = opcDe(estado.p, estado.opc);
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), o.stock || 1));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
      return;
    }
    if (e.target.closest('[data-qv-usar-talle]')) {
      const t = talleDePerimetro(estado.perimetro);
      const o = estado.p.opc.find(x => x.talle === t);
      if (o && o.stock > 0) { estado.guia = false; elegir(o.id); showToast(`Elegiste el talle ${t}.`); }
      else showToast(`Talle ${t}: no lo tenemos en stock. Escribinos y lo vemos.`);
      return;
    }
    if (e.target.closest('[data-qv-add]')) { if (agregar()) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregar()) { cerrar(); abrirCarrito(); } }
  });
  const inicial = new URLSearchParams(location.search).get('producto');
  if (inicial && getProducto(inicial)) abrir(inicial);
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      e.preventDefault();
      abrirVista(ver.dataset.ver);
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('output');
      out.textContent = Math.max(1, Math.min(99, Number(out.textContent) + Number(paso.dataset.paso)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const p = getProducto(add.dataset.add);
    if (!p) return;
    const qty = Number(add.closest('.prod')?.querySelector('[data-stepper] output')?.textContent) || 1;
    if (necesitaOpciones(p)) { abrirVista(p.id, { qty, foco: 'opciones' }); return; }
    Cart.add(p, qty, { opc: p.opc[0].id });
    showToast(`${p.nombre} al carrito`);
    add.classList.remove('ok'); void add.offsetWidth; add.classList.add('ok');
  });
}

function initVitrina() {
  const sec = document.querySelector('[data-vitrina]');
  if (!sec) return;
  const tabs = $$('[role="tab"]', sec);
  const grid = $('[data-vitrina-grid]', sec);
  const link = $('[data-vitrina-link]', sec);
  const ind = $('.tabs-ind', sec);
  const bar = $('.tabs', sec);
  const filtroDe = t => (t === 'relojes' ? { cat: 'relojes' } : { mat: t });
  const nombreDe = t => (t === 'relojes' ? 'Relojería' : matDe(t)?.nombre);
  const mover = tab => {
    if (!ind || !tab) return;
    const margen = Math.min(16, tab.offsetWidth / 6);
    ind.style.setProperty('--x', `${tab.offsetLeft + margen}px`);
    ind.style.setProperty('--y', `${tab.offsetTop + tab.offsetHeight - 2}px`);
    ind.style.setProperty('--s', String(Math.max(tab.offsetWidth - margen * 2, 0) / 100));
  };
  const elegir = (tab, foco = false) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (foco) tab.focus();
    mover(tab);
    const t = tab.dataset.tab;
    const { items } = Tienda.consultar({ filtros: filtroDe(t), orden: 'destacados', limite: 4 });
    grid.innerHTML = items.map(cardVitrina).join('');
    grid.setAttribute('aria-labelledby', tab.id);
    const q = t === 'relojes' ? 'cat=relojes' : `mat=${t}`;
    link.href = `${paginaCatalogo()}?${q}`;
    link.querySelector('span').textContent = `Ver todo en ${nombreDe(t)}`;
    revelarNuevos(grid);
    refrescarScroll();
  };
  tabs.forEach(tab => tab.addEventListener('click', () => elegir(tab)));
  bar.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') n = tabs[0];
    if (e.key === 'End') n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); elegir(n, true); }
  });
  window.addEventListener('resize', () => mover(tabs.find(t => t.getAttribute('aria-selected') === 'true')), { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(() => mover(tabs.find(t => t.getAttribute('aria-selected') === 'true')));
  elegir(tabs[0]);
}

function initMosaico() {
  const grid = document.querySelector('[data-mosaico]');
  if (!grid) return;
  const ids = grid.dataset.mosaico.split(',').map(s => s.trim()).filter(Boolean);
  const { items } = Tienda.consultar({ filtros: { ids }, orden: 'destacados', limite: 8 });
  const orden = ids.map(id => items.find(p => p.id === id)).filter(Boolean);
  grid.innerHTML = orden.map((p, i) => mosHTML(p, i === 0)).join('');
}

function initTalle() {
  const sec = document.querySelector('[data-talle]');
  if (!sec) return;
  const botones = $$('[data-metodo]', sec);
  const rango = $('#talle-rango', sec);
  const num = $('#talle-num', sec);
  const etiqueta = $('[data-medida-label]', sec);
  const ayuda = $('[data-medida-ayuda]', sec);
  const salida = $('[data-talle-num]', sec);
  const dato = $('[data-talle-dato]', sec);
  const aros = $$('[data-talle-aro]', sec);
  const verAnillos = $('[data-talle-ver]', sec);
  const consultar = $('[data-talle-wsp]', sec);
  const METODOS = {
    diametro: { min: 14, max: 23, paso: 0.1, valor: 17.2, label: 'Diámetro interior del anillo', ayuda: 'Apoyá un anillo que te quede bien sobre una regla y medí el hueco de lado a lado, por dentro.' },
    perimetro: { min: 44, max: 72, paso: 0.5, valor: 54, label: 'Perímetro del dedo', ayuda: 'Rodeá la base del dedo con un hilo, marcá dónde se junta y medí ese largo con una regla.' },
  };
  let metodo = 'diametro';
  const fmt = n => n.toLocaleString('es-AR', { maximumFractionDigits: 1 });
  const pintar = v => {
    const d = metodo === 'diametro' ? v : v / Math.PI;
    const per = metodo === 'diametro' ? v * Math.PI : v;
    const t = talleDePerimetro(per);
    salida.textContent = t;
    dato.textContent = `Diámetro ${fmt(d)} mm · perímetro ${fmt(per)} mm`;
    const r = 58 + (Math.min(Math.max(d, 14), 23) - 14) * 3.6;
    aros.forEach(c => { const v = r + Number(c.dataset.talleAro || 0); c.setAttribute('r', v.toFixed(1)); c.style.r = `${v.toFixed(1)}px`; });
    const hay = Tienda.contar({ cat: 'anillos', talle: t });
    verAnillos.href = `${paginaCatalogo()}?cat=anillos&talle=${t}`;
    verAnillos.querySelector('span').textContent = hay ? `Ver anillos en talle ${t}` : 'Ver todos los anillos';
    if (!hay) verAnillos.href = `${paginaCatalogo()}?cat=anillos`;
    consultar.href = waLink(`Hola! Medí mi dedo: ${metodo === 'diametro' ? `diámetro ${fmt(d)} mm` : `perímetro ${fmt(per)} mm`} (talle ${t} aprox.). ¿Me ayudan a confirmarlo?`);
  };
  const setMetodo = m => {
    metodo = m;
    const c = METODOS[m];
    botones.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.metodo === m)));
    [rango, num].forEach(el => { el.min = c.min; el.max = c.max; el.step = c.paso; el.value = c.valor; });
    etiqueta.textContent = c.label;
    ayuda.textContent = c.ayuda;
    pintar(c.valor);
  };
  botones.forEach(b => b.addEventListener('click', () => setMetodo(b.dataset.metodo)));
  rango.addEventListener('input', () => { num.value = rango.value; pintar(Number(rango.value)); });
  num.addEventListener('input', () => {
    const v = parseFloat(String(num.value).replace(',', '.'));
    const c = METODOS[metodo];
    if (!Number.isFinite(v) || v < c.min || v > c.max) return;
    rango.value = v;
    pintar(v);
  });
  setMetodo('diametro');
}

function initCatalogo() {
  const app = document.querySelector('[data-catalogo-app]');
  if (!app) return;
  const grid = $('[data-resultados]', app);
  const verMas = $('[data-ver-mas]', app);
  const contador = $('[data-contador]', app);
  const vacio = $('[data-vacio]', app);
  const chipsActivos = $('[data-activos]', app);
  const buscador = $('#cat-q', app);
  const orden = $('#cat-orden', app);
  const panel = $('[data-filtros]', app);
  const abrirFiltros = $('[data-abrir-filtros]', app);
  const cuentaRes = $('[data-cuenta-res]', app);
  const selTalle = $('#f-talle', app);
  const miga = document.querySelector('[data-miga]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="mat"]', panel).innerHTML = MATERIALES.map(m => `<label class="chk"><input type="checkbox" data-f="mat" value="${m.id}"><span>${esc(m.nombre)}</span><small>${Tienda.contar({ mat: m.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  selTalle.innerHTML = ['<option value="">Todos los talles</option>', ...TALLES_FILTRO.map(t => `<option value="${t}">Talle ${t}</option>`)].join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const talleUrl = Number(params.get('talle'));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    mat: validos(params.get('mat'), MATERIALES.map(m => m.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    talle: Number.isInteger(talleUrl) && talleUrl >= TALLE_MIN && talleUrl <= TALLE_MAX ? talleUrl : 0,
    nuevo: params.get('nuevo') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  if (estado.talle && !TALLES_FILTRO.includes(estado.talle)) selTalle.insertAdjacentHTML('beforeend', `<option value="${estado.talle}">Talle ${estado.talle}</option>`);
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, mat: estado.mat, precio: estado.precio, talle: estado.talle || null, nuevo: estado.nuevo });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    selTalle.value = estado.talle ? String(estado.talle) : '';
    $$('input[data-f="cat"]', panel).forEach(i => { i.checked = estado.cat.includes(i.value); });
    $$('input[data-f="mat"]', panel).forEach(i => { i.checked = estado.mat.includes(i.value); });
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    $('input[data-f="nuevo"]', panel).checked = estado.nuevo;
    if (miga) {
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      const m = estado.mat.length === 1 ? matDe(estado.mat[0]) : null;
      const actual = [c?.nombre, m?.nombre].filter(Boolean).join(' · ');
      miga.innerHTML = actual ? `<a href="${paginaCatalogo()}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(actual)}</span>` : '<span aria-current="page">Catálogo</span>';
    }
    $$('[data-menu-cats] a').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && cat === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('[data-menu-mats] a').forEach(a => {
      const mat = new URL(a.href).searchParams.get('mat');
      if (estado.mat.length === 1 && mat === estado.mat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'mat', 'precio', 'talle', 'nuevo', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.mat.length) u.searchParams.set('mat', estado.mat.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.talle) u.searchParams.set('talle', String(estado.talle));
    if (estado.nuevo) u.searchParams.set('nuevo', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.mat.map(m => ['mat', m, matDe(m).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
      ...(estado.talle ? [['talle', '', `Talle ${estado.talle}`]] : []),
      ...(estado.nuevo ? [['nuevo', '', 'Recién llegadas']] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(cardHTML).join(''));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'pieza' : 'piezas'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay piezas con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], mat: [], precio: '', talle: 0, nuevo: false }); aplicar(); };

  panel.addEventListener('change', e => {
    if (e.target === selTalle) { estado.talle = Number(selTalle.value) || 0; aplicar(); return; }
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'mat') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'precio') estado.precio = e.target.value;
    if (f === 'nuevo') estado.nuevo = e.target.checked;
    aplicar();
  });
  orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
  let t = 0;
  buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  $('[data-form-buscar]', app).addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas.addEventListener('click', () => pintar(true));
  app.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const k = quitar.dataset.quitar;
      if (k === 'q') estado.q = '';
      else if (k === 'cat' || k === 'mat') estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      else if (k === 'precio') estado.precio = '';
      else if (k === 'talle') estado.talle = 0;
      else if (k === 'nuevo') estado.nuevo = false;
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  const cerrarPanel = () => { panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false'); bloquear(false); abrirFiltros.focus(); };
  abrirFiltros.addEventListener('click', () => {
    panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true'); bloquear(true);
    panel.querySelector('input')?.focus();
  });
  $$('[data-cerrar-filtros]', panel).forEach(b => b.addEventListener('click', cerrarPanel));
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches && panel.classList.contains('open')) { panel.classList.remove('open'); bloquear(false); } });

  sincronizarUI();
  pintar();
  if (location.hash === '#buscar') buscador.focus();
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const destello = hero.querySelector('.destello');
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.08, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.trip-foto'), { y: 48, opacity: 0, duration: 1.3, stagger: 0.12, clearProps: 'transform,opacity' }, 0.35)
    .from(hero.querySelectorAll('.trip-cap'), { scale: 0.92, opacity: 0, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, 0.9)
    .add(() => destello?.classList.add('pasa'), 0.6);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto) gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function iniciar() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  initAntiCopia();
  initModelBarScroll();
  initCuentas();
  initHorario();
  initMenuCategorias();
  initNav();
  initVitrina();
  initMosaico();
  initCatalogo();
  initTalle();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initFloats();
  initHeroMotion();
  initReveals();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
}
