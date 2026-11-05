const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5491162317003';
const MARCA = 'Ideasquetomanforma';
const POR_PAGINA = 16;
const TOPE_LINEA = 20;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const CATALOGO_URL = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const HOME_URL = MODELO === '2' ? 'modelo-2.html' : './';

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
  { id: 'llaveros', nombre: 'Llaveros', bajada: 'Lisos o con tu nombre, tu logo o una fecha.', img: 'images/p-llavero-negro.webp' },
  { id: 'repuestos', nombre: 'Repuestos', bajada: 'Engranajes, perillas y piezas que ya no se consiguen.', img: 'images/p-engranaje-blanco.webp' },
  { id: 'juguetes', nombre: 'Juguetes', bajada: 'Articulados y de encastre, para jugar de verdad.', img: 'images/p-cubo-multicolor.webp' },
  { id: 'deco', nombre: 'Deco home', bajada: 'Floreros, macetas y soportes para cada rincón.', img: 'images/p-maceta-natural.webp' },
];
const COLORES = [
  { id: 'amarillo', nombre: 'Amarillo', hex: '#E6CF4B' },
  { id: 'verde-agua', nombre: 'Verde agua', hex: '#2E9F8D' },
  { id: 'negro', nombre: 'Negro', hex: '#2A2925' },
  { id: 'blanco', nombre: 'Blanco', hex: '#F3F2EC' },
  { id: 'natural', nombre: 'Natural', hex: '#D8C39F' },
  { id: 'multicolor', nombre: 'Multicolor', hex: 'conic-gradient(#C8473C 0 25%, #E3C74A 0 50%, #3F8B55 0 75%, #3561A8 0)' },
];
const PRECIOS = [
  { id: 'hasta-8', nombre: 'Hasta $8.000', min: null, max: 8000 },
  { id: '8-a-15', nombre: '$8.000 a $15.000', min: 8001, max: 15000 },
  { id: 'mas-15', nombre: 'Más de $15.000', min: 15001, max: null },
];
const EXTRAS = [{ id: 'personalizable', nombre: 'Se puede personalizar' }];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];

