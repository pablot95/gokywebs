const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493442520835';
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
  { id: 'sombreros', nombre: 'Sombreros', palabra: 'Sombra', bajada: 'Paja, crochet y ala ancha' },
  { id: 'abanicos', nombre: 'Abanicos', palabra: 'Brisa', bajada: 'Tela y varillas de bambú' },
  { id: 'pareos', nombre: 'Pareos', palabra: 'Mar', bajada: 'Algodón liviano para la arena' },
  { id: 'panuelos', nombre: 'Pañuelos', palabra: 'Color', bajada: 'Símil seda y gasa estampada' },
];
const TONOS = [
  { id: 'natural', nombre: 'Natural y crudo' },
  { id: 'azules', nombre: 'Azules' },
  { id: 'verdes', nombre: 'Verdes' },
  { id: 'calidos', nombre: 'Coral y mostaza' },
];
const PRECIOS = [
  { id: 'hasta15', nombre: 'Hasta $15.000', min: null, max: 15000 },
  { id: '15a25', nombre: '$15.000 a $25.000', min: 15001, max: 25000 },
  { id: 'mas25', nombre: 'Más de $25.000', min: 25001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' }, { id: 'nuevos', nombre: 'Lo más nuevo' },
  { id: 'precio-asc', nombre: 'Menor precio' }, { id: 'precio-desc', nombre: 'Mayor precio' }, { id: 'nombre', nombre: 'Nombre A-Z' },
];
const ETIQUETAS = {
  sombreros: 'sombrero sombreros gorro paja capelina piluso ala sol',
  abanicos: 'abanico abanicos varillas bambu calor',
  pareos: 'pareo pareos lona playa toallon salida',
  panuelos: 'panuelo panuelos foulard bufanda estola',
  natural: 'natural crudo beige arena paja', azules: 'azul azules marino celeste', verdes: 'verde verdes petroleo salvia agua', calidos: 'coral naranja mostaza amarillo calido',
};

const Tienda = crearTienda([
  { id: 'sombrero-paja-cinta-lino', nombre: 'Sombrero de paja ala ancha con cinta de lino', cat: 'sombreros', tonos: ['natural'], tags: 'moño playa ciudad sombra', stock: 14, descuento: 0, alta: 30, rango: 1, tag: 'nuevo', guia: true, precio: 32900,
    img: 'images/sombrero-cinta.webp', ancho: 900, alto: 900,
    alt: 'Sombrero de paja natural de ala ancha con cinta de lino crudo y moño al costado, sobre una mesa de piedra al sol',
    galeria: [{ src: 'images/sombrero-vertical.webp', ancho: 900, alto: 1600, alt: 'El sombrero de paja con cinta de lino, de cuerpo entero bajo la luz de la tarde' }],
    desc: 'Paja natural de trama cerrada, ala ancha y cinta de lino crudo con moño al costado. Da sombra de verdad en la playa y queda bien en la ciudad.',
    datos: [['Ala', '10 cm'], ['Contorno', '56 a 58 cm, con cordón interno'], ['Material', 'Paja natural y cinta de lino']] },
  { id: 'abanico-tela-lisa', nombre: 'Abanico de tela lisa con varillas de bambú', cat: 'abanicos', tags: 'liso colores cartera regalo', stock: 40, descuento: 0, alta: 29, rango: 2, precio: 12900, etiqueta: 'Color',
    img: 'images/abanico-petroleo.webp', ancho: 1200, alto: 1200,
    alt: 'Abanico abierto de tela lisa color petróleo con varillas de bambú caladas',
    variantes: [
      { id: 'petroleo', nombre: 'Petróleo', hex: '#125661', tono: 'verdes', img: 'images/abanico-petroleo.webp', alt: 'Abanico abierto de tela lisa color petróleo con varillas de bambú caladas' },
      { id: 'coral', nombre: 'Coral', hex: '#C7674C', tono: 'calidos', img: 'images/abanico-coral.webp', alt: 'Abanico abierto de tela lisa color coral con varillas de bambú caladas' },
      { id: 'marino', nombre: 'Azul marino', hex: '#22345C', tono: 'azules', img: 'images/abanico-marino.webp', alt: 'Abanico abierto de tela lisa azul marino con varillas de bambú caladas' },
      { id: 'mostaza', nombre: 'Mostaza', hex: '#D8A346', tono: 'calidos', img: 'images/abanico-mostaza.webp', alt: 'Abanico abierto de tela lisa color mostaza con varillas de bambú caladas' },
    ],
    desc: 'Tela de algodón lisa sobre varillas de bambú caladas. Abre y cierra suave, y cerrado entra en cualquier cartera.',
    datos: [['Largo cerrado', '23 cm'], ['Material', 'Algodón y bambú'], ['Colores', 'Petróleo, coral, azul marino y mostaza']] },
  { id: 'pareo-gasa-guarda-caracoles', nombre: 'Pareo de gasa cruda con guarda de caracoles', cat: 'pareos', tonos: ['natural', 'azules'], tags: 'caracoles guarda bordado playa vestido falda', stock: 12, descuento: 0, alta: 27, rango: 3, tag: 'nuevo', precio: 27900,
    img: 'images/pareo-guarda.webp', ancho: 900, alto: 900,
    alt: 'Pareo de gasa color crudo con guarda azul de caracoles en el borde, sobre tablas de madera clara',
    galeria: [{ src: 'images/portada-pareo.webp', ancho: 1600, alto: 900, alt: 'El pareo de gasa extendido entero, con la guarda de caracoles en los dos bordes' }],
    desc: 'Gasa de algodón liviana con guarda azul de caracoles en los dos bordes. Se ata como falda o vestido, o se usa de lona en la arena.',
    datos: [['Medida', '1,80 × 1,10 m'], ['Material', 'Gasa de algodón'], ['Cuidado', 'Lavado a mano en agua fría']] },
  { id: 'panuelo-simil-seda-hojas', nombre: 'Pañuelo símil seda estampado de hojas', cat: 'panuelos', tonos: ['azules', 'verdes'], tags: 'hojas estampado satinado cuello pelo cartera', stock: 16, descuento: 0, alta: 23, rango: 4, precio: 19900,
    img: 'images/panuelo-hojas.webp', ancho: 1200, alto: 1200,
    alt: 'Pañuelo cuadrado satinado con estampa de hojas azul petróleo y bordes azul marino, anudado sobre fondo claro',
    desc: 'Pañuelo cuadrado con estampa de hojas en petróleo y azul marino sobre crudo. Para el cuello, el pelo, la cartera o la cinta del sombrero.',
    datos: [['Medida', '90 × 90 cm'], ['Material', 'Símil seda (satén)'], ['Terminación', 'Bordes cosidos']] },
  { id: 'capelina-paja-cinta-marino', nombre: 'Capelina de paja con cinta azul marino', cat: 'sombreros', tonos: ['natural', 'azules'], tags: 'capelina ala ondulada casamiento playa pileta', stock: 8, descuento: 0, alta: 28, rango: 5, guia: true, precio: 38500,
    img: 'images/capelina-cinta.webp', ancho: 1200, alto: 1200,
    alt: 'Capelina de paja natural de ala ondulada con cinta azul marino anudada, sobre fondo claro',
    desc: 'Ala ancha y ondulada que enmarca la cara, con cinta azul marino anudada atrás. Para la playa, la pileta o un casamiento de día.',
    datos: [['Ala', '14 cm'], ['Contorno', '56 a 58 cm, con cordón interno'], ['Material', 'Paja natural y cinta de algodón']] },
  { id: 'abanico-lino-guarda', nombre: 'Abanico de lino crudo con guarda tejida', cat: 'abanicos', tonos: ['natural'], tags: 'lino guarda dorado regalo calado', stock: 20, descuento: 10, alta: 24, rango: 6, precio: 14500,
    img: 'images/abanico-lino.webp', ancho: 1200, alto: 1200,
    alt: 'Abanico de lino crudo con franjas tejidas en hilo dorado y varillas de bambú caladas, abierto sobre fondo arena',
    desc: 'Lino crudo con una guarda tejida en hilo dorado, sobre varillas de bambú caladas. Una pieza linda para regalar.',
    datos: [['Largo cerrado', '23 cm'], ['Material', 'Lino y bambú'], ['Color', 'Crudo con guarda dorada']] },
  { id: 'pareo-rayado-flecos', nombre: 'Pareo rayado de algodón con flecos', cat: 'pareos', tags: 'rayas rayado flecos lona playa hombros', stock: 30, descuento: 0, alta: 25, rango: 7, precio: 23900, etiqueta: 'Color',
    img: 'images/pareo-rayado-azul.webp', ancho: 1200, alto: 1200,
    alt: 'Pareo de algodón a rayas azules y blancas con flecos anudados, apoyado sobre fondo arena',
    variantes: [
      { id: 'azul', nombre: 'Azul', hex: '#6F8DC6', tono: 'azules', img: 'images/pareo-rayado-azul.webp', alt: 'Pareo de algodón a rayas azules y blancas con flecos anudados, apoyado sobre fondo arena' },
      { id: 'coral', nombre: 'Coral', hex: '#CF6F5E', tono: 'calidos', img: 'images/pareo-rayado-coral.webp', alt: 'Pareo de algodón a rayas coral y blancas con flecos anudados, apoyado sobre fondo arena' },
      { id: 'salvia', nombre: 'Verde salvia', hex: '#889F7C', tono: 'verdes', img: 'images/pareo-rayado-salvia.webp', alt: 'Pareo de algodón a rayas verde salvia y blancas con flecos anudados, apoyado sobre fondo arena' },
    ],
    desc: 'Algodón a rayas con flecos anudados en las puntas. Seca rápido y sirve de pareo, de lona o sobre los hombros a la noche.',
    datos: [['Medida', '1,70 × 1,00 m'], ['Material', 'Algodón'], ['Colores', 'Azul, coral y verde salvia']] },
  { id: 'piluso-crochet-rafia', nombre: 'Piluso de crochet de rafia con cinta de cuero', cat: 'sombreros', tonos: ['natural'], tags: 'piluso bucket crochet calado viaje plegable', stock: 18, descuento: 0, alta: 26, rango: 8, guia: true, precio: 24900,
    img: 'images/piluso-crochet.webp', ancho: 1200, alto: 1200,
    alt: 'Piluso de crochet de rafia color natural con tira fina de cuero en la copa, sobre fondo claro',
    desc: 'Tejido calado al crochet que deja pasar el aire, con una tira fina de cuero en la copa. Se dobla y entra en el bolso de viaje.',
    datos: [['Ala', '6 cm'], ['Contorno', '56 a 58 cm'], ['Material', 'Rafia de papel y cuero']] },
  { id: 'panuelo-gasa-flores', nombre: 'Pañuelo de gasa con flores coral', cat: 'panuelos', tonos: ['calidos'], tags: 'flores floral gasa liviano estola deshilachado', stock: 22, descuento: 0, alta: 22, rango: 9, precio: 16900,
    img: 'images/panuelo-flores.webp', ancho: 1200, alto: 1200,
    alt: 'Pañuelo de gasa con flores coral y hojas verdes, de bordes deshilachados, sobre fondo claro',
    desc: 'Gasa liviana y transparente con flores en coral y verde, de bordes deshilachados. Abriga apenas en las noches de verano.',
    datos: [['Medida', '180 × 70 cm'], ['Material', 'Gasa'], ['Terminación', 'Bordes deshilachados']] },
], { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false).map(p => {
    const variantes = p.variantes?.length ? p.variantes : [{ id: 'u', nombre: '', img: p.img, alt: p.alt, tono: (p.tonos || [])[0] || '' }];
    const tonos = [...new Set([...(p.tonos || []), ...variantes.map(v => v.tono).filter(Boolean)])];
    return { ...p, variantes, tonos };
  });
  const nombreDe = (lista, id) => (lista.find(x => x.id === id) || {}).nombre || '';
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.tags || '', ETIQUETAS[p.cat] || '', nombreDe(CATEGORIAS, p.cat),
    ...p.tonos.map(t => `${ETIQUETAS[t] || ''} ${nombreDe(TONOS, t)}`),
    ...p.variantes.map(v => v.nombre),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const final = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), tono = lista(f.tono), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tono.length && !tono.some(t => p.tonos.includes(t))) return false;
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
const precioFinal = p => (p.descuento > 0 ? Math.round(p.precio * (1 - p.descuento / 100)) : p.precio);
const varianteDe = (p, v) => (p?.variantes || []).find(x => x.id === v) || p?.variantes?.[0] || null;
const multi = p => (p?.variantes || []).length > 1;
const nombreCompleto = (p, v) => { const vv = varianteDe(p, v); return multi(p) && vv ? `${p.nombre} (${vv.nombre})` : p.nombre; };
const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) cacheProductos.set(id, Tienda.obtener(id));
  return cacheProductos.get(id);
};
const catDe = id => CATEGORIAS.find(c => c.id === id) || { nombre: '' };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };
const leer = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };

