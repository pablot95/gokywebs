const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
const refrescarST = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const MARCA = 'Pilin Bikers';
const WA = '5493855011309';
const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATEGORIAS = [
  { id: 'bicis', nombre: 'Bicis y eléctricas', img: 'images/p-bici-electrica.webp' },
  { id: 'ruedas', nombre: 'Ruedas y cubiertas', img: 'images/p-ruedas.webp' },
  { id: 'transmision', nombre: 'Transmisión', img: 'images/p-cadena.webp' },
  { id: 'frenos', nombre: 'Frenos', img: 'images/p-freno-disco.webp' },
  { id: 'accesorios', nombre: 'Accesorios', img: 'images/p-casco.webp' },
];

const RODADOS = [
  { id: '12', label: '12' }, { id: '16', label: '16' }, { id: '20', label: '20' }, { id: '24', label: '24' },
  { id: '26', label: '26' }, { id: '27.5', label: '27,5' }, { id: '28', label: '28' }, { id: '29', label: '29' },
];
const rodadoLabel = id => RODADOS.find(r => r.id === id)?.label || id;
const porRodado = pares => ({ nombre: 'Rodado', rodado: true, ops: pares.map(([id, precio]) => ({ id, label: `Rodado ${rodadoLabel(id)}`, corto: rodadoLabel(id), precio })) });

const RANGOS = {
  'hasta-30': { nombre: 'Hasta $30.000', max: 30000 },
  '30-100': { nombre: '$30.000 a $100.000', min: 30000, max: 100000 },
  '100-700': { nombre: '$100.000 a $700.000', min: 100000, max: 700000 },
  'mas-700': { nombre: 'Más de $700.000', min: 700000 },
};

