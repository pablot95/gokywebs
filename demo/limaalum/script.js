const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491137024768';
const MARCA = 'Lima Alum';
const POR_PAGINA = 16;
const FACTOR_A30 = 1.3;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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

const CATEGORIAS = [
  { id: 'ventanas', nombre: 'Ventanas', bajada: 'Corredizas, de abrir y paños fijos', img: 'images/ventana-corrediza-chica.webp',
    texto: 'Corredizas de 2 hojas, de abrir con paño fijo y paños fijos, en las líneas Módena y A30 New.' },
  { id: 'puertas', nombre: 'Puertas', bajada: 'Una hoja, balcón y puerta ventana', img: 'images/puerta-balcon-chica.webp',
    texto: 'Puertas de una hoja, puertas balcón y puertas ventana corredizas, con vidrio entero.' },
  { id: 'techos', nombre: 'Techos fijos y corredizos', bajada: 'Estructura de aluminio y vidrio', img: 'images/techo-corredizo-chica.webp',
    texto: 'Techos de vidrio con estructura de aluminio para patios, galerías y terrazas: fijos o que se abren.' },
  { id: 'cerramientos', nombre: 'Cerramientos', bajada: 'Galerías, balcones y boxes vidriados', img: 'images/cerramiento-chica.webp',
    texto: 'Paños corredizos y fijos de piso a techo para cerrar una galería, un balcón o un ambiente.' },
];
const LINEAS = [
  { id: 'modena', nombre: 'Módena' },
  { id: 'a30', nombre: 'A30 New' },
];
const APERTURAS = [
  { id: 'corrediza', nombre: 'Corrediza' },
  { id: 'abrir', nombre: 'De abrir' },
  { id: 'fija', nombre: 'Fija' },
];
const COLORES = [
  { id: 'blanco', nombre: 'Blanco' },
  { id: 'negro', nombre: 'Negro' },
];
const PRECIOS = [
  { id: 'hasta300', nombre: 'Hasta $300.000', min: null, max: 300000 },
  { id: '300a700', nombre: '$300.000 a $700.000', min: 300001, max: 700000 },
  { id: 'mas700', nombre: 'Más de $700.000', min: 700001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  ventanas: 'ventana ventanas abertura aberturas', puertas: 'puerta puertas abertura aberturas acceso',
  techos: 'techo techos cubierta patio galeria terraza pergola vidrio', cerramientos: 'cerramiento cerramientos galeria balcon box vidriado',
  corrediza: 'corrediza corredizo corrediza riel', abrir: 'de abrir batiente bisagra hoja', fija: 'fijo fija pano paño',
  modena: 'modena módena', a30: 'a30 a30new a30 new',
};

const m = (ancho, alto, precio) => ({ id: `${ancho}x${alto}`, ancho, alto, precio });
const Tienda = crearTienda([
  { id: 'ventana-corrediza', nombre: 'Ventana corrediza de 2 hojas', cat: 'ventanas', apertura: 'corrediza', lineas: ['modena', 'a30'], color: 'blanco',
    medidas: [m(100, 100, 189000), m(120, 110, 219000), m(150, 110, 249000), m(180, 110, 289000), m(200, 150, 369000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 1, img: 'images/ventana-corrediza.webp', chica: 'images/ventana-corrediza-chica.webp', escena: null,
    alt: 'Ventana corrediza de aluminio blanco de dos hojas en una pared clara, con árboles del otro lado',
    desc: 'Dos hojas que corren sobre el riel inferior, con cierre central y felpas en todo el contorno. Para dormitorios, cocinas y livings.' },
  { id: 'puerta-ventana-corrediza', nombre: 'Puerta ventana corrediza', cat: 'puertas', apertura: 'corrediza', lineas: ['modena', 'a30'], color: 'negro',
    medidas: [m(150, 200, 459000), m(180, 200, 519000), m(240, 200, 649000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 2, img: 'images/puerta-ventana-corrediza-cuadrada.webp', chica: 'images/puerta-ventana-corrediza-chica.webp', escena: 'images/puerta-ventana-corrediza.webp',
    alt: 'Puerta ventana corrediza de aluminio negro de dos hojas que da a una galería con jardín',
    desc: 'Dos hojas de piso a dintel que corren sobre riel para salir al patio, al balcón o a la galería. En negro como en la foto, o en blanco.' },
  { id: 'ventana-de-abrir', nombre: 'Ventana de abrir con paño fijo', cat: 'ventanas', apertura: 'abrir', lineas: ['modena', 'a30'], color: 'negro',
    medidas: [m(80, 100, 209000), m(100, 110, 249000), m(120, 120, 289000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 3, img: 'images/ventana-de-abrir.webp', chica: 'images/ventana-de-abrir-chica.webp', escena: null,
    alt: 'Ventana de aluminio negro con una hoja de abrir entreabierta al lado de un paño fijo',
    desc: 'Una hoja de abrir con bisagras y manija al lado de un paño fijo. Ventila sin ocupar riel y se limpia de los dos lados.' },
  { id: 'techo-fijo', nombre: 'Techo fijo de vidrio', cat: 'techos', apertura: 'fija', lineas: [], color: 'negro', ejes: ['Ancho', 'Salida'],
    medidas: [m(300, 200, 1290000), m(400, 300, 2190000), m(500, 300, 2690000)],
    vidrio: 'Laminado 3+3 · pendiente para el agua', rango: 4, img: 'images/techo-fijo.webp', chica: 'images/techo-fijo-chica.webp', escena: null,
    alt: 'Techo fijo de vidrio con estructura de aluminio negro sobre una galería con piso de porcelanato',
    desc: 'Vigas y columnas de aluminio con cubierta de vidrio y pendiente para el agua. Cubre el patio o la galería sin quitarle luz a la casa.' },
  { id: 'puerta-una-hoja', nombre: 'Puerta de aluminio con vidrio', cat: 'puertas', apertura: 'abrir', lineas: ['modena', 'a30'], color: 'blanco',
    medidas: [m(80, 200, 329000), m(90, 200, 359000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 5, img: 'images/puerta-una-hoja-cuadrada.webp', chica: 'images/puerta-una-hoja-chica.webp', escena: 'images/puerta-una-hoja.webp',
    alt: 'Puerta de aluminio blanco de una hoja con vidrio entero, bisagras y manija, que da a una terraza',
    desc: 'Una hoja con vidrio entero, tres bisagras y manija con cerradura. Para la salida al patio, la terraza o una entrada de servicio.' },
  { id: 'pano-fijo', nombre: 'Paño fijo', cat: 'ventanas', apertura: 'fija', lineas: ['modena', 'a30'], color: 'blanco',
    medidas: [m(100, 100, 139000), m(150, 120, 199000), m(200, 150, 269000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 6, img: 'images/pano-fijo.webp', chica: 'images/pano-fijo-chica.webp', escena: null,
    alt: 'Paño fijo de aluminio blanco con vidrio grande que muestra el cielo y un bosque',
    desc: 'Marco de aluminio con vidrio fijo para ganar luz donde no hace falta abrir: escaleras, livings, pasillos y cajas de escalera.' },
  { id: 'puerta-balcon', nombre: 'Puerta balcón de 2 hojas', cat: 'puertas', apertura: 'abrir', lineas: ['modena', 'a30'], color: 'blanco',
    medidas: [m(120, 200, 489000), m(140, 200, 539000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 7, img: 'images/puerta-balcon.webp', chica: 'images/puerta-balcon-chica.webp', escena: null,
    alt: 'Puerta balcón de aluminio blanco de dos hojas, una abierta, que da a un balcón con vista al mar',
    desc: 'Dos hojas de abrir con vidrio entero y pasadores en la hoja fija: abre todo el vano hacia el balcón o la terraza.' },
  { id: 'techo-corredizo', nombre: 'Techo corredizo de vidrio', cat: 'techos', apertura: 'corrediza', lineas: [], color: 'negro', ejes: ['Ancho', 'Salida'],
    medidas: [m(300, 300, 2490000), m(400, 300, 3290000), m(500, 400, 5390000)],
    vidrio: 'Laminado 3+3 · módulos que corren', rango: 8, img: 'images/techo-corredizo.webp', chica: 'images/techo-corredizo-chica.webp', escena: null,
    alt: 'Techo corredizo de vidrio con estructura de aluminio gris sobre un patio con sillones',
    desc: 'Módulos de vidrio que corren sobre la estructura: lo abrís los días lindos y lo cerrás cuando llueve o hace frío.' },
  { id: 'cerramiento', nombre: 'Cerramiento vidriado', cat: 'cerramientos', apertura: 'corrediza', lineas: ['modena', 'a30'], color: 'negro', ejes: ['Frente', 'Alto'],
    medidas: [m(300, 250, 1890000), m(400, 250, 2390000)],
    vidrio: 'Float 4 mm · DVH a pedido', rango: 9, img: 'images/cerramiento.webp', chica: 'images/cerramiento-chica.webp', escena: null,
    alt: 'Cerramiento vidriado de aluminio negro con paños corredizos y fijos dentro de un ambiente claro',
    desc: 'Paños corredizos y fijos de piso a techo para cerrar una galería, un balcón o un espacio interior, a la medida del lugar.' },
].map(p => ({ ...p, precio: Math.min(...p.medidas.map(x => x.precio)) })), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.desc, p.vidrio, p.medidas.map(x => `${x.ancho}x${x.alto} ${x.ancho} ${x.alto}`).join(' '),
    ETIQUETAS[p.cat] || '', ETIQUETAS[p.apertura] || '', (p.lineas || []).map(l => ETIQUETAS[l] || '').join(' '),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), linea = lista(f.linea), apertura = lista(f.apertura), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (linea.length && !linea.some(l => (p.lineas || []).includes(l))) return false;
    if (apertura.length && !apertura.includes(p.apertura)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && p.precio < f.precioMin) return false;
    if (f.precioMax != null && p.precio > f.precioMax) return false;
    return true;
  }
  function coincideTexto(p, q) {
    const palabras = norm(q).split(/\s+/).filter(Boolean);
    const texto = indice.get(p.id);
    return palabras.every(w => texto.includes(w));
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => a.precio - b.precio || desempate(a, b);
      case 'precio-desc': return (a, b) => b.precio - a.precio || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  const ordenadas = new Map();
  const ordenada = orden => {
    const o = ORDENES.some(x => x.id === orden) ? orden : 'destacados';
    if (!ordenadas.has(o)) ordenadas.set(o, [...visibles].sort(comparador(o)));
    return ordenadas.get(o);
  };
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = limitar(limite);
    const { q, ...resto } = filtros;
    const base = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = base.findIndex(p => p.id === cursor);
      i = k < 0 ? base.length : k + 1;
    }
    const items = [];
    let leidas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const quedan = items.length === lim && base.slice(i).some(p => coincideTexto(p, q));
    return { items: items.map(copia), cursor: quedan ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    const { q, ...resto } = filtros;
    return visibles.reduce((n, p) => n + (coincide(p, resto) && (!q || coincideTexto(p, q)) ? 1 : 0), 0);
  }
  function facetas(filtros = {}) {
    const lineas = {}, aperturas = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.lineas || []).forEach(l => { lineas[l] = (lineas[l] || 0) + 1; });
      aperturas[p.apertura] = (aperturas[p.apertura] || 0) + 1;
    });
    return { lineas, aperturas };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, facetas, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const medidaDe = (p, id) => p.medidas.find(x => x.id === id);
const medidaTxt = x => `${x.ancho} × ${x.alto} cm`;
const ejesDe = p => p.ejes || ['Ancho', 'Alto'];
const precioDe = (p, linea, medidaId) => {
  const x = medidaDe(p, medidaId) || p.medidas[0];
  return linea === 'a30' ? Math.ceil((x.precio * FACTOR_A30) / 1000) * 1000 : x.precio;
};
const armarOp = (linea, medida, color) => `${linea || ''}|${medida}|${color}`;
const leerOp = op => { const [linea = '', medida = '', color = ''] = String(op || '').split('|'); return { linea, medida, color }; };
const precioOp = (p, op) => { const o = leerOp(op); return precioDe(p, o.linea, o.medida); };
const lineaDefault = p => p.lineas?.[0] || '';
function opTxt(p, op) {
  const o = leerOp(op);
  const x = medidaDe(p, o.medida);
  return [o.linea ? `Línea ${nombreDe(LINEAS, o.linea)}` : '', x ? medidaTxt(x) : '', nombreDe(COLORES, o.color)].filter(Boolean).join(' · ');
}
const rangoMedidas = p => (p.medidas.length > 1 ? `${medidaTxt(p.medidas[0]).replace(' cm', '')} a ${medidaTxt(p.medidas[p.medidas.length - 1])}` : medidaTxt(p.medidas[0]));

const Cart = {
  KEY: 'limaalum_cart',
  MAX: 20,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    if (!medidaDe(producto, leerOp(op).medida)) return false;
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, this.MAX);
    else items.push({ id: producto.id, op, qty: Math.min(qty, this.MAX) });
    this.save(items);
    return true;
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, this.MAX)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.op) * i.qty : s; }, 0); },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  regla: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15.5 15.5 3 21 8.5 8.5 21z"/><path d="m7 12 2 2M10 9l1.5 1.5M13 6l2 2"/></svg>',
  ventana: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 12h18"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function lineasChips(p) {
  if (!p.lineas?.length) return '<span class="linea-chip linea-chip--techo">Estructura de aluminio</span>';
  return p.lineas.map(l => `<span class="linea-chip">${esc(nombreDe(LINEAS, l))}</span>`).join('');
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function opcionesMedida(p, elegida = '') {
  return `<option value="">Medida</option>${p.medidas.map(x => `<option value="${x.id}"${elegida === x.id ? ' selected' : ''}>${x.ancho} × ${x.alto}</option>`).join('')}`;
}
function precioCardHTML(p, medida = '') {
  const linea = lineaDefault(p);
  const x = medidaDe(p, medida);
  const nota = x ? `${linea ? `${nombreDe(LINEAS, linea)} · ` : ''}${medidaTxt(x)}` : `${p.medidas.length} medidas estándar`;
  return `<p class="precio" data-precio-card><span class="precio__desde">${x ? '' : 'desde'}</span><span class="precio__final">${formatearPrecio(x ? precioDe(p, linea, x.id) : p.precio)}</span></p><p class="precio__nota" data-precio-nota>${esc(nota)}</p>`;
}
function cardHTML(p, extra = '') {
  const nombre = esc(p.nombre);
  return `<article class="prod${extra ? ' ' + extra : ''}" data-prod="${p.id}">
    <div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a><span class="prod__lineas">${lineasChips(p)}</span></div>
    <div class="prod__body">
      <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(nombreDe(APERTURAS, p.apertura))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      ${precioCardHTML(p)}
      <div class="prod__acciones"><label class="var-sel"><span class="sr-only">Medida de ${nombre}, ${esc(ejesDe(p).join(' por ').toLowerCase())} en centímetros</span><select data-medida="${p.id}">${opcionesMedida(p)}</select></label><button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

let revealsListos = false;
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
      if (!el.getClientRects().length) { el.classList.add('in'); io.unobserve(el); return; }
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

const Capas = {
  abiertas: [],
  abrir(capa) { this.abiertas.push(capa); document.body.classList.add('no-scroll'); },
  cerrar(capa) { this.abiertas = this.abiertas.filter(c => c !== capa); if (!this.abiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll'); },
};
function enfocables(cont) {
  return [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(el => el.getClientRects().length);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = enfocables(cont);
  if (!f.length) return;
  const primero = f[0], ultimo = f[f.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 981px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!Capas.abiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, button.nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  nav.addEventListener('click', e => { if (e.target.closest('.nav-cats__panel a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initCatsMenu() {
  const params = new URLSearchParams(location.search);
  const catActual = PAGINA === 'catalogo' ? params.get('cat') : null;
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 981px)');
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = '<div class="cats-lista">' + CATEGORIAS.map(c => `
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="60" height="60" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>`).join('') + '</div>'
      + `<div class="cats-pie">${LINEAS.map(l => `<a class="cats-linea" href="${CATALOGO_URL}?linea=${l.id}">Línea ${esc(l.nombre)} <span class="cats-item__n">${Tienda.contar({ linea: l.id })}</span></a>`).join('')}<a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
    let timer = 0, porHover = 0;
    const abrir = () => { clearTimeout(timer); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(timer); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
      if (box.classList.contains('open') && Date.now() - porHover > 500) cerrar(); else abrir();
    });
    box.addEventListener('mouseenter', () => { if (hoverMq.matches && !box.classList.contains('open')) { porHover = Date.now(); abrir(); } });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(timer); timer = setTimeout(cerrar, 140); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
  });
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const n = Tienda.contar({ cat: el.dataset.catN });
    el.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`;
  });
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.querySelector('.header-search');
  if (!btn || !form) return;
  const input = form.querySelector('input');
  const cerrar = () => { form.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => {
    const abrir = form.hidden;
    form.hidden = !abrir;
    btn.setAttribute('aria-expanded', String(abrir));
    if (abrir) setTimeout(() => input?.focus(), 30);
  });
  form.addEventListener('keydown', e => { if (e.key === 'Escape') { cerrar(); btn.focus(); } });
  form.querySelector('[data-cerrar-busqueda]')?.addEventListener('click', () => { cerrar(); btn.focus(); });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero || reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  hero.querySelectorAll('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.12)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, duration: 1.1 }, 0.22)
    .from(hero.querySelectorAll('.hero-regla'), { scaleX: 0, transformOrigin: 'left center', duration: 1, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.44)
    .from(hero.querySelectorAll('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56)
    .from(hero.querySelectorAll('[data-hero-sello]'), { y: 16, opacity: 0, scale: 0.94, duration: 0.9, stagger: 0.08, clearProps: 'transform,opacity' }, 0.74);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

function initDestacados() {
  const grid = document.getElementById('destacadosGrid');
  if (!grid) return;
  grid.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 6 }).items
    .map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join('');
}

function initAberturas() {
  const box = document.getElementById('aberturas');
  if (!box) return;
  const tabsBox = box.querySelector('[role="tablist"]');
  const panel = document.getElementById('aberturasPanel');
  const foto = document.getElementById('aberturasFoto');
  const fotoImg = foto?.querySelector('img');
  const fotoTxt = foto?.querySelector('[data-foto-txt]');
  const estado = { i: 0 };
  tabsBox.innerHTML = CATEGORIAS.map((c, k) => `<button type="button" role="tab" class="ab-tab" id="ab-tab-${c.id}" aria-controls="aberturasPanel" aria-selected="${k === 0}" tabindex="${k === 0 ? 0 : -1}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></button>`).join('');
  const tabs = [...tabsBox.querySelectorAll('[role="tab"]')];
  const mostrarFoto = p => {
    if (!fotoImg || !p) return;
    if (fotoImg.getAttribute('src') !== p.img) {
      fotoImg.classList.remove('cambia'); void fotoImg.offsetWidth; fotoImg.classList.add('cambia');
      fotoImg.src = p.img;
    }
    fotoImg.alt = p.alt;
    if (fotoTxt) fotoTxt.textContent = `${p.nombre} · desde ${formatearPrecio(p.precio)}`;
    panel.querySelectorAll('.fila').forEach(f => f.classList.toggle('activa', f.dataset.fila === p.id));
  };
  function render() {
    const cat = CATEGORIAS[estado.i];
    const items = Tienda.consultar({ filtros: { cat: cat.id }, orden: 'destacados', limite: 8 }).items;
    panel.setAttribute('aria-labelledby', `ab-tab-${cat.id}`);
    panel.innerHTML = `<ol class="filas">${items.map((p, k) => `<li class="fila" data-fila="${p.id}" data-animate="subir" style="opacity:0;transform:translateY(24px)">
        <a class="fila__link" href="${urlProducto(p)}" data-qv="${p.id}">
          <span class="fila__n">${String(k + 1).padStart(2, '0')}</span>
          <span class="fila__mini"><img src="${p.chica}" alt="" width="120" height="120" decoding="async"></span>
          <span class="fila__txt"><span class="fila__nombre">${esc(p.nombre)}</span><span class="fila__medidas">${p.medidas.length} medidas · ${esc(rangoMedidas(p))}</span><span class="fila__lineas">${lineasChips(p)}</span></span>
          <span class="fila__precio"><small>desde</small>${formatearPrecio(p.precio)}</span>
          <span class="fila__ir">Elegir medida${ICON.flecha}</span>
        </a>
      </li>`).join('')}</ol>
      <a class="link-flecha" href="${CATALOGO_URL}?cat=${cat.id}">Ver ${esc(cat.nombre.toLowerCase())} en el catálogo${ICON.flecha}</a>`;
    mostrarFoto(items[0]);
    revelarNuevos(panel);
    refrescarTriggers();
  }
  function elegir(k, foco) {
    estado.i = (k + CATEGORIAS.length) % CATEGORIAS.length;
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(j === estado.i)); t.tabIndex = j === estado.i ? 0 : -1; });
    render();
    if (foco) tabs[estado.i].focus();
  }
  tabsBox.addEventListener('click', e => { const t = e.target.closest('[role="tab"]'); if (t) elegir(tabs.indexOf(t)); });
  tabsBox.addEventListener('keydown', e => {
    const k = tabs.indexOf(document.activeElement);
    if (k < 0) return;
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); elegir(k + 1, true); }
    else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); elegir(k - 1, true); }
    else if (e.key === 'Home') { e.preventDefault(); elegir(0, true); }
    else if (e.key === 'End') { e.preventDefault(); elegir(CATEGORIAS.length - 1, true); }
  });
  const sobre = e => { const f = e.target.closest('.fila'); if (f) mostrarFoto(getProducto(f.dataset.fila)); };
  panel.addEventListener('mouseover', sobre);
  panel.addEventListener('focusin', sobre);
  render();
}

