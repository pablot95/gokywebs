const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

const WSP = '5491135617395';
const linkWsp = texto => `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina === 'catalogo' ? 'catalogo' : 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

const CATEGORIAS = [
  { id: 'viandas', nombre: 'Viandas', bajada: 'Platos de chef listos para calentar' },
  { id: 'packs', nombre: 'Packs semanales', bajada: '5, 10 o 20 viandas con el menú que elijas' },
  { id: 'bandejas', nombre: 'Bandejas para eventos', bajada: 'Tarteletas, sándwiches y wraps' },
];

const TIPOS = [
  { id: 'pollo', nombre: 'Pollo' },
  { id: 'pescado', nombre: 'Pescado' },
  { id: 'carne', nombre: 'Carne' },
  { id: 'vegetariana', nombre: 'Vegetariana' },
  { id: 'surtido', nombre: 'Surtido' },
];

const RANGOS = [
  { id: 'hasta-10', nombre: 'Hasta $10.000', min: null, max: 9999 },
  { id: '10-20', nombre: '$10.000 a $20.000', min: 10000, max: 19999 },
  { id: '20-50', nombre: '$20.000 a $50.000', min: 20000, max: 49999 },
  { id: 'mas-50', nombre: 'Más de $50.000', min: 50000, max: null },
];

const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];

const PRODUCTOS = [
  {
    id: 'pollo-hierbas-quinoa', nombre: 'Pollo a las hierbas con quinoa y vegetales asados', corto: 'Pollo a las hierbas',
    cat: 'viandas', tipo: 'pollo', img: 'p-pollo', w: 941, rango: 1, opsTitulo: 'Porción',
    alt: 'Bandeja con pechuga de pollo grillada en láminas, quinoa y vegetales asados',
    desc: 'Pechuga grillada con hierbas y pimienta, quinoa graneada y vegetales asados al horno.',
    trae: ['Pechuga de pollo grillada a las hierbas', 'Quinoa graneada', 'Brócoli, zapallito, morrones, zanahoria y cebolla morada asados'],
    ops: [{ v: 'Regular · 420 g', precio: 9800 }, { v: 'Grande · 560 g', precio: 12200 }],
    tags: ['pechuga', 'quinoa', 'brocoli', 'verduras', 'proteina'],
  },
  {
    id: 'salmon-quinoa-tricolor', nombre: 'Salmón rosado con quinoa tricolor y vegetales', corto: 'Salmón rosado',
    cat: 'viandas', tipo: 'pescado', img: 'p-salmon', rango: 2, opsTitulo: 'Porción',
    alt: 'Bandeja con filet de salmón grillado sobre quinoa tricolor, vegetales asados y una rodaja de limón',
    desc: 'Filet de salmón grillado con limón, sobre quinoa tricolor y vegetales asados.',
    trae: ['Filet de salmón rosado grillado', 'Quinoa tricolor', 'Brócoli, zapallito, zanahoria, morrón y cebolla morada', 'Limón para condimentar'],
    ops: [{ v: 'Regular · 420 g', precio: 13900 }, { v: 'Grande · 560 g', precio: 17400 }],
    tags: ['salmon', 'pescado', 'quinoa', 'limon'],
  },
  {
    id: 'medallones-lentejas-boniato', nombre: 'Medallones de lentejas con boniato asado y mix verde', corto: 'Medallones de lentejas',
    cat: 'viandas', tipo: 'vegetariana', img: 'p-lentejas', rango: 3, opsTitulo: 'Porción',
    alt: 'Bandeja con dos medallones de lentejas, boniato asado en cubos y ensalada de hojas verdes',
    desc: 'Dos medallones de lentejas especiados, boniato asado en cubos y mix de hojas verdes.',
    trae: ['Dos medallones de lentejas', 'Boniato asado en cubos', 'Hojas verdes, tomate cherry, repollo morado y zanahoria'],
    ops: [{ v: 'Regular · 420 g', precio: 8900 }, { v: 'Grande · 560 g', precio: 11100 }],
    tags: ['veggie', 'vegetariano', 'legumbres', 'batata', 'ensalada'],
  },
  {
    id: 'cuadril-pimienta-vegetales', nombre: 'Colita de cuadril a la pimienta con vegetales grillados', corto: 'Colita de cuadril',
    cat: 'viandas', tipo: 'carne', img: 'p-cuadril', rango: 4, opsTitulo: 'Porción',
    alt: 'Bandeja de cartón con colita de cuadril en láminas, espárragos, zanahorias y vegetales grillados',
    desc: 'Colita de cuadril sellada a la pimienta y cortada en láminas, con vegetales grillados.',
    trae: ['Colita de cuadril a la pimienta', 'Espárragos, zanahorias y zapallitos grillados', 'Papines y cebolla morada'],
    ops: [{ v: 'Regular · 420 g', precio: 11600 }, { v: 'Grande · 560 g', precio: 14500 }],
    tags: ['carne', 'vaca', 'esparragos', 'verduras', 'proteina'],
  },
  {
    id: 'ensalada-quinoa-garbanzos', nombre: 'Ensalada de quinoa, garbanzos, palta y queso feta', corto: 'Ensalada de quinoa',
    cat: 'viandas', tipo: 'vegetariana', img: 'p-quinoa', rango: 5, opsTitulo: 'Porción',
    alt: 'Bandeja con ensalada de quinoa, garbanzos, tomates cherry, queso feta y palta en láminas',
    desc: 'Quinoa con garbanzos, tomates cherry, pepino, queso feta y palta en láminas, con limón.',
    trae: ['Quinoa y garbanzos', 'Tomate cherry, pepino y cebolla morada', 'Queso feta y palta en láminas', 'Limón para condimentar'],
    ops: [{ v: 'Regular · 420 g', precio: 9200 }, { v: 'Grande · 560 g', precio: 11500 }],
    tags: ['veggie', 'vegetariano', 'ensalada', 'palta', 'legumbres', 'fria'],
  },
  {
    id: 'pack-semanal-5', nombre: 'Pack semanal: 5 viandas', corto: 'Pack de 5 viandas',
    cat: 'packs', tipo: 'surtido', pack: 5, rango: 6, opsTitulo: 'Menú',
    sub: 'Un almuerzo por día, de lunes a viernes',
    desc: 'Cinco viandas para resolver los almuerzos de la semana. Elegís el menú y el chef arma la combinación con los platos de la carta.',
    trae: ['5 viandas de 420 g', 'Combinación armada por el chef', 'Entrega coordinada por WhatsApp'],
    ops: [{ v: 'Mix del chef', precio: 46500 }, { v: 'Vegetariano', precio: 46500 }, { v: 'Sin carnes rojas', precio: 46500 }],
    tags: ['semana', 'almuerzo', 'combo', 'plan'],
  },
  {
    id: 'pack-semanal-10', nombre: 'Pack semanal: 10 viandas', corto: 'Pack de 10 viandas',
    cat: 'packs', tipo: 'surtido', pack: 10, rango: 7, opsTitulo: 'Menú',
    sub: 'Almuerzo y cena, de lunes a viernes',
    desc: 'Diez viandas para almorzar y cenar toda la semana sin cocinar. Elegís el menú y el chef arma la combinación.',
    trae: ['10 viandas de 420 g', 'Combinación armada por el chef', 'Entrega coordinada por WhatsApp'],
    ops: [{ v: 'Mix del chef', precio: 89000 }, { v: 'Vegetariano', precio: 89000 }, { v: 'Sin carnes rojas', precio: 89000 }],
    tags: ['semana', 'almuerzo', 'cena', 'combo', 'plan'],
  },
  {
    id: 'pack-mensual-20', nombre: 'Pack mensual: 20 viandas', corto: 'Pack de 20 viandas',
    cat: 'packs', tipo: 'surtido', pack: 20, rango: 8, opsTitulo: 'Menú',
    sub: 'Los almuerzos de todo el mes',
    desc: 'Veinte viandas para los almuerzos del mes. Elegís el menú y coordinamos las entregas por semana.',
    trae: ['20 viandas de 420 g', 'Combinación armada por el chef', 'Entregas coordinadas por WhatsApp'],
    ops: [{ v: 'Mix del chef', precio: 169000 }, { v: 'Vegetariano', precio: 169000 }, { v: 'Sin carnes rojas', precio: 169000 }],
    tags: ['mes', 'almuerzo', 'combo', 'plan'],
  },
  {
    id: 'tarteletas-surtidas', nombre: 'Tarteletas surtidas para eventos', corto: 'Tarteletas surtidas',
    cat: 'bandejas', tipo: 'vegetariana', img: 'p-tarteletas', rango: 9, opsTitulo: 'Bandeja',
    alt: 'Fuente con tarteletas de tomates, hongos, espinaca y calabaza',
    desc: 'Tarteletas de tomates confitados con queso, hongos salteados, espinaca y calabaza. Listas para servir.',
    trae: ['Tomates confitados y queso', 'Hongos salteados', 'Espinaca y queso', 'Calabaza'],
    ops: [{ v: 'Bandeja de 24', precio: 38400 }, { v: 'Bandeja de 48', precio: 74900 }],
    tags: ['catering', 'evento', 'cumpleanos', 'bocados', 'tartas', 'hongos'],
  },
  {
    id: 'sandwiches-wraps', nombre: 'Sándwiches integrales y wraps', corto: 'Sándwiches y wraps',
    cat: 'bandejas', tipo: 'surtido', img: 'p-sandwiches', rango: 10, opsTitulo: 'Bandeja',
    alt: 'Bandeja de madera con sándwiches de pan integral y wraps de pollo con hojas verdes',
    desc: 'Sándwiches en pan integral con vegetales frescos y wraps de pollo con hojas verdes. Para reuniones y cumpleaños.',
    trae: ['Sándwiches de pan integral', 'Wraps de pollo con hojas verdes', 'Vegetales frescos'],
    ops: [{ v: 'Bandeja de 30', precio: 41000 }, { v: 'Bandeja de 60', precio: 79500 }],
    tags: ['catering', 'evento', 'oficina', 'reunion', 'pollo', 'integral'],
  },
  {
    id: 'risotto-hongos', nombre: 'Risotto de hongos', corto: 'Risotto de hongos', visible: false,
    cat: 'viandas', tipo: 'vegetariana', img: 'p-lentejas', opsTitulo: 'Porción',
    alt: '', desc: 'Próximamente.', ops: [{ v: 'Regular · 420 g', precio: 9600 }],
  },
];

const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
const precioOp = (p, i = 0) => {
  const op = p.ops[i] || p.ops[0];
  return p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio;
};
const precioDesde = p => Math.min(...p.ops.map((_, i) => precioOp(p, i)));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  const desde = p => Math.min(...p.ops.map(op => (p.descuento > 0 ? Math.round(op.precio * (1 - p.descuento / 100)) : op.precio)));
  function coincide(p, f) {
    const cat = lista(f.cat), tipo = lista(f.tipo), excluir = lista(f.excluir), rangos = lista(f.rangos);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (tipo.length && !tipo.includes(p.tipo)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (rangos.length) {
      const d = desde(p);
      if (!rangos.some(r => (r.min == null || d >= r.min) && (r.max == null || d <= r.max))) return false;
    }
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => desde(a) - desde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => desde(b) - desde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
  const contar = (filtros = {}) => visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  const obtener = id => {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  };
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    const cat = CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
    const tipo = TIPOS.find(t => t.id === p.tipo)?.nombre || '';
    textoBusqueda.set(p.id, norm([p.nombre, cat, tipo, p.desc, p.sub, ...(p.trae || []), ...p.ops.map(o => o.v), ...(p.tags || [])].join(' ')));
  }
  return textoBusqueda.get(p.id);
}

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let paginas = 0;
  let siguiente = null;
  for (;;) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      if (!palabras.every(w => textoDe(p).includes(w))) continue;
      if (items.length === limite) { siguiente = items[items.length - 1].id; break; }
      items.push(p);
    }
    if (siguiente || !pag.cursor) break;
    c = pag.cursor;
  }
  return { items, cursor: siguiente, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const getProducto = id => Tienda.obtener(id);

const ICO = {
  flecha: '<svg class="ico ico--flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  tacho: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  fuego: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
};

const Cart = {
  KEY: 'cheftincho_cart',
  get() {
    try {
      const v = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(v) ? v.filter(i => i && typeof i.id === 'string' && i.qty > 0).map(i => ({ id: i.id, op: Number.isInteger(i.op) ? i.op : 0, qty: Math.min(Math.round(i.qty), 99) })) : [];
    } catch { return []; }
  },
  save(items) {
    try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { this.sinGuardar = true; }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(producto, qty = 1, op = 0) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.op === op);
    if (existing) existing.qty = Math.min(existing.qty + qty, producto.stock ?? 99);
    else items.push({ id: producto.id, op, qty: Math.min(qty, producto.stock ?? 99) });
    this.save(items);
  },
  setQty(id, op, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.op === op);
    if (!it) return;
    const p = getProducto(id);
    it.qty = Math.max(1, Math.min(qty, p?.stock ?? 99));
    this.save(items);
  },
  remove(id, op) { this.save(this.get().filter(i => !(i.id === id && i.op === op))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => (getProducto(i.id) ? s + i.qty : s), 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioOp(p, i.op) * i.qty : s; }, 0); },
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

const nombreTipo = p => TIPOS.find(t => t.id === p.tipo)?.nombre || '';
const nombreCat = p => CATEGORIAS.find(c => c.id === p.cat)?.nombre || '';
const metaDe = p => (p.pack ? `Pack · ${p.ops[0].v}` : `${nombreTipo(p)} · ${p.ops[0].v}`);

function mediaHTML(p, tam = 'card') {
  if (p.pack) {
    if (tam === 'mini') return `<span class="pack-mini pack-mini--${p.pack}" aria-hidden="true"><b>${p.pack}</b><span>viandas</span></span>`;
    return `<span class="pack-tile pack-tile--${p.pack}" aria-hidden="true"><b>${p.pack}</b><span>viandas</span><small>${esc(p.sub)}</small></span>`;
  }
  const ancho = p.w || 1000;
  const sizes = tam === 'mini' ? '104px' : tam === 'qv' ? '(max-width: 860px) 100vw, 490px' : '(max-width: 640px) 48vw, (max-width: 1180px) 32vw, 360px';
  return `<img src="images/${p.img}${tam === 'mini' ? '-sm' : ''}.webp" srcset="images/${p.img}-sm.webp 480w, images/${p.img}.webp ${ancho}w" sizes="${sizes}" alt="${esc(p.alt)}" width="${ancho}" height="${ancho}">`;
}

function precioHTML(p) {
  const orig = p.descuento > 0 ? `<s>${formatearPrecio(p.ops[0].precio)}</s>` : '';
  return `<b>${formatearPrecio(precioOp(p, 0))}</b>${orig}`;
}

function cardHTML(p, anim = true) {
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(48px)"' : '';
  const badge = p.descuento > 0 ? `<span class="badge">-${p.descuento}%</span>` : '';
  return `<article class="pcard${p.pack ? ' pcard--pack' : ''}"${a}>
  <button type="button" class="pcard__media" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p)}${badge}</button>
  <div class="pcard__etq"><p class="pcard__meta">${esc(metaDe(p))}</p><h3 class="pcard__nom">${esc(p.nombre)}</h3></div>
  <div class="pcard__pie">
    <p class="pcard__precio">${precioHTML(p)}</p>
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${p.id}" aria-label="Agregar ${esc(p.corto)} al carrito">${ICO.carrito}<span>Agregar</span></button>
    </div>
    <button type="button" class="pcard__ya" data-buy="${p.id}">Comprar ahora</button>
  </div>
