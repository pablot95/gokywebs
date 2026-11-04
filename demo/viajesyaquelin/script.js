const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491134231789';
const MARCA = 'Viajes yaquelin';
const POR_PAGINA = 16;
const TOPE_PAX = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const ZONA_AR = 'America/Argentina/Buenos_Aires';
const hoyAR = () => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_AR, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); } catch { return new Date().toISOString().slice(0, 10); } };
const HOY = hoyAR();

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
  { id: 'nacional', nombre: 'Nacionales', largo: 'Paquetes nacionales', bajada: 'Patagonia, Litoral, Cuyo y Norte', img: 'images/p-mendoza.webp' },
  { id: 'internacional', nombre: 'Internacionales', largo: 'Paquetes internacionales', bajada: 'Caribe, Brasil, Europa y Mediterráneo', img: 'images/p-grecia.webp' },
];
const TIPOS = [
  { id: 'naturaleza', nombre: 'Naturaleza' },
  { id: 'playa', nombre: 'Playa' },
  { id: 'ciudades', nombre: 'Ciudades y cultura' },
  { id: 'vinos', nombre: 'Vinos y gastronomía' },
  { id: 'nieve', nombre: 'Nieve' },
];
const DURACIONES = [
  { id: 'corta', nombre: 'Hasta 4 noches', min: 0, max: 4 },
  { id: 'media', nombre: '5 a 7 noches', min: 5, max: 7 },
  { id: 'larga', nombre: '8 noches o más', min: 8, max: 99 },
];
const TRANSPORTES = [
  { id: 'aereo', nombre: 'Aéreo' },
  { id: 'bus', nombre: 'Bus' },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'proxima', nombre: 'Próxima salida' },
  { id: 'corta', nombre: 'Menos noches' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES_C = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MESES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const PRODUCTOS = [
  { id: 'el-calafate-glaciares', codigo: 'VY-101', cat: 'nacional', zona: 'Patagonia', destino: 'El Calafate, Santa Cruz', nombre: 'El Calafate y glaciares', dias: 5, noches: 4, transporte: 'aereo', moneda: 'ARS', precio: 1180000, tipos: ['naturaleza'], rango: 1,
    img: { src: 'images/p-calafate.webp', lado: 900, alt: 'Lago turquesa con montañas nevadas y bosque en la orilla' },
    desc: 'Cuatro noches frente a los lagos patagónicos con la excursión al glaciar Perito Moreno incluida.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '4 noches de hotel con desayuno', 'Traslados aeropuerto, hotel y aeropuerto', 'Excursión al glaciar Perito Moreno con pasarelas', 'Asistencia al viajero'],
    itinerario: [['Llegada a El Calafate', 'Traslado al hotel y tarde libre en el centro.'], ['Glaciar Perito Moreno', 'Excursión de día completo con recorrido por las pasarelas.'], ['Día libre', 'Opcional: navegación por el lago Argentino.'], ['Día libre', 'Opcional: excursión a El Chaltén.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2026-11-28', cupos: 8 }, { f: '2026-12-12', cupos: 6 }, { f: '2027-01-16', cupos: 12 }, { f: '2027-02-13', cupos: 10 }, { f: '2027-03-13', cupos: 14 }],
    claves: ['perito moreno', 'santa cruz', 'sur', 'lagos', 'patagonia'] },
  { id: 'cataratas-iguazu', codigo: 'VY-102', cat: 'nacional', zona: 'Litoral', destino: 'Puerto Iguazú, Misiones', nombre: 'Cataratas del Iguazú', dias: 4, noches: 3, transporte: 'aereo', moneda: 'ARS', precio: 890000, tipos: ['naturaleza'], rango: 3,
    img: { src: 'images/p-iguazu.webp', lado: 900, alt: 'Cascada ancha que cae entre la selva sobre un pozo verde' },
    desc: 'Tres noches en Puerto Iguazú con la visita al Parque Nacional del lado argentino.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '3 noches de hotel con desayuno', 'Traslados aeropuerto, hotel y aeropuerto', 'Excursión a Cataratas, lado argentino', 'Asistencia al viajero'],
    itinerario: [['Llegada a Puerto Iguazú', 'Traslado al hotel y tarde libre.'], ['Cataratas, lado argentino', 'Circuitos superior e inferior y Garganta del Diablo.'], ['Día libre', 'Opcional: lado brasileño o Hito Tres Fronteras.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2026-11-21', cupos: 10 }, { f: '2026-12-05', cupos: 4 }, { f: '2027-01-09', cupos: 16 }, { f: '2027-02-20', cupos: 12 }, { f: '2027-03-27', cupos: 18 }],
    claves: ['cataratas', 'misiones', 'garganta del diablo', 'selva', 'iguazu'] },
  { id: 'mendoza-caminos-del-vino', codigo: 'VY-103', cat: 'nacional', zona: 'Cuyo', destino: 'Mendoza', nombre: 'Mendoza y caminos del vino', dias: 4, noches: 3, transporte: 'aereo', moneda: 'ARS', precio: 760000, tipos: ['vinos'], rango: 5,
    img: { src: 'images/p-mendoza.webp', lado: 900, alt: 'Hileras de viñedos con la cordillera nevada al fondo' },
    desc: 'Bodegas, ciudad y cordillera en tres noches, con dos visitas a bodegas con degustación.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '3 noches de hotel con desayuno', 'Traslados aeropuerto, hotel y aeropuerto', 'Visita a dos bodegas con degustación', 'City tour por Mendoza'],
    itinerario: [['Llegada a Mendoza', 'Traslado al hotel y city tour por la tarde.'], ['Caminos del vino', 'Visita a dos bodegas de Luján de Cuyo con degustación.'], ['Día libre', 'Opcional: alta montaña y Puente del Inca.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2026-11-26', cupos: 12 }, { f: '2026-12-17', cupos: 8 }, { f: '2027-01-28', cupos: 14 }, { f: '2027-03-04', cupos: 16 }],
    claves: ['bodegas', 'vino', 'malbec', 'cordillera', 'lujan de cuyo'] },
  { id: 'talampaya-valle-de-la-luna', codigo: 'VY-104', cat: 'nacional', zona: 'Norte', destino: 'La Rioja y San Juan', nombre: 'Talampaya y Valle de la Luna', dias: 6, noches: 3, transporte: 'bus', moneda: 'ARS', precio: 640000, tipos: ['naturaleza'], rango: 7,
    img: { src: 'images/p-talampaya.webp', lado: 900, alt: 'Paredones de roca roja con vegetación baja bajo un cielo despejado' },
    desc: 'Viaje en bus semicama con tres noches de hotel y los dos parques de paredones rojos.',
    incluye: ['Bus semicama ida y vuelta desde Buenos Aires', '3 noches de hotel con desayuno', 'Excursión al Parque Nacional Talampaya', 'Excursión a Ischigualasto, Valle de la Luna', 'Coordinador durante el viaje'],
    itinerario: [['Salida en bus', 'Viaje nocturno desde Buenos Aires.'], ['Llegada a Villa Unión', 'Alojamiento y tarde libre.'], ['Talampaya', 'Recorrido por el cañón y sus paredones.'], ['Valle de la Luna', 'Circuito por Ischigualasto.'], ['Regreso en bus', 'Viaje nocturno.'], ['Llegada a Buenos Aires', 'Fin de los servicios.']],
    salidas: [{ f: '2026-12-03', cupos: 18 }, { f: '2027-02-04', cupos: 24 }, { f: '2027-03-18', cupos: 30 }, { f: '2027-04-08', cupos: 30 }],
    claves: ['la rioja', 'san juan', 'ischigualasto', 'canon', 'roca roja'] },
  { id: 'bariloche-temporada-de-nieve', codigo: 'VY-105', cat: 'nacional', zona: 'Patagonia', destino: 'San Carlos de Bariloche, Río Negro', nombre: 'Bariloche en temporada de nieve', dias: 8, noches: 7, transporte: 'aereo', moneda: 'ARS', precio: 1450000, tipos: ['nieve'], rango: 8, etiqueta: 'Invierno 2027',
    img: { src: 'images/p-bariloche.webp', lado: 900, alt: 'Cabaña de madera y piedra cubierta de nieve frente a montañas' },
    desc: 'Siete noches para las vacaciones de invierno, con traslado al cerro Catedral y circuito chico.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '7 noches de hotel con desayuno', 'Traslados aeropuerto, hotel y aeropuerto', 'Traslado ida y vuelta al cerro Catedral', 'Excursión al circuito chico'],
    itinerario: [['Llegada a Bariloche', 'Traslado al hotel.'], ['Circuito chico', 'Excursión por la costa del Nahuel Huapi.'], ['Cerro Catedral', 'Traslado al cerro y día de nieve.'], ['Días libres', 'Del día 4 al 7, opcionales de nieve y lagos.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2027-07-10', cupos: 20 }, { f: '2027-07-17', cupos: 12 }, { f: '2027-07-24', cupos: 8 }, { f: '2027-08-07', cupos: 16 }],
    claves: ['cerro catedral', 'esqui', 'vacaciones de invierno', 'rio negro', 'nahuel huapi'] },
  { id: 'punta-cana-all-inclusive', codigo: 'VY-201', cat: 'internacional', zona: 'Caribe', destino: 'Punta Cana, República Dominicana', nombre: 'Punta Cana all inclusive', dias: 8, noches: 7, transporte: 'aereo', moneda: 'USD', precio: 1690, tipos: ['playa'], rango: 2,
    img: { src: 'images/p-punta-cana.webp', lado: 900, alt: 'Playa de arena blanca con palmeras y agua turquesa' },
    desc: 'Siete noches en hotel all inclusive frente al mar, con aéreo y traslados.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '7 noches en hotel all inclusive', 'Traslados aeropuerto, hotel y aeropuerto', 'Asistencia al viajero'],
    itinerario: [['Llegada a Punta Cana', 'Traslado al hotel.'], ['Días de playa', 'Del día 2 al 7, régimen all inclusive.'], ['Opcionales', 'Isla Saona o catamarán, a contratar en destino.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2026-12-12', cupos: 6 }, { f: '2027-01-09', cupos: 10 }, { f: '2027-01-23', cupos: 8 }, { f: '2027-02-06', cupos: 12 }, { f: '2027-03-06', cupos: 14 }],
    claves: ['caribe', 'republica dominicana', 'todo incluido', 'playa', 'mar'] },
  { id: 'rio-de-janeiro-y-paraty', codigo: 'VY-202', cat: 'internacional', zona: 'Brasil', destino: 'Río de Janeiro y Paraty, Brasil', nombre: 'Río de Janeiro y Paraty', dias: 8, noches: 7, transporte: 'aereo', moneda: 'USD', precio: 1240, tipos: ['playa', 'ciudades'], rango: 4,
    img: { src: 'images/p-paraty.webp', lado: 900, alt: 'Calle empedrada con casas coloniales de colores, flores fucsia y una iglesia al fondo' },
    desc: 'Cuatro noches en Río y tres en el casco colonial de Paraty, con traslado entre las dos ciudades.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '4 noches en Río de Janeiro con desayuno', '3 noches en Paraty con desayuno', 'Traslados y traslado Río–Paraty', 'City tour en Río de Janeiro'],
    itinerario: [['Llegada a Río', 'Traslado al hotel en Copacabana.'], ['City tour', 'Cristo Redentor y Pan de Azúcar.'], ['Días libres en Río', 'Playas de la zona sur.'], ['Traslado a Paraty', 'Viaje por la costa verde.'], ['Paraty', 'Casco colonial y playas cercanas.'], ['Regreso', 'Traslado al aeropuerto de Río.']],
    salidas: [{ f: '2026-12-19', cupos: 8 }, { f: '2027-01-16', cupos: 12 }, { f: '2027-02-13', cupos: 10 }, { f: '2027-03-20', cupos: 16 }],
    claves: ['brasil', 'rio', 'colonial', 'copacabana', 'playa'] },
  { id: 'europa-clasica', codigo: 'VY-203', cat: 'internacional', zona: 'Europa', destino: 'París, Brujas y Ámsterdam', nombre: 'Europa clásica: París, Brujas y Ámsterdam', dias: 12, noches: 10, transporte: 'aereo', moneda: 'USD', precio: 3480, tipos: ['ciudades'], rango: 6,
    img: { src: 'images/p-europa.webp', lado: 900, alt: 'Canal con puente de piedra, casas antiguas y flores rosadas en primer plano' },
    desc: 'Circuito de diez noches por tres ciudades, con bus y guía en español entre una y otra.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '10 noches de hotel con desayuno', 'Bus con guía en español entre ciudades', 'Visitas panorámicas en las tres ciudades', 'Asistencia al viajero'],
    itinerario: [['Llegada a París', 'Traslado al hotel.'], ['París', 'Visita panorámica y días libres.'], ['Brujas', 'Viaje en bus y recorrido por los canales.'], ['Ámsterdam', 'Visita panorámica y tarde libre.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2027-04-10', cupos: 14 }, { f: '2027-05-08', cupos: 18 }, { f: '2027-06-05', cupos: 10 }],
    claves: ['francia', 'belgica', 'holanda', 'paises bajos', 'circuito', 'paris', 'brujas', 'amsterdam'] },
  { id: 'atenas-y-santorini', codigo: 'VY-204', cat: 'internacional', zona: 'Mediterráneo', destino: 'Atenas y Santorini, Grecia', nombre: 'Atenas y Santorini', dias: 10, noches: 9, transporte: 'aereo', moneda: 'USD', precio: 3150, tipos: ['playa', 'ciudades'], rango: 9,
    img: { src: 'images/p-grecia.webp', lado: 900, alt: 'Casas blancas con cúpula azul y buganvilias sobre el mar Egeo' },
    desc: 'Cuatro noches en Atenas y cinco en Santorini, con el ferry entre la ciudad y la isla.',
    incluye: ['Aéreo ida y vuelta desde Buenos Aires', '4 noches en Atenas con desayuno', '5 noches en Santorini con desayuno', 'Ferry Atenas–Santorini', 'Visita guiada a la Acrópolis'],
    itinerario: [['Llegada a Atenas', 'Traslado al hotel.'], ['Acrópolis', 'Visita guiada y tarde libre en Plaka.'], ['Ferry a Santorini', 'Navegación por el Egeo.'], ['Santorini', 'Oia, Fira y playas volcánicas.'], ['Regreso', 'Traslado al aeropuerto.']],
    salidas: [{ f: '2027-05-15', cupos: 10 }, { f: '2027-06-12', cupos: 8 }, { f: '2027-09-11', cupos: 12 }],
    claves: ['grecia', 'islas griegas', 'egeo', 'acropolis', 'oia'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const durDe = noches => DURACIONES.find(d => noches >= d.min && noches <= d.max)?.id || '';
const fechaD = f => new Date(`${f}T12:00:00Z`);
const fechaCorta = f => { const d = fechaD(f); return `${DIAS_C[d.getUTCDay()]} ${d.getUTCDate()} ${MESES_C[d.getUTCMonth()]}`; };
const fechaLarga = f => { const d = fechaD(f); return `${DIAS_C[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES_L[d.getUTCMonth()]} de ${d.getUTCFullYear()}`; };
const mesNombre = m => { const [a, n] = m.split('-').map(Number); return `${MESES_L[n - 1].charAt(0).toUpperCase()}${MESES_L[n - 1].slice(1)} ${a}`; };

const Tienda = crearTienda(PRODUCTOS, { tope: 100, hoy: HOY });

function crearTienda(coleccion, { tope = 100, hoy = HOY } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion
    .filter(p => p.visible !== false)
    .map(p => ({ ...p, salidas: (p.salidas || []).filter(s => s.f >= hoy && s.cupos > 0).sort((a, b) => a.f.localeCompare(b.f)) }))
    .filter(p => p.salidas.length);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.destino, p.zona, p.codigo, p.desc, catDe(p.cat).nombre, catDe(p.cat).largo, nombreDe(TRANSPORTES, p.transporte),
    ...(p.tipos || []).map(t => nombreDe(TIPOS, t)), ...(p.incluye || []), ...(p.claves || []),
    ...p.salidas.map(s => MESES_L[Number(s.f.slice(5, 7)) - 1]),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), dur = lista(f.dur), trans = lista(f.trans), mes = lista(f.mes), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.some(t => (p.tipos || []).includes(t))) return false;
    if (dur.length && !dur.includes(durDe(p.noches))) return false;
    if (trans.length && !trans.includes(p.transporte)) return false;
    if (mes.length && !p.salidas.some(s => mes.includes(s.f.slice(0, 7)))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
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
      case 'proxima': return (a, b) => a.salidas[0].f.localeCompare(b.salidas[0].f) || desempate(a, b);
      case 'corta': return (a, b) => a.noches - b.noches || a.dias - b.dias || desempate(a, b);
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
    let n = 0;
    const desde = {};
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde[p.moneda] = Math.min(desde[p.moneda] ?? Infinity, p.precio); } });
    return { n, desde };
  }
  function meses() {
    return [...new Set(visibles.flatMap(p => p.salidas.map(s => s.f.slice(0, 7))))].sort();
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, meses, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = (n, moneda = 'ARS') => (moneda === 'USD' ? 'US$ ' : '$') + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const salidaDe = (p, v) => p?.salidas?.find(s => s.f === v) || null;
const varValida = (p, v) => (salidaDe(p, v) ? v : p?.salidas?.[0]?.f || '');
const topeDe = (p, v) => Math.max(1, Math.min(TOPE_PAX, salidaDe(p, varValida(p, v))?.cupos || 1));
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const desdeTxt = r => Object.entries(r.desde).map(([m, v]) => formatearPrecio(v, m)).join(' · ');

const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const Cart = {
  KEY: 'viajesyaquelin_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = null, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    if (!vv) return 0;
    const tope = topeDe(producto, vv);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, tope));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    if (existing) existing.qty = Math.min(existing.qty + n, tope);
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, topeDe(getProducto(id), v)));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  totales() {
    return this.get().reduce((t, i) => { const p = getProducto(i.id); if (p) t[p.moneda] = (t[p.moneda] || 0) + p.precio * i.qty; return t; }, {});
  },
  total(moneda = 'ARS') { return this.totales()[moneda] || 0; },
  sync() {
    const limpias = [];
    let changed = false;
    this.get().forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const tope = topeDe(p, v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, tope));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, tope); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const totalesTxt = () => Object.entries(Cart.totales()).sort(([a], [b]) => a.localeCompare(b)).map(([m, v]) => ({ m, txt: formatearPrecio(v, m) }));

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  avion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const icoTrans = p => (p.transporte === 'bus' ? ICO.bus : ICO.avion);

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
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1, max = TOPE_PAX, extra = '') => `<div class="stepper${extra}" data-stepper data-max="${max}"><button type="button" data-paso="-1" aria-label="Un pasajero menos">${ICO.menos}</button><output data-qty aria-label="Pasajeros">${n}</output><button type="button" data-paso="1" aria-label="Un pasajero más">${ICO.mas}</button></div>`;
const metaTxt = p => `${p.dias} días · ${plural(p.noches, 'noche', 'noches')}`;
const lugaresTxt = s => plural(s.cupos, 'lugar', 'lugares');