function crearLista(KEY, { conStock = true } = {}) {
  const max = (p, items, k) => (conStock ? Math.max(1, (p?.stock ?? 99) - items.filter(i => i.id === p.id && i.k !== k).reduce((s, i) => s + i.qty, 0)) : 999);
  return {
    KEY,
    get() {
      const a = leer(KEY, []);
      return Array.isArray(a) ? a.filter(i => i && getProducto(i.id) && i.qty > 0).map(i => ({ id: i.id, v: varianteDe(getProducto(i.id), i.v).id, qty: i.qty, k: `${i.id}|${varianteDe(getProducto(i.id), i.v).id}` })) : [];
    },
    save(items) {
      guardar(KEY, items.map(({ id, v, qty }) => ({ id, v, qty })));
      document.dispatchEvent(new CustomEvent('cart:updated'));
    },
    add(p, qty = 1, v = null) {
      const items = this.get();
      const vv = varianteDe(p, v).id;
      const k = `${p.id}|${vv}`;
      const tope = max(p, items, k);
      const ex = items.find(i => i.k === k);
      if (ex) ex.qty = Math.min(ex.qty + qty, tope);
      else items.push({ id: p.id, v: vv, qty: Math.min(qty, tope), k });
      this.save(items);
    },
    setQty(idx, qty) {
      const items = this.get(); const it = items[idx]; if (!it) return;
      it.qty = Math.max(1, Math.min(qty, max(getProducto(it.id), items, it.k)));
      this.save(items);
    },
    maxDe(idx) { const items = this.get(); const it = items[idx]; return it ? max(getProducto(it.id), items, it.k) : 1; },
    remove(idx) { const items = this.get(); items.splice(idx, 1); this.save(items); },
    clear() { this.save([]); },
    count() { return this.get().reduce((s, i) => s + i.qty, 0); },
    total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p) * i.qty : s; }, 0); },
  };
}
const Cart = crearLista('solana_cart');
const Consulta = crearLista('solana_mayor', { conStock: false });

