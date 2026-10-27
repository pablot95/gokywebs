'use strict';

const WA = '5492284320802';
const MINIMO = 20000;
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;
const HORARIO = { dias: [1, 2, 3, 4, 5, 6], tramos: [[570, 750], [1020, 1200]] };
const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const CATEGORIAS = [
  { id: 'maquillaje', nombre: 'Maquillaje', img: 'images/cat-maquillaje.webp' },
  { id: 'unas', nombre: 'Uñas', img: 'images/cat-unas.webp' },
  { id: 'pestanas', nombre: 'Pestañas', img: 'images/cat-pestanas.webp' },
  { id: 'marroquineria', nombre: 'Marroquinería', img: 'images/cat-marroquineria.webp' },
];

const SUBCATEGORIAS = [
  { id: 'ojos', cat: 'maquillaje', nombre: 'Ojos' },
  { id: 'labios', cat: 'maquillaje', nombre: 'Labios' },
  { id: 'rostro', cat: 'maquillaje', nombre: 'Rostro' },
  { id: 'brochas', cat: 'maquillaje', nombre: 'Brochas y esponjas' },
  { id: 'esmaltes', cat: 'unas', nombre: 'Esmaltes' },
  { id: 'herramientas-unas', cat: 'unas', nombre: 'Herramientas' },
  { id: 'tips', cat: 'unas', nombre: 'Tips' },
  { id: 'pestanas-postizas', cat: 'pestanas', nombre: 'Pestañas postizas' },
  { id: 'herramientas-pestanas', cat: 'pestanas', nombre: 'Herramientas' },
  { id: 'mascaras', cat: 'pestanas', nombre: 'Máscaras' },
  { id: 'carteras', cat: 'marroquineria', nombre: 'Carteras' },
  { id: 'billeteras', cat: 'marroquineria', nombre: 'Billeteras' },
  { id: 'neceseres', cat: 'marroquineria', nombre: 'Neceseres' },
];

const PRECIOS = {
  'hasta-10': [0, 10000, 'Hasta $10.000'],
  '10-25': [10000, 25000, '$10.000 a $25.000'],
  'mas-25': [25000, Infinity, 'Más de $25.000'],
};

