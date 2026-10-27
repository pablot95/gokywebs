'use strict';

const WA = '5492954736281';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;

const CATEGORIAS = [
  { id: 'extractos', nombre: 'Extractos', largo: 'Extracto de perfume', formato: 'Spray de 30 y 60 ml', img: 'images/p-erba-pura.webp' },
  { id: 'g6', nombre: 'Perfumes G6', largo: 'Perfume G6', formato: 'Frasco de 100 ml', img: 'images/p-good-girl.webp' },
  { id: 'rollon', nombre: 'Roll-on', largo: 'Roll-on en aceite', formato: 'Roll-on de 10 ml', img: 'images/p-yara-elixir.webp' },
];

const GENEROS = [
  { id: 'el', nombre: 'Para él', corto: 'Masculino' },
  { id: 'ella', nombre: 'Para ella', corto: 'Femenino' },
  { id: 'unisex', nombre: 'Unisex', corto: 'Unisex' },
];

const FAMILIAS = [
  { id: 'dulce', nombre: 'Dulces', largo: 'Dulce y gourmand', notas: 'vainilla, miel y praliné', img: 'images/p-yara.webp' },
  { id: 'ambar', nombre: 'Ámbar y especias', largo: 'Ámbar y especias', notas: 'canela, azafrán y ámbar', img: 'images/p-liquid-brun.webp' },
  { id: 'amaderada', nombre: 'Amaderadas', largo: 'Amaderado', notas: 'vetiver, abedul y cedro', img: 'images/p-born-in-roma-uomo.webp' },
  { id: 'floral', nombre: 'Florales', largo: 'Floral', notas: 'jazmín, tuberosa y orquídea', img: 'images/p-born-in-roma-donna.webp' },
  { id: 'fresca', nombre: 'Frescas', largo: 'Fresco y cítrico', notas: 'bergamota, limón y ananá', img: 'images/p-sauvage.webp' },
];

const PRECIOS = {
  'hasta-10': [0, 10000, 'Hasta $10.000'],
  '10-25': [10000, 25000, '$10.000 a $25.000'],
  'mas-25': [25000, Infinity, 'Más de $25.000'],
};