function cardHTML(p, estilo = 'ticket', animar = true) {
  const der = estilo === 'rail';
  const anim = animar ? ` data-animate="${der ? 'der' : 'subir'}" style="opacity:0;transform:${der ? 'translateX(56px)' : 'translateY(44px)'}"` : '';
  const s = p.salidas[0];
  const cat = catDe(p.cat);
  return `<article class="prod prod--${estilo}" data-id="${esc(p.id)}"${anim}>
  <div class="prod__in">
    <div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el itinerario de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button><span class="prod__codigo">${esc(p.codigo)}</span>${p.etiqueta ? `<span class="prod__etiqueta">${esc(p.etiqueta)}</span>` : ''}</div>
    <div class="prod__info">
      <p class="prod__zona">${esc(p.zona)} <span>· ${esc(cat.nombre.replace(/es$/, ''))}</span></p>
      <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
      <p class="prod__meta"><span class="prod__trans" title="${esc(nombreDe(TRANSPORTES, p.transporte))}">${icoTrans(p)}</span>${esc(metaTxt(p))}</p>
      <p class="prod__salida">Sale ${esc(fechaCorta(s.f))}<span> · ${esc(lugaresTxt(s))}</span></p>
    </div>
    <div class="prod__stub">
      <p class="prod__precio"><small>Desde, por pasajero</small><span class="precio">${formatearPrecio(p.precio, p.moneda)}</span></p>
      <div class="prod-actions">${stepperHTML(1, topeDe(p, s.f))}<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" data-salida="${esc(s.f)}" aria-label="Agregar ${esc(p.nombre)}, salida ${esc(fechaCorta(s.f))}, al pedido">${ICO.carrito}<span>Agregar</span></button></div>
      <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}" data-salida="${esc(s.f)}">Comprar ahora ${ICO.flecha}</button>
    </div>
  </div>
</article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  const tot = totalesTxt().map(t => t.txt).join(' y ');
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el pedido, ${plural(n, 'pasajero', 'pasajeros')}, ${tot}` : 'Abrir el pedido'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${plural(i.qty, 'pasajero', 'pasajeros')} × ${p.nombre} (${p.codigo}), salida ${fechaCorta(i.v)} — ${formatearPrecio(p.precio * i.qty, p.moneda)}` : '';
  }).filter(Boolean);
  const tot = totalesTxt().map(t => `Total ${t.m}: ${t.txt}`);
  return `Hola! Quiero hacer este pedido de paquetes en ${MARCA}:\n${lineas.join('\n')}\n${tot.join('\n')}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  const tope = topeDe(p, i.v);
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">Salida ${esc(fechaCorta(i.v))} · ${formatearPrecio(p.precio, p.moneda)} c/u</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Un pasajero menos en ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Un pasajero más en ${esc(p.nombre)}"${i.qty >= tope ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(p.precio * i.qty, p.moneda)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)} del pedido">${ICO.x}</button>
</li>`;
}

function initDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const lista = drawer.querySelector('[data-drawer-lista]');
  const vacio = drawer.querySelector('[data-drawer-vacio]');
  const foot = drawer.querySelector('[data-drawer-foot]');
  const totales = drawer.querySelector('[data-drawer-totales]');
  const cuenta = drawer.querySelector('[data-drawer-cuenta]');
  const wsp = drawer.querySelector('[data-drawer-wsp]');
  const pintar = () => {
    const items = Cart.get();
    const n = Cart.count();
    cuenta.textContent = n ? `· ${plural(n, 'pasajero', 'pasajeros')}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    totales.innerHTML = totalesTxt().map(t => `<p class="carrito-total"><span>Total ${t.m === 'USD' ? 'en dólares' : 'en pesos'}</span><output>${t.txt}</output></p>`).join('');
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${window.CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» del pedido`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const vv = varValida(p, v);
  const n = Cart.add(p, vv, qty);
  if (!n) return 0;
  showToast(`Sumaste ${plural(n, 'pasajero', 'pasajeros')} a «${p.nombre}», salida ${fechaCorta(vv)}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;
function moverStepper(paso) {
  const st = paso.closest('[data-stepper]');
  const out = st?.querySelector('[data-qty]');
  if (!out) return 1;
  const max = parseInt(st.dataset.max, 10) || TOPE_PAX;
  const n = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), max));
  out.textContent = n;
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const paso = e.target.closest('[data-paso]');
    if (paso) { moverStepper(paso); return; }
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const n = sumar(s ? s.dataset.sumar : c.dataset.comprar, b.dataset.salida, cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out) out.textContent = '1';
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, salida: qv.dataset.salida || null });
    }
  });
}

