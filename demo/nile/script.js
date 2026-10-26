'use strict';

const WA = '5492915717972';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;

const TELAS = [
  { id: 'ramitas', nombre: 'Ramitas verde agua', img: 'images/tela-ramitas.webp' },
  { id: 'hojas', nombre: 'Hojas en acuarela', img: 'images/tela-hojas.webp' },
  { id: 'flores', nombre: 'Florcitas índigo', img: 'images/tela-flores.webp' },
  { id: 'guarda', nombre: 'Guarda floral', img: 'images/tela-guarda.webp' },
  { id: 'floral', nombre: 'Flores acolchadas', img: 'images/tela-floral.webp' },
  { id: 'rayas', nombre: 'Rayas azules', img: 'images/tela-rayas.webp' },
  { id: 'lino', nombre: 'Lino verde agua', img: 'images/tela-lino.webp' },
  { id: 'denim', nombre: 'Denim acolchado', img: 'images/tela-denim.webp' },
];

const CATEGORIAS = [
  { id: 'mascotas', nombre: 'Mascotas', img: 'images/p-chaleco.webp', resumen: 'Colchonetas y ropa' },
  { id: 'bebes', nombre: 'Bebés', img: 'images/p-ajuar.webp', resumen: 'Ajuares y accesorios' },
  {
    id: 'hogar', nombre: 'Hogar', img: 'images/p-almohadon.webp', resumen: 'Mesa, cortinas, almohadones y neceseres',
    subs: [{ id: 'mesa', nombre: 'Mesa' }, { id: 'deco', nombre: 'Cortinas y almohadones' }, { id: 'neceseres', nombre: 'Neceseres' }],
  },
];
const SUBCATEGORIAS = CATEGORIAS.flatMap(c => (c.subs || []).map(s => ({ ...s, cat: c.id })));

const PRECIOS = {
  'hasta-20': [0, 20000, 'Hasta $20.000'],
  '20-40': [20000, 40000, '$20.000 a $40.000'],
  'mas-40': [40000, Infinity, 'Más de $40.000'],
};

