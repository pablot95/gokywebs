const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493583404048';
const MARCA = 'Estética las estrellas';
const POR_PAGINA = 16;
const TOPE_LINEA = 10;
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
  { id: 'faciales', nombre: 'Cuidado facial', corto: 'Facial', bajada: 'Limpieza, sérum y crema', img: 'images/p-serum.webp' },
  { id: 'corporales', nombre: 'Cuidado corporal', corto: 'Corporal', bajada: 'Crema reafirmante y aceite', img: 'images/p-aceite-corporal.webp' },
  { id: 'maquillaje', nombre: 'Maquillaje', corto: 'Maquillaje', bajada: 'Labios, ojos, rostro y pinceles', img: 'images/p-paleta-sombras.webp' },
];
const USOS = [
  { id: 'hidratacion', nombre: 'Hidratación' },
  { id: 'limpieza', nombre: 'Limpieza' },
  { id: 'firmeza', nombre: 'Firmeza' },
  { id: 'color', nombre: 'Color' },
  { id: 'herramientas', nombre: 'Pinceles y accesorios' },
];
const PRECIOS = [
  { id: 'hasta-20', nombre: 'Hasta $20.000', min: null, max: 20000 },
  { id: '20-a-27', nombre: '$20.000 a $27.000', min: 20001, max: 27000 },
  { id: 'mas-27', nombre: 'Más de $27.000', min: 27001, max: null },
];
const ORDENES = [
  { id: 'destacados', nombre: 'Destacados' },
  { id: 'precio-asc', nombre: 'Menor precio' },
  { id: 'precio-desc', nombre: 'Mayor precio' },
  { id: 'nombre', nombre: 'Nombre A-Z' },
];