const Servidor = crearServidor([
  { id: 'bici-urbana', nombre: 'Bicicleta urbana rodado 28', cat: 'bicis', img: 'p-bici-urbana', px: 1000, rodados: ['28'],
    alt: 'Bicicleta urbana verde oliva con guardabarros y cubiertas de banda marrón',
    desc: 'Cuadro de aluminio verde oliva, frenos a disco, guardabarros y cubiertas de banda marrón. Para ir al trabajo, a la facu o salir a dar una vuelta.',
    puntos: ['Rodado 28 (700)', 'Frenos a disco', 'Con guardabarros'],
    var: { nombre: 'Talle', ops: [{ id: 'm', label: 'Talle M · 1,65 a 1,78 m', corto: 'M' }, { id: 'l', label: 'Talle L · 1,78 a 1,90 m', corto: 'L' }] },
    precio: 745000, stock: 4, rango: 1, alta: 20 },
  { id: 'bici-electrica', nombre: 'Bicicleta eléctrica urbana rodado 28', cat: 'bicis', img: 'p-bici-electrica', px: 1000, rodados: ['28'], electrica: true, nuevo: true,
    alt: 'Bicicleta eléctrica gris con la batería en el cuadro, parrilla y luz delantera',
    desc: 'Motor central, batería integrada en el cuadro, parrilla trasera y luz delantera. Cuadro bajo para subir y bajar fácil en la ciudad.',
    puntos: ['Motor central', 'Batería en el cuadro', 'Cuadro bajo con parrilla'],
    var: { nombre: 'Batería', ops: [{ id: '10ah', label: 'Batería 36 V · 10,4 Ah', corto: '10,4 Ah', precio: 2390000 }, { id: '14ah', label: 'Batería 36 V · 14 Ah', corto: '14 Ah', precio: 2590000 }] },
    precio: 2390000, stock: 2, rango: 2, alta: 22 },
  { id: 'bateria-36v', nombre: 'Batería de cuadro 36 V para bici eléctrica', cat: 'bicis', img: 'p-bateria', px: 420, electrica: true, meta: 'Para bici eléctrica',
    alt: 'Batería integrada en el tubo diagonal de una bici eléctrica',
    desc: 'Batería de repuesto para cuadros con alojamiento en el tubo diagonal. Antes de comprar, mandanos una foto de tu bici y te confirmamos que sea compatible.',
    puntos: ['36 V', 'Con llave y cargador', 'Compatibilidad por WhatsApp'],
    var: { nombre: 'Capacidad', ops: [{ id: '10ah', label: '36 V · 10,4 Ah', corto: '10,4 Ah', precio: 520000 }, { id: '14ah', label: '36 V · 14 Ah', corto: '14 Ah', precio: 640000 }] },
    precio: 520000, stock: 3, rango: 11, alta: 14 },
  { id: 'rueda-armada', nombre: 'Rueda armada con llanta de doble pared', cat: 'ruedas', img: 'p-ruedas', px: 800,
    alt: 'Ruedas armadas de distintos rodados apoyadas contra una pared de cemento',
    desc: 'Rueda delantera armada y centrada en el taller, lista para colocar. Si no sabés el rodado, mirá el número en el costado de la cubierta.',
    puntos: ['Llanta de doble pared', 'Centrada en el taller', 'Delantera'],
    var: porRodado([['12', 26000], ['16', 29000], ['20', 33000], ['24', 38000], ['26', 44000], ['27.5', 48000], ['28', 52000], ['29', 55000]]),
    precio: 26000, stock: 12, rango: 3, alta: 10 },
  { id: 'rueda-trasera', nombre: 'Rueda trasera con piñón a rosca', cat: 'ruedas', img: 'p-rueda-trasera', px: 470,
    alt: 'Rueda trasera de montaña con piñón a rosca y cubierta de taco',
    desc: 'Rueda trasera armada con maza para piñón a rosca, para bicis de 6 a 8 velocidades. Se entrega con el piñón colocado.',
    puntos: ['Piñón a rosca incluido', 'Para 6 a 8 velocidades', 'Llanta de aluminio'],
    var: porRodado([['26', 78000], ['27.5', 82000], ['29', 86000]]),
    precio: 78000, descuento: 10, stock: 6, rango: 12, alta: 12 },
  { id: 'rueda-infantil', nombre: 'Rueda para bici infantil', cat: 'ruedas', img: 'p-rueda-infantil', px: 420,
    alt: 'Rueda chica de bici infantil con cubierta lisa',
    desc: 'Rueda completa para bicis de chicos, con la cubierta y la cámara colocadas. Elegí el rodado de la bici.',
    puntos: ['Con cubierta y cámara', 'Llanta de aluminio', 'Rodados 12 a 20'],
    var: porRodado([['12', 24000], ['16', 27500], ['20', 31000]]),
    precio: 24000, stock: 8, alta: 8 },
  { id: 'cubierta-taco', nombre: 'Cubierta de taco para montaña', cat: 'ruedas', img: 'p-cubierta-taco', px: 450,
    alt: 'Cubierta de taco alto en una rueda de montaña',
    desc: 'Taco alto para tierra, ripio y barro. Agarra bien en las curvas y frena corto en bajada.',
    puntos: ['Taco alto', 'Para tierra y ripio', 'Ancho 2,10 a 2,35'],
    var: porRodado([['20', 21000], ['24', 24500], ['26', 27000], ['27.5', 29500], ['29', 32000]]),
    precio: 21000, stock: 20, rango: 4, alta: 16 },
  { id: 'cubierta-urbana', nombre: 'Cubierta urbana con banda marrón', cat: 'ruedas', img: 'p-cubierta-urbana', px: 560, electrica: true,
    alt: 'Rueda delantera con cubierta lisa de banda marrón y freno a disco',
    desc: 'Dibujo liso que rueda suave en el asfalto y banda marrón en el costado. Va bien en urbanas y en eléctricas.',
    puntos: ['Dibujo liso', 'Banda marrón', 'Apta para eléctricas'],
    var: porRodado([['26', 34000], ['28', 37500]]),
    precio: 34000, stock: 14, rango: 10, alta: 18 },
  { id: 'descarrilador', nombre: 'Descarrilador trasero', cat: 'transmision', img: 'p-descarrilador', px: 580,
    alt: 'Descarrilador trasero negro con sus dos roldanas',
    desc: 'Descarrilador trasero de patilla larga para piñones grandes de montaña. Si querés, te lo colocamos y regulamos en el taller.',
    puntos: ['Patilla larga', 'Para piñones de montaña', 'Colocación en el taller'],
    var: { nombre: 'Velocidades', ops: [{ id: '8v', label: '8 velocidades', corto: '8 v', precio: 34000 }, { id: '9v', label: '9 velocidades', corto: '9 v', precio: 41000 }, { id: '11v', label: '11 velocidades', corto: '11 v', precio: 68000 }] },
    precio: 34000, stock: 7, rango: 5, alta: 11 },
  { id: 'cadena', nombre: 'Cadena con eslabón rápido', cat: 'transmision', img: 'p-cadena', px: 640, electrica: true,
    alt: 'Cadena de bici plateada enrollada sobre cemento',
    desc: 'Cadena con eslabón rápido para abrir y cerrar sin herramienta. Elegí la cantidad de velocidades de tu bici.',
    puntos: ['Eslabón rápido incluido', '116 eslabones', 'Apta para eléctricas'],
    var: { nombre: 'Velocidades', ops: [{ id: '8v', label: '8 velocidades', corto: '8 v', precio: 16500 }, { id: '9v', label: '9 velocidades', corto: '9 v', precio: 19800 }, { id: '10v', label: '10 velocidades', corto: '10 v', precio: 24000 }, { id: '11v', label: '11 velocidades', corto: '11 v', precio: 29500 }, { id: '12v', label: '12 velocidades', corto: '12 v', precio: 36000 }] },
    precio: 16500, stock: 30, rango: 6, alta: 15 },
  { id: 'pedales', nombre: 'Pedales de plataforma de aluminio', cat: 'transmision', img: 'p-pedales', px: 600,
    alt: 'Par de pedales de plataforma negros con pernos',
    desc: 'Plataforma ancha con pernos que no dejan resbalar la zapatilla. Rosca 9/16: van en casi cualquier bici de adulto.',
    puntos: ['Aluminio', 'Pernos antideslizantes', 'Rosca 9/16'],
    precio: 27000, stock: 10, rango: 7, alta: 13 },
  { id: 'roldanas', nombre: 'Roldanas para descarrilador (par)', cat: 'transmision', img: 'p-roldanas', px: 350,
    alt: 'Dos roldanas negras de 11 dientes con rulemán',
    desc: 'Par de roldanas de 11 dientes con rulemán sellado. Cambiarlas devuelve suavidad a los cambios cuando están gastadas.',
    puntos: ['11 dientes', 'Rulemán sellado', 'Se venden de a par'],
    precio: 12500, stock: 15, alta: 6 },
  { id: 'pinon', nombre: 'Piñón cassette', cat: 'transmision', img: 'p-pinon', px: 350,
    alt: 'Piñón cassette montado en la rueda trasera con la cadena puesta',
    desc: 'Cassette para maza de traba (no a rosca). Elegí las velocidades: cada opción dice su rango de dientes.',
    puntos: ['Para maza de traba', 'Acero', 'Colocación en el taller'],
    var: { nombre: 'Velocidades', ops: [{ id: '8v', label: '8 velocidades · 11-32', corto: '8 v', precio: 38000 }, { id: '9v', label: '9 velocidades · 11-36', corto: '9 v', precio: 46000 }, { id: '10v', label: '10 velocidades · 11-42', corto: '10 v', precio: 55000 }] },
    precio: 38000, stock: 9, rango: 13, alta: 9 },
  { id: 'freno-disco', nombre: 'Freno a disco hidráulico', cat: 'frenos', img: 'p-freno-disco', px: 600, electrica: true,
    alt: 'Caliper de freno hidráulico montado en la horquilla',
    desc: 'Kit con manija, caliper y manguera ya purgados. Frena con poca fuerza en la mano y no hay cables que regular.',
    puntos: ['Manija y caliper', 'Ya purgado', 'Apto para eléctricas'],
    var: { nombre: 'Posición', ops: [{ id: 'del', label: 'Delantero', corto: 'Delantero', precio: 98000 }, { id: 'tras', label: 'Trasero', corto: 'Trasero', precio: 104000 }] },
    precio: 98000, descuento: 10, stock: 5, rango: 8, alta: 21 },
  { id: 'disco-freno', nombre: 'Disco de freno de acero', cat: 'frenos', img: 'p-disco', px: 580, electrica: true,
    alt: 'Disco de freno de acero calado en la rueda delantera',
    desc: 'Disco con fijación de 6 tornillos. Cuanto más grande, más frena: el de 180 o 203 mm se usa mucho en eléctricas.',
    puntos: ['Fijación de 6 tornillos', 'Acero inoxidable', 'Tornillos incluidos'],
    var: { nombre: 'Medida', ops: [{ id: '160', label: '160 mm', corto: '160 mm', precio: 18000 }, { id: '180', label: '180 mm', corto: '180 mm', precio: 21000 }, { id: '203', label: '203 mm', corto: '203 mm', precio: 25000 }] },
    precio: 18000, stock: 18, alta: 7 },
  { id: 'casco', nombre: 'Casco ventilado', cat: 'accesorios', img: 'p-casco', px: 760,
    alt: 'Casco de bici negro mate con ventilaciones sobre un mostrador de madera',
    desc: 'Casco liviano con 18 ventilaciones y talle regulable con una ruedita atrás. Para la ciudad y para salir a la ruta.',
    puntos: ['18 ventilaciones', 'Regulación con ruedita', 'Negro mate'],
    var: { nombre: 'Talle', ops: [{ id: 'm', label: 'Talle M · 54 a 58 cm', corto: 'M' }, { id: 'l', label: 'Talle L · 58 a 62 cm', corto: 'L' }] },
    precio: 54000, stock: 9, rango: 9, alta: 17 },
  { id: 'inflador', nombre: 'Inflador de pie', cat: 'accesorios', img: 'p-inflador', px: 650,
    alt: 'Inflador de pie negro con manija en T',
    desc: 'Inflador de pie con manija en T y pico doble: sirve para válvula fina (presta) y gruesa (tipo auto).',
    puntos: ['Pico doble', 'Manija en T', 'Base firme'],
    precio: 29000, stock: 11, alta: 5 },
  { id: 'luces', nombre: 'Kit de luces LED recargables', cat: 'accesorios', img: 'p-luces', px: 580,
    alt: 'Luz delantera blanca y luz trasera roja sobre un mostrador de madera',
    desc: 'Luz delantera blanca y trasera roja, con carga por USB. Se ponen y se sacan sin herramientas.',
    puntos: ['Carga por USB', 'Delantera y trasera', 'Varios modos de destello'],
    precio: 26000, descuento: 15, stock: 16, rango: 14, alta: 19 },
  { id: 'candado', nombre: 'Candado espiral con llave', cat: 'accesorios', img: 'p-candado', px: 600,
    alt: 'Candado espiral negro con llave sobre un mostrador de madera',
    desc: 'Cable de acero recubierto de 1,5 m: alcanza para pasar por la rueda y el cuadro. Trae dos llaves.',
    puntos: ['1,5 m de largo', 'Dos llaves', 'Cable recubierto'],
    precio: 19500, stock: 13, alta: 4 },
  { id: 'camara', nombre: 'Cámara de aire', cat: 'ruedas', img: 'p-cubierta-taco', px: 450, visible: false,
    alt: 'Cámara de aire', desc: 'Cámara de aire con válvula fina.', puntos: [],
    var: porRodado([['26', 9000], ['29', 11000]]), precio: 9000, stock: 0, alta: 1 },
], { tope: 100 });