const ORDENES = {
  destacados: 'Destacados',
  nuevos: 'Novedades',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const tonos = (precio, lista) => lista.map(([nombre, hex, stock]) => ({ id: norm(nombre).replace(/\s+/g, '-'), nombre, hex, precio, stock }));
const medidas = (precio, lista) => lista.map(([nombre, stock]) => ({ id: norm(nombre).replace(/\s+/g, '-'), nombre, precio, stock }));
const unico = (precio, stock) => [{ id: 'unico', nombre: 'Única', precio, stock }];

const PRODUCTOS = [
  {
    id: 'paleta-nude-rosado', nombre: 'Paleta de sombras Nude rosado', cat: 'maquillaje', sub: 'ojos', img: 'images/p-paleta.webp',
    desc: 'Doce sombras entre nudes, rosados y bronce, con acabados mate y satinados. Trae espejo en la tapa para retocar donde estés.',
    opcTipo: null, opc: unico(18900, 8), ficha: [['Tonos', '12'], ['Acabado', 'Mate y satinado'], ['Incluye', 'Espejo']], destacado: 1, nuevo: true,
  },
  {
    id: 'labial-cremoso', nombre: 'Labial cremoso', cat: 'maquillaje', sub: 'labios', img: 'images/p-labiales.webp',
    desc: 'Labial en barra de textura cremosa y color intenso desde la primera pasada. Elegís entre borgoña, nude rosado y rojo clásico.',
    opcTipo: 'tono', opc: tonos(9900, [['Borgoña', '#7A1F3D', 6], ['Nude rosado', '#C27A7E', 9], ['Rojo clásico', '#B3242B', 4]]),
    ficha: [['Textura', 'Cremosa'], ['Acabado', 'Satinado']], destacado: 2,
  },
  {
    id: 'esmalte-semipermanente', nombre: 'Esmalte semipermanente 10 ml', cat: 'unas', sub: 'esmaltes', img: 'images/p-esmaltes.webp',
    desc: 'Esmalte semipermanente que se cura con lámpara UV/LED. Cubre parejo en dos capas y queda con brillo. Cinco tonos para elegir.',
    opcTipo: 'tono', opc: tonos(6500, [['Rosa viejo', '#B76E7A', 12], ['Nude', '#E2B8AE', 15], ['Glitter rosa', '#D8A0A8', 6], ['Bordó', '#6E1A2E', 8], ['Terracota', '#B5644E', 5]]),
    ficha: [['Contenido', '10 ml'], ['Curado', 'Lámpara UV/LED']], destacado: 3, pro: true,
  },
  {
    id: 'base-liquida', nombre: 'Base líquida acabado natural', cat: 'maquillaje', sub: 'rostro', img: 'images/p-base.webp',
    desc: 'Base líquida de cobertura media y acabado natural, con dosificador. Viene en tres tonos.',
    opcTipo: 'tono', opc: tonos(14900, [['Claro', '#EBC9A8', 5], ['Medio', '#D3A47C', 7], ['Trigueño', '#A9754E', 3]]),
    ficha: [['Cobertura', 'Media'], ['Acabado', 'Natural'], ['Envase', 'Con dosificador']], destacado: 4,
  },
  {
    id: 'alicate-cuticulas', nombre: 'Alicate de acero para cutículas', cat: 'unas', sub: 'herramientas-unas', img: 'images/p-alicate.webp',
    desc: 'Alicate de acero inoxidable con punta fina para retirar cutículas con precisión. Se puede esterilizar.',
    opcTipo: null, opc: unico(12500, 6), ficha: [['Material', 'Acero inoxidable'], ['Uso', 'Cutículas']], destacado: 5, pro: true,
  },
  {
    id: 'rubor-compacto', nombre: 'Rubor compacto rosa', cat: 'maquillaje', sub: 'rostro', img: 'images/p-rubor.webp',
    desc: 'Rubor en polvo de tono rosa frío, fácil de difuminar. Viene en estuche con espejo.',
    opcTipo: null, opc: unico(9400, 10), ficha: [['Textura', 'Polvo compacto'], ['Incluye', 'Espejo']], destacado: 6,
  },
  {
    id: 'set-brochas', nombre: 'Set de 5 brochas de maquillaje', cat: 'maquillaje', sub: 'brochas', img: 'images/p-brochas.webp',
    desc: 'Cinco brochas de pelo sintético suave para polvo, rubor, sombras y difuminado. Mangos con brillo y virola dorada.',
    opcTipo: null, opc: unico(16900, 6), ficha: [['Piezas', '5'], ['Pelo', 'Sintético']], destacado: 7,
  },
  {
    id: 'pestanas-tira', nombre: 'Pestañas en tira Volumen natural x5 pares', cat: 'pestanas', sub: 'pestanas-postizas', img: 'images/p-pestanas-tira.webp',
    desc: 'Caja con cinco pares de pestañas en tira de efecto volumen natural. Livianas y reutilizables si las cuidás.',
    opcTipo: null, opc: unico(9800, 10), ficha: [['Pares', '5'], ['Efecto', 'Volumen natural']], destacado: 8,
  },
  {
    id: 'neceser-rosa', nombre: 'Neceser de cuero ecológico rosa', cat: 'marroquineria', sub: 'neceseres', img: 'images/p-neceser.webp',
    desc: 'Neceser de cuero ecológico con cierre dorado, del tamaño justo para el maquillaje de todos los días.',
    opcTipo: null, opc: unico(18500, 6), ficha: [['Material', 'Cuero ecológico'], ['Cierre', 'Metálico dorado']], destacado: 9,
  },
  {
    id: 'cartera-bandolera', nombre: 'Cartera bandolera beige', cat: 'marroquineria', sub: 'carteras', img: 'images/p-bandolera.webp',
    desc: 'Cartera bandolera de cuero ecológico con tapa, traba metálica y correa larga para llevar cruzada.',
    opcTipo: null, opc: unico(42000, 4), ficha: [['Material', 'Cuero ecológico'], ['Correa', 'Larga, para cruzar']], destacado: 10,
  },
  {
    id: 'iluminador-champagne', nombre: 'Iluminador compacto champagne', cat: 'maquillaje', sub: 'rostro', img: 'images/p-iluminador.webp',
    desc: 'Iluminador en polvo tono champagne, con brillo suave para pómulos, nariz y arco de cupido.',
    opcTipo: null, opc: unico(10900, 7), ficha: [['Tono', 'Champagne'], ['Textura', 'Polvo compacto']], nuevo: true,
  },
  {
    id: 'polvo-translucido', nombre: 'Polvo compacto translúcido', cat: 'maquillaje', sub: 'rostro', img: 'images/p-polvo.webp',
    desc: 'Polvo compacto translúcido para sellar la base y quitar brillo sin cambiar el tono de la piel.',
    opcTipo: null, opc: unico(11500, 9), ficha: [['Tono', 'Translúcido'], ['Acabado', 'Mate']],
  },
  {
    id: 'esponjas-x3', nombre: 'Esponjas de maquillaje x3', cat: 'maquillaje', sub: 'brochas', img: 'images/p-esponjas.webp',
    desc: 'Tres esponjas de látex libre, para aplicar base y corrector en seco o húmedas.',
    opcTipo: null, opc: unico(5900, 20), ficha: [['Unidades', '3'], ['Uso', 'En seco o húmeda']],
  },
  {
    id: 'tips-muestrario', nombre: 'Tips para muestrario x50', cat: 'unas', sub: 'tips', img: 'images/p-tips.webp',
    desc: 'Tips ovalados transparentes con varilla, para mostrar tus colores a las clientas o practicar diseños.',
    opcTipo: null, opc: unico(5200, 25), ficha: [['Unidades', '50'], ['Forma', 'Ovalada']], pro: true,
  },
  {
    id: 'pinceles-nail-art', nombre: 'Set de 5 pinceles para nail art', cat: 'unas', sub: 'herramientas-unas', img: 'images/p-pinceles.webp',
    desc: 'Cinco pinceles finos para líneas, degradés y detalles en gel o semipermanente.',
    opcTipo: null, opc: unico(11900, 8), ficha: [['Piezas', '5'], ['Uso', 'Gel y semipermanente']], nuevo: true, pro: true,
  },
  {
    id: 'lima-vidrio', nombre: 'Lima de vidrio', cat: 'unas', sub: 'herramientas-unas', img: 'images/p-lima.webp',
    desc: 'Lima de vidrio templado que no se gasta y se lava con agua. Da forma sin abrir las capas de la uña.',
    opcTipo: null, opc: unico(4900, 18), ficha: [['Material', 'Vidrio templado'], ['Largo', '14 cm']],
  },
  {
    id: 'base-top-coat', nombre: 'Base y top coat semipermanente', cat: 'unas', sub: 'esmaltes', img: 'images/p-base-top.webp',
    desc: 'Dúo de base y top coat para semipermanente: la base ayuda a que el color se adhiera y el top lo sella con brillo.',
    opcTipo: null, opc: unico(13800, 7), ficha: [['Incluye', 'Base + top coat'], ['Curado', 'Lámpara UV/LED']], pro: true,
  },
  {
    id: 'pestanas-individuales', nombre: 'Pestañas individuales en bandeja', cat: 'pestanas', sub: 'pestanas-postizas', img: 'images/p-pestanas-individuales.webp',
    desc: 'Bandeja de pestañas individuales para extensiones pelo a pelo. Elegís la medida.',
    opcTipo: 'medida', opc: medidas(8600, [['8 mm', 6], ['10 mm', 9], ['12 mm', 4]]), ficha: [['Tipo', 'Pelo a pelo'], ['Curva', 'C']], nuevo: true, pro: true,
  },
  {
    id: 'pinza-curva', nombre: 'Pinza curva para pestañas', cat: 'pestanas', sub: 'herramientas-pestanas', img: 'images/p-pinza.webp',
    desc: 'Pinza de punta curva y fina para tomar y aislar pestañas una por una.',
    opcTipo: null, opc: unico(7900, 9), ficha: [['Punta', 'Curva'], ['Material', 'Acero']], pro: true,
  },
  {
    id: 'mascara-volumen', nombre: 'Máscara de pestañas volumen', cat: 'pestanas', sub: 'mascaras', img: 'images/p-mascara.webp',
    desc: 'Máscara negra de efecto volumen, con cepillo que separa y no deja grumos.',
    opcTipo: null, opc: unico(8900, 11), ficha: [['Color', 'Negro'], ['Efecto', 'Volumen']],
  },
  {
    id: 'billetera-negra', nombre: 'Billetera de cuero negra', cat: 'marroquineria', sub: 'billeteras', img: 'images/p-billetera.webp',
    desc: 'Billetera compacta de cuero negro, con lugar para tarjetas, billetes y monedas.',
    opcTipo: null, opc: unico(24900, 5), ficha: [['Material', 'Cuero'], ['Formato', 'Compacta']],
  },
  {
    id: 'cartera-tejida', nombre: 'Cartera de mano tejida', cat: 'marroquineria', sub: 'carteras', img: 'images/p-cartera-tejida.webp',
    desc: 'Cartera de mano con frente tejido, manija corta y traba metálica. Va con todo, de día o de noche.',
    opcTipo: null, opc: unico(38900, 3), ficha: [['Frente', 'Tejido'], ['Manija', 'Corta']], nuevo: true,
  },
  {
    id: 'cartera-tote', nombre: 'Cartera tote con correa', cat: 'marroquineria', sub: 'carteras', img: 'images/p-cartera-tote.webp',
    desc: 'Cartera tote amplia de textura lino, con manijas y correa desmontable para colgar al hombro.',
    opcTipo: null, opc: unico(46500, 4), ficha: [['Textura', 'Lino'], ['Correa', 'Desmontable']],
  },
];

function norm(s) {
  return String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const opcDe = (p, opcId) => p.opc.find(x => x.id === opcId) || p.opc[0];
const precioDesde = p => Math.min(...p.opc.map(x => x.precio));
const stockTotal = p => p.opc.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = id => SUBCATEGORIAS.find(s => s.id === id);
const necesitaOpciones = p => p.opc.length > 1;
const textoBoton = p => (p.opcTipo === 'tono' ? 'Elegir tono' : p.opcTipo === 'medida' ? 'Elegir medida' : 'Agregar');
const etiquetaOpc = p => (p.opcTipo === 'tono' ? 'Tono' : p.opcTipo === 'medida' ? 'Medida' : 'Presentación');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v >= max) return false;
    }
    if (f.nuevo && !p.nuevo) return false;
    if (f.pro && !p.pro) return false;
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
      p.nombre, catDe(p.cat)?.nombre, subDe(p.sub)?.nombre, p.desc, p.pro ? 'profesional insumos' : '',
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
  KEY: 'fresastore_cart',
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

