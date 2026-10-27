'use strict';

const WA = '5491133482078';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const ZONA = { lat: -34.6509, lng: -58.7896 };

const CATEGORIAS = [
  { id: 'aros', nombre: 'Aros', img: 'images/p-argollas-gruesas.webp' },
  { id: 'collares', nombre: 'Collares', img: 'images/p-collar-dije-circular.webp' },
  { id: 'pulseras', nombre: 'Pulseras', img: 'images/p-pulsera-eslabones.webp' },
  { id: 'anillos', nombre: 'Anillos', img: 'images/p-anillo-ancho.webp' },
];

const MOMENTOS = [
  { id: 'diario', nombre: 'Para todos los días', corto: 'Todos los días' },
  { id: 'especial', nombre: 'Para ocasiones especiales', corto: 'Ocasiones especiales' },
];

const PRECIOS = {
  'hasta-25': [0, 25000, 'Hasta $25.000'],
  '25-35': [25000, 35000, '$25.000 a $35.000'],
  'mas-35': [35000, Infinity, 'Más de $35.000'],
};

const ORDENES = {
  destacados: 'Destacados',
  nuevos: 'Lo nuevo',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const talles = (stock, precio) => Object.entries(stock).map(([t, s]) => ({ id: `t${t}`, nombre: t, precio, stock: s }));
const largos = (lista, precio) => lista.map(([cm, stock]) => ({ id: `${cm}cm`, nombre: `${cm} cm`, precio, stock }));
const unico = (precio, stock) => [{ id: 'unico', nombre: 'Única', precio, stock }];
const fotos = (slug, n = 2) => Array.from({ length: n }, (_, i) => `images/p-${slug}${i ? `-${i + 1}` : ''}.webp`);

const PRODUCTOS = [
  {
    id: 'collar-dije-circular', nombre: 'Collar con dije circular', cat: 'collares', momentos: ['diario'], fotos: fotos('collar-dije-circular', 3),
    desc: 'Cadena fina con una medalla lisa y redonda. Queda sola o combinada con otras cadenas, y va con todo: remera, camisa o vestido.',
    opcTipo: 'largo', opc: largos([[40, 6], [45, 8]], 32900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Dije', 'Medalla lisa de 12 mm'], ['Cierre', 'Mosquetón']], destacado: 1,
  },
  {
    id: 'argollas-gruesas', nombre: 'Argollas gruesas', cat: 'aros', momentos: ['diario', 'especial'], fotos: fotos('argollas-gruesas'),
    desc: 'Argollas anchas y abombadas que se cierran a presión. Se notan sin ser grandes: suman a un look simple y acompañan uno de noche.',
    opcTipo: null, opc: unico(24900, 9),
    ficha: [['Terminación', 'Enchapado en oro'], ['Diámetro', '15 mm'], ['Cierre', 'A presión']], destacado: 2,
  },
  {
    id: 'pulsera-eslabones', nombre: 'Pulsera de eslabones', cat: 'pulseras', momentos: ['diario'], fotos: fotos('pulsera-eslabones'),
    desc: 'Pulsera de eslabones ovalados con cierre de mosquetón. Liviana para usar todos los días y fácil de combinar con un reloj o una esclava.',
    opcTipo: null, opc: unico(29900, 7),
    ficha: [['Terminación', 'Enchapado en oro'], ['Largo', '18 cm + 3 cm de extensión'], ['Cierre', 'Mosquetón']], destacado: 3,
  },
  {
    id: 'anillo-ancho', nombre: 'Anillo ancho', cat: 'anillos', momentos: ['diario', 'especial'], fotos: fotos('anillo-ancho'),
    desc: 'Anillo de caña ancha y redondeada, pulido a espejo. Una sola pieza que se nota: para usarlo solo o como protagonista.',
    opcTipo: 'talle', opc: talles({ 12: 2, 14: 4, 16: 5, 18: 3, 20: 2, 22: 0 }, 21900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Ancho', '8 mm'], ['Acabado', 'Pulido']], destacado: 4,
  },
  {
    id: 'aros-disco', nombre: 'Aros botón de disco', cat: 'aros', momentos: ['diario'], fotos: fotos('aros-disco'),
    desc: 'Aros chicos con un disco liso y cierre de mariposa. Te los ponés a la mañana y te olvidás de que los tenés puestos.',
    opcTipo: null, opc: unico(16900, 14),
    ficha: [['Terminación', 'Enchapado en oro'], ['Disco', '10 mm'], ['Cierre', 'Mariposa']], destacado: 5,
  },
  {
    id: 'aros-gota-cubic', nombre: 'Aros colgantes con gota', cat: 'aros', momentos: ['especial'], fotos: fotos('aros-gota-cubic'),
    desc: 'Aros con un punto de luz arriba y una gota de cubic que cuelga de una cadenita. Para un casamiento, un cumpleaños o una noche especial.',
    opcTipo: null, opc: unico(26900, 5),
    ficha: [['Terminación', 'Enchapado en oro'], ['Piedras', 'Cubic blanco'], ['Largo', '3,5 cm']], destacado: 6,
  },
  {
    id: 'collar-eslabones-alargados', nombre: 'Collar de eslabones alargados', cat: 'collares', momentos: ['diario', 'especial'], fotos: fotos('collar-eslabones-alargados'),
    desc: 'Cadena de eslabones rectangulares, con presencia pero liviana. Se usa sola o con un dije enganchado en cualquier eslabón.',
    opcTipo: 'largo', opc: largos([[40, 4], [45, 5]], 36900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Eslabón', '4 x 12 mm'], ['Cierre', 'Mosquetón']], destacado: 7,
  },
  {
    id: 'esclava-abierta', nombre: 'Esclava abierta', cat: 'pulseras', momentos: ['diario'], fotos: fotos('esclava-abierta'),
    desc: 'Esclava rígida de caña fina con los extremos abiertos: se ajusta apenas a la muñeca y se pone y se saca sin cierre.',
    opcTipo: null, opc: unico(27900, 6),
    ficha: [['Terminación', 'Enchapado en oro'], ['Diámetro interior', '6 cm'], ['Caña', '3 mm']], destacado: 8,
  },
  {
    id: 'collar-corazon-abierto', nombre: 'Collar con corazón calado', cat: 'collares', momentos: ['diario'], fotos: fotos('collar-corazon-abierto'),
    desc: 'Cadena fina con un dije de corazón calado que cuelga de una argollita. Un clásico para regalar o para regalarte.',
    opcTipo: 'largo', opc: largos([[40, 5], [45, 4]], 28900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Dije', 'Corazón de 15 mm'], ['Cierre', 'Mosquetón']], destacado: 9,
  },
  {
    id: 'conjunto-corazones', nombre: 'Conjunto corazones: collar doble y aros', cat: 'collares', momentos: ['especial'], fotos: fotos('conjunto-corazones'),
    desc: 'Collar de dos vueltas con un corazón liso y otro grabado, y aros de corazón que hacen juego. Llega listo para regalar.',
    opcTipo: null, opc: unico(44900, 3),
    ficha: [['Terminación', 'Enchapado en oro'], ['Incluye', 'Collar doble y par de aros'], ['Cierre', 'Mosquetón y mariposa']], destacado: 10,
  },
  {
    id: 'collar-corazon-nacar', nombre: 'Collar corazón de nácar', cat: 'collares', momentos: ['especial'], fotos: fotos('collar-corazon-nacar'),
    desc: 'Dije de corazón con centro de nácar y borde de cubic, en una cadena fina con perlitas. Delicado y con brillo para una fecha especial.',
    opcTipo: 'largo', opc: largos([[40, 3], [45, 3]], 34900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Dije', 'Nácar con borde de cubic'], ['Cierre', 'Mosquetón']], destacado: 11, nuevo: true,
  },
  {
    id: 'aros-medalla-perla', nombre: 'Aros medalla con perla', cat: 'aros', momentos: ['especial'], fotos: fotos('aros-medalla-perla'),
    desc: 'Medallas labradas con una perla barroca arriba. Tienen aire antiguo y quedan muy bien con el pelo recogido.',
    opcTipo: null, opc: unico(25900, 4),
    ficha: [['Terminación', 'Enchapado en oro'], ['Perla', 'Barroca de agua dulce'], ['Largo', '3 cm']], destacado: 12,
  },
  {
    id: 'aros-corazon-perla', nombre: 'Aros corazón con perla', cat: 'aros', momentos: ['especial'], fotos: fotos('aros-corazon-perla'),
    desc: 'Aros chicos de corazón con una perla en el centro y un punto de luz al costado. Para regalar en un cumpleaños o un aniversario.',
    opcTipo: null, opc: unico(22900, 6),
    ficha: [['Terminación', 'Enchapado en oro rosa'], ['Medida', '9 mm'], ['Cierre', 'Mariposa']], destacado: 13, nuevo: true,
  },
  {
    id: 'anillo-sello', nombre: 'Anillo sello', cat: 'anillos', momentos: ['diario'], fotos: fotos('anillo-sello'),
    desc: 'Anillo sello de frente ovalado con textura labrada. Se usa en el meñique o en el índice, solo o con otros anillos finos.',
    opcTipo: 'talle', opc: talles({ 12: 1, 14: 3, 16: 3, 18: 2, 20: 2, 22: 1 }, 23900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Frente', 'Óvalo de 12 x 10 mm'], ['Acabado', 'Labrado']], destacado: 14,
  },
  {
    id: 'anillos-cintillo-cubic', nombre: 'Dúo de anillos con cubic', cat: 'anillos', momentos: ['especial'], fotos: fotos('anillos-cintillo-cubic'),
    desc: 'Un cintillo de cubic y un solitario fino que se usan juntos o por separado. Pensado para un compromiso o una fecha que se recuerda.',
    opcTipo: 'talle', opc: talles({ 12: 1, 14: 2, 16: 2, 18: 1, 20: 1 }, 31900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Piedras', 'Cubic blanco'], ['Incluye', 'Dos anillos']], destacado: 15,
  },
  {
    id: 'pulsera-candado-corazon', nombre: 'Pulsera candado y corazón', cat: 'pulseras', momentos: ['diario'], fotos: fotos('pulsera-candado-corazon'),
    desc: 'Cadena de eslabones con un candado rectangular y un corazón colgante en la punta. Se nota sin ser pesada.',
    opcTipo: null, opc: unico(30900, 5),
    ficha: [['Terminación', 'Enchapado en oro'], ['Largo', '17 cm + 4 cm de extensión'], ['Dijes', 'Candado y corazón']], destacado: 16,
  },
  {
    id: 'collar-cruz', nombre: 'Collar con cruz fina', cat: 'collares', momentos: ['diario'], fotos: fotos('collar-cruz'),
    desc: 'Cadena fina con una cruz alargada y lisa. Discreta para todos los días, y un regalo clásico para una comunión o un bautismo.',
    opcTipo: 'largo', opc: largos([[40, 4], [45, 6]], 27900),
    ficha: [['Terminación', 'Enchapado en oro'], ['Cruz', '3,5 cm'], ['Cierre', 'Mosquetón']], destacado: 17,
  },
  {
    id: 'aros-circulo-nacar', nombre: 'Aros círculo de nácar', cat: 'aros', momentos: ['especial'], fotos: fotos('aros-circulo-nacar'),
    desc: 'Un botón dorado y un círculo de nácar que cuelga debajo. Livianos aunque se vean grandes, con un brillo suave.',
    opcTipo: null, opc: unico(23900, 4),
    ficha: [['Terminación', 'Enchapado en oro'], ['Nácar', 'Círculo de 3 cm'], ['Cierre', 'Mariposa']],
  },
  {
    id: 'pulsera-barbada-dijes', nombre: 'Pulsera barbada con dijes', cat: 'pulseras', momentos: ['especial'], fotos: fotos('pulsera-barbada-dijes'),
    desc: 'Pulsera de cadena barbada con dijes de piedras de colores y medallas. Para usarla sola, como la pieza que se lleva las miradas.',
    opcTipo: null, opc: unico(38900, 2),
    ficha: [['Terminación', 'Enchapado en oro'], ['Largo', '19 cm'], ['Dijes', 'Piedras y medallas']], nuevo: true,
  },
  {
    id: 'argollas-torneadas', nombre: 'Argollas torneadas', cat: 'aros', momentos: ['diario'], fotos: fotos('argollas-torneadas'),
    desc: 'Argollas medianas con la caña torneada, que juega con la luz cuando te movés. Combinan con otras argollitas en el mismo oído.',
    opcTipo: null, opc: unico(26900, 7),
    ficha: [['Terminación', 'Enchapado en oro'], ['Diámetro', '25 mm'], ['Cierre', 'Bisagra']], nuevo: true,
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const opcDe = (p, opcId) => p.opc.find(x => x.id === opcId) || p.opc[0];
const precioDesde = p => Math.min(...p.opc.map(x => x.precio));
const stockTotal = p => p.opc.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const momDe = id => MOMENTOS.find(m => m.id === id);
const necesitaOpciones = p => p.opc.length > 1;
const obligatoria = p => p.opcTipo === 'talle';
const textoBoton = p => (p.opcTipo === 'talle' ? 'Elegir talle' : p.opcTipo === 'largo' ? 'Elegir largo' : 'Agregar');
const etiquetaOpc = p => (p.opcTipo === 'talle' ? 'Talle' : p.opcTipo === 'largo' ? 'Largo' : 'Presentación');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), momento = lista(f.momento), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (momento.length && !momento.some(m => (p.momentos || []).includes(m))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v >= max) return false;
    }
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
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, 'joya joyas enchapado oro dorado', p.desc,
      ...(p.momentos || []).map(m => momDe(m)?.nombre), ...p.opc.map(x => x.nombre), ...(p.ficha || []).map(f => f[1]), p.nuevo ? 'nuevo novedad' : '',
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
  KEY: 'mluxury_cart',
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

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const urlProducto = id => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  bolsa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
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

function sellosHTML(p) {
  if (p.nuevo) return '<span class="badge badge--nuevo">Nuevo</span>';
  if (stockTotal(p) > 0 && stockTotal(p) <= 3) return '<span class="badge badge--ultimas">Últimas unidades</span>';
  return '';
}

function precioHTML(p) {
  const desde = new Set(p.opc.map(x => x.precio)).size > 1;
  return `<p class="prod-precio">${desde ? '<span class="prod-desde">desde</span> ' : ''}<strong>${formatearPrecio(precioDesde(p))}</strong></p>`;
}

const metaDe = p => `${esc(catDe(p.cat)?.nombre || '')} · Enchapado en oro`;

function fotosHTML(p, clase = 'prod-foto') {
  return p.fotos.map((src, i) => `<a class="${clase}" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}"${i ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Ver ${esc(p.nombre)}"`}><img src="${esc(src)}" alt="${i ? '' : esc(p.nombre)}" width="1000" height="1000" decoding="async"${i ? ' fetchpriority="low"' : ''}></a>`).join('');
}

function puntosHTML(p) {
  return `<span class="fotos-puntos" aria-hidden="true">${p.fotos.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</span><span class="sr-only">${p.fotos.length} fotos</span>`;
}

function accionesHTML(p) {
  if (necesitaOpciones(p)) return `<button type="button" class="prod-add prod-add--opciones" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${textoBoton(p)}</button>`;
  return `<div class="stepper" data-stepper>
      <button type="button" data-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
      <output aria-label="Cantidad">1</output>
      <button type="button" data-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
    </div>
    <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICONOS.bolsa}<span class="prod-add-txt">Agregar</span></button>`;
}

function cardHTML(p) {
  return `<article class="prod" data-id="${esc(p.id)}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="prod-media">
      <div class="prod-fotos" data-fotos>${fotosHTML(p)}</div>
      ${puntosHTML(p)}
      ${sellosHTML(p) ? `<div class="prod-sellos">${sellosHTML(p)}</div>` : ''}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" tabindex="-1">${esc(p.nombre)}</a></h3>
      ${precioHTML(p)}
      <div class="prod-actions">${accionesHTML(p)}</div>
    </div>
  </article>`;
}

function mosHTML(p, grande) {
  return `<article class="mos${grande ? ' mos--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="mos-media">
      <div class="prod-fotos" data-fotos>${fotosHTML(p, 'prod-foto mos-foto')}</div>
      ${puntosHTML(p)}
      ${sellosHTML(p) ? `<div class="prod-sellos">${sellosHTML(p)}</div>` : ''}
    </div>
    <div class="mos-body">
      <div class="mos-txt">
        <h3 class="mos-nombre">${esc(p.nombre)}</h3>
        <p class="mos-precio">${new Set(p.opc.map(x => x.precio)).size > 1 ? 'desde ' : ''}${formatearPrecio(precioDesde(p))}</p>
      </div>
      <button type="button" class="mos-add" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${ICONOS.bolsa}</button>
    </div>
  </article>`;
}

function miniHTML(p) {
  return `<article class="mini" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <div class="mini-media">
      <div class="prod-fotos" data-fotos>${fotosHTML(p, 'prod-foto mini-foto')}</div>
      ${puntosHTML(p)}
    </div>
    <h3 class="mini-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="mini-meta">Enchapado en oro · ${formatearPrecio(precioDesde(p))}</p>
    <a class="btn btn--suave btn--chico" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}">Ver producto ${ICONOS.flecha}</a>
  </article>`;
}

function prepararFotos(cont = document) {
  const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  $$('[data-fotos]:not([data-listo])', cont).forEach(track => {
    track.dataset.listo = '1';
    const puntos = track.parentElement.querySelectorAll('.fotos-puntos i');
    if (puntos.length < 2) return;
    let frame = 0;
    track.addEventListener('scroll', () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const i = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
        puntos.forEach((d, n) => d.classList.toggle('on', n === i));
      });
    }, { passive: true });
    const ir = i => track.scrollTo({ left: track.clientWidth * i, behavior: reduceMotion ? 'auto' : 'smooth' });
    const zona = track.closest('.prod, .mos, .mini') || track;
    zona.addEventListener('mouseenter', () => { if (hover.matches) ir(1); });
    zona.addEventListener('mouseleave', () => { if (hover.matches) ir(0); });
  });
}

function pintarProductos(cont, html) {
  cont.innerHTML = html;
  prepararFotos(cont);
  revelarNuevos(cont);
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
  const momActual = params.get('momento');
  $('[data-menu-cats]', cont).innerHTML = CATEGORIAS.map(c => `<li><a href="${paginaCatalogo()}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="1000" height="1000"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} piezas</small></span></a></li>`).join('');
  $('[data-menu-momentos]', cont).innerHTML = MOMENTOS.map(m => `<li><a href="${paginaCatalogo()}?momento=${m.id}"${momActual === m.id ? ' aria-current="page"' : ''}><span><strong>${esc(m.nombre)}</strong><small>${Tienda.contar({ momento: m.id })} piezas</small></span></a></li>`).join('');
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
  $$('[data-cuenta-cat]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.cuentaCat });
    el.textContent = el.dataset.formato === 'num' ? String(n).padStart(2, '0') : `${n} piezas`;
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

function conectarGaleria(root) {
  const track = $('[data-gal-track]', root);
  if (!track || track.dataset.listo) return;
  track.dataset.listo = '1';
  const pintarActivo = i => {
    $$('[data-gal-thumb]', root).forEach(b => {
      const on = Number(b.dataset.galThumb) === i;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const cuenta = $('[data-gal-cuenta]', root);
    if (cuenta) cuenta.textContent = `${i + 1} / ${track.children.length}`;
  };
  let frame = 0;
  track.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      pintarActivo(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
    });
  }, { passive: true });
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-gal-thumb]');
    if (!b) return;
    const i = Number(b.dataset.galThumb);
    track.scrollTo({ left: track.clientWidth * i, behavior: reduceMotion ? 'auto' : 'smooth' });
    pintarActivo(i);
  });
}

function galeriaHTML(p) {
  return `<div class="gal-track" data-gal-track>${p.fotos.map((src, i) => `<figure class="gal-foto"><img src="${esc(src)}" alt="${esc(p.nombre)}, foto ${i + 1} de ${p.fotos.length}" width="1000" height="1000"></figure>`).join('')}</div>
    <span class="gal-cuenta" data-gal-cuenta>1 / ${p.fotos.length}</span>
    <div class="gal-thumbs">${p.fotos.map((src, i) => `<button type="button" class="gal-thumb${i ? '' : ' on'}" data-gal-thumb="${i}" aria-pressed="${i ? 'false' : 'true'}" aria-label="Ver foto ${i + 1}"><img src="${esc(src)}" alt="" width="1000" height="1000"></button>`).join('')}</div>`;
}

function opcionesHTML(p, estado, nombre) {
  if (!necesitaOpciones(p)) return '';
  const o = opcDe(p, estado.opc);
  const elegido = estado.elegido;
  return `<fieldset class="opciones${estado.falta ? ' opciones--falta' : ''}"><legend>${etiquetaOpc(p)} ${elegido ? '' : '<span class="opciones-aviso">· elegí tu talle</span>'}</legend><div class="chips">${p.opc.map(x => `<label class="chip"><input type="radio" name="${nombre}" value="${esc(x.id)}"${elegido && x.id === o.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.nombre)}</span></label>`).join('')}</div></fieldset>`;
}

function estadoInicial(p, qty = 1) {
  const o = p.opc.find(x => x.stock > 0) || p.opc[0];
  return { p, opc: o.id, elegido: !obligatoria(p), qty: Math.max(1, Math.min(qty, o.stock || 1)), falta: false };
}

function agregarConEstado(estado, repintar, cont) {
  const p = estado.p;
  if (obligatoria(p) && !estado.elegido) {
    estado.falta = true;
    repintar();
    cont.querySelector('.opciones input:not(:disabled)')?.focus();
    showToast('Elegí tu talle para agregarlo.');
    return false;
  }
  const o = opcDe(p, estado.opc);
  Cart.add(p, estado.qty, { opc: o.id });
  showToast(`${p.nombre}${p.opcTipo ? ` · ${etiquetaOpc(p).toLowerCase()} ${o.nombre}` : ''} al carrito`);
  return true;
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu pedido" hidden>
      <header class="drawer-head">
        <h2>Tu pedido <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <p class="drawer-aviso">${ICONOS.tarjeta}<span>Pagás con Mercado Pago o por transferencia</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--wsp btn--block" data-pedido-wsp href="${waLink('Hola! Quiero hacer un pedido desde la web de MLuxury.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
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
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.bolsa}<p><strong>Todavía no elegiste ninguna joya.</strong> Aros, collares, pulseras y anillos te esperan en la colección.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Ver la colección</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.fotos[0])}" alt="" width="1000" height="1000">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">Enchapado en oro${l.producto.opcTipo ? ` · ${esc(etiquetaOpc(l.producto))} ${esc(l.opcion.nombre)}` : ''}</p>
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
    const texto = ['Hola! Quiero hacer este pedido en MLuxury:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre}${l.producto.opcTipo ? ` (${etiquetaOpc(l.producto).toLowerCase()} ${l.opcion.nombre})` : ''} ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
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
        <div class="qv-media galeria" data-qv-media></div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const media = $('[data-qv-media]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const o = opcDe(p, estado.opc);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { destacado: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const sinStock = estado.elegido && !(o.stock > 0);
    info.innerHTML = `
      <p class="qv-meta">${metaDe(p)}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-momentos">${(p.momentos || []).map(m => `<span>${esc(momDe(m)?.nombre)}</span>`).join('')}</p>
      <p class="qv-precio"><strong>${formatearPrecio(o.precio)}</strong></p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${opcionesHTML(p, estado, 'qv-opc')}
      ${p.opcTipo === 'talle' ? `<a class="qv-ayuda" href="${esc(waLink(`Hola! Quiero el ${p.nombre} y no sé mi talle. ¿Me ayudan?`))}" target="_blank" rel="noopener">¿No sabés tu talle? Te ayudamos por WhatsApp</a>` : ''}
      <p class="qv-stock">${sinStock ? 'Sin stock en esta opción.' : estado.elegido && o.stock <= 3 ? `Quedan ${o.stock}${p.opcTipo === 'talle' ? ' en este talle' : ''}.` : 'En stock.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar por esta joya</span></a>
      <dl class="qv-ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Tipo</dt><dd>${esc(catDe(p.cat)?.nombre)}</dd></div></dl>
      <p class="qv-legal">Fotos ilustrativas. Precio y stock de muestra.</p>
      ${rel.length ? `<div class="qv-rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.fotos[0])}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre,
      image: p.fotos.map(f => new URL(f, location.href).href), brand: { '@type': 'Brand', name: 'MLuxury' },
      offers: p.opc.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: x.precio, availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    estado = estadoInicial(p, qty);
    if (bd.hidden) opener = document.activeElement;
    media.innerHTML = galeriaHTML(p);
    conectarGaleria(media);
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
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name !== 'qv-opc') return;
    estado.opc = e.target.value;
    estado.elegido = true;
    estado.falta = false;
    estado.qty = Math.min(estado.qty, opcDe(estado.p, estado.opc).stock || 1);
    pintar();
    info.querySelector(`input[name="qv-opc"][value="${window.CSS.escape(estado.opc)}"]`)?.focus();
  });
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const o = opcDe(estado.p, estado.opc);
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), o.stock || 1));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]')) { if (agregarConEstado(estado, pintar, info)) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregarConEstado(estado, pintar, info)) { cerrar(); abrirCarrito(); } }
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