function initCalc() {
  const box = document.getElementById('calcTecho');
  if (!box) return;
  const estado = { tipo: 'corredizo', ancho: 4, salida: 3, abierto: false };
  const PRECIO_M2 = { fijo: 215000, corredizo: 275000 };
  const FOTO = { fijo: 'images/techo-fijo-chica.webp', corredizo: 'images/techo-corredizo-chica.webp' };
  const $ = s => box.querySelector(s);
  const tipos = [...box.querySelectorAll('[data-tipo]')];
  const rAncho = $('#calcAncho'), rSalida = $('#calcSalida');
  const area = $('.plano__area'), mods = $('.plano__mods'), cols = $('.plano__cols');
  const lienzo = $('.plano__lienzo');
  const abrirBtn = $('[data-abrir-techo]');
  const num = n => n.toLocaleString('es-AR', { maximumFractionDigits: 2 });
  const calcular = () => {
    const m2 = Math.round(estado.ancho * estado.salida * 100) / 100;
    const modulos = estado.tipo === 'fijo' ? Math.ceil(estado.ancho / 1) : Math.max(2, Math.ceil(estado.ancho / 1.25));
    const columnas = Math.ceil(estado.ancho / 3) + 1;
    const precio = Math.round((m2 * PRECIO_M2[estado.tipo]) / 1000) * 1000;
    return { m2, modulos, columnas, precio };
  };
  function dibujar(r) {
    if (!lienzo || !area) return;
    const W = lienzo.clientWidth - 110, H = lienzo.clientHeight - 100;
    const esc2 = Math.min(W / estado.ancho, H / estado.salida);
    const aw = Math.round(estado.ancho * esc2);
    area.style.width = `${aw}px`;
    area.style.height = `${Math.round(estado.salida * esc2)}px`;
    lienzo.style.setProperty('--aw', `${aw}px`);
    mods.style.gridTemplateColumns = `repeat(${r.modulos}, minmax(0, 1fr))`;
    mods.innerHTML = Array.from({ length: r.modulos }, (_, i) => `<span class="mod${estado.tipo === 'corredizo' && estado.abierto && i % 2 === 0 ? ' mod--abierto' : ''}"></span>`).join('');
    cols.innerHTML = Array.from({ length: r.columnas }, (_, i) => `<span style="left:${(i / (r.columnas - 1)) * 100}%"></span>`).join('');
    $('[data-cota-ancho]').textContent = `${num(estado.ancho)} m`;
    $('[data-cota-salida]').textContent = `${num(estado.salida)} m`;
  }
  function render() {
    const r = calcular();
    tipos.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tipo === estado.tipo)));
    box.classList.toggle('es-fijo', estado.tipo === 'fijo');
    $('[data-out-ancho]').textContent = `${num(estado.ancho)} m`;
    $('[data-out-salida]').textContent = `${num(estado.salida)} m`;
    $('[data-res-m2]').textContent = `${num(r.m2)} m²`;
    $('[data-res-mod]').textContent = `${r.modulos} ${estado.tipo === 'fijo' ? 'paños fijos' : 'módulos que corren'}`;
    $('[data-res-col]').textContent = `${r.columnas} columnas al frente`;
    $('[data-res-precio]').textContent = formatearPrecio(r.precio);
    const tipoTxt = estado.tipo === 'fijo' ? 'fijo' : 'corredizo';
    const msg = `Hola ${MARCA}! Quiero presupuesto para un techo ${tipoTxt} de vidrio de ${num(estado.ancho)} m de ancho por ${num(estado.salida)} m de salida (${num(r.m2)} m²). La calculadora de la web me dio unos ${formatearPrecio(r.precio)}.`;
    $('[data-calc-wsp]').href = wspHref(msg);
    const img = $('[data-calc-foto] img');
    if (img && img.getAttribute('src') !== FOTO[estado.tipo]) img.src = FOTO[estado.tipo];
    if (abrirBtn) {
      abrirBtn.hidden = estado.tipo !== 'corredizo';
      abrirBtn.setAttribute('aria-pressed', String(estado.abierto));
      abrirBtn.querySelector('span').textContent = estado.abierto ? 'Cerrar el techo' : 'Abrir el techo';
    }
    dibujar(r);
  }
  tipos.forEach(b => b.addEventListener('click', () => { estado.tipo = b.dataset.tipo; if (estado.tipo === 'fijo') estado.abierto = false; render(); }));
  const pintarRango = el => { el.style.setProperty('--p', `${((el.value - el.min) / (el.max - el.min)) * 100}%`); };
  rAncho.addEventListener('input', () => { estado.ancho = Number(rAncho.value); pintarRango(rAncho); render(); });
  rSalida.addEventListener('input', () => { estado.salida = Number(rSalida.value); pintarRango(rSalida); render(); });
  abrirBtn?.addEventListener('click', () => { estado.abierto = !estado.abierto; render(); });
  pintarRango(rAncho); pintarRango(rSalida);
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => dibujar(calcular()), 120); }, { passive: true });
  render();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const crear = () => {
    const centro = [-34.62172, -58.38153];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: false, attributionControl: true }).setView(centro, 16);
    L.control.zoom({ position: 'topright' }).addTo(mapa);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    const icono = L.divIcon({ className: '', html: '<span class="pin-lima"></span>', iconSize: [26, 26], iconAnchor: [13, 13] });
    L.marker(centro, { icon: icono, title: 'Lima Alum, Lima 1165, Constitución', keyboard: false }).addTo(mapa);
    setTimeout(() => mapa.invalidateSize(), 400);
    window.addEventListener('load', () => mapa.invalidateSize());
  };
  if (!('IntersectionObserver' in window)) { crear(); return; }
  const io = new IntersectionObserver(es => {
    if (es.some(x => x.isIntersecting)) { io.disconnect(); crear(); }
  }, { rootMargin: '400px 0px' });
  io.observe(el);
}

