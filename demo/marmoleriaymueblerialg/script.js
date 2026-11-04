const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491125067794';
const MARCA = 'Marmolería y Mueblería LG';
const POR_PAGINA = 16;
const MAX_CANT = 30;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';
const HORARIO = { 1: [8 * 60, 18 * 60], 2: [8 * 60, 18 * 60], 3: [8 * 60, 18 * 60], 4: [8 * 60, 18 * 60], 5: [8 * 60, 18 * 60], 6: [9 * 60, 13 * 60] };
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
  { id: 'piedra', nombre: 'Mármoles y granitos', bajada: 'Mesadas, vanitorys, mesas y placas' },
  { id: 'cocina', nombre: 'Muebles de cocina', bajada: 'Bajo mesadas, alacenas e islas' },
  { id: 'placares', nombre: 'Placares y melamina', bajada: 'Placares y frentes corredizos' },
];
const AMBIENTES = [
  { id: 'cocina', nombre: 'Cocina' },
  { id: 'bano', nombre: 'Baño' },
  { id: 'dormitorio', nombre: 'Dormitorio' },
  { id: 'comedor', nombre: 'Comedor' },
];
const MATERIALES_F = [
  { id: 'granito', nombre: 'Granito' },
  { id: 'marmol', nombre: 'Mármol' },
  { id: 'melamina', nombre: 'Melamina' },
  { id: 'acero', nombre: 'Acero inoxidable' },
];
const ORIGENES = [
  { id: 'nacional', nombre: 'Piedra nacional' },
  { id: 'importado', nombre: 'Piedra importada' },
];
const PRECIOS = [
  { id: 'hasta-300', nombre: 'Hasta $300.000', min: 0, max: 300000 },
  { id: '300-600', nombre: '$300.000 a $600.000', min: 300001, max: 600000 },
  { id: '600-1000', nombre: '$600.000 a $1.000.000', min: 600001, max: 1000000 },
  { id: 'mas-1000', nombre: 'Más de $1.000.000', min: 1000001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const PIEDRAS = [
  { id: 'gris-mara', nombre: 'Granito Gris Mara', corto: 'Gris Mara', origen: 'Nacional', m2: 175000, img: 'images/p-gris-mara.webp', alt: 'Canto pulido de una mesada de granito Gris Mara' },
  { id: 'negro-brasil', nombre: 'Granito Negro Brasil', corto: 'Negro Brasil', origen: 'Importado', m2: 228000, img: 'images/p-negro-brasil.webp', alt: 'Muestra pulida de granito Negro Brasil' },
  { id: 'itaunas', nombre: 'Granito Blanco Itaúnas', corto: 'Blanco Itaúnas', origen: 'Importado', m2: 246000, img: 'images/p-itaunas.webp', alt: 'Mesada de granito Blanco Itaúnas con bacha de acero' },
  { id: 'carrara', nombre: 'Mármol Blanco Carrara', corto: 'Blanco Carrara', origen: 'Importado', m2: 310000, img: 'images/p-placa-carrara.webp', alt: 'Placa de mármol Blanco Carrara con vetas grises' },
  { id: 'calacatta', nombre: 'Mármol Calacatta', corto: 'Calacatta', origen: 'Importado', m2: 445000, img: 'images/p-mesa-calacatta.webp', alt: 'Mesa de mármol Calacatta de veta marcada' },
];
const BACHAS = [
  { id: 'no', nombre: 'Sin bacha', precio: 0 },
  { id: 'simple', nombre: 'Simple de acero', precio: 69000 },
  { id: 'doble', nombre: 'Doble de acero', precio: 119000 },
];
const CALADO_ANAFE = 15000;
const ZOCALO_M = 0.07;
const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const clamp01 = n => clamp(n, 0, 1);
const metros = cm => (cm / 100).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function precioMesada({ mat = 'gris-mara', largo = 160, prof = 60, bacha = 'no', zocalo = true, anafe = false } = {}) {
  const piedra = PIEDRAS.find(p => p.id === mat) || PIEDRAS[0];
  const L = clamp(Math.round(Number(largo) || 0), 40, 400);
  const P = clamp(Math.round(Number(prof) || 0), 30, 120);
  const b = BACHAS.find(x => x.id === bacha) || BACHAS[0];
  const superficie = (L / 100) * (P / 100) + (zocalo ? (L / 100) * ZOCALO_M : 0);
  const extras = b.precio + (anafe ? CALADO_ANAFE : 0);
  const total = Math.ceil((superficie * piedra.m2 + extras) / 1000) * 1000;
  return { piedra, largo: L, prof: P, bacha: b, zocalo: !!zocalo, anafe: !!anafe, superficie: Math.round(superficie * 100) / 100, extras, total };
}

const medida = (mat, largo, prof, extra = {}) => ({
  id: `${largo}x${prof}`,
  nombre: `${metros(largo)} × ${metros(prof)} m`,
  corto: `${metros(largo)} × ${metros(prof)} m`,
  precio: precioMesada({ mat, largo, prof, zocalo: true, ...extra }).total,
});
const op = (id, nombre, precio, corto = nombre) => ({ id, nombre, corto, precio });
const img = (archivo, alt, lado = 800) => ({ src: `images/${archivo}`, alt, lado });

const PRODUCTOS = [
  {
    id: 'mesada-gris-mara', cod: 'LG-01', rango: 1, nombre: 'Mesada de granito Gris Mara', cat: 'piedra', amb: ['cocina'], mat: ['granito'], origen: 'nacional', fin: 'Pulido', esp: '2 cm',
    corta: 'Granito nacional gris con zócalo de 7 cm.',
    desc: 'Granito nacional que aguanta el calor y el uso de todos los días. Pulido, de 2 cm de espesor, con cantos pulidos y zócalo de 7 cm. ¿Tu cocina pide otra medida? Calculala en la web o escribinos.',
    img: img('p-gris-mara.webp', 'Canto pulido de una mesada de granito Gris Mara junto a la bacha'),
    ops: [medida('gris-mara', 120, 60), medida('gris-mara', 160, 60), medida('gris-mara', 200, 60)], def: '160x60', unidad: 'u', piedra: 'gris-mara',
    claves: ['mesada', 'cocina', 'granito gris', 'nacional'],
  },
  {
    id: 'mesada-negro-brasil', cod: 'LG-02', rango: 2, nombre: 'Mesada de granito Negro Brasil', cat: 'piedra', amb: ['cocina'], mat: ['granito'], origen: 'importado', fin: 'Pulido brillante', esp: '2 cm',
    corta: 'Granito negro importado, pulido a espejo.',
    desc: 'Negro profundo con brillo parejo, que queda bien con muebles blancos o de madera. Pulido, de 2 cm de espesor, con cantos pulidos y zócalo de 7 cm.',
    img: img('p-negro-brasil.webp', 'Muestra pulida de granito Negro Brasil sobre una mesada de mármol'),
    ops: [medida('negro-brasil', 120, 60), medida('negro-brasil', 160, 60), medida('negro-brasil', 200, 60)], def: '160x60', unidad: 'u', piedra: 'negro-brasil',
    claves: ['mesada', 'cocina', 'granito negro', 'importado'],
  },
  {
    id: 'mesada-itaunas', cod: 'LG-03', rango: 6, nombre: 'Mesada Blanco Itaúnas con bacha', cat: 'piedra', amb: ['cocina'], mat: ['granito', 'acero'], origen: 'importado', fin: 'Pulido', esp: '2 cm',
    corta: 'Granito claro con bacha de acero pegada.',
    desc: 'Granito Blanco Itaúnas importado, claro y con grano parejo, con la bacha simple de acero inoxidable ya pegada bajo mesada, cantos pulidos y zócalo de 7 cm.',
    img: img('p-itaunas.webp', 'Mesada de granito Blanco Itaúnas con bacha de acero y grifería curva'),
    ops: [medida('itaunas', 120, 60, { bacha: 'simple' }), medida('itaunas', 160, 60, { bacha: 'simple' })], def: '160x60', unidad: 'u', piedra: 'itaunas',
    claves: ['mesada', 'bacha', 'pileta', 'granito blanco', 'importado'],
  },
  {
    id: 'vanitory-carrara', cod: 'LG-04', rango: 3, nombre: 'Vanitory con mesada de mármol Carrara', cat: 'piedra', amb: ['bano'], mat: ['marmol', 'melamina'], origen: 'importado', fin: 'Pulido', esp: '2 cm',
    corta: 'Mueble gris con mesada de Carrara y bacha.',
    desc: 'Mueble de melamina gris con puertas, mesada de mármol Blanco Carrara importado con zócalo, y bacha de loza bajo mesada. Se entrega listo para colocar la grifería.',
    img: img('p-vanitory.webp', 'Vanitory gris con mesada de mármol Carrara y bacha blanca bajo mesada'),
    ops: [op('060', '0,60 m de ancho', 289000, '0,60 m'), op('080', '0,80 m de ancho', 349000, '0,80 m'), op('100', '1,00 m de ancho', 409000, '1,00 m')], def: '080', unidad: 'u',
    claves: ['baño', 'vanitory', 'lavatorio', 'carrara'],
  },
  {
    id: 'mesa-calacatta', cod: 'LG-05', rango: 7, nombre: 'Mesa de comedor de mármol Calacatta', cat: 'piedra', amb: ['comedor'], mat: ['marmol'], origen: 'importado', fin: 'Pulido', esp: '3 cm',
    corta: 'Tapa y pie de mármol de veta marcada.',
    desc: 'Mesa de comedor con tapa y pie de mármol Calacatta importado de 3 cm, de veta marcada, pulida y sellada para el uso diario.',
    img: img('p-mesa-calacatta.webp', 'Mesa de comedor de mármol Calacatta con sillas tapizadas'),
    ops: [op('160', '1,60 × 0,90 m', 940000), op('200', '2,00 × 1,00 m', 1190000)], def: '160', unidad: 'u', piedra: 'calacatta',
    claves: ['mesa', 'comedor', 'living', 'calacatta'],
  },
  {
    id: 'placa-carrara', cod: 'LG-06', rango: 10, nombre: 'Mármol Blanco Carrara por m²', cat: 'piedra', amb: ['cocina', 'bano', 'comedor'], mat: ['marmol'], origen: 'importado', fin: 'Pulido', esp: '2 o 3 cm',
    corta: 'Placa importada para mesadas y revestimientos.',
    desc: 'Mármol Blanco Carrara importado, de fondo blanco con vetas grises finas, para mesadas, revestimientos, escalones y tapas. Se vende por metro cuadrado.',
    img: img('p-placa-carrara.webp', 'Superficie de mármol Blanco Carrara con vetas grises', 680),
    ops: [op('2cm', '2 cm de espesor', 310000, '2 cm'), op('3cm', '3 cm de espesor', 395000, '3 cm')], def: '2cm', unidad: 'm2', piedra: 'carrara',
    claves: ['placa', 'revestimiento', 'metro cuadrado', 'carrara', 'escalones'],
  },
  {
    id: 'bacha-acero', cod: 'LG-07', rango: 12, nombre: 'Bacha de acero inoxidable', cat: 'piedra', amb: ['cocina'], mat: ['acero'], origen: null, fin: 'Satinado', esp: '—',
    corta: 'Para pegar bajo mesada en tu mesada nueva.',
    desc: 'Bacha de acero inoxidable satinado para pegar bajo mesada. La sumás a tu mesada de granito o mármol y la dejamos pegada y sellada.',
    img: img('p-bacha.webp', 'Bacha de acero inoxidable pegada bajo una mesada de granito claro', 755),
    ops: [op('simple', 'Simple 52 × 37 cm', 69000, 'Simple'), op('doble', 'Doble 78 × 37 cm', 119000, 'Doble')], def: 'simple', unidad: 'u',
    claves: ['bacha', 'pileta', 'acero', 'cocina'],
  },
  {
    id: 'bajo-mesada-roble', cod: 'LG-08', rango: 5, nombre: 'Bajo mesada de melamina roble', cat: 'cocina', amb: ['cocina'], mat: ['melamina'], origen: null, fin: 'Melamina roble', esp: '18 mm',
    corta: 'Puertas y cajones con tirador de perfil.',
    desc: 'Bajo mesada de melamina roble de 18 mm con puertas y cajones, tiradores de perfil y bisagras con cierre suave. Listo para recibir la mesada de piedra.',
    img: img('p-bajo-mesada.webp', 'Bajo mesada de melamina roble con cajones y tirador de perfil', 470),
    ops: [op('120', '1,20 m de largo', 320000, '1,20 m'), op('160', '1,60 m de largo', 410000, '1,60 m'), op('200', '2,00 m de largo', 495000, '2,00 m')], def: '160', unidad: 'u',
    claves: ['bajo mesada', 'mueble de cocina', 'roble', 'cajones'],
  },
  {
    id: 'alacena-roble', cod: 'LG-09', rango: 9, nombre: 'Alacena de melamina roble con luz LED', cat: 'cocina', amb: ['cocina'], mat: ['melamina'], origen: null, fin: 'Melamina roble', esp: '18 mm',
    corta: 'Con tira de luz cálida bajo el mueble.',
    desc: 'Alacena de melamina roble de 18 mm con puertas de apertura con perfil y una tira LED de luz cálida bajo el mueble para iluminar la mesada.',
    img: img('p-alacena.webp', 'Alacenas de melamina roble con luz cálida sobre una mesada de mármol', 480),
    ops: [op('120', '1,20 m de largo', 235000, '1,20 m'), op('160', '1,60 m de largo', 299000, '1,60 m')], def: '120', unidad: 'u',
    claves: ['alacena', 'mueble de cocina', 'led', 'roble'],
  },
  {
    id: 'isla-roble', cod: 'LG-10', rango: 8, nombre: 'Isla desayunador con mesada de mármol', cat: 'cocina', amb: ['cocina'], mat: ['melamina', 'marmol'], origen: null, fin: 'Roble y mármol', esp: '2 cm',
    corta: 'Mueble roble con mesada de mármol y banquetas.',
    desc: 'Isla de melamina roble con mesada de mármol blanco que baja en cascada a un lado, guardado del lado de la cocina y lugar para dos banquetas del otro.',
    img: img('p-isla.webp', 'Isla de cocina de melamina roble con mesada de mármol blanco y dos banquetas', 720),
    ops: [op('180', '1,80 × 0,90 m', 1450000)], def: '180', unidad: 'u',
    claves: ['isla', 'desayunador', 'barra', 'mármol'],
  },
  {
    id: 'cocina-l-blanca', cod: 'LG-11', rango: 4, nombre: 'Cocina en L de melamina blanca', cat: 'cocina', amb: ['cocina'], mat: ['melamina'], origen: null, fin: 'Melamina blanca', esp: '18 mm',
    corta: 'Bajo mesada y alacenas; la mesada va aparte.',
    desc: 'Cocina completa en L de melamina blanca: bajo mesada con cajonera y alacenas con tiradores de acero. La mesada de granito o mármol la elegís aparte.',
    img: img('p-cocina-blanca.webp', 'Cocina en L de melamina blanca con alacenas y cajonera'),
    ops: [op('240', '2,40 × 1,60 m', 1290000), op('300', '3,00 × 1,80 m', 1590000)], def: '240', unidad: 'u',
    claves: ['cocina completa', 'mueble de cocina', 'blanco', 'en l'],
  },
  {
    id: 'placar-corredizo', cod: 'LG-12', rango: 4.5, nombre: 'Placar de puertas corredizas roble', cat: 'placares', amb: ['dormitorio'], mat: ['melamina'], origen: null, fin: 'Melamina roble', esp: '18 mm',
    corta: 'Interior con estantes, cajones y barral.',
    desc: 'Placar de 2,40 m de alto en melamina roble de 18 mm, con dos puertas corredizas con perfil de aluminio e interior con estantes, cajones y barral.',
    img: img('p-placar.webp', 'Placar de dos puertas corredizas de melamina roble con perfiles de aluminio'),
    ops: [op('150', '1,50 m de ancho', 560000, '1,50 m'), op('180', '1,80 m de ancho', 640000, '1,80 m'), op('240', '2,40 m de ancho', 820000, '2,40 m')], def: '180', unidad: 'u',
    claves: ['placar', 'ropero', 'dormitorio', 'corredizo'],
  },
  {
    id: 'frente-placar', cod: 'LG-13', rango: 11, nombre: 'Frente corredizo para placar', cat: 'placares', amb: ['dormitorio'], mat: ['melamina'], origen: null, fin: 'Melamina roble', esp: '18 mm',
    corta: 'Dos hojas corredizas para un hueco ya hecho.',
    desc: 'Dos hojas corredizas de melamina de 18 mm con perfil de aluminio y rieles, para cerrar un hueco de placar que ya tenés hecho.',
    img: img('p-frente-placar.webp', 'Detalle de puertas corredizas de melamina roble con perfil de aluminio', 700),
    ops: [op('150', 'Hueco de 1,50 m', 310000, '1,50 m'), op('180', 'Hueco de 1,80 m', 360000, '1,80 m'), op('240', 'Hueco de 2,40 m', 455000, '2,40 m')], def: '180', unidad: 'u',
    claves: ['frente', 'puertas', 'placar', 'corredizo'],
  },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const opDe = (p, v) => p.ops.find(o => o.id === v) || null;
function opcionValida(p, v) {
  return opDe(p, v) ? v : (opDe(p, p.def) ? p.def : p.ops[0].id);
}
const precioDe = (p, v) => opDe(p, opcionValida(p, v)).precio;
const desdeDe = p => Math.min(...p.ops.map(o => o.precio));
function textoVar(p, v) {
  const o = opDe(p, opcionValida(p, v));
  return p.unidad === 'm2' ? `${o.nombre}, por m²` : o.nombre;
}
function cantidadTexto(p, qty) {
  return p.unidad === 'm2' ? `${qty} m²` : `${qty} ${qty === 1 ? 'unidad' : 'unidades'}`;
}
function lineaTexto(p, v, qty) {
  const o = opDe(p, opcionValida(p, v));
  if (p.unidad === 'm2') return `${qty} m² de ${p.nombre.replace(' por m²', '')} (${o.corto})`;
  return `${qty > 1 ? `${qty} × ` : ''}${p.nombre} (${o.corto})`;
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const desde = p => Math.min(...p.ops.map(o => o.precio));
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cod, p.corta, p.desc, p.fin, nombreDe(CATEGORIAS, p.cat),
    ...(p.amb || []).map(a => nombreDe(AMBIENTES, a)), ...(p.mat || []).map(m => nombreDe(MATERIALES_F, m)),
    p.origen ? nombreDe(ORIGENES, p.origen) : '', ...(p.claves || []), ...p.ops.map(o => o.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), amb = lista(f.amb), mat = lista(f.mat), origen = lista(f.origen), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (amb.length && !amb.some(a => (p.amb || []).includes(a))) return false;
    if (mat.length && !mat.some(m => (p.mat || []).includes(m))) return false;
    if (origen.length && !origen.includes(p.origen)) return false;
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

function horaArgentina(fecha = new Date()) {
  try {
    const partes = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, weekday: 'short' }).formatToParts(fecha).map(x => [x.type, x.value]));
    const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { iso: `${partes.year}-${partes.month}-${partes.day}`, dia: dias[partes.weekday], min: (Number(partes.hour) % 24) * 60 + Number(partes.minute) };
  } catch {
    const iso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    return { iso, dia: fecha.getDay(), min: fecha.getHours() * 60 + fecha.getMinutes() };
  }
}
function estadoHorario(fecha = new Date()) {
  const h = horaArgentina(fecha);
  const hhmm = m => `${Math.floor(m / 60)}${m % 60 ? `:${String(m % 60).padStart(2, '0')}` : ''} h`;
  const deDia = (dia, iso) => (FERIADOS.includes(iso) ? null : HORARIO[dia] || null);
  const hoy = deDia(h.dia, h.iso);
  if (hoy && h.min >= hoy[0] && h.min < hoy[1]) {
    return { abierto: true, dia: h.dia, feriado: false, texto: `Abierto ahora, hasta las ${hhmm(hoy[1])}`, corto: `Abierto hasta las ${hhmm(hoy[1])}` };
  }
  if (hoy && h.min < hoy[0]) {
    return { abierto: false, dia: h.dia, feriado: false, texto: `Cerrado ahora · hoy abrimos a las ${hhmm(hoy[0])}`, corto: `Hoy desde las ${hhmm(hoy[0])}` };
  }
  const nombres = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const base = new Date(`${h.iso}T12:00:00-03:00`);
  for (let k = 1; k <= 7; k++) {
    const d = new Date(base.getTime() + k * 86400000);
    const iso = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const dia = (h.dia + k) % 7;
    const r = deDia(dia, iso);
    if (r) {
      const cuando = k === 1 ? 'mañana' : `el ${nombres[dia]}`;
      return { abierto: false, dia: h.dia, feriado: FERIADOS.includes(h.iso), texto: `Cerrado ahora · abrimos ${cuando} a las ${hhmm(r[0])}`, corto: `Abrimos ${cuando} a las ${hhmm(r[0])}` };
    }
  }
  return { abierto: false, dia: h.dia, feriado: false, texto: 'Cerrado ahora', corto: 'Cerrado' };
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
  KEY: 'marmoleriaymueblerialg_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const opId = opcionValida(producto, v);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === opId);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: opId, qty: suma });
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
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = opcionValida(p, i.v);
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, Math.round(i.qty) || 1)); changed = true; }
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

