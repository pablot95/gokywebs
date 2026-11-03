const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491159587973';
const MARCA = 'Inesahumerios';
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
  { id: 'sahumerios', nombre: 'Sahumerios', bajada: 'Varillas en atado y porta sahumerios', img: 'images/p-sahumerios.webp', lado: 1000 },
  { id: 'hornillos', nombre: 'Hornillos', bajada: 'De cerámica, solos o con esencia', img: 'images/p-hornillo-calado.webp', lado: 1000 },
  { id: 'velas', nombre: 'Velas', bajada: 'Aromáticas, en vaso de vidrio', img: 'images/p-vela.webp', lado: 1000 },
  { id: 'aceites', nombre: 'Aceites y esencias', bajada: 'Para el hornillo o el difusor', img: 'images/p-aceite.webp', lado: 1000 },
  { id: 'atomizadores', nombre: 'Atomizadores', bajada: 'Para telas y ambientes', img: 'images/p-atomizador-telas.webp', lado: 1000 },
];
const ESPACIOS = [
  { id: 'living', nombre: 'Living y comedor', tip: 'Un sahumerio o el hornillo con esencia un rato antes de que lleguen visitas, y el ambiente ya recibe distinto.' },
  { id: 'dormitorio', nombre: 'Dormitorio', tip: 'Rociá el atomizador sobre la almohada y prendé la vela un rato antes de acostarte. Apagala antes de dormir.' },
  { id: 'bano', nombre: 'Baño', tip: 'Un aromatizador de ambientes a mano y una vela para el baño de inmersión del domingo.' },
  { id: 'ropa', nombre: 'Ropa y textiles', tip: 'El atomizador de telas va a unos 30 cm: sábanas, cortinas, almohadones y la ropa recién planchada.' },
  { id: 'meditacion', nombre: 'Meditación y yoga', tip: 'Palo santo o sándalo en el porta sahumerios, o unas gotas de aceite esencial en el hornillo antes de empezar.' },
];
const FAMILIAS = [
  { id: 'florales', nombre: 'Florales' },
  { id: 'amaderados', nombre: 'Amaderados' },
  { id: 'dulces', nombre: 'Dulces' },
  { id: 'frescos', nombre: 'Frescos y cítricos' },
];
const AROMAS = {
  'lavanda': { nombre: 'Lavanda', fam: 'florales' },
  'rosas': { nombre: 'Rosas', fam: 'florales' },
  'jazmin': { nombre: 'Jazmín', fam: 'florales' },
  'flores-blancas': { nombre: 'Flores blancas', fam: 'florales' },
  'palo-santo': { nombre: 'Palo santo', fam: 'amaderados' },
  'sandalo': { nombre: 'Sándalo', fam: 'amaderados' },
  'mirra': { nombre: 'Mirra', fam: 'amaderados' },
  'copal': { nombre: 'Copal', fam: 'amaderados' },
  'bambu': { nombre: 'Bambú', fam: 'amaderados' },
  'vainilla': { nombre: 'Vainilla', fam: 'dulces' },
  'coco': { nombre: 'Coco', fam: 'dulces' },
  'frutos-rojos': { nombre: 'Frutos rojos', fam: 'dulces' },
  'canela': { nombre: 'Canela', fam: 'dulces' },
  'eucalipto': { nombre: 'Eucalipto', fam: 'frescos' },
  'naranja': { nombre: 'Naranja', fam: 'frescos' },
  'menta': { nombre: 'Menta', fam: 'frescos' },
  'lemongrass': { nombre: 'Lemongrass', fam: 'frescos' },
  'limon': { nombre: 'Limón', fam: 'frescos' },
  'limon-jengibre': { nombre: 'Limón y jengibre', fam: 'frescos' },
  'algodon': { nombre: 'Algodón', fam: 'frescos' },
  'bebe': { nombre: 'Bebé', fam: 'frescos' },
};
const PRECIOS = [
  { id: 'hasta5', nombre: 'Hasta $5.000', min: null, max: 5000 },
  { id: '5a10', nombre: 'De $5.001 a $10.000', min: 5001, max: 10000 },
  { id: 'mas10', nombre: 'Más de $10.000', min: 10001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre (A-Z)' },
];

const PRODUCTOS = [
  { id: 'sahumerios-atado', nombre: 'Sahumerios en atado', cat: 'sahumerios', precio: 3200, rango: 1, etiqueta: '', medida: 'Atado de 20 varillas',
    espacios: ['living', 'meditacion'], aromas: ['lavanda', 'palo-santo', 'sandalo', 'mirra', 'rosas', 'copal'],
    img: { src: 'images/p-sahumerios.webp', lado: 1000, alt: 'Atado de varillas de sahumerio sujetas con un hilo de algodón' },
    desc: 'Atado de 20 varillas sujetas con hilo. Encendé la punta, apagá la llama con un soplido y dejá que el humo perfume el ambiente.',
    claves: ['incienso', 'varillas', 'sahumo', 'atado', 'humo'] },
  { id: 'hornillo-calado', nombre: 'Hornillo de cerámica calado', cat: 'hornillos', precio: 11900, rango: 2, etiqueta: '', medida: 'Cerámica blanca',
    espacios: ['living', 'dormitorio'], aromas: [],
    img: { src: 'images/p-hornillo-calado.webp', lado: 1000, alt: 'Hornillo de cerámica blanca con calados de flores y una vela de té encendida adentro' },
    desc: 'Hornillo blanco con calados de flores. Abajo va una vela de té; arriba, agua con unas gotas de esencia o de aceite.',
    claves: ['hornito', 'quemador', 'difusor', 'ceramica', 'blanco'] },
  { id: 'vela-vaso', nombre: 'Vela aromática en vaso', cat: 'velas', precio: 8500, rango: 3, etiqueta: '', medida: 'Vaso de vidrio',
    espacios: ['living', 'dormitorio', 'bano'], aromas: ['lavanda', 'vainilla', 'coco', 'frutos-rojos'],
    img: { src: 'images/p-vela.webp', lado: 1000, alt: 'Vela aromática lila en un vaso de vidrio, con ramitas de lavanda al costado' },
    desc: 'Vela aromática en vaso de vidrio, para prender en el living, el dormitorio o el baño. Siempre a la vista y lejos de cortinas.',
    claves: ['vela', 'velon', 'aromatica', 'vaso', 'regalo'] },
  { id: 'aceite-esencial', nombre: 'Aceite esencial 10 ml', cat: 'aceites', precio: 6900, rango: 4, etiqueta: '', medida: 'Frasco ámbar con gotero',
    espacios: ['dormitorio', 'bano', 'meditacion'], aromas: ['lavanda', 'eucalipto', 'naranja', 'menta', 'lemongrass'],
    img: { src: 'images/p-aceite.webp', lado: 1000, alt: 'Frasco de vidrio ámbar con gotero negro' },
    desc: 'Frasco ámbar con gotero. Unas gotas en el agua del hornillo o en el difusor alcanzan para perfumar un ambiente.',
    claves: ['aceite', 'esencial', 'gotero', 'difusor', 'aromaterapia'] },
  { id: 'atomizador-telas', nombre: 'Atomizador de telas 250 ml', cat: 'atomizadores', precio: 7900, rango: 5, etiqueta: '', medida: 'Botella con gatillo',
    espacios: ['dormitorio', 'ropa'], aromas: ['algodon', 'lavanda', 'bebe', 'flores-blancas'],
    img: { src: 'images/p-atomizador-telas.webp', lado: 1000, alt: 'Botella transparente con gatillo atomizador apoyada sobre una tela de lino' },
    desc: 'Para sábanas, almohadas, cortinas y ropa. Rociá a unos 30 cm de la tela y dejá que seque.',
    claves: ['textil', 'tela', 'ropa', 'sabanas', 'spray', 'perfuma'] },
  { id: 'kit-hornillo', nombre: 'Kit hornillo + esencia', cat: 'hornillos', precio: 15900, rango: 6, etiqueta: 'Kit', medida: 'Hornillo y esencia de 30 ml',
    espacios: ['living', 'dormitorio'], aromas: ['vainilla', 'coco', 'jazmin', 'limon', 'canela', 'frutos-rojos'],
    img: { src: 'images/p-kit-hornillo.webp', lado: 900, alt: 'Hornillo de cerámica crema con flores caladas y una vela de té encendida' },
    desc: 'Hornillo de cerámica crema con flores caladas y una esencia de 30 ml del aroma que elijas.',
    claves: ['kit', 'regalo', 'hornito', 'esencia', 'ceramica'] },
  { id: 'esencia-hornillo', nombre: 'Esencia para hornillo 30 ml', cat: 'aceites', precio: 4500, rango: 7, etiqueta: '', medida: 'Frasco de 30 ml',
    espacios: ['living', 'dormitorio'], aromas: ['vainilla', 'coco', 'jazmin', 'limon', 'canela', 'frutos-rojos'],
    img: { src: 'images/p-esencia.webp', lado: 1000, alt: 'Frasco de vidrio con esencia aromática y tapa plateada' },
    desc: 'Esencia aromática para hornillo: se mezcla con el agua del plato de arriba y perfuma mientras la vela está prendida.',
    claves: ['esencia', 'hornito', 'fragancia', 'aromatizante'] },
  { id: 'aromatizador-ambientes', nombre: 'Aromatizador de ambientes 60 ml', cat: 'atomizadores', precio: 5900, rango: 8, etiqueta: '', medida: 'Frasco ámbar con spray',
    espacios: ['living', 'bano'], aromas: ['limon-jengibre', 'bambu', 'vainilla', 'lavanda'],
    img: { src: 'images/p-aromatizador.webp', lado: 1000, alt: 'Frasco de vidrio ámbar con válvula spray negra' },
    desc: 'Frasco chico con spray, para tener a mano. Un par de disparos al aire y el ambiente cambia.',
    claves: ['spray', 'ambiente', 'aromatizante', 'bolsillo', 'auto'] },
  { id: 'porta-sahumerios', nombre: 'Porta sahumerios de cerámica', cat: 'sahumerios', precio: 7500, rango: 9, etiqueta: '', medida: 'Bandeja de cerámica moteada',
    espacios: ['living', 'meditacion'], aromas: [],
    img: { src: 'images/p-porta.webp', lado: 900, alt: 'Bandeja ovalada de cerámica moteada con tres varillas de sahumerio encendidas' },
    desc: 'Bandeja ovalada de cerámica moteada con soporte para las varillas: junta la ceniza mientras se consume el sahumerio.',
    claves: ['portasahumerios', 'bandeja', 'base', 'ceniza', 'ceramica'] },
];

const GALERIA = [
  { src: 'images/g-humo.webp', w: 900, h: 1200, alt: 'Tres sahumerios encendidos con el humo subiendo, junto a una rama de flores secas', titulo: 'Sahumerios en atado, encendidos', prod: 'sahumerios-atado' },
  { src: 'images/g-hornillo.webp', w: 1600, h: 900, alt: 'Hornillo de cerámica con una vela de té encendida, un florero con lavanda y una manta lila', titulo: 'Kit hornillo + esencia', prod: 'kit-hornillo' },
  { src: 'images/g-atado.webp', w: 900, h: 900, alt: 'Detalle del hilo de algodón que ata las varillas de sahumerio', titulo: 'El atado de 20 varillas', prod: 'sahumerios-atado' },
  { src: 'images/g-vela.webp', w: 900, h: 900, alt: 'Vela lila en vaso de vidrio con lavanda y una tela clara de fondo', titulo: 'Vela aromática en vaso', prod: 'vela-vaso' },
  { src: 'images/g-esencia.webp', w: 800, h: 1067, alt: 'Frasco de esencia con tapa plateada sobre fondo lila', titulo: 'Esencia para hornillo', prod: 'esencia-hornillo' },
  { src: 'images/g-aromatizador.webp', w: 800, h: 1067, alt: 'Frasco ámbar con spray negro sobre fondo lila', titulo: 'Aromatizador de ambientes', prod: 'aromatizador-ambientes' },
];

const HORARIOS = [null, [10, 19], [10, 19], [10, 19], [10, 19], [10, 19], [10, 14]];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const aromaNombre = id => AROMAS[id]?.nombre || '';
function varValida(p, v) {
  if (!p.aromas || !p.aromas.length) return 'U';
  return p.aromas.includes(v) ? v : p.aromas[0];
}
function textoVar(p, v) {
  const a = varValida(p, v);
  return a === 'U' ? (p.medida || '') : `Aroma ${aromaNombre(a).toLowerCase()}`;
}
function lineaTexto(p, v, qty) {
  const a = varValida(p, v);
  return `${qty} × ${p.nombre}${a === 'U' ? '' : ` (aroma ${aromaNombre(a).toLowerCase()})`}`;
}
const familiasDe = p => [...new Set((p.aromas || []).map(a => AROMAS[a]?.fam).filter(Boolean))];

function estadoHorario(fecha = new Date()) {
  const ar = new Date(fecha.getTime() - 3 * 3600 * 1000);
  const dia = ar.getUTCDay();
  const hora = ar.getUTCHours() + ar.getUTCMinutes() / 60;
  const hoy = HORARIOS[dia];
  if (hoy && hora >= hoy[0] && hora < hoy[1]) return { abierto: true, dia, texto: `Abierto ahora · hasta las ${hoy[1]} h` };
  if (hoy && hora < hoy[0]) return { abierto: false, dia, texto: `Cerrado ahora · abrimos hoy a las ${hoy[0]} h` };
  for (let k = 1; k <= 7; k++) {
    const d = (dia + k) % 7;
    const h = HORARIOS[d];
    if (!h) continue;
    const cuando = k === 1 ? 'mañana' : `el ${DIAS[d]}`;
    return { abierto: false, dia, texto: `Cerrado ahora · abrimos ${cuando} a las ${h[0]} h` };
  }
  return { abierto: false, dia, texto: 'Horario a confirmar' };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.etiqueta, p.desc, p.medida, nombreDe(CATEGORIAS, p.cat),
    ...(p.espacios || []).map(e => nombreDe(ESPACIOS, e)),
    ...(p.aromas || []).map(aromaNombre), ...familiasDe(p).map(f => nombreDe(FAMILIAS, f)),
    ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), espacio = lista(f.espacio), familia = lista(f.familia), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (espacio.length && !espacio.some(e => (p.espacios || []).includes(e))) return false;
    if (familia.length && !familia.some(x => familiasDe(p).includes(x))) return false;
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
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; min = Math.min(min, p.precio); } });
    return { n, desde: n ? min : 0 };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, obtener };
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
  KEY: 'inesahumerios_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = '') {
    const a = varValida(producto, v);
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.v === a);
    const actual = existing ? existing.qty : 0;
    const suma = Math.max(0, Math.min(qty, MAX_CANT - actual));
    if (!suma) return 0;
    if (existing) existing.qty += suma;
    else items.push({ id: producto.id, v: a, qty: suma });
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
  linea(i) { const p = getProducto(i.id); return p ? p.precio * i.qty : 0; },
  total() { return this.get().reduce((s, i) => s + this.linea(i), 0); },
  sync() {
    const items = this.get(); let changed = false;
    const limpias = items.filter(i => {
      const p = getProducto(i.id);
      if (!p) { changed = true; return false; }
      const v = varValida(p, i.v);
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
function abrirCapa(el, { alCerrar, alTeclado, previo = document.activeElement } = {}) {
  el.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('open')));
  const onKey = e => {
    if (capas[capas.length - 1]?.el !== el) return;
    if (e.key === 'Escape') { e.preventDefault(); cerrarCapa(el); }
    else if (alTeclado?.(e)) return;
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

const badgeHTML = p => (p.etiqueta ? `<span class="prod__badge">${esc(p.etiqueta)}</span>` : '');
const aromasLinea = p => (p.aromas.length ? p.aromas.map(aromaNombre).join(' · ') : p.medida);

function cardHTML(p, estilo = 'ficha', animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(36px)"' : '';
  const n = p.aromas.length;
  if (estilo === 'frasco') {
    const select = n
      ? `<label class="prod__aroma"><span class="sr-only">Aroma de ${esc(p.nombre)}</span><select data-aroma-de="${esc(p.id)}">${p.aromas.map(a => `<option value="${esc(a)}">${esc(aromaNombre(a))}</option>`).join('')}</select></label>`
      : `<p class="prod__medida">${esc(p.medida)}</p>`;
    return `<article class="prod prod--frasco" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></div>${badgeHTML(p)}
  <div class="prod__info">
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__precio precio">${formatearPrecio(p.precio)}</p>
    ${select}
    <div class="prod-actions"><button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" data-v="${esc(varValida(p, ''))}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}<span>Agregar</span></button></div>
  </div>
</article>`;
  }
  const accion = n
    ? `<button type="button" class="btn btn--cta btn--sm prod-add" data-qv="${esc(p.id)}" data-foco="aroma" aria-label="Elegir el aroma de ${esc(p.nombre)}"><span>Elegir aroma</span></button>`
    : `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" data-v="U" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}<span>Agregar</span></button>`;
  return `<article class="prod prod--ficha" data-id="${esc(p.id)}"${anim}>
  <div class="prod__media" data-qv="${esc(p.id)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"><p class="prod__aromas" aria-hidden="true">${esc(aromasLinea(p))}</p></div>${badgeHTML(p)}
  <div class="prod__info">
    <p class="prod__meta">${esc(nombreDe(CATEGORIAS, p.cat))}${n ? ` · ${n} aromas` : ''}</p>
    <h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>
    <p class="prod__precio precio">${formatearPrecio(p.precio)}</p>
    <div class="prod-actions">${accion}</div>
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
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <div class="linea__top"><div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(textoVar(p, i.v))} · ${formatearPrecio(p.precio)}</p></div>
    <button type="button" class="linea__quitar" data-quitar="${clave}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button></div>
    <div class="linea__bottom"><div class="stepper"><button type="button" data-linea="${clave}" data-paso="-1" aria-label="Restar una unidad"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea="${clave}" data-paso="1" aria-label="Sumar una unidad"${i.qty >= MAX_CANT ? ' disabled' : ''}>${ICO.mas}</button></div><p class="linea__precio">${formatearPrecio(Cart.linea(i))}</p></div>
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

function sumar(id, v = '', qty = 1, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const a = varValida(p, v);
  const n = Cart.add(p, qty, a);
  if (!n) { showToast(`Ya tenés ${MAX_CANT} iguales en el carrito`); return 0; }
  showToast(`Sumaste ${lineaTexto(p, a, n)}`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}

function initCompras() {
  document.addEventListener('change', e => {
    const sel = e.target.closest('[data-aroma-de]');
    if (!sel) return;
    const btn = sel.closest('.prod')?.querySelector('[data-sumar]');
    if (btn) btn.dataset.v = sel.value;
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    const s = e.target.closest('[data-sumar]');
    if (s && !s.closest('#quickView')) {
      e.preventDefault();
      const sel = s.closest('.prod')?.querySelector('[data-aroma-de]');
      sumar(s.dataset.sumar, sel ? sel.value : (s.dataset.v || ''), 1, s);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !qv.closest('#quickView')) {
      e.preventDefault();
      const sel = qv.closest('.prod')?.querySelector('[data-aroma-de]');
      if (qv.closest('#visor')) cerrarCapa(document.getElementById('visor'), { devolverFoco: false });
      abrirVistaRapida(qv.dataset.qv, { v: sel ? sel.value : '', foco: qv.dataset.foco || '' });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, v = '', foco = '' } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id, v: varValida(p, v), qty: 1 };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { espacio: p.espacios, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const varBloque = p.aromas.length
    ? `<p class="qv__var-t">Aroma: <span data-qv-elegida></span></p><div class="chips" role="group" aria-label="Aromas">${p.aromas.map(a => `<button type="button" class="chip chip--aroma" data-qv-op="${esc(a)}" aria-pressed="${a === qvEstado.v}"><i class="fam fam--${esc(AROMAS[a].fam)}" aria-hidden="true"></i>${esc(aromaNombre(a))}</button>`).join('')}</div>`
    : `<p class="qv__var-t">${esc(p.medida)}</p>`;
  body.innerHTML = `<div class="qv__grid">
  <div class="qv__principal"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></div>
  <div class="qv__info">
    <p class="qv__meta">${esc(nombreDe(CATEGORIAS, p.cat))} · ${esc(p.medida)}</p>
    <h2>${esc(p.nombre)}</h2>
    <p class="precio precio--qv" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <p class="qv__espacios">Para ${esc(p.espacios.map(e => nombreDe(ESPACIOS, e).toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' y $1'))}</p>
    <div class="qv__var">${varBloque}</div>
    <div class="qv__acciones">
      <div class="stepper" title="Cantidad"><button type="button" data-qv-paso="-1" aria-label="Restar una unidad" disabled>${ICO.menos}</button><output data-qv-cant aria-live="polite">1</output><button type="button" data-qv-paso="1" aria-label="Sumar una unidad">${ICO.mas}</button></div>
      <button type="button" class="btn btn--ghost" data-qv-agregar>Agregar al carrito</button>
      <button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button>
    </div>
    <a class="qv__wsp" href="#" target="_blank" rel="noopener" data-qv-wsp>${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  pintarQv();
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => {
      const chip = foco === 'aroma' ? modal.querySelector('[data-qv-op][aria-pressed="true"]') : null;
      (chip || modal.querySelector('.qv__close'))?.focus();
    }, 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function pintarQv() {
  const modal = document.getElementById('quickView');
  const p = qvEstado && getProducto(qvEstado.id);
  if (!modal || !p) return;
  modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.qvOp === qvEstado.v)));
  const elegida = modal.querySelector('[data-qv-elegida]');
  if (elegida) elegida.textContent = aromaNombre(qvEstado.v);
  modal.querySelector('[data-qv-precio]').textContent = formatearPrecio(p.precio * qvEstado.qty);
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
    if (op) { qvEstado.v = varValida(p, op.dataset.qvOp); pintarQv(); return; }
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
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img.src, location.href).href, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: p.precio, availability: 'https://schema.org/InStock' },
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
  const cat = (params.get('cat') || '').split(',').filter(id => CATEGORIAS.some(c => c.id === id));
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
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-n-espacio]').forEach(el => {
    const id = el.dataset.nEspacio;
    el.textContent = Tienda.contar(id ? { espacio: id } : {});
  });
}