const PRODUCTOS = [
  { id: 'serum-hidratante', nombre: 'Sérum facial hidratante', cat: 'faciales', usos: ['hidratacion'], medida: '30 ml', precio: 29900, rango: 1,
    img: { src: 'images/p-serum.webp', lado: 900, alt: 'Frasco de sérum con gotero y aro dorado' },
    desc: 'Sérum de textura liviana con gotero, para sumar hidratación a tu rutina de día y de noche.',
    modo: 'Aplicá 3 o 4 gotas sobre el rostro limpio y seco, antes de la crema.', claves: ['serum', 'suero', 'gotero', 'rostro', 'cara'] },
  { id: 'crema-facial', nombre: 'Crema facial nutritiva', cat: 'faciales', usos: ['hidratacion'], medida: '50 g', precio: 27500, rango: 2,
    img: { src: 'images/p-crema-facial.webp', lado: 900, alt: 'Pote de crema facial abierto con la tapa al lado' },
    desc: 'Crema de textura sedosa para el cuidado diario del rostro. Se absorbe sin dejar sensación grasa.',
    modo: 'Usala a la mañana y a la noche, después del sérum.', claves: ['crema', 'hidratante', 'rostro', 'cara', 'pote'] },
  { id: 'gel-limpieza', nombre: 'Gel de limpieza facial', cat: 'faciales', usos: ['limpieza'], medida: '200 ml', precio: 18900, rango: 3,
    img: { src: 'images/p-gel-limpieza.webp', lado: 1000, alt: 'Frasco blanco con dosificador junto a toallas y una piedra' },
    desc: 'Gel suave con dosificador para limpiar el rostro todos los días y retirar el maquillaje.',
    modo: 'Masajeá sobre la piel húmeda y enjuagá con agua tibia.', claves: ['limpiador', 'jabon', 'espuma', 'desmaquillante', 'cara'] },
  { id: 'crema-corporal', nombre: 'Crema corporal reafirmante', cat: 'corporales', usos: ['firmeza', 'hidratacion'], medida: '200 ml', precio: 22400, rango: 4,
    img: { src: 'images/p-crema-corporal.webp', lado: 1000, alt: 'Pomo de crema corporal color crema parado junto a una piedra' },
    desc: 'Crema corporal en pomo para acompañar en casa los tratamientos de cabina.',
    modo: 'Aplicala con masajes circulares en abdomen, piernas y brazos.', claves: ['cuerpo', 'pomo', 'body', 'reafirmante'] },
  { id: 'aceite-corporal', nombre: 'Aceite corporal', cat: 'corporales', usos: ['hidratacion'], medida: '120 ml', precio: 19800, rango: 5,
    img: { src: 'images/p-aceite-corporal.webp', lado: 1000, alt: 'Botella transparente de aceite corporal dorado' },
    desc: 'Aceite liviano para después de la ducha, que deja la piel suave y con brillo natural.',
    modo: 'Distribuí unas gotas sobre la piel todavía húmeda.', claves: ['aceite', 'oil', 'cuerpo', 'masajes'] },
  { id: 'labial-cremoso', nombre: 'Labial cremoso', cat: 'maquillaje', usos: ['color'], medida: '3,5 g', precio: 14500, rango: 6,
    tonos: [{ id: 'rosa-nude', nombre: 'Rosa nude', color: '#C98B84' }, { id: 'malva', nombre: 'Malva', color: '#A0646E' }, { id: 'terracota', nombre: 'Terracota', color: '#B0634A' }],
    img: { src: 'images/p-labial.webp', lado: 1000, alt: 'Labial rosa nude abierto junto a su tapa' },
    desc: 'Labial de acabado cremoso y color pleno, en tres tonos para todos los días.',
    modo: 'Aplicalo desde el centro de los labios hacia las comisuras.', claves: ['labios', 'rouge', 'pintalabios', 'lapiz labial'] },
  { id: 'paleta-sombras', nombre: 'Paleta de sombras · 4 tonos tierra', cat: 'maquillaje', usos: ['color'], medida: '4 × 1,5 g', precio: 24900, rango: 7,
    img: { src: 'images/p-paleta-sombras.webp', lado: 1000, alt: 'Paleta de cuatro sombras en tonos tierra con espejo' },
    desc: 'Cuatro sombras en tonos tierra, mate y satinadas, con espejo en la tapa.',
    modo: 'Usá el tono claro en todo el párpado y los oscuros para dar profundidad.', claves: ['ojos', 'sombra', 'parpados', 'maquillaje de ojos'] },
  { id: 'polvo-compacto', nombre: 'Polvo compacto con espejo', cat: 'maquillaje', usos: ['color'], medida: '10 g', precio: 21300, rango: 8,
    tonos: [{ id: 'claro', nombre: 'Claro', color: '#E8CDB0' }, { id: 'medio', nombre: 'Medio', color: '#CFA67F' }],
    img: { src: 'images/p-polvo-compacto.webp', lado: 1000, alt: 'Polvo compacto abierto con espejo, en estuche dorado' },
    desc: 'Polvo de acabado natural para sellar el maquillaje y retocar durante el día.',
    modo: 'Aplicalo con pincel o borla en la zona T.', claves: ['polvo', 'compacto', 'base', 'rostro'] },
  { id: 'set-pinceles', nombre: 'Set de 9 pinceles con estuche', cat: 'maquillaje', usos: ['herramientas'], medida: '9 pinceles', precio: 32000, rango: 9,
    img: { src: 'images/p-set-pinceles.webp', lado: 1000, alt: 'Nueve pinceles de maquillaje junto a su estuche enrollable' },
    desc: 'Nueve pinceles de cerdas suaves para rostro y ojos, con estuche enrollable para guardarlos.',
    modo: 'Lavalos una vez por semana con agua tibia y jabón neutro.', claves: ['brochas', 'pincel', 'accesorios', 'herramientas'] },
];