const Resenas = {
  KEY: 'marmoleriaymueblerialg_resenas',
  get() { try { const r = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(r) ? r : []; } catch { return []; } },
  add(r) {
    const limpia = {
      nombre: String(r.nombre || '').trim().slice(0, 60),
      estrellas: clamp(Math.round(Number(r.estrellas) || 0), 1, 5),
      trabajo: String(r.trabajo || '').trim().slice(0, 60),
      texto: String(r.texto || '').trim().slice(0, 600),
      fecha: r.fecha || new Date().toISOString().slice(0, 10),
    };
    const lista = [limpia, ...this.get()].slice(0, 5);
    try { localStorage.setItem(this.KEY, JSON.stringify(lista)); } catch { }
    document.dispatchEvent(new CustomEvent('resenas:updated'));
    return limpia;
  },
};
function validarResena({ nombre = '', estrellas = 0, texto = '' } = {}) {
  const errores = {};
  if (String(nombre).trim().length < 2) errores.nombre = 'Contanos tu nombre.';
  if (!(Number(estrellas) >= 1 && Number(estrellas) <= 5)) errores.estrellas = 'Elegí de 1 a 5 estrellas.';
  if (String(texto).trim().length < 10) errores.texto = 'Contanos un poco más (al menos 10 letras).';
  return errores;
}

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  estrella: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.5l-5.4 2.9 1.2-5.9L3.4 9.4l6-.7z"/></svg>',
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