const PRODUCTOS = [
  { id: 'florero-espiral', nombre: 'Florero espiral', cat: 'deco', foto: 'florero', colores: ['amarillo', 'blanco', 'verde-agua', 'natural'], precio: 17900, rango: 1,
    ficha: ['PLA', '18 cm de alto', 'Capa de 0,2 mm'],
    desc: 'Florero de paredes en espiral que juega con la luz de la ventana. Ideal para flores secas, o para flores frescas con un tubo de vidrio adentro.',
    claves: ['jarron', 'florero', 'vaso', 'flores', 'espiral', 'decoracion'] },
  { id: 'dino-articulado', nombre: 'T-rex articulado', cat: 'juguetes', foto: 'dino', colores: ['verde-agua', 'amarillo', 'negro'], precio: 15900, rango: 2,
    ficha: ['PLA', '22 cm de largo', 'Sale articulado'],
    desc: 'Sale de la impresora ya articulado: mueve la cola, el cuello, las patas y la mandíbula, sin piezas para armar ni pegamento.',
    claves: ['dinosaurio', 'dino', 'rex', 'articulado', 'juguete', 'flexi', 'regalo'] },
  { id: 'llavero-placa', nombre: 'Llavero placa para personalizar', cat: 'llaveros', foto: 'llavero', colores: ['negro', 'amarillo', 'blanco', 'verde-agua'], precio: 6500, rango: 3, personalizable: true,
    ficha: ['PLA', '5 × 5 cm', 'Argolla metálica'],
    desc: 'Placa cuadrada con argolla metálica. Lisa, o con un nombre, una inicial, una fecha o un logo en relieve.',
    claves: ['llavero', 'llaveros', 'nombre', 'logo', 'argolla', 'regalo', 'inicial'] },
  { id: 'maceta-geometrica', nombre: 'Maceta geométrica', cat: 'deco', foto: 'maceta', colores: ['natural', 'blanco', 'negro', 'verde-agua'], precio: 11900, rango: 4,
    ficha: ['PLA', '10 cm de diámetro', 'Caras facetadas'],
    desc: 'Maceta de caras facetadas para suculentas y cactus. Queda bien sola o armando un grupo en distintos colores.',
    claves: ['maceta', 'suculenta', 'cactus', 'planta', 'facetada', 'macetero'] },
  { id: 'perilla-mueble', nombre: 'Perilla para mueble', cat: 'repuestos', foto: 'perilla', colores: ['amarillo', 'blanco', 'negro', 'verde-agua'], precio: 3900, rango: 5, personalizable: true,
    ficha: ['PLA', '3,5 cm de diámetro', 'Precio por unidad'],
    desc: 'Perilla redonda para cajones, alacenas y puertas de placard: para reemplazar la que se rompió o para renovar el mueble entero.',
    claves: ['perilla', 'tirador', 'manija', 'cajon', 'mueble', 'pomo', 'placard'] },
  { id: 'cubo-encastre', nombre: 'Cubo de encastre de 4 colores', cat: 'juguetes', foto: 'cubo', colores: ['multicolor'], precio: 12500, rango: 6,
    ficha: ['PLA', '6 × 6 cm', '4 piezas'],
    desc: 'Rompecabezas de cuatro piezas que se encastran hasta formar un cubo. Un desafío corto para chicos y grandes.',
    claves: ['cubo', 'rompecabezas', 'puzzle', 'encastre', 'ingenio', 'juego'] },
  { id: 'soporte-celular', nombre: 'Soporte para celular', cat: 'deco', foto: 'soporte', colores: ['negro', 'blanco', 'amarillo'], precio: 7900, rango: 7,
    ficha: ['PLA', '8 × 7 cm', 'Para cualquier celular'],
    desc: 'Sostiene el celular parado o acostado: para ver videos, seguir una receta mientras cocinás o hacer videollamadas.',
    claves: ['soporte', 'celular', 'telefono', 'escritorio', 'apoya', 'atril'] },
  { id: 'engranaje-recto', nombre: 'Engranaje recto de 16 dientes', cat: 'repuestos', foto: 'engranaje', colores: ['blanco'], precio: 8900, rango: 8, personalizable: true,
    ficha: ['PLA', '4 cm de diámetro', 'Eje de 8 mm'],
    desc: 'Repuesto para mecanismos chicos. Si el tuyo tiene otra medida, pasanos la pieza rota o sus medidas y lo imprimimos igual.',
    claves: ['engranaje', 'pinon', 'rueda dentada', 'repuesto', 'mecanismo', 'pieza'] },
  { id: 'clip-cables', nombre: 'Organizador de cables · pack x 4', cat: 'repuestos', foto: 'clip', colores: ['negro', 'blanco', 'amarillo'], precio: 5200, rango: 9,
    ficha: ['PLA', '3 × 3 cm', '4 unidades'],
    desc: 'Clips con base para ordenar los cables del escritorio, de la mesa de luz o del cargador del auto.',
    claves: ['cable', 'cables', 'organizador', 'clip', 'escritorio', 'cargador', 'orden'] },
  { id: 'pack-llaveros-logo', nombre: 'Pack de 10 llaveros con tu logo', cat: 'llaveros', foto: 'llavero', colores: ['amarillo', 'negro', 'blanco', 'verde-agua'], precio: 52000, rango: 10, personalizable: true,
    ficha: ['PLA', '5 × 5 cm', '10 unidades'],
    desc: 'Diez llaveros iguales con el logo de tu marca, tu local o tu evento en relieve. Antes de imprimir te pasamos el diseño para que lo apruebes.',
    claves: ['emprendimiento', 'local', 'marca', 'souvenir', 'evento', 'pack', 'logo', 'empresa'] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];
const colorDe = id => COLORES.find(c => c.id === id) || COLORES[0];
const fondoColor = id => colorDe(id).hex;

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, catDe(p.cat).nombre, ...(p.ficha || []), ...(p.colores || []).map(c => nombreDe(COLORES, c)),
    p.personalizable ? 'personalizado personalizable a medida' : '', ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), color = lista(f.color), extra = lista(f.extra), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (color.length && !color.some(c => (p.colores || []).includes(c))) return false;
    if (extra.includes('personalizable') && !p.personalizable) return false;
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
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
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
const varValida = (p, v) => ((p?.colores || []).includes(v) ? v : p?.colores?.[0] || 'U');
const imgDe = (p, v) => `images/p-${p.foto}-${varValida(p, v)}.webp`;
const altDe = (p, v) => {
  const c = varValida(p, v);
  return c === 'multicolor' ? `${p.nombre} impreso en 3D en cuatro colores` : `${p.nombre} impreso en 3D en filamento ${nombreDe(COLORES, c).toLowerCase()}`;
};
const detalleVar = (p, v) => `Color ${nombreDe(COLORES, varValida(p, v)).toLowerCase()}`;
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'ideasquetomanforma_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = null, qty = 1) {
    if (!producto) return 0;
    const vv = varValida(producto, v);
    const items = this.get();
    const n = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    const existing = items.find(i => i.id === producto.id && i.v === vv);
    if (existing) existing.qty = Math.min(existing.qty + n, TOPE_LINEA);
    else items.push({ id: producto.id, v: vv, qty: n });
    this.save(items);
    return n;
  },
  setQty(id, v, qty) {
    const items = this.get();
    const it = items.find(i => i.id === id && i.v === v);
    if (!it) return;
    it.qty = Math.max(1, Math.min(parseInt(qty, 10) || 1, TOPE_LINEA));
    this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.v === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + p.precio * i.qty : s; }, 0); },
  sync() {
    const limpias = [];
    let changed = false;
    this.get().forEach(i => {
      const p = i && getProducto(i.id);
      if (!p) { changed = true; return; }
      const v = varValida(p, i.v);
      const qty = Math.max(1, Math.min(parseInt(i.qty, 10) || 1, TOPE_LINEA));
      const previa = limpias.find(x => x.id === p.id && x.v === v);
      if (previa) { previa.qty = Math.min(previa.qty + qty, TOPE_LINEA); changed = true; return; }
      if (v !== i.v || qty !== i.qty) changed = true;
      limpias.push({ id: p.id, v, qty });
    });
    if (changed) this.save(limpias);
  },
};