let qvEstado = null;
function pintarSubtotal(modal) {
  const p = qvEstado && getProducto(qvEstado.id);
  if (!p) return;
  const cont = modal.querySelector('.qv__grid');
  const n = cantidadElegida(cont);
  const out = modal.querySelector('[data-qv-subtotal]');
  if (out) out.textContent = `${plural(n, 'pasajero', 'pasajeros')} · ${formatearPrecio(p.precio * n, p.moneda)}`;
}
function elegirSalida(modal, f) {
  const p = qvEstado && getProducto(qvEstado.id);
  if (!p) return;
  const v = varValida(p, f);
  qvEstado.salida = v;
  modal.querySelectorAll('[data-salida-opcion]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.salidaOpcion === v)));
  const st = modal.querySelector('.qv__acciones [data-stepper]');
  const tope = topeDe(p, v);
  if (st) {
    st.dataset.max = tope;
    const out = st.querySelector('[data-qty]');
    out.textContent = Math.min(parseInt(out.textContent, 10) || 1, tope);
  }
  const wsp = modal.querySelector('[data-qv-wsp]');
  if (wsp) wsp.href = wspHref(`Hola! Quiero consultar por «${p.nombre}» (${p.codigo}), salida ${fechaCorta(v)}, en ${MARCA}.`);
  pintarSubtotal(modal);
}
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, salida = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, salida: varValida(p, salida) };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const tipos = (p.tipos || []).map(t => nombreDe(TIPOS, t)).join(' · ');
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"><figcaption>${esc(p.codigo)}</figcaption></figure>
  <div class="qv__info">
    <p class="qv__meta"><span class="prod__zona">${esc(p.zona)} · ${esc(catDe(p.cat).nombre)}</span><span>${esc(tipos)}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__destino">${icoTrans(p)}${esc(p.destino)} · ${esc(metaTxt(p))} · ${esc(nombreDe(TRANSPORTES, p.transporte))}</p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <div class="qv__bloque"><p class="qv__t">Qué incluye</p><ul class="qv__incluye">${p.incluye.map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul></div>
    <details class="qv__itinerario"><summary>Itinerario día por día</summary><ol>${p.itinerario.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol></details>
    <div class="qv__bloque"><p class="qv__t">Elegí la salida</p><div class="salidas" role="group" aria-label="Salidas">${p.salidas.map(s => `<button type="button" class="salida" data-salida-opcion="${esc(s.f)}" aria-pressed="${s.f === qvEstado.salida}"><b>${esc(fechaCorta(s.f))}</b><small>${esc(lugaresTxt(s))}</small></button>`).join('')}</div></div>
    <div class="qv__compra">
      <p class="precio precio--qv"><small>Por pasajero, base doble</small>${formatearPrecio(p.precio, p.moneda)}</p>
      <p class="qv__subtotal" data-qv-subtotal aria-live="polite"></p>
    </div>
    <div class="qv__acciones">${stepperHTML(1, topeDe(p, qvEstado.salida))}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al pedido</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" data-qv-wsp href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» (${p.codigo}) en ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar este paquete por WhatsApp</span></a>
    <p class="qv__nota">Tarifa, salidas y lugares de demostración, a confirmar.</p>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>Otros paquetes para ofrecer</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(r.precio, r.moneda)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  elegirSalida(modal, qvEstado.salida);
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const op = e.target.closest('[data-salida-opcion]');
    if (op) { elegirSalida(modal, op.dataset.salidaOpcion); return; }
    const paso = e.target.closest('[data-paso]');
    if (paso) { moverStepper(paso); pintarSubtotal(modal); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const v = qvEstado.salida;
      const n = Cart.add(p, v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      pintarSubtotal(modal);
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${plural(n, 'pasajero', 'pasajeros')} a «${p.nombre}», salida ${fechaCorta(v)}`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, sku: p.codigo,
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: p.moneda, price: p.precio, availability: 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    window.history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString().replace(/%2C/g, ',')}` : '') + u.hash);
  } catch { return; }
}