function estadoMinimo(total) {
  const falta = Math.max(0, MINIMO - total);
  return { falta, llega: falta === 0, pct: Math.min(100, Math.round((total / MINIMO) * 100)) };
}

const hora = m => `${Math.floor(m / 60)}${m % 60 ? `:${String(m % 60).padStart(2, '0')}` : ''} h`;

function estadoLocal(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(fecha);
  const val = t => partes.find(x => x.type === t)?.value;
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
  const min = (Number(val('hour')) % 24) * 60 + Number(val('minute'));
  if (HORARIO.dias.includes(dia)) {
    const abierto = HORARIO.tramos.find(([a, c]) => min >= a && min < c);
    if (abierto) return { abierto: true, texto: `Abierto ahora · hasta las ${hora(abierto[1])}` };
    const despues = HORARIO.tramos.find(([a]) => min < a);
    if (despues) return { abierto: false, texto: `Cerrado ahora · abre hoy a las ${hora(despues[0])}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7;
    if (HORARIO.dias.includes(d)) return { abierto: false, texto: `Cerrado ahora · abre ${i === 1 ? 'mañana' : `el ${NOMBRES_DIA[d]}`} a las ${hora(HORARIO.tramos[0][0])}` };
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
  camion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
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
  const b = [];
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  else if (stockTotal(p) > 0 && stockTotal(p) <= 4) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  if (p.pro) b.push('<span class="badge badge--pro">Uso profesional</span>');
  return b.length ? `<div class="prod-sellos">${b.join('')}</div>` : '';
}

function muestrasHTML(p) {
  if (p.opcTipo !== 'tono') return '';
  return `<ul class="muestras" aria-label="${p.opc.length} tonos">${p.opc.map(x => `<li style="--tono:${esc(x.hex)}" title="${esc(x.nombre)}"></li>`).join('')}</ul>`;
}

function precioHTML(p) {
  return `<p class="prod-precio"><strong>${formatearPrecio(precioDesde(p))}</strong></p>`;
}

const metaDe = p => esc(subDe(p.sub)?.nombre || catDe(p.cat)?.nombre || '');

function cardHTML(p, { revelar = true } = {}) {
  const anim = revelar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  return `<article class="prod" data-id="${esc(p.id)}"${anim}>
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img.replace('.webp', '-480.webp'))}" alt="${esc(p.nombre)}" width="480" height="480" decoding="async"></a>
      ${sellosHTML(p)}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      <div class="prod-fila">${precioHTML(p)}${muestrasHTML(p)}</div>
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

function railHTML(p) {
  return `<li class="rail-item" data-animate="der" style="opacity:0;transform:translateX(56px)">
    <article class="prod prod--rail" data-id="${esc(p.id)}">
      <div class="prod-media">
        <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img.replace('.webp', '-480.webp'))}" alt="${esc(p.nombre)}" width="480" height="480" decoding="async" draggable="false"></a>
        ${sellosHTML(p)}
      </div>
      <div class="prod-body">
        <p class="prod-meta">${metaDe(p)}</p>
        <h3 class="prod-nombre">${esc(p.nombre)}</h3>
        <div class="prod-fila">${precioHTML(p)}${muestrasHTML(p)}</div>
        <button type="button" class="prod-add prod-add--rail" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${necesitaOpciones(p) ? '' : ICONOS.carrito}<span>${textoBoton(p)}</span></button>
      </div>
    </article>
  </li>`;
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
  const catActual = new URLSearchParams(location.search).get('cat');
  $('[data-menu-cats]', cont).innerHTML = CATEGORIAS.map(c => `<li class="nav-cat">
      <a class="nav-cat-link" href="${paginaCatalogo()}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="900" height="675" loading="lazy"><span><strong>${esc(c.nombre)}</strong><small>${Tienda.contar({ cat: c.id })} productos</small></span></a>
      <ul class="nav-subs">${SUBCATEGORIAS.filter(s => s.cat === c.id).map(s => `<li><a href="${paginaCatalogo()}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a></li>`).join('')}</ul>
    </li>`).join('');
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
  $$('[data-cuenta-cat]').forEach(el => { el.textContent = `${Tienda.contar({ cat: el.dataset.cuentaCat })} productos`; });
  $$('[data-minimo-txt]').forEach(el => { el.textContent = formatearPrecio(MINIMO); });
}

function initHorario() {
  const els = $$('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoLocal();
    els.forEach(el => {
      const t = el.querySelector('[data-estado-texto]') || el;
      t.textContent = e.texto;
      el.classList.toggle('estado--abierto', e.abierto);
    });
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

function barraMinimoHTML(total) {
  const m = estadoMinimo(total);
  return `<div class="minimo${m.llega ? ' minimo--ok' : ''}">
    <p class="minimo-txt">${m.llega ? `Llegaste a la compra mínima de ${formatearPrecio(MINIMO)}.` : `Te faltan <strong>${formatearPrecio(m.falta)}</strong> para la compra mínima de ${formatearPrecio(MINIMO)}.`}</p>
    <progress class="minimo-barra" max="100" value="${m.pct}" aria-label="Avance hacia la compra mínima">${m.pct}%</progress>
  </div>`;
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
      <header class="drawer-head">
        <h2>Tu pedido <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <p class="drawer-aviso">${ICONOS.camion}<span>Envíos a todo el país · compra mínima ${formatearPrecio(MINIMO)}</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <div data-drawer-minimo></div>
        <p class="drawer-total"><span>Subtotal</span><strong data-drawer-total>$0</strong></p>
        <p class="drawer-nota">El envío se calcula según tu localidad y te lo confirmamos antes de pagar.</p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--wsp btn--block" data-pedido-wsp href="${waLink('Hola! Quiero hacer un pedido desde la web de Fresa store.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
      </footer>
    </aside>`);
  const drawer = $('#drawer');
  const bd = $('#drawer-bd');
  const body = $('[data-drawer-body]', drawer);
  const foot = $('[data-drawer-foot]', drawer);
  const finalizar = $('[data-finalizar]', drawer);
  const pedido = $('[data-pedido-wsp]', drawer);
  let opener = null;
  let timer = 0;

  const pintar = () => {
    const lineas = Cart.lineas();
    $('[data-drawer-cuenta]', drawer).textContent = lineas.length ? `(${Cart.count()})` : '';
    foot.hidden = !lineas.length;
    if (!lineas.length) {
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.carrito}<p><strong>Tu carrito está vacío.</strong> Maquillaje, uñas, pestañas y carteras te esperan en el catálogo.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver al catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.img.replace('.webp', '-480.webp'))}" alt="" width="480" height="480">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${esc(catDe(l.producto.cat)?.nombre)}${l.producto.opcTipo ? ` · ${esc(etiquetaOpc(l.producto))} ${esc(l.opcion.nombre)}` : ''}</p>
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
    const total = Cart.total();
    const m = estadoMinimo(total);
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(total);
    $('[data-drawer-minimo]', drawer).innerHTML = barraMinimoHTML(total);
    finalizar.disabled = !m.llega;
    finalizar.textContent = m.llega ? 'Finalizar compra' : `Sumá ${formatearPrecio(m.falta)} para finalizar`;
    pedido.classList.toggle('btn--apagado', !m.llega);
    pedido.setAttribute('aria-disabled', m.llega ? 'false' : 'true');
    const texto = ['Hola! Quiero hacer este pedido en Fresa store:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre}${l.producto.opcTipo ? ` (${etiquetaOpc(l.producto).toLowerCase()} ${l.opcion.nombre})` : ''} ${formatearPrecio(l.unitario * l.qty)}`), `Subtotal: ${formatearPrecio(total)}`, 'Mi localidad para el envío es: '].join('\n');
    pedido.href = waLink(texto);
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
    if (e.target.closest('[data-pedido-wsp]') && !estadoMinimo(Cart.total()).llega) {
      e.preventDefault();
      showToast(`Para enviar el pedido te faltan ${formatearPrecio(estadoMinimo(Cart.total()).falta)}.`);
      return;
    }
    const li = e.target.closest('.linea');
    if (!li) return;
    const k = li.dataset.clave;
    const it = Cart.get().find(i => Cart.clave(i.id, i.opc) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  finalizar.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle del producto">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media"><img src="images/p-paleta.webp" alt="" width="1000" height="1000" data-qv-img></div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const img = $('[data-qv-img]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const o = opcDe(p, estado.opc);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    const elegido = p.opcTipo ? estado.elegido : true;
    const sinStock = elegido && !(o.stock > 0);
    const aviso = p.opcTipo === 'tono' ? 'elegí el tono' : 'elegí la medida';
    info.innerHTML = `
      <p class="qv-meta">${esc(catDe(p.cat)?.nombre)} · ${metaDe(p)}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio"><strong>${formatearPrecio(o.precio)}</strong></p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${necesitaOpciones(p) ? `<fieldset class="opciones${estado.falta ? ' opciones--falta' : ''}"><legend>${etiquetaOpc(p)}${elegido ? `: <strong>${esc(o.nombre)}</strong>` : ` <span class="opciones-aviso">· ${aviso}</span>`}</legend><div class="chips${p.opcTipo === 'tono' ? ' chips--tono' : ''}">${p.opc.map(x => `<label class="chip"><input type="radio" name="qv-opc" value="${esc(x.id)}"${elegido && x.id === o.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}>${x.hex ? `<span class="chip-tono" style="--tono:${esc(x.hex)}" aria-hidden="true"></span>` : ''}<span>${esc(x.nombre)}</span></label>`).join('')}</div></fieldset>` : ''}
      <p class="qv-stock">${sinStock ? 'Sin stock en esta opción.' : elegido && o.stock <= 4 ? `Quedan ${o.stock}.` : 'En stock · lo despachamos a todo el país.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por: ${p.nombre}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar por este producto</span></a>
      <dl class="qv-ficha">${(p.ficha || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}${p.pro ? '<div><dt>Uso</dt><dd>Profesional</dd></div>' : ''}</dl>
      <p class="qv-legal">Foto ilustrativa. Precio y stock de muestra.</p>
      ${rel.length ? `<div class="qv-rel"><h3>Para sumar a tu pedido</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.img.replace('.webp', '-480.webp'))}" alt="" width="480" height="480"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    img.src = p.img;
    img.alt = p.nombre;
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre,
      image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: 'Fresa store' },
      offers: p.opc.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: x.precio, availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const agregar = () => {
    const p = estado.p;
    if (p.opcTipo && !estado.elegido) {
      estado.falta = true;
      pintar();
      info.querySelector('.opciones input:not(:disabled)')?.focus();
      showToast(p.opcTipo === 'tono' ? 'Elegí el tono para agregarlo.' : 'Elegí la medida para agregarlas.');
      return false;
    }
    const o = opcDe(p, estado.opc);
    Cart.add(p, estado.qty, { opc: o.id });
    showToast(`${p.nombre}${p.opcTipo ? ` · ${o.nombre}` : ''} al carrito`);
    return true;
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    const o = p.opc.find(x => x.stock > 0) || p.opc[0];
    estado = { p, opc: o.id, elegido: !p.opcTipo, qty: Math.max(1, Math.min(qty, o.stock || 1)), falta: false };
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
  const elegir = opcId => {
    estado.opc = opcId;
    estado.elegido = true;
    estado.falta = false;
    const o = opcDe(estado.p, opcId);
    estado.qty = Math.min(estado.qty, o.stock || 1);
    pintar();
    info.querySelector(`input[name="qv-opc"][value="${window.CSS.escape(opcId)}"]`)?.focus();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => { if (e.target.name === 'qv-opc') elegir(e.target.value); });
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const o = opcDe(estado.p, estado.opc);
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), o.stock || 1));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
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
    const m = estadoMinimo(Cart.total());
    showToast(m.llega ? `${p.nombre} al carrito` : `${p.nombre} al carrito · te faltan ${formatearPrecio(m.falta)} para el mínimo`);
    add.classList.remove('ok'); void add.offsetWidth; add.classList.add('ok');
  });
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
  const sec = document.querySelector('[data-rail]');
  if (!sec) return;
  const vp = $('.rail-vp', sec);
  const track = $('.rail-track', sec);
  const prev = $('[data-rail-prev]', sec);
  const next = $('[data-rail-next]', sec);
  track.innerHTML = Tienda.consultar({ filtros: { destacado: true }, limite: 8 }).items.map(railHTML).join('');
  initRailDrag(vp);
  const paso = () => (track.querySelector('.rail-item')?.getBoundingClientRect().width || 280) + 20;
  const estado = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', estado, { passive: true });
  window.addEventListener('resize', estado, { passive: true });
  estado();
}