const ICO = {
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
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
function abrirCapa(el, { alCerrar, previo = document.activeElement } = {}) {
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
  if (i < 0) return null;
  const [capa] = capas.splice(i, 1);
  document.removeEventListener('keydown', capa.onKey);
  el.classList.remove('open');
  setTimeout(() => { if (!el.classList.contains('open')) el.hidden = true; }, reduceMotion ? 0 : 400);
  if (!capas.length && !document.getElementById('mainNav')?.classList.contains('open') && !document.getElementById('filtros')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  capa.alCerrar?.();
  if (devolverFoco && capa.previo && document.contains(capa.previo)) capa.previo.focus({ preventScroll: true });
  return capa;
}

const stepperHTML = (n = 1) => `<div class="stepper" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
function swatchesHTML(p, v) {
  const sel = varValida(p, v);
  if ((p.colores || []).length < 2) {
    return `<span class="swatches swatches--uno"><i class="dot" style="--c:${fondoColor(sel)}" aria-hidden="true"></i>${esc(nombreDe(COLORES, sel))}</span>`;
  }
  return `<span class="swatches" role="group" aria-label="Color de ${esc(p.nombre)}">${p.colores.map(c => `<button type="button" class="swatch" data-color="${esc(c)}" aria-pressed="${c === sel}" aria-label="${esc(nombreDe(COLORES, c))}" title="${esc(nombreDe(COLORES, c))}"><i style="--c:${fondoColor(c)}"></i></button>`).join('')}</span>`;
}

function cardHTML(p, estilo = 'etiqueta', animar = true, compacta = false, ancha = false) {
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(44px)"' : '';
  const v = varValida(p, null);
  const cat = catDe(p.cat);
  const lado = 1000;
  const mas = compacta ? `<button type="button" class="prod__mas" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>` : '';
  const media = `<div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(imgDe(p, v))}" alt="${esc(altDe(p, v))}" width="${lado}" height="${lado}" decoding="async"></button>${p.personalizable ? '<span class="prod__badge">Personalizable</span>' : ''}${swatchesHTML(p, v)}${mas}</div>`;
  const nombre = `<h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}">${esc(p.nombre)}</button></h3>`;
  const precio = `<p class="prod__precio precio">${formatearPrecio(p.precio)}</p>`;
  const ficha = `<p class="prod__ficha">${esc(p.ficha.join(' · '))}</p>`;
  const clase = `prod prod--${estilo}${compacta ? ' prod--compacta' : ''}${ancha ? ' prod--ancha' : ''}`;
  if (compacta) {
    return `<article class="${clase}" data-id="${esc(p.id)}" data-v="${esc(v)}"${anim}>
  ${media}
  <div class="prod__info">
    <div class="prod__fila">${nombre}${precio}</div>
    ${ficha}
  </div>
</article>`;
  }
  const cabeza = estilo === 'vitrina'
    ? `<div class="prod__fila">${nombre}${precio}</div>${ficha}`
    : `<p class="prod__cat">${esc(cat.nombre)}</p>${nombre}${ficha}${precio}`;
  return `<article class="${clase}" data-id="${esc(p.id)}" data-v="${esc(v)}"${anim}>
  ${media}
  <div class="prod__info">
    ${cabeza}
    <div class="prod__pie">
      <div class="prod-actions">${stepperHTML(1)}<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>Agregar</span></button></div>
      <button type="button" class="prod__comprar" data-comprar="${esc(p.id)}">Comprar ahora ${ICO.flecha}</button>
    </div>
  </div>
</article>`;
}