function estadoHorario(fecha = new Date()) {
  let h;
  try { h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: ZONA_AR, hour: '2-digit', hourCycle: 'h23' }).format(fecha)); } catch { h = fecha.getHours(); }
  if (h >= 8 && h < 22) return { abierto: true, txt: 'Atendiendo ahora, hasta las 22 h' };
  return { abierto: false, txt: h < 8 ? 'Volvemos a atender hoy a las 8 h' : 'Volvemos a atender mañana a las 8 h' };
}
function initHorario() {
  const els = document.querySelectorAll('[data-horario]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoHorario();
    els.forEach(el => {
      el.classList.toggle('is-abierto', e.abierto);
      const t = el.querySelector('[data-horario-txt]');
      if (t) t.textContent = e.txt;
    });
  };
  pintar();
  window.setInterval(pintar, 60000);
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
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
  const otros = ['tipo', 'dur', 'trans', 'mes', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.largo)}</b><small>${esc(c.bajada)}</small></span><em>${plural(r.n, 'paquete', 'paquetes')} · desde ${desdeTxt(r)}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
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

function initResumenCategorias() {
  CATEGORIAS.forEach(c => {
    const r = Tienda.resumen({ cat: c.id });
    document.querySelectorAll(`[data-cat-n="${c.id}"]`).forEach(el => { el.textContent = plural(r.n, 'paquete', 'paquetes'); });
    document.querySelectorAll(`[data-cat-desde="${c.id}"]`).forEach(el => { el.textContent = `desde ${desdeTxt(r)}`; });
  });
}

