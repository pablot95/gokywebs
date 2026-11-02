const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5492945403852';
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
  { id: 'deco', nombre: 'Deco y adornos', bajada: 'Lunas, estrellas y almohadones' },
  { id: 'portarretratos', nombre: 'Portarretratos', bajada: 'Marcos calados con tu foto o tu frase' },
  { id: 'souvenirs', nombre: 'Souvenirs', bajada: 'Mariposas y cajitas para tu evento' },
  { id: 'remeras', nombre: 'Remeras', bajada: 'Sublimadas o con vinilo textil' },
  { id: 'tazas', nombre: 'Tazas y vasos', bajada: 'Sublimadas o con vinilo' },
];
const TECNICAS = [
  { id: 'laser', nombre: 'Corte láser' },
  { id: 'vinilo', nombre: 'Vinilo' },
  { id: 'sublimado', nombre: 'Sublimado' },
];
const PRECIOS = [
  { id: 'hasta10', nombre: 'Hasta $10.000', min: null, max: 10000 },
  { id: '10a20', nombre: '$10.000 a $20.000', min: 10001, max: 20000 },
  { id: 'mas20', nombre: 'Más de $20.000', min: 20001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const LETRAS = [
  { id: 'cursiva', nombre: 'Cursiva' },
  { id: 'imprenta', nombre: 'Imprenta' },
  { id: 'moderna', nombre: 'Moderna' },
];
const TALLES = ['S', 'M', 'L', 'XL', 'XXL', 'Niños 8', 'Niños 10', 'Niños 12'];
const ETIQUETAS = {
  deco: 'deco decoracion adorno adornos habitacion repisa',
  portarretratos: 'portarretrato portarretratos portaretrato marco marcos foto',
  souvenirs: 'souvenir souvenirs recuerdo recuerdos evento cumpleanos comunion bautismo casamiento quince',
  remeras: 'remera remeras ropa estampa estampada',
  tazas: 'taza tazas vaso vasos mug',
  laser: 'laser corte calado calada madera grabado grabada',
  vinilo: 'vinilo vinilos vinil ploteo recortado',
  sublimado: 'sublimado sublimada sublimacion estampado color',
};

const Tienda = crearTienda([
  { id: 'portarretrato-geometrico', nombre: 'Portarretrato calado geométrico', cat: 'portarretratos', tec: ['laser'], tags: 'marco foto frase lamina triangulos regalo', stock: 12, descuento: 0, alta: 20, rango: 1,
    variantes: [{ id: '10x15', nombre: 'Para foto 10 × 15', precio: 17900 }, { id: '13x18', nombre: 'Para foto 13 × 18', precio: 21900 }], etiqueta: 'Medida',
    img: 'images/p-portarretrato.webp', ancho: 900, alto: 900,
    alt: 'Portarretrato de madera calado con triángulos en dos capas, sobre un escritorio claro con una planta',
    galeria: [{ src: 'images/marco-ancho.webp', ancho: 1600, alto: 900, alt: 'El portarretrato calado sobre la mesa, junto a una planta, un libro y un lapicero turquesa' }],
    colores: ['Tinta', 'Turquesa', 'Madera', 'Rosa viejo'], campos: ['texto', 'letra', 'color', 'nota'],
    desc: 'Marco de madera calado con láser, con triángulos en dos capas. Va con tu foto o con una lámina impresa con la frase, el nombre o la fecha que elijas.',
    datos: [['Material', 'Madera cortada con láser'], ['Medida', 'Para fotos de 10 × 15 o 13 × 18'], ['Lleva', 'Tu foto o una lámina con tu frase']] },
  { id: 'luna-estrella', nombre: 'Luna calada con estrella colgante', cat: 'deco', tec: ['laser'], tags: 'luna estrella estrellas bebe nacimiento habitacion nombre', stock: 10, descuento: 0, alta: 18, rango: 2,
    variantes: [{ id: '20', nombre: '20 cm de alto', precio: 15900 }, { id: '30', nombre: '30 cm de alto', precio: 21900 }], etiqueta: 'Alto',
    img: 'images/p-luna.webp', ancho: 900, alto: 900, imgAlta: 'images/luna-alta.webp',
    alt: 'Luna de madera calada con estrellitas y una estrella colgando de un hilo, sobre una base ovalada',
    galeria: [{ src: 'images/luna-alta.webp', ancho: 900, alto: 1600, alt: 'La luna calada entera, con su base, junto a un florero con flores blancas' }],
    colores: ['Grabado en la madera'], campos: ['texto', 'letra', 'nota'],
    desc: 'Luna calada con estrellitas y una estrella que cuelga de un hilo, sobre base de madera. El nombre va grabado en la estrella o en la base: un regalo de nacimiento que queda en la habitación.',
    datos: [['Material', 'Madera cortada con láser'], ['Alto', '20 o 30 cm'], ['Lleva', 'Nombre grabado en la estrella o en la base']] },
  { id: 'taza-floral', nombre: 'Taza sublimada acuarela floral', cat: 'tazas', tec: ['sublimado'], tags: 'taza flores acuarela desayuno regalo dia de la madre nombre frase magica', stock: 24, descuento: 0, alta: 16, rango: 3,
    variantes: [{ id: 'ceramica', nombre: 'Cerámica 325 cc', precio: 12900 }, { id: 'magica', nombre: 'Mágica 325 cc', precio: 16900 }], etiqueta: 'Modelo',
    img: 'images/p-taza.webp', ancho: 1000, alto: 1000,
    alt: 'Taza blanca sublimada con flores en acuarela celeste y rosa, sobre una tabla de madera',
    colores: ['Tinta', 'Turquesa', 'Rosa viejo'], campos: ['texto', 'letra', 'color', 'nota'],
    desc: 'Taza de cerámica sublimada con flores en acuarela. Le sumamos un nombre o una frase en la letra que elijas; la mágica es negra y el diseño aparece con la bebida caliente.',
    datos: [['Material', 'Cerámica para sublimar'], ['Capacidad', '325 cc'], ['Lleva', 'Nombre o frase']] },
  { id: 'remera-triangulos', nombre: 'Remera estampada triángulos', cat: 'remeras', tec: ['sublimado', 'vinilo'], tags: 'remera triangulos geometrica acuarela talle algodon poliester espalda nombre', stock: 20, descuento: 0, alta: 15, rango: 4,
    variantes: [{ id: 'sublimada', nombre: 'Sublimada · poliéster blanco', precio: 18900 }, { id: 'vinilo', nombre: 'Vinilo textil · algodón', precio: 21900 }], etiqueta: 'Técnica',
    img: 'images/p-remera.webp', ancho: 1000, alto: 1000,
    alt: 'Remera blanca doblada con triángulos en acuarela turquesa y gris estampados en el frente',
    colores: ['Tinta', 'Turquesa', 'Blanco'], campos: ['talle', 'texto', 'letra', 'color', 'nota'],
    desc: 'Remera con triángulos en acuarela turquesa y gris. Sublimada sobre poliéster blanco, o en vinilo textil sobre algodón de cualquier color. Sumale un nombre o una frase en la espalda.',
    datos: [['Talles', 'S a XXL y de niños'], ['Técnica', 'Sublimado o vinilo textil'], ['Lleva', 'Nombre o frase en la espalda']] },
  { id: 'vaso-hojas', nombre: 'Vaso de vidrio con vinilo de hojas', cat: 'tazas', tec: ['vinilo'], tags: 'vaso vidrio hojas ramas nombre souvenir cocina set', stock: 30, descuento: 0, alta: 19, rango: 5,
    variantes: [{ id: 'unidad', nombre: 'Unidad', precio: 8900 }, { id: 'set4', nombre: 'Set × 4', precio: 32900 }], etiqueta: 'Presentación',
    img: 'images/p-vaso.webp', ancho: 1000, alto: 1000,
    alt: 'Vaso de vidrio transparente con ramas de hojas en vinilo turquesa, sobre un mantel de lino',
    colores: ['Turquesa', 'Negro', 'Dorado', 'Rosa viejo'], campos: ['texto', 'letra', 'color', 'nota'],
    desc: 'Vaso de vidrio con ramas de hojas en vinilo turquesa. El nombre va arriba, cerca del borde, en el color que elijas: para regalar, para la cocina o como souvenir.',
    datos: [['Material', 'Vidrio y vinilo'], ['Presentación', 'Unidad o set de 4'], ['Lleva', 'Nombre cerca del borde']] },
  { id: 'caja-floral', nombre: 'Caja calada con flores', cat: 'souvenirs', tec: ['laser'], tags: 'caja cajita alhajero flores recuerdos iniciales quince', stock: 14, descuento: 0, alta: 21, rango: 6, tag: 'nuevo',
    variantes: [{ id: '10', nombre: '10 × 10 cm', precio: 16900 }, { id: '15', nombre: '15 × 15 cm', precio: 22900 }], etiqueta: 'Medida',
    img: 'images/p-caja.webp', ancho: 1000, alto: 1000,
    alt: 'Caja de madera con la tapa calada en flores y uniones encastradas, junto a una cinta turquesa',
    colores: ['Grabado en la madera'], campos: ['texto', 'letra', 'nota'],
    desc: 'Caja de madera con la tapa calada en flores y uniones encastradas. El nombre o las iniciales van grabados en el frente: alhajero, cajita de recuerdos o souvenir de quince.',
    datos: [['Material', 'Madera cortada con láser'], ['Medida', '10 × 10 o 15 × 15 cm'], ['Lleva', 'Nombre o iniciales en el frente']] },
  { id: 'mariposa-calada', nombre: 'Mariposa calada con base', cat: 'souvenirs', tec: ['laser'], tags: 'mariposa souvenir evento cumpleanos comunion bautismo pack centro de mesa', stock: 200, descuento: 0, alta: 17, rango: 7,
    variantes: [{ id: 'unidad', nombre: 'Unidad (12 cm)', precio: 5900 }, { id: 'x10', nombre: 'Pack × 10', precio: 52900 }, { id: 'x20', nombre: 'Pack × 20', precio: 99900 }], etiqueta: 'Presentación',
    img: 'images/p-mariposa.webp', ancho: 1000, alto: 1000,
    alt: 'Mariposa de madera calada parada sobre una base redonda, en una mesa clara con flores blancas',
    colores: ['Grabado en la madera'], campos: ['texto', 'letra', 'nota'],
    desc: 'Mariposa calada sobre una base redonda, para las mesas de un evento o como souvenir. En el pack, todas llevan el mismo nombre y la fecha grabados en la base.',
    datos: [['Material', 'Madera cortada con láser'], ['Alto', '12 cm'], ['Lleva', 'Nombre y fecha en la base']] },
  { id: 'almohadon-hojas', nombre: 'Almohadón sublimado hojas en acuarela', cat: 'deco', tec: ['sublimado'], tags: 'almohadon funda hojas eucalipto acuarela sillon frase nombre', stock: 16, descuento: 0, alta: 14, rango: 8,
    variantes: [{ id: 'relleno', nombre: 'Con relleno 40 × 40', precio: 19900 }, { id: 'funda', nombre: 'Solo funda 40 × 40', precio: 14900 }], etiqueta: 'Presentación',
    img: 'images/p-almohadon.webp', ancho: 1000, alto: 1000,
    alt: 'Almohadón blanco sublimado con hojas de eucalipto en acuarela verde y azul, sobre un sillón claro',
    colores: ['Tinta', 'Turquesa', 'Rosa viejo'], campos: ['texto', 'letra', 'color', 'nota'],
    desc: 'Almohadón con hojas de eucalipto en acuarela, sublimado de un lado. Podés sumar un nombre o una frase corta sobre el diseño.',
    datos: [['Medida', '40 × 40 cm'], ['Técnica', 'Sublimado de un lado'], ['Lleva', 'Nombre o frase corta']] },
  { id: 'adorno-estrellas', nombre: 'Adorno de estrellas con pie', cat: 'deco', tec: ['laser'], tags: 'estrellas estrella circulo repisa mesa de luz habitacion nombre', stock: 8, descuento: 10, alta: 13, rango: 9,
    variantes: [{ id: '25', nombre: '25 cm de alto', precio: 13900 }], etiqueta: 'Alto',
    img: 'images/p-estrellas.webp', ancho: 1000, alto: 1000,
    alt: 'Círculo de madera calado con estrellas, sobre un pie con base redonda',
    colores: ['Grabado en la madera'], campos: ['texto', 'letra', 'nota'],
    desc: 'Círculo calado con estrellas sobre pie de madera. Queda lindo en una repisa o en la mesa de luz; el nombre va grabado en la base.',
    datos: [['Material', 'Madera cortada con láser'], ['Alto', '25 cm'], ['Lleva', 'Nombre en la base']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tags || '', ETIQUETAS[p.cat] || '', nombreDe(CATEGORIAS, p.cat),
    ...(p.tec || []).map(t => `${ETIQUETAS[t] || ''} ${nombreDe(TECNICAS, t)}`),
    ...(p.variantes || []).map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const base = p => (p.variantes?.length ? Math.min(...p.variantes.map(v => v.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(base(p) * (1 - p.descuento / 100)) : base(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tec = lista(f.tec), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tec.length && !tec.some(t => (p.tec || []).includes(t))) return false;
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
const tecTexto = p => (p.tec || []).map(t => TECNICAS.find(x => x.id === t)?.nombre).filter(Boolean).join(' · ');
const PERS_CLAVES = ['texto', 'letra', 'color', 'talle', 'nota'];
const limpiarPers = pers => {
  const o = {};
  PERS_CLAVES.forEach(k => { const v = String(pers?.[k] ?? '').trim().replace(/\s+/g, ' ').slice(0, 60); if (v) o[k] = v; });
  return o;
};
const claveLinea = (id, v, pers) => `${id}|${v || ''}|${JSON.stringify(limpiarPers(pers))}`;
const textoPers = pers => {
  const p = pers || {};
  return [p.texto && `«${p.texto}»`, p.letra && `letra ${p.letra.toLowerCase()}`, p.color, p.talle && `talle ${p.talle}`, p.nota].filter(Boolean).join(' · ');
};

const Cart = {
  KEY: 'todovinilosmr_cart',
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
  deco: svgIco('<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>'),
  portarretratos: svgIco('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),
  souvenirs: svgIco('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 11 5 12 8c1-3 2.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
  remeras: svgIco('<path d="M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.2a1 1 0 0 0 1-.8l.5-3.5a2 2 0 0 0-1.3-2.2z"/>'),
  tazas: svgIco('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M6 2v2M10 2v2M14 2v2"/>'),
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
  if (p.descuento > 0) return `<span class="card__badge card__badge--desc">-${p.descuento}%</span>`;
  if (p.tag === 'nuevo') return '<span class="card__badge">Nuevo</span>';
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
      <p class="card__tec">${esc(tecTexto(p))}</p>
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

function tileHTML(p, alta = false) {
  const src = alta && p.imgAlta ? p.imgAlta : p.img;
  const dims = alta && p.imgAlta ? 'width="900" height="1600"' : `width="${p.ancho}" height="${p.alto}"`;
  return `<article class="tile${alta ? ' tile--alta' : ''}" data-animate="subir" style="opacity:0;transform:translateY(48px)" data-card="${p.id}">
    <button type="button" class="tile__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${src}" ${dims} alt="${esc(p.alt)}"></button>
    ${badgeHTML(p)}
    <div class="tile__info"><p class="tile__tec">${esc(tecTexto(p))}</p><h3 class="tile__nombre">${esc(p.nombre)}</h3>${precioHTML(p)}</div>
    <button type="button" class="tile__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>
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
  const luna = hero.querySelector('.hero__luna');
  if (luna) tl.from(luna, { y: 60, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.15);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const foto = document.querySelector('.hero--partido .hero__foto img');
  if (foto && window.matchMedia('(min-width: 769px)').matches) {
    gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero--partido', start: 'top top', end: 'bottom top', scrub: true } });
  }
  document.querySelectorAll('.sello__giro').forEach(s => {
    gsap.fromTo(s, { rotate: -30 }, { rotate: 30, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
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
      cont.innerHTML = `<div class="drawer__vacio"><span class="drawer__marca" aria-hidden="true"></span><p class="drawer__vacio-titulo">Tu carrito está vacío</p><p>Elegí una pieza y contanos qué nombre o qué frase tiene que llevar.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ir a la tienda</a></div>`;
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
          <p class="linea__pers">${datos ? esc(datos) : 'Sin texto para personalizar'}<button type="button" class="link-btn" data-editar>${datos ? 'Editar' : 'Sumar texto'}</button></p>
          <div class="linea__abajo">
            <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
            <b>${formatearPrecio(precioFinal(p, i.v) * i.qty)}</b>
            <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    this.el.querySelector('[data-cart-total]').textContent = formatearPrecio(Cart.total());
    const wsp = this.el.querySelector('[data-cart-wsp]');
    if (wsp) {
      const lineas = items.map(i => { const p = getProducto(i.id); const d = textoPers(i.pers); return `• ${i.qty} × ${p.nombre} (${varianteDe(p, i.v)?.nombre || ''})${d ? ` — ${d}` : ''}`; });
      wsp.href = waLink(`Hola Mirian! Quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`);
    }
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
    this.el.addEventListener('change', e => { if (e.target.name === 'vr-var' || e.target.matches('[data-pers]')) this.sync(); });
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
    this.el.querySelector('[data-vr-wsp]').href = waLink(`Hola Mirian! Quiero consultar por ${p.nombre} (${vn}).${extra ? ` Personalización: ${extra}.` : ''}`);
  },
  campos(p, pers) {
    const sel = (id, nombre, opciones, valor, vacio) => `<div class="campo"><label for="${id}">${nombre}</label><select id="${id}" data-pers="${id.slice(3)}"><option value="">${vacio}</option>${opciones.map(o => `<option${o === valor ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
    const c = p.campos || [];
    const out = [];
    if (c.includes('talle')) out.push(sel('vr-talle', 'Talle', TALLES, pers.talle, 'Elegí el talle'));
    if (c.includes('texto')) out.push(`<div class="campo campo--ancho"><label for="vr-texto">Nombre, frase o fecha</label><input id="vr-texto" data-pers="texto" type="text" maxlength="40" value="${esc(pers.texto || '')}" placeholder="Ej.: Nuestro lugar feliz" autocomplete="off"></div>`);
    if (c.includes('letra')) out.push(sel('vr-letra', 'Letra', LETRAS.map(l => l.nombre), pers.letra, 'A elección'));
    if (c.includes('color') && (p.colores || []).length > 1) out.push(sel('vr-color', 'Color', p.colores, pers.color, 'A elección'));
    if (c.includes('nota')) out.push(`<div class="campo campo--ancho"><label for="vr-nota">Algo más que tengamos que saber</label><input id="vr-nota" data-pers="nota" type="text" maxlength="60" value="${esc(pers.nota || '')}" placeholder="Ej.: es para el 15 de marzo" autocomplete="off"></div>`);
    return out.join('');
  },
  html(p, it) {
    const vSel = it?.v || p.variantes[0].id;
    const pers = it?.pers || {};
    const gal = this.galeria();
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { tec: p.tec, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    const unico = (p.colores || []).length === 1 ? `<p class="vr__fijo">${esc(p.colores[0])}</p>` : '';
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto"><img data-vr-img src="${gal[0].src}" width="${gal[0].ancho}" height="${gal[0].alto}" alt="${esc(gal[0].alt)}"></div>
        ${gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}"><img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)} · ${esc(tecTexto(p))}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio" data-vr-precio>${precioHTML(p, vSel)}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        ${p.variantes.length > 1 ? `<fieldset class="vr__grupo"><legend>${esc(p.etiqueta || 'Presentación')}</legend><div class="vr__variantes">${p.variantes.map(v => `<label class="opcion opcion--var"><input type="radio" name="vr-var" value="${v.id}"${v.id === vSel ? ' checked' : ''}><span>${esc(v.nombre)}</span><small>${formatearPrecio(precioFinal(p, v.id))}</small></label>`).join('')}</div></fieldset>` : `<input type="hidden" name="vr-var" value="${p.variantes[0].id}">`}
        <fieldset class="vr__grupo vr__pers"><legend>Personalizalo <small>(opcional: también lo podés pasar por WhatsApp)</small></legend>
          ${unico}
          <div class="vr__campos">${this.campos(p, pers)}</div>
        </fieldset>
        <div class="vr__acciones">
          ${it ? '' : `<div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>`}
          <button type="button" class="btn btn--cta" data-vr-add>${it ? 'Guardar cambios' : 'Agregar al carrito'}</button>
          ${it ? '' : '<button type="button" class="btn btn--ink" data-vr-buy>Comprar ahora</button>'}
        </div>
        <a class="vr__wsp" data-vr-wsp href="${waLink(`Hola Mirian! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar o mandar una imagen por WhatsApp</a>
        <dl class="vr__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><p class="vr__rel-titulo">También te puede interesar</p><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span><b>${esc(r.nombre)}</b><small>${r.variantes.length > 1 ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
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
    const texto = limpiarPers(pers).texto;
    if (comprar) { this.close(true); Drawer.open(); return; }
    showToast(`Sumaste ${p.nombre}${texto ? ` con «${texto}»` : ''}`);
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
    if (btn?.classList.contains('prod-add')) { btn.classList.add('ok'); btn.textContent = '¡Sumado!'; setTimeout(() => { btn.classList.remove('ok'); btn.textContent = 'Agregar'; }, 1400); }
    else if (btn) { btn.classList.add('ok'); setTimeout(() => btn.classList.remove('ok'), 1400); }
    showToast(`Sumaste ${p.nombre} (${p.variantes[0].nombre}). El texto lo sumás desde el carrito.`);
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
  if (cont) {
    const res = Tienda.consultar({ orden: 'destacados', filtros: { excluir: ['portarretrato-geometrico'] }, limite: 8 });
    cont.insertAdjacentHTML('afterbegin', res.items.map(p => cardHTML(p)).join(''));
  }
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) {
    const alta = Tienda.obtener('luna-estrella');
    const resto = Tienda.consultar({ orden: 'destacados', filtros: { excluir: ['luna-estrella', 'portarretrato-geometrico'] }, limite: 6 }).items;
    mosaico.insertAdjacentHTML('afterbegin', (alta ? tileHTML(alta, true) : '') + resto.map(p => tileHTML(p)).join(''));
  }
}

const PIEZAS = [
  { id: 'marco', producto: 'portarretrato-geometrico', img: 'images/p-portarretrato.webp', ancho: 900, alto: 900,
    alt: 'Portarretrato calado con una lámina que muestra el texto que escribiste',
    caja: { l: 22, t: 30.5, w: 57, h: 33 }, zoom: 1, origen: '50% 50%', lineas: true, max: 40, def: 'Nuestro lugar feliz',
    colores: [['Tinta', '#1F2B2D'], ['Turquesa', '#13868C'], ['Madera', '#8A6236'], ['Rosa viejo', '#A85A6C']], modo: 'impreso' },
  { id: 'vaso', producto: 'vaso-hojas', img: 'images/p-vaso.webp', ancho: 1000, alto: 1000,
    alt: 'Vaso de vidrio con hojas en vinilo y el nombre que escribiste cerca del borde',
    caja: { l: 31, t: 22.6, w: 38, h: 5.6 }, zoom: 1.45, origen: '50% 26%', lineas: false, max: 16, def: 'Martina',
    colores: [['Turquesa', '#1FA4AA'], ['Negro', '#1E2224'], ['Dorado', '#A9843A'], ['Rosa viejo', '#C27286']], modo: 'vinilo' },
  { id: 'caja', producto: 'caja-floral', img: 'images/p-caja.webp', ancho: 1000, alto: 1000,
    alt: 'Caja calada con flores y el nombre que escribiste grabado en el frente',
    caja: { l: 16, t: 47.6, w: 40, h: 11, skew: 27 }, zoom: 1.2, origen: '36% 62%', lineas: false, max: 16, def: 'Lucía',
    colores: [['Grabado', '#5A381B']], modo: 'grabado' },
];

function initPersonaliza() {
  const form = document.querySelector('[data-pz-form]');
  if (!form) return;
  const lienzo = document.querySelector('[data-pz-lienzo]');
  const img = lienzo.querySelector('[data-pz-img]');
  const caja = lienzo.querySelector('[data-pz-caja]');
  const texto = lienzo.querySelector('[data-pz-texto]');
  const input = form.querySelector('#pz-texto');
  const cuenta = form.querySelector('[data-pz-cuenta]');
  const colores = form.querySelector('[data-pz-colores]');
  const resumen = form.querySelector('[data-pz-resumen]');
  const precio = form.querySelector('[data-pz-precio]');
  const wsp = form.querySelector('[data-pz-wsp]');
  let pieza = PIEZAS[0];
  let tocado = false;
  const estado = () => ({
    letra: form.querySelector('[name="pz-letra"]:checked')?.value || 'cursiva',
    color: form.querySelector('[name="pz-color"]:checked')?.value || pieza.colores[0][0],
  });
  const ajustar = () => {
    const W = caja.clientWidth, H = caja.clientHeight;
    if (!W || !H) return;
    let size = pieza.lineas ? Math.min(H * 0.36, W * 0.2) : H * 0.86;
    texto.style.fontSize = `${size}px`;
    let n = 0;
    while (n++ < 60 && size > 7 && (texto.scrollWidth > W + 1 || texto.scrollHeight > H + 1)) {
      size *= 0.94;
      texto.style.fontSize = `${size}px`;
    }
  };
  const cortar = () => {
    if (reduceMotion) return;
    texto.classList.remove('cortando');
    void texto.offsetWidth;
    texto.classList.add('cortando');
  };
  const pintarColores = () => {
    colores.querySelectorAll('.swatch').forEach(s => s.remove());
    const actual = form.querySelector('[name="pz-color"]:checked')?.value;
    const sigue = pieza.colores.some(c => c[0] === actual);
    colores.insertAdjacentHTML('beforeend', pieza.colores.map(([n, hex], i) => `<label class="swatch"><input type="radio" name="pz-color" value="${n}"${(sigue ? n === actual : i === 0) ? ' checked' : ''}><span class="swatch__punto" style="--sw:${hex}"></span><span class="swatch__nombre">${n}</span></label>`).join(''));
    colores.classList.toggle('pz__grupo--unico', pieza.colores.length === 1);
  };
  const pintar = () => {
    const { letra, color } = estado();
    const p = getProducto(pieza.producto);
    const valor = (input.value || '').trim() || pieza.def;
    texto.textContent = valor;
    texto.dataset.letra = letra;
    texto.dataset.modo = pieza.modo;
    texto.style.color = (pieza.colores.find(c => c[0] === color) || pieza.colores[0])[1];
    cuenta.textContent = `${input.value.length}/${pieza.max}`;
    ajustar();
    if (p) {
      const v = p.variantes[0];
      resumen.textContent = `${p.nombre} · ${v.nombre}`;
      precio.innerHTML = precioHTML(p, v.id);
      const ln = LETRAS.find(l => l.id === letra)?.nombre || '';
      wsp.href = waLink(`Hola Mirian! Quiero personalizar: ${p.nombre} (${v.nombre}) con el texto «${valor}», letra ${ln.toLowerCase()}${pieza.colores.length > 1 ? `, color ${color.toLowerCase()}` : ''}.`);
    }
  };
  const elegir = id => {
    pieza = PIEZAS.find(x => x.id === id) || PIEZAS[0];
    img.src = pieza.img; img.width = pieza.ancho; img.height = pieza.alto; img.alt = pieza.alt;
    lienzo.style.setProperty('--zoom', pieza.zoom);
    lienzo.style.setProperty('--origen', pieza.origen);
    const c = pieza.caja;
    caja.style.cssText = `left:${c.l}%;top:${c.t}%;width:${c.w}%;height:${c.h}%;--skew:${c.skew || 0}deg`;
    caja.classList.toggle('pz__caja--lineas', pieza.lineas);
    input.maxLength = pieza.max;
    if (!tocado) input.value = pieza.def;
    else if (input.value.length > pieza.max) input.value = input.value.slice(0, pieza.max);
    pintarColores();
    pintar();
    cortar();
  };
  form.addEventListener('change', e => {
    if (e.target.name === 'pz-pieza') elegir(e.target.value);
    else if (e.target.name === 'pz-letra' || e.target.name === 'pz-color') { pintar(); cortar(); }
  });
  input.addEventListener('input', () => { tocado = true; pintar(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const p = getProducto(pieza.producto);
    if (!p) return;
    const { letra, color } = estado();
    const valor = (input.value || '').trim() || pieza.def;
    Cart.add(p, 1, p.variantes[0].id, { texto: valor, letra: LETRAS.find(l => l.id === letra)?.nombre, color: pieza.colores.length > 1 ? color : '' });
    showToast(`Sumaste ${p.nombre} con «${valor}»`);
  });
  let t = 0;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(ajustar, 120); }, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(ajustar);
  elegir(form.querySelector('[name="pz-pieza"]:checked')?.value || 'marco');
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
    tec: (params.get('tec') || '').split(',').filter(v => valida(TECNICAS, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'tec' && e.tec.length) f.tec = e.tec;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('tec', e.tec.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const pintarControles = () => {
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cat.includes(i.value); });
    document.querySelectorAll('input[data-f="tec"]').forEach(i => { i.checked = e.tec.includes(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => {
      const [g, v] = s.dataset.n.split(':');
      s.textContent = Tienda.contar({ ...filtrosDe(g), [g]: [v] });
    });
    const activos = e.cat.length + e.tec.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.tec.length + (e.precio ? 1 : 0);
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
    e.cat = []; e.tec = []; e.precio = ''; e.q = '';
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
abrirProductoDeUrl();
