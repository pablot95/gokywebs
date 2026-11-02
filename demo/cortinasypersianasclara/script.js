const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491128495014';
const MARCA = 'Cortinas y Persianas Clara';
const POR_PAGINA = 16;
const MAX_CANT = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';

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
  { id: 'pvc', nombre: 'Persianas de PVC', uno: 'PVC', bajada: 'Reforzadas, en varios colores', img: 'images/p-pvc.webp' },
  { id: 'aluminio', nombre: 'Persianas de aluminio', uno: 'Aluminio', bajada: 'Reforzadas, tipo barrio y de enrollar', img: 'images/p-aluminio-cajon.webp' },
  { id: 'madera', nombre: 'Persianas de madera', uno: 'Madera', bajada: 'Tipo barrio, americanas y de enrollar', img: 'images/p-madera.webp' },
  { id: 'interior', nombre: 'Cortinas de interior', uno: 'Interior', bajada: 'Rollers blackout y americanas', img: 'images/p-roller-blackout.webp' },
  { id: 'motores', nombre: 'Motores y apertura manual', uno: 'Accionamiento', bajada: 'Tubulares, control remoto, cinta y manivela', img: 'images/p-motor.webp' },
];
const NECESIDADES = [
  { id: 'oscurecer', nombre: 'Oscurecer el ambiente' },
  { id: 'seguridad', nombre: 'Más seguridad' },
  { id: 'aislar', nombre: 'Aislar del calor y el frío' },
  { id: 'privacidad', nombre: 'Privacidad con luz' },
  { id: 'automatizar', nombre: 'Motorizar' },
];
const PRECIOS = [
  { id: 'hasta100', nombre: 'Hasta $100.000', min: null, max: 100000 },
  { id: '100a200', nombre: '$100.000 a $200.000', min: 100001, max: 200000 },
  { id: 'mas200', nombre: 'Más de $200.000', min: 200001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Recomendados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ACCIONAMIENTO = { id: 'acc', nombre: 'Accionamiento', valores: [
  { id: 'cinta', nombre: 'Cinta con enrollador' },
  { id: 'manivela', nombre: 'Manivela con reductor', suma: 52000 },
  { id: 'motor', nombre: 'Motor tubular con control remoto', suma: 210000 },
] };
const C = { blanco: '#F3F4F2', marfil: '#ECE5D2', gris: '#B9BEC5', plata: '#CDD1D6', roble: '#9C6B3E', grafito: '#3A3F47', bronce: '#6E5640', natural: '#C79A66', nogal: '#5E3E27', lino: '#E7DFD0', arena: '#C9B79A', negro: '#2B2D31' };

const PRODUCTOS = [
  { id: 'pvc-reforzada', nombre: 'Persiana de PVC reforzada', cat: 'pvc', etiqueta: 'De enrollar', badge: 'Variedad de colores', rango: 1,
    img: 'images/p-pvc.webp', alt: 'Persiana de PVC blanca a medio bajar sobre una ventana con cajón exterior',
    nec: ['oscurecer', 'aislar', 'automatizar'], m2: 82000, minM2: 1,
    medida: { ancho: [50, 250], alto: [50, 260], def: [120, 150], etq: ['Ancho', 'Alto'] }, plano: 'lamas',
    opciones: [
      { id: 'color', nombre: 'Color', valores: [{ id: 'blanco', nombre: 'Blanco', color: C.blanco }, { id: 'marfil', nombre: 'Marfil', color: C.marfil }, { id: 'gris', nombre: 'Gris', color: C.gris }, { id: 'roble', nombre: 'Símil roble', color: C.roble, f: 1.08 }, { id: 'grafito', nombre: 'Grafito', color: C.grafito, f: 1.05 }] },
      ACCIONAMIENTO,
    ],
    desc: 'Lamas de PVC reforzado que no se oxidan ni hay que pintar: livianas, silenciosas y fáciles de limpiar. Para ventanas y balcones, con cinta, manivela o motor.',
    datos: [['Lama', 'PVC reforzado'], ['Colores', 'Blanco, marfil, gris, símil roble y grafito'], ['Accionamiento', 'Cinta, manivela o motor'], ['Medida', 'A medida de tu vano']] },
  { id: 'aluminio-enrollar', nombre: 'Persiana de aluminio reforzada', cat: 'aluminio', etiqueta: 'De enrollar', rango: 2,
    img: 'images/p-aluminio-inyectado.webp', alt: 'Persiana de aluminio gris a medio bajar en el ventanal de un living',
    nec: ['oscurecer', 'seguridad', 'aislar', 'automatizar'], m2: 118000, minM2: 1,
    medida: { ancho: [50, 300], alto: [50, 280], def: [120, 150], etq: ['Ancho', 'Alto'] }, plano: 'lamas',
    opciones: [
      { id: 'lama', nombre: 'Lama', valores: [{ id: 'inyectada', nombre: 'Inyectada térmica' }, { id: 'extruida', nombre: 'Extruida de seguridad', f: 1.38 }] },
      { id: 'color', nombre: 'Color', valores: [{ id: 'blanco', nombre: 'Blanco', color: C.blanco }, { id: 'plata', nombre: 'Gris plata', color: C.plata }, { id: 'grafito', nombre: 'Grafito', color: C.grafito }, { id: 'bronce', nombre: 'Bronce', color: C.bronce }] },
      ACCIONAMIENTO,
    ],
    desc: 'Lamas de aluminio con relleno de poliuretano que aíslan del calor y del frío, o extruidas para más seguridad. Se embute en el cajón que ya tenés. ¿La querés tipo barrio, de abrir? También la hacemos: consultala por WhatsApp.',
    datos: [['Lama', 'Inyectada o extruida'], ['Colores', 'Blanco, gris plata, grafito y bronce'], ['Instalación', 'En el cajón existente'], ['Accionamiento', 'Cinta, manivela o motor']] },
  { id: 'aluminio-cajon', nombre: 'Persiana de aluminio con cajón exterior', cat: 'aluminio', etiqueta: 'Sin obra', badge: 'Sin romper paredes', rango: 3,
    img: 'images/p-aluminio-cajon.webp', alt: 'Persiana de aluminio grafito con cajón exterior sobre una ventana',
    nec: ['oscurecer', 'seguridad', 'automatizar'], m2: 148000, minM2: 1,
    medida: { ancho: [50, 260], alto: [50, 260], def: [120, 150], etq: ['Ancho', 'Alto'] }, plano: 'lamas',
    opciones: [
      { id: 'color', nombre: 'Color', valores: [{ id: 'grafito', nombre: 'Grafito', color: C.grafito }, { id: 'blanco', nombre: 'Blanco', color: C.blanco }, { id: 'bronce', nombre: 'Bronce', color: C.bronce }] },
      ACCIONAMIENTO,
    ],
    desc: 'Viene con su propio cajón y sus guías, y se coloca por fuera de la abertura: la solución para ventanas que no tienen cajón, sin romper paredes.',
    datos: [['Cajón', 'Exterior, de aluminio'], ['Colores', 'Grafito, blanco y bronce'], ['Instalación', 'Por fuera, sin obra'], ['Accionamiento', 'Cinta, manivela o motor']] },
  { id: 'madera', nombre: 'Persiana de madera reforzada', cat: 'madera', etiqueta: 'Barrio, americana o de enrollar', rango: 4,
    img: 'images/p-madera.webp', alt: 'Persianas de madera de estilo americano abiertas a los lados de una ventana',
    nec: ['oscurecer', 'seguridad', 'aislar', 'privacidad'], m2: 196000, minM2: 1,
    medida: { ancho: [50, 240], alto: [50, 250], def: [120, 150], etq: ['Ancho', 'Alto'] }, plano: 'hojas',
    opciones: [
      { id: 'estilo', nombre: 'Estilo', valores: [{ id: 'barrio', nombre: 'Tipo barrio, de abrir' }, { id: 'americana', nombre: 'Americana de lamas fijas', f: 1.08 }, { id: 'enrollar', nombre: 'De enrollar común', f: .86 }] },
      { id: 'tono', nombre: 'Terminación', valores: [{ id: 'natural', nombre: 'Natural', color: C.natural }, { id: 'nogal', nombre: 'Nogal', color: C.nogal }, { id: 'blanco', nombre: 'Laqueada blanca', color: C.blanco, f: 1.06 }] },
    ],
    desc: 'Madera maciza tratada para exterior, en el estilo que tiene tu casa: tipo barrio con tablillas que se regulan, americana de lamas fijas o de enrollar común.',
    datos: [['Material', 'Madera maciza tratada'], ['Estilos', 'Barrio, americana o de enrollar'], ['Terminación', 'Natural, nogal o blanca'], ['Medida', 'A medida de tu vano']] },
  { id: 'roller-blackout', nombre: 'Cortina roller blackout', cat: 'interior', etiqueta: 'Oscurece del todo', rango: 5,
    img: 'images/p-roller-blackout.webp', alt: 'Cortina roller blackout color arena en la ventana de un dormitorio',
    nec: ['oscurecer', 'privacidad', 'automatizar'], m2: 58000, minM2: 1,
    medida: { ancho: [40, 300], alto: [40, 300], def: [140, 180], etq: ['Ancho', 'Alto'] }, plano: 'tela',
    opciones: [
      { id: 'color', nombre: 'Color', valores: [{ id: 'lino', nombre: 'Lino', color: C.lino }, { id: 'arena', nombre: 'Arena', color: C.arena }, { id: 'gris', nombre: 'Gris', color: '#8E949C' }, { id: 'blanco', nombre: 'Blanco', color: C.blanco }, { id: 'negro', nombre: 'Negro', color: C.negro }] },
      { id: 'acc', nombre: 'Accionamiento', valores: [{ id: 'cadena', nombre: 'Cadena' }, { id: 'motor', nombre: 'Motor con control remoto', suma: 165000 }] },
    ],
    desc: 'Tela blackout que oscurece por completo el dormitorio, con caño de aluminio y mecanismo a cadena o con motor. Se limpia con un paño húmedo.',
    datos: [['Tela', 'Blackout'], ['Colores', 'Lino, arena, gris, blanco y negro'], ['Mecanismo', 'Cadena o motor'], ['Uso', 'Interior']] },
  { id: 'americana', nombre: 'Cortina americana de lamas', cat: 'interior', etiqueta: 'Regula la luz', rango: 6,
    img: 'images/p-americana.webp', alt: 'Cortina americana blanca de lamas horizontales con la luz del jardín',
    nec: ['privacidad'], m2: 46000, minM2: .8,
    medida: { ancho: [40, 240], alto: [40, 260], def: [120, 150], etq: ['Ancho', 'Alto'] }, plano: 'finas',
    opciones: [
      { id: 'lama', nombre: 'Lama', valores: [{ id: 'alu25', nombre: 'Aluminio de 25 mm' }, { id: 'pvc50', nombre: 'PVC de 50 mm símil madera', f: 1.32 }] },
      { id: 'color', nombre: 'Color', valores: [{ id: 'blanco', nombre: 'Blanco', color: C.blanco }, { id: 'gris', nombre: 'Gris', color: C.gris }, { id: 'natural', nombre: 'Natural', color: C.natural }] },
    ],
    desc: 'Lamas horizontales que se orientan para regular la luz y la vista desde afuera, con cordón y bastón. En aluminio de 25 mm o PVC de 50 mm símil madera.',
    datos: [['Lama', 'Aluminio 25 mm o PVC 50 mm'], ['Colores', 'Blanco, gris y natural'], ['Mando', 'Cordón y bastón'], ['Uso', 'Interior']] },
  { id: 'motor-tubular', nombre: 'Motor tubular reforzado', cat: 'motores', etiqueta: 'Para persianas y rollers', badge: 'Con o sin control', rango: 7,
    img: 'images/p-motor.webp', alt: 'Motor tubular gris con su control remoto sobre una mesa, junto a una persiana',
    nec: ['automatizar'], base: 158000, nota: 'con control remoto',
    opciones: [
      { id: 'fuerza', nombre: 'Fuerza', valores: [{ id: '20nm', nombre: '20 Nm · hasta 30 kg' }, { id: '30nm', nombre: '30 Nm · hasta 45 kg', suma: 22000 }, { id: '40nm', nombre: '40 Nm · hasta 60 kg', suma: 41000 }, { id: '50nm', nombre: '50 Nm · hasta 75 kg', suma: 63000 }] },
      { id: 'mando', nombre: 'Mando', valores: [{ id: 'control', nombre: 'Con control remoto', suma: 36000 }, { id: 'tecla', nombre: 'Sin control, con tecla de pared' }] },
    ],
    desc: 'Va dentro del eje de la persiana: subís y bajás con control remoto o con una tecla de pared. La fuerza se elige según el peso de tu persiana.',
    datos: [['Tipo', 'Tubular, dentro del eje'], ['Fuerza', 'De 20 a 50 Nm'], ['Mando', 'Control remoto o tecla'], ['Para', 'Persianas y rollers']] },
  { id: 'control-remoto', nombre: 'Control remoto para persianas', cat: 'motores', etiqueta: 'Motorización', rango: 8,
    img: 'images/p-control.webp', alt: 'Control remoto blanco de tres botones sobre una mesa de madera',
    nec: ['automatizar'], base: 34000, nota: '1 canal',
    opciones: [
      { id: 'canales', nombre: 'Canales', valores: [{ id: '1', nombre: '1 canal' }, { id: '5', nombre: '5 canales', suma: 16000 }, { id: '15', nombre: '15 canales', suma: 31000 }] },
    ],
    desc: 'Para manejar una o varias persianas motorizadas: de a una, por ambiente o todas juntas.',
    datos: [['Botones', 'Subir, parar y bajar'], ['Canales', '1, 5 o 15'], ['Para', 'Motores tubulares'], ['Alimentación', 'Pila incluida']] },
  { id: 'kit-manual', nombre: 'Kit de apertura manual', cat: 'motores', etiqueta: 'Cinta o manivela', rango: 9,
    img: 'images/p-manual.webp', alt: 'Manivela blanca con reductor junto a una persiana de aluminio',
    nec: [], base: 24000, nota: 'cinta y enrollador',
    opciones: [
      { id: 'sistema', nombre: 'Sistema', valores: [{ id: 'cinta', nombre: 'Cinta y enrollador de embutir' }, { id: 'manivela', nombre: 'Manivela con reductor', suma: 38000 }] },
    ],
    desc: 'Para la persiana que se maneja a mano: enrollador de cinta de embutir, o manivela con reductor para persianas grandes y pesadas.',
    datos: [['Sistemas', 'Cinta o manivela'], ['Manivela', 'Con reductor'], ['Para', 'Persianas de enrollar'], ['Repuesto', 'Cinta y enrollador']] },
];

const MATERIALES_PESO = [
  { id: 'pvc', nombre: 'PVC', kg: 4.5, color: '#E6E9EE' },
  { id: 'alu-iny', nombre: 'Aluminio inyectado', kg: 3.8, color: '#C5CAD2' },
  { id: 'alu-ext', nombre: 'Aluminio extruido', kg: 9, color: '#8F96A1' },
  { id: 'madera', nombre: 'Madera', kg: 13, color: '#B27B4A' },
];
const MOTORES = [{ nm: 20, kg: 30 }, { nm: 30, kg: 45 }, { nm: 40, kg: 60 }, { nm: 50, kg: 75 }];

const redondear = n => Math.round(n / 100) * 100;
const limitarEntre = (n, [a, b]) => Math.min(b, Math.max(a, n));
function leerConfig(p, v) {
  const [opc = '', med = ''] = String(v || '').split('@');
  const ids = opc.split('.');
  const sel = (p.opciones || []).map((o, k) => o.valores.find(x => x.id === ids[k]) || o.valores[0]);
  const ops = sel.map(x => x.id).join('.');
  if (!p.medida) return { sel, ancho: null, alto: null, v: ops };
  const [wa, ha] = med.split('x').map(n => parseInt(n, 10));
  const ancho = limitarEntre(Number.isFinite(wa) ? wa : p.medida.def[0], p.medida.ancho);
  const alto = limitarEntre(Number.isFinite(ha) ? ha : p.medida.def[1], p.medida.alto);
  return { sel, ancho, alto, v: `${ops}@${ancho}x${alto}` };
}
function precioConfig(p, v) {
  const c = leerConfig(p, v);
  const factor = c.sel.reduce((f, x) => f * (x.f || 1), 1);
  const suma = c.sel.reduce((s, x) => s + (x.suma || 0), 0);
  const area = p.medida ? Math.max(p.minM2 || 0, (c.ancho * c.alto) / 10000) : 0;
  return redondear(((p.m2 || 0) * area + (p.base || 0)) * factor + suma);
}
function textoConfig(p, v) {
  const c = leerConfig(p, v);
  return [...c.sel.map(x => x.nombre), ...(p.medida ? [`${c.ancho} × ${c.alto} cm`] : [])].join(' · ');
}
const configDefecto = p => leerConfig(p, '').v;
const prepararProducto = p => ({ ...p, descuento: 0, vDef: configDefecto(p), precio: precioConfig(p, '') });

function calcularAccionamiento({ ancho, alto, mat, modo }) {
  const m = MATERIALES_PESO.find(x => x.id === mat) || MATERIALES_PESO[0];
  const a = limitarEntre(Number.isFinite(ancho) ? ancho : 150, [40, 400]);
  const h = limitarEntre(Number.isFinite(alto) ? alto : 160, [40, 400]);
  const area = (a * (h + 20)) / 10000;
  const peso = Math.round(area * m.kg * 10) / 10;
  const cinta = peso <= 14 && a <= 200;
  const manivela = peso <= 32;
  const motor = MOTORES.find(x => x.kg >= peso) || null;
  let recom;
  if (modo === 'motor' || (!cinta && !manivela)) recom = motor ? { tipo: 'motor', nm: motor.nm } : { tipo: 'especial' };
  else recom = cinta ? { tipo: 'cinta' } : { tipo: 'manivela' };
  return { ancho: a, alto: h, area: Math.round(area * 100) / 100, peso, mat: m, cinta, manivela, motor, recom, modo: modo === 'motor' ? 'motor' : 'manual' };
}

const Tienda = crearTienda(PRODUCTOS.map(prepararProducto), { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreCat = id => CATEGORIAS.find(c => c.id === id)?.nombre || '';
  const nombreNec = id => NECESIDADES.find(c => c.id === id)?.nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, nombreCat(p.cat), ...(p.nec || []).map(nombreNec),
    ...(p.opciones || []).flatMap(o => o.valores.map(x => x.nombre)),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), nec = lista(f.nec), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (nec.length && !(p.nec || []).some(x => nec.includes(x))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.precioMin != null && final(p) < f.precioMin) return false;
    if (f.precioMax != null && final(p) > f.precioMax) return false;
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
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
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
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function desdeM2(filtros = {}) {
    const m = visibles.filter(p => p.m2 && coincide(p, filtros)).map(p => p.m2);
    return m.length ? Math.min(...m) : 0;
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, desdeM2, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = p => p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio;
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const claveLinea = (id, v) => `${id}|${v || ''}`;
const subPrecio = p => (p.medida ? `en ${p.medida.def[0]} × ${p.medida.def[1]} cm` : p.nota || '');

const Cart = {
  KEY: 'cortinasypersianasclara_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const items = this.get();
    const cfg = leerConfig(producto, v).v;
    const existing = items.find(i => i.id === producto.id && i.v === cfg);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: cfg, qty: suma });
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
  linea(i) { const p = getProducto(i.id); return p ? precioConfig(p, i.v) * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = leerConfig(p, i.v).v;
      if (v !== i.v) { i.v = v; changed = true; }
      if (!(i.qty >= 1 && i.qty <= MAX_CANT)) { i.qty = Math.max(1, Math.min(MAX_CANT, i.qty || 1)); changed = true; }
      return true;
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/></svg>',
  no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>',
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
function abrirCapa(el, { alCerrar } = {}) {
  const previo = document.activeElement;
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
}

const catDe = p => CATEGORIAS.find(c => c.id === p.cat);
function badgesHTML(p) {
  return p.badge ? `<div class="prod__badges"><span class="badge">${esc(p.badge)}</span></div>` : '';
}
function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  const uno = catDe(p)?.uno || '';
  const accion = p.medida ? 'Cotizar tu medida' : 'Ver opciones';
  const ir = `<span class="prod__ir"><span>${p.medida ? 'Cotizar' : 'Opciones'}</span>${ICO.flecha}</span>`;
  const precio = `<p class="precio">${formatearPrecio(precioFinal(p))}<small>${esc(subPrecio(p))}</small></p>`;
  if (estilo === 'vitrina') {
    return `<article class="prod prod--vitrina" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"></div>
  ${badgesHTML(p)}
  <div class="prod__ticket"><p class="prod__cat">${esc(uno)} · ${esc(p.etiqueta)}</p><h3 class="prod__nombre">${esc(p.nombre)}</h3><div class="prod__pie">${precio}${ir}</div></div>
  <button type="button" class="prod__cubre" data-qv="${esc(p.id)}" aria-label="${esc(accion)}: ${esc(p.nombre)}"></button>
</article>`;
  }
  return `<article class="prod prod--ficha" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000" decoding="async"></div>
  ${badgesHTML(p)}
  <div class="prod__info"><p class="prod__cat">${esc(uno)} · ${esc(p.etiqueta)}</p><h3 class="prod__nombre">${esc(p.nombre)}</h3><div class="prod__pie">${precio}${ir}</div></div>
  <button type="button" class="prod__cubre" data-qv="${esc(p.id)}" aria-label="${esc(accion)}: ${esc(p.nombre)}"></button>
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
    return p ? `• ${i.qty} × ${p.nombre} (${textoConfig(p, i.v)}) — ${formatearPrecio(Cart.linea(i))}` : '';
  }).filter(Boolean);
  return `Hola! Quiero pedir un presupuesto sin cargo en ${MARCA} por esto:\n${lineas.join('\n')}\nTotal estimado: ${formatearPrecio(Cart.total())}`;
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
    lista.innerHTML = items.map((i, k) => {
      const p = getProducto(i.id);
      if (!p) return '';
      const clave = esc(claveLinea(i.id, i.v));
      return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img)}" alt="" width="76" height="76">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoConfig(p, i.v))}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar uno"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div>
    <p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
  </div>
</li>`;
    }).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  const partir = s => { const k = s.indexOf('|'); return [s.slice(0, k), s.slice(k + 1)]; };
  lista.addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]');
    if (q) { Cart.remove(...partir(q.dataset.quitar)); return; }
    const b = e.target.closest('[data-linea]');
    if (b) {
      const [id, v] = partir(b.dataset.linea);
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(b.dataset.paso));
    }
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = () => { pintar(); abrirCapa(drawer); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', window.abrirCarrito));
  pintar();
}