const Modo = {
  KEY: 'solana_modo',
  actual: 'menor',
  init() {
    const url = new URLSearchParams(location.search).get('modo');
    let m = url === 'mayor' || url === 'menor' ? url : null;
    if (!m) { try { m = localStorage.getItem(this.KEY) === 'mayor' ? 'mayor' : 'menor'; } catch { m = 'menor'; } }
    this.aplicar(m, false);
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-modo]');
      if (b && b.closest('.modo')) { this.aplicar(b.dataset.modo, true); return; }
      if (e.target.closest('[data-modo-toggle]')) this.aplicar(this.actual === 'mayor' ? 'menor' : 'mayor', true);
    });
  },
  aplicar(m, avisar) {
    const cambio = m !== this.actual;
    this.actual = m === 'mayor' ? 'mayor' : 'menor';
    try { localStorage.setItem(this.KEY, this.actual); } catch { }
    document.body.classList.toggle('modo-mayor', this.actual === 'mayor');
    document.querySelectorAll('.modo [data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === this.actual)));
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.delete('modo'); history.replaceState(null, '', u); }
    updateCartBadge();
    if (cambio) document.dispatchEvent(new CustomEvent('modo:cambio'));
    if (avisar && cambio) showToast(this.actual === 'mayor' ? 'Estás en modo por mayor: sumá cantidades y pedí la lista de precios.' : 'Volviste a la compra por menor, con precios y carrito.');
  },
  lista() { return this.actual === 'mayor' ? Consulta : Cart; },
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
  sombreros: svgIco('<path d="M3 15.5c0 1.7 4 3 9 3s9-1.3 9-3"/><path d="M3 15.5c0-1 1.6-1.9 4-2.5"/><path d="M21 15.5c0-1-1.6-1.9-4-2.5"/><path d="M7 13c0-4 2.2-7 5-7s5 3 5 7c-1.4.6-3.1 1-5 1s-3.6-.4-5-1z"/>'),
  abanicos: svgIco('<path d="M12 19 3.5 9.5a12 12 0 0 1 17 0z"/><path d="M12 19 8.5 6.3M12 19V6M12 19l3.5-12.7"/>'),
  pareos: svgIco('<path d="M4 6h16v12H4z"/><path d="M4 10h16M4 14h16"/><path d="M6 18v2M10 18v2M14 18v2M18 18v2"/>'),
  panuelos: svgIco('<path d="M4 4h16v16z"/><path d="M4 4l8 8"/><path d="M12 12l-3 6M12 12l6-3"/>'),
  menos: svgIco('<path d="M5 12h14"/>'),
  mas: svgIco('<path d="M12 5v14M5 12h14"/>'),
  quitar: svgIco('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  flecha: svgIco('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  regla: svgIco('<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>'),
  bolsa: svgIco('<path d="M6 7h12l1 13H5z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/><path d="M12 12v5M9.5 14.5h5"/>').replace('class="ico"', 'class="ico prod-add__ico"'),
};
const WSP_GLYPH = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>';