function initProximaSalida() {
  const el = document.querySelector('[data-proxima]');
  if (!el) return;
  const p = Tienda.consultar({ orden: 'proxima', limite: 1 }).items[0];
  if (!p) { el.hidden = true; return; }
  const s = p.salidas[0];
  el.querySelector('[data-proxima-dest]').textContent = p.nombre;
  el.querySelector('[data-proxima-fecha]').textContent = `${fechaCorta(s.f)} · ${plural(p.noches, 'noche', 'noches')} · ${lugaresTxt(s)}`;
  el.querySelector('[data-proxima-cod]').textContent = p.codigo;
  el.setAttribute('data-qv', p.id);
  el.setAttribute('data-salida', s.f);
}

function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'ticket';
    const max = parseInt(cont.dataset.max, 10) || 8;
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const todos = productosPorIds(ids).slice(0, 8);
    const pintar = (tab = '', animar = true) => {
      const prods = (tab ? todos.filter(p => p.cat === tab) : todos).slice(0, max);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo, animar)).join('');
      if (verTodo) verTodo.href = tab ? `${CATALOGO_URL}?cat=${tab}` : CATALOGO_URL;
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function salidasTablero(cat = '', n = 6) {
  const filtros = cat ? { cat } : {};
  const prods = Tienda.consultar({ filtros, orden: 'proxima', limite: 12 }).items;
  const orden = (a, b) => a.s.f.localeCompare(b.s.f) || a.p.rango - b.p.rango;
  const primeras = prods.map(p => ({ p, s: p.salidas[0] })).sort(orden).slice(0, n);
  if (primeras.length >= n) return primeras;
  const segundas = prods.flatMap(p => p.salidas.slice(1, 3).map(s => ({ p, s }))).sort(orden);
  return primeras.concat(segundas.slice(0, n - primeras.length)).sort(orden);
}
function filaTablero({ p, s }) {
  const d = fechaD(s.f);
  return `<li class="tablero__fila" data-id="${esc(p.id)}">
  <span class="tablero__fecha"><b>${d.getUTCDate()}</b><span>${MESES_C[d.getUTCMonth()]}</span><small>${DIAS_C[d.getUTCDay()]}</small></span>
  <span class="tablero__dest"><b>${esc(p.nombre)}</b><small>${esc(p.codigo)} · ${esc(p.zona)}</small></span>
  <span class="tablero__noches">${icoTrans(p)}${esc(plural(p.noches, 'noche', 'noches'))}</span>
  <span class="tablero__lugares${s.cupos <= 6 ? ' is-pocos' : ''}">${esc(lugaresTxt(s))}</span>
  <span class="tablero__precio">${formatearPrecio(p.precio, p.moneda)}</span>
  <button type="button" class="tablero__btn" data-qv="${esc(p.id)}" data-salida="${esc(s.f)}" aria-label="Elegir ${esc(p.nombre)}, salida ${esc(fechaLarga(s.f))}">Elegir ${ICO.flecha}</button>
</li>`;
}
function initTablero() {
  const cont = document.querySelector('[data-tablero]');
  if (!cont) return;
  const tabs = [...document.querySelectorAll('[data-tablero-tab]')];
  const ver = document.querySelector('[data-tablero-ver]');
  const pintar = cat => {
    cont.innerHTML = salidasTablero(cat).map(filaTablero).join('');
    if (ver) ver.href = cat ? `${CATALOGO_URL}?cat=${cat}&orden=proxima` : `${CATALOGO_URL}?orden=proxima`;
  };
  pintar('');
  tabs.forEach(b => b.addEventListener('click', () => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(b.dataset.tableroTab);
    if (!reduceMotion) cont.querySelectorAll('.tablero__fila').forEach((f, k) => { f.style.animationDelay = `${k * 0.05}s`; f.classList.add('is-nueva'); });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }));
}