const AREAS = [
  { id: 'faciales', nombre: 'Faciales', items: [
    ['Limpieza facial con extracción de puntos negros', 'Higiene profunda, extracción y mascarilla según tu tipo de piel.'],
    ['Tratamiento para la flacidez', 'Protocolo con aparatología para trabajar la firmeza de rostro y cuello.'],
    ['Exosomas', 'Aplicación de exosomas para acompañar la renovación de la piel.'],
    ['Plasma frío', 'Sesiones con equipo de plasma frío. En la consulta vemos si es para tu piel.'],
    ['Dermaplaning', 'Exfoliación con bisturí que retira células muertas y vello fino.'],
    ['Microneedling', 'Microagujas que estimulan la piel, combinadas con activos.'],
    ['Hilos tensores', 'Hilos que dan sostén a zonas del rostro. Se evalúan en una consulta previa.'],
    ['BB glow', 'Pigmento semipermanente que unifica el tono de la piel.'],
  ] },
  { id: 'corporales', nombre: 'Corporales', items: [
    ['Tratamientos reductores', 'Aparatología y masajes por zona, en un plan de sesiones.'],
    ['Tratamiento para la celulitis', 'Protocolo por zona para trabajar la textura de la piel.'],
    ['Camuflaje de estrías', 'Técnica de pigmentación que disimula las estrías.'],
    ['Bronceado Cannelle', 'Bronceado sin sol con productos Cannelle.'],
    ['Parafina para manos', 'Baño de parafina tibia para hidratar y suavizar las manos.'],
  ] },
  { id: 'depilacion', nombre: 'Depilación definitiva', items: [
    ['Depilación definitiva', 'Por zona, con aparatología de última generación. Consultá por la zona que necesites.', ['Rostro', 'Axilas', 'Brazos', 'Piernas', 'Cavado', 'Espalda']],
  ] },
  { id: 'mirada', nombre: 'Pestañas, cejas y labios', items: [
    ['Lifting de pestañas coreano', 'Curva y elevación de tus pestañas naturales, sin extensiones.'],
    ['Perfilado de cejas', 'Diseño y perfilado según la forma de tu rostro.'],
    ['BB lips', 'Color semipermanente que le da un tono natural a los labios.'],
  ] },
];

const nombreDe = (arr, id) => arr.find(x => x.id === id)?.nombre || '';
const catDe = id => CATEGORIAS.find(c => c.id === id) || CATEGORIAS[0];

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