</article>`;
}

function filaHTML(p, anim = true) {
  const a = anim ? ' data-animate="subir" style="opacity:0;transform:translateY(32px)"' : '';
  const orig = p.descuento > 0 ? `<s>${formatearPrecio(p.ops[0].precio)}</s>` : '';
  return `<li class="fila"${a}>
  <button type="button" class="fila__media" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p, 'mini')}</button>
  <div class="fila__txt"><h3 class="fila__nom">${esc(p.nombre)}</h3><p class="fila__desc">${esc(p.desc)}</p><p class="fila__meta">${esc(metaDe(p))}</p></div>
  <div class="fila__pie"><p class="fila__precio">${formatearPrecio(precioOp(p, 0))}${orig}</p><button type="button" class="fila__add" data-add="${p.id}" aria-label="Sumar ${esc(p.corto)} al pedido">${ICO.mas}<span>Sumar</span></button></div>
</li>`;
}

function lineasHTML() {
  const filas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return '';
    const op = p.ops[i.op] || p.ops[0];
    return `<li class="linea">
  <span class="linea__media">${mediaHTML(p, 'mini')}</span>
  <div class="linea__txt"><p class="linea__nom">${esc(p.nombre)}</p><p class="linea__op">${esc(op.v)}</p></div>
  <p class="linea__precio">${formatearPrecio(precioOp(p, i.op) * i.qty)}</p>
  <div class="linea__acc"><div class="stepper stepper--sm"><button type="button" data-linea-step="-1" data-id="${p.id}" data-op="${i.op}" aria-label="Restar una unidad de ${esc(p.corto)}">${ICO.menos}</button><span>${i.qty}</span><button type="button" data-linea-step="1" data-id="${p.id}" data-op="${i.op}" aria-label="Sumar una unidad de ${esc(p.corto)}">${ICO.mas}</button></div>
    <button type="button" class="linea__quitar" data-linea-quitar data-id="${p.id}" data-op="${i.op}" aria-label="Quitar ${esc(p.corto)} del pedido">${ICO.tacho}</button></div>