function initSpot() {
  const sec = document.querySelector('[data-spot]');
  if (!sec) return;
  const p = getProducto(sec.dataset.spot);
  if (!p) return;
  conectarGaleria($('.galeria', sec));
  const compra = $('[data-spot-compra]', sec);
  const estado = estadoInicial(p);
  const pintar = () => {
    const o = opcDe(p, estado.opc);
    compra.innerHTML = `
      <p class="spot-precio">${formatearPrecio(o.precio)}</p>
      ${opcionesHTML(p, estado, 'spot-opc')}
      <div class="spot-acciones">
        <button type="button" class="btn btn--cta" data-spot-add>Agregar al carrito ${ICONOS.bolsa}</button>
        <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por el ${p.nombre}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar</span></a>
      </div>`;
  };
  pintar();
  compra.addEventListener('change', e => {
    if (e.target.name !== 'spot-opc') return;
    estado.opc = e.target.value;
    estado.elegido = true;
    estado.falta = false;
    pintar();
    compra.querySelector(`input[name="spot-opc"][value="${window.CSS.escape(estado.opc)}"]`)?.focus();
  });
  compra.addEventListener('click', e => {
    if (!e.target.closest('[data-spot-add]')) return;
    if (agregarConEstado(estado, pintar, compra)) {
      const b = $('[data-spot-add]', compra);
      b.classList.remove('ok'); void b.offsetWidth; b.classList.add('ok');
    }
  });
  const otros = $('[data-spot-otros]', sec);
  if (otros) {
    const ids = otros.dataset.spotOtros.split(',').map(s => s.trim()).filter(Boolean);
    const { items } = Tienda.consultar({ filtros: { ids }, limite: ids.length });
    pintarProductos(otros, ids.map(id => items.find(x => x.id === id)).filter(Boolean).map(miniHTML).join(''));
  }
}