function crearServidor(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const datos = coleccion.filter(p => p.visible !== false);
  const porId = new Map(datos.map(p => [p.id, p]));
  const nombreDeCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const rodadosDe = p => (p.var?.rodado ? p.var.ops.map(o => o.id) : (p.rodados || []));
  const finalDe = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100)) : precio);
  const desde = p => Math.min(...(p.var ? p.var.ops.map(o => finalDe(p, o.precio ?? p.precio)) : [finalDe(p, p.precio)]));
  const indice = new Map(datos.map(p => [p.id, norm([
    p.nombre, nombreDeCat(p.cat), p.desc, ...(p.puntos || []), ...(p.var ? p.var.ops.map(o => o.label) : []),
    ...rodadosDe(p).map(r => `rodado ${r} ${rodadoLabel(r)}`), p.electrica ? 'electrica e-bike ebike' : '',
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));

  function coincide(p, f) {
    const cat = lista(f.cat), excluirCat = lista(f.excluirCat), excluir = lista(f.excluir), extra = lista(f.extra);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (excluirCat.includes(p.cat)) return false;
    if (excluir.includes(p.id)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (f.destacado === true && !p.rango) return false;
    if (f.rodado && !rodadosDe(p).includes(String(f.rodado))) return false;
    if (f.universal === true && rodadosDe(p).length) return false;
    if (f.electrica === true && !p.electrica) return false;
    if (extra.includes('oferta') && !(p.descuento > 0)) return false;
    if (extra.includes('stock') && !(p.stock > 0)) return false;
    if (f.rango && RANGOS[f.rango]) {
      const r = RANGOS[f.rango], precio = desde(p);
      if (r.min != null && precio < r.min) return false;
      if (r.max != null && precio >= r.max) return false;
    }
    if (f.q) {
      const palabras = norm(f.q).split(/\s+/).filter(Boolean);
      const texto = indice.get(p.id) || '';
      if (!palabras.every(w => texto.includes(w))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => a.id.localeCompare(b.id);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      case 'novedades': return (a, b) => (b.alta || 0) - (a.alta || 0) || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || (b.alta || 0) - (a.alta || 0) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
    const lim = Math.min(Math.max(parseInt(limite, 10) || 1, 1), tope);
    const ordenados = datos.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, total: ordenados.length };
  }
  const contar = (filtros = {}) => datos.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => { const p = porId.get(id); return p ? copia(p) : null; };
  const resumen = () => CATEGORIAS.map(c => ({ id: c.id, cantidad: contar({ cat: c.id }) }));
  function facetas(filtros = {}) {
    const sin = k => { const f = { ...filtros }; delete f[k]; return f; };
    const fCat = sin('cat'), fRod = sin('rodado'), fEle = sin('electrica'), fRan = sin('rango');
    const cat = {}, rodado = {}, rango = {};
    let electrica = 0;
    datos.forEach(p => {
      if (coincide(p, fCat)) cat[p.cat] = (cat[p.cat] || 0) + 1;
      if (coincide(p, fRod)) rodadosDe(p).forEach(r => { rodado[r] = (rodado[r] || 0) + 1; });
      if (p.electrica && coincide(p, fEle)) electrica++;
      if (coincide(p, fRan)) Object.keys(RANGOS).forEach(k => { if (coincide(p, { rango: k })) rango[k] = (rango[k] || 0) + 1; });
    });
    return { cat, rodado, electrica, rango };
  }
  return { TOPE: tope, consultar, contar, obtener, resumen, facetas };
}

const UBICACION = { coords: [-27.7858, -64.2612], ciudad: 'Santiago del Estero' };

const TRABAJOS = [
  { img: 'h-mecanico', w: 900, h: 1600, tipo: 'Service', titulo: 'Service completo en el soporte',
    alt: 'Mecánico ajustando la transmisión de una bici de montaña verde en el soporte del taller',
    texto: 'Limpieza y lubricación de la transmisión, ajuste de cambios y frenos y control de ruedas, con la bici en el soporte.',
    wa: 'Hola, Pilin Bikers. Quiero un service completo para mi bici.' },
  { img: 'h-taller', w: 1000, h: 1000, tipo: 'Cambios', titulo: 'Cambios que entran sin ruido',
    alt: 'Mecánico regulando el descarrilador trasero de una bici con un destornillador',
    texto: 'Tensión del cable, topes del descarrilador y alineación hasta que cada cambio entra limpio y sin saltar.',
    wa: 'Hola, Pilin Bikers. Mi bici hace ruido al cambiar, ¿me la pueden regular?' },
  { img: 'h-frenos', w: 1000, h: 1000, tipo: 'Frenos', titulo: 'Frenos a disco a punto',
    alt: 'Manos con guantes ajustando el caliper de un freno a disco con una llave Allen',
    texto: 'Centrado del caliper, cambio de pastillas y purga de los hidráulicos, con el disco alineado para que no roce.',
    wa: 'Hola, Pilin Bikers. Quiero revisar los frenos de mi bici.' },
  { img: 't-electrica', w: 600, h: 600, tipo: 'Eléctricas', titulo: 'Revisión de bici eléctrica',
    alt: 'Motor central y batería en el cuadro de una bici eléctrica gris',
    texto: 'Conexiones, batería y motor revisados, además de frenos y transmisión, que en una eléctrica trabajan más.',
    wa: 'Hola, Pilin Bikers. Quiero llevar mi bici eléctrica a revisión.' },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Servidor.obtener(id);
const opcion = (p, v) => (p?.var ? (p.var.ops.find(o => o.id === v) || p.var.ops[0]) : null);
const precioLista = (p, v) => (p.var ? (opcion(p, v).precio ?? p.precio) : p.precio);
const precioDe = (p, v) => (p.descuento > 0 ? Math.round(precioLista(p, v) * (1 - p.descuento / 100)) : precioLista(p, v));
const variaPrecio = p => !!p.var && p.var.ops.some(o => (o.precio ?? p.precio) !== (p.var.ops[0].precio ?? p.precio));
const precioDesde = p => (p.var ? Math.min(...p.var.ops.map(o => precioDe(p, o.id))) : precioDe(p, ''));
const imgDe = p => `images/${p.img}.webp`;
const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
const rodadosDe = p => (p.var?.rodado ? p.var.ops.map(o => o.id) : (p.rodados || []));
const catalogoHref = () => document.body?.dataset.catalogo || 'catalogo.html';
const guardarLocal = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
const disponible = p => p.stock > 0;
function metaDe(p) {
  if (p.meta) return p.meta;
  const r = rodadosDe(p);
  if (r.length > 3) return `Rodados ${rodadoLabel(r[0])} a ${rodadoLabel(r[r.length - 1])}`;
  if (r.length) return `Rodado ${r.map(rodadoLabel).join(' · ')}`;
  return p.cat === 'accesorios' ? 'Accesorios' : 'Va en todos los rodados';
}

const Cart = {
  KEY: 'pilinbikers_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { guardarLocal(this.KEY, JSON.stringify(items)); document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.v || '') === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, v, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.v || '') === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (i.v || '') === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioDe(p, i.v) * i.qty : s; }, 0); },
};

const ICON = {
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  carritoMas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.6 9.6v4M11.6 11.6h4" stroke-linecap="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  expandir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  wa: '<svg class="wa-glifo" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
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

function syncNoScroll() {
  const abierto = document.querySelector('.main-nav.open, .drawer.open, .qv.open, .visor.open, .filtros.open');
  document.body.classList.toggle('no-scroll', !!abierto);
}
function atraparFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const ANIM = {
  subir: ' data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  subirCh: ' data-animate="subir" style="opacity:0;transform:translateY(24px)"',
  der: ' data-animate="der" style="opacity:0;transform:translateX(64px)"',
  escala: ' data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)"',
};

function stepperHTML(nombre, max = 20) {
  return `<div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICON.menos}</button><input type="number" value="1" min="1" max="${max}" inputmode="numeric" aria-label="Cantidad de ${esc(nombre)}"><button type="button" data-step="1" aria-label="Sumar uno">${ICON.mas}</button></div>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo ingreso</span>');
  if (p.stock > 0 && p.stock <= 3) b.push('<span class="badge badge--pocas">Últimas unidades</span>');
  return b.length ? `<span class="badges">${b.join('')}</span>` : '';
}
function precioHTML(p, v = null, clase = 'precio') {
  const fijo = v !== null;
  const desde = !fijo && variaPrecio(p) ? '<small>Desde</small>' : '';
  const final = fijo ? precioDe(p, v) : precioDesde(p);
  const lista = fijo ? precioLista(p, v) : precioLista(p, p.var ? p.var.ops[0].id : '');
  if (p.descuento > 0) return `<p class="${clase} ${clase}--off">${desde}<span class="precio__final">${formatearPrecio(final)}</span><s>${formatearPrecio(lista)}</s></p>`;
  return `<p class="${clase}">${desde}<span class="precio__final">${formatearPrecio(final)}</span></p>`;
}
function waProducto(p, v = '') {
  const o = opcion(p, v);
  return waLink(`Hola, ${MARCA}. Quiero consultar por: ${p.nombre}${o ? ` (${o.label})` : ''}.`);
}
function cardHTML(p, { anim = 'subir', rodado = '' } = {}) {
  const n = esc(p.nombre);
  const a = anim ? ANIM[anim] : '';
  const vDirecta = rodado && p.var?.rodado && p.var.ops.some(o => o.id === rodado) ? rodado : '';
  const simple = !p.var || vDirecta;
  const meta = vDirecta ? `Rodado ${rodadoLabel(vDirecta)}` : metaDe(p);
  let acciones;
  if (!disponible(p)) {
    acciones = `<div class="prod-actions"><a class="btn-elegir prod-add" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar</span></a></div>`;
  } else if (simple) {
    acciones = `<div class="prod-actions">${stepperHTML(p.nombre, Math.min(p.stock, 20))}<button type="button" class="btn-add prod-add" data-add="${p.id}" data-v="${vDirecta}" aria-label="Agregar ${n} al carrito">${ICON.carritoMas}<span>Agregar</span></button></div>`;
  } else {
    const vn = esc(p.var.nombre.toLowerCase());
    acciones = `<div class="prod-actions"><button type="button" class="btn-elegir prod-add" data-quick="${p.id}" aria-label="Elegir ${vn} de ${n}">${ICON.ajustes}<span>Elegir<span class="prod-add__extra${vn.length > 7 ? ' prod-add__extra--larga' : ''}"> ${vn}</span></span></button></div>`;
  }
  return `<article class="card"${a}><button type="button" class="card__media" data-quick="${p.id}" data-v="${vDirecta}" aria-label="Ver ${n}"><span class="recorte"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span></button>${badgesHTML(p)}<div class="card__body"><p class="card__meta">${esc(meta)}</p><h3 class="card__name">${n}</h3>${precioHTML(p, vDirecta ? vDirecta : null)}${acciones}</div></article>`;
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
document.addEventListener('cart:updated', updateCartBadge);

function waPedido() {
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) return waLink(`Hola, ${MARCA}. Quiero hacer un pedido.`);
  const txt = lineas.map(({ p, v, qty }) => {
    const o = opcion(p, v);
    return `• ${qty} × ${p.nombre}${o ? ` (${o.label})` : ''}: ${formatearPrecio(precioDe(p, v) * qty)}`;
  }).join('\n');
  return waLink(`Hola, ${MARCA}. Quiero hacer este pedido:\n${txt}\nTotal: ${formatearPrecio(Cart.total())}\n¿Cómo coordinamos el pago y la entrega?`);
}

function agregar(id, qty = 1, v = '') {
  const p = getProducto(id);
  if (!p || !disponible(p)) return false;
  const vv = p.var ? opcion(p, v).id : '';
  Cart.add(p, qty, vv);
  const extra = p.var ? ` (${opcion(p, vv).label})` : '';
  showToast(`Sumaste ${qty > 1 ? qty + ' × ' : ''}${p.nombre}${extra} al carrito`);
  return true;
}
function cantidadDe(btn) {
  const input = btn.closest('.card, .qv__acciones, .prod-actions')?.querySelector('[data-stepper] input');
  const n = parseInt(input?.value, 10);
  if (input) input.value = 1;
  return Number.isFinite(n) ? Math.max(1, Math.min(n, 20)) : 1;
}
function initAcciones() {
  document.addEventListener('click', e => {
    const step = e.target.closest('[data-step]');
    if (step) {
      const input = step.parentElement.querySelector('input');
      const max = parseInt(input.max, 10) || 20;
      const n = (parseInt(input.value, 10) || 1) + Number(step.dataset.step);
      input.value = Math.max(1, Math.min(n, max));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      agregar(add.dataset.add, cantidadDe(add), add.dataset.v || '');
      add.classList.remove('agregado'); void add.offsetWidth; add.classList.add('agregado');
      return;
    }
    const buy = e.target.closest('[data-buy]');
    if (buy) {
      if (agregar(buy.dataset.buy, cantidadDe(buy), buy.dataset.v || '')) { cerrarQuickView(false); abrirCarrito(); }
      return;
    }
    const quick = e.target.closest('[data-quick]');
    if (quick) { abrirQuickView(quick.dataset.quick, quick, quick.dataset.v || ''); return; }
    if (e.target.closest('[data-open-cart]')) abrirCarrito();
  });
  document.addEventListener('change', e => {
    const input = e.target.closest('[data-stepper] input');
    if (input && !input.closest('.linea')) input.value = Math.max(1, Math.min(parseInt(input.value, 10) || 1, parseInt(input.max, 10) || 20));
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
    toggle.setAttribute('aria-expanded', 'false'); syncNoScroll();
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); syncNoScroll();
    nav.querySelector('.nav-cats__btn, a')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => {
    if (!nav.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); toggle.focus(); } else atraparFoco(nav, e);
  });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function menuCatsHTML() {
  const resumen = Servidor.resumen();
  const href = catalogoHref();
  const qs = new URLSearchParams(location.search);
  const activa = document.body.dataset.pagina === 'catalogo' ? qs.get('cat') : null;
  const items = CATEGORIAS.map(c => {
    const cant = resumen.find(x => x.id === c.id)?.cantidad || 0;
    return `<a class="nav-cats__item" href="${href}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="44" height="44"><span>${esc(c.nombre)}</span><span class="nav-cats__cant">${cant}</span></a>`;
  }).join('');
  const ele = Servidor.contar({ electrica: true });
  const eleActiva = document.body.dataset.pagina === 'catalogo' && qs.get('electrica') === '1' && !activa;
  return `${items}<a class="nav-cats__item nav-cats__item--ele" href="${href}?electrica=1"${eleActiva ? ' aria-current="page"' : ''}><span class="nav-cats__rayo" aria-hidden="true">e</span><span>Para bici eléctrica</span><span class="nav-cats__cant">${ele}</span></a><a class="nav-cats__todo" href="${href}">Ver todo el catálogo ${ICON.flecha}</a>`;
}
function initCatMenu() {
  const wrap = document.querySelector('[data-menu-cats]');
  if (!wrap) return;
  const panel = wrap.querySelector('.nav-cats__panel');
  panel.innerHTML = menuCatsHTML();
  const btn = wrap.querySelector('.nav-cats__btn');
  const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let t = 0;
  const abrir = () => { clearTimeout(t); wrap.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); wrap.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (wrap.classList.contains('open') ? cerrar() : abrir()));
  wrap.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && wrap.classList.contains('open')) { cerrar(); btn.focus(); } });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) cerrar(); });
  wrap.addEventListener('focusout', e => { if (hoverMq.matches && e.relatedTarget && !wrap.contains(e.relatedTarget)) cerrar(); });
}

