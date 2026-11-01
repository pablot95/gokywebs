const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491136683288';
const POR_PAGINA = 16;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const FEST = 'M50.0 6.0A8.6 8.6 0 0 1 65.0 8.7A8.6 8.6 0 0 1 78.3 16.3A8.6 8.6 0 0 1 88.1 28.0A8.6 8.6 0 0 1 93.3 42.4A8.6 8.6 0 0 1 93.3 57.6A8.6 8.6 0 0 1 88.1 72.0A8.6 8.6 0 0 1 78.3 83.7A8.6 8.6 0 0 1 65.0 91.3A8.6 8.6 0 0 1 50.0 94.0A8.6 8.6 0 0 1 35.0 91.3A8.6 8.6 0 0 1 21.7 83.7A8.6 8.6 0 0 1 11.9 72.0A8.6 8.6 0 0 1 6.7 57.6A8.6 8.6 0 0 1 6.7 42.4A8.6 8.6 0 0 1 11.9 28.0A8.6 8.6 0 0 1 21.7 16.3A8.6 8.6 0 0 1 35.0 8.7A8.6 8.6 0 0 1 50.0 6.0Z';

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
  { id: 'toppers', nombre: 'Toppers', bajada: 'Para tortas y cupcakes' },
  { id: 'bolsitas', nombre: 'Bolsitas', bajada: 'Golosineras, con etiqueta' },
  { id: 'golosinas', nombre: 'Golosinas', bajada: 'Chocolatines y tubos con tu diseño' },
  { id: 'stickers', nombre: 'Stickers', bajada: 'Planchas para cerrar y decorar' },
  { id: 'banderines', nombre: 'Banderines', bajada: 'Guirnaldas y nombres' },
];
const MOMENTOS = [
  { id: 'torta', nombre: 'La torta' },
  { id: 'mesa', nombre: 'La mesa dulce' },
  { id: 'souvenir', nombre: 'Souvenirs' },
  { id: 'deco', nombre: 'La deco' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: null, max: 10000 },
  { id: '10a15', nombre: '$10.000 a $15.000', min: 10001, max: 15000 },
  { id: 'mas15', nombre: 'Más de $15.000', min: 15001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const PALETAS = {
  rosa: { nombre: 'Rosa y verde agua', a: '#FF9999', b: '#79BDB0', c: '#F3E3D3', f: '#3E7D71' },
  coral: { nombre: 'Coral y salvia', a: '#E0907F', b: '#9DB59B', c: '#F1E4D2', f: '#5E7A5C' },
  crema: { nombre: 'Crema y rosa', a: '#EFE2CF', b: '#F2A3A0', c: '#DCE8DD', f: '#AD4B58' },
};
const ETIQUETAS = {
  toppers: 'topper toppers pinche pinches',
  bolsitas: 'bolsa bolsas bolsita bolsitas golosinera golosineras',
  golosinas: 'golosina golosinas dulces',
  stickers: 'sticker stickers calcomania autoadhesivo',
  banderines: 'banderin banderines guirnalda bandera banderita',
  torta: 'torta pastel', mesa: 'mesa dulce candy bar', souvenir: 'souvenir souvenirs recuerdo invitados', deco: 'decoracion deco pared',
};

const Tienda = crearTienda([
  { id: 'topper-torta-floral', nombre: 'Topper floral para torta con nombre', cat: 'toppers', mom: ['torta'], tags: 'nombre edad flores circulo cumpleanos torta', stock: 15, descuento: 0, alta: 28, rango: 1,
    variantes: [{ id: '20', nombre: '20 cm', precio: 9800 }, { id: '25', nombre: '25 cm', precio: 12500 }], etiqueta: 'Medida',
    img: 'images/p-topper-torta.webp', ancho: 900, alto: 900,
    alt: 'Topper redondo color crema con flores de papel coral y hojas verdes, pinchado sobre una torta blanca',
    galeria: [{ src: 'images/topper-vertical.webp', ancho: 900, alto: 1600, alt: 'El topper floral completo sobre la torta, con sus dos palitos de madera' }],
    desc: 'Círculo festoneado con flores de papel en capas, hojas y estrellitas. Lleva el nombre y la edad en el centro, con la letra y los colores de tu temática.',
    datos: [['Medida', '20 o 25 cm de ancho'], ['Material', 'Cartulina texturada y palitos de madera'], ['Lleva', 'Nombre, edad y temática']] },
  { id: 'toppers-cupcakes-estrella', nombre: 'Toppers para cupcakes estrella y círculo', cat: 'toppers', mom: ['mesa'], tags: 'estrella estrellas circulo inicial cupcake cupcakes muffin muffins', stock: 30, descuento: 0, alta: 24, rango: 2,
    variantes: [{ id: 'x12', nombre: 'Pack x12', precio: 7900 }, { id: 'x24', nombre: 'Pack x24', precio: 14500 }], etiqueta: 'Presentación',
    img: 'images/p-toppers-cupcakes.webp', ancho: 1200, alto: 1200,
    alt: 'Seis toppers festoneados con estrellas en coral, verde y crema, sobre palitos de madera',
    galeria: [{ src: 'images/g-toppers.webp', ancho: 720, alto: 900, alt: 'Detalle de los toppers estrella en capas de cartulina' }],
    desc: 'Estrellas y círculos festoneados en capas de cartulina, para coronar cupcakes y muffins. Se puede sumar la inicial o la edad en el centro.',
    datos: [['Presentación', 'Pack de 12 o de 24'], ['Medida', '5 cm aprox.'], ['Material', 'Cartulina y palitos de madera']] },
  { id: 'toppers-flores-papel', nombre: 'Toppers de flores de papel en capas', cat: 'toppers', mom: ['torta', 'mesa'], tags: 'flores flor papel jardin primavera cupcake cupcakes', stock: 20, descuento: 0, alta: 31, rango: 3, tag: 'nuevo',
    variantes: [{ id: 'x6', nombre: 'Pack x6', precio: 8900 }, { id: 'x12', nombre: 'Pack x12', precio: 16500 }], etiqueta: 'Presentación',
    img: 'images/p-flores-papel.webp', ancho: 1200, alto: 1200,
    alt: 'Flores de papel coral con hojas verdes y círculos festoneados en rosa y crema, junto a palitos de madera',
    galeria: [{ src: 'images/g-flores.webp', ancho: 720, alto: 900, alt: 'Flores de papel en capas antes de armar los toppers' }],
    desc: 'Flores de papel armadas en capas con hojas verdes, sobre base festoneada y palito. Para la torta, los cupcakes o los frascos de la mesa dulce.',
    datos: [['Presentación', 'Pack de 6 o de 12'], ['Medida', '7 cm aprox.'], ['Material', 'Papel, cartulina y palitos de madera']] },
  { id: 'bolsitas-golosineras-manija', nombre: 'Bolsitas golosineras con manija y etiqueta', cat: 'bolsitas', mom: ['souvenir'], tags: 'manija etiqueta gracias hilo', stock: 40, descuento: 0, alta: 26, rango: 4,
    variantes: [{ id: 'x10', nombre: 'Pack x10', precio: 11900 }, { id: 'x20', nombre: 'Pack x20', precio: 22500 }], etiqueta: 'Presentación',
    img: 'images/p-bolsitas-manija.webp', ancho: 1200, alto: 1200,
    alt: 'Tres bolsitas de papel con manija troquelada en coral, crema y verde, con etiquetas festoneadas atadas con hilo',
    galeria: [{ src: 'images/g-bolsitas.webp', ancho: 720, alto: 900, alt: 'Detalle de la etiqueta festoneada atada con hilo a la bolsita' }],
    desc: 'Bolsitas de papel con manija troquelada y etiqueta festoneada atada con hilo. La etiqueta lleva el nombre del cumpleañero y un gracias.',
    datos: [['Presentación', 'Pack de 10 o de 20'], ['Colores', 'Coral, crema y verde, o los de tu temática'], ['Lleva', 'Etiqueta con nombre']] },
  { id: 'bolsitas-broche', nombre: 'Bolsitas de papel con broche y etiqueta redonda', cat: 'bolsitas', mom: ['souvenir', 'mesa'], tags: 'broche etiqueta redonda ramitas', stock: 40, descuento: 0, alta: 22, rango: 9,
    variantes: [{ id: 'x10', nombre: 'Pack x10', precio: 9900 }, { id: 'x20', nombre: 'Pack x20', precio: 18500 }], etiqueta: 'Presentación',
    img: 'images/p-bolsitas-broche.webp', ancho: 800, alto: 800,
    alt: 'Bolsitas de papel coral y verdes con borde festoneado, cerradas con broche de madera y etiqueta redonda',
    desc: 'Bolsitas con el borde festoneado, cerradas con broche de madera y etiqueta redonda con ramitas. Listas para llenar de golosinas.',
    datos: [['Presentación', 'Pack de 10 o de 20'], ['Cierre', 'Broche de madera'], ['Lleva', 'Etiqueta redonda con nombre']] },
  { id: 'chocolatines-personalizados', nombre: 'Chocolatines con envoltorio personalizado', cat: 'golosinas', mom: ['mesa', 'souvenir'], tags: 'chocolate chocolates chocolatin chocolatines lunares envoltorio fecha', stock: 50, descuento: 0, alta: 25, rango: 5,
    variantes: [{ id: 'x10', nombre: 'Pack x10', precio: 13500 }, { id: 'x20', nombre: 'Pack x20', precio: 25900 }], etiqueta: 'Presentación',
    img: 'images/p-chocolatines.webp', ancho: 1200, alto: 1200,
    alt: 'Cuatro chocolatines envueltos en papel coral y verde con lunares blancos y un marco crema para el nombre',
    galeria: [{ src: 'images/g-chocolatines.webp', ancho: 720, alto: 900, alt: 'Detalle del envoltorio de lunares con el marco para el nombre' }],
    desc: 'Chocolatines envueltos con papel de lunares en coral o verde y un marco para el nombre y la fecha. Van con el chocolatín incluido.',
    datos: [['Presentación', 'Pack de 10 o de 20'], ['Incluye', 'Chocolatín y envoltorio'], ['Lleva', 'Nombre y fecha']] },
  { id: 'tubos-golosinas-flor', nombre: 'Tubos de golosinas con flor de papel', cat: 'golosinas', mom: ['souvenir'], tags: 'tubo tubos confites caramelos flor', stock: 24, descuento: 10, alta: 27, rango: 7,
    variantes: [{ id: 'x6', nombre: 'Pack x6', precio: 15900 }, { id: 'x12', nombre: 'Pack x12', precio: 29500 }], etiqueta: 'Presentación',
    img: 'images/p-tubos-flor.webp', ancho: 1200, alto: 1200,
    alt: 'Cuatro tubos transparentes con confites rosas y blancos, tapa dorada, flor de papel coral y etiqueta redonda verde',
    galeria: [{ src: 'images/g-tubos.webp', ancho: 720, alto: 900, alt: 'Detalle de la flor de papel y la etiqueta del tubo' }],
    desc: 'Tubos transparentes con confites, tapa dorada, flor de papel y etiqueta redonda para el nombre. Un souvenir que se llevan los invitados.',
    datos: [['Presentación', 'Pack de 6 o de 12'], ['Incluye', 'Tubo con confites'], ['Lleva', 'Etiqueta con nombre']] },
  { id: 'stickers-plancha', nombre: 'Plancha de stickers redondos personalizados', cat: 'stickers', mom: ['souvenir', 'deco'], tags: 'stickers plancha redondos flores ramitas lunares inicial', stock: 60, descuento: 0, alta: 23, rango: 8,
    variantes: [{ id: 'p1', nombre: '1 plancha', precio: 4500 }, { id: 'p3', nombre: '3 planchas', precio: 12000 }], etiqueta: 'Presentación',
    img: 'images/p-stickers.webp', ancho: 1200, alto: 1200,
    alt: 'Plancha de stickers redondos y festoneados con flores, ramitas y lunares en rosa y verde sobre una mesa de madera',
    galeria: [{ src: 'images/g-stickers.webp', ancho: 720, alto: 900, alt: 'Detalle de los stickers con flores y ramitas' }],
    desc: 'Plancha con 24 stickers redondos y festoneados: flores, ramitas, lunares y el nombre o la inicial que elijas. Para cerrar bolsitas y decorar.',
    datos: [['Presentación', '1 o 3 planchas'], ['Por plancha', '24 stickers'], ['Lleva', 'Nombre o inicial']] },
  { id: 'banderin-triangulos', nombre: 'Banderín de triángulos lisos y con lunares', cat: 'banderines', mom: ['deco'], tags: 'guirnalda triangulos lunares pared', stock: 18, descuento: 0, alta: 21, rango: 6,
    variantes: [{ id: '2m', nombre: '2 metros', precio: 8900 }, { id: '4m', nombre: '4 metros', precio: 15900 }], etiqueta: 'Largo',
    img: 'images/p-banderin.webp', ancho: 1200, alto: 1200,
    alt: 'Guirnalda de banderines coral, verdes y crema colgada en una pared clara sobre una mesa con vajilla',
    desc: 'Guirnalda de banderines en coral, verde y crema, con hilo de algodón. Para la pared de la mesa dulce o el respaldo de las sillas.',
    datos: [['Largo', '2 o 4 metros'], ['Colores', 'Coral, verde y crema, o los de tu temática'], ['Hilo', 'Algodón']] },
  { id: 'banderin-nombre', nombre: 'Banderín con nombre', cat: 'banderines', mom: ['deco'], tags: 'nombre letras edad guirnalda personalizado', stock: 20, descuento: 0, alta: 30, rango: 10, tag: 'nuevo',
    variantes: [{ id: 'h6', nombre: 'Hasta 6 banderines', precio: 10500 }, { id: 'h12', nombre: '7 a 13 banderines', precio: 15900 }], etiqueta: 'Largo',
    img: 'images/p-banderin-nombre.webp', ancho: 780, alto: 780,
    alt: 'Banderines de papel coral, verdes y crema colgados de un hilo sobre una pared clara',
    desc: 'Un banderín por letra, con el nombre y la edad en los colores que elijas. Cada banderín mide 15 cm de alto.',
    datos: [['Largo', 'Un banderín por letra y uno para la edad'], ['Medida', '15 cm por banderín'], ['Lleva', 'Nombre y edad']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tags || '', ETIQUETAS[p.cat] || '', nombreDe(CATEGORIAS, p.cat),
    ...(p.mom || []).map(m => `${ETIQUETAS[m] || ''} ${nombreDe(MOMENTOS, m)}`),
    ...(p.variantes || []).map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const base = p => (p.variantes?.length ? Math.min(...p.variantes.map(v => v.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(base(p) * (1 - p.descuento / 100)) : base(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), mom = lista(f.mom), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (mom.length && !mom.some(m => (p.mom || []).includes(m))) return false;
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
    const candidatos = ordenada(orden).filter(p => coincide(p, resto));
    let i = 0;
    if (cursor != null) {
      const k = candidatos.findIndex(p => p.id === cursor);
      i = k < 0 ? candidatos.length : k + 1;
    }
    const items = [];
    let leidas = 0, paginas = 0;
    if (!q || !String(q).trim()) {
      items.push(...candidatos.slice(i, i + lim));
      leidas = items.length;
      paginas = items.length ? 1 : 0;
      const hayMas = i + items.length < candidatos.length;
      return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null, leidas, paginas };
    }
    while (i < candidatos.length && items.length < lim) {
      const tanda = candidatos.slice(i, i + tope);
      leidas += tanda.length;
      paginas++;
      for (const p of tanda) {
        i++;
        if (coincideTexto(p, q)) { items.push(p); if (items.length === lim) break; }
      }
    }
    const lleno = items.length === lim && i < candidatos.length;
    return { items: items.map(copia), cursor: lleno ? items[items.length - 1].id : null, leidas, paginas };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const waLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const varianteDe = (p, v) => (p?.variantes || []).find(x => x.id === v) || p?.variantes?.[0] || null;
const precioBase = (p, v) => varianteDe(p, v)?.precio ?? p.precio;
const precioFinal = (p, v) => { const b = precioBase(p, v); return p.descuento > 0 ? Math.round(b * (1 - p.descuento / 100)) : b; };
const precioDesde = p => Math.min(...(p.variantes || [{ id: null }]).map(v => precioFinal(p, v.id)));
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const PERS_CLAVES = ['nombre', 'edad', 'tema', 'fecha', 'paleta'];
const limpiarPers = pers => {
  const o = {};
  PERS_CLAVES.forEach(k => { const v = String(pers?.[k] ?? '').trim().replace(/\s+/g, ' ').slice(0, 60); if (v) o[k] = v; });
  return o;
};
const claveLinea = (id, v, pers) => `${id}|${v || ''}|${JSON.stringify(limpiarPers(pers))}`;
const fechaCorta = f => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f || ''); return m ? `${m[3]}/${m[2]}` : f; };
const textoPers = pers => {
  const p = pers || {};
  const edad = p.edad ? (p.edad === '1' ? '1 año' : `${p.edad} años`) : '';
  return [p.nombre && `Para ${p.nombre}`, edad, p.tema, p.fecha && `Fiesta el ${fechaCorta(p.fecha)}`, p.paleta].filter(Boolean).join(' · ');
};

const Cart = {
  KEY: 'chuniarte_cart',
  get() {
    try {
      const a = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(a) ? a.filter(i => i && getProducto(i.id) && i.qty > 0).map(i => ({ ...i, k: claveLinea(i.id, i.v, i.pers) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  enOtras(items, id, k) { return items.filter(i => i.id === id && i.k !== k).reduce((s, i) => s + i.qty, 0); },
  add(producto, qty = 1, v = null, pers = {}) {
    const items = this.get();
    const vv = varianteDe(producto, v)?.id || '';
    const ps = limpiarPers(pers);
    const k = claveLinea(producto.id, vv, ps);
    const max = Math.max(1, (producto.stock ?? 99) - this.enOtras(items, producto.id, k));
    const ex = items.find(i => i.k === k);
    if (ex) ex.qty = Math.min(ex.qty + qty, max);
    else items.push({ k, id: producto.id, v: vv, qty: Math.min(qty, max), pers: ps });
    this.save(items);
  },
  setQty(idx, qty) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    const p = getProducto(it.id);
    it.qty = Math.max(1, Math.min(qty, (p?.stock ?? 99) - this.enOtras(items, it.id, it.k)));
    this.save(items);
  },
  editar(idx, v, pers) {
    const items = this.get(); const it = items[idx]; if (!it) return;
    const p = getProducto(it.id);
    const vv = varianteDe(p, v)?.id || it.v;
    const ps = limpiarPers(pers);
    const k = claveLinea(it.id, vv, ps);
    const otra = items.findIndex((i, n) => n !== idx && i.k === k);
    if (otra >= 0) { items[otra].qty += it.qty; items.splice(idx, 1); }
    else Object.assign(it, { k, v: vv, pers: ps });
    this.save(items);
  },
  remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
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

const svgIco = p => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  toppers: svgIco('<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
  bolsitas: svgIco('<path d="M5.5 8h13l-1.2 12.5H6.7z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>'),
  golosinas: svgIco('<path d="m9.5 7.5-2 2a4.95 4.95 0 1 0 7 7l2-2a4.95 4.95 0 1 0-7-7Z"/><path d="M14 6.5v10"/><path d="M10 7.5v10"/><path d="m16 7 1-5 1.4.7A3 3 0 0 0 19.7 3H21v1.3c0 .5.1.9.3 1.3L22 7l-5 1"/><path d="m8 17-1 5-1.4-.7A3 3 0 0 0 4.3 21H3v-1.3a3 3 0 0 0-.3-1.3L2 17l5-1"/>'),
  stickers: svgIco('<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/><path d="M8.5 13h.01M15.5 13h.01"/><path d="M10 16s.8 1 2 1 2-1 2-1"/>'),
  banderines: svgIco('<path d="M2 5q10 5 20 0"/><path d="M5 6.4 7 13l2-5.7"/><path d="M10.4 7.6 12 14.4l1.6-6.8"/><path d="M15 7.3l2 5.7 2-6.6"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
};
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p, v = null) {
  const desde = v == null && (p.variantes || []).length > 1;
  const fin = v == null ? precioDesde(p) : precioFinal(p, v);
  const orig = v == null ? Math.min(...p.variantes.map(x => x.precio)) : precioBase(p, v);
  return `<span class="precio${p.descuento > 0 ? ' precio--desc' : ''}">${desde ? '<small>Desde</small>' : ''}<b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(orig)}</s>` : ''}</span>`;
}

function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="card__badge card__badge--desc"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="${FEST}"/></svg><span>-${p.descuento}%</span></span>`;
  if (p.tag === 'nuevo') return `<span class="card__badge"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="${FEST}"/></svg><span>Nuevo</span></span>`;
  return '';
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card"${anim} data-card="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}">
      ${badgeHTML(p)}<span class="card__personaliza" aria-hidden="true">Personalizar</span>
    </button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)}</p>
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      ${precioHTML(p)}
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">Agregar</button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  const tag = hero.querySelector('.hero__tag');
  if (tag) tl.from(tag, { y: 30, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.05);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const heroImg = document.querySelector('.hero--vidriera [data-hero-img]');
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    gsap.to(heroImg, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.hero--vidriera', start: 'top top', end: 'bottom top', scrub: true } });
  }
  const costura = document.querySelector('.sello--costura svg');
  if (costura) {
    gsap.fromTo(costura, { rotate: -18 }, { rotate: 18, ease: 'none', scrollTrigger: { trigger: costura, start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1024px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
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
  const wrap = document.querySelector('[data-nav-cats]');
  if (!wrap) return;
  const btn = wrap.querySelector('.nav-cats__btn');
  const panel = wrap.querySelector('.nav-cats__panel');
  const ul = wrap.querySelector('[data-menu-cats]');
  const activa = PAGINA === 'catalogo' ? new URLSearchParams(location.search).get('cat') : null;
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><span class="nav-cats__ico">${ICO[c.id]}</span><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
  const mq = window.matchMedia('(min-width: 1024px)');
  const hover = window.matchMedia('(hover: hover)');
  let t = 0;
  const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  wrap.addEventListener('mouseenter', () => { if (mq.matches && hover.matches) abrir(); });
  wrap.addEventListener('mouseleave', () => { if (mq.matches && hover.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
  document.addEventListener('click', e => { if (mq.matches && !panel.hidden && !wrap.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && mq.matches) { cerrar(); btn.focus(); } });
  wrap.addEventListener('focusout', e => { if (mq.matches && e.relatedTarget && !wrap.contains(e.relatedTarget)) cerrar(); });
  mq.addEventListener('change', cerrar);
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

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
}
document.addEventListener('cart:updated', updateCartBadge);

const capas = new Set();
function abrirCapa(el, bd) {
  if (!el) return;
  el.hidden = false; if (bd) bd.hidden = false;
  void el.offsetWidth;
  el.classList.add('open'); bd?.classList.add('open');
  capas.add(el);
  document.body.classList.add('no-scroll');
}
function cerrarCapa(el, bd) {
  if (!el || !capas.has(el)) return;
  el.classList.remove('open'); bd?.classList.remove('open');
  capas.delete(el);
  if (!capas.size) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!el.classList.contains('open')) { el.hidden = true; if (bd) bd.hidden = true; } }, 400);
}
function atrapar(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

const Drawer = {
  el: null, bd: null, volver: null,
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el) return;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); this.open(); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const linea = e.target.closest('[data-idx]');
      const idx = linea ? Number(linea.dataset.idx) : -1;
      const paso = e.target.closest('[data-linea-paso]');
      if (paso && idx >= 0) { const it = Cart.get()[idx]; if (it) Cart.setQty(idx, it.qty + Number(paso.dataset.lineaPaso)); return; }
      if (e.target.closest('[data-quitar]') && idx >= 0) { Cart.remove(idx); showToast('Lo sacamos del carrito'); return; }
      const ed = e.target.closest('[data-editar]');
      if (ed && idx >= 0) { const it = Cart.get()[idx]; if (it) { this.close(true); Vista.open(it.id, { idx }); } return; }
      if (e.target.closest('[data-checkout]')) {
        showToast('¡Genial! El pago online se activa al pasar la web a producción.');
        return;
      }
      if (e.target.closest('[data-ir-tienda]')) { this.close(); }
    });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render(false));
    this.render(false);
  },
  render(animar) {
    if (!this.el) return;
    const cont = this.el.querySelector('[data-cart-lineas]');
    const foot = this.el.querySelector('[data-cart-foot]');
    const items = Cart.get();
    if (!items.length) {
      cont.innerHTML = `<div class="drawer__vacio"><span class="sello" aria-hidden="true"><svg viewBox="0 0 100 100"><path d="${FEST}"/></svg><span class="sello__txt"><b>0</b></span></span><h3>Tu carrito está vacío</h3><p>Elegí toppers, bolsitas o banderines y sumá los datos de tu fiesta.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ir a la tienda</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    cont.innerHTML = items.map((i, n) => {
      const p = getProducto(i.id); const v = varianteDe(p, i.v); const datos = textoPers(i.pers);
      const max = (p.stock ?? 99) - Cart.enOtras(items, i.id, i.k);
      return `<div class="linea${animar ? ' entra' : ''}" data-idx="${n}" style="--i:${n}">
        <div class="linea__foto"><img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt=""></div>
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          <p class="linea__meta">${esc(v?.nombre || '')} · ${formatearPrecio(precioFinal(p, i.v))} c/u</p>
          <p class="linea__pers">${datos ? esc(datos) : 'Sin datos para personalizar'}<button type="button" class="link-btn" data-editar>${datos ? 'Editar' : 'Completar datos'}</button></p>
          <div class="linea__abajo">
            <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
            <b>${formatearPrecio(precioFinal(p, i.v) * i.qty)}</b>
            <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
  },
  open() {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render(!reduceMotion);
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__head .icon-btn')?.focus(), 60);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null, idx: -1,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-modal-cuerpo]');
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quick]');
      if (q) { e.preventDefault(); this.open(q.dataset.quick); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const th = e.target.closest('[data-vr-thumb]');
      if (th) {
        const g = this.galeria()[Number(th.dataset.vrThumb)];
        const img = this.el.querySelector('[data-vr-img]');
        if (g && img) { img.src = g.src; img.alt = g.alt; img.width = g.ancho; img.height = g.alto; }
        this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === th)));
        return;
      }
      const paso = e.target.closest('[data-vr-paso]');
      if (paso) {
        const span = this.el.querySelector('[data-vr-cant]');
        const n = Math.max(1, Math.min((this.actual.stock ?? 99), Number(span.textContent) + Number(paso.dataset.vrPaso)));
        span.textContent = n;
        this.el.querySelector('[data-vr-paso="-1"]').disabled = n <= 1;
        this.el.querySelector('[data-vr-paso="1"]').disabled = n >= (this.actual.stock ?? 99);
        return;
      }
      if (e.target.closest('[data-vr-add]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vr-buy]')) { this.agregar(true); }
    });
    this.el.addEventListener('change', e => { if (e.target.name === 'vr-var') this.sync(); });
    this.el.addEventListener('input', e => { if (e.target.matches('[data-pers]')) this.sync(); });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
  },
  galeria() { const p = this.actual; return p ? [{ src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])] : []; },
  datos() {
    const v = this.el.querySelector('[name="vr-var"]:checked')?.value || null;
    const pers = {};
    this.el.querySelectorAll('[data-pers]').forEach(i => { pers[i.dataset.pers] = i.value; });
    return { v, pers };
  },
  sync() {
    const p = this.actual; if (!p) return;
    const { v, pers } = this.datos();
    this.el.querySelector('[data-vr-precio]').innerHTML = precioHTML(p, v);
    const vn = varianteDe(p, v)?.nombre || '';
    const extra = textoPers(limpiarPers(pers));
    this.el.querySelector('[data-vr-wsp]').href = waLink(`Hola Ceci! Quiero consultar por ${p.nombre} (${vn}).${extra ? ` Datos: ${extra}.` : ''}`);
  },
  html(p, it) {
    const vSel = it?.v || p.variantes[0].id;
    const pers = it?.pers || {};
    const gal = this.galeria();
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { mom: p.mom, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto"><img data-vr-img src="${gal[0].src}" width="${gal[0].ancho}" height="${gal[0].alto}" alt="${esc(gal[0].alt)}"></div>
        ${gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}"><img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio" data-vr-precio>${precioHTML(p, vSel)}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        <fieldset class="vr__grupo"><legend>${esc(p.etiqueta || 'Presentación')}</legend><div class="vr__variantes">${p.variantes.map(v => `<label class="opcion opcion--var"><input type="radio" name="vr-var" value="${v.id}"${v.id === vSel ? ' checked' : ''}><span>${esc(v.nombre)}</span><small>${formatearPrecio(precioFinal(p, v.id))}</small></label>`).join('')}</div></fieldset>
        <fieldset class="vr__grupo vr__pers"><legend>Personalizalo <small>(opcional: también lo podés pasar por WhatsApp)</small></legend>
          <div class="vr__campos">
            <div class="campo"><label for="vr-nombre">Nombre</label><input id="vr-nombre" data-pers="nombre" type="text" maxlength="14" value="${esc(pers.nombre || '')}" placeholder="Ej.: Martina" autocomplete="off"></div>
            <div class="campo"><label for="vr-edad">Edad</label><input id="vr-edad" data-pers="edad" type="text" inputmode="numeric" maxlength="3" value="${esc(pers.edad || '')}" placeholder="Ej.: 5" autocomplete="off"></div>
            <div class="campo campo--ancho"><label for="vr-tema">Temática o colores</label><input id="vr-tema" data-pers="tema" type="text" maxlength="40" value="${esc(pers.tema || '')}" placeholder="Ej.: jardín, coral y verde" autocomplete="off"></div>
            <div class="campo"><label for="vr-fecha">Fecha</label><input id="vr-fecha" data-pers="fecha" type="date" value="${esc(pers.fecha || '')}"></div>
          </div>
          ${pers.paleta ? `<input type="hidden" data-pers="paleta" value="${esc(pers.paleta)}">` : ''}
        </fieldset>
        <div class="vr__acciones">
          ${it ? '' : `<div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>`}
          <button type="button" class="btn btn--cta" data-vr-add>${it ? 'Guardar cambios' : 'Agregar al carrito'}</button>
          ${it ? '' : '<button type="button" class="btn btn--ink" data-vr-buy>Comprar ahora</button>'}
        </div>
        <a class="vr__wsp" data-vr-wsp href="${waLink(`Hola Ceci! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
        <dl class="vr__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span><b>${esc(r.nombre)}</b><small>Desde ${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  open(id, { idx = -1 } = {}) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.idx = idx;
    const it = idx >= 0 ? Cart.get()[idx] : null;
    this.cuerpo.innerHTML = this.html(p, it);
    this.el.setAttribute('aria-label', p.nombre);
    this.sync();
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(comprar) {
    const p = this.actual; if (!p) return;
    const { v, pers } = this.datos();
    if (this.idx >= 0) {
      Cart.editar(this.idx, v, pers);
      this.close();
      showToast('Guardamos los datos de tu pedido');
      return;
    }
    const n = Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1;
    Cart.add(p, n, v, pers);
    const nombre = limpiarPers(pers).nombre;
    if (comprar) { this.close(true); Drawer.open(); return; }
    showToast(`Sumaste ${p.nombre}${nombre ? ` para ${nombre}` : ''}`);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
    if (PAGINA === 'catalogo') { const u = new URL(location.href); if (u.searchParams.has('producto')) { u.searchParams.delete('producto'); history.replaceState(null, '', u); } }
  },
};

function initCardAcciones() {
  document.addEventListener('click', e => {
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-card]');
      const p = getProducto(card?.dataset.card);
      const span = st.querySelector('[data-cant]');
      const n = Math.max(1, Math.min(p?.stock ?? 99, Number(span.textContent) + Number(paso.dataset.paso)));
      span.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= (p?.stock ?? 99);
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.buy;
    const p = getProducto(id); if (!p) return;
    const card = add.closest('[data-card]');
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    Cart.add(p, n, p.variantes[0].id, {});
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const btn = card?.querySelector('[data-add]');
    if (btn) { btn.classList.add('ok'); btn.textContent = '¡Sumado!'; setTimeout(() => { btn.classList.remove('ok'); btn.textContent = 'Agregar'; }, 1400); }
    showToast(`Sumaste ${p.nombre} (${p.variantes[0].nombre}). Los datos los completás en el carrito.`);
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
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const res = Tienda.consultar({ orden: 'destacados', limite: MODELO === '2' ? 7 : 8 });
  cont.insertAdjacentHTML('afterbegin', res.items.map(p => cardHTML(p)).join(''));
}

function initPersonaliza() {
  const form = document.querySelector('[data-pz-form]');
  if (!form) return;
  const papel = document.querySelector('[data-pz-papel]');
  const bandera = document.querySelector('[data-pz-bandera]');
  const cont = document.querySelector('[data-pz-banderines]');
  const topper = document.querySelector('[data-pz-topper]');
  const tNombre = document.querySelector('[data-pz-tnombre]');
  const tNum = document.querySelector('[data-pz-tnum]');
  const nota = document.querySelector('[data-pz-nota]');
  const detalle = form.querySelector('[data-pz-detalle]');
  const precioEl = form.querySelector('[data-pz-precio]');
  const wsp = form.querySelector('[data-pz-wsp]');
  const nombreIn = form.querySelector('[data-pz-nombre]');
  const edadIn = form.querySelector('[data-pz-edad]');
  const error = form.querySelector('[data-pz-error]');
  let previos = null;
  const leer = () => ({
    pieza: form.querySelector('[name="pz-pieza"]:checked')?.value === 'topper' ? 'topper' : 'banderin',
    nombre: nombreIn.value.trim().replace(/\s+/g, ' ').slice(0, 12),
    edad: edadIn.value.replace(/\D/g, '').slice(0, 2),
    paleta: PALETAS[form.querySelector('[name="pz-paleta"]:checked')?.value] ? form.querySelector('[name="pz-paleta"]:checked').value : 'rosa',
  });
  const cantidad = d => d.nombre.replace(/\s/g, '').length + (d.edad ? 1 : 0);
  const productoDe = d => getProducto(d.pieza === 'topper' ? 'topper-torta-floral' : 'banderin-nombre');
  const varianteDatos = d => (d.pieza === 'topper' ? '20' : cantidad(d) <= 6 ? 'h6' : 'h12');
  const colgar = () => {
    const W = bandera.clientWidth;
    if (!W) return;
    const H = 60;
    cont.querySelectorAll('.pz-banderin').forEach(el => {
      const c = el.offsetLeft + el.offsetWidth / 2;
      const f = Math.min(1, Math.max(0, c / W));
      const y = (10 + 200 * f * (1 - f)) * (H / 120);
      const pendiente = (200 * (1 - 2 * f) / 1000) * (H / 120) * (1000 / W);
      el.style.setProperty('--y', `${(y - 2).toFixed(1)}px`);
      el.style.setProperty('--r', `${(Math.atan(pendiente) * 180 / Math.PI).toFixed(2)}deg`);
    });
  };
  function pintar() {
    const d = leer();
    const pal = PALETAS[d.paleta];
    papel.style.setProperty('--pa', pal.a);
    papel.style.setProperty('--pb', pal.b);
    papel.style.setProperty('--pc', pal.c);
    papel.style.setProperty('--pf', pal.f);
    bandera.hidden = d.pieza !== 'banderin';
    topper.hidden = d.pieza !== 'topper';
    const n = cantidad(d);
    if (d.pieza === 'banderin') {
      const letras = [...d.nombre.toUpperCase().replace(/\s/g, '')];
      if (d.edad) letras.push(d.edad);
      const mostrar = letras.length ? letras : ['T', 'U', ' ', 'N', 'O', 'M', 'B', 'R', 'E'].filter(x => x !== ' ');
      cont.innerHTML = mostrar.map((ch, i) => `<span class="pz-banderin${!reduceMotion && previos && previos[i] !== ch ? ' nuevo' : ''}"><span>${esc(ch)}</span></span>`).join('');
      previos = mostrar;
      colgar();
    } else {
      tNombre.textContent = d.nombre ? d.nombre.toUpperCase() : 'TU NOMBRE';
      topper.style.setProperty('--len', String(Math.max(5, (d.nombre || 'TU NOMBRE').length)));
      tNum.textContent = d.edad;
      tNum.hidden = !d.edad;
    }
    const p = productoDe(d);
    const v = varianteDatos(d);
    precioEl.textContent = formatearPrecio(precioFinal(p, v));
    const txt = d.pieza === 'topper' ? 'Topper para torta · 20 cm' : `Banderín con nombre · ${n || 0} ${n === 1 ? 'banderín' : 'banderines'}`;
    detalle.textContent = txt;
    nota.textContent = `${txt} · ${pal.nombre}`;
    wsp.href = waLink(`Hola Ceci! Quiero ${d.pieza === 'topper' ? 'un topper para torta' : 'un banderín'} con el nombre ${d.nombre || '(a definir)'}${d.edad ? ` y el número ${d.edad}` : ''}, en ${pal.nombre.toLowerCase()}.`);
  }
  form.addEventListener('input', e => {
    if (e.target === nombreIn && nombreIn.value.trim()) { error.hidden = true; nombreIn.removeAttribute('aria-invalid'); }
    if (e.target === edadIn) { const limpio = edadIn.value.replace(/\D/g, ''); if (limpio !== edadIn.value) edadIn.value = limpio; }
    pintar();
  });
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = leer();
    if (!d.nombre) { error.hidden = false; nombreIn.setAttribute('aria-invalid', 'true'); nombreIn.focus(); return; }
    const p = productoDe(d);
    Cart.add(p, 1, varianteDatos(d), { nombre: d.nombre, edad: d.edad, paleta: PALETAS[d.paleta].nombre });
    showToast(`Sumaste ${d.pieza === 'topper' ? 'el topper' : 'el banderín'} para ${d.nombre}`);
  });
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(colgar, 120); }, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(colgar);
  pintar();
}

const Lightbox = {
  el: null, items: [], k: 0, volver: null,
  init() {
    this.el = document.getElementById('lightbox');
    this.items = [...document.querySelectorAll('[data-trabajo]')];
    if (!this.el || !this.items.length) return;
    this.items.forEach(b => b.addEventListener('click', () => this.open(Number(b.dataset.trabajo))));
    this.el.querySelector('[data-lb-cerrar]').addEventListener('click', () => this.close());
    this.el.querySelector('[data-lb-prev]').addEventListener('click', () => this.ir(-1));
    this.el.querySelector('[data-lb-next]').addEventListener('click', () => this.ir(1));
    this.el.querySelector('[data-lb-tienda]').addEventListener('click', () => {
      const pid = this.items[this.k]?.dataset.producto;
      this.close(true);
      if (pid) Vista.open(pid);
    });
    this.el.addEventListener('click', e => { if (e.target === this.el) this.close(); });
    this.el.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.ir(-1);
      else if (e.key === 'ArrowRight') this.ir(1);
      else atrapar(this.el, e);
    });
  },
  pintar() {
    const b = this.items[this.k];
    const img = b.querySelector('img');
    const lbImg = this.el.querySelector('[data-lb-img]');
    lbImg.src = img.getAttribute('src');
    lbImg.alt = img.alt;
    this.el.querySelector('[data-lb-titulo]').textContent = b.querySelector('.trabajo__txt b')?.textContent || '';
    this.el.querySelector('[data-lb-nota]').textContent = b.querySelector('.trabajo__txt small')?.textContent || '';
  },
  open(k) {
    this.volver = document.activeElement;
    this.k = k;
    this.pintar();
    abrirCapa(this.el, null);
    setTimeout(() => this.el.querySelector('[data-lb-next]')?.focus(), 60);
  },
  ir(d) { this.k = (this.k + d + this.items.length) % this.items.length; this.pintar(); },
  close(sinFoco) {
    if (this.el.hidden) return;
    cerrarCapa(this.el, null);
    if (!sinFoco) this.volver?.focus?.();
  },
};

