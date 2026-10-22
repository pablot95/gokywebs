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

const WSP = '5493855973615';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);

const CATEGORIAS = [
  { id: 'arranques', nombre: 'Arranques', img: 'images/p-arranque-12v.webp', bajada: 'Motores de arranque de 12 y 24 V para autos, camionetas, máquinas viales y autoelevadores.' },
  { id: 'alternadores', nombre: 'Alternadores', img: 'images/p-alternador-90a.webp', bajada: 'Alternadores de 12 V de 70 a 120 A, con polea de 6 canales.' },
  { id: 'despieces', nombre: 'Despieces', img: 'images/p-portacarbones.webp', bajada: 'Cada pieza por separado: bendix, automáticos, inducidos, bobinas, portacarbones, estatores y poleas.' },
  { id: 'luces', nombre: 'Luces', img: 'images/p-lamparas-h4.webp', bajada: 'Lámparas H4 de 12 y 24 V. ¿Buscás otra? Preguntanos por WhatsApp.' },
];
const EQUIPOS = { arranque: 'Arranque', alternador: 'Alternador' };
const TENSIONES = { 12: '12 V', 24: '24 V' };
const ORDENES = { destacados: 'Más pedidos', nuevos: 'Recién ingresados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const NUEVO_DESDE = 15;

const PIEZAS = {
  bendix: { nombre: 'Bendix', equipo: 'arranque', hace: 'El piñón con rueda libre que engrana con el volante del motor.', cuando: 'El arranque gira pero no mueve el motor, o se escucha un chirrido metálico al arrancar.' },
  automatico: { nombre: 'Automático', equipo: 'arranque', hace: 'El solenoide que empuja el bendix y cierra el circuito de potencia.', cuando: 'Girás la llave, se escucha un clic y el arranque no gira.' },
  bobinas: { nombre: 'Bobinas de campo', equipo: 'arranque', hace: 'Arman el campo magnético alrededor del inducido.', cuando: 'El arranque gira sin fuerza o se corta. Se revisan junto con el inducido.' },
  inducido: { nombre: 'Inducido', equipo: 'arranque', hace: 'La parte que gira dentro del arranque, con su colector de cobre.', cuando: 'Gira lento aunque la batería esté cargada, o hay olor a quemado.' },
  portacarbones: { nombre: 'Portacarbones y carbones', equipo: 'arranque', hace: 'Llevan la corriente al colector del inducido.', cuando: 'A veces arranca y a veces no: los carbones gastados cortan el contacto.' },
  polea: { nombre: 'Polea', equipo: 'alternador', hace: 'Recibe el giro de la correa y mueve el rotor.', cuando: 'Chilla la correa o la polea tiene juego.' },
  rotor: { nombre: 'Rotor', equipo: 'alternador', hace: 'Gira dentro del estator y arma el campo magnético.', cuando: 'El alternador hace ruido al girar o deja de cargar.' },
  estator: { nombre: 'Estator', equipo: 'alternador', hace: 'El bobinado fijo donde se genera la corriente.', cuando: 'La batería no carga bien o la luz de carga queda prendida.' },
  regulador: { nombre: 'Regulador de voltaje', equipo: 'alternador', hace: 'Mantiene estable la tensión de carga.', cuando: 'Las luces suben y bajan, o la batería se pasa de carga.' },
  rectificador: { nombre: 'Puente rectificador', equipo: 'alternador', hace: 'Los diodos que pasan la corriente alterna a continua.', cuando: 'La batería se descarga con el vehículo apagado, o carga poco.' },
};
const DESPIECES = {
  arranque: {
    img: 'images/p-arranque-12v.webp', alt: 'Motor de arranque de 12 V con carcasa de aluminio, cuerpo negro y automático, sobre fondo gris',
    puntos: [['bendix', 18, 57], ['automatico', 64, 25], ['bobinas', 64, 47], ['inducido', 77, 63], ['portacarbones', 91, 54]],
  },
  alternador: {
    img: 'images/p-alternador-90a.webp', alt: 'Alternador de 12 V con carcasa de aluminio, bobinado de cobre a la vista y polea de 6 canales, sobre fondo blanco',
    puntos: [['polea', 84, 56], ['rotor', 62, 41], ['estator', 34, 48], ['regulador', 11, 30], ['rectificador', 13, 53]],
  },
};

const PRODUCTOS = [
  { id: 'arranque-24v-maquinas', nombre: 'Motor de arranque 24 V para máquinas viales', cat: 'arranques', equipo: 'arranque', pieza: 'arranque', tension: ['24'], codigo: 'GR-A2411',
    specs: [['Tensión', '24 V'], ['Potencia', '4,5 kW'], ['Piñón', '11 dientes'], ['Giro', 'Horario']],
    aplicaciones: ['Máquinas viales: retroexcavadoras y palas cargadoras', 'Autoelevadores, también de origen chino', 'Camiones'],
    precio: 468700, stock: 2, rango: 1, alta: 5,
    img: 'images/p-arranque-24v.webp', alt: 'Motor de arranque de cuerpo negro y carcasa de aluminio con su automático, sobre una mesa de taller',
    desc: 'Arranque nuevo de 24 V con automático incluido, para máquinas viales y autoelevadores. Pasanos el código del tuyo y te confirmamos que es el mismo.' },
  { id: 'estator-marelli', nombre: 'Estator de alternador Marelli (nuevo)', cat: 'despieces', equipo: 'alternador', pieza: 'estator', tension: ['12'], codigo: 'GR-E12M',
    specs: [['Marca', 'Marelli'], ['Estado', 'Nuevo'], ['Tensión', '12 V'], ['Bobinado', 'Cobre esmaltado']],
    aplicaciones: ['Alternadores Marelli de 12 V'],
    precio: 59000, stock: 4, rango: 2, alta: 4,
    img: 'images/p-estator.webp', alt: 'Estator de alternador con chapas de acero y bobinado de cobre a la vista, sobre fondo gris',
    desc: 'Estator nuevo marca Marelli. Es el bobinado fijo donde el alternador genera la corriente: se cambia cuando la batería no carga bien o la luz de carga queda prendida.' },
  { id: 'arranque-reductor-12v', nombre: 'Motor de arranque reductor 12 V · 9 dientes', cat: 'arranques', equipo: 'arranque', pieza: 'arranque', tension: ['12'], codigo: 'GR-AR1209',
    specs: [['Tensión', '12 V'], ['Potencia', '2,2 kW'], ['Piñón', '9 dientes'], ['Tipo', 'Reductor']],
    aplicaciones: ['Camionetas diésel', 'Utilitarios'],
    precio: 312400, stock: 3, rango: 3, alta: 3,
    img: 'images/p-arranque-reductor.webp', alt: 'Nariz de aluminio de un motor de arranque con el piñón a la vista y el automático al costado',
    desc: 'Arranque con reducción: más fuerza en el piñón con un motor más chico. Pensado para motores diésel de camioneta y utilitario.' },
  { id: 'alternador-12v-120a', nombre: 'Alternador 12 V · 120 A', cat: 'alternadores', equipo: 'alternador', pieza: 'alternador', tension: ['12'], codigo: 'GR-L12120',
    specs: [['Tensión', '12 V'], ['Corriente', '120 A'], ['Polea', '6 canales'], ['Regulador', 'Incorporado']],
    aplicaciones: ['Camionetas y utilitarios con más consumo eléctrico'],
    precio: 318900, stock: 1, rango: 4, alta: 2,
    img: 'images/p-alternador-120a.webp', alt: 'Alternador de aluminio con polea negra de 6 canales y bobinado de cobre, sobre una mesa de taller',
    desc: 'Alternador nuevo de 120 A con regulador incorporado, para vehículos con más consumo eléctrico: equipos de frío, luces extra o aire acondicionado.' },
  { id: 'bendix-12v-10d', nombre: 'Bendix de arranque 12 V · 10 dientes', cat: 'despieces', equipo: 'arranque', pieza: 'bendix', tension: ['12'], codigo: 'GR-B1210',
    specs: [['Tensión', '12 V'], ['Piñón', '10 dientes'], ['Tipo', 'Rueda libre']],
    aplicaciones: ['Arranques de 12 V con piñón de 10 dientes'],
    precio: 36900, stock: 8, rango: 5, alta: 1,
    img: 'images/p-bendix-12v.webp', alt: 'Piñón de arranque dentro de la nariz de aluminio del motor, de cerca',
    desc: 'Piñón con rueda libre que engrana con el volante del motor. Se cambia cuando el arranque gira pero no mueve el motor.' },
  { id: 'automatico-12v', nombre: 'Automático de arranque 12 V', cat: 'despieces', equipo: 'arranque', pieza: 'automatico', tension: ['12'], codigo: 'GR-S12',
    specs: [['Tensión', '12 V'], ['Terminales', '3'], ['Montaje', 'Sobre el arranque']],
    aplicaciones: ['Arranques de 12 V de autos y camionetas'],
    precio: 54800, stock: 6, rango: 6, alta: 0,
    img: 'images/p-automatico-12v.webp', alt: 'Automático de arranque plateado con tapa negra y bornes de cobre',
    desc: 'El solenoide que empuja el bendix y cierra el circuito de potencia. Si girás la llave y solo escuchás un clic, empezá por acá.' },
  { id: 'inducido-12v', nombre: 'Inducido de arranque 12 V (rotor)', cat: 'despieces', equipo: 'arranque', pieza: 'inducido', tension: ['12'], codigo: 'GR-I12',
    specs: [['Tensión', '12 V'], ['Colector', 'Cobre'], ['Eje', 'Estriado']],
    aplicaciones: ['Arranques de 12 V'],
    precio: 89600, stock: 3, rango: 7, alta: 11,
    img: 'images/p-inducido.webp', alt: 'Inducido de arranque con bobinado de cobre, colector de cobre y eje estriado, acostado sobre fondo gris',
    desc: 'La parte que gira dentro del arranque, con su colector de cobre y el eje estriado. Se cambia si el arranque gira lento con la batería cargada.' },
  { id: 'bobinas-campo-12v', nombre: 'Bobinas de campo de arranque 12 V (juego)', cat: 'despieces', equipo: 'arranque', pieza: 'bobinas', tension: ['12'], codigo: 'GR-C12',
    specs: [['Tensión', '12 V'], ['Polos', '4'], ['Incluye', 'Zapatas polares']],
    aplicaciones: ['Arranques de 12 V de cuatro polos'],
    precio: 61300, stock: 2, rango: 8, alta: 10,
    img: 'images/p-bobinas-campo.webp', alt: 'Juego de bobinas de campo de arranque con cinta aislante color miel, zapatas de acero y terminales',
    desc: 'Juego de bobinas con sus zapatas polares: arman el campo magnético alrededor del inducido. Se revisan cuando el arranque gira sin fuerza.' },
  { id: 'portacarbones-arranque', nombre: 'Portacarbones de arranque · 4 escobillas', cat: 'despieces', equipo: 'arranque', pieza: 'portacarbones', tension: ['12', '24'], codigo: 'GR-P4',
    specs: [['Escobillas', '4, con resortes'], ['Conexión', 'Trenza de cobre'], ['Para', 'Arranques de 12 y 24 V']],
    aplicaciones: ['Arranques de cuatro escobillas'],
    precio: 34700, stock: 7, rango: 9, alta: 8,
    img: 'images/p-portacarbones.webp', alt: 'Portacarbones de arranque de chapa con cuatro escobillas y trenzas de cobre, visto desde arriba',
    desc: 'Placa con las cuatro escobillas y sus resortes, que llevan la corriente al colector del inducido. Viene con los carbones colocados.' },
  { id: 'lamparas-h4', nombre: 'Lámparas H4 halógenas (par)', cat: 'luces', equipo: 'luces', pieza: 'lampara', tension: ['12', '24'], codigo: 'GR-H4',
    specs: [['Zócalo', 'P43t (H4)'], ['Luz', 'Alta y baja'], ['Presentación', 'Par']],
    aplicaciones: ['Faros con lámpara H4 de autos, camionetas y camiones'],
    variantes: { nombre: 'Tensión', opciones: [
      { id: '12', label: '12 V · 60/55 W', corto: '12 V', precio: 14900, stock: 20, tension: '12' },
      { id: '24', label: '24 V · 75/70 W', corto: '24 V', precio: 17800, stock: 9, tension: '24' },
    ] },
    rango: 10, alta: 9,
    img: 'images/p-lamparas-h4.webp', alt: 'Dos lámparas halógenas H4 de vidrio transparente con base metálica, sobre fondo gris',
    desc: 'Par de lámparas halógenas H4 para luz alta y baja. En 12 V para autos y camionetas, y en 24 V para camiones.' },
  { id: 'polea-alternador-6c', nombre: 'Polea de alternador 6 canales', cat: 'despieces', equipo: 'alternador', pieza: 'polea', tension: ['12', '24'], codigo: 'GR-PO6',
    specs: [['Canales', '6 (poli-V)'], ['Incluye', 'Tuerca'], ['Material', 'Acero']],
    aplicaciones: ['Alternadores con correa poli-V de 6 canales'],
    precio: 22600, stock: 5, rango: 0, alta: 13,
    img: 'images/p-polea.webp', alt: 'Polea de acero de seis canales montada en el eje de un alternador, de cerca',
    desc: 'Polea de 6 canales con su tuerca. Se cambia cuando chilla la correa o la polea tiene juego.' },
  { id: 'carbones-arranque', nombre: 'Carbones de arranque (juego x 4)', cat: 'despieces', equipo: 'arranque', pieza: 'portacarbones', tension: ['12', '24'], codigo: 'GR-K4',
    specs: [['Unidades', '4'], ['Conexión', 'Trenza de cobre'], ['Para', 'Portacarbones de 4 escobillas']],
    aplicaciones: ['Arranques de cuatro escobillas'],
    precio: 9900, stock: 15, rango: 0, alta: 12,
    img: 'images/p-carbones.webp', alt: 'Escobilla de carbón en su porta de chapa con la trenza de cobre, de cerca',
    desc: 'Juego de cuatro carbones con trenza de cobre. Cuando están gastados, el arranque a veces arranca y a veces no.' },
  { id: 'alternador-12v', nombre: 'Alternador 12 V · polea 6 canales', cat: 'alternadores', equipo: 'alternador', pieza: 'alternador', tension: ['12'], codigo: 'GR-L12',
    specs: [['Tensión', '12 V'], ['Polea', '6 canales'], ['Regulador', 'Incorporado']],
    aplicaciones: ['Autos y utilitarios nafteros'],
    variantes: { nombre: 'Corriente', opciones: [
      { id: '70', label: '70 A', corto: '70 A', precio: 219800, stock: 3 },
      { id: '90', label: '90 A', corto: '90 A', precio: 256300, stock: 2 },
    ] },
    rango: 0, alta: 7,
    img: 'images/p-alternador-90a.webp', alt: 'Alternador de 12 V con carcasa de aluminio, bobinado de cobre a la vista y polea de 6 canales, sobre fondo blanco',
    desc: 'Alternador nuevo con regulador incorporado y polea de 6 canales. Elegí la corriente que lleva tu vehículo: está en la chapa del alternador.' },
  { id: 'arranque-12v-10d', nombre: 'Motor de arranque 12 V · 10 dientes', cat: 'arranques', equipo: 'arranque', pieza: 'arranque', tension: ['12'], codigo: 'GR-A1210',
    specs: [['Tensión', '12 V'], ['Potencia', '1,4 kW'], ['Piñón', '10 dientes'], ['Giro', 'Horario']],
    aplicaciones: ['Autos nafteros', 'Utilitarios livianos'],
    precio: 238900, stock: 4, rango: 0, alta: 6,
    img: 'images/p-arranque-12v.webp', alt: 'Motor de arranque de 12 V con carcasa de aluminio, cuerpo negro y automático, sobre fondo gris',
    desc: 'Motor de arranque nuevo de 12 V con automático incluido. Piñón de 10 dientes y giro horario.' },
  { id: 'bendix-24v-11d', nombre: 'Bendix de arranque 24 V · 11 dientes', cat: 'despieces', equipo: 'arranque', pieza: 'bendix', tension: ['24'], codigo: 'GR-B2411',
    specs: [['Tensión', '24 V'], ['Piñón', '11 dientes'], ['Tipo', 'Rueda libre']],
    aplicaciones: ['Arranques de 24 V de camiones y máquinas viales'],
    precio: 58400, stock: 0, rango: 0, alta: 15,
    img: 'images/p-bendix-24v.webp', alt: 'Nariz de un motor de arranque de 24 V con el piñón a la vista, de cerca',
    desc: 'Piñón con rueda libre de 11 dientes para arranques de 24 V. Si está sin stock, consultanos: te avisamos cuando entra.' },
  { id: 'automatico-24v', nombre: 'Automático de arranque 24 V', cat: 'despieces', equipo: 'arranque', pieza: 'automatico', tension: ['24'], codigo: 'GR-S24',
    specs: [['Tensión', '24 V'], ['Terminales', '3'], ['Montaje', 'Sobre el arranque']],
    aplicaciones: ['Arranques de 24 V de camiones, máquinas viales y autoelevadores'],
    precio: 79500, stock: 2, rango: 0, alta: 16,
    img: 'images/p-automatico-24v.webp', alt: 'Automático de arranque plateado con tapa negra montado al costado del motor',
    desc: 'Automático para arranques de 24 V. Empuja el bendix y cierra el circuito de potencia del motor de arranque.' },
  { id: 'borrador-regulador', nombre: 'Regulador de voltaje 12 V (borrador)', cat: 'despieces', equipo: 'alternador', pieza: 'regulador', tension: ['12'], codigo: 'GR-R12',
    specs: [], aplicaciones: [], precio: 18000, stock: 0, rango: 0, alta: 0, visible: false,
    img: 'images/p-estator.webp', alt: '', desc: '' },
];
PRODUCTOS.forEach(p => {
  if (p.descuento == null) p.descuento = 0;
  if (p.stock == null) p.stock = 0;
});

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const catDe = id => CATEGORIAS.find(c => c.id === id);
const variantesDe = p => p.variantes?.opciones || null;
const varDe = (p, v) => variantesDe(p)?.find(o => o.id === v) || null;
const stockDe = (p, v) => (variantesDe(p) ? (varDe(p, v)?.stock ?? 0) : p.stock);
const hayStock = p => (variantesDe(p) ? variantesDe(p).some(o => o.stock > 0) : p.stock > 0);
const precioBase = (p, v) => (variantesDe(p) ? (varDe(p, v)?.precio ?? null) : p.precio);
const precioDe = (p, v) => { const b = precioBase(p, v); return b == null ? null : p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100) / 100) * 100 : b; };
const precioDesde = p => (variantesDe(p) ? Math.min(...variantesDe(p).map(o => o.precio)) : p.precio);
function varInicial(p, tension = '') {
  const ops = variantesDe(p);
  if (!ops) return '';
  return (ops.find(o => tension && o.tension === tension && o.stock > 0) || ops.find(o => o.stock > 0) || ops[0]).id;
}
const varNombre = (p, v) => varDe(p, v)?.label || '';

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), equipo = lista(f.equipo), piezas = lista(f.piezas), tension = lista(f.tension), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (equipo.length && !equipo.includes(p.equipo)) return false;
    if (piezas.length && !piezas.includes(p.pieza)) return false;
    if (tension.length && !tension.some(t => p.tension.includes(t))) return false;
    if (f.stock && !hayStock(p)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
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
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
  function piezas(filtros = {}) {
    return [...new Set(visibles.filter(p => coincide(p, filtros)).map(p => p.pieza))];
  }
  return { TOPE: tope, consultar, contar, obtener, piezas };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, p.codigo, p.codigo.replace(/-/g, ''), catDe(p.cat)?.nombre, EQUIPOS[p.equipo], PIEZAS[p.pieza]?.nombre,
      ...p.tension.map(t => `${t}v ${t} v`), ...p.specs.map(s => s.join(' ')), ...p.aplicaciones, p.desc,
      ...(variantesDe(p) || []).map(o => o.label), p.stock === 0 && !variantesDe(p) ? 'sin stock' : 'en stock',
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
  const palabras = norm(q).replace(/(\d+)\s*v\b/g, '$1v').split(/\s+/).filter(Boolean);
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

const Cart = {
  KEY: 'goguirecambio_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  maximo(p, v) { return stockDe(p, v); },
  enCarrito(id, v) { return this.get().filter(i => i.id === id && (i.v || '') === (v || '')).reduce((s, i) => s + i.qty, 0); },
  add(producto, v, qty = 1) {
    if (precioDe(producto, v) == null) return 0;
    const libre = this.maximo(producto, v) - this.enCarrito(producto.id, v);
    if (!(libre > 0)) return 0;
    const n = Math.min(Math.max(1, qty), libre);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === (v || ''));
    if (existing) existing.qty += n;
    else items.push({ id: producto.id, v: v || '', qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && (i.v || '') === (v || ''));
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p ? this.maximo(p, v) : 1));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === (v || '')))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); const pr = p ? precioDe(p, i.v) : null; return pr ? s + pr * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  rayo: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12Z"/></svg>',
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

