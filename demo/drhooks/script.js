const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492615127657';
const MARCA = 'Dr. Hooks';
const POR_PAGINA = 16;
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
  { id: 'secas', nombre: 'Secas', bajada: 'Flotación, presentación y esencia en cada detalle.', img: 'images/p-seca-mayfly.webp',
    texto: 'Moscas que flotan e imitan a los insectos adultos sobre el agua. Para cuando la trucha come arriba.',
    subs: [{ id: 'efimeras', nombre: 'Efímeras' }, { id: 'tricopteros', nombre: 'Tricópteros' }, { id: 'terrestres', nombre: 'Terrestres' }] },
  { id: 'ninfas', nombre: 'Ninfas', bajada: 'Realismo y confianza bajo la superficie.', img: 'images/p-ninfa-pt.webp',
    texto: 'Imitan a las larvas y ninfas que viven en el fondo. Con cabeza de cobre para bajar rápido.',
    subs: [{ id: 'cabeza-cobre', nombre: 'Con cabeza de cobre' }] },
  { id: 'streamers', nombre: 'Streamers', bajada: 'Movimiento, color y carácter.', img: 'images/p-zonker.webp',
    texto: 'Imitan pececitos y presas grandes. Para buscar las truchas grandes en río y en lago.',
    subs: [{ id: 'pececitos', nombre: 'Pececitos' }, { id: 'buggers-zonkers', nombre: 'Buggers y zonkers' }, { id: 'marabu', nombre: 'Marabú y plumas' }] },
  { id: 'surtidos', nombre: 'Cajas y packs', bajada: 'Surtidos listos para salir a pescar.', img: 'images/p-caja-rio.webp',
    texto: 'Cajas surtidas y packs del mismo modelo, para tener lo justo en cada salida.',
    subs: [{ id: 'cajas', nombre: 'Cajas surtidas' }, { id: 'packs', nombre: 'Packs' }] },
];
const AGUAS = [
  { id: 'rio', nombre: 'Río', frase: 'Moscas para corriente, pozones y correderas.' },
  { id: 'lago', nombre: 'Lago o laguna', frase: 'Moscas para pescar desde la costa o en bajos de lagos y lagunas.' },
  { id: 'arroyo', nombre: 'Arroyo de montaña', frase: 'Moscas chicas y livianas para agua clara y poca profundidad.' },
];
const PRECIOS = [
  { id: 'hasta4', nombre: 'Hasta $4.000', min: null, max: 4000 },
  { id: '4a9', nombre: '$4.000 a $9.000', min: 4001, max: 9000 },
  { id: 'mas9', nombre: 'Más de $9.000', min: 9001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacadas' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  secas: 'seca secas flotante dry superficie', ninfas: 'ninfa ninfas nymph fondo larva', streamers: 'streamer streamers pececito presa',
  surtidos: 'caja cajas surtido surtida pack set kit', efimeras: 'efimera mayfly', tricopteros: 'caddis tricoptero',
  terrestres: 'terrestre hopper tucura chernobyl goma espuma', 'cabeza-cobre': 'cobre beadhead bolita cabeza',
  pececitos: 'baitfish pez pececito minnow juvenil', 'buggers-zonkers': 'bugger woolly zonker conejo', marabu: 'marabu plumas pluma',
  cajas: 'caja surtida', packs: 'pack x3', rio: 'rio corriente pozon', lago: 'lago laguna embalse costa', arroyo: 'arroyo montaña chico',
};

const Tienda = crearTienda([
  { id: 'zonker-oliva-rosa', nombre: 'Zonker Oliva y Rosa', cat: 'streamers', sub: 'buggers-zonkers', agua: ['rio', 'lago'], precio: 8500, descuento: 0, stock: 6, alta: 31, rango: 1, autor: true, tag: 'De autor',
    var: { tipo: 'Anzuelo', ops: ['#4', '#6'] }, img: 'images/p-zonker.webp', escena: null,
    alt: 'Streamer zonker de tiras oliva y negras con panza rosa y ojos dorados, sujeto en la morsa',
    desc: 'Tira de conejo barrada en oliva y negro, panza rosa y ojos con peso. Se mueve con cada tirón y llama a las truchas grandes.',
    uso: 'Tirones cortos y pausas, cerca del fondo.' },
  { id: 'juvenil-de-trucha', nombre: 'Juvenil de Trucha', cat: 'streamers', sub: 'pececitos', agua: ['rio', 'lago'], precio: 7200, descuento: 0, stock: 12, alta: 30, rango: 2, autor: true, tag: 'De autor',
    var: { tipo: 'Anzuelo', ops: ['#4', '#6'] }, img: 'images/p-juvenil.webp', escena: null,
    alt: 'Streamers oliva con lunares naranjas que imitan a una trucha chica, sobre una plancha de goma blanca',
    desc: 'Imita a una trucha chica: lomo oliva, lunares naranjas y ojo pintado. Para las truchas grandes que cazan a las más chicas.',
    uso: 'Recogida a tirones cortos, en pozones y en la costa.' },
  { id: 'streamer-gris-rosa', nombre: 'Streamer Gris y Rosa', cat: 'streamers', sub: 'marabu', agua: ['lago', 'rio'], precio: 8900, descuento: 0, stock: 5, alta: 29, rango: 3, autor: true, tag: 'De autor',
    var: { tipo: 'Anzuelo', ops: ['#2', '#4'] }, img: 'images/p-gris-rosa.webp', escena: 'images/marca-cartel.webp',
    alt: 'Streamer de plumas grises con cuerpo rosa, delante del cartel de Dr. Hooks',
    desc: 'Plumas grises largas y un cuerpo rosa brillante: mucho movimiento y contraste para agua turbia o con poca luz.',
    uso: 'Con línea de hundimiento, recogida lenta con tirones.' },
  { id: 'streamer-canela-naranja', nombre: 'Streamer Canela y Naranja', cat: 'streamers', sub: 'pececitos', agua: ['rio', 'lago'], precio: 6900, descuento: 0, stock: 10, alta: 28, rango: 4, autor: true, tag: 'De autor',
    var: { tipo: 'Anzuelo', ops: ['#4', '#6'] }, img: 'images/p-canela.webp', escena: null,
    alt: 'Streamers de pelo canela y naranja con cola rosa, ordenados en una caja de moscas',
    desc: 'Canela, naranja y un toque de brillo: un pececito que se ve de lejos en agua color té.',
    uso: 'Recogida a media agua, con pausas.' },
  { id: 'caja-surtida-rio', nombre: 'Caja Surtida de Río · 16 moscas', cat: 'surtidos', sub: 'cajas', agua: ['rio', 'arroyo'], precio: 54000, descuento: 0, stock: 4, alta: 26, rango: 5, tag: 'Surtido',
    img: 'images/p-caja-rio.webp', escena: 'images/hero-caja.webp',
    alt: 'Caja de moscas abierta con secas, ninfas y streamers chicos',
    desc: '16 moscas para una salida de río: 6 secas, 6 ninfas y 4 streamers chicos, en anzuelos #10 a #16, con su caja.',
    uso: 'Para arrancar la temporada con lo básico de cada tipo.' },
  { id: 'seca-mayfly-canela', nombre: 'Seca Mayfly Canela', cat: 'secas', sub: 'efimeras', agua: ['rio', 'arroyo'], precio: 3600, descuento: 0, stock: 24, alta: 25, rango: 6,
    var: { tipo: 'Anzuelo', ops: ['#12', '#14', '#16'] }, img: 'images/p-seca-mayfly.webp', escena: null,
    alt: 'Mosca seca tipo efímera con alas grises y cola larga, sobre fondo claro',
    desc: 'Imita a la efímera adulta que se posa en el agua. Alas grises, cola larga y un hackle que la mantiene arriba.',
    uso: 'Lance aguas arriba y deriva sin arrastre.' },
  { id: 'caddis-pelo-de-ciervo', nombre: 'Caddis de Pelo de Ciervo', cat: 'secas', sub: 'tricopteros', agua: ['rio', 'arroyo'], precio: 3400, descuento: 0, stock: 30, alta: 24, rango: 7,
    var: { tipo: 'Anzuelo', ops: ['#12', '#14', '#16'] }, img: 'images/p-caddis.webp', escena: null,
    alt: 'Mosca seca caddis con ala de pelo de ciervo y hackle marrón, sobre fondo claro',
    desc: 'El tricóptero de siempre: ala de pelo de ciervo que flota mucho y se ve bien en agua rápida.',
    uso: 'Deriva natural o con un leve tirón al final.' },
  { id: 'chernobyl-naranja', nombre: 'Chernobyl Naranja', cat: 'secas', sub: 'terrestres', agua: ['rio', 'lago'], precio: 4200, descuento: 0, stock: 18, alta: 23, rango: 8,
    var: { tipo: 'Anzuelo', ops: ['#8', '#10'] }, img: 'images/p-chernobyl.webp', escena: null,
    alt: 'Mosca terrestre de goma espuma naranja con patas de goma, sobre fondo claro',
    desc: 'Goma espuma naranja y patas de goma: imita a los terrestres que caen al agua en verano y se ve desde lejos.',
    uso: 'Cerca de la orilla, con pequeños tirones.' },
  { id: 'pack-canela-naranja', nombre: 'Pack x3 Streamer Canela y Naranja', cat: 'surtidos', sub: 'packs', agua: ['rio', 'lago'], precio: 18900, descuento: 0, stock: 6, alta: 27, rango: 9, autor: true, tag: 'Pack x3',
    var: { tipo: 'Anzuelo', ops: ['#4', '#6'] }, img: 'images/p-pack-canela.webp', escena: null,
    alt: 'Varios streamers canela y naranja ordenados en una caja de moscas',
    desc: 'Tres Streamer Canela y Naranja del mismo anzuelo, para tener repuesto en la salida.',
    uso: 'Recogida a media agua, con pausas.' },
  { id: 'pheasant-tail-cobre', nombre: 'Pheasant Tail Cabeza de Cobre', cat: 'ninfas', sub: 'cabeza-cobre', agua: ['rio', 'arroyo'], precio: 3200, descuento: 0, stock: 30, alta: 22, rango: 10,
    var: { tipo: 'Anzuelo', ops: ['#12', '#14', '#16'] }, img: 'images/p-ninfa-pt.webp', escena: null,
    alt: 'Ninfa pheasant tail con cuerpo de faisán y cabeza de cobre, sobre una piedra',
    desc: 'La ninfa más versátil: cuerpo de faisán, tórax de pavo real y cabeza de cobre para bajar rápido.',
    uso: 'Con indicador o en nymphing corto, pegada al fondo.' },
  { id: 'woolly-bugger-oliva', nombre: 'Woolly Bugger Oliva', cat: 'streamers', sub: 'buggers-zonkers', agua: ['rio', 'lago', 'arroyo'], precio: 3900, descuento: 10, stock: 20, alta: 21, rango: 11,
    var: { tipo: 'Anzuelo', ops: ['#6', '#8', '#10'] }, img: 'images/p-woolly.webp', escena: null,
    alt: 'Woolly bugger oliva con cola de marabú y cabeza dorada, sobre fondo claro',
    desc: 'Marabú oliva, hackle en espiral y cabeza dorada. Sirve en casi cualquier agua cuando nada come arriba.',
    uso: 'Tirones cortos o a la deriva, a media agua.' },
  { id: 'baitfish-blanco-chartreuse', nombre: 'Baitfish Blanco y Chartreuse', cat: 'streamers', sub: 'pececitos', agua: ['lago', 'rio'], precio: 6800, descuento: 0, stock: 8, alta: 20, rango: 12,
    var: { tipo: 'Anzuelo', ops: ['#2', '#4'] }, img: 'images/p-baitfish.webp', escena: null,
    alt: 'Streamer blanco y verde chartreuse con ojos, sujeto en la morsa',
    desc: 'Blanco, chartreuse y ojos grandes: un pececito llamativo para lagos y agua con color.',
    uso: 'Recogida rápida en la costa y en los bajos.' },
  { id: 'streamer-oliva-naranja', nombre: 'Streamer Oliva y Naranja', cat: 'streamers', sub: 'pececitos', agua: ['rio', 'lago'], precio: 5900, descuento: 0, stock: 14, alta: 19, rango: 13,
    var: { tipo: 'Anzuelo', ops: ['#4', '#6'] }, img: 'images/p-oliva-naranja.webp', escena: 'images/morsa-alto.webp',
    alt: 'Streamer de plumas naranja y oliva sujeto en la morsa, sobre fondo verde oscuro',
    desc: 'Plumas naranja y oliva con cuerpo brillante. Un clásico para ríos con corriente.',
    uso: 'Tirones a media agua, cruzando la corriente.' },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, p.uso, p.tag || '', p.autor ? 'autor de autor' : '', ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '',
    ...(p.agua || []).map(a => `${a} ${ETIQUETAS[a] || ''}`), ...(p.var?.ops || []).map(o => `${o} ${o.replace('#', '')}`),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), agua = lista(f.agua), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (agua.length && !(p.agua || []).some(a => agua.includes(a))) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
    if (f.autor && !p.autor) return false;
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
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => final(a) - final(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => final(b) - final(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
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
    const lleno = items.length === lim && i < base.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function resumen(filtros = {}) {
    let n = 0, desde = Infinity;
    visibles.forEach(p => { if (coincide(p, filtros)) { n++; desde = Math.min(desde, final(p)); } });
    return { n, desde: n ? desde : 0 };
  }
  function facetas(filtros = {}) {
    const agua = {}, subs = {};
    visibles.forEach(p => {
      if (!coincide(p, filtros)) return;
      (p.agua || []).forEach(x => { agua[x] = (agua[x] || 0) + 1; });
      subs[p.sub] = (subs[p.sub] || 0) + 1;
    });
    return { agua, subs };
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, resumen, facetas, obtener };
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
const conVar = p => (p.var?.ops || []).length > 1;
const subDe = p => CATEGORIAS.find(c => c.id === p.cat)?.subs?.find(s => s.id === p.sub);
const tipoVar = p => p.var?.tipo || 'Anzuelo';
const varTxt = (p, op) => `${tipoVar(p).toLowerCase()} ${op}`;

const Cart = {
  KEY: 'drhooks_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = '') {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && (i.op || '') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || '') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || '') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'drhooks_favs',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  has(id) { return this.get().includes(id); },
  toggle(id) {
    const set = new Set(this.get());
    const on = !set.has(id);
    if (on) set.add(id); else set.delete(id);
    try { localStorage.setItem(this.KEY, JSON.stringify([...set])); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('favs:updated'));
    return on;
  },
};

const ICON = {
  flecha: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menos: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  mas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  corazon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  anzuelo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11a5 5 0 0 1-10 0v-2l3 3"/><circle cx="14" cy="3" r="1.2"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ESTADO = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(40px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(48px)"',
};

function metaDe(p) {
  return subDe(p)?.nombre || nombreDe(CATEGORIAS, p.cat);
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta${p.autor && p.tag === 'De autor' ? ' etiqueta--autor' : ''}">${esc(p.tag)}</span>`);
  if (p.stock <= 5) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
  return b.length ? `<span class="prod__badges">${b.join('')}</span>` : '';
}
const urlProducto = p => `${CATALOGO_URL}?producto=${encodeURIComponent(p.id)}`;
function favHTML(p) {
  const on = Favs.has(p.id);
  return `<button type="button" class="fav" data-fav="${p.id}" aria-pressed="${on}" aria-label="Guardar en favoritos: ${esc(p.nombre)}">${ICON.corazon}</button>`;
}
function stepperHTML(max, valor = 1) {
  return `<div class="stepper" data-stepper data-max="${max}"><button type="button" data-menos aria-label="Restar uno"${valor <= 1 ? ' disabled' : ''}>${ICON.menos}</button><output>${valor}</output><button type="button" data-mas aria-label="Sumar uno"${valor >= max ? ' disabled' : ''}>${ICON.mas}</button></div>`;
}
function tallesHTML(p) {
  if (!conVar(p)) return '';
  return `<span class="prod__tonos">${ICON.anzuelo}${p.var.ops.join(' · ')}</span>`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver detalle</span></div>`;
  const titulo = `<h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>`;
  const control = conVar(p)
    ? `<label class="var-sel"><span class="sr-only">${esc(tipoVar(p))} de ${nombre}</span><select data-op><option value="">${esc(tipoVar(p))}</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`
    : stepperHTML(p.stock);
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      ${titulo}
      <div class="prod__precio-fila">${precioHTML(p)}${tallesHTML(p)}</div>
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
      <button type="button" class="prod__comprar" data-comprar="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function tileHTML(p, grande = false) {
  const nombre = esc(p.nombre);
  const accion = conVar(p)
    ? `<button type="button" class="tile__btn" data-qv-abrir="${p.id}" aria-label="Elegir anzuelo y agregar: ${nombre}">${ICON.anzuelo}<span>Elegir anzuelo</span></button>`
    : `<button type="button" class="tile__btn" data-add="${p.id}" aria-label="Agregar al carrito: ${nombre}">${ICON.carritoMas}<span>Agregar</span></button>`;
  return `<article class="tile${grande ? ' tile--grande' : ''}">
    <a class="tile__foto prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async"></a>
    ${badgesHTML(p)}
    <div class="tile__info">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="tile__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <div class="tile__pie">${precioHTML(p)}${accion}</div>
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
      <div class="cats-grupo">
        <a class="cats-item" href="${CATALOGO_URL}?cat=${c.id}"${catActual === c.id ? ' aria-current="page"' : ''}>
          <img src="${c.img}" alt="" width="56" height="56" decoding="async">
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span></span>
          <span class="cats-item__n">${Tienda.contar({ cat: c.id })}</span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-nec"><p class="cats-nec__tit">Para pescar en</p>${AGUAS.map(a => `<a href="${CATALOGO_URL}?agua=${a.id}">${esc(a.nombre)}</a>`).join('')}<a href="${CATALOGO_URL}?autor=1">Patrones de autor</a></div>`
      + `<div class="cats-pie"><a class="cats-oferta" href="${CATALOGO_URL}?oferta=1">Ofertas <span class="cats-item__n">${Tienda.contar({ oferta: true })}</span></a><a class="cats-todo" href="${CATALOGO_URL}">Ver todas las moscas ${ICON.flecha}</a></div>`;
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
}

function initBuscadorHeader() {
  const btn = document.querySelector('[data-abrir-busqueda]');
  const form = document.getElementById('busquedaHeader');
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
  const q = sel => [...hero.querySelectorAll(sel)];
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  if (q('.hero__logo').length) tl.from(q('.hero__logo'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1);
  tl.from(q('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(q('.hero__regla'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.4)
    .from(q('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.42)
    .from(q('.hero-ctas > *'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
}

function initHome() {
  if (PAGINA !== 'home') return;
  const lista = document.getElementById('destacadosLista');
  if (lista) {
    lista.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
      .map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join('');
  }
  const mosaico = document.getElementById('mosaicoLista');
  if (mosaico) {
    mosaico.innerHTML = Tienda.consultar({ orden: 'destacados', limite: 8 }).items
      .map((p, i) => `<li ${ESTADO.subir}>${tileHTML(p, i === 0)}</li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catN });
    el.textContent = `${r.n} ${r.n === 1 ? 'modelo' : 'modelos'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function initRail() {
  document.querySelectorAll('[data-rail]').forEach(vp => {
    const track = vp.querySelector('.rail-track');
    const caja = vp.closest('section') || document;
    const prev = caja.querySelector('[data-rail-prev]');
    const next = caja.querySelector('[data-rail-next]');
    if (!track) return;
    const paso = () => (track.querySelector('li')?.getBoundingClientRect().width || 280) + 14;
    const flechas = () => {
      if (!prev || !next) return;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      prev.disabled = vp.scrollLeft <= inicio + 2;
      next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
    };
    prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    vp.addEventListener('scroll', flechas, { passive: true });
    window.addEventListener('resize', flechas, { passive: true });
    window.addEventListener('load', flechas);
    flechas();

    let pointerId = null, startX = 0, startLeft = 0, moved = false, matar = false;
    vp.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      pointerId = e.pointerId; startX = e.clientX; startLeft = vp.scrollLeft; moved = false;
    });
    vp.addEventListener('pointermove', e => {
      if (pointerId === null || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 6) return;
      if (!moved) {
        moved = true;
        vp.classList.add('dragging');
        try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
      }
      vp.scrollLeft = startLeft - dx;
    });
    const fin = () => {
      if (pointerId === null) return;
      try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
      if (moved) { matar = true; setTimeout(() => { matar = false; }, 0); }
      vp.classList.remove('dragging');
      pointerId = null; moved = false;
    };
    vp.addEventListener('pointerup', fin);
    vp.addEventListener('pointercancel', fin);
    vp.addEventListener('lostpointercapture', fin);
    vp.addEventListener('click', e => { if (matar) { e.preventDefault(); e.stopPropagation(); matar = false; } }, true);
  });
}

const SALIDAS = [
  { src: 'images/salida-remera.webp', w: 960, h: 1280, cap: 'Con la remera Dr. Hooks, en la laguna', alt: 'Pescador de espaldas con la remera de Dr. Hooks, pescando con mosca en una laguna rodeada de sauces' },
  { src: 'images/salida-fontinalis.webp', w: 1600, h: 1204, cap: 'Fontinalis y la gorra de la marca', alt: 'Mano sosteniendo una trucha fontinalis junto a una gorra blanca con el logo de Dr. Hooks' },
  { src: 'images/salida-arcoiris-lago.webp', w: 720, h: 866, cap: 'Arcoíris en el lago', alt: 'Pescador con sombrero y anteojos sosteniendo una trucha arcoíris en la orilla de un lago' },
  { src: 'images/salida-dupla.webp', w: 960, h: 1280, cap: 'Una captura para compartir', alt: 'Dos pescadores sonrientes sosteniendo una trucha arcoíris junto a una laguna con un puente de madera' },
  { src: 'images/salida-rio.webp', w: 720, h: 1006, cap: 'Una buena trucha, en el río', alt: 'Pescador arrodillado en el río sosteniendo una trucha grande' },
  { src: 'images/salida-arcoiris.webp', w: 720, h: 1000, cap: 'Arcoíris de buen tamaño', alt: 'Pescador con gorra sosteniendo una trucha arcoíris grande junto al agua' },
  { src: 'images/salida-costa.webp', w: 720, h: 1114, cap: 'Plateada, recién salida del agua', alt: 'Pescador agachado en la costa sosteniendo una trucha plateada' },
  { src: 'images/salida-arroyo.webp', w: 720, h: 460, cap: 'Salida al arroyo', alt: 'Dos pescadores junto a un arroyo de montaña, uno con la caña en la mano' },
];
const Visor = { i: 0, opener: null };
function pintarVisor() {
  const v = document.getElementById('visor');
  const s = SALIDAS[Visor.i];
  if (!v || !s) return;
  const fig = v.querySelector('.visor__fig');
  fig.innerHTML = `<img src="${s.src}" alt="${esc(s.alt)}" width="${s.w}" height="${s.h}"><figcaption><span>${esc(s.cap)}</span><span class="visor__n">${String(Visor.i + 1).padStart(2, '0')} / ${String(SALIDAS.length).padStart(2, '0')}</span></figcaption>`;
}
function abrirVisor(i, opener) {
  const v = document.getElementById('visor');
  if (!v) return;
  Visor.i = Math.max(0, Math.min(SALIDAS.length - 1, i));
  Visor.opener = opener || document.activeElement;
  pintarVisor();
  v.hidden = false;
  Capas.abrir(v);
  requestAnimationFrame(() => requestAnimationFrame(() => v.classList.add('open')));
  setTimeout(() => v.querySelector('.visor__cerrar')?.focus(), 60);
}
function cerrarVisor() {
  const v = document.getElementById('visor');
  if (!v || v.hidden) return;
  v.classList.remove('open');
  setTimeout(() => { v.hidden = true; }, reduceMotion ? 0 : 300);
  Capas.cerrar(v);
  Visor.opener?.focus?.();
}
function initVisor() {
  const v = document.getElementById('visor');
  if (!v) return;
  const mover = d => { Visor.i = (Visor.i + d + SALIDAS.length) % SALIDAS.length; pintarVisor(); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-visor]');
    if (b) abrirVisor(Number(b.dataset.visor) || 0, b);
  });
  v.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-visor]')) cerrarVisor();
    else if (e.target.closest('[data-visor-prev]')) mover(-1);
    else if (e.target.closest('[data-visor-next]')) mover(1);
  });
  v.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); cerrarVisor(); return; }
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
    atraparFoco(v, e);
  });
}

const GUIA_AGUAS = { rio: 'un río', lago: 'un lago o laguna', arroyo: 'un arroyo de montaña' };
const GUIA_SENALES = { arriba: 'veo truchas comiendo arriba', nada: 'no veo nada en la superficie', turbia: 'el agua está turbia o hay viento' };
const GUIA = {
  arriba: {
    titulo: 'Secas: que floten y se vean naturales',
    texto: 'Si ves truchas comiendo en la superficie, van moscas secas. Elegí la que más se parezca a lo que vuela sobre el agua.',
    recos: { rio: [['seca-mayfly-canela', '#14'], ['caddis-pelo-de-ciervo', '#14'], ['chernobyl-naranja', '#10']],
      arroyo: [['caddis-pelo-de-ciervo', '#16'], ['seca-mayfly-canela', '#16'], ['chernobyl-naranja', '#10']],
      lago: [['chernobyl-naranja', '#8'], ['caddis-pelo-de-ciervo', '#12'], ['seca-mayfly-canela', '#12']] },
  },
  nada: {
    titulo: 'Ninfas: la comida está abajo',
    texto: 'Sin actividad arriba, las truchas comen cerca del fondo. Una ninfa con cabeza de cobre baja rápido y se mueve natural.',
    recos: { rio: [['pheasant-tail-cobre', '#14'], ['woolly-bugger-oliva', '#10'], ['juvenil-de-trucha', '#6']],
      arroyo: [['pheasant-tail-cobre', '#16'], ['woolly-bugger-oliva', '#10'], ['caddis-pelo-de-ciervo', '#16']],
      lago: [['woolly-bugger-oliva', '#8'], ['juvenil-de-trucha', '#4'], ['baitfish-blanco-chartreuse', '#4']] },
    tituloLago: 'Streamers para recorrer el lago',
    textoLago: 'En el lago, un streamer recogido despacio cubre mucha agua y busca a las truchas grandes que patrullan la costa.',
  },
  turbia: {
    titulo: 'Streamers grandes y con movimiento',
    texto: 'Con agua turbia o viento conviene una mosca grande, con contraste y movimiento, que se vea de lejos.',
    recos: { rio: [['zonker-oliva-rosa', '#4'], ['streamer-gris-rosa', '#4'], ['streamer-canela-naranja', '#4']],
      arroyo: [['woolly-bugger-oliva', '#8'], ['zonker-oliva-rosa', '#6'], ['streamer-canela-naranja', '#6']],
      lago: [['streamer-gris-rosa', '#2'], ['baitfish-blanco-chartreuse', '#2'], ['streamer-oliva-naranja', '#4']] },
  },
};
function initGuia() {
  const form = document.getElementById('guiaForm');
  const res = document.getElementById('guiaRes');
  if (!form || !res) return;
  let recos = [];
  const pintar = () => {
    const agua = form.querySelector('input[name="agua"]:checked')?.value || 'rio';
    const senal = form.querySelector('input[name="senal"]:checked')?.value || 'arriba';
    const g = GUIA[senal];
    const lago = agua === 'lago' && g.tituloLago;
    recos = g.recos[agua].map(([id, op]) => ({ p: getProducto(id), op })).filter(r => r.p);
    const msg = `Hola ${MARCA}! Voy a pescar en ${GUIA_AGUAS[agua]} y ${GUIA_SENALES[senal]}. ¿Qué moscas me recomendás?`;
    res.innerHTML = `<p class="guia__res-tit">${esc(lago ? g.tituloLago : g.titulo)}</p>
      <p class="guia__res-txt">${esc(lago ? g.textoLago : g.texto)}</p>
      <ol class="guia__lista">${recos.map((r, i) => `<li><button type="button" class="guia__item" data-qv-abrir="${r.p.id}" data-qv-op="${esc(r.op)}"><span class="guia__n">${String(i + 1).padStart(2, '0')}</span><span class="guia__nombre">${esc(r.p.nombre)}</span><span class="guia__talle">${ICON.anzuelo}${esc(r.op)}</span><span class="guia__precio">${formatearPrecio(precioFinal(r.p))}</span></button></li>`).join('')}</ol>
      <div class="guia__ctas"><button type="button" class="btn btn--cta" data-guia-sumar>Sumar las 3 al carrito</button><a class="btn btn--line btn--wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultarlo por WhatsApp</a></div>`;
  };
  form.addEventListener('change', pintar);
  res.addEventListener('click', e => {
    if (!e.target.closest('[data-guia-sumar]')) return;
    recos.forEach(r => Cart.add(r.p, 1, r.op));
    showToast(`Sumaste ${recos.length} moscas al carrito.`);
  });
  pintar();
}

const QV = { p: null, op: '', foto: 0, opener: null };
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = [{ src: p.img, alt: p.alt }];
  if (p.escena) fotos.push({ src: p.escena, alt: `Otra vista: ${p.alt}` });
  const tipo = tipoVar(p);
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto].src;
  const forma = actual.includes('alto') ? ' qv__principal--alta' : actual.includes('hero') ? ' qv__principal--ancha' : actual.includes('cartel') ? ' qv__principal--media' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto de la mosca'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || '')}${sub ? ' · ' : ''}${esc(cat?.nombre || '')}${p.autor ? ' · De autor' : ''}</p>
        <h2>${esc(p.nombre)}</h2>
        ${precioHTML(p)}
        <p class="qv__desc">${esc(p.desc)}</p>
        <p class="qv__dato"><span>Para pescar en</span>${(p.agua || []).map(a => esc(nombreDe(AGUAS, a).toLowerCase())).join(' · ')}</p>
        <p class="qv__dato"><span>Cómo se pesca</span>${esc(p.uso)}</p>
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">${esc(tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí el ${esc(tipo.toLowerCase())}">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(p.stock)}
          <button type="button" class="btn btn--cta" data-qv-agregar>Agregar al carrito</button>
          <button type="button" class="btn btn--line" data-qv-comprar>Comprar ahora</button>
        </div>
        <div class="qv__extra">
          <a class="qv__wsp" href="${wspHref(msg)}" target="_blank" rel="noopener">${ICON.wsp}Consultar por WhatsApp</a>
          <button type="button" class="qv__fav" data-fav="${p.id}" aria-pressed="${on}">${ICON.corazon}<span>${on ? 'En tus favoritos' : 'Guardar en favoritos'}</span></button>
        </div>
        ${rel.length ? `<div class="qv__rel"><h3>También en ${esc(cat?.nombre?.toLowerCase() || 'la tienda')}</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${r.id}"><span><img src="${r.img}" alt="" width="400" height="400"></span><span>${esc(r.nombre)}</span><span class="precio__final">${formatearPrecio(precioFinal(r))}</span></button></li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(p.img, location.href).href, category: cat?.nombre, brand: { '@type': 'Brand', name: MARCA },
    offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function abrirQV(id, opener, op = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : ''; QV.foto = 0;
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
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const foto = e.target.closest('[data-qv-foto]');
    if (foto) { QV.foto = Number(foto.dataset.qvFoto); renderQV(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (${varTxt(QV.p, QV.op)}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]'), comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const p = QV.p;
      if (conVar(p) && !QV.op) {
        const aviso = document.getElementById('qvAviso');
        if (aviso) aviso.textContent = `Elegí el ${tipoVar(p).toLowerCase()} para sumarla al carrito.`;
        modal.querySelector('[data-qv-op]')?.focus();
        return;
      }
      const qty = Number(modal.querySelector('.qv__compra output')?.textContent) || 1;
      Cart.add(p, qty, conVar(p) ? QV.op : '');
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${p.nombre}${QV.op ? ` (${varTxt(p, QV.op)})` : ''} al carrito.`);
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
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${op ? `${esc(varTxt(p, op))} · ` : ''}${formatearPrecio(precioFinal(p))} c/u</p>
      ${stepperHTML(p.stock, i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioFinal(p) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.anzuelo}<p>Tu carrito está vacío. Hay secas, ninfas y streamers atados a mano esperando su salida.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    return `- ${i.qty} × ${p.nombre}${i.op ? ` (${varTxt(p, i.op)})` : ''}: ${formatearPrecio(precioFinal(p) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`].join('\n');
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

function syncFavs() {
  const favs = Favs.get();
  document.querySelectorAll('[data-fav]').forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute('aria-pressed', String(on));
    const t = b.querySelector('span');
    if (t) t.textContent = on ? 'En tus favoritos' : 'Guardar en favoritos';
  });
  document.querySelectorAll('[data-favs-n]').forEach(el => { el.textContent = favs.length; el.hidden = !favs.length; });
}