function crearTienda(coleccion, { tope = 100 } = {}) {
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const visibles = coleccion.filter(p => p.visible !== false);
  const indice = new Map(visibles.map(p => [p.id, norm([
    p.nombre, p.desc, p.medida, catDe(p.cat).nombre, catDe(p.cat).corto,
    ...(p.usos || []).map(u => nombreDe(USOS, u)), ...(p.tonos || []).map(t => t.nombre), ...(p.claves || []),
  ].join(' '))]));
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);

  function coincide(p, f) {
    const cat = lista(f.cat), uso = lista(f.uso), excluir = lista(f.excluir);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (uso.length && !uso.some(u => (p.usos || []).includes(u))) return false;
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
const tonoDe = (p, v) => (p?.tonos ? p.tonos.find(t => t.id === v) || null : null);
const varValida = (p, v) => (p?.tonos ? (tonoDe(p, v) ? v : p.tonos[0].id) : 'U');
const detalleVar = (p, v) => (p?.tonos ? `Tono ${(tonoDe(p, v) || p.tonos[0]).nombre}` : p?.medida || '');
const wspHref = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

const Cart = {
  KEY: 'esteticalasestrellas_cart',
  get() { try { const v = JSON.parse(localStorage.getItem(this.KEY)); return Array.isArray(v) ? v : []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch { } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v = 'U', qty = 1) {
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
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  carrito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  flecha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  wsp: '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
  estrella: '<svg class="estrella" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0Z"/></svg>',
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

const usosTxt = p => (p.usos || []).map(u => nombreDe(USOS, u)).join(' · ');
const stepperHTML = (n = 1, extra = '') => `<div class="stepper${extra}" data-stepper><button type="button" data-paso="-1" aria-label="Restar uno">${ICO.menos}</button><output data-qty>${n}</output><button type="button" data-paso="1" aria-label="Sumar uno">${ICO.mas}</button></div>`;
function botonSumar(p, txt = 'Agregar') {
  if (p.tonos) return `<button type="button" class="btn btn--cta btn--sm prod-add" data-qv="${esc(p.id)}" aria-label="Elegir el tono de ${esc(p.nombre)}">${ICO.mas}<span>Elegir tono</span></button>`;
  return `<button type="button" class="btn btn--cta btn--sm prod-add" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.carrito}<span>${txt}</span></button>`;
}
const detalleCard = p => (p.tonos ? `${p.tonos.length} tonos · ${p.medida}` : `${p.medida} · ${usosTxt(p)}`);
const swatchesHTML = p => (p.tonos ? `<span class="swatches" aria-hidden="true">${p.tonos.map(t => `<i style="background:${esc(t.color)}"></i>`).join('')}</span>` : '');

function cardHTML(p, estilo = 'tocador', animar = true, compacta = false) {
  const anim = animar ? ` data-animate="${estilo === 'vitrina' && compacta ? 'der' : 'subir'}" style="opacity:0;transform:${estilo === 'vitrina' && compacta ? 'translateX(48px)' : 'translateY(36px)'}"` : '';
  const cat = catDe(p.cat);
  const media = `<div class="prod__media"><button type="button" class="prod__ver" data-qv="${esc(p.id)}" aria-label="Ver el detalle de ${esc(p.nombre)}"><img class="prod__img" src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}" decoding="async"></button><span class="prod__cat">${esc(cat.corto)}</span></div>`;
  const nombre = `<h3 class="prod__nombre"><button type="button" data-qv="${esc(p.id)}"><span>${esc(p.nombre)}</span></button></h3>`;
  const precio = `<p class="prod__precio precio">${formatearPrecio(p.precio)}</p>`;
  if (compacta) {
    return `<article class="prod prod--${estilo} prod--compacta" data-id="${esc(p.id)}"${anim}>
  ${media}
  <div class="prod__info">
    ${nombre}
    <p class="prod__detalle">${swatchesHTML(p)}${esc(detalleCard(p))}</p>
    <div class="prod__fila">${precio}${p.tonos
      ? `<button type="button" class="prod__mas" data-qv="${esc(p.id)}" aria-label="Elegir el tono de ${esc(p.nombre)}">${ICO.mas}</button>`
      : `<button type="button" class="prod__mas" data-sumar="${esc(p.id)}" aria-label="Agregar ${esc(p.nombre)} al carrito">${ICO.mas}</button>`}</div>
  </div>
</article>`;
  }
  return `<article class="prod prod--${estilo}" data-id="${esc(p.id)}"${anim}>
  ${media}
  <div class="prod__info">
    ${nombre}
    <p class="prod__detalle">${swatchesHTML(p)}${esc(detalleCard(p))}</p>
    ${precio}
    <div class="prod-actions">${p.tonos ? '' : stepperHTML(1)}${botonSumar(p)}</div>
    <button type="button" class="prod__comprar" ${p.tonos ? `data-qv="${esc(p.id)}"` : `data-comprar="${esc(p.id)}"`}>Comprar ahora ${ICO.flecha}</button>
  </div>
</article>`;
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
    return p ? `• ${i.qty} × ${p.nombre} (${detalleVar(p, i.v)}) — ${formatearPrecio(p.precio * i.qty)}` : '';
  }).filter(Boolean);
  return `Hola! Quiero hacer este pedido en ${MARCA}:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`;
}

function lineaHTML(i, k) {
  const p = getProducto(i.id);
  if (!p) return '';
  const key = `${esc(p.id)}|${esc(i.v)}`;
  return `<li class="linea" style="transition-delay:${Math.min(k * 0.05, 0.3)}s">
  <img src="${esc(p.img.src)}" alt="" width="${p.img.lado}" height="${p.img.lado}">
  <div class="linea__info">
    <p class="linea__nombre">${esc(p.nombre)}</p>
    <p class="linea__var">${esc(detalleVar(p, i.v))} · ${formatearPrecio(p.precio)}</p>
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
  const det = p.tonos ? ` (${detalleVar(p, varValida(p, v))})` : '';
  showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${det} al carrito`);
  if (boton && !reduceMotion) { boton.classList.remove('sumado'); void boton.offsetWidth; boton.classList.add('sumado'); }
  return n;
}
const tonoElegido = cont => cont?.querySelector('[data-tono][aria-pressed="true"]')?.dataset.tono || null;
const cantidadElegida = cont => parseInt(cont?.querySelector('[data-qty]')?.textContent, 10) || 1;

function initCompras() {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finalizar]')) { showToast('¡Genial! El pago online se activa al pasar la web a producción.'); return; }
    if (e.target.closest('#quickView')) return;
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
      const n = sumar(s ? s.dataset.sumar : c.dataset.comprar, null, cantidadElegida(cont), b);
      const out = cont?.querySelector('[data-qty]');
      if (out) out.textContent = '1';
      if (c && n) window.abrirCarrito?.(c);
      return;
    }
    const qv = e.target.closest('[data-qv]');
    if (qv) {
      e.preventDefault();
      abrirVistaRapida(qv.dataset.qv, { previo: qv });
    }
  });
}