const ORDENES = {
  destacados: 'Más elegidos',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

const PIEZAS = ['Cortinas', 'Mantel', 'Camino de mesa', 'Individuales', 'Almohadón', 'Colchoneta para mascota', 'Ropa para mascota', 'Ajuar de bebé', 'Neceser', 'Otra pieza'];

const PRODUCTOS = [
  {
    id: 'colchoneta-acolchada', nombre: 'Colchoneta acolchada para mascotas', cat: 'mascotas', img: 'images/p-colchoneta.webp', pieza: 'Colchoneta para mascota',
    desc: 'Colchoneta con capitoné y vivo en todo el borde. Para el rincón de la casa, el sillón o el auto, en la tela que combine con tu living.',
    etiqueta: 'Medida', medidas: [{ id: 's', nombre: 'S · 50 × 40 cm', precio: 29900, stock: 6 }, { id: 'm', nombre: 'M · 70 × 55 cm', precio: 38900, stock: 4 }, { id: 'l', nombre: 'L · 90 × 70 cm', precio: 48900, stock: 3 }],
    telas: ['ramitas', 'flores', 'floral', 'lino'], descuento: 0, destacado: 1,
  },
  {
    id: 'ajuar-batita-gorrito', nombre: 'Ajuar batita cruzada y gorrito', cat: 'bebes', img: 'images/p-ajuar.webp', pieza: 'Ajuar de bebé',
    desc: 'Batita cruzada con lazo al costado y gorrito anudado, con estampa de hojas en acuarela. Se abre por delante para vestir al bebé sin pasarla por la cabeza.',
    etiqueta: 'Talle', medidas: [{ id: 'rn', nombre: 'Recién nacido', precio: 34900, stock: 5 }, { id: '0-3', nombre: '0 a 3 meses', precio: 34900, stock: 4 }, { id: '3-6', nombre: '3 a 6 meses', precio: 36900, stock: 3 }],
    telas: ['hojas', 'flores'], descuento: 0, destacado: 2,
  },
  {
    id: 'almohadon-lino', nombre: 'Almohadón de lino con vivo', cat: 'hogar', sub: 'deco', img: 'images/p-almohadon.webp', pieza: 'Almohadón',
    desc: 'Funda de lino con vivo al tono y cierre oculto en un lateral, con relleno. Queda bien solo o mezclado con las telas estampadas.',
    etiqueta: 'Medida', medidas: [{ id: '40', nombre: '40 × 40 cm', precio: 17900, stock: 7 }, { id: '50', nombre: '50 × 50 cm', precio: 21900, stock: 5 }],
    telas: ['lino', 'ramitas', 'floral', 'rayas'], descuento: 0, destacado: 3,
  },
  {
    id: 'cortinas-lino', nombre: 'Cortinas de lino con hojas', cat: 'hogar', sub: 'deco', img: 'images/p-cortinas.webp', pieza: 'Cortinas',
    desc: 'Paños de lino liviano con hojas en acuarela al pie. Dejan pasar la luz y se cuelgan con fruncido en el barral. El precio es por paño.',
    etiqueta: 'Medida', medidas: [{ id: '140x220', nombre: 'Paño 1,40 × 2,20 m', precio: 56900, stock: 4 }, { id: '140x260', nombre: 'Paño 1,40 × 2,60 m', precio: 64900, stock: 2 }],
    telas: ['hojas', 'lino'], descuento: 0, destacado: 4,
  },
  {
    id: 'chaleco-acolchado', nombre: 'Chaleco acolchado para perros', cat: 'mascotas', img: 'images/p-chaleco.webp', pieza: 'Ropa para mascota',
    desc: 'Chaleco acolchado en líneas verticales, forrado en lino crudo y con sisas amplias para que se mueva cómodo. Medí el contorno de pecho y elegí el talle.',
    etiqueta: 'Talle', medidas: [{ id: 'xs', nombre: 'XS · pecho 30-36 cm', precio: 18900, stock: 5 }, { id: 's', nombre: 'S · pecho 36-44 cm', precio: 19900, stock: 6 }, { id: 'm', nombre: 'M · pecho 44-52 cm', precio: 21900, stock: 4 }, { id: 'l', nombre: 'L · pecho 52-62 cm', precio: 23900, stock: 2 }, { id: 'xl', nombre: 'XL · pecho 62-72 cm', precio: 25900, stock: 2 }],
    telas: ['denim', 'lino', 'ramitas'], descuento: 0, destacado: 5,
  },
  {
    id: 'mantel-redondo', nombre: 'Mantel redondo estampado', cat: 'hogar', sub: 'mesa', img: 'images/p-mantel.webp', pieza: 'Mantel',
    desc: 'Mantel de caída larga con florcitas índigo sobre fondo crudo, para mesas redondas de cocina o comedor. Elegí el diámetro según tu mesa más la caída que quieras.',
    etiqueta: 'Medida', medidas: [{ id: '140', nombre: 'Ø 1,40 m', precio: 36900, stock: 4 }, { id: '180', nombre: 'Ø 1,80 m', precio: 45900, stock: 3 }, { id: '220', nombre: 'Ø 2,20 m', precio: 54900, stock: 2 }],
    telas: ['flores', 'hojas', 'rayas'], descuento: 0, destacado: 6,
  },
  {
    id: 'camino-de-mesa', nombre: 'Camino de mesa con guarda floral', cat: 'hogar', sub: 'mesa', img: 'images/p-camino.webp', pieza: 'Camino de mesa',
    desc: 'Camino de lino con guarda de flores al centro y bandas a rayas en los bordes. Combina con los individuales rayados.',
    etiqueta: 'Medida', medidas: [{ id: '140', nombre: '40 × 140 cm', precio: 17900, stock: 6 }, { id: '180', nombre: '40 × 180 cm', precio: 21900, stock: 5 }, { id: '220', nombre: '40 × 220 cm', precio: 25900, stock: 3 }],
    telas: ['guarda', 'rayas'], descuento: 0, destacado: 7,
  },
  {
    id: 'neceser-acolchado', nombre: 'Neceser acolchado con cierre', cat: 'hogar', sub: 'neceseres', img: 'images/p-neceser.webp', pieza: 'Neceser',
    desc: 'Neceser acolchado en líneas, con cierre metálico y forro de algodón crudo. Entra en la cartera o en el bolso de viaje.',
    etiqueta: 'Medida', medidas: [{ id: 'unico', nombre: '28 × 18 cm', precio: 16900, stock: 6 }],
    telas: ['floral', 'ramitas', 'denim'], descuento: 0, destacado: 8, nuevo: true,
  },
  {
    id: 'individuales-rayados', nombre: 'Individuales rayados con ribete', cat: 'hogar', sub: 'mesa', img: 'images/p-individuales.webp', pieza: 'Individuales',
    desc: 'Individuales de 45 × 33 cm a rayas finas, con ribete crudo en todo el borde. Se venden por par o en set.',
    etiqueta: 'Set', medidas: [{ id: 'par', nombre: 'Par', precio: 12900, stock: 8 }, { id: 'x4', nombre: 'Set de 4', precio: 23900, stock: 5 }, { id: 'x6', nombre: 'Set de 6', precio: 33900, stock: 3 }],
    telas: ['rayas', 'lino', 'flores'], descuento: 0,
  },
  {
    id: 'gorrito-anudado', nombre: 'Gorrito anudado de algodón', cat: 'bebes', img: 'images/p-gorrito.webp', pieza: 'Ajuar de bebé',
    desc: 'El gorrito del ajuar, también por separado: puño doblado y nudo arriba, con la misma estampa de hojas.',
    etiqueta: 'Talle', medidas: [{ id: 'unico', nombre: '0 a 6 meses', precio: 9900, stock: 10 }],
    telas: ['hojas'], descuento: 0, nuevo: true,
  },
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const conDescuento = (p, precio) => (p.descuento > 0 ? Math.round(precio * (1 - p.descuento / 100) / 100) * 100 : precio);
const medDe = (p, medId) => p.medidas.find(x => x.id === medId) || p.medidas[0];
const precioDesde = p => Math.min(...p.medidas.map(x => conDescuento(p, x.precio)));
const precioListaDesde = p => Math.min(...p.medidas.map(x => x.precio));
const stockTotal = p => p.medidas.reduce((s, x) => s + (x.stock || 0), 0);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = id => SUBCATEGORIAS.find(s => s.id === id);
const telaDe = id => TELAS.find(t => t.id === id);
const necesitaOpciones = p => p.medidas.length > 1;
const textoBoton = p => (necesitaOpciones(p) ? `Elegir ${p.etiqueta.toLowerCase()}` : 'Agregar');
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), tela = lista(f.tela), excluir = lista(f.excluir);
    if (sub.length) {
      if (p.sub) { if (!sub.includes(p.sub)) return false; }
      else if (!cat.includes(p.cat)) return false;
    } else if (cat.length && !cat.includes(p.cat)) return false;
    if (tela.length && !(p.telas || []).some(t => tela.includes(t))) return false;
    if (f.precio && PRECIOS[f.precio]) {
      const [min, max] = PRECIOS[f.precio];
      const v = precioDesde(p);
      if (v < min || v >= max) return false;
    }
    if (f.destacado && !p.destacado) return false;
    if (f.nuevo && !p.nuevo) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || Number(!!b.nuevo) - Number(!!a.nuevo) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
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

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, subDe(p.sub)?.nombre, p.pieza, p.desc, p.etiqueta,
      ...(p.telas || []).map(t => telaDe(t)?.nombre), ...p.medidas.map(x => x.nombre),
      p.nuevo ? 'nuevo novedad' : '', p.descuento > 0 ? 'oferta descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: TOPE_CONSULTA });

const cacheProductos = new Map();
const getProducto = id => {
  if (!cacheProductos.has(id)) {
    const p = Tienda.obtener(id);
    if (p) cacheProductos.set(id, p);
  }
  return cacheProductos.get(id) || null;
};

const Cart = {
  KEY: 'nile_cart',
  clave: (id, med, tela) => `${id}|${med}|${tela || ''}`,
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
    if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, { med, tela } = {}) {
    const m = medDe(producto, med);
    const items = this.get();
    const t = tela || producto.telas[0];
    const k = this.clave(producto.id, m.id, t);
    const existing = items.find(i => this.clave(i.id, i.med, i.tela) === k);
    const tope = m.stock ?? 99;
    if (existing) existing.qty = Math.min(existing.qty + qty, tope);
    else items.push({ id: producto.id, med: m.id, tela: t, qty: Math.min(qty, tope) });
    this.save(items);
  },
  setQty(k, qty) {
    const items = this.get();
    const it = items.find(i => this.clave(i.id, i.med, i.tela) === k);
    if (!it) return;
    const p = getProducto(it.id);
    const tope = p ? medDe(p, it.med).stock ?? 99 : 99;
    it.qty = Math.max(1, Math.min(qty, tope));
    this.save(items);
  },
  remove(k) { this.save(this.get().filter(i => this.clave(i.id, i.med, i.tela) !== k)); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  lineas() {
    return this.get().map(i => {
      const p = getProducto(i.id);
      if (!p) return null;
      const m = medDe(p, i.med);
      return { ...i, clave: this.clave(i.id, i.med, i.tela), producto: p, medida: m, telaObj: telaDe(i.tela), unitario: conDescuento(p, m.precio) };
    }).filter(Boolean);
  },
  total() { return this.lineas().reduce((s, l) => s + l.unitario * l.qty, 0); },
};

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealsListos = false;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const paginaCatalogo = () => document.body.dataset.catalogo || 'catalogo.html';
const paginaInicio = () => document.body.dataset.inicio || './';
const urlProducto = id => `${paginaCatalogo()}?producto=${encodeURIComponent(id)}`;

const ICONOS = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  izq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  der: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  basura: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  tijera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>',
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

function badgesHTML(p) {
  const b = [];
  if (p.descuento > 0) b.push(`<span class="badge badge--off">-${p.descuento}%</span>`);
  if (p.nuevo) b.push('<span class="badge badge--nuevo">Nuevo</span>');
  if (stockTotal(p) > 0 && p.medidas.every(x => x.stock <= 3)) b.push('<span class="badge badge--ultimas">Últimas unidades</span>');
  return b.length ? `<div class="prod-badges">${b.join('')}</div>` : '';
}

function precioHTML(p) {
  const desde = new Set(p.medidas.map(x => x.precio)).size > 1;
  return `<p class="prod-precio">${desde ? '<span class="prod-desde">desde</span> ' : ''}<strong>${formatearPrecio(precioDesde(p))}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(precioListaDesde(p))}</s>` : ''}</p>`;
}

function telasMiniHTML(p) {
  const ts = p.telas.map(telaDe).filter(Boolean);
  return `<p class="prod-telas"><span class="prod-telas-puntos" aria-hidden="true">${ts.slice(0, 4).map(t => `<span class="tela-img tela-${esc(t.id)}"></span>`).join('')}</span><span>${ts.length === 1 ? esc(ts[0].nombre) : `${ts.length} telas`}</span></p>`;
}

function metaDe(p) {
  return `${esc(catDe(p.cat)?.nombre || '')} · ${p.medidas.length > 1 ? `${p.medidas.length} ${p.etiqueta === 'Talle' ? 'talles' : p.etiqueta === 'Medida' ? 'medidas' : 'opciones'}` : esc(p.medidas[0].nombre)}`;
}

function cardHTML(p, animar = true) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : '';
  return `<article class="prod" data-id="${esc(p.id)}"${anim}>
    <div class="prod-media">
      <a class="prod-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="900" height="900" decoding="async"></a>
      ${badgesHTML(p)}
    </div>
    <div class="prod-body">
      <p class="prod-meta">${metaDe(p)}</p>
      <h3 class="prod-nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
      ${telasMiniHTML(p)}
      <div class="prod-actions">
        ${necesitaOpciones(p) ? `<button type="button" class="prod-add prod-add--opciones" data-add="${esc(p.id)}">${esc(textoBoton(p))}</button>` : `<div class="stepper" data-stepper>
          <button type="button" data-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">1</output>
          <button type="button" data-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="Agregar al carrito: ${esc(p.nombre)}">${ICONOS.carrito}<span class="prod-add-txt">Agregar</span></button>`}
      </div>
    </div>
  </article>`;
}

function tileHTML(p, i) {
  return `<li class="tile${i === 0 ? ' tile--grande' : ''}" data-animate="subir" style="opacity:0;transform:translateY(40px)">
    <a class="tile-foto" href="${esc(urlProducto(p.id))}" data-ver="${esc(p.id)}" aria-label="Ver ${esc(p.nombre)}"><img src="${esc(p.img)}" alt="${esc(p.nombre)}" width="900" height="900" decoding="async"></a>
    ${badgesHTML(p)}
    <div class="tile-info">
      <h3 class="tile-nombre">${esc(p.nombre)}</h3>
      ${precioHTML(p)}
    </div>
    <button type="button" class="tile-add" data-add="${esc(p.id)}" aria-label="${esc(textoBoton(p))}: ${esc(p.nombre)}">${ICONOS.mas}</button>
  </li>`;
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

const refrescarScroll = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

function initAntiCopia() {
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
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
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
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
  const cont = document.querySelector('[data-cats]');
  if (!cont) return;
  const btn = cont.querySelector('.nav-cats-btn');
  const panel = cont.querySelector('.nav-cats-panel');
  const lista = cont.querySelector('[data-menu-cats]');
  const params = new URLSearchParams(location.search);
  const actual = params.get('cat');
  const actualSub = params.get('sub');
  lista.innerHTML = CATEGORIAS.map(c => `<li>
    <a href="${paginaCatalogo()}?cat=${c.id}"${actual === c.id && !actualSub ? ' aria-current="page"' : ''}><img src="${c.img}" alt="" width="900" height="900" loading="lazy"><span><strong>${esc(c.nombre)}</strong><small>${esc(c.resumen)} · ${Tienda.contar({ cat: c.id })}</small></span></a>
    ${c.subs ? `<ul class="nav-subs">${c.subs.map(s => `<li><a href="${paginaCatalogo()}?cat=${c.id}&amp;sub=${s.id}"${actualSub === s.id ? ' aria-current="page"' : ''}>${esc(s.nombre)}</a></li>`).join('')}</ul>` : ''}
  </li>`).join('');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
  let timer = 0;
  const abrir = () => { clearTimeout(timer); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
  const cerrar = () => { clearTimeout(timer); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
  cont.addEventListener('mouseenter', () => { if (hover.matches) abrir(); });
  cont.addEventListener('mouseleave', () => { if (hover.matches) timer = setTimeout(cerrar, 140); });
  cont.addEventListener('focusout', e => { if (hover.matches && !cont.contains(e.relatedTarget)) cerrar(); });
  document.addEventListener('click', e => { if (hover.matches && !cont.contains(e.target)) cerrar(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
}

function initCuentas() {
  $$('[data-cuenta-cat]').forEach(el => { const n = Tienda.contar({ cat: el.dataset.cuentaCat }); el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`; });
  $$('[data-cuenta-sub]').forEach(el => { const n = Tienda.contar({ sub: el.dataset.cuentaSub }); el.textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`; });
  $$('[data-cuenta-total]').forEach(el => { el.textContent = Tienda.contar(); });
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
    cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
  };
  window.addEventListener('scroll', sync, { passive: true });
  document.addEventListener('cart:updated', sync);
  sync();
}

let abrirCarrito = () => {};
let abrirVista = () => {};

function bloquear(on) {
  document.body.classList.toggle('no-scroll', on);
}

function trampaFoco(cont, e) {
  if (e.key !== 'Tab') return;
  const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function initCarrito() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="drawer-bd" id="drawer-bd" hidden></div>
    <aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Tu carrito" hidden>
      <header class="drawer-head">
        <h2>Tu pedido <span class="drawer-cuenta" data-drawer-cuenta></span></h2>
        <button type="button" class="icon-btn drawer-close" aria-label="Cerrar el carrito">${ICONOS.cerrar}</button>
      </header>
      <div class="drawer-body" data-drawer-body></div>
      <footer class="drawer-foot" data-drawer-foot>
        <p class="drawer-total"><span>Total</span><strong data-drawer-total>$0</strong></p>
        <button type="button" class="btn btn--cta btn--block" data-finalizar>Finalizar compra</button>
        <a class="btn btn--line btn--block" data-pedido-wsp href="${waLink('Hola Nile! Quiero hacer un pedido.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Enviar el pedido por WhatsApp</span></a>
      </footer>
    </aside>`);
  const drawer = $('#drawer');
  const bd = $('#drawer-bd');
  const body = $('[data-drawer-body]', drawer);
  const foot = $('[data-drawer-foot]', drawer);
  let opener = null;
  let timer = 0;

  const pintar = () => {
    const lineas = Cart.lineas();
    $('[data-drawer-cuenta]', drawer).textContent = lineas.length ? `(${Cart.count()})` : '';
    foot.hidden = !lineas.length;
    if (!lineas.length) {
      body.innerHTML = `<div class="drawer-vacio">${ICONOS.tijera}<p><strong>Tu carrito está vacío.</strong> Todavía no cortamos nada: elegí una pieza y la tela que más te guste.</p><a class="btn btn--cta" href="${paginaCatalogo()}">Volver al catálogo</a></div>`;
      return;
    }
    body.innerHTML = `<ul class="drawer-lineas">${lineas.map(l => `
      <li class="linea" data-clave="${esc(l.clave)}">
        <img src="${esc(l.producto.img)}" alt="" width="900" height="900">
        <div class="linea-info">
          <p class="linea-nombre">${esc(l.producto.nombre)}</p>
          <p class="linea-var">${esc(l.medida.nombre)}${l.telaObj ? ` · ${esc(l.telaObj.nombre)}` : ''}</p>
          <div class="linea-acciones">
            <div class="stepper stepper--chico">
              <button type="button" data-linea-paso="-1" aria-label="Restar uno"${l.qty <= 1 ? ' disabled' : ''}>${ICONOS.menos}</button>
              <output aria-label="Cantidad">${l.qty}</output>
              <button type="button" data-linea-paso="1" aria-label="Sumar uno"${l.qty >= (l.medida.stock ?? 99) ? ' disabled' : ''}>${ICONOS.mas}</button>
            </div>
            <button type="button" class="linea-quitar" data-linea-quitar aria-label="Quitar ${esc(l.producto.nombre)}">${ICONOS.basura}</button>
          </div>
        </div>
        <p class="linea-precio">${formatearPrecio(l.unitario * l.qty)}</p>
      </li>`).join('')}</ul>`;
    $('[data-drawer-total]', drawer).textContent = formatearPrecio(Cart.total());
    const texto = ['Hola Nile! Quiero hacer este pedido:', ...lineas.map(l => `• ${l.qty} x ${l.producto.nombre} (${l.medida.nombre}${l.telaObj ? `, tela ${l.telaObj.nombre}` : ''}) ${formatearPrecio(l.unitario * l.qty)}`), `Total: ${formatearPrecio(Cart.total())}`].join('\n');
    $('[data-pedido-wsp]', drawer).href = waLink(texto);
  };

  const abrir = () => {
    opener = document.activeElement;
    clearTimeout(timer);
    pintar();
    drawer.hidden = false; bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { drawer.classList.add('open'); bd.classList.add('open'); }));
    drawer.querySelector('.drawer-close').focus();
  };
  const cerrar = () => {
    drawer.classList.remove('open'); bd.classList.remove('open');
    bloquear(false);
    timer = setTimeout(() => { drawer.hidden = true; bd.hidden = true; }, 380);
    opener?.focus?.();
  };
  abrirCarrito = abrir;
  bd.addEventListener('click', cerrar);
  drawer.querySelector('.drawer-close').addEventListener('click', cerrar);
  drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(drawer, e); });
  drawer.addEventListener('click', e => {
    const li = e.target.closest('.linea');
    if (!li) return;
    const k = li.dataset.clave;
    const it = Cart.get().find(i => Cart.clave(i.id, i.med, i.tela) === k);
    if (!it) return;
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) { Cart.setQty(k, it.qty + Number(paso.dataset.lineaPaso)); return; }
    if (e.target.closest('[data-linea-quitar]')) Cart.remove(k);
  });
  $('[data-finalizar]', drawer).addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
  document.addEventListener('cart:updated', () => { if (!drawer.hidden) pintar(); });
  $$('[data-abrir-carrito]').forEach(b => b.addEventListener('click', abrir));
}