const etiquetaSumar = (p, v) => `Agregar ${p.nombre}, ${opDe(p, opcionValida(p, v)).corto}, al carrito`;
const origenTxt = p => (p.origen === 'nacional' ? 'Nacional' : p.origen === 'importado' ? 'Importado' : 'Fabricación propia');
const tagTxt = p => (p.origen === 'nacional' ? 'Nacional' : p.origen === 'importado' ? 'Importado' : 'Taller LG');
const medidasTxt = p => (p.ops.length > 1 ? `${p.ops.length} ${p.unidad === 'm2' ? 'espesores' : 'medidas'}` : opDe(p, p.def).corto);

function cardHTML(p, estilo = 'muestra', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  const desde = p.ops.length > 1 ? '<small class="prod__desde">desde</small>' : '';
  const porM2 = p.unidad === 'm2' ? '<small class="prod__unidad">/ m²</small>' : '';
  const precio = `<p class="prod__precio">${desde}<b class="precio">${formatearPrecio(desdeDe(p))}</b>${porM2}</p>`;
  const media = `<div class="prod__media"><button type="button" class="prod__foto" data-qv="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button></div>`;
  const add = `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" data-v="${esc(p.def)}" aria-label="${esc(etiquetaSumar(p, p.def))}">${ICO.mas}<span>Agregar</span></button>`;
  const comprar = `<button type="button" class="btn btn--ghost btn--sm prod-comprar" data-comprar="${esc(p.id)}" data-v="${esc(p.def)}">Comprar</button>`;
  if (estilo === 'placa') {
    return `<article class="prod prod--placa" data-id="${esc(p.id)}"${anim}>
  <div class="prod__marco">${media}<span class="prod__soporte" aria-hidden="true"></span></div>
  <div class="prod__info">
    <p class="prod__cod">${esc(p.cod)} · ${esc(tagTxt(p))}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <div class="prod__pie">${precio}<div class="prod-actions">${add}</div></div>
  </div>
</article>`;
  }
  return `<article class="prod prod--muestra" data-id="${esc(p.id)}"${anim}>
  ${media}
  <p class="prod__tag"><b>${esc(p.cod)}</b><span>${esc(tagTxt(p))}</span></p>
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>
    <p class="prod__op">${esc(medidasTxt(p))}</p>
    ${precio}
    <div class="prod-actions">${add}${comprar}</div>
  </div>
</article>`;
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
  const unidad = p.unidad === 'm2' ? ' m²' : '';
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoVar(p, i.v))} · ${formatearPrecio(precioDe(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}${unidad}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div><p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
  </div>
</li>`;
}
const partirClave = s => { const k = s.indexOf('|'); return [s.slice(0, k), s.slice(k + 1)]; };

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
    cuenta.textContent = items.length ? `${items.length} ${items.length === 1 ? 'producto' : 'productos'}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
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
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito()));
  pintar();
}