function precioHTML(p) {
  return `<span class="precio${p.descuento > 0 ? ' precio--desc' : ''}"><b>${formatearPrecio(precioFinal(p))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(p.precio)}</s>` : ''}</span>`;
}
function precioDoble(p) {
  return `<span class="t-menor">${precioHTML(p)}</span><span class="t-mayor precio-mayor">Por mayor · <b>precio a consultar</b></span>`;
}
function badgeHTML(p) {
  if (p.descuento > 0) return `<span class="card__badge card__badge--desc">-${p.descuento}%</span>`;
  if (p.tag === 'nuevo') return '<span class="card__badge">Nuevo</span>';
  return '';
}
function swatchesHTML(p, vSel, cls = 'swatches') {
  if (!multi(p)) return '';
  return `<div class="${cls}" role="group" aria-label="Color">${p.variantes.map(v => `<button type="button" class="sw" data-sw="${v.id}" aria-pressed="${v.id === vSel}" aria-label="${esc(v.nombre)}" style="--sw:${v.hex}"><span class="sw__dot" aria-hidden="true"></span></button>`).join('')}<span class="swatches__n">${p.variantes.length} colores</span></div>`;
}

function cardHTML(p, animar = true, grande = false) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const v0 = p.variantes[0];
  const alta = grande && !multi(p) ? (p.galeria || []).find(g => g.alto > g.ancho) : null;
  const imgTag = `<img src="${v0.img || p.img}" width="${p.ancho}" height="${p.alto}" alt="${esc(v0.alt || p.alt)}" data-card-img>`;
  const foto = alta ? `<picture><source media="(min-width: 900px)" srcset="${alta.src}" width="${alta.ancho}" height="${alta.alto}">${imgTag}</picture>` : imgTag;
  return `<article class="card card--m${MODELO}"${anim} data-card="${p.id}" data-v="${v0.id}">
    <button type="button" class="card__foto" data-quick="${p.id}" aria-label="Ver ${esc(p.nombre)}">
      ${foto}
      ${badgeHTML(p)}<span class="card__ver" aria-hidden="true">Ver detalle</span>${multi(p) ? `<span class="card__colores" aria-hidden="true">${p.variantes.map(v => `<i style="--sw:${v.hex}"></i>`).join('')}</span>` : ''}
    </button>
    <div class="card__info">
      <p class="card__cat">${esc(catDe(p.cat).nombre)}</p>
      <h3 class="card__titulo"><button type="button" class="card__nombre" data-quick="${p.id}">${esc(p.nombre)}</button></h3>
      <p class="card__precio">${precioDoble(p)}</p>
      ${swatchesHTML(p, v0.id)}
      <div class="prod-actions">
        <div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button>
          <span data-cant>1</span>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button>
        </div>
        <button type="button" class="btn btn--cta prod-add" data-add="${p.id}">${ICO.bolsa}<span class="t-menor"><span class="prod-add__txt">Agregar</span><span class="sr-only"> ${esc(p.nombre)} al carrito</span></span><span class="t-mayor"><span class="prod-add__txt">Sumar</span><span class="sr-only"> ${esc(p.nombre)} a la consulta por mayor</span></span></button>
      </div>
      <button type="button" class="prod-buy t-menor" data-buy="${p.id}">Comprar ahora</button>
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
  const arco = hero.querySelector('.hero__sombrero');
  if (arco) tl.from(arco, { y: 60, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.15);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
}