const codigoDe = (p, v) => (variantesDe(p) && v ? `${p.codigo}-${v}` : p.codigo);
const tensionTxt = p => p.tension.map(t => TENSIONES[t]).join(' · ');
const fichaCorta = p => p.specs.filter(s => !/^Tensi/.test(s[0])).slice(0, 2).map(([k, v]) => (/^\d+$/.test(v) ? `${v} ${k.toLowerCase()}` : v)).join(' · ');
const consultaMsg = p => `Hola Gogui Recambio! Quiero consultar por ${p.nombre} (código ${p.codigo}).`;

function precioHTML(p, v, clase = 'precio') {
  const final = precioDe(p, v);
  const tachado = p.descuento > 0 ? `<s>${formatearPrecio(precioBase(p, v))}</s>` : '';
  return `<p class="${clase}" data-precio><b>${formatearPrecio(final)}</b>${tachado}</p>`;
}

function selectorHTML(p, v, nombre) {
  const ops = variantesDe(p);
  if (!ops) return '';
  return `<div class="variantes" role="radiogroup" aria-label="${esc(p.variantes.nombre)} de ${esc(p.nombre)}">${ops.map(o => {
    const sin = o.stock <= 0;
    return `<label class="variante${sin ? ' variante--sin' : ''}"><input type="radio" name="${nombre}" value="${esc(o.id)}"${o.id === v ? ' checked' : ''}${sin ? ' disabled' : ''}><span>${esc(o.corto)}</span></label>`;
  }).join('')}</div>`;
}