function sumar(id, v = '', qty = 1, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const opId = opcionValida(p, v);
  const n = Cart.add(p, qty, opId);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return 0; }
  showToast(`Sumaste ${lineaTexto(p, opId, n)}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) { e.preventDefault(); sumar(s.dataset.sumar, s.dataset.v || '', 1, s); return; }
    const c = e.target.closest('[data-comprar]');
    if (c && !c.closest('#quickView')) {
      e.preventDefault();
      const p = getProducto(c.dataset.comprar);
      if (p) { Cart.add(p, 1, c.dataset.v || ''); window.abrirCarrito?.(c); }
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv, { previo: qv }); }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '', previo } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: opcionValida(p, v), qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const etiquetaVar = p.unidad === 'm2' ? 'Espesor' : 'Medida';
  const varBloque = p.ops.length > 1
    ? `<p class="qv__var-t">${etiquetaVar}: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="${etiquetaVar}">${p.ops.map(o => `<button type="button" class="chip chip--op" data-qv-op="${esc(o.id)}" aria-pressed="${o.id === qvEstado.v}"><b>${esc(o.corto)}</b><small>${formatearPrecio(o.precio)}${p.unidad === 'm2' ? ' / m²' : ''}</small></button>`).join('')}</div>`
    : `<p class="qv__var-t">${etiquetaVar}: <span>${esc(opDe(p, p.def).nombre)}</span></p>`;
  const aMedida = p.piedra && p.cat === 'piedra' && p.unidad !== 'm2' && p.id.startsWith('mesada')
    ? `<a class="qv__medida" href="${HOME_URL}#mesada" data-ir-mesada="${esc(p.piedra)}">¿Otra medida? Calculá tu mesada ${ICO.flecha}</a>` : '';
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></div>
  <div class="qv__info">
    <p class="qv__tag"><b>${esc(p.cod)}</b> ${esc(nombreDe(CATEGORIAS, p.cat))}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <dl class="qv__ficha"><div><dt>Origen</dt><dd>${esc(origenTxt(p))}</dd></div><div><dt>Terminación</dt><dd>${esc(p.fin)}</dd></div><div><dt>Espesor</dt><dd>${esc(p.esp)}</dd></div></dl>
    <div class="qv__var">${varBloque}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Cantidad"><button type="button" data-qv-paso="-1" aria-label="Restar una" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <div class="qv__links"><a class="qv__wsp" href="#" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar por WhatsApp</span></a>${aMedida}</div>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>Desde ${formatearPrecio(desdeDe(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo: previo || document.activeElement, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
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
  if (elegida) elegida.textContent = opDe(p, qvEstado.v).nombre;
  const unidad = p.unidad === 'm2' ? ` por ${qvEstado.qty} m²` : '';
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(precioDe(p, qvEstado.v) * qvEstado.qty) + unidad;
  modal.querySelector('[data-qv-cant]').textContent = p.unidad === 'm2' ? `${qvEstado.qty} m²` : qvEstado.qty;
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
    const irMesada = e.target.closest('[data-ir-mesada]');
    if (irMesada) {
      try { sessionStorage.setItem('lg_mesada_mat', irMesada.dataset.irMesada); } catch { }
      if (document.getElementById('mesada')) { e.preventDefault(); cerrarCapa(modal, { devolverFoco: false }); window.elegirPiedra?.(irMesada.dataset.irMesada); document.getElementById('mesada').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
      return;
    }
    const opB = e.target.closest('[data-qv-op]');
    if (opB) { qvEstado.v = opcionValida(p, opB.dataset.qvOp); pintarQv(); return; }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = Cart.add(p, qvEstado.qty, qvEstado.v);
      if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return; }
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
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, sku: p.cod, description: p.desc,
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
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
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
    const [k, v] = el.dataset.resumen.split(':');
    const r = Tienda.resumen({ [k]: v });
    if (!r.n) return;
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-total-productos]').forEach(el => { el.textContent = Tienda.contar({}); });
}

function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = cont.getAttribute('data-preview').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'muestra';
    const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 8) });
    const orden = new Map(ids.map((id, k) => [id, k]));
    const prods = res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
    if (cont.hasAttribute('data-rail-lista')) {
      cont.innerHTML = prods.map(p => `<li class="rail__item"><div class="rail__in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, estilo, false)}</div></li>`).join('');
    } else {
      cont.innerHTML = prods.map(p => cardHTML(p, estilo)).join('');
    }
  });
}