const QV = { p: null, linea: '', medida: '', color: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Foto completa: ${p.alt}` });
  const actual = fotos[QV.foto] || fotos[0];
  const forma = actual.src === p.escena ? (p.escena.includes('una-hoja') ? ' qv__principal--alta' : ' qv__principal--ancha') : '';
  const x = medidaDe(p, QV.medida);
  const op = x ? armarOp(QV.linea, x.id, QV.color) : '';
  const ejes = ejesDe(p);
  const msgOtra = `Hola ${MARCA}! Quiero presupuesto de ${p.nombre}${QV.linea ? ` en línea ${nombreDe(LINEAS, QV.linea)}` : ''}, color ${nombreDe(COLORES, QV.color).toLowerCase()}, en otra medida: ${ejes[0].toLowerCase()} ___ cm × ${ejes[1].toLowerCase()} ___ cm.`;
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual.src}" alt="${esc(actual.alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver la foto completa' : 'Ver la foto del producto'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(cat?.nombre || '')} · ${esc(nombreDe(APERTURAS, p.apertura))}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="precio"><span class="precio__desde">${x ? '' : 'desde'}</span><span class="precio__final">${formatearPrecio(x ? precioDe(p, QV.linea, x.id) : precioDe(p, QV.linea, p.medidas[0].id))}</span></p>
        <p class="qv__elegido">${x ? esc(opTxt(p, op)) : 'Elegí la medida para ver el precio exacto.'}</p>
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.lineas.length ? `<div class="qv__grupo"><p class="f-grupo__titulo">Línea</p><div class="qv__seg" role="group" aria-label="Elegí la línea">${p.lineas.map(l => `<button type="button" class="qv__op qv__op--linea" data-qv-linea="${l}" aria-pressed="${QV.linea === l}"><strong>${esc(nombreDe(LINEAS, l))}</strong><small>${l === 'a30' ? 'Perfil más robusto' : 'La tradicional'}</small></button>`).join('')}</div></div>` : ''}
        <div class="qv__grupo"><p class="f-grupo__titulo">Medida · ${esc(ejes.join(' × ').toLowerCase())}</p>
          <div class="qv__medidas-ops" role="group" aria-label="Elegí la medida">${p.medidas.map(o => `<button type="button" class="qv__op qv__op--medida" data-qv-medida="${o.id}" aria-pressed="${QV.medida === o.id}"><span>${o.ancho} × ${o.alto}<small> cm</small></span><small>${formatearPrecio(precioDe(p, QV.linea, o.id))}</small></button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>
        <div class="qv__grupo"><p class="f-grupo__titulo">Color del aluminio</p>
          <div class="qv__colores" role="group" aria-label="Elegí el color">${COLORES.map(c => `<button type="button" class="qv__color" data-qv-color="${c.id}" aria-pressed="${QV.color === c.id}"><i class="swatch swatch--${c.id}" aria-hidden="true"></i>${esc(c.nombre)}</button>`).join('')}</div>
        </div>
        <div class="qv__compra">
          ${stepperHTML(Cart.MAX)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <dl class="qv__ficha"><div><dt>Apertura</dt><dd>${esc(nombreDe(APERTURAS, p.apertura))}</dd></div><div><dt>Vidrio</dt><dd>${esc(p.vidrio)}</dd></div><div><dt>Líneas</dt><dd>${p.lineas.length ? esc(p.lineas.map(l => nombreDe(LINEAS, l)).join(' o ')) : 'Estructura de aluminio'}</dd></div></dl>
        <details class="qv__medir">
          <summary>${ICON.regla}Cómo medir el vano</summary>
          <ol>
            <li>Medí el ${esc(ejes[0].toLowerCase())} arriba, al medio y abajo, y quedate con la medida más chica.</li>
            <li>Hacé lo mismo con el ${esc(ejes[1].toLowerCase())}, a la izquierda, al centro y a la derecha.</li>
            <li>Anotá las medidas en centímetros y mandanos una foto del lugar: con eso te confirmamos la medida estándar o te cotizamos una a medida.</li>
          </ol>
        </details>
        <a class="qv__wsp" href="${wspHref(msgOtra)}" target="_blank" rel="noopener">${ICON.wsp}¿Otra medida? Pedí presupuesto a medida</a>
        ${rel.length ? `<div class="qv__rel"><h3>Más ${esc(cat?.nombre?.toLowerCase() || 'productos')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.chica}" alt="" width="200" height="200"></span><span>${esc(r.nombre)}</span><span class="precio__final">desde ${formatearPrecio(r.precio)}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, material: 'Aluminio',
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: p.precio, highPrice: precioDe(p, p.lineas.includes('a30') ? 'a30' : '', p.medidas[p.medidas.length - 1].id), offerCount: p.medidas.length * Math.max(p.lineas.length, 1), availability: 'https://schema.org/InStock' },
  });
}
function abrirQV(id, opener, medida = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p;
  QV.linea = lineaDefault(p);
  QV.medida = medidaDe(p, medida) ? medida : '';
  QV.color = p.color;
  QV.foto = 0;
  if (!yaAbierto) QV.opener = opener || document.activeElement;
  renderQV();
  modal.querySelector('.qv__panel')?.scrollTo(0, 0);
  if (!yaAbierto) {
    modal.hidden = false;
    Capas.abrir(modal);
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('open')));
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
}
function cerrarQV() {
  const modal = document.getElementById('quickView');
  if (!modal || modal.hidden) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 320);
  Capas.cerrar(modal);
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  QV.opener?.focus?.();
}
function initQV() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const repintar = sel => {
    const abiertas = modal.querySelector('.qv__medir')?.open;
    const qty = modal.querySelector('.qv__compra output')?.textContent;
    renderQV();
    if (abiertas) modal.querySelector('.qv__medir').open = true;
    if (qty && Number(qty) > 1) {
      const st = modal.querySelector('.qv__compra [data-stepper]');
      st.querySelector('output').textContent = qty;
      st.querySelector('[data-menos]').disabled = false;
    }
    if (sel) modal.querySelector(sel)?.focus();
  };
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); repintar(`[data-qv-foto="${QV.foto}"]`); return; }
    const li = e.target.closest('[data-qv-linea]');
    if (li) { QV.linea = li.dataset.qvLinea; repintar(`[data-qv-linea="${QV.linea}"]`); return; }
    const me = e.target.closest('[data-qv-medida]');
    if (me) { QV.medida = me.dataset.qvMedida; repintar(`[data-qv-medida="${QV.medida}"]`); return; }
    const co = e.target.closest('[data-qv-color]');
    if (co) { QV.color = co.dataset.qvColor; repintar(`[data-qv-color="${QV.color}"]`); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (!QV.medida) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = 'Elegí una medida para sumarla al carrito.';
        modal.querySelector('[data-qv-medida]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      const op = armarOp(QV.linea, QV.medida, QV.color);
      Cart.add(p, qty, op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre} (${opTxt(p, op)}) al carrito.`);
    }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarQV(); }
    atraparFoco(modal, e);
  });
}