function badgeHTML(p, v) {
  const s = stockDe(p, v);
  if (s <= 0) return '<span class="etiqueta etiqueta--sin">Sin stock</span>';
  if (p.descuento > 0) return `<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`;
  if (s <= 2) return `<span class="etiqueta etiqueta--ultimas">${s === 1 ? 'Última unidad' : 'Últimas 2'}</span>`;
  if (p.alta >= NUEVO_DESDE) return '<span class="etiqueta">Recién ingresado</span>';
  return '';
}

function accionHTML(p, v) {
  if (stockDe(p, v) <= 0) return `<a class="prod-add prod-add--consulta" href="${wspLink(consultaMsg(p))}" target="_blank" rel="noopener" aria-label="Consultar ${esc(p.nombre)} por WhatsApp">${ICO.wsp}<span>Consultar</span></a>`;
  return `<button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button>`;
}

let cardSeq = 0;
function cardHTML(p, { anim = true, clase = '', tension = '', animTipo = 'subir' } = {}) {
  const v = varInicial(p, tension);
  const nombre = `var-${p.id}-${++cardSeq}`;
  const estado = animTipo === 'der' ? 'opacity:0;transform:translateX(64px)' : 'opacity:0;transform:translateY(40px)';
  const sin = stockDe(p, v) <= 0;
  return `<article class="pcard${clase ? ' ' + clase : ''}" data-id="${esc(p.id)}" data-v="${esc(v)}"${anim ? ` data-animate="${animTipo}" style="${estado}"` : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></a>
    ${badgeHTML(p, v)}
    <p class="pcard__cod"><span>${esc(codigoDe(p, v))}</span><span class="pcard__v">${esc(tensionTxt(p))}</span></p>
    ${sin ? '' : `<button type="button" class="pcard__ya" data-comprar="${esc(p.id)}">Comprar ahora</button>`}
  </div>
  <div class="pcard__info">
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    <p class="pcard__meta">${esc(fichaCorta(p))}</p>
    ${selectorHTML(p, v, nombre)}
    <div class="pcard__pie">
      ${precioHTML(p, v)}
      <div class="prod-actions">${accionHTML(p, v)}</div>
    </div>
  </div>
</article>`;
}