function initCuentas() {
  const resumen = Servidor.resumen();
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const id = el.dataset.cuenta;
    const n = id === 'electrica' ? Servidor.contar({ electrica: true }) : (resumen.find(x => x.id === id)?.cantidad || 0);
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  paso('.hero__card', { y: 30, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.12);
  paso('h1', { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-lead', { y: 26, opacity: 0, duration: 1 }, 0.42);
  paso('.hero-ctas .btn', { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.55);
  paso('.rodados__titulo', { y: 18, opacity: 0, duration: 0.9 }, 0.62);
  paso('.rodado', { y: 26, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.05, clearProps: 'transform,opacity' }, 0.66);
  paso('.sello, .hero__circulo', { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.6);
}

function initSello() {
  const giro = document.querySelectorAll('.sello__giro');
  if (!giro.length || reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.to(giro, { rotation: 360, ease: 'none', scrollTrigger: { trigger: document.body, start: 0, end: 'max', scrub: 0.8 } });
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amt = parseFloat(el.dataset.parallax) || 4;
    ScrollTrigger.create({
      trigger: el.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { el.style.translate = `0 ${((s.progress - 0.5) * amt * 2).toFixed(2)}%`; },
    });
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('input, .stepper, [data-add]')) return;
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
      try { vp.setPointerCapture?.(pointerId); } catch { moved = true; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { vp.classList.remove('dragging'); }
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
function initRail(sec) {
  const vp = sec?.querySelector('.rail-vp');
  const track = sec?.querySelector('.rail-track');
  if (!vp || !track) return;
  initRailDrag(vp);
  const prev = sec.querySelector('[data-rail-prev]');
  const next = sec.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) * 1.5;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= inicio + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  window.addEventListener('load', sync);
  sync();
}

let idsDestacados = [];
function renderDestacados() {
  const track = document.getElementById('railDestacados');
  if (!track) return;
  const { items } = Servidor.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  idsDestacados = items.map(p => p.id);
  track.innerHTML = items.map(p => `<li class="rail-item"${ANIM.der}>${cardHTML(p, { anim: '' })}</li>`).join('');
  initRail(track.closest('section'));
}
function renderPreview() {
  const grid = document.getElementById('gridPreview');
  if (!grid) return;
  const { items } = Servidor.consultar({ filtros: { excluir: idsDestacados }, orden: 'destacados', limite: 8 });
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initRodados() {
  const sel = document.querySelector('[data-rodados-home]');
  const grid = document.getElementById('gridRodado');
  if (!sel || !grid) return;
  const titulo = document.getElementById('rodadoTitulo');
  const res = document.getElementById('rodadoRes');
  const nota = document.getElementById('rodadoNota');
  let actual = '';
  const pintar = animar => {
    const base = { excluirCat: 'bicis' };
    let items = [], total = 0;
    if (actual) {
      const r = Servidor.consultar({ filtros: { ...base, rodado: actual }, orden: 'destacados', limite: 8 });
      items = r.items.map(p => ({ p, rodado: actual }));
      total = r.total;
      if (items.length < 8) {
        const u = Servidor.consultar({ filtros: { ...base, universal: true, excluir: ['casco', 'inflador', 'candado', 'luces'] }, orden: 'destacados', limite: 8 - items.length });
        items = items.concat(u.items.map(p => ({ p, rodado: '' })));
      }
    } else {
      items = Servidor.consultar({ filtros: base, orden: 'destacados', limite: 8 }).items.map(p => ({ p, rodado: '' }));
    }
    grid.innerHTML = items.map(({ p, rodado }) => cardHTML(p, { rodado })).join('');
    const label = rodadoLabel(actual);
    if (titulo) titulo.textContent = actual ? `Para tu rodado ${label}` : 'Lo más pedido en el mostrador';
    if (res) res.innerHTML = actual ? `<strong>${total}</strong> ${total === 1 ? 'repuesto' : 'repuestos'} de rodado ${esc(label)}` : 'Tocá el rodado de tu bici';
    if (nota) nota.textContent = actual ? `Arriba, lo que es de rodado ${label}; después, cadenas, frenos y piezas que van en cualquier bici.` : 'Elegí un rodado arriba y te mostramos lo que le va a tu bici.';
    const href = actual ? `${catalogoHref()}?rodado=${encodeURIComponent(actual)}` : catalogoHref();
    document.querySelectorAll('[data-ver-rodado]').forEach(a => { a.href = href; });
    if (animar) { revelarNuevos(grid); refrescarST(); }
  };
  sel.addEventListener('click', e => {
    const b = e.target.closest('[data-rodado-btn]');
    if (!b) return;
    actual = actual === b.dataset.rodadoBtn ? '' : b.dataset.rodadoBtn;
    sel.querySelectorAll('[data-rodado-btn]').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.rodadoBtn === actual)));
    pintar(true);
  });
  pintar(false);
}

function biciHTML(p) {
  const n = esc(p.nombre);
  const chips = (p.puntos || []).map(t => `<li>${esc(t)}</li>`).join('');
  return `<article class="bici"${ANIM.subir}><button type="button" class="bici__foto" data-quick="${p.id}" aria-label="Ver ${n}"><span class="recorte"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span></button>${badgesHTML(p)}<div class="bici__info"><p class="card__meta">${esc(metaDe(p))}</p><h3 class="bici__nombre">${n}</h3><ul class="bici__chips">${chips}</ul>${precioHTML(p)}<div class="bici__acciones"><button type="button" class="btn btn-cta" data-quick="${p.id}">Elegir ${esc(p.var ? p.var.nombre.toLowerCase() : 'y comprar')}</button><a class="btn btn-ghost" href="${waProducto(p)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar</span></a></div></div></article>`;
}
function renderBicis() {
  const grid = document.getElementById('bicisGrid');
  if (!grid) return;
  const { items } = Servidor.consultar({ filtros: { cat: 'bicis' }, orden: 'destacados', limite: 3 });
  grid.innerHTML = items.map(biciHTML).join('');
}

function renderTrabajos() {
  const grid = document.getElementById('trabajosGrid');
  if (!grid) return;
  grid.innerHTML = TRABAJOS.map((t, i) => `<li class="trabajo-item"${ANIM.subir}><button type="button" class="trabajo" data-trabajo="${i}" aria-label="Ver el trabajo: ${esc(t.titulo)}"><span class="recorte trabajo__foto"><img src="images/${t.img}.webp" alt="${esc(t.alt)}" width="${t.w}" height="${t.h}"></span><span class="trabajo__txt"><span class="trabajo__tipo"><span class="trabajo__n">${String(i + 1).padStart(2, '0')}</span>${esc(t.tipo)}</span><strong>${esc(t.titulo)}</strong></span><span class="trabajo__ver" aria-hidden="true">${ICON.expandir}</span></button></li>`).join('');
}

function montarOverlays() {
  if (!document.getElementById('qv')) {
    document.body.insertAdjacentHTML('beforeend', `
<div class="qv" id="qv" role="dialog" aria-modal="true" aria-label="Detalle del producto" hidden>
  <div class="qv__bd" data-qv-close></div>
  <div class="qv__panel">
    <button type="button" class="qv__close" data-qv-close aria-label="Cerrar el detalle">${ICON.cerrar}</button>
    <div class="qv__body" id="qvBody"></div>
  </div>
</div>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
  <div class="drawer__bd" data-cart-close></div>
  <aside class="drawer__panel">
    <div class="drawer__head"><p class="drawer__titulo">Tu carrito</p><button type="button" class="drawer__close" data-cart-close aria-label="Cerrar el carrito">${ICON.cerrar}</button></div>
    <div class="drawer__items" id="drawerItems"></div>
    <div class="drawer__foot" id="drawerFoot">
      <div class="drawer__total"><span>Total</span><strong id="drawerTotal">$0</strong></div>
      <button type="button" class="btn btn-cta btn-block" id="cartCheckout">Finalizar compra</button>
      <a class="btn btn-ghost btn-block" id="cartWa" href="https://wa.me/${WA}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir por WhatsApp</span></a>
    </div>
  </aside>
</div>
<div class="visor" id="visor" role="dialog" aria-modal="true" aria-label="Trabajo del taller" hidden>
  <div class="visor__bd" data-visor-close></div>
  <div class="visor__panel">
    <button type="button" class="visor__close" data-visor-close aria-label="Cerrar">${ICON.cerrar}</button>
    <div class="visor__body" id="visorBody"></div>
    <div class="visor__nav"><button type="button" class="visor__btn" data-visor-paso="-1" aria-label="Trabajo anterior">${ICON.izq}</button><span class="visor__cuenta" id="visorCuenta"></span><button type="button" class="visor__btn" data-visor-paso="1" aria-label="Trabajo siguiente">${ICON.der}</button></div>
  </div>
</div>`);
  }
}

function abrirOverlay(el) {
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('open'); syncNoScroll(); }));
  syncNoScroll();
}
function cerrarOverlay(el, ms = 360) {
  el.classList.remove('open');
  syncNoScroll();
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, ms);
}