</li>`;
  }).join('');
  return filas ? `<ul class="lineas">${filas}</ul>` : '';
}

function mensajePedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    if (!p) return null;
    const op = p.ops[i.op] || p.ops[0];
    return `• ${i.qty} × ${p.nombre} (${op.v}): ${formatearPrecio(precioOp(p, i.op) * i.qty)}`;
  }).filter(Boolean);
  if (!lineas.length) return 'Hola, Chef Tincho! Quiero hacer un pedido de viandas.';
  return ['Hola, Chef Tincho! Quiero hacer este pedido:', ...lineas, `Total: ${formatearPrecio(Cart.total())}`, '¿Coordinamos la entrega?'].join('\n');
}

function renderPedidos() {
  document.querySelectorAll('[data-pedido]').forEach(panel => {
    const cont = panel.querySelector('[data-pedido-lineas]');
    if (!cont) return;
    const html = lineasHTML();
    cont.innerHTML = html || '<p class="pedido__vacio">Sumá platos con el botón + y tu pedido se arma acá.</p>';
    const n = panel.querySelector('[data-pedido-n]');
    if (n) { const c = Cart.count(); n.textContent = c ? `${c} ${c === 1 ? 'plato' : 'platos'}` : ''; }
  });
}

function renderCartDrawer() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  if (!body || !foot) return;
  const html = lineasHTML();
  const n = Cart.count();
  document.querySelectorAll('[data-cart-titulo-n]').forEach(el => { el.textContent = n ? `${n} ${n === 1 ? 'plato' : 'platos'}` : ''; });
  if (!html) {
    body.innerHTML = `<div class="drawer__vacio"><b>Tu pedido está vacío</b><p>Elegí viandas, un pack semanal o bandejas para tu evento.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Ver el menú ${ICO.flecha}</a></div>`;
    foot.hidden = true;
    return;
  }
  body.innerHTML = html;
  foot.hidden = false;
}

function updateCartUI(bump = false) {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n;
    b.hidden = n === 0;
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump'); }
  });
  document.querySelectorAll('[data-cart-total]').forEach(el => { el.textContent = total; });
  const href = linkWsp(mensajePedido());
  document.querySelectorAll('[data-wsp-pedido]').forEach(a => { a.href = href; });
  renderPedidos();
  renderCartDrawer();
}
document.addEventListener('cart:updated', () => updateCartUI(true));

const capasAbiertas = [];
function abrirCapa(capa) {
  if (!capa) return;
  capa._foco = document.activeElement;
  capa.hidden = false;
  void capa.offsetWidth;
  capa.classList.add('open');
  if (!capasAbiertas.includes(capa)) capasAbiertas.push(capa);
  document.body.classList.add('no-scroll');
  capa.querySelector('[data-foco-inicial]')?.focus({ preventScroll: true });
}
function cerrarCapa(capa, devolverFoco = true) {
  if (!capa || !capa.classList.contains('open')) return;
  capa.classList.remove('open');
  const i = capasAbiertas.indexOf(capa);
  if (i >= 0) capasAbiertas.splice(i, 1);
  setTimeout(() => { if (!capa.classList.contains('open')) capa.hidden = true; }, 420);
  if (!capasAbiertas.length && !document.querySelector('.main-nav.open')) document.body.classList.remove('no-scroll');
  if (devolverFoco && capa._foco && document.contains(capa._foco)) capa._foco.focus({ preventScroll: true });
}
const openCartDrawer = () => abrirCapa(document.getElementById('cartDrawer'));

document.addEventListener('keydown', e => {
  const capa = capasAbiertas[capasAbiertas.length - 1];
  if (!capa) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    if (capa.id === 'qv') cerrarQV(); else cerrarCapa(capa);
    return;
  }
  if (e.key !== 'Tab') return;
  const panel = capa.querySelector('[role="dialog"]') || capa;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => el.getClientRects().length);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  else if (!panel.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
});

let qvActual = null;
function abrirQV(id) {
  const qv = document.getElementById('qv');
  const cont = document.getElementById('qvContent');
  const p = getProducto(id);
  if (!qv || !cont || !p) return;
  qvActual = { p, op: 0 };
  const rel = Tienda.consultar({ filtros: { cat: [p.cat], excluir: [p.id] }, limite: 3 }).items;
  const nota = p.cat === 'bandejas' ? 'Para eventos: coordinamos el día y el horario de entrega por WhatsApp.' : 'Llegan listas para calentar. Coordinamos el día y la zona de entrega por WhatsApp.';
  cont.innerHTML = `<div class="qv__grid">
  <div class="qv__media">${mediaHTML(p, 'qv')}</div>
  <div class="qv__body">
    <p class="qv__meta">${esc(nombreCat(p))} · ${esc(nombreTipo(p))}</p>
    <h2 class="qv__nom">${esc(p.nombre)}</h2>
    <p class="qv__precio" data-qv-precio></p>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${p.trae ? `<ul class="qv__trae">${p.trae.map(t => `<li>${ICO.check}<span>${esc(t)}</span></li>`).join('')}</ul>` : ''}
    <fieldset class="qv__ops"><legend>${esc(p.opsTitulo || 'Opción')}</legend><div class="qv__ops-in">${p.ops.map((o, i) => `<label class="chip-op${i === 0 ? ' is-on' : ''}"><input type="radio" name="qvOp" value="${i}"${i === 0 ? ' checked' : ''}><span>${esc(o.v)}</span><small>${formatearPrecio(precioOp(p, i))}</small></label>`).join('')}</div></fieldset>
    <div class="qv__acc"><div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div><button type="button" class="btn btn--cta" data-qv-add>${ICO.carrito}Agregar al carrito</button></div>
    <button type="button" class="btn btn--line" data-qv-buy>Comprar ahora</button>
    <p class="qv__nota">${ICO.fuego}<span>${esc(nota)}</span></p>
    ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También te puede interesar</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="rel" data-quick="${r.id}"><span class="rel__media">${mediaHTML(r, 'mini')}</span><span class="rel__nom">${esc(r.nombre)}</span><span class="rel__precio">Desde ${formatearPrecio(precioDesde(r))}</span></button>`).join('')}</div></div>` : ''}
  </div>