function filaHTML(p, i) {
  const v = varInicial(p);
  return `<li class="fila" data-id="${esc(p.id)}" data-v="${esc(v)}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <span class="fila__n">${String(i + 1).padStart(2, '0')}</span>
    <a class="fila__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="" width="160" height="160"></a>
    <div class="fila__txt">
      <p class="fila__cod">${esc(codigoDe(p, v))} · ${esc(tensionTxt(p))}</p>
      <h3 class="fila__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
      <p class="fila__meta">${esc(variantesDe(p) ? `${varNombre(p, v)} · también en ${variantesDe(p).filter(o => o.id !== v).map(o => o.corto).join(', ')}` : fichaCorta(p))}</p>
    </div>
    ${badgeHTML(p, v).replace('etiqueta', 'etiqueta etiqueta--fila')}
    ${precioHTML(p, v, 'precio fila__precio')}
    <div class="prod-actions">${accionHTML(p, v)}</div>
  </li>`;
}

function actualizarCard(card, v) {
  const p = getProducto(card.dataset.id);
  if (!p || precioDe(p, v) == null) return;
  card.dataset.v = v;
  const pr = card.querySelector('[data-precio]');
  if (pr) {
    pr.outerHTML = precioHTML(p, v);
    const nuevo = card.querySelector('[data-precio]');
    if (!reduceMotion) { nuevo.classList.add('precio--cambia'); setTimeout(() => nuevo.classList.remove('precio--cambia'), 450); }
  }
  const cod = card.querySelector('.pcard__cod span');
  if (cod) cod.textContent = codigoDe(p, v);
  const media = card.querySelector('.pcard__media');
  media?.querySelector('.etiqueta')?.remove();
  const html = badgeHTML(p, v);
  if (html && media) media.querySelector('.pcard__foto')?.insertAdjacentHTML('afterend', html);
  const acc = card.querySelector('.prod-actions');
  if (acc) acc.innerHTML = accionHTML(p, v);
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
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

const repuestos = n => `${n} ${n === 1 ? 'repuesto' : 'repuestos'}`;

function initMenuTienda(catActual = '') {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-lista]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => {
      const n = Tienda.contar({ cat: c.id });
      const subs = c.id === 'despieces' ? `<span class="nav-drop__subs">${Object.entries(EQUIPOS).map(([k, nom]) => `<a href="${URL_CATALOGO}?cat=despieces&amp;equipo=${k}">De ${nom.toLowerCase()} <small>${Tienda.contar({ cat: 'despieces', equipo: k })}</small></a>`).join('')}</span>` : '';
      return `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${c.id === catActual ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="56" height="56"><span><b>${esc(c.nombre)}</b><small>${repuestos(n)}</small></span></a>${subs}</li>`;
    }).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-cat]').forEach(el => { el.textContent = repuestos(Tienda.contar({ cat: el.dataset.cuentaCat })); });
  document.querySelectorAll('[data-cuenta-equipo]').forEach(el => { el.textContent = Tienda.contar({ equipo: el.dataset.cuentaEquipo }); });
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initVistaPrevia() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const filas = cont.dataset.modo === 'filas';
    const excluir = (cont.dataset.excluir || '').split(',').filter(Boolean);
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const orden = cont.dataset.orden || 'nuevos';
    const { items } = Tienda.consultar({ filtros: { excluir }, orden, limite });
    items.forEach(cachear);
    cont.innerHTML = filas ? items.map(filaHTML).join('') : items.map(p => cardHTML(p)).join('');
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, label, button')) return;
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
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    const prev = rail.querySelector('[data-rail-paso="-1"]');
    const next = rail.querySelector('[data-rail-paso="1"]');
    if (!vp || !track) return;
    const limite = Math.min(parseInt(rail.dataset.limite, 10) || 8, 8);
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite });
    items.forEach(cachear);
    track.innerHTML = items.map(p => `<li class="rail-item">${cardHTML(p, { animTipo: 'der' })}</li>`).join('');
    initRailDrag(vp);
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 20;
    const sync = () => {
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

function initTabs(box, alElegir) {
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  if (!tabs.length) return;
  const elegir = (t, foco = false) => {
    tabs.forEach(b => {
      const activo = b === t;
      b.setAttribute('aria-selected', String(activo));
      b.tabIndex = activo ? 0 : -1;
    });
    if (foco) t.focus();
    alElegir(t, true);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => elegir(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      elegir(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
    });
  });
  alElegir(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
}

function initEquipos() {
  const box = document.querySelector('[data-equipos]');
  if (!box) return;
  const grid = box.querySelector('[data-equipo-grid]');
  const link = box.querySelector('[data-equipo-link]');
  if (!grid) return;
  initTabs(box, (t, animar) => {
    const eq = t.dataset.equipo;
    const { items } = Tienda.consultar({ filtros: { equipo: eq }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    grid.setAttribute('aria-labelledby', t.id);
    if (link) {
      link.href = `${URL_CATALOGO}?equipo=${eq}`;
      link.querySelector('span').textContent = `Ver los ${Tienda.contar({ equipo: eq })} repuestos de ${EQUIPOS[eq].toLowerCase()}`;
    }
    if (animar) revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
}

function initDespiece() {
  const box = document.querySelector('[data-despiece]');
  if (!box) return;
  const img = box.querySelector('[data-despiece-img]');
  const puntos = box.querySelector('[data-despiece-puntos]');
  const lista = box.querySelector('[data-despiece-lista]');
  const ficha = box.querySelector('[data-despiece-ficha]');
  if (!img || !puntos || !lista || !ficha) return;
  let equipo = 'arranque';
  const marcar = id => {
    box.querySelectorAll('[data-pieza]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pieza === id)));
  };
  const pintarFicha = (id, animar) => {
    marcar(id);
    const info = PIEZAS[id];
    const n = DESPIECES[equipo].puntos.findIndex(x => x[0] === id) + 1;
    const { items } = Tienda.consultar({ filtros: { piezas: [id] }, orden: 'destacados', limite: 3 });
    items.forEach(cachear);
    const prods = items.length
      ? `<ul class="ficha__prods">${items.map(p => {
        const v = varInicial(p);
        const sin = stockDe(p, v) <= 0;
        return `<li class="ficha__prod" data-id="${esc(p.id)}" data-v="${esc(v)}"><button type="button" class="ficha__foto" data-quick="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="" width="120" height="120"></button><div><p class="ficha__pnom">${esc(p.nombre)}</p><p class="ficha__pprecio">${formatearPrecio(precioDe(p, v))}${sin ? ' · <span>sin stock</span>' : ''}</p></div>${accionHTML(p, v).replace('class="prod-add', 'class="prod-add prod-add--mini')}</li>`;
      }).join('')}</ul><a class="link-todo" href="${URL_CATALOGO}?pieza=${id}">Ver ${items.length === 1 ? 'el repuesto' : 'todos'} en el catálogo ${ICO.flecha}</a>`
      : `<p class="ficha__sin">Esta pieza la vendemos por código: mandanos el del alternador o una foto y te pasamos precio y disponibilidad.</p><a class="link-wsp" href="${wspLink(`Hola Gogui Recambio! Busco ${info.nombre.toLowerCase()} de alternador. Te paso el código:`)}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a>`;
    ficha.innerHTML = `<div class="ficha${animar && !reduceMotion ? ' ficha--entra' : ''}">
      <p class="ficha__n">${String(n).padStart(2, '0')} · ${esc(EQUIPOS[equipo])}</p>
      <h3 class="ficha__tit">${esc(info.nombre)}</h3>
      <p class="ficha__hace">${esc(info.hace)}</p>
      <p class="ficha__cuando"><b>Se cambia cuando</b>${esc(info.cuando)}</p>
      ${prods}
    </div>`;
  };
  const pintarEquipo = (eq, animar) => {
    equipo = eq;
    const d = DESPIECES[eq];
    img.src = d.img;
    img.alt = d.alt;
    puntos.innerHTML = d.puntos.map(([id, x, y], i) => `<button type="button" class="punto" style="left:${x}%;top:${y}%" data-pieza="${id}" aria-pressed="false" aria-label="${String(i + 1).padStart(2, '0')}: ${esc(PIEZAS[id].nombre)}"><span>${i + 1}</span></button>`).join('');
    lista.innerHTML = d.puntos.map(([id], i) => `<li><button type="button" class="despiece__item" data-pieza="${id}" aria-pressed="false"><span class="despiece__n">${String(i + 1).padStart(2, '0')}</span><span>${esc(PIEZAS[id].nombre)}</span>${ICO.flecha}</button></li>`).join('');
    pintarFicha(d.puntos[0][0], animar);
  };
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-pieza]');
    if (b) { pintarFicha(b.dataset.pieza, true); return; }
  });
  const panel = box.querySelector('[role="tabpanel"]');
  const tabsBox = box.querySelector('[data-despiece-tabs]');
  if (tabsBox) initTabs(tabsBox, (t, animar) => { pintarEquipo(t.dataset.equipo, animar); panel?.setAttribute('aria-labelledby', t.id); });
  else pintarEquipo('arranque', false);
}