function initRail() {
  const rail = document.querySelector('[data-rail]');
  if (!rail) return;
  const vp = rail.querySelector('[data-rail-vp]');
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  let down = false, moved = false, startX = 0, startL = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startL = vp.scrollLeft; pointerId = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch { }
    }
    if (moved) { vp.scrollLeft = startL - dx; e.preventDefault(); }
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { }
    if (moved) setTimeout(() => vp.classList.remove('dragging'), 0);
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  vp.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  const paso = () => (track.querySelector('.rail__item')?.offsetWidth || 300) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const flechas = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 4) + 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const centro = [-34.6037, -58.3816];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true }).setView(centro, 11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  L.circle(centro, { radius: 6000, color: '#AD4B58', weight: 1, fillColor: '#FF9999', fillOpacity: 0.3 }).addTo(mapa);
  L.circleMarker(centro, { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#AD4B58', fillOpacity: 1 }).addTo(mapa).bindTooltip('CHUNI ARTE · Buenos Aires');
  setTimeout(() => mapa.invalidateSize(), 500);
  window.addEventListener('load', () => mapa.invalidateSize());
}

function initCatalogo() {
  const grid = document.querySelector('[data-grid]');
  if (!grid) return;
  const contador = document.querySelector('[data-contador]');
  const mostrando = document.querySelector('[data-mostrando]');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-vacio]');
  const qIn = document.getElementById('q');
  const ordenSel = document.querySelector('[data-orden]');
  const filtros = document.getElementById('filtros');
  const filtrosBd = document.querySelector('[data-filtros-bd]');
  const abrirBtn = document.querySelector('[data-abrir-filtros]');
  const nFiltros = document.querySelector('[data-filtros-n]');
  const limpiarTop = document.querySelector('[data-limpiar-top]');
  const miga = document.querySelector('[data-miga-cat]');
  const chips = [...document.querySelectorAll('[data-cat-chip]')];
  const params = new URLSearchParams(location.search);
  const valida = (lista, v) => lista.some(x => x.id === v);
  const e = {
    cat: (params.get('cat') || '').split(',').filter(v => valida(CATEGORIAS, v)),
    mom: (params.get('mom') || '').split(',').filter(v => valida(MOMENTOS, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'mom' && e.mom.length) f.mom = e.mom;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('mom', e.mom.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const pintarControles = () => {
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cat.includes(i.value); });
    document.querySelectorAll('input[data-f="mom"]').forEach(i => { i.checked = e.mom.includes(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => {
      const [g, v] = s.dataset.n.split(':');
      s.textContent = Tienda.contar({ ...filtrosDe(g), [g]: [v] });
    });
    const activos = e.cat.length + e.mom.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.mom.length + (e.precio ? 1 : 0);
    if (nFiltros) { nFiltros.textContent = enPanel; nFiltros.hidden = !enPanel; }
    if (limpiarTop) limpiarTop.hidden = !activos;
    if (miga) {
      const c = e.cat.length === 1 ? catDe(e.cat[0]) : null;
      miga.hidden = !c;
      miga.innerHTML = c ? `<span aria-current="page">${esc(c.nombre)}</span>` : '';
    }
    document.querySelectorAll('.nav-cats__list a').forEach(a => {
      const id = new URL(a.href).searchParams.get('cat');
      if (e.cat.length === 1 && id === e.cat[0]) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  function render(reiniciar) {
    const f = { ...filtrosDe(), q: e.q.trim() };
    if (reiniciar) { cursor = null; mostrados = 0; grid.innerHTML = ''; }
    const res = Tienda.consultar({ filtros: f, orden: e.orden, cursor, limite: POR_PAGINA });
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosDe());
    const q = e.q.trim();
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${total} ${total === 1 ? 'producto' : 'productos'}${e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : ''}`;
    vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    verMas.hidden = !cursor;
    mostrando.textContent = mostrados ? (q ? `Mostrando ${mostrados}${cursor ? ' · hay más resultados' : ''}` : `Mostrando ${mostrados} de ${total}`) : '';
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }
  const aplicar = () => { urlSync(); pintarControles(); render(true); };
  document.addEventListener('change', ev => {
    const i = ev.target.closest('input[data-f]');
    if (!i) return;
    const g = i.dataset.f;
    if (g === 'precio') e.precio = i.checked ? i.value : '';
    else e[g] = [...document.querySelectorAll(`input[data-f="${g}"]:checked`)].map(x => x.value);
    aplicar();
  });
  chips.forEach(c => c.addEventListener('click', () => { e.cat = c.dataset.catChip ? [c.dataset.catChip] : []; aplicar(); }));
  ordenSel?.addEventListener('change', () => { e.orden = valida(ORDENES, ordenSel.value) ? ordenSel.value : 'destacados'; aplicar(); });
  let tq = 0;
  qIn?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = qIn.value.slice(0, 60); aplicar(); }, 220); });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = qIn.value.slice(0, 60); aplicar(); qIn.blur(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    e.cat = []; e.mom = []; e.precio = ''; e.q = '';
    aplicar();
  }));
  verMas.addEventListener('click', () => render(false));
  const drawerMq = window.matchMedia(MODELO === '2' ? 'all' : '(max-width: 1024px)');
  const abrirFiltros = () => {
    if (!drawerMq.matches) return;
    abrirCapa(filtros, filtrosBd);
    abrirBtn?.setAttribute('aria-expanded', 'true');
    revelarNuevos(filtros);
    setTimeout(() => filtros.querySelector('.filtros__cerrar')?.focus(), 60);
  };
  const cerrarFiltros = () => {
    if (!filtros.classList.contains('open')) return;
    filtros.classList.remove('open'); filtrosBd?.classList.remove('open');
    capas.delete(filtros);
    if (!capas.size) document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!filtros.classList.contains('open') && filtrosBd) filtrosBd.hidden = true; }, 400);
    abrirBtn?.setAttribute('aria-expanded', 'false');
    abrirBtn?.focus();
  };
  abrirBtn?.addEventListener('click', abrirFiltros);
  filtros.querySelectorAll('[data-cerrar-filtros]').forEach(b => b.addEventListener('click', cerrarFiltros));
  filtrosBd?.addEventListener('click', cerrarFiltros);
  filtros.addEventListener('keydown', ev => { if (!filtros.classList.contains('open')) return; if (ev.key === 'Escape') cerrarFiltros(); else atrapar(filtros, ev); });
  drawerMq.addEventListener?.('change', () => { if (!drawerMq.matches) cerrarFiltros(); });
  pintarControles();
  render(true);
  urlSync();
  if (params.get('buscar') && qIn) setTimeout(() => qIn.focus(), 300);
}

function abrirProductoDeUrl() {
  const id = new URLSearchParams(location.search).get('producto');
  if (id && getProducto(id)) setTimeout(() => Vista.open(id), 350);
}

initMenuCategorias();
initDestacados();
initCatalogo();
initReveals();
initHeroMotion();
initParallax();
initNav();
initModelBarScroll();
Drawer.init();
Vista.init();
initCardAcciones();
initFloats();
updateCartBadge();
initPersonaliza();
Lightbox.init();
initRail();
initMapa();
abrirProductoDeUrl();