let qvEstado = null;
function abrirVistaRapida(id, { reemplazar = false, previo = document.activeElement } = {}) {
  const modal = document.getElementById('quickView');
  const p = getProducto(id);
  if (!modal || !p) return;
  const body = modal.querySelector('[data-qv-body]');
  qvEstado = { id: p.id };
  let rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
  if (rel.length < 3) rel = rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items);
  const v = varValida(p, null);
  const tonos = p.tonos ? `<div class="tonos" role="group" aria-label="Tono">${p.tonos.map(t => `<button type="button" class="tono" data-tono="${esc(t.id)}" aria-pressed="${t.id === v}"><i style="background:${esc(t.color)}"></i><span>${esc(t.nombre)}</span></button>`).join('')}</div>` : '';
  body.innerHTML = `<div class="qv__grid" data-id="${esc(p.id)}">
  <figure class="qv__foto"><img src="${esc(p.img.src)}" alt="${esc(p.img.alt)}" width="${p.img.lado}" height="${p.img.lado}"></figure>
  <div class="qv__info">
    <p class="qv__meta"><span class="prod__cat">${esc(catDe(p.cat).corto)}</span><span>${esc(usosTxt(p))}</span></p>
    <h2>${esc(p.nombre)}</h2>
    <p class="qv__medida">${esc(p.medida)}</p>
    <p class="precio precio--qv">${formatearPrecio(p.precio)}</p>
    <p class="qv__desc">${esc(p.desc)}</p>
    <p class="qv__modo"><b>Cómo se usa.</b> ${esc(p.modo)}</p>
    ${tonos}
    <div class="qv__acciones">${stepperHTML(1)}<button type="button" class="btn btn--ghost" data-qv-agregar>${ICO.mas}Agregar al carrito</button><button type="button" class="btn btn--cta" data-qv-comprar>Comprar ahora</button></div>
    <a class="qv__wsp" href="${esc(wspHref(`Hola! Quiero consultar por «${p.nombre}» de ${MARCA}.`))}" target="_blank" rel="noopener">${ICO.wsp}<span>Consultar por WhatsApp</span></a>
  </div>
</div>
${rel.length ? `<div class="qv__rel"><h3>También te puede interesar</h3><ul>${rel.map(r => `<li><button type="button" data-qv-rel="${esc(r.id)}"><img src="${esc(r.img.src)}" alt="" width="${r.img.lado}" height="${r.img.lado}"><span>${esc(r.nombre)}</span><small>${formatearPrecio(r.precio)}</small></button></li>`).join('')}</ul></div>` : ''}`;
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
    const tono = e.target.closest('[data-tono]');
    if (tono) { cont.querySelectorAll('[data-tono]').forEach(b => b.setAttribute('aria-pressed', String(b === tono))); return; }
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
      const v = tonoElegido(cont);
      const n = Cart.add(p, v, cantidadElegida(cont));
      cont.querySelector('[data-qty]').textContent = '1';
      if (comprar) { const capa = cerrarCapa(modal, { devolverFoco: false }); window.abrirCarrito?.(capa?.previo); }
      else showToast(`Sumaste ${n > 1 ? `${n} × ` : ''}«${p.nombre}»${p.tonos ? ` (${detalleVar(p, varValida(p, v))})` : ''} al carrito`);
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