const ORDENES = {
  destacados: 'Más pedidos',
  nuevos: 'Lo nuevo',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const extracto = (p60, s60, p30, s30) => [{ id: '60ml', nombre: '60 ml', precio: p60, stock: s60 }, { id: '30ml', nombre: '30 ml', precio: p30, stock: s30 }];
const unico = (ml, precio, stock) => [{ id: `${ml}ml`, nombre: `${ml} ml`, precio, stock }];

const PRODUCTOS = [
  {
    id: 'yara', nombre: 'Yara', insp: 'Yara', casa: 'Lattafa', cat: 'extractos', genero: 'ella', familia: 'dulce',
    notas: ['Orquídea', 'Heliotropo', 'Mandarina', 'Vainilla', 'Almizcle'],
    desc: 'Cremosa y dulce, con flores suaves y un fondo de vainilla. Uno de los árabes más pedidos para usar todos los días.',
    opc: extracto(22900, 8, 14900, 10), destacado: 1,
  },
  {
    id: 'erba-pura', nombre: 'Erba Pura', insp: 'Erba Pura', casa: 'Xerjoff', cat: 'extractos', genero: 'unisex', familia: 'dulce',
    notas: ['Naranja', 'Limón', 'Frutas', 'Ámbar', 'Vainilla', 'Almizcle blanco'],
    desc: 'Cítricos y frutas de entrada, con un fondo cálido de ámbar y vainilla. Se nota apenas llegás y va igual de bien de día o de noche.',
    opc: extracto(24900, 6, 15900, 9), destacado: 3,
  },
  {
    id: 'born-in-roma-uomo', nombre: 'Born in Roma Uomo', insp: 'Uomo Born in Roma', casa: 'Valentino', cat: 'extractos', genero: 'el', familia: 'amaderada',
    notas: ['Hoja de violeta', 'Sal', 'Salvia', 'Jengibre', 'Vetiver'],
    desc: 'Amaderado y salado, con un toque de violeta. Moderno, prolijo y fácil de llevar a la oficina o a una salida.',
    opc: extracto(22900, 7, 14900, 8), destacado: 5,
  },
  {
    id: 'scandal', nombre: 'Scandal', insp: 'Scandal', casa: 'Jean Paul Gaultier', cat: 'extractos', genero: 'ella', familia: 'dulce',
    notas: ['Naranja sanguina', 'Miel', 'Gardenia', 'Pachulí', 'Cera de abeja'],
    desc: 'Miel y flores blancas sobre un fondo de pachulí. Dulce y con carácter: para la noche o para cuando querés que se note.',
    opc: extracto(22900, 3, 14900, 6), destacado: 7,
  },
  {
    id: 'club-de-nuit-intense', nombre: 'Club de Nuit Intense Man', insp: 'Club de Nuit Intense Man', casa: 'Armaf', cat: 'extractos', genero: 'el', familia: 'amaderada',
    notas: ['Limón', 'Ananá', 'Grosella negra', 'Abedul', 'Almizcle'],
    desc: 'Arranca cítrico y frutal y termina ahumado, con abedul y almizcle. Un clásico masculino con mucha presencia.',
    opc: extracto(22900, 9, 14900, 12), destacado: 9,
  },
  {
    id: 'born-in-roma-donna', nombre: 'Born in Roma Donna', insp: 'Donna Born in Roma', casa: 'Valentino', cat: 'extractos', genero: 'ella', familia: 'floral',
    notas: ['Grosella negra', 'Bergamota', 'Jazmín', 'Vainilla bourbon', 'Cachemira'],
    desc: 'Floral con jazmín y una vainilla tostada que lo vuelve cálido. Femenino, elegante y muy fácil de usar.',
    opc: extracto(22900, 5, 14900, 7), destacado: 10,
  },
  {
    id: 'khamrah', nombre: 'Khamrah', insp: 'Khamrah', casa: 'Lattafa', cat: 'rollon', genero: 'unisex', familia: 'ambar',
    notas: ['Canela', 'Nuez moscada', 'Dátiles', 'Praliné', 'Haba tonka'],
    desc: 'Especiado y dulce, como un postre tibio: canela, dátiles y praliné. En roll-on, para llevar en la cartera o la mochila.',
    opc: unico(10, 8900, 10), destacado: 4,
  },
  {
    id: 'sauvage', nombre: 'Sauvage', insp: 'Sauvage', casa: 'Dior', cat: 'g6', genero: 'el', familia: 'fresca',
    notas: ['Bergamota', 'Pimienta', 'Lavanda', 'Ambroxan', 'Cedro'],
    desc: 'Fresco y especiado, con bergamota y pimienta. El masculino que va con todo, del trabajo a una cena.',
    opc: unico(100, 32900, 6), destacado: 2,
  },
  {
    id: 'eros-flame', nombre: 'Eros Flame', insp: 'Eros Flame', casa: 'Versace', cat: 'extractos', genero: 'el', familia: 'ambar',
    notas: ['Mandarina', 'Pimienta negra', 'Romero', 'Vainilla', 'Sándalo'],
    desc: 'Cítrico y picante de entrada, con fondo de vainilla y sándalo. Cálido, intenso y pensado para la noche.',
    opc: extracto(22900, 4, 14900, 6), destacado: 11,
  },
  {
    id: 'ange-ou-demon', nombre: 'Ange ou Démon', insp: 'Ange ou Démon', casa: 'Givenchy', cat: 'extractos', genero: 'ella', familia: 'ambar',
    notas: ['Mandarina', 'Azafrán', 'Lirio', 'Orquídea', 'Vainilla'],
    desc: 'Oriental y misterioso: azafrán y flores blancas sobre un fondo de vainilla. Para una salida o una fecha especial.',
    opc: extracto(22900, 5, 14900, 5), destacado: 12, nuevo: true,
  },
  {
    id: 'liquid-brun', nombre: 'Liquid Brun', insp: 'Liquid Brun', casa: 'French Avenue', cat: 'rollon', genero: 'el', familia: 'ambar',
    notas: ['Canela', 'Cardamomo', 'Praliné', 'Vainilla', 'Maderas'],
    desc: 'Canela y praliné con un fondo de maderas. Cálido y envolvente, en un roll-on que entra en cualquier bolsillo.',
    opc: unico(10, 8900, 9), destacado: 8, nuevo: true,
  },
  {
    id: 'bharara-king', nombre: 'Bharara King', insp: 'King', casa: 'Bharara', cat: 'rollon', genero: 'unisex', familia: 'fresca',
    notas: ['Naranja', 'Bergamota', 'Limón', 'Vainilla', 'Ámbar'],
    desc: 'Cítrico y luminoso, con un fondo suave de vainilla y ámbar. Fresco para el día, en formato roll-on.',
    opc: unico(10, 8900, 8), destacado: 13, nuevo: true,
  },
  {
    id: 'yara-elixir', nombre: 'Yara Elixir', insp: 'Yara Elixir', casa: 'Lattafa', cat: 'rollon', genero: 'ella', familia: 'floral',
    notas: ['Frutos rojos', 'Pera', 'Flores blancas', 'Vainilla', 'Almizcle'],
    desc: 'Frutal y floral, más intenso que el Yara clásico. Frutos rojos y flores blancas en un roll-on para retocarte cuando quieras.',
    opc: unico(10, 8900, 3), destacado: 14,
  },
  {
    id: 'aventus', nombre: 'Aventus', insp: 'Aventus', casa: 'Creed', cat: 'g6', genero: 'el', familia: 'fresca',
    notas: ['Ananá', 'Grosella negra', 'Bergamota', 'Abedul', 'Almizcle'],
    desc: 'Ananá y abedul ahumado: frutal, seco y elegante. Un ícono masculino para el día y para la noche.',
    opc: unico(100, 36900, 4), destacado: 15,
  },
  {
    id: 'la-vie-est-belle', nombre: 'La Vie Est Belle', insp: 'La Vie Est Belle', casa: 'Lancôme', cat: 'g6', genero: 'ella', familia: 'dulce',
    notas: ['Pera', 'Grosella', 'Iris', 'Jazmín', 'Praliné', 'Vainilla'],
    desc: 'Iris y praliné con un fondo de vainilla. Dulce, femenino y de esos que la gente te pregunta qué tenés puesto.',
    opc: unico(100, 32900, 5), destacado: 6,
  },
  {
    id: 'good-girl', nombre: 'Good Girl', insp: 'Good Girl', casa: 'Carolina Herrera', cat: 'g6', genero: 'ella', familia: 'floral',
    notas: ['Almendra', 'Café', 'Jazmín', 'Tuberosa', 'Cacao', 'Haba tonka'],
    desc: 'Flores blancas con café y cacao: luminoso y oscuro a la vez. Para la noche y para las fechas que se recuerdan.',
    opc: unico(100, 32900, 2), destacado: 16,
  },
  {
    id: 'baccarat-rouge-540', nombre: 'Baccarat Rouge 540', insp: 'Baccarat Rouge 540', casa: 'Maison Francis Kurkdjian', cat: 'g6', genero: 'unisex', familia: 'ambar',
    notas: ['Azafrán', 'Jazmín', 'Ámbar gris', 'Cedro', 'Resina de abeto'],
    desc: 'Azafrán, jazmín y un ámbar que deja estela. Unisex, sofisticado y con mucha presencia.',
    opc: unico(100, 36900, 3), destacado: 17,
  },
].map(p => ({ ...p, fotos: [`images/p-${p.id}.webp`] }));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const opcDe = (p, opcId) => p.opc.find(x => x.id === opcId) || p.opc[0];
const precioDesde = p => Math.min(...p.opc.map(x => x.precio));
const stockTotal = p => p.opc.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const genDe = id => GENEROS.find(g => g.id === id);
const famDe = id => FAMILIAS.find(f => f.id === id);
const necesitaOpciones = p => p.opc.length > 1;
const textoBoton = p => (necesitaOpciones(p) ? 'Elegir tamaño' : 'Agregar');
const inspDe = p => `Inspirado en ${p.insp} de ${p.casa}`;
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), genero = lista(f.genero), familia = lista(f.familia), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (genero.length && !genero.includes(p.genero)) return false;
    if (familia.length && !familia.includes(p.familia)) return false;
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
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || desempate(a, b);
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
      p.nombre, p.insp, p.casa, catDe(p.cat)?.nombre, catDe(p.cat)?.largo, genDe(p.genero)?.nombre, genDe(p.genero)?.corto,
      famDe(p.familia)?.nombre, famDe(p.familia)?.largo, ...(p.notas || []), p.desc, ...p.opc.map(x => x.nombre),
      'perfume extracto fragancia', p.nuevo ? 'nuevo novedad' : '',
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
  KEY: 'sakeperfumes_cart',
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
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  gota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/></svg>',
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

