const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493816536666';
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
  { id: 'banderines', nombre: 'Banderines', bajada: 'Guirnaldas con nombre y temática', color: 'rosa' },
  { id: 'vasos', nombre: 'Vasos', bajada: 'Packs de vasos con tu temática', color: 'menta' },
  { id: 'stickers', nombre: 'Stickers', bajada: 'Planchas con nombre y edad', color: 'lila' },
  { id: 'pinatas', nombre: 'Piñatas', bajada: 'Hechas a mano, con flecos', color: 'manteca' },
  { id: 'kits', nombre: 'Kits', bajada: 'Vasos, banderín y stickers juntos', color: 'cielo' },
];
const TEMAS = [
  { id: 'safari', nombre: 'Safari', color: 'menta' },
  { id: 'dinos', nombre: 'Dinosaurios', color: 'menta' },
  { id: 'mar', nombre: 'Fondo del mar', color: 'cielo' },
  { id: 'arcoiris', nombre: 'Arcoíris', color: 'lila' },
  { id: 'espacio', nombre: 'Espacio', color: 'cielo' },
  { id: 'bosque', nombre: 'Bosque', color: 'durazno' },
  { id: 'jardin', nombre: 'Jardín', color: 'rosa' },
  { id: 'estrellas', nombre: 'Estrellas', color: 'manteca' },
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
const ETIQUETAS = {
  banderines: 'banderin banderines guirnalda guirnaldas bandera banderita',
  vasos: 'vaso vasos descartables carton',
  stickers: 'sticker stickers calcomania calcomanias autoadhesivo etiqueta etiquetas plancha',
  pinatas: 'pinata pinatas piñata piñatas',
  kits: 'kit kits combo set completo',
  safari: 'safari selva leon jirafa animales', dinos: 'dino dinos dinosaurio dinosaurios', mar: 'mar oceano tortuga peces',
  arcoiris: 'arcoiris arco iris nubes unicornio', espacio: 'espacio cohete planetas astronauta galaxia', bosque: 'bosque zorro conejo oso animalitos',
  jardin: 'jardin flores floral primavera', estrellas: 'estrella estrellas dorada brillo',
};

const Tienda = crearTienda([
  { id: 'banderin-jardin-flores', nombre: 'Banderín Jardín con flores de papel', cat: 'banderines', tema: 'jardin', tags: 'rosa durazno lila cinta raso moños nombre letras', stock: 15, alta: 30, rango: 2,
    variantes: [{ id: 'b9', nombre: '9 banderines', precio: 9500 }, { id: 'b15', nombre: '15 banderines', precio: 14900 }], etiqueta: 'Largo',
    img: 'images/p-banderin-jardin.webp', ancho: 1200, alto: 1200,
    alt: 'Banderines de papel rosa, durazno y lila con florcitas, colgados en zigzag de una cinta rosa con moños',
    galeria: [{ src: 'images/g-banderin-jardin.webp', ancho: 720, alto: 1280, alt: 'El banderín Jardín completo, colgado de punta a punta' }],
    desc: 'Banderines en rosa, durazno y lila con florcitas de papel, unidos por una cinta de raso con moños en las puntas. Si querés, lleva una letra por banderín con el nombre.',
    datos: [['Largo', '9 o 15 banderines'], ['Colores', 'Rosa, durazno y lila, o los de tu temática'], ['Lleva', 'Nombre opcional, una letra por banderín']] },
  { id: 'vasos-safari', nombre: 'Vasos Safari con león y jirafa', cat: 'vasos', tema: 'safari', tags: 'leon jirafa hojas selva animales verde', stock: 40, alta: 26, rango: 1,
    variantes: [{ id: 'x10', nombre: 'Pack x10', precio: 8900 }, { id: 'x20', nombre: 'Pack x20', precio: 16500 }], etiqueta: 'Presentación',
    img: 'images/p-vasos-safari.webp', ancho: 900, alto: 900,
    alt: 'Vasos de cartón con un león y jirafas entre hojas verdes, sobre una mesa clara',
    galeria: [{ src: 'images/hero-safari.webp', ancho: 1600, alto: 900, alt: 'Cinco vasos Safari en fila, alternando el león y la jirafa' }],
    desc: 'Vasos de cartón con el león y la jirafa entre hojas de selva. Se puede sumar el nombre y la edad en una etiqueta al costado.',
    datos: [['Presentación', 'Pack de 10 o de 20'], ['Diseño', 'León y jirafa alternados'], ['Lleva', 'Nombre y edad opcionales']] },
  { id: 'stickers-dinos', nombre: 'Plancha de stickers Dinos', cat: 'stickers', tema: 'dinos', tags: 'dinosaurio verde torta regalo globos troquelados nombre edad', stock: 60, alta: 28, rango: 3,
    variantes: [{ id: 'p1', nombre: '1 plancha', precio: 3900 }, { id: 'p3', nombre: '3 planchas', precio: 10500 }], etiqueta: 'Presentación',
    img: 'images/p-stickers-dinos.webp', ancho: 1200, alto: 1200,
    alt: 'Plancha de doce stickers redondos con dinosaurios verdes festejando y tres stickers troquelados al costado',
    desc: 'Doce stickers redondos con dinos que festejan: con gorrito, con torta, con globos y saliendo del huevo. Llevan el nombre y la edad del cumpleañero.',
    datos: [['Por plancha', '12 stickers redondos'], ['Usos', 'Bolsitas, vasos, souvenirs'], ['Lleva', 'Nombre y edad']] },
  { id: 'pinata-arcoiris', nombre: 'Piñata Arcoíris con nubes', cat: 'pinatas', tema: 'arcoiris', tags: 'arcoiris nubes flecos tiras colores pastel', stock: 8, alta: 27, rango: 4,
    variantes: [{ id: 'm', nombre: 'Mediana', precio: 19900 }, { id: 'g', nombre: 'Grande', precio: 27900 }], etiqueta: 'Tamaño',
    img: 'images/p-pinata-arcoiris.webp', ancho: 1200, alto: 1200,
    alt: 'Piñata con forma de arcoíris en colores pastel, nubes blancas a los costados y tiras de papel colgando',
    desc: 'Arcoíris de flecos en rosa, durazno, amarillo, verde, celeste y lila, con dos nubes blancas y tiras para tirar. Hecha a mano, lista para llenar.',
    datos: [['Tamaño', 'Mediana o grande'], ['Terminación', 'Flecos de papel crepé'], ['Lleva', 'Nombre opcional en una nube']] },
  { id: 'banderin-espacial', nombre: 'Banderín Espacial con planetas y cohetes', cat: 'banderines', tema: 'espacio', tags: 'cohete planetas estrellas azul noche saturno tierra', stock: 15, alta: 24, rango: 5,
    variantes: [{ id: 'b9', nombre: '9 banderines', precio: 9500 }, { id: 'b15', nombre: '15 banderines', precio: 14900 }], etiqueta: 'Largo',
    img: 'images/p-banderin-espacial.webp', ancho: 1200, alto: 1200,
    alt: 'Banderines azul noche con planetas, estrellas y cohetes, colgados de una cinta azul',
    desc: 'Banderines azul noche con planetas, estrellitas y cohetes, colgados de una cinta azul. Ideal para la pared de la mesa dulce.',
    datos: [['Largo', '9 o 15 banderines'], ['Colores', 'Azul noche con planetas'], ['Lleva', 'Nombre opcional, una letra por banderín']] },
  { id: 'vasos-fondo-del-mar', nombre: 'Vasos Fondo del mar con tortugas', cat: 'vasos', tema: 'mar', tags: 'tortuga peces corales celeste agua', stock: 40, alta: 29, rango: 6,
    variantes: [{ id: 'x10', nombre: 'Pack x10', precio: 8900 }, { id: 'x20', nombre: 'Pack x20', precio: 16500 }], etiqueta: 'Presentación',
    img: 'images/p-vasos-mar.webp', ancho: 1200, alto: 1200,
    alt: 'Vasos celestes con tortugas, peces y corales, uno apilado sobre otros y uno acostado',
    desc: 'Vasos celestes con tortugas, pececitos y corales. Se puede sumar el nombre y la edad en una etiqueta al costado.',
    datos: [['Presentación', 'Pack de 10 o de 20'], ['Diseño', 'Tortugas, peces y corales'], ['Lleva', 'Nombre y edad opcionales']] },
  { id: 'stickers-bosque', nombre: 'Plancha de stickers Bosque', cat: 'stickers', tema: 'bosque', tags: 'zorro conejo oso acuarela animalitos gorrito nombre edad', stock: 60, alta: 25, rango: 7,
    variantes: [{ id: 'p1', nombre: '1 plancha', precio: 3900 }, { id: 'p3', nombre: '3 planchas', precio: 10500 }], etiqueta: 'Presentación',
    img: 'images/p-stickers-bosque.webp', ancho: 1200, alto: 1200,
    alt: 'Plancha de nueve stickers redondos en acuarela con un zorro, un conejo y un oso con gorritos de cumpleaños',
    desc: 'Nueve stickers redondos en acuarela: zorro, conejo y oso con gorritos, regalos y banderines. Llevan el nombre y la edad del cumpleañero.',
    datos: [['Por plancha', '9 stickers redondos'], ['Usos', 'Bolsitas, vasos, souvenirs'], ['Lleva', 'Nombre y edad']] },
  { id: 'pinata-estrella', nombre: 'Piñata Estrella dorada', cat: 'pinatas', tema: 'estrellas', tags: 'estrella amarilla dorada flecos borlas', stock: 8, alta: 23, rango: 8,
    variantes: [{ id: 'm', nombre: 'Mediana', precio: 18900 }, { id: 'g', nombre: 'Grande', precio: 25900 }], etiqueta: 'Tamaño',
    img: 'images/p-pinata-estrella.webp', ancho: 1200, alto: 1200,
    alt: 'Piñata con forma de estrella en flecos amarillos y crema, con estrellitas pegadas y tres borlas colgando',
    desc: 'Estrella de flecos amarillos y crema con estrellitas aplicadas y tres borlas abajo. Hecha a mano, lista para llenar de golosinas.',
    datos: [['Tamaño', 'Mediana o grande'], ['Terminación', 'Flecos y borlas de papel'], ['Lleva', 'Nombre opcional en el centro']] },
  { id: 'kit-arcoiris-nubes', nombre: 'Kit Arcoíris y nubes: vasos, banderín y stickers', cat: 'kits', tema: 'arcoiris', tags: 'kit combo nubes corazones pastel vasos banderin stickers', stock: 12, alta: 31, rango: 9, tag: 'nuevo',
    variantes: [{ id: 'k10', nombre: 'Para 10 chicos', precio: 22900 }, { id: 'k20', nombre: 'Para 20 chicos', precio: 39900 }], etiqueta: 'Presentación',
    img: 'images/p-kit-arcoiris.webp', ancho: 1200, alto: 1200,
    alt: 'Vasos con arcoíris y nubes, un banderín celeste con arcoíris y una plancha de stickers con nubes, corazones y estrellas',
    desc: 'La temática Arcoíris completa: vasos con nubes y arcoíris, un banderín al tono y planchas de stickers con nubes, corazones y estrellas.',
    datos: [['Para 10 chicos', '10 vasos, 1 banderín y 2 planchas'], ['Para 20 chicos', '20 vasos, 1 banderín y 4 planchas'], ['Lleva', 'Nombre y edad']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tags || '', ETIQUETAS[p.cat] || '', nombreDe(CATEGORIAS, p.cat),
    ETIQUETAS[p.tema] || '', nombreDe(TEMAS, p.tema),
    ...(p.variantes || []).map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const base = p => (p.variantes?.length ? Math.min(...p.variantes.map(v => v.precio)) : p.precio);
  const final = p => (p.descuento > 0 ? Math.round(base(p) * (1 - p.descuento / 100)) : base(p));
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tema = lista(f.tema), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tema.length && !tema.includes(p.tema)) return false;
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
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '', color: 'menta' };
const temaDe = id => TEMAS.find(t => t.id === id) || { nombre: '', color: 'menta' };
const PERS_CLAVES = ['nombre', 'edad', 'tema', 'fecha'];
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
  return [p.nombre && `Para ${p.nombre}`, edad, p.tema, p.fecha && `Cumple el ${fechaCorta(p.fecha)}`].filter(Boolean).join(' · ');
};

const Cart = {
  KEY: 'vycpapeleria_cart',
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
  banderines: svgIco('<path d="M2 5q10 5 20 0"/><path d="M5 6.4 7 13l2-5.7"/><path d="M10.4 7.6 12 14.4l1.6-6.8"/><path d="M15 7.3l2 5.7 2-6.6"/>'),
  vasos: svgIco('<path d="M6 4h12l-1.5 16h-9z"/><path d="M6.4 8.5h11.2"/>'),
  stickers: svgIco('<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/><path d="M8.5 13h.01M15.5 13h.01"/><path d="M10 16s.8 1 2 1 2-1 2-1"/>'),
  pinatas: svgIco('<path d="M12 2v3"/><path d="M12 5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"/><path d="M9 19.5v2.5M12 18.5V22M15 19.5v2.5"/>'),
  kits: svgIco('<path d="M3 8h18v4H3z"/><path d="M5 12v9h14v-9"/><path d="M12 8v13"/><path d="M12 8c-1.5-3-5-3.5-5-1.5S10 8 12 8zM12 8c1.5-3 5-3.5 5-1.5S14 8 12 8z"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  bolsa: svgIco('<path d="M5.5 8h13l-1.2 12.5H6.7z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/>'),
};
const CARRITO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>';
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p, v = null) {
  const desde = v == null && (p.variantes || []).length > 1;
  const fin = v == null ? precioDesde(p) : precioFinal(p, v);
  const orig = v == null ? Math.min(...p.variantes.map(x => x.precio)) : precioBase(p, v);
  return `<span class="precio${p.descuento > 0 ? ' precio--desc' : ''}">${desde ? '<small>Desde</small>' : ''}<b>${formatearPrecio(fin)}</b>${p.descuento > 0 ? `<s>${formatearPrecio(orig)}</s>` : ''}</span>`;
}

function cardHTML(p, animar = true) {
  const t = temaDe(p.tema);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="card"${anim} data-card="${p.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}">
      <span class="card__tema" style="--c:var(--${t.color})" aria-hidden="true">${esc(t.nombre)}</span>
      <span class="card__ver" aria-hidden="true">Personalizar</span>
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
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${CARRITO_SVG}<span>Agregar</span></button>
      </div>
      <button type="button" class="prod-buy" data-buy="${p.id}">Comprar ahora</button>
    </div>
  </article>`;
}

function vcardHTML(p, { grande = false, animar = true } = {}) {
  const t = temaDe(p.tema);
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  return `<article class="vcard${grande ? ' vcard--grande' : ''}"${anim} data-card="${p.id}">
    <button type="button" class="vcard__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(p.alt)}"></button>
    <div class="vcard__info">
      <span class="vcard__tema" style="--c:var(--${t.color})">${esc(t.nombre)}</span>
      <div class="vcard__txt"><h3 class="vcard__nombre">${esc(p.nombre)}</h3>${precioHTML(p)}</div>
      <button type="button" class="vcard__add" data-add="${p.id}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.bolsa}<span>Agregar</span></button>
    </div>
  </article>`;
}
const tarjetaHTML = (p, animar = true) => (MODELO === '2' ? vcardHTML(p, { animar }) : cardHTML(p, animar));

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
  const colgadas = hero.querySelectorAll('.colgada');
  if (colgadas.length) tl.from(colgadas, { y: -46, rotate: (i) => (i % 2 ? 14 : -14), opacity: 0, duration: 1.3, ease: 'back.out(1.6)', stagger: 0.08, clearProps: 'transform,opacity,rotate' }, 0.15);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero__dato'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity,scale' }, 0.65);
  const pild = document.querySelectorAll('.pildoras .pildora');
  if (pild.length) tl.from(pild, { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'back.out(1.7)', clearProps: 'transform,opacity' }, 0.75);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (!window.matchMedia('(min-width: 769px)').matches) return;
  const heroImg = document.querySelector('.hero--m1 [data-hero-img]');
  if (heroImg) gsap.to(heroImg, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero--m1', start: 'top top', end: 'bottom top', scrub: true } });
  document.querySelectorAll('.hero--m2 .colgada__marco').forEach((el, i) => {
    gsap.to(el, { y: (i % 2 ? 18 : 30), ease: 'none', scrollTrigger: { trigger: '.hero--m2', start: 'top top', end: 'bottom top', scrub: true } });
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
  ul.innerHTML = CATEGORIAS.map(c => `<li><a href="${CATALOGO_URL}?cat=${c.id}"${activa === c.id ? ' aria-current="page"' : ''}><span class="nav-cats__ico" style="--c:var(--${c.color})">${ICO[c.id]}</span><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><span class="nav-cats__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
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

function mensajePedido() {
  const items = Cart.get();
  if (!items.length) return 'Hola! Vi la web de VyC y quiero consultar por cotillón personalizado para un cumple.';
  const lineas = items.map(i => {
    const p = getProducto(i.id); const v = varianteDe(p, i.v); const d = textoPers(i.pers);
    return `- ${i.qty} x ${p.nombre} (${v?.nombre || ''})${d ? ` · ${d}` : ''}`;
  });
  return `Hola! Quiero hacer este pedido en VyC:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
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
      cont.innerHTML = `<div class="drawer__vacio"><span class="sello" aria-hidden="true">${SELLO_SVG}</span><h3>Tu carrito está vacío</h3><p>Elegí banderines, vasos, stickers o piñatas y sumá el nombre del cumpleañero.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda>Ir a la tienda</a></div>`;
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
          <p class="linea__pers">${esc([datos, i.pers?.nombre ? '' : 'Falta el nombre'].filter(Boolean).join(' · '))}<button type="button" class="link-btn" data-editar>${i.pers?.nombre ? 'Editar' : 'Completar datos'}</button></p>
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
    if (wsp) wsp.href = waLink(mensajePedido());
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

const SELLO_SVG = '<svg viewBox="0 0 140 140" aria-hidden="true"><circle class="sello__fondo" cx="70" cy="70" r="62"/><circle class="sello__aro" cx="70" cy="70" r="55"/><text class="sello__vyc" x="70" y="80" text-anchor="middle">V<tspan class="y">y</tspan>C</text></svg>';

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
    this.el.addEventListener('input', e => {
      if (e.target.matches('#vr-edad')) { const l = e.target.value.replace(/\D/g, '').slice(0, 2); if (l !== e.target.value) e.target.value = l; }
      if (e.target.matches('[data-pers]')) this.sync();
    });
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
    this.el.querySelector('[data-vr-wsp]').href = waLink(`Hola! Quiero consultar por ${p.nombre} (${vn}).${extra ? ` Datos: ${extra}.` : ''}`);
  },
  html(p, it) {
    const vSel = it?.v || p.variantes[0].id;
    const pers = it?.pers || { tema: temaDe(p.tema).nombre };
    const gal = this.galeria();
    let rel = Tienda.consultar({ filtros: { tema: p.tema, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto"><img data-vr-img src="${gal[0].src}" width="${gal[0].ancho}" height="${gal[0].alto}" alt="${esc(gal[0].alt)}"></div>
        ${gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}"><img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)} · ${esc(temaDe(p.tema).nombre)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <div class="vr__precio" data-vr-precio>${precioHTML(p, vSel)}</div>
        <p class="vr__desc">${esc(p.desc)}</p>
        <fieldset class="vr__grupo"><legend>${esc(p.etiqueta || 'Presentación')}</legend><div class="vr__variantes">${p.variantes.map(v => `<label class="opcion"><input type="radio" name="vr-var" value="${v.id}"${v.id === vSel ? ' checked' : ''}><span>${esc(v.nombre)}</span><small>${formatearPrecio(precioFinal(p, v.id))}</small></label>`).join('')}</div></fieldset>
        <fieldset class="vr__grupo"><legend>Personalizalo <small>(opcional: también lo podés pasar por WhatsApp)</small></legend>
          <div class="vr__campos">
            <div class="campo"><label for="vr-nombre">Nombre</label><input id="vr-nombre" data-pers="nombre" type="text" maxlength="14" value="${esc(pers.nombre || '')}" placeholder="Ej.: Benjamín" autocomplete="off"></div>
            <div class="campo"><label for="vr-edad">Edad</label><input id="vr-edad" data-pers="edad" type="text" inputmode="numeric" maxlength="2" value="${esc(pers.edad || '')}" placeholder="Ej.: 4" autocomplete="off"></div>
            <div class="campo"><label for="vr-tema">Temática</label><input id="vr-tema" data-pers="tema" type="text" maxlength="40" value="${esc(pers.tema || '')}" autocomplete="off"></div>
            <div class="campo"><label for="vr-fecha">Fecha del cumple</label><input id="vr-fecha" data-pers="fecha" type="date" value="${esc(pers.fecha || '')}"></div>
          </div>
        </fieldset>
        <div class="vr__acciones">
          ${it ? '' : `<div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>`}
          <button type="button" class="btn btn--cta" data-vr-add>${it ? 'Guardar cambios' : 'Agregar al carrito'}</button>
          ${it ? '' : '<button type="button" class="btn btn--ink" data-vr-buy>Comprar ahora</button>'}
        </div>
        <a class="vr__wsp" data-vr-wsp href="${waLink(`Hola! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
        <dl class="vr__datos">${(p.datos || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><h3>Combina con</h3><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><img src="${r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span><b>${esc(r.nombre)}</b><small>Desde ${formatearPrecio(precioDesde(r))}</small></span></button></li>`).join('')}</ul></div>` : ''}`;
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
    Cart.add(p, n, p.variantes[0].id, { tema: temaDe(p.tema).nombre });
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open(); return; }
    const etiqueta = add.querySelector('span') || add;
    add.classList.add('ok'); etiqueta.textContent = '¡Sumado!';
    setTimeout(() => { add.classList.remove('ok'); etiqueta.textContent = 'Agregar'; }, 1400);
    showToast(`Sumaste ${p.nombre} (${p.variantes[0].nombre}). El nombre lo completás en el carrito.`);
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
  const grid = document.querySelector('[data-destacados]');
  if (grid) {
    const res = Tienda.consultar({ orden: 'destacados', limite: 8 });
    grid.insertAdjacentHTML('afterbegin', res.items.map(p => cardHTML(p)).join(''));
  }
  const mosaico = document.querySelector('[data-mosaico]');
  if (mosaico) {
    const res = Tienda.consultar({ orden: 'destacados', limite: 8 });
    mosaico.insertAdjacentHTML('afterbegin', res.items.map((p, i) => vcardHTML(p, { grande: i === 0 })).join(''));
  }
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta]').forEach(el => {
    const [g, v] = el.dataset.cuenta.split(':');
    const n = Tienda.contar({ [g]: [v] });
    el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;
  });
}

const PZ = {
  dinos: { producto: 'stickers-dinos', nombre: 'Dinosaurios', fotos: [1, 2, 4, 6, 8, 12], prefijo: 'dinos', por: 12 },
  bosque: { producto: 'stickers-bosque', nombre: 'Bosque', fotos: [1, 2, 3, 5, 6, 9], prefijo: 'bosque', por: 9 },
};
const PZ_GIROS = [-5, 3, -2, 4, -4, 2];
function initPersonaliza() {
  const form = document.querySelector('[data-pz-form]');
  if (!form) return;
  const lista = document.querySelector('[data-pz-stickers]');
  const temaTxt = document.querySelector('[data-pz-tema-txt]');
  const nota = document.querySelector('[data-pz-nota]');
  const precioEl = form.querySelector('[data-pz-precio]');
  const wsp = form.querySelector('[data-pz-wsp]');
  const nombreIn = form.querySelector('[data-pz-nombre]');
  const edadIn = form.querySelector('[data-pz-edad]');
  const error = form.querySelector('[data-pz-error]');
  let temaPrevio = null;
  let previo = null;
  const leer = () => {
    const t = form.querySelector('[name="pz-tema"]:checked')?.value;
    const c = form.querySelector('[name="pz-cant"]:checked')?.value;
    return {
      tema: PZ[t] ? t : 'dinos',
      cant: c === 'p3' ? 'p3' : 'p1',
      nombre: nombreIn.value.trim().replace(/\s+/g, ' ').slice(0, 12),
      edad: edadIn.value.replace(/\D/g, '').slice(0, 2),
    };
  };
  function pintar() {
    const d = leer();
    const cfg = PZ[d.tema];
    const nombre = (d.nombre || 'Tu nombre').toUpperCase();
    const cambiaTema = temaPrevio !== d.tema;
    if (cambiaTema) {
      lista.innerHTML = cfg.fotos.map((n, i) => `<li class="pz-sticker" style="--r:${PZ_GIROS[i]}deg"><img src="images/s-${cfg.prefijo}-${String(n).padStart(2, '0')}.webp" width="240" height="240" alt=""><span class="pz-sticker__nombre"></span><span class="pz-sticker__edad" hidden></span></li>`).join('');
      temaPrevio = d.tema;
    }
    const clave = `${d.tema}|${nombre}|${d.edad}`;
    lista.querySelectorAll('.pz-sticker').forEach((li, i) => {
      const n = li.querySelector('.pz-sticker__nombre');
      const e = li.querySelector('.pz-sticker__edad');
      n.textContent = nombre;
      li.style.setProperty('--len', String(Math.max(5, nombre.length)));
      e.textContent = d.edad;
      e.hidden = !d.edad;
      if (!reduceMotion && previo !== null && previo !== clave) {
        li.classList.remove('pop'); void li.offsetWidth;
        li.style.animationDelay = `${i * 40}ms`;
        li.classList.add('pop');
      }
    });
    previo = clave;
    const p = getProducto(cfg.producto);
    temaTxt.textContent = cfg.nombre;
    nota.textContent = `Plancha ${cfg.nombre}: ${cfg.por} stickers redondos con el nombre${d.edad ? ' y la edad' : ''}. Acá ves 6.`;
    precioEl.textContent = formatearPrecio(precioFinal(p, d.cant));
    wsp.href = waLink(`Hola! Quiero ${d.cant === 'p3' ? '3 planchas' : '1 plancha'} de stickers ${cfg.nombre} con el nombre ${d.nombre || '(a definir)'}${d.edad ? ` y la edad ${d.edad}` : ''}.`);
  }
  form.addEventListener('input', e => {
    if (e.target === nombreIn && nombreIn.value.trim()) { error.hidden = true; nombreIn.removeAttribute('aria-invalid'); }
    if (e.target === edadIn) { const limpio = edadIn.value.replace(/\D/g, '').slice(0, 2); if (limpio !== edadIn.value) edadIn.value = limpio; }
    pintar();
  });
  form.addEventListener('change', pintar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = leer();
    if (!d.nombre) { error.hidden = false; nombreIn.setAttribute('aria-invalid', 'true'); nombreIn.focus(); return; }
    const p = getProducto(PZ[d.tema].producto);
    Cart.add(p, 1, d.cant, { nombre: d.nombre, edad: d.edad, tema: PZ[d.tema].nombre });
    showToast(`Sumaste la plancha ${PZ[d.tema].nombre} para ${d.nombre}`);
  });
  pintar();
}

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
  const paso = () => (track.querySelector('.rail__item')?.offsetWidth || 260) + 16;
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  const flechas = () => {
    if (!prev || !next) return;
    prev.disabled = vp.scrollLeft <= 2;
    next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();
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
    tema: (params.get('tema') || '').split(',').filter(v => valida(TEMAS, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'tema' && e.tema.length) f.tema = e.tema;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('tema', e.tema.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    history.replaceState(null, '', u);
  };
  const pintarControles = () => {
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cat.includes(i.value); });
    document.querySelectorAll('input[data-f="tema"]').forEach(i => { i.checked = e.tema.includes(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => {
      const [g, v] = s.dataset.n.split(':');
      s.textContent = Tienda.contar({ ...filtrosDe(g), [g]: [v] });
    });
    const activos = e.cat.length + e.tema.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.tema.length + (e.precio ? 1 : 0);
    if (nFiltros) { nFiltros.textContent = enPanel; nFiltros.hidden = !enPanel; }
    if (limpiarTop) limpiarTop.hidden = !activos;
    if (miga) {
      const c = e.cat.length === 1 ? catDe(e.cat[0]) : (e.tema.length === 1 && !e.cat.length ? temaDe(e.tema[0]) : null);
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
    grid.insertAdjacentHTML('beforeend', res.items.map(p => tarjetaHTML(p)).join(''));
    mostrados += res.items.length;
    cursor = res.cursor;
    const total = Tienda.contar(filtrosDe());
    const q = e.q.trim();
    const donde = e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : (e.tema.length === 1 ? ` <small>de ${esc(temaDe(e.tema[0]).nombre)}</small>` : '');
    if (q) contador.innerHTML = `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} <small>para «${esc(q)}»</small>`;
    else contador.innerHTML = `${total} ${total === 1 ? 'producto' : 'productos'}${donde}`;
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
    e.cat = []; e.tema = []; e.precio = ''; e.q = '';
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
initCuentas();
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
initRail();
abrirProductoDeUrl();