function initCompras() {
  document.addEventListener('click', e => {
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) { e.preventDefault(); abrirVistaRapida(qv.dataset.qv); }
  });
}

function medidasPlano(ancho, alto, maxA, maxH) {
  const r = ancho / alto;
  return r > maxA / maxH ? [maxA, Math.round(maxA / r)] : [Math.round(maxH * r), maxH];
}
function planoHTML(p, cfg) {
  const [w, h] = medidasPlano(cfg.ancho, cfg.alto, 230, 160);
  const color = cfg.sel.find(x => x.color)?.color || '#E6E9EE';
  return `<div class="plano__vano plano__vano--${esc(p.plano || 'lamas')}" style="width:${w}px;height:${h}px;--c:${color}"></div><span class="plano__cota plano__cota--a">${esc(p.medida.etq[0])} ${cfg.ancho} cm</span><span class="plano__cota plano__cota--h">${esc(p.medida.etq[1])} ${cfg.alto} cm</span>`;
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const base = leerConfig(p, '');
  qvEstado = { id: p.id, sel: base.sel.map(x => x.id), ancho: base.ancho, alto: base.alto, qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const opciones = (p.opciones || []).map((o, k) => `<div class="qv__var"><p>${esc(o.nombre)}: <span data-qv-elegida="${k}"></span></p><div class="chips" role="group" aria-label="${esc(o.nombre)}">${o.valores.map(x => `<button type="button" class="chip" data-qv-op="${k}" data-val="${esc(x.id)}" aria-pressed="false">${x.color ? `<i class="punto" style="--c:${x.color}"></i>` : ''}${esc(x.nombre)}</button>`).join('')}</div></div>`).join('');
  const medida = p.medida ? `<div class="qv__medida">
      <p>Medida del vano</p>
      <div class="campos-2">
        <label class="campo"><span>${esc(p.medida.etq[0])} (cm)</span><input type="number" inputmode="numeric" min="${p.medida.ancho[0]}" max="${p.medida.ancho[1]}" step="1" value="${qvEstado.ancho}" data-qv-ancho></label>
        <label class="campo"><span>${esc(p.medida.etq[1])} (cm)</span><input type="number" inputmode="numeric" min="${p.medida.alto[0]}" max="${p.medida.alto[1]}" step="1" value="${qvEstado.alto}" data-qv-alto></label>
      </div>
      <p class="qv__rango" data-qv-rango>Ancho de ${p.medida.ancho[0]} a ${p.medida.ancho[1]} cm · alto de ${p.medida.alto[0]} a ${p.medida.alto[1]} cm</p>
    </div>` : '';
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__galeria">
    <div class="qv__principal"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="1000" height="1000"></div>
    ${p.medida ? '<div class="plano" aria-hidden="true"><div class="plano__caja" data-qv-plano></div></div>' : ''}
  </div>
  <div class="qv__info">
    <p class="prod__cat">${esc(catDe(p)?.uno || '')} · ${esc(p.etiqueta)}</p>
    <h2>${esc(p.nombre)}</h2>
    <div class="qv__precio"><p class="precio" data-qv-precio></p><p class="qv__nota" data-qv-nota></p></div>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${opciones}
    ${medida}
    <dl class="qv__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <div class="qv__acciones">
      <div class="stepper"><button type="button" data-qv-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <a class="qv__wsp" href="${wspHref(`Hola! Quiero un presupuesto sin cargo de ${p.nombre}.`)}" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Pedí el presupuesto sin cargo por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="200" height="200"><span>${esc(r.nombre)}</span><small>${formatearPrecio(precioFinal(r))} ${esc(subPrecio(r))}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

const vActual = () => {
  const p = getProducto(qvEstado.id);
  return p?.medida ? `${qvEstado.sel.join('.')}@${qvEstado.ancho}x${qvEstado.alto}` : qvEstado.sel.join('.');
};
function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  const cfg = leerConfig(p, vActual());
  (p.opciones || []).forEach((o, k) => {
    modal.querySelectorAll(`[data-qv-op="${k}"]`).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.val === cfg.sel[k].id)));
    const el = modal.querySelector(`[data-qv-elegida="${k}"]`);
    if (el) el.textContent = cfg.sel[k].nombre;
  });
  const unidad = precioConfig(p, cfg.v);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(unidad * qvEstado.qty);
  modal.querySelector('[data-qv-nota]').textContent = p.medida
    ? `Precio estimado${qvEstado.qty > 1 ? ` por ${qvEstado.qty} unidades` : ''} para ${cfg.ancho} × ${cfg.alto} cm. La medida final y la colocación las confirmamos en el presupuesto sin cargo.`
    : `Precio${qvEstado.qty > 1 ? ` por ${qvEstado.qty} unidades` : ''} con la opción elegida. La colocación la cotizamos en el presupuesto sin cargo.`;
  const plano = modal.querySelector('[data-qv-plano]');
  if (plano) plano.innerHTML = planoHTML(p, cfg);
  modal.querySelector('[data-qv-cant]').textContent = qvEstado.qty;
  modal.querySelector('[data-qv-paso="-1"]').disabled = qvEstado.qty <= 1;
  modal.querySelector('[data-qv-paso="1"]').disabled = qvEstado.qty >= MAX_CANT;
  modal.querySelector('[data-qv-wsp]').href = wspHref(`Hola! Quiero un presupuesto sin cargo de ${qvEstado.qty > 1 ? `${qvEstado.qty} × ` : ''}${p.nombre} (${textoConfig(p, cfg.v)}).`);
  ponerJsonLdProducto(p, unidad);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  const medir = (inp, eje, final) => {
    const p = getProducto(qvEstado.id);
    const rango = p.medida[eje];
    const n = parseInt(inp.value, 10);
    const fuera = !Number.isFinite(n) || n < rango[0] || n > rango[1];
    inp.setAttribute('aria-invalid', String(fuera && final));
    if (Number.isFinite(n)) qvEstado[eje] = limitarEntre(n, rango);
    if (final) inp.value = qvEstado[eje];
    modal.querySelector('[data-qv-rango]')?.classList.toggle('is-error', fuera);
    pintarQv();
  };
  modal.addEventListener('input', e => {
    if (e.target.matches('[data-qv-ancho]')) medir(e.target, 'ancho', false);
    else if (e.target.matches('[data-qv-alto]')) medir(e.target, 'alto', false);
  });
  modal.addEventListener('change', e => {
    if (e.target.matches('[data-qv-ancho]')) medir(e.target, 'ancho', true);
    else if (e.target.matches('[data-qv-alto]')) medir(e.target, 'alto', true);
  });
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const op = e.target.closest('[data-qv-op]');
    if (op) { qvEstado.sel[Number(op.dataset.qvOp)] = op.dataset.val; pintarQv(); return; }
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) { qvEstado.qty = Math.max(1, Math.min(MAX_CANT, qvEstado.qty + Number(paso.dataset.qvPaso))); pintarQv(); return; }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      modal.querySelectorAll('[data-qv-ancho], [data-qv-alto]').forEach(inp => { inp.value = qvEstado[inp.matches('[data-qv-ancho]') ? 'ancho' : 'alto']; inp.setAttribute('aria-invalid', 'false'); });
      modal.querySelector('[data-qv-rango]')?.classList.remove('is-error');
      const v = vActual();
      const sumo = Cart.add(p, qvEstado.qty, v);
      if (!sumo) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return; }
      if (comprar) { cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(); }
      else showToast(`Sumaste ${sumo > 1 ? `${sumo} × ` : ''}${p.nombre}${p.medida ? ` (${qvEstado.ancho} × ${qvEstado.alto} cm)` : ''} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p, precio) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precio, availability: p.medida ? 'https://schema.org/MadeToOrder' : 'https://schema.org/InStock' },
  });
}

function setParam(k, v) {
  try {
    const u = new URL(location.href);
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) u.searchParams.delete(k);
    else u.searchParams.set(k, Array.isArray(v) ? v.join(',') : v);
    history.replaceState(null, '', u.pathname + (u.searchParams.toString() ? `?${u.searchParams}` : '') + u.hash);
  } catch { }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 961px)');
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
  const actual = (new URLSearchParams(location.search).get('cat') || '').split(',');
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && actual.length === 1 && actual[0] === c.id ? ' aria-current="page"' : '';
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur}><img src="${esc(c.img)}" alt="" width="48" height="48"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n}</em></a></li>`;
    }).join('');
  });
  const desktop = window.matchMedia('(min-width: 961px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 961px)');
  const cajas = [...document.querySelectorAll('.nav-cats')];
  cajas.forEach(box => {
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
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-desde-m2]').forEach(el => {
    const n = Tienda.desdeM2({ cat: el.dataset.desdeM2 });
    if (n) el.innerHTML = `Desde ${formatearPrecio(n)} <small>el m²</small>`;
  });
}