function tratHTML(t, area, animar, k = 0) {
  const [nombre, desc, zonas] = t;
  const anim = animar ? ' data-animate="subir" style="opacity:0;transform:translateY(28px)"' : '';
  const msg = `Hola! Quiero consultar por ${nombre.toLowerCase().startsWith('tratamiento') ? 'el ' + nombre.charAt(0).toLowerCase() + nombre.slice(1) : nombre} en ${MARCA}.`;
  return `<li class="trat${animar ? '' : ' trat--nueva'}"${anim || ` style="--i:${k}"`}>
  <span class="trat__marca" aria-hidden="true">${ICO.estrella}</span>
  <div class="trat__txt">
    <h3>${esc(nombre)}</h3>
    <p>${esc(desc)}</p>
    ${zonas ? `<p class="trat__zonas"><span>Zonas:</span> ${zonas.map(z => `<b>${esc(z)}</b>`).join('')}</p>` : ''}
  </div>
  <a class="trat__cta" href="${esc(wspHref(msg))}" target="_blank" rel="noopener" aria-label="Consultar por ${esc(nombre)} por WhatsApp"><span>Consultar</span>${ICO.flecha}</a>
</li>`;
}

function initCarta() {
  const lista = document.querySelector('[data-carta-lista]');
  const tabs = [...document.querySelectorAll('.carta-tab')];
  if (!lista || !tabs.length) return;
  AREAS.forEach(a => document.querySelectorAll(`[data-area-n="${a.id}"]`).forEach(el => { el.textContent = a.items.length; }));
  const pintar = (id, animar) => {
    const area = AREAS.find(a => a.id === id) || AREAS[0];
    tabs.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.area === area.id)));
    lista.dataset.area = area.id;
    lista.innerHTML = area.items.map((t, k) => tratHTML(t, area, animar, k)).join('');
    if (!animar && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const inicial = new URLSearchParams(location.search).get('area');
  pintar(AREAS.some(a => a.id === inicial) ? inicial : AREAS[0].id, true);
  tabs.forEach(b => b.addEventListener('click', () => { if (b.getAttribute('aria-pressed') !== 'true') pintar(b.dataset.area, false); }));
  document.querySelectorAll('[data-ir-area]').forEach(a => a.addEventListener('click', () => {
    if (!document.getElementById('tratamientos')) return;
    const id = a.dataset.irArea;
    if (lista.dataset.area !== id) pintar(id, false);
  }));
}

function mensajeTurno({ trat = '', franja = '', nombre = '' } = {}) {
  const n = String(nombre).trim().replace(/\s+/g, ' ').slice(0, 40);
  const t = AREAS.some(a => a.items.some(x => x[0] === trat)) ? trat : '';
  const f = ['por la mañana', 'por la tarde'].includes(franja) ? franja : '';
  return `Hola!${n ? ` Soy ${n}.` : ''} Quiero consultar por un turno${t ? ` de ${t}` : ''} en ${MARCA}${f ? `, ${f}` : ''}.${t ? '' : ' ¿Me ayudan a elegir el tratamiento?'}`;
}

function initTurno() {
  document.querySelectorAll('[data-turno]').forEach(form => {
    const sel = form.querySelector('[data-turno-trat]');
    const vista = form.querySelector('[data-turno-vista]');
    const boton = form.querySelector('[data-turno-wsp]');
    const nombre = form.querySelector('[name="nombre"]');
    sel.innerHTML = '<option value="">Todavía no sé, quiero que me asesoren</option>' + AREAS.map(a => `<optgroup label="${esc(a.nombre)}">${a.items.map(t => `<option value="${esc(t[0])}">${esc(t[0])}</option>`).join('')}</optgroup>`).join('');
    const armar = () => {
      const msg = mensajeTurno({ trat: sel.value, franja: form.querySelector('input[type="radio"]:checked')?.value || '', nombre: nombre.value });
      vista.textContent = `«${msg}»`;
      boton.href = wspHref(msg);
    };
    form.addEventListener('input', armar);
    form.addEventListener('change', armar);
    armar();
  });
}