function cambiarFoto(img, src, alt) {
  if (!img || img.getAttribute('src') === src) return;
  if (reduceMotion) { img.src = src; img.alt = alt; return; }
  img.classList.add('cambiando');
  const pre = new Image();
  pre.onload = pre.onerror = () => { img.src = src; img.alt = alt; requestAnimationFrame(() => img.classList.remove('cambiando')); };
  pre.src = src;
}

function updateCartBadge() {
  const n = Cart.count();
  const total = formatearPrecio(Cart.total());
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
  document.querySelectorAll('[data-cart-label]').forEach(el => { el.setAttribute('aria-label', n ? `Abrir el carrito, ${plural(n, 'producto', 'productos')}, ${total}` : 'Abrir el carrito'); });
}
document.addEventListener('cart:updated', updateCartBadge);

function textoPedido() {
  const lineas = Cart.get().map(i => {
    const p = getProducto(i.id);
    return p ? `• ${i.qty} × ${p.nombre} (${detalleVar(p, i.v).toLowerCase()}) — ${formatearPrecio(p.precio * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(imgDe(p, i.v))}" alt="" width="1000" height="1000">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var"><i class="dot" style="--c:${fondoColor(varValida(p, i.v))}" aria-hidden="true"></i>${esc(detalleVar(p, i.v))} · ${formatearPrecio(p.precio)}</p>
    <div class="linea__fila">
      <div class="stepper stepper--sm"><button type="button" data-linea-paso="-1" data-key="${key}" aria-label="Restar uno de ${esc(p.nombre)}"${i.qty <= 1 ? ' disabled' : ''}>${ICO.menos}</button><output>${i.qty}</output><button type="button" data-linea-paso="1" data-key="${key}" aria-label="Sumar uno de ${esc(p.nombre)}"${i.qty >= TOPE_LINEA ? ' disabled' : ''}>${ICO.mas}</button></div>
      <p class="linea__precio">${formatearPrecio(p.precio * i.qty)}</p>
    </div>
  </div>
  <button type="button" class="linea__quitar" data-quitar="${key}" aria-label="Quitar ${esc(p.nombre)}">${ICO.x}</button>
</li>`;
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
    cuenta.textContent = n ? `· ${plural(n, 'producto', 'productos')}` : '';
    vacio.hidden = items.length > 0;
    foot.hidden = items.length === 0;
    lista.hidden = items.length === 0;
    lista.innerHTML = items.map((i, k) => lineaHTML(i, k)).join('');
    total.textContent = formatearPrecio(Cart.total());
    if (wsp) wsp.href = wspHref(textoPedido());
  };
  lista.addEventListener('click', e => {
    const paso = e.target.closest('[data-linea-paso]');
    if (paso) {
      const [id, v] = paso.dataset.key.split('|');
      const it = Cart.get().find(x => x.id === id && x.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(paso.dataset.lineaPaso));
      lista.querySelector(`[data-linea-paso="${paso.dataset.lineaPaso}"][data-key="${CSS.escape(paso.dataset.key)}"]:not([disabled])`)?.focus();
      return;
    }
    const q = e.target.closest('[data-quitar]');
    if (!q) return;
    const [id, v] = q.dataset.quitar.split('|');
    const p = getProducto(id);
    Cart.remove(id, v);
    if (p) showToast(`Sacaste «${p.nombre}» del carrito`);
    drawer.querySelector('.drawer__head button')?.focus();
  });
  drawer.querySelectorAll('[data-drawer-cerrar]').forEach(b => b.addEventListener('click', () => cerrarCapa(drawer)));
  document.addEventListener('cart:updated', pintar);
  window.abrirCarrito = previo => { pintar(); abrirCapa(drawer, previo ? { previo } : {}); setTimeout(() => drawer.querySelector('.drawer__head button')?.focus(), 60); };
  document.querySelectorAll('[data-abrir-carrito]').forEach(b => b.addEventListener('click', () => window.abrirCarrito(b)));
  pintar();
}

function sumar(id, v, qty, boton = null) {
  const p = getProducto(id);
  if (!p) return 0;
  const n = Cart.add(p, v, qty);
  if (!n) return 0;
  const det = p.colores.length > 1 ? ` (${detalleVar(p, v).toLowerCase()})` : '';
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${det} al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
    const sw = e.target.closest('.swatch[data-color]');
    if (sw) {
      const card = sw.closest('[data-id]');
      const p = card && getProducto(card.dataset.id);
      if (!p) return;
      const v = varValida(p, sw.dataset.color);
      card.dataset.v = v;
      card.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', String(b === sw)));
      cambiarFoto(card.querySelector('.prod__img'), imgDe(p, v), altDe(p, v));
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = paso.closest('[data-stepper]')?.querySelector('[data-qty]');
      if (out) out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const s = e.target.closest('[data-sumar]');
    const c = e.target.closest('[data-comprar]');
    if (s || c) {
      e.preventDefault();
      const b = s || c;
      const cont = b.closest('[data-id]');
      const n = sumar(s ? s.dataset.sumar : c.dataset.comprar, cont?.dataset.v || null, cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out) out.textContent = '1';
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv, color: qv.closest('[data-id]')?.dataset.v || null });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement, color = null } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  const v = varValida(p, color);
  qvEstado = { id: p.id, v };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const colores = p.colores.length > 1
    ? `<p class="qv__colores-t">Color de filamento: <span data-qv-color>${esc(nombreDe(COLORES, v))}</span></p><div class="colores" role="group" aria-label="Color de filamento">${p.colores.map(c => `<button type="button" class="color-btn" data-color="${esc(c)}" aria-pressed="${c === v}"><i style="--c:${fondoColor(c)}"></i><span>${esc(nombreDe(COLORES, c))}</span></button>`).join('')}</div>`
    : `<p class="qv__colores-t">Color: <span>${esc(nombreDe(COLORES, v))}</span></p>`;
  const persTxt = p.personalizable
    ? `<p class="qv__pers">Este se puede personalizar con un nombre, un logo o tus medidas. <a href="${HOME_URL}?idea=${encodeURIComponent(p.nombre)}#personalizados">Contanos qué querés</a>.</p>`
    : '';
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <figure class="qv__foto"><img src="${esc(imgDe(p, v))}" alt="${esc(altDe(p, v))}" width="1000" height="1000"></figure>
  <div class="qv__info">
    <p class="prod__cat">${esc(catDe(p.cat).nombre)}</p>
    <h2>${esc(p.nombre)}</h2>
    <ul class="qv__ficha">${p.ficha.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    <p class="precio precio--qv">${formatearPrecio(p.precio)}</p>
    <p class="qv__desc">${esc(p.desc)}</p>
    ${colores}
    ${persTxt}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al carrito</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(imgDe(r, null))}" alt="" width="1000" height="1000"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
  modal.querySelector('.qv__panel').scrollTop = 0;
  ponerJsonLdProducto(p);
  if (!reemplazar && !capas.some(c => c.el === modal)) {
    abrirCapa(modal, { previo, alCerrar: () => { if (PAGINA === 'catalogo') setParam('producto', null); } });
    setTimeout(() => modal.querySelector('.qv__close')?.focus(), 60);
  }
  if (PAGINA === 'catalogo') setParam('producto', p.id);
}