function initVistaRapida() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="qv-bd" id="qv" hidden>
      <div class="qv" role="dialog" aria-modal="true" aria-label="Detalle del producto">
        <button type="button" class="icon-btn qv-close" aria-label="Cerrar">${ICONOS.cerrar}</button>
        <div class="qv-media">
          <img src="images/p-colchoneta.webp" alt="" width="900" height="900" data-qv-img>
          <p class="qv-tela-sel" data-qv-tela></p>
        </div>
        <div class="qv-info" data-qv-info></div>
      </div>
    </div>`);
  const bd = $('#qv');
  const modal = $('.qv', bd);
  const info = $('[data-qv-info]', bd);
  const img = $('[data-qv-img]', bd);
  const telaSel = $('[data-qv-tela]', bd);
  let opener = null;
  let estado = null;

  const pintar = () => {
    const p = estado.p;
    const m = medDe(p, estado.med);
    const t = telaDe(estado.tela);
    const unit = conDescuento(p, m.precio);
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    if (rel.length < 3) rel.push(...Tienda.consultar({ filtros: { destacado: true, excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
    const sinStock = !(m.stock > 0);
    const etiqueta = p.etiqueta;
    info.innerHTML = `
      <p class="qv-meta">${esc(catDe(p.cat)?.nombre)}${p.sub ? ` · ${esc(subDe(p.sub)?.nombre)}` : ''}</p>
      <h2 class="qv-nombre">${esc(p.nombre)}</h2>
      <p class="qv-precio"><strong>${formatearPrecio(unit)}</strong>${p.descuento > 0 ? ` <s>${formatearPrecio(m.precio)}</s> <span class="badge badge--off">-${p.descuento}%</span>` : ''}</p>
      <p class="qv-desc">${esc(p.desc)}</p>
      ${p.medidas.length > 1 ? `<fieldset class="opciones" data-grupo="med"><legend>${esc(etiqueta)}</legend><div class="chips">${p.medidas.map(x => `<label class="chip"><input type="radio" name="qv-med" value="${esc(x.id)}"${x.id === m.id ? ' checked' : ''}${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.nombre)}<small>${formatearPrecio(conDescuento(p, x.precio))}</small></span></label>`).join('')}</div></fieldset>` : `<p class="qv-pres">${esc(etiqueta)}: <strong>${esc(m.nombre)}</strong></p>`}
      ${p.telas.length > 1 ? `<fieldset class="opciones" data-grupo="tela"><legend>Tela <span class="opciones-aviso">· ${esc(t?.nombre)}</span></legend><div class="chips chips--telas">${p.telas.map(id => { const x = telaDe(id); return `<label class="chip-tela" title="${esc(x.nombre)}"><input type="radio" name="qv-tela" value="${esc(x.id)}"${x.id === estado.tela ? ' checked' : ''}><img src="${esc(x.img)}" alt="" width="240" height="240"><span class="sr-only">${esc(x.nombre)}</span></label>`; }).join('')}</div></fieldset>` : `<p class="qv-pres">Tela: <strong>${esc(t?.nombre)}</strong></p>`}
      <p class="qv-stock">${sinStock ? 'Sin stock en esta medida: encargala a medida.' : m.stock <= 3 ? `Quedan ${m.stock} en esta medida.` : 'Disponible para enviar o retirar.'}</p>
      <div class="qv-acciones">
        <div class="stepper" data-qv-stepper>
          <button type="button" data-qv-paso="-1" aria-label="Restar uno">${ICONOS.menos}</button>
          <output aria-label="Cantidad">${estado.qty}</output>
          <button type="button" data-qv-paso="1" aria-label="Sumar uno">${ICONOS.mas}</button>
        </div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="qv-medida" href="${esc(paginaInicio())}?pieza=${encodeURIComponent(p.pieza)}#a-medida">${ICONOS.tijera}<span>¿Necesitás otra medida? <strong>Encargala a medida</strong></span></a>
      <dl class="qv-ficha">
        <div><dt>${esc(etiqueta)}</dt><dd>${esc(m.nombre)}</dd></div>
        <div><dt>Tela</dt><dd>${esc(t?.nombre)}</dd></div>
        <div><dt>Telas posibles</dt><dd>${p.telas.map(id => esc(telaDe(id)?.nombre)).join(', ')}</dd></div>
      </dl>
      ${rel.length ? `<div class="qv-rel"><h3>También te puede gustar</h3><ul>${rel.map(r => `<li><a href="${esc(urlProducto(r.id))}" data-ver="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="900" height="900"><span>${esc(r.nombre)}</span><strong>${formatearPrecio(precioDesde(r))}</strong></a></li>`).join('')}</ul></div>` : ''}`;
    img.src = p.img;
    img.alt = p.nombre;
    telaSel.innerHTML = t ? `<img src="${esc(t.img)}" alt="" width="240" height="240"><span>${esc(t.nombre)}</span>` : '';
    let ld = document.getElementById('ld-producto');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld-producto'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc, category: catDe(p.cat)?.nombre, brand: { '@type': 'Brand', name: 'Nile' },
      image: new URL(p.img, location.href).href,
      offers: p.medidas.map(x => ({ '@type': 'Offer', name: x.nombre, priceCurrency: 'ARS', price: conDescuento(p, x.precio), availability: x.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: new URL(urlProducto(p.id), location.href).href })),
    });
  };

  const agregar = () => {
    const p = estado.p;
    Cart.add(p, estado.qty, { med: estado.med, tela: estado.tela });
    showToast(`${p.nombre} · ${telaDe(estado.tela)?.nombre || ''} al carrito`);
    return true;
  };

  const abrir = (id, { qty = 1, foco = null } = {}) => {
    const p = getProducto(id);
    if (!p) return;
    const m = p.medidas.find(x => x.stock > 0) || p.medidas[0];
    estado = { p, med: m.id, tela: p.telas[0], qty: Math.max(1, Math.min(qty, m.stock || 1)) };
    if (bd.hidden) opener = document.activeElement;
    pintar();
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    modal.scrollTop = 0;
    const objetivo = foco === 'opciones' ? info.querySelector('.opciones input:checked, .opciones input:not(:disabled)') : null;
    (objetivo || bd.querySelector('.qv-close')).focus();
    const url = new URL(location.href);
    url.searchParams.set('producto', id);
    window.history.replaceState(null, '', url);
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    const url = new URL(location.href);
    url.searchParams.delete('producto');
    window.history.replaceState(null, '', url);
    opener?.focus?.();
  };
  abrirVista = abrir;
  bd.addEventListener('click', e => { if (e.target === bd) cerrar(); });
  bd.querySelector('.qv-close').addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); trampaFoco(modal, e); });
  info.addEventListener('change', e => {
    if (e.target.name === 'qv-med') {
      estado.med = e.target.value;
      const m = medDe(estado.p, estado.med);
      estado.qty = Math.min(estado.qty, m.stock || 1);
      pintar();
      info.querySelector(`input[name="qv-med"][value="${window.CSS.escape(estado.med)}"]`)?.focus();
    }
    if (e.target.name === 'qv-tela') {
      estado.tela = e.target.value;
      pintar();
      info.querySelector(`input[name="qv-tela"][value="${window.CSS.escape(estado.tela)}"]`)?.focus();
    }
  });
  info.addEventListener('click', e => {
    const paso = e.target.closest('[data-qv-paso]');
    if (paso) {
      const m = medDe(estado.p, estado.med);
      estado.qty = Math.max(1, Math.min(estado.qty + Number(paso.dataset.qvPaso), m.stock || 1));
      info.querySelector('[data-qv-stepper] output').textContent = estado.qty;
      return;
    }
    if (e.target.closest('[data-qv-add]')) { if (agregar()) cerrar(); return; }
    if (e.target.closest('[data-qv-comprar]')) { if (agregar()) { cerrar(); abrirCarrito(); } return; }
    if (e.target.closest('.qv-medida')) cerrar();
  });
  const inicial = new URLSearchParams(location.search).get('producto');
  if (inicial && getProducto(inicial)) abrir(inicial);
}