function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'ficha';
    const limite = Number(cont.dataset.limite) || 8;
    const sec = cont.closest('section');
    const tip = sec?.querySelector('[data-tab-tip]');
    const tipTitulo = sec?.querySelector('[data-tab-tip-t]');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const pintar = (tab = '') => {
      let prods;
      if (tab) {
        const [k, v] = tab.split(':');
        prods = Tienda.consultar({ filtros: { [k]: v }, limite }).items;
      } else prods = productosPorIds(ids).slice(0, limite);
      cont.innerHTML = prods.map(p => cardHTML(p, estilo)).join('');
      if (verTodo) {
        const [k, v] = tab ? tab.split(':') : [];
        verTodo.href = tab ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
      }
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      if (tip) {
        const [k, v] = b.dataset.tab ? b.dataset.tab.split(':') : [];
        const esp = k === 'espacio' ? ESPACIOS.find(x => x.id === v) : null;
        tip.textContent = esp ? esp.tip : tip.dataset.base || '';
        if (tipTitulo) tipTitulo.textContent = esp ? esp.nombre : tipTitulo.dataset.base || '';
      }
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
  });
}

function initHorarios() {
  const est = estadoHorario();
  document.querySelectorAll('[data-horario-estado]').forEach(el => {
    el.textContent = est.texto;
    el.closest('[data-horario-chip]')?.classList.toggle('is-abierto', est.abierto);
  });
  document.querySelectorAll('[data-dia]').forEach(li => {
    const dias = li.dataset.dia.split(',').map(Number);
    if (dias.includes(est.dia)) { li.classList.add('is-hoy'); li.setAttribute('aria-current', 'date'); }
  });
}

