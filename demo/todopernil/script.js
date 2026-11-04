const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491158430652';
const MARCA = 'Todo Pernil';
const POR_PAGINA = 16;
const MAX_CANT = 30;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const UBICACION = { lat: -34.6037, lng: -58.3816 };
const HORARIO = { normal: [9 * 60, 21 * 60 + 30], feriado: [12 * 60, 20 * 60] };
const FERIADOS = ['2026-01-01', '2026-02-16', '2026-02-17', '2026-03-24', '2026-04-02', '2026-04-03', '2026-05-01', '2026-05-25', '2026-06-15', '2026-06-20', '2026-07-09', '2026-08-17', '2026-10-12', '2026-11-23', '2026-12-08', '2026-12-25', '2027-01-01'];

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

const CATEGORIAS = [
  { id: 'perniles', nombre: 'Perniles', bajada: 'Cerdo, novillo y cordero', img: 'images/cat-perniles.webp', lado: 400 },
  { id: 'ribs', nombre: 'Ribs y sándwiches', bajada: 'A la barbacoa y de pernil', img: 'images/p-ribs.webp', lado: 800 },
  { id: 'empanadas', nombre: 'Empanadas', bajada: 'Por docena o media', img: 'images/p-emp-surtidas.webp', lado: 800 },
  { id: 'extras', nombre: 'Pancitos y salsas', bajada: 'Para sumar al pedido', img: 'images/cat-extras.webp', lado: 400 },
];
const VENTAS = [
  { id: 'personas', nombre: 'Por cantidad de personas' },
  { id: 'docena', nombre: 'Por docena' },
  { id: 'unidad', nombre: 'Por unidad' },
];
const MOMENTOS = [
  { id: 'fiesta', nombre: 'Fiestas y eventos' },
  { id: 'reunion', nombre: 'Reunión en casa' },
  { id: 'dia', nombre: 'Para el día' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Desde menos de $10.000', min: null, max: 10000 },
  { id: '10a50', nombre: 'Desde $10.001 a $50.000', min: 10001, max: 50000 },
  { id: 'mas50', nombre: 'Desde más de $50.000', min: 50001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const op = (id, nombre, corto, precio, extra = {}) => ({ id, nombre, corto, precio, ...extra });
const SALSAS = ['Criolla', 'Tártara', 'Barbacoa', 'Cebolla caramelizada', 'Mostaza y miel', 'Chimichurri', 'Mayonesa de finas hierbas'];
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

const PRODUCTOS = [
  { id: 'pernil-cerdo', nombre: 'Pernil de cerdo', cat: 'perniles', venta: 'personas', momento: ['fiesta'], rango: 1, etiqueta: 'El clásico', carne: 'cerdo',
    ops: [op('25', '25 personas · 100 pancitos y 3 salsas', '25 personas', 98000, { personas: 25, pancitos: 100, salsas: 3 }), op('35', '35 personas · 140 pancitos y 4 salsas', '35 personas', 128000, { personas: 35, pancitos: 140, salsas: 4 }), op('50', '50 personas · 200 pancitos y 5 salsas', '50 personas', 170000, { personas: 50, pancitos: 200, salsas: 5 })], def: '35',
    img: { src: 'images/p-pernil-cerdo.webp', lado: 800, alt: 'Pernil de cerdo dorado al horno sobre una tabla, con fetas cortadas y papas' },
    corta: 'Con pancitos y salsas, listo para cortar.',
    desc: 'Pata de cerdo al horno, dorada y jugosa, envuelta y con su etiqueta. Llega con los pancitos y las salsas en potes, para armar en la mesa.',
    claves: ['pata', 'chancho', 'cerdo', 'fiesta', 'evento', 'cumpleaños', 'casamiento', 'pancitos', 'salsas'] },
  { id: 'pernil-novillo', nombre: 'Pernil de novillo', cat: 'perniles', venta: 'personas', momento: ['fiesta'], rango: 2, etiqueta: 'Para muchos', carne: 'novillo',
    ops: [op('40', '40 personas · 160 pancitos y 4 salsas', '40 personas', 165000, { personas: 40, pancitos: 160, salsas: 4 }), op('60', '60 personas · 240 pancitos y 5 salsas', '60 personas', 230000, { personas: 60, pancitos: 240, salsas: 5 }), op('80', '80 personas · 320 pancitos y 6 salsas', '80 personas', 295000, { personas: 80, pancitos: 320, salsas: 6 })], def: '60',
    img: { src: 'images/p-pernil-novillo.webp', lado: 800, alt: 'Pernil de novillo al horno cortado en fetas sobre una fuente, con pancitos' },
    corta: 'Pata de ternera para las fiestas grandes.',
    desc: 'Pata de novillo (ternera) al horno, para cortar en fetas finas. Llega con pancitos y salsas en potes: la opción para las fiestas con muchos invitados.',
    claves: ['pata', 'ternera', 'vaca', 'novillo', 'fiesta', 'evento', 'casamiento', 'quince', 'pancitos'] },
  { id: 'pernil-cordero', nombre: 'Pernil de cordero', cat: 'perniles', venta: 'personas', momento: ['fiesta', 'reunion'], rango: 3, etiqueta: '', carne: 'cordero',
    ops: [op('15', '15 personas · 60 pancitos y 2 salsas', '15 personas', 88000, { personas: 15, pancitos: 60, salsas: 2 }), op('25', '25 personas · 100 pancitos y 3 salsas', '25 personas', 135000, { personas: 25, pancitos: 100, salsas: 3 })], def: '15',
    img: { src: 'images/p-pernil-cordero.webp', lado: 800, alt: 'Pernil de cordero al horno con romero, papas, zanahorias y cebollas' },
    corta: 'Con romero, para una reunión distinta.',
    desc: 'Pernil de cordero al horno con romero. Para una reunión más chica o para sumar a la mesa del pernil de cerdo. Con pancitos y salsas.',
    claves: ['cordero', 'oveja', 'romero', 'reunion', 'fiesta', 'pancitos'] },
  { id: 'ribs', nombre: 'Ribs a la barbacoa', cat: 'ribs', venta: 'personas', momento: ['reunion', 'dia'], rango: 4, etiqueta: '',
    ops: [op('1', '1 costillar · 2 a 3 personas', '1 costillar', 27000), op('3', '3 costillares · 6 a 8 personas', '3 costillares', 76000)], def: '1',
    img: { src: 'images/p-ribs.webp', lado: 800, alt: 'Costillas de cerdo glaseadas con salsa barbacoa en un plato blanco' },
    corta: 'Costillas de cerdo en su salsa.',
    desc: 'Costillas de cerdo cocidas despacio y pintadas con salsa barbacoa. Por costillar, para una cena o para sumar a la fiesta.',
    claves: ['costillas', 'ribs', 'barbacoa', 'bbq', 'cerdo', 'cena'] },
  { id: 'sandwich-pernil', nombre: 'Sándwich de pernil', cat: 'ribs', venta: 'unidad', momento: ['dia'], rango: 7, etiqueta: '',
    ops: [op('u', 'Unidad', 'Unidad', 7800)], def: 'u',
    img: { src: 'images/p-sandwich.webp', lado: 800, alt: 'Sándwich de pan tostado con fetas de pernil y lechuga' },
    corta: 'Pan tostado, pernil y lechuga.',
    desc: 'Pan tostado con fetas de pernil de cerdo y lechuga. Para el almuerzo o para comer al paso.',
    claves: ['sandwich', 'almuerzo', 'pernil', 'pan', 'al paso'] },
  { id: 'emp-surtidas', nombre: 'Empanadas surtidas', cat: 'empanadas', venta: 'docena', momento: ['fiesta', 'reunion', 'dia'], rango: 5, etiqueta: 'Para recibir',
    ops: [op('media', 'Media docena', '½ docena', 8500), op('docena', 'Docena', 'Docena', 16000)], def: 'docena',
    img: { src: 'images/p-emp-surtidas.webp', lado: 800, alt: 'Empanadas de repulgue doradas en una fuente blanca' },
    corta: 'Carne, pollo y jamón y queso.',
    desc: 'Docena surtida de carne, pollo y jamón y queso. Para recibir a los invitados mientras se corta el pernil.',
    claves: ['empanada', 'surtidas', 'carne', 'pollo', 'jamon', 'queso', 'docena'] },
  { id: 'emp-carne', nombre: 'Empanadas de carne', cat: 'empanadas', venta: 'docena', momento: ['reunion', 'dia'], rango: 6, etiqueta: '',
    ops: [op('media', 'Media docena', '½ docena', 8500), op('docena', 'Docena', 'Docena', 16000)], def: 'docena',
    img: { src: 'images/p-emp-carne.webp', lado: 800, alt: 'Empanadas de carne abiertas con relleno de carne picada y morrón' },
    corta: 'Carne con cebolla y morrón.',
    desc: 'Empanadas de carne con cebolla y morrón, al horno. Por docena o media docena.',
    claves: ['empanada', 'carne', 'vacuna', 'morron', 'horno'] },
  { id: 'emp-pollo', nombre: 'Empanadas de pollo', cat: 'empanadas', venta: 'docena', momento: ['reunion', 'dia'], rango: 8, etiqueta: '',
    ops: [op('media', 'Media docena', '½ docena', 8500), op('docena', 'Docena', 'Docena', 16000)], def: 'docena',
    img: { src: 'images/p-emp-pollo.webp', lado: 800, alt: 'Empanadas de pollo desmechado abiertas en un plato' },
    corta: 'Pollo desmechado con verduras.',
    desc: 'Empanadas de pollo desmechado con cebolla y morrón, al horno. Por docena o media docena.',
    claves: ['empanada', 'pollo', 'desmechado', 'horno'] },
  { id: 'emp-jyq', nombre: 'Empanadas de jamón y queso', cat: 'empanadas', venta: 'docena', momento: ['reunion', 'dia'], rango: 9, etiqueta: '',
    ops: [op('media', 'Media docena', '½ docena', 8500), op('docena', 'Docena', 'Docena', 16000)], def: 'docena',
    img: { src: 'images/p-emp-jyq.webp', lado: 800, alt: 'Empanadas de jamón y queso con el queso derretido' },
    corta: 'Con el queso que se estira.',
    desc: 'Empanadas de jamón y queso, al horno. Por docena o media docena.',
    claves: ['empanada', 'jamon', 'queso', 'jyq', 'horno'] },
  { id: 'salsa-extra', nombre: 'Salsa extra', cat: 'extras', venta: 'unidad', momento: ['fiesta', 'reunion'], rango: 10, etiqueta: '',
    ops: SALSAS.map(s => op(slug(s), s, s, 4800)), def: 'criolla',
    img: { src: 'images/p-salsas.webp', lado: 800, alt: 'Potes de salsa criolla, tártara y barbacoa con cucharitas de Todo Pernil, foto de Todo Pernil' },
    corta: 'En pote, con su etiqueta.',
    desc: 'Un pote más de la salsa que prefieras: criolla, tártara, barbacoa, cebolla caramelizada, mostaza y miel, chimichurri o mayonesa de finas hierbas.',
    claves: ['salsa', 'pote', ...SALSAS] },
  { id: 'pancitos-extra', nombre: 'Pancitos extra', cat: 'extras', venta: 'unidad', momento: ['fiesta', 'reunion'], rango: 11, etiqueta: '',
    ops: [op('50', '50 pancitos', '50 u.', 9500), op('100', '100 pancitos', '100 u.', 18000)], def: '50',
    img: { src: 'images/p-pancitos.webp', lado: 640, alt: 'Plato de pancitos blancos para pernil, foto de Todo Pernil' },
    corta: 'Por si se suman invitados.',
    desc: 'Pancitos para pernil, por si se suman invitados o querés que sobren.',
    claves: ['pan', 'pancitos', 'mignon', 'extra'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const opDe = (p, v) => p.ops.find(o => o.id === v) || null;
function opcionValida(p, v) {
  return opDe(p, v) ? v : p.def;
}
const precioDe = (p, v) => (opDe(p, opcionValida(p, v)) || p.ops[0]).precio;
const desdeDe = p => Math.min(...p.ops.map(o => o.precio));
const POR_CANTIDAD = ['docena', 'media', 'u'];
function textoVar(p, v) {
  const o = opDe(p, opcionValida(p, v));
  return o ? o.nombre : '';
}
function cantidadTexto(p, v, qty) {
  const o = opDe(p, opcionValida(p, v));
  if (!o) return `${qty}`;
  if (o.id === 'docena') return `${qty} ${qty === 1 ? 'docena' : 'docenas'}`;
  if (o.id === 'media') return `${qty === 1 ? 'media docena' : `${qty} medias docenas`}`;
  if (o.id === 'u') return `${qty} ${qty === 1 ? 'unidad' : 'unidades'}`;
  return `${qty} × ${o.corto}`;
}
function lineaTexto(p, v, qty) {
  const o = opcionValida(p, v);
  if (POR_CANTIDAD.includes(o)) return `${cantidadTexto(p, o, qty)} de ${p.nombre}`;
  return `${qty > 1 ? `${qty} × ` : ''}${p.nombre} (${opDe(p, o).corto})`;
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const desde = p => Math.min(...p.ops.map(o => o.precio));
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, p.corta, nombreDe(CATEGORIAS, p.cat), nombreDe(VENTAS, p.venta),
    ...(p.momento || []).map(m => nombreDe(MOMENTOS, m)), ...(p.claves || []), ...p.ops.map(o => o.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), venta = lista(f.venta), momento = lista(f.momento), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (venta.length && !venta.includes(p.venta)) return false;
    if (momento.length && !momento.some(m => (p.momento || []).includes(m))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && desde(p) < f.precioMin) return false;
    if (f.precioMax != null && desde(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
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
    let leidas = 0, paginas = 0;
    if (!q) {
      items.push(...base.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < base.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < base.length && items.length < lim) {
      const tanda = base.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, min = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, desde(p)); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
}

function calcularPedido(personas, carne, conEmpanadas = false) {
  const n = Math.min(120, Math.max(10, Math.round(Number(personas) || 10)));
  const p = PRODUCTOS.find(x => x.carne === carne) || PRODUCTOS.find(x => x.carne === 'cerdo');
  const tam = p.ops.map(o => ({ id: o.id, cap: o.personas, precio: o.precio })).sort((a, b) => b.cap - a.cap);
  let mejor = null;
  const probar = (k, desdeIdx, piezas) => {
    const cap = piezas.reduce((s, t) => s + t.cap, 0);
    if (cap >= n) {
      const precio = piezas.reduce((s, t) => s + t.precio, 0);
      const c = [piezas.length, cap - n, precio];
      if (!mejor || c[0] < mejor.c[0] || (c[0] === mejor.c[0] && (c[1] < mejor.c[1] || (c[1] === mejor.c[1] && c[2] < mejor.c[2])))) mejor = { c, piezas: [...piezas] };
      return;
    }
    if (k === 6) return;
    for (let i = desdeIdx; i < tam.length; i++) { piezas.push(tam[i]); probar(k + 1, i, piezas); piezas.pop(); }
  };
  probar(0, 0, []);
  const lineas = [];
  mejor.piezas.forEach(t => {
    const ya = lineas.find(l => l.v === t.id);
    if (ya) ya.qty++; else lineas.push({ id: p.id, v: t.id, qty: 1 });
  });
  if (conEmpanadas) {
    const medias = Math.ceil(n / 6), doc = Math.floor(medias / 2), media = medias % 2;
    if (doc) lineas.push({ id: 'emp-surtidas', v: 'docena', qty: doc });
    if (media) lineas.push({ id: 'emp-surtidas', v: 'media', qty: 1 });
  }
  const ops = mejor.piezas.map(t => p.ops.find(o => o.id === t.id));
  return {
    personas: n, carne: p.carne, producto: p.id, lineas,
    rinde: ops.reduce((s, o) => s + o.personas, 0),
    pancitos: ops.reduce((s, o) => s + o.pancitos, 0),
    salsas: ops.reduce((s, o) => s + o.salsas, 0),
  };
}

function estadoHorario(fecha = new Date()) {
  const iso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  const feriado = FERIADOS.includes(iso);
  const [abre, cierra] = feriado ? HORARIO.feriado : HORARIO.normal;
  const min = fecha.getHours() * 60 + fecha.getMinutes();
  const hhmm = m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const abierto = min >= abre && min < cierra;
  let texto, corto;
  if (abierto) {
    texto = `${feriado ? 'Hoy es feriado: abierto' : 'Abierto ahora'} hasta las ${hhmm(cierra)}`;
    corto = `Abierto hasta las ${hhmm(cierra)}`;
  } else if (min < abre) {
    texto = `Cerrado ahora · ${feriado ? 'hoy, feriado, ' : 'hoy '}abrimos a las ${hhmm(abre)}`;
    corto = `Abrimos a las ${hhmm(abre)}`;
  } else {
    const man = new Date(fecha); man.setDate(man.getDate() + 1);
    const isoM = `${man.getFullYear()}-${String(man.getMonth() + 1).padStart(2, '0')}-${String(man.getDate()).padStart(2, '0')}`;
    const abreM = FERIADOS.includes(isoM) ? HORARIO.feriado[0] : HORARIO.normal[0];
    texto = `Cerrado ahora · mañana abrimos a las ${hhmm(abreM)}`;
    corto = `Mañana desde las ${hhmm(abreM)}`;
  }
  return { abierto, feriado, texto, corto };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const claveLinea = (id, v) => `${id}|${v || ''}`;

const Cart = {
  KEY: 'todopernil_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const op = opcionValida(producto, v);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === op);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: op, qty: suma });
    this.save(items);
    return suma;
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, MAX_CANT)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  linea(i) { const p = getProducto(i.id); return p ? precioDe(p, i.v) * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = opcionValida(p, i.v);
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, i.qty || 1)); changed = true; }
      return true;
    });
    const unidas = [];
    limpias.forEach(i => {
      const ya = unidas.find(u => u.id === i.id && u.v === i.v);
      if (ya) { ya.qty = Math.min(MAX_CANT, ya.qty + i.qty); changed = true; } else unidas.push(i);
    });
    if (changed) this.save(unidas);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const els = [...cont.querySelectorAll(ENFOCABLES)].filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!els.length) return;
  const primero = els[0], ultimo = els[els.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}
const capas = [];
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else atraparFoco(el, e);
  };
  document.addEventListener('keydown', onKey);
  capas.push({ el, previo, onKey, alCerrar });
}
function cerrarCapa(el, { devolverFoco = true } = {}) {
  const i = capas.findIndex(c => c.el === el);
  if (i < 0) return;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

function etiquetaSumar(p, v) {
  const o = opDe(p, opcionValida(p, v));
  if (!o || o.id === 'u') return `Agregar ${p.nombre} al pedido`;
  if (o.id === 'docena') return `Agregar una docena de ${p.nombre} al pedido`;
  if (o.id === 'media') return `Agregar media docena de ${p.nombre} al pedido`;
  return `Agregar ${p.nombre}, ${o.corto}, al pedido`;
}
const badgeHTML = p => (p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '');

function sticker(p, o) {
  if (p.venta === 'personas' && o.personas) return `<span class="sticker" aria-hidden="true"><small>para</small><b>${o.personas}</b><small>personas</small></span>`;
  if (o.id === 'docena' || o.id === 'media') return `<span class="sticker sticker--txt" aria-hidden="true"><b>${o.id === 'docena' ? '12' : '6'}</b><small>unidades</small></span>`;
  return '';
}
function cardHTML(p, estilo = 'etiqueta', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const o = opDe(p, p.def);
  const media = `<div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></div>`;
  const desde = p.ops.length > 1 ? `<small class="prod__desde">desde</small>` : '';
  const precio = `<p class="prod__precio">${desde}<b class="precio">${formatearPrecio(desdeDe(p))}</b></p>`;
  const add = `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" data-v="${esc(p.def)}" aria-label="${esc(etiquetaSumar(p, p.def))}">${ICO.mas}<span>Agregar</span></button>`;
  if (estilo === 'kraft') {
    return `<article class="prod prod--kraft" data-id="${esc(p.id)}"${anim}>
  ${media}${badgeHTML(p)}
  <div class="prod__info">
    <p class="prod__cat">${esc(nombreDe(CATEGORIAS, p.cat))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__op">${esc(o.corto)}${p.ops.length > 1 ? ` · ${p.ops.length} opciones` : ''}</p>
    ${precio}
    <div class="prod-actions">${add}</div>
  </div>
</article>`;
  }
  return `<article class="prod prod--etiqueta" data-id="${esc(p.id)}"${anim}>
  <div class="prod__marco">${media}${badgeHTML(p)}${sticker(p, o)}</div>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__corta">${esc(p.corta)}</p>
    <div class="prod__pie">${precio}<div class="prod-actions">${add}</div></div>
  </div>
</article>`;
}

function filaHTML(p) {
  const ops = p.ops.length > 4
    ? `<li class="fila__sabores"><label><span class="sr-only">Sabor de ${esc(p.nombre)}</span><select data-fila-sabor="${esc(p.id)}">${p.ops.map(o => `<option value="${esc(o.id)}"${o.id === p.def ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('')}</select></label><i class="fila__puntos" aria-hidden="true"></i><b class="fila__precio">${formatearPrecio(desdeDe(p))}</b><button type="button" class="fila__mas" data-sumar="${esc(p.id)}" data-v="${esc(p.def)}" aria-label="${esc(`Agregar ${p.nombre} al pedido`)}">${ICO.mas}</button></li>`
    : p.ops.map(o => `<li><span class="fila__op">${esc(o.corto)}</span><i class="fila__puntos" aria-hidden="true"></i><b class="fila__precio">${formatearPrecio(o.precio)}</b><button type="button" class="fila__mas" data-sumar="${esc(p.id)}" data-v="${esc(o.id)}" aria-label="${esc(etiquetaSumar(p, o.id))}">${ICO.mas}</button></li>`).join('');
  return `<li class="fila" data-id="${esc(p.id)}" data-animate="cortina" style="clip-path:inset(0 100% 0 0)">
  <button type="button" class="fila__foto" data-qv="${esc(p.id)}" aria-label="Ver la ficha de ${esc(p.nombre)}"><img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button>
  <div class="fila__txt"><h3 class="fila__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button>${p.etiqueta ? ` <span class="fila__badge">${esc(p.etiqueta)}</span>` : ''}</h3><p class="fila__desc">${esc(p.corta)}</p></div>
  <ul class="fila__ops">${ops}</ul>
</li>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${n} ${n === 1 ? 'producto' : 'productos'}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${lineaTexto(p, i.v, i.qty)} — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const clave = esc(claveLinea(i.id, i.v));
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoVar(p, i.v))} · ${formatearPrecio(precioDe(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div><p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
  </div>
</li>`;
}
const partirClave = s => { const k = s.indexOf('|'); return [s.slice(0, k), s.slice(k + 1)]; };
function escucharLineas(lista) {
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(...partirClave(q.dataset.quitar)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const [id, v] = partirClave(b.dataset.linea);
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const total = drawer.querySelector('[data-drawer-total]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? `${n} ${n === 1 ? 'producto' : 'productos'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function initCarritoPanel() {
  const lista = document.querySelector('[data-sel-lista]');
  if (!lista) return;
  const vacio = document.querySelector('[data-sel-vacio]');
  const pie = document.querySelector('[data-sel-pie]');
  const total = document.querySelector('[data-sel-total]');
  const wsp = document.querySelector('[data-sel-wsp]');
  const pintar = () => {
    const items = Cart.get();
    lista.hidden = !items.length;
    vacio.hidden = items.length > 0;
    pie.hidden = !items.length;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    wsp.href = wspHref(textoPedido());
  };
  escucharLineas(lista);
  document.addEventListener('cart:updated', pintar);
  pintar();
}

function sumar(id, v = '', qty = 1, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const op = opcionValida(p, v);
  const n = Cart.add(p, qty, op);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el pedido`); return 0; }
  showToast(`Sumaste ${lineaTexto(p, op, n)}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-fila-sabor]');
    if (!sel) return;
    const p = getProducto(sel.dataset.filaSabor);
    const btn = sel.closest('li')?.querySelector('[data-sumar]');
    if (!p || !btn) return;
    btn.dataset.v = opcionValida(p, sel.value);
    btn.setAttribute('aria-label', etiquetaSumar(p, btn.dataset.v));
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) { e.preventDefault(); sumar(s.dataset.sumar, s.dataset.v || '', 1, s); return; }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv, { v: qv.dataset.v || '' }); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: opcionValida(p, v), qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const varBloque = p.ops.length > 1
    ? `<p class="qv__var-t">${p.venta === 'personas' ? 'Para cuántos' : p.id === 'salsa-extra' ? 'Sabor' : 'Cantidad'}: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="Opciones">${p.ops.map(o => `<button type="button" class="chip chip--op" data-qv-op="${esc(o.id)}" aria-pressed="${o.id === qvEstado.v}"><b>${esc(o.nombre)}</b><small>${formatearPrecio(o.precio)}</small></button>`).join('')}</div>`
    : '<p class="qv__var-t">Se vende por unidad</p>';
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></div>
  </div>
  <div class="qv__info">
    <p class="qv__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(nombreDe(VENTAS, p.venta))}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__var">${varBloque}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Cantidad"><button type="button" data-qv-paso="-1" aria-label="Restar una" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <a class="qv__wsp" href="#" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(desdeDe(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === qvEstado.v)));
  const elegida = modal.querySelector('[data-qv-elegida]');
  if (elegida) elegida.textContent = textoVar(p, qvEstado.v);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioDe(p, qvEstado.v) * qvEstado.qty);
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero consultar por ${lineaTexto(p, qvEstado.v, qvEstado.qty)}.`);
  ponerJsonLdProducto(p);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const op = e.target.closest('[data-qv-op]');
    if (op) { qvEstado.v = opcionValida(p, op.dataset.qvOp); pintarQv(); return; }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el pedido`); return; }
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${lineaTexto(p, qvEstado.v, n)}`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  const precios = p.ops.map(o => o.precio);
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: Math.min(...precios), highPrice: Math.max(...precios), offerCount: precios.length, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1081px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capas.length) document.body.classList.remove('no-scroll');
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
  const params = new URLSearchParams(location.search);
  const cat = (params.get('cat') || '').split(',').filter(Boolean);
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="${c.lado}" height="${c.lado}"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1081px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1081px)');
  document.querySelectorAll('.nav-cats').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('is-open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hover.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('focusout', e => { if (desktop.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (!box.contains(e.target) && desktop.matches) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('is-open')) { cerrar(); btn.focus(); } });
  });
}

function initResumenes() {
  document.querySelectorAll('[data-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.resumen });
    if (!r.n) return;
    el.textContent = `Desde ${formatearPrecio(r.desde)}`;
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids, filtros = {}) {
  const res = Tienda.consultar({ filtros: { ...filtros, ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function menuHTML(prods) {
  return CATEGORIAS.map(c => {
    const del = prods.filter(p => p.cat === c.id);
    if (!del.length) return '';
    return `<div class="menu__grupo"><p class="menu__cat" data-animate="subir" style="opacity:0;transform:translateY(22px)"><span>${esc(c.nombre)}</span><small>${esc(c.bajada)}</small></p><ul class="menu__filas">${del.map(filaHTML).join('')}</ul></div>`;
  }).join('');
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = idsDe(cont, 'data-preview');
    const estilo = cont.dataset.estilo || 'etiqueta';
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = Tienda.consultar({ filtros: { [k]: v }, limite: 8 }).items;
      } else prods = productosPorIds(ids);
      cont.innerHTML = estilo === 'menu' ? menuHTML(prods) : prods.map(p => cardHTML(p, estilo)).join('');
    };
    pintar();
    if (!cont.hasAttribute('data-tabs')) return;
    const tabs = cont.closest('section')?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

const CARNE_NOMBRE = { cerdo: 'Pernil de cerdo', novillo: 'Pernil de novillo', cordero: 'Pernil de cordero' };
function initCuanto() {
  const sec = document.getElementById('cuanto');
  if (!sec) return;
  const rango = sec.querySelector('[data-c-personas]');
  const valor = sec.querySelector('[data-c-valor]');
  const titulo = sec.querySelector('[data-c-titulo]');
  const lista = sec.querySelector('[data-c-lista]');
  const incluye = sec.querySelector('[data-c-incluye]');
  const total = sec.querySelector('[data-c-total]');
  const wsp = sec.querySelector('[data-c-wsp]');
  const emp = sec.querySelector('[data-c-empanadas]');
  let carne = 'cerdo';
  let actual = null;
  const pintar = () => {
    actual = calcularPedido(rango.value, carne, emp.checked);
    valor.textContent = actual.personas;
    titulo.textContent = `Para ${actual.personas} personas · ${CARNE_NOMBRE[actual.carne]}`;
    const filas = actual.lineas.map(l => {
      const p = getProducto(l.id);
      return p ? { p, l, sub: precioDe(p, l.v) * l.qty } : null;
    }).filter(Boolean);
    lista.innerHTML = filas.map(({ p, l, sub }) => `<li><span class="tablero__item"><span class="tablero__nombre">${esc(p.nombre)}</span><span class="tablero__cant">${esc(POR_CANTIDAD.includes(l.v) ? cantidadTexto(p, l.v, l.qty) : `${l.qty > 1 ? `${l.qty} × ` : ''}${opDe(p, l.v).corto}`)}</span></span><i aria-hidden="true"></i><b>${formatearPrecio(sub)}</b></li>`).join('');
    incluye.textContent = `Rinde para ${actual.rinde} personas. Incluye ${actual.pancitos} pancitos y ${actual.salsas} potes de salsa.`;
    const suma = filas.reduce((s, f) => s + f.sub, 0);
    total.textContent = formatearPrecio(suma);
    const texto = filas.map(({ p, l }) => lineaTexto(p, l.v, l.qty)).join(', ');
    wsp.href = wspHref(`Hola! Somos ${actual.personas} personas. La web me sugiere: ${texto}. ¿Me confirman disponibilidad para el día ___?`);
  };
  sec.addEventListener('click', e => {
    const o = e.target.closest('[data-c-carne]');
    if (o) {
      carne = o.dataset.cCarne;
      sec.querySelectorAll('[data-c-carne]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      pintar(); return;
    }
    const p = e.target.closest('[data-c-paso]');
    if (p) { rango.value = Math.min(Number(rango.max), Math.max(Number(rango.min), Number(rango.value) + Number(p.dataset.cPaso))); pintar(); return; }
    if (e.target.closest('[data-c-sumar]') && actual) {
      let sumadas = 0;
      actual.lineas.forEach(l => { const prod = getProducto(l.id); if (prod) sumadas += Cart.add(prod, l.qty, l.v) ? 1 : 0; });
      showToast(sumadas ? `Sumamos lo sugerido para ${actual.personas} personas al pedido` : `Ya tenés ${MAX_CANT} iguales en el pedido`);
    }
  });
  rango.addEventListener('input', pintar);
  emp.addEventListener('change', pintar);
  pintar();
}

function initHorario() {
  const pintar = () => {
    const e = estadoHorario();
    document.querySelectorAll('[data-hoy]').forEach(el => { el.classList.toggle('is-abierto', e.abierto); el.classList.toggle('is-cerrado', !e.abierto); });
    document.querySelectorAll('[data-hoy-chip]').forEach(el => { el.classList.toggle('is-abierto', e.abierto); el.classList.toggle('is-cerrado', !e.abierto); });
    document.querySelectorAll('[data-hoy-txt]').forEach(el => { el.textContent = e.texto; });
    document.querySelectorAll('[data-hoy-corto]').forEach(el => { el.textContent = e.corto; });
    document.querySelectorAll('.horas [data-dia]').forEach(li => li.classList.toggle('is-hoy', (li.dataset.dia === 'feriado') === e.feriado));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { } }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
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
  const sec = vp.closest('section');
  const prev = sec?.querySelector('.rail-prev');
  const next = sec?.querySelector('.rail-next');
  const track = vp.firstElementChild;
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const btns = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !btns.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const pie = visor.querySelector('[data-visor-pie]');
  const fotos = btns.map(b => { const i = b.querySelector('img'); return { src: i.getAttribute('src'), alt: i.alt, w: i.width, h: i.height, t: b.querySelector('.gal__t')?.textContent || '', real: !!b.querySelector('.foto-real') }; });
  let actual = 0;
  const mostrar = k => {
    actual = (k + fotos.length) % fotos.length;
    const f = fotos[actual];
    img.src = f.src; img.alt = f.alt; img.width = f.w; img.height = f.h;
    pie.textContent = `${f.t}${f.real ? ' · Foto real de Todo Pernil' : ' · Imagen ilustrativa'} · ${actual + 1} de ${fotos.length}`;
  };
  btns.forEach(b => b.addEventListener('click', () => {
    mostrar(Number(b.dataset.visor));
    abrirCapa(visor, { previo: b });
    setTimeout(() => visor.querySelector('.visor__cerrar')?.focus(), 60);
  }));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) { cerrarCapa(visor); return; }
    const p = e.target.closest('[data-visor-paso]');
    if (p) mostrar(actual + Number(p.dataset.visorPaso));
  });
  visor.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
  });
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const pos = [UBICACION.lat, UBICACION.lng];
  const mapa = L.map(el, { zoomControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(pos, 12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  L.circle(pos, { radius: 2600, color: '#3F6E96', weight: 1, dashArray: '4 6', fillColor: '#3F6E96', fillOpacity: 0.08, interactive: false }).addTo(mapa);
  const icono = L.divIcon({ className: 'mapa-pin', html: '<img src="images/logo.webp" alt="" width="56" height="56">', iconSize: [60, 60], iconAnchor: [30, 30] });
  L.marker(pos, { icon: icono, keyboard: false, alt: `${MARCA}, dirección a confirmar` }).addTo(mapa).bindTooltip(`${MARCA} · dirección a confirmar`, { direction: 'top', offset: [0, -32] });
  if (el.closest('.horarios--m2') && window.matchMedia('(min-width: 900px)').matches) mapa.panBy([-260, 0], { animate: false });
  el.closest('.mapa')?.classList.add('mapa--ok');
  setTimeout(() => mapa.invalidateSize(), 500);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const verMas = document.getElementById('verMas');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const vacio = document.getElementById('vacio');
  const activos = document.getElementById('activos');
  const panel = document.getElementById('filtros');
  const inputQ = document.getElementById('q');
  const selOrden = document.getElementById('orden');
  const titulo = document.getElementById('catTitulo');
  const miga = document.getElementById('migaCat');
  const migaSep = document.querySelector('[data-miga-sep]');
  const estilo = MODELO === '2' ? 'kraft' : 'etiqueta';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, venta: VENTAS, momento: MOMENTOS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    venta: valida(params.get('venta'), VENTAS),
    momento: valida(params.get('momento'), MOMENTOS),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (e.cat.length === 1 && solo.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.momento.length === 1 && solo.length === 1) return nombreDe(MOMENTOS, e.momento[0]);
    if (e.venta.length === 1 && solo.length === 1) return nombreDe(VENTAS, e.venta[0]);
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Perniles, ribs y empanadas';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function render(reiniciar = true) {
    const f = { ...filtros(), ...(e.q ? { q: e.q } : {}) };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p, estilo)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = e.q ? null : Tienda.contar(filtros());
    contador.innerHTML = e.q
      ? `${mostrados}${cursor ? '+' : ''} <small>${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${esc(e.q)}»</small>`
      : `${total} <small>${total === 1 ? 'producto' : 'productos'}</small>`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.hidden = mostrados === 0;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    document.querySelectorAll('[data-ver-n]').forEach(el => { el.textContent = e.q ? 'los' : `${total}`; });
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  function aplicar() { pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true); }
  panel.addEventListener('change', ev => {
    const inp = ev.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    if (g === 'precio') e.precio = inp.value;
    else e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
      else if (k === 'precio') e.precio = '';
      else { e.q = ''; inputQ.value = ''; }
      aplicar();
    }
  });
  verMas.addEventListener('click', () => render(false));
  const bd = document.querySelector('.filtros-backdrop');
  const mq = window.matchMedia('(max-width: 1024px)');
  const syncPanel = () => { if (mq.matches && !panel.classList.contains('open')) panel.setAttribute('inert', ''); else panel.removeAttribute('inert'); if (!mq.matches) { panel.classList.remove('open'); bd?.classList.remove('open'); } };
  const abrirPanel = () => { panel.classList.add('open'); bd?.classList.add('open'); document.body.classList.add('no-scroll'); panel.removeAttribute('inert'); panel.querySelector('button, input')?.focus(); };
  const cerrarPanel = () => { panel.classList.remove('open'); bd?.classList.remove('open'); if (!capas.length) document.body.classList.remove('no-scroll'); syncPanel(); };
  mq.addEventListener('change', syncPanel);
  syncPanel();
  if (mq.matches) panel.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-abrir-filtros]').forEach(b => b.addEventListener('click', abrirPanel));
  document.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', () => { cerrarPanel(); document.querySelector('[data-abrir-filtros]')?.focus(); }));
  bd?.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); else if (panel.classList.contains('open')) atraparFoco(panel, ev); });
  pintarFiltros(); pintarActivos(); sincronizarUrl(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
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

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (reduceMotion || typeof gsap === 'undefined') { hero.classList.add('hero--listo'); return; }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onStart: () => hero.classList.add('hero--listo') });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.kicker', { y: 20, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 40, opacity: 0, duration: 1.1 }, 0.2);
  desde('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.4);
  desde('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  desde('.hoy--hero', { y: 16, opacity: 0, duration: 0.8 }, 0.8);
  desde('.sello', { scale: 0.92, rotate: -30, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', clearProps: 'transform,opacity' }, 0.6);
}

initPreviews();
initResumenes();
initMenuCategorias();
initCuanto();
initHorario();
initCatalogo();
initReveals();
initHeroMotion();
initMapa();
initRail();
initGaleria();
initNav();
initDrawer();
initCarritoPanel();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