let qvTrigger = null;
let qvVar = '';
let qvId = '';
function abrirQuickView(id, trigger, vInicial = '') {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  qvId = p.id;
  if (qv.hidden) qvTrigger = trigger || null;
  qvVar = p.var ? opcion(p, vInicial).id : '';
  pintarQuickView(p);
  abrirOverlay(qv);
  setTimeout(() => qv.querySelector('.qv__close')?.focus(), 60);
}
function pintarQuickView(p) {
  const body = document.getElementById('qvBody');
  const n = esc(p.nombre);
  const o = opcion(p, qvVar);
  const vars = p.var ? `<div class="qv__vars"><p class="qv__label">${esc(p.var.nombre)}: <strong>${esc(o.label.replace(/^Rodado |^Talle /, ''))}</strong></p><div class="pills">${p.var.ops.map(op => `<button type="button" class="pill" data-qv-var="${op.id}" aria-pressed="${op.id === qvVar}">${esc(op.corto || op.label)}</button>`).join('')}</div></div>` : '';
  const rel = Servidor.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const relHTML = rel.length ? `<div class="qv__rel"><p class="qv__label">También te puede servir</p><ul>${rel.map(r => `<li><button type="button" class="qv__relbtn" data-quick="${r.id}"><img src="${imgDe(r)}" alt="" width="56" height="56"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></button></li>`).join('')}</ul></div>` : '';
  const stockTxt = p.stock > 3 ? 'En stock' : p.stock > 0 ? `Quedan ${p.stock}` : 'Sin stock por ahora';
  const acciones = disponible(p)
    ? `<div class="qv__acciones">${stepperHTML(p.nombre, Math.min(p.stock, 20))}<button type="button" class="btn btn-cta" data-add="${p.id}" data-v="${qvVar}">${ICON.carritoMas}<span>Agregar al carrito</span></button><button type="button" class="btn btn-dark" data-buy="${p.id}" data-v="${qvVar}">Comprar ahora</button></div>`
    : '';
  body.innerHTML = `<div class="qv__media"><span class="recorte"><img src="${imgDe(p)}" alt="${esc(p.alt)}" width="${p.px}" height="${p.px}"></span>${badgesHTML(p)}</div>
<div class="qv__info"><p class="card__meta">${esc(nombreCat(p.cat))} · ${esc(metaDe(p))}</p><h2 class="qv__nombre">${n}</h2>${precioHTML(p, p.var ? qvVar : null, 'qv__precio')}<p class="qv__stock${p.stock > 0 && p.stock <= 3 ? ' qv__stock--pocas' : ''}">${stockTxt}</p><p class="qv__desc">${esc(p.desc)}</p><ul class="qv__puntos">${(p.puntos || []).map(t => `<li>${ICON.check}<span>${esc(t)}</span></li>`).join('')}</ul>${vars}${acciones}<a class="qv__wa" href="${waProducto(p, qvVar)}" target="_blank" rel="noopener">${ICON.wa}<span>Consultar por WhatsApp</span></a>${relHTML}</div>`;
}
function cerrarQuickView(devolverFoco = true) {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  cerrarOverlay(qv);
  if (devolverFoco && qvTrigger && document.contains(qvTrigger)) qvTrigger.focus();
}
function initQuickView() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-qv-close]')) { cerrarQuickView(); return; }
    const pill = e.target.closest('[data-qv-var]');
    if (pill) {
      const p = getProducto(qvId);
      if (!p) return;
      qvVar = pill.dataset.qvVar;
      const cant = qv.querySelector('[data-stepper] input')?.value;
      pintarQuickView(p);
      const inp = qv.querySelector('[data-stepper] input');
      if (inp && cant) inp.value = cant;
      qv.querySelector(`[data-qv-var="${qvVar}"]`)?.focus();
    }
  });
  document.addEventListener('keydown', e => {
    if (qv.hidden || !qv.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarQuickView(); else atraparFoco(qv, e);
  });
  const slug = new URLSearchParams(location.search).get('producto');
  if (slug && getProducto(slug)) setTimeout(() => abrirQuickView(slug, null), 300);
}