function initRailDrag(vp) {
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
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { moved = true; } }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { pointerId = null; }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}
function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  initRailDrag(vp);
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 20;
  const sync = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 8) + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
  const estilo = MODELO === '2' ? 'pase' : 'ticket';
  const params = new URLSearchParams(location.search);
  const MESES = Tienda.meses().map(m => ({ id: m, nombre: mesNombre(m) }));
  const GRUPOS = { cat: CATEGORIAS, tipo: TIPOS, dur: DURACIONES, mes: MESES, trans: TRANSPORTES };
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {};
  Object.entries(GRUPOS).forEach(([k, lista]) => { e[k] = valida(params.get(k), lista); });
  e.q = (params.get('q') || '').trim().slice(0, 60);
  e.orden = ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados';
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    Object.keys(GRUPOS).forEach(k => { if (sin !== k && e[k].length) f[k] = e[k]; });
    return f;
  };
  const mesCorto = m => { const [a, n] = m.split('-'); return `${MESES_C[Number(n) - 1]} ${a.slice(2)}`; };
  const opcion = (grupo, item, marcado, n) => {
    const pill = grupo === 'mes';
    return `<label class="opcion${pill ? ' opcion--pill' : ''}${n ? '' : ' is-cero'}"${pill ? ` title="${esc(item.nombre)}"` : ''}><input type="checkbox" data-f="${grupo}" value="${esc(item.id)}"${marcado ? ' checked' : ''}${pill ? ` aria-label="${esc(item.nombre)}"` : ''}><span>${esc(pill ? mesCorto(item.id) : item.nombre)}</span><small>${n}</small></label>`;
  };
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      const box = panel.querySelector(`[data-f-${k}]`);
      if (box) box.innerHTML = lista.map(it => opcion(k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1 || e[solo[0]].length !== 1) return '';
    const k = solo[0], id = e[k][0];
    if (k === 'cat') return catDe(id).largo;
    if (k === 'mes') return `Salidas de ${mesNombre(id).toLowerCase()}`;
    if (k === 'tipo') return `Viajes de ${nombreDe(TIPOS, id).toLowerCase()}`;
    if (k === 'dur') return `Paquetes de ${nombreDe(DURACIONES, id).toLowerCase()}`;
    return `Paquetes en ${nombreDe(TRANSPORTES, id).toLowerCase()}`;
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Paquetes nacionales e internacionales';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Paquetes'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('q', e.q);
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
      : `${total} <small>${total === 1 ? 'paquete' : 'paquetes'}</small>`;
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
    e[g] = [...panel.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  let tq = 0;
  inputQ.value = e.q;
  inputQ.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); }, 220); });
  inputQ.closest('form')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = inputQ.value.trim().slice(0, 60); pintarActivos(); sincronizarUrl(); render(true); inputQ.blur(); });
  selOrden.innerHTML = ORDENES.map(o => `<option value="${o.id}"${o.id === e.orden ? ' selected' : ''}>${esc(o.nombre)}</option>`).join('');
  selOrden.addEventListener('change', () => { e.orden = selOrden.value; sincronizarUrl(); render(true); });
  const limpiar = () => { Object.keys(GRUPOS).forEach(k => { e[k] = []; }); e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (GRUPOS[k]) e[k] = e[k].filter(x => x !== v);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 34, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero__pase', { y: 24, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  desde('.tablero__cab', { opacity: 0, duration: 0.8 }, 0.35);
  desde('.tablero__fila', { y: 14, opacity: 0, duration: 0.7, stagger: 0.06, clearProps: 'transform,opacity' }, 0.45);
}

[
  initPreviews, initTablero, initResumenCategorias, initProximaSalida, initMenuCategorias, initCatalogo, initReveals, initHeroMotion,
  initNav, initDrawer, initVistaRapida, initCompras, initRail, initHorario, initFloats, initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); } catch (err) { console.error(err); }
updateCartBadge();