function initMomentos() {
  const sec = document.querySelector('[data-momentos]');
  if (!sec) return;
  const tabs = $$('[role="tab"]', sec);
  const grid = $('[data-momentos-grid]', sec);
  const link = $('[data-momentos-link]', sec);
  const limite = Number(grid.dataset.limite) || 8;
  const estilo = grid.dataset.estilo || 'grid';
  const excluir = (grid.dataset.excluir || '').split(',').map(s => s.trim()).filter(Boolean);
  const elegir = (tab, foco = false) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (foco) tab.focus();
    const m = tab.dataset.momento;
    const { items } = Tienda.consultar({ filtros: m ? { momento: m, excluir } : { excluir }, orden: 'destacados', limite });
    pintarProductos(grid, items.map((p, i) => (estilo === 'bento' ? mosHTML(p, i === 0) : cardHTML(p))).join(''));
    grid.setAttribute('aria-labelledby', tab.id);
    if (link) {
      link.href = m ? `${paginaCatalogo()}?momento=${m}` : paginaCatalogo();
      $('span', link).textContent = m ? `Ver todo ${momDe(m).nombre.toLowerCase()}` : 'Ver toda la colección';
    }
    refrescarScroll();
  };
  tabs.forEach(tab => tab.addEventListener('click', () => elegir(tab)));
  $('[role="tablist"]', sec).addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') n = tabs[0];
    if (e.key === 'End') n = tabs[tabs.length - 1];
    if (n) { e.preventDefault(); elegir(n, true); }
  });
  elegir(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
}