function initParallax() {
  if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const heroImg = document.querySelector('.hero--vidriera [data-hero-img]');
  if (heroImg && window.matchMedia('(min-width: 769px)').matches) {
    gsap.to(heroImg, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero--vidriera', start: 'top top', end: 'bottom top', scrub: true } });
  }
  document.querySelectorAll('.sello svg').forEach(svg => {
    gsap.fromTo(svg, { rotate: -24 }, { rotate: 24, ease: 'none', scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', scrub: true } });
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
  const n = Modo.lista().count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-tab-n]').forEach(s => { s.textContent = (s.dataset.tabN === 'mayor' ? Consulta : Cart).count(); });
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

const DATOS_MAYOR = 'solana_mayor_datos';
function mensajeMayor() {
  const items = Consulta.get();
  const d = leer(DATOS_MAYOR, {}) || {};
  const lineas = items.map(i => { const p = getProducto(i.id); return `• ${i.qty} × ${nombreCompleto(p, i.v)}`; });
  return ['Hola Solana! Quiero precios por mayor de:', ...lineas,
    d.comercio ? `Comercio: ${String(d.comercio).slice(0, 50)}` : '',
    d.localidad ? `Localidad: ${String(d.localidad).slice(0, 40)}` : ''].filter(Boolean).join('\n');
}

const Drawer = {
  el: null, bd: null, volver: null, tab: 'menor',
  init() {
    this.el = document.getElementById('carrito');
    this.bd = document.querySelector('[data-drawer-bd]');
    if (!this.el) return;
    document.addEventListener('click', e => {
      if (e.target.closest('[data-open-cart]')) { e.preventDefault(); this.open(); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-cart]')) { this.close(); return; }
      const tab = e.target.closest('[data-tab]');
      if (tab) { this.verTab(tab.dataset.tab, true); return; }
      const linea = e.target.closest('[data-idx]');
      const idx = linea ? Number(linea.dataset.idx) : -1;
      const lista = linea?.dataset.lista === 'mayor' ? Consulta : Cart;
      const paso = e.target.closest('[data-linea-paso]');
      if (paso && idx >= 0) { const it = lista.get()[idx]; if (it) lista.setQty(idx, it.qty + Number(paso.dataset.lineaPaso)); return; }
      if (e.target.closest('[data-quitar]') && idx >= 0) { lista.remove(idx); showToast(lista === Cart ? 'Lo sacamos del carrito' : 'Lo sacamos de la consulta'); return; }
      if (e.target.closest('[data-checkout]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
      const ir = e.target.closest('[data-ir-tienda]');
      if (ir) { if (ir.dataset.irTienda === 'mayor') Modo.aplicar('mayor', false); this.close(); }
    });
    this.el.addEventListener('input', e => {
      const i = e.target.closest('[data-may]');
      if (!i) return;
      const d = leer(DATOS_MAYOR, {}) || {};
      d[i.dataset.may] = i.value.slice(0, 50);
      guardar(DATOS_MAYOR, d);
      this.syncWsp();
    });
    const d = leer(DATOS_MAYOR, {}) || {};
    this.el.querySelectorAll('[data-may]').forEach(i => { i.value = d[i.dataset.may] || ''; });
    this.el.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); this.verTab(this.tab === 'menor' ? 'mayor' : 'menor', true); }
    }));
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
    document.addEventListener('cart:updated', () => this.render(false));
    this.render(false);
  },
  verTab(t, foco) {
    this.tab = t === 'mayor' ? 'mayor' : 'menor';
    this.el.querySelectorAll('[data-tab]').forEach(b => { const on = b.dataset.tab === this.tab; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && foco) b.focus(); });
    this.el.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== this.tab; });
  },
  syncWsp() {
    const a = this.el?.querySelector('[data-may-wsp]');
    if (a) a.href = waLink(mensajeMayor());
  },
  lineaHTML(i, n, lista, animar) {
    const p = getProducto(i.id); const v = varianteDe(p, i.v);
    const max = lista.maxDe(n);
    const mayor = lista === Consulta;
    return `<div class="linea${animar ? ' entra' : ''}" data-idx="${n}" data-lista="${mayor ? 'mayor' : 'menor'}" style="--i:${n}">
      <div class="linea__foto"><img src="${v.img || p.img}" width="${p.ancho}" height="${p.alto}" alt=""></div>
      <div class="linea__info">
        <p class="linea__nombre">${esc(p.nombre)}</p>
        <p class="linea__meta">${multi(p) ? `<span class="linea__dot" style="--sw:${v.hex}" aria-hidden="true"></span>${esc(v.nombre)}` : esc(catDe(p.cat).nombre)}${mayor ? '' : ` · ${formatearPrecio(precioFinal(p))} c/u`}</p>
        <div class="linea__abajo">
          <div class="stepper"><button type="button" data-linea-paso="-1" aria-label="Restar uno"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-paso="1" aria-label="Sumar uno"${i.qty >= max ? ' disabled' : ''}>${ICO.mas}</button></div>
          ${mayor ? '<span class="linea__may">Precio a consultar</span>' : `<b>${formatearPrecio(precioFinal(p) * i.qty)}</b>`}
          <button type="button" class="icon-btn" data-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.quitar}</button>
        </div>
      </div>
    </div>`;
  },
  render(animar) {
    if (!this.el) return;
    [['menor', Cart], ['mayor', Consulta]].forEach(([t, lista]) => {
      const cont = this.el.querySelector(`[data-lineas="${t}"]`);
      const foot = this.el.querySelector(`[data-foot="${t}"]`);
      const items = lista.get();
      if (!items.length) {
        cont.innerHTML = t === 'menor'
          ? `<div class="drawer__vacio"><span class="drawer__vacio-ico" aria-hidden="true">${ICO.sombreros}</span><h3>Tu carrito está vacío</h3><p>Elegí un sombrero, un abanico, un pareo o un pañuelo y sumalo acá.</p><a class="btn btn--ink" href="${CATALOGO_URL}" data-ir-tienda="menor">Ir a la tienda</a></div>`
          : `<div class="drawer__vacio"><span class="drawer__vacio-ico" aria-hidden="true">${ICO.abanicos}</span><h3>Tu consulta por mayor está vacía</h3><p>En modo por mayor, sumá las cantidades de cada modelo y color. Después nos la mandás por WhatsApp y te pasamos los precios.</p><a class="btn btn--ink" href="${CATALOGO_URL}?modo=mayor" data-ir-tienda="mayor">Ver la tienda por mayor</a></div>`;
        foot.hidden = true;
        return;
      }
      foot.hidden = false;
      cont.innerHTML = items.map((i, n) => this.lineaHTML(i, n, lista, animar)).join('');
    });
    const tot = this.el.querySelector('[data-cart-total]');
    if (tot) tot.textContent = formatearPrecio(Cart.total());
    this.syncWsp();
  },
  open(tab) {
    if (!this.el) return;
    this.volver = document.activeElement;
    this.render(!reduceMotion);
    this.verTab(tab || Modo.actual, false);
    abrirCapa(this.el, this.bd);
    setTimeout(() => this.el.querySelector('.drawer__tab[aria-selected="true"]')?.focus(), 60);
  },
  close(sinFoco) {
    if (!this.el || this.el.hidden) return;
    cerrarCapa(this.el, this.bd);
    if (!sinFoco) this.volver?.focus?.();
  },
};
function openCartDrawer() { Drawer.open(); }