function leerCantidad(scope) {
  const input = scope?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}
function sumarAlCarrito(p, v, { qty = 1, comprar = false } = {}) {
  const n = Cart.add(p, v, qty);
  const nom = `${p.nombre}${v ? ` (${varNombre(p, v)})` : ''}`;
  if (!n) {
    if (comprar && Cart.enCarrito(p.id, v)) { abrirCarrito(); return; }
    showToast(stockDe(p, v) > 0 ? `Ya tenés en el carrito las ${stockDe(p, v)} unidades que quedan de ${nom}.` : `${nom} está sin stock: consultanos por WhatsApp.`);
    return;
  }
  if (comprar) { abrirCarrito(); return; }
  showToast(`Sumaste ${n > 1 ? n + ' × ' : ''}${nom} al carrito`);
  if (n < qty) setTimeout(() => showToast(`Quedaban ${n} en stock.`), 400);
}

function initSteppers() {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-stepper] [data-step]');
    if (!b) return;
    const input = b.closest('[data-stepper]').querySelector('input');
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, (parseInt(input.value, 10) || 1) + parseInt(b.dataset.step, 10)));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (!input) return;
    const max = parseInt(input.max, 10) || 99;
    input.value = Math.max(1, Math.min(max, parseInt(input.value, 10) || 1));
  });
}