function initMesada() {
  const sec = document.getElementById('mesada');
  if (!sec) return;
  const form = sec.querySelector('[data-m-form]');
  const largo = sec.querySelector('[data-m-largo]');
  const prof = sec.querySelector('[data-m-prof]');
  const zocalo = sec.querySelector('[data-m-zocalo]');
  const anafe = sec.querySelector('[data-m-anafe]');
  const foto = sec.querySelector('[data-m-img]');
  const cap = sec.querySelector('[data-m-cap]');
  const out = {
    mat: sec.querySelector('[data-m-o-mat]'), med: sec.querySelector('[data-m-o-med]'), sup: sec.querySelector('[data-m-o-sup]'),
    extra: sec.querySelector('[data-m-o-extra]'), total: sec.querySelector('[data-m-total]'), wsp: sec.querySelector('[data-m-wsp]'),
    aviso: sec.querySelector('[data-m-aviso]'),
  };
  const valor = n => sec.querySelector(`input[name="${n}"]:checked`)?.value;
  let actual = null;
  const pintar = () => {
    const pedidoL = Number(largo.value), pedidoP = Number(prof.value);
    actual = precioMesada({ mat: valor('m-piedra'), largo: pedidoL, prof: pedidoP, bacha: valor('m-bacha'), zocalo: zocalo.checked, anafe: anafe.checked });
    const ajustado = (pedidoL && pedidoL !== actual.largo) || (pedidoP && pedidoP !== actual.prof);
    out.aviso.hidden = !ajustado;
    out.aviso.textContent = ajustado ? `Calculamos con ${actual.largo} × ${actual.prof} cm: el largo va de 40 a 400 cm y la profundidad de 30 a 120 cm.` : '';
    if (foto && foto.getAttribute('src') !== actual.piedra.img) { foto.src = actual.piedra.img; foto.alt = actual.piedra.alt; }
    if (cap) cap.textContent = `${actual.piedra.nombre} · ${actual.piedra.origen} · ${formatearPrecio(actual.piedra.m2)} el m²`;
    out.mat.textContent = actual.piedra.nombre;
    out.med.textContent = `${metros(actual.largo)} × ${metros(actual.prof)} m${actual.zocalo ? ' + zócalo' : ''}`;
    out.sup.textContent = `${actual.superficie.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
    const extras = [actual.bacha.id !== 'no' ? `Bacha ${actual.bacha.nombre.toLowerCase()}` : '', actual.anafe ? 'calado para anafe' : ''].filter(Boolean);
    out.extra.textContent = extras.length ? extras.join(' + ') : 'Sin extras';
    out.total.textContent = formatearPrecio(actual.total);
    const detalle = [`${actual.piedra.nombre}`, `${actual.largo} × ${actual.prof} cm`, actual.zocalo ? 'con zócalo' : 'sin zócalo', actual.bacha.id !== 'no' ? `con bacha ${actual.bacha.nombre.toLowerCase()}` : 'sin bacha', actual.anafe ? 'con calado para anafe' : ''].filter(Boolean).join(', ');
    out.wsp.href = wspHref(`Hola! Quiero presupuesto para una mesada de ${detalle}. La web me estimó ${formatearPrecio(actual.total)}.`);
  };
  window.elegirPiedra = id => {
    const r = sec.querySelector(`input[name="m-piedra"][value="${CSS.escape(id)}"]`);
    if (r) { r.checked = true; pintar(); }
  };
  form.addEventListener('input', pintar);
  form.addEventListener('change', pintar);
  sec.querySelectorAll('[data-m-paso]').forEach(b => b.addEventListener('click', () => {
    const inp = sec.querySelector(`#${b.dataset.mCampo}`);
    const n = clamp((Number(inp.value) || 0) + Number(b.dataset.mPaso), Number(inp.min), Number(inp.max));
    inp.value = n;
    pintar();
  }));
  [largo, prof].forEach(inp => inp.addEventListener('blur', () => { inp.value = inp === largo ? actual.largo : actual.prof; pintar(); }));
  let inicial = '';
  try { inicial = sessionStorage.getItem('lg_mesada_mat') || ''; sessionStorage.removeItem('lg_mesada_mat'); } catch { }
  if (inicial && location.hash === '#mesada') window.elegirPiedra(inicial);
  pintar();
}