function initAccionesProducto() {
  document.addEventListener('click', e => {
    const ver = e.target.closest('[data-ver]');
    if (ver) {
      e.preventDefault();
      abrirVista(ver.dataset.ver);
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]').querySelector('output');
      out.textContent = Math.max(1, Math.min(99, Number(out.textContent) + Number(paso.dataset.paso)));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (!add) return;
    const p = getProducto(add.dataset.add);
    if (!p) return;
    const qty = Number(add.closest('.prod')?.querySelector('[data-stepper] output')?.textContent) || 1;
    if (necesitaOpciones(p)) { abrirVista(p.id, { qty, foco: 'opciones' }); return; }
    Cart.add(p, qty, { med: p.medidas[0].id, tela: p.telas[0] });
    showToast(`${p.nombre} al carrito`);
    add.classList.remove('ok'); void add.offsetWidth; add.classList.add('ok');
  });
}

function initDestacados() {
  const grid = document.querySelector('[data-grilla="destacados"]');
  if (grid) {
    const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 4 });
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
  }
  const vidriera = document.querySelector('[data-grilla="vidriera"]');
  if (vidriera) {
    const { items } = Tienda.consultar({ orden: 'destacados', limite: 7 });
    vidriera.insertAdjacentHTML('afterbegin', items.map(tileHTML).join(''));
  }
}