function renderCarrito() {
  const cont = document.getElementById('drawerItems');
  const foot = document.getElementById('drawerFoot');
  if (!cont) return;
  const lineas = Cart.get().map(i => ({ ...i, p: getProducto(i.id) })).filter(i => i.p);
  if (!lineas.length) {
    cont.innerHTML = `<div class="drawer__vacio"><span class="drawer__vacio-ico">${ICON.carrito}</span><p><strong>Tu carrito está vacío</strong></p><p>Sumá una cadena, unas cubiertas o lo que necesite tu bici.</p><a class="btn btn-cta" href="${catalogoHref()}">Ver repuestos</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  cont.innerHTML = `<ul class="lineas">${lineas.map(({ p, v, qty }) => {
    const o = opcion(p, v);
    return `<li class="linea"><img src="${imgDe(p)}" alt="" width="64" height="64"><div class="linea__info"><p class="linea__nombre">${esc(p.nombre)}</p>${o ? `<p class="linea__var">${esc(o.label)}</p>` : ''}<p class="linea__precio">${formatearPrecio(precioDe(p, v) * qty)}</p><div class="stepper stepper--sm"><button type="button" data-linea-step="-1" data-id="${p.id}" data-v="${v || ''}" aria-label="Restar uno de ${esc(p.nombre)}">${ICON.menos}</button><span class="stepper__n" aria-live="polite">${qty}</span><button type="button" data-linea-step="1" data-id="${p.id}" data-v="${v || ''}" aria-label="Sumar uno de ${esc(p.nombre)}">${ICON.mas}</button></div></div><button type="button" class="linea__quitar" data-quitar-linea="${p.id}" data-v="${v || ''}" aria-label="Quitar ${esc(p.nombre)} del carrito">${ICON.basura}</button></li>`;
  }).join('')}</ul>`;
  document.getElementById('drawerTotal').textContent = formatearPrecio(Cart.total());
  const wa = document.getElementById('cartWa');
  if (wa) wa.href = waPedido();
}
let cartTrigger = null;
function abrirCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  cartTrigger = document.activeElement;
  renderCarrito();
  abrirOverlay(d);
  setTimeout(() => d.querySelector('.drawer__close')?.focus(), 60);
}
function cerrarCarrito() {
  const d = document.getElementById('drawer');
  if (!d || d.hidden) return;
  cerrarOverlay(d, 420);
  if (cartTrigger && document.contains(cartTrigger)) cartTrigger.focus();
}
function initCarrito() {
  const d = document.getElementById('drawer');
  if (!d) return;
  d.addEventListener('click', e => {
    if (e.target.closest('[data-cart-close]')) { cerrarCarrito(); return; }
    const st = e.target.closest('[data-linea-step]');
    if (st) {
      const it = Cart.get().find(i => i.id === st.dataset.id && (i.v || '') === st.dataset.v);
      if (!it) return;
      const n = it.qty + Number(st.dataset.lineaStep);
      if (n < 1) Cart.remove(st.dataset.id, st.dataset.v); else Cart.setQty(st.dataset.id, st.dataset.v, n);
      return;
    }
    const q = e.target.closest('[data-quitar-linea]');
    if (q) { Cart.remove(q.dataset.quitarLinea, q.dataset.v); return; }
    if (e.target.closest('#cartCheckout')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  document.addEventListener('cart:updated', () => { if (!d.hidden) renderCarrito(); });
  document.addEventListener('keydown', e => {
    if (d.hidden || !d.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarCarrito(); else atraparFoco(d, e);
  });
}

let visorIndice = 0;
let visorTrigger = null;
function pintarVisor() {
  const t = TRABAJOS[visorIndice];
  const body = document.getElementById('visorBody');
  if (!t || !body) return;
  body.innerHTML = `<figure class="visor__foto visor__foto--${t.h > t.w ? 'v' : 'c'}"><img src="images/${t.img}.webp" alt="${esc(t.alt)}" width="${t.w}" height="${t.h}"></figure><div class="visor__txt"><p class="trabajo__tipo"><span class="trabajo__n">${String(visorIndice + 1).padStart(2, '0')}</span>${esc(t.tipo)}</p><h2 class="visor__titulo">${esc(t.titulo)}</h2><p>${esc(t.texto)}</p><a class="btn btn-cta" href="${waLink(t.wa)}" target="_blank" rel="noopener">${ICON.wa}<span>Pedir este trabajo</span></a></div>`;
  const c = document.getElementById('visorCuenta');
  if (c) c.textContent = `${visorIndice + 1} / ${TRABAJOS.length}`;
}
function abrirVisor(i, trigger) {
  const v = document.getElementById('visor');
  if (!v) return;
  visorIndice = i; visorTrigger = trigger || null;
  pintarVisor();
  abrirOverlay(v);
  setTimeout(() => v.querySelector('.visor__close')?.focus(), 60);
}
function cerrarVisor(devolverFoco = true) {
  const v = document.getElementById('visor');
  if (!v || v.hidden) return;
  cerrarOverlay(v);
  if (devolverFoco && visorTrigger && document.contains(visorTrigger)) visorTrigger.focus();
}
function initVisor() {
  const v = document.getElementById('visor');
  if (!v) return;
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-trabajo]');
    if (t) abrirVisor(Number(t.dataset.trabajo), t);
  });
  v.addEventListener('click', e => {
    if (e.target.closest('[data-visor-close]')) { cerrarVisor(); return; }
    const p = e.target.closest('[data-visor-paso]');
    if (p) { visorIndice = (visorIndice + Number(p.dataset.visorPaso) + TRABAJOS.length) % TRABAJOS.length; pintarVisor(); }
  });
  document.addEventListener('keydown', e => {
    if (v.hidden || !v.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarVisor();
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { visorIndice = (visorIndice + (e.key === 'ArrowRight' ? 1 : -1) + TRABAJOS.length) % TRABAJOS.length; pintarVisor(); }
    else atraparFoco(v, e);
  });
}

function initTurno() {
  const form = document.getElementById('turnoForm');
  const link = document.getElementById('turnoWa');
  if (!form || !link) return;
  const armar = () => {
    const servicios = [...form.querySelectorAll('input[data-f="servicio"]:checked')].map(i => i.value);
    const tipo = form.querySelector('#turnoTipo')?.value || '';
    const rodado = form.querySelector('#turnoRodado')?.value || '';
    const nota = (form.querySelector('#turnoNota')?.value || '').trim().slice(0, 300);
    const lineas = [`Hola, ${MARCA}. Quiero pedir turno para el taller.`];
    const bici = [tipo && `bici ${tipo.toLowerCase()}`, rodado && `rodado ${rodadoLabel(rodado)}`].filter(Boolean).join(', ');
    if (bici) lineas.push(`Es una ${bici}.`);
    if (servicios.length) lineas.push(`Necesita: ${servicios.join(', ')}.`);
    if (nota) lineas.push(nota);
    link.href = waLink(lineas.join('\n'));
    const n = servicios.length;
    const resumen = document.getElementById('turnoResumen');
    if (resumen) resumen.textContent = n ? `${n} ${n === 1 ? 'trabajo elegido' : 'trabajos elegidos'}` : 'Elegí uno o más trabajos';
  };
  form.addEventListener('input', armar);
  form.addEventListener('change', armar);
  link.addEventListener('click', () => { armar(); showToast('Te abrimos WhatsApp con el pedido de turno'); });
  armar();
}

function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  try {
    const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, zoomControl: true }).setView(UBICACION.coords, 14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
    L.circleMarker(UBICACION.coords, { radius: 12, color: '#25352D', weight: 3, fillColor: '#CCD95E', fillOpacity: 1 }).addTo(mapa).bindPopup(`<strong>${MARCA}</strong><br>${UBICACION.ciudad}`);
    window.addEventListener('load', () => mapa.invalidateSize());
  } catch (e) { el.classList.add('mapa--error'); }
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
  cart?.addEventListener('click', abrirCarrito);
  sync();
}

function initCatalogo() {
  if (document.body.dataset.pagina !== 'catalogo') return;
  const $ = id => document.getElementById(id);
  const grid = $('catGrid');
  if (!grid) return;
  const POR_PAGINA = 16;
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre', 'novedades'];
  const EXTRAS = { oferta: 'En oferta', stock: 'Con stock' };
  const qs = new URLSearchParams(location.search);
  const st = {
    q: (qs.get('q') || '').trim().slice(0, 60),
    cat: (qs.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id)),
    rodado: RODADOS.some(r => r.id === qs.get('rodado')) ? qs.get('rodado') : '',
    electrica: qs.get('electrica') === '1',
    rango: RANGOS[qs.get('rango')] ? qs.get('rango') : '',
    extra: (qs.get('extra') || '').split(',').filter(x => EXTRAS[x]),
    orden: ORDENES.includes(qs.get('orden')) ? qs.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0, timer = 0;
  const inputQ = $('catQ'), selOrden = $('catOrden'), cuenta = $('catCuenta'), activos = $('catActivos');
  const vacio = $('catVacio'), mas = $('catMas'), body = $('filtrosBody'), panel = $('filtros');
  const h1 = $('catTitulo'), bajada = $('catBajada'), miga = $('migaActual'), nFiltros = $('filtrosN');
  if (inputQ) inputQ.value = st.q;
  if (selOrden) selOrden.value = st.orden;
  const filtrosServidor = () => ({ q: st.q, cat: st.cat, rodado: st.rodado, electrica: st.electrica, rango: st.rango, extra: st.extra });

  function escribirURL() {
    const p = new URLSearchParams();
    if (st.q) p.set('q', st.q);
    if (st.cat.length) p.set('cat', st.cat.join(','));
    if (st.rodado) p.set('rodado', st.rodado);
    if (st.electrica) p.set('electrica', '1');
    if (st.rango) p.set('rango', st.rango);
    if (st.extra.length) p.set('extra', st.extra.join(','));
    if (st.orden !== 'destacados') p.set('orden', st.orden);
    const s = p.toString();
    history.replaceState(null, '', s ? `?${s}` : location.pathname);
  }
  function pintarCabecera() {
    let t = 'Catálogo completo', b = 'Bicis, eléctricas, repuestos para todos los rodados y accesorios.', m = '';
    if (st.cat.length === 1) { t = nombreCat(st.cat[0]); m = t; b = st.rodado ? `${t} para rodado ${rodadoLabel(st.rodado)}.` : 'Elegí, sumá al carrito y pagá online, o pedilo por WhatsApp.'; }
    else if (st.rodado) { t = `Todo para rodado ${rodadoLabel(st.rodado)}`; m = `Rodado ${rodadoLabel(st.rodado)}`; b = 'Ruedas, cubiertas y bicis de tu medida. Cadenas, frenos y accesorios van en cualquier rodado.'; }
    else if (st.electrica) { t = 'Para bici eléctrica'; m = t; b = 'Bicis eléctricas, baterías y repuestos que aguantan el peso y la fuerza del motor.'; }
    else if (st.q) { t = `Resultados para «${st.q}»`; m = 'Búsqueda'; }
    if (h1) h1.textContent = t;
    if (bajada) bajada.textContent = b;
    if (miga) { miga.hidden = !m; miga.textContent = m; }
    document.title = `${t} — ${MARCA}`;
  }
  function pintarFiltros() {
    if (!body) return;
    const f = Servidor.facetas(filtrosServidor());
    const cats = CATEGORIAS.map(c => `<label class="check"><input type="checkbox" data-f="cat" value="${c.id}"${st.cat.includes(c.id) ? ' checked' : ''}><span>${esc(c.nombre)}</span><small>${f.cat[c.id] || 0}</small></label>`).join('');
    const rods = RODADOS.map(r => { const n = f.rodado[r.id] || 0; return `<button type="button" class="chip-rod" data-rodado-btn="${r.id}" aria-pressed="${st.rodado === r.id}"${n || st.rodado === r.id ? '' : ' disabled'} aria-label="Rodado ${r.label}, ${n} productos">${r.label}</button>`; }).join('');
    const rangos = Object.entries(RANGOS).map(([k, r]) => `<button type="button" class="chip-txt" data-rango="${k}" aria-pressed="${st.rango === k}">${esc(r.nombre)} <small>${f.rango[k] || 0}</small></button>`).join('');
    const extras = Object.entries(EXTRAS).map(([k, l]) => `<label class="check"><input type="checkbox" data-f="extra" value="${k}"${st.extra.includes(k) ? ' checked' : ''}><span>${l}</span></label>`).join('');
    body.innerHTML = `<div class="fgrupo"><p class="fgrupo__t">Categoría</p>${cats}</div><div class="fgrupo fgrupo--rod"><p class="fgrupo__t">Rodado</p><div class="chips-rod">${rods}</div></div><div class="fgrupo"><p class="fgrupo__t">Bici eléctrica</p><label class="check"><input type="checkbox" data-f="electrica" value="1"${st.electrica ? ' checked' : ''}><span>Para bici eléctrica</span><small>${f.electrica}</small></label></div><div class="fgrupo"><p class="fgrupo__t">Precio</p><div class="chips-txt">${rangos}</div></div><div class="fgrupo"><p class="fgrupo__t">Disponibilidad</p>${extras}</div>`;
    const n = st.cat.length + (st.rodado ? 1 : 0) + (st.electrica ? 1 : 0) + (st.rango ? 1 : 0) + st.extra.length;
    if (nFiltros) { nFiltros.hidden = !n; nFiltros.textContent = n; }
    document.querySelectorAll('.cat-rodados [data-rodado-btn]').forEach(b => {
      const id = b.dataset.rodadoBtn;
      b.setAttribute('aria-pressed', String(st.rodado === id));
      b.disabled = !(f.rodado[id] || st.rodado === id);
    });
  }
  function pintarActivos() {
    if (!activos) return;
    const chips = [];
    if (st.q) chips.push(['q', '', `«${st.q}»`]);
    st.cat.forEach(id => chips.push(['cat', id, nombreCat(id)]));
    if (st.rodado) chips.push(['rodado', '', `Rodado ${rodadoLabel(st.rodado)}`]);
    if (st.electrica) chips.push(['electrica', '', 'Para eléctrica']);
    if (st.rango) chips.push(['rango', '', RANGOS[st.rango].nombre]);
    st.extra.forEach(x => chips.push(['extra', x, EXTRAS[x]]));
    activos.innerHTML = chips.map(([k, v, l]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${v}" aria-label="Quitar filtro ${esc(l)}">${esc(l)}${ICON.cerrar}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="activo activo--todo" data-limpiar>Limpiar todo</button>' : '');
  }
  function cargar(reset) {
    const res = Servidor.consultar({ filtros: filtrosServidor(), orden: st.orden, cursor: reset ? null : cursor, limite: POR_PAGINA });
    const html = res.items.map(p => cardHTML(p, { rodado: st.rodado })).join('');
    if (reset) { grid.innerHTML = html; mostrados = res.items.length; }
    else { grid.insertAdjacentHTML('beforeend', html); mostrados += res.items.length; }
    cursor = res.cursor;
    if (mas) mas.hidden = !cursor;
    if (vacio) vacio.hidden = res.total > 0;
    grid.hidden = res.total === 0;
    if (cuenta) cuenta.textContent = res.total ? `Mostrando ${mostrados} de ${res.total} ${res.total === 1 ? 'producto' : 'productos'}` : 'Sin resultados';
    const waVacio = $('catVacioWa');
    if (waVacio) waVacio.href = waLink(`Hola, ${MARCA}. Busco ${st.q || 'un repuesto'}${st.rodado ? ` para rodado ${rodadoLabel(st.rodado)}` : ''}. ¿Lo tienen?`);
    revelarNuevos(grid);
    if (vacio && !vacio.hidden) revelarNuevos(vacio);
    refrescarST();
  }
  function aplicar() { pintarCabecera(); pintarFiltros(); pintarActivos(); escribirURL(); cargar(true); }
  function limpiar() { Object.assign(st, { q: '', cat: [], rodado: '', electrica: false, rango: '', extra: [] }); if (inputQ) inputQ.value = ''; aplicar(); }

  inputQ?.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { st.q = inputQ.value.trim().slice(0, 60); aplicar(); }, 260); });
  inputQ?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(timer); st.q = inputQ.value.trim().slice(0, 60); aplicar(); });
  selOrden?.addEventListener('change', () => { st.orden = ORDENES.includes(selOrden.value) ? selOrden.value : 'destacados'; aplicar(); });
  body?.addEventListener('change', e => {
    const i = e.target.closest('input[data-f]');
    if (!i) return;
    if (i.dataset.f === 'cat') st.cat = [...body.querySelectorAll('input[data-f="cat"]:checked')].map(x => x.value);
    if (i.dataset.f === 'extra') st.extra = [...body.querySelectorAll('input[data-f="extra"]:checked')].map(x => x.value);
    if (i.dataset.f === 'electrica') st.electrica = i.checked;
    aplicar();
  });
  document.addEventListener('click', e => {
    const rb = e.target.closest('[data-rodado-btn]');
    if (rb && !rb.closest('[data-rodados-home]')) { st.rodado = st.rodado === rb.dataset.rodadoBtn ? '' : rb.dataset.rodadoBtn; aplicar(); return; }
    const rg = e.target.closest('[data-rango]');
    if (rg) { st.rango = st.rango === rg.dataset.rango ? '' : rg.dataset.rango; aplicar(); return; }
    const q = e.target.closest('[data-quitar]');
    if (q) {
      const k = q.dataset.quitar, v = q.dataset.valor;
      if (k === 'q') { st.q = ''; if (inputQ) inputQ.value = ''; }
      else if (k === 'cat') st.cat = st.cat.filter(x => x !== v);
      else if (k === 'extra') st.extra = st.extra.filter(x => x !== v);
      else if (k === 'electrica') st.electrica = false;
      else st[k] = '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) { limpiar(); return; }
    if (e.target.closest('[data-abrir-filtros]')) { abrirFiltros(); return; }
    if (e.target.closest('[data-cerrar-filtros]')) cerrarFiltros();
  });
  mas?.addEventListener('click', () => cargar(false));

  const bd = document.createElement('div');
  bd.className = 'filtros-bd';
  bd.addEventListener('click', () => cerrarFiltros());
  panel?.after(bd);
  const btnFiltros = document.querySelector('[data-abrir-filtros]');
  function abrirFiltros() {
    if (!panel) return;
    panel.classList.add('open'); bd.classList.add('open');
    btnFiltros?.setAttribute('aria-expanded', 'true');
    syncNoScroll();
    setTimeout(() => panel.querySelector('.filtros__close')?.focus(), 60);
  }
  function cerrarFiltros() {
    if (!panel?.classList.contains('open')) return;
    panel.classList.remove('open'); bd.classList.remove('open');
    btnFiltros?.setAttribute('aria-expanded', 'false');
    syncNoScroll();
    btnFiltros?.focus();
  }
  document.addEventListener('keydown', e => {
    if (!panel?.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarFiltros(); else atraparFoco(panel, e);
  });

  pintarCabecera(); pintarFiltros(); pintarActivos(); cargar(true);
  if (qs.get('foco') === 'buscar' && inputQ) setTimeout(() => inputQ.focus(), 200);
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

montarOverlays();
initModelBarScroll();
initCatMenu();
initCuentas();
renderDestacados();
renderPreview();
initRodados();
renderBicis();
renderTrabajos();
initCatalogo();
initReveals();
initNav();
initAcciones();
initQuickView();
initCarrito();
initVisor();
initTurno();
initFloats();
updateCartBadge();
initHeroMotion();
initSello();
initParallax();
initMapa();