const metaDe = p => `${esc(catDe(p.cat)?.nombre || '')} · ${esc(genDe(p.genero)?.corto || '')}`;

function fotoHTML(p, clase = 'prod-foto') {
  return `<a class="${clase}" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.fotos[0])}" alt="${esc(p.nombre)}, ${esc(catDe(p.cat)?.largo.toLowerCase())}" width="1000" height="1000" decoding="async"></a>`;
}

function accionesHTML(p) {
  if (necesitaOpciones(p)) return `<button type="button" class="prod-add prod-add--opciones" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${ICONOS.gota}<span class="prod-add-txt">${textoBoton(p)}</span></button>`;
  return `<div class="stepper" data-stepper>
      <button type="button" data-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
      <output aria-label="Cantidad">1</output>
      <button type="button" data-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
    </div>
    <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICONOS.carrito}<span class="prod-add-txt">Agregar</span></button>`;
}

function cardHTML(p, anim = 'subir') {
  const inicial = anim === 'der' ? 'opacity:0;transform:translateX(40px)' : 'opacity:0;transform:translateY(32px)';
  return `<article class="prod" data-id="${esc(p.id)}" data-animate="${anim}" style="${inicial}">
    <div class="prod-media">
      ${fotoHTML(p)}
      ${sellosHTML(p) ? `<div class="prod-sellos">${sellosHTML(p)}</div>` : ''}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" tabindex="-1">${esc(p.nombre)}</a></h3>
      <p class="prod-insp">${esc(inspDe(p))}</p>
      ${precioHTML(p)}
      <div class="prod-actions">${accionesHTML(p)}</div>
    </div>
  </article>`;
}