function initTelas() {
  $$('[data-telas]').forEach(ul => {
    ul.innerHTML = TELAS.map(t => {
      const n = Tienda.contar({ tela: t.id });
      return `<li data-animate="escala" style="opacity:0;transform:translateY(20px) scale(.92)">
        <a class="muestra" href="${paginaCatalogo()}?tela=${t.id}">
          <span class="muestra-tela tela-img tela-${esc(t.id)}" aria-hidden="true"></span>
          <span class="muestra-nombre">${esc(t.nombre)}</span>
          <small>${n} ${n === 1 ? 'pieza' : 'piezas'}</small>
        </a>
      </li>`;
    }).join('');
  });
}

function initRailDrag(vp, prev, next) {
  const track = vp.firstElementChild;
  const paso = () => (track?.firstElementChild?.getBoundingClientRect().width || 280) + 16;
  const flechas = () => {
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= inicio + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', flechas, { passive: true });
  window.addEventListener('resize', flechas, { passive: true });
  flechas();

  let down = false, moved = false, startX = 0, startLeft = 0, pointerId = 0;
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
      try { vp.setPointerCapture?.(pointerId); } catch { /* sin capture el arrastre igual funciona */ }
    }
    if (moved) vp.scrollLeft = startLeft - dx;
  });
  const end = () => {
    if (!down) return;
    down = false;
    try { vp.releasePointerCapture?.(pointerId); } catch { /* ya liberado */ }
    if (moved) {
      const matar = ev => { ev.preventDefault(); ev.stopPropagation(); };
      vp.addEventListener('click', matar, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', matar, { capture: true }), 0);
    }
    vp.classList.remove('dragging');
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('lostpointercapture', end);
  return flechas;
}

function initGaleria() {
  const sec = document.querySelector('[data-galeria]');
  if (!sec) return;
  const items = $$('.g-item', sec);
  const vp = $('.galeria-vp', sec);
  if (vp) initRailDrag(vp, $('[data-rail-prev]', sec), $('[data-rail-next]', sec));

  document.body.insertAdjacentHTML('beforeend', `
    <div class="visor-bd" id="visor" hidden>
      <div class="visor" role="dialog" aria-modal="true" aria-label="Galería de trabajos">
        <button type="button" class="icon-btn visor-close" aria-label="Cerrar la galería">${ICONOS.cerrar}</button>
        <figure class="visor-fig">
          <div class="visor-foto"><img src="images/g-mantel.webp" alt="" width="800" height="958" data-visor-img></div>
          <figcaption>
            <span class="visor-n" data-visor-n></span>
            <strong data-visor-t></strong>
            <small data-visor-d></small>
            <a class="btn btn--line" data-visor-wa href="${waLink('Hola Nile! Vi un trabajo en la galería y quiero uno parecido.')}" target="_blank" rel="noopener">${ICONOS.wsp}<span>Pedí uno parecido</span></a>
          </figcaption>
        </figure>
        <button type="button" class="visor-nav visor-prev" data-visor-paso="-1" aria-label="Trabajo anterior">${ICONOS.izq}</button>
        <button type="button" class="visor-nav visor-next" data-visor-paso="1" aria-label="Trabajo siguiente">${ICONOS.der}</button>
      </div>
    </div>`);
  const bd = $('#visor');
  const modal = $('.visor', bd);
  const img = $('[data-visor-img]', bd);
  let opener = null;
  let actual = 0;
  const mostrar = i => {
    actual = (i + items.length) % items.length;
    const it = items[actual];
    const foto = it.querySelector('img');
    img.src = foto.getAttribute('src');
    img.alt = foto.alt;
    img.width = foto.width;
    img.height = foto.height;
    const titulo = it.querySelector('.g-cap strong').textContent;
    $('[data-visor-n]', bd).textContent = `${actual + 1} / ${items.length}`;
    $('[data-visor-t]', bd).textContent = titulo;
    $('[data-visor-d]', bd).textContent = it.querySelector('.g-cap small').textContent;
    $('[data-visor-wa]', bd).href = waLink(`Hola Nile! Vi en la galería «${titulo}» y quiero uno parecido.`);
  };
  const abrir = it => {
    opener = document.activeElement;
    mostrar(items.indexOf(it));
    bd.hidden = false;
    bloquear(true);
    requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('open')));
    $('.visor-close', bd).focus();
  };
  const cerrar = () => {
    bd.classList.remove('open');
    bd.hidden = true;
    bloquear(false);
    opener?.focus?.();
  };
  sec.addEventListener('click', e => {
    const b = e.target.closest('.g-btn');
    if (b) abrir(b.closest('.g-item'));
  });
  bd.addEventListener('click', e => {
    if (e.target === bd) { cerrar(); return; }
    const paso = e.target.closest('[data-visor-paso]');
    if (paso) mostrar(actual + Number(paso.dataset.visorPaso));
  });
  $('.visor-close', bd).addEventListener('click', cerrar);
  bd.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrar();
    else if (e.key === 'ArrowLeft') mostrar(actual - 1);
    else if (e.key === 'ArrowRight') mostrar(actual + 1);
    trampaFoco(modal, e);
  });
}