</div>`;
  pintarPrecioQV();
  cont.closest('.qv__panel').scrollTop = 0;
  if (!qv.classList.contains('open')) abrirCapa(qv);
  else qv.querySelector('[data-foco-inicial]')?.focus({ preventScroll: true });
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.set('producto', p.id);
    window.history.replaceState(null, '', u);
  }
}
function pintarPrecioQV() {
  const el = document.querySelector('[data-qv-precio]');
  if (!el || !qvActual) return;
  const { p, op } = qvActual;
  const orig = p.descuento > 0 ? `<s>${formatearPrecio(p.ops[op].precio)}</s>` : '';
  el.innerHTML = `${formatearPrecio(precioOp(p, op))}${orig}`;
}
function cerrarQV(devolverFoco) {
  const qv = document.getElementById('qv');
  if (!qv || !qv.classList.contains('open')) return;
  cerrarCapa(qv, devolverFoco !== false);
  qvActual = null;
  if (PAGINA === 'catalogo') {
    const u = new URL(location.href);
    u.searchParams.delete('producto');
    window.history.replaceState(null, '', u);
  }
}

function initCapas() {
  const qv = document.getElementById('qv');
  qv?.addEventListener('change', e => {
    if (e.target.name !== 'qvOp' || !qvActual) return;
    qvActual.op = Number(e.target.value) || 0;
    qv.querySelectorAll('.chip-op').forEach(l => l.classList.toggle('is-on', !!l.querySelector('input:checked')));
    pintarPrecioQV();
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.matches('[data-step]')) {
      const out = t.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out) out.textContent = Math.min(20, Math.max(1, (parseInt(out.textContent, 10) || 1) + Number(t.dataset.step)));
      return;
    }
    if (t.matches('[data-quick]')) { abrirQV(t.dataset.quick); return; }
    if (t.matches('[data-add], [data-buy]')) {
      const p = getProducto(t.dataset.add || t.dataset.buy);
      if (!p) return;
      const out = t.closest('.pcard')?.querySelector('[data-qty]');
      const qty = parseInt(out?.textContent, 10) || 1;
      Cart.add(p, qty, 0);
      if (out) out.textContent = '1';
      if (t.matches('[data-buy]')) openCartDrawer();
      else showToast(`Listo: ${qty} × ${p.corto} en tu pedido`);
      return;
    }
    if (t.matches('[data-qv-add], [data-qv-buy]') && qvActual) {
      const qty = parseInt(document.querySelector('#qv [data-qty]')?.textContent, 10) || 1;
      const { p, op } = qvActual;
      Cart.add(p, qty, op);
      if (t.matches('[data-qv-buy]')) { cerrarQV(false); openCartDrawer(); }
      else showToast(`Listo: ${qty} × ${p.corto} (${p.ops[op].v}) en tu pedido`);
      return;
    }
    if (t.matches('[data-open-cart]')) { openCartDrawer(); return; }
    if (t.matches('[data-cerrar-cart]')) { cerrarCapa(document.getElementById('cartDrawer')); return; }
    if (t.matches('[data-cerrar-qv]')) { cerrarQV(); return; }
    if (t.matches('[data-linea-step]')) {
      const id = t.dataset.id, op = Number(t.dataset.op) || 0;
      const it = Cart.get().find(i => i.id === id && i.op === op);
      if (!it) return;
      const nueva = it.qty + Number(t.dataset.lineaStep);
      if (nueva < 1) Cart.remove(id, op); else Cart.setQty(id, op, nueva);
      return;
    }
    if (t.matches('[data-linea-quitar]')) { Cart.remove(t.dataset.id, Number(t.dataset.op) || 0); return; }
    if (t.matches('[data-checkout]')) {
      if (!Cart.count()) showToast('Sumá al menos un plato a tu pedido.');
      else showToast('¡Genial! El pago online se activa al pasar la web a producción.');
    }
  });
  document.querySelectorAll('.qv__bd, .drawer__bd').forEach(bd => bd.addEventListener('click', () => {
    if (bd.closest('#qv')) cerrarQV(); else cerrarCapa(bd.closest('.drawer'));
  }));
}

function initNavCats() {
  const params = new URLSearchParams(location.search);
  const activa = PAGINA === 'catalogo' ? (params.get('cat') || '').split(',')[0] : '';
  document.querySelectorAll('[data-nav-cats]').forEach(box => {
    const btn = box.querySelector('.nav-cats__btn');
    const panel = box.querySelector('.nav-cats__panel');
    if (!btn || !panel) return;
    panel.innerHTML = `<ul>${CATEGORIAS.map(c => `<li><a href="${URL_CATALOGO}?cat=${c.id}"${c.id === activa ? ' aria-current="page"' : ''}><span class="nc__nom">${esc(c.nombre)}<small>${Tienda.contar({ cat: [c.id] })}</small></span><span class="nc__baj">${esc(c.bajada)}</span></a></li>`).join('')}</ul><a class="nc__todo" href="${URL_CATALOGO}">Ver todo el menú ${ICO.flecha}</a>`;
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) t = setTimeout(cerrar, 120); });
    box.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); cerrar(); btn.focus(); } });
    document.addEventListener('click', e => { if (!box.contains(e.target) && !panel.hidden) cerrar(); });
  });
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; const header = document.querySelector('.site-header'); (header || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false');
    if (!capasAbiertas.length) document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-cats__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) { nav.removeAttribute('inert'); if (nav.classList.contains('open')) close(); }
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initHomeGrid() {
  const grid = document.querySelector('[data-home-grid]');
  if (!grid) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true, cat: ['viandas', 'packs'] }, orden: 'destacados', limite: Number(grid.dataset.limite) || 6 });
  grid.innerHTML = items.map(p => cardHTML(p)).join('');
}

function initCarta() {
  const cont = document.querySelector('[data-carta]');
  if (!cont) return;
  const tabs = cont.querySelector('[data-carta-tabs]');
  const lista = cont.querySelector('[data-carta-lista]');
  const ver = cont.querySelector('[data-carta-ver]');
  if (!tabs || !lista) return;
  tabs.innerHTML = CATEGORIAS.map((c, i) => `<button type="button" class="tab" data-carta-cat="${c.id}" aria-pressed="${i === 0}">${esc(c.nombre)}<span class="tab__n">${Tienda.contar({ cat: [c.id] })}</span></button>`).join('');
  const pintar = (cat, anim) => {
    const { items } = Tienda.consultar({ filtros: { cat: [cat] }, orden: 'destacados', limite: 8 });
    lista.innerHTML = items.map(p => filaHTML(p)).join('');
    if (ver) ver.href = `${URL_CATALOGO}?cat=${cat}`;
    if (anim) { revelarNuevos(lista); refrescar(); }
  };
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-carta-cat]');
    if (!b || b.getAttribute('aria-pressed') === 'true') return;
    tabs.querySelectorAll('[data-carta-cat]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    pintar(b.dataset.cartaCat, true);
  });
  pintar(CATEGORIAS[0].id, false);
}

function initBandejas() {
  const cont = document.querySelector('[data-bandejas]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { cat: ['bandejas'] }, orden: 'destacados', limite: 4 });
  cont.innerHTML = items.map(p => `<li class="mini">
  <button type="button" class="mini__media" data-quick="${p.id}" aria-label="Ver el detalle de ${esc(p.nombre)}">${mediaHTML(p, 'mini')}</button>
  <div><p class="mini__nom">${esc(p.nombre)}</p><p class="mini__det">${esc(p.ops[0].v)} · ${formatearPrecio(precioOp(p, 0))}</p></div>
  <button type="button" class="mini__add" data-add="${p.id}" aria-label="Agregar ${esc(p.corto)} al carrito">${ICO.mas}</button>