const Vista = {
  el: null, bd: null, cuerpo: null, volver: null, actual: null,
  init() {
    this.el = document.getElementById('vista');
    this.bd = document.querySelector('[data-modal-bd]');
    if (!this.el) return;
    this.cuerpo = this.el.querySelector('[data-modal-cuerpo]');
    document.addEventListener('click', e => {
      const q = e.target.closest('[data-quick]');
      if (q) { e.preventDefault(); const card = q.closest('[data-card]'); this.open(q.dataset.quick, card?.dataset.v); }
    });
    this.el.addEventListener('click', e => {
      if (e.target.closest('[data-close-modal]')) { this.close(); return; }
      const th = e.target.closest('[data-vr-thumb]');
      if (th) { this.foto(Number(th.dataset.vrThumb)); return; }
      const paso = e.target.closest('[data-vr-paso]');
      if (paso) {
        const span = this.el.querySelector('[data-vr-cant]');
        const max = this.actual.stock ?? 99;
        const n = Math.max(1, Math.min(max, Number(span.textContent) + Number(paso.dataset.vrPaso)));
        span.textContent = n;
        this.el.querySelector('[data-vr-paso="-1"]').disabled = n <= 1;
        this.el.querySelector('[data-vr-paso="1"]').disabled = n >= max;
        return;
      }
      const mp = e.target.closest('[data-may-paso]');
      if (mp) {
        const fila = mp.closest('[data-may-v]');
        const span = fila.querySelector('[data-may-cant]');
        const n = Math.max(0, Math.min(999, Number(span.textContent) + Number(mp.dataset.mayPaso)));
        span.textContent = n;
        fila.querySelector('[data-may-paso^="-"]').disabled = n <= 0;
        if (n > 0) this.elegir(fila.dataset.mayV);
        this.syncMayor();
        return;
      }
      if (e.target.closest('[data-vr-add]')) { this.agregar(false); return; }
      if (e.target.closest('[data-vr-buy]')) { this.agregar(true); return; }
      if (e.target.closest('[data-vr-may-add]')) { this.agregarMayor(); }
    });
    this.el.addEventListener('change', e => { if (e.target.name === 'vr-var') this.elegir(e.target.value); });
    this.bd?.addEventListener('click', () => this.close());
    this.el.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); else atrapar(this.el, e); });
  },
  galeria() {
    const p = this.actual; if (!p) return [];
    if (multi(p)) return p.variantes.map(v => ({ src: v.img, ancho: p.ancho, alto: p.alto, alt: v.alt || p.alt, v: v.id }));
    return [{ src: p.img, ancho: p.ancho, alto: p.alto, alt: p.alt }, ...(p.galeria || [])];
  },
  foto(k) {
    const g = this.galeria()[k];
    const img = this.el.querySelector('[data-vr-img]');
    if (!g || !img) return;
    img.src = g.src; img.alt = g.alt; img.width = g.ancho; img.height = g.alto;
    this.el.querySelectorAll('[data-vr-thumb]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.vrThumb) === k)));
    this.el.querySelector('.vr__foto')?.classList.toggle('vr__foto--alta', g.alto > g.ancho);
    if (g.v) {
      const r = this.el.querySelector(`[name="vr-var"][value="${g.v}"]`);
      if (r && !r.checked) { r.checked = true; this.sync(); }
    }
  },
  elegir(v) {
    const k = this.galeria().findIndex(g => g.v === v);
    const r = this.el.querySelector(`[name="vr-var"][value="${v}"]`);
    if (r) r.checked = true;
    if (k >= 0) this.foto(k);
    this.sync();
  },
  vSel() { return this.el.querySelector('[name="vr-var"]:checked')?.value || this.actual?.variantes[0].id; },
  sync() {
    const p = this.actual; if (!p) return;
    const v = varianteDe(p, this.vSel());
    const lbl = this.el.querySelector('[data-vr-color]');
    if (lbl) lbl.textContent = v.nombre;
    this.el.querySelector('[data-vr-wsp]').href = waLink(Modo.actual === 'mayor' ? `Hola Solana! Tengo un comercio y quiero el precio por mayor de ${p.nombre}.` : `Hola Solana! Quiero consultar por ${nombreCompleto(p, v.id)}.`);
  },
  syncMayor() {
    const total = [...this.el.querySelectorAll('[data-may-cant]')].reduce((s, x) => s + Number(x.textContent), 0);
    const b = this.el.querySelector('[data-vr-may-add]');
    if (!b) return;
    b.disabled = total === 0;
    b.textContent = total ? `Sumar ${total} ${total === 1 ? 'unidad' : 'unidades'} a la consulta` : 'Elegí cantidades para sumar';
  },
  html(p, vSel) {
    const gal = this.galeria();
    const k0 = Math.max(0, gal.findIndex(g => g.v === vSel));
    let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { tono: p.tonos, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const stock = p.stock ?? 99;
    const v = varianteDe(p, vSel);
    const colores = multi(p) ? `<fieldset class="vr__grupo t-menor"><legend>${esc(p.etiqueta || 'Color')}: <b data-vr-color>${esc(v.nombre)}</b></legend><div class="vr__colores">${p.variantes.map(x => `<label class="sw-op"><input type="radio" name="vr-var" value="${x.id}"${x.id === v.id ? ' checked' : ''}><span class="sw-op__dot" style="--sw:${x.hex}" aria-hidden="true"></span><span class="sw-op__txt">${esc(x.nombre)}</span></label>`).join('')}</div></fieldset>` : '';
    const filas = p.variantes.map(x => `<li class="vr__fila" data-may-v="${x.id}">${multi(p) ? `<span class="sw-op__dot" style="--sw:${x.hex}" aria-hidden="true"></span><span class="vr__fila-n">${esc(x.nombre)}</span>` : '<span class="vr__fila-n">Cantidad</span>'}<div class="stepper"><button type="button" data-may-paso="-1" aria-label="Restar uno${multi(p) ? ` de ${esc(x.nombre)}` : ''}"${x.id === v.id ? '' : ' disabled'}>${ICO.menos}</button><span data-may-cant>${x.id === v.id ? 1 : 0}</span><button type="button" data-may-paso="1" aria-label="Sumar uno${multi(p) ? ` de ${esc(x.nombre)}` : ''}">${ICO.mas}</button></div></li>`).join('');
    const guia = p.guia ? `<details class="vr__guia"><summary>${ICO.regla} ¿Cómo sé si me queda?</summary><p>Medí el contorno de tu cabeza con un centímetro, a la altura de la frente y por encima de las orejas. Este modelo va de 56 a 58 cm y se ajusta con el cordón interno. Si medís más, escribinos y te decimos qué conviene.</p></details>` : '';
    return `<div class="vr">
      <div class="vr__galeria">
        <div class="vr__foto${gal[k0].alto > gal[k0].ancho ? ' vr__foto--alta' : ''}"><img data-vr-img src="${gal[k0].src}" width="${gal[k0].ancho}" height="${gal[k0].alto}" alt="${esc(gal[k0].alt)}">${badgeHTML(p)}</div>
        ${gal.length > 1 ? `<div class="vr__thumbs">${gal.map((g, i) => `<button type="button" class="vr__thumb" data-vr-thumb="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === k0}"><img src="${g.src}" width="${g.ancho}" height="${g.alto}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="vr__info">
        <p class="vr__cat">${esc(catDe(p.cat).nombre)}</p>
        <h2 class="vr__titulo">${esc(p.nombre)}</h2>
        <p class="vr__precio">${precioDoble(p)}</p>
        <p class="vr__desc">${esc(p.desc)}</p>
        ${colores}
        <div class="vr__acciones t-menor">
          <div class="stepper"><button type="button" data-vr-paso="-1" aria-label="Restar uno" disabled>${ICO.menos}</button><span data-vr-cant>1</span><button type="button" data-vr-paso="1" aria-label="Sumar uno"${stock <= 1 ? ' disabled' : ''}>${ICO.mas}</button></div>
          <button type="button" class="btn btn--cta" data-vr-add>Agregar al carrito</button>
          <button type="button" class="btn btn--ink" data-vr-buy>Comprar ahora</button>
        </div>
        <fieldset class="vr__grupo vr__mayor t-mayor"><legend>Cantidades por mayor${multi(p) ? ', por color' : ''}</legend><ul class="vr__filas">${filas}</ul>
          <button type="button" class="btn btn--cta btn--full" data-vr-may-add>Sumar 1 unidad a la consulta</button>
          <p class="vr__nota">El precio por mayor y las condiciones te los pasamos por WhatsApp.</p>
        </fieldset>
        <a class="vr__wsp" data-vr-wsp href="${waLink(`Hola Solana! Quiero consultar por ${p.nombre}.`)}" target="_blank" rel="noopener">${WSP_GLYPH} Consultar por WhatsApp</a>
        ${guia}
        <dl class="vr__datos">${(p.datos || []).map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>
      </div>
    </div>
    ${rel.length ? `<div class="vr__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" class="mini" data-quick="${r.id}"><img src="${r.variantes[0].img || r.img}" width="${r.ancho}" height="${r.alto}" alt=""><span><b>${esc(r.nombre)}</b><small class="t-menor">${formatearPrecio(precioFinal(r))}</small><small class="t-mayor">Precio por mayor a consultar</small></span></button></li>`).join('')}</ul></div>` : ''}`;
  },
  ldjson(p) {
    let s = document.getElementById('ld-producto');
    if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, image: new URL(p.img, location.href).href, category: catDe(p.cat).nombre, brand: { '@type': 'Brand', name: 'Solana' },
      offers: { '@type': 'Offer', priceCurrency: 'ARS', price: precioFinal(p), availability: (p.stock ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: location.href } });
  },
  open(id, v) {
    const p = getProducto(id);
    if (!p || !this.el) return;
    const yaAbierta = !this.el.hidden;
    if (!yaAbierta) this.volver = document.activeElement;
    this.actual = p;
    this.cuerpo.innerHTML = this.html(p, varianteDe(p, v).id);
    this.el.setAttribute('aria-label', p.nombre);
    this.sync();
    this.syncMayor();
    this.ldjson(p);
    if (!yaAbierta) abrirCapa(this.el, this.bd);
    this.el.scrollTop = 0;
    setTimeout(() => this.el.querySelector('.modal__cerrar')?.focus(), 60);
    if (PAGINA === 'catalogo') { const u = new URL(location.href); u.searchParams.set('producto', p.id); history.replaceState(null, '', u); }
  },
  agregar(comprar) {
    const p = this.actual; if (!p) return;
    const v = this.vSel();
    const n = Number(this.el.querySelector('[data-vr-cant]')?.textContent) || 1;
    Cart.add(p, n, v);
    if (comprar) { this.close(true); Drawer.open('menor'); return; }
    showToast(`Sumaste ${nombreCompleto(p, v)} al carrito`);
  },
  agregarMayor() {
    const p = this.actual; if (!p) return;
    let total = 0;
    this.el.querySelectorAll('[data-may-v]').forEach(f => {
      const n = Number(f.querySelector('[data-may-cant]').textContent);
      if (n > 0) { Consulta.add(p, n, f.dataset.mayV); total += n; }
    });
    if (!total) return;
    this.close(true);
    Drawer.open('mayor');
    showToast(`Sumaste ${total} ${total === 1 ? 'unidad' : 'unidades'} de ${p.nombre} a la consulta`);
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
    const sw = e.target.closest('[data-card] [data-sw]');
    if (sw) {
      const card = sw.closest('[data-card]');
      const p = getProducto(card.dataset.card);
      const v = varianteDe(p, sw.dataset.sw);
      card.dataset.v = v.id;
      const img = card.querySelector('[data-card-img]');
      if (img) { img.src = v.img; img.alt = v.alt || p.alt; }
      card.querySelectorAll('[data-sw]').forEach(b => b.setAttribute('aria-pressed', String(b === sw)));
      return;
    }
    const paso = e.target.closest('[data-stepper] [data-paso]');
    if (paso) {
      const st = paso.closest('[data-stepper]');
      const card = st.closest('[data-card]');
      const p = getProducto(card?.dataset.card);
      const max = Modo.actual === 'mayor' ? 999 : (p?.stock ?? 99);
      const span = st.querySelector('[data-cant]');
      const n = Math.max(1, Math.min(max, Number(span.textContent) + Number(paso.dataset.paso)));
      span.textContent = n;
      st.querySelector('[data-paso="-1"]').disabled = n <= 1;
      st.querySelector('[data-paso="1"]').disabled = n >= max;
      return;
    }
    const add = e.target.closest('[data-add], [data-buy]');
    if (!add) return;
    const id = add.dataset.add || add.dataset.buy;
    const p = getProducto(id); if (!p) return;
    const card = add.closest('[data-card]');
    const span = card?.querySelector('[data-cant]');
    const n = Number(span?.textContent) || 1;
    const v = card?.dataset.v || p.variantes[0].id;
    const mayor = Modo.actual === 'mayor' && !add.dataset.buy;
    (mayor ? Consulta : Cart).add(p, n, v);
    if (span) { span.textContent = '1'; card.querySelector('[data-paso="-1"]').disabled = true; card.querySelector('[data-paso="1"]').disabled = false; }
    if (add.dataset.buy) { Drawer.open('menor'); return; }
    add.classList.add('ok');
    setTimeout(() => add.classList.remove('ok'), 1400);
    showToast(mayor ? `Sumaste ${n} × ${nombreCompleto(p, v)} a la consulta por mayor` : `Sumaste ${nombreCompleto(p, v)} al carrito`);
  });
}

function initFloats() {
  const wsp = document.getElementById('wsp-float');
  const cart = document.getElementById('cart-float');
  const sync = () => {
    const scrolled = window.scrollY > 600;
    wsp?.classList.toggle('visible', scrolled);
    cart?.classList.toggle('visible', scrolled || Modo.lista().count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  document.addEventListener('modo:cambio', sync);
  cart?.addEventListener('click', openCartDrawer);
  sync();
}

function initDestacados() {
  const cont = document.querySelector('[data-destacados]');
  if (!cont) return;
  const res = Tienda.consultar({ orden: 'destacados', limite: MODELO === '2' ? 7 : 8 });
  cont.insertAdjacentHTML('afterbegin', res.items.map((p, i) => cardHTML(p, true, MODELO === '2' && i === 0)).join(''));
}

function initConteos() {
  document.querySelectorAll('[data-cat-n]').forEach(s => { const n = Tienda.contar({ cat: s.dataset.catN }); s.textContent = `${n} ${n === 1 ? 'modelo' : 'modelos'}`; });
  const t = document.querySelector('[data-total-modelos]');
  if (t) t.textContent = `${Tienda.contar({})} modelos en ${CATEGORIAS.length} categorías, con todos sus colores.`;
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const centro = [-32.4833, -58.2333];
  const mapa = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: true, attributionControl: true }).setView(centro, 14);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
  L.circle(centro, { radius: 700, color: '#2C7A72', weight: 1, fillColor: '#2C7A72', fillOpacity: 0.16 }).addTo(mapa);
  L.circleMarker(centro, { radius: 8, color: '#FFFFFF', weight: 2, fillColor: '#1F3A68', fillOpacity: 1 }).addTo(mapa).bindTooltip('Solana · Concepción del Uruguay');
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
    tono: (params.get('tono') || '').split(',').filter(v => valida(TONOS, v)),
    precio: valida(PRECIOS, params.get('precio')) ? params.get('precio') : '',
    q: (params.get('q') || '').slice(0, 60),
    orden: valida(ORDENES, params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2' && e.cat.length > 1) e.cat = e.cat.slice(0, 1);
  if (Modo.actual === 'mayor') e.precio = '';
  let cursor = null, mostrados = 0;

  const filtrosDe = (sin = '') => {
    const f = {};
    if (sin !== 'cat' && e.cat.length) f.cat = e.cat;
    if (sin !== 'tono' && e.tono.length) f.tono = e.tono;
    const pr = PRECIOS.find(x => x.id === e.precio);
    if (sin !== 'precio' && pr) { f.precioMin = pr.min; f.precioMax = pr.max; }
    return f;
  };
  const urlSync = () => {
    const u = new URL(location.href);
    const set = (k, v) => (v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    set('cat', e.cat.join(','));
    set('tono', e.tono.join(','));
    set('precio', e.precio);
    set('q', e.q.trim());
    set('orden', e.orden === 'destacados' ? '' : e.orden);
    u.searchParams.delete('buscar');
    u.searchParams.delete('modo');
    history.replaceState(null, '', u);
  };
  const pintarControles = () => {
    document.querySelectorAll('input[data-f="cat"]').forEach(i => { i.checked = e.cat.includes(i.value); });
    document.querySelectorAll('input[data-f="tono"]').forEach(i => { i.checked = e.tono.includes(i.value); });
    document.querySelectorAll('input[data-f="precio"]').forEach(i => { i.checked = i.value === e.precio; });
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.catChip ? e.cat.includes(c.dataset.catChip) : !e.cat.length)));
    if (qIn) qIn.value = e.q;
    if (ordenSel) ordenSel.value = e.orden;
    document.querySelectorAll('[data-n]').forEach(s => {
      const [g, v] = s.dataset.n.split(':');
      s.textContent = Tienda.contar({ ...filtrosDe(g), [g]: [v] });
    });
    const activos = e.cat.length + e.tono.length + (e.precio ? 1 : 0) + (e.q.trim() ? 1 : 0);
    const enPanel = (MODELO === '2' ? 0 : e.cat.length) + e.tono.length + (e.precio ? 1 : 0);
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
    else contador.innerHTML = `${total} ${total === 1 ? 'modelo' : 'modelos'}${e.cat.length === 1 ? ` <small>en ${esc(catDe(e.cat[0]).nombre)}</small>` : ''}`;
    vacio.hidden = mostrados > 0;
    if (!vacio.hidden) revelarNuevos(vacio.parentElement);
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
  document.addEventListener('modo:cambio', () => { if (Modo.actual === 'mayor' && e.precio) { e.precio = ''; aplicar(); } });
  chips.forEach(c => c.addEventListener('click', () => { e.cat = c.dataset.catChip ? [c.dataset.catChip] : []; aplicar(); }));
  ordenSel?.addEventListener('change', () => { e.orden = valida(ORDENES, ordenSel.value) ? ordenSel.value : 'destacados'; aplicar(); });
  let tq = 0;
  qIn?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { e.q = qIn.value.slice(0, 60); aplicar(); }, 220); });
  document.querySelector('[data-buscador]')?.addEventListener('submit', ev => { ev.preventDefault(); clearTimeout(tq); e.q = qIn.value.slice(0, 60); aplicar(); qIn.blur(); });
  document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
    e.cat = []; e.tono = []; e.precio = ''; e.q = '';
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

Modo.init();
initMenuCategorias();
initConteos();
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
initMapa();
abrirProductoDeUrl();