function initAMedida() {
  const form = document.querySelector('[data-a-medida]');
  if (!form) return;
  const pieza = $('#am-pieza', form);
  const medida = $('#am-medida', form);
  const tela = $('#am-tela', form);
  const nota = $('#am-nota', form);
  const vista = $('[data-am-vista]', form);
  const enviar = $('[data-am-enviar]', form);
  pieza.insertAdjacentHTML('beforeend', PIEZAS.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join(''));
  tela.insertAdjacentHTML('beforeend', TELAS.map(t => `<option value="${esc(t.nombre)}">${esc(t.nombre)}</option>`).join(''));
  const pedida = new URLSearchParams(location.search).get('pieza');
  if (pedida && PIEZAS.includes(pedida)) pieza.value = pedida;

  const texto = () => [
    'Hola Nile! Quiero encargar una pieza a medida.',
    `• Pieza: ${pieza.value || 'a definir'}`,
    `• Medida: ${medida.value.trim() || 'a definir'}`,
    `• Tela: ${tela.value || 'quiero que me asesoren'}`,
    nota.value.trim() ? `• Detalle: ${nota.value.trim()}` : '',
  ].filter(Boolean).join('\n');
  const actualizar = () => {
    vista.textContent = texto();
    enviar.href = waLink(texto());
  };
  const marcar = (campo, mal) => {
    campo.setAttribute('aria-invalid', String(mal));
    campo.closest('.campo')?.classList.toggle('campo--error', mal);
  };
  form.addEventListener('input', e => { if (e.target.matches('select, input, textarea')) marcar(e.target, false); actualizar(); });
  form.addEventListener('change', actualizar);
  enviar.addEventListener('click', e => {
    const faltaPieza = !pieza.value;
    const faltaMedida = !medida.value.trim();
    marcar(pieza, faltaPieza);
    marcar(medida, faltaMedida);
    if (faltaPieza || faltaMedida) {
      e.preventDefault();
      (faltaPieza ? pieza : medida).focus();
      showToast('Contanos la pieza y la medida para armar el mensaje.');
    }
  });
  actualizar();
}