function copiarTexto(texto) {
  const respaldo = () => new Promise((ok, mal) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = texto; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const r = document.execCommand('copy'); ta.remove();
      r ? ok() : mal(new Error('copy'));
    } catch (err) { mal(err); }
  });
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(texto).catch(respaldo);
  return respaldo();
}
function initLinks() {
  const url = new URL('./', location.href).href;
  document.querySelectorAll('[data-link-tienda]').forEach(el => { el.textContent = url.replace(/^https?:\/\//, '').replace(/\/$/, ''); });
  document.querySelectorAll('[data-compartir]').forEach(a => { a.href = `https://wa.me/?text=${encodeURIComponent(`Mirá los sahumerios, velas y esencias de ${MARCA}: ${url}`)}`; });
  document.querySelectorAll('[data-copiar-link]').forEach(b => b.addEventListener('click', () => {
    copiarTexto(url).then(() => showToast('Copiamos el link de la tienda')).catch(() => showToast(`El link es ${url}`));
  }));
}

function initGaleria() {
  const visor = document.getElementById('visor');
  const items = [...document.querySelectorAll('[data-galeria]')];
  if (!visor || !items.length) return;
  const img = visor.querySelector('[data-visor-img]');
  const tit = visor.querySelector('[data-visor-t]');
  const cuenta = visor.querySelector('[data-visor-n]');
  const ver = visor.querySelector('[data-visor-prod]');
  let i = 0;
  const pintar = () => {
    const g = GALERIA[i];
    img.src = g.src; img.width = g.w; img.height = g.h; img.alt = g.alt;
    tit.textContent = g.titulo;
    cuenta.textContent = `${i + 1} / ${GALERIA.length}`;
    ver.dataset.qv = g.prod;
  };
  const mover = d => { i = (i + d + GALERIA.length) % GALERIA.length; pintar(); };
  items.forEach(b => b.addEventListener('click', () => {
    i = Math.max(0, Math.min(GALERIA.length - 1, Number(b.dataset.galeria) || 0));
    pintar();
    abrirCapa(visor, { alTeclado: e => { if (e.key === 'ArrowRight') { mover(1); return true; } if (e.key === 'ArrowLeft') { mover(-1); return true; } return false; } });
    setTimeout(() => visor.querySelector('.visor__close')?.focus(), 60);
  }));
  visor.addEventListener('click', e => {
    if (e.target.closest('[data-visor-cerrar]')) { cerrarCapa(visor); return; }
    const d = e.target.closest('[data-visor-paso]');
    if (d) mover(Number(d.dataset.visorPaso));
  });
}

function initRails() {
  document.querySelectorAll('[data-rail]').forEach(rail => {
    const vp = rail.querySelector('.rail-vp');
    const track = rail.querySelector('.rail-track');
    if (!vp || !track) return;
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');
    let down = false, moved = false, startX = 0, startLeft = 0, pointerId = null;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = vp.scrollLeft; pointerId = e.pointerId;
    });
    vp.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { }
      }
      if (moved) { vp.scrollLeft = startLeft - dx; e.preventDefault(); }
    });
    const end = () => {
      if (!down) return;
      down = false;
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      if (moved) setTimeout(() => { vp.classList.remove('dragging'); moved = false; }, 0);
    };
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
    vp.addEventListener('pointerleave', end);
    vp.addEventListener('click', e => { if (vp.classList.contains('dragging') || moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    const paso = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : vp.clientWidth * 0.8;
    };
    const sync = () => {
      const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
      if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
      if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
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
  const estilo = MODELO === '2' ? 'frasco' : 'ficha';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, espacio: ESPACIOS, familia: FAMILIAS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    espacio: valida(params.get('espacio'), ESPACIOS),
    familia: valida(params.get('familia'), FAMILIAS),
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
    if (e.espacio.length === 1 && solo.length === 1) return `Para ${nombreDe(ESPACIOS, e.espacio[0]).toLowerCase()}`;
    if (e.familia.length === 1 && solo.length === 1) return `Aromas ${nombreDe(FAMILIAS, e.familia[0]).toLowerCase()}`;
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
    if (titulo) titulo.textContent = t || 'Sahumerios, velas y esencias';
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
  desde('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, filter: 'blur(12px)', duration: 1.3, clearProps: 'filter' }, 0.18);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-chip', { scale: 0.92, opacity: 0, duration: 1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.7);
}

initPreviews();
initResumenes();
initMenuCategorias();
initCatalogo();
initReveals();
initHeroMotion();
initNav();
initDrawer();
initVistaRapida();
initGaleria();
initRails();
initHorarios();
initLinks();
initCompras();
initFloats();
initModelBarScroll();
Cart.sync();
updateCartBadge();