</li>`).join('');
}

const POR_PAGINA = 16;
function initCatalogo() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const valida = (clave, ids) => [...new Set((params.get(clave) || '').split(',').map(s => s.trim()).filter(v => ids.includes(v)))];
  const estado = {
    cat: valida('cat', CATEGORIAS.map(c => c.id)),
    tipo: valida('tipo', TIPOS.map(t => t.id)),
    precio: valida('precio', RANGOS.map(r => r.id)),
    q: (params.get('q') || '').slice(0, 60),
    orden: ORDENES.includes(params.get('orden')) ? params.get('orden') : 'destacados',
  };
  if (MODELO === '2') estado.cat = estado.cat.slice(0, 1);
  let cursor = null;
  const q = document.getElementById('q');
  const orden = document.getElementById('orden');
  const verMas = document.getElementById('verMas');
  const vacio = document.getElementById('catVacio');
  const contador = document.getElementById('catContador');
  const migaCat = document.querySelector('[data-miga-cat]');
  const limpiarBtns = document.querySelectorAll('[data-limpiar]');
  const filtrosDe = () => ({ cat: estado.cat, tipo: estado.tipo, rangos: estado.precio.map(id => RANGOS.find(r => r.id === id)).filter(Boolean) });

  const gruposM1 = {
    cat: CATEGORIAS.map(c => ({ id: c.id, nombre: c.nombre, n: Tienda.contar({ cat: [c.id] }) })),
    tipo: TIPOS.map(t => ({ id: t.id, nombre: t.nombre, n: Tienda.contar({ tipo: [t.id] }) })).filter(t => t.n),
    precio: RANGOS.map(r => ({ id: r.id, nombre: r.nombre, n: Tienda.contar({ rangos: [r] }) })).filter(r => r.n),
  };
  document.querySelectorAll('[data-filtro-grupo]').forEach(box => {
    const g = box.dataset.filtroGrupo;
    box.innerHTML = (gruposM1[g] || []).map(o => `<label class="fcheck"><input type="checkbox" data-f="${g}" value="${o.id}"><span>${esc(o.nombre)}</span><small>${o.n}</small></label>`).join('');
  });
  const tabsCat = document.querySelector('[data-filtro-cats]');
  if (tabsCat) tabsCat.innerHTML = [{ id: '', nombre: 'Todo', n: Tienda.contar({}) }, ...gruposM1.cat].map(o => `<button type="button" class="tab" data-set-cat="${o.id}" aria-pressed="false">${esc(o.nombre)}<span class="tab__n">${o.n}</span></button>`).join('');
  const chipsTipo = document.querySelector('[data-filtro-tipos]');
  if (chipsTipo) chipsTipo.innerHTML = gruposM1.tipo.map(o => `<button type="button" class="chip" data-toggle-tipo="${o.id}" aria-pressed="false">${esc(o.nombre)}</button>`).join('');

  const syncUI = () => {
    document.querySelectorAll('[data-f]').forEach(inp => { inp.checked = (estado[inp.dataset.f] || []).includes(inp.value); });
    tabsCat?.querySelectorAll('[data-set-cat]').forEach(b => b.setAttribute('aria-pressed', String((estado.cat[0] || '') === b.dataset.setCat)));
    chipsTipo?.querySelectorAll('[data-toggle-tipo]').forEach(b => b.setAttribute('aria-pressed', String(estado.tipo.includes(b.dataset.toggleTipo))));
    if (q && q.value !== estado.q) q.value = estado.q;
    if (orden) orden.value = estado.orden;
    const hay = estado.cat.length || estado.tipo.length || estado.precio.length || estado.q;
    limpiarBtns.forEach(b => { b.hidden = !hay; });
    const n = estado.cat.length + estado.tipo.length + estado.precio.length;
    document.querySelectorAll('[data-filtros-n]').forEach(el => { el.textContent = n ? `(${n})` : ''; });
  };
  const syncURL = () => {
    const u = new URL(location.href);
    ['cat', 'tipo', 'precio'].forEach(k => { if (estado[k].length) u.searchParams.set(k, estado[k].join(',')); else u.searchParams.delete(k); });
    if (estado.q) u.searchParams.set('q', estado.q); else u.searchParams.delete('q');
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden); else u.searchParams.delete('orden');
    window.history.replaceState(null, '', u);
  };
  const render = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    const html = res.items.map(p => (MODELO === '2' ? filaHTML(p) : cardHTML(p))).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    cursor = res.cursor;
    if (verMas) verMas.hidden = !cursor;
    const mostrados = grid.children.length;
    if (contador) {
      if (estado.q) contador.textContent = mostrados ? `${mostrados}${cursor ? '+' : ''} ${mostrados === 1 && !cursor ? 'resultado' : 'resultados'} para «${estado.q}»` : '';
      else { const total = Tienda.contar(filtrosDe()); contador.textContent = total ? `${total} ${total === 1 ? 'opción' : 'opciones'}` : ''; }
    }
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    const cat = CATEGORIAS.find(c => c.id === estado.cat[0]);
    if (migaCat) { migaCat.hidden = !(cat && estado.cat.length === 1); migaCat.textContent = cat ? cat.nombre : ''; }
    document.title = cat && estado.cat.length === 1 ? `${cat.nombre} — Menú de Chef Tincho` : 'Menú completo — Chef Tincho: viandas, packs y bandejas';
    syncUI();
    syncURL();
    revelarNuevos(grid);
    refrescar();
  };

  document.addEventListener('change', e => {
    const inp = e.target.closest('[data-f]');
    if (!inp) return;
    const g = inp.dataset.f;
    estado[g] = inp.checked ? [...new Set([...estado[g], inp.value])] : estado[g].filter(v => v !== inp.value);
    render();
  });
  tabsCat?.addEventListener('click', e => {
    const b = e.target.closest('[data-set-cat]');
    if (!b) return;
    estado.cat = b.dataset.setCat ? [b.dataset.setCat] : [];
    render();
  });
  chipsTipo?.addEventListener('click', e => {
    const b = e.target.closest('[data-toggle-tipo]');
    if (!b) return;
    const id = b.dataset.toggleTipo;
    estado.tipo = estado.tipo.includes(id) ? estado.tipo.filter(v => v !== id) : [...estado.tipo, id];
    render();
  });
  let tq = 0;
  q?.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = q.value.trim().slice(0, 60); render(); }, 220); });
  q?.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = q.value.trim().slice(0, 60); render(); });
  orden?.addEventListener('change', () => { estado.orden = ORDENES.includes(orden.value) ? orden.value : 'destacados'; render(); });
  verMas?.addEventListener('click', () => render(true));
  limpiarBtns.forEach(b => b.addEventListener('click', () => { estado.cat = []; estado.tipo = []; estado.precio = []; estado.q = ''; render(); }));
  const toggleF = document.querySelector('[data-filtros-toggle]');
  const filtros = document.getElementById('filtros');
  toggleF?.addEventListener('click', () => {
    const abierto = filtros.classList.toggle('open');
    toggleF.setAttribute('aria-expanded', String(abierto));
    refrescar();
  });
  document.querySelectorAll('[data-lupa]').forEach(a => a.addEventListener('click', e => { if (!q) return; e.preventDefault(); q.focus(); q.scrollIntoView({ block: 'center' }); }));

  render();
  if (params.has('q') && q) setTimeout(() => q.focus({ preventScroll: true }), 60);
  const prod = params.get('producto');
  if (prod && getProducto(prod)) setTimeout(() => abrirQV(prod), 80);
}

function initPackSelector() {
  const box = document.querySelector('[data-pack-selector]');
  if (!box) return;
  const total = box.querySelector('[data-pack-total]');
  const unit = box.querySelector('[data-pack-unit]');
  const add = box.querySelector('[data-pack-add]');
  const wsp = box.querySelector('[data-pack-wsp]');
  const estado = () => ({ p: getProducto(box.querySelector('input[name="packCant"]:checked')?.value), op: Number(box.querySelector('input[name="packMenu"]:checked')?.value) || 0 });
  const pintar = () => {
    const { p, op } = estado();
    box.querySelectorAll('.op-cant, .op-menu').forEach(l => l.classList.toggle('is-on', !!l.querySelector('input:checked')));
    if (!p) return;
    const pr = precioOp(p, op);
    total.textContent = formatearPrecio(pr);
    unit.textContent = `${formatearPrecio(pr / p.pack)} por vianda · ${p.ops[op].v}`;
    if (wsp) wsp.href = linkWsp(`Hola, Chef Tincho! Quiero el ${p.nombre}, menú ${p.ops[op].v}. ¿Coordinamos la entrega?`);
  };
  box.addEventListener('change', pintar);
  add?.addEventListener('click', () => {
    const { p, op } = estado();
    if (!p) return;
    Cart.add(p, 1, op);
    showToast(`Listo: ${p.corto} (${p.ops[op].v}) en tu pedido`);
  });
  pintar();
}

let activarEvento = null;
function initEventos() {
  const sec = document.getElementById('eventos');
  if (!sec) return;
  const tabs = [...sec.querySelectorAll('[role="tab"]')];
  const form = sec.querySelector('[data-cotizador]');
  const servicio = form?.querySelector('[name="servicio"]');
  const tipo = form?.querySelector('[name="tipoEvento"]');
  const fecha = form?.querySelector('[name="fecha"]');
  const invitados = form?.querySelector('[name="invitados"]');
  const notas = form?.querySelector('[name="notas"]');
  const preview = form?.querySelector('[data-cot-preview]');
  const errInv = form?.querySelector('[data-error-invitados]');
  const SERVICIOS = { catering: 'catering para eventos', chef: 'chef a domicilio' };
  if (fecha) {
    const hoy = new Date();
    fecha.min = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
  }
  const fechaTexto = v => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '');
    if (!m) return 'a definir';
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const mensaje = () => {
    const s = SERVICIOS[servicio?.value] || SERVICIOS.catering;
    const n = parseInt(invitados?.value, 10);
    return [
      `Hola, Chef Tincho! Quiero pedir un presupuesto de ${s}.`,
      `• Tipo de evento: ${tipo?.value || 'a definir'}`,
      `• Fecha: ${fechaTexto(fecha?.value)}`,
      `• Invitados: ${n > 0 ? n : 'a definir'}`,
      notas?.value.trim() ? `• Comentarios: ${notas.value.trim()}` : null,
    ].filter(Boolean).join('\n');
  };
  const actualizar = () => { if (preview) preview.textContent = mensaje(); };
  const activar = (id, foco = false) => {
    const tab = tabs.find(t => t.dataset.tab === id);
    if (!tab) return;
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
      if (on && panel) revelarNuevos(panel);
    });
    if (foco) tab.focus();
    if (servicio && servicio.value !== id) { servicio.value = id; actualizar(); }
    refrescar();
  };
  activarEvento = activar;
  tabs.forEach(t => t.addEventListener('click', () => activar(t.dataset.tab)));
  sec.querySelector('[role="tablist"]')?.addEventListener('keydown', e => {
    const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    let j = -1;
    if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = tabs.length - 1;
    if (j < 0) return;
    e.preventDefault();
    activar(tabs[j].dataset.tab, true);
  });
  if (!form) return;
  form.addEventListener('input', () => {
    if (invitados?.getAttribute('aria-invalid') === 'true' && parseInt(invitados.value, 10) > 0) { invitados.removeAttribute('aria-invalid'); if (errInv) errInv.hidden = true; }
    actualizar();
  });
  form.addEventListener('change', e => { if (e.target === servicio) activar(servicio.value); actualizar(); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = parseInt(invitados?.value, 10);
    if (!(n > 0 && n <= 2000)) {
      invitados?.setAttribute('aria-invalid', 'true');
      if (errInv) errInv.hidden = false;
      invitados?.focus();
      return;
    }
    window.open(linkWsp(mensaje()), '_blank', 'noopener');
    showToast('Abrimos WhatsApp con tu consulta lista para enviar.');
  });
  actualizar();
}

function initHash() {
  const ir = h => {
    if (h !== '#catering' && h !== '#chef') return false;
    activarEvento?.(h.slice(1));
    document.getElementById('eventos')?.scrollIntoView({ block: 'start' });
    return true;
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#catering"], a[href="#chef"]');
    if (!a) return;
    e.preventDefault();
    const h = a.getAttribute('href');
    ir(h);
    window.history.replaceState(null, '', h);
  });
  if (location.hash === '#catering' || location.hash === '#chef') {
    activarEvento?.(location.hash.slice(1));
    window.addEventListener('load', () => ir(location.hash), { once: true });
  }
}

function initLeer() {
  const els = document.querySelectorAll('[data-leer]');
  if (!els.length) return;
  els.forEach(el => {
    const palabras = el.textContent.trim().split(/\s+/);
    el.innerHTML = palabras.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  });
  if (reduceMotion) { els.forEach(el => el.querySelectorAll('.w').forEach(w => w.classList.add('on'))); return; }
  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.42)));
      const ws = el.querySelectorAll('.w');
      const n = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle('on', i < n));
    });
  };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
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

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const img = hero.querySelector('[data-hero-img]');
  if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
  tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
    .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
    .from(hero.querySelectorAll('.hero__regla'), { scaleX: 0, duration: 0.9, clearProps: 'transform' }, 0.4)
    .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
    .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
    .from(hero.querySelectorAll('.sello, .hero-badge'), { scale: 0.92, y: 16, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.65);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  const hero = document.querySelector('.hero');
  const img = hero?.querySelector('[data-hero-img]');
  if (!img) return;
  ScrollTrigger.create({
    trigger: hero, start: 'top top', end: 'bottom top',
    onUpdate: s => { img.style.translate = `0 ${(s.progress * 5).toFixed(2)}%`; },
  });
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

initCapas();
initNavCats();
initHomeGrid();
initCarta();
initBandejas();
initCatalogo();
initPackSelector();
initEventos();
initLeer();
initReveals();
initNav();
initFloats();
initModelBarScroll();
initHeroMotion();
initParallax();
initHash();
updateCartUI(false);