function idsDe(el, attr) {
  return (el.getAttribute(attr) || '').split(',').map(s => s.trim()).filter(Boolean);
}
function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    cont.innerHTML = productosPorIds(idsDe(cont, 'data-preview')).map(p => cardHTML(p, cont.dataset.estilo || 'ficha')).join('');
  });
  document.querySelectorAll('[data-rail]').forEach(track => {
    track.innerHTML = productosPorIds(idsDe(track, 'data-rail')).map(p => `<div class="rail-item"><div data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, 'vitrina', false)}</div></div>`).join('');
  });
}

function initGuia() {
  const form = document.querySelector('[data-guia]');
  const res = document.querySelector('[data-guia-res]');
  if (!form || !res) return;
  const inA = form.querySelector('[data-guia-ancho]');
  const inH = form.querySelector('[data-guia-alto]');
  const leer = () => ({
    ancho: parseInt(inA.value, 10),
    alto: parseInt(inH.value, 10),
    mat: form.querySelector('input[name="guia-mat"]:checked')?.value || 'pvc',
    modo: form.querySelector('input[name="guia-modo"]:checked')?.value || 'manual',
  });
  const nombreRecom = r => {
    if (r.recom.tipo === 'motor') return `motor tubular de ${r.recom.nm} Nm`;
    if (r.recom.tipo === 'cinta') return 'cinta con enrollador';
    if (r.recom.tipo === 'manivela') return 'manivela con reductor';
    return 'motor especial o dos paños';
  };
  const pintar = () => {
    const r = calcularAccionamiento(leer());
    const [w, h] = medidasPlano(r.ancho, r.alto + 20, 220, 120);
    const fila = (ok, nombre, txt, recom) => `<li class="${ok ? 'ok' : 'no'}${recom ? ' es-recom' : ''}">${ok ? ICO.ok : ICO.no}<b>${esc(nombre)}</b><em>${esc(txt)}</em></li>`;
    const pesoTxt = r.peso.toLocaleString('es-AR', { maximumFractionDigits: 1 });
    const areaTxt = r.area.toLocaleString('es-AR', { maximumFractionDigits: 2 });
    let recomTxt;
    if (r.recom.tipo === 'motor') recomTxt = `Te conviene un <b>motor tubular de ${r.recom.nm} Nm con control remoto</b>${r.modo === 'manual' ? ', porque a mano queda muy pesada' : ''}.`;
    else if (r.recom.tipo === 'cinta') recomTxt = 'Con <b>cinta y enrollador</b> alcanza: es lo más simple y no se rompe.';
    else if (r.recom.tipo === 'manivela') recomTxt = 'Te conviene <b>manivela con reductor</b>: la subís sin esfuerzo y sin forzar la cinta.';
    else recomTxt = 'Es una persiana muy grande: conviene <b>dividirla en dos paños o un motor especial</b>. Consultanos y lo vemos.';
    let sumar = '';
    if (r.recom.tipo === 'motor') sumar = `<button type="button" class="btn btn--cta" data-guia-sumar="motor-tubular" data-v="${r.recom.nm}nm.control">Sumar el motor de ${r.recom.nm} Nm</button>`;
    else if (r.recom.tipo === 'cinta' || r.recom.tipo === 'manivela') sumar = `<button type="button" class="btn btn--cta" data-guia-sumar="kit-manual" data-v="${r.recom.tipo}">Sumar el kit de ${r.recom.tipo}</button>`;
    const msg = `Hola! Tengo una persiana de ${r.mat.nombre.toLowerCase()} de ${r.ancho} × ${r.alto} cm (unos ${pesoTxt} kg). ¿Me pasan presupuesto sin cargo con ${nombreRecom(r)}?`;
    res.innerHTML = `<div class="res">
  <div class="res__plano" aria-hidden="true"><div class="res__vano" data-acc="${esc(r.recom.tipo === 'motor' ? `Motor ${r.recom.nm} Nm` : r.recom.tipo === 'especial' ? 'A consultar' : r.recom.tipo === 'cinta' ? 'Cinta' : 'Manivela')}" style="width:${w}px;height:${h}px;--lama:${r.mat.color}"></div></div>
  <div><p class="res__kicker">Tu persiana pesa unos</p><p class="res__peso"><b>${pesoTxt}</b><span>kg</span><small>${areaTxt} m² de ${esc(r.mat.nombre.toLowerCase())}, contando el tramo que queda enrollado</small></p></div>
  <ul class="res__escala">
    ${fila(r.cinta, 'Cinta con enrollador', r.cinta ? 'Va bien' : r.ancho > 200 ? 'Muy ancha para cinta' : 'Muy pesada para cinta', r.recom.tipo === 'cinta')}
    ${fila(r.manivela, 'Manivela con reductor', r.manivela ? 'Va bien' : 'Muy pesada para manivela', r.recom.tipo === 'manivela')}
    ${fila(Boolean(r.motor), 'Motor tubular', r.motor ? `Alcanza uno de ${r.motor.nm} Nm` : 'Necesita un motor especial', r.recom.tipo === 'motor')}
  </ul>
  <p class="res__recom">${recomTxt}</p>
  <div class="res__acciones">${sumar}<a class="btn btn--ghost" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICO.wsp}Pedir presupuesto con esta medida</a></div>
</div>`;
  };
  const validar = (inp, final) => {
    const n = parseInt(inp.value, 10);
    const fuera = !Number.isFinite(n) || n < 40 || n > 400;
    inp.setAttribute('aria-invalid', String(fuera && final));
    if (final && fuera) inp.value = limitarEntre(Number.isFinite(n) ? n : 150, [40, 400]);
  };
  form.addEventListener('input', e => { if (e.target.matches('input[type="number"]')) validar(e.target, false); pintar(); });
  form.addEventListener('change', e => { if (e.target.matches('input[type="number"]')) validar(e.target, true); pintar(); });
  res.addEventListener('click', e => {
    const b = e.target.closest('[data-guia-sumar]');
    if (!b) return;
    const p = getProducto(b.dataset.guiaSumar);
    if (!p) return;
    const sumo = Cart.add(p, 1, b.dataset.v);
    if (sumo) showToast(`Sumaste ${p.nombre} (${textoConfig(p, b.dataset.v)}) al carrito`);
    else showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`);
  });
  pintar();
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
  const estilo = MODELO === '2' ? 'vitrina' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    nec: valida(params.get('nec'), NECESIDADES),
    precio: PRECIOS.some(x => x.id === params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').trim().slice(0, 60),
    orden: ORDENES.some(x => x.id === params.get('orden')) ? params.get('orden') : 'destacados',
  };
  let cursor = null, mostrados = 0;
  const filtros = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'nec' && e.nec.length) f.nec = e.nec;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const opcion = (tipo, grupo, item, marcado, n) =>
    `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}><span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    panel.querySelector('[data-f-cats]').innerHTML = CATEGORIAS.map(c => opcion('checkbox', 'cat', c, e.cat.includes(c.id), Tienda.contar({ ...filtros('cat'), cat: c.id }))).join('');
    panel.querySelector('[data-f-nec]').innerHTML = NECESIDADES.map(a => opcion('checkbox', 'nec', a, e.nec.includes(a.id), Tienda.contar({ ...filtros('nec'), nec: a.id }))).join('');
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (!e.cat.length && e.nec.length === 1) return nombreDe(NECESIDADES, e.nec[0]);
    return '';
  }
  function pintarActivos() {
    const chips = [
      ...e.cat.map(id => ({ k: 'cat', id, t: nombreDe(CATEGORIAS, id) })),
      ...e.nec.map(id => ({ k: 'nec', id, t: nombreDe(NECESIDADES, id) })),
      ...(e.precio ? [{ k: 'precio', id: e.precio, t: nombreDe(PRECIOS, e.precio) }] : []),
      ...(e.q ? [{ k: 'q', id: e.q, t: `«${e.q}»` }] : []),
    ];
    activos.hidden = !chips.length;
    activos.innerHTML = chips.map(c => `<button type="button" class="chip" data-quitar-f="${c.k}" data-v="${esc(c.id)}" aria-label="Quitar filtro ${esc(c.t)}">${esc(c.t)} ${ICO.x}</button>`).join('') + (chips.length > 1 ? '<button type="button" class="limpiar" data-limpiar>Limpiar todo</button>' : '');
    const n = e.cat.length + e.nec.length + (e.precio ? 1 : 0);
    document.querySelectorAll('[data-n-filtros]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
    const t = tituloActual();
    if (titulo) titulo.textContent = t || 'Todo el catálogo';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    document.title = `${t || 'Catálogo'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    setParam('cat', e.cat); setParam('nec', e.nec); setParam('precio', e.precio); setParam('q', e.q);
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
  const limpiar = () => { e.cat = []; e.nec = []; e.precio = ''; e.q = ''; inputQ.value = ''; aplicar(); };
  document.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const qf = ev.target.closest('[data-quitar-f]');
    if (qf) {
      const k = qf.dataset.quitarF, v = qf.dataset.v;
      if (k === 'cat' || k === 'nec') e[k] = e[k].filter(x => x !== v);
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
  pintarFiltros(); pintarActivos(); render(true);
  if (params.get('buscar') === '1') { setParam('buscar', null); setTimeout(() => inputQ.focus(), 120); }
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirVistaRapida(prod), 60);
}

function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (vp.querySelector('.rail-item')?.getBoundingClientRect().width || 300) + 20;
  const flechas = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
  let x0 = 0, s0 = 0, activo = false, moved = false, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    activo = true; moved = false; x0 = e.clientX; s0 = vp.scrollLeft; pointerId = e.pointerId; vp.dataset.arrastrado = '0';
  });
  vp.addEventListener('pointermove', e => {
    if (!activo) return;
    const dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) vp.scrollLeft = s0 - dx;
  });
  const end = () => {
    if (!activo) return;
    activo = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) {
      vp.dataset.arrastrado = '1';
      setTimeout(() => { vp.dataset.arrastrado = '0'; }, 60);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (vp.dataset.arrastrado === '1') { e.preventDefault(); e.stopPropagation(); } }, true);
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  const marco = hero.querySelector('[data-hero-persiana]');
  if (marco) {
    const lamas = document.createElement('span');
    lamas.className = 'hero__lamas';
    lamas.setAttribute('aria-hidden', 'true');
    marco.appendChild(lamas);
    tl.fromTo(lamas, { scaleY: 1 }, { scaleY: 0, duration: 1.3, ease: 'power3.inOut', onComplete: () => lamas.remove() }, 0.12);
  }
  desde('[data-hero-img]', { scale: 1.1, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  desde('.hero-badge', { y: 14, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity' }, 0.75);
  desde('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
  desde('.cota', { opacity: 0, duration: 0.8, stagger: 0.12, clearProps: 'opacity' }, 1.1);
}

initPreviews();
initResumenes();
initMenuCategorias();
initGuia();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initCompras();
initRail();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