function initSumar() {
  const grid = document.querySelector('[data-sumar]');
  if (!grid) return;
  const enRail = Tienda.consultar({ filtros: { destacado: true }, limite: 8 }).items.map(p => p.id);
  const items = Tienda.consultar({ filtros: { excluir: enRail, precio: 'hasta-10' }, orden: 'precio-asc', limite: 8 }).items;
  if (items.length < 8) items.push(...Tienda.consultar({ filtros: { excluir: [...enRail, ...items.map(i => i.id)] }, orden: 'precio-asc', limite: 8 - items.length }).items);
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initPestanasCat() {
  const sec = document.querySelector('[data-pestanas-cat]');
  if (!sec) return;
  const tabs = $$('[role="tab"]', sec);
  const grid = $('[data-pestanas-grid]', sec);
  const link = $('[data-pestanas-link]', sec);
  let actual = '';
  const activar = (id, foco = false) => {
    if (id === actual) return;
    const primera = !actual;
    actual = id;
    tabs.forEach(t => {
      const sel = t.dataset.cat === id;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      if (sel && foco) t.focus();
    });
    grid.setAttribute('aria-labelledby', `tab-${id}`);
    grid.innerHTML = Tienda.consultar({ filtros: { cat: id }, limite: 8 }).items.map(p => cardHTML(p, { revelar: primera })).join('');
    if (!primera && !reduceMotion) grid.querySelectorAll('.prod').forEach((c, i) => { c.style.animationDelay = `${Math.min(i * 0.05, 0.4)}s`; c.classList.add('prod--entra'); });
    link.href = `${paginaCatalogo()}?cat=${id}`;
    link.querySelector('span').textContent = `Ver todo ${catDe(id).nombre.toLowerCase()} (${Tienda.contar({ cat: id })})`;
    refrescarScroll();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(t.dataset.cat));
    t.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      activar(tabs[(i + d + tabs.length) % tabs.length].dataset.cat, true);
    });
  });
  activar(tabs[0].dataset.cat);
}