function initMapa() {
  const el = document.querySelector('[data-mapa]');
  if (!el || typeof L === 'undefined') return;
  const centro = L.latLng(-33.1236, -64.3493);
  const mapa = L.map(el, { center: centro, zoom: 13, scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, zoomControl: true, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(mapa);
  window.addEventListener('load', () => mapa.invalidateSize());
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
  const otros = ['uso', 'precio', 'q'].some(k => params.get(k));
  document.querySelectorAll('[data-cats-menu]').forEach(ul => {
    ul.innerHTML = CATEGORIAS.map(c => {
      const r = Tienda.resumen({ cat: c.id });
      const cur = PAGINA === 'catalogo' && cat.length === 1 && cat[0] === c.id && !otros;
      return `<li><a href="${CATALOGO_URL}?cat=${c.id}"${cur ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="900" height="900"><span><b>${esc(c.nombre)}</b><small>${esc(c.bajada)}</small></span><em>${r.n} · desde ${formatearPrecio(r.desde)}</em></a></li>`;
    }).join('');
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
    const estilo = cont.dataset.estilo || 'tocador';
    const compacta = estilo === 'vitrina';
    const sec = cont.closest('section');
    const verTodo = sec?.querySelector('[data-tab-ver]');
    const todos = productosPorIds(ids).slice(0, 8);
    const pintar = (tab = '', animar = true) => {
      let prods = todos;
      if (tab) { const [k, v] = tab.split(':'); prods = todos.filter(p => p[k] === v); }
      cont.innerHTML = prods.map(p => cardHTML(p, estilo, animar, compacta)).join('');
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

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < 6) return;
    if (!moved) { moved = true; vp.classList.add('dragging'); try { vp.setPointerCapture?.(pointerId); } catch { } }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch { }
      vp.classList.remove('dragging');
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
}
function initRail() {
  const vp = document.querySelector('[data-rail]');
  if (!vp) return;
  const track = vp.querySelector('.rail-track');
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  initRailDrag(vp);
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 280) + 20;
  const sync = () => {
    const inicio = parseFloat(getComputedStyle(track).paddingInlineStart) || 0;
    if (prev) prev.disabled = vp.scrollLeft <= Math.min(inicio, 8) + 2;
    if (next) next.disabled = vp.scrollLeft >= (vp.scrollWidth - vp.clientWidth) - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
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
  const estilo = MODELO === '2' ? 'vitrina' : 'tocador';
  const params = new URLSearchParams(location.search);
  const valida = (arr, lista) => [...new Set((arr || '').split(',').map(s => s.trim()).filter(id => lista.some(x => x.id === id)))];
  const GRUPOS = { cat: CATEGORIAS, uso: USOS };
  const e = {
    cat: valida(params.get('cat'), CATEGORIAS),
    uso: valida(params.get('uso'), USOS),
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
    if (solo.length !== 1) return '';
    if (e.cat.length === 1) return nombreDe(CATEGORIAS, e.cat[0]);
    if (e.uso.length === 1) return nombreDe(USOS, e.uso[0]);
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
    if (titulo) titulo.textContent = t || 'Cosméticos faciales, corporales y maquillaje';
    if (miga) { miga.hidden = !t; miga.textContent = t; }
    if (migaSep) migaSep.hidden = !t;
    document.title = `${t || 'Cosméticos'} — ${MARCA}`;
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
  if (reduceMotion || typeof gsap === 'undefined') return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const desde = (sel, vars, pos) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, pos); };
  desde('[data-hero-img]', { scale: 1.08, duration: 1.8 }, 0);
  desde('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.9 }, 0.1);
  desde('h1', { y: 34, opacity: 0, duration: 1.2 }, 0.2);
  desde('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.42);
  desde('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.56);
  desde('.hero-eyebrow .estrella', { rotate: -90, scale: 0.92, duration: 1.4, clearProps: 'transform' }, 0.1);
  desde('.hero__nota', { opacity: 0, duration: 0.8 }, 0.8);
}

[
  initPreviews, initCarta, initMenuCategorias, initCatalogo, initReveals, initHeroMotion, initNav, initDrawer,
  initVistaRapida, initCompras, initRail, initTurno, initMapa, initFloats, initModelBarScroll,
].forEach(fn => { try { fn(); } catch (err) { console.error(err); } });
try { Cart.sync(); } catch (err) { console.error(err); }
updateCartBadge();
