const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491133677392';
const MARCA = 'Lo de MORIS';
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
  { id: 'pelotas', nombre: 'Pelotas', corto: 'Pelotas', bajada: 'De fútbol y de goma.', img: 'images/p-pelota-futbol.webp',
    texto: 'Pelotas de fútbol cosidas y pelotitas de goma para la plaza, el patio o el kiosco.',
    subs: [{ id: 'futbol', nombre: 'De fútbol' }, { id: 'goma', nombre: 'De goma' }] },
  { id: 'juguetes', nombre: 'Juguetes', corto: 'Juguetes', bajada: 'Para la casa, la plaza y la playa.', img: 'images/p-oso-peluche.webp',
    texto: 'Peluches, camiones, juguetes para los más chicos y todo para la arena.',
    subs: [{ id: 'primera', nombre: 'Primera infancia' }, { id: 'vehiculos', nombre: 'Autos y camiones' }, { id: 'peluches', nombre: 'Peluches' }, { id: 'playa', nombre: 'Playa y arena' }] },
  { id: 'almacen', nombre: 'Almacén y kiosco', corto: 'Almacén', bajada: 'Lo de todos los días y golosinas.', img: 'images/p-aceite-girasol.webp',
    texto: 'Fideos, aceite y golosinas para la casa o para revender en el kiosco.',
    subs: [{ id: 'secos', nombre: 'Fideos y secos' }, { id: 'aceites', nombre: 'Aceites' }, { id: 'golosinas', nombre: 'Golosinas' }] },
];
const PRECIOS = [
  { id: 'hasta5', nombre: 'Hasta $5.000', min: null, max: 5000 },
  { id: '5a15', nombre: '$5.000 a $15.000', min: 5001, max: 15000 },
  { id: 'mas15', nombre: 'Más de $15.000', min: 15001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  pelotas: 'pelota pelotas balon plaza picado', futbol: 'futbol fútbol cancha picado numero 5 n5 cosida', goma: 'goma pelotita pelotitas relieve red plastico',
  juguetes: 'juguete juguetes chicos nenes regalo cumple', primera: 'bebe bebé aros apilable didactico primera infancia',
  vehiculos: 'camion camión auto volcador vehiculo', peluches: 'oso peluche osito regalo', playa: 'playa balde pala rastrillo arena verano pileta',
  almacen: 'almacen almacén kiosco', secos: 'fideos pasta mostachol secos', aceites: 'aceite girasol cocina', golosinas: 'caramelos golosinas dulces kiosco caramelo',
};

const Tienda = crearTienda([
  { id: 'pelota-futbol', nombre: 'Pelota de fútbol cosida', cat: 'pelotas', sub: 'futbol', precio: 18900, descuento: 0, stock: 36, alta: 30, rango: 1,
    bulto: { u: 6, precio: 96000 }, var: { tipo: 'Número', ops: ['N° 3', 'N° 4', 'N° 5'] }, img: 'images/p-pelota-futbol.webp', galeria: ['images/pelota-vertical.webp'],
    alt: 'Pelota de fútbol cosida con gajos blancos y negros sobre fondo gris',
    desc: 'Cuero sintético cosido, cámara de látex y gajos blancos y negros. Para el picado del barrio, la plaza o la escuela.',
    datos: [['Material', 'Cuero sintético cosido'], ['Números', 'N° 3, N° 4 y N° 5']] },
  { id: 'pelotitas-relieve-x3', nombre: 'Pelotitas de goma con relieve x3', cat: 'pelotas', sub: 'goma', precio: 6500, descuento: 0, stock: 60, alta: 29, rango: 2,
    bulto: { u: 12, precio: 62400 }, tag: 'Pack x3', img: 'images/p-pelotas-x3.webp', galeria: ['images/hero-pelotas.webp'],
    alt: 'Tres pelotitas de goma con relieve, roja, azul y amarilla, dentro de una red con etiqueta',
    desc: 'Tres pelotitas de goma blanda con relieve, roja, azul y amarilla, en su red con etiqueta. Rebotan y se agarran fácil.',
    datos: [['Incluye', '3 pelotitas en red'], ['Material', 'Goma blanda con relieve']] },
  { id: 'camion-volcador', nombre: 'Camión volcador de juguete', cat: 'juguetes', sub: 'vehiculos', precio: 14900, descuento: 0, stock: 18, alta: 28, rango: 4,
    bulto: { u: 6, precio: 76200 }, img: 'images/p-camion-volcador.webp',
    alt: 'Camión volcador de juguete rojo con caja amarilla y ruedas negras',
    desc: 'Plástico resistente, caja que se levanta y ruedas grandes. Para la arena, el patio o el living.',
    datos: [['Material', 'Plástico resistente'], ['Edad', 'Desde 3 años']] },
  { id: 'torre-aros', nombre: 'Torre de aros apilables', cat: 'juguetes', sub: 'primera', precio: 9800, descuento: 0, stock: 18, alta: 27, rango: 6,
    bulto: { u: 6, precio: 49800 }, img: 'images/p-torre-aros.webp',
    alt: 'Torre de aros de colores apilados sobre una base blanca, con una bolita amarilla arriba',
    desc: 'Siete aros de colores para apilar sobre la base, con la bolita arriba. Ayuda a reconocer tamaños y colores.',
    datos: [['Piezas', '7 aros, base y bolita'], ['Edad', 'Desde 1 año']] },
  { id: 'oso-peluche', nombre: 'Oso de peluche', cat: 'juguetes', sub: 'peluches', precio: 16500, descuento: 0, stock: 12, alta: 26, rango: 3,
    bulto: { u: 4, precio: 58000 }, img: 'images/p-oso-peluche.webp',
    alt: 'Oso de peluche color miel, sentado, con hocico claro y nariz bordada',
    desc: 'Pelo suave color miel, hocico bordado y patas con plantilla. Para regalar en un cumple o porque sí.',
    datos: [['Tamaño', 'Mediano, sentado']] },
  { id: 'set-playa', nombre: 'Set de playa: balde, pala y rastrillo', cat: 'juguetes', sub: 'playa', precio: 7900, descuento: 15, stock: 36, alta: 25, rango: 5,
    bulto: { u: 12, precio: 75600 }, img: 'images/p-set-playa.webp',
    alt: 'Balde azul con manija amarilla, pala roja y rastrillo verde de plástico',
    desc: 'Balde con manija, pala y rastrillo de plástico. Listo para la playa, la pileta o el arenero de la plaza.',
    datos: [['Incluye', 'Balde, pala y rastrillo']] },
  { id: 'fideos-mostachol', nombre: 'Fideos mostachol 500 g', cat: 'almacen', sub: 'secos', precio: 1450, descuento: 0, stock: 120, alta: 24, rango: 7,
    bulto: { u: 20, precio: 25000 }, img: 'images/p-fideos-mostachol.webp',
    alt: 'Paquete transparente de fideos mostachol con etiqueta en blanco, sobre una mesada',
    desc: 'Fideos secos de sémola, corte mostachol rayado. Paquete de 500 g.',
    datos: [['Contenido', '500 g']] },
  { id: 'aceite-girasol', nombre: 'Aceite de girasol 900 ml', cat: 'almacen', sub: 'aceites', precio: 2900, descuento: 0, stock: 72, alta: 23, rango: 8,
    bulto: { u: 12, precio: 31200 }, img: 'images/p-aceite-girasol.webp',
    alt: 'Botella de aceite de girasol con tapa amarilla y etiqueta en blanco',
    desc: 'Aceite de girasol en botella de 900 ml, para cocinar y aderezar.',
    datos: [['Contenido', '900 ml']] },
  { id: 'caramelos-surtidos', nombre: 'Caramelos surtidos, bolsa de 1 kg', cat: 'almacen', sub: 'golosinas', precio: 6800, descuento: 0, stock: 40, alta: 22, rango: 9,
    bulto: { u: 10, precio: 61000 }, img: 'images/p-caramelos-surtidos.webp',
    alt: 'Bolsa transparente atada con caramelos duros rayados de colores',
    desc: 'Caramelos duros rayados, de frutas surtidas, envueltos uno por uno. Para vender sueltos en el kiosco o para la mesa dulce.',
    datos: [['Contenido', '1 kg']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.cat, p.sub, p.desc, p.tag || '', ETIQUETAS[p.cat] || '', ETIQUETAS[p.sub] || '', ...(p.var?.ops || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (sub.length && !sub.includes(p.sub)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.oferta && !(p.descuento > 0)) return false;
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
  function facetas(filtros = {}) {
    const subs = {};
    visibles.forEach(p => { if (coincide(p, filtros) && p.sub) subs[p.sub] = (subs[p.sub] || 0) + 1; });
    return { subs };
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
const tipoVar = p => p.var?.tipo || 'Opción';
const varTxt = (p, op) => (tipoVar(p) === 'Número' ? op : `${tipoVar(p).toLowerCase()} ${op}`);
const porUnidadBulto = p => Math.round(p.bulto.precio / p.bulto.u);
const armarOp = (formato, v = '') => (v ? `${formato}|${v}` : formato);
const leerOp = op => { const [f, ...r] = String(op || 'u').split('|'); return { formato: f === 'b' ? 'b' : 'u', v: r.join('|') }; };
const precioOp = (p, op) => (leerOp(op).formato === 'b' ? p.bulto.precio : precioFinal(p));
const maxOp = (p, op) => (leerOp(op).formato === 'b' ? Math.max(1, Math.floor(p.stock / p.bulto.u)) : p.stock);
const bultoTxt = p => `bulto x${p.bulto.u}`;
const opTxt = (p, op) => { const { formato, v } = leerOp(op); return [formato === 'b' ? bultoTxt(p) : '', v ? varTxt(p, v) : ''].filter(Boolean).join(' · '); };
const cantTxt = (n, op) => (leerOp(op).formato === 'b' ? `${n} ${n === 1 ? 'bulto' : 'bultos'}` : `${n}`);

const Modo = {
  KEY: 'lodemoris_modo',
  get() { try { return localStorage.getItem(this.KEY) === 'comercio' ? 'comercio' : 'casa'; } catch { return 'casa'; } },
  set(m) {
    const v = m === 'comercio' ? 'comercio' : 'casa';
    if (v === this.get()) return;
    try { localStorage.setItem(this.KEY, v); } catch (e) { void e; }
    document.dispatchEvent(new CustomEvent('modo:updated'));
  },
};
const esComercio = () => Modo.get() === 'comercio';
const formatoActual = () => (esComercio() ? 'b' : 'u');

const Cart = {
  KEY: 'lodemoris_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, op = 'u') {
    const items = this.get();
    const max = maxOp(producto, op);
    const existing = items.find(i => i.id === producto.id && (i.op || 'u') === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, op, qty: Math.min(qty, max) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && (i.op || 'u') === op); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? maxOp(p, op) : 99)); this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && (i.op || 'u') === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.op) * i.qty : s; }, 0); },
};

const Favs = {
  KEY: 'lodemoris_favs',
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
  opcion: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3.5 9h17M3.5 15h17"/></svg>',
  caja: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/></svg>',
  local: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/></svg>',
  carritoMas: '<svg class="lbl-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><path d="M13.6 9.4v3.6M11.8 11.2h3.6"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};
const ESTADO = {
  subir: 'data-animate="subir" style="opacity:0;transform:translateY(48px)"',
  der: 'data-animate="der" style="opacity:0;transform:translateX(64px)"',
  izq: 'data-animate="izq" style="opacity:0;transform:translateX(-56px)"',
};

function metaDe(p) {
  const cat = CATEGORIAS.find(c => c.id === p.cat)?.corto || '';
  const sub = subDe(p)?.nombre || '';
  return sub ? `${cat} · ${sub}` : cat;
}
function precioHTML(p) {
  return `<p class="precio"><span class="precio__final${p.descuento > 0 ? ' precio__final--oferta' : ''}">${formatearPrecio(precioFinal(p))}</span>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</p>`;
}
function precioModoHTML(p) {
  if (!esComercio()) return precioHTML(p);
  return `<p class="precio"><span class="precio__final">${formatearPrecio(p.bulto.precio)}</span><span class="precio__bulto">Bulto x${p.bulto.u} · ${formatearPrecio(porUnidadBulto(p))} c/u</span></p>`;
}
function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="etiqueta etiqueta--oferta">-${p.descuento}%</span>`);
  if (p.tag) b.push(`<span class="etiqueta">${esc(p.tag)}</span>`);
  if (p.stock <= 12) b.push('<span class="etiqueta etiqueta--clara">Últimas unidades</span>');
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
function opsHTML(p) {
  if (!conVar(p)) return '';
  return `<span class="prod__tonos">${ICON.opcion}${esc(p.var.ops[0])} a ${esc(p.var.ops[p.var.ops.length - 1])}</span>`;
}
function selectHTML(p, nombre) {
  return `<label class="var-sel"><span class="sr-only">${esc(tipoVar(p))} de ${nombre}</span><select data-op><option value="">${esc(tipoVar(p))}</option>${p.var.ops.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></label>`;
}
function addLabel(p) {
  return esComercio() ? `Sumar un bulto de ${p.nombre}` : `Agregar al carrito: ${p.nombre}`;
}

function cardHTML(p) {
  const nombre = esc(p.nombre);
  const img = `<img src="${p.img}" alt="${esc(p.alt)}" width="800" height="800" decoding="async">`;
  const media = `<div class="prod__media"><a class="prod__foto" href="${urlProducto(p)}" data-qv="${p.id}" tabindex="-1" aria-hidden="true">${img}</a>${badgesHTML(p)}${favHTML(p)}<span class="prod__ver" aria-hidden="true">Ver detalle</span></div>`;
  const control = conVar(p) ? selectHTML(p, nombre) : `<span data-stepper-de="${p.id}">${stepperHTML(maxOp(p, formatoActual()))}</span>`;
  return `<article class="prod">
    ${media}
    <div class="prod__body">
      <p class="prod__meta">${esc(metaDe(p))}</p>
      <h3 class="prod__nombre"><a href="${urlProducto(p)}" data-qv="${p.id}">${nombre}</a></h3>
      <div class="prod__precio-fila"><div data-precio-de="${p.id}">${precioModoHTML(p)}</div>${opsHTML(p)}</div>
      <div class="prod__acciones">${control}<button type="button" class="prod-add" data-add="${p.id}" aria-label="${esc(addLabel(p))}"><span class="lbl-long">Agregar al carrito</span><span class="lbl-short">Agregar</span>${ICON.carritoMas}</button></div>
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
  nav.querySelectorAll(':scope > a').forEach(a => a.addEventListener('click', close));
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
          <span><span class="cats-item__nombre">${esc(c.nombre)}</span><span class="cats-item__bajada">${esc(c.bajada)}</span><span class="cats-item__n">${Tienda.contar({ cat: c.id })} productos</span></span>
        </a>
        <div class="cats-subs">${c.subs.map(s => `<a href="${CATALOGO_URL}?cat=${c.id}&amp;sub=${s.id}">${esc(s.nombre)}</a>`).join('')}</div>
      </div>`).join('') + '</div>'
      + `<div class="cats-nec"><p class="cats-nec__tit">Atajos</p><a href="${CATALOGO_URL}?oferta=1">Ofertas <small>${Tienda.contar({ oferta: true })}</small></a><a href="${CATALOGO_URL}?modo=comercio">Precios por bulto</a><a href="${CATALOGO_URL}?fav=1">Tus favoritos</a><a href="${CATALOGO_URL}?q=">Buscar en el catálogo</a></div>`
      + `<div class="cats-pie"><a class="cats-todo" href="${CATALOGO_URL}">Ver todo el catálogo ${ICON.flecha}</a></div>`;
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
  const q = sel => [...hero.querySelectorAll(sel)].filter(el => !el.closest('.slide:not(.is-on)'));
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  q('[data-hero-img]').forEach(img => tl.from(img, { scale: 1.09, duration: 1.8, clearProps: 'transform' }, 0));
  tl.from(q('.eyebrow'), { y: 18, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0.1)
    .from(q('h1'), { y: 36, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0.18)
    .from(q('.hero-lead'), { y: 22, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.38)
    .from(q('.hero-ctas > *'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.5)
    .from(q('.chispas'), { scale: 0.92, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity' }, 0.6);
  const tag = q('.colgante__tag');
  if (tag.length) tl.from(tag, { rotation: 22, opacity: 0, transformOrigin: '50% 0%', duration: 1.6, ease: 'elastic.out(1, 0.35)', clearProps: 'transform,opacity' }, 0.62);
  if (q('.slider__ctrl').length) tl.from(q('.slider__ctrl'), { opacity: 0, duration: 0.8, clearProps: 'opacity' }, 0.7);
}

const DESTACADOS = ['pelota-futbol', 'pelotitas-relieve-x3', 'oso-peluche', 'set-playa', 'camion-volcador', 'torre-aros', 'caramelos-surtidos', 'aceite-girasol'];
function initHome() {
  if (PAGINA !== 'home') return;
  const vista = document.getElementById('vistaLista');
  if (vista) {
    vista.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADOS }, orden: 'destacados', limite: 8 }).items
      .map(p => `<li ${ESTADO.subir}>${cardHTML(p)}</li>`).join('');
  }
  const rail = document.getElementById('railLista');
  if (rail) {
    rail.innerHTML = Tienda.consultar({ filtros: { ids: DESTACADOS }, orden: 'destacados', limite: 8 }).items
      .map(p => `<li class="rail-item"><div class="rail-item__in" ${ESTADO.der}>${cardHTML(p)}</div></li>`).join('');
  }
  document.querySelectorAll('[data-cat-n]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catN });
    el.textContent = `${r.n} ${r.n === 1 ? 'producto' : 'productos'} · desde ${formatearPrecio(r.desde)}`;
  });
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    if (e.target.closest('button, select, input, .stepper')) return;
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
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const destino = [...track.children].reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}
function initRail() {
  const vp = document.querySelector('.rail-vp');
  if (!vp) return;
  initRailDrag(vp);
  const track = vp.firstElementChild;
  const prev = document.querySelector('[data-rail="prev"]');
  const next = document.querySelector('[data-rail="next"]');
  const paso = () => {
    const it = track.children[0];
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 16;
    return it ? it.getBoundingClientRect().width + gap : 300;
  };
  const sync = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initSlider() {
  const s = document.querySelector('[data-slider]');
  if (!s) return;
  const slides = [...s.querySelectorAll('.slide')];
  const dots = [...s.querySelectorAll('[data-slide-ir]')];
  const DUR = 6500;
  let i = 0, timer = 0, pausado = false;
  s.style.setProperty('--slide-dur', `${DUR}ms`);
  const correr = () => {
    clearTimeout(timer);
    s.classList.remove('corriendo');
    if (reduceMotion || pausado || document.hidden) return;
    void s.offsetWidth;
    s.classList.add('corriendo');
    timer = setTimeout(() => ir(i + 1), DUR);
  };
  function ir(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((sl, k) => {
      const on = k === i;
      sl.classList.toggle('is-on', on);
      sl.setAttribute('aria-hidden', String(!on));
      if (on) sl.removeAttribute('inert'); else sl.setAttribute('inert', '');
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    correr();
  }
  dots.forEach((d, k) => d.addEventListener('click', () => ir(k)));
  s.querySelector('[data-slide="prev"]')?.addEventListener('click', () => ir(i - 1));
  s.querySelector('[data-slide="next"]')?.addEventListener('click', () => ir(i + 1));
  s.addEventListener('mouseenter', () => { pausado = true; correr(); });
  s.addEventListener('mouseleave', () => { pausado = false; correr(); });
  s.addEventListener('focusin', () => { pausado = true; correr(); });
  s.addEventListener('focusout', e => { if (!s.contains(e.relatedTarget)) { pausado = false; correr(); } });
  document.addEventListener('visibilitychange', correr);
  let x0 = null;
  s.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  s.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) ir(i + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });
  ir(0);
}

function filaBultoHTML(p) {
  const nombre = esc(p.nombre);
  const accion = conVar(p)
    ? `<button type="button" class="fb__btn" data-qv-abrir="${p.id}" data-qv-formato="b" aria-label="Elegir número y sumar un bulto de ${nombre}">${ICON.opcion}Elegir número</button>`
    : `<button type="button" class="fb__btn" data-add-bulto="${p.id}" aria-label="Sumar un bulto de ${nombre} al carrito">${ICON.carritoMas.replace('class="lbl-icon" ', '')}Sumar bulto</button>`;
  return `<li ${ESTADO.izq}><div class="fb">
    <span class="fb__foto"><img src="${p.img}" alt="" width="112" height="112" decoding="async"></span>
    <div><p class="fb__nombre"><button type="button" data-qv-abrir="${p.id}" data-qv-formato="b">${nombre}</button></p><p class="fb__det">Bulto x${p.bulto.u} · <b>${formatearPrecio(porUnidadBulto(p))} c/u</b> (suelto ${formatearPrecio(precioFinal(p))})</p></div>
    <p class="fb__precio">${formatearPrecio(p.bulto.precio)}<small>el bulto</small></p>
    ${accion}
  </div></li>`;
}
function initComercios() {
  const box = document.getElementById('comercios');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[role="tab"]')];
  const panel = box.querySelector('[role="tabpanel"]');
  const lista = panel?.querySelector('ul');
  const ver = box.querySelector('[data-bulto-ver]');
  if (!tabs.length || !lista) return;
  const pintar = (cat, foco) => {
    tabs.forEach(t => {
      const on = t.dataset.cat === cat;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && foco) t.focus();
    });
    panel.setAttribute('aria-labelledby', `tab-${cat}`);
    lista.innerHTML = Tienda.consultar({ filtros: { cat }, orden: 'destacados', limite: 8 }).items.map(filaBultoHTML).join('');
    if (ver) ver.href = `${CATALOGO_URL}?cat=${cat}&modo=comercio`;
    revelarNuevos(lista);
    refrescarTriggers();
  };
  tabs.forEach((t, k) => {
    t.addEventListener('click', () => pintar(t.dataset.cat));
    t.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      pintar(tabs[(k + d + tabs.length) % tabs.length].dataset.cat, true);
    });
  });
  pintar(tabs.find(t => t.getAttribute('aria-selected') === 'true')?.dataset.cat || tabs[0].dataset.cat);
}

function syncModo() {
  const com = esComercio();
  document.body.classList.toggle('modo-comercio', com);
  document.querySelectorAll('[data-modo]').forEach(b => {
    if (b.closest('.modo')) b.setAttribute('aria-pressed', String(b.dataset.modo === Modo.get()));
  });
  document.querySelectorAll('[data-modo-aviso]').forEach(el => { el.hidden = !com; });
  document.querySelectorAll('[data-precio-de]').forEach(el => {
    const p = getProducto(el.dataset.precioDe);
    if (p) el.innerHTML = precioModoHTML(p);
  });
  document.querySelectorAll('[data-stepper-de]').forEach(el => {
    const p = getProducto(el.dataset.stepperDe);
    if (p) el.innerHTML = stepperHTML(maxOp(p, formatoActual()));
  });
  document.querySelectorAll('[data-add]').forEach(b => {
    const p = getProducto(b.dataset.add);
    if (p) b.setAttribute('aria-label', addLabel(p));
  });
}
function initModo() {
  const pedido = new URLSearchParams(location.search).get('modo');
  if (pedido === 'comercio' || pedido === 'casa') Modo.set(pedido);
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-modo]');
    if (!b) return;
    const antes = Modo.get();
    Modo.set(b.dataset.modo);
    if (antes !== Modo.get()) showToast(esComercio() ? 'Listo: ahora ves los precios por bulto para comercios.' : 'Listo: volviste a los precios por unidad.');
  });
  document.addEventListener('modo:updated', syncModo);
  syncModo();
}

const QV = { p: null, op: '', formato: 'u', foto: 0, opener: null };
function fotosQV(p) {
  const fotos = [{ src: p.img, alt: p.alt }];
  (p.galeria || []).forEach(src => fotos.push({ src, alt: `Otra vista: ${p.nombre}` }));
  return fotos;
}
function renderQV() {
  const p = QV.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const cat = CATEGORIAS.find(c => c.id === p.cat);
  const sub = subDe(p);
  const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id }, orden: 'destacados', limite: 3 }).items;
  const fotos = fotosQV(p);
  if (QV.foto >= fotos.length) QV.foto = 0;
  const tipo = tipoVar(p);
  const op = armarOp(QV.formato, QV.op);
  const msg = `Hola ${MARCA}! Quiero consultar por ${p.nombre}${opTxt(p, op) ? ` (${opTxt(p, op)})` : ''}.`;
  const on = Favs.has(p.id);
  const actual = fotos[QV.foto].src;
  const forma = actual.includes('vertical') ? ' qv__principal--alta' : '';
  cont.innerHTML = `
    <div class="qv__grid">
      <div class="qv__galeria">
        <div class="qv__principal${forma}"><img src="${actual}" alt="${esc(fotos[QV.foto].alt)}" width="800" height="800"></div>
        ${fotos.length > 1 ? `<div class="qv__miniaturas">${fotos.map((f, k) => `<button type="button" class="qv__mini" data-qv-foto="${k}" aria-current="${k === QV.foto}" aria-label="${k ? 'Ver otra foto' : 'Ver la foto principal'}"><img src="${f.src}" alt="" width="72" height="72"></button>`).join('')}</div>` : ''}
      </div>
      <div class="qv__info">
        <p class="eyebrow">${esc(sub?.nombre || cat?.nombre || '')}</p>
        <h2>${esc(p.nombre)}</h2>
        <p class="qv__desc">${esc(p.desc)}</p>
        ${(p.datos || []).map(([k, v]) => `<p class="qv__dato"><span>${esc(k)}</span>${esc(v)}</p>`).join('')}
        <div>
          <p class="f-grupo__titulo">¿Cómo lo comprás?</p>
          <div class="qv__formato" role="group" aria-label="Por unidad o por bulto">
            <button type="button" class="qv__fmt" data-qv-fmt="u" aria-pressed="${QV.formato === 'u'}"><span>Por unidad</span><strong>${formatearPrecio(precioFinal(p))}</strong>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : '<small>Para tu casa</small>'}</button>
            <button type="button" class="qv__fmt" data-qv-fmt="b" aria-pressed="${QV.formato === 'b'}"><span>Bulto x${p.bulto.u}</span><strong>${formatearPrecio(p.bulto.precio)}</strong><small>${formatearPrecio(porUnidadBulto(p))} c/u, para revender</small></button>
          </div>
        </div>
        ${conVar(p) ? `<div>
          <p class="f-grupo__titulo">${esc(tipo)}</p>
          <div class="qv__ops" role="group" aria-label="Elegí el ${esc(tipo.toLowerCase())}">${p.var.ops.map(o => `<button type="button" class="qv__op" data-qv-op="${esc(o)}" aria-pressed="${QV.op === o}">${esc(o)}</button>`).join('')}</div>
          <p class="qv__aviso" id="qvAviso" aria-live="polite"></p>
        </div>` : ''}
        <div class="qv__compra">
          ${stepperHTML(maxOp(p, QV.formato))}
          <button type="button" class="btn btn--cta" data-qv-agregar>${QV.formato === 'b' ? 'Sumar bultos' : 'Agregar al carrito'}</button>
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
function abrirQV(id, opener, op = '', formato = '') {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const yaAbierto = !modal.hidden;
  QV.p = p; QV.op = p.var?.ops?.includes(op) ? op : ''; QV.foto = 0;
  QV.formato = formato === 'b' || formato === 'u' ? formato : formatoActual();
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
    const fmt = e.target.closest('[data-qv-fmt]');
    if (fmt) { QV.formato = fmt.dataset.qvFmt === 'b' ? 'b' : 'u'; renderQV(); modal.querySelector(`[data-qv-fmt="${QV.formato}"]`)?.focus(); return; }
    const o = e.target.closest('[data-qv-op]');
    if (o) {
      QV.op = o.dataset.qvOp;
      modal.querySelectorAll('[data-qv-op]').forEach(b => b.setAttribute('aria-pressed', String(b === o)));
      const aviso = document.getElementById('qvAviso'); if (aviso) aviso.textContent = '';
      const wsp = modal.querySelector('.qv__wsp');
      if (wsp) wsp.href = wspHref(`Hola ${MARCA}! Quiero consultar por ${QV.p.nombre} (${opTxt(QV.p, armarOp(QV.formato, QV.op))}).`);
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirQV(rel.dataset.qvRel, null, '', QV.formato); modal.querySelector('.qv__close')?.focus(); return; }
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
      const op = armarOp(QV.formato, conVar(p) ? QV.op : '');
      Cart.add(p, qty, op);
      if (comprar) { cerrarQV(); setTimeout(abrirCarrito, reduceMotion ? 0 : 200); }
      else showToast(`Sumaste ${cantTxt(qty, op)} × ${p.nombre}${opTxt(p, op) ? ` (${opTxt(p, op)})` : ''} al carrito.`);
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
  const op = i.op || 'u';
  const { formato } = leerOp(op);
  const detalle = opTxt(p, op);
  return `<li class="linea" data-linea="${p.id}" data-linea-op="${esc(op)}">
    <img src="${p.img}" alt="" width="72" height="72">
    <div>
      <p class="linea__nombre">${esc(p.nombre)}</p>
      <p class="linea__meta">${detalle ? `<b>${esc(detalle)}</b> · ` : ''}${formatearPrecio(precioOp(p, op))} ${formato === 'b' ? 'el bulto' : 'c/u'}</p>
      ${stepperHTML(maxOp(p, op), i.qty)}
    </div>
    <div class="linea__lado"><span>${formatearPrecio(precioOp(p, op) * i.qty)}</span><button type="button" class="linea__quitar" data-quitar>Quitar</button></div>
  </li>`;
}
function renderCarrito() {
  const items = document.getElementById('cartItems');
  const foot = document.getElementById('cartFoot');
  if (!items || !foot) return;
  const lineas = Cart.get().filter(i => getProducto(i.id));
  if (!lineas.length) {
    items.innerHTML = `<div class="drawer__vacio">${ICON.caja}<p>Tu carrito está vacío. Hay pelotas, juguetes y cosas del almacén esperando.</p><a class="btn btn--cta" href="${CATALOGO_URL}">Volver al catálogo ${ICON.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  items.innerHTML = `<ul>${lineas.map(lineaHTML).join('')}</ul>`;
  foot.hidden = false;
  const total = Cart.total();
  document.getElementById('cartTotal').textContent = formatearPrecio(total);
  const texto = [`Hola ${MARCA}! Quiero hacer este pedido:`, ...lineas.map(i => {
    const p = getProducto(i.id);
    const det = opTxt(p, i.op);
    return `- ${cantTxt(i.qty, i.op)} × ${p.nombre}${det ? ` (${det})` : ''}: ${formatearPrecio(precioOp(p, i.op) * i.qty)}`;
  }), `Total: ${formatearPrecio(total)}`, 'Retiro en Ameghino 102 o entrega a coordinar.'].join('\n');
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
    const id = linea.dataset.linea, op = linea.dataset.lineaOp || 'u';
    const it = Cart.get().find(i => i.id === id && (i.op || 'u') === op);
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
    if (abrir) { e.preventDefault(); abrirQV(abrir.dataset.qvAbrir, abrir, abrir.dataset.qvOp || '', abrir.dataset.qvFormato || ''); return; }
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
    const bulto = e.target.closest('[data-add-bulto]');
    if (bulto) {
      const p = getProducto(bulto.dataset.addBulto);
      if (!p) return;
      Cart.add(p, 1, 'b');
      showToast(`Sumaste un bulto de ${p.nombre} (x${p.bulto.u}) al carrito.`);
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = getProducto(add.dataset.add);
      if (!p) return;
      const acciones = add.closest('.prod__acciones');
      const v = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !v) { abrirQV(p.id, add); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      const op = armarOp(formatoActual(), v);
      Cart.add(p, qty, op);
      showToast(`Sumaste ${cantTxt(qty, op)} × ${p.nombre}${opTxt(p, op) ? ` (${opTxt(p, op)})` : ''} al carrito.`);
      add.classList.add('is-ok');
      setTimeout(() => add.classList.remove('is-ok'), 700);
      return;
    }
    const comprar = e.target.closest('[data-comprar]');
    if (comprar) {
      const p = getProducto(comprar.dataset.comprar);
      if (!p) return;
      const acciones = comprar.closest('.prod__body')?.querySelector('.prod__acciones');
      const v = conVar(p) ? (acciones?.querySelector('[data-op]')?.value || '') : '';
      if (conVar(p) && !v) { abrirQV(p.id, comprar); return; }
      const qty = Number(acciones?.querySelector('[data-stepper] output')?.textContent) || 1;
      Cart.add(p, qty, armarOp(formatoActual(), v));
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
    cat: valido(params.get('cat'), CATEGORIAS), sub: [], precio: valido(params.get('precio'), PRECIOS),
    oferta: params.get('oferta') === '1', fav: params.get('fav') === '1',
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
    if (e.oferta) f.oferta = true;
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
    grupos.push(`<fieldset class="f-grupo"><legend>Rubro</legend>
      ${opcion('radio', 'cat', '', 'Todos', !e.cat, Tienda.contar({}), 'cat')}
      ${CATEGORIAS.map(c => opcion('radio', 'cat', c.id, esc(c.nombre), e.cat === c.id, Tienda.contar({ cat: c.id }), 'cat')).join('')}</fieldset>`);
    if (e.cat && subsDe(e.cat).length) grupos.push(`<fieldset class="f-grupo"><legend>${esc(nombreDe(CATEGORIAS, e.cat))}</legend>
      ${subsDe(e.cat).map(s => opcion('checkbox', `sub-${s.id}`, s.id, esc(s.nombre), e.sub.includes(s.id), fac.subs[s.id] || 0, 'sub')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Precio por unidad</legend>
      ${opcion('radio', 'precio', '', 'Cualquier precio', !e.precio, null, 'precio')}
      ${PRECIOS.map(r => opcion('radio', 'precio', r.id, r.nombre, e.precio === r.id, null, 'precio')).join('')}</fieldset>`);
    grupos.push(`<fieldset class="f-grupo"><legend>Mostrar</legend>
      ${opcion('checkbox', 'oferta', '1', 'Solo ofertas', e.oferta, Tienda.contar({ ...base, oferta: true }), 'oferta')}
      ${opcion('checkbox', 'fav', '1', 'Mis favoritos', e.fav, Favs.get().length, 'fav')}</fieldset>`);
    cuerpo.innerHTML = grupos.join('');
  }
  function pintarCabecera() {
    const cat = CATEGORIAS.find(c => c.id === e.cat);
    const sub = cat?.subs?.find(s => e.sub.length === 1 && s.id === e.sub[0]);
    const titulo = sub ? sub.nombre : cat ? cat.nombre : e.oferta ? 'Ofertas' : e.fav ? 'Tus favoritos' : e.q ? `Resultados para «${e.q}»` : e.orden === 'nuevos' ? 'Lo más nuevo' : 'Todo el catálogo';
    const h1 = document.querySelector('[data-cat-titulo]');
    const bajada = document.querySelector('[data-cat-bajada]');
    if (h1) h1.textContent = titulo;
    if (bajada) bajada.textContent = cat ? cat.texto : e.oferta ? 'Productos con descuento, mientras haya stock.' : e.fav ? 'Lo que guardaste con el corazón, para decidir con calma.' : 'Pelotas, juguetes y productos de almacén, por unidad o por bulto para tu comercio.';
    document.title = `${titulo} — ${MARCA}`;
    const miga = document.querySelector('[data-miga-cat]');
    const migaSep = document.querySelector('[data-miga-sep]');
    if (miga) {
      const nombre = cat ? cat.nombre : e.oferta ? 'Ofertas' : '';
      miga.hidden = !nombre; if (migaSep) migaSep.hidden = !nombre;
      miga.textContent = nombre;
      miga.href = cat ? `${CATALOGO_URL}?cat=${cat.id}` : `${CATALOGO_URL}?oferta=1`;
    }
    document.querySelectorAll('.cats-item').forEach(a => {
      const id = new URL(a.href, location.href).searchParams.get('cat');
      if (id === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-nav-cat]').forEach(a => {
      if (a.dataset.navCat === e.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (chips) chips.innerHTML = [`<a class="chip" href="${CATALOGO_URL}" data-chip-cat=""${!e.cat && !e.oferta ? ' aria-current="page"' : ''}>Todo <small>${Tienda.contar({})}</small></a>`,
      ...CATEGORIAS.map(c => `<a class="chip" href="${CATALOGO_URL}?cat=${c.id}" data-chip-cat="${c.id}"${e.cat === c.id ? ' aria-current="page"' : ''}>${esc(c.nombre)} <small>${Tienda.contar({ cat: c.id })}</small></a>`)].join('');
  }
  function pintarActivos() {
    const quitar = [];
    e.sub.forEach(v => quitar.push(['sub', v, nombreDe(subsDe(e.cat), v)]));
    if (e.precio) quitar.push(['precio', e.precio, nombreDe(PRECIOS, e.precio)]);
    if (e.oferta) quitar.push(['oferta', '1', 'Solo ofertas']);
    if (e.fav) quitar.push(['fav', '1', 'Mis favoritos']);
    if (e.q) quitar.push(['q', e.q, `«${e.q}»`]);
    activos.innerHTML = quitar.map(([k, v, t]) => `<button type="button" class="activo" data-quitar-filtro="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICON.cerrar}</button>`).join('')
      + (quitar.length > 1 ? '<button type="button" class="btn-limpiar" data-limpiar>Limpiar filtros</button>' : '');
    const n = quitar.length + (e.cat ? 1 : 0);
    if (nBadge) { nBadge.textContent = n; nBadge.hidden = !n; }
  }
  function syncURL() {
    const u = new URL(location.href);
    ['cat', 'sub', 'precio', 'oferta', 'fav', 'orden', 'q', 'modo'].forEach(k => u.searchParams.delete(k));
    if (e.cat) u.searchParams.set('cat', e.cat);
    if (e.sub.length) u.searchParams.set('sub', e.sub.join(','));
    if (e.precio) u.searchParams.set('precio', e.precio);
    if (e.oferta) u.searchParams.set('oferta', '1');
    if (e.fav) u.searchParams.set('fav', '1');
    if (e.orden !== 'destacados') u.searchParams.set('orden', e.orden);
    if (e.q) u.searchParams.set('q', e.q);
    if (esComercio()) u.searchParams.set('modo', 'comercio');
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
      : `${total} ${total === 1 ? 'producto' : 'productos'}`;
    vacio.hidden = hay;
    grid.hidden = !hay;
    if (vacioTxt) vacioTxt.textContent = e.fav && !Favs.get().length
      ? 'Todavía no guardaste favoritos. Tocá el corazón de un producto y aparece acá.'
      : e.q ? `No encontramos «${e.q}» con esos filtros. Escribinos y te decimos si lo tenemos en el local.` : 'No hay productos con esos filtros. Probá con otra palabra o sacá algún filtro.';
    if (vacioWsp) vacioWsp.href = wspHref(e.q ? `Hola ${MARCA}! ¿Tienen ${e.q}?` : `Hola ${MARCA}! Estoy buscando un producto y no lo encuentro en la web.`);
    verMas.hidden = !cursor;
    mostrando.hidden = !hay;
    mostrando.textContent = e.q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`;
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
  if (e.q || params.has('q')) setTimeout(() => buscar.focus(), 120);

  form.addEventListener('change', ev => {
    const inp = ev.target;
    const grupo = inp.dataset.f;
    if (!grupo) return;
    if (grupo === 'cat') { e.cat = inp.value; e.sub = []; }
    else if (grupo === 'precio') e.precio = inp.value;
    else if (grupo === 'oferta' || grupo === 'fav') e[grupo] = inp.checked;
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
    if (f.classList.contains('header-panel')) {
      f.hidden = true;
      document.querySelector('[data-abrir-busqueda]')?.setAttribute('aria-expanded', 'false');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }));
  orden.addEventListener('change', () => { e.orden = orden.value; aplicar(); });
  verMas.addEventListener('click', () => pintar(false));
  const limpiar = () => { e.cat = ''; e.sub = []; e.precio = ''; e.oferta = false; e.fav = false; e.q = ''; buscar.value = ''; aplicar(); };
  document.querySelectorAll('[data-limpiar-todo]').forEach(b => b.addEventListener('click', limpiar));
  activos.addEventListener('click', ev => {
    if (ev.target.closest('[data-limpiar]')) { limpiar(); return; }
    const b = ev.target.closest('[data-quitar-filtro]');
    if (!b) return;
    const k = b.dataset.quitarFiltro, v = b.dataset.valor;
    if (k === 'precio') e.precio = '';
    else if (k === 'oferta' || k === 'fav') e[k] = false;
    else if (k === 'q') { e.q = ''; buscar.value = ''; }
    else e[k] = e[k].filter(x => x !== v);
    aplicar();
  });
  chips?.addEventListener('click', ev => {
    const a = ev.target.closest('[data-chip-cat]');
    if (!a) return;
    ev.preventDefault();
    e.cat = a.dataset.chipCat; e.sub = []; e.oferta = false;
    aplicar();
  });
  document.addEventListener('click', ev => {
    const a = ev.target.closest('.cats-item, .cats-subs a, .cats-nec a, .cats-todo, a[data-nav-cat], a[data-ir-catalogo]');
    if (!a) return;
    const u = new URL(a.href, location.href);
    if (!u.pathname.endsWith(CATALOGO_URL)) return;
    ev.preventDefault();
    e.cat = valido(u.searchParams.get('cat'), CATEGORIAS);
    e.sub = (u.searchParams.get('sub') || '').split(',').filter(v => subsDe(e.cat).some(s => s.id === v));
    e.oferta = u.searchParams.get('oferta') === '1';
    e.orden = valido(u.searchParams.get('orden'), ORDENES) || 'destacados';
    orden.value = e.orden;
    e.precio = ''; e.fav = u.searchParams.get('fav') === '1'; e.q = ''; buscar.value = '';
    if (u.searchParams.get('modo') === 'comercio') Modo.set('comercio');
    document.querySelectorAll('[data-nav-cats]').forEach(b => { b.classList.remove('open'); b.querySelector('.nav-cats__btn')?.setAttribute('aria-expanded', 'false'); });
    aplicar();
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (u.searchParams.has('q')) setTimeout(() => buscar.focus(), 60);
  });
  document.addEventListener('favs:updated', () => {
    pintarFiltros();
    if (e.fav) aplicar();
  });
  document.addEventListener('modo:updated', syncURL);
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

[initModo, initCatsMenu, initHome, initComercios, initCatalogo, initSlider, initReveals, initRail, initNav, initBuscadorHeader, initHeroMotion,
  initQV, initCarrito, initAcciones, initFloats, initModelBarScroll, syncModelosLink, updateCartBadge, syncFavs]
  .forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