function initMinimoVivo() {
  const els = $$('[data-minimo-vivo]');
  if (!els.length) return;
  const pintar = () => {
    const total = Cart.total();
    const m = estadoMinimo(total);
    els.forEach(el => {
      $('[data-mv-total]', el).textContent = formatearPrecio(total);
      $('[data-mv-barra]', el).value = m.pct;
      $('[data-mv-barra]', el).textContent = `${m.pct}%`;
      $('[data-mv-texto]', el).textContent = !total ? `Agregá productos: la compra mínima es de ${formatearPrecio(MINIMO)}.` : m.llega ? '¡Listo! Ya podés finalizar tu compra.' : `Te faltan ${formatearPrecio(m.falta)} para la compra mínima.`;
      el.classList.toggle('mv--ok', m.llega);
      const btn = $('[data-mv-btn]', el);
      if (btn) btn.querySelector('span').textContent = total ? 'Ver mi pedido' : 'Empezar a comprar';
    });
  };
  els.forEach(el => $('[data-mv-btn]', el)?.addEventListener('click', e => {
    if (Cart.count()) { e.preventDefault(); abrirCarrito(); }
  }));
  document.addEventListener('cart:updated', pintar);
  pintar();
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
  const titulo = document.querySelector('[data-cat-titulo]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<div class="f-cat">
      <label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>
      <div class="f-subs" data-subs-de="${c.id}">${SUBCATEGORIAS.filter(s => s.cat === c.id).map(s => `<label class="chk chk--sub"><input type="checkbox" data-f="sub" value="${s.id}"><span>${esc(s.nombre)}</span><small>${Tienda.contar({ sub: s.id })}</small></label>`).join('')}</div>
    </div>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    sub: validos(params.get('sub'), SUBCATEGORIAS.map(s => s.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    nuevo: params.get('nuevo') === '1',
    pro: params.get('pro') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, sub: estado.sub, precio: estado.precio, nuevo: estado.nuevo, pro: estado.pro });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    $$('input[data-f="cat"]', panel).forEach(i => { i.checked = estado.cat.includes(i.value); });
    $$('input[data-f="sub"]', panel).forEach(i => { i.checked = estado.sub.includes(i.value); });
    $$('[data-subs-de]', panel).forEach(d => { d.hidden = !estado.cat.includes(d.dataset.subsDe) && !SUBCATEGORIAS.some(s => s.cat === d.dataset.subsDe && estado.sub.includes(s.id)); });
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    $('input[data-f="nuevo"]', panel).checked = estado.nuevo;
    $('input[data-f="pro"]', panel).checked = estado.pro;
    const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const s = estado.sub.length === 1 ? subDe(estado.sub[0]) : null;
    if (miga) miga.innerHTML = c ? `<a href="${paginaCatalogo()}">Catálogo</a><span aria-hidden="true">/</span>${s ? `<a href="${paginaCatalogo()}?cat=${c.id}">${esc(c.nombre)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(s.nombre)}</span>` : `<span aria-current="page">${esc(c.nombre)}</span>`}` : '<span aria-current="page">Catálogo</span>';
    if (titulo) titulo.textContent = c ? (s ? `${c.nombre}: ${s.nombre.toLowerCase()}` : c.nombre) : 'Todo el catálogo';
    $$('[data-menu-cats] .nav-cat-link').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (c && cat === c.id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'sub', 'precio', 'nuevo', 'pro', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.sub.length) u.searchParams.set('sub', estado.sub.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.nuevo) u.searchParams.set('nuevo', '1');
    if (estado.pro) u.searchParams.set('pro', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.sub.map(s => ['sub', s, subDe(s).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
      ...(estado.pro ? [['pro', '', 'Uso profesional']] : []),
      ...(estado.nuevo ? [['nuevo', '', 'Novedades']] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay productos con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], sub: [], precio: '', nuevo: false, pro: false }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat') {
      estado.cat = $$('input[data-f="cat"]:checked', panel).map(i => i.value);
      estado.sub = estado.sub.filter(s => estado.cat.includes(subDe(s).cat));
    }
    if (f === 'sub') estado.sub = $$('input[data-f="sub"]:checked', panel).map(i => i.value);
    if (f === 'precio') estado.precio = e.target.value;
    if (f === 'nuevo') estado.nuevo = e.target.checked;
    if (f === 'pro') estado.pro = e.target.checked;
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
      else if (k === 'cat') { estado.cat = estado.cat.filter(v => v !== quitar.dataset.valor); estado.sub = estado.sub.filter(s => subDe(s).cat !== quitar.dataset.valor); }
      else if (k === 'sub') estado.sub = estado.sub.filter(v => v !== quitar.dataset.valor);
      else if (k === 'precio') estado.precio = '';
      else if (k === 'nuevo') estado.nuevo = false;
      else if (k === 'pro') estado.pro = false;
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
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.08, duration: 1.8, stagger: 0.1, clearProps: 'transform' }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.42)
    .from(hero.querySelectorAll('.hero-ctas .btn, .hero-buscar'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55)
    .from(hero.querySelectorAll('.hero-foto'), { y: 40, opacity: 0, duration: 1.3, stagger: 0.12, clearProps: 'transform,opacity' }, 0.3)
    .from(hero.querySelectorAll('.hero-badge, .hero-chips li'), { scale: 0.92, opacity: 0, duration: 0.9, stagger: 0.07, clearProps: 'transform,opacity' }, 0.75);
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
  initRail();
  initSumar();
  initPestanasCat();
  initCatalogo();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initMinimoVivo();
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