function lineaHTML(i) {
  const p = getProducto(i.id);
  if (!p) return '';
  const op = i.op || '';
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.chica}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${esc(opTxt(p, op))} · ${formatearPrecio(precioOp(p, op))} c/u</p>
      ${stepperHTML(Cart.MAX, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioOp(p, op) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => { const p = getProducto(i.id); return p && medidaDe(p, leerOp(i.op).medida); });
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.ventana}<p>Tu carrito está vacío. Elegí una abertura, su medida y la línea, y la sumás acá.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Ver el catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre} (${opTxt(p, i.op)}): ${formatearPrecio(precioOp(p, i.op) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, '¿Me confirman la entrega y la colocación?'].join('\n');
  const wsp = document.getElementById('cartWsp');
  if (wsp) wsp.href = wspHref(texto);
}
let cartOpener = null;
function abrirCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || !d.hidden) return;
  cartOpener = document.activeElement;
  renderCarrito();
  d.hidden = false;
  Capas.abrir(d);
  requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add('open')));
  setTimeout(() => d.querySelector('.drawer__head .icon-btn')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('cartDrawer');
  if (!d || d.hidden) return;
  d.classList.remove('open');
  setTimeout(() => { d.hidden = true; }, reduceMotion ? 0 : 380);
  Capas.cerrar(d);
  cartOpener?.focus?.();
}
function initCarrito() {
  const d = document.getElementById('cartDrawer');
  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-carrito]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || '';
    const it = Cart.get().find(i => i.id === id && (i.op || '') === op);
    if (e.target.closest('[data-quitar]')) { Cart.remove(id, op); return; }
    if (it && e.target.closest('[data-mas]')) Cart.setQty(id, op, it.qty + 1);
    if (it && e.target.closest('[data-menos]')) Cart.setQty(id, op, it.qty - 1);
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarCarrito(); }
    atraparFoco(d, e);
  });
  document.getElementById('checkoutBtn')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initAcciones() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-medida]');
    if (!sel) return;
    const p = getProducto(sel.dataset.medida);
    const card = sel.closest('.prod');
    if (!p || !card) return;
    const precio = card.querySelector('[data-precio-card]');
    const nota = card.querySelector('[data-precio-nota]');
    if (precio && nota) {
      const tmp = document.createElement('div');
      tmp.innerHTML = precioCardHTML(p, sel.value);
      precio.replaceWith(tmp.firstElementChild);
      nota.replaceWith(tmp.lastElementChild);
    }
  });
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) {
      e.preventDefault();
      const sel = qv.closest('.prod')?.querySelector('[data-medida]');
      abrirQV(qv.dataset.qv, qv, sel?.value || '');
      return;
    }
    const st = e.target.closest('[data-stepper]');
    if (st && !e.target.closest('[data-linea]')) {
      const out = st.querySelector('output');
      const max = Number(st.dataset.max) || 99;
      let v = Number(out.textContent) || 1;
      if (e.target.closest('[data-mas]')) v = Math.min(v + 1, max);
      else if (e.target.closest('[data-menos]')) v = Math.max(v - 1, 1);
      else return;
      out.textContent = v;
      st.querySelector('[data-menos]').disabled = v <= 1;
      st.querySelector('[data-mas]').disabled = v >= max;
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const medida = add.closest('.prod__acciones')?.querySelector('[data-medida]')?.value || '';
      if (!medida) { abrirQV(p.id, add); return; }
      const op = armarOp(lineaDefault(p), medida, p.color);
      Cart.add(p, 1, op);
      showToast(`Sumaste ${p.nombre} (${opTxt(p, op)}) al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const medida = comprar.closest('.prod__body')?.querySelector('[data-medida]')?.value || '';
      if (!medida) { abrirQV(p.id, comprar); return; }
      Cart.add(p, 1, armarOp(lineaDefault(p), medida, p.color));
      abrirCarrito();
    }
  });
}

function syncModelosLink() {
  const otro = document.querySelector('.gw-modelos__btn:not([aria-current])');
  if (!otro || PAGINA !== 'catalogo') return;
  otro.href = `${MODELO === '2' ? 'catalogo.html' : 'catalogo-2.html'}${location.search}`;
}

function initCatalogo() {
  const grid = document.getElementById('catalogoGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valido = (v, arr) => (arr.some(x => (x.id ?? x) === v) ? v : '');
  const multi = (clave, arr) => (params.get(clave) || '').split(',').filter(v => arr.some(x => (x.id ?? x) === v));
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), linea: multi('linea', LINEAS), apertura: multi('apertura', APERTURAS),
    precio: valido(params.get('precio'), PRECIOS), orden: valido(params.get('orden'), ORDENES) || 'destacados',
    q: (params.get('q') || '').trim().slice(0, 60),
  };

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.linea.length) f.linea = e.linea;
    if (e.apertura.length) f.apertura = e.apertura;
    const r = PRECIOS.find(x => x.id === e.precio);
    if (r) { f.precioMin = r.min; f.precioMax = r.max; }
    if (e.q) f.q = e.q;
    return f;
  };
  const opcion = (tipo, nombre, valor, etiqueta, marcado, n, grupo) => `<label class="f-op"><input type="${tipo}" name="${nombre}" value="${valor}" data-f="${grupo}"${marcado ? ' checked' : ''}><span>${etiqueta}</span>${n != null ? `<small>${n}</small>` : ''}</label>`;
  function pintarFiltros() {
    const base = e.cat ? { cat: e.cat } : {};
    const fac = Tienda.facetas(base);
    const grupos = [];
    grupos.push(`<fieldset class="f-grupo"><legend>Categoría</legend>
      ${opcion('radio', 'cat', '', 'Todo el catálogo', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    const lineas = LINEAS.filter(l => fac.lineas[l.id] || e.linea.includes(l.id));
    if (lineas.length) grupos.push(`<fieldset class="f-grupo"><legend>Línea</legend>
      ${lineas.map(l => opcion('checkbox', `linea-${l.id}`, l.id, esc(l.nombre), e.linea.includes(l.id), fac.lineas[l.id] || 0, 'linea')).join('')}</fieldset>`);
    const aperturas = APERTURAS.filter(a => fac.aperturas[a.id] || e.apertura.includes(a.id));
    if (aperturas.length) grupos.push(`<fieldset class="f-grupo"><legend>Apertura</legend>
      ${aperturas.map(a => opcion('checkbox', `apertura-${a.id}`, a.id, esc(a.nombre), e.apertura.includes(a.id), fac.aperturas[a.id] || 0, 'apertura')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio desde</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const soloLinea = !cat && e.linea.length === 1 ? LINEAS.find(l => l.id === e.linea[0]) : null;
    const titulo = cat ? cat.nombre : soloLinea ? `Línea ${soloLinea.nombre}` : 'Todo el catálogo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : soloLinea ? `Aberturas que fabricamos en la línea ${soloLinea.nombre}. Elegí la medida y el color en cada una.` : 'Ventanas, puertas, techos y cerramientos de aluminio con medidas estándar y precio. ¿Tu vano es otro? Te lo cotizamos a medida.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      miga.hidden = !cat; if (migaSep) migaSep.hidden = !cat;
      miga.textContent = cat ? cat.nombre : '';
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : CATALOGO_URL;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.linea.forEach(v => quitar.push(['linea', v, `Línea ${nombreDe(LINEAS, v)}`]));
    e.apertura.forEach(v => quitar.push(['apertura', v, nombreDe(APERTURAS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'linea', 'apertura', 'precio', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.linea.length) u.searchParams.set('linea', e.linea.join(','));
    if (e.apertura.length) u.searchParams.set('apertura', e.apertura.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li data-animate="subir" style="opacity:0;transform:translateY(40px)">${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    contador.textContent = `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = total > 0;
    grid.hidden = total === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = total === 0;
    mostrando.textContent = `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    pintarFiltros();
    pintarCabecera();
    pintarActivos();
    syncURL();
    pintar(true);
  }

  orden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${o.nombre}</option>`).join('');
  buscar.value = e.q;
  aplicar();

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') e.cat = inp.value;
    else if (grupo === 'precio') e.precio = inp.value;
    else {
      const set = new Set(e[grupo]);
      if (inp.checked) set.add(inp.value); else set.delete(inp.value);
      e[grupo] = [...set];
    }
    aplicar();
  });
  form.addEventListener('submit', ev => ev.preventDefault());
  let t = 0;
  const leerBusqueda = v => { e.q = v.trim().slice(0, 60); aplicar(); };
  buscar.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => leerBusqueda(buscar.value), 250); });
  buscar.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(t); leerBusqueda(buscar.value); });
  document.querySelectorAll('.header-search').forEach(f => f.addEventListener('submit', ev => {
    ev.preventDefault();
    const v = f.querySelector('input')?.value || '';
    buscar.value = v;
    leerBusqueda(v);
    f.hidden = true;
    document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.linea = []; e.apertura = []; e.precio = ''; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-todo, .cats-linea, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.linea = (u.searchParams.get('linea') || '').split(',').filter(v => LINEAS.some(l => l.id === v));
    e.apertura = []; e.precio = ''; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  initFiltrosDrawer(form);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
}

function initFiltrosDrawer(form) {
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  if (!form || !abrirBtn) return;
  const mq = window.matchMedia('(max-width: 1024px)');
  let bd = document.querySelector('.filtros-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'filtros-backdrop'; document.body.appendChild(bd); }
  const esDrawer = () => MODELO === '2' || mq.matches;
  const modo = () => {
    const d = esDrawer();
    form.classList.toggle('es-drawer', d);
    if (d) { form.setAttribute('role', 'dialog'); form.setAttribute('aria-modal', 'true'); if (!form.classList.contains('open')) form.setAttribute('inert', ''); }
    else { form.removeAttribute('role'); form.removeAttribute('aria-modal'); form.removeAttribute('inert'); cerrar(); }
  };
  const abrir = () => {
    form.classList.add('open'); bd.classList.add('open'); form.removeAttribute('inert');
    abrirBtn.setAttribute('aria-expanded', 'true'); Capas.abrir(form);
    setTimeout(() => form.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  function cerrar() {
    if (!form.classList.contains('open')) return;
    form.classList.remove('open'); bd.classList.remove('open');
    if (esDrawer()) form.setAttribute('inert', '');
    abrirBtn.setAttribute('aria-expanded', 'false'); Capas.cerrar(form);
    abrirBtn.focus();
  }
  abrirBtn.addEventListener('click', abrir);
  bd.addEventListener('click', cerrar);
  form.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrar));
  form.addEventListener('keydown', ev => {
    if (!form.classList.contains('open')) return;
    if (ev.key === 'Escape') cerrar();
    atraparFoco(form, ev);
  });
  mq.addEventListener('change', modo);
  form.style.transition = 'none';
  modo();
  void form.offsetWidth;
  requestAnimationFrame(() => { form.style.transition = ''; });
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

document.addEventListener('cart:updated', updateCartBadge);

[initCatsMenu, initDestacados, initAberturas, initCatalogo, initCalc, initReveals, initNav, initBuscadorHeader, initHeroMotion, initParallax,
  initMapa, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