function initTarjetas() {
  document.addEventListener('change', e => {
    const radio = e.target.closest('.pcard .variantes input');
    if (!radio) return;
    actualizarCard(radio.closest('.pcard'), radio.value);
  });
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick) {
      e.preventDefault();
      const card = quick.closest('[data-v]');
      abrirQV(quick.dataset.quick, quick, card?.dataset.v);
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add && !add.closest('.qv')) {
      const card = add.closest('[data-v]');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p) return;
      sumarAlCarrito(p, card?.dataset.v || '', { comprar: add.hasAttribute('data-comprar') });
    }
  });
}

function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

let ultimoFoco = null;
let qvActual = null;
let qvVar = '';
function abrirQV(id, origen, v) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvActual = p;
  qvVar = variantesDe(p) ? (varDe(p, v) ? v : varInicial(p)) : '';
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.codigo, image: new URL(p.img, location.href).href, description: p.desc,
    offers: (variantesDe(p) || [{ id: '' }]).map(o => ({ '@type': 'Offer', name: o.label || p.nombre, priceCurrency: 'ARS', price: precioDe(p, o.id), availability: stockDe(p, o.id) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' })),
  });
}
function pintarQV() {
  const p = qvActual;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const v = qvVar;
  const { items: rel } = Tienda.consultar({ filtros: { equipo: p.equipo, excluir: p.id }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const stock = stockDe(p, v);
  const libre = Cart.maximo(p, v) - Cart.enCarrito(p.id, v);
  const ops = variantesDe(p);
  const disp = stock <= 0 ? 'Sin stock por ahora: consultanos y te avisamos cuando entra.' : stock <= 2 ? `${stock === 1 ? 'Queda 1 unidad' : `Quedan ${stock} unidades`}.` : 'En stock.';
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__galeria">
      <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000">${badgeHTML(p, v)}</div>
      <p class="qv__ilustr">Imagen ilustrativa</p>
    </div>
    <div class="qv__info">
      <p class="qv__cod">${esc(codigoDe(p, v))} · ${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      <p class="qv__desc">${esc(p.desc)}</p>
      <dl class="qv__specs">${p.specs.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}${v ? `<div><dt>${esc(p.variantes.nombre)}</dt><dd>${esc(varNombre(p, v))}</dd></div>` : ''}</dl>
      ${p.aplicaciones.length ? `<div class="qv__apps"><p class="qv__sub">Aplicaciones</p><ul>${p.aplicaciones.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      ${ops ? `<fieldset class="qv__vars"><legend>${esc(p.variantes.nombre)}</legend>${ops.map(o => {
        const sin = o.stock <= 0;
        return `<label class="qv-var${sin ? ' qv-var--sin' : ''}"><input type="radio" name="qv-var" value="${esc(o.id)}"${o.id === v ? ' checked' : ''}${sin ? ' disabled' : ''}><span class="qv-var__txt"><b>${esc(o.label)}</b><small>${sin ? 'Sin stock' : o.stock <= 2 ? `Quedan ${o.stock}` : 'En stock'}</small></span><span class="qv-var__precio">${formatearPrecio(precioDe(p, o.id))}</span></label>`;
      }).join('')}</fieldset>` : ''}
      <div class="qv__compra">
        ${precioHTML(p, v, 'precio qv__precio')}
        <p class="qv__stock${stock <= 0 ? ' qv__stock--sin' : ''}">${esc(disp)}</p>
      </div>
      <div class="qv__acc">
        ${stock > 0 ? `${libre > 0 ? `<div class="stepper stepper--grande" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><input type="number" value="1" min="1" max="${libre}" inputmode="numeric" aria-label="Cantidad"><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>` : ''}
        <button type="button" class="btn btn--cta" data-qv-add${libre > 0 ? '' : ' disabled'}>${ICO.carrito}${libre > 0 ? 'Agregar al carrito' : 'Ya está en tu carrito'}</button>
        <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>` : `<a class="btn btn--cta" href="${wspLink(consultaMsg(p))}" target="_blank" rel="noopener">${ICO.wsp}Consultar por WhatsApp</a>`}
      </div>
      <a class="qv__wsp" href="${wspLink(`Hola Gogui Recambio! Quiero confirmar si ${p.nombre} (código ${codigoDe(p, v)}) va en mi vehículo. Te paso el código de mi repuesto:`)}" target="_blank" rel="noopener">${ICO.wsp}<span>¿Va en tu vehículo? Mandanos el código del tuyo</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__sub">Para el mismo equipo</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><b>${variantesDe(r) ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
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
  qv.addEventListener('change', e => {
    const r = e.target.closest('input[name="qv-var"]');
    if (!r || !qvActual) return;
    qvVar = r.value;
    pintarQV();
    qv.querySelector(`input[name="qv-var"][value="${CSS.escape(qvVar)}"]`)?.focus({ preventScroll: true });
  });
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvActual;
    if (!p) return;
    const comprar = e.target.closest('[data-qv-comprar]');
    const add = e.target.closest('[data-qv-add]');
    if (!comprar && !add) return;
    const qty = leerCantidad(qv.querySelector('.qv__acc'));
    if (comprar) {
      Cart.add(p, qvVar, qty);
      if (!Cart.enCarrito(p.id, qvVar)) return;
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, qvVar, { qty });
    pintarQV();
    qv.querySelector('[data-qv-comprar]')?.focus();
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null, PARAMS.get('v') || '');
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
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
  const items = Cart.get().filter(i => { const p = getProducto(i.id); return p && precioDe(p, i.v) != null; });
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.rayo}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Buscá tu repuesto por pieza, código o tensión, o mandanos una foto por WhatsApp.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    const max = Cart.maximo(p, i.v);
    return `<li class="linea" data-linea="${esc(i.id)}" data-linea-v="${esc(i.v || '')}">
      <img src="${esc(p.img)}" alt="" width="80" height="80">
      <div><p class="linea__cod">${esc(codigoDe(p, i.v))}</p><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${i.v ? `${esc(varNombre(p, i.v))} · ` : ''}${formatearPrecio(precioDe(p, i.v))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span class="stepper__n" aria-live="polite">${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}Quitar</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioDe(p, i.v) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre}${i.v ? ` (${varNombre(p, i.v)})` : ''} [${codigoDe(p, i.v)}]: ${formatearPrecio(precioDe(p, i.v) * i.qty)}`; }).join('\n');
  const msg = `Hola Gogui Recambio! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\nMi nombre es: \nRetiro en el local / envío a: `;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>
    <p class="drawer__nota">El retiro o el envío se coordinan por WhatsApp después de la compra.</p>`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea;
    const v = linea.dataset.lineaV || '';
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
      return;
    }
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const it = Cart.get().find(i => i.id === id && (i.v || '') === v);
      if (!it) return;
      const nuevo = it.qty + parseInt(paso.dataset.lineaPaso, 10);
      if (nuevo < 1) return;
      Cart.setQty(id, v, nuevo);
      dr.querySelector(`[data-linea="${CSS.escape(id)}"][data-linea-v="${CSS.escape(v)}"] [data-linea-paso="${paso.dataset.lineaPaso}"]`)?.focus({ preventScroll: true });
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

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return '';
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const piezasCat = Object.fromEntries(Tienda.piezas().filter(k => PIEZAS[k]).map(k => [k, PIEZAS[k].nombre]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    equipo: valido(PARAMS.get('equipo'), EQUIPOS),
    piezas: new Set(lista('pieza').filter(c => piezasCat[c])),
    tension: new Set(lista('tension').filter(c => TENSIONES[c])),
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  const SETS = { pieza: estado.piezas, tension: estado.tension };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    const comoTab = cont.dataset.catOpciones === 'tabs';
    const opciones = [{ id: '', nombre: 'Todos' }, ...CATEGORIAS];
    cont.innerHTML = opciones.map(c => (comoTab
      ? `<button type="button" class="tab" data-filtro="cat" data-valor="${c.id}" aria-pressed="false">${esc(c.nombre)} <small data-cuenta-filtro-cat="${c.id}"></small></button>`
      : `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.id ? c.nombre : 'Todos los repuestos')}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`)).join('');
  });
  document.querySelectorAll('[data-equipo-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos'], ...Object.entries(EQUIPOS)].map(([k, n]) => `<label class="opt"><input type="radio" name="f-equipo" value="${k}" data-filtro="equipo"><span>${esc(k ? `Para el ${n.toLowerCase()}` : 'Todos')}</span><span class="opt__n" data-cuenta-filtro-equipo="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-pieza-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(piezasCat).map(([k, n]) => `<label class="opt" data-opt-pieza="${k}"><input type="checkbox" value="${k}" data-f="pieza"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-pieza="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-tension-opciones]').forEach(cont => {
    cont.innerHTML = Object.entries(TENSIONES).map(([k, n]) => `<label class="opt"><input type="checkbox" value="${k}" data-f="tension"><span>${esc(n)}</span><span class="opt__n" data-cuenta-filtro-tension="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-tension-chips]').forEach(cont => {
    cont.innerHTML = Object.entries(TENSIONES).map(([k, n]) => `<button type="button" class="chip" data-chip-tension="${k}" aria-pressed="false">${esc(n)}</button>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.equipo && sin !== 'equipo') f.equipo = estado.equipo;
    if (estado.piezas.size && sin !== 'pieza') f.piezas = [...estado.piezas];
    if (estado.tension.size && sin !== 'tension') f.tension = [...estado.tension];
    if (estado.stock && sin !== 'stock') f.stock = true;
    return f;
  };
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.equipo) chips.push(['equipo', '', `Para el ${EQUIPOS[estado.equipo].toLowerCase()}`]);
    estado.piezas.forEach(v => chips.push(['pieza', v, piezasCat[v]]));
    estado.tension.forEach(v => chips.push(['tension', v, TENSIONES[v]]));
    if (estado.stock) chips.push(['stock', '', 'Con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    Object.entries(SETS).forEach(([k, set]) => document.querySelectorAll(`input[data-f="${k}"]`).forEach(el => { el.checked = set.has(el.value); }));
    document.querySelectorAll('[data-chip-tension]').forEach(b => b.setAttribute('aria-pressed', String(estado.tension.has(b.dataset.chipTension))));
    const st = document.querySelector('input[data-f-stock]');
    if (st) st.checked = estado.stock;
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => { const id = el.dataset.cuentaFiltroCat; el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-equipo]').forEach(el => { const k = el.dataset.cuentaFiltroEquipo; el.textContent = Tienda.contar({ ...filtrosDe('equipo'), ...(k ? { equipo: k } : {}) }); });
    document.querySelectorAll('[data-cuenta-filtro-tension]').forEach(el => { el.textContent = Tienda.contar({ ...filtrosDe('tension'), tension: [el.dataset.cuentaFiltroTension] }); });
    document.querySelectorAll('[data-cuenta-filtro-pieza]').forEach(el => {
      const k = el.dataset.cuentaFiltroPieza;
      const n = Tienda.contar({ ...filtrosDe('pieza'), piezas: [k] });
      el.textContent = n;
      const opt = el.closest('[data-opt-pieza]');
      if (opt) opt.hidden = n === 0 && !estado.piezas.has(k);
    });
    const cs = document.querySelector('[data-cuenta-filtro-stock]');
    if (cs) cs.textContent = Tienda.contar({ ...filtrosDe('stock'), stock: true });
    const enPanel = estado.piezas.size + (estado.equipo ? 1 : 0) + (estado.stock ? 1 : 0)
      + (document.querySelector('#filtros [data-tension-opciones]') ? estado.tension.size : 0)
      + (document.querySelector('#filtros [data-cat-opciones]') && estado.cat ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const pz = estado.piezas.size === 1 ? piezasCat[[...estado.piezas][0]] : '';
    const tv = estado.tension.size === 1 ? TENSIONES[[...estado.tension][0]] : '';
    const titulo = pz || (cat ? (estado.equipo && cat.id === 'despieces' ? `Despieces de ${EQUIPOS[estado.equipo].toLowerCase()}` : cat.nombre) : estado.equipo ? `Repuestos de ${EQUIPOS[estado.equipo].toLowerCase()}` : tv ? `Repuestos de ${tv}` : 'Todos los repuestos');
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = pz ? PIEZAS[[...estado.piezas][0]].hace : cat ? cat.bajada : estado.equipo ? `Motores completos y cada pieza del ${EQUIPOS[estado.equipo].toLowerCase()}, por separado.` : 'Arranques, alternadores, sus despieces y lámparas. Buscá por pieza, código o tensión.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todos los repuestos'; miga.textContent = titulo; }
    document.title = `${titulo} — Gogui Recambio`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'equipo', 'pieza', 'tension', 'stock', 'q', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.equipo) u.searchParams.set('equipo', estado.equipo);
    Object.entries(SETS).forEach(([k, set]) => { if (set.size) u.searchParams.set(k, [...set].join(',')); });
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const tension = estado.tension.size === 1 ? [...estado.tension][0] : '';
    const html = res.items.map(p => cardHTML(p, { tension })).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${repuestos(total)}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más repuestos para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.equipo = ''; estado.q = ''; estado.stock = false;
    Object.values(SETS).forEach(s => s.clear());
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    if (e.target.closest('input[data-f-stock]')) { estado.stock = e.target.checked; aplicar(); return; }
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = SETS[multi.dataset.f];
      if (!set) return;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    estado[el.dataset.filtro] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const chip = e.target.closest('[data-chip-tension]');
    if (chip) {
      const k = chip.dataset.chipTension;
      if (estado.tension.has(k)) estado.tension.delete(k); else estado.tension.add(k);
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (SETS[f]) SETS[f].delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else if (f === 'stock') estado.stock = false;
      else estado[f] = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
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
    const esCajon = () => window.getComputedStyle(filtros).position === 'fixed';
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => {
      filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
      filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true');
      filtros.querySelector('button, input')?.focus({ preventScroll: true });
    });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (!esCajon()) return; if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
    if (esCajon()) filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return estado.cat;
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const pos = [-27.77433, -64.27127];
    const mapa = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView(pos, 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    L.marker(pos, { icon: L.divIcon({ className: 'mapa-pin', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30] }), keyboard: false }).addTo(mapa);
  } catch (e) { console.error(e); }
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.08, duration: 1.8, clearProps: 'transform' }, 0);
  paso('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 32, opacity: 0, duration: 1.2 }, 0.2);
  paso('.hero-lead', { y: 22, opacity: 0, duration: 1 }, 0.4);
  paso('.hero-buscar', { y: 22, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.5);
  paso('.hero-ctas .btn', { y: 18, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.hero-chips .chip', { y: 12, opacity: 0, duration: 0.7, stagger: 0.05, clearProps: 'transform,opacity' }, 0.7);
  paso('.rotulo__linea', { scaleX: 0, duration: 0.8, stagger: 0.12, clearProps: 'transform' }, 0.8);
  paso('.rotulo__txt', { opacity: 0, x: -8, duration: 0.7, stagger: 0.12, clearProps: 'transform,opacity' }, 0.95);
  paso('.rotulo__punto', { scale: 0.92, opacity: 0, duration: 0.6, stagger: 0.12, clearProps: 'transform,opacity' }, 0.75);
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
  initEquipos,
  initVistaPrevia,
  initDespiece,
  initCuentas,
  () => { const cat = PAGINA === 'catalogo' ? initCatalogo() : ''; initMenuTienda(cat); },
  initSteppers,
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initMapa,
  initHeroMotion,
  initReveals,
  initParallax,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