function initAcciones() {
  document.addEventListener('click', e => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const p = getProducto(fav.dataset.fav);
      if (!p) return;
      const on = Favs.toggle(p.id);
      fav.classList.remove('pop'); void fav.offsetWidth; fav.classList.add('pop');
      showToast(on ? `Guardaste ${p.nombre} en favoritos.` : `Sacaste ${p.nombre} de favoritos.`);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv && !e.target.closest('.qv')) { e.preventDefault(); abrirQV(qv.dataset.qv, qv); return; }
    const abrir = e.target.closest('[data-qv-abrir]');
    if (abrir) { abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvOp || ''); return; }
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
      const acciones = add.closest('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, add); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
      showToast(`Sumaste ${p.nombre}${op ? ` (${varTxt(p, op)})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const op = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !op) { abrirQV(p.id, comprar); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, op);
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
  const subsDe = id => CATEGORIAS.find(c => c.id === id)?.subs || [];
  const e = {
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], agua: multi('agua', AGUAS),
    precio: valido(params.get('precio'), PRECIOS), oferta: params.get('oferta') === '1', fav: params.get('fav') === '1', autor: params.get('autor') === '1',
    orden: valido(params.get('orden'), ORDENES) || 'destacados', q: (params.get('q') || '').trim().slice(0, 60),
  };
  e.sub = e.cat ? multi('sub', subsDe(e.cat)) : [];

  const form = document.getElementById('filtros');
  const cuerpo = document.getElementById('filtrosBody');
  const buscar = document.getElementById('buscar');
  const orden = document.getElementById('orden');
  const contador = document.getElementById('contador');
  const mostrando = document.getElementById('mostrando');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('vacio');
  const vacioTxt = document.getElementById('vacioTxt');
  const vacioWsp = document.getElementById('vacioWsp');
  const activos = document.getElementById('activos');
  const nBadge = document.querySelector('[data-filtros-n]');
  const chips = document.getElementById('chipsCat');
  let cursor = null, mostrados = 0, total = 0;

  const filtros = () => {
    const f = {};
    if (e.cat) f.cat = e.cat;
    if (e.sub.length) f.sub = e.sub;
    if (e.agua.length) f.agua = e.agua;
    if (e.oferta) f.oferta = true;
    if (e.autor) f.autor = true;
    if (e.fav) f.ids = Favs.get();
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
    grupos.push(`<fieldset class="f-grupo"><legend>Tipo de mosca</legend>
      ${opcion('radio', 'cat', '', 'Todas', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat) grupos.push(`<fieldset class="f-grupo"><legend>${esc(nombreDe(CATEGORIAS, e.cat))}</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    const aguas = AGUAS.filter(a => fac.agua[a.id]);
    if (aguas.length) grupos.push(`<fieldset class="f-grupo"><legend>Para pescar en</legend><div class="f-necs">
      ${aguas.map(a => `<label class="f-nec"><input type="checkbox" name="agua-${a.id}" value="${a.id}" data-f="agua"${e.agua.includes(a.id) ? ' checked' : ''}><span>${esc(a.nombre)}</span></label>`).join('')}</div></fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'autor', '1', 'Patrones de autor', e.autor, Tienda.contar({ ...base, autor: true }), 'autor')}
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritas', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const agua = !cat && e.agua.length === 1 ? AGUAS.find(a => a.id === e.agua[0]) : null;
    const titulo = sub ? sub.nombre : cat ? cat.nombre : agua ? `Moscas para ${agua.nombre.toLowerCase()}` : e.autor ? 'Patrones de autor' : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritas' : e.q ? `Resultados para «${e.q}»` : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Todas las moscas';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : agua ? agua.frase : e.autor ? 'Streamers y moscas pensadas y atadas por Dr. Hooks para pescadores exigentes.' : e.oferta ? 'Moscas con descuento, mientras haya stock.' : e.fav ? 'Las que guardaste con el corazón, para decidir con calma.' : 'Secas, ninfas, streamers y cajas surtidas, atadas a mano. Elegí el anzuelo y sumalas al carrito.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : agua ? agua.nombre : e.autor ? 'De autor' : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : agua ? `${CATALOGO_URL}?agua=${agua.id}` : e.autor ? `${CATALOGO_URL}?autor=1` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta && !e.agua.length && !e.autor ? ' aria-current="page"' : ''}>Todas <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`),
      `<a class="chip chip--autor" href="${CATALOGO_URL}?autor=1" data-chip-autor${e.autor && !e.cat ? ' aria-current="page"' : ''}>De autor <small>${Tienda.contar({ autor: true })}</small></a>`].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    e.agua.forEach(v => quitar.push(['agua', v, nombreDe(AGUAS, v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.autor) quitar.push(['autor', '1', 'Patrones de autor']);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritas']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'agua', 'precio', 'oferta', 'fav', 'autor', 'orden', 'q'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.agua.length) u.searchParams.set('agua', e.agua.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.autor) u.searchParams.set('autor', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    window.history.replaceState(null, '', u);
    syncModelosLink();
  }
  function pintar(reiniciar) {
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; total = e.q ? 0 : Tienda.contar(filtros()); }
    const res = Tienda.consultar({ filtros: filtros(), orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const hay = mostrados > 0;
    contador.textContent = e.q
      ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'}`
      : `${total} ${total === 1 ? 'mosca' : 'moscas'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritas. Tocá el corazón de una mosca y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te decimos si Dr. Hooks la puede atar.` : 'No hay moscas con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! ¿Tenés o podés atar ${e.q}?` : `Hola ${MARCA}! Estoy buscando una mosca y no la encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados} ${cursor ? '· hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
    revelarNuevos(grid);
    refrescarTriggers();
  }
  function aplicar() {
    if (!e.cat) e.sub = [];
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
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav' || grupo === 'autor') e[grupo] = inp.checked;
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
  const limpiar = () => { e.cat = ''; e.sub = []; e.agua = []; e.precio = ''; e.oferta = false; e.fav = false; e.autor = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav' || k === 'autor') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat], [data-chip-autor]');
    if (!a) return;
    ev.preventDefault();
    if (a.hasAttribute('data-chip-autor')) { e.cat = ''; e.sub = []; e.agua = []; e.oferta = false; e.autor = true; }
    else { e.cat = a.dataset.chipCat; e.sub = []; e.agua = []; e.oferta = false; e.autor = false; }
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-nec a, .cats-todo, .cats-oferta, a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.agua = (u.searchParams.get('agua') || '').split(',').filter(v => AGUAS.some(x => x.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.autor = u.searchParams.get('autor') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
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
  modo();
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
document.addEventListener('favs:updated', syncFavs);

[initCatsMenu, initHome, initGuia, initCatalogo, initReveals, initNav, initBuscadorHeader, initHeroMotion,
  initRail, initVisor, initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