function initIndice() {
  const lista = document.querySelector('[data-indice]');
  if (!lista) return;
  const flot = $('[data-indice-foto]', lista.parentElement);
  const fina = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)');
  if (!flot) return;
  const img = $('img', flot);
  let x = 0, y = 0, tx = 0, ty = 0, frame = 0;
  const mover = () => {
    x += (tx - x) * 0.18; y += (ty - y) * 0.18;
    flot.style.transform = `translate(${x}px, ${y}px)`;
    frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(mover) : 0;
  };
  lista.addEventListener('pointermove', e => {
    if (!fina.matches) return;
    const r = lista.parentElement.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    if (reduceMotion) { x = tx; y = ty; flot.style.transform = `translate(${x}px, ${y}px)`; return; }
    if (!frame) frame = requestAnimationFrame(mover);
  });
  $$('[data-indice-img]', lista).forEach(a => {
    a.addEventListener('pointerenter', () => {
      if (!fina.matches) return;
      img.src = a.dataset.indiceImg;
      flot.classList.add('on');
    });
  });
  lista.addEventListener('pointerleave', () => flot.classList.remove('on'));
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el) return;
  const crear = () => {
    if (typeof L === 'undefined' || el.dataset.listo) return;
    el.dataset.listo = '1';
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([ZONA.lat, ZONA.lng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);
    L.circle([ZONA.lat, ZONA.lng], { radius: 1400, color: '#2D56AD', weight: 1, fillColor: '#2D56AD', fillOpacity: 0.12 }).addTo(mapa);
    L.marker([ZONA.lat, ZONA.lng], {
      icon: L.divIcon({ className: 'mapa-pin', html: '<span>ML</span>', iconSize: [44, 44], iconAnchor: [22, 22] }),
      keyboard: false,
    }).addTo(mapa).bindTooltip('MLuxury · Moreno, Buenos Aires', { direction: 'top', offset: [0, -22] });
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { crear(); io.disconnect(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
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
  const miga = document.querySelector('[data-miga]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="momento"]', panel).innerHTML = MOMENTOS.map(m => `<label class="chk"><input type="checkbox" data-f="momento" value="${m.id}"><span>${esc(m.nombre)}</span><small>${Tienda.contar({ momento: m.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    momento: validos(params.get('momento'), MOMENTOS.map(m => m.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    nuevo: params.get('nuevo') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, momento: estado.momento, precio: estado.precio, nuevo: estado.nuevo });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    $$('input[data-f="cat"]', panel).forEach(i => { i.checked = estado.cat.includes(i.value); });
    $$('input[data-f="momento"]', panel).forEach(i => { i.checked = estado.momento.includes(i.value); });
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    $('input[data-f="nuevo"]', panel).checked = estado.nuevo;
    if (miga) {
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      const m = estado.momento.length === 1 ? momDe(estado.momento[0]) : null;
      const actual = [c?.nombre, m?.nombre].filter(Boolean).join(' · ');
      miga.innerHTML = actual ? `<a href="${paginaCatalogo()}">Colección</a><span aria-hidden="true">/</span><span aria-current="page">${esc(actual)}</span>` : '<span aria-current="page">Colección</span>';
    }
    $$('[data-menu-cats] a').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && cat === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('[data-menu-momentos] a').forEach(a => {
      const mom = new URL(a.href).searchParams.get('momento');
      if (estado.momento.length === 1 && mom === estado.momento[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'momento', 'precio', 'nuevo', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.momento.length) u.searchParams.set('momento', estado.momento.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.nuevo) u.searchParams.set('nuevo', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.momento.map(m => ['momento', m, momDe(m).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
      ...(estado.nuevo ? [['nuevo', '', 'Lo nuevo']] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(cardHTML).join(''));
    prepararFotos(grid);
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'joya' : 'joyas'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay joyas con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], momento: [], precio: '', nuevo: false }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'momento') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
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
      else if (k === 'cat' || k === 'momento') estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      else if (k === 'precio') estado.precio = '';
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
  const brillo = hero.querySelector('.hero-kicker');
  if (reduceMotion || typeof gsap === 'undefined') { brillo?.classList.add('brilla'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.09, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(brillo, { y: 18, opacity: 0, duration: 0.9 }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62)
    .from(hero.querySelectorAll('.hero-ancha'), { y: 48, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.45)
    .add(() => brillo?.classList.add('brilla'), 0.9);
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
  initMenuCategorias();
  initNav();
  initSpot();
  initMomentos();
  initIndice();
  initCatalogo();
  initMapa();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initFloats();
  initHeroMotion();
  initReveals();
  prepararFotos();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
}