function initVistaRapida() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.addEventListener('click', e => {
    if (e.target.closest('[data-qv-cerrar]')) { cerrarCapa(modal); return; }
    const p = qvEstado && getProducto(qvEstado.id);
    if (!p) return;
    const cont = modal.querySelector('.qv__grid');
    const col = e.target.closest('.color-btn[data-color]');
    if (col) {
      const v = varValida(p, col.dataset.color);
      qvEstado.v = v;
      cont.querySelectorAll('.color-btn').forEach(b => b.setAttribute('aria-pressed', String(b === col)));
      const t = cont.querySelector('[data-qv-color]');
      if (t) t.textContent = nombreDe(COLORES, v);
      cambiarFoto(cont.querySelector('.qv__foto img'), imgDe(p, v), altDe(p, v));
      return;
    }
    const paso = e.target.closest('[data-paso]');
    if (paso) {
      const out = cont.querySelector('[data-qty]');
      out.textContent = Math.max(1, Math.min((parseInt(out.textContent, 10) || 1) + Number(paso.dataset.paso), TOPE_LINEA));
      return;
    }
    const rel = e.target.closest('[data-qv-rel]');
    if (rel) { abrirVistaRapida(rel.dataset.qvRel, { reemplazar: true }); modal.querySelector('.qv__close')?.focus(); return; }
    const agregar = e.target.closest('[data-qv-agregar]');
    const comprar = e.target.closest('[data-qv-comprar]');
    if (agregar || comprar) {
      const n = Cart.add(p, qvEstado.v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${p.colores.length > 1 ? ` (${detalleVar(p, qvEstado.v).toLowerCase()})` : ''} al carrito`);
    }
  });
}

function ponerJsonLdProducto(p) {
  let s = document.getElementById('ld-producto');
  if (!s) { s = document.createElement('script'); s.type = 'application/ld+json'; s.id = 'ld-producto'; document.head.appendChild(s); }
  s.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, description: p.desc,
    image: new URL(imgDe(p, null), location.href).href, brand: { '@type': 'Brand', name: MARCA }, material: 'PLA',
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

const TIPO_POR_CAT = { llaveros: 'un llavero con nombre o logo', repuestos: 'un repuesto a medida', juguetes: 'un juguete o una figura', deco: 'algo de deco para mi casa' };
function mensajePedido({ tipo = '', idea = '', medida = '', cantidad = 1, color = '', nombre = '' } = {}) {
  const limpio = (s, n) => String(s || '').trim().replace(/\s+/g, ' ').slice(0, n);
  const t = limpio(tipo, 60) || 'un trabajo personalizado';
  const i = limpio(idea, 400);
  const m = limpio(medida, 40);
  const n = limpio(nombre, 40);
  const cant = Math.max(1, Math.min(parseInt(cantidad, 10) || 1, 500));
  const c = COLORES.some(x => x.id === color && x.id !== 'multicolor') ? nombreDe(COLORES, color).toLowerCase() : '';
  const partes = [`Hola!${n ? ` Soy ${n}.` : ''} Quiero consultar por ${t} en ${MARCA}.`];
  if (i) partes.push(`La idea: ${i}`);
  const datos = [];
  if (cant > 1) datos.push(`cantidad: ${cant}`);
  if (m) datos.push(`medida aproximada: ${m}`);
  datos.push(c ? `color: ${c}` : 'el color lo vemos después');
  partes.push(datos.join(' · ').replace(/^./, x => x.toUpperCase()) + '.');
  return partes.join('\n');
}

function initPedido() {
  document.querySelectorAll('[data-pedido]').forEach(form => {
    const idea = form.querySelector('[name="idea"]');
    const err = form.querySelector('[data-pedido-error]');
    const vista = form.querySelector('[data-pedido-msg]');
    const boton = form.querySelector('[data-pedido-wsp]');
    const datos = () => ({
      tipo: form.querySelector('input[name="tipo"]:checked')?.value || '',
      idea: idea.value,
      medida: form.querySelector('[name="medida"]').value,
      cantidad: form.querySelector('[name="cantidad"]').value,
      color: form.querySelector('input[name="color"]:checked')?.value || '',
      nombre: form.querySelector('[name="nombre"]').value,
    });
    const armar = () => {
      const msg = mensajePedido(datos());
      vista.textContent = msg;
      boton.href = wspHref(msg);
      if (idea.value.trim()) { idea.removeAttribute('aria-invalid'); err.hidden = true; }
    };
    form.addEventListener('input', armar);
    form.addEventListener('change', armar);
    boton.addEventListener('click', e => {
      if (idea.value.trim().length >= 3) return;
      e.preventDefault();
      idea.setAttribute('aria-invalid', 'true');
      err.hidden = false;
      idea.focus();
    });
    const pedida = (new URLSearchParams(location.search).get('idea') || '').trim().slice(0, 120);
    if (pedida) {
      const prod = PRODUCTOS.find(p => p.nombre === pedida);
      const tipo = prod ? TIPO_POR_CAT[prod.cat] : 'otra idea';
      const chip = form.querySelector(`input[name="tipo"][value="${CSS.escape(tipo)}"]`);
      if (chip) chip.checked = true;
      idea.value = prod ? `Quiero «${prod.nombre}» personalizado: ` : pedida;
    }
    armar();
  });
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
  const otros = ['color', 'precio', 'extra', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="1000" height="1000"><span><b>${esc(c.nombre)}</b><small>${plural(r.n, 'producto', 'productos')} · desde ${formatearPrecio(r.desde)}</small></span></a></li>`;
    }).join('');
  });
  document.querySelectorAll('[data-cat-resumen]').forEach(el => {
    const r = Tienda.resumen({ cat: el.dataset.catResumen });
    el.textContent = `${plural(r.n, 'producto', 'productos')} · desde ${formatearPrecio(r.desde)}`;
  });
  document.querySelectorAll('[data-cat-desde]').forEach(el => {
    el.textContent = `Desde ${formatearPrecio(Tienda.resumen({ cat: el.dataset.catDesde }).desde)}`;
  });
  const desktop = window.matchMedia('(min-width: 1025px)');
  const hover = window.matchMedia('(hover: hover) and (min-width: 1025px)');
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