function initCatalogo() {
  const app = document.querySelector('[data-catalogo-app]');
  if (!app) return;
  const grid = $('[data-resultados]', app);
  const verMas = $('[data-ver-mas]', app);
  const contador = $('[data-contador]', app);
  const vacio = $('[data-vacio]', app);
  const chipsActivos = $('[data-activos]', app);
  const buscador = $('#cat-q', app);
  const orden = $('#cat-orden', app);
  const panel = $('[data-filtros]', app);
  const abrirFiltros = $('[data-abrir-filtros]', app);
  const cuentaRes = $('[data-cuenta-res]', app);
  const miga = document.querySelector('[data-miga]');
  const titulo = document.querySelector('[data-cat-titulo]');

  $('[data-f-grupo="cat"]', panel).innerHTML = CATEGORIAS.map(c => `<label class="chk"><input type="checkbox" data-f="cat" value="${c.id}"><span>${esc(c.nombre)}</span><small>${Tienda.contar({ cat: c.id })}</small></label>${c.subs ? `<div class="chk-subs">${c.subs.map(s => `<label class="chk chk--sub"><input type="checkbox" data-f="sub" value="${s.id}"><span>${esc(s.nombre)}</span><small>${Tienda.contar({ sub: s.id })}</small></label>`).join('')}</div>` : ''}`).join('');
  $('[data-f-grupo="tela"]', panel).innerHTML = TELAS.map(t => `<label class="chk chk--tela"><input type="checkbox" data-f="tela" value="${t.id}"><span class="tela-img tela-${t.id}" aria-hidden="true"></span><span>${esc(t.nombre)}</span><small>${Tienda.contar({ tela: t.id })}</small></label>`).join('');
  $('[data-f-grupo="precio"]', panel).innerHTML = [['', 'Todos los precios'], ...Object.entries(PRECIOS).map(([k, v]) => [k, v[2]])].map(([k, t]) => `<label class="chk chk--radio"><input type="radio" name="precio" data-f="precio" value="${k}"><span>${esc(t)}</span></label>`).join('');
  orden.innerHTML = Object.entries(ORDENES).map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('');

  const params = new URLSearchParams(location.search);
  const validos = (v, lista) => String(v || '').split(',').filter(x => lista.includes(x));
  const estado = {
    q: (params.get('q') || '').slice(0, 60),
    cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
    sub: validos(params.get('sub'), SUBCATEGORIAS.map(s => s.id)),
    tela: validos(params.get('tela'), TELAS.map(t => t.id)),
    precio: PRECIOS[params.get('precio')] ? params.get('precio') : '',
    orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
  };
  let cursor = null;
  let mostrados = 0;

  const filtrosDe = () => ({ cat: estado.cat, sub: estado.sub, tela: estado.tela, precio: estado.precio });
  const sincronizarUI = () => {
    buscador.value = estado.q;
    orden.value = estado.orden;
    ['cat', 'sub', 'tela'].forEach(k => $$(`input[data-f="${k}"]`, panel).forEach(i => { i.checked = estado[k].includes(i.value); }));
    $$('input[data-f="precio"]', panel).forEach(i => { i.checked = i.value === estado.precio; });
    const c = estado.cat.length === 1 && !estado.sub.length ? catDe(estado.cat[0]) : null;
    const s = estado.sub.length === 1 ? subDe(estado.sub[0]) : null;
    const t = !c && !s && estado.tela.length === 1 ? telaDe(estado.tela[0]) : null;
    if (miga) {
      const cat = paginaCatalogo();
      if (s) miga.innerHTML = `<a href="${cat}">Catálogo</a><span aria-hidden="true">/</span><a href="${cat}?cat=${s.cat}">${esc(catDe(s.cat).nombre)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(s.nombre)}</span>`;
      else if (c) miga.innerHTML = `<a href="${cat}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.nombre)}</span>`;
      else if (t) miga.innerHTML = `<a href="${cat}">Catálogo</a><span aria-hidden="true">/</span><span aria-current="page">Tela ${esc(t.nombre)}</span>`;
      else miga.innerHTML = '<span aria-current="page">Catálogo</span>';
    }
    if (titulo) titulo.textContent = s ? `${catDe(s.cat).nombre}: ${s.nombre.toLowerCase()}` : c ? `Textiles para ${c.id === 'hogar' ? 'el hogar' : c.nombre.toLowerCase()}` : t ? `Piezas en ${t.nombre.toLowerCase()}` : 'Catálogo de textiles';
    $$('[data-menu-cats] a').forEach(a => {
      const u = new URL(a.href);
      const ac = u.searchParams.get('cat'), as = u.searchParams.get('sub');
      const activo = as ? estado.sub.length === 1 && estado.sub[0] === as : !estado.sub.length && estado.cat.length === 1 && estado.cat[0] === ac;
      if (activo) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['q', 'cat', 'sub', 'tela', 'precio', 'orden'].forEach(k => u.searchParams.delete(k));
    if (estado.q) u.searchParams.set('q', estado.q);
    ['cat', 'sub', 'tela'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); });
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintarActivos = () => {
    const chips = [
      ...(estado.q ? [['q', '', `«${estado.q}»`]] : []),
      ...estado.cat.map(c => ['cat', c, catDe(c).nombre]),
      ...estado.sub.map(s => ['sub', s, subDe(s).nombre]),
      ...estado.tela.map(t => ['tela', t, telaDe(t).nombre]),
      ...(estado.precio ? [['precio', estado.precio, PRECIOS[estado.precio][2]]] : []),
    ];
    chipsActivos.innerHTML = chips.length ? chips.map(([k, v, t]) => `<button type="button" class="activo" data-quitar="${k}" data-valor="${esc(v)}" aria-label="Quitar filtro ${esc(t)}">${esc(t)}${ICONOS.cerrar}</button>`).join('') + '<button type="button" class="activos-limpiar" data-limpiar>Limpiar filtros</button>' : '';
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    cursor = res.cursor;
    if (!agregar) { grid.innerHTML = ''; mostrados = 0; }
    grid.insertAdjacentHTML('beforeend', res.items.map(p => cardHTML(p)).join(''));
    mostrados += res.items.length;
    verMas.hidden = !cursor;
    vacio.hidden = mostrados > 0;
    const total = estado.q ? null : Tienda.contar(filtrosDe());
    contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'pieza' : 'piezas'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
    if (cuentaRes) cuentaRes.textContent = total != null ? total : `${mostrados}${cursor ? '+' : ''}`;
    $('[data-vacio-q]', vacio).textContent = estado.q ? `No encontramos «${estado.q}» con esos filtros.` : 'No hay piezas con esa combinación de filtros.';
    pintarActivos();
    revelarNuevos(grid);
    refrescarScroll();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => { Object.assign(estado, { q: '', cat: [], sub: [], tela: [], precio: '' }); aplicar(); };

  panel.addEventListener('change', e => {
    const f = e.target.dataset.f;
    if (!f) return;
    if (f === 'cat' || f === 'sub' || f === 'tela') estado[f] = $$(`input[data-f="${f}"]:checked`, panel).map(i => i.value);
    if (f === 'precio') estado.precio = e.target.value;
    aplicar();
  });
  orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
  let t = 0;
  buscador.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
  $('[data-form-buscar]', app).addEventListener('submit', e => { e.preventDefault(); clearTimeout(t); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
  verMas.addEventListener('click', () => pintar(true));
  app.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const k = quitar.dataset.quitar;
      if (k === 'q') estado.q = '';
      else if (k === 'precio') estado.precio = '';
      else estado[k] = estado[k].filter(v => v !== quitar.dataset.valor);
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });

  const cerrarPanel = () => { panel.classList.remove('open'); abrirFiltros.setAttribute('aria-expanded', 'false'); bloquear(false); abrirFiltros.focus(); };
  abrirFiltros.addEventListener('click', () => {
    panel.classList.add('open'); abrirFiltros.setAttribute('aria-expanded', 'true'); bloquear(true);
    panel.querySelector('input')?.focus();
  });
  $$('[data-cerrar-filtros]', panel).forEach(b => b.addEventListener('click', cerrarPanel));
  panel.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) cerrarPanel(); });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches && panel.classList.contains('open')) { panel.classList.remove('open'); bloquear(false); } });

  sincronizarUI();
  pintar();
  if (location.hash === '#buscar') buscador.focus();
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const imgs = hero.querySelectorAll('[data-hero-img]');
  if (imgs.length) tl.from(imgs, { scale: 1.1, duration: 1.8, stagger: 0.08 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero-pespunte'), { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.45)
    .from(hero.querySelectorAll('.hero-lead'), { y: 24, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.puerta'), { y: 40, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.5)
    .from(hero.querySelectorAll('.etiqueta'), { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  if (typeof ScrollTrigger !== 'undefined') {
    const foto = hero.querySelector('[data-parallax]');
    if (foto && window.matchMedia('(min-width: 861px)').matches) gsap.to(foto, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }
}

function iniciar() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  initAntiCopia();
  initModelBarScroll();
  initCuentas();
  initMenuCategorias();
  initNav();
  initDestacados();
  initTelas();
  initCatalogo();
  initGaleria();
  initAMedida();
  initCarrito();
  initVistaRapida();
  initAccionesProducto();
  initFloats();
  initHeroMotion();
  initReveals();
  document.addEventListener('cart:updated', updateCartBadge);
  updateCartBadge();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
}