function mosHTML(p, grande) {
  return `<article class="mos${grande ? ' mos--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(32px)">
    <div class="mos-media">
      ${fotoHTML(p, 'prod-foto mos-foto')}
      ${sellosHTML(p) ? `<div class="prod-sellos">${sellosHTML(p)}</div>` : ''}
    </div>
    <div class="mos-body">
      <div class="mos-txt">
        <h3 class="mos-nombre"><a href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" tabindex="-1">${esc(p.nombre)}</a></h3>
        <p class="mos-meta">${esc(catDe(p.cat)?.nombre)} · ${new Set(p.opc.map(x => x.precio)).size > 1 ? 'desde ' : ''}${formatearPrecio(precioDesde(p))}</p>
      </div>
      <button type="button" class="mos-add" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${necesitaOpciones(p) ? ICONOS.gota : ICONOS.carrito}</button>
    </div>
  </article>`;
}

function hallazgoHTML(p) {
  return `<article class="hallazgo" data-animate="subir" style="opacity:0;transform:translateY(24px)">
    <a class="hallazgo-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.fotos[0])}" alt="" width="1000" height="1000"></a>
    <div class="hallazgo-txt">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="hallazgo-nombre">${esc(p.nombre)}</h3>
      <p class="prod-insp">${esc(inspDe(p))}</p>
      <p class="hallazgo-notas">${esc((p.notas || []).slice(0, 3).join(' · '))}</p>
    </div>
    <div class="hallazgo-compra">
      ${precioHTML(p)}
      <button type="button" class="btn btn--cta btn--chico" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${textoBoton(p)}</button>
    </div>
  </article>`;
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    let fila = null, i = 0;
    nuevos.forEach(el => {
      const top = Math.round(el.getBoundingClientRect().top);
      if (fila !== null && Math.abs(top - fila) > 4) i = 0;
      fila = top;
      const d = Math.min(i++ * 0.08, 0.6);
      el.style.transitionDelay = `${d}s`;
      el.classList.add('in');
      setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
    });
  }));
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
  const famActual = params.get('familia');
  $('[data-menu-cats]', cont).innerHTML = CATEGORIAS.map(c => `<li><a href="${paginaCatalogo()}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="1000" height="1000"><span><strong>${esc(c.nombre)}</strong><small>${esc(c.formato)} · ${Tienda.contar({ cat: c.id })} aromas</small></span></a></li>`).join('');
  $('[data-menu-familias]', cont).innerHTML = FAMILIAS.map(f => `<li><a href="${paginaCatalogo()}?familia=${f.id}"${famActual === f.id ? ' aria-current="page"' : ''}><span><strong>${esc(f.nombre)}</strong><small>${Tienda.contar({ familia: f.id })} aromas</small></span></a></li>`).join('');
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
  $$('[data-cuenta-cat]').forEach(el => { el.textContent = `${Tienda.contar({ cat: el.dataset.cuentaCat })} aromas`; });
  $$('[data-cuenta-fam]').forEach(el => { el.textContent = `${Tienda.contar({ familia: el.dataset.cuentaFam })} aromas`; });
  $$('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar(); });
  $$('[data-desde-cat]').forEach(el => {
    const { items } = Tienda.consultar({ filtros: { cat: el.dataset.desdeCat }, orden: 'precio-asc', limite: 1 });
    if (items[0]) el.textContent = `desde ${formatearPrecio(precioDesde(items[0]))}`;
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

function opcionesHTML(p, estado, nombre) {
  if (!necesitaOpciones(p)) return '';
  const o = opcDe(p, estado.opc);
  return `<fieldset class="opciones"><legend>Tamaño</legend><div class="chips">${p.opc.map(x => `<label class="chip"><input type="radio" name="${nombre}" value="${esc(x.id)}"${x.id === o.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.nombre)} <small>${formatearPrecio(x.precio)}</small></span></label>`).join('')}</div></fieldset>`;
}

function estadoInicial(p, qty = 1) {
  const o = p.opc.find(x => x.stock > 0) || p.opc[0];
  return { p, opc: o.id, qty: Math.max(1, Math.min(qty, o.stock || 1)) };
}

function agregarConEstado(estado) {
  const p = estado.p;
  const o = opcDe(p, estado.opc);
  Cart.add(p, estado.qty, { opc: o.id });
  showToast(`${p.nombre} · ${o.nombre} al carrito`);
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
      <p class="drawer-aviso">${ICONOS.wsp}<span>Te confirmamos el pedido, el pago y el envío por WhatsApp.</span></p>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--wsp btn--block" data-pedido-wsp href="${waLink('Hola! Quiero hacer un pedido desde la web de Sake Perfumes.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
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
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.carrito}<p><strong>Tu carrito está vacío.</strong> Elegí tu aroma entre extractos, roll-on y perfumes G6.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Ver el catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.fotos[0])}" alt="" width="1000" height="1000">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${esc(catDe(l.producto.cat)?.nombre)} · ${esc(l.opcion.nombre)}</p>
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
    const texto = ['Hola! Quiero hacer este pedido en Sake Perfumes:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre} (${catDe(l.producto.cat)?.nombre} ${l.opcion.nombre}) ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
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
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle del perfume">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media" data-qv-media></div>
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
    const rel = Tienda.consultar({ filtros: { familia: p.familia, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { genero: p.genero, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const sinStock = !(o.stock > 0);
    const linea = catDe(p.cat);
    info.innerHTML = `
      <p class="qv-meta">${metaDe(p)}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-insp">${esc(inspDe(p))}</p>
      <p class="qv-precio"><strong>${formatearPrecio(o.precio)}</strong> <span>${esc(linea?.largo)} · ${esc(o.nombre)}</span></p>
      <p class="qv-desc">${esc(p.desc)}</p>
      <div class="qv-notas"><p>Notas</p><ul>${(p.notas || []).map(n => `<li>${esc(n)}</li>`).join('')}</ul></div>
      ${opcionesHTML(p, estado, 'qv-opc')}
      <p class="qv-stock">${sinStock ? 'Sin stock en este tamaño.' : o.stock <= 3 ? `Quedan ${o.stock}.` : 'En stock.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="btn btn--wsp" href="${esc(waLink(`Hola! Quiero consultar por el ${linea?.largo.toLowerCase()} ${p.nombre}.`))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Consultar por este aroma</span></a>
      <dl class="qv-ficha"><div><dt>Línea</dt><dd>${esc(linea?.largo)}</dd></div><div><dt>Presentación</dt><dd>${esc(linea?.formato)}</dd></div><div><dt>Para</dt><dd>${esc(genDe(p.genero)?.corto)}</dd></div><div><dt>Familia</dt><dd>${esc(famDe(p.familia)?.largo)}</dd></div></dl>
      <p class="qv-legal">${esc(inspDe(p))}: no es el perfume original ni está asociado a esa marca. Foto ilustrativa; precio y stock de muestra.</p>
      ${rel.length ? `<div class="qv-rel"><h3>Si te gusta, probá también</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.fotos[0])}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: `${p.nombre} — ${linea?.largo}`, description: p.desc, category: linea?.largo,
      image: p.fotos.map(f => new URL(f, location.href).href), brand: { '@type': 'Brand', name: 'Sake Perfumes' },
      offers: p.opc.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: x.precio, availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    estado = estadoInicial(p, qty);
    if (bd.hidden) opener = document.activeElement;
    media.innerHTML = `<figure class="qv-foto"><img src="${esc(p.fotos[0])}" alt="${esc(p.nombre)}, ${esc(catDe(p.cat)?.largo.toLowerCase())}" width="1000" height="1000"></figure>${sellosHTML(p) ? `<div class="prod-sellos">${sellosHTML(p)}</div>` : ''}`;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    const objetivo = foco === 'opciones' ? info.querySelector('.opciones input:checked') : null;
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
    if (e.target.closest('[data-qv-add]')) { if (agregarConEstado(estado)) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregarConEstado(estado)) { cerrar(); abrirCarrito(); } }
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

function initRailDrag(track) {
  let abajo = false, arrastro = false, x0 = 0, s0 = 0, id = null;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    abajo = true; arrastro = false; x0 = e.clientX; s0 = track.scrollLeft; id = e.pointerId;
  });
  track.addEventListener('pointermove', e => {
    if (!abajo) return;
    const dx = e.clientX - x0;
    if (!arrastro && Math.abs(dx) > 6) {
      arrastro = true;
      track.classList.add('arrastrando');
      try { track.setPointerCapture(id); } catch { /* sin captura */ }
    }
    if (arrastro) track.scrollLeft = s0 - dx;
  });
  const soltar = () => {
    if (!abajo) return;
    abajo = false;
    try { track.releasePointerCapture(id); } catch { /* sin captura */ }
    track.classList.remove('arrastrando');
    if (arrastro) setTimeout(() => { arrastro = false; }, 0);
  };
  track.addEventListener('pointerup', soltar);
  track.addEventListener('pointercancel', soltar);
  track.addEventListener('click', e => { if (arrastro) { e.preventDefault(); e.stopPropagation(); } }, true);
}

function initRails() {
  $$('[data-rail]').forEach(sec => {
    const track = $('[data-rail-track]', sec);
    if (!track) return;
    const limite = Number(track.dataset.limite) || 8;
    const excluirTop = Number(track.dataset.excluirTop) || 0;
    const excluir = excluirTop ? Tienda.consultar({ orden: 'destacados', limite: excluirTop }).items.map(p => p.id) : [];
    const { items } = Tienda.consultar({ filtros: { excluir }, orden: track.dataset.orden || 'destacados', limite });
    track.innerHTML = items.map(p => cardHTML(p, 'der')).join('');
    initRailDrag(track);
    const prev = $('[data-rail-prev]', sec);
    const next = $('[data-rail-next]', sec);
    const paso = () => {
      const card = track.querySelector('.prod');
      return card ? card.getBoundingClientRect().width + parseFloat(window.getComputedStyle(track).columnGap || 0) : track.clientWidth * 0.8;
    };
    const sync = () => {
      const pad = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = track.scrollLeft <= pad + 2;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev?.addEventListener('click', () => track.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initVista() {
  $$('[data-vista]').forEach(grid => {
    const limite = Number(grid.dataset.limite) || 8;
    const excluirTop = Number(grid.dataset.excluirTop) || 0;
    const excluir = excluirTop ? Tienda.consultar({ orden: 'destacados', limite: excluirTop }).items.map(p => p.id) : [];
    const { items } = Tienda.consultar({ filtros: { excluir }, orden: grid.dataset.orden || 'destacados', limite });
    const mosaico = grid.dataset.estilo === 'mosaico';
    const cierre = mosaico ? grid.innerHTML : '';
    grid.innerHTML = items.map((p, i) => (mosaico ? mosHTML(p, i === 0) : cardHTML(p))).join('') + cierre;
  });
}

function initEsencia() {
  const sec = document.querySelector('[data-esencia]');
  if (!sec) return;
  const form = $('[data-esencia-form]', sec);
  const input = $('#esencia-q', sec);
  const res = $('[data-esencia-res]', sec);
  const pie = $('[data-esencia-pie]', sec);
  const estado = { q: '', genero: '', familia: '' };
  const pintar = () => {
    const filtros = { genero: estado.genero || [], familia: estado.familia || [] };
    const { items } = buscarPaginado(Tienda, { q: estado.q, filtros, limite: 3 });
    const params = new URLSearchParams();
    if (estado.q) params.set('q', estado.q);
    if (estado.genero) params.set('para', estado.genero);
    if (estado.familia) params.set('familia', estado.familia);
    const total = estado.q ? null : Tienda.contar(filtros);
    if (items.length) {
      res.innerHTML = items.map(hallazgoHTML).join('');
      pie.innerHTML = `<a class="link-ver" href="${paginaCatalogo()}${params.toString() ? `?${params}` : ''}">${total != null && total > 3 ? `Ver los ${total} aromas` : 'Verlos en el catálogo'} ${ICONOS.flecha}</a><a class="link-ver link-ver--suave" href="${esc(waLink(`Hola! Busco un perfume${estado.q ? ` parecido a ${estado.q}` : ''}. ¿Qué me recomiendan?`))}" target="_blank" rel="noopener">¿Buscás otro? Preguntanos ${ICONOS.flecha}</a>`;
    } else {
      res.innerHTML = `<div class="esencia-vacio" data-animate="subir" style="opacity:0;transform:translateY(24px)"><p class="esencia-vacio-t">${estado.q ? `«${esc(estado.q)}» todavía no está en la web.` : 'No hay aromas con esa combinación.'}</p><p>El catálogo completo tiene más fragancias. Escribinos y te decimos si lo tenemos en extracto, roll-on o G6.</p><a class="btn btn--wsp" href="${esc(waLink(estado.q ? `Hola! ¿Tienen un extracto inspirado en ${estado.q}?` : 'Hola! Busco un perfume y no lo encuentro en la web. ¿Me ayudan?'))}" target="_blank" rel="noopener">${ICONOS.wsp}<span>${estado.q ? `Preguntar por ${esc(estado.q)}` : 'Preguntar por WhatsApp'}</span></a></div>`;
      pie.innerHTML = '';
    }
    revelarNuevos(res);
    refrescarScroll();
  };
  let t = 0;
  input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = input.value.trim().slice(0, 40); pintar(); }, 200); });
  form.addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = input.value.trim().slice(0, 40); pintar(); });
  form.addEventListener('change', e => {
    const k = e.target.dataset.esencia;
    if (!k) return;
    estado[k] = e.target.value;
    pintar();
  });
  $$('[data-sugerencia]', sec).forEach(b => b.addEventListener('click', () => { input.value = b.dataset.sugerencia; estado.q = b.dataset.sugerencia; pintar(); }));
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
  const pills = $('[data-pills]', app);
  const miga = document.querySelector('[data-miga]');
  const titulo = document.querySelector('[data-cat-titulo]');
  const tituloBase = titulo?.textContent || '';

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>`).join('');
  $('[data-f-grupo="genero"]', panel).innerHTML = GENEROS.map(g => `<label class="chk"><input type="checkbox" data-f="genero" value="${g.id}"><span>${esc(g.nombre)}</span><small>${Tienda.contar({ genero: g.id })}</small></label>`).join('');
  $('[data-f-grupo="familia"]', panel).innerHTML = FAMILIAS.map(f => `<label class="chk"><input type="checkbox" data-f="familia" value="${f.id}"><span>${esc(f.nombre)}</span><small>${Tienda.contar({ familia: f.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');
  if (pills) pills.innerHTML = [['', 'Todo'], ...CATEGORIAS.map(c => [c.id, c.nombre])].map(([id, t]) => `<button type="button" class="pill" data-pill="${id}" aria-pressed="false">${esc(t)}<small>${Tienda.contar(id ? { cat: id } : {})}</small></button>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    genero: validos(params.get('para'), GENEROS.map(g => g.id)),
    familia: validos(params.get('familia'), FAMILIAS.map(f => f.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    nuevo: params.get('nuevo') === '1',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, genero: estado.genero, familia: estado.familia, precio: estado.precio, nuevo: estado.nuevo });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    ['cat', 'genero', 'familia'].forEach(k => $$(`input[data-f="${k}"]`, panel).forEach(i => { i.checked = estado[k].includes(i.value); }));
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    $('input[data-f="nuevo"]', panel).checked = estado.nuevo;
    if (pills) $$('[data-pill]', pills).forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.pill ? estado.cat.length === 1 && estado.cat[0] === b.dataset.pill : !estado.cat.length)); });
    const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
    const f = estado.familia.length === 1 ? famDe(estado.familia[0]) : null;
    const actual = [c?.nombre, f?.nombre].filter(Boolean).join(' · ');
    if (miga) miga.innerHTML = actual ? `<a href="${paginaCatalogo()}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(actual)}</span>` : '<span aria-current="page">Catálogo</span>';
    if (titulo) titulo.textContent = c ? c.nombre : f ? `Aromas ${f.nombre.toLowerCase()}` : tituloBase;
    $$('[data-menu-cats] a').forEach(a => {
      const cat = new URL(a.href).searchParams.get('cat');
      if (estado.cat.length === 1 && cat === estado.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('[data-menu-familias] a').forEach(a => {
      const fam = new URL(a.href).searchParams.get('familia');
      if (estado.familia.length === 1 && fam === estado.familia[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'para', 'familia', 'precio', 'nuevo', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.cat.length) u.searchParams.set('cat', estado.cat.join(','));
    if (estado.genero.length) u.searchParams.set('para', estado.genero.join(','));
    if (estado.familia.length) u.searchParams.set('familia', estado.familia.join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.nuevo) u.searchParams.set('nuevo', '1');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.genero.map(g => ['genero', g, genDe(g).nombre]),
      ...estado.familia.map(f => ['familia', f, famDe(f).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
      ...(estado.nuevo ? [['nuevo', '', 'Lo nuevo']] : []),
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
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'aroma' : 'aromas'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay aromas con esa combinación de filtros.';
    const wspVacio = $('[data-vacio-wsp]', vacio);
    if (wspVacio) wspVacio.href = waLink(estado.q ? `Hola! ¿Tienen un extracto inspirado en ${estado.q}?` : 'Hola! Estoy buscando un perfume que no encuentro en la web.');
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], genero: [], familia: [], precio: '', nuevo: false }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'genero' || f === 'familia') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'precio') estado.precio = e.target.value;
    if (f === 'nuevo') estado.nuevo = e.target.checked;
    aplicar();
  });
  pills?.addEventListener('click', e => {
    const b = e.target.closest('[data-pill]');
    if (!b) return;
    estado.cat = b.dataset.pill ? [b.dataset.pill] : [];
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
      else if (k === 'cat' || k === 'genero' || k === 'familia') estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      else if (k === 'precio') estado.precio = '';
      else if (k === 'nuevo') estado.nuevo = false;
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  const cajon = window.matchMedia(document.body.classList.contains('m2') ? '(min-width: 0px)' : '(max-width: 1024px)');
  const cerrarPanel = () => { panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false'); bloquear(false); abrirFiltros.focus(); };
  abrirFiltros.addEventListener('click', () => {
    panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true'); bloquear(true);
    panel.querySelector('input')?.focus();
  });
  $$('[data-cerrar-filtros]', panel).forEach(b => b.addEventListener('click', cerrarPanel));
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  cajon.addEventListener('change', e => { if (!e.matches && panel.classList.contains('open')) { panel.classList.remove('open'); bloquear(false); } });

  sincronizarUI();
  pintar();
  if (location.hash === '#buscar') buscador.focus();
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const foto = hero.querySelector('.hero-foto');
  if (reduceMotion || typeof gsap === 'undefined') { foto?.classList.add('destello'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.09, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.sello'), { scale: 0.92, opacity: 0, duration: 1 }, 0.05)
    .from(hero.querySelectorAll('.eyebrow'), { y: 16, opacity: 0, duration: 0.9 }, 0.15)
    .from(hero.querySelectorAll('h1'), { y: 32, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.25)
    .from(hero.querySelectorAll('.hero-lead'), { y: 22, opacity: 0, duration: 1 }, 0.5)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.62)
    .add(() => foto?.classList.add('destello'), 0.7);
  if (typeof ScrollTrigger !== 'undefined') {
    const par = hero.querySelector('[data-parallax]');
    if (par) gsap.to(par, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
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
  initRails();
  initVista();
  initEsencia();
  initCatalogo();
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