function initHorario() {
  const pintar = () => {
    const e = estadoHorario();
    document.querySelectorAll('[data-hoy]').forEach(el => { el.classList.toggle('is-abierto', e.abierto); el.classList.toggle('is-cerrado', !e.abierto); });
    document.querySelectorAll('[data-hoy-txt]').forEach(el => { el.textContent = e.texto; });
    document.querySelectorAll('[data-hoy-corto]').forEach(el => { el.textContent = e.corto; });
    document.querySelectorAll('.horas [data-dias]').forEach(li => li.classList.toggle('is-hoy', li.dataset.dias.split(',').map(Number).includes(e.dia)));
  };
  pintar();
  setInterval(pintar, 60000);
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
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
    const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 20;
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
  });
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const btns = [...document.querySelectorAll('[data-visor]')];
  if (!visor || !btns.length) return;
  const imgV = visor.querySelector('[data-visor-img]');
  const pie = visor.querySelector('[data-visor-pie]');
  const fotos = btns.map(b => { const i = b.querySelector('img'); return { src: i.getAttribute('src'), alt: i.alt, w: i.width, h: i.height, t: b.querySelector('.gal__t')?.textContent || i.alt }; });
  let actual = 0;
  const mostrar = k => {
    actual = (k + fotos.length) % fotos.length;
    const f = fotos[actual];
    imgV.src = f.src; imgV.alt = f.alt; imgV.width = f.w; imgV.height = f.h;
    pie.textContent = `${f.t} · Imagen ilustrativa · ${actual + 1} de ${fotos.length}`;
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

function estrellasHTML(n) {
  return `<span class="estrellas" role="img" aria-label="${n} de 5 estrellas">${[1, 2, 3, 4, 5].map(k => `<i class="${k <= n ? 'on' : ''}">${ICO.estrella}</i>`).join('')}</span>`;
}
function initResenas() {
  const form = document.querySelector('[data-resena-form]');
  const lista = document.querySelector('[data-resenas-lista]');
  if (!form || !lista) return;
  const vacio = document.querySelector('[data-resenas-vacio]');
  const pintar = () => {
    const rs = Resenas.get();
    vacio.hidden = rs.length > 0;
    lista.hidden = !rs.length;
    lista.innerHTML = rs.map(r => `<li class="resena"><div class="resena__top">${estrellasHTML(r.estrellas)}<span class="resena__pend">Pendiente de aprobación · solo la ves vos</span></div><p class="resena__txt">${esc(r.texto)}</p><p class="resena__quien"><b>${esc(r.nombre)}</b>${r.trabajo ? ` · ${esc(r.trabajo)}` : ''}</p></li>`).join('');
  };
  const campos = { nombre: form.querySelector('[name="r-nombre"]'), texto: form.querySelector('[name="r-texto"]'), trabajo: form.querySelector('[name="r-trabajo"]') };
  const errorDe = k => form.querySelector(`[data-error="${k}"]`);
  const marcar = errores => {
    ['nombre', 'estrellas', 'texto'].forEach(k => {
      const el = errorDe(k);
      if (el) { el.textContent = errores[k] || ''; el.hidden = !errores[k]; }
      const c = k === 'estrellas' ? null : campos[k];
      if (c) c.setAttribute('aria-invalid', errores[k] ? 'true' : 'false');
    });
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const datos = { nombre: campos.nombre.value, estrellas: form.querySelector('[name="r-estrellas"]:checked')?.value || 0, texto: campos.texto.value, trabajo: campos.trabajo.value };
    const errores = validarResena(datos);
    marcar(errores);
    const primero = Object.keys(errores)[0];
    if (primero) {
      (primero === 'estrellas' ? form.querySelector('[name="r-estrellas"]') : campos[primero])?.focus();
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    const txt = btn.querySelector('span');
    btn.disabled = true; txt.textContent = 'Enviando…';
    setTimeout(() => {
      Resenas.add(datos);
      form.reset(); marcar({});
      btn.disabled = false; txt.textContent = 'Enviar reseña';
      showToast('¡Gracias! Las reseñas se publican al pasar la web a producción.');
    }, 800);
  });
  form.addEventListener('change', () => {
    if (![...form.querySelectorAll('[data-error]')].some(el => !el.hidden)) return;
    marcar(validarResena({ nombre: campos.nombre.value, estrellas: form.querySelector('[name="r-estrellas"]:checked')?.value || 0, texto: campos.texto.value }));
  });
  document.addEventListener('resenas:updated', pintar);
  pintar();
}

function initEscena() {
  const track = document.querySelector('[data-escena]');
  if (!track) return;
  const escena = track.closest('.escena');
  const stage = track.querySelector('.escena__stage');
  const copyA = stage?.querySelector('[data-copy-a]');
  if (!stage || !copyA) return;
  if (reduceMotion) { escena.classList.add('is-static'); return; }
  const mq = window.matchMedia('(max-width: 860px)');
  const suave = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let frame = 0;
  const angulo = () => {
    const h = stage.clientHeight || 1;
    stage.style.setProperty('--ang', `${Math.atan2(110, h)}rad`);
  };
  const pintar = p => {
    const w = 108 - 116 * suave(clamp01((p - 0.05) / 0.75));
    stage.style.setProperty('--w', w.toFixed(2));
    const a = clamp01((w - (mq.matches ? 46 : 44)) / 12);
    copyA.style.opacity = a.toFixed(3);
    copyA.style.pointerEvents = a < 0.15 ? 'none' : '';
    stage.classList.toggle('is-fuera', w > 104 || w < -4);
  };
  window.pintarEscena = pintar;
  const update = () => {
    frame = 0;
    const r = track.getBoundingClientRect();
    const total = r.height - stage.offsetHeight;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    pintar(total > 0 ? clamp01((top - r.top) / total) : 0);
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', () => { angulo(); update(); }, { passive: true });
  angulo();
  update();
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
  const estilo = MODELO === '2' ? 'placa' : 'muestra';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, amb: AMBIENTES, mat: MATERIALES_F, origen: ORIGENES };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    amb: valida(params.get('amb'), AMBIENTES),
    mat: valida(params.get('mat'), MATERIALES_F),
    origen: valida(params.get('origen'), ORIGENES),
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
    if (solo.length !== 1) return '';
    const k = solo[0];
    if (e[k].length !== 1) return '';
    if (k === 'amb') return `Para ${nombreDe(AMBIENTES, e.amb[0]).toLowerCase() === 'baño' ? 'el baño' : nombreDe(AMBIENTES, e.amb[0]).toLowerCase() === 'cocina' ? 'la cocina' : `el ${nombreDe(AMBIENTES, e.amb[0]).toLowerCase()}`}`;
    return nombreDe(GRUPOS[k], e[k][0]);
  }
  function pintarActivos() {
    const chips = [
      ...Object.entries(GRUPOS).flatMap(([k, lista]) => e[k].map(id => ({ k, id, t: nombreDe(lista, id) }))),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = Object.keys(GRUPOS).reduce((s, k) => s + e[k].length, 0) + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Mármoles, granitos y muebles de melamina';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
    document.querySelectorAll('[data-cats-menu] a').forEach(a => {
      const c = new URL(a.href, location.href).searchParams.get('cat');
      if (e.cat.length === 1 && e.cat[0] === c && solo1()) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  const solo1 = () => Object.keys(GRUPOS).filter(k => e[k].length).length === 1;
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

function initHeaderM2() {
  const h = document.querySelector('.site-header--sobre');
  if (!h) return;
  let frame = 0;
  const sync = () => { frame = 0; h.classList.toggle('is-solido', window.scrollY > 40); };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(sync); }, { passive: true });
  sync();
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
  desde('[data-hero-img]', { scale: 1.09, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(8px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero__regla', { scaleX: 0, transformOrigin: '0 50%', duration: 1.1 }, 0.45);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-badge', { y: 14, scale: 0.94, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
}

initPreviews();
initResumenes();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initMesada();
initHorario();
initRail();
initGaleria();
initResenas();
initEscena();
initNav();
initHeaderM2();
initDrawer();
initVistaRapida();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