function productosPorIds(ids) {
  const res = Tienda.consultar({ filtros: { ids }, limite: Math.min(ids.length, 12) });
  const orden = new Map(ids.map((id, k) => [id, k]));
  return res.items.sort((a, b) => orden.get(a.id) - orden.get(b.id));
}
function initPreviews() {
  document.querySelectorAll('[data-preview]').forEach(cont => {
    const ids = (cont.getAttribute('data-preview') || '').split(',').map(s => s.trim()).filter(Boolean);
    const estilo = cont.dataset.estilo || 'etiqueta';
    const compacta = estilo === 'vitrina';
    const limite = Math.min(parseInt(cont.dataset.limite, 10) || 8, 8);
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const todos = productosPorIds(ids);
    const pintar = (tab = '', animar = true) => {
      let prods = todos;
      if (tab) { const [k, v] = tab.split(':'); prods = todos.filter(p => p[k] === v); }
      prods = prods.slice(0, limite);
      cont.innerHTML = prods.map((p, k) => cardHTML(p, estilo, animar, compacta, compacta && k === 0 && !tab)).join('');
      if (verTodo) {
        const [k, v] = tab ? tab.split(':') : [];
        verTodo.href = tab ? `${CATALOGO_URL}?${k}=${v}` : CATALOGO_URL;
      }
    };
    pintar();
    const tabs = sec?.querySelectorAll('[data-tab]') || [];
    tabs.forEach(b => b.addEventListener('click', () => {
      if (b.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      pintar(b.dataset.tab);
      revelarNuevos(cont);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
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
  const pedirIdea = document.querySelector('[data-pedir-idea]');
  const vacioWsp = document.querySelector('[data-vacio-wsp]');
  const estilo = MODELO === '2' ? 'vitrina' : 'etiqueta';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const COLORES_F = COLORES.filter(c => PRODUCTOS.some(p => p.colores.includes(c.id)));
  const GRUPOS = { cat: CATEGORIAS, color: COLORES_F, extra: EXTRAS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    color: valida(params.get('color'), COLORES_F),
    extra: valida(params.get('extra'), EXTRAS),
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
  const opcion = (tipo, grupo, item, marcado, n) => `<label class="opcion${n ? '' : ' is-cero'}"><input type="${tipo}" data-f="${grupo}" value="${esc(item.id)}"${tipo === 'radio' ? ` name="f-${grupo}"` : ''}${marcado ? ' checked' : ''}>${grupo === 'color' ? `<i class="dot" style="--c:${fondoColor(item.id)}" aria-hidden="true"></i>` : ''}<span>${esc(item.nombre)}</span><small>${n}</small></label>`;
  function pintarFiltros() {
    Object.entries(GRUPOS).forEach(([k, lista]) => {
      panel.querySelector(`[data-f-${k}]`).innerHTML = lista.map(it => opcion('checkbox', k, it, e[k].includes(it.id), Tienda.contar({ ...filtros(k), [k]: it.id }))).join('');
    });
    panel.querySelector('[data-f-precio]').innerHTML = [{ id: '', nombre: 'Todos los precios', min: null, max: null }, ...PRECIOS].map(pr => opcion('radio', 'precio', pr, e.precio === pr.id, Tienda.contar({ ...filtros('precio'), precioMin: pr.min, precioMax: pr.max }))).join('');
  }
  function tituloActual() {
    const solo = Object.keys(GRUPOS).filter(k => e[k].length);
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.color.length === 1) return `En ${nombreDe(COLORES, e.color[0]).toLowerCase()}`;
    if (e.extra.length === 1) return 'Para personalizar';
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
    if (titulo) titulo.textContent = t || 'Toda la tienda';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Tienda'} — ${MARCA}`;
  }
  function sincronizarUrl() {
    Object.keys(GRUPOS).forEach(k => setParam(k, e[k]));
    setParam('precio', e.precio); setParam('q', e.q);
    setParam('orden', e.orden === 'destacados' ? '' : e.orden);
  }
  function pintarVacio() {
    const q = e.q;
    if (pedirIdea) {
      pedirIdea.href = `${HOME_URL}?idea=${encodeURIComponent(q || 'una pieza a medida')}#personalizados`;
      pedirIdea.querySelector('span').textContent = q ? `Pedir «${q}» a medida` : 'Pedir una pieza a medida';
    }
    if (vacioWsp) vacioWsp.href = wspHref(q ? `Hola! Busqué «${q}» en la tienda de ${MARCA} y no lo encontré. ¿Me lo pueden imprimir?` : `Hola! Vengo de la tienda de ${MARCA} y quiero consultar por un trabajo personalizado.`);
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
    if (!mostrados) pintarVacio();
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  const fotos = hero.querySelectorAll('.hero-foto');
  if (fotos.length) tl.fromTo(fotos, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'steps(12)', stagger: 0.18, clearProps: 'clipPath' }, 0);
  desde('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 36, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-tag', { y: 12, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'transform,opacity' }, 0.9);
  desde('.sello', { rotate: -90, scale: 0.92, opacity: 0, duration: 1.3, clearProps: 'transform,opacity' }, 0.7);
  desde('.ficha-hero', { y: 26, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, 0.75);
  desde('.hero__nota', { opacity: 0, duration: 0.8 }, 0.9);
}

[
  initPreviews, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initNav, initDrawer,
  initVistaRapida, initCompras, initPedido, initFloats, initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); } catch (err) { console.error(err); }
updateCartBadge();
